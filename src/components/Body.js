import React, {useState, useEffect} from 'react';
import axios from 'axios';
import env from '../env.json'

import WorkOrder from './WorkOrder';

const Header = () => {
  let [ workOrders, setWorkOrders ] = useState([]);
  let [ savedWorkers, setSavedWorkers ] = useState({});
  let [savedWorkOrders, setSavedWorkOrders] = useState([]);
  let [errorMessage, setErrorMessage] = useState('')

  useEffect(()=> {
    //call the work orders
    axios.get(`${env.API_URL}/assessment/work_orders`)
    .then(res => {
      //set workorders
      setWorkOrders(res.data.orders)
      //have to keep original data before changing so had to set original copy then set it
      setSavedWorkOrders(res.data.orders)
      //setting error message if res.status === 200
      setErrorMessage('')
    })
    .catch(err => {
      console.log(err)
      //set error message if bad request
      setErrorMessage('Cant find work orders.')
    })

  }, [])

  function onInputChange(event) {
    console.log(event.target.value)
    let inputInfo = event.target.value.replace(' ', '').toLowerCase().trim()
    let filteredOrders = savedWorkOrders.filter(each => {
      //hash table
      return each.workerId === savedWorkers[inputInfo]
    })
    if (filteredOrders.length > 0) {
      setWorkOrders(filteredOrders)
    } else {
      if(workOrders.length !== savedWorkOrders.length){
        setWorkOrders(savedWorkOrders)
      }
    }
  }

  function earliest() {
    let sortedWorkOrder = workOrders.slice()
    sortedWorkOrder.sort((a,b) => {
      return a.deadline-b.deadline
    })
    setWorkOrders(sortedWorkOrder)
  }

  function latest() {
    let sortedWorkOrder = workOrders.slice()
    sortedWorkOrder.sort((a,b) => {
      return b.deadline-a.deadline
    })
    console.log(sortedWorkOrder)
    setWorkOrders(sortedWorkOrder)
  }

  function savedWork(workerName, worker_id) {
    //created object copy hash table that takes in the workers key = name and value = id
    let newSavedWorkers = Object.assign({}, savedWorkers, {[workerName.replace(' ', '').toLowerCase().trim()]: worker_id})
    setSavedWorkers(newSavedWorkers)
  }
  console.log(savedWorkers)
  return(
    <div>
      {/* set error message remember to setErrorMessage to '' if good request */}
      <input onChange={onInputChange} type='text' placeholder='Please enter name'/>
      <button onClick={earliest}>EARLIEST</button>
      <button onClick={latest}>LATEST</button>
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
    { workOrders.map(order => {
      return <WorkOrder key={order.id} {...order} savedWork={savedWork} />
    })
    }
    </div>
    </div>
  )
}

export default Header;