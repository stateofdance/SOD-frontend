import { Component } from '@angular/core';
import { StackCarousel } from '../../components/stack-carousel/stack-carousel';
import { ScrollTrapDirective } from "../../directives/scroll-trap-directive";

@Component({
  selector: 'app-landing-page',
  imports: [StackCarousel, ScrollTrapDirective],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {

}
