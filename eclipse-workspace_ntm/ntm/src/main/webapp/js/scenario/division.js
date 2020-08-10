/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

var tableA, tableB, tableC;
var modalType = "";
var teamUserModalTable;

var initDoucument = function(){
	
	
	searchDivListSetTable("A", {list:[]});
	searchDivListSetTable("B", {list:[]});
	searchDivListSetTable("C", {list:[]});
	
	
	serchDivList("A");
	ajaxTranCall("user/selectTeamList.do", {role_code:"DEV"}, callbackS, callBackE);
	
	//modalType
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
//		if(!modal.modalCheckInputData("teamTableModal")) return;
		var dataJson = modal.convertModalToJsonObj("teamTableModal" );
		dataJson["depth"] = modalType; 
		dataJson["team_id"] = $("#selectTeam").val(); 
		
		ajaxTranCall("scenario/insertDivision.do", dataJson, callbackS, callBackE);
	});
	
	
	//수정버튼 선택시
	$("#btnUpdate").click(function(e){
		var dataJson = modal.convertModalToJsonObj("teamTableModal" );
		dataJson["depth"] = modalType; 
		
		if(modalType == "A"){
			$('#tableA tr').each(function(){
				if($(this).hasClass('selected') ){
					dataJson["div_id"] =  tableA.row($(this)).data().div_id;
				}
			});
		}
		
		else if(modalType == "B"){
			$('#tableB tr').each(function(){
				if($(this).hasClass('selected') ){
					dataJson["div_id"] =  tableB.row($(this)).data().div_id;
				}
			});
		}
		
		
		else if(modalType == "C"){
			$('#tableC tr').each(function(){
				if($(this).hasClass('selected') ){
					dataJson["div_id"]  =  tableC.row($(this)).data().div_id;
					dataJson["team_id"] = $("#selectTeam").val(); 
				}
			});
		}
		
		ajaxTranCall("scenario/updateDivision.do", dataJson, callbackS, callBackE);
	});
	
	//서브시스템 Table click event
	$('#tableA').on('click', function(){
		setTimeout(function() {
			$('#tableA tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableA.row($(this)).data();
					$('#tableThB').text(dataJson.name);
					serchDivList("B", dataJson.div_id);
					searchDivListSetTable("C", {list:[]});
				}
			});
		}, 100);
	});
	$('#tableB').on('click', function(){
		setTimeout(function() {
			$('#tableB tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableB.row($(this)).data();
					$('#tableThC').text(dataJson.name);
					serchDivList("C", dataJson.div_id);
				}
			});
		}, 100);
	});
//	modalType
	
	$("#selectA").on('change', function(){
		if(modalType == "C"){
			ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode": $(this).val()}, callbackS, callBackE);
		}
	});
	
	
}


var serchDivList = function(type, upcode, upupcode){
	
	var json = {
		"depth" : type
	}
	if(upupcode != null){
		json["upupcode"] = upupcode;
	}
	else if(upcode != null){
		json["upcode"] = upcode;
	}
	
	ajaxTranCall("scenario/searchDivList.do", json, callbackS, callBackE);
	
}

