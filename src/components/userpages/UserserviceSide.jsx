import axios from 'axios'
import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode'

function UserserviceSide() {
  const [data, setserdata] = useState([])

  const getServiceData = async () => {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:6060/getallServiceData', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status === 200) {
      setserdata(res.data.message)
    }
  }

  const orderPost=async(orderId)=>{
    const token = localStorage.getItem('token')
    const decode= jwtDecode(token)
    console.log(decode.id)
    const resOrder = await axios.post('http://localhost:6060/orderpost',{
      orderuser_id:decode.id,
      service_id:orderId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(resOrder.status===200){
      alert('Order Success')
    }
  }
  
  useState(() => {
    getServiceData()
    const setInt=setInterval(getServiceData,1000);
    return clearInterval(setInt)
  }, [])
  return (
    <>
      <h1>Services</h1><br/>
        {data.length!==0?(
          <table>
          <thead>
            <tr>
              <th>service name</th>
              <th>minimum price</th>
              <th>maximum price</th>
              <th>service description</th>
              <th>about user</th>
              <th>diffServices</th>
              <th>qualification</th>
              <th>Order</th>
            </tr>
          </thead>
          <tbody>
        {data.map((serviceDetails) => (

            <tr key={serviceDetails.id}>
              <td>{serviceDetails.serviceName}</td>
              <td>{serviceDetails.minPrice}</td>
              <td>{serviceDetails.maxPrice}</td>
              <td>{serviceDetails.serviceDescription}</td>
              <td>{serviceDetails.aboutuserDescription}</td>
              <td>{serviceDetails.diffServices}</td>
              <td>{serviceDetails.qualification}</td>
              <button onClick={()=>orderPost(serviceDetails.id)}>Order</button> 
            </tr>
        ))}
          </tbody>
        </table>
        ):(
          <p>No Services Data</p>
        )}
    </>
  )
}

export default UserserviceSide
