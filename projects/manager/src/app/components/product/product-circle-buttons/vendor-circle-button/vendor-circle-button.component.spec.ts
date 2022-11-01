import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCircleButtonComponent } from './vendor-circle-button.component';

describe('VendorCircleButtonComponent', () => {
  let component: VendorCircleButtonComponent;
  let fixture: ComponentFixture<VendorCircleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCircleButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCircleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
