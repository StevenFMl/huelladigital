"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Fingerprint, Utensils, CheckCircle, AlertCircle } from "lucide-react"
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
      diff -= lunchEnd.getTime() - lunchStart.getTime()
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

  const getStatusColor = () => {
    switch (motorizadoData.status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "lunch":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const isLate = () => {
    if (!motorizadoData.startTime) return false
    const start = new Date(`${motorizadoData.date}T${motorizadoData.startTime}`)
    const expectedStart = new Date(`${motorizadoData.date}T${WORK_START_TIME}`)
    return start > expectedStart
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Motorizado</h1>
      <Card className="shadow-lg border-t-4 border-t-blue-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">{motorizadoData.name}</CardTitle>
              <CardDescription>ID: {motorizadoData.id}</CardDescription>
            </div>
            <Badge className={`text-sm px-3 py-1 ${getStatusColor()}`}>
              {motorizadoData.status === "active"
                ? "Activo"
                : motorizadoData.status === "lunch"
                  ? "Almuerzo"
                  : "Inactivo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center justify-center p-4 bg-secondary/50 rounded-lg shadow-inner">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold">{currentTime}</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-secondary/50 rounded-lg shadow-inner">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold">{motorizadoData.date}</span>
            </div>
          </div>

          <div className="bg-secondary/30 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-sm uppercase text-muted-foreground mb-3">Registro de hoy</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  Entrada:
                </span>
                <Badge variant={motorizadoData.startTime ? "outline" : "secondary"} className="font-mono">
                  {motorizadoData.startTime || "No registrado"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Utensils className="mr-2 h-4 w-4 text-muted-foreground" />
                  Almuerzo:
                </span>
                <Badge variant="outline" className="font-mono">
                  {motorizadoData.lunchStartTime && motorizadoData.lunchEndTime
                    ? `${motorizadoData.lunchStartTime} - ${motorizadoData.lunchEndTime}`
                    : motorizadoData.lunchStartTime
                      ? `${motorizadoData.lunchStartTime} - En curso`
                      : "No registrado"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  Salida:
                </span>
                <Badge variant={motorizadoData.endTime ? "outline" : "secondary"} className="font-mono">
                  {motorizadoData.endTime || "No registrado"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <h3 className="font-medium text-sm uppercase text-muted-foreground mb-2">Tiempo trabajado</h3>
              <p className="text-2xl font-bold">{calculateElapsedTime()}</p>
            </div>

            <div className="bg-secondary/30 p-4 rounded-lg">
              <h3 className="font-medium text-sm uppercase text-muted-foreground mb-2">Estado de llegada</h3>
              <div className="flex items-center">
                {isLate() ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-lg font-semibold text-red-500">Atraso: {calculateLateTime()}</p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-lg font-semibold text-green-500">
                      {motorizadoData.startTime ? "A tiempo" : "Pendiente"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button
              onClick={() => handleScanRequest("checkIn")}
              disabled={!!motorizadoData.startTime}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Clock className="mr-2 h-4 w-4" />
              Registrar Entrada
            </Button>

            <Button
              onClick={() => handleScanRequest("lunchStart")}
              disabled={!motorizadoData.startTime || !!motorizadoData.lunchStartTime || !!motorizadoData.endTime}
              variant="outline"
              size="lg"
            >
              <Utensils className="mr-2 h-4 w-4" />
              Iniciar Almuerzo
            </Button>

            <Button
              onClick={() => handleScanRequest("lunchEnd")}
              disabled={!motorizadoData.lunchStartTime || !!motorizadoData.lunchEndTime}
              variant="outline"
              size="lg"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Finalizar Almuerzo
            </Button>

            <Button
              onClick={() => handleScanRequest("checkOut")}
              disabled={!motorizadoData.startTime || !!motorizadoData.endTime}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Clock className="mr-2 h-4 w-4" />
              Registrar Salida
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isScanning} onOpenChange={setIsScanning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {scanType === "checkIn"
                ? "Registrar Entrada"
                : scanType === "checkOut"
                  ? "Registrar Salida"
                  : scanType === "lunchStart"
                    ? "Iniciar Almuerzo"
                    : "Finalizar Almuerzo"}
            </DialogTitle>
            <DialogDescription>Por favor, coloque su dedo en el lector de huellas digitales</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-25 animate-ping"></div>
              <Fingerprint className="h-20 w-20 text-blue-600 relative z-10" />
            </div>
            <p className="mt-4 text-sm text-gray-500">Escaneando huella digital...</p>
          </div>
          <div className="flex justify-center">
            <Button onClick={handleScanComplete} className="w-full sm:w-auto">
              Simular Escaneo Exitoso
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

