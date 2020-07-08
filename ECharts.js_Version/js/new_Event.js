/**
   * @file new_Event
   * @author Wei-Jie Li
   * @createDate 2020-05-21
   */
/**
   * @desc 儲存使用者搜尋的項目(僅包含node中的and和or搜尋)
   * @var {array}
   */
var keyword = [];
/**
   * @desc 儲存整理後的搜尋項目
   * @var {array}
   */
var keywordCollection = [];
/**
   * @desc 儲存and搜尋的路線
   * @var {array}
   */
var route = [];
/**
   * 儲存max_level slider的現值
   * @type {string}
   */
var routeFloor = 'All';
/**
   * 給max_level slider的對照表
   * @type {array}
   */
var routeHash = [];
/**
   * a cpoy of route
   * @type {array}
   */
var routeBackup = [];
/**
   * 紀錄前面多少次搜尋是與這次搜尋有關連
   * @type {number}
   */
var keywordCount = 0;
/**
   * 紀錄與這一次搜尋有關連的搜尋的位置
   * @type {number}
   */
var keywordPoint = 0;
/**
   * 使用者輸入的內容
   * @type {string}
   */
var keyword_search_name;
/**
   * 儲存所有搜尋項目
   * @type {array}
   */
var keywords = [];
/**
   * 所搜尋不要出現的人物
   * @type {array}
   */
var notKeyword = [];
let allLine = data.all_category.map(function(item, index, array) {
	return item.name;
});
var mustLine = [];
let lineStack = [];
let afterOr = false;
window.onresize = () => {
	Chart.resize();
};
/**
 * @class 處理過的 search object
 */
