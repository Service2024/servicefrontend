function Signup() {
    return (
        <>
            <section className="formConcepts">
                <div className="formBox">
                        <form action="#">
                            <h1>Sign up</h1>
                            <div className="inputDetails">
                                <input type="text"  name="first_name" id="" required/>
                                <label htmlFor="first_name">Enter First name</label>
                            </div>
                            <div className="inputDetails">
                                <input type="text"  name="last_name" id="" required/>
                                <label htmlFor="last_name">Enter Last name</label>
                            </div>
                            <div className="inputDetails">
                                <input type="email" name="email" id="" required/>
                                <label htmlFor="email">Enter your email</label>
                            </div>
                            <div className="inputDetails">
                                <input type="number" name="phone_number" id="" required/>
                                <label htmlFor="phone_number">Enter phonenumber</label>
                            </div>
                            <div className="inputDetails">
                                <input type="password" name="password" id="" required/>
                                <label htmlFor="password">Enter password</label>
                            </div>
                            <div className="inputDetails">
                                <input type="password" name="c_password" id="" required/>
                                <label htmlFor="c_password">Confirm password</label>
                            </div>
                            <div className="Signupbtns">
                                <button className="srvcbtn">Signup</button>
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