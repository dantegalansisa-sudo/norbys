import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderPage from './pages/Order';
import Looks from './pages/Looks';
import Saved from './pages/Saved';
import Account from './pages/Account';
import Help from './pages/Help';
import { CookieBanner, TabBar, Toast } from './components/Layout';

const NO_TABBAR = ['/product', '/checkout', '/cart', '/order'];

export default function App() {
  const location = useLocation();
  const hideTabs = NO_TABBAR.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`app ${hideTabs ? 'app--no-tabs' : ''}`}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:number" element={<OrderPage />} />
          <Route path="/looks" element={<Looks />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/account" element={<Account />} />
          <Route path="/help/:slug" element={<Help />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
      {!hideTabs && <TabBar />}
      <Toast />
      {!location.pathname.startsWith('/checkout') && <CookieBanner />}
    </div>
  );
}
