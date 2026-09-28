export const navigator =
  typeof document !== "undefined" ? globalThis.navigator : undefined;
export const window =
  typeof document !== "undefined" ? globalThis.window : undefined;
export const global = typeof document === "undefined" ? {} : undefined;
if (typeof document === "undefined") {
  const originalObjectToString = Object.prototype.toString;
  Object.prototype.toString = function (...args) {
    return this === global
      ? "[object global]"
      : originalObjectToString.call(this, ...args);
  };
}
