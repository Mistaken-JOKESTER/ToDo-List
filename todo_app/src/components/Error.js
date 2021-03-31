import React, {useState} from 'react'

//Component for showing errors if any
//error State is passed as prop to show error
//Function clear Error is passed as prop to clear error
function Error({error, clearError}) {
    
    //Rendring JSX
    return (
        <>
        {
            error?
            <div className="error">
                {error}
                <button onClick={clearError}>&#10006;</button>
            </div>
            :null
        }
        </>
    )
}

export default Error
