import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioDetailComponent } from './studio-detail-component';

describe('StudioDetailComponent', () => {
  let component: StudioDetailComponent;
  let fixture: ComponentFixture<StudioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudioDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudioDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
