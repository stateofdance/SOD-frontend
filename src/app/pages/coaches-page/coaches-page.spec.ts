import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachesPage } from './coaches-page';

describe('CoachesPage', () => {
  let component: CoachesPage;
  let fixture: ComponentFixture<CoachesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
