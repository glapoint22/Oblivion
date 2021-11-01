import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePasswordFormComponent } from './create-password-form.component';

describe('CreatePasswordFormComponent', () => {
  let component: CreatePasswordFormComponent;
  let fixture: ComponentFixture<CreatePasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePasswordFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
