import { Routes } from '@angular/router';
import { RacesComponent } from './races.component';
import { PendingRacesComponent } from './pending-races/pending-races.component';
import { FinishedRacesComponent } from './finished-races/finished-races.component';
import { LiveComponent } from '../live/live.component';
import { BetComponent } from '../bet/bet.component';
import { racesResolver } from '../races.resolver';
import { raceResolver } from '../race.resolver';

export const raceRoutes: Routes = [
  {
    path: '',
    component: RacesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'pending' },
      {
        path: 'pending',
        component: PendingRacesComponent,
        resolve: {
          races: racesResolver
        }
      },
      {
        path: 'finished',
        component: FinishedRacesComponent,
        resolve: {
          races: racesResolver
        }
      }
    ]
  },
  {
    path: ':raceId',
    component: BetComponent,
    resolve: {
      race: raceResolver
    }
  },
  {
    path: ':raceId/live',
    component: LiveComponent,
    resolve: {
      race: raceResolver
    }
  }
];
