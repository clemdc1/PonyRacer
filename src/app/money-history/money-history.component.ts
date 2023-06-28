import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'chartjs-adapter-date-fns';
import { Chart, Filler, Legend, LineController, LineElement, LinearScale, PointElement, TimeScale, Tooltip } from 'chart.js';
import { UserService } from '../user.service';

Chart.register(LineController, LinearScale, TimeScale, PointElement, LineElement, Legend, Filler, Tooltip);

@Component({
  selector: 'pr-money-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './money-history.component.html',
  styleUrls: ['./money-history.component.css']
})
export class MoneyHistoryComponent implements AfterViewInit {
  @ViewChild('chart') canvas!: ElementRef<HTMLCanvasElement>;

  moneyChart: Chart | null = null;

  constructor(private zone: NgZone, private userService: UserService) {}

  ngAfterViewInit(): void {
    const ctx = this.canvas.nativeElement;
    this.userService.getMoneyHistory().subscribe(history => {
      this.zone.runOutsideAngular(() => {
        this.moneyChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: history.map(event => event.instant),
            datasets: [
              {
                label: 'Money history',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: 'origin',
                tension: 0.5,
                data: history.map(event => event.money)
              }
            ]
          },
          options: {
            scales: {
              x: {
                type: 'time'
              }
            }
          }
        });
      });
    });
  }
}
