import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaceModel } from '../models/race.model';
import { RaceService } from '../race.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PonyModel } from '../models/pony.model';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pr-bet',
  standalone: true,
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css'],
  imports: [CommonModule, PonyComponent, FromNowPipe, RouterLink, NgbAlert]
})
export class BetComponent {
  raceModel!: RaceModel;
  betFailed = false;

  constructor(private raceService: RaceService, private route: ActivatedRoute) {
    this.raceModel = this.route.snapshot.data['race'];
  }

  betOnPony(pony: PonyModel): void {
    if (!this.isPonySelected(pony)) {
      this.raceService.bet(this.raceModel!.id, pony.id).subscribe({
        next: race => (this.raceModel = race),
        error: () => (this.betFailed = true)
      });
    } else {
      this.raceService.cancelBet(this.raceModel!.id).subscribe({
        next: () => (this.raceModel!.betPonyId = undefined),
        error: () => (this.betFailed = true)
      });
    }
  }
  isPonySelected(pony: PonyModel): boolean {
    return pony.id === this.raceModel!.betPonyId;
  }
}
