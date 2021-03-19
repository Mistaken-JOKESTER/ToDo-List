import React, {useState} from 'react'
import axios from 'axios'

function RegisterForm() {

    const [registerData, setRegisterData] = useState({first_name:'', last_name:'', user_email:'', user_password:''})
    const [button, setButton] = useState(false)

    const loginHandler = e => {
        setButton(prevState => !prevState)
        e.preventDefault()
        axios({
            method: 'post',
            url: 'http://localhost:8080/register',
            data: {
              ...registerData
            }
        }).then(res => {
            console.log(res)
            setButton(prevState => !prevState)
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
                    <p>Register</p>
                </div>
                <div>
                        <input 
                            placeholder='First Name' 
                            onChange={
                                e => setRegisterData(
                                    prevState => ({ ...prevState, first_name:e.target.value}))} 
                            type='text' 
                            value={registerData.first_name} 
                            required
                        />
                </div>
                <div>
                        <input 
                            placeholder='Last Name' 
                            onChange={
                                e => setRegisterData(
                                    prevState => ({ ...prevState, last_name:e.target.value}))} 
                            type='text' 
                            value={registerData.last_name} 
                            required 
                        />
                </div>
                <div>
                        <input 
                            placeholder='Email' 
                            onChange={
                                e => setRegisterData(
                                    prevState => ({ ...prevState, user_email:e.target.value}))} 
                            type='email' 
                            value={registerData.user_email} 
                            required 
                        />
                </div>
                <div>
                        <input 
                            placeholder='Password' 
                            onChange={
                                e => setRegisterData(
                                    prevState => ({ ...prevState, user_password:e.target.value}))} 
                            type='password' 
                            value={registerData.user_password} 
                            required 
                        />
                </div>
                <div>
                    <button disabled={button}>Register</button>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm
