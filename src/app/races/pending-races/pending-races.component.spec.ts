import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { PendingRacesComponent } from './pending-races.component';
import { RaceComponent } from '../../race/race.component';

describe('PendingRacesComponent', () => {
  const activatedRoute = {
    snapshot: {
      data: {
        races: [
          { name: 'Lyon', startInstant: '2020-02-18T08:02:00Z' },
          { name: 'Los Angeles', startInstant: '2020-02-18T08:03:00Z' }
        ]
      }
    }
  };

  beforeEach(() => {
    TestBed.overrideTemplate(RaceComponent, '<h2>Race</h2>');
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: activatedRoute }]
    });
  });

  it('should display every race', () => {
    const fixture = TestBed.createComponent(PendingRacesComponent);
    fixture.detectChanges();

    const debugElement = fixture.debugElement;
    const raceNames = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNames.length).withContext('You should have two `RaceComponent` displayed').toBe(2);
  });

  it('should display a link to bet on a race', () => {
    const fixture = TestBed.createComponent(PendingRacesComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const raceNames = element.querySelectorAll('a');
    expect(raceNames.length).withContext('You must have a link to go to the bet page for each race').toBe(2);
    expect(raceNames[0].textContent).toContain('Bet on Lyon');
    expect(raceNames[1].textContent).toContain('Bet on Los Angeles');
  });
});
