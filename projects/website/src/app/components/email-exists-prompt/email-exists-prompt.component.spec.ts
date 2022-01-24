import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailExistsPromptComponent } from './email-exists-prompt.component';

describe('EmailExistsPromptComponent', () => {
  let component: EmailExistsPromptComponent;
  let fixture: ComponentFixture<EmailExistsPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailExistsPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailExistsPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
