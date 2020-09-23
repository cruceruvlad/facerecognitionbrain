import React from 'react';

const FaceRecognition = ({imageURL}) => {
    return (
        <img className='center ma' width='500px' height='auto' src={imageURL} alt=''/>
    );
}

export default FaceRecognition;