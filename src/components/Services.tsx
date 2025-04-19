import React from 'react';
import { Briefcase, Calculator, Globe, Code, Database, PenTool } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      title: "Finacco Advisory",
      description: "Business consultancy services including GST, income tax, book keeping, TDS, TCS, company & LLP related services.",
      icon: Briefcase,
      link: "https://advisory.finaccosolutions.com",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Finacco Connect",
      description: "Business utility software including Tally import tool, financial statement preparation, and reconciliation tools.",
      icon: Calculator,
      link: "https://connect.finaccosolutions.com",
      gradient: "from-teal-500 to-emerald-600"
    },
    {
      title: "Web Development",
      description: "Custom website design and development services to create a powerful online presence for your business.",
      icon: Globe,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Software Development",
      description: "Custom software solutions tailored to your business needs and requirements.",
      icon: Code,
      gradient: "from-orange-500 to-red-600"
    },
    {
      title: "Tally Authorized Partner",
      description: "Official Tally solutions partner providing sales, implementation, and support services.",
      icon: Database,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      title: "Graphic Designing",
      description: "Professional graphic design services for branding, marketing materials, and digital assets.",
      icon: PenTool,
      gradient: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <section id="services" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">Our Services</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Comprehensive financial and technology solutions to help your business grow and succeed
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-50 blur transition duration-500`}></div>
              <div className="relative bg-white rounded-xl p-8 shadow-lg transition-all duration-500 hover:shadow-2xl">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <service.icon size={32} className="text-white transform group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                {service.link && (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent font-medium group-hover:translate-x-2 transition-transform duration-300`}
                  >
                    Learn More
                    <svg className={`w-4 h-4 ml-2 stroke-current ${service.gradient}`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;