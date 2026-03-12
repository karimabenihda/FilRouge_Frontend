"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Package, History, RefreshCcw, ArrowUpDown, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_BASE = ""

export default function InventoryPage() {
  const [stockStatus, setStockStatus] = useState([])
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [updateStock, setUpdateStock] = useState({ product_id: "", new_stock: "", reason: "Manual Adjustment" })
  const [openDialogId, setOpenDialogId] = useState(null)

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [statusRes, logsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/inventory/status`),
        axios.get(`${API_BASE}/api/inventory/logs`),
      ])
      setStockStatus(statusRes.data)
      setLogs(logsRes.data)
    } catch (err) {
      console.error("Error fetching inventory data:", err.response?.data || err.message)
      toast.error(err.response?.data?.detail || "Failed to load inventory data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUpdateStock = async () => {
    if (!updateStock.product_id || updateStock.new_stock === "") {
      toast.error("Please fill all fields")
      return
    }

    try {
      await axios.post(
        `${API_BASE}/api/inventory/update`,
        {
          product_id: parseInt(updateStock.product_id),
          new_stock: parseInt(updateStock.new_stock),
          reason: updateStock.reason,
        },
        { headers: getHeaders() }
      )

      toast.success("Stock updated successfully")
      setOpenDialogId(null)
      setUpdateStock({ product_id: "", new_stock: "", reason: "Manual Adjustment" })
      fetchData()
    } catch (err) {
      console.error("Update stock error:", err.response?.data || err.message)
      toast.error(err.response?.data?.detail || "Failed to update stock")
    }
  }

  const lowStockCount = stockStatus.filter((i) => i.stock <= 5).length
  const outOfStockCount = stockStatus.filter((i) => i.stock === 0).length
  const totalProducts = stockStatus.length

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3753]">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Monitor and adjust your product stock levels.</p>
        </div>
        <Button onClick={fetchData} variant="outline" className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-[#1e3753]">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="bg-yellow-100 p-3 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Low Stock (≤5)</p>
            <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="bg-red-100 p-3 rounded-lg">
            <Package className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Package className="w-4 h-4" /> Current Stock
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <History className="w-4 h-4" /> Movement Logs
          </TabsTrigger>
        </TabsList>

        {/* Stock Status Tab */}
        <TabsContent value="status" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {isLoading ? (
              <div className="py-16 text-center text-gray-400">Loading inventory...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockStatus.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    stockStatus.map((item) => (
                      <TableRow key={item.ProductID}>
                        <TableCell className="font-medium text-gray-400">#{item.ProductID}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.ProductName}
                                className="w-10 h-10 rounded-lg object-cover border"
                              />
                            )}
                            <span className="font-semibold text-gray-800">{item.ProductName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#c8ad93] font-semibold">${item.price}</TableCell>
                        <TableCell>
                          <span className="font-bold text-gray-700">{item.stock}</span>
                          <span className="text-gray-400 text-sm"> units</span>
                        </TableCell>
                        <TableCell>
                          {item.stock === 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : item.stock <= 5 ? (
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Low Stock</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog
                            open={openDialogId === item.ProductID}
                            onOpenChange={(open) => {
                              if (open) {
                                setOpenDialogId(item.ProductID)
                                setUpdateStock({
                                  product_id: item.ProductID,
                                  new_stock: item.stock,
                                  reason: "Manual Adjustment",
                                })
                              } else {
                                setOpenDialogId(null)
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#1e3753] hover:bg-[#1e3753]/10"
                              >
                                <ArrowUpDown className="w-4 h-4 mr-2" /> Adjust
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Adjust Stock — {item.ProductName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                                  Current stock: <span className="font-bold text-gray-900">{item.stock} units</span>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">New Stock Level</label>
                                  <Input
                                    type="number"
                                    min={0}
                                    value={updateStock.new_stock}
                                    onChange={(e) =>
                                      setUpdateStock({ ...updateStock, new_stock: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Reason</label>
                                  <Input
                                    placeholder="e.g. Restock, Damaged goods, Sale..."
                                    value={updateStock.reason}
                                    onChange={(e) =>
                                      setUpdateStock({ ...updateStock, reason: e.target.value })
                                    }
                                  />
                                </div>
                                <Button
                                  className="w-full bg-[#1e3753] hover:bg-[#2a4a6d]"
                                  onClick={handleUpdateStock}
                                >
                                  Confirm Adjustment
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                      No inventory movements recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-800">{log.product_name}</p>
                          <p className="text-xs text-gray-400">ID #{log.product_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {log.change_quantity >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`font-bold text-lg ${
                              log.change_quantity >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {log.change_quantity >= 0 ? "+" : ""}
                            {log.change_quantity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{log.reason}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
