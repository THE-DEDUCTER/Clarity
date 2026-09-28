import * as e from "react";
import * as t from "@rive-app/canvas";
var n = e;
try {
  "default" in e && (n = e.default);
} catch (i) {}
var r = t;
try {
  "default" in t && (r = t.default);
} catch (i) {}
var u =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
    ? self
    : global;
var a = {};
Object.defineProperty(a, "__esModule", { value: !0 });
var i = n,
  o = r;
function l(e) {
  return e && "object" == typeof e && "default" in e ? e : { default: e };
}
var s = l(i),
  c = function () {
    return (
      (c =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++)
            for (var u in (t = arguments[n]))
              Object.prototype.hasOwnProperty.call(t, u) && (e[u] = t[u]);
          return e;
        }),
      c.apply(this || u, arguments)
    );
  };
function f(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) &&
      t.indexOf(r) < 0 &&
      (n[r] = e[r]);
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var u = 0;
    for (r = Object.getOwnPropertySymbols(e); u < r.length; u++)
      t.indexOf(r[u]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[u]) &&
        (n[r[u]] = e[r[u]]);
  }
  return n;
}
function d(e, t, n, r) {
  return new (n || (n = Promise))(function (u, a) {
    function i(e) {
      try {
        l(r.next(e));
      } catch (e) {
        a(e);
      }
    }
    function o(e) {
      try {
        l(r.throw(e));
      } catch (e) {
        a(e);
      }
    }
    function l(e) {
      var t;
      e.done
        ? u(e.value)
        : ((t = e.value),
          t instanceof n
            ? t
            : new n(function (e) {
                e(t);
              })).then(i, o);
    }
    l((r = r.apply(e, t || [])).next());
  });
}
function v(e, t) {
  var n,
    r,
    a,
    i,
    o = {
      label: 0,
      sent: function () {
        if (1 & a[0]) throw a[1];
        return a[1];
      },
      trys: [],
      ops: [],
    };
  return (
    (i = { next: l(0), throw: l(1), return: l(2) }),
    "function" == typeof Symbol &&
      (i[Symbol.iterator] = function () {
        return this || u;
      }),
    i
  );
  function l(u) {
    return function (i) {
      return (function (u) {
        if (n) throw new TypeError("Generator is already executing.");
        for (; o; )
          try {
            if (
              ((n = 1),
              r &&
                (a =
                  2 & u[0]
                    ? r.return
                    : u[0]
                    ? r.throw || ((a = r.return) && a.call(r), 0)
                    : r.next) &&
                !(a = a.call(r, u[1])).done)
            )
              return a;
            switch (((r = 0), a && (u = [2 & u[0], a.value]), u[0])) {
              case 0:
              case 1:
                a = u;
                break;
              case 4:
                return o.label++, { value: u[1], done: !1 };
              case 5:
                o.label++, (r = u[1]), (u = [0]);
                continue;
              case 7:
                (u = o.ops.pop()), o.trys.pop();
                continue;
              default:
                if (
                  !((a = o.trys),
                  (a = a.length > 0 && a[a.length - 1]) ||
                    (6 !== u[0] && 2 !== u[0]))
                ) {
                  o = 0;
                  continue;
                }
                if (3 === u[0] && (!a || (u[1] > a[0] && u[1] < a[3]))) {
                  o.label = u[1];
                  break;
                }
                if (6 === u[0] && o.label < a[1]) {
                  (o.label = a[1]), (a = u);
                  break;
                }
                if (a && o.label < a[2]) {
                  (o.label = a[2]), o.ops.push(u);
                  break;
                }
                a[2] && o.ops.pop(), o.trys.pop();
                continue;
            }
            u = t.call(e, o);
          } catch (e) {
            (u = [6, e]), (r = 0);
          } finally {
            n = a = 0;
          }
        if (5 & u[0]) throw u[1];
        return { value: u[0] ? u[1] : void 0, done: !0 };
      })([u, i]);
    };
  }
}
function h(e) {
  var t = e || p(),
    n = i.useState(t),
    r = n[0],
    u = n[1];
  return (
    i.useEffect(
      function () {
        if ("undefined" != typeof window && "matchMedia" in window) {
          var t = function () {
              var t = e || p();
              u(t);
            },
            n = window.matchMedia(
              "screen and (resolution: ".concat(r, "dppx)")
            );
          return (
            n.hasOwnProperty("addEventListener")
              ? n.addEventListener("change", t)
              : n.addListener(t),
            function () {
              n.hasOwnProperty("removeEventListener")
                ? n.removeEventListener("change", t)
                : n.removeListener(t);
            }
          );
        }
      },
      [r, e]
    ),
    r
  );
}
function p() {
  var e =
    "undefined" != typeof window && "number" == typeof window.devicePixelRatio
      ? window.devicePixelRatio
      : 1;
  return Math.min(Math.max(1, e), 3);
}
var b = (function () {
  function e() {}
  return (
    (e.prototype.observe = function () {}),
    (e.prototype.unobserve = function () {}),
    (e.prototype.disconnect = function () {}),
    e
  );
})();
var g = globalThis.ResizeObserver || b,
  y = void 0 !== globalThis.ResizeObserver,
  w = !y;
