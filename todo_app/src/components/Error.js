import React, {useState} from 'react'

function Error({error, clearError}) {
    
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
