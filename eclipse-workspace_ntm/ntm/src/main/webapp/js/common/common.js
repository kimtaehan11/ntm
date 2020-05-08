/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */
function appendSelectBox(obj, key, value){
	$('#' +obj).append("<option value='"+key+"'>"+value+"</option>" );
}
function htmlSelectBox(obj, key, value){
	$('#' +obj).html("<option value='"+key+"'>"+value+"</option>" );
}


var table = {};
table.getSelectedRowData = function(obj){
	
}


var modal = {};
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
	return resultJson;
}


modal.convertJsonObjToModal = function(obj, jsonObj){
	$('#' +obj +' input').each(function(){
		$(this).val(jsonObj[$(this).attr('id')]);
	});
	$('#' +obj +' select').each(function(){
		$(this).val(jsonObj[$(this).attr('id')]);
	});
}