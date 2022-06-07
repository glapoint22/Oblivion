import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableKeywordsComponent } from './available-keywords.component';

describe('AvailableKeywordsComponent', () => {
  let component: AvailableKeywordsComponent;
  let fixture: ComponentFixture<AvailableKeywordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableKeywordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
