import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoplinkPopupComponent } from './hoplink-popup.component';

describe('HoplinkPopupComponent', () => {
  let component: HoplinkPopupComponent;
  let fixture: ComponentFixture<HoplinkPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoplinkPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoplinkPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
