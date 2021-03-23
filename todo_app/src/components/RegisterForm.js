import React, {useState} from 'react'
import axios from 'axios'

function RegisterForm(isLoggedIn, show, setShowForm) {
    console.log(isLoggedIn , show)

    const [registerData, setRegisterData] = useState({first_name:'', last_name:'', user_email:'', user_password:''})
    const [button, setButton] = useState(false)

    const resgisterHandler = () => {

    }

    let element = <div>
                    <form onSubmit={resgisterHandler}>
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

    return (
        <>
        {
            isLoggedIn?element:null
        }
        </>
    )
}

export default RegisterForm
