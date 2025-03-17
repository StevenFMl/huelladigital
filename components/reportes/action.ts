'use server'
import {createClient} from "@/utils/supabase/server";
import * as XLSX from "xlsx"
import { format } from "date-fns"


export async function getReports(date:Date|null) {
    if(date==null){
        return []
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateParsed = `${year}-${month}-${day}`
    const supabase = await createClient();
    const {data, error} = await supabase.from('reports').select("*, user_id(*)").eq("date",dateParsed).limit(300);
    return data;

}

export async function searchUserById(identificacion:string){
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('reports')
        .select('*, user_id(*)')
        .eq('user_id.identification', identificacion)
        .not('user_id', 'is', null) // Asegúrate de que user_id no sea nulo
        .order('created_at', { ascending: false })
        .limit(360);
    if(error){
        return null;
    }
    return data;
}


function formatTime(time: string) {
    if (!time) return "N/A"
    try {
        return format(new Date(`2024-01-01T${time}`), "HH:mm")
    } catch (error) {
        return "N/A"
    }
}

export async function exportToExcel(reports: any[]): Promise<string> {
    try {
        // Convert reports to a simpler format for Excel
        const data = reports.map((record) => ({
            Fecha: record.date,
            Nombre: record.user_id.name,
            Rol: record.user_id.rol,
            Entrada: formatTime(record.enter),
            Salida: formatTime(record.exit),
            "Inicio Almuerzo": formatTime(record.start_lunch),
            "Fin Almuerzo": formatTime(record.end_lunch),
            "Atraso (min)": formatTime(record.backwardness),
            Estado: record.enter != null ? "Presente" : "Falto",
        }))

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(data)

        // Create workbook
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Reportes")

        // Generate Excel file as base64 string
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "base64" })

        // Return as data URL
        return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excelBuffer}`
    } catch (error) {
        console.error("Error generating Excel:", error)
        return ""
    }
}

export async function exportToPDF(reports: any[]): Promise<string> {
    try {
        // Create HTML content for PDF
        const rows = reports
            .map(
                (record) => `
      <tr>
        <td>${record.date}</td>
        <td>${record.user_id.name}</td>
        <td>${record.user_id.rol}</td>
        <td>${formatTime(record.enter)}</td>
        <td>${formatTime(record.exit)}</td>
        <td>${formatTime(record.start_lunch)}</td>
        <td>${formatTime(record.end_lunch)}</td>
        <td>${formatTime(record.backwardness)}</td>
        <td class="${record.enter != null ? "present" : "absent"}">${record.enter != null ? "Presente" : "Falto"}</td>
      </tr>
    `,
            )
            .join("")

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Asistencia</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
          }
          h1 { 
            text-align: center; 
            margin-bottom: 20px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background-color: #f2f2f2; 
            font-weight: bold;
          }
          .present {
            background-color: #e8f5e9;
            color: #2e7d32;
          }
          .absent {
            background-color: #ffebee;
            color: #c62828;
          }
          @media print {
            body { 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <h1>Reporte de Asistencia</h1>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Inicio Almuerzo</th>
              <th>Fin Almuerzo</th>
              <th>Atraso (min)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
      </html>
    `

        return htmlContent
    } catch (error) {
        console.error("Error generating PDF:", error)
        return ""
    }
}

