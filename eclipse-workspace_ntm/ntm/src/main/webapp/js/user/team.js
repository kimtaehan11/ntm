var t;


$(document).ready(function() { 
	
	ajaxTranCall("user/searchTeamList.do", {}, callbackS, callBackE);
	ajaxTranCall("user/searchRoleList.do", {}, callbackS, callBackE);
	
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
		
		if(modal.modalCheckInputData("teamTableModal")){
			
			var dataJson = modal.convertModalToJsonObj("teamTableModal" );
			ajaxTranCall("user/saveNewTeam.do", dataJson, callbackS, callBackE);
		}
		
	});
	
	$("#btnUpdate").click(function(e){
		
		if(modal.modalCheckInputData("teamTableModal")){
			var id = "";
			$('#teamTable tr').each(function(){
				 if ( $(this).hasClass('selected') ){
					 id = t.row($(this)).data().id;
				 }
			});
			var dataJson = modal.convertModalToJsonObj("teamTableModal" );
			dataJson["id"] = id;
			ajaxTranCall("user/updateTeamInfo.do", dataJson, callbackS, callBackE);
		}
	});
	
	//전체역할 select box 값 체인지
	$("#role_id_main").on('change', function(){
		
		ajaxTranCall("user/searchTeamList.do", {role_id : $(this).val()}, callbackS, callBackE);
	});
});




var callbackS = function(tran, data){
	
	switch(tran){
	
	case "user/searchTeamList.do":
		var list = data["list"];
		t = $('#teamTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : "rnum" },
	        	{ "mDataProp" : "id" } ,
	            { "mDataProp" : "name" },
	            { "mDataProp" : "description" },
	            { "mDataProp" : "user_cnt" },
	            { "mDataProp" : "rolename" },
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
	           				 if(confirm(t.row($(this)).data().name + " 을(를) 삭제하시겠습니까? \n 등록된 사용자도 같이 삭제됩니다.")){
	           					var dataJson = {
           							id : t.row($(this)).data().id
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
			appendSelectBox("role_id", list[i].id, list[i].name);
			appendSelectBox("role_id_main", list[i].id, list[i].name);
			
		}
		
		
		break;
		
	case "user/saveNewTeam.do":
	case "user/updateTeamInfo.do":
	case "user/deleteTeamInfo.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('div.modal').modal("hide"); //닫기 
			ajaxTranCall("user/searchTeamList.do", {}, callbackS, callBackE);
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
	}
	else{
		$('#modalTitle').text("팀 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
		var isSelected = false;
		$('#teamTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 isSelected = true;
				 modal.convertJsonObjToModal("teamTableModal", t.row($(this)).data() )
			 }
       });
		
		if(!isSelected){
			alert("수정할 대상을 선택해주세요.");
			return;
		}
	}
	
	$('div.modal').modal();
}

function callBackE(tran,data){
//	alert("callBackE");
}