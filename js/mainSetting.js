/**
 * @module MainSetting
 * @description  主程式
 * @author Wei-Jie Li
 * @createDate 2020-05-21
 */
import * as echarts from '../lib/echarts';
//從npm套件中import
// import * as echarts from 'echarts/core';
// import {
//     TitleComponent,
//     TooltipComponent,
//     LegendComponent,
//     ToolboxComponent
// } from 'echarts/components';
// import {
//     GraphChart
// } from 'echarts/charts';
// import {
//     CanvasRenderer
// } from 'echarts/renderers';

// echarts.use(
//     [TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer, ToolboxComponent]
// );
import '../css/index.css';
import $ from 'jquery/dist/jquery';
window.jQuery = window.$ = $; //定義jqurey
// export for others scripts to use
import { keywordItemAppend, keywordCleanUp } from './keywordCleaner.js';
import { searchKeyword, changeMaxlevel } from './searchFunction.js';
import { silderInit, sliderBar } from './sliderbarSetting.js';
import { data, option } from './chartSetting';
import { listGenerator } from './listGenerator';
import {autocomplete} from './searchSuggest';
// import dps from 'dbpedia-sparql-client';
// import { layoutCalculator } from "./graphologyLayoutSystem.js";
$('.sidebar').hide(); //在圖還沒形成之前要先將左邊的slider隱藏
const Chart = echarts.init(document.getElementById('main'), null, {
	renderer: 'canvas' //could be svg, but may have performance problems
	// 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
	// 设置这两个值后 left/right/top/bottom/width/height 无效。
	// width: 1700,
	// height: 800 //有置中問題
});
Chart.showLoading('default'); //轉圈圈~~
var start = new Date().getTime();
console.log('data:');
console.log(data);
Chart.hideLoading(); //跑好後關圈圈~~~
$('.sidebar').show(); //圖形顯示後再出現slider
var End = new Date().getTime();
console.log(End - start + 'ms');
if (dataType === 1) {
	option.series[0].edgeLabel.show = false;
	option.series[0].edgeSymbol = [];
	option.series[0].edgeLabel.formatter = function(param) {
		return param.data.value;
	};
	$('.lineSelected').hide();
	$('#kModel').hide();
	$('.current_relation').hide();
} else if (dataType === 2) {
	option.series[0].edgeLabel.formatter = function(param) {
		return param.data.name;
	};
	option.series[0].itemStyle.label.formatter = function(param) {
		return param.name;
	};
	$('.common_show_value').hide();
	$('.word_strength').hide();
}
/**
 * 儲存max_level slider的現值
 * @typedef {(number|string)}
 */
var routeFloor = 'All';
let allLine = data.category.map(function(item, index, array) {
	return item.name;
});
allLine = Array.from(new Set(allLine))
var keywordCollection = [],
	viewResult;
window.onresize = () => {
	Chart.resize();
};
autocomplete(document.getElementById("keyword_search_field"), [data.all_nodes, allLine]);
// EventListener
$('#keyword_search_field').keyup((e) => {
	keyword_search(e);
});
$('#keyword_search_button').on('click', keyword_search);

/**
 * 搜尋功能前處理
 * @param {event} e - 觸發搜尋的事件 
 */
function keyword_search(e) {
	if (e.which === 13 || e.type === 'click') {
		//點搜尋或按ENTER
		let keyword = $('#keyword_search_field').val();
		keyword = keyword.toLowerCase();
		keyword = keyword.replace(' and ', '&');
		keyword = keyword.replace(' or ', '|');
		var keywordSearchType = $('#kClass').val();
		if (dataType === 1) var keywordModel = 'node';
		else var keywordModel = $('#kModel').val();
		let names = [];
		let namess = [];
		if (keyword.includes('|'))
			names = keyword.split('|'); //拆解or
		else names.push(keyword);
		for (let item of names) {
			//拆到剩下單一名詞的陣列
			if (item.includes('&')) {
				item = item.split('&');
				item.forEach((t) => {
					namess.push(t);
				});
			} else namess.push(item);
		}
		if (keywordModel === 'node')
			for (const item of namess) {
				//檢查點
				if (!data.all_nodes.includes(item)) {
					throw alert(`Error1 : 找不到關鍵字:${keyword}`);
				}
			}
		else
			for (const item of namess) {
				//檢查線
				if (!allLine.includes(item)) {
					throw alert(`Error1 : 找不到關鍵字:${keyword}`);
				}
			}
		start = new Date().getTime();
		let test = keywordItemAppend(keyword, keywordSearchType, keywordModel);
		if (test === 0) keywordFliter();
	}
}
/**
 * 做搜尋的init並檢查node是否有在data內，並執行搜尋程式
 */
