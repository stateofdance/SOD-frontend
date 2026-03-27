import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { AppState } from '../../services/app-state';
import { AccountService } from '../../services/account-service';
import { Ticket } from '../../interfaces/ticket';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket-overlay',
  imports: [NgClass, RouterLink],
  templateUrl: './ticket-overlay.html',
  styleUrl: './ticket-overlay.css',
})
export class TicketOverlay {
  protected service = inject(AccountService);
  protected state = inject(AppState);
  
  branch = input.required<number>();
  tickets = signal<Ticket[]>([]);   
  selected_ticket:Ticket|null = null;
  hovered_ticket:number = -1;
  today = new Date();
  loading = true;

  @Output() close = new EventEmitter<void>();
  @Output() book = new EventEmitter<Ticket>();

  ngOnInit(): void {
    this.service.get_tickets(this.branch(), this.state.user()?.authToken!).then(tickets=> {
      tickets.map(ticket => {
        ticket.expiration_date = new Date(ticket.expiration_date);
        return ticket;
      })
      this.tickets.set(tickets.filter(ticket => this.valid_ticket(ticket)));
      this.loading = false;
    });
  }

  is_hovered(ticket:Ticket):boolean {
    return ticket.id == this.hovered_ticket || ticket == this.selected_ticket;
  }

  valid_ticket(ticket:Ticket) {
    ticket.expiration_date.setHours(23, 59, 59);
    return this.today < ticket.expiration_date;
  }

  enroll() {
    if(this.selected_ticket){
      this.book.emit(this.selected_ticket);
    }
  }
}
