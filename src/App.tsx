import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import TaxAssistant from './components/TaxAssistant';

function App() {
  useEffect(() => {
    document.title = 'Finacco Solutions | Financial & Tech Services';
    
    const defaultTitleElement = document.querySelector('[data-default]');
    if (defaultTitleElement) {
      defaultTitleElement.textContent = 'Finacco Solutions | Financial & Tech Services';
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <About />
              <Contact />
            </>
          } />
          <Route path="/tax-assistant" element={<TaxAssistant />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;