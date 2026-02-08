import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { ClassSchedule } from '../../../interfaces/class-schedule';
import { NgClass } from "@angular/common";
import { ScheduleBooking } from '../../../interfaces/schedule-booking';

@Component({
  selector: 'app-schedule',
  imports: [NgClass],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule {
  class = input.required<ClassSchedule>();
  month = input.required<string>();
  day = input.required<number>();
  section_selected = input.required<boolean>();

  hovered = signal<boolean>(false);

  @Output() select = new EventEmitter<[ScheduleBooking, boolean]>();

  clicked() {
    this.select.emit([{date:new Date(2026, parseInt(this.month()), this.day()), time:this.class().time, class:this.class().name}, !this.section_selected()]);
  }
}
