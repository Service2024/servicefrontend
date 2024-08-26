import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function Workerorder() {
  const [data, setData] = useState([]);
  const [userd, setUserd] = useState([]);
  const [modalType, setModalType] = useState(null); // 'edit' or 'chat'
  const [mesData, setMesData] = useState({
    orderuser_id: '',
    service_id: '',
    status: '',
    servicemessage: ''
  });
  const [messages, setMessages] = useState([]);
  const [messageModal, setMessageModal] = useState('');
  const [orderId, setOrderId] = useState('');
  const [useDatekis, setUseDatekis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setUserd(response.data.userDetailsForRequest);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const orderUpdate = await axios.put(`http://localhost:6060/updateOrders/${mesData.id}`, mesData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (orderUpdate) {
        alert('Updated successfully');
        getData();
        setModalType(null); // Close the modal
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.post('http://localhost:6060/messagepost', {
        orderID: orderId,
        message: messageModal
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (resp.status === 200) {
        alert('Message sent successfully');
        setMessageModal('');
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const fetchMessages = async () => {
    if (!orderId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:6060/getmessages/${orderId}`, {
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
        setUseDatekis(userMap);
      }
    } catch (err) {
      setError('Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [orderId]);

  const handleEditModalShow = (order) => {
    setMesData({
      id: order.id,
      service_id: order.service_id,
      status: order.status,
      servicemessage: order.servicemessage
    });
    setModalType('edit');
  };

  const handleChatModalShow = (order) => {
    setOrderId(order.id);
    setModalType('chat');
  };

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
              <th>Chat</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr key={order.id}>
                <td>{order.status === 0 ? 'Pending' : order.status === 1 ? 'Success' : order.status === 2 ? 'Cancel' : 'Unknown'}</td>
                <td>{order.servicemessage}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{new Date(order.updatedAt).toLocaleString()}</td>
                <td><Button onClick={() => handleEditModalShow(order)}>Edit</Button></td>
                <td><Button onClick={() => handleChatModalShow(order)}>Chat</Button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Order Modal */}
        <Modal show={modalType === 'edit'} onHide={() => setModalType(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={updateOrder}>
              <Form.Group controlId="formOrderStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" name="status" value={mesData.status} onChange={(e) => setMesData({ ...mesData, [e.target.name]: e.target.value })}>
                  <option value="0">Pending</option>
                  <option value="1">Success</option>
                  <option value="2">Cancel</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formServiceMessage">
                <Form.Label>Service Message</Form.Label>
                <Form.Control type="text" name="servicemessage" value={mesData.servicemessage} onChange={(e) => setMesData({ ...mesData, [e.target.name]: e.target.value })} />
              </Form.Group>
              <Button variant="primary" type="submit">Update</Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Chat Modal */}
        <Modal show={modalType === 'chat'} onHide={() => setModalType(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Chat</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container mt-4">
              <div className="row">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body" style={{ height: '400px', overflowY: 'scroll' }}>
                      {loading && <div className="alert alert-info">Loading messages...</div>}
                      {error && <div className="alert alert-danger">{error}</div>}
                      <ul className="list-unstyled">
                        {messages.map((message) => (
                          <li key={message.id} className="media mb-3">
                            <img
                              src="https://via.placeholder.com/50"
                              className="mr-3 rounded-circle"
                              alt="User Avatar"
                            />
                            <div className="media-body">
                              <h6 className="mt-0 mb-1"><strong>{useDatekis[message.userID] || "Unknown"}</strong>: {message.message}</h6>
                              <small className="text-muted">{new Date(message.createdAt).toLocaleString()}</small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Modal.Footer>
                      <Form onSubmit={sendMessage}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            placeholder="Type your message here..."
                            value={messageModal}
                            onChange={(e) => setMessageModal(e.target.value)}
                          />
                        </Form.Group>
                        <Button variant="primary" type="submit">Send</Button>
                      </Form>
                    </Modal.Footer>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Workerorder;
