import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft, CheckCircle, Users, Rocket, Zap } from 'lucide-react';

const features = [
  {
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    title: "Custom Design",
    description: "Unique designs tailored to your brand"
  },
  {
    icon: <Users className="w-6 h-6 text-blue-500" />,
    title: "User-Centric",
    description: "Intuitive interfaces for better engagement"
  },
  {
    icon: <Rocket className="w-6 h-6 text-purple-500" />,
    title: "Performance",
    description: "Fast-loading, optimized websites"
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "SEO Ready",
    description: "Built for search engine visibility"
  }
];

const portfolioItems = [
  {
    title: "E-commerce Platform",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=800&q=80",
    description: "Modern online shopping experience"
  },
  {
    title: "Corporate Website",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    description: "Professional business presence"
  },
  {
    title: "Portfolio Site",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    description: "Creative showcase platform"
  }
];

export default function WebDesign() {
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
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-16"
        >
          {/* Hero Section */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <Globe className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Web Design Services</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your digital presence with our professional web design services.
              We create stunning, responsive websites that engage your audience and drive results.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Portfolio Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Our Recent Work</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl shadow-lg"
                >
                  <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-200">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6">Start Your Project</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                  <option>E-commerce Website</option>
                  <option>Corporate Website</option>
                  <option>Portfolio Website</option>
                  <option>Custom Web Application</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
                <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent h-32"></textarea>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold">
                Submit Request
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}