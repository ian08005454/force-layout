import { data } from "./mainSetting.js";
/**
* 
* 給max_level slider的對照表
* @type {array}
*/
var result ={
	nodes: [],
	links: [],
	category: [],
	routeHash:[],
	route: []
}
export function searchKeyword( keywordCollection, routeFloor){
	result.links = [];
	result.category = [];
	result.nodes = [];
	result.route = [];
	result.routeHash = [];
	keywordCollection.forEach((item) => {
		if (item.nodeName.length === 0) lineOr(item);
		else if (item.nodeName.length === 1) data_filter(item, routeFloor);
		else search_AND( item, result.route);
	});
	if(result.route.length !== 0){
		result.route.forEach((item) => {//調整最大階層的sliderbar
			if (!result.routeHash.includes(item.length-1)) result.routeHash.push(item.length-1);
		});
		result.routeHash.sort(function(a, b) {
			return a - b;
		});
		data_filter_and(result.route, routeFloor);
	}
	return result;
}
export function changeMaxlevel(keywordCollection, routeFloor){
	result.links = [];
	result.category = [];
	result.nodes = [];
	keywordCollection.forEach((item) => {
		if (item.nodeName.length === 0) lineOr(item);
		else if (item.nodeName.length === 1) data_filter(item, routeFloor);
	});
	if(result.route.length !== 0)
	data_filter_and(result.route, routeFloor);
	return result;
}
/**
 * 回報找不到路線
 * @param {string} keyword_search_name 
 */
function andSearchNoRoute(keyword_search_name) {
	alert(`Error2 : 搜尋不到路徑 : ${keyword_search_name}`);
}
/**
 * 
 * @param {array} item  搜尋的目標
 * @param {array} bench 有相關的節點
 * @param {Array} categories  之前搜尋到的結果，要繼續加在裡面
 * @param {object} dataSet 尋找的資料集
 */
function searchLine2Filter(item, bench, categories, dataSet = data.category){
	let count = [];//存入用bench的資料找出相關的線
	//只有條件為多種關係的情況才需要執行
	for (let i = 1; i < item.length; i++)
			bench = bench.filter(function(element, index, arr) {
			return arr.indexOf(element) !== index;
		});
		//找出與條件數量一樣多次的點
		dataSet.filter((category) => {		//找出串聯點的線
			if (category.show === true) {
				if (item.includes(category.name)) {
					if (bench.includes(category.target) && bench.includes(category.source)) {
						count.push(category);
					}
				}
			}
	});
	//確保剩下的節點所串成的路徑都與條件相符，確認是否有多條一樣的target and source
	count.forEach((element) => {
		let a = count.filter((category) => {
			if (element.target === category.target && element.source === category.source){
				if(element.name === category.name && element.id === category.id)
					return category;
				else if(element.name !== category.name)	return category;
			}
			else if (element.target === category.source && element.source === category.target){
				if(element.name != category.name)
					return category;
			}
		});
		if (a.length === item.length) {
			categories.push(element);
		}
	});
	return categories
}
/**
 * 單一和or搜尋的function，會用searchTarget的資訊尋找出的點，並傳給{@link dataAppendOr()}整合搜尋結果
 * @param {object} keyword 搜尋的目標
 * @param {object} routeFloor 要搜尋到的階層
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
		if (keyword.lineName.length !== 0) {
			//看看有沒有個別線的條件
			keyword.lineName.forEach((item) => {
				let bench = []; //用來計算點出現的次數
				data.category.filter((category) => {
					if (minus.includes(category.target) || minus.includes(category.source)) {
							if (category.show === true) {
								//沒有被not掉的線
								if (item.includes(category.name)) {
									//看看這條線有沒有在條件內
									if (item.length > 1) {
										//如果條件為多種關係組合
											bench.push(category.target, category.source); //放入bench裡
									} else {
										collect.push(category.target, category.source);
										categories.push(category); //準備要加入圖中
									}
								}
							}
					}
				});
				if (item.length > 1) {
					var dataSet = data.category.filter((category) => {
						if (minus.includes(category.target) || minus.includes(category.source)) 
							return category
					});
					categories = searchLine2Filter(item, bench, categories, dataSet);
					categories.forEach((category) => {
						collect.push(category.target, category.source);
					});
				}
			});
		} else {
			//甚麼都沒有就直接找到現存起來
			categories = data.category.filter((category) => {
				if (minus.includes(category.target) || minus.includes(category.source)) {
						if (category.show === true) {
							collect.push(category.target, category.source);
							return category;
						}
				}
			});
		}
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
	dataAppendOr(categories, links, nodes); //將資料整合起來
	}
/**
 * 專門處理線段or的搜尋
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
			let bench = [];
			data.category.filter((category) => {
					if (category.show === true) {
						if (item.includes(category.name)) {
							if (item.length > 1) {
								bench.push(category.target, category.source);
							} else {
								console.log(category.name)
								collect.push(category.target, category.source);
								categories.push(category);
							}
						}
					}
			});
			if (item.length > 1) {
				categories = searchLine2Filter(item, bench, categories, dataSet);
					categories.forEach((category) => {
						collect.push(category.target, category.source);
					});
			}
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
 * @method search_AND
 *  @memberof searchTarget
 * @description 搜尋多節點之間的所有路徑，方法:先用flooding演算法找出整理過搜尋範圍，並去掉多餘的線與點，再交由底下的參考範例時做出類老鼠迷宮，找出所有路線
 * @see {@link https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/713294/2} 參考範例
 */
