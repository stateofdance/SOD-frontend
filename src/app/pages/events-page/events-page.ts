import { Component, ElementRef, OnInit, signal, ViewChild, viewChild, viewChildren } from '@angular/core';

@Component({
  selector: 'app-events-page',
  imports: [],
  templateUrl: './events-page.html',
  styleUrl: './events-page.css',
})
export class EventsPage implements OnInit {
  images:string[] = [
    "/images/event_posters/event_poster_1.png", "/images/event_posters/event_poster_1.png", 
    "/images/event_posters/event_poster_1.png", "/images/event_posters/event_poster_1.png"
  ]
  registration_links:string[] = [
    'https://docs.google.com/forms/d/e/1FAIpQLSdmATq5Jl2wHzF71YMZ4EoHllmzfjsbRVsugdv0EX50MZOMJA/closedform',
    'https://docs.google.com/forms/d/e/1FAIpQLSdmATq5Jl2wHzF71YMZ4EoHllmzfjsbRVsugdv0EX50MZOMJA/closedform',
    'https://docs.google.com/forms/d/e/1FAIpQLSdmATq5Jl2wHzF71YMZ4EoHllmzfjsbRVsugdv0EX50MZOMJA/closedform'
  ];
  events = viewChildren<ElementRef>('event');
  current_displayed = signal<number>(0);

  ngOnInit(): void {
    this.updateEvent()
  }

  nextPage() {
    if (this.current_displayed() == this.events().length - 1) {return;}
    this.current_displayed.set(this.current_displayed() + 1);
    this.updateEvent()
  }

  previousPage() {
    if (this.current_displayed() == 0) {return;}
    this.current_displayed.set(this.current_displayed() - 1);
    this.updateEvent()
  }

  updateEvent() {
    for (const [index, event] of this.events().entries()) {
      console.log(index, this.current_displayed())
      if (index == this.current_displayed()) {
        event.nativeElement.classList.remove('not-display');
        event.nativeElement.classList.add('display');
      }else {
        event.nativeElement.classList.remove('display');
        event.nativeElement.classList.add('not-display');
      }
    }
  }

}
