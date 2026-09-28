// ⚠️⚠️⚠️⚠️⚠️
// Edit these files in https://github.com/framer/FramerCodeComponents
// ⚠️⚠️⚠️⚠️⚠️
// Check if visitor is in EU
const countries = [
  "AI",
  "AT",
  "AW",
  "AX",
  "BE",
  "BG",
  "BL",
  "BM",
  "CW",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "EL",
  "ES",
  "FI",
  "FK",
  "FO",
  "FR",
  "GB",
  "GF",
  "GG",
  "GI",
  "GL",
  "GP",
  "HR",
  "HU",
  "IE",
  "IM",
  "IO",
  "IT",
  "JE",
  "KY",
  "LT",
  "LU",
  "LV",
  "MF",
  "MQ",
  "MS",
  "MT",
  "NC",
  "NL",
  "PF",
  "PL",
  "PM",
  "PN",
  "PT",
  "RE",
  "RO",
  "SE",
  "SH",
  "SI",
  "SK",
  "SX",
  "TC",
  "UK",
  "VG",
  "WF",
  "YT",
];
const isInEUTimezone = () => {
  return Intl?.DateTimeFormat()
    ?.resolvedOptions()
    ?.timeZone?.startsWith("Europe");
};
const isEULocale = () => {
  const locale = navigator.language ?? navigator.languages?.[0];
  return countries.some((country) => locale?.toUpperCase()?.includes(country));
};
let _inEU = null;
export const inEU = () => {
  if (_inEU === null) _inEU = isInEUTimezone() || isEULocale();
  return _inEU;
};
export const __FramerMetadata__ = {
  exports: {
    inEU: { type: "variable", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./inEU.map
