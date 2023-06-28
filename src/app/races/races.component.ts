import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'pr-races',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent {}
