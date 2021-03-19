const jwt = require('jsonwebtoken')
const tokenSecrete = process.env.TOKEN_SECRETE || 'dsfo324jfk4iifdj45tfg4j56h'

const generateToken = async (user_id) => {
    var token = await jwt.sign({ user_id:`bearer ${user_id}` }, tokenSecrete)
    return token
}

module.exports = generateToken
