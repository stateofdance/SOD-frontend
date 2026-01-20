import { Component, input, OnDestroy, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-stack-carousel',
  imports: [NgOptimizedImage],
  templateUrl: './stack-carousel.html',
  styleUrl: './stack-carousel.css',
})
export class StackCarousel implements OnInit, OnDestroy{
  private updateSubscription!:Subscription;
  public images = input.required<string[]>();

  protected activeIndex = signal(0);

  next() {
    this.activeIndex.update((i) => (i + 1) % this.images().length);
  }

  ngOnInit():void {
    this.updateSubscription = interval(2000).subscribe(() => {
      this.next();
    })
  }
  
  ngOnDestroy():void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  getCardClasses(index: number, activeIndex: number): string {
    const total = this.images().length;
    

    let offset = index - activeIndex;
    if (offset < 0) offset += total;
    

    if (offset === 0) {
      return 'z-30 opacity-100 scale-100 translate-y-0 rotate-0 cursor-auto';
    }


    if (offset === 1) {
      return 'z-20 opacity-90 scale-95 translate-y-4 rotate-3';
    }


    if (offset === 2) {
      return 'z-10 opacity-80 scale-90 translate-y-8 -rotate-2';
    }

    return 'z-0 opacity-0 scale-90 translate-y-10 rotate-0 pointer-events-none';
  }
}
