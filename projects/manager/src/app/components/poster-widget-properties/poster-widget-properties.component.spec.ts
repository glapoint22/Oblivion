import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterWidgetPropertiesComponent } from './poster-widget-properties.component';

describe('PosterWidgetPropertiesComponent', () => {
  let component: PosterWidgetPropertiesComponent;
  let fixture: ComponentFixture<PosterWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosterWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosterWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
