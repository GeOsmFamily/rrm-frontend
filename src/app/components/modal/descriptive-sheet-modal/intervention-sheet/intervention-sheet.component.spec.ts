import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionSheetComponent } from './intervention-sheet.component';

describe('InterventionSheetComponent', () => {
  let component: InterventionSheetComponent;
  let fixture: ComponentFixture<InterventionSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterventionSheetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
