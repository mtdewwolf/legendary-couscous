"use client"

import { useState } from "react"
import { Scan, Package, CheckCircle, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EditReceivingOrderForm } from "./edit-receiving-order-form"

// Sample receiving data
const pendingOrders = [
  {
    id: 1,
    orderNumber: "PO-2024-001",
    vendor: "Bean Masters Co.",
    expectedDate: "2024-01-22",
    items: [
      { barcode: "1234567890123", name: "Premium Coffee Beans - Colombian", expected: 50, received: 0 },
      { barcode: "1234567890124", name: "Premium Coffee Beans - Ethiopian", expected: 30, received: 0 }
    ]
  },
  {
    id: 2,
    orderNumber: "PO-2024-002", 
    vendor: "Green Leaf Suppliers",
    expectedDate: "2024-01-20",
    items: [
      { barcode: "2345678901234", name: "Organic Green Tea Leaves", expected: 100, received: 0 },
      { barcode: "2345678901235", name: "Chamomile Tea", expected: 50, received: 0 }
    ]
  }
]

export default function ReceivingPage() {
  const [selectedOrder, setSelectedOrder] = useState<string>("")
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [receivingItems, setReceivingItems] = useState<any[]>([])
  const [manualQuantity, setManualQuantity] = useState("")

  // Add these state variables after the existing useState declarations
  const [orders, setOrders] = useState(pendingOrders)
  const [editingOrder, setEditingOrder] = useState<typeof pendingOrders[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<typeof pendingOrders[0] | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Add handler functions
  const handleEditReceivingOrder = (order: typeof pendingOrders[0]) => {
    setEditingOrder(order)
    setIsEditDialogOpen(true)
  }

  const handleDeleteReceivingOrder = (order: typeof pendingOrders[0]) => {
    setOrderToDelete(order)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteReceivingOrder = () => {
    if (orderToDelete) {
      setOrders(orders.filter(order => order.id !== orderToDelete.id))
      setIsDeleteDialogOpen(false)
      setOrderToDelete(null)
      // Clear selected order if it was deleted
      if (selectedOrder === orderToDelete.orderNumber) {
        setSelectedOrder("")
        setReceivingItems([])
      }
    }
  }

  const handleSaveReceivingOrderEdit = (updatedOrder: typeof pendingOrders[0]) => {
    setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order))
    setIsEditDialogOpen(false)
    setEditingOrder(null)
  }

  const handleBarcodeScanned = (barcode: string, quantity: number = 1) => {
    setIsScannerOpen(false)
    
    // Find the item in the selected order
    const order = orders.find(o => o.orderNumber === selectedOrder)
    if (!order) {
      alert("Please select a purchase order first")
      return
    }

    const item = order.items.find(i => i.barcode === barcode)
    if (!item) {
      alert(`Item with barcode ${barcode} not found in order ${selectedOrder}`)
      return
    }

    // Add to receiving list or update quantity
    const existingIndex = receivingItems.findIndex(ri => ri.barcode === barcode)
    if (existingIndex >= 0) {
      const updated = [...receivingItems]
      updated[existingIndex].receivedQuantity += quantity
      setReceivingItems(updated)
    } else {
      setReceivingItems([...receivingItems, {
        ...item,
        receivedQuantity: quantity,
        orderNumber: selectedOrder
      }])
    }
  }

  const updateReceivedQuantity = (barcode: string, quantity: number) => {
    const updated = receivingItems.map(item => 
      item.barcode === barcode ? { ...item, receivedQuantity: quantity } : item
    )
    setReceivingItems(updated)
  }

  const removeFromReceiving = (barcode: string) => {
    setReceivingItems(receivingItems.filter(item => item.barcode !== barcode))
  }

  const completeReceiving = () => {
    if (receivingItems.length === 0) {
      alert("No items to receive")
      return
    }

    // In a real app, this would update the database
    alert(`Received ${receivingItems.length} items successfully!`)
    setReceivingItems([])
    setSelectedOrder("")
  }

  const getItemStatus = (expected: number, received: number) => {
    if (received === 0) return { status: "Pending", variant: "outline" as const }
    if (received < expected) return { status: "Partial", variant: "secondary" as const }
    if (received === expected) return { status: "Complete", variant: "default" as const }
    return { status: "Over", variant: "destructive" as const }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Receiving</h1>
        <p className="text-muted-foreground">Receive and process incoming inventory shipments</p>
      </div>

      {/* Order Selection */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Select Purchase Order</CardTitle>
              <CardDescription>Choose the purchase order you're receiving</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!selectedOrder}
                onClick={() => {
                  const order = orders.find(o => o.orderNumber === selectedOrder)
                  if (order) handleEditReceivingOrder(order)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!selectedOrder}
                onClick={() => {
                  const order = orders.find(o => o.orderNumber === selectedOrder)
                  if (order) handleDeleteReceivingOrder(order)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Order
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Select value={selectedOrder} onValueChange={setSelectedOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Select a purchase order" />
            </SelectTrigger>
            <SelectContent>
              {orders.map(order => (
                <SelectItem key={order.orderNumber} value={order.orderNumber}>
                  {order.orderNumber} - {order.vendor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Expected Items */}
      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Expected Items</CardTitle>
            <CardDescription>Items expected in {selectedOrder}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders
                  .find(o => o.orderNumber === selectedOrder)
                  ?.items.map((item) => {
                    const receivedItem = receivingItems.find(ri => ri.barcode === item.barcode)
                    const receivedQty = receivedItem?.receivedQuantity || 0
                    const status = getItemStatus(item.expected, receivedQty)
                    
                    return (
                      <TableRow key={item.barcode}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="font-mono text-sm">{item.barcode}</TableCell>
                        <TableCell>{item.expected}</TableCell>
                        <TableCell>{receivedQty}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.status}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Scanning Controls */}
      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Receive Items</CardTitle>
            <CardDescription>Scan barcodes or manually enter quantities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={() => setIsScannerOpen(true)}
                className="flex-1"
              >
                <Scan className="h-4 w-4 mr-2" />
                Scan Barcode
              </Button>
              <div className="flex gap-2">
                <Input
                  placeholder="Manual quantity"
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(e.target.value)}
                  type="number"
                  className="w-32"
                />
                <Button variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Receiving Summary */}
      {receivingItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Items Being Received</CardTitle>
            <CardDescription>Review and confirm received quantities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receivingItems.map((item) => (
                  <TableRow key={item.barcode}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.expected}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.receivedQuantity}
                        onChange={(e) => updateReceivedQuantity(item.barcode, parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromReceiving(item.barcode)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setReceivingItems([])}>
                Clear All
              </Button>
              <Button onClick={completeReceiving}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Receiving
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Barcode Scanner */}
      {isScannerOpen && (
        <BarcodeScanner
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScan={handleBarcodeScanned}
          mode="update"
        />
      )}

      {/* Edit Receiving Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Receiving Order</DialogTitle>
            <DialogDescription>Update order details for receiving</DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <EditReceivingOrderForm
              order={editingOrder}
              onSave={handleSaveReceivingOrderEdit}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setEditingOrder(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Receiving Order Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Receiving Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this order from receiving? This will not affect the original purchase order.
            </DialogDescription>
          </DialogHeader>
          {orderToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{orderToDelete.orderNumber}</p>
                <p className="text-sm text-muted-foreground">Vendor: {orderToDelete.vendor}</p>
                <p className="text-sm text-muted-foreground">Items: {orderToDelete.items.length}</p>
                <p className="text-sm text-muted-foreground">Expected: {orderToDelete.expectedDate}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteReceivingOrder}>
              Remove from Receiving
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
