package com.skcc.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.skcc.service.UserService;

/**
 * @author  Barack Obama
 * @version 1.0
 * @see     Controller 
 */
@Controller
public class LoginController {
	
	/**
	 * log4j 선언
	 * 
	 * @see none
	 */
	private Logger log = LoggerFactory.getLogger(LoginController.class);

	/**
	 * UserService
	 * 
	 * @see Autowired
	 */
	@Autowired
	private UserService userService;

	
	/**
     * 로그인 트랜잭션
     *
     * @param     reqMap  http요청 request
     * @return    http요청 response  
     * @exception 
     * @see       
     */
	@RequestMapping("/login.do")
	@ResponseBody
	public HashMap<String, Object> loginTran( HttpSession session, @RequestBody Map<String, Object> reqMap ) {	
		HashMap<String, Object> response = (HashMap<String, Object>) userService.login(reqMap);
		/*
		 * login 처리
		 */
		if(response != null && "0000".equals(response.get("resultCode"))){
			Map<String, String> authMap = new HashMap<String, String>();
			authMap.put("userId", (String)response.get("user_id"));
			authMap.put("userName", (String)response.get("name"));
			// TODO: User권한 정보 추가
			
			session.setAttribute("user", authMap);
			// Controller 내 메소드 사용예시
			// @SessionAttribute("user") Map<String, String> authMap 
		}
		
		return response; 
	}
	
	
}