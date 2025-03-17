'use client';

import { use, useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getTimeEnterprise, saveTimeEnterprise } from './action';

export default function CompanyTimeConfig() {
  // Estado para almacenar la hora seleccionada
  const [entryTime, setEntryTime] = useState('00:00');
  const [loading, setLoading] = useState(false);

  // Generar opciones de hora (de 5:00 AM a 11:00 PM)
  const timeOptions = [];
  for (let hour = 5; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  // Función para guardar los cambios
  const saveChanges = () => {
    setLoading(true);
    saveTimeEnterprise(entryTime).then(()=>{
        setLoading(false);
    })
  };

  useEffect(() => {
   getTimeEnterprise().then((e)=>{
    if(e!=null){
        setEntryTime(e);
    }
   })
  }, []);

  return (
    
    <div className="flex flex-col bg-background">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Configuración de Cuenta
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
                  Establece la hora de entrada para tu empresa
                </CardDescription>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="company-entry-time" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Hora de entrada
                </label>
                <Select
                  value={entryTime}
                  onValueChange={setEntryTime}
                >
                  <SelectTrigger id="company-entry-time" className="w-full">
                    <SelectValue placeholder="Selecciona la hora de entrada" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Esta será la hora oficial de entrada para todos los empleados
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end bg-gray-50 dark:bg-gray-800/50 py-3 px-6 border-t border-gray-100 dark:border-gray-700">
            <Button 
              onClick={saveChanges} 
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </CardFooter>
        </Card>

    
      </div>
    </div>
  );
}