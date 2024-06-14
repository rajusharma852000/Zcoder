import React, { useEffect } from 'react'
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    useEffect(() => {
        document.body.style.backgroundColor = 'black';
        document.getElementsByTagName('nav')[0].style.backgroundColor = 'black';
        document.getElementsByTagName('nav')[0].style.borderBottom = 'solid 1px rgb(135, 206, 235)';

        return () => {
            document.body.style.backgroundColor = '';
            document.getElementsByTagName('nav')[0].style.backgroundColor = '';
        };
    }, [])
    return (
        <>
            <div className="main">

                {/* left-half */}
                <div className="left-container">
                    <div className="left-symbol">
                        <div className="left-create-symbol">
                            <div className="left-create-symbol-Z">Z</div>
                            <div className="left-create-symbol-C">C</div>
                        </div>
                        <div className="left-symbol-subheading"><p>ZCODER</p></div>
                    </div>
                    <div className="left-info">We welcome you at Zcoder</div>
                </div>

                {/* right-half */}
                <div className="right-container">
                    <div className='right-heading'>
                        <h1>Make Learning fun: Zcoder</h1>
                    </div>
                    <div className='right-para'>
                        <p>ZCoder is a platfrom which provides users with the ability to create profiles, bookmark coding
                            problems along with their solutions, and engage in a collaborative environment through
                            commenting on each other's solutions. </p>
                    </div>
                    <Link to='/signup' className='create-account-button'>Create Account</Link>
                </div>

            </div>
        </>

    )
}

export default Home
