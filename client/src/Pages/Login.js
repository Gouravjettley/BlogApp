import React, { useContext, useState } from 'react';
import { FaEye , FaEyeSlash } from "react-icons/fa";
import {Navigate} from 'react-router-dom';
import { UserContext } from '../components/UserContext';

const Login = () => {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(FaEyeSlash);
  const [redirect,setRedirect] = useState(false);
  const{setUserInfo}=useContext(UserContext);

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
      const response = await fetch('http://localhost:8000/login',{
             method:'POST',
             body:JSON.stringify({username,password}),
             headers:{'Content-Type':'application/json'},
             credentials: 'include',   //THis is used to save cookie (token) in react
      });
      if(response.ok){
        response.json().then(userInfo=>{
          setUserInfo(userInfo);
          setRedirect(true);
        })
       
      }
      else{
        alert('Wrong credentials');
      }
  }
  if(redirect){
    return <Navigate to={'/'}/>
  }
  return (
    <form className="login" onSubmit={login}>
    <h1>Login</h1>
    <input type="text"
           placeholder="username"
           value={username}
           onChange={ev => setUsername(ev.target.value)}/>
    <input type={type}
           placeholder="password"
           value={password}
           onChange={ev => setPassword(ev.target.value)}/>
           <span className='eyebtn'onClick={handleToggle}>{icon}</span>
    <button>Login</button>
  </form>
  )
}

export default Login;