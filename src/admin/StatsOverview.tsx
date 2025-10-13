import React, { useEffect, useState } from "react";
import { QrCode, BarChart3, Eye, Settings } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

type Store = {
  id: string;
  name: string;
  status: string;
  categories: {
    id: string;
    name: string;
    status: string;
    products: {
      id: string;
      name: string;
      price: number;
      status: string;
    }[];
  }[];
};

const StatsOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalMenus: 0,
    totalScans: 0,
    viewsToday: 0,
    activeMenus: 0,
  });

  const [loading, setLoading] = useState(true);

  const storeId = localStorage.getItem("storeId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId || !token) return;

      try {
        const res = await fetch(
          `https://wavescan-backend.vercel.app/api/store/${storeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch store stats");

        const data: Store = await res.json();

        const totalMenus = data.categories?.length || 0;
        const activeMenus =
          data.categories?.filter((cat) => cat.status === "active").length || 0;

        setStats({
          totalMenus,
          activeMenus,
          totalScans: 0, // Placeholder (until analytics is integrated)
          viewsToday: 0, // Placeholder (same)
        });
      } catch (err) {
        console.error("Error fetching store data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId, token]);


  

  return (
    <div className="grid grid-cols-2 w-full md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Menus */}
      <div className="bg-white/90 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Menus</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? <ClipLoader size={10} /> : stats.totalMenus}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl">
            <QrCode className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Total Scans */}
      <div className="bg-white/90 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Scans</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? <ClipLoader size={10} /> : stats.totalScans}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-xl">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Views Today */}
      <div className="bg-white/90 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Views Today</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? <ClipLoader size={10} /> : stats.viewsToday}
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-xl">
            <Eye className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Active Menus */}
      <div className="bg-white/90 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Menus</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? <ClipLoader size={10} /> : stats.activeMenus}
            </p>
          </div>
          <div className="bg-orange-100 p-3 rounded-xl">
            <Settings className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
