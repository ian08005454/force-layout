keyword.forEach(keyword_name => {
    console.log(keyword_name);
    $('.keyword').append(() => {
        return `
        <div class="keyword_item">
            <p class="keyword_name">${keyword_name}</p>
            <button class="keyword_delete">delete</button>
        </div>
        `
    })
})


// $('.keyword').append(() => {
//     return `
//     <div class="keyword_item">
//         <p class="keyword_name">${keyword_search_name}</p>
//         <button class="keyword_delete">delete</button>
//     </div>
//     `
// })

// $('.keyword_delete').click(function(event){
//     console.log(event);
// });


// event.js
// variable
var keyword = [];

// EventListener
$('#keyword_search_field').keyup((e) => {
    const keyword_search_name = $('#keyword_search_field').val();
    if (e.which == 13) {
        // e.preventDefault();
        all_nodes.includes(keyword_search_name) ? keyword_search_verify_pass() : keyword_search_verify_fail();
    };

    function keyword_search_verify_pass() {
        if (keyword.includes(keyword_search_name)) {
            alert(`Error, same keyword can not search more than twice`);
            return;
        }
        keyword.push(keyword_search_name);
        $('#keyword_search_field').val('');

        option.series[0].nodes = data.nodes.filter(node => {
            return (keyword.includes(node.name) == true);
        });
        event_setOption_function();

        // console.log(keyword);
        keyword_item_append();
    };

    function keyword_search_verify_fail() {
        alert(`Can't not find keyWord : ${keyword_search_name}`);
    };

    function keyword_item_append() {
        let keyword_item_append_str = '';
        keyword.forEach(keyword_name => {
            keyword_item_append_str += `
            <div class="keyword_item">
                <p class="keyword_name" >${keyword_name}</p>
                <button class="keyword_delete" data-name='${keyword_name}'>delete</button>
            </div>
            `
        });
        // console.log(keyword_item_append_str);
        $('.keyword').html(keyword_item_append_str);
    };

    // $(() => {
    $('.keyword_delete').click(e => {
        console.log(e.currentTarget.dataset.name);
        console.log(`array_indexof : ${keyword.indexOf(e.currentTarget.dataset.name)}`);
        console.log(keyword);
        keyword.splice(keyword.indexOf(e.currentTarget.dataset.name), 1);



        keyword_item_append();
        console.log(keyword);
        console.log('==============');
        // keyword_item_append();

        // option.series[0].nodes = data.nodes.filter(node => {
        //     return (keyword.includes(node.name) == true);
        // });
        // event_setOption_function();
    });
    // });

});

// 2 event.js
const submit_button = $('.keyword_search > button');
var keyword = [];

submit_button.click(() => {
    const keyword_search_name = $('#keyword_search_field').val();
    console.log(keyword_search_name);
    all_nodes.includes(keyword_search_name) ? keyword_search_verify_pass() : keyword_search_verify_fail();

    function keyword_search_verify_pass() {
        if (keyword.includes(keyword_search_name)) {
            alert(`Error, same keyword can not search more than twice`);
            return;
        }
        keyword.push(keyword_search_name);
        $('#keyword_search_field').val('');
        console.log(keyword);

        option.series[0].nodes = data.nodes.filter(node => {
            return (keyword.includes(node.name) == true);
        });
        event_setOption_function();

        keyword_item_append(keyword_search_name);



        
    };

    function keyword_search_verify_fail() {
        alert(`Can't not find keyWord : ${keyword_search_name}`);
    };

    function keyword_item_append(keyword_search_name) {
        // let keyword_item_append_str = '';
        // keyword.forEach(keyword_name => {
        //     keyword_item_append_str += `
        // <div class="keyword_item">
        //     <p class="keyword_name" >${keyword_name}</p>
        //     <button class="keyword_delete" data-name='${keyword_name}'>delete</button>
        // </div>
        // `
        // });
        // console.log(keyword_item_append_str);
        // $('.keyword').html(keyword_item_append_str);

 
    }

    function keyword_item_delete(keyword_search_name){
        console.log(keyword_search_name);
        $(`div[data-item=${keyword_search_name}]`).remove();
    }

    $('.keyword_delete').click(e => {
        console.log(e.currentTarget.dataset.name);
        console.log(`array_indexof : ${keyword.indexOf(e.currentTarget.dataset.name)}`);
        console.log(keyword);
        keyword.splice(keyword.indexOf(e.currentTarget.dataset.name), 1);
        console.log(keyword);
        keyword_item_delete(e.currentTarget.dataset.name);
    });
});

// 2/27 event.js
let link_source_target = {
    source: [],
    target: []
};

// ! links
option.series[0].links = data.links.filter(link => {
    if ((keyword.includes(link.source)) || keyword.includes(link.target)) {
        link_source_target.source.push(link.source);
        link_source_target.target.push(link.target);
        return link;
    };
});
console.log(option.series[0].links);

let node_unionSet = Array.from(new Set([...link_source_target.source, ...link_source_target.target]));

console.log(node_unionSet);