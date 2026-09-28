// ⚠️⚠️⚠️⚠️⚠️
// Edit these files in https://github.com/framer/FramerCodeComponents
// ⚠️⚠️⚠️⚠️⚠️
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import {
  addPropertyControls,
  ControlType,
  RenderTarget,
  useIsOnFramerCanvas,
  withCSS,
} from "framer";
import { AnimatePresence, isBrowser, motion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  defaultConsent,
  useConsent,
  useGTMDefaultConsent,
} from "https://framerusercontent.com/modules/zvf2WTzc98u6EX2y7YDj/SElQKSOnUBZOSJtmN84H/consent.js";
import { useRegion } from "https://framerusercontent.com/modules/0oeZpJVursioGAbwgB9e/LdKok3hlO89v4p4R5gq4/region.js";
import { Banner } from "https://framerusercontent.com/modules/EkwkxVF9vkTs720qqBC8/LMJoQTMJ3dAbGtsVKgtQ/Banner.js";
import { inEU } from "https://framerusercontent.com/modules/HKzIAGtbudIGLRAteuFH/Puy217ziAIZRqHk4rVRu/inEU.js";
import {
  DEFAULT_FONT_FAMILY,
  getFlexboxValues,
  interactionResponse,
  yieldBeforeCb,
} from "https://framerusercontent.com/modules/tfq8EDfrazNLXzc9LJte/pK4oThhjjhllFVAwqFls/utils.js"; // Keep track of open state between page reloads
let initiallyOpen = false;
/**
 * COOKIE BANNER
 * By Floris Verloop
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 *
 * @framerDisableUnlink
 *
 */ export default function CookieBanner({
  gtmId,
  preview,
  trigger,
  banner,
  button,
  content,
  options,
  style,
  gtmLoadedExternally,
  onShown,
  onConsentChange,
  onAccept,
  onDismiss,
  onReject,
  onSavePreferences,
}) {
  const isOnFramerCanvas = useIsOnFramerCanvas();
  const isPreview = preview && isOnFramerCanvas;
  const skipLogic = !preview && isOnFramerCanvas;
  const isInEU = isBrowser ? inEU() : false; // we ignore customer's GTM in preview because their specific setups can break the preview currently
  // this can be removed if we remove reliance on globals for react symbols in the preview
  // https://framer-team.slack.com/archives/C01J38GC2SW/p1770826268498759
  const skipGTMId = isInFramerPreview();
  const gtmDefaults = useGTMDefaultConsent();
  const region = useRegion({
    content,
    useRegionFromProps: isPreview, // skip EU check (expensive) if we are on the canvas and don't want a preview
    skipEUCheck: skipLogic,
    regionFromGTM: gtmDefaults.region,
  });
  const consent = useConsent({
    gtmId: skipGTMId ? "" : gtmId,
    defaultConsent: gtmDefaults.available
      ? gtmDefaults.consent
      : region.defaults,
    gtmLoadedExternally,
    defaultsFromGTM: gtmDefaults.available,
  });
  const [isOpen, setIsOpen] = useState(initiallyOpen); // On page switch, disable all transitions so the banner shows up as fast as possible.
  const [instantlyShowOnMount, setInstantlyShowOnMount] =
    useState(initiallyOpen);
  useEffect(() => {
    if (skipLogic) return; // Save open state between page switches
    initiallyOpen = isOpen; // Disable instantly show on mount after first open
    if (isOpen) {
      setInstantlyShowOnMount(false);
    } // Track shown event
    if (isOpen && !isPreview && onShown) {
      yieldBeforeCb(() => onShown({ isInEU }), { priority: "user-blocking" });
    }
  }, [isOpen, skipLogic]); // Check if user should be prompted
  useEffect(() => {
    if (skipLogic) return;
    const noConsentGiven = consent.isInitialized && !consent.isDismissed;
    const shouldAutoAccept =
      region.type === "simple" && !consent.isAutoAccepted;
    if (noConsentGiven) {
      performance.mark("framer-cookie-open");
      setIsOpen(true);
      /** Automatically accept all cookies for simple banner. */ if (
        shouldAutoAccept
      ) {
        consent.autoAccept(); // Fire callback
        if (onAccept) {
          yieldBeforeCb(() => onAccept({ isInEU }));
        }
      }
    }
    if (consent.isDismissed) {
      setIsOpen(false);
    }
  }, [consent.isInitialized, consent.isDismissed, skipLogic]);
  useEffect(() => {
    if (skipLogic) return;
    if (onConsentChange) {
      yieldBeforeCb(() => onConsentChange({ isInEU, consent: consent.modes }));
    }
  }, [consent.modes, skipLogic]);
  async function handleDismiss() {
    await interactionResponse();
    consent.dismiss();
    setIsOpen(false); // Fire callback
    if (onDismiss) {
      yieldBeforeCb(() => onDismiss({ isInEU }));
    }
  }
  async function handleAcceptAll() {
    await interactionResponse();
    consent.acceptAll();
    setIsOpen(false); // Fire callback
    if (onAccept) {
      yieldBeforeCb(() => onAccept({ isInEU }));
    }
  }
  async function handleRejectAll() {
    await interactionResponse();
    consent.rejectAll();
    setIsOpen(false); // Fire callback
    if (onReject) {
      yieldBeforeCb(() => onReject({ isInEU }));
    }
  }
  async function handleAcceptCurrent() {
    await interactionResponse();
    consent.acceptCurrent();
    setIsOpen(false); // Fire callbacks
    yieldBeforeCb(() => {
      if (onAccept) {
        onAccept({ isInEU });
      }
    });
    yieldBeforeCb(() => {
      if (onSavePreferences) {
        onSavePreferences({ isInEU });
      }
    });
  }
  if (isPreview) {
    return /*#__PURE__*/ _jsx("div", {
      style: { ...style, width: banner.width },
      children: /*#__PURE__*/ _jsx(Banner, {
        banner: banner,
        button: button,
        region: region,
        options: options,
        previewOptions: isPreview && options.preview,
        consentModes: { ...defaultConsent, necessary: true },
        animateOnMount: false,
      }),
    });
  }
  return /*#__PURE__*/ _jsxs(_Fragment, {
    children: [
      /*#__PURE__*/ _jsx(Trigger, {
        style: style,
        trigger: trigger,
        onClick: () => setIsOpen(true),
      }),
      !skipLogic &&
        /*#__PURE__*/ _jsx(Overlay, {
          banner: banner,
          button: button,
          region: region,
          options: options,
          consentModes: consent.modes,
          animateOnMount: !instantlyShowOnMount,
          onAcceptAll: handleAcceptAll,
          onAcceptCurrent: handleAcceptCurrent,
          onRejectAll: handleRejectAll,
          onDismiss: handleDismiss,
          onToggleConsent: consent.toggleMode,
          isOpen: isOpen,
        }),
    ],
  });
}
function isInFramerPreview() {
  return (
    RenderTarget.current() === RenderTarget.preview &&
    typeof window !== "undefined" &&
    window.origin?.endsWith(".framercanvas.com")
  );
}
const IconCookie = /*#__PURE__*/ lazy(() =>
  import(
    "https://framerusercontent.com/modules/80EyUU0Nk6u7skW3IlHH/5dbuLOGDrS0SjHVtVyCR/Icons.js"
  )
);
function Overlay(props) {
  const insetValue = props.banner.insetPerSide
    ? `${props.banner.insetTop}px ${props.banner.insetRight}px ${props.banner.insetBottom}px ${props.banner.insetLeft}px`
    : `${props.banner.inset}px`;
  const { justifyContent, alignItems } = getFlexboxValues(
    props.banner.position
  );
  const isOpen = props.isOpen;
  const [shouldRenderPortal, setShouldRenderPortal] = useState(isOpen); // if the portal has previously been rendered, we want to keep rendering the portal, which ensures:
  // - that AnimatePresence works (fade out effect)
  // - we don't cause body style recalc/reflow when the DOM node is removed
  if (!shouldRenderPortal && isOpen) setShouldRenderPortal(isOpen);
  if (!shouldRenderPortal) return null;
  const blocking = props.region.blocking;
  return /*#__PURE__*/ createPortal(
    /*#__PURE__*/ _jsx("div", {
      style: { display: "contents" },
      children: /*#__PURE__*/ _jsx(AnimatePresence, {
        children: isOpen
          ? /*#__PURE__*/ _jsxs(motion.div, {
              style: {
                // We only need to span to the full viewport width if the overlay is blocking.
                // Otherwise, we optimize for a smaller layer size. see: https://framer-team.slack.com/archives/C05V49Q4NJ2/p1709820207863249
                top: blocking || alignItems === "flex-start" ? 0 : undefined,
                left:
                  blocking || justifyContent === "flex-start" ? 0 : undefined,
                right:
                  blocking || justifyContent === "flex-end" ? 0 : undefined,
                height: blocking ? "100%" : undefined,
                width:
                  blocking || justifyContent === "center" ? "100%" : undefined,
                bottom: blocking || alignItems === "flex-end" ? 0 : undefined,
                boxSizing: "border-box",
                position: "fixed",
                touchAction: "none",
                padding: insetValue,
                zIndex: props.banner.zIndex,
                display: "flex",
                flexDirection: "row",
                gap: 20,
                justifyContent: "center",
                pointerEvents: blocking ? "all" : "none",
              },
              children: [
                blocking &&
                  /*#__PURE__*/ _jsx(Backdrop, {
                    color: props.banner.style?.backdrop,
                  }),
                /*#__PURE__*/ _jsx("div", {
                  style: {
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent,
                    alignItems,
                    pointerEvents: "none",
                    maxWidth:
                      props.banner.containerWidth > 0
                        ? props.banner.containerWidth
                        : "unset",
                  },
                  children: /*#__PURE__*/ _jsx(Banner, { ...props }),
                }),
              ],
            })
          : null,
      }),
    }),
    document.body
  );
}
const Trigger = withCSS(
  ({ trigger, style, onClick }) => {
    const isOnFramerCanvas = useIsOnFramerCanvas();
    if (trigger.type !== "none") {
      return /*#__PURE__*/ _jsx("button", {
        type: "button",
        className: "__framer-cookie-component-button",
        "aria-label": "Cookie Trigger",
        style: {
          width: "100%",
          height: "100%",
          background: "none",
          display: "flex",
          border: "none",
          padding: 0,
          color: trigger.color,
          fontSize: 16,
          cursor: "pointer",
          ...trigger.textFont,
        },
        onClick: onClick,
        children:
          trigger.type === "icon"
            ? trigger.iconType === "custom" && trigger.iconImage
              ? /*#__PURE__*/ _jsx("img", {
                  alt: "",
                  src: trigger.iconImage.src,
                  width: trigger.iconSize,
                  height: trigger.iconSize,
                })
              : /*#__PURE__*/ _jsx(Suspense, {
                  fallback: null,
                  children: /*#__PURE__*/ _jsx(IconCookie, {
                    width: trigger.iconSize,
                    height: trigger.iconSize,
                    color: trigger.color,
                  }),
                })
            : /*#__PURE__*/ _jsx("span", {
                style: { whiteSpace: "nowrap" },
                children: trigger.text,
              }),
      });
    }
    if (isOnFramerCanvas) {
      return /*#__PURE__*/ _jsxs("div", {
        style: {
          borderRadius: 8,
          color: "#09F",
          border: "1px dashed #09F",
          background: "rgba(0, 153, 255, 0.1)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 5,
          fontFamily: DEFAULT_FONT_FAMILY,
          textAlign: "center",
          justifyContent: "center",
          width: 164,
          ...style,
        },
        children: [
          /*#__PURE__*/ _jsx("p", {
            style: { fontSize: 12, fontWeight: 600, lineHeight: 1, margin: 0 },
            children: "Cookie Banner",
          }),
          /*#__PURE__*/ _jsx("p", {
            style: { fontSize: 12, lineHeight: 1.5, margin: 0 },
            children: "Put on a page to add a Cookie Banner.",
          }),
        ],
      });
    }
  },
  ".__framer-cookie-component-button:focus:not(:focus-visible){outline-color:transparent}",
  "framer-lib-cookie-trigger"
);
function Backdrop({ color }) {
  return /*#__PURE__*/ _jsx(motion.div, {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      backgroundColor: color,
      pointerEvents: "none",
    },
  });
}
addPropertyControls(CookieBanner, {
  gtmId: {
    title: "GTM ID",
    type: ControlType.String,
    placeholder: "GTM-AAAAAAA",
    description:
      "Your GTM container ID.\n[Learn more](https://www.framer.com/learn/cookie-banner/)",
  },
  preview: {
    type: ControlType.Boolean,
    defaultValue: true,
    description: "Lets you preview the banner on the Canvas.",
  },
  trigger: {
    type: ControlType.Object,
    buttonTitle: "Icon, Text",
    controls: {
      type: {
        title: "Type",
        type: ControlType.Enum,
        options: ["text", "icon", "none"],
        optionTitles: ["Text", "Icon", "None"],
        defaultValue: "text",
        displaySegmentedControl: true,
      },
      iconType: {
        title: "Icon",
        type: ControlType.Enum,
        options: ["default", "custom"],
        optionTitles: ["Default", "Custom"],
        displaySegmentedControl: true,
        hidden: (props) => props.type !== "icon",
      },
      text: {
        title: "Label",
        type: ControlType.String,
        defaultValue: "Cookie Settings",
        hidden: (props) => props.type !== "text",
      },
      textFont: {
        // @ts-ignore - internal
        type: ControlType.Font,
        title: " ",
        controls: "extended",
        hidden: (props) => props.type !== "text",
      },
      iconSize: {
        title: "Size",
        type: ControlType.Number,
        displayStepper: true,
        defaultValue: 24,
        hidden: (props) => props.type !== "icon",
      },
      color: {
        title: "Color",
        type: ControlType.Color,
        defaultValue: "#333",
        hidden: (props) =>
          props.type === "none" ||
          (props.type === "icon" && props.iconType === "custom"),
      },
      iconImage: {
        title: "File",
        type: ControlType.ResponsiveImage,
        allowedFileTypes: ["jpg", "png", "svg"],
        hidden: (props) => props.iconType === "default",
      },
    },
  },
  banner: {
    title: "Banner",
    type: ControlType.Object,
    buttonTitle: "Font, Styles",
    controls: {
      position: {
        type: ControlType.Enum,
        title: "Position",
        options: [
          "top-left",
          "top-center",
          "top-right",
          "bottom-right",
          "bottom-center",
          "bottom-left",
        ],
        optionTitles: [
          "Top Left",
          "Top Center",
          "Top Right",
          "Bottom Right",
          "Bottom Center",
          "Bottom Left",
        ],
        defaultValue: "bottom-right",
      },
      zIndex: {
        title: "Z Index",
        type: ControlType.Number,
        defaultValue: 10,
        displayStepper: true,
        min: 0,
        max: 10,
      },
      width: {
        title: "Width",
        type: ControlType.Number,
        defaultValue: 360,
        min: 200,
        max: 1e3,
        displayStepper: true,
        step: 5,
      },
      containerWidth: {
        title: "Wrapping",
        type: ControlType.Number,
        defaultValue: 0,
        min: 0,
      },
      padding: {
        title: "Padding",
        type: ControlType.FusedNumber,
        toggleKey: "paddingPerSide",
        toggleTitles: ["Padding", "Padding per side"],
        defaultValue: 20,
        valueKeys: [
          "paddingTop",
          "paddingRight",
          "paddingBottom",
          "paddingLeft",
        ],
        valueLabels: ["T", "R", "B", "L"],
        min: 0,
      },
      inset: {
        title: "Inset",
        type: ControlType.FusedNumber,
        toggleKey: "insetPerSide",
        toggleTitles: ["Inset", "Inset per side"],
        defaultValue: 20,
        valueKeys: ["insetTop", "insetRight", "insetBottom", "insetLeft"],
        valueLabels: ["T", "R", "B", "L"],
        min: 0,
      },
      style: {
        type: ControlType.Object,
        title: "Style",
        buttonTitle: "Fonts, Colors, Shadow",
        controls: {
          fontTitle: {
            // @ts-ignore - internal
            type: ControlType.Font,
            title: "Title",
            controls: "extended",
          },
          colorTitle: {
            title: " ",
            type: ControlType.Color,
            defaultValue: "#000",
          },
          fontBody: {
            // @ts-ignore - internal
            type: ControlType.Font,
            title: "Body",
            controls: "extended",
          },
          colorBody: {
            title: " ",
            type: ControlType.Color,
            defaultValue: "#444",
          },
          fill: {
            title: "Fill",
            type: ControlType.Color,
            defaultValue: "#FFF",
          },
          link: {
            title: "Link",
            type: ControlType.Color,
            optional: true,
            defaultValue: "#999",
          },
          border: {
            type: ControlType.Object,
            title: "Border",
            buttonTitle: "Radius, Width",
            controls: {
              radius: {
                title: "Radius",
                type: ControlType.Number,
                displayStepper: true,
                min: 0,
                defaultValue: 14,
              },
              width: {
                title: "Width",
                type: ControlType.Number,
                displayStepper: true,
                min: 0,
                defaultValue: 1,
              },
              color: {
                title: "Color",
                type: ControlType.Color,
                defaultValue: "rgba(0,0,0,0.05)",
              },
            },
          },
          shadow: {
            type: ControlType.Object,
            title: "Shadow",
            optional: true,
            controls: {
              shadowColor: {
                title: "Color",
                type: ControlType.Color,
                defaultValue: "rgba(0,0,0,0.25)",
              },
              shadowX: {
                title: "X",
                type: ControlType.Number,
                min: -100,
                max: 100,
                defaultValue: 0,
              },
              shadowY: {
                title: "Y",
                type: ControlType.Number,
                min: -100,
                max: 100,
                defaultValue: 2,
              },
              shadowBlur: {
                title: "Blur",
                type: ControlType.Number,
                min: 0,
                max: 100,
                defaultValue: 4,
              },
            },
          },
          backdrop: {
            title: "Backdrop",
            type: ControlType.Color,
            defaultValue: "rgba(0,0,0,0.1)",
            hidden: (_, props) =>
              !props.content.euBlocking && !props.content.worldBlocking,
          },
        },
      },
      animation: {
        icon: "effect",
        buttonTitle: "Options",
        type: ControlType.Object,
        controls: {
          x: {
            type: ControlType.Number,
            displayStepper: true,
            defaultValue: 0,
          },
          y: {
            type: ControlType.Number,
            displayStepper: true,
            defaultValue: 10,
          },
          scale: {
            type: ControlType.Number,
            min: 0,
            step: 0.1,
            defaultValue: 1,
          },
          transition: { type: ControlType.Transition },
        },
      },
    },
  },
  button: {
    title: "Buttons",
    type: ControlType.Object,
    buttonTitle: "Variants, Style",
    controls: {
      primary: {
        title: "Primary",
        type: ControlType.Object,
        buttonTitle: "Colors, Shadow",
        controls: {
          fill: {
            title: "Fill",
            type: ControlType.Color,
            defaultValue: "#000",
          },
          color: {
            title: "Color",
            type: ControlType.Color,
            defaultValue: "#FFF",
          },
          shadow: {
            type: ControlType.Object,
            title: "Shadow",
            optional: true,
            controls: {
              shadowColor: {
                title: "Color",
                type: ControlType.Color,
                defaultValue: "rgba(0,0,0,0.25)",
              },
              shadowX: {
                title: "X",
                type: ControlType.Number,
                min: -100,
                max: 100,
              },
              shadowY: {
                title: "Y",
                type: ControlType.Number,
                min: -100,
                max: 100,
              },
              shadowBlur: {
                title: "Blur",
                type: ControlType.Number,
                min: 0,
                max: 100,
              },
            },
          },
        },
      },
      secondary: {
        title: "Secondary",
        type: ControlType.Object,
        buttonTitle: "Colors, Shadow",
        controls: {
          fill: {
            title: "Fill",
            type: ControlType.Color,
            defaultValue: "#EEE",
          },
          color: {
            title: "Color",
            type: ControlType.Color,
            defaultValue: "#444",
          },
          shadow: {
            type: ControlType.Object,
            title: "Shadow",
            optional: true,
            controls: {
              shadowColor: {
                title: "Color",
                type: ControlType.Color,
                defaultValue: "rgba(0,0,0,0.25)",
              },
              shadowX: {
                title: "X",
                type: ControlType.Number,
                min: -100,
                max: 100,
              },
              shadowY: {
                title: "Y",
                type: ControlType.Number,
                min: -100,
                max: 100,
              },
              shadowBlur: {
                title: "Blur",
                type: ControlType.Number,
                min: 0,
                max: 100,
              },
            },
          },
        },
      },
      labels: {
        type: ControlType.Object,
        controls: {
          accept: { type: ControlType.String, defaultValue: "Accept" },
          reject: { type: ControlType.String, defaultValue: "Reject" },
          acceptAll: { type: ControlType.String, defaultValue: "Accept all" },
          rejectAll: { type: ControlType.String, defaultValue: "Reject all" },
          customize: { type: ControlType.String, defaultValue: "Customize" },
          save: { type: ControlType.String, defaultValue: "Save Preferences" },
          confirm: { type: ControlType.String, defaultValue: "Okay" },
        },
      },
      font: {
        // @ts-ignore - internal
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
      },
      padding: {
        title: "Padding",
        type: ControlType.FusedNumber,
        toggleKey: "paddingPerSide",
        toggleTitles: ["Padding", "Padding per side"],
        defaultValue: 10,
        valueKeys: [
          "paddingTop",
          "paddingRight",
          "paddingBottom",
          "paddingLeft",
        ],
        valueLabels: ["T", "R", "B", "L"],
        min: 0,
      },
      borderRadius: {
        title: "Radius",
        type: ControlType.Number,
        displayStepper: true,
        min: 0,
        defaultValue: 8,
      },
      tapOpacity: {
        title: "Tap Opacity",
        type: ControlType.Number,
        step: 0.1,
        displayStepper: true,
        max: 1,
        min: 0,
        defaultValue: 0.4,
      },
      hoverOpacity: {
        title: "Hover Opacity",
        type: ControlType.Number,
        step: 0.1,
        displayStepper: true,
        max: 1,
        min: 0,
        defaultValue: 0.6,
      },
      direction: {
        type: ControlType.Enum,
        title: "Direction",
        options: ["row", "column"], // @ts-ignore - internal
        optionIcons: ["direction-horizontal", "direction-vertical"],
        defaultValue: "row",
        displaySegmentedControl: true,
      },
      fluid: { title: "Fluid", type: ControlType.Boolean, defaultValue: true },
    },
  },
  content: {
    title: "Regions",
    type: ControlType.Object,
    buttonTitle: "World, EU",
    controls: {
      isEU: {
        title: " ",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "EU",
        disabledTitle: "World",
      },
      euType: {
        title: "Choices",
        type: ControlType.Enum,
        options: ["simple", "medium", "advanced"],
        optionTitles: ["None", "Accept/Reject", "Customizable"],
        defaultValue: "medium",
        hidden: (props) => !props.isEU,
      },
      euTitle: {
        title: "Title",
        type: ControlType.String,
        defaultValue: "Cookie Settings",
        hidden: (props) => props.euType === "simple" || !props.isEU,
      },
      euDescription: {
        title: "Description",
        type: ControlType.String,
        defaultValue:
          "We use cookies to enhance your experience, analyze site traffic and deliver personalized content.",
        displayTextArea: true,
        hidden: (props) => !props.isEU,
      },
      euPolicy: {
        title: "Policy",
        type: ControlType.Object,
        buttonTitle: "Link, Prefix",
        controls: {
          link: {
            title: "Link",
            type: ControlType.Link,
            defaultValue: "https://www.framer.com/legal/policy/",
          },
          prefix: {
            title: "Prefix",
            type: ControlType.String,
            defaultValue: "Read our",
          },
          label: {
            title: "Label",
            type: ControlType.String,
            defaultValue: "Cookie Policy",
          },
        },
        hidden: (props) => !props.isEU,
      },
      euDefaults: {
        title: "Defaults",
        buttonTitle: "Options",
        type: ControlType.Object,
        controls: {
          necessary: {
            type: ControlType.Boolean,
            enabledTitle: "Granted",
            disabledTitle: "Denied",
            defaultValue: true,
          },
          preferences: {
            type: ControlType.Boolean,
            enabledTitle: "Granted",
            disabledTitle: "Denied",
            defaultValue: false,
          },
          analytics: {
            type: ControlType.Boolean,
            enabledTitle: "Granted",
            disabledTitle: "Denied",
            defaultValue: false,
          },
          marketing: {
            type: ControlType.Boolean,
            enabledTitle: "Granted",
            disabledTitle: "Denied",
            defaultValue: false,
            description:
              "The default consent when the user hasn’t provided any yet.",
          },
        },
        hidden: (props) => !props.isEU,
      },
      euShowReject: {
        title: "Reject All",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        hidden: (props) => props.euType !== "advanced",
      },
      euBlocking: {
        title: "Blocking",
        type: ControlType.Boolean,
        defaultValue: false,
        description: "Renders a content blocking backdrop.",
        hidden: (props) => !props.isEU,
      },
      worldType: {
        title: "Choices",
        type: ControlType.Enum,
        options: ["simple", "medium", "advanced"],
        optionTitles: ["None", "Accept/Reject", "Customizable"],
        defaultValue: "simple",
        hidden: (props) => props.isEU,
      },
      worldTitle: {
        title: "Title",
        type: ControlType.String,
        defaultValue: "Cookie Settings",
        hidden: (props) => props.worldType === "simple" || props.isEU,
      },
      worldDescription: {
        title: "Description",
        type: ControlType.String,
        defaultValue:
          "We use cookies to personalize content, run ads, and analyze traffic.",
        displayTextArea: true,
        hidden: (props) => props.isEU,
      },
      worldPolicy: {
        title: "Policy",
        type: ControlType.Object,
        buttonTitle: "Link, Prefix",
        controls: {
          link: { title: "Link", type: ControlType.Link },
          prefix: {
            title: "Prefix",
            type: ControlType.String,
            defaultValue: "Read our",
          },
          label: {
            title: "Label",
            type: ControlType.String,
            defaultValue: "Cookie Policy",
          },
        },
        hidden: (props) => props.isEU,
      },
      worldDefaults: {
        title: "Defaults",
        buttonTitle: "Options",
        type: ControlType.Object,
        controls: {
          necessary: {
            type: ControlType.Boolean,
            enabledTitle: "Granted",
            disabledTitle: "Denied",
            defaultValue: true,
          },
          preferences: {
            type: ControlType.Boolean,
            enabledTitle: "Granted",
            disabledTitle: "Denied",
            defaultValue: true,
          },
          analytics: {
            type: ControlType.Boolean,
            enabledTitle: "Granted",
            disabledTitle: "Denied",
            defaultValue: true,
          },
          marketing: {
            type: ControlType.Boolean,
            enabledTitle: "Granted",
            disabledTitle: "Denied",
            defaultValue: true,
            description:
              "The default consent when the user hasn’t provided any yet.",
          },
        },
        hidden: (props) => props.isEU,
      },
      worldShowReject: {
        title: "Reject All",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        hidden: (props) => props.worldType !== "advanced",
      },
      worldBlocking: {
        title: "Blocking",
        type: ControlType.Boolean,
        defaultValue: false,
        description: "Renders a content blocking backdrop.",
        hidden: (props) => props.isEU,
      },
    },
  },
  options: {
    type: ControlType.Object,
    buttonTitle: "Content, Styles",
    hidden: (_, props) =>
      props.content.euType !== "advanced" &&
      props.content.worldType !== "advanced",
    controls: {
      preview: {
        type: ControlType.Boolean,
        defaultValue: false,
        description: "Open when previewing banner on the canvas.",
        hidden: (_, props) => !props.preview,
      },
      necessary: {
        title: "Necessary",
        type: ControlType.Object,
        buttonTitle: "Content",
        controls: {
          title: {
            title: "Title",
            type: ControlType.String,
            defaultValue: "Necessary",
          },
          description: {
            title: "Description",
            type: ControlType.String,
            defaultValue: "Enables security and basic functionality.",
            displayTextArea: true,
          },
          optional: {
            title: "Optional",
            type: ControlType.Boolean,
            defaultValue: true,
          },
        },
      },
      preferences: {
        title: "Preferences",
        type: ControlType.Object,
        buttonTitle: "Content",
        controls: {
          title: {
            title: "Title",
            type: ControlType.String,
            defaultValue: "Preferences",
          },
          description: {
            title: "Description",
            type: ControlType.String,
            defaultValue: "Enables personalized content and settings.",
            displayTextArea: true,
            optional: true,
          },
        },
      },
      analytics: {
        title: "Analytics",
        type: ControlType.Object,
        buttonTitle: "Content",
        controls: {
          title: {
            title: "Title",
            type: ControlType.String,
            defaultValue: "Analytics",
          },
          description: {
            title: "Description",
            type: ControlType.String,
            defaultValue: "Enables tracking of performance.",
            displayTextArea: true,
          },
        },
      },
      marketing: {
        title: "Marketing",
        type: ControlType.Object,
        buttonTitle: "Content",
        controls: {
          title: {
            title: "Title",
            type: ControlType.String,
            defaultValue: "Marketing",
          },
          description: {
            title: "Description",
            type: ControlType.String,
            defaultValue: "Enables ads personalization and tracking.",
            displayTextArea: true,
          },
        },
      },
      style: {
        type: ControlType.Object,
        title: "Style",
        buttonTitle: "Fonts, Colors",
        controls: {
          fontTitle: {
            // @ts-ignore - internal
            type: ControlType.Font,
            title: "Title",
            controls: "basic",
          },
          fontBody: {
            // @ts-ignore - internal
            type: ControlType.Font,
            title: "Body",
            controls: "basic",
          },
          background: {
            title: "Background",
            type: ControlType.Color,
            defaultValue: "rgba(0,0,0,0.02)",
          },
          border: {
            type: ControlType.Object,
            title: "Border",
            buttonTitle: "Radius, Width",
            controls: {
              radius: {
                title: "Radius",
                type: ControlType.Number,
                displayStepper: true,
                min: 0,
                defaultValue: 8,
              },
              width: {
                title: "Width",
                type: ControlType.Number,
                displayStepper: true,
              },
              color: {
                title: "Color",
                type: ControlType.Color,
                defaultValue: "rgba(0,0,0,0.02)",
              },
            },
          },
          toggleColor: {
            title: "On",
            type: ControlType.Color,
            defaultValue: "#000",
          },
          toggleColorInactive: {
            title: "Off",
            type: ControlType.Color,
            defaultValue: "rgba(0,0,0,0.1)",
          },
          padding: {
            title: "Padding",
            type: ControlType.FusedNumber,
            toggleKey: "paddingPerSide",
            toggleTitles: ["Padding", "Padding per side"],
            defaultValue: 12,
            valueKeys: [
              "paddingTop",
              "paddingRight",
              "paddingBottom",
              "paddingLeft",
            ],
            valueLabels: ["T", "R", "B", "L"],
            min: 0,
          },
        },
      },
    },
  },
});
CookieBanner.displayName = "Cookie Banner";
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "CookieBanner",
      slots: [],
      annotations: {
        framerSupportedLayoutWidth: "auto",
        framerSupportedLayoutHeight: "auto",
        framerDisableUnlink: "*",
        framerContractVersion: "1",
      },
    },
    ContentProps: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    OptionsStyle: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    ContentType: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    PolicyProps: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    ButtonsProps: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    FontProps: { type: "tsType", annotations: { framerContractVersion: "1" } },
    CookieBannerProps: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Cookies.map
