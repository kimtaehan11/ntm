package com.skcc.controller;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.skcc.service.CodeService;
import com.skcc.service.DefectService;
import com.skcc.service.ScenarioService;
import com.skcc.service.UserService;

/**
 * @author  Barack Obama
 * @version 1.0
 * @see     Controller 
 */
@Controller 
public class SkccController {
	
	/**
	 * log4j 선언
	 * 
	 * @see none
	 */
	private Logger log = LoggerFactory.getLogger(SkccController.class);

	/**
	 * UserService
	 * 
	 * @see Autowired
	 */
	@Autowired
	private CodeService codeService;
	@Autowired
	private DefectService defectService;
	@Autowired
	private ScenarioService scenarioService;
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
	@RequestMapping("/*.do")
	@ResponseBody
	public HashMap<String, Object> doRequest(@SessionAttribute("user") Map<String, String> authMap, HttpServletRequest req,  @RequestBody Map<String, Object> reqMap) {	
		
		
		HashMap<String, Object> response = null;
		Class<?>[] paramTypes = {Map.class};
		try {
			
			String reqUrl = req.getRequestURI();
			
			log.info("reqUrl : " +reqUrl);
			String funcName = reqUrl.substring(reqUrl.lastIndexOf("/") + 1).replace(".do", "");
			
			
			Method getNameMethod  = codeService.getClass().getMethod(funcName, paramTypes);
			response = (HashMap<String, Object>) getNameMethod.invoke(codeService, reqMap);
			
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		
		return response; 
	}
	
	
}