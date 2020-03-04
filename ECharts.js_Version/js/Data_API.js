function GetJSON(url) {
    $.ajax({
        url: url,
        method: "GET",
        async: true,
        dataType: "JSON",

        success: function (response) {
            console.log(response);
            cpdata = Object.assign({}, response);
            jdata = response;
            firstStart();
        },

        error: function (xhr, status, error) {
            console.log("xhr:" + xhr + '\n' + "status:" + status + '\n' + "error:" + error);
        }
    });
}

function API_generator(text_id, authority1, authority2, limit) {
    return `http://dh.ascdc.sinica.edu.tw/member/api/social/headTaskTextReport.jsp?text_id=${text_id}&authority1=${authority1}&authority2=${authority2}&limit=${limit}`;

}