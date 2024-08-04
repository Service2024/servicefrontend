import { useState } from 'react';
import '../../assets/css/home.css'
import { FaBarsStaggered,FaRegMessage  } from "react-icons/fa6";
import { IoHomeOutline,IoSettingsOutline } from "react-icons/io5";
import { FaServicestack,FaHistory  } from "react-icons/fa";
import { MdOutlineSubscriptions } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import Login from "../auth/Login"
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

export default function Homepage() {
    const [toogle,settoogle]=useState(1)
    const navigate=useNavigate()
    const toogleBtn=(index)=>{
        settoogle(index)
    }
    const Logout=()=>{
        localStorage.removeItem('token')
        navigate('/login')
    }
    return (
        <>
            <main className='homepage'>
                <div className="homepageDesign">
                    <div className="firsthomebar">
                        <h1>Service harbour</h1>
                        <div className={toogle===1?"bars activetabs":"bars"} onClick={()=>{toogleBtn(1)}}>
                            <IoHomeOutline/>Home
                        </div>
                        <div className={toogle===2?"bars activetabs":"bars"} onClick={()=>{toogleBtn(2)}}>
                            <FaServicestack/>Service
                        </div>
                        <div className={toogle===3?"bars activetabs":"bars"} onClick={()=>{toogleBtn(3)}}>
                            <FaRegMessage/>Message
                        </div>
                        <div className={toogle===4?"bars activetabs":"bars"} onClick={()=>{toogleBtn(4)}}>
                            <FaHistory/>History
                        </div>
                        <div className={toogle===5?"bars activetabs":"bars"} onClick={()=>{toogleBtn(5)}}>
                            <MdOutlineSubscriptions/>Subscription
                        </div>
                        <div className={toogle===6?"bars activetabs":"bars"} onClick={()=>{toogleBtn(6)}}>
                            <IoSettingsOutline/>settings
                        </div>
                        <div className="bars" onClick={Logout}>
                            <CiLogout/>Logout
                        </div>
                    </div>
                    <div className="homepageContent">
                        <div className={toogle===1?"homeContents active-content":"homeContents"}>
                           <Login/>
                           <Login/>

                        </div>
                        <div className={toogle===2?"homeContents active-content":"homeContents"}>
                            <h1>Service</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur praesentium reiciendis tempora consequuntur qui voluptatibus non quibusdam facere, eveniet natus rem sapiente illo repudiandae. Tenetur quasi impedit soluta quia ipsa?</p>
                        </div>
                        <div className={toogle===3?"homeContents active-content":"homeContents"}>
                            <h1>Message</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur praesentium reiciendis tempora consequuntur qui voluptatibus non quibusdam facere, eveniet natus rem sapiente illo repudiandae. Tenetur quasi impedit soluta quia ipsa?</p>
                        </div>
                        <div className={toogle===4?"homeContents active-content":"homeContents"}>
                            <h1>History</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur praesentium reiciendis tempora consequuntur qui voluptatibus non quibusdam facere, eveniet natus rem sapiente illo repudiandae. Tenetur quasi impedit soluta quia ipsa?</p>
                        </div>
                        <div className={toogle===5?"homeContents active-content":"homeContents"}>
                            <h1>Subscription</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur praesentium reiciendis tempora consequuntur qui voluptatibus non quibusdam facere, eveniet natus rem sapiente illo repudiandae. Tenetur quasi impedit soluta quia ipsa?</p>
                        </div>
                        <div className={toogle===6?"homeContents active-content":"homeContents"}>
                           <Profile/>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}