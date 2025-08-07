"use client"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Scan, Camera } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { QuickStockUpdate } from "@/components/quick-stock-update"
import { EditItemForm } from "@/components/edit-item-form"

// Sample inventory data
const inventoryItems = [
  {
    id: 1,
    productName: "Premium Coffee Beans - Colombian",
    barcode: "1234567890123",
    ourCost: 12.50,
    vendor: "Bean Masters Co.",
    orderNumber: "PO-2024-001",
    onHand: 150,
    reorderLevel: 50,
    category: "Beverages"
  },
  {
    id: 2,
    productName: "Organic Green Tea Leaves",
    barcode: "2345678901234",
    ourCost: 8.75,
    vendor: "Green Leaf Suppliers",
    orderNumber: "PO-2024-002",
    onHand: 8,
    reorderLevel: 25,
    category: "Beverages"
  },
  {
    id: 3,
    productName: "Artisan Dark Chocolate Bars",
    barcode: "3456789012345",
    ourCost: 4.25,
    vendor: "Sweet Delights Inc.",
    orderNumber: "PO-2024-003",
    onHand: 75,
    reorderLevel: 30,
    category: "Confectionery"
  },
  {
    id: 4,
    productName: "Himalayan Pink Salt",
    barcode: "4567890123456",
    ourCost: 6.50,
    vendor: "Spice World Ltd.",
    orderNumber: "PO-2024-004",
    onHand: 3,
    reorderLevel: 15,
    category: "Spices"
  },
  {
    id: 5,
    productName: "Organic Honey - Raw",
    barcode: "5678901234567",
    ourCost: 15.00,
    vendor: "Nature's Best",
    orderNumber: "PO-2024-005",
    onHand: 45,
    reorderLevel: 20,
    category: "Natural Products"
  }
]

const vendors = [
  "Bean Masters Co.",
  "Green Leaf Suppliers", 
  "Sweet Delights Inc.",
  "Spice World Ltd.",
  "Nature's Best"
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendor, setSelectedVendor] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [scanMode, setScanMode] = useState<'add' | 'update' | 'lookup'>('add')
  const [scannedBarcode, setScannedBarcode] = useState("")
  const [quickUpdateItem, setQuickUpdateItem] = useState<typeof inventoryItems[0] | null>(null)

  // Add these state variables after the existing useState declarations
  const [items, setItems] = useState(inventoryItems)
  const [editingItem, setEditingItem] = useState<typeof inventoryItems[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<typeof inventoryItems[0] | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Update the filteredItems to use the items state instead of inventoryItems
  const filteredItems = items.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVendor = selectedVendor === "all" || item.vendor === selectedVendor
    return matchesSearch && matchesVendor
  })

  const getStockStatus = (onHand: number, reorderLevel: number) => {
    if (onHand === 0) return { status: "Out of Stock", variant: "destructive" as const }
    if (onHand <= reorderLevel) return { status: "Low Stock", variant: "secondary" as const }
    return { status: "In Stock", variant: "default" as const }
  }

  const handleBarcodeScanned = (barcode: string, mode: 'add' | 'update' | 'lookup') => {
    setScannedBarcode(barcode)
    setIsScannerOpen(false)
    
    if (mode === 'lookup') {
      // Find item by barcode and highlight it
      const foundItem = inventoryItems.find(item => item.barcode === barcode)
      if (foundItem) {
        setSearchTerm(foundItem.productName)
      } else {
        alert(`No item found with barcode: ${barcode}`)
      }
    } else if (mode === 'add') {
      // Pre-fill the add dialog with barcode
      setIsAddDialogOpen(true)
    } else if (mode === 'update') {
    // Open quick update dialog
      const foundItem = inventoryItems.find(item => item.barcode === barcode)
      if (foundItem) {
        setQuickUpdateItem(foundItem)
      } else {
        alert(`No item found with barcode: ${barcode}`)
      }
    }
  }

  const handleStockUpdate = (itemId: number, newQuantity: number, updateType: 'set' | 'add' | 'subtract') => {
    // In a real app, this would update the database
    console.log(`Updating item ${itemId} with quantity ${newQuantity} (${updateType})`)
    alert(`Stock updated successfully!`)
  }

  // Add these handler functions before the return statement
  const handleEditItem = (item: typeof inventoryItems[0]) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const handleDeleteItem = (item: typeof inventoryItems[0]) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems(items.filter(item => item.id !== itemToDelete.id))
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleSaveEdit = (updatedItem: typeof inventoryItems[0]) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item))
    setIsEditDialogOpen(false)
    setEditingItem(null)
  }



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your product inventory and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setScanMode('lookup')
              setIsScannerOpen(true)
            }}
          >
            <Scan className="h-4 w-4 mr-2" />
            Quick Lookup
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setScanMode('update')
              setIsScannerOpen(true)
            }}
          >
            <Camera className="h-4 w-4 mr-2" />
            Update Stock
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>Add a new product to your inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="barcode" 
                      placeholder="Enter or scan barcode" 
                      value={scannedBarcode}
                      onChange={(e) => setScannedBarcode(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setScanMode('add')
                        setIsScannerOpen(true)
                      }}
                    >
                      <Scan className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input id="productName" placeholder="Enter product name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost">Our Cost</Label>
                  <Input id="cost" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map(vendor => (
                        <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="onHand">On Hand Quantity</Label>
                  <Input id="onHand" type="number" placeholder="0" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input id="reorderLevel" type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false)
                  setScannedBarcode("")
                }}>Cancel</Button>
                <Button onClick={() => {
                  setIsAddDialogOpen(false)
                  setScannedBarcode("")
                }}>Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items or vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map(vendor => (
                  <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            {filteredItems.length} items found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Our Cost</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Order Number</TableHead>
                <TableHead>On Hand</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item.onHand, item.reorderLevel)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="font-mono text-sm">{item.barcode}</TableCell>
                    <TableCell>${item.ourCost.toFixed(2)}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.orderNumber}</TableCell>
                    <TableCell>
                      <span className={item.onHand <= item.reorderLevel ? "text-orange-600 font-medium" : ""}>
                        {item.onHand}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>{stockStatus.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isScannerOpen && (
        <BarcodeScanner
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScan={(barcode) => handleBarcodeScanned(barcode, scanMode)}
          mode={scanMode}
        />
      )}
      <QuickStockUpdate
        isOpen={!!quickUpdateItem}
        onClose={() => setQuickUpdateItem(null)}
        item={quickUpdateItem}
        onUpdate={handleStockUpdate}
      />
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update the product information.</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <EditItemForm
              item={editingItem}
              vendors={vendors}
              onSave={handleSaveEdit}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setEditingItem(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {itemToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{itemToDelete.productName}</p>
                <p className="text-sm text-muted-foreground">Barcode: {itemToDelete.barcode}</p>
                <p className="text-sm text-muted-foreground">Current Stock: {itemToDelete.onHand}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
