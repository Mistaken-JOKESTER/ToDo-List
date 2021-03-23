import React, {useState} from 'react'
import axios from 'axios'

function LoginForm({show, setShowForm, isLoggedIn}) {

    const [loginData, setLoginData] = useState({user_email:'', user_password:''})
    const [button, setButton] = useState(false)

    const loginHandler = e => {
        
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
                    <button onClick={() => setShowForm(-1)}></button>
                </div>
    
    return (
        <>
        {
            !isLoggedIn && show?element:null
        }
        </>
    )
}

export default LoginForm
