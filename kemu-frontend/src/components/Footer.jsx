import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-kemu-purple via-kemu-purple to-kemu-blue text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-kemu-gold">About KeMU</h3>
            <p className="text-sm text-purple-100">
              A globally competitive Christian University producing the next generation of professional and transformational leaders.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-kemu-gold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/programs" className="text-purple-100 hover:text-kemu-gold transition-colors">Programs</Link></li>
              <li><Link to="/news" className="text-purple-100 hover:text-kemu-gold transition-colors">News</Link></li>
              <li><Link to="/admissions" className="text-purple-100 hover:text-kemu-gold transition-colors">Admissions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-kemu-gold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="mt-1 text-kemu-purple-30" />
                <span className="text-purple-100">
                  Main Campus: Kaaga Off Meru-Maua Highway, Meru County
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-kemu-purple-30" />
                <span className="text-purple-100">+254 700 123 456</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-kemu-purple-30" />
                <span className="text-purple-100">info@kemu.ac.ke</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-kemu-gold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-100 hover:text-kemu-gold transition-colors" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-purple-100 hover:text-kemu-gold transition-colors" aria-label="Twitter">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-purple-100 hover:text-kemu-gold transition-colors" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-purple-100 hover:text-kemu-gold transition-colors" aria-label="LinkedIn">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-purple-300/30 mt-8 pt-8 text-center text-sm text-purple-100">
          <p>&copy; {new Date().getFullYear()} Kenya Methodist University. All rights reserved.</p>
          <p className="mt-2 text-kemu-gold">Excellence Since 1997</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


