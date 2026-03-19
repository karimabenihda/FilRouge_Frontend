"use client"

import React, { useEffect, useState } from "react"
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { TrendingUp, ShoppingCart, DollarSign, BarChart2, Loader2 } from "lucide-react"

const BASE_URL = "http://127.0.0.1:8000/api/analytics"

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

function StatCard({ title, value, sub, icon: Icon, color }) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <span className={`p-2 rounded-lg ${color}`}>
            <Icon className="size-4 text-white" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-[#1e3753]">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function fmt(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function AnalyticsPage() {
  const [yearlyData, setYearlyData]   = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  // Filters
  const [selectedYear, setSelectedYear] = useState("all")

  // ── Fetch ────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token")
    const headers = { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) }

    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const [yRes, mRes] = await Promise.all([
          fetch(`${BASE_URL}/sales/yearly`, { headers }),
          fetch(`${BASE_URL}/sales/monthly`, { headers }),
        ])
        if (!yRes.ok || !mRes.ok) throw new Error("Failed to fetch analytics data")
        const [yearly, monthly] = await Promise.all([yRes.json(), mRes.json()])
        setYearlyData(yearly)
        setMonthlyData(monthly)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  // ── Derived values ───────────────────────────────────────
  const years = [...new Set(yearlyData.map((y) => y.year))].sort((a, b) => b - a)

  const filteredMonthly = selectedYear === "all"
    ? monthlyData
    : monthlyData.filter((m) => m.year === Number(selectedYear))

  const chartData = filteredMonthly.map((m) => ({
    name: `${MONTH_NAMES[m.month]} ${m.year}`,
    Sales:  m.total_sales,
    Profit: m.total_profit,
    Orders: m.total_orders,
  }))

  const totalSales   = filteredMonthly.reduce((s, m) => s + m.total_sales, 0)
  const totalProfit  = filteredMonthly.reduce((s, m) => s + m.total_profit, 0)
  const totalOrders  = filteredMonthly.reduce((s, m) => s + m.total_orders, 0)
  const bestMonth    = [...filteredMonthly].sort((a, b) => b.total_sales - a.total_sales)[0]

  // ── Yearly table rows ────────────────────────────────────
  const tableRows = selectedYear === "all"
    ? yearlyData
    : yearlyData.filter((y) => y.year === Number(selectedYear))

  // ── Loading / Error states ───────────────────────────────
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#1e3753]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      {/* ── Filters ── */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter analytics data by year</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4 flex-wrap">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setSelectedYear("all")}
            className="border-[#c8ad93] text-[#1e3753]"
          >
            Reset
          </Button>
        </CardContent>
      </Card>

      {/* ── Summary Cards ── */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={fmt(totalSales)}
          sub={selectedYear === "all" ? "All time" : `Year ${selectedYear}`}
          icon={DollarSign}
          color="bg-[#1e3753]"
        />
        <StatCard
          title="Total Profit"
          value={fmt(totalProfit)}
          sub={`Margin ${totalSales ? ((totalProfit / totalSales) * 100).toFixed(1) : 0}%`}
          icon={TrendingUp}
          color="bg-emerald-500"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          sub="Completed orders"
          icon={ShoppingCart}
          color="bg-[#c8ad93]"
        />
        <StatCard
          title="Best Month"
          value={bestMonth ? `${MONTH_NAMES[bestMonth.month]} ${bestMonth.year}` : "—"}
          sub={bestMonth ? fmt(bestMonth.total_sales) : ""}
          icon={BarChart2}
          color="bg-amber-500"
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales & Profit Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => fmt(v)} />
                <Legend />
                <Line type="monotone" dataKey="Sales"  stroke="#1e3753" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Profit" stroke="#c8ad93" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders Per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Orders" fill="#1e3753" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Yearly Breakdown Table ── */}
      <Card>
        <CardHeader>
          <CardTitle>Yearly Breakdown</CardTitle>
          <CardDescription>Sales, profit and orders grouped by year</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Total Profit</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((row) => (
                <TableRow key={row.year}>
                  <TableCell className="font-medium">{row.year}</TableCell>
                  <TableCell>{fmt(row.total_sales)}</TableCell>
                  <TableCell>{fmt(row.total_profit)}</TableCell>
                  <TableCell>{row.total_orders.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        row.total_sales
                          ? ((row.total_profit / row.total_sales) * 100) >= 20
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                          : ""
                      }
                    >
                      {row.total_sales
                        ? ((row.total_profit / row.total_sales) * 100).toFixed(1) + "%"
                        : "—"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Monthly Breakdown Table ── */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <CardDescription>Detailed month-by-month performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Total Profit</TableHead>
                <TableHead>Total Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMonthly.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{MONTH_NAMES[row.month]}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{fmt(row.total_sales)}</TableCell>
                  <TableCell>{fmt(row.total_profit)}</TableCell>
                  <TableCell>{row.total_orders.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}