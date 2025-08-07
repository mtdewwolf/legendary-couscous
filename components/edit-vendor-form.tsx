"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditVendorFormProps {
  vendor: {
    id: number
    name: string
    contactPerson: string
    email: string
    phone: string
    address: string
    category: string
    activeOrders: number
    totalOrders: number
    totalSpent: number
    notes: string
  }
  onSave: (vendor: typeof vendor) => void
  onCancel: () => void
}

export function EditVendorForm({ vendor, onSave, onCancel }: EditVendorFormProps) {
  const [formData, setFormData] = useState({
    name: vendor.name,
    contactPerson: vendor.contactPerson,
    email: vendor.email,
    phone: vendor.phone,
    address: vendor.address,
    category: vendor.category,
    notes: vendor.notes
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...vendor,
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      category: formData.category,
      notes: formData.notes
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="edit-vendorName">Vendor Name</Label>
        <Input
          id="edit-vendorName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-contactPerson">Contact Person</Label>
        <Input
          id="edit-contactPerson"
          value={formData.contactPerson}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-phone">Phone</Label>
          <Input
            id="edit-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-address">Address</Label>
        <Textarea
          id="edit-address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-category">Category</Label>
        <Input
          id="edit-category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="e.g., Beverages, Confectionery"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-vendorNotes">Notes</Label>
        <Textarea
          id="edit-vendorNotes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about this vendor"
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
