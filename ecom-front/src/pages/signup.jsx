import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom';
import api from "../api";
import swal from 'sweetalert';

const Signup = () => {
    const [firstName , setFirstName] = useState("");
    const [lastName , setLastName] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    const navigate = useNavigate();

    const registerUser = async(e) => {
        e.preventDefault();
        try {
            let res = await api.post(`/sign-up`, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            });
            console.log(res.data);
            swal("Success", res.data.message, "success");
            navigate('/login');

        } catch (error) {
            console.log("Error" , error);
            let msg = error?.response?.data?.error || error?.message || "Unknown error";
            swal("Error", msg, "error");
        }

    }
  return (
    <div className="auth-form-container"> {/* Apply container class */}
        <h2>Create an Account</h2> {/* Added heading */}
        <form onSubmit={registerUser}>
            <label htmlFor="signupFirstName">
                First Name:
                <input type="text" id="signupFirstName" name="firstName" value={firstName} onChange={(e) => {setFirstName(e.target.value)}} required />
            </label>
            <label htmlFor="signupLastName">
                Last Name:
                <input type="text" id="signupLastName" name="lastName" value={lastName} onChange={(e) => {setLastName(e.target.value)}} required />
            </label>
            <label htmlFor="signupEmail">
                Email:
                <input type="email" id="signupEmail" name="email" value={email} onChange={(e) => {setEmail(e.target.value)}} required />
            </label>
            <label htmlFor="signupPassword">
                Password:
                <input type="password" id="signupPassword" name="password" value={password} onChange={(e) => {setPassword(e.target.value)}} required />
            </label>
            <button type='submit'>Sign Up</button>
            <p>Already have an account? <Link to={'/login'}>Login</Link></p>
        </form>
    </div>
  )
}

export default Signup;