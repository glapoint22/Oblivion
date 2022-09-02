import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryRowComponent } from './query-row.component';

describe('QueryRowComponent', () => {
  let component: QueryRowComponent;
  let fixture: ComponentFixture<QueryRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
