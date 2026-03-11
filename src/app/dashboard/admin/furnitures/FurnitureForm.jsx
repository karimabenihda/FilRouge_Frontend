"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useState ,useEffect} from "react"

export default function FurnitureForm({ data, setData, categories }) {
    


  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          placeholder="Furniture name"
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
        />
      </div>

      <div>
        <Label>Category</Label>
        <Select value={String(data.id_category)} onValueChange={v => setData({ ...data, id_category: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category, i) => (
              <SelectItem key={i} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="Furniture description"
          value={data.description}
          onChange={e => setData({ ...data, description: e.target.value })}
        />
      </div>

      <div>
        <Label>Price</Label>
        <Input
          type="number"
          min={0}
          placeholder="Furniture price"
          value={data.price}
          onChange={e => setData({ ...data, price: e.target.value })}
        />
      </div>

      <div>
        <Label>Stock</Label>
        <Input
          type="number"
          min={0}
          placeholder="Stock"
          value={data.stock}
          onChange={e => setData({ ...data, stock: e.target.value })}
        />
      </div>

      <div>
        <Label>Image URL</Label>
        <Input
          type="text"
          placeholder="https://image.url"
          value={data.image}
          onChange={e => setData({ ...data, image: e.target.value })}
        />
      </div>
    </div>
  )
}
