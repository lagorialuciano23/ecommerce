import Login from './modules/auth/pages/Login';
import './modules/auth/pages/login.css';
import {Routes,Route} from 'react-router-dom';
import ProductsPage from './modules/products/pages/ProductsPage.jsx';
import Dashboard from './modules/shared/pages/Dashboard.jsx';
import Error from './modules/products/pages/Error.jsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/products" element={<ProductsPage/>}/>
      <Route path="*" element={<Error/>}/>
      {/*Ruta default: si manda algo erroneo*/}
      
    </Routes>
  );
}

export default App;
