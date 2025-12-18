import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

// Import logo - Vite will handle the path correctly
const logoPath = '/logo.png';

interface NavLink {
  name: string;
  path: string;
}

interface NavDropdown {
  name: string;
  items: NavLink[];
}

type NavItem = NavLink | NavDropdown;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Check if we're on TVET pages
  const isTVETContext = location.pathname.startsWith('/tvet');

  // University navigation items
  const universityNavItems: NavItem[] = [
    { name: 'Home', path: '/' },
    {
      name: 'About',
      items: [
        { name: 'About KeMU', path: '/about' },
        { name: 'Governance', path: '/about#governance' },
        { name: 'Student Services', path: '/about#students' }
      ]
    },
    {
      name: 'Academics',
      items: [
        { name: 'All Programmes', path: '/programmes' },
        { name: 'Schools', path: '/schools' },
        { name: 'TVET Institute', path: '/tvet' }
      ]
    },
    { name: 'News', path: '/news' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Careers', path: '/careers' },
    {
      name: 'Portals',
      items: [
        { name: 'Student Portal', path: '/portals#students' },
        { name: 'Digital Campus', path: '/portals#digital-campus' },
        { name: 'Staff Portal', path: '/portals#staff' },
        { name: 'ICT Support', path: '/portals#ict-support' }
      ]
    },
    { name: 'Admin', path: '/admin' },
  ];

  // TVET context navigation items
  const tvetNavItems: NavItem[] = [
    { name: 'TVET Home', path: '/tvet' },
    { name: 'Programs', path: '/tvet/programs' },
    { name: 'Admissions', path: '/tvet/admissions' },
    { name: 'Careers', path: '/tvet/careers' },
    { name: 'News', path: '/tvet/news' },
    { name: 'About', path: '/tvet/about' },
    { name: 'University Home', path: '/' },
    { name: 'Admin', path: '/tvet/admin' },
  ];

  // Use appropriate nav items based on context
  const navItems = isTVETContext ? tvetNavItems : universityNavItems;

  const isActive = (path: string) => location.pathname === path;
  const isDropdown = (item: NavItem): item is NavDropdown => 'items' in item;

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Glass effect container with gradient */}
      <div
        className="relative w-full backdrop-blur-md bg-gradient-to-r from-kemu-purple via-kemu-purple to-kemu-blue"
        style={{
          background: 'linear-gradient(135deg, rgba(135, 16, 84, 0.95) 0%, rgba(135, 16, 84, 0.92) 50%, rgba(46, 49, 146, 0.95) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo with white background and glow effect */}
            <Link
              to="/"
              className="flex items-center h-full focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:ring-offset-2 focus:ring-offset-transparent rounded-lg transition-all duration-300 hover:scale-105"
              aria-label="Kenya Methodist University Home"
            >
              <div
                className="relative p-2 md:p-2.5 rounded-xl bg-white/95 backdrop-blur-sm"
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.5)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                }}
              >
                <img
                  src={logoPath}
                  alt="Kenya Methodist University Logo"
                  className="h-10 md:h-14 w-auto object-contain"
                  style={{
                    maxHeight: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error('Logo image failed to load. Please ensure logo.png exists in the public folder.');
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main navigation">
              {navItems.map((item) => {
                if (isDropdown(item)) {
                  // Dropdown menu
                  return (
                    <div
                      key={item.name}
                      className="relative group"
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className={`
                          flex items-center gap-1 px-4 py-2 text-sm font-serif font-medium
                          transition-all duration-300 ease-out
                          focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:ring-offset-2 focus:ring-offset-transparent rounded-lg
                          ${openDropdown === item.name ? 'text-kemu-gold' : 'text-white hover:text-kemu-gold'}
                        `}
                      >
                        <span className="relative z-10">{item.name}</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Content */}
                      <div
                        className={`
                          absolute top-full left-0 mt-2 w-56 
                          backdrop-blur-xl bg-white/95 border border-white/40 rounded-xl shadow-deep-3d
                          transition-all duration-300 origin-top
                          ${openDropdown === item.name ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                        `}
                      >
                        <div className="py-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="block px-4 py-3 text-sm font-medium text-kemu-purple hover:bg-kemu-gold/10 hover:text-kemu-gold transition-colors"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // Regular link
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`
                        group relative px-4 py-2 text-sm font-serif font-medium
                        transition-all duration-300 ease-out
                        focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:ring-offset-2 focus:ring-offset-transparent rounded-lg
                        ${isActive(item.path)
                          ? 'text-kemu-gold'
                          : 'text-white hover:text-kemu-gold'
                        }
                      `}
                      style={{
                        transform: isActive(item.path) ? 'translateY(-2px)' : 'translateY(0)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive(item.path)) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(item.path)) {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                      aria-current={isActive(item.path) ? 'page' : undefined}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {/* Underline with glow effect */}
                      <span
                        className={`
                          absolute bottom-0 left-1/2 h-0.5 bg-kemu-gold
                          transition-all duration-300 ease-out
                          ${isActive(item.path) ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-4/5 group-hover:opacity-100'}
                        `}
                        style={{
                          transform: 'translateX(-50%)',
                          boxShadow: isActive(item.path) ? '0 0 8px rgba(160, 103, 46, 0.6)' : '0 0 6px rgba(160, 103, 46, 0.4)',
                        }}
                      />
                    </Link>
                  );
                }
              })}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-kemu-gold focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:ring-offset-2 focus:ring-offset-transparent rounded-lg p-2 transition-all duration-300 hover:bg-white/10"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {/* Rounded bottom corners */}
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-transparent"
          style={{
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
            background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.05))',
          }}
        />
      </div>

      {/* Mobile Menu with slide animation and glass effect */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'}
        `}
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'linear-gradient(180deg, rgba(135, 16, 84, 0.98) 0%, rgba(46, 49, 146, 0.98) 100%)',
        }}
      >
        <nav
          className="px-4 py-3 space-y-1 border-t border-white/20"
          aria-label="Mobile navigation"
        >
          {navItems.map((item, index) => {
            if (isDropdown(item)) {
              // Mobile dropdown
              const isDropdownOpen = openDropdown === item.name;
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setOpenDropdown(isDropdownOpen ? null : item.name)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-serif font-medium text-white hover:bg-white/10 hover:text-kemu-gold transition-all duration-300"
                    style={{
                      animation: isOpen ? `slideDown 0.3s ease-out ${index * 0.05}s both` : 'none',
                    }}
                  >
                    <span>{item.name}</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          onClick={() => {
                            setIsOpen(false);
                            setOpenDropdown(null);
                          }}
                          className="block px-4 py-2 rounded-lg text-sm text-white/90 hover:bg-white/10 hover:text-kemu-gold transition-all duration-300"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              // Regular mobile link
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    block px-4 py-3 rounded-lg text-base font-serif font-medium
                    transition-all duration-300 ease-out
                    focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:ring-offset-2 focus:ring-offset-transparent
                    ${isActive(item.path)
                      ? 'bg-kemu-gold/20 text-kemu-gold border-l-4 border-kemu-gold shadow-lg'
                      : 'text-white hover:bg-white/10 hover:text-kemu-gold hover:translate-x-1'
                    }
                  `}
                  style={{
                    animation: isOpen ? `slideDown 0.3s ease-out ${index * 0.05}s both` : 'none',
                  }}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              );
            }
          })}
        </nav>
      </div>

      {/* Add keyframe animation for mobile menu */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;