"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Scale, Trash2 } from "lucide-react"
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

type WeightRecord = {
  id: string
  date: string
  weight: number
  notes: string
}

export default function WeightTracker() {
  const [records, setRecords] = useState<WeightRecord[]>([
    { id: "1", date: "May 10", weight: 165.5, notes: "Started new diet" },
    { id: "2", date: "May 11", weight: 165.2, notes: "" },
    { id: "3", date: "May 12", weight: 164.8, notes: "Went for a run" },
    { id: "4", date: "May 13", weight: 164.3, notes: "" },
    { id: "5", date: "May 14", weight: 164.0, notes: "Feeling good" },
    { id: "6", date: "May 15", weight: 163.7, notes: "" },
    { id: "7", date: "May 16", weight: 163.2, notes: "More energy today" },
  ])

  const [newWeight, setNewWeight] = useState("")
  const [newNotes, setNewNotes] = useState("")

  const addWeightRecord = () => {
    if (!newWeight.trim()) return

    const today = new Date()
    const formattedDate = `${today.toLocaleString("default", { month: "short" })} ${today.getDate()}`

    setRecords([
      ...records,
      {
        id: Date.now().toString(),
        date: formattedDate,
        weight: Number.parseFloat(newWeight),
        notes: newNotes,
      },
    ])

    setNewWeight("")
    setNewNotes("")
  }

  const deleteRecord = (id: string) => {
    setRecords(records.filter((record) => record.id !== id))
  }

  // Calculate stats
  const sortedRecords = [...records].sort((a, b) => {
    const dateA = new Date(a.date + ", 2024")
    const dateB = new Date(b.date + ", 2024")
    return dateA.getTime() - dateB.getTime()
  })

  const startWeight = sortedRecords.length > 0 ? sortedRecords[0].weight : 0
  const currentWeight = sortedRecords.length > 0 ? sortedRecords[sortedRecords.length - 1].weight : 0
  const weightChange = currentWeight - startWeight
  const weightChangePercent = startWeight ? ((weightChange / startWeight) * 100).toFixed(1) : "0.0"

  // Prepare chart data
  const chartData = sortedRecords.map((record) => ({
    date: record.date,
    weight: record.weight,
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
        <h1 className="text-2xl font-bold">Weight Tracker</h1>
        <Scale className="ml-2 h-5 w-5 text-teal-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weight Trend</CardTitle>
            <CardDescription>Track your weight changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Chart data={chartData} valueFormatter={(value) => `${value} lbs`}>
                <ChartContainer>
                  <ChartTooltip>
                    <ChartTooltipContent>
                      <ChartTooltipItem />
                    </ChartTooltipContent>
                  </ChartTooltip>
                  <ChartYAxis
                    min={Math.floor(Math.min(...records.map((r) => r.weight)) - 2)}
                    max={Math.ceil(Math.max(...records.map((r) => r.weight)) + 2)}
                  />
                  <ChartXAxis dataKey="date" />
                  <ChartArea>
                    <ChartLine dataKey="weight" strokeWidth={2} stroke="#14b8a6" />
                    <ChartBar dataKey="weight" fill="#14b8a6" fillOpacity={0.2} radius={4} />
                  </ChartArea>
                </ChartContainer>
              </Chart>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Starting</p>
                <p className="font-medium">{startWeight} lbs</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Current</p>
                <p className="font-medium">{currentWeight} lbs</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Change</p>
                <p
                  className={`font-medium ${weightChange < 0 ? "text-green-500" : weightChange > 0 ? "text-red-500" : ""}`}
                >
                  {weightChange > 0 ? "+" : ""}
                  {weightChange.toFixed(1)} lbs
                  <span className="text-xs block">
                    ({weightChange < 0 ? "" : "+"}
                    {weightChangePercent}%)
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Weight</CardTitle>
            <CardDescription>Record your current weight</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 165.5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="e.g., After morning workout"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={addWeightRecord} disabled={!newWeight.trim()} className="w-full">
              Add Weight Record
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
          <CardDescription>Your recent weight measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedRecords
              .slice()
              .reverse()
              .map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{record.weight} lbs</p>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {record.notes && <p className="text-sm italic max-w-[200px] truncate">{record.notes}</p>}
                    <Button variant="ghost" size="icon" onClick={() => deleteRecord(record.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
