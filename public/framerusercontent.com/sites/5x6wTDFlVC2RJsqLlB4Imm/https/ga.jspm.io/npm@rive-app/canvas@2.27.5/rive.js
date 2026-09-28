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
                this.pb();
                a && a.Tb();
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
              (this || e).Rb = function (t) {
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
                  (this || e).Tb = function () {
                    var e = performance.now();
                    r
                      ? (++n,
                        (e -= r),
                        1e3 < e && (t((1e3 * n) / e), (n = r = 0)))
                      : ((r = e), (n = 0));
                  };
                })();
              };
              (this || e).Ob = function () {
                o && (document.body.remove(o), (o = null));
                a = null;
              };
              (this || e).pb = function () {};
            }
            function s(t) {
              undefined;
              const n = new Map();
              let r = -Infinity;
              (this || e).push = function (e) {
                e = (e + ((1 << t) - 1)) >> t;
                n.has(e) && clearTimeout(n.get(e));
                n.set(
                  e,
                  setTimeout(function () {
                    n.delete(e);
                    0 == n.length
                      ? (r = -Infinity)
                      : e == r &&
                        ((r = Math.max(...n.keys())), console.assert(r < e));
                  }, 1e3)
                );
                r = Math.max(e, r);
                return r << t;
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
                  (this || e).Gb = t;
                },
                loadContents: function (e, t) {
                  e = a.ptrToAsset(e);
                  return this.Gb(e, t);
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
                  (this || e).lb = [];
                },
                addLoader: function (t) {
                  (this || e).lb.push(t);
                },
                loadContents: function (t, n) {
                  for (let r of (this || e).lb)
                    if (r.loadContents(t, n)) return !0;
                  return !1;
                },
              });
              let i = a.computeAlignment;
              a.computeAlignment = function (t, n, r, a, o = 1) {
                return i.call(this || e, t, n, r, a, o);
              };
            };
            const l =
                "createConicGradient createImageData createLinearGradient createPattern createRadialGradient getContextAttributes getImageData getLineDash getTransform isContextLost isPointInPath isPointInStroke measureText".split(
                  " "
                ),
              c = new (function () {
                function t() {
                  if (!n) {
                    var e = document.createElement("canvas"),
                      t = {
                        alpha: 1,
                        depth: 0,
                        stencil: 0,
                        antialias: 0,
                        premultipliedAlpha: 1,
                        preserveDrawingBuffer: 0,
                        powerPreference: "high-performance",
                        failIfMajorPerformanceCaveat: 0,
                        enableExtensionsByDefault: 1,
                        explicitSwapControl: 1,
                        renderViaOffscreenBackBuffer: 1,
                      };
                    let s;
                    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                      if (((s = e.getContext("webgl", t)), (r = 1), !s))
                        return (
                          console.log(
                            "No WebGL support. Image mesh will not be drawn."
                          ),
                          !1
                        );
                    } else if ((s = e.getContext("webgl2", t))) r = 2;
                    else {
                      if (!(s = e.getContext("webgl", t)))
                        return (
                          console.log(
                            "No WebGL support. Image mesh will not be drawn."
                          ),
                          !1
                        );
                      r = 1;
                    }
                    s = new Proxy(s, {
                      get(e, t) {
                        return e.isContextLost()
                          ? (c ||
                              (console.error(
                                "Cannot render the mesh because the GL Context was lost. Tried to invoke ",
                                t
                              ),
                              (c = !0)),
                            "function" === typeof e[t]
                              ? function () {}
                              : void 0)
                          : "function" === typeof e[t]
                          ? function (...n) {
                              return e[t].apply(e, n);
                            }
                          : e[t];
                      },
                      set(e, t, n) {
                        if (!e.isContextLost()) return (e[t] = n), !0;
                        c ||
                          (console.error(
                            "Cannot render the mesh because the GL Context was lost. Tried to set property " +
                              t
                          ),
                          (c = !0));
                      },
                    });
                    i = Math.min(
                      s.getParameter(s.MAX_RENDERBUFFER_SIZE),
                      s.getParameter(s.MAX_TEXTURE_SIZE)
                    );
                    function u(e, t, n) {
                      t = s.createShader(t);
                      s.shaderSource(t, n);
                      s.compileShader(t);
                      n = s.getShaderInfoLog(t);
                      if (0 < (n || "").length) throw n;
                      s.attachShader(e, t);
                    }
                    e = s.createProgram();
                    u(
                      e,
                      s.VERTEX_SHADER,
                      "attribute vec2 vertex;\n                attribute vec2 uv;\n                uniform vec4 mat;\n                uniform vec2 translate;\n                varying vec2 st;\n                void main() {\n                    st = uv;\n                    gl_Position = vec4(mat2(mat) * vertex + translate, 0, 1);\n                }"
                    );
                    u(
                      e,
                      s.FRAGMENT_SHADER,
                      "precision highp float;\n                uniform sampler2D image;\n                varying vec2 st;\n                void main() {\n                    gl_FragColor = texture2D(image, st);\n                }"
                    );
                    s.bindAttribLocation(e, 0, "vertex");
                    s.bindAttribLocation(e, 1, "uv");
                    s.linkProgram(e);
                    t = s.getProgramInfoLog(e);
                    if (0 < (t || "").trim().length) throw t;
                    a = s.getUniformLocation(e, "mat");
                    o = s.getUniformLocation(e, "translate");
                    s.useProgram(e);
                    s.bindBuffer(s.ARRAY_BUFFER, s.createBuffer());
                    s.enableVertexAttribArray(0);
                    s.enableVertexAttribArray(1);
                    s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, s.createBuffer());
                    s.uniform1i(s.getUniformLocation(e, "image"), 0);
                    s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
                    n = s;
                  }
                  return !0;
                }
                let n = null,
                  r = 0,
                  i = 0,
                  a = null,
                  o = null,
                  u = 0,
                  l = 0,
                  c = !1;
                t();
                (this || e).hc = function () {
                  t();
                  return i;
                };
                (this || e).Mb = function (e) {
                  n.deleteTexture && n.deleteTexture(e);
                };
                (this || e).Lb = function (e) {
                  if (!t()) return null;
                  const i = n.createTexture();
                  if (!i) return null;
                  n.bindTexture(n.TEXTURE_2D, i);
                  n.texImage2D(
                    n.TEXTURE_2D,
                    0,
                    n.RGBA,
                    n.RGBA,
                    n.UNSIGNED_BYTE,
                    e
                  );
                  n.texParameteri(
                    n.TEXTURE_2D,
                    n.TEXTURE_WRAP_S,
                    n.CLAMP_TO_EDGE
                  );
                  n.texParameteri(
                    n.TEXTURE_2D,
                    n.TEXTURE_WRAP_T,
                    n.CLAMP_TO_EDGE
                  );
                  n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.LINEAR);
                  2 == r
                    ? (n.texParameteri(
                        n.TEXTURE_2D,
                        n.TEXTURE_MIN_FILTER,
                        n.LINEAR_MIPMAP_LINEAR
                      ),
                      n.generateMipmap(n.TEXTURE_2D))
                    : n.texParameteri(
                        n.TEXTURE_2D,
                        n.TEXTURE_MIN_FILTER,
                        n.LINEAR
                      );
                  return i;
                };
                const h = new s(8),
                  f = new s(8),
                  d = new s(10),
                  p = new s(10);
                (this || e).Qb = function (e, r, i, s, c) {
                  if (t()) {
                    var v = h.push(e),
                      m = f.push(r);
                    if (n.canvas) {
                      (n.canvas.width == v && n.canvas.height == m) ||
                        ((n.canvas.width = v), (n.canvas.height = m));
                      n.viewport(0, m - r, e, r);
                      n.disable(n.SCISSOR_TEST);
                      n.clearColor(0, 0, 0, 0);
                      n.clear(n.COLOR_BUFFER_BIT);
                      n.enable(n.SCISSOR_TEST);
                      i.sort((e, t) => t.xb - e.xb);
                      v = d.push(s);
                      u != v &&
                        (n.bufferData(n.ARRAY_BUFFER, 8 * v, n.DYNAMIC_DRAW),
                        (u = v));
                      v = 0;
                      for (var b of i)
                        n.bufferSubData(n.ARRAY_BUFFER, v, b.Ua),
                          (v += 4 * b.Ua.length);
                      console.assert(v == 4 * s);
                      for (var g of i)
                        n.bufferSubData(n.ARRAY_BUFFER, v, g.Db),
                          (v += 4 * g.Db.length);
                      console.assert(v == 8 * s);
                      v = p.push(c);
                      l != v &&
                        (n.bufferData(
                          n.ELEMENT_ARRAY_BUFFER,
                          2 * v,
                          n.DYNAMIC_DRAW
                        ),
                        (l = v));
                      b = 0;
                      for (var y of i)
                        n.bufferSubData(n.ELEMENT_ARRAY_BUFFER, b, y.indices),
                          (b += 2 * y.indices.length);
                      console.assert(b == 2 * c);
                      y = 0;
                      g = !0;
                      v = b = 0;
                      for (const t of i) {
                        t.image.Ka != y &&
                          (n.bindTexture(n.TEXTURE_2D, t.image.Ja || null),
                          (y = t.image.Ka));
                        t.mc
                          ? (n.scissor(t.Za, m - t.$a - t.kb, t.Ac, t.kb),
                            (g = !0))
                          : g && (n.scissor(0, m - r, e, r), (g = !1));
                        i = 2 / e;
                        const u = -2 / r;
                        n.uniform4f(
                          a,
                          t.ha[0] * i * t.Ba,
                          t.ha[1] * u * t.Ca,
                          t.ha[2] * i * t.Ba,
                          t.ha[3] * u * t.Ca
                        );
                        n.uniform2f(
                          o,
                          t.ha[4] * i * t.Ba + i * (t.Za - t.ic * t.Ba) - 1,
                          t.ha[5] * u * t.Ca + u * (t.$a - t.jc * t.Ca) + 1
                        );
                        n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, v);
                        n.vertexAttribPointer(1, 2, n.FLOAT, !1, 0, v + 4 * s);
                        n.drawElements(
                          n.TRIANGLES,
                          t.indices.length,
                          n.UNSIGNED_SHORT,
                          b
                        );
                        v += 4 * t.Ua.length;
                        b += 2 * t.indices.length;
                      }
                      console.assert(v == 4 * s);
                      console.assert(b == 2 * c);
                    }
                  }
                };
                (this || e).canvas = function () {
                  return t() && n.canvas;
                };
              })(),
              h = a.onRuntimeInitialized;
            a.onRuntimeInitialized = function () {
              function t(e) {
                switch (e) {
                  case v.srcOver:
                    return "source-over";
                  case v.screen:
                    return "screen";
                  case v.overlay:
                    return "overlay";
                  case v.darken:
                    return "darken";
                  case v.lighten:
                    return "lighten";
                  case v.colorDodge:
                    return "color-dodge";
                  case v.colorBurn:
                    return "color-burn";
                  case v.hardLight:
                    return "hard-light";
                  case v.softLight:
                    return "soft-light";
                  case v.difference:
                    return "difference";
                  case v.exclusion:
                    return "exclusion";
                  case v.multiply:
                    return "multiply";
                  case v.hue:
                    return "hue";
                  case v.saturation:
                    return "saturation";
                  case v.color:
                    return "color";
                  case v.luminosity:
                    return "luminosity";
                }
              }
              function n(e) {
                return (
                  "rgba(" +
                  ((16711680 & e) >>> 16) +
                  "," +
                  ((65280 & e) >>> 8) +
                  "," +
                  ((255 & e) >>> 0) +
                  "," +
                  ((4278190080 & e) >>> 24) / 255 +
                  ")"
                );
              }
              function r() {
                0 < P.length &&
                  (c.Qb(M.drawWidth(), M.drawHeight(), P, I, E),
                  (P = []),
                  (E = I = 0),
                  M.reset(512, 512));
                for (const e of C) {
                  for (const t of e.H) t();
                  e.H = [];
                }
                C.clear();
              }
              h && h();
              var i = a.RenderPaintStyle;
              const s = a.RenderPath,
                u = a.RenderPaint,
                f = a.Renderer,
                d = a.StrokeCap,
                p = a.StrokeJoin,
                v = a.BlendMode,
                m = i.fill,
                b = i.stroke,
                g = a.FillRule.evenOdd;
              let y = 1;
              var w = a.RenderImage.extend("CanvasRenderImage", {
                  __construct: function ({ la: t, xa: n } = {}) {
                    (this || e).__parent.__construct.call(this || e);
                    (this || e).Ka = y;
                    y = (y + 1) & 2147483647 || 1;
                    (this || e).la = t;
                    (this || e).xa = n;
                  },
                  __destruct: function () {
                    (this || e).Ja &&
                      (c.Mb((this || e).Ja),
                      URL.revokeObjectURL((this || e).Xa));
                    (this || e).__parent.__destruct.call(this || e);
                  },
                  decode: function (t) {
                    var n = this || e;
                    n.xa && n.xa(n);
                    var r = new Image();
                    n.Xa = URL.createObjectURL(
                      new Blob([t], { type: "image/png" })
                    );
                    r.onload = function () {
                      n.Fb = r;
                      n.Ja = c.Lb(r);
                      n.size(r.width, r.height);
                      n.la && n.la(n);
                    };
                    r.src = n.Xa;
                  },
                }),
                _ = s.extend("CanvasRenderPath", {
                  __construct: function () {
                    (this || e).__parent.__construct.call(this || e);
                    (this || e).T = new Path2D();
                  },
                  rewind: function () {
                    (this || e).T = new Path2D();
                  },
                  addPath: function (t, n, r, i, a, o, s) {
                    var u = (this || e).T,
                      l = u.addPath;
                    t = t.T;
                    const c = new DOMMatrix();
                    c.a = n;
                    c.b = r;
                    c.c = i;
                    c.d = a;
                    c.e = o;
                    c.f = s;
                    l.call(u, t, c);
                  },
                  fillRule: function (t) {
                    (this || e).Wa = t;
                  },
                  moveTo: function (t, n) {
                    (this || e).T.moveTo(t, n);
                  },
                  lineTo: function (t, n) {
                    (this || e).T.lineTo(t, n);
                  },
                  cubicTo: function (t, n, r, i, a, o) {
                    (this || e).T.bezierCurveTo(t, n, r, i, a, o);
                  },
                  close: function () {
                    (this || e).T.closePath();
                  },
                }),
                A = u.extend("CanvasRenderPaint", {
                  color: function (t) {
                    (this || e).Ya = n(t);
                  },
                  thickness: function (t) {
                    (this || e).Ib = t;
                  },
                  join: function (t) {
                    switch (t) {
                      case p.miter:
                        (this || e).Ia = "miter";
                        break;
                      case p.round:
                        (this || e).Ia = "round";
                        break;
                      case p.bevel:
                        (this || e).Ia = "bevel";
                    }
                  },
                  cap: function (t) {
                    switch (t) {
                      case d.butt:
                        (this || e).Ha = "butt";
                        break;
                      case d.round:
                        (this || e).Ha = "round";
                        break;
                      case d.square:
                        (this || e).Ha = "square";
                    }
                  },
                  style: function (t) {
                    (this || e).Hb = t;
                  },
                  blendMode: function (n) {
                    (this || e).Eb = t(n);
                  },
                  clearGradient: function () {
                    (this || e).ja = null;
                  },
                  linearGradient: function (t, n, r, i) {
                    (this || e).ja = { zb: t, Ab: n, cb: r, eb: i, Ra: [] };
                  },
                  radialGradient: function (t, n, r, i) {
                    (this || e).ja = {
                      zb: t,
                      Ab: n,
                      cb: r,
                      eb: i,
                      Ra: [],
                      ec: !0,
                    };
                  },
                  addStop: function (t, n) {
                    (this || e).ja.Ra.push({ color: t, stop: n });
                  },
                  completeGradient: function () {},
                  draw: function (t, r, i) {
                    let a = (this || e).Hb;
                    var o = (this || e).Ya,
                      s = (this || e).ja;
                    t.globalCompositeOperation = (this || e).Eb;
                    if (null != s) {
                      o = s.zb;
                      var u = s.Ab;
                      const r = s.cb;
                      var l = s.eb;
                      const i = s.Ra;
                      s.ec
                        ? ((s = r - o),
                          (l -= u),
                          (o = t.createRadialGradient(
                            o,
                            u,
                            0,
                            o,
                            u,
                            Math.sqrt(s * s + l * l)
                          )))
                        : (o = t.createLinearGradient(o, u, r, l));
                      for (let e = 0, t = i.length; e < t; e++)
                        (u = i[e]), o.addColorStop(u.stop, n(u.color));
                      (this || e).Ya = o;
                      (this || e).ja = null;
                    }
                    switch (a) {
                      case b:
                        t.strokeStyle = o;
                        t.lineWidth = (this || e).Ib;
                        t.lineCap = (this || e).Ha;
                        t.lineJoin = (this || e).Ia;
                        t.stroke(r);
                        break;
                      case m:
                        (t.fillStyle = o), t.fill(r, i);
                    }
                  },
                });
              const C = new Set();
              let M = null,
                P = [],
                I = 0,
                E = 0;
              var R = (a.CanvasRenderer = f.extend("Renderer", {
                __construct: function (t) {
                  (this || e).__parent.__construct.call(this || e);
                  (this || e).S = [1, 0, 0, 1, 0, 0];
                  (this || e).C = t.getContext("2d");
                  (this || e).Va = t;
                  (this || e).H = [];
                },
                save: function () {
                  (this || e).S.push(
                    ...(this || e).S.slice((this || e).S.length - 6)
                  );
                  (this || e).H.push((this || e).C.save.bind((this || e).C));
                },
                restore: function () {
                  const t = (this || e).S.length - 6;
                  if (6 > t) throw "restore() called without matching save().";
                  (this || e).S.splice(t);
                  (this || e).H.push((this || e).C.restore.bind((this || e).C));
                },
                transform: function (t, n, r, i, a, o) {
                  const s = (this || e).S,
                    u = s.length - 6;
                  s.splice(
                    u,
                    6,
                    s[u] * t + s[u + 2] * n,
                    s[u + 1] * t + s[u + 3] * n,
                    s[u] * r + s[u + 2] * i,
                    s[u + 1] * r + s[u + 3] * i,
                    s[u] * a + s[u + 2] * o + s[u + 4],
                    s[u + 1] * a + s[u + 3] * o + s[u + 5]
                  );
                  (this || e).H.push(
                    (this || e).C.transform.bind(
                      (this || e).C,
                      t,
                      n,
                      r,
                      i,
                      a,
                      o
                    )
                  );
                },
                rotate: function (e) {
                  const t = Math.sin(e);
                  e = Math.cos(e);
                  this.transform(e, t, -t, e, 0, 0);
                },
                _drawPath: function (t, n) {
                  (this || e).H.push(
                    n.draw.bind(
                      n,
                      (this || e).C,
                      t.T,
                      t.Wa === g ? "evenodd" : "nonzero"
                    )
                  );
                },
                _drawRiveImage: function (n, r, i) {
                  var a = n.Fb;
                  if (a) {
                    var o = (this || e).C,
                      s = t(r);
                    (this || e).H.push(function () {
                      o.globalCompositeOperation = s;
                      o.globalAlpha = i;
                      o.drawImage(a, 0, 0);
                      o.globalAlpha = 1;
                    });
                  }
                },
                _getMatrix: function (t) {
                  const n = (this || e).S,
                    r = n.length - 6;
                  for (let e = 0; 6 > e; ++e) t[e] = n[r + e];
                },
                _drawImageMesh: function (n, i, o, s, u, l, h, f, d, p) {
                  var v = (this || e).C.canvas.width,
                    m = (this || e).C.canvas.height;
                  const b = d - h,
                    g = p - f;
                  h = Math.max(h, 0);
                  f = Math.max(f, 0);
                  d = Math.min(d, v);
                  p = Math.min(p, m);
                  const y = d - h,
                    w = p - f;
                  console.assert(y <= Math.min(b, v));
                  console.assert(w <= Math.min(g, m));
                  if (!(0 >= y || 0 >= w)) {
                    d = y < b || w < g;
                    v = p = 1;
                    var _ = Math.ceil(y * p),
                      A = Math.ceil(w * v);
                    m = c.hc();
                    _ > m && ((p *= m / _), (_ = m));
                    A > m && ((v *= m / A), (A = m));
                    M || ((M = new a.DynamicRectanizer(m)), M.reset(512, 512));
                    m = M.addRect(_, A);
                    0 > m &&
                      (r(),
                      C.add(this || e),
                      (m = M.addRect(_, A)),
                      console.assert(0 <= m));
                    var R = m & 65535,
                      T = m >> 16;
                    P.push({
                      ha: (this || e).S.slice((this || e).S.length - 6),
                      image: n,
                      Za: R,
                      $a: T,
                      ic: h,
                      jc: f,
                      Ac: _,
                      kb: A,
                      Ba: p,
                      Ca: v,
                      Ua: new Float32Array(s),
                      Db: new Float32Array(u),
                      indices: new Uint16Array(l),
                      mc: d,
                      xb: (n.Ka << 1) | (d ? 1 : 0),
                    });
                    I += s.length;
                    E += l.length;
                    var F = (this || e).C,
                      L = t(i);
                    (this || e).H.push(function () {
                      F.save();
                      F.resetTransform();
                      F.globalCompositeOperation = L;
                      F.globalAlpha = o;
                      const e = c.canvas();
                      e && F.drawImage(e, R, T, _, A, h, f, y, w);
                      F.restore();
                    });
                  }
                },
                _clipPath: function (t) {
                  (this || e).H.push(
                    (this || e).C.clip.bind(
                      (this || e).C,
                      t.T,
                      t.Wa === g ? "evenodd" : "nonzero"
                    )
                  );
                },
                clear: function () {
                  C.add(this || e);
                  (this || e).H.push(
                    (this || e).C.clearRect.bind(
                      (this || e).C,
                      0,
                      0,
                      (this || e).Va.width,
                      (this || e).Va.height
                    )
                  );
                },
                flush: function () {},
                translate: function (e, t) {
                  this.transform(1, 0, 0, 1, e, t);
                },
              }));
              a.makeRenderer = function (e) {
                const t = new R(e),
                  n = t.C;
                return new Proxy(t, {
                  get(e, r) {
                    if ("function" === typeof e[r])
                      return function (...t) {
                        return e[r].apply(e, t);
                      };
                    if ("function" === typeof n[r]) {
                      if (-1 < l.indexOf(r))
                        throw Error(
                          "RiveException: Method call to '" +
                            r +
                            "()' is not allowed, as the renderer cannot immediately pass through the return                 values of any canvas 2d context methods."
                        );
                      return function (...e) {
                        t.H.push(n[r].bind(n, ...e));
                      };
                    }
                    return e[r];
                  },
                  set(e, r, i) {
                    if (r in n)
                      return (
                        t.H.push(() => {
                          n[r] = i;
                        }),
                        !0
                      );
                  },
                });
              };
              a.decodeImage = function (e, t) {
                new w({ la: t }).decode(e);
              };
              a.renderFactory = {
                makeRenderPaint: function () {
                  return new A();
                },
                makeRenderPath: function () {
                  return new _();
                },
                makeRenderImage: function () {
                  let e = F;
                  return new w({
                    xa: () => {
                      e.total++;
                    },
                    la: () => {
                      e.loaded++;
                      if (e.loaded === e.total) {
                        const t = e.ready;
                        t && (t(), (e.ready = null));
                      }
                    },
                  });
                },
              };
              let T = a.load,
                F = null;
              a.load = function (e, t, n = !0) {
                const r = new a.FallbackFileAssetLoader();
                void 0 !== t && r.addLoader(t);
                n && ((t = new a.CDNFileAssetLoader()), r.addLoader(t));
                return new Promise(function (t) {
                  let n = null;
                  F = {
                    total: 0,
                    loaded: 0,
                    ready: function () {
                      t(n);
                    },
                  };
                  n = T(e, r);
                  0 == F.total && t(n);
                });
              };
              let L = a.RendererWrapper.prototype.align;
              a.RendererWrapper.prototype.align = function (t, n, r, i, a = 1) {
                L.call(this || e, t, n, r, i, a);
              };
              i = new o();
              a.requestAnimationFrame = i.requestAnimationFrame.bind(i);
              a.cancelAnimationFrame = i.cancelAnimationFrame.bind(i);
              a.enableFPSCounter = i.Rb.bind(i);
              a.disableFPSCounter = i.Ob;
              i.pb = r;
              a.resolveAnimationFrame = r;
              a.cleanup = function () {
                M && M.delete();
              };
            };
            var f,
              d,
              p = Object.assign({}, a),
              v = "./this.program",
              m = "object" == typeof window,
              b = "function" == typeof importScripts,
              g = "";
            (m || b) &&
              (b
                ? (g = self.location.href)
                : "undefined" != typeof document &&
                  document.currentScript &&
                  (g = document.currentScript.src),
              t && (g = t),
              (g =
                0 !== g.indexOf("blob:")
                  ? g.substr(0, g.replace(/[?#].*/, "").lastIndexOf("/") + 1)
                  : ""),
              b &&
                (d = (e) => {
                  var t = new XMLHttpRequest();
                  t.open("GET", e, !1);
                  t.responseType = "arraybuffer";
                  t.send(null);
                  return new Uint8Array(t.response);
                }),
              (f = (e, t, n) => {
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
            var y = a.print || console.log.bind(console),
              w = a.printErr || console.error.bind(console);
            Object.assign(a, p);
            p = null;
            a.thisProgram && (v = a.thisProgram);
            var _;
            a.wasmBinary && (_ = a.wasmBinary);
            a.noExitRuntime;
            "object" != typeof WebAssembly &&
              N("no native wasm support detected");
            var A,
              C,
              M,
              P,
              I,
              E,
              R,
              T,
              F,
              L,
              k = !1;
            function j() {
              var e = A.buffer;
              a.HEAP8 = M = new Int8Array(e);
              a.HEAP16 = I = new Int16Array(e);
              a.HEAP32 = R = new Int32Array(e);
              a.HEAPU8 = P = new Uint8Array(e);
              a.HEAPU16 = E = new Uint16Array(e);
              a.HEAPU32 = T = new Uint32Array(e);
              a.HEAPF32 = F = new Float32Array(e);
              a.HEAPF64 = L = new Float64Array(e);
            }
            var S,
              O = [],
              x = [],
              D = [];
            function W() {
              var e = a.preRun.shift();
              O.unshift(e);
            }
            var U = 0,
              V = null,
              B = null;
            function N(e) {
              a.onAbort && a.onAbort(e);
              e = "Aborted(" + e + ")";
              w(e);
              k = !0;
              e = new WebAssembly.RuntimeError(
                e + ". Build with -sASSERTIONS for more info."
              );
              i(e);
              throw e;
            }
            function $(e) {
              return e.startsWith("data:application/octet-stream;base64,");
            }
            var z;
            z = "canvas_advanced.wasm";
            if (!$(z)) {
              var H = z;
              z = a.locateFile ? a.locateFile(H, g) : g + H;
            }
            function Y(e) {
              if (e == z && _) return new Uint8Array(_);
              if (d) return d(e);
              throw "both async and sync fetching of the wasm failed";
            }
            function X(e) {
              if (!_ && (m || b)) {
                if ("function" == typeof fetch && !e.startsWith("file://"))
                  return fetch(e, { credentials: "same-origin" })
                    .then((t) => {
                      if (!t.ok)
                        throw "failed to load wasm binary file at '" + e + "'";
                      return t.arrayBuffer();
                    })
                    .catch(() => Y(e));
                if (f)
                  return new Promise((t, n) => {
                    f(e, (e) => t(new Uint8Array(e)), n);
                  });
              }
              return Promise.resolve().then(() => Y(e));
            }
            function G(e, t, n) {
              return X(e)
                .then((e) => WebAssembly.instantiate(e, t))
                .then((e) => e)
                .then(n, (e) => {
                  w("failed to asynchronously prepare wasm: " + e);
                  N(e);
                });
            }
            function q(e, t) {
              var n = z;
              return _ ||
                "function" != typeof WebAssembly.instantiateStreaming ||
                $(n) ||
                n.startsWith("file://") ||
                "function" != typeof fetch
                ? G(n, e, t)
                : fetch(n, { credentials: "same-origin" }).then((r) =>
                    WebAssembly.instantiateStreaming(r, e).then(
                      t,
                      function (r) {
                        w("wasm streaming compile failed: " + r);
                        w("falling back to ArrayBuffer instantiation");
                        return G(n, e, t);
                      }
                    )
                  );
            }
            var J,
              K,
              Z = {
                453404: (e, t, n, r, i) => {
                  if (
                    "undefined" === typeof window ||
                    void 0 ===
                      (window.AudioContext || window.webkitAudioContext)
                  )
                    return 0;
                  if ("undefined" === typeof window.h) {
                    window.h = { Aa: 0 };
                    window.h.I = {};
                    window.h.I.ya = e;
                    window.h.I.capture = t;
                    window.h.I.La = n;
                    window.h.ga = {};
                    window.h.ga.stopped = r;
                    window.h.ga.yb = i;
                    let a = window.h;
                    a.D = [];
                    a.yc = function (e) {
                      for (var t = 0; t < a.D.length; ++t)
                        if (null == a.D[t]) return (a.D[t] = e), t;
                      a.D.push(e);
                      return a.D.length - 1;
                    };
                    a.Cb = function (e) {
                      for (a.D[e] = null; 0 < a.D.length; ) {
                        if (null != a.D[a.D.length - 1]) break;
                        a.D.pop();
                      }
                    };
                    a.Sc = function (e) {
                      for (var t = 0; t < a.D.length; ++t)
                        if (a.D[t] == e) return a.Cb(t);
                    };
                    a.ra = function (e) {
                      return a.D[e];
                    };
                    a.Ta = ["touchend", "click"];
                    a.unlock = function () {
                      for (var e = 0; e < a.D.length; ++e) {
                        var t = a.D[e];
                        null != t &&
                          null != t.J &&
                          t.state === a.ga.yb &&
                          t.J.resume().then(
                            () => {
                              $n(t.qb);
                            },
                            (e) => {
                              console.error("Failed to resume audiocontext", e);
                            }
                          );
                      }
                      a.Ta.map(function (e) {
                        document.removeEventListener(e, a.unlock, !0);
                      });
                    };
                    a.Ta.map(function (e) {
                      document.addEventListener(e, a.unlock, !0);
                    });
                  }
                  window.h.Aa += 1;
                  return 1;
                },
                455582: () => {
                  "undefined" !== typeof window.h &&
                    (window.h.Ta.map(function (e) {
                      document.removeEventListener(e, window.h.unlock, !0);
                    }),
                    --window.h.Aa,
                    0 === window.h.Aa && delete window.h);
                },
                455886: () =>
                  void 0 !== navigator.mediaDevices &&
                  void 0 !== navigator.mediaDevices.getUserMedia,
                455990: () => {
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
                456161: (e, t, n, r, i, a) => {
                  if ("undefined" === typeof window.h) return -1;
                  var o = {},
                    s = {};
                  e == window.h.I.ya && 0 != n && (s.sampleRate = n);
                  o.J = new (window.AudioContext || window.webkitAudioContext)(
                    s
                  );
                  o.J.suspend();
                  o.state = window.h.ga.stopped;
                  n = 0;
                  e != window.h.I.ya && (n = t);
                  o.Z = o.J.createScriptProcessor(r, n, t);
                  o.Z.onaudioprocess = function (n) {
                    (null != o.sa && 0 != o.sa.length) ||
                      (o.sa = new Float32Array(F.buffer, i, r * t));
                    if (e == window.h.I.capture || e == window.h.I.La) {
                      for (var s = 0; s < t; s += 1)
                        for (
                          var u = n.inputBuffer.getChannelData(s),
                            l = o.sa,
                            c = 0;
                          c < r;
                          c += 1
                        )
                          l[c * t + s] = u[c];
                      zn(a, r, i);
                    }
                    if (e == window.h.I.ya || e == window.h.I.La)
                      for (
                        Hn(a, r, i), s = 0;
                        s < n.outputBuffer.numberOfChannels;
                        ++s
                      )
                        for (
                          u = n.outputBuffer.getChannelData(s), l = o.sa, c = 0;
                          c < r;
                          c += 1
                        )
                          u[c] = l[c * t + s];
                    else
                      for (s = 0; s < n.outputBuffer.numberOfChannels; ++s)
                        n.outputBuffer.getChannelData(s).fill(0);
                  };
                  (e != window.h.I.capture && e != window.h.I.La) ||
                    navigator.mediaDevices
                      .getUserMedia({ audio: !0, video: !1 })
                      .then(function (e) {
                        o.Da = o.J.createMediaStreamSource(e);
                        o.Da.connect(o.Z);
                        o.Z.connect(o.J.destination);
                      })
                      .catch(function (e) {
                        console.log("Failed to get user media: " + e);
                      });
                  e == window.h.I.ya && o.Z.connect(o.J.destination);
                  o.qb = a;
                  return window.h.yc(o);
                },
                459038: (e) => window.h.ra(e).J.sampleRate,
                459111: (e) => {
                  e = window.h.ra(e);
                  void 0 !== e.Z &&
                    ((e.Z.onaudioprocess = function () {}),
                    e.Z.disconnect(),
                    (e.Z = void 0));
                  void 0 !== e.Da && (e.Da.disconnect(), (e.Da = void 0));
                  e.J.close();
                  e.J = void 0;
                  e.qb = void 0;
                },
                459511: (e) => {
                  window.h.Cb(e);
                },
                459561: (e) => {
                  e = window.h.ra(e);
                  e.J.resume();
                  e.state = window.h.ga.yb;
                },
                459700: (e) => {
                  e = window.h.ra(e);
                  e.J.suspend();
                  e.state = window.h.ga.stopped;
                },
              },
              Q = (e) => {
                for (; 0 < e.length; ) e.shift()(a);
              },
              ee = (e, t) => {
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
              te = (e) => {
                var t = "/" === e.charAt(0),
                  n = "/" === e.substr(-1);
                (e = ee(
                  e.split("/").filter((e) => !!e),
                  !t
                ).join("/")) ||
                  t ||
                  (e = ".");
                e && n && (e += "/");
                return (t ? "/" : "") + e;
              },
              ne = (e) => {
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
              re = (e) => {
                if ("/" === e) return "/";
                e = te(e);
                e = e.replace(/\/$/, "");
                var t = e.lastIndexOf("/");
                return -1 === t ? e : e.substr(t + 1);
              },
              ie = () => {
                if (
                  "object" == typeof crypto &&
                  "function" == typeof crypto.getRandomValues
                )
                  return (e) => crypto.getRandomValues(e);
                N("initRandomDevice");
              },
              ae = (e) => (ae = ie())(e);
            function oe() {
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
              e = ee(
                e.split("/").filter((e) => !!e),
                !t
              ).join("/");
              return (t ? "/" : "") + e || ".";
            }
            var se =
                "undefined" != typeof TextDecoder
                  ? new TextDecoder("utf8")
                  : void 0,
              ue = (e, t, n) => {
                var r = t + n;
                for (n = t; e[n] && !(n >= r); ) ++n;
                if (16 < n - t && e.buffer && se)
                  return se.decode(e.subarray(t, n));
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
              le = [],
              ce = (e) => {
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
              he = (e, t, n, r) => {
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
            function fe(e, t) {
              var n = Array(ce(e) + 1);
              e = he(e, n, 0, n.length);
              t && (n.length = e);
              return n;
            }
            var de = [];
            function pe(e, t) {
              de[e] = { input: [], F: [], V: t };
              He(e, ve);
            }
            var ve = {
                open: function (e) {
                  var t = de[e.node.za];
                  if (!t) throw new Le(43);
                  e.s = t;
                  e.seekable = !1;
                },
                close: function (e) {
                  e.s.V.qa(e.s);
                },
                qa: function (e) {
                  e.s.V.qa(e.s);
                },
                read: function (e, t, n, r) {
                  if (!e.s || !e.s.V.jb) throw new Le(60);
                  for (var i = 0, a = 0; a < r; a++) {
                    try {
                      var o = e.s.V.jb(e.s);
                    } catch (e) {
                      throw new Le(29);
                    }
                    if (void 0 === o && 0 === i) throw new Le(6);
                    if (null === o || void 0 === o) break;
                    i++;
                    t[n + a] = o;
                  }
                  i && (e.node.timestamp = Date.now());
                  return i;
                },
                write: function (e, t, n, r) {
                  if (!e.s || !e.s.V.Oa) throw new Le(60);
                  try {
                    for (var i = 0; i < r; i++) e.s.V.Oa(e.s, t[n + i]);
                  } catch (e) {
                    throw new Le(29);
                  }
                  r && (e.node.timestamp = Date.now());
                  return i;
                },
              },
              me = {
                jb: function () {
                  e: {
                    if (!le.length) {
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
                      le = fe(e, !0);
                    }
                    e = le.shift();
                  }
                  return e;
                },
                Oa: function (e, t) {
                  null === t || 10 === t
                    ? (y(ue(e.F, 0)), (e.F = []))
                    : 0 != t && e.F.push(t);
                },
                qa: function (e) {
                  e.F && 0 < e.F.length && (y(ue(e.F, 0)), (e.F = []));
                },
                bc: function () {
                  return {
                    Fc: 25856,
                    Hc: 5,
                    Ec: 191,
                    Gc: 35387,
                    Dc: [
                      3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22,
                      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ],
                  };
                },
                cc: function () {
                  return 0;
                },
                dc: function () {
                  return [24, 80];
                },
              },
              be = {
                Oa: function (e, t) {
                  null === t || 10 === t
                    ? (w(ue(e.F, 0)), (e.F = []))
                    : 0 != t && e.F.push(t);
                },
                qa: function (e) {
                  e.F && 0 < e.F.length && (w(ue(e.F, 0)), (e.F = []));
                },
              };
            function ge(e, t) {
              var n = e.j ? e.j.length : 0;
              n >= t ||
                ((t = Math.max(t, (n * (1048576 > n ? 2 : 1.125)) >>> 0)),
                0 != n && (t = Math.max(t, 256)),
                (n = e.j),
                (e.j = new Uint8Array(t)),
                0 < e.v && e.j.set(n.subarray(0, e.v), 0));
            }
            var ye = {
              O: null,
              U() {
                return ye.createNode(null, "/", 16895, 0);
              },
              createNode(e, t, n, r) {
                if (24576 === (n & 61440) || 4096 === (n & 61440))
                  throw new Le(63);
                ye.O ||
                  (ye.O = {
                    dir: {
                      node: {
                        Y: ye.l.Y,
                        P: ye.l.P,
                        ka: ye.l.ka,
                        va: ye.l.va,
                        vb: ye.l.vb,
                        Bb: ye.l.Bb,
                        wb: ye.l.wb,
                        tb: ye.l.tb,
                        Ea: ye.l.Ea,
                      },
                      stream: { ba: ye.m.ba },
                    },
                    file: {
                      node: { Y: ye.l.Y, P: ye.l.P },
                      stream: {
                        ba: ye.m.ba,
                        read: ye.m.read,
                        write: ye.m.write,
                        pa: ye.m.pa,
                        mb: ye.m.mb,
                        ob: ye.m.ob,
                      },
                    },
                    link: {
                      node: { Y: ye.l.Y, P: ye.l.P, ma: ye.l.ma },
                      stream: {},
                    },
                    ab: { node: { Y: ye.l.Y, P: ye.l.P }, stream: ze },
                  });
                n = De(e, t, n, r);
                16384 === (n.mode & 61440)
                  ? ((n.l = ye.O.dir.node), (n.m = ye.O.dir.stream), (n.j = {}))
                  : 32768 === (n.mode & 61440)
                  ? ((n.l = ye.O.file.node),
                    (n.m = ye.O.file.stream),
                    (n.v = 0),
                    (n.j = null))
                  : 40960 === (n.mode & 61440)
                  ? ((n.l = ye.O.link.node), (n.m = ye.O.link.stream))
                  : 8192 === (n.mode & 61440) &&
                    ((n.l = ye.O.ab.node), (n.m = ye.O.ab.stream));
                n.timestamp = Date.now();
                e && ((e.j[t] = n), (e.timestamp = n.timestamp));
                return n;
              },
              Kc(e) {
                return e.j
                  ? e.j.subarray
                    ? e.j.subarray(0, e.v)
                    : new Uint8Array(e.j)
                  : new Uint8Array(0);
              },
              l: {
                Y(e) {
                  var t = {};
                  t.Jc = 8192 === (e.mode & 61440) ? e.id : 1;
                  t.Mc = e.id;
                  t.mode = e.mode;
                  t.Oc = 1;
                  t.uid = 0;
                  t.Lc = 0;
                  t.za = e.za;
                  16384 === (e.mode & 61440)
                    ? (t.size = 4096)
                    : 32768 === (e.mode & 61440)
                    ? (t.size = e.v)
                    : 40960 === (e.mode & 61440)
                    ? (t.size = e.link.length)
                    : (t.size = 0);
                  t.Bc = new Date(e.timestamp);
                  t.Nc = new Date(e.timestamp);
                  t.Ic = new Date(e.timestamp);
                  t.Jb = 4096;
                  t.Cc = Math.ceil(t.size / t.Jb);
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
                ka() {
                  throw ke[44];
                },
                va(e, t, n, r) {
                  return ye.createNode(e, t, n, r);
                },
                vb(e, t, n) {
                  if (16384 === (e.mode & 61440)) {
                    try {
                      var r = xe(t, n);
                    } catch (e) {}
                    if (r) for (var i in r.j) throw new Le(55);
                  }
                  delete e.parent.j[e.name];
                  e.parent.timestamp = Date.now();
                  e.name = n;
                  t.j[n] = e;
                  t.timestamp = e.parent.timestamp;
                  e.parent = t;
                },
                Bb(e, t) {
                  delete e.j[t];
                  e.timestamp = Date.now();
                },
                wb(e, t) {
                  var n,
                    r = xe(e, t);
                  for (n in r.j) throw new Le(55);
                  delete e.j[t];
                  e.timestamp = Date.now();
                },
                tb(e) {
                  var t,
                    n = [".", ".."];
                  for (t in e.j) e.j.hasOwnProperty(t) && n.push(t);
                  return n;
                },
                Ea(e, t, n) {
                  e = ye.createNode(e, t, 41471, 0);
                  e.link = n;
                  return e;
                },
                ma(e) {
                  if (40960 !== (e.mode & 61440)) throw new Le(28);
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
                  t.buffer === M.buffer && (a = !1);
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
                  ge(e, i + r);
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
                  if (0 > t) throw new Le(28);
                  return t;
                },
                pa(e, t, n) {
                  ge(e.node, t + n);
                  e.node.v = Math.max(e.node.v, t + n);
                },
                mb(e, t, n, r, i) {
                  if (32768 !== (e.node.mode & 61440)) throw new Le(43);
                  e = e.node.j;
                  if (i & 2 || e.buffer !== M.buffer) {
                    (0 < n || n + t < e.length) &&
                      (e = e.subarray
                        ? e.subarray(n, n + t)
                        : Array.prototype.slice.call(e, n, n + t));
                    n = !0;
                    N();
                    t = void 0;
                    if (!t) throw new Le(48);
                    M.set(e, t);
                  } else (n = !1), (t = e.byteOffset);
                  return { o: t, M: n };
                },
                ob(e, t, n, r) {
                  ye.m.write(e, t, 0, r, n, !1);
                  return 0;
                },
              },
            };
            function we(e, t) {
              var n = 0;
              e && (n |= 365);
              t && (n |= 146);
              return n;
            }
            var _e,
              Ae,
              Ce,
              Me,
              Pe = null,
              Ie = {},
              Ee = [],
              Re = 1,
              Te = null,
              Fe = !0,
              Le = null,
              ke = {},
              je = (e, t = {}) => {
                e = oe(e);
                if (!e) return { path: "", node: null };
                t = Object.assign({ hb: !0, Qa: 0 }, t);
                if (8 < t.Qa) throw new Le(32);
                e = e.split("/").filter((e) => !!e);
                for (var n = Pe, r = "/", i = 0; i < e.length; i++) {
                  var a = i === e.length - 1;
                  if (a && t.parent) break;
                  n = xe(n, e[i]);
                  r = te(r + "/" + e[i]);
                  n.wa && (!a || (a && t.hb)) && (n = n.wa.root);
                  if (!a || t.gb)
                    for (a = 0; 40960 === (n.mode & 61440); )
                      if (
                        ((n = Je(r)),
                        (r = oe(ne(r), n)),
                        (n = je(r, { Qa: t.Qa + 1 }).node),
                        40 < a++)
                      )
                        throw new Le(32);
                }
                return { path: r, node: n };
              },
              Se = (e) => {
                for (var t; ; ) {
                  if (e === e.parent)
                    return (
                      (e = e.U.nb),
                      t ? ("/" !== e[e.length - 1] ? `${e}/${t}` : e + t) : e
                    );
                  t = t ? `${e.name}/${t}` : e.name;
                  e = e.parent;
                }
              },
              Oe = (e, t) => {
                for (var n = 0, r = 0; r < t.length; r++)
                  n = ((n << 5) - n + t.charCodeAt(r)) | 0;
                return ((e + n) >>> 0) % Te.length;
              },
              xe = (e, t) => {
                var n;
                if ((n = (n = Ue(e, "x")) ? n : e.l.ka ? 0 : 2))
                  throw new Le(n, e);
                for (n = Te[Oe(e.id, t)]; n; n = n.lc) {
                  var r = n.name;
                  if (n.parent.id === e.id && r === t) return n;
                }
                return e.l.ka(e, t);
              },
              De = (e, t, n, r) => {
                e = new xn(e, t, n, r);
                t = Oe(e.parent.id, e.name);
                e.lc = Te[t];
                return (Te[t] = e);
              },
              We = (e) => {
                var t = ["r", "w", "rw"][e & 3];
                e & 512 && (t += "w");
                return t;
              },
              Ue = (e, t) =>
                Fe
                  ? 0
                  : !t.includes("r") || e.mode & 292
                  ? (t.includes("w") && !(e.mode & 146)) ||
                    (t.includes("x") && !(e.mode & 73))
                    ? 2
                    : 0
                  : 2,
              Ve = (e, t) => {
                try {
                  return xe(e, t), 20;
                } catch (e) {}
                return Ue(e, "wx");
              },
              Be = () => {
                for (var e = 0; 4096 >= e; e++) if (!Ee[e]) return e;
                throw new Le(33);
              },
              Ne = (e) => {
                e = Ee[e];
                if (!e) throw new Le(8);
                return e;
              },
              $e = (t, n = -1) => {
                Ce ||
                  ((Ce = function () {
                    (this || e).h = {};
                  }),
                  (Ce.prototype = {}),
                  Object.defineProperties(Ce.prototype, {
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
                t = Object.assign(new Ce(), t);
                -1 == n && (n = Be());
                t.X = n;
                return (Ee[n] = t);
              },
              ze = {
                open: (e) => {
                  e.m = Ie[e.node.za].m;
                  e.m.open && e.m.open(e);
                },
                ba: () => {
                  throw new Le(70);
                },
              },
              He = (e, t) => {
                Ie[e] = { m: t };
              },
              Ye = (e, t) => {
                var n = "/" === t,
                  r = !t;
                if (n && Pe) throw new Le(10);
                if (!n && !r) {
                  var i = je(t, { hb: !1 });
                  t = i.path;
                  i = i.node;
                  if (i.wa) throw new Le(10);
                  if (16384 !== (i.mode & 61440)) throw new Le(54);
                }
                t = { type: e, Qc: {}, nb: t, kc: [] };
                e = e.U(t);
                e.U = t;
                t.root = e;
                n ? (Pe = e) : i && ((i.wa = t), i.U && i.U.kc.push(t));
              },
              Xe = (e, t, n) => {
                var r = je(e, { parent: !0 }).node;
                e = re(e);
                if (!e || "." === e || ".." === e) throw new Le(28);
                var i = Ve(r, e);
                if (i) throw new Le(i);
                if (!r.l.va) throw new Le(63);
                return r.l.va(r, e, t, n);
              },
              Ge = (e, t, n) => {
                "undefined" == typeof n && ((n = t), (t = 438));
                Xe(e, t | 8192, n);
              },
              qe = (e, t) => {
                if (!oe(e)) throw new Le(44);
                var n = je(t, { parent: !0 }).node;
                if (!n) throw new Le(44);
                t = re(t);
                var r = Ve(n, t);
                if (r) throw new Le(r);
                if (!n.l.Ea) throw new Le(63);
                n.l.Ea(n, t, e);
              },
              Je = (e) => {
                e = je(e).node;
                if (!e) throw new Le(44);
                if (!e.l.ma) throw new Le(28);
                return oe(Se(e.parent), e.l.ma(e));
              },
              Ke = (e, t, n) => {
                if ("" === e) throw new Le(44);
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
                  e = te(e);
                  try {
                    i = je(e, { gb: !(t & 131072) }).node;
                  } catch (e) {}
                }
                r = !1;
                if (t & 64)
                  if (i) {
                    if (t & 128) throw new Le(20);
                  } else (i = Xe(e, n, 0)), (r = !0);
                if (!i) throw new Le(44);
                8192 === (i.mode & 61440) && (t &= -513);
                if (t & 65536 && 16384 !== (i.mode & 61440)) throw new Le(54);
                if (
                  !r &&
                  (n = i
                    ? 40960 === (i.mode & 61440)
                      ? 32
                      : 16384 === (i.mode & 61440) && ("r" !== We(t) || t & 512)
                      ? 31
                      : Ue(i, We(t))
                    : 44)
                )
                  throw new Le(n);
                if (t & 512 && !r) {
                  n = i;
                  n = "string" == typeof n ? je(n, { gb: !0 }).node : n;
                  if (!n.l.P) throw new Le(63);
                  if (16384 === (n.mode & 61440)) throw new Le(31);
                  if (32768 !== (n.mode & 61440)) throw new Le(28);
                  if ((r = Ue(n, "w"))) throw new Le(r);
                  n.l.P(n, { size: 0, timestamp: Date.now() });
                }
                t &= -131713;
                i = $e({
                  node: i,
                  path: Se(i),
                  flags: t,
                  seekable: !0,
                  position: 0,
                  m: i.m,
                  zc: [],
                  error: !1,
                });
                i.m.open && i.m.open(i);
                !a.logReadFiles ||
                  t & 1 ||
                  (Me || (Me = {}), e in Me || (Me[e] = 1));
                return i;
              },
              Ze = (e, t, n) => {
                if (null === e.X) throw new Le(8);
                if (!e.seekable || !e.m.ba) throw new Le(70);
                if (0 != n && 1 != n && 2 != n) throw new Le(28);
                e.position = e.m.ba(e, t, n);
                e.zc = [];
              },
              Qe = () => {
                Le ||
                  ((Le = function (t, n) {
                    (this || e).name = "ErrnoError";
                    (this || e).node = n;
                    (this || e).pc = function (t) {
                      (this || e).aa = t;
                    };
                    this.pc(t);
                    (this || e).message = "FS error";
                  }),
                  (Le.prototype = Error()),
                  (Le.prototype.constructor = Le),
                  [44].forEach((e) => {
                    ke[e] = new Le(e);
                    ke[e].stack = "<generic error, no stack>";
                  }));
              },
              et = (e, t, n) => {
                e = te("/dev/" + e);
                var r = we(!!t, !!n);
                Ae || (Ae = 64);
                var i = Ae++ << 8;
                He(i, {
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
                        throw new Le(29);
                      }
                      if (void 0 === s && 0 === a) throw new Le(6);
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
                        throw new Le(29);
                      }
                    i && (e.node.timestamp = Date.now());
                    return a;
                  },
                });
                Ge(e, r, i);
              },
              tt = {},
              nt = void 0;
            function rt() {
              nt += 4;
              return R[(nt - 4) >> 2];
            }
            function it(e) {
              if (void 0 === e) return "_unknown";
              e = e.replace(/[^a-zA-Z0-9_]/g, "$");
              var t = e.charCodeAt(0);
              return 48 <= t && 57 >= t ? `_${e}` : e;
            }
            function at(t, n) {
              t = it(t);
              return {
                [t]: function () {
                  return n.apply(this || e, arguments);
                },
              }[t];
            }
            function ot() {
              (this || e).M = [void 0];
              (this || e).ib = [];
            }
            var st = new ot(),
              ut = void 0;
            function lt(e) {
              throw new ut(e);
            }
            var ct = (e) => {
                e || lt("Cannot use deleted val. handle = " + e);
                return st.get(e).value;
              },
              ht = (e) => {
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
                    return st.pa({ ub: 1, value: e });
                }
              };
            function ft(t) {
              var n = Error,
                r = at(t, function (n) {
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
            var dt = void 0,
              pt = void 0;
            function vt(e) {
              for (var t = ""; P[e]; ) t += pt[P[e++]];
              return t;
            }
            var mt = [];
            function bt() {
              for (; mt.length; ) {
                var e = mt.pop();
                e.g.fa = !1;
                e.delete();
              }
            }
            var gt = void 0,
              yt = {};
            function wt(e, t) {
              for (void 0 === t && lt("ptr should not be undefined"); e.A; )
                (t = e.na(t)), (e = e.A);
              return t;
            }
            var _t = {};
            function At(e) {
              e = Yn(e);
              var t = vt(e);
              Vn(e);
              return t;
            }
            function Ct(e, t) {
              var n = _t[e];
              void 0 === n && lt(t + " has unknown type " + At(e));
              return n;
            }
            function Mt() {}
            var Pt = !1;
            function It(e) {
              --e.count.value;
              0 === e.count.value && (e.G ? e.L.W(e.G) : e.u.i.W(e.o));
            }
            function Et(e, t, n) {
              if (t === n) return e;
              if (void 0 === n.A) return null;
              e = Et(e, t, n.A);
              return null === e ? null : n.Pb(e);
            }
            var Rt = {};
            function Tt(e, t) {
              t = wt(e, t);
              return yt[t];
            }
            var Ft = void 0;
            function Lt(e) {
              throw new Ft(e);
            }
            function kt(e, t) {
              (t.u && t.o) || Lt("makeClassHandle requires ptr and ptrType");
              !!t.L !== !!t.G &&
                Lt("Both smartPtrType and smartPtr must be specified");
              t.count = { value: 1 };
              return jt(Object.create(e, { g: { value: t } }));
            }
            function jt(e) {
              if ("undefined" === typeof FinalizationRegistry)
                return (jt = (e) => e), e;
              Pt = new FinalizationRegistry((e) => {
                It(e.g);
              });
              jt = (e) => {
                var t = e.g;
                t.G && Pt.register(e, { g: t }, e);
                return e;
              };
              Mt = (e) => {
                Pt.unregister(e);
              };
              return jt(e);
            }
            var St = {};
            function Ot(e) {
              for (; e.length; ) {
                var t = e.pop();
                e.pop()(t);
              }
            }
            function xt(e) {
              return this.fromWireType(R[e >> 2]);
            }
            var Dt = {},
              Wt = {};
            function Ut(e, t, n) {
              function r(t) {
                t = n(t);
                t.length !== e.length && Lt("Mismatched type converter count");
                for (var r = 0; r < e.length; ++r) Nt(e[r], t[r]);
              }
              e.forEach(function (e) {
                Wt[e] = t;
              });
              var i = Array(t.length),
                a = [],
                o = 0;
              t.forEach((e, t) => {
                _t.hasOwnProperty(e)
                  ? (i[t] = _t[e])
                  : (a.push(e),
                    Dt.hasOwnProperty(e) || (Dt[e] = []),
                    Dt[e].push(() => {
                      i[t] = _t[e];
                      ++o;
                      o === a.length && r(i);
                    }));
              });
              0 === a.length && r(i);
            }
            function Vt(e) {
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
            function Bt(e, t, n = {}) {
              var r = t.name;
              e ||
                lt(`type "${r}" must have a positive integer typeid pointer`);
              if (_t.hasOwnProperty(e)) {
                if (n.$b) return;
                lt(`Cannot register type '${r}' twice`);
              }
              _t[e] = t;
              delete Wt[e];
              Dt.hasOwnProperty(e) &&
                ((t = Dt[e]), delete Dt[e], t.forEach((e) => e()));
            }
            function Nt(e, t, n = {}) {
              if (!("argPackAdvance" in t))
                throw new TypeError(
                  "registerType registeredInstance requires argPackAdvance"
                );
              Bt(e, t, n);
            }
            function $t(e) {
              lt(e.g.u.i.name + " instance already deleted");
            }
            function zt() {}
            function Ht(t, n, r) {
              if (void 0 === t[n].B) {
                var i = t[n];
                t[n] = function () {
                  t[n].B.hasOwnProperty(arguments.length) ||
                    lt(
                      `Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${t[n].B})!`
                    );
                  return t[n].B[arguments.length].apply(this || e, arguments);
                };
                t[n].B = [];
                t[n].B[i.ea] = i;
              }
            }
            function Yt(e, t, n) {
              a.hasOwnProperty(e)
                ? ((void 0 === n ||
                    (void 0 !== a[e].B && void 0 !== a[e].B[n])) &&
                    lt(`Cannot register public name '${e}' twice`),
                  Ht(a, e, e),
                  a.hasOwnProperty(n) &&
                    lt(
                      `Cannot register multiple overloads of a function with the same number of arguments (${n})!`
                    ),
                  (a[e].B[n] = t))
                : ((a[e] = t), void 0 !== n && (a[e].Pc = n));
            }
            function Xt(t, n, r, i, a, o, s, u) {
              (this || e).name = t;
              (this || e).constructor = n;
              (this || e).N = r;
              (this || e).W = i;
              (this || e).A = a;
              (this || e).Ub = o;
              (this || e).na = s;
              (this || e).Pb = u;
              (this || e).rb = [];
            }
            function Gt(e, t, n) {
              for (; t !== n; )
                t.na ||
                  lt(
                    `Expected null or instance of ${n.name}, got an instance of ${t.name}`
                  ),
                  (e = t.na(e)),
                  (t = t.A);
              return e;
            }
            function qt(t, n) {
              if (null === n)
                return (
                  (this || e).Na &&
                    lt(`null is not a valid ${(this || e).name}`),
                  0
                );
              n.g || lt(`Cannot pass "${fn(n)}" as a ${(this || e).name}`);
              n.g.o ||
                lt(
                  `Cannot pass deleted object as a pointer of type ${
                    (this || e).name
                  }`
                );
              return Gt(n.g.o, n.g.u.i, (this || e).i);
            }
            function Jt(t, n) {
              if (null === n) {
                (this || e).Na && lt(`null is not a valid ${(this || e).name}`);
                if ((this || e).ua) {
                  var r = this.Pa();
                  null !== t && t.push((this || e).W, r);
                  return r;
                }
                return 0;
              }
              n.g || lt(`Cannot pass "${fn(n)}" as a ${(this || e).name}`);
              n.g.o ||
                lt(
                  `Cannot pass deleted object as a pointer of type ${
                    (this || e).name
                  }`
                );
              !(this || e).ta &&
                n.g.u.ta &&
                lt(
                  `Cannot convert argument of type ${
                    n.g.L ? n.g.L.name : n.g.u.name
                  } to parameter type ${(this || e).name}`
                );
              r = Gt(n.g.o, n.g.u.i, (this || e).i);
              if ((this || e).ua)
                switch (
                  (void 0 === n.g.G &&
                    lt("Passing raw pointer to smart pointer is illegal"),
                  (this || e).tc)
                ) {
                  case 0:
                    n.g.L === (this || e)
                      ? (r = n.g.G)
                      : lt(
                          `Cannot convert argument of type ${
                            n.g.L ? n.g.L.name : n.g.u.name
                          } to parameter type ${(this || e).name}`
                        );
                    break;
                  case 1:
                    r = n.g.G;
                    break;
                  case 2:
                    if (n.g.L === (this || e)) r = n.g.G;
                    else {
                      var i = n.clone();
                      r = this.oc(
                        r,
                        ht(function () {
                          i.delete();
                        })
                      );
                      null !== t && t.push((this || e).W, r);
                    }
                    break;
                  default:
                    lt("Unsupporting sharing policy");
                }
              return r;
            }
            function Kt(t, n) {
              if (null === n)
                return (
                  (this || e).Na &&
                    lt(`null is not a valid ${(this || e).name}`),
                  0
                );
              n.g || lt(`Cannot pass "${fn(n)}" as a ${(this || e).name}`);
              n.g.o ||
                lt(
                  `Cannot pass deleted object as a pointer of type ${
                    (this || e).name
                  }`
                );
              n.g.u.ta &&
                lt(
                  `Cannot convert argument of type ${
                    n.g.u.name
                  } to parameter type ${(this || e).name}`
                );
              return Gt(n.g.o, n.g.u.i, (this || e).i);
            }
            function Zt(t, n, r, i) {
              (this || e).name = t;
              (this || e).i = n;
              (this || e).Na = r;
              (this || e).ta = i;
              (this || e).ua = !1;
              (this || e).W =
                (this || e).oc =
                (this || e).Pa =
                (this || e).sb =
                (this || e).tc =
                (this || e).nc =
                  void 0;
              void 0 !== n.A
                ? ((this || e).toWireType = Jt)
                : (((this || e).toWireType = i ? qt : Kt),
                  ((this || e).K = null));
            }
            function Qt(e, t, n) {
              a.hasOwnProperty(e) || Lt("Replacing nonexistant public symbol");
              void 0 !== a[e].B && void 0 !== n
                ? (a[e].B[n] = t)
                : ((a[e] = t), (a[e].ea = n));
            }
            var en = [],
              tn = (e) => {
                var t = en[e];
                t ||
                  (e >= en.length && (en.length = e + 1),
                  (en[e] = t = S.get(e)));
                return t;
              },
              nn = (e, t) => {
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
                  } else r = tn(t).apply(null, n);
                  return r;
                };
              };
            function rn(e, t) {
              e = vt(e);
              var n = e.includes("j") ? nn(e, t) : tn(t);
              "function" != typeof n &&
                lt(`unknown function pointer with signature ${e}: ${t}`);
              return n;
            }
            var an = void 0;
            function on(e, t) {
              function n(e) {
                i[e] ||
                  _t[e] ||
                  (Wt[e] ? Wt[e].forEach(n) : (r.push(e), (i[e] = !0)));
              }
              var r = [],
                i = {};
              t.forEach(n);
              throw new an(`${e}: ` + r.map(At).join([", "]));
            }
            function sn(t, n, r, i, a) {
              var o = n.length;
              2 > o &&
                lt(
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
                h = Array(c),
                f = [],
                d = [];
              return function () {
                arguments.length !== c &&
                  lt(
                    `function ${t} called with ${arguments.length} arguments, expected ${c} args!`
                  );
                d.length = 0;
                f.length = s ? 2 : 1;
                f[0] = a;
                if (s) {
                  var r = n[1].toWireType(d, this || e);
                  f[1] = r;
                }
                for (var o = 0; o < c; ++o)
                  (h[o] = n[o + 2].toWireType(d, arguments[o])), f.push(h[o]);
                o = i.apply(null, f);
                if (u) Ot(d);
                else
                  for (var p = s ? 1 : 2; p < n.length; p++) {
                    var v = 1 === p ? r : h[p - 2];
                    null !== n[p].K && n[p].K(v);
                  }
                r = l ? n[0].fromWireType(o) : void 0;
                return r;
              };
            }
            function un(e, t) {
              for (var n = [], r = 0; r < e; r++) n.push(T[(t + 4 * r) >> 2]);
              return n;
            }
            function ln(e, t, n) {
              e instanceof Object || lt(`${n} with invalid "this": ${e}`);
              e instanceof t.i.constructor ||
                lt(
                  `${n} incompatible with "this" of type ${e.constructor.name}`
                );
              e.g.o ||
                lt(
                  `cannot call emscripten binding method ${n} on deleted object`
                );
              return Gt(e.g.o, e.g.u.i, t.i);
            }
            function cn(e) {
              e >= st.h && 0 === --st.get(e).ub && st.Zb(e);
            }
            function hn(e, t, n) {
              switch (t) {
                case 0:
                  return function (e) {
                    return this.fromWireType((n ? M : P)[e]);
                  };
                case 1:
                  return function (e) {
                    return this.fromWireType((n ? I : E)[e >> 1]);
                  };
                case 2:
                  return function (e) {
                    return this.fromWireType((n ? R : T)[e >> 2]);
                  };
                default:
                  throw new TypeError("Unknown integer type: " + e);
              }
            }
            function fn(e) {
              if (null === e) return "null";
              var t = typeof e;
              return "object" === t || "array" === t || "function" === t
                ? e.toString()
                : "" + e;
            }
            function dn(e, t) {
              switch (t) {
                case 2:
                  return function (e) {
                    return this.fromWireType(F[e >> 2]);
                  };
                case 3:
                  return function (e) {
                    return this.fromWireType(L[e >> 3]);
                  };
                default:
                  throw new TypeError("Unknown float type: " + e);
              }
            }
            function pn(e, t, n) {
              switch (t) {
                case 0:
                  return n
                    ? function (e) {
                        return M[e];
                      }
                    : function (e) {
                        return P[e];
                      };
                case 1:
                  return n
                    ? function (e) {
                        return I[e >> 1];
                      }
                    : function (e) {
                        return E[e >> 1];
                      };
                case 2:
                  return n
                    ? function (e) {
                        return R[e >> 2];
                      }
                    : function (e) {
                        return T[e >> 2];
                      };
                default:
                  throw new TypeError("Unknown integer type: " + e);
              }
            }
            var vn =
                "undefined" != typeof TextDecoder
                  ? new TextDecoder("utf-16le")
                  : void 0,
              mn = (e, t) => {
                var n = e >> 1;
                for (var r = n + t / 2; !(n >= r) && E[n]; ) ++n;
                n <<= 1;
                if (32 < n - e && vn) return vn.decode(P.subarray(e, n));
                n = "";
                for (r = 0; !(r >= t / 2); ++r) {
                  var i = I[(e + 2 * r) >> 1];
                  if (0 == i) break;
                  n += String.fromCharCode(i);
                }
                return n;
              },
              bn = (e, t, n) => {
                void 0 === n && (n = 2147483647);
                if (2 > n) return 0;
                n -= 2;
                var r = t;
                n = n < 2 * e.length ? n / 2 : e.length;
                for (var i = 0; i < n; ++i)
                  (I[t >> 1] = e.charCodeAt(i)), (t += 2);
                I[t >> 1] = 0;
                return t - r;
              },
              gn = (e) => 2 * e.length,
              yn = (e, t) => {
                for (var n = 0, r = ""; !(n >= t / 4); ) {
                  var i = R[(e + 4 * n) >> 2];
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
              wn = (e, t, n) => {
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
                  R[t >> 2] = a;
                  t += 4;
                  if (t + 4 > n) break;
                }
                R[t >> 2] = 0;
                return t - r;
              },
              _n = (e) => {
                for (var t = 0, n = 0; n < e.length; ++n) {
                  var r = e.charCodeAt(n);
                  55296 <= r && 57343 >= r && ++n;
                  t += 4;
                }
                return t;
              },
              An = {};
            function Cn(e) {
              var t = An[e];
              return void 0 === t ? vt(e) : t;
            }
            var Mn = [];
            function Pn(e) {
              var t = Mn.length;
              Mn.push(e);
              return t;
            }
            function In(e, t) {
              for (var n = Array(e), r = 0; r < e; ++r)
                n[r] = Ct(T[(t + 4 * r) >> 2], "parameter " + r);
              return n;
            }
            var En,
              Rn = [],
              Tn = [],
              Fn = {},
              Ln = () => {
                if (!En) {
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
                      _: v || "./this.program",
                    };
                  for (e in Fn) void 0 === Fn[e] ? delete t[e] : (t[e] = Fn[e]);
                  var n = [];
                  for (e in t) n.push(`${e}=${t[e]}`);
                  En = n;
                }
                return En;
              },
              kn = (e) => 0 === e % 4 && (0 !== e % 100 || 0 === e % 400),
              jn = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
              Sn = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
              On = (e, t, n, r) => {
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
                  var t = e.ca;
                  for (
                    e = new Date(new Date(e.da + 1900, 0, 1).getTime());
                    0 < t;

                  ) {
                    var n = e.getMonth(),
                      r = (kn(e.getFullYear()) ? jn : Sn)[n];
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
                var l = R[(r + 40) >> 2];
                r = {
                  wc: R[r >> 2],
                  vc: R[(r + 4) >> 2],
                  Fa: R[(r + 8) >> 2],
                  Sa: R[(r + 12) >> 2],
                  Ga: R[(r + 16) >> 2],
                  da: R[(r + 20) >> 2],
                  R: R[(r + 24) >> 2],
                  ca: R[(r + 28) >> 2],
                  Rc: R[(r + 32) >> 2],
                  uc: R[(r + 36) >> 2],
                  xc: l && l ? ue(P, l) : "",
                };
                n = n ? ue(P, n) : "";
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
                var h =
                    "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
                      " "
                    ),
                  f =
                    "January February March April May June July August September October November December".split(
                      " "
                    );
                l = {
                  "%a": (e) => h[e.R].substring(0, 3),
                  "%A": (e) => h[e.R],
                  "%b": (e) => f[e.Ga].substring(0, 3),
                  "%B": (e) => f[e.Ga],
                  "%C": (e) => a(((e.da + 1900) / 100) | 0, 2),
                  "%d": (e) => a(e.Sa, 2),
                  "%e": (e) => i(e.Sa, 2, " "),
                  "%g": (e) => u(e).toString().substring(2),
                  "%G": (e) => u(e),
                  "%H": (e) => a(e.Fa, 2),
                  "%I": (e) => {
                    e = e.Fa;
                    0 == e ? (e = 12) : 12 < e && (e -= 12);
                    return a(e, 2);
                  },
                  "%j": (e) => {
                    for (
                      var t = 0, n = 0;
                      n <= e.Ga - 1;
                      t += (kn(e.da + 1900) ? jn : Sn)[n++]
                    );
                    return a(e.Sa + t, 3);
                  },
                  "%m": (e) => a(e.Ga + 1, 2),
                  "%M": (e) => a(e.vc, 2),
                  "%n": () => "\n",
                  "%p": (e) => (0 <= e.Fa && 12 > e.Fa ? "AM" : "PM"),
                  "%S": (e) => a(e.wc, 2),
                  "%t": () => "\t",
                  "%u": (e) => e.R || 7,
                  "%U": (e) => a(Math.floor((e.ca + 7 - e.R) / 7), 2),
                  "%V": (e) => {
                    var t = Math.floor((e.ca + 7 - ((e.R + 6) % 7)) / 7);
                    2 >= (e.R + 371 - e.ca - 2) % 7 && t++;
                    if (t)
                      53 == t &&
                        ((n = (e.R + 371 - e.ca) % 7),
                        4 == n || (3 == n && kn(e.da)) || (t = 1));
                    else {
                      t = 52;
                      var n = (e.R + 7 - e.ca - 1) % 7;
                      (4 == n || (5 == n && kn((e.da % 400) - 1))) && t++;
                    }
                    return a(t, 2);
                  },
                  "%w": (e) => e.R,
                  "%W": (e) =>
                    a(Math.floor((e.ca + 7 - ((e.R + 6) % 7)) / 7), 2),
                  "%y": (e) => (e.da + 1900).toString().substring(2),
                  "%Y": (e) => e.da + 1900,
                  "%z": (e) => {
                    e = e.uc;
                    var t = 0 <= e;
                    e = Math.abs(e) / 60;
                    return (
                      (t ? "+" : "-") +
                      String("0000" + ((e / 60) * 100 + (e % 60))).slice(-4)
                    );
                  },
                  "%Z": (e) => e.xc,
                  "%%": () => "%",
                };
                n = n.replace(/%%/g, "\0\0");
                for (c in l)
                  n.includes(c) && (n = n.replace(new RegExp(c, "g"), l[c](r)));
                n = n.replace(/\0\0/g, "%");
                c = fe(n, !1);
                if (c.length > t) return 0;
                M.set(c, e);
                return c.length - 1;
              };
            function xn(t, n, r, i) {
              t || (t = this || e);
              (this || e).parent = t;
              (this || e).U = t.U;
              (this || e).wa = null;
              (this || e).id = Re++;
              (this || e).name = n;
              (this || e).mode = r;
              (this || e).l = {};
              (this || e).m = {};
              (this || e).za = i;
            }
            Object.defineProperties(xn.prototype, {
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
            Qe();
            Te = Array(4096);
            Ye(ye, "/");
            Xe("/tmp", 16895, 0);
            Xe("/home", 16895, 0);
            Xe("/home/web_user", 16895, 0);
            (() => {
              Xe("/dev", 16895, 0);
              He(259, { read: () => 0, write: (e, t, n, r) => r });
              Ge("/dev/null", 259);
              pe(1280, me);
              pe(1536, be);
              Ge("/dev/tty", 1280);
              Ge("/dev/tty1", 1536);
              var e = new Uint8Array(1024),
                t = 0,
                n = () => {
                  0 === t && (t = ae(e).byteLength);
                  return e[--t];
                };
              et("random", n);
              et("urandom", n);
              Xe("/dev/shm", 16895, 0);
              Xe("/dev/shm/tmp", 16895, 0);
            })();
            (() => {
              Xe("/proc", 16895, 0);
              var e = Xe("/proc/self", 16895, 0);
              Xe("/proc/self/fd", 16895, 0);
              Ye(
                {
                  U: () => {
                    var t = De(e, "fd", 16895, 73);
                    t.l = {
                      ka: (e, t) => {
                        var n = Ne(+t);
                        e = {
                          parent: null,
                          U: { nb: "fake" },
                          l: { ma: () => n.path },
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
            Object.assign(ot.prototype, {
              get(t) {
                return (this || e).M[t];
              },
              has(t) {
                return void 0 !== (this || e).M[t];
              },
              pa(t) {
                var n = (this || e).ib.pop() || (this || e).M.length;
                (this || e).M[n] = t;
                return n;
              },
              Zb(t) {
                (this || e).M[t] = void 0;
                (this || e).ib.push(t);
              },
            });
            ut = a.BindingError = class extends Error {
              constructor(e) {
                super(e);
                this.name = "BindingError";
              }
            };
            st.M.push(
              { value: void 0 },
              { value: null },
              { value: !0 },
              { value: !1 }
            );
            st.h = st.M.length;
            a.count_emval_handles = function () {
              for (var e = 0, t = st.h; t < st.M.length; ++t)
                void 0 !== st.M[t] && ++e;
              return e;
            };
            dt = a.PureVirtualError = ft("PureVirtualError");
            for (var Dn = Array(256), Wn = 0; 256 > Wn; ++Wn)
              Dn[Wn] = String.fromCharCode(Wn);
            pt = Dn;
            a.getInheritedInstanceCount = function () {
              return Object.keys(yt).length;
            };
            a.getLiveInheritedInstances = function () {
              var e,
                t = [];
              for (e in yt) yt.hasOwnProperty(e) && t.push(yt[e]);
              return t;
            };
            a.flushPendingDeletes = bt;
            a.setDelayFunction = function (e) {
              gt = e;
              mt.length && gt && gt(bt);
            };
            Ft = a.InternalError = class extends Error {
              constructor(e) {
                super(e);
                this.name = "InternalError";
              }
            };
            zt.prototype.isAliasOf = function (t) {
              if (!((this || e) instanceof zt && t instanceof zt)) return !1;
              var n = (this || e).g.u.i,
                r = (this || e).g.o,
                i = t.g.u.i;
              for (t = t.g.o; n.A; ) (r = n.na(r)), (n = n.A);
              for (; i.A; ) (t = i.na(t)), (i = i.A);
              return n === i && r === t;
            };
            zt.prototype.clone = function () {
              (this || e).g.o || $t(this || e);
              if ((this || e).g.ia)
                return ((this || e).g.count.value += 1), this || e;
              var t = jt,
                n = Object,
                r = n.create,
                i = Object.getPrototypeOf(this || e),
                a = (this || e).g;
              t = t(
                r.call(n, i, {
                  g: {
                    value: {
                      count: a.count,
                      fa: a.fa,
                      ia: a.ia,
                      o: a.o,
                      u: a.u,
                      G: a.G,
                      L: a.L,
                    },
                  },
                })
              );
              t.g.count.value += 1;
              t.g.fa = !1;
              return t;
            };
            zt.prototype.delete = function () {
              (this || e).g.o || $t(this || e);
              (this || e).g.fa &&
                !(this || e).g.ia &&
                lt("Object already scheduled for deletion");
              Mt(this || e);
              It((this || e).g);
              (this || e).g.ia ||
                (((this || e).g.G = void 0), ((this || e).g.o = void 0));
            };
            zt.prototype.isDeleted = function () {
              return !(this || e).g.o;
            };
            zt.prototype.deleteLater = function () {
              (this || e).g.o || $t(this || e);
              (this || e).g.fa &&
                !(this || e).g.ia &&
                lt("Object already scheduled for deletion");
              mt.push(this || e);
              1 === mt.length && gt && gt(bt);
              (this || e).g.fa = !0;
              return this || e;
            };
            Zt.prototype.Vb = function (t) {
              (this || e).sb && (t = this.sb(t));
              return t;
            };
            Zt.prototype.bb = function (t) {
              (this || e).W && this.W(t);
            };
            Zt.prototype.argPackAdvance = 8;
            Zt.prototype.readValueFromPointer = xt;
            Zt.prototype.deleteObject = function (e) {
              null !== e && e.delete();
            };
            Zt.prototype.fromWireType = function (t) {
              function n() {
                return (this || e).ua
                  ? kt((this || e).i.N, {
                      u: (this || e).nc,
                      o: r,
                      L: this || e,
                      G: t,
                    })
                  : kt((this || e).i.N, { u: this || e, o: t });
              }
              var r = this.Vb(t);
              if (!r) return this.bb(t), null;
              var i = Tt((this || e).i, r);
              if (void 0 !== i) {
                if (0 === i.g.count.value)
                  return (i.g.o = r), (i.g.G = t), i.clone();
                i = i.clone();
                this.bb(t);
                return i;
              }
              i = (this || e).i.Ub(r);
              i = Rt[i];
              if (!i) return n.call(this || e);
              i = (this || e).ta ? i.Kb : i.pointerType;
              var a = Et(r, (this || e).i, i.i);
              return null === a
                ? n.call(this || e)
                : (this || e).ua
                ? kt(i.i.N, { u: i, o: a, L: this || e, G: t })
                : kt(i.i.N, { u: i, o: a });
            };
            an = a.UnboundTypeError = ft("UnboundTypeError");
            var Un = {
              __syscall_fcntl64: function (e, t, n) {
                nt = n;
                try {
                  var r = Ne(e);
                  switch (t) {
                    case 0:
                      var i = rt();
                      return 0 > i ? -28 : $e(r, i).X;
                    case 1:
                    case 2:
                      return 0;
                    case 3:
                      return r.flags;
                    case 4:
                      return (i = rt()), (r.flags |= i), 0;
                    case 5:
                      return (i = rt()), (I[(i + 0) >> 1] = 2), 0;
                    case 6:
                    case 7:
                      return 0;
                    case 16:
                    case 8:
                      return -28;
                    case 9:
                      return (R[Nn() >> 2] = 28), -1;
                    default:
                      return -28;
                  }
                } catch (e) {
                  if ("undefined" == typeof tt || "ErrnoError" !== e.name)
                    throw e;
                  return -e.aa;
                }
              },
              __syscall_ioctl: function (e, t, n) {
                nt = n;
                try {
                  var r = Ne(e);
                  switch (t) {
                    case 21509:
                      return r.s ? 0 : -59;
                    case 21505:
                      if (!r.s) return -59;
                      if (r.s.V.bc) {
                        t = [
                          3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23,
                          22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        ];
                        var i = rt();
                        R[i >> 2] = 25856;
                        R[(i + 4) >> 2] = 5;
                        R[(i + 8) >> 2] = 191;
                        R[(i + 12) >> 2] = 35387;
                        for (var a = 0; 32 > a; a++)
                          M[(i + a + 17) | 0] = t[a] || 0;
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
                      if (r.s.V.cc)
                        for (i = rt(), t = [], a = 0; 32 > a; a++)
                          t.push(M[(i + a + 17) | 0]);
                      return 0;
                    case 21519:
                      if (!r.s) return -59;
                      i = rt();
                      return (R[i >> 2] = 0);
                    case 21520:
                      return r.s ? -28 : -59;
                    case 21531:
                      i = rt();
                      if (!r.m.ac) throw new Le(59);
                      return r.m.ac(r, t, i);
                    case 21523:
                      if (!r.s) return -59;
                      r.s.V.dc &&
                        ((a = [24, 80]),
                        (i = rt()),
                        (I[i >> 1] = a[0]),
                        (I[(i + 2) >> 1] = a[1]));
                      return 0;
                    case 21524:
                      return r.s ? 0 : -59;
                    case 21515:
                      return r.s ? 0 : -59;
                    default:
                      return -28;
                  }
                } catch (e) {
                  if ("undefined" == typeof tt || "ErrnoError" !== e.name)
                    throw e;
                  return -e.aa;
                }
              },
              __syscall_openat: function (e, t, n, r) {
                nt = r;
                try {
                  t = t ? ue(P, t) : "";
                  var i = t;
                  if ("/" === i.charAt(0)) t = i;
                  else {
                    var a = -100 === e ? "/" : Ne(e).path;
                    if (0 == i.length) throw new Le(44);
                    t = te(a + "/" + i);
                  }
                  var o = r ? rt() : 0;
                  return Ke(t, n, o).X;
                } catch (e) {
                  if ("undefined" == typeof tt || "ErrnoError" !== e.name)
                    throw e;
                  return -e.aa;
                }
              },
              _embind_create_inheriting_constructor: function (t, n, r) {
                t = vt(t);
                n = Ct(n, "wrapper");
                r = ct(r);
                var i = [].slice,
                  a = n.i,
                  o = a.N,
                  s = a.A.N,
                  u = a.A.constructor;
                t = at(t, function () {
                  a.A.rb.forEach(
                    function (t) {
                      if ((this || e)[t] === s[t])
                        throw new dt(
                          `Pure virtual function ${t} must be implemented in JavaScript`
                        );
                    }.bind(this || e)
                  );
                  Object.defineProperty(this || e, "__parent", { value: o });
                  (this || e).__construct.apply(this || e, i.call(arguments));
                });
                o.__construct = function () {
                  (this || e) === o && lt("Pass correct 'this' to __construct");
                  var t = u.implement.apply(
                    void 0,
                    [this || e].concat(i.call(arguments))
                  );
                  Mt(t);
                  var n = t.g;
                  t.notifyOnDestruction();
                  n.ia = !0;
                  Object.defineProperties(this || e, { g: { value: n } });
                  jt(this || e);
                  t = n.o;
                  t = wt(a, t);
                  yt.hasOwnProperty(t)
                    ? lt(`Tried to register registered instance: ${t}`)
                    : (yt[t] = this || e);
                };
                o.__destruct = function () {
                  (this || e) === o && lt("Pass correct 'this' to __destruct");
                  Mt(this || e);
                  var t = (this || e).g.o;
                  t = wt(a, t);
                  yt.hasOwnProperty(t)
                    ? delete yt[t]
                    : lt(`Tried to unregister unregistered instance: ${t}`);
                };
                t.prototype = Object.create(o);
                for (var l in r) t.prototype[l] = r[l];
                return ht(t);
              },
              _embind_finalize_value_object: function (e) {
                var t = St[e];
                delete St[e];
                var n = t.Pa,
                  r = t.W,
                  i = t.fb,
                  a = i.map((e) => e.Yb).concat(i.map((e) => e.rc));
                Ut([e], a, (e) => {
                  var a = {};
                  i.forEach((t, n) => {
                    var r = e[n],
                      o = t.Wb,
                      s = t.Xb,
                      u = e[n + i.length],
                      l = t.qc,
                      c = t.sc;
                    a[t.Sb] = {
                      read: (e) => r.fromWireType(o(s, e)),
                      write: (e, t) => {
                        var n = [];
                        l(c, e, u.toWireType(n, t));
                        Ot(n);
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
                      readValueFromPointer: xt,
                      K: r,
                    },
                  ];
                });
              },
              _embind_register_bigint: function () {},
              _embind_register_bool: function (e, t, n, r, i) {
                var a = Vt(n);
                t = vt(t);
                Nt(e, {
                  name: t,
                  fromWireType: function (e) {
                    return !!e;
                  },
                  toWireType: function (e, t) {
                    return t ? r : i;
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: function (e) {
                    if (1 === n) var r = M;
                    else if (2 === n) r = I;
                    else {
                      if (4 !== n)
                        throw new TypeError("Unknown boolean type size: " + t);
                      r = R;
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
                h,
                f,
                d
              ) {
                h = vt(h);
                o = rn(a, o);
                u && (u = rn(s, u));
                c && (c = rn(l, c));
                d = rn(f, d);
                var p = it(h);
                Yt(p, function () {
                  on(`Cannot construct ${h} due to unbound types`, [i]);
                });
                Ut([t, n, r], i ? [i] : [], function (n) {
                  n = n[0];
                  if (i) {
                    var r = n.i;
                    var a = r.N;
                  } else a = zt.prototype;
                  n = at(p, function () {
                    if (Object.getPrototypeOf(this || e) !== s)
                      throw new ut("Use 'new' to construct " + h);
                    if (void 0 === l.$)
                      throw new ut(h + " has no accessible constructor");
                    var t = l.$[arguments.length];
                    if (void 0 === t)
                      throw new ut(
                        `Tried to invoke ctor of ${h} with invalid number of parameters (${
                          arguments.length
                        }) - expected (${Object.keys(
                          l.$
                        ).toString()}) parameters instead!`
                      );
                    return t.apply(this || e, arguments);
                  });
                  var s = Object.create(a, { constructor: { value: n } });
                  n.prototype = s;
                  var l = new Xt(h, n, s, d, r, o, u, c);
                  l.A && (void 0 === l.A.oa && (l.A.oa = []), l.A.oa.push(l));
                  r = new Zt(h, l, !0, !1);
                  a = new Zt(h + "*", l, !1, !1);
                  var f = new Zt(h + " const*", l, !1, !0);
                  Rt[t] = { pointerType: a, Kb: f };
                  Qt(p, n);
                  return [r, a, f];
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
                var s = un(n, r);
                t = vt(t);
                a = rn(i, a);
                Ut([], [e], function (e) {
                  function r() {
                    on(`Cannot call ${i} due to unbound types`, s);
                  }
                  e = e[0];
                  var i = `${e.name}.${t}`;
                  t.startsWith("@@") && (t = Symbol[t.substring(2)]);
                  var u = e.i.constructor;
                  void 0 === u[t]
                    ? ((r.ea = n - 1), (u[t] = r))
                    : (Ht(u, t, i), (u[t].B[n - 1] = r));
                  Ut([], s, function (r) {
                    r = sn(i, [r[0], null].concat(r.slice(1)), null, a, o);
                    void 0 === u[t].B
                      ? ((r.ea = n - 1), (u[t] = r))
                      : (u[t].B[n - 1] = r);
                    if (e.i.oa)
                      for (const n of e.i.oa)
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
                t = vt(t);
                a = rn(i, a);
                Ut([], [e], function (e) {
                  e = e[0];
                  var i = `${e.name}.${t}`,
                    u = {
                      get() {
                        on(`Cannot access ${i} due to unbound types`, [n]);
                      },
                      enumerable: !0,
                      configurable: !0,
                    };
                  u.set = s
                    ? () => {
                        on(`Cannot access ${i} due to unbound types`, [n]);
                      }
                    : () => {
                        lt(`${i} is a read-only property`);
                      };
                  Object.defineProperty(e.i.constructor, t, u);
                  Ut([], [n], function (n) {
                    n = n[0];
                    var i = {
                      get() {
                        return n.fromWireType(a(r));
                      },
                      enumerable: !0,
                    };
                    s &&
                      ((s = rn(o, s)),
                      (i.set = (e) => {
                        var t = [];
                        s(r, n.toWireType(t, e));
                        Ot(t);
                      }));
                    Object.defineProperty(e.i.constructor, t, i);
                    return [];
                  });
                  return [];
                });
              },
              _embind_register_class_constructor: function (e, t, n, r, i, a) {
                var o = un(t, n);
                i = rn(r, i);
                Ut([], [e], function (e) {
                  e = e[0];
                  var n = `constructor ${e.name}`;
                  void 0 === e.i.$ && (e.i.$ = []);
                  if (void 0 !== e.i.$[t - 1])
                    throw new ut(
                      `Cannot register multiple constructors with identical number of parameters (${
                        t - 1
                      }) for class '${
                        e.name
                      }'! Overload resolution is currently only performed using the parameter count, not actual type info!`
                    );
                  e.i.$[t - 1] = () => {
                    on(`Cannot construct ${e.name} due to unbound types`, o);
                  };
                  Ut([], o, function (r) {
                    r.splice(1, 0, null);
                    e.i.$[t - 1] = sn(n, r, null, i, a);
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
                var u = un(n, r);
                t = vt(t);
                a = rn(i, a);
                Ut([], [e], function (e) {
                  function r() {
                    on(`Cannot call ${i} due to unbound types`, u);
                  }
                  e = e[0];
                  var i = `${e.name}.${t}`;
                  t.startsWith("@@") && (t = Symbol[t.substring(2)]);
                  s && e.i.rb.push(t);
                  var l = e.i.N,
                    c = l[t];
                  void 0 === c ||
                  (void 0 === c.B && c.className !== e.name && c.ea === n - 2)
                    ? ((r.ea = n - 2), (r.className = e.name), (l[t] = r))
                    : (Ht(l, t, i), (l[t].B[n - 2] = r));
                  Ut([], u, function (r) {
                    r = sn(i, r, e, a, o);
                    void 0 === l[t].B
                      ? ((r.ea = n - 2), (l[t] = r))
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
                n = vt(n);
                a = rn(i, a);
                Ut([], [t], function (t) {
                  t = t[0];
                  var i = `${t.name}.${n}`,
                    h = {
                      get() {
                        on(`Cannot access ${i} due to unbound types`, [r, s]);
                      },
                      enumerable: !0,
                      configurable: !0,
                    };
                  h.set = l
                    ? () => {
                        on(`Cannot access ${i} due to unbound types`, [r, s]);
                      }
                    : () => {
                        lt(i + " is a read-only property");
                      };
                  Object.defineProperty(t.i.N, n, h);
                  Ut([], l ? [r, s] : [r], function (r) {
                    var s = r[0],
                      h = {
                        get() {
                          var n = ln(this || e, t, i + " getter");
                          return s.fromWireType(a(o, n));
                        },
                        enumerable: !0,
                      };
                    if (l) {
                      l = rn(u, l);
                      var f = r[1];
                      h.set = function (n) {
                        var r = ln(this || e, t, i + " setter"),
                          a = [];
                        l(c, r, f.toWireType(a, n));
                        Ot(a);
                      };
                    }
                    Object.defineProperty(t.i.N, n, h);
                    return [];
                  });
                  return [];
                });
              },
              _embind_register_emval: function (e, t) {
                t = vt(t);
                Nt(e, {
                  name: t,
                  fromWireType: function (e) {
                    var t = ct(e);
                    cn(e);
                    return t;
                  },
                  toWireType: function (e, t) {
                    return ht(t);
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: xt,
                  K: null,
                });
              },
              _embind_register_enum: function (t, n, r, i) {
                function a() {}
                r = Vt(r);
                n = vt(n);
                a.values = {};
                Nt(t, {
                  name: n,
                  constructor: a,
                  fromWireType: function (t) {
                    return (this || e).constructor.values[t];
                  },
                  toWireType: function (e, t) {
                    return t.value;
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: hn(n, r, i),
                  K: null,
                });
                Yt(n, a);
              },
              _embind_register_enum_value: function (e, t, n) {
                var r = Ct(e, "enum");
                t = vt(t);
                e = r.constructor;
                r = Object.create(r.constructor.prototype, {
                  value: { value: n },
                  constructor: { value: at(`${r.name}_${t}`, function () {}) },
                });
                e.values[n] = r;
                e[t] = r;
              },
              _embind_register_float: function (e, t, n) {
                n = Vt(n);
                t = vt(t);
                Nt(e, {
                  name: t,
                  fromWireType: function (e) {
                    return e;
                  },
                  toWireType: function (e, t) {
                    return t;
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: dn(t, n),
                  K: null,
                });
              },
              _embind_register_function: function (e, t, n, r, i, a) {
                var o = un(t, n);
                e = vt(e);
                i = rn(r, i);
                Yt(
                  e,
                  function () {
                    on(`Cannot call ${e} due to unbound types`, o);
                  },
                  t - 1
                );
                Ut([], o, function (n) {
                  Qt(
                    e,
                    sn(e, [n[0], null].concat(n.slice(1)), null, i, a),
                    t - 1
                  );
                  return [];
                });
              },
              _embind_register_integer: function (e, t, n, r, i) {
                t = vt(t);
                -1 === i && (i = 4294967295);
                i = Vt(n);
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
                Nt(e, {
                  name: t,
                  fromWireType: a,
                  toWireType: n,
                  argPackAdvance: 8,
                  readValueFromPointer: pn(t, i, 0 !== r),
                  K: null,
                });
              },
              _embind_register_memory_view: function (e, t, n) {
                function r(e) {
                  e >>= 2;
                  var t = T;
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
                n = vt(n);
                Nt(
                  e,
                  {
                    name: n,
                    fromWireType: r,
                    argPackAdvance: 8,
                    readValueFromPointer: r,
                  },
                  { $b: !0 }
                );
              },
              _embind_register_std_string: function (e, t) {
                t = vt(t);
                var n = "std::string" === t;
                Nt(e, {
                  name: t,
                  fromWireType: function (e) {
                    var t = T[e >> 2],
                      r = e + 4;
                    if (n)
                      for (var i = r, a = 0; a <= t; ++a) {
                        var o = r + a;
                        if (a == t || 0 == P[o]) {
                          i = i ? ue(P, i, o - i) : "";
                          if (void 0 === s) var s = i;
                          else (s += String.fromCharCode(0)), (s += i);
                          i = o + 1;
                        }
                      }
                    else {
                      s = Array(t);
                      for (a = 0; a < t; ++a)
                        s[a] = String.fromCharCode(P[r + a]);
                      s = s.join("");
                    }
                    Vn(e);
                    return s;
                  },
                  toWireType: function (e, t) {
                    t instanceof ArrayBuffer && (t = new Uint8Array(t));
                    var r = "string" == typeof t;
                    r ||
                      t instanceof Uint8Array ||
                      t instanceof Uint8ClampedArray ||
                      t instanceof Int8Array ||
                      lt("Cannot pass non-string to std::string");
                    var i = n && r ? ce(t) : t.length;
                    var a = Bn(4 + i + 1),
                      o = a + 4;
                    T[a >> 2] = i;
                    if (n && r) he(t, P, o, i + 1);
                    else if (r)
                      for (r = 0; r < i; ++r) {
                        var s = t.charCodeAt(r);
                        255 < s &&
                          (Vn(o),
                          lt(
                            "String has UTF-16 code units that do not fit in 8 bits"
                          ));
                        P[o + r] = s;
                      }
                    else for (r = 0; r < i; ++r) P[o + r] = t[r];
                    null !== e && e.push(Vn, a);
                    return a;
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: xt,
                  K: function (e) {
                    Vn(e);
                  },
                });
              },
              _embind_register_std_wstring: function (e, t, n) {
                n = vt(n);
                if (2 === t) {
                  var r = mn;
                  var i = bn;
                  var a = gn;
                  var o = () => E;
                  var s = 1;
                } else
                  4 === t &&
                    ((r = yn), (i = wn), (a = _n), (o = () => T), (s = 2));
                Nt(e, {
                  name: n,
                  fromWireType: function (e) {
                    for (
                      var n, i = T[e >> 2], a = o(), u = e + 4, l = 0;
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
                    Vn(e);
                    return n;
                  },
                  toWireType: function (e, r) {
                    "string" != typeof r &&
                      lt(`Cannot pass non-string to C++ string type ${n}`);
                    var o = a(r),
                      u = Bn(4 + o + t);
                    T[u >> 2] = o >> s;
                    i(r, u + 4, o + t);
                    null !== e && e.push(Vn, u);
                    return u;
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: xt,
                  K: function (e) {
                    Vn(e);
                  },
                });
              },
              _embind_register_value_object: function (e, t, n, r, i, a) {
                St[e] = { name: vt(t), Pa: rn(n, r), W: rn(i, a), fb: [] };
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
                St[e].fb.push({
                  Sb: vt(t),
                  Yb: n,
                  Wb: rn(r, i),
                  Xb: a,
                  rc: o,
                  qc: rn(s, u),
                  sc: l,
                });
              },
              _embind_register_void: function (e, t) {
                t = vt(t);
                Nt(e, {
                  fc: !0,
                  name: t,
                  argPackAdvance: 0,
                  fromWireType: function () {},
                  toWireType: function () {},
                });
              },
              _emscripten_get_now_is_monotonic: () => !0,
              _emval_as: function (e, t, n) {
                e = ct(e);
                t = Ct(t, "emval::as");
                var r = [],
                  i = ht(r);
                T[n >> 2] = i;
                return t.toWireType(r, e);
              },
              _emval_call_method: function (e, t, n, r, i) {
                e = Mn[e];
                t = ct(t);
                n = Cn(n);
                var a = [];
                T[r >> 2] = ht(a);
                return e(t, n, a, i);
              },
              _emval_call_void_method: function (e, t, n, r) {
                e = Mn[e];
                t = ct(t);
                n = Cn(n);
                e(t, n, null, r);
              },
              _emval_decref: cn,
              _emval_get_method_caller: function (e, t) {
                var n = In(e, t),
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
                var i = Rn[t];
                if (void 0 !== i) return i;
                var a = Array(e - 1);
                i = Pn((t, i, o, s) => {
                  for (var u = 0, l = 0; l < e - 1; ++l)
                    (a[l] = n[l + 1].readValueFromPointer(s + u)),
                      (u += n[l + 1].argPackAdvance);
                  t = t[i].apply(t, a);
                  for (l = 0; l < e - 1; ++l) n[l + 1].Nb && n[l + 1].Nb(a[l]);
                  if (!r.fc) return r.toWireType(o, t);
                });
                return (Rn[t] = i);
              },
              _emval_get_module_property: function (e) {
                e = Cn(e);
                return ht(a[e]);
              },
              _emval_get_property: function (e, t) {
                e = ct(e);
                t = ct(t);
                return ht(e[t]);
              },
              _emval_incref: function (e) {
                4 < e && (st.get(e).ub += 1);
              },
              _emval_new_array: function () {
                return ht([]);
              },
              _emval_new_cstring: function (e) {
                return ht(Cn(e));
              },
              _emval_new_object: function () {
                return ht({});
              },
              _emval_run_destructors: function (e) {
                var t = ct(e);
                Ot(t);
                cn(e);
              },
              _emval_set_property: function (e, t, n) {
                e = ct(e);
                t = ct(t);
                n = ct(n);
                e[t] = n;
              },
              _emval_take_value: function (e, t) {
                e = Ct(e, "_emval_take_value");
                e = e.readValueFromPointer(t);
                return ht(e);
              },
              abort: () => {
                N("");
              },
              emscripten_asm_const_int: (e, t, n) => {
                Tn.length = 0;
                var r;
                for (n >>= 2; (r = P[t++]); )
                  (n += (105 != r) & n),
                    Tn.push(105 == r ? R[n] : L[n++ >> 1]),
                    ++n;
                return Z[e].apply(null, Tn);
              },
              emscripten_date_now: function () {
                return Date.now();
              },
              emscripten_get_now: () => performance.now(),
              emscripten_memcpy_big: (e, t, n) => P.copyWithin(e, t, t + n),
              emscripten_resize_heap: (e) => {
                var t = P.length;
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
                        A.buffer.byteLength +
                        65535) >>>
                      16;
                    try {
                      A.grow(i);
                      j();
                      var a = 1;
                      break e;
                    } catch (e) {}
                    a = void 0;
                  }
                  if (a) return !0;
                }
                return !1;
              },
              environ_get: (e, t) => {
                var n = 0;
                Ln().forEach(function (r, i) {
                  var a = t + n;
                  i = T[(e + 4 * i) >> 2] = a;
                  for (a = 0; a < r.length; ++a) M[i++ | 0] = r.charCodeAt(a);
                  M[i | 0] = 0;
                  n += r.length + 1;
                });
                return 0;
              },
              environ_sizes_get: (e, t) => {
                var n = Ln();
                T[e >> 2] = n.length;
                var r = 0;
                n.forEach(function (e) {
                  r += e.length + 1;
                });
                T[t >> 2] = r;
                return 0;
              },
              fd_close: function (e) {
                try {
                  var t = Ne(e);
                  if (null === t.X) throw new Le(8);
                  t.Ma && (t.Ma = null);
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
                  if ("undefined" == typeof tt || "ErrnoError" !== e.name)
                    throw e;
                  return e.aa;
                }
              },
              fd_read: function (e, t, n, r) {
                try {
                  e: {
                    var i = Ne(e);
                    e = t;
                    for (var a, o = (t = 0); o < n; o++) {
                      var s = T[e >> 2],
                        u = T[(e + 4) >> 2];
                      e += 8;
                      var l = i,
                        c = s,
                        h = u,
                        f = a,
                        d = M;
                      if (0 > h || 0 > f) throw new Le(28);
                      if (null === l.X) throw new Le(8);
                      if (1 === (l.flags & 2097155)) throw new Le(8);
                      if (16384 === (l.node.mode & 61440)) throw new Le(31);
                      if (!l.m.read) throw new Le(28);
                      var p = "undefined" != typeof f;
                      if (p) {
                        if (!l.seekable) throw new Le(70);
                      } else f = l.position;
                      var v = l.m.read(l, d, c, h, f);
                      p || (l.position += v);
                      var m = v;
                      if (0 > m) {
                        var b = -1;
                        break e;
                      }
                      t += m;
                      if (m < u) break;
                      "undefined" !== typeof a && (a += m);
                    }
                    b = t;
                  }
                  T[r >> 2] = b;
                  return 0;
                } catch (e) {
                  if ("undefined" == typeof tt || "ErrnoError" !== e.name)
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
                  var a = Ne(e);
                  Ze(a, t, r);
                  K = [
                    a.position >>> 0,
                    ((J = a.position),
                    1 <= +Math.abs(J)
                      ? 0 < J
                        ? +Math.floor(J / 4294967296) >>> 0
                        : ~~+Math.ceil((J - +(~~J >>> 0)) / 4294967296) >>> 0
                      : 0),
                  ];
                  R[i >> 2] = K[0];
                  R[(i + 4) >> 2] = K[1];
                  a.Ma && 0 === t && 0 === r && (a.Ma = null);
                  return 0;
                } catch (e) {
                  if ("undefined" == typeof tt || "ErrnoError" !== e.name)
                    throw e;
                  return e.aa;
                }
              },
              fd_write: function (e, t, n, r) {
                try {
                  e: {
                    var i = Ne(e);
                    e = t;
                    for (var a, o = (t = 0); o < n; o++) {
                      var s = T[e >> 2],
                        u = T[(e + 4) >> 2];
                      e += 8;
                      var l = i,
                        c = s,
                        h = u,
                        f = a,
                        d = M;
                      if (0 > h || 0 > f) throw new Le(28);
                      if (null === l.X) throw new Le(8);
                      if (0 === (l.flags & 2097155)) throw new Le(8);
                      if (16384 === (l.node.mode & 61440)) throw new Le(31);
                      if (!l.m.write) throw new Le(28);
                      l.seekable && l.flags & 1024 && Ze(l, 0, 2);
                      var p = "undefined" != typeof f;
                      if (p) {
                        if (!l.seekable) throw new Le(70);
                      } else f = l.position;
                      var v = l.m.write(l, d, c, h, f, void 0);
                      p || (l.position += v);
                      var m = v;
                      if (0 > m) {
                        var b = -1;
                        break e;
                      }
                      t += m;
                      "undefined" !== typeof a && (a += m);
                    }
                    b = t;
                  }
                  T[r >> 2] = b;
                  return 0;
                } catch (e) {
                  if ("undefined" == typeof tt || "ErrnoError" !== e.name)
                    throw e;
                  return e.aa;
                }
              },
              strftime_l: (e, t, n, r) => On(e, t, n, r),
            };
            (function () {
              function e(e) {
                C = e = e.exports;
                A = C.memory;
                j();
                S = C.__indirect_function_table;
                x.unshift(C.__wasm_call_ctors);
                U--;
                a.monitorRunDependencies && a.monitorRunDependencies(U);
                if (
                  0 == U &&
                  (null !== V && (clearInterval(V), (V = null)), B)
                ) {
                  var t = B;
                  B = null;
                  t();
                }
                return e;
              }
              var t = { env: Un, wasi_snapshot_preview1: Un };
              U++;
              a.monitorRunDependencies && a.monitorRunDependencies(U);
              if (a.instantiateWasm)
                try {
                  return a.instantiateWasm(t, e);
                } catch (e) {
                  w("Module.instantiateWasm callback failed with error: " + e),
                    i(e);
                }
              q(t, function (t) {
                e(t.instance);
              }).catch(i);
              return {};
            })();
            var Vn = (e) => (Vn = C.free)(e),
              Bn = (e) => (Bn = C.malloc)(e),
              Nn = () => (Nn = C.__errno_location)(),
              $n = (a._ma_device__on_notification_unlocked = (e) =>
                ($n = a._ma_device__on_notification_unlocked =
                  C.ma_device__on_notification_unlocked)(e));
            a._ma_malloc_emscripten = (e, t) =>
              (a._ma_malloc_emscripten = C.ma_malloc_emscripten)(e, t);
            a._ma_free_emscripten = (e, t) =>
              (a._ma_free_emscripten = C.ma_free_emscripten)(e, t);
            var zn = (a._ma_device_process_pcm_frames_capture__webaudio = (
                e,
                t,
                n
              ) =>
                (zn = a._ma_device_process_pcm_frames_capture__webaudio =
                  C.ma_device_process_pcm_frames_capture__webaudio)(e, t, n)),
              Hn = (a._ma_device_process_pcm_frames_playback__webaudio = (
                e,
                t,
                n
              ) =>
                (Hn = a._ma_device_process_pcm_frames_playback__webaudio =
                  C.ma_device_process_pcm_frames_playback__webaudio)(e, t, n)),
              Yn = (e) => (Yn = C.__getTypeName)(e);
            a.__embind_initialize_bindings = () =>
              (a.__embind_initialize_bindings =
                C._embind_initialize_bindings)();
            a.dynCall_iiji = (e, t, n, r, i) =>
              (a.dynCall_iiji = C.dynCall_iiji)(e, t, n, r, i);
            a.dynCall_jiji = (e, t, n, r, i) =>
              (a.dynCall_jiji = C.dynCall_jiji)(e, t, n, r, i);
            a.dynCall_iiiji = (e, t, n, r, i, o) =>
              (a.dynCall_iiiji = C.dynCall_iiiji)(e, t, n, r, i, o);
            a.dynCall_iij = (e, t, n, r) =>
              (a.dynCall_iij = C.dynCall_iij)(e, t, n, r);
            a.dynCall_jii = (e, t, n) =>
              (a.dynCall_jii = C.dynCall_jii)(e, t, n);
            a.dynCall_viijii = (e, t, n, r, i, o, s) =>
              (a.dynCall_viijii = C.dynCall_viijii)(e, t, n, r, i, o, s);
            a.dynCall_iiiiij = (e, t, n, r, i, o, s) =>
              (a.dynCall_iiiiij = C.dynCall_iiiiij)(e, t, n, r, i, o, s);
            a.dynCall_iiiiijj = (e, t, n, r, i, o, s, u, l) =>
              (a.dynCall_iiiiijj = C.dynCall_iiiiijj)(
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
              (a.dynCall_iiiiiijj = C.dynCall_iiiiiijj)(
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
            var Xn;
            B = function e() {
              Xn || Gn();
              Xn || (B = e);
            };
            function Gn() {
              function e() {
                if (!Xn && ((Xn = !0), (a.calledRun = !0), !k)) {
                  a.noFSInit ||
                    _e ||
                    ((_e = !0),
                    Qe(),
                    (a.stdin = a.stdin),
                    (a.stdout = a.stdout),
                    (a.stderr = a.stderr),
                    a.stdin
                      ? et("stdin", a.stdin)
                      : qe("/dev/tty", "/dev/stdin"),
                    a.stdout
                      ? et("stdout", null, a.stdout)
                      : qe("/dev/tty", "/dev/stdout"),
                    a.stderr
                      ? et("stderr", null, a.stderr)
                      : qe("/dev/tty1", "/dev/stderr"),
                    Ke("/dev/stdin", 0),
                    Ke("/dev/stdout", 1),
                    Ke("/dev/stderr", 1));
                  Fe = !1;
                  Q(x);
                  r(a);
                  a.onRuntimeInitialized && a.onRuntimeInitialized();
                  if (a.postRun)
                    for (
                      "function" == typeof a.postRun &&
                      (a.postRun = [a.postRun]);
                      a.postRun.length;

                    ) {
                      var e = a.postRun.shift();
                      D.unshift(e);
                    }
                  Q(D);
                }
              }
              if (!(0 < U)) {
                if (a.preRun)
                  for (
                    "function" == typeof a.preRun && (a.preRun = [a.preRun]);
                    a.preRun.length;

                  )
                    W();
                Q(O);
                0 < U ||
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
            Gn();
            return n.ready;
          };
        })();
        const a = i;
      },
      (e) => {
        e.exports = JSON.parse(
          '{"name":"@rive-app/canvas","version":"2.27.5","description":"Rive\'s canvas based web api.","main":"rive.js","homepage":"https://rive.app","repository":{"type":"git","url":"https://github.com/rive-app/rive-wasm/tree/master/js"},"keywords":["rive","animation"],"author":"Rive","contributors":["Luigi Rosso <luigi@rive.app> (https://rive.app)","Maxwell Talbot <max@rive.app> (https://rive.app)","Arthur Vivian <arthur@rive.app> (https://rive.app)","Umberto Sonnino <umberto@rive.app> (https://rive.app)","Matthew Sullivan <matt.j.sullivan@gmail.com> (mailto:matt.j.sullivan@gmail.com)"],"license":"MIT","files":["rive.js","rive.js.map","rive.wasm","rive_fallback.wasm","rive.d.ts","rive_advanced.mjs.d.ts"],"typings":"rive.d.ts","dependencies":{},"browser":{"fs":false,"path":false}}'
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
            h = e.isTouchScrollEnabled,
            f = h !== void 0 && h,
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
          var b = function (e) {
            if (m && e instanceof MouseEvent)
              e.type == "mouseup" && (m = false);
            else {
              m = f && e.type === "touchend" && v === "touchstart";
              v = e.type;
              var t = e.currentTarget.getBoundingClientRect();
              var r = i(e, f),
                a = r.clientX,
                s = r.clientY;
              if (a || s) {
                var h = a - t.left;
                var d = s - t.top;
                var b = u.computeAlignment(
                  l,
                  c,
                  { minX: 0, minY: 0, maxX: t.width, maxY: t.height },
                  n.bounds,
                  p
                );
                var g = new u.Mat2D();
                b.invert(g);
                var y = new u.Vec2D(h, d);
                var w = u.mapXY(g, y);
                var _ = w.x();
                var A = w.y();
                w.delete();
                g.delete();
                y.delete();
                b.delete();
                switch (e.type) {
                  case "mouseout":
                    for (var C = 0, M = o; C < M.length; C++) {
                      var P = M[C];
                      P.pointerMove(_, A);
                    }
                    break;
                  case "touchmove":
                  case "mouseover":
                  case "mousemove":
                    for (var I = 0, E = o; I < E.length; I++) {
                      P = E[I];
                      P.pointerMove(_, A);
                    }
                    break;
                  case "touchstart":
                  case "mousedown":
                    for (var R = 0, T = o; R < T.length; R++) {
                      P = T[R];
                      P.pointerDown(_, A);
                    }
                    break;
                  case "touchend":
                  case "mouseup":
                    for (var F = 0, L = o; F < L.length; F++) {
                      P = L[F];
                      P.pointerUp(_, A);
                    }
                    break;
                  default:
                }
              }
            }
          };
          var g = b.bind(r);
          t.addEventListener("mouseover", g);
          t.addEventListener("mouseout", g);
          t.addEventListener("mousemove", g);
          t.addEventListener("mousedown", g);
          t.addEventListener("mouseup", g);
          t.addEventListener("touchmove", g, { passive: f });
          t.addEventListener("touchstart", g, { passive: f });
          t.addEventListener("touchend", g);
          return function () {
            t.removeEventListener("mouseover", g);
            t.removeEventListener("mouseout", g);
            t.removeEventListener("mousemove", g);
            t.removeEventListener("mousedown", g);
            t.removeEventListener("mouseup", g);
            t.removeEventListener("touchmove", g);
            t.removeEventListener("touchstart", g);
            t.removeEventListener("touchend", g);
          };
        };
      },
      (e, t, n) => {
        n.r(t);
        n.d(t, { BLANK_URL: () => l, sanitizeUrl: () => f });
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
        function h(e) {
          var t = e.replace(o, "");
          return t.replace(i, function (e, t) {
            return String.fromCharCode(t);
          });
        }
        function f(e) {
          if (!e) return l;
          var t = h(e).replace(a, "").replace(o, "").trim();
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
          AudioAssetWrapper: () => f,
          AudioWrapper: () => s,
          CustomFileAssetLoaderWrapper: () => l,
          FileAssetWrapper: () => c,
          Finalizable: () => a,
          FontAssetWrapper: () => d,
          FontWrapper: () => u,
          ImageAssetWrapper: () => h,
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
              ? (n = new h(e))
              : e.isAudio
              ? (n = new f(e))
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
        var h = (function (t) {
          i(n, t);
          function n() {
            return (t !== null && t.apply(this || e, arguments)) || this || e;
          }
          n.prototype.setRenderImage = function (t) {
            (this || e)._nativeFileAsset.setRenderImage(t.nativeImage);
          };
          return n;
        })(c);
        var f = (function (t) {
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
        DataEnum: () => D,
        EventType: () => C,
        Fit: () => p,
        Layout: () => m,
        LoopType: () => M,
        Rive: () => O,
        RiveEventType: () => w,
        RiveFile: () => S,
        RuntimeLoader: () => b,
        StateMachineInput: () => y,
        StateMachineInputType: () => g,
        Testing: () => K,
        ViewModel: () => x,
        ViewModelInstance: () => U,
        ViewModelInstanceAssetImage: () => G,
        ViewModelInstanceBoolean: () => $,
        ViewModelInstanceColor: () => X,
        ViewModelInstanceEnum: () => H,
        ViewModelInstanceList: () => Y,
        ViewModelInstanceNumber: () => N,
        ViewModelInstanceString: () => B,
        ViewModelInstanceTrigger: () => z,
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
      var h =
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
      var f = (function (t) {
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
      var b = (function () {
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
      var g;
      (function (e) {
        e[(e.Number = 56)] = "Number";
        e[(e.Trigger = 58)] = "Trigger";
        e[(e.Boolean = 59)] = "Boolean";
      })(g || (g = {}));
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
          (this || e).type === g.Trigger && (this || e).runtimeInput.fire();
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
            ? new y(g.Boolean, e.asBool())
            : e.type === t.SMIInput.number
            ? new y(g.Number, e.asNumber())
            : e.type === t.SMIInput.trigger
            ? new y(g.Trigger, e.asTrigger())
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
                  var h = new a.Animation(
                    c,
                    (this || e).artboard,
                    (this || e).runtime,
                    n
                  );
                  h.advance(0);
                  h.apply(1);
                  (this || e).animations.push(h);
                } else {
                  var f = (this || e).artboard.stateMachineByName(t[s]);
                  if (f) {
                    var d = new _(
                      f,
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
      var P = (function () {
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
      var I = (function () {
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
      var E;
      (function (e) {
        e[(e.AVAILABLE = 0)] = "AVAILABLE";
        e[(e.UNAVAILABLE = 1)] = "UNAVAILABLE";
      })(E || (E = {}));
      var R = (function (t) {
        s(n, t);
        function n() {
          var n = (t !== null && t.apply(this || e, arguments)) || this || e;
          n._started = false;
          n._enabled = false;
          n._status = E.UNAVAILABLE;
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
                (this || e)._status = E.AVAILABLE;
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
                      (this || e)._status === E.UNAVAILABLE &&
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
                  return (this || e)._status === E.UNAVAILABLE
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
            if ((this || e)._status === E.UNAVAILABLE) {
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
      })(P);
      var T = new R();
      var F = (function () {
        function e() {}
        e.prototype.observe = function () {};
        e.prototype.unobserve = function () {};
        e.prototype.disconnect = function () {};
        return e;
      })();
      var L = globalThis.ResizeObserver || F;
      var k = (function () {
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
          (this || e)._resizeObserver = new L((this || e)._onObserved);
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
      var j = new k();
      var S = (function () {
        function t(t) {
          (this || e).enableRiveAssetCDN = true;
          (this || e).referenceCount = 0;
          (this || e).destroyed = false;
          (this || e).src = t.src;
          (this || e).buffer = t.buffer;
          t.assetLoader && ((this || e).assetLoader = t.assetLoader);
          (this || e).enableRiveAssetCDN =
            typeof t.enableRiveAssetCDN != "boolean" || t.enableRiveAssetCDN;
          (this || e).eventManager = new P();
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
                  return [4, b.awaitInstance()];
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
      var O = (function () {
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
            ((this || e)._observed = j.add(
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
          (this || e).eventManager = new P();
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
          (this || e).taskQueue = new I((this || e).eventManager);
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
            h = c !== void 0 && c,
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
              throw new f(t.missingErrorMessage);
            var g = J(s);
            var y = J(u);
            (this || e).loaded = false;
            (this || e).readyForPlaying = false;
            b.awaitInstance()
              .then(function (e) {
                if (!r.destroyed) {
                  r.runtime = e;
                  r.removeRiveListeners();
                  r.deleteRiveRenderer();
                  r.renderer = r.runtime.makeRenderer(r.canvas, p);
                  r.canvas.width ||
                    r.canvas.height ||
                    r.resizeDrawingSurfaceToCanvas();
                  r.initData(l, g, y, h, m)
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
            T.status == E.UNAVAILABLE &&
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
            T.add((this || e)._audioEventListener);
            T.establishAudio();
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
                  (this || e).riveFile = new S({
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
              o.volume = (this || e)._volume * T.systemVolume;
              if ((this || e).artboard.animationCount() < 1) {
                h = "Artboard has no animations";
                (this || e).eventManager.fire({ type: C.LoadError, data: h });
                throw h;
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
                    var c = new U(l, null);
                    this.bindViewModelInstance(c);
                  }
                }
              }
            } else {
              var h = "Invalid artboard name or no default artboard";
              console.warn(h);
              (this || e).eventManager.fire({ type: C.LoadError, data: h });
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
          var h = (this || e).animator.stateMachines.filter(function (e) {
            return e.playing;
          });
          for (var f = 0, d = h; f < d.length; f++) {
            var p = d[f];
            var v = p.reportedEventCount();
            if (v)
              for (var m = 0; m < v; m++) {
                var b = p.reportedEventAt(m);
                if (b)
                  if (b.type === w.OpenUrl) {
                    (this || e).eventManager.fire({
                      type: C.RiveEvent,
                      data: b,
                    });
                    if ((this || e).automaticallyHandleEvents) {
                      var g = document.createElement("a");
                      var y = b,
                        _ = y.url,
                        A = y.target;
                      var M = (0, o.sanitizeUrl)(_);
                      _ && g.setAttribute("href", M);
                      A && g.setAttribute("target", A);
                      M && M !== o.BLANK_URL && g.click();
                    }
                  } else
                    (this || e).eventManager.fire({
                      type: C.RiveEvent,
                      data: b,
                    });
              }
            p.advanceAndApply(a);
          }
          (this || e).animator.stateMachines.length == 0 &&
            (this || e).artboard.advance(a);
          var P = (this || e).renderer;
          P.clear();
          P.save();
          this.alignRenderer();
          (this || e)._hasZeroSize || (this || e).artboard.draw(P);
          P.restore();
          P.flush();
          (this || e).animator.handleLooping();
          (this || e).animator.handleStateChanges();
          (this || e).animator.handleAdvancing(a);
          (this || e).frameCount++;
          var I = performance.now();
          (this || e).frameTimes.push(I);
          (this || e).durations.push(I - i);
          while ((this || e).frameTimes[0] <= I - 1e3) {
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
          (this || e)._observed !== null && j.remove((this || e)._observed);
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
            T.remove((this || e)._audioEventListener);
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
            (r.type === g.Boolean
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
            (r.type === g.Number
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
            (n.type === g.Trigger
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
                  var h = [];
                  for (var f = 0; f < c.inputCount(); f++) {
                    var d = c.input(f);
                    h.push({ name: d.name, type: d.type });
                  }
                  i.stateMachines.push({ name: l, inputs: h });
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
              ((this || e).artboard.volume = t * T.systemVolume);
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
          return n !== null ? new x(n) : null;
        };
        t.prototype.viewModelByName = function (t) {
          var n = (this || e).file.viewModelByName(t);
          return n !== null ? new x(n) : null;
        };
        t.prototype.enums = function () {
          if ((this || e)._dataEnums === null) {
            var t = (this || e).file.enums();
            (this || e)._dataEnums = t.map(function (e) {
              return new D(e);
            });
          }
          return (this || e)._dataEnums;
        };
        t.prototype.defaultViewModel = function () {
          if ((this || e).artboard) {
            var t = (this || e).file.defaultArtboardViewModel(
              (this || e).artboard
            );
            if (t) return new x(t);
          }
          return null;
        };
        t.missingErrorMessage = "Rive source file or data buffer required";
        t.cleanupErrorMessage = "Attempt to use file after calling cleanup.";
        return t;
      })();
      var x = (function () {
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
          return n !== null ? new U(n, null) : null;
        };
        t.prototype.instanceByName = function (t) {
          var n = (this || e)._viewModel.instanceByName(t);
          return n !== null ? new U(n, null) : null;
        };
        t.prototype.defaultInstance = function () {
          var t = (this || e)._viewModel.defaultInstance();
          return t !== null ? new U(t, null) : null;
        };
        t.prototype.instance = function () {
          var t = (this || e)._viewModel.instance();
          return t !== null ? new U(t, null) : null;
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
      var D = (function () {
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
      var W;
      (function (e) {
        e.Number = "number";
        e.String = "string";
        e.Boolean = "boolean";
        e.Color = "color";
        e.Trigger = "trigger";
        e.Enum = "enum";
        e.List = "list";
        e.Image = "image";
      })(W || (W = {}));
      var U = (function () {
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
          var i, a, o, s, u, l, c, h, f, d, p, v, m, b, g, y;
          if (n < t.length - 1) {
            var w = this.internalViewModelInstance(t[n]);
            return w !== null ? w.propertyFromPathSegments(t, n + 1, r) : null;
          }
          var _ = null;
          switch (r) {
            case W.Number:
              _ =
                (a =
                  (i = (this || e)._runtimeInstance) === null || i === void 0
                    ? void 0
                    : i.number(t[n])) !== null && a !== void 0
                  ? a
                  : null;
              if (_ !== null) return new N(_, this || e);
              break;
            case W.String:
              _ =
                (s =
                  (o = (this || e)._runtimeInstance) === null || o === void 0
                    ? void 0
                    : o.string(t[n])) !== null && s !== void 0
                  ? s
                  : null;
              if (_ !== null) return new B(_, this || e);
              break;
            case W.Boolean:
              _ =
                (l =
                  (u = (this || e)._runtimeInstance) === null || u === void 0
                    ? void 0
                    : u.boolean(t[n])) !== null && l !== void 0
                  ? l
                  : null;
              if (_ !== null) return new $(_, this || e);
              break;
            case W.Color:
              _ =
                (h =
                  (c = (this || e)._runtimeInstance) === null || c === void 0
                    ? void 0
                    : c.color(t[n])) !== null && h !== void 0
                  ? h
                  : null;
              if (_ !== null) return new X(_, this || e);
              break;
            case W.Trigger:
              _ =
                (d =
                  (f = (this || e)._runtimeInstance) === null || f === void 0
                    ? void 0
                    : f.trigger(t[n])) !== null && d !== void 0
                  ? d
                  : null;
              if (_ !== null) return new z(_, this || e);
              break;
            case W.Enum:
              _ =
                (v =
                  (p = (this || e)._runtimeInstance) === null || p === void 0
                    ? void 0
                    : p.enum(t[n])) !== null && v !== void 0
                  ? v
                  : null;
              if (_ !== null) return new H(_, this || e);
              break;
            case W.List:
              _ =
                (b =
                  (m = (this || e)._runtimeInstance) === null || m === void 0
                    ? void 0
                    : m.list(t[n])) !== null && b !== void 0
                  ? b
                  : null;
              if (_ !== null) return new Y(_, this || e);
              break;
            case W.Image:
              _ =
                (y =
                  (g = (this || e)._runtimeInstance) === null || g === void 0
                    ? void 0
                    : g.image(t[n])) !== null && y !== void 0
                  ? y
                  : null;
              if (_ !== null) return new G(_, this || e);
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
          var t = this.propertyFromPath(e, W.Number);
          return t;
        };
        /**
         * method to access a property instance of type string belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the string property
         */ t.prototype.string = function (e) {
          var t = this.propertyFromPath(e, W.String);
          return t;
        };
        /**
         * method to access a property instance of type boolean belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the boolean property
         */ t.prototype.boolean = function (e) {
          var t = this.propertyFromPath(e, W.Boolean);
          return t;
        };
        /**
         * method to access a property instance of type color belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the ttrigger property
         */ t.prototype.color = function (e) {
          var t = this.propertyFromPath(e, W.Color);
          return t;
        };
        /**
         * method to access a property instance of type trigger belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the trigger property
         */ t.prototype.trigger = function (e) {
          var t = this.propertyFromPath(e, W.Trigger);
          return t;
        };
        /**
         * method to access a property instance of type enum belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the enum property
         */ t.prototype.enum = function (e) {
          var t = this.propertyFromPath(e, W.Enum);
          return t;
        };
        /**
         * method to access a property instance of type list belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the list property
         */ t.prototype.list = function (e) {
          var t = this.propertyFromPath(e, W.List);
          return t;
        };
        /**
         * method to access a view model property instance belonging
         * to the view model instance or to a nested view model instance
         * @param path - path to the image property
         */ t.prototype.image = function (e) {
          var t = this.propertyFromPath(e, W.Image);
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
            var n = h([], (this || e)._children, true);
            (this || e)._children.length = 0;
            var r = h([], (this || e)._parents, true);
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
      var B = (function (t) {
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
      var z = (function (t) {
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
      var H = (function (t) {
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
      var Y = (function (t) {
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
            var r = new U(n, null);
            return r;
          }
          return null;
        };
        n.prototype.internalHandleCallback = function (e) {
          e();
        };
        return n;
      })(V);
      var X = (function (t) {
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
      var G = (function (t) {
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
      var K = { EventManager: P, TaskQueueManager: I };
      var Z = function (t) {
        return l(void 0, void 0, void 0, function () {
          var n, r, i;
          return c(this || e, function (e) {
            switch (e.label) {
              case 0:
                n = new Promise(function (e) {
                  return b.getInstance(function (n) {
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
                  return b.getInstance(function (n) {
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
                  return b.getInstance(function (n) {
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
