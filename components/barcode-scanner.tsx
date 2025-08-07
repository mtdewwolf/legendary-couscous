"use client"

import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, X, Flashlight, FlashlightOff, RotateCcw } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (barcode: string, quantity?: number) => void
  mode: 'add' | 'update' | 'lookup'
}

export function BarcodeScanner({ isOpen, onClose, onScan, mode }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [manualBarcode, setManualBarcode] = useState("")
  const [error, setError] = useState("")
  const [hasFlash, setHasFlash] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const streamRef = useRef<MediaStream | null>(null)
  const [manualQuantity, setManualQuantity] = useState(1)

  const getModeTitle = () => {
    switch (mode) {
      case 'add': return 'Scan Barcode - Add Item'
      case 'update': return 'Scan Barcode - Update Stock'
      case 'lookup': return 'Scan Barcode - Quick Lookup'
      default: return 'Scan Barcode'
    }
  }

  const getModeDescription = () => {
    switch (mode) {
      case 'add': return 'Scan a barcode to add a new item to inventory'
      case 'update': return 'Scan a barcode to quickly update stock quantity'
      case 'lookup': return 'Scan a barcode to find and view item details'
      default: return 'Scan a barcode'
    }
  }

  // Get available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setCameras(videoDevices)
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId)
        }
      } catch (err) {
        setError("Unable to access camera devices")
      }
    }
    
    if (isOpen) {
      getCameras()
    }
  }, [isOpen])

  // Start camera
  const startCamera = async (deviceId?: string) => {
    try {
      setError("")
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: deviceId ? undefined : { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Check if flash is available
      const track = stream.getVideoTracks()[0]
      const capabilities = track.getCapabilities()
      setHasFlash('torch' in capabilities)
      
      setIsScanning(true)
    } catch (err) {
      setError("Unable to access camera. Please ensure camera permissions are granted.")
      console.error("Camera error:", err)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
    setFlashOn(false)
  }

  // Toggle flash
  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0]
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flashOn } as any]
        })
        setFlashOn(!flashOn)
      } catch (err) {
        console.error("Flash toggle error:", err)
      }
    }
  }

  // Switch camera
  const switchCamera = (deviceId: string) => {
    setSelectedCamera(deviceId)
    stopCamera()
    startCamera(deviceId)
  }

  // Simulate barcode detection (in a real app, you'd use a barcode detection library)
  useEffect(() => {
    if (!isScanning || !videoRef.current) return

    const detectBarcode = () => {
      // This is a simulation - in a real implementation, you would use:
      // - ZXing library
      // - QuaggaJS
      // - @zxing/library
      // - Browser's native BarcodeDetector API (if available)
      
      // For demo purposes, we'll simulate detection after a few seconds
      const simulatedBarcodes = [
        "1234567890123",
        "2345678901234", 
        "3456789012345",
        "4567890123456",
        "5678901234567"
      ]
      
      setTimeout(() => {
        if (isScanning) {
          const randomBarcode = simulatedBarcodes[Math.floor(Math.random() * simulatedBarcodes.length)]
          handleBarcodeDetected(randomBarcode)
        }
      }, 3000) // Simulate detection after 3 seconds
    }

    detectBarcode()
  }, [isScanning])

  const handleBarcodeDetected = (barcode: string) => {
    stopCamera()
    onScan(barcode, manualQuantity)
  }

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim(), manualQuantity)
      setManualBarcode("")
      setManualQuantity(1)
    }
  }

  const handleClose = () => {
    stopCamera()
    setManualBarcode("")
    setError("")
    onClose()
  }

  useEffect(() => {
    if (isOpen && selectedCamera) {
      startCamera(selectedCamera)
    }
    
    return () => {
      stopCamera()
    }
  }, [isOpen, selectedCamera])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getModeTitle()}</DialogTitle>
          <DialogDescription>{getModeDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Camera View */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-red-500 w-64 h-32 relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-red-500"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-red-500"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-red-500"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-red-500"></div>
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Camera controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {hasFlash && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleFlash}
                  className="bg-black/50 hover:bg-black/70"
                >
                  {flashOn ? <FlashlightOff className="h-4 w-4" /> : <Flashlight className="h-4 w-4" />}
                </Button>
              )}
              
              {cameras.length > 1 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const currentIndex = cameras.findIndex(cam => cam.deviceId === selectedCamera)
                    const nextIndex = (currentIndex + 1) % cameras.length
                    switchCamera(cameras[nextIndex].deviceId)
                  }}
                  className="bg-black/50 hover:bg-black/70"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Manual entry */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manualBarcode">Enter barcode manually:</Label>
                <Input
                  id="manualBarcode"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Enter barcode number"
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manualQuantity">Quantity:</Label>
                <Input
                  id="manualQuantity"
                  type="number"
                  min="1"
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(parseInt(e.target.value) || 1)}
                  placeholder="1"
                />
              </div>
            </div>
            <Button onClick={handleManualSubmit} disabled={!manualBarcode.trim()} className="w-full">
              Add Item (Qty: {manualQuantity})
            </Button>
          </div>

          {/* Status */}
          {isScanning && (
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <div>
                <Camera className="h-4 w-4 inline mr-2" />
                Position barcode within the red frame to scan
              </div>
              <div className="text-xs bg-blue-50 p-2 rounded">
                Quantity to add: <span className="font-semibold">{manualQuantity}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            {!isScanning && (
              <Button onClick={() => startCamera(selectedCamera)}>
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
