/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

var c_window = {};
var selectPushMsg = function (){
	
	if( getCookie("user_id") != "" && getCookie("user_id") != null){
		ajaxTranCall("common/selectPushListById.do", {}, c_window.callbackS, c_window.callBackE);
	}
	
};

c_window.callbackS = function(tran, data){
	
	switch(tran){
	
	//selectPushMsg 
	case "common/selectPushListById.do":
		
		var list = data["list"];
		
		for(var i=0; i<list.length; i++){
			skInterface.pushCall(list[i].title, list[i].msg);
		}
		break;
	}
};
c_window.callBackE = function(tran, data){
	
};

c_window.autoTestRecording = function(id){
	skInterface.autoTestRecording(id);
}