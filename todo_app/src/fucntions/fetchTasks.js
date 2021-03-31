import axios from "axios"

//Fuction to fetch task
//Executed when starting app if authtoken is present in localstorage
function fetchTasks(token, setTodos, setError) {

    //get request for fetching todos from database
    axios({
        method:'get',
        url:'http://localhost:8080/tasks/all',
        headers:{
            auth: token
        }
    }).then(res => {
        //chekcing if any errors
        if(res.data.error){
            //setting error state to show it to user
            setError(res.data.error.message)
        } else {
            //setting todos
            setTodos(res.data)
        }
        console.log(res)
    }).catch(e => {
        //Network or internal errors during request
        console.log(e)
        setError('Server is down.')
    })
    
    return
}

export default fetchTasks
