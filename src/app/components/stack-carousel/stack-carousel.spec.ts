import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackCarousel } from './stack-carousel';

describe('StackCarousel', () => {
  let component: StackCarousel;
  let fixture: ComponentFixture<StackCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
