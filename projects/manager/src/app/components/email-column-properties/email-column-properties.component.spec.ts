import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailColumnPropertiesComponent } from './email-column-properties.component';

describe('EmailColumnPropertiesComponent', () => {
  let component: EmailColumnPropertiesComponent;
  let fixture: ComponentFixture<EmailColumnPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailColumnPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailColumnPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
