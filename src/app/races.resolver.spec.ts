import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';

import { racesResolver } from './races.resolver';
import { RaceService } from './race.service';
import { RaceModel } from './models/race.model';

describe('RacesResolver', () => {
  let raceService: jasmine.SpyObj<RaceService>;
  const executeResolver: ResolveFn<Array<RaceModel>> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => racesResolver(...resolverParameters));
  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['list']);
    TestBed.configureTestingModule({
      providers: [{ provide: RaceService, useValue: raceService }]
    });
  });

  it('should resolve races using the path of the activated route config ', () => {
    const expectedResult: Observable<Array<RaceModel>> = EMPTY;
    raceService.list.and.returnValue(expectedResult);

    const routeSnapshot = {
      routeConfig: { path: 'finished' }
    } as ActivatedRouteSnapshot;
    const result = executeResolver(routeSnapshot, {} as RouterStateSnapshot);

    expect(result).withContext('The resolver should return the races').toBe(expectedResult);
    expect(raceService.list).toHaveBeenCalledWith('FINISHED');
  });
});
