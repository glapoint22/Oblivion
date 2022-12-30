import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceUserNameFormComponent } from './replace-user-name-form.component';

describe('ReplaceUserNameFormComponent', () => {
  let component: ReplaceUserNameFormComponent;
  let fixture: ComponentFixture<ReplaceUserNameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplaceUserNameFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceUserNameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
