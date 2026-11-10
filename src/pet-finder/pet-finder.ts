/**
 * allows users to search for pet archive information using a pet image address
 * displays resulting pet info using PetCard component 
 */

import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { PetApiService } from '../app/services/pet-api';
import { JsonPipe } from '@angular/common';
import { PetCard } from '../app/pet-card/pet-card';

@Component({
  selector: 'app-pet-finder',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, PetCard],
  templateUrl: './pet-finder.html',
  styleUrl: './pet-finder.css'
})
export class PetFinder {
  // link is requried & must be a Chicken Smoothie pet image address
  petLinkControl = new FormGroup({
    link: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(
          /^https:\/\/static\.chickensmoothie\.com\/(?:archive\/image\.php\?k=|pic\.php\?k=).+$/
        )
      ]
    })
  });

  result = signal<any>(null);
  errorMessage = signal('');
  loading = signal(false);

  constructor(private petApi: PetApiService) {}

  lookupPet(): void {
    console.log('lookupPet() called');

    if (this.petLinkControl.invalid) {
      this.petLinkControl.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.result.set(null);
    this.errorMessage.set('');

    const link = this.petLinkControl.controls.link.value;

    // send lookup request to API 
    this.petApi.lookupPet(link).subscribe({
      next: (response) => {
        this.result.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Something went wrong while looking up the pet.';
        this.loading.set(false);

      }
    });

  }
}