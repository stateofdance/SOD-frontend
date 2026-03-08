import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { NgClass } from "@angular/common";
import { AppState } from './services/app-state';
import { AccountService } from './services/account-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('test');
  protected state = inject(AppState);
  protected account_service = inject(AccountService);
  sidebar_show = signal(false);



  ngOnInit(): void {
    this.state.screen_width.set(window.innerWidth);
    this.state.screen_height.set(window.innerHeight);

    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      this.account_service.get_user(authToken)
        .then(user => {
          user.authToken = authToken;
          this.state.set_user(user);
        })
        .catch((error: any) => {
          if (error.status === 401) {
            console.log('Unauthorized: token is invalid or expired. Logging out...');
            localStorage.removeItem('authToken');
            this.state.user.set(null);
            window.dispatchEvent(new Event('force-login'));
          } 
        });
    }
  }



  @HostListener('window:resize')
  onResize() {
    this.state.screen_width.set(window.innerWidth);
    this.state.screen_height.set(window.innerHeight);
  }
}
