import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetInspectorComponent } from './widget-inspector.component';

describe('WidgetInspectorComponent', () => {
  let component: WidgetInspectorComponent;
  let fixture: ComponentFixture<WidgetInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetInspectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
