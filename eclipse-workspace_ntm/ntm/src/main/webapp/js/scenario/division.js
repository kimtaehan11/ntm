/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

var tableA, tableB, tableC;
var modalType = "";

$(document).ready(function() { 
	
	serchDivList("A");
	serchDivList("B");
	serchDivList("C");
	
	//modalType
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
		var dataJson = modal.convertModalToJsonObj("teamTableModal" );
		dataJson["depth"] = modalType; 
		ajaxTranCall("scenario/insertDivision.do", dataJson, callbackS, callBackE);
	});
	
	
	//수정버튼 선택시
	$("#btnUpdate").click(function(e){
		var dataJson = modal.convertModalToJsonObj("teamTableModal" );
		dataJson["depth"] = modalType; 
		
		if(modalType == "A"){
			$('#tableA tr').each(function(){
				if($(this).hasClass('selected') ){
					dataJson["id"] =  tableA.row($(this)).data().id;
				}
			});
		}
		
		else if(modalType == "B"){
			$('#tableB tr').each(function(){
				if($(this).hasClass('selected') ){
					dataJson["id"] =  tableB.row($(this)).data().id;
				}
			});
		}
		
		
		else if(modalType == "C"){
			$('#tableC tr').each(function(){
				if($(this).hasClass('selected') ){
					dataJson["id"] =  tableC.row($(this)).data().id;
				}
			});
		}
//		{"name":"대물_하이유피","selectA":"A0004","selectB":"","depth":"B"}
		
		console.log(JSON.stringify(dataJson));
		ajaxTranCall("scenario/updateDivision.do", dataJson, callbackS, callBackE);
	});
	
	//서브시스템 Table click event
	$('#tableA').on('click', function(){
		setTimeout(function() {
			$('#tableA tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableA.row($(this)).data();
					$('#tableThB').text(dataJson.name);
					$('#tableThC').text("전체");
					serchDivList("B", dataJson.id);
					serchDivList("C", "", dataJson.id);
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
					serchDivList("C", dataJson.id);
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
	
});


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
	
	case "scenario/searchDivListWithCombo.do":
		if(data["resultCode"] == "0000" ){
			var detpth = data["depth"];
			var list = data["list"];
			
			
			if(detpth == "A"){
				htmlSelectBox("selectA", "", "선택해 주세요");
				for(var i=0; i<list.length; i++){
					appendSelectBox("selectA", list[i].id, list[i].name);
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
					appendSelectBox("selectB", list[i].id, list[i].name);
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
			serchDivList("B");
			serchDivList("C");
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
	
	

//	else if(detpth == "B"){
//		htmlSelectBox("selectB", "", "선택해 주세요");
//		for(var i=0; i<list.length; i++){
//			appendSelectBox("selectB", list[i].id, list[i].name);
//		}
//	}
	
	
	return $('#table'+ detpth).DataTable ({
		destroy: true,
        "aaData" : list,
        "columns" : [
            { "mDataProp" : 'name' } 
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
           			
                	
                	if(!confirm("삭제시에 하위뎁스에 데이터도 전부삭제 됩니다.")){
                		return;
                	}
                	if(detpth == "C"){
                		$('#tableC tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableC.row($(this)).data();
								ajaxTranCall("scenario/deleteDivision.do", {"depth":"C", "id":dataJson.id}, callbackS, callBackE);
							}
						});
                	}
                	else if(detpth == "B"){
                		$('#tableB tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableB.row($(this)).data();
								ajaxTranCall("scenario/deleteDivision.do", {"depth":"B", "id":dataJson.id}, callbackS, callBackE);
							}
						});
                	}
                	else if(detpth == "A"){
                		$('#tableA tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableA.row($(this)).data();
								ajaxTranCall("scenario/deleteDivision.do", {"depth":"B", "id":dataJson.id}, callbackS, callBackE);
							}
						});
                	}
                }
            },
            {
                text: '전체',
                action: function ( e, dt, node, config ) {
                	
                	if(detpth == "B" || detpth == "A"){
                		serchDivList("A");serchDivList("B");serchDivList("C");
                		$('#tableThC').text("전체");
                		$('#tableThB').text("전체");
                	}
                	if(detpth == "C"){
                		serchDivList("C");
                		$('#tableThC').text("전체");
                	}
                	
                }
            }
        ]
		
    });
}

var callBackE = function(tran, data){
	
}


var modalOpen = function( crType, divType, e, dt, node, config ) {
	
	modalType = divType;
	$('#name').val("");
	if(divType == "A"){
		$("#modalTrA").hide();
		$("#modalTrB").hide();
		$("#modalTitle").text("서브시스템");
		
		$('#tableA tr').each(function(){
			if($(this).hasClass('selected') ){
				var dataJson = tableA.row($(this)).data();
				$('#name').val(dataJson.name);
				
			}
		});
		
	}
	else if(divType == "B"){
		
		$("#modalTrA").show();
		$("#modalTrB").hide();
		$("#modalTitle").text("업무구분");
		//서브시스템 콘보 데이터 조회
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"A"}, callbackS, callBackE);
		$('#tableB tr').each(function(){
			if($(this).hasClass('selected') ){
				var dataJson = tableB.row($(this)).data();
				$('#name').val(dataJson.name);
			}
		});
		
		
	}
	else{
		$("#modalTrA").show();
		$("#modalTrB").show();
		$("#modalTitle").text("대상업무");
		
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"A"}, callbackS, callBackE);
		
		$('#tableC tr').each(function(){
			if($(this).hasClass('selected') ){
				var dataJson = tableC.row($(this)).data();
				$('#name').val(dataJson.name);
			}
		});
	}


	if(crType == "1"){
		$("#modalTitle").text($("#modalTitle").text() + " 등록");
		$('#btnSave').show();
		$('#btnUpdate').hide();
	}
	else{
		$("#modalTitle").text($("#modalTitle").text() + " 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
	}
	
	$('div.modal').modal();
	
}