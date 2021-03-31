const router = require('express').Router()
const validator = require('validator')
const sanitizeHtml = require('sanitize-html')
const pool = require('../dbConnection')
const sql = require('../sqlCommands')
const generateToken = require('../middleware/jsonWebToken')
const userAuth = require('../middleware/authentication')

//Registratin route
router.post('/register', async (req, res) => {
    try{
        //Extracting and sanizitizing resistration data
        let { first_name, last_name, user_email, user_password } = req.body
        first_name = sanitizeHtml(first_name)
        last_name = sanitizeHtml(last_name)
        user_email = sanitizeHtml(user_email)

        //Checking if any of feild is missing
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

        //If anything missing sending it back to user with error
        if(missing.length){
            return res.send({
                error:{
                    message:'Fill missing feilds',
                    missing,
                },
                data:req.body
            })
        }

        //connecting to database
        await pool.getConnection((err, connection) => {
            //checking if any errors
            if(err){
                console.log(err)
                throw new Error('Failed to connect')
            }
            //asking fo query if user already exsist
            connection.query(`${sql.userExist} '${user_email}'`, function (error, results, fields) {
                //checking if any error
                if (error) {
                    console.log(error)
                    throw new Error(error)
                }
                //checking if user already exesist
                if(results.length){
                    //If user exesist sending error to user
                    return res.send({error:{message:'Invalid E-mail',}, data:{...req.body}})
                }
                
                //asking query for resgistring user
                connection.query(`${sql.userInsert} '${first_name}', '${last_name}', '${user_email}', '${user_password}')`, 
                    function (error, results, fields) {
                        //checking if any error
                        if (error) {
                            console.log(error)
                            throw new Error(error)
                        }
                        //cheking if user added
                        if(!results.affectedRows){
                            return res.send({error:{message:'Unable to add user',}, data:{...req.body}})
                        }

                        //disconnecting form database and send success respose
                        res.send('done')
                        connection.release()
                })
            })
        })

    } catch(e) {
        //Network or internal errors
        console.log(e)
        res.status(500).send({error:'error'})
    }
})

//Route for login
router.post('/login', async (req, res) => {
    try{

        //extracing login ingo
        const {user_email, user_password} = req.body
        
        //checking if any feild is missing and send error if any
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

        //connecting to database
        await pool.getConnection((err, connection) => {
            //checking if any error
            if(err){
                console.log(err)
                throw new Error('Failed to connect')
            }
            //asking for login query
            connection.query(`${sql.findUser} user_password = (select SHA1(CONCAT('${user_email}','${user_password}'))) AND user_email = '${user_email}';`,async function (error, results, fields) {
                //checking if any error
                if(error){
                    console.log(error)
                    throw new Error('error in database')
                }
                //checking if user exsist if not sendding error else sending token and user info
                if(!results.length){
                    return res.send({error:{message:'Invalid email or password', missing, status:403}, data:{...req.body}})
                }
                const user = results[0]
                //generating token
                const token = await generateToken(results[0].user_id)
                //adding token to database
                connection.query(`${sql.tokenInsert} ('${token}', ${user.user_id});`,async function (error, results, fields) {
                    //chekcing if any error
                    if(error){
                        console.log(error)
                        throw new Error('error in database')
                    }

                    //sending token and user data
                    res.send({accessToken: token, user:{...user}})
                    //diconnecting from database
                    connection.release()
                })
                
            })
        })

    } catch(e) {
        //Network or internal errors
        console.log(e)
        res.status(500).send({error:'error'})
    }
})

//Logut route
router.get('/logout', userAuth, (req, res) => {
    try{
        //connectin to database
        pool.getConnection((err, connection) => {
            //checking if any error
            if(err){
                console.log(err)
                throw new Error('Failed to connect')
            }
            //askying query
            connection.query(`${sql.deleteToken} '${req.token}'`,async function (error, results, fields) {
                //cheking if any error
                if(error){
                    console.log(error)
                    throw new Error('error in database')
                }
                //cheing if give token is delete from database
                if(!results.affectedRows){
                    return res.send({error:{message:"Unable to logout", status:410}})
                }
                //sending success message
                res.send({message:'Your are loged out suceessfully.'})
            })
        })

    } catch(e) {
        //Network or internal errors
        console.log(e)
        res.status(500).send({error:'error'})
    }
})

//delete account route
router.get('/deleteAccount', userAuth, (req, res) => {
    try{
        //connecting to database
        pool.getConnection((err, connection) => {
            //cehcking if any error
            if(err){
                console.log(err)
                throw new Error('Failed to connect')
            }
            //asking query
            connection.query(`${sql.userDelete} user_id = ${Number(req.userID)}`,async function (error, results, fields) {
                //chekcing if any error
                if(error){
                    console.log(error)
                    throw new Error('error in database')
                }
                //check if account deleted if not sending error
                if(!results.affectedRows){
                    return res.send({error:{message:"Unable to remove account, try agian", status:410}})
                }

                //sending success message
                res.send({message:'Your account is delete succesfully.'})
            })
        })

    } catch(e) {
        console.log(e)
        res.status(500).send({error:'error'})
    }
})

//For debugging purposed
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