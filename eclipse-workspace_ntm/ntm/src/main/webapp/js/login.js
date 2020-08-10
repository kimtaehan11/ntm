

//$(document).ready(function() { 
var initDoucument = function(){
	
	/*
	 * btLogin_onClick
	 */
	$("#btLogin").click(function(){ 
		var inputLoginId  = $("#inputLoginId").val();
		var inputPassword = $("#inputLoginId").val();
		
		var dataJson = {
			user_id : inputLoginId,
			password : inputPassword
		};
		
		$.ajax({
			url : "http://localhost:8080/ntm/user/login.do",
			method: "POST", 
			dataType: "json", 
			contentType : 'application/json',  
			data : JSON.stringify(dataJson),
			success : function(data){
				
				if(data["resultCode"] == "0000"){
					
					//USER 정보 설정 
					setCookie('user_id',  data.user_id, '1');
					setCookie('name',  data.name, '1');
					setCookie('team_id',  data.team_id, '1');
					
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
}


