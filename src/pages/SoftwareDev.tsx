import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  ArrowLeft, 
  Server, 
  Smartphone, 
  Cloud, 
  Shield, 
  Zap,
  Database as DbIcon,
  Monitor,
  GitBranch
} from 'lucide-react';

const features = [
  {
    icon: <Server className="w-6 h-6 text-cyan-500" />,
    title: "Custom Solutions",
    description: "Tailored software for your needs"
  },
  {
    icon: <Smartphone className="w-6 h-6 text-emerald-500" />,
    title: "Mobile Apps",
    description: "Native and cross-platform apps"
  },
  {
    icon: <Cloud className="w-6 h-6 text-blue-500" />,
    title: "Cloud Solutions",
    description: "Scalable cloud applications"
  },
  {
    icon: <Shield className="w-6 h-6 text-indigo-500" />,
    title: "Secure",
    description: "Enterprise-grade security"
  }
];

const technologies = [
  {
    icon: <Monitor className="w-8 h-8" />,
    name: "Frontend",
    items: ["React", "Vue.js", "Angular", "Next.js"]
  },
  {
    icon: <Server className="w-8 h-8" />,
    name: "Backend",
    items: ["Node.js", "Python", "Java", "Go"]
  },
  {
    icon: <DbIcon className="w-8 h-8" />,
    name: "Database",
    items: ["PostgreSQL", "MongoDB", "Redis", "MySQL"]
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    name: "Cloud",
    items: ["AWS", "Azure", "Google Cloud", "Digital Ocean"]
  }
];

const processSteps = [
  {
    icon: <GitBranch className="w-8 h-8" />,
    title: "Planning",
    description: "Detailed project planning and requirement analysis"
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Development",
    description: "Agile development with regular updates"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Testing",
    description: "Comprehensive testing and quality assurance"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Deployment",
    description: "Smooth deployment and continuous support"
  }
];

export default function SoftwareDev() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-cyan-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.a
          href="/"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8"
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
              <Code className="w-20 h-20 text-cyan-400" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-6 text-white">Software Development</h1>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
              Custom software solutions that drive innovation and efficiency.
              We build robust, scalable applications tailored to your business needs.
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
                <p className="text-cyan-100">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Technologies Section */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Technologies We Use</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 group hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-cyan-400 mb-4">{tech.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{tech.name}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {tech.items.map((item, i) => (
                      <div key={i} className="text-cyan-100 text-sm bg-white/5 rounded-lg p-2 text-center">
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Development Process */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Development Process</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 relative group hover:bg-white/20 transition-all duration-300"
                >
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 w-full h-0.5 bg-cyan-500/30 transform translate-x-1/2">
                      <div className="absolute top-1/2 right-0 w-2 h-2 bg-cyan-500 rounded-full transform -translate-y-1/2"></div>
                    </div>
                  )}
                  <div className="text-cyan-400 mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-cyan-100">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-white">Start Your Project</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-white/5 border border-cyan-400/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-cyan-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 bg-white/5 border border-cyan-400/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-cyan-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-1">Project Type</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-cyan-400/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white">
                  <option value="" className="bg-slate-900">Select a project type</option>
                  <option value="web" className="bg-slate-900">Web Application</option>
                  <option value="mobile" className="bg-slate-900">Mobile App</option>
                  <option value="desktop" className="bg-slate-900">Desktop Software</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-1">Project Requirements</label>
                <textarea 
                  className="w-full px-4 py-2 bg-white/5 border border-cyan-400/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-cyan-300 h-32"
                  placeholder="Describe your project requirements"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-colors"
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