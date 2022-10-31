import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointStrikethroughPriceComponent } from './price-point-strikethrough-price.component';

describe('PricePointStrikethroughPriceComponent', () => {
  let component: PricePointStrikethroughPriceComponent;
  let fixture: ComponentFixture<PricePointStrikethroughPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointStrikethroughPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointStrikethroughPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
