import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormControlValidationDirective } from '../form-control-validation.directive';
import { FormLabelDirective } from '../form-label.directive';
import { FormLabelValidationDirective } from '../form-label-validation.directive';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pr-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, FormControlValidationDirective, FormLabelDirective, FormLabelValidationDirective, NgbAlert]
})
export class LoginComponent {
  authenticationFailed = false;
  credentials = {
    login: '',
    password: ''
  };

  constructor(private userService: UserService, private router: Router) {}

  authenticate(): void {
    this.authenticationFailed = false;
    this.userService.authenticate(this.credentials).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => (this.authenticationFailed = true)
    });
  }
}
