import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDUwIDAgTCAwIDAgMCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibHVlIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">About Finacco Solutions</h2>
          
          <div className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              At Finacco Solutions, we combine financial expertise with technological innovation to deliver comprehensive business solutions. With a focus on quality and client satisfaction, we've established ourselves as a trusted partner for businesses of all sizes.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              Our team of experienced professionals is dedicated to helping your business navigate financial complexities and leverage technology for growth. From financial advisory services to custom software development, we provide end-to-end solutions tailored to your specific needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="bg-blue-50/50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-bold text-blue-600 mb-3">Our Mission</h3>
                <p className="text-gray-700">
                  To empower businesses with innovative financial and technological solutions that drive growth and success.
                </p>
              </div>
              
              <div className="bg-teal-50/50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-bold text-teal-600 mb-3">Our Vision</h3>
                <p className="text-gray-700">
                  To be the leading provider of integrated business solutions, known for excellence and innovation.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <a 
                href="#contact" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;