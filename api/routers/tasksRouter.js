const pool = require('../dbConnection')
const userAuth = require('../middleware/authentication')
const sanitizeHtml = require('sanitize-html')
const sql = require('../sqlCommands')
const validator = require('validator')
const router = require('express').Router()

//Route for fetching all task
//Filter is availabe-
// ----Default:all
// ----completed
// ----uncompleted
router.get('/tasks/:value', userAuth, (req, res) => {
    try{
        //extracting filter value form params
        const { value } = req.params

        //creating query for search accordingly
        let query = sql.findTaks + ` user_id = ${Number(req.userID)} ORDER BY task_id DESC`
        if ( value === 'completed'){
            query = query + ' AND task_status = 1'
        } else if (value === 'uncompleted'){
            query = query + ' AND task_status = 0'
        }

        //connecting to database
        pool.getConnection((err, connection) => {
            //checking if any errors
            if(err){
                console.log(err)
                throw new Error('Unable to connect')
            }
            //asking for query
            connection.query(query, function (error, results, fields) {
                //checking if any errors
                if(error){
                    console.log(error)
                    throw new Error('Not able to connect')
                } else {
                    //sending response to user
                    res.send(results)
                    //disconnecting form database
                    connection.release()
                }
            })
        })
    } catch(e) {
        //Network or internal errors
        console.log(e)
        res.status(500).send({error:'Internal app error', status:500})
    }
})

//ROute for adding new task
router.post('/addtask', userAuth, (req, res) => {
    try{
        //extracting discription form req body
        let { discription } = req.body

        //sanitizing discription
        discription = sanitizeHtml(discription)
        //if discription is empty returning error in response
        if(discription == 'udefined' || discription == ''){
            return res.send({error:{message:'Please provide discription of task', status:403}, data:{discription:req.body.discription}})
        }

        //connecting to database
        pool.getConnection((err, connection) => {
            //checking if any error
            if(err){
                console.log(err)
                throw new Error('Unable to connect')
            }
            //asking a query
            connection.query(`${sql.taskInsert} ('${discription}', ${Number(req.userID)})`, function (error, results, fields) {
                //checking if any error
                if(error){
                    console.log(error)
                    throw new Error('Not able to connect')
                } else {
                    //disconnectin from database
                    connection.release()
                    //checking if task is added
                    //if not sending error to user
                    if(!results.affectedRows){
                        return res.send({error:{message:'Failed to add task try again', status:500}, data:{discription:req.body.discription}})
                    }
                    //sending res to user
                    res.send({message:'task added successfully', tasks_id : results.insertId, discription})
                }
            })
        })
    } catch(e) {
        //Network or internal errors
        console.log(e)
        res.status(500).send({error:'Internal app error', status:500})
    }
})

//Reoute for updating task as complete
router.get('/completeTask/:taskId', userAuth, (req, res) => {
    try{
        //Extracting task id to be makred complete
        let { taskId } = req.params
        //if task is not defined sending error to user
        if(!taskId|| taskId == '' || !validator.isNumeric(taskId)){
            return res.send({error:{message:'Please provide discription of task', status:403}})
        }

        //connecting to database
        pool.getConnection((err, connection) => {
            //cheking if any errors
            if(err){
                console.log(err)
                throw new Error('Unable to connect')
            }
            //asking for query
            connection.query(`${sql.taskUpdate} task_id = ${Number(taskId)} AND user_id = ${Number(req.userID)};`, function (error, results, fields) {
                //checking if any errors
                if(error){
                    console.log(error)
                    throw new Error('Not able to connect')
                } else {
                    //disconnecting from database
                    connection.release()
                    //checking if task is updated
                    //if not sending error to user
                    if(!results.affectedRows){
                        return res.send({error:{message:'Failed to update task try again', status:500}})
                    }

                    //sending success response to user
                    res.send({message:'task is marked completed'})
                }
            })
        })
    } catch(e) {
        //Network or internal errors
        console.log(e)
        res.status(500).send({error:'Internal app error', status:500})
    }
})

//route for deleting task
router.get('/deletetask/:taskId', userAuth, (req, res) => {
    try{
        //extracing task id
        let { taskId } = req.params
        //checking if task id is null sending error to user
        if(!taskId|| taskId == '' || !validator.isNumeric(taskId)){
            return res.send({error:{message:'Please provide discription of task', status:403}})
        }

        //connecting to database
        pool.getConnection((err, connection) => {
            //checking if any error
            if(err){
                console.log(err)
                throw new Error('Unable to connect')
            }
            //asking for query
            connection.query(`${sql.taskDeleteOne} task_id = ${Number(taskId)} AND user_id = ${Number(req.userID)};`, function (error, results, fields) {
                //checking if any error
                if(error){
                    console.log(error)
                    throw new Error('Not able to connect')
                } else {
                    //disconnecting from database
                    connection.release()
                    //checking if task is deleted
                    //if not sending error response to user
                    if(!results.affectedRows){
                        return res.send({error:{message:'Failed to delete task try again', status:500}})
                    }

                    //sending success response to user
                    res.send({message:'Task are deleted successfully '})
                }
            })
        })
    } catch(e) {
        //Network or internal errors
        console.log(e)
        res.status(500).send({error:'Internal app error', status:500})
    }
})

//Routes to delete all completed tasks
router.get('/deleteCompleted', userAuth, (req, res) => {
    try{
        //connecting to database
        pool.getConnection((err, connection) => {
            //checking if any errors
            if(err){
                console.log(err)
                throw new Error('Unable to connect')
            }
            //asking for query
            connection.query(`${sql.taskDelete} user_id = ${Number(req.userID)};`, function (error, results, fields) {
                //chechking if any errors
                if(error){
                    console.log(error)
                    throw new Error('Not able to connect')
                } else {
                    //disconnecting form database
                    connection.release()

                    //checking if tasks are deleted
                    //if not sending error to user
                    if(!results.affectedRows){
                        return res.send({error:{message:'Failed to delete tasks try again', status:500}})
                    }

                    //sending success response to user
                    res.send({message:'Completed tasks are deleted successfully '})
                }
            })
        })
    } catch(e) {
        //Network or internal errors
        console.log(e)
        res.status(500).send({error:'Internal app error', status:500})
    }
})



module.exports = router