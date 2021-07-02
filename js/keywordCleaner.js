/**
 * @module keywordCleaner
 * @description 搜尋項目整理模組
 * @author Wei-Jie Li
 * @createDate 2021-03-21
 */
import { keywordFliter } from "./mainSetting.js";
import { data } from "./chartSetting";
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
 * @desc 儲存整理後的搜尋項目
 * @var {array}
 */
var keywordCollection = [];
/**
 * 不要出現的關係
 * @type {array}
 */
var lineStack = [];
/**
 * 不要出現的人物
 * @type {array}
 */
var notKeyword = [];
/**
 * 搜尋的關鍵字
 * @type {array}
 */
var rawKeywords = [];
/**
 * 所有查詢的節點
 * @type {Array}
 */
export var keywords = [];
/**
 * 搜尋關鍵字整理控制式
 * @returns {searchTarget} - 整理後的搜尋項目
 */
export function keywordCleanUp(){
	keywordPoint = 0;
	keywordCount = 0;
	keywordCollection = [];
	lineStack = [];
	notKeyword = [];
	rawKeywords.forEach((item) => {
		if (item.type === 'not') {
			item.keywordNot();
		} else if (item.model === 'line') {
			item.lineAppend();
		} else {
			item.keywordCleanUp();
		}
	});
	keywords = [];
	for(let item of keywordCollection){
		for (const node of item.nodeName) {
		  keywords.push(node);
		}
	}
	if(lineStack.length !== 0 || notKeyword !== 0)
        lineCtrl(lineStack, notKeyword);
	return keywordCollection;
}
class searchTarget{
	/**
	 * @constructor searchTarget
	 * @description 用來儲存整理後的搜尋項目的專用格式
	 * @param {array} nodeName - 搜尋的節點
	 * @param {array} lineName  - 線段限制
	 * @param {array} lineName2  - 保留
	 */
	constructor(nodeName, lineName, lineName2) {
		this.nodeName = nodeName;
		this.lineName = lineName;
		this.lineName2 = lineName2;
	}
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
 	* @method keywordCleanUp
 	* @description 組合並整理使用者傳入的節點內容整理成{@link searchTarget}格式的資料並存入{@link keywordCollection}的nodeName
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
	 * @description 依使用者輸入的線段項目進行處理成{@link searchTarget}格式的資料並存入{@link keywordCollection}的lineName
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
	/**
	 * @memberof searchWord
 	 * @method keywordNot
	 * @description 可以將使用者篩選掉的項目加入{@link notKeyword},{@link lineStack}
 	*/
	keywordNot(){
		if (this.model === 'line') {
			let keyword_search_name_s = [];
			if (this.name.includes('|')) {
				keyword_search_name_s = this.name.split('|');
				keyword_search_name_s.forEach((item) => {
				if (item.includes('&')) item = item.split('&');
				lineStack.push(item);
			});
			}
			else if (this.name.includes('&')) lineStack.push(this.name.split('&'));
			else lineStack.push(this.name);
		} else {
			if (this.name.includes('|')) notKeyword.push(this.name.split('|'));
			else notKeyword.push(this.name);
		}
	}
}
  /**
   * 將搜尋項目加入下方的搜尋欄
   * @param {string} keywordSearchName 搜尋的項目
   * @param {string} keywordSearchType 搜尋的類型是and or not
   * @param {string} keywordModel	搜尋的是點或是線
   */
  export function keywordItemAppend(keywordSearchName, keywordSearchType, keywordModel) {
	if (rawKeywords.includes(keywordSearchName)) {
		alert(`Error :  same keyword can not search more than twice`);
		$('#keyword_search_field').val('');
		return 1;
	}
	rawKeywords.push(new searchWord(keywordSearchType, keywordSearchName, keywordModel));
	if (keywordModel === 'line') keywordModel = '線';
	else keywordModel = '點';
	let kwd_en = keywordSearchName.replace('&', ' and ');
	kwd_en = kwd_en.replace('|', ' or ');
	$('#keyword_search_field').val(''); // clear the keyword search field
	if (rawKeywords.length === 1)
		$('.keyword').append(`<div class="keyword_item" data-item="${keywordSearchName}">
		<p class="keyword_name" >${keywordModel}:<font color="red">${kwd_en}</font></p>
		<button class="keyword_delete" data-name='${keywordSearchName}'>刪除</button>
	</div>`);
	else
		$('.keyword').append(`<div class="keyword_item" data-item="${keywordSearchName}">
		<p class="keyword_name" >${keywordSearchType} ${keywordModel}:<font color="red">${kwd_en}</font></p>
		<button class="keyword_delete" data-name='${keywordSearchName}'>刪除</button>
	</div>`);
	keyword_item_delete();
	$('.keyword').scrollTop(function() {
		return this.scrollHeight;
	});
	return 0
}
// bind the keyword delete button click event
/**
 * 整理要刪除內容，並進行刪除，然後交給{@link keywordFliter}重跑圖
 */
function keyword_item_delete() {
	// avoid to bind the click(delete) event twice, have to unbind the first click event first.
	$('.keyword_delete').off('click').click((e) => {
		var name = e.currentTarget.dataset.name;
		console.log(name);
			let mapping = rawKeywords.map(function(item, index, array) {
				return item.name;
			});
			let index = mapping.indexOf(name);
			rawKeywords.splice(index, 1);
			$(`div[data-item="${name}"]`).remove();
			$('.max_level').hide();
			keywordFliter();
	});
}
/**
 * 讓被使用者移除項目的show屬性等於false
 * @param {array} lineStack - 不要出現的關係，參考{@link lineStack}
 * @param {array} notKeyword - 不要出現的人物，參考{@link notKeyword}
 */
function lineCtrl(lineStack,notKeyword) {
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
    // console.log(notKeyword.length);
    if(notKeyword.length !== 0){
        data.all_category = data.all_category.filter((category) => {
            if (notKeyword.includes(category.target) ||　notKeyword.includes(category.source)) category.show = false;
            return category;
        });
    }
}