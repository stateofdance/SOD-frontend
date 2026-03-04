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

  ngOnInit(): void {
    this.service.get_tickets(this.state.user()?.authToken!).then(tickets => {
      tickets.map(ticket => {
        ticket.expiration_date = new Date(ticket.expiration_date)
        ticket.created_at = new Date(ticket.created_at)
        return ticket;
      });
      this.tickets.set(tickets);
    });
  }
}
