import { Component, inject, OnInit, signal } from '@angular/core';
import { AccountService } from '../../../services/account-service';
import { Order } from '../../../interfaces/order';
import { AppState } from '../../../services/app-state';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit{
  protected state = inject(AppState);
  protected service = inject(AccountService);
  
  orders = signal<Order[]>([]);

  ngOnInit(): void {
    this.service.get_orders(this.state.user()?.authToken!).then(orders => {
      orders.map(order => {
        order.created_at = new Date(order.created_at);
        return order;
      })
      this.orders.set(orders);
    });
  }

}
