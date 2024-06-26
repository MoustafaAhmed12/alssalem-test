import { trigger, transition, style, animate } from '@angular/animations';

export const toggleAnimation = trigger('toggleAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('500ms linear', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('500ms linear', style({ opacity: 0 }))]),
]);
