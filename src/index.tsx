import React, { useId, useRef, useMemo, useCallback, CSSProperties } from "react";

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

const Slider: SliderComponent = ({
  children: rawChildren,
  width = "200px",
  duration = 40,
  toRight = false,
  pauseOnHover = false,
  blurBorders = false,
  blurBorderColor = "#fff",
}) => {
  const uniqueId = useId();
  const sliderRef = useRef<HTMLDivElement>(null);

  // Normalize children to always be an array
  const children = useMemo(
    () => React.Children.toArray(rawChildren) as React.ReactElement[],
    [rawChildren]
  );

  // Sanitize ID for CSS keyframe name (useId returns colons which aren't valid)
  const animationName = useMemo(
    () => `slider-animation-${uniqueId.replace(/:/g, "")}`,
    [uniqueId]
  );

  // Calculate total width for the animation
  const childCount = children.length;
  const negativeTotalWidth = useMemo(
    () => `calc(${width} * ${childCount} * -1)`,
    [width, childCount]
  );

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
    const renderChildren = (keyPrefix: string) =>
      children.map((child, i) => (
        <React.Fragment key={`${keyPrefix}-${i}`}>
          {React.cloneElement(child, { width })}
        </React.Fragment>
      ));

    // Render 3 copies for seamless infinite loop
    return (
      <>
        {renderChildren("a")}
        {renderChildren("b")}
        {renderChildren("c")}
      </>
    );
  }, [children, width]);

  const wrapperStyle: CSSProperties = {
    width: "100%",
    height: "auto",
    margin: "auto",
    overflow: "hidden",
    position: "relative",
  };

  const sliderStyle: CSSProperties = {
    display: "flex",
    width: `calc(${width} * ${childCount * 3})`,
    animation: `${animationName} ${duration}s linear infinite`,
  };

  const blurOverlayBaseStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    width: "180px",
    height: "100%",
    zIndex: 10,
    pointerEvents: "none",
  };

  const leftBlurStyle: CSSProperties = {
    ...blurOverlayBaseStyle,
    left: 0,
    background: `linear-gradient(90deg, ${blurBorderColor} 10%, rgba(255, 255, 255, 0) 80%)`,
  };

  const rightBlurStyle: CSSProperties = {
    ...blurOverlayBaseStyle,
    right: 0,
    background: `linear-gradient(270deg, ${blurBorderColor} 10%, rgba(255, 255, 255, 0) 80%)`,
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Inject keyframes via style tag */}
      <style>{keyframes}</style>

      <div
        style={wrapperStyle}
        onMouseEnter={pauseOnHover ? handleMouseEnter : undefined}
        onMouseLeave={pauseOnHover ? handleMouseLeave : undefined}
      >
        <div ref={sliderRef} style={sliderStyle}>
          {duplicatedChildren}
        </div>
      </div>

      {blurBorders && (
        <>
          <div style={leftBlurStyle} aria-hidden="true" />
          <div style={rightBlurStyle} aria-hidden="true" />
        </>
      )}
    </div>
  );
};

const Slide: React.FC<SlideProps> = ({
  children,
  width = "200px",
  ...props
}) => {
  const slideStyle: CSSProperties = {
    width,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  };

  return (
    <div style={slideStyle} {...props}>
      {children}
    </div>
  );
};

Slider.Slide = Slide;

export default Slider;
export { Slider, Slide };
