import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NichesWidgetComponent } from './niches-widget.component';

describe('NichesWidgetComponent', () => {
  let component: NichesWidgetComponent;
  let fixture: ComponentFixture<NichesWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NichesWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NichesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
