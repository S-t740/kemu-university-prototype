import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  icon?: LucideIcon;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  multiline = false,
  rows = 4,
  className = '',
}) => {
  const inputClasses = `
    w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
    ${error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-200 focus:border-kemu-gold focus:ring-kemu-gold'
    }
    focus:outline-none focus:ring-2 focus:ring-opacity-20
    shadow-soft-3d focus:shadow-glow-gold
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        
        {multiline ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`${inputClasses} ${Icon ? 'pl-10' : ''} resize-none`}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${inputClasses} ${Icon ? 'pl-10' : ''}`}
          />
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default InputField;

