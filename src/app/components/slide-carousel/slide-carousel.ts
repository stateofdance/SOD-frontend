import { afterNextRender, Component, ElementRef, HostListener, inject, input, NgZone, OnDestroy, OnInit, Signal, signal, viewChild, viewChildren } from '@angular/core';
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
