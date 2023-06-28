import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RaceComponent } from 'src/app/race/race.component';
import { RaceModel } from 'src/app/models/race.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, RaceComponent],
  templateUrl: './pending-races.component.html',
  styleUrls: ['./pending-races.component.css']
})
export class PendingRacesComponent {
  races: Array<RaceModel>;

  constructor(route: ActivatedRoute) {
    this.races = route.snapshot.data['races'];
  }
}
