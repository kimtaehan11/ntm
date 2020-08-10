var teamTable , userTable;

var userTableModal ;


var initDoucument = function(){
	
	ajaxTranCall("user/selectTeamList.do", {}, callbackS, callBackE);
	ajaxTranCall("user/searchRoleList.do", {}, callbackS, callBackE);
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
		
		if(modal.modalCheckInputData("teamTableModal")){
			
			var dataJson = modal.convertModalToJsonObj("teamTableModal" );
			ajaxTranCall("user/insertNewTeam.do", dataJson, callbackS, callBackE);
		}
		
	});
	
	$("#btnUpdate").click(function(e){
		
		if(modal.modalCheckInputData("teamTableModal")){
			var id = "";
			$('#teamTable tr').each(function(){
				 if ( $(this).hasClass('selected') ){
					 id = teamTable.row($(this)).data().id;
				 }
			});
			var dataJson = modal.convertModalToJsonObj("teamTableModal" );
			dataJson["id"] = id;
			ajaxTranCall("user/updateTeamInfo.do", dataJson, callbackS, callBackE);
		}
	});
	
	//전체역할 select box 값 체인지
	$("#role_code_main").on('change', function(){
		ajaxTranCall("user/selectTeamList.do", {role_code : $(this).val()}, callbackS, callBackE);
	});
	
	
	//1개의 팀 선택시 팀장/팀원 정보 조회 	
	//서브시스템 Table click event
	$('#teamTable').on('click', function(){
		setTimeout(function() {
			$('#teamTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = teamTable.row($(this)).data();
					
					ajaxTranCall("user/selectTeamUserList.do", dataJson, callbackS, callBackE);
					$("#team_id").val(dataJson.id);
					
					$("#team_id_select").val(dataJson.id);
					$("#team_id_select").trigger("change");
				}
			});
		}, 100);
		
//		selectDefectList();
	});
	
	
	$('#userTableModal').on('click', function(){
		setTimeout(function() {
			$('#userTableModal tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = userTableModal.row($(this)).data();
					var isConfirm = confirm(dataJson.name + "을(를) 팀장으로 지정하시겠습니까?");
					if(isConfirm){
						var jsonObj = {
								"team_id" : $("#team_id").val(),
								"user_id" : dataJson.user_id
						};
						ajaxTranCall("user/updateTeamReader.do", jsonObj, callbackS, callBackE);
					}
				}
			});
		}, 100);
	});
	
	
	
	$("#team_id_select").on('change', function(){
		var json = {
			team_id : $("#team_id_select").val()		
		};
		ajaxTranCall("user/selectUserList.do", json, callbackS, callBackE);
	});
	
}




var callbackS = function(tran, data){
	
	switch(tran){
	
	//팀장변경 서비스
	case "user/updateTeamReader.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('#modalTeamReader').modal("hide"); //닫기 
			ajaxTranCall("user/selectTeamList.do", {}, callbackS, callBackE);
			
			var jsonObj = {
					"id" : $("#team_id").val() 
			};
			ajaxTranCall("user/selectTeamUserList.do", jsonObj, callbackS, callBackE);
			
		}
		
		
		break;
	case "user/selectUserList.do":
		var list = data["list"];
		userTableModal = $('#userTableModal').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	        	{ "mDataProp" : "team_name" } ,
	        	{ "mDataProp" : "user_id" },
	        	{ "mDataProp" : "name" } 
	        ], 
			"language": {
		        "emptyTable": "데이터가 없어요." , "search": "검색 : "
		    },
		    pageLength:5, //기본 데이터건수
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		break; 
		
		
	case "user/selectTeamUserList.do":
		var list = data["list"];
		//userTable
		userTable = $('#userTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : "team_state" },
	        	{ "mDataProp" : "user_id" } ,
	            { "mDataProp" : "name" },
	            { "mDataProp" : "position" },
	            { "mDataProp" : "position" } 
	            
	        ],
			"language": {
		        "emptyTable": "데이터가 없어요." , "search": "검색 : "
		    },
		    pageLength:15, //기본 데이터건수
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			"scrollY":        550,
	        "scrollCollapse": false,
	        
