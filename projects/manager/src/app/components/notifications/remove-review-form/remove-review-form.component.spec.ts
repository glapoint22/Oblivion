import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveReviewFormComponent } from './remove-review-form.component';

describe('RemoveReviewFormComponent', () => {
  let component: RemoveReviewFormComponent;
  let fixture: ComponentFixture<RemoveReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveReviewFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
