'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Heart, Droplet, Moon, Scale, Dumbbell, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// Simulated wearable data
const generateWearableData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now);
    time.setHours(now.getHours() - 23 + i);
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      steps: Math.floor(Math.random() * 1000) + 500,
      heartRate: Math.floor(Math.random() * 20) + 60,
      calories: Math.floor(Math.random() * 50) + 100,
    });
  }
  
  return data;
};

// Simulated weekly activity data
const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    workouts: Math.floor(Math.random() * 3),
    water: Math.floor(Math.random() * 4) + 4,
    sleep: Math.floor(Math.random() * 3) + 6,
  }));
};

export default function DashboardPage() {
  const [wearableData, setWearableData] = useState(generateWearableData());
  const [weeklyData, setWeeklyData] = useState(generateWeeklyData());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setWearableData(generateWearableData());
          setWeeklyData(generateWeeklyData());
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const todayStats = {
    steps: wearableData.reduce((sum, data) => sum + data.steps, 0),
    avgHeartRate: Math.floor(wearableData.reduce((sum, data) => sum + data.heartRate, 0) / wearableData.length),
    calories: wearableData.reduce((sum, data) => sum + data.calories, 0),
    water: Math.floor(Math.random() * 4) + 4,
    sleep: Math.floor(Math.random() * 3) + 6,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Health Dashboard
          </h1>
          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Wearable'}
          </Button>
        </div>

        {isSyncing && (
          <div className="space-y-2 bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm">
            <Progress value={syncProgress} className="h-2" />
            <p className="text-sm text-gray-600 text-center">Syncing with wearable device...</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Daily Steps</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{todayStats.steps.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Goal: 10,000 steps</p>
              <Progress 
                value={(todayStats.steps / 10000) * 100} 
                className="mt-2 h-2 bg-gray-100"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{todayStats.avgHeartRate} BPM</div>
              <p className="text-xs text-gray-500">Average today</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Calories Burned</CardTitle>
              <Dumbbell className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{todayStats.calories}</div>
              <p className="text-xs text-gray-500">Today's activity</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-none">
            <CardHeader>
              <CardTitle className="text-gray-700">24-Hour Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wearableData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="steps" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="heartRate" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={{ fill: '#f97316' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-none">
            <CardHeader>
              <CardTitle className="text-gray-700">Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="workouts" fill="#3b82f6" name="Workouts" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="water" fill="#10b981" name="Water (glasses)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sleep" fill="#f97316" name="Sleep (hours)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Water Intake</CardTitle>
              <Droplet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{todayStats.water} glasses</div>
              <p className="text-xs text-gray-500">Goal: 8 glasses</p>
              <Progress 
                value={(todayStats.water / 8) * 100} 
                className="mt-2 h-2 bg-gray-100"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Sleep Duration</CardTitle>
              <Moon className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{todayStats.sleep} hours</div>
              <p className="text-xs text-gray-500">Goal: 8 hours</p>
              <Progress 
                value={(todayStats.sleep / 8) * 100} 
                className="mt-2 h-2 bg-gray-100"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 