import React from 'react';
import { User, MapPin, Calendar, ChevronRight, MessageSquare, FileText } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Badge } from './Badge';

interface MentorCardProps {
  mentor: {
    id: string;
    name: string;
    designation: string;
    department: string;
    location: string;
    expertise: string[];
    avatar?: string;
    district?: string;
    meetingsCompleted?: number;
    availability?: string;
  };
  isActive?: boolean;
  onViewProfile?: (mentorId: string) => void;
  onConnect?: (mentorId: string) => void;
  className?: string;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  isActive = false,
  onViewProfile,
  onConnect,
  className = '',
}) => {
  // Extract first letter of name for avatar fallback
  const avatarText = mentor.name.charAt(0).toUpperCase();
  
  return (
    <Card 
      variant={isActive ? 'bordered' : 'elevated'} 
      className={`h-full transition-all duration-300 hover:shadow-lg ${isActive ? 'border-primary-500 ring-1 ring-primary-500' : ''} ${className}`}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Decorative header pattern */}
          <div className="h-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl">
            <div className="absolute right-0 top-0 w-32 h-20 overflow-hidden opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                <path fill="currentColor" d="M44.5,-76.3C59.1,-69.9,73.3,-60.9,81.6,-47.6C90,-34.3,92.5,-17.1,91.1,-0.8C89.7,15.5,84.4,30.9,75.5,43.9C66.6,56.8,54.1,67.2,40,74.2C25.9,81.2,12.9,84.8,-0.7,86C-14.4,87.1,-28.8,85.9,-39.4,78.8C-50,71.8,-56.8,59,-63.1,46.1C-69.4,33.2,-75.2,20.2,-78.8,5.7C-82.4,-8.9,-83.8,-25,-76.9,-36.4C-70,-47.9,-54.8,-54.8,-40.7,-61.5C-26.7,-68.3,-13.3,-74.9,1.2,-77C15.7,-79.1,31.5,-76.6,44.5,-76.3Z" transform="translate(70 70)" />
              </svg>
            </div>
          </div>
          
          {/* Avatar - positioned to overlap */}
          <div className="absolute -bottom-10 left-6 h-20 w-20 rounded-full border-4 border-white bg-secondary-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {mentor.avatar ? (
              <img 
                src={mentor.avatar} 
                alt={mentor.name} 
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              avatarText
            )}
          </div>
        </div>
        
        <div className="pt-12 px-6 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{mentor.designation}</p>
            </div>
            {mentor.availability && (
              <Badge variant="primary" size="sm">{mentor.availability}</Badge>
            )}
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 text-primary-600 mr-2" />
              <span>{mentor.department}</span>
            </div>
            
            {mentor.district && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-primary-600 mr-2" />
                <span>{mentor.district}</span>
              </div>
            )}
            
            {mentor.meetingsCompleted !== undefined && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-primary-600 mr-2" />
                <span>{mentor.meetingsCompleted} meetings completed</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Areas of Expertise</p>
            <div className="flex flex-wrap gap-1">
              {mentor.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary" size="sm" className="mb-1">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 rounded-b-xl p-4 flex justify-between items-center">
        <button 
          onClick={() => onConnect?.(mentor.id)}
          className="inline-flex items-center text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Connect
        </button>
        
        <button 
          onClick={() => onViewProfile?.(mentor.id)}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
        >
          View Profile
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </CardFooter>
    </Card>
  );
}; 