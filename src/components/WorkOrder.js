import React from 'react';

const WorkOrder = ({name, description, deadline, worker}) => {

  const {email, companyName, image} = worker
  const worker_name = worker.name
  const formatedDate = new Date(deadline)


  return(
    <div className="worker-order-container">
      <div className="work-order-card">
      <div>
      <h3>{name}</h3>
      <h5>{description}</h5>
      </div>
      <div>
        <div className='work-order-img-container' >
          <img className='work-order-img' src={image} alt='worker' />
          <div className="work-order-worker-info">
            <p>{worker_name}</p>
            <p>{companyName}</p>
            <p>{email}</p>
          </div>
        </div>
      </div>
      <div className='work-order-worker-date'>
      {`${formatedDate.getMonth()}/${formatedDate.getDate()}/${formatedDate.getFullYear()} ${formatedDate.toLocaleTimeString('en-US')}`}
      </div>
      </div>
    </div>
  )
}

export default WorkOrder;