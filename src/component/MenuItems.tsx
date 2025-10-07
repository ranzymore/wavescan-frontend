
type MenuItemsProps ={
    image: string;
    title: string;
    description: string;
    price: string;
}

const MenuItems = ({ image, title, description, price }: MenuItemsProps) => {
  return (
    <>
       <div className="bg-black bg-opacity-50 p-4 rounded-2xl max-w-md mt-2">
                <p className="flex flex-row gap-3 items-center">
                <img src={image} alt="Food" className="w-25 h-25 rounded-full border-1 border-white object-cover" />
                    <p className="font-bold text-2xl text-white font-serif">{title}</p>
                </p>
                  <p className="text-sm text-gray-500">{description}</p>
                    {/* Price and Order */}
                <div className="flex justify-between items-center mt-4">
                    <span onClick={() => {}} className="text-white font-semibold font-serif">{price}</span>
                    {/* <Button name="Order" bgColor="bg-green-500" handleClick={() => {}} /> */}
                </div>
        </div>
    </>
  )
}

export default MenuItems