import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeNameFormComponent } from './change-name-form.component';

describe('ChangeNameFormComponent', () => {
  let component: ChangeNameFormComponent;
  let fixture: ComponentFixture<ChangeNameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeNameFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeNameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
