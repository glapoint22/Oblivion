import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterWidgetDevComponent } from './poster-widget-dev.component';

describe('PosterWidgetDevComponent', () => {
  let component: PosterWidgetDevComponent;
  let fixture: ComponentFixture<PosterWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosterWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosterWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
