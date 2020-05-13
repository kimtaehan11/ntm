package com.skcc.service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.skcc.util.Message;


/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 */
@Service
public class DefectService {

	private Logger log = LoggerFactory.getLogger(DefectService.class);
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	
	@Value("${file.path}") private String file_Path;

	 
//	@Autowired
//	private ImgService imgService;
	//selectExcuteList
	public Map<String, Object> selectDefectList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("DefectDAO.selectDefectList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}

	@Transactional 
	public Map<String, Object> insertDefect( Map<String, Object> reqMap ) {	
			
		Map<String, Object> response = new HashMap<String, Object>();
		
		int result = sqlSession.insert("DefectDAO.insertDefect", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "insert");
		}
		return response;
	}
	
	public Map<String, Object> updateDefect( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();
		
		int result = sqlSession.insert("DefectDAO.updateDefect", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "update");
		}
		return response;
	}
	
	
	
	public Map<String, Object> selectDefectDetail( Map<String, Object> reqMap ) {	
		
		
		//1. image key로 이미지 조회 합니다. 
		int imgkey = (Integer) reqMap.get("imgkey");
		List<Object> list = sqlSession.selectList("ImgDAO.selectImgById", imgkey);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	
}
