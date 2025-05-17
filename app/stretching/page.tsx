"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, ChevronLeft, GripVertical, Play, Pause, RotateCcw } from "lucide-react"

type StretchExercise = {
  id: string
  name: string
  duration: number
  description: string
  completed: boolean
}

export default function StretchSequence() {
  const [exercises, setExercises] = useState<StretchExercise[]>([
    {
      id: "1",
      name: "Neck Stretch",
      duration: 30,
      description: "Gently tilt your head to each side, holding for 5 seconds",
      completed: false,
    },
    {
      id: "2",
      name: "Shoulder Rolls",
      duration: 45,
      description: "Roll your shoulders forward and backward in circular motions",
      completed: false,
    },
    {
      id: "3",
      name: "Quad Stretch",
      duration: 60,
      description: "Stand on one leg, grab your ankle and pull gently toward your buttocks",
      completed: false,
    },
    {
      id: "4",
      name: "Hamstring Stretch",
      duration: 60,
      description: "Sit with one leg extended, reach toward your toes",
      completed: false,
    },
    {
      id: "5",
      name: "Child's Pose",
      duration: 45,
      description: "Kneel and extend arms forward, lowering chest to ground",
      completed: false,
    },
  ])

  const [activeExercise, setActiveExercise] = useState<StretchExercise | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [draggedExercise, setDraggedExercise] = useState<StretchExercise | null>(null)

  const startExerciseTimer = (exercise: StretchExercise) => {
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

  const markExerciseComplete = (exerciseId: string) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return { ...exercise, completed: true }
        }
        return exercise
      }),
    )

    setIsActive(false)
    setActiveExercise(null)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive && activeExercise) {
      setIsActive(false)
      markExerciseComplete(activeExercise.id)
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

  const handleDragStart = (exercise: StretchExercise) => {
    setDraggedExercise(exercise)
  }

  const handleDragOver = (e: React.DragEvent, targetExercise: StretchExercise) => {
    e.preventDefault()
    if (!draggedExercise || draggedExercise.id === targetExercise.id) return
  }

  const handleDrop = (targetExercise: StretchExercise) => {
    if (!draggedExercise || draggedExercise.id === targetExercise.id) return

    const draggedIndex = exercises.findIndex((ex) => ex.id === draggedExercise.id)
    const targetIndex = exercises.findIndex((ex) => ex.id === targetExercise.id)

    const newExercises = [...exercises]
    const [removed] = newExercises.splice(draggedIndex, 1)
    newExercises.splice(targetIndex, 0, removed)

    setExercises(newExercises)
    setDraggedExercise(null)
  }

  const calculateProgress = () => {
    const completed = exercises.filter((e) => e.completed).length
    return Math.round((completed / exercises.length) * 100)
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
        <h1 className="text-2xl font-bold">Stretch Sequence</h1>
        <Activity className="ml-2 h-5 w-5 text-purple-500" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daily Stretching Routine</CardTitle>
              <CardDescription>Drag to reorder exercises to your preference</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="font-medium">{calculateProgress()}%</div>
            </div>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`p-4 border rounded-lg ${exercise.completed ? "bg-muted" : ""} ${activeExercise?.id === exercise.id ? "ring-2 ring-primary" : ""}`}
                draggable
                onDragStart={() => handleDragStart(exercise)}
                onDragOver={(e) => handleDragOver(e, exercise)}
                onDrop={() => handleDrop(exercise)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <div>
                      <h3 className={`font-medium ${exercise.completed ? "line-through text-muted-foreground" : ""}`}>
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{formatTime(exercise.duration)}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={exercise.completed}
                      onClick={() => startExerciseTimer(exercise)}
                    >
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
                    <Progress value={(timeLeft / activeExercise.duration) * 100} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
