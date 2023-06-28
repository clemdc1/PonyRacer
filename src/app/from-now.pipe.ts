import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

@Pipe({
  name: 'fromNow',
  standalone: true
})
export class FromNowPipe implements PipeTransform {
  transform(instant: string): string {
    const date = parseISO(instant);
    return formatDistanceToNowStrict(date, { addSuffix: true });
  }
}
