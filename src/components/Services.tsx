import React from 'react';
import ServiceCard from './ServiceCard';
import { Briefcase, Calculator, Globe, Code, Database, PenTool } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Comprehensive financial and technology solutions to help your business grow and succeed
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            title="Finacco Advisory"
            description="Business consultancy services including GST, income tax, book keeping, TDS, TCS, company & LLP related services."
            icon={Briefcase}
            link="https://advisory.finaccosolutions.com"
            color="bg-blue-600"
          />
          
          <ServiceCard
            title="Finacco Connect"
            description="Business utility software including Tally import tool, financial statement preparation, and reconciliation tools."
            icon={Calculator}
            link="https://connect.finaccosolutions.com"
            color="bg-teal-600"
          />
          
          <ServiceCard
            title="Web Development"
            description="Custom website design and development services to create a powerful online presence for your business."
            icon={Globe}
            color="bg-indigo-600"
          />
          
          <ServiceCard
            title="Software Development"
            description="Custom software solutions tailored to your business needs and requirements."
            icon={Code}
            color="bg-purple-600"
          />
          
          <ServiceCard
            title="Tally Authorized Partner"
            description="Official Tally solutions partner providing sales, implementation, and support services."
            icon={Database}
            color="bg-red-600"
          />
          
          <ServiceCard
            title="Graphic Designing"
            description="Professional graphic design services for branding, marketing materials, and digital assets."
            icon={PenTool}
            color="bg-amber-600"
          />
        </div>
      </div>
    </section>
  );
};

export default Services;