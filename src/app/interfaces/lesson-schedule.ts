import { Branch } from "./branch";
import { Class } from "./class";
import { Coach } from "./coach";

export interface LessonSchedule {
    id:number,
    lesson:Class,
    branch:Branch,
    coach:Coach,
    weekday:number,
    start_time:string,
    max_students:number
}
