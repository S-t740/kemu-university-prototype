import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-kemu-blue text-white pt-12 pb-6">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-serif font-bold mb-4 text-kemu-gold">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <MapPin size={20} className="mt-1 text-kemu-purple-30 flex-shrink-0" />
              <span className="text-sm">
                Main Campus: Kaaga Off Meru-Maua Highway, Meru County<br />
                Nairobi: KeMU Towers, University Way<br />
                Mombasa: Opposite Buxton Point gate B, Narok Road
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={20} className="text-kemu-purple-30 flex-shrink-0" />
              <span className="text-sm">+(254) 724-256162<br />+(254) 117-260176</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={20} className="text-kemu-purple-30 flex-shrink-0" />
              <span className="text-sm">info@kemu.ac.ke<br />customercare@kemu.ac.ke</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-serif font-bold mb-4 text-kemu-gold">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="https://kemu.ac.ke/courses-on-offer" target="_blank" rel="noopener noreferrer" className="hover:text-kemu-gold transition-colors focus:outline-none focus:ring-2 focus:ring-kemu-gold rounded">Courses on Offer</a></li>
            <li><a href="https://kemu.ac.ke/timetables" target="_blank" rel="noopener noreferrer" className="hover:text-kemu-gold transition-colors focus:outline-none focus:ring-2 focus:ring-kemu-gold rounded">Timetables</a></li>
            <li><a href="https://students.kemu.ac.ke" target="_blank" rel="noopener noreferrer" className="hover:text-kemu-gold transition-colors focus:outline-none focus:ring-2 focus:ring-kemu-gold rounded">Student Portal</a></li>
            <li><a href="https://kemu.ac.ke/alumni" target="_blank" rel="noopener noreferrer" className="hover:text-kemu-gold transition-colors focus:outline-none focus:ring-2 focus:ring-kemu-gold rounded">Alumni</a></li>
            <li><a href="https://kemu.ac.ke/careers" target="_blank" rel="noopener noreferrer" className="hover:text-kemu-gold transition-colors focus:outline-none focus:ring-2 focus:ring-kemu-gold rounded">Careers</a></li>
          </ul>
        </div>

        {/* Social & Brand */}
        <div>
          <h3 className="text-xl font-serif font-bold mb-4 text-kemu-gold">Connect With Us</h3>
          <p className="text-sm text-gray-300 mb-6">
            Stay updated with the latest news, events, and academic breakthroughs at KeMU.
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://www.facebook.com/KeMUKenya" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-2 rounded-full hover:bg-kemu-gold transition-colors focus:outline-none focus:ring-2 focus:ring-kemu-gold"
              aria-label="Follow us on Facebook"
            >
              <Facebook size={20} aria-hidden="true" />
            </a>
            <a 
              href="https://www.twitter.com/kemukenya" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-2 rounded-full hover:bg-kemu-gold transition-colors focus:outline-none focus:ring-2 focus:ring-kemu-gold"
              aria-label="Follow us on Twitter"
            >
              <Twitter size={20} aria-hidden="true" />
            </a>
            <a 
              href="https://linkedin.com/school/kenya-methodist-university" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-2 rounded-full hover:bg-kemu-gold transition-colors focus:outline-none focus:ring-2 focus:ring-kemu-gold"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Kenya Methodist University Prototype. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;