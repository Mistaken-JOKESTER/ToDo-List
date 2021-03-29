import axios from "axios"

function fetchTasks(token, setTodos, setError) {
    let result ={}
    axios({
        method:'get',
        url:'http://localhost:8080/tasks/all',
        headers:{
            auth: token
        }
    }).then(res => {
        if(res.data.error){
            console.log(res.data.error)
            setError(res.data.error.message)
        } else {
            result.data = res.data
            setTodos(res.data)
        }
        console.log(res)
    }).catch(e => {
        console.log(e)
        result.data = []
        setError('Server is down.')
    })

    return result
}

export default fetchTasks
