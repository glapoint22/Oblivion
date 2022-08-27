import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTextWidgetPropertiesComponent } from './email-text-widget-properties.component';

describe('EmailTextWidgetPropertiesComponent', () => {
  let component: EmailTextWidgetPropertiesComponent;
  let fixture: ComponentFixture<EmailTextWidgetPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTextWidgetPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTextWidgetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
