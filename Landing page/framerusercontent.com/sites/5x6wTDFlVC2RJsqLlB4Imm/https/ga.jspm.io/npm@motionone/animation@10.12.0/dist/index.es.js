import {
  noopReturn as t,
  defaults as i,
  isEasingGenerator as e,
  isEasingList as s,
  interpolate as a,
} from "@motionone/utils";
import { cubicBezier as n, steps as r } from "@motionone/easing";
const o = {
  ease: n(0.25, 0.1, 0.25, 1),
  "ease-in": n(0.42, 0, 1, 1),
  "ease-in-out": n(0.42, 0, 0.58, 1),
  "ease-out": n(0, 0, 0.58, 1),
};
const h = /\((.*?)\)/;
function getEasingFunction(i) {
  if ("function" === typeof i) return i;
  if (Array.isArray(i)) return n(...i);
  if (o[i]) return o[i];
  if (i.startsWith("steps")) {
    const t = h.exec(i);
    if (t) {
      const i = t[1].split(",");
      return r(parseFloat(i[0]), i[1].trim());
    }
  }
  return t;
}
class Animation {
  constructor(
    n,
    r = [0, 1],
    {
      easing: o,
      duration: h = i.duration,
      delay: u = i.delay,
      endDelay: l = i.endDelay,
      repeat: m = i.repeat,
      offset: c,
      direction: p = "normal",
    } = {}
  ) {
    this.startTime = null;
    this.rate = 1;
    this.t = 0;
    this.cancelTimestamp = null;
    this.easing = t;
    this.duration = 0;
    this.totalDuration = 0;
    this.repeat = 0;
    this.playState = "idle";
    this.finished = new Promise((t, i) => {
      this.resolve = t;
      this.reject = i;
    });
    o = o || i.easing;
    if (e(o)) {
      const t = o.createAnimation(r, () => "0", true);
      o = t.easing;
      void 0 !== t.keyframes && (r = t.keyframes);
      void 0 !== t.duration && (h = t.duration);
    }
    this.repeat = m;
    this.easing = s(o) ? t : getEasingFunction(o);
    this.updateDuration(h);
    const d = a(r, c, s(o) ? o.map(getEasingFunction) : t);
    this.tick = (t) => {
      var i;
      u = u;
      let e = 0;
      e =
        void 0 !== this.pauseTime
          ? this.pauseTime
          : (t - this.startTime) * this.rate;
      this.t = e;
      e /= 1e3;
      e = Math.max(e - u, 0);
      "finished" === this.playState &&
        void 0 === this.pauseTime &&
        (e = this.totalDuration);
      const s = e / this.duration;
      let a = Math.floor(s);
      let r = s % 1;
      !r && s >= 1 && (r = 1);
      1 === r && a--;
      const o = a % 2;
      ("reverse" === p ||
        ("alternate" === p && o) ||
        ("alternate-reverse" === p && !o)) &&
        (r = 1 - r);
      const h = e >= this.totalDuration ? 1 : Math.min(r, 1);
      const m = d(this.easing(h));
      n(m);
      const c =
        void 0 === this.pauseTime &&
        ("finished" === this.playState || e >= this.totalDuration + l);
      if (c) {
        this.playState = "finished";
        null === (i = this.resolve) || void 0 === i ? void 0 : i.call(this, m);
      } else
        "idle" !== this.playState &&
          (this.frameRequestId = requestAnimationFrame(this.tick));
    };
    this.play();
  }
  play() {
    const t = performance.now();
    this.playState = "running";
    void 0 !== this.pauseTime
      ? (this.startTime = t - this.pauseTime)
      : this.startTime || (this.startTime = t);
    this.cancelTimestamp = this.startTime;
    this.pauseTime = void 0;
    this.frameRequestId = requestAnimationFrame(this.tick);
  }
  pause() {
    this.playState = "paused";
    this.pauseTime = this.t;
  }
  finish() {
    this.playState = "finished";
    this.tick(0);
  }
  stop() {
    var t;
    this.playState = "idle";
    void 0 !== this.frameRequestId && cancelAnimationFrame(this.frameRequestId);
    null === (t = this.reject) || void 0 === t ? void 0 : t.call(this, false);
  }
  cancel() {
    this.stop();
    this.tick(this.cancelTimestamp);
  }
  reverse() {
    this.rate *= -1;
  }
  commitStyles() {}
  updateDuration(t) {
    this.duration = t;
    this.totalDuration = t * (this.repeat + 1);
  }
  get currentTime() {
    return this.t;
  }
  set currentTime(t) {
    void 0 !== this.pauseTime || 0 === this.rate
      ? (this.pauseTime = t)
      : (this.startTime = performance.now() - t / this.rate);
  }
  get playbackRate() {
    return this.rate;
  }
  set playbackRate(t) {
    this.rate = t;
  }
}
export { Animation, getEasingFunction };

//# sourceMappingURL=index.es.js.map
