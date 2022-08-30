import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailInspectorComponent } from './email-inspector.component';

describe('EmailInspectorComponent', () => {
  let component: EmailInspectorComponent;
  let fixture: ComponentFixture<EmailInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailInspectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
