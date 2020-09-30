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
                    transform: 'scale(1.1)',
                }),
                animate('220ms', style(
                {
                    opacity: 1,
                    transform: 'scale(1)',
                }))
            ]),
            query(':leave',
            [
                style(
                {
                    transform: 'scale(1)',
                    opacity: 1,
                    position: 'absolute'
                }),
                animate('220ms', style(
                {
                    transform: 'scale(.9)',
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
                    transform: 'scale(.9)'
                }),
                animate('220ms', style(
                {
                    opacity: 1,
                    transform: 'scale(1)'
                }))
            ]),
            query(':leave',
            [
                style(
                {
                    transform: 'scale(1)',
                    position: 'absolute'
                }),
                animate('220ms', style(
                {
                    transform: 'scale(1.1)',
                    opacity: 0
                }))
            ])
        ])
    ])
]);