import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPropertiesComponent } from './email-properties.component';

describe('EmailPropertiesComponent', () => {
  let component: EmailPropertiesComponent;
  let fixture: ComponentFixture<EmailPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
