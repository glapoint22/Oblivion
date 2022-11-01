import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBonusesComponent } from './product-bonuses.component';

describe('ProductBonusesComponent', () => {
  let component: ProductBonusesComponent;
  let fixture: ComponentFixture<ProductBonusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBonusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBonusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
