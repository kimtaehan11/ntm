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
	
	
	
	private String getCellString(XSSFCell cell) {
		
		String resultStr = "";
		if(null != cell) {
		
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
				resultStr = cell.getBooleanCellValue() + "";
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
                tempMap.put("name", 		getCellString(row.getCell(2)));
                tempMap.put("team", 		getCellString(row.getCell(3)));
                tempMap.put("organization", getCellString(row.getCell(4)));
                tempMap.put("phone_num", 		getCellString(row.getCell(5)));
                tempMap.put("organization",			getCellString(row.getCell(6)));
                tempMap.put("email", 		getCellString(row.getCell(7)));
                tempMap.put("description", 	getCellString(row.getCell(8)));
                
                //예외처리 
                tempMap.put("user_id", tempMap.get("user_id").toString().replace(".0", ""));
                
                
                if("".equals( tempMap.get("user_id"))) {
                	 tempMap.put("result", "-1");
                     arrayList.add(tempMap);
                     continue;
                }
                tempMap.put("reg_user", "admin");
                int result = sqlSession.insert("UserDAO.upsertUser", tempMap);
                tempMap.put("result", result);
                arrayList.add(tempMap);
                
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
}
