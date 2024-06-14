import React, { useEffect, useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = (props) => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    //useEffect
    useEffect(() => {
        document.body.style.backgroundColor = 'black';
        document.getElementsByTagName('nav')[0].style.backgroundColor = 'black';
        document.getElementsByTagName('nav')[0].style.borderBottom = 'solid 1px rgb(135, 206, 235)';

        return () => {
            document.body.style.backgroundColor = '';
            document.getElementsByTagName('nav')[0].style.backgroundColor = '';
        };
    }, [])


    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
        const json = await response.json();
        if (json.success) {
            localStorage.setItem('auth-token', json.authToken);
            props.showAlert("Login successfully", "success")
            navigate('/dashboard');
        }
        else {
            props.showAlert("Invalid Credentials", "danger");
        }
        setCredentials({ email: "", password: "" });
    }

    return (
        <>
            <div className="login-body">
                <div className="container">
                    <div className="logo">
                        <div className="symbol">
                            <div className="symbol-Z">Z</div>
                            <div className="symbol-C">C</div>
                        </div>
                        <div className="zcoder">ZCODER</div>
                    </div>
                    <form className='credentials-form' onSubmit={onSubmit}>
                        <div className="login-inputs">
                            <input onChange={onChange} type='email' name='email' value={credentials.email} className='input-elements' placeholder='email' autoComplete='email'></input>
                            <input onChange={onChange} type='password' name='password' value={credentials.password} className='input-elements' placeholder='password' autoComplete='current-password'></input>
                        </div>
                        <button type='submit' className='button-signup-login'>Login</button>
                        <div className="tags">
                            <Link to='/forgotpassword'>Forgot Password</Link>
                            <Link to='/signup'>Signup</Link>
                        </div>
                    </form>
                </div>
                <footer>
                    <p> Copyright&copy; 2024 ZCODER. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}

export default Login;