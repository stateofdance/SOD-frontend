import { Component, inject } from '@angular/core';
import { AppState } from '../../../services/app-state';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  protected state = inject(AppState);
  protected router = inject(Router);

  logout() {
    localStorage.removeItem('authToken');
    this.state.set_user(null);
    alert('Logged out successfully!');
    this.router.navigate(['', {outlets:{sidebar:null}}])
  }
}
