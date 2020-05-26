import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVehicleDataComponent } from './manage-vehicle-data.component';

describe('ManageVehicleDataComponent', () => {
  let component: ManageVehicleDataComponent;
  let fixture: ComponentFixture<ManageVehicleDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVehicleDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVehicleDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
