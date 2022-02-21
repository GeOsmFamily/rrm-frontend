import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsSheetComponent } from './ems-sheet.component';

describe('EmsSheetComponent', () => {
  let component: EmsSheetComponent;
  let fixture: ComponentFixture<EmsSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmsSheetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmsSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
