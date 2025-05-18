import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Wishlist from './pages/WishlistPage';
import Registration from './pages/Registration';
import Login from './pages/login';
import PaymentsPage from './pages/PaymentsPage';
import { isAuthenticated, getRole } from './utils/auth';
import OrdersPage from './pages/OrdersPage';
import SellerPage from './pages/SellerPage';
import OrderingPage from './pages/OrderingPage';


const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  const role = getRole();
  if (!allowedRoles.includes(role)) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<MainPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        {/* <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} /> */}
        <Route path="/orders/:orderId" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><OrdersPage /></ProtectedRoute>} />
        <Route
          path="/addtocart"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orderingpage"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <OrderingPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={['SELLER']}>
              <SellerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={['SELLER']}>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        
        
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paymentspage"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
