import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointUnitComponent } from './price-point-unit.component';

describe('PricePointUnitComponent', () => {
  let component: PricePointUnitComponent;
  let fixture: ComponentFixture<PricePointUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
