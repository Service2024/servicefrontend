import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [data, formData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phonenumber: '',
        password: '',
        c_password: ''
    })
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const [passworderr, setpassworderr] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        formData(prevState => ({ ...prevState, [name]: value }))

        if (name === 'password') {
            if (value.length < 10) {
                setpassworderr('Password has to 10 letters')
            } else {
                setpassworderr('')
            }
        }

        if(name==='c_password'){
            if (value!==data.password) {
                setpassworderr('Password Not Matched')
            } else {
                setpassworderr('')
            }
        }

    }
    
    const [loading, isloading] = useState(false)
    const [success, setsuccess] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();
        isloading(true);
        setsuccess(null)
        try {
                setError(null)
                const response = await axios.post('http://localhost:6060/signup', data);
                if (response.status === 200) {
                    setsuccess('Signup successfully redirect to login.......')
                    setTimeout(() => navigate('/login'), 2000)
                } else {
                    alert("error")
                }
        } catch (error) {
            setError(error.response.data.message)
        } finally {
            isloading(false)
        }
    }


    return (
        <>
            <section className="formConcepts">
                <div className="formBox">
                    <form onSubmit={handleSubmit}>
                        {loading && <p style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>Loading...</p>}
                        {passworderr && <p style={{ color: 'red', fontWeight: 'bold', backgroundColor: 'black' }}>{passworderr}</p>}
                        {error && <p style={{ color: 'red', fontWeight: 'bold', backgroundColor: 'black' }}>{error}</p>}
                        {success && <p style={{ backgroundColor: 'black', color: 'green', fontWeight: 'bold' }}>Signup successfull redirect to login....</p>}
                        <h1>Sign up</h1>
                        <div className="inputDetails">
                            <input type="text" name="firstname" value={data.firstname} onChange={handleChange} required />
                            <label htmlFor="first_name">Enter First name</label>
                        </div>
                        <div className="inputDetails">
                            <input type="text" name="lastname" value={data.lastname} onChange={handleChange} required />
                            <label htmlFor="last_name">Enter Last name</label>
                        </div>
                        <div className="inputDetails">
                            <input type="email" name="email" value={data.email} onChange={handleChange} required />
                            <label htmlFor="email">Enter your email</label>
                        </div>
                        <div className="inputDetails">
                            <input type="tel" name="phonenumber" value={data.phonenumber} onChange={handleChange} required />
                            <label htmlFor="phonenumber">Enter phonenumber</label>
                        </div>
                        <div className="inputDetails">
                            <input type="password" name="password" value={data.password} onChange={handleChange} required />
                            <label htmlFor="password">Enter password</label>

                        </div>
                        <div className="inputDetails">
                            <input type="password" name="c_password" value={data.c_password} onChange={handleChange} required />
                            <label htmlFor="c_password">Confirm password</label>
                        </div>
                        <div className="Signupbtns">
                            <button className="srvcbtn" type="submit">Signup</button>
                        </div>
                        <div className="otherlinks">
                            <span>Already a member?&nbsp;&nbsp;<a href="/login">Login</a></span><br />
                            <span>Go to &nbsp;&nbsp;<a href="#">Homepage</a></span>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Signup;