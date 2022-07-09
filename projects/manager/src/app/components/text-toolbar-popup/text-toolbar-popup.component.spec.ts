import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextToolbarPopupComponent } from './text-toolbar-popup.component';

describe('TextToolbarPopupComponent', () => {
  let component: TextToolbarPopupComponent;
  let fixture: ComponentFixture<TextToolbarPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextToolbarPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextToolbarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
