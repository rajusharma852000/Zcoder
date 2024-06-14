import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'


const Navbar = (props) => {
    const handleLogout = () => {
        props.showAlert("Logged out successfully", "success");
        localStorage.clear('auth-token');
    }
    return (
        <>
            <nav>
                <div className='after-login'>
                    <ul>
                        {localStorage.getItem('auth-token')
                            ? <>
                                <li> <NavLink to='/dashboard'> Dashboard  </NavLink></li>
                                <li> <NavLink to='/profile'> Profile  </NavLink></li>
                                <li> <NavLink to='/bookmark'>  Bookmarked Problems  </NavLink></li>
                                <li> <NavLink to='/codeBlock'> CodeBlock  </NavLink></li>
                            </> :
                            <>
                                <li> <NavLink to='/'> Home  </NavLink></li>
                                <li> <NavLink to='/dashboard'> Dashboard  </NavLink></li>
                            </>}
                    </ul>
                </div>
                <div className="before-login">
                    {!localStorage.getItem('auth-token')
                        ? <ul>
                            <li> <NavLink to='/login'> Login  </NavLink></li>
                            <li> <NavLink to='/Signup'> Signup  </NavLink></li>
                        </ul> : <NavLink onClick={handleLogout} to='/'> Logout  </NavLink>}
                </div>

            </nav >
        </>
    );
}

export default Navbar;