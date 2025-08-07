"use client"

import { useState } from "react"
import { Plus, Search, Phone, Mail, MapPin, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Sample vendors data
const vendors = [
  {
    id: 1,
    name: "Bean Masters Co.",
    contactPerson: "John Smith",
    email: "john@beanmasters.com",
    phone: "(555) 123-4567",
    address: "123 Coffee Street, Seattle, WA 98101",
    category: "Beverages",
    activeOrders: 2,
    totalOrders: 15,
    totalSpent: 25430.50,
    notes: "Premium coffee supplier with excellent quality control"
  },
  {
    id: 2,
    name: "Green Leaf Suppliers",
    contactPerson: "Sarah Johnson",
    email: "sarah@greenleaf.com",
    phone: "(555) 234-5678",
    address: "456 Tea Lane, Portland, OR 97201",
    category: "Beverages",
    activeOrders: 1,
    totalOrders: 12,
    totalSpent: 18750.25,
    notes: "Organic tea specialist with sustainable sourcing"
  },
  {
    id: 3,
    name: "Sweet Delights Inc.",
    contactPerson: "Mike Wilson",
    email: "mike@sweetdelights.com",
    phone: "(555) 345-6789",
    address: "789 Chocolate Ave, San Francisco, CA 94102",
    category: "Confectionery",
    activeOrders: 0,
    totalOrders: 8,
    totalSpent: 12340.75,
    notes: "Artisan chocolate and confectionery products"
  },
  {
    id: 4,
    name: "Spice World Ltd.",
    contactPerson: "Lisa Chen",
    email: "lisa@spiceworld.com",
    phone: "(555) 456-7890",
    address: "321 Spice Road, Los Angeles, CA 90210",
    category: "Spices",
    activeOrders: 1,
    totalOrders: 20,
    totalSpent: 8920.30,
    notes: "International spice importer with rare varieties"
  },
  {
    id: 5,
            name: "Nature&apos;s Best",
    contactPerson: "David Brown",
    email: "david@naturesbest.com",
    phone: "(555) 567-8901",
    address: "654 Natural Way, Denver, CO 80202",
    category: "Natural Products",
    activeOrders: 0,
    totalOrders: 6,
    totalSpent: 5670.80,
    notes: "Organic and natural product supplier"
  }
]

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<typeof vendors[0] | null>(null)

  // Add these state variables after the existing useState declarations
  const [vendorList, setVendorList] = useState(vendors)
  const [editingVendor, setEditingVendor] = useState<typeof vendors[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [vendorToDelete, setVendorToDelete] = useState<typeof vendors[0] | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Update filteredVendors to use vendorList state
  const filteredVendors = vendorList.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Add handler functions
  const handleEditVendor = (vendor: typeof vendors[0]) => {
    setEditingVendor(vendor)
    setIsEditDialogOpen(true)
  }

  const handleDeleteVendor = (vendor: typeof vendors[0]) => {
    setVendorToDelete(vendor)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteVendor = () => {
    if (vendorToDelete) {
      setVendorList(vendorList.filter(vendor => vendor.id !== vendorToDelete.id))
      setIsDeleteDialogOpen(false)
      setVendorToDelete(null)
    }
  }

  const handleSaveVendorEdit = (updatedVendor: typeof vendors[0]) => {
    setVendorList(vendorList.map(vendor => vendor.id === updatedVendor.id ? updatedVendor : vendor))
    setIsEditDialogOpen(false)
    setEditingVendor(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vendor Management</h1>
          <p className="text-muted-foreground">Manage your supplier relationships and contact information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>Add a new supplier to your vendor database.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input id="vendorName" placeholder="Enter vendor name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" placeholder="Enter contact person name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="(555) 123-4567" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter full address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., Beverages, Confectionery" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vendorNotes">Notes</Label>
                <Textarea id="vendorNotes" placeholder="Additional notes about this vendor" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Vendor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors, contacts, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vendors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vendor.name}</CardTitle>
                  <CardDescription>{vendor.category}</CardDescription>
                </div>
                <Badge variant="outline">{vendor.activeOrders} Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{vendor.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{vendor.address.split(',')[1]?.trim()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="font-semibold">{vendor.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="font-semibold">${vendor.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedVendor(vendor)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Vendor Details</DialogTitle>
                      <DialogDescription>{selectedVendor?.name}</DialogDescription>
                    </DialogHeader>
                    {selectedVendor && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Contact Person</Label>
                            <p>{selectedVendor.contactPerson}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Category</Label>
                            <p>{selectedVendor.category}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Email</Label>
                            <p>{selectedVendor.email}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Phone</Label>
                            <p>{selectedVendor.phone}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Address</Label>
                          <p>{selectedVendor.address}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Active Orders</Label>
                            <p className="text-lg font-semibold">{selectedVendor.activeOrders}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Total Orders</Label>
                            <p className="text-lg font-semibold">{selectedVendor.totalOrders}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Total Spent</Label>
                            <p className="text-lg font-semibold">${selectedVendor.totalSpent.toLocaleString()}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Notes</Label>
                          <p className="text-sm text-muted-foreground">{selectedVendor.notes}</p>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditVendor(vendor)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteVendor(vendor)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Edit Vendor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>Update vendor information</DialogDescription>
          </DialogHeader>
          {editingVendor && (
            <EditVendorForm
              vendor={editingVendor}
              onSave={handleSaveVendorEdit}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setEditingVendor(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Vendor Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Vendor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this vendor? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {vendorToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{vendorToDelete.name}</p>
                <p className="text-sm text-muted-foreground">Contact: {vendorToDelete.contactPerson}</p>
                <p className="text-sm text-muted-foreground">Total Orders: {vendorToDelete.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Total Spent: ${vendorToDelete.totalSpent.toLocaleString()}</p>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Deleting this vendor will not affect existing purchase orders, but you won&apos;t be able to create new orders for this vendor.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteVendor}>
              Delete Vendor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// EditVendorForm component (replace with your actual implementation)
function EditVendorForm({ vendor, onSave, onCancel }: { vendor: typeof vendors[0], onSave: (vendor: typeof vendors[0]) => void, onCancel: () => void }) {
  const [editedVendor, setEditedVendor] = useState({ ...vendor });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedVendor((prev: typeof vendors[0]) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="vendorName">Vendor Name</Label>
        <Input id="vendorName" name="name" placeholder="Enter vendor name" value={editedVendor.name} onChange={handleChange} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contactPerson">Contact Person</Label>
        <Input id="contactPerson" name="contactPerson" placeholder="Enter contact person name" value={editedVendor.contactPerson} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="email@example.com" value={editedVendor.email} onChange={handleChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" placeholder="(555) 123-4567" value={editedVendor.phone} onChange={handleChange} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" placeholder="Enter full address" value={editedVendor.address} onChange={handleChange} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" placeholder="e.g., Beverages, Confectionery" value={editedVendor.category} onChange={handleChange} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="vendorNotes">Notes</Label>
        <Textarea id="vendorNotes" name="notes" placeholder="Additional notes about this vendor" value={editedVendor.notes} onChange={handleChange} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(editedVendor)}>Save Changes</Button>
      </div>
    </div>
  );
}
