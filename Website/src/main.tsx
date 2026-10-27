import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const root = createRoot(document.getElementById('root')!)

if (!clerkPublishableKey) {
  root.render(
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif', color: '#172554' }}>
      Clerk authentication is not configured. Set VITE_CLERK_PUBLISHABLE_KEY in Website/.env.local.
    </div>,
  )
} else {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
          <App />
        </ClerkProvider>
      </BrowserRouter>
    </StrictMode>,
  )
}
