"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Play, Pause, RotateCcw, Timer } from "lucide-react"

type Exercise = {
  id: string
  name: string
  duration: number
  completed: boolean
}

type Workout = {
  id: string
  name: string
  exercises: Exercise[]
}

export default function FitnessRoutine() {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: "1",
      name: "Upper Body",
      exercises: [
        { id: "1-1", name: "Push-ups", duration: 60, completed: false },
        { id: "1-2", name: "Dumbbell Rows", duration: 45, completed: false },
        { id: "1-3", name: "Shoulder Press", duration: 45, completed: false },
        { id: "1-4", name: "Bicep Curls", duration: 30, completed: false },
        { id: "1-5", name: "Tricep Extensions", duration: 30, completed: false },
      ],
    },
    {
      id: "2",
      name: "Lower Body",
      exercises: [
        { id: "2-1", name: "Squats", duration: 60, completed: false },
        { id: "2-2", name: "Lunges", duration: 45, completed: false },
        { id: "2-3", name: "Calf Raises", duration: 30, completed: false },
        { id: "2-4", name: "Glute Bridges", duration: 45, completed: false },
        { id: "2-5", name: "Leg Raises", duration: 30, completed: false },
      ],
    },
    {
      id: "3",
      name: "Core",
      exercises: [
        { id: "3-1", name: "Plank", duration: 60, completed: false },
        { id: "3-2", name: "Crunches", duration: 45, completed: false },
        { id: "3-3", name: "Russian Twists", duration: 30, completed: false },
        { id: "3-4", name: "Mountain Climbers", duration: 45, completed: false },
        { id: "3-5", name: "Leg Raises", duration: 30, completed: false },
      ],
    },
  ])

  const [activeTab, setActiveTab] = useState("1")
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const activeWorkout = workouts.find((w) => w.id === activeTab) || workouts[0]

  const toggleExerciseComplete = (exerciseId: string) => {
    setWorkouts(
      workouts.map((workout) => {
        if (workout.id === activeTab) {
          return {
            ...workout,
            exercises: workout.exercises.map((exercise) => {
              if (exercise.id === exerciseId) {
                return { ...exercise, completed: !exercise.completed }
              }
              return exercise
            }),
          }
        }
        return workout
      }),
    )
  }

  const startExerciseTimer = (exercise: Exercise) => {
    if (isActive && activeExercise?.id === exercise.id) {
      // Pause the timer
      setIsActive(false)
      return
    }

    setActiveExercise(exercise)
    setTimeLeft(exercise.duration)
    setIsActive(true)
  }

  const resetTimer = () => {
    if (!activeExercise) return
    setTimeLeft(activeExercise.duration)
    setIsActive(false)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive && activeExercise) {
      setIsActive(false)
      toggleExerciseComplete(activeExercise.id)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, activeExercise])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const calculateProgress = (workout: Workout) => {
    const completed = workout.exercises.filter((e) => e.completed).length
    return Math.round((completed / workout.exercises.length) * 100)
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
        <h1 className="text-2xl font-bold">Fitness Routine</h1>
        <Timer className="ml-2 h-5 w-5 text-orange-500" />
      </div>

      <Tabs defaultValue="1" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {workouts.map((workout) => (
            <TabsTrigger key={workout.id} value={workout.id}>
              {workout.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {workouts.map((workout) => (
          <TabsContent key={workout.id} value={workout.id} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{workout.name} Workout</CardTitle>
                    <CardDescription>Complete all exercises in order</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Progress</div>
                    <div className="font-medium">{calculateProgress(workout)}%</div>
                  </div>
                </div>
                <Progress value={calculateProgress(workout)} className="h-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workout.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className={`p-4 border rounded-lg ${exercise.completed ? "bg-muted" : ""} ${activeExercise?.id === exercise.id ? "ring-2 ring-primary" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={exercise.id}
                            checked={exercise.completed}
                            onCheckedChange={() => toggleExerciseComplete(exercise.id)}
                          />
                          <label
                            htmlFor={exercise.id}
                            className={`font-medium ${exercise.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {exercise.name}
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{formatTime(exercise.duration)}</span>
                          <Button variant="outline" size="icon" onClick={() => startExerciseTimer(exercise)}>
                            {isActive && activeExercise?.id === exercise.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {activeExercise?.id === exercise.id && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Time Remaining</span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
                              <Button variant="ghost" size="icon" onClick={resetTimer}>
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Progress value={(timeLeft / exercise.duration) * 100} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
