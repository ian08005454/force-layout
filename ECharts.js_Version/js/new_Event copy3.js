// variable
var keyword = [];//single searc
var firstkey_search = [];//for double search
var union_collect = [];
var collect_more = [];
var category_collect = [];

var ui_user;
var union_collect_category_show_g = [];
// var temp_category = [];



// window resize //detect window resizing and resize the chart
window.onresize = () => {
    Chart.resize();
}
// EventListener
$('#keyword_search_field').keyup((e) => {
    keyword_search(e)
});
$('#keyword_search_button').on('click', keyword_search);

keyword.length == 0 ? $(".max_level").hide() : $(".max_level").show();

/**
 * keyword_search function
 * @param {event} e
 */
function keyword_search(e) {
    // get the search name
    var keyword_search_name = $('#keyword_search_field').val();
    if (keyword_search_name.includes(" ")) {
        keyword_search_name_s = keyword_search_name.split(" ");
        firstkey_search.push(keyword_search_name_s[0]);
        firstkey_search = Array.from(new Set(firstkey_search));
        if (e.which === 13 || e.type === 'click') { //點搜尋OR按ENTER
            if (search_more()) {
                search_more_pass();
                console.log("true");
            } else {
                keyword_search_verify_fail();
                console.log("false");
            }
        };

    } else {

        if (e.which === 13 || e.type === 'click') { //點搜尋OR按ENTER
            data.all_nodes.includes(keyword_search_name) ? keyword_search_verify_pass() : keyword_search_verify_fail();
        };
    }

    function search_more() {
        //確保所蒐尋的兩個name都有在同一組裡面
        let category_collect = [];
        // console.log(firstkey_search);
        option.series[0].categories = data.category.filter(category => {
            if (firstkey_search.includes(category.target) || firstkey_search.includes(category.source)) {
                collect_more.push(category.target, category.source);
                // console.log(collect_more);
                return category;
            }
        });

        let minus1 = $(collect_more).not(firstkey_search).toArray();
        for (let i = 1; i < 4; i++) {
            option.series[0].categories = data.category.filter(category => {
                if (minus1.includes(category.target) || minus1.includes(category.source)) {
                    category_collect.push(category.target, category.source);
                    // console.log(category_collect);//這個!!
                    return category;
                }
            });
            category_collect = Array.from(new Set(category_collect));
            minus1 = $(category_collect).not(firstkey_search).toArray();
        };
        if (category_collect.includes(keyword_search_name_s[1])) {
            // console.log("sa");
            return true;
        }
        else {
            return false;
        }
    }
    function search_more_pass() {
        $(".max_level").hide();
        $(".common_show_value").hide();
        $(".word_strength").hide();

        if (firstkey_search.includes(keyword_search_name)) {
            alert(`Error, same keyword can not search more than twice`);
            return;
        }
        // firstkey_search.push(keyword_search_name);
        $('#keyword_search_field').val('');
        search_double();
        event_setOption_function();
        sidebar_level_render();
        keyword_item_append();
        keyword_item_delete();
    }

    function search_double() {//找到第二個人並顯示在畫面上
        union_collect = [];
        let category_collect = [];
        let union_collect_category_show_g = [];
        // console.log(option.series[0].links);
        // console.log("firstkey_search" + firstkey_search);//arr
        option.series[0].categories = data.category.filter(category => {
            if (firstkey_search.includes(category.target) || firstkey_search.includes(category.source)) {
                union_collect.push(category.target, category.source);
                return category;
            }
        });
        // union_collect.push(keyword_search_name_s[1]);//錯誤
        let minus1 = $(union_collect).not(firstkey_search).toArray();
        // console.log("keyword_search_name_s" + keyword_search_name_s);
        // let minus = $(union_collect).not(keyword).toArray();
        for (let i = 1; i < 5; i++) {
            // console.log(minus1);
            // console.log(keyword_search_name_s);
            if (minus1.includes(keyword_search_name_s[1])) {//如果所連結的點已經有連線的話
                // console.log("break");
                break;
            } else {//這裡有問題所以連續搜尋兩個才會有錯
                // option.series[0].categories有問題
                option.series[0].categories = data.category.filter(category => {
                    console.log('category_collect' + category_collect);
                    if (minus1.includes(category.target) || minus1.includes(category.source)) {
                        category_collect.push(category.target, category.source);
                        // console.log('category_collect' + category_collect);
                        return category;
                    }
                });
                category_collect = Array.from(new Set(category_collect));
                minus1 = $(category_collect).not(firstkey_search).toArray();
                console.log(minus1);

            }
        };
        // union_collect = category_collect;
        // console.log(option.series[0].categories);
        option.series[0].links = option.series[0].categories.filter(category => {
            collect_more.push(category.source, category.target);
            // console.log(category);

            // if (category.show == false) {
            union_collect_category_show_g.push(category.source, category.target);
            // console.log("union_collect_category_show_g" + union_collect_category_show_g);
            return category;
            // }
        })
        // console.log(option.series[0].links);
        // console.log(collect_more);

        collect_more = Array.from(new Set(collect_more));
        union_collect_category_show_g = Array.from(new Set(union_collect_category_show_g));
        collect_more.push(keyword_search_name_s[1]);
        // console.log("collect_more" + collect_more);
        // console.log("union_collect_category_show_g" + union_collect_category_show_g);
        option.series[0].nodes = data.nodes.filter(node => {
            keyword_search_name_s.includes(node.name) ? node.itemStyle.normal.color = 'red' : node.itemStyle.normal.color = user_colors[node.gp];//原color[node.gp]
            return collect_more.includes(node.name) && union_collect_category_show_g.includes(node.name);
        })
    }

    function keyword_search_verify_pass() {

        $(".max_level").show();
        $(".common_show_value").hide();
        $(".word_strength").hide();

        // avoid same keyword search twice
        if (keyword.includes(keyword_search_name)) {
            alert(`Error, same keyword can not search more than twice`);
            $('#keyword_search_field').val('');
            return;
        }
        keyword.push(keyword_search_name);
        $('#keyword_search_field').val(''); // clear the keyword search field
        data_filter();
        event_setOption_function();
        sidebar_level_render();
        keyword_item_append();
        keyword_item_delete();
    };

    function keyword_search_verify_fail() {
        alert(`Cannot find keyWord : ${keyword_search_name}`);
    };

    // append keyword div in keyword field
    //下方新增delete鍵
    function keyword_item_append() {
        $('.keyword').append(`<div class="keyword_item" data-item="${keyword_search_name}">
        <p class="keyword_name" >${keyword_search_name}</p>
        <button class="keyword_delete" data-name='${keyword_search_name}'>delete</button>
    </div>`)
    };

    // IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
    // compute the data which will render on canvas
    function data_filter() {
        union_collect = [];

        $('#max_level').val() === '1' ? data_filter_max_level_1() : data_filter_max_level_2();

        function data_filter_max_level_1() {

            let union_collect_category_show = [];
            console.log(keyword);
            option.series[0].categories = data.category.filter(category => {
                return keyword.includes(category.target) || keyword.includes(category.source);
            });
            console.log(option.series[0].categories);

            option.series[0].links = option.series[0].categories.filter(category => {
                union_collect.push(category.target, category.source);
                console.log("union_collect" + union_collect);//會記錄所有append的node
                // console.log(option.series[0].links);
                // return category.show == true;
                if (category.show == true) {
                    union_collect_category_show.push(category.target, category.source);
                    return category;
                }
            });
            console.log(option.series[0].links);

            union_collect = Array.from(new Set(union_collect));
            union_collect_category_show = Array.from(new Set(union_collect_category_show));

            option.series[0].nodes = data.nodes.filter(node => {
                keyword.includes(node.name) ? node.itemStyle.normal.color = 'red' : null;
                return union_collect.includes(node.name) && union_collect_category_show.includes(node.name)
            });
            console.log(option.series[0].nodes);
        }

        // todo : need to fix the multi search problem
        // rename : test array;
        function data_filter_max_level_2() {///有很大的問題
            let collect = [];
            let category_collect = [];
            console.log("data_filter_max_level_2");
            option.series[0].categories = data.category.filter(category => {
                if (keyword.includes(category.target) || keyword.includes(category.source)) {
                    union_collect.push(category.target, category.source);
                    console.log(union_collect);
                    return category;
                }
                // return keyword.includes(category.target) || keyword.includes(category.source);
            });
            // 山option.series[0].links = option.series[0].categories.filter(category => {
            //   山   union_collect.push(category.target, category.source);
            //  山    console.log("union_collect" + union_collect);
            // 山 });
            let minus = $(union_collect).not(keyword).toArray();
            console.log(minus);

            for (let i = 1; i < window.ui_user; i++) {
                // console.log(window.ui_user);

                option.series[0].categories = data.category.filter(category => {
                    console.log("work");
                    // return minus.includes(category.target) || minus.includes(category.source);
                    if (minus.includes(category.target) || minus.includes(category.source)) {
                        category_collect.push(category.target, category.source);
                        // console.log(category_collect);//這個!!
                        return category;
                    }
                });
                category_collect = Array.from(new Set(category_collect));
                minus = $(category_collect).not(keyword).toArray();
                // console.log(category_collect);//這個!!

            };
            console.log("category_collect" + category_collect);//這個!!

            option.series[0].links = option.series[0].categories.filter(category => {
                if (category.show == true) {
                    collect.push(category.source, category.target);
                    return category;
                }
            })
            collect = Array.from(new Set(collect));
            console.log(collect);
            option.series[0].nodes = data.nodes.filter(node => {
                // if (collect.includes(node.name)) {
                //     return node
                // }
                keyword.includes(node.name) ? node.itemStyle.normal.color = 'red' : null;
                return collect.includes(node.name);
            })

        }
    };
    // bind the keyword delete button click event
    function keyword_item_delete() {
        // avoid to bind the click(delete) event twice, have to unbind the first click event first.
        $('.keyword_delete').off('click').click(e => {
            keyword.splice(keyword.indexOf(e.currentTarget.dataset.name), 1);
            firstkey_search.splice(firstkey_search.indexOf(e.currentTarget.dataset.name), 2);
            $(`div[data-item="${e.currentTarget.dataset.name}"]`).remove();
            console.log("firstkey_search" + firstkey_search);
            console.log(keyword);
            keyword_search_reset();//有問題
            event_setOption_function();
            sidebar_level_render();
            if (keyword.length == 0) {
                $(".max_level").hide();
                if (onlyLOD == 1) {
                    $(".common_show_value").hide();
                    $(".word_strength").hide();
                } else {
                    $(".common_show_value").show();
                    $(".word_strength").show();
                }

            }
        });
    };

    // IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
    // compute the render data when user choose the data to delete in keyword field 
    function keyword_search_reset() {
        union_collect = [];
        if (keyword.length == 0) {
            option.series[0].categories = data.all_category;
        } else {
            option.series[0].categories = data.all_category.filter(category => {
                return keyword.includes(category.target) || keyword.includes(category.source);
            })
        }
        option.series[0].links = option.series[0].categories.filter(category => {
            // return the category that show property is true
            if (category.show == true) {
                union_collect.push(category.target, category.source);
                return category;
            }
        })
        // remove the duplicate name which in the union_collect
        union_collect = Array.from(new Set(union_collect));
        option.series[0].nodes = data.nodes.filter(node => {
            // console.log(user_colors[node.gp])
            keyword.includes(node.name) ? node.itemStyle.normal.color = 'red' : node.itemStyle.normal.color = user_colors[node.gp];//原color[node.gp]
            return union_collect.includes(node.name);
        });
        change_spaecialone_type(csType.css3[0].symbol, csType.css3[0].normal.color);
    }
}

// IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
// compute the data when occurs the legendselectchanged event on category bar

// todo : improve the performance

Chart.on('legendselectchanged', (category_select) => {
    // console.log(category_select);
    console.log($('#max_level').val());
    // console.log($('[name="cs_value"]').val());
    // $('#max_level').val() === '1' ? category_max_level_1() : category_max_level_2();原本的
    // // $('#common_show_value').val() === '0' ? category_max_level_3() : category_max_level_4();//新增的會打架 有問題
    $('slider').change(
        $('.slider').val() === '1' ? category_max_level_1() : category_max_level_2()
    )//超級奇怪的

    function category_max_level_1() {
        let collect = [];
        console.log("category_max_level_1");
        option.series[0].categories = data.all_category.filter(category => {
            if (category.name == category_select.name) category.show = !category.show;

            if (keyword.length == 0) {
                return category;
            } else {
                return keyword.includes(category.target) || keyword.includes(category.source);
            }
        });

        option.series[0].links = option.series[0].categories.filter(category => {
            if (category.show == true) {
                collect.push(category.source, category.target);
                return category;
            }
        });

        collect = Array.from(new Set(collect));

        option.series[0].nodes = data.nodes.filter(node => {
            return collect.includes(node.name);
        })
    }

    function category_max_level_2() {
        let collect = [];
        console.log("category_max_level_2");

        option.series[0].categories = option.series[0].categories.filter(category => {
            if (category.name == category_select.name) category.show = !category.show;

            return category;
        })

        option.series[0].links = option.series[0].categories.filter(category => {
            if (category.show == true) {
                collect.push(category.source, category.target);
                return category;
            }
        });

        collect = Array.from(new Set(collect));

        option.series[0].nodes = data.nodes.filter(node => {
            return collect.includes(node.name);
        })
    }

    event_setOption_function();
    sidebar_level_render();
});

