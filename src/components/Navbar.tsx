import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronUp } from 'lucide-react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-blue-900 shadow-md py-2' 
            : 'bg-blue-800 py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-white">
            <Logo />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-gray-100 hover:text-white font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-gray-100 hover:text-white font-medium transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-100 hover:text-white font-medium transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-gray-100 hover:text-white font-medium transition-colors"
            >
              Contact
            </button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-40 bg-blue-900 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <div className="text-white">
            <Logo />
          </div>
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col space-y-6 px-8 py-8">
          <button 
            onClick={() => scrollToSection('home')} 
            className="text-xl text-gray-100 hover:text-white font-medium transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('services')} 
            className="text-xl text-gray-100 hover:text-white font-medium transition-colors"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-xl text-gray-100 hover:text-white font-medium transition-colors"
          >
            About Us
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="text-xl text-gray-100 hover:text-white font-medium transition-colors"
          >
            Contact
          </button>
        </nav>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-30 ${
          showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <ChevronUp size={24} />
      </button>
    </>
  );
};

export default Navbar;