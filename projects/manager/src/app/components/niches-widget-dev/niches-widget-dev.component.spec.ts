import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NichesWidgetDevComponent } from './niches-widget-dev.component';

describe('NichesWidgetDevComponent', () => {
  let component: NichesWidgetDevComponent;
  let fixture: ComponentFixture<NichesWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NichesWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NichesWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
