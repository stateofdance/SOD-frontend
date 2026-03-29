import { LessonSchedule } from "./lesson-schedule";

export interface Enrollment {
    id:number,
    lesson_schedule:LessonSchedule,
    enrolled_at:Date
}
