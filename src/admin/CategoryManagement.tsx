import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductManagementPage from "./ProductManagement";

type Product = {
  id: string;
  name: string;
  // Add other product properties as needed
};

type Category = {
  id: string;
  name: string;
  items: Product[];
};

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
    const storeId = localStorage.getItem("storeId") || "cmfwrovq10007ju04fcq9yauz";
    const token = localStorage.getItem("token") || "YOUR_AUTH_TOKEN";
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");

  const listCategories = async () => {
    try {
      const res = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/category`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      const formatted = data.map((cat: { id: string; name: string; products?: Product[] }) => ({
        id: cat.id,
        name: cat.name,
        items: cat.products || [],
      }));
      setCategories(formatted);
    } catch (err) {
      console.error(err);
      alert("Error fetching categories");
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return alert("Enter category name");
    try {
      const res = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newCategory }),
        }
      );
      if (!res.ok) throw new Error("Failed to add category");
      setNewCategory("");
      listCategories();
    } catch (err) {
      console.error(err);
      alert("Error adding category");
    }
  };

  const deleteCategory = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category and all its products?"
    );
    if (!confirmDelete) return;
    try {
      const res = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/category/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
      listCategories();
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    }
  };

  useEffect(() => {
    listCategories();
  }, []);

  if (selectedCategoryId) return <ProductManagementPage id={selectedCategoryId} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black-100 via-purple-100 to-black-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-tight">
          Manage Restaurant Menu
        </h1>

        {/* Add Category */}
        <div className="flex justify-center mb-10">
          <div className="flex w-full md:w-1/2 bg-white/90 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name"
              className="flex-1 p-3 bg-transparent focus:outline-none text-gray-700"
            />
            <button
              onClick={addCategory}
              className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-5 hover:opacity-90 transition-all flex items-center gap-2"
            >
              <PlusCircle size={18} /> Add
            </button>
          </div>
        </div>

        {/* Category List */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white/70 backdrop-blur-xl shadow-xl border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-2xl transition-all"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{cat.name}</h2>
                <p className="text-sm text-gray-500">{cat.items.length} Products</p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Manage <ArrowRight size={18} className="ml-1" />
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
