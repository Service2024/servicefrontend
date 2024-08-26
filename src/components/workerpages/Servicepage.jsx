import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Servicepage() {
    const [addService, setAddService] = useState({
        serviceName: '',
        minPrice: '',
        maxPrice: '',
        serviceDescription: '',
        aboutuserDescription: '',
        diffServices: '',
        qualification: ''
    });

    const [serData, setSerData] = useState([]);
    const [modalType, setModalType] = useState(null); // 'add' or 'edit'
    const [editsr, setEditService] = useState({
        id: '',
        serviceName: '',
        minPrice: '',
        maxPrice: '',
        serviceDescription: '',
        aboutuserDescription: '',
        diffServices: '',
        qualification: ''
    });

    // Function to handle input changes for add and edit forms
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setAddService(prevState => ({ ...prevState, [name]: value }));
    };

    const editOnChange = (e) => {
        const { name, value } = e.target;
        setEditService(prevState => ({ ...prevState, [name]: value }));
    };

    // Function to add a service
    const addServiceFunction = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:6060/addservice', addService, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                alert('Service added successfully');
                getServiceDetails();
                setModalType(null);
            }
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    // Function to fetch service details
    const getServiceDetails = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:6060/getservice', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                setSerData(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    // Function to update a service
    const editService = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`http://localhost:6060/updservice/${editsr.id}`, editsr, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                alert('Service updated successfully');
                getServiceDetails();
                setModalType(null);
            }
        } catch (error) {
            console.error('Error updating service:', error);
        }
    };

    // Function to delete a service
    const deleteService = async (serviceId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`http://localhost:6060/deleteservice/${serviceId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                alert('Service deleted successfully');
                getServiceDetails();
            }
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    // Function to open the edit modal and set service data
    const serviceUpdate = (service) => {
        setEditService({
            id: service.id,
            serviceName: service.serviceName,
            minPrice: service.minPrice,
            maxPrice: service.maxPrice,
            serviceDescription: service.serviceDescription,
            aboutuserDescription: service.aboutuserDescription,
            diffServices: service.diffServices,
            qualification: service.qualification
        });
        setModalType('edit');
    };

    useEffect(() => {
        getServiceDetails();
    }, []);

    return (
        <>
            <Button variant="primary" onClick={() => setModalType('add')}>
                Add Service
            </Button>

            <Modal show={modalType === 'add'} onHide={() => setModalType(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addServiceFunction}>
                        <Form.Group controlId="formServiceName">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="serviceName"
                                value={addService.serviceName}
                                onChange={onChangeHandler}
                                placeholder="Enter service name"
                            />
                        </Form.Group>
                        <Form.Group controlId="formMinPrice">
                            <Form.Label>Min Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="minPrice"
                                value={addService.minPrice}
                                onChange={onChangeHandler}
                                placeholder="Enter min price"
                            />
                        </Form.Group>
                        <Form.Group controlId="formMaxPrice">
                            <Form.Label>Max Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="maxPrice"
                                value={addService.maxPrice}
                                onChange={onChangeHandler}
                                placeholder="Enter max price"
                            />
                        </Form.Group>
                        <Form.Group controlId="formServiceDescription">
                            <Form.Label>Service Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="serviceDescription"
                                value={addService.serviceDescription}
                                onChange={onChangeHandler}
                                placeholder="Enter service description"
                            />
                        </Form.Group>
                        <Form.Group controlId="formAboutUserDescription">
                            <Form.Label>About User Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="aboutuserDescription"
                                value={addService.aboutuserDescription}
                                onChange={onChangeHandler}
                                placeholder="Enter about user description"
                            />
                        </Form.Group>
                        <Form.Group controlId="formDiffServices">
                            <Form.Label>Different Services</Form.Label>
                            <Form.Control
                                type="text"
                                name="diffServices"
                                value={addService.diffServices}
                                onChange={onChangeHandler}
                                placeholder="Enter different services"
                            />
                        </Form.Group>
                        <Form.Group controlId="formQualification">
                            <Form.Label>Qualification</Form.Label>
                            <Form.Control
                                type="text"
                                name="qualification"
                                value={addService.qualification}
                                onChange={onChangeHandler}
                                placeholder="Enter qualification"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={modalType === 'edit'} onHide={() => setModalType(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={editService}>
                        <Form.Group controlId="formServiceName">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="serviceName"
                                value={editsr.serviceName}
                                onChange={editOnChange}
                                placeholder="Enter service name"
                            />
                        </Form.Group>
                        <Form.Group controlId="formMinPrice">
                            <Form.Label>Min Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="minPrice"
                                value={editsr.minPrice}
                                onChange={editOnChange}
                                placeholder="Enter min price"
                            />
                        </Form.Group>
                        <Form.Group controlId="formMaxPrice">
                            <Form.Label>Max Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="maxPrice"
                                value={editsr.maxPrice}
                                onChange={editOnChange}
                                placeholder="Enter max price"
                            />
                        </Form.Group>
                        <Form.Group controlId="formServiceDescription">
                            <Form.Label>Service Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="serviceDescription"
                                value={editsr.serviceDescription}
                                onChange={editOnChange}
                                placeholder="Enter service description"
                            />
                        </Form.Group>
                        <Form.Group controlId="formAboutUserDescription">
                            <Form.Label>About User Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="aboutuserDescription"
                                value={editsr.aboutuserDescription}
                                onChange={editOnChange}
                                placeholder="Enter about user description"
                            />
                        </Form.Group>
                        <Form.Group controlId="formDiffServices">
                            <Form.Label>Different Services</Form.Label>
                            <Form.Control
                                type="text"
                                name="diffServices"
                                value={editsr.diffServices}
                                onChange={editOnChange}
                                placeholder="Enter different services"
                            />
                        </Form.Group>
                        <Form.Group controlId="formQualification">
                            <Form.Label>Qualification</Form.Label>
                            <Form.Control
                                type="text"
                                name="qualification"
                                value={editsr.qualification}
                                onChange={editOnChange}
                                placeholder="Enter qualification"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <table>
                <thead>
                    <tr>
                        <th>ServiceName</th>
                        <th>Min Price</th>
                        <th>Max Price</th>
                        <th>Service Description</th>
                        <th>About User Description</th>
                        <th>Different Services</th>
                        <th>Qualification</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {serData.map((service) => (
                        <tr key={service.id}>
                            <td>{service.serviceName}</td>
                            <td>{service.minPrice}</td>
                            <td>{service.maxPrice}</td>
                            <td>{service.serviceDescription}</td>
                            <td>{service.aboutuserDescription}</td>
                            <td>{service.diffServices}</td>
                            <td>{service.qualification}</td>
                            <td><Button variant="warning" onClick={() => serviceUpdate(service)}>Edit</Button></td>
                            <td><Button variant="danger" onClick={() => deleteService(service.id)}>Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Servicepage;
