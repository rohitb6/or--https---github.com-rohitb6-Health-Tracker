'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Trash2 } from "lucide-react";

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  activities: string[];
  thoughts: string;
  gratitude: string[];
}

export default function MentalHealthPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState<JournalEntry>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    mood: '',
    activities: [],
    thoughts: '',
    gratitude: []
  });

  const [newActivity, setNewActivity] = useState('');
  const [newGratitude, setNewGratitude] = useState('');

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    setNewEntry({
      ...newEntry,
      activities: [...newEntry.activities, newActivity.trim()]
    });
    setNewActivity('');
  };

  const handleAddGratitude = () => {
    if (!newGratitude.trim()) return;
    setNewEntry({
      ...newEntry,
      gratitude: [...newEntry.gratitude, newGratitude.trim()]
    });
    setNewGratitude('');
  };

  const handleSaveEntry = () => {
    if (!newEntry.mood || !newEntry.thoughts) return;

    const entry: JournalEntry = {
      ...newEntry,
      id: Date.now().toString()
    };

    setEntries([...entries, entry]);
    setNewEntry({
      id: '',
      date: new Date().toISOString().split('T')[0],
      mood: '',
      activities: [],
      thoughts: '',
      gratitude: []
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mental Health Journal</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Journal Entry</CardTitle>
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

              <div className="space-y-2">
                <Label htmlFor="mood">How are you feeling?</Label>
                <Select
                  value={newEntry.mood}
                  onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="great">Great</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="anxious">Anxious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Activities</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an activity..."
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                  />
                  <Button onClick={handleAddActivity}>Add</Button>
                </div>
                {newEntry.activities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEntry.activities.map((activity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="thoughts">Thoughts & Reflections</Label>
                <Textarea
                  id="thoughts"
                  placeholder="How was your day? What's on your mind?"
                  value={newEntry.thoughts}
                  onChange={(e) => setNewEntry({ ...newEntry, thoughts: e.target.value })}
                  className="h-32"
                />
              </div>

              <div className="space-y-2">
                <Label>Gratitude List</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="What are you grateful for?"
                    value={newGratitude}
                    onChange={(e) => setNewGratitude(e.target.value)}
                  />
                  <Button onClick={handleAddGratitude}>Add</Button>
                </div>
                {newEntry.gratitude.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEntry.gratitude.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={handleSaveEntry} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Journal History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No journal entries yet</p>
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{entry.date}</h3>
                        <p className="text-sm text-gray-500">
                          Mood: {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                        </p>
                        {entry.activities.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Activities:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {entry.activities.map((activity, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-200 rounded-full text-sm"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-sm mt-2">{entry.thoughts}</p>
                        {entry.gratitude.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Gratitude:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {entry.gratitude.map((item, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-200 rounded-full text-sm"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
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