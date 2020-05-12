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
	public Map<String, Object> insertDefect(MultipartHttpServletRequest mtfRequest) {
		
		String fileLength = mtfRequest.getParameter("fileLength");
		if(fileLength == null) {
			fileLength = "0";
		}
		 
		int count = Integer.parseInt(mtfRequest.getParameter("fileLength"));
		int resImgKey = -1;
		if(count > 0) {
			
			
			//이미지키 조회
			//key는 중복처리 되지 않게 커밋 작업
			resImgKey = sqlSession.selectOne("ImgDAO.selectImgId"); 
			
			for (int i = 0; i < count; i++) {
				
				Map<String, Object> reqMap = new HashMap<String, Object>();
				MultipartFile mf = mtfRequest.getFile("file" + i);
				
				
				String originFileName = mf.getOriginalFilename(); // 원본 파일 명
				long fileSize = mf.getSize(); // 파일 사이즈

				System.out.println("originFileName : " + originFileName);
				System.out.println("fileSize : " + fileSize);
				System.out.println("file_Path : " + mtfRequest.getSession().getServletContext().getRealPath("/"));
				
				
				String[] fileNameList = originFileName.split("\\.");
				String ext = "";
				
				if(fileNameList.length > 1) {
					ext = fileNameList[fileNameList.length-1];
				}
				String safeFile = mtfRequest.getParameter("user_id") + "_" + System.currentTimeMillis() + "." + ext;
				SimpleDateFormat mSimpleDateFormat = new SimpleDateFormat ( "yyyyMMdd", Locale.KOREA );
				Date currentTime = new Date ();
				String mTime = mSimpleDateFormat.format ( currentTime );

				
				reqMap.put("id", resImgKey);
				reqMap.put("tbName", "itm_defect");
				reqMap.put("tbDate", mTime);
				reqMap.put("saveFileName", safeFile);
				reqMap.put("originFileName", originFileName);
				reqMap.put("fileLength", fileSize);
				reqMap.put("user_id", mtfRequest.getParameter("user_id"));
				reqMap.put("ext", ext);
				
					
				try {
					mf.transferTo(new File(file_Path + "//" + safeFile));
					int result = sqlSession.insert("ImgDAO.insertImg", reqMap);
					
				} catch (IllegalStateException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			} // for(int i=0; i< count ; i++) {		
					
		}
	
		
			
			
		Map<String, Object> reqMap2 = new HashMap<String, Object>();
		reqMap2.put("title", 			mtfRequest.getParameter("title"));
		reqMap2.put("test_type_id", 	mtfRequest.getParameter("test_type_id"));
		reqMap2.put("description", 		mtfRequest.getParameter("description"));
		reqMap2.put("scenario_code", 	mtfRequest.getParameter("scenario_code"));
		reqMap2.put("case_code", 		mtfRequest.getParameter("case_code"));
		reqMap2.put("user_id", 			mtfRequest.getParameter("user_id"));
		reqMap2.put("imgkey",  			resImgKey);
		
		int result = sqlSession.insert("DefectDAO.insertDefect", reqMap2);
		if(result == 1) { 
			Message.SetSuccesMsg(reqMap2, "insert");
		}
		return reqMap2;
	}
	
	public Map<String, Object> selectDefectDetail( Map<String, Object> reqMap ) {	
		
		
		//1. image key로 이미지 조회 합니다. 
		int imgkey = (Integer) reqMap.get("imgkey");
		
		log.info("imgkey : "   + imgkey);
		
		
		List<Object> list = sqlSession.selectList("ImgDAO.selectImgById", imgkey);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
}
