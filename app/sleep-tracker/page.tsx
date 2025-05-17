"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Moon } from "lucide-react"
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
  ChartBar,
} from "@/components/ui/chart"

type SleepRecord = {
  date: string
  hours: number
  quality: number
  bedtime: string
  wakeup: string
}

export default function SleepTracker() {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([
    { date: "May 10", hours: 7.5, quality: 4, bedtime: "23:30", wakeup: "07:00" },
    { date: "May 11", hours: 6.2, quality: 3, bedtime: "00:15", wakeup: "06:30" },
    { date: "May 12", hours: 8.0, quality: 5, bedtime: "22:45", wakeup: "06:45" },
    { date: "May 13", hours: 7.0, quality: 4, bedtime: "23:00", wakeup: "06:00" },
    { date: "May 14", hours: 6.5, quality: 3, bedtime: "23:45", wakeup: "06:15" },
    { date: "May 15", hours: 7.8, quality: 4, bedtime: "22:30", wakeup: "06:20" },
    { date: "May 16", hours: 8.2, quality: 5, bedtime: "22:15", wakeup: "06:30" },
  ])

  const [newRecord, setNewRecord] = useState<Omit<SleepRecord, "date">>({
    hours: 0,
    quality: 3,
    bedtime: "",
    wakeup: "",
  })

  const averageSleep =
    sleepRecords.length > 0
      ? (sleepRecords.reduce((sum, record) => sum + record.hours, 0) / sleepRecords.length).toFixed(1)
      : "0.0"

  const calculateSleepHours = () => {
    if (!newRecord.bedtime || !newRecord.wakeup) return 0

    const [bedHours, bedMinutes] = newRecord.bedtime.split(":").map(Number)
    const [wakeHours, wakeMinutes] = newRecord.wakeup.split(":").map(Number)

    let totalHours = wakeHours - bedHours
    let totalMinutes = wakeMinutes - bedMinutes

    if (totalHours < 0) totalHours += 24
    if (totalMinutes < 0) {
      totalMinutes += 60
      totalHours -= 1
    }

    return Number.parseFloat((totalHours + totalMinutes / 60).toFixed(1))
  }

  const handleTimeChange = (field: "bedtime" | "wakeup", value: string) => {
    setNewRecord((prev) => {
      const updated = { ...prev, [field]: value }

      if (updated.bedtime && updated.wakeup) {
        updated.hours = calculateSleepHours()
      }

      return updated
    })
  }

  const handleAddRecord = () => {
    if (!newRecord.bedtime || !newRecord.wakeup) return

    const today = new Date()
    const formattedDate = `${today.toLocaleString("default", { month: "short" })} ${today.getDate()}`

    setSleepRecords([...sleepRecords, { ...newRecord, date: formattedDate }])

    setNewRecord({
      hours: 0,
      quality: 3,
      bedtime: "",
      wakeup: "",
    })
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
        <h1 className="text-2xl font-bold">Sleep Tracker</h1>
        <Moon className="ml-2 h-5 w-5 text-indigo-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sleep History</CardTitle>
            <CardDescription>Your recent sleep patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Chart data={sleepRecords} valueFormatter={(value) => `${value} hrs`}>
                <ChartContainer>
                  <ChartTooltip>
                    <ChartTooltipContent>
                      <ChartTooltipItem />
                    </ChartTooltipContent>
                  </ChartTooltip>
                  <ChartYAxis min={0} max={10} />
                  <ChartXAxis dataKey="date" />
                  <ChartArea>
                    <ChartLine dataKey="hours" strokeWidth={2} stroke="#818cf8" />
                    <ChartBar dataKey="hours" fill="#818cf8" fillOpacity={0.2} radius={4} />
                  </ChartArea>
                </ChartContainer>
              </Chart>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="font-medium">{averageSleep} hrs</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Best</p>
                <p className="font-medium">{Math.max(...sleepRecords.map((r) => r.hours)).toFixed(1)} hrs</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Last Night</p>
                <p className="font-medium">
                  {sleepRecords.length > 0 ? sleepRecords[sleepRecords.length - 1].hours.toFixed(1) : "0.0"} hrs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log Sleep</CardTitle>
            <CardDescription>Record your sleep for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bedtime">Bedtime</Label>
                  <Input
                    id="bedtime"
                    type="time"
                    value={newRecord.bedtime}
                    onChange={(e) => handleTimeChange("bedtime", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="wakeup">Wake Up</Label>
                  <Input
                    id="wakeup"
                    type="time"
                    value={newRecord.wakeup}
                    onChange={(e) => handleTimeChange("wakeup", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Sleep Duration</Label>
                <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                  <span>{newRecord.hours.toFixed(1)} hours</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Sleep Quality</Label>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant="outline"
                      size="icon"
                      className={`h-10 w-10 ${newRecord.quality === rating ? "bg-indigo-100 border-indigo-500" : ""}`}
                      onClick={() => setNewRecord({ ...newRecord, quality: rating })}
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <Button onClick={handleAddRecord} disabled={!newRecord.bedtime || !newRecord.wakeup} className="mt-2">
                Save Sleep Record
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sleep Tips</CardTitle>
          <CardDescription>Improve your sleep quality with these tips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Consistent Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Go to bed and wake up at the same time every day, even on weekends.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Limit Screen Time</h3>
              <p className="text-sm text-muted-foreground">
                Avoid screens at least 1 hour before bedtime to improve sleep quality.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Create a Routine</h3>
              <p className="text-sm text-muted-foreground">
                Develop a relaxing pre-sleep routine like reading or taking a warm bath.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
