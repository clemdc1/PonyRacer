import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaceModel } from 'src/app/models/race.model';
import { ActivatedRoute } from '@angular/router';
import { RaceComponent } from 'src/app/race/race.component';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [CommonModule, RaceComponent, NgbPagination],
  templateUrl: './finished-races.component.html',
  styleUrls: ['./finished-races.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinishedRacesComponent {
  races: Array<RaceModel>;
  page = 1;
  constructor(route: ActivatedRoute) {
    this.races = route.snapshot.data['races'];
  }
}
