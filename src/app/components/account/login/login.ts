import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { NgClass } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { Password } from "../../password/password";
import { AccountService } from '../../../services/account-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppState } from '../../../services/app-state';

@Component({
  selector: 'app-login',
  imports: [RouterLink, Password, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  @ViewChild('password') password!:Password;
  protected account_service = inject(AccountService);
  protected state  =  inject(AppState);
  protected router = inject(Router);

  email = new FormControl('');

  login() {
    if (!this.email) return;
    this.account_service.login(this.email.value!, this.password.value()).then(response => {
      localStorage.setItem('authToken', response.token);
      this.account_service.get_user(response.token).then(user => {
        user.authToken = response.token;
        this.state.set_user(user);
        alert('Logged in successfully!');
        this.router.navigate(['', {outlets:{sidebar:null}}]);
      });
      
    }).catch((reason) => {
      if (reason.status == 400) {
        alert('Wrong password or email! Please try again.');
        return;
      }
    });
  }
}
