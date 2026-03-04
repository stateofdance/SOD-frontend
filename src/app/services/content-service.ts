import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private httpClient = inject(HttpClient);

  async get_events():Promise<Event[]> {
    const observable = this.httpClient.get<Event[]>(`${environment.apiURl}/contents/events/`);
    return firstValueFrom(observable);
  }

  async get_performances():Promise<Performance[]> {
    const observable = this.httpClient.get<Performance[]>(`${environment.apiURl}/contents/event-profile/`);
    return firstValueFrom(observable);
  }
}
