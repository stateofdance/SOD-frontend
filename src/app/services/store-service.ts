import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MerchItem } from '../interfaces/merch-item';
import { environment } from '../../environments/environment';
import { first, firstValueFrom } from 'rxjs';
import { MerchCustomization } from '../interfaces/merch-customization';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private httpClient = inject(HttpClient);

  async get_merchs() : Promise<MerchItem[]> {
    const observable = this.httpClient.get<MerchItem[]>(`${environment.apiURl}/store/merchs/`);
    return firstValueFrom(observable);
  }

  async get_merch(id:number) : Promise<MerchItem> {
    const observable = this.httpClient.get<MerchItem>(`${environment.apiURl}/store/merch/${id}/`);
    return firstValueFrom(observable);
  }

  async get_merch_images(id:number) : Promise<{id:number, merch:number, image:string}[]> {
    const observable = this.httpClient.get<{id:number, merch:number, image:string}[]>(`${environment.apiURl}/store/merch/${id}/images`);
    return firstValueFrom(observable);
  }

  async get_merch_customizations(id:number) : Promise<{customizationName:string, customizations:MerchCustomization[]}[]> {
    const observable = this.httpClient.get<{customizationName:string, customizations:MerchCustomization[]}[]>(`${environment.apiURl}/store/merch/${id}/customizations`);
    return firstValueFrom(observable);
  }

  async submit_order(merch_id:number, customization_ids:number[], quantity:number, branch_id:number, authToken:string) : Promise<string> {
    const observable = this.httpClient.post<string>(`${environment.apiURl}/transactions/order/`, 
      {merch_id:merch_id, customization_ids:customization_ids, quantity:quantity, branch_id:branch_id},
      {headers: new HttpHeaders('').set('Authorization', `Token ${authToken}`)}
    );
    return firstValueFrom(observable);
  }
}
