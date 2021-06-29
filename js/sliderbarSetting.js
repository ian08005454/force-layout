/**
 * @module sliderbarSetting
 * @description 與左側調整項相關的程式碼
 * @author Wei-Jie Li
 * @createDate 2021-03-21
 */
import 'jquery-ui';
var createLayout = require('ngraph.forcelayout');
import { closeness } from '../lib/closeness.js';
import { eccentricity } from '../lib/eccentricity.js';
import { degree } from '../lib/degree.js';
import { betweennes } from '../lib/betweenness.js';
import { option, jquery_slider_setting, data } from './chartSetting.js';
import createGraph from 'ngraph.graph';
import { event_setOption_function } from "./mainSetting";
/**
 * 所有中心性的值
 * @type {array}
 */
var central = [];
/**
 * 長度為三的陣列，三個值分別代表三個篩選功能的值
 * @type {array}
 */
var filterValue = [ 0, 0, 0 ];
/**
 * ngraph 的參數
 * @type {object}
 */
var g;
/**
 * 中心性值的hash表，為了給slider bar 參考
 * @type {array}
 */
let centralHash = [];
/**
 * 運用{@link jquery_slider_setting }的參數初始化sikderbar  
 */
export function silderInit() {
	document.querySelector('.centralitySelecter').onchange = function(e) {
		centrality(e.target.value);
	};
	document.querySelector('.switch-input').onclick = function(e) {
		switchType();
	};
	$('.centrality').hide();
	// const length = [option.series[0].force.edgeLength[0], option.series[0].force.edgeLength[1]]
	for (let jquery_slider_setting_element of jquery_slider_setting) {
		$(`.slider_item > #${jquery_slider_setting_element.object}`).slider({
			disabled: jquery_slider_setting_element.disable,
			range: jquery_slider_setting_element.range,
			min: jquery_slider_setting_element.min,
			max: jquery_slider_setting_element.max,
			step: jquery_slider_setting_element.step,
			value: jquery_slider_setting_element.value
		});
		if (
			jquery_slider_setting_element.object === 'word_strength' ||
			jquery_slider_setting_element.object === 'common_show_value'
		)
			$(`.slider_item > input[id=${jquery_slider_setting_element.object}]`).val(
				`≥ ${jquery_slider_setting_element.value}`
			);
		else if (jquery_slider_setting_element.object === 'relation_distance')
			$(`.slider_item > input[id=${jquery_slider_setting_element.object}]`).val(
				jquery_slider_setting_element.values
			);
		else
			$(`.slider_item > input[id=${jquery_slider_setting_element.object}]`).val(
				jquery_slider_setting_element.value
			);
	}
}
/**
 * sliderbar發生改變時執行的動作
 * @param {event} e - 觸發事件
 * @param {string}} ui - 觸發的項目 
 */
export function sliderBar(e, ui) {
	if (e === 'All') {
		filterControler('All', 1);
	} else {
		if (e.target.id == 'common_show_value' || e.target.id == 'word_strength') {
			if(ui.value == -1)
				$('input[id=' + e.target.id + ']').val('= 0');
			else
			$('input[id=' + e.target.id + ']').val(`≥ ${ui.value}`);
		} else if (e.target.id == 'relation_distance') {
			$('input[id=' + e.target.id + ']').val(ui.values);
		} else {
			$('input[id=' + e.target.id + ']').val(ui.value);
		}
		switch (e.target.id) {
			case 'relation_strength':
				break;
			// case 'word_strength':
			//     break;
			case 'group_label_distance':
				break;
			case 'relation_distance':
				option.series[0].force.edgeLength = ui.values;
				option.series[0].force.edgeLength[0] *= 5;
				option.series[0].force.edgeLength[1] *= 5;
				break;
			case 'node_distance':
				option.series[0].force.repulsion = ui.value * 100;
				break;
			case 'relation_link_width':
				data.links.forEach((link) => {
					link.lineStyle.width = link.lineStyle.originalWidth * ui.value;
				});
				break;
			case 'main_screen_room':
				option.series[0].zoom = ui.value;
				break;
			case 'relation_font_size':
				option.series[0].edgeLabel.fontSize = ui.value;
				break;
			case 'subject_font_size':
				option.series[0].label.fontSize = ui.value;
				break;
			case 'node_size':
				data.nodes.forEach((node) => {
					node.symbolSize = node.originalSymbolSize * ui.value;
				});
				break;
			case 'word_strength': //詞頻強度
				filterControler('word', ui.value);
				break;
			case 'common_show_value': //共現次數
				filterControler('common', ui.value);
				break;
			case 'centrality': //中心性
				filterControler('centrality', ui.value);
				break;
			case 'arrowSize':
				option.series[0].edgeSymbolSize = ui.value;
				break;
		}
	}
}
/**
 * 處理出現次數篩選與中心性篩選的功能
 * @param {string} target - 被改變的項目
 * @param {number} value - 改變的值 
 */
