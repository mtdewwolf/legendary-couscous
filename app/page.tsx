"use client"

import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, DollarSign, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data
const dashboardStats = {
  totalItems: 1247,
  lowStockItems: 23,
  pendingOrders: 8,
  totalVendors: 15,
  monthlySpend: 45230,
  inventoryValue: 234500
}

const lowStockItems = [
  { name: "Premium Coffee Beans", onHand: 5, reorderLevel: 20, vendor: "Bean Masters Co." },
  { name: "Organic Tea Leaves", onHand: 8, reorderLevel: 25, vendor: "Green Leaf Suppliers" },
  { name: "Artisan Chocolate", onHand: 12, reorderLevel: 30, vendor: "Sweet Delights Inc." },
  { name: "Specialty Spices", onHand: 3, reorderLevel: 15, vendor: "Spice World Ltd." }
]

const recentOrders = [
  { orderNumber: "PO-2024-001", vendor: "Bean Masters Co.", items: 5, total: 2450, status: "Pending" },
  { orderNumber: "PO-2024-002", vendor: "Green Leaf Suppliers", items: 3, total: 1200, status: "Shipped" },
  { orderNumber: "PO-2024-003", vendor: "Sweet Delights Inc.", items: 8, total: 3200, status: "Delivered" },
  { orderNumber: "PO-2024-004", vendor: "Spice World Ltd.", items: 2, total: 890, status: "Pending" }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome to Gold Mine Distro Inventory Management</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 border border-blue-200 dark:border-blue-800">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Live System</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{dashboardStats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need reordering</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Purchase orders pending</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalVendors}</div>
            <p className="text-xs text-muted-foreground">Registered suppliers</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardStats.monthlySpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month&apos;s purchases</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardStats.inventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total inventory worth</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Low Stock Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Items
            </CardTitle>
            <CardDescription>Items that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>On Hand</TableHead>
                  <TableHead>Vendor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{item.onHand}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.vendor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Purchase Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-purple-500" />
              Recent Purchase Orders
            </CardTitle>
            <CardDescription>Latest purchase order activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell className="text-sm">{order.vendor}</TableCell>
                    <TableCell>${order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.status === 'Delivered' ? 'default' : 
                          order.status === 'Shipped' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
