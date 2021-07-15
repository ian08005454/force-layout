/**
 * @module searchFunction
 * @description 搜尋模組
 * @author Wei-Jie Li
 * @createDate 2021-03-21
 */
import { data } from "./chartSetting.js";
/**
 * 搜尋後的結果，裡面包含了三個要顯示的內容和可以篩選的階層
 * @typeof {object}
 */
var result ={
	nodes: [],
	links: [],
	category: [],
	routeHash:[]
}
/**
 * 搜尋功能的主程式
 * @param {object} keywordCollection - 經過整理後的搜尋項目，可以參考{@link keywordCollection }
 * @param {(number|string)} routeFloor - 搜尋的階層，可以參考{@link routeFloor}
 * @returns {object} 搜尋完的結果
 */
export function searchKeyword( keywordCollection, routeFloor){
	result.links = [];
	result.category = [];
	result.nodes = [];
	result.routeHash = [];
	keywordCollection.forEach((item) => {
		if (item.nodeName.length === 0) lineOr(item);
		else if (item.nodeName.length === 1) data_filter(item, routeFloor);
		else floodingSearch(item, routeFloor);
	});
	return result;
}
/**
 * 調整階層的運算程式
 * @param {object} keywordCollection - 經過整理後的搜尋項目，可以參考{@link keywordCollection }
 * @param {(number|string)} routeFloor -  搜尋的階層，可以參考{@link routeFloor}
 * @returns  {object} 搜尋完的結果
 */
export function changeMaxlevel(keywordCollection, routeFloor){
	result.links = [];
	result.category = [];
	result.nodes = [];
	keywordCollection.forEach((item) => {
		if (item.nodeName.length === 0) lineOr(item);
		else if (item.nodeName.length === 1) data_filter(item, routeFloor);
		else	floodingSearch(item, routeFloor);
	});
	return result;
}
/**
 * 回報找不到路線的錯誤訊息，並中止執行
 * @param {string} nodeName 找讀但路徑的搜尋項目
 */
function andSearchNoRoute(nodeName) {
	alert(`Error2 : 搜尋不到路徑 : ${nodeName}`);
}
/**
 * 單一和or搜尋的function，會用searchTarget的資訊尋找出的點，並傳給{@link dataAppendOr()}整合搜尋結果
 * @param {object} keyword 搜尋的目標
 * @param {(number|string)} routeFloor 搜尋的階層，可以參考{@link routeFloor}
 */				
function data_filter(keyword, routeFloor) {
	if (routeFloor === 'All') {
		// 確認最大階層數，如果是All就跑到100層
		var ui_user = 200;
	} else {
		ui_user = routeFloor;
	}
	var categories = [], // 要加入option.series[0].categories的陣列
		links, // 要加入option.series[0].links的陣列
		nodes; // 要加入option.series[0].nodes的陣列
	let minus = JSON.parse(JSON.stringify(keyword.nodeName));
	let collect = []; // 暫存node
	var layer = 0;
	for (let i = 0; i < ui_user; i++) {
		categories = data.category.filter((category) => {
			if (minus.includes(category.target) || minus.includes(category.source)) {
				let answer  = false;
					if (keyword.lineName.length !== 0) {
						//看看有沒有個別線的條件
						keyword.lineName.forEach((item) => {
							if (item.includes(category.name)) {
								//看看這條線有沒有在條件內
								if (item.length > 1) {
									//如果條件為多種關係組合
									let bench = [];
									data.category.forEach(cat =>{
										if(cat.target === category.target && cat.source === category.source)
											bench.push(cat.name);
										else if(cat.target === category.source && cat.source === category.target)
											bench.push(cat.name);
									});
									let c = 0;
									item.forEach(a=>{
										if(bench.includes(a))
										c++;
									});
									if(c ===  item.length)
										answer = true;
								} else {
									answer =  true;
								}
							}
						});
					}
				else{
					answer =  true;
				}
					if (category.show === true && answer == true) {
						collect.push(category.target, category.source);
						return category;
					}
			}
		});
		
		//將找到的點去掉重複和搜尋的項目
		minus = collect.filter((item) => {
			return !item.includes(keyword.nodeName);
		});
		minus = Array.from(new Set(minus));
		if (categories.length === layer) {
			//跑到最大階層後就停下來
			let maxlevel = i;
			for (var x = 1; x <= maxlevel; x++) {
				//調整最大階層的sliderbar
				if (!result.routeHash.includes(x)) result.routeHash.push(x);
			}
			result.routeHash.sort(function(a, b) {
				return a - b;
			});
			break;
		} else layer = categories.length; //沒有到最大就繼續跑
	}
	collect = []; // 暫存node
	links = categories.filter((category) => {
		//將要顯示的線整理起來
		if (category.show == true) {
			collect.push(category.source, category.target);
			return category;
		}
	});
	collect = Array.from(new Set(collect));
	nodes = data.nodes.filter((node) => {
		//將要顯示的點整理起來
		return collect.includes(node.name);
	});
	nodes.filter((node) => {
		//將收旬的點改成紅色，但不能影響原始資料
		if(keyword.nodeName.includes(node.name))
         	node.itemStyle.color = 'red'
		return node;
	});
	dataAppendOr(categories, links, nodes); //將資料整合起來
	}
