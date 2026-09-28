// ⚠️⚠️⚠️⚠️⚠️
// Edit these files in https://github.com/framer/FramerCodeComponents
// ⚠️⚠️⚠️⚠️⚠️
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { withCSS } from "framer";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useState } from "react";
import {
  DEFAULT_FONT_FAMILY,
  getMultipleShadows,
  getShadow,
} from "https://framerusercontent.com/modules/tfq8EDfrazNLXzc9LJte/pK4oThhjjhllFVAwqFls/utils.js";
const SPACING = 20; // if you update the Toggle component inside this project, copy the new URL to here:
const Toggle = /*#__PURE__*/ lazy(() =>
  import(
    "https://framerusercontent.com/modules/QDCSmi7dYWSK5AcRSFyX/sBWK1WbcsjrFOSoIzxuJ/Blf0sjosZ.js"
  )
);
export const Banner = withCSS(
  function Banner({
    banner,
    button,
    region,
    options,
    previewOptions,
    consentModes,
    onDismiss,
    onAcceptAll,
    onRejectAll,
    onAcceptCurrent,
    onToggleConsent,
    animateOnMount,
  }) {
    const maxHeightReduction = banner.insetPerSide
      ? banner.insetTop + banner.insetBottom
      : banner.inset * 2;
    const linkColor = banner.style.link || button.primary.fill;
    const bannerShadow = getShadow(banner.style.shadow);
    const borderShadow = banner.style.border?.width
      ? `inset 0 0 0 ${banner.style.border.width}px ${banner.style.border.color}`
      : null;
    const bannerStyle = {
      background: banner.style.fill,
      boxShadow: getMultipleShadows(bannerShadow, borderShadow),
      overflow: "hidden",
      borderRadius: banner.style.border.radius,
    };
    return /*#__PURE__*/ _jsx(motion.div, {
      initial: animateOnMount && {
        x: banner.animation.x,
        y: banner.animation.y,
        scale: banner.animation.scale,
        opacity: 0,
      },
      animate: { y: 0, x: 0, scale: 1, opacity: 1 },
      exit: {
        x: banner.animation.x,
        y: banner.animation.y,
        scale: banner.animation.scale,
        opacity: 0,
      },
      transition: animateOnMount
        ? banner.animation.transition
        : { duration: 0 },
      style: {
        maxHeight: `calc(100vh - ${maxHeightReduction}px)`,
        flexDirection: "column",
        gap: 12,
        position: "relative",
        display: "flex",
        zIndex: 100,
        pointerEvents: "auto",
      },
      children: /*#__PURE__*/ _jsx("div", {
        style: {
          ...bannerStyle,
          overflow: "scroll",
          width: "100%",
          maxWidth: banner.width,
        },
        className: `--framer-cookie-banner-container --framer-cookie-banner-type-${region.type}`,
        children:
          region.type === "simple"
            ? /*#__PURE__*/ _jsx(SimpleBanner, {
                banner: banner,
                button: button,
                linkColor: linkColor,
                description: region.description,
                policy: region.policy,
                onDismiss: onDismiss,
              })
            : region.type === "medium"
            ? /*#__PURE__*/ _jsx(AcceptRejectBanner, {
                banner: banner,
                button: button,
                linkColor: linkColor,
                title: region.title,
                description: region.description,
                policy: region.policy,
                onAccept: onAcceptAll,
                onReject: onRejectAll,
              })
            : /*#__PURE__*/ _jsx(OptionsBanner, {
                banner: banner,
                button: button,
                options: options,
                previewOptions: previewOptions,
                linkColor: linkColor,
                title: region.title,
                description: region.description,
                showReject: region.showReject,
                policy: region.policy,
                onOptionToggle: onToggleConsent,
                consent: consentModes,
                onAcceptAll: onAcceptAll,
                onRejectAll: onRejectAll,
                onAcceptCurrent: onAcceptCurrent,
              }),
      }),
    });
  },
  [
    `.--framer-cookie-banner-container::-webkit-scrollbar { display: none; }`,
    `.--framer-cookie-banner-container { 
            -ms-overflow-style: none; 
            scrollbar-width: none;  
        }`,
  ],
  "framer-lib-cookie-banner"
);
function SimpleBanner({
  banner,
  button,
  description,
  policy,
  onDismiss,
  linkColor,
}) {
  const padding = banner.paddingPerSide
    ? `${banner.paddingTop}px ${banner.paddingRight}px ${banner.paddingBottom}px ${banner.paddingLeft}px`
    : `${banner.padding}px`;
  return /*#__PURE__*/ _jsxs("div", {
    style: { display: "flex", flexDirection: "row", padding, gap: SPACING },
    children: [
      /*#__PURE__*/ _jsx(Description, {
        style: {
          ...withDefaultFontFamily(banner.style.fontBody),
          flex: 1,
          alignItems: "center",
          color: banner.style.colorBody,
        },
        linkColor: linkColor,
        description: description,
        policy: policy,
      }),
      /*#__PURE__*/ _jsx(motion.div, {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        children: /*#__PURE__*/ _jsx(Button, {
          onClick: onDismiss,
          settings: { ...button, fluid: false },
          id: "dismiss",
          children: button.labels.confirm,
        }),
      }),
    ],
  });
}
function AcceptRejectBanner({
  banner,
  button,
  title,
  linkColor,
  description,
  policy,
  onAccept,
  onReject,
}) {
  const padding = banner.paddingPerSide
    ? `${banner.paddingTop}px ${banner.paddingRight}px ${banner.paddingBottom}px ${banner.paddingLeft}px`
    : `${banner.padding}px`;
  return /*#__PURE__*/ _jsxs("div", {
    style: { padding },
    children: [
      /*#__PURE__*/ _jsxs("div", {
        children: [
          title &&
            /*#__PURE__*/ _jsx(Headline, {
              style: {
                ...withDefaultFontFamily(banner.style.fontTitle),
                color: banner.style.colorTitle,
              },
              children: title,
            }),
          /*#__PURE__*/ _jsx(Description, {
            style: {
              ...withDefaultFontFamily(banner.style.fontBody),
              color: banner.style.colorBody,
            },
            linkColor: linkColor,
            description: description,
            policy: policy,
          }),
        ],
      }),
      /*#__PURE__*/ _jsxs(Buttons, {
        direction: button.direction,
        children: [
          /*#__PURE__*/ _jsx(Button, {
            settings: button,
            onClick: onReject,
            id: "reject",
            children: button.labels.reject,
          }),
          /*#__PURE__*/ _jsx(Button, {
            settings: button,
            primary: true,
            onClick: onAccept,
            id: "accept",
            children: button.labels.accept,
          }),
        ],
      }),
    ],
  });
}
function OptionsBanner({
  banner,
  button,
  options,
  previewOptions,
  title,
  description,
  policy,
  showReject = true,
  linkColor,
  consent,
  onAcceptCurrent,
  onAcceptAll,
  onRejectAll,
  onOptionToggle,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const optionTheme = { ...options.style, color: banner.style.colorBody };
  const padding = banner.paddingPerSide
    ? `${banner.paddingTop}px ${banner.paddingRight}px ${banner.paddingBottom}px ${banner.paddingLeft}px`
    : `${banner.padding}px`; // const optionNames = consent && Object.keys(consent)
  const optionNames = ["necessary", "preferences", "analytics", "marketing"];
  const shouldShowOptions = showOptions || previewOptions;
  return /*#__PURE__*/ _jsxs("div", {
    style: { padding },
    children: [
      /*#__PURE__*/ _jsxs("div", {
        children: [
          title &&
            /*#__PURE__*/ _jsx(Headline, {
              style: {
                ...withDefaultFontFamily(banner.style.fontTitle),
                color: banner.style.colorTitle,
              },
              children: title,
            }),
          /*#__PURE__*/ _jsx(Description, {
            style: {
              ...withDefaultFontFamily(banner.style.fontBody),
              color: banner.style.colorBody,
            },
            linkColor: linkColor,
            description: description,
            policy: policy,
          }),
          /*#__PURE__*/ _jsx(AnimatePresence, {
            children:
              shouldShowOptions &&
              /*#__PURE__*/ _jsx(
                motion.div,
                {
                  initial: previewOptions ? null : { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  exit: { opacity: 0, height: 0 },
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginTop: SPACING,
                    overflow: "hidden",
                  },
                  children:
                    optionNames &&
                    optionNames.map((option) =>
                      /*#__PURE__*/ _jsx(Option, {
                        title: options[option].title,
                        description: options[option].description,
                        titleColor: banner.style.colorTitle,
                        descriptionColor: banner.style.colorBody,
                        showDescription: options.descriptions,
                        enabled: consent[option],
                        onClick: () => onOptionToggle(option),
                        theme: optionTheme,
                        optional:
                          option === "necessary"
                            ? options[option].optional
                            : true,
                      })
                    ),
                },
                "modal"
              ),
          }),
        ],
      }),
      /*#__PURE__*/ _jsx(Buttons, {
        direction: button.direction,
        children: shouldShowOptions
          ? /*#__PURE__*/ _jsx(Button, {
              settings: button,
              primary: true,
              onClick: onAcceptCurrent,
              id: "accept",
              children: button.labels.save,
            })
          : /*#__PURE__*/ _jsxs(_Fragment, {
              children: [
                showReject &&
                  /*#__PURE__*/ _jsx(Button, {
                    settings: button,
                    onClick: onRejectAll,
                    id: "reject",
                    children: button.labels.rejectAll,
                  }),
                /*#__PURE__*/ _jsx(Button, {
                  settings: button,
                  onClick: () => {
                    setShowOptions(true);
                  },
                  id: "customize",
                  children: button.labels.customize,
                }),
                /*#__PURE__*/ _jsx(Button, {
                  settings: button,
                  primary: true,
                  onClick: onAcceptAll,
                  id: "accept",
                  children: button.labels.acceptAll,
                }),
              ],
            }),
      }),
    ],
  });
}
function Option({
  title,
  titleColor,
  description,
  descriptionColor,
  showDescription,
  enabled,
  optional,
  onClick,
  theme,
}) {
  const paddingValue = theme.paddingPerSide
    ? `${theme.paddingTop}px ${theme.paddingRight}px ${theme.paddingBottom}px ${theme.paddingLeft}px`
    : `${theme.padding}px`;
  const borderShadow = theme.border
    ? `inset 0 0 0 ${theme.border.width}px ${theme.border.color}`
    : null;
  return /*#__PURE__*/ _jsxs(motion.div, {
    style: {
      boxShadow: borderShadow,
      background: theme.background,
      borderRadius: theme.border.radius,
      padding: paddingValue,
      cursor: "pointer",
      userSelect: "none",
      pointerEvents: "all",
    },
    onClick: onClick,
    whileHover: { opacity: 0.5 },
    children: [
      /*#__PURE__*/ _jsxs("div", {
        style: { display: "flex", justifyContent: "space-between" },
        children: [
          /*#__PURE__*/ _jsx("p", {
            style: {
              margin: 0,
              fontWeight: 600,
              fontSize: 12,
              color: titleColor,
              ...withDefaultFontFamily(theme.fontTitle),
            },
            children: title,
          }),
          optional
            ? /*#__PURE__*/ _jsx(Suspense, {
                fallback: null,
                children: /*#__PURE__*/ _jsx(Toggle, {
                  variant: enabled ? "On" : "Off",
                  background: theme.toggleColor,
                  backgroundInactive: theme.toggleColorInactive,
                  ariaLabel: `Toggle for ${title}`,
                }),
              })
            : /*#__PURE__*/ _jsx("p", {
                style: {
                  margin: 0,
                  fontSize: 12,
                  color: theme.toggleColor,
                  ...withDefaultFontFamily(theme.fontTitle),
                  fontWeight: 400,
                },
                children: "Always active",
              }),
        ],
      }),
      description &&
        /*#__PURE__*/ _jsx("p", {
          style: {
            margin: 0,
            marginTop: 10,
            fontSize: 12,
            lineHeight: 1.5,
            color: descriptionColor,
            ...withDefaultFontFamily(theme.fontBody),
          },
          children: description,
        }),
    ],
  });
}
function Headline({ children, style }) {
  return /*#__PURE__*/ _jsx("p", {
    style: {
      fontSize: 14,
      margin: "0px 0px 10px 0px",
      fontWeight: "bold",
      padding: 0,
      ...style,
    },
    children: children,
  });
}
function Description({ style, description, policy, linkColor }) {
  const shouldShow = description || policy?.link;
  if (!shouldShow) return null;
  if (!description) {
    return /*#__PURE__*/ _jsx(DescriptionParagraph, {
      policy: policy,
      style: style,
      linkColor: linkColor,
    });
  } // @ivan: Support rendering the description in multiple paragraphs.
  // This is a site speed optimization: it allows to split a single
  // huge <p> into several smaller ones, which prevents the huge <p>
  // from becoming an LCP element.
  const descriptionParagraphs = description?.split("\n\n");
  return description.split("\n\n").map((line, index) =>
    /*#__PURE__*/ _jsx(
      DescriptionParagraph,
      {
        line: line, // Only render the policy in the last paragraph
        policy: index === descriptionParagraphs.length - 1 ? policy : null,
        style: {
          // Add a spacing between paragraphs
          marginTop: index > 0 ? 4 : 0,
          ...style,
        },
        linkColor: linkColor,
      },
      index
    )
  );
}
function DescriptionParagraph({ line, policy, style, linkColor }) {
  return /*#__PURE__*/ _jsxs("p", {
    style: { lineHeight: 1.5, margin: 0, padding: 0, fontSize: 14, ...style },
    children: [
      line,
      line && policy?.link ? " " : null,
      policy?.link &&
        /*#__PURE__*/ _jsxs("span", {
          children: [
            policy?.prefix,
            " ",
            /*#__PURE__*/ _jsx("a", {
              href: policy?.link,
              target: "_blank",
              rel: "noopener noreferrer",
              style: { color: linkColor, textDecoration: "none" },
              children: policy?.label,
            }),
            ".",
          ],
        }),
    ],
  });
}
function Buttons({ children, direction }) {
  return /*#__PURE__*/ _jsx("div", {
    style: {
      display: "flex",
      flexDirection: direction,
      gap: 10,
      marginTop: 16,
    },
    children: children,
  });
}
const Button = withCSS(
  function Button({ id, children, primary, settings, onClick }) {
    const paddingValue = settings.paddingPerSide
      ? `${settings.paddingTop}px ${settings.paddingRight}px ${settings.paddingBottom}px ${settings.paddingLeft}px`
      : `${settings.padding}px`;
    const theme = primary ? settings.primary : settings.secondary;
    return /*#__PURE__*/ _jsx(motion.input, {
      className: "__framer-cookie-component-button",
      id: `__framer-cookie-component-button-${id}`,
      onClick: onClick,
      type: "button",
      value: `${children}`,
      whileHover: { opacity: settings.hoverOpacity ?? 0.6 },
      whileTap: { opacity: settings.tapOpacity ?? 0.4 },
      style: {
        WebkitAppearance: "none",
        appearance: "none",
        width: settings.fluid ? "100%" : "auto",
        height: "auto",
        border: "none",
        padding: paddingValue,
        borderRadius: settings.borderRadius,
        boxShadow: getShadow(theme.shadow),
        background: theme.fill,
        color: theme.color,
        fontSize: 14,
        lineHeight: 1,
        cursor: "pointer",
        fontWeight: settings.font ? "unset" : 600,
        ...withDefaultFontFamily(settings.font),
      },
    });
  },
  ".__framer-cookie-component-button:focus:not(:focus-visible){outline-color:transparent}",
  "framer-lib-cookie-banner"
);
function withDefaultFontFamily(style) {
  if (style?.fontFamily) return style;
  return { ...style, fontFamily: style?.fontFamily || DEFAULT_FONT_FAMILY };
}
export const __FramerMetadata__ = {
  exports: {
    BannerComponentProps: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    Banner: { type: "variable", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Banner.map
