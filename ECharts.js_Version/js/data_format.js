// variable
var all_nodes = [];
var category = {
    union : [], 
    color : []
};
var buf = {
    nodes: [],
    links: [],
    category: [], 
    original_category: []
};

function data_format(data) {

    node_format();
    category_format();
    links_format();


    // * push all node (k1 & k2) into the buf.nodes
    function node_format() {
        let temp = [];

        data.forEach(data_element => {
            // get the k1 name and determines whether the array includes the same k1. if not, push it into the temp array 
            temp.includes(data_element.k1) ? null : node_data_push(temp, buf, data_element.k1);

            // same action to get k1 
            data_element.kg2.forEach(kg2_element => {
                temp.includes(kg2_element.k2) ? null : node_data_push(temp, buf, kg2_element.k2);
            })
        });
    }

    function node_data_push(temp, buf, data){
        temp.push(data);
        buf.nodes.push({
            name: data, 
        });
        all_nodes.push(data);
    }

    // * push the all type(relation) into the buf.category
    function category_format() {
        data.forEach(data_element => {
            data_element.kg2.forEach(kg2_element => {
                category.union.includes(kg2_element.type[0]) ? 
                    buf.original_category.push({
                        name: kg2_element.type[0],
                        itemStyle: {
                            color: calculate_color()
                        }, 
                        k1 : data_element.k1, 
                        k2 : kg2_element.k2
                    })  :
                    category_data_push(category, buf, kg2_element.type[0], calculate_color(), data_element.k1, kg2_element.k2);
            });
        });
    };

    function category_data_push(temp, buf, data, color, k1, k2){
        temp.union.push(data);
            temp.union.sort();
            temp.color.push({
                data, color
            });
            
            buf.category.splice(temp.union.indexOf(data), 0, {
                name: data,
                itemStyle: {
                    color: color
                }, 
                k1 : k1, 
                k2 : k2, 
                show : true
            });
    }

    // * push the all link into the buf.links
    function links_format() {
        data.forEach(data_element => {
            data_element.kg2.forEach(kg2_element => {
                buf.links.push({
                    source: kg2_element.k2,
                    target: data_element.k1,
                    value: kg2_element.type[0],
                    lineStyle : {
                        normal: {
                            color :  pair_category_color(kg2_element.type[0])
                        }
                    }
                })
            })
        })
    }

    function pair_category_color(type){
        return((category.color.find(function(item){
            return item.data === type
        })).color);
    }

    return buf;
}

function calculate_color() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}