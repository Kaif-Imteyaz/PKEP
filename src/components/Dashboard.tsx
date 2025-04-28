import React, { useState, useEffect } from 'react';
import { Calendar, Users, ArrowRight, FileText, BarChart, Clock, TrendingUp, TrendingDown, Award, HelpCircle, MapPin, Filter, ChevronDown, Download, ChevronRight, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type UserProfile = {
  name: string;
  service: string;
  office: string;
  district: string;
};

type HistoricalMetric = {
  month: string;
  value: number;
};

function MetricCard({ 
  title, 
  value,
  trend,
  rankChange,
  icon: Icon,
  color,
  percentile,
  tooltip,
  unit = '%',
  history,
  delay = 0
}: { 
  title: string;
  value: number;
  trend: 'up' | 'down';
  rankChange: number;
  icon: any;
  color: string;
  percentile: number;
  tooltip: string;
  unit?: string;
  history: HistoricalMetric[];
  delay?: number;
}) {
  const maxValue = Math.max(...history.map(h => h.value));
  const minValue = Math.min(...history.map(h => h.value));
  const range = maxValue - minValue;
  
  const getY = (value: number) => {
    const height = 80;
    const padding = 10;
    return height - ((value - minValue) / range * (height - 2 * padding) + padding);
  };

  const generateSmoothPath = (points: { x: number, y: number }[]) => {
    if (points.length < 2) return '';
    
    const path = [`M ${points[0].x} ${points[0].y}`];
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlPointX = (next.x - current.x) / 2;
      
      path.push(`C ${current.x + controlPointX} ${current.y} ${next.x - controlPointX} ${next.y} ${next.x} ${next.y}`);
    }
    
    return path.join(' ');
  };

  const points = history.map((point, i) => ({
    x: (i * 300) / (history.length - 1),
    y: getY(point.value)
  }));

  return (
    <Card variant="elevated" className={`animate-slide-up hover:shadow-lg transition-shadow duration-300`} style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full bg-${color === 'rose' ? 'red' : color}-100`}>
              <Icon className={`h-5 w-5 text-${color === 'rose' ? 'red' : color}-600`} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400" />
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-10">
                {tooltip}
              </div>
            </div>
          </div>
          <Badge variant="primary" withDot rounded="full" className="flex items-center">
            <Award className="h-3.5 w-3.5 mr-1 text-primary-600" />
            <span>TOP {percentile}%</span>
          </Badge>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-4xl font-bold text-gray-900">{value}{unit}</p>
            <p className="mt-1 text-sm text-gray-500 flex items-center">
              Rank {trend === 'up' ? 'improved' : 'dropped'} by {rankChange}
              <span className={`ml-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Bottom 25%</span>
            <span>Average</span>
            <span>Top 25%</span>
          </div>
          <div className="flex space-x-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                style={{ transitionDelay: `${i * 30}ms` }}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < 5 ? 'bg-red-200' : 
                  i < 15 ? 'bg-amber-200' : 
                  'bg-green-200'
                } ${
                  Math.floor(percentile / 5) === i ? 'ring-2 ring-offset-2 ring-primary-600' : ''
                } ${
                  i <= Math.floor(percentile / 5) ? 'scale-y-100' : 'scale-y-0'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Historical Trend</h4>
          <div className="h-32">
            <div className="relative h-full w-full">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
                <span>{Math.round(maxValue * 10) / 10}{unit}</span>
                <span>{Math.round((maxValue + minValue) / 2 * 10) / 10}{unit}</span>
                <span>{Math.round(minValue * 10) / 10}{unit}</span>
              </div>
              
              <div className="ml-8 h-full">
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <g className="grid-lines">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                  </g>
                  
                  <path
                    d={generateSmoothPath(points)}
                    fill="none"
                    stroke={`${color === 'rose' ? '#dc2626' : '#10b981'}`}
                    strokeWidth="2"
                    strokeDasharray="300"
                    strokeDashoffset="300"
                    style={{
                      animation: 'dashOffset 2s forwards ease-out',
                    }}
                  />
                  
                  {history.map((point, i) => (
                    <g key={i} className="group" style={{ opacity: 0, animation: `fadePoint 0.3s ${0.5 + i * 0.1}s forwards` }}>
                      <circle
                        cx={(i * 300) / (history.length - 1)}
                        cy={getY(point.value)}
                        r="12"
                        fill="transparent"
                        className="cursor-pointer"
                      />
                      <circle
                        cx={(i * 300) / (history.length - 1)}
                        cy={getY(point.value)}
                        r="3"
                        fill="white"
                        stroke={`${color === 'rose' ? '#dc2626' : '#10b981'}`}
                        strokeWidth="2"
                        className="transition-all duration-200 group-hover:r-4"
                      />
                      <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <rect
                          x={(i * 300) / (history.length - 1) - 25}
                          y={getY(point.value) - 25}
                          width="50"
                          height="20"
                          rx="4"
                          fill="#1f2937"
                        />
                        <text
                          x={(i * 300) / (history.length - 1)}
                          y={getY(point.value) - 12}
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                        >
                          {point.value.toFixed(1)}{unit}
                        </text>
                      </g>
                      <text
                        x={(i * 300) / (history.length - 1)}
                        y="95"
                        textAnchor="middle"
                        className="text-xs fill-gray-400"
                      >
                        {point.month}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [dateRange, setDateRange] = useState('30');
  const [profile] = useState<UserProfile>({
    name: 'Amitabh Bachchan',
    service: 'Revenue Service',
    office: 'District Revenue Office',
    district: 'Amritsar'
  });
  const [metrics, setMetrics] = useState({
    delayed_applications: 0,
    process_days: 0,
    applications_handled: 0
  });
  const [historicalMetrics, setHistoricalMetrics] = useState<{
    delayed_applications: HistoricalMetric[];
    process_days: HistoricalMetric[];
  }>({
    delayed_applications: [],
    process_days: []
  });

  useEffect(() => {
    fetchMetrics();
    fetchHistoricalMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching metrics:', error);
        return;
      }

      if (data) {
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchHistoricalMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('historical_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('month', { ascending: true });

      if (error) {
        console.error('Error fetching historical metrics:', error);
        return;
      }

      if (data) {
        const delayed = data
          .filter(m => m.metric_type === 'delayed_applications')
          .map(m => ({
            month: format(new Date(m.month), 'MMM'),
            value: m.value
          }));

        const process = data
          .filter(m => m.metric_type === 'process_days')
          .map(m => ({
            month: format(new Date(m.month), 'MMM'),
            value: m.value
          }));

        setHistoricalMetrics({
          delayed_applications: delayed,
          process_days: process
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Service Metrics Dashboard</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Track your performance metrics and identify areas for improvement in service delivery.
        </p>
      </div>

      {/* Officer Profile Card */}
      <Card variant="elevated" className={`overflow-hidden animate-slide-up`} style={{ animationDelay: '100ms' }}>
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4">
          <h2 className="text-xl font-semibold text-white">Officer Profile</h2>
        </div>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-primary-100 mr-3">
                <Users className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Officer Name</p>
                <p className="mt-1 font-medium text-gray-900">{profile.name}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-primary-100 mr-3">
                <Award className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="mt-1 font-medium text-gray-900">{profile.service}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-primary-100 mr-3">
                <Calendar className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Office</p>
                <p className="mt-1 font-medium text-gray-900">{profile.office}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-primary-100 mr-3">
                <MapPin className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">District</p>
                <p className="mt-1 font-medium text-gray-900">{profile.district}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            icon={<Filter className="h-4 w-4" />}
            iconPosition="left"
          >
            Filter
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input px-3 py-2 text-sm w-auto border-primary-200 focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Applications Handled:</span>
          <span className="font-medium text-gray-900">{metrics.applications_handled}</span>
          <span className="text-sm text-green-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12%
          </span>
          <Button
            variant="outline"
            icon={<Download className="h-4 w-4" />}
            iconPosition="left"
            className="ml-4"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Delayed Applications"
          value={metrics.delayed_applications}
          trend="down"
          rankChange={4}
          icon={Clock}
          color="rose"
          percentile={92}
          tooltip="Percentage of applications processed beyond stipulated timeline"
          history={historicalMetrics.delayed_applications}
          delay={300}
        />
        <MetricCard
          title="Process Days"
          value={metrics.process_days}
          trend="up"
          rankChange={2}
          icon={FileText}
          color="primary"
          percentile={88}
          tooltip="Median time taken to process applications"
          unit=" days"
          history={historicalMetrics.process_days}
          delay={400}
        />
      </div>

      {/* Performance Improvement Tips */}
      <Card variant="elevated" className={`animate-slide-up`} style={{ animationDelay: '500ms' }}>
        <CardHeader 
          title="Performance Improvement Tips" 
          subtitle="Personalized suggestions based on your metrics"
          action={
            <Button variant="ghost" size="sm" icon={<ChevronRight className="h-4 w-4" />} iconPosition="right">
              View All Tips
            </Button>
          }
        />
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex hover:bg-primary-50 p-4 rounded-lg transition-colors duration-200 cursor-pointer">
              <div className="p-3 rounded-full bg-primary-100 mr-4 flex-shrink-0">
                <Clock className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Reduce Processing Time</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Consider implementing a standardized checklist for document verification to reduce back-and-forth with applicants.
                </p>
                <button className="mt-3 text-primary-600 text-sm font-medium inline-flex items-center">
                  Learn more <ArrowUpRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex hover:bg-primary-50 p-4 rounded-lg transition-colors duration-200 cursor-pointer">
              <div className="p-3 rounded-full bg-green-100 mr-4 flex-shrink-0">
                <Users className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Delegate Effectively</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Identify routine tasks that can be handled by junior staff to free up time for complex applications.
                </p>
                <button className="mt-3 text-green-600 text-sm font-medium inline-flex items-center">
                  Learn more <ArrowUpRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add keyframe animations to the index.css file
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes dashOffset {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes fadePoint {
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleTag);