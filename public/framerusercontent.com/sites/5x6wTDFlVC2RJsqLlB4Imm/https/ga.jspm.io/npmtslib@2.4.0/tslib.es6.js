var extendStatics = function (e, t) {
  extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function (e, t) {
        e.__proto__ = t;
      }) ||
    function (e, t) {
      for (var r in t)
        Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
    };
  return extendStatics(e, t);
};
function __extends(e, t) {
  if ("function" !== typeof t && null !== t)
    throw new TypeError(
      "Class extends value " + String(t) + " is not a constructor or null"
    );
  extendStatics(e, t);
  function __() {
    this.constructor = e;
  }
  e.prototype =
    null === t ? Object.create(t) : ((__.prototype = t.prototype), new __());
}
var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(e) {
      for (var t, r = 1, n = arguments.length; r < n; r++) {
        t = arguments[r];
        for (var o in t)
          Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
      }
      return e;
    };
  return __assign.apply(this, arguments);
};
function __rest(e, t) {
  var r = {};
  for (var n in e)
    Object.prototype.hasOwnProperty.call(e, n) &&
      t.indexOf(n) < 0 &&
      (r[n] = e[n]);
  if (null != e && "function" === typeof Object.getOwnPropertySymbols) {
    var o = 0;
    for (n = Object.getOwnPropertySymbols(e); o < n.length; o++)
      t.indexOf(n[o]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, n[o]) &&
        (r[n[o]] = e[n[o]]);
  }
  return r;
}
function __decorate(e, t, r, n) {
  var o,
    a = arguments.length,
    i =
      a < 3 ? t : null === n ? (n = Object.getOwnPropertyDescriptor(t, r)) : n;
  if ("object" === typeof Reflect && "function" === typeof Reflect.decorate)
    i = Reflect.decorate(e, t, r, n);
  else
    for (var c = e.length - 1; c >= 0; c--)
      (o = e[c]) && (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
  return a > 3 && i && Object.defineProperty(t, r, i), i;
}
function __param(e, t) {
  return function (r, n) {
    t(r, n, e);
  };
}
function __metadata(e, t) {
  if ("object" === typeof Reflect && "function" === typeof Reflect.metadata)
    return Reflect.metadata(e, t);
}
function __awaiter(e, t, r, n) {
  function adopt(e) {
    return e instanceof r
      ? e
      : new r(function (t) {
          t(e);
        });
  }
  return new (r || (r = Promise))(function (r, o) {
    function fulfilled(e) {
      try {
        step(n.next(e));
      } catch (e) {
        o(e);
      }
    }
    function rejected(e) {
      try {
        step(n.throw(e));
      } catch (e) {
        o(e);
      }
    }
    function step(e) {
      e.done ? r(e.value) : adopt(e.value).then(fulfilled, rejected);
    }
    step((n = n.apply(e, t || [])).next());
  });
}
function __generator(e, t) {
  var r,
    n,
    o,
    a,
    i = {
      label: 0,
      sent: function () {
        if (1 & o[0]) throw o[1];
        return o[1];
      },
      trys: [],
      ops: [],
    };
  return (
    (a = { next: verb(0), throw: verb(1), return: verb(2) }),
    "function" === typeof Symbol &&
      (a[Symbol.iterator] = function () {
        return this;
      }),
    a
  );
  function verb(e) {
    return function (t) {
      return step([e, t]);
    };
  }
  function step(a) {
    if (r) throw new TypeError("Generator is already executing.");
    while (i)
      try {
        if (
          ((r = 1),
          n &&
            (o =
              2 & a[0]
                ? n.return
                : a[0]
                ? n.throw || ((o = n.return) && o.call(n), 0)
                : n.next) &&
            !(o = o.call(n, a[1])).done)
        )
          return o;
        ((n = 0), o) && (a = [2 & a[0], o.value]);
        switch (a[0]) {
          case 0:
          case 1:
            o = a;
            break;
          case 4:
            i.label++;
            return { value: a[1], done: false };
          case 5:
            i.label++;
            n = a[1];
            a = [0];
            continue;
          case 7:
            a = i.ops.pop();
            i.trys.pop();
            continue;
          default:
            if (
              !((o = i.trys), (o = o.length > 0 && o[o.length - 1])) &&
              (6 === a[0] || 2 === a[0])
            ) {
              i = 0;
              continue;
            }
            if (3 === a[0] && (!o || (a[1] > o[0] && a[1] < o[3]))) {
              i.label = a[1];
              break;
            }
            if (6 === a[0] && i.label < o[1]) {
              i.label = o[1];
              o = a;
              break;
            }
            if (o && i.label < o[2]) {
              i.label = o[2];
              i.ops.push(a);
              break;
            }
            o[2] && i.ops.pop();
            i.trys.pop();
            continue;
        }
        a = t.call(e, i);
      } catch (e) {
        a = [6, e];
        n = 0;
      } finally {
        r = o = 0;
      }
    if (5 & a[0]) throw a[1];
    return { value: a[0] ? a[1] : void 0, done: true };
  }
}
var e = Object.create
  ? function (e, t, r, n) {
      void 0 === n && (n = r);
      var o = Object.getOwnPropertyDescriptor(t, r);
      (o && !("get" in o ? !t.__esModule : o.writable || o.configurable)) ||
        (o = {
          enumerable: true,
          get: function () {
            return t[r];
          },
        });
      Object.defineProperty(e, n, o);
    }
  : function (e, t, r, n) {
      void 0 === n && (n = r);
      e[n] = t[r];
    };
function __exportStar(t, r) {
  for (var n in t)
    "default" === n || Object.prototype.hasOwnProperty.call(r, n) || e(r, t, n);
}
function __values(e) {
  var t = "function" === typeof Symbol && Symbol.iterator,
    r = t && e[t],
    n = 0;
  if (r) return r.call(e);
  if (e && "number" === typeof e.length)
    return {
      next: function () {
        e && n >= e.length && (e = void 0);
        return { value: e && e[n++], done: !e };
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function __read(e, t) {
  var r = "function" === typeof Symbol && e[Symbol.iterator];
  if (!r) return e;
  var n,
    o,
    a = r.call(e),
    i = [];
  try {
    while ((void 0 === t || t-- > 0) && !(n = a.next()).done) i.push(n.value);
  } catch (e) {
    o = { error: e };
  } finally {
    try {
      n && !n.done && (r = a.return) && r.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}
/** @deprecated */ function __spread() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e = e.concat(__read(arguments[t]));
  return e;
}
/** @deprecated */ function __spreadArrays() {
  for (var e = 0, t = 0, r = arguments.length; t < r; t++)
    e += arguments[t].length;
  var n = Array(e),
    o = 0;
  for (t = 0; t < r; t++)
    for (var a = arguments[t], i = 0, c = a.length; i < c; i++, o++)
      n[o] = a[i];
  return n;
}
function __spreadArray(e, t, r) {
  if (r || 2 === arguments.length)
    for (var n, o = 0, a = t.length; o < a; o++)
      if (n || !(o in t)) {
        n || (n = Array.prototype.slice.call(t, 0, o));
        n[o] = t[o];
      }
  return e.concat(n || Array.prototype.slice.call(t));
}
function __await(e) {
  return this instanceof __await ? ((this.v = e), this) : new __await(e);
}
function __asyncGenerator(e, t, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n,
    o = r.apply(e, t || []),
    a = [];
  return (
    (n = {}),
    verb("next"),
    verb("throw"),
    verb("return"),
    (n[Symbol.asyncIterator] = function () {
      return this;
    }),
    n
  );
  function verb(e) {
    o[e] &&
      (n[e] = function (t) {
        return new Promise(function (r, n) {
          a.push([e, t, r, n]) > 1 || resume(e, t);
        });
      });
  }
  function resume(e, t) {
    try {
      step(o[e](t));
    } catch (e) {
      settle(a[0][3], e);
    }
  }
  function step(e) {
    e.value instanceof __await
      ? Promise.resolve(e.value.v).then(fulfill, reject)
      : settle(a[0][2], e);
  }
  function fulfill(e) {
    resume("next", e);
  }
  function reject(e) {
    resume("throw", e);
  }
  function settle(e, t) {
    (e(t), a.shift(), a.length) && resume(a[0][0], a[0][1]);
  }
}
function __asyncDelegator(e) {
  var t, r;
  return (
    (t = {}),
    verb("next"),
    verb("throw", function (e) {
      throw e;
    }),
    verb("return"),
    (t[Symbol.iterator] = function () {
      return this;
    }),
    t
  );
  function verb(n, o) {
    t[n] = e[n]
      ? function (t) {
          return (r = !r)
            ? { value: __await(e[n](t)), done: "return" === n }
            : o
            ? o(t)
            : t;
        }
      : o;
  }
}
function __asyncValues(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t,
    r = e[Symbol.asyncIterator];
  return r
    ? r.call(e)
    : ((e =
        "function" === typeof __values ? __values(e) : e[Symbol.iterator]()),
      (t = {}),
      verb("next"),
      verb("throw"),
      verb("return"),
      (t[Symbol.asyncIterator] = function () {
        return this;
      }),
      t);
  function verb(r) {
    t[r] =
      e[r] &&
      function (t) {
        return new Promise(function (n, o) {
          (t = e[r](t)), settle(n, o, t.done, t.value);
        });
      };
  }
  function settle(e, t, r, n) {
    Promise.resolve(n).then(function (t) {
      e({ value: t, done: r });
    }, t);
  }
}
function __makeTemplateObject(e, t) {
  Object.defineProperty
    ? Object.defineProperty(e, "raw", { value: t })
    : (e.raw = t);
  return e;
}
var t = Object.create
  ? function (e, t) {
      Object.defineProperty(e, "default", { enumerable: true, value: t });
    }
  : function (e, t) {
      e.default = t;
    };
function __importStar(r) {
  if (r && r.__esModule) return r;
  var n = {};
  if (null != r)
    for (var o in r)
      "default" !== o &&
        Object.prototype.hasOwnProperty.call(r, o) &&
        e(n, r, o);
  t(n, r);
  return n;
}
function __importDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function __classPrivateFieldGet(e, t, r, n) {
  if ("a" === r && !n)
    throw new TypeError("Private accessor was defined without a getter");
  if ("function" === typeof t ? e !== t || !n : !t.has(e))
    throw new TypeError(
      "Cannot read private member from an object whose class did not declare it"
    );
  return "m" === r ? n : "a" === r ? n.call(e) : n ? n.value : t.get(e);
}
function __classPrivateFieldSet(e, t, r, n, o) {
  if ("m" === n) throw new TypeError("Private method is not writable");
  if ("a" === n && !o)
    throw new TypeError("Private accessor was defined without a setter");
  if ("function" === typeof t ? e !== t || !o : !t.has(e))
    throw new TypeError(
      "Cannot write private member to an object whose class did not declare it"
    );
  return "a" === n ? o.call(e, r) : o ? (o.value = r) : t.set(e, r), r;
}
function __classPrivateFieldIn(e, t) {
  if (null === t || ("object" !== typeof t && "function" !== typeof t))
    throw new TypeError("Cannot use 'in' operator on non-object");
  return "function" === typeof e ? t === e : e.has(t);
}
export {
  __assign,
  __asyncDelegator,
  __asyncGenerator,
  __asyncValues,
  __await,
  __awaiter,
  __classPrivateFieldGet,
  __classPrivateFieldIn,
  __classPrivateFieldSet,
  e as __createBinding,
  __decorate,
  __exportStar,
  __extends,
  __generator,
  __importDefault,
  __importStar,
  __makeTemplateObject,
  __metadata,
  __param,
  __read,
  __rest,
  __spread,
  __spreadArray,
  __spreadArrays,
  __values,
};

//# sourceMappingURL=tslib.es6.js.map
