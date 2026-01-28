import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { ClassSchedule } from '../../../interfaces/class-schedule';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-schedule',
  imports: [NgClass],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule {
  class = input.required<ClassSchedule>();
  day = input.required<number>();
  section_selected = input.required<boolean>();

  hovered = signal<boolean>(false);
  selected = signal<boolean>(false);

  @Output() select = new EventEmitter<[number, ClassSchedule, boolean]>();

  clicked() {
    this.selected.set(!this.selected())
    this.select.emit([this.day(), this.class(), this.selected()]);
  }
}
