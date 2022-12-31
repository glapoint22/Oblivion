import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUserImageFormComponent } from './remove-user-image-form.component';

describe('RemoveUserImageFormComponent', () => {
  let component: RemoveUserImageFormComponent;
  let fixture: ComponentFixture<RemoveUserImageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveUserImageFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveUserImageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
