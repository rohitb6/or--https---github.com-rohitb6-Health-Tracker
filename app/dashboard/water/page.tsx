'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets } from "lucide-react";

const CUP_SIZES = [
  { amount: 250, label: 'Small (250ml)' },
  { amount: 500, label: 'Medium (500ml)' },
  { amount: 750, label: 'Large (750ml)' },
];

const DAILY_GOAL = 2000; // 2 liters

export default function WaterTracker() {
  const [todayIntake, setTodayIntake] = useState<number>(0);
  const [intakeHistory, setIntakeHistory] = useState<{ date: string; amount: number }[]>([]);
  const [selectedCup, setSelectedCup] = useState<number>(CUP_SIZES[1].amount);

  useEffect(() => {
    // Load today's intake from localStorage
    const savedIntake = localStorage.getItem('waterIntake');
    if (savedIntake) {
      setTodayIntake(parseInt(savedIntake));
    }

    // Load intake history from localStorage
    const savedHistory = localStorage.getItem('waterHistory');
    if (savedHistory) {
      setIntakeHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addWater = (amount: number) => {
    const newIntake = todayIntake + amount;
    setTodayIntake(newIntake);
    localStorage.setItem('waterIntake', newIntake.toString());

    // Update history
    const today = new Date().toISOString().split('T')[0];
    const newHistory = [...intakeHistory];
    const todayIndex = newHistory.findIndex(entry => entry.date === today);
    
    if (todayIndex >= 0) {
      newHistory[todayIndex].amount = newIntake;
    } else {
      newHistory.push({ date: today, amount: newIntake });
    }
    
    setIntakeHistory(newHistory);
    localStorage.setItem('waterHistory', JSON.stringify(newHistory));
  };

  const resetDaily = () => {
    setTodayIntake(0);
    localStorage.setItem('waterIntake', '0');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Water Intake Tracker</h1>
        <Button variant="outline" onClick={resetDaily}>
          Reset Daily
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold">{todayIntake}ml</span>
                </div>
                <span className="text-gray-500">Goal: {DAILY_GOAL}ml</span>
              </div>
              <Progress value={(todayIntake / DAILY_GOAL) * 100} className="h-2" />
              <div className="text-sm text-gray-500">
                {Math.round((todayIntake / DAILY_GOAL) * 100)}% of daily goal
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Water</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {CUP_SIZES.map((cup) => (
                  <Button
                    key={cup.amount}
                    variant={selectedCup === cup.amount ? "default" : "outline"}
                    className="h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => {
                      setSelectedCup(cup.amount);
                      addWater(cup.amount);
                    }}
                  >
                    <Droplets className="h-6 w-6" />
                    <span className="text-sm">{cup.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {intakeHistory.slice(-7).map((entry) => (
              <div key={entry.date} className="flex items-center justify-between">
                <span className="text-gray-500">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>{entry.amount}ml</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 