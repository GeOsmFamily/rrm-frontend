import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RrmModalComponent } from './rrm-modal.component';

describe('RrmModalComponent', () => {
  let component: RrmModalComponent;
  let fixture: ComponentFixture<RrmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RrmModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RrmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
