import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NichesWidgetPropertiesComponent } from './niches-widget-properties.component';

describe('NichesWidgetPropertiesComponent', () => {
  let component: NichesWidgetPropertiesComponent;
  let fixture: ComponentFixture<NichesWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NichesWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NichesWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
