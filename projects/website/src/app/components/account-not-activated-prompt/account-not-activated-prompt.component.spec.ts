import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNotActivatedPromptComponent } from './account-not-activated-prompt.component';

describe('AccountNotActivatedPromptComponent', () => {
  let component: AccountNotActivatedPromptComponent;
  let fixture: ComponentFixture<AccountNotActivatedPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountNotActivatedPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountNotActivatedPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
