"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Lock, Save, ShieldCheck } from "lucide-react"

const API_BASE = "http://127.0.0.1:8000/api/auth"

const getHeaders = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function Page() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    updated_at: new Date().toISOString(),
  })
  const [userId, setUserId] = useState(null)
  const [role, setRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(`${API_BASE}/me`, { headers: getHeaders() })
        const u = res.data
        setUserId(u.id)
        setRole(u.role)
        setForm({
          firstname: u.firstname,
          lastname: u.lastname,
          email: u.email,
          password: "",
          updated_at: new Date().toISOString(),
        })
      } catch (err) {
        toast.error("Failed to load profile")
      }
    }
    fetchMe()
  }, [])

  const handleSave = async () => {
    if (!form.firstname || !form.lastname || !form.email || !form.password) {
      toast.error("All fields are required including password")
      return
    }
    setIsLoading(true)
    try {
      await axios.put(
        `${API_BASE}/update_user/${userId}`,
        { ...form, updated_at: new Date().toISOString() },
        { headers: getHeaders() }
      )
      toast.success("Profile updated successfully")
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const initials = `${form.firstname?.[0] ?? ""}${form.lastname?.[0] ?? ""}`.toUpperCase()

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">

      {/* Header */}
      {/* <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1e3753]">My Profile</h1>
        <p className="text-gray-500 mt-1">Update your personal information and password.</p>
      </div> */}
      {/* Avatar Card */}
      <Card>
        <CardContent className="flex items-center gap-5 pt-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-[#1e3753] text-white text-xl font-bold">
              {initials || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-bold text-slate-800">{form.firstname} {form.lastname}</p>
            <p className="text-gray-500 text-sm">{form.email}</p>
            <Badge className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-100 flex items-center gap-1 w-fit">
              <ShieldCheck className="w-3 h-3" /> {role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Information</CardTitle>
          <CardDescription>Changes will be saved to your account immediately.</CardDescription>
        </CardHeader>
        <CardContent className=" space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="flex items-center gap-1"><User className="w-3 h-3" /> First Name</Label>
              <Input
                placeholder="John"
                value={form.firstname}
                onChange={(e) => setForm({ ...form, firstname: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="flex items-center gap-1"><User className="w-3 h-3" /> Last Name</Label>
              <Input
                placeholder="Doe"
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email</Label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label className="flex items-center gap-1"><Lock className="w-3 h-3" /> New Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="text-xs text-gray-400">Password is required to confirm changes.</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-[#1e3753] hover:bg-[#2a4a6d] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}