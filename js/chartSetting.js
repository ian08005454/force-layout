/**
 * @module chartSetting
 * @description 圖表的設定內容
 * @author Wei-Jie Li
 * @createDate 2021-03-21
 * <h4>Change Log</h4>
 * <ul>
 *     <li> 增加 URL Variable 判斷</li>
 * </ul>
 */

import {allIdf, allValues, dataFormat} from './dataFormater.js';
import {GetJSON} from "./API";
// 避免沒有使用 Ajax 時(註解時)還會顯示錯誤，造成 jdata 無法讀取
if (typeof url !== 'undefined') {
	GetJSON(url);
}

console.log(jdata);
/**
 * @type {object}
 * 整理後的資料
 */
export const data = dataFormat(jdata); //資料整理模組
var max_common_show_value = Math.max(...allValues);
var min_common_show_value = Math.min(...allValues);
var max_idf = Math.max(...allIdf);
var min_idf = Math.min(...allIdf);
/**
 * ECharts graph圖表設定檔
 * @see ECharts的配置項說明書 {@link https://echarts.apache.org/zh/option.html#series-graph.type }
 */
export var option = {
	title: {
        show: true,
		text: bookName, // this field will connect to the book name
		textStyle: {
			fontSize: 32,
			fontWeight: 'bolder',
            color: '#595759'
		},
		// subtextStyle: {
		// 	fontSize: 15,
		// 	fontWeight: 'bolder'
		// },
        top: "bottom",
        left: "right",
        triggerEvent: true,
	},
	tooltip: {
		show: true,
		formatter: function(element) {
			if (element.dataType == 'node') return element.name  +'(<b>' + element.value + '</b>)';
			if (element.dataType == 'edge'){
				var target,source
				data.nodes.forEach(node => {
					if(node.name === element.data.target)
						target = node.value;
					else if (node.name === element.data.source)
						source = node.value
				});
				if(element.data.bilateral === 'true')
					return element.data.source +  '('+ source +')' + ' <-- <b>' + element.data.name + '(' + element.value + '</b>) -->   ' + element.data.target + '('+ target +')' ;
				else
					return element.data.source +  '('+ source +')' + ' -- <b>' + element.data.name + '(' + element.value + '</b>) -->   ' + element.data.target + '('+ target +')' ;
			}
		}
		// showContent:false, //mouseover是否顯示
	},
	toolbox: {
		left: 'right',
		show: true,
		feature: {
			magicType: { show: true, type: [ 'force', 'chord' ] },
			saveAsImage: {
				show: true,
				title: '存成圖片',
				type: 'png'
			},
			// ! dataView still have to fix
			// dataView: {
			//     show: true,
			//     title: 'data',
			//     readOnly: false,
			//     lang: ['Detail Data Information', 'Close', 'refresh'],
			// },
			restore: {
				show: true,
				title: 'restore'
			}
		}
	},
	// legend: {
	//     type: 'scroll',
	//     data: data.category,
	//     tooltip: {
	//         show: false,
	//     },
	//     orient: 'vertical',
	//     pageButtonPosition: 'start',
	//     selectedMode: 'true',
	//     width: 100,
	//     height: 140,
	//     right: 50
	// },
	series: [
		{
			type: 'graph',
			layout: 'force',
			categories: data.category,
			nodes: data.nodes,
			// modularity: true,
			links: data.links,
			itemStyle: {
				color: 'pink' //預設node顏色
			},
			label: {
				fontFamily: 'sans-serif',
				show: true,
				fontSize: 17,
				fontWeight: 'bold',
				formatter: function(param) {
					return param.name + `(` + param.data.idf + `)`;
				},
				color: '#1212128F'
			},
			draggable: true, //單獨點的移動
			roam: true, //禁止使用者作放大縮小 只准拖動 true,'move','scale',false
			nodeScaleRatio: 0.1,
			force: {
				// friction: 0.1,
				repulsion: 300,
				// todo : fix the jquery slider
				edgeLength: [ 250, 400 ],
				// gravity : 1,
				gravity: 0.01,
				layoutAnimation: true //開始的晃動動畫
			},
			edgeSymbol: [ 'circle', 'arrow' ],
            edgeSymbolSize: [10, arrowSize],
			emphasis: {
				focus: 'adjacency',
				scale: true,
				lable: {
					show: true,
					color: "#121212",
					fontSize: 20
				}
			},
			autoCurveness: true, //auto calculate each curveness of lines
			edgeLabel: {
				fontFamily: 'sans-serif',
				overflow: 'break',
				verticalAlign: 'bottom',
				show: true,
				fontSize: 18,
				fontWeight: 'bold',
				formatter: function(param) {
					// param.name = `${param.data.target}>${param.data.source}`;
					return param.data.name + `(` + param.data.value + `)`;
				},
				position: 'middle',
				align: 'center',
				ellipsis: '...',
			},
			lineStyle: {
				opacity: 1
			},
			zoom: 1,
		}
	]
};

/**
 * 調整項的初始化設定值
 * @type {object}
 */
export var jquery_slider_setting = [
	{
		object: 'relation_strength',
		min: 0,
		max: 100,
		step: 1,
		value: 0,
		disable: false,
		range: 'min'
	},
	{
		object: 'group_label_distance',
		min: 0,
		max: 100,
		step: 1,
		value: 0,
		disable: false,
		range: 'min'
	},
	{
		object: 'node_distance',
		min: 1,
		max: 100,
		step: 1,
		value: option.series[0].force.repulsion / 100,
		disable: false,
		range: 'min'
	},
	{
		object: 'relation_link_width',
		min: 0.5,
		max: 5,
		step: 0.5,
		value: 1,
		disable: false,
		range: 'min'
	},
	{
		object: 'main_screen_room',
		min: 0.1, //option.series[0].zoom,
		max: 2,
		step: 0.1,
		value: option.series[0].zoom,
		disable: false,
		range: 'min'
	},
	{
		object: 'relation_font_size',
		min: 5,
		max: 100,
		step: 1,
		value: option.series[0].edgeLabel.fontSize,
		disable: false,
		range: 'min'
	},
	{
		object: 'subject_font_size',
		min: 5,
		max: 100,
		step: 1,
		value: option.series[0].label.fontSize,
		disable: false,
		range: 'min'
	},
	{
		object: 'node_size',
		min: 0.2,
		max: 5,
		step: 0.2,
		value: 1,
		disable: false,
		range: 'min'
	},
	{
		object: 'common_show_value',
		min: min_common_show_value - 1,
		max: max_common_show_value,
		step: 1,
		value: min_common_show_value,
		disable: false,
		range: 'min'
	},
	{
		object: 'word_strength', //idf詞頻強度
		min: min_idf - 1,
		max: max_idf,
		step: 1,
		value: min_idf,
		disable: false,
		range: 'min'
	},
	{
		object: 'relation_distance',
		min: 50,
		max: 1000,
		step: 25,
		values: [ option.series[0].force.edgeLength[0] / 5, option.series[0].force.edgeLength[1] / 5 ],
		disable: false,
		range: true
	}
	// {
	// 	object: 'arrowSize', //箭頭大小
	// 	min: 1,
	// 	max: 30,
	// 	step: 1,
	// 	value: option.series[0].edgeSymbolSize,
	// 	disable: true,
	// 	range: 'min'
	// }
];
