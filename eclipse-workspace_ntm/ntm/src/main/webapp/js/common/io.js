/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */


//
function ajaxTranCall(tran, jsonBody, succeesCallback, errorCallback){
	
	jsonBody["cookieUserId"] = getCookie("user_id");
	
	$.ajax({
		url : location.protocol + "//" + location.host + "/ntm/" + tran,
		method: "POST", 
		dataType: "json", 
		contentType : 'application/json',  
		data : JSON.stringify(jsonBody),
		statusCode: {
			999:function(data) {
				alert("세션이 만료되었습니다.\n로그인 화면으로 이동합니다.");
				location.href = "/ntm";
			}
		},
		success : function(data){
			
			if(data["resultCode"] == "0000"){
				succeesCallback(tran, data);
			}
			else{
				errorCallback(tran, data);
			}
			
		},
		error : function(xhr, status, error){
		}
	});
	
}

/*
 * 파일도 같이 보낼때..
 */
var ajaxTranCallWithFile = function(tran, data,  succeesCallback, errorCallback){
	
	
	
	$.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: tran,
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
        	
        	if(data["resultCode"] == "0000"){
        		succeesCallback(tran, data);
			}
			else{
				
			}
        	
        },
        error: function (e) {
        	alert("시스템 오류");
        }

    });
}

/*
 * 액셀 업로드만 
 */
var ajaxFormExcel = function (tran , id, func){
	
	var data = new FormData();
	data.append(id, $('#'+ id).prop('files')[0]);				
	console.log(data);

	$.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: tran,
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
        	
        	if(data["resultCode"] == "0000"){
        		func(tran, data);
			}
			else{
				
			}
        	
        },
        error: function (e) {
        	alert("시스템 오류");
        }

    });
}





