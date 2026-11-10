/**
 * encapsulates pet information for display in PetFinder 
 */

import { Component, input } from '@angular/core';
import { Pet } from '../models/pet';

@Component({
  selector: 'app-pet-card',
  imports: [],
  templateUrl: './pet-card.html',
  styleUrl: './pet-card.css',
})
export class PetCard {
  pet = input.required<Pet>();

  getImageUrl(): string {
    return `https://static.chickensmoothie.com/archive/image.php?k=${this.pet()._id}&bg=99c57c`;
  }
}

