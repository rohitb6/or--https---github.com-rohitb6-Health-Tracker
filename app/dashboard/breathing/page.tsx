'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";

const BREATHING_PATTERNS = [
  { name: 'Calm', inhale: 4, hold: 4, exhale: 4, holdAfter: 0 },
  { name: 'Relax', inhale: 4, hold: 7, exhale: 8, holdAfter: 0 },
  { name: 'Energize', inhale: 4, hold: 0, exhale: 4, holdAfter: 0 },
  { name: 'Focus', inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
];

export default function BreathingExercise() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPattern, setCurrentPattern] = useState(BREATHING_PATTERNS[0]);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfter'>('inhale');
  const [timeLeft, setTimeLeft] = useState(currentPattern.inhale);
  const [cycleCount, setCycleCount] = useState(0);
  const [breathSize, setBreathSize] = useState(50);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      // Move to next phase
      switch (currentPhase) {
        case 'inhale':
          if (currentPattern.hold > 0) {
            setCurrentPhase('hold');
            setTimeLeft(currentPattern.hold);
          } else {
            setCurrentPhase('exhale');
            setTimeLeft(currentPattern.exhale);
          }
          break;
        case 'hold':
          setCurrentPhase('exhale');
          setTimeLeft(currentPattern.exhale);
          break;
        case 'exhale':
          if (currentPattern.holdAfter > 0) {
            setCurrentPhase('holdAfter');
            setTimeLeft(currentPattern.holdAfter);
          } else {
            setCurrentPhase('inhale');
            setTimeLeft(currentPattern.inhale);
            setCycleCount((prev) => prev + 1);
          }
          break;
        case 'holdAfter':
          setCurrentPhase('inhale');
          setTimeLeft(currentPattern.inhale);
          setCycleCount((prev) => prev + 1);
          break;
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, currentPhase, currentPattern]);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhase('inhale');
    setTimeLeft(currentPattern.inhale);
    setCycleCount(0);
  };

  const handlePatternChange = (pattern: typeof BREATHING_PATTERNS[0]) => {
    setCurrentPattern(pattern);
    setCurrentPhase('inhale');
    setTimeLeft(pattern.inhale);
    setCycleCount(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Breathing Exercise</h1>
        <div className="flex gap-2">
          {!isPlaying ? (
            <Button onClick={handleStart}>
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Breathing Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {BREATHING_PATTERNS.map((pattern) => (
                  <Button
                    key={pattern.name}
                    variant={currentPattern.name === pattern.name ? "default" : "outline"}
                    onClick={() => handlePatternChange(pattern)}
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <span className="text-lg font-medium">{pattern.name}</span>
                    <span className="text-sm text-gray-500">
                      {pattern.inhale}-{pattern.hold}-{pattern.exhale}
                      {pattern.holdAfter > 0 ? `-${pattern.holdAfter}` : ''}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <div
                  className="w-48 h-48 rounded-full bg-blue-500 transition-all duration-1000 ease-in-out"
                  style={{
                    transform: `scale(${
                      currentPhase === 'inhale'
                        ? 1 + breathSize / 100
                        : currentPhase === 'exhale'
                        ? 1
                        : 1 + (breathSize / 100) * 0.5
                    })`,
                    opacity: currentPhase === 'hold' || currentPhase === 'holdAfter' ? 0.7 : 1,
                  }}
                />
                <div className="mt-4 text-2xl font-medium">
                  {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
                </div>
                <div className="text-4xl font-bold mt-2">{timeLeft}s</div>
                <div className="text-gray-500 mt-2">Cycle {cycleCount + 1}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Breath Size</label>
                <Slider
                  value={[breathSize]}
                  onValueChange={(value) => setBreathSize(value[0])}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Follow the breathing pattern shown in the circle. The circle will expand as you inhale and contract as you exhale.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Pattern Guide:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Calm: 4-4-4 (Balanced breathing)</li>
                  <li>Relax: 4-7-8 (Deep relaxation)</li>
                  <li>Energize: 4-0-4 (Quick energy)</li>
                  <li>Focus: 4-4-4-4 (Enhanced focus)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Tips:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Find a quiet, comfortable place</li>
                  <li>Sit with a straight back</li>
                  <li>Breathe through your nose</li>
                  <li>Focus on the movement of your breath</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 