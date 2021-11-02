import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteListPromptComponent } from './delete-list-prompt.component';

describe('DeleteListPromptComponent', () => {
  let component: DeleteListPromptComponent;
  let fixture: ComponentFixture<DeleteListPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteListPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteListPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
