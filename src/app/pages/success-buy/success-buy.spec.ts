import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessBuy } from './success-buy';

describe('SuccessBuy', () => {
  let component: SuccessBuy;
  let fixture: ComponentFixture<SuccessBuy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessBuy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessBuy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
