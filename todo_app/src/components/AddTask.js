import React, { useState } from 'react'
import axios from 'axios'

function AddTask({authToken, addToTodos}) {

    const [task, setTask] = useState('')

    const addHandler = (e) => {
        e.preventDefault()
        console.log(task)
        axios({
            method:'post',
            url:'http://localhost:8080/addtask',
            headers:{
                auth:authToken
            },
            data:{
                discription:task
            }
        }).then(res => {
            console.log(res)
            addToTodos({discription: res.data.discription, task_id:res.data.tasks_id})
            setTask('')
        }).catch(e => {
            console.log(e)
        })
    }

    return (
        <div className='addTask'>
            <form onSubmit={addHandler}>
                <input type='text' placeholder="task" value={task} onChange={(e) => setTask(e.target.value)} />
                <button onClick={addHandler}>Add</button>
            </form>
        </div>
    )
}

export default AddTask
