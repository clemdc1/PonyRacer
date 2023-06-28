import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';

@Component({
  selector: 'pr-race',
  standalone: true,
  imports: [CommonModule, PonyComponent, FromNowPipe],
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})
export class RaceComponent {
  @Input({ required: true }) raceModel!: RaceModel;
}
