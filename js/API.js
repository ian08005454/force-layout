/**
 * @module API
 * @description 運用ajax取得資料的方法
 * @author Wei-Jie Li
 * @createDate 2021-03-21
 */
import $ from 'jquery/dist/jquery';
/**
 * 運用ajax來取得url傳回來的資料並存入jdata
 * @param {string} url  資料的網址
 */
export function GetJSON(url) {
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        dataType: "JSON",
    })

        .done( function (response) {
            console.log(jdata);
            var cpdata = Object.assign(jdata, response); //合併之前資料
            console.log(cpdata);
            jdata = response;
        })
        .fail( function (xhr, status, error) {
            console.log( '出現錯誤，無法完成!' )
            console.log( 'Error: ' + error )
            console.log( 'Status: ' + status )
            console.dir("xhr:" +  xhr )
            // console.log("xhr:" + xhr + '\n' + "status:" + status + '\n' + "error:" + error);
        })
}
