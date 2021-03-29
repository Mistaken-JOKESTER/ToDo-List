import axios from 'axios'
import React, {useState} from 'react'

function Header({userName, isLoggedIn, setAuthToken, authToken}) {

    const logOut= ()=>{
        axios({
            method:'get',
            url:'http://localhost:8080/logout',
            headers:{
                auth:authToken
            }
        }).then(res => {
            console.log(res)
            window.localStorage.removeItem('TodoListData')
            setAuthToken(null)
        }).catch(e => {
            console.log(e)
        })
    }

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
