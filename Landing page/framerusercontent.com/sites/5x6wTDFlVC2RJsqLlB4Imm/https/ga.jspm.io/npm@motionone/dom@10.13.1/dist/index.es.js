import { MotionValue as e } from "@motionone/types";
import {
  noopReturn as t,
  addUniqueItem as n,
  progress as o,
  isFunction as i,
  defaults as s,
  isCubicBezier as r,
  isEasingGenerator as a,
  isEasingList as c,
  isNumber as l,
  time as f,
  noop as u,
  removeItem as d,
  mix as g,
  getEasingForSegment as m,
  isString as h,
  defaultOffset as p,
  fillOffset as v,
  velocityPerSecond as y,
  interpolate as w,
} from "@motionone/utils";
import { Animation as E, getEasingFunction as b } from "@motionone/animation";
import { __rest as S } from "tslib";
import { invariant as A } from "hey-listen";
import {
  pregenerateKeyframes as O,
  calcGeneratorVelocity as x,
  spring as V,
  glide as z,
} from "@motionone/generators";
const W = new WeakMap();
function getAnimationData(e) {
  W.has(e) || W.set(e, { transforms: [], values: new Map() });
  return W.get(e);
}
function getMotionValue(t, n) {
  t.has(n) || t.set(n, new e());
  return t.get(n);
}
const L = ["", "X", "Y", "Z"];
const T = ["translate", "scale", "rotate", "skew"];
const D = { x: "translateX", y: "translateY", z: "translateZ" };
const M = {
  syntax: "<angle>",
  initialValue: "0deg",
  toDefaultUnit: (e) => e + "deg",
};
const k = {
  translate: {
    syntax: "<length-percentage>",
    initialValue: "0px",
    toDefaultUnit: (e) => e + "px",
  },
  rotate: M,
  scale: { syntax: "<number>", initialValue: 1, toDefaultUnit: t },
  skew: M,
};
const B = new Map();
const asTransformCssVar = (e) => `--motion-${e}`;
const j = ["x", "y", "z"];
T.forEach((e) => {
  L.forEach((t) => {
    j.push(e + t);
    B.set(asTransformCssVar(e + t), k[e]);
  });
});
const compareTransformOrder = (e, t) => j.indexOf(e) - j.indexOf(t);
const P = new Set(j);
const isTransform = (e) => P.has(e);
const addTransformToElement = (e, t) => {
  D[t] && (t = D[t]);
  const { transforms: o } = getAnimationData(e);
  n(o, t);
  e.style.transform = buildTransformTemplate(o);
};
const buildTransformTemplate = (e) =>
  e.sort(compareTransformOrder).reduce(transformListToString, "").trim();
const transformListToString = (e, t) =>
  `${e} ${t}(var(${asTransformCssVar(t)}))`;
