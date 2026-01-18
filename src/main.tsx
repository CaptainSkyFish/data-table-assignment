import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'primeicons/primeicons.css'
import "primereact/resources/themes/md-dark-deeppurple/theme.css"
import "primereact/resources/themes/md-dark-deeppurple/theme.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
