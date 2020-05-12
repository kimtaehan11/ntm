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
		selectUserList($(this).val());
	});
	
	$("#selectUser").on('change', function(){
		selectTestCaseList();
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
		
		var data = new FormData();
		var fileList = $("#files").prop('files');
		for(var i=0; i<fileList.length; i++){
			data.append( "file"+i, fileList[i] );
		}
		
		
		if(fileList == null){
			data.append("fileLength", "0");
		}
		else{
			data.append("fileLength", fileList.length+"");
		}
		
		data.append("title", $("#title").val());
		data.append("test_type_id", $("#test_type_id").val());
		data.append("description", $("#description").val());
		data.append("user_id",getCookie("user_id"));
		
		//scenario_code
		data.append("scenario_code", $("#scenario_code").val());
		data.append("case_code", $("#case_code").val());
		ajaxTranCallWithFile ("defect/insertDefect.file", data,  callbackS, callBackE);
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
		
	}
	else{
		$("#selectTeam").val(team_id);
		jsonObj["team_id"] = team_id;
	}
	
	ajaxTranCall("user/selectUserList.do", jsonObj, callbackS, callBackE);
}


var callbackS = function(tran, data){
	
	
	switch(tran){
		
		case "defect/insertDefect.file":
			alert(data["message"]);
			if(data["resultCode"] == "0000" ){
				$('div.modal').modal("hide"); //	
				selectDefectList();
			}
			break;
		case "defect/selectDefectDetail.do":
//"ext":"jpg","reg_date":1589247841751,"originfilename":"011.jpg","tbname":"itm_defect","filelength":170510,"reg_user":"307843","savefilename":"307843_1589247841708.jpg","tbdate":"20200512","id":7,"seq":1},
//"ext":"jpg","reg_date":1589247841796,"originfilename":"012.jpg","tbname":"itm_defect","filelength":86288,"reg_user":"307843","savefilename":"307843_1589247841756.jpg","tbdate":"20200512","id":7,"seq":2}]}
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
		            { "mDataProp" : 'test_type_id' },
		            { "mDataProp" : 'defect_code' }  ,
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
				"scrollY":        300,
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
		case "user/searchTeamList.do":
			var list = data["list"];
			htmlSelectBox2($("#selectTeam"), "", "전체");
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
			
		case "scenario/selectTestCaseList.do":
//			{"dev_name":"김태한","case_code":"A_CASE_0001","reg_user":"admin","modify_user":"admin",
//			"case_name":"화면 일반 테스트1","tester_id":"307843","description":"화면 일반 테스트1","dev_id":"N00435",
//			"scenario_code":"CLUZ0922U","reg_date":1589065603800,"project_id":0,
//			"reg_name":"","state":"0","modify_date":1589065603800,"test_name":"홍석운"}
			var list = data["list"];
			caseTable = $('#caseTable').DataTable ({
				destroy: true,
		        "aaData" : list,
		        "columns" : [
		            { "mDataProp" : 'rnum' },
		            { "mDataProp" : 'scenario_code' },
		            { "mDataProp" : 'case_name' } ,
		            { "mDataProp" : 'dev_name' }  ,
		            { "mDataProp" : 'test_name' } ,
		            { "mDataProp" : 'state' } 
		        ],
		        "language": {
			        "emptyTable": "데이터가 없어요." , "search": "검색 : "
			    },
			    
				lengthChange: false, 	// 표시 건수기능 숨기기
				searching: true,  		// 검색 기능 숨기기
				ordering: false,  		// 정렬 기능 숨기기
				info: false,			// 정보 표시 숨기기
				paging: true, 			// 페이징 기능 숨기기
				select: {
		            style: 'single' //single, multi
				},
				"scrollY":        500,
		        "scrollCollapse": false
				
		    });
			
			
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
