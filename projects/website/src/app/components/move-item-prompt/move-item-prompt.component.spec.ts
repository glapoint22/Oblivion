import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveItemPromptComponent } from './move-item-prompt.component';

describe('MoveItemPromptComponent', () => {
  let component: MoveItemPromptComponent;
  let fixture: ComponentFixture<MoveItemPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveItemPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveItemPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
