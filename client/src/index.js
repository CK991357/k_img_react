import 'antd/dist/reset.css'; // 导入 Ant Design 的全局样式
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 保留基础样式
// import reportWebVitals from './reportWebVitals'; // 移除

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(); // 移除
