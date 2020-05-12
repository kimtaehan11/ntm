package com.skcc.util;

import java.util.Map;

public class Message {

	public static void SetSuccesMsg() {
		
	}

	public static void SetSuccesMsg(Map<String, Object> response, String crud) {
		// TODO Auto-generated method stub
		
		if("insert".equals(crud)){
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else if("select".equals(crud)){
			response.put("message", "정상적으로 조회되었습니다.");
		}
		else if("update".equals(crud)){
			response.put("message", "정상적으로 수정되었습니다.");
		}
		else if("delete".equals(crud)){
			response.put("message", "정상적으로 삭제되었습니다.");
		}
		response.put("resultCode", "0000");
	}
}
