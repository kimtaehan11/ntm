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






var ajaxForm = function (id, func){
    $('#'+id).ajaxForm({
        contentType : false,
        processData: false,
        enctype: "multipart/form-data",
        dataType : "POST",
        dataType : 'json',
        beforeSubmit: function(data, form, option) {
            console.log('beforeSubmit');
            console.log(data);
            console.log(form);
            console.log(option);
        },
        success: function(returnData) {
            func(returnData);
        },
        error: function(x,e){
            console.log("[aljjabaegi]ajax status : "+x.status);
            console.log(e);
        },
    });
}


