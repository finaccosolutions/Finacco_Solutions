import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronUp,
  BarChart3, 
  Calculator, 
  Globe, 
  Palette, 
  Code, 
  Database,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ArrowRight,
  Users,
  Zap,
  Shield,
  BookOpen,
  Settings,
  CheckCircle
} from 'lucide-react';

function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const services = [
    {
      title: 'Finacco Advisory',
      description: 'Expert financial advisory services including tax planning, auditing, and business consulting',
      icon: <BarChart3 className="w-12 h-12 mb-4 text-indigo-600" />,
      features: [
        'Tax Planning',
        'Business Consulting',
        'Audit Services',
        'Financial Analysis',
        'Risk Assessment',
        'Compliance Management'
      ],
      bgColor: 'bg-gradient-to-br from-indigo-100 to-blue-100',
      link: 'https://advisory.finaccosolutions.com/'
    },
    {
      title: 'Finacco Connect',
      description: 'Advanced accounting utility software solutions for seamless financial management',
      icon: <Calculator className="w-12 h-12 mb-4 text-violet-600" />,
      features: [
        'Cloud Accounting',
        'Financial Reports',
        'Inventory Management',
        'Payroll System',
        'Bank Integration',
        'Real-time Analytics'
      ],
      bgColor: 'bg-gradient-to-br from-violet-100 to-purple-100',
      link: 'https://connect.finaccosolutions.com/'
    },
    {
      title: 'Web Designing',
      description: 'Custom web design solutions for your digital presence',
      icon: <Globe className="w-12 h-12 mb-4 text-blue-600" />,
      features: [
        'Responsive Design',
        'UI/UX Development',
        'E-commerce Solutions',
        'SEO Optimization',
        'Performance Tuning',
        'Content Management'
      ],
      bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-100'
    },
    {
      title: 'Graphic Designing',
      description: 'Creative graphic design services for your brand',
      icon: <Palette className="w-12 h-12 mb-4 text-purple-600" />,
      features: [
        'Brand Identity',
        'Logo Design',
        'Marketing Materials',
        'Social Media Graphics',
        'Print Design',
        'Packaging Design'
      ],
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100'
    },
    {
      title: 'Software Development',
      description: 'Custom software solutions for your business needs',
      icon: <Code className="w-12 h-12 mb-4 text-emerald-600" />,
      features: [
        'Custom Applications',
        'Mobile App Development',
        'API Integration',
        'Cloud Solutions',
        'Database Design',
        'System Architecture'
      ],
      bgColor: 'bg-gradient-to-br from-emerald-100 to-teal-100'
    },
    {
      title: 'Tally Solutions',
      description: 'Official Tally solutions and support',
      icon: <Database className="w-12 h-12 mb-4 text-amber-600" />,
      features: [
        'Implementation & Setup',
        'Customization',
        'Data Migration',
        'User Training',
        'Technical Support',
        'Performance Optimization'
      ],
      bgColor: 'bg-gradient-to-br from-amber-100 to-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full bg-white shadow-lg z-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                FS
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                FinAcco Solutions
              </span>
            </motion.div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {['Home', 'Services', 'About', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ scale: 1.1 }}
                  className="relative text-gray-600 hover:text-indigo-600 transition-colors group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Mobile Navigation */}
          <motion.div 
            initial={false}
            animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            className={`md:hidden overflow-hidden`}
          >
            <nav className="flex flex-col space-y-4 pb-4">
              {['Home', 'Services', 'About', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ x: 10 }}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Complete Business Solutions Partner
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Empowering businesses with comprehensive financial and technological solutions
              </p>
              <motion.a 
                href="#services"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:from-indigo-700 hover:to-blue-700 transition-colors text-lg shadow-lg"
              >
                Explore Our Services
              </motion.a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                alt="Business Solutions" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions to drive your business forward
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl transform transition-transform group-hover:scale-[1.02]"></div>
                <a 
                  href={service.link}
                  target={service.link ? "_blank" : undefined}
                  rel={service.link ? "noopener noreferrer" : undefined}
                  className={`relative block ${service.bgColor} p-8 rounded-2xl transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-white/80 backdrop-blur rounded-full p-2 shadow-md"
                    >
                      {service.icon}
                    </motion.div>
                  </div>
                  <p className="text-gray-700 mb-6">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2 text-gray-700 bg-white/50 backdrop-blur rounded-lg p-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {service.link && (
                    <div className="mt-6 flex justify-end">
                      <ExternalLink className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative overflow-hidden bg-gradient-to-b from-indigo-50 to-blue-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12">About FinAcco Solutions</h2>
            <div className="space-y-6 text-lg text-gray-600">
              <p>
                At FinAcco Solutions, we are dedicated to providing comprehensive business solutions
                that empower organizations to thrive in today's dynamic market environment.
              </p>
              <p>
                With over a decade of experience in financial services and technology solutions,
                we have helped numerous businesses streamline their operations, optimize their
                financial processes, and achieve sustainable growth.
              </p>
              <p>
                Our team of experts combines deep industry knowledge with cutting-edge technology
                to deliver tailored solutions that address your unique business challenges.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-indigo-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-blue-100">
              Ready to transform your business? Let's talk about your needs.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <Phone className="w-8 h-8" />, text: '+91 9745524438', href: 'tel:+919745524438' },
              { icon: <Mail className="w-8 h-8" />, text: 'contact@finaccosolutions.com', href: 'mailto:contact@finaccosolutions.com' },
              { icon: <MapPin className="w-8 h-8" />, text: 'Visit Our Office', href: '#location' }
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-lg rounded-2xl text-white border border-white/20"
              >
                {item.icon}
                <span className="mt-4 font-medium">{item.text}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/9745524438"
        className="fixed bottom-24 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        whileHover={{ scale: 1.1 }}
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 15, -15, 0]
        }}
        transition={{ 
          y: { 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        aria-label="Contact on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50 ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;