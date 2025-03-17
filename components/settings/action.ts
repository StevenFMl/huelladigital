'use server'

import { createClient } from "@/utils/supabase/server"

export async function getTimeEnterprise(){
    const supabase = await createClient();
    const {data, error} = await supabase.from("settings").select("*").eq("id", 1)
    if(error){
        return null
    }
    return `${data[0].enter.split(":")[0]}:${data[0].enter.split(":")[1]}`;
}


export async function saveTimeEnterprise(time:string){
    const supabase = await createClient();
    const {data, error} = await supabase.from("settings").update({enter: time}).eq("id", 1)
    if(error){
        return null
    }
    return data;
}