import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopiedPopupComponent } from './copied-popup.component';

describe('CopiedPopupComponent', () => {
  let component: CopiedPopupComponent;
  let fixture: ComponentFixture<CopiedPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopiedPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopiedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
