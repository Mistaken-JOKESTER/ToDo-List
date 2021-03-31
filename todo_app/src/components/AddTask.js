import React, { useState } from 'react'
import axios from 'axios'

//Add task form
function AddTask({authToken, addToTodos}) {

    //State for task to be added
    const [task, setTask] = useState('')

    //Form handler for newly added task
    const addHandler = (e) => {

        //preventing page from refresh
        e.preventDefault()

        //sending post request to api for stroing newly created task to database
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
            //Adding task to todo state container
            addToTodos({discription: res.data.discription, task_id:res.data.tasks_id})
            //clearing form feild
            setTask('')
        }).catch(e => {
            //Network or internal errors during request
            console.log(e)
        })
    }

    //Rendring Jsx
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
