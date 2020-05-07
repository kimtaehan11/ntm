package com.skcc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skcc.controller.UserController;


/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 */
@Service
public class UserService {

	private Logger log = LoggerFactory.getLogger(UserController.class);
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	 
	public Map<String, Object> login( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("UserDAO.selectUser", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() ==1) { 
			response =  ( Map<String, Object>) list.get(0);
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 로그인 되었습니다.");
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "로그인에 실패했습니다.");
		}
		return response;
	}
	
	
	public Map<String, Object> searchTeamList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("UserDAO.selectTeamList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 조회되었습니다.");
			response.put("list", list);
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 조회에 실패했습니다.");
		}
		return response;
	}
	
	public Map<String, Object> searchRoleList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("UserDAO.selectRoleList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 조회되었습니다.");
			response.put("list", list);
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 조회에 실패했습니다.");
		}
		return response;
	}
	
	@Transactional 
	public Map<String, Object> saveNewTeam( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		reqMap.put("project_id", 0);
		reqMap.put("reg_user", "admin");
		reqMap.put("modify_user", "admin");
		
		int result = sqlSession.insert("UserDAO.insertNewTeam", reqMap);
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	
	@Transactional 
	public Map<String, Object> updateTeamInfo( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		reqMap.put("modify_user", "admin");
		
		int result = sqlSession.update("UserDAO.updateTeam", reqMap);
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	@Transactional 
	public Map<String, Object> deleteTeamInfo( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		
		

		int result = sqlSession.update("UserDAO.deleteUserByTeam", reqMap);
		
		
		if(result > 0) {
			 result = sqlSession.update("UserDAO.deleteTeam", reqMap);
		}
		else {
			
		}
		
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	
	public Map<String, Object> searchUserList( Map<String, Object> reqMap ) {	
	
		List<Object> list = sqlSession.selectList("UserDAO.selectUserList", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 조회되었습니다.");
			response.put("list", list);
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 조회에 실패했습니다.");
		}
		return response;
	}
	
	@Transactional 
	public Map<String, Object> saveUser( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		reqMap.put("project_id", 0);
		reqMap.put("reg_user", "admin");
		reqMap.put("modify_user", "admin");
		
		int result = sqlSession.insert("UserDAO.insertUser", reqMap);
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	
	@Transactional 
	public Map<String, Object> deleteUser( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		int result = sqlSession.update("UserDAO.deleteUser", reqMap);
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	
	@Transactional 
	public Map<String, Object> updateUser( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		reqMap.put("modify_user", "admin");
		
		int result = sqlSession.insert("UserDAO.updateUser", reqMap);
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
}
