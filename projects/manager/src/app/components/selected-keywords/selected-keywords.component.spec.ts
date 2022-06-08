import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedKeywordsComponent } from './selected-keywords.component';

describe('SelectedKeywordsComponent', () => {
  let component: SelectedKeywordsComponent;
  let fixture: ComponentFixture<SelectedKeywordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedKeywordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
