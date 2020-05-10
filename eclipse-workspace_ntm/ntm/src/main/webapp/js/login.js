

$(document).ready(function() { 
	$("#inputLoginId").val(getCookie('user_id'));
	
});

/*
 * btLogin_onClick
 */
$("#btLogin").click(function(){ 
	var inputLoginId  = $("#inputLoginId").val();
	var inputPassword = $("#inputPassword").val();
	
	var dataJson = {
		user_id : inputLoginId,
		password : inputPassword
	};
	
	$.ajax({
		url : "http://localhost:8080/ntm/login.do",
		method: "POST", 
		dataType: "json", 
		contentType : 'application/json',  
		data : JSON.stringify(dataJson),
		success : function(data){
			
			if(data["resultCode"] == "0000"){
				
				//USER 정보 설정 
				setCookie('user_id',  data.user_id, '1');
				setCookie('name',  data.name, '1');
				setCookie('team_id',  data.name, 'team_id');
				
				location.href = "/ntm?path=main";
			}
			else{
				alert(data["message"] );
			}
			
		},
		error : function(xhr, status, error){
			
		}
	});
});
