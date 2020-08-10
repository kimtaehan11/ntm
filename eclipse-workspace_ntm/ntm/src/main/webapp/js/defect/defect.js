/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */
var isFirstLoad;

var devDefectTable;
var teamUserModalTable;
var testAutoModalTable;

var modalTableDevUpdate; //teamUserModalTable

var modalTabledefectHistroty;

var b001List;

$(document).ready(function() { 
	
	//팀정보 조회합니다.
	ajaxTranCall("user/selectTeamList.do", {role_code:"DEV"}, callbackS, callBackE);
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
	
	$("#selectTeam2").on('change', function(){
		ajaxTranCall("user/selectUserList.do", {team_id:$(this).val(), role_code:"DEV"}, callbackPupupS, callBackE);
	});
	
	$("#defect_code").on('change', function(){
		
		//미조치건 안내
		if($(this).val() == "B001_04" ){
			alert("미조치건은 테스터와 협의 후에 진행해주세요 \n테스터가 결함종료를 선택해야지 결함에서 제외됩니다.");
		}
		//개발지연건 안내
		else if($(this).val() == "B001_05" ){
			alert("개발지연건은 솔루션 또는 타업무와 연관된 지연건만 가능합니다. \n관리자가 반려할 수 있습니다.");
		}
		
	});
	
	
	//서브시스템 Table click event
	$('#devDefectTable').on('click', function(){
		setTimeout(function() {
			$('#devDefectTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = devDefectTable.row($(this)).data(); 
					
					//결함상태 select box 초기화 및 선택값에 따른 처리 내용 정리
					$("#defect_code").html("");
					for(var i=0; i<b001List.length; i++){
						
						//결함 상태건은 항상 보여줍니다. 
						if(dataJson.defect_code == b001List[i].code_id){
							appendSelectBox2( $("#defect_code"), b001List[i].code_id, b001List[i].code_name);
						}
						//결함이 결함등록, 결함종료, 조치완료, 미조치건은  개발자가 건들수 없습니다. 
						else if(dataJson.defect_code == "B001_01" 
							|| dataJson.defect_code == "B001_03"
							|| dataJson.defect_code == "B001_04"
							|| dataJson.defect_code == "B001_06"){
						}
						else if(b001List[i].code_id == "B001_03" 
							|| b001List[i].code_id == "B001_04"  
							|| b001List[i].code_id == "B001_05"){
							appendSelectBox2( $("#defect_code"), b001List[i].code_id, b001List[i].code_name);
						}
					}
					//결함이  결함종료, 조치완료, 미조치건은  개발자변경불가 
					if(  dataJson.defect_code == "B001_03"
						|| dataJson.defect_code == "B001_04"
						|| dataJson.defect_code == "B001_06"){
						$("#btnDevUpdate").hide();
					}
					else{
						$("#btnDevUpdate").show();
					}
					
					
					//기본데이터 설정
					modal.convertJsonObjToModal("devDefectModalTable",dataJson )
					
					//저장된 이미지 조회 
					ajaxTranCall("defect/selectDefectDetail.do", dataJson, callbackS, callBackE);
					
					//결함이력 조회 
					ajaxTranCall("defect/selectDefectHistory.do", {"id": dataJson["id"]}, callbackPupupS, callBackE);
					
					//테스트자동화 List 조회
					ajaxTranCall("auto/selectAutoList.do", {"id": dataJson["id"]}, callbackPupupS, callBackE);
					
					//개발자 목록 조회
					ajaxTranCall("user/selectUserList.do", { role_code:"DEV"}, callbackPupupS, callBackE);
					
					
					
				}
			});
		}, 100);
	});
	
	
	
	$("#btnSave").on('click', function(){
		var dataJson = modal.convertModalToJsonObj("devDefectModalTable" );
		dataJson["defect_code_nm"] = $("#defect_code").text();
		ajaxTranCall("defect/updateDefectByDev.do", dataJson, callbackS, callBackE);
	});
	
	//modal 1 개발자 변경 관련 이벤트 모음
	$('#btnDevUpdate').on('click', function(){
		$('#modalUser').modal();
	});
	
	//modal user table click 
	$('#modalTableDevUpdate').on('click', function(){
		setTimeout(function() {
			$('#modalTableDevUpdate tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = modalTableDevUpdate.row($(this)).data(); 
					if(confirm("선택한 개발자를 조치자로 변경하시겠습니까?")){
						$("#defect_user").val(dataJson["user_id"]);
						$("#defect_user_name").val(dataJson["name"] );
						$('#modalUser').modal("hide"); //닫기 
					}
				}
			});
		}, 100);
	});
	
	
	//modal 2 결함 히스토리 확인 
	$('#btndefectHistory').on('click', function(){
		$('#modalDefactHistory').modal();
		//modalTabledefectHistroty
	});
	
	//modal 3 자동테스트
	$('#btnAutoTest').on('click', function(){
		$('#modalAutoTest').modal();
	});
	
	
	//modal user table click 
	$('#autoTestModalTable').on('click', function(){
		setTimeout(function() {
			$('#autoTestModalTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = autoTestModalTable.row($(this)).data(); 
					ajaxTranCall("auto/selectAutoDetail.do", {"id": dataJson["id"]}, callbackPupupS, callBackE);
				}
			});
		}, 100);
	});
	
});


