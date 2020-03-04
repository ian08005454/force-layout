// variable
var keyword = [];
var search_Word_node_union_collect = [];
var max_level_union_collect = [];

// window resize //detect window resizing and resize the chart
window.onresize = () => {
    Chart.resize();
}

// EventListener
$('#keyword_search_field').keyup((e) => { keyword_search(e) });
$('#keyword_search_button').on('click', keyword_search);


/**
 * keyword_search function
 * @param {event} e
 */
function keyword_search(e){
    // get the search name
    const keyword_search_name = $('#keyword_search_field').val();

    // validate the keyword is in the data name or not. If yes, run keyword_search_verify_pass, if not, run keyword_search_verify_fail
    if ( e.which === 13 || e.type ==='click' ) { //點搜尋OR按ENTER
        data.all_nodes.includes(keyword_search_name) ? keyword_search_verify_pass() : keyword_search_verify_fail();
    };


    function keyword_search_verify_pass() {
        // avoid same keyword search twice
        if (keyword.includes(keyword_search_name)) {
            alert(`Error, same keyword can not search more than twice`);
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
    function keyword_item_append() {
        $('.keyword').append(`<div class="keyword_item" data-item="${keyword_search_name}">
        <p class="keyword_name" >${keyword_search_name}</p>
        <button class="keyword_delete" data-name='${keyword_search_name}'>delete</button>
    </div>`)
    };

    // IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
    // compute the data which will render on canvas
    function data_filter() {
        // compute the category

        if($('#max_level').val() == '1'){
            option.series[0].categories = data.all_category.filter(category => {
                return keyword.includes(category.target) || keyword.includes(category.source);
            });
        }else{
            console.log('test');
            let minus = $(search_Word_node_union_collect).not(keyword).toArray();
        }
        

        // compute the links
        option.series[0].links = option.series[0].categories.filter(category =>{
            if(category.show == true){
                search_Word_node_union_collect.push(category.target, category.source);
                return category;
            }
        })

        // remove the duplicate name which in search_Word_node_union_collect array
        search_Word_node_union_collect = Array.from(new Set(search_Word_node_union_collect));

        // compute the nodes
        option.series[0].nodes = data.nodes.filter(node => {
            keyword.includes(node.name) ? node.itemStyle.normal.color = 'red' : node.itemStyle.normal.color = '#2F4554';
            return search_Word_node_union_collect.includes(node.name);
        })
    };

    // bind the keyword delete button click event
    function keyword_item_delete() {
        // avoid to bind the click(delete) event twice, have to unbind the first click event first.
        $('.keyword_delete').off('click').click(e => {
            keyword.splice(keyword.indexOf(e.currentTarget.dataset.name), 1);
            keyword_item_delete(e.currentTarget.dataset.name);
            $(`div[data-item=${e.currentTarget.dataset.name}]`).remove();
            keyword_search_reset();
            event_setOption_function();
            sidebar_level_render();
        });
    };

    // IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
    // compute the render data when user choose the data to delete in keyword field 
    function keyword_search_reset() {
        if(keyword.length == 0){
            option.series[0].categories = data.all_category;
        }else {
            option.series[0].categories = data.all_category.filter(category => {
                return keyword.includes(category.source) || keyword.includes(category.target);
            })
        }

        option.series[0].links = option.series[0].categories.filter(category => {
            
        })
    }
}

// IMPORTANT FUNCTION !! DO NOT CHANGE ANY PARAMETER IN THIS FUNCTION
// compute the data when occurs the legendselectchanged event on category bar
Chart.on('legendselectchanged', (category_select) => {


    event_setOption_function();
    sidebar_level_render();
});

// max_level
function max_Level(ui_value) {    
    console.log($('#max_level').val());
    keyword.length != 0 ? keyword_length_verify_pass() : keyword_length_verify_fail();

    function keyword_length_verify_pass() {
        let inner_union_collect = [];

        let minus = $(search_Word_node_union_collect).not(keyword).toArray();
        if(ui_value != 1){
            for(let i=1; i<ui_value; i++){
                option.series[0].categories = data.category.filter(category => {
                    if(minus.includes(category.source) || minus.includes(category.target)){
                        inner_union_collect.push(category.source);
                        inner_union_collect.push(category.target);
                        return category;
                    }
                })
                inner_union_collect = Array.from(new Set(inner_union_collect));
                minus = $(inner_union_collect).not(keyword).toArray();
            }
        }else {
            option.series[0].categories = data.all_category.filter(category => {
                return keyword.includes(category.target) || keyword.includes(category.source);
            })
        }

        max_level_union_collect = Array.from(new Set([...search_Word_node_union_collect, ...inner_union_collect]));

        option.series[0].nodes = data.nodes.filter(node => {
            return max_level_union_collect.includes(node.name);
        });

        option.series[0].links = option.series[0].categories;

        event_setOption_function();
        sidebar_level_render();
        console.log('================');
    };

    function keyword_length_verify_fail() {
        alert('Error, you have to type in keyword first, then use this function');
        return;
    }
}

// the involve function that will read the jquery_slider_setting in Main_setting.js, then create the jquery slider
$(() => {
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
            $('input[id=' + e.target.id + ']').val(ui.value);
            switch (e.target.id) {
                case 'max_level':
                    max_Level(ui.value);

                    break;
                case 'relation_strength':
                    break;
                case 'word_strength':
                    break;
                case 'group_label_distance':
                    break;
                case 'relation_distance':
                    option.series[0].force.edgeLength = ui.value * 1.8;
                    // slide_relation_distance_function(e, ui);
                    event_setOption_function();
                    break;
                case 'relation_link_width':
                    option.series[0].lineStyle.normal.width = ui.value;
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
                    option.series[0].symbolSize = ui.value;
                    // slide_node_size_function(e, ui);
                    event_setOption_function();
                    break;
            };
        }
    });
});

// The function to render the data to canvas after set all option finish
function event_setOption_function() {
    Chart.setOption(option, {
        notMerge: false,
        lazyUpdate: false,
        silent: false
    });
};

Chart.on('click', e => {
    console.log(e);
    
})