import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceListComponent } from './distance-list.component';

describe('DistanceListComponent', () => {
  let component: DistanceListComponent;
  let fixture: ComponentFixture<DistanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistanceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
