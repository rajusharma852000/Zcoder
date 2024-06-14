import React from 'react';

const Action = ({handleclick, type, className}) =>{


    return(
        <>
            <div className={className} onClick={handleclick}>
                {type}
            </div>
        </>
    )
}

export default Action;