import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { NgClass } from "@angular/common";
import { ScheduleBooking } from '../../../interfaces/schedule-booking';
import { LessonSchedule } from '../../../interfaces/lesson-schedule';
import { User } from '../../../interfaces/user';
import { LessonService } from '../../../services/lesson-service';

@Component({
  selector: 'app-schedule',
  imports: [NgClass],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule implements OnInit{
  protected service = inject(LessonService);
  class = input.required<LessonSchedule>();
  date = input.required<Date>();
  section_selected = input.required<boolean>();
  schedule_selected = input.required<boolean>();
  user_id = input<string | null>(null);
  occupancy = 0;

  hovered = signal<boolean>(false);

  @Output() select = new EventEmitter<ScheduleBooking>();

  ngOnInit(): void {
    this.service.get_occupancy(this.class().id, this.date().toISOString()).then(occupancy => this.occupancy = occupancy);
  }

  clicked() {
    if (this.dayPassed()) return;
    this.select.emit({date:this.date(), schedule:this.class()});
  }

  dayPassed():boolean {
    const now = new Date();
    const classDateTime = new Date(this.date());
    const [hours, minutes] = this.class().start_time.split(':').map(Number);
    classDateTime.setHours(hours, minutes, 0, 0);
    return classDateTime < now || this.occupancy >= this.class().max_students;
  }
}
