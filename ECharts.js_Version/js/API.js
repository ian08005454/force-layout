import $ from 'jquery/dist/jquery';
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
