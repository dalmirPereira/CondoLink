import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import IndexContext from './contexts/index.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IndexContext>
        <App />
    </IndexContext>
  </StrictMode>,
);
