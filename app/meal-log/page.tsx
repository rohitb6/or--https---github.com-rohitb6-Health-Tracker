"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Plus, Salad, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type Meal = {
  id: string
  name: string
  calories: number
  type: "breakfast" | "lunch" | "dinner" | "snack"
  time: string
}

export default function MealLog() {
  const [meals, setMeals] = useState<Meal[]>([
    { id: "1", name: "Oatmeal with berries", calories: 320, type: "breakfast", time: "08:00" },
    { id: "2", name: "Chicken salad", calories: 450, type: "lunch", time: "12:30" },
    { id: "3", name: "Apple", calories: 80, type: "snack", time: "15:00" },
  ])

  const [newMeal, setNewMeal] = useState<Omit<Meal, "id">>({
    name: "",
    calories: 0,
    type: "breakfast",
    time: "",
  })

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
  const calorieGoal = 2200
  const caloriesRemaining = calorieGoal - totalCalories
  const progress = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100)

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.calories || !newMeal.time) return

    setMeals([
      ...meals,
      {
        ...newMeal,
        id: Date.now().toString(),
      },
    ])

    setNewMeal({
      name: "",
      calories: 0,
      type: "breakfast",
      time: "",
    })
  }

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter((meal) => meal.id !== id))
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Meal Log</h1>
        <Salad className="ml-2 h-5 w-5 text-green-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Calories</CardTitle>
            <CardDescription>Track your daily calorie intake</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-muted-foreground">Consumed</p>
                  <p className="text-3xl font-bold">{totalCalories}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className={`text-3xl font-bold ${caloriesRemaining < 0 ? "text-red-500" : ""}`}>
                    {caloriesRemaining}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Goal: {calorieGoal} calories</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Breakfast</p>
                  <p className="font-medium">
                    {meals.filter((m) => m.type === "breakfast").reduce((sum, m) => sum + m.calories, 0)} cal
                  </p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Lunch</p>
                  <p className="font-medium">
                    {meals.filter((m) => m.type === "lunch").reduce((sum, m) => sum + m.calories, 0)} cal
                  </p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Dinner</p>
                  <p className="font-medium">
                    {meals.filter((m) => m.type === "dinner").reduce((sum, m) => sum + m.calories, 0)} cal
                  </p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Snacks</p>
                  <p className="font-medium">
                    {meals.filter((m) => m.type === "snack").reduce((sum, m) => sum + m.calories, 0)} cal
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Meal</CardTitle>
            <CardDescription>Log what you've eaten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  placeholder="e.g., Chicken Salad"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="e.g., 350"
                    value={newMeal.calories || ""}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newMeal.time}
                    onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select
                  value={newMeal.type}
                  onValueChange={(value: "breakfast" | "lunch" | "dinner" | "snack") =>
                    setNewMeal({ ...newMeal, type: value })
                  }
                >
                  <SelectTrigger id="meal-type">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddMeal} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
          <CardDescription>A log of all your meals today</CardDescription>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No meals logged yet today</p>
          ) : (
            <div className="space-y-4">
              {meals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-2 h-full min-h-[40px] rounded-full
                      ${
                        meal.type === "breakfast"
                          ? "bg-yellow-500"
                          : meal.type === "lunch"
                            ? "bg-green-500"
                            : meal.type === "dinner"
                              ? "bg-purple-500"
                              : "bg-blue-500"
                      }
                    `}
                    ></div>
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <div className="flex text-sm text-muted-foreground">
                        <span className="capitalize">{meal.type}</span>
                        <span className="mx-2">•</span>
                        <span>{meal.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">{meal.calories} cal</p>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMeal(meal.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
