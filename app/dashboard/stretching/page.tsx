'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Trash2 } from "lucide-react";

interface StretchExercise {
  id: string;
  name: string;
  duration: string;
  difficulty: string;
  notes: string;
}

interface StretchRoutine {
  id: string;
  date: string;
  exercises: StretchExercise[];
  totalDuration: string;
  notes: string;
}

export default function StretchingPage() {
  const [routines, setRoutines] = useState<StretchRoutine[]>([]);
  const [currentRoutine, setCurrentRoutine] = useState<StretchRoutine>({
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    exercises: [],
    totalDuration: '0',
    notes: ''
  });

  const [newExercise, setNewExercise] = useState<StretchExercise>({
    id: '',
    name: '',
    duration: '',
    difficulty: '',
    notes: ''
  });

  const handleAddExercise = () => {
    if (!newExercise.name || !newExercise.duration || !newExercise.difficulty) return;

    const exercise: StretchExercise = {
      id: Date.now().toString(),
      name: newExercise.name,
      duration: newExercise.duration,
      difficulty: newExercise.difficulty,
      notes: newExercise.notes
    };

    setCurrentRoutine({
      ...currentRoutine,
      exercises: [...currentRoutine.exercises, exercise],
      totalDuration: String(Number(currentRoutine.totalDuration) + Number(newExercise.duration))
    });

    setNewExercise({
      id: '',
      name: '',
      duration: '',
      difficulty: '',
      notes: ''
    });
  };

  const handleSaveRoutine = () => {
    if (currentRoutine.exercises.length === 0) return;
    setRoutines([...routines, currentRoutine]);
    setCurrentRoutine({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      exercises: [],
      totalDuration: '0',
      notes: ''
    });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const exercise = currentRoutine.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setCurrentRoutine({
        ...currentRoutine,
        exercises: currentRoutine.exercises.filter(ex => ex.id !== exerciseId),
        totalDuration: String(Number(currentRoutine.totalDuration) - Number(exercise.duration))
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stretching Routine</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Routine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={currentRoutine.date}
                  onChange={(e) => setCurrentRoutine({ ...currentRoutine, date: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Add Exercise</h3>
                <div className="space-y-2">
                  <Label htmlFor="exerciseName">Exercise Name</Label>
                  <Input
                    id="exerciseName"
                    placeholder="e.g., Hamstring Stretch"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Enter duration"
                    value={newExercise.duration}
                    onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={newExercise.difficulty}
                    onValueChange={(value) => setNewExercise({ ...newExercise, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exerciseNotes">Notes</Label>
                  <Textarea
                    id="exerciseNotes"
                    placeholder="Add any notes about the exercise..."
                    value={newExercise.notes}
                    onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                  />
                </div>

                <Button onClick={handleAddExercise} className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="routineNotes">Routine Notes</Label>
                <Textarea
                  id="routineNotes"
                  placeholder="Add any notes about the routine..."
                  value={currentRoutine.notes}
                  onChange={(e) => setCurrentRoutine({ ...currentRoutine, notes: e.target.value })}
                />
              </div>

              <Button 
                onClick={handleSaveRoutine} 
                className="w-full"
                disabled={currentRoutine.exercises.length === 0}
              >
                Save Routine
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Routine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentRoutine.exercises.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No exercises added yet</p>
                ) : (
                  <>
                    {currentRoutine.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{exercise.name}</h3>
                          <p className="text-sm text-gray-500">
                            {exercise.duration} seconds • {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                          </p>
                          {exercise.notes && (
                            <p className="text-sm text-gray-600 mt-1">{exercise.notes}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteExercise(exercise.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <p className="font-medium">
                        Total Duration: {currentRoutine.totalDuration} seconds
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Routines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routines.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No saved routines</p>
                ) : (
                  routines.map((routine) => (
                    <div
                      key={routine.id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <h3 className="font-medium">{routine.date}</h3>
                      <p className="text-sm text-gray-500">
                        {routine.exercises.length} exercises • {routine.totalDuration} seconds total
                      </p>
                      {routine.notes && (
                        <p className="text-sm text-gray-600 mt-1">{routine.notes}</p>
                      )}
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