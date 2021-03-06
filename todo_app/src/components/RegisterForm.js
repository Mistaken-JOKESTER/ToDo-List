import React, {useState} from 'react'
import axios from 'axios'

function RegisterForm({show, setShowForm, focusRef, setError}) {

    //State for regestratin form data
    const [registerData, setRegisterData] = useState({first_name:'', last_name:'', user_email:'', user_password:''})

    //Function for handling regestration(registration from)
    const resgisterHandler = (e) => {

        //Preventing page form refreshing
        e.preventDefault()

        //Post request to api for regestration
        axios({
            method:'post',
            url:'http://localhost:8080/register',
            data:{
                ...registerData
            }
        }).then(res => {
            //checking if errors exist
            if(res.data.error){
                //seting error state to show errors
                setError(res.data.error.message)
            } else {
                //clearing input form
                setRegisterData({first_name:'', last_name:'', user_email:'', user_password:''})
            }
        }).catch(e => {
            //Network or internal errors during request
            console.log(e)
            setError('Server is down.')
        })
    }

    //JSX for regestration form
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
                                    ref={focusRef}
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
                            <button>Register</button>
                        </div>
                    </form>
                    <button onClick={() => setShowForm(1)} className="formChange">Login</button>
                </div>

    //rendring JSX
    return (
        <>
        {
            show?element:null
        }
        </>
    )
}

export default RegisterForm
