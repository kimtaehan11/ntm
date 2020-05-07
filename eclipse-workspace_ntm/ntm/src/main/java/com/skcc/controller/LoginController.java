package com.skcc.controller;

import java.util.HashMap;
import java.util.Map;

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
	public HashMap<String, Object> hello( @RequestBody Map<String, Object> reqMap ) {	
		HashMap<String, Object> response = (HashMap<String, Object>) userService.login(reqMap);
		return response; 
	}
	
	
}
