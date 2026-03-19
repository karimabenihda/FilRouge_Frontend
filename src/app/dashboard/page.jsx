"use client"

import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { SectionCards }         from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ─── Endpoints ────────────────────────────────────────────────────────────────
const BASE = "http://127.0.0.1:8000"
const URLS = {
  stats:     `${BASE}/api/dashboard/stats`,       // → { total_revenue, total_profit, total_orders, pending_orders }
  chart:     `${BASE}/api/dashboard/chart`,        // → [{ date, revenue, profit }]
  allOrders: `${BASE}/api/orders/orders/all`,      // → List[AdminOrderItem]
}

// ─── Status badge colours ─────────────────────────────────────────────────────
const STATUS_COLOR = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  preparing:  "bg-purple-100 text-purple-700",
  shipped:    "bg-indigo-100 text-indigo-700",
  delivering: "bg-orange-100 text-orange-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
}

export default function Page() {
  const [stats,     setStats]     = useState(null)
  const [chartData, setChartData] = useState([])
  const [orders,    setOrders]    = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const authHeaders = () => {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // ── Single parallel fetch on mount ────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const [statsRes, chartRes, ordersRes] = await Promise.all([
          axios.get(URLS.stats,     { headers: authHeaders() }),
          axios.get(URLS.chart,     { headers: authHeaders() }),
          axios.get(URLS.allOrders, { headers: authHeaders() }),
        ])
        setStats(chartRes.data     ? statsRes.data  : null)
        setChartData(chartRes.data ?? [])
        setOrders(ordersRes.data   ?? [])
      } catch (err) {
        console.error("Dashboard fetch error:", err.response?.data || err.message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // ── Last 10 orders for the table ──────────────────────────────────────────
  const recentOrders = useMemo(() => orders.slice(0, 10), [orders])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-gray-400">
        Loading dashboard…
      </div>
    )
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">

        {/* ── 4 KPI cards ──────────────────────────────────────────────────── */}
        <div 
        className=" grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 gap-6 px-4 lg:px-6" 
        >

          <SectionCards 
            description="Total Revenue"
            value={`$${(stats?.total_revenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            percentage="+sales"
            trending="up"
            title="Gross revenue all time"
            footer="From sales table"
          />

          <SectionCards
            description="Total Profit"
            value={`$${(stats?.total_profit ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            percentage={
              stats?.total_revenue > 0
                ? `${((stats.total_profit / stats.total_revenue) * 100).toFixed(1)}% margin`
                : "0%"
            }
            trending={(stats?.total_profit ?? 0) >= 0 ? "up" : "down"}
            title={(stats?.total_profit ?? 0) >= 0 ? "Profitable" : "In loss"}
            footer="Revenue minus costs"
          />

          <SectionCards
            description="Total Orders"
            value={(stats?.total_orders ?? 0).toLocaleString()}
            percentage="all time"
            trending="up"
            title="All customer orders"
            footer="Across all statuses"
          />

          <SectionCards
            description="Pending Orders"
            value={(stats?.pending_orders ?? 0).toLocaleString()}
            percentage="need action"
            trending={(stats?.pending_orders ?? 0) > 0 ? "down" : "up"}
            title={(stats?.pending_orders ?? 0) > 0 ? "Requires attention" : "All clear"}
            footer="Awaiting confirmation"
          />

        </div>

        {/* ── Revenue & Profit chart ────────────────────────────────────────── */}
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive chartData={chartData} />
        </div>

        {/* ── Recent orders table ───────────────────────────────────────────── */}
        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <span className="text-sm text-muted-foreground">Last 10 orders</span>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : recentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-mono text-sm text-gray-400">
                        #{order.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {order.product_image && (
                            <img
                              src={order.product_image}
                              alt={order.product_name}
                              className="w-8 h-8 rounded-md object-cover border"
                              onError={(e) => { e.target.style.display = "none" }}
                            />
                          )}
                          <span className="text-sm font-medium text-gray-800">
                            {order.product_name ?? "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        #{order.customer_id}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-[#c8ad93]">
                        ${order.totalprice?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-gray-600">
                        {order.product_qte}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}