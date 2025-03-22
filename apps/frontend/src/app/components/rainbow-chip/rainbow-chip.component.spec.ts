import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainbowChipComponent } from './rainbow-chip.component';

describe('RoleChipComponent', () => {
  let component: RainbowChipComponent;
  let fixture: ComponentFixture<RainbowChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RainbowChipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RainbowChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
