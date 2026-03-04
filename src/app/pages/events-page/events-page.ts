import { Component, ElementRef, inject, OnInit, signal, ViewChild, viewChild, viewChildren } from '@angular/core';
import { ContentService } from '../../services/content-service';
import { EventDetails } from '../../interfaces/event-details';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-events-page',
  imports: [SlicePipe, RouterLink],
  templateUrl: './events-page.html',
  styleUrl: './events-page.css',
})
export class EventsPage implements OnInit {
  protected service = inject(ContentService);

  event_list = signal<EventDetails[]>([]);

  ngOnInit(): void {
    this.service.get_events().then(events => {
      events.map(event => {
        event.schedule = new Date(event.schedule);
      });
      this.event_list.set(events);
    });
  }

}