//	        //컬럼속성
	        "columnDefs": [
	            {
	                "targets": [ 1 ],
	                "visible": false,
	                "searchable": true
	            },
	        ],
	        dom : 'Bfrtip',
	        buttons: [
	        	
	            {
	                text: '팀장 변경',
	               
	                action: function ( e, dt, node, config ) {
	                	modalOpen("3", e, dt, node, config )
	                }
	            } 
	        ]
			
	    });
		
		break;
		
		
	case "user/selectTeamList.do":
		var list = data["list"];
		
		htmlSelectBox2($("#team_id_select"), '', "팀 전체");
		for(var i=0; i<list.length; i++){
			appendSelectBox2($("#team_id_select"), list[i].id, list[i].name);
		}
		
		teamTable = $('#teamTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : "rnum" },
	        	{ "mDataProp" : "id" } ,
	            { "mDataProp" : "name" },
	            { "mDataProp" : "description" },
	            { "mDataProp" : "rolename" },
	            { "mDataProp" : "reader_name" },
	            { "mDataProp" : "user_cnt" },
	            { "mDataProp" : "reg_date_str" }  
	            
	        ],
			"language": {
		        "emptyTable": "데이터가 없어요." , "search": "검색 : "
		    },
		    pageLength:15, //기본 데이터건수
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			"scrollY":        550,
	        "scrollCollapse": false,
	        
//	        //컬럼속성
	        "columnDefs": [
	            {
	                "targets": [ 1 ],
	                "visible": false,
	                "searchable": true
	            },
	        ],
			
			
	        dom : 'Bfrtip',
	        buttons: [
	        	
	            {
	                text: '추가',
	               
	                action: function ( e, dt, node, config ) {
	                	modalOpen("1", e, dt, node, config )
	                }
	            },
	            {
	                text: '수정',
	                action: function ( e, dt, node, config ) {
	                	modalOpen("2", e, dt, node, config )
	                }
	            },
	            {
	                text: '삭제',
	                className: 'red',
	                action: function ( e, dt, node, config ) {
	                	var isSelected = false;
	                    $('#teamTable tr').each(function(){
	           			 if ( $(this).hasClass('selected') ){
	           				 isSelected = true;
	           				 if(confirm(teamTable.row($(this)).data().name + " 을(를) 삭제하시겠습니까? \n 등록된 사용자도 같이 삭제됩니다.")){
	           					var dataJson = {
           							id : teamTable.row($(this)).data().id
           						};
           						ajaxTranCall("user/deleteTeamInfo.do", dataJson, callbackS, callBackE);
	           				 }
	           			 }
	           			 
	           			
	                  });
                    if(!isSelected) alert("삭제할 대상을 선택해주세요.");
	                }
	            },
	            {
	        		extend:'excel',
	        		text:'다운로드',
	        		bom:true
	        	}
	        ]
			
	    });
		
	
		break;
		
	case "user/searchRoleList.do":

		var list = data["list"];
		for(var i=0; i<list.length; i++){
			
			appendSelectBox("role_code", list[i].code, list[i].name);
			appendSelectBox("role_code_main", list[i].code, list[i].name);
			
		}
		
		
		break;
		
	case "user/insertNewTeam.do":
	case "user/updateTeamInfo.do":
	case "user/deleteTeamInfo.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('#modalTeam').modal("hide"); //닫기 
			ajaxTranCall("user/selectTeamList.do", {}, callbackS, callBackE);
		}
		break;
	}
}


var modalOpen = function(type, e, dt, node, config ) {
	
//	 $("#inputTeamNm").val( ""  );
//	 $("#inputTeamDesc").val( "" );
//	 $("#selectbox").val( "" );

	 modal.modalClear("teamTableModal");
	if(type == "1"){
		$('#modalTitle').text("팀 등록");
		$('#btnSave').show();
		$('#btnUpdate').hide();
		
		$('#modalTeam').modal();
	}
	else if(type == "2"){
		$('#modalTitle').text("팀 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
		var isSelected = false;
		$('#teamTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 isSelected = true;
				 modal.convertJsonObjToModal("teamTableModal", teamTable.row($(this)).data() )
			 }
       });
		
		if(!isSelected){
			alert("수정할 대상을 선택해주세요.");
			return;
		}
		
		$('#modalTeam').modal();
	}
	else{
		
		if($("#team_id").val() == ""){
			return;
		}
		$('#modalTeamReader').modal();
	}
	
	
}

function callBackE(tran,data){
//	alert("callBackE");
}