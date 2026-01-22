import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideCarousel } from './slide-carousel';

describe('SlideCarousel', () => {
  let component: SlideCarousel;
  let fixture: ComponentFixture<SlideCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
