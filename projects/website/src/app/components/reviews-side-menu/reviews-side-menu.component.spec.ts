import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsSideMenuComponent } from './reviews-side-menu.component';

describe('ReviewsSideMenuComponent', () => {
  let component: ReviewsSideMenuComponent;
  let fixture: ComponentFixture<ReviewsSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewsSideMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
