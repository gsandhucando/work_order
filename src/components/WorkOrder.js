import React, {useEffect, useState} from 'react';
import axios from 'axios';
import env from '../env.json'

const WorkOrder = ({workerId, name, description, deadline, id, savedWork}) => {
  let [worker, setWorker] = useState({})
// console.log(workerId)

useEffect(() => {
  axios.get(`${env.API_URL}/assessment/workers/${workerId}`)
  .then(response => {
    setWorker(response.data.worker)
    //the state we want to change is in body but we need to keep track of all the workers so we use the hash table in the body it passes the information back
    savedWork(response.data.worker.name, response.data.worker.id)
  })
  .catch(err => {
    console.log(err)
    //do same as body
  })
}, [])

  let styles = {
    workOrderContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    wordOrderCard: {
      margin: 10,
      height: '40vh',
      width: '40vw',
      background: 'aqua',
    },

  }

  let {email, companyName, image} = worker
  let worker_name = worker.name
  let formatedDate = new Date(deadline)


  return(
    <div style={styles.workOrderContainer}>
      <div style={styles.wordOrderCard}>
      <div>
      <h3>{name}</h3>
      <h5>{description}</h5>
      </div>
      <div>
        <div style={{display: 'flex', padding: '10px 0 0 10px'}}>
          <img style={{borderRadius: '50%', height: 100}} src={image} />
          <div>
            <p>{worker_name}</p>
            <p>{companyName}</p>
            <p>{email}</p>
          </div>
        </div>
      </div>
      <div style={{textAlign: 'right'}}>
      {`${formatedDate.getMonth()}/${formatedDate.getDate()}/${formatedDate.getFullYear()} ${formatedDate.toLocaleTimeString('en-US')}`}
      </div>
      </div>
    </div>
  )
}

export default WorkOrder;