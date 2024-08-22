import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import UserOrder from '../userpages/UserOrder';

function Workerorder() {
  const [data, setData] = useState([]);
  const [userd,setuserd]=useState([])
  const getData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:6060/workorders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setData(response.data.orders);
        setuserd(response.data.userDetailsForRequest);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [modal, setmodal] = useState(false)
  const fModal = () => {
    setmodal(!modal)
  }
  const [mesData, setmesData] = useState({
    orderuser_id: '',
    service_id: '',
    status: '',
    servicemessage: ''
  })
  const onchangeHAndler = (e) => {
    const { name, value } = e.target;
    setmesData({
      ...mesData,
      [name]: value
    })
  }
  const updateOrder = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const orderUpdate = await axios.put(`http://localhost:6060/updateOrders/${mesData.id}`, mesData, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    if (orderUpdate) {
      alert('updated succesfully')
      getData()
      setmodal(false)
    }
  }

  const updateOrders = (orders) => {
    const token = localStorage.getItem('token');
    setmesData({
      id: orders.id,
      service_id: orders.service_id,
      status: orders.status,
      servicemessage: orders.servicemessage
    })
    setmodal(true);
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
        <div>
      <h1>Work Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Message</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.id}>
              <td>{order.status===0?"pending":
                   order.status===1?"success":
                   order.status===2?"Cancel":"unknown"}</td>
              <td>{order.servicemessage}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{new Date(order.updatedAt).toLocaleString()}</td>
              <td><button onClick={() => updateOrders(order)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {modal && (
        <div>
          <form onSubmit={updateOrder}>
            <select name="status"  value={mesData.status} onChange={onchangeHAndler}>
              <option value="0">Pending</option>
              <option value="1">Success</option>
              <option value="2">Cancel</option>
            </select>
            <input type="text" name='servicemessage' value={mesData.servicemessage} onChange={onchangeHAndler} />
            <button>Update</button>
          </form>
        </div>
      )}


      {userd.map((uorder) => (
        <ul>
          <li>{uorder.firstname}</li>
        </ul>
      ))}
    </div></>
  );
}

export default Workerorder;
