import { Share2, Trash2, Copy } from "lucide-react";
import MenuItems from "../component/MenuItems";
import bgImage from "../assets/fbg.jpeg"; 

const MenuCard = () => {
  return (
    <div
        className="relative min-h-[70vh] bg-cover bg-center rounded-2xl border-b-4 border-green-500 overflow-hidden"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

        {/* Title */}
        <h1 className="relative z-10 text-4xl p-16 text-white font-bold">
          <span className="animate-bounce">Wave</span>
          <span className="text-green-300 animate-pulse">Scan</span>
        </h1>

        {/* Menu Details */}
        <div className="relative z-10 p-4 flex flex-col h-[60%]">
          {/* Action Buttons */}
          <div className="flex flex-row justify-end gap-6 mb-6">
            <button>
              <Share2 className="w-5 h-5 text-white hover:text-green-300" />
            </button>
            <button>
              <Copy className="w-5 h-5 text-white hover:text-green-300" />
            </button>
            <button>
              <Trash2 className="w-5 h-5 text-white hover:text-red-400" />
            </button>
          </div>

          {/* Menu Items Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <MenuItems image="/src/assets/banku.jpeg" title="Banku" description="A delicious Ghanaian dish made from fermented corn and cassava dough." price="GHS20.00" />
            <MenuItems image="/src/assets/jollof.jpeg" title="Jollof Rice" description="A popular West African dish made with rice, tomatoes, and spices." price="GHS25.00" />
            <MenuItems image="/src/assets/waakye.jpeg" title="Waakye" description="A traditional Ghanaian dish made with rice and beans." price="GHS15.00" />
            <MenuItems image="/src/assets/fried_rice.jpeg" title="Fried Rice" description="A flavorful rice dish stir-fried with vegetables and spices." price="GHS18.00" />
          </div>
        </div>
      </div>
  )
}

export default MenuCard