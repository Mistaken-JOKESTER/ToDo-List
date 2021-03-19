-- Create database with name todo and create all tables required
-- creating database
CREATE DATABASE todo;

-- selecting database
USE todo;

-- Users Table
CREATE TABLE users (
	user_id int auto_increment,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    user_email varchar(100) UNIQUE NOT NULL,
    user_password varchar(255) NOT NULL,
    PRIMARY KEY(user_id)
);
DESCRIBE users;

-- JsonWebToken Table
CREATE TABLE tokens (
	token_id INT AUTO_INCREMENT,
    access_token VARCHAR(255) unique not null,
    user_id INT not null,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (token_id)
);
DESCRIBE tokens;

-- Tasks Table
CREATE TABLE tasks (
	task_id INT AUTO_INCREMENT,
    discription VARCHAR(300) NOT NULL,
    task_status bool default false not null,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (task_id)
);
DESCRIBE tasks;


-- Trigger to Hash function before storing
DELIMITER $$
CREATE
	TRIGGER user_password_trigger BEFORE INSERT
    ON 	users
    FOR EACH ROW BEGIN
		SET NEW.user_password = SHA1(CONCAT(NEW.user_email, NEW.user_password));
	END$$
DELIMITER ;

-- fucntion for finding new Key for user_id
Delimiter $$
create function find_new_key () returns int READS SQL DATA 
BEGIN
 return ((select max(users.user_id) from users) +1);
END $$

-- Function to check if token belong to user.
Delimiter $$
create function find_token (token varchar(255), user_id int) returns int reads sql data
BEGIN
	if (exists (select * from tokens where tokens.access_token = token and tokens.user_id = user_id)) then
		return true;
	else 
		return false;
	end if;
END $$
Delimiter ;