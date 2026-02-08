import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ClassSchedule } from '../../interfaces/class-schedule';
import { Schedule } from '../../components/calendar/schedule/schedule';
import { NgClass } from '@angular/common';
import { AppState } from '../../services/app-state';
import { ScheduleBooking } from '../../interfaces/schedule-booking';

function getDaysInMonthWithWeekday(year: number, month: number): { day: number, weekday: number }[] {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        days.push({
            day: date.getDate(),
            weekday: date.getDay()
        });
        
        date.setDate(date.getDate() + 1);
    }
    return days;
}

@Component({
  selector: 'app-class-booking-page',
  imports: [Schedule, NgClass],
  templateUrl: './class-booking-page.html',
  styleUrl: './class-booking-page.css',
})
export class ClassBookingPage implements OnInit {
  @ViewChild('monthSelect') monthSelect!:ElementRef;
  protected state = inject(AppState);

  months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October',
    'November', 'December'
  ]
  classes:Array<ClassSchedule[]> = [
    [
      {name:'Kids Class', coach:'Kervin Mendiola', difficulty:'BGNR', time:'1:00 PM', weekday: 0}
    ],
    [
      {name:'Revibe Class', coach:'Kervin Mendiola', difficulty:'BGNR', time:'6:00 PM', weekday: 1},
      {name:'Femme Soultry Class', coach:'Kervin Mendiola', difficulty:'BGNR to INTMD', time:'7:30 PM', weekday: 1}
    ],
    [

    ],
    [
      {name:'Pop Trends Class', coach:'Kervin Mendiola', difficulty:'BGNR to INTMD', time:'7:00 PM', weekday: 3}
    ],
    [
      {name:'Power Femme Class', coach:'Kervin Mendiola', difficulty:'BGNR to INTMD', time:'7:00 PM', weekday: 4}
    ],
    [
      {name:'Flowtion Class', coach:'Kervin Mendiola', difficulty:'INTMD to AVNCD', time:'7:00 PM', weekday: 4}
    ],
    [
      {name:'Kids Class', coach:'Kervin Mendiola', difficulty:'BGNR', time:'4:00 PM', weekday: 6},
      {name:'K-Pop Class', coach:'Kervin Mendiola', difficulty:'INT', time:'7:30 PM', weekday: 6},
      {name:'Revibe Class', coach:'Kervin Mendiola', difficulty:'BGNR', time:'6:00 PM', weekday: 6}
    ]
  ]

  date = new Date();
  days!:{ day: number, weekday: number }[];
  cells:Array<Array<{ day: number, weekday: number } | undefined>> = [];
  selected_day_mobile:{day:number, weekday:number}|null = null;
  selected_schedules:ScheduleBooking[] = [];

  ngOnInit(): void {
    this.updateCalendar();
  }

  updateCalendar() {
    this.days = getDaysInMonthWithWeekday(this.date.getFullYear(), this.date.getMonth());
    this.cells = [];
    let day1_weekday = this.days[0].weekday;
    let row:Array<{ day: number, weekday: number } | undefined> = [];

    for (let i = 0; i < day1_weekday; i++) {
      row.push(undefined);
    }

    for (const day of this.days) {
      row.push(day);
      if (day.weekday == 6) {
        this.cells.push(row);
        row = [];
      }
    }

    if (row.length > 0) {
      for (let i = row.length; i < 7; i++) {
        row.push(undefined);
      }
      this.cells.push(row)
    }
  }

  payment() {
    console.log(this.days);
  }

  nextMonth() {
    if (this.date.getMonth() == 11) {return;}
    this.date.setMonth(this.date.getMonth() + 1);
    this.monthSelect.nativeElement.value = this.date.getMonth();
    this.updateCalendar()
  }

  previousMonth() {
    if (this.date.getMonth() == 0) {return;}
    this.date.setMonth(this.date.getMonth() - 1);
    this.monthSelect.nativeElement.value = this.date.getMonth();
    this.updateCalendar()
  }

  selectedMonth(month:string) {
    this.date.setMonth(parseInt(month));
    this.updateCalendar()
  }

 
  checkSelectedByDay(day:{day:number, weekday:number}) : boolean {
    for (const schedule of this.selected_schedules) {
      if (schedule.date.getDate() == day.day) {
        return true;
      }
    }
    return false;
  }

  checkSelectedByTime(day:number,time:string) : boolean {
    for (const schedule of this.selected_schedules) {
      if (schedule.time == time && schedule.date.getDate() == day) {
        return true;
      }
    }
    return false;
  }

  clickedDay(day:{day:number, weekday:number}) {
    if (this.state.screen_width() < 1024) {
      this.selected_day_mobile = day != this.selected_day_mobile ? day : null;
    }
  }

  getMonth(month:string) {
    return this.months[parseInt(month)];
  }

  clickedSchedule(event:[ScheduleBooking, boolean]):void {
    const booking = event[0];
    const selected = event[1];

    if (selected) {
      this.selected_schedules.push(booking);
      console.log(this.selected_schedules)
    }else {
      const index = this.selected_schedules.findIndex(_booking => booking.date.getTime() == _booking.date.getTime());
      this.selected_schedules = this.selected_schedules.filter((_, i) => i !== index);
      console.log(this.selected_schedules)
    }
  }
}
