import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActivationPromptComponent } from './account-activation-prompt.component';

describe('AccountActivationPromptComponent', () => {
  let component: AccountActivationPromptComponent;
  let fixture: ComponentFixture<AccountActivationPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountActivationPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActivationPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
