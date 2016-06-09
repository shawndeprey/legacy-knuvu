create database knuvu;
use knuvu;
create table admin_user(
	id int(11) NOT NULL AUTO_INCREMENT,
	permission int(11) NOT NULL,
	email text NOT NULL,
	password varchar(128) NOT NULL,
	PRIMARY KEY (id)
);
create table admin_project(
	id int(11) NOT NULL AUTO_INCREMENT,
	capability_id int(11),
	name text NOT NULL,
	owner text NOT NULL,
	sample text NOT NULL,
	creation_date TIMESTAMP NOT NULL,
	modified_date TIMESTAMP NOT NULL,
	state int(11) NOT NULL DEFAULT 0,
	file MEDIUMTEXT NOT NULL,
	PRIMARY KEY (id)
);
insert into admin_user (id, permission, email, password) values('', 10, 'shawndeprey@gmail.com', 'neverforget');
insert into admin_user (id, permission, email, password) values('', 10, 'justin.35f@gmail.com', '9866723a');
insert into admin_user (id, permission, email, password) values('', 10, 'msilva@knuvu.com', 'Douchebag1');
insert into admin_user (id, permission, email, password) values('', 10, 'raquel@queldesign.com', 'Lovea11!');
create table admin_rfi(
	id int(11) NOT NULL AUTO_INCREMENT,
	name text NOT NULL,
	owner text NOT NULL,
	creation_date TIMESTAMP NOT NULL,
	modified_date TIMESTAMP NOT NULL,
	rfi MEDIUMTEXT NOT NULL,
	PRIMARY KEY (id)
);
create table admin_rfi_request(
	id int(11) NOT NULL AUTO_INCREMENT,
	rfi_id int(11) NOT NULL,
	request_key text NOT NULL,
	email text NOT NULL,
	creation_date TIMESTAMP NOT NULL,
	modified_date TIMESTAMP NOT NULL,
	rfi_answers MEDIUMTEXT NOT NULL,
	PRIMARY KEY (id)
);
create table admin_capability(
	id int(11) NOT NULL AUTO_INCREMENT,
	name text NOT NULL,
	owner text NOT NULL,
	sample text NOT NULL,
	creation_date TIMESTAMP NOT NULL,
	modified_date TIMESTAMP NOT NULL,
	model_id int(11) NOT NULL,
	PRIMARY KEY (id)
);
create table admin_capability_model(
	id int(11) NOT NULL AUTO_INCREMENT,
	name text NOT NULL,
	model MEDIUMTEXT NOT NULL,
	PRIMARY KEY (id)
);