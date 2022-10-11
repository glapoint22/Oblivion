import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedUsersFormComponent } from './blocked-users-form.component';

describe('BlockedUsersFormComponent', () => {
  let component: BlockedUsersFormComponent;
  let fixture: ComponentFixture<BlockedUsersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockedUsersFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedUsersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
