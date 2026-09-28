import { velocityPerSecond as e, time as t } from "@motionone/utils";
const s = 5;
function calcGeneratorVelocity(t, n, r) {
  const a = Math.max(n - s, 0);
  return e(r - t(a), n - a);
}
const n = { stiffness: 100, damping: 10, mass: 1 };
const calcDampingRatio = (e = n.stiffness, t = n.damping, s = n.mass) =>
  t / (2 * Math.sqrt(e * s));
function hasReachedTarget(e, t, s) {
  return (e < t && s >= t) || (e > t && s <= t);
}
const spring = ({
  stiffness: e = n.stiffness,
  damping: s = n.damping,
  mass: r = n.mass,
  from: a = 0,
  to: o = 1,
  velocity: c = 0,
  restSpeed: i = 2,
  restDistance: h = 0.5,
} = {}) => {
  c = c ? t.s(c) : 0;
  const u = { done: false, hasReachedTarget: false, current: a, target: o };
  const d = o - a;
  const f = Math.sqrt(e / r) / 1e3;
  const l = calcDampingRatio(e, s, r);
  let g;
  if (l < 1) {
    const e = f * Math.sqrt(1 - l * l);
    g = (t) =>
      o -
      Math.exp(-l * f * t) *
        (((l * f * d - c) / e) * Math.sin(e * t) + d * Math.cos(e * t));
  } else g = (e) => o - Math.exp(-f * e) * (d + (f * d - c) * e);
  return (e) => {
    u.current = g(e);
    const t = 0 === e ? c : calcGeneratorVelocity(g, e, u.current);
    const s = Math.abs(t) <= i;
    const n = Math.abs(o - u.current) <= h;
    u.done = s && n;
    u.hasReachedTarget = hasReachedTarget(a, o, u.current);
    return u;
  };
};
const glide = ({
  from: e = 0,
  velocity: s = 0,
  power: n = 0.8,
  decay: r = 0.325,
  bounceDamping: a,
  bounceStiffness: o,
  changeTarget: c,
  min: i,
  max: h,
  restDistance: u = 0.5,
  restSpeed: d,
}) => {
  r = t.ms(r);
  const f = { hasReachedTarget: false, done: false, current: e, target: e };
  const isOutOfBounds = (e) =>
    (void 0 !== i && e < i) || (void 0 !== h && e > h);
  const nearestBoundary = (e) =>
    void 0 === i
      ? h
      : void 0 === h || Math.abs(i - e) < Math.abs(h - e)
      ? i
      : h;
  let l = n * s;
  const g = e + l;
  const m = void 0 === c ? g : c(g);
  f.target = m;
  m !== g && (l = m - e);
  const calcDelta = (e) => -l * Math.exp(-e / r);
  const calcLatest = (e) => m + calcDelta(e);
  const applyFriction = (e) => {
    const t = calcDelta(e);
    const s = calcLatest(e);
    f.done = Math.abs(t) <= u;
    f.current = f.done ? m : s;
  };
  let p;
  let M;
  const checkCatchBoundary = (e) => {
    if (isOutOfBounds(f.current)) {
      p = e;
      M = spring({
        from: f.current,
        to: nearestBoundary(f.current),
        velocity: calcGeneratorVelocity(calcLatest, e, f.current),
        damping: a,
        stiffness: o,
        restDistance: u,
        restSpeed: d,
      });
    }
  };
  checkCatchBoundary(0);
  return (e) => {
    let t = false;
    if (!M && void 0 === p) {
      t = true;
      applyFriction(e);
      checkCatchBoundary(e);
    }
    if (void 0 !== p && e > p) {
      f.hasReachedTarget = true;
      return M(e - p);
    }
    f.hasReachedTarget = false;
    !t && applyFriction(e);
    return f;
  };
};
const r = 10;
const a = 1e4;
function pregenerateKeyframes(e) {
  let t;
  let s = r;
  let n = e(0);
  const o = [n.current];
  while (!n.done && s < a) {
    n = e(s);
    o.push(n.done ? n.target : n.current);
    void 0 === t && n.hasReachedTarget && (t = s);
    s += r;
  }
  const c = s - r;
  1 === o.length && o.push(n.current);
  return {
    keyframes: o,
    duration: c / 1e3,
    overshootDuration: (null !== t && void 0 !== t ? t : c) / 1e3,
  };
}
export { calcGeneratorVelocity, glide, pregenerateKeyframes, spring };

//# sourceMappingURL=index.es.js.map
