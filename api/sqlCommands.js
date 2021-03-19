const sql = {}

sql.userExist = `SELECT * FROM users WHERE users.user_email = `
sql.userInsert = `INSERT INTO users(user_id, first_name, last_name, user_email, user_password) VALUES ((select find_new_key()),`
sql.findUser = `SELECT first_name, last_name, user_id FROM users WHERE`
sql.tokenInsert = `INSERT INTO tokens (access_token, user_id) VALUES`
sql.find_token = `select find_token`
sql.deleteToken = 'DELETE FROM tokens WHERE access_token ='
sql.findTaks = `SELECT task_id, discription, task_status FROM tasks WHERE`
sql.taskInsert = 'INSERT INTO tasks (discription, user_id) VALUES'
sql.taskUpdate = 'UPDATE tasks SET task_status = 1 WHERE'
sql.taskDelete = 'DELETE FROM tasks WHERE task_status = 1 AND'
sql.taskDeleteOne = 'DELETE FROM tasks WHERE'
sql.userDelete = 'DELETE FROM users WHERE'

module.exports = sql