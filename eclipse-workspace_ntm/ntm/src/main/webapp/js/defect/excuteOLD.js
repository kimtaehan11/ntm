/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */
var isFirstLoad;

var caseTable, defectTable;
var defectHistrotyModalTable, autoTestModalTable;
var imgkey = -1;
var crud = "I";

//팝업 호출 타입  1 신규, 2업데이트
var modalOpenType = "1";
$(document).ready(function() { 
	//팀정보 조회합니다.
	ajaxTranCall("user/selectTeamList.do", {role_code:"TEST"}, callbackS, callBackE);
	ajaxTranCall("code/selectCodeList.do", {"code_group":"C001"}, callbackS, callBackE);
	ajaxTranCall("code/selectCodeList.do", {"code_group":"A001"}, callbackS, callBackE);
	ajaxTranCall("code/selectCodeList.do", {"code_group":"B001"}, callbackS, callBackE);
	
	$("#selectTeam").on('change', function(){
		isFirstLoad = false;
		selectUserList($(this).val());
	});
	
	$("#selectUser").on('change', function(){
		selectTestCaseList();
	});
	
	//Test 자동화 버튼 선택
	$("#btnRecording").on('click', function(){ 
		
		var datajson;
		$('#defectTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				   datajson = defectTable.row($(this)).data();
			 }
		});
		
//		alert(modalOpenType);
		
		if(modalOpenType == "1" || modalOpenType == "3"){
//			modalOpenType = "2";
			modalOpenType = "3"
			$("#btnSave").trigger("click");
			
		}
		else if(modalOpenType== "2"){
			skInterface.autoTestRecording(getCookie("user_id"), datajson["id"] + "", datajson["title"] );
		}
		
		
		
	});
	
	
	//서브시스템 Table click event
	$('#caseTable').on('click', function(){
		setTimeout(function() {
			selectDefectList();
		}, 100);
	});
	

	$('#files').on('change', function(e){
		
		var files = e.target.files;
		var filesArr = Array.prototype.slice.call(files);
		
		$("#imgs").html("");
		filesArr.forEach(function(f){
			
			var fs = f.name.split(".");
			
				var htmlStr = '<img id="img'+fs[0]+'" style="height:100px;"/>';
				$("#imgs").append(htmlStr);
				
				var reader = new FileReader();
				reader.onload = function(e){
					var fs = f.name.split(".");
					console.log("#img"+fs[0]);
					$("#img"+fs[0]).attr("src", e.target.result);
					
				}
				reader.readAsDataURL(f);
		});
	});
		
	
	$("#btnSave").on('click', function(){
		
		if( !modal.modalCheckInputData("defectTableModal")){
			modalOpenType = "1";
			return;
		}
		
//		
		var data = new FormData();
		var fileList = $("#files").prop('files');
		
		if(fileList.length < 1){
			insertDefectDO("-1");
			return;
		}
		for(var i=0; i<fileList.length; i++){
			data.append( "file"+i, fileList[i] );
		}
		
		if(fileList == null){
			data.append("fileLength", "0");
		}
		else{
			data.append("fileLength", fileList.length+"");
		}
		
		data.append("tbname", "itm_defect");
		data.append("user_id", getCookie("user_id"));
		crud = "I";
		data.append("crud", crud);
		
		ajaxTranCallWithFile ("common/uploadFile.file", data,  callbackS, callBackE);
	});
	$("#btnUpdate").on('click', function(){
		
		var data = new FormData();
		var fileList = $("#files").prop('files');
		
		if(fileList.length < 1){
			updateDefectDO(imgkey);
			return;
		}
		for(var i=0; i<fileList.length; i++){
			data.append( "file"+i, fileList[i] );
		}
		
		if(fileList == null){
			data.append("fileLength", "0");
		}
		else{
			data.append("fileLength", fileList.length+"");
		}
		
		crud = "U";
		data.append("crud", 	crud);
		data.append("imgkey", 	imgkey);
		data.append("tbname", 	"itm_defect");
		data.append("user_id", 	getCookie("user_id"));
		ajaxTranCallWithFile ("common/uploadFile.file", data,  callbackS, callBackE);
	});
	//테스트 상태변경 버튼
	$("#btnStateChange").on('click', function(){
		var jsonObj = {
			"scenario_code" :  	$("#scenario_code").val(),
			"case_code"		:	$("#case_code").val(),
			"state"    		:	$("#state").val()	
		}
		ajaxTranCall ("scenario/updateTestcaseOnlyState.do", jsonObj,  callbackS, callBackE);
	});
	
	//modal 결함이력/테스트자동화 selectbox change evnet
	$("#selectType").on('change', function(){
		
		var type = $(this).val();
		//결함이력
		if(type=="1"){
			//결함 이력 조회
			
			$('#defectTable tr').each(function(){
				 if ( $(this).hasClass('selected') ){
					 var datajson = defectTable.row($(this)).data();
					 ajaxTranCall("defect/selectDefectHistroty.do", datajson, callbackS, callBackE);
				 }
			});

			 $("#selectType").val("1");
			 $("#autoTestModalTable").hide();
			 $("#autoTestModalTable_wrapper").hide();
			 $("#defectHistrotyModalTable").show();
			 $("#defectHistrotyModalTable_wrapper").show();
			 $("#btnRecording").hide();
		}
		//테스트자동화
		else{
			$('#defectTable tr').each(function(){
				 if ( $(this).hasClass('selected') ){
					 var datajson = defectTable.row($(this)).data();
					 ajaxTranCall("auto/selectAutoList.do", {"defect_id":datajson.id}, callbackS, callBackE);
				 }
			});
			
			$("#autoTestModalTable").show();
			$("#autoTestModalTable_wrapper").show();
		    $("#defectHistrotyModalTable").hide();
	        $("#defectHistrotyModalTable_wrapper").hide();
	        $("#btnRecording").show();
		}
	});
	
});

