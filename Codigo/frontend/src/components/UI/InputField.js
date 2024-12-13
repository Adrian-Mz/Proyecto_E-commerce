import React from "react";

const InputField = ({ id, label, type, value, onChange, required, placeholder }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={onchange}
                    required={required}
                    placeholder={placeholder}
                    autoComplete={id}
                    className = "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outloine-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
            </div>
        </div>
    );
};

export default InputField;