var selectUserList = function(team_id){
	var jsonObj = {};
	if(team_id == null || team_id == ""){
		
	}
	else{
		$("#selectTeam").val(team_id);
		$("#selectTeam2").val(team_id);
		
		if($("#selectTeam").val() == null){
			$("#selectTeam").val("");
			$("#selectTeam2").val("");
			jsonObj["team_id"] = "";
			jsonObj["role_code"] = "DEV";
		}
		else{
			jsonObj["team_id"] = team_id;
			jsonObj["role_code"] = "DEV";
			
		}
	}
	ajaxTranCall("user/selectUserList.do", jsonObj, callbackS, callBackE);
}


/*
 * modal에서 동일한 전문 호출시 응답처리 따로 하기 위해 제작
 */
var callbackPupupS = function(tran, data){
	switch(tran){
	
	case "auto/selectAutoDetail.do":
		var list = data["list"];
		
		skInterface.autoTestShow(list[0].title, list[0].html);
		
		break;
		
	case "defect/selectDefectHistory.do":
		
		var list = data["list"];
		$("#spanDefectHistoryCnt").text(list.length + "건");
		
		modalTabledefectHistroty = $('#modalTabledefectHistroty').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'test_type' },
	            { "mDataProp" : 'defect_code' } ,
	            { "mDataProp" : 'name' } ,
	            { "mDataProp" : 'reg_date' } 
	        ],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": "검색 : "
		    },
		    pageLength:5, //기본 데이터건수
//		    pageLength:15, //기본 데이터건수
//	        "scrollCollapse": false,
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		break;
		
		
//		
		
		break;
	//테스트 자동화 목록 조회시 (defect_id로 조회 가능)
	case "auto/selectAutoList.do":
		var list = data["list"];
		$("#spanAutoTestCnt").text(list.length + "건");
		modalTableautoTest = $('#modalTableautoTest').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'reg_user' },
	            { "mDataProp" : 'reg_date' } 
	        ],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": "검색 : "
		    },
		    pageLength:5, //기본 데이터건수
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			"scrollCollapse": false,
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		break;
		
	case "user/selectUserList.do":
		var list = data["list"];
		
		modalTableDevUpdate = $('#modalTableDevUpdate').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'team_name' },
	            { "mDataProp" : 'name' } 
	        ],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": "검색 : "
		    },
		    pageLength:5, //기본 데이터건수
//		    pageLength:15, //기본 데이터건수
//	        "scrollCollapse": false,
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
	}
}
var callbackS = function(tran, data){
	
	
	switch(tran){
	
	case "defect/updateDefectByDev.do":
		if(data["resultCode"] == "0000" ){
			alert(data["message"]);
			$('div.modal').modal("hide"); //닫기 
			
			//결함이력 재조회 
			ajaxTranCall("defect/selectDefectHistory.do", {"id": $("#id").val()}, callbackPupupS, callBackE);
			
			selectDefectByDevIdList();
		}
		break;
	case "code/selectCodeList.do":
		
		var code_group = data["code_group"];
		var list = data["list"];
		
		if(code_group == "B001"){
			
			b001List = list;
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#defect_code"), list[i].code_id, list[i].code_name);
			}
		}	
		
		else if(code_group == "A001"){
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#test_type"), list[i].code_id, list[i].code_name);
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
	            { "mDataProp" : 'scenario_name' } ,
	            { "mDataProp" : 'case_name' } ,
	            { "mDataProp" : 'title' } ,
	            { "mDataProp" : 'test_type_name' } ,
	            { "mDataProp" : 'defect_name' } ,
	            { "mDataProp" : 'reg_name' },
	            { "mDataProp" : 'defect_user_name' },
	            { "mDataProp" : 'reg_date' } ,
	            { "mDataProp" : 'resolve_date' } 
	            //
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
			"scrollY":        550,
			"scrollCollapse": false,
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		break;
	
		//팀 정보 전체 조회
		case "user/selectTeamList.do":
			var list = data["list"];
			htmlSelectBox2($("#selectTeam"), 	"", 	"개발팀 전체");
			htmlSelectBox2($("#selectTeam2"),	"", 	"개발팀 전체");
			
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
				if($("#selectUser").val() == null){
					$("#selectUser").val("");
				}
			}
			else{
			}
			
			selectDefectByDevIdList();
			
			break;
		case "defect/selectDefectDetail.do":
			
			var list = data["list"];
			$("#existingImgs").html("");
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
		$("#test_type").val("0");
		$("#description").val("");
		$("#description").val("");
		$("#files").val("");

		$("#imgs").html("");
		$("#existingImgsTr").hide();
		

        // readonly 삭제
        $("#test_type").removeAttr("readonly");
		
	}
	else{
		
		$('#modalTitle').text("결함 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
		$("#test_type").val("0");
		
		 // 텍스트 박스 readonly 처리
        $("#test_type").attr("readonly",true);
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
