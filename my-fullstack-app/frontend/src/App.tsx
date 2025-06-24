import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useMenu from './hooks/useMenu';
import { componentMap } from './routes/componentMap';

import Layout from './components/Layout/Layout'

import HomePage from './components/Page/HomePage'

// 定義 state 型別
interface AppState {
}

function App() {
  const { menu, loading } = useMenu();
    
  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Layout MenuGroup={menu} />}>
          <Route index element={<HomePage />} />
          {menu.flatMap((group, groupIndex) =>
            group.menus
              .filter(menuItem => !menuItem.disabled)
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
      </Routes>

    </BrowserRouter>
  );
}

export default App;
