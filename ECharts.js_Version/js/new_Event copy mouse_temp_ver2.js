// 這個是兩個點同時搜尋 名為new_event copy mouse_ver2
//搜尋兩個or暫時刪除 02/10
// variable
var keyword = [];//single search
var union_collect = [];
var category_collect = [];
var ui_user;
var route = [];
window.onresize = () => {
    Chart.resize();
}
// EventListener
$('#keyword_search_field').keyup((e) => {
    keyword_search(e)
});
$('#keyword_search_button').on('click', keyword_search);
keyword.length == 0 ? (($(".max_level").hide()),($('.selected_route').hide())): $(".max_level").show();
/**
 * keyword_search function
 * @param {event} e
 */
function keyword_search(e) {
    // get the search name
    var keyword_search_name = $('#keyword_search_field').val();
    keyword_search_name = keyword_search_name.trim();
    var keyword_search_name_s = [];
    if (keyword_search_name.includes("&")) {//搜尋兩個 AND
        //keyword
        keyword_search_name_s = keyword_search_name.split("&");//keyword_search_name_s=[]//存打入的字 形式:[a,b]
        if (e.which === 13 || e.type === 'click') { //點搜尋或按ENTER
                search_AND(keyword_search_name_s);
        };
    } else if (keyword_search_name.includes("/")) {//搜尋兩個 OR
        keyword_search_name_s = keyword_search_name.split("/");//keyword_search_name_s=[]
        if (e.which === 13 || e.type === 'click') { //點搜尋或按ENTER
            for(var i=0,keywordLen = keyword_search_name_s.length; i < keywordLen; i++){
                keyword_search_verify_pass(keyword_search_name_s[i]);
        }
        }
    } else {//搜尋一個
        keyword_search_name_s.push(keyword_search_name);
        if (e.which === 13 || e.type === 'click') { //點搜尋或按ENTER
            keyword_search_verify_pass(keyword_search_name_s[0]);
        };
    }
    ////搜尋兩個AND start------------------------------------------------
    //https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/713294/
    function search_AND(keyword_search_name_s){
        route = [];
        var primaryStack = new Array();
        var secondaryStack = new Array();
        // var markStack = new Array();
        var temp2 = new Array();
        var Finish = true;
        console.log(option.series[0].nodes);
        for(var i = 0,keywordLen = keyword_search_name_s.length;i<keywordLen; i++){
            keyword_search_name_s[i] = keyword_search_name_s[i].trim();
            if(keyword_search_name_s[i].length == 0){
                return keyword_search_verify_fail(keyword_search_name);
            }       
            if(!data.all_nodes.includes(keyword_search_name_s[i])){
                return keyword_search_verify_fail(keyword_search_name);
            }
            if(option.series[0].nodes.map(function(item, index, array) {
                return item.name;}
                ).indexOf(keyword_search_name_s[i]) === -1 && keyword.length != 0){
                return keyword_search_verify_fail_in_page(keyword_search_name);
            }

        }
        $(".max_level").hide();
        $(".common_show_value").hide();
        $(".word_strength").hide();
        // avoid same keyword search twice
        var keywordTemp = keyword_search_name_s[0];
        $('#keyword_search_field').val(''); // clear the keyword search field
        var nodeCollection;
        var secondaryStackCount = -1;
        do{
            temp2 = [] ;
        nodeCollection = [];
        primaryStack.push(keywordTemp);
        // markStack.push(keywordTemp);
        var temp = data.category.filter(category => {
            return keywordTemp.includes(category.target) || keywordTemp.includes(category.source);
        });
            // console.log(temp);
        var linktemp = temp.filter(category => {
                nodeCollection.push(category.target, category.source);
        });
        nodeCollection = Array.from(new Set(nodeCollection));
        for(var i =0,uLen = nodeCollection.length;i < uLen;i++){
            if(!primaryStack.includes(nodeCollection[i])){
                temp2.push(nodeCollection[i]);
            }
        }
        secondaryStack.push(temp2);
        secondaryStackCount++;
        if(primaryStack[primaryStack.length-1] == keyword_search_name_s[keyword_search_name_s.length -1]){
            route.push(Array.from(primaryStack));
            console.log(primaryStack);
            console.log(route);
            for(var i =0,uLen = secondaryStack.length;i < uLen;i++) {
                if (secondaryStack[i].length != 0){
                    Finish = false;
                    break;
                }
            }
            if (Finish == true){break;}
            else {Finish = false}
        }
        if (primaryStack.length == 0 && route.length == 0){
            alert(`Error2 : Cannot find their route : ${keyword_search_name}`);
            return;
        }
        do{
        while(secondaryStack[secondaryStackCount].length == 0)
        {
            if (secondaryStackCount == 0)
            {
                break;
            }
            primaryStack.pop();
            secondaryStack.pop();
            secondaryStackCount--;
        }
            keywordTemp = secondaryStack[secondaryStackCount].pop();
        }while(primaryStack.includes(keywordTemp))
        if (keywordTemp == undefined)
            {
                break;
            }
        console.log(keywordTemp);   
        console.log(primaryStack);
        console.log(secondaryStack);
    }while(1)
    console.log("YA!!!!!");
    console.log(route.length);
    console.log(route);
    for(var i = 0;i<route.length;i++)
    {
        for(var x = 0,len = keyword_search_name_s.length;x<len;x++){
            if(!route[i].includes(keyword_search_name_s[x])){
                route.splice(i,1); 
            }
        }
    }
    if(route.length === 0){
        alert(`Error2 : Cannot find their route : ${keyword_search_name}`);
        return;
    }
    // for(var i = 0;i<route.length;i++)
    // {
    //     if(option.series[0].nodes.map(function( item, index, array) {
    //         return item.name;}
    //         ).indexOf(keyword_search_name_s[i]) === -1){
    //             route.splice(i,1); 
    //         }
    // }
    if(route.length === 0)
        return keyword_search_verify_fail_in_page(keyword_search_name);
    console.log(route);
        data_filter();
        event_setOption_function();
        sidebar_level_render();
        keyword_item_append(keyword_search_name);
        keyword_item_delete();
        
    }
    ////搜尋兩個AND --end --

    // function fullyConnected(keyword_search_name_s){
    //         option.series[0].categories = option.series[0].categories.filter(category => {
    //             return keyword.includes(category.target) && keyword.includes(category.source);
    //         });
    //         console.log(option.series[0].categories);

    //         option.series[0].links = option.series[0].categories.filter(category => {
    //             if (category.show == true) {
    //                 return category;
    //             }
    //         });
    //         option.series[0].nodes = option.series[0].nodes.filter(node => {
    //             return keyword_search_name_s.includes(node.name) 
    //         });
    //         event_setOption_function();
    //         sidebar_level_render();
    //         if(!keyword_search_name.includes(keyword)){
    //             keyword_item_append(keyword_search_name);
    //         }
    //         keyword_item_delete();
    // }
    function keyword_search_verify_pass(kwd_search_name) {
            kwd_search_name = kwd_search_name.trim(); 
            if(kwd_search_name.length == 0){
                return;
            }       
            if(!data.all_nodes.includes(kwd_search_name)){
                return keyword_search_verify_fail(kwd_search_name);
            }
        
        $(".max_level").show();
        $(".common_show_value").hide();
        $(".word_strength").hide();

        // avoid same keyword search twice
        if (keyword.includes(kwd_search_name)) {
            alert(`Error :  same keyword can not search more than twice`);
            $('#keyword_search_field').val('');
            return;
        }
        $('#keyword_search_field').val(''); // clear the keyword search field
        keyword_item_append(kwd_search_name);
        data_filter(window.ui_user);
        event_setOption_function();
        sidebar_level_render();
        keyword_item_delete();
    };
 
    function keyword_search_verify_fail(kwd_search_name) {//一個 name
        alert(`Error : Cannot find keyWord : ${kwd_search_name}`);
    };
    function keyword_search_verify_fail_in_page(kwd_search_name) {//一個 name
        alert(`Error : keyWord not in this page: ${kwd_search_name}`);
    };
    // append keyword div in keyword field
    //下方新增delete鍵
    function keyword_item_append(kwd_search_name) {
        keyword.push(kwd_search_name);
        $('#keyword_search_field').val(''); // clear the keyword search field
        $('.keyword').append(`<div class="keyword_item" data-item="${kwd_search_name}">
        <p class="keyword_name" >${kwd_search_name}</p>
        <button class="keyword_delete" data-name='${kwd_search_name}'>delete</button>
    </div>`)
        console.log(keyword_search_name);
    };
    // bind the keyword delete button click event
    function keyword_item_delete() {
        // avoid to bind the click(delete) event twice, have to unbind the first click event first.
        $('.keyword_delete').off('click').click(e => {
            console.log(keyword);
            console.log(e.currentTarget.dataset.name);
            console.log(keyword.indexOf(e.currentTarget.dataset.name));
            keyword.splice(keyword.indexOf(e.currentTarget.dataset.name), 1);
            if (e.currentTarget.dataset.name.includes("&")) {
                $('.selected_route').hide();
                route  = [];
            }
            $(`div[data-item="${e.currentTarget.dataset.name}"]`).remove();
            console.log(keyword);
            keyword_search_reset();
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

    function keyword_search_reset() {
        union_collect = [];
        if (keyword.length == 0) {//刪除完全數清空
            console.log("reset1");
            option.series[0].categories = data.all_category;
        } else {//刪除完還有剩
            console.log("reset2");
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
        console.log("reset3");
        union_collect = Array.from(new Set(union_collect));
        option.series[0].nodes = data.nodes.filter(node => {
            keyword.includes(node.name) ? node.itemStyle.normal.color = 'red' : node.itemStyle.normal.color = user_colors[node.gp];//原color[node.gp]
            return union_collect.includes(node.name);
        });
        change_spaecialone_type(csType.css3[0].symbol, csType.css3[0].normal.color);
        if(route.length != 0){
            console.log(route.length);
            data_filter_and();
            return;
        }
        for(var i = keyword.length-1;i>=0;i--){
            if (keyword[i].includes("&")) {//搜尋兩個 AND
                keyword_search_name_s = keyword[i].split("&");
                keyword_search_name = keyword[i];
                $(`div[data-item="${keyword[i]}"]`).remove();
                keyword.splice(i, 1);
                search_AND(keyword_search_name_s);
                return;
            } 

        }
    }
    
}
function data_filter_and(request = -1){
    if(route.length == 0)
    {
        return;
    }
    if(request === -1){
        route.sort(function (a, b) {
            if (a.length > b.length) {
                return -1;
              }
              if (a.length < b.length) {
                return 1;
              }
              return 0;
          });
         var sortest = 0;
         console.log(route);
    }
    else{
       var  maxLen = route[0].length - request;
       console.log(maxLen);
       if(route[route.length-1].length>maxLen){
             console.log("error: maxlen too small");
             return -1;
       }
       for(var i=1;i<route.length;i++){
           if(route[i].length === maxLen){
            var sortest = i;
            break;
           }
       }
    }
   $('.selected_route').show();
   $('#selected_route').slider( "option", "max", route.length-1 );
   console.log(sortest);
    var temp = [];
    var nodeCollection = [];
    option.series[0].categories = [];
    for(var y=sortest;y<route.length;y++){
        for(var i = 0,len = route[y].length;i<len-1;i++)
        temp = temp.concat(data.category.filter(category => {
            if(route[y][i].includes(category.target) && route[y][i+1].includes(category.source)){
                return route[y][i].includes(category.target) && route[y][i+1].includes(category.source);
            }
            else if(route[y][i+1].includes(category.target) && route[y][i].includes(category.source)){
                return route[y][i+1].includes(category.target) && route[y][i].includes(category.source);
            }
        }));
    console.log(temp);
    a = option.series[0].nodes.map(function(item, index, array) {
        return item.id;});
        console.log(a);
        temp = temp.filter(category => {
            return !a.includes(category.id);
        });
        console.log(temp);
        nodeCollection = nodeCollection.concat(route[y]);
        nodeCollection = Array.from( new Set(nodeCollection) );
        option.series[0].categories = option.series[0].categories.concat(temp);
        console.log(option.series[0].categories);
        if(y+1 === route.length || route[y+1].length != route[sortest].length)
            break;
    }
    temp = option.series[0].categories.filter(category => {
        if (category.show == true) {
            return category;
        }
    });
    a = option.series[0].links.map(function(item, index, array) {
        return item.id;})
        temp = temp.filter(links => {
            return !a.includes(links.id);
        });
        option.series[0].links = option.series[0].links.concat(temp);
        temp = data.nodes.filter(node => {
            route[0][0].includes(node.name) ? node.itemStyle.normal.color = 'red' : null;
            route[0][route[0].length - 1].includes(node.name) ? node.itemStyle.normal.color = 'red' : null;
            return nodeCollection.includes(node.name);
        });
        a = option.series[0].nodes.map(function(item, index, array) {
            return item.name;});
            temp = temp.filter(node => {
                return !a.includes(node.name);
            });
        option.series[0].nodes = option.series[0].nodes.concat(temp);
        change_spaecialone_type(csType.css3[0].symbol, csType.css3[0].normal.color);

}
function selectRoute(request){
   if(data_filter_and(request) != -1){
        event_setOption_function();
        sidebar_level_render();
   }
}
// IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
 // compute the data which will render on canvas
function data_filter(ui_user) {
    union_collect = [];
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
    let minus = $(union_collect).not(keyword).toArray();
    console.log(minus);
    for (let i = 1; i < ui_user; i++) {
        option.series[0].categories = data.category.filter(category => {
            console.log("work");
            if (minus.includes(category.target) || minus.includes(category.source)) {
                category_collect.push(category.target, category.source);
                return category;
            }
        });
        category_collect = Array.from(new Set(category_collect));
        console.log(category_collect);
        minus = $(category_collect).not(keyword).toArray();
    };
    console.log("category_collect" + category_collect);//這個!!
    option.series[0].links = option.series[0].categories.filter(category => {
        if (category.show == true) {
            collect.push(category.source, category.target);
            return category;
        }
    })
    collect = Array.from(new Set(collect));
    option.series[0].nodes = data.nodes.filter(node => {
        keyword.includes(node.name) ? node.itemStyle.normal.color = 'red' : null;
        return collect.includes(node.name);
    })
    data_filter_and();
}
// IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
// compute the data when occurs the legendselectchanged event on category bar

// todo : improve the performance

Chart.on('legendselectchanged', (category_select) => {
    // console.log(category_select);
    // console.log($('#max_level').val());
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
            console.log(category);
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
    data_filter(ui_value);
    event_setOption_function();
    sidebar_level_render();
}


// the involve function that will read the jquery_slider_setting in Main_setting.js, then create the jquery slider
$(() => {
    // const length = [option.series[0].force.edgeLength[0], option.series[0].force.edgeLength[1]]

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
                case 'selected_route': //選擇路線
                    selectRoute(ui.value);
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
        value_filter = Array.from(new Set(value_filter));

        option.series[0].nodes = data.nodes.filter(node => {
            return value_filter.includes(node.name);
        });
    }
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
    var result_t = []; //裝target的點
    var result_s = []; //裝source的點
    var concat; //target source合併之後的點
    var Result; //要變成咖啡色的點
    user_colors[3] = color;

    data.category.forEach(c => {
        result_t.push(c.target);
        result_s.push(c.source);
    })
    result_t = Array.from(new Set(result_t));
    result_s = Array.from(new Set(result_s));
    // console.log(result_s);
    concat = result_t.concat(result_s);

    Result = concat.filter((element, index, arr) => {
            return arr.indexOf(element) !== index;
        })
        // console.log(Result);
    Result = data.nodes.filter(node => {
        return Result.includes(node.name);
    })
    Result.forEach(t => {
        t.symbol = symbol;
        if (t.itemStyle.normal.color !== "red") {
            t.itemStyle.normal.color = color;
        }
    })
    Chart.setOption(option);
}
// The function to render the data to canvas after set all option finish
function event_setOption_function() {
    Chart.setOption(option,true);
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
