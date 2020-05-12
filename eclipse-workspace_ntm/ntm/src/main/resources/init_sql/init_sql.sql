SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE SCHEMA ntm_schemas;
ALTER SCHEMA ntm_schemas OWNER TO ntm_admin;
SET search_path = ntm_schemas, pg_catalog;
 
CREATE TABLE itm_user
(
  user_id character varying(256) NOT NULL,
  password character varying(256) NOT NULL,
  name character varying(256),
  phone_num character varying(64),
  email character varying(256),
  organization character varying(256),
  "position" character varying(256),
  description character varying(256),
  team_id bigint,
  reg_user character varying(256) NOT NULL,
  reg_date timestamp without time zone DEFAULT now(),
  modify_user character varying(256),
  modify_date timestamp without time zone,
  admin boolean DEFAULT false
)
WITH (
  OIDS=FALSE
);
ALTER TABLE itm_user OWNER TO ntm_admin;
ALTER TABLE itm_user ADD PRIMARY KEY(user_id);
-- Index: ntm_schemas.itm_user_uidx

-- DROP INDEX ntm_schemas.itm_user_uidx;

CREATE UNIQUE INDEX itm_user_uidx
  ON itm_user
  USING btree
  (user_id COLLATE pg_catalog."default" DESC);


 INSERT INTO itm_user
( user_id, password, "name", phone_num, email, organization, "position", description, reg_user, reg_date, modify_user, modify_date, admin)
VALUES(  'admin', 'admin', '김태한', '010-0000-0000', 'nexcore4u@sk.com', 'SKCC', '1234', '123455', 'nexcore', now(), 'nexcore', now(),'TRUE');



CREATE SEQUENCE itm_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE itm_role_id_seq OWNER TO ntm_admin;

 
CREATE TABLE itm_role (
     id bigint DEFAULT nextval('itm_role_id_seq'::regclass) NOT NULL,
    project_id bigint NOT NULL,
    code character varying(256),
    name character varying(256),
    description character varying(256),
    reg_user character varying(256) NOT NULL,
    reg_date timestamp without time zone DEFAULT now(),
    modify_user character varying(256),
    modify_date timestamp without time zone,
  	CONSTRAINT itm_role_pk PRIMARY KEY (id) 
);


ALTER TABLE  itm_role OWNER TO ntm_admin;


-- itm_team :  
CREATE SEQUENCE  itm_team_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE itm_team_id_seq OWNER TO ntm_admin;

 
CREATE TABLE itm_team (
    id bigint DEFAULT nextval('itm_team_id_seq'::regclass) NOT NULL,
    name character varying(256),
    project_id bigint NOT NULL,
    role_id bigint NOT NULL,
    description text,
    reg_user character varying(256) NOT NULL,
    reg_date timestamp without time zone DEFAULT now(),
    modify_user character varying(256),
    modify_date timestamp without time zone
);


ALTER TABLE itm_team OWNER TO ntm_admin;

 
-- 업무구분 3depth로 정리됨 
-- 서브시스템, 업무구분, 대상업무
CREATE SEQUENCE itm_div_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE itm_div_id_seq OWNER TO ntm_admin;

 
CREATE TABLE itm_div (
    id character varying(10)  NOT NULL,
    project_id bigint NOT NULL,
    name character varying(256),
    depth character varying(1),
    upcode character varying(10),
    reg_user character varying(256) NOT NULL,
    reg_date timestamp without time zone DEFAULT now(),
    modify_user character varying(256),
    modify_date timestamp without time zone 
   
);


ALTER TABLE itm_div OWNER TO ntm_admin;
ALTER TABLE itm_div ADD PRIMARY KEY(id);


-- 시나리오 테이블 
-- Table: itm_core.itm_scenario
-- DROP TABLE itm_core.itm_scenario;
CREATE TABLE itm_scenario
(
  scenario_code character varying(100) NOT NULL, -- 시나리오코드
  scenario_name character varying(200) NOT NULL, -- 시나리오명
  div_id character varying(10),
  project_id bigint NOT NULL, -- 프로젝트ID
  description text, -- 설명
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone, -- 등록일자
  modify_user character varying(64), -- 수정자
  modify_date timestamp with time zone -- 수정일자
)
WITH (
  OIDS=FALSE
);


ALTER TABLE itm_scenario ADD PRIMARY KEY(scenario_code);

ALTER TABLE itm_scenario OWNER TO ntm_admin;

COMMENT ON TABLE  itm_scenario IS '시나리오';
COMMENT ON COLUMN  itm_scenario.project_id IS '프로젝트ID'; 
COMMENT ON COLUMN  itm_scenario.scenario_code IS '시나리오코드';
COMMENT ON COLUMN  itm_scenario.scenario_name IS '시나리오명';
COMMENT ON COLUMN  itm_scenario.description IS '설명';
COMMENT ON COLUMN  itm_scenario.reg_user IS '등록자';
COMMENT ON COLUMN  itm_scenario.reg_date IS '등록일자';
COMMENT ON COLUMN  itm_scenario.modify_user IS '수정자';
COMMENT ON COLUMN  itm_scenario.modify_date IS '수정일자';

--테스트케이스 건

