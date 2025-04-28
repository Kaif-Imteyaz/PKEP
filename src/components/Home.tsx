import React, { useEffect, useState } from 'react';
import { Calendar, Users, ArrowRight, FileText, BarChart, Clock, ChevronRight, MapPin, Award, PieChart, Target, ArrowUpRight, MessageSquare, BookOpen, Zap, Book, CheckSquare, LayoutGrid } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

const BUDDY_PAIRS: Record<string, string> = {
  'test@punjab.gov.in': 'test2@punjab.gov.in',
  'test2@punjab.gov.in': 'test@punjab.gov.in',
  'test3@punjab.gov.in': 'test4@punjab.gov.in',
  'test4@punjab.gov.in': 'test3@punjab.gov.in'
};

const BUDDY_NAMES: Record<string, string> = {
  'test@punjab.gov.in': 'Amitabh Bachchan',
  'test2@punjab.gov.in': 'Dharmendra',
  'test3@punjab.gov.in': 'Rekha',
  'test4@punjab.gov.in': 'Sridevi'
};

export function Home() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [buddyName, setBuddyName] = useState<string | null>(null);
  const [meetingsCompleted] = useState(3);
  const [totalMeetings] = useState(5);
  const nextMeetingDate = new Date('2025-02-15T14:00:00');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMentors: 0,
    upcomingMeetings: 0,
    resourcesAccessed: 0,
    reflectionsSubmitted: 0
  });
  
  useEffect(() => {
    fetchBuddyInfo();
  }, []);

  const fetchBuddyInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return;
      
      setUserEmail(user.email);
      setCurrentUser(BUDDY_NAMES[user.email]);
      
      const buddyEmail = BUDDY_PAIRS[user.email];
      if (buddyEmail) {
        setBuddyName(BUDDY_NAMES[buddyEmail]);
      }
      
      // Simulate fetching stats
      // In a real app, you would fetch this from your database
      setTimeout(() => {
        setStats({
          totalMentors: 12,
          upcomingMeetings: 2,
          resourcesAccessed: 28,
          reflectionsSubmitted: 5
        });
        
        // Calculate profile completion based on some criteria
        const completionSteps = [
          !!user.user_metadata?.full_name,
          !!user.phone,
          !!user.user_metadata?.department,
          !!user.user_metadata?.designation,
          !!user.user_metadata?.location,
        ];
        
        const completed = completionSteps.filter(Boolean).length;
        setCompletionPercentage(Math.round((completed / completionSteps.length) * 100));
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching buddy info:', error);
    }
  };

  const handleNavigation = (view: string) => {
    const event = new CustomEvent('viewChange', { detail: view });
    window.dispatchEvent(event);
  };

  const daysUntilNextMeeting = differenceInDays(nextMeetingDate, new Date());
  
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-700 via-primary-600 to-teal-700 shadow-lg animate-fade-in">
        {/* Logos Row */}
        <div className="flex flex-col items-center pt-8">
          <div className="flex items-center space-x-6 mb-2">
            <img src="/dgr.png" alt="Department of Governance Reforms, Punjab" className="h-16 w-auto" />
            <div className="flex flex-col items-center">
              <img src="/isb.png" alt="Indian School of Business" className="h-10 w-auto" />
              <span className="text-xs text-white mt-1 opacity-80">Powered by</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Dots pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
        
        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 animate-slide-up">
                Welcome back, {currentUser || 'Officer'}
              </h1>
              <p className="text-primary-50 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
                Your knowledge exchange journey continues today. Track your progress, connect with peers, and enhance your professional development.
              </p>
            </div>
            
            <div className="sm:ml-6 mt-4 sm:mt-0 animate-slide-up bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center text-white">
                <Zap className="h-5 w-5 mr-2 text-yellow-300" />
                <span className="font-medium">Overall Progress</span>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex-1 bg-white/20 rounded-full h-2.5 mr-3 w-32">
                  <div 
                    className="bg-yellow-300 h-2.5 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-white text-sm font-medium">{completionPercentage}%</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-500/20 mr-3">
                  <Users className="h-5 w-5 text-blue-300" />
                </div>
                <div className="text-white">
                  <p className="text-xs text-blue-100">Active Mentors</p>
                  <p className="text-xl font-bold">{stats.totalMentors}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-500/20 mr-3">
                  <Calendar className="h-5 w-5 text-green-300" />
                </div>
                <div className="text-white">
                  <p className="text-xs text-green-100">Upcoming Meetings</p>
                  <p className="text-xl font-bold">{stats.upcomingMeetings}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-500/20 mr-3">
                  <Book className="h-5 w-5 text-purple-300" />
                </div>
                <div className="text-white">
                  <p className="text-xs text-purple-100">Resources Accessed</p>
                  <p className="text-xl font-bold">{stats.resourcesAccessed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up" style={{ animationDelay: '350ms' }}>
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-amber-500/20 mr-3">
                  <CheckSquare className="h-5 w-5 text-amber-300" />
                </div>
                <div className="text-white">
                  <p className="text-xs text-amber-100">Reflections Submitted</p>
                  <p className="text-xl font-bold">{stats.reflectionsSubmitted}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Meeting Section - Changed from 2-column to full width */}
      <div className="grid grid-cols-1 gap-6">
        {/* Next Meeting Card */}
        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader 
            title={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Peer Meeting</h3>
                <Badge variant="primary" className="animate-pulse-slow">
                  {daysUntilNextMeeting} days away
                </Badge>
              </div>
            } 
          />
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-secondary-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                {buddyName ? buddyName.charAt(0) : 'B'}
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">With {buddyName || 'your buddy'}</h4>
                <p className="text-sm text-gray-500">Revenue Service, Mentor</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary-600 mr-3" />
                <span className="text-gray-600">February 15, 2025 at 2:00 PM IST</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary-600 mr-3" />
                <span className="text-gray-600">Virtual (Webex Meeting)</span>
              </div>
              
              <div className="pt-3 flex items-center space-x-4">
                <Button 
                  variant="primary"
                  icon={<ArrowUpRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Join Meeting
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleNavigation('reflection')}
                >
                  Prepare Reflection
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 rounded-b-lg p-4">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-gray-600">Completed: {meetingsCompleted} of {totalMeetings} sessions</p>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full"
                    style={{ width: `${Math.round((meetingsCompleted / totalMeetings) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">{Math.round((meetingsCompleted / totalMeetings) * 100)}%</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Quick Access Section */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quick Access</h3>
          <button className="text-primary-600 text-sm font-medium flex items-center">
            {/* Customize Dashboard */}
            <LayoutGrid className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            variant="elevated" 
            className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => handleNavigation('reflection')}
          >
            <CardContent className="p-5">
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-blue-100 mr-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">Reflection Notes</h4>
                  <p className="text-sm text-gray-500 mt-1">Review and add meeting reflections</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            variant="elevated" 
            className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => handleNavigation('dashboard')}
          >
            <CardContent className="p-5">
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-green-100 mr-4 group-hover:bg-green-200 transition-colors duration-300">
                  <BarChart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">Performance Report</h4>
                  <p className="text-sm text-gray-500 mt-1">View your metrics and progress</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            variant="elevated" 
            className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => handleNavigation('resources')}
          >
            <CardContent className="p-5">
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-amber-100 mr-4 group-hover:bg-amber-200 transition-colors duration-300">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">Resource Hub</h4>
                  <p className="text-sm text-gray-500 mt-1">Access knowledge repository</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            variant="elevated" 
            className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => handleNavigation('whatsapp')}
          >
            <CardContent className="p-5">
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-purple-100 mr-4 group-hover:bg-purple-200 transition-colors duration-300">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">WhatsApp Settings</h4>
                  <p className="text-sm text-gray-500 mt-1">Configure communication preferences</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Add keyframe animations to the index.css file
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes progressAnim {
    from { width: 0%; }
    to { width: ${Math.round((3 / 5) * 100)}%; }
  }
  
  @keyframes progressAnimation {
    from { stroke-dashoffset: 251.2; }
    to { stroke-dashoffset: ${251.2 - (251.2 * (3 / 5))}; }
  }
`;
document.head.appendChild(styleTag);