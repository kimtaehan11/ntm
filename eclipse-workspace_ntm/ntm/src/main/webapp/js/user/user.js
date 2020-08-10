

var userTable;

var initDoucument = function(){

	ajaxTranCall("user/selectTeamList.do", {}, calBackS, callBackE);
	selectUserList();
	
	
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
		
		//필수값 체크 
		if(!modal.modalCheckInputData("userDetailTable")) return;
		var birth = $("#birth").val() ;
		//생년월일은 div 1 depth 더 들어가서 처리 불가 
		//공통소스 고치기 귀찮아 그냥 추가
		if( birth == ""){
			alert("필수 입력값을 입력해주세요.");
			$("#birth").focus();
			return;
		}
//		var userIdCheck = RegExp(/([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/);

//		if(userIdCheck.test(birth)){
//			alert("생년월일을 확인하세요.");
//			$("#birth").focus(); return;
//		}
			
		var dataJson = modal.convertModalToJsonObj("userDetailTable" );
		
		
		if($("#phone_num2").val() != ""){
			dataJson.phone_num = $("#phone_num1").val() + $("#phone_num2").val();
		}

		
		
		ajaxTranCall("user/insertUser.do", dataJson, calBackS, callBackE);
	});
	
	//
	$("#btnUpdate").click(function(e){
		
		if(!modal.modalCheckInputData("userDetailTable")) return;
		
		var birth = $("#birth").val() ; 
		
		//생년월일은 div 1 depth 더 들어가서 처리 불가 
		//공통소스 고치기 귀찮아 그냥 추가
		if( birth == ""){
			alert("필수 입력값을 입력해주세요.");
			$("#birth").focus();
			return;
		}
//		var userIdCheck = RegExp(/^[A-Za-z0-9_\-]{5,20}$/);
//		if(userIdCheck.test(birth)){
//			alert("생년월일을 확인하세요.");
//			$("#birth").focus(); return;
//		}
		
		var dataJson = modal.convertModalToJsonObj("userDetailTable" );
		if($("#phone_num2").val() != ""){
			dataJson.phone_num = $("#phone_num1").val() + $("#phone_num2").val();
		}
		
		
		ajaxTranCall("user/updateUser.do", dataJson, calBackS, callBackE);
	});
	
	$("#team_id_main").on('change', function(){
		selectUserList();
	});
	
	//사용자 컬럼 선택시
	$('#userTable').on('click', function(){
		setTimeout(function() {
			$('#userTable tr').each(function(){
				if($(this).hasClass('selected') ){
					
					var dataJson = userTable.row($(this)).data();
					modal.convertJsonObjToModal("userDetailTable", dataJson);
					
					$("#user_id").attr("readonly",true); 
					
					var phone_num = dataJson.phone_num;

					if(phone_num != "" && phone_num.length>3){
						var phone_num1 = phone_num.substring(0,3);
						if( phone_num1 == "010" || phone_num1 == "011" || phone_num1 == "016" || phone_num1 == "018" || phone_num1 == "019"){
							$("#phone_num1").val(phone_num1);
							$("#phone_num2").val(phone_num.substring(3));
						}
						else{
							$("#phone_num1").val("");
							$("#phone_num2").val(phone_num);
						}
					}
					else{
						$("#phone_num1").val("");
						$("#phone_num2").val(phone_num);
					}


					$("#hearderTitle").text("사용자 정보 수정");
					$("#btnSave").hide();
					$("#btnUpdate").show();
				}
			});
		}, 100);
		
//		selectDefectList();
	});
	
	$('#file1').on('change', function(e){

		var fileBuffer = [];
        var target = $("#file1");
        
        Array.prototype.push.apply(fileBuffer, target.files);
        var html = "";
        $.each(target[0].files, function(index, file){
            var fileName = file.name;
            var fileEx = fileName.slice(fileName.indexOf(".") + 1).toLowerCase();
//            if(fileEx != "jpg" && fileEx != "png" &&  fileEx != "gif" &&  fileEx != "bmp" && fileEx != "wmv" && fileEx != "mp4" && fileEx != "avi"){
//                alert("파일은 (jpg, png, gif, bmp, wmv, mp4, avi) 형식만 등록 가능합니다.");
//                return false;
//            }
        });
	        
        ajaxFormExcel("user/uploadExcel.excel", "file1", calBackS);

	});
}





var selectUserList = function( ) {

	var json = {
		team_id : $("#team_id_main").val()		
	};

	ajaxTranCall("user/selectUserList.do", json, calBackS, callBackE);
} 

