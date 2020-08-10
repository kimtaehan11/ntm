/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

function getUrlParams() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
}



function appendSelectBox(obj, key, value){
	$('#' +obj).append("<option value='"+key+"'>"+value+"</option>" );
}
function appendSelectBox2(obj, key, value){
	obj.append("<option value='"+key+"'>"+value+"</option>" );
}
function htmlSelectBox(obj, key, value){
	$('#' +obj).html("<option value='"+key+"'>"+value+"</option>" );
}
function htmlSelectBox2(obj, key, value){
	obj.html("<option value='"+key+"'>"+value+"</option>" );
}

var table = {};
table.getSelectedRowData = function(obj){
	
}


var modal = {};

/*
 * 필수값 체크 로직입니다.
 * 테이블명 입력하시면 됩니다. 
 * 필수값 class required 추가 하시고
 */
modal.modalCheckInputData = function(obj){
	
	var result = true;
	$("#"+obj+" tbody tr td").each(function(){
		var element =  $(this).children().first();
		var type = element.prop('nodeName');
		
		var isRequired = element.hasClass("required");
	    if(isRequired){
			var value = element.val();
			if(value == ""){
				alert("필수 입력값을 입력해주세요.");
				element.focus();
				result = false;
				return false;
			}
		}
	});
	
	return result;
}

modal.modalClear = function(obj){
	$('#' +obj +' input').each(function(){
		$(this).val("");
	});
	$('#' +obj +' select').each(function(){
		$(this).val("");
	});
}

modal.convertModalToJsonObj= function(obj){
	
	var resultJson = {};
	$('#' +obj +' input').each(function(){
		resultJson[$(this).attr('id')] = $(this).val();
	});
	$('#' +obj +' select').each(function(){
		resultJson[$(this).attr('id')] = $(this).val();
	});
	$('#' +obj +' textarea').each(function(){
		resultJson[$(this).attr('id')] = $(this).val();
	});
	return resultJson;
}


modal.convertJsonObjToModal = function(obj, jsonObj){
	
	$('#' +obj +' input').each(function(){
		$(this).val(jsonObj[$(this).attr('id')]);
	});
	$('#' +obj +' select').each(function(){
		if(jsonObj[$(this).attr('id')] != null)
			$(this).val(jsonObj[$(this).attr('id')]);
	});
	$('#' +obj +' textarea').each(function(){
		$(this).val(jsonObj[$(this).attr('id')]);
	});
}


function getCookie(cookie_name) {
	var x, y;
	var val = document.cookie.split(';');

	for (var i = 0; i < val.length; i++) {
		x = val[i].substr(0, val[i].indexOf('='));
		y = val[i].substr(val[i].indexOf('=') + 1);
		x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
		if (x == cookie_name) {
			return unescape(y); // unescape로 디코딩 후 값 리턴
		}
	}
}

function setCookie(cookie_name, value, days) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + days);
	// 설정 일수만큼 현재시간에 만료값으로 지정

	var cookie_value = escape(value)
			+ ((days == null) ? '' : ';    expires=' + exdate.toUTCString());
	document.cookie = cookie_name + '=' + cookie_value;
}



function getFileUrl(id, seq){
	
	return location.protocol + "//" + location.host + "/ntm/common/uploadFile.filedown?imgkey=" + id + "&seq=" + seq;
}

/*
 * phoneFomatter('01000000000');   //010-0000-0000
 * phoneFomatter('01000000000',0); //010-****-0000
 * phoneFomatter('0100000000');    //010-000-0000
 */
function phoneFomatter(num,type){

    var formatNum = '';
    
    try{
	    if(num.length==11){
	        if(type==0){
	            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
	        }else{
	            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
	        }
	    }else if(num.length==8){
	        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
	    }else{
	        if(num.indexOf('02')==0){
	            if(type==0){
	                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
	            }else{
	                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
	            }
	        }else{
	
	            if(type==0){
	                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
	            }else{
	                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
	            }
	        }
	    }
    }catch(e){
    	
    }
    return formatNum;

}