function m(e, t) {
  void 0 === t && (t = !0);
  var n = i.useState({ width: 0, height: 0 }),
    r = n[0],
    a = n[1];
  i.useEffect(function () {
    if ("undefined" != typeof window && t) {
      var e = function () {
        a({ width: window.innerWidth, height: window.innerHeight });
      };
      return (
        w && (e(), window.addEventListener("resize", e)),
        function () {
          return window.removeEventListener("resize", e);
        }
      );
    }
  }, []);
  var o,
    l,
    s,
    c = i.useRef(
      new g(
        ((o = function (e) {
          y &&
            a({
              width: e[e.length - 1].contentRect.width,
              height: e[e.length - 1].contentRect.height,
            });
        }),
        (l = 0),
        (s = 0),
        function () {
          for (var e = this || u, t = [], n = 0; n < arguments.length; n++)
            t[n] = arguments[n];
          clearTimeout(s),
            (s = window.setTimeout(function () {
              return o.apply(e, t);
            }, l));
        })
      )
    );
  return (
    i.useEffect(
      function () {
        var n = c.current;
        if (t) {
          var r = e.current;
          return (
            e.current && y && n.observe(e.current),
            function () {
              n.disconnect(), r && y && n.unobserve(r);
            }
          );
        }
        n.disconnect();
      },
      [e, c]
    ),
    r
  );
}
var C = {
  useDevicePixelRatio: !0,
  fitCanvasToArtboardHeight: !1,
  useOffscreenRenderer: !0,
  shouldResizeCanvasToContainer: !0,
};
function R(e) {
  return Object.assign({}, C, e);
}
function E(e) {
  var t = e.riveLoaded,
    n = void 0 !== t && t,
    r = e.canvasElem,
    u = e.containerRef,
    a = e.options,
    o = void 0 === a ? {} : a,
    l = e.onCanvasHasResized,
    s = e.artboardBounds,
    c = R(o),
    f = i.useState({ height: 0, width: 0 }),
    d = f[0],
    v = d.height,
    p = d.width,
    b = f[1],
    g = i.useState({ height: 0, width: 0 }),
    y = g[0],
    w = y.height,
    C = y.width,
    E = g[1],
    V = i.useState(!0),
    O = V[0],
    M = V[1],
    k = c.fitCanvasToArtboardHeight,
    P = c.shouldResizeCanvasToContainer,
    x = c.useDevicePixelRatio,
    I = c.customDevicePixelRatio,
    T = m(u, P),
    S = h(I),
    D = null != s ? s : {},
    L = D.maxX,
    z = D.maxY,
    H = i.useCallback(
      function () {
        var e,
          t,
          n,
          r,
          a =
            null !==
              (t =
                null === (e = u.current) || void 0 === e
                  ? void 0
                  : e.clientWidth) && void 0 !== t
              ? t
              : 0,
          i =
            null !==
              (r =
                null === (n = u.current) || void 0 === n
                  ? void 0
                  : n.clientHeight) && void 0 !== r
              ? r
              : 0;
        return k && s
          ? { width: a, height: a * (s.maxY / s.maxX) }
          : { width: a, height: i };
      },
      [u, k, L, z]
    );
  i.useEffect(
    function () {
      if (P && u.current && n) {
        var e = H(),
          t = e.width,
          a = e.height,
          i = !1;
        if (r) {
          var o = t !== p || a !== v;
          if (
            (c.fitCanvasToArtboardHeight &&
              o &&
              ((u.current.style.height = a + "px"), (i = !0)),
            c.useDevicePixelRatio)
          ) {
            if (o || t * S !== C || a * S !== w) {
              var s = S * t,
                f = S * a;
              (r.width = s),
                (r.height = f),
                (r.style.width = t + "px"),
                (r.style.height = a + "px"),
                E({ width: s, height: f }),
                (i = !0);
            }
          } else
            o &&
              ((r.width = t),
              (r.height = a),
              E({ width: t, height: a }),
              (i = !0));
          b({ width: t, height: a });
        }
        l && (O || i) && l && l(), O && M(!1);
      }
    },
    [r, u, T, S, H, O, M, w, C, v, p, l, P, k, x, n]
  ),
    i.useEffect(
      function () {
        E({ width: 0, height: 0 });
      },
      [r]
    );
}
var V,
  O = (function () {
    function e() {}
    return (
      (e.prototype.observe = function () {}),
      (e.prototype.unobserve = function () {}),
      (e.prototype.disconnect = function () {}),
      e
    );
  })(),
  M = globalThis.IntersectionObserver || O,
  k = (function () {
    function e() {
      var e = this || u;
      ((this || u).elementsMap = new Map()),
        ((this || u).onObserved = function (t) {
          t.forEach(function (t) {
            var n = e.elementsMap.get(t.target);
            n && n(t);
          });
        }),
        ((this || u).observer = new M((this || u).onObserved));
    }
    return (
      (e.prototype.registerCallback = function (e, t) {
        (this || u).observer.observe(e), (this || u).elementsMap.set(e, t);
      }),
      (e.prototype.removeCallback = function (e) {
        (this || u).observer.unobserve(e), (this || u).elementsMap.delete(e);
      }),
      e
    );
  })(),
  P = function () {
    return V || (V = new k()), V;
  };
