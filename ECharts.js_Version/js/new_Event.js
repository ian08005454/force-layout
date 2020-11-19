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
var central = [];
let allLine = data.all_category.map(function(item, index, array) {
	return item.name;
});
var filterValue = [0,0,0];
var mustLine = [];
let lineStack = [];
let afterOr = false;
var g;
let centralHash = [];
var lastView = 0;
window.onresize = () => {
	Chart.resize();
};
class searchTarget {
	/**
	 * @constructor searchTarget
	 * @description 存經過searchWord method 處理過的 search object 並執行搜尋
	 * @param {Array} nodeName - 搜尋的節點
	 * @param {Array} lineName  - 線段限制
	 * @param {Array} lineName2  - 保留
	 */
	constructor(nodeName, lineName, lineName2) {
		this.nodeName = nodeName; //搜尋的節點
		this.lineName = lineName; //線段限制
		this.lineName2 = lineName2; // 保留
	}
	/**
	 * @memberof searchTarget
 * @method data_filter
 * @description 單一和or搜尋的function，會用searchTarget的資訊尋找出的點，並傳給dataAppendOr()
 */
	data_filter() {
		if (routeFloor === 'All') {
			// 確認最大階層數，如果是All就跑到100層
			var ui_user = 200;
		} else {
			ui_user = routeFloor;
		}
		var categories = [], // 要加入option.series[0].categories的陣列
			links, // 要加入option.series[0].links的陣列
			nodes; // 要加入option.series[0].nodes的陣列
		let minus = JSON.parse(JSON.stringify(this.nodeName));
		let union_collect = []; // 暫存node
		let collect = []; // 暫存node
		var layer = 0;
		for (let i = 0; i < ui_user; i++) {
			if (this.lineName.length !== 0) {
				//看看有沒有個別線的條件
				this.lineName.forEach((item) => {
					let bench = []; //用來計算點出現的次數
					let count = []; //存入用bench的資料找出相關的線
					data.category.filter((category) => {
						if (minus.includes(category.target) || minus.includes(category.source)) {
							if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
								if (category.show === true) {
									//沒有被not掉的線
									if (item.includes(category.name)) {
										//看看這條線有沒有在條件內
										if (item.length > 1) {
											//如果條件為多種關係組合
											if(!edgeMask[1].includes(category.id))
												bench.push(category.target, category.source); //放入bench裡
										} else {
											union_collect.push(category.target, category.source);
											categories.push(category); //準備要加入圖中
										}
									}
								}
							}
						}
					});
					if (item.length > 1) {
						//只有條件為多種關係的情況才需要執行
						for (
							let i = 1;
							i < item.length;
							i++ //找出與條件數量一樣多次的點
						)
							bench = bench.filter(function(element, index, arr) {
								return arr.indexOf(element) !== index;
							});
						console.log(bench);
						data.category.filter((category) => {
							//找出串聯點的線
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
							//確保剩下的節點所串成的路徑都與條件相符，確認是否有多條一樣的target and source
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
								union_collect.push(element.target, element.source);
							}
						});
					}
				});
			} else {
				//甚麼都沒有就直接找到現存起來
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
			//將找到的點去掉重複和搜尋的項目
			minus = union_collect.filter((item) => {
				return !item.includes(this.nodeName);
			});
			minus = Array.from(new Set(minus));
			if (categories.length === layer) {
				//跑到最大階層後就停下來
				let maxlevel = i;
				for (var x = 1; x <= maxlevel; x++) {
					//調整最大階層的sliderbar
					if (!routeHash.includes(x)) routeHash.push(x);
				}
				routeHash.sort(function(a, b) {
					return a - b;
				});
				maxLevelSlider(routeHash.length);
				break;
			} else layer = categories.length; //沒有到最大就繼續跑
		}
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
			keywords.includes(node.name)
				? (node.itemStyle.normal.color = 'red')
				: (node.itemStyle.normal.color = user_colors[node.gp]);
			return collect.includes(node.name);
		});
		dataAppendOr(categories, links, nodes); //將資料顯示在畫面上
	}
	/**
	 * @method lineOr
	 *  @memberof searchTarget
	 * @description 將只有線段條件的搜尋進行線段的or搜尋
	 */
	lineOr() {
		let categories = [], //存要傳給dataAppendOr()顯示在畫面上的資料
			links,
			nodes;
		let collect = []; //存要顯示的點
		if (this.lineName.length !== 0) {
			//處理線的條件，只是dta_filter()的縮減版，參考一下
			this.lineName.forEach((item) => {
				let count = [];
				let bench = [];
				data.category.filter((category) => {
					if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
						if (category.show === true) {
							if (item.includes(category.name)) {
								if (item.length > 1) {
									if(!edgeMask[1].includes(category.id))
									bench.push(category.target, category.source);
								} else {
									console.log(category.name)
									collect.push(category.target, category.source);
									categories.push(category);
								}
							}
						}
					}
				});
				if (item.length > 1) {
					console.log(bench.length);
					for (let i = 1; i < item.length; i++)
						bench = bench.filter(function(element, index, arr) {
							return arr.indexOf(element) !== index;
						});
					console.log(bench.length);
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
 * @method search_AND
 *  @memberof searchTarget
 * @description 搜尋多節點之間的所有路徑，方法:先用flooding演算法找出整理過搜尋範圍，並去掉多餘的線與點，再交由底下的參考範例時做出類老鼠迷宮，找出所有路線
 * @see {@link https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/713294/2} 參考範例
 */
	search_AND() {
		let first = []; //存入各個節點到其他節點的最短距離
		let routeTemp = [];
		this.nodeName.forEach((item) => {
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
				this.nodeName.forEach((item) => {
					if (minus.includes(item)) countdown++;
				});
				if (countdown === this.nodeName.length - 1) {
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
		nodeStack.push(new Array(this.nodeName[0]));
		nodeStack.push(new Array());
		nodeStack[1].push(0);
		secondaryStack.push(this.nodeName[0]);
		let goal = this.nodeName[1];
		let categories = [];
		let c = 0; //階層數
		let union_collect = [];
		do {
			c++;
			categories = [];
			union_collect = [];
			categories = data.category.filter((category) => {
				//搜尋陣列理的節點連到的下一個節點
				if (secondaryStack.includes(category.target) || secondaryStack.includes(category.source)) {
					if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
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
							return category;
						}
					}
				}
			});
			union_collect = Array.from(new Set(union_collect)); //去掉重複的節點
			console.log(categories);
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
				if (category.show === true) {
					//確認是沒有被not的線
					return category;
				}
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
		for (let z = 1; z < this.nodeName.length; z++) {
			//為了因應可能會有fully connection 的情況，我想需要針對所有的條件節點運算一次
			let primaryStack = new Array(); //參考了老鼠迷宮的做法，這是主堆疊
			let secondaryStack = new Array(); //副堆疊
			let temp2 = new Array(); //當次搜尋的結果
			let Finish = true; //是否完成
			let keywordTemp = this.nodeName[0]; //搜尋目標
			let nodeCollection;
			let secondaryStackCount = -1; //存副堆疊長度
			let goal = this.nodeName[z];
			do {
				//找出與目標有關的線
				temp2 = [];
				nodeCollection = [];
				primaryStack.push(keywordTemp);
				let temp = [];
				if (this.lineName.length !== 0) {
					//篩選掉線段限制，大部分和data_filter()一樣
					this.lineName.forEach((item) => {
						let bench = [];
						let count = [];
						categories.filter((category) => {
							if (keywordTemp === category.target || keywordTemp === category.source) {
								if (item.includes(category.name)) {
									if (item.length > 1) {
										if(!edgeMask[1].includes(category.id)){
											bench.push(category.target, category.source);
										}
									
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
							categories.filter((category) => {
								if (keywordTemp === category.target || keywordTemp === category.source) {
									if (item.includes(category.name)) {
										if (bench.includes(category.target) && bench.includes(category.source)) {
											count.push(category);
										}
									}
								}
							});
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
									union_collect.push(element.target, element.source);
								}
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
				if (primaryStack.length == 0 && routeTemp.length == 0) return andSearchNoRoute(keyword_search_name); //如果路線和路線陣列的長度都是0就算結束
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
			this.nodeName.forEach((item) => {
				if (routeTemp[i].includes(item)) count++;
			});
			if (count != this.nodeName.length) {
				//如果路線沒有所有目標點都經過就必須去掉
				routeTemp.splice(i, 1);
				i--;
			}
		}
		// if (routeTemp.length === 0)
		// 	return andSearchNoRoute(keyword_search_name);
		routeTemp.forEach((item) => {
			//加入路線，並以距離排序
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
		routeBackup = JSON.parse(JSON.stringify(route)); //備份路線，加快階層的調整
		console.log('finish');
	}
	////搜尋兩個AND --end --
}
class searchWord {
	/**
	 * @constructs searchWord
	 * @description 專門給搜尋的資料儲存的格式
	 * @param {string} type 看是and or not 哪一種
	 * @param {string} name  搜尋的內容
	 * @param {string} model  看是點或是線
	 */
	constructor(type, name, model) {
		this.name = name; //搜尋的內容
		this.type = type; //and or not
		this.model = model; //看是點或是線
	}
	/**
	 * @memberof searchWord
	 * @method keywordCheck
	 * @description 檢查搜尋的項目有沒有在資料內(包含點跟線)
	 */
	keywordCheck() {
		let name_s = [];
		let name_ss = [];
		if (this.name.includes('|'))
			name_s = this.name.split('|'); //拆解or
		else name_s.push(this.name);
		name_s.forEach((item) => {
			//拆到剩下單一名詞的陣列
			if (item.includes('&')) {
				item = item.split('&');
				item.forEach((t) => {
					name_ss.push(t);
				});
			} else name_ss.push(item);
		});
		console.log(name_ss);
		if (this.model === 'node')
			name_ss.forEach((item) => {
				//檢查點
				if (!data.all_nodes.includes(item)) throw keyword_search_verify_fail(this.name);
			});
		else
			name_ss.forEach((item) => {
				//檢查線
				if (!allLine.includes(item)) throw keyword_search_verify_fail(this.name);
			});
	}
	/**
	 * @memberof searchWord
 	* @method keywordCleanUp
 	* @description 組合並整理使用者傳入的節點內容
 	*/
	keywordCleanUp() {
		let keyword_search_name_s = [];
		if (this.type === 'and') {
			if (this.name.includes('|')) {
				//先切or
				keyword_search_name_s = this.name.split('|');
				if (keywordCount === 0) {
					//第一次搜尋
					for (var i = 0; i < keyword_search_name_s.length; i++)
						keywordCollection.push(new searchTarget([], [], [])); //append足夠的空間來存值
					keywordCount = 1;
				} else {
					for (var x = 1; x < keyword_search_name_s.length; x++) {
						for (var i = keywordPoint; i < keywordPoint + keywordCount; i++) {
							//複製前面的值來append
							keywordCollection.push(new searchTarget(keywordCollection[i].nodeName, keywordCollection[i].lineName, keywordCollection[i].lineName2));
						}
					}
				}
				// console.log(keywordCollection);
				keyword_search_name_s.forEach(function(item, index, array) {
					//處理完or接著看有沒有and
					item = item.trim();
					if (item.includes('&'))
						item = this.name.split('&'); // 遇到and就直接切成陣列
					else item = Array(item); //沒有也包成陣列
					for (
						//從i開始複製
						var i = keywordPoint + index * keywordCount;
						i < keywordPoint + (index + 1) * keywordCount;
						i++
					) {
						//將整理好的資料存這陣列裡
						for (var z = 0, keywordLen = item.length; z < keywordLen; z++) {
							keywordCollection[i].nodeName.push(item[z]);
						}
					}
				});
				keywordCount *= keyword_search_name_s.length;
				//要連動的數量是現在的數量*輸入進來的資料
			} else {
				if (this.name.includes('&'))
					keyword_search_name_s = this.name.split('&'); //將and切開
				else keyword_search_name_s = Array(this.name);
				if (keywordCount === 0) {
					//如果先前沒有值就加入空物件
					keywordCollection.push(new searchTarget([], [], []));
					keywordCount++;
				}
				//push項目從keywordPoint 到 keywordPoint+keywordCount
				for (var i = keywordPoint; i < keywordPoint + keywordCount; i++) {
					for (var z = 0, keywordLen = keyword_search_name_s.length; z < keywordLen; z++) {
						keywordCollection[i].nodeName.push(keyword_search_name_s[z]);
					}
				}
			}
		} else {
			//傳進來的是or
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
	 * @memberof searchWord
 	 * @method lineAppend
	 * @description 依使用者打的線段項目進行判斷和處理
 	*/
	lineAppend() {
		let lineName = this.name;
		if (keywordCollection.length === 0 || this.type === 'or') {
			keywordCount = 1;
			if (lineName.includes('|')) {
				lineName = lineName.split('|');
				let lenName = [];
				lineName.forEach((item) => {
					if (item.includes('&')) item = item.split('&');
					else item = new Array(item);
					lenName.push(item);
				});
				lineName = lenName;
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
				for (let i = 1; i < lineName.length; i++) {
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
/**
 * 將不要的點和關係從圖中移除，資訊由{@link notKeyword}和{@link lineStack}取得
 */
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
				if (item === '無共現') {
					data.all_category = data.all_category.filter((category) => {
						if (category.value === 0) category.show = false;
						return category;
					});
				} else {
					data.all_category = data.all_category.filter((category) => {
						if (item === category.name) category.show = false;
						return category;
					});
				}
			}
		});
	}
}
/**
 * 搜尋的進入點，由此函式區分這次搜尋要傳到個方法
 */
function keyword_search(e) {
	// get the search name
	// if((e.which>=48&&e.which<=57)||(e.which>=65&&e.which<=90)||e.which==8||e.which==32||e.which==46){
	// 	var seachText=$("#keyword_search_field").val();
	// 	if(seachText!=""){
	// 	 //構造顯示頁面
	// 	 var tab="<table width='300' border='1' cellpadding='0' cellspacing='0'><tr align='center'><td>名稱</td></tr>";
	// 	 //遍歷解析json
	// 	 console.log(seachText);
	// 	 $.each(data.all_nodes,function(id, item){
	// 	  //如果包含則為table賦值
	// 	  if(item.includes(seachText)){
	// 		  console.log(item);
	// 	  tab+="<tr align='center'><td>"+item+"</td></tr>";
	// 	  }
	// 	 })
	// 	 tab+="</table>";
	// 	 $("#div").html(tab);
	// 	 //重新覆蓋掉，不然會追加
	// 	 tab="<table width='300' border='1' cellpadding='0' cellspacing='0'><tr align='center'><td>名稱</td></tr>";
	// 	}else{
	// 	 $("#div").html("");
	// 	}
	// }
	if (e. which=== 13 || e.type === 'click') {
		//點搜尋或按ENTER
		keyword_search_name = $('#keyword_search_field').val();
		keyword_search_name = keyword_search_name.toLowerCase();
		keyword_search_name = keyword_search_name.replace(' and ', '&');
		keyword_search_name = keyword_search_name.replace(' or ', '|');
		var keywordSearchType = $('#kClass').val();
		if (releation == false) var keywordModel = 'node';
		else var keywordModel = $('#kModel').val();
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
	$('.keyword').scrollTop(function() {
		return this.scrollHeight;
	});
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
	$('.max_level').show();
	reRunKeyword();
	event_setOption_function();
	sidebar_level_render();
	keyword_item_delete();
}
/**
 * 刪除搜尋項目的函式
 * @param {string} kwd_search_name   要刪除的內容
 */
function keywordRemove(kwd_search_name) {
	let mapping = keyword.map(function(item, index, array) {
		return item.name;
	});
	index = mapping.indexOf(kwd_search_name);
	keyword.splice(index, 1);
	$(`div[data-item="${kwd_search_name}"]`).remove();
	// $('#road').remove();
}
/**
 * 錯誤回報
 */
function keyword_search_verify_fail(kwd_search_name) {
	//一個 name
	alert(`Error1 : 找不到關鍵字:${kwd_search_name}`);
	keywordRemove(kwd_search_name);
}
/**
 * 
 * @param {string} keyword_search_name 回報找不到路線
 */
function andSearchNoRoute(keyword_search_name) {
	alert(`Error2 : 搜尋不到路徑 : ${keyword_search_name}`);
}
// append keyword div in keyword field
//下方新增delete鍵
/**
 * 資訊加入線方的搜尋欄
 * @param {string} kwd_search_name 搜尋的項目
 * @param {string} keywordSearchType 搜尋的類型是and or not
 * @param {string} keywordModel	搜尋的是點或是線
 */
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
	$('.keyword').scrollTop(function() {
		return this.scrollHeight;
	});
}
// bind the keyword delete button click event
/**
 * 整理要刪除內容，將會把資訊傳給{@link keywordRemove} 進行刪除，然後交給{@link keyword_search_reset}重跑圖
 */
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
					if (Array.isArray(element)) {
						lineStack.forEach((item, index) => {
							if (Array.isArray(item)) {
								let account = 0;
								element.forEach((items) => {
									if (item.includes(items)) {
										account++;
									}
								});
								if (account === element.length) lineStack.splice(index, 1);
							}
						});
					} else {
						if (lineStack.indexOf(element) != -1) notKeyword.splice(notKeyword.indexOf(element), 1);
						if (notKeyword.indexOf(element) != -1) lineStack.splice(lineStack.indexOf(element), 1);
					}
				});
			} else {
				if (name.includes('&')) {
					name = name.split('&');
					lineStack.forEach((item, index) => {
						if (Array.isArray(item)) {
							let account = 0;
							name.forEach((element) => {
								if (item.includes(element)) {
									account++;
								}
							});
							if (account === name.length) lineStack.splice(index, 1);
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
			// if (keyword.length == 0) {
			// 	if (onlyLOD == 1) {
			// 		$('.common_show_value').hide();
			// 		$('.word_strength').hide();
			// 	} else {
			// 		$('.common_show_value').show();
			// 		$('.word_strength').show();
			// 	}
			// }
		}
	});
}
/**
 * 重新將資訊跑成圖
 */
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
						if (category.show === true) {
							lineTemp.push(category.name);
							return category;
						}
					} else if (route[y][i + 1].includes(category.target) && route[y][i].includes(category.source)) {
						if (category.show === true) {
							lineTemp.push(category.name);
							return category;
						}
					}
				})
			);
		lineTemp = Array.from(new Set(lineTemp));
		lineTemp.forEach((item) => {
			mustLine.push(item);
		});
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
function lineList() {
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
		if (item.value === 0) {
			if (!list.includes('無共現')) {
				list.push('無共現');
				$('.lineSelected').append(`<div class="lineSelected_item" data-item="無共現">
			<label><font color="gray"><input type="checkbox" name="node_list" value="無共現" checked onclick="lineListChange(this)">無共現(0)</front></label></div><div class="color-lump" style="background-color:"gray"></div>`);
			}
		}
	});
	option.series[0].categories.forEach((item) => {
		if (!list.includes(item.name)) {
			list.push(item.name);
			if (mustLine.includes(item.name)) {
				$('.lineSelected').append(`<div class="lineSelected_item" data-item="${item.name}">
				<label><font color="${item.itemStyle
					.color}"><input type="checkbox" name="node_list" value="${item.name}" checked onclick="lineListChange(this)">${item.name} (必要)</front></label></div><div class="color-lump" style="background-color: ${item
					.itemStyle.color}"></div>`);
			} else
				$('.lineSelected').append(`<div class="lineSelected_item" data-item="${item.name}">
			<label><font color="${item.itemStyle
				.color}"><input type="checkbox" name="node_list" value="${item.name}" checked onclick="lineListChange(this)">${item.name}</front></label></div><div class="color-lump" style="background-color: ${item
					.itemStyle.color}"></div>`);
		}
	});
	$('.lineSelected').scrollTop(function() {
		return this.scrollHeight;
	});
}
function switchType() {
	if (option.series[0].layout === 'circular') option.series[0].layout = 'force';
	else option.series[0].layout = 'circular';
	event_setOption_function();
}
function lineListChange(e) {
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
	$('.centrality').hide();
	// const length = [option.series[0].force.edgeLength[0], option.series[0].force.edgeLength[1]]
	$(`.slider_item > #relation_distance`).slider({
		range: true,
		min: 50, //Warning ! highly recommended do not set relation distance min value lower than 10, the link will go something wrong
		max: 1000,
		step: 50,
		values: option.series[0].force.edgeLength,
		disable: false
	});
	$(`.slider_item > input[id=relation_distance]`).val(option.series[0].force.edgeLength);
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
				if (ui.value == - 1) {
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
					filterControler('maxLevel', ui.value);
					break;
				case 'relation_strength':
					break;
				// case 'word_strength':
				//     break;
				case 'group_label_distance':
					break;
				case 'relation_distance':
					option.series[0].force.edgeLength = ui.values;
					$(`.slider_item > input[id=relation_distance]`).val(ui.values);
					event_setOption_function();
					break;
				case 'node_distance':
					option.series[0].force.repulsion = ui.value * 100;
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
					filterControler('word', ui.value)
					break;
				case 'common_show_value': //共現次數
					filterControler('common', ui.value)
					break;
				case 'centrality': //中心性
				filterControler('centrality', ui.value)
					break;
			}
		}
	});
	nodeList();
	lineList();
	edgeFilter();
	ngraph();
	End = new Date().getTime();
	console.log(End-start + 'ms');
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
function filterControler(target,value){
	option.series[0].links = JSON.parse(JSON.stringify(option.series[0].categories));
	 if(target === 'common')
	 	filterValue[0] = value;
	 else if(target === 'word')
	 	filterValue[1] = value
	else if(target === 'centrality')
		filterValue[2] = value;
	common_value(filterValue[0]);
	word_strength(filterValue[1]);
	centralityContrl(filterValue[2]);

	function common_value(value) {
		var value_filter = [];
		// console.log(value);//normal
			option.series[0].links = option.series[0].links.filter((category) => {
				if(value == - 1 ){
					if(category.value == 0){
						value_filter.push(category.target, category.source);
						return category;
						}
				}
				else if(category.value >= value){
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
		option.series[0].nodes =  option.series[0].nodes.filter((node) => {
			if(node.idf >= value){
				valueFilter.push(node.name);
				return node;
			}
		});
		option.series[0].links = option.series[0].links.filter((category) => {
			if (valueFilter.includes(category.target) && valueFilter.includes(category.source)) {
				valueFilter2.push(category.target,category.source);
				return category;
			}
		});
		if($('#alone').is(":checked") === false){
			option.series[0].nodes = data.nodes.filter((node) => {
				return valueFilter2.includes(node.name);
			});
		}
	}
	
	function centralityContrl(value){
		if(centralHash.length === 0) return;
		$(`.slider_item > input[id=centrality]`).val(centralHash[value]);
		temp = [];
		var temp1 = []; 
		central.forEach(item =>{
			if(item[1] < centralHash[value])
				temp.push(item[0]);
		});
		option.series[0].links.forEach(function(item, index, array){
			if(temp.includes(item.target) || temp.includes(item.source)){
				item.lineStyle.normal.opacity = 0.1;
				item.label.show = false;
			}
		});
		option.series[0].nodes.forEach((node) => {
			node.itemStyle.normal.opacity = 1;
			if(temp.includes(node.name))
				node.itemStyle.normal.opacity = 0.1;
		});
	}
	event_setOption_function();
	sidebar_level_render();
}
// The function to render the data to canvas after set all option finish
function event_setOption_function(rander = false) {
	if(lastView !== option.series[0].categories.length){
		lastView = option.series[0].categories.length;
		nodeList();
		lineList();
		ngraph();
		console.log($('#Cselecter').val());
		if($('#Cselecter').val() !== '')
			centrality($('#Cselecter').val());
	}
	edgeFilter();
	// nodeTypeChange();
	Chart.setOption(option, rander);
}
Chart.on('click', (e) => {
	// console.log(e);
	console.log(book_id,e.data.source, e.data.target, e.data.name);
	if(book_id.indexOf("_")==-1)
    {
        if(e.data.source==undefined && e.data.target==undefined)
            searchBookUnit(book_id,e.data.name); 
        else
            searchBookAssociation(book_id, e.data.source, e.data.target,  e.data.name);
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
	$('.nodeSelected').scrollTop(function() {
		return this.scrollHeight;
	});
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
function centrality(value){
	var valueFilter = [];
	option.series[0].categories.forEach(category =>{
		valueFilter.push(category.target,category.source);
	})
	valueFilter = Array.from(new Set(valueFilter));
	option.series[0].nodes = data.nodes.filter((node) => {
		return valueFilter.includes(node.name);
	});
	if(value === 'betweenness')
		countBetweenness();
	else if(value === 'closeness')
		countCloseness();
	else if(value === 'eccentricity')
		countEccentricity();
	else if(value === 'degree')
		countDegree();
		
	function countCloseness(){
		var directedCloseness = closeness(g);
		central = [];
		option.series[0].nodes.forEach(node =>{
			central.push([node.name,directedCloseness[node.name]]);
		});
		centralitySlider();
	}
	function countEccentricity(){
		directedEccentricity = eccentricity(g);
		central = [];
		option.series[0].nodes.forEach(node =>{
			central.push([node.name,directedEccentricity[node.name]]);
		});
		centralitySlider();
	}
	function countDegree(){
		directedDgree = degree(g);
		central = [];
		option.series[0].nodes.forEach(node =>{
			central.push([node.name,directedDgree[node.name]]);
		});
		centralitySlider();
	}
	function countBetweenness(){
		directedBetweenness = betweennes(g);
		central = [];
		option.series[0].nodes.forEach(node =>{
			central.push([node.name,directedBetweenness[node.name]]);
		});
		centralitySlider();
	}
	function centralitySlider() {
		central.sort(function(a,b){
			if (a[1] > b[1]) {
				return 1;
			}
			else if (a[1] < b[1]) {
				return -1;
			}
			return 0;
		});
		var roundDecimal = function (val, precision) {
			return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
		  }
		  if(central[central.length -1][1] <= 1)
			 var precision = 5;
		  else if (central[central.length -1][1] <= 10)
			  var precision = 3;
		else if (central[central.length -1][1] <= 100)
			  var precision = 2;
		else 
			var precision = 0;
		centralHash = [];
		central.forEach(item =>{
			item[1] = roundDecimal(item[1], precision);
			centralHash.push(item[1]);
		})
		console.log(centralHash);
		centralHash = Array.from(new Set(centralHash));
		console.log(centralHash);
		$(`.slider_item > #centrality`).slider({
			min: 0,
			max: centralHash.length-1, //最大階層數
			step: 1,
			value: 0, //current option setting value
			disable: false,
			range: 'min'
		});
		$(`.slider_item > input[id=centrality]`).val(centralHash[0]);
		$('.centrality').show();
	}
	console.log(central);
	$('.centrality').show();
	filterControler('centrality',0);
}
function ngraph(){
	g = createGraph();
	option.series[0].nodes.forEach(node =>{
		g.addNode(node.name);
	});
	option.series[0].categories.forEach(category =>{
		// ccc += category.value;
		// for(let i = 0; i<category.value; i++){
		// 	g.addLink(category.target, category.source);
		// }
		g.addLink(category.target, category.source);
	});
}

function reRunKeyword() {
	console.log('ha!!!');
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
						data.category.filter((cat) => {
							if (category.target === cat.target && category.source === cat.source) {
								if (cat.show === true) cCount++;
							} else if (category.target === cat.source && category.source === cat.target) {
								if (cat.show === true) cCount++;
							}
						});
						if (cCount < 1) notShow = true;
					}
				} else if (route[y][i + 1].includes(category.target) && route[y][i].includes(category.source)) {
					if (category.show === false) {
						let cCount = 0;
						data.category.filter((cat) => {
							if (category.target === cat.target && category.source === cat.source) {
								if (cat.show === true) cCount++;
							} else if (category.target === cat.source && category.source === cat.target) {
								if (cat.show === true) cCount++;
							}
						});
						if (cCount < 1) notShow = true;
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
	if (routeHash.includes(floorBackup) && floorBackup !== 'All') {
		maxLevelSlider(routeHash.indexOf(floorBackup));
		max_Level(routeHash.indexOf(floorBackup));
	} else if (floorBackup === 'All' && routeHash[routeHash.length - 1] >= 9) {
		maxLevelSlider(0);
		max_Level(0);
	}
	event_setOption_function(true);
	sidebar_level_render();
}
function edgeFilter(){																					
	option.series[0].links.forEach(function(link,index,array){
		if(edgeMask[1].includes(link.id)){
			option.series[0].links.splice(index,1);
		}
		if(edgeMask[0].includes(link.id)){
			link.symbol = 'arrow';
		}
	})
}
// function nodeTypeChange(){
// 	let target = option.series[0].links.map(function(item, index, array) {
// 		return item.target;
// 	});
// 	let source = option.series[0].links.map(function(item, index, array) {
// 		return item.source;
// 	});
// 		option.series[0].nodes.forEach(item =>{
// 		if(item.itemStyle.normal.color == "red"){

// 			}
// 		else if(source.includes(item.name) && target.includes(item.name)){
// 			item.symbol = "circle"
// 			item.itemStyle.normal.color = "#955539";
// 		}
// 		else if(target.includes(item.name)){
// 			item.symbol = "rect"
// 			item.itemStyle.normal.color = '#4c8dae';
// 		}
// 		else if(source.includes(item.name)){
// 			item.symbol = "roundRect"
// 			item.itemStyle.normal.color = "#789262";
// 		}
// 		else if(!source.includes(item.name) && !target.includes(item.name)){
// 			item.symbol = "circle"
// 			item.itemStyle.normal.color = "#ceb888";
// 		}
// 	});
// }