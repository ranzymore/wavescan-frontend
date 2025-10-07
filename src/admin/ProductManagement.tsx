import React, { useState, useEffect } from "react";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

type Product = {
  id?: string;
  name: string;
  price: number;
};

interface ProductManagementPageProps {
  id: string;
}

const ProductManagementPage: React.FC<ProductManagementPageProps> = ({ id }) => {
  const storeId = localStorage.getItem("storeId") || "cmfwrovq10007ju04fcq9yauz";
  const token = localStorage.getItem("token") || "YOUR_AUTH_TOKEN";
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  const listProducts = async () => {
    try {
      const res = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/category/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price) return alert("Fill all fields");
    try {
      const res = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newProduct.name,
            price: Number(newProduct.price),
            categoryId: id,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to add product");
      setNewProduct({ name: "", price: "" });
      listProducts();
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  const deleteProduct = async (pid: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/product/${pid}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
      listProducts();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    listProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center text-gray-700 hover:text-black mb-6 font-medium"
        >
          <ArrowLeft className="mr-2" size={18} /> Back to Categories
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Manage Products for Category
        </h1>

        {/* Add Product */}
        <div className="flex flex-wrap gap-3 mb-8 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-4">
          <input
            type="text"
            placeholder="Product name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            onClick={addProduct}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md hover:opacity-90"
          >
            <PlusCircle size={18} /> Add
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {products.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl p-5 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-500">GHS {p.price}</p>
              </div>
              <button
                onClick={() => deleteProduct(p.id!)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductManagementPage;
