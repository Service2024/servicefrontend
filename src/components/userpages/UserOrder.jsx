import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Alert, Spinner, Card } from 'react-bootstrap';

function UserOrder() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [usersss, setUsesr] = useState([]);
  const [service, setService] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [serviceMap, setServiceMap] = useState({});
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
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    orderID: '',
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    paymentAmount: '',
    paymentAddress: '',
    paymentCity: '',
    paymentState: '',
    paymentPostalcode: '',
  });

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found in local storage');

      const response = await axios.get('http://localhost:6060/userorders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.orders);
      setUsesr(response.data.users);
      setService(response.data.services);
      const userMap = response.data.users.reduce((acc, user) => {
        acc[user.id] = user.firstname;
        return acc;
      }, {});
      setUserMap(userMap);

      const serviceMap = response.data.services.reduce((acc, service) => {
        acc[service.id] = service.serviceName;
        return acc;
      }, {});
      setServiceMap(serviceMap);
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        alert('Update successful');
        fetchOrders();
        setShowEditModal(false);
      }
    } catch (error) {
      alert('Update error');
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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setNormalMessage('');
        fetchMessages();
      }
    } catch (error) {
      alert('Failed to send message');
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

  const onSubmitPayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:6060/paymentorder', paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        alert('Payment Success');
        setPaymentModal(false);
      }
    } catch (error) {
      alert(`Payment error ${error}`);
    }
  };

  const onClickModal = (ord) => {
    setPaymentData(prevData => ({ ...prevData, orderID: ord.id }));
    setPaymentModal(true);
  };

  const submitPaymentHandler = (e) => {
    const { name, value } = e.target;
    setPaymentData(prevData => ({ ...prevData, [name]: value }));
  };

  const [getpaymentstatus, setpaymentstatus] = useState([])
  const getFunction = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:6060/getpaymentorder', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setpaymentstatus(res.data.data)
    } catch (error) {
      alert(`Payment error ${error}`);
    }
  }
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewPost, setReview] = useState({
    order_ID: '',
    points: '',
    comment: ''
  })

  const onChangeReviewHandler = (e) => {
    const { name, value } = e.target;
    setReview({ ...reviewPost, [name]: value })
  }

  const reviewHandle = (order) => {
    setReview({
      order_ID:order.id,
      points:'',
      comment:''
    })
    setShowReviewModal(!showReviewModal)
  }

  const sendReview = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const resp = await axios.post('http://localhost:6060/reviewpost', reviewPost, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (resp.status === 200) {
        alert("Review Success")
        setShowReviewModal(false)
      }
    } catch (error) {
      alert(`Review Order error ${error}`);
    }
  }
  
  useEffect(() => {
    fetchOrders();
    getFunction();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [orderIds]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">User Orders</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="row">
        {orders.length > 0 ? (
          orders.map(order => (
            <div className="col-md-4 mb-3" key={order.id}>
              <Card key={order.id}>
                <Card.Body key={order.id}>
                  <Card.Title>
                    Order ID: {order.id}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    <strong style={{
                      color: order.status === 0 ? "#39f" :
                        order.status === 1 ? "Green" :
                          order.status === 2 ? "Red" :
                            order.status === 3 ? "#00008B" : "#123456"

                    }}>
                      Status: {order.status === 0 ? "Pending" :
                        order.status === 1 ? "Accepted" :
                          order.status === 2 ? "Cancelled" :
                            order.status === 3 ? "Completed" : "Unknown"}
                    </strong>
                  </Card.Subtitle>
                  {/* <Card.Text>
                    <strong>Service Message:</strong> {order.servicemessage}
                  </Card.Text> */}
                  {usersss.map(rr => (
                    <Card.Text>
                      <strong>Worker Name:</strong> {rr.firstname}
                    </Card.Text>
                  ))}
                  <Card.Text>
                    <strong>Service Name:</strong> {serviceMap[order.service_id] || "Unknown"}
                  </Card.Text>


                  <Card.Text>
                    <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
                  </Card.Text>

                  <div className="d-flex justify-content-between">
                    {(order.status === 0 || order.status === 1) && (
                      <Button variant="primary" onClick={() => handleShowEditModal(order)}>Edit</Button>
                    )}

                    <Button variant="info" onClick={() => handleShowChatModal(order.id)}>Chat</Button>
                    {order.status === 3 && order.paymentstatus == 0 && (
                      <Button variant="warning" onClick={() => { onClickModal(order); setPaymentModal(true); }}>Payment Order</Button>
                    )}
                    {order.paymentstatus == 1 && (
                      <>
                        <Button variant="dark" onClick={() => alert(order.id)}>View Bill</Button>
                        <Button variant='outline-primary' onClick={()=>reviewHandle(order)}>Review</Button>
                      </>
                    )}
                  </div>

                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-12">
            <Alert variant="info" className="text-center">No Orders Found</Alert>
          </div>
        )}
      </div>
      {showReviewModal &&
        <div>
          <form onSubmit={sendReview}>
            <input type="text" name='points' placeholder='Enter points' value={reviewPost.points} onChange={onChangeReviewHandler} />
            <input type="text" name='comment' placeholder='Enter Comment' value={reviewPost.comment} onChange={onChangeReviewHandler} />
            <Button variant='outline-primary' type='submit'>Review</Button>
          </form>
        </div>
      }
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onUpdateOrder}>
            <Form.Group controlId="formOrderStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" name="status" value={orderStatus.status} onChange={(e) => setOrderStatus({ ...orderStatus, status: e.target.value })}>
                {/* <option value="0">Pending</option> */}
                {/* <option value="1">Accepted</option> */}
                <option value="2">Cancelled</option>
                {/* <option value="3">Completed</option> */}
              </Form.Control>
            </Form.Group>
            {/* <Form.Group controlId="formServiceMessage">
              <Form.Label>Service Message</Form.Label>
              <Form.Control type="text" name="servicemessage" value={orderStatus.servicemessage} onChange={(e) => setOrderStatus({ ...orderStatus, servicemessage: e.target.value })} />
            </Form.Group> */}
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
                      <img src="https://via.placeholder.com/50" className="mr-3 rounded-circle" alt="User Avatar" />
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

      <Modal show={paymentModal} onHide={() => setPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmitPayment}>
            <Form.Group controlId="formCardName">
              <Form.Label>Card Name</Form.Label>
              <Form.Control type="text" name="cardName" value={paymentData.cardName} placeholder="Enter card name" onChange={submitPaymentHandler} />
            </Form.Group>
            <Form.Group controlId="formCardNumber">
              <Form.Label>Card Number</Form.Label>
              <Form.Control type="text" name="cardNumber" value={paymentData.cardNumber} placeholder="Enter card number" onChange={submitPaymentHandler} />
            </Form.Group>
            <Form.Group controlId="formExpMonth">
              <Form.Label>Expiration Month</Form.Label>
              <Form.Control type="text" name="expMonth" value={paymentData.expMonth} placeholder="Enter expiration month" onChange={submitPaymentHandler} />
            </Form.Group>
            <Form.Group controlId="formExpYear">
              <Form.Label>Expiration Year</Form.Label>
              <Form.Control type="text" name="expYear" value={paymentData.expYear} placeholder="Enter expiration year" onChange={submitPaymentHandler} />
            </Form.Group>
            <Form.Group controlId="formPaymentAmount">
              <Form.Label>Payment Amount</Form.Label>
              <Form.Control type="text" name="paymentAmount" value={paymentData.paymentAmount} placeholder="Enter payment amount" onChange={submitPaymentHandler} />
            </Form.Group>
            <Form.Group controlId="formPaymentAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="paymentAddress" value={paymentData.paymentAddress} placeholder="Enter address" onChange={submitPaymentHandler} />
            </Form.Group>
            <Form.Group controlId="formPaymentCity">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" name="paymentCity" value={paymentData.paymentCity} placeholder="Enter city" onChange={submitPaymentHandler} />
            </Form.Group>
            <Form.Group controlId="formPaymentState">
              <Form.Label>State</Form.Label>
              <Form.Control type="text" name="paymentState" value={paymentData.paymentState} placeholder="Enter state" onChange={submitPaymentHandler} />
            </Form.Group>
            <Form.Group controlId="formPaymentPostalcode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control type="text" name="paymentPostalcode" value={paymentData.paymentPostalcode} placeholder="Enter postal code" onChange={submitPaymentHandler} />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserOrder;
