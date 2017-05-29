drop table if exists Article;
drop table if exists Field;
drop table if exists Has_Experience;
drop table if exists User;
drop table if exists Admin;

create table Article(
	id INT,
	title VARCHAR(30) NOT NULL,
	last_edited DATE NOT NULL,
	editing_level INT DEFAULT NULL,
	creator VARCHAR(30) REFERENCES User(username) ON DELETE CASCADE,
	belongs_to VARCHAR(30) REFERENCES Field(field) ON DELETE CASCADE,
	content VARCHAR(1001),
	PRIMARY KEY (id)
);

create table Field(
	field VARCHAR(30),
	subfield_of VARCHAR(30),
	PRIMARY KEY (field)
);

create table Has_Experience(
	username VARCHAR(30) REFERENCES User(username) ON DELETE CASCADE,
	field VARCHAR(30) REFERENCES Field(field) ON DELETE CASCADE,
	level INT,
	PRIMARY KEY (username, field)
);

create table User(
	username VARCHAR(30) PRIMARY KEY,
	password VARCHAR(30) NOT NULL,
	registration_date DATE NOT NULL,
	num_art_edited INT,
	first_name VARCHAR(30) NOT NULL,
	last_name VARCHAR(30) NOT NULL,
	salt VARCHAR(30) NOT NULL
);

create table Admin(
	adminID VARCHAR(30) PRIMARY KEY REFERENCES User(username) ON DELETE CASCADE,
	genre VARCHAR(30),
	superAdmin BOOLEAN NOT NULL
);

CREATE TRIGGER user_delete BEFORE DELETE ON User
	FOR EACH ROW
		UPDATE Article
		SET Article.creator = "DELETED"
		WHERE Article.creator = OLD.username;

DELIMITER $$
CREATE TRIGGER field_delete BEFORE DELETE ON Field
	FOR EACH ROW
	BEGIN
		UPDATE Article
		SET belongs_to = "Unspecified"
		WHERE Article.belongs_to = OLD.field;
		UPDATE Has_Experience
		SET field = "Unspecified"
		WHERE Has_Experience.field = OLD.field;
	END$$
DELIMITER ;
