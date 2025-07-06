import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config.js';

const Signup = () => {
    const [firstName , setFirstName] = useState("");
    const [lastName , setLastName] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    const navigate = useNavigate();

    const registerUser = async(e) => {
        e.preventDefault();
        try {
            let res = await axios.post(`${BASE_URL}sign-up`, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            });
            console.log(res.data);
            alert(res.data.message);
            navigate('/login');

        } catch (error) {
            console.log("Error" , error);
            alert(error.response.data.message);
        }
        
    }
  return (
    <div>
            <form onSubmit={registerUser}>
                <label htmlFor="">
                    First Name:
                    <input type="text" name="firstName" value={firstName} onChange={(e) => {setFirstName(e.target.value)}} required />
                </label>
                <br />
                <label htmlFor="">
                    Last Name:
                    <input type="text" name="lastName" value={lastName} onChange={(e) => {setLastName(e.target.value)}} required />
                </label>
                <br />
                <label htmlFor="">
                    Email:
                    <input type="email" name="email" value={email} onChange={(e) => {setEmail(e.target.value)}} required />
                </label>
                <br />
                <label htmlFor="">
                    Password:
                    <input type="password" name="password" value={password} onChange={(e) => {setPassword(e.target.value)}} required />
                </label>
                <br />
                <button type='submit'>Submit</button>
                <br />
                <p><Link to={'/login'}>Login</Link></p>
            </form>
    </div>
  )
}

export default Signup
