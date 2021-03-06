/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

var tableScenario, tableTestcase ;

var tcTableModalUser;

var isTester = "TEST";

var initDoucument = function(){
	
	//업무구분 A 조회
	ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"A"}, callbackS, callBackE);
	selectScenario();
	
	//업무구분 A selectbox 변경시
	$("select[name=selectA]").on('change', function(){
		$("select[name=selectA]").val($(this).val());
		htmlSelectBox2($("select[name=selectB]"), "", "업무구분 전체");
		htmlSelectBox2($("select[name=selectC]"), "", "대상업무 전체");
		
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode": $(this).val()}, callbackS, callBackE);
		selectScenario();
	});
	
	$("select[name=selectB]").on('change', function(){
		$("select[name=selectB]").val($(this).val());
		htmlSelectBox2($("select[name=selectC]"), "", "대상업무 전체");
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"C", "upcode": $(this).val()}, callbackS, callBackE);
		selectScenario();
	});
	
	$("select[name=selectC]").on('change', function(){
		$("select[name=selectC]").val($(this).val());
		selectScenario();
	});
	
	
	$("#selectTeam2").on('change', function(){
		$("select[name=selectC]").val($(this).val());
//		selectScenario();
		ajaxTranCall("user/selectUserList.do", {role_code:isTester, team_id:$(this).val()}, callbackS, callBackE);
	});
	
	
	$("select[name=modalSelectA]").on('change', function(){
		$("select[name=modalSelectA]").val($(this).val());
		htmlSelectBox2($("select[name=modalSelectB]"), "", "선택해주세요.");
		htmlSelectBox2($("select[name=modalSelectC]"), "", "선택해주세요.");
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode": $(this).val()}, callbackModalS, callBackE);
	});
	
	$("select[name=modalSelectB]").on('change', function(){
		$("select[name=modalSelectB]").val($(this).val());
		htmlSelectBox2($("select[name=modalSelectC]"), "", "선택해주세요.");
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"C", "upcode": $(this).val()}, callbackModalS, callBackE);
	});
	
	
	//modalType
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
		
		//필수값 체크 로직 추가
		if(!modal.modalCheckInputData("seTableModal")) 
			return;
		
		
		var dataJson = modal.convertModalToJsonObj("seTableModal" );
		if(modal.modalCheckInputData("seTableModal")){
			ajaxTranCall("scenario/insertScenario.do", dataJson, callbackS, callBackE);
		}
		
	});
	
	//modalType
	//신규 저장버튼 click event
	$("#btnUpdate").click(function(e){
		
		//필수값 체크 로직 추가
		if(!modal.modalCheckInputData("seTableModal")) 
			return;
		
		
		var dataJson = modal.convertModalToJsonObj("seTableModal");
		ajaxTranCall("scenario/updateScenario.do", dataJson, callbackS, callBackE);
	});
	
	
	//서브시스템 Table click event
	$('#tableScenario').on('click', function(){

		setTimeout(function() {
			$('#tableScenario tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableScenario.row($(this)).data(); 
					ajaxTranCall("scenario/selectTestCaseList.do", dataJson, callbackS, callBackE);
					
					
					$("#spanTCName").text(dataJson.scenario_name);
					
					$("#tc_scenario_name").val(dataJson.scenario_name);
					$("#tc_scenario_code").val(dataJson.scenario_code);
					
				}
			});
		}, 100);
	});
	
	
	//테스트 변경
	$("#btnTester").on('click', function(){
		isTester = "TEST";
		//테스터 그룹만 조회 selectTeam2
		ajaxTranCall("user/selectTeamList.do", {role_code:isTester}, callbackS, callBackE);
		ajaxTranCall("user/selectUserList.do", {role_code:isTester}, callbackS, callBackE);
	});
	$("#btnDeveloper").on('click', function(){
		isTester = "DEV";
		
		//개발자 그룹만 조회
		ajaxTranCall("user/selectTeamList.do", {role_code:isTester}, callbackS, callBackE);
		ajaxTranCall("user/selectUserList.do", {role_code:isTester}, callbackS, callBackE);
	});
	$('#tcTableModalUser').on('click', function(){

		setTimeout(function() {
			$('#tcTableModalUser tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tcTableModalUser.row($(this)).data(); 
					if(isTester == "TEST"){
						$("#tester").val(dataJson.user_id);
						$("#tester_nm").val(dataJson.name);
					}
					else{
						$("#developer").val(dataJson.user_id);
						$("#developer_nm").val(dataJson.name);
					}
				}
			});
		}, 100);
	});
	
	
	$('#btnSaveTc').on('click', function(){
		var dataJson = modal.convertModalToJsonObj("tcTableModal" );
		
		if(modal.modalCheckInputData("tcTableModal")){
			ajaxTranCall("scenario/insertTestcase.do", dataJson, callbackS, callBackE);
		}
		
	});
	$('#btnUpdateTc').on('click', function(){
		var dataJson = modal.convertModalToJsonObj("tcTableModal" );
		
		if(modal.modalCheckInputData("tcTableModal")){
			ajaxTranCall("scenario/updateTestcase.do", dataJson, callbackS, callBackE);
		}
		
	});
	
}


