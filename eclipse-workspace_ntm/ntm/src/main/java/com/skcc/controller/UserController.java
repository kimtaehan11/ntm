package com.skcc.controller;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.skcc.service.UserService;

/**
 * @author  Barack Obama
 * @version 1.0
 * @see     Controller 
 */
@Controller
@RequestMapping("/user")
public class UserController {

	/**
	 * log4j ¼±¾ð
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
	public HashMap<String, Object> searchUserList(HttpServletRequest req,  @RequestBody Map<String, Object> reqMap) {	
		
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
    public HashMap<String, Object> submitReport1( @RequestParam("file1") MultipartFile  uploadFile) throws IOException {   
		HashMap<String, Object> response = null;
		
        return (HashMap<String, Object>) userService.saveUserExcel(uploadFile);
    }
	

}
