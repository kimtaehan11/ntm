/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */
var isFirstLoad;

var devDefectTable;
var teamUserModalTable;
var testAutoModalTable;

$(document).ready(function() { 
	
	//팀정보 조회합니다.
	ajaxTranCall("user/searchTeamList.do", {}, callbackS, callBackE);
	ajaxTranCall("code/selectCodeList.do", {"code_group":"A001"}, callbackS, callBackE);
	ajaxTranCall("code/selectCodeList.do", {"code_group":"B001"}, callbackS, callBackE);
	
	
	$("#selectTeam").on('change', function(){
		isFirstLoad = false;
		selectUserList($(this).val());
		selectDefectByDevIdList();
	});
	
	$("#selectUser").on('change', function(){
		selectDefectByDevIdList();
	});
	
	$("#selectType").on('change', function(){
		
		var type = $(this).val();
		
		if(type=="1"){
			$("#teamUserModalTable").show();
			$("#autoTestModalTable").hide();
			ajaxTranCall("user/selectUserList.do", {team_id:$("#selectTeam2").val()}, callbackPupupS, callBackE);
		}
		else{
			$("#teamUserModalTable").hide();
			$("#autoTestModalTable").show();
		}
	});
	$("#selectTeam2").on('change', function(){
		ajaxTranCall("user/selectUserList.do", {team_id:$(this).val()}, callbackPupupS, callBackE);
	});
	
	//서브시스템 Table click event
	$('#devDefectTable').on('click', function(){
		setTimeout(function() {
			$('#devDefectTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = devDefectTable.row($(this)).data(); 
					
					modal.convertJsonObjToModal("devDefectModalTable",dataJson )
					ajaxTranCall("defect/selectDefectDetail.do", dataJson, callbackS, callBackE);
					$("#devDefectModal").modal();

					$("#teamUserModalTable").show();
					$("#autoTestModalTable").hide();
					ajaxTranCall("user/selectUserList.do", {team_id:$("#selectTeam2").val()}, callbackPupupS, callBackE);
				}
			});
		}, 100);
	});
	
	$("#btnSave").on('click', function(){
		
		let _id = "";
//		$('#devDefectTable tr').each(function(){
//			 if ( $(this).hasClass('selected') ){
//				 _id = devDefectTable.row($(this)).data().id;
//			 }
//		});
		
		var dataJson = modal.convertModalToJsonObj("devDefectModalTable" );
//		dataJson["id"] = _id;
		ajaxTranCall("defect/updateDefectByDev.do", dataJson, callbackS, callBackE);
	});
});


var selectUserList = function(team_id){
	var jsonObj = {};
	if(team_id == null || team_id == ""){
		
	}
	else{
		$("#selectTeam").val(team_id);
		$("#selectTeam2").val(team_id);
		jsonObj["team_id"] = team_id;
	}
	
	ajaxTranCall("user/selectUserList.do", jsonObj, callbackS, callBackE);
}


/*
 * modal에서 동일한 전문 호출시 응답처리 따로 하기 위해 제작
 */
var callbackPupupS = function(tran, data){
	switch(tran){
	case "user/selectUserList.do":
		var list = data["list"];
		
		teamUserModalTable = $('#teamUserModalTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'team_name' },
	            { "mDataProp" : 'name' } 
	        ],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": "검색 : "
		    },
		    
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: false, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		break;
	}
}
var callbackS = function(tran, data){
	
	
	switch(tran){
	
	case "defect/updateDefectByDev.do":
		if(data["resultCode"] == "0000" ){
			
			$('div.modal').modal("hide"); //닫기 
			alert(data["message"]);
		}
		break;
	case "code/selectCodeList.do":
		
		var code_group = data["code_group"];
		var list = data["list"];
		
//		if(code_group == "C001"){
//			for(var i=0; i<list.length; i++){
//				appendSelectBox2( $("#state"), list[i].code_id, list[i].code_name);
//			}
//		}
		  if(code_group == "B001"){
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#defect_code"), list[i].code_id, list[i].code_name);
			}
		}
		
		else if(code_group == "A001"){
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#test_type_id"), list[i].code_id, list[i].code_name);
			}
		}
		break;
		
		
	case "scenario/selectDefectByDevIdList.do":
		
		
		var list = data["list"];
		
		
		devDefectTable  = $('#devDefectTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'rnum' },
	            { "mDataProp" : 'case_name' } ,
	            { "mDataProp" : 'scenario_name' } ,
	            { "mDataProp" : 'title' } ,
	            { "mDataProp" : 'test_type_name' } ,
	            { "mDataProp" : 'defect_name' } ,
	            { "mDataProp" : 'reg_name' },
	            { "mDataProp" : 'dev_name' },
	            { "mDataProp" : 'reg_date' } ,
	            { "mDataProp" : 'resolve_date' } 
	            //
	        ],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": "검색 : "
		    },
//		    select  row_number() OVER () as rnum, 
//			cs.case_code,  --케이스명 
//			cs.case_name,  --케이스명 
//			cs.scenario_code,
//			sc.scenario_name,
//		
//			 df.test_type_id,
//			 ntm_schemas.GET_CODENAME('A001', df.test_type_id),
//			 df.defect_code,
//			 ntm_schemas.GET_CODENAME('B001', df.defect_code),
//			 df.title,
//			 df.description,
//			 df.reg_user,
//	 		 to_char(df.reg_date, 'YYYY-MM-DD') reg_date
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: false, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		break;
	
		//팀 정보 전체 조회
		case "user/searchTeamList.do":
			var list = data["list"];
			htmlSelectBox2($("#selectTeam"), "", "전체");
			htmlSelectBox2($("#selectTeam2"), "", "전체");
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#selectTeam"), list[i].id, list[i].name);
				appendSelectBox2( $("#selectTeam2"), list[i].id, list[i].name);
			}
			
			var team_id = getCookie('team_id');
			isFirstLoad = true;
			selectUserList(team_id);
			break;
			
		//user 정보 조회함
		case "user/selectUserList.do":
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
			
			selectDefectByDevIdList();
			
			break;
		case "defect/selectDefectDetail.do":
			
			var list = data["list"];
			
			
			if(list.length > 0){
				
				for(var i=0 ; i<list.length; i++){
					var htmlStr = '<img id="img'+i+'" style="height:100px;"/>';
					$("#existingImgs").append(htmlStr);
					
					$("#img"+i).attr("src", getFileUrl( list[i].id, list[i].seq) );
					$("#img"+i).on('click', function(e){
						$("#fileDownObj").attr('src', $(this).attr("src"));
					});
				}
			}
			break;	
		
	}
}

var callBackE = function(tran, data){
	
}

var selectDefectByDevIdList = function(){
	var jsonObj = {
		"dev_id" : $("#selectUser").val(),
		"team_id" : $("#selectTeam").val()
	}
	ajaxTranCall("scenario/selectDefectByDevIdList.do", jsonObj, callbackS, callBackE);
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
				 
				 $("#existingImgs").html("");
				 
				 //상세조회 이미지 + 자동테스트건
				 ajaxTranCall("defect/selectDefectDetail.do", datajson, callbackS, callBackE);
			 }
		});
		$("#imgs").html("");

		$("#existingImgsTr").show();
		
		
		
		
	}
	
	$('div.modal').modal();
}
