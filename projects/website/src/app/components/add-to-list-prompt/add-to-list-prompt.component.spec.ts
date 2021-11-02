import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToListPromptComponent } from './add-to-list-prompt.component';

describe('AddToListPromptComponent', () => {
  let component: AddToListPromptComponent;
  let fixture: ComponentFixture<AddToListPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToListPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToListPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
