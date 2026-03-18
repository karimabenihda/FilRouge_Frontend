"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card, CardAction, CardContent,
  CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// chartData prop: Array<{ date: "YYYY-MM-01", revenue: number, profit: number }>

const chartConfig = {
  revenue: { label: "Revenue", color: "#1e3753" },
  profit:  { label: "Profit",  color: "#c8ad93" },
}

export function ChartAreaInteractive({ chartData = [] }) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("all")

  React.useEffect(() => {
    if (isMobile) setTimeRange("12m")
  }, [isMobile])

  // Filter by number of months back from the last data point
  const filteredData = React.useMemo(() => {
    if (!chartData.length) return []

    // Sort ascending
    const sorted = [...chartData].sort((a, b) => a.date.localeCompare(b.date))

    if (timeRange === "all") return sorted

    const months   = timeRange === "12m" ? 12 : timeRange === "6m" ? 6 : 3
    const lastDate = new Date(sorted[sorted.length - 1].date)

    // Go back N months from the last point
    const cutoff = new Date(lastDate)
    cutoff.setMonth(cutoff.getMonth() - months)

    return sorted.filter((d) => new Date(d.date) >= cutoff)
  }, [chartData, timeRange])

  const totalRevenue = filteredData.reduce((s, d) => s + d.revenue, 0)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenue & Profit</CardTitle>
        <CardDescription>
          <span className="text-[#5c6f91] hidden @[540px]/card:block">
            ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in selected period
          </span>
          <span className="@[540px]/card:hidden">Revenue trend</span>
        </CardDescription>
        <CardAction>
          {/* Desktop toggle */}
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex">
            <ToggleGroupItem value="all">All time</ToggleGroupItem>
            <ToggleGroupItem value="12m">12 months</ToggleGroupItem>
            <ToggleGroupItem value="6m">6 months</ToggleGroupItem>
            <ToggleGroupItem value="3m">3 months</ToggleGroupItem>
          </ToggleGroup>

          {/* Mobile select */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-36 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm">
              <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all"  className="rounded-lg">All time</SelectItem>
              <SelectItem value="12m"  className="rounded-lg">Last 12 months</SelectItem>
              <SelectItem value="6m"   className="rounded-lg">Last 6 months</SelectItem>
              <SelectItem value="3m"   className="rounded-lg">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-gray-400">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1e3753" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1e3753" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#c8ad93" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#c8ad93" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={40}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) =>
                      new Date(v).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                    }
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                      name === "revenue" ? "Revenue" : "Profit",
                    ]}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="profit"
                type="natural"
                fill="url(#fillProfit)"
                stroke="#c8ad93"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="#1e3753"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}