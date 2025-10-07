import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

type ProductType = {
  id?: string;
  name: string;
  price: number;
  categoryId: string;
  description?: string;
};

type CategoryType = {
  id: string;
  name: string;
  items?: ProductType[];
};

const CreateMenuPage = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  const [newCategory, setNewCategory] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingDelete,setLoadingDelete] = useState(false);

  const storeId = localStorage.getItem("storeId");
  const token = localStorage.getItem("token");

  //  Fetch all categories
  const listCategories = async () => {
    if (!storeId || !token) return alert("Store ID or token not found");
    try {
      setLoadingCategory(true);
      const response = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/category`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();

      const formatted = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        items: cat.products || [],
      }));
      setCategories(formatted);
      if (formatted.length > 0 && !activeCategory) {
        setActiveCategory(formatted[0].id);
      }
      console.log("Categories fetched:", formatted);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategory(false);
    }
  };

  // Fetch products for a specific category
  const listProductsByCategory = async (categoryId: string) => {
    if (!storeId || !token) return;
    try {
      setLoadingProducts(true);
      const response = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/product`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      const filtered = data.filter(
        (product: ProductType) => product.categoryId === categoryId
      );
      setProducts(filtered);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Add new category
  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return alert("Enter category name");
    try {
      const response = await fetch(
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
      if (!response.ok) throw new Error("Failed to add category");
      const added = await response.json();
      setCategories((prev) => [...prev, added]);
      setNewCategory("");
      console.log("Category added:", added);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Add new product
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price)
      return alert("Please enter name and price");

    try {
      const response = await fetch(
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
            categoryId: activeCategory,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to add product");
      const added = await response.json();
      setProducts((prev) => [...prev, added]);
      setNewProduct({ name: "", price: "" });
      console.log("Product added:", added);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Delete product (with confirmation + backend delete)
  const deleteProduct = async (productId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      setLoadingDelete(true)
      const response = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setLoadingDelete(false);
        alert("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        alert(`Failed to delete product: ${response.statusText}`);
      }
    } catch (error) {
      setLoadingDelete(false);
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    listCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) listProductsByCategory(activeCategory);
  }, [activeCategory]);

  return (
    <div className="p-6 md:p-8 min-h-screen bg-transparent backdrop-blur-md">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Manage Menu
        </h1>

        {/* Add New Category */}
        <form
          onSubmit={addCategory}
          className="bg-white/80 border border-gray-100 shadow-md rounded-xl p-4 md:p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Add New Category
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring focus:ring-green-200"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </form>

        {/* Categories */}
        {loadingCategory ? (
          <p className="text-gray-500">Loading categories...</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === cat.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Add Product Form */}
        <form
          onSubmit={addProduct}
          className="bg-white/80 border border-gray-100 shadow-md rounded-xl p-4 md:p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Add Product
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Product Name"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            />
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder="Price (GHS)"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </form>

        {/* Product List */}
        <div className="bg-white/80 border border-gray-100 shadow-md rounded-xl p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Products</h3>

          {loadingProducts ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No products in this category.
            </p>
          ) : (
            <div className="space-y-2">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      GHS {item.price.toFixed(2)}
                    </p>
                  </div>
                   <button
                    onClick={() => deleteProduct(item.id!)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                   { loadingDelete ? <ClipLoader/> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMenuPage;
