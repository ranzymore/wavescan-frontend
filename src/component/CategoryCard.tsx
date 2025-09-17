import React from "react";

const CategoryCard = () => {
  return (
    <div className="flex flex-col justify-center items-center border border-green-800 rounded-2xl h-40 w-32 p-2">
      {/* Image/placeholder area */}
      <div className="h-24 w-full bg-gray-200 rounded-md"></div>

      {/* Category text */}
      <p className="mt-2 text-sm font-medium text-gray-700 truncate w-full text-center">
        Category 1
      </p>
    </div>
  );
};

export default CategoryCard;
