import React from "react";
export interface SliderProps {
    /** Slider.Slide elements */
    children: React.ReactNode;
    /** Width of each slide (CSS value) */
    width?: string;
    /** Animation duration in seconds */
    duration?: number;
    /** Scroll direction - true for right, false for left */
    toRight?: boolean;
    /** Pause animation on hover */
    pauseOnHover?: boolean;
    /** Add blur gradient effects on borders */
    blurBorders?: boolean;
    /** Color for blur border gradient */
    blurBorderColor?: string;
}
export interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Content to display in the slide */
    children: React.ReactNode;
    /** Width of the slide (CSS value) */
    width?: string;
}
interface SliderComponent extends React.FC<SliderProps> {
    Slide: React.FC<SlideProps>;
}
declare const Slider: SliderComponent;
declare const Slide: React.FC<SlideProps>;
export default Slider;
export { Slider, Slide };
