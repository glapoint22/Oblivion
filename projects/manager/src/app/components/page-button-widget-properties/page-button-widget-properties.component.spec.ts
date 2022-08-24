import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageButtonWidgetPropertiesComponent } from './page-button-widget-properties.component';

describe('ButtonWidgetNormalPropertiesComponent', () => {
  let component: PageButtonWidgetPropertiesComponent;
  let fixture: ComponentFixture<PageButtonWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageButtonWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageButtonWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
