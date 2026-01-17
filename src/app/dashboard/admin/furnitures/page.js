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
import { Textarea } from "@/components/ui/textarea"
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

export default function FurnituresPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Furnitures</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Furniture
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Furniture</DialogTitle>
            </DialogHeader>

            <FurnitureForm />

            <Button>Save</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="max-w-xs">
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
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Modern Chair</TableCell>
            <TableCell>Chair</TableCell>
            <TableCell className="max-w-xs truncate">
              Comfortable modern wooden chair
            </TableCell>
            <TableCell>
              <img
                src="https://via.placeholder.com/40"
                className="h-10 w-10 rounded object-cover"
                alt=""
              />
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
                    <DialogTitle>Edit Furniture</DialogTitle>
                  </DialogHeader>

                  <FurnitureForm />

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

function FurnitureForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input placeholder="Furniture name" />
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
        <Label>Description</Label>
        <Textarea placeholder="Furniture description" />
      </div>

      <div>
        <Label>Image URL</Label>
        <Input placeholder="https://image.url" />
      </div>
    </div>
  )
}
