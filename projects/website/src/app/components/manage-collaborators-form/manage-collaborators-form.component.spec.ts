import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCollaboratorsFormComponent } from './manage-collaborators-form.component';

describe('ManageCollaboratorsFormComponent', () => {
  let component: ManageCollaboratorsFormComponent;
  let fixture: ComponentFixture<ManageCollaboratorsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCollaboratorsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCollaboratorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
