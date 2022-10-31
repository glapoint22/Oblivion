import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointImageComponent } from './price-point-image.component';

describe('PricePointImageComponent', () => {
  let component: PricePointImageComponent;
  let fixture: ComponentFixture<PricePointImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
