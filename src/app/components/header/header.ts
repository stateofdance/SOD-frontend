import { NgClass, Location } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isScrolled = false;
  classes_show = signal(false);
  events_show = signal(false);
  bookings_show = signal(false);
  show_all = signal(false);
  currentUrl : string;

  constructor(private location: Location) {
    this.currentUrl = this.location.path();
  }

  getCurrentPath() : string {
    return this.location.path();
  }
  
  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100
  }

  extendHeader() {
    this.show_all.set(!this.show_all())
    this.classes_show.set(false);
    this.events_show.set(false);
    this.bookings_show.set(false);

  }
}
