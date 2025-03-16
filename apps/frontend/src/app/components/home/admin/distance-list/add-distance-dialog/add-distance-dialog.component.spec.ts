import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDistanceDialogComponent } from './add-distance-dialog.component';

describe('AddDistanceDialogComponent', () => {
  let component: AddDistanceDialogComponent;
  let fixture: ComponentFixture<AddDistanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDistanceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDistanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
