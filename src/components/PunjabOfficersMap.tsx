import { useState, useEffect, useRef } from 'react';
import { UserCircle2 } from 'lucide-react';

interface Officer {
  id: number;
  x: number;
  y: number;
  district: string;
  role: string;
  active: boolean;
}

interface Connection {
  from: number;
  to: number;
  progress: number;
  active: boolean;
  complete: boolean;
  flowOffset: number;
}

export default function PunjabOfficersMap({ isLoginVariant = false }) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [highlightedOfficer, setHighlightedOfficer] = useState<number | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Officers positioned more evenly across the Punjab map with greater distances
  const officersData: Officer[] = [
    { id: 1, x: 310, y: 230, district: "Amritsar", role: "IAS", active: false },
    { id: 2, x: 450, y: 210, district: "Jalandhar", role: "IPS", active: false },
    { id: 3, x: 390, y: 510, district: "Bathinda", role: "PCS", active: false },
    { id: 4, x: 620, y: 510, district: "Patiala", role: "PPS", active: false },
    { id: 5, x: 450, y: 610, district: "Tarn Taran", role: "IAS", active: false },
    { id: 6, x: 510, y: 330, district: "Ludhiana", role: "PCS", active: false },
    { id: 7, x: 230, y: 560, district: "Moga", role: "IPS", active: false },
    { id: 8, x: 550, y: 400, district: "Fatehgarh Sahib", role: "PPS", active: false }
  ];
  
  const officerConnections = [
    { from: 0, to: 3 },
    { from: 1, to: 2 },
    { from: 4, to: 7 },
    { from: 5, to: 6 }
  ];

  // Initialize officers with entry animation
  useEffect(() => {
    setOfficers([]);
    
    officersData.forEach((officer, index) => {
      setTimeout(() => {
        setOfficers(prev => [...prev, { ...officer, active: true }]);
      }, index * 150);
    });
  }, []);

  // Initialize and animate connections after officers appear
  useEffect(() => {
    if (officers.length === officersData.length) {
      setConnections([]);
      
      officerConnections.forEach((conn, index) => {
        setTimeout(() => {
          setConnections(prev => [
            ...prev,
            { 
              from: conn.from, 
              to: conn.to, 
              progress: 0, 
              active: true, 
              complete: false,
              flowOffset: 0
            }
          ]);
        }, 800 + index * 400);
      });
    }
  }, [officers.length]);

  // Animate connections with consistent timing
  useEffect(() => {
    if (connections.length === 0) return;
    
    const interval = setInterval(() => {
      setConnections(prevConnections => {
        const allComplete = prevConnections.every(conn => conn.complete);
        
        if (allComplete) {
          return prevConnections.map((conn, idx) => ({
            ...conn,
            active: Math.floor(Date.now() / 500) % prevConnections.length === idx
          }));
        }
        
        return prevConnections.map(conn => {
          if (conn.complete) return conn;
          
          const newProgress = conn.progress + 0.01;
          if (newProgress >= 1) {
            return { ...conn, progress: 1, complete: true };
          }
          return { ...conn, progress: newProgress };
        });
      });
    }, 16);

    return () => clearInterval(interval);
  }, [connections.length]);

  // Handle infinite flow animation along the connections
  useEffect(() => {
    if (connections.length === 0 || !connections.every(conn => conn.complete)) return;
    
    const animateFlow = () => {
      setConnections(prevConnections => 
        prevConnections.map(conn => ({
          ...conn,
          flowOffset: (conn.flowOffset + 0.5) % 100
        }))
      );
      
      animationFrameRef.current = requestAnimationFrame(animateFlow);
    };
    
    animationFrameRef.current = requestAnimationFrame(animateFlow);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [connections.length, connections.every(conn => conn.complete)]);

  // Handle officer hover effects
  const handleOfficerHover = (id: number | null) => {
    setHighlightedOfficer(id);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {!isLoginVariant && (
      <h1 className="text-center text-2xl font-bold text-blue-800 mb-2">CONNECTING OFFICERS IN PUNJAB</h1>
      )}
      
      <div className="relative">
        <div className="relative" style={{ width: '100%', paddingBottom: '85%' }}>
          <div 
            className="absolute inset-0 bg-contain bg-no-repeat bg-center" 
            style={{ 
              backgroundImage: 'url("/map.webp")',
              backgroundSize: '115%',
              backgroundPosition: 'center 45%'
            }}
          >
            <svg viewBox="0 0 800 800" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E3E6A" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
                </filter>
                
                {/* Enhanced flow pattern with gradient */}
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4E88F0" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#4E88F0" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4E88F0" stopOpacity="0.1" />
                </linearGradient>
                
                {connections.map((conn, idx) => (
                  <mask key={`flowMask-${idx}`} id={`flowMask-${idx}`}>
                    <rect x="0" y="0" width="800" height="800" fill="white" />
                  </mask>
                ))}
              </defs>
              
              {connections.map((conn, idx) => {
                const fromOfficer = officersData[conn.from];
                const toOfficer = officersData[conn.to];
                
                const dx = toOfficer.x - fromOfficer.x;
                const dy = toOfficer.y - fromOfficer.y;
                
                const distance = Math.sqrt(dx * dx + dy * dy);
                const curveFactor = Math.min(distance * 0.2, 50);
                
                const midX = (fromOfficer.x + toOfficer.x) / 2;
                const midY = (fromOfficer.y + toOfficer.y) / 2;
                
                const perpX = -dy / distance * curveFactor;
                const perpY = dx / distance * curveFactor;
                
                const controlX = midX + perpX;
                const controlY = midY + perpY;
                
                const path = `M ${fromOfficer.x} ${fromOfficer.y} Q ${controlX} ${controlY} ${toOfficer.x} ${toOfficer.y}`;
                
                const isHighlighted = highlightedOfficer === conn.from || highlightedOfficer === conn.to;
                
                return (
                  <g key={idx} className="connection-group">
                    {/* Background reference path - thicker now */}
                    <path 
                      d={path}
                      stroke={isLoginVariant ? "#ffffff" : "#324C6B"} 
                      strokeWidth="3" // Increased from 1.5
                      strokeDasharray="5,3" 
                      strokeOpacity="0.3"
                      fill="none"
                    />
                    
                    {/* Active connection path - thicker now */}
                    <path 
                      d={path}
                      stroke="url(#connectionGradient)" 
                      strokeWidth={isHighlighted ? "5" : "4"} // Increased from 3.5/2.5
                      strokeDasharray={conn.complete ? "none" : "6,3"}
                      strokeLinecap="round"
                      fill="none"
                      filter={isHighlighted ? "url(#glow)" : "none"}
                      pathLength="1"
                      strokeOpacity={conn.active || isHighlighted ? "1" : "0.7"}
                      style={{ 
                        strokeDasharray: conn.complete ? "none" : "6,3",
                        strokeDashoffset: conn.complete ? "0" : (Date.now() / 50) % 20
                      }}
                      className="transition-all duration-300"
                    />
                    
                    {/* Connection progress clip - thicker now */}
                    <path 
                      d={path}
                      stroke={isHighlighted ? "#4FD1C5" : "#4E88F0"} 
                      strokeWidth={isHighlighted ? "4" : "3"} // Increased from 3/2
                      strokeLinecap="round"
                      fill="none"
                      pathLength="1"
                      strokeDasharray="1"
                      strokeDashoffset={1 - conn.progress}
                      className="transition-all duration-100"
                    />
                    
                    {/* Enhanced flow animation along the path - multiple flowing lines instead of dots */}
                    {conn.complete && (
                      <>
                        {/* Primary flow animation - continuous flowing lines */}
                        <path 
                          d={path}
                          stroke={isHighlighted ? "rgba(79, 209, 197, 0.9)" : "rgba(59, 130, 246, 0.9)"}
                          strokeWidth={isHighlighted ? "5" : "4"}
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="10,20"
                          filter="url(#glow)"
                        >
                          <animate 
                            attributeName="stroke-dashoffset" 
                            from="0" 
                            to="30" 
                            dur="1.5s" 
                            repeatCount="indefinite"
                          />
                        </path>
                        
                        {/* Secondary flow - slower, different pattern */}
                        <path 
                          d={path}
                          stroke={isHighlighted ? "rgba(79, 209, 197, 0.6)" : "rgba(59, 130, 246, 0.6)"}
                          strokeWidth={isHighlighted ? "3" : "2"}
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="5,15,2,10"
                          filter="url(#glow)"
                        >
                          <animate 
                            attributeName="stroke-dashoffset" 
                            from="0" 
                            to="32" 
                            dur="3s" 
                            repeatCount="indefinite"
                          />
                        </path>
                        
                        {/* Third flow pattern - different speed and pattern */}
                        <path 
                          d={path}
                          stroke={isHighlighted ? "rgba(79, 209, 197, 0.4)" : "rgba(59, 130, 246, 0.4)"}
                          strokeWidth={isHighlighted ? "6" : "5"}
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="2,40,5,20"
                          filter="url(#glow)"
                        >
                          <animate 
                            attributeName="stroke-dashoffset" 
                            from="0" 
                            to="67" 
                            dur="4s" 
                            repeatCount="indefinite"
                          />
                        </path>
                        
                        {/* Glow effect that pulses along the entire path */}
                        <path 
                          d={path}
                          stroke={isHighlighted ? "rgba(79, 209, 197, 0.3)" : "rgba(59, 130, 246, 0.3)"}
                          strokeWidth={isHighlighted ? "8" : "7"}
                          fill="none"
                          filter="url(#glow)"
                        >
                          <animate 
                            attributeName="stroke-opacity" 
                            values="0.1;0.3;0.1" 
                            dur="2s" 
                            repeatCount="indefinite"
                          />
                        </path>
                      </>
                    )}
                  </g>
                );
              })}
              
              {/* Officers with interactive animations */}
              {officers.map((officer) => {
                const isHighlighted = highlightedOfficer === officer.id - 1;
                const isConnected = connections.some(
                  conn => (conn.from === officer.id - 1 || conn.to === officer.id - 1) && conn.active
                );
                
                return (
                  <g 
                    key={officer.id} 
                    onMouseEnter={() => handleOfficerHover(officer.id - 1)}
                    onMouseLeave={() => handleOfficerHover(null)}
                    className="cursor-pointer transition-transform duration-300 ease-in-out"
                    style={{ 
                      transform: `translate(${officer.x-16}px, ${officer.y-16}px) scale(${isHighlighted ? 1.15 : 1})`,
                      opacity: officer.active ? 1 : 0,
                      transition: 'all 0.3s ease-out'
                    }}
                  >
                    {/* Highlight effect */}
                    {isHighlighted && (
                      <circle 
                        cx="16" 
                        cy="16" 
                        r="20" 
                        fill={isLoginVariant ? "rgba(79, 209, 197, 0.25)" : "rgba(79, 209, 197, 0.15)"}
                        className="animate-pulse-slow"
                      />
                    )}
                    
                    {/* Background circle */}
                    <circle 
                      cx="16" 
                      cy="16" 
                      r="16" 
                      fill={isHighlighted ? "white" : "rgba(255,255,255,0.9)"} 
                      stroke={isHighlighted ? "#4FD1C5" : isLoginVariant ? "#4FD1C5" : "#2C4C6B"}
                      strokeWidth={isHighlighted ? "2" : "1.5"}
                      filter="url(#dropShadow)"
                      className="transition-all duration-300"
                    />
                    
                    {/* Officer icon */}
                    <foreignObject x="3" y="3" width="26" height="26">
                      <div className="flex items-center justify-center w-full h-full">
                        <UserCircle2 
                          size={22} 
                          strokeWidth={1.5}
                          className={`transition-colors duration-300 ${isHighlighted ? 'text-teal-500' : isLoginVariant ? 'text-primary-600' : 'text-blue-800'}`} 
                        />
                      </div>
                    </foreignObject>
                    
                    {/* Entrance animation ring */}
                    <circle 
                      cx="16" 
                      cy="16" 
                      r="24" 
                      fill="none" 
                      stroke={isHighlighted ? "#4FD1C5" : "#3B82F6"}
                      strokeWidth="2"
                      strokeOpacity="0.5"
                      className="animate-ping"
                      style={{ 
                        animationDuration: '2s',
                        animationIterationCount: officer.active ? '1' : '0'
                      }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}