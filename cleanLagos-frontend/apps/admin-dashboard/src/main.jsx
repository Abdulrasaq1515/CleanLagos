import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('🚀 Starting CleanLagos Admin with original structure...');

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ CleanLagos Admin rendered successfully');
} catch (error) {
  console.error('❌ Failed to render CleanLagos Admin:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial;">
      <h1>CleanLagos Error</h1>
      <p>App.jsx failed to load: ${error.message}</p>
    </div>
  `;
}