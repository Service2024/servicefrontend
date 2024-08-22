import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Servicepage() {
    const [addService, setaddService] = useState({
        serviceName: '',
        minPrice: '',
        maxPrice: '',
        serviceDescription: '',
        aboutuserDescription: '',
        diffServices: '',
        qualification: ''
    })

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setaddService((servicePrevState) => ({ ...servicePrevState, [name]: value }))
    }

    const addServiceFunction = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const serv = await axios.post('http://localhost:6060/addservice', addService, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (serv.status === 200) {
            getServiceDetails()
            deleteService()
            alert('success')
        }
    }

    const [serData, setserData] = useState([])

    const getServiceDetails = async () => {
        const token = localStorage.getItem('token')
        const serv = await axios.get('http://localhost:6060/getservice', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (serv.status === 200) {
            setserData(serv.data.message)
        }
    }

    const [modal, setModal] = useState(false)
    const modalBox = () => {
        setModal(!modal)
    }
    const [editsr, setEditService] = useState({
        serviceName: '',
        minPrice: '',
        maxPrice: '',
        serviceDescription: '',
        aboutuserDescription: '',
        diffServices: '',
        qualification: ''
    })
    const editonChange = (e) => {
        const { name, value } = e.target;
        setEditService((editServ) => ({ ...editServ, [name]: value }))
    }
    const serviceUpdate = (attr) => {
        setEditService({
            id: attr.id,
            serviceName: attr.serviceName,
            minPrice: attr.minPrice,
            maxPrice: attr.maxPrice,
            serviceDescription: attr.serviceDescription,
            aboutuserDescription: attr.aboutuserDescription,
            diffServices: attr.diffServices,
            qualification: attr.qualification
        });
        setModal(true);
    }


    const editService = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const servss = await axios.put(`http://localhost:6060/updservice/${editsr.id}`, editsr, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (servss.status === 200) {
            alert("Updated successfull")
            getServiceDetails()
            setModal(false)
        }

    }


    const deleteService = async (serDatas) => {
        const token = localStorage.getItem('token')
        const serv = await axios.delete(`http://localhost:6060/deleteservice/${serDatas}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (serv.status === 200) {
            alert("delete successfull")
            getServiceDetails()
        }
    }
    useEffect(() => {
        getServiceDetails()
    }, [])
    return (
        <>
            <div>
                <form onSubmit={addServiceFunction}>
                    <input type="text" placeholder='Enter serviceNAme' name='serviceName' value={addService.serviceName} onChange={onChangeHandler} /><br />
                    <input type="number" placeholder='Enter minPrice' name='minPrice' onChange={onChangeHandler} value={addService.minPrice} /><br />
                    <input type="number" placeholder='Enter maxPrice' name='maxPrice' onChange={onChangeHandler} value={addService.maxPrice} /><br />
                    <input type="text" placeholder='Enter serviceDescription' name='serviceDescription' onChange={onChangeHandler} value={addService.serviceDescription} /><br />
                    <input type="text" placeholder='Enter aboutuserDescription' name='aboutuserDescription' onChange={onChangeHandler} value={addService.aboutuserDescription} /><br />
                    <input type="text" placeholder='Enter diffServices' name='diffServices' onChange={onChangeHandler} value={addService.diffServices} /><br />
                    <input type="text" placeholder='Enter qualification' name='qualification' onChange={onChangeHandler} value={addService.qualification} /><br />
                    <button>Submit</button>
                </form>
            </div>
            <div>
                <h1>Services</h1>
                &nbsp;
                {/* {serData.length > 0 ? (
                    
                        <ul key={service.id}>
                            <li><p>ServiceName: {service.serviceName}</p></li>
                            <li><p>minPrice: {service.minPrice}</p></li>
                            <li><p>maxPrice: {service.maxPrice}</p></li>
                            <li><p>serviceDescription: {service.serviceDescription}</p></li>
                            <li><p>aboutuserDescription: {service.aboutuserDescription}</p></li>
                            <li><p>diffServices: {service.diffServices}</p></li>
                            <li><p>qualification: {service.qualification}</p></li>
                            
                            <hr />
                        </ul>
                    ))
                ) : (
                    <p>No data</p>
                )} */}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ServiceName</th>
                        <th>Min Price</th>
                        <th>Max price</th>
                        <th>serviceDescription</th>
                        <th>aboutuserDescription</th>
                        <th>diffServices</th>
                        <th>qualification</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {serData.map((service) => (
                    <tr key={service.id}>
                        <td>{service.serviceName}</td>
                        <td> {service.minPrice}</td>
                        <td>{service.maxPrice}</td>
                        <td> {service.serviceDescription}</td>
                        <td>{service.aboutuserDescription}</td>
                        <td> {service.diffServices}</td>
                        <td> {service.qualification}</td>
                        <td><button onClick={() => serviceUpdate(service)}>Edit</button></td>
                        <button onClick={() => deleteService(service.id)}>Delete</button>
                        <td></td>
                    </tr>
                    ))}
                </tbody>
            </table>
            {modal && (
                <div>
                    <form onSubmit={editService}>
                        <input type="text" placeholder='Enter serviceNAme' name='serviceName' value={editsr.serviceName} onChange={editonChange} /><br />
                        <input type="number" placeholder='Enter minPrice' name='minPrice' value={editsr.minPrice} onChange={editonChange} /><br />
                        <input type="number" placeholder='Enter maxPrice' name='maxPrice' value={editsr.maxPrice} onChange={editonChange} /><br />
                        <input type="text" placeholder='Enter serviceDescription' name='serviceDescription' value={editsr.serviceDescription} onChange={editonChange} /><br />
                        <input type="text" placeholder='Enter aboutuserDescription' name='aboutuserDescription' value={editsr.aboutuserDescription} onChange={editonChange} /><br />
                        <input type="text" placeholder='Enter diffServices' name='diffServices' value={editsr.diffServices} onChange={editonChange} /><br />
                        <input type="text" placeholder='Enter qualification' name='qualification' value={editsr.qualification} onChange={editonChange} /><br />
                        <button>Update</button>
                    </form>
                </div>
            )}
        </>
    )
}

export default Servicepage
