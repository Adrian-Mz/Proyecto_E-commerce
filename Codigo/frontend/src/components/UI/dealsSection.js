import React from "react";
import CategoryCard from "./categoryCard";
import { FaLaptop, FaGamepad, FaTabletAlt, FaTshirt, FaClock, FaHeadphones } from "react-icons/fa";

const DealsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CategoryCard title="Computers" icon={FaLaptop} hoverColor="blue-400" />
      <CategoryCard title="Gaming" icon={FaGamepad} hoverColor="purple-400" />
      <CategoryCard title="Tablets" icon={FaTabletAlt} hoverColor="green-400" />
      <CategoryCard title="Fashion" icon={FaTshirt} hoverColor="pink-400" />
      <CategoryCard title="Watches" icon={FaClock} hoverColor="yellow-400" />
      <CategoryCard title="Accessories" icon={FaHeadphones} hoverColor="red-400" />
    </div>
  );
};

export default DealsSection;