//ajaxTranCall("scenario/selectScenario.do", {}, callbackS, callBackE);

var selectScenario = function (){
	var jsonObj = {
			"depthA": $("#selectA").val(),
			"depthB": $("#selectB").val(),
			"depthC": $("#selectC").val()
	}
	ajaxTranCall("scenario/selectScenario.do", jsonObj, callbackS, callBackE);
}
var detpth1 = "";
var detpth2 = "";
var detpth3 = "";
var callbackModalS = function(tran, data){
	
	var list = data["list"];
	switch(tran){
	//시나리오 상단 업무구분 정보 조회
	case "scenario/searchDivListWithCombo.do":
		
		if(data["resultCode"] == "0000" ){
			var detpth = data["depth"];
			if(detpth == "B"){
				htmlSelectBox("modalSelectB", "", "선택해주세요.");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=modalSelectB]"), list[i].div_id, list[i].name);
				}
				
				if(detpth2 != ""){
					$('#modalSelectB').val(detpth2);
					detpth2 = "";
				}
			}
			else if(detpth == "C"){
				htmlSelectBox("modalSelectC", "", "선택해주세요.");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=modalSelectC]"), list[i].div_id, list[i].name);
				}
				
				if(detpth3 != ""){
					$('#modalSelectC').val(detpth3);
					detpth3 = "";
				}
			}
		}
		
		break;
	
	case "scenario/selectDivDepth.do":
		
		if(data["resultCode"] == "0000" ){
			
			 detpth1 = data["detpth1"];
			 detpth2 = data["detpth2"];
			 detpth3 = data["detpth3"];
			 
			$('#modalSelectA').val(detpth1);
			

			ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode": detpth1 }, callbackModalS, callBackE);
			ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"C", "upcode": detpth2 }, callbackModalS, callBackE);
			$("#layerModalScenario").modal();
		}
		
		break;
	}
}

