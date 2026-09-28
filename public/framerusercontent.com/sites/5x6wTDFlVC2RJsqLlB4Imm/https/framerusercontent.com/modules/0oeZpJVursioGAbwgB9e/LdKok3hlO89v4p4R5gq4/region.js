// ⚠️⚠️⚠️⚠️⚠️
// Edit these files in https://github.com/framer/FramerCodeComponents
// ⚠️⚠️⚠️⚠️⚠️
import { isBrowser } from "framer-motion";
import { inEU } from "https://framerusercontent.com/modules/HKzIAGtbudIGLRAteuFH/Puy217ziAIZRqHk4rVRu/inEU.js";
export function useRegion({
  content,
  useRegionFromProps,
  skipEUCheck,
  regionFromGTM,
}) {
  const isInEUBasedOnLocation =
    isBrowser && !skipEUCheck && !regionFromGTM ? inEU() : false;
  const regionBasedOnLocation = isInEUBasedOnLocation ? "EU" : "World";
  const regionFromProps = content.isEU ? "EU" : "World";
  const regionContent = {
    EU: {
      title: content.euTitle,
      description: content.euDescription,
      type: content.euType,
      defaults: content.euDefaults,
      policy: content.euPolicy,
      blocking: content.euBlocking,
      showReject: content.euType === "advanced" ? content.euShowReject : true,
    },
    World: {
      title: content.worldTitle,
      description: content.worldDescription,
      type: content.worldType,
      defaults: content.worldDefaults,
      policy: content.worldPolicy,
      blocking: content.worldBlocking,
      showReject:
        content.worldType === "advanced" ? content.worldShowReject : true,
    },
  };
  return regionContent[
    regionFromGTM
      ? regionFromGTM
      : useRegionFromProps
      ? regionFromProps
      : regionBasedOnLocation
  ];
}
export const __FramerMetadata__ = {
  exports: {
    RegionType: { type: "tsType", annotations: { framerContractVersion: "1" } },
    RegionContent: {
      type: "tsType",
      annotations: { framerContractVersion: "1" },
    },
    useRegion: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
