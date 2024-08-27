import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Table, Alert, Spinner } from 'react-bootstrap';

function UserOrder() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState({
    id: '',
    service_id: '',
    status: '',
    servicemessage: ''
  });
  const [normalMessage, setNormalMessage] = useState('');
  const [orderIds, setOrderIds] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
      setUser(response.data.users);
      const userMap = response.data.users.reduce((acc, user) => {
        acc[user.id] = user.firstname;
        return acc;
      }, {});
      setUserMap(userMap);
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

  const fetchMessages = async () => {
    if (!orderIds) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:6060/getmessages/${orderIds}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setMessages(response.data.data);
        const userMap = response.data.User.reduce((acc, user) => {
          acc[user.id] = user.firstname;
          return acc;
        }, {});
        setUserMap(userMap);
      }
    } catch (err) {
      setError('Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  const onUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:6060/updateOrders/${orderStatus.id}`, orderStatus, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        alert("Update successful");
        fetchOrders();
        setShowEditModal(false);
      }
    } catch (error) {
      alert("Update error");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:6060/messagepost', {
        orderID: orderIds,
        message: normalMessage
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setNormalMessage('');
        fetchMessages();
      }
    } catch (error) {
      alert("Failed to send message");
    }
  };

  const handleShowEditModal = (order) => {
    setOrderStatus({
      id: order.id,
      service_id: order.service_id,
      status: order.status,
      servicemessage: order.servicemessage
    });
    setShowEditModal(true);
  };

  const handleShowChatModal = (orderId) => {
    setOrderIds(orderId);
    fetchMessages();
    setShowChatModal(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [orderIds]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">User Orders</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Status</th>
            <th>Service Message</th>
            <th>User Id</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Edit</th>
            <th>Chat</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.id}>
                <td>
                  {order.status === 0 ? "Pending" :
                    order.status === 1 ? "Success" :
                      order.status === 2 ? "Cancelled" : "Unknown"}
                </td>
                <td>{order.servicemessage}</td>
                <td>{order.orderuser_id}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{new Date(order.updatedAt).toLocaleString()}</td>
                <td>
                  <Button variant="primary" onClick={() => handleShowEditModal(order)}>Edit</Button>
                </td>
                <td>
                  <Button variant="info" onClick={() => handleShowChatModal(order.id)}>Chat</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No Orders Found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onUpdateOrder}>
            <Form.Group controlId="formOrderStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" name="status" value={orderStatus.status} onChange={(e) => setOrderStatus({ ...orderStatus, status: e.target.value })}>
                <option value="0">Pending</option>
                <option value="1">Success</option>
                <option value="2">Cancelled</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formServiceMessage">
              <Form.Label>Service Message</Form.Label>
              <Form.Control type="text" name="servicemessage" value={orderStatus.servicemessage} onChange={(e) => setOrderStatus({ ...orderStatus, servicemessage: e.target.value })} />
            </Form.Group>
            <Button variant="primary" type="submit">Update</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showChatModal} onHide={() => setShowChatModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Loading messages...</p>
            </div>
          ) : (
            <>
              {error && <Alert variant="danger">{error}</Alert>}
              <ul className="list-unstyled">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <li key={message.id} className="media mb-3">
                      <img src="https://via.placeholder.com/50" className="mr-3" alt="User Avatar" />
                      <div className="media-body">
                        <h6 className="mt-0 mb-1"><strong>{userMap[message.userID] || "Unknown"}</strong>: {message.message}</h6>
                        <small className="text-muted">{new Date(message.createdAt).toLocaleString()}</small>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-center">No messages found</p>
                )}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Form onSubmit={sendMessage} className="w-100">
            <Form.Group className="mb-0">
              <Form.Control
                type="text"
                placeholder="Type your message here..."
                value={normalMessage}
                onChange={(e) => setNormalMessage(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="ml-2">Send</Button>
          </Form>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserOrder;
