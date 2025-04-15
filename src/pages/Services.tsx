import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Palette, 
  Globe, 
  Database,
  ArrowLeft,
  Calculator,
  BarChart3
} from 'lucide-react';

const services = [
  {
    title: 'Finacco Advisory',
    description: 'Expert financial advisory services for business growth',
    icon: <BarChart3 className="w-16 h-16 text-emerald-600" />,
    link: 'https://advisory.finaccosolutions.com/',
    features: ['Tax Planning', 'Business Consulting', 'Audit Services', 'Financial Analysis']
  },
  {
    title: 'Finacco Connect',
    description: 'Advanced accounting software solutions',
    icon: <Calculator className="w-16 h-16 text-emerald-600" />,
    link: 'https://connect.finaccosolutions.com/',
    features: ['Cloud Accounting', 'Financial Reports', 'Inventory Management', 'Payroll System']
  },
  {
    title: 'Web Designing',
    description: 'Custom web design solutions for your digital presence',
    icon: <Globe className="w-16 h-16 text-emerald-600" />,
    link: '/web-design',
    features: ['Responsive Design', 'UI/UX Development', 'E-commerce Solutions', 'CMS Integration']
  },
  {
    title: 'Graphic Designing',
    description: 'Creative graphic design services for your brand',
    icon: <Palette className="w-16 h-16 text-emerald-600" />,
    link: '/graphic-design',
    features: ['Logo Design', 'Brand Identity', 'Marketing Materials', 'Social Media Graphics']
  },
  {
    title: 'Software Development',
    description: 'Custom software solutions for your business needs',
    icon: <Code className="w-16 h-16 text-emerald-600" />,
    link: '/software-dev',
    features: ['Custom Applications', 'Mobile Apps', 'API Integration', 'Cloud Solutions']
  },
  {
    title: 'Tally Solutions',
    description: 'Official Tally solutions and support',
    icon: <Database className="w-16 h-16 text-emerald-600" />,
    link: '/tally-partner',
    features: ['Implementation', 'Customization', 'Training', 'Support']
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.a
          href="/"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 text-white">Our Services</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive business solutions tailored to your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-700/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:bg-slate-700/70 hover:-translate-y-1"
            >
              <div className="p-8 h-full flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent"></div>
                <div className="relative">
                  <div className="flex items-center justify-center mb-6">
                    <div className="transform transition-transform group-hover:scale-110 bg-slate-800 p-4 rounded-2xl shadow-md">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center text-white">{service.title}</h3>
                  <p className="text-slate-300 mb-6 text-center">{service.description}</p>
                  <div className="grid grid-cols-1 gap-3 mb-8">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-slate-300 bg-slate-800/50 p-2 rounded-lg">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.a
                    href={service.link}
                    whileHover={{ scale: 1.02 }}
                    className="mt-auto w-full text-center bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-colors inline-block"
                  >
                    Learn More
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}