function filterControler(target, value) {
	option.series[0].links = JSON.parse(JSON.stringify(option.series[0].categories));
	if (target === 'common') filterValue[0] = value;
	else if (target === 'word') filterValue[1] = value;
	else if (target === 'centrality') filterValue[2] = value;
	common_value(filterValue[0]);
	word_strength(filterValue[1]);
	centralityContrl(filterValue[2]);

	function common_value(value) {
		var value_filter = [];
		// console.log(value);
		option.series[0].links = option.series[0].links.filter((category) => {
			if (value == -1) {
				if (category.value == 0) {
					value_filter.push(category.target, category.source);
					return category;
				}
			} else if (category.value >= value) {
				value_filter.push(category.target, category.source);
				return category;
			}
		});
		value_filter = Array.from(new Set(value_filter));
		option.series[0].nodes = data.nodes.filter((node) => {
			// console.log(value_filter.includes(node.name));
			return value_filter.includes(node.name);
		});
	}

	function word_strength(value) {
		var valueFilter = [];
		var valueFilter2 = [];
		option.series[0].nodes = option.series[0].nodes.filter((node) => {
			if (node.idf >= value) {
				valueFilter.push(node.name);
				return node;
			}
		});
		option.series[0].links = option.series[0].links.filter((category) => {
			if (valueFilter.includes(category.target) && valueFilter.includes(category.source)) {
				valueFilter2.push(category.target, category.source);
				return category;
			}
		});
		if ($('.alone').is(':checked') === false) {
			option.series[0].nodes = data.nodes.filter((node) => {
				return valueFilter2.includes(node.name);
			});
		}
	}

	function centralityContrl(value) {
		if (centralHash.length === 0) return;
		$(`.slider_item > input[id=centrality]`).val(centralHash[value]);
		let temp = [];
		central.forEach((item) => {
			if (item[1] < centralHash[value]) temp.push(item[0]);
		});
		option.series[0].links.forEach(function(item, index, array) {
			if (temp.includes(item.target) || temp.includes(item.source)) {
				item.lineStyle.opacity = 0.1;
				item.label.show = false;
			}
		});
		option.series[0].nodes.forEach((node) => {
			node.itemStyle.opacity = 1;
			if (temp.includes(node.name)) node.itemStyle.opacity = 0.1;
		});
	}
}
/**
 * 中心性計算並初始化slider bar
 * @see ngraph.centrality {@link https://github.com/anvaka/ngraph.centrality}
 * @param {string} value - 用哪種中心性(Eccentricity、closeness、betweenness、degree)
 */
