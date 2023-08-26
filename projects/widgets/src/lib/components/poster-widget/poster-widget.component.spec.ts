import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterWidgetComponent } from './poster-widget.component';

describe('PosterWidgetComponent', () => {
  let component: PosterWidgetComponent;
  let fixture: ComponentFixture<PosterWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosterWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosterWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
