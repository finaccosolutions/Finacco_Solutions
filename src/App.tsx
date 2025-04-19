import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  useEffect(() => {
    // Update document title
    document.title = 'Finacco Solutions | Financial & Tech Services';
    
    // Get the default title element if it exists
    const defaultTitleElement = document.querySelector('[data-default]');
    if (defaultTitleElement) {
      defaultTitleElement.textContent = 'Finacco Solutions | Financial & Tech Services';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;