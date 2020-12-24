import { closeness } from "../lib/closeness.js";
import { eccentricity } from "../lib/eccentricity.js";
import { degree } from "../lib/degree.js";
import { betweennes } from "../lib/betweenness.js";
import { option, jquery_slider_setting, data } from "./mainSetting.js"
var central = [];
var filterValue = [0,0,0];
var g;
let centralHash = [];
export function silderInit(){
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
    console.log(option);
    $(`.slider_item > input[id=relation_distance]`).val(option.series[0].force.edgeLength);
    for (let jquery_slider_setting_element of jquery_slider_setting) {
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
}
export function sliderBar(e, ui) {
    if(e === 'All'){
        filterControler('All',1);
    }
    else{
        if (e.target.id == 'common_show_value' && ui.value == - 1) {
            $('input[id=' + e.target.id + ']').val('沒共現');
    } else {
        $('input[id=' + e.target.id + ']').val(ui.value);
    }
    switch (e.target.id) {
        case 'relation_strength':
            break;
        // case 'word_strength':
        //     break;
        case 'group_label_distance':
            break;
        case 'relation_distance':
            option.series[0].force.edgeLength = ui.values;
            $(`.slider_item > input[id=relation_distance]`).val(ui.values);
            break;
        case 'node_distance':
            option.series[0].force.repulsion = ui.value * 100;
            break;
        case 'relation_link_width':
            data.links.forEach((link) => {
                link.lineStyle.normal.width = link.lineStyle.normal.originalWidth * ui.value;
            });
            break;
        case 'main_screen_room':
            option.series[0].zoom = ui.value;
            break;
        case 'relation_font_size':
            option.series[0].edgeLabel.normal.textStyle.fontSize = ui.value;
            break;
        case 'subject_font_size':
            option.series[0].itemStyle.normal.label.textStyle.fontSize = ui.value;
            break;
        case 'node_size':
            data.nodes.forEach((node) => {
                node.symbolSize = node.originalSymbolSize * ui.value;
            });
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
        if($('.alone').is(":checked") === false){
            option.series[0].nodes = data.nodes.filter((node) => {
                return valueFilter2.includes(node.name);
            });
        }
    }
    
    function centralityContrl(value){
        if(centralHash.length === 0) return;
        $(`.slider_item > input[id=centrality]`).val(centralHash[value]);
        let temp = [];
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
}
export function centrality(value){
    ngraph();
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
        let directedCloseness = closeness(g);
        console.log(directedCloseness);
        central = [];
        option.series[0].nodes.forEach(node =>{
            central.push([node.name,directedCloseness[node.name]]);
        });
        centralitySlider();
    }
    function countEccentricity(){
        let directedEccentricity = eccentricity(g);
        central = [];
        option.series[0].nodes.forEach(node =>{
            central.push([node.name,directedEccentricity[node.name]]);
        });
        centralitySlider();
    }
    function countDegree(){
        let directedDgree = degree(g);
        central = [];
        option.series[0].nodes.forEach(node =>{
            central.push([node.name,directedDgree[node.name]]);
        });
        centralitySlider();
    }
    function countBetweenness(){
        let directedBetweenness = betweennes(g);
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