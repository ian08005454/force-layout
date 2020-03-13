// variable
var all_nodes = [];
var color = {};
var buf = { //暫存資料用
    nodes: [],
    all_nodes: [],
    links: [],
    category: [],
    all_category: [],
};
var random_color;
var temp_v = 0;
var all_values = [];
var all_node_values = [];
var all_gp = [];
var all_idf = [];
var user_colors = [];
var red =[];
var green =[];
var blue = [];
var HSL = [];

function data_format(data, LODtype=0) {
    start = new Date().getTime();//回傳Date()物件
    const set = new Set(); //為了之後去除重複
    var orignal_idf;
    if (LODtype == 0) {
        data.forEach(data_element => {
            if (color.hasOwnProperty(data_element.gp)) {
                node_color = color[data_element.gp]
            } else {
                node_color = getRandomRolor();//calculate_color
                color[data_element.gp] = node_color;
            }
            all_idf.push(data_element.idf);
            if (data_element.idf == 0) {
                orignal_idf = data_element.idf;
                data_element.idf = 1;
            } else {
                orignal_idf = data_element.idf;
            }
            // push k1 into nodes array
            all_gp.push(data_element.gp);
            push_element1(csType.css1[0].symbol, csType.css1[0].normal.borderType, csType.css1[0].normal.borderColor, csType.css1[0].normal.borderWidth, csType.css1[0].normal.color);
            function push_element1(symbol = 'roundRect', bType = 'solid', bColor = 'orange', bWidth = 0, color = 'blue') {
                user_colors[1] = color;//刪除搜尋之後會顯現的顏色

                buf.nodes.push({
                    name: data_element.k1,
                    gp: data_element.gp,
                    idf: data_element.idf,
                    orign_idf: orignal_idf,
                    symbolSize: 30 * Math.sqrt(Math.sqrt(data_element.idf, 3) / 0.8),
                    value: orignal_idf,          //data_element.idf,
                    symbol: symbol,//data_element.css[0].symbol,
                    itemStyle: {
                        normal: {
                            borderType: bType, //'solid',
                            borderColor: bColor,//'orange',
                            borderWidth: bWidth,//css_ele.borderWidth,  //0,
                            color: color//css_ele.color  //"blue"
                        }
                    }
                });
            }

            // foreach kg2 array
            data_element.kg2.forEach(kg2_element => {

                // random a new color without duplicate, this color will according with category color to pair link color
                if (color.hasOwnProperty(kg2_element.type[0])) {
                    // console.log(kg2_element.type[0]);
                    random_color = color[kg2_element.type[0]]
                } else {
                    // let name = kg2_element.type[0];
                    random_color = getRandomRolor();//calculate_color
                    color[kg2_element.type[0]] = random_color;
                    // console.log(kg2_element.type[0]);

                }

                if (color.hasOwnProperty(kg2_element.gp)) {
                    node_color = color[kg2_element.gp]
                } else {
                    node_color = getRandomRolor();//calculate_color
                    color[kg2_element.gp] = node_color;
                }
                all_idf.push(kg2_element.idf);
                if (kg2_element.idf == 0) {
                    orignal_idf = kg2_element.idf;
                    kg2_element.idf = 1;

                } else {
                    orignal_idf = kg2_element.idf;
                }
                all_gp.push(kg2_element.gp);

                // first : push k2 into nodes array, ignore duplicate problem e.g.AB互為兄弟時 會產生重複兩個節點
                push_element2(csType.css2[0].symbol, csType.css2[0].normal.borderType, csType.css2[0].normal.borderColor, csType.css2[0].normal.borderWidth, csType.css2[0].normal.color);
                function push_element2(symbol = 'rect', bType = 'solid', bColor = 'purple', bWidth = 0, color = 'green') {
                    user_colors[2] = color;
                    buf.nodes.push({
                        name: kg2_element.k2,
                        gp: kg2_element.gp,
                        idf: kg2_element.idf,
                        orign_idf: orignal_idf,
                        symbolSize: 30 * Math.sqrt(Math.sqrt(kg2_element.idf, 3) / 0.8),
                        value: orignal_idf,//kg2_element.idf,
                        symbol: symbol,//kg2_element.css[0].symbol,
                        itemStyle: {
                            normal: {
                                // opacity:0.5,//wotk
                                borderType: bType,   //'solid',
                                borderColor: bColor,  //'orange',
                                borderWidth: bWidth, //0,
                                color: color,  //"green"
                            }
                        }
                    });
                }

                // second : push all category into buf.category array, ignore duplicate problem

                all_values.push(kg2_element.v);
                if (kg2_element.type[0] == ' ' || kg2_element.type[0] == '') {
                    var black = 'black';
                    var linkcolor;
                    linkcolor = black;
                } else {
                    linkcolor = random_color;
                }
                if (kg2_element.v == 0) {
                    var ttype;
                    var dash = 'dashed';
                    var linksolid = 'solid';
                    orignal_v = kg2_element.v;
                    kg2_element.v = 1;
                    ttype = dash;
                } else {
                    orignal_v = kg2_element.v;
                    ttype = linksolid;
                }
                buf.all_category.push({
                    name: kg2_element.type[0],
                    itemStyle: {
                        color: linkcolor,
                    },
                    target: data_element.k1,
                    source: kg2_element.k2,
                    value: kg2_element.v,
                    category: kg2_element.type[0] + `(` + orignal_v + `)`,
                    show: true,//不知道要做甚麼
                    orign_v: orignal_v,
                    orign_idf: orignal_idf,
                    force: {
                        edgeLength: 10000000 * kg2_element.v
                    },
                    lineStyle: {
                        normal: {
                            color: linkcolor,
                            curveness: 0.4, //原1 / Math.sqrt(kg2_element.v, 2) //曲度
                            width: Math.sqrt(kg2_element.v, 2),
                            type: ttype //kg2_element.css[0].linetype  //'dashed'
                        }
                    },
                });

                // buf.all_category has the every property that links object need, etc : source, target, value, lineStyle
                buf.links = buf.all_category;
            })
        });
    } else {//1的話只呈現LOD
        $(".common_show_value").hide();
        $(".word_strength").hide();
        data.forEach(data_element => {
            if (color.hasOwnProperty(data_element.gp)) {
                node_color = color[data_element.gp]
            } else {
                node_color = getRandomRolor();//calculate_color
                color[data_element.gp] = node_color;
            }
            all_gp.push(data_element.gp);
            push_element1(csType.css1[0].symbol, csType.css1[0].normal.borderType, csType.css1[0].normal.borderColor, csType.css1[0].normal.borderWidth, csType.css1[0].normal.color);
            function push_element1(symbol = 'roundRect', bType = 'solid', bColor = 'orange', bWidth = 0, color = 'blue') {
                user_colors[1] = color;//刪除搜尋之後會顯現的顏色

                buf.nodes.push({
                    name: data_element.k1,
                    gp: data_element.gp,
                    symbolSize: 50 ,
                    symbol: symbol,
                    itemStyle: {
                        normal: {
                            borderType: bType, //'solid',
                            borderColor: bColor,//'orange',
                            borderWidth: bWidth,//css_ele.borderWidth,  //0,
                            color: color//css_ele.color  //"blue"
                        }
                    }
                });
            }

            // foreach kg2 array
            data_element.kg2.forEach(kg2_element => {
                // random a new color without duplicate, this color will according with category color to pair link color
                if (color.hasOwnProperty(kg2_element.type[0])) {
                    random_color = color[kg2_element.type[0]]
                } else {
                    random_color = getRandomRolor();//calculate_color
                    color[kg2_element.type[0]] = random_color;
                }

                if (color.hasOwnProperty(kg2_element.gp)) {
                    node_color = color[kg2_element.gp]
                } else {
                    node_color = getRandomRolor();//calculate_color
                    color[kg2_element.gp] = node_color;
                }
                all_gp.push(kg2_element.gp);
                // first : push k2 into nodes array, ignore duplicate problem e.g.AB互為兄弟時 會產生重複兩個節點
                push_element2(csType.css2[0].symbol, csType.css2[0].normal.borderType, csType.css2[0].normal.borderColor, csType.css2[0].normal.borderWidth, csType.css2[0].normal.color);
                function push_element2(symbol = 'rect', bType = 'solid', bColor = 'purple', bWidth = 0, color = 'green') {
                    user_colors[2] = color;
                    buf.nodes.push({
                        name: kg2_element.k2,
                        gp: kg2_element.gp,
                        symbolSize: 50,
                        symbol: symbol,
                        itemStyle: {
                            normal: {
                                borderType: bType,   //'solid',
                                borderColor: bColor,  //'orange',
                                borderWidth: bWidth, //0,
                                color: color,  //"green"
                            }
                        }
                    });
                }

                // second : push all category into buf.category array, ignore duplicate problem
                if (kg2_element.type[0] == ' ' || kg2_element.type[0] == '') {
                    var black = 'black';
                    var linkcolor;
                    linkcolor = black;
                } else {
                    linkcolor = random_color;
                }
                
                buf.all_category.push({
                    name: kg2_element.type[0],
                    itemStyle: {
                        color: linkcolor,
                    },
                    target: data_element.k1,
                    source: kg2_element.k2,
                    // value: kg2_element.v,
                    category: kg2_element.type[0],
                    show: true,//不知道要做甚麼
                    lineStyle: {
                        normal: {
                            color: linkcolor,
                            curveness: 0.4, //原1 / Math.sqrt(kg2_element.v, 2) //曲度
                            width: 1,
                            type: "solid" //kg2_element.css[0].linetype  //'dashed'
                        }
                    },
                });

                // buf.all_category has the every property that links object need, etc : source, target, value, lineStyle
                buf.links = buf.all_category;
            })
        });
    }//1的話只呈現LOD


    // remove duplicate item in buf.nodes array
    buf.nodes = buf.nodes.filter(item => !set.has(item.name) ? set.add(item.name) : false);
    set.clear();

    // push all node into all_nodes to determine keyword search
    buf.nodes.forEach(node => {
        buf.all_nodes.push(node.name);
    });

    // sort buf.all_category
    buf.all_category = buf.all_category.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
    })

    // push the object that not duplicate in buf.all_category array into buf.category
    // buf.category = buf.all_category.filter(item => !set.has(item.name) ? set.add(item.name) : false);
    // set.clear();

    buf.category = buf.all_category;
    // console.log(buf.nodes);
    return buf;
}

