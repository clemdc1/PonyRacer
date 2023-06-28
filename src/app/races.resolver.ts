import { ResolveFn } from '@angular/router';
import { RaceModel } from './models/race.model';
import { RaceService } from './race.service';
import { inject } from '@angular/core';

export const racesResolver: ResolveFn<Array<RaceModel>> = route => {
  const status = route.routeConfig!.path!.toUpperCase() as 'PENDING' | 'RUNNING' | 'FINISHED';
  const raceService = inject(RaceService);
  return raceService.list(status);
};
