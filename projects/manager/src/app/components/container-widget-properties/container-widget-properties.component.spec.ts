import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerWidgetPropertiesComponent } from './container-widget-properties.component';

describe('ContainerWidgetPropertiesComponent', () => {
  let component: ContainerWidgetPropertiesComponent;
  let fixture: ComponentFixture<ContainerWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
