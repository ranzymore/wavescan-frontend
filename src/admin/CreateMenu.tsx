import { useState } from "react";
import { Upload, Plus, Trash2, Eye, QrCode, Save } from "lucide-react";
import axios from "axios";
// Item type
type MenuItem = {
  id: number;
  name: string;
  price: string;
  description: string;
  available: boolean;
  image: string;
};

// Category type
type Category = {
  id: number;
  name: string;
  items: MenuItem[];
};

const CreateMenuPage = () => {
  // Menu info
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [categoryName,setCategoryName] = useState("")

  // Categories
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Appetizers", items: [] },
    { id: 2, name: "Main Courses", items: [] },
    { id: 3, name: "Desserts", items: [] },
    { id: 4, name: "Beverages", items: [] },
  ]);

  const [activeCategory, setActiveCategory] = useState<number>(1);

  // New item form
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemAvailable, setItemAvailable] = useState(true);
  const [itemImage, setItemImage] = useState("");

  // Design customization
  const [menuTheme, setMenuTheme] = useState("classic");
  const [primaryColor, setPrimaryColor] = useState("#10B981");

  const storeId =  localStorage.getItem('storeId');
  const token = localStorage.getItem('token');
  // Add new category
const addCategory = async () => {
  if (!categoryName) {
    alert("Category Name not found");
    return;
  }

  try {
    const response = await axios.post(
      `https://wavescan-backend.vercel.app/api/store/${storeId}/category`,
      {
        name: categoryName,
        products: [],
      },

      {
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
      }

    );

    if (response.status === 201 || response.status === 200) {
      alert("Category Created...");
    } else {
      alert("Category creation unsuccessful...");
      console.log(response.data);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred");
    }
    alert("Error creating category");
  }
};

  // Add item
  const addItem = () => {
    if (!itemName || !itemPrice) return;

    const newItem: MenuItem = {
      id: Date.now(),
      name: itemName,
      price: itemPrice,
      description: itemDescription,
      available: itemAvailable,
      image: itemImage,
    };

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === activeCategory
          ? { ...cat, items: [...cat.items, newItem] }
          : cat
      )
    );

    // Reset form
    setItemName("");
    setItemPrice("");
    setItemDescription("");
    setItemImage("");
    setItemAvailable(true);
  };

  // Remove item
  const removeItem = (categoryId: number, itemId: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat
      )
    );
  };

  // Current category
  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Create New Menu</h1>
          <p className="text-gray-500 text-sm md:text-base">
            Design your digital menu and generate QR code
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm md:text-base">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm md:text-base">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Panel */}
        <div className="space-y-6">
          {/* Menu Info */}
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Menu Information
            </h2>
            <div className="space-y-3 md:space-y-4">
              <input
                type="text"
                placeholder="Menu Name (e.g., Lunch Special)"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
              <textarea
                placeholder="Menu Description (optional)"
                value={menuDescription}
                onChange={(e) => setMenuDescription(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none h-20 resize-none"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
                          <h2 className="text-lg md:text-xl font-semibold">Categories</h2>

            <div className="flex  flex-row justify-between items-center mb-3 md:mb-4">


              {/* Enter Category Name Here to store in the db */}

               <input
                  type="text"
                  placeholder=" Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                />

              <button
                onClick={addCategory}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    activeCategory === cat.id
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.name} ({cat.items.length})
                </button>
              ))}
            </div>
          </div>

          {/* Add Item */}
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Add Item to "{currentCategory?.name}"
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Price (GHS)"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <textarea
                placeholder="Item Description (optional)"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none h-20 resize-none"
              />

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  Click to upload item image (optional)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={itemAvailable}
                    onChange={(e) => setItemAvailable(e.target.checked)}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm">Available</span>
                </label>
                <button
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ml-auto text-sm md:text-base"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Design Customization */}
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Design Customization
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Menu Theme
                </label>
                <select
                  value={menuTheme}
                  onChange={(e) => setMenuTheme(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="classic">Classic Restaurant</option>
                  <option value="modern">Modern Cafe</option>
                  <option value="elegant">Elegant Dining</option>
                  <option value="casual">Casual Bar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  {["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => setPrimaryColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          primaryColor === color
                            ? "border-gray-800"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold">Live Preview</h2>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {menuTheme.charAt(0).toUpperCase() + menuTheme.slice(1)} Theme
              </span>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
              <div className="text-center mb-4">
                <h3
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: primaryColor }}
                >
                  {menuName || "Your Menu Name"}
                </h3>
                {menuDescription && (
                  <p className="text-gray-600 mt-1">{menuDescription}</p>
                )}
              </div>

              {categories.map(
                (cat) =>
                  cat.items.length > 0 && (
                    <div key={cat.id} className="mb-6">
                      <h4
                        className="text-base md:text-lg font-semibold mb-2"
                        style={{ color: primaryColor }}
                      >
                        {cat.name}
                      </h4>
                      <div className="space-y-3">
                        {cat.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-start bg-white p-3 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-sm md:text-base">
                                  {item.name}
                                </h5>
                                {!item.available && (
                                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="font-semibold"
                                style={{ color: primaryColor }}
                              >
                                ${item.price}
                              </span>
                              <button
                                onClick={() => removeItem(cat.id, item.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}

              {categories.every((c) => c.items.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <QrCode className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>Start adding items to see your menu preview</p>
                </div>
              )}
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold">
            <QrCode className="w-5 h-5" />
            Generate Menu & QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMenuPage;
