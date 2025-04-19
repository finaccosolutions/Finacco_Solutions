import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900">
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Complete <span className="bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">Financial</span> & <span className="bg-gradient-to-r from-teal-400 to-emerald-300 text-transparent bg-clip-text">Tech</span> Solutions
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
              Expert business consultancy, software solutions, and development services to help your business grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#services" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center shadow-lg hover:shadow-blue-500/25"
              >
                Explore Services
              </a>
              <a 
                href="#contact" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg border border-white/30 transition-all duration-300 transform hover:scale-105 text-center"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img 
                src="https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Business team working together" 
                className="relative rounded-lg shadow-2xl max-w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;