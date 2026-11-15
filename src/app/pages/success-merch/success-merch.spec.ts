import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessMerch } from './success-merch';

describe('SuccessMerch', () => {
  let component: SuccessMerch;
  let fixture: ComponentFixture<SuccessMerch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessMerch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessMerch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
