import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { resize } from "@motionone/dom";
import { addPropertyControls, ControlType, RenderTarget } from "framer";
import {
  animate,
  LayoutGroup,
  mix,
  motion,
  frame,
  useInView,
  useMotionValue,
  useTransform,
  wrap,
  usePageInView,
} from "framer-motion";
import {
  Children,
  cloneElement,
  forwardRef,
  memo,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
function awaitRefCallback(element, controller) {
  let refCallbackResolve; // we need to listen to the ref setter, so let's override `current` - we can do that, because we don't use React's `useRef` hook for those refs.
  let current = element.current;
  Object.defineProperty(element, "current", {
    get() {
      return current;
    },
    set(node) {
      current = node;
      if (node === null) {
        // React calls with null when the element is unmounted
        // we abort here so that the promise isn't left around in case the ref is never set
        controller.abort();
        return;
      }
      refCallbackResolve?.(node);
    },
    configurable: true,
  }); // no need to create a promise if current already exists
  if (current) return current;
  const refCallbackPromise = new Promise((resolve, reject) => {
    refCallbackResolve = resolve;
    controller.signal.addEventListener("abort", reject);
  }).catch(() => {});
  return refCallbackPromise;
} // Using opacity: 0.001 instead of 0 as an LCP hack. (opacity: 0.001 is still 0
// to a human eye but makes Google think the elements are visible)
const OPACITY_0 = 0.001;
/**
 *
 * SLIDESHOW
 * V2 with Drag
 * By Benjamin and Matt
 *
 * @framerIntrinsicWidth 400
 * @framerIntrinsicHeight 200
 *
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */ export default function Slideshow(props) {
  /**
   * Properties
   */ const {
    slots = [],
    startFrom,
    direction,
    effectsOptions,
    autoPlayControl,
    dragControl,
    alignment,
    gap,
    padding,
    paddingPerSide,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    itemAmount,
    fadeOptions,
    intervalControl,
    transitionControl,
    arrowOptions,
    borderRadius,
    progressOptions,
    style,
  } = props;
  const {
    effectsOpacity,
    effectsScale,
    effectsRotate,
    effectsPerspective,
    effectsHover,
    playOffscreen,
  } = effectsOptions;
  const { fadeContent, overflow, fadeWidth, fadeInset, fadeAlpha } =
    fadeOptions;
  const {
    showMouseControls,
    arrowSize,
    arrowRadius,
    arrowFill,
    leftArrow,
    rightArrow,
    arrowShouldSpace = true,
    arrowShouldFadeIn = false,
    arrowPosition,
    arrowPadding,
    arrowGap,
    arrowPaddingTop,
    arrowPaddingRight,
    arrowPaddingBottom,
    arrowPaddingLeft,
  } = arrowOptions;
  const {
    showProgressDots,
    dotSize,
    dotsInset,
    dotsRadius,
    dotsPadding,
    dotsGap,
    dotsFill,
    dotsBackground,
    dotsActiveOpacity,
    dotsOpacity,
    dotsBlur,
  } = progressOptions;
  const paddingValue = paddingPerSide
    ? `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`
    : `${padding}px`;
  /**
   * Checks
   */ const isCanvas = RenderTarget.current() === RenderTarget.canvas; // Remove empty slots (such as hidden layers)
  const filteredSlots = slots.filter(Boolean);
  const amountChildren = Children.count(filteredSlots);
  const hasChildren = amountChildren > 0;
  /**
   * Empty state for Canvas
   */ if (!hasChildren) {
    return /*#__PURE__*/ _jsxs("section", {
      style: placeholderStyles,
      children: [
        /*#__PURE__*/ _jsx("div", { style: emojiStyles, children: "⭐️" }),
        /*#__PURE__*/ _jsx("p", {
          style: titleStyles,
          children: "Connect to Content",
        }),
        /*#__PURE__*/ _jsx("p", {
          style: subtitleStyles,
          children:
            "Add layers or components to make infinite auto-playing slideshows.",
        }),
      ],
    });
  }
  /**
   * Refs, State
   */ const parentRef = useRef(null);
  const childrenRef = useMemo(() => {
    return [{ current: null }, { current: null }]; // when the slots change, generate new array
  }, [filteredSlots]);
  const timeoutRef = useRef(undefined);
  const [size, setSize] = useState({
    parent: null,
    children: null,
    item: null,
    itemWidth: null,
    itemHeight: null,
    viewportLength: null,
  });
  const writingDirection = useWritingDirection();
  const resolvedDirection = getSlideshowResolvedDirection(
    direction,
    writingDirection
  );
  const isHorizontal =
    resolvedDirection === "left" || resolvedDirection === "right";
  const isInverted =
    resolvedDirection === "right" || resolvedDirection === "bottom";
  const rtlDirectionModifier =
    isHorizontal && writingDirection === "rtl" ? -1 : 1;
  /* For pausing on hover */ const [isHovering, setIsHovering] =
    useState(false);
  const [shouldPlayOnHover, setShouldPlayOnHover] = useState(autoPlayControl);
  /* For cursor updates */ const [isMouseDown, setIsMouseDown] =
    useState(false);
  /* Check if resizing */ const [isResizing, setIsResizing] = useState(false);
  /**
   * Array for children
   */ let dupedChildren = [];
  let duplicateBy = 4;
  if (isCanvas) {
    duplicateBy = 1;
  }
  /**
   * Measure parent, child, items
   */ const measure = useCallback(() => {
    if (!parentRef.current) return; // Might be RTL but executing before writingDirection is set so derive from positions of elements
    const isRTL =
      isHorizontal &&
      childrenRef[0].current &&
      childrenRef[1].current &&
      childrenRef[1].current.offsetLeft < childrenRef[0].current.offsetLeft;
    const firstChild = isRTL ? childrenRef[1].current : childrenRef[0].current;
    const lastChild = isRTL ? childrenRef[0].current : childrenRef[1].current;
    const parentLength = isHorizontal
      ? parentRef.current.offsetWidth
      : parentRef.current.offsetHeight;
    const start = firstChild
      ? isHorizontal
        ? firstChild.offsetLeft
        : firstChild.offsetTop
      : 0;
    const end = lastChild
      ? isHorizontal
        ? lastChild.offsetLeft + lastChild.offsetWidth
        : lastChild.offsetTop + lastChild.offsetHeight
      : 0;
    const childrenLength = end - start + gap;
    const itemSize = firstChild
      ? isHorizontal
        ? firstChild.offsetWidth
        : firstChild.offsetHeight
      : 0;
    const itemWidth = firstChild ? firstChild.offsetWidth : 0;
    const itemHeight = firstChild ? firstChild.offsetHeight : 0;
    const viewportLength = isHorizontal
      ? Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0,
          parentRef.current.offsetWidth
        )
      : Math.max(
          document.documentElement.clientHeight || 0,
          window.innerHeight || 0,
          parentRef.current.offsetHeight
        );
    setSize({
      parent: parentLength,
      children: childrenLength,
      item: itemSize,
      itemWidth,
      itemHeight,
      viewportLength,
    });
  }, []);
  const scheduleMeasure = useCallback(async () => {
    const controller = new AbortController();
    /**
     * The elements in the set are refs of children. If they're wrapped in Suspense, they could mount later than the parent.
     * Thus, we wait for each ref to be set step by step if required.
     */ const [firstChild, lastChild] = childrenRef;
    if (!isCanvas && (!firstChild.current || !lastChild.current))
      try {
        await Promise.all([
          awaitRefCallback(firstChild, controller),
          amountChildren > 1 ? awaitRefCallback(lastChild, controller) : true,
        ]);
      } catch {
        controller.abort();
      }
    frame.read(measure, false, true);
  }, [measure]);
  /**
   * Add refs to all children
   * Added itemAmount for resizing
   */ useLayoutEffect(() => {
    scheduleMeasure();
  }, [itemAmount]);
  /**
   * Track whether this is the initial resize event. By default this will fire on mount,
   * which we do in the useEffect. We should only fire it on subsequent resizes.
   */ const initialResize = useRef(true);
  useEffect(() => {
    return resize(parentRef.current, ({ contentSize }) => {
      if (!initialResize.current && (contentSize.width || contentSize.height)) {
        scheduleMeasure();
        startTransition(() => setIsResizing(true));
      }
      initialResize.current = false;
    });
  }, []);
  useEffect(() => {
    if (isResizing) {
      const timer = setTimeout(
        () => startTransition(() => setIsResizing(false)),
        500
      );
      return () => clearTimeout(timer);
    }
  }, [isResizing]);
  /**
   * Animation, pagination
   */ const totalItems = filteredSlots?.length;
  const childrenSize = isCanvas ? 0 : size?.children;
  const itemWithGap = size?.item + gap;
  const itemOffset = startFrom * itemWithGap;
  const [currentItem, setCurrentItem] = useState(startFrom + totalItems);
  const [isDragging, setIsDragging] = useState(false);
  if (isCanvas) {
    if (currentItem !== startFrom) {
      setCurrentItem(startFrom);
    }
  }
  /* Check for browser window visibility */ /* Otherwise, it will re-play all the item increments */ const visibilityRef =
    useRef(null);
  const isInView = useInView(visibilityRef);
  const isVisible = usePageInView() && isInView;
  const factor = isInverted ? 1 : -1;
  /* The x and y values to start from */ const xOrY =
    useMotionValue(childrenSize);
  /* For canvas only. Using xOrY is slower upon page switching */ const canvasPosition =
    isHorizontal
      ? -startFrom * (size?.itemWidth + gap)
      : -startFrom * (size?.itemHeight + gap);
  /* Calculate the new value to animate to */ const newPosition = () =>
    factor * currentItem * itemWithGap;
  /* Wrapped values for infinite looping */ /* Instead of 0 to a negative full duplicated row, we start with an offset */ const wrappedValue =
    !isCanvas
      ? useTransform(xOrY, (value) => {
          const wrapped = wrap(
            -childrenSize * rtlDirectionModifier,
            -childrenSize * rtlDirectionModifier * 2,
            value * rtlDirectionModifier
          );
          return isNaN(wrapped) ? 0 : wrapped;
        })
      : 0;
  /* Convert the current item to a wrapping index for dots */ const wrappedIndex =
    wrap(0, totalItems, currentItem);
  const wrappedIndexInverted = wrap(0, -totalItems, currentItem);
  /* Update x or y with the provided starting point */ /* The subtraction of a full row of children is for overflow */ useLayoutEffect(() => {
    if (size?.children === null) return; /* Initial measure */ // if (initialResize.current) {
    //     xOrY.set((childrenSize + itemOffset) * factor)
    // }
    /* Subsequent resizes */ if (!initialResize.current && isResizing) {
      xOrY.set(newPosition());
    }
  }, [
    size,
    childrenSize,
    factor,
    itemOffset,
    currentItem,
    itemWithGap,
    isResizing,
  ]);
  /**
   * Page item methods
   * Switching, deltas, autoplaying
   */ /* Next and previous function, animates the X */ const switchPages =
    () => {
      if (isCanvas || !hasChildren || !size.parent || isDragging) return;
      if (xOrY.get() !== newPosition()) {
        animate(xOrY, newPosition(), transitionControl);
      }
      if (
        autoPlayControl &&
        shouldPlayOnHover &&
        (playOffscreen || isVisible)
      ) {
        timeoutRef.current = setTimeout(() => {
          startTransition(() =>
            setCurrentItem((item) => item + 1 * rtlDirectionModifier)
          );
          switchPages();
        }, intervalControl * 1e3);
      }
    };
  /* Page navigation functions */ const setDelta = (
    delta,
    transition = false
  ) => {
    if (!isInverted) {
      if (transition)
        startTransition(() => setCurrentItem((item) => item + delta));
      else setCurrentItem((item) => item + delta);
    } else {
      if (transition)
        startTransition(() => setCurrentItem((item) => item - delta));
      else setCurrentItem((item) => item - delta);
    }
  };
  const setPage = (index) => {
    const currentItemWrapped = wrap(0, totalItems, currentItem);
    const currentItemWrappedInvert = wrap(0, -totalItems, currentItem);
    const goto = index - currentItemWrapped;
    const gotoInverted = index - Math.abs(currentItemWrappedInvert);
    if (!isInverted) {
      startTransition(() => setCurrentItem((item) => item + goto));
    } else {
      startTransition(() => setCurrentItem((item) => item - gotoInverted));
    }
  };
  /**
   * Drag
   */ const handleDragStart = () => {
    startTransition(() => setIsDragging(true));
  };
  const handleDragEnd = (event, { offset, velocity }) => {
    startTransition(() => setIsDragging(false));
    const offsetXorY = isHorizontal ? offset.x : offset.y;
    const velocityThreshold = 200; // Based on testing, can be tweaked or could be 0
    const velocityXorY = isHorizontal ? velocity.x : velocity.y;
    const isHalfOfNext = offsetXorY < -size.item / 2;
    const isHalfOfPrev = offsetXorY > size.item / 2;
    /* In case you drag more than 1 item left or right */ const normalizedOffset =
      Math.abs(offsetXorY);
    const itemDelta = Math.round(normalizedOffset / size.item);
    /* Minimum delta is 1 to initiate a page switch */ /* For velocity use only */ const itemDeltaFromOne =
      itemDelta === 0 ? 1 : itemDelta;
    /* For quick flicks, even with low offsets */ if (
      velocityXorY > velocityThreshold
    ) {
      setDelta(-itemDeltaFromOne * rtlDirectionModifier, true);
    } else if (velocityXorY < -velocityThreshold) {
      setDelta(itemDeltaFromOne * rtlDirectionModifier, true);
    } else {
      /* For dragging over half of the current item with 0 velocity */ if (
        isHalfOfNext
      ) {
        setDelta(itemDelta * rtlDirectionModifier, true);
      }
      if (isHalfOfPrev) {
        setDelta(-itemDelta * rtlDirectionModifier, true);
      }
    }
  };
  /* Kickstart the auto-playing once we have all the children */ useEffect(() => {
    if (!isVisible || isResizing || amountChildren <= 1) return;
    switchPages();
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [dupedChildren, isVisible, isResizing]);
  /* Create copies of our children to create a perfect loop */ let childCounter = 0;
  /**
   * Sizing
   * */ const columnOrRowValue = `calc(${100 / itemAmount}% - ${gap}px + ${
    gap / itemAmount
  }px)`;
  /**
   * Nested array to create duplicates of the children for infinite looping
   * These are wrapped around, and start at a full "page" worth of offset
   * as defined above.
   */ for (let index = 0; index < duplicateBy; index++) {
    dupedChildren = dupedChildren.concat(
      Children.map(filteredSlots, (child, childIndex) => {
        let ref;
        if (index === 0) {
          if (childIndex === 0) {
            ref = childrenRef[0];
          } else if (childIndex === filteredSlots.length - 1) {
            ref = childrenRef[1];
          }
        }
        return /*#__PURE__*/ _jsx(
          Slide,
          {
            ref: ref,
            slideKey: index + childIndex + "lg",
            index: index,
            width: isHorizontal
              ? itemAmount > 1
                ? columnOrRowValue
                : "100%"
              : "100%",
            height: !isHorizontal
              ? itemAmount > 1
                ? columnOrRowValue
                : "100%"
              : "100%",
            size: size,
            child: child,
            numChildren: filteredSlots?.length,
            wrappedValue: wrappedValue,
            childCounter: childCounter++,
            gap: gap,
            isCanvas: isCanvas,
            isHorizontal: isHorizontal,
            effectsOpacity: effectsOpacity,
            effectsScale: effectsScale,
            effectsRotate: effectsRotate,
            directionModifier: rtlDirectionModifier,
            children: index + childIndex,
          },
          index + childIndex + "lg"
        );
      })
    );
  }
  /**
   * Fades with masks
   */ const fadeDirection = isHorizontal ? "to right" : "to bottom";
  const fadeWidthStart = fadeWidth / 2;
  const fadeWidthEnd = 100 - fadeWidth / 2;
  const fadeInsetStart = clamp(fadeInset, 0, fadeWidthStart);
  const fadeInsetEnd = 100 - fadeInset;
  const fadeMask = `linear-gradient(${fadeDirection}, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetStart}%, rgba(0, 0, 0, 1) ${fadeWidthStart}%, rgba(0, 0, 0, 1) ${fadeWidthEnd}%, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetEnd}%)`;
  /**
   * Dots
   */ const dots = [];
  const dotsBlurStyle = {};
  if (showProgressDots) {
    for (let i = 0; i < filteredSlots?.length; i++) {
      dots.push(
        /*#__PURE__*/ _jsx(
          Dot,
          {
            dotStyle: {
              ...dotStyle,
              width: dotSize,
              height: dotSize,
              backgroundColor: dotsFill,
            },
            buttonStyle: baseButtonStyles,
            selectedOpacity: dotsActiveOpacity,
            opacity: dotsOpacity,
            onClick: () => setPage(i),
            wrappedIndex: wrappedIndex,
            wrappedIndexInverted: wrappedIndexInverted,
            total: totalItems,
            index: i,
            gap: dotsGap,
            padding: dotsPadding,
            isHorizontal: isHorizontal,
            isInverted: isInverted,
          },
          i
        )
      );
    }
    if (dotsBlur > 0) {
      dotsBlurStyle.backdropFilter =
        dotsBlurStyle.WebkitBackdropFilter = `blur(${dotsBlur}px)`;
    }
  }
  const dragProps = dragControl
    ? {
        drag: isHorizontal ? "x" : "y",
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        dragDirectionLock: true,
        values: { x: writingDirection === "rtl" ? -xOrY : xOrY, y: xOrY },
        dragMomentum: false,
      }
    : {};
  const arrowHasTop =
    arrowPosition === "top-left" ||
    arrowPosition === "top-mid" ||
    arrowPosition === "top-right";
  const arrowHasBottom =
    arrowPosition === "bottom-left" ||
    arrowPosition === "bottom-mid" ||
    arrowPosition === "bottom-right";
  const arrowHasLeft =
    arrowPosition === "top-left" || arrowPosition === "bottom-left";
  const arrowHasRight =
    arrowPosition === "top-right" || arrowPosition === "bottom-right";
  const arrowHasMid =
    arrowPosition === "top-mid" ||
    arrowPosition === "bottom-mid" ||
    arrowPosition === "auto";
  const leftArrowSrc =
    leftArrow ||
    "https://framerusercontent.com/images/6tTbkXggWgQCAJ4DO2QEdXXmgM.svg?arrow=left";
  const rightArrowSrc =
    rightArrow ||
    "https://framerusercontent.com/images/11KSGbIZoRSg4pjdnUoif6MKHI.svg?arrow=right";
  return /*#__PURE__*/ _jsxs("section", {
    style: {
      ...containerStyle,
      padding: paddingValue,
      WebkitMaskImage: fadeContent ? fadeMask : undefined,
      maskImage: fadeContent ? fadeMask : undefined,
      opacity: size?.item !== null ? 1 : OPACITY_0,
      userSelect: "none",
    },
    onMouseEnter: () => {
      setIsHovering(true);
      if (!effectsHover) setShouldPlayOnHover(false);
    },
    onMouseLeave: () => {
      setIsHovering(false);
      if (!effectsHover) setShouldPlayOnHover(true);
    },
    onMouseDown: (event) => {
      // Preventdefault fixes the cursor switching to text on drag on safari
      event.preventDefault();
      startTransition(() => setIsMouseDown(true));
    },
    onMouseUp: () => startTransition(() => setIsMouseDown(false)),
    ref: visibilityRef,
    children: [
      /*#__PURE__*/ _jsx("div", {
        style: {
          width: "100%",
          height: "100%",
          margin: 0,
          padding: "inherit",
          position: "absolute",
          inset: 0,
          overflow: overflow ? "visible" : "hidden",
          borderRadius: borderRadius,
          userSelect: "none",
          perspective: isCanvas ? "none" : effectsPerspective,
        },
        children: /*#__PURE__*/ _jsx(motion.ul, {
          ref: parentRef,
          ...dragProps,
          style: {
            ...containerStyle,
            gap: gap,
            placeItems: alignment,
            x: isHorizontal ? (isCanvas ? canvasPosition : wrappedValue) : 0,
            y: !isHorizontal ? (isCanvas ? canvasPosition : wrappedValue) : 0,
            flexDirection: isHorizontal ? "row" : "column",
            transformStyle:
              effectsRotate !== 0 && !isCanvas ? "preserve-3d" : undefined,
            cursor: dragControl ? (isMouseDown ? "grabbing" : "grab") : "auto",
            userSelect: "none",
            ...style,
          },
          children: dupedChildren,
        }),
      }),
      /*#__PURE__*/ _jsxs("fieldset", {
        style: { ...controlsStyles },
        "aria-label": "Slideshow pagination controls",
        className: "framer--slideshow-controls",
        children: [
          /*#__PURE__*/ _jsxs(motion.div, {
            style: {
              position: "absolute",
              display: "flex",
              flexDirection: isHorizontal ? "row" : "column",
              justifyContent: arrowShouldSpace ? "space-between" : "center",
              gap: arrowShouldSpace ? "unset" : arrowGap,
              opacity: arrowShouldFadeIn ? OPACITY_0 : 1,
              alignItems: "center",
              inset: arrowPadding,
              top: arrowShouldSpace
                ? arrowPadding
                : arrowHasTop
                ? arrowPaddingTop
                : "unset",
              left: arrowShouldSpace
                ? arrowPadding
                : arrowHasLeft
                ? arrowPaddingLeft
                : arrowHasMid
                ? 0
                : "unset",
              right: arrowShouldSpace
                ? arrowPadding
                : arrowHasRight
                ? arrowPaddingRight
                : arrowHasMid
                ? 0
                : "unset",
              bottom: arrowShouldSpace
                ? arrowPadding
                : arrowHasBottom
                ? arrowPaddingBottom
                : "unset",
            },
            animate: arrowShouldFadeIn && {
              opacity: isHovering ? 1 : OPACITY_0,
            },
            transition: transitionControl,
            children: [
              /*#__PURE__*/ _jsx(motion.button, {
                type: "button",
                style: {
                  ...baseButtonStyles,
                  backgroundColor: arrowFill,
                  width: arrowSize,
                  height: arrowSize,
                  borderRadius: arrowRadius,
                  rotate: !isHorizontal ? 90 : 0,
                  display: showMouseControls ? "block" : "none",
                  pointerEvents: "auto",
                },
                onClick: () => setDelta(-1, true),
                "aria-label": "Previous",
                whileTap: { scale: 0.9 },
                transition: { duration: 0.15 },
                children: /*#__PURE__*/ _jsx("img", {
                  decoding: "async",
                  width: arrowSize,
                  height: arrowSize,
                  src:
                    isHorizontal && writingDirection === "rtl"
                      ? rightArrowSrc
                      : leftArrowSrc,
                  alt: "Back Arrow",
                }),
              }),
              /*#__PURE__*/ _jsx(motion.button, {
                type: "button",
                style: {
                  ...baseButtonStyles,
                  backgroundColor: arrowFill,
                  width: arrowSize,
                  height: arrowSize,
                  borderRadius: arrowRadius,
                  rotate: !isHorizontal ? 90 : 0,
                  display: showMouseControls ? "block" : "none",
                  pointerEvents: "auto",
                },
                onClick: () => setDelta(1, true),
                "aria-label": "Next",
                whileTap: { scale: 0.9 },
                transition: { duration: 0.15 },
                children: /*#__PURE__*/ _jsx("img", {
                  decoding: "async",
                  width: arrowSize,
                  height: arrowSize,
                  src:
                    isHorizontal && writingDirection === "rtl"
                      ? leftArrowSrc
                      : rightArrowSrc,
                  alt: "Next Arrow",
                }),
              }),
            ],
          }),
          dots.length > 1
            ? /*#__PURE__*/ _jsx("div", {
                style: {
                  ...dotsContainerStyle,
                  left: isHorizontal ? "50%" : dotsInset,
                  top: !isHorizontal ? "50%" : "unset",
                  transform: isHorizontal
                    ? "translateX(-50%)"
                    : "translateY(-50%)",
                  flexDirection: isHorizontal ? "row" : "column",
                  bottom: isHorizontal ? dotsInset : "unset",
                  borderRadius: dotsRadius,
                  backgroundColor: dotsBackground,
                  userSelect: "none",
                  ...dotsBlurStyle,
                },
                children: dots,
              })
            : null,
        ],
      }),
    ],
  });
}
/* Default Properties */ Slideshow.defaultProps = {
  direction: "left",
  dragControl: false,
  startFrom: 0,
  itemAmount: 1,
  infinity: true,
  gap: 10,
  padding: 10,
  autoPlayControl: true,
  effectsOptions: {
    effectsOpacity: 1,
    effectsScale: 1,
    effectsRotate: 0,
    effectsPerspective: 1200,
    effectsHover: true,
    playOffscreen: false,
  },
  transitionControl: { type: "spring", stiffness: 200, damping: 40 },
  fadeOptions: {
    fadeContent: false,
    overflow: false,
    fadeWidth: 25,
    fadeAlpha: 0,
    fadeInset: 0,
  },
  arrowOptions: {
    showMouseControls: true,
    arrowShouldFadeIn: false,
    arrowShouldSpace: true,
    arrowFill: "rgba(0,0,0,0.2)",
    arrowSize: 40,
  },
  progressOptions: { showProgressDots: true },
};
/* Property Controls */ addPropertyControls(Slideshow, {
  slots: {
    type: ControlType.Array,
    title: "Content",
    control: { type: ControlType.ComponentInstance },
  },
  direction: {
    type: ControlType.Enum,
    title: "Direction",
    options: ["left", "right", "top", "bottom"],
    optionIcons: [
      "direction-left",
      "direction-right",
      "direction-up",
      "direction-down",
    ],
    optionTitles: ["Left", "Right", "Top", "Bottom"],
    displaySegmentedControl: true,
    defaultValue: Slideshow.defaultProps.direction,
  },
  autoPlayControl: {
    type: ControlType.Boolean,
    title: "Auto Play",
    defaultValue: true,
  },
  intervalControl: {
    type: ControlType.Number,
    title: "Interval",
    defaultValue: 1.5,
    min: 0.5,
    max: 10,
    step: 0.1,
    displayStepper: true,
    unit: "s",
    hidden: (props) => !props.autoPlayControl,
  },
  dragControl: {
    type: ControlType.Boolean,
    title: "Draggable",
    defaultValue: false,
  },
  startFrom: {
    type: ControlType.Number,
    title: "Current",
    min: 0,
    max: 10,
    displayStepper: true,
    defaultValue: Slideshow.defaultProps.startFrom,
  },
  effectsOptions: {
    type: ControlType.Object,
    title: "Effects",
    controls: {
      effectsOpacity: {
        type: ControlType.Number,
        title: "Opacity",
        defaultValue: Slideshow.defaultProps.effectsOptions.effectsOpacity,
        min: 0,
        max: 1,
        step: 0.01,
        displayStepper: true,
      },
      effectsScale: {
        type: ControlType.Number,
        title: "Scale",
        defaultValue: Slideshow.defaultProps.effectsOptions.effectsScale,
        min: 0,
        max: 1,
        step: 0.01,
        displayStepper: true,
      },
      effectsPerspective: {
        type: ControlType.Number,
        title: "Perspective",
        defaultValue: Slideshow.defaultProps.effectsOptions.effectsPerspective,
        min: 200,
        max: 2e3,
        step: 1,
      },
      effectsRotate: {
        type: ControlType.Number,
        title: "Rotate",
        defaultValue: Slideshow.defaultProps.effectsOptions.effectsRotate,
        min: -180,
        max: 180,
        step: 1,
      },
      effectsHover: {
        type: ControlType.Boolean,
        title: "On Hover",
        enabledTitle: "Play",
        disabledTitle: "Pause",
        defaultValue: Slideshow.defaultProps.effectsOptions.effectsHover,
      },
      playOffscreen: {
        type: ControlType.Boolean,
        title: "Offscreen",
        enabledTitle: "Play",
        disabledTitle: "Pause",
        defaultValue: Slideshow.defaultProps.effectsOptions.playOffscreen,
      },
    },
  },
  alignment: {
    type: ControlType.Enum,
    title: "Align",
    options: ["flex-start", "center", "flex-end"],
    optionIcons: {
      direction: {
        right: ["align-top", "align-middle", "align-bottom"],
        left: ["align-top", "align-middle", "align-bottom"],
        top: ["align-left", "align-center", "align-right"],
        bottom: ["align-left", "align-center", "align-right"],
      },
    },
    defaultValue: "center",
    displaySegmentedControl: true,
  },
  itemAmount: {
    type: ControlType.Number,
    title: "Items",
    min: 1,
    max: 10,
    displayStepper: true,
    defaultValue: Slideshow.defaultProps.itemAmount,
  },
  gap: { type: ControlType.Number, title: "Gap", min: 0 },
  padding: {
    title: "Padding",
    type: ControlType.FusedNumber,
    toggleKey: "paddingPerSide",
    toggleTitles: ["Padding", "Padding per side"],
    defaultValue: 0,
    valueKeys: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    valueLabels: ["T", "R", "B", "L"],
    min: 0,
  },
  borderRadius: {
    type: ControlType.Number,
    title: "Radius",
    min: 0,
    max: 500,
    displayStepper: true,
    defaultValue: 0,
  },
  transitionControl: {
    type: ControlType.Transition,
    defaultValue: Slideshow.defaultProps.transitionControl,
    title: "Transition",
  },
  fadeOptions: {
    type: ControlType.Object,
    title: "Clipping",
    controls: {
      fadeContent: {
        type: ControlType.Boolean,
        title: "Fade",
        defaultValue: false,
      },
      overflow: {
        type: ControlType.Boolean,
        title: "Overflow",
        enabledTitle: "Show",
        disabledTitle: "Hide",
        defaultValue: false,
        hidden(props) {
          return props.fadeContent === true;
        },
      },
      fadeWidth: {
        type: ControlType.Number,
        title: "Width",
        defaultValue: 25,
        min: 0,
        max: 100,
        unit: "%",
        hidden(props) {
          return props.fadeContent === false;
        },
      },
      fadeInset: {
        type: ControlType.Number,
        title: "Inset",
        defaultValue: 0,
        min: 0,
        max: 100,
        unit: "%",
        hidden(props) {
          return props.fadeContent === false;
        },
      },
      fadeAlpha: {
        type: ControlType.Number,
        title: "Opacity",
        defaultValue: 0,
        min: 0,
        max: 1,
        step: 0.05,
        hidden(props) {
          return props.fadeContent === false;
        },
      },
    },
  },
  arrowOptions: {
    type: ControlType.Object,
    title: "Arrows",
    controls: {
      showMouseControls: {
        type: ControlType.Boolean,
        title: "Show",
        defaultValue: Slideshow.defaultProps.arrowOptions.showMouseControls,
      },
      arrowFill: {
        type: ControlType.Color,
        title: "Fill",
        hidden: (props) => !props.showMouseControls,
        defaultValue: Slideshow.defaultProps.arrowOptions.arrowFill,
      },
      leftArrow: {
        type: ControlType.Image,
        title: "Previous",
        hidden: (props) => !props.showMouseControls,
      },
      rightArrow: {
        type: ControlType.Image,
        title: "Next",
        hidden: (props) => !props.showMouseControls,
      },
      arrowSize: {
        type: ControlType.Number,
        title: "Size",
        min: 0,
        max: 200,
        displayStepper: true,
        defaultValue: Slideshow.defaultProps.arrowOptions.arrowSize,
        hidden: (props) => !props.showMouseControls,
      },
      arrowRadius: {
        type: ControlType.Number,
        title: "Radius",
        min: 0,
        max: 500,
        defaultValue: 40,
        hidden: (props) => !props.showMouseControls,
      },
      arrowShouldFadeIn: {
        type: ControlType.Boolean,
        title: "Fade In",
        defaultValue: false,
        hidden: (props) => !props.showMouseControls,
      },
      arrowShouldSpace: {
        type: ControlType.Boolean,
        title: "Distance",
        enabledTitle: "Space",
        disabledTitle: "Group",
        defaultValue: Slideshow.defaultProps.arrowOptions.arrowShouldSpace,
        hidden: (props) => !props.showMouseControls,
      },
      arrowPosition: {
        type: ControlType.Enum,
        title: "Position",
        options: [
          "auto",
          "top-left",
          "top-mid",
          "top-right",
          "bottom-left",
          "bottom-mid",
          "bottom-right",
        ],
        optionTitles: [
          "Center",
          "Top Left",
          "Top Middle",
          "Top Right",
          "Bottom Left",
          "Bottom Middle",
          "Bottom Right",
        ],
        hidden: (props) => !props.showMouseControls || props.arrowShouldSpace,
      },
      arrowPadding: {
        type: ControlType.Number,
        title: "Inset",
        min: -100,
        max: 100,
        defaultValue: 20,
        displayStepper: true,
        hidden: (props) => !props.showMouseControls || !props.arrowShouldSpace,
      },
      arrowPaddingTop: {
        type: ControlType.Number,
        title: "Top",
        min: -500,
        max: 500,
        defaultValue: 0,
        displayStepper: true,
        hidden: (props) =>
          !props.showMouseControls ||
          props.arrowShouldSpace ||
          props.arrowPosition === "auto" ||
          props.arrowPosition === "bottom-mid" ||
          props.arrowPosition === "bottom-left" ||
          props.arrowPosition === "bottom-right",
      },
      arrowPaddingBottom: {
        type: ControlType.Number,
        title: "Bottom",
        min: -500,
        max: 500,
        defaultValue: 0,
        displayStepper: true,
        hidden: (props) =>
          !props.showMouseControls ||
          props.arrowShouldSpace ||
          props.arrowPosition === "auto" ||
          props.arrowPosition === "top-mid" ||
          props.arrowPosition === "top-left" ||
          props.arrowPosition === "top-right",
      },
      arrowPaddingRight: {
        type: ControlType.Number,
        title: "Right",
        min: -500,
        max: 500,
        defaultValue: 0,
        displayStepper: true,
        hidden: (props) =>
          !props.showMouseControls ||
          props.arrowShouldSpace ||
          props.arrowPosition === "auto" ||
          props.arrowPosition === "top-left" ||
          props.arrowPosition === "top-mid" ||
          props.arrowPosition === "bottom-left" ||
          props.arrowPosition === "bottom-mid",
      },
      arrowPaddingLeft: {
        type: ControlType.Number,
        title: "Left",
        min: -500,
        max: 500,
        defaultValue: 0,
        displayStepper: true,
        hidden: (props) =>
          !props.showMouseControls ||
          props.arrowShouldSpace ||
          props.arrowPosition === "auto" ||
          props.arrowPosition === "top-right" ||
          props.arrowPosition === "top-mid" ||
          props.arrowPosition === "bottom-right" ||
          props.arrowPosition === "bottom-mid",
      },
      arrowGap: {
        type: ControlType.Number,
        title: "Gap",
        min: 0,
        max: 100,
        defaultValue: 10,
        displayStepper: true,
        hidden: (props) => !props.showMouseControls || props.arrowShouldSpace,
      },
    },
  },
  progressOptions: {
    type: ControlType.Object,
    title: "Dots",
    controls: {
      showProgressDots: {
        type: ControlType.Boolean,
        title: "Show",
        defaultValue: false,
      },
      dotSize: {
        type: ControlType.Number,
        title: "Size",
        min: 1,
        max: 100,
        defaultValue: 10,
        displayStepper: true,
        hidden: (props) => !props.showProgressDots || props.showScrollbar,
      },
      dotsInset: {
        type: ControlType.Number,
        title: "Inset",
        min: -100,
        max: 100,
        defaultValue: 10,
        displayStepper: true,
        hidden: (props) => !props.showProgressDots || props.showScrollbar,
      },
      dotsGap: {
        type: ControlType.Number,
        title: "Gap",
        min: 0,
        max: 100,
        defaultValue: 10,
        displayStepper: true,
        hidden: (props) => !props.showProgressDots || props.showScrollbar,
      },
      dotsPadding: {
        type: ControlType.Number,
        title: "Padding",
        min: 0,
        max: 100,
        defaultValue: 10,
        displayStepper: true,
        hidden: (props) => !props.showProgressDots || props.showScrollbar,
      },
      dotsFill: {
        type: ControlType.Color,
        title: "Fill",
        defaultValue: "#fff",
        hidden: (props) => !props.showProgressDots || props.showScrollbar,
      },
      dotsBackground: {
        type: ControlType.Color,
        title: "Backdrop",
        defaultValue: "rgba(0,0,0,0.2)",
        hidden: (props) => !props.showProgressDots || props.showScrollbar,
      },
      dotsRadius: {
        type: ControlType.Number,
        title: "Radius",
        min: 0,
        max: 200,
        defaultValue: 50,
        hidden: (props) => !props.showProgressDots || props.showScrollbar,
      },
      dotsOpacity: {
        type: ControlType.Number,
        title: "Opacity",
        min: 0,
        max: 1,
        defaultValue: 0.5,
        step: 0.1,
        displayStepper: true,
        hidden: (props) => !props.showProgressDots || props.showScrollbar,
      },
      dotsActiveOpacity: {
        type: ControlType.Number,
        title: "Current",
        min: 0,
        max: 1,
        defaultValue: 1,
        step: 0.1,
        displayStepper: true,
        hidden: (props) => !props.showProgressDots || props.showScrollbar,
      },
      dotsBlur: {
        type: ControlType.Number,
        title: "Blur",
        min: 0,
        max: 50,
        defaultValue: 0,
        step: 1,
        hidden: (props) => !props.showProgressDots || props.showScrollbar,
      },
    },
  },
});
/* Placeholder Styles */ const containerStyle = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
  placeItems: "center",
  margin: 0,
  padding: 0,
  listStyleType: "none",
  textIndent: "none",
};
/* Component Styles */ const placeholderStyles = {
  display: "flex",
  width: "100%",
  height: "100%",
  placeContent: "center",
  placeItems: "center",
  flexDirection: "column",
  color: "#96F",
  background: "rgba(136, 85, 255, 0.1)",
  fontSize: 11,
  overflow: "hidden",
  padding: "20px 20px 30px 20px",
};
const emojiStyles = { fontSize: 32, marginBottom: 10 };
const titleStyles = {
  margin: 0,
  marginBottom: 10,
  fontWeight: 600,
  textAlign: "center",
};
const subtitleStyles = {
  margin: 0,
  opacity: 0.7,
  maxWidth: 180,
  lineHeight: 1.5,
  textAlign: "center",
};
/* Control Styles */ const baseButtonStyles = {
  border: "none",
  display: "flex",
  placeContent: "center",
  placeItems: "center",
  overflow: "hidden",
  background: "transparent",
  cursor: "pointer",
  margin: 0,
  padding: 0,
};
const controlsStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "absolute",
  pointerEvents: "none",
  userSelect: "none",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  border: 0,
  padding: 0,
  margin: 0,
};
/* Clamp function, used for fadeInset */ const clamp = (num, min, max) =>
  Math.min(Math.max(num, min), max);
