import React, { useState } from "react";
import WideButton from "../component/WideButton";
import Button from "../component/Button";
import ImagePicker from "../component/ImagePicker";
import CategoryCard from "../component/CategoryCard";
import MenuItems from "../component/MenuItems";

const CreateMenuPage = () => {
  const [foods, setFoods] = useState([ {name:'Banku',price:'10', comment:'Hello'}]);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodComment, setFoodComment] = useState("");

  const [bgStyle, setBgStyle] = useState("bg-white");
  const [fontStyle, setFontStyle] = useState("font-sans");

  // Add a new food item
  const addFood = () => {
    if (!foodName || !foodPrice) return;
    setFoods([...foods, { name: foodName, price: foodPrice, comment: foodComment }]);
    setFoodName("");
    setFoodPrice("");
    setFoodComment("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Menu</h1>

      {/* Background Selector */}
      <h2 className="text-xl font-semibold mb-2">Choose Background</h2>
      <div className="flex gap-3 mb-4">
        <div
          className={`w-16 h-16 rounded-xl cursor-pointer ${bgStyle === "bg-white" ? "ring-2 ring-green-500" : ""} bg-white border`}
          onClick={() => setBgStyle("bg-white")}
        ></div>
        <div
          className={`w-16 h-16 rounded-xl cursor-pointer ${bgStyle === "bg-green-100" ? "ring-2 ring-green-500" : ""} bg-green-100 border`}
          onClick={() => setBgStyle("bg-green-100")}
        ></div>
        <div
          className={`w-16 h-16 rounded-xl cursor-pointer ${bgStyle === "bg-black" ? "ring-2 ring-green-500" : ""} bg-black border`}
          onClick={() => setBgStyle("bg-black")}
        ></div>
      </div>

      {/* Font Selector */}
      <h2 className="text-xl font-semibold mb-2">Choose Font</h2>
      <select
        value={fontStyle}
        onChange={(e) => setFontStyle(e.target.value)}
        className="p-2 rounded-xl border mb-4"
      >
        <option value="font-sans">Sans (Default)</option>
        <option value="font-serif">Serif</option>
        <option value="font-mono">Monospace</option>
      </select>

      {/* Categories Section */}
      <h2 className="text-2xl font-semibold py-5">Categories</h2>

      <div className="flex gap-2">
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
      </div>

      <h2 className="text-gray-400 py-2">Select a Category</h2>


      {/* Image Picker for Menu Cover */}
      <h2 className="text-xl font-semibold mb-2">Menu Cover Image</h2>
      <ImagePicker />

      {/* Food Inputs */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Add Foods</h2>
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="p-2 rounded-xl border"
        />
        <input
          type="text"
          placeholder="Food Price"
          value={foodPrice}
          onChange={(e) => setFoodPrice(e.target.value)}
          className="p-2 rounded-xl border"
        />
        <input
          type="text"
          placeholder="Food Comment"
          value={foodComment}
          onChange={(e) => setFoodComment(e.target.value)}
          className="p-2 rounded-xl border"
        />
        <Button name="Add Food" bgColor="bg-green-500" handleClick={addFood} />
      </div>

      {/* Food List Preview */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Preview Foods</h2>
      <div className={`p-4 rounded-xl border ${bgStyle} ${fontStyle}`}>
        {foods.length === 0 ? (
          <p className="text-gray-400">No foods added yet...</p>
        ) : (
          <ul className="space-y-2">
            {foods.map((food, idx) => (
              <MenuItems key={idx} title={food.name} price={food.price} description={food.comment} image="" />
            ))}
          </ul>
        )}
      </div>

      {/* Generate Menu Button */}
      <div className="mt-6">
        <WideButton bgColor="bg-green-600" name="Generate Menu QR-Code" handleClick={() => {}} />
      </div>
    </div>
  );
};

export default CreateMenuPage;
