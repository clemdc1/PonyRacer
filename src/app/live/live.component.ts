import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaceModel } from '../models/race.model';
import { RaceService } from '../race.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PonyWithPositionModel } from '../models/pony.model';
import { PonyComponent } from '../pony/pony.component';
import {
  EMPTY,
  Subject,
  bufferToggle,
  catchError,
  filter,
  finalize,
  groupBy,
  interval,
  map,
  mergeMap,
  switchMap,
  throttleTime
} from 'rxjs';
import { FromNowPipe } from '../from-now.pipe';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pr-live',
  standalone: true,
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css'],
  imports: [CommonModule, PonyComponent, FromNowPipe, NgbAlert]
})
export class LiveComponent {
  raceModel: RaceModel | null = null;
  poniesWithPosition: Array<PonyWithPositionModel> = [];
  error = false;
  winners: Array<PonyWithPositionModel> = [];
  betWon: boolean | null = null;
  clickSubject = new Subject<PonyWithPositionModel>();

  constructor(private ref: ChangeDetectorRef, private raceService: RaceService, private route: ActivatedRoute) {
    this.raceModel = this.route.snapshot.data['race'];

    if (this.raceModel!.status !== 'FINISHED') {
      this.raceService
        .live(this.raceModel!.id)
        .pipe(
          takeUntilDestroyed(),
          finalize(() => this.ref.markForCheck())
        )
        .subscribe({
          next: positions => {
            this.poniesWithPosition = positions;
            this.raceModel!.status = 'RUNNING';
            this.ref.markForCheck();
          },
          error: () => (this.error = true),
          complete: () => {
            this.raceModel!.status = 'FINISHED';
            this.winners = this.poniesWithPosition.filter(pony => pony.position >= 100);
            this.betWon = this.winners.some(pony => pony.id === this.raceModel!.betPonyId);
          }
        });
    }
    this.clickSubject
      .pipe(
        groupBy(pony => pony.id, { element: pony => pony.id }),
        mergeMap(obs => obs.pipe(bufferToggle(obs, () => interval(1000)))),
        filter(array => array.length >= 5),
        throttleTime(1000),
        map(array => array[0]),
        switchMap(ponyId => this.raceService.boost(this.raceModel!.id, ponyId).pipe(catchError(() => EMPTY)))
      )
      .subscribe(() => {});
  }
  onClick(pony: PonyWithPositionModel): void {
    this.clickSubject.next(pony);
  }
  ponyById(index: number, pony: PonyWithPositionModel) {
    return pony.id;
  }
}
