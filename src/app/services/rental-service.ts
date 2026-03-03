import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Branch } from '../interfaces/branch';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  private httpClient = inject(HttpClient);

  async get_rentable_branches():Promise<Branch[]> {
    const observable = this.httpClient.get<Branch[]>(`${environment.apiURl}/members/branches/rentable/`);
    return firstValueFrom(observable);
  }

  async get_available_slots(branch_id:number, date:string):Promise<Array<[number, number]>> {
    const observable = this.httpClient.get<Array<[number, number]>>(`${environment.apiURl}/members/branches/${branch_id}/${date}/`);
    return firstValueFrom(observable);
  }

  async rent_studio(branch_id:number, scheduled_date:Date, start_time:string, end_time:string, authToken:string):Promise<string> {
    const observable = this.httpClient.post<string>(`${environment.apiURl}/transactions/rent/`, {
      branch_id:branch_id, scheduled_date:scheduled_date, start_time:start_time, end_time:end_time
    }, {headers: new HttpHeaders('').set('Authorization', `Token ${authToken}`)});
    return firstValueFrom(observable);
  }
  
}
