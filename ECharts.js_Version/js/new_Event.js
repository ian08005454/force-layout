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
   * 儲存使用者搜尋的是and或是or
   * @type {array}
   */
var keywordType = [];
/**
   * 儲存整理後是需要跑or搜尋的項目
   * @type {array}
   */
var kwTemp = [];
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
   * a cpoy of keywordCollection
   * @type {array}
   */
var CollectionTemp;
/**
  * a cpoy of keywordCount
  * @type {number}
  */
var CountTemp;
/**
  * a cpoy of keywordPoint
  * @type {number}
  */
var PointTemp;
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

let lineStack = [];
lineStack[0] = new Array();
lineStack[1] = new Array();
lineStack[2] = new Array();
window.onresize = () => {
	Chart.resize();
};
// EventListener
$('#keyword_search_field').keyup((e) => {
	keyword_search(e);
});
$('#keyword_search_button').on('click', keyword_search);
keyword.length == 0 ? $('.max_level').hide() : $('.max_level').show();
/**
 * 依使用者打的資訊進行判斷和處理
 * @param {event} e  傳入的事件物件
 */
function keyword_search(e) {
	// get the search name
	if (e.which === 13 || e.type === 'click') {
		//點搜尋或按ENTER
		keyword_search_name = $('#keyword_search_field').val();
		var keywordSearchType = $('#kClass').val();
		var keywordModel = $('#kModel').val();
		if (keyword.includes(keyword_search_name)) {
			alert(`Error :  same keyword can not search more than twice`);
			$('#keyword_search_field').val('');
			return;
		}
		if (keywordModel === 'line') {
			keyword_search_name_s = [];
			if (keyword_search_name.includes('&')) keyword_search_name_s = keyword_search_name.split('&');
			else keyword_search_name_s.push(keyword_search_name);
			a = data.all_category.map(function(item, index, array) {
				return item.name;
			});
			for(let i = 0,len = keyword_search_name_s.length;i<len;i++){
				keyword_search_name_s[i] = keyword_search_name_s[i].trim();
				if(!a.includes(keyword_search_name_s[i]))
					return alert("沒有此線段再搜尋一次")
			}
			lineAppend(keyword_search_name_s, keywordSearchType, keyword_search_name);
			lineCtrl();
			if (keyword.length !== 0) reRunKeyword();
			else lineInit();
		} else {
			if (keywordSearchType === 'not') {
				keyword_search_name_s = [];
				if (keyword_search_name.includes('&')) keyword_search_name_s = keyword_search_name.split('&');
				else keyword_search_name_s.push(keyword_search_name);
				keyword_search_name_s.forEach((item) => {
					item = item.trim();
					if (!data.all_nodes.includes(item)) {
						return alert(`Error : Can't find keyWord : ${keyword_search_name}`);
					}
				});
				keywordNot(keyword_search_name_s, keyword_search_name);
				if (keyword.length !== 0) reRunKeyword();
				else lineInit();
				keyword_item_delete();
			} else {
				keyword_item_append(keyword_search_name, keywordSearchType);
				keywordCleanUp(keyword_search_name, keywordSearchType);
				keywordFliter();
			}
		}
	}
}
/**
 * 把屬於node中not的搜尋存入notKeyword陣列，並加入搜尋欄
 * @param {array} keyword_search_name_s  處理過的陣列
 * @param {string} keyword_search_name  使用者輸入的內容
 */
function keywordNot(keyword_search_name_s, keyword_search_name) {
	keyword_search_name_s.forEach((item) => {
		notKeyword.push(item);
	});
	$('#keyword_search_field').val(''); // clear the keyword search field
	$('.keyword').append(`<div class="keyword_item" data-item="${keyword_search_name}">
        <p class="keyword_name" >Node: not ${keyword_search_name}</p>
        <button class="keyword_delete" data-name='not ${keyword_search_name}'>delete</button>
    </div>`);
}
/**
 * 組合並整理使用者傳入的內容
 * @param {string} keyword_search_name 使用者輸入的內容
 * @param {string} keywordSearchType 使用者所選取的搜尋方式(and,or)
 */
