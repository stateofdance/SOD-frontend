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
  loading = signal(true);

  ngOnInit(): void {




    this.service.get_orders(this.state.user()?.authToken!).then(orders => {
      orders.map(order => {
        order.created_at = new Date(order.created_at);
        return order;
      })
      this.orders.set(orders);
      this.loading.set(false);
    }).catch((error) => {
        if (error.status === 401) {
          console.log('Unauthorized: token is invalid or expired. Logging out...');
          localStorage.removeItem('authToken');
          this.state.user.set(null);
          window.dispatchEvent(new Event('force-login'));
        } else { 
          console.log(error.message);
        }
    });
  }

}
