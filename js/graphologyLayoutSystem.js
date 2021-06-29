/**
 * @module graphologyLayoutSystem
 * @description 整合graphology的noverlapLayout樣式，需要時再學習
 * @author Wei-Jie Li
 * @createDate 2021-01-21
 * @see  github {@link https://github.com/graphology/graphology-gexf} 
 * @see  information{@link https://graphology.github.io/}
 * @todo 效果不佳因此不使用，看之後會不會用到先留著
 */
import Graph from "graphology";
import noverlap from 'graphology-layout-noverlap';
// import forceAtlas2 from 'graphology-layout-forceatlas2';
var graph = new Graph();
/**
 * 計算laayout效果
 * @param {object} option - ECharts graph圖表設定檔{@link option}
 * @returns {object} 加入每個節點位置的設定項
 */
export function layoutCalculator(option){
    dataTypeChange(option);
    const positions = noverlap(graph, {
        maxIterations: 100,
        settings: {
            gridSize: 100,
            margin:100,
            expansion: 100000000,
            ratio: 1000000,
            gravity: 1,
            inputReducer: (key, attr) => ({x: store[key].x, y: store[key].y, size: attr.size}),
            outputReducer: (key, pos) => ({x: pos.x * 1000, y: pos.y * 1000})
            }
    });
    noverlap.assign(graph);
    // const positions = forceAtlas2(graph, {iterations: 50, settings: {
    //     gravity: 10
    //   }});
    // forceAtlas2.assign(graph);
    positionWrite(option, positions);
    return option;
}
/**
 * 將畫面上資料及轉成graphology的graph 物件
 * @param {object} option - ECharts graph圖表設定檔{@link option}
 */
function dataTypeChange(option){
    graph = new Graph()
    option.series[0].nodes.forEach(node =>{
        graph.addNode(node.name, {x: 1, y:1, size: node.symbolSize});
    });
    option.series[0].categories.forEach(category =>{
        graph.addEdge(category.source, category.target);
    });
}
/**
 * 將計算後的結果加入echarts圖表的設定項
 * @param {object} option - ECharts graph圖表設定檔{@link option}
 * @param {object} positions - 計算後的XY值
 */
function positionWrite(option, positions){
    option.series[0].nodes.forEach(node =>{
        node.x = positions[node.name]['x'];
        node.y = positions[node.name]['y'];
    });
}
