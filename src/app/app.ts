import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PetFinder } from '../pet-finder/pet-finder';
import { Navbar } from '../navbar/navbar';
import { Notes } from '../notes/notes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Notes],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pet-finder');
}
