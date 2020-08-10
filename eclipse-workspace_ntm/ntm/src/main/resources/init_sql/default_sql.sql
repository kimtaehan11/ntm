SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
 
  
INSERT INTO sftm.itm_user
( user_id, password, "name", phone_num, email, organization, "position", description, reg_user, reg_date, modify_user, modify_date, admin)
VALUES(  'admin', 'admin', '김태한', '010-0000-0000', 'nexcore4u@sk.com', 'SKCC', '1234', '123455', 'nexcore', now(), 'nexcore', now(),'TRUE');

INSERT INTO sftm.itm_role  VALUES ( 0, 'ADMIN', 	'관리자', '', 'admin',  now(), 'admin',now() );
INSERT INTO sftm.itm_role  VALUES ( 0, 'TESTER', 	'테스터', '', 'admin',  now(), 'admin',now() );
INSERT INTO sftm.itm_role  VALUES ( 0, 'DEV', 		'개발자', '', 'admin',  now(), 'admin',now() );
INSERT INTO sftm.itm_role  VALUES ( 0, 'ETC', 	     '기타', '', 'admin',  now(), 'admin',now() );


--itm_code_group
INSERT INTO sftm.itm_code_group
		(code_group, code_group_name, description, use_yn, reg_user, reg_date)
VALUES ('A001', '결함유형', '결함등록시 저장되는 유형', 'Y', 'admin', now());

INSERT INTO sftm.itm_code_group
		(code_group, code_group_name, description, use_yn, reg_user, reg_date)
VALUES ('B001', '결함상태', '결함에 상태에 대한 표기', 'Y', 'admin', now());

INSERT INTO sftm.itm_code_group
		(code_group, code_group_name, description, use_yn, reg_user, reg_date)
VALUES ('C001', '테스트케이스상태', '테스트케이스 상태에 대한 표기', 'Y', 'admin', now());


--itm_code 
--A001 결함유형 
INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('A001', 'A001_01', '코딩오류', '코딩오류', 'Y', 10, 'admin', now());

INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('A001', 'A001_02', '변경요청', '변경요청', 'Y', 20, 'admin', now());

INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('A001', 'A001_03', '협의완료', '협의완료 (비결함이거나 수정을 하지 않기로 협의한경우)', 'Y', 30, 'admin', now());


--B001 결함상태 
INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_01', '결함등록', '테스터가 결함을 등록', 'Y', 0, 'admin', now());
--이거는 PL에이 확인하여 처리 필요 
INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_02', '배정완료', '개발자에게 결함이 배정된 단계', 'Y', 10, 'admin', now());

INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_03', '조치완료', '개발자가 결함또는 변경사항을 조치완료', 'Y', 20, 'admin', now());

INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_04', '미조치건', '비결함이거나 수정을 반영하기 힘든경우', 'Y', 30, 'admin', now());

INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_05', '개발지연', '타팀연계로 인해 개발이 지연되는 경우', 'Y', 40, 'admin', now());


INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_06', '결함종료', '테스터가 확인하여 결함이 종료', 'Y', 50, 'admin', now());
 
INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_07', '결함반려', '테스터가 확인하여 결함을 반려한 경우', 'Y', 60, 'admin', now());

--C001 테스트케이스상태 
INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('C001', 'C001_01', '수행대기', '테스트케이스 수행대기', 'Y', 0, 'admin', now());

INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('C001', 'C001_02', '수행중', '테스트케이스 수행중', 'Y', 0, 'admin', now());

INSERT INTO sftm.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('C001', 'C001_03', '수행완료', '테스트케이스 수행완료', 'Y', 0, 'admin', now());
