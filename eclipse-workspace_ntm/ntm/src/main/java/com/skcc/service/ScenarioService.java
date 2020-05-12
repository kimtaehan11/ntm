package com.skcc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skcc.controller.UserController;
import com.skcc.util.Message;

/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 */
@Service
public class ScenarioService {
	private Logger log = LoggerFactory.getLogger(ScenarioService.class);
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	
	public Map<String, Object> searchDivList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("ScenarioDAO.selectScenarioList", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() > -2) { 
			response.put("list", list);
			Message.SetSuccesMsg(response, "select");
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "조회에 실패하였습니다..");
		}
		response.put("depth", reqMap.get("depth"));
		return response;
	}
	
	public Map<String, Object> searchDivListWithCombo( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("ScenarioDAO.selectScenarioList", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() > -2) { 
			response.put("list", list);
			Message.SetSuccesMsg(response, "select");
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "조회에 실패하였습니다..");
		}
		response.put("depth", reqMap.get("depth"));
		return response;
	}
	
	
	public Map<String, Object> insertDivision( Map<String, Object> reqMap ) {	
		
		String depth = (String) reqMap.get("depth");
		//{"name":"ㅅㄷㄴㅅ2","selectA":"A0003","selectB":"","depth":"B"}
		if("C".equals(depth)) {
			reqMap.put("upcode", reqMap.get("selectB") );
		}
		else if("B".equals(depth)) {
			reqMap.put("upcode", reqMap.get("selectA") );
		}
		else{
			reqMap.put("upcode", "" );
		}
		Map<String, Object> response = new HashMap<String, Object>();
		int result = sqlSession.insert("ScenarioDAO.insertDivision", reqMap);
		if(result == 1) {
			Message.SetSuccesMsg(response, "insert");
		}
		
		return response;
	}
	
	//
	
	public Map<String, Object> updateDivision( Map<String, Object> reqMap ) {	
		
		//TYPE A {"name":"PRM24","selectA":"","selectB":"","depth":"A","id":"A0011"}
		//TYPE B {"name":"업무공통2","selectA":"A0003","selectB":"","depth":"B","id":"B0014"}
		//TYPE C {"name":"1234","selectA":"A0003","selectB":"B0006","depth":"C"}
		String depth = (String) reqMap.get("depth");
		
		
		if("C".equals(depth)) {
			reqMap.put("upcode", reqMap.get("selectB") );
		}
		else if("B".equals(depth)) {
			reqMap.put("upcode", reqMap.get("selectA") );
		}
		else {
			reqMap.put("upcode", "" );
		}
		
		int result = sqlSession.insert("ScenarioDAO.updateDivision", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		if(result == 1) {
			Message.SetSuccesMsg(response, "insert");
		}
		
		return response;
	}
	
	public Map<String, Object> deleteDivision( Map<String, Object> reqMap ) {	
		

		//SELECT div.* 
		//FROM
		//ntm_schemas.itm_div div
		//WHERE id = 'A0003'
		//OR UPCODE = 'A0003'
		//OR UPCODE IN (SELECT ID FROM ntm_schemas.itm_div indiv WHERE indiv.upcode = 'A0003')

		String depth = (String) reqMap.get("depth");
		
		
		if("C".equals(depth)) {
			reqMap.put("upcode", reqMap.get("selectB") );
		}
		else if("B".equals(depth)) {
			reqMap.put("upcode", reqMap.get("selectA") );
		}
		else {
			reqMap.put("upcode", "" );
		}
		
		int result = sqlSession.insert("ScenarioDAO.deleteDivision", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		if(result == 1) {
			Message.SetSuccesMsg(response, "insert");
		}
		
		return response;
	}
	
	//시나리오 리스트 조회
	public Map<String, Object> selectScenario( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("ScenarioDAO.selectScenario", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() > -2) { 
			response.put("list", list);
			Message.SetSuccesMsg(response, "select");
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "조회에 실패하였습니다..");
		}
		response.put("depth", reqMap.get("depth"));
		return response;
	}
	
	//시나리오 추가 
	//{"scenario_code":"","scenario_name":"","description":"","modalSelectA":"","modalSelectB":"","modalSelectC":""}
	public Map<String, Object> insertScenario( Map<String, Object> reqMap ) {	
	
		
		String modalSelectC = (String) reqMap.get("modalSelectC");
		if(modalSelectC != null && !"".equals(modalSelectC) ) {
			reqMap.put("div_id", modalSelectC );
		}
		
		Map<String, Object> response = new HashMap<String, Object>();
		int result = sqlSession.insert("ScenarioDAO.insertScenario", reqMap);
		if(result == 1) {
			Message.SetSuccesMsg(response, "insert");
		}
		
		return response;
	}
	//시나리오 수정 : updateScenario
	//{"scenario_code":"CLUP0003","scenario_name":"CLUP0003_좌표수신 10초마다2","description":"CLUP0003_좌표수신 10초마다","modalSelectA":"A0022","modalSelectB":"B0025","modalSelectC":"C0026"}
	public Map<String, Object> updateScenario( Map<String, Object> reqMap ) {	
	
		
		String modalSelectC = (String) reqMap.get("modalSelectC");
		if(modalSelectC != null && !"".equals(modalSelectC) ) {
			reqMap.put("div_id", modalSelectC );
		}
		
		Map<String, Object> response = new HashMap<String, Object>();
		int result = sqlSession.insert("ScenarioDAO.updateScenario", reqMap);
		if(result == 1) {
			Message.SetSuccesMsg(response, "insert");
		}
		
		return response;
	}
	
	/**
	 * 메서드의 기능설명은 한 두줄로 간결하게..
	 *
	 * @param Map (request)
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public Map<String, Object> selectTestCaseList( Map<String, Object> reqMap ) {	
	
		Map<String, Object> response = new HashMap<String, Object>();
		
		try {
			List<Object> list = sqlSession.selectList("ScenarioDAO.selectTestCaseList", reqMap);
			
			if(list.size() != -1) {
				Message.SetSuccesMsg(response, "select");
				response.put("list", list);
			}
		}
		catch(Exception e) {
//			Message.SetSuccesMsg(response, "select");
		}
		
		return response;
	}
	
	/**
	 * 시나리오 삭제 (하위 테스트케이도 삭제됨)
	 *
	 * @param Map (request)
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	@Transactional 
	public Map<String, Object> deleteScenario( Map<String, Object> reqMap ) {
		
		Map<String, Object> response = new HashMap<String, Object>();
		try {
			
			int result1 = sqlSession.update("ScenarioDAO.deleteTestcaseByUp", reqMap);
			int result2 = sqlSession.update("ScenarioDAO.deleteScenario", reqMap);
			if(result2 == 1) {
				Message.SetSuccesMsg(response, "insert");
			}
		}
		catch(Exception e) {
//			Message.SetSuccesMsg(response, "select");
		}
		
		return response;
	}

	
	/**
	 * 테스트케이스 신규 등록
	 *
	 * @param Map (request)
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public Map<String, Object> insertTestcase( Map<String, Object> reqMap ) {	
	
		Map<String, Object> response = new HashMap<String, Object>();
		//{"tc_scenario_code":"CLUZ0922U","tc_scenario_name":"CLUZ0922U_환경설정2",
		//"testcase_code":"A_test001","testcase_name":"테스트케이스 99",
		//"tester":"N00002","tester_nm":"유관순","developer":"N00001","developer_nm":"홍길동"}
		reqMap.put("scenario_code", reqMap.get("tc_scenario_code"));
		reqMap.put("testcase_code", reqMap.get("testcase_code"));
		reqMap.put("testcase_name", reqMap.get("testcase_name"));
		reqMap.put("tester_id", reqMap.get("tester"));
		reqMap.put("dev_id", reqMap.get("developer"));
		reqMap.put("description", reqMap.get("tc_description"));
		
		
		try {
			int result = sqlSession.insert("ScenarioDAO.insertTestcase", reqMap);
			if(result == 1) {
				Message.SetSuccesMsg(response, "insert");
			}
		}
		catch(Exception e) {
//			Message.SetSuccesMsg(response, "select");
		}
		
		return response;
	}
	
	/**
	 * 테스트케이스 UPDATE
	 *
	 * @param Map (request)
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public Map<String, Object> updateTestcase( Map<String, Object> reqMap ) {	
			
		Map<String, Object> response = new HashMap<String, Object>();
		reqMap.put("scenario_code", reqMap.get("tc_scenario_code"));
		reqMap.put("case_code", reqMap.get("testcase_code"));
		reqMap.put("case_name", reqMap.get("testcase_name"));
		reqMap.put("tester_id", reqMap.get("tester"));
		reqMap.put("dev_id", reqMap.get("developer"));
		reqMap.put("description", reqMap.get("tc_description"));
		try {
			int result = sqlSession.update("ScenarioDAO.updateTestcase", reqMap);
			if(result == 1) {
				Message.SetSuccesMsg(response, "insert");
			}
		}
		catch(Exception e) {
//			Message.SetSuccesMsg(response, "select");
		}
		return response;
		
	}

	/**
	 * 테스트케이스 삭제
	 *
	 * @param Map (request)
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public Map<String, Object> deleteTestcase( Map<String, Object> reqMap ) {
		
		Map<String, Object> response = new HashMap<String, Object>();
		try {
			int result = sqlSession.update("ScenarioDAO.deleteTestcase", reqMap);
			if(result == 1) {
				Message.SetSuccesMsg(response, "insert");
			}
		}
		catch(Exception e) {
//			Message.SetSuccesMsg(response, "select");
		}
		
		return response;
	}
}
