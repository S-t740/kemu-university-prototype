import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const logoPath = '/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'News', path: '/news' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Admin', path: '/admin' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className="sticky top-0 z-50 w-full"
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div 
        className="relative w-full backdrop-blur-md bg-gradient-to-r from-kemu-purple via-kemu-purple to-kemu-blue rounded-b-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(135, 16, 84, 0.95) 0%, rgba(135, 16, 84, 0.92) 50%, rgba(46, 49, 146, 0.95) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link 
              to="/" 
              className="flex items-center h-full focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:ring-offset-2 focus:ring-offset-transparent rounded-lg transition-all duration-300 hover:scale-105"
              aria-label="Kenya Methodist University Home"
            >
              <div 
                className="relative bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-lg ring-1 ring-white/20"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                  boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.15)',
                }}
              >
                <img 
                  src={logoPath}
                  alt="Kenya Methodist University Logo" 
                  className="h-10 md:h-12 w-auto object-contain"
                  style={{ 
                    maxHeight: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error('Logo image failed to load.');
                    (e.target).style.display = 'none';
                  }}
                />
              </div>
            </Link>

            <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-white font-serif text-sm font-medium px-2 py-1 transition-all duration-300 group
                    ${isActive(link.path) ? 'text-kemu-gold' : 'hover:text-kemu-gold'}
                    focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:ring-offset-2 focus:ring-offset-transparent rounded`}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-kemu-gold transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100
                    ${isActive(link.path) ? 'scale-x-100' : ''}`}
                    style={{ boxShadow: '0 0 8px rgba(160,103,46,0.6)' }}
                  ></span>
                </Link>
              ))}
            </nav>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-kemu-gold focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:ring-offset-2 focus:ring-offset-transparent rounded p-1 transition-colors duration-300"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <nav 
          className="md:hidden absolute top-full left-0 w-full bg-kemu-purple/80 backdrop-blur-lg border-t border-white/10 shadow-lg overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: isOpen ? '200px' : '0',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          }}
          aria-label="Mobile navigation"
        >
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-md text-base font-serif font-medium transition-all duration-300 ease-out transform translate-y-2 opacity-0
                  ${isActive(link.path)
                    ? 'bg-kemu-purple-30 text-kemu-purple shadow-inner border border-kemu-gold'
                    : 'text-white hover:bg-kemu-blue/50 hover:text-white'}
                  focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:ring-offset-2 focus:ring-offset-transparent`}
                aria-current={isActive(link.path) ? 'page' : undefined}
                style={{ animation: `fade-slide-in 0.3s ease-out forwards ${index * 0.05}s` }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </nav>
  );
};

export default Navbar;