// set each data color a random hex color
// function calculate_color() {
//     return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);//<<=左移賦值
// }
//https://segmentfault.com/q/1010000010807637/a-1020000010809153
function getRandomRolor () {
var hslLength = HSL.length; 
    var ret = [];
    ret[0]= Math.floor(Math.random() * 360);
    if(HSL.length>36){
        ret[1]= 80;
        ret[2]= 70;
    }
    else{
        ret[1]= 70;
        ret[2]= 50;
    }
    
    for (var i = 0; i < hslLength; i++) {
        // 色相差異調整
        if (i > 0 && Math.abs(ret[0] - HSL[i][0]) < 8) {
            ret[0]= Math.floor(Math.random() * 360);
            // ret[1]= Math.floor(Math.random() * 100);
            // ret[2]= Math.floor(Math.random() * 100);
            i = 0;
        }
        }
        // ret[1] = 70 + (ret[1] * 0.3); // [0.7 - 0.9] 排除过灰颜色
        // ret[2] = 40 + (ret[2] * 0.4); // [0.4 - 0.8] 排除过亮过暗色

        // 数据转化到小数点后两位
        ret = ret.map(function (item) {
        return parseFloat(item.toFixed(2));
        });

        HSL.push(ret[0]);
        // console.log(ret);
        var color = hslToHex(ret[0], ret[1], ret[2])
        // console.log(color);
        return color;
    }
//https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
//https://www.ginifab.com.tw/tools/colors/rgb_to_hsv_hsl.html
function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }