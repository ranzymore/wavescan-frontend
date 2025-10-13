import { useEffect, useState } from 'react'
import MenuCard from '../component/MenuCard'
import ClipLoader from 'react-spinners/ClipLoader'
import { AlertCircle} from 'lucide-react'
import { useParams } from 'react-router-dom'

type MenuItem = {
  id: string;
  name: string;
  products: [];
  items: number;
  status: string;
  lastUpdated: string;
};

const MenuView = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [storeId, setStoreId] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");

  const getMenu = async () => {
    const storedStoreId = localStorage.getItem("storeId");

    if (!storedStoreId) {
      setError("Store ID not found");
      return;
    }

    setStoreId(storedStoreId);

    try {
      setMenuLoading(true);
      setError("");
      
      const response = await fetch(
        `https://wavescan-backend.vercel.app/api/store/${menuId}/menu`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.statusText}`);
      }

      const data = await response.json();
      setMenu(data.categories || []); // Store the fetched menu data in state
      setStoreName(data.name || ""); // Store the fetched store name in state
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

  // Loading State
  if (menuLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 md:p-12 ">
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
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-md  p-6 md:p-8">
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

  // Grid with Menus
  return (
    <div className="min-h-screen bg-gradient-to-br from-black-100 via-blue-200 to-black-100 p-6">
      {/* Store ID Display */}
      {storeId && (
        <div className="flex items-center gap-2 mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 w-fit">
          <span className="text-sm text-blue-700">
            <span className="font-medium">Store Name:</span> {storeName}
          </span>
        </div>
      )}

      {/* Header with count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
          {menu.length} {menu.length === 1 ? 'Menu' : 'Menus'}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menu.map((item) => (
          <MenuCard
            key={item.id}
            categoryId={item.id}
            title={item.name}
            items={item.items}
            status={item.status}
            lastUpdated={item.lastUpdated}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuView;