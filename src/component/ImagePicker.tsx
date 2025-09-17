import React from "react";

const ImagePicker = () => {
  return (
    <div className="flex flex-col items-center justify-center border-1 border-green-700 rounded-2xl h-40 mt-4 bg-gray-100 text-black">
      <p className="text-lg font-medium">Select Image</p>
      <p className="text-sm text-gray-400">Optional</p>
    </div>
  );
};

export default ImagePicker;
