// variable
var keyword = [];
var categories_select_set = [];
var category_select_temp = [];
var keyword_search_unionSet = [];
var keyword_node = [];

// window resize
window.onresize  = () => {
    Chart.resize();
}

// EventListener
$('#keyword_search_field').keyup((e) => {
    const keyword_search_name = $('#keyword_search_field').val();

    if (e.which == 13) {
        all_nodes.includes(keyword_search_name) ? keyword_search_verify_pass() : keyword_search_verify_fail();
    };

    function keyword_search_verify_pass() {
        if (keyword.includes(keyword_search_name)) {
            alert(`Error, same keyword can not search more than twice`);
            return;
        }
        keyword.push(keyword_search_name);
        $('#keyword_search_field').val('');
        data_filter();
        event_setOption_function();
        sidebar_level_render();
        keyword_item_append();
        keyword_item_delete();
    };

    function keyword_search_verify_fail() {
        alert(`Can't not find keyWord : ${keyword_search_name}`);
    };

    function keyword_item_append() {
        $('.keyword').append(`<div class="keyword_item" data-item="${keyword_search_name}">
        <p class="keyword_name" >${keyword_search_name}</p>
        <button class="keyword_delete" data-name='${keyword_search_name}'>delete</button>
    </div>`)
    };

    function data_filter() {
        let link_source_target = {
            source: [],
            target: []
        };
        keyword_node.length = 0;
        
        // ! link
        option.series[0].links = data.links.filter(link => {
            if ( ((keyword.includes(link.source)) || keyword.includes(link.target)) && !(categories_select_set.includes(link.value))) {
                link_source_target.source.push(link.source);
                link_source_target.target.push(link.target);
                return link;
            };
        });
        console.log(categories_select_set);

        let node_unionSet = Array.from(new Set([...link_source_target.source, ...link_source_target.target]));

        // ! nodes
        option.series[0].nodes = option.series[0].nodes.filter(node => {
            if (node_unionSet.includes(node.name)) {
                keyword.includes(node.name) ? node.itemStyle.normal.color = 'red' : node.itemStyle.normal.color = '#2F4554';
                keyword_node.push(node.name);
                return node;
            };
        });
        console.log(option.series[0].nodes);
        console.log(keyword_node)

        // ! category
        option.series[0].categories = data.original_category.filter(category => {
            // console.log(category);
            if ((keyword.includes(category.k1)) || (keyword.includes(category.k2))) {
                return category;
            }
        })
        console.log(option.series[0].categories);
    };

    function keyword_item_delete() {
        $('.keyword_delete').off('click').click(e => {
            keyword.splice(keyword.indexOf(e.currentTarget.dataset.name), 1);
            keyword_item_delete(e.currentTarget.dataset.name);
            $(`div[data-item=${e.currentTarget.dataset.name}]`).remove();
            // data_filter();
            keyword_search_reset();
            event_setOption_function();
            sidebar_level_render();
        });
    };

    function keyword_search_reset() {
        let link_source_target = {
            source: [],
            target: []
        };
        if (keyword.length == 0) {
            data.nodes.forEach(node => {
                node.itemStyle.normal.color = '#2F4554';
            });
        }
        option.series[0].links = data.links.filter(link => {
            if(!(categories_select_set.includes(link.value))){
                link_source_target.source.push(link.source);
                link_source_target.target.push(link.target);
                return link;
            }
        });

        let node_unionSet = Array.from(new Set([...link_source_target.source, ...link_source_target.target]));

        option.series[0].nodes = data.nodes.filter(node => {
            return node_unionSet.includes(node.name);
        });

        option.series[0].categories = data.category;
    }
});

// Canvas
Chart.on('legendselectchanged', (category_select) => {
    let temp = [];
    let link_source_target = {
        source: [],
        target: []
    };
    category_select_temp.includes(category_select.name) ? category_select_temp.splice(category_select_temp.indexOf(category_select.name, 1)) : category_select_temp.push(category_select.name);
    for (element of Object.entries(category_select.selected)) {
        if(category_select_temp.includes(element[0]) && element[1] == false){
            temp.push(element[0]);
        }
    };
    categories_select_set = temp;


    console.log(keyword)
    // ! link
    option.series[0].links = data.links.filter(link => {
        for (category_select_element of Object.entries(category_select.selected)) {
            if ( (category_select_element[0] === link.value && category_select_element[1] === true)){
                link_source_target.source.push(link.source);
                link_source_target.target.push(link.target);
                return link;
            }
            continue;
        }
    });
    console.log(option.series[0].links)

    let node_unionSet = Array.from(new Set([...link_source_target.source, ...link_source_target.target]));
    keyword_search_unionSet = node_unionSet;

    console.log(node_unionSet);
    // ! node
    option.series[0].nodes = data.nodes.filter(node => {

        return node_unionSet.includes(node.name) ;
    });

    // ! category
    option.series[0].categories = data.original_category.filter(category_element => {
        if(keyword.length == 0) return category_element;
        return keyword.includes(category_element.k1) || keyword.includes(category_element.k2);
    })

    event_setOption_function();
});

// max_level
function max_Level(ui_value) {
    keyword.length != 0 ? keyword_length_verify_pass() : keyword_length_verify_fail();

    function keyword_length_verify_pass() {
    };

    function keyword_length_verify_fail() {

        alert('Error, you have to type in keyword first, then use this function');
        return;
    }
}

// new sidebar slider
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
    // $('#relation_strength').slider('disable');

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



function event_setOption_function() {
    Chart.setOption(option, {
        notMerge: false,
        lazyUpdate: false,
        silent: false
    });
};