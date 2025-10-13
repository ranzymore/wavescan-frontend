import { Route, Routes } from 'react-router-dom';
import './App.css'
import SignIn from './admin/SignIn';
import SignUp from './admin/SignUp';
import Home from './component/Home';
import Dashboard from './admin/Dashboard';
import CreateMenuPage from './admin/CreateMenu';
import CategoryManagementPage from './admin/CategoryManagement';
import DetailedMenuCard from './admin/DetailedMenuCard';
import MenuView from './admin/MenuView';

function App() {

  return (
    <div className='flex flex-col min-h-screen '>
    <Routes>
      <Route path ='/' element = {<SignIn/>}/>
      <Route path ='/signup' element = {<SignUp/>}/>
      <Route path ='/signin' element = {<SignIn/>}/>
      <Route path='/dashboard' element ={<Dashboard/>}/>
      <Route path='/category_management' element ={<CategoryManagementPage/>}/>
      <Route path='/create_menu' element ={<CreateMenuPage/>}/>
      <Route path = '/detailed_menu/:categoryId' element ={<DetailedMenuCard/>}/>
      <Route path='/home' element = {<Home/>}/>
      <Route path='/menu/:menuId' element = {<MenuView/>}/>

    </Routes>

   
    </div>
  );
}

export default App;