function keywordCleanUp(keyword_search_name, keywordSearchType) {
	CollectionTemp = JSON.parse(JSON.stringify(keywordCollection));
	CountTemp = keywordCount;
	PointTemp = keywordPoint;
	if (keywordSearchType === 'and') {
		if (keyword_search_name.includes('/')) {
			keyword_search_name_s = keyword_search_name.split('/');
			if (keywordCount === 0) {
				for (var i = 0; i < keyword_search_name_s.length; i++) keywordCollection.push([]);
			} else {
				for (var x = 1; x < keyword_search_name_s.length; x++) {
					for (var i = keywordPoint; i < keywordPoint + keywordCount; i++) {
						keywordCollection.push(Array.from(keywordCollection[i]));
					}
				}
			}
			// console.log(keywordCollection);
			keyword_search_name_s.forEach(function(item, index, array) {
				item = item.trim();
				if (item.includes('&')) item = keyword_search_name.split('&');
				else item = Array(item);
				for (var i = keywordPoint + index * keywordCount; i < keywordPoint + (index + 1) * keywordCount; i++) {
					for (var z = 0, keywordLen = item.length; z < keywordLen; z++) {
						console.log(i);
						keywordCollection[i].push(item[z]);
						console.log(keywordCollection[i]);
					}
				}
			});
			keywordCount *= keyword_search_name_s.length;
		} else {
			// console.log(keywordCount);
			if (keyword_search_name.includes('&')) keyword_search_name = keyword_search_name.split('&');
			else keyword_search_name = Array(keyword_search_name);
			if (keywordCount === 0) {
				keywordCollection.push([]);
				keywordCount++;
			}
			// console.log(keywordCount);
			for (var i = keywordPoint; i < keywordPoint + keywordCount; i++) {
				for (var z = 0, keywordLen = keyword_search_name.length; z < keywordLen; z++) {
					keywordCollection[i].push(keyword_search_name[z]);
				}
			}
		}
	} else {
		keywordPoint = keywordCollection.length - 1;
		keywordCount = 0;
		if (keyword_search_name.includes('/')) {
			keyword_search_name_s = keyword_search_name.split('/');
			keywordCount += keyword_search_name_s.length;
			keyword_search_name_s.forEach(function(item, index, array) {
				if (item.includes('&')) item = keyword_search_name.split('&');
				else item = Array(item);
				keywordCollection.push(item);
			});
		} else {
			if (keyword_search_name.includes('&')) keyword_search_name = keyword_search_name.split('&');
			else keyword_search_name = Array(keyword_search_name);
			keywordCount++;
			keywordCollection.push(keyword_search_name);
		}
	}
	console.log(keywordCollection);
}
/**
 * 做搜尋的init並檢查node是否有在data內，並執行搜尋程式
 */
function keywordFliter() {
	routeFloor = 'All';
	route = [];
	routeHash = [];
	routeBackup = [];
	option.series[0].categories = [];
	kwTemp = [];
	option.series[0].links = [];
	option.series[0].nodes = [];
	keywordCollection.forEach((item) => {
		for (var i = 0, keywordLen = item.length; i < keywordLen; i++) {
			item[i] = item[i].trim();
			if (!data.all_nodes.includes(item[i]) || item[i].length === 0) {
				return keyword_search_verify_fail(keyword_search_name);
			}
			keywords.push(item[i]);
		}
		item = Array.from(new Set(item));
		if (item.length > 1) search_AND(item);
		else if (item.length === 1) kwTemp.push(item[0]);
	});
	keywords = Array.from(new Set(keywords));
	if (route.length === 0 && kwTemp.length === 0) return andSearchNoRoute(keyword_search_name);
	console.log(kwTemp);
	$('#road').children().remove();
	$('.common_show_value').hide();
	$('.word_strength').hide();
	$('.max_level').show();
	reRunKeyword();
	keyword_item_delete();
}
/**
 * 搜尋多人物之間的所有路徑<br/>
 * @see {@link https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/713294/2} 參考範例
 * @param {array} keyword_search_name_s 處理過的使用者輸入陣列
 */
