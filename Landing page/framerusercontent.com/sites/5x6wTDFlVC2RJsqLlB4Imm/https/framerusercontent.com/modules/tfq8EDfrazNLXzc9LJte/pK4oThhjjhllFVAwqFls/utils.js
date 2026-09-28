// ⚠️⚠️⚠️⚠️⚠️
// Edit these files in https://github.com/framer/FramerCodeComponents
// ⚠️⚠️⚠️⚠️⚠️
import { useLayoutEffect } from "react";
export const DEFAULT_FONT_FAMILY = `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;
export function getFlexboxValues(position) {
  const positionParts = position.split("-");
  let justifyContent, alignItems;
  switch (positionParts[0]) {
    case "top":
      alignItems = "flex-start";
      break;
    case "bottom":
      alignItems = "flex-end";
      break;
    case "center":
      alignItems = "center";
      break;
    default:
      alignItems = "initial";
      break;
  }
  switch (positionParts[1]) {
    case "left":
      justifyContent = "flex-start";
      break;
    case "right":
      justifyContent = "flex-end";
      break;
    case "center":
      justifyContent = "center";
      break;
    default:
      justifyContent = "initial";
      break;
  }
  return { justifyContent, alignItems };
}
export function getMultipleShadows(...shadows) {
  const output = [];
  shadows.forEach((shadow) => {
    return shadow && output.push(shadow);
  });
  return output.join(", ");
}
export function getShadow(shadow) {
  if (shadow) {
    return `${shadow.shadowX}px ${shadow.shadowY}px ${shadow.shadowBlur}px ${shadow.shadowColor}`;
  } else return null;
}
export function safeJSONParse(jsonString, onError) {
  try {
    return JSON.parse(jsonString);
  } catch {
    if (onError) onError();
  }
}
/**
 * Yields to main thread before continuing execution, which might allow the browser to paint.
 * If `options.priority` is 'user-blocking', it will asynchronously resolve in older browsers.
 * @param {object} options - see https://github.com/WICG/scheduling-apis/blob/main/explainers/yield-and-continuation.md
 * @see interactionResponse for guaranteeing execution after a paint
 */ export function yieldToMain(options) {
  if ("scheduler" in window) {
    if ("yield" in scheduler) return scheduler.yield(options);
    if ("postTask" in scheduler) return scheduler.postTask(() => {}, options);
  }
  if (options?.priority === "user-blocking") {
    // `setTimeout` could suffer from being delayed for longer: https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial#the_problem_with_current_yielding_strategies
    // so for browsers not supporting yield, we guarantee execution for high priority actions, but this does not create space for a paint opportunity as trade-off.
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(resolve);
  });
}
/**
 * Helper function for `yieldToMain`, which yields before calling `fn`.
 * @see yieldToMain
 */ export async function yieldBeforeCb(fn, options) {
  await yieldToMain(options);
  return fn();
}
/**
 * Similar to `yieldToMain`, but also waits for the next animation frame before yielding (with a fallback of 100ms if the animation frame never fires).
 * Compared to `yieldToMain`, it guarantees improved INP, but might make processing a little slower. Use only if necessary.
 * @see yieldToMain
 */ export function interactionResponse(options) {
  return new Promise((resolve) => {
    setTimeout(resolve, 200); // Fallback for the case where the animation frame never fires.
    requestAnimationFrame(() => {
      void yieldBeforeCb(resolve, options);
    });
  });
}
/**
 * Runs `fn` after the next paint. Similar to `useEffect`, but *guarantees* that the function is run after the next paint.
 * @important Does not support a cleanup fn.
 * @see https://thoughtspile.github.io/2021/11/15/unintentional-layout-effect/
 */ export function useAfterPaintEffect(fn, deps, options) {
  useLayoutEffect(() => {
    const runAfterPaint = async () => {
      await interactionResponse(options);
      fn();
    };
    void runAfterPaint(); // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are passed in
  }, deps);
}
export const __FramerMetadata__ = {
  exports: {
    FlexboxPosition: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    interactionResponse: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    yieldToMain: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    getMultipleShadows: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    getFlexboxValues: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    getShadow: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    useAfterPaintEffect: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    safeJSONParse: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    DEFAULT_FONT_FAMILY: {
      type: "variable",
      annotations: { framerContractVersion: "1" },
    },
    yieldBeforeCb: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./utils.map
