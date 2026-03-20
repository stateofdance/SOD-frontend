import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { DecimalPipe, NgClass } from "@angular/common";
import { RentalService } from '../../services/rental-service';
import { ReactiveFormsModule } from '@angular/forms';
import { AppState } from '../../services/app-state';
import { User } from '../../interfaces/user';
import { Branch } from '../../interfaces/branch';
import { StudioDetailComponent } from "../../components/studio-detail-component/studio-detail-component";

@Component({
  selector: 'app-studio-rental-page',
  imports: [NgClass, ReactiveFormsModule, StudioDetailComponent, DecimalPipe],
  templateUrl: './studio-rental-page.html',
  styleUrl: './studio-rental-page.css',
})
export class StudioRentalPage implements OnInit{
  @ViewChild('date') date!:ElementRef;
  @ViewChild('startTime') startTime!:ElementRef;
  @ViewChild('endTime') endTime!:ElementRef;
  @ViewChild('viewMap', {static: false}) map!:ElementRef;

  protected rental_service = inject(RentalService);
  protected state = inject(AppState);

  start_times:string[] = [];
  end_times:string[] = [];
  available_scheds!:Array<[number, number]>;
  today:Date;

  selected_date:Date|null = null;
  selected_branch = signal<number>(-1);
  start_index = signal<number>(0);
  start_sched = signal<string>('none');
  end_sched = signal<string>('none');
  branches = signal<Branch[]>([]);
  hovered_branch = signal<number>(-1);
  viewing_branch = signal<Branch|null>(null);
  viewing_gallery = signal<string[]>([]);
  total_amount = signal<number>(0);
  paying = false;

  constructor() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() + 1);
  }

  ngOnInit() {
    this.rental_service.get_rentable_branches().then(branches => {
      this.branches.set(branches);
    })
  }

  setBranch(branch:number) {
    this.selected_branch.set(branch);
    this.date.nativeElement.value = '';
    this.startTime.nativeElement.value = 'none';
    this.endTime.nativeElement.value = 'none';
  }

  findGroup(time:number) : number {
    for (const [index, range] of this.available_scheds.entries()) {
      if (time >= range[0] && time <= range[1]) {
        return index;
      } 
    }

    return -1;
  }

  selectDate(date:string) {
    this.selected_date =  new Date(date);
    this.startTime.nativeElement.value = 'none';
    this.endTime.nativeElement.value = 'none';
    this.rental_service.get_available_slots(this.selected_branch(), this.selected_date.toISOString()).then(available_slots => {
      this.start_times = [];
      this.available_scheds = available_slots;
      for (let i = 8; i < 22.5; i+= 0.5) {

        if (this.findGroup(i) < 0) {
          continue;
        }
        
        let hour = Math.floor(i);
        let min = (i % 1) * 60;

        const min_display = min.toString().padStart(2, '0');
        const hour_display = hour <= 12 ? hour : hour - 12;
        const am_pm = hour < 12 ? 'AM' : 'PM';

        this.start_times.push(`${hour_display}:${min_display} ${am_pm}`);
      }
    });
    
  }

  selectStartTime(index:string) {
    const _index = parseInt(index);
    this.start_index.set(_index);
    const time = this.start_times.at(_index);
    if (time) {
      this.end_times = [];
      let am_pm = time.split(' ')[1];
      let hour_minute = time.split(' ')[0].split(':');
      const start_min = parseInt(hour_minute[1]);
      const start_hour = parseInt(hour_minute[0]) + (am_pm == 'PM' ? 12 : 0);
      this.start_sched.set(time)

      const start_time = start_hour + (start_min/60)
      const group = this.findGroup(start_time)
      const time_range = this.available_scheds[group];
      for (let i = start_time; i <= time_range[1]; i += 0.5) {
        let hour = Math.floor(i);
        let min = (i % 1) * 60;

        const min_display = min.toString().padStart(2, '0');
        const hour_display = hour <= 12 ? hour : hour - 12;
        const am_pm = hour < 12 ? 'AM' : 'PM';
        this.end_times.push(`${hour_display}:${min_display} ${am_pm}`)
      }
      
      this.computeTotal();
    }

  }

  selectEndTime(time:string) {
    if (time) {
      let am_pm = time.split(' ')[1];
      let hour_minute = time.split(' ')[0].split(':');
      const hour = parseInt(hour_minute[0]) + (am_pm == 'PM' ? 12 : 0);
      this.end_sched.set(time)
      this.computeTotal();
    }
  }

  computeTotal() {
    if (this.start_sched() == 'none' || this.end_sched() == 'none') {
      this.total_amount.set(0);
      return;
    }
    const branch = this.branches().find(b => b.id == this.selected_branch());
    if (!branch) return;

    let start_am_pm = this.start_sched().split(' ')[1];
    let start_hour_minute = this.start_sched().split(' ')[0].split(':');
    const start_min = parseInt(start_hour_minute[1]);
    const start_hour = parseInt(start_hour_minute[0]) + (start_am_pm == 'PM' && start_hour_minute[0] !== '12' ? 12 : 0);
    let end_am_pm = this.end_sched().split(' ')[1];
    let end_hour_minute = this.end_sched().split(' ')[0].split(':');
    const end_min = parseInt(end_hour_minute[1]);
    const end_hour = parseInt(end_hour_minute[0]) + (end_am_pm == 'PM' && end_hour_minute[0] !== '12' ? 12 : 0);

    const start_time = start_hour + (start_min/60)
    const end_time = end_hour + (end_min/60)

    const duration = end_time - start_time;
    if (branch.package_rate && duration >= 3) {
      this.total_amount.set(duration * branch.package_rate)
    } else {
      this.total_amount.set(duration * branch.rate)
    }
  }

  payment() {
    if (this.paying) return;

    if (!this.state.user()) {
      alert('You need to be logged in to rent a studio.');
      return;
    }
    if (!this.selected_date) {
      alert('Select a date to book.');
      return;
    };
    if (this.start_sched() == 'none' || this.end_sched() == 'none') {
      alert('Please complete the start and end time of your rent.');
      return;
    }
    this.paying = true;
    this.rental_service.rent_studio(this.selected_branch(), this.selected_date, this.start_sched(), this.end_sched(), this.state.user()!.authToken!)
      .then(checkoutUrl => window.open(checkoutUrl)).finally(() => {
        this.paying = false;
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

  is_hovered(id:number):boolean {
    return this.hovered_branch() == id;
  }


  currentImageIndex = signal<number>(0);

  setBranchView(branch:Branch) {
    this.viewing_branch.set(branch);
    this.rental_service.get_branch_images(branch.id).then(images => {
      this.currentImageIndex.set(0);
      const imageUrls = images.map(img => img.image);
      this.viewing_gallery.set(imageUrls);
      this.map.nativeElement.src = this.viewing_branch()?.google_maps_link;
    });
  }

  nextImage() {
    this.currentImageIndex.update(i => (i + 1) % this.viewing_gallery().length);
  }

  prevImage() {
    this.currentImageIndex.update(i => (i - 1 + this.viewing_gallery().length) % this.viewing_gallery().length);
  }

  getSlidePosition(index: number): 'center' | 'left' | 'right' | 'hidden' {
  const current = this.currentImageIndex();
  const total = this.viewing_gallery().length;

  if (index === current) return 'center';
  if (index === (current - 1 + total) % total) return 'left';
  if (index === (current + 1) % total) return 'right';
  return 'hidden';
}


}
