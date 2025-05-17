'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  notes: string;
}

export default function MealLogPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState({
    name: '',
    time: '',
    calories: '',
    notes: ''
  });

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.time || !newMeal.calories) return;

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      time: newMeal.time,
      calories: Number(newMeal.calories),
      notes: newMeal.notes
    };

    setMeals([...meals, meal]);
    setNewMeal({ name: '', time: '', calories: '', notes: '' });
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meal Log</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Meal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mealName">Meal Name</Label>
                <Input
                  id="mealName"
                  placeholder="e.g., Breakfast, Lunch, Dinner"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealTime">Time</Label>
                <Input
                  id="mealTime"
                  type="time"
                  value={newMeal.time}
                  onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="Enter calories"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about your meal..."
                  value={newMeal.notes}
                  onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                />
              </div>

              <Button onClick={handleAddMeal} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Meal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meals.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No meals logged today</p>
              ) : (
                <>
                  {meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{meal.name}</h3>
                        <p className="text-sm text-gray-500">
                          {meal.time} • {meal.calories} calories
                        </p>
                        {meal.notes && (
                          <p className="text-sm text-gray-600 mt-1">{meal.notes}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMeal(meal.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <p className="font-medium">
                      Total Calories: {totalCalories}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 