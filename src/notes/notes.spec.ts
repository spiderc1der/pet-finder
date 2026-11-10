import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notes } from './notes';

describe('Notes', () => {
  let component: Notes;
  let fixture: ComponentFixture<Notes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notes],
    }).compileComponents();

    fixture = TestBed.createComponent(Notes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
