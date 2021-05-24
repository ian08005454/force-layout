/**
 * @file graphologyLayoutSystem
 * @author Wei-Jie Li
 * @createDate 2021-01-21
 * @see  github {@link https://github.com/graphology/graphology-gexf} 
 * @see  information{@link https://graphology.github.io/}
 */
import Graph from "graphology";
import noverlap from 'graphology-layout-noverlap';
// import forceAtlas2 from 'graphology-layout-forceatlas2';
var graph = new Graph();
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
function dataTypeChange(option){
    graph = new Graph()
    option.series[0].nodes.forEach(node =>{
        graph.addNode(node.name, {x: 1, y:1, size: node.symbolSize});
    });
    option.series[0].categories.forEach(category =>{
        graph.addEdge(category.source, category.target);
    });
}
function positionWrite(option, positions){
    option.series[0].nodes.forEach(node =>{
        node.x = positions[node.name]['x'];
        node.y = positions[node.name]['y'];
    });
}
