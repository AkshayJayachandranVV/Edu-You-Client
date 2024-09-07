import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    < GoogleOAuthProvider clientId='57845276235-3f0ilap4ri48e6vj35dio86punc3sm4e.apps.googleusercontent.com' >
    <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
