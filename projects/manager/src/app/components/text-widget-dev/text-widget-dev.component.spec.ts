import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextWidgetDevComponent } from './text-widget-dev.component';

describe('TextWidgetDevComponent', () => {
  let component: TextWidgetDevComponent;
  let fixture: ComponentFixture<TextWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