/**
 * 處理線段or的搜尋，並將結果傳給{@link dataAppendOr()}整合搜尋結果
 * @param {object} keyword 搜尋的目標
 */
function lineOr(keyword) {
	let categories = [], //存要傳給dataAppendOr()顯示在畫面上的資料
		links,
		nodes;
	let collect = []; //存要顯示的點
	if (keyword.lineName.length !== 0) {
		//處理線的條件，只是dta_filter()的縮減版，參考一下
		keyword.lineName.forEach((item) => {
			data.category.forEach((category) => {
					if (category.show === true) {
						if (item.includes(category.name)) {
							if (item.length > 1) {
								let bench = [];
								data.category.forEach(cat =>{
									if(cat.target === category.target && cat.source === category.source)
										bench.push(cat.name);
									else if(cat.target === category.source && cat.source === category.target)
										bench.push(cat.name);
								});
								let c = 0;
								item.forEach(a=>{
									if(bench.includes(a))
									c++;
								});
								if(c ===  item.length){
									collect.push(category.target, category.source);
									categories.push(category);
								}
							} else {
								collect.push(category.target, category.source);
								categories.push(category);
							}
						}
					}
			});
		});
	}
	links = categories;
	collect = Array.from(new Set(collect));
	nodes = data.nodes.filter((node) => {
		return collect.includes(node.name);
	});
	dataAppendOr(categories, links, nodes); 
}
/**
 * @description 搜尋多節點之間的所有路徑，方法:先用flooding演算法找出整理過搜尋範圍，並去掉多餘的線與點，再交由底下的參考範例時做出類老鼠迷宮，找出所有路線
 * @see {@link https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/713294/2} 參考範例
 */
