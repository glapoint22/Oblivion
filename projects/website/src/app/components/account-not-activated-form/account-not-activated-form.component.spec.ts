import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNotActivatedFormComponent } from './account-not-activated-form.component';

describe('AccountNotActivatedFormComponent', () => {
  let component: AccountNotActivatedFormComponent;
  let fixture: ComponentFixture<AccountNotActivatedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountNotActivatedFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountNotActivatedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
