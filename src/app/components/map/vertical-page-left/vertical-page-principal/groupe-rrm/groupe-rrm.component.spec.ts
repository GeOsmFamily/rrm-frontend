import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupeRrmComponent } from './groupe-rrm.component';

describe('GroupeRrmComponent', () => {
  let component: GroupeRrmComponent;
  let fixture: ComponentFixture<GroupeRrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupeRrmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupeRrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
