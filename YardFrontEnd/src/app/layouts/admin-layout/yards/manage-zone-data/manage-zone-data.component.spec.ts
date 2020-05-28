import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageZoneDataComponent } from './manage-zone-data.component';

describe('ManageZoneDataComponent', () => {
  let component: ManageZoneDataComponent;
  let fixture: ComponentFixture<ManageZoneDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageZoneDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageZoneDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
