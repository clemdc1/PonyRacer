import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { RacesComponent } from './races/races.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'pr-root',
  standalone: true,
  imports: [CommonModule, MenuComponent, RacesComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ponyracer';
}