export function keywordFliter() {
	keywordCollection = keywordCleanUp();
	console.log(keywordCollection);
	// routeFloor = 'All';
	if (keywordCollection.length === 0) resetChart();
	else {
		viewResult = searchKeyword(keywordCollection, 'All');
		if (routeFloor != 'All' && viewResult.routeHash.includes(routeFloor)) {
			viewResult = changeMaxlevel(keywordCollection, routeFloor);
		} else if (!viewResult.routeHash.includes(routeFloor)) routeFloor = 'All';
		if (routeFloor != 'All') var value = routeFloor;
		else var value = viewResult.routeHash.length;
		viewDataChange();
		$(`.slider_item > #max_level`).slider({
			min: 0,
			max: viewResult.routeHash.length, //最大階層數
			step: 1,
			value: value, //current option setting value
			disable: false,
			range: 'min'
		});
		$(`.slider_item > input[id=max_level]`).val(routeFloor);
		$('.max_level').show();
	}
}
/**
 * 改變畫面的內容的函式
 */
function viewDataChange() {
	option.series[0].categories = viewResult.category;
	option.series[0].links = viewResult.links;
	option.series[0].nodes = viewResult.nodes;
	event_setOption_function();
	var End1 = new Date().getTime();
	console.log(End1 - start + 'ms');
}
// Chart.on('legendselectchanged', (category_select) => {
//圖例的觸發事件
// });
/**
 * 初始化資料集
 */
function resetChart() {
	let collect = [];
	//刪除完全數清空或是砍了第一層
	option.series[0].categories = data.category.filter((category) => {
		// return the category that show property is true
		if (category.show == true) {
			collect.push(category.source, category.target);
			return category;
		}
	});
	option.series[0].links = option.series[0].categories;
	collect = Array.from(new Set(collect));
	option.series[0].nodes = data.nodes.filter((node) => {
		node.itemStyle.color = userColors[node.gp];
		return collect.includes(node.name);
	});
	event_setOption_function(true);
}
/**
 * 篩選改變會呼叫此函式去針對該條件顯示內容
 * @param {number}} ui_value - 篩選的階層數值
 */
function max_Level(ui_value) {
	if (ui_value === viewResult.routeHash.length) routeFloor = 'All';
	else routeFloor = viewResult.routeHash[ui_value];
	$(`.slider_item > input[id=max_level]`).val(routeFloor);
	viewResult = changeMaxlevel(keywordCollection, routeFloor);
	viewDataChange();
}

// the involve function that will read the jquery_slider_setting in Main_setting.js, then create the jquery slider
/**
 * 程式啟動時最先執行的函式
 */
$(() => {
	$('.max_level').hide();
	silderInit();
	document.querySelector('.alone').onclick = function(e) {
		sliderBar('All');
		event_setOption_function();
	};
	$('.slider_slider').slider({
		slide: function(e, ui) {
			if (e.target.id === 'max_level') max_Level(ui.value);
			else sliderBar(e, ui);
			event_setOption_function(false);
		}
	});
	event_setOption_function();
	End = new Date().getTime();
	console.log(End - start + 'ms');
});
// The function to render the data to canvas after set all option finish
/**
 * 此程式會依照現在設定重新渲染畫面
 * @param {boolean} render - 值為ture時完全重新渲染，值為false時指更動資料集，須依情況適時調整  
 */
export function event_setOption_function(render = true) {
	if (viewResult == undefined) listGenerator(option, undefined);
	else listGenerator(option, viewResult.route);
	if ($('#Cselecter').val() !== '') sliderBar('All');
	// layoutCalculator(option);
	// positionCalculator();
	edgeFilter();
	// nodeTypeChange();
	Chart.setOption(option, render);
}
/**
 * 當調色盤選擇了新的顏色，會呼叫此函式去更動資料集
 * @param {string} name - 要被替換顏色的元素
 * @param {string} color - 新的顏色
 * @param {string} id - node or line
 */
export function lineColorChanger(name, color, id) {
	document.cookie = `${name}=${color}; max-age=2592000; path=/`;
	if (id === 'node') {
		var gp = groupName.indexOf(name);
		userColors[gp] = color;
		data.nodes.forEach((node) => {
			if (node.gp === gp) {
				node.itemStyle.color = color;
			}
		});
		option.series[0].nodes.forEach((node) => {
			if (node.gp === gp) {
				node.itemStyle.color = color;
			}
		});
	} else {
		data.category.forEach((category) => {
			if (category.name === name) {
				category.lineStyle.color = color;
			}
		});
		option.series[0].categories.forEach((category) => {
			if (category.name === name) {
				category.lineStyle.color = color;
			}
		});
		option.series[0].links.forEach((category) => {
			if (category.name === name) {
				category.lineStyle.color = color;
			}
		});
	}
	event_setOption_function(false);
}
/**
 * 雙擊圖表上的元素會開啟新視窗顯示文本中的相關資訊
 */
