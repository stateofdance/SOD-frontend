import { Component, ElementRef, OnInit, signal, ViewChild, viewChild, viewChildren } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-events-page',
  imports: [MatTooltip, NgClass],
  templateUrl: './events-page.html',
  styleUrl: './events-page.css',
})
export class EventsPage implements OnInit {
  @ViewChild('videoPlayer1') videoPlayer1!: ElementRef;
  @ViewChild('videoPlayer2') videoPlayer2!: ElementRef;
  @ViewChild('videoPlayer3') videoPlayer3!: ElementRef;
  @ViewChild('videoPlayer4') videoPlayer4!: ElementRef;


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
  showVideo:boolean[] = [false, false, false, false];

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
  
  playVideo(index: number): void {
    this.showVideo[index] = true;
    switch (index) {
      case 0:
      this.videoPlayer1.nativeElement.play();
      break;
      case 1:
      this.videoPlayer2.nativeElement.play();
      break;
      case 2:
      this.videoPlayer3.nativeElement.play();
      break;
      case 3:
      this.videoPlayer4.nativeElement.play();
      break;
    }
    
  }

  pauseVideo(index: number): void {
    this.showVideo[index] = false;
    switch (index) {
      case 0:
        const video1:HTMLVideoElement = this.videoPlayer1.nativeElement;
        video1.pause();
        video1.currentTime = 0;
      break;
      case 1:
        const video2:HTMLVideoElement = this.videoPlayer2.nativeElement;
        video2.pause();
        video2.currentTime = 0;
      break;
      case 2:
        const video3:HTMLVideoElement = this.videoPlayer3.nativeElement;
        video3.pause();
        video3.currentTime = 0;
      break;
      case 3:
        const video4:HTMLVideoElement = this.videoPlayer4.nativeElement;
        video4.pause();
        video4.currentTime = 0;
      break;
    }
    
  }

}
