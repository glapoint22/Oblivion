import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineWidgetDevComponent } from './line-widget-dev.component';

describe('LineWidgetDevComponent', () => {
  let component: LineWidgetDevComponent;
  let fixture: ComponentFixture<LineWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
