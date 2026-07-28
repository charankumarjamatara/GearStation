import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import PopularRentals from './components/PopularRentals';
import Categories from './components/Categories';
import HowItWorks from './components/HowItWorks';
import WhyChooseUs from './components/WhyChooseUs';
import LatestAdditions from './components/LatestAdditions';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Stats />
        <PopularRentals />
        <Categories />
        <HowItWorks />
        <WhyChooseUs />
        <LatestAdditions />
        <About />
        <Contact />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default App;
