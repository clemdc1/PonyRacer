import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, Params, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';

import { raceResolver } from './race.resolver';
import { RaceService } from './race.service';
import { RaceModel } from './models/race.model';

describe('RaceResolver', () => {
  let raceService: jasmine.SpyObj<RaceService>;
  const executeResolver: ResolveFn<RaceModel> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => raceResolver(...resolverParameters));

  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['get']);
    TestBed.configureTestingModule({
      providers: [{ provide: RaceService, useValue: raceService }]
    });
  });

  it('should resolve race using the raceId route parameter', () => {
    const expectedResult: Observable<RaceModel> = EMPTY;
    raceService.get.and.returnValue(expectedResult);

    const params = { raceId: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { params, paramMap } as ActivatedRouteSnapshot;
    const result = executeResolver(routeSnapshot, {} as RouterStateSnapshot);

    expect(result).withContext('The resolver should call return a race').toBe(expectedResult);
    expect(raceService.get.calls.argsFor(0)[0]).withContext('The resolver should call the RaceService.get method with the id').toBe(42);
  });
});
