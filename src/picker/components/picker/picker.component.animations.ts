import {animate, group, query, style, transition, trigger} from '@angular/animations';

/**
 * Animation trigger for animating scale up and scale down picker
 */
export const scaleUpDownTrigger = trigger('scaleUpDown',
[
    transition(':enter', 
    [
        style(
        {
            opacity: 0
        }),
        animate('220ms', style(
        {
            opacity: 1
        }))
    ]),
    transition(':leave', 
    [
        animate('220ms', style(
        {
            opacity: 0
        }))
    ]),
    transition(':increment', 
    [
        group(
        [
            query(':enter',
            [
                style(
                {
                    opacity: 0,
                    position: 'absolute',
                    transform: 'scale(110%)',
                }),
                animate('220ms', style(
                {
                    opacity: 1,
                    transform: 'scale(100%)',
                }))
            ]),
            query(':leave',
            [
                style(
                {
                    transform: 'scale(100%)',
                    opacity: 1,
                    position: 'absolute'
                }),
                animate('220ms', style(
                {
                    transform: 'scale(90%)',
                    opacity: 0
                }))
            ])
        ])
    ]),
    transition(':decrement', 
    [
        group(
        [
            query(':enter',
            [
                style(
                {
                    opacity: 0,
                    position: 'absolute',
                    transform: 'scale(90%)'
                }),
                animate('220ms', style(
                {
                    opacity: 1,
                    transform: 'scale(100%)'
                }))
            ]),
            query(':leave',
            [
                style(
                {
                    transform: 'scale(100%)',
                    position: 'absolute'
                }),
                animate('220ms', style(
                {
                    transform: 'scale(110%)',
                    opacity: 0
                }))
            ])
        ])
    ])
]);