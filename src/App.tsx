import { Route, Routes } from 'react-router-dom';
import './App.css'
import SignIn from './admin/SignIn';
import SignUp from './admin/SignUp';
import Home from './component/Home';
import Dashboard from './admin/Dashboard';
import Menu from './admin/CreateMenu';

function App() {

  return (
    <div className='flex flex-col min-h-screen '>
    <Routes>
      <Route path ='/' element = {<Dashboard/>}/>
      <Route path ='/signup' element = {<SignUp/>}/>
      <Route path ='/signin' element = {<SignIn/>}/>
      <Route path='/dashboard' element ={<Dashboard/>}/>
      <Route path='/menu' element ={<Menu/>}/>
      <Route path='/home' element = {<Home/>}/>
    </Routes>

   
    </div>
  );
}

export default App;
