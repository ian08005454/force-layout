/**
 * @module dataFormater
 * @description 資料格式轉換模組
 * @author Wei-Jie Li
 * @createDate 2021-03-21
 * @exports dataFormat
 */
import { SetLineColor } from "./assignColor";
/**
 * 產生顏色的次數
 */
var colorCount = 0;
/**
 * 線的顏色資訊
 */
var lineColors = {};
/**
 * 整理完成後要回傳的資料，有節點和線段資訊還有全部的
 */
var buf = {
	//暫存資料用
	nodes: [],
	all_nodes: [],
	links: [],
	category: []
};
var allCookie = parseCookie();
var allValues = [];
var allIdf = [];
// var userColors = ["#cc0000", "#00cc00", "#0000cc"];
// var userColors = [];
var id = 0;
/**
 * 隨機顏色編號儲存區
 */
var HSL = [];
/**
 * 將節點加入資料集陣列
 * @param {object} data_element - 物件json檔
 * @param {string} name - 別點名字
 * @param {string} bType - 形狀類型
 * @param {string} bColor - 邊界顏色
 * @param {number} bWidth - 邊界寬度
 */
function appendNode(data_element, name, bType = 'solid', bColor = 'gray', bWidth = 0) {
	if (data_element.idf === 0) {
		var lenghValue = 1;
	} else lenghValue = data_element.idf;
	if (userColors.hasOwnProperty(data_element.gp)) {
		var nodeColor = userColors[data_element.gp];
	} else {
		if(getCookieByName(kg2_element.type[0]) != null){
			var nodeColor = getCookieByName(kg2_element.type[0]); 
		}else{
			var nodeColor = getColor(); 
		}
		userColors[data_element.gp] = nodeColor;
	}
	buf.nodes.push({
		name: name,
		gp: data_element.gp,
		idf: data_element.idf,
		symbolSize: 30 * Math.sqrt(Math.sqrt(lenghValue, 3) / 0.8),
		originalSymbolSize: 30 * Math.sqrt(Math.sqrt(lenghValue, 3) / 0.8),
		value: data_element.idf, //data_element.idf,
		symbol: 'circle',
		itemStyle: {
			opacity: 0.9, //work
			borderType: bType, //'solid',
			borderColor: bColor, //'orange',
			borderWidth: bWidth, //css_ele.borderWidth,  //0,
			color: nodeColor
		}
	});
}
/**
 * 以資料的最大值設定平方數
 * @param {number} largest - 全部資料的最大數值 
 * @returns {number} 平方數
 */
function setSquare(largest){
	if (largest > 4096) var square = 4;
	else if (largest > 256) var square = 3;
	else if (largest > 16) var square = 2;
	else var square = 1;
	return square;
}
/**
 * 將jason資料轉換成echarts的資料格式
 * @param {json} data - json資料 
 * @returns {object} 轉換後的資料
 */
function dataFormat(data) {
	const set = new Set(); //為了之後去除重複
	data.forEach((data_element) => {
		allIdf.push(data_element.idf);
		if (data_element.idf === 0) appendNode(data_element, data_element.k1, 'solid', '#ffb61e', 3);
		else appendNode(data_element, data_element.k1);
		var largest = data_element.kg2[0].v;
		data_element.kg2.forEach((kg2Element) => {
			if (kg2Element.v > largest) largest = kg2Element.v;
		});
		var square = setSquare(largest);
		// foreach kg2 array
		data_element.kg2.forEach((kg2_element) => {
			// random a new color without duplicate, this color will according with category color to pair link color
			if (lineColors.hasOwnProperty(kg2_element.type[0])) {
				var lineColor = lineColors[kg2_element.type[0]].color;
			} else {
				if(getCookieByName(kg2_element.type[0]) != null){
					var lineColor = getCookieByName(kg2_element.type[0]); 
				}else{
					var lineColor = getColor(); 
				}
				lineColors[kg2_element.type[0]] = {color:lineColor, group:[]};
				for (let index = 0; index < userColors.length; index++) {
					lineColors[kg2_element.type[0]].group.push(0);
				}
			}
			if(kg2_element.gp !== data_element.gp){
				lineColors[kg2_element.type[0]].group[kg2_element.gp]++;
				lineColors[kg2_element.type[0]].group[data_element.gp]++;
			}
			if (dataType === 1) {
				lineColor = '#1A75CF';
			}
			allIdf.push(kg2_element.idf);
			// first : push k2 into nodes array, ignore duplicate problem e.g.AB互為兄弟時 會產生重複兩個節點
			if (kg2_element.idf == 0) appendNode(kg2_element, kg2_element.k2, 'solid', '#ffb61e', 3);
			else appendNode(kg2_element, kg2_element.k2);
			// second : push all category into buf.category array, ignore duplicate problem
			allValues.push(kg2_element.v);
			if (kg2_element.v == 0) {
				var dash = 'dashed';
				var ttype = dash;
			} else {
				var linksolid = 'solid';
				var ttype = linksolid;
			}
			if (kg2_element.type[0] == '未定義' || kg2_element.type[0] == '') {
				if (dataType !== 1) {
					kg2_element.type[0] = '未定義';
					lineColor = 'black';
					var shadowBlur = 10;
				}
			} else var shadowBlur = 0;
			if (kg2_element.v === 0) {
				var lenghValue = 1;
			} else if (dataType === 2) {
				var lenghValue = 5;
			} else lenghValue = kg2_element.v;
			buf.category.push({
				id: id++,
				name: kg2_element.type[0],
				target: data_element.k1,
				source: kg2_element.k2,
				value: kg2_element.v,
				show: true, //是否要顯示於畫面上
				bilateral: 'false',
				force: {
					edgeLength: Math.sqrt(lenghValue, square) * 10000000
				},
				lineStyle: {
					opacity: 1, //work
					color: lineColor,
					// curveness: 0.4, //原1 / Math.sqrt(kg2_element.v, 2) //曲度
					width: Math.sqrt(lenghValue, square),
					originalWidth: Math.sqrt(lenghValue, square),
					type: ttype, //kg2_element.css[0].linetype  //'dashed'
					shadowColor: 'orange',
					shadowBlur: shadowBlur
				},
				label: {
					show: true,
					color: lineColor
				}
			});
			// buf.category has the every property that links object need, etc : source, target, value, lineStyle
			buf.links = buf.category;
		});
	});
	buf.category.sort(function(a, b) {
		if (a.id < b.id) {
			return -1;
		}
		if (a.id > b.id) {
			return 1;
		}
		return 0;
	});
	// remove duplicate item in buf.nodes array
	buf.nodes = buf.nodes.filter((item) => (!set.has(item.name) ? set.add(item.name) : false));
	set.clear();

	// push all node into all_nodes to determine keyword search
	buf.nodes.forEach((node) => {
		buf.all_nodes.push(node.name);
	});

	// sort buf.category
	buf.category = buf.category.sort((a, b) => {
		return a.name > b.name ? 1 : -1;
	});
	buf.category.forEach(category =>{
		buf.category.forEach(item =>{
			if(item.target === category.source && item.source === category.target){
				if(item.name === category.name && category.bilateral !== 'delete'){
					category.bilateral = 'true';
					item.bilateral  = 'delete';
				}
			}
		})
	});
	// var colorList = Object.keys(lineColors);
	// console.log(lineColors);
	// lineColors = SetLineColor(colorList, lineColors, userColors);
	// buf.category.forEach(category =>{
	// 	category.lineStyle.color = lineColors[category.name].color;
	// 	category.label.color = lineColors[category.name].color;
	// })
	return buf;
}
// set each data color a random hex color
// function calculate_color() {
//     return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);//<<=左移賦值
// }
/**
 * 隨機回傳一個不重複的顏色
 * @see 參考資料{@link https://segmentfault.com/q/1010000010807637/a-1020000010809153 }
 * @returns {string} 所選的HEX顏色代碼
 */
