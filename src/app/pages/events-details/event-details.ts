import { Component, ElementRef, inject, OnInit, signal, ViewChild, viewChild, viewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { ContentService } from '../../services/content-service';
import { EventDetails } from '../../interfaces/event-details';
import { StudioDetailComponent } from "../../components/studio-detail-component/studio-detail-component";

@Component({
  selector: 'app-event-details-page',
  imports: [RouterLink, StudioDetailComponent],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventsDetailsPage implements OnInit {
  protected service = inject(ContentService);

  id = signal<number|null>(null);
  events = viewChildren<ElementRef>('event');
  current_displayed = signal<number>(0);
  event_detail = signal<EventDetails|null>(null);

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.id.set(parseInt(id));
      }
    })

    this.service.get_event_details(this.id()!).then(event => {
      event.schedule = new Date(event.schedule);
      this.event_detail.set(event);
    });
  }

}
