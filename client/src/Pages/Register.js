import React, { useState } from 'react';
import { FaEye , FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(FaEyeSlash);
 
  const handleToggle = () => {
    if (type ==='password'){
       setIcon(FaEye);
       setType('text')
    } else {
       setIcon(FaEyeSlash)
       setType('password')
    }
 }
  async function login(e){
      e.preventDefault();
      const response = await fetch('https://blog-app-api-amber.vercel.app/register',{
             method:'POST',
             body:JSON.stringify({username,password}),
              headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'true'
        },
      });
      if(response.status == 200){
        alert("Registration Successful");
      }
      else{
        alert("Registration Failed");
      }
  }
  return (
    <form className="login" onSubmit={login}>
    <h1>Register</h1>
    <input type="text"
           placeholder="username"
           value={username}
           onChange={e=> setUsername(e.target.value)}/>
    <input type={type}
           placeholder="password" 
           value={password}
           onChange={e => setPassword(e.target.value)}/>
           <span className='eyebtn'onClick={handleToggle}>{icon}</span>
           
    <button>Register</button>
  </form>
  )
}

export default Register
