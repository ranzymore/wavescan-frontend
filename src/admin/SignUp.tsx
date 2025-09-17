
const SignUp = () => {
  return (
    <div className='min-h-screen bg-gray-300 flex flex-col items-center justify-center p-2'>

    <h1 className='text-4xl font-bold'>Sign Up</h1>
    <form action="" className='max-w-sm mx-auto mt-8 flex flex-col'>
        <input type="text" placeholder='Username' className='border border-gray-400 p-2 rounded-md w-full mb-4'/>
        <input type="email" placeholder='Email' className='border border-gray-400 p-2 rounded-md w-full mb-4'/>
        <input type="password" placeholder='Password' className='border border-gray-400 p-2 rounded-md w-full mb-4'/>
        <input type="password" placeholder='Confirm Password' className='border border-gray-400 p-2 rounded-md w-full mb-4'/>
        <button type="submit" className='bg-green-600 text-white p-2 rounded-md text-sm'>Sign Up</button>
    </form>
    </div>
  )
}

export default SignUp