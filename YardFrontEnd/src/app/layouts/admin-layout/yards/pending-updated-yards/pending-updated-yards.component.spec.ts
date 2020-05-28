import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingUpdatedYardsComponent } from './pending-updated-yards.component';

describe('PendingUpdatedYardsComponent', () => {
  let component: PendingUpdatedYardsComponent;
  let fixture: ComponentFixture<PendingUpdatedYardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingUpdatedYardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingUpdatedYardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
