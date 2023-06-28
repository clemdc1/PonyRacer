import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormControlValidationDirective } from '../form-control-validation.directive';
import { FormLabelDirective } from '../form-label.directive';
import { FormLabelValidationDirective } from '../form-label-validation.directive';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormControlValidationDirective, FormLabelDirective, FormLabelValidationDirective, NgbAlert]
})
export class RegisterComponent {
  registrationFailed = false;
  loginCtrl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  passwordCtrl = new FormControl('', Validators.required);
  confirmPasswordCtrl = new FormControl('', Validators.required);
  birthYearCtrl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1900),
    Validators.max(new Date().getFullYear())
  ]);
  passwordGroup = new FormGroup(
    { password: this.passwordCtrl, confirmPassword: this.confirmPasswordCtrl },
    { validators: RegisterComponent.passwordMatch }
  );

  userForm = this.fb.group({
    login: this.loginCtrl,
    passwordForm: this.passwordGroup,
    birthYear: this.birthYearCtrl
  });

  constructor(private fb: NonNullableFormBuilder, private userService: UserService, private router: Router) {}

  register(): void {
    const formValue = this.userForm.value;
    this.userService.register(formValue.login!, formValue.passwordForm!.password!, formValue.birthYear!).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => (this.registrationFailed = true)
    });
  }

  static passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')!.value;
    const confirmPassword = control.get('confirmPassword')!.value;
    return password !== confirmPassword ? { matchingError: true } : null;
  }
}
