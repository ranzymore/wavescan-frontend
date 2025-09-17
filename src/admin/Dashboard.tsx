import { Search, Filter } from "lucide-react";
import Button from "../component/Button";
import { useNavigate } from "react-router-dom";
import MenuCard from "../component/MenuCard";
import { Swiper, SwiperSlide } from "swiper/react";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Greeting */}
      <h1 className="text-2xl font-bold">
        Welcome, <span className="text-green-600">admin</span>
      </h1>

      {/* Create Menu */}
      <div className="flex flex-row justify-between items-center py-6">
        <p className="text-xl font-medium">Create a new Menu</p>
        <Button
          name="Create Menu"
          bgColor="bg-green-500"
          handleClick={() => navigate("/menu")}
        />
      </div>

      {/* Search Bar */}
      <div className="mt-4 flex flex-row items-center border border-gray-300 rounded-2xl h-14 px-3">
        <Search className="w-6 h-6 text-gray-400" />
        <input
          type="text"
          placeholder="Search existing menus..."
          className="flex-1 p-2 rounded outline-none ml-2 bg-transparent"
        />
        <Filter className="w-5 h-5 text-gray-400" />
      </div>

      {/* Menus Section */}
      <h2 className="text-2xl font-semibold py-5">Menus</h2>

      {/* Carousel of All the Menus */}
        <Swiper spaceBetween={20} slidesPerView={1} >
            <SwiperSlide>
                <MenuCard />
            </SwiperSlide>
            <SwiperSlide>
                <MenuCard />
            </SwiperSlide>
            <SwiperSlide>
                <MenuCard />
            </SwiperSlide>
        </Swiper>
    </div>
  );
};

export default Dashboard;
