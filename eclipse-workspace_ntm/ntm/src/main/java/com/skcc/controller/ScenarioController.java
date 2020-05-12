package com.skcc.controller;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.skcc.service.ScenarioService;

/**
 * @author  Barack Obama
 * @version 1.0
 * @see     Controller 
 */
@Controller
@RequestMapping("/scenario")
public class ScenarioController {

	/**
	 * log4j  
	 * 
	 * @see none
	 */
	private Logger log = LoggerFactory.getLogger(ScenarioController.class);
	
	/**
	 * UserService (Autowired service)
	 * 
	 * @see Autowired
	 */
	@Autowired
	private ScenarioService service;

	@RequestMapping("/*.do")
	@ResponseBody
	public HashMap<String, Object> searchUserList(HttpServletRequest req,  @RequestBody Map<String, Object> reqMap) {	
		
		HashMap<String, Object> response = null;
		Class<?>[] paramTypes = {Map.class};
		try {
			
			
			String funcName = req.getRequestURI();
			funcName = funcName.substring(funcName.lastIndexOf("/") + 1).replace(".do", "");
			Method getNameMethod  = service.getClass().getMethod(funcName, paramTypes);
			response = (HashMap<String, Object>) getNameMethod.invoke(service, reqMap);
			
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
