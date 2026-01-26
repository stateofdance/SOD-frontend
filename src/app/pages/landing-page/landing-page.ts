import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { StackCarousel } from '../../components/stack-carousel/stack-carousel';
import { NgClass } from '@angular/common';
import { SlideCarousel } from '../../components/slide-carousel/slide-carousel';
import { ClassCard } from '../../components/class-card/class-card';
import { Class } from '../../interfaces/class';

@Component({
  selector: 'app-landing-page',
  imports: [StackCarousel, NgClass, SlideCarousel, ClassCard],
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
  public classes: Class[] = [
    {
      name: "Kids Class",
      img: "/images/class/kids_class.png",
      description: "A beginner dance class that focuses on fundamentals and basic movements using fun and exciting K-Pop and pop music."
    },
    {
      name: "K-Pop",
      img: "/images/class/kpop_class.png",
      description: "A beginner to intermediate dance class that focuses on learning your favorite original K-Pop choreographies, detail by detail."
    },
    {
      name: "Revibe",
      img: "/images/class/revibe_class.png",
      description: "A beginner-friendly dance class where you can groove to your favorite 70’s, 80’s, 90’s, and 2000’s hits!"
    },
    {
      name: "Flowtion",
      img: "/images/class/flowtion_class.png",
      description: "An intermediate to advanced dance class that focuses on musicality, technique, and a deeper understanding of the art of dance."
    },
    {
      name: "Pop Trend",
      img: "/images/class/pop_class.png",
      description: "A beginner to intermediate dance class that focuses on releasing energy through trendy and powerful choreography."
    },
    {
      name: "Swag Attack",
      img: "/images/class/swag_class.png",
      description: "An intermediate to advanced dance class that highlights coolness, groove, and pure swag."
    },
    {
      name: "Femme Soultry",
      img: "/images/class/soultry_class.png",
      description: "A beginner to intermediate dance class that focuses on sexiness, confidence, and hotness in every move."
    },
    {
      name: "Nubiets",
      img: "/images/class/nubiets_class.png",
      description: "A beginner dance class that focuses on fundamentals and basic movements."
    },
    {
      name: "Power Femme",
      img: "/images/class/power_class.png",
      description: "A beginner to intermediate dance class that celebrates boldness, confidence, and power."
    }
  ]

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
