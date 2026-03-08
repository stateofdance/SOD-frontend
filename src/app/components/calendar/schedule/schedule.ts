import { Component, effect, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { NgClass } from "@angular/common";
import { ScheduleBooking } from '../../../interfaces/schedule-booking';
import { LessonSchedule } from '../../../interfaces/lesson-schedule';
import { User } from '../../../interfaces/user';
import { LessonService } from '../../../services/lesson-service';
import { AppState } from '../../../services/app-state';

@Component({
  selector: 'app-schedule',
  imports: [NgClass],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule{
  protected service = inject(LessonService);
  protected state = inject(AppState);
  class = input.required<LessonSchedule>();
  date = input.required<Date>();
  section_selected = input.required<boolean>();
  schedule_selected = input.required<boolean>();
  occupancies = signal<string[]>([]);

  hovered = signal<boolean>(false);

  @Output() select = new EventEmitter<ScheduleBooking>();

  constructor() {
    effect(() => {
      this.service.get_occupancy(this.class().id, this.date().toISOString()).then(strings => this.occupancies.set(strings));
    });
  }

  clicked() {
    if (this.dayPassed()) return;
    this.select.emit({date:this.date(), schedule:this.class()});
  }

  dayPassed():boolean {
    const now = new Date();
    const classDateTime = new Date(this.date());
    
    // 1. Split the time string (e.g., "02:30 PM") into the time and the modifier
    const [time, modifier] = this.class().start_time.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // 2. Convert to 24-hour format
    if (modifier.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }
    
    const gracePeriodMinutes = 0; 
    classDateTime.setHours(hours, minutes + gracePeriodMinutes, 0, 0);

    const isPast = classDateTime < now;
    const isFull = this.occupancies().length >= this.class().max_students;
    const alreadyJoined = this.state.user()?.id !== undefined && 
                          this.occupancies().includes(this.state.user()!.id!);

    return isPast || isFull || alreadyJoined;
  }
}
