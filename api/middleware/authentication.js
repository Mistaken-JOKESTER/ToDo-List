const jwt = require('jsonwebtoken')
const validator = require('validator')
const pool = require('../dbConnection')
const sql = require('../sqlCommands')
const tokenSecrete = process.env.TOKEN_SECRETE || 'dsfo324jfk4iifdj45tfg4j56h'

const userAuth = async (req, res, next) => {
    try{
        const token = req.headers['auth']
        if(!token || token == ''){
            return res.send({error:{message:'Authentication header missing', status:403}})
        }

        jwt.verify(token, tokenSecrete, function(err, decoded) {
            if(err){
                console.log(err)
                return res.send({error:{message:'Failed to authenticate login again.', status:403, loginFlag:true}})
            } 
            console.log(decoded)
            const userId = decoded.user_id.split(' ')
            pool.getConnection((err, connection) => {
                if(err){
                    console.log(err)
                    throw new Error('Failed to connect')
                }
                connection.query(`${sql.find_token} ('${token}', ${parseInt(userId[1])}) as found`, function (error, results, fields) {
                    if(err){
                        console.log(err)
                        throw new Error('Failed to connect')
                    }

                    if(!results[0].found){
                        return res.send({error:'Login again', status:'404', loginFlag:true})
                    }

                    req.token = token
                    req.userID = parseInt(userId[1])
                    connection.release()
                    next()
                })
            })
        })
    } catch(e) {
        console.log(e)
        res.send({error:{message:'Internal app error', status:500}})
    }
}

module.exports = userAuth