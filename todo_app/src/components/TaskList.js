import React from 'react'
import List from './List'
import axios from 'axios'

//Redner all tasks
function TaskList({todos, setTodos, token, setError}) {

    //Request to mark task as complete in database
    const completeTask = (id) => {
        axios({
            url:`http://localhost:8080/completeTask/${id}`,
            method:'get',
            headers:{
                auth:token
            }
        }).then(res => {
            //checking if any errors
            if(res.data.error){
                //setting error state to show errors to user
                setError(res.data.error.message)
            } else { 
                //updating given task in todos state
                setTodos(todos.map(item => {
                    if(item.task_id === id){
                        return {
                            ...item,
                            task_status:1
                        }
                    } else {
                        return item
                    }
                }))
            }
        }).catch(e => {
            //Network or internal errors during request
            console.log(e)
        })
    }

    //Request for deleting task from database
    const deleteTask = (id) => {
        axios({
            url:`http://localhost:8080/deletetask/${id}`,
            method:'get',
            headers:{
                auth:token
            }
        }).then(res => {
            //checking if any errors
            if(res.data.error){
                //setting error state to show error to user
                setError(res.data.error.message)
            } else{ 
                //Updating todos state
                setTodos(todos.filter(item => item.task_id !== id))
            }
        }).catch(e => {
            //Network or internal errors during request
            console.log(e)
            setError('Server is down.')
        })
    }

    //Rendring JSX
    return (
        <div>
            {
                todos.map(todo => <List 
                    item={todo} 
                    key={todo.task_id} 
                    completeTask={completeTask} 
                    deleteTask={deleteTask}
                />)
            }
        </div>
    )
}

export default TaskList
