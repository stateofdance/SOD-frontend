import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AccountService } from '../../../services/account-service';
import { AppState } from '../../../services/app-state';
import { Enrollment } from '../../../interfaces/enrollment';

@Component({
  selector: 'app-booking',
  imports: [RouterLink],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit{
  private state = inject(AppState);
  private service = inject(AccountService);

  enrollments = signal<Enrollment[]>([]);
  loading = signal(true);


  ngOnInit(): void {

    this.service.get_enrollments(this.state.user()!.authToken!).then(enrollments => {
      enrollments.map(enrollment => {
        enrollment.lesson_schedule.schedule = new Date(enrollment.lesson_schedule.schedule);
        return enrollment;
      });
      this.enrollments.set(enrollments); 
      this.loading.set(false);
    }).catch((error) => {
        if (error.status === 401) {
          console.log('Unauthorized: token is invalid or expired. Logging out...');
          localStorage.removeItem('authToken');
          this.state.user.set(null);
          window.dispatchEvent(new Event('force-login'));
        } else { 
          console.log(error.message);
        }
    });
    


  }
}
