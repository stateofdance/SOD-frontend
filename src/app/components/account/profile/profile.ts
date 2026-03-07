import { Component, inject, ViewChild } from '@angular/core';
import { Password } from "../../password/password";
import { Router, RouterLink } from "@angular/router";
import { AppState } from '../../../services/app-state';
import { AccountService } from '../../../services/account-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-profile',
  imports: [Password, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  @ViewChild('password') password!:Password;
  @ViewChild('confirm_password') confirm_password!:Password;

  protected state = inject(AppState);
  protected service = inject(AccountService);
  protected router = inject(Router);

  first_name:FormControl;
  last_name:FormControl;
  number:FormControl;
  birthdate:FormControl;
  address:FormControl;

  constructor() {
    this.first_name = new FormControl(this.state.user()!.first_name);
    this.last_name = new FormControl(this.state.user()!.last_name);
    this.number = new FormControl(this.state.user()!.contact);
    this.birthdate = new FormControl(this.state.user()!.birthdate);
    this.address = new FormControl(this.state.user()!.address);
  }

  save_details() {
    let user:User = {...this.state.user()!};

    user.username = this.first_name.value + ' ' + this.last_name.value;
    user.first_name = this.first_name.value;
    user.last_name = this.last_name.value;
    user.contact = this.number.value;
    user.birthdate = this.birthdate.value;
    user.address = this.address.value;
    
    this.service.update_details(this.state.user()!, user, user.authToken!).then(user => this.state.set_user(user));
    if (this.password.value().length > 0 && this.password.value() === this.confirm_password.value()) {
      this.service.change_password(this.password.value(), user.authToken!).then(user => {
        this.state.set_user(null);
        localStorage.removeItem('authToken');
        this.router.navigate(['', {outlets:{sidebar: null}}]);
      });
    }
  }

}
