import { MoreVertical,Eye,QrCode } from "lucide-react"

const MenuCard = ({ title, description, items, status, lastUpdated }:{title: string, description?: string, items: number, status: string, lastUpdated: string}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-2">{description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>{items} items</span>
          <span className={`px-2 py-1 rounded-full ${status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            {status}
          </span>
        </div>
      </div>
      <button className="p-1 hover:bg-gray-100 rounded">
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </button>
    </div>
    
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">Updated {lastUpdated}</span>
      <div className="flex gap-2">
        <button className="p-1 hover:bg-gray-100 rounded" title="View Menu">
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded" title="Download QR">
          <QrCode className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  </div>
  )
}

export default MenuCard