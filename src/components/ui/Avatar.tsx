import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away' | null;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name,
  size = 'md',
  shape = 'circle',
  status = null,
  className = '',
}) => {
  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-14 h-14 text-xl',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-md',
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  return (
    <div className="relative inline-flex">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`object-cover ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center bg-primary-100 text-primary-800 font-medium ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
        >
          {name ? getInitials(name) : '?'}
        </div>
      )}
      
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block ${statusSizes[size]} ${statusClasses[status]} rounded-full ring-2 ring-white`}
        />
      )}
    </div>
  );
}; 