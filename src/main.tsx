import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { ShopProvider } from './store/ShopContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <MotionConfig reducedMotion="user">
        <ShopProvider>
          <App />
        </ShopProvider>
      </MotionConfig>
    </HashRouter>
  </React.StrictMode>,
);
