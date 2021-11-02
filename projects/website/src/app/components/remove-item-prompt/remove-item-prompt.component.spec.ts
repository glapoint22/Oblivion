import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveItemPromptComponent } from './remove-item-prompt.component';

describe('RemoveItemPromptComponent', () => {
  let component: RemoveItemPromptComponent;
  let fixture: ComponentFixture<RemoveItemPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveItemPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveItemPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
