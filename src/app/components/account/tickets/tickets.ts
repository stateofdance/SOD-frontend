import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Ticket } from '../../../interfaces/ticket';
import { AccountService } from '../../../services/account-service';
import { AppState } from '../../../services/app-state';

@Component({
  selector: 'app-tickets',
  imports: [RouterLink],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets implements OnInit {
  protected service = inject(AccountService);
  protected state = inject(AppState);

  tickets = signal<Ticket[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.service.get_tickets(null, this.state.user()?.authToken!).then(tickets => {
      tickets.map(ticket => {
        ticket.expiration_date = new Date(ticket.expiration_date)
        ticket.created_at = new Date(ticket.created_at)
        return ticket;
      });
      this.tickets.set(tickets);
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
  };
}
