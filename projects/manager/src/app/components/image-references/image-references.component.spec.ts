import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageReferencesComponent } from './image-references.component';

describe('ImageReferencesComponent', () => {
  let component: ImageReferencesComponent;
  let fixture: ComponentFixture<ImageReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageReferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
