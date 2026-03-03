import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Performances } from './performances';

describe('Performances', () => {
  let component: Performances;
  let fixture: ComponentFixture<Performances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Performances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Performances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
