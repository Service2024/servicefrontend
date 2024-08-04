import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [data,formData]=useState({
        firstname:'',
        lastname:'',
        email:'',
        phonenumber:'',
        password:'',
        c_password:''
    })
    const [error,setError]=useState(null)
    const navigate=useNavigate()
    const handleChange=(e)=>{
        const {name,value}=e.target;
        formData(prevState=>({...prevState,[name]:value}))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            let validationerror=null
            if(data.password!==data.c_password){
                validationerror="password not match nad nnumber"
            }else if(data.phonenumber.length<10){
                validationerror="phonenumber has to be 10 numbers"
            }else if(data.password.length<10){
                validationerror="password has to be 10 letters"
            }

            if(validationerror){
                setError(validationerror)
            }else{
                setError(null)
                const response= await axios.post('http://localhost:9090/service/auth/api/signup',data);
                if(response.status===200){
                    alert("success")
                    navigate('/login')
                }else{
                    alert("error")
                }
            }
        }catch(error){
            setError(error.message)
        }
    }
    
    return (
        <>
            <section className="formConcepts">
                <div className="formBox">
                        <form onSubmit={handleSubmit}>
                        {error&&<p>{error}</p>} 
                            <h1>Sign up</h1>
                            <div className="inputDetails">
                                <input type="text"  name="firstname" value={data.firstname} onChange={handleChange} required/>
                                <label htmlFor="first_name">Enter First name</label>
                            </div>
                            <div className="inputDetails">
                                <input type="text"  name="lastname" value={data.lastname} onChange={handleChange} required/>
                                <label htmlFor="last_name">Enter Last name</label>
                            </div>
                            <div className="inputDetails">
                                <input type="email" name="email" value={data.email} onChange={handleChange} required/>
                                <label htmlFor="email">Enter your email</label>
                            </div>
                            <div className="inputDetails">
                                <input type="tel" name="phonenumber" value={data.phonenumber} onChange={handleChange} required/>
                                <label htmlFor="phonenumber">Enter phonenumber</label>
                            </div>
                            <div className="inputDetails">
                                <input type="password" name="password" value={data.password} onChange={handleChange} required/>
                                <label htmlFor="password">Enter password</label>
                            </div>
                            <div className="inputDetails">
                                <input type="password" name="c_password" value={data.c_password} onChange={handleChange} required/>
                                <label htmlFor="c_password">Confirm password</label>
                            </div>
                            <div className="Signupbtns">
                                <button className="srvcbtn" type="submit">Signup</button>
                            </div>
                            <div className="otherlinks">
                                <span>Already a member?&nbsp;&nbsp;<a href="/login">Login</a></span><br/>
                                <span>Go to &nbsp;&nbsp;<a href="#">Homepage</a></span>
                            </div>
                        </form>
                    </div>
            </section>
            
        </>
    )
}

export default Signup;