function centrality(value) {
	ngraph();
	var valueFilter = [];
	option.series[0].categories.forEach((category) => {
		valueFilter.push(category.target, category.source);
	});
	valueFilter = Array.from(new Set(valueFilter));
	option.series[0].nodes = data.nodes.filter((node) => {
		return valueFilter.includes(node.name);
	});
	if (value === 'betweenness') countBetweenness();
	else if (value === 'closeness') countCloseness();
	else if (value === 'eccentricity') countEccentricity();
	else if (value === 'degree') countDegree();
	centralitySlider();
	function countCloseness() {
		let directedCloseness = closeness(g);
		console.log(directedCloseness);
		central = [];
		option.series[0].nodes.forEach((node) => {
			central.push([ node.name, directedCloseness[node.name] ]);
		});
	}
	function countEccentricity() {
		let directedEccentricity = eccentricity(g);
		central = [];
		option.series[0].nodes.forEach((node) => {
			central.push([ node.name, directedEccentricity[node.name] ]);
		});
	}
	function countDegree() {
		let directedDgree = degree(g);
		central = [];
		option.series[0].nodes.forEach((node) => {
			central.push([ node.name, directedDgree[node.name] ]);
		});
	}
	function countBetweenness() {
		let directedBetweenness = betweennes(g);
		central = [];
		option.series[0].nodes.forEach((node) => {
			central.push([ node.name, directedBetweenness[node.name] ]);
		});
	}
	function centralitySlider() {
		central.sort(function(a, b) {
			if (a[1] > b[1]) {
				return 1;
			} else if (a[1] < b[1]) {
				return -1;
			}
			return 0;
		});
		var roundDecimal = function(val, precision) {
			return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, precision || 0);
		};
		if (central[central.length - 1][1] <= 1) var precision = 5;
		else if (central[central.length - 1][1] <= 10) var precision = 3;
		else if (central[central.length - 1][1] <= 100) var precision = 2;
		else var precision = 0;
		centralHash = [];
		central.forEach((item) => {
			item[1] = roundDecimal(item[1], precision);
			centralHash.push(item[1]);
		});
		centralHash = Array.from(new Set(centralHash));
		console.log(centralHash);
		$(`.slider_item > #centrality`).slider({
			min: 0,
			max: centralHash.length - 1, //最大階層數
			step: 1,
			value: 0, //current option setting value
			disable: false,
			range: 'min'
		});
		$(`.slider_item > input[id=centrality]`).val(centralHash[0]);
		$('.centrality').show();
	}
	$('.centrality').show();
	filterControler('centrality', 0);
}
/**
 * 初始化ngraph模組，並將畫面資料傳入該模組來計算中心性，每次畫面更動都須執行一次
 * @see ngraph {@link https://github.com/anvaka/ngraph}
 */
function ngraph() {
	g = createGraph();
	option.series[0].nodes.forEach((node) => {
		g.addNode(node.name);
	});
	console.log(g);
	option.series[0].categories.forEach((category) => {
		// ccc += category.value;
		// for(let i = 0; i<category.value; i++){
		// 	g.addLink(category.target, category.source);
		// }
		g.addLink(category.target, category.source);
	});
}
/**
 * 計算forcelayout用的，現在沒用到
 * @see ngraph.forcelayout {@link https://github.com/anvaka/ngraph.forcelayout}
 */
export function positionCalculator() {
	ngraph();
	var physicsSettings = {
		timeStep: 0.5,
		dimensions: 2,
		gravity: -120,
		theta: 0.8,
		springLength: 10,
		springCoefficient: 0.8,
		dragCoefficient: 0.9
	};
	var layout = createLayout(g, physicsSettings);
	option.series[0].nodes.forEach(function(node) {
		node.x = createLayout(g).getNodePosition(node.name).x;
		node.y = createLayout(g).getNodePosition(node.name).y;
	});
	console.log(option.series[0].nodes);
	// now we can ask layout where each node/link is best positioned:
	//   g.forEachNode(function(node) {
	//     console.log(ngraphCreateLayout(g).getNodePosition(node.id).y);
	//     // Node position is pair of x,y coordinates:
	//     // {x: ... , y: ... }
	//   });
}
/**
 * 用來切換不同的layout有環形圖與力佈局
 */
function switchType() {
	if (option.series[0].layout === 'circular') option.series[0].layout = 'force';
	else option.series[0].layout = 'circular';
	event_setOption_function();
}
