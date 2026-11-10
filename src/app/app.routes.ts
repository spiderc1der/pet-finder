import { Routes } from '@angular/router';
import { PetFinder } from '../pet-finder/pet-finder';

export const routes: Routes = [
    { path: '', redirectTo: 'pets', pathMatch: 'full' },
  { path: 'pets', component: PetFinder },
  
];
