// ⚠️⚠️⚠️⚠️⚠️
// Edit these files in https://github.com/framer/FramerCodeComponents
// ⚠️⚠️⚠️⚠️⚠️
import { useIsOnFramerCanvas } from "framer";
import { isBrowser } from "framer-motion";
import { useEffect, useReducer, useState, startTransition } from "react";
import {
  initGTM,
  sendToGTM,
} from "https://framerusercontent.com/modules/RFM6zI5MxOiqwwNiQep4/WSx8Z2UEK8nzkC3nXu7B/send.js";
import {
  safeJSONParse,
  yieldBeforeCb,
} from "https://framerusercontent.com/modules/tfq8EDfrazNLXzc9LJte/pK4oThhjjhllFVAwqFls/utils.js";
function toGTMConsent(consent) {
  return {
    functionality_storage: consent.necessary ? "granted" : "denied",
    security_storage: consent.necessary ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
    personalization_storage: consent.preferences ? "granted" : "denied",
  };
}
function fromGTMConsent(consent) {
  return {
    necessary:
      consent.functionality_storage === "granted" &&
      consent.security_storage === "granted",
    marketing:
      consent.ad_storage === "granted" &&
      consent.ad_user_data === "granted" &&
      consent.ad_personalization === "granted",
    analytics: consent.analytics_storage === "granted",
    preferences: consent.personalization_storage === "granted",
  };
}
function reducer(state, action) {
  switch (action.type) {
    case "autoAccept":
      return {
        ...state,
        sync: true,
        autoAccepted: true,
        modes: {
          analytics: true,
          marketing: true,
          necessary: true,
          preferences: true,
        },
      };
    case "acceptAll":
      return {
        ...state,
        sync: true,
        dismissed: true,
        modes: {
          analytics: true,
          marketing: true,
          necessary: true,
          preferences: true,
        },
      };
    case "rejectAll":
      return {
        ...state,
        sync: true,
        dismissed: true,
        modes: {
          analytics: false,
          marketing: false,
          necessary: false,
          preferences: false,
        },
      };
    case "acceptCurrent":
      return { ...state, dismissed: true, sync: true };
    case "update":
      return {
        ...state,
        modes: { ...state.modes, ...action.modes },
        sync: action.sync,
      };
    case "toggle":
      return {
        ...state,
        modes: { ...state.modes, [action.mode]: !state.modes[action.mode] },
      };
    case "initFromLocalStorage":
      return {
        ...state,
        modes: action.modes,
        dismissed: action.dismissed,
        autoAccepted: action.autoAccepted,
        initializedFromLocalStorage: true,
        sync: true,
      };
    case "initFromGTM":
      return { ...state, modes: action.modes, initializedFromGTM: true };
    case "dismiss":
      return { ...state, dismissed: true };
    case "synced":
      return {
        ...state,
        sync: false,
        hasSynced: state.hasSynced || action.success,
      };
    default:
      return state;
  }
}
export const defaultConsent = {
  necessary: false,
  analytics: false,
  marketing: false,
  preferences: false,
};
const initialState = {
  dismissed: false,
  autoAccepted: false,
  modes: defaultConsent,
  sync: false,
  initializedFromLocalStorage: false,
  initializedFromGTM: false,
  hasSynced: false,
}; // Keep track of if GTM has been loaded as a script and default consent has been set,
// to ensure the script does not keep appending between page switches.
let hasInitializedGTM = false;
export function useConsent({
  gtmId,
  defaultConsent,
  gtmLoadedExternally = false,
  defaultsFromGTM = false,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isOnFramerCanvas = useIsOnFramerCanvas();
  const consentModeLocalStorageKey = "framerCookiesConsentMode";
  const dismissedLocalStorageKey = "framerCookiesDismissed";
  const autoAcceptedLocalStorageKey = "framerCookiesAutoAccepted";
  function getStateFromLocalStorage() {
    const consentFromLocalStorage = localStorage.getItem(
      consentModeLocalStorageKey
    );
    const dismissedFromLocalStorage = localStorage.getItem(
      dismissedLocalStorageKey
    );
    const autoAcceptedFromLocalStorage = localStorage.getItem(
      autoAcceptedLocalStorageKey
    );
    const isDismissed = dismissedFromLocalStorage !== null;
    const isAutoAccepted = autoAcceptedFromLocalStorage !== null;
    const hasConsentInLocalStorage = consentFromLocalStorage !== null;
    const consentInLocalStorageIsNotDefault = isDismissed || isAutoAccepted;
    const shouldLoadConsentFromLocalStorage =
      hasConsentInLocalStorage && consentInLocalStorageIsNotDefault;
    dispatch({
      type: "initFromLocalStorage",
      dismissed: isDismissed,
      autoAccepted: isAutoAccepted,
      modes: shouldLoadConsentFromLocalStorage
        ? safeJSONParse(consentFromLocalStorage, () =>
            localStorage.removeItem(consentModeLocalStorageKey)
          ) ?? defaultConsent
        : defaultConsent,
    });
  }
  function syncToGTM() {
    if (gtmId) {
      if (!hasInitializedGTM && !gtmLoadedExternally && !defaultsFromGTM) {
        // This is the first time we sync consent, so we save it as "default" and initialize tag manager.
        // This order is important, because we need to have set the default consent BEFORE we initialize
        // GTM. See https://developers.google.com/tag-platform/devguides/consent?tab=tag-manager&sjid=11348191096952324675-EU#implementation_example
        // It might seem weird that we're "sending" before initializing, but "sending" here means building up
        // the "dataLayer" object that GTM picks up when it initializes.
        sendToGTM("consent", "default", toGTMConsent(state.modes));
        initGTM({
          dataLayer: undefined,
          dataLayerName: "dataLayer",
          environment: undefined,
          nonce: undefined,
          injectScript: true,
          id: gtmId,
        });
        hasInitializedGTM = true;
      } else {
        hasInitializedGTM = true;
        sendToGTM("consent", "update", toGTMConsent(state.modes)); // must be sent like this or else GTM doesn't act on it(?)
        // Publically documented: https://www.framer.com/academy/lessons/cookie-banner-component#:~:text=Run%20a%20Tag%20After%20The%20Consent%20Update
        window.dataLayer.push({ event: "cookie_consent_update" });
      }
    }
  }
  useEffect(() => {
    if (isOnFramerCanvas) return;
    if (!defaultsFromGTM) return;
    if (defaultConsent === null) return;
    if (state.initializedFromGTM) return;
    if (state.modes !== null) return; // State was already set (from localStorage)
    yieldBeforeCb(
      () => {
        dispatch({ type: "initFromGTM", modes: defaultConsent });
      },
      { priority: "user-blocking" }
    );
  }, [defaultsFromGTM, defaultConsent, state.initializedFromGTM, state.modes]);
  useEffect(() => {
    if (isOnFramerCanvas) return;
    yieldBeforeCb(() => getStateFromLocalStorage(), {
      priority: "user-blocking",
    });
  }, []); // Anytime the dismissed value is updated, we need to persist it in local storage.
  useEffect(() => {
    if (isOnFramerCanvas) return;
    if (state.dismissed) {
      localStorage.setItem(dismissedLocalStorageKey, "true");
    }
  }, [state.dismissed]); // Anytime consent is auto accepted, we need to persist it in local storage.
  useEffect(() => {
    if (isOnFramerCanvas) return;
    if (state.autoAccepted) {
      localStorage.setItem(autoAcceptedLocalStorageKey, "true");
    }
  }, [state.autoAccepted]); // Sync data to dataLayer and localStorage.
  useEffect(() => {
    if (isOnFramerCanvas) return;
    if (!state.sync) return;
    const shouldSync = isBrowser && state.modes !== null;
    yieldBeforeCb(
      () => {
        if (!shouldSync) {
          dispatch({ type: "synced", success: false });
          return;
        } // else
        syncToGTM(); // Save locally
        localStorage.setItem(
          consentModeLocalStorageKey,
          JSON.stringify(state.modes)
        );
        dispatch({ type: "synced", success: true });
      },
      { priority: "user-blocking" }
    );
  }, [state.sync, state.modes]);
  function dismiss() {
    dispatch({ type: "dismiss" });
    localStorage.setItem(dismissedLocalStorageKey, "true");
  }
  function autoAccept() {
    dispatch({ type: "autoAccept" });
  }
  function acceptAll() {
    dispatch({ type: "acceptAll" });
  }
  function rejectAll() {
    dispatch({ type: "rejectAll" });
  }
  function acceptCurrent() {
    dispatch({ type: "acceptCurrent" });
  }
  function toggleMode(mode) {
    dispatch({ type: "toggle", mode });
  }
  return {
    modes: state.modes,
    isInitialized: state.hasSynced || state.initializedFromGTM,
    isDismissed: state.dismissed,
    isAutoAccepted: state.autoAccepted,
    dismiss,
    autoAccept,
    acceptAll,
    rejectAll,
    acceptCurrent,
    toggleMode,
  };
} ////////////////////////////////////////////////////////////////////////////////
const PROMISE_NAME = "__framer_cookieBannerDefaultConsentPromise"; // NOTE: Error can be ignored, because of `isBrowser`
const gtmSetsDefaultConsent = isBrowser && !!window[PROMISE_NAME];
export function useGTMDefaultConsent() {
  const [consent, setConsent] = useState(null);
  useEffect(() => {
    if (!gtmSetsDefaultConsent) return;
    window[PROMISE_NAME].then((result) => {
      startTransition(() => {
        setConsent(result);
      });
    });
  }, []); // Simplified region to use for the cookie banner
  let region;
  if (consent) {
    region = Object.values(consent).every((v) => v === "granted")
      ? "World"
      : "EU";
  }
  return {
    available: gtmSetsDefaultConsent,
    consent: consent ? fromGTMConsent(consent) : null,
    region,
  };
}
export const __FramerMetadata__ = {
  exports: {
    useConsent: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    ConsentModes: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    defaultConsent: {
      type: "variable",
      annotations: { framerContractVersion: "1" },
    },
    useGTMDefaultConsent: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    ConsentModeName: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
