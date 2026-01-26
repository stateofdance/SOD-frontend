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
      class: "Kids, Revibe, Flowtion",
      image: "/images/coaches/coach_1.jpg"
    },
    {
      name: "Gabriel Aguilar",
      class: "Kids, Nubiets, Swag Attack",
      image: "/images/coaches/coach_8.png"
    },
    {
      name: "Carlette Peronilla",
      class: "Pop Trends, Revibe",
      image: "/images/coaches/coach_3.jpg"
    },
    {
      name: "Emman Aguilar",
      class: "Kids",
      image: "/images/coaches/coach_7.png"
    },
    {
      name: "Katta Labnao",
      class: "K-Pop, Kids",
      image: "/images/coaches/coach_9.JPG"
    },
    {
      name: "Renzo Suson",
      class: "Kids",
      image: "/images/coaches/coach_2.jpg"
    },
    {
      name: "Ish Rivera",
      class: "Femma Soultry",
      image: "/images/coaches/coach_6.png"
    },
    {
      name: "Kevin Cezar Samson",
      class: "Kids",
      image: "/images/coaches/coach_4.jpg"
    },
    {
      name: "Seyah Singson",
      class: "Power Femme",
      image: "/images/coaches/coach_5.jpg"
    }
  ]

  translateX = signal<string>('translateX(120rem)');
  sectionScrollProgress = input.required<Signal<number>>();

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animate();
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
