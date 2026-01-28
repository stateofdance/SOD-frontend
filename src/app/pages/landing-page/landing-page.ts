import { Component, ElementRef, HostListener, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { StackCarousel } from '../../components/stack-carousel/stack-carousel';
import { NgClass } from '@angular/common';
import { SlideCarousel } from '../../components/slide-carousel/slide-carousel';
import { ClassCard } from '../../components/class-card/class-card';
import { Class } from '../../interfaces/class';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-landing-page',
  imports: [StackCarousel, SlideCarousel, ClassCard, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  @ViewChild('track2') track2! : ElementRef;
  @ViewChild('underground') underground! : ElementRef;
  @ViewChildren('content') contents! : ElementRef[];
  @ViewChildren('line') lines! : QueryList<ElementRef>;

  contentTransform = signal('translateY(0px)');
  private scrollTimeout:any;
  public progress = 0;
  public progress2 = signal(0);
  public classes: Class[] = [
    {
      name: "Kids Class",
      img: "/images/class/kids_class.jpg",
      description: "A beginner dance class that focuses on fundamentals and basic movements using fun and exciting K-Pop and pop music. Designed to build your child’s coordination, confidence, and love for dancing in a playful and supportive environment.",
      difficulty: 'Beginner'
    },
    {
      name: "K-Pop",
      img: "/images/class/kpop_class.jpg",
      description: "A beginner to intermediate dance class that focuses on learning your favorite original K-Pop choreographies, detail by detail. Perfect for fans who want to master iconic moves while improving coordination, style, and stage presence.",
      difficulty: 'Beginner to Intermediate'
    },
    {
      name: "Revibe",
      img: "/images/class/revibe_class.jpg",
      description: "A beginner-friendly dance class where you can groove to your favorite 70’s, 80’s, 90’s, and 2000’s hits! Focused on fun and enhancing your basic movements, this class lets adults enjoy dancing with confidence, freedom, and good vibes — no experience needed!",
      difficulty: 'Beginner'
    },
    {
      name: "Flowtion",
      img: "/images/class/flowtion_class.jpg",
      description: "An intermediate to advanced dance class that focuses on musicality, technique, and a deeper understanding of the art of dance. Perfect for dancers who want to refine their skills, move with emotion, and connect artistry with precision.",
      difficulty: 'Intermediate to Advanced'
    },
    {
      name: "Pop Trend",
      img: "/images/class/pop_class.jpg",
      description: "A beginner to intermediate dance class that focuses on releasing energy through trendy and powerful choreography. Move with confidence, express your style, and feel the hype with every beat!",
      difficulty: 'Beginner to Intermediate'
    },
    {
      name: "Swag Attack",
      img: "/images/class/swag_class.jpg",
      description: "An intermediate to advanced dance class that highlights coolness, groove, and pure swag. Perfect for dancers who want to level up their style, attitude, and confidence on stage and on the floor.",
      difficulty: 'Intermediate to Advanced'
    },
    {
      name: "Femme Soultry",
      img: "/images/class/soultry_class.jpg",
      description: "A beginner to intermediate dance class that focuses on sexiness, confidence, and hotness in every move. Learn to dance with attitude, fluidity, and empowerment — embracing your sensual side while owning the stage.",
      difficulty: 'Beginner to Intermediate'
    },
    {
      name: "Nubiets",
      img: "/images/class/nubiets_class.jpg",
      description: "A beginner dance class that focuses on fundamentals and basic movements. Perfect for those starting their dance journey, building strong foundations, rhythm, and confidence step by step.",
      difficulty: 'Beginner'
    },
    {
      name: "Power Femme",
      img: "/images/class/power_class.jpg",
      description: "A beginner to intermediate dance class that celebrates boldness, confidence, and power. Unleash your inner diva through fierce movements and empowering choreography that make you feel unstoppable.",
      difficulty: 'Beginner to Intermediate'
    }
  ]

  @HostListener('wheel')
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
