import React from 'react'
import List from './List'
import axios from 'axios'

function TaskList({todos, setTodos, token, setError}) {
    const completeTask = (id) => {
        axios({
            url:`http://localhost:8080/completeTask/${id}`,
            method:'get',
            headers:{
                auth:token
            }
        }).then(res => {
            console.log(res)
            if(res.data.error){
                console.log(res.data.error)
                setError(res.data.error.message)
            } else { 
                //setTodos(todos.filter(item => item.task_id !== id))
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
            console.log(e)
        })
    }

    const deleteTask = (id) => {
        axios({
            url:`http://localhost:8080/deletetask/${id}`,
            method:'get',
            headers:{
                auth:token
            }
        }).then(res => {
            console.log(res)
            if(res.data.error){
                console.log(res.data.error)
                setError(res.data.error.message)
            } else{ 
                setTodos(todos.filter(item => item.task_id !== id))
            }
        }).catch(e => {
            console.log(e)
            setError('Server is down.')
        })
    }

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
