import { Component, ElementRef, HostListener, inject, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { StackCarousel } from '../../components/stack-carousel/stack-carousel';
import { NgClass } from '@angular/common';
import { SlideCarousel } from '../../components/slide-carousel/slide-carousel';
import { ClassCard } from '../../components/class-card/class-card';
import { Class } from '../../interfaces/class';
import { RouterLink } from "@angular/router";
import { LessonService } from '../../services/lesson-service';
import { environment } from '../../../environments/environment'; 
@Component({
  selector: 'app-landing-page',
  imports: [StackCarousel, SlideCarousel, ClassCard, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {
  @ViewChild('track2') track2! : ElementRef;
  @ViewChild('underground') underground! : ElementRef;
  @ViewChildren('content') contents! : ElementRef[];
  @ViewChildren('line') lines! : QueryList<ElementRef>;

  coaches_img = environment.coachesImg;
  closing_img = environment.closingImg;
  intro_video = environment.introVideo;

  protected contentTransform = signal('translateY(0px)');
  protected lesson_service = inject(LessonService);

  private scrollTimeout:any;
  public progress = 0;
  public progress2 = signal(0);
  public classes = signal<Class[]>([]);

  ngOnInit(): void {
    this.lesson_service.get_classes().then(classes => this.classes.set(classes))
  }

  @HostListener('window:scroll')
  onWheel() {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const trackEl2 : HTMLDivElement = this.track2.nativeElement;
      const rect2 = trackEl2.getBoundingClientRect();

      const distFromTop2 = -rect2.top;

      const totalDistance2 = (trackEl2.offsetHeight * 0.80) - window.innerHeight;

      let preProgress2 = distFromTop2 / totalDistance2;

      this.progress2.set(Math.max(0, Math.min(preProgress2, 1)) * 100);

      this.contents.forEach((elementRef, index) => {
        const el = elementRef.nativeElement;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          el.style.opacity = 100;
          el.style.paddingLeft = 0;
          if (index < this.contents.length - 1) {
            this.lines.get(index)?.nativeElement.classList.add('line');
          }
        }
      })
      
    }, 10);    
  }

  projectUnderground() {
    this.underground.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start'});
  }

}
