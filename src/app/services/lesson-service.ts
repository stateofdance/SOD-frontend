import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Coach } from '../interfaces/coach';
import { environment } from '../../environments/environment';
import { first, firstValueFrom } from 'rxjs';
import { Class } from '../interfaces/class';
import { LessonSchedule } from '../interfaces/lesson-schedule';
import { ScheduleBooking } from '../interfaces/schedule-booking';
import { Package } from '../interfaces/package';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private httpClient = inject(HttpClient);
  
  async get_coaches() : Promise<Coach[]> {
    const observable = this.httpClient.get<Coach[]>(`${environment.apiURl}/members/coaches/`);
    return firstValueFrom(observable);
  }

  async get_lessons_per_coach(coach_id:number) : Promise<string[]> {
    const observable = this.httpClient.get<string[]>(`${environment.apiURl}/lessons/lessons-coach/${coach_id}`);
    return firstValueFrom(observable);
  }

  async get_classes() : Promise<Class[]> {
    const observable = this.httpClient.get<Class[]>(`${environment.apiURl}/lessons/classes/`);
    return firstValueFrom(observable);
  }

  async get_schedules(branch_id:number) : Promise<Array<LessonSchedule[]>> {
    const observable = this.httpClient.get<Array<LessonSchedule[]>>(`${environment.apiURl}/lessons/schedules/${branch_id}`);
    return firstValueFrom(observable);
  }

  async book_enrollment(schedule:ScheduleBooking[], ticket_id:number, authToken:string): Promise<string>{
    const observabe = this.httpClient.post<string>(`${environment.apiURl}/transactions/enroll/${ticket_id}/`, schedule,
      {headers: new HttpHeaders('').set('Authorization', `Token ${authToken}`)}
    );
    return firstValueFrom(observabe);
  }

  async get_packages():Promise<Package[]> {
    const observable = this.httpClient.get<Package[]>(`${environment.apiURl}/transactions/packages/`);
    return firstValueFrom(observable);
  }

  async order_ticket(package_id:number, authToken:string):Promise<string> {
    const observable = this.httpClient.post<string>(`${environment.apiURl}/transactions/ticket/`, {package_id:package_id}, 
      {headers : new HttpHeaders('').set('Authorization', `Token ${authToken}`)}
    );
    return firstValueFrom(observable);
  }

  async get_occupancy(schedule_id:number, date_string:string):Promise<number> {
    const observable = this.httpClient.get<number>(`${environment.apiURl}/schedules/occupancy/${schedule_id}/${date_string}/`);
    return firstValueFrom(observable);
  }
}
