import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'label[prFormLabel]',
  standalone: true
})
export class FormLabelDirective {
  @HostBinding('class.text-danger') isInvalid: boolean | null = false;
  constructor() {}
}
