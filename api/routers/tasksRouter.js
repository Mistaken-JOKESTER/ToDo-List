const pool = require('../dbConnection')
const userAuth = require('../middleware/authentication')
const sanitizeHtml = require('sanitize-html')
const sql = require('../sqlCommands')
const validator = require('validator')
const router = require('express').Router()

router.get('/tasks/:value', userAuth, (req, res) => {
    try{
        console.log(req.userID)
        const { value } = req.params
        let query = sql.findTaks + ` user_id = ${Number(req.userID)} ORDER BY task_id DESC`
        
        if ( value === 'completed'){
            query = query + ' AND task_status = 1'
        } else if (value === 'uncompleted'){
            query = query + ' AND task_status = 0'
        }

        pool.getConnection((err, connection) => {
            if(err){
                console.log(err)
                throw new Error('Unable to connect')
            }
            connection.query(query, function (error, results, fields) {
                if(error){
                    console.log(error)
                    throw new Error('Not able to connect')
                } else {
                    res.send(results)
                    connection.release()
                }
            })
        })
    } catch(e) {
        console.log(e)
        res.status(500).send({error:'Internal app error', status:500})
    }
})


router.post('/addtask', userAuth, (req, res) => {
    try{
        let { discription } = req.body
        discription = sanitizeHtml(discription)
        if(discription == 'udefined' || discription == ''){
            return res.send({error:{message:'Please provide discription of task', status:403}, data:{discription:req.body.discription}})
        }

        pool.getConnection((err, connection) => {
            if(err){
                console.log(err)
                throw new Error('Unable to connect')
            }
            connection.query(`${sql.taskInsert} ('${discription}', ${Number(req.userID)})`, function (error, results, fields) {
                if(error){
                    console.log(error)
                    throw new Error('Not able to connect')
                } else {
                    console.log(results)
                    connection.release()
                    if(!results.affectedRows){
                        return res.send({error:{message:'Failed to add task try again', status:500}, data:{discription:req.body.discription}})
                    }
                    res.send({message:'task added successfully', tasks_id : results.insertId, discription})
                }
            })
        })
    } catch(e) {
        console.log(e)
        res.status(500).send({error:'Internal app error', status:500})
    }
})

router.get('/completeTask/:taskId', userAuth, (req, res) => {
    try{
        let { taskId } = req.params
        if(!taskId|| taskId == '' || !validator.isNumeric(taskId)){
            return res.send({error:{message:'Please provide discription of task', status:403}})
        }

        pool.getConnection((err, connection) => {
            if(err){
                console.log(err)
                throw new Error('Unable to connect')
            }
            connection.query(`${sql.taskUpdate} task_id = ${Number(taskId)} AND user_id = ${Number(req.userID)};`, function (error, results, fields) {
                if(error){
                    console.log(error)
                    throw new Error('Not able to connect')
                } else {
                    console.log(results)
                    connection.release()
                    if(!results.affectedRows){
                        return res.send({error:{message:'Failed to update task try again', status:500}})
                    }
                    res.send({message:'task is marked completed'})
                }
            })
        })
    } catch(e) {
        console.log(e)
        res.status(500).send({error:'Internal app error', status:500})
    }
})

router.get('/deletetask/:taskId', userAuth, (req, res) => {
    try{
        let { taskId } = req.params
        if(!taskId|| taskId == '' || !validator.isNumeric(taskId)){
            return res.send({error:{message:'Please provide discription of task', status:403}})
        }

        pool.getConnection((err, connection) => {
            if(err){
                console.log(err)
                throw new Error('Unable to connect')
            }
            connection.query(`${sql.taskDeleteOne} task_id = ${Number(taskId)} AND user_id = ${Number(req.userID)};`, function (error, results, fields) {
                if(error){
                    console.log(error)
                    throw new Error('Not able to connect')
                } else {
                    console.log(results)
                    connection.release()
                    if(!results.affectedRows){
                        return res.send({error:{message:'Failed to delete task try again', status:500}})
                    }
                    res.send({message:'Task are deleted successfully '})
                }
            })
        })
    } catch(e) {
        console.log(e)
        res.status(500).send({error:'Internal app error', status:500})
    }
})

router.get('/deleteCompleted', userAuth, (req, res) => {
    try{
        pool.getConnection((err, connection) => {
            if(err){
                console.log(err)
                throw new Error('Unable to connect')
            }
            connection.query(`${sql.taskDelete} user_id = ${Number(req.userID)};`, function (error, results, fields) {
                if(error){
                    console.log(error)
                    throw new Error('Not able to connect')
                } else {
                    console.log(results)
                    connection.release()
                    if(!results.affectedRows){
                        return res.send({error:{message:'Failed to delete tasks try again', status:500}})
                    }
                    res.send({message:'Completed tasks are deleted successfully '})
                }
            })
        })
    } catch(e) {
        console.log(e)
        res.status(500).send({error:'Internal app error', status:500})
    }
})



module.exports = router