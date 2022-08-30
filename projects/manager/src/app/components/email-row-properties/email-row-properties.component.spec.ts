import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRowPropertiesComponent } from './email-row-properties.component';

describe('EmailRowPropertiesComponent', () => {
  let component: EmailRowPropertiesComponent;
  let fixture: ComponentFixture<EmailRowPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailRowPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRowPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
