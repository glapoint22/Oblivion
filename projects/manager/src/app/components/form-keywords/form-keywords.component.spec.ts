import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormKeywordsComponent } from './form-keywords.component';

describe('FormKeywordsComponent', () => {
  let component: FormKeywordsComponent;
  let fixture: ComponentFixture<FormKeywordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormKeywordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