// max_level
function max_Level(ui_value) {
    console.log("max_Level work");
    ui_value == 1 ? ui_value_1() : ui_value_2();
    ui_user = ui_value;
    console.log(ui_user);

    function ui_value_1() {
        let collect = [];

        option.series[0].categories = data.category.filter(category => {//把第一階層過濾出來
            return keyword.includes(category.source) || keyword.includes(category.target);
        });

        option.series[0].links = data.category.filter(category => {
            // if (category.show == true) {
            if (keyword.includes(category.source) || keyword.includes(category.target)) {
                collect.push(category.source, category.target);
                return category;
            }
            // }
        });
        collect = Array.from(new Set(collect));//set 有不重複的功能 並變成陣列
        // console.log(collect); //[a,b]

        option.series[0].nodes = data.nodes.filter(node => {
            return collect.includes(node.name);
        })
    };

    function ui_value_2() {
        let collect = [];
        let category_collect = [];
        let minus = $(union_collect).not(keyword).toArray();
        test1 = [];

        console.log(union_collect);
        console.log(minus);//紀錄由keyword連結的兩個點

        for (let i = 1; i < ui_value; i++) {
            option.series[0].categories = data.category.filter(category => {
                // return minus.includes(category.target) || minus.includes(category.source);
                if (minus.includes(category.target) || minus.includes(category.source)) {
                    category_collect.push(category.target, category.source);
                    // console.log(category_collect);

                    return category;
                }
            });
            category_collect = Array.from(new Set(category_collect));
            // console.log(category_collect);//全部顯示在螢幕上的點
            minus = $(category_collect).not(keyword).toArray();
        };

        option.series[0].links = option.series[0].categories.filter(category => {
            if (category.show == true) {
                collect.push(category.source, category.target);
                console.log(collect);

                return category;
            }
        })

        collect = Array.from(new Set(collect));

        option.series[0].nodes = data.nodes.filter(node => {
            // return collect.includes(node.name);
            if (collect.includes(node.name)) {
                test1.push(node.name);
                return node
            }
        })
        // console.log(test);//全部顯示在螢幕上的點
        // console.log(option.series[0].categories);//links
    };



    event_setOption_function();
    sidebar_level_render();
}


