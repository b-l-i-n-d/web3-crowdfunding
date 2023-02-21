import React from 'react';

function FormField({ labelName, placeholder, inputType, isTextArea, value, handleChange }) {
    return (
        <label htmlFor={labelName} className="flex-1 w-full flex flex-col">
            {labelName && (
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                    {labelName}
                </span>
            )}
            {isTextArea ? (
                <textarea
                    id={labelName}
                    required
                    value={value}
                    onChange={handleChange}
                    rows={10}
                    placeholder={placeholder}
                    className="textarea textarea-primary"
                />
            ) : (
                <input
                    required
                    value={value}
                    onChange={handleChange}
                    type={inputType}
                    step="0.1"
                    placeholder={placeholder}
                    min={
                        new Date(new Date().setDate(new Date().getDate() + 1))
                            .toISOString()
                            .split('T')[0]
                    }
                    className="input input-primary"
                />
            )}
        </label>
    );
}

export default FormField;
