import React from "react";

export default function Login(){
    return(
        <>
            <section className="formConcepts">
                <div className="formBox">
                        <form action="#">
                            <h1>Login</h1>
                            <div className="inputDetails">
                                <input type="email"  name="email" id="" required/>
                                <label htmlFor="email">Enter Email</label>
                            </div>
                            <div className="inputDetails">
                                <input type="password"  name="password" id="" required/>
                                <label htmlFor="password">Enter password</label>
                            </div>
                            <div className="Signupbtns">
                                <button className="srvcbtn">Login</button>
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