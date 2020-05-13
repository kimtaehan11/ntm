package com.skcc.controller;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;

import com.skcc.service.UserService;

/**
 * @author  Barack Obama
 * @version 1.0
 * @see     Controller 
 */
@Controller
@RequestMapping("/user2")
public class UserController {

	/**
	 * log4j 선언
	 * 
	 * @see none
	 */
	private Logger log = LoggerFactory.getLogger(UserController.class);
	
	/**
	 * UserService (Autowired service)
	 * 
	 * @see Autowired
	 */
	@Autowired
	private UserService userService;

	@RequestMapping("/*.do")
	@ResponseBody
	public HashMap<String, Object> doRequest(@SessionAttribute("user") Map<String, String> authMap, HttpServletRequest req,  @RequestBody Map<String, Object> reqMap) {	
		
		// 로그인정보 사용
		log.info("userId: {}, userName: {}", authMap.get("userId"), authMap.get("userName"));
		
		HashMap<String, Object> response = null;
		Class<?>[] paramTypes = {Map.class};
		try {
			
			
			String funcName = req.getRequestURI();
			funcName = funcName.substring(funcName.lastIndexOf("/") + 1).replace(".do", "");
			Method getNameMethod  = userService.getClass().getMethod(funcName, paramTypes);
			response = (HashMap<String, Object>) getNameMethod.invoke(userService, reqMap);
			
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
	
	@RequestMapping("/*.file")     
	@ResponseBody
    public HashMap<String, Object> fileRequest( @RequestParam("file1") MultipartFile  uploadFile) throws IOException {   
		HashMap<String, Object> response = null;
		
        return (HashMap<String, Object>) userService.saveUserExcel(uploadFile);
    }
	

}
