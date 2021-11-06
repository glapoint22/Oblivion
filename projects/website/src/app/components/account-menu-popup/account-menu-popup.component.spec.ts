import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMenuPopupComponent } from './account-menu-popup.component';

describe('AccountMenuPopupComponent', () => {
  let component: AccountMenuPopupComponent;
  let fixture: ComponentFixture<AccountMenuPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountMenuPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMenuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
