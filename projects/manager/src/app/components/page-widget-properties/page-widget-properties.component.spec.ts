import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWidgetPropertiesComponent } from './page-widget-properties.component';

describe('WidgetPropertiesComponent', () => {
  let component: PageWidgetPropertiesComponent;
  let fixture: ComponentFixture<PageWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
