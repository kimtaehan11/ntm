/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */
var isFirstLoad;

var caseTable, defectTable;

$(document).ready(function() { 
	
	//팀정보 조회합니다.
	ajaxTranCall("user/searchTeamList.do", {}, callbackS, callBackE);
	
	$("#selectTeam").on('change', function(){
		isFirstLoad = false;
		searchUserList($(this).val());
	});
	
	$("#selectUser").on('change', function(){
	});
	
	
});


var searchUserList = function(team_id){
	var jsonObj = {};
	if(team_id == null || team_id == ""){
		
	}
	else{
		$("#selectTeam").val(team_id);
		jsonObj["team_id"] = team_id;
	}
	
	ajaxTranCall("user/searchUserList.do", jsonObj, callbackS, callBackE);
}


var callbackS = function(tran, data){
	
	
	switch(tran){
		
		
		//팀 정보 전체 조회
		case "user/searchTeamList.do":
			var list = data["list"];
			htmlSelectBox2($("#selectTeam"), "", "전체");
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#selectTeam"), list[i].id, list[i].name);
			}
			
			var team_id = getCookie('team_id');
			isFirstLoad = true;
			searchUserList(team_id);
			break;
			
		//user 정보 조회함
		case "user/searchUserList.do":
			var list = data["list"];
			htmlSelectBox2($("#selectUser"), "", "전체");
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#selectUser"), list[i].user_id, list[i].name);
			}
			
			
			
			var user_id = getCookie('user_id');
			if( isFirstLoad ){
				$("#selectUser").val(user_id);
			}
			else{
			}
			
			selectTestCaseList();
			
			break;
			
		
	}
}

var callBackE = function(tran, data){
	
}


var modalOpen = function(type, e, dt, node, config ) {
	
//	modal.modalClear("userTableModal");
	
	if(type == "1"){
		$('#modalTitle').text("신규결함 등록");
		$('#btnSave').show();
		$('#btnUpdate').hide();
		
		//초기화 작업 필요
		$("#title").val("");
		$("#test_type_id").val("0");
		$("#description").val("");
		$("#description").val("");
		$("#files").val("");

		$("#imgs").html("");
		$("#existingImgsTr").hide();
		

        // readonly 삭제
        $("#test_type_id").removeAttr("readonly");
		
	}
	else{
		
		$('#modalTitle').text("결함 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
		$("#test_type_id").val("0");
		
		 // 텍스트 박스 readonly 처리
        $("#test_type_id").attr("readonly",true);
		$('#defectTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 var datajson = defectTable.row($(this)).data();
				 modal.convertJsonObjToModal("defectTableModal", datajson );
				 
				//상세조회 이미지 + 자동테스트건
				ajaxTranCall("defect/selectDefectDetail.do", datajson, callbackS, callBackE);
			 }
		});
		$("#imgs").html("");

		$("#existingImgsTr").show();
		
		
		
		
	}
	
	$('div.modal').modal();
}
