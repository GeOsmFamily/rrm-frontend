import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlerteSheetComponent } from './alerte-sheet.component';

describe('AlerteSheetComponent', () => {
  let component: AlerteSheetComponent;
  let fixture: ComponentFixture<AlerteSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlerteSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlerteSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
