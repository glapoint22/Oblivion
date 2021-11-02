import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCollaboratorPromptComponent } from './remove-collaborator-prompt.component';

describe('RemoveCollaboratorPromptComponent', () => {
  let component: RemoveCollaboratorPromptComponent;
  let fixture: ComponentFixture<RemoveCollaboratorPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveCollaboratorPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCollaboratorPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
