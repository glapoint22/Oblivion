import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoncompliantUsersFormComponent } from './noncompliant-users-form.component';

describe('NoncompliantUsersFormComponent', () => {
  let component: NoncompliantUsersFormComponent;
  let fixture: ComponentFixture<NoncompliantUsersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoncompliantUsersFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoncompliantUsersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
