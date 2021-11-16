import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationFormComponent } from './email-verification-form.component';

describe('EmailVerificationFormComponent', () => {
  let component: EmailVerificationFormComponent;
  let fixture: ComponentFixture<EmailVerificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailVerificationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
