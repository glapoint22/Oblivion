import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsPopupComponent } from './keywords-popup.component';

describe('KeywordsPopupComponent', () => {
  let component: KeywordsPopupComponent;
  let fixture: ComponentFixture<KeywordsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeywordsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
