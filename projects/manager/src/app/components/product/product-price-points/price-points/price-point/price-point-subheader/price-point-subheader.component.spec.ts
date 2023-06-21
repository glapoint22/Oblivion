import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointSubheaderComponent } from './price-point-subheader.component';

describe('PricePointSubheaderComponent', () => {
  let component: PricePointSubheaderComponent;
  let fixture: ComponentFixture<PricePointSubheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointSubheaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointSubheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
