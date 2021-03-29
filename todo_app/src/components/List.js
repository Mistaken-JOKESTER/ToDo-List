
import React from 'react'

function List({item, completeTask, deleteTask}) {

    return (
        <div className='list'>
            {item.task_status
            ?<del>
                {item.discription}
            </del>
            :<>
                {item.discription}
            </>
            }
            
            <div>
                {item.task_status
                    ?
                        null
                    :<>
                        <button onClick={() => completeTask(item.task_id)} >&#10004;</button>
                    </>
                }
                <button onClick={() => deleteTask(item.task_id)} >&#10008;</button>
            </div>
        </div>
    )
}

export default List
