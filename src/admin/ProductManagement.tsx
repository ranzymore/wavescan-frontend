import React, { useState, useEffect } from "react";
import { ArrowLeft, PlusCircle, Trash2, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";

type Product = {
  id?: string;
  name: string;
  price: number;
};

interface ProductManagementPageProps {
  id: string;
}

const ProductManagementPage: React.FC<ProductManagementPageProps> = ({ id }) => {
  const storeId = localStorage.getItem("storeId") || "";
  const token = localStorage.getItem("token") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<{ name: string; price: string }>({
    name: "",
    price: "",
  });
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [addingProduct, setAddingProduct] = useState<boolean>(false);
  const [qrCode, setQrCodeUrl] = useState<string | null>(null);
  const [qrGenerated, setQrGenerated] = useState<boolean>(false);
  const [generatingQR, setGeneratingQR] = useState<boolean>(false);

  // 🧠 Fetch all products in the category
  const listProducts = async () => {
    try {
      setLoading(true);
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
      setCategoryName(data.name);
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add new product
  const addProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price) {
      toast.error("Fill all fields before adding");
      return;
    }

    const price = Number(newProduct.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setAddingProduct(true);
      const res = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newProduct.name.trim(),
            price: price,
            categoryId: id,
          }),
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add product");
      }
      
      toast.success("Product added successfully");
      setNewProduct({ name: "", price: "" });
      await listProducts();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Error adding product");
    } finally {
      setAddingProduct(false);
    }
  };

  // ❌ Delete product
  const deleteProduct = async (pid: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    
    const deleteToast = toast.loading("Deleting product...");
    
    try {
      const res = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/product/${pid}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
      
      toast.success("Product deleted", { id: deleteToast });
      await listProducts();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Error deleting product", { id: deleteToast });
    }
  };

  // 🧾 Generate QR Code for menu
  const generateQRCode = async () => {
    if (!storeId || !token) {
      toast.error("Store ID or token not found");
      return;
    }

    try {
      setGeneratingQR(true);
      const res = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/menu/generate-qrc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate QR code");
      }
      
      const data = await res.json();
      console.log("QR Code data:", data);
      
      setQrCodeUrl(data.qrCode);
      setQrGenerated(true);
      toast.success("QR Code generated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Error generating QR code");
    } finally {
      setGeneratingQR(false);
    }
  };

  // Download QR Code
  const downloadQRCode = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `menu-qr-${storeId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code downloaded");
  };

  useEffect(() => {
    listProducts();
  }, [id]);

  // Handle Enter key for adding products
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !addingProduct) {
      addProduct();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-gray-50 p-6">
      {/* Main Content */}
      <div className={`max-w-5xl mx-auto ${qrGenerated ? 'blur-sm pointer-events-none' : ''}`}>
        {/* Header */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-700 hover:text-black mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="mr-2" size={18} /> Back to Categories
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Manage Products for{" "}
          <span className="text-blue-600">{categoryName || "..."}</span>
        </h1>

        {/* Add Product Form */}
        <div className="flex flex-wrap gap-3 mb-8 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-4">
          <input
            type="text"
            placeholder="Product name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            disabled={addingProduct}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            onKeyPress={handleKeyPress}
            className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            disabled={addingProduct}
            min="0"
            step="0.01"
          />
          <button
            onClick={addProduct}
            disabled={addingProduct}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {addingProduct ? (
              <ClipLoader color="#ffffff" size={18} />
            ) : (
              <>
                <PlusCircle size={18} /> Add
              </>
            )}
          </button>
        </div>

        {/* Product List */}
        {loading ? (
          <div className="text-center py-10">
            <ClipLoader color="#2563eb" />
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {products.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg p-5 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-sm text-gray-500">GHS {p.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => deleteProduct(p.id!)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Delete product"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">No products available yet.</p>
        )}

        {/* QR Code Button */}
        <div className="mt-10 p-6 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Generate QR Code for Menu
          </h2>
          <button
            onClick={generateQRCode}
            disabled={generatingQR}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {generatingQR ? (
              <span className="flex items-center gap-2">
                <ClipLoader color="#ffffff" size={18} />
                Generating...
              </span>
            ) : (
              "Generate QR Code"
            )}
          </button>
        </div>
      </div>

      {/* ✅ QR Code Modal */}
      <AnimatePresence>
        {qrGenerated && qrCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setQrGenerated(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setQrGenerated(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Success Content */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  QR Code Generated!
                </h2>
                <p className="text-gray-600 mb-6">
                  Scan this QR code to view your menu
                </p>

                {/* QR Code Image */}
                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="mx-auto w-64 h-64 object-contain"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={downloadQRCode}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(qrCode);
                      toast.success("QR Code URL copied!");
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagementPage;