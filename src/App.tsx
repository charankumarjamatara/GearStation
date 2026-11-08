
import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import PopularRentals from './components/PopularRentals';
import Categories from './components/Categories';
import HowItWorks from './components/HowItWorks';
import LatestAdditions from './components/LatestAdditions';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CategoryCatalog from './components/CategoryCatalog';
import ProductDetailPage from './components/ProductDetailPage';
import DateSelectionBanner from './components/DateSelectionBanner';
import CartModal from './components/CartModal';
import GearStationLoader from './components/GearStationLoader';
import GlobalAssistanceWidget from './components/GlobalAssistanceWidget';
import { 
  saveCategoryScrollPosition, 
  setReturningFromProduct 
} from './utils/scrollRestoration';
import { scrollToSectionWithStabilization } from './utils/navigation';
import { getProductBySlugOrId } from './data/products';
import './App.css';

// In-memory application startup flag (resets ONLY on full browser reload / F5 / Ctrl+R)
let hasAppLoadedInitially = false;

const SECTION_HASHES = ['#rent-gear', '#categories', '#how-it-works', '#about', '#contact'];

export function parseRoute(pathname?: string, hash?: string) {
  const p = pathname || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const h = hash !== undefined ? hash : (typeof window !== 'undefined' ? window.location.hash : '');

  // 1. Clean URL pathname
  if (p.startsWith('/products/')) {
    const slug = p.replace(/^\/products\//, '').split(/[?#]/)[0].replace(/\/$/, '');
    if (slug) return { product: slug, category: null, isLegacyHash: false };
  }
  if (p.startsWith('/categories/')) {
    const cat = p.replace(/^\/categories\//, '').split(/[?#]/)[0].replace(/\/$/, '');
    if (cat) return { product: null, category: cat, isLegacyHash: false };
  }

  // 2. Legacy hash URL
  if (h.startsWith('#product/')) {
    const slug = h.replace(/^#product\//, '').split(/[?#]/)[0];
    if (slug) return { product: slug, category: null, isLegacyHash: true };
  }
  if (h.startsWith('#category/')) {
    const cat = h.replace(/^#category\//, '').split(/[?#]/)[0];
    if (cat) return { product: null, category: cat, isLegacyHash: true };
  }

  return { product: null, category: null, isLegacyHash: false };
}

interface AppProps {
  initialPath?: string;
}

function App({ initialPath }: AppProps = {}) {
  const [isLoading, setIsLoading] = useState(() => !hasAppLoadedInitially);

  const handleLoaderComplete = useCallback(() => {
    hasAppLoadedInitially = true;
    setIsLoading(false);
  }, []);

  const initialRoute = parseRoute(initialPath);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialRoute.category);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(initialRoute.product);

  const prevLocationRef = useRef<{ pathname: string; hash: string }>({
    pathname: typeof window !== 'undefined' ? window.location.pathname : (initialPath || '/'),
    hash: typeof window !== 'undefined' ? window.location.hash : ''
  });

  // Smoothly resolve legacy hash URLs to clean URLs on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentHash = window.location.hash;
    if (currentHash.startsWith('#product/')) {
      const slug = currentHash.replace(/^#product\//, '').split(/[?#]/)[0];
      if (slug) {
        window.history.replaceState(null, '', `/products/${slug}`);
      }
    } else if (currentHash.startsWith('#category/')) {
      const cat = currentHash.replace(/^#category\//, '').split(/[?#]/)[0];
      if (cat) {
        window.history.replaceState(null, '', `/categories/${cat}`);
      }
    }
  }, []);

  // Scroll to section when initial loader finishes if a section hash is present in URL
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (SECTION_HASHES.includes(hash)) {
        const secId = hash.substring(1);
        const cleanup = scrollToSectionWithStabilization(secId, true);
        return cleanup;
      }
    }
  }, [isLoading]);

  // Dynamic document title and meta description updates for view state
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const metaDesc = document.querySelector('meta[name="description"]');
    const baseTitle = 'Gear Station — Premium Camera & Travel Gear Rentals | Hyderabad';
    const baseDesc = 'Rent premium action cameras, DJI, Insta360, GoPro, riding gear, and outdoor adventure equipment in Hyderabad. Flexible daily rental plans from Gear Station.';

    if (selectedProduct) {
      const prod = getProductBySlugOrId(selectedProduct);
      if (prod) {
        document.title = `${prod.name} on Rent in Hyderabad | Gear Station`;
        if (metaDesc) {
          const snippet = prod.description ? prod.description.slice(0, 95) : 'High quality rental equipment';
          metaDesc.setAttribute('content', `Rent ${prod.name} in Hyderabad starting at ${prod.price}/day. ${snippet}. Available with doorstep delivery from Gear Station.`);
        }
      } else {
        document.title = 'Product Details | Gear Station';
      }
    } else if (selectedCategory) {
      const categoryNames: Record<string, string> = {
        'photography': 'Photography & Camera Equipment',
        'outdoor': 'Outdoor & Adventure Gear',
        'dji-cameras': 'DJI Cameras & Combos',
        'action-cameras': 'Action Cameras',
        'insta-360': 'Insta360 Action Cameras',
        'mobile-gimbals': 'Mobile Gimbals',
        'wireless-mics': 'Wireless & Collar Mics',
        'tripod-accessories': 'Tripod & Camera Accessories',
        'action-camera-add-ons': 'Action Camera Add-Ons',
        'trekking-gear': 'Trekking & Hiking Gear',
        'riding-gear': 'Motorcycle Riding Gear',
        'winter-jackets': 'Winter & Snow Jackets',
        'riding-luggage': 'Riding Luggage & Tail Bags',
        'backpacks': 'Trekking Backpacks',
        'camp-accessories': 'Camping Accessories'
      };
      const catTitle = categoryNames[selectedCategory] || selectedCategory;
      document.title = `${catTitle} on Rent in Hyderabad | Gear Station`;
      if (metaDesc) {
        metaDesc.setAttribute('content', `Browse and rent ${catTitle} in Hyderabad with Gear Station. High-quality equipment, transparent pricing, and flexible rental plans.`);
      }
    } else {
      document.title = baseTitle;
      if (metaDesc) {
        metaDesc.setAttribute('content', baseDesc);
      }
    }
  }, [selectedProduct, selectedCategory]);

  // Synchronize state with browser back/forward and URL changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      const prevLoc = prevLocationRef.current;
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;
      const route = parseRoute(currentPath, currentHash);

      // Category -> Product transition: save scroll position
      if (route.product && prevLoc.pathname.startsWith('/categories/')) {
        const cat = prevLoc.pathname.replace(/^\/categories\//, '').split(/[?#]/)[0];
        saveCategoryScrollPosition(cat, window.scrollY);
      } else if (route.product && prevLoc.hash.startsWith('#category/')) {
        const cat = prevLoc.hash.replace(/^#category\//, '').split(/[?#]/)[0];
        saveCategoryScrollPosition(cat, window.scrollY);
      }

      const isReturning = Boolean(
        route.category && 
        (prevLoc.pathname.startsWith('/products/') || prevLoc.hash.startsWith('#product/'))
      );
      setReturningFromProduct(isReturning);

      setSelectedProduct(route.product);
      setSelectedCategory(route.category);

      // In-page section hash handling
      if (!route.product && !route.category) {
        if (SECTION_HASHES.includes(currentHash)) {
          const secId = currentHash.substring(1);
          setTimeout(() => {
            scrollToSectionWithStabilization(secId, true);
          }, 60);
        } else if (!currentHash && (prevLoc.pathname !== '/' || prevLoc.hash)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (!isReturning) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      prevLocationRef.current = { pathname: currentPath, hash: currentHash };
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleSelectCategory = (categoryKey: string) => {
    setReturningFromProduct(false);
    setSelectedCategory(categoryKey);
    setSelectedProduct(null);
    window.history.pushState(null, '', `/categories/${categoryKey}`);
    prevLocationRef.current = { pathname: `/categories/${categoryKey}`, hash: '' };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productIdOrSlug: string) => {
    if (selectedCategory) {
      saveCategoryScrollPosition(selectedCategory, window.scrollY);
    }
    setSelectedProduct(productIdOrSlug);
    setSelectedCategory(null);
    window.history.pushState(null, '', `/products/${productIdOrSlug}`);
    prevLocationRef.current = { pathname: `/products/${productIdOrSlug}`, hash: '' };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      setReturningFromProduct(false);
      setSelectedCategory(null);
      setSelectedProduct(null);
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/');
        prevLocationRef.current = { pathname: '/', hash: '' };
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="app">
      {isLoading && <GearStationLoader onComplete={handleLoaderComplete} />}
      <Header />
      <main>
        {selectedProduct ? (
          <ProductDetailPage 
            productId={selectedProduct} 
            onBack={handleBackToHome}
            onSelectProduct={handleSelectProduct}
          />
        ) : selectedCategory ? (
          <CategoryCatalog 
            categoryKey={selectedCategory} 
            onBack={handleBackToHome}
            onSelectProduct={handleSelectProduct}
          />
        ) : (
          <>
            <Hero />
            <Stats />
            <Categories onSelectCategory={handleSelectCategory} />
            <PopularRentals onSelectProduct={handleSelectProduct} />
            <HowItWorks />
            <LatestAdditions 
              onSelectCategory={handleSelectCategory} 
              onSelectProduct={handleSelectProduct}
            />
            <About />
            <Contact />
            <Testimonials />
          </>
        )}
      </main>
      <Footer />
      <GlobalAssistanceWidget />
      <DateSelectionBanner />
      <CartModal />
    </div>
  );
}

export default App;

