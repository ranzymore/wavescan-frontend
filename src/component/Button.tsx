
type ButtonProps = {
    name: string,
    bgColor: string,
    handleClick: () => void
}

const Button = ({ name, bgColor, handleClick }: ButtonProps) => {
    return (
        <button 
            onClick={handleClick}
            className={`${bgColor} text-1xl text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 font-medium border border-gray-100 hover:bg-blue-400`}
        >
            {name}
        </button>
    )
}

export default Button;