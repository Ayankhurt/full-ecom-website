import React, { useState , useContext, } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/Context.jsx';
import swal from 'sweetalert';
import api from "../api";

const Login = () => {
    let {state, dispatch} = useContext(GlobalContext);
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    const navigate = useNavigate();

    const loginUser = async(e) => {
        e.preventDefault();
        try {
            let res = await api.post(`/login`, {
                email: email,
                password: password
            });
            console.log(res.data);
            swal("Success", res.data.message, "success");
            dispatch({type: "USER_LOGIN", user: res.data.user});
            setTimeout(() => {
                navigate('/home');
            }, 1000);

        } catch (error) {
            console.log("Error" , error);
            let msg = error?.response?.data?.error || error?.message || "Unknown error";
            swal("Error", msg, "error");
        }

    }
    return (
        <div className="auth-form-container"> {/* Apply container class */}
            <h2>Login to Your Account</h2> {/* Added heading */}
            <form onSubmit={loginUser}>
                <label htmlFor="loginEmail"> {/* Added htmlFor for accessibility */}
                    Email:
                    <input
                        type="email" // Use type="email" for email inputs
                        id="loginEmail"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                        required // Add required attribute
                    />
                </label>
                <label htmlFor="loginPassword"> {/* Added htmlFor for accessibility */}
                    Password:
                    <input
                        type="password" // Use type="password" for password inputs
                        id="loginPassword"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                        required // Add required attribute
                    />
                </label>
                <button type='submit'>Login</button>
                <p>Don't have an account? <Link to={'/sign-up'}>Sign up</Link></p>
            </form>
        </div>
    )
}

export default Login;