function x(e) {
  var t = e.setContainerRef,
    n = e.setCanvasRef,
    r = e.className,
    u = void 0 === r ? "" : r,
    a = e.style,
    i = e.children,
    o = f(e, [
      "setContainerRef",
      "setCanvasRef",
      "className",
      "style",
      "children",
    ]),
    l = c({ width: "100%", height: "100%" }, a);
  return s.default.createElement(
    "div",
    c({ ref: t, className: u }, !u && { style: l }),
    s.default.createElement(
      "canvas",
      c({ ref: n, style: { verticalAlign: "top", width: 0, height: 0 } }, o),
      i
    )
  );
}
function I(e, t) {
  void 0 === t && (t = {});
  var n = i.useState(null),
    r = n[0],
    u = n[1],
    a = i.useRef(null),
    l = i.useState(null),
    f = l[0],
    d = l[1],
    v = Boolean(e),
    p = R(t),
    b = h(),
    g = i.useCallback(
      function () {
        if (f) {
          if (f.layout && f.layout.fit === o.Fit.Layout && r) {
            var e = b * f.layout.layoutScaleFactor;
            (f.devicePixelRatioUsed = b),
              (f.artboardWidth = (null == r ? void 0 : r.width) / e),
              (f.artboardHeight = (null == r ? void 0 : r.height) / e);
          }
          f.startRendering(), f.resizeToCanvas();
        }
      },
      [f, b]
    );
  E({
    riveLoaded: !!f,
    canvasElem: r,
    containerRef: a,
    options: p,
    onCanvasHasResized: g,
    artboardBounds: null == f ? void 0 : f.bounds,
  });
  var y = i.useCallback(function (e) {
    null === e && r && ((r.height = 0), (r.width = 0)), u(e);
  }, []);
  i.useEffect(
    function () {
      if (r && e) {
        var t,
          n = null != f;
        if (null == f) {
          var u = p.useOffscreenRenderer;
          (t = new o.Rive(
            c(c({ useOffscreenRenderer: u }, e), { canvas: r })
          )).on(o.EventType.Load, function () {
            (n = !0), r ? d(t) : t.cleanup();
          });
        }
        return function () {
          n || null == t || t.cleanup();
        };
      }
    },
    [r, v, f]
  );
  var w = i.useCallback(function (e) {
      a.current = e;
    }, []),
    m = {
      observe: i.useCallback(function (e, t) {
        P().registerCallback(e, t);
      }, []),
      unobserve: i.useCallback(function (e) {
        P().removeCallback(e);
      }, []),
    },
    C = m.observe,
    V = m.unobserve;
  i.useEffect(
    function () {
      var e,
        t = !1,
        n = function () {
          if (r && t) {
            var e = r.getBoundingClientRect();
            e.width > 0 &&
              e.height > 0 &&
              e.top <
                (window.innerHeight || document.documentElement.clientHeight) &&
              e.bottom > 0 &&
              e.left <
                (window.innerWidth || document.documentElement.clientWidth) &&
              e.right > 0 &&
              (null == f || f.startRendering(), (t = !1));
          }
        };
      return (
        r &&
          !1 !== p.shouldUseIntersectionObserver &&
          C(r, function (r) {
            r.isIntersecting ? f && f.startRendering() : f && f.stopRendering(),
              (t = !r.isIntersecting),
              clearTimeout(e),
              r.isIntersecting ||
                0 !== r.boundingClientRect.width ||
                (e = setTimeout(n, 10));
          }),
        function () {
          r && V(r);
        }
      );
    },
    [C, V, f, r, p.shouldUseIntersectionObserver]
  ),
    i.useEffect(
      function () {
        return function () {
          f && (f.cleanup(), d(null));
        };
      },
      [f, r]
    );
  var O = null == e ? void 0 : e.animations;
  i.useEffect(
    function () {
      f &&
        O &&
        (f.isPlaying
          ? (f.stop(f.animationNames), f.play(O))
          : f.isPaused && (f.stop(f.animationNames), f.pause(O)));
    },
    [O, f]
  );
  var M = i.useCallback(
    function (e) {
      return s.default.createElement(
        x,
        c({ setContainerRef: w, setCanvasRef: y }, e)
      );
    },
    [y, w]
  );
  return {
    canvas: r,
    container: a.current,
    setCanvasRef: y,
    setContainerRef: w,
    rive: f,
    RiveComponent: M,
  };
}
function T(e, t, n) {
  var r = i.useState(null),
    u = r[0],
    a = r[1],
    o = i.useState(n.defaultValue),
    l = o[0],
    s = o[1],
    f = i.useState(null),
    d = f[0],
    v = f[1],
    h = i.useRef(null),
    p = i.useRef(e),
    b = i.useRef(n);
  i.useEffect(
    function () {
      b.current = n;
    },
    [n]
  );
  var g = i.useCallback(function () {
    var e = h.current,
      t = p.current,
      n = b.current;
    if (!e || !t) return a(null), s(n.defaultValue), v(null), function () {};
    var r = n.getProperty(e, t);
    if (r) {
      a(r), s(n.getValue(r)), n.getExtendedData && v(n.getExtendedData(r));
      var u = function () {
        s(n.getValue(r)),
          n.getExtendedData && v(n.getExtendedData(r)),
          n.onPropertyEvent && n.onPropertyEvent();
      };
      return (
        r.on(u),
        function () {
          r.off(u);
        }
      );
    }
    return function () {};
  }, []);
  i.useEffect(
    function () {
      return (h.current = t), (p.current = e), g();
    },
    [t, e, g]
  );
  var y = i.useCallback(
      function (e) {
        if (u && h.current === t)
          try {
            return (
              e(u),
              void (
                b.current.getExtendedData && v(b.current.getExtendedData(u))
              )
            );
          } catch (e) {}
        if (h.current)
          try {
            var n = b.current.getProperty(h.current, p.current);
            n &&
              (a(n),
              e(n),
              b.current.getExtendedData && v(b.current.getExtendedData(n)));
          } catch (e) {}
      },
      [u, t]
    ),
    w = i.useMemo(
      function () {
        return b.current.buildPropertyOperations(y);
      },
      [y]
    ),
    m = c({ value: l }, w);
  return n.getExtendedData && (m.extendedData = d), m;
}
(a.default = function (e) {
  var t = e.src,
    n = e.artboard,
    r = e.animations,
    u = e.stateMachines,
    a = e.layout,
    i = e.useOffscreenRenderer,
    o = void 0 === i || i,
    l = e.shouldDisableRiveListeners,
    d = void 0 !== l && l,
    v = e.shouldResizeCanvasToContainer,
    h = void 0 === v || v,
    p = e.automaticallyHandleEvents,
    b = void 0 !== p && p,
    g = e.children,
    y = f(e, [
      "src",
      "artboard",
      "animations",
      "stateMachines",
      "layout",
      "useOffscreenRenderer",
      "shouldDisableRiveListeners",
      "shouldResizeCanvasToContainer",
      "automaticallyHandleEvents",
      "children",
    ]),
    w = I(
      {
        src: t,
        artboard: n,
        animations: r,
        layout: a,
        stateMachines: u,
        autoplay: !0,
        shouldDisableRiveListeners: d,
        automaticallyHandleEvents: b,
      },
      { useOffscreenRenderer: o, shouldResizeCanvasToContainer: h }
    ).RiveComponent;
  return s.default.createElement(w, c({}, y), g);
}),
  (a.useResizeCanvas = E),
  (a.useRive = I),
  (a.useRiveFile = function (e) {
    var t = this || u,
      n = i.useState(null),
      r = n[0],
      a = n[1],
      l = i.useState("idle"),
      s = l[0],
      c = l[1];
    return (
      i.useEffect(
        function () {
          var n = null;
          return (
            d(t, void 0, void 0, function () {
              return v(this || u, function (t) {
                try {
                  c("loading"),
                    (n = new o.RiveFile(e)).init(),
                    n.on(o.EventType.Load, function () {
                      null == n || n.getInstance(), a(n), c("success");
                    }),
                    n.on(o.EventType.LoadError, function () {
                      c("failed");
                    }),
                    a(n);
                } catch (e) {
                  console.error(e), c("failed");
                }
                return [2];
              });
            }),
            function () {
              null == n || n.cleanup();
            }
          );
        },
        [e.src, e.buffer]
      ),
      { riveFile: r, status: s }
    );
  }),
  (a.useStateMachineInput = function (e, t, n, r) {
    var u = i.useState(null),
      a = u[0],
      l = u[1];
    return (
      i.useEffect(
        function () {
          function u() {
            if (((e && t && n) || l(null), e && t && n)) {
              var u = e.stateMachineInputs(t);
              if (u) {
                var a = u.find(function (e) {
                  return e.name === n;
                });
                void 0 !== r && a && (a.value = r), l(a || null);
              }
            } else l(null);
          }
          u(),
            e &&
              e.on(o.EventType.Load, function () {
                u();
              });
        },
        [e]
      ),
      a
    );
  }),
  (a.useViewModel = function (e, t) {
    var n = null != t ? t : {},
      r = n.name,
      u = n.useDefault,
      a = void 0 !== u && u,
      l = i.useState(null),
      s = l[0],
      c = l[1];
    return (
      i.useEffect(
        function () {
          function t() {
            var t;
            if (e) {
              var n = null;
              (n =
                null != r
                  ? (null === (t = e.viewModelByName) || void 0 === t
                      ? void 0
                      : t.call(e, r)) || null
                  : e.defaultViewModel() || null),
                c(n);
            } else c(null);
          }
          return (
            t(),
            e && e.on(o.EventType.Load, t),
            function () {
              e && e.off(o.EventType.Load, t);
            }
          );
        },
        [e, r, a]
      ),
      s
    );
  }),
  (a.useViewModelInstance = function (e, t) {
    var n = null != t ? t : {},
      r = n.name,
      u = n.useDefault,
      a = void 0 !== u && u,
      o = n.useNew,
      l = void 0 !== o && o,
      s = n.rive,
      c = i.useState(null),
      f = c[0],
      d = c[1];
    return (
      i.useEffect(
        function () {
          var t, n, u;
          if (e) {
            var i = null;
            (i =
              null != r
                ? e.instanceByName(r) || null
                : a
                ? (null === (t = e.defaultInstance) || void 0 === t
                    ? void 0
                    : t.call(e)) || null
                : l
                ? (null === (n = e.instance) || void 0 === n
                    ? void 0
                    : n.call(e)) || null
                : (null === (u = e.defaultInstance) || void 0 === u
                    ? void 0
                    : u.call(e)) || null),
              d(i),
              s && i && s.viewModelInstance !== i && s.bindViewModelInstance(i);
          } else d(null);
        },
        [e, r, a, l, s]
      ),
      f
    );
  }),
  (a.useViewModelInstanceBoolean = function (e, t) {
    var n = T(e, t, {
      getProperty: i.useCallback(function (e, t) {
        return e.boolean(t);
      }, []),
      getValue: i.useCallback(function (e) {
        return e.value;
      }, []),
      defaultValue: null,
      buildPropertyOperations: i.useCallback(function (e) {
        return {
          setValue: function (t) {
            e(function (e) {
              e.value = t;
            });
          },
        };
      }, []),
    });
    return { value: n.value, setValue: n.setValue };
  }),
  (a.useViewModelInstanceColor = function (e, t) {
    var n = T(e, t, {
      getProperty: i.useCallback(function (e, t) {
        return e.color(t);
      }, []),
      getValue: i.useCallback(function (e) {
        return e.value;
      }, []),
      defaultValue: null,
      buildPropertyOperations: i.useCallback(function (e) {
        return {
          setValue: function (t) {
            e(function (e) {
              e.value = t;
            });
          },
          setRgb: function (t, n, r) {
            e(function (e) {
              e.rgb(t, n, r);
            });
          },
          setRgba: function (t, n, r, u) {
            e(function (e) {
              e.rgba(t, n, r, u);
            });
          },
          setAlpha: function (t) {
            e(function (e) {
              e.alpha(t);
            });
          },
          setOpacity: function (t) {
            e(function (e) {
              e.opacity(t);
            });
          },
        };
      }, []),
    });
    return {
      value: n.value,
      setValue: n.setValue,
      setRgb: n.setRgb,
      setRgba: n.setRgba,
      setAlpha: n.setAlpha,
      setOpacity: n.setOpacity,
    };
  }),
  (a.useViewModelInstanceEnum = function (e, t) {
    var n = T(e, t, {
      getProperty: i.useCallback(function (e, t) {
        return e.enum(t);
      }, []),
      getValue: i.useCallback(function (e) {
        return e.value;
      }, []),
      defaultValue: null,
      getExtendedData: i.useCallback(function (e) {
        return e.values;
      }, []),
      buildPropertyOperations: i.useCallback(function (e) {
        return {
          setValue: function (t) {
            e(function (e) {
              e.value = t;
            });
          },
        };
      }, []),
    });
    return {
      value: n.value,
      values: n.extendedData || [],
      setValue: n.setValue,
    };
  }),
  (a.useViewModelInstanceNumber = function (e, t) {
    var n = T(e, t, {
      getProperty: i.useCallback(function (e, t) {
        return e.number(t);
      }, []),
      getValue: i.useCallback(function (e) {
        return e.value;
      }, []),
      defaultValue: null,
      buildPropertyOperations: i.useCallback(function (e) {
        return {
          setValue: function (t) {
            e(function (e) {
              e.value = t;
            });
          },
        };
      }, []),
    });
    return { value: n.value, setValue: n.setValue };
  }),
  (a.useViewModelInstanceString = function (e, t) {
    var n = T(e, t, {
      getProperty: i.useCallback(function (e, t) {
        return e.string(t);
      }, []),
      getValue: i.useCallback(function (e) {
        return e.value;
      }, []),
      defaultValue: null,
      buildPropertyOperations: i.useCallback(function (e) {
        return {
          setValue: function (t) {
            e(function (e) {
              e.value = t;
            });
          },
        };
      }, []),
    });
    return { value: n.value, setValue: n.setValue };
  }),
  (a.useViewModelInstanceTrigger = function (e, t, n) {
    var r = (null != n ? n : {}).onTrigger;
    return {
      trigger: T(e, t, {
        getProperty: i.useCallback(function (e, t) {
          return e.trigger(t);
        }, []),
        getValue: i.useCallback(function () {}, []),
        defaultValue: null,
        onPropertyEvent: r,
        buildPropertyOperations: i.useCallback(function (e) {
          return {
            trigger: function () {
              e(function (e) {
                e.trigger();
              });
            },
          };
        }, []),
      }).trigger,
    };
  }),
  Object.keys(o).forEach(function (e) {
    "default" === e ||
      a.hasOwnProperty(e) ||
      Object.defineProperty(a, e, {
        enumerable: !0,
        get: function () {
          return o[e];
        },
      });
  });
const S = a.__esModule,
  D = a.useResizeCanvas,
  L = a.useRive,
  z = a.useRiveFile,
  H = a.useStateMachineInput,
  j = a.useViewModel,
  N = a.useViewModelInstance,
  B = a.useViewModelInstanceBoolean,
  A = a.useViewModelInstanceColor,
  F = a.useViewModelInstanceEnum,
  W = a.useViewModelInstanceNumber,
  _ = a.useViewModelInstanceString,
  U = a.useViewModelInstanceTrigger;
export {
  S as __esModule,
  a as default,
  D as useResizeCanvas,
  L as useRive,
  z as useRiveFile,
  H as useStateMachineInput,
  j as useViewModel,
  N as useViewModelInstance,
  B as useViewModelInstanceBoolean,
  A as useViewModelInstanceColor,
  F as useViewModelInstanceEnum,
  W as useViewModelInstanceNumber,
  _ as useViewModelInstanceString,
  U as useViewModelInstanceTrigger,
};
//# sourceMappingURL=index.js.map
