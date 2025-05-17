'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";

interface SleepEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  quality: string;
  notes: string;
}

export default function SleepTrackerPage() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    quality: '',
    notes: ''
  });

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleAddEntry = () => {
    if (!newEntry.startTime || !newEntry.endTime || !newEntry.quality) return;

    const entry: SleepEntry = {
      id: Date.now().toString(),
      date: newEntry.date,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      quality: newEntry.quality,
      notes: newEntry.notes
    };

    setSleepEntries([...sleepEntries, entry]);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      quality: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sleep Tracker</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Bedtime</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newEntry.startTime}
                    onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Wake-up Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newEntry.endTime}
                    onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">Sleep Quality</Label>
                <Select
                  value={newEntry.quality}
                  onValueChange={(value) => setNewEntry({ ...newEntry, quality: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="How did you sleep? Any dreams or disturbances?"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                />
              </div>

              <Button onClick={handleAddEntry} className="w-full">
                <Moon className="h-4 w-4 mr-2" />
                Log Sleep
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sleepEntries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No sleep entries logged</p>
              ) : (
                sleepEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{entry.date}</h3>
                        <p className="text-sm text-gray-500">
                          {entry.startTime} - {entry.endTime}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          Duration: {calculateDuration(entry.startTime, entry.endTime)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Quality: {entry.quality.charAt(0).toUpperCase() + entry.quality.slice(1)}
                        </p>
                        {entry.notes && (
                          <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 