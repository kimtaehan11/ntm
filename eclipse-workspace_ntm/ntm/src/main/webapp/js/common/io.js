/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */


//
function ajaxTranCall(tran, jsonBody, succeesCallback, errorCallback){
	
	$.ajax({
		url : location.protocol + "//" + location.host + "/ntm/" + tran,
		method: "POST", 
		dataType: "json", 
		contentType : 'application/json',  
		data : JSON.stringify(jsonBody),
		success : function(data){
			
			if(data["resultCode"] == "0000"){
				succeesCallback(tran, data);
			}
			else{
				errorCallback(tran, data);
			}
			
		},
		error : function(xhr, status, error){
		
			alert("시스템 오류");
		}
	});
	
}

var ajaxForm = function (tran , id, func){
	var data = new FormData();
	data.append("file1", $('#file1').prop('files')[0]);				
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



	
	
//	$('#'+id).ajaxForm({
////        contentType : false,
////        processData: false,
//		type: "POST",
//        enctype: "multipart/form-data",
////        dataType : "POST",
//        dataType : 'json',
//        beforeSubmit: function(data, form, option) {
//            console.log('beforeSubmit');
//            console.log(data);
//            console.log(form);
//            console.log(option);
//        },
//        success: function(returnData) {
//            func(returnData);
//        },
//        error: function(x,e){
//            console.log("[aljjabaegi]ajax status : "+x.status);
//            console.log(e);
//        },
//    }).submit();
}


