import React from 'react';
const statusClasses={
      Completed:'badge bg-success',
      Failed:'badge bg-danger',
      Running:'badge bg-warning text-dark',
      Scheduled:'badge bg-primary'
};
const statusIcons={
      Completed:'bi-check-circle-fill',
      Failed:'bi-x-circle-fill',
      Running:'bi-arrow-repeat',
      Scheduled:'bi-clock-fill'
};
function TaskCard({task,onRunNow})
{
  return(
      <>
         <div className="card h-100 shadow-sm">
           <div className="card-body d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0">{task.name}</h5>
              <span className={statusClasses[task.status]}>
                <i className={`bi ${statusIcons[task.status]} me-1`}></i>
                {task.status}
              </span>
            </div>
            <p className="card-text text-muted flex-grow-1">{task.description}</p>
            <p className="card-text mb-1"><small className='text-muted'>Last Run:{task.lastRunTime}</small></p>
            <p className="card-text"><small className='text-muted'>Triggered By:{task.triggeredBy}</small></p>
            <div className='d-flex gap-2 mt-auto'>
            <button onClick={()=>onRunNow(task.id)} className='btn btn-warning btn-sm'>
              <i className='bi bi-play-fill me-1'></i>
              Run Now
            </button>
            <button onClick={()=>alert("showing logs...")} className='btn btn-secondary btn-sm '>
              <i className='bi bi-file-earmark me-1'></i>View Logs
            </button>
            <button onClick={()=>alert('edit config clicked')} className='btn btn-info btn-sm text-white'>
              <i className='bi bi-gear-fill me-1'></i>Edit Config
            </button>
            </div>
           </div>
         </div>
      </>
  )
}
export default TaskCard
