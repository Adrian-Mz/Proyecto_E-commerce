import React from "react";

const CategoryCard = ({ title, icon: Icon, hoverColor }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 hover:bg-gray-800 rounded-lg transition duration-300">
      <div
        className={`flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 text-gray-300 hover:text-${hoverColor}`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-300">{title}</h3>
    </div>
  );
};

export default CategoryCard;