class searchTarget {
	constructor(nodeName, lineName, lineName2) {
		this.nodeName = nodeName;
		this.lineName = lineName;
		this.lineName2 = lineName2;
	}
	data_filter() {
		if (routeFloor === 'All') {
			var ui_user = 100;
		} else {
			ui_user = routeFloor;
		}
		var categories = [],
			links,
			nodes;
		let union_collect = [];
		let collect = [];
		let category_collect = [];
		if (this.lineName.length !== 0) {
			this.lineName.forEach((item) => {
				let bench = [];
				let count = [];
				data.category.filter((category) => {
					if (this.nodeName.includes(category.target) || this.nodeName.includes(category.source)) {
						if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
							if (category.show === true) {
								if (item.includes(category.name)) {
									if (item.length > 1) {
										bench.push(category.target, category.source);
									} else {
										union_collect.push(category.target, category.source);
										categories.push(category);
									}
								}
							}
						}
					}
				});
				if (item.length > 1) {
					for (let i = 1; i < item.length; i++)
						bench = bench.filter(function(element, index, arr) {
							return arr.indexOf(element) !== index;
						});
					console.log(bench);
					data.category.filter((category) => {
						if (this.nodeName.includes(category.target) || this.nodeName.includes(category.source)) {
							if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
								if (category.show === true) {
									if (item.includes(category.name)) {
										if (bench.includes(category.target) && bench.includes(category.source)) {
											count.push(category);
										}
									}
								}
							}
						}
					});
					count.forEach((element) => {
						let a = count.filter((category) => {
							if (element.target === category.target && element.source === category.source)
								return category;
							else if (element.target === category.source && element.source === category.target)
								return category;
						});
						if (a.length === item.length) {
							categories.push(element);
							union_collect.push(element.target, element.source);
						}
					});
				}
			});
		} else {
			categories = data.category.filter((category) => {
				if (this.nodeName.includes(category.target) || this.nodeName.includes(category.source)) {
					if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
						if (category.show === true) {
							union_collect.push(category.target, category.source);
							return category;
						}
					}
				}
			});
		}
		let minus = union_collect.filter((item) => {
			return !item.includes(this.nodeName);
		});
		minus = Array.from(new Set(minus));
		var layer = 0;
		for (let i = 1; i < ui_user; i++) {
			categories = [];
			if (this.lineName.length !== 0) {
				this.lineName.forEach((item) => {
					bench = [];
					count = [];
					data.category.filter((category) => {
						if (minus.includes(category.target) || minus.includes(category.source)) {
							if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
								if (category.show === true) {
									if (item.includes(category.name)) {
										if (item.length > 1) {
											bench.push(category.target, category.source);
										} else {
											union_collect.push(category.target, category.source);
											categories.push(category);
										}
									}
								}
							}
						}
					});
					if (item.length > 1) {
						for (let i = 1; i < item.length; i++)
							bench = bench.filter(function(element, index, arr) {
								return arr.indexOf(element) !== index;
							});
						console.log(bench);
						data.category.filter((category) => {
							if (minus.includes(category.target) || minus.includes(category.source)) {
								if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
									if (category.show === true) {
										if (item.includes(category.name)) {
											if (bench.includes(category.target) && bench.includes(category.source)) {
												count.push(category);
											}
										}
									}
								}
							}
						});
						count.forEach((element) => {
							let a = count.filter((category) => {
								if (element.target === category.target && element.source === category.source)
									return category;
								else if (element.target === category.source && element.source === category.target)
									return category;
							});
							if (a.length === item.length) {
								categories.push(element);
								union_collect.push(element.target, element.source);
							}
						});
					}
				});
			} else {
				categories = data.category.filter((category) => {
					if (minus.includes(category.target) || minus.includes(category.source)) {
						if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
							if (category.show === true) {
								union_collect.push(category.target, category.source);
								return category;
							}
						}
					}
				});
			}
			category_collect = Array.from(new Set(union_collect));
			console.log(categories);
			minus = category_collect.filter((item) => {
				return !item.includes(this.nodeName);
			});
			if (categories.length === layer) {
				let maxlevel = i;
				for (var x = 1; x <= maxlevel; x++) {
					if (!routeHash.includes(x)) routeHash.push(x);
				}
				routeHash.sort(function(a, b) {
					return a - b;
				});
				maxLevelSlider(routeHash.length);
				break;
			} else layer = categories.length;
		}
		links = categories.filter((category) => {
			if (category.show == true) {
				collect.push(category.source, category.target);
				return category;
			}
		});
		collect = Array.from(new Set(collect));
		nodes = data.nodes.filter((node) => {
			keywords.includes(node.name)
				? (node.itemStyle.normal.color = 'red')
				: (node.itemStyle.normal.color = user_colors[node.gp]);
			return collect.includes(node.name);
		});
		dataAppendOr(categories, links, nodes);
	}
	lineOr() {
		let categories = [],
			links,
			nodes;
		let collect = [];
		let Filter = [];
		if (this.lineName.length !== 0) {
			this.lineName.forEach((item) => {
				let count = [];
				let bench = [];
				data.category.filter((category) => {
					if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
						if (category.show === true) {
							if (item.includes(category.name)) {
								if (item.length > 1) {
									bench.push(category.target, category.source);
								} else {
									collect.push(category.target, category.source);
									categories.push(category);
								}
							}
						}
					}
				});
				if (item.length > 1) {
					for (let i = 1; i < item.length; i++)
						bench = bench.filter(function(element, index, arr) {
							return arr.indexOf(element) !== index;
						});
					console.log(bench);
					data.category.filter((category) => {
						if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
							if (category.show === true) {
								if (item.includes(category.name)) {
									if (bench.includes(category.target) && bench.includes(category.source)) {
										count.push(category);
									}
								}
							}
						}
					});
					count.forEach((element) => {
						let a = count.filter((category) => {
							if (element.target === category.target && element.source === category.source)
								return category;
							else if (element.target === category.source && element.source === category.target)
								return category;
						});
						if (a.length === item.length) {
							categories.push(element);
							collect.push(element.target, element.source);
						}
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
 * 搜尋多人物之間的所有路徑<br/>
 * @see {@link https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/713294/2} 參考範例
 * @param {array} keyword_search_name_s 處理過的使用者輸入陣列
 */
search_AND() {
	let first = [];
	let routeTemp = [];
	this.nodeName.forEach((item) => {
		 let minus = [];
		minus.push(item);
		let category_collect = [];
		count = 0;
		do {
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
			this.nodeName.forEach((item) => {
				if (minus.includes(item)) countdown++;
			});
			if (countdown === this.nodeName.length - 1) {
				break;
			}
		} while (1);
		first.push(count);
	});
	console.log(first);
	var top = 0,
		topVal = 0;
	first.forEach(function(item, index, array) {
		if (item > topVal) {
			top = index;
			topVal = item;
		}
	});
	for (let z = 1; z < this.nodeName.length; z++) {
		let primaryStack = new Array();
		let secondaryStack = new Array();
		let temp2 = new Array();
		let Finish = true;
		let keywordTemp = this.nodeName[top];
		let nodeCollection;
		let secondaryStackCount = -1;
		let goal = this.nodeName[z];
		do {
			temp2 = [];
			nodeCollection = [];
			primaryStack.push(keywordTemp);
			let temp = [];
			if (this.lineName.length !== 0) {
				this.lineName.forEach((item) => {
					bench = [];
					count = [];
					data.category.filter((category) => {
						if (keywordTemp.includes(category.target) || keywordTemp.includes(category.source)) {
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
						console.log(bench);
						data.category.filter((category) => {
							if (keywordTemp.includes(category.target) || keywordTemp.includes(category.source)) {
								if (item.includes(category.name)) {
									if (bench.includes(category.target) && bench.includes(category.source)) {
										count.push(category);
									}
								}
							}
						});
						count.forEach((element) => {
							let a = count.filter((category) => {
								if (element.target === category.target && element.source === category.source)
									return category;
								else if (element.target === category.source && element.source === category.target)
									return category;
							});
							if (a.length === item.length) {
								categories.push(element);
								union_collect.push(element.target, element.source);
							}
						});
					}
				});
			} else {
				temp = data.category.filter((category) => {
					if (keywordTemp.includes(category.target) || keywordTemp.includes(category.source)) return category;
				});
			}
			// console.log(temp);
			temp.filter((category) => {
				nodeCollection.push(category.target, category.source);
			});
			nodeCollection = Array.from(new Set(nodeCollection));
			for (let i = 0, uLen = nodeCollection.length; i < uLen; i++) {
				if (!primaryStack.includes(nodeCollection[i])) {
					temp2.push(nodeCollection[i]);
				}
			}
			secondaryStack.push(temp2);
			secondaryStackCount++;
			if (primaryStack[primaryStack.length - 1] == goal) {
				routeTemp.push(Array.from(primaryStack));
				for (var i = 0, uLen = secondaryStack.length; i < uLen; i++) {
					if (secondaryStack[i].length != 0) {
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
			if (primaryStack.length == 0 && routeTemp.length == 0) return andSearchNoRoute(keyword_search_name);
			do {
				while (secondaryStack[secondaryStackCount].length == 0) {
					if (secondaryStackCount == 0) {
						break;
					}
					primaryStack.pop();
					secondaryStack.pop();
					secondaryStackCount--;
				}
				keywordTemp = secondaryStack[secondaryStackCount].pop();
			} while (primaryStack.includes(keywordTemp));
			if (keywordTemp == undefined) {
				break;
			}
		} while (1);
	}
	console.log('YA!!!!!');
	console.log(routeTemp.length);
	console.log(routeTemp);
	for (var i = 0; i < routeTemp.length; i++) {
		var count = 0;
		this.nodeName.forEach((item) => {
			if (routeTemp[i].includes(item)) count++;
		});
		if (count != this.nodeName.length) {
			routeTemp.splice(i, 1);
			i--;
		}
	}
	// if (routeTemp.length === 0)
	// 	return andSearchNoRoute(keyword_search_name);
	routeTemp.forEach((item) => {
		route.push(item);
	});
	route.sort(function(a, b) {
		if (a.length > b.length) {
			return 1;
		}
		if (a.length < b.length) {
			return -1;
		}
		return 0;
	});
	routeBackup = JSON.parse(JSON.stringify(route));
}
////搜尋兩個AND --end --
}
/**
 * @class store search
 */
class searchWord {
	constructor(type, name, model) {
		this.name = name;
		this.type = type;
		this.model = model;
	}
	keywordCheck(){
		let name_s = [];
		let name_ss = [];
		if(this.name.includes('|'))
			name_s = this.name.split('|');
		else
			name_s.push(this.name);
		name_s.forEach(item =>{
			if(item.includes('&')){
				item = item.split('&');
				item.forEach(t =>{
					name_ss.push(t);
				});
			}
			else
				name_ss.push(item);
		});
		console.log(name_ss);
		if(this.model === 'node')
		name_ss.forEach(item =>{
			if(!data.all_nodes.includes(item))
			throw keyword_search_verify_fail(this.name);
		});	
		else
		name_ss.forEach(item =>{
			if(!allLine.includes(item))
			throw keyword_search_verify_fail(this.name);
		});	
	}
	/**
 * 組合並整理使用者傳入的內容
 */
	keywordCleanUp() {
		let keyword_search_name_s = [];
		if (this.type === 'and') {
			if (this.name.includes('|')) {
				keyword_search_name_s = this.name.split('|');
				if (keywordCount === 0) {
					for (var i = 0; i < keyword_search_name_s.length; i++)
						keywordCollection.push(new searchTarget([], [], []));
					keywordCount = 1;
				} else {
					for (var x = 1; x < keyword_search_name_s.length; x++) {
						for (var i = keywordPoint; i < keywordPoint + keywordCount; i++) {
							keywordCollection.push(JSON.parse(JSON.stringify(keywordCollection[i])));
						}
					}
				}
				// console.log(keywordCollection);
				keyword_search_name_s.forEach(function(item, index, array) {
					item = item.trim();
					if (item.includes('&')) item = this.name.split('&');
					else item = Array(item);
					for (
						var i = keywordPoint + index * keywordCount;
						i < keywordPoint + (index + 1) * keywordCount;
						i++
					) {
						for (var z = 0, keywordLen = item.length; z < keywordLen; z++) {
							keywordCollection[i].nodeName.push(item[z]);
						}
					}
				});
				keywordCount *= keyword_search_name_s.length;
			} else {
				if (this.name.includes('&')) keyword_search_name_s = this.name.split('&');
				else keyword_search_name_s = Array(this.name);
				if (keywordCount === 0) {
					keywordCollection.push(new searchTarget([], [], []));
					keywordCount++;
				}
				for (var i = keywordPoint; i < keywordPoint + keywordCount; i++) {
					for (var z = 0, keywordLen = keyword_search_name_s.length; z < keywordLen; z++) {
						keywordCollection[i].nodeName.push(keyword_search_name_s[z]);
					}
				}
			}
		} else {
			keywordPoint = keywordCollection.length - 1;
			keywordCount = 0;
			if (this.name.includes('|')) {
				keyword_search_name_s = this.name.split('|');
				keywordCount += keyword_search_name_s.length;
				keyword_search_name_s.forEach(function(item, index, array) {
					if (item.includes('&')) item = this.name.split('&');
					else item = Array(item);
					keywordCollection.push(new searchTarget(item, [], []));
				});
			} else {
				if (this.name.includes('&')) keyword_search_name_s = this.name.split('&');
				else keyword_search_name_s = Array(this.name);
				keywordCount++;
				keywordCollection.push(new searchTarget(keyword_search_name_s, [], []));
			}
		}
		console.log(keywordCollection);
		console.log(keywordCount);
		console.log(keywordPoint);
	}
	/**
 * 依使用者打的資訊進行判斷和處理
 * @param {event} e  傳入的事件物件
 */
	lineAppend() {
		let lineName = this.name;
		if (keywordCollection.length === 0 || this.type === 'or') {
			keywordCount = 1;
			if (lineName.includes('|')) {
				lineName = lineName.split('|');
				lineName.forEach((item) => {
					if (item.includes('&')) item.split('&');
					else item = Array(item);
				});
			} else {
				if (lineName.includes('&')) lineName = lineName.split('&');
				else lineName = Array(lineName);
				lineName = [ lineName ];
			}
			keywordCollection.push(new searchTarget([], lineName, []));
			keywordPoint = keywordCollection.length - 1;
		} else {
			var len = keywordCollection[keywordPoint].lineName.length;
			if (lineName.includes('|')) {
				lineName = lineName.split('|');
				for (i = 1; i < lineName.length; i++) {
					for (let y = 0; y < len; y++) {
						keywordCollection[keywordPoint].lineName.push(
							JSON.parse(JSON.stringify(keywordCollection[keywordPoint].lineName[y]))
						);
					}
				}
				for (let index = 0; index < lineName.length; index++) {
					if (lineName[index].includes('&')) {
						lineName[index] = lineName[index].split('&');
						for (i = len * index; i < len * (index + 1); i++)
							lineName[index].forEach((item) => {
								keywordCollection[keywordPoint].lineName[i].push(item);
							});
					} else {
						if (len == 0) {
							lineName[index] = [ lineName[index] ];
							keywordCollection[keywordPoint].lineName.push(lineName[index]);
						} else {
							for (i = len * index; i < len * (index + 1); i++)
								keywordCollection[keywordPoint].lineName[i].push(lineName[index]);
						}
					}
				}
			} else {
				if (lineName.includes('&')) {
					lineName = lineName.split('&');
					if (len == 0) keywordCollection[keywordPoint].lineName.push([]);
					keywordCollection[keywordPoint].lineName.forEach((item) => {
						lineName.forEach((items) => {
							item.push(items);
						});
					});
				} else {
					if (len == 0) {
						lineName = [ lineName ];
						keywordCollection[keywordPoint].lineName.push(lineName);
					} else {
						for (let i = 0; i < len; i++) keywordCollection[keywordPoint].lineName[i].push(lineName);
					}
				}
			}
			for (let i = keywordPoint + 1; i < keywordPoint + keywordCount; i++) {
				keywordCollection[i].lineName = JSON.parse(JSON.stringify(keywordCollection[keywordPoint].lineName));
			}
		}
		console.log(keywordCollection[keywordPoint].lineName);
	}
}
// EventListener
$('#keyword_search_field').keyup((e) => {
	keyword_search(e);
});
$('#keyword_search_button').on('click', keyword_search);
keyword.length == 0 ? $('.max_level').hide() : $('.max_level').show();
function lineCtrl() {
	data.all_category = data.all_category.filter((category) => {
		category.show = true;
		return category;
	});
	if (lineStack.length !== 0) {
		lineStack.forEach((item) => {
			let bench = [];
			if (Array.isArray(item)) {
				data.all_category.filter((category) => {
					if (item.includes(category.name)) bench.push(category.target, category.source);
				});
				for (let i = 1; i < item.length; i++)
					bench = bench.filter(function(element, index, arr) {
						return arr.indexOf(element) !== index;
					});
				data.all_category = data.all_category.filter((category) => {
					if (item.includes(category.name)) {
						if (bench.includes(category.target) && bench.includes(category.source)) category.show = false;
					}
					return category;
				});
			} else {
				data.all_category = data.all_category.filter((category) => {
					if (item.includes(category.name)) category.show = false;
					return category;
				});
			}
		});
	}
}
function keyword_search(e) {
	// get the search name
	if (e.which === 13 || e.type === 'click') {
		//點搜尋或按ENTER
		keyword_search_name = $('#keyword_search_field').val();
		keyword_search_name = keyword_search_name.toLowerCase();
		keyword_search_name = keyword_search_name.replace(' and ', '&');
		keyword_search_name = keyword_search_name.replace(' or ', '|');
		var keywordSearchType = $('#kClass').val();
		var keywordModel = $('#kModel').val();
		if (keyword.includes(keyword_search_name)) {
			alert(`Error :  same keyword can not search more than twice`);
			$('#keyword_search_field').val('');
			return;
		}
		if (keywordSearchType === 'not') {
			keyword_search_name_s = [];
			if (keywordModel === 'line') {
				if (keyword_search_name.includes('|')) keyword_search_name_s = keyword_search_name_s.split('|');
				keyword_search_name_s.forEach((item) => {
					if (item.includes('&')) item = item.split('&');
				});
				if (keyword_search_name.includes('&')) keyword_search_name_s.push(keyword_search_name.split('&'));
				else keyword_search_name_s.push(keyword_search_name);
				for (let i = 0, len = keyword_search_name_s.length; i < len; i++) {
					if (Array.isArray(keyword_search_name_s[i])) {
						keyword_search_name_s[i].forEach((item) => {
							item = item.trim();
							if (!allLine.includes(item)) throw alert(`${item}是無效的線段名稱`);
						});
					} else {
						keyword_search_name_s[i] = keyword_search_name_s[i].trim();
						if (!allLine.includes(keyword_search_name_s[i]))
							throw alert(`${keyword_search_name_s[i]}是無效的線段名稱`);
					}
				}
				keywordNot(keyword_search_name_s, keyword_search_name, keywordModel);
				keywordCount = 0;
				if (keywordPoint > 0) keywordPoint = keywordCollection.length - 1;
				lineCtrl();
			} else {
				if (keyword_search_name.includes('|')) keyword_search_name_s = keyword_search_name.split('|');
				else keyword_search_name_s.push(keyword_search_name);
				keyword_search_name_s.forEach((item) => {
					item = item.trim();
					if (!data.all_nodes.includes(item)) {
						throw alert(`Error : 找不到關鍵字: ${keyword_search_name}`);
					}
				});
				keywordNot(keyword_search_name_s, keyword_search_name, keywordModel);
				keywordCount = 0;
				if (keywordPoint > 0) keywordPoint = keywordCollection.length - 1;
			}
			if (keyword.length !== 0) reRunKeyword();
			else resetChart();
			keyword_item_delete();
		} else if (keywordModel === 'line') {
			keyword_item_append(keyword_search_name, keywordSearchType, keywordModel);
			keyword[keyword.length - 1].keywordCheck();
			keyword[keyword.length - 1].lineAppend();
			keywordFliter();
		} else {
			keyword_item_append(keyword_search_name, keywordSearchType, keywordModel);
			keyword[keyword.length - 1].keywordCheck();
			keyword[keyword.length - 1].keywordCleanUp();
			keywordFliter();
		}
	}
}
/**
 * 把屬於node中not的搜尋存入notKeyword陣列，並加入搜尋欄
 * @param {array} keyword_search_name_s  處理過的陣列
 * @param {string} keyword_search_name  使用者輸入的內容
 */
function keywordNot(keyword_search_name_s, keyword_search_name, keywordModel) {
	if (keywordModel === 'line') {
		keyword_search_name_s.forEach((item) => {
			lineStack.push(item);
		});
		keywordModel = '線';
	} else {
		keyword_search_name_s.forEach((item) => {
			notKeyword.push(item);
		});
		keywordModel = '點';
	}
	let kwd_en = keyword_search_name.replace('&', ' and ');
	kwd_en = kwd_en.replace('|', ' or ');
	$('#keyword_search_field').val(''); // clear the keyword search field
	$('.keyword').append(`<div class="keyword_item" data-item="${keyword_search_name}">
        <p class="keyword_name" >not ${keywordModel}:${kwd_en}</p>
        <button class="keyword_delete" data-name='not ${keyword_search_name}'>刪除</button>
	</div>`);
	keyword_item_delete();
	$(".keyword").scrollTop(function() { return this.scrollHeight; });
}

/**
 * 做搜尋的init並檢查node是否有在data內，並執行搜尋程式
 */
function keywordFliter() {
	// routeFloor = 'All';
	route = [];
	routeHash = [];
	routeBackup = [];
	option.series[0].categories = [];
	option.series[0].links = [];
	option.series[0].nodes = [];
	keywordCollection.forEach((item, index) => {
		for (var i = 0, keywordLen = item.nodeName.length; i < keywordLen; i++) {
			item.nodeName[i] = item.nodeName[i].trim();
			keywords.push(item.nodeName[i]);
		}
		item.nodeName = Array.from(new Set(item.nodeName));
		if (item.nodeName.length > 1) item.search_AND();
	});
	keywords = Array.from(new Set(keywords));
	$('#road').children().remove();
	$('.common_show_value').hide();
	$('.word_strength').hide();
	$('.max_level').show();
	reRunKeyword();
	event_setOption_function();
	sidebar_level_render();
	keyword_item_delete();
}

function keywordRemove(kwd_search_name) {
	let mapping = keyword.map(function(item, index, array) {
		return item.name;
	});
	index = mapping.indexOf(kwd_search_name);
	keyword.splice(index, 1);
	$(`div[data-item="${kwd_search_name}"]`).remove();
	// $('#road').remove();
}
function keyword_search_verify_fail(kwd_search_name) {
	//一個 name
	alert(`Error1 : 找不到關鍵字:${kwd_search_name}`)
	keywordRemove(kwd_search_name);
}
function andSearchNoRoute(keyword_search_name) {
	alert(`Error2 : 搜尋不到路徑 : ${keyword_search_name}`);
	keywordRemove(keyword_search_name);
}
// append keyword div in keyword field
//下方新增delete鍵
function keyword_item_append(kwd_search_name, keywordSearchType, keywordModel) {
	keyword.push(new searchWord(keywordSearchType, kwd_search_name, keywordModel));
	if (keywordModel === 'line') keywordModel = '線';
	else keywordModel = '點';
	let kwd_en = kwd_search_name.replace('&', ' and ');
	kwd_en = kwd_en.replace('|', ' or ');
	$('#keyword_search_field').val(''); // clear the keyword search field
	if (keyword.length === 1 && lineStack.length === 0 && notKeyword.length === 0)
		$('.keyword').append(`<div class="keyword_item" data-item="${kwd_search_name}">
        <p class="keyword_name" >${keywordModel}:<font color="red">${kwd_en}</font></p>
        <button class="keyword_delete" data-name='${kwd_search_name}'>刪除</button>
	</div>`);
	else
		$('.keyword').append(`<div class="keyword_item" data-item="${kwd_search_name}">
        <p class="keyword_name" >${keywordSearchType} ${keywordModel}:<font color="red">${kwd_en}</font></p>
        <button class="keyword_delete" data-name='${kwd_search_name}'>刪除</button>
	</div>`);
	keyword_item_delete();
	$(".keyword").scrollTop(function() { return this.scrollHeight; });

}
// bind the keyword delete button click event
function keyword_item_delete() {
	// avoid to bind the click(delete) event twice, have to unbind the first click event first.
	$('.keyword_delete').off('click').click((e) => {
		var name = e.currentTarget.dataset.name;
		console.log(name);
		if (name.includes('not ')) {
			// name = name.replace('not ','');
			name = name.slice(4);
			console.log(name);
			$(`div[data-item="${name}"]`).remove();
			if (name.includes('|')) {
				name = name.split('|');
				name.forEach((element) => {
					if (element.includes('&')) {
						element = element.split('&');
						element = element.trim();
					} else element = element.trim();
					console.log(element);
					if(Array.isArray(element)){
						lineStack.forEach((item,index) =>{
							if(Array.isArray(item)){
								let account = 0;
								element.forEach(items => {
								if(item.includes(items)){
									account++;
								}	
								});
								if(account === element.length)
								lineStack.splice(index, 1);
							}
						});
					}
					else{
						if (lineStack.indexOf(element) != -1) notKeyword.splice(notKeyword.indexOf(element), 1);
						if (notKeyword.indexOf(element) != -1) lineStack.splice(lineStack.indexOf(element), 1);
					}
				});
			} else {
				if(name.includes('&')){
					name = name.split('&');
					lineStack.forEach((item,index) =>{
						if(Array.isArray(item)){
							let account = 0;
							name.forEach(element => {
							if(item.includes(element)){
								account++;
							}	
							});
							if(account === name.length)
							lineStack.splice(index, 1);
						}
					});
				}
				if (lineStack.indexOf(name) != -1) lineStack.splice(lineStack.indexOf(name), 1);
				if (notKeyword.indexOf(name) != -1) notKeyword.splice(notKeyword.indexOf(name), 1);
			}
			console.log(notKeyword);
			console.log(lineStack);
			lineCtrl();
			if (keyword.length !== 0) reRunKeyword();
			else resetChart();
		} else {
			let mapping = keyword.map(function(item, index, array) {
				return item.name;
			});
			index = mapping.indexOf(e.currentTarget.dataset.name);
			keywordRemove(e.currentTarget.dataset.name);
			$('.max_level').hide();
			$('#road').children().remove();
			$('.nodeSelected').children().remove();
			keywords = [];
			routeHash = [];
			route = [];
			keywordCollection = [];
			keywordPoint = 0;
			keywordCount = 0;
			keyword_search_reset();
			if (keyword.length == 0) {
				if (onlyLOD == 1) {
					$('.common_show_value').hide();
					$('.word_strength').hide();
				} else {
					$('.common_show_value').show();
					$('.word_strength').show();
				}
			}
		}
	});
}
function keyword_search_reset() {
	if (keyword.length === 0) {
		resetChart();
	} else {
		//刪除完還有剩
		keyword.forEach(function(item, index, array) {
			if (item.model === 'line') item.lineAppend();
			else item.keywordCleanUp();
		});
		keywordFliter();
	}
}

function data_filter_and() {
	mustLine = [];
	$('#road').children().remove();
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
		let lineTemp = [];
		for (var i = 0, len = route[y].length; i < len - 1; i++)
			temp = temp.concat(
				data.category.filter((category) => {
					if (route[y][i].includes(category.target) && route[y][i + 1].includes(category.source)) {
						if (category.show === true){
							lineTemp.push(category.name);
							return category;
						} 
					} else if (route[y][i + 1].includes(category.target) && route[y][i].includes(category.source)) {
						if (category.show === true){
							lineTemp.push(category.name);
							return category;
						} 
					}
				})
			);
		lineTemp = Array.from(new Set(lineTemp));
		lineTemp.forEach(item =>{
			mustLine.push(item);
		})
		a = categories.map(function(item, index, array) {
			return item.id;
		});
		temp = temp.filter((category) => {
			return !a.includes(category.id);
		});
		nodeCollection = nodeCollection.concat(route[y]);
		nodeCollection = Array.from(new Set(nodeCollection));
		categories = categories.concat(temp);
		// $('#road').append(`<div class="road_item" id="${y}" onmouseover="highlightRoad(id);"
		// onmouseout="recoveryRoad();">
		// <p class="road_name" >${route[y]}</p>
		// </div>`);
		if (y + 1 === route.length) break;
		if (routeFloor !== 'All' && route[y].length !== route[y + 1].length) break;
	}
	links = categories.filter((category) => {
		if (category.show == true) {
			return category;
		}
	});
	nodes = data.nodes.filter((node) => {
		keywords.includes(node.name)
			? (node.itemStyle.normal.color = 'red')
			: (node.itemStyle.normal.color = user_colors[node.gp]);
		return nodeCollection.includes(node.name);
	});
	change_spaecialone_type(csType.css3[0].symbol, csType.css3[0].normal.color);
	dataAppendOr(categories, links, nodes);
}
function dataAppendOr(categories, links, nodes) {
	a = option.series[0].categories.map(function(item, index, array) {
		return item.id;
	});
	categories = categories.filter((category) => {
		return !a.includes(category.id);
	});
	option.series[0].categories = option.series[0].categories.concat(categories);
	a = option.series[0].links.map(function(item, index, array) {
		return item.id;
	});
	links = links.filter((links) => {
		return !a.includes(links.id);
	});
	option.series[0].links = option.series[0].links.concat(links);
	a = option.series[0].nodes.map(function(item, index, array) {
		return item.name;
	});
	nodes = nodes.filter((node) => {
		return !a.includes(node.name);
	});
	option.series[0].nodes = option.series[0].nodes.concat(nodes);
}
// compute the data which will render on canvas
// IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
// compute the data when occurs the legendselectchanged event on category bar

// todo : improve the performance

// Chart.on('legendselectchanged', (category_select) => {
	
// });
function lineList(){
	$('.lineSelected').children().remove();
	let list = [];
	if (route.length !== 0) {
	for (let index = 1; index < route.length; index++) {
		mustLine = mustLine.filter(function(element, index, arr) {
			return arr.indexOf(element) !== index;
		});
	 }
	}
	option.series[0].categories.forEach((item) => {
		if (!list.includes(item.name)) {
			list.push(item.name);
			if(mustLine.includes(item.name)){
				$('.lineSelected').append(`<div class="nodeSelected_item" data-item="${item.name}">
				<label><font color="${item.itemStyle.color}"><input type="checkbox" name="node_list" value="${item.name}" checked onclick="lineListChange(this)">${item.name} (必要)</front></label>
				</div>`);
				}
			else
			$('.lineSelected').append(`<div class="nodeSelected_item" data-item="${item.name}">
			<label><font color="${item.itemStyle.color}"><input type="checkbox" name="node_list" value="${item.name}" checked onclick="lineListChange(this)">${item.name}</front></label></div>`);	
		}
	});
	$(".lineSelected").scrollTop(function() { return this.scrollHeight; });

}
function lineListChange(e){
	console.log(e.value);
	let arr = [];
	arr.push(e.value);
	keywordNot(arr, e.value, 'line');
	lineCtrl();
	if (keyword.length !== 0) reRunKeyword();
	else resetChart();
}
function resetChart() {
	let collect = [];
	// console.log("reset");
	//刪除完全數清空或是砍了第一層
	option.series[0].categories = data.all_category.filter((category) => {
		// return the category that show property is true
		if (category.show == true) {
			if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
				collect.push(category.source, category.target);
				return category;
			}
		}
	});
	option.series[0].links = option.series[0].categories;
	collect = Array.from(new Set(collect));
	option.series[0].nodes = data.nodes.filter((node) => {
		node.itemStyle.normal.color = user_colors[node.gp];
		return collect.includes(node.name);
	});
	change_spaecialone_type(csType.css3[0].symbol, csType.css3[0].normal.color);
	event_setOption_function();
	sidebar_level_render();
}
// max_level
function max_Level(ui_value) {
	if (ui_value === routeHash.length) routeFloor = 'All';
	else routeFloor = routeHash[ui_value];
	option.series[0].categories = [];
	option.series[0].links = [];
	option.series[0].nodes = [];
	$(`.slider_item > input[id=max_level]`).val(routeFloor);
	data_filter_and();
	keywordCollection.forEach((item) => {
		if (item.nodeName.length === 0) item.lineOr;
		else if (item.nodeName.length === 1) item.data_filter();
	});
	sidebar_level_render();
	event_setOption_function(false);
}

// the involve function that will read the jquery_slider_setting in Main_setting.js, then create the jquery slider
$(() => {
	// const length = [option.series[0].force.edgeLength[0], option.series[0].force.edgeLength[1]]

	for (jquery_slider_setting_element of jquery_slider_setting) {
		$(`.slider_item > #${jquery_slider_setting_element.object}`).slider({
			disabled: jquery_slider_setting_element.disable,
			range: jquery_slider_setting_element.range,
			min: jquery_slider_setting_element.min,
			max: jquery_slider_setting_element.max,
			step: jquery_slider_setting_element.step,
			value: jquery_slider_setting_element.value
		});
		$(`.slider_item > input[id=${jquery_slider_setting_element.object}]`).val(jquery_slider_setting_element.value);
	}

	$('.slider_slider').slider({
		slide: function(e, ui) {
			if (e.target.id == 'common_show_value') {
				if (ui.value == min_common_show_value - 1) {
					$('input[id=' + e.target.id + ']').val('沒共現');
				} else {
					$('input[id=' + e.target.id + ']').val(`${ui.value}`);
				}
			} else {
				$('input[id=' + e.target.id + ']').val(ui.value);
			}
			switch (e.target.id) {
				case 'max_level':
					max_Level(ui.value);
					break;
				case 'relation_strength':
					break;
				// case 'word_strength':
				//     break;
				case 'group_label_distance':
					break;
				case 'relation_distance':
					option.series[0].force.edgeLength = ui.value;
					event_setOption_function();
					break;
				case 'relation_link_width':
					change_width(ui.value);
					// slide_relation_link_width_function(e, ui);
					event_setOption_function();
					break;
				case 'main_screen_room':
					option.series[0].zoom = ui.value;
					// slide_main_screen_room_function(e, ui);
					event_setOption_function();
					break;
				case 'relation_font_size':
					option.series[0].edgeLabel.normal.textStyle.fontSize = ui.value;
					// slide_relation_font_size_function(e, ui);
					event_setOption_function();
					break;
				case 'subject_font_size':
					option.series[0].itemStyle.normal.label.textStyle.fontSize = ui.value;
					// slide_subject_font_size_function(e, ui);
					event_setOption_function();
					break;
				case 'node_size':
					change_node_size(ui.value);
					break;
				case 'word_strength': //詞頻強度
					word_strength(ui.value);
					break;
				case 'common_show_value': //共現次數
					common_value(ui.value);
					break;
			}
		}
	});
	nodeList();
	lineList();
});
function change_width(width_value) {
	data.links.forEach((link) => {
		link.lineStyle.normal.width = link.lineStyle.normal.oldwidth * width_value;
	});
	event_setOption_function(false);
}
function change_node_size(node_size_value) {
	data.nodes.forEach((node) => {
		node.symbolSize = node.old_symbolSize * node_size_value;
	});
	event_setOption_function(false);
}
function word_strength(value) {
	var value_filter = [];
	option.series[0].nodes = data.nodes.filter((node) => {
		if (node.orign_idf >= value) {
			value_filter.push(node.name);
			return node;
		}
	});
	option.series[0].categories = data.all_category.filter((category) => {
		if (value_filter.includes(category.target) && value_filter.includes(category.source)) {
			return category;
		}
	});
	option.series[0].links = option.series[0].categories.filter((category) => {
		if (value_filter.includes(category.target) && value_filter.includes(category.source)) {
			return category;
		}
	});
	sidebar_level_render();
	event_setOption_function(false);
}
function common_value(value) {
	var value_filter = [];
	// console.log(value);//normal
	if (value == min_common_show_value - 1) {
		option.series[0].categories = data.all_category.filter((category) => {
			return category.orign_v == 0;
		});
		option.series[0].links = option.series[0].categories.filter((category) => {
			// if (category.show == true) {
			value_filter.push(category.target, category.source);
			return category;
			// }
		});
		value_filter = Array.from(new Set(value_filter));
		option.series[0].nodes = data.nodes.filter((node) => {
			// console.log(value_filter.includes(node.name));
			return value_filter.includes(node.name);
		});
		console.log(option);
		event_setOption_function(false);
	} else {
		option.series[0].categories = data.all_category.filter((category) => {
			return category.orign_v >= value;
		});

		option.series[0].links = option.series[0].categories.filter((category) => {
			// if (category.show == true) {
			value_filter.push(category.target, category.source);
			return category;
			// }
		});
		value_filter = Array.from(new Set(value_filter));

		option.series[0].nodes = data.nodes.filter((node) => {
			return value_filter.includes(node.name);
		});
	}
	// sidebar_level_render();
	event_setOption_function(false);
	sidebar_level_render();
}

none_orign_idf_node(csType.css_link[0].borderType, csType.css_link[0].borderColor, csType.css_link[0].borderWidth); //可以改變idf=0的樣式
function none_orign_idf_node(bType = 'solid', bColor = '#808080', bWidth = 3) {
	//idf==0的點有border
	var temp;
	temp = data.nodes.filter((node) => {
		return node.orign_idf == 0;
	});
	temp.forEach((t) => {
		var ttemp = t.itemStyle.normal;
		ttemp.borderType = bType;
		ttemp.borderColor = '#fcbf08';
		ttemp.borderWidth = bWidth;
	});
	// console.log(temp);
	Chart.setOption(option);
}
change_spaecialone_type(csType.css3[0].symbol, csType.css3[0].normal.color); //可以改變同時為輸出及輸入的樣式
function change_spaecialone_type(symbol = 'circle', color = 'pink') {
	var result_t = []; //裝target的點
	var result_s = []; //裝source的點
	var concat; //target source合併之後的點
	var Result; //要變成咖啡色的點
	user_colors[3] = color;

	data.category.forEach((c) => {
		result_t.push(c.target);
		result_s.push(c.source);
	});
	result_t = Array.from(new Set(result_t));
	result_s = Array.from(new Set(result_s));
	// console.log(result_s);
	concat = result_t.concat(result_s);

	Result = concat.filter((element, index, arr) => {
		return arr.indexOf(element) !== index;
	});
	// console.log(Result);
	Result = data.nodes.filter((node) => {
		return Result.includes(node.name);
	});
	Result.forEach((t) => {
		t.symbol = symbol;
		if (t.itemStyle.normal.color !== 'red') {
			t.itemStyle.normal.color = color;
		}
	});
	Chart.setOption(option);
}
// The function to render the data to canvas after set all option finish
function event_setOption_function(rander = true) {
	Chart.setOption(option, true);
	nodeList();
	lineList();
}

Chart.on('click', (e) => {
	// console.log(e);
	console.log(e.data.source, e.data.target, e.data.name);
	searchBookAssociation(24970, '寶玉', '高興', 'test');

	function searchBookAssociation(bid, key1, key2, relation) {
		var associationQuery = '"' + key1 + '" AND "' + key2 + '"';
		// http://dh.ascdc.sinica.edu.tw/member/text/segementRelationDetails.jsp
		$.get(
			'http://dh.ascdc.sinica.edu.tw/member/text/segementRelationDetails.jsp',
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
});
function highlightRoad(e) {
	var routIndex = e;
	console.log(e);
	option.series[0].nodes.forEach((item) => {
		item.itemStyle.normal.opacity = 0.1;
	});
	option.series[0].categories.forEach((item) => {
		item.lineStyle.normal.opacity = 0.1;
	});
	option.series[0].links.forEach((item) => {
		item.lineStyle.normal.opacity = 0.1;
	});
	// route.forEach(index => {if(index == e) routIndex = index;})
	option.series[0].nodes.forEach((item) => {
		if (route[e].includes(item.name)) item.itemStyle.normal.opacity = 1;
	});
	option.series[0].categories.forEach((category) => {
		for (var i = 0, len = route[routIndex].length; i < len - 1; i++)
			if (route[routIndex][i].includes(category.target) && route[routIndex][i + 1].includes(category.source))
				category.lineStyle.normal.opacity = 1;
			else if (route[routIndex][i + 1].includes(category.target) && route[routIndex][i].includes(category.source))
				category.lineStyle.normal.opacity = 1;
	});
	option.series[0].links.forEach((category) => {
		for (var i = 0, len = route[routIndex].length; i < len - 1; i++)
			if (route[routIndex][i].includes(category.target) && route[routIndex][i + 1].includes(category.source))
				category.lineStyle.normal.opacity = 1;
			else if (route[routIndex][i + 1].includes(category.target) && route[routIndex][i].includes(category.source))
				category.lineStyle.normal.opacity = 1;
	});
	// sidebar_level_render();
	event_setOption_function(false);
}
function recoveryRoad() {
	option.series[0].nodes.forEach((item) => {
		item.itemStyle.normal.opacity = 1;
	});
	option.series[0].categories.forEach((item) => {
		item.lineStyle.normal.opacity = 1;
	});
	option.series[0].links.forEach((item) => {
		item.lineStyle.normal.opacity = 1;
	});
	// sidebar_level_render();
	event_setOption_function(false);
}
function nodeList() {
	$('.nodeSelected').children().remove();
	option.series[0].nodes.forEach((item) => {
		if (!keywords.includes(item.name)) {
			if (route.length !== 0) {
				var routeCount = 0;
				route.forEach((element) => {
					if (element.includes(item.name)) routeCount++;
				});
				if (route.length === routeCount)
					$('.nodeSelected').append(`<div class="nodeSelected_item" data-item="${item.name}">
					<label><font color="blue"><input type="checkbox" name="node_list" value="${item.name}" checked onclick="nodeListChange(this)">${item.name} (必要)</front></label>
					</div>`);
				else
					$('.nodeSelected').append(`<div class="nodeSelected_item" data-item="${item.name}">
				<label><input type="checkbox" name="node_list" value="${item.name}" checked onclick="nodeListChange(this)">${item.name}</label></div>`);
			} else
				$('.nodeSelected').append(`<div class="nodeSelected_item" data-item="${item.name}">
			<label><input type="checkbox" name="node_list" value="${item.name}" checked onclick="nodeListChange(this)">${item.name}</label></div>`);
		}
	});
	$(".nodeSelected").scrollTop(function() { return this.scrollHeight; });

}
function maxLevelSlider(value) {
	$(`.slider_item > #max_level`).slider({
		min: 0,
		max: routeHash.length, //最大階層數
		step: 1,
		value: value, //current option setting value
		disable: false,
		range: 'min'
	});
	$(`.slider_item > input[id=max_level]`).val(routeFloor);
	$('.max_level').show();
}
function nodeListChange(e) {
	var arr = [];
	arr.push(e.value);
	keywordNot(arr, e.value, 'node');
	if (keyword.length !== 0) reRunKeyword();
	else resetChart();
	keyword_item_delete();
}
function reRunKeyword() {
	routeHash = [];
	option.series[0].categories = [];
	option.series[0].links = [];
	option.series[0].nodes = [];
	let floorBackup = routeFloor;
	routeFloor = 'All';
	if (routeBackup.length !== 0) route = JSON.parse(JSON.stringify(routeBackup));
	for (var i = 0; i < route.length; i++) {
		var count = 0;
		notKeyword.forEach((item) => {
			if (route[i].includes(item)) count++;
		});
		if (count != 0) {
			route.splice(i, 1);
			i--;
		}
	}
	for (var y = 0; y < route.length; y++) {
		notShow = false;
		for (var i = 0, len = route[y].length; i < len - 1; i++) {
			data.category.filter((category) => {
				if (route[y][i].includes(category.target) && route[y][i + 1].includes(category.source)) {
					if (category.show === false) {
						let cCount = 0;
						data.category.filter(cat =>{
							if(category.target === cat.target && category.source === cat.source){
								if (cat.show === true)
								cCount++;
							}
							else if(category.target === cat.source && category.source === cat.target){
								if (cat.show === true)
								cCount++;
							}
						});
						if (cCount < 1)
						notShow = true;
					}
				} else if (route[y][i + 1].includes(category.target) && route[y][i].includes(category.source)) {
					if (category.show === false) {
						let cCount = 0;
						data.category.filter(cat =>{
							if(category.target === cat.target && category.source === cat.source){
								if (cat.show === true)
								cCount++;
							}
							else if(category.target === cat.source && category.source === cat.target){
								if (cat.show === true)
								cCount++;
							}
						});
						if (cCount < 1)
						notShow = true;
					}
				}
			});
			if (notShow === true) {
				route.splice(y, 1);
				y--;
				break;
			}
		}
	}
	if (route.length != 0) {
		var lenTemp = route[0].length;
		routeHash.push(lenTemp - 1);
		route.forEach((item) => {
			if (lenTemp < item.length) {
				lenTemp = item.length;
				routeHash.push(lenTemp - 1);
			}
		});
	}
	maxLevelSlider(routeHash.length);
	data_filter_and();
	keywordCollection.forEach((item) => {
		if (item.nodeName.length === 0) item.lineOr();
		else if (item.nodeName.length === 1) item.data_filter();
	});
	if(routeHash.includes(floorBackup) && floorBackup !== 'All'){
		maxLevelSlider(routeHash.indexOf(floorBackup));
		max_Level(routeHash.indexOf(floorBackup));
	}
	event_setOption_function();
	sidebar_level_render();
}