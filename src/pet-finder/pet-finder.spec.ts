import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFinder } from './pet-finder';

describe('PetFinder', () => {
  let component: PetFinder;
  let fixture: ComponentFixture<PetFinder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetFinder],
    }).compileComponents();

    fixture = TestBed.createComponent(PetFinder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
