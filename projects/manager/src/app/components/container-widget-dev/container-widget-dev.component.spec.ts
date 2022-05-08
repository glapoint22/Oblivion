import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerWidgetDevComponent } from './container-widget-dev.component';

describe('ContainerWidgetDevComponent', () => {
  let component: ContainerWidgetDevComponent;
  let fixture: ComponentFixture<ContainerWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
