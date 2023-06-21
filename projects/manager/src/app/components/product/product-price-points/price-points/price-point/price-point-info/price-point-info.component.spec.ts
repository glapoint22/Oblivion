import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointInfoComponent } from './price-point-info.component';

describe('PricePointInfoComponent', () => {
  let component: PricePointInfoComponent;
  let fixture: ComponentFixture<PricePointInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
