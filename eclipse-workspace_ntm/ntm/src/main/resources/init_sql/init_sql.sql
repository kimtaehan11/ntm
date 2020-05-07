
  

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;


CREATE SCHEMA ntm_schemas;
ALTER SCHEMA ntm_schemas OWNER TO ntm_admin;

SET search_path = ntm_schemas, pg_catalog;

-- itm_user : 사용자 테이블
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
  admin boolean DEFAULT false,
  CONSTRAINT itm_user_pk PRIMARY KEY (user_id) 
)
WITH (
  OIDS=FALSE
);
ALTER TABLE itm_user OWNER TO ntm_admin;

-- Index: ntm_schemas.itm_user_uidx

-- DROP INDEX ntm_schemas.itm_user_uidx;

CREATE UNIQUE INDEX itm_user_uidx
  ON itm_user
  USING btree
  (user_id COLLATE pg_catalog."default" DESC);


  -- 관리자 계정 생성
 INSERT INTO itm_user
( user_id, password, "name", phone_num, email, organization, "position", description, reg_user, reg_date, modify_user, modify_date, admin)
VALUES(  'admin', 'admin', '관리자', '010-0000-0000', 'nexcore4u@sk.com', 'SK주식회사', '수석', '관리자계정입니다.', 'nexcore', now(), 'nexcore', now(),'TRUE');


 INSERT INTO itm_user
( user_id, password, "name", phone_num, email, organization, "position", description, team_id,  reg_user, reg_date, modify_user, modify_date, admin)
VALUES(  '08368', '08368', '홍길동', '010-0000-0000', '홍길동@sk.com', 'SK주식회사', '수석', '관리자계정입니다.', '1', 'nexcore', now(), 'nexcore', now(),'FALSE');



-- itm_user : 역하
-- itm_user : 역하
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
  	CONSTRAINT itm_user_pk PRIMARY KEY (id) 
);


ALTER TABLE  itm_role OWNER TO ntm_admin;

INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'PM', '[TM] 프로젝트 매니저(PM)', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'QA', '[TM] 품질관리자(QA)', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'PL', '[TM] 파트리더(PL)', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'TESTER', '[TM] 테스터(TESTER)', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'DEV', '[TM] 개발자(DEV)', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'CUSTOM', '[TM] 고객(CUSTOM)', '', 'admin',  now(), 'admin',now() );


-- itm_team : 그룹 정보
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

 
