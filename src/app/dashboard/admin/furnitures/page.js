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
import { Plus, Pencil, Trash2 } from "lucide-react"
import axios from "axios"
import { useState ,useEffect} from "react"

export default function page() {
    const [formdata, setFormdata] = useState({ name:"", description:"", image:"", price:"", stock:"", id_category:"" })
  const [categories, setCategories] = useState([])
  const [furnitures, setFurnitures] = useState([])
  const [selectedFurniture, setSelectedFurniture] = useState(null)

  
 useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/sales/get_categories")
      .then(res => setCategories(res.data))
      .catch(console.log)
  }, [])

  // Fetch furnitures
  const fetchFurnitures = () => {
    axios.get("http://127.0.0.1:8000/api/sales/get_furnitures")
      .then(res => setFurnitures(res.data))
      .catch(console.log)
  }

  useEffect(() => {
    fetchFurnitures()
  }, [])

  // Add furniture
  const addFurniture = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/sales/add_furniturs", {
        ...formdata,
        price: Number(formdata.price),
        stock: Number(formdata.stock),
        id_category: Number(formdata.id_category)
      })
      fetchFurnitures()
      setFormdata({ name:"", description:"", image:"", price:"", stock:"", id_category:"" })
    } catch (err) {
      console.log(err)
    }
  }

  // Delete furniture
  const deleteFurniture = async (id) => {
    if(!confirm("Are you sure?")) return
    try{
      await axios.delete(`http://127.0.0.1:8000/api/sales/delete_furniture/${id}`)
      setFurnitures(prev => prev.filter(f => f.id !== id))
    } catch(err) {
      console.log(err)
    }
  }

  // Update furniture
  const updateFurniture = async () => {
    try{
      await axios.put(`http://127.0.0.1:8000/api/sales/update_furniture/${selectedFurniture.id}`, {
        ...selectedFurniture,
        price: Number(selectedFurniture.price),
        stock: Number(selectedFurniture.stock),
        id_category: Number(selectedFurniture.id_category)
      })
      fetchFurnitures()
      setSelectedFurniture(null)
    } catch(err) {
      console.log(err)
    }
  }


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

            <FurnitureForm data={formdata} setData={setFormdata} categories={categories}/>

            <Button onClick={addFurniture}>Save</Button>
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
         <SelectContent>
  {categories.map((category,i) => (
    <SelectItem key={i} value={i}>
      {category.name}
    </SelectItem>
  ))}
</SelectContent>
    
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
          {furnitures?.map((furniture) => (
          <TableRow key={furniture.id}>
            <TableCell>{furniture.id}</TableCell>
            <TableCell>{furniture.name}</TableCell>
            <TableCell>{furniture.id_category}</TableCell>
            <TableCell className="max-w-xs truncate">
              {furniture.description}
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/* ---------- FORM UI ---------- */

// function FurnitureForm() {
//   return (
//     <div className="space-y-4">
//       <div>
//         <Label>Name</Label>
//         <Input placeholder="Furniture name" />
//       </div>

//       <div>
//         <Label>Category</Label>
//           <Select>
//           <SelectTrigger>
//             <SelectValue placeholder="Filter by category" />
//           </SelectTrigger>
//           <SelectContent>
//          <SelectContent>
//   {categories.map((category,i) => (
//     <SelectItem key={i} value={i}>
//       {category.name}
//     </SelectItem>
//   ))}
// </SelectContent>
    
//           </SelectContent>
//         </Select>
//       </div>

//       <div>
//         <Label>Description</Label>
//         <Textarea placeholder="Furniture description" />
//       </div>
// <div>
//         <Label>Price</Label>
//         <Input type="number" min={0}  placeholder="Furniture price" />
//       </div>
//       <div>
//         <Label>Image URL</Label>
//         <Input type="file" placeholder="https://image.url" />
//       </div>
//     </div>
//   )
// }
