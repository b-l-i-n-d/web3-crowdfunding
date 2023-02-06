import React from 'react';

function CustomButton({ btnType, title, handleClick, styles }) {
    return (
        <button
            // eslint-disable-next-line react/button-has-type
            type={btnType}
            className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
            onClick={handleClick}
        >
            {title}
        </button>
    );
}

export default CustomButton;
