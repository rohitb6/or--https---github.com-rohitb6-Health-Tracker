"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, Droplets, Plus, Minus } from "lucide-react"

export default function WaterTracker() {
  const [cups, setCups] = useState(0)
  const [goal, setGoal] = useState(8)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(Math.min(Math.round((cups / goal) * 100), 100))
  }, [cups, goal])

  const addCup = () => {
    setCups((prev) => Math.min(prev + 1, goal))
  }

  const removeCup = () => {
    setCups((prev) => Math.max(prev - 1, 0))
  }

  const handleGoalChange = (value: number[]) => {
    setGoal(value[0])
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
        <h1 className="text-2xl font-bold">Water Intake Tracker</h1>
        <Droplets className="ml-2 h-5 w-5 text-blue-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Water Intake</CardTitle>
            <CardDescription>Track your daily water consumption</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <div
                className="absolute bottom-0 w-full rounded-b-full bg-blue-500 transition-all duration-500 ease-in-out"
                style={{ height: `${progress}%`, opacity: 0.7 }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-3xl font-bold">
                  {cups}/{goal}
                </span>
                <span className="text-sm text-muted-foreground">cups</span>
              </div>
            </div>
            <Progress value={progress} className="w-full h-2 mb-4" />
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={removeCup} disabled={cups === 0}>
                <Minus className="h-4 w-4" />
                <span className="sr-only">Remove cup</span>
              </Button>
              <div className="flex gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-8 rounded-b-lg border ${i < cups ? "bg-blue-500 border-blue-600" : "bg-gray-100 border-gray-200"}`}
                  ></div>
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={addCup} disabled={cups === goal}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add cup</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Water Goal Settings</CardTitle>
            <CardDescription>Customize your daily water intake goal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Daily Goal: {goal} cups</h3>
                <Slider defaultValue={[goal]} max={12} min={1} step={1} onValueChange={handleGoalChange} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 cup</span>
                  <span>12 cups</span>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Water Intake Tips</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Start your day with a glass of water</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Carry a reusable water bottle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Set reminders to drink throughout the day</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Drink a glass of water before each meal</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