var callbackS = function(tran, data){
	
	
	switch(tran){
	
	case "user/selectTeamList.do":
		var list = data["list"];
		
		for(var i=0; i<list.length; i++){
			appendSelectBox2($("#selectTeam"), list[i].id, list[i].name + " ( PL : " + list[i].reader_name  + ")");
		}
		
		break;
		
	case "scenario/searchDivListWithCombo.do":
		if(data["resultCode"] == "0000" ){
			var detpth = data["depth"];
			var list = data["list"];
			
			
			if(detpth == "A"){
				htmlSelectBox("selectA", "", "선택해 주세요");
				for(var i=0; i<list.length; i++){
					appendSelectBox("selectA", list[i].div_id, list[i].name);
				}
					
				//수정인 경우 직접 선택되게 수정
				if($("#modalTitle").text().indexOf("수정") != -1){
					
					if(modalType == "B"){
						$('#tableB tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableB.row($(this)).data();
								$('#selectA').val(dataJson.upcode);
							}
						});
					}
					else if(modalType == "C"){
						$('#tableC tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableC.row($(this)).data();
								$('#selectA').val(dataJson.upupcode);
								ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode":dataJson.upupcode}, callbackS, callBackE);
							}
						});
					}
					
				}
			}
			
			else if(detpth == "B"){
				htmlSelectBox("selectB", "", "선택해 주세요");
				for(var i=0; i<list.length; i++){
					appendSelectBox("selectB", list[i].div_id, list[i].name);
				}
				
				//수정인 경우 직접 선택되게 수정
				if($("#modalTitle").text().indexOf("수정") != -1){
					$('#tableC tr').each(function(){
						if($(this).hasClass('selected') ){
							var dataJson = tableC.row($(this)).data();
							$('#selectB').val(dataJson.upcode);
							
							if($('#selectB').val()== null){
								$('#selectB').val("")  
							}
						}
					});
				}
			}
			
			
			
		}
		break;

	case "scenario/insertDivision.do":
	case "scenario/updateDivision.do":
	case "scenario/deleteDivision.do":
		
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('div.modal').modal("hide"); //닫기 
			serchDivList("A");
			searchDivListSetTable("B", {list:[]});
			searchDivListSetTable("C", {list:[]});
		}
		
		break;
	
	case "scenario/searchDivList.do":
		var detpth = data["depth"];
		var list = data["list"];
		
		
		//한번에 설정하기 실패하였습니다.
		if(detpth == "A") tableA = searchDivListSetTable(detpth, list);
		if(detpth == "B") tableB = searchDivListSetTable(detpth, list);
		if(detpth == "C") tableC = searchDivListSetTable(detpth, list);
		
		
		
		break;
	}
	
}

var searchDivListSetTable = function ( detpth, list){
	
	
	for(var i=0 ; i< list.length; i++){
		
		if(detpth == "A"){
			list[i].name_all = list[i].name;
		}
		else if(detpth == "B"){
			list[i].name_all = list[i].up_name + " > " + list[i].name;
		}
		else if(detpth == "C"){
			list[i].name_all = list[i].upup_name + " > " + list[i].up_name + " > " + list[i].name;
		}
//		list[i].rnum = i+1;
//		var phone_num = list[i].phone_num;
	}
	
	
	if(detpth != "C"){
		return $('#table'+ detpth).DataTable ({
			destroy: true,
	        "aaData" : list,
	        
	        "columns" : [
	            { "mDataProp" : 'name_all' } 
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
			 pageLength:15, //기본 데이터건수
			"scrollY":        550,
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
	                text: '삭제', className: 'red',
	                action: function ( e, dt, node, config ) {
	                	var isSelected = false;
	                	
	                	if(!confirm("삭제시에 하위뎁스에 데이터도 전부삭제 됩니다.")){
	                		return;
	                	}
	                	else if(detpth == "B"){
	                		$('#tableB tr').each(function(){
								if($(this).hasClass('selected') ){
									var dataJson = tableB.row($(this)).data();
									isSelected = true;
									ajaxTranCall("scenario/deleteDivision.do", {"depth":"B", "div_id":dataJson.div_id}, callbackS, callBackE);
								}
							});
	                	}
	                	else if(detpth == "A"){
	                		$('#tableA tr').each(function(){
								if($(this).hasClass('selected') ){
									var dataJson = tableA.row($(this)).data();
									isSelected = true;
									ajaxTranCall("scenario/deleteDivision.do", {"depth":"B", "div_id":dataJson.div_id}, callbackS, callBackE);
								}
							});
	                	}
	                	
	                	if(!isSelected){
	                		alert("삭제할 데이터를 선택해주세요.");
	                		
	                	}
	                }
	            },
	        ]
			
	    });
	}
	 
	else{
		return $('#table'+ detpth).DataTable ({
			destroy: true,
	        "aaData" : list,
	        
	        "columns" : [
	            { "mDataProp" : 'name_all' } ,
	            { "mDataProp" : 'team_name' },
	            { "mDataProp" : 'reader_name' } 
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
			 pageLength:15, //기본 데이터건수
			"scrollY":        550,
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
	                text: '삭제', className: 'red',
	                action: function ( e, dt, node, config ) {
	                	var isSelected = false;
	                	
	                	if(!confirm("삭제시에 하위뎁스에 데이터도 전부삭제 됩니다.")){
	                		return;
	                	}
                		$('#tableC tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableC.row($(this)).data();
								isSelected = true;
								ajaxTranCall("scenario/deleteDivision.do", {"depth":"C", "div_id":dataJson.div_id}, callbackS, callBackE);
							}
						});
                
	                	
	                	if(!isSelected){
	                		alert("삭제할 데이터를 선택해주세요.");
	                		
	                	}
	                }
	            }
//	            ,{
//	                text: '전체',
//	                action: function ( e, dt, node, config ) {
//	                	
//                		serchDivList("C");
//                		$('#tableThC').text("전체");
//                		$('#tableB tr').each(function(){
//            				if($(this).hasClass('selected') ){
//            					$(this).removeClass('selected');
//            				}
//            			});
//	                	
//	                }
//	            }
	        ]
			
	    });
	}
}

