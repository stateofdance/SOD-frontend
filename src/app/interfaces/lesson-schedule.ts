import { Branch } from "./branch";
import { Class } from "./class";
import { Coach } from "./coach";
import { User } from "./user";

export interface LessonSchedule {
    id:number,
    lesson:Class,
    branch:Branch,
    coach:Coach,
    schedule:Date,
    students:string[],
    max_students:number
}
