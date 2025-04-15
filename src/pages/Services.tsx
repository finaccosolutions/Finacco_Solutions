{Previous content of Services.tsx with the following changes:}

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
  {/* Finacco Advisory Card */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="group relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl transform transition-transform group-hover:scale-[1.02] group-hover:rotate-2" />
    <a 
      href="https://advisory.finaccosolutions.com/"
      target="_blank"
      rel="noopener noreferrer" 
      className="relative block bg-white p-8 rounded-2xl transform transition-all duration-300 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:shadow-xl before:absolute before:inset-0 before:bg-black/5 before:rounded-2xl before:transition-opacity before:opacity-0 group-hover:before:opacity-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Finacco Advisory</h3>
        <ExternalLink className="w-6 h-6 text-blue-600 transform transition-transform group-hover:rotate-12" />
      </div>
      <p className="text-gray-600 mb-6">
        Comprehensive financial advisory services for businesses, including tax planning,
        auditing, and business consulting.
      </p>
      <div className="flex justify-end">
        <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
          Learn More <ArrowRight className="ml-2 w-4 h-4" />
        </span>
      </div>
    </a>
  </motion.div>

  {/* Finacco Connect Card */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="group relative"
  >
    <div className="absolute inset-0 bg-gradient-to-bl from-indigo-600 to-blue-600 rounded-2xl transform transition-transform group-hover:scale-[1.02] group-hover:-rotate-2" />
    <a 
      href="https://connect.finaccosolutions.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative block bg-white p-8 rounded-2xl transform transition-all duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-xl before:absolute before:inset-0 before:bg-black/5 before:rounded-2xl before:transition-opacity before:opacity-0 group-hover:before:opacity-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Finacco Connect</h3>
        <ExternalLink className="w-6 h-6 text-blue-600 transform transition-transform group-hover:-rotate-12" />
      </div>
      <p className="text-gray-600 mb-6">
        Advanced accounting utility software solutions for seamless financial management
        and business operations.
      </p>
      <div className="flex justify-end">
        <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
          Learn More <ArrowRight className="ml-2 w-4 h-4" />
        </span>
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
      className="group relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-${index % 2 === 0 ? 'tr' : 'tl'} from-blue-600 to-indigo-600 rounded-2xl transform transition-transform group-hover:scale-[1.02] group-hover:${index % 2 === 0 ? '' : '-'}rotate-2`} />
      <div className="relative bg-white p-8 rounded-2xl transform transition-all duration-300 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:shadow-xl before:absolute before:inset-0 before:bg-black/5 before:rounded-2xl before:transition-opacity before:opacity-0 group-hover:before:opacity-100">
        <div className="flex items-center justify-between mb-6">
          <div className="transform transition-transform group-hover:scale-110 origin-left">
            {service.icon}
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="bg-blue-50 rounded-full p-2"
          >
            <ArrowRight className="w-6 h-6 text-blue-600 transform transition-transform group-hover:translate-x-1" />
          </motion.div>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">{service.title}</h3>
        <p className="text-gray-600 mb-6">{service.description}</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
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
          className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-blue-700 transition-all duration-300"
        >
          Learn More
        </motion.a>
      </div>
    </motion.div>
  ))}
</div>
```