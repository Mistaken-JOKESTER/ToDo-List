import React, {useState} from 'react'
import axios from 'axios'

function LoginForm({show, setShowForm, focusRef, setAuthToken, setUserName, setError}) {

    //State for login email and password
    const [loginData, setLoginData] = useState({user_email:'', user_password:''})

    //Function for handling login(submition of form)
    const loginHandler = e => {
        //Preventing page from refresh
        e.preventDefault()

        //Making post request to api for login
        axios({
            method:'post',
            url:'http://localhost:8080/Login',
            data:{
                ...loginData
            }
        }).then(res => {
            //Checking response
            if(res.data.error){
                //showing errors
                setError(res.data.error.message)
            } else {
                //Seting state of token and userName
                setAuthToken(res.data.accessToken)
                setUserName(res.data.user.first_name + " " + res.data.user.last_name)
                
                //Storing username and token to local storage
                const data = {
                    name : res.data.user.first_name + " " + res.data.user.last_name,
                    authToken : res.data.accessToken
                }
                window.localStorage.setItem("TodoListData", JSON.stringify(data))
            }
        }).catch(e => {
            //Errors occured during request
            console.log(e)
            setError('Server is down.')
        })
    }

    //Jsx for login form
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
    
    //rendering JSX
    return (
        <>
        {
            show?element:null
        }
        </>
    )
}

export default LoginForm
