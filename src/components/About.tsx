import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img 
              src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Finacco Solutions Team" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Finacco Solutions</h2>
            
            <p className="text-gray-700 mb-6">
              At Finacco Solutions, we combine financial expertise with technological innovation to deliver comprehensive business solutions. With a focus on quality and client satisfaction, we've established ourselves as a trusted partner for businesses of all sizes.
            </p>
            
            <p className="text-gray-700 mb-6">
              Our team of experienced professionals is dedicated to helping your business navigate financial complexities and leverage technology for growth. From financial advisory services to custom software development, we provide end-to-end solutions tailored to your specific needs.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Our Mission</h3>
                <p className="text-gray-700">
                  To empower businesses with innovative financial and technological solutions that drive growth and success.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-teal-600 mb-2">Our Vision</h3>
                <p className="text-gray-700">
                  To be the leading provider of integrated business solutions, known for excellence and innovation.
                </p>
              </div>
            </div>
            
            <a 
              href="#contact" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;