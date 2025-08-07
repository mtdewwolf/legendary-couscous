"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditItemFormProps {
  item: {
    id: number
    productName: string
    barcode: string
    ourCost: number
    vendor: string
    orderNumber: string
    onHand: number
    reorderLevel: number
    category: string
  }
  vendors: string[]
  onSave: (item: typeof item) => void
  onCancel: () => void
}

export function EditItemForm({ item, vendors, onSave, onCancel }: EditItemFormProps) {
  const [formData, setFormData] = useState({
    productName: item.productName,
    barcode: item.barcode,
    ourCost: item.ourCost.toString(),
    vendor: item.vendor,
    orderNumber: item.orderNumber,
    onHand: item.onHand.toString(),
    reorderLevel: item.reorderLevel.toString(),
    category: item.category
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...item,
      productName: formData.productName,
      barcode: formData.barcode,
      ourCost: parseFloat(formData.ourCost) || 0,
      vendor: formData.vendor,
      orderNumber: formData.orderNumber,
      onHand: parseInt(formData.onHand) || 0,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      category: formData.category
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="edit-barcode">Barcode</Label>
        <Input
          id="edit-barcode"
          value={formData.barcode}
          onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-productName">Product Name</Label>
        <Input
          id="edit-productName"
          value={formData.productName}
          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-cost">Our Cost</Label>
        <Input
          id="edit-cost"
          type="number"
          step="0.01"
          value={formData.ourCost}
          onChange={(e) => setFormData({ ...formData, ourCost: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-vendor">Vendor</Label>
        <Select value={formData.vendor} onValueChange={(value) => setFormData({ ...formData, vendor: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {vendors.map(vendor => (
              <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-onHand">On Hand Quantity</Label>
        <Input
          id="edit-onHand"
          type="number"
          value={formData.onHand}
          onChange={(e) => setFormData({ ...formData, onHand: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-reorderLevel">Reorder Level</Label>
        <Input
          id="edit-reorderLevel"
          type="number"
          value={formData.reorderLevel}
          onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  )
}
