import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
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
  
  tickets = signal<Ticket[]>([]);   
  selected_ticket:Ticket|null = null;
  hovered_ticket:number = -1;

  @Output() close = new EventEmitter<void>();
  @Output() book = new EventEmitter<Ticket>();

  ngOnInit(): void {
    this.service.get_tickets(this.state.user()?.authToken!).then(tickets=> this.tickets.set(tickets));
  }

  is_hovered(ticket:Ticket):boolean {
    return ticket.id == this.hovered_ticket || ticket == this.selected_ticket;
  }

  enroll() {
    if(this.selected_ticket){
      this.book.emit(this.selected_ticket);
    }
  }
}
