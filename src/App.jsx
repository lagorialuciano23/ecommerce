import Login from './modules/auth/pages/Login';
import './modules/auth/pages/login.css';
import {Routes,Route} from 'react-router-dom';
import ProductsPage from './modules/products/pages/ProductsPage.jsx';
import Error from './modules/products/pages/Error.jsx';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/products" element={<ProductsPage/>}/>
      {/*Ruta default: si manda algo erroneo*/}
      <Route path="*" element={<Error/>}/> 
    </Routes>
  );
}

export default App;