/* Slide Component */ const Slide = /*#__PURE__*/ memo(
  /*#__PURE__*/ forwardRef(function Component(props, ref) {
    const {
      slideKey,
      width,
      height,
      child,
      size,
      gap,
      wrappedValue,
      numChildren,
      childCounter,
      isCanvas,
      effects,
      effectsOpacity,
      effectsScale,
      effectsRotate,
      isHorizontal,
      isLast,
      index,
      /** 1 or -1 depending on if horizontal and rtl writing direction */ directionModifier,
    } = props;
    const fallbackRef = useRef();
    /**
     * Unique offsets + scroll range [0, 1, 1, 0]
     */ const childOffset = (size?.item + gap) * childCounter;
    const scrollRange = [
      -size?.item,
      0,
      size?.parent - size?.item + gap,
      size?.parent,
    ].map((val) => val - childOffset * directionModifier);
    /**
     * Effects
     */ const rotateY =
      !isCanvas &&
      useTransform(wrappedValue, scrollRange, [
        -effectsRotate,
        0,
        0,
        effectsRotate,
      ]);
    const rotateX =
      !isCanvas &&
      useTransform(wrappedValue, scrollRange, [
        effectsRotate,
        0,
        0,
        -effectsRotate,
      ]);
    const opacity =
      !isCanvas &&
      useTransform(wrappedValue, scrollRange, [
        effectsOpacity,
        1,
        1,
        effectsOpacity,
      ]);
    const scale =
      !isCanvas &&
      useTransform(wrappedValue, scrollRange, [
        effectsScale,
        1,
        1,
        effectsScale,
      ]);
    const originXorY =
      !isCanvas && useTransform(wrappedValue, scrollRange, [1, 1, 0, 0]);
    const isVisible =
      !isCanvas &&
      useTransform(
        wrappedValue,
        (latest) => latest >= scrollRange[1] && latest <= scrollRange[2]
      );
    useEffect(() => {
      if (!isVisible) return;
      function manageVisibility(visible) {
        const node = ref?.current ?? fallbackRef.current;
        if (!node) return; // for a11y: Manage tabIndex on focusable descendants & aria-hidden on the parent.
        if (visible) {
          node.querySelectorAll("button,a").forEach((el) => {
            const orig = el.dataset.origTabIndex;
            if (orig) el.tabIndex = orig;
            else el.removeAttribute("tabIndex");
          });
        } else {
          node.querySelectorAll("button,a").forEach((el) => {
            const orig = el.getAttribute("tabIndex");
            if (orig) el.dataset.origTabIndex = orig;
            el.tabIndex = -1;
          });
        }
        node.setAttribute("aria-hidden", !visible);
      }
      manageVisibility(isVisible);
      return isVisible.on("change", (visible) => {
        manageVisibility(visible);
      });
    }, []);
    const visibility = isCanvas
      ? "visible"
      : useTransform(
          wrappedValue,
          [
            scrollRange[0] - size.viewportLength,
            mix(scrollRange[1], scrollRange[2], 0.5),
            scrollRange[3] + size.viewportLength,
          ],
          ["hidden", "visible", "hidden"]
        );
    const key = slideKey + "child";
    return /*#__PURE__*/ _jsx(LayoutGroup, {
      inherit: "id",
      id: key,
      children: /*#__PURE__*/ _jsx("li", {
        style: { display: "contents" },
        children: /*#__PURE__*/ cloneElement(child, {
          ref: ref ?? fallbackRef,
          key,
          style: {
            ...child.props?.style,
            flexShrink: 0,
            userSelect: "none",
            width,
            height,
            opacity: opacity,
            scale: scale,
            originX: isHorizontal ? originXorY : 0.5,
            originY: !isHorizontal ? originXorY : 0.5,
            rotateY: isHorizontal ? rotateY : 0,
            rotateX: !isHorizontal ? rotateX : 0,
            visibility,
          },
          layoutId: child.props.layoutId
            ? child.props.layoutId + "-original-" + index
            : undefined,
        }),
      }),
    });
  })
);
const Dot = /*#__PURE__*/ memo(function Dot({
  selectedOpacity,
  opacity,
  total,
  index,
  wrappedIndex,
  wrappedIndexInverted,
  dotStyle,
  buttonStyle,
  gap,
  padding,
  isHorizontal,
  isInverted,
  ...props
}) {
  /* Check active item */ /* Go 0—1—2—3—4—5—0 */ let isSelected =
    wrappedIndex === index;
  /* Go 0—5—4—3—2—1—0—5 instead when inverted */ if (isInverted) {
    isSelected = Math.abs(wrappedIndexInverted) === index;
  }
  const inlinePadding = gap / 2;
  const top = !isHorizontal && index > 0 ? inlinePadding : padding;
  const bottom = !isHorizontal && index !== total - 1 ? inlinePadding : padding;
  const right = isHorizontal && index !== total - 1 ? inlinePadding : padding;
  const left = isHorizontal && index > 0 ? inlinePadding : padding;
  return /*#__PURE__*/ _jsx("button", {
    "aria-label": `Scroll to page ${index + 1}`,
    type: "button",
    ...props,
    style: {
      ...buttonStyle,
      padding: `${top}px ${right}px ${bottom}px ${left}px`,
    },
    children: /*#__PURE__*/ _jsx(motion.div, {
      style: { ...dotStyle },
      initial: false,
      animate: { opacity: isSelected ? selectedOpacity : opacity },
      transition: { duration: 0.3 },
    }),
  });
});
/* Dot Styles */ const dotsContainerStyle = {
  display: "flex",
  placeContent: "center",
  placeItems: "center",
  overflow: "hidden",
  position: "absolute",
  pointerEvents: "auto",
};
const dotStyle = {
  borderRadius: "50%",
  background: "white",
  cursor: "pointer",
  border: "none",
  placeContent: "center",
  placeItems: "center",
  padding: 0,
};
function useWritingDirection() {
  const [writingDirection, setWritingDirection] = useState("ltr"); // must be done this way to ensure that there isn't a mismatch with SSG
  // which leads to button images not updating for the real writing direction
  useEffect(() => {
    if (window?.document?.documentElement?.dir === "rtl") {
      setWritingDirection("rtl");
    }
  }, []);
  return writingDirection;
}
function getSlideshowResolvedDirection(direction, writingDirection) {
  if (writingDirection !== "rtl") return direction;
  if (direction === "left") return "right";
  if (direction === "right") return "left";
  return direction;
}
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Slideshow",
      slots: [],
      annotations: {
        framerIntrinsicHeight: "200",
        framerIntrinsicWidth: "400",
        framerContractVersion: "1",
        framerSupportedLayoutWidth: "fixed",
        framerSupportedLayoutHeight: "fixed",
        framerDisableUnlink: "*",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./SlideShow.map
