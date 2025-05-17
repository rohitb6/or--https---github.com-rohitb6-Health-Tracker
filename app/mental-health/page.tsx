"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CalendarIcon, ChevronLeft, Heart, Plus } from "lucide-react"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
  ChartArea,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
} from "@/components/ui/chart"

type JournalEntry = {
  id: string
  date: Date
  content: string
  mood: number
  tags: string[]
}

export default function MentalHealthJournal() {
  const [date, setDate] = useState<Date>(new Date())
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      date: new Date(2024, 4, 10),
      content: "Feeling good today. Had a productive morning and enjoyed lunch with friends.",
      mood: 4,
      tags: ["productive", "social"],
    },
    {
      id: "2",
      date: new Date(2024, 4, 11),
      content: "Stressed about work deadline. Need to practice more self-care.",
      mood: 2,
      tags: ["work", "stress"],
    },
    {
      id: "3",
      date: new Date(2024, 4, 12),
      content: "Went for a long walk and felt much better afterward. Nature helps!",
      mood: 3,
      tags: ["exercise", "nature"],
    },
    {
      id: "4",
      date: new Date(2024, 4, 13),
      content: "Great day! Finished a big project and celebrated with friends.",
      mood: 5,
      tags: ["accomplishment", "celebration"],
    },
    {
      id: "5",
      date: new Date(2024, 4, 14),
      content: "Feeling a bit down today. Weather is gloomy and affecting my mood.",
      mood: 2,
      tags: ["weather", "mood"],
    },
    {
      id: "6",
      date: new Date(2024, 4, 15),
      content: "Meditation session helped me feel centered. Need to do this more often.",
      mood: 4,
      tags: ["meditation", "mindfulness"],
    },
    {
      id: "7",
      date: new Date(2024, 4, 16),
      content: "Average day. Nothing special happened but feeling content.",
      mood: 3,
      tags: ["routine"],
    },
  ])

  const [newEntry, setNewEntry] = useState<Omit<JournalEntry, "id">>({
    date: new Date(),
    content: "",
    mood: 3,
    tags: [],
  })

  const [newTag, setNewTag] = useState("")

  const currentEntry = entries.find((entry) => entry.date.toDateString() === date.toDateString())

  const addTag = () => {
    if (!newTag.trim()) return

    if (!newEntry.tags.includes(newTag.trim().toLowerCase())) {
      setNewEntry({
        ...newEntry,
        tags: [...newEntry.tags, newTag.trim().toLowerCase()],
      })
    }

    setNewTag("")
  }

  const removeTag = (tagToRemove: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const saveEntry = () => {
    if (!newEntry.content.trim()) return

    if (currentEntry) {
      // Update existing entry
      setEntries(
        entries.map((entry) =>
          entry.id === currentEntry.id
            ? { ...entry, content: newEntry.content, mood: newEntry.mood, tags: newEntry.tags }
            : entry,
        ),
      )
    } else {
      // Add new entry
      setEntries([
        ...entries,
        {
          id: Date.now().toString(),
          date: date,
          content: newEntry.content,
          mood: newEntry.mood,
          tags: newEntry.tags,
        },
      ])
    }

    // Reset form
    setNewEntry({
      date: date,
      content: "",
      mood: 3,
      tags: [],
    })
  }

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return

    setDate(newDate)

    const existingEntry = entries.find((entry) => entry.date.toDateString() === newDate.toDateString())

    if (existingEntry) {
      setNewEntry({
        date: existingEntry.date,
        content: existingEntry.content,
        mood: existingEntry.mood,
        tags: existingEntry.tags,
      })
    } else {
      setNewEntry({
        date: newDate,
        content: "",
        mood: 3,
        tags: [],
      })
    }
  }

  // Prepare data for mood chart
  const chartData = entries
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((entry) => ({
      date: entry.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      mood: entry.mood,
    }))

  return (
    <div className="container py-6 md:py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Mental Health Journal</h1>
        <Heart className="ml-2 h-5 w-5 text-pink-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mood Trends</CardTitle>
            <CardDescription>Track your mood patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Chart data={chartData} valueFormatter={(value) => `Mood: ${value}`}>
                <ChartContainer>
                  <ChartTooltip>
                    <ChartTooltipContent>
                      <ChartTooltipItem />
                    </ChartTooltipContent>
                  </ChartTooltip>
                  <ChartYAxis min={1} max={5} />
                  <ChartXAxis dataKey="date" />
                  <ChartArea>
                    <ChartLine dataKey="mood" strokeWidth={2} stroke="#ec4899" />
                  </ChartArea>
                </ChartContainer>
              </Chart>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="text-sm text-muted-foreground">1 - Poor</div>
              <div className="text-sm text-muted-foreground">5 - Excellent</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Journal Calendar</CardTitle>
            <CardDescription>Select a date to view or add an entry</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="rounded-md border"
              modifiers={{
                booked: (date) => {
                  return entries.some((entry) => entry.date.toDateString() === date.toDateString())
                },
              }}
              modifiersStyles={{
                booked: { fontWeight: "bold" },
              }}
            />

            <div className="mt-4">
              <h3 className="font-medium mb-2">Common Tags</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(entries.flatMap((entry) => entry.tags)))
                  .slice(0, 8)
                  .map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Journal Entry</CardTitle>
              <CardDescription>
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{currentEntry ? "Edit Entry" : "New Entry"}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">How are you feeling today?</h3>
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    variant="outline"
                    size="icon"
                    className={`h-10 w-10 ${newEntry.mood === rating ? "bg-pink-100 border-pink-500" : ""}`}
                    onClick={() => setNewEntry({ ...newEntry, mood: rating })}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1 mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Journal Entry</h3>
              <Textarea
                placeholder="Write about your day, thoughts, feelings..."
                className="min-h-[150px]"
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex gap-2 mb-2">
                {newEntry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button variant="outline" size="icon" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add Tag</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveEntry} disabled={!newEntry.content.trim()} className="w-full">
            {currentEntry ? "Update Entry" : "Save Entry"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
