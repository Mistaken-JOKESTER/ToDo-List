import React, {useState, useContext} from 'react'
import axios from 'axios'
import { TokenContext } from '../App'

function LoginForm() {

    const [loginData, setLoginData] = useState({user_email:'', user_password:''})
    const [button, setButton] = useState(false)
    const tokenContext = useContext(TokenContext)

    const loginHandler = e => {
        setButton(prevState => !prevState)
        e.preventDefault()
        axios({
            method: 'post',
            url: 'http://localhost:8080/login',
            data: {
              ...loginData
            }
        }).then(res => {
            console.log(res)
            setButton(prevState => !prevState)
            //tokenContext.setAuthToken(res.data.accessToken)
            console.log(res.accessToken)
        }).catch(e => {
            console.log(e)
            setButton(prevState => !prevState)
            console.log(e)
        })

    }

    return (
        <div>
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
                    <button disabled={button}>Login</button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm
