import React from "react";

export default function Forgotpassword(){
    return(
        <>
            <section className="formConcepts">
                <div className="formBox">
                        <form action="#">
                            <h1>Forgot password</h1>
                            <div className="inputDetails">
                                <input type="email"  name="email" id="" required/>
                                <label htmlFor="email">Enter Email</label>
                            </div>
                            <div className="Signupbtns">
                                <button className="srvcbtn" style={{width:'30%'}}>Forgot password</button>
                            </div>
                            <div className="otherlinks">
                                <span>Go to &nbsp;&nbsp;<a href="/">Homepage</a></span>
                            </div>
                        </form>
                    </div>
            </section>
        </>
    )
}