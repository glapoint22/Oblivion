import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateItemPromptComponent } from './duplicate-item-prompt.component';

describe('DuplicateItemPromptComponent', () => {
  let component: DuplicateItemPromptComponent;
  let fixture: ComponentFixture<DuplicateItemPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateItemPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateItemPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
