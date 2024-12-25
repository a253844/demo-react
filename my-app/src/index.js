import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // 主題樣式
import 'primereact/resources/primereact.min.css'; // 基本樣式
import 'primeicons/primeicons.css'; // 圖標
import 'primeflex/primeflex.css'; // Flex 工具

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
    
);


