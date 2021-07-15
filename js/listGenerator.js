/**
 * @module listGenerator
 * @description 產生節點與線段相關列表的模組
 * @author Wei-Jie Li
 * @createDate 2021-03-21
 */
import { colorPanelInit } from './colorPanelSetting';
import { keywordFliter } from './mainSetting';
import { keywordItemAppend, keywords } from './keywordCleaner.js';
/**
 * 圖例列表控制函式
 * @param {*} option - ECharts graph圖表設定檔{@link option}
 * @param {array} route - and的搜尋的路徑(現已沒用到)
 */
export function listGenerator(option, route) {
	nodeList(option.series[0].nodes, route);
	lineList(option.series[0].categories, route);
}
/**
 *節點列表生產函式 
 * @param {object} dataset - 畫面上的節點資料
 * @param {array} route  - and的搜尋的路徑(現已沒用到)
 */
function nodeList(dataset, route) {
	$('.current_node').html(`顯示的點 : (${dataset.length})`);
	$('.nodeSelected').children().remove();
	var index = 0;
	for (const name of groupName) {
		const details = document.createElement('details');
		details.className = `nodeList${index}`;
		$('.nodeSelected').append(details);
		$(`.nodeList${index}`).append(`<summary>${name}<button id='node' class="color-lump" role="button"  name="${name}" value="${userColors[index]}" style="background-color: ${userColors[index]}"></button></summary>`);
		// details.appendChild(summary);
		dataset.forEach((item) => {
			if (item.gp === index) {
				var lableName = item.name;
				var disabled = '';
				if (route !== undefined && route.length !== 0) {
					var routeCount = 0;
					route.forEach((element) => {
						if (element.includes(item.name)) routeCount++;
					});
					if (route.length === routeCount) lableName = `${item.name} (必要)`;
				}
				if (keywords.includes(item.name)) disabled = `disabled="disabled"`;
				$(`.nodeList${index}`).append(`<div class="nodeSelected_item" value="${item.name}">
             <label><font color="${item.itemStyle
					.color}"><input type="checkbox" id="${item.name}" name="node_list" value="${item.name}" ${disabled}  checked >${lableName}</front></label>
             <div class="color-lump" style="background-color:${item.itemStyle.color}"></div></div>`);
			}
		});
		index++;
	}

	$('.nodeSelected').scrollTop(function() {
		return this.scrollHeight;
	});
	document.querySelector('.nodeSelected').onchange = function(e) {
		nodeListChange(e);
	};
}
/**
 * 線斷列表生產函式 
 * @param {object} dataset - 畫面上的線段資料
 * @param {array} route  - and的搜尋的路徑(現已沒用到)
 */
function lineList(dataset, route) {
	let mustLine = [];
	$('.current_relation').html(`顯示的線 : (${dataset.length})`);
	$('.lineSelected').children().remove();
	let list = [];
	if (route !== undefined && route.length !== 0) {
		for (let index = 1; index < route.length; index++) {
			mustLine = mustLine.filter(function(element, index, arr) {
				return arr.indexOf(element) !== index;
			});
		}
	}
	dataset.forEach((item) => {
		if (item.value === 0) {
			if (!list.includes('無共現')) {
				list.push('無共現');
				$('.lineSelected').append(`<div class="lineSelected_item" data-item="無共現">
            <label><font color="gray"><input type="checkbox" name="node_list" value="無共現" checked>無共現(0)</front></label></div><div class="color-lump" style="background-color:"gray"></div>`);
			}
		}
	});
	dataset.forEach((item) => {
		if (!list.includes(item.name)) {
			list.push(item.name);
			var name = item.name;
			if (mustLine.includes(item.name)) {
				name = `${item.name} (必要)`;
			}
			$('.lineSelected').append(`<div class="lineSelected_item" value="${item.name}">
            <label><font color="${item.lineStyle
				.color}"><input type="checkbox" name="lineList" value="${item.name}" checked>${name}</front></label></div><div classs="${item.name}"><button id='line' class="color-lump" role="button"  name="${item.name}" value="${item
				.lineStyle.color}" style="background-color: ${item.lineStyle.color}"></button></div>`);
		}
	});
	$('.lineSelected').scrollTop(function() {
		return this.scrollHeight;
	});
	document.querySelector('.lineSelected').onchange = function(e) {
		lineListChange(e);
	};
	$('button.color-lump').off('click').click((e) => {
		console.log(e.currentTarget.name);
		console.log(e.currentTarget.value);
		console.log(e.currentTarget.id);
		colorPanelInit(e.currentTarget.name, e.currentTarget.value, e.currentTarget.id);
	});
}
/**
 * 觸發節點列表點擊事件後執行的函式，將會從畫面中去除該元素
 * @param {event} e - 點擊事件資訊
 */
function nodeListChange(e) {
	console.log(e.target.value);
	keywordItemAppend(e.target.value, 'not', 'node');
	keywordFliter();
}
/**
 * 觸發線段列表點擊事件後執行的函式，將會從畫面中去除該關係
 * @param {event} e - 點擊事件資訊 
 */
function lineListChange(e) {
	console.log(e.target.value);
	keywordItemAppend(e.target.value, 'not', 'line');
	keywordFliter();
}
