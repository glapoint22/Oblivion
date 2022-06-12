import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageKeywordsComponent } from './page-keywords.component';

describe('PageKeywordsComponent', () => {
  let component: PageKeywordsComponent;
  let fixture: ComponentFixture<PageKeywordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageKeywordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
