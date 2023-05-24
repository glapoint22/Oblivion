import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerFormComponent } from './messenger-form.component';

describe('MessengerFormComponent', () => {
  let component: MessengerFormComponent;
  let fixture: ComponentFixture<MessengerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessengerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
