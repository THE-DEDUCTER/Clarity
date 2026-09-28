// ⚠️⚠️⚠️⚠️⚠️
// Edit these files in https://github.com/framer/FramerCodeComponents
// ⚠️⚠️⚠️⚠️⚠️
import { isBrowser } from "framer-motion";
export const DEFAULT_DOMAIN = "https://www.googletagmanager.com";
export const DEFAULT_SCRIPT_NAME = "gtm.js";
/**
 * Function to get and set dataLayer
 * @param dataLayer - The dataLayer
 * @param dataLayerName - The dataLayer name
 */ const getDataLayerSnippet = (dataLayer, dataLayerName = "dataLayer") =>
  `window['${dataLayerName}']=window['${dataLayerName}']||[];` +
  (dataLayer
    ? `window['${dataLayerName}'].push(${JSON.stringify(dataLayer)});`
    : "") +
  `window['${dataLayerName}'].push({'gtm.start':new Date().getTime(),event:'gtm.js'})`;
/**
 * Function to get the GTM script
 * @param dataLayerName - The name of the dataLayer
 * @param customDomain - Custom domain for gtm
 * @param customScriptName - Custom script file name for gtm
 * @param environment - The parameters to use a custom environment
 * @param id - The id of the container
 */ const getGTMScript = (
  dataLayerName,
  id,
  environment,
  customDomain = DEFAULT_DOMAIN,
  customScriptName = DEFAULT_SCRIPT_NAME
) => {
  let params = "";
  if (environment) {
    const { gtm_auth, gtm_preview } = environment;
    params = `&gtm_auth=${gtm_auth}&gtm_preview=${gtm_preview}&gtm_cookies_win=x`;
  }
  return `${customDomain}/${customScriptName}?id=${id}${
    dataLayerName === "dataLayer" ? "" : `&l=${dataLayerName}`
  }${params}`;
};
/**
 * Function to setup the Google Tag Manager
 * @param params - The snippets params
 */ const setupGTM = (params) => {
  const getDataLayerScript = () => {
    const dataLayerScript = document.createElement("script");
    if (params.nonce) {
      dataLayerScript.setAttribute("nonce", params.nonce);
    }
    dataLayerScript.innerHTML = getDataLayerSnippet(
      params.dataLayer,
      params.dataLayerName
    );
    return dataLayerScript;
  };
  const getScript = () => {
    const script = document.createElement("script");
    if (params.nonce) {
      script.setAttribute("nonce", params.nonce);
    }
    script.src = getGTMScript(
      params.dataLayerName,
      params.id,
      params.environment,
      params.customDomain,
      params.customScriptName
    );
    script.crossOrigin = "anonymous"; // allows for more detailed INP collection
    return script;
  };
  return { getDataLayerScript, getScript };
};
/**
 * Function to init the GTM
 * @param dataLayer - The dataLayer
 * @param dataLayerName - The dataLayer name
 * @param environment - Specify the custom environment to use
 * @param nonce - Server-generated nonce
 * @param id - The ID of the GTM
 */ export const initGTM = ({
  dataLayer,
  dataLayerName,
  environment,
  nonce,
  id,
  customDomain,
  customScriptName,
}) => {
  const gtm = setupGTM({
    dataLayer,
    dataLayerName,
    environment,
    nonce,
    id,
    customDomain,
    customScriptName,
  });
  const dataLayerScript = gtm.getDataLayerScript();
  const script = gtm.getScript();
  document.head.append(dataLayerScript, script);
};
export function sendToGTM() {
  if (isBrowser) {
    window["dataLayer"] = window["dataLayer"] || [];
    window["dataLayer"].push(arguments);
  }
}
export const __FramerMetadata__ = {
  exports: {
    DEFAULT_DOMAIN: {
      type: "variable",
      annotations: { framerContractVersion: "1" },
    },
    DEFAULT_SCRIPT_NAME: {
      type: "variable",
      annotations: { framerContractVersion: "1" },
    },
    sendToGTM: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    initGTM: { type: "variable", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./send.map
