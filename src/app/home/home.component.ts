import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'pr-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: UserModel | null = null;
  constructor(private userService: UserService) {
    this.userService.userEvents.pipe(takeUntilDestroyed()).subscribe(user => (this.user = user));
  }
}
