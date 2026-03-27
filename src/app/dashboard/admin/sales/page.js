"use client"
import { SectionCards }         from "@/components/section-cards"
import React, { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button }   from "@/components/ui/button"
import { Input }    from "@/components/ui/input"
import { Label }    from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, BarChart2 } from "lucide-react"

// ─── Endpoints ────────────────────────────────────────────────────────────────
const BASE        = "http://127.0.0.1:8000"
const URL_YEARLY  = `${BASE}/api/analytics/sales/yearly`
const URL_MONTHLY = `${BASE}/api/analytics/sales/monthly`

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

export default function SalesPage() {
  const [yearly,      setYearly]      = useState([])   // List[YearlySalesItem]
  const [monthly,     setMonthly]     = useState([])   // List[MonthlySalesItem]
  const [isLoading,   setIsLoading]   = useState(true)

  // filters
  const [selectedYear,     setSelectedYear]     = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [fromDate,         setFromDate]         = useState("")
  const [toDate,           setToDate]           = useState("")

  const authHeaders = () => {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // ── Fetch both endpoints on mount ─────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const [yearlyRes, monthlyRes] = await Promise.all([
          axios.get(URL_YEARLY,  { headers: authHeaders() }),
          axios.get(URL_MONTHLY, { headers: authHeaders() }),
        ])
        setYearly(yearlyRes.data)
        setMonthly(monthlyRes.data)
      } catch (err) {
        console.error("Failed to fetch sales analytics:", err.response?.data || err.message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // ── Available years from data ──────────────────────────────────────────────
  const years = useMemo(() => yearly.map((y) => y.year), [yearly])

  // ── Chart data ─────────────────────────────────────────────────────────────
  // If a year is selected → show its monthly breakdown
  // Otherwise → show one point per year (yearly totals)
  const chartData = useMemo(() => {
    if (selectedYear !== "all") {
      const yearData = yearly.find((y) => y.year === parseInt(selectedYear))
      if (!yearData) return []
      return yearData.months.map((m) => ({
        label:  MONTH_NAMES[m.month - 1],
        sales:  m.total_sales,
        profit: m.total_profit,
        orders: m.total_orders,
      }))
    }
    // All years — use monthly flat list grouped by "MMM YYYY"
    return monthly.map((m) => ({
      label:  `${MONTH_NAMES[m.month - 1]} ${m.year}`,
      sales:  m.total_sales,
      profit: m.total_profit,
      orders: m.total_orders,
    }))
  }, [selectedYear, yearly, monthly])

  // ── Summary cards ──────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const source = selectedYear === "all"
      ? yearly
      : yearly.filter((y) => y.year === parseInt(selectedYear))

    const totalSales  = source.reduce((s, y) => s + y.total_sales,  0)
    const totalProfit = source.reduce((s, y) => s + y.total_profit, 0)
    const totalOrders = source.reduce((s, y) => s + y.total_orders, 0)
    const margin      = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : "0.0"

    return { totalSales, totalProfit, totalOrders, margin }
  }, [selectedYear, yearly])

  // ── Table rows ─────────────────────────────────────────────────────────────
  // Show monthly breakdown filtered by year + date range
  const tableRows = useMemo(() => {
    let rows = monthly

    if (selectedYear !== "all") {
      rows = rows.filter((m) => m.year === parseInt(selectedYear))
    }
    if (fromDate) {
      rows = rows.filter((m) => {
        const d = new Date(m.year, m.month - 1, 1)
        return d >= new Date(fromDate)
      })
    }
    if (toDate) {
      rows = rows.filter((m) => {
        const d = new Date(m.year, m.month - 1, 1)
        return d <= new Date(toDate)
      })
    }
    return rows
  }, [monthly, selectedYear, fromDate, toDate])

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">

    
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `$${summary.totalSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: <DollarSign className="w-5 h-5 text-[#c8ad93]" />,
            sub: "Gross sales",
          },
          {
            label: "Total Profit",
            value: `$${summary.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: summary.totalProfit >= 0
              ? <TrendingUp className="w-5 h-5 text-green-500" />
              : <TrendingDown className="w-5 h-5 text-red-500" />,
            sub: `${summary.margin}% margin`,
          },
          {
            label: "Total Orders",
            value: summary.totalOrders.toLocaleString(),
            icon: <ShoppingBag className="w-5 h-5 text-[#1e3753]" />,
            sub: "All transactions",
          },
          {
            label: "Avg. Order Value",
            value: summary.totalOrders > 0
              ? `$${(summary.totalSales / summary.totalOrders).toFixed(2)}`
              : "$0.00",
            icon: <BarChart2 className="w-5 h-5 text-purple-500" />,
            sub: "Revenue per order",
          },
        ].map((c) => (
           <SectionCards  key={c.label}
                      description="Total Orders"
                      value={c.value}
                      percentage="all time"
                      trending={c.icon}
                      title={c.label}
                      footer={c.sub}
                    />
        // <Card key={c.label}>
          //   <CardContent className="pt-5">
          //     <div className="flex items-center justify-between mb-1">
          //       <p className="text-sm text-muted-foreground">{c.label}</p>
          //       {c.icon}
          //     </div>
          //     <p className="text-2xl font-bold text-[#1e3753]">{c.value}</p>
          //     <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
          //   </CardContent>
          // </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Year */}
          <div className="space-y-1">
            <Label>Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger><SelectValue placeholder="All years" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From */}
          <div className="space-y-1">
            <Label>From</Label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>

          {/* To */}
          <div className="space-y-1">
            <Label>To</Label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { setSelectedYear("all"); setFromDate(""); setToDate("") }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedYear === "all" ? "Revenue — All Years (Monthly)" : `Revenue — ${selectedYear} by Month`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Loading chart…
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data for selected period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1e3753" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1e3753" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#c8ad93" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#c8ad93" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                    name === "sales" ? "Revenue" : "Profit",
                  ]}
                />
                <Area dataKey="sales"  type="monotone" stroke="#1e3753" fill="url(#salesGrad)"  strokeWidth={2} name="sales" />
                <Area dataKey="profit" type="monotone" stroke="#c8ad93" fill="url(#profitGrad)" strokeWidth={2} name="profit" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Monthly breakdown table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Monthly Breakdown</CardTitle>
          <span className="text-sm text-muted-foreground">{tableRows.length} months</span>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Year</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No data for selected filters.
                    </TableCell>
                  </TableRow>
                ) : tableRows.map((row, i) => {
                  const margin = row.total_sales > 0
                    ? ((row.total_profit / row.total_sales) * 100).toFixed(1)
                    : "0.0"
                  const isProfit = row.total_profit >= 0

                  return (
                    <TableRow key={i} className="hover:bg-gray-50/50">
                      <TableCell className="font-semibold text-[#1e3753]">{row.year}</TableCell>
                      <TableCell>{MONTH_NAMES[row.month - 1]}</TableCell>
                      <TableCell className="text-right font-semibold text-[#c8ad93]">
                        ${row.total_sales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${isProfit ? "text-green-600" : "text-red-500"}`}>
                        ${row.total_profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-gray-600">{row.total_orders}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={isProfit ? "outline" : "destructive"} className="text-xs">
                          {margin}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  )
}