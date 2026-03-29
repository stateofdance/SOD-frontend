import { NgClass, Location } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { AppState } from '../../services/app-state';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterOutlet],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements AfterViewInit {
  @ViewChild('scrollableDiv') scrollableDiv!: ElementRef;

  protected state = inject(AppState);
  protected router = inject(Router);

  profile_img = signal('/images/profile_icon_hollow.png');

  sidebar_show = signal(false);
  show_all = signal(false);

  classes_show = signal(false);
  events_show = signal(false);
  bookings_show = signal(false);
  profile_show = signal(false);

  isScrolled = false;
  currentUrl: string;
  scrollThreshold = 0;

  constructor(private location: Location) {
    this.currentUrl = this.location.path();

    effect(() => {
      if (this.state.user()) {
        this.profile_img.set('/images/profile_icon_solid.png');
      } else {
        this.profile_img.set('/images/profile_icon_hollow.png');
      }
    });

  this.router.events
    .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe(() => {
      this.hideDropdowns();
    });

    window.addEventListener('force-login', () => {
      this.profileClicked();
    });
  }

  ngAfterViewInit(): void {
    if (this.scrollableDiv) {
      this.scrollThreshold = this.scrollableDiv.nativeElement.offsetHeight;
    }
  }

  getCurrentPath(): string {
    return this.location.path();
  }

  get drawerImg(): string {
    return this.isAnyMenuOpen()
      ? '/images/close_sidebar.png'
      : '/images/drawer_icon.png';
  }

  isAnyMenuOpen(): boolean {
    return this.show_all() || this.sidebar_show();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100;
  }

  @HostListener('scroll', ['$event'])
  onDivScroll(event: Event) {
    if (!this.scrollableDiv) return;

    const scrollPosition = this.scrollableDiv.nativeElement.scrollTop;

    if (scrollPosition >= this.scrollThreshold) {
      event.preventDefault();
      this.scrollableDiv.nativeElement.scrollTop = this.scrollThreshold;
    }
  }

  toggleClasses() {
    const next = !this.classes_show();
    this.classes_show.set(next);
    this.events_show.set(false);
    this.bookings_show.set(false);
    this.profile_show.set(false);
  }

  toggleEvents() {
    const next = !this.events_show();
    this.events_show.set(next);
    this.classes_show.set(false);
    this.bookings_show.set(false);
    this.profile_show.set(false);
  }

  toggleBookings() {
    const next = !this.bookings_show();
    this.bookings_show.set(next);
    this.classes_show.set(false);
    this.events_show.set(false);
    this.profile_show.set(false);
  }

  extendHeader() {
    if (this.sidebar_show()) {
      this.router.navigate(['', { outlets: { sidebar: null } }]);
      this.sidebar_show.set(false);
      return;
    }

    const next = !this.show_all();
    this.show_all.set(next);

    if (!next) {
      this.classes_show.set(false);
      this.events_show.set(false);
      this.bookings_show.set(false);
      this.profile_show.set(false);
    }
  }

  hideDropdowns() {
    this.show_all.set(false);
    this.classes_show.set(false);
    this.events_show.set(false);
    this.bookings_show.set(false);
    this.profile_show.set(false);
  }

  closeAllMenus() {
    this.hideDropdowns();

    if (this.sidebar_show()) {
      this.sidebar_show.set(false);
    }
  }

  closeSidebar() {
    if (this.sidebar_show()) {
      this.router.navigate(['', { outlets: { sidebar: null } }]);
      this.sidebar_show.set(false);
    }
  }

  hideAll() {
    this.hideDropdowns();
  }

  profileClicked() {
    this.hideDropdowns();

    if (this.state.user() == null) {
      this.router.navigate(['', { outlets: { sidebar: 'login' } }]);
    } else {
      this.router.navigate(['', { outlets: { sidebar: 'account' } }]);
    }

    this.sidebar_show.set(true);
  }
}