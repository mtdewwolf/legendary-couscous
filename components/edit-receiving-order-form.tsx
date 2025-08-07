"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from 'lucide-react'

interface EditReceivingOrderFormProps {
  order: {
    id: number
    orderNumber: string
    vendor: string
    expectedDate: string
    items: Array<{
      barcode: string
      name: string
      expected: number
      received: number
    }>
  }
  onSave: (order: any) => void
  onCancel: () => void
}

export function EditReceivingOrderForm({ order, onSave, onCancel }: EditReceivingOrderFormProps) {
  const [formData, setFormData] = useState({
    expectedDate: order.expectedDate,
    items: [...order.items]
  })

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { barcode: '', name: '', expected: 0, received: 0 }]
    })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setFormData({ ...formData, items: updatedItems })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...order,
      expectedDate: formData.expectedDate,
      items: formData.items
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label>Order Number</Label>
        <Input value={order.orderNumber} disabled />
      </div>
      
      <div className="grid gap-2">
        <Label>Vendor</Label>
        <Input value={order.vendor} disabled />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="edit-expectedDate">Expected Date</Label>
        <Input
          id="edit-expectedDate"
          type="date"
          value={formData.expectedDate}
          onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Expected Items</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Barcode</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Expected Qty</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formData.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={item.barcode}
                    onChange={(e) => updateItem(index, 'barcode', e.target.value)}
                    placeholder="Barcode"
                    className="font-mono"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    placeholder="Item name"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.expected}
                    onChange={(e) => updateItem(index, 'expected', parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
