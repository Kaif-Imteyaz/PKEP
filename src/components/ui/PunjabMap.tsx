import React, { useState } from 'react';

interface MapLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  connections: string[];
  color?: string;
  district: string;
}

interface PunjabMapProps {
  locations?: MapLocation[];
  activeLocationId?: string;
  onLocationClick?: (locationId: string) => void;
  className?: string;
}

export const PunjabMap: React.FC<PunjabMapProps> = ({
  locations = DEMO_LOCATIONS,
  activeLocationId,
  onLocationClick,
  className = '',
}) => {
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  
  const handleMouseEnter = (locationId: string) => {
    setHoveredLocationId(locationId);
  };
  
  const handleMouseLeave = () => {
    setHoveredLocationId(null);
  };
  
  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white"></div>
      
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-30" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #1a365d 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }}
      ></div>
      
      <div className="relative p-4 h-full">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
        >
          {/* District boundaries with blur effect for depth */}
          <filter id="blur-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          
          {/* Punjab outline */}
          <path
            d="M120,50 L180,30 L240,40 L280,80 L320,100 L340,150 L320,200 L330,250 L300,280 L250,320 L200,340 L150,310 L100,280 L80,230 L60,180 L80,130 L120,50"
            fill="url(#punjabGradient)"
            stroke="#1a365d"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="punjabGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor="#c7d2fe" />
            </linearGradient>
          </defs>
          
          {/* District boundaries */}
          <path
            d="M180,30 L200,100 L240,150 L200,180 L180,230 L150,310"
            fill="none"
            stroke="#4338ca"
            strokeWidth="1.5"
            strokeOpacity="0.25"
            strokeDasharray="4 2"
          />
          <path
            d="M240,40 L200,100 L240,150 L300,180 L330,250"
            fill="none"
            stroke="#4338ca"
            strokeWidth="1.5"
            strokeOpacity="0.25"
            strokeDasharray="4 2"
          />
          <path
            d="M200,180 L300,180"
            fill="none"
            stroke="#4338ca"
            strokeWidth="1.5"
            strokeOpacity="0.25"
            strokeDasharray="4 2"
          />
          <path
            d="M180,230 L250,270 L300,280"
            fill="none"
            stroke="#4338ca"
            strokeWidth="1.5"
            strokeOpacity="0.25"
            strokeDasharray="4 2"
          />
          
          {/* Connection lines */}
          {locations.map(location => (
            location.connections.map(targetId => {
              const target = locations.find(l => l.id === targetId);
              const isActive = (location.id === activeLocationId || location.id === hoveredLocationId) &&
                               (targetId === activeLocationId || targetId === hoveredLocationId);
              
              if (!target) return null;
              return (
                <line
                  key={`${location.id}-${targetId}`}
                  x1={location.x}
                  y1={location.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isActive ? "#1a365d" : "#4338ca"}
                  strokeWidth={isActive ? "2" : "1"}
                  strokeOpacity={isActive ? "0.7" : "0.3"}
                  strokeDasharray={isActive ? "" : "3,3"}
                  className="transition-all duration-300"
                />
              );
            })
          ))}
          
          {/* Location markers */}
          {locations.map(location => {
            const isActive = activeLocationId === location.id;
            const isHovered = hoveredLocationId === location.id;
            const isHighlighted = isActive || isHovered;
            
            return (
              <g
                key={location.id}
                onClick={() => onLocationClick?.(location.id)}
                onMouseEnter={() => handleMouseEnter(location.id)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: onLocationClick ? 'pointer' : 'default' }}
                className="transition-transform duration-300"
                transform={isHighlighted ? 'scale(1.1)' : 'scale(1)'}
              >
                {/* Glow effect for active/hovered location */}
                {isHighlighted && (
                  <circle
                    cx={location.x}
                    cy={location.y}
                    r={12}
                    fill="#4338ca"
                    opacity="0.2"
                    className="animate-pulse-slow"
                  />
                )}
                
                <circle
                  cx={location.x}
                  cy={location.y}
                  r={isHighlighted ? 8 : 6}
                  fill={location.color || (isActive ? '#1a365d' : isHovered ? '#3730a3' : '#818cf8')}
                  opacity={isHighlighted ? 1 : 0.8}
                  stroke="#fff"
                  strokeWidth="1.5"
                  className="transition-all duration-300"
                />
                
                <text
                  x={location.x}
                  y={location.y + 20}
                  textAnchor="middle"
                  fontSize={isHighlighted ? "12" : "10"}
                  fontWeight={isHighlighted ? "bold" : "normal"}
                  fill={isHighlighted ? "#1a365d" : "#1e1b4b"}
                  className="transition-all duration-300"
                >
                  {location.name}
                </text>
                
                {/* District label for active location */}
                {isActive && (
                  <g className="animate-fade-in">
                    <rect
                      x={location.x - 40}
                      y={location.y - 35}
                      width="80"
                      height="20"
                      rx="4"
                      fill="#1a365d"
                      opacity="0.9"
                    />
                    <text
                      x={location.x}
                      y={location.y - 22}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="medium"
                      fill="#ffffff"
                    >
                      {location.district}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Map Legend */}
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-md px-3 py-2 text-xs shadow-sm border border-primary-100">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-primary-700 mr-2"></div>
            <span className="text-gray-700">Active Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary-400 mr-2"></div>
            <span className="text-gray-700">Connected Districts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo data - can be replaced with actual Punjab district locations
const DEMO_LOCATIONS: MapLocation[] = [
  {
    id: '1',
    name: 'Amritsar',
    x: 120,
    y: 80,
    district: 'Amritsar',
    connections: ['2', '5']
  },
  {
    id: '2',
    name: 'Jalandhar',
    x: 180,
    y: 120,
    district: 'Jalandhar',
    connections: ['1', '3', '6']
  },
  {
    id: '3',
    name: 'Ludhiana',
    x: 220,
    y: 170,
    district: 'Ludhiana',
    connections: ['2', '4', '7']
  },
  {
    id: '4',
    name: 'Patiala',
    x: 260,
    y: 220,
    district: 'Patiala',
    connections: ['3', '8']
  },
  {
    id: '5',
    name: 'Gurdaspur',
    x: 150,
    y: 50,
    district: 'Gurdaspur',
    connections: ['1', '6']
  },
  {
    id: '6',
    name: 'Hoshiarpur',
    x: 220,
    y: 100,
    district: 'Hoshiarpur',
    connections: ['2', '5', '7']
  },
  {
    id: '7',
    name: 'Rupnagar',
    x: 280,
    y: 140,
    district: 'Rupnagar',
    connections: ['3', '6', '8']
  },
  {
    id: '8',
    name: 'Mohali',
    x: 290,
    y: 190,
    district: 'SAS Nagar',
    connections: ['4', '7']
  },
]; 