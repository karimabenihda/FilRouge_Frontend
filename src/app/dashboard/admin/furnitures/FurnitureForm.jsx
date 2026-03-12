"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FurnitureForm({ data, setData, subcategories }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Product Name</Label>
        <Input
          placeholder="Furniture name"
          value={data.ProductName || ""}
          onChange={e => setData({ ...data, ProductName: e.target.value })}
        />
      </div>

      <div>
        <Label>Subcategory</Label>
        <Select 
          value={data.subcategory_id ? String(data.subcategory_id) : ""} 
          onValueChange={v => setData({ ...data, subcategory_id: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent>
            {subcategories?.map((sub) => (
              <SelectItem key={sub.id} value={String(sub.id)}>
                {sub.name} ({sub.category?.name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="Furniture description"
          value={data.description || ""}
          onChange={e => setData({ ...data, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={data.price || ""}
            onChange={e => setData({ ...data, price: e.target.value })}
          />
        </div>
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={data.stock || ""}
            onChange={e => setData({ ...data, stock: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Image URL</Label>
        <Input
          type="text"
          placeholder="https://image.url"
          value={data.image || ""}
          onChange={e => setData({ ...data, image: e.target.value })}
        />
      </div>
    </div>
  )
}