function handleImgFileSelect(e){
	
	
	
}
var selectDefectList = function (){
	$('#caseTable tr').each(function(){
		if($(this).hasClass('selected') ){
			var dataJson = caseTable.row($(this)).data();
			modal.convertJsonObjToModal("caseTableModal", dataJson);
			
			var jsonObj = {
				"case_code" : dataJson.case_code,
				"scenario_code" : dataJson.scenario_code
			}
			
			ajaxTranCall("defect/selectDefectList.do", jsonObj, callbackS, callBackE);
		}
	});
}
var selectTestCaseList = function(){
	
	var jsonObj = {
		"tester_id" : $("#selectUser").val()
	}
	ajaxTranCall("scenario/selectTestCaseList.do", jsonObj, callbackS, callBackE);
}

var selectUserList = function(team_id){
	var jsonObj = {};
	if(team_id == null || team_id == ""){
		jsonObj["role_code"] = "TEST";
	}
	else{
		$("#selectTeam").val(team_id);
		jsonObj["team_id"] = team_id;
		jsonObj["role_code"] = "TEST";
	}
	ajaxTranCall("user/selectUserList.do", jsonObj, callbackS, callBackE);
}


var callbackS = function(tran, data){
	
	
	switch(tran){
	
	case "defect/selectDefectHistroty.do":
		
		var list = data["list"];
		defectHistrotyModalTable = $('#defectHistrotyModalTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'test_type' } ,
	            { "mDataProp" : 'defect_code' } ,
	            { "mDataProp" : 'name' },
	            { "mDataProp" : 'reg_date' } 
	        ],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": "검색 : "
		    },
		    
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			"scrollY":       400,
	        "scrollCollapse": false 
			
	    });
		
		break;
	
	case "code/selectCodeList.do":
		
		var code_group = data["code_group"];
		var list = data["list"];
		
		if(code_group == "C001"){
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#state"), list[i].code_id, list[i].code_name);
				appendSelectBox2( $("#selectState"), list[i].code_id, list[i].code_name);
			}
		}
		else if(code_group == "B001"){
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#defect_code"), list[i].code_id, list[i].code_name);
			}
		}
		
		else if(code_group == "A001"){
			for(var i=0; i<list.length; i++){
				
				if(list[i].code_id == "A001_03") continue;
				appendSelectBox2( $("#test_type"), list[i].code_id, list[i].code_name);
			}
		}
		break;
	case "common/uploadFile.file":
		
		imgkey = data.imgkey;
		if(crud == "I")
			insertDefectDO(data.imgkey);
		else
			updateDefectDO(data.imgkey);
		
		break;
	case "defect/insertDefect.do":
	case "defect/updateDefect.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			
			if(modalOpenType == "3"){
				modalOpenType = "2";
				
//				$('#modalTitle').text("결함 수정");
//				$('#btnSave').hide();
//				$('#btnUpdate').show();
//				$("#test_type").val("0");
//				
				 // 텍스트 박스 readonly 처리
		        $("#test_type").attr("readonly",true);
		        skInterface.autoTestRecording(getCookie("user_id"), data["id"] + "", data["title"] );
				
			}
			$('div.modal').modal("hide"); //	
			selectDefectList();
		}
		break;
	case "scenario/updateTestcaseOnlyState.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('div.modal').modal("hide"); //	
			selectDefectList();
		}
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
			
			
		//테스트 진행건 조회
		case "defect/selectDefectList.do":
			
			var list = data["list"];
			defectTable = $('#defectTable').DataTable ({
				destroy: true,
		        "aaData" : list,
		        "columns" : [
		            { "mDataProp" : 'rnum' } ,
		            { "mDataProp" : 'title' },
		            { "mDataProp" : 'test_type_name' },
		            { "mDataProp" : 'defect_name' }  ,
		            { "mDataProp" : 'reg_date_str' } 
		        ],
		        "language": {
			        "emptyTable": "데이터가 없어요." , "search": "검색 : "
			    },
			    
				lengthChange: false, 	// 표시 건수기능 숨기기
				searching: false,  		// 검색 기능 숨기기
				ordering: false,  		// 정렬 기능 숨기기
				info: false,			// 정보 표시 숨기기
				paging: true, 			// 페이징 기능 숨기기
				select: {
		            style: 'single' //single, multi
				},
				"scrollY":       400,
		        "scrollCollapse": false,
		        dom : 'Bfrtip',
		        buttons: [
		        	
		            {
		                text: '신규 결함 등록',
		                action: function ( e, dt, node, config ) {
		                	
		                	modalOpen("1", e, dt, node, config )
		                }
		            },
		            {
		                text: '수정',
		                action: function ( e, dt, node, config ) {
		                	modalOpen("2", e, dt, node, config )
		                }
		            }
		            
		        ]
				
		    });
			break;
		//팀 정보 전체 조회
		case "user/selectTeamList.do":
			var list = data["list"];
			htmlSelectBox2($("#selectTeam"), "", "팀 전체");
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#selectTeam"), list[i].id, list[i].name);
			}
			
			var team_id = getCookie('team_id');
			isFirstLoad = true;
			selectUserList(team_id);
			break;
			
		//user 정보 조회함
		case "user/selectUserList.do":
			var list = data["list"];
			htmlSelectBox2($("#selectUser"), "", "테스터 전체");
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
			
		case "scenario/selectTestCaseList.do":
			
			var list = data["list"];
			caseTable = $('#caseTable').DataTable ({
				destroy: true,
				
		        "aaData" : list,
		        "columns" : [
		            { "mDataProp" : 'rnum' },
		            { "mDataProp" : 'scenario_code' },
		            { "mDataProp" : 'case_name' } ,
		            { "mDataProp" : 'test_name' } ,
		            { "mDataProp" : 'dev_name' }  ,
		            { "mDataProp" : 'statestr' }
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
		        "scrollCollapse": false
				
		    });
			
			
			break;
	}
}

