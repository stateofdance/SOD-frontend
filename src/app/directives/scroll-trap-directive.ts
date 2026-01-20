import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollTrapDirective]',
  standalone: true
})
export class ScrollTrapDirective implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // When the target section is reached
        console.log("section detected!");
        this.disableBodyScroll();
        this.enableSectionScroll();
      } else {
        // When the target section is left
        this.enableBodyScroll();
        this.disableSectionScroll();
      }
    }, { threshold: 1.0 }); // Adjust threshold as needed (1.0 means 100% visible)

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private disableBodyScroll() {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    console.log('disabling body scroll');
    // Optional: Save and restore scroll position to prevent the page from jumping
  }

  private enableBodyScroll() {
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  private enableSectionScroll() {
    this.renderer.setStyle(this.el.nativeElement, 'overflow-y', 'scroll');
    this.renderer.setStyle(this.el.nativeElement, 'height', '100vh'); // Ensure section has a defined height to scroll within
  }

  private disableSectionScroll() {
    this.renderer.setStyle(this.el.nativeElement, 'overflow-y', 'hidden');
  }

}
