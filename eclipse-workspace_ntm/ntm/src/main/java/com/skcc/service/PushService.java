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
public class PushService {

	private Logger log = LoggerFactory.getLogger(PushService.class);
	
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	
	
	public boolean insertPushmsg( int id ) {
		
		try {
			List<Object> list = sqlSession.selectList("DefectDAO.selectDefectById", id);
			
			if(list.size() != 1) {
				
			}
			
			//PUSH로 사용자에게 알려줌
			Map<String, Object> pushMap = (Map<String, Object>) list.get(0);
			sqlSession.insert("PushDAO.insertPushDev", pushMap);
			sqlSession.insert("PushDAO.insertPushTest", pushMap);
			
		}
		catch(Exception e) {
			return false;
		}
		return true;
	}

	
}
