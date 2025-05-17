'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';

const moods = [
  { emoji: '😊', label: 'Happy', color: 'bg-green-100' },
  { emoji: '😌', label: 'Calm', color: 'bg-blue-100' },
  { emoji: '😐', label: 'Neutral', color: 'bg-gray-100' },
  { emoji: '😔', label: 'Sad', color: 'bg-purple-100' },
  { emoji: '😡', label: 'Angry', color: 'bg-red-100' },
  { emoji: '😰', label: 'Anxious', color: 'bg-yellow-100' },
];

export default function MoodTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<Record<string, string>>({});

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setMoodHistory(prev => ({
      ...prev,
      [dateKey]: mood
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mood Tracker</h1>
        <p className="text-gray-500">
          {format(selectedDate, 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {moods.map((mood) => (
                <Button
                  key={mood.label}
                  variant="outline"
                  className={`h-24 flex flex-col items-center justify-center gap-2 ${
                    selectedMood === mood.emoji ? mood.color : ''
                  }`}
                  onClick={() => handleMoodSelect(mood.emoji)}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-sm">{mood.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                happy: (date) => moodHistory[format(date, 'yyyy-MM-dd')] === '😊',
                calm: (date) => moodHistory[format(date, 'yyyy-MM-dd')] === '😌',
                neutral: (date) => moodHistory[format(date, 'yyyy-MM-dd')] === '😐',
                sad: (date) => moodHistory[format(date, 'yyyy-MM-dd')] === '😔',
                angry: (date) => moodHistory[format(date, 'yyyy-MM-dd')] === '😡',
                anxious: (date) => moodHistory[format(date, 'yyyy-MM-dd')] === '😰',
              }}
              modifiersStyles={{
                happy: { backgroundColor: '#dcfce7' },
                calm: { backgroundColor: '#dbeafe' },
                neutral: { backgroundColor: '#f3f4f6' },
                sad: { backgroundColor: '#f3e8ff' },
                angry: { backgroundColor: '#fee2e2' },
                anxious: { backgroundColor: '#fef9c3' },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mood Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(moodHistory).map(([date, mood]) => (
              <div key={date} className="flex items-center gap-4">
                <span className="text-gray-500">{format(new Date(date), 'MMMM d, yyyy')}</span>
                <span className="text-2xl">{mood}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 