/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

var tableScenario, tableTestcase ;

var tcTableModalUser;

var isTester = true;
$(document).ready(function() { 
	
	//업무구분 A 조회
	ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"A"}, callbackS, callBackE);
	selectScenario();
	
	//업무구분 A selectbox 변경시
	$("select[name=selectA]").on('change', function(){
		$("select[name=selectA]").val($(this).val());
		htmlSelectBox2($("select[name=selectB]"), "", "전체");
		htmlSelectBox2($("select[name=selectC]"), "", "전체");
		
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode": $(this).val()}, callbackS, callBackE);
		selectScenario();
	});
	
	$("select[name=selectB]").on('change', function(){
		$("select[name=selectB]").val($(this).val());
		htmlSelectBox2($("select[name=selectC]"), "", "전체");
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"C", "upcode": $(this).val()}, callbackS, callBackE);
		selectScenario();
	});
	
	$("select[name=selectC]").on('change', function(){
		$("select[name=selectC]").val($(this).val());
		selectScenario();
	});
	
	//modalType
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
		var dataJson = modal.convertModalToJsonObj("seTableModal" );
		ajaxTranCall("scenario/insertScenario.do", dataJson, callbackS, callBackE);
	});
	
	//modalType
	//신규 저장버튼 click event
	$("#btnUpdate").click(function(e){
		var dataJson = modal.convertModalToJsonObj("seTableModal" );
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
	
//	$("button[name=btnUp]").on('click', function(){
	$("#btnTester").on('click', function(){
		isTester = true;
		ajaxTranCall("user/searchUserList.do", {team_id:''}, callbackS, callBackE);
	});
	$("#btnDeveloper").on('click', function(){
		isTester = false;
		ajaxTranCall("user/searchUserList.do", {team_id:''}, callbackS, callBackE);
	});
	$('#tcTableModalUser').on('click', function(){

		setTimeout(function() {
			$('#tcTableModalUser tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tcTableModalUser.row($(this)).data(); 
					if(isTester){
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
		ajaxTranCall("scenario/insertTestcase.do", dataJson, callbackS, callBackE);
	});
	$('#btnUpdateTc').on('click', function(){
		var dataJson = modal.convertModalToJsonObj("tcTableModal" );
		ajaxTranCall("scenario/updateTestcase.do", dataJson, callbackS, callBackE);
	});
	
});


//ajaxTranCall("scenario/selectScenario.do", {}, callbackS, callBackE);

var selectScenario = function (){
	var jsonObj = {
			"depthA": $("#selectA").val(),
			"depthB": $("#selectB").val(),
			"depthC": $("#selectC").val()
	}
	ajaxTranCall("scenario/selectScenario.do", jsonObj, callbackS, callBackE);
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
		
	case "user/searchUserList.do":
		
		tcTableModalUser = $('#tcTableModalUser').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'team_name' },
	            { "mDataProp" : 'name' } 
	        ],
			"language": {
		        "emptyTable": "데이터가 없어요." 
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
		            { "mDataProp" : 'case_code' },
		            { "mDataProp" : 'case_name' },
//		            { "mDataProp" : 'description' },

		            { "mDataProp" : 'reg_name' },
		            { "mDataProp" : 'test_name' },
		            { "mDataProp" : 'dev_name' },
		            { "mDataProp" : 'state' }
		        ],
				"language": {
			        "emptyTable": "데이터가 없어요." 
			    },
			    
				lengthChange: true, 	// 표시 건수기능 숨기기
				searching: true,  		// 검색 기능 숨기기
				ordering: false,  		// 정렬 기능 숨기기
				info: false,			// 정보 표시 숨기기
				paging: true, 			// 페이징 기능 숨기기
				select: {
		            style: 'single' //single, multi
				},
				"scrollY":        500,
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
		                text: '삭제',
		                action: function ( e, dt, node, config ) { 
		                	
		                	if(!confirm("선택된 테스트 케이스를 삭제하시겠습니까?")) return;
		                	$('#tableTestcase tr').each(function(){
		        				if($(this).hasClass('selected') ){
		        					var dataJson = tableTestcase.row($(this)).data(); 
		        					ajaxTranCall("scenario/deleteTestcase.do", dataJson, callbackS, callBackE);
		        				}
		        			});
		                }
		            } 
		        ]
				
		    });
			
		}
		break;
	//시나리오 상단 업무구분 정보 조회
	case "scenario/searchDivListWithCombo.do":
		if(data["resultCode"] == "0000" ){
			var detpth = data["depth"];
			
			
			if(detpth == "A"){
				htmlSelectBox("selectA", "", "전체");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=selectA]"), list[i].id, list[i].name);
				}
			}
			else if(detpth == "B"){
				htmlSelectBox("selectB", "", "전체");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=selectB]"), list[i].id, list[i].name);
				}
			}
			else if(detpth == "C"){
				htmlSelectBox("selectC", "", "전체");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=selectC]"), list[i].id, list[i].name);
				}
			}
		}
		
	break;
	case "scenario/selectScenario.do":
		
		
		tableScenario = $('#tableScenario').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'scenario_name' } 
	        ],
			"language": {
		        "emptyTable": "데이터가 없어요." 
		    },
		    
			lengthChange: true, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			"scrollY":        500,
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
	                action: function ( e, dt, node, config ) {
//	                	if(!confirm("선택된 테스트 케이스를 삭제하시겠습니까?")) return;
	                	$('#tableTestcase tr').each(function(){
	        				if($(this).hasClass('selected') ){
	        					var dataJson = tableTestcase.row($(this)).data(); 
	        					ajaxTranCall("scenario/deleteTestcase.do", dataJson, callbackS, callBackE);
	        				}
	        			});
	                	
	                	if(!confirm("시나리오 삭제시에 하위 테스트 케이스도 삭제됩니다.")){
	                		return;
	                	}

	                	$('#tableScenario tr').each(function(){
	        				if($(this).hasClass('selected') ){
	        					var dataJson = tableScenario.row($(this)).data(); 
	        					ajaxTranCall("scenario/deleteScenario.do", dataJson, callbackS, callBackE);
	        				}
	        			});
	                	
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
		
		$("#layerModalScenario").modal();
	}
	//2. 시나리오 수정
	else if(crType == "2"){
		
		$("#modalTitle").text("시나리오 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
		$('#tableScenario tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 
				 modal.convertJsonObjToModal("seTableModal", tableScenario.row($(this)).data() )
			 }
		});
		$("#layerModalScenario").modal();
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
    	
    	
    	$('#tableTestcase tr').each(function(){
			 if ( $(this).hasClass('selected') ){
//				 modal.convertJsonObjToModal("tcTableModal",  )
				 
				 var dataJson = tableTestcase.row($(this)).data();
				 //{"dev_name":"","case_code":"A_CASE_0002","reg_user":"admin","modify_user":"admin",
				 //"case_name":"화면 일반 테스트2","tester_id":"N00001","description":"화면 일반 테스트2 설명","dev_id":"",
				 //"scenario_code":"CLUZ0922U","reg_date":1589065643270,"project_id":0,
				 //"reg_name":"","state":"0","modify_date":1589065643270,"test_name":"홍길동"}
				 
				 $("#tester").val(dataJson["tester_id"]);
				 $("#tester_nm").val(dataJson["test_name"]);
				 $("#developer").val(dataJson["dev_id"]);
				 $("#developer_nm").val(dataJson["dev_name"]);
				 $("#tc_description").val(dataJson["description"]);

				 $("#testcase_code").val(dataJson["case_code"]);
				 $("#testcase_name").val(dataJson["case_name"]);
				 
			 }
		});
    	
    	$("#modalTitleTc").text("테스트케이스 수정");
    	$("#layerModalTestCase").modal();
    	
    	$('#btnSaveTc').hide();
		$('#btnUpdateTc').show();
				
	}
	
}




