import React from 'react'

//Redrer the task
//If task is complete delete task option is only availabe and text is crossed
//If task is incomplete mark complete and delete task opiton is availabe
function List({item, completeTask, deleteTask}) {

    //item is task
    //contains - discription, task_id, task_status
    //Rendring JSX
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
