import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWidgetDevComponent } from './button-widget-dev.component';

describe('ButtonWidgetDevComponent', () => {
  let component: ButtonWidgetDevComponent;
  let fixture: ComponentFixture<ButtonWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
