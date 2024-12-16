import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-800 rounded-lg shadow-lg p-8">{children}</div>
    </div>
  );
};

export default AuthLayout;