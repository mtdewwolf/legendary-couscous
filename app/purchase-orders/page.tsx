"use client"

import { useState } from "react"
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Sample purchase orders data
const purchaseOrders = [
  {
    id: 1,
    orderNumber: "PO-2024-001",
    vendor: "Bean Masters Co.",
    orderDate: "2024-01-15",
    expectedDate: "2024-01-22",
    status: "Pending",
    items: [
      { name: "Premium Coffee Beans - Colombian", quantity: 50, cost: 12.50 },
      { name: "Premium Coffee Beans - Ethiopian", quantity: 30, cost: 14.00 }
    ],
    total: 1045.00,
    notes: "Rush order for weekend promotion"
  },
  {
    id: 2,
    orderNumber: "PO-2024-002",
    vendor: "Green Leaf Suppliers",
    orderDate: "2024-01-16",
    expectedDate: "2024-01-20",
    status: "Shipped",
    items: [
      { name: "Organic Green Tea Leaves", quantity: 100, cost: 8.75 },
      { name: "Chamomile Tea", quantity: 50, cost: 6.50 },
      { name: "Earl Grey Tea", quantity: 75, cost: 7.25 }
    ],
    total: 1868.75,
    notes: "Regular monthly order"
  },
  {
    id: 3,
    orderNumber: "PO-2024-003",
    vendor: "Sweet Delights Inc.",
    orderDate: "2024-01-18",
    expectedDate: "2024-01-25",
    status: "Delivered",
    items: [
      { name: "Artisan Dark Chocolate Bars", quantity: 200, cost: 4.25 },
      { name: "Milk Chocolate Truffles", quantity: 100, cost: 6.50 },
      { name: "White Chocolate Squares", quantity: 150, cost: 5.75 }
    ],
    total: 2362.50,
    notes: "Valentine's Day stock"
  }
]

const vendors = [
  "Bean Masters Co.",
  "Green Leaf Suppliers", 
  "Sweet Delights Inc.",
  "Spice World Ltd.",
  "Nature's Best"
]

export default function PurchaseOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<typeof purchaseOrders[0] | null>(null)

  // Add these state variables after the existing useState declarations
  const [orders, setOrders] = useState(purchaseOrders)
  const [editingOrder, setEditingOrder] = useState<typeof purchaseOrders[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<typeof purchaseOrders[0] | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Update filteredOrders to use orders state
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status.toLowerCase() === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Add handler functions
  const handleEditOrder = (order: typeof purchaseOrders[0]) => {
    setEditingOrder(order)
    setIsEditDialogOpen(true)
  }

  const handleDeleteOrder = (order: typeof purchaseOrders[0]) => {
    setOrderToDelete(order)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(orders.filter(order => order.id !== orderToDelete.id))
      setIsDeleteDialogOpen(false)
      setOrderToDelete(null)
    }
  }

  const handleSaveOrderEdit = (updatedOrder: typeof purchaseOrders[0]) => {
    setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order))
    setIsEditDialogOpen(false)
    setEditingOrder(null)
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'default'
      case 'shipped': return 'secondary'
      case 'pending': return 'outline'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage purchase orders and vendor relationships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Purchase Order</DialogTitle>
              <DialogDescription>Create a new purchase order for your vendor.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="expectedDate">Expected Delivery</Label>
                  <Input id="expectedDate" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Order notes or special instructions" />
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <Label>Order Items</Label>
                  <Button variant="outline" size="sm">Add Item</Button>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-sm font-medium">
                    <span>Item</span>
                    <span>Quantity</span>
                    <span>Cost</span>
                    <span>Total</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Input placeholder="Item name" />
                    <Input type="number" placeholder="0" />
                    <Input type="number" step="0.01" placeholder="0.00" />
                    <Input disabled placeholder="$0.00" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Create Order</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders or vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>
            {filteredOrders.length} orders found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(order.expectedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Purchase Order Details</DialogTitle>
                            <DialogDescription>{selectedOrder?.orderNumber}</DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Vendor</Label>
                                  <p>{selectedOrder.vendor}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Status</Label>
                                  <div className="mt-1">
                                    <Badge variant={getStatusVariant(selectedOrder.status)}>
                                      {selectedOrder.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Order Date</Label>
                                  <p>{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Expected Date</Label>
                                  <p>{new Date(selectedOrder.expectedDate).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Items</Label>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Item</TableHead>
                                      <TableHead>Quantity</TableHead>
                                      <TableHead>Cost</TableHead>
                                      <TableHead>Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedOrder.items.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>${item.cost.toFixed(2)}</TableCell>
                                        <TableCell>${(item.quantity * item.cost).toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Notes</Label>
                                <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                              </div>
                              <div className="text-right">
                                <Label className="text-lg font-bold">Total: ${selectedOrder.total.toFixed(2)}</Label>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" onClick={() => handleEditOrder(order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteOrder(order)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
            <DialogDescription>Update purchase order details</DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <EditOrderForm
              order={editingOrder}
              vendors={vendors}
              onSave={handleSaveOrderEdit}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setEditingOrder(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Order Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Purchase Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this purchase order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {orderToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{orderToDelete.orderNumber}</p>
                <p className="text-sm text-muted-foreground">Vendor: {orderToDelete.vendor}</p>
                <p className="text-sm text-muted-foreground">Total: ${orderToDelete.total.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Status: {orderToDelete.status}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteOrder}>
              Delete Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface EditOrderFormProps {
  order: typeof purchaseOrders[0];
  vendors: string[];
  onSave: (updatedOrder: typeof purchaseOrders[0]) => void;
  onCancel: () => void;
}

const EditOrderForm: React.FC<EditOrderFormProps> = ({ order, vendors, onSave, onCancel }) => {
  const [editedOrder, setEditedOrder] = useState({ ...order });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...editedOrder.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditedOrder(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setEditedOrder(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, cost: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    const updatedItems = [...editedOrder.items];
    updatedItems.splice(index, 1);
    setEditedOrder(prev => ({ ...prev, items: updatedItems }));
  };

  const calculateTotal = () => {
    return editedOrder.items.reduce((acc, item) => acc + (item.quantity * item.cost), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...editedOrder, total: calculateTotal() });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="vendor">Vendor</Label>
          <Select value={editedOrder.vendor} onValueChange={(value) => handleInputChange({ target: { name: 'vendor', value } } as React.ChangeEvent<HTMLInputElement>)}>
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
          <Label htmlFor="expectedDate">Expected Delivery</Label>
          <Input
            id="expectedDate"
            type="date"
            name="expectedDate"
            value={editedOrder.expectedDate}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Order notes or special instructions"
          value={editedOrder.notes}
          onChange={handleInputChange}
        />
      </div>
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <Label>Order Items</Label>
          <Button variant="outline" size="sm" type="button" onClick={addItem}>Add Item</Button>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-2 text-sm font-medium">
            <span>Item</span>
            <span>Quantity</span>
            <span>Cost</span>
            <span>Total</span>
            <span>Actions</span>
          </div>
          {editedOrder.items.map((item, index) => (
            <div className="grid grid-cols-5 gap-2" key={index}>
              <Input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              />
              <Input
                type="number"
                placeholder="0"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={item.cost}
                onChange={(e) => handleItemChange(index, 'cost', parseFloat(e.target.value))}
              />
              <Input disabled placeholder={`$${(item.quantity * item.cost).toFixed(2)}`} />
              <Button variant="ghost" size="sm" type="button" onClick={() => removeItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};
