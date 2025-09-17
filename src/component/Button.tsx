import React from 'react'

type ButtonProps ={
    name: string,
    bgColor: string,
    handleClick: ()=>void
}
const Button = ({name, bgColor, handleClick}: ButtonProps) => {
  return (

          <button className={`w-30 h-10 ${bgColor}  rounded-2xl text-1xl text-white font-serif `} onClick={handleClick}>
             {name}
          </button>  )
}

export default Button