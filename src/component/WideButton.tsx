
type ButtonProps ={
    name: string,
    bgColor: string,
    handleClick: ()=>void
}
const WideButton = ({name, bgColor, handleClick}: ButtonProps) => {
  return (

          <button className={`w-full h-15 ${bgColor} mt-10 rounded-2xl text-2xl text-white font-bold`} onClick={handleClick}>
             {name}
          </button>  )
}

export default WideButton