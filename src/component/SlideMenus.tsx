import { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import MenuCard from './MenuCard'
import ClipLoader from 'react-spinners/ClipLoader'
import { AlertCircle } from 'lucide-react'

type MenuItem = {
  id: string;
  name: string;
  products: [];
  items: number;
  status: string;
  lastUpdated: string;
};

const SlideMenus = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getMenu = async () => {
    const storeId = localStorage.getItem("storeId");
    const token = localStorage.getItem("token");

    if (!storeId || !token) {
      setError("Store ID or token not found");
      return;
    }

    try {
      setMenuLoading(true);
      setError("");
      
      const response = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${storeId}/menu`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.statusText}`);
      }

      const data = await response.json();
      setMenu(data.categories || []); // Store the fetched menu data in state
      console.log("Menu data:", data.categories);
    } catch (error) {
      console.error("Error fetching menu:", error);
      setError(error instanceof Error ? error.message : "Failed to load menus");
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: menu.length > 1, // Only loop if there's more than 1 item
    duration: 30,
  });

  useEffect(() => {
    if (!emblaApi || menu.length <= 1) return; // Don't auto-scroll if only 1 item

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [emblaApi, menu.length]);

  // Loading State
  if (menuLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <ClipLoader color="#10B981" size={40} />
          <p className="text-gray-600 text-sm md:text-base">Loading menus...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-6 md:p-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold mb-1">Error Loading Menus</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={getMenu}
              className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (menu.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-8 md:p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-gray-700 font-semibold mb-2 text-lg">No Menus Yet</h3>
          <p className="text-gray-500 text-sm">
            Create your first menu to get started
          </p>
        </div>
      </div>
    );
  }

  // Carousel with Menus
  return (
    <div>
      {/* Header with count */}
      <div className="flex items-center justify-between mb-4">
      
        <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
          {menu.length} {menu.length === 1 ? 'Menu' : 'Menus'}
        </span>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden rounded-lg shadow-md bg-white" ref={emblaRef}>
        <div className="flex">
          {menu.map((item) => (
            <div
              key={item.id}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-2 py-2"
            >
              <MenuCard
                categoryId={item.id}
                title={item.name}
                items={item.items}
                status={item.status}
                lastUpdated={item.lastUpdated}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots (optional) */}
      {menu.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {menu.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className="w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
              aria-label={`Go to menu ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SlideMenus;