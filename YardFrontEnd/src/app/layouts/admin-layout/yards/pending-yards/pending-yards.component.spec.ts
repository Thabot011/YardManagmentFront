import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingYardsComponent } from './pending-yards.component';

describe('PendingYardsComponent', () => {
  let component: PendingYardsComponent;
  let fixture: ComponentFixture<PendingYardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingYardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingYardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
