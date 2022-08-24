import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTextWidgetPropertiesComponent } from './page-text-widget-properties.component';

describe('TextWidgetPropertiesComponent', () => {
  let component: PageTextWidgetPropertiesComponent;
  let fixture: ComponentFixture<PageTextWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageTextWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTextWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
