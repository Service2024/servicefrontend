import React from "react";

export default function Updatepassword(){
    return(
        <>
        <section className="formConcepts">
            <div className="formBox">
                    <form action="#">
                        <h1>Update password</h1>
                        &nbsp;
                        <div className="inputDetails">
                            <input type="password"  name="password" id="" required/>
                            <label htmlFor="password">Enter Password</label>
                        </div>
                        &nbsp;
                        <div className="inputDetails">
                            <input type="password"  name="c_password" id="" required/>
                            <label htmlFor="c_password">Confirm password</label>
                        </div>
                        &nbsp;
                        <div className="Signupbtns">
                            <button className="srvcbtn" style={{width:'30%'}}>Update password</button>
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