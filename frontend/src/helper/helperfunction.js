import { format } from "date-fns";
export const showDate= (date)=>{
    const newDate= new Date(date);
    return format(newDate , "dd/MM/yyyy, HH:mm")
}