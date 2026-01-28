import { Component, OnInit, signal } from '@angular/core';
import { ClassSchedule } from '../../interfaces/class-schedule';
import { Schedule } from '../../components/calendar/schedule/schedule';
import { NgClass } from '@angular/common';

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

  private today = new Date();
  month = signal<number>(this.today.getMonth())
  days!:{ day: number, weekday: number }[];
  cells:Array<Array<{ day: number, weekday: number } | undefined>> = [];
  selected_days:number[] = [];

  ngOnInit(): void {
    this.updateCalendar();
  }

  updateCalendar() {
    this.days = getDaysInMonthWithWeekday(this.today.getFullYear(), this.month());
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
    if (this.month() == 11) {return;}
    this.month.set(this.month() + 1);
    this.updateCalendar()
  }

  previousMonth() {
    if (this.month() == 0) {return;}
    this.month.set(this.month() - 1);
    this.updateCalendar()
  }

  selectedMonth(month:string) {
    if (month != this.month().toString()){
      this.month.set(parseInt(month));
      this.updateCalendar()
    }
  }

  clickedSchedule(event:[number, ClassSchedule, boolean]):void {
    const day = event[0];
    const selected = event[2];
    if (selected) {
      this.selected_days.push(day)
    }else {
      const index = this.selected_days.indexOf(day);
      this.selected_days = this.selected_days.filter((_, i) => i !== index);
    }
  }
}