var calBackS = function(tran, data){
	
	switch(tran){
	
	case "user/insertUser.do":
	case "user/deleteUser.do":
	case "user/updateUser.do":
	
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			selectUserList();
			
			
			
			
		}
		break;
	case "user/uploadExcel.excel":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			selectUserList();
			var list = data["list"];
			
		
			//파일 업로드 파일 초기화
			$("#file1").val("");
			if(list.length > 0 ){
				
				
				for(var i=0;i<list.length; i++) {
					list[i].rnum = i+1
				}
				
				
				
				userTable2 = $('#userTable2').DataTable ({
					destroy: true,
			        "aaData" : data["list"],
			        "columns" : [
			            { "mDataProp" : "rnum" },
			        	{ "mDataProp" : "user_id" } ,
			            { "mDataProp" : "name" },
			            { "mDataProp" : "team" },
			            { "mDataProp" : "organization" },
			            { "mDataProp" : "position" },
			            { "mDataProp" : "phone_num" },
			            { "mDataProp" : "sex" },
			            { "mDataProp" : "birth" },
			            { "mDataProp" : "result" }
			            
			            
			        ],
					"language": {
				        "emptyTable": "데이터가 없어요." 
				    },
				    pageLength:10, //기본 데이터건수
					lengthChange: false, 	// 표시 건수기능 숨기기
					searching: false,  		// 검색 기능 숨기기
					ordering: false,  		// 정렬 기능 숨기기
					info: false,			// 정보 표시 숨기기
					paging: true, 			// 페이징 기능 숨기기
					select: {
			            style: 'single' //single, multi
					},
					
			        dom : 'Bfrtip',
			        buttons: [
			            {
			        		extend:'excel',
			        		text:'다운로드',
			        		bom:true
			        	} 
			        ]
				 });
				$('div.modal').modal(); //닫기 
			}
		}
		
		break;
	case "user/selectTeamList.do":
		
		var list = data["list"];
		for(var i=0; i<list.length; i++){
			appendSelectBox("team_id", list[i].id, list[i].name  );
			appendSelectBox("team_id_main", list[i].id, list[i].name);
		}
		
		break;
	
	case "user/selectUserList.do":
		if(data.resultCode != "0000"){
			return;
		}
		
		var list = data["list"];
		for(var i=0 ; i< list.length; i++){
			
			list[i].rnum = i+1;
			
			var phone_num = list[i].phone_num;
			
			if(phone_num != ""){
				list[i].phone_num_fomatting = phoneFomatter(phone_num);
			}
			else{
				list[i].phone_num_fomatting = "";
			}
			
			var sex = list[i].sex;
			if(sex == "M") list[i].sex_fomatting = "남성";
			else if(sex == "F") list[i].sex_fomatting = "여성";
			else list[i].sex_fomatting = "미상";
			
			var birth = list[i].birth;
			if(birth != ""){
				var birthday = new Date(birth.substring(0,2) + "/" + birth.substring(2, 4) + "/" +  birth.substring(4) );
				var today = new Date();
				var years = today.getFullYear() - birthday.getFullYear();
				 
				// Reset birthday to the current year.
				birthday.setFullYear(today.getFullYear());
				
				if (today < birthday)
				{
				    years--;
				}
				list[i].age =  years + "세";
			}
			else {
				list[i].age =  "";
			}
			
			
		}
			//phoneFomatter('01000000000')
		
		userTable = $('#userTable').DataTable ({
			destroy: true,
	        "aaData" : data["list"],
	        "columns" : [
	            { "mDataProp" : "rnum" },
	        	{ "mDataProp" : "user_id" } ,
	            { "mDataProp" : "name" },
	            { "mDataProp" : "team_name" },
	            { "mDataProp" : "organization" },
	            { "mDataProp" : "position" },
	            { "mDataProp" : "phone_num_fomatting" },
	            { "mDataProp" : "sex_fomatting" },
	            { "mDataProp" : "birth" },
	            { "mDataProp" : "age" }
	            
	            
	        ],
			"language": {
		        "emptyTable": "데이터가 없어요." 
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
	        "scrollCollapse": false,
	        "language": { "search": "검색 : " },
			
			
	        dom : 'Bfrtip',
	        buttons: [
	        	
	            {
	                text: '신규 사용자 등록',
	                action: function ( e, dt, node, config ) {
	                	userDetailTable_init();
	                	$("#user_id").focus();
	                	
	                }
	            },
	            {
	                text: '사용자 삭제',
	                className: 'red',
	                action: function ( e, dt, node, config ) {
	                	var isSelected = false;
	                    $('#userTable tr').each(function(){
		           			 if ( $(this).hasClass('selected') ){
		           				 if(confirm(userTable.row($(this)).data().name + " 을(를) 삭제하시겠습니까?")){
		           					var dataJson = {
		           						user_id : userTable.row($(this)).data().user_id
	           						};
	           						ajaxTranCall("user/deleteUser.do", dataJson, calBackS, callBackE);
		           				 }
		           				isSelected = true;;
		           			 }
	                    });
	                    if(!isSelected) alert("삭제할 사용자를 선택해주세요.");
	                }
	            },
	            {
	        		extend:'excel',
	        		text:'다운로드',
	        		bom:true
	        	},
//	        	{
//	        		text:'SFTM 다운로드',
//	        		action: function ( e, dt, node, config ) {
//	        			
//	        			var json = { "list": userTable.data()};
//	        			ajaxTranCall("user/downloadUserExcel.do", json ,calBackS, callBackE);
//	                }
//	        	
//	        	},
	            {
	                text: '업로드',
	                action: function ( e, dt, node, config ) {
	                	$('#file1').trigger('click');
	                }
	            }
	        ]
			
	    });
		//우측 사용자 상세 테이블 초기화 
		userDetailTable_init();
		
		break;
	}
	
//	{"resultCode":"0000","message":"정상적으로 조회되었습니다.","list":[{"reg_user":"nexcore","modify_user":"nexcore","description":"관리자계정입니다.","admin":true,"reg_date":1588572727418,"password":"admin","user_id":"admin","organization":"SK주식회사","name":"관리자","phone_num":"010-0000-0000","position":"수석","modify_date":1588572727418,"email":"nexcore4u@sk.com"}]}
}

var callBackE = function(tran, data){
	
}

/*
 * 우측 사용자 상세 테이블 초기화 
 */
var userDetailTable_init = function(){
	
	modal.modalClear("userDetailTable");
	$("#sex").val("M");
	$("#phone_num1").val("010");
	
	$("#btnSave").show();
	$("#btnUpdate").hide();
	$("#hearderTitle").text("신규사용자 등록");
	$("#user_id").attr("readonly",false); 
}