function search_AND(keyword_search_name_s) {
	let first = [];
	let routeTemp = [];
	keyword_search_name_s.forEach((item) => {
		minus = [];
		minus.push(item);
		let category_collect = [];
		count = 0;
		do {
			cat = data.category.filter((category) => {
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
			console.log(minus);
			count++;
			var countdown = 0;
			keyword_search_name_s.forEach((item) => {
				if (minus.includes(item)) countdown++;
			});
			if (countdown === keyword_search_name_s.length - 1) {
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
	for (let z = 1; z < keyword_search_name_s.length; z++) {
		let primaryStack = new Array();
		let secondaryStack = new Array();
		let temp2 = new Array();
		let Finish = true;
		let keywordTemp = keyword_search_name_s[top];
		let nodeCollection;
		let secondaryStackCount = -1;
		goal = keyword_search_name_s[z];
		do {
			temp2 = [];
			nodeCollection = [];
			primaryStack.push(keywordTemp);
			let temp = data.category.filter((category) => {
				return keywordTemp.includes(category.target) || keywordTemp.includes(category.source);
			});
			// console.log(temp);
			let linkstemp = temp.filter((category) => {
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
				// console.log(primaryStack);
				// console.log(routeTemp);
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
			// console.log(keywordTemp);
			// console.log(primaryStack);
			// console.log(secondaryStack);
		} while (1);
	}
	console.log('YA!!!!!');
	// console.log(routeTemp.length);
	console.log(routeTemp);
	for (var i = 0; i < routeTemp.length; i++) {
		var count = 0;
		keyword_search_name_s.forEach((item) => {
			if (routeTemp[i].includes(item)) count++;
		});
		if (count != keyword_search_name_s.length) {
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
function keywordRemove(kwd_search_name) {
	index = keyword.indexOf(kwd_search_name);
	keyword.splice(index, 1);
	keywordType.splice(index, 1);
	$(`div[data-item="${kwd_search_name}"]`).remove();
	// $('#road').remove();
}
function keyword_search_verify_fail(kwd_search_name) {
	//一個 name
	alert(`Error : Cannot find keyWord : ${kwd_search_name}`);
	keywordCollection = CollectionTemp;
	keywordCount = CountTemp;
	keywordPoint = PointTemp;
	console.log(CollectionTemp);
	keywordRemove(kwd_search_name);
}
function andSearchNoRoute(keyword_search_name) {
	keywordCollection = CollectionTemp;
	keywordCount = CountTemp;
	keywordPoint = PointTemp;
	alert(`Error2 : Cannot find their route : ${keyword_search_name}`);
	keywordRemove(keyword_search_name);
}
// append keyword div in keyword field
//下方新增delete鍵
function keyword_item_append(kwd_search_name, keywordSearchType) {
	keyword.push(kwd_search_name);
	keywordType.push(keywordSearchType);
	$('#keyword_search_field').val(''); // clear the keyword search field
	$('.keyword').append(`<div class="keyword_item" data-item="${kwd_search_name}">
        <p class="keyword_name" >Node: ${keywordSearchType} ${kwd_search_name}</p>
        <button class="keyword_delete" data-name='${kwd_search_name}'>delete</button>
    </div>`);
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
			if (name.includes('&')) {
				name = name.split('&');
				name.forEach((element) => {
					element = element.trim();
					notKeyword.splice(notKeyword.indexOf(element), 1);
				});
			} else notKeyword.splice(notKeyword.indexOf(name), 1);
			if (keyword.length !== 0) reRunKeyword();
			else lineInit();
		} else if (name.includes('line ')) {
			name = name.slice(5);
			$(`div[data-item="${name}"]`).remove();
			if (name.includes('&')) {
				name = name.split('&');
				name.forEach((element) => {
					element = element.trim();
					lineStack.forEach(item =>{
						item.splice(item.indexOf(element), 1);
					});
				});
			} else {
				lineStack.forEach(item =>{
					item.splice(item.indexOf(name), 1);
				});
			}
			lineCtrl();
			if (keyword.length !== 0) reRunKeyword();
			else lineInit();
		} else {
			index = keyword.indexOf(e.currentTarget.dataset.name);
			keywordRemove(e.currentTarget.dataset.name);
			$('.max_level').hide();
			$('#road').children().remove();
			$('.nodeSelected').children().remove();
			keywords = [];
			routeHash = [];
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
function lineInit(){
	if(lineStack[2].length !== 0 && lineStack[0].length === 0){
		option.series[0].categories = [];
		option.series[0].links = [];
		option.series[0].nodes = [];
		lineOr();
		event_setOption_function();
		sidebar_level_render();
	}
	else
	resetChart();
}
function keyword_search_reset() {
	if (keyword.length === 0){
		lineInit();
	}
	else {
		//刪除完還有剩
		keyword.forEach(function(item, index, array) {
			keywordCleanUp(item, keywordType[index]);
		});
		keywordFliter();
	}
}

function data_filter_and() {
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
		for (var i = 0, len = route[y].length; i < len - 1; i++)
			temp = temp.concat(
				data.category.filter((category) => {
					if (route[y][i].includes(category.target) && route[y][i + 1].includes(category.source)) {
						if (category.show === true) return category;
					} else if (route[y][i + 1].includes(category.target) && route[y][i].includes(category.source)) {
						if (category.show === true) return category;
					}
				})
			);
		a = categories.map(function(item, index, array) {
			return item.id;
		});
		temp = temp.filter((category) => {
			return !a.includes(category.id);
		});
		nodeCollection = nodeCollection.concat(route[y]);
		nodeCollection = Array.from(new Set(nodeCollection));
		categories = categories.concat(temp);
		$('#road').append(`<div class="road_item" id="${y}" onmouseover="highlightRoad(id);"
		onmouseout="recoveryRoad();">
        <p class="road_name" >${route[y]}</p>
		</div>`);
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
function data_filter(keywordSearch) {
	if (keywordSearch.length === 0) return;
	if (routeFloor === 'All') ui_user = 100;
	else ui_user = routeFloor;
	var categories, links, nodes;
	let union_collect = [];
	let collect = [];
	let category_collect = [];
	a = option.series[0].nodes.map(function(item, index, array) {
		return item.name;
	});
	categories = data.category.filter((category) => {
		if (keywordSearch.includes(category.target) || keywordSearch.includes(category.source)) {
			if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
				if (category.show === true) {
					union_collect.push(category.target, category.source);
					return category;
				}
			}
		}
	});
	// console.log(union_collect);
	console.log(notKeyword);
	let minus = union_collect.filter((item) => {
		return !item.includes(keywordSearch);
	});
	minus = Array.from(new Set(minus));
	var layer = 0;
	for (let i = 1; i < ui_user; i++) {
		categories = data.category.filter((category) => {
			if (minus.includes(category.target) || minus.includes(category.source)) {
				if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
					if (category.show === true) {
						category_collect.push(category.target, category.source);
						return category;
					}
				}
			}
		});
		category_collect = Array.from(new Set(category_collect));
		// console.log(categories);
		// console.log(category_collect);
		minus = category_collect.filter((item) => {
			return !item.includes(keywordSearch);
		});
		console.log(minus);
		if (categories.length === layer) {
			let maxlevel = i;
			for (var x = 1; x <= maxlevel; x++) {
				if (!routeHash.includes(x)) routeHash.push(x);
			}
			routeHash.sort(function(a, b) {
				return a - b;
			});
			console.log(routeHash);
			maxLevelSlider();
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
// IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
// compute the data when occurs the legendselectchanged event on category bar

// todo : improve the performance
function lineAppend(lineName, type, keyword_search_name) {
	if (type === 'not') {
		lineName.forEach((item) => {
			lineStack[1].push(item);
		});
	} else if (type === 'and') {
		lineName.forEach((item) => {
			lineStack[0].push(item);
		});
	} else {
		lineName.forEach((item) => {
			lineStack[2].push(item);
		});
	}
	$('#keyword_search_field').val(''); // clear the keyword search field
	$('.keyword').append(`<div class="keyword_item" data-item="${keyword_search_name}">
        <p class="keyword_name">Line: ${type} ${keyword_search_name}</p>
        <button class="keyword_delete" data-name='line ${keyword_search_name}'>delete</button>
	</div>`);
	keyword_item_delete();
}
function lineCtrl() {
	data.all_category = data.all_category.filter((category) => {
		category.show = true;
		return category;
	});
	if (lineStack[0].length !== 0)
		data.all_category = data.all_category.filter((category) => {
			if (lineStack[0].includes(category.name)) category.show = true;
			else category.show = false;
			return category;
		});
	if(lineStack[2].length !== 0)
		data.all_category = data.all_category.filter((category) => {
		if (lineStack[2].includes(category.name)) category.show = true;
		return category;
	});
	if (lineStack[1].length !== 0)
		data.all_category = data.all_category.filter((category) => {
			if (lineStack[1].includes(category.name)) category.show = false;
			return category;
		});
}
Chart.on('legendselectchanged', (category_select) => {
	console.log(category_select.name);
	var arr = [];
	arr.push(category_select.name);
	lineAppend(arr, 'not', category_select.name);
	lineCtrl();
	if (keyword.length !== 0 ) reRunKeyword();
	else lineInit();
});
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
	data_filter(kwTemp);
	lineOr();
	event_setOption_function(false);
	sidebar_level_render();
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
				// console.log(ui.value);
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
});
function change_width(width_value) {
	data.links.forEach((link) => {
		link.lineStyle.normal.width = link.lineStyle.normal.oldwidth * width_value;
	});
	Chart.setOption(option);
}
function change_node_size(node_size_value) {
	data.nodes.forEach((node) => {
		node.symbolSize = node.old_symbolSize * node_size_value;
	});
	Chart.setOption(option);
	event_setOption_function();
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
	Chart.setOption(option);
	sidebar_level_render();
	event_setOption_function();
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
		Chart.setOption(option);
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
	event_setOption_function();
}

none_orign_idf_node(csType.css_link[0].borderType, csType.css_link[0].borderColor, csType.css_link[0].borderWidth); //可以改變idf=0的樣式
function none_orign_idf_node(bType = 'solid', bColor = 'orange', bWidth = 5) {
	//idf==0的點有border
	var temp;
	temp = data.nodes.filter((node) => {
		return node.orign_idf == 0;
	});
	temp.forEach((t) => {
		var ttemp = t.itemStyle.normal;
		ttemp.borderType = bType;
		ttemp.borderColor = bColor;
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
	Chart.setOption(option, rander);
	nodeList();
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
					<label><font color="red"><input type="checkbox" name="node_list" value="${item.name}" checked onclick="nodeListChange(this)">${item.name}</front></label>
					</div>`);
				else
					$('.nodeSelected').append(`<div class="nodeSelected_item" data-item="${item.name}">
				<label><input type="checkbox" name="node_list" value="${item.name}" checked onclick="nodeListChange(this)">${item.name}</label></div>`);
			} else
				$('.nodeSelected').append(`<div class="nodeSelected_item" data-item="${item.name}">
			<label><input type="checkbox" name="node_list" value="${item.name}" checked onclick="nodeListChange(this)">${item.name}</label></div>`);
		}
	});
}
function maxLevelSlider() {
	$(`.slider_item > #max_level`).slider({
		min: 0,
		max: routeHash.length, //最大階層數
		step: 1,
		value: routeHash.length, //current option setting value
		disable: false,
		range: 'min'
	});
	$(`.slider_item > input[id=max_level]`).val(routeFloor);
	$('.max_level').show();
}
function nodeListChange(e) {
	var arr = [];
	arr.push(e.value);
	keywordNot(arr, e.value);
	if (keyword.length !== 0 ) reRunKeyword();
	else lineInit();
	keyword_item_delete();
}
function reRunKeyword() {
	routeHash = [];
	option.series[0].categories = [];
	option.series[0].links = [];
	option.series[0].nodes = [];
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
	notShow = false;
	for (var y = 0; y < route.length; y++) {
		for (var i = 0, len = route[y].length; i < len - 1; i++) {
			data.category.filter((category) => {
				if (route[y][i].includes(category.target) && route[y][i + 1].includes(category.source)) {
					if (category.show === false) notShow = true;
				} else if (route[y][i + 1].includes(category.target) && route[y][i].includes(category.source)) {
					if (category.show === false) notShow = true;
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
	maxLevelSlider();
	data_filter_and();
	data_filter(kwTemp);
	lineOr();
	event_setOption_function();
	sidebar_level_render();
}
function lineOr(){
	if(lineStack[2].length === 0)
		return;
	let categories, links, nodes;
	let collect = [];
	categories = data.all_category.filter((category) => {
	if (lineStack[2].includes(category.name)){
		if (!notKeyword.includes(category.target) && !notKeyword.includes(category.source)) {
				collect.push(category.source, category.target);
				return category;
		}
	}
	});
	links = categories;
	collect = Array.from(new Set(collect));
	nodes = data.nodes.filter((node) => {
		return collect.includes(node.name);
	});
	dataAppendOr(categories, links, nodes);
}
