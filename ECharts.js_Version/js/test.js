function search_double() {//找到第二個人並顯示在畫面上
    union_collect = [];
    let category_collect = [];
    let union_collect_category_show_g = [];
    let main_arr = [];
    let last_recurve_arr = [];
    let last_recurve;//不用用到?
    last_recurve_arr = firstkey_search;//要search 的根 arr
    find_main_arr(last_recurve_arr, main_arr, union_collect);


    function find_main_arr(last_recurve_arr, main_arr, union_collect) {
        for (var key = 0, len = last_recurve_arr.length; key < len; key++) {//尋找A連A的點-1-
            main_arr.push(last_recurve_arr[key]);//錢臻 確定有連結到的點
            // last_recurve = last_recurve_arr[key];//錢臻 str
            option.series[0].categories = data.category.filter(category => {
                if (last_recurve_arr[key].includes(category.target) || last_recurve_arr[key].includes(category.source)) {
                    union_collect.push(category.target, category.source);
                    return category;
                }
            });
        }
        union_collect = Array.from(new Set(union_collect));//刪除重複["錢臻","錢俊", "方受疇", "錢楷", "吳璥"]
        console.log("union_collect" + union_collect);//arr 錢臻,錢俊,方受疇,錢楷,吳璥
        //第一層級找到第二個要搜尋的東西
        //判斷union_collect有沒有B
        if (union_collect.includes(keyword_search_name_s[1])) {//有
            option.series[0].categories = data.category.filter(category => {
                if (main_arr.includes(category.target)) {
                    if (keyword_search_name_s[1].includes(category.source)) {
                        return category;//顯示結果
                    }
                } else if (main_arr.includes(category.source)) {
                    if (keyword_search_name_s[1].includes(category.target)) {
                        return category;
                    }
                }
            })
        } else {//沒有
            var temp_collect;//收集存在["錢俊", "方受疇", "錢楷", "吳璥"]個別的點
            var temp_minus;//= $(union_collect).not(last_recurve).toArray();//第一輪排除錢臻
            temp_minus = $(union_collect).not(main_arr).toArray();
            console.log(temp_minus);// ["錢俊", "方受疇", "錢楷", "吳璥"]
            union_collect = [];
            var temp_name = [];//i = 0 錢俊
            for (let i = 0; i < temp_minus.length; i++) {
                temp_name.length = 0;
                temp_name.push(temp_minus[i]);//要是arr形式
                temp_collect = [];
                console.log("MEEE");
                option.series[0].categories = data.category.filter(category => {
                    // console.log(temp_minus[i]);
                    if (temp_name.includes(category.target) || temp_name.includes(category.source)) {
                        temp_collect.push(category.target, category.source);//輸入和錢俊相連的點
                        // console.log(temp_collect);
                        console.log("1");
                        return category;
                    }
                });
                temp_collect = Array.from(new Set(temp_collect));//連結的點放到temp_collect
                console.log("temp_collect" + temp_collect);

                if (temp_collect.length === 2) {
                    console.log("fail-temp_minus" + temp_minus);

                    temp_minus.splice(i, 1);
                    i = i - 1;
                    // console.log("fail" + temp_collect);
                    // console.log("fail-temp_minus" + temp_minus);
                    // console.log("fail-temp_minus" + temp_name);

                } else {//有其他link
                    temp_collect = $(temp_collect).not(last_recurve).toArray();
                    temp_collect = $(temp_collect).not(temp_name).toArray();
                    // console.log("success-temp_minus" + temp_minus);
                    // console.log("success" + temp_name);
                    //temp name :錢臻
                    find_main_arr(temp_name, main_arr, union_collect)

                }
            }
        }

        console.log("*/*/*");
        option.series[0].links = option.series[0].categories.filter(category => {
            collect_more.push(category.source, category.target);
            union_collect_category_show_g.push(category.source, category.target);
            // console.log(collect_more);
            // console.log(union_collect_category_show_g);
            return category;
        })
        collect_more = Array.from(new Set(collect_more));
        union_collect_category_show_g = Array.from(new Set(union_collect_category_show_g));
        collect_more.push(keyword_search_name_s[1]);
        option.series[0].nodes = data.nodes.filter(node => {
            keyword_search_name_s.includes(node.name) ? node.itemStyle.normal.color = 'red' : node.itemStyle.normal.color = user_colors[node.gp];//原color[node.gp]
            return collect_more.includes(node.name) && union_collect_category_show_g.includes(node.name);
        })


    }
}