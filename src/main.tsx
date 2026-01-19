import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'primeicons/primeicons.css'
import "primereact/resources/themes/mira/theme.css"
// import "primereact/resources/themes/viva-dark/theme.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
