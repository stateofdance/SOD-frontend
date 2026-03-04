import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account-service';
import { AppState } from '../../../services/app-state';
import { Rent } from '../../../interfaces/rent';

@Component({
  selector: 'app-rentals',
  imports: [RouterLink],
  templateUrl: './rentals.html',
  styleUrl: './rentals.css',
})
export class Rentals implements OnInit{
  protected state = inject(AppState);
  protected service = inject(AccountService);

  rents = signal<Rent[]>([]);

  ngOnInit(): void {
    this.service.get_rentals(this.state.user()!.authToken!).then(rents => {
      rents.map(rent => {
        rent.date = new Date(rent.date);
        return rent;
      });

      rents.sort((a,b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      this.rents.set(rents);
    });
  }

}
