import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PimpdmSheetComponent } from './pimpdm-sheet.component';

describe('PimpdmSheetComponent', () => {
  let component: PimpdmSheetComponent;
  let fixture: ComponentFixture<PimpdmSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PimpdmSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PimpdmSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
