import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { NgClass } from "@angular/common";
import { AppState } from './services/app-state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('test');
  protected state = inject(AppState);
  sidebar_show = signal(false);



  ngOnInit(): void {
    this.state.screen_width.set(window.innerWidth);
    this.state.screen_height.set(window.innerHeight);
  }
  
  @HostListener('window:resize')
  onResize() {
    this.state.screen_width.set(window.innerWidth);
    this.state.screen_height.set(window.innerHeight);
  }
}
