'use server'

import { createClient } from "@/utils/supabase/server"
import { loadUserInformation, loadUserInformationID } from "../layout";

export async function getReportUserInformation() {
    const supabase = await createClient();
    const response = await loadUserInformationID();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateParsed = `${year}-${month}-${day}`

    const {data,error} = await supabase.from("reports").select("*").eq("user_id",response).eq("date", dateParsed);
    if(error){
        return null;
    }
    return data[0];

}

export async function updateEnter(){
    const supabase = await createClient();
    const response = await loadUserInformationID();
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const {data,error} = await supabase.from("reports").update({enter:`${horas}:${minutos}`}).eq("user_id",response);
    return;

}
export async function updateExit(){
    const supabase = await createClient();
    const response = await loadUserInformationID();
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const {data,error} = await supabase.from("reports").update({exit:`${horas}:${minutos}`}).eq("user_id",response);
    return;

}
export async function updateLunchStart(){
    const supabase = await createClient();
    const response = await loadUserInformationID();
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const {data,error} = await supabase.from("reports").update({start_lunch:`${horas}:${minutos}`}).eq("user_id",response);
    return;

}
export async function updateLunchEnd(){
    const supabase = await createClient();
    const response = await loadUserInformationID();
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const {data,error} = await supabase.from("reports").update({end_lunch:`${horas}:${minutos}`}).eq("user_id",response);
    return;

}
