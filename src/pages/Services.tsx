import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Palette, 
  Globe, 
  Database,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

const services = [
  {
    title: 'Web Designing',
    description: 'Custom web design solutions for your digital presence',
    icon: <Globe className="w-16 h-16 text-blue-600" />,
    link: '/web-design',
    features: ['Responsive Design', 'UI/UX Development', 'E-commerce Solutions', 'CMS Integration']
  },
  {
    title: 'Graphic Designing',
    description: 'Creative graphic design services for your brand',
    icon: <Palette className="w-16 h-16 text-blue-600" />,
    link: '/graphic-design',
    features: ['Logo Design', 'Brand Identity', 'Marketing Materials', 'Social Media Graphics']
  },
  {
    title: 'Software Development',
    description: 'Custom software solutions for your business needs',
    icon: <Code className="w-16 h-16 text-blue-600" />,
    link: '/software-dev',
    features: ['Custom Applications', 'Mobile Apps', 'API Integration', 'Cloud Solutions']
  },
  {
    title: 'Tally Solutions',
    description: 'Official Tally solutions and support',
    icon: <Database className="w-16 h-16 text-blue-600" />,
    link: '/tally-partner',
    features: ['Implementation', 'Customization', 'Training', 'Support']
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.a
          href="/"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive business solutions tailored to your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Finacco Advisory Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl transform transition-transform group-hover:scale-[1.02]"></div>
            <a 
              href="https://advisory.finaccosolutions.com/"
              target="_blank"
              rel="noopener noreferrer" 
              className="relative block bg-white p-8 rounded-2xl transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Finacco Advisory</h3>
                <ExternalLink className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-6">
                Comprehensive financial advisory services for businesses, including tax planning,
                auditing, and business consulting.
              </p>
              <div className="flex justify-end">
                <span className="text-blue-600 font-semibold">Learn More →</span>
              </div>
            </a>
          </motion.div>

          {/* Finacco Connect Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl transform transition-transform group-hover:scale-[1.02]"></div>
            <a 
              href="https://connect.finaccosolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative block bg-white p-8 rounded-2xl transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Finacco Connect</h3>
                <ExternalLink className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-6">
                Advanced accounting utility software solutions for seamless financial management
                and business operations.
              </p>
              <div className="flex justify-end">
                <span className="text-blue-600 font-semibold">Learn More →</span>
              </div>
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="transform transition-transform group-hover:scale-110">
                    {service.icon}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-blue-100 rounded-full p-2"
                  >
                    <ArrowLeft className="w-6 h-6 text-blue-600 transform rotate-180" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
                <motion.a
                  href={service.link}
                  whileHover={{ scale: 1.02 }}
                  className="mt-8 inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors"
                >
                  Learn More
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}