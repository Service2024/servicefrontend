import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Subscription() {
    const navigate=useNavigate()
    const token = localStorage.getItem('token')
    const decoded=jwtDecode(token)
    const [data,setdata]=useState({
        cardFullname:'',
        cardNumber:'',
        expMonth:'',
        expYear:'',
        cvv:'',
        amount:250,
        backGround_Check: '',
        criminalRecord: '',
        healthBAckground: '',
        gender: '',
        race: '',
        termsandCondition: '',
        userID:decoded.id
    })

    const [files,setFiles]=useState({
        workCertificate:null,
        drugtest:null,
        idproof:null,
    })

   
    const onchangeHAndler=(e)=>{
        const{name,value}=e.target;
        setdata({...data,[name]:value})
    }

    const onFileChange=(e)=>{
        const{name,files}=e.target;
        setFiles(prevFiles=>({...prevFiles,[name]:files[0]}))
    }
    const onSubscription=async(e)=>{
        e.preventDefault();
        const formData=new FormData()

        Object.keys(data).forEach(Key=>{
            formData.append(Key,data[Key])
        })

        Object.keys(files).forEach(key=>{
            if(files[key]){
                formData.append(key,files[key])
            }
        })
        try{
            const resp = await axios.post('http://localhost:6060/subscription',formData,{
                headers:{
                    Authorization:`Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(resp.status===200){
                alert("add subscription")
                alert("Please Login Again")
                localStorage.removeItem('token')
                navigate('/login')
            }
        }catch(error){
            alert(error.message)
        }
    }
  return (
    <div>
        <form onSubmit={onSubscription}>
            <input type="text" placeholder='Enter Card Fullname' value={data.cardFullname} name='cardFullname' onChange={onchangeHAndler}/><br/>
            <input type="integer" placeholder='Enter Card Number' value={data.cardNumber} name='cardNumber' onChange={onchangeHAndler}/><br/>
            <input type="integer" placeholder='Exp Month' name='expMonth' value={data.expMonth} onChange={onchangeHAndler}/><br/>
            <input type="integer" placeholder='Exp Year' name='expYear' value={data.expYear} onChange={onchangeHAndler}/><br/>
            <input type="integer" placeholder='Cvv' name='cvv' value={data.cvv} onChange={onchangeHAndler}/><br/>
            <input type="integet" name='amount' value={`${data.amount}`}  /><br/>
            <div><br/>
            <br/>
                <span>Work Certificate:</span><br/> 
                <input type="file" name="workCertificate" onChange={onFileChange}/>
            </div>
            <br/>
            <div>
                <span>Drug Test:</span><br/>
                <input type="file"  name="drugtest" onChange={onFileChange}/>
            </div>
            <br/>
            <div>
                <span>Id Proof:</span><br/>
                <input type="file"  name="idproof" onChange={onFileChange}/>
            </div>
            <br/>
            <div>
            <span>Are you ready for background check?</span><br/>
            <input type="text" name="backGround_Check" value={data.backGround_Check} onChange={onchangeHAndler}/>
            </div>
            <br/>
            <div>
            <span>Do you have criminal record?</span><br/> {/*if yes what*/}
            <input type="text" name="criminalRecord" value={data.criminalRecord} onChange={onchangeHAndler}/>
            </div>
            <br/>
            <div>
            <span>Any health Background?</span> <br/>{/*if yes what*/}
            <input type="text" name="healthBAckground" value={data.healthBAckground} onChange={onchangeHAndler}/>
            </div>
            <br/>
            <div>
            <span>Gender?</span> {/*if yes what*/}<br/>
            <input type="text" name="gender" value={data.gender} onChange={onchangeHAndler}/>
            </div>
            <br/>
            <div>
            <span>Race</span> {/*if yes what*/}<br/>
            <input type="text" name="race" value={data.race} onChange={onchangeHAndler}/>
            </div>
            <br/>
            <div>
            <p>Terms and condifiton</p>
            <input type="text" name="termsandCondition" value={data.termsandCondition} onChange={onchangeHAndler}/>
            </div>
            <br/>
            <button>Subscription</button>

        </form>
            <br/>

    </div>
  )
}

export default Subscription
