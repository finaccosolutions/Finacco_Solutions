import React from 'react';
import { motion } from 'framer-motion';
import { Palette, ArrowLeft, Brush, Layout, Image, Share, PenTool, Layers } from 'lucide-react';

const features = [
  {
    icon: <PenTool className="w-6 h-6 text-purple-500" />,
    title: "Brand Identity",
    description: "Unique and memorable brand designs"
  },
  {
    icon: <Layout className="w-6 h-6 text-indigo-500" />,
    title: "Print Design",
    description: "Professional marketing materials"
  },
  {
    icon: <Image className="w-6 h-6 text-pink-500" />,
    title: "Digital Graphics",
    description: "Engaging social media content"
  },
  {
    icon: <Layers className="w-6 h-6 text-orange-500" />,
    title: "Packaging",
    description: "Eye-catching product packaging"
  }
];

const portfolioItems = [
  {
    title: "Brand Identity",
    image: "https://images.unsplash.com/photo-1636633762833-5d1658f1a3f8?auto=format&fit=crop&w=800&q=80",
    description: "Complete brand identity design"
  },
  {
    title: "Marketing Materials",
    image: "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=800&q=80",
    description: "Print and digital marketing assets"
  },
  {
    title: "Social Media",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
    description: "Engaging social media designs"
  }
];

const services = [
  {
    icon: <Brush className="w-8 h-8" />,
    title: "Logo Design",
    description: "Create a unique and memorable brand identity that sets you apart from competitors."
  },
  {
    icon: <Layout className="w-8 h-8" />,
    title: "Marketing Collateral",
    description: "Design professional brochures, flyers, business cards, and other marketing materials."
  },
  {
    icon: <Share className="w-8 h-8" />,
    title: "Social Media Graphics",
    description: "Engaging visual content for your social media presence and digital marketing."
  }
];

export default function GraphicDesign() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.a
          href="/"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="inline-flex items-center text-purple-300 hover:text-purple-200 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </motion.a>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-20"
        >
          {/* Hero Section */}
          <div className="text-center">
            <motion.div 
              className="flex items-center justify-center mb-8"
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Palette className="w-20 h-20 text-purple-400" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-6 text-white">Graphic Design Services</h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Transform your brand with our creative graphic design services.
              We bring your vision to life with stunning visuals that captivate your audience.
            </p>
          </div>

          {/* Services Section */}
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 group hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-purple-400 group-hover:text-purple-300 transition-colors mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{service.title}</h3>
                <p className="text-purple-200">{service.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Features Grid */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Design Process</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 group hover:bg-white/20 transition-all duration-300"
                >
                  <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-purple-200">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Portfolio Section */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Portfolio</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-64 object-cover rounded-xl transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-purple-200">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-white">Start Your Design Project</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-white/5 border border-purple-400/30 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 bg-white/5 border border-purple-400/30 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Project Type</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-purple-400/30 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white">
                  <option value="" className="bg-purple-900">Select a project type</option>
                  <option value="brand" className="bg-purple-900">Brand Identity</option>
                  <option value="marketing" className="bg-purple-900">Marketing Materials</option>
                  <option value="social" className="bg-purple-900">Social Media Design</option>
                  <option value="other" className="bg-purple-900">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Project Details</label>
                <textarea 
                  className="w-full px-4 py-2 bg-white/5 border border-purple-400/30 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-300 h-32"
                  placeholder="Tell us about your project"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-colors"
              >
                Submit Request
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}