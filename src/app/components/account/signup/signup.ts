import { Component, inject, signal, ViewChild } from '@angular/core';
import { NgClass } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { Password } from "../../password/password";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account-service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, Password, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  @ViewChild('password') password!:Password;
  @ViewChild('confirm_password') confirm_password!:Password;

  protected service = inject(AccountService);
  protected router = inject(Router);

  first_name = new FormControl('');
  last_name = new FormControl('');
  email = new FormControl('');
  number = new FormControl('');
  birthdate = new FormControl<Date|null>(null);
  use = new FormControl(false);
  privacy = new FormControl(false);

  enable() {
    if (!this.first_name || !this.last_name || !this.email || !this.use || !this.privacy || !this.password || !this.confirm_password || !this.birthdate || !this.number) return false;
    if (this.first_name.value?.length == 0) return false;
    if (this.last_name.value?.length == 0) return false;
    if (!this.email.value?.includes('@')) return false;
    if (!this.birthdate.value) return false;
    if (this.number.value?.length == 0) return false;
    if (this.password.value() != this.confirm_password.value()) return false;
    return this.use.value && this.privacy.value;
  }

  signUp() {
    
    if (this.email.value && this.first_name.value && this.last_name.value && this.birthdate.value && this.number.value) {
      let user:User = {
        email:this.email.value,
        first_name:this.first_name.value,
        last_name:this.last_name.value,
        password:this.password.value(),
        username:this.first_name.value + ' ' + this.last_name.value,
        contact:this.number.value,
        birthdate:this.birthdate.value
      };

      this.service.register(user).then(data => this.router.navigate(['', {outlets:{sidebar: 'login'}}]));
    }

  }
}
