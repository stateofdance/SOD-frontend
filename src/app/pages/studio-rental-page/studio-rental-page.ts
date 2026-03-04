import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { NgClass } from "@angular/common";
import { RentalService } from '../../services/rental-service';
import { ReactiveFormsModule } from '@angular/forms';
import { AppState } from '../../services/app-state';
import { User } from '../../interfaces/user';
import { Branch } from '../../interfaces/branch';

@Component({
  selector: 'app-studio-rental-page',
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './studio-rental-page.html',
  styleUrl: './studio-rental-page.css',
})
export class StudioRentalPage implements OnInit{
  @ViewChild('date') date!:ElementRef;
  @ViewChild('startTime') startTime!:ElementRef;
  @ViewChild('endTime') endTime!:ElementRef;

  protected rental_service = inject(RentalService);
  protected state = inject(AppState);

  quezon_images = [
    '/images/studio/quezon/gallery_1.jpg', '/images/studio/quezon/gallery_2.jpg', '/images/studio/quezon/gallery_3.jpg'
  ]
  binondo_images = [
    '/images/studio/binondo/gallery_1.jpg', '/images/studio/binondo/gallery_2.jpg', '/images/studio/binondo/gallery_3.jpg',
    '/images/studio/binondo/gallery_4.jpg'
  ]

  start_times:string[] = [];
  end_times:string[] = [];
  available_scheds!:Array<[number, number]>;
  today:Date;

  selected_date:Date|null = null;
  selected_branch = signal<number>(-1);
  start_index = signal<number>(0);
  start_sched = signal<string>('');
  end_sched = signal<string>('');
  branches = signal<Branch[]>([]);
  hovered_branch = signal<number>(-1);
  viewing_branch = signal<Branch|null>(null);

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
    this.startTime.nativeElement.value = '';
    this.endTime.nativeElement.value = '';
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
      
    }

  }

  selectEndTime(time:string) {
    if (time) {
      let am_pm = time.split(' ')[1];
      let hour_minute = time.split(' ')[0].split(':');
      const hour = parseInt(hour_minute[0]) + (am_pm == 'PM' ? 12 : 0);
      this.end_sched.set(time)
    }
  }

  payment() {
    if (!this.state.user()) {
      alert('You need to be logged in to rent a studio.');
      return;
    }
    if (!this.selected_date) {
      alert('Select a date to book.');
      return;
    };
    if (!this.start_sched() || !this.end_sched()) {
      alert('Please complete the start and end time of your rent.');
      return;
    }

    this.rental_service.rent_studio(this.selected_branch(), this.selected_date, this.start_sched(), this.end_sched(), this.state.user()!.authToken!)
    .then(checkoutUrl => window.open(checkoutUrl));
  }

  is_hovered(id:number):boolean {
    return this.hovered_branch() == id;
  }


  currentImageIndex = signal<number>(0);

  get currentGallery(): string[] {
    const branchName = this.viewing_branch()?.name.toLowerCase() || '';
    if (branchName.includes('quezon')) return this.quezon_images;
    if (branchName.includes('binondo')) return this.binondo_images;
    return [];
  }

  nextImage() {
    this.currentImageIndex.update(i => (i + 1) % this.currentGallery.length);
  }

  prevImage() {
    this.currentImageIndex.update(i => (i - 1 + this.currentGallery.length) % this.currentGallery.length);
  }

  getSlidePosition(index: number): 'center' | 'left' | 'right' | 'hidden' {
  const current = this.currentImageIndex();
  const total = this.currentGallery.length;

  if (index === current) return 'center';
  if (index === (current - 1 + total) % total) return 'left';
  if (index === (current + 1) % total) return 'right';
  return 'hidden';
}
}
