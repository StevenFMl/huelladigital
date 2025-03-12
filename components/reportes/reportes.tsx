"use client"

import { useState } from "react"
import { Calendar, Download, FileSpreadsheet, Filter, Printer, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, parseISO, differenceInMinutes } from "date-fns"
import { es } from "date-fns/locale"

type Role = "Motorizado" | "Secretario" | "Administrador"

interface AttendanceRecord {
  id: string
  date: string
  name: string
  role: Role
  checkIn: string
  checkOut: string
  lunchStart: string
  lunchEnd: string
  totalHours: number
  lateMinutes: number
  status: "presente" | "ausente" | "tarde"
}

const EXPECTED_CHECK_IN = "07:00:00"

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "ATT001",
    date: "2024-02-01",
    name: "Juan Pérez",
    role: "Motorizado",
    checkIn: "07:05:00",
    checkOut: "16:02:00",
    lunchStart: "12:00:00",
    lunchEnd: "13:00:00",
    totalHours: 8,
    lateMinutes: 5,
    status: "presente"
  },
  {
    id: "ATT002",
    date: "2024-02-01",
    name: "María López",
    role: "Secretario",
    checkIn: "07:15:00",
    checkOut: "16:10:00",
    lunchStart: "12:15:00",
    lunchEnd: "13:15:00",
    totalHours: 7.75,
    lateMinutes: 15,
    status: "tarde"
  },
  {
    id: "ATT003",
    date: "2024-02-01",
    name: "Carlos Ruiz",
    role: "Administrador",
    checkIn: "07:00:00",
    checkOut: "16:30:00",
    lunchStart: "12:30:00",
    lunchEnd: "13:30:00",
    totalHours: 8.5,
    lateMinutes: 0,
    status: "presente"
  },
]

export default function Reportes() {
  const [date, setDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState("daily")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")

  const handleExportExcel = () => {
    // Implementar exportación a Excel
    console.log("Exportando a Excel...")
  }

  const handlePrint = () => {
    // Implementar impresión
    window.print()
  }

  const formatTime = (time: string) => {
    return time ? format(parseISO(`2024-01-01T${time}`), "HH:mm") : "N/A"
  }

  const filteredRecords = mockAttendanceRecords.filter(record => 
    (roleFilter === "all" || record.role === roleFilter) &&
    record.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-screen bg-background">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Reportes de Asistencia</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleExportExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as Role | "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="Motorizado">Motorizado</SelectItem>
                  <SelectItem value="Secretario">Secretario</SelectItem>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Salida</TableHead>
                  <TableHead>Inicio Almuerzo</TableHead>
                  <TableHead>Fin Almuerzo</TableHead>
                  <TableHead className="text-right">Horas Totales</TableHead>
                  <TableHead className="text-right">Atraso (min)</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.role}</TableCell>
                    <TableCell>{formatTime(record.checkIn)}</TableCell>
                    <TableCell>{formatTime(record.checkOut)}</TableCell>
                    <TableCell>{formatTime(record.lunchStart)}</TableCell>
                    <TableCell>{formatTime(record.lunchEnd)}</TableCell>
                    <TableCell className="text-right">{record.totalHours.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {record.lateMinutes > 0 ? (
                        <span className="text-red-600 font-medium">{record.lateMinutes}</span>
                      ) : (
                        "0"
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${record.status === 'presente' ? 'bg-green-100 text-green-800' :
                          record.status === 'tarde' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}