// the involve function that will read the jquery_slider_setting in Main_setting.js, then create the jquery slider
$(() => {
    const length = [option.series[0].force.edgeLength[0], option.series[0].force.edgeLength[1]]

    for (jquery_slider_setting_element of jquery_slider_setting) {
        $(`.slider_item > #${jquery_slider_setting_element.object}`).slider({
            disabled: jquery_slider_setting_element.disable,
            range: jquery_slider_setting_element.range,
            min: jquery_slider_setting_element.min,
            max: jquery_slider_setting_element.max,
            step: jquery_slider_setting_element.step,
            value: jquery_slider_setting_element.value,
        });
        $(`.slider_item > input[id=${jquery_slider_setting_element.object}]`).val(jquery_slider_setting_element.value);
    };

    $('.slider_slider').slider({
        slide: function (e, ui) {
            if (e.target.id == 'common_show_value') {
                if (ui.value == min_common_show_value - 1) {
                    $('input[id=' + e.target.id + ']').val('沒共現');
                } else {
                    $('input[id=' + e.target.id + ']').val(`${ui.value}`);
                }
                // console.log(ui.value);
            } else {
                $('input[id=' + e.target.id + ']').val(ui.value);
            }
            switch (e.target.id) {
                case 'max_level':
                    max_Level(ui.value);

                    break;
                case 'relation_strength':
                    break;
                // case 'word_strength':
                //     break;
                case 'group_label_distance':
                    break;
                case 'relation_distance':
                    option.series[0].force.edgeLength = ui.value;
                    event_setOption_function();
                    break;
                case 'relation_link_width':
                    change_width(ui.value);
                    // slide_relation_link_width_function(e, ui);
                    event_setOption_function();
                    break;
                case 'main_screen_room':
                    option.series[0].zoom = ui.value;
                    // slide_main_screen_room_function(e, ui);
                    event_setOption_function();
                    break;
                case 'relation_font_size':
                    option.series[0].edgeLabel.normal.textStyle.fontSize = ui.value;
                    // slide_relation_font_size_function(e, ui);
                    event_setOption_function();
                    break;
                case 'subject_font_size':
                    option.series[0].itemStyle.normal.label.textStyle.fontSize = ui.value;
                    // slide_subject_font_size_function(e, ui);
                    event_setOption_function();
                    break;
                case 'node_size':
                    change_node_size(ui.value);
                    break;
                case 'word_strength'://詞頻強度
                    word_strength(ui.value);
                    break;
                case 'common_show_value'://共現次數
                    common_value(ui.value);
                    break;
            };
        }

    });
});
function change_width(width_value) {
    data.links.forEach(link => {
        link.lineStyle.normal.width = link.lineStyle.normal.oldwidth * width_value;
    });
    Chart.setOption(option);
}
function change_node_size(node_size_value) {
    data.nodes.forEach(node => {
        node.symbolSize = node.old_symbolSize * node_size_value;
    });
    Chart.setOption(option);
    event_setOption_function();
}
function word_strength(value) {
    var value_filter = [];
    option.series[0].nodes = data.nodes.filter(node => {
        if (node.orign_idf >= value) {
            value_filter.push(node.name);
            return node;
        }
    })
    option.series[0].categories = data.all_category.filter(category => {
        if (value_filter.includes(category.target) && value_filter.includes(category.source)) {
            return category;
        }
    })
    option.series[0].links = option.series[0].categories.filter(category => {
        if (value_filter.includes(category.target) && value_filter.includes(category.source)) {
            return category;
        }
    })
    Chart.setOption(option);
    sidebar_level_render();
    event_setOption_function();
}
function common_value(value) {
    var value_filter = [];
    // console.log(value);//normal
    if (value == min_common_show_value - 1) {
        option.series[0].categories = data.all_category.filter(category => {
            return category.orign_v == 0;
        })
        option.series[0].links = option.series[0].categories.filter(category => {
            // if (category.show == true) {
            value_filter.push(category.target, category.source);
            return category;
            // }
        })
        value_filter = Array.from(new Set(value_filter));
        option.series[0].nodes = data.nodes.filter(node => {
            // console.log(value_filter.includes(node.name));
            return value_filter.includes(node.name);
        });
        console.log(option);
        Chart.setOption(option);
    } else {
        option.series[0].categories = data.all_category.filter(category => {
            return category.orign_v >= value;
        })

        option.series[0].links = option.series[0].categories.filter(category => {
            // if (category.show == true) {
            value_filter.push(category.target, category.source);
            return category;
            // }
        })
        // console.log(value_filter);
        value_filter = Array.from(new Set(value_filter));
        // console.log(value_filter);

        option.series[0].nodes = data.nodes.filter(node => {
            // console.log(value_filter.includes(node.name));
            return value_filter.includes(node.name);
        });
    }
    // console.log(option);
    // console.log(value_filter);

    // sidebar_level_render();
    event_setOption_function();
}

