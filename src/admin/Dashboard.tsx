import { Bell, MoreVertical, QrCode, BarChart3, Eye, Settings, Plus, Search, Filter } from "lucide-react";
import Button from "../component/Button";
import CategoryCard from "../component/CategoryCard";
import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import SlideMenus from "../component/SlideMenus";
  



const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const recentActivity = [
    { action: "Menu 'Lunch Special' updated", time: "2 hours ago" },
    { action: "QR Code downloaded for 'Dinner Menu'", time: "5 hours ago" },
    { action: "New menu 'Happy Hour' created", time: "1 day ago" }
  ];

  const stats = {
    totalMenus: 5,
    totalScans: 1234,
    viewsToday: 87,
    activeMenus: 4
  };
    
  return (
    <div className="p-4 w-full md:p-6 mx-auto">
      {/* Header Section */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, <span className="text-green-600">admin</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Manage your digital menus and track performance
          </p>
        </div>
        <div className="flex items-center gap-1 self-end">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </div>
          <MoreVertical className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
        </div>
      </div>

     {/* Stats Overview */}
<div className="grid grid-cols-2 w-full md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <div className="bg-white/90 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Total Menus</p>
        <p className="text-2xl font-bold text-gray-900">{stats.totalMenus}</p>
      </div>
      <div className="bg-blue-100 p-3 rounded-xl">
        <QrCode className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>

  <div className="bg-white/90 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Total Scans</p>
        <p className="text-2xl font-bold text-gray-900">{stats.totalScans}</p>
      </div>
      <div className="bg-green-100 p-3 rounded-xl">
        <BarChart3 className="w-6 h-6 text-green-600" />
      </div>
    </div>
  </div>

  <div className="bg-white/90 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Views Today</p>
        <p className="text-2xl font-bold text-gray-900">{stats.viewsToday}</p>
      </div>
      <div className="bg-purple-100 p-3 rounded-xl">
        <Eye className="w-6 h-6 text-purple-600" />
      </div>
    </div>
  </div>

  <div className="bg-white/90 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">Active Menus</p>
        <p className="text-2xl font-bold text-gray-900">{stats.activeMenus}</p>
      </div>
      <div className="bg-orange-100 p-3 rounded-xl">
        <Settings className="w-6 h-6 text-orange-600" />
      </div>
    </div>
  </div>
</div>


      {/* Quick Actions */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-base md:text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-col-2 md:flex-row gap-3">
          <Button name=" New Menu" bgColor="bg-green-500" handleClick={() => navigate("/create_menu")} />
          <Button name="Analytics" bgColor="bg-blue-500" handleClick={() => console.log("Navigate to /analytics")} />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center border border-gray-300 rounded-xl h-12 px-4 bg-white">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search menus..."
            className="flex-1 p-2 rounded outline-none ml-2 bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search menus"
          />
        </div>
        <button className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Filter</span>
        </button>
      </div>

      {/* Menu Categories Filter */}
      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-3">Filter by Menu Type</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <CategoryCard name="All" count={28} isActive={true} />
          <CategoryCard name="Breakfast" count={8} isActive={false} />
          <CategoryCard name="Lunch" count={12} isActive={false} />
          <CategoryCard name="Dinner" count={15} isActive={false} />
          <CategoryCard name="Drinks" count={6} isActive={false} />
          <CategoryCard name="Desserts" count={4} isActive={false} />
          <CategoryCard name="Specials" count={3} isActive={false} />
        </div>
      </div>

      {/* My Menus Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-xl md:text-2xl font-semibold">My Menus</h2>
        <button 
          onClick={() => navigate('/menu')}
          className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Menu
        </button>
      </div>


<SlideMenus/>


      {/* Recent Activity & Analytics Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold">Recent Activity</h3>
            <button className="text-sm text-green-600 hover:text-green-700">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Analytics */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold">Performance Overview</h3>
            <button 
              onClick={() => console.log("Navigate to /analytics")}
              className="text-sm text-green-600 hover:text-green-700"
            >
              View Details
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Most Viewed Menu</span>
              <span className="text-sm font-medium">Lunch Special</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Peak Hours</span>
              <span className="text-sm font-medium">12 PM - 2 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. View Duration</span>
              <span className="text-sm font-medium">2m 34s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500 text-center">Menu engagement: 75% above average</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
