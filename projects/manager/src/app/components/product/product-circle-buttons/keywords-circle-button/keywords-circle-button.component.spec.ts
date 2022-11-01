import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsCircleButtonComponent } from './keywords-circle-button.component';

describe('KeywordsCircleButtonComponent', () => {
  let component: KeywordsCircleButtonComponent;
  let fixture: ComponentFixture<KeywordsCircleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeywordsCircleButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordsCircleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
