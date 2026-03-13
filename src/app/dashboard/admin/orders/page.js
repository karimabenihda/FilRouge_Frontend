"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button }  from "@/components/ui/button"
import { Input }   from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  RefreshCcw, ChevronRight, XCircle, ShoppingBag,
  Clock, CheckCircle, Truck, PackageCheck, Search, CreditCard,
} from "lucide-react"
import { toast } from "sonner"

// ─── Exact URLs from Swagger ──────────────────────────────────────────────────
const URLS = {
  allOrders:      "/api/orders/orders/all",
  customerOrders: (id) => `/api/orders/get_orders/${id}`,
  advanceStatus:  (id) => `/api/orders/${id}/status`,
  cancelOrder:    (id) => `/api/orders/${id}/cancel`,
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_META = {
  pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-700", icon: Clock        },
  confirmed:  { label: "Confirmed",  color: "bg-blue-100 text-blue-700",    icon: CheckCircle  },
  preparing:  { label: "Preparing",  color: "bg-purple-100 text-purple-700",icon: ShoppingBag  },
  shipped:    { label: "Shipped",    color: "bg-indigo-100 text-indigo-700",icon: Truck        },
  delivering: { label: "Delivering", color: "bg-orange-100 text-orange-700",icon: Truck        },
  delivered:  { label: "Delivered",  color: "bg-green-100 text-green-700",  icon: PackageCheck },
  cancelled:  { label: "Cancelled",  color: "bg-red-100 text-red-700",      icon: XCircle      },
}

const STATUS_FLOW = ["pending", "confirmed", "preparing", "shipped", "delivering", "delivered"]

const getNextStatus = (s) => {
  const i = STATUS_FLOW.indexOf(s)
  return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null
}

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] ?? { label: status, color: "bg-gray-100 text-gray-600" }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
      {meta.label}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders,        setOrders]        = useState([])
  const [isLoading,     setIsLoading]     = useState(true)
  const [searchQuery,   setSearchQuery]   = useState("")
  const [statusFilter,  setStatusFilter]  = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailOpen,  setIsDetailOpen]  = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [paymentMap,    setPaymentMap]    = useState({})

  const authHeaders = () => {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // ── GET /api/orders/orders/all ────────────────────────────────────────────
  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(URLS.allOrders, { headers: authHeaders() })
      setOrders(data)
    } catch (err) {
      toast.error(err.response?.data?.detail ?? "Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  // ── GET /api/orders/get_orders/:customer_id ───────────────────────────────
  const fetchCustomerDetail = async (customerId) => {
    if (paymentMap[customerId] !== undefined) return
    try {
      const { data } = await axios.get(URLS.customerOrders(customerId), { headers: authHeaders() })
      setPaymentMap((prev) => ({ ...prev, [customerId]: data.payment ?? null }))
    } catch {
      setPaymentMap((prev) => ({ ...prev, [customerId]: null }))
    }
  }

  // ── PUT /api/orders/:id/status ────────────────────────────────────────────
  const handleAdvanceStatus = async (orderId) => {
    setActionLoading(orderId + "_advance")
    try {
      const { data } = await axios.put(URLS.advanceStatus(orderId), {}, { headers: authHeaders() })
      toast.success(`Order #${orderId} → ${data.new_status}`)
      const patch = (o) => o.id === orderId ? { ...o, status: data.new_status } : o
      setOrders((prev) => prev.map(patch))
      if (selectedOrder?.id === orderId)
        setSelectedOrder((prev) => ({ ...prev, status: data.new_status }))
    } catch (err) {
      toast.error(err.response?.data?.detail ?? "Failed to update status")
    } finally {
      setActionLoading(null)
    }
  }

  // ── PUT /api/orders/:id/cancel ────────────────────────────────────────────
  const handleCancelOrder = async (orderId) => {
    if (!confirm(`Cancel order #${orderId}?`)) return
    setActionLoading(orderId + "_cancel")
    try {
      await axios.put(URLS.cancelOrder(orderId), {}, { headers: authHeaders() })
      toast.success(`Order #${orderId} cancelled`)
      const patch = (o) => o.id === orderId ? { ...o, status: "cancelled" } : o
      setOrders((prev) => prev.map(patch))
      if (selectedOrder?.id === orderId)
        setSelectedOrder((prev) => ({ ...prev, status: "cancelled" }))
    } catch (err) {
      toast.error(err.response?.data?.detail ?? "Failed to cancel order")
    } finally {
      setActionLoading(null)
    }
  }

  const openDetail = (order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
    fetchCustomerDetail(order.customer_id)
  }

  const filteredOrders = useMemo(() => orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      String(o.id).includes(q) ||
      String(o.customer_id).includes(q) ||
      o.product_name?.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  }), [orders, statusFilter, searchQuery])

  const counts = useMemo(() => {
    const c = { total: orders.length }
    STATUS_FLOW.forEach((s) => { c[s] = orders.filter((o) => o.status === s).length })
    c.cancelled = orders.filter((o) => o.status === "cancelled").length
    return c
  }, [orders])

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3753]">Orders Management</h1>
          <p className="text-gray-500 mt-1">Track and manage all customer orders.</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: counts.total,                                      color: "text-[#1e3753]",   bg: "bg-blue-50"   },
          { label: "Pending",      value: counts.pending    ?? 0,                            color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "In Transit",   value: (counts.shipped ?? 0) + (counts.delivering ?? 0), color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Delivered",    value: counts.delivered  ?? 0,                            color: "text-green-600",  bg: "bg-green-50"  },
        ].map((c) => (
          <div key={c.label} className={`${c.bg} rounded-xl border p-5 shadow-sm`}>
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer ID or product…"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">Loading orders…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-gray-400">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : filteredOrders.map((order) => {
                const next        = getNextStatus(order.status)
                const isCancelled = order.status === "cancelled"
                const isDelivered = order.status === "delivered"

                return (
                  <TableRow key={order.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-mono text-sm text-gray-400">#{order.id}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.product_image && (
                          <img
                            src={order.product_image}
                            alt={order.product_name}
                            className="w-9 h-9 rounded-lg object-cover border"
                            onError={(e) => { e.target.style.display = "none" }}
                          />
                        )}
                        <span className="font-medium text-gray-800 text-sm">
                          {order.product_name ?? "—"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-500 text-sm">#{order.customer_id}</TableCell>
                    <TableCell className="text-gray-700">{order.product_qte}</TableCell>
                    <TableCell className="font-semibold text-[#c8ad93]">
                      ${order.totalprice?.toFixed(2)}
                    </TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#1e3753] hover:bg-[#1e3753]/10 text-xs"
                          onClick={() => openDetail(order)}
                        >
                          Details
                        </Button>

                        {!isCancelled && !isDelivered && next && (
                          <Button
                            size="sm"
                            className="bg-[#1e3753] hover:bg-[#2a4a6d] text-xs flex items-center gap-1"
                            disabled={actionLoading === order.id + "_advance"}
                            onClick={() => handleAdvanceStatus(order.id)}
                          >
                            <ChevronRight className="w-3 h-3" />
                            {STATUS_META[next]?.label}
                          </Button>
                        )}

                        {!isCancelled && !isDelivered && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
                            disabled={actionLoading === order.id + "_cancel"}
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (() => {
            const next       = getNextStatus(selectedOrder.status)
            const isTerminal = selectedOrder.status === "delivered" || selectedOrder.status === "cancelled"
            const currentIdx = STATUS_FLOW.indexOf(selectedOrder.status)
            const payment    = paymentMap[selectedOrder.customer_id]

            return (
              <div className="space-y-4 py-2">

                {/* Product */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {selectedOrder.product_image && (
                    <img
                      src={selectedOrder.product_image}
                      alt={selectedOrder.product_name}
                      className="w-14 h-14 rounded-lg object-cover border"
                      onError={(e) => { e.target.style.display = "none" }}
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{selectedOrder.product_name ?? "—"}</p>
                    <p className="text-sm text-gray-500">Qty: {selectedOrder.product_qte}</p>
                    <p className="text-sm font-bold text-[#c8ad93]">${selectedOrder.totalprice?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="border rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Customer ID</p>
                    <p className="font-semibold">#{selectedOrder.customer_id}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Status</p>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Order Date</p>
                    <p className="font-semibold">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Total</p>
                    <p className="font-bold text-[#c8ad93]">${selectedOrder.totalprice?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Payment */}
                {payment && (
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1 mb-2">
                      <CreditCard className="w-3 h-3" /> Payment
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Method</p>
                        <p className="font-semibold capitalize">{payment.method ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Amount</p>
                        <p className="font-semibold text-[#c8ad93]">${payment.amount?.toFixed(2) ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Status</p>
                        <p className="font-semibold capitalize">{payment.status ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Card</p>
                        <p className="font-semibold">
                          {payment.card_last4 ? `•••• ${payment.card_last4}` : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div>
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Progress</p>
                  <div className="flex gap-1">
                    {STATUS_FLOW.map((s, i) => (
                      <div
                        key={s}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          selectedOrder.status === "cancelled"
                            ? "bg-red-200"
                            : i <= currentIdx ? "bg-[#1e3753]" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">Pending</span>
                    <span className="text-xs text-gray-400">Delivered</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {isTerminal ? (
                    <p className="text-sm text-gray-400 italic w-full text-center py-2">
                      Order is {selectedOrder.status} — no further actions available.
                    </p>
                  ) : (
                    <>
                      {next && (
                        <Button
                          className="flex-1 bg-[#1e3753] hover:bg-[#2a4a6d]"
                          disabled={actionLoading === selectedOrder.id + "_advance"}
                          onClick={() => handleAdvanceStatus(selectedOrder.id)}
                        >
                          <ChevronRight className="w-4 h-4 mr-1" />
                          Advance to {STATUS_META[next]?.label}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        disabled={actionLoading === selectedOrder.id + "_cancel"}
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}