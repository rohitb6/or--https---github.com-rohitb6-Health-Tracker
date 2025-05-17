"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, ChevronLeft, Pause, Play } from "lucide-react"

type BreathingPattern = {
  name: string
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  description: string
  color: string
}

const breathingPatterns: BreathingPattern[] = [
  {
    name: "Box Breathing",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: "Equal parts inhale, hold, exhale, and hold. Great for stress relief and focus.",
    color: "bg-blue-500",
  },
  {
    name: "4-7-8 Breathing",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    description: "Inhale for 4, hold for 7, exhale for 8. Helps with anxiety and sleep.",
    color: "bg-purple-500",
  },
  {
    name: "Relaxing Breath",
    inhale: 5,
    hold1: 2,
    exhale: 6,
    hold2: 0,
    description: "Longer exhale than inhale promotes relaxation and calmness.",
    color: "bg-green-500",
  },
]

export default function BreathingExercise() {
  const [activeTab, setActiveTab] = useState("box-breathing")
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale")
  const [timeLeft, setTimeLeft] = useState(0)
  const [cycles, setCycles] = useState(0)
  const animationRef = useRef<HTMLDivElement>(null)

  const getPattern = (): BreathingPattern => {
    switch (activeTab) {
      case "4-7-8-breathing":
        return breathingPatterns[1]
      case "relaxing-breath":
        return breathingPatterns[2]
      default:
        return breathingPatterns[0]
    }
  }

  const pattern = getPattern()

  useEffect(() => {
    if (!isActive) return

    const totalTime =
      phase === "inhale"
        ? pattern.inhale
        : phase === "hold1"
          ? pattern.hold1
          : phase === "exhale"
            ? pattern.exhale
            : pattern.hold2

    setTimeLeft(totalTime)

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === "inhale") {
            setPhase("hold1")
            return pattern.hold1
          } else if (phase === "hold1") {
            setPhase("exhale")
            return pattern.exhale
          } else if (phase === "exhale") {
            if (pattern.hold2 > 0) {
              setPhase("hold2")
              return pattern.hold2
            } else {
              setPhase("inhale")
              setCycles((c) => c + 1)
              return pattern.inhale
            }
          } else {
            setPhase("inhale")
            setCycles((c) => c + 1)
            return pattern.inhale
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase, pattern])

  useEffect(() => {
    if (!animationRef.current) return

    if (phase === "inhale") {
      animationRef.current.style.transform = "scale(1.5)"
    } else if (phase === "exhale") {
      animationRef.current.style.transform = "scale(1.0)"
    }
  }, [phase])

  const toggleActive = () => {
    if (!isActive) {
      setPhase("inhale")
      setTimeLeft(pattern.inhale)
    }
    setIsActive(!isActive)
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
        <h1 className="text-2xl font-bold">Breathing Exercise</h1>
        <Activity className="ml-2 h-5 w-5 text-cyan-500" />
      </div>

      <Tabs defaultValue="box-breathing" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="box-breathing">Box Breathing</TabsTrigger>
          <TabsTrigger value="4-7-8-breathing">4-7-8 Breathing</TabsTrigger>
          <TabsTrigger value="relaxing-breath">Relaxing Breath</TabsTrigger>
        </TabsList>

        {breathingPatterns.map((pattern, index) => (
          <TabsContent key={index} value={pattern.name.toLowerCase().replace(/\s+/g, "-")} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{pattern.name}</CardTitle>
                <CardDescription>{pattern.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-8 text-center">
                  <div className="text-lg font-medium mb-2">
                    {phase === "inhale"
                      ? "Inhale"
                      : phase === "hold1"
                        ? "Hold"
                        : phase === "exhale"
                          ? "Exhale"
                          : "Hold"}
                  </div>
                  <div className="text-4xl font-bold">{timeLeft}</div>
                  <div className="text-sm text-muted-foreground mt-1">Cycles completed: {cycles}</div>
                </div>

                <div
                  ref={animationRef}
                  className={`w-40 h-40 rounded-full flex items-center justify-center mb-8 transition-transform duration-[4000ms] ${pattern.color} bg-opacity-20`}
                >
                  <div
                    className={`w-32 h-32 rounded-full ${pattern.color} bg-opacity-30 flex items-center justify-center`}
                  >
                    <div
                      className={`w-24 h-24 rounded-full ${pattern.color} bg-opacity-40 flex items-center justify-center`}
                    >
                      <div className={`w-16 h-16 rounded-full ${pattern.color} bg-opacity-50`}></div>
                    </div>
                  </div>
                </div>

                <Button onClick={toggleActive} className="w-40" variant={isActive ? "outline" : "default"}>
                  {isActive ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
