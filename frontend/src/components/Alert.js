import React from 'react'
import './Alert.css';

const Alert = (props) => {
    const capitalizeFirstLetter = (word) => {
        if (word === 'danger') return word = 'Error';
        else if (word.length > 0) {
            word = word.toLowerCase();
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
    }
    return (
        <>
            {/* <div style={{ height: '50px' }}>
                {props.alert && (<div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
                    <strong>{capitalizeFirstLetter(props.alert.type)}</strong>: {props.alert.msg}
                </div>)}
            </div> */}
            <div style={{ height: '50px' }}>
                {props.alert && (<div className={`alert alert-${props.alert.type}`} role="alert">
                    <strong>{capitalizeFirstLetter(props.alert.type)}</strong>: {props.alert.msg}
                </div>)}
            </div>
        </>
    )
}

export default Alert
