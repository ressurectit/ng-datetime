/**
 * Available aspect ratios for displaying calendar days
 */
export enum CalendarDayAspectRatio
{
    /**
     * Aspect ratio of width to height is 1:1 (square)
     */
    OneToOne = 100,

    /**
     * Aspect ratio of width to height is 3:2
     */
    ThreeToTwo = 66.66,

    /**
     * Aspect ratio of width to height is 4:3
     */
    FourToThree = 75,

    /**
     * Aspect ratio of width to height is 16:10
     */
    SixteenToTen = 62.5,

    /**
     * Aspect ratio of width to height is 16:9
     */
    SixteenToNine = 56.25,
}