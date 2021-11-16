import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPromptComponent } from './success-prompt.component';

describe('SuccessPromptComponent', () => {
  let component: SuccessPromptComponent;
  let fixture: ComponentFixture<SuccessPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
