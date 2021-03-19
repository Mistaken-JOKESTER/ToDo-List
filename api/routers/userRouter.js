const router = require('express').Router()
const validator = require('validator')
const sanitizeHtml = require('sanitize-html')
const pool = require('../dbConnection')
const sql = require('../sqlCommands')
const generateToken = require('../middleware/jsonWebToken')
const userAuth = require('../middleware/authentication')

router.post('/register', async (req, res) => {
    try{

        let { first_name, last_name, user_email, user_password } = req.body
        first_name = sanitizeHtml(first_name)
        last_name = sanitizeHtml(last_name)
        user_email = sanitizeHtml(user_email)

        const missing = []
        if(!first_name || first_name == '' || !validator.isAlpha(first_name) || first_name == 'undefined'){
            missing.push('first_name')
        }
        if(!last_name || last_name == '' || !validator.isAlpha(last_name) || last_name == 'undefined'){
            missing.push('last_name')
        }
        if(!user_email || user_email == '' || user_email == 'undefined' || !validator.isEmail(user_email)){
            missing.push('user_email')
        }
        if(!user_password || user_password == '' || user_password == 'undefined'){
            missing.push('user_passowrd')
        }
        if(missing.length){
            return res.send({
                error:{
                    message:'Fill missing feilds',
                    missing,
                },
                data:req.body
            })
        }

        await pool.getConnection((err, connection) => {
            if(err){
                console.log(err)
                throw new Error('Failed to connect')
            }
            connection.query(`${sql.userExist} '${user_email}'`, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    throw new Error(error)
                }
                if(results.length){
                    console.log('userExesist')
                    return res.send({error:{message:'Invalid E-mail',}, data:{...req.body}})
                }
                console.log('we are here')
                
                connection.query(`${sql.userInsert} '${first_name}', '${last_name}', '${user_email}', '${user_password}')`, 
                    function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            throw new Error(error)
                        }
                    if(results.affectedRows)
                    res.send('done')
                    connection.release()
                })
            })
        })

    } catch(e) {
        console.log(e)
        res.status(500).send({error:'error'})
    }
})

router.post('/login', async (req, res) => {
    try{
        const {user_email, user_password} = req.body
        const missing = []

        if(!user_email || user_email == '' || !validator.isEmail(user_email)){
            missing.push('user_email')
        }
        if(!user_password || user_password == ''){
            missing.push('user_password')
        }

        if(missing.length){
            return res.send({error:{message:'Provide all feilds', missing, status:403}, data:{...req.body}})
        }

        await pool.getConnection((err, connection) => {
            if(err){
                console.log(err)
                throw new Error('Failed to connect')
            }
            connection.query(`${sql.findUser} user_password = (select SHA1(CONCAT('${user_email}','${user_password}'))) AND user_email = '${user_email}';`,async function (error, results, fields) {
                if(error){
                    console.log(error)
                    throw new Error('error in database')
                }
                console.log(results)
                if(!results.length){
                    return res.send({error:{message:'Invalid email or password', missing, status:403}, data:{...req.body}})
                }
                const user = results[0]
                const token = await generateToken(results[0].user_id)
                console.log(user, token)
                connection.query(`${sql.tokenInsert} ('${token}', ${user.user_id});`,async function (error, results, fields) {
                    if(error){
                        console.log(error)
                        throw new Error('error in database')
                    }

                    console.log(token)
                    res.send({accessToken: token, user:{...user}})
                    connection.release()
                })
                
            })
        })

    } catch(e) {
        console.log(e)
        res.status(500).send({error:'error'})
    }
})

router.get('/logout', userAuth, (req, res) => {
    try{
        pool.getConnection((err, connection) => {
            if(err){
                console.log(err)
                throw new Error('Failed to connect')
            }
            connection.query(`${sql.deleteToken} '${req.token}'`,async function (error, results, fields) {
                if(error){
                    console.log(error)
                    throw new Error('error in database')
                }
                console.log(results.affectedRows)
                if(!results.affectedRows){
                    return res.send({error:{message:"Unable to logout", status:410}})
                }
                res.send({message:'Your are loged out suceessfully.'})
            })
        })

    } catch(e) {
        console.log(e)
        res.status(500).send({error:'error'})
    }
})

router.get('/deleteAccount', userAuth, (req, res) => {
    try{
        pool.getConnection((err, connection) => {
            if(err){
                console.log(err)
                throw new Error('Failed to connect')
            }
            connection.query(`${sql.userDelete} user_id = ${Number(req.userID)}`,async function (error, results, fields) {
                if(error){
                    console.log(error)
                    throw new Error('error in database')
                }
                console.log(results.affectedRows)
                if(!results.affectedRows){
                    return res.send({error:{message:"Unable to remove account, try agian", status:410}})
                }
                res.send({message:'Your account is delete succesfully.'})
            })
        })

    } catch(e) {
        console.log(e)
        res.status(500).send({error:'error'})
    }
})

router.get('/showall',async (req, res) => {
    try{
        await pool.getConnection((err, connection) => {
            connection.query(`Select * from tasks;`, function (error, results, fields) {
                if(error){
                    console.log(error)
                } else {
                    console.log(results)
                    res.send(results)
                    connection.release()
                }
            })
        })
    } catch(e) {
        console.log(e)
        res.send('error')
    }
})

module.exports = router