function getRandomColor() {
	var hslLength = HSL.length;
	var ret = [];
	ret[0] = Math.floor(Math.random() * 360);
	if (HSL.length > 36) {
		ret[1] = 80;
		ret[2] = 70;
	} else {
		ret[1] = 70;
		ret[2] = 50;
	}

	for (var i = 0; i < hslLength; i++) {
		// 色相差異調整
		if (i > 0 && Math.abs(ret[0] - HSL[i][0]) < 8) {
			ret[0] = Math.floor(Math.random() * 360);
			// ret[1]= Math.floor(Math.random() * 100);
			// ret[2]= Math.floor(Math.random() * 100);
			i = 0;
		}
	}
	// ret[1] = 70 + (ret[1] * 0.3); // [0.7 - 0.9] 排除过灰颜色
	// ret[2] = 40 + (ret[2] * 0.4); // [0.4 - 0.8] 排除过亮过暗色

	// 数据转化到小数点后两位
	ret = ret.map(function(item) {
		return parseFloat(item.toFixed(2));
	});

	HSL.push(ret);
	// console.log(ret);
	var color = hslToHex(ret[0], ret[1], ret[2]);
	// console.log(color);
	return color;
}
/**
 * 以6個顏色red,yellow,green,cyan,blue,magenta為基礎指定顏色，
 * @returns {string} 所選的HEX顏色代碼
 */
 function getColor() {
	var hsl = [0,60,120,180,240,300,30,90,150,270,330,15,45,75,105,135,165,195,225,255,285,315,345]
	var ret = [];
	if (colorCount < 24) {
		ret[0] = hsl[colorCount % 24]
		ret[1] = 80;
		ret[2] = 70;
	} else if(colorCount < 48) {
		ret[0] = hsl[colorCount % 24]
		ret[1] = 60;
		ret[2] = 60;
	}else{
		ret[0] = hsl[colorCount % 24]
		ret[1] = 70;
		ret[2] = 50;
	}
	colorCount++;
	var color = hslToHex(ret[0], ret[1], ret[2]);
	return color;
}
/**
 *將HSL顏色格式代碼轉成HEX格式代碼 
 * @param {number} h 色相
 * @param {number} s 飽和度
 * @param {number} l 亮度
 * @returns {string} HEX color code
 * @see 參考資料 {@link https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex}
 * @see 參考資料 {@link https://www.ginifab.com.tw/tools/colors/rgb_to_hsv_hsl.html}
 */
function hslToHex(h, s, l) {
	h /= 360;
	s /= 100;
	l /= 100;
	let r, g, b;
	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	const toHex = (x) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function parseCookie() {
    var cookieObj = {};
    var cookieAry = document.cookie.split(';');
    var cookie;
    
    for (var i=0, l=cookieAry.length; i<l; ++i) {
        cookie = cookieAry[i].trim();
        cookie = cookie.split('=');
        cookieObj[cookie[0]] = cookie[1];
    }
    
    return cookieObj;
}
function getCookieByName(name) {
    var value = allCookie[name];
    if (value) {
        value = decodeURIComponent(value);
    }else{
		value = null;
	}

    return value;
}
export { dataFormat, allValues, allIdf };