var callbackS = function(tran, data){
	
	var list = data["list"];
	switch(tran){
		
	
	case "scenario/deleteScenario.do":
	case "scenario/insertScenario.do":
	case "scenario/updateScenario.do":
		
		if(data["resultCode"] == "0000" ){
			
			$('div.modal').modal("hide"); //닫기 
			
			alert(data["message"]);
			selectScenario();
			ajaxTranCall("scenario/selectTestCaseList.do", {}, callbackS, callBackE);
		}
		break;
		
	case "scenario/deleteTestcase.do":
	case "scenario/insertTestcase.do":
	case "scenario/updateTestcase.do":
		
		if(data["resultCode"] == "0000" ){
			
			$('div.modal').modal("hide"); //닫기 
			alert(data["message"]);
			
			$('#tableScenario tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableScenario.row($(this)).data(); 
					ajaxTranCall("scenario/selectTestCaseList.do", dataJson, callbackS, callBackE);
				}
			});
		}
		break;
		
		
	case "user/selectTeamList.do":
		
		if(isTester == "TEST")
			htmlSelectBox2($("#selectTeam2"), "", "테스터팀 전체");
		else
			htmlSelectBox2($("#selectTeam2"), "", "개발팀 전체");
		for(var i=0; i<list.length; i++){
			appendSelectBox2($("#selectTeam2"), list[i].id, list[i].name);
			
		}
		break;
		 
		case "user/selectUserList.do":
		
		tcTableModalUser = $('#tcTableModalUser').DataTable ({
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
//	ajaxTranCall("scenario/selectTestCaseList.do", dataJson, callbackS, callBackE);
//	tableScenario
	//testCase list 조회완료 
	case "scenario/selectTestCaseList.do":
		if(data["resultCode"] == "0000" ){
			
			//{"scenario_code":"CLUZ0922U","reg_date":1589049872316,"case_code":"A_CASE_0001",
			//"project_id":0,"reg_user":"admin","modify_user":"admin","case_name":"화면 일반 테스트",
			//"description":"화면 일반 테스트","modify_date":1589049872316}
			tableTestcase = $('#tableTestcase').DataTable ({
				destroy: true,
		        "aaData" : list,
		        "columns" : [
		            { "mDataProp" : 'scenario_name' },
		            { "mDataProp" : 'case_code' },
		            { "mDataProp" : 'case_name' },
//		            { "mDataProp" : 'reg_name' },
		            { "mDataProp" : 'test_name' },
		            { "mDataProp" : 'dev_name' },
		            { "mDataProp" : 'statestr' }
		        ],
		        "language": {
			        "emptyTable": "데이터가 없어요." , "search": "검색 : "
			    },

			    pageLength:15, //기본 데이터건수
				lengthChange: true, 	// 표시 건수기능 숨기기
				searching: true,  		// 검색 기능 숨기기
				ordering: false,  		// 정렬 기능 숨기기
				info: false,			// 정보 표시 숨기기
				paging: true, 			// 페이징 기능 숨기기
				select: {
		            style: 'single' //single, multi
				},
				"scrollY":        550,
		        "scrollCollapse": false,
		       
		        dom : 'Bfrtip',
		        buttons: [
		        	
		            {
		                text: '추가',
		                action: function ( e, dt, node, config ) {
		                	modalOpen("3", detpth, e, dt, node, config );
		                	
		                }
		            },
		            {
		                text: '수정',
		                action: function ( e, dt, node, config ) {
		                	modalOpen("4", detpth, e, dt, node, config );
		                }
		            },
		            {
		                text: '삭제',className: 'red',
		                action: function ( e, dt, node, config ) { 
		                	
		                	var isSelected = false;
		                	
		                	
		                	$('#tableTestcase tr').each(function(){
		        				if($(this).hasClass('selected') ){
		        					isSelected = true;
		        					if(confirm("선택된 테스트 케이스를 삭제하시겠습니까?")){
		        						var dataJson = tableTestcase.row($(this)).data(); 
			        					ajaxTranCall("scenario/deleteTestcase.do", dataJson, callbackS, callBackE);
		        					}
		        				}
		        			});
		                	
		                	if(!isSelected){
		                		alert(MSG.SELETED_DELETE_OBJ);
		                	}
		                }
		            } ,
		            {
		                text: '다운로드',
		                action: function ( e, dt, node, config ) {
//		                	modalOpen("4", detpth, e, dt, node, config );
		                }
		            },
		            {
		                text: '업로드',
		                action: function ( e, dt, node, config ) {
//		                	modalOpen("4", detpth, e, dt, node, config );
		                }
		            },
		        ]
				
		    });
			
		}
		break;
	//시나리오 상단 업무구분 정보 조회
	case "scenario/searchDivListWithCombo.do":
		if(data["resultCode"] == "0000" ){
			var detpth = data["depth"];
			if(detpth == "A"){
				htmlSelectBox("selectA", "", "서브시스템 전체");
				htmlSelectBox("modalSelectA", "", "선택해주세요.");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=selectA]"), list[i].div_id, list[i].name);
					appendSelectBox2($("select[name=modalSelectA]"), list[i].div_id, list[i].name);
				}
			}
			else if(detpth == "B"){
				htmlSelectBox("selectB", "", "업무구분 전체");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=selectB]"), list[i].div_id, list[i].name);
				}
			}
			else if(detpth == "C"){
				htmlSelectBox("selectC", "", "대상업무 전체");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=selectC]"), list[i].div_id, list[i].name);
				}
			}
		}
		
	break;
	case "scenario/selectScenario.do":
		
		tableScenario = $('#tableScenario').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'div_name_total' },
	            { "mDataProp" : 'scenario_name' },
	            { "mDataProp" : 'scenario_code' },
	            { "mDataProp" : 'is_batch' } 
	            
	        ],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": "검색 : "
		    },
		    
			lengthChange: true, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			pageLength:15, //기본 데이터건수
			"scrollY":        550	,
	        "scrollCollapse": false,
	       
	        dom : 'Bfrtip',
	        buttons: [
	        	
	            {
	                text: '추가',
	                action: function ( e, dt, node, config ) {
	                	modalOpen("1", detpth, e, dt, node, config )
	                }
	            },
	            {
	                text: '수정',
	                action: function ( e, dt, node, config ) {
	                	modalOpen("2", detpth, e, dt, node, config )
	                }
	            },
	            {
	                text: '삭제',
	                className: 'red',
	                action: function ( e, dt, node, config ) {
	                	
	                	var isSelected = false;
	                	if(!confirm("시나리오 삭제시에 하위 테스트 케이스도 삭제됩니다.")){
	                		return;
	                	}
	                	
	                	$('#tableScenario tr').each(function(){
	        				if($(this).hasClass('selected') ){
	        					var dataJson = tableScenario.row($(this)).data(); 
	        					isSelected = true;
	        					ajaxTranCall("scenario/deleteScenario.do", dataJson, callbackS, callBackE);
	        				}
	        			});
	                	
	                	if(!isSelected){
	                		alert(MSG.SELETED_DELETE_OBJ);
	                		return;
	                	}
	                }
	            } 
	        ]
			
	    });
		break;
		
	}
}

