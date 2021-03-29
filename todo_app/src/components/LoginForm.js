import React, {useState} from 'react'
import axios from 'axios'

function LoginForm({show, setShowForm, focusRef, setAuthToken, setUserName, setError}) {

    const [loginData, setLoginData] = useState({user_email:'', user_password:''})

    const loginHandler = e => {
        e.preventDefault()
        axios({
            method:'post',
            url:'http://localhost:8080/Login',
            data:{
                ...loginData
            }
        }).then(res => {
            console.log(res)
            if(res.data.error){
                console.log(res.data.error)
                setError(res.data.error.message)
            } else {
                setAuthToken(res.data.accessToken)
                setUserName(res.data.user.first_name + " " + res.data.user.last_name)
                
                const data = {
                    name : res.data.user.first_name + " " + res.data.user.last_name,
                    authToken : res.data.accessToken
                }
                window.localStorage.setItem("TodoListData", JSON.stringify(data))
            }
        }).catch(e => {
            console.log(e)
            setError('Server is down.')
        })
    }

    let element = <div>
                    <form onSubmit={loginHandler}>
                        <div>
                            <p>Log-In</p>
                        </div>
                        <div>
                            <input 
                            placeholder='Email' 
                            onChange={
                                e => setLoginData(
                                    prevState => ({ ...prevState, user_email:e.target.value}))} 
                            type='email' 
                            value={loginData.user_email} 
                            ref={focusRef} 
                            required 
                        />
                        </div>
                        <div>
                            <input 
                            placeholder='Password'  
                            type='password'
                            onChange={
                                e => setLoginData(
                                    prevState => ({ ...prevState, user_password:e.target.value}))} 
                            value={loginData.user_password} 
                            required />
                        </div>
                        <div>
                            <button>Login</button>
                        </div>
                    </form>
                    <button onClick={() => setShowForm(-1)} className="formChange">Register</button>
                </div>
    
    return (
        <>
        {
            show?element:null
        }
        </>
    )
}

export default LoginForm
