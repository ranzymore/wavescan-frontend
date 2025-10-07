
const CategoryCard = ({ name , count, isActive }: { name: string, count: number, isActive: boolean }) => {
  return (
    <button 
    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
      isActive 
        ? 'bg-green-500 text-white' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {name}
    {count > 0 && <span className="ml-2 text-xs">({count})</span>}
  </button>
  );
};

export default CategoryCard;
