import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import Slider, { Slide } from "./index";

describe("Slider", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("renders children correctly", () => {
      render(
        <Slider>
          <Slider.Slide>
            <span data-testid="slide-1">Logo 1</span>
          </Slider.Slide>
          <Slider.Slide>
            <span data-testid="slide-2">Logo 2</span>
          </Slider.Slide>
        </Slider>
      );

      // Children are duplicated 3 times for infinite scroll
      const slide1Elements = screen.getAllByTestId("slide-1");
      const slide2Elements = screen.getAllByTestId("slide-2");

      expect(slide1Elements).toHaveLength(3);
      expect(slide2Elements).toHaveLength(3);
    });

    it("renders with default props", () => {
      const { container } = render(
        <Slider>
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const sliderElement = container.querySelector('[style*="animation"]');
      expect(sliderElement).toBeTruthy();
      expect(sliderElement?.getAttribute("style")).toContain("40s");
    });

    it("applies custom duration", () => {
      const { container } = render(
        <Slider duration={20}>
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const sliderElement = container.querySelector('[style*="animation"]');
      expect(sliderElement?.getAttribute("style")).toContain("20s");
    });

    it("applies custom width to slides", () => {
      const { container } = render(
        <Slider width="300px">
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      // Each slide should have the custom width applied
      const slides = container.querySelectorAll('[style*="flex-shrink"]');
      expect(slides.length).toBeGreaterThan(0);
      expect((slides[0] as HTMLElement).style.width).toBe("300px");
    });
  });

  describe("animation direction", () => {
    it("animates left by default (toRight=false)", () => {
      const { container } = render(
        <Slider toRight={false}>
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const styleTag = container.querySelector("style");
      expect(styleTag?.textContent).toContain("translateX(0)");
      expect(styleTag?.textContent).toContain("translateX(-");
      // 0% should be at 0, 100% should be negative
      expect(styleTag?.textContent).toMatch(/0%\s*{\s*transform:\s*translateX\(0\)/);
    });

    it("animates right when toRight=true", () => {
      const { container } = render(
        <Slider toRight={true}>
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const styleTag = container.querySelector("style");
      // For toRight: starts at negative (left position) and moves to 0
      expect(styleTag?.textContent).toMatch(/0%\s*{\s*transform:\s*translateX\(-/);
      expect(styleTag?.textContent).toMatch(/100%\s*{\s*transform:\s*translateX\(0\)/);
    });
  });

  describe("pauseOnHover", () => {
    it("does not pause on hover when pauseOnHover=false", () => {
      const { container } = render(
        <Slider pauseOnHover={false}>
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const wrapper = container.querySelector('[style*="overflow: hidden"]');
      const slider = container.querySelector('[style*="animation"]') as HTMLElement;

      fireEvent.mouseEnter(wrapper!);
      expect(slider.style.animationPlayState).not.toBe("paused");
    });

    it("pauses animation on hover when pauseOnHover=true", () => {
      const { container } = render(
        <Slider pauseOnHover={true}>
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const wrapper = container.querySelector('[style*="overflow: hidden"]');
      const slider = container.querySelector('[style*="animation"]') as HTMLElement;

      fireEvent.mouseEnter(wrapper!);
      expect(slider.style.animationPlayState).toBe("paused");
    });

    it("resumes animation on mouse leave", () => {
      const { container } = render(
        <Slider pauseOnHover={true}>
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const wrapper = container.querySelector('[style*="overflow: hidden"]');
      const slider = container.querySelector('[style*="animation"]') as HTMLElement;

      fireEvent.mouseEnter(wrapper!);
      expect(slider.style.animationPlayState).toBe("paused");

      fireEvent.mouseLeave(wrapper!);
      expect(slider.style.animationPlayState).toBe("running");
    });
  });

  describe("blurBorders", () => {
    it("does not render blur overlays by default", () => {
      const { container } = render(
        <Slider>
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const blurOverlays = container.querySelectorAll('[aria-hidden="true"]');
      expect(blurOverlays).toHaveLength(0);
    });

    it("renders blur overlays when blurBorders=true", () => {
      const { container } = render(
        <Slider blurBorders={true}>
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const blurOverlays = container.querySelectorAll('[aria-hidden="true"]');
      expect(blurOverlays).toHaveLength(2);
    });

    it("applies custom blur border color", () => {
      const { container } = render(
        <Slider blurBorders={true} blurBorderColor="#000">
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const blurOverlays = container.querySelectorAll('[aria-hidden="true"]');
      const leftOverlay = blurOverlays[0] as HTMLElement;
      const rightOverlay = blurOverlays[1] as HTMLElement;

      expect(leftOverlay.style.background).toContain("#000");
      expect(rightOverlay.style.background).toContain("#000");
    });

    it("positions blur overlays correctly", () => {
      const { container } = render(
        <Slider blurBorders={true}>
          <Slider.Slide>
            <span>Logo</span>
          </Slider.Slide>
        </Slider>
      );

      const blurOverlays = container.querySelectorAll('[aria-hidden="true"]');
      const leftOverlay = blurOverlays[0] as HTMLElement;
      const rightOverlay = blurOverlays[1] as HTMLElement;

      expect(leftOverlay.style.left).toBe("0px");
      expect(rightOverlay.style.right).toBe("0px");
    });
  });

  describe("multiple sliders", () => {
    it("generates unique animation names for each slider", () => {
      const { container } = render(
        <div>
          <Slider>
            <Slider.Slide>
              <span>Logo 1</span>
            </Slider.Slide>
          </Slider>
          <Slider>
            <Slider.Slide>
              <span>Logo 2</span>
            </Slider.Slide>
          </Slider>
        </div>
      );

      const styleTags = container.querySelectorAll("style");
      expect(styleTags).toHaveLength(2);

      const firstAnimation = styleTags[0].textContent?.match(
        /@keyframes\s+(slider-animation-[^\s{]+)/
      )?.[1];
      const secondAnimation = styleTags[1].textContent?.match(
        /@keyframes\s+(slider-animation-[^\s{]+)/
      )?.[1];

      expect(firstAnimation).toBeTruthy();
      expect(secondAnimation).toBeTruthy();
      expect(firstAnimation).not.toBe(secondAnimation);
    });
  });
});

describe("Slide", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders children", () => {
    render(
      <Slide>
        <span data-testid="content">Content</span>
      </Slide>
    );

    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("applies default width", () => {
    const { container } = render(
      <Slide>
        <span>Content</span>
      </Slide>
    );

    const slide = container.firstChild as HTMLElement;
    expect(slide.style.width).toBe("200px");
  });

  it("applies custom width", () => {
    const { container } = render(
      <Slide width="400px">
        <span>Content</span>
      </Slide>
    );

    const slide = container.firstChild as HTMLElement;
    expect(slide.style.width).toBe("400px");
  });

  it("has proper flex styles", () => {
    const { container } = render(
      <Slide>
        <span>Content</span>
      </Slide>
    );

    const slide = container.firstChild as HTMLElement;
    expect(slide.style.display).toBe("flex");
    expect(slide.style.alignItems).toBe("center");
    expect(slide.style.flexShrink).toBe("0");
  });

  it("passes through additional props", () => {
    const { container } = render(
      <Slide data-testid="custom-slide" className="custom-class">
        <span>Content</span>
      </Slide>
    );

    const slide = screen.getByTestId("custom-slide");
    expect(slide).toHaveClass("custom-class");
  });

  it("can be accessed via Slider.Slide", () => {
    expect(Slider.Slide).toBe(Slide);
  });
});

describe("exports", () => {
  it("exports Slider as default", () => {
    expect(Slider).toBeDefined();
    expect(typeof Slider).toBe("function");
  });

  it("exports Slider as named export", async () => {
    const { Slider: NamedSlider } = await import("./index");
    expect(NamedSlider).toBeDefined();
  });

  it("exports Slide as named export", async () => {
    const { Slide: NamedSlide } = await import("./index");
    expect(NamedSlide).toBeDefined();
  });
});
