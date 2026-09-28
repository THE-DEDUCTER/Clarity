var e =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
    ? self
    : global;
var t = {};
(function (e, n) {
  t = n();
})(0, () =>
  (() => {
    var t = [
      ,
      (t, n, r) => {
        r.r(n);
        r.d(n, { default: () => a });
        var i = (() => {
          var t =
            typeof document !== "undefined" && document.currentScript
              ? document.currentScript.src
              : void 0;
          return function (n = {}) {
            var r,
              i,
              a = n;
            a.ready = new Promise((e, t) => {
              r = e;
              i = t;
            });
            function o() {
              function t(e) {
                const t = i;
                r = n = 0;
                i = new Map();
                t.forEach((t) => {
                  try {
                    t(e);
                  } catch (e) {
                    console.error(e);
                  }
                });
                this.lb();
                a && a.Nb();
              }
              let n = 0,
                r = 0,
                i = new Map(),
                a = null,
                o = null;
              (this || e).requestAnimationFrame = function (a) {
                n || (n = requestAnimationFrame(t.bind(this || e)));
                const o = ++r;
                i.set(o, a);
                return o;
              };
              (this || e).cancelAnimationFrame = function (e) {
                i.delete(e);
                n && 0 == i.size && (cancelAnimationFrame(n), (n = 0));
              };
              (this || e).Lb = function (t) {
                o && (document.body.remove(o), (o = null));
                t ||
                  ((o = document.createElement("div")),
                  (o.style.backgroundColor = "black"),
                  (o.style.position = "fixed"),
                  (o.style.right = 0),
                  (o.style.top = 0),
                  (o.style.color = "white"),
                  (o.style.padding = "4px"),
                  (o.innerHTML = "RIVE FPS"),
                  (t = function (e) {
                    o.innerHTML = "RIVE FPS " + e.toFixed(1);
                  }),
                  document.body.appendChild(o));
                a = new (function () {
                  let n = 0,
                    r = 0;
                  (this || e).Nb = function () {
                    var e = performance.now();
                    r
                      ? (++n,
                        (e -= r),
                        1e3 < e && (t((1e3 * n) / e), (n = r = 0)))
                      : ((r = e), (n = 0));
                  };
                })();
              };
              (this || e).lb = function () {};
            }
            function s() {
              undefined;
              const t = new Map();
              let n = -Infinity;
              (this || e).push = function (e) {
                e = (e + 255) >> 8;
                t.has(e) && clearTimeout(t.get(e));
                t.set(
                  e,
                  setTimeout(function () {
                    t.delete(e);
                    0 == t.length
                      ? (n = -Infinity)
                      : e == n &&
                        ((n = Math.max(...t.keys())), console.assert(n < e));
                  }, 1e3)
                );
                n = Math.max(e, n);
                return n << 8;
              };
            }
            const u = a.onRuntimeInitialized;
            a.onRuntimeInitialized = function () {
              u && u();
              let t = a.decodeAudio;
              a.decodeAudio = function (e, n) {
                e = t(e);
                n(e);
              };
              let n = a.decodeFont;
              a.decodeFont = function (e, t) {
                e = n(e);
                t(e);
              };
              const r = a.FileAssetLoader;
              a.ptrToAsset = (e) => {
                let t = a.ptrToFileAsset(e);
                return t.isImage
                  ? a.ptrToImageAsset(e)
                  : t.isFont
                  ? a.ptrToFontAsset(e)
                  : t.isAudio
                  ? a.ptrToAudioAsset(e)
                  : t;
              };
              a.CustomFileAssetLoader = r.extend("CustomFileAssetLoader", {
                __construct: function ({ loadContents: t }) {
                  (this || e).__parent.__construct.call(this || e);
                  (this || e).Bb = t;
                },
                loadContents: function (e, t) {
                  e = a.ptrToAsset(e);
                  return this.Bb(e, t);
                },
              });
              a.CDNFileAssetLoader = r.extend("CDNFileAssetLoader", {
                __construct: function () {
                  (this || e).__parent.__construct.call(this || e);
                },
                loadContents: function (e) {
                  let t = a.ptrToAsset(e);
                  e = t.cdnUuid;
                  if ("" === e) return !1;
                  (function (e, t) {
                    var n = new XMLHttpRequest();
                    n.responseType = "arraybuffer";
                    n.onreadystatechange = function () {
                      4 == n.readyState && 200 == n.status && t(n);
                    };
                    n.open("GET", e, !0);
                    n.send(null);
                  })(t.cdnBaseUrl + "/" + e, (e) => {
                    t.decode(new Uint8Array(e.response));
                  });
                  return !0;
                },
              });
              a.FallbackFileAssetLoader = r.extend("FallbackFileAssetLoader", {
                __construct: function () {
                  (this || e).__parent.__construct.call(this || e);
                  (this || e).hb = [];
                },
                addLoader: function (t) {
                  (this || e).hb.push(t);
                },
                loadContents: function (t, n) {
                  for (let r of (this || e).hb)
                    if (r.loadContents(t, n)) return !0;
                  return !1;
                },
              });
              let i = a.computeAlignment;
              a.computeAlignment = function (t, n, r, a, o = 1) {
                return i.call(this || e, t, n, r, a, o);
              };
            };
            const l = a.onRuntimeInitialized;
            a.onRuntimeInitialized = function () {
              function t(t) {
                (this || e).F = t;
                (this || e).Ab = t.getContext("2d");
                (this || e).Db = i;
                (this || e).S = [];
                (this || e).la = 0;
                (this || e).clear = function () {
                  console.assert(0 == (this || e).la);
                  (this || e).S = [];
                  u.delete(this || e);
                };
                (this || e).save = function () {
                  ++(this || e).la;
                  (this || e).S.push(i.save.bind(i));
                };
                (this || e).restore = function () {
                  0 < (this || e).la &&
                    ((this || e).S.push(i.restore.bind(i)), --(this || e).la);
                };
                (this || e).transform = function (t) {
                  (this || e).S.push(i.transform.bind(i, t));
                };
                (this || e).align = function (t, n, r, a, o = 1) {
                  (this || e).S.push(i.align.bind(i, t, n, r, a, o));
                };
                (this || e).flush = function () {
                  console.assert(0 == (this || e).la);
                  u.add(this || e);
                  i.Wa || r();
                };
                (this || e).delete = function () {};
              }
              function n(t, n = !1) {
                var r = {
                  alpha: !0,
                  depth: n,
                  stencil: n,
                  antialias: n,
                  premultipliedAlpha: !0,
                  preserveDrawingBuffer: 0,
                  powerPreference: "high-performance",
                  failIfMajorPerformanceCaveat: 0,
                  enableExtensionsByDefault: !1,
                  explicitSwapControl: 0,
                  renderViaOffscreenBackBuffer: 0,
                };
                n = t.getContext("webgl2", r);
                if (!n) return null;
                r = Un(n, r);
                Nn(r);
                const i = c(t.width, t.height);
                i.Ka = r;
                i.F = t;
                i.La = t.width;
                i.Xa = t.height;
                i.T = n;
                var a = i.delete;
                i.delete = function () {
                  a.call(this || e);
                  var t = (this || e).Ka;
                  zn === Wn[t] && (zn = null);
                  "object" == typeof JSEvents && JSEvents.Oc(Wn[t].C.canvas);
                  Wn[t] && Wn[t].C.canvas && (Wn[t].C.canvas.zb = void 0);
                  (this || e).Ka =
                    (this || e).F =
                    (this || e).La =
                    (this || e).T =
                    Wn[t] =
                      null;
                };
                return i;
              }
              function r() {
                if (i) {
                  var e = i.Cb,
                    t = 0,
                    n = 0,
                    r = 0,
                    o = Array(u.size),
                    s = 0;
                  for (var l of u)
                    (l.ga = Math.min(l.F.width, e)),
                      (l.fa = Math.min(l.F.height, e)),
                      (l.Ia = l.fa * l.ga),
                      (t = Math.max(t, l.ga)),
                      (n = Math.max(n, l.fa)),
                      (r += l.Ia),
                      (o[s++] = l);
                  u.clear();
                  if (!(0 >= r)) {
                    t = 1 << (0 >= t ? 0 : 32 - Math.clz32(t - 1));
                    for (
                      n = 1 << (0 >= n ? 0 : 32 - Math.clz32(n - 1));
                      n * t < r;

                    )
                      t <= n ? (t *= 2) : (n *= 2);
                    t = Math.min(t, e);
                    t = Math.min(n, e);
                    o.sort((e, t) => t.Ia - e.Ia);
                    r = new a.DynamicRectanizer(e);
                    for (l = 0; l < o.length; ) {
                      r.reset(t, n);
                      for (s = l; s < o.length; ++s) {
                        var c = o[s],
                          f = r.addRect(c.ga, c.fa);
                        if (0 > f) {
                          console.assert(s > l);
                          break;
                        }
                        c.ra = f & 65535;
                        c.sa = f >> 16;
                      }
                      c = d.push(r.drawWidth());
                      f = p.push(r.drawHeight());
                      console.assert(c >= r.drawWidth());
                      console.assert(f >= r.drawHeight());
                      console.assert(c <= e);
                      console.assert(f <= e);
                      i.F.width != c && (i.F.width = c);
                      i.F.height != f && (i.F.height = f);
                      i.clear();
                      for (c = l; c < s; ++c) {
                        f = o[c];
                        i.saveClipRect(f.ra, f.sa, f.ra + f.ga, f.sa + f.fa);
                        let e = new a.Mat2D();
                        e.xx = f.ga / f.F.width;
                        e.yy = f.fa / f.F.height;
                        e.xy = e.yx = 0;
                        e.tx = f.ra;
                        e.ty = f.sa;
                        i.transform(e);
                        for (const e of f.S) e();
                        i.restoreClipRect();
                        f.S = [];
                      }
                      for (i.flush(); l < s; ++l)
                        (c = o[l]),
                          (f = c.Ab),
                          (f.globalCompositeOperation = "copy"),
                          f.drawImage(
                            i.F,
                            c.ra,
                            c.sa,
                            c.ga,
                            c.fa,
                            0,
                            0,
                            c.F.width,
                            c.F.height
                          );
                      l = s;
                    }
                  }
                }
              }
              l && l();
              let i = null;
              const u = new Set(),
                c = a.makeRenderer;
              a.makeRenderer = function (e, r) {
                if (!i) {
                  function a(e) {
                    var t = document.createElement("canvas");
                    t.width = 1;
                    t.height = 1;
                    i = n(t, e);
                    i.Wa = !!i.T.getExtension(
                      "WEBGL_shader_pixel_local_storage"
                    );
                    i.Cb = Math.min(
                      i.T.getParameter(i.T.MAX_RENDERBUFFER_SIZE),
                      i.T.getParameter(i.T.MAX_TEXTURE_SIZE)
                    );
                    i.Ja = !i.Wa;
                    (e = i.T.getExtension("WEBGL_debug_renderer_info")) &&
                      ((t = i.T.getParameter(e.UNMASKED_RENDERER_WEBGL)),
                      i.T.getParameter(e.UNMASKED_VENDOR_WEBGL).includes(
                        "Google"
                      ) &&
                        t.includes("ANGLE Metal Renderer") &&
                        (i.Ja = !1));
                    return i;
                  }
                  i = a(!0);
                  i.Ja || (i = a(!1));
                }
                return r ? new t(e) : n(e, i.Ja);
              };
              const f = a.Artboard.prototype.delete;
              a.Artboard.prototype.delete = function () {
                (this || e).Eb = !0;
                f.call(this || e);
              };
              const h = a.Artboard.prototype.draw;
              a.Artboard.prototype.draw = function (t) {
                t.S
                  ? t.S.push(() => {
                      (this || e).Eb || h.call(this || e, t.Db);
                    })
                  : h.call(this || e, t);
              };
              const d = new s(),
                p = new s(),
                v = new o();
              a.requestAnimationFrame = v.requestAnimationFrame.bind(v);
              a.cancelAnimationFrame = v.cancelAnimationFrame.bind(v);
              a.enableFPSCounter = v.Lb.bind(v);
              v.lb = r;
              a.resolveAnimationFrame = r;
              let m = a.load;
              a.load = function (e, t, n = !0) {
                const r = new a.FallbackFileAssetLoader();
                void 0 !== t && r.addLoader(t);
                n && ((t = new a.CDNFileAssetLoader()), r.addLoader(t));
                return Promise.resolve(m(e, r));
              };
              const g = a.WebGL2Renderer.prototype.clear;
              a.WebGL2Renderer.prototype.clear = function () {
                Nn((this || e).Ka);
                const t = (this || e).F;
                ((this || e).La == t.width && (this || e).Xa == t.height) ||
                  (this.resize(t.width, t.height),
                  ((this || e).La = t.width),
                  ((this || e).Xa = t.height));
                g.call(this || e);
              };
              a.decodeImage = function (e, t) {
                e = a.decodeWebGL2Image(e);
                t(e);
              };
              let b = a.Renderer.prototype.align;
              a.Renderer.prototype.align = function (t, n, r, i, a = 1) {
                b.call(this || e, t, n, r, i, a);
              };
            };
            var c,
              f,
              h = Object.assign({}, a),
              d = "./this.program",
              p = "object" == typeof window,
              v = "function" == typeof importScripts,
              m = "";
            (p || v) &&
              (v
                ? (m = self.location.href)
                : "undefined" != typeof document &&
                  document.currentScript &&
                  (m = document.currentScript.src),
              t && (m = t),
              (m =
                0 !== m.indexOf("blob:")
                  ? m.substr(0, m.replace(/[?#].*/, "").lastIndexOf("/") + 1)
                  : ""),
              v &&
                (f = (e) => {
                  var t = new XMLHttpRequest();
                  t.open("GET", e, !1);
                  t.responseType = "arraybuffer";
                  t.send(null);
                  return new Uint8Array(t.response);
                }),
              (c = (e, t, n) => {
                var r = new XMLHttpRequest();
                r.open("GET", e, !0);
                r.responseType = "arraybuffer";
                r.onload = () => {
                  200 == r.status || (0 == r.status && r.response)
                    ? t(r.response)
                    : n();
                };
                r.onerror = n;
                r.send(null);
              }));
            var g = a.print || console.log.bind(console),
              b = a.printErr || console.error.bind(console);
            Object.assign(a, h);
            h = null;
            a.thisProgram && (d = a.thisProgram);
            var y;
            a.wasmBinary && (y = a.wasmBinary);
            a.noExitRuntime;
            "object" != typeof WebAssembly &&
              V("no native wasm support detected");
            var w,
              _,
              A,
              C,
              M,
              E,
              P,
              I,
              L,
              F,
              R = !1;
            function S() {
              var e = w.buffer;
              a.HEAP8 = A = new Int8Array(e);
              a.HEAP16 = M = new Int16Array(e);
              a.HEAP32 = P = new Int32Array(e);
              a.HEAPU8 = C = new Uint8Array(e);
              a.HEAPU16 = E = new Uint16Array(e);
              a.HEAPU32 = I = new Uint32Array(e);
              a.HEAPF32 = L = new Float32Array(e);
              a.HEAPF64 = F = new Float64Array(e);
            }
            var x,
              k = [],
              T = [],
              j = [];
            function O() {
              var e = a.preRun.shift();
              k.unshift(e);
            }
            var W = 0,
              B = null,
              D = null;
            function V(e) {
              a.onAbort && a.onAbort(e);
              e = "Aborted(" + e + ")";
              b(e);
              R = !0;
              e = new WebAssembly.RuntimeError(
                e + ". Build with -sASSERTIONS for more info."
              );
              i(e);
              throw e;
            }
            function U(e) {
              return e.startsWith("data:application/octet-stream;base64,");
            }
            var N;
            N = "webgl2_advanced.wasm";
            if (!U(N)) {
              var $ = N;
              N = a.locateFile ? a.locateFile($, m) : m + $;
            }
            function G(e) {
              if (e == N && y) return new Uint8Array(y);
              if (f) return f(e);
              throw "both async and sync fetching of the wasm failed";
            }
            function z(e) {
              if (!y && (p || v)) {
                if ("function" == typeof fetch && !e.startsWith("file://"))
                  return fetch(e, { credentials: "same-origin" })
                    .then((t) => {
                      if (!t.ok)
                        throw "failed to load wasm binary file at '" + e + "'";
                      return t.arrayBuffer();
                    })
                    .catch(() => G(e));
                if (c)
                  return new Promise((t, n) => {
                    c(e, (e) => t(new Uint8Array(e)), n);
                  });
              }
              return Promise.resolve().then(() => G(e));
            }
            function H(e, t, n) {
              return z(e)
                .then((e) => WebAssembly.instantiate(e, t))
                .then((e) => e)
                .then(n, (e) => {
                  b("failed to asynchronously prepare wasm: " + e);
                  V(e);
                });
            }
            function Y(e, t) {
              var n = N;
              return y ||
                "function" != typeof WebAssembly.instantiateStreaming ||
                U(n) ||
                n.startsWith("file://") ||
                "function" != typeof fetch
                ? H(n, e, t)
                : fetch(n, { credentials: "same-origin" }).then((r) =>
                    WebAssembly.instantiateStreaming(r, e).then(
                      t,
                      function (r) {
                        b("wasm streaming compile failed: " + r);
                        b("falling back to ArrayBuffer instantiation");
                        return H(n, e, t);
                      }
                    )
                  );
            }
            var X,
              q,
              J = {
                517895: (e, t, n, r, i) => {
                  if (
                    "undefined" === typeof window ||
                    void 0 ===
                      (window.AudioContext || window.webkitAudioContext)
                  )
                    return 0;
                  if ("undefined" === typeof window.h) {
                    window.h = { Da: 0 };
                    window.h.I = {};
                    window.h.I.Ba = e;
                    window.h.I.capture = t;
                    window.h.I.Na = n;
                    window.h.ja = {};
                    window.h.ja.stopped = r;
                    window.h.ja.ub = i;
                    let a = window.h;
                    a.D = [];
                    a.oc = function (e) {
                      for (var t = 0; t < a.D.length; ++t)
                        if (null == a.D[t]) return (a.D[t] = e), t;
                      a.D.push(e);
                      return a.D.length - 1;
                    };
                    a.yb = function (e) {
                      for (a.D[e] = null; 0 < a.D.length; ) {
                        if (null != a.D[a.D.length - 1]) break;
                        a.D.pop();
                      }
                    };
                    a.Qc = function (e) {
                      for (var t = 0; t < a.D.length; ++t)
                        if (a.D[t] == e) return a.yb(t);
                    };
                    a.va = function (e) {
                      return a.D[e];
                    };
                    a.Va = ["touchend", "click"];
                    a.unlock = function () {
                      for (var e = 0; e < a.D.length; ++e) {
                        var t = a.D[e];
                        null != t &&
                          null != t.J &&
                          t.state === a.ja.ub &&
                          t.J.resume().then(
                            () => {
                              pr(t.mb);
                            },
                            (e) => {
                              console.error("Failed to resume audiocontext", e);
                            }
                          );
                      }
                      a.Va.map(function (e) {
                        document.removeEventListener(e, a.unlock, !0);
                      });
                    };
                    a.Va.map(function (e) {
                      document.addEventListener(e, a.unlock, !0);
                    });
                  }
                  window.h.Da += 1;
                  return 1;
                },
                520073: () => {
                  "undefined" !== typeof window.h &&
                    (window.h.Va.map(function (e) {
                      document.removeEventListener(e, window.h.unlock, !0);
                    }),
                    --window.h.Da,
                    0 === window.h.Da && delete window.h);
                },
                520377: () =>
                  void 0 !== navigator.mediaDevices &&
                  void 0 !== navigator.mediaDevices.getUserMedia,
                520481: () => {
                  try {
                    var e = new (window.AudioContext ||
                        window.webkitAudioContext)(),
                      t = e.sampleRate;
                    e.close();
                    return t;
                  } catch (e) {
                    return 0;
                  }
                },
                520652: (e, t, n, r, i, a) => {
                  if ("undefined" === typeof window.h) return -1;
                  var o = {},
                    s = {};
                  e == window.h.I.Ba && 0 != n && (s.sampleRate = n);
                  o.J = new (window.AudioContext || window.webkitAudioContext)(
                    s
                  );
                  o.J.suspend();
                  o.state = window.h.ja.stopped;
                  n = 0;
                  e != window.h.I.Ba && (n = t);
                  o.Z = o.J.createScriptProcessor(r, n, t);
                  o.Z.onaudioprocess = function (n) {
                    (null != o.wa && 0 != o.wa.length) ||
                      (o.wa = new Float32Array(L.buffer, i, r * t));
                    if (e == window.h.I.capture || e == window.h.I.Na) {
                      for (var s = 0; s < t; s += 1)
                        for (
                          var u = n.inputBuffer.getChannelData(s),
                            l = o.wa,
                            c = 0;
                          c < r;
                          c += 1
                        )
                          l[c * t + s] = u[c];
                      vr(a, r, i);
                    }
                    if (e == window.h.I.Ba || e == window.h.I.Na)
                      for (
                        mr(a, r, i), s = 0;
                        s < n.outputBuffer.numberOfChannels;
                        ++s
                      )
                        for (
                          u = n.outputBuffer.getChannelData(s), l = o.wa, c = 0;
                          c < r;
                          c += 1
                        )
                          u[c] = l[c * t + s];
                    else
                      for (s = 0; s < n.outputBuffer.numberOfChannels; ++s)
                        n.outputBuffer.getChannelData(s).fill(0);
                  };
                  (e != window.h.I.capture && e != window.h.I.Na) ||
                    navigator.mediaDevices
                      .getUserMedia({ audio: !0, video: !1 })
                      .then(function (e) {
                        o.Ea = o.J.createMediaStreamSource(e);
                        o.Ea.connect(o.Z);
                        o.Z.connect(o.J.destination);
                      })
                      .catch(function (e) {
                        console.log("Failed to get user media: " + e);
                      });
                  e == window.h.I.Ba && o.Z.connect(o.J.destination);
                  o.mb = a;
                  return window.h.oc(o);
                },
                523529: (e) => window.h.va(e).J.sampleRate,
                523602: (e) => {
                  e = window.h.va(e);
                  void 0 !== e.Z &&
                    ((e.Z.onaudioprocess = function () {}),
                    e.Z.disconnect(),
                    (e.Z = void 0));
                  void 0 !== e.Ea && (e.Ea.disconnect(), (e.Ea = void 0));
                  e.J.close();
                  e.J = void 0;
                  e.mb = void 0;
                },
                524002: (e) => {
                  window.h.yb(e);
                },
                524052: (e) => {
                  e = window.h.va(e);
                  e.J.resume();
                  e.state = window.h.ja.ub;
                },
                524191: (e) => {
                  e = window.h.va(e);
                  e.J.suspend();
                  e.state = window.h.ja.stopped;
                },
              },
              K = (e) => {
                for (; 0 < e.length; ) e.shift()(a);
              },
              Z = (e, t) => {
                for (var n = 0, r = e.length - 1; 0 <= r; r--) {
                  var i = e[r];
                  "." === i
                    ? e.splice(r, 1)
                    : ".." === i
                    ? (e.splice(r, 1), n++)
                    : n && (e.splice(r, 1), n--);
                }
                if (t) for (; n; n--) e.unshift("..");
                return e;
              },
              Q = (e) => {
                var t = "/" === e.charAt(0),
                  n = "/" === e.substr(-1);
                (e = Z(
                  e.split("/").filter((e) => !!e),
                  !t
                ).join("/")) ||
                  t ||
                  (e = ".");
                e && n && (e += "/");
                return (t ? "/" : "") + e;
              },
              ee = (e) => {
                var t =
                  /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
                    .exec(e)
                    .slice(1);
                e = t[0];
                t = t[1];
                if (!e && !t) return ".";
                t && (t = t.substr(0, t.length - 1));
                return e + t;
              },
              te = (e) => {
                if ("/" === e) return "/";
                e = Q(e);
                e = e.replace(/\/$/, "");
                var t = e.lastIndexOf("/");
                return -1 === t ? e : e.substr(t + 1);
              },
              ne = () => {
                if (
                  "object" == typeof crypto &&
                  "function" == typeof crypto.getRandomValues
                )
                  return (e) => crypto.getRandomValues(e);
                V("initRandomDevice");
              },
              re = (e) => (re = ne())(e);
            function ie() {
              for (
                var e = "", t = !1, n = arguments.length - 1;
                -1 <= n && !t;
                n--
              ) {
                t = 0 <= n ? arguments[n] : "/";
                if ("string" != typeof t)
                  throw new TypeError(
                    "Arguments to path.resolve must be strings"
                  );
                if (!t) return "";
                e = t + "/" + e;
                t = "/" === t.charAt(0);
              }
              e = Z(
                e.split("/").filter((e) => !!e),
                !t
              ).join("/");
              return (t ? "/" : "") + e || ".";
            }
            var ae =
                "undefined" != typeof TextDecoder
                  ? new TextDecoder("utf8")
                  : void 0,
              oe = (e, t, n) => {
                var r = t + n;
                for (n = t; e[n] && !(n >= r); ) ++n;
                if (16 < n - t && e.buffer && ae)
                  return ae.decode(e.subarray(t, n));
                for (r = ""; t < n; ) {
                  var i = e[t++];
                  if (i & 128) {
                    var a = e[t++] & 63;
                    if (192 == (i & 224))
                      r += String.fromCharCode(((i & 31) << 6) | a);
                    else {
                      var o = e[t++] & 63;
                      i =
                        224 == (i & 240)
                          ? ((i & 15) << 12) | (a << 6) | o
                          : ((i & 7) << 18) |
                            (a << 12) |
                            (o << 6) |
                            (e[t++] & 63);
                      65536 > i
                        ? (r += String.fromCharCode(i))
                        : ((i -= 65536),
                          (r += String.fromCharCode(
                            55296 | (i >> 10),
                            56320 | (i & 1023)
                          )));
                    }
                  } else r += String.fromCharCode(i);
                }
                return r;
              },
              se = [],
              ue = (e) => {
                for (var t = 0, n = 0; n < e.length; ++n) {
                  var r = e.charCodeAt(n);
                  127 >= r
                    ? t++
                    : 2047 >= r
                    ? (t += 2)
                    : 55296 <= r && 57343 >= r
                    ? ((t += 4), ++n)
                    : (t += 3);
                }
                return t;
              },
              le = (e, t, n, r) => {
                if (!(0 < r)) return 0;
                var i = n;
                r = n + r - 1;
                for (var a = 0; a < e.length; ++a) {
                  var o = e.charCodeAt(a);
                  if (55296 <= o && 57343 >= o) {
                    var s = e.charCodeAt(++a);
                    o = (65536 + ((o & 1023) << 10)) | (s & 1023);
                  }
                  if (127 >= o) {
                    if (n >= r) break;
                    t[n++] = o;
                  } else {
                    if (2047 >= o) {
                      if (n + 1 >= r) break;
                      t[n++] = 192 | (o >> 6);
                    } else {
                      if (65535 >= o) {
                        if (n + 2 >= r) break;
                        t[n++] = 224 | (o >> 12);
                      } else {
                        if (n + 3 >= r) break;
                        t[n++] = 240 | (o >> 18);
                        t[n++] = 128 | ((o >> 12) & 63);
                      }
                      t[n++] = 128 | ((o >> 6) & 63);
                    }
                    t[n++] = 128 | (o & 63);
                  }
                }
                t[n] = 0;
                return n - i;
              };
            function ce(e, t) {
              var n = Array(ue(e) + 1);
              e = le(e, n, 0, n.length);
              t && (n.length = e);
              return n;
            }
            var fe = [];
            function he(e, t) {
              fe[e] = { input: [], G: [], V: t };
              $e(e, de);
            }
            var de = {
                open: function (e) {
                  var t = fe[e.node.Ca];
                  if (!t) throw new Fe(43);
                  e.s = t;
                  e.seekable = !1;
                },
                close: function (e) {
                  e.s.V.ua(e.s);
                },
                ua: function (e) {
                  e.s.V.ua(e.s);
                },
                read: function (e, t, n, r) {
                  if (!e.s || !e.s.V.gb) throw new Fe(60);
                  for (var i = 0, a = 0; a < r; a++) {
                    try {
                      var o = e.s.V.gb(e.s);
                    } catch (e) {
                      throw new Fe(29);
                    }
                    if (void 0 === o && 0 === i) throw new Fe(6);
                    if (null === o || void 0 === o) break;
                    i++;
                    t[n + a] = o;
                  }
                  i && (e.node.timestamp = Date.now());
                  return i;
                },
                write: function (e, t, n, r) {
                  if (!e.s || !e.s.V.Qa) throw new Fe(60);
                  try {
                    for (var i = 0; i < r; i++) e.s.V.Qa(e.s, t[n + i]);
                  } catch (e) {
                    throw new Fe(29);
                  }
                  r && (e.node.timestamp = Date.now());
                  return i;
                },
              },
              pe = {
                gb: function () {
                  e: {
                    if (!se.length) {
                      var e = null;
                      "undefined" != typeof window &&
                      "function" == typeof window.prompt
                        ? ((e = window.prompt("Input: ")),
                          null !== e && (e += "\n"))
                        : "function" == typeof readline &&
                          ((e = readline()), null !== e && (e += "\n"));
                      if (!e) {
                        e = null;
                        break e;
                      }
                      se = ce(e, !0);
                    }
                    e = se.shift();
                  }
                  return e;
                },
                Qa: function (e, t) {
                  null === t || 10 === t
                    ? (g(oe(e.G, 0)), (e.G = []))
                    : 0 != t && e.G.push(t);
                },
                ua: function (e) {
                  e.G && 0 < e.G.length && (g(oe(e.G, 0)), (e.G = []));
                },
                Xb: function () {
                  return {
                    uc: 25856,
                    wc: 5,
                    tc: 191,
                    vc: 35387,
                    sc: [
                      3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22,
                      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ],
                  };
                },
                Yb: function () {
                  return 0;
                },
                Zb: function () {
                  return [24, 80];
                },
              },
              ve = {
                Qa: function (e, t) {
                  null === t || 10 === t
                    ? (b(oe(e.G, 0)), (e.G = []))
                    : 0 != t && e.G.push(t);
                },
                ua: function (e) {
                  e.G && 0 < e.G.length && (b(oe(e.G, 0)), (e.G = []));
                },
              };
            function me(e, t) {
              var n = e.j ? e.j.length : 0;
              n >= t ||
                ((t = Math.max(t, (n * (1048576 > n ? 2 : 1.125)) >>> 0)),
                0 != n && (t = Math.max(t, 256)),
                (n = e.j),
                (e.j = new Uint8Array(t)),
                0 < e.v && e.j.set(n.subarray(0, e.v), 0));
            }
            var ge = {
              O: null,
              U() {
                return ge.createNode(null, "/", 16895, 0);
              },
              createNode(e, t, n, r) {
                if (24576 === (n & 61440) || 4096 === (n & 61440))
                  throw new Fe(63);
                ge.O ||
                  (ge.O = {
                    dir: {
                      node: {
                        Y: ge.l.Y,
                        P: ge.l.P,
                        ma: ge.l.ma,
                        za: ge.l.za,
                        sb: ge.l.sb,
                        xb: ge.l.xb,
                        tb: ge.l.tb,
                        qb: ge.l.qb,
                        Fa: ge.l.Fa,
                      },
                      stream: { ba: ge.m.ba },
                    },
                    file: {
                      node: { Y: ge.l.Y, P: ge.l.P },
                      stream: {
                        ba: ge.m.ba,
                        read: ge.m.read,
                        write: ge.m.write,
                        ta: ge.m.ta,
                        ib: ge.m.ib,
                        kb: ge.m.kb,
                      },
                    },
                    link: {
                      node: { Y: ge.l.Y, P: ge.l.P, na: ge.l.na },
                      stream: {},
                    },
                    Ya: { node: { Y: ge.l.Y, P: ge.l.P }, stream: Ne },
                  });
                n = je(e, t, n, r);
                16384 === (n.mode & 61440)
                  ? ((n.l = ge.O.dir.node), (n.m = ge.O.dir.stream), (n.j = {}))
                  : 32768 === (n.mode & 61440)
                  ? ((n.l = ge.O.file.node),
                    (n.m = ge.O.file.stream),
                    (n.v = 0),
                    (n.j = null))
                  : 40960 === (n.mode & 61440)
                  ? ((n.l = ge.O.link.node), (n.m = ge.O.link.stream))
                  : 8192 === (n.mode & 61440) &&
                    ((n.l = ge.O.Ya.node), (n.m = ge.O.Ya.stream));
                n.timestamp = Date.now();
                e && ((e.j[t] = n), (e.timestamp = n.timestamp));
                return n;
              },
              Bc(e) {
                return e.j
                  ? e.j.subarray
                    ? e.j.subarray(0, e.v)
                    : new Uint8Array(e.j)
                  : new Uint8Array(0);
              },
              l: {
                Y(e) {
                  var t = {};
                  t.zc = 8192 === (e.mode & 61440) ? e.id : 1;
                  t.Dc = e.id;
                  t.mode = e.mode;
                  t.Lc = 1;
                  t.uid = 0;
                  t.Cc = 0;
                  t.Ca = e.Ca;
                  16384 === (e.mode & 61440)
                    ? (t.size = 4096)
                    : 32768 === (e.mode & 61440)
                    ? (t.size = e.v)
                    : 40960 === (e.mode & 61440)
                    ? (t.size = e.link.length)
                    : (t.size = 0);
                  t.qc = new Date(e.timestamp);
                  t.Jc = new Date(e.timestamp);
                  t.xc = new Date(e.timestamp);
                  t.Fb = 4096;
                  t.rc = Math.ceil(t.size / t.Fb);
                  return t;
                },
                P(e, t) {
                  void 0 !== t.mode && (e.mode = t.mode);
                  void 0 !== t.timestamp && (e.timestamp = t.timestamp);
                  if (void 0 !== t.size && ((t = t.size), e.v != t))
                    if (0 == t) (e.j = null), (e.v = 0);
                    else {
                      var n = e.j;
                      e.j = new Uint8Array(t);
                      n && e.j.set(n.subarray(0, Math.min(t, e.v)));
                      e.v = t;
                    }
                },
                ma() {
                  throw Re[44];
                },
                za(e, t, n, r) {
                  return ge.createNode(e, t, n, r);
                },
                sb(e, t, n) {
                  if (16384 === (e.mode & 61440)) {
                    try {
                      var r = Te(t, n);
                    } catch (e) {}
                    if (r) for (var i in r.j) throw new Fe(55);
                  }
                  delete e.parent.j[e.name];
                  e.parent.timestamp = Date.now();
                  e.name = n;
                  t.j[n] = e;
                  t.timestamp = e.parent.timestamp;
                  e.parent = t;
                },
                xb(e, t) {
                  delete e.j[t];
                  e.timestamp = Date.now();
                },
                tb(e, t) {
                  var n,
                    r = Te(e, t);
                  for (n in r.j) throw new Fe(55);
                  delete e.j[t];
                  e.timestamp = Date.now();
                },
                qb(e) {
                  var t,
                    n = [".", ".."];
                  for (t in e.j) e.j.hasOwnProperty(t) && n.push(t);
                  return n;
                },
                Fa(e, t, n) {
                  e = ge.createNode(e, t, 41471, 0);
                  e.link = n;
                  return e;
                },
                na(e) {
                  if (40960 !== (e.mode & 61440)) throw new Fe(28);
                  return e.link;
                },
              },
              m: {
                read(e, t, n, r, i) {
                  var a = e.node.j;
                  if (i >= e.node.v) return 0;
                  e = Math.min(e.node.v - i, r);
                  if (8 < e && a.subarray) t.set(a.subarray(i, i + e), n);
                  else for (r = 0; r < e; r++) t[n + r] = a[i + r];
                  return e;
                },
                write(e, t, n, r, i, a) {
                  t.buffer === A.buffer && (a = !1);
                  if (!r) return 0;
                  e = e.node;
                  e.timestamp = Date.now();
                  if (t.subarray && (!e.j || e.j.subarray)) {
                    if (a) return (e.j = t.subarray(n, n + r)), (e.v = r);
                    if (0 === e.v && 0 === i)
                      return (e.j = t.slice(n, n + r)), (e.v = r);
                    if (i + r <= e.v)
                      return e.j.set(t.subarray(n, n + r), i), r;
                  }
                  me(e, i + r);
                  if (e.j.subarray && t.subarray)
                    e.j.set(t.subarray(n, n + r), i);
                  else for (a = 0; a < r; a++) e.j[i + a] = t[n + a];
                  e.v = Math.max(e.v, i + r);
                  return r;
                },
                ba(e, t, n) {
                  1 === n
                    ? (t += e.position)
                    : 2 === n &&
                      32768 === (e.node.mode & 61440) &&
                      (t += e.node.v);
                  if (0 > t) throw new Fe(28);
                  return t;
                },
                ta(e, t, n) {
                  me(e.node, t + n);
                  e.node.v = Math.max(e.node.v, t + n);
                },
                ib(e, t, n, r, i) {
                  if (32768 !== (e.node.mode & 61440)) throw new Fe(43);
                  e = e.node.j;
                  if (i & 2 || e.buffer !== A.buffer) {
                    (0 < n || n + t < e.length) &&
                      (e = e.subarray
                        ? e.subarray(n, n + t)
                        : Array.prototype.slice.call(e, n, n + t));
                    n = !0;
                    V();
                    t = void 0;
                    if (!t) throw new Fe(48);
                    A.set(e, t);
                  } else (n = !1), (t = e.byteOffset);
                  return { o: t, M: n };
                },
                kb(e, t, n, r) {
                  ge.m.write(e, t, 0, r, n, !1);
                  return 0;
                },
              },
            };
            function be(e, t) {
              var n = 0;
              e && (n |= 365);
              t && (n |= 146);
              return n;
            }
            var ye,
              we,
              _e,
              Ae,
              Ce = null,
              Me = {},
              Ee = [],
              Pe = 1,
              Ie = null,
              Le = !0,
              Fe = null,
              Re = {},
              Se = (e, t = {}) => {
                e = ie(e);
                if (!e) return { path: "", node: null };
                t = Object.assign({ eb: !0, Sa: 0 }, t);
                if (8 < t.Sa) throw new Fe(32);
                e = e.split("/").filter((e) => !!e);
                for (var n = Ce, r = "/", i = 0; i < e.length; i++) {
                  var a = i === e.length - 1;
                  if (a && t.parent) break;
                  n = Te(n, e[i]);
                  r = Q(r + "/" + e[i]);
                  n.Aa && (!a || (a && t.eb)) && (n = n.Aa.root);
                  if (!a || t.cb)
                    for (a = 0; 40960 === (n.mode & 61440); )
                      if (
                        ((n = Xe(r)),
                        (r = ie(ee(r), n)),
                        (n = Se(r, { Sa: t.Sa + 1 }).node),
                        40 < a++)
                      )
                        throw new Fe(32);
                }
                return { path: r, node: n };
              },
              xe = (e) => {
                for (var t; ; ) {
                  if (e === e.parent)
                    return (
                      (e = e.U.jb),
                      t ? ("/" !== e[e.length - 1] ? `${e}/${t}` : e + t) : e
                    );
                  t = t ? `${e.name}/${t}` : e.name;
                  e = e.parent;
                }
              },
              ke = (e, t) => {
                for (var n = 0, r = 0; r < t.length; r++)
                  n = ((n << 5) - n + t.charCodeAt(r)) | 0;
                return ((e + n) >>> 0) % Ie.length;
              },
              Te = (e, t) => {
                var n;
                if ((n = (n = We(e, "x")) ? n : e.l.ma ? 0 : 2))
                  throw new Fe(n, e);
                for (n = Ie[ke(e.id, t)]; n; n = n.bc) {
                  var r = n.name;
                  if (n.parent.id === e.id && r === t) return n;
                }
                return e.l.ma(e, t);
              },
              je = (e, t, n, r) => {
                e = new ar(e, t, n, r);
                t = ke(e.parent.id, e.name);
                e.bc = Ie[t];
                return (Ie[t] = e);
              },
              Oe = (e) => {
                var t = ["r", "w", "rw"][e & 3];
                e & 512 && (t += "w");
                return t;
              },
              We = (e, t) =>
                Le
                  ? 0
                  : !t.includes("r") || e.mode & 292
                  ? (t.includes("w") && !(e.mode & 146)) ||
                    (t.includes("x") && !(e.mode & 73))
                    ? 2
                    : 0
                  : 2,
              Be = (e, t) => {
                try {
                  return Te(e, t), 20;
                } catch (e) {}
                return We(e, "wx");
              },
              De = () => {
                for (var e = 0; 4096 >= e; e++) if (!Ee[e]) return e;
                throw new Fe(33);
              },
              Ve = (e) => {
                e = Ee[e];
                if (!e) throw new Fe(8);
                return e;
              },
              Ue = (t, n = -1) => {
                _e ||
                  ((_e = function () {
                    (this || e).h = {};
                  }),
                  (_e.prototype = {}),
                  Object.defineProperties(_e.prototype, {
                    object: {
                      get() {
                        return (this || e).node;
                      },
                      set(t) {
                        (this || e).node = t;
                      },
                    },
                    flags: {
                      get() {
                        return (this || e).h.flags;
                      },
                      set(t) {
                        (this || e).h.flags = t;
                      },
                    },
                    position: {
                      get() {
                        return (this || e).h.position;
                      },
                      set(t) {
                        (this || e).h.position = t;
                      },
                    },
                  }));
                t = Object.assign(new _e(), t);
                -1 == n && (n = De());
                t.X = n;
                return (Ee[n] = t);
              },
              Ne = {
                open: (e) => {
                  e.m = Me[e.node.Ca].m;
                  e.m.open && e.m.open(e);
                },
                ba: () => {
                  throw new Fe(70);
                },
              },
              $e = (e, t) => {
                Me[e] = { m: t };
              },
              Ge = (e, t) => {
                var n = "/" === t,
                  r = !t;
                if (n && Ce) throw new Fe(10);
                if (!n && !r) {
                  var i = Se(t, { eb: !1 });
                  t = i.path;
                  i = i.node;
                  if (i.Aa) throw new Fe(10);
                  if (16384 !== (i.mode & 61440)) throw new Fe(54);
                }
                t = { type: e, Nc: {}, jb: t, ac: [] };
                e = e.U(t);
                e.U = t;
                t.root = e;
                n ? (Ce = e) : i && ((i.Aa = t), i.U && i.U.ac.push(t));
              },
              ze = (e, t, n) => {
                var r = Se(e, { parent: !0 }).node;
                e = te(e);
                if (!e || "." === e || ".." === e) throw new Fe(28);
                var i = Be(r, e);
                if (i) throw new Fe(i);
                if (!r.l.za) throw new Fe(63);
                return r.l.za(r, e, t, n);
              },
              He = (e, t, n) => {
                "undefined" == typeof n && ((n = t), (t = 438));
                ze(e, t | 8192, n);
              },
              Ye = (e, t) => {
                if (!ie(e)) throw new Fe(44);
                var n = Se(t, { parent: !0 }).node;
                if (!n) throw new Fe(44);
                t = te(t);
                var r = Be(n, t);
                if (r) throw new Fe(r);
                if (!n.l.Fa) throw new Fe(63);
                n.l.Fa(n, t, e);
              },
              Xe = (e) => {
                e = Se(e).node;
                if (!e) throw new Fe(44);
                if (!e.l.na) throw new Fe(28);
                return ie(xe(e.parent), e.l.na(e));
              },
              qe = (e, t, n) => {
                if ("" === e) throw new Fe(44);
                if ("string" == typeof t) {
                  var r = {
                    r: 0,
                    "r+": 2,
                    w: 577,
                    "w+": 578,
                    a: 1089,
                    "a+": 1090,
                  }[t];
                  if ("undefined" == typeof r)
                    throw Error(`Unknown file open mode: ${t}`);
                  t = r;
                }
                n =
                  t & 64
                    ? (("undefined" == typeof n ? 438 : n) & 4095) | 32768
                    : 0;
                if ("object" == typeof e) var i = e;
                else {
                  e = Q(e);
                  try {
                    i = Se(e, { cb: !(t & 131072) }).node;
                  } catch (e) {}
                }
                r = !1;
                if (t & 64)
                  if (i) {
                    if (t & 128) throw new Fe(20);
                  } else (i = ze(e, n, 0)), (r = !0);
                if (!i) throw new Fe(44);
                8192 === (i.mode & 61440) && (t &= -513);
                if (t & 65536 && 16384 !== (i.mode & 61440)) throw new Fe(54);
                if (
                  !r &&
                  (n = i
                    ? 40960 === (i.mode & 61440)
                      ? 32
                      : 16384 === (i.mode & 61440) && ("r" !== Oe(t) || t & 512)
                      ? 31
                      : We(i, Oe(t))
                    : 44)
                )
                  throw new Fe(n);
                if (t & 512 && !r) {
                  n = i;
                  n = "string" == typeof n ? Se(n, { cb: !0 }).node : n;
                  if (!n.l.P) throw new Fe(63);
                  if (16384 === (n.mode & 61440)) throw new Fe(31);
                  if (32768 !== (n.mode & 61440)) throw new Fe(28);
                  if ((r = We(n, "w"))) throw new Fe(r);
                  n.l.P(n, { size: 0, timestamp: Date.now() });
                }
                t &= -131713;
                i = Ue({
                  node: i,
                  path: xe(i),
                  flags: t,
                  seekable: !0,
                  position: 0,
                  m: i.m,
                  pc: [],
                  error: !1,
                });
                i.m.open && i.m.open(i);
                !a.logReadFiles ||
                  t & 1 ||
                  (Ae || (Ae = {}), e in Ae || (Ae[e] = 1));
                return i;
              },
              Je = (e, t, n) => {
                if (null === e.X) throw new Fe(8);
                if (!e.seekable || !e.m.ba) throw new Fe(70);
                if (0 != n && 1 != n && 2 != n) throw new Fe(28);
                e.position = e.m.ba(e, t, n);
                e.pc = [];
              },
              Ke = () => {
                Fe ||
                  ((Fe = function (t, n) {
                    (this || e).name = "ErrnoError";
                    (this || e).node = n;
                    (this || e).ec = function (t) {
                      (this || e).aa = t;
                    };
                    this.ec(t);
                    (this || e).message = "FS error";
                  }),
                  (Fe.prototype = Error()),
                  (Fe.prototype.constructor = Fe),
                  [44].forEach((e) => {
                    Re[e] = new Fe(e);
                    Re[e].stack = "<generic error, no stack>";
                  }));
              },
              Ze = (e, t, n) => {
                e = Q("/dev/" + e);
                var r = be(!!t, !!n);
                we || (we = 64);
                var i = we++ << 8;
                $e(i, {
                  open: (e) => {
                    e.seekable = !1;
                  },
                  close: () => {
                    n && n.buffer && n.buffer.length && n(10);
                  },
                  read: (e, n, r, i) => {
                    for (var a = 0, o = 0; o < i; o++) {
                      try {
                        var s = t();
                      } catch (e) {
                        throw new Fe(29);
                      }
                      if (void 0 === s && 0 === a) throw new Fe(6);
                      if (null === s || void 0 === s) break;
                      a++;
                      n[r + o] = s;
                    }
                    a && (e.node.timestamp = Date.now());
                    return a;
                  },
                  write: (e, t, r, i) => {
                    for (var a = 0; a < i; a++)
                      try {
                        n(t[r + a]);
                      } catch (e) {
                        throw new Fe(29);
                      }
                    i && (e.node.timestamp = Date.now());
                    return a;
                  },
                });
                He(e, r, i);
              },
              Qe = {},
              et = void 0;
            function tt() {
              et += 4;
              return P[(et - 4) >> 2];
            }
            function nt(e) {
              if (void 0 === e) return "_unknown";
              e = e.replace(/[^a-zA-Z0-9_]/g, "$");
              var t = e.charCodeAt(0);
              return 48 <= t && 57 >= t ? `_${e}` : e;
            }
            function rt(t, n) {
              t = nt(t);
              return {
                [t]: function () {
                  return n.apply(this || e, arguments);
                },
              }[t];
            }
            function it() {
              (this || e).M = [void 0];
              (this || e).fb = [];
            }
            var at = new it(),
              ot = void 0;
            function st(e) {
              throw new ot(e);
            }
            var ut = (e) => {
                e || st("Cannot use deleted val. handle = " + e);
                return at.get(e).value;
              },
              lt = (e) => {
                switch (e) {
                  case void 0:
                    return 1;
                  case null:
                    return 2;
                  case !0:
                    return 3;
                  case !1:
                    return 4;
                  default:
                    return at.ta({ rb: 1, value: e });
                }
              };
            function ct(t) {
              var n = Error,
                r = rt(t, function (n) {
                  (this || e).name = t;
                  (this || e).message = n;
                  n = Error(n).stack;
                  void 0 !== n &&
                    ((this || e).stack =
                      this.toString() +
                      "\n" +
                      n.replace(/^Error(:[^\n]*)?\n/, ""));
                });
              r.prototype = Object.create(n.prototype);
              r.prototype.constructor = r;
              r.prototype.toString = function () {
                return void 0 === (this || e).message
                  ? (this || e).name
                  : `${(this || e).name}: ${(this || e).message}`;
              };
              return r;
            }
            var ft = void 0,
              ht = void 0;
            function dt(e) {
              for (var t = ""; C[e]; ) t += ht[C[e++]];
              return t;
            }
            var pt = [];
            function vt() {
              for (; pt.length; ) {
                var e = pt.pop();
                e.g.ia = !1;
                e.delete();
              }
            }
            var mt = void 0,
              gt = {};
            function bt(e, t) {
              for (void 0 === t && st("ptr should not be undefined"); e.A; )
                (t = e.pa(t)), (e = e.A);
              return t;
            }
            var yt = {};
            function wt(e) {
              e = gr(e);
              var t = dt(e);
              fr(e);
              return t;
            }
            function _t(e, t) {
              var n = yt[e];
              void 0 === n && st(t + " has unknown type " + wt(e));
              return n;
            }
            function At() {}
            var Ct = !1;
            function Mt(e) {
              --e.count.value;
              0 === e.count.value && (e.H ? e.L.W(e.H) : e.u.i.W(e.o));
            }
            function Et(e, t, n) {
              if (t === n) return e;
              if (void 0 === n.A) return null;
              e = Et(e, t, n.A);
              return null === e ? null : n.Jb(e);
            }
            var Pt = {};
            function It(e, t) {
              t = bt(e, t);
              return gt[t];
            }
            var Lt = void 0;
            function Ft(e) {
              throw new Lt(e);
            }
            function Rt(e, t) {
              (t.u && t.o) || Ft("makeClassHandle requires ptr and ptrType");
              !!t.L !== !!t.H &&
                Ft("Both smartPtrType and smartPtr must be specified");
              t.count = { value: 1 };
              return St(Object.create(e, { g: { value: t } }));
            }
            function St(e) {
              if ("undefined" === typeof FinalizationRegistry)
                return (St = (e) => e), e;
              Ct = new FinalizationRegistry((e) => {
                Mt(e.g);
              });
              St = (e) => {
                var t = e.g;
                t.H && Ct.register(e, { g: t }, e);
                return e;
              };
              At = (e) => {
                Ct.unregister(e);
              };
              return St(e);
            }
            var xt = {};
            function kt(e) {
              for (; e.length; ) {
                var t = e.pop();
                e.pop()(t);
              }
            }
            function Tt(e) {
              return this.fromWireType(P[e >> 2]);
            }
            var jt = {},
              Ot = {};
            function Wt(e, t, n) {
              function r(t) {
                t = n(t);
                t.length !== e.length && Ft("Mismatched type converter count");
                for (var r = 0; r < e.length; ++r) Vt(e[r], t[r]);
              }
              e.forEach(function (e) {
                Ot[e] = t;
              });
              var i = Array(t.length),
                a = [],
                o = 0;
              t.forEach((e, t) => {
                yt.hasOwnProperty(e)
                  ? (i[t] = yt[e])
                  : (a.push(e),
                    jt.hasOwnProperty(e) || (jt[e] = []),
                    jt[e].push(() => {
                      i[t] = yt[e];
                      ++o;
                      o === a.length && r(i);
                    }));
              });
              0 === a.length && r(i);
            }
            function Bt(e) {
              switch (e) {
                case 1:
                  return 0;
                case 2:
                  return 1;
                case 4:
                  return 2;
                case 8:
                  return 3;
                default:
                  throw new TypeError(`Unknown type size: ${e}`);
              }
            }
            function Dt(e, t, n = {}) {
              var r = t.name;
              e ||
                st(`type "${r}" must have a positive integer typeid pointer`);
              if (yt.hasOwnProperty(e)) {
                if (n.Ub) return;
                st(`Cannot register type '${r}' twice`);
              }
              yt[e] = t;
              delete Ot[e];
              jt.hasOwnProperty(e) &&
                ((t = jt[e]), delete jt[e], t.forEach((e) => e()));
            }
            function Vt(e, t, n = {}) {
              if (!("argPackAdvance" in t))
                throw new TypeError(
                  "registerType registeredInstance requires argPackAdvance"
                );
              Dt(e, t, n);
            }
            function Ut(e) {
              st(e.g.u.i.name + " instance already deleted");
            }
            function Nt() {}
            function $t(t, n, r) {
              if (void 0 === t[n].B) {
                var i = t[n];
                t[n] = function () {
                  t[n].B.hasOwnProperty(arguments.length) ||
                    st(
                      `Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${t[n].B})!`
                    );
                  return t[n].B[arguments.length].apply(this || e, arguments);
                };
                t[n].B = [];
                t[n].B[i.ha] = i;
              }
            }
            function Gt(e, t, n) {
              a.hasOwnProperty(e)
                ? ((void 0 === n ||
                    (void 0 !== a[e].B && void 0 !== a[e].B[n])) &&
                    st(`Cannot register public name '${e}' twice`),
                  $t(a, e, e),
                  a.hasOwnProperty(n) &&
                    st(
                      `Cannot register multiple overloads of a function with the same number of arguments (${n})!`
                    ),
                  (a[e].B[n] = t))
                : ((a[e] = t), void 0 !== n && (a[e].Mc = n));
            }
            function zt(t, n, r, i, a, o, s, u) {
              (this || e).name = t;
              (this || e).constructor = n;
              (this || e).N = r;
              (this || e).W = i;
              (this || e).A = a;
              (this || e).Ob = o;
              (this || e).pa = s;
              (this || e).Jb = u;
              (this || e).nb = [];
            }
            function Ht(e, t, n) {
              for (; t !== n; )
                t.pa ||
                  st(
                    `Expected null or instance of ${n.name}, got an instance of ${t.name}`
                  ),
                  (e = t.pa(e)),
                  (t = t.A);
              return e;
            }
            function Yt(t, n) {
              if (null === n)
                return (
                  (this || e).Pa &&
                    st(`null is not a valid ${(this || e).name}`),
                  0
                );
              n.g || st(`Cannot pass "${cn(n)}" as a ${(this || e).name}`);
              n.g.o ||
                st(
                  `Cannot pass deleted object as a pointer of type ${
                    (this || e).name
                  }`
                );
              return Ht(n.g.o, n.g.u.i, (this || e).i);
            }
            function Xt(t, n) {
              if (null === n) {
                (this || e).Pa && st(`null is not a valid ${(this || e).name}`);
                if ((this || e).ya) {
                  var r = this.Ra();
                  null !== t && t.push((this || e).W, r);
                  return r;
                }
                return 0;
              }
              n.g || st(`Cannot pass "${cn(n)}" as a ${(this || e).name}`);
              n.g.o ||
                st(
                  `Cannot pass deleted object as a pointer of type ${
                    (this || e).name
                  }`
                );
              !(this || e).xa &&
                n.g.u.xa &&
                st(
                  `Cannot convert argument of type ${
                    n.g.L ? n.g.L.name : n.g.u.name
                  } to parameter type ${(this || e).name}`
                );
              r = Ht(n.g.o, n.g.u.i, (this || e).i);
              if ((this || e).ya)
                switch (
                  (void 0 === n.g.H &&
                    st("Passing raw pointer to smart pointer is illegal"),
                  (this || e).jc)
                ) {
                  case 0:
                    n.g.L === (this || e)
                      ? (r = n.g.H)
                      : st(
                          `Cannot convert argument of type ${
                            n.g.L ? n.g.L.name : n.g.u.name
                          } to parameter type ${(this || e).name}`
                        );
                    break;
                  case 1:
                    r = n.g.H;
                    break;
                  case 2:
                    if (n.g.L === (this || e)) r = n.g.H;
                    else {
                      var i = n.clone();
                      r = this.dc(
                        r,
                        lt(function () {
                          i.delete();
                        })
                      );
                      null !== t && t.push((this || e).W, r);
                    }
                    break;
                  default:
                    st("Unsupporting sharing policy");
                }
              return r;
            }
            function qt(t, n) {
              if (null === n)
                return (
                  (this || e).Pa &&
                    st(`null is not a valid ${(this || e).name}`),
                  0
                );
              n.g || st(`Cannot pass "${cn(n)}" as a ${(this || e).name}`);
              n.g.o ||
                st(
                  `Cannot pass deleted object as a pointer of type ${
                    (this || e).name
                  }`
                );
              n.g.u.xa &&
                st(
                  `Cannot convert argument of type ${
                    n.g.u.name
                  } to parameter type ${(this || e).name}`
                );
              return Ht(n.g.o, n.g.u.i, (this || e).i);
            }
            function Jt(t, n, r, i) {
              (this || e).name = t;
              (this || e).i = n;
              (this || e).Pa = r;
              (this || e).xa = i;
              (this || e).ya = !1;
              (this || e).W =
                (this || e).dc =
                (this || e).Ra =
                (this || e).pb =
                (this || e).jc =
                (this || e).cc =
                  void 0;
              void 0 !== n.A
                ? ((this || e).toWireType = Xt)
                : (((this || e).toWireType = i ? Yt : qt),
                  ((this || e).K = null));
            }
            function Kt(e, t, n) {
              a.hasOwnProperty(e) || Ft("Replacing nonexistant public symbol");
              void 0 !== a[e].B && void 0 !== n
                ? (a[e].B[n] = t)
                : ((a[e] = t), (a[e].ha = n));
            }
            var Zt = [],
              Qt = (e) => {
                var t = Zt[e];
                t ||
                  (e >= Zt.length && (Zt.length = e + 1),
                  (Zt[e] = t = x.get(e)));
                return t;
              },
              en = (e, t) => {
                var n = [];
                return function () {
                  n.length = 0;
                  Object.assign(n, arguments);
                  if (e.includes("j")) {
                    var r = a["dynCall_" + e];
                    r =
                      n && n.length
                        ? r.apply(null, [t].concat(n))
                        : r.call(null, t);
                  } else r = Qt(t).apply(null, n);
                  return r;
                };
              };
            function tn(e, t) {
              e = dt(e);
              var n = e.includes("j") ? en(e, t) : Qt(t);
              "function" != typeof n &&
                st(`unknown function pointer with signature ${e}: ${t}`);
              return n;
            }
            var nn = void 0;
            function rn(e, t) {
              function n(e) {
                i[e] ||
                  yt[e] ||
                  (Ot[e] ? Ot[e].forEach(n) : (r.push(e), (i[e] = !0)));
              }
              var r = [],
                i = {};
              t.forEach(n);
              throw new nn(`${e}: ` + r.map(wt).join([", "]));
            }
            function an(t, n, r, i, a) {
              var o = n.length;
              2 > o &&
                st(
                  "argTypes array size mismatch! Must at least get return value and 'this' types!"
                );
              var s = null !== n[1] && null !== r,
                u = !1;
              for (r = 1; r < n.length; ++r)
                if (null !== n[r] && void 0 === n[r].K) {
                  u = !0;
                  break;
                }
              var l = "void" !== n[0].name,
                c = o - 2,
                f = Array(c),
                h = [],
                d = [];
              return function () {
                arguments.length !== c &&
                  st(
                    `function ${t} called with ${arguments.length} arguments, expected ${c} args!`
                  );
                d.length = 0;
                h.length = s ? 2 : 1;
                h[0] = a;
                if (s) {
                  var r = n[1].toWireType(d, this || e);
                  h[1] = r;
                }
                for (var o = 0; o < c; ++o)
                  (f[o] = n[o + 2].toWireType(d, arguments[o])), h.push(f[o]);
                o = i.apply(null, h);
                if (u) kt(d);
                else
                  for (var p = s ? 1 : 2; p < n.length; p++) {
                    var v = 1 === p ? r : f[p - 2];
                    null !== n[p].K && n[p].K(v);
                  }
                r = l ? n[0].fromWireType(o) : void 0;
                return r;
              };
            }
            function on(e, t) {
              for (var n = [], r = 0; r < e; r++) n.push(I[(t + 4 * r) >> 2]);
              return n;
            }
            function sn(e, t, n) {
              e instanceof Object || st(`${n} with invalid "this": ${e}`);
              e instanceof t.i.constructor ||
                st(
                  `${n} incompatible with "this" of type ${e.constructor.name}`
                );
              e.g.o ||
                st(
                  `cannot call emscripten binding method ${n} on deleted object`
                );
              return Ht(e.g.o, e.g.u.i, t.i);
            }
            function un(e) {
              e >= at.h && 0 === --at.get(e).rb && at.Tb(e);
            }
            function ln(e, t, n) {
              switch (t) {
                case 0:
                  return function (e) {
                    return this.fromWireType((n ? A : C)[e]);
                  };
                case 1:
                  return function (e) {
                    return this.fromWireType((n ? M : E)[e >> 1]);
                  };
                case 2:
                  return function (e) {
                    return this.fromWireType((n ? P : I)[e >> 2]);
                  };
                default:
                  throw new TypeError("Unknown integer type: " + e);
              }
            }
            function cn(e) {
              if (null === e) return "null";
              var t = typeof e;
              return "object" === t || "array" === t || "function" === t
                ? e.toString()
                : "" + e;
            }
            function fn(e, t) {
              switch (t) {
                case 2:
                  return function (e) {
                    return this.fromWireType(L[e >> 2]);
                  };
                case 3:
                  return function (e) {
                    return this.fromWireType(F[e >> 3]);
                  };
                default:
                  throw new TypeError("Unknown float type: " + e);
              }
            }
            function hn(e, t, n) {
              switch (t) {
                case 0:
                  return n
                    ? function (e) {
                        return A[e];
                      }
                    : function (e) {
                        return C[e];
                      };
                case 1:
                  return n
                    ? function (e) {
                        return M[e >> 1];
                      }
                    : function (e) {
                        return E[e >> 1];
                      };
                case 2:
                  return n
                    ? function (e) {
                        return P[e >> 2];
                      }
                    : function (e) {
                        return I[e >> 2];
                      };
                default:
                  throw new TypeError("Unknown integer type: " + e);
              }
            }
            var dn =
                "undefined" != typeof TextDecoder
                  ? new TextDecoder("utf-16le")
                  : void 0,
              pn = (e, t) => {
                var n = e >> 1;
                for (var r = n + t / 2; !(n >= r) && E[n]; ) ++n;
                n <<= 1;
                if (32 < n - e && dn) return dn.decode(C.subarray(e, n));
                n = "";
                for (r = 0; !(r >= t / 2); ++r) {
                  var i = M[(e + 2 * r) >> 1];
                  if (0 == i) break;
                  n += String.fromCharCode(i);
                }
                return n;
              },
              vn = (e, t, n) => {
                void 0 === n && (n = 2147483647);
                if (2 > n) return 0;
                n -= 2;
                var r = t;
                n = n < 2 * e.length ? n / 2 : e.length;
                for (var i = 0; i < n; ++i)
                  (M[t >> 1] = e.charCodeAt(i)), (t += 2);
                M[t >> 1] = 0;
                return t - r;
              },
              mn = (e) => 2 * e.length,
              gn = (e, t) => {
                for (var n = 0, r = ""; !(n >= t / 4); ) {
                  var i = P[(e + 4 * n) >> 2];
                  if (0 == i) break;
                  ++n;
                  65536 <= i
                    ? ((i -= 65536),
                      (r += String.fromCharCode(
                        55296 | (i >> 10),
                        56320 | (i & 1023)
                      )))
                    : (r += String.fromCharCode(i));
                }
                return r;
              },
              bn = (e, t, n) => {
                void 0 === n && (n = 2147483647);
                if (4 > n) return 0;
                var r = t;
                n = r + n - 4;
                for (var i = 0; i < e.length; ++i) {
                  var a = e.charCodeAt(i);
                  if (55296 <= a && 57343 >= a) {
                    var o = e.charCodeAt(++i);
                    a = (65536 + ((a & 1023) << 10)) | (o & 1023);
                  }
                  P[t >> 2] = a;
                  t += 4;
                  if (t + 4 > n) break;
                }
                P[t >> 2] = 0;
                return t - r;
              },
              yn = (e) => {
                for (var t = 0, n = 0; n < e.length; ++n) {
                  var r = e.charCodeAt(n);
                  55296 <= r && 57343 >= r && ++n;
                  t += 4;
                }
                return t;
              },
              wn = {};
            function _n(e) {
              var t = wn[e];
              return void 0 === t ? dt(e) : t;
            }
            var An = [];
            function Cn(e) {
              var t = An.length;
              An.push(e);
              return t;
            }
            function Mn(e, t) {
              for (var n = Array(e), r = 0; r < e; ++r)
                n[r] = _t(I[(t + 4 * r) >> 2], "parameter " + r);
              return n;
            }
            var En = [],
              Pn = [];
            function In(e) {
              e.Ac = e.getExtension(
                "WEBGL_draw_instanced_base_vertex_base_instance"
              );
            }
            function Ln(e) {
              e.Ic = e.getExtension(
                "WEBGL_multi_draw_instanced_base_vertex_base_instance"
              );
            }
            var Fn = 1,
              Rn = [],
              Sn = [],
              xn = [],
              kn = [],
              Tn = [],
              jn = [],
              On = [],
              Wn = [],
              Bn = {};
            function Dn(e) {
              Gn || (Gn = e);
            }
            function Vn(e) {
              for (var t = Fn++, n = e.length; n < t; n++) e[n] = null;
              return t;
            }
            function Un(e, t) {
              var n = Vn(Wn),
                r = { handle: n, attributes: t, version: t.Ec, C: e };
              e.canvas && (e.canvas.zb = r);
              Wn[n] = r;
              ("undefined" == typeof t.Kb || t.Kb) && $n(r);
              return n;
            }
            function Nn(e) {
              zn = Wn[e];
              a.yc = ur = zn && zn.C;
              return !(e && !ur);
            }
            function $n(e) {
              e || (e = zn);
              if (!e.Vb) {
                e.Vb = !0;
                var t = e.C;
                In(t);
                Ln(t);
                2 <= e.version &&
                  (t.ab = t.getExtension("EXT_disjoint_timer_query_webgl2"));
                (2 > e.version || !t.ab) &&
                  (t.ab = t.getExtension("EXT_disjoint_timer_query"));
                Hn(t);
                (t.getSupportedExtensions() || []).forEach(function (e) {
                  e.includes("lose_context") ||
                    e.includes("debug") ||
                    t.getExtension(e);
                });
              }
            }
            var Gn, zn;
            function Hn(e) {
              e.Kc = e.getExtension("WEBGL_multi_draw");
            }
            var Yn,
              Xn = {},
              qn = () => {
                if (!Yn) {
                  var e,
                    t = {
                      USER: "web_user",
                      LOGNAME: "web_user",
                      PATH: "/",
                      PWD: "/",
                      HOME: "/home/web_user",
                      LANG:
                        (
                          ("object" == typeof navigator &&
                            navigator.languages &&
                            navigator.languages[0]) ||
                          "C"
                        ).replace("-", "_") + ".UTF-8",
                      _: d || "./this.program",
                    };
                  for (e in Xn) void 0 === Xn[e] ? delete t[e] : (t[e] = Xn[e]);
                  var n = [];
                  for (e in t) n.push(`${e}=${t[e]}`);
                  Yn = n;
                }
                return Yn;
              },
              Jn = [];
            function Kn(e, t, n, r) {
              for (var i = 0; i < e; i++) {
                var a = ur[n](),
                  o = a && Vn(r);
                a ? ((a.name = o), (r[o] = a)) : Dn(1282);
                P[(t + 4 * i) >> 2] = o;
              }
            }
            function Zn(e, t) {
              if (t) {
                var n = void 0;
                switch (e) {
                  case 36346:
                    n = 1;
                    break;
                  case 36344:
                    return;
                  case 34814:
                  case 36345:
                    n = 0;
                    break;
                  case 34466:
                    var r = ur.getParameter(34467);
                    n = r ? r.length : 0;
                    break;
                  case 33309:
                    if (2 > zn.version) {
                      Dn(1282);
                      return;
                    }
                    n = 2 * (ur.getSupportedExtensions() || []).length;
                    break;
                  case 33307:
                  case 33308:
                    if (2 > zn.version) {
                      Dn(1280);
                      return;
                    }
                    n = 33307 == e ? 3 : 0;
                }
                if (void 0 === n)
                  switch (((r = ur.getParameter(e)), typeof r)) {
                    case "number":
                      n = r;
                      break;
                    case "boolean":
                      n = r ? 1 : 0;
                      break;
                    case "string":
                      Dn(1280);
                      return;
                    case "object":
                      if (null === r)
                        switch (e) {
                          case 34964:
                          case 35725:
                          case 34965:
                          case 36006:
                          case 36007:
                          case 32873:
                          case 34229:
                          case 36662:
                          case 36663:
                          case 35053:
                          case 35055:
                          case 36010:
                          case 35097:
                          case 35869:
                          case 32874:
                          case 36389:
                          case 35983:
                          case 35368:
                          case 34068:
                            n = 0;
                            break;
                          default:
                            Dn(1280);
                            return;
                        }
                      else {
                        if (
                          r instanceof Float32Array ||
                          r instanceof Uint32Array ||
                          r instanceof Int32Array ||
                          r instanceof Array
                        ) {
                          for (e = 0; e < r.length; ++e)
                            P[(t + 4 * e) >> 2] = r[e];
                          return;
                        }
                        try {
                          n = r.name | 0;
                        } catch (t) {
                          Dn(1280);
                          b(
                            "GL_INVALID_ENUM in glGet0v: Unknown object returned from WebGL getParameter(" +
                              e +
                              ")! (error: " +
                              t +
                              ")"
                          );
                          return;
                        }
                      }
                      break;
                    default:
                      Dn(1280);
                      b(
                        "GL_INVALID_ENUM in glGet0v: Native code calling glGet0v(" +
                          e +
                          ") and it returns " +
                          r +
                          " of type " +
                          typeof r +
                          "!"
                      );
                      return;
                  }
                P[t >> 2] = n;
              } else Dn(1281);
            }
            var Qn = (e) => {
              var t = ue(e) + 1,
                n = hr(t);
              n && le(e, C, n, t);
              return n;
            };
            function er(e) {
              return "]" == e.slice(-1) && e.lastIndexOf("[");
            }
            var tr = (e) => 0 === e % 4 && (0 !== e % 100 || 0 === e % 400),
              nr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
              rr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
              ir = (e, t, n, r) => {
                function i(e, t, n) {
                  for (
                    e = "number" == typeof e ? e.toString() : e || "";
                    e.length < t;

                  )
                    e = n[0] + e;
                  return e;
                }
                function a(e, t) {
                  return i(e, t, "0");
                }
                function o(e, t) {
                  function n(e) {
                    return 0 > e ? -1 : 0 < e ? 1 : 0;
                  }
                  var r;
                  0 === (r = n(e.getFullYear() - t.getFullYear())) &&
                    0 === (r = n(e.getMonth() - t.getMonth())) &&
                    (r = n(e.getDate() - t.getDate()));
                  return r;
                }
                function s(e) {
                  switch (e.getDay()) {
                    case 0:
                      return new Date(e.getFullYear() - 1, 11, 29);
                    case 1:
                      return e;
                    case 2:
                      return new Date(e.getFullYear(), 0, 3);
                    case 3:
                      return new Date(e.getFullYear(), 0, 2);
                    case 4:
                      return new Date(e.getFullYear(), 0, 1);
                    case 5:
                      return new Date(e.getFullYear() - 1, 11, 31);
                    case 6:
                      return new Date(e.getFullYear() - 1, 11, 30);
                  }
                }
                function u(e) {
                  var t = e.da;
                  for (
                    e = new Date(new Date(e.ea + 1900, 0, 1).getTime());
                    0 < t;

                  ) {
                    var n = e.getMonth(),
                      r = (tr(e.getFullYear()) ? nr : rr)[n];
                    if (!(t > r - e.getDate())) {
                      e.setDate(e.getDate() + t);
                      break;
                    }
                    (t -= r - e.getDate() + 1),
                      e.setDate(1),
                      11 > n
                        ? e.setMonth(n + 1)
                        : (e.setMonth(0), e.setFullYear(e.getFullYear() + 1));
                  }
                  n = new Date(e.getFullYear() + 1, 0, 4);
                  t = s(new Date(e.getFullYear(), 0, 4));
                  n = s(n);
                  return 0 >= o(t, e)
                    ? 0 >= o(n, e)
                      ? e.getFullYear() + 1
                      : e.getFullYear()
                    : e.getFullYear() - 1;
                }
                var l = P[(r + 40) >> 2];
                r = {
                  mc: P[r >> 2],
                  lc: P[(r + 4) >> 2],
                  Ga: P[(r + 8) >> 2],
                  Ta: P[(r + 12) >> 2],
                  Ha: P[(r + 16) >> 2],
                  ea: P[(r + 20) >> 2],
                  R: P[(r + 24) >> 2],
                  da: P[(r + 28) >> 2],
                  Pc: P[(r + 32) >> 2],
                  kc: P[(r + 36) >> 2],
                  nc: l && l ? oe(C, l) : "",
                };
                n = n ? oe(C, n) : "";
                l = {
                  "%c": "%a %b %d %H:%M:%S %Y",
                  "%D": "%m/%d/%y",
                  "%F": "%Y-%m-%d",
                  "%h": "%b",
                  "%r": "%I:%M:%S %p",
                  "%R": "%H:%M",
                  "%T": "%H:%M:%S",
                  "%x": "%m/%d/%y",
                  "%X": "%H:%M:%S",
                  "%Ec": "%c",
                  "%EC": "%C",
                  "%Ex": "%m/%d/%y",
                  "%EX": "%H:%M:%S",
                  "%Ey": "%y",
                  "%EY": "%Y",
                  "%Od": "%d",
                  "%Oe": "%e",
                  "%OH": "%H",
                  "%OI": "%I",
                  "%Om": "%m",
                  "%OM": "%M",
                  "%OS": "%S",
                  "%Ou": "%u",
                  "%OU": "%U",
                  "%OV": "%V",
                  "%Ow": "%w",
                  "%OW": "%W",
                  "%Oy": "%y",
                };
                for (var c in l) n = n.replace(new RegExp(c, "g"), l[c]);
                var f =
                    "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
                      " "
                    ),
                  h =
                    "January February March April May June July August September October November December".split(
                      " "
                    );
                l = {
                  "%a": (e) => f[e.R].substring(0, 3),
                  "%A": (e) => f[e.R],
                  "%b": (e) => h[e.Ha].substring(0, 3),
                  "%B": (e) => h[e.Ha],
                  "%C": (e) => a(((e.ea + 1900) / 100) | 0, 2),
                  "%d": (e) => a(e.Ta, 2),
                  "%e": (e) => i(e.Ta, 2, " "),
                  "%g": (e) => u(e).toString().substring(2),
                  "%G": (e) => u(e),
                  "%H": (e) => a(e.Ga, 2),
                  "%I": (e) => {
                    e = e.Ga;
                    0 == e ? (e = 12) : 12 < e && (e -= 12);
                    return a(e, 2);
                  },
                  "%j": (e) => {
                    for (
                      var t = 0, n = 0;
                      n <= e.Ha - 1;
                      t += (tr(e.ea + 1900) ? nr : rr)[n++]
                    );
                    return a(e.Ta + t, 3);
                  },
                  "%m": (e) => a(e.Ha + 1, 2),
                  "%M": (e) => a(e.lc, 2),
                  "%n": () => "\n",
                  "%p": (e) => (0 <= e.Ga && 12 > e.Ga ? "AM" : "PM"),
                  "%S": (e) => a(e.mc, 2),
                  "%t": () => "\t",
                  "%u": (e) => e.R || 7,
                  "%U": (e) => a(Math.floor((e.da + 7 - e.R) / 7), 2),
                  "%V": (e) => {
                    var t = Math.floor((e.da + 7 - ((e.R + 6) % 7)) / 7);
                    2 >= (e.R + 371 - e.da - 2) % 7 && t++;
                    if (t)
                      53 == t &&
                        ((n = (e.R + 371 - e.da) % 7),
                        4 == n || (3 == n && tr(e.ea)) || (t = 1));
                    else {
                      t = 52;
                      var n = (e.R + 7 - e.da - 1) % 7;
                      (4 == n || (5 == n && tr((e.ea % 400) - 1))) && t++;
                    }
                    return a(t, 2);
                  },
                  "%w": (e) => e.R,
                  "%W": (e) =>
                    a(Math.floor((e.da + 7 - ((e.R + 6) % 7)) / 7), 2),
                  "%y": (e) => (e.ea + 1900).toString().substring(2),
                  "%Y": (e) => e.ea + 1900,
                  "%z": (e) => {
                    e = e.kc;
                    var t = 0 <= e;
                    e = Math.abs(e) / 60;
                    return (
                      (t ? "+" : "-") +
                      String("0000" + ((e / 60) * 100 + (e % 60))).slice(-4)
                    );
                  },
                  "%Z": (e) => e.nc,
                  "%%": () => "%",
                };
                n = n.replace(/%%/g, "\0\0");
                for (c in l)
                  n.includes(c) && (n = n.replace(new RegExp(c, "g"), l[c](r)));
                n = n.replace(/\0\0/g, "%");
                c = ce(n, !1);
                if (c.length > t) return 0;
                A.set(c, e);
                return c.length - 1;
              };
            function ar(t, n, r, i) {
              t || (t = this || e);
              (this || e).parent = t;
              (this || e).U = t.U;
              (this || e).Aa = null;
              (this || e).id = Pe++;
              (this || e).name = n;
              (this || e).mode = r;
              (this || e).l = {};
              (this || e).m = {};
              (this || e).Ca = i;
            }
            Object.defineProperties(ar.prototype, {
              read: {
                get: function () {
                  return 365 === ((this || e).mode & 365);
                },
                set: function (t) {
                  t ? ((this || e).mode |= 365) : ((this || e).mode &= -366);
                },
              },
              write: {
                get: function () {
                  return 146 === ((this || e).mode & 146);
                },
                set: function (t) {
                  t ? ((this || e).mode |= 146) : ((this || e).mode &= -147);
                },
              },
            });
            Ke();
            Ie = Array(4096);
            Ge(ge, "/");
            ze("/tmp", 16895, 0);
            ze("/home", 16895, 0);
            ze("/home/web_user", 16895, 0);
            (() => {
              ze("/dev", 16895, 0);
              $e(259, { read: () => 0, write: (e, t, n, r) => r });
              He("/dev/null", 259);
              he(1280, pe);
              he(1536, ve);
              He("/dev/tty", 1280);
              He("/dev/tty1", 1536);
              var e = new Uint8Array(1024),
                t = 0,
                n = () => {
                  0 === t && (t = re(e).byteLength);
                  return e[--t];
                };
              Ze("random", n);
              Ze("urandom", n);
              ze("/dev/shm", 16895, 0);
              ze("/dev/shm/tmp", 16895, 0);
            })();
            (() => {
              ze("/proc", 16895, 0);
              var e = ze("/proc/self", 16895, 0);
              ze("/proc/self/fd", 16895, 0);
              Ge(
                {
                  U: () => {
                    var t = je(e, "fd", 16895, 73);
                    t.l = {
                      ma: (e, t) => {
                        var n = Ve(+t);
                        e = {
                          parent: null,
                          U: { jb: "fake" },
                          l: { na: () => n.path },
                        };
                        return (e.parent = e);
                      },
                    };
                    return t;
                  },
                },
                "/proc/self/fd"
              );
            })();
            Object.assign(it.prototype, {
              get(t) {
                return (this || e).M[t];
              },
              has(t) {
                return void 0 !== (this || e).M[t];
              },
              ta(t) {
                var n = (this || e).fb.pop() || (this || e).M.length;
                (this || e).M[n] = t;
                return n;
              },
              Tb(t) {
                (this || e).M[t] = void 0;
                (this || e).fb.push(t);
              },
            });
            ot = a.BindingError = class extends Error {
              constructor(e) {
                super(e);
                this.name = "BindingError";
              }
            };
            at.M.push(
              { value: void 0 },
              { value: null },
              { value: !0 },
              { value: !1 }
            );
            at.h = at.M.length;
            a.count_emval_handles = function () {
              for (var e = 0, t = at.h; t < at.M.length; ++t)
                void 0 !== at.M[t] && ++e;
              return e;
            };
            ft = a.PureVirtualError = ct("PureVirtualError");
            for (var or = Array(256), sr = 0; 256 > sr; ++sr)
              or[sr] = String.fromCharCode(sr);
            ht = or;
            a.getInheritedInstanceCount = function () {
              return Object.keys(gt).length;
            };
            a.getLiveInheritedInstances = function () {
              var e,
                t = [];
              for (e in gt) gt.hasOwnProperty(e) && t.push(gt[e]);
              return t;
            };
            a.flushPendingDeletes = vt;
            a.setDelayFunction = function (e) {
              mt = e;
              pt.length && mt && mt(vt);
            };
            Lt = a.InternalError = class extends Error {
              constructor(e) {
                super(e);
                this.name = "InternalError";
              }
            };
            Nt.prototype.isAliasOf = function (t) {
              if (!((this || e) instanceof Nt && t instanceof Nt)) return !1;
              var n = (this || e).g.u.i,
                r = (this || e).g.o,
                i = t.g.u.i;
              for (t = t.g.o; n.A; ) (r = n.pa(r)), (n = n.A);
              for (; i.A; ) (t = i.pa(t)), (i = i.A);
              return n === i && r === t;
            };
            Nt.prototype.clone = function () {
              (this || e).g.o || Ut(this || e);
              if ((this || e).g.ka)
                return ((this || e).g.count.value += 1), this || e;
              var t = St,
                n = Object,
                r = n.create,
                i = Object.getPrototypeOf(this || e),
                a = (this || e).g;
              t = t(
                r.call(n, i, {
                  g: {
                    value: {
                      count: a.count,
                      ia: a.ia,
                      ka: a.ka,
                      o: a.o,
                      u: a.u,
                      H: a.H,
                      L: a.L,
                    },
                  },
                })
              );
              t.g.count.value += 1;
              t.g.ia = !1;
              return t;
            };
            Nt.prototype.delete = function () {
              (this || e).g.o || Ut(this || e);
              (this || e).g.ia &&
                !(this || e).g.ka &&
                st("Object already scheduled for deletion");
              At(this || e);
              Mt((this || e).g);
              (this || e).g.ka ||
                (((this || e).g.H = void 0), ((this || e).g.o = void 0));
            };
            Nt.prototype.isDeleted = function () {
              return !(this || e).g.o;
            };
            Nt.prototype.deleteLater = function () {
              (this || e).g.o || Ut(this || e);
              (this || e).g.ia &&
                !(this || e).g.ka &&
                st("Object already scheduled for deletion");
              pt.push(this || e);
              1 === pt.length && mt && mt(vt);
              (this || e).g.ia = !0;
              return this || e;
            };
            Jt.prototype.Pb = function (t) {
              (this || e).pb && (t = this.pb(t));
              return t;
            };
            Jt.prototype.$a = function (t) {
              (this || e).W && this.W(t);
            };
            Jt.prototype.argPackAdvance = 8;
            Jt.prototype.readValueFromPointer = Tt;
            Jt.prototype.deleteObject = function (e) {
              null !== e && e.delete();
            };
            Jt.prototype.fromWireType = function (t) {
              function n() {
                return (this || e).ya
                  ? Rt((this || e).i.N, {
                      u: (this || e).cc,
                      o: r,
                      L: this || e,
                      H: t,
                    })
                  : Rt((this || e).i.N, { u: this || e, o: t });
              }
              var r = this.Pb(t);
              if (!r) return this.$a(t), null;
              var i = It((this || e).i, r);
              if (void 0 !== i) {
                if (0 === i.g.count.value)
                  return (i.g.o = r), (i.g.H = t), i.clone();
                i = i.clone();
                this.$a(t);
                return i;
              }
              i = (this || e).i.Ob(r);
              i = Pt[i];
              if (!i) return n.call(this || e);
              i = (this || e).xa ? i.Gb : i.pointerType;
              var a = Et(r, (this || e).i, i.i);
              return null === a
                ? n.call(this || e)
                : (this || e).ya
                ? Rt(i.i.N, { u: i, o: a, L: this || e, H: t })
                : Rt(i.i.N, { u: i, o: a });
            };
            nn = a.UnboundTypeError = ct("UnboundTypeError");
            for (var ur, lr = 0; 32 > lr; ++lr) Jn.push(Array(lr));
            var cr = {
              __syscall_fcntl64: function (e, t, n) {
                et = n;
                try {
                  var r = Ve(e);
                  switch (t) {
                    case 0:
                      var i = tt();
                      return 0 > i ? -28 : Ue(r, i).X;
                    case 1:
                    case 2:
                      return 0;
                    case 3:
                      return r.flags;
                    case 4:
                      return (i = tt()), (r.flags |= i), 0;
                    case 5:
                      return (i = tt()), (M[(i + 0) >> 1] = 2), 0;
                    case 6:
                    case 7:
                      return 0;
                    case 16:
                    case 8:
                      return -28;
                    case 9:
                      return (P[dr() >> 2] = 28), -1;
                    default:
                      return -28;
                  }
                } catch (e) {
                  if ("undefined" == typeof Qe || "ErrnoError" !== e.name)
                    throw e;
                  return -e.aa;
                }
              },
              __syscall_ioctl: function (e, t, n) {
                et = n;
                try {
                  var r = Ve(e);
                  switch (t) {
                    case 21509:
                      return r.s ? 0 : -59;
                    case 21505:
                      if (!r.s) return -59;
                      if (r.s.V.Xb) {
                        t = [
                          3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23,
                          22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        ];
                        var i = tt();
                        P[i >> 2] = 25856;
                        P[(i + 4) >> 2] = 5;
                        P[(i + 8) >> 2] = 191;
                        P[(i + 12) >> 2] = 35387;
                        for (var a = 0; 32 > a; a++)
                          A[(i + a + 17) | 0] = t[a] || 0;
                      }
                      return 0;
                    case 21510:
                    case 21511:
                    case 21512:
                      return r.s ? 0 : -59;
                    case 21506:
                    case 21507:
                    case 21508:
                      if (!r.s) return -59;
                      if (r.s.V.Yb)
                        for (i = tt(), t = [], a = 0; 32 > a; a++)
                          t.push(A[(i + a + 17) | 0]);
                      return 0;
                    case 21519:
                      if (!r.s) return -59;
                      i = tt();
                      return (P[i >> 2] = 0);
                    case 21520:
                      return r.s ? -28 : -59;
                    case 21531:
                      i = tt();
                      if (!r.m.Wb) throw new Fe(59);
                      return r.m.Wb(r, t, i);
                    case 21523:
                      if (!r.s) return -59;
                      r.s.V.Zb &&
                        ((a = [24, 80]),
                        (i = tt()),
                        (M[i >> 1] = a[0]),
                        (M[(i + 2) >> 1] = a[1]));
                      return 0;
                    case 21524:
                      return r.s ? 0 : -59;
                    case 21515:
                      return r.s ? 0 : -59;
                    default:
                      return -28;
                  }
                } catch (e) {
                  if ("undefined" == typeof Qe || "ErrnoError" !== e.name)
                    throw e;
                  return -e.aa;
                }
              },
              __syscall_openat: function (e, t, n, r) {
                et = r;
                try {
                  t = t ? oe(C, t) : "";
                  var i = t;
                  if ("/" === i.charAt(0)) t = i;
                  else {
                    var a = -100 === e ? "/" : Ve(e).path;
                    if (0 == i.length) throw new Fe(44);
                    t = Q(a + "/" + i);
                  }
                  var o = r ? tt() : 0;
                  return qe(t, n, o).X;
                } catch (e) {
                  if ("undefined" == typeof Qe || "ErrnoError" !== e.name)
                    throw e;
                  return -e.aa;
                }
              },
              _embind_create_inheriting_constructor: function (t, n, r) {
                t = dt(t);
                n = _t(n, "wrapper");
                r = ut(r);
                var i = [].slice,
                  a = n.i,
                  o = a.N,
                  s = a.A.N,
                  u = a.A.constructor;
                t = rt(t, function () {
                  a.A.nb.forEach(
                    function (t) {
                      if ((this || e)[t] === s[t])
                        throw new ft(
                          `Pure virtual function ${t} must be implemented in JavaScript`
                        );
                    }.bind(this || e)
                  );
                  Object.defineProperty(this || e, "__parent", { value: o });
                  (this || e).__construct.apply(this || e, i.call(arguments));
                });
                o.__construct = function () {
                  (this || e) === o && st("Pass correct 'this' to __construct");
                  var t = u.implement.apply(
                    void 0,
                    [this || e].concat(i.call(arguments))
                  );
                  At(t);
                  var n = t.g;
                  t.notifyOnDestruction();
                  n.ka = !0;
                  Object.defineProperties(this || e, { g: { value: n } });
                  St(this || e);
                  t = n.o;
                  t = bt(a, t);
                  gt.hasOwnProperty(t)
                    ? st(`Tried to register registered instance: ${t}`)
                    : (gt[t] = this || e);
                };
                o.__destruct = function () {
                  (this || e) === o && st("Pass correct 'this' to __destruct");
                  At(this || e);
                  var t = (this || e).g.o;
                  t = bt(a, t);
                  gt.hasOwnProperty(t)
                    ? delete gt[t]
                    : st(`Tried to unregister unregistered instance: ${t}`);
                };
                t.prototype = Object.create(o);
                for (var l in r) t.prototype[l] = r[l];
                return lt(t);
              },
              _embind_finalize_value_object: function (e) {
                var t = xt[e];
                delete xt[e];
                var n = t.Ra,
                  r = t.W,
                  i = t.bb,
                  a = i.map((e) => e.Sb).concat(i.map((e) => e.hc));
                Wt([e], a, (e) => {
                  var a = {};
                  i.forEach((t, n) => {
                    var r = e[n],
                      o = t.Qb,
                      s = t.Rb,
                      u = e[n + i.length],
                      l = t.fc,
                      c = t.ic;
                    a[t.Mb] = {
                      read: (e) => r.fromWireType(o(s, e)),
                      write: (e, t) => {
                        var n = [];
                        l(c, e, u.toWireType(n, t));
                        kt(n);
                      },
                    };
                  });
                  return [
                    {
                      name: t.name,
                      fromWireType: function (e) {
                        var t,
                          n = {};
                        for (t in a) n[t] = a[t].read(e);
                        r(e);
                        return n;
                      },
                      toWireType: function (e, t) {
                        for (var i in a)
                          if (!(i in t))
                            throw new TypeError(`Missing field: "${i}"`);
                        var o = n();
                        for (i in a) a[i].write(o, t[i]);
                        null !== e && e.push(r, o);
                        return o;
                      },
                      argPackAdvance: 8,
                      readValueFromPointer: Tt,
                      K: r,
                    },
                  ];
                });
              },
              _embind_register_bigint: function () {},
              _embind_register_bool: function (e, t, n, r, i) {
                var a = Bt(n);
                t = dt(t);
                Vt(e, {
                  name: t,
                  fromWireType: function (e) {
                    return !!e;
                  },
                  toWireType: function (e, t) {
                    return t ? r : i;
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: function (e) {
                    if (1 === n) var r = A;
                    else if (2 === n) r = M;
                    else {
                      if (4 !== n)
                        throw new TypeError("Unknown boolean type size: " + t);
                      r = P;
                    }
                    return this.fromWireType(r[e >> a]);
                  },
                  K: null,
                });
              },
              _embind_register_class: function (
                t,
                n,
                r,
                i,
                a,
                o,
                s,
                u,
                l,
                c,
                f,
                h,
                d
              ) {
                f = dt(f);
                o = tn(a, o);
                u && (u = tn(s, u));
                c && (c = tn(l, c));
                d = tn(h, d);
                var p = nt(f);
                Gt(p, function () {
                  rn(`Cannot construct ${f} due to unbound types`, [i]);
                });
                Wt([t, n, r], i ? [i] : [], function (n) {
                  n = n[0];
                  if (i) {
                    var r = n.i;
                    var a = r.N;
                  } else a = Nt.prototype;
                  n = rt(p, function () {
                    if (Object.getPrototypeOf(this || e) !== s)
                      throw new ot("Use 'new' to construct " + f);
                    if (void 0 === l.$)
                      throw new ot(f + " has no accessible constructor");
                    var t = l.$[arguments.length];
                    if (void 0 === t)
                      throw new ot(
                        `Tried to invoke ctor of ${f} with invalid number of parameters (${
                          arguments.length
                        }) - expected (${Object.keys(
                          l.$
                        ).toString()}) parameters instead!`
                      );
                    return t.apply(this || e, arguments);
                  });
                  var s = Object.create(a, { constructor: { value: n } });
                  n.prototype = s;
                  var l = new zt(f, n, s, d, r, o, u, c);
                  l.A && (void 0 === l.A.qa && (l.A.qa = []), l.A.qa.push(l));
                  r = new Jt(f, l, !0, !1);
                  a = new Jt(f + "*", l, !1, !1);
                  var h = new Jt(f + " const*", l, !1, !0);
                  Pt[t] = { pointerType: a, Gb: h };
                  Kt(p, n);
                  return [r, a, h];
                });
              },
              _embind_register_class_class_function: function (
                e,
                t,
                n,
                r,
                i,
                a,
                o
              ) {
                var s = on(n, r);
                t = dt(t);
                a = tn(i, a);
                Wt([], [e], function (e) {
                  function r() {
                    rn(`Cannot call ${i} due to unbound types`, s);
                  }
                  e = e[0];
                  var i = `${e.name}.${t}`;
                  t.startsWith("@@") && (t = Symbol[t.substring(2)]);
                  var u = e.i.constructor;
                  void 0 === u[t]
                    ? ((r.ha = n - 1), (u[t] = r))
                    : ($t(u, t, i), (u[t].B[n - 1] = r));
                  Wt([], s, function (r) {
                    r = an(i, [r[0], null].concat(r.slice(1)), null, a, o);
                    void 0 === u[t].B
                      ? ((r.ha = n - 1), (u[t] = r))
                      : (u[t].B[n - 1] = r);
                    if (e.i.qa)
                      for (const n of e.i.qa)
                        n.constructor.hasOwnProperty(t) ||
                          (n.constructor[t] = r);
                    return [];
                  });
                  return [];
                });
              },
              _embind_register_class_class_property: function (
                e,
                t,
                n,
                r,
                i,
                a,
                o,
                s
              ) {
                t = dt(t);
                a = tn(i, a);
                Wt([], [e], function (e) {
                  e = e[0];
                  var i = `${e.name}.${t}`,
                    u = {
                      get() {
                        rn(`Cannot access ${i} due to unbound types`, [n]);
                      },
                      enumerable: !0,
                      configurable: !0,
                    };
                  u.set = s
                    ? () => {
                        rn(`Cannot access ${i} due to unbound types`, [n]);
                      }
                    : () => {
                        st(`${i} is a read-only property`);
                      };
                  Object.defineProperty(e.i.constructor, t, u);
                  Wt([], [n], function (n) {
                    n = n[0];
                    var i = {
                      get() {
                        return n.fromWireType(a(r));
                      },
                      enumerable: !0,
                    };
                    s &&
                      ((s = tn(o, s)),
                      (i.set = (e) => {
                        var t = [];
                        s(r, n.toWireType(t, e));
                        kt(t);
                      }));
                    Object.defineProperty(e.i.constructor, t, i);
                    return [];
                  });
                  return [];
                });
              },
              _embind_register_class_constructor: function (e, t, n, r, i, a) {
                var o = on(t, n);
                i = tn(r, i);
                Wt([], [e], function (e) {
                  e = e[0];
                  var n = `constructor ${e.name}`;
                  void 0 === e.i.$ && (e.i.$ = []);
                  if (void 0 !== e.i.$[t - 1])
                    throw new ot(
                      `Cannot register multiple constructors with identical number of parameters (${
                        t - 1
                      }) for class '${
                        e.name
                      }'! Overload resolution is currently only performed using the parameter count, not actual type info!`
                    );
                  e.i.$[t - 1] = () => {
                    rn(`Cannot construct ${e.name} due to unbound types`, o);
                  };
                  Wt([], o, function (r) {
                    r.splice(1, 0, null);
                    e.i.$[t - 1] = an(n, r, null, i, a);
                    return [];
                  });
                  return [];
                });
              },
              _embind_register_class_function: function (
                e,
                t,
                n,
                r,
                i,
                a,
                o,
                s
              ) {
                var u = on(n, r);
                t = dt(t);
                a = tn(i, a);
                Wt([], [e], function (e) {
                  function r() {
                    rn(`Cannot call ${i} due to unbound types`, u);
                  }
                  e = e[0];
                  var i = `${e.name}.${t}`;
                  t.startsWith("@@") && (t = Symbol[t.substring(2)]);
                  s && e.i.nb.push(t);
                  var l = e.i.N,
                    c = l[t];
                  void 0 === c ||
                  (void 0 === c.B && c.className !== e.name && c.ha === n - 2)
                    ? ((r.ha = n - 2), (r.className = e.name), (l[t] = r))
                    : ($t(l, t, i), (l[t].B[n - 2] = r));
                  Wt([], u, function (r) {
                    r = an(i, r, e, a, o);
                    void 0 === l[t].B
                      ? ((r.ha = n - 2), (l[t] = r))
                      : (l[t].B[n - 2] = r);
                    return [];
                  });
                  return [];
                });
              },
              _embind_register_class_property: function (
                t,
                n,
                r,
                i,
                a,
                o,
                s,
                u,
                l,
                c
              ) {
                n = dt(n);
                a = tn(i, a);
                Wt([], [t], function (t) {
                  t = t[0];
                  var i = `${t.name}.${n}`,
                    f = {
                      get() {
                        rn(`Cannot access ${i} due to unbound types`, [r, s]);
                      },
                      enumerable: !0,
                      configurable: !0,
                    };
                  f.set = l
                    ? () => {
                        rn(`Cannot access ${i} due to unbound types`, [r, s]);
                      }
                    : () => {
                        st(i + " is a read-only property");
                      };
                  Object.defineProperty(t.i.N, n, f);
                  Wt([], l ? [r, s] : [r], function (r) {
                    var s = r[0],
                      f = {
                        get() {
                          var n = sn(this || e, t, i + " getter");
                          return s.fromWireType(a(o, n));
                        },
                        enumerable: !0,
                      };
                    if (l) {
                      l = tn(u, l);
                      var h = r[1];
                      f.set = function (n) {
                        var r = sn(this || e, t, i + " setter"),
                          a = [];
                        l(c, r, h.toWireType(a, n));
                        kt(a);
                      };
                    }
                    Object.defineProperty(t.i.N, n, f);
                    return [];
                  });
                  return [];
                });
              },
              _embind_register_emval: function (e, t) {
                t = dt(t);
                Vt(e, {
                  name: t,
                  fromWireType: function (e) {
                    var t = ut(e);
                    un(e);
                    return t;
                  },
                  toWireType: function (e, t) {
                    return lt(t);
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: Tt,
                  K: null,
                });
              },
              _embind_register_enum: function (t, n, r, i) {
                function a() {}
                r = Bt(r);
                n = dt(n);
                a.values = {};
                Vt(t, {
                  name: n,
                  constructor: a,
                  fromWireType: function (t) {
                    return (this || e).constructor.values[t];
                  },
                  toWireType: function (e, t) {
                    return t.value;
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: ln(n, r, i),
                  K: null,
                });
                Gt(n, a);
              },
              _embind_register_enum_value: function (e, t, n) {
                var r = _t(e, "enum");
                t = dt(t);
                e = r.constructor;
                r = Object.create(r.constructor.prototype, {
                  value: { value: n },
                  constructor: { value: rt(`${r.name}_${t}`, function () {}) },
                });
                e.values[n] = r;
                e[t] = r;
              },
              _embind_register_float: function (e, t, n) {
                n = Bt(n);
                t = dt(t);
                Vt(e, {
                  name: t,
                  fromWireType: function (e) {
                    return e;
                  },
                  toWireType: function (e, t) {
                    return t;
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: fn(t, n),
                  K: null,
                });
              },
              _embind_register_function: function (e, t, n, r, i, a) {
                var o = on(t, n);
                e = dt(e);
                i = tn(r, i);
                Gt(
                  e,
                  function () {
                    rn(`Cannot call ${e} due to unbound types`, o);
                  },
                  t - 1
                );
                Wt([], o, function (n) {
                  Kt(
                    e,
                    an(e, [n[0], null].concat(n.slice(1)), null, i, a),
                    t - 1
                  );
                  return [];
                });
              },
              _embind_register_integer: function (e, t, n, r, i) {
                t = dt(t);
                -1 === i && (i = 4294967295);
                i = Bt(n);
                var a = (e) => e;
                if (0 === r) {
                  var o = 32 - 8 * n;
                  a = (e) => (e << o) >>> o;
                }
                n = t.includes("unsigned")
                  ? function (e, t) {
                      return t >>> 0;
                    }
                  : function (e, t) {
                      return t;
                    };
                Vt(e, {
                  name: t,
                  fromWireType: a,
                  toWireType: n,
                  argPackAdvance: 8,
                  readValueFromPointer: hn(t, i, 0 !== r),
                  K: null,
                });
              },
              _embind_register_memory_view: function (e, t, n) {
                function r(e) {
                  e >>= 2;
                  var t = I;
                  return new i(t.buffer, t[e + 1], t[e]);
                }
                var i = [
                  Int8Array,
                  Uint8Array,
                  Int16Array,
                  Uint16Array,
                  Int32Array,
                  Uint32Array,
                  Float32Array,
                  Float64Array,
                ][t];
                n = dt(n);
                Vt(
                  e,
                  {
                    name: n,
                    fromWireType: r,
                    argPackAdvance: 8,
                    readValueFromPointer: r,
                  },
                  { Ub: !0 }
                );
              },
              _embind_register_std_string: function (e, t) {
                t = dt(t);
                var n = "std::string" === t;
                Vt(e, {
                  name: t,
                  fromWireType: function (e) {
                    var t = I[e >> 2],
                      r = e + 4;
                    if (n)
                      for (var i = r, a = 0; a <= t; ++a) {
                        var o = r + a;
                        if (a == t || 0 == C[o]) {
                          i = i ? oe(C, i, o - i) : "";
                          if (void 0 === s) var s = i;
                          else (s += String.fromCharCode(0)), (s += i);
                          i = o + 1;
                        }
                      }
                    else {
                      s = Array(t);
                      for (a = 0; a < t; ++a)
                        s[a] = String.fromCharCode(C[r + a]);
                      s = s.join("");
                    }
                    fr(e);
                    return s;
                  },
                  toWireType: function (e, t) {
                    t instanceof ArrayBuffer && (t = new Uint8Array(t));
                    var r = "string" == typeof t;
                    r ||
                      t instanceof Uint8Array ||
                      t instanceof Uint8ClampedArray ||
                      t instanceof Int8Array ||
                      st("Cannot pass non-string to std::string");
                    var i = n && r ? ue(t) : t.length;
                    var a = hr(4 + i + 1),
                      o = a + 4;
                    I[a >> 2] = i;
                    if (n && r) le(t, C, o, i + 1);
                    else if (r)
                      for (r = 0; r < i; ++r) {
                        var s = t.charCodeAt(r);
                        255 < s &&
                          (fr(o),
                          st(
                            "String has UTF-16 code units that do not fit in 8 bits"
                          ));
                        C[o + r] = s;
                      }
                    else for (r = 0; r < i; ++r) C[o + r] = t[r];
                    null !== e && e.push(fr, a);
                    return a;
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: Tt,
                  K: function (e) {
                    fr(e);
                  },
                });
              },
              _embind_register_std_wstring: function (e, t, n) {
                n = dt(n);
                if (2 === t) {
                  var r = pn;
                  var i = vn;
                  var a = mn;
                  var o = () => E;
                  var s = 1;
                } else
                  4 === t &&
                    ((r = gn), (i = bn), (a = yn), (o = () => I), (s = 2));
                Vt(e, {
                  name: n,
                  fromWireType: function (e) {
                    for (
                      var n, i = I[e >> 2], a = o(), u = e + 4, l = 0;
                      l <= i;
                      ++l
                    ) {
                      var c = e + 4 + l * t;
                      (l != i && 0 != a[c >> s]) ||
                        ((u = r(u, c - u)),
                        void 0 === n
                          ? (n = u)
                          : ((n += String.fromCharCode(0)), (n += u)),
                        (u = c + t));
                    }
                    fr(e);
                    return n;
                  },
                  toWireType: function (e, r) {
                    "string" != typeof r &&
                      st(`Cannot pass non-string to C++ string type ${n}`);
                    var o = a(r),
                      u = hr(4 + o + t);
                    I[u >> 2] = o >> s;
                    i(r, u + 4, o + t);
                    null !== e && e.push(fr, u);
                    return u;
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: Tt,
                  K: function (e) {
                    fr(e);
                  },
                });
              },
              _embind_register_value_object: function (e, t, n, r, i, a) {
                xt[e] = { name: dt(t), Ra: tn(n, r), W: tn(i, a), bb: [] };
              },
              _embind_register_value_object_field: function (
                e,
                t,
                n,
                r,
                i,
                a,
                o,
                s,
                u,
                l
              ) {
                xt[e].bb.push({
                  Mb: dt(t),
                  Sb: n,
                  Qb: tn(r, i),
                  Rb: a,
                  hc: o,
                  fc: tn(s, u),
                  ic: l,
                });
              },
              _embind_register_void: function (e, t) {
                t = dt(t);
                Vt(e, {
                  $b: !0,
                  name: t,
                  argPackAdvance: 0,
                  fromWireType: function () {},
                  toWireType: function () {},
                });
              },
              _emscripten_get_now_is_monotonic: () => !0,
              _emval_as: function (e, t, n) {
                e = ut(e);
                t = _t(t, "emval::as");
                var r = [],
                  i = lt(r);
                I[n >> 2] = i;
                return t.toWireType(r, e);
              },
              _emval_call_method: function (e, t, n, r, i) {
                e = An[e];
                t = ut(t);
                n = _n(n);
                var a = [];
                I[r >> 2] = lt(a);
                return e(t, n, a, i);
              },
              _emval_call_void_method: function (e, t, n, r) {
                e = An[e];
                t = ut(t);
                n = _n(n);
                e(t, n, null, r);
              },
              _emval_decref: un,
              _emval_get_method_caller: function (e, t) {
                var n = Mn(e, t),
                  r = n[0];
                t =
                  r.name +
                  "_$" +
                  n
                    .slice(1)
                    .map(function (e) {
                      return e.name;
                    })
                    .join("_") +
                  "$";
                var i = En[t];
                if (void 0 !== i) return i;
                var a = Array(e - 1);
                i = Cn((t, i, o, s) => {
                  for (var u = 0, l = 0; l < e - 1; ++l)
                    (a[l] = n[l + 1].readValueFromPointer(s + u)),
                      (u += n[l + 1].argPackAdvance);
                  t = t[i].apply(t, a);
                  for (l = 0; l < e - 1; ++l) n[l + 1].Ib && n[l + 1].Ib(a[l]);
                  if (!r.$b) return r.toWireType(o, t);
                });
                return (En[t] = i);
              },
              _emval_get_property: function (e, t) {
                e = ut(e);
                t = ut(t);
                return lt(e[t]);
              },
              _emval_incref: function (e) {
                4 < e && (at.get(e).rb += 1);
              },
              _emval_new_array: function () {
                return lt([]);
              },
              _emval_new_cstring: function (e) {
                return lt(_n(e));
              },
              _emval_new_object: function () {
                return lt({});
              },
              _emval_run_destructors: function (e) {
                var t = ut(e);
                kt(t);
                un(e);
              },
              _emval_set_property: function (e, t, n) {
                e = ut(e);
                t = ut(t);
                n = ut(n);
                e[t] = n;
              },
              _emval_take_value: function (e, t) {
                e = _t(e, "_emval_take_value");
                e = e.readValueFromPointer(t);
                return lt(e);
              },
              abort: () => {
                V("");
              },
              beginPixelLocalStorageWEBGL: function (e, t, n) {
                (e = Wn[e].C.ca) &&
                  e.beginPixelLocalStorageWEBGL(a.HEAPU32.subarray(n, n + t));
              },
              decode_image: function (e, t, n) {
                var r = a.images;
                r || ((r = new Map()), (a.images = r));
                var i = new Image();
                r.set(e, i);
                t = a.HEAP8.subarray(t, t + n);
                n = new Uint8Array(n);
                n.set(t);
                i.src = URL.createObjectURL(
                  new Blob([n], { type: "image/png" })
                );
                i.onload = function () {
                  a._setWebImage(e, i.width, i.height);
                };
              },
              delete_image: function (e) {
                var t = a.images;
                t && t.get(e) && t.delete(e);
              },
              emscripten_asm_const_int: (e, t, n) => {
                Pn.length = 0;
                var r;
                for (n >>= 2; (r = C[t++]); )
                  (n += (105 != r) & n),
                    Pn.push(105 == r ? P[n] : F[n++ >> 1]),
                    ++n;
                return J[e].apply(null, Pn);
              },
              emscripten_date_now: function () {
                return Date.now();
              },
              emscripten_get_now: () => performance.now(),
              emscripten_memcpy_big: (e, t, n) => C.copyWithin(e, t, t + n),
              emscripten_resize_heap: (e) => {
                var t = C.length;
                e >>>= 0;
                if (2147483648 < e) return !1;
                for (var n = 1; 4 >= n; n *= 2) {
                  var r = t * (1 + 0.2 / n);
                  r = Math.min(r, e + 100663296);
                  var i = Math;
                  r = Math.max(e, r);
                  e: {
                    i =
                      (i.min.call(
                        i,
                        2147483648,
                        r + ((65536 - (r % 65536)) % 65536)
                      ) -
                        w.buffer.byteLength +
                        65535) >>>
                      16;
                    try {
                      w.grow(i);
                      S();
                      var a = 1;
                      break e;
                    } catch (e) {}
                    a = void 0;
                  }
                  if (a) return !0;
                }
                return !1;
              },
              emscripten_webgl_enable_extension: function (e, t) {
                e = Wn[e];
                t = t ? oe(C, t) : "";
                t.startsWith("GL_") && (t = t.substr(3));
                "WEBGL_draw_instanced_base_vertex_base_instance" == t && In(ur);
                "WEBGL_multi_draw_instanced_base_vertex_base_instance" == t &&
                  Ln(ur);
                "WEBGL_multi_draw" == t && Hn(ur);
                return !!e.C.getExtension(t);
              },
              emscripten_webgl_get_current_context: function () {
                return zn ? zn.handle : 0;
              },
              emscripten_webgl_make_context_current: function (e) {
                return Nn(e) ? 0 : -5;
              },
              enable_WEBGL_provoking_vertex: function (e) {
                e = Wn[e].C;
                e.ob = e.getExtension("WEBGL_provoking_vertex");
                return !!e.ob;
              },
              enable_WEBGL_shader_pixel_local_storage_coherent: function (e) {
                e = Wn[e].C;
                e.ca = e.getExtension("WEBGL_shader_pixel_local_storage");
                return !(!e.ca || !e.ca.isCoherent());
              },
              endPixelLocalStorageWEBGL: function (e, t, n) {
                (e = Wn[e].C.ca) &&
                  e.endPixelLocalStorageWEBGL(a.HEAPU32.subarray(n, n + t));
              },
              environ_get: (e, t) => {
                var n = 0;
                qn().forEach(function (r, i) {
                  var a = t + n;
                  i = I[(e + 4 * i) >> 2] = a;
                  for (a = 0; a < r.length; ++a) A[i++ | 0] = r.charCodeAt(a);
                  A[i | 0] = 0;
                  n += r.length + 1;
                });
                return 0;
              },
              environ_sizes_get: (e, t) => {
                var n = qn();
                I[e >> 2] = n.length;
                var r = 0;
                n.forEach(function (e) {
                  r += e.length + 1;
                });
                I[t >> 2] = r;
                return 0;
              },
              fd_close: function (e) {
                try {
                  var t = Ve(e);
                  if (null === t.X) throw new Fe(8);
                  t.Oa && (t.Oa = null);
                  try {
                    t.m.close && t.m.close(t);
                  } catch (e) {
                    throw e;
                  } finally {
                    Ee[t.X] = null;
                  }
                  t.X = null;
                  return 0;
                } catch (e) {
                  if ("undefined" == typeof Qe || "ErrnoError" !== e.name)
                    throw e;
                  return e.aa;
                }
              },
              fd_read: function (e, t, n, r) {
                try {
                  e: {
                    var i = Ve(e);
                    e = t;
                    for (var a, o = (t = 0); o < n; o++) {
                      var s = I[e >> 2],
                        u = I[(e + 4) >> 2];
                      e += 8;
                      var l = i,
                        c = s,
                        f = u,
                        h = a,
                        d = A;
                      if (0 > f || 0 > h) throw new Fe(28);
                      if (null === l.X) throw new Fe(8);
                      if (1 === (l.flags & 2097155)) throw new Fe(8);
                      if (16384 === (l.node.mode & 61440)) throw new Fe(31);
                      if (!l.m.read) throw new Fe(28);
                      var p = "undefined" != typeof h;
                      if (p) {
                        if (!l.seekable) throw new Fe(70);
                      } else h = l.position;
                      var v = l.m.read(l, d, c, f, h);
                      p || (l.position += v);
                      var m = v;
                      if (0 > m) {
                        var g = -1;
                        break e;
                      }
                      t += m;
                      if (m < u) break;
                      "undefined" !== typeof a && (a += m);
                    }
                    g = t;
                  }
                  I[r >> 2] = g;
                  return 0;
                } catch (e) {
                  if ("undefined" == typeof Qe || "ErrnoError" !== e.name)
                    throw e;
                  return e.aa;
                }
              },
              fd_seek: function (e, t, n, r, i) {
                t =
                  (n + 2097152) >>> 0 < 4194305 - !!t
                    ? (t >>> 0) + 4294967296 * n
                    : NaN;
                try {
                  if (isNaN(t)) return 61;
                  var a = Ve(e);
                  Je(a, t, r);
                  q = [
                    a.position >>> 0,
                    ((X = a.position),
                    1 <= +Math.abs(X)
                      ? 0 < X
                        ? +Math.floor(X / 4294967296) >>> 0
                        : ~~+Math.ceil((X - +(~~X >>> 0)) / 4294967296) >>> 0
                      : 0),
                  ];
                  P[i >> 2] = q[0];
                  P[(i + 4) >> 2] = q[1];
                  a.Oa && 0 === t && 0 === r && (a.Oa = null);
                  return 0;
                } catch (e) {
                  if ("undefined" == typeof Qe || "ErrnoError" !== e.name)
                    throw e;
                  return e.aa;
                }
              },
              fd_write: function (e, t, n, r) {
                try {
                  e: {
                    var i = Ve(e);
                    e = t;
                    for (var a, o = (t = 0); o < n; o++) {
                      var s = I[e >> 2],
                        u = I[(e + 4) >> 2];
                      e += 8;
                      var l = i,
                        c = s,
                        f = u,
                        h = a,
                        d = A;
                      if (0 > f || 0 > h) throw new Fe(28);
                      if (null === l.X) throw new Fe(8);
                      if (0 === (l.flags & 2097155)) throw new Fe(8);
                      if (16384 === (l.node.mode & 61440)) throw new Fe(31);
                      if (!l.m.write) throw new Fe(28);
                      l.seekable && l.flags & 1024 && Je(l, 0, 2);
                      var p = "undefined" != typeof h;
                      if (p) {
                        if (!l.seekable) throw new Fe(70);
                      } else h = l.position;
                      var v = l.m.write(l, d, c, f, h, void 0);
                      p || (l.position += v);
                      var m = v;
                      if (0 > m) {
                        var g = -1;
                        break e;
                      }
                      t += m;
                      "undefined" !== typeof a && (a += m);
                    }
                    g = t;
                  }
                  I[r >> 2] = g;
                  return 0;
                } catch (e) {
                  if ("undefined" == typeof Qe || "ErrnoError" !== e.name)
                    throw e;
                  return e.aa;
                }
              },
              framebufferPixelLocalClearValuefvWEBGL: function (
                e,
                t,
                n,
                r,
                i,
                a
              ) {
                (e = Wn[e].C.ca) &&
                  e.framebufferPixelLocalClearValuefvWEBGL(t, [n, r, i, a]);
              },
              framebufferTexturePixelLocalStorageWEBGL: function (
                e,
                t,
                n,
                r,
                i
              ) {
                (e = Wn[e].C.ca) &&
                  e.framebufferTexturePixelLocalStorageWEBGL(t, Tn[n], r, i);
              },
              getFramebufferPixelLocalStorageParameterivWEBGL: function (
                e,
                t,
                n
              ) {
                return (e = Wn[e].C.ca)
                  ? e.getFramebufferPixelLocalStorageParameterWEBGL(t, n)
                  : 0;
              },
              glActiveTexture: function (e) {
                ur.activeTexture(e);
              },
              glAttachShader: function (e, t) {
                ur.attachShader(Sn[e], jn[t]);
              },
              glBindBuffer: function (e, t) {
                35051 == e ? (ur.Za = t) : 35052 == e && (ur.Ma = t);
                ur.bindBuffer(e, Rn[t]);
              },
              glBindBufferRange: function (e, t, n, r, i) {
                ur.bindBufferRange(e, t, Rn[n], r, i);
              },
              glBindFramebuffer: function (e, t) {
                ur.bindFramebuffer(e, xn[t]);
              },
              glBindRenderbuffer: function (e, t) {
                ur.bindRenderbuffer(e, kn[t]);
              },
              glBindTexture: function (e, t) {
                ur.bindTexture(e, Tn[t]);
              },
              glBindVertexArray: function (e) {
                ur.bindVertexArray(On[e]);
              },
              glBlendEquation: function (e) {
                ur.blendEquation(e);
              },
              glBlendFunc: function (e, t) {
                ur.blendFunc(e, t);
              },
              glBlitFramebuffer: function (e, t, n, r, i, a, o, s, u, l) {
                ur.blitFramebuffer(e, t, n, r, i, a, o, s, u, l);
              },
              glBufferData: function (e, t, n, r) {
                n && t ? ur.bufferData(e, C, r, n, t) : ur.bufferData(e, t, r);
              },
              glBufferSubData: function (e, t, n, r) {
                n && ur.bufferSubData(e, t, C, r, n);
              },
              glClear: function (e) {
                ur.clear(e);
              },
              glClearColor: function (e, t, n, r) {
                ur.clearColor(e, t, n, r);
              },
              glClearDepthf: function (e) {
                ur.clearDepth(e);
              },
              glClearStencil: function (e) {
                ur.clearStencil(e);
              },
              glColorMask: function (e, t, n, r) {
                ur.colorMask(!!e, !!t, !!n, !!r);
              },
              glCompileShader: function (e) {
                ur.compileShader(jn[e]);
              },
              glCreateProgram: function () {
                var e = Vn(Sn),
                  t = ur.createProgram();
                t.name = e;
                t.Hc = t.Fc = t.Gc = 0;
                t.Ua = 1;
                Sn[e] = t;
                return e;
              },
              glCreateShader: function (e) {
                var t = Vn(jn);
                jn[t] = ur.createShader(e);
                return t;
              },
              glCullFace: function (e) {
                ur.cullFace(e);
              },
              glDeleteBuffers: function (e, t) {
                for (var n = 0; n < e; n++) {
                  var r = P[(t + 4 * n) >> 2],
                    i = Rn[r];
                  i &&
                    (ur.deleteBuffer(i),
                    (i.name = 0),
                    (Rn[r] = null),
                    r == ur.Za && (ur.Za = 0),
                    r == ur.Ma && (ur.Ma = 0));
                }
              },
              glDeleteFramebuffers: function (e, t) {
                for (var n = 0; n < e; ++n) {
                  var r = P[(t + 4 * n) >> 2],
                    i = xn[r];
                  i && (ur.deleteFramebuffer(i), (i.name = 0), (xn[r] = null));
                }
              },
              glDeleteProgram: function (e) {
                if (e) {
                  var t = Sn[e];
                  t
                    ? (ur.deleteProgram(t), (t.name = 0), (Sn[e] = null))
                    : Dn(1281);
                }
              },
              glDeleteRenderbuffers: function (e, t) {
                for (var n = 0; n < e; n++) {
                  var r = P[(t + 4 * n) >> 2],
                    i = kn[r];
                  i && (ur.deleteRenderbuffer(i), (i.name = 0), (kn[r] = null));
                }
              },
              glDeleteShader: function (e) {
                if (e) {
                  var t = jn[e];
                  t ? (ur.deleteShader(t), (jn[e] = null)) : Dn(1281);
                }
              },
              glDeleteTextures: function (e, t) {
                for (var n = 0; n < e; n++) {
                  var r = P[(t + 4 * n) >> 2],
                    i = Tn[r];
                  i && (ur.deleteTexture(i), (i.name = 0), (Tn[r] = null));
                }
              },
              glDeleteVertexArrays: function (e, t) {
                for (var n = 0; n < e; n++) {
                  var r = P[(t + 4 * n) >> 2];
                  ur.deleteVertexArray(On[r]);
                  On[r] = null;
                }
              },
              glDepthFunc: function (e) {
                ur.depthFunc(e);
              },
              glDepthMask: function (e) {
                ur.depthMask(!!e);
              },
              glDepthRangef: function (e, t) {
                ur.depthRange(e, t);
              },
              glDisable: function (e) {
                ur.disable(e);
              },
              glDrawArrays: function (e, t, n) {
                ur.drawArrays(e, t, n);
              },
              glDrawArraysInstanced: function (e, t, n, r) {
                ur.drawArraysInstanced(e, t, n, r);
              },
              glDrawBuffers: function (e, t) {
                for (var n = Jn[e], r = 0; r < e; r++)
                  n[r] = P[(t + 4 * r) >> 2];
                ur.drawBuffers(n);
              },
              glDrawElements: function (e, t, n, r) {
                ur.drawElements(e, t, n, r);
              },
              glDrawElementsInstanced: function (e, t, n, r, i) {
                ur.drawElementsInstanced(e, t, n, r, i);
              },
              glEnable: function (e) {
                ur.enable(e);
              },
              glEnableVertexAttribArray: function (e) {
                ur.enableVertexAttribArray(e);
              },
              glFlush: function () {
                ur.flush();
              },
              glFramebufferRenderbuffer: function (e, t, n, r) {
                ur.framebufferRenderbuffer(e, t, n, kn[r]);
              },
              glFramebufferTexture2D: function (e, t, n, r, i) {
                ur.framebufferTexture2D(e, t, n, Tn[r], i);
              },
              glFrontFace: function (e) {
                ur.frontFace(e);
              },
              glGenBuffers: function (e, t) {
                Kn(e, t, "createBuffer", Rn);
              },
              glGenFramebuffers: function (e, t) {
                Kn(e, t, "createFramebuffer", xn);
              },
              glGenRenderbuffers: function (e, t) {
                Kn(e, t, "createRenderbuffer", kn);
              },
              glGenTextures: function (e, t) {
                Kn(e, t, "createTexture", Tn);
              },
              glGenVertexArrays: function (e, t) {
                Kn(e, t, "createVertexArray", On);
              },
              glGenerateMipmap: function (e) {
                ur.generateMipmap(e);
              },
              glGetError: function () {
                var e = ur.getError() || Gn;
                Gn = 0;
                return e;
              },
              glGetIntegerv: function (e, t) {
                Zn(e, t);
              },
              glGetString: function (e) {
                var t = Bn[e];
                if (!t) {
                  switch (e) {
                    case 7939:
                      t = ur.getSupportedExtensions() || [];
                      t = t.concat(
                        t.map(function (e) {
                          return "GL_" + e;
                        })
                      );
                      t = Qn(t.join(" "));
                      break;
                    case 7936:
                    case 7937:
                    case 37445:
                    case 37446:
                      (t = ur.getParameter(e)) || Dn(1280);
                      t = t && Qn(t);
                      break;
                    case 7938:
                      t = Qn("OpenGL ES 3.0 (" + ur.getParameter(7938) + ")");
                      break;
                    case 35724:
                      t = ur.getParameter(35724);
                      var n = t.match(
                        /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/
                      );
                      null !== n &&
                        (3 == n[1].length && (n[1] += "0"),
                        (t = "OpenGL ES GLSL ES " + n[1] + " (" + t + ")"));
                      t = Qn(t);
                      break;
                    default:
                      Dn(1280);
                  }
                  Bn[e] = t;
                }
                return t;
              },
              glGetUniformBlockIndex: function (e, t) {
                return ur.getUniformBlockIndex(Sn[e], t ? oe(C, t) : "");
              },
              glGetUniformLocation: function (e, t) {
                t = t ? oe(C, t) : "";
                if ((e = Sn[e])) {
                  var n,
                    r = e,
                    i = r.oa,
                    a = r.wb;
                  if (!i)
                    for (
                      r.oa = i = {}, r.vb = {}, n = 0;
                      n < ur.getProgramParameter(r, 35718);
                      ++n
                    ) {
                      var o = ur.getActiveUniform(r, n);
                      var s = o.name;
                      o = o.size;
                      var u = er(s);
                      u = 0 < u ? s.slice(0, u) : s;
                      var l = r.Ua;
                      r.Ua += o;
                      a[u] = [o, l];
                      for (s = 0; s < o; ++s) (i[l] = s), (r.vb[l++] = u);
                    }
                  r = e.oa;
                  i = 0;
                  a = t;
                  n = er(t);
                  0 < n &&
                    ((i = parseInt(t.slice(n + 1)) >>> 0), (a = t.slice(0, n)));
                  if (
                    (a = e.wb[a]) &&
                    i < a[0] &&
                    ((i += a[1]), (r[i] = r[i] || ur.getUniformLocation(e, t)))
                  )
                    return i;
                } else Dn(1281);
                return -1;
              },
              glInvalidateFramebuffer: function (e, t, n) {
                for (var r = Jn[t], i = 0; i < t; i++)
                  r[i] = P[(n + 4 * i) >> 2];
                ur.invalidateFramebuffer(e, r);
              },
              glLinkProgram: function (e) {
                e = Sn[e];
                ur.linkProgram(e);
                e.oa = 0;
                e.wb = {};
              },
              glPixelStorei: function (e, t) {
                ur.pixelStorei(e, t);
              },
              glRenderbufferStorageMultisample: function (e, t, n, r, i) {
                ur.renderbufferStorageMultisample(e, t, n, r, i);
              },
              glScissor: function (e, t, n, r) {
                ur.scissor(e, t, n, r);
              },
              glShaderSource: function (e, t, n, r) {
                for (var i = "", a = 0; a < t; ++a) {
                  var o = r ? P[(r + 4 * a) >> 2] : -1,
                    s = P[(n + 4 * a) >> 2];
                  o = s ? oe(C, s, 0 > o ? void 0 : o) : "";
                  i += o;
                }
                ur.shaderSource(jn[e], i);
              },
              glStencilFunc: function (e, t, n) {
                ur.stencilFunc(e, t, n);
              },
              glStencilFuncSeparate: function (e, t, n, r) {
                ur.stencilFuncSeparate(e, t, n, r);
              },
              glStencilMask: function (e) {
                ur.stencilMask(e);
              },
              glStencilOp: function (e, t, n) {
                ur.stencilOp(e, t, n);
              },
              glStencilOpSeparate: function (e, t, n, r) {
                ur.stencilOpSeparate(e, t, n, r);
              },
              glTexParameteri: function (e, t, n) {
                ur.texParameteri(e, t, n);
              },
              glTexStorage2D: function (e, t, n, r, i) {
                ur.texStorage2D(e, t, n, r, i);
              },
              glTexSubImage2D: function (e, t, n, r, i, a, o, s, u) {
                if (ur.Ma) ur.texSubImage2D(e, t, n, r, i, a, o, s, u);
                else if (u) {
                  var l = s - 5120;
                  l =
                    0 == l
                      ? A
                      : 1 == l
                      ? C
                      : 2 == l
                      ? M
                      : 4 == l
                      ? P
                      : 6 == l
                      ? L
                      : 5 == l ||
                        28922 == l ||
                        28520 == l ||
                        30779 == l ||
                        30782 == l
                      ? I
                      : E;
                  ur.texSubImage2D(
                    e,
                    t,
                    n,
                    r,
                    i,
                    a,
                    o,
                    s,
                    l,
                    u >> (31 - Math.clz32(l.BYTES_PER_ELEMENT))
                  );
                } else ur.texSubImage2D(e, t, n, r, i, a, o, s, null);
              },
              glUniform1i: function (e, t) {
                var n = ur,
                  r = n.uniform1i;
                var i = ur.Hb;
                if (i) {
                  var a = i.oa[e];
                  "number" == typeof a &&
                    (i.oa[e] = a =
                      ur.getUniformLocation(
                        i,
                        i.vb[e] + (0 < a ? "[" + a + "]" : "")
                      ));
                  e = a;
                } else Dn(1282), (e = void 0);
                r.call(n, e, t);
              },
              glUniformBlockBinding: function (e, t, n) {
                e = Sn[e];
                ur.uniformBlockBinding(e, t, n);
              },
              glUseProgram: function (e) {
                e = Sn[e];
                ur.useProgram(e);
                ur.Hb = e;
              },
              glVertexAttribDivisor: function (e, t) {
                ur.vertexAttribDivisor(e, t);
              },
              glVertexAttribIPointer: function (e, t, n, r, i) {
                ur.vertexAttribIPointer(e, t, n, r, i);
              },
              glVertexAttribPointer: function (e, t, n, r, i, a) {
                ur.vertexAttribPointer(e, t, n, !!r, i, a);
              },
              glViewport: function (e, t, n, r) {
                ur.viewport(e, t, n, r);
              },
              provokingVertexWEBGL: function (e, t) {
                (e = Wn[e].C.ob) && e.provokingVertexWEBGL(t);
              },
              strftime_l: (e, t, n, r) => ir(e, t, n, r),
              upload_image: function (e, t) {
                var n = a.images;
                n &&
                  (t = n.get(t)) &&
                  ((e = Wn[e].C),
                  e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0),
                  e.texImage2D(
                    e.TEXTURE_2D,
                    0,
                    e.RGBA,
                    e.RGBA,
                    e.UNSIGNED_BYTE,
                    t
                  ),
                  e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1));
              },
            };
            (function () {
              function e(e) {
                _ = e = e.exports;
                w = _.memory;
                S();
                x = _.__indirect_function_table;
                T.unshift(_.__wasm_call_ctors);
                W--;
                a.monitorRunDependencies && a.monitorRunDependencies(W);
                if (
                  0 == W &&
                  (null !== B && (clearInterval(B), (B = null)), D)
                ) {
                  var t = D;
                  D = null;
                  t();
                }
                return e;
              }
              var t = { env: cr, wasi_snapshot_preview1: cr };
              W++;
              a.monitorRunDependencies && a.monitorRunDependencies(W);
              if (a.instantiateWasm)
                try {
                  return a.instantiateWasm(t, e);
                } catch (e) {
                  b("Module.instantiateWasm callback failed with error: " + e),
                    i(e);
                }
              Y(t, function (t) {
                e(t.instance);
              }).catch(i);
              return {};
            })();
            var fr = (e) => (fr = _.free)(e),
              hr = (e) => (hr = _.malloc)(e);
            a._setWebImage = (e, t, n) =>
              (a._setWebImage = _.setWebImage)(e, t, n);
            var dr = () => (dr = _.__errno_location)(),
              pr = (a._ma_device__on_notification_unlocked = (e) =>
                (pr = a._ma_device__on_notification_unlocked =
                  _.ma_device__on_notification_unlocked)(e));
            a._ma_malloc_emscripten = (e, t) =>
              (a._ma_malloc_emscripten = _.ma_malloc_emscripten)(e, t);
            a._ma_free_emscripten = (e, t) =>
              (a._ma_free_emscripten = _.ma_free_emscripten)(e, t);
            var vr = (a._ma_device_process_pcm_frames_capture__webaudio = (
                e,
                t,
                n
              ) =>
                (vr = a._ma_device_process_pcm_frames_capture__webaudio =
                  _.ma_device_process_pcm_frames_capture__webaudio)(e, t, n)),
              mr = (a._ma_device_process_pcm_frames_playback__webaudio = (
                e,
                t,
                n
              ) =>
                (mr = a._ma_device_process_pcm_frames_playback__webaudio =
                  _.ma_device_process_pcm_frames_playback__webaudio)(e, t, n)),
              gr = (e) => (gr = _.__getTypeName)(e);
            a.__embind_initialize_bindings = () =>
              (a.__embind_initialize_bindings =
                _._embind_initialize_bindings)();
            a.dynCall_iiiji = (e, t, n, r, i, o) =>
              (a.dynCall_iiiji = _.dynCall_iiiji)(e, t, n, r, i, o);
            a.dynCall_iij = (e, t, n, r) =>
              (a.dynCall_iij = _.dynCall_iij)(e, t, n, r);
            a.dynCall_iiji = (e, t, n, r, i) =>
              (a.dynCall_iiji = _.dynCall_iiji)(e, t, n, r, i);
            a.dynCall_jii = (e, t, n) =>
              (a.dynCall_jii = _.dynCall_jii)(e, t, n);
            a.dynCall_vijj = (e, t, n, r, i, o) =>
              (a.dynCall_vijj = _.dynCall_vijj)(e, t, n, r, i, o);
            a.dynCall_jiji = (e, t, n, r, i) =>
              (a.dynCall_jiji = _.dynCall_jiji)(e, t, n, r, i);
            a.dynCall_viijii = (e, t, n, r, i, o, s) =>
              (a.dynCall_viijii = _.dynCall_viijii)(e, t, n, r, i, o, s);
            a.dynCall_iiiiij = (e, t, n, r, i, o, s) =>
              (a.dynCall_iiiiij = _.dynCall_iiiiij)(e, t, n, r, i, o, s);
            a.dynCall_iiiiijj = (e, t, n, r, i, o, s, u, l) =>
              (a.dynCall_iiiiijj = _.dynCall_iiiiijj)(
                e,
                t,
                n,
                r,
                i,
                o,
                s,
                u,
                l
              );
            a.dynCall_iiiiiijj = (e, t, n, r, i, o, s, u, l, c) =>
              (a.dynCall_iiiiiijj = _.dynCall_iiiiiijj)(
                e,
                t,
                n,
                r,
                i,
                o,
                s,
                u,
                l,
                c
              );
            a.___start_em_js = 515140;
            a.___stop_em_js = 517895;
            var br;
            D = function e() {
              br || yr();
              br || (D = e);
            };
            function yr() {
              function e() {
                if (!br && ((br = !0), (a.calledRun = !0), !R)) {
                  a.noFSInit ||
                    ye ||
                    ((ye = !0),
                    Ke(),
                    (a.stdin = a.stdin),
                    (a.stdout = a.stdout),
                    (a.stderr = a.stderr),
                    a.stdin
                      ? Ze("stdin", a.stdin)
                      : Ye("/dev/tty", "/dev/stdin"),
                    a.stdout
                      ? Ze("stdout", null, a.stdout)
                      : Ye("/dev/tty", "/dev/stdout"),
                    a.stderr
                      ? Ze("stderr", null, a.stderr)
                      : Ye("/dev/tty1", "/dev/stderr"),
                    qe("/dev/stdin", 0),
                    qe("/dev/stdout", 1),
                    qe("/dev/stderr", 1));
                  Le = !1;
                  K(T);
                  r(a);
                  a.onRuntimeInitialized && a.onRuntimeInitialized();
                  if (a.postRun)
                    for (
                      "function" == typeof a.postRun &&
                      (a.postRun = [a.postRun]);
                      a.postRun.length;

                    ) {
                      var e = a.postRun.shift();
                      j.unshift(e);
                    }
                  K(j);
                }
              }
              if (!(0 < W)) {
                if (a.preRun)
                  for (
                    "function" == typeof a.preRun && (a.preRun = [a.preRun]);
                    a.preRun.length;

                  )
                    O();
                K(k);
                0 < W ||
                  (a.setStatus
                    ? (a.setStatus("Running..."),
                      setTimeout(function () {
                        setTimeout(function () {
                          a.setStatus("");
                        }, 1);
                        e();
                      }, 1))
                    : e());
              }
            }
            if (a.preInit)
              for (
                "function" == typeof a.preInit && (a.preInit = [a.preInit]);
                0 < a.preInit.length;

              )
                a.preInit.pop()();
            yr();
            return n.ready;
          };
        })();
        const a = i;
      },
      (e) => {
        e.exports = JSON.parse(
          '{"name":"@rive-app/webgl2","version":"2.27.5","description":"Rive\'s webgl2 based web api.","main":"rive.js","homepage":"https://rive.app","repository":{"type":"git","url":"https://github.com/rive-app/rive-wasm/tree/master/js"},"keywords":["rive","animation"],"author":"Rive","contributors":["Luigi Rosso <luigi@rive.app> (https://rive.app)","Maxwell Talbot <max@rive.app> (https://rive.app)","Arthur Vivian <arthur@rive.app> (https://rive.app)","Umberto Sonnino <umberto@rive.app> (https://rive.app)","Matthew Sullivan <matt.j.sullivan@gmail.com> (mailto:matt.j.sullivan@gmail.com)","Chris Dalton <chris@rive.app> (https://rive.app)"],"license":"MIT","files":["rive.js","rive.wasm","rive.js.map","rive.d.ts","rive_advanced.mjs.d.ts"],"typings":"rive.d.ts","dependencies":{},"browser":{"fs":false,"path":false}}'
        );
      },
      (e, t, n) => {
        n.r(t);
        n.d(t, { Animation: () => r.Animation });
        var r = n(4);
      },
      (t, n, r) => {
        r.r(n);
        r.d(n, { Animation: () => i });
        var i = (function () {
          /**
           * Constructs a new animation
           * @constructor
           * @param {any} animation: runtime animation object
           * @param {any} instance: runtime animation instance object
           */
          function t(t, n, r, i) {
            (this || e).animation = t;
            (this || e).artboard = n;
            (this || e).playing = i;
            (this || e).loopCount = 0;
            (this || e).scrubTo = null;
            (this || e).instance = new r.LinearAnimationInstance(t, n);
          }
          Object.defineProperty(t.prototype, "name", {
            get: function () {
              return (this || e).animation.name;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(t.prototype, "time", {
            get: function () {
              return (this || e).instance.time;
            },
            set: function (t) {
              (this || e).instance.time = t;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(t.prototype, "loopValue", {
            get: function () {
              return (this || e).animation.loopValue;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(t.prototype, "needsScrub", {
            /**
             * Indicates whether the animation needs to be scrubbed.
             * @returns `true` if the animation needs to be scrubbed, `false` otherwise.
             */
            get: function () {
              return (this || e).scrubTo !== null;
            },
            enumerable: false,
            configurable: true,
          });
          /**
           * Advances the animation by the give time. If the animation needs scrubbing,
           * time is ignored and the stored scrub value is used.
           * @param time the time to advance the animation by if no scrubbing required
           */ t.prototype.advance = function (t) {
            if ((this || e).scrubTo === null) (this || e).instance.advance(t);
            else {
              (this || e).instance.time = 0;
              (this || e).instance.advance((this || e).scrubTo);
              (this || e).scrubTo = null;
            }
          };
          /**
           * Apply interpolated keyframe values to the artboard. This should be called after calling
           * .advance() on an animation instance so that new values are applied to properties.
           *
           * Note: This does not advance the artboard, which updates all objects on the artboard
           * @param mix - Mix value for the animation from 0 to 1
           */ t.prototype.apply = function (t) {
            (this || e).instance.apply(t);
          };
          t.prototype.cleanup = function () {
            (this || e).instance.delete();
          };
          return t;
        })();
      },
      (e, t, n) => {
        n.r(t);
        n.d(t, {
          AudioAssetWrapper: () => a.AudioAssetWrapper,
          AudioWrapper: () => a.AudioWrapper,
          BLANK_URL: () => i.BLANK_URL,
          CustomFileAssetLoaderWrapper: () => a.CustomFileAssetLoaderWrapper,
          FileAssetWrapper: () => a.FileAssetWrapper,
          Finalizable: () => a.Finalizable,
          FontAssetWrapper: () => a.FontAssetWrapper,
          FontWrapper: () => a.FontWrapper,
          ImageAssetWrapper: () => a.ImageAssetWrapper,
          ImageWrapper: () => a.ImageWrapper,
          finalizationRegistry: () => a.finalizationRegistry,
          registerTouchInteractions: () => r.registerTouchInteractions,
          sanitizeUrl: () => i.sanitizeUrl,
        });
        var r = n(6);
        var i = n(7);
        var a = n(8);
      },
      (e, t, n) => {
        n.r(t);
        n.d(t, { registerTouchInteractions: () => a });
        var r = void 0;
        /**
         * Returns the clientX and clientY properties from touch or mouse events. Also
         * calls preventDefault() on the event if it is a touchstart or touchmove to prevent
         * scrolling the page on mobile devices
         * @param event - Either a TouchEvent or a MouseEvent
         * @returns - Coordinates of the clientX and clientY properties from the touch/mouse event
         */ var i = function (e, t) {
          var n, r;
          if (
            ["touchstart", "touchmove"].indexOf(e.type) > -1 &&
            ((n = e.touches) === null || n === void 0 ? void 0 : n.length)
          ) {
            t || e.preventDefault();
            return {
              clientX: e.touches[0].clientX,
              clientY: e.touches[0].clientY,
            };
          }
          return e.type === "touchend" &&
            ((r = e.changedTouches) === null || r === void 0
              ? void 0
              : r.length)
            ? {
                clientX: e.changedTouches[0].clientX,
                clientY: e.changedTouches[0].clientY,
              }
            : { clientX: e.clientX, clientY: e.clientY };
        };
        var a = function (e) {
          var t = e.canvas,
            n = e.artboard,
            a = e.stateMachines,
            o = a === void 0 ? [] : a,
            s = e.renderer,
            u = e.rive,
            l = e.fit,
            c = e.alignment,
            f = e.isTouchScrollEnabled,
            h = f !== void 0 && f,
            d = e.layoutScaleFactor,
            p = d === void 0 ? 1 : d;
          if (
            !t ||
            !o.length ||
            !s ||
            !u ||
            !n ||
            typeof window === "undefined"
          )
            return null;
          var v = null;
          var m = false;
          var g = function (e) {
            if (m && e instanceof MouseEvent)
              e.type == "mouseup" && (m = false);
            else {
              m = h && e.type === "touchend" && v === "touchstart";
              v = e.type;
              var t = e.currentTarget.getBoundingClientRect();
              var r = i(e, h),
                a = r.clientX,
                s = r.clientY;
              if (a || s) {
                var f = a - t.left;
                var d = s - t.top;
                var g = u.computeAlignment(
                  l,
                  c,
                  { minX: 0, minY: 0, maxX: t.width, maxY: t.height },
                  n.bounds,
                  p
                );
                var b = new u.Mat2D();
                g.invert(b);
                var y = new u.Vec2D(f, d);
                var w = u.mapXY(b, y);
                var _ = w.x();
                var A = w.y();
                w.delete();
                b.delete();
                y.delete();
                g.delete();
                switch (e.type) {
                  case "mouseout":
                    for (var C = 0, M = o; C < M.length; C++) {
                      var E = M[C];
                      E.pointerMove(_, A);
                    }
                    break;
                  case "touchmove":
                  case "mouseover":
                  case "mousemove":
                    for (var P = 0, I = o; P < I.length; P++) {
                      E = I[P];
                      E.pointerMove(_, A);
                    }
                    break;
                  case "touchstart":
                  case "mousedown":
                    for (var L = 0, F = o; L < F.length; L++) {
                      E = F[L];
                      E.pointerDown(_, A);
                    }
                    break;
                  case "touchend":
                  case "mouseup":
                    for (var R = 0, S = o; R < S.length; R++) {
                      E = S[R];
                      E.pointerUp(_, A);
                    }
                    break;
                  default:
                }
              }
            }
          };
          var b = g.bind(r);
          t.addEventListener("mouseover", b);
          t.addEventListener("mouseout", b);
          t.addEventListener("mousemove", b);
          t.addEventListener("mousedown", b);
          t.addEventListener("mouseup", b);
          t.addEventListener("touchmove", b, { passive: h });
          t.addEventListener("touchstart", b, { passive: h });
          t.addEventListener("touchend", b);
          return function () {
            t.removeEventListener("mouseover", b);
            t.removeEventListener("mouseout", b);
            t.removeEventListener("mousemove", b);
            t.removeEventListener("mousedown", b);
            t.removeEventListener("mouseup", b);
            t.removeEventListener("touchmove", b);
            t.removeEventListener("touchstart", b);
            t.removeEventListener("touchend", b);
          };
        };
      },
      (e, t, n) => {
        n.r(t);
        n.d(t, { BLANK_URL: () => l, sanitizeUrl: () => h });
        var r = /^([^\w]*)(javascript|data|vbscript)/im;
        var i = /&#(\w+)(^\w|;)?/g;
        var a = /&(newline|tab);/gi;
        var o = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
        var s = /^.+(:|&colon;)/gim;
        var u = [".", "/"];
        var l = "about:blank";
        function c(e) {
          return u.indexOf(e[0]) > -1;
        }
        function f(e) {
          var t = e.replace(o, "");
          return t.replace(i, function (e, t) {
            return String.fromCharCode(t);
          });
        }
        function h(e) {
          if (!e) return l;
          var t = f(e).replace(a, "").replace(o, "").trim();
          if (!t) return l;
          if (c(t)) return t;
          var n = t.match(s);
          if (!n) return t;
          var i = n[0];
          return r.test(i) ? l : t;
        }
      },
      (t, n, r) => {
        r.r(n);
        r.d(n, {
          AudioAssetWrapper: () => h,
          AudioWrapper: () => s,
          CustomFileAssetLoaderWrapper: () => l,
          FileAssetWrapper: () => c,
          Finalizable: () => a,
          FontAssetWrapper: () => d,
          FontWrapper: () => u,
          ImageAssetWrapper: () => f,
          ImageWrapper: () => o,
          finalizationRegistry: () => m,
        });
        var i =
          (void 0,
          (function () {
            var t = function (e, n) {
              t =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (e, t) {
                    e.__proto__ = t;
                  }) ||
                function (e, t) {
                  for (var n in t)
                    Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
                };
              return t(e, n);
            };
            return function (n, r) {
              if (typeof r !== "function" && r !== null)
                throw new TypeError(
                  "Class extends value " +
                    String(r) +
                    " is not a constructor or null"
                );
              t(n, r);
              function i() {
                (this || e).constructor = n;
              }
              n.prototype =
                r === null
                  ? Object.create(r)
                  : ((i.prototype = r.prototype), new i());
            };
          })());
        var a = (function () {
          function t() {
            (this || e).selfUnref = false;
          }
          return t;
        })();
        var o = (function (t) {
          i(n, t);
          function n(n) {
            var r = t.call(this || e) || this || e;
            r._nativeImage = n;
            return r;
          }
          Object.defineProperty(n.prototype, "nativeImage", {
            get: function () {
              return (this || e)._nativeImage;
            },
            enumerable: false,
            configurable: true,
          });
          n.prototype.unref = function () {
            (this || e).selfUnref && (this || e)._nativeImage.unref();
          };
          return n;
        })(a);
        var s = (function (t) {
          i(n, t);
          function n(n) {
            var r = t.call(this || e) || this || e;
            r._nativeAudio = n;
            return r;
          }
          Object.defineProperty(n.prototype, "nativeAudio", {
            get: function () {
              return (this || e)._nativeAudio;
            },
            enumerable: false,
            configurable: true,
          });
          n.prototype.unref = function () {
            (this || e).selfUnref && (this || e)._nativeAudio.unref();
          };
          return n;
        })(a);
        var u = (function (t) {
          i(n, t);
          function n(n) {
            var r = t.call(this || e) || this || e;
            r._nativeFont = n;
            return r;
          }
          Object.defineProperty(n.prototype, "nativeFont", {
            get: function () {
              return (this || e)._nativeFont;
            },
            enumerable: false,
            configurable: true,
          });
          n.prototype.unref = function () {
            (this || e).selfUnref && (this || e)._nativeFont.unref();
          };
          return n;
        })(a);
        var l = (function () {
          function t(t, n) {
            (this || e)._assetLoaderCallback = n;
            (this || e).assetLoader = new t.CustomFileAssetLoader({
              loadContents: (this || e).loadContents.bind(this || e),
            });
          }
          t.prototype.loadContents = function (e, t) {
            var n;
            e.isImage
              ? (n = new f(e))
              : e.isAudio
              ? (n = new h(e))
              : e.isFont && (n = new d(e));
            return this._assetLoaderCallback(n, t);
          };
          return t;
        })();
        var c = (function () {
          function t(t) {
            (this || e)._nativeFileAsset = t;
          }
          t.prototype.decode = function (t) {
            (this || e)._nativeFileAsset.decode(t);
          };
          Object.defineProperty(t.prototype, "name", {
            get: function () {
              return (this || e)._nativeFileAsset.name;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(t.prototype, "fileExtension", {
            get: function () {
              return (this || e)._nativeFileAsset.fileExtension;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(t.prototype, "uniqueFilename", {
            get: function () {
              return (this || e)._nativeFileAsset.uniqueFilename;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(t.prototype, "isAudio", {
            get: function () {
              return (this || e)._nativeFileAsset.isAudio;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(t.prototype, "isImage", {
            get: function () {
              return (this || e)._nativeFileAsset.isImage;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(t.prototype, "isFont", {
            get: function () {
              return (this || e)._nativeFileAsset.isFont;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(t.prototype, "cdnUuid", {
            get: function () {
              return (this || e)._nativeFileAsset.cdnUuid;
            },
            enumerable: false,
            configurable: true,
          });
          Object.defineProperty(t.prototype, "nativeFileAsset", {
            get: function () {
              return (this || e)._nativeFileAsset;
            },
            enumerable: false,
            configurable: true,
          });
          return t;
        })();
        var f = (function (t) {
          i(n, t);
          function n() {
            return (t !== null && t.apply(this || e, arguments)) || this || e;
          }
          n.prototype.setRenderImage = function (t) {
            (this || e)._nativeFileAsset.setRenderImage(t.nativeImage);
          };
          return n;
        })(c);
        var h = (function (t) {
          i(n, t);
          function n() {
            return (t !== null && t.apply(this || e, arguments)) || this || e;
          }
          n.prototype.setAudioSource = function (t) {
            (this || e)._nativeFileAsset.setAudioSource(t.nativeAudio);
          };
          return n;
        })(c);
        var d = (function (t) {
          i(n, t);
          function n() {
            return (t !== null && t.apply(this || e, arguments)) || this || e;
          }
          n.prototype.setFont = function (t) {
            (this || e)._nativeFileAsset.setFont(t.nativeFont);
          };
          return n;
        })(c);
        var p = (function (t) {
          i(n, t);
          function n(n) {
            return t.call(this || e, n) || this || e;
          }
          n.prototype.register = function (e) {
            e.selfUnref = true;
          };
          n.prototype.unregister = function (e) {};
          return n;
        })(FinalizationRegistry);
        var v = FinalizationRegistry || p;
        var m = new v(function (e) {
          e.unref();
        });
      },
    ];
    var n = {};
    function r(e) {
      var i = n[e];
      if (i !== void 0) return i.exports;
      var a = (n[e] = { exports: {} });
      t[e](a, a.exports, r);
      return a.exports;
    }
    (() => {
      r.d = (e, t) => {
        for (var n in t)
          r.o(t, n) &&
            !r.o(e, n) &&
            Object.defineProperty(e, n, { enumerable: true, get: t[n] });
      };
    })();
    (() => {
      r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
    })();
    (() => {
      r.r = (e) => {
        typeof Symbol !== "undefined" &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
        Object.defineProperty(e, "__esModule", { value: true });
      };
    })();
    var i = {};
    (() => {
      r.r(i);
      r.d(i, {
        Alignment: () => v,
        DataEnum: () => W,
        EventType: () => C,
        Fit: () => p,
        Layout: () => m,
        LoopType: () => M,
        Rive: () => j,
        RiveEventType: () => w,
        RiveFile: () => T,
        RuntimeLoader: () => g,
        StateMachineInput: () => y,
        StateMachineInputType: () => b,
        Testing: () => K,
        ViewModel: () => O,
        ViewModelInstance: () => D,
        ViewModelInstanceAssetImage: () => X,
        ViewModelInstanceBoolean: () => $,
        ViewModelInstanceColor: () => Y,
        ViewModelInstanceEnum: () => z,
        ViewModelInstanceList: () => H,
        ViewModelInstanceNumber: () => N,
        ViewModelInstanceString: () => U,
        ViewModelInstanceTrigger: () => G,
        ViewModelInstanceValue: () => V,
        decodeAudio: () => Z,
        decodeFont: () => ee,
        decodeImage: () => Q,
      });
      var t = r(1);
      var n = r(2);
      var a = r(3);
      var o = r(5);
      var s =
        (void 0,
        (function () {
          var t = function (e, n) {
            t =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (e, t) {
                  e.__proto__ = t;
                }) ||
              function (e, t) {
                for (var n in t)
                  Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
              };
            return t(e, n);
          };
          return function (n, r) {
            if (typeof r !== "function" && r !== null)
              throw new TypeError(
                "Class extends value " +
                  String(r) +
                  " is not a constructor or null"
              );
            t(n, r);
            function i() {
              (this || e).constructor = n;
            }
            n.prototype =
              r === null
                ? Object.create(r)
                : ((i.prototype = r.prototype), new i());
          };
        })());
      var u =
        (void 0,
        function () {
          u =
            Object.assign ||
            function (e) {
              for (var t, n = 1, r = arguments.length; n < r; n++) {
                t = arguments[n];
                for (var i in t)
                  Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
              }
              return e;
            };
          return u.apply(this || e, arguments);
        });
      var l =
        (void 0,
        function (e, t, n, r) {
          function i(e) {
            return e instanceof n
              ? e
              : new n(function (t) {
                  t(e);
                });
          }
          return new (n || (n = Promise))(function (n, a) {
            function o(e) {
              try {
                u(r.next(e));
              } catch (e) {
                a(e);
              }
            }
            function s(e) {
              try {
                u(r.throw(e));
              } catch (e) {
                a(e);
              }
            }
            function u(e) {
              e.done ? n(e.value) : i(e.value).then(o, s);
            }
            u((r = r.apply(e, t || [])).next());
          });
        });
      var c =
        (void 0,
        function (t, n) {
          var r,
            i,
            a,
            o = {
              label: 0,
              sent: function () {
                if (a[0] & 1) throw a[1];
                return a[1];
              },
              trys: [],
              ops: [],
            },
            s = Object.create(
              (typeof Iterator === "function" ? Iterator : Object).prototype
            );
          return (
            (s.next = u(0)),
            (s.throw = u(1)),
            (s.return = u(2)),
            typeof Symbol === "function" &&
              (s[Symbol.iterator] = function () {
                return this || e;
              }),
            s
          );
          function u(e) {
            return function (t) {
              return l([e, t]);
            };
          }
          function l(e) {
            if (r) throw new TypeError("Generator is already executing.");
            while ((s && ((s = 0), e[0] && (o = 0)), o))
              try {
                if (
                  ((r = 1),
                  i &&
                    (a =
                      e[0] & 2
                        ? i.return
                        : e[0]
                        ? i.throw || ((a = i.return) && a.call(i), 0)
                        : i.next) &&
                    !(a = a.call(i, e[1])).done)
                )
                  return a;
                ((i = 0), a) && (e = [e[0] & 2, a.value]);
                switch (e[0]) {
                  case 0:
                  case 1:
                    a = e;
                    break;
                  case 4:
                    o.label++;
                    return { value: e[1], done: false };
                  case 5:
                    o.label++;
                    i = e[1];
                    e = [0];
                    continue;
                  case 7:
                    e = o.ops.pop();
                    o.trys.pop();
                    continue;
                  default:
                    if (
                      !((a = o.trys), (a = a.length > 0 && a[a.length - 1])) &&
                      (e[0] === 6 || e[0] === 2)
                    ) {
                      o = 0;
                      continue;
                    }
                    if (e[0] === 3 && (!a || (e[1] > a[0] && e[1] < a[3]))) {
                      o.label = e[1];
                      break;
                    }
                    if (e[0] === 6 && o.label < a[1]) {
                      o.label = a[1];
                      a = e;
                      break;
                    }
                    if (a && o.label < a[2]) {
                      o.label = a[2];
                      o.ops.push(e);
                      break;
                    }
                    a[2] && o.ops.pop();
                    o.trys.pop();
                    continue;
                }
                e = n.call(t, o);
              } catch (t) {
                e = [6, t];
                i = 0;
              } finally {
                r = a = 0;
              }
            if (e[0] & 5) throw e[1];
            return { value: e[0] ? e[1] : void 0, done: true };
          }
        });
      var f =
        (void 0,
        function (e, t, n) {
          if (n || arguments.length === 2)
            for (var r, i = 0, a = t.length; i < a; i++)
              if (r || !(i in t)) {
                r || (r = Array.prototype.slice.call(t, 0, i));
                r[i] = t[i];
              }
          return e.concat(r || Array.prototype.slice.call(t));
        });
      var h = (function (t) {
        s(n, t);
        function n() {
          var n = (t !== null && t.apply(this || e, arguments)) || this || e;
          n.isHandledError = true;
          return n;
        }
        return n;
      })(Error);
      var d = function (e) {
        return e && e.isHandledError
          ? e.message
          : "Problem loading file; may be corrupt!";
      };
      var p;
      (function (e) {
        e.Cover = "cover";
        e.Contain = "contain";
        e.Fill = "fill";
        e.FitWidth = "fitWidth";
        e.FitHeight = "fitHeight";
        e.None = "none";
        e.ScaleDown = "scaleDown";
        e.Layout = "layout";
      })(p || (p = {}));
      var v;
      (function (e) {
        e.Center = "center";
        e.TopLeft = "topLeft";
        e.TopCenter = "topCenter";
        e.TopRight = "topRight";
        e.CenterLeft = "centerLeft";
        e.CenterRight = "centerRight";
        e.BottomLeft = "bottomLeft";
        e.BottomCenter = "bottomCenter";
        e.BottomRight = "bottomRight";
      })(v || (v = {}));
      var m = (function () {
        function t(t) {
          var n, r, i, a, o, s, u;
          (this || e).fit =
            (n = t === null || t === void 0 ? void 0 : t.fit) !== null &&
            n !== void 0
              ? n
              : p.Contain;
          (this || e).alignment =
            (r = t === null || t === void 0 ? void 0 : t.alignment) !== null &&
            r !== void 0
              ? r
              : v.Center;
          (this || e).layoutScaleFactor =
            (i = t === null || t === void 0 ? void 0 : t.layoutScaleFactor) !==
              null && i !== void 0
              ? i
              : 1;
          (this || e).minX =
            (a = t === null || t === void 0 ? void 0 : t.minX) !== null &&
            a !== void 0
              ? a
              : 0;
          (this || e).minY =
            (o = t === null || t === void 0 ? void 0 : t.minY) !== null &&
            o !== void 0
              ? o
              : 0;
          (this || e).maxX =
            (s = t === null || t === void 0 ? void 0 : t.maxX) !== null &&
            s !== void 0
              ? s
              : 0;
          (this || e).maxY =
            (u = t === null || t === void 0 ? void 0 : t.maxY) !== null &&
            u !== void 0
              ? u
              : 0;
        }
        t.new = function (e) {
          var n = e.fit,
            r = e.alignment,
            i = e.minX,
            a = e.minY,
            o = e.maxX,
            s = e.maxY;
          console.warn(
            "This function is deprecated: please use `new Layout({})` instead"
          );
          return new t({
            fit: n,
            alignment: r,
            minX: i,
            minY: a,
            maxX: o,
            maxY: s,
          });
        };
        t.prototype.copyWith = function (n) {
          var r = n.fit,
            i = n.alignment,
            a = n.layoutScaleFactor,
            o = n.minX,
            s = n.minY,
            u = n.maxX,
            l = n.maxY;
          return new t({
            fit: r !== null && r !== void 0 ? r : (this || e).fit,
            alignment: i !== null && i !== void 0 ? i : (this || e).alignment,
            layoutScaleFactor:
              a !== null && a !== void 0 ? a : (this || e).layoutScaleFactor,
            minX: o !== null && o !== void 0 ? o : (this || e).minX,
            minY: s !== null && s !== void 0 ? s : (this || e).minY,
            maxX: u !== null && u !== void 0 ? u : (this || e).maxX,
            maxY: l !== null && l !== void 0 ? l : (this || e).maxY,
          });
        };
        t.prototype.runtimeFit = function (t) {
          if ((this || e).cachedRuntimeFit) return (this || e).cachedRuntimeFit;
          var n;
          n =
            (this || e).fit === p.Cover
              ? t.Fit.cover
              : (this || e).fit === p.Contain
              ? t.Fit.contain
              : (this || e).fit === p.Fill
              ? t.Fit.fill
              : (this || e).fit === p.FitWidth
              ? t.Fit.fitWidth
              : (this || e).fit === p.FitHeight
              ? t.Fit.fitHeight
              : (this || e).fit === p.ScaleDown
              ? t.Fit.scaleDown
              : (this || e).fit === p.Layout
              ? t.Fit.layout
              : t.Fit.none;
          (this || e).cachedRuntimeFit = n;
          return n;
        };
        t.prototype.runtimeAlignment = function (t) {
          if ((this || e).cachedRuntimeAlignment)
            return (this || e).cachedRuntimeAlignment;
          var n;
          n =
            (this || e).alignment === v.TopLeft
              ? t.Alignment.topLeft
              : (this || e).alignment === v.TopCenter
              ? t.Alignment.topCenter
              : (this || e).alignment === v.TopRight
              ? t.Alignment.topRight
              : (this || e).alignment === v.CenterLeft
              ? t.Alignment.centerLeft
              : (this || e).alignment === v.CenterRight
              ? t.Alignment.centerRight
              : (this || e).alignment === v.BottomLeft
              ? t.Alignment.bottomLeft
              : (this || e).alignment === v.BottomCenter
              ? t.Alignment.bottomCenter
              : (this || e).alignment === v.BottomRight
              ? t.Alignment.bottomRight
              : t.Alignment.center;
          (this || e).cachedRuntimeAlignment = n;
          return n;
        };
        return t;
      })();
      var g = (function () {
        function e() {}
        e.loadRuntime = function () {
          t.default({
            locateFile: function () {
              return e.wasmURL;
            },
          })
            .then(function (t) {
              var n;
              e.runtime = t;
              while (e.callBackQueue.length > 0)
                (n = e.callBackQueue.shift()) === null || n === void 0
                  ? void 0
                  : n(e.runtime);
            })
            .catch(function (t) {
              var r = {
                message:
                  (t === null || t === void 0 ? void 0 : t.message) ||
                  "Unknown error",
                type: (t === null || t === void 0 ? void 0 : t.name) || "Error",
                wasmError:
                  t instanceof WebAssembly.CompileError ||
                  t instanceof WebAssembly.RuntimeError,
                originalError: t,
              };
              console.debug("Rive WASM load error details:", r);
              var i = "https://cdn.jsdelivr.net/npm/"
                .concat(n.name, "@")
                .concat(n.version, "/rive_fallback.wasm");
              if (e.wasmURL.toLowerCase() !== i) {
                console.warn(
                  "Failed to load WASM from "
                    .concat(e.wasmURL, " (")
                    .concat(r.message, "), trying jsdelivr as a backup")
                );
                e.setWasmUrl(i);
                e.loadRuntime();
              } else {
                var a = [
                  "Could not load Rive WASM file from "
                    .concat(e.wasmURL, " or ")
                    .concat(i, "."),
                  "Possible reasons:",
                  "- Network connection is down",
                  "- WebAssembly is not supported in this environment",
                  "- The WASM file is corrupted or incompatible",
                  "\nError details:",
                  "- Type: ".concat(r.type),
                  "- Message: ".concat(r.message),
                  "- WebAssembly-specific error: ".concat(r.wasmError),
                  "\nTo resolve, you may need to:",
                  "1. Check your network connection",
                  "2. Set a new WASM source via RuntimeLoader.setWasmUrl()",
                  "3. Call RuntimeLoader.loadRuntime() again",
                ].join("\n");
                console.error(a);
              }
            });
        };
        e.getInstance = function (t) {
          if (!e.isLoading) {
            e.isLoading = true;
            e.loadRuntime();
          }
          e.runtime ? t(e.runtime) : e.callBackQueue.push(t);
        };
        e.awaitInstance = function () {
          return new Promise(function (t) {
            return e.getInstance(function (e) {
              return t(e);
            });
          });
        };
        e.setWasmUrl = function (t) {
          e.wasmURL = t;
        };
        e.getWasmUrl = function () {
          return e.wasmURL;
        };
        e.isLoading = false;
        e.callBackQueue = [];
        e.wasmURL = "https://unpkg.com/"
          .concat(n.name, "@")
          .concat(n.version, "/rive.wasm");
        return e;
      })();
      var b;
      (function (e) {
        e[(e.Number = 56)] = "Number";
        e[(e.Trigger = 58)] = "Trigger";
        e[(e.Boolean = 59)] = "Boolean";
      })(b || (b = {}));
      var y = (function () {
        function t(t, n) {
          (this || e).type = t;
          (this || e).runtimeInput = n;
        }
        Object.defineProperty(t.prototype, "name", {
          get: function () {
            return (this || e).runtimeInput.name;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "value", {
          get: function () {
            return (this || e).runtimeInput.value;
          },
          set: function (t) {
            (this || e).runtimeInput.value = t;
          },
          enumerable: false,
          configurable: true,
        });
        t.prototype.fire = function () {
          (this || e).type === b.Trigger && (this || e).runtimeInput.fire();
        };
        t.prototype.delete = function () {
          (this || e).runtimeInput = null;
        };
        return t;
      })();
      var w;
      (function (e) {
        e[(e.General = 128)] = "General";
        e[(e.OpenUrl = 131)] = "OpenUrl";
      })(w || (w = {}));
      var _ = (function () {
        /**
         * @constructor
         * @param stateMachine runtime state machine object
         * @param instance runtime state machine instance object
         */
        function t(t, n, r, i) {
          (this || e).stateMachine = t;
          (this || e).playing = r;
          (this || e).artboard = i;
          (this || e).inputs = [];
          (this || e).instance = new n.StateMachineInstance(t, i);
          this.initInputs(n);
        }
        Object.defineProperty(t.prototype, "name", {
          get: function () {
            return (this || e).stateMachine.name;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "statesChanged", {
          get: function () {
            var t = [];
            for (var n = 0; n < (this || e).instance.stateChangedCount(); n++)
              t.push((this || e).instance.stateChangedNameByIndex(n));
            return t;
          },
          enumerable: false,
          configurable: true,
        });
        /**
         * Advances the state machine instance by a given time.
         * @param time - the time to advance the animation by in seconds
         */ t.prototype.advance = function (t) {
          (this || e).instance.advance(t);
        };
        /**
         * Advances the state machine instance by a given time and apply changes to artboard.
         * @param time - the time to advance the animation by in seconds
         */ t.prototype.advanceAndApply = function (t) {
          (this || e).instance.advanceAndApply(t);
        };
        /**
         * Returns the number of events reported from the last advance call
         * @returns Number of events reported
         */ t.prototype.reportedEventCount = function () {
          return (this || e).instance.reportedEventCount();
        };
        /**
         * Returns a RiveEvent object emitted from the last advance call at the given index
         * of a list of potentially multiple events. If an event at the index is not found,
         * undefined is returned.
         * @param i index of the event reported in a list of potentially multiple events
         * @returns RiveEvent or extended RiveEvent object returned, or undefined
         */ t.prototype.reportedEventAt = function (t) {
          return (this || e).instance.reportedEventAt(t);
        };
        /**
         * Fetches references to the state machine's inputs and caches them
         * @param runtime an instance of the runtime; needed for the SMIInput types
         */ t.prototype.initInputs = function (t) {
          for (var n = 0; n < (this || e).instance.inputCount(); n++) {
            var r = (this || e).instance.input(n);
            (this || e).inputs.push(this.mapRuntimeInput(r, t));
          }
        };
        /**
         * Maps a runtime input to it's appropriate type
         * @param input
         */ t.prototype.mapRuntimeInput = function (e, t) {
          return e.type === t.SMIInput.bool
            ? new y(b.Boolean, e.asBool())
            : e.type === t.SMIInput.number
            ? new y(b.Number, e.asNumber())
            : e.type === t.SMIInput.trigger
            ? new y(b.Trigger, e.asTrigger())
            : void 0;
        };
        t.prototype.cleanup = function () {
          (this || e).inputs.forEach(function (e) {
            e.delete();
          });
          (this || e).inputs.length = 0;
          (this || e).instance.delete();
        };
        t.prototype.bindViewModelInstance = function (t) {
          t.runtimeInstance != null &&
            (this || e).instance.bindViewModelInstance(t.runtimeInstance);
        };
        return t;
      })();
      var A = (function () {
        /**
         * Constructs a new animator
         * @constructor
         * @param runtime Rive runtime; needed to instance animations & state machines
         * @param artboard the artboard that holds all animations and state machines
         * @param animations optional list of animations
         * @param stateMachines optional list of state machines
         */
        function t(t, n, r, i, a) {
          i === void 0 && (i = []);
          a === void 0 && (a = []);
          (this || e).runtime = t;
          (this || e).artboard = n;
          (this || e).eventManager = r;
          (this || e).animations = i;
          (this || e).stateMachines = a;
        }
        /**
         * Adds animations and state machines by their names. If names are shared
         * between animations & state machines, then the first one found will be
         * created. Best not to use the same names for these in your Rive file.
         * @param animatable the name(s) of animations and state machines to add
         * @returns a list of names of the playing animations and state machines
         */ t.prototype.add = function (t, n, r) {
          r === void 0 && (r = true);
          t = J(t);
          if (t.length === 0) {
            (this || e).animations.forEach(function (e) {
              return (e.playing = n);
            });
            (this || e).stateMachines.forEach(function (e) {
              return (e.playing = n);
            });
          } else {
            var i = (this || e).animations.map(function (e) {
              return e.name;
            });
            var o = (this || e).stateMachines.map(function (e) {
              return e.name;
            });
            for (var s = 0; s < t.length; s++) {
              var u = i.indexOf(t[s]);
              var l = o.indexOf(t[s]);
              if (u >= 0 || l >= 0)
                u >= 0
                  ? ((this || e).animations[u].playing = n)
                  : ((this || e).stateMachines[l].playing = n);
              else {
                var c = (this || e).artboard.animationByName(t[s]);
                if (c) {
                  var f = new a.Animation(
                    c,
                    (this || e).artboard,
                    (this || e).runtime,
                    n
                  );
                  f.advance(0);
                  f.apply(1);
                  (this || e).animations.push(f);
                } else {
                  var h = (this || e).artboard.stateMachineByName(t[s]);
                  if (h) {
                    var d = new _(
                      h,
                      (this || e).runtime,
                      n,
                      (this || e).artboard
                    );
                    (this || e).stateMachines.push(d);
                  }
                }
              }
            }
          }
          r &&
            (n
              ? (this || e).eventManager.fire({
                  type: C.Play,
                  data: (this || e).playing,
                })
              : (this || e).eventManager.fire({
                  type: C.Pause,
                  data: (this || e).paused,
                }));
          return n ? (this || e).playing : (this || e).paused;
        };
        /**
         * Adds linear animations by their names.
         * @param animatables the name(s) of animations to add
         * @param playing whether animations should play on instantiation
         */ t.prototype.initLinearAnimations = function (t, n) {
          var r = (this || e).animations.map(function (e) {
            return e.name;
          });
          for (var i = 0; i < t.length; i++) {
            var o = r.indexOf(t[i]);
            if (o >= 0) (this || e).animations[o].playing = n;
            else {
              var s = (this || e).artboard.animationByName(t[i]);
              if (s) {
                var u = new a.Animation(
                  s,
                  (this || e).artboard,
                  (this || e).runtime,
                  n
                );
                u.advance(0);
                u.apply(1);
                (this || e).animations.push(u);
              } else
                console.error(
                  "Animation with name ".concat(t[i], " not found.")
                );
            }
          }
        };
        /**
         * Adds state machines by their names.
         * @param animatables the name(s) of state machines to add
         * @param playing whether state machines should play on instantiation
         */ t.prototype.initStateMachines = function (t, n) {
          var r = (this || e).stateMachines.map(function (e) {
            return e.name;
          });
          for (var i = 0; i < t.length; i++) {
            var a = r.indexOf(t[i]);
            if (a >= 0) (this || e).stateMachines[a].playing = n;
            else {
              var o = (this || e).artboard.stateMachineByName(t[i]);
              if (o) {
                var s = new _(o, (this || e).runtime, n, (this || e).artboard);
                (this || e).stateMachines.push(s);
                n || s.advanceAndApply(0);
              } else {
                console.warn(
                  "State Machine with name ".concat(t[i], " not found.")
                );
                this.initLinearAnimations([t[i]], n);
              }
            }
          }
        };
        /**
         * Play the named animations/state machines
         * @param animatables the names of the animations/machines to play; plays all if empty
         * @returns a list of the playing items
         */ t.prototype.play = function (e) {
          return this.add(e, true);
        };
        /**
         * Pauses named animations and state machines, or everything if nothing is
         * specified
         * @param animatables names of the animations and state machines to pause
         * @returns a list of names of the animations and state machines paused
         */ t.prototype.pause = function (e) {
          return this.add(e, false);
        };
        /**
         * Set time of named animations
         * @param animations names of the animations to scrub
         * @param value time scrub value, a floating point number to which the playhead is jumped
         * @returns a list of names of the animations that were scrubbed
         */ t.prototype.scrub = function (t, n) {
          var r = (this || e).animations.filter(function (e) {
            return t.includes(e.name);
          });
          r.forEach(function (e) {
            return (e.scrubTo = n);
          });
          return r.map(function (e) {
            return e.name;
          });
        };
        Object.defineProperty(t.prototype, "playing", {
          get: function () {
            return (this || e).animations
              .filter(function (e) {
                return e.playing;
              })
              .map(function (e) {
                return e.name;
              })
              .concat(
                (this || e).stateMachines
                  .filter(function (e) {
                    return e.playing;
                  })
                  .map(function (e) {
                    return e.name;
                  })
              );
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "paused", {
          get: function () {
            return (this || e).animations
              .filter(function (e) {
                return !e.playing;
              })
              .map(function (e) {
                return e.name;
              })
              .concat(
                (this || e).stateMachines
                  .filter(function (e) {
                    return !e.playing;
                  })
                  .map(function (e) {
                    return e.name;
                  })
              );
          },
          enumerable: false,
          configurable: true,
        });
        /**
         * Stops and removes all named animations and state machines
         * @param animatables animations and state machines to remove
         * @returns a list of names of removed items
         */ t.prototype.stop = function (t) {
          var n = this || e;
          t = J(t);
          var r = [];
          if (t.length === 0) {
            r = (this || e).animations
              .map(function (e) {
                return e.name;
              })
              .concat(
                (this || e).stateMachines.map(function (e) {
                  return e.name;
                })
              );
            (this || e).animations.forEach(function (e) {
              return e.cleanup();
            });
            (this || e).stateMachines.forEach(function (e) {
              return e.cleanup();
            });
            (this || e).animations.splice(0, (this || e).animations.length);
            (this || e).stateMachines.splice(
              0,
              (this || e).stateMachines.length
            );
          } else {
            var i = (this || e).animations.filter(function (e) {
              return t.includes(e.name);
            });
            i.forEach(function (e) {
              e.cleanup();
              n.animations.splice(n.animations.indexOf(e), 1);
            });
            var a = (this || e).stateMachines.filter(function (e) {
              return t.includes(e.name);
            });
            a.forEach(function (e) {
              e.cleanup();
              n.stateMachines.splice(n.stateMachines.indexOf(e), 1);
            });
            r = i
              .map(function (e) {
                return e.name;
              })
              .concat(
                a.map(function (e) {
                  return e.name;
                })
              );
          }
          (this || e).eventManager.fire({ type: C.Stop, data: r });
          return r;
        };
        Object.defineProperty(t.prototype, "isPlaying", {
          get: function () {
            return (
              (this || e).animations.reduce(function (e, t) {
                return e || t.playing;
              }, false) ||
              (this || e).stateMachines.reduce(function (e, t) {
                return e || t.playing;
              }, false)
            );
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "isPaused", {
          get: function () {
            return (
              !(this || e).isPlaying &&
              ((this || e).animations.length > 0 ||
                (this || e).stateMachines.length > 0)
            );
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "isStopped", {
          get: function () {
            return (
              (this || e).animations.length === 0 &&
              (this || e).stateMachines.length === 0
            );
          },
          enumerable: false,
          configurable: true,
        });
        /**
         * If there are no animations or state machines, add the first one found
         * @returns the name of the animation or state machine instanced
         */ t.prototype.atLeastOne = function (t, n) {
          n === void 0 && (n = true);
          var r;
          (this || e).animations.length === 0 &&
            (this || e).stateMachines.length === 0 &&
            ((this || e).artboard.animationCount() > 0
              ? this.add(
                  [(r = (this || e).artboard.animationByIndex(0).name)],
                  t,
                  n
                )
              : (this || e).artboard.stateMachineCount() > 0 &&
                this.add(
                  [(r = (this || e).artboard.stateMachineByIndex(0).name)],
                  t,
                  n
                ));
          return r;
        };
        t.prototype.handleLooping = function () {
          for (
            var t = 0,
              n = (this || e).animations.filter(function (e) {
                return e.playing;
              });
            t < n.length;
            t++
          ) {
            var r = n[t];
            if (r.loopValue === 0 && r.loopCount) {
              r.loopCount = 0;
              this.stop(r.name);
            } else if (r.loopValue === 1 && r.loopCount) {
              (this || e).eventManager.fire({
                type: C.Loop,
                data: { animation: r.name, type: M.Loop },
              });
              r.loopCount = 0;
            } else if (r.loopValue === 2 && r.loopCount > 1) {
              (this || e).eventManager.fire({
                type: C.Loop,
                data: { animation: r.name, type: M.PingPong },
              });
              r.loopCount = 0;
            }
          }
        };
        t.prototype.handleStateChanges = function () {
          var t = [];
          for (
            var n = 0,
              r = (this || e).stateMachines.filter(function (e) {
                return e.playing;
              });
            n < r.length;
            n++
          ) {
            var i = r[n];
            t.push.apply(t, i.statesChanged);
          }
          t.length > 0 &&
            (this || e).eventManager.fire({ type: C.StateChange, data: t });
        };
        t.prototype.handleAdvancing = function (t) {
          (this || e).eventManager.fire({ type: C.Advance, data: t });
        };
        return t;
      })();
      var C;
      (function (e) {
        e.Load = "load";
        e.LoadError = "loaderror";
        e.Play = "play";
        e.Pause = "pause";
        e.Stop = "stop";
        e.Loop = "loop";
        e.Draw = "draw";
        e.Advance = "advance";
        e.StateChange = "statechange";
        e.RiveEvent = "riveevent";
        e.AudioStatusChange = "audiostatuschange";
      })(C || (C = {}));
      var M;
      (function (e) {
        e.OneShot = "oneshot";
        e.Loop = "loop";
        e.PingPong = "pingpong";
      })(M || (M = {}));
      var E = (function () {
        function t(t) {
          t === void 0 && (t = []);
          (this || e).listeners = t;
        }
        t.prototype.getListeners = function (t) {
          return (this || e).listeners.filter(function (e) {
            return e.type === t;
          });
        };
        t.prototype.add = function (t) {
          (this || e).listeners.includes(t) || (this || e).listeners.push(t);
        };
        /**
         * Removes a listener
         * @param listener the listener with the callback to be removed
         */ t.prototype.remove = function (t) {
          for (var n = 0; n < (this || e).listeners.length; n++) {
            var r = (this || e).listeners[n];
            if (r.type === t.type && r.callback === t.callback) {
              (this || e).listeners.splice(n, 1);
              break;
            }
          }
        };
        /**
         * Clears all listeners of specified type, or every listener if no type is
         * specified
         * @param type the type of listeners to clear, or all listeners if not
         * specified
         */ t.prototype.removeAll = function (t) {
          var n = this || e;
          t
            ? (this || e).listeners
                .filter(function (e) {
                  return e.type === t;
                })
                .forEach(function (e) {
                  return n.remove(e);
                })
            : (this || e).listeners.splice(0, (this || e).listeners.length);
        };
        t.prototype.fire = function (e) {
          var t = this.getListeners(e.type);
          t.forEach(function (t) {
            return t.callback(e);
          });
        };
        return t;
      })();
      var P = (function () {
        function t(t) {
          (this || e).eventManager = t;
          (this || e).queue = [];
        }
        t.prototype.add = function (t) {
          (this || e).queue.push(t);
        };
        t.prototype.process = function () {
          while ((this || e).queue.length > 0) {
            var t = (this || e).queue.shift();
            (t === null || t === void 0 ? void 0 : t.action) && t.action();
            (t === null || t === void 0 ? void 0 : t.event) &&
              (this || e).eventManager.fire(t.event);
          }
        };
        return t;
      })();
      var I;
      (function (e) {
        e[(e.AVAILABLE = 0)] = "AVAILABLE";
        e[(e.UNAVAILABLE = 1)] = "UNAVAILABLE";
      })(I || (I = {}));
      var L = (function (t) {
        s(n, t);
        function n() {
          var n = (t !== null && t.apply(this || e, arguments)) || this || e;
          n._started = false;
          n._enabled = false;
          n._status = I.UNAVAILABLE;
          return n;
        }
        n.prototype.delay = function (t) {
          return l(this || e, void 0, void 0, function () {
            return c(this || e, function (e) {
              return [
                2,
                new Promise(function (e) {
                  return setTimeout(e, t);
                }),
              ];
            });
          });
        };
        n.prototype.timeout = function () {
          return l(this || e, void 0, void 0, function () {
            return c(this || e, function (e) {
              return [
                2,
                new Promise(function (e, t) {
                  return setTimeout(t, 50);
                }),
              ];
            });
          });
        };
        n.prototype.reportToListeners = function () {
          this.fire({ type: C.AudioStatusChange });
          this.removeAll();
        };
        n.prototype.enableAudio = function () {
          return l(this || e, void 0, void 0, function () {
            return c(this || e, function (t) {
              if (!(this || e)._enabled) {
                (this || e)._enabled = true;
                (this || e)._status = I.AVAILABLE;
                this.reportToListeners();
              }
              return [2];
            });
          });
        };
        n.prototype.testAudio = function () {
          return l(this || e, void 0, void 0, function () {
            return c(this || e, function (t) {
              switch (t.label) {
                case 0:
                  if (
                    !(
                      (this || e)._status === I.UNAVAILABLE &&
                      (this || e)._audioContext !== null
                    )
                  )
                    return [3, 4];
                  t.label = 1;
                case 1:
                  t.trys.push([1, 3, , 4]);
                  return [
                    4,
                    Promise.race([
                      (this || e)._audioContext.resume(),
                      this.timeout(),
                    ]),
                  ];
                case 2:
                  t.sent();
                  this.enableAudio();
                  return [3, 4];
                case 3:
                  t.sent();
                  return [3, 4];
                case 4:
                  return [2];
              }
            });
          });
        };
        n.prototype._establishAudio = function () {
          return l(this || e, void 0, void 0, function () {
            return c(this || e, function (t) {
              switch (t.label) {
                case 0:
                  if (!!(this || e)._started) return [3, 5];
                  (this || e)._started = true;
                  if (!(typeof window == "undefined")) return [3, 1];
                  this.enableAudio();
                  return [3, 5];
                case 1:
                  (this || e)._audioContext = new AudioContext();
                  this.listenForUserAction();
                  t.label = 2;
                case 2:
                  return (this || e)._status === I.UNAVAILABLE
                    ? [4, this.testAudio()]
                    : [3, 5];
                case 3:
                  t.sent();
                  return [4, this.delay(1e3)];
                case 4:
                  t.sent();
                  return [3, 2];
                case 5:
                  return [2];
              }
            });
          });
        };
        n.prototype.listenForUserAction = function () {
          var t = this || e;
          var n = function () {
            return l(t, void 0, void 0, function () {
              return c(this || e, function (e) {
                this.enableAudio();
                return [2];
              });
            });
          };
          document.addEventListener("pointerdown", n, { once: true });
        };
        n.prototype.establishAudio = function () {
          return l(this || e, void 0, void 0, function () {
            return c(this || e, function (e) {
              this._establishAudio();
              return [2];
            });
          });
        };
        Object.defineProperty(n.prototype, "systemVolume", {
          get: function () {
            if ((this || e)._status === I.UNAVAILABLE) {
              this.testAudio();
              return 0;
            }
            return 1;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(n.prototype, "status", {
          get: function () {
            return (this || e)._status;
          },
          enumerable: false,
          configurable: true,
        });
        return n;
      })(E);
      var F = new L();
      var R = (function () {
        function e() {}
        e.prototype.observe = function () {};
        e.prototype.unobserve = function () {};
        e.prototype.disconnect = function () {};
        return e;
      })();
      var S = globalThis.ResizeObserver || R;
      var x = (function () {
        function t() {
          var t = this || e;
          (this || e)._elementsMap = new Map();
          (this || e)._onObservedEntry = function (e) {
            var n = t._elementsMap.get(e.target);
            n !== null
              ? n.onResize(
                  e.target.clientWidth == 0 || e.target.clientHeight == 0
                )
              : t._resizeObserver.unobserve(e.target);
          };
          (this || e)._onObserved = function (e) {
            e.forEach(t._onObservedEntry);
          };
          (this || e)._resizeObserver = new S((this || e)._onObserved);
        }
        t.prototype.add = function (t, n) {
          var r = { onResize: n, element: t };
          (this || e)._elementsMap.set(t, r);
          (this || e)._resizeObserver.observe(t);
          return r;
        };
        t.prototype.remove = function (t) {
          (this || e)._resizeObserver.unobserve(t.element);
          (this || e)._elementsMap.delete(t.element);
        };
        return t;
      })();
      var k = new x();
      var T = (function () {
        function t(t) {
          (this || e).enableRiveAssetCDN = true;
          (this || e).referenceCount = 0;
          (this || e).destroyed = false;
          (this || e).src = t.src;
          (this || e).buffer = t.buffer;
          t.assetLoader && ((this || e).assetLoader = t.assetLoader);
          (this || e).enableRiveAssetCDN =
            typeof t.enableRiveAssetCDN != "boolean" || t.enableRiveAssetCDN;
          (this || e).eventManager = new E();
          t.onLoad && this.on(C.Load, t.onLoad);
          t.onLoadError && this.on(C.LoadError, t.onLoadError);
        }
        t.prototype.initData = function () {
          return l(this || e, void 0, void 0, function () {
            var n, r, i, a;
            var s;
            return c(this || e, function (u) {
              switch (u.label) {
                case 0:
                  if (!(this || e).src) return [3, 2];
                  n = this || e;
                  return [4, q((this || e).src)];
                case 1:
                  n.buffer = u.sent();
                  u.label = 2;
                case 2:
                  if ((this || e).destroyed) return [2];
                  if ((this || e).assetLoader) {
                    i = new o.CustomFileAssetLoaderWrapper(
                      (this || e).runtime,
                      (this || e).assetLoader
                    );
                    r = i.assetLoader;
                  }
                  a = this || e;
                  return [
                    4,
                    (this || e).runtime.load(
                      new Uint8Array((this || e).buffer),
                      r,
                      (this || e).enableRiveAssetCDN
                    ),
                  ];
                case 3:
                  a.file = u.sent();
                  if ((this || e).destroyed) {
                    (s = (this || e).file) === null || s === void 0
                      ? void 0
                      : s.delete();
                    (this || e).file = null;
                    return [2];
                  }
                  if ((this || e).file === null) {
                    (this || e).eventManager.fire({
                      type: C.LoadError,
                      data: null,
                    });
                    throw new Error(t.fileLoadErrorMessage);
                  }
                  (this || e).eventManager.fire({
                    type: C.Load,
                    data: this || e,
                  });
                  return [2];
              }
            });
          });
        };
        t.prototype.init = function () {
          return l(this || e, void 0, void 0, function () {
            var n;
            return c(this || e, function (r) {
              switch (r.label) {
                case 0:
                  if (!(this || e).src && !(this || e).buffer)
                    throw new Error(t.missingErrorMessage);
                  n = this || e;
                  return [4, g.awaitInstance()];
                case 1:
                  n.runtime = r.sent();
                  return (this || e).destroyed ? [2] : [4, this.initData()];
                case 2:
                  r.sent();
                  return [2];
              }
            });
          });
        };
        /**
         * Subscribe to Rive-generated events
         * @param type the type of event to subscribe to
         * @param callback callback to fire when the event occurs
         */ t.prototype.on = function (t, n) {
          (this || e).eventManager.add({ type: t, callback: n });
        };
        /**
         * Unsubscribes from a Rive-generated event
         * @param type the type of event to unsubscribe from
         * @param callback the callback to unsubscribe
         */ t.prototype.off = function (t, n) {
          (this || e).eventManager.remove({ type: t, callback: n });
        };
        t.prototype.cleanup = function () {
          var t;
          (this || e).referenceCount -= 1;
          if ((this || e).referenceCount <= 0) {
            this.removeAllRiveEventListeners();
            (t = (this || e).file) === null || t === void 0
              ? void 0
              : t.delete();
            (this || e).file = null;
            (this || e).destroyed = true;
          }
        };
        /**
         * Unsubscribes all Rive listeners from an event type, or everything if no type is
         * given
         * @param type the type of event to unsubscribe from, or all types if
         * undefined
         */ t.prototype.removeAllRiveEventListeners = function (t) {
          (this || e).eventManager.removeAll(t);
        };
        t.prototype.getInstance = function () {
          if ((this || e).file !== null) {
            (this || e).referenceCount += 1;
            return (this || e).file;
          }
        };
        t.missingErrorMessage = "Rive source file or data buffer required";
        t.fileLoadErrorMessage = "The file failed to load";
        return t;
      })();
      var j = (function () {
        function t(t) {
          var n = this || e;
          var r;
          (this || e).loaded = false;
          (this || e).destroyed = false;
          (this || e)._observed = null;
          (this || e).readyForPlaying = false;
          (this || e).artboard = null;
          (this || e).eventCleanup = null;
          (this || e).shouldDisableRiveListeners = false;
          (this || e).automaticallyHandleEvents = false;
          (this || e).enableRiveAssetCDN = true;
          (this || e)._volume = 1;
          (this || e)._artboardWidth = void 0;
          (this || e)._artboardHeight = void 0;
          (this || e)._devicePixelRatioUsed = 1;
          (this || e)._hasZeroSize = false;
          (this || e)._audioEventListener = null;
          (this || e)._boundDraw = null;
          (this || e)._viewModelInstance = null;
          (this || e)._dataEnums = null;
          (this || e).durations = [];
          (this || e).frameTimes = [];
          (this || e).frameCount = 0;
          (this || e).isTouchScrollEnabled = false;
          (this || e).onCanvasResize = function (e) {
            var t = n._hasZeroSize !== e;
            n._hasZeroSize = e;
            e
              ? (n._layout.maxX && n._layout.maxY) || n.resizeToCanvas()
              : t && n.resizeDrawingSurfaceToCanvas();
          };
          (this || e).renderSecondTimer = 0;
          (this || e)._boundDraw = (this || e).draw.bind(this || e);
          (this || e).canvas = t.canvas;
          t.canvas.constructor === HTMLCanvasElement &&
            ((this || e)._observed = k.add(
              (this || e).canvas,
              (this || e).onCanvasResize
            ));
          (this || e).src = t.src;
          (this || e).buffer = t.buffer;
          (this || e).riveFile = t.riveFile;
          (this || e).layout =
            (r = t.layout) !== null && r !== void 0 ? r : new m();
          (this || e).shouldDisableRiveListeners =
            !!t.shouldDisableRiveListeners;
          (this || e).isTouchScrollEnabled = !!t.isTouchScrollEnabled;
          (this || e).automaticallyHandleEvents = !!t.automaticallyHandleEvents;
          (this || e).enableRiveAssetCDN =
            t.enableRiveAssetCDN === void 0 || t.enableRiveAssetCDN;
          (this || e).eventManager = new E();
          t.onLoad && this.on(C.Load, t.onLoad);
          t.onLoadError && this.on(C.LoadError, t.onLoadError);
          t.onPlay && this.on(C.Play, t.onPlay);
          t.onPause && this.on(C.Pause, t.onPause);
          t.onStop && this.on(C.Stop, t.onStop);
          t.onLoop && this.on(C.Loop, t.onLoop);
          t.onStateChange && this.on(C.StateChange, t.onStateChange);
          t.onAdvance && this.on(C.Advance, t.onAdvance);
          /**
           * @deprecated Use camelCase'd versions instead.
           */
          t.onload && !t.onLoad && this.on(C.Load, t.onload);
          t.onloaderror &&
            !t.onLoadError &&
            this.on(C.LoadError, t.onloaderror);
          t.onplay && !t.onPlay && this.on(C.Play, t.onplay);
          t.onpause && !t.onPause && this.on(C.Pause, t.onpause);
          t.onstop && !t.onStop && this.on(C.Stop, t.onstop);
          t.onloop && !t.onLoop && this.on(C.Loop, t.onloop);
          t.onstatechange &&
            !t.onStateChange &&
            this.on(C.StateChange, t.onstatechange);
          t.assetLoader && ((this || e).assetLoader = t.assetLoader);
          (this || e).taskQueue = new P((this || e).eventManager);
          this.init({
            src: (this || e).src,
            buffer: (this || e).buffer,
            riveFile: (this || e).riveFile,
            autoplay: t.autoplay,
            autoBind: t.autoBind,
            animations: t.animations,
            stateMachines: t.stateMachines,
            artboard: t.artboard,
            useOffscreenRenderer: t.useOffscreenRenderer,
          });
        }
        Object.defineProperty(t.prototype, "viewModelCount", {
          get: function () {
            return (this || e).file.viewModelCount();
          },
          enumerable: false,
          configurable: true,
        });
        t.new = function (e) {
          console.warn(
            "This function is deprecated: please use `new Rive({})` instead"
          );
          return new t(e);
        };
        t.prototype.onSystemAudioChanged = function () {
          (this || e).volume = (this || e)._volume;
        };
        t.prototype.init = function (n) {
          var r = this || e;
          var i = n.src,
            a = n.buffer,
            o = n.riveFile,
            s = n.animations,
            u = n.stateMachines,
            l = n.artboard,
            c = n.autoplay,
            f = c !== void 0 && c,
            d = n.useOffscreenRenderer,
            p = d !== void 0 && d,
            v = n.autoBind,
            m = v !== void 0 && v;
          if (!(this || e).destroyed) {
            (this || e).src = i;
            (this || e).buffer = a;
            (this || e).riveFile = o;
            if (
              !(this || e).src &&
              !(this || e).buffer &&
              !(this || e).riveFile
            )
              throw new h(t.missingErrorMessage);
            var b = J(s);
            var y = J(u);
            (this || e).loaded = false;
            (this || e).readyForPlaying = false;
            g.awaitInstance()
              .then(function (e) {
                if (!r.destroyed) {
                  r.runtime = e;
                  r.removeRiveListeners();
                  r.deleteRiveRenderer();
                  r.renderer = r.runtime.makeRenderer(r.canvas, p);
                  r.canvas.width ||
                    r.canvas.height ||
                    r.resizeDrawingSurfaceToCanvas();
                  r.initData(l, b, y, f, m)
                    .then(function (e) {
                      if (e) return r.setupRiveListeners();
                    })
                    .catch(function (e) {
                      console.error(e);
                    });
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        };
        /**
         * Setup Rive Listeners on the canvas
         * @param riveListenerOptions - Enables TouchEvent events on the canvas. Set to true to allow
         * touch scrolling on the canvas element on touch-enabled devices
         * i.e. { isTouchScrollEnabled: true }
         */ t.prototype.setupRiveListeners = function (t) {
          var n = this || e;
          (this || e).eventCleanup && this.eventCleanup();
          if (!(this || e).shouldDisableRiveListeners) {
            var r = ((this || e).animator.stateMachines || [])
              .filter(function (e) {
                return e.playing && n.runtime.hasListeners(e.instance);
              })
              .map(function (e) {
                return e.instance;
              });
            var i = (this || e).isTouchScrollEnabled;
            t && "isTouchScrollEnabled" in t && (i = t.isTouchScrollEnabled);
            (this || e).eventCleanup = (0, o.registerTouchInteractions)({
              canvas: (this || e).canvas,
              artboard: (this || e).artboard,
              stateMachines: r,
              renderer: (this || e).renderer,
              rive: (this || e).runtime,
              fit: (this || e)._layout.runtimeFit((this || e).runtime),
              alignment: (this || e)._layout.runtimeAlignment(
                (this || e).runtime
              ),
              isTouchScrollEnabled: i,
              layoutScaleFactor: (this || e)._layout.layoutScaleFactor,
            });
          }
        };
        t.prototype.removeRiveListeners = function () {
          if ((this || e).eventCleanup) {
            this.eventCleanup();
            (this || e).eventCleanup = null;
          }
        };
        t.prototype.initializeAudio = function () {
          var t = this || e;
          var n;
          if (
            F.status == I.UNAVAILABLE &&
            ((n = (this || e).artboard) === null || n === void 0
              ? void 0
              : n.hasAudio) &&
            (this || e)._audioEventListener === null
          ) {
            (this || e)._audioEventListener = {
              type: C.AudioStatusChange,
              callback: function () {
                return t.onSystemAudioChanged();
              },
            };
            F.add((this || e)._audioEventListener);
            F.establishAudio();
          }
        };
        t.prototype.initArtboardSize = function () {
          if ((this || e).artboard) {
            (this || e)._artboardWidth = (this || e).artboard.width =
              (this || e)._artboardWidth || (this || e).artboard.width;
            (this || e)._artboardHeight = (this || e).artboard.height =
              (this || e)._artboardHeight || (this || e).artboard.height;
          }
        };
        t.prototype.initData = function (t, n, r, i, a) {
          return l(this || e, void 0, void 0, function () {
            var o, s;
            var u;
            return c(this || e, function (l) {
              switch (l.label) {
                case 0:
                  l.trys.push([0, 3, , 4]);
                  if (!((this || e).riveFile == null)) return [3, 2];
                  (this || e).riveFile = new T({
                    src: (this || e).src,
                    buffer: (this || e).buffer,
                    enableRiveAssetCDN: (this || e).enableRiveAssetCDN,
                    assetLoader: (this || e).assetLoader,
                  });
                  return [4, (this || e).riveFile.init()];
                case 1:
                  l.sent();
                  l.label = 2;
                case 2:
                  if (!(this || e).riveFile) return [2, false];
                  (this || e).file = (this || e).riveFile.getInstance();
                  this.initArtboard(t, n, r, i, a);
                  this.initArtboardSize();
                  this.initializeAudio();
                  (this || e).loaded = true;
                  (this || e).eventManager.fire({
                    type: C.Load,
                    data:
                      (u = (this || e).src) !== null && u !== void 0
                        ? u
                        : "buffer",
                  });
                  (this || e).readyForPlaying = true;
                  (this || e).taskQueue.process();
                  this.drawFrame();
                  return [2, true];
                case 3:
                  o = l.sent();
                  s = d(o);
                  console.warn(s);
                  (this || e).eventManager.fire({ type: C.LoadError, data: s });
                  return [2, Promise.reject(s)];
                case 4:
                  return [2];
              }
            });
          });
        };
        t.prototype.initArtboard = function (t, n, r, i, a) {
          if ((this || e).file) {
            var o = t
              ? (this || e).file.artboardByName(t)
              : (this || e).file.defaultArtboard();
            if (o) {
              (this || e).artboard = o;
              o.volume = (this || e)._volume * F.systemVolume;
              if ((this || e).artboard.animationCount() < 1) {
                f = "Artboard has no animations";
                (this || e).eventManager.fire({ type: C.LoadError, data: f });
                throw f;
              }
              (this || e).animator = new A(
                (this || e).runtime,
                (this || e).artboard,
                (this || e).eventManager
              );
              var s;
              if (n.length > 0 || r.length > 0) {
                s = n.concat(r);
                (this || e).animator.initLinearAnimations(n, i);
                (this || e).animator.initStateMachines(r, i);
              } else s = [(this || e).animator.atLeastOne(i, false)];
              (this || e).taskQueue.add({
                event: { type: i ? C.Play : C.Pause, data: s },
              });
              if (a) {
                var u = (this || e).file.defaultArtboardViewModel(o);
                if (u !== null) {
                  var l = u.defaultInstance();
                  if (l !== null) {
                    var c = new D(l, null);
                    this.bindViewModelInstance(c);
                  }
                }
              }
            } else {
              var f = "Invalid artboard name or no default artboard";
              console.warn(f);
              (this || e).eventManager.fire({ type: C.LoadError, data: f });
            }
          }
        };
        t.prototype.drawFrame = function () {
          var t, n;
          if (
            (t =
              document === null || document === void 0
                ? void 0
                : document.timeline) === null || t === void 0
              ? void 0
              : t.currentTime
          ) {
            if (
              (this || e).loaded &&
              (this || e).artboard &&
              !(this || e).frameRequestId
            ) {
              this._boundDraw(document.timeline.currentTime);
              (n = (this || e).runtime) === null || n === void 0
                ? void 0
                : n.resolveAnimationFrame();
            }
          } else this.startRendering();
        };
        /**
         * Draw rendering loop; renders animation frames at the correct time interval.
         * @param time the time at which to render a frame
         */ t.prototype.draw = function (t, n) {
          var r;
          (this || e).frameRequestId = null;
          var i = performance.now();
          (this || e).lastRenderTime || ((this || e).lastRenderTime = t);
          (this || e).renderSecondTimer += t - (this || e).lastRenderTime;
          if ((this || e).renderSecondTimer > 5e3) {
            (this || e).renderSecondTimer = 0;
            n === null || n === void 0 ? void 0 : n();
          }
          var a = (t - (this || e).lastRenderTime) / 1e3;
          (this || e).lastRenderTime = t;
          var s = (this || e).animator.animations
            .filter(function (e) {
              return e.playing || e.needsScrub;
            })
            .sort(function (e) {
              return e.needsScrub ? -1 : 1;
            });
          for (var u = 0, l = s; u < l.length; u++) {
            var c = l[u];
            c.advance(a);
            c.instance.didLoop && (c.loopCount += 1);
            c.apply(1);
          }
          var f = (this || e).animator.stateMachines.filter(function (e) {
            return e.playing;
          });
          for (var h = 0, d = f; h < d.length; h++) {
            var p = d[h];
            var v = p.reportedEventCount();
            if (v)
              for (var m = 0; m < v; m++) {
                var g = p.reportedEventAt(m);
                if (g)
                  if (g.type === w.OpenUrl) {
                    (this || e).eventManager.fire({
                      type: C.RiveEvent,
                      data: g,
                    });
                    if ((this || e).automaticallyHandleEvents) {
                      var b = document.createElement("a");
                      var y = g,
                        _ = y.url,
                        A = y.target;
                      var M = (0, o.sanitizeUrl)(_);
                      _ && b.setAttribute("href", M);
                      A && b.setAttribute("target", A);
                      M && M !== o.BLANK_URL && b.click();
                    }
                  } else
                    (this || e).eventManager.fire({
                      type: C.RiveEvent,
                      data: g,
                    });
              }
            p.advanceAndApply(a);
          }
          (this || e).animator.stateMachines.length == 0 &&
            (this || e).artboard.advance(a);
          var E = (this || e).renderer;
          E.clear();
          E.save();
          this.alignRenderer();
          (this || e)._hasZeroSize || (this || e).artboard.draw(E);
          E.restore();
          E.flush();
          (this || e).animator.handleLooping();
          (this || e).animator.handleStateChanges();
          (this || e).animator.handleAdvancing(a);
          (this || e).frameCount++;
          var P = performance.now();
          (this || e).frameTimes.push(P);
          (this || e).durations.push(P - i);
          while ((this || e).frameTimes[0] <= P - 1e3) {
            (this || e).frameTimes.shift();
            (this || e).durations.shift();
          }
          (r = (this || e)._viewModelInstance) === null || r === void 0
            ? void 0
            : r.handleCallbacks();
          (this || e).animator.isPlaying
            ? this.startRendering()
            : ((this || e).animator.isPaused ||
                (this || e).animator.isStopped) &&
              ((this || e).lastRenderTime = 0);
        };
        t.prototype.alignRenderer = function () {
          var t = this || e,
            n = t.renderer,
            r = t.runtime,
            i = t._layout,
            a = t.artboard;
          n.align(
            i.runtimeFit(r),
            i.runtimeAlignment(r),
            { minX: i.minX, minY: i.minY, maxX: i.maxX, maxY: i.maxY },
            a.bounds,
            (this || e)._devicePixelRatioUsed * i.layoutScaleFactor
          );
        };
        Object.defineProperty(t.prototype, "fps", {
          get: function () {
            return (this || e).durations.length;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "frameTime", {
          get: function () {
            return (this || e).durations.length === 0
              ? 0
              : (
                  (this || e).durations.reduce(function (e, t) {
                    return e + t;
                  }, 0) / (this || e).durations.length
                ).toFixed(4);
          },
          enumerable: false,
          configurable: true,
        });
        t.prototype.cleanup = function () {
          var t, n;
          (this || e).destroyed = true;
          this.stopRendering();
          this.cleanupInstances();
          (this || e)._observed !== null && k.remove((this || e)._observed);
          this.removeRiveListeners();
          if ((this || e).file) {
            (t = (this || e).riveFile) === null || t === void 0
              ? void 0
              : t.cleanup();
            (this || e).file = null;
          }
          (this || e).riveFile = null;
          this.deleteRiveRenderer();
          if ((this || e)._audioEventListener !== null) {
            F.remove((this || e)._audioEventListener);
            (this || e)._audioEventListener = null;
          }
          (n = (this || e)._viewModelInstance) === null || n === void 0
            ? void 0
            : n.cleanup();
          (this || e)._viewModelInstance = null;
          (this || e)._dataEnums = null;
        };
        t.prototype.deleteRiveRenderer = function () {
          var t;
          (t = (this || e).renderer) === null || t === void 0
            ? void 0
            : t.delete();
          (this || e).renderer = null;
        };
        t.prototype.cleanupInstances = function () {
          (this || e).eventCleanup !== null && this.eventCleanup();
          this.stop();
          if ((this || e).artboard) {
            (this || e).artboard.delete();
            (this || e).artboard = null;
          }
        };
        /**
         * Tries to query the setup Artboard for a text run node with the given name.
         *
         * @param textRunName - Name of the text run node associated with a text object
         * @returns - TextValueRun node or undefined if the text run cannot be queried
         */ t.prototype.retrieveTextRun = function (t) {
          var n;
          if (t)
            if ((this || e).artboard) {
              var r = (this || e).artboard.textRun(t);
              if (r) return r;
              console.warn(
                "Could not access a text run with name '"
                  .concat(t, "' in the '")
                  .concat(
                    (n = (this || e).artboard) === null || n === void 0
                      ? void 0
                      : n.name,
                    "' Artboard. Note that you must rename a text run node in the Rive editor to make it queryable at runtime."
                  )
              );
            } else
              console.warn(
                "Tried to access text run, but the Artboard is null"
              );
          else console.warn("No text run name provided");
        };
        /**
         * Returns a string from a given text run node name, or undefined if the text run
         * cannot be queried.
         *
         * @param textRunName - Name of the text run node associated with a text object
         * @returns - String value of the text run node or undefined
         */ t.prototype.getTextRunValue = function (e) {
          var t = this.retrieveTextRun(e);
          return t ? t.text : void 0;
        };
        /**
         * Sets a text value for a given text run node name if possible
         *
         * @param textRunName - Name of the text run node associated with a text object
         * @param textRunValue - String value to set on the text run node
         */ t.prototype.setTextRunValue = function (e, t) {
          var n = this.retrieveTextRun(e);
          n && (n.text = t);
        };
        t.prototype.play = function (t, n) {
          var r = this || e;
          t = J(t);
          if ((this || e).readyForPlaying) {
            (this || e).animator.play(t);
            (this || e).eventCleanup && this.eventCleanup();
            this.setupRiveListeners();
            this.startRendering();
          } else
            (this || e).taskQueue.add({
              action: function () {
                return r.play(t, n);
              },
            });
        };
        t.prototype.pause = function (t) {
          var n = this || e;
          t = J(t);
          if ((this || e).readyForPlaying) {
            (this || e).eventCleanup && this.eventCleanup();
            (this || e).animator.pause(t);
          } else
            (this || e).taskQueue.add({
              action: function () {
                return n.pause(t);
              },
            });
        };
        t.prototype.scrub = function (t, n) {
          var r = this || e;
          t = J(t);
          if ((this || e).readyForPlaying) {
            (this || e).animator.scrub(t, n || 0);
            this.drawFrame();
          } else
            (this || e).taskQueue.add({
              action: function () {
                return r.scrub(t, n);
              },
            });
        };
        t.prototype.stop = function (t) {
          var n = this || e;
          t = J(t);
          if ((this || e).readyForPlaying) {
            (this || e).animator && (this || e).animator.stop(t);
            (this || e).eventCleanup && this.eventCleanup();
          } else
            (this || e).taskQueue.add({
              action: function () {
                return n.stop(t);
              },
            });
        };
        /**
         * Resets the animation
         * @param artboard the name of the artboard, or default if none given
         * @param animations the names of animations for playback
         * @param stateMachines the names of state machines for playback
         * @param autoplay whether to autoplay when reset, defaults to false
         *
         */ t.prototype.reset = function (t) {
          var n, r;
          var i = t === null || t === void 0 ? void 0 : t.artboard;
          var a = J(t === null || t === void 0 ? void 0 : t.animations);
          var o = J(t === null || t === void 0 ? void 0 : t.stateMachines);
          var s =
            (n = t === null || t === void 0 ? void 0 : t.autoplay) !== null &&
            n !== void 0 &&
            n;
          var u =
            (r = t === null || t === void 0 ? void 0 : t.autoBind) !== null &&
            r !== void 0 &&
            r;
          this.cleanupInstances();
          this.initArtboard(i, a, o, s, u);
          (this || e).taskQueue.process();
        };
        t.prototype.load = function (t) {
          (this || e).file = null;
          this.stop();
          this.init(t);
        };
        Object.defineProperty(t.prototype, "layout", {
          get: function () {
            return (this || e)._layout;
          },
          set: function (t) {
            (this || e)._layout = t;
            (t.maxX && t.maxY) || this.resizeToCanvas();
            (this || e).loaded &&
              !(this || e).animator.isPlaying &&
              this.drawFrame();
          },
          enumerable: false,
          configurable: true,
        });
        t.prototype.resizeToCanvas = function () {
          (this || e)._layout = (this || e).layout.copyWith({
            minX: 0,
            minY: 0,
            maxX: (this || e).canvas.width,
            maxY: (this || e).canvas.height,
          });
        };
        t.prototype.resizeDrawingSurfaceToCanvas = function (t) {
          if ((this || e).canvas instanceof HTMLCanvasElement && !!window) {
            var n = (this || e).canvas.getBoundingClientRect(),
              r = n.width,
              i = n.height;
            var a = t || window.devicePixelRatio || 1;
            (this || e).devicePixelRatioUsed = a;
            (this || e).canvas.width = a * r;
            (this || e).canvas.height = a * i;
            this.resizeToCanvas();
            this.drawFrame();
            if ((this || e).layout.fit === p.Layout) {
              var o = (this || e)._layout.layoutScaleFactor;
              (this || e).artboard.width = r / o;
              (this || e).artboard.height = i / o;
            }
          }
        };
        Object.defineProperty(t.prototype, "source", {
          get: function () {
            return (this || e).src;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "activeArtboard", {
          get: function () {
            return (this || e).artboard ? (this || e).artboard.name : "";
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "animationNames", {
          get: function () {
            if (!(this || e).loaded || !(this || e).artboard) return [];
            var t = [];
            for (var n = 0; n < (this || e).artboard.animationCount(); n++)
              t.push((this || e).artboard.animationByIndex(n).name);
            return t;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "stateMachineNames", {
          get: function () {
            if (!(this || e).loaded || !(this || e).artboard) return [];
            var t = [];
            for (var n = 0; n < (this || e).artboard.stateMachineCount(); n++)
              t.push((this || e).artboard.stateMachineByIndex(n).name);
            return t;
          },
          enumerable: false,
          configurable: true,
        });
        /**
         * Returns the inputs for the specified instanced state machine, or an empty
         * list if the name is invalid or the state machine is not instanced
         * @param name the state machine name
         * @returns the inputs for the named state machine
         */ t.prototype.stateMachineInputs = function (t) {
          if ((this || e).loaded) {
            var n = (this || e).animator.stateMachines.find(function (e) {
              return e.name === t;
            });
            return n === null || n === void 0 ? void 0 : n.inputs;
          }
        };
        t.prototype.retrieveInputAtPath = function (t, n) {
          if (t)
            if ((this || e).artboard) {
              var r = (this || e).artboard.inputByPath(t, n);
              if (r) return r;
              console.warn(
                "Could not access an input with name: '"
                  .concat(t, "', at path:'")
                  .concat(n, "'")
              );
            } else
              console.warn(
                "Tried to access input: '"
                  .concat(t, "', at path: '")
                  .concat(n, "', but the Artboard is null")
              );
          else console.warn("No input name provided for path '".concat(n, "'"));
        };
        /**
         * Set the boolean input with the provided name at the given path with value
         * @param input the state machine input name
         * @param value the value to set the input to
         * @param path the path the input is located at an artboard level
         */ t.prototype.setBooleanStateAtPath = function (e, t, n) {
          var r = this.retrieveInputAtPath(e, n);
          r &&
            (r.type === b.Boolean
              ? (r.asBool().value = t)
              : console.warn(
                  "Input with name: '"
                    .concat(e, "', at path:'")
                    .concat(n, "' is not a boolean")
                ));
        };
        /**
         * Set the number input with the provided name at the given path with value
         * @param input the state machine input name
         * @param value the value to set the input to
         * @param path the path the input is located at an artboard level
         */ t.prototype.setNumberStateAtPath = function (e, t, n) {
          var r = this.retrieveInputAtPath(e, n);
          r &&
            (r.type === b.Number
              ? (r.asNumber().value = t)
              : console.warn(
                  "Input with name: '"
                    .concat(e, "', at path:'")
                    .concat(n, "' is not a number")
                ));
        };
        /**
         * Fire the trigger with the provided name at the given path
         * @param input the state machine input name
         * @param path the path the input is located at an artboard level
         */ t.prototype.fireStateAtPath = function (e, t) {
          var n = this.retrieveInputAtPath(e, t);
          n &&
            (n.type === b.Trigger
              ? n.asTrigger().fire()
              : console.warn(
                  "Input with name: '"
                    .concat(e, "', at path:'")
                    .concat(t, "' is not a trigger")
                ));
        };
        t.prototype.retrieveTextAtPath = function (t, n) {
          if (t)
            if (n)
              if ((this || e).artboard) {
                var r = (this || e).artboard.textByPath(t, n);
                if (r) return r;
                console.warn(
                  "Could not access text with name: '"
                    .concat(t, "', at path:'")
                    .concat(n, "'")
                );
              } else
                console.warn(
                  "Tried to access text: '"
                    .concat(t, "', at path: '")
                    .concat(n, "', but the Artboard is null")
                );
            else console.warn("No path provided for text '".concat(t, "'"));
          else console.warn("No text name provided for path '".concat(n, "'"));
        };
        /**
         * Retrieves the text value for a specified text run at a given path
         * @param textName The name of the text run
         * @param path The path to the text run within the artboard
         * @returns The text value of the text run, or undefined if not found
         *
         * @example
         * // Get the text value for a text run named "title" at one nested artboard deep
         * const titleText = riveInstance.getTextRunValueAtPath("title", "artboard1");
         *
         * @example
         * // Get the text value for a text run named "subtitle" within a nested group two artboards deep
         * const subtitleText = riveInstance.getTextRunValueAtPath("subtitle", "group/nestedGroup");
         *
         * @remarks
         * If the text run cannot be found at the specified path, a warning will be logged to the console.
         */ t.prototype.getTextRunValueAtPath = function (e, t) {
          var n = this.retrieveTextAtPath(e, t);
          if (n) return n.text;
          console.warn(
            "Could not get text with name: '"
              .concat(e, "', at path:'")
              .concat(t, "'")
          );
        };
        /**
         * Sets the text value for a specified text run at a given path
         * @param textName The name of the text run
         * @param value The new text value to set
         * @param path The path to the text run within the artboard
         * @returns void
         *
         * @example
         * // Set the text value for a text run named "title" at one nested artboard deep
         * riveInstance.setTextRunValueAtPath("title", "New Title", "artboard1");
         *
         * @example
         * // Set the text value for a text run named "subtitle" within a nested group two artboards deep
         * riveInstance.setTextRunValueAtPath("subtitle", "New Subtitle", "group/nestedGroup");
         *
         * @remarks
         * If the text run cannot be found at the specified path, a warning will be logged to the console.
         */ t.prototype.setTextRunValueAtPath = function (e, t, n) {
          var r = this.retrieveTextAtPath(e, n);
          r
            ? (r.text = t)
            : console.warn(
                "Could not set text with name: '"
                  .concat(e, "', at path:'")
                  .concat(n, "'")
              );
        };
        Object.defineProperty(t.prototype, "playingStateMachineNames", {
          get: function () {
            return (this || e).loaded
              ? (this || e).animator.stateMachines
                  .filter(function (e) {
                    return e.playing;
                  })
                  .map(function (e) {
                    return e.name;
                  })
              : [];
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "playingAnimationNames", {
          get: function () {
            return (this || e).loaded
              ? (this || e).animator.animations
                  .filter(function (e) {
                    return e.playing;
                  })
                  .map(function (e) {
                    return e.name;
                  })
              : [];
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "pausedAnimationNames", {
          get: function () {
            return (this || e).loaded
              ? (this || e).animator.animations
                  .filter(function (e) {
                    return !e.playing;
                  })
                  .map(function (e) {
                    return e.name;
                  })
              : [];
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "pausedStateMachineNames", {
          /**
           *  Returns a list of paused machine names
           * @returns a list of state machine names that are paused
           */
          get: function () {
            return (this || e).loaded
              ? (this || e).animator.stateMachines
                  .filter(function (e) {
                    return !e.playing;
                  })
                  .map(function (e) {
                    return e.name;
                  })
              : [];
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "isPlaying", {
          /**
           * @returns true if any animation is playing
           */
          get: function () {
            return (this || e).animator.isPlaying;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "isPaused", {
          /**
           * @returns true if all instanced animations are paused
           */
          get: function () {
            return (this || e).animator.isPaused;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "isStopped", {
          /**
           * @returns true if no animations are playing or paused
           */
          get: function () {
            return (this || e).animator.isStopped;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "bounds", {
          /**
           * @returns the bounds of the current artboard, or undefined if the artboard
           * isn't loaded yet.
           */
          get: function () {
            return (this || e).artboard ? (this || e).artboard.bounds : void 0;
          },
          enumerable: false,
          configurable: true,
        });
        /**
         * Subscribe to Rive-generated events
         * @param type the type of event to subscribe to
         * @param callback callback to fire when the event occurs
         */ t.prototype.on = function (t, n) {
          (this || e).eventManager.add({ type: t, callback: n });
        };
        /**
         * Unsubscribes from a Rive-generated event
         * @param type the type of event to unsubscribe from
         * @param callback the callback to unsubscribe
         */ t.prototype.off = function (t, n) {
          (this || e).eventManager.remove({ type: t, callback: n });
        };
        /**
         * Unsubscribes from a Rive-generated event
         * @deprecated
         * @param callback the callback to unsubscribe from
         */ t.prototype.unsubscribe = function (e, t) {
          console.warn(
            "This function is deprecated: please use `off()` instead."
          );
          this.off(e, t);
        };
        /**
         * Unsubscribes all Rive listeners from an event type, or everything if no type is
         * given
         * @param type the type of event to unsubscribe from, or all types if
         * undefined
         */ t.prototype.removeAllRiveEventListeners = function (t) {
          (this || e).eventManager.removeAll(t);
        };
        /**
         * Unsubscribes all listeners from an event type, or everything if no type is
         * given
         * @deprecated
         * @param type the type of event to unsubscribe from, or all types if
         * undefined
         */ t.prototype.unsubscribeAll = function (e) {
          console.warn(
            "This function is deprecated: please use `removeAllRiveEventListeners()` instead."
          );
          this.removeAllRiveEventListeners(e);
        };
        t.prototype.stopRendering = function () {
          if ((this || e).loaded && (this || e).frameRequestId) {
            (this || e).runtime.cancelAnimationFrame
              ? (this || e).runtime.cancelAnimationFrame(
                  (this || e).frameRequestId
                )
              : cancelAnimationFrame((this || e).frameRequestId);
            (this || e).frameRequestId = null;
          }
        };
        t.prototype.startRendering = function () {
          (this || e).loaded &&
            (this || e).artboard &&
            !(this || e).frameRequestId &&
            ((this || e).runtime.requestAnimationFrame
              ? ((this || e).frameRequestId = (
                  this || e
                ).runtime.requestAnimationFrame((this || e)._boundDraw))
              : ((this || e).frameRequestId = requestAnimationFrame(
                  (this || e)._boundDraw
                )));
        };
        /**
         * Enables frames-per-second (FPS) reporting for the runtime
         * If no callback is provided, Rive will append a fixed-position div at the top-right corner of
         * the page with the FPS reading
         * @param fpsCallback - Callback from the runtime during the RAF loop that supplies the FPS value
         */ t.prototype.enableFPSCounter = function (t) {
          (this || e).runtime.enableFPSCounter(t);
        };
        t.prototype.disableFPSCounter = function () {
          (this || e).runtime.disableFPSCounter();
        };
        Object.defineProperty(t.prototype, "contents", {
          get: function () {
            if ((this || e).loaded) {
              var t = { artboards: [] };
              for (var n = 0; n < (this || e).file.artboardCount(); n++) {
                var r = (this || e).file.artboardByIndex(n);
                var i = { name: r.name, animations: [], stateMachines: [] };
                for (var a = 0; a < r.animationCount(); a++) {
                  var o = r.animationByIndex(a);
                  i.animations.push(o.name);
                }
                for (var s = 0; s < r.stateMachineCount(); s++) {
                  var u = r.stateMachineByIndex(s);
                  var l = u.name;
                  var c = new (this || e).runtime.StateMachineInstance(u, r);
                  var f = [];
                  for (var h = 0; h < c.inputCount(); h++) {
                    var d = c.input(h);
                    f.push({ name: d.name, type: d.type });
                  }
                  i.stateMachines.push({ name: l, inputs: f });
                }
                t.artboards.push(i);
              }
              return t;
            }
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "volume", {
          get: function () {
            (this || e).artboard &&
              (this || e).artboard.volume !== (this || e)._volume &&
              ((this || e)._volume = (this || e).artboard.volume);
            return (this || e)._volume;
          },
          set: function (t) {
            (this || e)._volume = t;
            (this || e).artboard &&
              ((this || e).artboard.volume = t * F.systemVolume);
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "artboardWidth", {
          get: function () {
            var t;
            return (this || e).artboard
              ? (this || e).artboard.width
              : (t = (this || e)._artboardWidth) !== null && t !== void 0
              ? t
              : 0;
          },
          set: function (t) {
            (this || e)._artboardWidth = t;
            (this || e).artboard && ((this || e).artboard.width = t);
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "artboardHeight", {
          get: function () {
            var t;
            return (this || e).artboard
              ? (this || e).artboard.height
              : (t = (this || e)._artboardHeight) !== null && t !== void 0
              ? t
              : 0;
          },
          set: function (t) {
            (this || e)._artboardHeight = t;
            (this || e).artboard && ((this || e).artboard.height = t);
          },
          enumerable: false,
          configurable: true,
        });
        t.prototype.resetArtboardSize = function () {
          if ((this || e).artboard) {
            (this || e).artboard.resetArtboardSize();
            (this || e)._artboardWidth = (this || e).artboard.width;
            (this || e)._artboardHeight = (this || e).artboard.height;
          } else {
            (this || e)._artboardWidth = void 0;
            (this || e)._artboardHeight = void 0;
          }
        };
        Object.defineProperty(t.prototype, "devicePixelRatioUsed", {
          get: function () {
            return (this || e)._devicePixelRatioUsed;
          },
          set: function (t) {
            (this || e)._devicePixelRatioUsed = t;
          },
          enumerable: false,
          configurable: true,
        });
        t.prototype.bindViewModelInstance = function (t) {
          var n;
          if (
            (this || e).artboard &&
            !(this || e).destroyed &&
            t &&
            t.runtimeInstance
          ) {
            t.internalIncrementReferenceCount();
            (n = (this || e)._viewModelInstance) === null || n === void 0
              ? void 0
              : n.cleanup();
            (this || e)._viewModelInstance = t;
            (this || e).animator.stateMachines.length > 0
              ? (this || e).animator.stateMachines.forEach(function (e) {
                  return e.bindViewModelInstance(t);
                })
              : (this || e).artboard.bindViewModelInstance(t.runtimeInstance);
          }
        };
        Object.defineProperty(t.prototype, "viewModelInstance", {
          get: function () {
            return (this || e)._viewModelInstance;
          },
          enumerable: false,
          configurable: true,
        });
        t.prototype.viewModelByIndex = function (t) {
          var n = (this || e).file.viewModelByIndex(t);
          return n !== null ? new O(n) : null;
        };
        t.prototype.viewModelByName = function (t) {
          var n = (this || e).file.viewModelByName(t);
          return n !== null ? new O(n) : null;
        };
        t.prototype.enums = function () {
          if ((this || e)._dataEnums === null) {
            var t = (this || e).file.enums();
            (this || e)._dataEnums = t.map(function (e) {
              return new W(e);
            });
          }
          return (this || e)._dataEnums;
        };
        t.prototype.defaultViewModel = function () {
          if ((this || e).artboard) {
            var t = (this || e).file.defaultArtboardViewModel(
              (this || e).artboard
            );
            if (t) return new O(t);
          }
          return null;
        };
        t.missingErrorMessage = "Rive source file or data buffer required";
        t.cleanupErrorMessage = "Attempt to use file after calling cleanup.";
        return t;
      })();
      var O = (function () {
        function t(t) {
          (this || e)._viewModel = t;
        }
        Object.defineProperty(t.prototype, "instanceCount", {
          get: function () {
            return (this || e)._viewModel.instanceCount;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "name", {
          get: function () {
            return (this || e)._viewModel.name;
          },
          enumerable: false,
          configurable: true,
        });
        t.prototype.instanceByIndex = function (t) {
          var n = (this || e)._viewModel.instanceByIndex(t);
          return n !== null ? new D(n, null) : null;
        };
        t.prototype.instanceByName = function (t) {
          var n = (this || e)._viewModel.instanceByName(t);
          return n !== null ? new D(n, null) : null;
        };
        t.prototype.defaultInstance = function () {
          var t = (this || e)._viewModel.defaultInstance();
          return t !== null ? new D(t, null) : null;
        };
        t.prototype.instance = function () {
          var t = (this || e)._viewModel.instance();
          return t !== null ? new D(t, null) : null;
        };
        Object.defineProperty(t.prototype, "properties", {
          get: function () {
            return (this || e)._viewModel.getProperties();
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "instanceNames", {
          get: function () {
            return (this || e)._viewModel.getInstanceNames();
          },
          enumerable: false,
          configurable: true,
        });
        return t;
      })();
      var W = (function () {
        function t(t) {
          (this || e)._dataEnum = t;
        }
        Object.defineProperty(t.prototype, "name", {
          get: function () {
            return (this || e)._dataEnum.name;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(t.prototype, "values", {
          get: function () {
            return (this || e)._dataEnum.values;
          },
          enumerable: false,
          configurable: true,
        });
        return t;
      })();
      var B;
      (function (e) {
        e.Number = "number";
        e.String = "string";
        e.Boolean = "boolean";
        e.Color = "color";
        e.Trigger = "trigger";
        e.Enum = "enum";
        e.List = "list";
        e.Image = "image";
      })(B || (B = {}));
      var D = (function () {
        function t(t, n) {
          (this || e)._parents = [];
          (this || e)._children = [];
          (this || e)._viewModelInstances = new Map();
          (this || e)._propertiesWithCallbacks = [];
          (this || e)._referenceCount = 0;
          (this || e)._runtimeInstance = t;
          n !== null && (this || e)._parents.push(n);
        }
        Object.defineProperty(t.prototype, "runtimeInstance", {
          get: function () {
            return (this || e)._runtimeInstance;
          },
          enumerable: false,
          configurable: true,
        });
        t.prototype.handleCallbacks = function () {
          if ((this || e)._propertiesWithCallbacks.length !== 0) {
            (this || e)._propertiesWithCallbacks.forEach(function (e) {
              e.handleCallbacks();
            });
            (this || e)._propertiesWithCallbacks.forEach(function (e) {
              e.clearChanges();
            });
          }
          (this || e)._children.forEach(function (e) {
            return e.handleCallbacks();
          });
        };
        t.prototype.addParent = function (t) {
          (this || e)._parents.push(t);
          ((this || e)._propertiesWithCallbacks.length > 0 ||
            (this || e)._children.length > 0) &&
            t.addToViewModelCallbacks(this || e);
        };
        t.prototype.removeParent = function (t) {
          var n = (this || e)._parents.indexOf(t);
          if (n !== -1) {
            var r = (this || e)._parents[n];
            r.removeFromViewModelCallbacks(this || e);
            (this || e)._parents.splice(n, 1);
          }
        };
        t.prototype.addToPropertyCallbacks = function (t) {
          var n = this || e;
          if (!(this || e)._propertiesWithCallbacks.includes(t)) {
            (this || e)._propertiesWithCallbacks.push(t);
            (this || e)._propertiesWithCallbacks.length > 0 &&
              (this || e)._parents.forEach(function (e) {
                e.addToViewModelCallbacks(n);
              });
          }
        };
        t.prototype.removeFromPropertyCallbacks = function (t) {
          var n = this || e;
          if ((this || e)._propertiesWithCallbacks.includes(t)) {
            (this || e)._propertiesWithCallbacks = (
              this || e
            )._propertiesWithCallbacks.filter(function (e) {
              return e !== t;
            });
            (this || e)._children.length === 0 &&
              (this || e)._propertiesWithCallbacks.length === 0 &&
              (this || e)._parents.forEach(function (e) {
                e.removeFromViewModelCallbacks(n);
              });
          }
        };
        t.prototype.addToViewModelCallbacks = function (t) {
          var n = this || e;
          if (!(this || e)._children.includes(t)) {
            (this || e)._children.push(t);
            (this || e)._parents.forEach(function (e) {
              e.addToViewModelCallbacks(n);
            });
          }
        };
        t.prototype.removeFromViewModelCallbacks = function (t) {
          var n = this || e;
          if ((this || e)._children.includes(t)) {
            (this || e)._children = (this || e)._children.filter(function (e) {
              return e !== t;
            });
            (this || e)._children.length === 0 &&
              (this || e)._propertiesWithCallbacks.length === 0 &&
              (this || e)._parents.forEach(function (e) {
                e.removeFromViewModelCallbacks(n);
              });
          }
        };
        t.prototype.clearCallbacks = function () {
          (this || e)._propertiesWithCallbacks.forEach(function (e) {
            e.clearCallbacks();
          });
        };
        t.prototype.propertyFromPath = function (e, t) {
          var n = e.split("/");
          return this.propertyFromPathSegments(n, 0, t);
        };
        t.prototype.viewModelFromPathSegments = function (e, t) {
          var n = this.internalViewModelInstance(e[t]);
          return n !== null
            ? t == e.length - 1
              ? n
              : n.viewModelFromPathSegments(e, t++)
            : null;
        };
        t.prototype.propertyFromPathSegments = function (t, n, r) {
          var i, a, o, s, u, l, c, f, h, d, p, v, m, g, b, y;
          if (n < t.length - 1) {
            var w = this.internalViewModelInstance(t[n]);
            return w !== null ? w.propertyFromPathSegments(t, n + 1, r) : null;
          }
          var _ = null;
          switch (r) {
            case B.Number:
              _ =
                (a =
                  (i = (this || e)._runtimeInstance) === null || i === void 0
                    ? void 0
                    : i.number(t[n])) !== null && a !== void 0
                  ? a
                  : null;
              if (_ !== null) return new N(_, this || e);
              break;
            case B.String:
              _ =
                (s =
                  (o = (this || e)._runtimeInstance) === null || o === void 0
                    ? void 0
                    : o.string(t[n])) !== null && s !== void 0
                  ? s
                  : null;
              if (_ !== null) return new U(_, this || e);
              break;
            case B.Boolean:
              _ =
                (l =
                  (u = (this || e)._runtimeInstance) === null || u === void 0
                    ? void 0
                    : u.boolean(t[n])) !== null && l !== void 0
                  ? l
                  : null;
              if (_ !== null) return new $(_, this || e);
              break;
            case B.Color:
              _ =
                (f =
                  (c = (this || e)._runtimeInstance) === null || c === void 0
                    ? void 0
                    : c.color(t[n])) !== null && f !== void 0
                  ? f
                  : null;
              if (_ !== null) return new Y(_, this || e);
              break;
            case B.Trigger:
              _ =
                (d =
                  (h = (this || e)._runtimeInstance) === null || h === void 0
                    ? void 0
                    : h.trigger(t[n])) !== null && d !== void 0
                  ? d
                  : null;
              if (_ !== null) return new G(_, this || e);
              break;
            case B.Enum:
              _ =
                (v =
                  (p = (this || e)._runtimeInstance) === null || p === void 0
                    ? void 0
                    : p.enum(t[n])) !== null && v !== void 0
                  ? v
                  : null;
              if (_ !== null) return new z(_, this || e);
              break;
            case B.List:
              _ =
                (g =
                  (m = (this || e)._runtimeInstance) === null || m === void 0
                    ? void 0
                    : m.list(t[n])) !== null && g !== void 0
                  ? g
                  : null;
              if (_ !== null) return new H(_, this || e);
              break;
            case B.Image:
              _ =
                (y =
                  (b = (this || e)._runtimeInstance) === null || b === void 0
                    ? void 0
                    : b.image(t[n])) !== null && y !== void 0
                  ? y
                  : null;
              if (_ !== null) return new X(_, this || e);
              break;
          }
          return null;
        };
        t.prototype.internalViewModelInstance = function (n) {
          var r;
          if ((this || e)._viewModelInstances.has(n))
            return (this || e)._viewModelInstances.get(n);
          var i =
            (r = (this || e)._runtimeInstance) === null || r === void 0
              ? void 0
              : r.viewModel(n);
          if (i !== null) {
            var a = new t(i, this || e);
            a.internalIncrementReferenceCount();
            (this || e)._viewModelInstances.set(n, a);
            return a;
          }
          return null;
        };
        /**
         * method to access a property instance of type number belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the number property
         */ t.prototype.number = function (e) {
          var t = this.propertyFromPath(e, B.Number);
          return t;
        };
        /**
         * method to access a property instance of type string belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the string property
         */ t.prototype.string = function (e) {
          var t = this.propertyFromPath(e, B.String);
          return t;
        };
        /**
         * method to access a property instance of type boolean belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the boolean property
         */ t.prototype.boolean = function (e) {
          var t = this.propertyFromPath(e, B.Boolean);
          return t;
        };
        /**
         * method to access a property instance of type color belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the ttrigger property
         */ t.prototype.color = function (e) {
          var t = this.propertyFromPath(e, B.Color);
          return t;
        };
        /**
         * method to access a property instance of type trigger belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the trigger property
         */ t.prototype.trigger = function (e) {
          var t = this.propertyFromPath(e, B.Trigger);
          return t;
        };
        /**
         * method to access a property instance of type enum belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the enum property
         */ t.prototype.enum = function (e) {
          var t = this.propertyFromPath(e, B.Enum);
          return t;
        };
        /**
         * method to access a property instance of type list belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the list property
         */ t.prototype.list = function (e) {
          var t = this.propertyFromPath(e, B.List);
          return t;
        };
        /**
         * method to access a view model property instance belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the image property
         */ t.prototype.image = function (e) {
          var t = this.propertyFromPath(e, B.Image);
          return t;
        };
        /**
         * method to access a view model property instance belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the view model property
         */ t.prototype.viewModel = function (t) {
          var n = t.split("/");
          var r =
            n.length > 1
              ? this.viewModelFromPathSegments(n.slice(0, n.length - 1), 0)
              : this || e;
          return r != null
            ? r.internalViewModelInstance(n[n.length - 1])
            : null;
        };
        t.prototype.internalReplaceViewModel = function (t, n) {
          var r;
          if (n.runtimeInstance !== null) {
            var i =
              ((r = (this || e)._runtimeInstance) === null || r === void 0
                ? void 0
                : r.replaceViewModel(t, n.runtimeInstance)) || false;
            if (i) {
              n.internalIncrementReferenceCount();
              var a = this.internalViewModelInstance(t);
              if (a !== null) {
                a.removeParent(this || e);
                (this || e)._children.includes(a) &&
                  ((this || e)._children = (this || e)._children.filter(
                    function (e) {
                      return e !== a;
                    }
                  ));
                a.cleanup();
              }
              (this || e)._viewModelInstances.set(t, n);
              n.addParent(this || e);
            }
            return i;
          }
          return false;
        };
        /**
         * method to replace a view model property with another view model value
         * @param path - path to the view model property
         * @param value - view model that will replace the original
         */ t.prototype.replaceViewModel = function (t, n) {
          var r;
          var i = t.split("/");
          var a =
            i.length > 1
              ? this.viewModelFromPathSegments(i.slice(0, i.length - 1), 0)
              : this || e;
          return (
            (r =
              a === null || a === void 0
                ? void 0
                : a.internalReplaceViewModel(i[i.length - 1], n)) !== null &&
            r !== void 0 &&
            r
          );
        };
        t.prototype.incrementReferenceCount = function () {
          var t;
          (this || e)._referenceCount++;
          (t = (this || e)._runtimeInstance) === null || t === void 0
            ? void 0
            : t.incrementReferenceCount();
        };
        t.prototype.decrementReferenceCount = function () {
          var t;
          (this || e)._referenceCount--;
          (t = (this || e)._runtimeInstance) === null || t === void 0
            ? void 0
            : t.decrementReferenceCount();
        };
        Object.defineProperty(t.prototype, "properties", {
          get: function () {
            var t;
            return (
              ((t = (this || e)._runtimeInstance) === null || t === void 0
                ? void 0
                : t.getProperties().map(function (e) {
                    return u({}, e);
                  })) || []
            );
          },
          enumerable: false,
          configurable: true,
        });
        t.prototype.internalIncrementReferenceCount = function () {
          (this || e)._referenceCount++;
        };
        t.prototype.cleanup = function () {
          var t = this || e;
          (this || e)._referenceCount--;
          if ((this || e)._referenceCount <= 0) {
            (this || e)._runtimeInstance = null;
            this.clearCallbacks();
            (this || e)._propertiesWithCallbacks = [];
            (this || e)._viewModelInstances.forEach(function (e) {
              e.cleanup();
            });
            (this || e)._viewModelInstances.clear();
            var n = f([], (this || e)._children, true);
            (this || e)._children.length = 0;
            var r = f([], (this || e)._parents, true);
            (this || e)._parents.length = 0;
            n.forEach(function (e) {
              e.removeParent(t);
            });
            r.forEach(function (e) {
              e.removeFromViewModelCallbacks(t);
            });
          }
        };
        return t;
      })();
      var V = (function () {
        function t(t, n) {
          (this || e).callbacks = [];
          (this || e)._viewModelInstanceValue = t;
          (this || e)._parentViewModel = n;
        }
        t.prototype.on = function (t) {
          (this || e).callbacks.length === 0 &&
            (this || e)._viewModelInstanceValue.clearChanges();
          if (!(this || e).callbacks.includes(t)) {
            (this || e).callbacks.push(t);
            (this || e)._parentViewModel.addToPropertyCallbacks(this || e);
          }
        };
        t.prototype.off = function (t) {
          t
            ? ((this || e).callbacks = (this || e).callbacks.filter(function (
                e
              ) {
                return e !== t;
              }))
            : ((this || e).callbacks.length = 0);
          (this || e).callbacks.length === 0 &&
            (this || e)._parentViewModel.removeFromPropertyCallbacks(this || e);
        };
        t.prototype.internalHandleCallback = function (e) {};
        t.prototype.handleCallbacks = function () {
          var t = this || e;
          (this || e)._viewModelInstanceValue.hasChanged &&
            (this || e).callbacks.forEach(function (e) {
              t.internalHandleCallback(e);
            });
        };
        t.prototype.clearChanges = function () {
          (this || e)._viewModelInstanceValue.clearChanges();
        };
        t.prototype.clearCallbacks = function () {
          (this || e).callbacks.length = 0;
        };
        Object.defineProperty(t.prototype, "name", {
          get: function () {
            return (this || e)._viewModelInstanceValue.name;
          },
          enumerable: false,
          configurable: true,
        });
        return t;
      })();
      var U = (function (t) {
        s(n, t);
        function n(n, r) {
          return t.call(this || e, n, r) || this || e;
        }
        Object.defineProperty(n.prototype, "value", {
          get: function () {
            return (this || e)._viewModelInstanceValue.value;
          },
          set: function (t) {
            (this || e)._viewModelInstanceValue.value = t;
          },
          enumerable: false,
          configurable: true,
        });
        n.prototype.internalHandleCallback = function (t) {
          t((this || e).value);
        };
        return n;
      })(V);
      var N = (function (t) {
        s(n, t);
        function n(n, r) {
          return t.call(this || e, n, r) || this || e;
        }
        Object.defineProperty(n.prototype, "value", {
          get: function () {
            return (this || e)._viewModelInstanceValue.value;
          },
          set: function (t) {
            (this || e)._viewModelInstanceValue.value = t;
          },
          enumerable: false,
          configurable: true,
        });
        n.prototype.internalHandleCallback = function (t) {
          t((this || e).value);
        };
        return n;
      })(V);
      var $ = (function (t) {
        s(n, t);
        function n(n, r) {
          return t.call(this || e, n, r) || this || e;
        }
        Object.defineProperty(n.prototype, "value", {
          get: function () {
            return (this || e)._viewModelInstanceValue.value;
          },
          set: function (t) {
            (this || e)._viewModelInstanceValue.value = t;
          },
          enumerable: false,
          configurable: true,
        });
        n.prototype.internalHandleCallback = function (t) {
          t((this || e).value);
        };
        return n;
      })(V);
      var G = (function (t) {
        s(n, t);
        function n(n, r) {
          return t.call(this || e, n, r) || this || e;
        }
        n.prototype.trigger = function () {
          return (this || e)._viewModelInstanceValue.trigger();
        };
        n.prototype.internalHandleCallback = function (e) {
          e();
        };
        return n;
      })(V);
      var z = (function (t) {
        s(n, t);
        function n(n, r) {
          return t.call(this || e, n, r) || this || e;
        }
        Object.defineProperty(n.prototype, "value", {
          get: function () {
            return (this || e)._viewModelInstanceValue.value;
          },
          set: function (t) {
            (this || e)._viewModelInstanceValue.value = t;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(n.prototype, "valueIndex", {
          get: function () {
            return (this || e)._viewModelInstanceValue.valueIndex;
          },
          set: function (t) {
            (this || e)._viewModelInstanceValue.valueIndex = t;
          },
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(n.prototype, "values", {
          get: function () {
            return (this || e)._viewModelInstanceValue.values;
          },
          enumerable: false,
          configurable: true,
        });
        n.prototype.internalHandleCallback = function (t) {
          t((this || e).value);
        };
        return n;
      })(V);
      var H = (function (t) {
        s(n, t);
        function n(n, r) {
          return t.call(this || e, n, r) || this || e;
        }
        Object.defineProperty(n.prototype, "length", {
          get: function () {
            return (this || e)._viewModelInstanceValue.size;
          },
          enumerable: false,
          configurable: true,
        });
        n.prototype.addInstance = function (t) {
          t.runtimeInstance != null &&
            (this || e)._viewModelInstanceValue.addInstance(t.runtimeInstance);
        };
        n.prototype.removeInstance = function (t) {
          t.runtimeInstance != null &&
            (this || e)._viewModelInstanceValue.removeInstance(
              t.runtimeInstance
            );
        };
        n.prototype.removeInstanceAt = function (t) {
          (this || e)._viewModelInstanceValue.removeInstanceAt(t);
        };
        n.prototype.instanceAt = function (t) {
          var n = (this || e)._viewModelInstanceValue.instanceAt(t);
          if (n != null) {
            var r = new D(n, null);
            return r;
          }
          return null;
        };
        n.prototype.internalHandleCallback = function (e) {
          e();
        };
        return n;
      })(V);
      var Y = (function (t) {
        s(n, t);
        function n(n, r) {
          return t.call(this || e, n, r) || this || e;
        }
        Object.defineProperty(n.prototype, "value", {
          get: function () {
            return (this || e)._viewModelInstanceValue.value;
          },
          set: function (t) {
            (this || e)._viewModelInstanceValue.value = t;
          },
          enumerable: false,
          configurable: true,
        });
        n.prototype.rgb = function (t, n, r) {
          (this || e)._viewModelInstanceValue.rgb(t, n, r);
        };
        n.prototype.rgba = function (t, n, r, i) {
          (this || e)._viewModelInstanceValue.argb(i, t, n, r);
        };
        n.prototype.argb = function (t, n, r, i) {
          (this || e)._viewModelInstanceValue.argb(t, n, r, i);
        };
        n.prototype.alpha = function (t) {
          (this || e)._viewModelInstanceValue.alpha(t);
        };
        n.prototype.opacity = function (t) {
          (this || e)._viewModelInstanceValue.alpha(
            Math.round(Math.max(0, Math.min(1, t)) * 255)
          );
        };
        n.prototype.internalHandleCallback = function (t) {
          t((this || e).value);
        };
        return n;
      })(V);
      var X = (function (t) {
        s(n, t);
        function n(n, r) {
          return t.call(this || e, n, r) || this || e;
        }
        Object.defineProperty(n.prototype, "value", {
          set: function (t) {
            (this || e)._viewModelInstanceValue.value(t.nativeImage);
          },
          enumerable: false,
          configurable: true,
        });
        n.prototype.internalHandleCallback = function (e) {
          e();
        };
        return n;
      })(V);
      var q = function (t) {
        return l(void 0, void 0, void 0, function () {
          var n, r, i;
          return c(this || e, function (e) {
            switch (e.label) {
              case 0:
                n = new Request(t);
                return [4, fetch(n)];
              case 1:
                r = e.sent();
                return [4, r.arrayBuffer()];
              case 2:
                i = e.sent();
                return [2, i];
            }
          });
        });
      };
      var J = function (e) {
        return typeof e === "string" ? [e] : e instanceof Array ? e : [];
      };
      var K = { EventManager: E, TaskQueueManager: P };
      var Z = function (t) {
        return l(void 0, void 0, void 0, function () {
          var n, r, i;
          return c(this || e, function (e) {
            switch (e.label) {
              case 0:
                n = new Promise(function (e) {
                  return g.getInstance(function (n) {
                    n.decodeAudio(t, e);
                  });
                });
                return [4, n];
              case 1:
                r = e.sent();
                i = new o.AudioWrapper(r);
                o.finalizationRegistry.register(i, r);
                return [2, i];
            }
          });
        });
      };
      var Q = function (t) {
        return l(void 0, void 0, void 0, function () {
          var n, r, i;
          return c(this || e, function (e) {
            switch (e.label) {
              case 0:
                n = new Promise(function (e) {
                  return g.getInstance(function (n) {
                    n.decodeImage(t, e);
                  });
                });
                return [4, n];
              case 1:
                r = e.sent();
                i = new o.ImageWrapper(r);
                o.finalizationRegistry.register(i, r);
                return [2, i];
            }
          });
        });
      };
      var ee = function (t) {
        return l(void 0, void 0, void 0, function () {
          var n, r, i;
          return c(this || e, function (e) {
            switch (e.label) {
              case 0:
                n = new Promise(function (e) {
                  return g.getInstance(function (n) {
                    n.decodeFont(t, e);
                  });
                });
                return [4, n];
              case 1:
                r = e.sent();
                i = new o.FontWrapper(r);
                o.finalizationRegistry.register(i, r);
                return [2, i];
            }
          });
        });
      };
    })();
    return i;
  })()
);
var n = t;
const r = t.rive,
  i = t.__esModule;
export { i as __esModule, n as default, r as rive };
//# sourceMappingURL=rive.js.map
