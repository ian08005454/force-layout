// variable
var all_nodes = [];
var category = [];
var buf = {
    nodes: [],
    links: [],
    category: []
};

function data_format(data) {
    node_format();
    category_format();
    // links_format();


    // * push all node (k1 & k2) into the buf.nodes
    function node_format() {
        let temp = [];

        data.forEach(data_element => {
            // get the k1 name and determines whether the array includes the same k1. if not, push it into the temp array 
            temp.includes(data_element.k1) ? null : data_push(temp, buf.nodes, data_element.k1, null, null, null);

            // same action to get k1 
            data_element.kg2.forEach(kg2_element => {
                temp.includes(kg2_element.k2) ? null : data_push(temp, buf.nodes, kg2_element.k2, null, null, null);
            })
        });
    }

    // * push the all type(relation) into the buf.category
    function category_format() {
        data.forEach(data_element => {
            data_element.kg2.forEach(kg2_element => {
                kg2_element.type == undefined ? console.log('undefined') : console.log(kg2_element.type);
                // console.log(kg2_element.type);

                
                // kg2_element.type.forEach(kg2_element_type_element => {
                //     console.log(kg2_element_type_element);
                // });

                // category.includes(kg2_element.type[0]) ? null : data_push(category, buf.category, kg2_element.type[0], calculate_color(), data_element.k1, kg2_element.k2);
            });
        });
    }

    // * push the all link into the buf.links
    function links_format() {
        data.forEach(data_element => {
            data_element.kg2.forEach(kg2_element => {
                buf.links.push({

                    source: kg2_element.k2,
                    target: data_element.k1,

                    // weight: kg2_element.v,
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
        return((category.find(function(item, index, array){
            return item.data === type
        })).color);
    }

    // * push the data into the buf object
    function data_push(temp, buf, data, color, k1, k2) {
        color === null ? nodes_data_push() : category_data_push();
        function nodes_data_push() {
            temp.push(data);
            buf.push({
                name: data, 
                itemStyle : {
                    normal : {
                        color : '#2F4554'
                    }
                }
            });

            all_nodes.push(data);
        }
        function category_data_push() {
            temp.push({
                data, color
            });
            buf.push({
                name: data,
                itemStyle: {
                    color: color
                }, 
                k1 : k1, 
                k2 : k2
            })
        }
    };
    console.log(buf);
    return buf;
}

function calculate_color() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}