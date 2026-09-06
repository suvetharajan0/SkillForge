import { StrictMode } from 'react' 
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import {ThemeProvider} from './context/ThemeContext.jsx'
import {ToastProvider} from './context/ToastContext.jsx'
import ToastContainer from './components/Toast.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider>
      <ToastProvider>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
      </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
    </StrictMode>
)