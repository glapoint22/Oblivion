import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountPromptComponent } from './delete-account-prompt.component';

describe('DeleteAccountPromptComponent', () => {
  let component: DeleteAccountPromptComponent;
  let fixture: ComponentFixture<DeleteAccountPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAccountPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
