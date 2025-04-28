import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Lock, ChevronRight, Shield, ArrowRight } from 'lucide-react';
import PunjabOfficersMap from './PunjabOfficersMap';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('test@punjab.gov.in');
  const [password, setPassword] = useState('test123');
  const [isSignUp, setIsSignUp] = useState(false);
  

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        alert(error.message);
      } else {
        alert('Account created! You can now sign in.');
        setIsSignUp(false);
      }
    } else {
      localStorage.setItem('email', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) alert(error.message)
        localStorage.setItem('email', email);
      
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 flex flex-col lg:flex-row overflow-auto">
      {/* Map Section - Left Side */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-4 lg:p-8 bg-gradient-to-b from-primary-700 to-primary-900 relative overflow-hidden min-h-[50vh] lg:min-h-screen">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{ 
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }}></div>
        </div>
        
        <div className="relative z-10 w-full max-w-xl mx-auto">
          <div className="text-center mb-4 lg:mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Peer Knowledge Exchange Platform</h2>
            <p className="text-primary-100">Connecting officers across Punjab</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 lg:p-6 shadow-2xl border border-white/20 animate-fade-in">
            <div className="max-h-[350px] md:max-h-[500px] lg:max-h-none overflow-hidden">
              <PunjabOfficersMap isLoginVariant={true} />
            </div>
          </div>
          
          {/* Add a hidden preload for the map image to ensure it loads */}
          <img src="/map.webp" alt="" className="hidden" />
          
          <div className="mt-3 lg:mt-6 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-primary-100">
              <Users className="h-5 w-5" />
              <span>Officer Network</span>
            </div>
            <div className="h-4 border-r border-primary-300/30"></div>
            <div className="flex items-center space-x-2 text-primary-100">
              <Shield className="h-5 w-5" />
              <span>Secure Platform</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Section - Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white py-6 lg:py-8">
        <div className="w-full max-w-md px-6">
          <div className="flex flex-col items-center mb-6">
            <img src="/dgr.png" alt="Department of Governance Reforms, Punjab" className="h-16 w-auto mb-4" />
            <div className="flex items-center">
              <div className="mr-3 h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-primary-600 to-teal-600 flex items-center justify-center shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">PKEP Login</h1>
                <p className="text-sm text-gray-600">Department of Governance Reforms</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-6">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="officer@punjab.gov.in"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button type="button" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </div>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-1 text-sm">
              <span className="text-gray-600">
                {isSignUp ? 'Already have an account?' : 'Need an account?'}
              </span>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="text-center text-sm text-gray-500">
              <p>Peer Knowledge Exchange Platform</p>
              <p className="mt-1">Government of Punjab</p>
              <div className="flex justify-center items-center mt-4">
                <span className="mr-2 text-xs text-gray-400">Powered by</span>
                <img src="/isb.png" alt="Indian School of Business" className="h-10 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}