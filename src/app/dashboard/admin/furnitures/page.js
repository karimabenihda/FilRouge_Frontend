"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import FurnitureForm from "./FurnitureForm"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Eye, Layers, Tag, RefreshCcw } from "lucide-react"
import axios from "axios"
import { useState, useEffect } from "react"
import { toast } from "sonner"

const API_BASE = ""

const EMPTY_FURNITURE = {
  ProductName: "",
  description: "",
  image: "",
  price: "",
  stock: "",
  subcategory_id: "",
}

export default function FurnituresPage() {
  const [furnitures, setFurnitures] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Form states
  const [furnitureForm, setFurnitureForm] = useState(EMPTY_FURNITURE)
  const [categoryForm, setCategoryForm] = useState({ name: "" })
  const [subcategoryForm, setSubcategoryForm] = useState({ name: "", category_id: "" })

  const [selectedFurniture, setSelectedFurniture] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [furnRes, catRes, subRes] = await Promise.all([
        axios.get(`${API_BASE}/api/furnitures/furnitures`),
        axios.get(`${API_BASE}/api/furnitures/categories`),
        axios.get(`${API_BASE}/api/furnitures/subcategories`),
      ])
      setFurnitures(furnRes.data)
      setCategories(catRes.data)
      setSubcategories(subRes.data)
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message)
      toast.error(err.response?.data?.detail || "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- Furniture Handlers ---
  const handleAddFurniture = async () => {
    const { ProductName, image, price, stock, subcategory_id } = furnitureForm
    if (!ProductName || !image || !price || !stock || !subcategory_id) {
      toast.error("Please fill all required fields")
      return
    }

    const payload = {
      ProductName,
      description: furnitureForm.description,
      image,
      price: parseFloat(price),
      stock: parseInt(stock),
      subcategory_id: parseInt(subcategory_id),
    }

    try {
      await axios.post(`${API_BASE}/api/furnitures/furnitures`, payload, {
        headers: getHeaders(),
      })
      toast.success("Furniture added successfully")
      setFurnitureForm(EMPTY_FURNITURE)
      setIsAddDialogOpen(false)
      fetchData()
    } catch (err) {
      console.error("Add Furniture Error:", err.response?.data || err.message)
      toast.error(err.response?.data?.detail || "Failed to add furniture")
    }
  }

  const handleUpdateFurniture = async () => {
    if (!selectedFurniture) return

    const payload = {
      ProductName: selectedFurniture.ProductName,
      description: selectedFurniture.description,
      image: selectedFurniture.image,
      price: parseFloat(selectedFurniture.price),
      stock: parseInt(selectedFurniture.stock),
      subcategory_id: parseInt(selectedFurniture.subcategory_id),
    }

    if (isNaN(payload.price) || isNaN(payload.stock) || isNaN(payload.subcategory_id)) {
      toast.error("Please fill all numeric fields correctly")
      return
    }

    try {
      await axios.put(
        `${API_BASE}/api/furnitures/furnitures/${selectedFurniture.ProductID}`,
        payload,
        { headers: getHeaders() }
      )
      toast.success("Furniture updated successfully")
      setIsEditDialogOpen(false)
      fetchData()
    } catch (err) {
      console.error("Update Furniture Error:", err.response?.data || err.message)
      toast.error(err.response?.data?.detail || "Failed to update furniture")
    }
  }

  const handleDeleteFurniture = async (id) => {
    if (!confirm("Are you sure you want to delete this furniture?")) return
    try {
      await axios.delete(`${API_BASE}/api/furnitures/furnitures/${id}`, {
        headers: getHeaders(),
      })
      toast.success("Furniture deleted")
      fetchData()
    } catch (err) {
      console.error("Delete Furniture Error:", err.response?.data || err.message)
      toast.error(err.response?.data?.detail || "Failed to delete furniture")
    }
  }

  // --- Category Handlers ---
  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required")
      return
    }
    try {
      await axios.post(`${API_BASE}/api/furnitures/categories`, categoryForm, {
        headers: getHeaders(),
      })
      toast.success("Category added")
      setCategoryForm({ name: "" })
      fetchData()
    } catch (err) {
      console.error("Add Category Error:", err.response?.data || err.message)
      toast.error(err.response?.data?.detail || "Failed to add category")
    }
  }

  // --- Subcategory Handlers ---
  const handleAddSubcategory = async () => {
    if (!subcategoryForm.name.trim() || !subcategoryForm.category_id) {
      toast.error("Name and parent category are required")
      return
    }
    try {
      const payload = {
        name: subcategoryForm.name,
        category_id: parseInt(subcategoryForm.category_id),
      }
      await axios.post(`${API_BASE}/api/furnitures/subcategories`, payload, {
        headers: getHeaders(),
      })
      toast.success("Subcategory added")
      setSubcategoryForm({ name: "", category_id: "" })
      fetchData()
    } catch (err) {
      console.error("Add Subcategory Error:", err.response?.data || err.message)
      toast.error(err.response?.data?.detail || "Failed to add subcategory")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3753]">Furniture Management</h1>
          <p className="text-gray-500 mt-1">Manage your products, categories and subcategories.</p>
        </div>
        <Button onClick={fetchData} variant="outline" className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <Tabs defaultValue="furnitures" className="w-full">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="furnitures" className="flex items-center gap-2">
            <Layers className="w-4 h-4" /> Furnitures ({furnitures.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="w-4 h-4" /> Categories ({categories.length})
          </TabsTrigger>
          <TabsTrigger value="subcategories" className="flex items-center gap-2">
            <Tag className="w-4 h-4" /> Subcategories ({subcategories.length})
          </TabsTrigger>
        </TabsList>

        {/* --- Furnitures Tab --- */}
        <TabsContent value="furnitures" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1e3753] hover:bg-[#2a4a6d]">
                  <Plus className="mr-2 h-4 w-4" /> Add Furniture
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Furniture</DialogTitle>
                </DialogHeader>
                <FurnitureForm
                  data={furnitureForm}
                  setData={setFurnitureForm}
                  subcategories={subcategories}
                />
                <Button onClick={handleAddFurniture} className="w-full mt-4 bg-[#1e3753] hover:bg-[#2a4a6d]">
                  Save Furniture
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="py-16 text-center text-gray-400">Loading furnitures...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[70px]">ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Subcategory</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {furnitures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-10 text-gray-400">
                        No furnitures found. Add your first product!
                      </TableCell>
                    </TableRow>
                  ) : (
                    furnitures.map((f) => (
                      <TableRow key={f.ProductID}>
                        <TableCell className="font-medium text-slate-400">#{f.ProductID}</TableCell>
                        <TableCell>
                          <img
                            src={f.image}
                            alt={f.ProductName}
                            className="h-10 w-10 rounded-lg object-cover border"
                            onError={(e) => { e.target.src = "/placeholder.jpg" }}
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700">{f.ProductName}</TableCell>
                        <TableCell className="text-slate-500">{f.subcategory?.category?.name ?? "—"}</TableCell>
                        <TableCell className="text-slate-500">{f.subcategory?.name ?? "—"}</TableCell>
                        <TableCell className="text-[#c8ad93] font-bold">${f.price?.toFixed(2)}</TableCell>
                        <TableCell>
                          {f.stock === 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : f.stock <= 5 ? (
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                              {f.stock} low
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              {f.stock} in stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          <div className="flex items-center gap-1 text-xs">
                            <Eye size={12} /> {f.views ?? 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedFurniture({ ...f, subcategory_id: f.subcategory_id })
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteFurniture(f.ProductID)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* --- Categories Tab --- */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border h-fit space-y-4 shadow-sm">
              <h3 className="font-bold text-lg text-[#1e3753]">Add Category</h3>
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  placeholder="e.g. Living Room"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ name: e.target.value })}
                />
              </div>
              <Button onClick={handleAddCategory} className="w-full bg-[#1e3753] hover:bg-[#2a4a6d]">
                <Plus className="w-4 h-4 mr-2" /> Create Category
              </Button>
            </div>
            <div className="md:col-span-2 rounded-xl border bg-white overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Subcategories</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                        No categories yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="text-slate-400">#{c.id}</TableCell>
                        <TableCell className="font-semibold">{c.name}</TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          {subcategories.filter((s) => s.category_id === c.id).length} subcategories
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* --- Subcategories Tab --- */}
        <TabsContent value="subcategories" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border h-fit space-y-4 shadow-sm">
              <h3 className="font-bold text-lg text-[#1e3753]">Add Subcategory</h3>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g. Sofas"
                  value={subcategoryForm.name}
                  onChange={(e) =>
                    setSubcategoryForm({ ...subcategoryForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select
                  value={String(subcategoryForm.category_id)}
                  onValueChange={(v) =>
                    setSubcategoryForm({ ...subcategoryForm, category_id: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddSubcategory}
                className="w-full bg-[#1e3753] hover:bg-[#2a4a6d]"
              >
                <Plus className="w-4 h-4 mr-2" /> Create Subcategory
              </Button>
            </div>
            <div className="md:col-span-2 rounded-xl border bg-white overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Parent Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subcategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                        No subcategories yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    subcategories.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="text-slate-400">#{s.id}</TableCell>
                        <TableCell className="font-semibold">{s.name}</TableCell>
                        <TableCell className="text-slate-500">{s.category?.name ?? "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Furniture Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Furniture</DialogTitle>
          </DialogHeader>
          {selectedFurniture && (
            <FurnitureForm
              data={selectedFurniture}
              setData={setSelectedFurniture}
              subcategories={subcategories}
            />
          )}
          <Button
            onClick={handleUpdateFurniture}
            className="w-full mt-4 bg-[#1e3753] hover:bg-[#2a4a6d]"
          >
            Update Furniture
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
