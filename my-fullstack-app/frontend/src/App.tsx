import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation  } from "react-router-dom";
import useMenu from './hooks/useMenu';
import { componentMap } from './routes/componentMap';

import Layout from './components/Layout/Layout'

import HomePage from './components/Page/HomePage'
import LoginPage from './components/Page/LoginPage';

// 定義 state 型別
interface AppState {
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [isAuth, setIsAuth] = useState(!!token);

  useEffect(() => {
    if (!token && location.pathname !== "/login") {
      navigate("/login");
    }else{
      setIsAuth(!!token)
    }
  }, [ token, navigate, location]);

  const { menu, loading } =  useMenu(isAuth);

  if (!isAuth && location.pathname !== '/login') {
    return null; // 還沒登入且不在 login 頁面，先不渲染
  }
  
  if (loading) return <p>Loading...</p>;

  return (
      <Routes>
          <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuth(true)} />} />

          {isAuth && (
          <Route path="/" element={<Layout MenuGroup={menu} />}>
            <Route index element={<HomePage />} />
            {menu.flatMap((group, groupIndex) =>
              group.menus
                .filter((menuItem) => menuItem.isEnabled)
                .map((menuItem, index) => {
                  const Component = componentMap[menuItem.path];
                  return Component ? (
                    <Route
                      key={`${groupIndex}-${index}`}
                      path={menuItem.path}
                      element={<Component />}
                    />
                  ) : null;
                })
            )}
          </Route>
        )}
          
      </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
