import React from 'react'
import { Navigate } from 'react-router-dom';
const SignIn = () => {
  const handleClick = () => {
    <Navigate to ='/home'/>
  }

  return (
    <div className='min-h-screen bg-gray-300 flex flex-col items-center justify-center p-2'>
      <h1 className='text-4xl font-bold'>Sign In</h1>
      <form action="" className='max-w-sm mx-auto mt-8 flex flex-col'>
        <input type="email" placeholder='Email' className='border border-gray-400 p-2 rounded-md w-full mb-4'/>
        <input type="password" placeholder='Password' className='border border-gray-400 p-2 rounded-md w-full mb-4'/>
        <button type="submit" onClick={handleClick} className='bg-green-600 text-white p-2 rounded-md text-sm'>
          Sign In
        </button>
      </form>
      <p className='mt-4'>
        Don't have an account? <a href="/signup" className='text-green-600'>Sign Up</a>
      </p>
    </div>
  )
}

export default SignIn