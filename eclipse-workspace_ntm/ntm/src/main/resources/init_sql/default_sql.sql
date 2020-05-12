SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE SCHEMA ntm_schemas;
ALTER SCHEMA ntm_schemas OWNER TO ntm_admin;
SET search_path = ntm_schemas, pg_catalog;
 


 INSERT INTO itm_user
( user_id, password, "name", phone_num, email, organization, "position", description, reg_user, reg_date, modify_user, modify_date, admin)
VALUES(  'admin', 'admin', '김태한', '010-0000-0000', 'nexcore4u@sk.com', 'SKCC', '1234', '123455', 'nexcore', now(), 'nexcore', now(),'TRUE');

INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'PM', 'PM', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'QA', 'QA', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'PL', 'PL', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'TESTER', 'TESTER', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'DEV', 'DEV', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'CUSTOM', 'CUSTOM', '', 'admin',  now(), 'admin',now() );





--itm_code_group
INSERT INTO ntm_schemas.itm_code_group
		(code_group, code_group_name, description, use_yn, reg_user, reg_date)
VALUES ('A001', '결함유형', '결함등록시 저장되는 유형', 'Y', 'admin', now());

INSERT INTO ntm_schemas.itm_code_group
		(code_group, code_group_name, description, use_yn, reg_user, reg_date)
VALUES ('B001', '결함상태', '결함에 상태에 대한 표기', 'Y', 'admin', now());


--itm_code 
INSERT INTO ntm_schemas.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('A001', 'A001_01', '코딩오류', '코딩오류', 'Y', 10, 'admin', now());

INSERT INTO ntm_schemas.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('A001', 'A001_02', '요건변경', '요건변경', 'Y', 20, 'admin', now());

INSERT INTO ntm_schemas.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('A001', 'A001_03', '디자인변경', '디자인변경', 'Y', 30, 'admin', now());


INSERT INTO ntm_schemas.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_01', '등록', '테스터가 결함 등록', 'Y', 0, 'admin', now());

INSERT INTO ntm_schemas.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_02', '배정', '개발자 배정되지 않는 케이스', 'Y', 10, 'admin', now());

INSERT INTO ntm_schemas.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_03', '종료', '테스터가 결함수정 확인', 'Y', 20, 'admin', now());

INSERT INTO ntm_schemas.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_04', '조치중', '개발자가 결함을 수정중', 'Y', 30, 'admin', now());

INSERT INTO ntm_schemas.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_05', '조치완료', '개발자가 결함을 수정완료', 'Y', 40, 'admin', now());


INSERT INTO ntm_schemas.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_06', '지연', '불가항력 이유로 지연건', 'Y', 50, 'admin', now());


INSERT INTO ntm_schemas.itm_code
		(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
VALUES ('B001', 'B001_07', '반려', '테스터가 결함건을 반려처리', 'Y', 60, 'admin', now());
