import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Package, FolderOpen } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast, Toaster } from "react-hot-toast";

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
  
  // Separate loading states for better UX
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const storeId = localStorage.getItem("storeId");
  const token = localStorage.getItem("token");

  // Fetch all categories
  const listCategories = async () => {
    if (!storeId || !token) {
      toast.error("Store ID or token not found");
      return;
    }
    
    try {
      setLoadingCategories(true);
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

      const formatted = data.map((cat: CategoryType) => ({
        id: cat.id,
        name: cat.name,
        items: cat.items || [],
      }));
      
      setCategories(formatted);
      if (formatted.length > 0 && !activeCategory) {
        setActiveCategory(formatted[0].id);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
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
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Add new category
  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    try {
      setAddingCategory(true);
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
      setActiveCategory(added.id);
      setNewCategory("");
      toast.success(`Category "${added.name}" created!`);
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to create category");
    } finally {
      setAddingCategory(false);
    }
  };

  // Add new product
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name.trim() || !newProduct.price) {
      toast.error("Please enter product name and price");
      return;
    }
    
    if (!activeCategory) {
      toast.error("Please select a category first");
      return;
    }

    try {
      setAddingProduct(true);
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
      toast.success(`Product "${added.name}" added!`);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setAddingProduct(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    
    try {
      setDeletingProductId(productId);
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
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success(`"${product?.name}" deleted successfully`);
      } else {
        toast.error(`Failed to delete product`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeletingProductId(null);
    }
  };

  // Delete category (and its products)
  const deleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    
    if (categoryProducts.length > 0) {
      toast.error(`Cannot delete category with ${categoryProducts.length} product(s). Delete products first.`);
      return;
    }

    try {
      setDeletingCategoryId(categoryId);

      const response = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/category/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const remainingCategories = categories.filter((c) => c.id !== categoryId);
        setCategories(remainingCategories);
        
        if (activeCategory === categoryId && remainingCategories.length > 0) {
          setActiveCategory(remainingCategories[0].id);
        } else if (remainingCategories.length === 0) {
          setActiveCategory("");
          setProducts([]);
        }
        
        toast.success(`Category "${category?.name}" deleted`);
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setDeletingCategoryId(null);
    }
  };




  useEffect(() => {
    listCategories();
   // getMenu();
  }, []);

  useEffect(() => {
    if (activeCategory) listProductsByCategory(activeCategory);
  }, [activeCategory]);

  const currentCategoryName = categories.find((c) => c.id === activeCategory)?.name;

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Menu Management
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Organize your menu by creating categories and adding products
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN - Category Management */}
            <div className="lg:col-span-1 space-y-6">
              {/* Add Category Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Create Category
                  </h2>
                </div>
                
                <form onSubmit={addCategory} className="space-y-3">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g., Drinks, Main Course"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    disabled={addingCategory}
                  />
                  <button
                    type="submit"
                    disabled={addingCategory || !newCategory.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingCategory ? (
                      <ClipLoader size={18} color="#fff" />
                    ) : (
                      <>
                        <PlusCircle className="w-5 h-5" />
                        Create Category
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Categories List Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Categories
                  </h2>
                  {categories.length > 0 && (
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {categories.length}
                    </span>
                  )}
                </div>
                
                {loadingCategories ? (
                  <div className="flex justify-center items-center py-12">
                    <ClipLoader size={40} color="#3B82F6" />
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">No categories yet</p>
                    <p className="text-gray-400 text-xs">Create your first category above</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className={`group flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                          activeCategory === cat.id
                            ? "bg-green-50 border-green-500 shadow-sm"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() => setActiveCategory(cat.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            activeCategory === cat.id ? "text-green-700" : "text-gray-700"
                          }`}>
                            {cat.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {cat.items?.length || 0} items
                          </p>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCategory(cat.id);
                          }}
                          disabled={deletingCategoryId === cat.id}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            activeCategory === cat.id 
                              ? "hover:bg-red-100 text-red-500" 
                              : "hover:bg-red-50 text-gray-400 hover:text-red-500"
                          }`}
                          title="Delete category"
                        >
                          {deletingCategoryId === cat.id ? (
                            <ClipLoader size={14} color="#EF4444" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - Product Management */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add Product Card */}
              {activeCategory && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-green-500" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Add Product to "{currentCategoryName}"
                    </h2>
                  </div>

                  <form onSubmit={addProduct} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="e.g., Coca Cola"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                          disabled={addingProduct}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (GHS)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct((prev) => ({ ...prev, price: e.target.value }))
                          }
                          placeholder="0.00"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                          disabled={addingProduct}
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={addingProduct || !newProduct.name.trim() || !newProduct.price}
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingProduct ? (
                        <ClipLoader size={18} color="#fff" />
                      ) : (
                        <>
                          <PlusCircle className="w-5 h-5" />
                          Add Product
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Products List Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {currentCategoryName ? `Products in "${currentCategoryName}"` : "Products"}
                  </h2>
                  {products.length > 0 && (
                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {products.length}
                    </span>
                  )}
                </div>

                {!activeCategory ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No Category Selected</p>
                    <p className="text-gray-400 text-sm">Select a category to view and manage products</p>
                  </div>
                ) : loadingProducts ? (
                  <div className="flex justify-center items-center py-16">
                    <ClipLoader size={40} color="#10B981" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No Products Yet</p>
                    <p className="text-gray-400 text-sm">Add your first product using the form above</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {products.map((item) => (
                      <div
                        key={item.id}
                        className="group flex items-center justify-between bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="font-semibold text-gray-900 truncate text-lg">
                            {item.name}
                          </h3>
                          <p className="text-2xl font-bold text-green-600 mt-1">
                            GHS {item.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => deleteProduct(item.id!)}
                          disabled={deletingProductId === item.id}
                          className="flex-shrink-0 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110"
                          title="Delete product"
                        >
                          {deletingProductId === item.id ? (
                            <ClipLoader size={20} color="#EF4444" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateMenuPage;