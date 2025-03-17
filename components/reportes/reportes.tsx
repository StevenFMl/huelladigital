"use client"
import {useEffect, useState} from "react"
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
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {exportToExcel, exportToPDF, getReports, searchUserById} from "@/components/reportes/action";
import {Badge} from "@/components/ui/badge";
import { getTimeEnterprise } from "../settings/action"
import { getReportUserInformation } from "../motorizado/action"

type Role = "Motorizado" | "Secretario" | "Admin"

interface UserProps
{
  id: string,
  name: string,
  rol: Role,
  email:string
}
interface ReportProps
{
  id: string,
  created_at: string,
  date: string,
  user_id: UserProps,
  enter: string,
  exit: any,
  start_lunch: any,
  end_lunch: any,
  total_hours: any,
  backwardness: any,
  state: null
}


export default function Reportes() {
  const [date, setDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState("daily")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [reports, setReports] = useState<List<ReportProps>>([])
  const [isLoading, setIsLoading] = useState<{ excel: boolean; pdf: boolean }>({ excel: false, pdf: false })
  const [timeEnteprise, setTimeEnterprise] = useState("00:00")
  

  const formatTime = (time: string) => {
    return time ? format(parseISO(`2024-01-01T${time}`), "HH:mm") : "N/A"
  }

  const formatTimeBackwardness = (time: string) => {
    // Crear fechas con la misma fecha base pero con las horas proporcionadas
    const fecha1 = new Date(`2000-01-01T${time}`);
    const fecha2 = new Date(`2000-01-01T${timeEnteprise}`);

    // Calcular la diferencia en milisegundos
    const diferenciaMs = fecha2.getTime() - fecha1.getTime();

    // Convertir milisegundos a minutos (1 minuto = 60,000 ms)
    const diferenciaMinutos = diferenciaMs / 60000;
    if(Number.isNaN(Math.abs(diferenciaMinutos))){
      return "0";
    }
    return Math.abs(diferenciaMinutos).toFixed(0).toString();
  }

  async function loadData() {
    const [enterTime, result] = await Promise.all([
      getTimeEnterprise(),
      getReports(date)
    ]);
    if(enterTime!=null){
      setTimeEnterprise(enterTime);
    }
    setReports(result);
  }
 

  

  useEffect(() => {
    loadData();
  }, [date]);

  const filteredReports = reports.filter((report: ReportProps) => {
    const matchesRole = roleFilter === "all" || report.user_id.rol === roleFilter;
    return matchesRole;
  });
  const handleExportExcel = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, excel: true }))

      // Call server action to get data URL
      const dataUrl = await exportToExcel(filteredReports)

      if (!dataUrl) {
        throw new Error("Failed to generate Excel file")
      }

      // Create a link and trigger download
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `reporte-asistencia-${format(date, "yyyy-MM-dd")}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Error al exportar a Excel. Por favor, intente de nuevo.")
    } finally {
      setIsLoading((prev) => ({ ...prev, excel: false }))
    }
  }
  const handleExportPDF = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, pdf: true }))

      // Get HTML content from server
      const htmlContent = await exportToPDF(filteredReports)

      if (!htmlContent) {
        throw new Error("Failed to generate PDF content")
      }

      // Create a new window with the HTML content
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        alert("Por favor, permita ventanas emergentes para descargar el PDF")
        return
      }

      // Write the HTML content to the new window
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait for the content to load
      setTimeout(() => {
        // Print the window content
        printWindow.print()

        // Close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close()
        }
      }, 1000)
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      alert("Error al exportar a PDF. Por favor, intente de nuevo.")
    } finally {
      setIsLoading((prev) => ({ ...prev, pdf: false }))
    }
  }
  async function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if(e.key === "Enter") {
     if(searchTerm.length===0){
        await loadData();
        return;
     }
      let results = await searchUserById(searchTerm)
      setReports(results
      )

    }
  }
  return (
      <div className="h-screen bg-background">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Reportes de Asistencia</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleExportExcel} disabled={isLoading.excel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Button>

                <Button variant="outline" onClick={handleExportPDF} disabled={isLoading.pdf}>
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
                      placeholder="Buscar por cédula..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleSearch}
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
                    <SelectItem value="Admin">Administrador</SelectItem>
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
                    <TableHead className="text-right">Atraso (min)</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((record:ReportProps) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.user_id.name}</TableCell>
                        <TableCell>{record.user_id.rol}</TableCell>
                        <TableCell>{formatTime(record.enter)}</TableCell>
                        <TableCell>{formatTime(record.exit)}</TableCell>
                        <TableCell>{formatTime(record.start_lunch)}</TableCell>
                        <TableCell>{formatTime(record.end_lunch)}</TableCell>
                        <TableCell className="text-right">
                          {formatTimeBackwardness(record.enter)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${record.enter!=null?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`}>
                            {record.enter!=null?"Presente":"No se Presento"}
                          </Badge>
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