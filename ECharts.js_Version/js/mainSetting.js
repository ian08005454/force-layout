/**
 * @file Main_setting
 * @author Wei-Jie Li
 * @createDate 2020-05-21
 */
//To do list:
//將slider bar 分開來
//將模組以keyword 和 keywordCollection 為基礎分割
import { keywordItemAppend, keywordCleanUp } from "./keywordCleaner.js";
import { searchKeyword, changeMaxlevel } from "./searchFunction.js";
import { silderInit, sliderBar, centrality } from "./sliderbarSetting.js";
import { dataFormat, userColors, allValues, allIdf } from "./dataFormater.js";
// init HTML dom
$('.sidebar').hide();//在圖還沒形成之前要先將左邊的slider隱藏
const Chart = echarts.init(document.getElementById('main'), null, {
    renderer: 'canvas', //could be svg, but may have performance problems
    // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
    // 设置这两个值后 left/right/top/bottom/width/height 无效。
    // width: 1700,
    // height: 800 //有置中問題
});
Chart.showLoading('default');//轉圈圈~~
var start = new Date().getTime();
export const data = dataFormat(jdata);//資料整理模組
console.log("data:")
console.log(data);
Chart.hideLoading(); //跑好後關圈圈~~~
$('.sidebar').show();//圖形顯示後再出現slider
var End = new Date().getTime();
console.log(End-start + 'ms');
var max_common_show_value = Math.max(...allValues);
var min_common_show_value = Math.min(...allValues);
var max_idf = Math.max(...allIdf);
var min_idf = Math.min(...allIdf);
export var option = {
    title: {
        // text: 'Lorem ipsum', // this field will connect to the book name
        // subtext: 'Lorem ipsum',
        textStyle: {
            fontSize: 32,
            fontWeight: 'bolder'
        },
        subtextStyle: {
            fontSize: 15,
            fontWeight: 'bolder'
        }

    },
    tooltip: {
        show: true,
        // showContent:false, //mouseover是否顯示
    },
    toolbox: {
        left: 'right',
        show: true,
        feature: {
            magicType: { show: true, type: ['force', 'chord'] },
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
            },
            magicType: {show:true, type: ['force', 'chord']}
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
    series: [{
        type: 'graph',
        layout: 'force',
        categories: data.category,
        nodes: data.nodes,
        modularity: true,
        links: data.links,
        // edges : {
        //     label : {
        //         show : false, 
        //         // formatter : 
        //     }
        // },
        // symbol : 'rect',//node形狀
        itemStyle: {
            normal: {
                label: {
                    fontFamily: 'sans-serif',
                    show: true,
                    textStyle: {
                        // color: 'white',
                        fontSize: 17
                    },
                    formatter:function(param){
                        return param.name + `(` + param.data.idf + `)` ;
                    },
                    // position : 'left'
                },
                color: 'pink' //預設node顏色
            }
        },
        draggable: true,//單獨點的移動
        roam: true,//禁止使用者作放大縮小 只准拖動 true,'move','scale',false
        focusNodeAdjacency: true,
        force: {
            friction: 0.1,
            initLayout:'circular',
            repulsion: 220,
            // todo : fix the jquery slider
            edgeLength: [200, 400], 
            // gravity : 1,
            gravity : 0.01,
            layoutAnimation: true//開始的晃動動畫
        },
        edgeSymbol: ['arrow'],
        symbolRotate :0.6,
        edgeSymbolSize: 10,
        edgeLabel: {
            fontFamily: 'sans-serif',
            normal: {
                verticalAlign: 'bottom',
                show: true,
                textStyle: {
                    fontSize: 18
                },
                formatter: function (param) {
                    // param.name = `${param.data.target}>${param.data.source}`;
                    return param.data.name + `(` + param.data.value + `)` ;
                },
                position: 'middle',
                align: 'center',
            }
        },
        lineStyle: {
            normal: {
                opacity: 1,
            }
        },
        zoom: 1
    }]
}
// jquery_slider_setting
export var jquery_slider_setting = [{
    object: 'relation_strength',
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    disable: false,
    range: 'min'
}, {
    object: 'group_label_distance',
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    disable: false,
    range: 'min'
},{
    object: 'node_distance',
    min: 1,
    max: 100,
    step: 1,
    value: option.series[0].force.repulsion / 100,
    disable: false,
    range: 'min'
},{
    object: 'relation_link_width',
    min: 0.5,
    max: 5,
    step: 0.5,
    value: 1,
    disable: false,
    range: 'min'
}, {
    object: 'main_screen_room',
    min: 0.1,//option.series[0].zoom,
    max: 2,
    step: 0.1,
    value: option.series[0].zoom,
    disable: false,
    range: 'min'
}, {
    object: 'relation_font_size',
    min: 5,
    max: 100,
    step: 1,
    value: option.series[0].edgeLabel.normal.textStyle.fontSize,
    disable: false,
    range: 'min'
}, {
    object: 'subject_font_size',
    min: 5,
    max: 100,
    step: 1,
    value: option.series[0].itemStyle.normal.label.textStyle.fontSize,
    disable: false,
    range: 'min'
}, {
    object: 'node_size',
    min: 0.2,
    max: 5,
    step: 0.2,
    value: 1,
    disable: false,
    range: 'min'
}, {
    object: 'common_show_value',
    min: min_common_show_value - 1,
    max: max_common_show_value,
    step: 1,
    value: min_common_show_value,
    disable: false,
    range: 'min'
}, {
    object: 'word_strength',//idf詞頻強度
    min: min_idf -1,
    max: max_idf,
    step: 1,
    value: min_idf,
    disable: false,
    range: 'min'
}
];
if(dataType === 1){
    option.series[0].edgeLabel.normal.show = false;
    option.series[0].edgeSymbol = [];
    option.series[0].edgeLabel.normal.formatter = function (param) {
        return param.data.value;
    };
    $('.lineSelected').hide();
    $('#kModel').hide();
    $('.current_relation').hide();
}
else if(dataType === 2){
    option.series[0].edgeLabel.normal.formatter = function (param) {
        return param.data.name;
    };
    option.series[0].itemStyle.normal.label.formatter = function (param) {
        return param.name;
    };
    $(".common_show_value").hide();
    $(".word_strength").hide();
}

var edgeMask = [[],[]];
option.series[0].categories.forEach(category =>{
    if(!edgeMask[0].includes(category.id) && !edgeMask[1].includes(category.id))
    option.series[0].categories.forEach(item =>{
        if(item.target === category.source && item.source === category.target){
            if(item.name === category.name){
                if(!edgeMask[0].includes(category.id) && !edgeMask[1].includes(category.id)){
                    edgeMask[0].push(category.id);
                    edgeMask[1].push(item.id);
                }
            }
        }
    })
})
// ! setup all option
/**
 * 儲存max_level slider的現值
 * @type {string}
 */
var routeFloor = 'All';
var result, viewResult;
var keywords = [];
window.onresize = () => {
    Chart.resize();
};
let allLine = data.all_category.map(function(item, index, array) {
    return item.name;
});
// EventListener
$('#keyword_search_field').keyup((e) => {
    keyword_search(e);
});
$('#keyword_search_button').on('click', keyword_search);
/**
 * 將不要的關係從圖中移除，資訊由{@link notKeyword}和{@link lineStack}取得
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
    console.log(notKeyword.length);
    if(notKeyword.length !== 0){
        data.all_category = data.all_category.filter((category) => {
            if (notKeyword.includes(category.target) ||　notKeyword.includes(category.source)) category.show = false;
            return category;
        });
    }
}
/**
 * 搜尋的進入點，由此函式區分這次搜尋要傳到個方法
 */
function keyword_search(e) {
    if (e. which=== 13 || e.type === 'click') {
        //點搜尋或按ENTER
        let keyword_search_name = $('#keyword_search_field').val();
        keyword_search_name = keyword_search_name.toLowerCase();
        keyword_search_name = keyword_search_name.replace(' and ', '&');
        keyword_search_name = keyword_search_name.replace(' or ', '|');
        var keywordSearchType = $('#kClass').val();
        if (dataType === 1) var keywordModel = 'node';
        else var keywordModel = $('#kModel').val();
    let name_s = [];
    let name_ss = [];
    if (keyword_search_name.includes('|'))
        name_s = keyword_search_name.split('|'); //拆解or
    else name_s.push(keyword_search_name);
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
    if (keywordModel === 'node')
        name_ss.forEach((item) => {
            //檢查點
            if (!data.all_nodes.includes(item)) throw alert(`Error1 : 找不到關鍵字:${keyword_search_name}`);
        });
    else
        name_ss.forEach((item) => {
            //檢查線
            if (!allLine.includes(item)) throw alert(`Error1 : 找不到關鍵字:${keyword_search_name}`);
        });
        let answer = keywordItemAppend(keyword_search_name, keywordSearchType, keywordModel);
        if(answer === 0)   keywordFliter();
    }
}
/**
 * 做搜尋的init並檢查node是否有在data內，並執行搜尋程式
 */
export function keywordFliter() {
    // routeFloor = 'All';
    result = keywordCleanUp();
    if(result.lineStack.length !== 0 || result.notKeyword !== 0)
        lineCtrl(result.lineStack, result.notKeyword);
    if(result.keywordCollection.length === 0)
        resetChart();
    else{
        viewResult = searchKeyword(result.keywordCollection, 'All');
        if(routeFloor != 'All' && viewResult.routeHash.includes(routeFloor)){
        viewResult = changeMaxlevel(result.keywordCollection, routeFloor);
        }
        else if(!viewResult.routeHash.includes(routeFloor))
        routeFloor = 'All';
        if(routeFloor != 'All') var value = routeFloor;
        else var value = viewResult.routeHash.length;
        viewDataChange();
        $(`.slider_item > #max_level`).slider({
            min: 0,
            max: viewResult.routeHash.length, //最大階層數
            step: 1,
            value: value, //current option setting value
            disable: false,
            range: 'min'
        });
        $(`.slider_item > input[id=max_level]`).val(routeFloor);
        $('.max_level').show();
    }
}
function viewDataChange() {
    option.series[0].categories = viewResult.category
    option.series[0].links = viewResult.links
    keywords = [];
    result.keywordCollection.forEach((item) =>{
        item.nodeName.forEach((node) =>{
            keywords.push(node);
        });
    });
    option.series[0].nodes = viewResult.nodes.filter((node) => {
        keywords.includes(node.name)
        ? (node.itemStyle.normal.color = 'red')
        : (node.itemStyle.normal.color = userColors[node.gp]);
        return node;
    });
    event_setOption_function();
}
// compute the data which will render on canvas
// IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
// compute the data when occurs the legendselectchanged event on category bar

// todo : improve the performance

// Chart.on('legendselectchanged', (category_select) => {

// });

function switchType() {
    if (option.series[0].layout === 'circular') option.series[0].layout = 'force';
    else option.series[0].layout = 'circular';
    event_setOption_function();
}
function lineListChange(e) {
    console.log(e.target.value);
    keywordItemAppend(e.target.value, 'not', 'line');
    keywordFliter()
}
function resetChart() {
    let collect = [];
    // console.log("reset");
    //刪除完全數清空或是砍了第一層
    option.series[0].categories = data.all_category.filter((category) => {
        // return the category that show property is true
        if (category.show == true) {   
                collect.push(category.source, category.target);
                return category;
        }
    });
    option.series[0].links = option.series[0].categories;
    collect = Array.from(new Set(collect));
    option.series[0].nodes = data.nodes.filter((node) => {
        node.itemStyle.normal.color = userColors[node.gp];
        return collect.includes(node.name);
    });
    event_setOption_function(true);
}
// max_level
function max_Level(ui_value) {
    if (ui_value === viewResult.routeHash.length) routeFloor = 'All';
    else routeFloor = viewResult.routeHash[ui_value];
    $(`.slider_item > input[id=max_level]`).val(routeFloor);
    viewResult = changeMaxlevel(result.keywordCollection, routeFloor);
    console.log(viewResult);
    viewDataChange();
}

// the involve function that will read the jquery_slider_setting in Main_setting.js, then create the jquery slider
$(() => {
    $('.max_level').hide()
    silderInit();
    $('.slider_slider').slider({slide: function(e, ui){
        if(e.target.id === 'max_level')
            max_Level(ui.value);
        else
            sliderBar(e, ui)
            event_setOption_function(false);
        }   
    });
    document.querySelector('.centralitySelecter').onchange = function(e){centrality(e.target.value)};
    document.querySelector('.switch-input').onclick = function(e){switchType()};
    document.querySelector('.alone').onclick = function(e){
        sliderBar('All');
        event_setOption_function();
    };
    event_setOption_function();
    End = new Date().getTime();
    console.log(End-start + 'ms');
});
// The function to render the data to canvas after set all option finish
function event_setOption_function(rander = true) {
        nodeList();
        lineList();
        if($('#Cselecter').val() !== '')
            sliderBar('All');
        edgeFilter();
    // nodeTypeChange();
    Chart.setOption(option, rander);
    function nodeList() {
        $('.current_node').html(`顯示的點 : (${option.series[0].nodes.length})`);
        $('.nodeSelected').children().remove();
        console.log(keywords);
        option.series[0].nodes.forEach((item) => {
            var lableName = item.name;
            var disabled = '';
            if(viewResult !== undefined){
                if (viewResult.route.length !== 0 ) {
                    var routeCount = 0;
                    viewResult.route.forEach((element) => {
                        if (element.includes(item.name)) routeCount++;
                    });
                    if (viewResult.route.length === routeCount)
                        lableName = `${item.name} (必要)`
                }
            }
            if (keywords.includes(item.name))
            $('.nodeSelected').append(`<div class="nodeSelected_item" value="${item.name}">
            <label><font color="${item.itemStyle.normal.color}"><input type="checkbox" id="${item.name}" name="node_list" value="${item.name}" disabled="disabled" checked  >${lableName}</front></label>
            </div>`);
            else
            $('.nodeSelected').append(`<div class="nodeSelected_item" value="${item.name}">
             <label><font color="${item.itemStyle.normal.color}"><input type="checkbox" id="${item.name}" name="node_list" value="${item.name}"   checked >${lableName}</front></label>
             </div>`);
        });
        $('.nodeSelected').scrollTop(function() {
            return this.scrollHeight;
        });
        document.querySelector('.nodeSelected').onchange = function(e){nodeListChange(e)};

    }
    function lineList() {
        let mustLine = [];
        $('.current_relation').html(`顯示的線 : (${option.series[0].links.length})`);
        $('.lineSelected').children().remove();
        let list = [];
        if (viewResult !== undefined && viewResult.route.length !== 0) {
            for (let index = 1; index < viewResult.route.length; index++) {
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
                <label><font color="gray"><input type="checkbox" name="node_list" value="無共現" checked>無共現(0)</front></label></div><div class="color-lump" style="background-color:"gray"></div>`);
                }
            }
        });
        option.series[0].categories.forEach((item) => {
            if (!list.includes(item.name)) {
                list.push(item.name);
                if (mustLine.includes(item.name)) {
                    $('.lineSelected').append(`<div class="lineSelected_item" value="${item.name}">
                    <label><font color="${item.itemStyle
                        .color}"><input type="checkbox" name="lineList" value="${item.name}" checked>${item.name} (必要)</front></label></div><div class="color-lump" style="background-color: ${item
                        .itemStyle.color}"></div>`);
                } else
                    $('.lineSelected').append(`<div class="lineSelected_item" value="${item.name}">
                <label><font color="${item.itemStyle
                    .color}"><input type="checkbox" name="lineList" value="${item.name}" checked>${item.name}</front></label></div><div class="color-lump" style="background-color: ${item
                        .itemStyle.color}"></div>`);
            }
        });
        $('.lineSelected').scrollTop(function() {
            return this.scrollHeight;
        });
        document.querySelector('.lineSelected').onchange = function(e){lineListChange(e)};
    }
    

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

function nodeListChange(e) {
    console.log(e.target.value);
    keywordItemAppend(e.target.value, 'not', 'node');
    keywordFliter();
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