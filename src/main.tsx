import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'primeicons/primeicons.css'
import { ThemeProvider } from './context/ThemeContext.tsx'
import "primereact/resources/themes/md-light-indigo/theme.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider >
  </StrictMode>,
)
