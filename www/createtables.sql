drop table if exists article;
drop table if exists field;
drop table if exists user;

create table field(
	field VARCHAR(30),
	subfield_of VARCHAR(30),
	PRIMARY KEY (field)
);

create table user(
	username VARCHAR(30) PRIMARY KEY,
	password VARCHAR(30) ,
	registration_date DATE ,
	first_name VARCHAR(30) ,
	last_name VARCHAR(30) ,
	salt VARCHAR(30),
	time_stamp TIMESTAMP,
	theme TEXT,
	email TEXT
);

create table article(
	id INT PRIMARY KEY,
	title VARCHAR(30),
	type VARCHAR(30),
	belongs_to VARCHAR(30),
	path VARCHAR(1500),
	date_created DATETIME,
	last_edited DATETIME
)