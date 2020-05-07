
let userTable;

$(document).ready(function() { 
	
		searchUserList();
		ajaxTranCall("user/searchTeamList.do", {}, callbackS, callBackE);
		
		//신규 저장버튼 click event
		$("#btnSave").click(function(e){
			var dataJson = modal.convertModalToJsonObj("userTableModal" );
			ajaxTranCall("user/saveUser.do", dataJson, callbackS, callBackE);
		});
		$("#btnUpdate").click(function(e){
			var dataJson = modal.convertModalToJsonObj("userTableModal" );
			ajaxTranCall("user/updateUser.do", dataJson, callbackS, callBackE);
		});
		
		$("#team_id_main").on('change', function(){
			searchUserList();
		});
		
		
		
		$('#file1').on('change', function(){
			
			fileBuffer = [];
	        const target = document.getElementsByName('file1');
	        
	        Array.prototype.push.apply(fileBuffer, target.files);
	        var html = '';
	        $.each(target[0].files, function(index, file){
	            const fileName = file.name;
	            const fileEx = fileName.slice(fileName.indexOf(".") + 1).toLowerCase();
//	            if(fileEx != "jpg" && fileEx != "png" &&  fileEx != "gif" &&  fileEx != "bmp" && fileEx != "wmv" && fileEx != "mp4" && fileEx != "avi"){
//	                alert("파일은 (jpg, png, gif, bmp, wmv, mp4, avi) 형식만 등록 가능합니다.");
//	                return false;
//	            }
	        });
		        
	        ajaxForm("user/uploadExcel.file", "frm", callbackS);

		});
});



var searchUserList = function( ) {

	var json = {
		team_id : $("#team_id_main").val()		
	};

	ajaxTranCall("user/searchUserList.do", json, callbackS, callBackE);
	
} 

var callbackS = function(tran, data){
	
	switch(tran){
	
	case "user/saveUser.do":
	case "user/deleteUser.do":
	case "user/updateUser.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('div.modal').modal("hide"); //닫기 
			searchUserList();
		}
		break;
		
		
	case "user/searchTeamList.do":
		
		var list = data["list"];
		for(var i=0; i<list.length; i++){
			appendSelectBox("team_id", list[i].id, list[i].name + "  (" +list[i].rolename +  ")");
			appendSelectBox("team_id_main", list[i].id, list[i].name);
		}
		
		break;
	
	case "user/searchUserList.do":
		if(data.resultCode != "0000"){
			
			return;
		}
		
		userTable = $('#userTable').DataTable ({
			destroy: true,
	        "aaData" : data["list"],
	        "columns" : [
	            { "mDataProp" : "rnum" },
	        	{ "mDataProp" : "user_id" } ,
	            { "mDataProp" : "name" },
	            { "mDataProp" : "team_name" },
	            { "mDataProp" : "organization" },
	            { "mDataProp" : "phone_num" },
	            { "mDataProp" : "position" },
	            { "mDataProp" : "email" },
	            { "mDataProp" : "description" }
	            
	            
	        ],
			"language": {
		        "emptyTable": "데이터가 없어요." 
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
	        "scrollCollapse": false,
	        
//	        //컬럼속성
//	        "columnDefs": [
//	            {
//	                "targets": [ 1 ],
//	                "visible": false,
//	                "searchable": true
//	            },
//	        ],
			
			
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
	                action: function ( e, dt, node, config ) {
	                	
	                	
	                    $('#userTable tr').each(function(){
	           			 if ( $(this).hasClass('selected') ){
	           				 
	           				 if(confirm(userTable.row($(this)).data().name + " 을(를) 삭제하시겠습니까?")){
	           					var dataJson = {
	           						user_id : userTable.row($(this)).data().user_id
           						};
           						ajaxTranCall("user/deleteUser.do", dataJson, callbackS, callBackE);
	           				 }
	           			 }
	                  });
	                }
	            },
	            {
	        		extend:'excel',
	        		text:'다운로드',
	        		bom:true
	        	},
	            {
	                text: '업로드',
	                action: function ( e, dt, node, config ) {
	                	$('#file1').trigger('click');
	                }
	            }
	        ]
			
	    });
		
//		userTable.on( 'order.dt search.dt', function () {
//			userTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
//	            cell.innerHTML = i+1;
//	        } );
//	    } ).draw();
		break;
	}
	
//	{"resultCode":"0000","message":"정상적으로 조회되었습니다.","list":[{"reg_user":"nexcore","modify_user":"nexcore","description":"관리자계정입니다.","admin":true,"reg_date":1588572727418,"password":"admin","user_id":"admin","organization":"SK주식회사","name":"관리자","phone_num":"010-0000-0000","position":"수석","modify_date":1588572727418,"email":"nexcore4u@sk.com"}]}
}

var callBackE = function(tran, data){
	
}


var modalOpen = function(type, e, dt, node, config ) {
	
	modal.modalClear("userTableModal");
	
	if(type == "1"){
		$('#modalTitle').text("사용자 등록");
		$('#btnSave').show();
		$('#btnUpdate').hide();
	}
	else{
		$('#modalTitle').text("사용자 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
		
		
		$('#userTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 modal.convertJsonObjToModal("userTableModal", userTable.row($(this)).data() )
			 }
		});
	}
	
	$('div.modal').modal();
}
