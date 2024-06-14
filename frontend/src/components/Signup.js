import React, { useEffect, useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';

const Singin = (props) => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ firstName: "", lastName: "", email: "", password: "" });

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
        setCredentials({ ...credentials, [event.target.name]: event.target.value })
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
        const json = await response.json();
        if (json.success) {
            localStorage.setItem('auth-token', json.authToken);
            props.showAlert("Account created successfully", "success");
            navigate('/profile');
        }
        else {
            props.showAlert("Invalid Credentials", "danger");
        }

        setCredentials({ firstName: "", lastName: "", email: "", password: "" });
    }
    return (
        <>
            <div className="signup-body">
                <div className="container">
                    <div className="logo">
                        <div className="symbol">
                            <div className="symbol-Z">Z</div>
                            <div className="symbol-C">C</div>
                        </div>
                        <div className="zcoder">ZCODER</div>
                    </div>
                    <form className='credentials-form' onSubmit={onSubmit}>
                        <div className="sinnup-inputs">
                            <input onChange={onChange} name='firstName' value={credentials.firstName} type='text' className='input-elements' placeholder='First Name'></input>
                            <input onChange={onChange} name='lastName' value={credentials.lastName} type='text' className='input-elements' placeholder='Last Name'></input>
                            <input onChange={onChange} name='email' value={credentials.email} type='email' className='input-elements' placeholder='email' autoComplete='email'></input>
                            <input onChange={onChange} name='password' value={credentials.password} type='password' className='input-elements' placeholder='password' autoComplete='current-password'></input>
                        </div>
                        <button type='submit' className='button-signup-login'>Sign Up</button>
                        <div className="tags">
                            <Link to='/forgotpassword'>Forgot Password</Link>
                            <Link to='/login'>Login</Link>
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

export default Singin;