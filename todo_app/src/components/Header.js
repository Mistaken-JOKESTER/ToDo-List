import axios from 'axios'
import React, {useState} from 'react'

//Header
//Render your username if logged in else welcome user
//Render Logoutbutton if logged in
function Header({userName, isLoggedIn, setAuthToken, authToken}) {

    //Funtion to hangle logout Clcik
    const logOut= ()=>{
        //Get request to clear the current token from database
        axios({
            method:'get',
            url:'http://localhost:8080/logout',
            headers:{
                auth:authToken
            }
        }).then(res => {
            //removing token from localstorage
            window.localStorage.removeItem('TodoListData')
            //Seting token state to null
            setAuthToken(null)
        }).catch(e => {
            //Network or internal errors during request
            console.log(e)
        })
    }

    //Rendring JSX
    return (
        <div>
            <header className="stickyHeader header">
                <h1 className='logo'>TO-Do &#10004;</h1>
                <div>
                    {
                        isLoggedIn ? 
                        <>
                            <label>{userName}</label><button onClick={logOut}>Logout</button>
                        </> :
                        <>
                            <label>{userName}</label>
                        </>
                    }
                </div>
            </header>
        </div>
    )
}

export default Header
