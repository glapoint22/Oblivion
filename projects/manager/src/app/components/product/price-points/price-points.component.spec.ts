import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointsComponent } from './price-points.component';

describe('PricePointsComponent', () => {
  let component: PricePointsComponent;
  let fixture: ComponentFixture<PricePointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
