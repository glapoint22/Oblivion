import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSentPromptComponent } from './email-sent-prompt.component';

describe('EmailSentPromptComponent', () => {
  let component: EmailSentPromptComponent;
  let fixture: ComponentFixture<EmailSentPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSentPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSentPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
