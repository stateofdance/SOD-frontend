import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Schedule } from '../../components/calendar/schedule/schedule';
import { TicketOverlay } from '../../components/ticket-overlay/ticket-overlay';

import { AppState } from '../../services/app-state';
import { LessonService } from '../../services/lesson-service';
import { AccountService } from '../../services/account-service';

import { LessonSchedule } from '../../interfaces/lesson-schedule';
import { Branch } from '../../interfaces/branch';
import { Coach } from '../../interfaces/coach';
import { Class } from '../../interfaces/class';
import { Ticket } from '../../interfaces/ticket';

function getDaysInMonthWithWeekday(
  year: number,
  month: number
): { day: number; weekday: number }[] {
  const date = new Date(year, month, 1);
  const days: { day: number; weekday: number }[] = [];

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
  imports: [Schedule, NgClass, ReactiveFormsModule, TicketOverlay],
  templateUrl: './class-booking-page.html',
  styleUrl: './class-booking-page.css',
})
export class ClassBookingPage implements OnInit {
  @ViewChild('monthSelect') monthSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('mobileDatesScroller') mobileDatesScroller!: ElementRef<HTMLElement>;

  protected state = inject(AppState);
  protected lesson_service = inject(LessonService);
  protected account_service = inject(AccountService);
  protected router = inject(Router);

