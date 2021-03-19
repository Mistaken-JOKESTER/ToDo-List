import React, {useState} from 'react'

function Header() {

    const [logedIn, setLogedIn] = useState(true)

    const logout = () => {
        setLogedIn(prevState => !prevState)
    }

    return (
        <div>
            <header className="stickyHeader header">
                <h1 className='logo'>TO-Do &#10004;</h1>
                <div>
                    {
                        logedIn ? 
                        <>
                            <label>Ankit Sharma</label><button onClick={logout}>Logout</button>
                        </> :
                        <>
                            <label>You should Login</label>
                        </>
                    }
                </div>
            </header>
        </div>
    )
}

export default Header
