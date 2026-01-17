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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
            </DialogHeader>

            <InventoryForm />

            <Button>Save</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 max-w-md">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="chair">Chair</SelectItem>
            <SelectItem value="table">Table</SelectItem>
            <SelectItem value="sofa">Sofa</SelectItem>
            <SelectItem value="bed">Bed</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Search item..." />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>101</TableCell>
            <TableCell>Modern Chair</TableCell>
            <TableCell>Chair</TableCell>
            <TableCell>24</TableCell>
            <TableCell>
              <span className="text-green-600 text-sm font-medium">
                In Stock
              </span>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Inventory</DialogTitle>
                  </DialogHeader>

                  <InventoryForm />

                  <Button>Update</Button>
                </DialogContent>
              </Dialog>

              <Button size="icon" variant="destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

/* ---------- FORM UI ---------- */

function InventoryForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label>Product Name</Label>
        <Input placeholder="Product name" />
      </div>

      <div>
        <Label>Category</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chair">Chair</SelectItem>
            <SelectItem value="table">Table</SelectItem>
            <SelectItem value="sofa">Sofa</SelectItem>
            <SelectItem value="bed">Bed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Stock Quantity</Label>
        <Input type="number" placeholder="0" />
      </div>

      <div>
        <Label>Status</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
