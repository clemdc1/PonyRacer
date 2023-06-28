import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { EMPTY, Observable, catchError, concat, of, shareReplay, switchMap } from 'rxjs';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pr-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbCollapse],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  navbarCollapsed = true;

  userEvents!: Observable<UserModel | null>;

  constructor(private userService: UserService, private router: Router) {
    this.userEvents = this.userService.userEvents.pipe(
      switchMap(user => (user ? concat(of(user), this.userService.scoreUpdates(user.id).pipe(catchError(() => EMPTY))) : of(null))),
      shareReplay()
    );
  }

  toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  logout(event: Event): void {
    event.preventDefault();
    this.userService.logout();
    this.router.navigateByUrl('/');
  }
}
