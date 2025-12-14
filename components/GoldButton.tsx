import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GoldButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon;
  className?: string;
  variant?: 'primary' | 'outline';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const GoldButton: React.FC<GoldButtonProps> = ({
  children,
  onClick,
  href,
  icon: Icon,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = variant === 'primary' ? 'gold-btn' : 'outline-btn';
  const buttonClasses = `${baseClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const content = (
    <>
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${buttonClasses} inline-flex items-center justify-center`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${buttonClasses} inline-flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {content}
    </button>
  );
};

export default GoldButton;

