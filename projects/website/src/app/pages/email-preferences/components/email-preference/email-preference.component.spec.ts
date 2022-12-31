import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPreferenceComponent } from './email-preference.component';

describe('EmailPreferenceComponent', () => {
  let component: EmailPreferenceComponent;
  let fixture: ComponentFixture<EmailPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailPreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
