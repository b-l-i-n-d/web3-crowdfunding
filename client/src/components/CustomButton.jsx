import React from 'react';

function CustomButton({ btnType, title, handleClick, styles }) {
    return (
        <button
            // eslint-disable-next-line react/button-has-type
            type={btnType}
            className={`font-epilogue btn ${styles}`}
            onClick={handleClick}
        >
            {title}
        </button>
    );
}

export default CustomButton;