function search_AND(keyword, route) {
	let first = []; //存入各個節點到其他節點的最短距離
	let routeTemp = [];
	keyword.nodeName.forEach((item) => {
		let minus = [];
		minus.push(item);
		let category_collect = [];
		count = 0;
		do {
			//基礎的or搜尋
			data.category.filter((category) => {
				if (minus.includes(category.target) || minus.includes(category.source)) {
					category_collect.push(category.target, category.source);
					return category;
				}
			});
			category_collect = Array.from(new Set(category_collect));
			// console.log(category_collect);
			minus = category_collect.filter((items) => {
				return !items.includes(item);
			});
			count++;
			var countdown = 0;
			keyword.nodeName.forEach((item) => {
				if (minus.includes(item)) countdown++;
			});
			if (countdown === keyword.nodeName.length - 1) {
				//在要顯示的點鐘找到所有的點就停止
				break;
			}
		} while (1);
		first.push(count); //記錄階層數
	});
	first.sort(function(a, b) {
		//將所有節點的距離排序
		return b - a;
	});
	console.log(first);
	//類flooding演算法
	let goalCount = new Array(); //儲存到目標的路徑長度
	let nodeStack = new Array(); //存搜到的點[節點名稱,距離]
	let secondaryStack = new Array(); //存當次要搜尋的節點
	nodeStack.push(new Array(keyword.nodeName[0]));
	nodeStack.push(new Array());
	nodeStack[1].push(0);
	secondaryStack.push(keyword.nodeName[0]);
	let goal = keyword.nodeName[1];
	let categories = [];
	let c = 0; //階層數
	let union_collect = [];
	do {
		c++;
		categories = [];
		let union_collect = [];
		data.category.filter((category) => {
			//搜尋陣列理的節點連到的下一個節點
			if (secondaryStack.includes(category.target) || secondaryStack.includes(category.source)) {
					if (category.show === true) {
						//如果節點是目標則加入距離到goalCount
						if (category.target === goal || category.source === goal) goalCount.push(c);
						else if (!nodeStack[0].includes(category.target)) {
							//如果節點不在陣列裡面就放進去
							union_collect.push(category.target);
							nodeStack[0].push(category.target);
							nodeStack[1].push(c);
						} else if (!nodeStack[0].includes(category.source)) {
							union_collect.push(category.source);
							nodeStack[0].push(category.source);
							nodeStack[1].push(c);
						}
					}
			}
		});
		union_collect = Array.from(new Set(union_collect)); //去掉重複的節點
		secondaryStack = union_collect.filter((item) => {
			//去掉目標後加入下一次搜尋
			if (item !== goal) return item;
		});
		if (secondaryStack.length === 0) break; //如果下一次沒東西就跳出去
	} while (1);
	console.log('YA!!!!!');
	console.log(nodeStack);
	goalCount = Array.from(new Set(goalCount));
	console.log(goalCount);
	goalCount.sort(function(a, b) {
		return b - a;
	});
	let largest = goalCount[0];
	nodeStack[1].forEach(function(item, index, array) {
		//去掉距離超過目標最大值的節點，因為絕對不會經過
		if (item >= largest) {
			nodeStack[1].splice(index, 1);
			nodeStack[0].splice(index, 1);
		}
	});
	nodeStack[0].push(goal);
	nodeStack[1].push(largest);
	categories = data.category.filter((category) => {
		//將與陣列中的點有關的線篩選出來
		if (nodeStack[0].includes(category.target) && nodeStack[0].includes(category.source)) {
				return category;
		}
	});
	do {
		nodeStack[0].forEach(function(item, index, array) {
			//將不是目標的終點去掉
			if (item !== goal) {
				let temp = categories.filter((category) => {
					if (category.target === item) {
						if (nodeStack[1][nodeStack[0].indexOf(category.source)] > nodeStack[1][index])
							return category;
					} else if (category.source === item) {
						if (nodeStack[1][nodeStack[0].indexOf(category.target)] > nodeStack[1][index])
							return category;
					}
				});
				if (temp.length === 0) {
					nodeStack[1].splice(index, 1);
					nodeStack[0].splice(index, 1);
				}
			}
		});
		let last = categories.length;
		categories = categories.filter((category) => {
			//取的刪除終點後線的資料
			if (nodeStack[0].includes(category.target) && nodeStack[0].includes(category.source)) {
				return category;
			}
		});
		if (categories.length === last) break; //如果刪除前後長度一樣就結束
	} while (1);
	//類老鼠迷宮演算法
	for (let z = 1; z < keyword.nodeName.length; z++) {
		//為了因應可能會有fully connection 的情況，我想需要針對所有的條件節點運算一次
		let primaryStack = new Array(); //參考了老鼠迷宮的做法，這是主堆疊
		let secondaryStack = new Array(); //副堆疊
		let temp2 = new Array(); //當次搜尋的結果
		let Finish = true; //是否完成
		let keywordTemp = keyword.nodeName[0]; //搜尋目標
		let nodeCollection;
		let secondaryStackCount = -1; //存副堆疊長度
		let goal = keyword.nodeName[z];
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
					categories.filter((category) => {
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
						dataSet = categories.filter((category) => {
							if (keywordTemp === category.target || keywordTemp === category.source) {
								return category
							}
						});
						temp = searchLine2Filter(item, bench, categories, dataSet);
						temp.forEach((category) => {
						collect.push(category.target, category.source);
					});
					}
				});
			} else {
				temp = categories.filter((category) => {
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
	}
	console.log('YA!!!!!');
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
function data_filter_and(data, route, routeFloor) {
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