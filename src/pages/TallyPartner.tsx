import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  ArrowLeft, 
  BookOpen,
  Settings,
  Users,
  BarChart,
  Clock,
  Shield,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const features = [
  {
    icon: <Settings className="w-6 h-6 text-amber-500" />,
    title: "Implementation",
    description: "Expert Tally setup and configuration"
  },
  {
    icon: <Users className="w-6 h-6 text-orange-500" />,
    title: "Training",
    description: "Comprehensive user training"
  },
  {
    icon: <Shield className="w-6 h-6 text-red-500" />,
    title: "Support",
    description: "24/7 technical assistance"
  },
  {
    icon: <BarChart className="w-6 h-6 text-yellow-500" />,
    title: "Customization",
    description: "Tailored to your needs"
  }
];

const services = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Initial Setup",
    items: ["Software Installation", "Data Structure Setup", "User Configuration", "Initial Training"]
  },
  {
    icon: <Settings className="w-8 h-8" />,
    title: "Customization",
    items: ["Custom Reports", "Business Rules", "Integration Setup", "Workflow Design"]
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Training",
    items: ["Basic Operations", "Advanced Features", "Report Generation", "Troubl
eshooting"]
  },
  {
    icon: <HelpCircle className="w-8 h-8" />,
    title: "Support",
    items: ["Technical Support", "Update Assistance", "Data Recovery", "Performance Optimization"]
  }
];

const benefits = [
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Time Saving",
    description: "Automate routine accounting tasks"
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Accuracy",
    description: "Minimize human errors"
  },
  {
    icon: <BarChart className="w-8 h-8" />,
    title: "Reporting",
    description: "Comprehensive financial insights"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Compliance",
    description: "Stay compliant with regulations"
  }
];

export default function TallyPartner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-orange-900 to-amber-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.a
          href="/"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-8"
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
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Database className="w-20 h-20 text-amber-400" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-6 text-white">Tally Solutions Partner</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Your trusted partner for all Tally.ERP 9 solutions. We provide comprehensive
              implementation, training, and support services to optimize your business operations.
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
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 group hover:bg-white/20 transition-all duration-300"
              >
                <motion.div 
                  className="mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-amber-100">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Services Section */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 group hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-amber-400 mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{service.title}</h3>
                  <ul className="space-y-2">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-center text-amber-100">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Benefits of Tally</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center group hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-amber-400 mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{benefit.title}</h3>
                  <p className="text-amber-100">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-white">Get Tally Support</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-white/5 border border-amber-400/30 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-amber-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 bg-white/5 border border-amber-400/30 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-amber-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-1">Service Type</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-amber-400/30 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white">
                  <option value="" className="bg-amber-900">Select a service</option>
                  <option value="implementation" className="bg-amber-900">Implementation</option>
                  <option value="training" className="bg-amber-900">Training</option>
                  <option value="support" className="bg-amber-900">Technical Support</option>
                  <option value="customization" className="bg-amber-900">Customization</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-1">Message</label>
                <textarea 
                  className="w-full px-4 py-2 bg-white/5 border border-amber-400/30 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-amber-300 h-32"
                  placeholder="Describe your requirements"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-colors"
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