Chart.on('dblclick', (e) => {
	// console.log(e);
	if (bookId.indexOf('_') == -1 && e.componentType !== 'title') {
		console.log(bookId, e.data.source, e.data.target, e.data.name);
		if (e.data.source == undefined && e.data.target == undefined) searchBookUnit(bookId, e.data.name);
		else searchBookAssociation(bookId, e.data.source, e.data.target, e.data.name);
	}
	

	function searchBookAssociation(bid, key1, key2, relation) {
		var associationQuery = '"' + key1 + '" AND "' + key2 + '"';
		// http://dh.ascdc.sinica.edu.tw/member/text/segementRelationDetails.jsp
		$.get(
			window.location.origin + '/member/text/segementRelationDetails.jsp',
			{
				bid: bid,
				searchKey: associationQuery,
				pages: 1,
				isStart: '1',
				relation: relation
			},
			function(data) {
				//$('#layout_main').html(data);
				var w = window.open('about:blank', key1 + key2, 'width=800,height=600');
				w.document.write(data);
				w.document.close();
			}
		);
	}
	function searchBookUnit(bid, associationKey) {
		//alert(bid);
		var associationQuery = '';
		associationQuery = '"' + associationKey + '"';
		//$('#searchKey').val(associationKey);
		$.get(
			window.location.origin + '/member/text/segementDetails.jsp',
			{
				only_show_authority: $('#only_show_authority').val(),
				show_info: $('#show_info').val(),
				pageNums: $('#pageNums').val(),
				bookID: bid,
				bid: bid,
				searchKey: associationQuery,
				ckDic: $('#DicCK').prop('checked'),
				pages: 1,
				isStart: '1'
			},
			function(data) {
				//$('#layout_main').html(data);
				var w = window.open('about:blank', associationKey, 'width=800,height=600');
				w.document.write(data);
				w.document.close();
			}
		);
	}
});
/**
 * 點擊圖表上的元素會去dbpidia取得相關的資料
 */
 Chart.on('click', (e) => {
	// console.log(e.data.name);
	var url = "http://dbpedia.org/sparql";
	const query = `SELECT DISTINCT ?Concept WHERE {[] a ?Concept} LIMIT 10`;
	var queryUrl = encodeURI( url+"?query="+query+"&format=json" );
    $.ajax({
        dataType: "json",  
        url: queryUrl,
        success: function( _data ) {
			console.log(_data)
            console.log(_data.results.bindings);
            // for ( var i in results ) {
            //     var res = results[i].abstract.value;
            //     alert(res);
            // }
        }
    });
});
/**
 * 點兩下標題可以修改圖表標題
 */
Chart.on('dblclick', (params) => {
	if (params.componentType === 'title') {
		bookName = prompt('請填入標題名稱', bookName);
		if (bookName !== null) option.title.text = bookName;
		event_setOption_function(false);
	}
});
/**
 * 當遇到同關係的兩個關係轉成雙箭頭的關係
 */
function edgeFilter() {
	option.series[0].links.forEach(function(link, index, array) {
		if (link.bilateral == 'delete') {
			option.series[0].links.splice(index, 1);
		}
		if (link.bilateral == 'true') {
			link.symbol = 'arrow';
			link.symbolSize = arrowSize;
		}
	});
}

// function nodeTypeChange(){
// 	let target = option.series[0].links.map(function(item, index, array) {
// 		return item.target;
// 	});
// 	let source = option.series[0].links.map(function(item, index, array) {
// 		return item.source;
// 	});
// 		option.series[0].nodes.forEach(item =>{
// 		if(item.itemStyle.color == "red"){

// 			}
// 		else if(source.includes(item.name) && target.includes(item.name)){
// 			item.symbol = "circle"
// 			item.itemStyle.color = "#955539";
// 		}
// 		else if(target.includes(item.name)){
// 			item.symbol = "rect"
// 			item.itemStyle.color = '#4c8dae';
// 		}
// 		else if(source.includes(item.name)){
// 			item.symbol = "roundRect"
// 			item.itemStyle.color = "#789262";
// 		}
// 		else if(!source.includes(item.name) && !target.includes(item.name)){
// 			item.symbol = "circle"
// 			item.itemStyle.color = "#ceb888";
// 		}
// 	});
// }
