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
var all_values = [];
var all_idf = [];
var user_colors = ["#4c8dae", "#789262", "#955539"];
var HSL = [];
var id = 0;
function push_element(data_element,name, bType = 'solid', bColor = 'gray', bWidth = 0) {
    if(data_element.idf === 0){
        var lenghValue = 1;
    }
    else lenghValue = data_element.idf;
    buf.nodes.push({
        name: name,
        gp: data_element.gp,
        idf: data_element.idf,
        symbolSize: 30 * Math.sqrt(Math.sqrt(lenghValue, 3) / 0.8),
        value: data_element.idf,          //data_element.idf,
        symbol: "circle",
        itemStyle: {
            normal: {
                opacity:0.9,//work
                borderType: bType, //'solid',
                borderColor: bColor,//'orange',
                borderWidth: bWidth,//css_ele.borderWidth,  //0,
                color:  user_colors[data_element.gp]//css_ele.color  //"blue"
            }
        }
    });
}
function data_format(data) {
    const set = new Set(); //為了之後去除重複
        data.forEach(data_element => {
            if (color.hasOwnProperty(data_element.gp)) {
                node_color = color[data_element.gp]
            } else {
                node_color = getRandomColor();//calculate_color
                color[data_element.gp] = node_color;
            }
            all_idf.push(data_element.idf);
            if(data_element.idf === 0)
            push_element(data_element,data_element.k1,'solid','#ffb61e',3);
            else
            push_element(data_element,data_element.k1);
            var largest = data_element.kg2[0].v;
            data_element.kg2.forEach(kg2Element =>{
                if(kg2Element.v > largest)
                largest = kg2Element.v;
            });
            if(largest > 4096)
             var square = 4;
            else if(largest > 256)
                var square = 3;
            else if(largest > 16)
                var square = 2;
            else
                var square = 1;
            // foreach kg2 array
            data_element.kg2.forEach(kg2_element => {
                // random a new color without duplicate, this color will according with category color to pair link color
                if (color.hasOwnProperty(kg2_element.type[0])) {
                    // console.log(kg2_element.type[0]);
                    random_color = color[kg2_element.type[0]]
                } else {
                    // let name = kg2_element.type[0];
                    random_color = getRandomColor();//calculate_color
                    color[kg2_element.type[0]] = random_color;
                    // console.log(kg2_element.type[0]);
                }
                if (color.hasOwnProperty(kg2_element.gp)) {
                    node_color = color[kg2_element.gp]
                } else {
                    node_color = getRandomColor();//calculate_color
                    color[kg2_element.gp] = node_color;
                }
                all_idf.push(kg2_element.idf);
                // first : push k2 into nodes array, ignore duplicate problem e.g.AB互為兄弟時 會產生重複兩個節點
                if(kg2_element.idf == 0)
                push_element(kg2_element, kg2_element.k2,'solid','#ffb61e',3);
                else
                push_element(kg2_element, kg2_element.k2);
                // second : push all category into buf.category array, ignore duplicate problem
                all_values.push(kg2_element.v);
                if (kg2_element.v == 0) {
                    var dash = 'dashed';
                    var ttype = dash;
                } else {
                    var linksolid = 'solid';
                    var ttype = linksolid;
                }
                if (kg2_element.type[0] == '未定義' || kg2_element.type[0] == '') {
                    kg2_element.type[0]  ='未定義';  
                    random_color = 'black'
                    var shadowBlur = 10;
                }      
                else
                    var shadowBlur = 0;
                if(kg2_element.v === 0){
                    var lenghValue = 1;
                }
                else lenghValue = kg2_element.v;
                buf.all_category.push({
                    id: id++,
                    name: kg2_element.type[0],
                    itemStyle: {
                        color: random_color,
                    },
                    target: data_element.k1,
                    source: kg2_element.k2,
                    value: kg2_element.v,
                    show: true,//不知道要做甚麼
                    symbol: ['arrow'],
                    symbolSize:20,
                    force: {
                        edgeLength: Math.sqrt(lenghValue, square) * 10000000
                    },
                    lineStyle: {
                        normal: {
                            opacity:1,//work
                            color: random_color,
                            curveness: 0.4, //原1 / Math.sqrt(kg2_element.v, 2) //曲度
                            width: Math.sqrt(lenghValue, square),
                            type: ttype, //kg2_element.css[0].linetype  //'dashed'
                            shadowColor : 'orange',
                            shadowBlur : shadowBlur
                        }
                    },
                    label:{
                        show : true
                    },
                });
                // buf.all_category has the every property that links object need, etc : source, target, value, lineStyle
                buf.links = buf.all_category;
            })
        });
        buf.all_category.sort(function (a, b) {
            if (a.id < b.id) {
                return -1;
              }
              if (a.id > b.id) {
                return 1;
              }
              return 0;
          });
          console.log(buf.all_category);
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
        /**
    * 生成边曲度优先使用列表
    * @return  [0.2, -0.2, 0.4, -0.4, 0.6, -0.6, 0.8, -0.8, 1, -1, 0.1, -0.1, 0.3, -0.3, 0.5, -0.5, 0.7, -0.7, 0.9, -0.9]
    */
   const CURVENESS_LIST = [0.4, -0.6, 0.2, -0.4, 0.6, -0.2, 0.8, -0.8, 1, -1, 0.1, -0.1, 0.3, -0.3, 0.5, -0.5, 0.7, -0.7, 0.9, -0.9];
    // Array.from({ length: 20 })
//    .map((_, i) => (((i < 10 ? i + 2 : i - 9) - (i % 2)) / 10) * (i % 2 ? -1 : 1))

   // 2. 预期生成的优化曲度后的列表
   const echartLinks = [];
   buf.all_category.forEach(link => {
       // 3. 查询已优化的列表中，已存在的两个顶点相同的边
       const sameLink = echartLinks.filter(
           item =>
               item.source === link.source &&
               item.target === link.target
       )
       // 4. 优化曲度
       link.lineStyle.normal.curveness = CURVENESS_LIST[sameLink.length] || Math.random();

       echartLinks.push(link);
   })
    buf.category = buf.all_category;
    // console.log(buf.nodes);
    return buf;
}

// set each data color a random hex color
// function calculate_color() {
//     return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);//<<=左移賦值
// }
//https://segmentfault.com/q/1010000010807637/a-1020000010809153
function getRandomColor () {
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