/**
 * @file Main_setting
 * @author Wei-Jie Li
 * @createDate 2020-05-21
 */
// import * as echarts from '../lib/echarts.min.js';
// import * as echarts from '../lib/echarts';
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent
} from 'echarts/components';
import {
    GraphChart
} from 'echarts/charts';
import {
    CanvasRenderer
} from 'echarts/renderers';

echarts.use(
    [TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer, ToolboxComponent]
);
import '../css/index.css';
import $ from 'jquery/dist/jquery';
window.jQuery = window.$ = $;
// export for others scripts to use
import { keywordItemAppend, keywords, keywordCleanUp } from "./keywordCleaner.js";
import { searchKeyword, changeMaxlevel } from "./searchFunction.js";
import { silderInit, sliderBar } from "./sliderbarSetting.js";
import { data, option } from "./chartSetting";
import { listGenerator } from "./listGenerator";
// import { layoutCalculator } from "./graphologyLayoutSystem.js";
$('.sidebar').hide();//在圖還沒形成之前要先將左邊的slider隱藏
const Chart = echarts.init(document.getElementById('main'), null, {
    renderer: 'canvas', //could be svg, but may have performance problems
    // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
    // 设置这两个值后 left/right/top/bottom/width/height 无效。
    // width: 1700,
    // height: 800 //有置中問題
});
Chart.showLoading('default');//轉圈圈~~
var start = new Date().getTime();
console.log("data:")
console.log(data);
Chart.hideLoading(); //跑好後關圈圈~~~
$('.sidebar').show();//圖形顯示後再出現slider
var End = new Date().getTime();
console.log(End-start + 'ms');
const hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))
const rgbToHex = (r, g, b) => '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0')).join('')
if(dataType === 1){
    option.series[0].edgeLabel.show = false;
    option.series[0].edgeSymbol = [];
    option.series[0].edgeLabel.formatter = function (param) {
        return param.data.value;
    };
    // data.category.forEach(category=>{
    //     var color = [];
    //     data.nodes.forEach(node =>{
    //         if(node.name === category.target || node.name === category.source)
    //             color.push(node.itemStyle.color);
    //     })
    //     console.log(color);
    //     var target = hexToRgb(color[0]);
    //     var source = hexToRgb(color[1]);
    //     color = [];
    //     for (let index = 0; index < target.length; index++) {
    //         color[index] = parseInt((target[index] + source[index])/2);
            
    //     }
    //     category.lineStyle.color = rgbToHex(color[0], color[1], color[2]);
    //     console.log(category.lineStyle.color);
    // })
    $('.lineSelected').hide();
    $('#kModel').hide();
    $('.current_relation').hide();
}
else if(dataType === 2){
    option.series[0].edgeLabel.formatter = function (param) {
        return param.data.name;
    };
    option.series[0].itemStyle.label.formatter = function (param) {
        return param.name;
    };
    $(".common_show_value").hide();
    $(".word_strength").hide();
}
var edgeMask = [[],[]];
option.series[0].categories.forEach(category =>{
    if(!edgeMask[0].includes(category.id) && !edgeMask[1].includes(category.id))
    option.series[0].categories.forEach(item =>{
        if(item.target === category.source && item.source === category.target){
            if(item.name === category.name){
                if(!edgeMask[0].includes(category.id) && !edgeMask[1].includes(category.id)){
                    edgeMask[0].push(category.id);
                    edgeMask[1].push(item.id);
                }
            }
        }
    })
})
/**
 * 儲存max_level slider的現值
 * @type {string}
 */
var routeFloor = 'All';
var keywordCollection = [], viewResult;
window.onresize = () => {
    Chart.resize();
};
// EventListener
$('#keyword_search_field').keyup((e) => {
    keyword_search(e);
});
$('#keyword_search_button').on('click', keyword_search);

/**
 * 搜尋的進入點，由此函式區分這次搜尋要傳到個方法
 */
function keyword_search(e) {
    if (e. which=== 13 || e.type === 'click') {
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
    for (let item of names){
        //拆到剩下單一名詞的陣列
        if (item.includes('&')) {
            item = item.split('&');
            item.forEach((t) => {
                namess.push(t);
            });
        } else namess.push(item);
    }
    if (keywordModel === 'node')
	for (const item of namess){
            //檢查點
            if (!data.all_nodes.includes(item)){
				throw alert(`Error1 : 找不到關鍵字:${keyword}`);
			} 
        }
    else
		for (const item of namess){
            //檢查線
            if (!allLine.includes(item)) {
				throw alert(`Error1 : 找不到關鍵字:${keyword}`);
			}
        }
        let test = keywordItemAppend(keyword, keywordSearchType, keywordModel);
        if(test === 0)
            keywordFliter();
    }
}
/**
 * 做搜尋的init並檢查node是否有在data內，並執行搜尋程式
 */
export function keywordFliter() {
    keywordCollection = keywordCleanUp();
    console.log(keywordCollection);
    // routeFloor = 'All';
    if(keywordCollection.length === 0)
        resetChart();
    else{
        viewResult = searchKeyword(keywordCollection, 'All');
        if(routeFloor != 'All' && viewResult.routeHash.includes(routeFloor)){
        viewResult = changeMaxlevel(keywordCollection, routeFloor);
        }
        else if(!viewResult.routeHash.includes(routeFloor))
        routeFloor = 'All';
        if(routeFloor != 'All') var value = routeFloor;
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
function viewDataChange() {
    option.series[0].categories = viewResult.category
    option.series[0].links = viewResult.links
    console.log(keywords);
    option.series[0].nodes = viewResult.nodes.filter((node) => {
        keywords.includes(node.name)
        ? (node.itemStyle.color = 'red')
        : (node.itemStyle.color = userColors[node.gp]);
        return node;
    });
    event_setOption_function();
}
// Chart.on('legendselectchanged', (category_select) => {

// });
function resetChart() {
    let collect = [];
    //刪除完全數清空或是砍了第一層
    option.series[0].categories = data.all_category.filter((category) => {
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
// max_level
function max_Level(ui_value) {
    if (ui_value === viewResult.routeHash.length) routeFloor = 'All';
    else routeFloor = viewResult.routeHash[ui_value];
    $(`.slider_item > input[id=max_level]`).val(routeFloor);
    viewResult = changeMaxlevel(keywordCollection, routeFloor);
    viewDataChange();
}

// the involve function that will read the jquery_slider_setting in Main_setting.js, then create the jquery slider
$(() => {
    $('.max_level').hide();
    silderInit();
    document.querySelector('.alone').onclick = function(e){
        sliderBar('All');
        event_setOption_function();
    };
    $('.slider_slider').slider({slide: function(e, ui){
        if(e.target.id === 'max_level')
            max_Level(ui.value);
        else
            sliderBar(e, ui)
            event_setOption_function(false);
        }   
    });
    event_setOption_function();
    End = new Date().getTime();
    console.log(End-start + 'ms');
});
// The function to render the data to canvas after set all option finish
export function event_setOption_function(render = true) {
    if(viewResult == undefined)
    listGenerator(option, undefined);
    else
        listGenerator(option, viewResult.route);
        if($('#Cselecter').val() !== '')
            sliderBar('All');
        // layoutCalculator(option);
        // positionCalculator();
        edgeFilter();
    // nodeTypeChange();
    Chart.setOption(option, render);
}
export function lineColorChanger(name, color, id){
    if(id === 'node'){
        var gp = parseInt(name)
        userColors[gp] = color;
        data.nodes.forEach(node =>{
            if(node.gp === gp){
                node.itemStyle.color = color;
            }
        });
        option.series[0].nodes.forEach(node =>{
            if(node.gp === gp){
                node.itemStyle.color = color;
            }
        });
    }
    else{
        data.category.forEach(category =>{
            if(category.name === name){
                category.lineStyle.color = color;
            }
        });
        option.series[0].categories.forEach(category =>{
            if(category.name === name){
                category.lineStyle.color = color;
            }
        });
        option.series[0].links.forEach(category =>{
            if(category.name === name){
                category.lineStyle.color = color;
            }
        });
    }
    event_setOption_function(false);
}
Chart.on('click', (e) => {
    // console.log(e);
    if(bookId.indexOf("_")==-1 && e.componentType !== 'title')
    {
        console.log(bookId,e.data.source, e.data.target, e.data.name);
        if(e.data.source==undefined && e.data.target==undefined)
            searchBookUnit(bookId,e.data.name); 
        else
            searchBookAssociation(bookId, e.data.source, e.data.target,  e.data.name);
    }

    function searchBookAssociation(bid, key1, key2, relation) {
        var associationQuery = '"' + key1 + '" AND "' + key2 + '"';
        // http://dh.ascdc.sinica.edu.tw/member/text/segementRelationDetails.jsp
        $.get(window.location.origin+'/member/text/segementRelationDetails.jsp', {
            'bid': bid,
            'searchKey': associationQuery,
            'pages': 1,
            'isStart': '1',
            'relation': relation
        }, function (data) {
            //$('#layout_main').html(data);
            var w = window.open('about:blank', key1 + key2, 'width=800,height=600');
            w.document.write(data);
            w.document.close();
        });
    }
    function searchBookUnit(bid,associationKey){
    //alert(bid);
    var associationQuery = "";
    associationQuery = '"'+associationKey+'"';
    //$('#searchKey').val(associationKey);
    $.get(window.location.origin+'/member/text/segementDetails.jsp',{'only_show_authority':$("#only_show_authority").val(),'show_info':$("#show_info").val(),'pageNums':$("#pageNums").val(),'bookID':bid,'bid':bid,'searchKey':associationQuery,'ckDic':$("#DicCK").prop("checked"),'pages': 1,'isStart':'1'}, function(data) {
            //$('#layout_main').html(data);
            var w = window.open('about:blank', associationKey,'width=800,height=600');
            w.document.write(data);
            w.document.close();
            
    });
    
}
});
Chart.on('dblclick', params => {
    if (params.componentType === 'title') {
      let titleName = prompt("請填入標題名稱");
      if(titleName !== null)
      option.title.text = titleName;
      event_setOption_function(false);
    }
  });
function edgeFilter(){																					
    option.series[0].links.forEach(function(link,index,array){
        if(edgeMask[1].includes(link.id)){
            option.series[0].links.splice(index,1);
        }
        if(edgeMask[0].includes(link.id)){
            link.symbol = 'arrow';
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