import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

import { FinishedRacesComponent } from './finished-races.component';
import { RaceComponent } from '../../race/race.component';

describe('FinishedRacesComponent', () => {
  const activatedRoute = {
    snapshot: {
      data: {
        races: [
          { name: 'Lyon', startInstant: '2020-02-18T08:02:00Z' },
          { name: 'Los Angeles', startInstant: '2020-02-18T08:03:00Z' },
          { name: 'Sydney', startInstant: '2020-02-18T08:04:00Z' },
          { name: 'Tokyo', startInstant: '2020-02-18T08:05:00Z' },
          { name: 'Casablanca', startInstant: '2020-02-18T08:06:00Z' },
          { name: 'Paris', startInstant: '2020-02-18T08:07:00Z' },
          { name: 'London', startInstant: '2020-02-18T08:08:00Z' },
          { name: 'Madrid', startInstant: '2020-02-18T08:09:00Z' },
          { name: 'Lima', startInstant: '2020-02-18T08:10:00Z' },
          { name: 'Bali', startInstant: '2020-02-18T08:11:00Z' },
          { name: 'Berlin', startInstant: '2020-02-18T08:12:00Z' },
          { name: 'Moscow', startInstant: '2020-02-18T08:13:00Z' }
        ]
      }
    }
  };

  beforeEach(() => {
    TestBed.overrideTemplate(RaceComponent, '<h2>Race</h2>');
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    });
  });

  it('should display every race', () => {
    const fixture = TestBed.createComponent(FinishedRacesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.races).withContext('You need to have a field `races` initialized with all races').not.toBeNull();
    expect(fixture.componentInstance.races.length).withContext('You need to have a field `races` initialized with all races').toBe(12);
    expect(fixture.componentInstance.page).withContext('You need to have a field `page` initialized with 1').toBe(1);

    const debugElement = fixture.debugElement;
    const raceNames = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNames.length).withContext('You should have 10 `RaceComponent` displayed').toBe(10);
    expect(raceNames[0].componentInstance.raceModel.name).withContext('You should display the first page races').toBe('Lyon');

    const pagination = debugElement.query(By.directive(NgbPagination));
    expect(pagination).withContext('You should have a pagination').not.toBeNull();
    const element = fixture.nativeElement;
    const pageLinks = element.querySelectorAll('a.page-link');
    expect(pageLinks.length).withContext('You should have 2 pages, as the test uses 12 races').toBe(4);

    fixture.componentInstance.page = 2;
    fixture.detectChanges();

    // expect to not change as we are using OnPush
    const raceNamesPage2 = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNamesPage2.length)
      .withContext('You should still have 10 `RaceComponent` displayed on the 2nd page, as we are using OnPush')
      .toBe(10);

    // expect to change when an event is fired
    pageLinks[1].dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const raceNamesPage2AfterClick = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNamesPage2AfterClick.length)
      .withContext('You should have 2 `RaceComponent` displayed on the 2nd page, as the test uses 12 races')
      .toBe(2);
    expect(raceNamesPage2AfterClick[0].componentInstance.raceModel.name)
      .withContext('You should display the second page races')
      .toBe('Berlin');
  });

  it('should not display a link to bet on a race', () => {
    const fixture = TestBed.createComponent(FinishedRacesComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const raceNames = element.querySelectorAll('a:not(.page-link)');
    expect(raceNames.length).withContext('You must NOT have a link to go to the bet page for each race').toBe(0);
  });
});
