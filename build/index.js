import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useId, useRef, useMemo, useCallback } from "react";
const Slider = ({ children: rawChildren, width = "200px", duration = 40, toRight = false, pauseOnHover = false, blurBorders = false, blurBorderColor = "#fff", }) => {
    const uniqueId = useId();
    const sliderRef = useRef(null);
    // Normalize children to always be an array
    const children = useMemo(() => React.Children.toArray(rawChildren), [rawChildren]);
    // Sanitize ID for CSS keyframe name (useId returns colons which aren't valid)
    const animationName = useMemo(() => `slider-animation-${uniqueId.replace(/:/g, "")}`, [uniqueId]);
    // Calculate total width for the animation
    const childCount = children.length;
    const negativeTotalWidth = useMemo(() => `calc(${width} * ${childCount} * -1)`, [width, childCount]);
    // For toRight: start offset left (negative) and animate to 0
    // For toLeft: start at 0 and animate to negative
    const keyframes = useMemo(() => {
        if (toRight) {
            return `
        @keyframes ${animationName} {
          0% { transform: translateX(${negativeTotalWidth}); }
          100% { transform: translateX(0); }
        }
      `;
        }
        return `
      @keyframes ${animationName} {
        0% { transform: translateX(0); }
        100% { transform: translateX(${negativeTotalWidth}); }
      }
    `;
    }, [animationName, negativeTotalWidth, toRight]);
    // Pause/resume handlers using ref
    const handleMouseEnter = useCallback(() => {
        if (sliderRef.current) {
            sliderRef.current.style.animationPlayState = "paused";
        }
    }, []);
    const handleMouseLeave = useCallback(() => {
        if (sliderRef.current) {
            sliderRef.current.style.animationPlayState = "running";
        }
    }, []);
    // Memoize the duplicated children to avoid recreating on every render
    const duplicatedChildren = useMemo(() => {
        const renderChildren = (keyPrefix) => children.map((child, i) => (_jsx(React.Fragment, { children: React.cloneElement(child, { width }) }, `${keyPrefix}-${i}`)));
        // Render 3 copies for seamless infinite loop
        return (_jsxs(_Fragment, { children: [renderChildren("a"), renderChildren("b"), renderChildren("c")] }));
    }, [children, width]);
    const wrapperStyle = {
        width: "100%",
        height: "auto",
        margin: "auto",
        overflow: "hidden",
        position: "relative",
    };
    const sliderStyle = {
        display: "flex",
        width: `calc(${width} * ${childCount * 3})`,
        animation: `${animationName} ${duration}s linear infinite`,
    };
    const blurOverlayBaseStyle = {
        position: "absolute",
        top: 0,
        width: "180px",
        height: "100%",
        zIndex: 10,
        pointerEvents: "none",
    };
    const leftBlurStyle = {
        ...blurOverlayBaseStyle,
        left: 0,
        background: `linear-gradient(90deg, ${blurBorderColor} 10%, rgba(255, 255, 255, 0) 80%)`,
    };
    const rightBlurStyle = {
        ...blurOverlayBaseStyle,
        right: 0,
        background: `linear-gradient(270deg, ${blurBorderColor} 10%, rgba(255, 255, 255, 0) 80%)`,
    };
    return (_jsxs("div", { style: { position: "relative" }, children: [_jsx("style", { children: keyframes }), _jsx("div", { style: wrapperStyle, onMouseEnter: pauseOnHover ? handleMouseEnter : undefined, onMouseLeave: pauseOnHover ? handleMouseLeave : undefined, children: _jsx("div", { ref: sliderRef, style: sliderStyle, children: duplicatedChildren }) }), blurBorders && (_jsxs(_Fragment, { children: [_jsx("div", { style: leftBlurStyle, "aria-hidden": "true" }), _jsx("div", { style: rightBlurStyle, "aria-hidden": "true" })] }))] }));
};
const Slide = ({ children, width = "200px", ...props }) => {
    const slideStyle = {
        width,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
    };
    return (_jsx("div", { style: slideStyle, ...props, children: children }));
};
Slider.Slide = Slide;
export default Slider;
export { Slider, Slide };
