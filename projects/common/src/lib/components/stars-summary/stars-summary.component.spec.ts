import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsSummaryComponent } from './stars-summary.component';

describe('StarsSummaryComponent', () => {
  let component: StarsSummaryComponent;
  let fixture: ComponentFixture<StarsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
