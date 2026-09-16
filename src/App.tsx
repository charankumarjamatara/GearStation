
import { useState, useEffect, useRef } from 'react';
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
import { 
  saveCategoryScrollPosition, 
  setReturningFromProduct 
} from './utils/scrollRestoration';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#category/')) {
      return hash.replace('#category/', '');
    }
    return null;
  });

  const [selectedProduct, setSelectedProduct] = useState<string | null>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#product/')) {
      return hash.replace('#product/', '');
    }
    return null;
  });

  const prevHashRef = useRef<string>(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      const prevHash = prevHashRef.current;
      const newHash = window.location.hash;

      if (newHash.startsWith('#product/')) {
        // Leaving category to view product -> save current category scroll position
        if (prevHash.startsWith('#category/')) {
          const cat = prevHash.replace('#category/', '');
          saveCategoryScrollPosition(cat, window.scrollY);
        }
        setSelectedProduct(newHash.replace('#product/', ''));
        setSelectedCategory(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (newHash.startsWith('#category/')) {
        const cat = newHash.replace('#category/', '');
        const isFromProduct = prevHash.startsWith('#product/');

        if (isFromProduct) {
          setReturningFromProduct(true);
        } else {
          setReturningFromProduct(false);
        }

        setSelectedCategory(cat);
        setSelectedProduct(null);

        // Only scroll to top if this is a fresh category navigation, NOT returning from product details
        if (!isFromProduct) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (!newHash) {
        setReturningFromProduct(false);
        setSelectedCategory(null);
        setSelectedProduct(null);
      }

      prevHashRef.current = newHash;
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectCategory = (categoryKey: string) => {
    setReturningFromProduct(false);
    setSelectedCategory(categoryKey);
    setSelectedProduct(null);
    window.location.hash = `category/${categoryKey}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productIdOrSlug: string) => {
    const currentHash = window.location.hash;
    if (currentHash.startsWith('#category/')) {
      const cat = currentHash.replace('#category/', '');
      saveCategoryScrollPosition(cat, window.scrollY);
    }
    setSelectedProduct(productIdOrSlug);
    setSelectedCategory(null);
    window.location.hash = `product/${productIdOrSlug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setReturningFromProduct(false);
      setSelectedCategory(null);
      setSelectedProduct(null);
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      {isLoading && <GearStationLoader onComplete={() => setIsLoading(false)} />}
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
      <DateSelectionBanner />
      <CartModal />
    </div>
  );
}

export default App;

