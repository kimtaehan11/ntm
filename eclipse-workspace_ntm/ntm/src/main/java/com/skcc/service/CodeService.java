package com.skcc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.skcc.util.Message;


/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 */
@Service
public class CodeService {

	private Logger log = LoggerFactory.getLogger(CodeService.class);
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	
	public Map<String, Object> selectCodeGroupList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("CodeDAO.selectCodeGroupList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	 
	public Map<String, Object> selectCodeList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("CodeDAO.selectCodeList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			
			response.put("code_group", reqMap.get("code_group"));
			response.put("list", list);
		}
		return response;
	}
	
	/*
	 * 코드그룹 신규등록
	 */
	public Map<String, Object> insertCodeGroup( Map<String, Object> reqMap ) {	
	
		
		Map<String, Object> response = new HashMap<String, Object>();
		int result = sqlSession.insert("CodeDAO.insertCodeGroup", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "insert");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	/*
	 * 코드그룹 수정
	 */
	public Map<String, Object> updateCodeGroup( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();

		int result = sqlSession.update("CodeDAO.updateCodeGroup", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "update");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	
	/*
	 * 코드그룹 신규등록
	 */
	public Map<String, Object> insertCode( Map<String, Object> reqMap ) {	
	
		
		Map<String, Object> response = new HashMap<String, Object>();
		int result = sqlSession.insert("CodeDAO.insertCode", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "insert");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	/*
	 * 코드그룹 수정
	 */
	public Map<String, Object> updateCode( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();

		int result = sqlSession.update("CodeDAO.updateCode", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "update");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
}
