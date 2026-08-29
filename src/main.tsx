import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DateProvider } from './DateContext.tsx'
import { CartProvider } from './CartContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <DateProvider>
        <App />
      </DateProvider>
    </CartProvider>
  </StrictMode>,
)
