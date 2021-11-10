import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NicheMenuPopupComponent } from './niche-menu-popup.component';

describe('NicheMenuPopupComponent', () => {
  let component: NicheMenuPopupComponent;
  let fixture: ComponentFixture<NicheMenuPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NicheMenuPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NicheMenuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
