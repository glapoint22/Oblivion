import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordOneTimePasswordFormComponent } from './reset-password-one-time-password-form.component';

describe('ResetPasswordOneTimePasswordFormComponent', () => {
  let component: ResetPasswordOneTimePasswordFormComponent;
  let fixture: ComponentFixture<ResetPasswordOneTimePasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordOneTimePasswordFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordOneTimePasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
