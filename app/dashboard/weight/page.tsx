'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Scale, Trash2 } from "lucide-react";

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  notes: string;
}

export default function WeightTrackerPage() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    notes: ''
  });

  const handleAddEntry = () => {
    if (!newEntry.weight) return;

    const entry: WeightEntry = {
      id: Date.now().toString(),
      date: newEntry.date,
      weight: Number(newEntry.weight),
      notes: newEntry.notes
    };

    setEntries([...entries, entry]);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      notes: ''
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const calculateProgress = () => {
    if (entries.length < 2) return null;

    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstWeight = sortedEntries[0].weight;
    const lastWeight = sortedEntries[sortedEntries.length - 1].weight;
    const difference = lastWeight - firstWeight;
    const percentage = ((difference / firstWeight) * 100).toFixed(1);

    return {
      difference,
      percentage,
      isPositive: difference > 0
    };
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Weight Tracker</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Weight</CardTitle>
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
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter your weight"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about your weight..."
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                />
              </div>

              <Button onClick={handleAddEntry} className="w-full">
                <Scale className="h-4 w-4 mr-2" />
                Log Weight
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {progress ? (
                <div className="space-y-2">
                  <p className="text-lg">
                    {progress.isPositive ? 'Gained' : 'Lost'}: {Math.abs(progress.difference).toFixed(1)} kg
                  </p>
                  <p className="text-lg">
                    Percentage: {progress.isPositive ? '+' : ''}{progress.percentage}%
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Add more entries to see progress</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weight History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entries.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No weight entries logged</p>
                ) : (
                  entries
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{entry.date}</h3>
                          <p className="text-lg font-semibold mt-1">
                            {entry.weight} kg
                          </p>
                          {entry.notes && (
                            <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
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
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 