var callBackE = function(tran, data){
	
}
var insertDefectDO= function(_imgkey){
	var data = {
			"title": $("#title").val(),
			"test_type": $("#test_type").val(),
			"description": $("#description").val(),
			"user_id": $("#user_id").val(),
			"scenario_code": $("#scenario_code").val(),
			"case_code": $("#case_code").val(),
			"defect_code":$("#defect_code").val(),
			"imgkey": _imgkey
		};
		ajaxTranCall ("defect/insertDefect.do", data,  callbackS, callBackE);
}

var updateDefectDO= function(_imgkey){
	
	var id = "";
	$('#defectTable tr').each(function(){
		 if ( $(this).hasClass('selected') ){
			 var datajson = defectTable.row($(this)).data();
			 id = datajson.id;
		 }
	});
	
	
	var data = {
		"title": $("#title").val(),
		"test_type": $("#test_type").val(),
		"description": $("#description").val(),
		"user_id": $("#user_id").val(),
		"scenario_code": $("#scenario_code").val(),
		"case_code": $("#case_code").val(),
		"defect_code":$("#defect_code").val(),
		"imgkey": _imgkey,
		"id":id
	};
	ajaxTranCall ("defect/updateDefect.do", data,  callbackS, callBackE);
	
}
var modalOpen = function(type, e, dt, node, config ) {
	
	modalOpenType = type;
	
	if(type == "1"){
		$('#modalTitle').text("신규결함 등록");
		$('#btnSave').show();
		$('#btnUpdate').hide();
		imgkey = -1;
		//초기화 작업 필요
		$("#title").val("");
		$("#test_type").val("0");
		$("#description").val("");
		$("#description").val("");
		$("#files").val("");

		$("#imgs").html("");$("#existingImgs").html("");
		$("#existingImgsTr").hide();
		$("#tr_defect_code").hide();
		
//		 $("#defect_code").val("")
	 	$("#defect_code option:eq(0)").prop("selected", true);
	 	$("#test_type option:eq(0)").prop("selected", true);

//		appendSelectBox2( $("#defect_code"), list[i].code_id, list[i].code_name);
//		appendSelectBox2( $("#test_type"), list[i].code_id, list[i].code_name);
        // readonly 삭제
        $("#test_type").removeAttr("readonly");
        
        $("#selectType").attr("readonly",true);
        //팝업 우측 정보 설정 
        $("#selectType").val("2");
		$("#autoTestModalTable").show();
		$("#autoTestModalTable_wrapper").show();
	    $("#defectHistrotyModalTable").hide();
        $("#defectHistrotyModalTable_wrapper").hide();
        $("#btnRecording").show();
		 
	}
	else{
		
		$('#modalTitle').text("결함 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
		$("#test_type").val("0");
		$("#tr_defect_code").show();
		 // 텍스트 박스 readonly 처리
        $("#test_type").attr("readonly",true);
 
        var isSelected = false;

		$('#defectTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 var datajson = defectTable.row($(this)).data();
				 modal.convertJsonObjToModal("defectTableModal", datajson );
				 
//				 alert(datajson.)
				 imgkey = datajson.imgkey;
				//상세조회 이미지 + 자동테스트건
				 isSelected = true;
				 
				 //저장된 이미지건 조회
				 ajaxTranCall("defect/selectDefectDetail.do", datajson, callbackS, callBackE);
				
				 //결함 이력 조회
				 ajaxTranCall("defect/selectDefectHistroty.do", datajson, callbackS, callBackE);
				 

				 $("#selectType").val("1");
				 $("#autoTestModalTable").hide();
				 $("#autoTestModalTable_wrapper").hide();
				 $("#defectHistrotyModalTable").show();
				 $("#defectHistrotyModalTable_wrapper").show();
				 $("#btnRecording").hide();
				 
				 
			 }
		});
		
		if(!isSelected) {
			alert(MSG.SELETED_UPDATE_OBJ);
			return;
		}
		$("#imgs").html("");

		$("#existingImgsTr").show();
		
		
		
		
	}
	
	$('div.modal').modal();
}