function andSearch(keyword, route, searchRangeData) {
	let routeTemp = [];
	//類老鼠迷宮演算法
		let primaryStack = new Array(); //參考了老鼠迷宮的做法，這是主堆疊
		let secondaryStack = new Array(); //副堆疊
		let temp2 = new Array(); //當次搜尋的結果
		let Finish = true; //是否完成
		let keywordTemp = keyword.nodeName[0]; //搜尋目標
		let nodeCollection;
		let secondaryStackCount = -1; //存副堆疊長度
		let goal = keyword.nodeName[keyword.nodeName.length];
		do {
			//找出與目標有關的線
			temp2 = [];
			nodeCollection = [];
			primaryStack.push(keywordTemp);
			let temp = [];
			if (keyword.lineName.length !== 0) {
				//篩選掉線段限制，大部分和data_filter()一樣
				keyword.lineName.forEach((item) => {
					let bench = [];
					searchRangeData.filter((category) => {
						if (keywordTemp === category.target || keywordTemp === category.source) {
								if (item.includes(category.name)) {
									if (item.length > 1) {
											bench.push(category.target, category.source);
									} else {
										union_collect.push(category.target, category.source);
										temp.push(category);
									}
								}
						}
					});
					if (item.length > 1) {
						for (let i = 1; i < item.length; i++)
							bench = bench.filter(function(element, index, arr) {
								return arr.indexOf(element) !== index;
							});
						dataSet = searchRangeData.filter((category) => {
							if (keywordTemp === category.target || keywordTemp === category.source) {
								return category
							}
						});
						temp = searchLine2Filter(item, bench, searchRangeData, dataSet);
						temp.forEach((category) => {
						collect.push(category.target, category.source);
					});
					}
				});
			} else {
				temp = searchRangeData.filter((category) => {
					if (keywordTemp === category.target || keywordTemp === category.source) return category;
				});
			}
			// console.log(temp);
			temp.filter((category) => {
				//將線段的兩端節點存入nodeCollection
				nodeCollection.push(category.target, category.source);
			});
			nodeCollection = Array.from(new Set(nodeCollection));
			for (let i = 0, uLen = nodeCollection.length; i < uLen; i++) {
				//將nodeCollection中走過的路線刪掉
				if (!primaryStack.includes(nodeCollection[i])) {
					temp2.push(nodeCollection[i]);
				}
			}
			secondaryStack.push(temp2); //將結果存入副堆疊
			secondaryStackCount++; //副堆疊長度++
			if (primaryStack[primaryStack.length - 1] == goal) {
				//如果路線最後一點是目標
				routeTemp.push(Array.from(primaryStack)); //存入路線陣列
				console.log(primaryStack);
				for (var i = 0, uLen = secondaryStack.length; i < uLen; i++) {
					if (secondaryStack[i].length != 0) {
						//副堆疊等於0就算是結束了
						Finish = false;
						break;
					}
				}
				if (Finish == true) {
					break;
				} else {
					Finish = false;
				}
			}
			if (primaryStack.length == 0 && routeTemp.length == 0) return andSearchNoRoute(keyword.nodeName); //如果路線和路線陣列的長度都是0就算結束
			do {
				//遇到死路的處理:主堆疊pop出去由副堆疊pop出一個值PUSH進去
				//下一個節點選法:副堆疊pop出一個值PUSH進去
				//如果下一個節點走過了:主堆疊pop出去由副堆疊pop出一個值PUSH進去
				while (secondaryStack[secondaryStackCount].length == 0) {
					//遇到二維陣列的pop值是空的
					if (secondaryStackCount == 0) {
						//真的是空的就結束
						break;
					}
					primaryStack.pop();
					secondaryStack.pop();
					secondaryStackCount--;
				}
				keywordTemp = secondaryStack[secondaryStackCount].pop();
			} while (primaryStack.includes(keywordTemp)); //一直都有就一直pop
			if (keywordTemp == undefined) {
				//到最後都還是空的就出去
				break;
			}
		} while (1);
	console.log('YA!!!!!');
	var end = new Date().getTime();
	console.log('timer', end - start);
	console.log(routeTemp.length);
	console.log(routeTemp);
	for (var i = 0; i < routeTemp.length; i++) {
		var count = 0;
		keyword.nodeName.forEach((item) => {
			if (routeTemp[i].includes(item)) count++;
		});
		if (count != keyword.nodeName.length) {
			//如果路線沒有所有目標點都經過就必須去掉
			routeTemp.splice(i, 1);
			i--;
		}
	}
	routeTemp.forEach((item) => {
		//加入路線，並以距離排序
		route.push(item);
	});
	console.log('finish');
}
/**
 * 運用flooding演算法寫成的and搜尋功能，性能大幅提升
 * @param {object} keyword - 搜尋的目標
 * @param {(number|string)} routeFloor - 搜尋的階層，可以參考{@link routeFloor}
 * @throws andSearchNoRoute {@link andSearchNoRoute }
 * @returns dataAppendOr 將結果整合
 */