none_orign_idf_node(csType.css_link[0].borderType, csType.css_link[0].borderColor, csType.css_link[0].borderWidth);//可以改變idf=0的樣式
function none_orign_idf_node(bType = 'solid', bColor = 'orange', bWidth = 5) {//idf==0的點有border
    var temp;
    temp = data.nodes.filter(node => {
        return node.orign_idf == 0;
    })
    temp.forEach(t => {
        var ttemp = t.itemStyle.normal;
        ttemp.borderType = bType;
        ttemp.borderColor = bColor;
        ttemp.borderWidth = bWidth;
    })
    // console.log(temp);
    Chart.setOption(option);
}
change_spaecialone_type(csType.css3[0].symbol, csType.css3[0].normal.color);//可以改變同時為輸出及輸入的樣式
function change_spaecialone_type(symbol = 'circle', color = 'pink') {
    var temp;
    var ttarget = [];
    var tsource = [];
    var result_t;
    var result_s;
    var concat;
    var Result;
    user_colors[3] = color;

    data.category.forEach(c => {
        ttarget.push(c.target);
        tsource.push(c.source);
    })
    result_t = Array.from(new Set(ttarget));
    result_s = Array.from(new Set(tsource));

    concat = result_t.concat(result_s);
    Result = concat.filter(function (element, index, arr) {
        return arr.indexOf(element) !== index;

    })
    temp = data.nodes.filter(node => {
        return Result.includes(node.name);
    })
    // console.log(temp);
    temp.forEach(t => {
        t.symbol = symbol;
        t.itemStyle.normal.color = color;

    })
    // console.log(temp);
    Chart.setOption(option);
}
// The function to render the data to canvas after set all option finish
function event_setOption_function() {
    Chart.setOption(option, {
        notMerge: false,
        lazyUpdate: false,
        silent: false
    });
};

Chart.on('click', e => {
    // console.log(e);
    console.log(e.data.source, e.data.target, e.data.name);
    searchBookAssociation(24970, '寶玉', '高興', 'test');

    function searchBookAssociation(bid, key1, key2, relation) {
        var associationQuery = '"' + key1 + '" AND "' + key2 + '"';
        // http://dh.ascdc.sinica.edu.tw/member/text/segementRelationDetails.jsp
        $.get('http://dh.ascdc.sinica.edu.tw/member/text/segementRelationDetails.jsp', {
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
})