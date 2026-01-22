import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { StackCarousel } from '../../components/stack-carousel/stack-carousel';
import { NgClass } from '@angular/common';
import { SlideCarousel } from '../../components/slide-carousel/slide-carousel';

@Component({
  selector: 'app-landing-page',
  imports: [StackCarousel, NgClass, SlideCarousel],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  @ViewChild('track1') track1! : ElementRef;
  @ViewChild('track2') track2! : ElementRef;
  contentTransform = signal('translateY(0px)');
  private scrollTimeout:any;
  public progress = 0;
  public progress2 = signal(0);

  @HostListener('wheel')
  onWheel() {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const trackEl1 = this.track1.nativeElement;
      const trackEl2 = this.track2.nativeElement;
      const rect1 = trackEl1.getBoundingClientRect();
      const rect2 = trackEl2.getBoundingClientRect();

      const distFromTop1 = -rect1.top;
      const distFromTop2 = -rect2.top;

      const totalDistance1 = trackEl1.offsetHeight - window.innerHeight;
      const totalDistance2 = (trackEl2.offsetHeight * 0.80) - window.innerHeight;

      let preProgress1 = distFromTop1 / totalDistance1;
      let preProgress2 = distFromTop2 / totalDistance2;

      this.progress = Math.max(0, Math.min(preProgress1, 1)) * 100;
      this.progress2.set(Math.max(0, Math.min(preProgress2, 1)) * 100);
      
    }, 10);
    

  }

}
