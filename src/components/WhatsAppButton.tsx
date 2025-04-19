import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '918590000761';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-4 md:right-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-30 transition-all duration-300"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
};

export default WhatsAppButton;