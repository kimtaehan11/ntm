
  

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
  admin boolean DEFAULT false,
  CONSTRAINT itm_user_pk PRIMARY KEY (user_id) 
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
  	CONSTRAINT itm_user_pk PRIMARY KEY (id) 
);


ALTER TABLE  itm_role OWNER TO ntm_admin;

INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'PM', 'PM', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'QA', 'QA', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'PL', 'PL', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'TESTER', 'TESTER', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'DEV', 'DEV', '', 'admin',  now(), 'admin',now() );
INSERT INTO itm_role  VALUES (nextval('itm_role_id_seq'::REGCLASS), 0, 'CUSTOM', 'CUSTOM', '', 'admin',  now(), 'admin',now() );


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
