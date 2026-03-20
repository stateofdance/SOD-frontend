import { Component, inject, OnInit, signal } from '@angular/core';
import { MerchItem } from '../../interfaces/merch-item';
import { StoreService } from '../../services/store-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-merch-page',
  imports: [RouterLink],
  templateUrl: './merch-page.html',
  styleUrl: './merch-page.css',
})
export class MerchPage implements OnInit{
  store_service = inject(StoreService);
  merchandises = signal<MerchItem[]>([]);

  ngOnInit(): void {
    this.store_service.get_merchs().then(merchs => this.merchandises.set(merchs));
  }
}
