import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DateProvider } from './DateContext.tsx'
import { CartProvider } from './CartContext.tsx'

const rootElement = document.getElementById('root')!;

const appNode = (
  <StrictMode>
    <CartProvider>
      <DateProvider>
        <App />
      </DateProvider>
    </CartProvider>
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appNode);
} else {
  createRoot(rootElement).render(appNode);
}

