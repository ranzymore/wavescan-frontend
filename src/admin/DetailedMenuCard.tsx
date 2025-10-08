import React, { useEffect, useState } from "react";
import { QrCode, Pencil, ArrowLeft, Circle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

type Product = {
  id: string;
  name: string;
  price: number;
  status: string;
};

type Category = {
  id: string;
  name: string;
  status: string;
  products: Product[];
  updatedAt: string;
};

const DetailedMenuCard: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const storeId = localStorage.getItem("storeId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const listProducts = async () => {
      try {
        if (!storeId || !categoryId) return;

        const res = await fetch(
          `https://wavescan-backend.vercel.app/api/store/${storeId}/category/${categoryId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        const categoryData: Category = {
          id: data.id,
          name: data.name,
          status: data.status,
          products: data.products || [],
          updatedAt: data.updatedAt,
        };

        setCategory(categoryData);
      } catch (err) {
        console.error("Error fetching category:", err);
      } finally {
        setLoading(false);
      }
    };

    listProducts();
  }, [categoryId, storeId, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p className="text-sm mb-3">Loading menu details... <ClipLoader/></p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p className="text-sm mb-3">Category not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white w-full max-w-4xl p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 transition-all">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-800 w-fit"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back</span>
          </button>

          <div
            className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
              category.status.toLowerCase() === "active"
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {category.status}
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {category.name}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Last updated {new Date(category.updatedAt).toLocaleString()}
          </p>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {category.products.length > 0 ? (
            category.products.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-all"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">₵{item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Circle
                    size={10}
                    className={`${
                      item.status === "active"
                        ? "text-green-500 fill-green-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="text-xs text-gray-500">{item.status}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center italic col-span-full">
              No products found in this category.
            </p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto">
            + Product
          </button>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <Pencil size={16} />
              <span className="text-sm">Edit</span>
            </button>
            <button
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              title="Download QR"
            >
              <QrCode size={16} />
              <span className="text-sm">QR Code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedMenuCard;
