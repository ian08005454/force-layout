// init HTML dom
$('.sidebar').hide();//在圖還沒形成之前要先將左邊的slider隱藏
const Chart = echarts.init(document.getElementById('main'), null, {
    renderer: 'canvas', //could be svg, but may have performance problems
    // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
    // 设置这两个值后 left/right/top/bottom/width/height 无效。
    // width: 1700,
    // height: 800 //有置中問題
});
var jdata; // ! api.js variable
var onlyLOD=0;//0 or 1

Chart.showLoading('default');//轉圈圈~~
// jQuery ajax data from back-end
const api_url = API_generator(2207, 56, 54, 1000);//後端給的api不用動
GetJSON(api_url);//串接後端的東西 不用動
const data = data_format(jdata,onlyLOD);//
console.log("data:")
console.log(data);
Chart.hideLoading(); //跑好後關圈圈~~~
$('.sidebar').show();//圖形顯示後再出現slider

var max_common_show_value = Math.max(...all_values);
var min_common_show_value = Math.min(...all_values);
var max_idf = Math.max(...all_idf);
var min_idf = Math.min(...all_idf);

var option = {
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
                    return param.data.category;
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
var releation = false;
data.all_category.forEach(categories =>{
    if(categories.name !== '未定義')
        releation = true;
});
if(releation === false){
    option.series[0].edgeLabel.normal.show = false;
    option.series[0].edgeSymbol = [];
    option.series[0].force.repulsion = 10000;
    option.series[0].force.edgeLength = [150, 400];
}
else{
    data.all_category.forEach(categories =>{
        if(categories.name === '未定義'){
            categories.lineStyle.normal.color = 'black';
            categories.lineStyle.normal.type = 'doted'
            categories.lineStyle.normal.shadowBlur = 10;
        }
    });
    option.series[0].categories.forEach(category =>{
        if(category.name === '未定義'){
            category.lineStyle.normal.color = 'black';
            category.lineStyle.normal.type = 'doted'
            category.lineStyle.normal.shadowBlur = 10;
        }
    }); 
}
console.log(option);
// ! setup all option
Chart.setOption(option,true);
sidebar_level_render();
save_width();
save_node_size();
// jquery_slider_setting
var jquery_slider_setting = [{
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
    min: min_idf,
    max: max_idf,
    step: 1,
    value: min_idf,
    disable: false,
    range: 'min'
}
];

function sidebar_level_render() {
    $('.current_relation').html(`顯示的線 : (${option.series[0].links.length})`);
    $('.current_node').html(`顯示的點 : (${option.series[0].nodes.length})`);
};
function save_width() {
    data.links.forEach(link => {
        link.lineStyle.normal.oldwidth = link.lineStyle.normal.width;
    });
}
function save_node_size() {
    data.nodes.forEach(node => {
        node.old_symbolSize = node.symbolSize;
    });
}