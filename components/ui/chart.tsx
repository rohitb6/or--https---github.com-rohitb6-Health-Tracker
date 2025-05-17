import * as React from "react"
import { TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { XAxis, YAxis, Tooltip as RechartsTooltip, Area, Line, ResponsiveContainer, Bar } from "recharts"

interface ChartProps {
  data: any[]
  children: React.ReactNode
  valueFormatter?: (value: number) => string
}

export const Chart = ({ data, children, valueFormatter }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data, valueFormatter })
        }
        return child
      })}
    </ResponsiveContainer>
  )
}

interface ChartContainerProps {
  children: React.ReactNode
  data?: any[]
  valueFormatter?: (value: number) => string
}

export const ChartContainer = ({ children, data, valueFormatter }: ChartContainerProps) => {
  return (
    <TooltipProvider>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data, valueFormatter })
        }
        return child
      })}
    </TooltipProvider>
  )
}

interface ChartTooltipProps {
  children: React.ReactNode
  data?: any[]
  valueFormatter?: (value: number) => string
}

export const ChartTooltip = ({ children, data, valueFormatter }: ChartTooltipProps) => {
  return (
    <RechartsTooltip
      content={
        <CustomTooltip data={data} valueFormatter={valueFormatter}>
          {children}
        </CustomTooltip>
      }
    />
  )
}

interface CustomTooltipProps {
  children: React.ReactNode
  data?: any[]
  active?: boolean
  payload?: any[]
  valueFormatter?: (value: number) => string
}

const CustomTooltip = ({ children, active, payload, data, valueFormatter }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { payload, data, valueFormatter })
      }
      return child
    })
  }

  return null
}

interface ChartTooltipContentProps {
  children: React.ReactNode
  payload?: any[]
  data?: any[]
  valueFormatter?: (value: number) => string
}

export const ChartTooltipContent = ({ children, payload, data, valueFormatter }: ChartTooltipContentProps) => {
  return <TooltipContent>{children}</TooltipContent>
}

interface ChartTooltipItemProps {
  payload?: any[]
  data?: any[]
  valueFormatter?: (value: number) => string
}

export const ChartTooltipItem = ({ payload, data, valueFormatter }: ChartTooltipItemProps) => {
  if (!payload || !payload[0]) {
    return null
  }

  const { name, value } = payload[0]

  return (
    <React.Fragment>
      <p className="font-medium">{name}</p>
      <p className="text-sm">{valueFormatter ? valueFormatter(value) : value}</p>
    </React.Fragment>
  )
}

interface ChartAreaProps {
  children: React.ReactNode
  dataKey: string
  stroke: string
}

export const ChartArea = ({ dataKey, stroke }: ChartAreaProps) => {
  return <Area type="monotone" dataKey={dataKey} stroke={stroke} fillOpacity={1} fill="url(#colorUv)" />
}

interface ChartLineProps {
  children: React.ReactNode
  dataKey: string
  stroke: string
  strokeWidth?: number
}

export const ChartLine = ({ dataKey, stroke, strokeWidth }: ChartLineProps) => {
  return <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={strokeWidth} />
}

interface ChartXAxisProps {
  dataKey: string
}

export const ChartXAxis = ({ dataKey }: ChartXAxisProps) => {
  return <XAxis dataKey={dataKey} />
}

interface ChartYAxisProps {
  min?: number
  max?: number
}

export const ChartYAxis = ({ min, max }: ChartYAxisProps) => {
  return <YAxis domain={[min || "auto", max || "auto"]} />
}

interface ChartBarProps {
  dataKey: string
  fill: string
  fillOpacity?: number
  radius?: number | number[]
}

export const ChartBar = ({ dataKey, fill, fillOpacity, radius }: ChartBarProps) => {
  return <Bar dataKey={dataKey} fill={fill} fillOpacity={fillOpacity} radius={radius} />
}
