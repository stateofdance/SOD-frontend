import { NgClass, Location, NgOptimizedImage } from '@angular/common';
import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { AppState } from '../../services/app-state';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterOutlet],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected state = inject(AppState);
  protected router = inject(Router);

  profile_img = signal('/images/profile_icon_hollow.png');
  sidebar_show = signal(false);
  isScrolled = false;
  classes_show = signal(false);
  events_show = signal(false);
  bookings_show = signal(false);
  profile_show = signal(false);
  show_all = signal(false);
  currentUrl: string;

  constructor(private location: Location) {
    this.currentUrl = this.location.path();

    // Update profile icon based on user state
    effect(() => {
      if (this.state.user()) {
        this.profile_img.set('/images/profile_icon_solid.png');
      } else {
        this.profile_img.set('/images/profile_icon_hollow.png');
      }
    });

    // Auto-close navbar on navigation
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideAll();
        // Also close sidebar if open
        this.sidebar_show.set(false);
      });
  }

  getCurrentPath(): string {
    return this.location.path();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100;
  }

  extendHeader() {
    if (this.sidebar_show()) {
      this.router.navigate(['', { outlets: { sidebar: null } }]);
    } else {
      this.show_all.set(!this.show_all());
      this.classes_show.set(false);
      this.events_show.set(false);
      this.bookings_show.set(false);
      this.profile_show.set(false);
    }
  }

  hideAll() {
    this.show_all.set(false);
    this.classes_show.set(false);
    this.events_show.set(false);
    this.bookings_show.set(false);
    this.profile_show.set(false);
  }

  profileClicked() {
    if (this.state.user() == null) {
      this.router.navigate(['', { outlets: { sidebar: 'login' } }]);
    } else {
      this.router.navigate(['', { outlets: { sidebar: 'account' } }]);
    }
  }
}