import {animateChild, transition, trigger} from '@angular/animations';

/**
 * Animation trigger for animating children on enter leave
 */
export const enterLeaveAnimateChildTrigger = trigger('enterLeaveAnimateChild',
[
    transition(':enter', 
    [
        animateChild()
        // query(':enter', animateChild())
    ]),
    transition(':leave', 
    [
        animateChild()
        // query(':leave', animateChild())
    ])
]);