  months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October',
    'November', 'December'
  ];

  classes = signal<LessonSchedule[]>([]);
  branches = signal<Branch[]>([]);
  coaches = signal<Coach[]>([]);
  lessons = signal<Class[]>([]);
  coach_lessons = signal<string[]>([]);

  date = new Date();
  days!: { day: number; weekday: number }[];
  cells: Array<Date | undefined> = [];

  selected_date_mobile: Date | null = null;
  selected_schedules: LessonSchedule[] = [];

  branch = new FormControl(1);
  coach = new FormControl('-1');
  lesson = new FormControl('-1');

  finalizing_booking = false;
  changing_month = false;
  booking = false;

  isDraggingDates = false;
  dragStartX = 0;
  scrollLeftStart = 0;
  dragMoved = false;

  ngOnInit(): void {
    this.account_service.get_branches()
      .then(branches => {
        this.branches.set(branches);
        this.branch.setValue(branches[0].id);

        return this.lesson_service.get_schedules(branches[0].id).then(schedules => {
          this.normalizeSchedules(schedules);
          this.setLessons(schedules);
          this.classes.set(schedules);

          if (this.state.screen_width() < 1024) {
            this.setInitialMobileDate();
            queueMicrotask(() => this.scrollSelectedMobileDateIntoView());
          }
        });
      })
      .then(() => {
        if (this.monthSelect) {
          this.monthSelect.nativeElement.value = String(this.date.getMonth());
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          console.log('Unauthorized: token is invalid or expired. Logging out...');
          localStorage.removeItem('authToken');
          this.state.user.set(null);
          window.dispatchEvent(new Event('force-login'));
        } else {
          console.log(error.message);
        }
      });

    this.coach.valueChanges.subscribe(() => {
      this.lesson.setValue('-1');
    });

    this.branch.valueChanges.subscribe(branch_id => {
      this.lesson.setValue('-1');
      this.coach.setValue('-1');
      this.selected_schedules = [];

      if (!branch_id) return;

      this.lesson_service.get_schedules(branch_id).then(schedules => {
        this.normalizeSchedules(schedules);
        this.setLessons(schedules);
        this.classes.set(schedules);

        if (this.state.screen_width() < 1024) {
          this.setInitialMobileDate();
          queueMicrotask(() => this.scrollSelectedMobileDateIntoView());
        }
      });
    });

    this.updateCalendar();

    if (this.state.screen_width() < 1024) {
      this.setInitialMobileDate();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('select')) {
      document.querySelectorAll('select').forEach((select) => {
        (select as HTMLSelectElement).blur();
      });
    }
  }

  onSelectBlur(event: Event) {
    const select = event.target as HTMLSelectElement;
    select.blur();
  }

  normalizeSchedules(schedules: LessonSchedule[]) {
    schedules.forEach(schedule => {
      schedule.schedule = new Date(schedule.schedule);
    });
  }

  setInitialMobileDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      today.getMonth() === this.date.getMonth() &&
      today.getFullYear() === this.date.getFullYear()
    ) {
      this.selected_date_mobile = new Date(today);
    } else {
      this.selected_date_mobile = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        1
      );
      this.selected_date_mobile.setHours(0, 0, 0, 0);
    }
  }

  setLessons(schedules: LessonSchedule[]) {
    this.lessons.set([]);
    this.coaches.set([]);

    for (const schedule of schedules) {
      if (!this.lessons().map(lesson => lesson.id).includes(schedule.lesson.id)) {
        this.lessons().push(schedule.lesson);
      }

      const coachIndex = this.coaches().findIndex(
        coach => coach.id === schedule.coach.id
      );

      if (coachIndex < 0) {
        schedule.coach.lessons = [schedule.lesson.title];
        this.coaches().push(schedule.coach);
      } else {
        this.coaches().at(coachIndex)?.lessons?.push(schedule.lesson.title);
      }
    }
  }

  updateCalendar() {
    this.days = getDaysInMonthWithWeekday(
      this.date.getFullYear(),
      this.date.getMonth()
    );

    this.cells = [];
    const day1_weekday = this.days[0].weekday;

    for (let i = 0; i < day1_weekday; i++) {
      this.cells.push(undefined);
    }

    for (const day of this.days) {
      const date = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        day.day
      );
      date.setHours(0, 0, 0, 0);
      this.cells.push(date);
    }

    const remainingCells = 7 - (this.cells.length % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        this.cells.push(undefined);
      }
    }
  }

  getCoach(id: string) {
    const _id = parseInt(id);
    return this.coaches().find(coach => coach.id === _id);
  }

  payment(ticket: Ticket) {
    if (this.booking) return;

    if (this.selected_schedules.length === 0) {
      alert('Please select a schedule!');
      return;
    }

    const remainingSessions =
      ticket.package.number_of_sessions - ticket.used_sessions;

    if (this.selected_schedules.length > remainingSessions) {
      alert(
        `You have selected ${this.selected_schedules.length} sessions, but your ticket only has ${remainingSessions} remaining. Please select fewer sessions or purchase a new ticket.`
      );
      return;
    }

    this.booking = true;
    this.lesson_service
      .book_enrollment(
        this.selected_schedules,
        ticket.id,
        this.state.user()?.authToken!
      )
      .then(() => this.router.navigate(['/']))
      .finally(() => {
        this.booking = false;
      });
  }

  nextMonth() {
    if (this.date.getMonth() === 11 || this.changing_month) return;

    this.changing_month = true;

    this.lesson_service.get_schedules(this.branch.value!).then(schedules => {
      this.normalizeSchedules(schedules);
      this.setLessons(schedules);

      this.date.setMonth(this.date.getMonth() + 1);
      this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);

      if (this.monthSelect) {
        this.monthSelect.nativeElement.value = String(this.date.getMonth());
        this.monthSelect.nativeElement.blur();
      }

      this.selected_date_mobile = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        1
      );
      this.selected_date_mobile.setHours(0, 0, 0, 0);

      this.classes.set(schedules);
      this.updateCalendar();
      this.changing_month = false;

      queueMicrotask(() => this.scrollSelectedMobileDateIntoView());
    }).catch(() => {
      this.changing_month = false;
    });
  }

  previousMonth() {
    if (this.date.getMonth() === 0 || this.changing_month) return;

    this.changing_month = true;

    this.lesson_service.get_schedules(this.branch.value!).then(schedules => {
      this.normalizeSchedules(schedules);
      this.setLessons(schedules);

      this.date.setMonth(this.date.getMonth() - 1);
      this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);

      if (this.monthSelect) {
        this.monthSelect.nativeElement.value = String(this.date.getMonth());
        this.monthSelect.nativeElement.blur();
      }

      this.selected_date_mobile = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        1
      );
      this.selected_date_mobile.setHours(0, 0, 0, 0);

      this.classes.set(schedules);
      this.updateCalendar();
      this.changing_month = false;

      queueMicrotask(() => this.scrollSelectedMobileDateIntoView());
    }).catch(() => {
      this.changing_month = false;
    });
  }

  selectedMonth(month: string) {
    this.lesson_service.get_schedules(this.branch.value!).then(schedules => {
      this.normalizeSchedules(schedules);
      this.setLessons(schedules);

      this.date.setMonth(parseInt(month));
      this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);

      this.selected_date_mobile = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        1
      );
      this.selected_date_mobile.setHours(0, 0, 0, 0);

      this.classes.set(schedules);
      this.updateCalendar();

      if (this.monthSelect) {
        this.monthSelect.nativeElement.blur();
      }

      queueMicrotask(() => this.scrollSelectedMobileDateIntoView());
    });
  }

  checkSelectedByDay(date: Date): boolean {
    return this.selected_schedules.some(
      schedule => schedule.schedule.toDateString() === date.toDateString()
    );
  }

  checkSelected(lesson_schedule: LessonSchedule): boolean {
    return this.selected_schedules.some(
      schedule => schedule.id === lesson_schedule.id
    );
  }

  clickedDay(date: Date) {
    if (this.state.screen_width() < 1024) {
      this.selected_date_mobile =
        date !== this.selected_date_mobile ? date : null;
    }
  }

  filterClass(_class: LessonSchedule): boolean {
    if (this.lesson.value && this.coach.value) {
      const lesson_id = parseInt(this.lesson.value);
      const coach_id = parseInt(this.coach.value);

      return (
        (_class.lesson.id === lesson_id || lesson_id === -1) &&
        (_class.coach.id === coach_id || coach_id === -1)
      );
    }

    return true;
  }

  getMonth(month: string) {
    return this.months[parseInt(month)];
  }

  clickedSchedule(schedule_booking: LessonSchedule): void {
    const exists = this.selected_schedules.some(
      schedule => schedule.id === schedule_booking.id
    );

    if (exists) {
      this.selected_schedules = this.selected_schedules.filter(
        schedule => schedule.id !== schedule_booking.id
      );
    } else {
      this.selected_schedules = [...this.selected_schedules, schedule_booking];
    }

    console.log(this.selected_schedules);
  }

  finalizedBooking() {
    if (!this.state.user()) {
      window.dispatchEvent(new Event('force-login'));
      return;
    }

    this.finalizing_booking = true;
  }

  get mobileSelectedDate(): Date {
    return this.selected_date_mobile ?? this.date;
  }

  getVisibleMobileDates(): Date[] {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const dates: Date[] = [];

    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day);
      d.setHours(0, 0, 0, 0);
      dates.push(d);
    }

    return dates;
  }

  getSchedulesByDate(date: Date): LessonSchedule[] {
    return this.classes().filter(_class =>
      this.filterClass(_class) &&
      _class.schedule.toLocaleDateString() === date.toLocaleDateString()
    );
  }

  selectMobileDate(date: Date) {
    if (this.dragMoved) return;

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    this.selected_date_mobile = selected;

    const monthChanged =
      selected.getMonth() !== this.date.getMonth() ||
      selected.getFullYear() !== this.date.getFullYear();

    if (!monthChanged) {
      queueMicrotask(() => this.scrollSelectedMobileDateIntoView());
      return;
    }

    this.date = new Date(selected.getFullYear(), selected.getMonth(), 1);

    if (this.monthSelect) {
      this.monthSelect.nativeElement.value = String(this.date.getMonth());
      this.monthSelect.nativeElement.blur();
    }

    this.lesson_service.get_schedules(this.branch.value!).then(schedules => {
      this.normalizeSchedules(schedules);
      this.setLessons(schedules);
      this.classes.set(schedules);
      this.updateCalendar();

      queueMicrotask(() => this.scrollSelectedMobileDateIntoView());
    });
  }

  isSameDate(date1: Date | null, date2: Date): boolean {
    if (!date1) return false;
    return date1.toDateString() === date2.toDateString();
  }

  hasSchedules(date: Date): boolean {
    return this.getSchedulesByDate(date).length > 0;
  }

  weekdayShort(date: Date): string {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
  }

  startDatesDrag(event: MouseEvent | TouchEvent) {
    if (!this.mobileDatesScroller) return;

    this.isDraggingDates = true;
    this.dragMoved = false;

    const container = this.mobileDatesScroller.nativeElement;
    const clientX =
      'touches' in event ? event.touches[0].clientX : event.clientX;

    this.dragStartX = clientX;
    this.scrollLeftStart = container.scrollLeft;
  }

  onDatesDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDraggingDates || !this.mobileDatesScroller) return;

    const container = this.mobileDatesScroller.nativeElement;
    const clientX =
      'touches' in event ? event.touches[0].clientX : event.clientX;

    const deltaX = clientX - this.dragStartX;

    if (Math.abs(deltaX) > 5) {
      this.dragMoved = true;
    }

    container.scrollLeft = this.scrollLeftStart - deltaX;
  }

  endDatesDrag() {
    this.isDraggingDates = false;

    setTimeout(() => {
      this.dragMoved = false;
    }, 0);
  }

  scrollSelectedMobileDateIntoView() {
    if (!this.mobileDatesScroller || !this.selected_date_mobile) return;

    const container = this.mobileDatesScroller.nativeElement;
    const selectedDay = this.selected_date_mobile.getDate();
    const selectedButton = container.querySelector(
      `[data-day="${selectedDay}"]`
    ) as HTMLElement | null;

    if (!selectedButton) return;

    const containerWidth = container.clientWidth;
    const targetLeft =
      selectedButton.offsetLeft -
      (containerWidth / 2) +
      (selectedButton.clientWidth / 2);

    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth'
    });
  }
}