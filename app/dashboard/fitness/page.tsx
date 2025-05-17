'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer, Dumbbell, Trash2 } from "lucide-react";

interface Workout {
  id: string;
  date: string;
  type: string;
  duration: string;
  intensity: string;
  notes: string;
}

export default function FitnessPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: '',
    intensity: '',
    notes: ''
  });

  const handleAddWorkout = () => {
    if (!newWorkout.type || !newWorkout.duration || !newWorkout.intensity) return;

    const workout: Workout = {
      id: Date.now().toString(),
      date: newWorkout.date,
      type: newWorkout.type,
      duration: newWorkout.duration,
      intensity: newWorkout.intensity,
      notes: newWorkout.notes
    };

    setWorkouts([...workouts, workout]);
    setNewWorkout({
      date: new Date().toISOString().split('T')[0],
      type: '',
      duration: '',
      intensity: '',
      notes: ''
    });
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fitness Tracker</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newWorkout.date}
                  onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Workout Type</Label>
                <Select
                  value={newWorkout.type}
                  onValueChange={(value) => setNewWorkout({ ...newWorkout, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="hiit">HIIT</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="Enter duration"
                  value={newWorkout.duration}
                  onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity">Intensity</Label>
                <Select
                  value={newWorkout.intensity}
                  onValueChange={(value) => setNewWorkout({ ...newWorkout, intensity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about your workout..."
                  value={newWorkout.notes}
                  onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                />
              </div>

              <Button onClick={handleAddWorkout} className="w-full">
                <Dumbbell className="h-4 w-4 mr-2" />
                Log Workout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workouts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No workouts logged</p>
              ) : (
                workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{workout.date}</h3>
                      <p className="text-sm text-gray-500">
                        {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)} • {workout.duration} minutes
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Intensity: {workout.intensity.charAt(0).toUpperCase() + workout.intensity.slice(1)}
                      </p>
                      {workout.notes && (
                        <p className="text-sm text-gray-600 mt-1">{workout.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWorkout(workout.id)}
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
  );
} 