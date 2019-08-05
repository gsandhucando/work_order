import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../env.json'

import WorkOrder from './WorkOrder';

function Header() {

  let [workOrders, setWorkOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  let [savedWorkOrders, setSavedWorkOrders] = useState([]);
  let [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    //call the work orders
    axios.get(`${env.API_URL}/assessment/work_orders`)
      .then(res => {
        setErrorMessage('')
        //set workorders
        setWorkOrders(res.data.orders)
        //have to keep original data before changing so had to set original copy then set it
        setSavedWorkOrders(res.data.orders)
        //setting error message if res.status === 200
        const workerTracker = new Set();
        let allWorkers = [];
        res.data.orders.forEach(order => {
          if (!workerTracker.has(order.workerId)) {
            workerTracker.add(order.workerId);
            const req = axios.get(`${env.API_URL}/assessment/workers/${order.workerId}`)
            .then(res => {
              return res.data.worker
            });
            allWorkers.push(req)
          }
        });
        return Promise.all(allWorkers);
      })
      .then(data => {
        setWorkers(data)
      })
      .catch(err => {
        console.log(err)
        //set error message if bad request
        setErrorMessage('Cant find work orders.')
      })

  }, [])

  function onInputChange(event) {
    let inputInfo = event.target.value.replace(' ', '').toLowerCase().trim()
    const foundIndex =  workers.findIndex(worker => worker.name.replace(' ', '').toLowerCase().trim() === inputInfo)
    let filteredOrders = [];
    if (foundIndex !== -1) {
      filteredOrders = savedWorkOrders.filter(each => each.workerId === workers[foundIndex].id)
    }
    if (filteredOrders.length > 0) {
      setWorkOrders(filteredOrders)
    } else {
      if (workOrders.length !== savedWorkOrders.length) {
        setWorkOrders(savedWorkOrders)
      }
    }
  }

  function earliest() {
    let sortedWorkOrder = workOrders.slice()
    sortedWorkOrder.sort((a, b) => {
      return a.deadline - b.deadline
    })
    setWorkOrders(sortedWorkOrder)
  }

  function latest() {
    let sortedWorkOrder = workOrders.slice()
    sortedWorkOrder.sort((a, b) => {
      return b.deadline - a.deadline
    })
    setWorkOrders(sortedWorkOrder)
  }

  // function savedWork(workerName, worker_id) {
  //   //created object copy hash table that takes in the workers key = name and value = id
  //   const newWorkerName = workerName.replace(' ', '').toLowerCase().trim();
  //   const newSavedWorkers = { ...savedWorkers, [newWorkerName]: worker_id }
  //   console.log(newSavedWorkers, 'in saved work')
  //   setSavedWorkers.call(this, newSavedWorkers)
  // }
  return (
    <div>
      {/* set error message remember to setErrorMessage to '' if good request */}
      <input className='body-input' onChange={onInputChange} type='text' placeholder='Please enter name' />
      <div className="body-btn-container">
      <button className="body-btn" onClick={earliest}>EARLIEST</button>
      <button className="body-btn" onClick={latest}>LATEST</button>
      </div>
      <div className="body-card-container">
        {workOrders.map(order => {
          const worker = workers.find(worker => order.workerId === worker.id);
          console.log(worker);
          return worker ? <WorkOrder key={order.id} {...order} worker={worker} /> : null
        })
        }
      </div>
    </div>
  )
}

export default Header;