function floodingSearch(keyword, searchFloor){
	let lineStack = {};
	let lockLine = new Array();
	data.category.forEach(item=>{
		lineStack[item.id] = 0;
	});
	for(let i=0;i<keyword.nodeName.length;i++){ 
		let c = 0;
		let secondaryStack = new Array(keyword.nodeName[i]);
		lockLine = [];
		do{
		c++;
		let union_collect = [];
		data.category.filter((category) => {
			//搜尋陣列理的節點連到的下一個節點
			if (secondaryStack.includes(category.target) || secondaryStack.includes(category.source)) {
					if (category.show === true && !lockLine.includes(category.id)) {
						let answer  = false;
						if (keyword.lineName.length !== 0) {
							//看看有沒有個別線的條件
							keyword.lineName.forEach((item) => {
								if (item.includes(category.name)) {
									//看看這條線有沒有在條件內
									if (item.length > 1) {
										//如果條件為多種關係組合
										let bench = [];
										data.category.forEach(cat =>{
											if(cat.target === category.target && cat.source === category.source)
												bench.push(cat.name);
											else if(cat.target === category.source && cat.source === category.target)
												bench.push(cat.name);
										});
										let c = 0;
										item.forEach(a=>{
											if(bench.includes(a))
											c++;
										});
										if(c ===  item.length)
											answer = true;
									} else {
										answer =  true;
									}
								}
							});
						}
						else{
							answer =  true;
						}
						if(answer ===  true){
							if(secondaryStack.includes(category.target)){
								union_collect.push(category.source);
							}else{
								union_collect.push(category.target);
							}
							lockLine.push(category.id);
								lineStack[category.id] = lineStack[category.id] + c;
						}
	  				} 
			}
		});
		secondaryStack = Array.from(new Set(union_collect)); //去掉重複的節點
		if (secondaryStack.length === 0) break; //如果下一次沒東西就跳出去
	} while(1);
		lineStack = objectRemover(lineStack, lockLine);
	}
	let unionCollect = [];
	let categories = data.category.filter(category =>{
		if(lineStack.hasOwnProperty(category.id)){
			unionCollect.push(category.target,category.source);
			return category
		}
	});
	let count = 0;
	keyword.nodeName.forEach(item=>{
		if(unionCollect.includes(item))
			count++;
	});
	if(count < keyword.nodeName.length){
		return andSearchNoRoute(keyword.nodeName);
	}
	lockLine = [];
	let range = searchFilter(unionCollect, keyword);
	data.category.forEach(category =>{
		if(range.includes(category.source) && range.includes(category.target))
			lockLine.push(category.id);
	});
	lineStack = objectRemover(lineStack, lockLine);
	lockLine.forEach(item=>{
		lineStack[item] = Math.floor(lineStack[item]/keyword.nodeName.length);
		if(!result.routeHash.includes(lineStack[item]))
			result.routeHash.push(lineStack[item])
	});
	// console.log(result.routeHash)
	// console.log(lineStack);
	result.routeHash.sort(function(a, b) {
		return a - b;
	});
	console.log(result.routeHash);
	if(searchFloor === 'All'){
		searchFloor = result.routeHash[result.routeHash.length - 1];
	}
	unionCollect = [];
	categories = data.category.filter(category =>{
		if(lineStack.hasOwnProperty(category.id) && lineStack[category.id] <= searchFloor){
			unionCollect.push(category.target,category.source);
			return category;
		}
	});
	unionCollect = searchFilter(unionCollect, keyword)
	categories = data.category.filter(category =>{
		if(unionCollect.includes(category.target)&& unionCollect.includes(category.source))
			return category;
	});
	let links = categories.filter((category) => {
		//將要顯示的線整理起來
		if (category.show == true)  return category;
	});
	let nodes = data.nodes.filter((node) => {
		//將要顯示的點整理起來
		return unionCollect.includes(node.name);
	});
	nodes.filter((node) => {
		//將收旬的點改成紅色，但不能影響原始資料
		if(keyword.nodeName.includes(node.name))
         	node.itemStyle.color = 'red'
		return node;
	});
	dataAppendOr(categories, links, nodes); //將資料整合起來
	/**
	 * 將物件陣列移除
	 * @memberof floodingSearch
	 * @param {object} object - 資料
	 * @param {array} keepId - 要留下來的線段id
	 * @returns {object}處理完的資料
	 */
	function objectRemover(object, keepId){
		let temp = {};
		keepId.forEach(item =>{
			temp[item] = object[item];
		})
		return temp;
		
	}
	/**
	 * 去掉不是終點的端點
	 * @memberof floodingSearch
	 * @param {*} range 資料集
	 * @param {*} keyword 搜尋的項目
	 * @returns {array} 篩選後剩下的節點
	 */
	function searchFilter(range, keyword){
		do{
			let unionCollect = [];
			data.category.forEach(category =>{
				if(range.includes(category.target) && range.includes(category.source)){
					unionCollect.push(category.target,category.source);
				}
			});
			range = unionCollect.filter(function(element, index, arr){
				if(keyword.nodeName.includes(element))
					return element;
				else 	
				return arr.indexOf(element) !== index;
			});
			unionCollect = Array.from(new Set(unionCollect)); 
			range = Array.from(new Set(range)); 
			if(unionCollect.length === range.length)
			break;
		}while(1)
		return range;
	}
}

