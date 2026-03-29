import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Coach } from '../interfaces/coach';
import { environment } from '../../environments/environment';
import { first, firstValueFrom } from 'rxjs';
import { Class } from '../interfaces/class';
import { LessonSchedule } from '../interfaces/lesson-schedule';
import { Package } from '../interfaces/package';
import { Recital } from '../interfaces/recital';

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

  async get_schedules(branch_id:number) : Promise<LessonSchedule[]> {
    const observable = this.httpClient.get<LessonSchedule[]>(`${environment.apiURl}/lessons/schedules/${branch_id}`);
    return firstValueFrom(observable);
  }

  async book_enrollment(schedule:LessonSchedule[], ticket_id:number, authToken:string): Promise<string>{
    const observabe = this.httpClient.post<string>(`${environment.apiURl}/transactions/enroll/${ticket_id}/`, schedule,
      {headers: new HttpHeaders('').set('Authorization', `Token ${authToken}`)}
    );
    return firstValueFrom(observabe);
  }

  async get_packages(branch_id:number):Promise<Package[]> {
    const observable = this.httpClient.get<Package[]>(`${environment.apiURl}/transactions/packages/${branch_id}/`);
    return firstValueFrom(observable);
  }

  async order_ticket(package_id:number, authToken:string):Promise<string> {
    const observable = this.httpClient.post<string>(`${environment.apiURl}/transactions/ticket/`, {package_id:package_id}, 
      {headers : new HttpHeaders('').set('Authorization', `Token ${authToken}`)}
    );
    return firstValueFrom(observable);
  }

  async get_occupancy(schedule_id:number, date_string:string):Promise<string[]> {
    const observable = this.httpClient.get<string[]>(`${environment.apiURl}/lessons/schedules/occupancy/${schedule_id}/${date_string}/`);
    return firstValueFrom(observable);
  }

  async get_recitals(branch_id:number):Promise<Recital[]> {
    const observable = this.httpClient.get<Recital[]>(`${environment.apiURl}/transactions/recitals/${branch_id}/`);
    return firstValueFrom(observable);
  }

  async book_recital(recital_id:number, authToken:string):Promise<string> {
    const observable = this.httpClient.post<string>(`${environment.apiURl}/transactions/recital-ticket/`, {recital_id:recital_id},
      {headers : new HttpHeaders('').set('Authorization', `Token ${authToken}`)}
    );
    return firstValueFrom(observable);
  }
}