CREATE TABLE itm_test_case
(
  case_code character varying(100), -- 케이스코드
  case_name character varying(200), -- 케이스명
  project_id bigint NOT NULL, -- 프로젝트ID
 	scenario_code character varying(100) NOT NULL, -- 시나리오ID
  tester_id character varying(256),
  dev_id character varying(256), 
  state character varying(1), 
  description text, -- 설명
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone, -- 등록일자
  modify_user character varying(64), -- 수정자
  modify_date timestamp with time zone -- 수정일자
)
WITH (
  OIDS=FALSE
);
ALTER TABLE  itm_test_case OWNER TO ntm_admin;
COMMENT ON TABLE  itm_test_case IS '테스트케이스';
COMMENT ON COLUMN itm_test_case.project_id IS '프로젝트ID';
COMMENT ON COLUMN itm_test_case.scenario_code IS '시나리오ID';
COMMENT ON COLUMN itm_test_case.case_code IS '케이스코드';
COMMENT ON COLUMN itm_test_case.case_name IS '케이스명';
COMMENT ON COLUMN itm_test_case.description IS '설명';
COMMENT ON COLUMN itm_test_case.reg_user IS '등록자';
COMMENT ON COLUMN itm_test_case.reg_date IS '등록일자';
COMMENT ON COLUMN itm_test_case.modify_user IS '수정자';
COMMENT ON COLUMN itm_test_case.modify_date IS '수정일자';



ALTER TABLE itm_test_case ADD PRIMARY KEY(scenario_code, case_code);




--결함 테이블 시작 (itm_defect)----------------------------------------  
CREATE SEQUENCE itm_defect_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE itm_defect_id_seq OWNER TO ntm_admin;

CREATE TABLE itm_defect
(
 id bigint DEFAULT nextval('ntm_schemas.itm_defect_id_seq'::regclass) NOT NULL,
  project_id bigint NOT NULL, -- 프로젝트ID
  scenario_code character varying(100) NOT NULL, -- 시나리오ID
  case_code character varying(100), -- 케이스코드
  test_type_id character varying(10) NOT NULL, -- 테스트유형ID
  defect_code character varying(10), -- 결함코드
  title character varying(200), -- 결함명
  description text, -- 설명
  defect_user character varying(64), -- 결함담당자
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone, -- 등록일자
  modify_user character varying(64), -- 수정자
  modify_date timestamp with time zone, -- 수정일자
  due_date timestamp with time zone, -- 조치완료일자
  plan_date timestamp with time zone, -- 조치예정일자
  defect_result text,
  requestor bigint, -- 요청자
  resolve_date timestamp with time zone, -- 조치해결일자
  imgkey bigint
 
)
WITH (
  OIDS=FALSE
);
ALTER TABLE itm_defect OWNER TO ntm_admin;
ALTER SEQUENCE itm_defect_id_seq OWNED BY itm_defect.id;
------------------------------------------결함 테이블 시작 (itm_defect)



--이미지 테이블 시작 (itm_img_id_seq)----------------------------------------  
CREATE SEQUENCE itm_img_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE itm_img_id_seq OWNER TO ntm_admin;

CREATE TABLE itm_img
(
  id bigint DEFAULT nextval('ntm_schemas.itm_img_id_seq'::regclass) NOT NULL,
  seq bigint,
  tbName character varying(100) NOT NULL, -- 시나리오ID
  tbDate character varying(8) NOT NULL, -- 시나리오ID
  saveFileName character varying(256) NOT NULL, -- 시나리오ID
  originFileName character varying(256) NOT NULL, -- 시나리오ID
  fileLength bigint, -- 시나리오ID
  ext character varying(10) NOT NULL, -- 시나리오ID
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone -- 등록일자
)
WITH (
  OIDS=FALSE
);
ALTER TABLE itm_img OWNER TO ntm_admin;
ALTER SEQUENCE itm_img_id_seq OWNED BY itm_img.id;
ALTER TABLE itm_img ADD PRIMARY KEY(id, seq);
------------------------------------------이미지 테이블 종료 (itm_img_id_seq)


--코드그룹 테이블 시작 (itm_code_group)----------------------------------------  
CREATE TABLE  itm_code_group
(
  code_group character varying(30) NOT NULL, -- 코드그룹식별자
  code_group_name character varying(200), -- 코드그룹명
  description text, -- 설명
  use_yn character varying(1) DEFAULT 'Y', -- 사용여부
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone, -- 등록일자
  CONSTRAINT itm_code_group_pk PRIMARY KEY (code_group)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE itm_code_group OWNER TO ntm_admin;
------------------------------------------코드그룹 테이블 종료 (itm_code_group)

 

--코드그룹 테이블 시작 (itm_code)----------------------------------------  
CREATE TABLE itm_code
(
  code_group character varying(30) NOT NULL, -- 코드그룹식별자
  code_id 	character varying(30) NOT NULL, -- 코드명
  code_name character varying(200) NOT NULL, -- 코드명
  description text, -- 설명
  use_yn character varying(1) DEFAULT 'Y', -- 사용여부  
  priority bigint,
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone, -- 등록일자
  CONSTRAINT itm_code_pk PRIMARY KEY (code_group, code_id),
  CONSTRAINT itm_code_fk FOREIGN KEY (code_group)
      REFERENCES itm_code_group (code_group) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE  itm_code OWNER TO ntm_admin; 
------------------------------------------코드그룹 테이블 종료 (itm_code)
 
CREATE FUNCTION GET_CODENAME(_group TEXT, _code TEXT)
RETURNS TEXT AS $$
DECLARE codename TEXT;
BEGIN
        SELECT  code_name INTO codename
        FROM    ntm_schemas.itm_code
        WHERE   code_group = $1
        AND     code_id = $2;

        RETURN codename;
END;
$$  LANGUAGE plpgsql;
