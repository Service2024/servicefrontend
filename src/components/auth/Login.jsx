import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [data,formData]=useState({
        email:'',
        password:''
    })
    const [error,seterror]=useState(null)
    const navigate=useNavigate()

    const handleChange=(e)=>{
        const {name,value}=e.target;
        formData(prevState=>({...prevState,[name]:value}))
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();
        try{
            let errorMessage=null
            const response= await axios.post('http://localhost:9090/service/auth/api/login',data);
            if(response.status===200){
                errorMessage="Suceess"
                const{token}=response.data;
                localStorage.setItem('token',token)
                navigate('/home')
            }

            if(errorMessage){
                seterror(errorMessage)
            }
        }catch(error){
            seterror(error.response.data)
        }
    }
    return(
        <>
            <section className="formConcepts">
                <div className="formBox">
                        <form onSubmit={handleSubmit}>
                            {error&&<p>{error.message}</p>}
                            <h1>Login</h1>
                            <div className="inputDetails">
                                <input type="email"  name="email" value={data.email} onChange={handleChange} required/>
                                <label htmlFor="email">Enter Email</label>
                            </div>
                            <div className="inputDetails">
                                <input type="password"  name="password" value={data.password} onChange={handleChange} required/>
                                <label htmlFor="password">Enter password</label>
                            </div>
                            <div className="Signupbtns">
                                <button className="srvcbtn" type="submit">Login</button>
                            </div>
                            <div className="otherlinks">
                                <span>Forgot password?&nbsp;&nbsp;<a href="/forgotpassword">Forgot password?</a></span><br/>
                                <span>Go to &nbsp;&nbsp;<a href="/">Homepage</a></span>
                            </div>
                        </form>
                    </div>
            </section>
        </>
    )
}