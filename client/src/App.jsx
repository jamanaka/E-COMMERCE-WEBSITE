import  './App.css'
import './index.css'
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminFeatures from "./pages/admin-view/features";
import AdminProducts from "./pages/admin-view/products";
import AdminOrder from "./pages/admin-view/order";
import AdminLayout from "./components/admin-view/layout";
import ShoppingLayout from './components/shopping-views/layout';
import NotFound from './pages/not-found';
import ShoppingAccount from './pages/shopping-view/account';
import ShoppingListing from './pages/shopping-view/listing';
import ShoppingCheckOut from './pages/shopping-view/checkout';
import ShoppingHome from './pages/shopping-view/home';
import CheckAuth from './components/common/check-auth';
import UnauthPage from './pages/unauth-page';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './store/auth-slice';

function App() {

  const {isAuthenticated , user} = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() =>{
    dispatch(checkAuth())
  }, [dispatch]);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Parent Route Authentication */}
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <AuthLayout />
          </CheckAuth>
        }>
          {/* Child Routes */}
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Parent Routes Administration*/}
        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
          <AdminLayout />
        </CheckAuth>
        }>
          {/* Child Routes */}
          <Route path="orders" element={<AdminOrder />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Parent Routes Shopping */}
        <Route path='/shop' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
          <ShoppingLayout />
        </CheckAuth>
        }>
          {/* child Routes */}
          <Route path='home' element={<ShoppingHome />} />
          <Route path='checkout' element={<ShoppingCheckOut />} />
          <Route path='listing' element={<ShoppingListing />} />
          <Route path='account' element={<ShoppingAccount />} />
        </Route>

        {/* Parent Route Unauth-Page */}
        <Route path='unauth-page' element={<UnauthPage />} />
      
        {/* Rarent Route Page not found */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
