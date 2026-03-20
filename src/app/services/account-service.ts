import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Branch } from '../interfaces/branch';
import { Enrollment } from '../interfaces/enrollment';
import { Order } from '../interfaces/order';
import { Rent } from '../interfaces/rent';
import { Ticket } from '../interfaces/ticket';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private httpClient = inject(HttpClient);
  
  async login(email:string, password:string) : Promise<{token:string}> {
    const observable = this.httpClient.post<{token:string}>(`${environment.apiURl}/members/login/`, {"email":email, "password":password});
    return firstValueFrom(observable);
  }

  async get_user(authToken:string) : Promise<User> {
    const observable = this.httpClient.get<User>(`${environment.apiURl}/members/me/`, {
      headers: new HttpHeaders('').set('Authorization', `Token ${authToken}`)
    });
    return firstValueFrom(observable);
  }

  async register(user:User) : Promise<User> {
    const observable = this.httpClient.post<User>(`${environment.apiURl}/members/signup/`, user);
    return firstValueFrom(observable);
  }

  async get_branches() : Promise<Branch[]> {
    const observable = this.httpClient.get<Branch[]>(`${environment.apiURl}/members/branches/store/`);
    return firstValueFrom(observable);
  }

  async change_password(new_password:string, authToken:string):Promise<User> {
    const observable = this.httpClient.patch<User>(`${environment.apiURl}/members/change-password/`, {new_password:new_password}, {
      headers : new HttpHeaders('').set('Authorization', `Token ${authToken}`)
    });
    return firstValueFrom(observable);
  }

  async update_details(original:User, current:User, authToken:string):Promise<User> {
    const changes: any = {};

    (Object.keys(current) as (keyof User)[]).forEach((key) => {
      if (original[key] !== current[key]) {
        changes[key] = current[key];
      }
    });
     
    const observable = this.httpClient.patch<User>(`${environment.apiURl}/members/me/`, changes as User, {
      headers : new HttpHeaders('').set('Authorization', `Token ${authToken}`)
    });
    return firstValueFrom(observable);
  }

  async get_enrollments(authToken:string):Promise<Enrollment[]> {
    const observable = this.httpClient.get<Enrollment[]>(`${environment.apiURl}/lessons/enrollments/`, {
      headers : new HttpHeaders('').set('Authorization', `Token ${authToken}`)
    })
    return firstValueFrom(observable);
  }

  async get_orders(authToken:string):Promise<Order[]> {
    const observable = this.httpClient.get<Order[]>(`${environment.apiURl}/transactions/orders/me/`, {
      headers : new HttpHeaders('').set('Authorization', `Token ${authToken}`)
    })
    return firstValueFrom(observable);
  }

  async get_rentals(authToken:string):Promise<Rent[]> {
    const observable = this.httpClient.get<Rent[]>(`${environment.apiURl}/transactions/rentals/me/`, {
      headers : new HttpHeaders('').set('Authorization', `Token ${authToken}`)
    })
    return firstValueFrom(observable);
  }

  async get_tickets(query_branch_id:number|null, authToken:string):Promise<Ticket[]> {
    let url = `${environment.apiURl}/transactions/tickets/me/`
    if (query_branch_id) {
      url += `?branch_id=${query_branch_id}`
    }

    const observable = this.httpClient.get<Ticket[]>(url, {
      headers : new HttpHeaders('').set('Authorization', `Token ${authToken}`)
    })
    return firstValueFrom(observable);
  }

}
