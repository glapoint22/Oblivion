import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointTextComponent } from './price-point-text.component';

describe('PricePointTextComponent', () => {
  let component: PricePointTextComponent;
  let fixture: ComponentFixture<PricePointTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
