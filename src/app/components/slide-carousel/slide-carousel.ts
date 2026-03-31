import { afterNextRender, Component, ElementRef, EventEmitter, HostListener, inject, input, NgZone, OnDestroy, OnInit, Output, Signal, signal, viewChild, viewChildren } from '@angular/core';
import { Coach } from '../../interfaces/coach';
import { NgClass } from "@angular/common";
import { RouterLink } from "@angular/router";
import { LessonService } from '../../services/lesson-service';

@Component({
  selector: 'app-slide-carousel',
  imports: [NgClass, RouterLink],
  templateUrl: './slide-carousel.html',
  styleUrl: './slide-carousel.css',
})
export class SlideCarousel implements OnInit, OnDestroy {
  private lesson_service = inject(LessonService);
  targetZone = viewChild.required<ElementRef>('targetZone');
  moving = viewChild.required<ElementRef>('moving');
  coachCards = viewChildren<ElementRef>('coachCard');
  activeIndex = signal<number | null>(null);
  coaches = signal<Coach[]>([]);

  private animationFrameId: number | null = null;
  private ngZone = inject(NgZone);
  private currentScroll = 0;
  
  private startX = 0;
  private startY = 0; // Add this to track vertical start
  private startScrollY = 0;
  private isSwiping = false;
  private scrollSensitivity = 1.5;

  // New flags to determine intent
  private isHorizontalSwipe = false;
  private swipeDirectionDetermined = false;

  translateX = signal<string>('translateX(120rem)');
  sectionScrollProgress = input.required<Signal<number>>();

  constructor() {
    afterNextRender(() => {
      this.ngZone.runOutsideAngular(() => {
        this.animate();
      });
    });
  }

  ngOnInit(): void {
    this.lesson_service.get_coaches().then(coaches => {
      for (const coach of coaches) {
        this.lesson_service.get_lessons_per_coach(coach.id).then(lessons => {
          coach.lessons = lessons.slice(0, 3);
          this.coaches.update(currentCoaches => {
            const newCoaches = [...currentCoaches, coach];
            return newCoaches.sort((a, b) => a.id - b.id);
          });
        });
      }
    });
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
  }

  private getClientY(event: MouseEvent | TouchEvent): number {
    return 'touches' in event ? event.touches[0].clientY : (event as MouseEvent).clientY;
  }
  
  onPointerDown(event: MouseEvent | TouchEvent): void {
    this.isSwiping = true;
    this.swipeDirectionDetermined = false; // Reset on every new touch
    this.isHorizontalSwipe = false;
    
    this.startX = this.getClientX(event);
    this.startY = this.getClientY(event); // Capture starting Y
    this.startScrollY = window.scrollY || document.documentElement.scrollTop;
  }

  onPointerMove(event: MouseEvent | TouchEvent): void {
    if (!this.isSwiping) return;

    const currentX = this.getClientX(event);
    const currentY = this.getClientY(event);
    const deltaX = currentX - this.startX;
    const deltaY = currentY - this.startY;

    // 1. If we haven't figured out the direction yet, calculate it
    if (!this.swipeDirectionDetermined) {
      // Add a tiny 2px threshold so we don't accidentally lock the screen on a jittery tap
      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        // If X movement is greater than Y movement, it's a horizontal swipe
        this.isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        this.swipeDirectionDetermined = true;
      } else {
        return; // Wait for the user to move their finger just a tiny bit more
      }
    }

    // 2. If it's a vertical swipe, STOP. Let the browser handle native scrolling.
    if (!this.isHorizontalSwipe) {
      return; 
    }

    // 3. If it IS a horizontal swipe, run our custom scroll logic
    // Now we only prevent default if we are certain it's a side-swipe
    if (event.cancelable) {
      event.preventDefault(); 
    }

    const newScrollY = this.startScrollY + (deltaX * -this.scrollSensitivity);

    window.scrollTo({
      top: newScrollY,
      left: 0,
      behavior: 'auto'
    });
  }

  onPointerUp(): void {
    this.isSwiping = false;
    this.swipeDirectionDetermined = false;
  }
  
  animate() {
    this.currentScroll += ( (this.sectionScrollProgress()() - this.currentScroll) * 0.1);

    // B. Performance Optimization
    // If we are extremely close to the target (within 0.1px), just stop to save CPU.
    const diff = Math.abs(this.sectionScrollProgress()() - this.currentScroll);
    
    if (diff > 0.05) {
      // C. Update the DOM directly
      // Note: We use translate3d to force Hardware Acceleration (GPU)
      const el = this.moving().nativeElement;
      
      // Example: Moving horizontally based on vertical scroll
      el.style.transform = `translateX(-${this.currentScroll * 1.1}%)`;
    }

    const targetRect = this.targetZone().nativeElement.getBoundingClientRect();
    let foundActive = null;

    this.coachCards().forEach((itemRef, index) => {
      const imgRect = itemRef.nativeElement.getBoundingClientRect();

      const imgCenter = imgRect.left + (imgRect.width / 2);
      const isCentered = 
        imgCenter > targetRect.left && 
        imgCenter < targetRect.right;

      if (isCentered) {
        foundActive = index;
      }
    });

    if (this.activeIndex() !== foundActive) {
      this.activeIndex.set(foundActive);
    }

    // D. Loop
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
