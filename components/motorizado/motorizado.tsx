"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Fingerprint, Utensils } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface MotorizadoData {
  name: string
  id: string
  startTime: string | null
  endTime: string | null
  lunchStartTime: string | null
  lunchEndTime: string | null
  date: string
  status: "active" | "inactive" | "lunch"
}

const mockMotorizadoData: MotorizadoData = {
  name: "Juan Pérez",
  id: "M001",
  startTime: null,
  endTime: null,
  lunchStartTime: null,
  lunchEndTime: null,
  date: new Date().toISOString().split("T")[0],
  status: "inactive",
}

const WORK_START_TIME = "07:00:00"
const WORK_END_TIME = "16:00:00"

export default function Motorizado() {
  const [motorizadoData, setMotorizadoData] = useState<MotorizadoData>(mockMotorizadoData)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanType, setScanType] = useState<"checkIn" | "checkOut" | "lunchStart" | "lunchEnd" | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const calculateElapsedTime = () => {
    if (!motorizadoData.startTime) return "No iniciado"
    const start = new Date(`${motorizadoData.date}T${motorizadoData.startTime}`)
    const end = motorizadoData.endTime ? new Date(`${motorizadoData.date}T${motorizadoData.endTime}`) : new Date()
    let diff = end.getTime() - start.getTime()

    // Subtract lunch time if applicable
    if (motorizadoData.lunchStartTime && motorizadoData.lunchEndTime) {
      const lunchStart = new Date(`${motorizadoData.date}T${motorizadoData.lunchStartTime}`)
      const lunchEnd = new Date(`${motorizadoData.date}T${motorizadoData.lunchEndTime}`)
      diff -= (lunchEnd.getTime() - lunchStart.getTime())
    }

    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    return `${hours}h ${minutes}m`
  }

  const calculateLateTime = () => {
    if (!motorizadoData.startTime) return "N/A"
    const start = new Date(`${motorizadoData.date}T${motorizadoData.startTime}`)
    const expectedStart = new Date(`${motorizadoData.date}T${WORK_START_TIME}`)
    if (start <= expectedStart) return "A tiempo"
    const diff = start.getTime() - expectedStart.getTime()
    const minutes = Math.floor(diff / 60000)
    return `${minutes} minutos`
  }

  const handleScanRequest = (type: "checkIn" | "checkOut" | "lunchStart" | "lunchEnd") => {
    setScanType(type)
    setIsScanning(true)
  }

  const handleScanComplete = () => {
    const currentTimeStr = new Date().toLocaleTimeString()
    setIsScanning(false)

    switch (scanType) {
      case "checkIn":
        setMotorizadoData((prev) => ({
          ...prev,
          startTime: currentTimeStr,
          status: "active",
        }))
        break
      case "checkOut":
        setMotorizadoData((prev) => ({
          ...prev,
          endTime: currentTimeStr,
          status: "inactive",
        }))
        break
      case "lunchStart":
        setMotorizadoData((prev) => ({
          ...prev,
          lunchStartTime: currentTimeStr,
          status: "lunch",
        }))
        break
      case "lunchEnd":
        setMotorizadoData((prev) => ({
          ...prev,
          lunchEndTime: currentTimeStr,
          status: "active",
        }))
        break
    }
    setScanType(null)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Motorizado</h1>
      <Card>
        <CardHeader>
          <CardTitle>{motorizadoData.name}</CardTitle>
          <CardDescription>ID: {motorizadoData.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-center p-4 bg-secondary rounded-lg">
              <Clock className="mr-2 h-4 w-4" />
              <span className="text-lg font-semibold">{currentTime}</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-secondary rounded-lg">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="text-lg font-semibold">{motorizadoData.date}</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span>Estado:</span>
              <Badge 
                variant={
                  motorizadoData.status === "active" ? "default" : 
                  motorizadoData.status === "lunch" ? "secondary" : "outline"
                }
              >
                {motorizadoData.status === "active" ? "Activo" : 
                 motorizadoData.status === "lunch" ? "Almuerzo" : "Inactivo"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Hora de inicio:</span>
              <Badge variant="outline">{motorizadoData.startTime || "No iniciado"}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Hora de finalización:</span>
              <Badge variant="outline">{motorizadoData.endTime || "En curso"}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Tiempo de almuerzo:</span>
              <Badge variant="outline">
                {motorizadoData.lunchStartTime && motorizadoData.lunchEndTime
                  ? `${motorizadoData.lunchStartTime} - ${motorizadoData.lunchEndTime}`
                  : "No registrado"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Tiempo transcurrido:</span>
              <Badge variant="outline">{calculateElapsedTime()}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Atraso:</span>
              <Badge variant="outline">{calculateLateTime()}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap justify-center mt-6 gap-4">
            <Button onClick={() => handleScanRequest("checkIn")} disabled={!!motorizadoData.startTime}>
              Registrar Entrada
            </Button>
            <Button onClick={() => handleScanRequest("lunchStart")} disabled={!motorizadoData.startTime || !!motorizadoData.lunchStartTime || !!motorizadoData.endTime}>
              Iniciar Almuerzo
            </Button>
            <Button onClick={() => handleScanRequest("lunchEnd")} disabled={!motorizadoData.lunchStartTime || !!motorizadoData.lunchEndTime}>
              Finalizar Almuerzo
            </Button>
            <Button
              onClick={() => handleScanRequest("checkOut")}
              disabled={!motorizadoData.startTime || !!motorizadoData.endTime}
            >
              Registrar Salida
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isScanning} onOpenChange={setIsScanning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {scanType === "checkIn" ? "Registrar Entrada" : 
               scanType === "checkOut" ? "Registrar Salida" :
               scanType === "lunchStart" ? "Iniciar Almuerzo" : "Finalizar Almuerzo"}
            </DialogTitle>
            <DialogDescription>Por favor, coloque su dedo en el lector de huellas digitales</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <Fingerprint className="h-16 w-16 text-primary animate-pulse" />
            <p className="mt-4 text-sm text-gray-500">Escaneando huella digital...</p>
          </div>
          <Button onClick={handleScanComplete} className="mt-4">
            Simular Escaneo Exitoso
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}