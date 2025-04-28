import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'full' | 'md';
  withDot?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  rounded = 'full',
  withDot = false,
  className = '',
  children,
}) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  const roundedClasses = {
    full: 'rounded-full',
    md: 'rounded-md',
  };

  return (
    <span 
      className={`inline-flex items-center font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses[rounded]} ${className}`}
    >
      {withDot && (
        <span 
          className={`mr-1.5 h-2 w-2 rounded-full ${variant === 'default' ? 'bg-gray-500' : `bg-${variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : variant}-500`}`}
        ></span>
      )}
      {children}
    </span>
  );
}; 