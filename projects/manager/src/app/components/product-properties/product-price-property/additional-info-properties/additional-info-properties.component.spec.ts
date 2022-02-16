import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInfoPropertiesComponent } from './additional-info-properties.component';

describe('AdditionalInfoPropertiesComponent', () => {
  let component: AdditionalInfoPropertiesComponent;
  let fixture: ComponentFixture<AdditionalInfoPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalInfoPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInfoPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