var callBackE = function(tran, data){
	
}


var modalOpen = function( crType, divType, e, dt, node, config ) {

	$("#selectTeam").val("");
	$("#selectA").val("");
	$("#selectB").val("");
	$("#name").val("");
	
	var isSelected = false;
	modalType = divType;
	$('#name').val("");
	if(divType == "A"){
		$("#modalTrA").hide();
		$("#modalTrB").hide();
		$("#modalTrC").hide();
		$("#modalTitle").text("서브시스템");
		if(crType == "2"){
			$('#tableA tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableA.row($(this)).data();
					$('#name').val(dataJson.name);
					isSelected = true;
				}
			});
		}
		$("#selectA").removeClass("required");
		$("#selectB").removeClass("required");
	}
	else if(divType == "B"){
		
		$("#modalTrA").show();
		$("#modalTrB").hide();
		$("#modalTrC").hide();
		
		 
		$("#modalTitle").text("업무구분");
		//서브시스템 콘보 데이터 조회
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"A"}, callbackS, callBackE);
		
		if(crType == "2"){
			$('#tableB tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableB.row($(this)).data();
					$('#name').val(dataJson.name);
					isSelected = true;
				}
			});
		}
		$("#selectA").addClass("required");
		$("#selectB").removeClass("required");
		
	}
	else{

//		$("#div02").show();
//		$("#div02").addClass('col-md-5');
//		$("#div01").removeClass('col-md-12');
//		$("#div01").addClass('col-md-7');
		
		
		$("#modalTrA").show();
		$("#modalTrB").show();
		$("#modalTrC").show();
		$("#modalTitle").text("대상업무");
		
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"A"}, callbackS, callBackE);
		
		$('#tableC tr').each(function(){
			if($(this).hasClass('selected') ){
				var dataJson = tableC.row($(this)).data();
				$('#name').val(dataJson.name);
				$("#selectTeam").val(dataJson.team_id);
				
				isSelected = true;
			}
		});
		$("#selectA").addClass("required");
		$("#selectB").addClass("required");
	}
	
	


	if(crType == "1"){
		$("#modalTitle").text($("#modalTitle").text() + " 등록");
		$('#btnSave').show();
		$('#btnUpdate').hide();
	}
	else{
		
		if(!isSelected){
			alert("수정할 데이터를 선택해주세요.");
			return;
		}
		$("#modalTitle").text($("#modalTitle").text() + " 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
	}
	
	$('div.modal').modal();
	
}