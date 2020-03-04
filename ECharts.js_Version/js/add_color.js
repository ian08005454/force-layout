// k1.k2 func讓使用者在網頁上選擇自己的喜好顏色
var user_colors = [];
user_colors[1] = "blue";//刪除搜尋之後會顯現的顏色
user_colors[2] = "green";
user_colors[3] = "pink";
user_colors[4] = "gray";
user_colors[5] = "purple";
// $('#k1_color_name').text("gp1");
// $('#k2_color_name').text("gp2");

//固定gp 數量 
// $('#show_color1').change(changed_color1);
// $('#show_color2').change(changed_color2);

// function changed_color1() {
//     // $('.k1_color').css('color', this.value);
//     console.log(this);

//     data.nodes.forEach(node => {
//         if (node.gp == 1) {
//             node.itemStyle.normal.color = this.value;
//         }
//     });
//     node_color = $('#k1_color').css("color");
//     user_colors[1] = this.value;
//     Chart.setOption(option);
// }

// function changed_color2() {
//     // $('.k2_color').css('color', this.value);
//     console.log(this);
//     data.nodes.forEach(node => {
//         if (node.gp == 2) {
//             node.itemStyle.normal.color = this.value;
//         }
//     });
//     user_colors[2] = this.value;
//     Chart.setOption(option);
// }

/////////////////////////////////
// 10/22
gp_name =['gp1','gp2','gp3','gp4','gp5'];//改地名 人名or...
// var max_gp = Math.max(...all_gp);
setColorSelector(2);
function setColorSelector(gpnum) {//動態生成顏色選擇器
    for (var i = 0; i < gpnum; i++) {
        var element = document.getElementById("choose_color");
        var label_element = document.createElement("label");
        var br = document.createElement("br");
        var text = document.createTextNode(`請選擇${gp_name[i]}顏色:`);
        var ccolor = document.createElement("input");
        ccolor.type = "color";
        ccolor.name = `gpcolor`;//${i + 1}
        ccolor.id = i + 1;
        ccolor.value = "";

        label_element.appendChild(text);
        element.appendChild(label_element);
        element.appendChild(ccolor);
        element.appendChild(br);
    }
}
//動態讓使用者選擇顏色
$("input[name='gpcolor']").change((e) => {
    // $("#choose_color label").css('color', e.target.value);//work
    data.nodes.forEach(node => {
        if (node.gp == e.target.id) {
            node.itemStyle.normal.color = e.target.value;
        }
    });
    user_colors[e.target.id] = e.target.value;
    Chart.setOption(option);
});
