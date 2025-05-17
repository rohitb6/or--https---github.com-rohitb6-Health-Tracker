"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, Heart } from "lucide-react"

const moodEmojis = [
  { emoji: "😢", label: "Sad", color: "bg-blue-100" },
  { emoji: "😔", label: "Down", color: "bg-blue-200" },
  { emoji: "😐", label: "Neutral", color: "bg-gray-100" },
  { emoji: "🙂", label: "Good", color: "bg-green-100" },
  { emoji: "😄", label: "Great", color: "bg-green-200" },
]

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [moodHistory, setMoodHistory] = useState<Record<string, number>>({
    "2024-05-10": 4,
    "2024-05-11": 3,
    "2024-05-12": 2,
    "2024-05-13": 4,
    "2024-05-14": 3,
    "2024-05-15": 1,
    "2024-05-16": 0,
  })

  const handleMoodSelect = (index: number) => {
    setSelectedMood(index)
    if (date) {
      const dateString = date.toISOString().split("T")[0]
      setMoodHistory((prev) => ({ ...prev, [dateString]: index }))
    }
  }

  const getDayColor = (day: Date) => {
    const dateString = day.toISOString().split("T")[0]
    const mood = moodHistory[dateString]

    if (mood !== undefined) {
      return moodEmojis[mood].color
    }
    return undefined
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
        <h1 className="text-2xl font-bold">Mood Tracker</h1>
        <Heart className="ml-2 h-5 w-5 text-rose-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardDescription>Select the emoji that best represents your mood</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-6">
              {moodEmojis.map((mood, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-16 w-16 text-3xl ${selectedMood === index ? "ring-2 ring-primary" : ""}`}
                  onClick={() => handleMoodSelect(index)}
                >
                  {mood.emoji}
                  <span className="sr-only">{mood.label}</span>
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-center text-muted-foreground">
              {moodEmojis.map((mood, index) => (
                <span key={index} className="w-16">
                  {mood.label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Calendar</CardTitle>
            <CardDescription>View your mood history on the calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                booked: (date) => {
                  const dateString = date.toISOString().split("T")[0]
                  return dateString in moodHistory
                },
              }}
              modifiersStyles={{
                booked: { fontWeight: "bold" },
              }}
              styles={{
                day: (day) => ({
                  backgroundColor: getDayColor(day),
                }),
              }}
            />
            <div className="mt-4 flex justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-100 mr-2"></div>
                <span className="text-xs">Sad</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-200 mr-2"></div>
                <span className="text-xs">Down</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-100 mr-2"></div>
                <span className="text-xs">Neutral</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-100 mr-2"></div>
                <span className="text-xs">Good</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-200 mr-2"></div>
                <span className="text-xs">Great</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
