"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Package } from 'lucide-react'

interface QuickStockUpdateProps {
  isOpen: boolean
  onClose: () => void
  item: {
    id: number
    productName: string
    barcode: string
    onHand: number
    reorderLevel: number
    vendor: string
  } | null
  onUpdate: (itemId: number, newQuantity: number, updateType: 'set' | 'add' | 'subtract') => void
}

export function QuickStockUpdate({ isOpen, onClose, item, onUpdate }: QuickStockUpdateProps) {
  const [quantity, setQuantity] = useState("")
  const [updateType, setUpdateType] = useState<'set' | 'add' | 'subtract'>('set')

  if (!item) return null

  const handleUpdate = () => {
    const qty = parseInt(quantity)
    if (!isNaN(qty) && qty >= 0) {
      onUpdate(item.id, qty, updateType)
      setQuantity("")
      onClose()
    }
  }

  const getNewQuantity = () => {
    const qty = parseInt(quantity) || 0
    switch (updateType) {
      case 'add': return item.onHand + qty
      case 'subtract': return Math.max(0, item.onHand - qty)
      case 'set': return qty
      default: return item.onHand
    }
  }

  const getStockStatus = (qty: number) => {
    if (qty === 0) return { status: "Out of Stock", variant: "destructive" as const }
    if (qty <= item.reorderLevel) return { status: "Low Stock", variant: "secondary" as const }
    return { status: "In Stock", variant: "default" as const }
  }

  const newQuantity = getNewQuantity()
  const newStatus = getStockStatus(newQuantity)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Quick Stock Update</DialogTitle>
          <DialogDescription>Update inventory quantity for scanned item</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{item.productName}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Barcode: {item.barcode}</p>
              <p>Vendor: {item.vendor}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Current Stock:</span>
              <span className="font-bold text-lg">{item.onHand}</span>
            </div>
          </div>

          {/* Update Type Selection */}
          <div className="space-y-2">
            <Label>Update Type</Label>
            <div className="flex gap-2">
              <Button
                variant={updateType === 'set' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUpdateType('set')}
              >
                Set To
              </Button>
              <Button
                variant={updateType === 'add' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUpdateType('add')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button
                variant={updateType === 'subtract' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUpdateType('subtract')}
              >
                <Minus className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">
              {updateType === 'set' ? 'New Quantity' : 
               updateType === 'add' ? 'Quantity to Add' : 
               'Quantity to Remove'}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
            />
          </div>

          {/* Preview */}
          {quantity && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Stock Level:</span>
                <span className="font-bold text-lg">{newQuantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status:</span>
                <Badge variant={newStatus.variant}>{newStatus.status}</Badge>
              </div>
              {newQuantity <= item.reorderLevel && (
                <p className="text-sm text-orange-600">
                  ⚠️ This will put the item below reorder level ({item.reorderLevel})
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={!quantity || isNaN(parseInt(quantity))}
            >
              Update Stock
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
