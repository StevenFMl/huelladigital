"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Fingerprint, Utensils, CheckCircle, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getReportUserInformation, updateEnter, updateExit, updateLunchEnd, updateLunchStart } from "./action"
import { format, parseISO } from "date-fns"


export default function SecretarioData() {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanType, setScanType] = useState<"checkIn" | "checkOut" | "lunchStart" | "lunchEnd" | null>(null)
  const [informationReport, setinformationReport] = useState<any>(null);
  const [loadingUpdate, setloadingUpdate] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])





  const handleScanRequest = (type: "checkIn" | "checkOut" | "lunchStart" | "lunchEnd") => {
    setScanType(type)
    setIsScanning(true)
  }

  useEffect(() => {
    getReportUserInformation().then((result) => {
      setinformationReport(result)
    })


  }, [])
  const handleScanComplete = async () => {
    setloadingUpdate(true);
    switch (scanType) {
      case "checkIn":
        await updateEnter();
        const data = await getReportUserInformation();
        setinformationReport(data)
        setIsScanning(false)
        setloadingUpdate(false);

        break
      case "checkOut":
        await updateExit();
        const data2 = await getReportUserInformation();
        setinformationReport(data2)
        setIsScanning(false)
        setloadingUpdate(false);

        break
      case "lunchStart":
        await updateLunchStart();
        const data3 = await getReportUserInformation();
        setinformationReport(data3)
        setIsScanning(false)
        setloadingUpdate(false);

        break
      case "lunchEnd":
        await updateLunchEnd();
        const data4 = await getReportUserInformation();
        setinformationReport(data4)
        setIsScanning(false)
        setloadingUpdate(false);

        break
    }
    setScanType(null)
  }



  const formatTime = (time: string) => {
    return time ? format(parseISO(`2024-01-01T${time}`), "HH:mm") : "N/A"
  }

  const getWorkTime = (time: string | null, timeExit:string|null) => {
    if (!time) return "0:00"; // Manejar caso nulo

    // Obtener la hora de entrada
    const fecha1 = new Date(`2000-01-01T${time}`);
    let fecha2 = null;
    // Obtener la hora actual
    if(timeExit!=null){
      fecha2 = new Date(`2000-01-01T${timeExit}`);

    }else{
      fecha2 = new Date();
    }

    // Crear nuevas fechas usando solo las horas, minutos y segundos (mismo día)
    const horaInicio = new Date();
    horaInicio.setHours(fecha1.getHours(), fecha1.getMinutes(), fecha1.getSeconds(), 0);

    const horaActual = new Date();
    horaActual.setHours(fecha2.getHours(), fecha2.getMinutes(), fecha2.getSeconds(), 0);

    // Calcular la diferencia en milisegundos
    let diferenciaMs = horaActual.getTime() - horaInicio.getTime();

    // Si la diferencia es negativa (la hora de inicio es mayor que la actual),
    // asumimos que se refiere a un turno que cruza la medianoche
    if (diferenciaMs < 0) {
      diferenciaMs += 24 * 60 * 60 * 1000; // Añadir 24 horas
    }

    // Convertir a horas
    const diferenciaHoras = diferenciaMs / 3600000;

    if (Number.isNaN(diferenciaHoras)) {
      return "0:00";
    }

    // Extraer horas y minutos
    const horas = Math.floor(diferenciaHoras);
    const minutos = Math.floor((diferenciaHoras - horas) * 60);

    // Formatear como H:MM o HH:MM
    return `${horas}:${minutos.toString().padStart(2, '0')}`;
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Secretario</h1>
      {informationReport && <Card className="shadow-lg border-t-4 border-t-blue-500">
        <CardHeader className="pb-2">

        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center justify-center p-4 bg-secondary/50 rounded-lg shadow-inner">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold">{currentTime}</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-secondary/50 rounded-lg shadow-inner">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold">
                {informationReport.date}
              </span>
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
                <Badge className="font-mono">
                  {formatTime(informationReport?.enter)}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Utensils className="mr-2 h-4 w-4 text-muted-foreground" />
                  Almuerzo:
                </span>
                <Badge variant="outline" className="font-mono">
                  {formatTime(informationReport?.start_lunch)} - {" "}
                  {formatTime(informationReport?.end_lunch)}

                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  Salida:
                </span>
                <Badge className="font-mono">
                  {formatTime(informationReport?.exit)}

                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <h3 className="font-medium text-sm uppercase text-muted-foreground mb-2">Tiempo trabajado</h3>
              <p className="text-2xl font-bold">
                {getWorkTime(informationReport.enter, informationReport.exit)}
              </p>
            </div>

            <div className="bg-secondary/30 p-4 rounded-lg">
              <h3 className="font-medium text-sm uppercase text-muted-foreground mb-2">Estado de llegada</h3>
              <div className="flex items-center">
                {
                  informationReport.enter !== null ? "PRESENTE" : "NO PRESENTE"
                }
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button
              onClick={() => handleScanRequest("checkIn")}
              disabled={informationReport.enter !== null}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Clock className="mr-2 h-4 w-4" />
              Registrar Entrada
            </Button>

            <Button
              onClick={() => handleScanRequest("lunchStart")}
              disabled={informationReport.start_lunch !== null}

              variant="outline"
              size="lg"
            >
              <Utensils className="mr-2 h-4 w-4" />
              Iniciar Almuerzo
            </Button>

            <Button
              onClick={() => handleScanRequest("lunchEnd")}
              variant="outline"
              disabled={informationReport.end_lunch !== null}

              size="lg"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Finalizar Almuerzo
            </Button>

            <Button
              onClick={() => handleScanRequest("checkOut")}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={informationReport.exit !== null}

              size="lg"
            >
              <Clock className="mr-2 h-4 w-4" />
              Registrar Salida
            </Button>
          </div>
        </CardContent>
      </Card>}

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
            <Button disabled={loadingUpdate} onClick={handleScanComplete} className="w-full sm:w-auto">
              Simular Escaneo Exitoso
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