var callBackE = function(tran, data){
	
}


var modalOpen = function( crType , e, dt, node, config ) {
	
	//1. 시나리오 추가
	if(crType == "1"){
		$("#modalTitle").text("시나리오 추가");
		$('#btnSave').show();
		$('#btnUpdate').hide();
		$('#scenario_code').val("");
		$('#scenario_name').val("");
		$('#description').val("");
		$('#id').val("");
		
		
		$('#modalSelectA').val("");
		$('#modalSelectB').val("");
		$('#modalSelectC').val("");
		
		
		
		$("#layerModalScenario").modal();
	}
	//2. 시나리오 수정
	else if(crType == "2"){
		
		var isSelected = false;
		var div_id = ""
		$("#modalTitle").text("시나리오 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
		$('#tableScenario tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 isSelected = true;
				 var dataJson = tableScenario.row($(this)).data();
				 div_id = dataJson.div_id;
				 modal.convertJsonObjToModal("seTableModal", dataJson );
			 }
		});
		
		if(isSelected){
			
			if(div_id == ""){
				$('#modalSelectA').val("");
				$('#modalSelectB').val("");
				$('#modalSelectC').val("");
				
				$("#layerModalScenario").modal();
			}
			else{
				
				ajaxTranCall("scenario/selectDivDepth.do", {div_id:div_id}, callbackModalS, callBackE);
			}
			
		}
		else{
			alert("수정할 대상을 선택해주세요.");
		}
	}
	//3. 테스트케이스 추가
	else if(crType == "3"){
		
		$("#tester").val("");
		$("#tester_nm").val("");
		$("#developer").val("");
		$("#developer_nm").val("");
		$("#tc_description").val("");

		$("#testcase_code").val("");
		$("#testcase_name").val("");
		
		
		$("#modalTitleTc").text("테스트케이스 추가");
    	$("#layerModalTestCase").modal();
    	
    	$('#btnSaveTc').show();
		$('#btnUpdateTc').hide();
	}
	//4. 테스트케이스 수정
	else if(crType == "4"){
    	
		var isSelected = false;
    	$('#tableTestcase tr').each(function(){
			 if ( $(this).hasClass('selected') ){
//				 modal.convertJsonObjToModal("tcTableModal",  )
				 
				 var dataJson = tableTestcase.row($(this)).data();
				 //{"dev_name":"","case_code":"A_CASE_0002","reg_user":"admin","modify_user":"admin",
				 //"case_name":"화면 일반 테스트2","tester_id":"N00001","description":"화면 일반 테스트2 설명","dev_id":"",
				 //"scenario_code":"CLUZ0922U","reg_date":1589065643270,"project_id":0,
				 //"reg_name":"","state":"0","modify_date":1589065643270,"test_name":"홍길동"}
				 isSelected = true;
				 $("#tester").val(dataJson["tester_id"]);
				 $("#tester_nm").val(dataJson["test_name"]);
				 $("#developer").val(dataJson["dev_id"]);
				 $("#developer_nm").val(dataJson["dev_name"]);
				 $("#tc_description").val(dataJson["description"]);

				 $("#testcase_code").val(dataJson["case_code"]);
				 $("#testcase_name").val(dataJson["case_name"]);
				 
			 }
		});
    	if(isSelected){
    		$("#modalTitleTc").text("테스트케이스 수정");
        	$("#layerModalTestCase").modal();
        	
        	$('#btnSaveTc').hide();
    		$('#btnUpdateTc').show();
		}
    	else{
    		alert(MSG.SELETED_UPDATE_OBJ);
    	}
    	
				
	}
	
}




