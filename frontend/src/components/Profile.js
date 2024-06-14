import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { authContext } from '../context/notes/Context.js';

const Profile = (props) => {
    const avatar = `${process.env.PUBLIC_URL}/avatar.png`;
    const context = useContext(authContext);
    const { user, updateUser, getUser } = context;
    const [image, setImage] = useState(user.profilePicture);
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState(user);


    useEffect(() => {
        if (!localStorage.getItem('auth-token')) { navigate('/login'); }
        else { getUser(); }

        document.body.style.backgroundColor = 'black';
        document.getElementsByTagName('nav')[0].style.backgroundColor = 'black';
        document.getElementsByTagName('nav')[0].style.borderBottom = 'solid 1px rgb(135, 206, 235)';

        return () => {
            document.body.style.backgroundColor = '';
            document.getElementsByTagName('nav')[0].style.backgroundColor = '';
        };
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (user.profilePicture) {
            setImage(user.profilePicture);
            setNewUser(user);
        }
    }, [user])


    const handleFileUplaod = async (event) => {
        console.log("done");
        const file = event.target.files[0];
        const base64 = await converToBase64(file);
        setImage(base64);
        updateUser({ ...user, profilePicture: base64 });
        props.showAlert("Profile picture updated successfully", "success");
    }
    const profileOnchangeHandler = (event) => {
        setNewUser({ ...user, [event.target.name]: event.target.value })
    }
    const onsubmitProfileModalForm = (event) => {
        //validate email
        event.preventDefault();
        const emailInput = newUser.email;
        if (!validateEmail(emailInput)) {
            props.showAlert("invalid email", "danger");
            return;
        }

        updateUser(newUser);
        document.getElementsByClassName('profile-modal')[0].classList.add('hide');
        props.showAlert("Profile updated successfully", "success");
    }
    const onClickCloseProfileModal = () => {
        document.getElementsByClassName('profile-modal')[0].classList.add('hide');
        document.getElementsByClassName('profile-container')[0].classList.remove('hide');
        }
        const onClickOpenProfileModal = () => {
        document.getElementsByClassName('profile-container')[0].classList.add('hide');
        document.getElementsByClassName('profile-modal')[0].classList.remove('hide');
    }

    return (
        <>
            <div className='profile-container'>

                {/* display profile picture */}
                <div id='profile-picture-subcontainer1'>
                    <div id='profile-picture-subcontainer2'>
                        <div id='profile-picture'>
                            <label htmlFor="file-upload" className='profile-picture-lable'>
                                <img style={ image ? {borderRadius: '10%'}: {borderRadius: '50%'}} src={image || avatar} alt="profilePic" />
                            </label>
                            <input onChange={handleFileUplaod} type="file" lable='Image ' name='myFile' id='file-upload' accept='.jpeg, .png, .jpg' />
                        </div>
                        <h3 className='field-value'>{user.firstName} {user.lastName}</h3>
                        <span className='field-value'>{user.profession}</span>
                    </div>
                    <button onClick={onClickOpenProfileModal} type='button' id='profile-edit-button'>Edit Profile</button>
                </div>
                {/* display profile picture */}


                {/* display personal info */}
                <div id='user-personal-info-container'>
                    <div className='personal-info' id='user-email'>
                        <span className='field-name'><strong>Email: </strong></span>
                        <span className='field-value'>{user.email}</span>
                    </div>
                    <div className='personal-info' id='user-techStack'>
                        <span className='field-name'><strong>Tech Stack: </strong></span>
                        <span className='field-value' >{user.techStack}</span>
                    </div>
                    <div className='personal-info' id='user-programmingLanguages'>
                        <span className='field-name'><strong>Languages: </strong></span>
                        <span className='field-value'>{user.programmingLanguages}</span>
                    </div>
                    <div className='personal-info' id='user-dob'>
                        <span className='field-name'><strong>Date of Birth: </strong></span>
                        <span className='field-value'>{user.dateOfBirth}</span>
                    </div>
                </div>
                {/* display personal info */}

            </div>


            {/* modal to edit personal details */}
            <div className='profile-modal hide'>
                <form onSubmit={onsubmitProfileModalForm}>
                    <div className="modal-container">
                        <span id="modal-profle-heading"><strong>Enter your details</strong></span>
                        <input type="text" name='firstName' onChange={profileOnchangeHandler} value={newUser.firstName} className="modal-profile-input" placeholder='First Name' />
                        <input type="text" name='lastName' onChange={profileOnchangeHandler} value={newUser.lastName} className="modal-profile-input" placeholder='Last Name' />
                        <input type="text" name='profession' onChange={profileOnchangeHandler} value={newUser.profession} className="modal-profile-input" placeholder='Profession' />
                        <input type="text" name='techStack' onChange={profileOnchangeHandler} value={newUser.techStack} className="modal-profile-input" placeholder='Tech Stack' />
                        <input type="text" name='programmingLanguages' onChange={profileOnchangeHandler} value={newUser.programmingLanguages} className="modal-profile-input" placeholder='Languages' />
                        <input type="text" name='dateOfBirth' onChange={profileOnchangeHandler} value={newUser.dateOfBirth} className="modal-profile-input" placeholder='Date of Birth' />
                        <input type="email" name='email' onChange={profileOnchangeHandler} value={newUser.email} className="modal-profile-input" placeholder='Email' />
                        <div className='modal-profile-buttons'>
                            <button type='submit' className='profile-buttons' id='modal-profile-update-button'>Update</button>
                            <button onClick={onClickCloseProfileModal} type='button' className='profile-buttons' id='modal-profile-close-button'>Close</button>
                        </div>
                    </div>
                </form>
            </div>
            {/* modal to edit personal details */}
        </>
    );
}

export default Profile;



const converToBase64 = (file) => {
    return new Promise((res, rej) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            res(fileReader.result);
        };
        fileReader.onerror = (error) => {
            rej(error);
        }
    })
}
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}