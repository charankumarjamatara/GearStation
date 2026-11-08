import { renderToString } from 'react-dom/server';
import App from './App';
import { DateProvider } from './DateContext';
import { CartProvider } from './CartContext';

export function render(url: string) {
  const html = renderToString(
    <CartProvider>
      <DateProvider>
        <App initialPath={url} />
      </DateProvider>
    </CartProvider>
  );
  return { html };
}

