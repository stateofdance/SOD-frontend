import { Component, ElementRef, HostListener, inject, input, NgZone, OnDestroy, OnInit, Signal, signal, viewChild, viewChildren } from '@angular/core';
import { Coach } from '../../interfaces/coach';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-slide-carousel',
  imports: [NgClass],
  templateUrl: './slide-carousel.html',
  styleUrl: './slide-carousel.css',
})
export class SlideCarousel implements OnInit, OnDestroy {
  targetZone = viewChild.required<ElementRef>('targetZone');
  moving = viewChild.required<ElementRef>('moving');
  coachCards = viewChildren<ElementRef>('coachCard');
  activeIndex = signal<number | null>(null);

  private animationFrameId: number | null = null;
  private ngZone = inject(NgZone);
  private currentScroll = 0;

  coaches:Coach[] = [
    {
      name: "Kervin Mendiola",
      class: "Kids Class",
      image: "/images/coaches/coach_1.png"
    },
    {
      name: "Kervin Mendiola",
      class: "Kids Class",
      image: "/images/coaches/coach_1.png"
    },
    {
      name: "Kervin Mendiola",
      class: "Kids Class",
      image: "/images/coaches/coach_1.png"
    },
    {
      name: "Kervin Mendiola",
      class: "Kids Class",
      image: "/images/coaches/coach_1.png"
    },
    {
      name: "Kervin",
      class: "Kids Class",
      image: "/images/coaches/coach_1.png"
    }
  ]

  translateX = signal<string>('translateX(120rem)');
  sectionScrollProgress = input.required<Signal<number>>();

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  @HostListener('wheel')
  onWheel() {
    console.log(this.sectionScrollProgress()());
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

    // D. Loop
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
