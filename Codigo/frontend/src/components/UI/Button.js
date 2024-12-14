import React from "react";

const Button = ({type = "button", children, onClick, disabled}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            {children}
        </button>
    );
};

export default Button;