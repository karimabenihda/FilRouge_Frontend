"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Users, ShieldCheck, UserCircle, TrendingUp, Plus, RefreshCcw } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const API_BASE = "http://localhost:8000"
const EMPTY_FORM = { firstname: "", lastname: "", email: "", password: "", role: "client" }

const getHeaders = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [monthly, setMonthly] = useState([])
  const [stats, setStats] = useState({ total: 0, admins: 0, clients: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState({ name: "", email: "" })
  const [form, setForm] = useState(EMPTY_FORM)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const fetchAll = async () => {
    setIsLoading(true)
    try {
      const [usersRes, monthlyRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/get_users`, { headers: getHeaders() }),
        axios.get(`${API_BASE}/stats/monthly`, { headers: getHeaders() }),
        axios.get(`${API_BASE}/stats/total`, { headers: getHeaders() }),
      ])
      setUsers(usersRes.data)
      setMonthly(monthlyRes.data)
      setStats(statsRes.data)
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleAddUser = async () => {
    const { firstname, lastname, email, password } = form
    if (!firstname || !lastname || !email || !password) {
      toast.error("Please fill all required fields")
      return
    }
    try {
      await axios.post(`${API_BASE}/add_user`, form, { headers: getHeaders() })
      toast.success("User created successfully")
      setForm(EMPTY_FORM)
      setIsAddOpen(false)
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create user")
    }
  }

  // const handleDelete = async (id) => {
  //   if (!confirm("Delete this user?")) return
  //   try {
  //     await axios.delete(`${API_BASE}/delete_user/${id}`, { headers: getHeaders() })
  //     toast.success("User deleted")
  //     fetchAll()
  //   } catch (err) {
  //     toast.error(err.response?.data?.detail || "Failed to delete user")
  //   }
  // }

  const handleRoleChange = async (id, role) => {
    try {
      await axios.patch(`${API_BASE}/update_user/${id}/role?role=${role}`, {}, { headers: getHeaders() })
      toast.success("Role updated")
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update role")
    }
  }

  const filtered = users.filter((u) => {
    const fullName = `${u.firstname} ${u.lastname}`.toLowerCase()
    return (
      fullName.includes(search.name.toLowerCase()) &&
      u.email.toLowerCase().includes(search.email.toLowerCase())
    )
  })

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3753]">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all users, roles, and monitor growth.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAll} variant="outline" className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1e3753] hover:bg-[#2a4a6d]">
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader><DialogTitle>Create New User</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>First Name</Label>
                    <Input placeholder="John" value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Last Name</Label>
                    <Input placeholder="Doe" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddUser} className="w-full bg-[#1e3753] hover:bg-[#2a4a6d] mt-2">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[#1e3753]">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="bg-[#1e3753]/10 p-3 rounded-full">
              <Users className="text-[#1e3753] w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-[#1e3753]">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="bg-purple-100 p-3 rounded-full">
              <ShieldCheck className="text-purple-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-3xl font-bold text-purple-600">{stats.admins}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="bg-green-100 p-3 rounded-full">
              <UserCircle className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Clients</p>
              <p className="text-3xl font-bold text-green-600">{stats.clients}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1e3753]" /> User Growth This Year
          </CardTitle>
          <CardDescription>Monthly new user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3753" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1e3753" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#1e3753" strokeWidth={2} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader><CardTitle>Search Users</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Search by name" value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
            <Input placeholder="Search by email" value={search.email} onChange={(e) => setSearch({ ...search, email: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>{filtered.length} users found</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-gray-400">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-400">No users found.</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="text-slate-400 font-medium">#{u.id}</TableCell>
                      <TableCell className="font-semibold text-slate-700">{u.firstname} {u.lastname}</TableCell>
                      <TableCell className="text-slate-500">{u.email}</TableCell>
                      <TableCell>
                        <Badge className={u.role === "admin"
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                          : "bg-green-100 text-green-700 hover:bg-green-100"}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRoleChange(u.id, u.role === "admin" ? "client" : "admin")}>
                              Switch to {u.role === "admin" ? "Client" : "Admin"}
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(u.id)}>
                              Delete
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}