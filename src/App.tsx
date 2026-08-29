
import { useState, useEffect } from 'react';
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
import DateSelectionBanner from './components/DateSelectionBanner';
import CartModal from './components/CartModal';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#category/')) {
      return hash.replace('#category/', '');
    }
    return null;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#category/')) {
        setSelectedCategory(hash.replace('#category/', ''));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash) {
        setSelectedCategory(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectCategory = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    window.location.hash = `category/${categoryKey}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Header />
      <main>
        {selectedCategory ? (
          <CategoryCatalog categoryKey={selectedCategory} onBack={handleBackToHome} />
        ) : (
          <>
            <Hero />
            <Stats />
            <Categories onSelectCategory={handleSelectCategory} />
            <PopularRentals />
            <HowItWorks />
            <LatestAdditions onSelectCategory={handleSelectCategory} />
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

