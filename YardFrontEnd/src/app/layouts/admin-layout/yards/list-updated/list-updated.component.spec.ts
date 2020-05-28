import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUpdatedComponent } from './list-updated.component';

describe('ListUpdatedComponent', () => {
  let component: ListUpdatedComponent;
  let fixture: ComponentFixture<ListUpdatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUpdatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
