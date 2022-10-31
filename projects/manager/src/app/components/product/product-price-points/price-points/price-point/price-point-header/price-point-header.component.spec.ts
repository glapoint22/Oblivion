import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointHeaderComponent } from './price-point-header.component';

describe('PricePointHeaderComponent', () => {
  let component: PricePointHeaderComponent;
  let fixture: ComponentFixture<PricePointHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
