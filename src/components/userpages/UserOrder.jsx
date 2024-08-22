import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserOrder() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [user, userData] = useState([]);
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found in local storage');
        }

        const response = await axios.get('http://localhost:6060/userorders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.orders);
        userData(response.data.users);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert('Token expired, please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(error.message);
        }
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div>
      <h1>User Orders</h1>
      {error && <p>Error: {error}</p>}
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Service Message</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>
                {order.status === 0 ? "Pending" :
                 order.status === 1 ? "Success" :
                 order.status === 2 ? "Cancel" : "Unknown"}
              </td>
              <td>{order.servicemessage}</td>
              <td>{order.orderuser_id}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{new Date(order.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {user.map(userss => (
        <ul key={userss.id}>
          <li>{userss.firstname}</li>
          <li></li>
        </ul>
      ))}
    </div>
  );
}

export default UserOrder;
