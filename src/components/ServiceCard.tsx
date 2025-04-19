import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link?: string;
  color: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon: Icon, link, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl group">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${color} text-white group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Learn More &rarr;
        </a>
      )}
    </div>
  );
};

export default ServiceCard;