function data_filter_and(route, routeFloor) {
	var categories = [],
		links = [],
		nodes = [];
	var temp = [];
	var nodeCollection = [];
	if (routeFloor === 'All') {
		var y = 0;
	} else {
		for (var i = 0, q = route.length; i < q; i++) {
			if (route[i].length - 1 === routeFloor) {
				y = i;
				break;
			}
		}
	}
	for (; y < route.length; y++) {
		for (var i = 0, len = route[y].length; i < len - 1; i++)
			var temp = temp.concat(
				data.category.filter((category) => {
					if (route[y][i].includes(category.target) && route[y][i + 1].includes(category.source)) {
						if (category.show === true) {
							return category;
						}
					} else if (route[y][i + 1].includes(category.target) && route[y][i].includes(category.source)) {
						if (category.show === true) {
							return category;
						}
					}
				})
			);
		let a = categories.map(function(item, index, array) {
			return item.id;
		});
		temp = temp.filter((category) => {
			return !a.includes(category.id);
		});
		nodeCollection = nodeCollection.concat(route[y]);
		nodeCollection = Array.from(new Set(nodeCollection));
		categories = categories.concat(temp);
		if (y + 1 === route.length) break;
		if (routeFloor !== 'All' && route[y].length !== route[y + 1].length) break;
	}
	links = categories.filter((category) => {
		if (category.show == true) {
			return category;
		}
	});
	nodes = data.nodes.filter((node) => {
		return nodeCollection.includes(node.name);
	});
	dataAppendOr(categories, links, nodes);
}
/**
 * 將許多收尋結果整合在一起，並存到result的物件中
 * @param {object} categories - 搜尋到的線段結果
 * @param {object} links - 要顯示的線段結果
 * @param {object} nodes - 要顯示的節點
 */
function dataAppendOr(categories, links, nodes) {
	let a = result.category.map(function(item, index, array) {
		return item.id;
	});
	categories = categories.filter((category) => {
		return !a.includes(category.id);
	});
	result.category = result.category.concat(categories);
	a = result.links.map(function(item, index, array) {
		return item.id;
	});
	links = links.filter((links) => {
		return !a.includes(links.id);
	});
	result.links = result.links.concat(links);
	a = result.nodes.map(function(item, index, array) {
		return item.name;
	});
	nodes = nodes.filter((node) => {
		return !a.includes(node.name);
	});
	result.nodes = result.nodes.concat(nodes);
}