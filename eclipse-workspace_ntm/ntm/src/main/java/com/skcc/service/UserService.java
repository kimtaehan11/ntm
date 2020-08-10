package com.skcc.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

//import com.skcc.controller.UserController;


/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 */
@Service
public class UserService {

	private Logger log = LoggerFactory.getLogger(UserService.class);
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
		
		log.debug("list.size() ; " + list.size());
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
	
	
	/*
	 * Team List 조회 로직
	 */
	public Map<String, Object> selectTeamList( Map<String, Object> reqMap ) {	
		
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
	public Map<String, Object> insertNewTeam( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		reqMap.put("project_id", 0);
		reqMap.put("reg_user", "admin");
		reqMap.put("modify_user", "admin");
		
		log.error("role_code : " + reqMap.get("role_code"));
		
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
		if(result > -1) {
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
	
	public Map<String, Object> selectUserList( Map<String, Object> reqMap ) {	
	
		List<Object> list = sqlSession.selectList("UserDAO.selectUserList", reqMap);
		
//		position
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
	public Map<String, Object> insertUser( Map<String, Object> reqMap ) {	
		
		
//		birth: "222222"
//		cookieUserId: "D011"
//		name: "22222"
//		organization: "222"
//		password: "2222"
//		phone_num: "010222222"
//		phone_num1: "010"
//		phone_num2: "222222"
//		position: "222"
//		sex: "M"
//		team_id: "8"
//		user_id: "T2222"
		
		Map<String, Object> response = new HashMap<String, Object>();

		reqMap.put("project_id", 0);
		reqMap.put("reg_user", 		reqMap.get("cookieUserId"));
		reqMap.put("modify_user",   reqMap.get("cookieUserId"));
		
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
	
	
	
	private String getCellString(XSSFCell cell) {
		
		String resultStr = "";
		
		
		if(null != cell) {
			log.debug("cell.getCellType() : " + cell.getCellType());
			switch(cell.getCellType()) {
			
			case FORMULA:
				resultStr = cell.getCellFormula();
				break;
				
			case STRING:
				resultStr = cell.getStringCellValue() + "";
				break;
				
			case NUMERIC:
				resultStr = cell.getNumericCellValue() + "";
				break;
				
			case BLANK:
				resultStr =  "";
				break;
				
			case ERROR:
				resultStr = cell.getErrorCellString() + "";
				break;
			}
		}
		
		
		return resultStr;
	}

	public Map<String, Object> saveUserExcel(MultipartFile excelFile) {
		
		Map<String, Object> response = new HashMap<String, Object>();
		ArrayList<Map<String, Object> > arrayList = new ArrayList<Map<String, Object> >();
		try {
			OPCPackage opcPackage = OPCPackage.open(excelFile.getInputStream());
			XSSFWorkbook workbook = new XSSFWorkbook(opcPackage);
			// 첫번째 시트 불러오기
            XSSFSheet sheet = workbook.getSheetAt(0);
            
            for(int i=2; i<sheet.getLastRowNum() + 1; i++) {
            	
            	Map<String, Object> tempMap = new HashMap<String, Object>();
            		
                XSSFRow row = sheet.getRow(i);
                // 행이 존재하기 않으면 패스
                if(null == row) {
                    continue;
                }
                
                // 행의 두번째 열(이름부터 받아오기) 
                tempMap.put("user_id", 			getCellString(row.getCell(1)));
                tempMap.put("name", 			getCellString(row.getCell(2)));
                tempMap.put("team", 			getCellString(row.getCell(3)));
                tempMap.put("organization", 	getCellString(row.getCell(4)));
                tempMap.put("position",			getCellString(row.getCell(5)));
                tempMap.put("phone_num", 		getCellString(row.getCell(6)));
                tempMap.put("sex", 				getCellString(row.getCell(7)));
                tempMap.put("birth", 			getCellString(row.getCell(8)));
                

                log.debug(" getCellString(row.getCell(1) : " + getCellString(row.getCell(1)));
                log.debug(" getCellString(row.getCell(6) : " + getCellString(row.getCell(6)));
                
                
                //예외처리 
                tempMap.put("user_id", tempMap.get("user_id").toString().replace(".0", ""));
               
                
                String tempSex = (String) tempMap.get("sex");
                
                if("".equals( tempMap.get("user_id"))) {
                	 tempMap.put("result", "사용자 아이디가 없습니다.");
                     arrayList.add(tempMap);
                     continue;
                }
                
                if("".equals( tempMap.get("name"))) {
                	tempMap.put("result", "사용자 이름이 없습니다.");
                    arrayList.add(tempMap);
                    continue;
                }
                
                if("".equals( tempMap.get("birth"))) {
                	
                	 
                	tempMap.put("result", "사용자 셍년월일이 없습니다.");
                    arrayList.add(tempMap);
                    continue;
                }
                else {
                	tempMap.put("birth", tempMap.get("birth").toString().replace(".0", ""));
                }
                
                if("".equals( tempMap.get("sex"))) {
                	tempMap.put("sex", "T");
                }
                else {
                	
                	if(tempSex.indexOf("남") != -1) {
                    	tempMap.put("sex", "M");
                	}
                	else if(tempSex.indexOf("여") != -1) {
                    	tempMap.put("sex", "F");
                	}
                	else {
                		tempMap.put("sex", "T");
                	}
                }
                if(!"".equals( tempMap.get("phone_num"))) {
                	String tempphone_num = (String) tempMap.get("phone_num");
                	if(tempphone_num.equals("false")) {
                		tempMap.put("phone_num", "");
                	}
                	log.debug("tempphone_num : " + tempphone_num);
                	tempMap.put("phone_num", tempphone_num.replaceAll("-", ""));
                }
                	
                
                
                tempMap.put("reg_user", "admin");
                int result = sqlSession.insert("UserDAO.upsertUser", tempMap);
                if(result == -1) {
                	tempMap.put("result", "원인불명");
                	arrayList.add(tempMap);
                }
                tempMap.put("result", result);
                
            }
            
            
		} catch (Exception e) {
			e.printStackTrace();
		}
		// TODO Auto-generated method stub
		response.put("resultCode", "0000");
		response.put("message", "정상적으로 저장되었습니다.");
		response.put("list", arrayList);
		
		
		return response;
	}
	
	
	public Map<String, Object> updateTeamReader( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		
		int result = sqlSession.insert("UserDAO.updateTeamReader", reqMap);
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
	
	public Map<String, Object> selectTeamUserList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("UserDAO.selectTeamUserList", reqMap);
		
//		position
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
	//
}
