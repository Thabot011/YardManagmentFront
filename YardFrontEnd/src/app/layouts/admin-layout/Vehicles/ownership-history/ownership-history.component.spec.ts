import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnershipHistoryComponent } from './ownership-history.component';

describe('OwnershipHistoryComponent', () => {
  let component: OwnershipHistoryComponent;
  let fixture: ComponentFixture<OwnershipHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnershipHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnershipHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
