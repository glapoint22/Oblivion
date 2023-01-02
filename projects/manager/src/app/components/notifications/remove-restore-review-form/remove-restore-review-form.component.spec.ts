import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveRestoreReviewFormComponent } from './remove-restore-review-form.component';

describe('RemoveRestoreReviewFormComponent', () => {
  let component: RemoveRestoreReviewFormComponent;
  let fixture: ComponentFixture<RemoveRestoreReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveRestoreReviewFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveRestoreReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