const isCssVar = (e) => e.startsWith("--");
const $ = new Set();
function registerCssVariable(e) {
  if (!$.has(e)) {
    $.add(e);
    try {
      const { syntax: t, initialValue: n } = B.has(e) ? B.get(e) : {};
      CSS.registerProperty({
        name: e,
        inherits: false,
        syntax: t,
        initialValue: n,
      });
    } catch (e) {}
  }
}
const testAnimation = (e, t) => document.createElement("div").animate(e, t);
const C = {
  cssRegisterProperty: () =>
    "undefined" !== typeof CSS &&
    Object.hasOwnProperty.call(CSS, "registerProperty"),
  waapi: () => Object.hasOwnProperty.call(Element.prototype, "animate"),
  partialKeyframes: () => {
    try {
      testAnimation({ opacity: [1] });
    } catch (e) {
      return false;
    }
    return true;
  },
  finished: () =>
    Boolean(testAnimation({ opacity: [0, 1] }, { duration: 0.001 }).finished),
  linearEasing: () => {
    try {
      testAnimation({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch (e) {
      return false;
    }
    return true;
  },
};
const R = {};
const H = {};
for (const e in C)
  H[e] = () => {
    void 0 === R[e] && (R[e] = C[e]());
    return R[e];
  };
const I = 0.015;
const generateLinearEasingPoints = (e, t) => {
  let n = "";
  const i = Math.round(t / I);
  for (let t = 0; t < i; t++) n += e(o(0, i - 1, t)) + ", ";
  return n.substring(0, n.length - 2);
};
const convertEasing = (e, t) =>
  i(e)
    ? H.linearEasing()
      ? `linear(${generateLinearEasingPoints(e, t)})`
      : s.easing
    : r(e)
    ? cubicBezierAsString(e)
    : e;
const cubicBezierAsString = ([e, t, n, o]) =>
  `cubic-bezier(${e}, ${t}, ${n}, ${o})`;
function hydrateKeyframes(e, t) {
  for (let n = 0; n < e.length; n++)
    null === e[n] && (e[n] = n ? e[n - 1] : t());
  return e;
}
const keyframesList = (e) => (Array.isArray(e) ? e : [e]);
function getStyleName(e) {
  D[e] && (e = D[e]);
  return isTransform(e) ? asTransformCssVar(e) : e;
}
const N = {
  get: (e, t) => {
    t = getStyleName(t);
    let n = isCssVar(t) ? e.style.getPropertyValue(t) : getComputedStyle(e)[t];
    if (!n && 0 !== n) {
      const e = B.get(t);
      e && (n = e.initialValue);
    }
    return n;
  },
  set: (e, t, n) => {
    t = getStyleName(t);
    isCssVar(t) ? e.style.setProperty(t, n) : (e.style[t] = n);
  },
};
function stopAnimation(e, t = true) {
  if (e && "finished" !== e.playState)
    try {
      if (e.stop) e.stop();
      else {
        t && e.commitStyles();
        e.cancel();
      }
    } catch (e) {}
}
function getDevToolsRecord() {
  return window.__MOTION_DEV_TOOLS_RECORD;
}
function animateStyle(e, t, n, o = {}) {
  const r = getDevToolsRecord();
  const d = false !== o.record && r;
  let g;
  let {
    duration: m = s.duration,
    delay: h = s.delay,
    endDelay: p = s.endDelay,
    repeat: v = s.repeat,
    easing: y = s.easing,
    direction: w,
    offset: b,
    allowWebkitAcceleration: S = false,
  } = o;
  const A = getAnimationData(e);
  const O = isTransform(t);
  let x = H.waapi();
  O && addTransformToElement(e, t);
  const V = getStyleName(t);
  const z = getMotionValue(A.values, V);
  const W = B.get(V);
  stopAnimation(z.animation, !(a(y) && z.generator) && false !== o.record);
  return () => {
    const readInitialValue = () => {
      var t, n;
      return null !==
        (n =
          null !== (t = N.get(e, V)) && void 0 !== t
            ? t
            : null === W || void 0 === W
            ? void 0
            : W.initialValue) && void 0 !== n
        ? n
        : 0;
    };
    let s = hydrateKeyframes(keyframesList(n), readInitialValue);
    if (a(y)) {
      const e = y.createAnimation(s, readInitialValue, O, V, z);
      y = e.easing;
      void 0 !== e.keyframes && (s = e.keyframes);
      void 0 !== e.duration && (m = e.duration);
    }
    isCssVar(V) &&
      (H.cssRegisterProperty() ? registerCssVariable(V) : (x = false));
    O && !H.linearEasing() && (i(y) || (c(y) && y.some(i))) && (x = false);
    if (x) {
      W && (s = s.map((e) => (l(e) ? W.toDefaultUnit(e) : e)));
      1 !== s.length ||
        (H.partialKeyframes() && !d) ||
        s.unshift(readInitialValue());
      const t = {
        delay: f.ms(h),
        duration: f.ms(m),
        endDelay: f.ms(p),
        easing: c(y) ? void 0 : convertEasing(y, m),
        direction: w,
        iterations: v + 1,
        fill: "both",
      };
      g = e.animate(
        {
          [V]: s,
          offset: b,
          easing: c(y) ? y.map((e) => convertEasing(e, m)) : void 0,
        },
        t
      );
      g.finished ||
        (g.finished = new Promise((e, t) => {
          g.onfinish = e;
          g.oncancel = t;
        }));
      const n = s[s.length - 1];
      g.finished
        .then(() => {
          N.set(e, V, n);
          g.cancel();
        })
        .catch(u);
      S || (g.playbackRate = 1.000001);
    } else if (O) {
      s = s.map((e) => ("string" === typeof e ? parseFloat(e) : e));
      1 === s.length && s.unshift(parseFloat(readInitialValue()));
      const render = (t) => {
        W && (t = W.toDefaultUnit(t));
        N.set(e, V, t);
      };
      g = new E(
        render,
        s,
        Object.assign(Object.assign({}, o), { duration: m, easing: y })
      );
    } else {
      const t = s[s.length - 1];
      N.set(e, V, W && l(t) ? W.toDefaultUnit(t) : t);
    }
    d &&
      r(
        e,
        t,
        s,
        { duration: m, delay: h, easing: y, repeat: v, offset: b },
        "motion-one"
      );
    z.setAnimation(g);
    return g;
  };
}
const getOptions = (e, t) =>
  e[t] ? Object.assign(Object.assign({}, e), e[t]) : Object.assign({}, e);
function resolveElements(e, t) {
  var n;
  if ("string" === typeof e)
    if (t) {
      null !== (n = t[e]) && void 0 !== n
        ? n
        : (t[e] = document.querySelectorAll(e));
      e = t[e];
    } else e = document.querySelectorAll(e);
  else e instanceof Element && (e = [e]);
  return Array.from(e || []);
}
const createAnimation = (e) => e();
const withControls = (e, t, n = s.duration) =>
  new Proxy(
    {
      animations: e.map(createAnimation).filter(Boolean),
      duration: n,
      options: t,
    },
    F
  );
const getActiveAnimation = (e) => e.animations[0];
const F = {
  get: (e, t) => {
    const n = getActiveAnimation(e);
    switch (t) {
      case "duration":
        return e.duration;
      case "currentTime":
        return f.s((null === n || void 0 === n ? void 0 : n[t]) || 0);
      case "playbackRate":
      case "playState":
        return null === n || void 0 === n ? void 0 : n[t];
      case "finished":
        e.finished ||
          (e.finished = Promise.all(e.animations.map(selectFinished)).catch(u));
        return e.finished;
      case "stop":
        return () => {
          e.animations.forEach((e) => stopAnimation(e));
        };
      case "forEachNative":
        return (t) => {
          e.animations.forEach((n) => t(n, e));
        };
      default:
        return "undefined" ===
          typeof (null === n || void 0 === n ? void 0 : n[t])
          ? void 0
          : () => e.animations.forEach((e) => e[t]());
    }
  },
  set: (e, t, n) => {
    switch (t) {
      case "currentTime":
        n = f.ms(n);
      case "currentTime":
      case "playbackRate":
        for (let o = 0; o < e.animations.length; o++) e.animations[o][t] = n;
        return true;
    }
    return false;
  },
};
const selectFinished = (e) => e.finished;
function stagger(e = 0.1, { start: t = 0, from: n = 0, easing: o } = {}) {
  return (i, s) => {
    const r = l(n) ? n : getFromIndex(n, s);
    const a = Math.abs(r - i);
    let c = e * a;
    if (o) {
      const t = s * e;
      const n = b(o);
      c = n(c / t) * t;
    }
    return t + c;
  };
}
function getFromIndex(e, t) {
  if ("first" === e) return 0;
  {
    const n = t - 1;
    return "last" === e ? n : n / 2;
  }
}
function resolveOption(e, t, n) {
  return i(e) ? e(t, n) : e;
}
function animate(e, t, n = {}) {
  e = resolveElements(e);
  const o = e.length;
  const i = [];
  for (let s = 0; s < o; s++) {
    const r = e[s];
    for (const e in t) {
      const a = getOptions(n, e);
      a.delay = resolveOption(a.delay, s, o);
      const c = animateStyle(r, e, t[e], a);
      i.push(c);
    }
  }
  return withControls(i, n, n.duration);
}
function calcNextTime(e, t, n, o) {
  var i;
  return l(t)
    ? t
    : t.startsWith("-") || t.startsWith("+")
    ? Math.max(0, e + parseFloat(t))
    : "<" === t
    ? n
    : null !== (i = o.get(t)) && void 0 !== i
    ? i
    : e;
}
function eraseKeyframes(e, t, n) {
  for (let o = 0; o < e.length; o++) {
    const i = e[o];
    if (i.at > t && i.at < n) {
      d(e, i);
      o--;
    }
  }
}
function addKeyframes(e, t, n, o, i, s) {
  eraseKeyframes(e, i, s);
  for (let r = 0; r < t.length; r++)
    e.push({ value: t[r], at: g(i, s, o[r]), easing: m(n, r) });
}
function compareByTime(e, t) {
  return e.at === t.at ? (null === e.value ? 1 : -1) : e.at - t.at;
}
function timeline(e, t = {}) {
  var n;
  const o = createAnimationsFromTimeline(e, t);
  const i = o.map((e) => animateStyle(...e)).filter(Boolean);
  return withControls(
    i,
    t,
    null === (n = o[0]) || void 0 === n ? void 0 : n[3].duration
  );
}
function createAnimationsFromTimeline(e, t = {}) {
  var { defaultOptions: n = {} } = t,
    i = S(t, ["defaultOptions"]);
  const r = [];
  const c = new Map();
  const l = {};
  const f = new Map();
  let u = 0;
  let d = 0;
  let g = 0;
  for (let t = 0; t < e.length; t++) {
    const o = e[t];
    if (h(o)) {
      f.set(o, d);
      continue;
    }
    if (!Array.isArray(o)) {
      f.set(o.name, calcNextTime(d, o.at, u, f));
      continue;
    }
    const [i, r, m = {}] = o;
    void 0 !== m.at && (d = calcNextTime(d, m.at, u, f));
    let y = 0;
    const w = resolveElements(i, l);
    const E = w.length;
    for (let e = 0; e < E; e++) {
      const t = w[e];
      const o = getElementSequence(t, c);
      for (const t in r) {
        const i = getValueSequence(t, o);
        let c = keyframesList(r[t]);
        const l = getOptions(m, t);
        let {
          duration: f = n.duration || s.duration,
          easing: u = n.easing || s.easing,
        } = l;
        if (a(u)) {
          const e = isTransform(t);
          A(
            2 === c.length || !e,
            "spring must be provided 2 keyframes within timeline"
          );
          const n = u.createAnimation(c, () => "0", e);
          u = n.easing;
          void 0 !== n.keyframes && (c = n.keyframes);
          void 0 !== n.duration && (f = n.duration);
        }
        const h = resolveOption(m.delay, e, E) || 0;
        const w = d + h;
        const b = w + f;
        let { offset: S = p(c.length) } = l;
        1 === S.length && 0 === S[0] && (S[1] = 1);
        const O = length - c.length;
        O > 0 && v(S, O);
        1 === c.length && c.unshift(null);
        addKeyframes(i, c, u, S, w, b);
        y = Math.max(h + f, y);
        g = Math.max(b, g);
      }
    }
    u = d;
    d += y;
  }
  c.forEach((e, t) => {
    for (const a in e) {
      const c = e[a];
      c.sort(compareByTime);
      const l = [];
      const f = [];
      const u = [];
      for (let e = 0; e < c.length; e++) {
        const { at: t, value: n, easing: i } = c[e];
        l.push(n);
        f.push(o(0, g, t));
        u.push(i || s.easing);
      }
      if (0 !== f[0]) {
        f.unshift(0);
        l.unshift(l[0]);
        u.unshift("linear");
      }
      if (1 !== f[f.length - 1]) {
        f.push(1);
        l.push(null);
      }
      r.push([
        t,
        a,
        l,
        Object.assign(
          Object.assign(Object.assign({}, n), {
            duration: g,
            easing: u,
            offset: f,
          }),
          i
        ),
      ]);
    }
  });
  return r;
}
function getElementSequence(e, t) {
  !t.has(e) && t.set(e, {});
  return t.get(e);
}
function getValueSequence(e, t) {
  t[e] || (t[e] = []);
  return t[e];
}
function createGeneratorEasing(e) {
  const t = new WeakMap();
  return (n = {}) => {
    const o = new Map();
    const getGenerator = (t = 0, i = 100, s = 0, r = false) => {
      const a = `${t}-${i}-${s}-${r}`;
      o.has(a) ||
        o.set(
          a,
          e(
            Object.assign(
              {
                from: t,
                to: i,
                velocity: s,
                restSpeed: r ? 0.05 : 2,
                restDistance: r ? 0.01 : 0.5,
              },
              n
            )
          )
        );
      return o.get(a);
    };
    const getKeyframes = (e) => {
      t.has(e) || t.set(e, O(e));
      return t.get(e);
    };
    return {
      createAnimation: (e, t, n, o, i) => {
        var s, r;
        let a;
        const c = e.length;
        let l = n && c <= 2 && e.every(isNumberOrNull);
        if (l) {
          const n = e[c - 1];
          const l = 1 === c ? null : e[0];
          let f = 0;
          let u = 0;
          const d = null === i || void 0 === i ? void 0 : i.generator;
          if (d) {
            const { animation: t, generatorStartTime: n } = i;
            const o =
              (null === t || void 0 === t ? void 0 : t.startTime) || n || 0;
            const r =
              (null === t || void 0 === t ? void 0 : t.currentTime) ||
              performance.now() - o;
            const a = d(r).current;
            u = null !== (s = l) && void 0 !== s ? s : a;
            (1 === c || (2 === c && null === e[0])) &&
              (f = x((e) => d(e).current, r, a));
          } else u = null !== (r = l) && void 0 !== r ? r : parseFloat(t());
          const g = getGenerator(
            u,
            n,
            f,
            null === o || void 0 === o ? void 0 : o.includes("scale")
          );
          const m = getKeyframes(g);
          a = Object.assign(Object.assign({}, m), { easing: "linear" });
          if (i) {
            i.generator = g;
            i.generatorStartTime = performance.now();
          }
        } else {
          const e = getKeyframes(getGenerator(0, 100));
          a = { easing: "ease", duration: e.overshootDuration };
        }
        return a;
      },
    };
  };
}
const isNumberOrNull = (e) => "string" !== typeof e;
const U = createGeneratorEasing(V);
const q = createGeneratorEasing(z);
const K = { any: 0, all: 1 };
function inView$1(e, t, { root: n, margin: o, amount: s = "any" } = {}) {
  if ("undefined" === typeof IntersectionObserver) return () => {};
  const r = resolveElements(e);
  const a = new WeakMap();
  const onIntersectionChange = (e) => {
    e.forEach((e) => {
      const n = a.get(e.target);
      if (e.isIntersecting !== Boolean(n))
        if (e.isIntersecting) {
          const n = t(e);
          i(n) ? a.set(e.target, n) : c.unobserve(e.target);
        } else if (n) {
          n(e);
          a.delete(e.target);
        }
    });
  };
  const c = new IntersectionObserver(onIntersectionChange, {
    root: n,
    rootMargin: o,
    threshold: "number" === typeof s ? s : K[s],
  });
  r.forEach((e) => c.observe(e));
  return () => c.disconnect();
}
const G = new WeakMap();
let _;
function getElementSize(e, t) {
  if (t) {
    const { inlineSize: e, blockSize: n } = t[0];
    return { width: e, height: n };
  }
  return e instanceof SVGElement && "getBBox" in e
    ? e.getBBox()
    : { width: e.offsetWidth, height: e.offsetHeight };
}
function notifyTarget({ target: e, contentRect: t, borderBoxSize: n }) {
  var o;
  null === (o = G.get(e)) || void 0 === o
    ? void 0
    : o.forEach((o) => {
        o({
          target: e,
          contentSize: t,
          get size() {
            return getElementSize(e, n);
          },
        });
      });
}
function notifyAll(e) {
  e.forEach(notifyTarget);
}
function createResizeObserver() {
  "undefined" !== typeof ResizeObserver && (_ = new ResizeObserver(notifyAll));
}
function resizeElement(e, t) {
  _ || createResizeObserver();
  const n = resolveElements(e);
  n.forEach((e) => {
    let n = G.get(e);
    if (!n) {
      n = new Set();
      G.set(e, n);
    }
    n.add(t);
    null === _ || void 0 === _ ? void 0 : _.observe(e);
  });
  return () => {
    n.forEach((e) => {
      const n = G.get(e);
      null === n || void 0 === n ? void 0 : n.delete(t);
      (null === n || void 0 === n ? void 0 : n.size) ||
        (null === _ || void 0 === _ ? void 0 : _.unobserve(e));
    });
  };
}
const Z = new Set();
let X;
function createWindowResizeHandler() {
  X = () => {
    const e = { width: window.innerWidth, height: window.innerHeight };
    const t = { target: window, size: e, contentSize: e };
    Z.forEach((e) => e(t));
  };
  window.addEventListener("resize", X);
}
function resizeWindow(e) {
  Z.add(e);
  X || createWindowResizeHandler();
  return () => {
    Z.delete(e);
    !Z.size && X && (X = void 0);
  };
}
function resize(e, t) {
  return i(e) ? resizeWindow(e) : resizeElement(e, t);
}
const Y = 50;
const createAxisInfo = () => ({
  current: 0,
  offset: [],
  progress: 0,
  scrollLength: 0,
  targetOffset: 0,
  targetLength: 0,
  containerLength: 0,
  velocity: 0,
});
const createScrollInfo = () => ({
  time: 0,
  x: createAxisInfo(),
  y: createAxisInfo(),
});
const J = {
  x: { length: "Width", position: "Left" },
  y: { length: "Height", position: "Top" },
};
function updateAxisInfo(e, t, n, i) {
  const s = n[t];
  const { length: r, position: a } = J[t];
  const c = s.current;
  const l = n.time;
  s.current = e["scroll" + a];
  s.scrollLength = e["scroll" + r] - e["client" + r];
  s.offset.length = 0;
  s.offset[0] = 0;
  s.offset[1] = s.scrollLength;
  s.progress = o(0, s.scrollLength, s.current);
  const f = i - l;
  s.velocity = f > Y ? 0 : y(s.current - c, f);
}
function updateScrollInfo(e, t, n) {
  updateAxisInfo(e, "x", t, n);
  updateAxisInfo(e, "y", t, n);
  t.time = n;
}
function calcInset(e, t) {
  let n = { x: 0, y: 0 };
  let o = e;
  while (o && o !== t)
    if (o instanceof HTMLElement) {
      n.x += o.offsetLeft;
      n.y += o.offsetTop;
      o = o.offsetParent;
    } else if (o instanceof SVGGraphicsElement && "getBBox" in o) {
      const { top: e, left: t } = o.getBBox();
      n.x += t;
      n.y += e;
      while (o && "svg" !== o.tagName) o = o.parentNode;
    }
  return n;
}
const Q = {
  Enter: [
    [0, 1],
    [1, 1],
  ],
  Exit: [
    [0, 0],
    [1, 0],
  ],
  Any: [
    [1, 0],
    [0, 1],
  ],
  All: [
    [0, 0],
    [1, 1],
  ],
};
const ee = { start: 0, center: 0.5, end: 1 };
function resolveEdge(e, t, n = 0) {
  let o = 0;
  void 0 !== ee[e] && (e = ee[e]);
  if (h(e)) {
    const t = parseFloat(e);
    e.endsWith("px")
      ? (o = t)
      : e.endsWith("%")
      ? (e = t / 100)
      : e.endsWith("vw")
      ? (o = (t / 100) * document.documentElement.clientWidth)
      : e.endsWith("vh")
      ? (o = (t / 100) * document.documentElement.clientHeight)
      : (e = t);
  }
  l(e) && (o = t * e);
  return n + o;
}
const te = [0, 0];
function resolveOffset(e, t, n, o) {
  let i = Array.isArray(e) ? e : te;
  let s = 0;
  let r = 0;
  if (l(e)) i = [e, e];
  else if (h(e)) {
    e = e.trim();
    i = e.includes(" ") ? e.split(" ") : [e, ee[e] ? e : "0"];
  }
  s = resolveEdge(i[0], n, o);
  r = resolveEdge(i[1], t);
  return s - r;
}
const ne = { x: 0, y: 0 };
function resolveOffsets(e, t, n) {
  let { offset: o = Q.All } = n;
  const { target: i = e, axis: s = "y" } = n;
  const r = "y" === s ? "height" : "width";
  const a = i !== e ? calcInset(i, e) : ne;
  const c =
    i === e
      ? { width: e.scrollWidth, height: e.scrollHeight }
      : { width: i.clientWidth, height: i.clientHeight };
  const l = { width: e.clientWidth, height: e.clientHeight };
  t[s].offset.length = 0;
  let f = !t[s].interpolate;
  const u = o.length;
  for (let e = 0; e < u; e++) {
    const n = resolveOffset(o[e], l[r], c[r], a[s]);
    f || n === t[s].interpolatorOffsets[e] || (f = true);
    t[s].offset[e] = n;
  }
  if (f) {
    t[s].interpolate = w(p(u), t[s].offset);
    t[s].interpolatorOffsets = [...t[s].offset];
  }
  t[s].progress = t[s].interpolate(t[s].current);
}
function measure(e, t = e, n) {
  n.x.targetOffset = 0;
  n.y.targetOffset = 0;
  if (t !== e) {
    let o = t;
    while (o && o != e) {
      n.x.targetOffset += o.offsetLeft;
      n.y.targetOffset += o.offsetTop;
      o = o.offsetParent;
    }
  }
  n.x.targetLength = t === e ? t.scrollWidth : t.clientWidth;
  n.y.targetLength = t === e ? t.scrollHeight : t.clientHeight;
  n.x.containerLength = e.clientWidth;
  n.y.containerLength = e.clientHeight;
}
function createOnScrollHandler(e, t, n, o = {}) {
  const s = o.axis || "y";
  return {
    measure: () => measure(e, o.target, n),
    update: (t) => {
      updateScrollInfo(e, n, t);
      (o.offset || o.target) && resolveOffsets(e, n, o);
    },
    notify: i(t) ? () => t(n) : scrubAnimation(t, n[s]),
  };
}
function scrubAnimation(e, n) {
  e.pause();
  e.forEachNative((e, { easing: n }) => {
    var o, i;
    if (e.updateDuration) {
      n || (e.easing = t);
      e.updateDuration(1);
    } else {
      const t = { duration: 1e3 };
      n || (t.easing = "linear");
      null ===
        (i =
          null === (o = e.effect) || void 0 === o ? void 0 : o.updateTiming) ||
      void 0 === i
        ? void 0
        : i.call(o, t);
    }
  });
  return () => {
    e.currentTime = n.progress;
  };
}
const oe = new WeakMap();
const ie = new WeakMap();
const se = new WeakMap();
const getEventTarget = (e) => (e === document.documentElement ? window : e);
function scroll(e, t = {}) {
  var { container: n = document.documentElement } = t,
    o = S(t, ["container"]);
  let i = se.get(n);
  if (!i) {
    i = new Set();
    se.set(n, i);
  }
  const s = createScrollInfo();
  const r = createOnScrollHandler(n, e, s, o);
  i.add(r);
  if (!oe.has(n)) {
    const listener = () => {
      const e = performance.now();
      for (const e of i) e.measure();
      for (const t of i) t.update(e);
      for (const e of i) e.notify();
    };
    oe.set(n, listener);
    const e = getEventTarget(n);
    window.addEventListener("resize", listener, { passive: true });
    n !== document.documentElement && ie.set(n, resize(n, listener));
    e.addEventListener("scroll", listener, { passive: true });
  }
  const a = oe.get(n);
  const c = requestAnimationFrame(a);
  return () => {
    var t;
    "function" !== typeof e && e.stop();
    cancelAnimationFrame(c);
    const o = se.get(n);
    if (!o) return;
    o.delete(r);
    if (o.size) return;
    const i = oe.get(n);
    oe.delete(n);
    if (i) {
      getEventTarget(n).removeEventListener("scroll", i);
      null === (t = ie.get(n)) || void 0 === t ? void 0 : t();
      window.removeEventListener("resize", i);
    }
  };
}
function hasChanged(e, t) {
  return (
    typeof e !== typeof t ||
    (Array.isArray(e) && Array.isArray(t) ? !shallowCompare(e, t) : e !== t)
  );
}
function shallowCompare(e, t) {
  const n = t.length;
  if (n !== e.length) return false;
  for (let o = 0; o < n; o++) if (t[o] !== e[o]) return false;
  return true;
}
function isVariant(e) {
  return "object" === typeof e;
}
function resolveVariant(e, t) {
  return isVariant(e) ? e : e && t ? t[e] : void 0;
}
let re;
function processScheduledAnimations() {
  if (!re) return;
  const e = re.sort(compareByDepth).map(fireAnimateUpdates);
  e.forEach(fireNext);
  e.forEach(fireNext);
  re = void 0;
}
function scheduleAnimation(e) {
  if (re) n(re, e);
  else {
    re = [e];
    requestAnimationFrame(processScheduledAnimations);
  }
}
function unscheduleAnimation(e) {
  re && d(re, e);
}
const compareByDepth = (e, t) => e.getDepth() - t.getDepth();
const fireAnimateUpdates = (e) => e.animateUpdates();
const fireNext = (e) => e.next();
const motionEvent = (e, t) => new CustomEvent(e, { detail: { target: t } });
function dispatchPointerEvent(e, t, n) {
  e.dispatchEvent(new CustomEvent(t, { detail: { originalEvent: n } }));
}
function dispatchViewEvent(e, t, n) {
  e.dispatchEvent(new CustomEvent(t, { detail: { originalEntry: n } }));
}
const ae = {
  isActive: (e) => Boolean(e.inView),
  subscribe: (e, { enable: t, disable: n }, { inViewOptions: o = {} }) => {
    const { once: i } = o,
      s = S(o, ["once"]);
    return inView$1(
      e,
      (o) => {
        t();
        dispatchViewEvent(e, "viewenter", o);
        if (!i)
          return (t) => {
            n();
            dispatchViewEvent(e, "viewleave", t);
          };
      },
      s
    );
  },
};
const mouseEvent = (e, t, n) => (o) => {
  if (!o.pointerType || "mouse" === o.pointerType) {
    n();
    dispatchPointerEvent(e, t, o);
  }
};
const ce = {
  isActive: (e) => Boolean(e.hover),
  subscribe: (e, { enable: t, disable: n }) => {
    const o = mouseEvent(e, "hoverstart", t);
    const i = mouseEvent(e, "hoverend", n);
    e.addEventListener("pointerenter", o);
    e.addEventListener("pointerleave", i);
    return () => {
      e.removeEventListener("pointerenter", o);
      e.removeEventListener("pointerleave", i);
    };
  },
};
const le = {
  isActive: (e) => Boolean(e.press),
  subscribe: (e, { enable: t, disable: n }) => {
    const onPointerUp = (t) => {
      n();
      dispatchPointerEvent(e, "pressend", t);
      window.removeEventListener("pointerup", onPointerUp);
    };
    const onPointerDown = (n) => {
      t();
      dispatchPointerEvent(e, "pressstart", n);
      window.addEventListener("pointerup", onPointerUp);
    };
    e.addEventListener("pointerdown", onPointerDown);
    return () => {
      e.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  },
};
const fe = { inView: ae, hover: ce, press: le };
const ue = ["initial", "animate", ...Object.keys(fe), "exit"];
const de = new WeakMap();
function createMotionState(e = {}, t) {
  let n;
  let o = t ? t.getDepth() + 1 : 0;
  const i = { initial: true, animate: true };
  const s = {};
  const r = {};
  for (const n of ue)
    r[n] =
      "string" === typeof e[n]
        ? e[n]
        : null === t || void 0 === t
        ? void 0
        : t.getContext()[n];
  const a = false === e.initial ? "animate" : "initial";
  let c = resolveVariant(e[a] || r[a], e.variants) || {},
    l = S(c, ["transition"]);
  const f = Object.assign({}, l);
  function* animateUpdates() {
    var t, o;
    const s = l;
    l = {};
    const r = {};
    for (const n of ue) {
      if (!i[n]) continue;
      const s = resolveVariant(e[n]);
      if (s)
        for (const n in s)
          if ("transition" !== n) {
            l[n] = s[n];
            r[n] = getOptions(
              null !==
                (o =
                  null !== (t = s.transition) && void 0 !== t
                    ? t
                    : e.transition) && void 0 !== o
                ? o
                : {},
              n
            );
          }
    }
    const a = new Set([...Object.keys(l), ...Object.keys(s)]);
    const c = [];
    a.forEach((e) => {
      var t;
      void 0 === l[e] && (l[e] = f[e]);
      if (hasChanged(s[e], l[e])) {
        null !== (t = f[e]) && void 0 !== t ? t : (f[e] = N.get(n, e));
        c.push(animateStyle(n, e, l[e], r[e]));
      }
    });
    yield;
    const d = c.map((e) => e()).filter(Boolean);
    if (!d.length) return;
    const g = l;
    n.dispatchEvent(motionEvent("motionstart", g));
    Promise.all(d.map((e) => e.finished))
      .then(() => {
        n.dispatchEvent(motionEvent("motioncomplete", g));
      })
      .catch(u);
  }
  const setGesture = (e, t) => () => {
    i[e] = t;
    scheduleAnimation(d);
  };
  const updateGestureSubscriptions = () => {
    for (const t in fe) {
      const o = fe[t].isActive(e);
      const i = s[t];
      if (o && !i)
        s[t] = fe[t].subscribe(
          n,
          { enable: setGesture(t, true), disable: setGesture(t, false) },
          e
        );
      else if (!o && i) {
        i();
        delete s[t];
      }
    }
  };
  const d = {
    update: (t) => {
      if (n) {
        e = t;
        updateGestureSubscriptions();
        scheduleAnimation(d);
      }
    },
    setActive: (e, t) => {
      if (n) {
        i[e] = t;
        scheduleAnimation(d);
      }
    },
    animateUpdates: animateUpdates,
    getDepth: () => o,
    getTarget: () => l,
    getOptions: () => e,
    getContext: () => r,
    mount: (e) => {
      A(Boolean(e), "Animation state must be mounted with valid Element");
      n = e;
      de.set(n, d);
      updateGestureSubscriptions();
      return () => {
        de.delete(n);
        unscheduleAnimation(d);
        for (const e in s) s[e]();
      };
    },
    isMounted: () => Boolean(n),
  };
  return d;
}
function createStyles(e) {
  const t = {};
  const n = [];
  for (let o in e) {
    const i = e[o];
    if (isTransform(o)) {
      D[o] && (o = D[o]);
      n.push(o);
      o = asTransformCssVar(o);
    }
    let s = Array.isArray(i) ? i[0] : i;
    const r = B.get(o);
    r && (s = l(i) ? r.toDefaultUnit(i) : i);
    t[o] = s;
  }
  n.length && (t.transform = buildTransformTemplate(n));
  return t;
}
const camelLetterToPipeLetter = (e) => `-${e.toLowerCase()}`;
const camelToPipeCase = (e) => e.replace(/[A-Z]/g, camelLetterToPipeLetter);
function createStyleString(e = {}) {
  const t = createStyles(e);
  let n = "";
  for (const e in t) {
    n += e.startsWith("--") ? e : camelToPipeCase(e);
    n += `: ${t[e]}; `;
  }
  return n;
}
export {
  Q as ScrollOffset,
  animate,
  animateStyle,
  createMotionState,
  createStyleString,
  createStyles,
  getAnimationData,
  getStyleName,
  q as glide,
  inView$1 as inView,
  de as mountedStates,
  resize,
  scroll,
  U as spring,
  stagger,
  N as style,
  timeline,
  withControls,
};

//# sourceMappingURL=index.es.js.map
