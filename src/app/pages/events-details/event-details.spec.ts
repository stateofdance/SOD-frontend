import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsPage } from './event-details';

describe('EventDetailsPage', () => {
  let component: EventDetailsPage;
  let fixture: ComponentFixture<EventDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
