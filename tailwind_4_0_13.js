"use strict";
(() => {
  var $t = "4.0.13";
  var ke = 92,
    Ke = 47,
    Pe = 42,
    oo = 34,
    no = 39,
    io = 58,
    Ue = 59,
    le = 10,
    we = 32,
    _e = 9,
    Tt = 123,
    tt = 125,
    nt = 40,
    Vt = 41,
    lo = 91,
    ao = 93,
    Et = 45,
    rt = 64,
    so = 33;
  function pe(t) {
    t[0] === "\uFEFF" && (t = t.slice(1)),
      (t = t.replaceAll(
        `\r
`,
        `
`,
      ));
    let r = [],
      o = [],
      e = [],
      n = null,
      s = null,
      l = "",
      p = "",
      c;
    for (let d = 0; d < t.length; d++) {
      let u = t.charCodeAt(d);
      if (u === ke) (l += t.slice(d, d + 2)), (d += 1);
      else if (u === Ke && t.charCodeAt(d + 1) === Pe) {
        let g = d;
        for (let v = d + 2; v < t.length; v++)
          if (((c = t.charCodeAt(v)), c === ke)) v += 1;
          else if (c === Pe && t.charCodeAt(v + 1) === Ke) {
            d = v + 1;
            break;
          }
        let m = t.slice(g, d + 1);
        m.charCodeAt(2) === so && o.push(De(m.slice(2, -2)));
      } else if (u === no || u === oo) {
        let g = d;
        for (let m = d + 1; m < t.length; m++)
          if (((c = t.charCodeAt(m)), c === ke)) m += 1;
          else if (c === u) {
            d = m;
            break;
          } else {
            if (c === Ue && t.charCodeAt(m + 1) === le)
              throw new Error(
                `Unterminated string: ${t.slice(g, m + 1) + String.fromCharCode(u)}`,
              );
            if (c === le)
              throw new Error(
                `Unterminated string: ${t.slice(g, m) + String.fromCharCode(u)}`,
              );
          }
        l += t.slice(g, d + 1);
      } else {
        if (
          (u === we || u === le || u === _e) &&
          (c = t.charCodeAt(d + 1)) &&
          (c === we || c === le || c === _e)
        )
          continue;
        if (u === le) {
          if (l.length === 0) continue;
          (c = l.charCodeAt(l.length - 1)),
            c !== we && c !== le && c !== _e && (l += " ");
        } else if (u === Et && t.charCodeAt(d + 1) === Et && l.length === 0) {
          let g = "",
            m = d,
            v = -1;
          for (let b = d + 2; b < t.length; b++)
            if (((c = t.charCodeAt(b)), c === ke)) b += 1;
            else if (c === Ke && t.charCodeAt(b + 1) === Pe) {
              for (let x = b + 2; x < t.length; x++)
                if (((c = t.charCodeAt(x)), c === ke)) x += 1;
                else if (c === Pe && t.charCodeAt(x + 1) === Ke) {
                  b = x + 1;
                  break;
                }
            } else if (v === -1 && c === io) v = l.length + b - m;
            else if (c === Ue && g.length === 0) {
              (l += t.slice(m, b)), (d = b);
              break;
            } else if (c === nt) g += ")";
            else if (c === lo) g += "]";
            else if (c === Tt) g += "}";
            else if ((c === tt || t.length - 1 === b) && g.length === 0) {
              (d = b - 1), (l += t.slice(m, b));
              break;
            } else
              (c === Vt || c === ao || c === tt) &&
                g.length > 0 &&
                t[b] === g[g.length - 1] &&
                (g = g.slice(0, -1));
          let y = ot(l, v);
          if (!y) throw new Error("Invalid custom property, expected a value");
          n ? n.nodes.push(y) : r.push(y), (l = "");
        } else if (u === Ue && l.charCodeAt(0) === rt)
          (s = xe(l)), n ? n.nodes.push(s) : r.push(s), (l = ""), (s = null);
        else if (u === Ue && p[p.length - 1] !== ")") {
          let g = ot(l);
          if (!g)
            throw l.length === 0
              ? new Error("Unexpected semicolon")
              : new Error(`Invalid declaration: \`${l.trim()}\``);
          n ? n.nodes.push(g) : r.push(g), (l = "");
        } else if (u === Tt && p[p.length - 1] !== ")")
          (p += "}"),
            (s = M(l.trim())),
            n && n.nodes.push(s),
            e.push(n),
            (n = s),
            (l = ""),
            (s = null);
        else if (u === tt && p[p.length - 1] !== ")") {
          if (p === "") throw new Error("Missing opening {");
          if (((p = p.slice(0, -1)), l.length > 0))
            if (l.charCodeAt(0) === rt)
              (s = xe(l)),
                n ? n.nodes.push(s) : r.push(s),
                (l = ""),
                (s = null);
            else {
              let m = l.indexOf(":");
              if (n) {
                let v = ot(l, m);
                if (!v) throw new Error(`Invalid declaration: \`${l.trim()}\``);
                n.nodes.push(v);
              }
            }
          let g = e.pop() ?? null;
          g === null && n && r.push(n), (n = g), (l = ""), (s = null);
        } else if (u === nt) (p += ")"), (l += "(");
        else if (u === Vt) {
          if (p[p.length - 1] !== ")") throw new Error("Missing opening (");
          (p = p.slice(0, -1)), (l += ")");
        } else {
          if (l.length === 0 && (u === we || u === le || u === _e)) continue;
          l += String.fromCharCode(u);
        }
      }
    }
    if ((l.charCodeAt(0) === rt && r.push(xe(l)), p.length > 0 && n)) {
      if (n.kind === "rule")
        throw new Error(`Missing closing } at ${n.selector}`);
      if (n.kind === "at-rule")
        throw new Error(`Missing closing } at ${n.name} ${n.params}`);
    }
    return o.length > 0 ? o.concat(r) : r;
  }
  function xe(t, r = []) {
    for (let o = 5; o < t.length; o++) {
      let e = t.charCodeAt(o);
      if (e === we || e === nt) {
        let n = t.slice(0, o).trim(),
          s = t.slice(o).trim();
        return U(n, s, r);
      }
    }
    return U(t.trim(), "", r);
  }
  function ot(t, r = t.indexOf(":")) {
    if (r === -1) return null;
    let o = t.indexOf("!important", r + 1);
    return a(
      t.slice(0, r).trim(),
      t.slice(r + 1, o === -1 ? t.length : o).trim(),
      o !== -1,
    );
  }
  function re(t) {
    if (arguments.length === 0)
      throw new TypeError("`CSS.escape` requires an argument.");
    let r = String(t),
      o = r.length,
      e = -1,
      n,
      s = "",
      l = r.charCodeAt(0);
    if (o === 1 && l === 45) return "\\" + r;
    for (; ++e < o; ) {
      if (((n = r.charCodeAt(e)), n === 0)) {
        s += "\uFFFD";
        continue;
      }
      if (
        (n >= 1 && n <= 31) ||
        n === 127 ||
        (e === 0 && n >= 48 && n <= 57) ||
        (e === 1 && n >= 48 && n <= 57 && l === 45)
      ) {
        s += "\\" + n.toString(16) + " ";
        continue;
      }
      if (
        n >= 128 ||
        n === 45 ||
        n === 95 ||
        (n >= 48 && n <= 57) ||
        (n >= 65 && n <= 90) ||
        (n >= 97 && n <= 122)
      ) {
        s += r.charAt(e);
        continue;
      }
      s += "\\" + r.charAt(e);
    }
    return s;
  }
  function ae(t) {
    return t.replace(/\\([\dA-Fa-f]{1,6}[\t\n\f\r ]?|[\S\s])/g, (r) =>
      r.length > 2
        ? String.fromCodePoint(Number.parseInt(r.slice(1).trim(), 16))
        : r[1],
    );
  }
  var Ot = new Map([
    ["--font", ["--font-weight", "--font-size"]],
    ["--inset", ["--inset-shadow", "--inset-ring"]],
    [
      "--text",
      [
        "--text-color",
        "--text-underline-offset",
        "--text-indent",
        "--text-decoration-thickness",
        "--text-decoration-color",
      ],
    ],
  ]);
  function Rt(t, r) {
    return (Ot.get(r) ?? []).some((o) => t === o || t.startsWith(`${o}-`));
  }
  var ze = class {
    constructor(r = new Map(), o = new Set([])) {
      this.values = r;
      this.keyframes = o;
    }
    prefix = null;
    add(r, o, e = 0) {
      if (r.endsWith("-*")) {
        if (o !== "initial")
          throw new Error(
            `Invalid theme value \`${o}\` for namespace \`${r}\``,
          );
        r === "--*"
          ? this.values.clear()
          : this.clearNamespace(r.slice(0, -2), 0);
      }
      if (e & 4) {
        let n = this.values.get(r);
        if (n && !(n.options & 4)) return;
      }
      o === "initial"
        ? this.values.delete(r)
        : this.values.set(r, { value: o, options: e });
    }
    keysInNamespaces(r) {
      let o = [];
      for (let e of r) {
        let n = `${e}-`;
        for (let s of this.values.keys())
          s.startsWith(n) &&
            s.indexOf("--", 2) === -1 &&
            (Rt(s, e) || o.push(s.slice(n.length)));
      }
      return o;
    }
    get(r) {
      for (let o of r) {
        let e = this.values.get(o);
        if (e) return e.value;
      }
      return null;
    }
    hasDefault(r) {
      return (this.getOptions(r) & 4) === 4;
    }
    getOptions(r) {
      return (r = ae(this.#r(r))), this.values.get(r)?.options ?? 0;
    }
    entries() {
      return this.prefix
        ? Array.from(this.values, (r) => ((r[0] = this.prefixKey(r[0])), r))
        : this.values.entries();
    }
    prefixKey(r) {
      return this.prefix ? `--${this.prefix}-${r.slice(2)}` : r;
    }
    #r(r) {
      return this.prefix ? `--${r.slice(3 + this.prefix.length)}` : r;
    }
    clearNamespace(r, o) {
      let e = Ot.get(r) ?? [];
      e: for (let n of this.values.keys())
        if (n.startsWith(r)) {
          if (o !== 0 && (this.getOptions(n) & o) !== o) continue;
          for (let s of e) if (n.startsWith(s)) continue e;
          this.values.delete(n);
        }
    }
    #e(r, o) {
      for (let e of o) {
        let n = r !== null ? `${e}-${r}` : e;
        if (!this.values.has(n))
          if (r !== null && r.includes(".")) {
            if (((n = `${e}-${r.replaceAll(".", "_")}`), !this.values.has(n)))
              continue;
          } else continue;
        if (!Rt(n, e)) return n;
      }
      return null;
    }
    #t(r) {
      let o = this.values.get(r);
      if (!o) return null;
      let e = null;
      return (
        o.options & 2 && (e = o.value),
        `var(${re(this.prefixKey(r))}${e ? `, ${e}` : ""})`
      );
    }
    markUsedVariable(r) {
      let o = ae(this.#r(r)),
        e = this.values.get(o);
      e && (e.options |= 16);
    }
    resolve(r, o) {
      let e = this.#e(r, o);
      if (!e) return null;
      let n = this.values.get(e);
      return n.options & 1 ? n.value : this.#t(e);
    }
    resolveValue(r, o) {
      let e = this.#e(r, o);
      return e ? this.values.get(e).value : null;
    }
    resolveWith(r, o, e = []) {
      let n = this.#e(r, o);
      if (!n) return null;
      let s = {};
      for (let p of e) {
        let c = `${n}${p}`,
          d = this.values.get(c);
        d && (d.options & 1 ? (s[p] = d.value) : (s[p] = this.#t(c)));
      }
      let l = this.values.get(n);
      return l.options & 1 ? [l.value, s] : [this.#t(n), s];
    }
    namespace(r) {
      let o = new Map(),
        e = `${r}-`;
      for (let [n, s] of this.values)
        n === r
          ? o.set(null, s.value)
          : n.startsWith(`${e}-`)
            ? o.set(n.slice(r.length), s.value)
            : n.startsWith(e) && o.set(n.slice(e.length), s.value);
      return o;
    }
    addKeyframes(r) {
      this.keyframes.add(r);
    }
    getKeyframes() {
      return Array.from(this.keyframes);
    }
  };
  var j = class extends Map {
    constructor(o) {
      super();
      this.factory = o;
    }
    get(o) {
      let e = super.get(o);
      return e === void 0 && ((e = this.factory(o, this)), this.set(o, e)), e;
    }
  };
  function lt(t) {
    return { kind: "word", value: t };
  }
  function uo(t, r) {
    return { kind: "function", value: t, nodes: r };
  }
  function co(t) {
    return { kind: "separator", value: t };
  }
  function ee(t, r, o = null) {
    for (let e = 0; e < t.length; e++) {
      let n = t[e],
        s = !1,
        l = 0,
        p =
          r(n, {
            parent: o,
            replaceWith(c) {
              (s = !0),
                Array.isArray(c)
                  ? c.length === 0
                    ? (t.splice(e, 1), (l = 0))
                    : c.length === 1
                      ? ((t[e] = c[0]), (l = 1))
                      : (t.splice(e, 1, ...c), (l = c.length))
                  : (t[e] = c);
            },
          }) ?? 0;
      if (s) {
        p === 0 ? e-- : (e += l - 1);
        continue;
      }
      if (p === 2) return 2;
      if (p !== 1 && n.kind === "function" && ee(n.nodes, r, n) === 2) return 2;
    }
  }
  function H(t) {
    let r = "";
    for (let o of t)
      switch (o.kind) {
        case "word":
        case "separator": {
          r += o.value;
          break;
        }
        case "function":
          r += o.value + "(" + H(o.nodes) + ")";
      }
    return r;
  }
  var Kt = 92,
    fo = 41,
    Pt = 58,
    Ut = 44,
    po = 34,
    _t = 61,
    Dt = 62,
    zt = 60,
    Ft = 10,
    mo = 40,
    go = 39,
    jt = 47,
    It = 32,
    Lt = 9;
  function L(t) {
    t = t.replaceAll(
      `\r
`,
      `
`,
    );
    let r = [],
      o = [],
      e = null,
      n = "",
      s;
    for (let l = 0; l < t.length; l++) {
      let p = t.charCodeAt(l);
      switch (p) {
        case Kt: {
          (n += t[l] + t[l + 1]), l++;
          break;
        }
        case Pt:
        case Ut:
        case _t:
        case Dt:
        case zt:
        case Ft:
        case jt:
        case It:
        case Lt: {
          if (n.length > 0) {
            let g = lt(n);
            e ? e.nodes.push(g) : r.push(g), (n = "");
          }
          let c = l,
            d = l + 1;
          for (
            ;
            d < t.length &&
            ((s = t.charCodeAt(d)),
            !(
              s !== Pt &&
              s !== Ut &&
              s !== _t &&
              s !== Dt &&
              s !== zt &&
              s !== Ft &&
              s !== jt &&
              s !== It &&
              s !== Lt
            ));
            d++
          );
          l = d - 1;
          let u = co(t.slice(c, d));
          e ? e.nodes.push(u) : r.push(u);
          break;
        }
        case go:
        case po: {
          let c = l;
          for (let d = l + 1; d < t.length; d++)
            if (((s = t.charCodeAt(d)), s === Kt)) d += 1;
            else if (s === p) {
              l = d;
              break;
            }
          n += t.slice(c, l + 1);
          break;
        }
        case mo: {
          let c = uo(n, []);
          (n = ""), e ? e.nodes.push(c) : r.push(c), o.push(c), (e = c);
          break;
        }
        case fo: {
          let c = o.pop();
          if (n.length > 0) {
            let d = lt(n);
            c.nodes.push(d), (n = "");
          }
          o.length > 0 ? (e = o[o.length - 1]) : (e = null);
          break;
        }
        default:
          n += String.fromCharCode(p);
      }
    }
    return n.length > 0 && r.push(lt(n)), r;
  }
  function Fe(t) {
    let r = [];
    return (
      ee(L(t), (o) => {
        if (!(o.kind !== "function" || o.value !== "var"))
          return (
            ee(o.nodes, (e) => {
              e.kind !== "word" ||
                e.value[0] !== "-" ||
                e.value[1] !== "-" ||
                r.push(e.value);
            }),
            1
          );
      }),
      r
    );
  }
  var bo = 64;
  function z(t, r = []) {
    return { kind: "rule", selector: t, nodes: r };
  }
  function U(t, r = "", o = []) {
    return { kind: "at-rule", name: t, params: r, nodes: o };
  }
  function M(t, r = []) {
    return t.charCodeAt(0) === bo ? xe(t, r) : z(t, r);
  }
  function a(t, r, o = !1) {
    return { kind: "declaration", property: t, value: r, important: o };
  }
  function De(t) {
    return { kind: "comment", value: t };
  }
  function Q(t, r) {
    return { kind: "context", context: t, nodes: r };
  }
  function D(t) {
    return { kind: "at-root", nodes: t };
  }
  function _(t, r, o = [], e = {}) {
    for (let n = 0; n < t.length; n++) {
      let s = t[n],
        l = o[o.length - 1] ?? null;
      if (s.kind === "context") {
        if (_(s.nodes, r, o, { ...e, ...s.context }) === 2) return 2;
        continue;
      }
      o.push(s);
      let p = !1,
        c = 0,
        d =
          r(s, {
            parent: l,
            context: e,
            path: o,
            replaceWith(u) {
              (p = !0),
                Array.isArray(u)
                  ? u.length === 0
                    ? (t.splice(n, 1), (c = 0))
                    : u.length === 1
                      ? ((t[n] = u[0]), (c = 1))
                      : (t.splice(n, 1, ...u), (c = u.length))
                  : ((t[n] = u), (c = 1));
            },
          }) ?? 0;
      if ((o.pop(), p)) {
        d === 0 ? n-- : (n += c - 1);
        continue;
      }
      if (d === 2) return 2;
      if (d !== 1 && "nodes" in s) {
        o.push(s);
        let u = _(s.nodes, r, o, e);
        if ((o.pop(), u === 2)) return 2;
      }
    }
  }
  function je(t, r, o = [], e = {}) {
    for (let n = 0; n < t.length; n++) {
      let s = t[n],
        l = o[o.length - 1] ?? null;
      if (s.kind === "rule" || s.kind === "at-rule")
        o.push(s), je(s.nodes, r, o, e), o.pop();
      else if (s.kind === "context") {
        je(s.nodes, r, o, { ...e, ...s.context });
        continue;
      }
      o.push(s),
        r(s, {
          parent: l,
          context: e,
          path: o,
          replaceWith(p) {
            Array.isArray(p)
              ? p.length === 0
                ? t.splice(n, 1)
                : p.length === 1
                  ? (t[n] = p[0])
                  : t.splice(n, 1, ...p)
              : (t[n] = p),
              (n += p.length - 1);
          },
        }),
        o.pop();
    }
  }
  function se(t, r) {
    let o = [],
      e = new Set(),
      n = new j(() => new Set()),
      s = new Set(),
      l = new Set(),
      p = new j(() => new Set());
    function c(u, g, m = {}, v = 0) {
      if (u.kind === "declaration") {
        if (
          u.property === "--tw-sort" ||
          u.value === void 0 ||
          u.value === null
        )
          return;
        if (
          (m.theme &&
            u.property[0] === "-" &&
            u.property[1] === "-" &&
            (m.keyframes || n.get(g).add(u)),
          u.value.includes("var("))
        )
          if (m.theme && u.property[0] === "-" && u.property[1] === "-")
            for (let y of Fe(u.value)) p.get(y).add(u.property);
          else r.trackUsedVariables(u.value);
        if (u.property === "animation") {
          let y = u.value.split(/\s+/);
          for (let b of y) l.add(b);
        }
        g.push(u);
      } else if (u.kind === "rule")
        if (u.selector === "&")
          for (let y of u.nodes) {
            let b = [];
            c(y, b, m, v + 1), b.length > 0 && g.push(...b);
          }
        else {
          let y = { ...u, nodes: [] };
          for (let b of u.nodes) c(b, y.nodes, m, v + 1);
          y.nodes.length > 0 && g.push(y);
        }
      else if (u.kind === "at-rule" && u.name === "@property" && v === 0) {
        if (e.has(u.params)) return;
        e.add(u.params);
        let y = { ...u, nodes: [] };
        for (let b of u.nodes) c(b, y.nodes, m, v + 1);
        g.push(y);
      } else if (u.kind === "at-rule") {
        u.name === "@keyframes" && (m = { ...m, keyframes: !0 });
        let y = { ...u, nodes: [] };
        for (let b of u.nodes) c(b, y.nodes, m, v + 1);
        u.name === "@keyframes" && m.theme && s.add(y),
          (y.nodes.length > 0 ||
            y.name === "@layer" ||
            y.name === "@charset" ||
            y.name === "@custom-media" ||
            y.name === "@namespace" ||
            y.name === "@import") &&
            g.push(y);
      } else if (u.kind === "at-root")
        for (let y of u.nodes) {
          let b = [];
          c(y, b, m, 0);
          for (let x of b) o.push(x);
        }
      else if (u.kind === "context") {
        if (u.context.reference) return;
        for (let y of u.nodes) c(y, g, { ...m, ...u.context }, v);
      } else u.kind === "comment" && g.push(u);
    }
    let d = [];
    for (let u of t) c(u, d, {}, 0);
    e: for (let [u, g] of n)
      for (let m of g) {
        if (Mt(m.property, r.theme, p)) {
          if (m.property.startsWith(r.theme.prefixKey("--animate-"))) {
            let b = m.value.split(/\s+/);
            for (let x of b) l.add(x);
          }
          continue;
        }
        let y = u.indexOf(m);
        if ((u.splice(y, 1), u.length === 0)) {
          let b = yo(d, (x) => x.kind === "rule" && x.nodes === u);
          if (!b || b.length === 0) continue e;
          b.unshift({ kind: "at-root", nodes: d });
          do {
            let x = b.pop();
            if (!x) break;
            let $ = b[b.length - 1];
            if (!$ || ($.kind !== "at-root" && $.kind !== "at-rule")) break;
            let V = $.nodes.indexOf(x);
            if (V === -1) break;
            $.nodes.splice(V, 1);
          } while (!0);
          continue e;
        }
      }
    for (let u of s)
      if (!l.has(u.params)) {
        let g = o.indexOf(u);
        o.splice(g, 1);
      }
    return d.concat(o);
  }
  function Y(t) {
    function r(e, n = 0) {
      let s = "",
        l = "  ".repeat(n);
      if (e.kind === "declaration")
        s += `${l}${e.property}: ${e.value}${e.important ? " !important" : ""};
`;
      else if (e.kind === "rule") {
        s += `${l}${e.selector} {
`;
        for (let p of e.nodes) s += r(p, n + 1);
        s += `${l}}
`;
      } else if (e.kind === "at-rule") {
        if (e.nodes.length === 0)
          return `${l}${e.name} ${e.params};
`;
        s += `${l}${e.name}${e.params ? ` ${e.params} ` : " "}{
`;
        for (let p of e.nodes) s += r(p, n + 1);
        s += `${l}}
`;
      } else if (e.kind === "comment")
        s += `${l}/*${e.value}*/
`;
      else if (e.kind === "context" || e.kind === "at-root") return "";
      return s;
    }
    let o = "";
    for (let e of t) {
      let n = r(e);
      n !== "" && (o += n);
    }
    return o;
  }
  function yo(t, r) {
    let o = [];
    return (
      _(t, (e, { path: n }) => {
        if (r(e)) return (o = [...n]), 2;
      }),
      o
    );
  }
  function Mt(t, r, o, e = new Set()) {
    if (e.has(t) || (e.add(t), r.getOptions(t) & 24)) return !0;
    {
      let s = o.get(t) ?? [];
      for (let l of s) if (Mt(l, r, o, e)) return !0;
    }
    return !1;
  }
  var st = [
      "calc",
      "min",
      "max",
      "clamp",
      "mod",
      "rem",
      "sin",
      "cos",
      "tan",
      "asin",
      "acos",
      "atan",
      "atan2",
      "pow",
      "sqrt",
      "hypot",
      "log",
      "exp",
      "round",
    ],
    Ie = ["anchor-size"],
    Bt = new RegExp(`(${Ie.join("|")})\\(`, "g");
  function Ce(t) {
    return t.indexOf("(") !== -1 && st.some((r) => t.includes(`${r}(`));
  }
  function Wt(t) {
    if (!st.some((n) => t.includes(n))) return t;
    let r = !1;
    Ie.some((n) => t.includes(n)) &&
      ((Bt.lastIndex = 0),
      (t = t.replace(Bt, (n, s) => ((r = !0), `$${Ie.indexOf(s)}$(`))));
    let o = "",
      e = [];
    for (let n = 0; n < t.length; n++) {
      let s = t[n];
      if (s === "(") {
        o += s;
        let l = n;
        for (let c = n - 1; c >= 0; c--) {
          let d = t.charCodeAt(c);
          if (d >= 48 && d <= 57) l = c;
          else if (d >= 97 && d <= 122) l = c;
          else break;
        }
        let p = t.slice(l, n);
        if (st.includes(p)) {
          e.unshift(!0);
          continue;
        } else if (e[0] && p === "") {
          e.unshift(!0);
          continue;
        }
        e.unshift(!1);
        continue;
      } else if (s === ")") (o += s), e.shift();
      else if (s === "," && e[0]) {
        o += ", ";
        continue;
      } else {
        if (s === " " && e[0] && o[o.length - 1] === " ") continue;
        if ((s === "+" || s === "*" || s === "/" || s === "-") && e[0]) {
          let l = o.trimEnd(),
            p = l[l.length - 1];
          if (p === "+" || p === "*" || p === "/" || p === "-") {
            o += s;
            continue;
          } else if (p === "(" || p === ",") {
            o += s;
            continue;
          } else t[n - 1] === " " ? (o += `${s} `) : (o += ` ${s} `);
        } else if (e[0] && t.startsWith("to-zero", n)) {
          let l = n;
          (n += 7), (o += t.slice(l, n + 1));
        } else o += s;
      }
    }
    return r ? o.replace(/\$(\d+)\$/g, (n, s) => Ie[s] ?? n) : o;
  }
  function oe(t) {
    if (t.indexOf("(") === -1) return me(t);
    let r = L(t);
    return ut(r), (t = H(r)), (t = Wt(t)), t;
  }
  function me(t, r = !1) {
    let o = "";
    for (let e = 0; e < t.length; e++) {
      let n = t[e];
      n === "\\" && t[e + 1] === "_"
        ? ((o += "_"), (e += 1))
        : n === "_" && !r
          ? (o += " ")
          : (o += n);
    }
    return o;
  }
  function ut(t) {
    for (let r of t)
      switch (r.kind) {
        case "function": {
          if (r.value === "url" || r.value.endsWith("_url")) {
            r.value = me(r.value);
            break;
          }
          if (
            r.value === "var" ||
            r.value.endsWith("_var") ||
            r.value === "theme" ||
            r.value.endsWith("_theme")
          ) {
            r.value = me(r.value);
            for (let o = 0; o < r.nodes.length; o++) {
              if (o == 0 && r.nodes[o].kind === "word") {
                r.nodes[o].value = me(r.nodes[o].value, !0);
                continue;
              }
              ut([r.nodes[o]]);
            }
            break;
          }
          (r.value = me(r.value)), ut(r.nodes);
          break;
        }
        case "separator":
        case "word": {
          r.value = me(r.value);
          break;
        }
        default:
          vo(r);
      }
  }
  function vo(t) {
    throw new Error(`Unexpected value: ${t}`);
  }
  var Le = new Uint8Array(256);
  function P(t, r) {
    let o = 0,
      e = [],
      n = 0,
      s = t.length,
      l = r.charCodeAt(0);
    for (let p = 0; p < s; p++) {
      let c = t.charCodeAt(p);
      if (o === 0 && c === l) {
        e.push(t.slice(n, p)), (n = p + 1);
        continue;
      }
      switch (c) {
        case 92:
          p += 1;
          break;
        case 39:
        case 34:
          for (; ++p < s; ) {
            let d = t.charCodeAt(p);
            if (d === 92) {
              p += 1;
              continue;
            }
            if (d === c) break;
          }
          break;
        case 40:
          (Le[o] = 41), o++;
          break;
        case 91:
          (Le[o] = 93), o++;
          break;
        case 123:
          (Le[o] = 125), o++;
          break;
        case 93:
        case 125:
        case 41:
          o > 0 && c === Le[o - 1] && o--;
          break;
      }
    }
    return e.push(t.slice(n)), e;
  }
  var ko = 58,
    qt = 45,
    Ht = 97,
    Gt = 122;
  function* Yt(t, r) {
    let o = P(t, ":");
    if (r.theme.prefix) {
      if (o.length === 1 || o[0] !== r.theme.prefix) return null;
      o.shift();
    }
    let e = o.pop(),
      n = [];
    for (let g = o.length - 1; g >= 0; --g) {
      let m = r.parseVariant(o[g]);
      if (m === null) return;
      n.push(m);
    }
    let s = !1;
    e[e.length - 1] === "!"
      ? ((s = !0), (e = e.slice(0, -1)))
      : e[0] === "!" && ((s = !0), (e = e.slice(1))),
      r.utilities.has(e, "static") &&
        !e.includes("[") &&
        (yield { kind: "static", root: e, variants: n, important: s, raw: t });
    let [l, p = null, c] = P(e, "/");
    if (c) return;
    let d = p === null ? null : ct(p);
    if (p !== null && d === null) return;
    if (l[0] === "[") {
      if (l[l.length - 1] !== "]") return;
      let g = l.charCodeAt(1);
      if (g !== qt && !(g >= Ht && g <= Gt)) return;
      l = l.slice(1, -1);
      let m = l.indexOf(":");
      if (m === -1 || m === 0 || m === l.length - 1) return;
      let v = l.slice(0, m),
        y = oe(l.slice(m + 1));
      yield {
        kind: "arbitrary",
        property: v,
        value: y,
        modifier: d,
        variants: n,
        important: s,
        raw: t,
      };
      return;
    }
    let u;
    if (l[l.length - 1] === "]") {
      let g = l.indexOf("-[");
      if (g === -1) return;
      let m = l.slice(0, g);
      if (!r.utilities.has(m, "functional")) return;
      let v = l.slice(g + 1);
      u = [[m, v]];
    } else if (l[l.length - 1] === ")") {
      let g = l.indexOf("-(");
      if (g === -1) return;
      let m = l.slice(0, g);
      if (!r.utilities.has(m, "functional")) return;
      let v = l.slice(g + 2, -1),
        y = P(v, ":"),
        b = null;
      if (
        (y.length === 2 && ((b = y[0]), (v = y[1])),
        v[0] !== "-" && v[1] !== "-")
      )
        return;
      u = [[m, b === null ? `[var(${v})]` : `[${b}:var(${v})]`]];
    } else u = Zt(l, (g) => r.utilities.has(g, "functional"));
    for (let [g, m] of u) {
      let v = {
        kind: "functional",
        root: g,
        modifier: d,
        value: null,
        variants: n,
        important: s,
        raw: t,
      };
      if (m === null) {
        yield v;
        continue;
      }
      {
        let y = m.indexOf("[");
        if (y !== -1) {
          if (m[m.length - 1] !== "]") return;
          let x = oe(m.slice(y + 1, -1)),
            $ = "";
          for (let V = 0; V < x.length; V++) {
            let O = x.charCodeAt(V);
            if (O === ko) {
              ($ = x.slice(0, V)), (x = x.slice(V + 1));
              break;
            }
            if (!(O === qt || (O >= Ht && O <= Gt))) break;
          }
          if (x.length === 0 || x.trim().length === 0) continue;
          v.value = { kind: "arbitrary", dataType: $ || null, value: x };
        } else {
          let x =
            p === null || v.modifier?.kind === "arbitrary" ? null : `${m}/${p}`;
          v.value = { kind: "named", value: m, fraction: x };
        }
      }
      yield v;
    }
  }
  function ct(t) {
    if (t[0] === "[" && t[t.length - 1] === "]") {
      let r = oe(t.slice(1, -1));
      return r.length === 0 || r.trim().length === 0
        ? null
        : { kind: "arbitrary", value: r };
    }
    if (t[0] === "(" && t[t.length - 1] === ")") {
      let r = oe(t.slice(1, -1));
      return r.length === 0 ||
        r.trim().length === 0 ||
        (r[0] !== "-" && r[1] !== "-")
        ? null
        : { kind: "arbitrary", value: `var(${r})` };
    }
    return { kind: "named", value: t };
  }
  function Jt(t, r) {
    if (t[0] === "[" && t[t.length - 1] === "]") {
      if (t[1] === "@" && t.includes("&")) return null;
      let o = oe(t.slice(1, -1));
      if (o.length === 0 || o.trim().length === 0) return null;
      let e = o[0] === ">" || o[0] === "+" || o[0] === "~";
      return (
        !e && o[0] !== "@" && !o.includes("&") && (o = `&:is(${o})`),
        { kind: "arbitrary", selector: o, relative: e }
      );
    }
    {
      let [o, e = null, n] = P(t, "/");
      if (n) return null;
      let s = Zt(o, (l) => r.variants.has(l));
      for (let [l, p] of s)
        switch (r.variants.kind(l)) {
          case "static":
            return p !== null || e !== null
              ? null
              : { kind: "static", root: l };
          case "functional": {
            let c = e === null ? null : ct(e);
            if (e !== null && c === null) return null;
            if (p === null)
              return { kind: "functional", root: l, modifier: c, value: null };
            if (p[p.length - 1] === "]") {
              if (p[0] !== "[") continue;
              let d = oe(p.slice(1, -1));
              return d.length === 0 || d.trim().length === 0
                ? null
                : {
                    kind: "functional",
                    root: l,
                    modifier: c,
                    value: { kind: "arbitrary", value: d },
                  };
            }
            if (p[p.length - 1] === ")") {
              if (p[0] !== "(") continue;
              let d = oe(p.slice(1, -1));
              return d.length === 0 ||
                d.trim().length === 0 ||
                (d[0] !== "-" && d[1] !== "-")
                ? null
                : {
                    kind: "functional",
                    root: l,
                    modifier: c,
                    value: { kind: "arbitrary", value: `var(${d})` },
                  };
            }
            return {
              kind: "functional",
              root: l,
              modifier: c,
              value: { kind: "named", value: p },
            };
          }
          case "compound": {
            if (p === null) return null;
            let c = r.parseVariant(p);
            if (c === null || !r.variants.compoundsWith(l, c)) return null;
            let d = e === null ? null : ct(e);
            return e !== null && d === null
              ? null
              : { kind: "compound", root: l, modifier: d, variant: c };
          }
        }
    }
    return null;
  }
  function* Zt(t, r) {
    r(t) && (yield [t, null]);
    let o = t.lastIndexOf("-");
    if (o === -1) {
      t[0] === "@" && r("@") && (yield ["@", t.slice(1)]);
      return;
    }
    do {
      let e = t.slice(0, o);
      if (r(e)) {
        let n = [e, t.slice(o + 1)];
        if (n[1] === "") break;
        yield n;
      }
      o = t.lastIndexOf("-", o - 1);
    } while (o > 0);
  }
  function ue(t, r, o) {
    if (t === r) return 0;
    let e = t.indexOf("("),
      n = r.indexOf("("),
      s = e === -1 ? t.replace(/[\d.]+/g, "") : t.slice(0, e),
      l = n === -1 ? r.replace(/[\d.]+/g, "") : r.slice(0, n),
      p =
        (s === l ? 0 : s < l ? -1 : 1) ||
        (o === "asc" ? parseInt(t) - parseInt(r) : parseInt(r) - parseInt(t));
    return Number.isNaN(p) ? (t < r ? -1 : 1) : p;
  }
  var wo = new Set([
      "black",
      "silver",
      "gray",
      "white",
      "maroon",
      "red",
      "purple",
      "fuchsia",
      "green",
      "lime",
      "olive",
      "yellow",
      "navy",
      "blue",
      "teal",
      "aqua",
      "aliceblue",
      "antiquewhite",
      "aqua",
      "aquamarine",
      "azure",
      "beige",
      "bisque",
      "black",
      "blanchedalmond",
      "blue",
      "blueviolet",
      "brown",
      "burlywood",
      "cadetblue",
      "chartreuse",
      "chocolate",
      "coral",
      "cornflowerblue",
      "cornsilk",
      "crimson",
      "cyan",
      "darkblue",
      "darkcyan",
      "darkgoldenrod",
      "darkgray",
      "darkgreen",
      "darkgrey",
      "darkkhaki",
      "darkmagenta",
      "darkolivegreen",
      "darkorange",
      "darkorchid",
      "darkred",
      "darksalmon",
      "darkseagreen",
      "darkslateblue",
      "darkslategray",
      "darkslategrey",
      "darkturquoise",
      "darkviolet",
      "deeppink",
      "deepskyblue",
      "dimgray",
      "dimgrey",
      "dodgerblue",
      "firebrick",
      "floralwhite",
      "forestgreen",
      "fuchsia",
      "gainsboro",
      "ghostwhite",
      "gold",
      "goldenrod",
      "gray",
      "green",
      "greenyellow",
      "grey",
      "honeydew",
      "hotpink",
      "indianred",
      "indigo",
      "ivory",
      "khaki",
      "lavender",
      "lavenderblush",
      "lawngreen",
      "lemonchiffon",
      "lightblue",
      "lightcoral",
      "lightcyan",
      "lightgoldenrodyellow",
      "lightgray",
      "lightgreen",
      "lightgrey",
      "lightpink",
      "lightsalmon",
      "lightseagreen",
      "lightskyblue",
      "lightslategray",
      "lightslategrey",
      "lightsteelblue",
      "lightyellow",
      "lime",
      "limegreen",
      "linen",
      "magenta",
      "maroon",
      "mediumaquamarine",
      "mediumblue",
      "mediumorchid",
      "mediumpurple",
      "mediumseagreen",
      "mediumslateblue",
      "mediumspringgreen",
      "mediumturquoise",
      "mediumvioletred",
      "midnightblue",
      "mintcream",
      "mistyrose",
      "moccasin",
      "navajowhite",
      "navy",
      "oldlace",
      "olive",
      "olivedrab",
      "orange",
      "orangered",
      "orchid",
      "palegoldenrod",
      "palegreen",
      "paleturquoise",
      "palevioletred",
      "papayawhip",
      "peachpuff",
      "peru",
      "pink",
      "plum",
      "powderblue",
      "purple",
      "rebeccapurple",
      "red",
      "rosybrown",
      "royalblue",
      "saddlebrown",
      "salmon",
      "sandybrown",
      "seagreen",
      "seashell",
      "sienna",
      "silver",
      "skyblue",
      "slateblue",
      "slategray",
      "slategrey",
      "snow",
      "springgreen",
      "steelblue",
      "tan",
      "teal",
      "thistle",
      "tomato",
      "turquoise",
      "violet",
      "wheat",
      "white",
      "whitesmoke",
      "yellow",
      "yellowgreen",
      "transparent",
      "currentcolor",
      "canvas",
      "canvastext",
      "linktext",
      "visitedtext",
      "activetext",
      "buttonface",
      "buttontext",
      "buttonborder",
      "field",
      "fieldtext",
      "highlight",
      "highlighttext",
      "selecteditem",
      "selecteditemtext",
      "mark",
      "marktext",
      "graytext",
      "accentcolor",
      "accentcolortext",
    ]),
    xo = /^(rgba?|hsla?|hwb|color|(ok)?(lab|lch)|light-dark|color-mix)\(/i;
  function Qt(t) {
    return t.charCodeAt(0) === 35 || xo.test(t) || wo.has(t.toLowerCase());
  }
  var Ao = {
    color: Qt,
    length: dt,
    percentage: ft,
    ratio: Do,
    number: Po,
    integer: N,
    url: Xt,
    position: jo,
    "bg-size": Io,
    "line-width": So,
    image: To,
    "family-name": Eo,
    "generic-name": Vo,
    "absolute-size": Ro,
    "relative-size": Oo,
    angle: Bo,
    vector: qo,
  };
  function I(t, r) {
    if (t.startsWith("var(")) return null;
    for (let o of r) if (Ao[o]?.(t)) return o;
    return null;
  }
  var Co = /^url\(.*\)$/;
  function Xt(t) {
    return Co.test(t);
  }
  function So(t) {
    return t === "thin" || t === "medium" || t === "thick";
  }
  var No = /^(?:element|image|cross-fade|image-set)\(/,
    $o = /^(repeating-)?(conic|linear|radial)-gradient\(/;
  function To(t) {
    let r = 0;
    for (let o of P(t, ","))
      if (!o.startsWith("var(")) {
        if (Xt(o)) {
          r += 1;
          continue;
        }
        if ($o.test(o)) {
          r += 1;
          continue;
        }
        if (No.test(o)) {
          r += 1;
          continue;
        }
        return !1;
      }
    return r > 0;
  }
  function Vo(t) {
    return (
      t === "serif" ||
      t === "sans-serif" ||
      t === "monospace" ||
      t === "cursive" ||
      t === "fantasy" ||
      t === "system-ui" ||
      t === "ui-serif" ||
      t === "ui-sans-serif" ||
      t === "ui-monospace" ||
      t === "ui-rounded" ||
      t === "math" ||
      t === "emoji" ||
      t === "fangsong"
    );
  }
  function Eo(t) {
    let r = 0;
    for (let o of P(t, ",")) {
      let e = o.charCodeAt(0);
      if (e >= 48 && e <= 57) return !1;
      o.startsWith("var(") || (r += 1);
    }
    return r > 0;
  }
  function Ro(t) {
    return (
      t === "xx-small" ||
      t === "x-small" ||
      t === "small" ||
      t === "medium" ||
      t === "large" ||
      t === "x-large" ||
      t === "xx-large" ||
      t === "xxx-large"
    );
  }
  function Oo(t) {
    return t === "larger" || t === "smaller";
  }
  var te = /[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?/,
    Ko = new RegExp(`^${te.source}$`);
  function Po(t) {
    return Ko.test(t) || Ce(t);
  }
  var Uo = new RegExp(`^${te.source}%$`);
  function ft(t) {
    return Uo.test(t) || Ce(t);
  }
  var _o = new RegExp(`^${te.source}s*/s*${te.source}$`);
  function Do(t) {
    return _o.test(t) || Ce(t);
  }
  var zo = [
      "cm",
      "mm",
      "Q",
      "in",
      "pc",
      "pt",
      "px",
      "em",
      "ex",
      "ch",
      "rem",
      "lh",
      "rlh",
      "vw",
      "vh",
      "vmin",
      "vmax",
      "vb",
      "vi",
      "svw",
      "svh",
      "lvw",
      "lvh",
      "dvw",
      "dvh",
      "cqw",
      "cqh",
      "cqi",
      "cqb",
      "cqmin",
      "cqmax",
    ],
    Fo = new RegExp(`^${te.source}(${zo.join("|")})$`);
  function dt(t) {
    return Fo.test(t) || Ce(t);
  }
  function jo(t) {
    let r = 0;
    for (let o of P(t, " ")) {
      if (
        o === "center" ||
        o === "top" ||
        o === "right" ||
        o === "bottom" ||
        o === "left"
      ) {
        r += 1;
        continue;
      }
      if (!o.startsWith("var(")) {
        if (dt(o) || ft(o)) {
          r += 1;
          continue;
        }
        return !1;
      }
    }
    return r > 0;
  }
  function Io(t) {
    let r = 0;
    for (let o of P(t, ",")) {
      if (o === "cover" || o === "contain") {
        r += 1;
        continue;
      }
      let e = P(o, " ");
      if (e.length !== 1 && e.length !== 2) return !1;
      if (e.every((n) => n === "auto" || dt(n) || ft(n))) {
        r += 1;
        continue;
      }
    }
    return r > 0;
  }
  var Lo = ["deg", "rad", "grad", "turn"],
    Mo = new RegExp(`^${te.source}(${Lo.join("|")})$`);
  function Bo(t) {
    return Mo.test(t);
  }
  var Wo = new RegExp(`^${te.source} +${te.source} +${te.source}$`);
  function qo(t) {
    return Wo.test(t);
  }
  function N(t) {
    let r = Number(t);
    return Number.isInteger(r) && r >= 0 && String(r) === String(t);
  }
  function pt(t) {
    let r = Number(t);
    return Number.isInteger(r) && r > 0 && String(r) === String(t);
  }
  function ge(t) {
    return er(t, 0.25);
  }
  function Me(t) {
    return er(t, 0.25);
  }
  function er(t, r) {
    let o = Number(t);
    return o >= 0 && o % r === 0 && String(o) === String(t);
  }
  var Ho = new Set(["inset", "inherit", "initial", "revert", "unset"]),
    tr = /^-?(\d+|\.\d+)(.*?)$/g;
  function ce(t, r) {
    return P(t, ",")
      .map((e) => {
        e = e.trim();
        let n = P(e, " ").filter((d) => d.trim() !== ""),
          s = null,
          l = null,
          p = null;
        for (let d of n)
          Ho.has(d) ||
            (tr.test(d)
              ? (l === null ? (l = d) : p === null && (p = d),
                (tr.lastIndex = 0))
              : s === null && (s = d));
        if (l === null || p === null) return e;
        let c = r(s ?? "currentcolor");
        return s !== null ? e.replace(s, c) : `${e} ${c}`;
      })
      .join(", ");
  }
  var Yo = /^-?[a-z][a-zA-Z0-9/%._-]*$/,
    Jo = /^-?[a-z][a-zA-Z0-9/%._-]*-\*$/,
    mt = class {
      utilities = new j(() => []);
      completions = new Map();
      static(r, o) {
        this.utilities.get(r).push({ kind: "static", compileFn: o });
      }
      functional(r, o, e) {
        this.utilities
          .get(r)
          .push({ kind: "functional", compileFn: o, options: e });
      }
      has(r, o) {
        return (
          this.utilities.has(r) &&
          this.utilities.get(r).some((e) => e.kind === o)
        );
      }
      get(r) {
        return this.utilities.has(r) ? this.utilities.get(r) : [];
      }
      getCompletions(r) {
        return this.completions.get(r)?.() ?? [];
      }
      suggest(r, o) {
        this.completions.set(r, o);
      }
      keys(r) {
        let o = [];
        for (let [e, n] of this.utilities.entries())
          for (let s of n)
            if (s.kind === r) {
              o.push(e);
              break;
            }
        return o;
      }
    };
  function S(t, r, o) {
    return U("@property", t, [
      a("syntax", o ? `"${o}"` : '"*"'),
      a("inherits", "false"),
      ...(r ? [a("initial-value", r)] : []),
    ]);
  }
  function J(t, r) {
    if (r === null) return t;
    let o = Number(r);
    return (
      Number.isNaN(o) || (r = `${o * 100}%`),
      `color-mix(in oklab, ${t} ${r}, transparent)`
    );
  }
  function B(t, r, o) {
    if (!r) return t;
    if (r.kind === "arbitrary") return J(t, r.value);
    let e = o.resolve(r.value, ["--opacity"]);
    return e ? J(t, e) : Me(r.value) ? J(t, `${r.value}%`) : null;
  }
  function G(t, r, o) {
    let e = null;
    switch (t.value.value) {
      case "inherit": {
        e = "inherit";
        break;
      }
      case "transparent": {
        e = "transparent";
        break;
      }
      case "current": {
        e = "currentColor";
        break;
      }
      default: {
        e = r.resolve(t.value.value, o);
        break;
      }
    }
    return e ? B(e, t.modifier, r) : null;
  }
  function or(t) {
    let r = new mt();
    function o(i, f) {
      let h = /(\d+)_(\d+)/g;
      function* w(T) {
        for (let E of t.keysInNamespaces(T))
          yield E.replace(h, (C, A, F) => `${A}.${F}`);
      }
      let k = [
        "1/2",
        "1/3",
        "2/3",
        "1/4",
        "2/4",
        "3/4",
        "1/5",
        "2/5",
        "3/5",
        "4/5",
        "1/6",
        "2/6",
        "3/6",
        "4/6",
        "5/6",
        "1/12",
        "2/12",
        "3/12",
        "4/12",
        "5/12",
        "6/12",
        "7/12",
        "8/12",
        "9/12",
        "10/12",
        "11/12",
      ];
      r.suggest(i, () => {
        let T = [];
        for (let E of f()) {
          if (typeof E == "string") {
            T.push({ values: [E], modifiers: [] });
            continue;
          }
          let C = [...(E.values ?? []), ...w(E.valueThemeKeys ?? [])],
            A = [...(E.modifiers ?? []), ...w(E.modifierThemeKeys ?? [])];
          E.supportsFractions && C.push(...k),
            E.hasDefaultValue && C.unshift(null),
            T.push({
              supportsNegative: E.supportsNegative,
              values: C,
              modifiers: A,
            });
        }
        return T;
      });
    }
    function e(i, f) {
      r.static(i, () =>
        f.map((h) => (typeof h == "function" ? h() : a(h[0], h[1]))),
      );
    }
    function n(i, f) {
      function h({ negative: w }) {
        return (k) => {
          let T = null;
          if (k.value)
            if (k.value.kind === "arbitrary") {
              if (k.modifier) return;
              T = k.value.value;
            } else {
              if (
                ((T = t.resolve(
                  k.value.fraction ?? k.value.value,
                  f.themeKeys ?? [],
                )),
                T === null && f.supportsFractions && k.value.fraction)
              ) {
                let [E, C] = P(k.value.fraction, "/");
                if (!N(E) || !N(C)) return;
                T = `calc(${k.value.fraction} * 100%)`;
              }
              if (T === null && w && f.handleNegativeBareValue) {
                if (
                  ((T = f.handleNegativeBareValue(k.value)),
                  !T?.includes("/") && k.modifier)
                )
                  return;
                if (T !== null) return f.handle(T);
              }
              if (
                T === null &&
                f.handleBareValue &&
                ((T = f.handleBareValue(k.value)),
                !T?.includes("/") && k.modifier)
              )
                return;
            }
          else {
            if (k.modifier) return;
            T =
              f.defaultValue !== void 0
                ? f.defaultValue
                : t.resolve(null, f.themeKeys ?? []);
          }
          if (T !== null) return f.handle(w ? `calc(${T} * -1)` : T);
        };
      }
      f.supportsNegative && r.functional(`-${i}`, h({ negative: !0 })),
        r.functional(i, h({ negative: !1 })),
        o(i, () => [
          {
            supportsNegative: f.supportsNegative,
            valueThemeKeys: f.themeKeys ?? [],
            hasDefaultValue:
              f.defaultValue !== void 0 && f.defaultValue !== null,
            supportsFractions: f.supportsFractions,
          },
        ]);
    }
    function s(i, f) {
      r.functional(i, (h) => {
        if (!h.value) return;
        let w = null;
        if (
          (h.value.kind === "arbitrary"
            ? ((w = h.value.value), (w = B(w, h.modifier, t)))
            : (w = G(h, t, f.themeKeys)),
          w !== null)
        )
          return f.handle(w);
      }),
        o(i, () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: f.themeKeys,
            modifiers: Array.from({ length: 21 }, (h, w) => `${w * 5}`),
          },
        ]);
    }
    function l(
      i,
      f,
      h,
      { supportsNegative: w = !1, supportsFractions: k = !1 } = {},
    ) {
      w && r.static(`-${i}-px`, () => h("-1px")),
        r.static(`${i}-px`, () => h("1px")),
        n(i, {
          themeKeys: f,
          supportsFractions: k,
          supportsNegative: w,
          defaultValue: null,
          handleBareValue: ({ value: T }) => {
            let E = t.resolve(null, ["--spacing"]);
            return !E || !ge(T) ? null : `calc(${E} * ${T})`;
          },
          handleNegativeBareValue: ({ value: T }) => {
            let E = t.resolve(null, ["--spacing"]);
            return !E || !ge(T) ? null : `calc(${E} * -${T})`;
          },
          handle: h,
        }),
        o(i, () => [
          {
            values: t.get(["--spacing"])
              ? [
                  "0",
                  "0.5",
                  "1",
                  "1.5",
                  "2",
                  "2.5",
                  "3",
                  "3.5",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                  "14",
                  "16",
                  "20",
                  "24",
                  "28",
                  "32",
                  "36",
                  "40",
                  "44",
                  "48",
                  "52",
                  "56",
                  "60",
                  "64",
                  "72",
                  "80",
                  "96",
                ]
              : [],
            supportsNegative: w,
            supportsFractions: k,
            valueThemeKeys: f,
          },
        ]);
    }
    e("sr-only", [
      ["position", "absolute"],
      ["width", "1px"],
      ["height", "1px"],
      ["padding", "0"],
      ["margin", "-1px"],
      ["overflow", "hidden"],
      ["clip", "rect(0, 0, 0, 0)"],
      ["white-space", "nowrap"],
      ["border-width", "0"],
    ]),
      e("not-sr-only", [
        ["position", "static"],
        ["width", "auto"],
        ["height", "auto"],
        ["padding", "0"],
        ["margin", "0"],
        ["overflow", "visible"],
        ["clip", "auto"],
        ["white-space", "normal"],
      ]),
      e("pointer-events-none", [["pointer-events", "none"]]),
      e("pointer-events-auto", [["pointer-events", "auto"]]),
      e("visible", [["visibility", "visible"]]),
      e("invisible", [["visibility", "hidden"]]),
      e("collapse", [["visibility", "collapse"]]),
      e("static", [["position", "static"]]),
      e("fixed", [["position", "fixed"]]),
      e("absolute", [["position", "absolute"]]),
      e("relative", [["position", "relative"]]),
      e("sticky", [["position", "sticky"]]);
    for (let [i, f] of [
      ["inset", "inset"],
      ["inset-x", "inset-inline"],
      ["inset-y", "inset-block"],
      ["start", "inset-inline-start"],
      ["end", "inset-inline-end"],
      ["top", "top"],
      ["right", "right"],
      ["bottom", "bottom"],
      ["left", "left"],
    ])
      e(`${i}-auto`, [[f, "auto"]]),
        e(`${i}-full`, [[f, "100%"]]),
        e(`-${i}-full`, [[f, "-100%"]]),
        l(i, ["--inset", "--spacing"], (h) => [a(f, h)], {
          supportsNegative: !0,
          supportsFractions: !0,
        });
    e("isolate", [["isolation", "isolate"]]),
      e("isolation-auto", [["isolation", "auto"]]),
      e("z-auto", [["z-index", "auto"]]),
      n("z", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        themeKeys: ["--z-index"],
        handle: (i) => [a("z-index", i)],
      }),
      o("z", () => [
        {
          supportsNegative: !0,
          values: ["0", "10", "20", "30", "40", "50"],
          valueThemeKeys: ["--z-index"],
        },
      ]),
      e("order-first", [["order", "-9999"]]),
      e("order-last", [["order", "9999"]]),
      e("order-none", [["order", "0"]]),
      n("order", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        themeKeys: ["--order"],
        handle: (i) => [a("order", i)],
      }),
      o("order", () => [
        {
          supportsNegative: !0,
          values: Array.from({ length: 12 }, (i, f) => `${f + 1}`),
          valueThemeKeys: ["--order"],
        },
      ]),
      e("col-auto", [["grid-column", "auto"]]),
      n("col", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        themeKeys: ["--grid-column"],
        handle: (i) => [a("grid-column", i)],
      }),
      e("col-span-full", [["grid-column", "1 / -1"]]),
      n("col-span", {
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        handle: (i) => [a("grid-column", `span ${i} / span ${i}`)],
      }),
      e("col-start-auto", [["grid-column-start", "auto"]]),
      n("col-start", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        themeKeys: ["--grid-column-start"],
        handle: (i) => [a("grid-column-start", i)],
      }),
      e("col-end-auto", [["grid-column-end", "auto"]]),
      n("col-end", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        themeKeys: ["--grid-column-end"],
        handle: (i) => [a("grid-column-end", i)],
      }),
      o("col-span", () => [
        {
          values: Array.from({ length: 12 }, (i, f) => `${f + 1}`),
          valueThemeKeys: [],
        },
      ]),
      o("col-start", () => [
        {
          supportsNegative: !0,
          values: Array.from({ length: 13 }, (i, f) => `${f + 1}`),
          valueThemeKeys: ["--grid-column-start"],
        },
      ]),
      o("col-end", () => [
        {
          supportsNegative: !0,
          values: Array.from({ length: 13 }, (i, f) => `${f + 1}`),
          valueThemeKeys: ["--grid-column-end"],
        },
      ]),
      e("row-auto", [["grid-row", "auto"]]),
      n("row", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        themeKeys: ["--grid-row"],
        handle: (i) => [a("grid-row", i)],
      }),
      e("row-span-full", [["grid-row", "1 / -1"]]),
      n("row-span", {
        themeKeys: [],
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        handle: (i) => [a("grid-row", `span ${i} / span ${i}`)],
      }),
      e("row-start-auto", [["grid-row-start", "auto"]]),
      n("row-start", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        themeKeys: ["--grid-row-start"],
        handle: (i) => [a("grid-row-start", i)],
      }),
      e("row-end-auto", [["grid-row-end", "auto"]]),
      n("row-end", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        themeKeys: ["--grid-row-end"],
        handle: (i) => [a("grid-row-end", i)],
      }),
      o("row-span", () => [
        {
          values: Array.from({ length: 12 }, (i, f) => `${f + 1}`),
          valueThemeKeys: [],
        },
      ]),
      o("row-start", () => [
        {
          supportsNegative: !0,
          values: Array.from({ length: 13 }, (i, f) => `${f + 1}`),
          valueThemeKeys: ["--grid-row-start"],
        },
      ]),
      o("row-end", () => [
        {
          supportsNegative: !0,
          values: Array.from({ length: 13 }, (i, f) => `${f + 1}`),
          valueThemeKeys: ["--grid-row-end"],
        },
      ]),
      e("float-start", [["float", "inline-start"]]),
      e("float-end", [["float", "inline-end"]]),
      e("float-right", [["float", "right"]]),
      e("float-left", [["float", "left"]]),
      e("float-none", [["float", "none"]]),
      e("clear-start", [["clear", "inline-start"]]),
      e("clear-end", [["clear", "inline-end"]]),
      e("clear-right", [["clear", "right"]]),
      e("clear-left", [["clear", "left"]]),
      e("clear-both", [["clear", "both"]]),
      e("clear-none", [["clear", "none"]]);
    for (let [i, f] of [
      ["m", "margin"],
      ["mx", "margin-inline"],
      ["my", "margin-block"],
      ["ms", "margin-inline-start"],
      ["me", "margin-inline-end"],
      ["mt", "margin-top"],
      ["mr", "margin-right"],
      ["mb", "margin-bottom"],
      ["ml", "margin-left"],
    ])
      e(`${i}-auto`, [[f, "auto"]]),
        l(i, ["--margin", "--spacing"], (h) => [a(f, h)], {
          supportsNegative: !0,
        });
    e("box-border", [["box-sizing", "border-box"]]),
      e("box-content", [["box-sizing", "content-box"]]),
      e("line-clamp-none", [
        ["overflow", "visible"],
        ["display", "block"],
        ["-webkit-box-orient", "horizontal"],
        ["-webkit-line-clamp", "unset"],
      ]),
      n("line-clamp", {
        themeKeys: ["--line-clamp"],
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        handle: (i) => [
          a("overflow", "hidden"),
          a("display", "-webkit-box"),
          a("-webkit-box-orient", "vertical"),
          a("-webkit-line-clamp", i),
        ],
      }),
      o("line-clamp", () => [
        {
          values: ["1", "2", "3", "4", "5", "6"],
          valueThemeKeys: ["--line-clamp"],
        },
      ]),
      e("block", [["display", "block"]]),
      e("inline-block", [["display", "inline-block"]]),
      e("inline", [["display", "inline"]]),
      e("hidden", [["display", "none"]]),
      e("inline-flex", [["display", "inline-flex"]]),
      e("table", [["display", "table"]]),
      e("inline-table", [["display", "inline-table"]]),
      e("table-caption", [["display", "table-caption"]]),
      e("table-cell", [["display", "table-cell"]]),
      e("table-column", [["display", "table-column"]]),
      e("table-column-group", [["display", "table-column-group"]]),
      e("table-footer-group", [["display", "table-footer-group"]]),
      e("table-header-group", [["display", "table-header-group"]]),
      e("table-row-group", [["display", "table-row-group"]]),
      e("table-row", [["display", "table-row"]]),
      e("flow-root", [["display", "flow-root"]]),
      e("flex", [["display", "flex"]]),
      e("grid", [["display", "grid"]]),
      e("inline-grid", [["display", "inline-grid"]]),
      e("contents", [["display", "contents"]]),
      e("list-item", [["display", "list-item"]]),
      e("field-sizing-content", [["field-sizing", "content"]]),
      e("field-sizing-fixed", [["field-sizing", "fixed"]]),
      e("aspect-auto", [["aspect-ratio", "auto"]]),
      e("aspect-square", [["aspect-ratio", "1 / 1"]]),
      n("aspect", {
        themeKeys: ["--aspect"],
        handleBareValue: ({ fraction: i }) => {
          if (i === null) return null;
          let [f, h] = P(i, "/");
          return !N(f) || !N(h) ? null : i;
        },
        handle: (i) => [a("aspect-ratio", i)],
      });
    for (let [i, f] of [
      ["auto", "auto"],
      ["full", "100%"],
      ["svw", "100svw"],
      ["lvw", "100lvw"],
      ["dvw", "100dvw"],
      ["svh", "100svh"],
      ["lvh", "100lvh"],
      ["dvh", "100dvh"],
      ["min", "min-content"],
      ["max", "max-content"],
      ["fit", "fit-content"],
    ])
      e(`size-${i}`, [
        ["--tw-sort", "size"],
        ["width", f],
        ["height", f],
      ]),
        e(`w-${i}`, [["width", f]]),
        e(`h-${i}`, [["height", f]]),
        e(`min-w-${i}`, [["min-width", f]]),
        e(`min-h-${i}`, [["min-height", f]]),
        i !== "auto" &&
          (e(`max-w-${i}`, [["max-width", f]]),
          e(`max-h-${i}`, [["max-height", f]]));
    e("w-screen", [["width", "100vw"]]),
      e("min-w-screen", [["min-width", "100vw"]]),
      e("max-w-screen", [["max-width", "100vw"]]),
      e("h-screen", [["height", "100vh"]]),
      e("min-h-screen", [["min-height", "100vh"]]),
      e("max-h-screen", [["max-height", "100vh"]]),
      e("max-w-none", [["max-width", "none"]]),
      e("max-h-none", [["max-height", "none"]]),
      l(
        "size",
        ["--size", "--spacing"],
        (i) => [a("--tw-sort", "size"), a("width", i), a("height", i)],
        { supportsFractions: !0 },
      );
    for (let [i, f, h] of [
      ["w", ["--width", "--spacing", "--container"], "width"],
      ["min-w", ["--min-width", "--spacing", "--container"], "min-width"],
      ["max-w", ["--max-width", "--spacing", "--container"], "max-width"],
      ["h", ["--height", "--spacing"], "height"],
      ["min-h", ["--min-height", "--height", "--spacing"], "min-height"],
      ["max-h", ["--max-height", "--height", "--spacing"], "max-height"],
    ])
      l(i, f, (w) => [a(h, w)], { supportsFractions: !0 });
    r.static("container", () => {
      let i = [...t.namespace("--breakpoint").values()];
      i.sort((h, w) => ue(h, w, "asc"));
      let f = [a("--tw-sort", "--tw-container-component"), a("width", "100%")];
      for (let h of i)
        f.push(U("@media", `(width >= ${h})`, [a("max-width", h)]));
      return f;
    }),
      e("flex-auto", [["flex", "auto"]]),
      e("flex-initial", [["flex", "0 auto"]]),
      e("flex-none", [["flex", "none"]]),
      r.functional("flex", (i) => {
        if (i.value) {
          if (i.value.kind === "arbitrary")
            return i.modifier ? void 0 : [a("flex", i.value.value)];
          if (i.value.fraction) {
            let [f, h] = P(i.value.fraction, "/");
            return !N(f) || !N(h)
              ? void 0
              : [a("flex", `calc(${i.value.fraction} * 100%)`)];
          }
          if (N(i.value.value))
            return i.modifier ? void 0 : [a("flex", i.value.value)];
        }
      }),
      o("flex", () => [{ supportsFractions: !0 }]),
      n("shrink", {
        defaultValue: "1",
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        handle: (i) => [a("flex-shrink", i)],
      }),
      n("grow", {
        defaultValue: "1",
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        handle: (i) => [a("flex-grow", i)],
      }),
      o("shrink", () => [
        { values: ["0"], valueThemeKeys: [], hasDefaultValue: !0 },
      ]),
      o("grow", () => [
        { values: ["0"], valueThemeKeys: [], hasDefaultValue: !0 },
      ]),
      e("basis-auto", [["flex-basis", "auto"]]),
      e("basis-full", [["flex-basis", "100%"]]),
      l(
        "basis",
        ["--flex-basis", "--spacing", "--container"],
        (i) => [a("flex-basis", i)],
        { supportsFractions: !0 },
      ),
      e("table-auto", [["table-layout", "auto"]]),
      e("table-fixed", [["table-layout", "fixed"]]),
      e("caption-top", [["caption-side", "top"]]),
      e("caption-bottom", [["caption-side", "bottom"]]),
      e("border-collapse", [["border-collapse", "collapse"]]),
      e("border-separate", [["border-collapse", "separate"]]);
    let p = () =>
      D([
        S("--tw-border-spacing-x", "0", "<length>"),
        S("--tw-border-spacing-y", "0", "<length>"),
      ]);
    l("border-spacing", ["--border-spacing", "--spacing"], (i) => [
      p(),
      a("--tw-border-spacing-x", i),
      a("--tw-border-spacing-y", i),
      a(
        "border-spacing",
        "var(--tw-border-spacing-x) var(--tw-border-spacing-y)",
      ),
    ]),
      l("border-spacing-x", ["--border-spacing", "--spacing"], (i) => [
        p(),
        a("--tw-border-spacing-x", i),
        a(
          "border-spacing",
          "var(--tw-border-spacing-x) var(--tw-border-spacing-y)",
        ),
      ]),
      l("border-spacing-y", ["--border-spacing", "--spacing"], (i) => [
        p(),
        a("--tw-border-spacing-y", i),
        a(
          "border-spacing",
          "var(--tw-border-spacing-x) var(--tw-border-spacing-y)",
        ),
      ]),
      e("origin-center", [["transform-origin", "center"]]),
      e("origin-top", [["transform-origin", "top"]]),
      e("origin-top-right", [["transform-origin", "top right"]]),
      e("origin-right", [["transform-origin", "right"]]),
      e("origin-bottom-right", [["transform-origin", "bottom right"]]),
      e("origin-bottom", [["transform-origin", "bottom"]]),
      e("origin-bottom-left", [["transform-origin", "bottom left"]]),
      e("origin-left", [["transform-origin", "left"]]),
      e("origin-top-left", [["transform-origin", "top left"]]),
      n("origin", {
        themeKeys: ["--transform-origin"],
        handle: (i) => [a("transform-origin", i)],
      }),
      e("perspective-origin-center", [["perspective-origin", "center"]]),
      e("perspective-origin-top", [["perspective-origin", "top"]]),
      e("perspective-origin-top-right", [["perspective-origin", "top right"]]),
      e("perspective-origin-right", [["perspective-origin", "right"]]),
      e("perspective-origin-bottom-right", [
        ["perspective-origin", "bottom right"],
      ]),
      e("perspective-origin-bottom", [["perspective-origin", "bottom"]]),
      e("perspective-origin-bottom-left", [
        ["perspective-origin", "bottom left"],
      ]),
      e("perspective-origin-left", [["perspective-origin", "left"]]),
      e("perspective-origin-top-left", [["perspective-origin", "top left"]]),
      n("perspective-origin", {
        themeKeys: ["--perspective-origin"],
        handle: (i) => [a("perspective-origin", i)],
      }),
      e("perspective-none", [["perspective", "none"]]),
      n("perspective", {
        themeKeys: ["--perspective"],
        handle: (i) => [a("perspective", i)],
      });
    let c = () =>
      D([
        S("--tw-translate-x", "0"),
        S("--tw-translate-y", "0"),
        S("--tw-translate-z", "0"),
      ]);
    e("translate-none", [["translate", "none"]]),
      e("-translate-full", [
        c,
        ["--tw-translate-x", "-100%"],
        ["--tw-translate-y", "-100%"],
        ["translate", "var(--tw-translate-x) var(--tw-translate-y)"],
      ]),
      e("translate-full", [
        c,
        ["--tw-translate-x", "100%"],
        ["--tw-translate-y", "100%"],
        ["translate", "var(--tw-translate-x) var(--tw-translate-y)"],
      ]),
      l(
        "translate",
        ["--translate", "--spacing"],
        (i) => [
          c(),
          a("--tw-translate-x", i),
          a("--tw-translate-y", i),
          a("translate", "var(--tw-translate-x) var(--tw-translate-y)"),
        ],
        { supportsNegative: !0, supportsFractions: !0 },
      );
    for (let i of ["x", "y"])
      e(`-translate-${i}-full`, [
        c,
        [`--tw-translate-${i}`, "-100%"],
        ["translate", "var(--tw-translate-x) var(--tw-translate-y)"],
      ]),
        e(`translate-${i}-full`, [
          c,
          [`--tw-translate-${i}`, "100%"],
          ["translate", "var(--tw-translate-x) var(--tw-translate-y)"],
        ]),
        l(
          `translate-${i}`,
          ["--translate", "--spacing"],
          (f) => [
            c(),
            a(`--tw-translate-${i}`, f),
            a("translate", "var(--tw-translate-x) var(--tw-translate-y)"),
          ],
          { supportsNegative: !0, supportsFractions: !0 },
        );
    l(
      "translate-z",
      ["--translate", "--spacing"],
      (i) => [
        c(),
        a("--tw-translate-z", i),
        a(
          "translate",
          "var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)",
        ),
      ],
      { supportsNegative: !0 },
    ),
      e("translate-3d", [
        c,
        [
          "translate",
          "var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)",
        ],
      ]);
    let d = () =>
      D([
        S("--tw-scale-x", "1"),
        S("--tw-scale-y", "1"),
        S("--tw-scale-z", "1"),
      ]);
    e("scale-none", [["scale", "none"]]);
    function u({ negative: i }) {
      return (f) => {
        if (!f.value || f.modifier) return;
        let h;
        return f.value.kind === "arbitrary"
          ? ((h = f.value.value), [a("scale", h)])
          : ((h = t.resolve(f.value.value, ["--scale"])),
            !h && N(f.value.value) && (h = `${f.value.value}%`),
            h
              ? ((h = i ? `calc(${h} * -1)` : h),
                [
                  d(),
                  a("--tw-scale-x", h),
                  a("--tw-scale-y", h),
                  a("--tw-scale-z", h),
                  a("scale", "var(--tw-scale-x) var(--tw-scale-y)"),
                ])
              : void 0);
      };
    }
    r.functional("-scale", u({ negative: !0 })),
      r.functional("scale", u({ negative: !1 })),
      o("scale", () => [
        {
          supportsNegative: !0,
          values: [
            "0",
            "50",
            "75",
            "90",
            "95",
            "100",
            "105",
            "110",
            "125",
            "150",
            "200",
          ],
          valueThemeKeys: ["--scale"],
        },
      ]);
    for (let i of ["x", "y", "z"])
      n(`scale-${i}`, {
        supportsNegative: !0,
        themeKeys: ["--scale"],
        handleBareValue: ({ value: f }) => (N(f) ? `${f}%` : null),
        handle: (f) => [
          d(),
          a(`--tw-scale-${i}`, f),
          a(
            "scale",
            `var(--tw-scale-x) var(--tw-scale-y)${i === "z" ? " var(--tw-scale-z)" : ""}`,
          ),
        ],
      }),
        o(`scale-${i}`, () => [
          {
            supportsNegative: !0,
            values: [
              "0",
              "50",
              "75",
              "90",
              "95",
              "100",
              "105",
              "110",
              "125",
              "150",
              "200",
            ],
            valueThemeKeys: ["--scale"],
          },
        ]);
    e("scale-3d", [
      d,
      ["scale", "var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z)"],
    ]),
      e("rotate-none", [["rotate", "none"]]);
    function g({ negative: i }) {
      return (f) => {
        if (!f.value || f.modifier) return;
        let h;
        if (f.value.kind === "arbitrary") {
          h = f.value.value;
          let w = f.value.dataType ?? I(h, ["angle", "vector"]);
          if (w === "vector") return [a("rotate", `${h} var(--tw-rotate)`)];
          if (w !== "angle") return [a("rotate", h)];
        } else if (
          ((h = t.resolve(f.value.value, ["--rotate"])),
          !h && N(f.value.value) && (h = `${f.value.value}deg`),
          !h)
        )
          return;
        return [a("rotate", i ? `calc(${h} * -1)` : h)];
      };
    }
    r.functional("-rotate", g({ negative: !0 })),
      r.functional("rotate", g({ negative: !1 })),
      o("rotate", () => [
        {
          supportsNegative: !0,
          values: ["0", "1", "2", "3", "6", "12", "45", "90", "180"],
          valueThemeKeys: ["--rotate"],
        },
      ]);
    {
      let i = [
          "var(--tw-rotate-x)",
          "var(--tw-rotate-y)",
          "var(--tw-rotate-z)",
          "var(--tw-skew-x)",
          "var(--tw-skew-y)",
        ].join(" "),
        f = () =>
          D([
            S("--tw-rotate-x", "rotateX(0)"),
            S("--tw-rotate-y", "rotateY(0)"),
            S("--tw-rotate-z", "rotateZ(0)"),
            S("--tw-skew-x", "skewX(0)"),
            S("--tw-skew-y", "skewY(0)"),
          ]);
      for (let h of ["x", "y", "z"])
        n(`rotate-${h}`, {
          supportsNegative: !0,
          themeKeys: ["--rotate"],
          handleBareValue: ({ value: w }) => (N(w) ? `${w}deg` : null),
          handle: (w) => [
            f(),
            a(`--tw-rotate-${h}`, `rotate${h.toUpperCase()}(${w})`),
            a("transform", i),
          ],
        }),
          o(`rotate-${h}`, () => [
            {
              supportsNegative: !0,
              values: ["0", "1", "2", "3", "6", "12", "45", "90", "180"],
              valueThemeKeys: ["--rotate"],
            },
          ]);
      n("skew", {
        supportsNegative: !0,
        themeKeys: ["--skew"],
        handleBareValue: ({ value: h }) => (N(h) ? `${h}deg` : null),
        handle: (h) => [
          f(),
          a("--tw-skew-x", `skewX(${h})`),
          a("--tw-skew-y", `skewY(${h})`),
          a("transform", i),
        ],
      }),
        n("skew-x", {
          supportsNegative: !0,
          themeKeys: ["--skew"],
          handleBareValue: ({ value: h }) => (N(h) ? `${h}deg` : null),
          handle: (h) => [
            f(),
            a("--tw-skew-x", `skewX(${h})`),
            a("transform", i),
          ],
        }),
        n("skew-y", {
          supportsNegative: !0,
          themeKeys: ["--skew"],
          handleBareValue: ({ value: h }) => (N(h) ? `${h}deg` : null),
          handle: (h) => [
            f(),
            a("--tw-skew-y", `skewY(${h})`),
            a("transform", i),
          ],
        }),
        o("skew", () => [
          {
            supportsNegative: !0,
            values: ["0", "1", "2", "3", "6", "12"],
            valueThemeKeys: ["--skew"],
          },
        ]),
        o("skew-x", () => [
          {
            supportsNegative: !0,
            values: ["0", "1", "2", "3", "6", "12"],
            valueThemeKeys: ["--skew"],
          },
        ]),
        o("skew-y", () => [
          {
            supportsNegative: !0,
            values: ["0", "1", "2", "3", "6", "12"],
            valueThemeKeys: ["--skew"],
          },
        ]),
        r.functional("transform", (h) => {
          if (h.modifier) return;
          let w = null;
          if (
            (h.value
              ? h.value.kind === "arbitrary" && (w = h.value.value)
              : (w = i),
            w !== null)
          )
            return [f(), a("transform", w)];
        }),
        o("transform", () => [{ hasDefaultValue: !0 }]),
        e("transform-cpu", [["transform", i]]),
        e("transform-gpu", [["transform", `translateZ(0) ${i}`]]),
        e("transform-none", [["transform", "none"]]);
    }
    e("transform-flat", [["transform-style", "flat"]]),
      e("transform-3d", [["transform-style", "preserve-3d"]]),
      e("transform-content", [["transform-box", "content-box"]]),
      e("transform-border", [["transform-box", "border-box"]]),
      e("transform-fill", [["transform-box", "fill-box"]]),
      e("transform-stroke", [["transform-box", "stroke-box"]]),
      e("transform-view", [["transform-box", "view-box"]]),
      e("backface-visible", [["backface-visibility", "visible"]]),
      e("backface-hidden", [["backface-visibility", "hidden"]]);
    for (let i of [
      "auto",
      "default",
      "pointer",
      "wait",
      "text",
      "move",
      "help",
      "not-allowed",
      "none",
      "context-menu",
      "progress",
      "cell",
      "crosshair",
      "vertical-text",
      "alias",
      "copy",
      "no-drop",
      "grab",
      "grabbing",
      "all-scroll",
      "col-resize",
      "row-resize",
      "n-resize",
      "e-resize",
      "s-resize",
      "w-resize",
      "ne-resize",
      "nw-resize",
      "se-resize",
      "sw-resize",
      "ew-resize",
      "ns-resize",
      "nesw-resize",
      "nwse-resize",
      "zoom-in",
      "zoom-out",
    ])
      e(`cursor-${i}`, [["cursor", i]]);
    n("cursor", { themeKeys: ["--cursor"], handle: (i) => [a("cursor", i)] });
    for (let i of ["auto", "none", "manipulation"])
      e(`touch-${i}`, [["touch-action", i]]);
    let m = () => D([S("--tw-pan-x"), S("--tw-pan-y"), S("--tw-pinch-zoom")]);
    for (let i of ["x", "left", "right"])
      e(`touch-pan-${i}`, [
        m,
        ["--tw-pan-x", `pan-${i}`],
        [
          "touch-action",
          "var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)",
        ],
      ]);
    for (let i of ["y", "up", "down"])
      e(`touch-pan-${i}`, [
        m,
        ["--tw-pan-y", `pan-${i}`],
        [
          "touch-action",
          "var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)",
        ],
      ]);
    e("touch-pinch-zoom", [
      m,
      ["--tw-pinch-zoom", "pinch-zoom"],
      [
        "touch-action",
        "var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)",
      ],
    ]);
    for (let i of ["none", "text", "all", "auto"])
      e(`select-${i}`, [
        ["-webkit-user-select", i],
        ["user-select", i],
      ]);
    e("resize-none", [["resize", "none"]]),
      e("resize-x", [["resize", "horizontal"]]),
      e("resize-y", [["resize", "vertical"]]),
      e("resize", [["resize", "both"]]),
      e("snap-none", [["scroll-snap-type", "none"]]);
    let v = () => D([S("--tw-scroll-snap-strictness", "proximity", "*")]);
    for (let i of ["x", "y", "both"])
      e(`snap-${i}`, [
        v,
        ["scroll-snap-type", `${i} var(--tw-scroll-snap-strictness)`],
      ]);
    e("snap-mandatory", [v, ["--tw-scroll-snap-strictness", "mandatory"]]),
      e("snap-proximity", [v, ["--tw-scroll-snap-strictness", "proximity"]]),
      e("snap-align-none", [["scroll-snap-align", "none"]]),
      e("snap-start", [["scroll-snap-align", "start"]]),
      e("snap-end", [["scroll-snap-align", "end"]]),
      e("snap-center", [["scroll-snap-align", "center"]]),
      e("snap-normal", [["scroll-snap-stop", "normal"]]),
      e("snap-always", [["scroll-snap-stop", "always"]]);
    for (let [i, f] of [
      ["scroll-m", "scroll-margin"],
      ["scroll-mx", "scroll-margin-inline"],
      ["scroll-my", "scroll-margin-block"],
      ["scroll-ms", "scroll-margin-inline-start"],
      ["scroll-me", "scroll-margin-inline-end"],
      ["scroll-mt", "scroll-margin-top"],
      ["scroll-mr", "scroll-margin-right"],
      ["scroll-mb", "scroll-margin-bottom"],
      ["scroll-ml", "scroll-margin-left"],
    ])
      l(i, ["--scroll-margin", "--spacing"], (h) => [a(f, h)], {
        supportsNegative: !0,
      });
    for (let [i, f] of [
      ["scroll-p", "scroll-padding"],
      ["scroll-px", "scroll-padding-inline"],
      ["scroll-py", "scroll-padding-block"],
      ["scroll-ps", "scroll-padding-inline-start"],
      ["scroll-pe", "scroll-padding-inline-end"],
      ["scroll-pt", "scroll-padding-top"],
      ["scroll-pr", "scroll-padding-right"],
      ["scroll-pb", "scroll-padding-bottom"],
      ["scroll-pl", "scroll-padding-left"],
    ])
      l(i, ["--scroll-padding", "--spacing"], (h) => [a(f, h)]);
    e("list-inside", [["list-style-position", "inside"]]),
      e("list-outside", [["list-style-position", "outside"]]),
      e("list-none", [["list-style-type", "none"]]),
      e("list-disc", [["list-style-type", "disc"]]),
      e("list-decimal", [["list-style-type", "decimal"]]),
      n("list", {
        themeKeys: ["--list-style-type"],
        handle: (i) => [a("list-style-type", i)],
      }),
      e("list-image-none", [["list-style-image", "none"]]),
      n("list-image", {
        themeKeys: ["--list-style-image"],
        handle: (i) => [a("list-style-image", i)],
      }),
      e("appearance-none", [["appearance", "none"]]),
      e("appearance-auto", [["appearance", "auto"]]),
      e("scheme-normal", [["color-scheme", "normal"]]),
      e("scheme-dark", [["color-scheme", "dark"]]),
      e("scheme-light", [["color-scheme", "light"]]),
      e("scheme-light-dark", [["color-scheme", "light dark"]]),
      e("scheme-only-dark", [["color-scheme", "only dark"]]),
      e("scheme-only-light", [["color-scheme", "only light"]]),
      e("columns-auto", [["columns", "auto"]]),
      n("columns", {
        themeKeys: ["--columns", "--container"],
        handleBareValue: ({ value: i }) => (N(i) ? i : null),
        handle: (i) => [a("columns", i)],
      }),
      o("columns", () => [
        {
          values: Array.from({ length: 12 }, (i, f) => `${f + 1}`),
          valueThemeKeys: ["--columns", "--container"],
        },
      ]);
    for (let i of [
      "auto",
      "avoid",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "column",
    ])
      e(`break-before-${i}`, [["break-before", i]]);
    for (let i of ["auto", "avoid", "avoid-page", "avoid-column"])
      e(`break-inside-${i}`, [["break-inside", i]]);
    for (let i of [
      "auto",
      "avoid",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "column",
    ])
      e(`break-after-${i}`, [["break-after", i]]);
    e("grid-flow-row", [["grid-auto-flow", "row"]]),
      e("grid-flow-col", [["grid-auto-flow", "column"]]),
      e("grid-flow-dense", [["grid-auto-flow", "dense"]]),
      e("grid-flow-row-dense", [["grid-auto-flow", "row dense"]]),
      e("grid-flow-col-dense", [["grid-auto-flow", "column dense"]]),
      e("auto-cols-auto", [["grid-auto-columns", "auto"]]),
      e("auto-cols-min", [["grid-auto-columns", "min-content"]]),
      e("auto-cols-max", [["grid-auto-columns", "max-content"]]),
      e("auto-cols-fr", [["grid-auto-columns", "minmax(0, 1fr)"]]),
      n("auto-cols", {
        themeKeys: ["--grid-auto-columns"],
        handle: (i) => [a("grid-auto-columns", i)],
      }),
      e("auto-rows-auto", [["grid-auto-rows", "auto"]]),
      e("auto-rows-min", [["grid-auto-rows", "min-content"]]),
      e("auto-rows-max", [["grid-auto-rows", "max-content"]]),
      e("auto-rows-fr", [["grid-auto-rows", "minmax(0, 1fr)"]]),
      n("auto-rows", {
        themeKeys: ["--grid-auto-rows"],
        handle: (i) => [a("grid-auto-rows", i)],
      }),
      e("grid-cols-none", [["grid-template-columns", "none"]]),
      e("grid-cols-subgrid", [["grid-template-columns", "subgrid"]]),
      n("grid-cols", {
        themeKeys: ["--grid-template-columns"],
        handleBareValue: ({ value: i }) =>
          pt(i) ? `repeat(${i}, minmax(0, 1fr))` : null,
        handle: (i) => [a("grid-template-columns", i)],
      }),
      e("grid-rows-none", [["grid-template-rows", "none"]]),
      e("grid-rows-subgrid", [["grid-template-rows", "subgrid"]]),
      n("grid-rows", {
        themeKeys: ["--grid-template-rows"],
        handleBareValue: ({ value: i }) =>
          pt(i) ? `repeat(${i}, minmax(0, 1fr))` : null,
        handle: (i) => [a("grid-template-rows", i)],
      }),
      o("grid-cols", () => [
        {
          values: Array.from({ length: 12 }, (i, f) => `${f + 1}`),
          valueThemeKeys: ["--grid-template-columns"],
        },
      ]),
      o("grid-rows", () => [
        {
          values: Array.from({ length: 12 }, (i, f) => `${f + 1}`),
          valueThemeKeys: ["--grid-template-rows"],
        },
      ]),
      e("flex-row", [["flex-direction", "row"]]),
      e("flex-row-reverse", [["flex-direction", "row-reverse"]]),
      e("flex-col", [["flex-direction", "column"]]),
      e("flex-col-reverse", [["flex-direction", "column-reverse"]]),
      e("flex-wrap", [["flex-wrap", "wrap"]]),
      e("flex-nowrap", [["flex-wrap", "nowrap"]]),
      e("flex-wrap-reverse", [["flex-wrap", "wrap-reverse"]]),
      e("place-content-center", [["place-content", "center"]]),
      e("place-content-start", [["place-content", "start"]]),
      e("place-content-end", [["place-content", "end"]]),
      e("place-content-between", [["place-content", "space-between"]]),
      e("place-content-around", [["place-content", "space-around"]]),
      e("place-content-evenly", [["place-content", "space-evenly"]]),
      e("place-content-baseline", [["place-content", "baseline"]]),
      e("place-content-stretch", [["place-content", "stretch"]]),
      e("place-items-center", [["place-items", "center"]]),
      e("place-items-start", [["place-items", "start"]]),
      e("place-items-end", [["place-items", "end"]]),
      e("place-items-baseline", [["place-items", "baseline"]]),
      e("place-items-stretch", [["place-items", "stretch"]]),
      e("content-normal", [["align-content", "normal"]]),
      e("content-center", [["align-content", "center"]]),
      e("content-start", [["align-content", "flex-start"]]),
      e("content-end", [["align-content", "flex-end"]]),
      e("content-between", [["align-content", "space-between"]]),
      e("content-around", [["align-content", "space-around"]]),
      e("content-evenly", [["align-content", "space-evenly"]]),
      e("content-baseline", [["align-content", "baseline"]]),
      e("content-stretch", [["align-content", "stretch"]]),
      e("items-center", [["align-items", "center"]]),
      e("items-start", [["align-items", "flex-start"]]),
      e("items-end", [["align-items", "flex-end"]]),
      e("items-baseline", [["align-items", "baseline"]]),
      e("items-stretch", [["align-items", "stretch"]]),
      e("justify-normal", [["justify-content", "normal"]]),
      e("justify-center", [["justify-content", "center"]]),
      e("justify-start", [["justify-content", "flex-start"]]),
      e("justify-end", [["justify-content", "flex-end"]]),
      e("justify-between", [["justify-content", "space-between"]]),
      e("justify-around", [["justify-content", "space-around"]]),
      e("justify-evenly", [["justify-content", "space-evenly"]]),
      e("justify-baseline", [["justify-content", "baseline"]]),
      e("justify-stretch", [["justify-content", "stretch"]]),
      e("justify-items-normal", [["justify-items", "normal"]]),
      e("justify-items-center", [["justify-items", "center"]]),
      e("justify-items-start", [["justify-items", "start"]]),
      e("justify-items-end", [["justify-items", "end"]]),
      e("justify-items-stretch", [["justify-items", "stretch"]]),
      l("gap", ["--gap", "--spacing"], (i) => [a("gap", i)]),
      l("gap-x", ["--gap", "--spacing"], (i) => [a("column-gap", i)]),
      l("gap-y", ["--gap", "--spacing"], (i) => [a("row-gap", i)]),
      l(
        "space-x",
        ["--space", "--spacing"],
        (i) => [
          D([S("--tw-space-x-reverse", "0")]),
          z(":where(& > :not(:last-child))", [
            a("--tw-sort", "row-gap"),
            a("--tw-space-x-reverse", "0"),
            a("margin-inline-start", `calc(${i} * var(--tw-space-x-reverse))`),
            a(
              "margin-inline-end",
              `calc(${i} * calc(1 - var(--tw-space-x-reverse)))`,
            ),
          ]),
        ],
        { supportsNegative: !0 },
      ),
      l(
        "space-y",
        ["--space", "--spacing"],
        (i) => [
          D([S("--tw-space-y-reverse", "0")]),
          z(":where(& > :not(:last-child))", [
            a("--tw-sort", "column-gap"),
            a("--tw-space-y-reverse", "0"),
            a("margin-block-start", `calc(${i} * var(--tw-space-y-reverse))`),
            a(
              "margin-block-end",
              `calc(${i} * calc(1 - var(--tw-space-y-reverse)))`,
            ),
          ]),
        ],
        { supportsNegative: !0 },
      ),
      e("space-x-reverse", [
        () => D([S("--tw-space-x-reverse", "0")]),
        () =>
          z(":where(& > :not(:last-child))", [
            a("--tw-sort", "row-gap"),
            a("--tw-space-x-reverse", "1"),
          ]),
      ]),
      e("space-y-reverse", [
        () => D([S("--tw-space-y-reverse", "0")]),
        () =>
          z(":where(& > :not(:last-child))", [
            a("--tw-sort", "column-gap"),
            a("--tw-space-y-reverse", "1"),
          ]),
      ]),
      e("accent-auto", [["accent-color", "auto"]]),
      s("accent", {
        themeKeys: ["--accent-color", "--color"],
        handle: (i) => [a("accent-color", i)],
      }),
      s("caret", {
        themeKeys: ["--caret-color", "--color"],
        handle: (i) => [a("caret-color", i)],
      }),
      s("divide", {
        themeKeys: ["--divide-color", "--color"],
        handle: (i) => [
          z(":where(& > :not(:last-child))", [
            a("--tw-sort", "divide-color"),
            a("border-color", i),
          ]),
        ],
      }),
      e("place-self-auto", [["place-self", "auto"]]),
      e("place-self-start", [["place-self", "start"]]),
      e("place-self-end", [["place-self", "end"]]),
      e("place-self-center", [["place-self", "center"]]),
      e("place-self-stretch", [["place-self", "stretch"]]),
      e("self-auto", [["align-self", "auto"]]),
      e("self-start", [["align-self", "flex-start"]]),
      e("self-end", [["align-self", "flex-end"]]),
      e("self-center", [["align-self", "center"]]),
      e("self-stretch", [["align-self", "stretch"]]),
      e("self-baseline", [["align-self", "baseline"]]),
      e("justify-self-auto", [["justify-self", "auto"]]),
      e("justify-self-start", [["justify-self", "flex-start"]]),
      e("justify-self-end", [["justify-self", "flex-end"]]),
      e("justify-self-center", [["justify-self", "center"]]),
      e("justify-self-stretch", [["justify-self", "stretch"]]);
    for (let i of ["auto", "hidden", "clip", "visible", "scroll"])
      e(`overflow-${i}`, [["overflow", i]]),
        e(`overflow-x-${i}`, [["overflow-x", i]]),
        e(`overflow-y-${i}`, [["overflow-y", i]]);
    for (let i of ["auto", "contain", "none"])
      e(`overscroll-${i}`, [["overscroll-behavior", i]]),
        e(`overscroll-x-${i}`, [["overscroll-behavior-x", i]]),
        e(`overscroll-y-${i}`, [["overscroll-behavior-y", i]]);
    e("scroll-auto", [["scroll-behavior", "auto"]]),
      e("scroll-smooth", [["scroll-behavior", "smooth"]]),
      e("truncate", [
        ["overflow", "hidden"],
        ["text-overflow", "ellipsis"],
        ["white-space", "nowrap"],
      ]),
      e("text-ellipsis", [["text-overflow", "ellipsis"]]),
      e("text-clip", [["text-overflow", "clip"]]),
      e("hyphens-none", [
        ["-webkit-hyphens", "none"],
        ["hyphens", "none"],
      ]),
      e("hyphens-manual", [
        ["-webkit-hyphens", "manual"],
        ["hyphens", "manual"],
      ]),
      e("hyphens-auto", [
        ["-webkit-hyphens", "auto"],
        ["hyphens", "auto"],
      ]),
      e("whitespace-normal", [["white-space", "normal"]]),
      e("whitespace-nowrap", [["white-space", "nowrap"]]),
      e("whitespace-pre", [["white-space", "pre"]]),
      e("whitespace-pre-line", [["white-space", "pre-line"]]),
      e("whitespace-pre-wrap", [["white-space", "pre-wrap"]]),
      e("whitespace-break-spaces", [["white-space", "break-spaces"]]),
      e("text-wrap", [["text-wrap", "wrap"]]),
      e("text-nowrap", [["text-wrap", "nowrap"]]),
      e("text-balance", [["text-wrap", "balance"]]),
      e("text-pretty", [["text-wrap", "pretty"]]),
      e("break-normal", [
        ["overflow-wrap", "normal"],
        ["word-break", "normal"],
      ]),
      e("break-words", [["overflow-wrap", "break-word"]]),
      e("break-all", [["word-break", "break-all"]]),
      e("break-keep", [["word-break", "keep-all"]]),
      !1;
    for (let [i, f] of [
      ["rounded", ["border-radius"]],
      ["rounded-s", ["border-start-start-radius", "border-end-start-radius"]],
      ["rounded-e", ["border-start-end-radius", "border-end-end-radius"]],
      ["rounded-t", ["border-top-left-radius", "border-top-right-radius"]],
      ["rounded-r", ["border-top-right-radius", "border-bottom-right-radius"]],
      [
        "rounded-b",
        ["border-bottom-right-radius", "border-bottom-left-radius"],
      ],
      ["rounded-l", ["border-top-left-radius", "border-bottom-left-radius"]],
      ["rounded-ss", ["border-start-start-radius"]],
      ["rounded-se", ["border-start-end-radius"]],
      ["rounded-ee", ["border-end-end-radius"]],
      ["rounded-es", ["border-end-start-radius"]],
      ["rounded-tl", ["border-top-left-radius"]],
      ["rounded-tr", ["border-top-right-radius"]],
      ["rounded-br", ["border-bottom-right-radius"]],
      ["rounded-bl", ["border-bottom-left-radius"]],
    ])
      e(
        `${i}-none`,
        f.map((h) => [h, "0"]),
      ),
        e(
          `${i}-full`,
          f.map((h) => [h, "calc(infinity * 1px)"]),
        ),
        n(i, { themeKeys: ["--radius"], handle: (h) => f.map((w) => a(w, h)) });
    e("border-solid", [
      ["--tw-border-style", "solid"],
      ["border-style", "solid"],
    ]),
      e("border-dashed", [
        ["--tw-border-style", "dashed"],
        ["border-style", "dashed"],
      ]),
      e("border-dotted", [
        ["--tw-border-style", "dotted"],
        ["border-style", "dotted"],
      ]),
      e("border-double", [
        ["--tw-border-style", "double"],
        ["border-style", "double"],
      ]),
      e("border-hidden", [
        ["--tw-border-style", "hidden"],
        ["border-style", "hidden"],
      ]),
      e("border-none", [
        ["--tw-border-style", "none"],
        ["border-style", "none"],
      ]);
    {
      let f = function (h, w) {
        r.functional(h, (k) => {
          if (!k.value) {
            if (k.modifier) return;
            let T = t.get(["--default-border-width"]) ?? "1px",
              E = w.width(T);
            return E ? [i(), ...E] : void 0;
          }
          if (k.value.kind === "arbitrary") {
            let T = k.value.value;
            switch (
              k.value.dataType ??
              I(T, ["color", "line-width", "length"])
            ) {
              case "line-width":
              case "length": {
                if (k.modifier) return;
                let C = w.width(T);
                return C ? [i(), ...C] : void 0;
              }
              default:
                return (
                  (T = B(T, k.modifier, t)), T === null ? void 0 : w.color(T)
                );
            }
          }
          {
            let T = G(k, t, ["--border-color", "--color"]);
            if (T) return w.color(T);
          }
          {
            if (k.modifier) return;
            let T = t.resolve(k.value.value, ["--border-width"]);
            if (T) {
              let E = w.width(T);
              return E ? [i(), ...E] : void 0;
            }
            if (N(k.value.value)) {
              let E = w.width(`${k.value.value}px`);
              return E ? [i(), ...E] : void 0;
            }
          }
        }),
          o(h, () => [
            {
              values: ["current", "inherit", "transparent"],
              valueThemeKeys: ["--border-color", "--color"],
              modifiers: Array.from({ length: 21 }, (k, T) => `${T * 5}`),
              hasDefaultValue: !0,
            },
            {
              values: ["0", "2", "4", "8"],
              valueThemeKeys: ["--border-width"],
            },
          ]);
      };
      var x = f;
      let i = () => D([S("--tw-border-style", "solid")]);
      f("border", {
        width: (h) => [
          a("border-style", "var(--tw-border-style)"),
          a("border-width", h),
        ],
        color: (h) => [a("border-color", h)],
      }),
        f("border-x", {
          width: (h) => [
            a("border-inline-style", "var(--tw-border-style)"),
            a("border-inline-width", h),
          ],
          color: (h) => [a("border-inline-color", h)],
        }),
        f("border-y", {
          width: (h) => [
            a("border-block-style", "var(--tw-border-style)"),
            a("border-block-width", h),
          ],
          color: (h) => [a("border-block-color", h)],
        }),
        f("border-s", {
          width: (h) => [
            a("border-inline-start-style", "var(--tw-border-style)"),
            a("border-inline-start-width", h),
          ],
          color: (h) => [a("border-inline-start-color", h)],
        }),
        f("border-e", {
          width: (h) => [
            a("border-inline-end-style", "var(--tw-border-style)"),
            a("border-inline-end-width", h),
          ],
          color: (h) => [a("border-inline-end-color", h)],
        }),
        f("border-t", {
          width: (h) => [
            a("border-top-style", "var(--tw-border-style)"),
            a("border-top-width", h),
          ],
          color: (h) => [a("border-top-color", h)],
        }),
        f("border-r", {
          width: (h) => [
            a("border-right-style", "var(--tw-border-style)"),
            a("border-right-width", h),
          ],
          color: (h) => [a("border-right-color", h)],
        }),
        f("border-b", {
          width: (h) => [
            a("border-bottom-style", "var(--tw-border-style)"),
            a("border-bottom-width", h),
          ],
          color: (h) => [a("border-bottom-color", h)],
        }),
        f("border-l", {
          width: (h) => [
            a("border-left-style", "var(--tw-border-style)"),
            a("border-left-width", h),
          ],
          color: (h) => [a("border-left-color", h)],
        }),
        n("divide-x", {
          defaultValue: t.get(["--default-border-width"]) ?? "1px",
          themeKeys: ["--divide-width", "--border-width"],
          handleBareValue: ({ value: h }) => (N(h) ? `${h}px` : null),
          handle: (h) => [
            D([S("--tw-divide-x-reverse", "0")]),
            z(":where(& > :not(:last-child))", [
              a("--tw-sort", "divide-x-width"),
              i(),
              a("--tw-divide-x-reverse", "0"),
              a("border-inline-style", "var(--tw-border-style)"),
              a(
                "border-inline-start-width",
                `calc(${h} * var(--tw-divide-x-reverse))`,
              ),
              a(
                "border-inline-end-width",
                `calc(${h} * calc(1 - var(--tw-divide-x-reverse)))`,
              ),
            ]),
          ],
        }),
        n("divide-y", {
          defaultValue: t.get(["--default-border-width"]) ?? "1px",
          themeKeys: ["--divide-width", "--border-width"],
          handleBareValue: ({ value: h }) => (N(h) ? `${h}px` : null),
          handle: (h) => [
            D([S("--tw-divide-y-reverse", "0")]),
            z(":where(& > :not(:last-child))", [
              a("--tw-sort", "divide-y-width"),
              i(),
              a("--tw-divide-y-reverse", "0"),
              a("border-bottom-style", "var(--tw-border-style)"),
              a("border-top-style", "var(--tw-border-style)"),
              a("border-top-width", `calc(${h} * var(--tw-divide-y-reverse))`),
              a(
                "border-bottom-width",
                `calc(${h} * calc(1 - var(--tw-divide-y-reverse)))`,
              ),
            ]),
          ],
        }),
        o("divide-x", () => [
          {
            values: ["0", "2", "4", "8"],
            valueThemeKeys: ["--divide-width", "--border-width"],
            hasDefaultValue: !0,
          },
        ]),
        o("divide-y", () => [
          {
            values: ["0", "2", "4", "8"],
            valueThemeKeys: ["--divide-width", "--border-width"],
            hasDefaultValue: !0,
          },
        ]),
        e("divide-x-reverse", [
          () => D([S("--tw-divide-x-reverse", "0")]),
          () =>
            z(":where(& > :not(:last-child))", [
              a("--tw-divide-x-reverse", "1"),
            ]),
        ]),
        e("divide-y-reverse", [
          () => D([S("--tw-divide-y-reverse", "0")]),
          () =>
            z(":where(& > :not(:last-child))", [
              a("--tw-divide-y-reverse", "1"),
            ]),
        ]);
      for (let h of ["solid", "dashed", "dotted", "double", "none"])
        e(`divide-${h}`, [
          () =>
            z(":where(& > :not(:last-child))", [
              a("--tw-sort", "divide-style"),
              a("--tw-border-style", h),
              a("border-style", h),
            ]),
        ]);
    }
    e("bg-auto", [["background-size", "auto"]]),
      e("bg-cover", [["background-size", "cover"]]),
      e("bg-contain", [["background-size", "contain"]]),
      e("bg-fixed", [["background-attachment", "fixed"]]),
      e("bg-local", [["background-attachment", "local"]]),
      e("bg-scroll", [["background-attachment", "scroll"]]),
      e("bg-center", [["background-position", "center"]]),
      e("bg-top", [["background-position", "top"]]),
      e("bg-right-top", [["background-position", "right top"]]),
      e("bg-right", [["background-position", "right"]]),
      e("bg-right-bottom", [["background-position", "right bottom"]]),
      e("bg-bottom", [["background-position", "bottom"]]),
      e("bg-left-bottom", [["background-position", "left bottom"]]),
      e("bg-left", [["background-position", "left"]]),
      e("bg-left-top", [["background-position", "left top"]]),
      e("bg-repeat", [["background-repeat", "repeat"]]),
      e("bg-no-repeat", [["background-repeat", "no-repeat"]]),
      e("bg-repeat-x", [["background-repeat", "repeat-x"]]),
      e("bg-repeat-y", [["background-repeat", "repeat-y"]]),
      e("bg-repeat-round", [["background-repeat", "round"]]),
      e("bg-repeat-space", [["background-repeat", "space"]]),
      e("bg-none", [["background-image", "none"]]);
    {
      let h = function (T) {
          let E = "in oklab";
          if (T?.kind === "named")
            switch (T.value) {
              case "longer":
              case "shorter":
              case "increasing":
              case "decreasing":
                E = `in oklch ${T.value} hue`;
                break;
              default:
                E = `in ${T.value}`;
            }
          else T?.kind === "arbitrary" && (E = T.value);
          return E;
        },
        w = function ({ negative: T }) {
          return (E) => {
            if (!E.value) return;
            if (E.value.kind === "arbitrary") {
              if (E.modifier) return;
              let F = E.value.value;
              switch (E.value.dataType ?? I(F, ["angle"])) {
                case "angle":
                  return (
                    (F = T ? `calc(${F} * -1)` : `${F}`),
                    [
                      a("--tw-gradient-position", F),
                      a(
                        "background-image",
                        `linear-gradient(var(--tw-gradient-stops,${F}))`,
                      ),
                    ]
                  );
                default:
                  return T
                    ? void 0
                    : [
                        a("--tw-gradient-position", F),
                        a(
                          "background-image",
                          `linear-gradient(var(--tw-gradient-stops,${F}))`,
                        ),
                      ];
              }
            }
            let C = E.value.value;
            if (!T && f.has(C)) C = f.get(C);
            else if (N(C)) C = T ? `calc(${C}deg * -1)` : `${C}deg`;
            else return;
            let A = h(E.modifier);
            return [
              a("--tw-gradient-position", `${C} ${A}`),
              a(
                "background-image",
                "linear-gradient(var(--tw-gradient-stops))",
              ),
            ];
          };
        },
        k = function ({ negative: T }) {
          return (E) => {
            if (E.value?.kind === "arbitrary") {
              if (E.modifier) return;
              let F = E.value.value;
              return [
                a("--tw-gradient-position", F),
                a(
                  "background-image",
                  `conic-gradient(var(--tw-gradient-stops,${F}))`,
                ),
              ];
            }
            let C = h(E.modifier);
            if (!E.value)
              return [
                a("--tw-gradient-position", C),
                a(
                  "background-image",
                  "conic-gradient(var(--tw-gradient-stops))",
                ),
              ];
            let A = E.value.value;
            if (N(A))
              return (
                (A = T ? `calc(${A} * -1)` : `${A}deg`),
                [
                  a("--tw-gradient-position", `from ${A} ${C}`),
                  a(
                    "background-image",
                    "conic-gradient(var(--tw-gradient-stops))",
                  ),
                ]
              );
          };
        };
      var $ = h,
        V = w,
        O = k;
      let i = [
          "oklab",
          "oklch",
          "srgb",
          "hsl",
          "longer",
          "shorter",
          "increasing",
          "decreasing",
        ],
        f = new Map([
          ["to-t", "to top"],
          ["to-tr", "to top right"],
          ["to-r", "to right"],
          ["to-br", "to bottom right"],
          ["to-b", "to bottom"],
          ["to-bl", "to bottom left"],
          ["to-l", "to left"],
          ["to-tl", "to top left"],
        ]);
      r.functional("-bg-linear", w({ negative: !0 })),
        r.functional("bg-linear", w({ negative: !1 })),
        o("bg-linear", () => [
          { values: [...f.keys()], modifiers: i },
          {
            values: [
              "0",
              "30",
              "60",
              "90",
              "120",
              "150",
              "180",
              "210",
              "240",
              "270",
              "300",
              "330",
            ],
            supportsNegative: !0,
            modifiers: i,
          },
        ]),
        r.functional("-bg-conic", k({ negative: !0 })),
        r.functional("bg-conic", k({ negative: !1 })),
        o("bg-conic", () => [
          { hasDefaultValue: !0, modifiers: i },
          {
            values: [
              "0",
              "30",
              "60",
              "90",
              "120",
              "150",
              "180",
              "210",
              "240",
              "270",
              "300",
              "330",
            ],
            supportsNegative: !0,
            modifiers: i,
          },
        ]),
        r.functional("bg-radial", (T) => {
          if (!T.value) {
            let E = h(T.modifier);
            return [
              a("--tw-gradient-position", E),
              a(
                "background-image",
                "radial-gradient(var(--tw-gradient-stops))",
              ),
            ];
          }
          if (T.value.kind === "arbitrary") {
            if (T.modifier) return;
            let E = T.value.value;
            return [
              a("--tw-gradient-position", E),
              a(
                "background-image",
                `radial-gradient(var(--tw-gradient-stops,${E}))`,
              ),
            ];
          }
        }),
        o("bg-radial", () => [{ hasDefaultValue: !0, modifiers: i }]);
    }
    r.functional("bg", (i) => {
      if (i.value) {
        if (i.value.kind === "arbitrary") {
          let f = i.value.value;
          switch (
            i.value.dataType ??
            I(f, [
              "image",
              "color",
              "percentage",
              "position",
              "bg-size",
              "length",
              "url",
            ])
          ) {
            case "percentage":
            case "position":
              return i.modifier ? void 0 : [a("background-position", f)];
            case "bg-size":
            case "length":
            case "size":
              return i.modifier ? void 0 : [a("background-size", f)];
            case "image":
            case "url":
              return i.modifier ? void 0 : [a("background-image", f)];
            default:
              return (
                (f = B(f, i.modifier, t)),
                f === null ? void 0 : [a("background-color", f)]
              );
          }
        }
        {
          let f = G(i, t, ["--background-color", "--color"]);
          if (f) return [a("background-color", f)];
        }
        {
          if (i.modifier) return;
          let f = t.resolve(i.value.value, ["--background-image"]);
          if (f) return [a("background-image", f)];
        }
      }
    }),
      o("bg", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--background-color", "--color"],
          modifiers: Array.from({ length: 21 }, (i, f) => `${f * 5}`),
        },
        { values: [], valueThemeKeys: ["--background-image"] },
      ]);
    let y = () =>
      D([
        S("--tw-gradient-position"),
        S("--tw-gradient-from", "#0000", "<color>"),
        S("--tw-gradient-via", "#0000", "<color>"),
        S("--tw-gradient-to", "#0000", "<color>"),
        S("--tw-gradient-stops"),
        S("--tw-gradient-via-stops"),
        S("--tw-gradient-from-position", "0%", "<length-percentage>"),
        S("--tw-gradient-via-position", "50%", "<length-percentage>"),
        S("--tw-gradient-to-position", "100%", "<length-percentage>"),
      ]);
    function b(i, f) {
      r.functional(i, (h) => {
        if (h.value) {
          if (h.value.kind === "arbitrary") {
            let w = h.value.value;
            switch (
              h.value.dataType ??
              I(w, ["color", "length", "percentage"])
            ) {
              case "length":
              case "percentage":
                return h.modifier ? void 0 : f.position(w);
              default:
                return (
                  (w = B(w, h.modifier, t)), w === null ? void 0 : f.color(w)
                );
            }
          }
          {
            let w = G(h, t, ["--background-color", "--color"]);
            if (w) return f.color(w);
          }
          {
            if (h.modifier) return;
            let w = t.resolve(h.value.value, [
              "--gradient-color-stop-positions",
            ]);
            if (w) return f.position(w);
            if (
              h.value.value[h.value.value.length - 1] === "%" &&
              N(h.value.value.slice(0, -1))
            )
              return f.position(h.value.value);
          }
        }
      }),
        o(i, () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--background-color", "--color"],
            modifiers: Array.from({ length: 21 }, (h, w) => `${w * 5}`),
          },
          {
            values: Array.from({ length: 21 }, (h, w) => `${w * 5}%`),
            valueThemeKeys: ["--gradient-color-stop-positions"],
          },
        ]);
    }
    b("from", {
      color: (i) => [
        y(),
        a("--tw-sort", "--tw-gradient-from"),
        a("--tw-gradient-from", i),
        a(
          "--tw-gradient-stops",
          "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
        ),
      ],
      position: (i) => [y(), a("--tw-gradient-from-position", i)],
    }),
      e("via-none", [["--tw-gradient-via-stops", "initial"]]),
      b("via", {
        color: (i) => [
          y(),
          a("--tw-sort", "--tw-gradient-via"),
          a("--tw-gradient-via", i),
          a(
            "--tw-gradient-via-stops",
            "var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)",
          ),
          a("--tw-gradient-stops", "var(--tw-gradient-via-stops)"),
        ],
        position: (i) => [y(), a("--tw-gradient-via-position", i)],
      }),
      b("to", {
        color: (i) => [
          y(),
          a("--tw-sort", "--tw-gradient-to"),
          a("--tw-gradient-to", i),
          a(
            "--tw-gradient-stops",
            "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
          ),
        ],
        position: (i) => [y(), a("--tw-gradient-to-position", i)],
      }),
      e("box-decoration-slice", [
        ["-webkit-box-decoration-break", "slice"],
        ["box-decoration-break", "slice"],
      ]),
      e("box-decoration-clone", [
        ["-webkit-box-decoration-break", "clone"],
        ["box-decoration-break", "clone"],
      ]),
      e("bg-clip-text", [["background-clip", "text"]]),
      e("bg-clip-border", [["background-clip", "border-box"]]),
      e("bg-clip-padding", [["background-clip", "padding-box"]]),
      e("bg-clip-content", [["background-clip", "content-box"]]),
      e("bg-origin-border", [["background-origin", "border-box"]]),
      e("bg-origin-padding", [["background-origin", "padding-box"]]),
      e("bg-origin-content", [["background-origin", "content-box"]]);
    for (let i of [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "color",
      "luminosity",
    ])
      e(`bg-blend-${i}`, [["background-blend-mode", i]]),
        e(`mix-blend-${i}`, [["mix-blend-mode", i]]);
    e("mix-blend-plus-darker", [["mix-blend-mode", "plus-darker"]]),
      e("mix-blend-plus-lighter", [["mix-blend-mode", "plus-lighter"]]),
      e("fill-none", [["fill", "none"]]),
      r.functional("fill", (i) => {
        if (!i.value) return;
        if (i.value.kind === "arbitrary") {
          let h = B(i.value.value, i.modifier, t);
          return h === null ? void 0 : [a("fill", h)];
        }
        let f = G(i, t, ["--fill", "--color"]);
        if (f) return [a("fill", f)];
      }),
      o("fill", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--fill", "--color"],
          modifiers: Array.from({ length: 21 }, (i, f) => `${f * 5}`),
        },
      ]),
      e("stroke-none", [["stroke", "none"]]),
      r.functional("stroke", (i) => {
        if (i.value) {
          if (i.value.kind === "arbitrary") {
            let f = i.value.value;
            switch (
              i.value.dataType ??
              I(f, ["color", "number", "length", "percentage"])
            ) {
              case "number":
              case "length":
              case "percentage":
                return i.modifier ? void 0 : [a("stroke-width", f)];
              default:
                return (
                  (f = B(i.value.value, i.modifier, t)),
                  f === null ? void 0 : [a("stroke", f)]
                );
            }
          }
          {
            let f = G(i, t, ["--stroke", "--color"]);
            if (f) return [a("stroke", f)];
          }
          {
            let f = t.resolve(i.value.value, ["--stroke-width"]);
            if (f) return [a("stroke-width", f)];
            if (N(i.value.value)) return [a("stroke-width", i.value.value)];
          }
        }
      }),
      o("stroke", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--stroke", "--color"],
          modifiers: Array.from({ length: 21 }, (i, f) => `${f * 5}`),
        },
        { values: ["0", "1", "2", "3"], valueThemeKeys: ["--stroke-width"] },
      ]),
      e("object-contain", [["object-fit", "contain"]]),
      e("object-cover", [["object-fit", "cover"]]),
      e("object-fill", [["object-fit", "fill"]]),
      e("object-none", [["object-fit", "none"]]),
      e("object-scale-down", [["object-fit", "scale-down"]]),
      e("object-bottom", [["object-position", "bottom"]]),
      e("object-center", [["object-position", "center"]]),
      e("object-left", [["object-position", "left"]]),
      e("object-left-bottom", [["object-position", "left bottom"]]),
      e("object-left-top", [["object-position", "left top"]]),
      e("object-right", [["object-position", "right"]]),
      e("object-right-bottom", [["object-position", "right bottom"]]),
      e("object-right-top", [["object-position", "right top"]]),
      e("object-top", [["object-position", "top"]]),
      n("object", {
        themeKeys: ["--object-position"],
        handle: (i) => [a("object-position", i)],
      });
    for (let [i, f] of [
      ["p", "padding"],
      ["px", "padding-inline"],
      ["py", "padding-block"],
      ["ps", "padding-inline-start"],
      ["pe", "padding-inline-end"],
      ["pt", "padding-top"],
      ["pr", "padding-right"],
      ["pb", "padding-bottom"],
      ["pl", "padding-left"],
    ])
      l(i, ["--padding", "--spacing"], (h) => [a(f, h)]);
    e("text-left", [["text-align", "left"]]),
      e("text-center", [["text-align", "center"]]),
      e("text-right", [["text-align", "right"]]),
      e("text-justify", [["text-align", "justify"]]),
      e("text-start", [["text-align", "start"]]),
      e("text-end", [["text-align", "end"]]),
      l(
        "indent",
        ["--text-indent", "--spacing"],
        (i) => [a("text-indent", i)],
        { supportsNegative: !0 },
      ),
      e("align-baseline", [["vertical-align", "baseline"]]),
      e("align-top", [["vertical-align", "top"]]),
      e("align-middle", [["vertical-align", "middle"]]),
      e("align-bottom", [["vertical-align", "bottom"]]),
      e("align-text-top", [["vertical-align", "text-top"]]),
      e("align-text-bottom", [["vertical-align", "text-bottom"]]),
      e("align-sub", [["vertical-align", "sub"]]),
      e("align-super", [["vertical-align", "super"]]),
      n("align", { themeKeys: [], handle: (i) => [a("vertical-align", i)] }),
      r.functional("font", (i) => {
        if (!(!i.value || i.modifier)) {
          if (i.value.kind === "arbitrary") {
            let f = i.value.value;
            switch (
              i.value.dataType ??
              I(f, ["number", "generic-name", "family-name"])
            ) {
              case "generic-name":
              case "family-name":
                return [a("font-family", f)];
              default:
                return [
                  D([S("--tw-font-weight")]),
                  a("--tw-font-weight", f),
                  a("font-weight", f),
                ];
            }
          }
          {
            let f = t.resolveWith(
              i.value.value,
              ["--font"],
              ["--font-feature-settings", "--font-variation-settings"],
            );
            if (f) {
              let [h, w = {}] = f;
              return [
                a("font-family", h),
                a("font-feature-settings", w["--font-feature-settings"]),
                a("font-variation-settings", w["--font-variation-settings"]),
              ];
            }
          }
          {
            let f = t.resolve(i.value.value, ["--font-weight"]);
            if (f)
              return [
                D([S("--tw-font-weight")]),
                a("--tw-font-weight", f),
                a("font-weight", f),
              ];
          }
        }
      }),
      o("font", () => [
        { values: [], valueThemeKeys: ["--font"] },
        { values: [], valueThemeKeys: ["--font-weight"] },
      ]),
      e("uppercase", [["text-transform", "uppercase"]]),
      e("lowercase", [["text-transform", "lowercase"]]),
      e("capitalize", [["text-transform", "capitalize"]]),
      e("normal-case", [["text-transform", "none"]]),
      e("italic", [["font-style", "italic"]]),
      e("not-italic", [["font-style", "normal"]]),
      e("underline", [["text-decoration-line", "underline"]]),
      e("overline", [["text-decoration-line", "overline"]]),
      e("line-through", [["text-decoration-line", "line-through"]]),
      e("no-underline", [["text-decoration-line", "none"]]),
      e("font-stretch-normal", [["font-stretch", "normal"]]),
      e("font-stretch-ultra-condensed", [["font-stretch", "ultra-condensed"]]),
      e("font-stretch-extra-condensed", [["font-stretch", "extra-condensed"]]),
      e("font-stretch-condensed", [["font-stretch", "condensed"]]),
      e("font-stretch-semi-condensed", [["font-stretch", "semi-condensed"]]),
      e("font-stretch-semi-expanded", [["font-stretch", "semi-expanded"]]),
      e("font-stretch-expanded", [["font-stretch", "expanded"]]),
      e("font-stretch-extra-expanded", [["font-stretch", "extra-expanded"]]),
      e("font-stretch-ultra-expanded", [["font-stretch", "ultra-expanded"]]),
      n("font-stretch", {
        handleBareValue: ({ value: i }) => {
          if (!i.endsWith("%")) return null;
          let f = Number(i.slice(0, -1));
          return !N(f) || Number.isNaN(f) || f < 50 || f > 200 ? null : i;
        },
        handle: (i) => [a("font-stretch", i)],
      }),
      o("font-stretch", () => [
        {
          values: [
            "50%",
            "75%",
            "90%",
            "95%",
            "100%",
            "105%",
            "110%",
            "125%",
            "150%",
            "200%",
          ],
        },
      ]),
      s("placeholder", {
        themeKeys: ["--background-color", "--color"],
        handle: (i) => [
          z("&::placeholder", [
            a("--tw-sort", "placeholder-color"),
            a("color", i),
          ]),
        ],
      }),
      e("decoration-solid", [["text-decoration-style", "solid"]]),
      e("decoration-double", [["text-decoration-style", "double"]]),
      e("decoration-dotted", [["text-decoration-style", "dotted"]]),
      e("decoration-dashed", [["text-decoration-style", "dashed"]]),
      e("decoration-wavy", [["text-decoration-style", "wavy"]]),
      e("decoration-auto", [["text-decoration-thickness", "auto"]]),
      e("decoration-from-font", [["text-decoration-thickness", "from-font"]]),
      r.functional("decoration", (i) => {
        if (i.value) {
          if (i.value.kind === "arbitrary") {
            let f = i.value.value;
            switch (
              i.value.dataType ??
              I(f, ["color", "length", "percentage"])
            ) {
              case "length":
              case "percentage":
                return i.modifier
                  ? void 0
                  : [a("text-decoration-thickness", f)];
              default:
                return (
                  (f = B(f, i.modifier, t)),
                  f === null ? void 0 : [a("text-decoration-color", f)]
                );
            }
          }
          {
            let f = t.resolve(i.value.value, ["--text-decoration-thickness"]);
            if (f)
              return i.modifier ? void 0 : [a("text-decoration-thickness", f)];
            if (N(i.value.value))
              return i.modifier
                ? void 0
                : [a("text-decoration-thickness", `${i.value.value}px`)];
          }
          {
            let f = G(i, t, ["--text-decoration-color", "--color"]);
            if (f) return [a("text-decoration-color", f)];
          }
        }
      }),
      o("decoration", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--text-decoration-color", "--color"],
          modifiers: Array.from({ length: 21 }, (i, f) => `${f * 5}`),
        },
        {
          values: ["0", "1", "2"],
          valueThemeKeys: ["--text-decoration-thickness"],
        },
      ]),
      e("animate-none", [["animation", "none"]]),
      n("animate", {
        themeKeys: ["--animate"],
        handle: (i) => [a("animation", i)],
      });
    {
      let i = [
          "var(--tw-blur,)",
          "var(--tw-brightness,)",
          "var(--tw-contrast,)",
          "var(--tw-grayscale,)",
          "var(--tw-hue-rotate,)",
          "var(--tw-invert,)",
          "var(--tw-saturate,)",
          "var(--tw-sepia,)",
          "var(--tw-drop-shadow,)",
        ].join(" "),
        f = [
          "var(--tw-backdrop-blur,)",
          "var(--tw-backdrop-brightness,)",
          "var(--tw-backdrop-contrast,)",
          "var(--tw-backdrop-grayscale,)",
          "var(--tw-backdrop-hue-rotate,)",
          "var(--tw-backdrop-invert,)",
          "var(--tw-backdrop-opacity,)",
          "var(--tw-backdrop-saturate,)",
          "var(--tw-backdrop-sepia,)",
        ].join(" "),
        h = () =>
          D([
            S("--tw-blur"),
            S("--tw-brightness"),
            S("--tw-contrast"),
            S("--tw-grayscale"),
            S("--tw-hue-rotate"),
            S("--tw-invert"),
            S("--tw-opacity"),
            S("--tw-saturate"),
            S("--tw-sepia"),
            S("--tw-drop-shadow"),
          ]),
        w = () =>
          D([
            S("--tw-backdrop-blur"),
            S("--tw-backdrop-brightness"),
            S("--tw-backdrop-contrast"),
            S("--tw-backdrop-grayscale"),
            S("--tw-backdrop-hue-rotate"),
            S("--tw-backdrop-invert"),
            S("--tw-backdrop-opacity"),
            S("--tw-backdrop-saturate"),
            S("--tw-backdrop-sepia"),
          ]);
      r.functional("filter", (k) => {
        if (!k.modifier) {
          if (k.value === null) return [h(), a("filter", i)];
          if (k.value.kind === "arbitrary") return [a("filter", k.value.value)];
          switch (k.value.value) {
            case "none":
              return [a("filter", "none")];
          }
        }
      }),
        r.functional("backdrop-filter", (k) => {
          if (!k.modifier) {
            if (k.value === null)
              return [
                w(),
                a("-webkit-backdrop-filter", f),
                a("backdrop-filter", f),
              ];
            if (k.value.kind === "arbitrary")
              return [
                a("-webkit-backdrop-filter", k.value.value),
                a("backdrop-filter", k.value.value),
              ];
            switch (k.value.value) {
              case "none":
                return [
                  a("-webkit-backdrop-filter", "none"),
                  a("backdrop-filter", "none"),
                ];
            }
          }
        }),
        n("blur", {
          themeKeys: ["--blur"],
          handle: (k) => [h(), a("--tw-blur", `blur(${k})`), a("filter", i)],
        }),
        e("blur-none", [h, ["--tw-blur", " "], ["filter", i]]),
        n("backdrop-blur", {
          themeKeys: ["--backdrop-blur", "--blur"],
          handle: (k) => [
            w(),
            a("--tw-backdrop-blur", `blur(${k})`),
            a("-webkit-backdrop-filter", f),
            a("backdrop-filter", f),
          ],
        }),
        e("backdrop-blur-none", [
          w,
          ["--tw-backdrop-blur", " "],
          ["-webkit-backdrop-filter", f],
          ["backdrop-filter", f],
        ]),
        n("brightness", {
          themeKeys: ["--brightness"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          handle: (k) => [
            h(),
            a("--tw-brightness", `brightness(${k})`),
            a("filter", i),
          ],
        }),
        n("backdrop-brightness", {
          themeKeys: ["--backdrop-brightness", "--brightness"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          handle: (k) => [
            w(),
            a("--tw-backdrop-brightness", `brightness(${k})`),
            a("-webkit-backdrop-filter", f),
            a("backdrop-filter", f),
          ],
        }),
        o("brightness", () => [
          {
            values: [
              "0",
              "50",
              "75",
              "90",
              "95",
              "100",
              "105",
              "110",
              "125",
              "150",
              "200",
            ],
            valueThemeKeys: ["--brightness"],
          },
        ]),
        o("backdrop-brightness", () => [
          {
            values: [
              "0",
              "50",
              "75",
              "90",
              "95",
              "100",
              "105",
              "110",
              "125",
              "150",
              "200",
            ],
            valueThemeKeys: ["--backdrop-brightness", "--brightness"],
          },
        ]),
        n("contrast", {
          themeKeys: ["--contrast"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          handle: (k) => [
            h(),
            a("--tw-contrast", `contrast(${k})`),
            a("filter", i),
          ],
        }),
        n("backdrop-contrast", {
          themeKeys: ["--backdrop-contrast", "--contrast"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          handle: (k) => [
            w(),
            a("--tw-backdrop-contrast", `contrast(${k})`),
            a("-webkit-backdrop-filter", f),
            a("backdrop-filter", f),
          ],
        }),
        o("contrast", () => [
          {
            values: ["0", "50", "75", "100", "125", "150", "200"],
            valueThemeKeys: ["--contrast"],
          },
        ]),
        o("backdrop-contrast", () => [
          {
            values: ["0", "50", "75", "100", "125", "150", "200"],
            valueThemeKeys: ["--backdrop-contrast", "--contrast"],
          },
        ]),
        n("grayscale", {
          themeKeys: ["--grayscale"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          defaultValue: "100%",
          handle: (k) => [
            h(),
            a("--tw-grayscale", `grayscale(${k})`),
            a("filter", i),
          ],
        }),
        n("backdrop-grayscale", {
          themeKeys: ["--backdrop-grayscale", "--grayscale"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          defaultValue: "100%",
          handle: (k) => [
            w(),
            a("--tw-backdrop-grayscale", `grayscale(${k})`),
            a("-webkit-backdrop-filter", f),
            a("backdrop-filter", f),
          ],
        }),
        o("grayscale", () => [
          {
            values: ["0", "25", "50", "75", "100"],
            valueThemeKeys: ["--grayscale"],
            hasDefaultValue: !0,
          },
        ]),
        o("backdrop-grayscale", () => [
          {
            values: ["0", "25", "50", "75", "100"],
            valueThemeKeys: ["--backdrop-grayscale", "--grayscale"],
            hasDefaultValue: !0,
          },
        ]),
        n("hue-rotate", {
          supportsNegative: !0,
          themeKeys: ["--hue-rotate"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}deg` : null),
          handle: (k) => [
            h(),
            a("--tw-hue-rotate", `hue-rotate(${k})`),
            a("filter", i),
          ],
        }),
        n("backdrop-hue-rotate", {
          supportsNegative: !0,
          themeKeys: ["--backdrop-hue-rotate", "--hue-rotate"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}deg` : null),
          handle: (k) => [
            w(),
            a("--tw-backdrop-hue-rotate", `hue-rotate(${k})`),
            a("-webkit-backdrop-filter", f),
            a("backdrop-filter", f),
          ],
        }),
        o("hue-rotate", () => [
          {
            values: ["0", "15", "30", "60", "90", "180"],
            valueThemeKeys: ["--hue-rotate"],
          },
        ]),
        o("backdrop-hue-rotate", () => [
          {
            values: ["0", "15", "30", "60", "90", "180"],
            valueThemeKeys: ["--backdrop-hue-rotate", "--hue-rotate"],
          },
        ]),
        n("invert", {
          themeKeys: ["--invert"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          defaultValue: "100%",
          handle: (k) => [
            h(),
            a("--tw-invert", `invert(${k})`),
            a("filter", i),
          ],
        }),
        n("backdrop-invert", {
          themeKeys: ["--backdrop-invert", "--invert"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          defaultValue: "100%",
          handle: (k) => [
            w(),
            a("--tw-backdrop-invert", `invert(${k})`),
            a("-webkit-backdrop-filter", f),
            a("backdrop-filter", f),
          ],
        }),
        o("invert", () => [
          {
            values: ["0", "25", "50", "75", "100"],
            valueThemeKeys: ["--invert"],
            hasDefaultValue: !0,
          },
        ]),
        o("backdrop-invert", () => [
          {
            values: ["0", "25", "50", "75", "100"],
            valueThemeKeys: ["--backdrop-invert", "--invert"],
            hasDefaultValue: !0,
          },
        ]),
        n("saturate", {
          themeKeys: ["--saturate"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          handle: (k) => [
            h(),
            a("--tw-saturate", `saturate(${k})`),
            a("filter", i),
          ],
        }),
        n("backdrop-saturate", {
          themeKeys: ["--backdrop-saturate", "--saturate"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          handle: (k) => [
            w(),
            a("--tw-backdrop-saturate", `saturate(${k})`),
            a("-webkit-backdrop-filter", f),
            a("backdrop-filter", f),
          ],
        }),
        o("saturate", () => [
          {
            values: ["0", "50", "100", "150", "200"],
            valueThemeKeys: ["--saturate"],
          },
        ]),
        o("backdrop-saturate", () => [
          {
            values: ["0", "50", "100", "150", "200"],
            valueThemeKeys: ["--backdrop-saturate", "--saturate"],
          },
        ]),
        n("sepia", {
          themeKeys: ["--sepia"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          defaultValue: "100%",
          handle: (k) => [h(), a("--tw-sepia", `sepia(${k})`), a("filter", i)],
        }),
        n("backdrop-sepia", {
          themeKeys: ["--backdrop-sepia", "--sepia"],
          handleBareValue: ({ value: k }) => (N(k) ? `${k}%` : null),
          defaultValue: "100%",
          handle: (k) => [
            w(),
            a("--tw-backdrop-sepia", `sepia(${k})`),
            a("-webkit-backdrop-filter", f),
            a("backdrop-filter", f),
          ],
        }),
        o("sepia", () => [
          {
            values: ["0", "50", "100"],
            valueThemeKeys: ["--sepia"],
            hasDefaultValue: !0,
          },
        ]),
        o("backdrop-sepia", () => [
          {
            values: ["0", "50", "100"],
            valueThemeKeys: ["--backdrop-sepia", "--sepia"],
            hasDefaultValue: !0,
          },
        ]),
        e("drop-shadow-none", [h, ["--tw-drop-shadow", " "], ["filter", i]]),
        n("drop-shadow", {
          themeKeys: ["--drop-shadow"],
          handle: (k) => [
            h(),
            a(
              "--tw-drop-shadow",
              P(k, ",")
                .map((T) => `drop-shadow(${T})`)
                .join(" "),
            ),
            a("filter", i),
          ],
        }),
        n("backdrop-opacity", {
          themeKeys: ["--backdrop-opacity", "--opacity"],
          handleBareValue: ({ value: k }) => (Me(k) ? `${k}%` : null),
          handle: (k) => [
            w(),
            a("--tw-backdrop-opacity", `opacity(${k})`),
            a("-webkit-backdrop-filter", f),
            a("backdrop-filter", f),
          ],
        }),
        o("backdrop-opacity", () => [
          {
            values: Array.from({ length: 21 }, (k, T) => `${T * 5}`),
            valueThemeKeys: ["--backdrop-opacity", "--opacity"],
          },
        ]);
    }
    {
      let i = `var(--tw-ease, ${t.resolve(null, ["--default-transition-timing-function"]) ?? "ease"})`,
        f = `var(--tw-duration, ${t.resolve(null, ["--default-transition-duration"]) ?? "0s"})`;
      e("transition-none", [["transition-property", "none"]]),
        e("transition-all", [
          ["transition-property", "all"],
          ["transition-timing-function", i],
          ["transition-duration", f],
        ]),
        e("transition-colors", [
          [
            "transition-property",
            "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to",
          ],
          ["transition-timing-function", i],
          ["transition-duration", f],
        ]),
        e("transition-opacity", [
          ["transition-property", "opacity"],
          ["transition-timing-function", i],
          ["transition-duration", f],
        ]),
        e("transition-shadow", [
          ["transition-property", "box-shadow"],
          ["transition-timing-function", i],
          ["transition-duration", f],
        ]),
        e("transition-transform", [
          ["transition-property", "transform, translate, scale, rotate"],
          ["transition-timing-function", i],
          ["transition-duration", f],
        ]),
        n("transition", {
          defaultValue:
            "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter",
          themeKeys: ["--transition-property"],
          handle: (h) => [
            a("transition-property", h),
            a("transition-timing-function", i),
            a("transition-duration", f),
          ],
        }),
        e("transition-discrete", [["transition-behavior", "allow-discrete"]]),
        e("transition-normal", [["transition-behavior", "normal"]]),
        n("delay", {
          handleBareValue: ({ value: h }) => (N(h) ? `${h}ms` : null),
          themeKeys: ["--transition-delay"],
          handle: (h) => [a("transition-delay", h)],
        });
      {
        let h = () => D([S("--tw-duration")]);
        e("duration-initial", [h, ["--tw-duration", "initial"]]),
          r.functional("duration", (w) => {
            if (w.modifier || !w.value) return;
            let k = null;
            if (
              (w.value.kind === "arbitrary"
                ? (k = w.value.value)
                : ((k = t.resolve(w.value.fraction ?? w.value.value, [
                    "--transition-duration",
                  ])),
                  k === null && N(w.value.value) && (k = `${w.value.value}ms`)),
              k !== null)
            )
              return [h(), a("--tw-duration", k), a("transition-duration", k)];
          });
      }
      o("delay", () => [
        {
          values: ["75", "100", "150", "200", "300", "500", "700", "1000"],
          valueThemeKeys: ["--transition-delay"],
        },
      ]),
        o("duration", () => [
          {
            values: ["75", "100", "150", "200", "300", "500", "700", "1000"],
            valueThemeKeys: ["--transition-duration"],
          },
        ]);
    }
    {
      let i = () => D([S("--tw-ease")]);
      e("ease-initial", [i, ["--tw-ease", "initial"]]),
        e("ease-linear", [
          i,
          ["--tw-ease", "linear"],
          ["transition-timing-function", "linear"],
        ]),
        n("ease", {
          themeKeys: ["--ease"],
          handle: (f) => [
            i(),
            a("--tw-ease", f),
            a("transition-timing-function", f),
          ],
        });
    }
    e("will-change-auto", [["will-change", "auto"]]),
      e("will-change-scroll", [["will-change", "scroll-position"]]),
      e("will-change-contents", [["will-change", "contents"]]),
      e("will-change-transform", [["will-change", "transform"]]),
      n("will-change", { themeKeys: [], handle: (i) => [a("will-change", i)] }),
      e("content-none", [
        ["--tw-content", "none"],
        ["content", "none"],
      ]),
      n("content", {
        themeKeys: [],
        handle: (i) => [
          D([S("--tw-content", '""')]),
          a("--tw-content", i),
          a("content", "var(--tw-content)"),
        ],
      });
    {
      let i =
          "var(--tw-contain-size,) var(--tw-contain-layout,) var(--tw-contain-paint,) var(--tw-contain-style,)",
        f = () =>
          D([
            S("--tw-contain-size"),
            S("--tw-contain-layout"),
            S("--tw-contain-paint"),
            S("--tw-contain-style"),
          ]);
      e("contain-none", [["contain", "none"]]),
        e("contain-content", [["contain", "content"]]),
        e("contain-strict", [["contain", "strict"]]),
        e("contain-size", [f, ["--tw-contain-size", "size"], ["contain", i]]),
        e("contain-inline-size", [
          f,
          ["--tw-contain-size", "inline-size"],
          ["contain", i],
        ]),
        e("contain-layout", [
          f,
          ["--tw-contain-layout", "layout"],
          ["contain", i],
        ]),
        e("contain-paint", [
          f,
          ["--tw-contain-paint", "paint"],
          ["contain", i],
        ]),
        e("contain-style", [
          f,
          ["--tw-contain-style", "style"],
          ["contain", i],
        ]),
        n("contain", { themeKeys: [], handle: (h) => [a("contain", h)] });
    }
    e("forced-color-adjust-none", [["forced-color-adjust", "none"]]),
      e("forced-color-adjust-auto", [["forced-color-adjust", "auto"]]),
      e("leading-none", [
        () => D([S("--tw-leading")]),
        ["--tw-leading", "1"],
        ["line-height", "1"],
      ]),
      l("leading", ["--leading", "--spacing"], (i) => [
        D([S("--tw-leading")]),
        a("--tw-leading", i),
        a("line-height", i),
      ]),
      n("tracking", {
        supportsNegative: !0,
        themeKeys: ["--tracking"],
        handle: (i) => [
          D([S("--tw-tracking")]),
          a("--tw-tracking", i),
          a("letter-spacing", i),
        ],
      }),
      e("antialiased", [
        ["-webkit-font-smoothing", "antialiased"],
        ["-moz-osx-font-smoothing", "grayscale"],
      ]),
      e("subpixel-antialiased", [
        ["-webkit-font-smoothing", "auto"],
        ["-moz-osx-font-smoothing", "auto"],
      ]);
    {
      let i =
          "var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)",
        f = () =>
          D([
            S("--tw-ordinal"),
            S("--tw-slashed-zero"),
            S("--tw-numeric-figure"),
            S("--tw-numeric-spacing"),
            S("--tw-numeric-fraction"),
          ]);
      e("normal-nums", [["font-variant-numeric", "normal"]]),
        e("ordinal", [
          f,
          ["--tw-ordinal", "ordinal"],
          ["font-variant-numeric", i],
        ]),
        e("slashed-zero", [
          f,
          ["--tw-slashed-zero", "slashed-zero"],
          ["font-variant-numeric", i],
        ]),
        e("lining-nums", [
          f,
          ["--tw-numeric-figure", "lining-nums"],
          ["font-variant-numeric", i],
        ]),
        e("oldstyle-nums", [
          f,
          ["--tw-numeric-figure", "oldstyle-nums"],
          ["font-variant-numeric", i],
        ]),
        e("proportional-nums", [
          f,
          ["--tw-numeric-spacing", "proportional-nums"],
          ["font-variant-numeric", i],
        ]),
        e("tabular-nums", [
          f,
          ["--tw-numeric-spacing", "tabular-nums"],
          ["font-variant-numeric", i],
        ]),
        e("diagonal-fractions", [
          f,
          ["--tw-numeric-fraction", "diagonal-fractions"],
          ["font-variant-numeric", i],
        ]),
        e("stacked-fractions", [
          f,
          ["--tw-numeric-fraction", "stacked-fractions"],
          ["font-variant-numeric", i],
        ]);
    }
    {
      let i = () => D([S("--tw-outline-style", "solid")]);
      r.static("outline-hidden", () => [
        a("--tw-outline-style", "none"),
        a("outline-style", "none"),
        U("@media", "(forced-colors: active)", [
          a("outline", "2px solid transparent"),
          a("outline-offset", "2px"),
        ]),
      ]),
        e("outline-none", [
          ["--tw-outline-style", "none"],
          ["outline-style", "none"],
        ]),
        e("outline-solid", [
          ["--tw-outline-style", "solid"],
          ["outline-style", "solid"],
        ]),
        e("outline-dashed", [
          ["--tw-outline-style", "dashed"],
          ["outline-style", "dashed"],
        ]),
        e("outline-dotted", [
          ["--tw-outline-style", "dotted"],
          ["outline-style", "dotted"],
        ]),
        e("outline-double", [
          ["--tw-outline-style", "double"],
          ["outline-style", "double"],
        ]),
        r.functional("outline", (f) => {
          if (f.value === null) {
            if (f.modifier) return;
            let h = t.get(["--default-outline-width"]) ?? "1px";
            return [
              i(),
              a("outline-style", "var(--tw-outline-style)"),
              a("outline-width", h),
            ];
          }
          if (f.value.kind === "arbitrary") {
            let h = f.value.value;
            switch (
              f.value.dataType ??
              I(h, ["color", "length", "number", "percentage"])
            ) {
              case "length":
              case "number":
              case "percentage":
                return f.modifier
                  ? void 0
                  : [
                      i(),
                      a("outline-style", "var(--tw-outline-style)"),
                      a("outline-width", h),
                    ];
              default:
                return (
                  (h = B(h, f.modifier, t)),
                  h === null ? void 0 : [a("outline-color", h)]
                );
            }
          }
          {
            let h = G(f, t, ["--outline-color", "--color"]);
            if (h) return [a("outline-color", h)];
          }
          {
            if (f.modifier) return;
            let h = t.resolve(f.value.value, ["--outline-width"]);
            if (h)
              return [
                i(),
                a("outline-style", "var(--tw-outline-style)"),
                a("outline-width", h),
              ];
            if (N(f.value.value))
              return [
                i(),
                a("outline-style", "var(--tw-outline-style)"),
                a("outline-width", `${f.value.value}px`),
              ];
          }
        }),
        o("outline", () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--outline-color", "--color"],
            modifiers: Array.from({ length: 21 }, (f, h) => `${h * 5}`),
            hasDefaultValue: !0,
          },
          {
            values: ["0", "1", "2", "4", "8"],
            valueThemeKeys: ["--outline-width"],
          },
        ]),
        n("outline-offset", {
          supportsNegative: !0,
          themeKeys: ["--outline-offset"],
          handleBareValue: ({ value: f }) => (N(f) ? `${f}px` : null),
          handle: (f) => [a("outline-offset", f)],
        }),
        o("outline-offset", () => [
          {
            supportsNegative: !0,
            values: ["0", "1", "2", "4", "8"],
            valueThemeKeys: ["--outline-offset"],
          },
        ]);
    }
    n("opacity", {
      themeKeys: ["--opacity"],
      handleBareValue: ({ value: i }) => (Me(i) ? `${i}%` : null),
      handle: (i) => [a("opacity", i)],
    }),
      o("opacity", () => [
        {
          values: Array.from({ length: 21 }, (i, f) => `${f * 5}`),
          valueThemeKeys: ["--opacity"],
        },
      ]),
      e("underline-offset-auto", [["text-underline-offset", "auto"]]),
      n("underline-offset", {
        supportsNegative: !0,
        themeKeys: ["--text-underline-offset"],
        handleBareValue: ({ value: i }) => (N(i) ? `${i}px` : null),
        handle: (i) => [a("text-underline-offset", i)],
      }),
      o("underline-offset", () => [
        {
          supportsNegative: !0,
          values: ["0", "1", "2", "4", "8"],
          valueThemeKeys: ["--text-underline-offset"],
        },
      ]),
      r.functional("text", (i) => {
        if (i.value) {
          if (i.value.kind === "arbitrary") {
            let f = i.value.value;
            switch (
              i.value.dataType ??
              I(f, [
                "color",
                "length",
                "percentage",
                "absolute-size",
                "relative-size",
              ])
            ) {
              case "size":
              case "length":
              case "percentage":
              case "absolute-size":
              case "relative-size": {
                if (i.modifier) {
                  let w =
                    i.modifier.kind === "arbitrary"
                      ? i.modifier.value
                      : t.resolve(i.modifier.value, ["--leading"]);
                  if (!w && ge(i.modifier.value)) {
                    let k = t.resolve(null, ["--spacing"]);
                    if (!k) return null;
                    w = `calc(${k} * ${i.modifier.value})`;
                  }
                  return (
                    !w && i.modifier.value === "none" && (w = "1"),
                    w ? [a("font-size", f), a("line-height", w)] : null
                  );
                }
                return [a("font-size", f)];
              }
              default:
                return (
                  (f = B(f, i.modifier, t)),
                  f === null ? void 0 : [a("color", f)]
                );
            }
          }
          {
            let f = G(i, t, ["--text-color", "--color"]);
            if (f) return [a("color", f)];
          }
          {
            let f = t.resolveWith(
              i.value.value,
              ["--text"],
              ["--line-height", "--letter-spacing", "--font-weight"],
            );
            if (f) {
              let [h, w = {}] = Array.isArray(f) ? f : [f];
              if (i.modifier) {
                let k =
                  i.modifier.kind === "arbitrary"
                    ? i.modifier.value
                    : t.resolve(i.modifier.value, ["--leading"]);
                if (!k && ge(i.modifier.value)) {
                  let E = t.resolve(null, ["--spacing"]);
                  if (!E) return null;
                  k = `calc(${E} * ${i.modifier.value})`;
                }
                if ((!k && i.modifier.value === "none" && (k = "1"), !k))
                  return null;
                let T = [a("font-size", h)];
                return k && T.push(a("line-height", k)), T;
              }
              return typeof w == "string"
                ? [a("font-size", h), a("line-height", w)]
                : [
                    a("font-size", h),
                    a(
                      "line-height",
                      w["--line-height"]
                        ? `var(--tw-leading, ${w["--line-height"]})`
                        : void 0,
                    ),
                    a(
                      "letter-spacing",
                      w["--letter-spacing"]
                        ? `var(--tw-tracking, ${w["--letter-spacing"]})`
                        : void 0,
                    ),
                    a(
                      "font-weight",
                      w["--font-weight"]
                        ? `var(--tw-font-weight, ${w["--font-weight"]})`
                        : void 0,
                    ),
                  ];
            }
          }
        }
      }),
      o("text", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--text-color", "--color"],
          modifiers: Array.from({ length: 21 }, (i, f) => `${f * 5}`),
        },
        {
          values: [],
          valueThemeKeys: ["--text"],
          modifiers: [],
          modifierThemeKeys: ["--leading"],
        },
      ]);
    {
      let k = function (C) {
          return `var(--tw-ring-inset,) 0 0 0 calc(${C} + var(--tw-ring-offset-width)) var(--tw-ring-color, ${w})`;
        },
        T = function (C) {
          return `inset 0 0 0 ${C} var(--tw-inset-ring-color, currentColor)`;
        };
      var R = k,
        K = T;
      let i = [
          "var(--tw-inset-shadow)",
          "var(--tw-inset-ring-shadow)",
          "var(--tw-ring-offset-shadow)",
          "var(--tw-ring-shadow)",
          "var(--tw-shadow)",
        ].join(", "),
        f = "0 0 #0000",
        h = () =>
          D([
            S("--tw-shadow", f),
            S("--tw-shadow-color"),
            S("--tw-inset-shadow", f),
            S("--tw-inset-shadow-color"),
            S("--tw-ring-color"),
            S("--tw-ring-shadow", f),
            S("--tw-inset-ring-color"),
            S("--tw-inset-ring-shadow", f),
            S("--tw-ring-inset"),
            S("--tw-ring-offset-width", "0px", "<length>"),
            S("--tw-ring-offset-color", "#fff"),
            S("--tw-ring-offset-shadow", f),
          ]);
      e("shadow-initial", [h, ["--tw-shadow-color", "initial"]]),
        r.functional("shadow", (C) => {
          if (!C.value) {
            let A = t.get(["--shadow"]);
            return A === null
              ? void 0
              : [
                  h(),
                  a(
                    "--tw-shadow",
                    ce(A, (F) => `var(--tw-shadow-color, ${F})`),
                  ),
                  a("box-shadow", i),
                ];
          }
          if (C.value.kind === "arbitrary") {
            let A = C.value.value;
            switch (C.value.dataType ?? I(A, ["color"])) {
              case "color":
                return (
                  (A = B(A, C.modifier, t)),
                  A === null ? void 0 : [h(), a("--tw-shadow-color", A)]
                );
              default:
                return [
                  h(),
                  a(
                    "--tw-shadow",
                    ce(A, (Oe) => `var(--tw-shadow-color, ${Oe})`),
                  ),
                  a("box-shadow", i),
                ];
            }
          }
          switch (C.value.value) {
            case "none":
              return C.modifier
                ? void 0
                : [h(), a("--tw-shadow", f), a("box-shadow", i)];
          }
          {
            let A = t.get([`--shadow-${C.value.value}`]);
            if (A)
              return C.modifier
                ? void 0
                : [
                    h(),
                    a(
                      "--tw-shadow",
                      ce(A, (F) => `var(--tw-shadow-color, ${F})`),
                    ),
                    a("box-shadow", i),
                  ];
          }
          {
            let A = G(C, t, ["--box-shadow-color", "--color"]);
            if (A) return [h(), a("--tw-shadow-color", A)];
          }
        }),
        o("shadow", () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--box-shadow-color", "--color"],
            modifiers: Array.from({ length: 21 }, (C, A) => `${A * 5}`),
          },
          {
            values: ["none"],
            valueThemeKeys: ["--shadow"],
            hasDefaultValue: !0,
          },
        ]),
        e("inset-shadow-initial", [h, ["--tw-inset-shadow-color", "initial"]]),
        r.functional("inset-shadow", (C) => {
          if (!C.value) {
            let A = t.get(["--inset-shadow"]);
            return A === null
              ? void 0
              : [
                  h(),
                  a(
                    "--tw-inset-shadow",
                    ce(A, (F) => `var(--tw-inset-shadow-color, ${F})`),
                  ),
                  a("box-shadow", i),
                ];
          }
          if (C.value.kind === "arbitrary") {
            let A = C.value.value;
            switch (C.value.dataType ?? I(A, ["color"])) {
              case "color":
                return (
                  (A = B(A, C.modifier, t)),
                  A === null ? void 0 : [h(), a("--tw-inset-shadow-color", A)]
                );
              default:
                return [
                  h(),
                  a(
                    "--tw-inset-shadow",
                    `inset ${ce(A, (Oe) => `var(--tw-inset-shadow-color, ${Oe})`)}`,
                  ),
                  a("box-shadow", i),
                ];
            }
          }
          switch (C.value.value) {
            case "none":
              return C.modifier
                ? void 0
                : [h(), a("--tw-inset-shadow", f), a("box-shadow", i)];
          }
          {
            let A = t.get([`--inset-shadow-${C.value.value}`]);
            if (A)
              return C.modifier
                ? void 0
                : [
                    h(),
                    a(
                      "--tw-inset-shadow",
                      ce(A, (F) => `var(--tw-inset-shadow-color, ${F})`),
                    ),
                    a("box-shadow", i),
                  ];
          }
          {
            let A = G(C, t, ["--box-shadow-color", "--color"]);
            if (A) return [h(), a("--tw-inset-shadow-color", A)];
          }
        }),
        o("inset-shadow", () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--box-shadow-color", "--color"],
            modifiers: Array.from({ length: 21 }, (C, A) => `${A * 5}`),
          },
          {
            values: [],
            valueThemeKeys: ["--inset-shadow"],
            hasDefaultValue: !0,
          },
        ]),
        e("ring-inset", [h, ["--tw-ring-inset", "inset"]]);
      let w = t.get(["--default-ring-color"]) ?? "currentColor";
      r.functional("ring", (C) => {
        if (!C.value) {
          if (C.modifier) return;
          let A = t.get(["--default-ring-width"]) ?? "1px";
          return [h(), a("--tw-ring-shadow", k(A)), a("box-shadow", i)];
        }
        if (C.value.kind === "arbitrary") {
          let A = C.value.value;
          switch (C.value.dataType ?? I(A, ["color", "length"])) {
            case "length":
              return C.modifier
                ? void 0
                : [h(), a("--tw-ring-shadow", k(A)), a("box-shadow", i)];
            default:
              return (
                (A = B(A, C.modifier, t)),
                A === null ? void 0 : [a("--tw-ring-color", A)]
              );
          }
        }
        {
          let A = G(C, t, ["--ring-color", "--color"]);
          if (A) return [a("--tw-ring-color", A)];
        }
        {
          if (C.modifier) return;
          let A = t.resolve(C.value.value, ["--ring-width"]);
          if ((A === null && N(C.value.value) && (A = `${C.value.value}px`), A))
            return [h(), a("--tw-ring-shadow", k(A)), a("box-shadow", i)];
        }
      }),
        o("ring", () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--ring-color", "--color"],
            modifiers: Array.from({ length: 21 }, (C, A) => `${A * 5}`),
          },
          {
            values: ["0", "1", "2", "4", "8"],
            valueThemeKeys: ["--ring-width"],
            hasDefaultValue: !0,
          },
        ]),
        r.functional("inset-ring", (C) => {
          if (!C.value)
            return C.modifier
              ? void 0
              : [
                  h(),
                  a("--tw-inset-ring-shadow", T("1px")),
                  a("box-shadow", i),
                ];
          if (C.value.kind === "arbitrary") {
            let A = C.value.value;
            switch (C.value.dataType ?? I(A, ["color", "length"])) {
              case "length":
                return C.modifier
                  ? void 0
                  : [
                      h(),
                      a("--tw-inset-ring-shadow", T(A)),
                      a("box-shadow", i),
                    ];
              default:
                return (
                  (A = B(A, C.modifier, t)),
                  A === null ? void 0 : [a("--tw-inset-ring-color", A)]
                );
            }
          }
          {
            let A = G(C, t, ["--ring-color", "--color"]);
            if (A) return [a("--tw-inset-ring-color", A)];
          }
          {
            if (C.modifier) return;
            let A = t.resolve(C.value.value, ["--ring-width"]);
            if (
              (A === null && N(C.value.value) && (A = `${C.value.value}px`), A)
            )
              return [
                h(),
                a("--tw-inset-ring-shadow", T(A)),
                a("box-shadow", i),
              ];
          }
        }),
        o("inset-ring", () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--ring-color", "--color"],
            modifiers: Array.from({ length: 21 }, (C, A) => `${A * 5}`),
          },
          {
            values: ["0", "1", "2", "4", "8"],
            valueThemeKeys: ["--ring-width"],
            hasDefaultValue: !0,
          },
        ]);
      let E =
        "var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)";
      r.functional("ring-offset", (C) => {
        if (C.value) {
          if (C.value.kind === "arbitrary") {
            let A = C.value.value;
            switch (C.value.dataType ?? I(A, ["color", "length"])) {
              case "length":
                return C.modifier
                  ? void 0
                  : [
                      a("--tw-ring-offset-width", A),
                      a("--tw-ring-offset-shadow", E),
                    ];
              default:
                return (
                  (A = B(A, C.modifier, t)),
                  A === null ? void 0 : [a("--tw-ring-offset-color", A)]
                );
            }
          }
          {
            let A = t.resolve(C.value.value, ["--ring-offset-width"]);
            if (A)
              return C.modifier
                ? void 0
                : [
                    a("--tw-ring-offset-width", A),
                    a("--tw-ring-offset-shadow", E),
                  ];
            if (N(C.value.value))
              return C.modifier
                ? void 0
                : [
                    a("--tw-ring-offset-width", `${C.value.value}px`),
                    a("--tw-ring-offset-shadow", E),
                  ];
          }
          {
            let A = G(C, t, ["--ring-offset-color", "--color"]);
            if (A) return [a("--tw-ring-offset-color", A)];
          }
        }
      });
    }
    return (
      o("ring-offset", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--ring-offset-color", "--color"],
          modifiers: Array.from({ length: 21 }, (i, f) => `${f * 5}`),
        },
        {
          values: ["0", "1", "2", "4", "8"],
          valueThemeKeys: ["--ring-offset-width"],
        },
      ]),
      r.functional("@container", (i) => {
        let f = null;
        if (
          (i.value === null
            ? (f = "inline-size")
            : i.value.kind === "arbitrary"
              ? (f = i.value.value)
              : i.value.kind === "named" &&
                i.value.value === "normal" &&
                (f = "normal"),
          f !== null)
        )
          return i.modifier
            ? [a("container-type", f), a("container-name", i.modifier.value)]
            : [a("container-type", f)];
      }),
      o("@container", () => [
        { values: ["normal"], valueThemeKeys: [], hasDefaultValue: !0 },
      ]),
      r
    );
  }
  function nr(t) {
    let r = t.params;
    return Jo.test(r)
      ? (o) => {
          let e = new Set(),
            n = new Set();
          _(t.nodes, (s) => {
            if (
              s.kind !== "declaration" ||
              !s.value ||
              (!s.value.includes("--value(") &&
                !s.value.includes("--modifier("))
            )
              return;
            let l = L(s.value);
            ee(l, (p) => {
              if (
                p.kind !== "function" ||
                (p.value !== "--value" && p.value !== "--modifier")
              )
                return;
              let c = P(H(p.nodes), ",");
              for (let [d, u] of c.entries())
                (u = u.replace(/\\\*/g, "*")),
                  (u = u.replace(/--(.*?)\s--(.*?)/g, "--$1-*--$2")),
                  (u = u.replace(/\s+/g, "")),
                  (u = u.replace(/(-\*){2,}/g, "-*")),
                  u[0] === "-" &&
                    u[1] === "-" &&
                    !u.includes("-*") &&
                    (u += "-*"),
                  (c[d] = u);
              p.nodes = L(c.join(","));
              for (let d of p.nodes)
                if (
                  d.kind === "word" &&
                  d.value[0] === "-" &&
                  d.value[1] === "-"
                ) {
                  let u = d.value.replace(/-\*.*$/g, "");
                  p.value === "--value"
                    ? e.add(u)
                    : p.value === "--modifier" && n.add(u);
                }
            }),
              (s.value = H(l));
          }),
            o.utilities.functional(r.slice(0, -2), (s) => {
              let l = structuredClone(t),
                p = s.value,
                c = s.modifier;
              if (p === null) return;
              let d = !1,
                u = !1,
                g = !1,
                m = !1,
                v = new Map(),
                y = !1;
              if (
                (_([l], (b, { parent: x, replaceWith: $ }) => {
                  if (
                    (x?.kind !== "rule" && x?.kind !== "at-rule") ||
                    b.kind !== "declaration" ||
                    !b.value
                  )
                    return;
                  let V = L(b.value);
                  (ee(V, (R, { replaceWith: K }) => {
                    if (R.kind === "function") {
                      if (R.value === "--value") {
                        d = !0;
                        let i = rr(p, R, o);
                        return i
                          ? ((u = !0),
                            i.ratio ? (y = !0) : v.set(b, x),
                            K(i.nodes),
                            1)
                          : ((d ||= !1), $([]), 2);
                      } else if (R.value === "--modifier") {
                        if (c === null) return $([]), 1;
                        g = !0;
                        let i = rr(c, R, o);
                        return i
                          ? ((m = !0), K(i.nodes), 1)
                          : ((g ||= !1), $([]), 2);
                      }
                    }
                  }) ?? 0) === 0 && (b.value = H(V));
                }),
                (d && !u) || (g && !m) || (y && m) || (c && !y && !m))
              )
                return null;
              if (y)
                for (let [b, x] of v) {
                  let $ = x.nodes.indexOf(b);
                  $ !== -1 && x.nodes.splice($, 1);
                }
              return l.nodes;
            }),
            o.utilities.suggest(r.slice(0, -2), () => [
              {
                values: o.theme
                  .keysInNamespaces(e)
                  .map((s) => s.replaceAll("_", ".")),
                modifiers: o.theme
                  .keysInNamespaces(n)
                  .map((s) => s.replaceAll("_", ".")),
              },
            ]);
        }
      : Yo.test(r)
        ? (o) => {
            o.utilities.static(r, () => structuredClone(t.nodes));
          }
        : null;
  }
  function rr(t, r, o) {
    for (let e of r.nodes)
      if (
        t.kind === "named" &&
        e.kind === "word" &&
        e.value[0] === "-" &&
        e.value[1] === "-"
      ) {
        let n = e.value;
        if (n.endsWith("-*")) {
          n = n.slice(0, -2);
          let s = o.theme.resolve(t.value, [n]);
          if (s) return { nodes: L(s) };
        } else {
          let s = n.split("-*");
          if (s.length <= 1) continue;
          let l = [s.shift()],
            p = o.theme.resolveWith(t.value, l, s);
          if (p) {
            let [, c = {}] = p;
            {
              let d = c[s.pop()];
              if (d) return { nodes: L(d) };
            }
          }
        }
      } else if (t.kind === "named" && e.kind === "word") {
        if (
          e.value !== "number" &&
          e.value !== "integer" &&
          e.value !== "ratio" &&
          e.value !== "percentage"
        )
          continue;
        let n = e.value === "ratio" && "fraction" in t ? t.fraction : t.value;
        if (!n) continue;
        let s = I(n, [e.value]);
        if (s === null) continue;
        if (s === "ratio") {
          let [l, p] = P(n, "/");
          if (!N(l) || !N(p)) continue;
        } else {
          if (s === "number" && !ge(n)) continue;
          if (s === "percentage" && !N(n.slice(0, -1))) continue;
        }
        return { nodes: L(n), ratio: s === "ratio" };
      } else if (
        t.kind === "arbitrary" &&
        e.kind === "word" &&
        e.value[0] === "[" &&
        e.value[e.value.length - 1] === "]"
      ) {
        let n = e.value.slice(1, -1);
        if (n === "*") return { nodes: L(t.value) };
        if ("dataType" in t && t.dataType && t.dataType !== n) continue;
        if ("dataType" in t && t.dataType) return { nodes: L(t.value) };
        if (I(t.value, [n]) !== null) return { nodes: L(t.value) };
      }
  }
  var gt = { "--alpha": Zo, "--spacing": Qo, "--theme": Xo, theme: ar };
  function Zo(t, r, ...o) {
    let [e, n] = P(r, "/").map((s) => s.trim());
    if (!e || !n)
      throw new Error(
        `The --alpha(\u2026) function requires a color and an alpha value, e.g.: \`--alpha(${e || "var(--my-color)"} / ${n || "50%"})\``,
      );
    if (o.length > 0)
      throw new Error(
        `The --alpha(\u2026) function only accepts one argument, e.g.: \`--alpha(${e || "var(--my-color)"} / ${n || "50%"})\``,
      );
    return J(e, n);
  }
  function Qo(t, r, ...o) {
    if (!r)
      throw new Error(
        "The --spacing(\u2026) function requires an argument, but received none.",
      );
    if (o.length > 0)
      throw new Error(
        `The --spacing(\u2026) function only accepts a single argument, but received ${o.length + 1}.`,
      );
    let e = t.theme.resolve(null, ["--spacing"]);
    if (!e)
      throw new Error(
        "The --spacing(\u2026) function requires that the `--spacing` theme variable exists, but it was not found.",
      );
    return `calc(${e} * ${r})`;
  }
  function Xo(t, r, ...o) {
    if (!r.startsWith("--"))
      throw new Error(
        "The --theme(\u2026) function can only be used with CSS variables from your theme.",
      );
    return ar(t, r, ...o);
  }
  function ar(t, r, ...o) {
    r = en(r);
    let e = t.resolveThemeValue(r);
    if (!e && o.length > 0) return o.join(", ");
    if (!e)
      throw new Error(
        `Could not resolve value for theme function: \`theme(${r})\`. Consider checking if the path is correct or provide a fallback value to silence this error.`,
      );
    return e;
  }
  var ir = new RegExp(
    Object.keys(gt)
      .map((t) => `${t}\\(`)
      .join("|"),
  );
  function he(t, r) {
    let o = 0;
    return (
      _(t, (e) => {
        if (e.kind === "declaration" && e.value && ir.test(e.value)) {
          (o |= 8), (e.value = lr(e.value, r));
          return;
        }
        e.kind === "at-rule" &&
          (e.name === "@media" ||
            e.name === "@custom-media" ||
            e.name === "@container" ||
            e.name === "@supports") &&
          ir.test(e.params) &&
          ((o |= 8), (e.params = lr(e.params, r)));
      }),
      o
    );
  }
  function lr(t, r) {
    let o = L(t);
    return (
      ee(o, (e, { replaceWith: n }) => {
        if (e.kind === "function" && e.value in gt) {
          let s = P(H(e.nodes).trim(), ",").map((p) => p.trim()),
            l = gt[e.value](r, ...s);
          return n(L(l));
        }
      }),
      H(o)
    );
  }
  function en(t) {
    if (t[0] !== "'" && t[0] !== '"') return t;
    let r = "",
      o = t[0];
    for (let e = 1; e < t.length - 1; e++) {
      let n = t[e],
        s = t[e + 1];
      n === "\\" && (s === o || s === "\\") ? ((r += s), e++) : (r += n);
    }
    return r;
  }
  function Be(t, r) {
    let o = t.length,
      e = r.length,
      n = o < e ? o : e;
    for (let s = 0; s < n; s++) {
      let l = t.charCodeAt(s),
        p = r.charCodeAt(s);
      if (l >= 48 && l <= 57 && p >= 48 && p <= 57) {
        let c = s,
          d = s + 1,
          u = s,
          g = s + 1;
        for (l = t.charCodeAt(d); l >= 48 && l <= 57; ) l = t.charCodeAt(++d);
        for (p = r.charCodeAt(g); p >= 48 && p <= 57; ) p = r.charCodeAt(++g);
        let m = t.slice(c, d),
          v = r.slice(u, g),
          y = Number(m) - Number(v);
        if (y) return y;
        if (m < v) return -1;
        if (m > v) return 1;
        continue;
      }
      if (l !== p) return l - p;
    }
    return t.length - r.length;
  }
  var tn = /^\d+\/\d+$/;
  function sr(t) {
    let r = [];
    for (let e of t.utilities.keys("static"))
      r.push({ name: e, utility: e, fraction: !1, modifiers: [] });
    for (let e of t.utilities.keys("functional")) {
      let n = t.utilities.getCompletions(e);
      for (let s of n)
        for (let l of s.values) {
          let p = l !== null && tn.test(l),
            c = l === null ? e : `${e}-${l}`;
          r.push({ name: c, utility: e, fraction: p, modifiers: s.modifiers }),
            s.supportsNegative &&
              r.push({
                name: `-${c}`,
                utility: `-${e}`,
                fraction: p,
                modifiers: s.modifiers,
              });
        }
    }
    return r.length === 0 ? [] : (r.sort((e, n) => Be(e.name, n.name)), rn(r));
  }
  function rn(t) {
    let r = [],
      o = null,
      e = new Map(),
      n = new j(() => []);
    for (let l of t) {
      let { utility: p, fraction: c } = l;
      o || ((o = { utility: p, items: [] }), e.set(p, o)),
        p !== o.utility &&
          (r.push(o), (o = { utility: p, items: [] }), e.set(p, o)),
        c ? n.get(p).push(l) : o.items.push(l);
    }
    o && r[r.length - 1] !== o && r.push(o);
    for (let [l, p] of n) {
      let c = e.get(l);
      c && c.items.push(...p);
    }
    let s = [];
    for (let l of r)
      for (let p of l.items) s.push([p.name, { modifiers: p.modifiers }]);
    return s;
  }
  function ur(t) {
    let r = [];
    for (let [e, n] of t.variants.entries()) {
      let p = function ({ value: c, modifier: d } = {}) {
        let u = e;
        c && (u += s ? `-${c}` : c), d && (u += `/${d}`);
        let g = t.parseVariant(u);
        if (!g) return [];
        let m = z(".__placeholder__", []);
        if (be(m, g, t.variants) === null) return [];
        let v = [];
        return (
          je(m.nodes, (y, { path: b }) => {
            if (
              (y.kind !== "rule" && y.kind !== "at-rule") ||
              y.nodes.length > 0
            )
              return;
            b.sort((V, O) => {
              let R = V.kind === "at-rule",
                K = O.kind === "at-rule";
              return R && !K ? -1 : !R && K ? 1 : 0;
            });
            let x = b.flatMap((V) =>
                V.kind === "rule"
                  ? V.selector === "&"
                    ? []
                    : [V.selector]
                  : V.kind === "at-rule"
                    ? [`${V.name} ${V.params}`]
                    : [],
              ),
              $ = "";
            for (let V = x.length - 1; V >= 0; V--)
              $ = $ === "" ? x[V] : `${x[V]} { ${$} }`;
            v.push($);
          }),
          v
        );
      };
      var o = p;
      if (n.kind === "arbitrary") continue;
      let s = e !== "@",
        l = t.variants.getCompletions(e);
      switch (n.kind) {
        case "static": {
          r.push({
            name: e,
            values: l,
            isArbitrary: !1,
            hasDash: s,
            selectors: p,
          });
          break;
        }
        case "functional": {
          r.push({
            name: e,
            values: l,
            isArbitrary: !0,
            hasDash: s,
            selectors: p,
          });
          break;
        }
        case "compound": {
          r.push({
            name: e,
            values: l,
            isArbitrary: !0,
            hasDash: s,
            selectors: p,
          });
          break;
        }
      }
    }
    return r;
  }
  function cr(t, r) {
    let { astNodes: o, nodeSorting: e } = ne(Array.from(r), t),
      n = new Map(r.map((l) => [l, null])),
      s = 0n;
    for (let l of o) {
      let p = e.get(l)?.candidate;
      p && n.set(p, n.get(p) ?? s++);
    }
    return r.map((l) => [l, n.get(l) ?? null]);
  }
  var We = /^@?[a-zA-Z0-9_-]*$/;
  var bt = class {
    compareFns = new Map();
    variants = new Map();
    completions = new Map();
    groupOrder = null;
    lastOrder = 0;
    static(r, o, { compounds: e, order: n } = {}) {
      this.set(r, {
        kind: "static",
        applyFn: o,
        compoundsWith: 0,
        compounds: e ?? 2,
        order: n,
      });
    }
    fromAst(r, o) {
      let e = [];
      _(o, (n) => {
        n.kind === "rule"
          ? e.push(n.selector)
          : n.kind === "at-rule" &&
            n.name !== "@slot" &&
            e.push(`${n.name} ${n.params}`);
      }),
        this.static(
          r,
          (n) => {
            let s = structuredClone(o);
            yt(s, n.nodes), (n.nodes = s);
          },
          { compounds: fe(e) },
        );
    }
    functional(r, o, { compounds: e, order: n } = {}) {
      this.set(r, {
        kind: "functional",
        applyFn: o,
        compoundsWith: 0,
        compounds: e ?? 2,
        order: n,
      });
    }
    compound(r, o, e, { compounds: n, order: s } = {}) {
      this.set(r, {
        kind: "compound",
        applyFn: e,
        compoundsWith: o,
        compounds: n ?? 2,
        order: s,
      });
    }
    group(r, o) {
      (this.groupOrder = this.nextOrder()),
        o && this.compareFns.set(this.groupOrder, o),
        r(),
        (this.groupOrder = null);
    }
    has(r) {
      return this.variants.has(r);
    }
    get(r) {
      return this.variants.get(r);
    }
    kind(r) {
      return this.variants.get(r)?.kind;
    }
    compoundsWith(r, o) {
      let e = this.variants.get(r),
        n =
          typeof o == "string"
            ? this.variants.get(o)
            : o.kind === "arbitrary"
              ? { compounds: fe([o.selector]) }
              : this.variants.get(o.root);
      return !(
        !e ||
        !n ||
        e.kind !== "compound" ||
        n.compounds === 0 ||
        e.compoundsWith === 0 ||
        (e.compoundsWith & n.compounds) === 0
      );
    }
    suggest(r, o) {
      this.completions.set(r, o);
    }
    getCompletions(r) {
      return this.completions.get(r)?.() ?? [];
    }
    compare(r, o) {
      if (r === o) return 0;
      if (r === null) return -1;
      if (o === null) return 1;
      if (r.kind === "arbitrary" && o.kind === "arbitrary")
        return r.selector < o.selector ? -1 : 1;
      if (r.kind === "arbitrary") return 1;
      if (o.kind === "arbitrary") return -1;
      let e = this.variants.get(r.root).order,
        n = this.variants.get(o.root).order,
        s = e - n;
      if (s !== 0) return s;
      if (r.kind === "compound" && o.kind === "compound") {
        let d = this.compare(r.variant, o.variant);
        return d !== 0
          ? d
          : r.modifier && o.modifier
            ? r.modifier.value < o.modifier.value
              ? -1
              : 1
            : r.modifier
              ? 1
              : o.modifier
                ? -1
                : 0;
      }
      let l = this.compareFns.get(e);
      if (l !== void 0) return l(r, o);
      if (r.root !== o.root) return r.root < o.root ? -1 : 1;
      let p = r.value,
        c = o.value;
      return p === null
        ? -1
        : c === null || (p.kind === "arbitrary" && c.kind !== "arbitrary")
          ? 1
          : (p.kind !== "arbitrary" && c.kind === "arbitrary") ||
              p.value < c.value
            ? -1
            : 1;
    }
    keys() {
      return this.variants.keys();
    }
    entries() {
      return this.variants.entries();
    }
    set(r, { kind: o, applyFn: e, compounds: n, compoundsWith: s, order: l }) {
      let p = this.variants.get(r);
      p
        ? Object.assign(p, { kind: o, applyFn: e, compounds: n })
        : (l === void 0 &&
            ((this.lastOrder = this.nextOrder()), (l = this.lastOrder)),
          this.variants.set(r, {
            kind: o,
            applyFn: e,
            order: l,
            compoundsWith: s,
            compounds: n,
          }));
    }
    nextOrder() {
      return this.groupOrder ?? this.lastOrder + 1;
    }
  };
  function fe(t) {
    let r = 0;
    for (let o of t) {
      if (o[0] === "@") {
        if (
          !o.startsWith("@media") &&
          !o.startsWith("@supports") &&
          !o.startsWith("@container")
        )
          return 0;
        r |= 1;
        continue;
      }
      if (o.includes("::")) return 0;
      r |= 2;
    }
    return r;
  }
  function dr(t) {
    let r = new bt();
    function o(d, u, { compounds: g } = {}) {
      (g = g ?? fe(u)),
        r.static(
          d,
          (m) => {
            m.nodes = u.map((v) => M(v, m.nodes));
          },
          { compounds: g },
        );
    }
    o("*", [":is(& > *)"], { compounds: 0 }),
      o("**", [":is(& *)"], { compounds: 0 });
    function e(d, u) {
      return u.map((g) => {
        g = g.trim();
        let m = P(g, " ");
        return m[0] === "not"
          ? m.slice(1).join(" ")
          : d === "@container"
            ? m[0][0] === "("
              ? `not ${g}`
              : m[1] === "not"
                ? `${m[0]} ${m.slice(2).join(" ")}`
                : `${m[0]} not ${m.slice(1).join(" ")}`
            : `not ${g}`;
      });
    }
    let n = ["@media", "@supports", "@container"];
    function s(d) {
      for (let u of n) {
        if (u !== d.name) continue;
        let g = P(d.params, ",");
        return g.length > 1
          ? null
          : ((g = e(d.name, g)), U(d.name, g.join(", ")));
      }
      return null;
    }
    function l(d) {
      return d.includes("::")
        ? null
        : `&:not(${P(d, ",")
            .map((g) => ((g = g.replaceAll("&", "*")), g))
            .join(", ")})`;
    }
    r.compound("not", 3, (d, u) => {
      if ((u.variant.kind === "arbitrary" && u.variant.relative) || u.modifier)
        return null;
      let g = !1;
      if (
        (_([d], (m, { path: v }) => {
          if (m.kind !== "rule" && m.kind !== "at-rule") return 0;
          if (m.nodes.length > 0) return 0;
          let y = [],
            b = [];
          for (let $ of v)
            $.kind === "at-rule" ? y.push($) : $.kind === "rule" && b.push($);
          if (y.length > 1) return 2;
          if (b.length > 1) return 2;
          let x = [];
          for (let $ of b) {
            let V = l($.selector);
            if (!V) return (g = !1), 2;
            x.push(z(V, []));
          }
          for (let $ of y) {
            let V = s($);
            if (!V) return (g = !1), 2;
            x.push(V);
          }
          return Object.assign(d, z("&", x)), (g = !0), 1;
        }),
        d.kind === "rule" &&
          d.selector === "&" &&
          d.nodes.length === 1 &&
          Object.assign(d, d.nodes[0]),
        !g)
      )
        return null;
    }),
      r.suggest("not", () =>
        Array.from(r.keys()).filter((d) => r.compoundsWith("not", d)),
      ),
      r.compound("group", 2, (d, u) => {
        if (u.variant.kind === "arbitrary" && u.variant.relative) return null;
        let g = u.modifier
            ? `:where(.${t.prefix ? `${t.prefix}\\:` : ""}group\\/${u.modifier.value})`
            : `:where(.${t.prefix ? `${t.prefix}\\:` : ""}group)`,
          m = !1;
        if (
          (_([d], (v, { path: y }) => {
            if (v.kind !== "rule") return 0;
            for (let x of y.slice(0, -1))
              if (x.kind === "rule") return (m = !1), 2;
            let b = v.selector.replaceAll("&", g);
            P(b, ",").length > 1 && (b = `:is(${b})`),
              (v.selector = `&:is(${b} *)`),
              (m = !0);
          }),
          !m)
        )
          return null;
      }),
      r.suggest("group", () =>
        Array.from(r.keys()).filter((d) => r.compoundsWith("group", d)),
      ),
      r.compound("peer", 2, (d, u) => {
        if (u.variant.kind === "arbitrary" && u.variant.relative) return null;
        let g = u.modifier
            ? `:where(.${t.prefix ? `${t.prefix}\\:` : ""}peer\\/${u.modifier.value})`
            : `:where(.${t.prefix ? `${t.prefix}\\:` : ""}peer)`,
          m = !1;
        if (
          (_([d], (v, { path: y }) => {
            if (v.kind !== "rule") return 0;
            for (let x of y.slice(0, -1))
              if (x.kind === "rule") return (m = !1), 2;
            let b = v.selector.replaceAll("&", g);
            P(b, ",").length > 1 && (b = `:is(${b})`),
              (v.selector = `&:is(${b} ~ *)`),
              (m = !0);
          }),
          !m)
        )
          return null;
      }),
      r.suggest("peer", () =>
        Array.from(r.keys()).filter((d) => r.compoundsWith("peer", d)),
      ),
      o("first-letter", ["&::first-letter"]),
      o("first-line", ["&::first-line"]),
      o("marker", ["& *::marker", "&::marker"]),
      o("selection", ["& *::selection", "&::selection"]),
      o("file", ["&::file-selector-button"]),
      o("placeholder", ["&::placeholder"]),
      o("backdrop", ["&::backdrop"]),
      !1;
    {
      let d = function () {
        return D([
          U("@property", "--tw-content", [
            a("syntax", '"*"'),
            a("initial-value", '""'),
            a("inherits", "false"),
          ]),
        ]);
      };
      var p = d;
      r.static(
        "before",
        (u) => {
          u.nodes = [
            z("&::before", [
              d(),
              a("content", "var(--tw-content)"),
              ...u.nodes,
            ]),
          ];
        },
        { compounds: 0 },
      ),
        r.static(
          "after",
          (u) => {
            u.nodes = [
              z("&::after", [
                d(),
                a("content", "var(--tw-content)"),
                ...u.nodes,
              ]),
            ];
          },
          { compounds: 0 },
        );
    }
    o("first", ["&:first-child"]),
      o("last", ["&:last-child"]),
      o("only", ["&:only-child"]),
      o("odd", ["&:nth-child(odd)"]),
      o("even", ["&:nth-child(even)"]),
      o("first-of-type", ["&:first-of-type"]),
      o("last-of-type", ["&:last-of-type"]),
      o("only-of-type", ["&:only-of-type"]),
      o("visited", ["&:visited"]),
      o("target", ["&:target"]),
      o("open", ["&:is([open], :popover-open, :open)"]),
      o("default", ["&:default"]),
      o("checked", ["&:checked"]),
      o("indeterminate", ["&:indeterminate"]),
      o("placeholder-shown", ["&:placeholder-shown"]),
      o("autofill", ["&:autofill"]),
      o("optional", ["&:optional"]),
      o("required", ["&:required"]),
      o("valid", ["&:valid"]),
      o("invalid", ["&:invalid"]),
      !1,
      o("in-range", ["&:in-range"]),
      o("out-of-range", ["&:out-of-range"]),
      o("read-only", ["&:read-only"]),
      o("empty", ["&:empty"]),
      o("focus-within", ["&:focus-within"]),
      r.static("hover", (d) => {
        d.nodes = [z("&:hover", [U("@media", "(hover: hover)", d.nodes)])];
      }),
      o("focus", ["&:focus"]),
      o("focus-visible", ["&:focus-visible"]),
      o("active", ["&:active"]),
      o("enabled", ["&:enabled"]),
      o("disabled", ["&:disabled"]),
      o("inert", ["&:is([inert], [inert] *)"]),
      r.compound("in", 2, (d, u) => {
        if (u.modifier) return null;
        let g = !1;
        if (
          (_([d], (m, { path: v }) => {
            if (m.kind !== "rule") return 0;
            for (let y of v.slice(0, -1))
              if (y.kind === "rule") return (g = !1), 2;
            (m.selector = `:where(${m.selector.replaceAll("&", "*")}) &`),
              (g = !0);
          }),
          !g)
        )
          return null;
      }),
      r.suggest("in", () =>
        Array.from(r.keys()).filter((d) => r.compoundsWith("in", d)),
      ),
      r.compound("has", 2, (d, u) => {
        if (u.modifier) return null;
        let g = !1;
        if (
          (_([d], (m, { path: v }) => {
            if (m.kind !== "rule") return 0;
            for (let y of v.slice(0, -1))
              if (y.kind === "rule") return (g = !1), 2;
            (m.selector = `&:has(${m.selector.replaceAll("&", "*")})`),
              (g = !0);
          }),
          !g)
        )
          return null;
      }),
      r.suggest("has", () =>
        Array.from(r.keys()).filter((d) => r.compoundsWith("has", d)),
      ),
      r.functional("aria", (d, u) => {
        if (!u.value || u.modifier) return null;
        u.value.kind === "arbitrary"
          ? (d.nodes = [z(`&[aria-${fr(u.value.value)}]`, d.nodes)])
          : (d.nodes = [z(`&[aria-${u.value.value}="true"]`, d.nodes)]);
      }),
      r.suggest("aria", () => [
        "busy",
        "checked",
        "disabled",
        "expanded",
        "hidden",
        "pressed",
        "readonly",
        "required",
        "selected",
      ]),
      r.functional("data", (d, u) => {
        if (!u.value || u.modifier) return null;
        d.nodes = [z(`&[data-${fr(u.value.value)}]`, d.nodes)];
      }),
      r.functional("nth", (d, u) => {
        if (
          !u.value ||
          u.modifier ||
          (u.value.kind === "named" && !N(u.value.value))
        )
          return null;
        d.nodes = [z(`&:nth-child(${u.value.value})`, d.nodes)];
      }),
      r.functional("nth-last", (d, u) => {
        if (
          !u.value ||
          u.modifier ||
          (u.value.kind === "named" && !N(u.value.value))
        )
          return null;
        d.nodes = [z(`&:nth-last-child(${u.value.value})`, d.nodes)];
      }),
      r.functional("nth-of-type", (d, u) => {
        if (
          !u.value ||
          u.modifier ||
          (u.value.kind === "named" && !N(u.value.value))
        )
          return null;
        d.nodes = [z(`&:nth-of-type(${u.value.value})`, d.nodes)];
      }),
      r.functional("nth-last-of-type", (d, u) => {
        if (
          !u.value ||
          u.modifier ||
          (u.value.kind === "named" && !N(u.value.value))
        )
          return null;
        d.nodes = [z(`&:nth-last-of-type(${u.value.value})`, d.nodes)];
      }),
      r.functional(
        "supports",
        (d, u) => {
          if (!u.value || u.modifier) return null;
          let g = u.value.value;
          if (g === null) return null;
          if (/^[\w-]*\s*\(/.test(g)) {
            let m = g.replace(/\b(and|or|not)\b/g, " $1 ");
            d.nodes = [U("@supports", m, d.nodes)];
            return;
          }
          g.includes(":") || (g = `${g}: var(--tw)`),
            (g[0] !== "(" || g[g.length - 1] !== ")") && (g = `(${g})`),
            (d.nodes = [U("@supports", g, d.nodes)]);
        },
        { compounds: 1 },
      ),
      o("motion-safe", ["@media (prefers-reduced-motion: no-preference)"]),
      o("motion-reduce", ["@media (prefers-reduced-motion: reduce)"]),
      o("contrast-more", ["@media (prefers-contrast: more)"]),
      o("contrast-less", ["@media (prefers-contrast: less)"]);
    {
      let d = function (u, g, m, v) {
        if (u === g) return 0;
        let y = v.get(u);
        if (y === null) return m === "asc" ? -1 : 1;
        let b = v.get(g);
        return b === null ? (m === "asc" ? 1 : -1) : ue(y, b, m);
      };
      var c = d;
      {
        let u = t.namespace("--breakpoint"),
          g = new j((m) => {
            switch (m.kind) {
              case "static":
                return t.resolveValue(m.root, ["--breakpoint"]) ?? null;
              case "functional": {
                if (!m.value || m.modifier) return null;
                let v = null;
                return (
                  m.value.kind === "arbitrary"
                    ? (v = m.value.value)
                    : m.value.kind === "named" &&
                      (v = t.resolveValue(m.value.value, ["--breakpoint"])),
                  !v || v.includes("var(") ? null : v
                );
              }
              case "arbitrary":
              case "compound":
                return null;
            }
          });
        r.group(
          () => {
            r.functional(
              "max",
              (m, v) => {
                if (v.modifier) return null;
                let y = g.get(v);
                if (y === null) return null;
                m.nodes = [U("@media", `(width < ${y})`, m.nodes)];
              },
              { compounds: 1 },
            );
          },
          (m, v) => d(m, v, "desc", g),
        ),
          r.suggest("max", () =>
            Array.from(u.keys()).filter((m) => m !== null),
          ),
          r.group(
            () => {
              for (let [m, v] of t.namespace("--breakpoint"))
                m !== null &&
                  r.static(
                    m,
                    (y) => {
                      y.nodes = [U("@media", `(width >= ${v})`, y.nodes)];
                    },
                    { compounds: 1 },
                  );
              r.functional(
                "min",
                (m, v) => {
                  if (v.modifier) return null;
                  let y = g.get(v);
                  if (y === null) return null;
                  m.nodes = [U("@media", `(width >= ${y})`, m.nodes)];
                },
                { compounds: 1 },
              );
            },
            (m, v) => d(m, v, "asc", g),
          ),
          r.suggest("min", () =>
            Array.from(u.keys()).filter((m) => m !== null),
          );
      }
      {
        let u = t.namespace("--container"),
          g = new j((m) => {
            switch (m.kind) {
              case "functional": {
                if (m.value === null) return null;
                let v = null;
                return (
                  m.value.kind === "arbitrary"
                    ? (v = m.value.value)
                    : m.value.kind === "named" &&
                      (v = t.resolveValue(m.value.value, ["--container"])),
                  !v || v.includes("var(") ? null : v
                );
              }
              case "static":
              case "arbitrary":
              case "compound":
                return null;
            }
          });
        r.group(
          () => {
            r.functional(
              "@max",
              (m, v) => {
                let y = g.get(v);
                if (y === null) return null;
                m.nodes = [
                  U(
                    "@container",
                    v.modifier
                      ? `${v.modifier.value} (width < ${y})`
                      : `(width < ${y})`,
                    m.nodes,
                  ),
                ];
              },
              { compounds: 1 },
            );
          },
          (m, v) => d(m, v, "desc", g),
        ),
          r.suggest("@max", () =>
            Array.from(u.keys()).filter((m) => m !== null),
          ),
          r.group(
            () => {
              r.functional(
                "@",
                (m, v) => {
                  let y = g.get(v);
                  if (y === null) return null;
                  m.nodes = [
                    U(
                      "@container",
                      v.modifier
                        ? `${v.modifier.value} (width >= ${y})`
                        : `(width >= ${y})`,
                      m.nodes,
                    ),
                  ];
                },
                { compounds: 1 },
              ),
                r.functional(
                  "@min",
                  (m, v) => {
                    let y = g.get(v);
                    if (y === null) return null;
                    m.nodes = [
                      U(
                        "@container",
                        v.modifier
                          ? `${v.modifier.value} (width >= ${y})`
                          : `(width >= ${y})`,
                        m.nodes,
                      ),
                    ];
                  },
                  { compounds: 1 },
                );
            },
            (m, v) => d(m, v, "asc", g),
          ),
          r.suggest("@min", () =>
            Array.from(u.keys()).filter((m) => m !== null),
          ),
          r.suggest("@", () => Array.from(u.keys()).filter((m) => m !== null));
      }
    }
    return (
      o("portrait", ["@media (orientation: portrait)"]),
      o("landscape", ["@media (orientation: landscape)"]),
      o("ltr", ['&:where(:dir(ltr), [dir="ltr"], [dir="ltr"] *)']),
      o("rtl", ['&:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)']),
      o("dark", ["@media (prefers-color-scheme: dark)"]),
      o("starting", ["@starting-style"]),
      o("print", ["@media print"]),
      o("forced-colors", ["@media (forced-colors: active)"]),
      !1,
      !1,
      !1,
      r
    );
  }
  function fr(t) {
    if (t.includes("=")) {
      let [r, ...o] = P(t, "="),
        e = o.join("=").trim();
      if (e[0] === "'" || e[0] === '"') return t;
      if (e.length > 1) {
        let n = e[e.length - 1];
        if (
          e[e.length - 2] === " " &&
          (n === "i" || n === "I" || n === "s" || n === "S")
        )
          return `${r}="${e.slice(0, -2)}" ${n}`;
      }
      return `${r}="${e}"`;
    }
    return t;
  }
  function yt(t, r) {
    _(t, (o, { replaceWith: e }) => {
      if (o.kind === "at-rule" && o.name === "@slot") e(r);
      else if (
        o.kind === "at-rule" &&
        (o.name === "@keyframes" || o.name === "@property")
      )
        return Object.assign(o, D([U(o.name, o.params, o.nodes)])), 1;
    });
  }
  function pr(t) {
    let r = or(t),
      o = dr(t),
      e = new j((c) => Jt(c, p)),
      n = new j((c) => Array.from(Yt(c, p))),
      s = new j((c) => {
        let d = mr(c, p);
        try {
          he(
            d.map(({ node: u }) => u),
            p,
          );
        } catch {
          return [];
        }
        return d;
      }),
      l = new j((c) => {
        for (let d of Fe(c)) t.markUsedVariable(d);
      }),
      p = {
        theme: t,
        utilities: r,
        variants: o,
        invalidCandidates: new Set(),
        important: !1,
        candidatesToCss(c) {
          let d = [];
          for (let u of c) {
            let g = !1,
              { astNodes: m } = ne([u], this, {
                onInvalidCandidate() {
                  g = !0;
                },
              });
            (m = se(m, p)), m.length === 0 || g ? d.push(null) : d.push(Y(m));
          }
          return d;
        },
        getClassOrder(c) {
          return cr(this, c);
        },
        getClassList() {
          return sr(this);
        },
        getVariants() {
          return ur(this);
        },
        parseCandidate(c) {
          return n.get(c);
        },
        parseVariant(c) {
          return e.get(c);
        },
        compileAstNodes(c) {
          return s.get(c);
        },
        getVariantOrder() {
          let c = Array.from(e.values());
          c.sort((m, v) => this.variants.compare(m, v));
          let d = new Map(),
            u,
            g = 0;
          for (let m of c)
            m !== null &&
              (u !== void 0 && this.variants.compare(u, m) !== 0 && g++,
              d.set(m, g),
              (u = m));
          return d;
        },
        resolveThemeValue(c) {
          let d = c.lastIndexOf("/"),
            u = null;
          d !== -1 && ((u = c.slice(d + 1).trim()), (c = c.slice(0, d).trim()));
          let g = t.get([c]) ?? void 0;
          return u && g ? J(g, u) : g;
        },
        trackUsedVariables(c) {
          l.get(c);
        },
      };
    return p;
  }
  var vt = [
    "container-type",
    "pointer-events",
    "visibility",
    "position",
    "inset",
    "inset-inline",
    "inset-block",
    "inset-inline-start",
    "inset-inline-end",
    "top",
    "right",
    "bottom",
    "left",
    "isolation",
    "z-index",
    "order",
    "grid-column",
    "grid-column-start",
    "grid-column-end",
    "grid-row",
    "grid-row-start",
    "grid-row-end",
    "float",
    "clear",
    "--tw-container-component",
    "margin",
    "margin-inline",
    "margin-block",
    "margin-inline-start",
    "margin-inline-end",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "box-sizing",
    "display",
    "field-sizing",
    "aspect-ratio",
    "height",
    "max-height",
    "min-height",
    "width",
    "max-width",
    "min-width",
    "flex",
    "flex-shrink",
    "flex-grow",
    "flex-basis",
    "table-layout",
    "caption-side",
    "border-collapse",
    "border-spacing",
    "transform-origin",
    "translate",
    "--tw-translate-x",
    "--tw-translate-y",
    "--tw-translate-z",
    "scale",
    "--tw-scale-x",
    "--tw-scale-y",
    "--tw-scale-z",
    "rotate",
    "--tw-rotate-x",
    "--tw-rotate-y",
    "--tw-rotate-z",
    "--tw-skew-x",
    "--tw-skew-y",
    "transform",
    "animation",
    "cursor",
    "touch-action",
    "--tw-pan-x",
    "--tw-pan-y",
    "--tw-pinch-zoom",
    "resize",
    "scroll-snap-type",
    "--tw-scroll-snap-strictness",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-margin",
    "scroll-margin-inline",
    "scroll-margin-block",
    "scroll-margin-inline-start",
    "scroll-margin-inline-end",
    "scroll-margin-top",
    "scroll-margin-right",
    "scroll-margin-bottom",
    "scroll-margin-left",
    "scroll-padding",
    "scroll-padding-inline",
    "scroll-padding-block",
    "scroll-padding-inline-start",
    "scroll-padding-inline-end",
    "scroll-padding-top",
    "scroll-padding-right",
    "scroll-padding-bottom",
    "scroll-padding-left",
    "list-style-position",
    "list-style-type",
    "list-style-image",
    "appearance",
    "columns",
    "break-before",
    "break-inside",
    "break-after",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-template-columns",
    "grid-template-rows",
    "flex-direction",
    "flex-wrap",
    "place-content",
    "place-items",
    "align-content",
    "align-items",
    "justify-content",
    "justify-items",
    "gap",
    "column-gap",
    "row-gap",
    "--tw-space-x-reverse",
    "--tw-space-y-reverse",
    "divide-x-width",
    "divide-y-width",
    "--tw-divide-y-reverse",
    "divide-style",
    "divide-color",
    "place-self",
    "align-self",
    "justify-self",
    "overflow",
    "overflow-x",
    "overflow-y",
    "overscroll-behavior",
    "overscroll-behavior-x",
    "overscroll-behavior-y",
    "scroll-behavior",
    "border-radius",
    "border-start-radius",
    "border-end-radius",
    "border-top-radius",
    "border-right-radius",
    "border-bottom-radius",
    "border-left-radius",
    "border-start-start-radius",
    "border-start-end-radius",
    "border-end-end-radius",
    "border-end-start-radius",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-bottom-right-radius",
    "border-bottom-left-radius",
    "border-width",
    "border-inline-width",
    "border-block-width",
    "border-inline-start-width",
    "border-inline-end-width",
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",
    "border-style",
    "border-inline-style",
    "border-block-style",
    "border-inline-start-style",
    "border-inline-end-style",
    "border-top-style",
    "border-right-style",
    "border-bottom-style",
    "border-left-style",
    "border-color",
    "border-inline-color",
    "border-block-color",
    "border-inline-start-color",
    "border-inline-end-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "background-color",
    "background-image",
    "--tw-gradient-position",
    "--tw-gradient-stops",
    "--tw-gradient-via-stops",
    "--tw-gradient-from",
    "--tw-gradient-from-position",
    "--tw-gradient-via",
    "--tw-gradient-via-position",
    "--tw-gradient-to",
    "--tw-gradient-to-position",
    "box-decoration-break",
    "background-size",
    "background-attachment",
    "background-clip",
    "background-position",
    "background-repeat",
    "background-origin",
    "fill",
    "stroke",
    "stroke-width",
    "object-fit",
    "object-position",
    "padding",
    "padding-inline",
    "padding-block",
    "padding-inline-start",
    "padding-inline-end",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "text-align",
    "text-indent",
    "vertical-align",
    "font-family",
    "font-size",
    "line-height",
    "font-weight",
    "letter-spacing",
    "text-wrap",
    "overflow-wrap",
    "word-break",
    "text-overflow",
    "hyphens",
    "white-space",
    "color",
    "text-transform",
    "font-style",
    "font-stretch",
    "font-variant-numeric",
    "text-decoration-line",
    "text-decoration-color",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-underline-offset",
    "-webkit-font-smoothing",
    "placeholder-color",
    "caret-color",
    "accent-color",
    "color-scheme",
    "opacity",
    "background-blend-mode",
    "mix-blend-mode",
    "box-shadow",
    "--tw-shadow",
    "--tw-shadow-color",
    "--tw-ring-shadow",
    "--tw-ring-color",
    "--tw-inset-shadow",
    "--tw-inset-shadow-color",
    "--tw-inset-ring-shadow",
    "--tw-inset-ring-color",
    "--tw-ring-offset-width",
    "--tw-ring-offset-color",
    "outline",
    "outline-width",
    "outline-offset",
    "outline-color",
    "--tw-blur",
    "--tw-brightness",
    "--tw-contrast",
    "--tw-drop-shadow",
    "--tw-grayscale",
    "--tw-hue-rotate",
    "--tw-invert",
    "--tw-saturate",
    "--tw-sepia",
    "filter",
    "--tw-backdrop-blur",
    "--tw-backdrop-brightness",
    "--tw-backdrop-contrast",
    "--tw-backdrop-grayscale",
    "--tw-backdrop-hue-rotate",
    "--tw-backdrop-invert",
    "--tw-backdrop-opacity",
    "--tw-backdrop-saturate",
    "--tw-backdrop-sepia",
    "backdrop-filter",
    "transition-property",
    "transition-behavior",
    "transition-delay",
    "transition-duration",
    "transition-timing-function",
    "will-change",
    "contain",
    "content",
    "forced-color-adjust",
  ];
  function ne(t, r, { onInvalidCandidate: o } = {}) {
    let e = new Map(),
      n = [],
      s = new Map();
    for (let p of t) {
      if (r.invalidCandidates.has(p)) {
        o?.(p);
        continue;
      }
      let c = r.parseCandidate(p);
      if (c.length === 0) {
        o?.(p);
        continue;
      }
      s.set(p, c);
    }
    let l = r.getVariantOrder();
    for (let [p, c] of s) {
      let d = !1;
      for (let u of c) {
        let g = r.compileAstNodes(u);
        if (g.length !== 0) {
          d = !0;
          for (let { node: m, propertySort: v } of g) {
            let y = 0n;
            for (let b of u.variants) y |= 1n << BigInt(l.get(b));
            e.set(m, { properties: v, variants: y, candidate: p }), n.push(m);
          }
        }
      }
      d || o?.(p);
    }
    return (
      n.sort((p, c) => {
        let d = e.get(p),
          u = e.get(c);
        if (d.variants - u.variants !== 0n)
          return Number(d.variants - u.variants);
        let g = 0;
        for (
          ;
          g < d.properties.order.length &&
          g < u.properties.order.length &&
          d.properties.order[g] === u.properties.order[g];

        )
          g += 1;
        return (
          (d.properties.order[g] ?? 1 / 0) - (u.properties.order[g] ?? 1 / 0) ||
          u.properties.count - d.properties.count ||
          Be(d.candidate, u.candidate)
        );
      }),
      { astNodes: n, nodeSorting: e }
    );
  }
  function mr(t, r) {
    let o = un(t, r);
    if (o.length === 0) return [];
    let e = [],
      n = `.${re(t.raw)}`;
    for (let s of o) {
      let l = cn(s);
      (t.important || r.important) && hr(s);
      let p = { kind: "rule", selector: n, nodes: s };
      for (let c of t.variants) if (be(p, c, r.variants) === null) return [];
      e.push({ node: p, propertySort: l });
    }
    return e;
  }
  function be(t, r, o, e = 0) {
    if (r.kind === "arbitrary") {
      if (r.relative && e === 0) return null;
      t.nodes = [M(r.selector, t.nodes)];
      return;
    }
    let { applyFn: n } = o.get(r.root);
    if (r.kind === "compound") {
      let l = U("@slot");
      if (
        be(l, r.variant, o, e + 1) === null ||
        (r.root === "not" && l.nodes.length > 1)
      )
        return null;
      for (let c of l.nodes)
        if ((c.kind !== "rule" && c.kind !== "at-rule") || n(c, r) === null)
          return null;
      _(l.nodes, (c) => {
        if ((c.kind === "rule" || c.kind === "at-rule") && c.nodes.length <= 0)
          return (c.nodes = t.nodes), 1;
      }),
        (t.nodes = l.nodes);
      return;
    }
    if (n(t, r) === null) return null;
  }
  function gr(t) {
    let r = t.options?.types ?? [];
    return r.length > 1 && r.includes("any");
  }
  function un(t, r) {
    if (t.kind === "arbitrary") {
      let l = t.value;
      return (
        t.modifier && (l = B(l, t.modifier, r.theme)),
        l === null ? [] : [[a(t.property, l)]]
      );
    }
    let o = r.utilities.get(t.root) ?? [],
      e = [],
      n = o.filter((l) => !gr(l));
    for (let l of n) {
      if (l.kind !== t.kind) continue;
      let p = l.compileFn(t);
      if (p !== void 0) {
        if (p === null) return e;
        e.push(p);
      }
    }
    if (e.length > 0) return e;
    let s = o.filter((l) => gr(l));
    for (let l of s) {
      if (l.kind !== t.kind) continue;
      let p = l.compileFn(t);
      if (p !== void 0) {
        if (p === null) return e;
        e.push(p);
      }
    }
    return e;
  }
  function hr(t) {
    for (let r of t)
      r.kind !== "at-root" &&
        (r.kind === "declaration"
          ? (r.important = !0)
          : (r.kind === "rule" || r.kind === "at-rule") && hr(r.nodes));
  }
  function cn(t) {
    let r = new Set(),
      o = 0,
      e = t.slice(),
      n = !1;
    for (; e.length > 0; ) {
      let s = e.shift();
      if (s.kind === "declaration") {
        if (s.value === void 0 || (o++, n)) continue;
        if (s.property === "--tw-sort") {
          let p = vt.indexOf(s.value ?? "");
          if (p !== -1) {
            r.add(p), (n = !0);
            continue;
          }
        }
        let l = vt.indexOf(s.property);
        l !== -1 && r.add(l);
      } else if (s.kind === "rule" || s.kind === "at-rule")
        for (let l of s.nodes) e.push(l);
    }
    return { order: Array.from(r).sort((s, l) => s - l), count: o };
  }
  function Ne(t, r) {
    let o = 0,
      e = M("&", t),
      n = new Set(),
      s = new j(() => new Set()),
      l = new j(() => new Set());
    _([e], (g, { parent: m }) => {
      if (g.kind === "at-rule") {
        if (g.name === "@keyframes")
          return (
            _(g.nodes, (v) => {
              if (v.kind === "at-rule" && v.name === "@apply")
                throw new Error("You cannot use `@apply` inside `@keyframes`.");
            }),
            1
          );
        if (g.name === "@utility") {
          let v = g.params.replace(/-\*$/, "");
          l.get(v).add(g),
            _(g.nodes, (y) => {
              if (!(y.kind !== "at-rule" || y.name !== "@apply")) {
                n.add(g);
                for (let b of br(y, r)) s.get(g).add(b);
              }
            });
          return;
        }
        if (g.name === "@apply") {
          if (m === null) return;
          (o |= 1), n.add(m);
          for (let v of br(g, r)) s.get(m).add(v);
        }
      }
    });
    let p = new Set(),
      c = [],
      d = new Set();
    function u(g, m = []) {
      if (!p.has(g)) {
        if (d.has(g)) {
          let v = m[(m.indexOf(g) + 1) % m.length];
          throw (
            (g.kind === "at-rule" &&
              g.name === "@utility" &&
              v.kind === "at-rule" &&
              v.name === "@utility" &&
              _(g.nodes, (y) => {
                if (y.kind !== "at-rule" || y.name !== "@apply") return;
                let b = y.params.split(/\s+/g);
                for (let x of b)
                  for (let $ of r.parseCandidate(x))
                    switch ($.kind) {
                      case "arbitrary":
                        break;
                      case "static":
                      case "functional":
                        if (v.params.replace(/-\*$/, "") === $.root)
                          throw new Error(
                            `You cannot \`@apply\` the \`${x}\` utility here because it creates a circular dependency.`,
                          );
                        break;
                      default:
                    }
              }),
            new Error(`Circular dependency detected:

${Y([g])}
Relies on:

${Y([v])}`))
          );
        }
        d.add(g);
        for (let v of s.get(g))
          for (let y of l.get(v)) m.push(g), u(y, m), m.pop();
        p.add(g), d.delete(g), c.push(g);
      }
    }
    for (let g of n) u(g);
    for (let g of c)
      if ("nodes" in g)
        for (let m = 0; m < g.nodes.length; m++) {
          let v = g.nodes[m];
          if (v.kind !== "at-rule" || v.name !== "@apply") continue;
          let y = v.params.split(/\s+/g);
          {
            let b = ne(y, r, {
                onInvalidCandidate: ($) => {
                  throw new Error(`Cannot apply unknown utility class: ${$}`);
                },
              }).astNodes,
              x = [];
            for (let $ of b)
              if ($.kind === "rule") for (let V of $.nodes) x.push(V);
              else x.push($);
            g.nodes.splice(m, 1, ...x);
          }
        }
    return o;
  }
  function* br(t, r) {
    for (let o of t.params.split(/\s+/g))
      for (let e of r.parseCandidate(o))
        switch (e.kind) {
          case "arbitrary":
            break;
          case "static":
          case "functional":
            yield e.root;
            break;
          default:
        }
  }
  async function kt(t, r, o, e = 0) {
    let n = 0,
      s = [];
    return (
      _(t, (l, { replaceWith: p }) => {
        if (
          l.kind === "at-rule" &&
          (l.name === "@import" || l.name === "@reference")
        ) {
          let c = fn(L(l.params));
          if (c === null) return;
          l.name === "@reference" && (c.media = "reference"), (n |= 2);
          let { uri: d, layer: u, media: g, supports: m } = c;
          if (
            d.startsWith("data:") ||
            d.startsWith("http://") ||
            d.startsWith("https://")
          )
            return;
          let v = Q({}, []);
          return (
            s.push(
              (async () => {
                if (e > 100)
                  throw new Error(
                    `Exceeded maximum recursion depth while resolving \`${d}\` in \`${r}\`)`,
                  );
                let y = await o(d, r),
                  b = pe(y.content);
                await kt(b, y.base, o, e + 1),
                  (v.nodes = dn([Q({ base: y.base }, b)], u, g, m));
              })(),
            ),
            p(v),
            1
          );
        }
      }),
      s.length > 0 && (await Promise.all(s)),
      n
    );
  }
  function fn(t) {
    let r,
      o = null,
      e = null,
      n = null;
    for (let s = 0; s < t.length; s++) {
      let l = t[s];
      if (l.kind !== "separator") {
        if (l.kind === "word" && !r) {
          if (!l.value || (l.value[0] !== '"' && l.value[0] !== "'"))
            return null;
          r = l.value.slice(1, -1);
          continue;
        }
        if ((l.kind === "function" && l.value.toLowerCase() === "url") || !r)
          return null;
        if (
          (l.kind === "word" || l.kind === "function") &&
          l.value.toLowerCase() === "layer"
        ) {
          if (o) return null;
          if (n)
            throw new Error(
              "`layer(\u2026)` in an `@import` should come before any other functions or conditions",
            );
          "nodes" in l ? (o = H(l.nodes)) : (o = "");
          continue;
        }
        if (l.kind === "function" && l.value.toLowerCase() === "supports") {
          if (n) return null;
          n = H(l.nodes);
          continue;
        }
        e = H(t.slice(s));
        break;
      }
    }
    return r ? { uri: r, layer: o, media: e, supports: n } : null;
  }
  function dn(t, r, o, e) {
    let n = t;
    return (
      r !== null && (n = [U("@layer", r, n)]),
      o !== null && (n = [U("@media", o, n)]),
      e !== null && (n = [U("@supports", e[0] === "(" ? e : `(${e})`, n)]),
      n
    );
  }
  function ye(t, r = null) {
    return Array.isArray(t) &&
      t.length === 2 &&
      typeof t[1] == "object" &&
      typeof t[1] !== null
      ? r
        ? (t[1][r] ?? null)
        : t[0]
      : Array.isArray(t) && r === null
        ? t.join(", ")
        : typeof t == "string" && r === null
          ? t
          : null;
  }
  function yr(t, { theme: r }, o) {
    for (let e of o) {
      let n = qe([e]);
      n && t.theme.clearNamespace(`--${n}`, 4);
    }
    for (let [e, n] of pn(r)) {
      if (typeof n != "string" && typeof n != "number") continue;
      if (
        (typeof n == "string" && (n = n.replace(/<alpha-value>/g, "1")),
        e[0] === "opacity" && (typeof n == "number" || typeof n == "string"))
      ) {
        let l = typeof n == "string" ? parseFloat(n) : n;
        l >= 0 && l <= 1 && (n = l * 100 + "%");
      }
      let s = qe(e);
      s && t.theme.add(`--${s}`, "" + n, 7);
    }
    if (Object.hasOwn(r, "fontFamily")) {
      let e = 5;
      {
        let n = ye(r.fontFamily.sans);
        n &&
          t.theme.hasDefault("--font-sans") &&
          (t.theme.add("--default-font-family", n, e),
          t.theme.add(
            "--default-font-feature-settings",
            ye(r.fontFamily.sans, "fontFeatureSettings") ?? "normal",
            e,
          ),
          t.theme.add(
            "--default-font-variation-settings",
            ye(r.fontFamily.sans, "fontVariationSettings") ?? "normal",
            e,
          ));
      }
      {
        let n = ye(r.fontFamily.mono);
        n &&
          t.theme.hasDefault("--font-mono") &&
          (t.theme.add("--default-mono-font-family", n, e),
          t.theme.add(
            "--default-mono-font-feature-settings",
            ye(r.fontFamily.mono, "fontFeatureSettings") ?? "normal",
            e,
          ),
          t.theme.add(
            "--default-mono-font-variation-settings",
            ye(r.fontFamily.mono, "fontVariationSettings") ?? "normal",
            e,
          ));
      }
    }
    return r;
  }
  function pn(t) {
    let r = [];
    return (
      vr(t, [], (o, e) => {
        if (gn(o)) return r.push([e, o]), 1;
        if (hn(o)) {
          r.push([e, o[0]]);
          for (let n of Reflect.ownKeys(o[1]))
            r.push([[...e, `-${n}`], o[1][n]]);
          return 1;
        }
        if (Array.isArray(o) && o.every((n) => typeof n == "string"))
          return r.push([e, o.join(", ")]), 1;
      }),
      r
    );
  }
  var mn = /^[a-zA-Z0-9-_%/\.]+$/;
  function qe(t) {
    if (t[0] === "container") return null;
    (t = structuredClone(t)),
      t[0] === "animation" && (t[0] = "animate"),
      t[0] === "aspectRatio" && (t[0] = "aspect"),
      t[0] === "borderRadius" && (t[0] = "radius"),
      t[0] === "boxShadow" && (t[0] = "shadow"),
      t[0] === "colors" && (t[0] = "color"),
      t[0] === "containers" && (t[0] = "container"),
      t[0] === "fontFamily" && (t[0] = "font"),
      t[0] === "fontSize" && (t[0] = "text"),
      t[0] === "letterSpacing" && (t[0] = "tracking"),
      t[0] === "lineHeight" && (t[0] = "leading"),
      t[0] === "maxWidth" && (t[0] = "container"),
      t[0] === "screens" && (t[0] = "breakpoint"),
      t[0] === "transitionTimingFunction" && (t[0] = "ease");
    for (let r of t) if (!mn.test(r)) return null;
    return t
      .map((r, o, e) => (r === "1" && o !== e.length - 1 ? "" : r))
      .map((r) =>
        r
          .replaceAll(".", "_")
          .replace(/([a-z])([A-Z])/g, (o, e, n) => `${e}-${n.toLowerCase()}`),
      )
      .filter((r, o) => r !== "DEFAULT" || o !== t.length - 1)
      .join("-");
  }
  function gn(t) {
    return typeof t == "number" || typeof t == "string";
  }
  function hn(t) {
    if (
      !Array.isArray(t) ||
      t.length !== 2 ||
      (typeof t[0] != "string" && typeof t[0] != "number") ||
      t[1] === void 0 ||
      t[1] === null ||
      typeof t[1] != "object"
    )
      return !1;
    for (let r of Reflect.ownKeys(t[1]))
      if (
        typeof r != "string" ||
        (typeof t[1][r] != "string" && typeof t[1][r] != "number")
      )
        return !1;
    return !0;
  }
  function vr(t, r = [], o) {
    for (let e of Reflect.ownKeys(t)) {
      let n = t[e];
      if (n == null) continue;
      let s = [...r, e],
        l = o(n, s) ?? 0;
      if (l !== 1) {
        if (l === 2) return 2;
        if (!(!Array.isArray(n) && typeof n != "object") && vr(n, s, o) === 2)
          return 2;
      }
    }
  }
  function He(t) {
    let r = [];
    for (let o of P(t, ".")) {
      if (!o.includes("[")) {
        r.push(o);
        continue;
      }
      let e = 0;
      for (;;) {
        let n = o.indexOf("[", e),
          s = o.indexOf("]", n);
        if (n === -1 || s === -1) break;
        n > e && r.push(o.slice(e, n)), r.push(o.slice(n + 1, s)), (e = s + 1);
      }
      e <= o.length - 1 && r.push(o.slice(e));
    }
    return r;
  }
  function ve(t) {
    if (Object.prototype.toString.call(t) !== "[object Object]") return !1;
    let r = Object.getPrototypeOf(t);
    return r === null || Object.getPrototypeOf(r) === null;
  }
  function $e(t, r, o, e = []) {
    for (let n of r)
      if (n != null)
        for (let s of Reflect.ownKeys(n)) {
          e.push(s);
          let l = o(t[s], n[s], e);
          l !== void 0
            ? (t[s] = l)
            : !ve(t[s]) || !ve(n[s])
              ? (t[s] = n[s])
              : (t[s] = $e({}, [t[s], n[s]], o, e)),
            e.pop();
        }
    return t;
  }
  function Ge(t, r, o) {
    return function (n, s) {
      let l = n.lastIndexOf("/"),
        p = null;
      l !== -1 && ((p = n.slice(l + 1).trim()), (n = n.slice(0, l).trim()));
      let c = (() => {
        let d = He(n),
          [u, g] = bn(t.theme, d),
          m = o(kr(r() ?? {}, d) ?? null);
        if (
          (typeof m == "string" && (m = m.replace("<alpha-value>", "1")),
          typeof u != "object")
        )
          return typeof g != "object" && g & 4 ? (m ?? u) : u;
        if (m !== null && typeof m == "object" && !Array.isArray(m)) {
          let v = $e({}, [m], (y, b) => b);
          if (u === null && Object.hasOwn(m, "__CSS_VALUES__")) {
            let y = {};
            for (let b in m.__CSS_VALUES__) (y[b] = m[b]), delete v[b];
            u = y;
          }
          for (let y in u)
            y !== "__CSS_VALUES__" &&
              ((m?.__CSS_VALUES__?.[y] & 4 && kr(v, y.split("-")) !== void 0) ||
                (v[ae(y)] = u[y]));
          return v;
        }
        if (Array.isArray(u) && Array.isArray(g) && Array.isArray(m)) {
          let v = u[0],
            y = u[1];
          g[0] & 4 && (v = m[0] ?? v);
          for (let b of Object.keys(y)) g[1][b] & 4 && (y[b] = m[1][b] ?? y[b]);
          return [v, y];
        }
        return u ?? m;
      })();
      return p && typeof c == "string" && (c = J(c, p)), c ?? s;
    };
  }
  function bn(t, r) {
    if (r.length === 1 && r[0].startsWith("--"))
      return [t.get([r[0]]), t.getOptions(r[0])];
    let o = qe(r),
      e = new Map(),
      n = new j(() => new Map()),
      s = t.namespace(`--${o}`);
    if (s.size === 0) return [null, 0];
    let l = new Map();
    for (let [u, g] of s) {
      if (!u || !u.includes("--")) {
        e.set(u, g), l.set(u, t.getOptions(u ? `--${o}-${u}` : `--${o}`));
        continue;
      }
      let m = u.indexOf("--"),
        v = u.slice(0, m),
        y = u.slice(m + 2);
      (y = y.replace(/-([a-z])/g, (b, x) => x.toUpperCase())),
        n.get(v === "" ? null : v).set(y, [g, t.getOptions(`--${o}${u}`)]);
    }
    let p = t.getOptions(`--${o}`);
    for (let [u, g] of n) {
      let m = e.get(u);
      if (typeof m != "string") continue;
      let v = {},
        y = {};
      for (let [b, [x, $]] of g) (v[b] = x), (y[b] = $);
      e.set(u, [m, v]), l.set(u, [p, y]);
    }
    let c = {},
      d = {};
    for (let [u, g] of e) wr(c, [u ?? "DEFAULT"], g);
    for (let [u, g] of l) wr(d, [u ?? "DEFAULT"], g);
    return r[r.length - 1] === "DEFAULT"
      ? [c?.DEFAULT ?? null, d.DEFAULT ?? 0]
      : "DEFAULT" in c && Object.keys(c).length === 1
        ? [c.DEFAULT, d.DEFAULT ?? 0]
        : ((c.__CSS_VALUES__ = d), [c, d]);
  }
  function kr(t, r) {
    for (let o = 0; o < r.length; ++o) {
      let e = r[o];
      if (t?.[e] === void 0) {
        if (r[o + 1] === void 0) return;
        r[o + 1] = `${e}-${r[o + 1]}`;
        continue;
      }
      t = t[e];
    }
    return t;
  }
  function wr(t, r, o) {
    for (let e of r.slice(0, -1)) t[e] === void 0 && (t[e] = {}), (t = t[e]);
    t[r[r.length - 1]] = o;
  }
  function yn(t) {
    return { kind: "combinator", value: t };
  }
  function vn(t, r) {
    return { kind: "function", value: t, nodes: r };
  }
  function Te(t) {
    return { kind: "selector", value: t };
  }
  function kn(t) {
    return { kind: "separator", value: t };
  }
  function wn(t) {
    return { kind: "value", value: t };
  }
  function Ve(t, r, o = null) {
    for (let e = 0; e < t.length; e++) {
      let n = t[e],
        s = !1,
        l = 0,
        p =
          r(n, {
            parent: o,
            replaceWith(c) {
              (s = !0),
                Array.isArray(c)
                  ? c.length === 0
                    ? (t.splice(e, 1), (l = 0))
                    : c.length === 1
                      ? ((t[e] = c[0]), (l = 1))
                      : (t.splice(e, 1, ...c), (l = c.length))
                  : ((t[e] = c), (l = 1));
            },
          }) ?? 0;
      if (s) {
        p === 0 ? e-- : (e += l - 1);
        continue;
      }
      if (p === 2) return 2;
      if (p !== 1 && n.kind === "function" && Ve(n.nodes, r, n) === 2) return 2;
    }
  }
  function Ee(t) {
    let r = "";
    for (let o of t)
      switch (o.kind) {
        case "combinator":
        case "selector":
        case "separator":
        case "value": {
          r += o.value;
          break;
        }
        case "function":
          r += o.value + "(" + Ee(o.nodes) + ")";
      }
    return r;
  }
  var xr = 92,
    xn = 93,
    Ar = 41,
    An = 58,
    Cr = 44,
    Cn = 34,
    Sn = 46,
    Sr = 62,
    Nr = 10,
    Nn = 35,
    $r = 91,
    Tr = 40,
    Vr = 43,
    $n = 39,
    Er = 32,
    Rr = 9,
    Or = 126;
  function Ye(t) {
    t = t.replaceAll(
      `\r
`,
      `
`,
    );
    let r = [],
      o = [],
      e = null,
      n = "",
      s;
    for (let l = 0; l < t.length; l++) {
      let p = t.charCodeAt(l);
      switch (p) {
        case Cr:
        case Sr:
        case Nr:
        case Er:
        case Vr:
        case Rr:
        case Or: {
          if (n.length > 0) {
            let m = Te(n);
            e ? e.nodes.push(m) : r.push(m), (n = "");
          }
          let c = l,
            d = l + 1;
          for (
            ;
            d < t.length &&
            ((s = t.charCodeAt(d)),
            !(
              s !== Cr &&
              s !== Sr &&
              s !== Nr &&
              s !== Er &&
              s !== Vr &&
              s !== Rr &&
              s !== Or
            ));
            d++
          );
          l = d - 1;
          let u = t.slice(c, d),
            g = u.trim() === "," ? kn(u) : yn(u);
          e ? e.nodes.push(g) : r.push(g);
          break;
        }
        case Tr: {
          let c = vn(n, []);
          if (
            ((n = ""),
            c.value !== ":not" &&
              c.value !== ":where" &&
              c.value !== ":has" &&
              c.value !== ":is")
          ) {
            let d = l + 1,
              u = 0;
            for (let m = l + 1; m < t.length; m++) {
              if (((s = t.charCodeAt(m)), s === Tr)) {
                u++;
                continue;
              }
              if (s === Ar) {
                if (u === 0) {
                  l = m;
                  break;
                }
                u--;
              }
            }
            let g = l;
            c.nodes.push(wn(t.slice(d, g))),
              (n = ""),
              (l = g),
              e ? e.nodes.push(c) : r.push(c);
            break;
          }
          e ? e.nodes.push(c) : r.push(c), o.push(c), (e = c);
          break;
        }
        case Ar: {
          let c = o.pop();
          if (n.length > 0) {
            let d = Te(n);
            c.nodes.push(d), (n = "");
          }
          o.length > 0 ? (e = o[o.length - 1]) : (e = null);
          break;
        }
        case Sn:
        case An:
        case Nn: {
          if (n.length > 0) {
            let c = Te(n);
            e ? e.nodes.push(c) : r.push(c);
          }
          n = String.fromCharCode(p);
          break;
        }
        case $r: {
          if (n.length > 0) {
            let u = Te(n);
            e ? e.nodes.push(u) : r.push(u);
          }
          n = "";
          let c = l,
            d = 0;
          for (let u = l + 1; u < t.length; u++) {
            if (((s = t.charCodeAt(u)), s === $r)) {
              d++;
              continue;
            }
            if (s === xn) {
              if (d === 0) {
                l = u;
                break;
              }
              d--;
            }
          }
          n += t.slice(c, l + 1);
          break;
        }
        case $n:
        case Cn: {
          let c = l;
          for (let d = l + 1; d < t.length; d++)
            if (((s = t.charCodeAt(d)), s === xr)) d += 1;
            else if (s === p) {
              l = d;
              break;
            }
          n += t.slice(c, l + 1);
          break;
        }
        case xr: {
          let c = t.charCodeAt(l + 1);
          (n += String.fromCharCode(p) + String.fromCharCode(c)), (l += 1);
          break;
        }
        default:
          n += String.fromCharCode(p);
      }
    }
    return n.length > 0 && r.push(Te(n)), r;
  }
  var Kr = /^[a-z@][a-zA-Z0-9/%._-]*$/;
  function wt({
    designSystem: t,
    ast: r,
    resolvedConfig: o,
    featuresRef: e,
    referenceMode: n,
  }) {
    let s = {
      addBase(l) {
        if (n) return;
        let p = X(l);
        (e.current |= he(p, t)), r.push(U("@layer", "base", p));
      },
      addVariant(l, p) {
        if (!We.test(l))
          throw new Error(
            `\`addVariant('${l}')\` defines an invalid variant name. Variants should only contain alphanumeric, dashes or underscore characters.`,
          );
        typeof p == "string" || Array.isArray(p)
          ? t.variants.static(
              l,
              (c) => {
                c.nodes = Pr(p, c.nodes);
              },
              { compounds: fe(typeof p == "string" ? [p] : p) },
            )
          : typeof p == "object" && t.variants.fromAst(l, X(p));
      },
      matchVariant(l, p, c) {
        function d(g, m, v) {
          let y = p(g, { modifier: m?.value ?? null });
          return Pr(y, v);
        }
        let u = Object.keys(c?.values ?? {});
        t.variants.group(
          () => {
            t.variants.functional(l, (g, m) => {
              if (!m.value) {
                if (c?.values && "DEFAULT" in c.values) {
                  g.nodes = d(c.values.DEFAULT, m.modifier, g.nodes);
                  return;
                }
                return null;
              }
              if (m.value.kind === "arbitrary")
                g.nodes = d(m.value.value, m.modifier, g.nodes);
              else if (m.value.kind === "named" && c?.values) {
                let v = c.values[m.value.value];
                if (typeof v != "string") return;
                g.nodes = d(v, m.modifier, g.nodes);
              }
            });
          },
          (g, m) => {
            if (g.kind !== "functional" || m.kind !== "functional") return 0;
            let v = g.value ? g.value.value : "DEFAULT",
              y = m.value ? m.value.value : "DEFAULT",
              b = c?.values?.[v] ?? v,
              x = c?.values?.[y] ?? y;
            if (c && typeof c.sort == "function")
              return c.sort(
                { value: b, modifier: g.modifier?.value ?? null },
                { value: x, modifier: m.modifier?.value ?? null },
              );
            let $ = u.indexOf(v),
              V = u.indexOf(y);
            return (
              ($ = $ === -1 ? u.length : $),
              (V = V === -1 ? u.length : V),
              $ !== V ? $ - V : b < x ? -1 : 1
            );
          },
        );
      },
      addUtilities(l) {
        l = Array.isArray(l) ? l : [l];
        let p = l.flatMap((d) => Object.entries(d));
        p = p.flatMap(([d, u]) => P(d, ",").map((g) => [g.trim(), u]));
        let c = new j(() => []);
        for (let [d, u] of p) {
          if (d.startsWith("@keyframes ")) {
            n || r.push(M(d, X(u)));
            continue;
          }
          let g = Ye(d),
            m = !1;
          if (
            (Ve(g, (v) => {
              if (
                v.kind === "selector" &&
                v.value[0] === "." &&
                Kr.test(v.value.slice(1))
              ) {
                let y = v.value;
                v.value = "&";
                let b = Ee(g),
                  x = y.slice(1),
                  $ = b === "&" ? X(u) : [M(b, X(u))];
                c.get(x).push(...$), (m = !0), (v.value = y);
                return;
              }
              if (v.kind === "function" && v.value === ":not") return 1;
            }),
            !m)
          )
            throw new Error(
              `\`addUtilities({ '${d}' : \u2026 })\` defines an invalid utility selector. Utilities must be a single class name and start with a lowercase letter, eg. \`.scrollbar-none\`.`,
            );
        }
        for (let [d, u] of c)
          t.theme.prefix &&
            _(u, (g) => {
              if (g.kind === "rule") {
                let m = Ye(g.selector);
                Ve(m, (v) => {
                  v.kind === "selector" &&
                    v.value[0] === "." &&
                    (v.value = `.${t.theme.prefix}\\:${v.value.slice(1)}`);
                }),
                  (g.selector = Ee(m));
              }
            }),
            t.utilities.static(d, (g) => {
              let m = structuredClone(u);
              return Ur(m, d, g.raw), (e.current |= Ne(m, t)), m;
            });
      },
      matchUtilities(l, p) {
        let c = p?.type
          ? Array.isArray(p?.type)
            ? p.type
            : [p.type]
          : ["any"];
        for (let [u, g] of Object.entries(l)) {
          let m = function ({ negative: v }) {
            return (y) => {
              if (
                y.value?.kind === "arbitrary" &&
                c.length > 0 &&
                !c.includes("any") &&
                ((y.value.dataType && !c.includes(y.value.dataType)) ||
                  (!y.value.dataType && !I(y.value.value, c)))
              )
                return;
              let b = c.includes("color"),
                x = null,
                $ = !1;
              {
                let R = p?.values ?? {};
                b &&
                  (R = Object.assign(
                    {
                      inherit: "inherit",
                      transparent: "transparent",
                      current: "currentColor",
                    },
                    R,
                  )),
                  y.value
                    ? y.value.kind === "arbitrary"
                      ? (x = y.value.value)
                      : y.value.fraction && R[y.value.fraction]
                        ? ((x = R[y.value.fraction]), ($ = !0))
                        : R[y.value.value]
                          ? (x = R[y.value.value])
                          : R.__BARE_VALUE__ &&
                            ((x = R.__BARE_VALUE__(y.value) ?? null),
                            ($ =
                              (y.value.fraction !== null && x?.includes("/")) ??
                              !1))
                    : (x = R.DEFAULT ?? null);
              }
              if (x === null) return;
              let V;
              {
                let R = p?.modifiers ?? null;
                y.modifier
                  ? R === "any" || y.modifier.kind === "arbitrary"
                    ? (V = y.modifier.value)
                    : R?.[y.modifier.value]
                      ? (V = R[y.modifier.value])
                      : b && !Number.isNaN(Number(y.modifier.value))
                        ? (V = `${y.modifier.value}%`)
                        : (V = null)
                  : (V = null);
              }
              if (y.modifier && V === null && !$)
                return y.value?.kind === "arbitrary" ? null : void 0;
              b && V !== null && (x = J(x, V)), v && (x = `calc(${x} * -1)`);
              let O = X(g(x, { modifier: V }));
              return Ur(O, u, y.raw), (e.current |= Ne(O, t)), O;
            };
          };
          var d = m;
          if (!Kr.test(u))
            throw new Error(
              `\`matchUtilities({ '${u}' : \u2026 })\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter, eg. \`scrollbar\`.`,
            );
          p?.supportsNegativeValues &&
            t.utilities.functional(`-${u}`, m({ negative: !0 }), { types: c }),
            t.utilities.functional(u, m({ negative: !1 }), { types: c }),
            t.utilities.suggest(u, () => {
              let v = p?.values ?? {},
                y = new Set(Object.keys(v));
              y.delete("__BARE_VALUE__"),
                y.has("DEFAULT") && (y.delete("DEFAULT"), y.add(null));
              let b = p?.modifiers ?? {},
                x = b === "any" ? [] : Object.keys(b);
              return [
                {
                  supportsNegative: p?.supportsNegativeValues ?? !1,
                  values: Array.from(y),
                  modifiers: x,
                },
              ];
            });
        }
      },
      addComponents(l, p) {
        this.addUtilities(l, p);
      },
      matchComponents(l, p) {
        this.matchUtilities(l, p);
      },
      theme: Ge(
        t,
        () => o.theme ?? {},
        (l) => l,
      ),
      prefix(l) {
        return l;
      },
      config(l, p) {
        let c = o;
        if (!l) return c;
        let d = He(l);
        for (let u = 0; u < d.length; ++u) {
          let g = d[u];
          if (c[g] === void 0) return p;
          c = c[g];
        }
        return c ?? p;
      },
    };
    return (
      (s.addComponents = s.addComponents.bind(s)),
      (s.matchComponents = s.matchComponents.bind(s)),
      s
    );
  }
  function X(t) {
    let r = [];
    t = Array.isArray(t) ? t : [t];
    let o = t.flatMap((e) => Object.entries(e));
    for (let [e, n] of o)
      if (typeof n != "object") {
        if (!e.startsWith("--")) {
          if (n === "@slot") {
            r.push(M(e, [U("@slot")]));
            continue;
          }
          e = e.replace(/([A-Z])/g, "-$1").toLowerCase();
        }
        r.push(a(e, String(n)));
      } else if (Array.isArray(n))
        for (let s of n)
          typeof s == "string" ? r.push(a(e, s)) : r.push(M(e, X(s)));
      else n !== null && r.push(M(e, X(n)));
    return r;
  }
  function Pr(t, r) {
    return (typeof t == "string" ? [t] : t).flatMap((e) => {
      if (e.trim().endsWith("}")) {
        let n = e.replace("}", "{@slot}}"),
          s = pe(n);
        return yt(s, r), s;
      } else return M(e, r);
    });
  }
  function Ur(t, r, o) {
    _(t, (e) => {
      if (e.kind === "rule") {
        let n = Ye(e.selector);
        Ve(n, (s) => {
          s.kind === "selector" &&
            s.value === `.${r}` &&
            (s.value = `.${re(o)}`);
        }),
          (e.selector = Ee(n));
      }
    });
  }
  function _r(t, r, o) {
    for (let e of Vn(r)) t.theme.addKeyframes(e);
  }
  function Vn(t) {
    let r = [];
    if ("keyframes" in t.theme)
      for (let [o, e] of Object.entries(t.theme.keyframes))
        r.push(U("@keyframes", o, X(e)));
    return r;
  }
  var Je = {
    inherit: "inherit",
    current: "currentColor",
    transparent: "transparent",
    black: "#000",
    white: "#fff",
    slate: {
      50: "oklch(0.984 0.003 247.858)",
      100: "oklch(0.968 0.007 247.896)",
      200: "oklch(0.929 0.013 255.508)",
      300: "oklch(0.869 0.022 252.894)",
      400: "oklch(0.704 0.04 256.788)",
      500: "oklch(0.554 0.046 257.417)",
      600: "oklch(0.446 0.043 257.281)",
      700: "oklch(0.372 0.044 257.287)",
      800: "oklch(0.279 0.041 260.031)",
      900: "oklch(0.208 0.042 265.755)",
      950: "oklch(0.129 0.042 264.695)",
    },
    gray: {
      50: "oklch(0.985 0.002 247.839)",
      100: "oklch(0.967 0.003 264.542)",
      200: "oklch(0.928 0.006 264.531)",
      300: "oklch(0.872 0.01 258.338)",
      400: "oklch(0.707 0.022 261.325)",
      500: "oklch(0.551 0.027 264.364)",
      600: "oklch(0.446 0.03 256.802)",
      700: "oklch(0.373 0.034 259.733)",
      800: "oklch(0.278 0.033 256.848)",
      900: "oklch(0.21 0.034 264.665)",
      950: "oklch(0.13 0.028 261.692)",
    },
    zinc: {
      50: "oklch(0.985 0 0)",
      100: "oklch(0.967 0.001 286.375)",
      200: "oklch(0.92 0.004 286.32)",
      300: "oklch(0.871 0.006 286.286)",
      400: "oklch(0.705 0.015 286.067)",
      500: "oklch(0.552 0.016 285.938)",
      600: "oklch(0.442 0.017 285.786)",
      700: "oklch(0.37 0.013 285.805)",
      800: "oklch(0.274 0.006 286.033)",
      900: "oklch(0.21 0.006 285.885)",
      950: "oklch(0.141 0.005 285.823)",
    },
    neutral: {
      50: "oklch(0.985 0 0)",
      100: "oklch(0.97 0 0)",
      200: "oklch(0.922 0 0)",
      300: "oklch(0.87 0 0)",
      400: "oklch(0.708 0 0)",
      500: "oklch(0.556 0 0)",
      600: "oklch(0.439 0 0)",
      700: "oklch(0.371 0 0)",
      800: "oklch(0.269 0 0)",
      900: "oklch(0.205 0 0)",
      950: "oklch(0.145 0 0)",
    },
    stone: {
      50: "oklch(0.985 0.001 106.423)",
      100: "oklch(0.97 0.001 106.424)",
      200: "oklch(0.923 0.003 48.717)",
      300: "oklch(0.869 0.005 56.366)",
      400: "oklch(0.709 0.01 56.259)",
      500: "oklch(0.553 0.013 58.071)",
      600: "oklch(0.444 0.011 73.639)",
      700: "oklch(0.374 0.01 67.558)",
      800: "oklch(0.268 0.007 34.298)",
      900: "oklch(0.216 0.006 56.043)",
      950: "oklch(0.147 0.004 49.25)",
    },
    red: {
      50: "oklch(0.971 0.013 17.38)",
      100: "oklch(0.936 0.032 17.717)",
      200: "oklch(0.885 0.062 18.334)",
      300: "oklch(0.808 0.114 19.571)",
      400: "oklch(0.704 0.191 22.216)",
      500: "oklch(0.637 0.237 25.331)",
      600: "oklch(0.577 0.245 27.325)",
      700: "oklch(0.505 0.213 27.518)",
      800: "oklch(0.444 0.177 26.899)",
      900: "oklch(0.396 0.141 25.723)",
      950: "oklch(0.258 0.092 26.042)",
    },
    orange: {
      50: "oklch(0.98 0.016 73.684)",
      100: "oklch(0.954 0.038 75.164)",
      200: "oklch(0.901 0.076 70.697)",
      300: "oklch(0.837 0.128 66.29)",
      400: "oklch(0.75 0.183 55.934)",
      500: "oklch(0.705 0.213 47.604)",
      600: "oklch(0.646 0.222 41.116)",
      700: "oklch(0.553 0.195 38.402)",
      800: "oklch(0.47 0.157 37.304)",
      900: "oklch(0.408 0.123 38.172)",
      950: "oklch(0.266 0.079 36.259)",
    },
    amber: {
      50: "oklch(0.987 0.022 95.277)",
      100: "oklch(0.962 0.059 95.617)",
      200: "oklch(0.924 0.12 95.746)",
      300: "oklch(0.879 0.169 91.605)",
      400: "oklch(0.828 0.189 84.429)",
      500: "oklch(0.769 0.188 70.08)",
      600: "oklch(0.666 0.179 58.318)",
      700: "oklch(0.555 0.163 48.998)",
      800: "oklch(0.473 0.137 46.201)",
      900: "oklch(0.414 0.112 45.904)",
      950: "oklch(0.279 0.077 45.635)",
    },
    yellow: {
      50: "oklch(0.987 0.026 102.212)",
      100: "oklch(0.973 0.071 103.193)",
      200: "oklch(0.945 0.129 101.54)",
      300: "oklch(0.905 0.182 98.111)",
      400: "oklch(0.852 0.199 91.936)",
      500: "oklch(0.795 0.184 86.047)",
      600: "oklch(0.681 0.162 75.834)",
      700: "oklch(0.554 0.135 66.442)",
      800: "oklch(0.476 0.114 61.907)",
      900: "oklch(0.421 0.095 57.708)",
      950: "oklch(0.286 0.066 53.813)",
    },
    lime: {
      50: "oklch(0.986 0.031 120.757)",
      100: "oklch(0.967 0.067 122.328)",
      200: "oklch(0.938 0.127 124.321)",
      300: "oklch(0.897 0.196 126.665)",
      400: "oklch(0.841 0.238 128.85)",
      500: "oklch(0.768 0.233 130.85)",
      600: "oklch(0.648 0.2 131.684)",
      700: "oklch(0.532 0.157 131.589)",
      800: "oklch(0.453 0.124 130.933)",
      900: "oklch(0.405 0.101 131.063)",
      950: "oklch(0.274 0.072 132.109)",
    },
    green: {
      50: "oklch(0.982 0.018 155.826)",
      100: "oklch(0.962 0.044 156.743)",
      200: "oklch(0.925 0.084 155.995)",
      300: "oklch(0.871 0.15 154.449)",
      400: "oklch(0.792 0.209 151.711)",
      500: "oklch(0.723 0.219 149.579)",
      600: "oklch(0.627 0.194 149.214)",
      700: "oklch(0.527 0.154 150.069)",
      800: "oklch(0.448 0.119 151.328)",
      900: "oklch(0.393 0.095 152.535)",
      950: "oklch(0.266 0.065 152.934)",
    },
    emerald: {
      50: "oklch(0.979 0.021 166.113)",
      100: "oklch(0.95 0.052 163.051)",
      200: "oklch(0.905 0.093 164.15)",
      300: "oklch(0.845 0.143 164.978)",
      400: "oklch(0.765 0.177 163.223)",
      500: "oklch(0.696 0.17 162.48)",
      600: "oklch(0.596 0.145 163.225)",
      700: "oklch(0.508 0.118 165.612)",
      800: "oklch(0.432 0.095 166.913)",
      900: "oklch(0.378 0.077 168.94)",
      950: "oklch(0.262 0.051 172.552)",
    },
    teal: {
      50: "oklch(0.984 0.014 180.72)",
      100: "oklch(0.953 0.051 180.801)",
      200: "oklch(0.91 0.096 180.426)",
      300: "oklch(0.855 0.138 181.071)",
      400: "oklch(0.777 0.152 181.912)",
      500: "oklch(0.704 0.14 182.503)",
      600: "oklch(0.6 0.118 184.704)",
      700: "oklch(0.511 0.096 186.391)",
      800: "oklch(0.437 0.078 188.216)",
      900: "oklch(0.386 0.063 188.416)",
      950: "oklch(0.277 0.046 192.524)",
    },
    cyan: {
      50: "oklch(0.984 0.019 200.873)",
      100: "oklch(0.956 0.045 203.388)",
      200: "oklch(0.917 0.08 205.041)",
      300: "oklch(0.865 0.127 207.078)",
      400: "oklch(0.789 0.154 211.53)",
      500: "oklch(0.715 0.143 215.221)",
      600: "oklch(0.609 0.126 221.723)",
      700: "oklch(0.52 0.105 223.128)",
      800: "oklch(0.45 0.085 224.283)",
      900: "oklch(0.398 0.07 227.392)",
      950: "oklch(0.302 0.056 229.695)",
    },
    sky: {
      50: "oklch(0.977 0.013 236.62)",
      100: "oklch(0.951 0.026 236.824)",
      200: "oklch(0.901 0.058 230.902)",
      300: "oklch(0.828 0.111 230.318)",
      400: "oklch(0.746 0.16 232.661)",
      500: "oklch(0.685 0.169 237.323)",
      600: "oklch(0.588 0.158 241.966)",
      700: "oklch(0.5 0.134 242.749)",
      800: "oklch(0.443 0.11 240.79)",
      900: "oklch(0.391 0.09 240.876)",
      950: "oklch(0.293 0.066 243.157)",
    },
    blue: {
      50: "oklch(0.97 0.014 254.604)",
      100: "oklch(0.932 0.032 255.585)",
      200: "oklch(0.882 0.059 254.128)",
      300: "oklch(0.809 0.105 251.813)",
      400: "oklch(0.707 0.165 254.624)",
      500: "oklch(0.623 0.214 259.815)",
      600: "oklch(0.546 0.245 262.881)",
      700: "oklch(0.488 0.243 264.376)",
      800: "oklch(0.424 0.199 265.638)",
      900: "oklch(0.379 0.146 265.522)",
      950: "oklch(0.282 0.091 267.935)",
    },
    indigo: {
      50: "oklch(0.962 0.018 272.314)",
      100: "oklch(0.93 0.034 272.788)",
      200: "oklch(0.87 0.065 274.039)",
      300: "oklch(0.785 0.115 274.713)",
      400: "oklch(0.673 0.182 276.935)",
      500: "oklch(0.585 0.233 277.117)",
      600: "oklch(0.511 0.262 276.966)",
      700: "oklch(0.457 0.24 277.023)",
      800: "oklch(0.398 0.195 277.366)",
      900: "oklch(0.359 0.144 278.697)",
      950: "oklch(0.257 0.09 281.288)",
    },
    violet: {
      50: "oklch(0.969 0.016 293.756)",
      100: "oklch(0.943 0.029 294.588)",
      200: "oklch(0.894 0.057 293.283)",
      300: "oklch(0.811 0.111 293.571)",
      400: "oklch(0.702 0.183 293.541)",
      500: "oklch(0.606 0.25 292.717)",
      600: "oklch(0.541 0.281 293.009)",
      700: "oklch(0.491 0.27 292.581)",
      800: "oklch(0.432 0.232 292.759)",
      900: "oklch(0.38 0.189 293.745)",
      950: "oklch(0.283 0.141 291.089)",
    },
    purple: {
      50: "oklch(0.977 0.014 308.299)",
      100: "oklch(0.946 0.033 307.174)",
      200: "oklch(0.902 0.063 306.703)",
      300: "oklch(0.827 0.119 306.383)",
      400: "oklch(0.714 0.203 305.504)",
      500: "oklch(0.627 0.265 303.9)",
      600: "oklch(0.558 0.288 302.321)",
      700: "oklch(0.496 0.265 301.924)",
      800: "oklch(0.438 0.218 303.724)",
      900: "oklch(0.381 0.176 304.987)",
      950: "oklch(0.291 0.149 302.717)",
    },
    fuchsia: {
      50: "oklch(0.977 0.017 320.058)",
      100: "oklch(0.952 0.037 318.852)",
      200: "oklch(0.903 0.076 319.62)",
      300: "oklch(0.833 0.145 321.434)",
      400: "oklch(0.74 0.238 322.16)",
      500: "oklch(0.667 0.295 322.15)",
      600: "oklch(0.591 0.293 322.896)",
      700: "oklch(0.518 0.253 323.949)",
      800: "oklch(0.452 0.211 324.591)",
      900: "oklch(0.401 0.17 325.612)",
      950: "oklch(0.293 0.136 325.661)",
    },
    pink: {
      50: "oklch(0.971 0.014 343.198)",
      100: "oklch(0.948 0.028 342.258)",
      200: "oklch(0.899 0.061 343.231)",
      300: "oklch(0.823 0.12 346.018)",
      400: "oklch(0.718 0.202 349.761)",
      500: "oklch(0.656 0.241 354.308)",
      600: "oklch(0.592 0.249 0.584)",
      700: "oklch(0.525 0.223 3.958)",
      800: "oklch(0.459 0.187 3.815)",
      900: "oklch(0.408 0.153 2.432)",
      950: "oklch(0.284 0.109 3.907)",
    },
    rose: {
      50: "oklch(0.969 0.015 12.422)",
      100: "oklch(0.941 0.03 12.58)",
      200: "oklch(0.892 0.058 10.001)",
      300: "oklch(0.81 0.117 11.638)",
      400: "oklch(0.712 0.194 13.428)",
      500: "oklch(0.645 0.246 16.439)",
      600: "oklch(0.586 0.253 17.585)",
      700: "oklch(0.514 0.222 16.935)",
      800: "oklch(0.455 0.188 13.697)",
      900: "oklch(0.41 0.159 10.272)",
      950: "oklch(0.271 0.105 12.094)",
    },
  };
  function de(t) {
    return { __BARE_VALUE__: t };
  }
  var Z = de((t) => {
      if (N(t.value)) return t.value;
    }),
    q = de((t) => {
      if (N(t.value)) return `${t.value}%`;
    }),
    ie = de((t) => {
      if (N(t.value)) return `${t.value}px`;
    }),
    Dr = de((t) => {
      if (N(t.value)) return `${t.value}ms`;
    }),
    Ze = de((t) => {
      if (N(t.value)) return `${t.value}deg`;
    }),
    En = de((t) => {
      if (t.fraction === null) return;
      let [r, o] = P(t.fraction, "/");
      if (!(!N(r) || !N(o))) return t.fraction;
    }),
    zr = de((t) => {
      if (N(Number(t.value))) return `repeat(${t.value}, minmax(0, 1fr))`;
    }),
    Fr = {
      accentColor: ({ theme: t }) => t("colors"),
      animation: {
        none: "none",
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
      },
      aria: {
        busy: 'busy="true"',
        checked: 'checked="true"',
        disabled: 'disabled="true"',
        expanded: 'expanded="true"',
        hidden: 'hidden="true"',
        pressed: 'pressed="true"',
        readonly: 'readonly="true"',
        required: 'required="true"',
        selected: 'selected="true"',
      },
      aspectRatio: { auto: "auto", square: "1 / 1", video: "16 / 9", ...En },
      backdropBlur: ({ theme: t }) => t("blur"),
      backdropBrightness: ({ theme: t }) => ({ ...t("brightness"), ...q }),
      backdropContrast: ({ theme: t }) => ({ ...t("contrast"), ...q }),
      backdropGrayscale: ({ theme: t }) => ({ ...t("grayscale"), ...q }),
      backdropHueRotate: ({ theme: t }) => ({ ...t("hueRotate"), ...Ze }),
      backdropInvert: ({ theme: t }) => ({ ...t("invert"), ...q }),
      backdropOpacity: ({ theme: t }) => ({ ...t("opacity"), ...q }),
      backdropSaturate: ({ theme: t }) => ({ ...t("saturate"), ...q }),
      backdropSepia: ({ theme: t }) => ({ ...t("sepia"), ...q }),
      backgroundColor: ({ theme: t }) => t("colors"),
      backgroundImage: {
        none: "none",
        "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
        "gradient-to-tr":
          "linear-gradient(to top right, var(--tw-gradient-stops))",
        "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
        "gradient-to-br":
          "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
        "gradient-to-bl":
          "linear-gradient(to bottom left, var(--tw-gradient-stops))",
        "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
        "gradient-to-tl":
          "linear-gradient(to top left, var(--tw-gradient-stops))",
      },
      backgroundOpacity: ({ theme: t }) => t("opacity"),
      backgroundPosition: {
        bottom: "bottom",
        center: "center",
        left: "left",
        "left-bottom": "left bottom",
        "left-top": "left top",
        right: "right",
        "right-bottom": "right bottom",
        "right-top": "right top",
        top: "top",
      },
      backgroundSize: { auto: "auto", cover: "cover", contain: "contain" },
      blur: {
        0: "0",
        none: "",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },
      borderColor: ({ theme: t }) => ({
        DEFAULT: "currentColor",
        ...t("colors"),
      }),
      borderOpacity: ({ theme: t }) => t("opacity"),
      borderRadius: {
        none: "0px",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      borderSpacing: ({ theme: t }) => t("spacing"),
      borderWidth: {
        DEFAULT: "1px",
        0: "0px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none",
      },
      boxShadowColor: ({ theme: t }) => t("colors"),
      brightness: {
        0: "0",
        50: ".5",
        75: ".75",
        90: ".9",
        95: ".95",
        100: "1",
        105: "1.05",
        110: "1.1",
        125: "1.25",
        150: "1.5",
        200: "2",
        ...q,
      },
      caretColor: ({ theme: t }) => t("colors"),
      colors: () => ({ ...Je }),
      columns: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        "3xs": "16rem",
        "2xs": "18rem",
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
        ...Z,
      },
      container: {},
      content: { none: "none" },
      contrast: {
        0: "0",
        50: ".5",
        75: ".75",
        100: "1",
        125: "1.25",
        150: "1.5",
        200: "2",
        ...q,
      },
      cursor: {
        auto: "auto",
        default: "default",
        pointer: "pointer",
        wait: "wait",
        text: "text",
        move: "move",
        help: "help",
        "not-allowed": "not-allowed",
        none: "none",
        "context-menu": "context-menu",
        progress: "progress",
        cell: "cell",
        crosshair: "crosshair",
        "vertical-text": "vertical-text",
        alias: "alias",
        copy: "copy",
        "no-drop": "no-drop",
        grab: "grab",
        grabbing: "grabbing",
        "all-scroll": "all-scroll",
        "col-resize": "col-resize",
        "row-resize": "row-resize",
        "n-resize": "n-resize",
        "e-resize": "e-resize",
        "s-resize": "s-resize",
        "w-resize": "w-resize",
        "ne-resize": "ne-resize",
        "nw-resize": "nw-resize",
        "se-resize": "se-resize",
        "sw-resize": "sw-resize",
        "ew-resize": "ew-resize",
        "ns-resize": "ns-resize",
        "nesw-resize": "nesw-resize",
        "nwse-resize": "nwse-resize",
        "zoom-in": "zoom-in",
        "zoom-out": "zoom-out",
      },
      divideColor: ({ theme: t }) => t("borderColor"),
      divideOpacity: ({ theme: t }) => t("borderOpacity"),
      divideWidth: ({ theme: t }) => ({ ...t("borderWidth"), ...ie }),
      dropShadow: {
        sm: "0 1px 1px rgb(0 0 0 / 0.05)",
        DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
        md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
        lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
        xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
        "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
        none: "0 0 #0000",
      },
      fill: ({ theme: t }) => t("colors"),
      flex: {
        1: "1 1 0%",
        auto: "1 1 auto",
        initial: "0 1 auto",
        none: "none",
      },
      flexBasis: ({ theme: t }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        full: "100%",
        ...t("spacing"),
      }),
      flexGrow: { 0: "0", DEFAULT: "1", ...Z },
      flexShrink: { 0: "0", DEFAULT: "1", ...Z },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        serif: [
          "ui-serif",
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      gap: ({ theme: t }) => t("spacing"),
      gradientColorStops: ({ theme: t }) => t("colors"),
      gradientColorStopPositions: {
        "0%": "0%",
        "5%": "5%",
        "10%": "10%",
        "15%": "15%",
        "20%": "20%",
        "25%": "25%",
        "30%": "30%",
        "35%": "35%",
        "40%": "40%",
        "45%": "45%",
        "50%": "50%",
        "55%": "55%",
        "60%": "60%",
        "65%": "65%",
        "70%": "70%",
        "75%": "75%",
        "80%": "80%",
        "85%": "85%",
        "90%": "90%",
        "95%": "95%",
        "100%": "100%",
        ...q,
      },
      grayscale: { 0: "0", DEFAULT: "100%", ...q },
      gridAutoColumns: {
        auto: "auto",
        min: "min-content",
        max: "max-content",
        fr: "minmax(0, 1fr)",
      },
      gridAutoRows: {
        auto: "auto",
        min: "min-content",
        max: "max-content",
        fr: "minmax(0, 1fr)",
      },
      gridColumn: {
        auto: "auto",
        "span-1": "span 1 / span 1",
        "span-2": "span 2 / span 2",
        "span-3": "span 3 / span 3",
        "span-4": "span 4 / span 4",
        "span-5": "span 5 / span 5",
        "span-6": "span 6 / span 6",
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
        "span-full": "1 / -1",
      },
      gridColumnEnd: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...Z,
      },
      gridColumnStart: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...Z,
      },
      gridRow: {
        auto: "auto",
        "span-1": "span 1 / span 1",
        "span-2": "span 2 / span 2",
        "span-3": "span 3 / span 3",
        "span-4": "span 4 / span 4",
        "span-5": "span 5 / span 5",
        "span-6": "span 6 / span 6",
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
        "span-full": "1 / -1",
      },
      gridRowEnd: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...Z,
      },
      gridRowStart: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...Z,
      },
      gridTemplateColumns: {
        none: "none",
        subgrid: "subgrid",
        1: "repeat(1, minmax(0, 1fr))",
        2: "repeat(2, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
        5: "repeat(5, minmax(0, 1fr))",
        6: "repeat(6, minmax(0, 1fr))",
        7: "repeat(7, minmax(0, 1fr))",
        8: "repeat(8, minmax(0, 1fr))",
        9: "repeat(9, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        11: "repeat(11, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
        ...zr,
      },
      gridTemplateRows: {
        none: "none",
        subgrid: "subgrid",
        1: "repeat(1, minmax(0, 1fr))",
        2: "repeat(2, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
        5: "repeat(5, minmax(0, 1fr))",
        6: "repeat(6, minmax(0, 1fr))",
        7: "repeat(7, minmax(0, 1fr))",
        8: "repeat(8, minmax(0, 1fr))",
        9: "repeat(9, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        11: "repeat(11, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
        ...zr,
      },
      height: ({ theme: t }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        full: "100%",
        screen: "100vh",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      hueRotate: {
        0: "0deg",
        15: "15deg",
        30: "30deg",
        60: "60deg",
        90: "90deg",
        180: "180deg",
        ...Ze,
      },
      inset: ({ theme: t }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        full: "100%",
        ...t("spacing"),
      }),
      invert: { 0: "0", DEFAULT: "100%", ...q },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        ping: { "75%, 100%": { transform: "scale(2)", opacity: "0" } },
        pulse: { "50%": { opacity: ".5" } },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      lineHeight: {
        none: "1",
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
        3: ".75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
      },
      listStyleType: { none: "none", disc: "disc", decimal: "decimal" },
      listStyleImage: { none: "none" },
      margin: ({ theme: t }) => ({ auto: "auto", ...t("spacing") }),
      lineClamp: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", ...Z },
      maxHeight: ({ theme: t }) => ({
        none: "none",
        full: "100%",
        screen: "100vh",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      maxWidth: ({ theme: t }) => ({
        none: "none",
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
        full: "100%",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        prose: "65ch",
        ...t("spacing"),
      }),
      minHeight: ({ theme: t }) => ({
        full: "100%",
        screen: "100vh",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      minWidth: ({ theme: t }) => ({
        full: "100%",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      objectPosition: {
        bottom: "bottom",
        center: "center",
        left: "left",
        "left-bottom": "left bottom",
        "left-top": "left top",
        right: "right",
        "right-bottom": "right bottom",
        "right-top": "right top",
        top: "top",
      },
      opacity: {
        0: "0",
        5: "0.05",
        10: "0.1",
        15: "0.15",
        20: "0.2",
        25: "0.25",
        30: "0.3",
        35: "0.35",
        40: "0.4",
        45: "0.45",
        50: "0.5",
        55: "0.55",
        60: "0.6",
        65: "0.65",
        70: "0.7",
        75: "0.75",
        80: "0.8",
        85: "0.85",
        90: "0.9",
        95: "0.95",
        100: "1",
        ...q,
      },
      order: {
        first: "-9999",
        last: "9999",
        none: "0",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        ...Z,
      },
      outlineColor: ({ theme: t }) => t("colors"),
      outlineOffset: {
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      outlineWidth: { 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px", ...ie },
      padding: ({ theme: t }) => t("spacing"),
      placeholderColor: ({ theme: t }) => t("colors"),
      placeholderOpacity: ({ theme: t }) => t("opacity"),
      ringColor: ({ theme: t }) => ({
        DEFAULT: "currentColor",
        ...t("colors"),
      }),
      ringOffsetColor: ({ theme: t }) => t("colors"),
      ringOffsetWidth: {
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      ringOpacity: ({ theme: t }) => ({ DEFAULT: "0.5", ...t("opacity") }),
      ringWidth: {
        DEFAULT: "3px",
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      rotate: {
        0: "0deg",
        1: "1deg",
        2: "2deg",
        3: "3deg",
        6: "6deg",
        12: "12deg",
        45: "45deg",
        90: "90deg",
        180: "180deg",
        ...Ze,
      },
      saturate: { 0: "0", 50: ".5", 100: "1", 150: "1.5", 200: "2", ...q },
      scale: {
        0: "0",
        50: ".5",
        75: ".75",
        90: ".9",
        95: ".95",
        100: "1",
        105: "1.05",
        110: "1.1",
        125: "1.25",
        150: "1.5",
        ...q,
      },
      screens: {
        sm: "40rem",
        md: "48rem",
        lg: "64rem",
        xl: "80rem",
        "2xl": "96rem",
      },
      scrollMargin: ({ theme: t }) => t("spacing"),
      scrollPadding: ({ theme: t }) => t("spacing"),
      sepia: { 0: "0", DEFAULT: "100%", ...q },
      skew: {
        0: "0deg",
        1: "1deg",
        2: "2deg",
        3: "3deg",
        6: "6deg",
        12: "12deg",
        ...Ze,
      },
      space: ({ theme: t }) => t("spacing"),
      spacing: {
        px: "1px",
        0: "0px",
        0.5: "0.125rem",
        1: "0.25rem",
        1.5: "0.375rem",
        2: "0.5rem",
        2.5: "0.625rem",
        3: "0.75rem",
        3.5: "0.875rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
        11: "2.75rem",
        12: "3rem",
        14: "3.5rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
        36: "9rem",
        40: "10rem",
        44: "11rem",
        48: "12rem",
        52: "13rem",
        56: "14rem",
        60: "15rem",
        64: "16rem",
        72: "18rem",
        80: "20rem",
        96: "24rem",
      },
      stroke: ({ theme: t }) => ({ none: "none", ...t("colors") }),
      strokeWidth: { 0: "0", 1: "1", 2: "2", ...Z },
      supports: {},
      data: {},
      textColor: ({ theme: t }) => t("colors"),
      textDecorationColor: ({ theme: t }) => t("colors"),
      textDecorationThickness: {
        auto: "auto",
        "from-font": "from-font",
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      textIndent: ({ theme: t }) => t("spacing"),
      textOpacity: ({ theme: t }) => t("opacity"),
      textUnderlineOffset: {
        auto: "auto",
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      transformOrigin: {
        center: "center",
        top: "top",
        "top-right": "top right",
        right: "right",
        "bottom-right": "bottom right",
        bottom: "bottom",
        "bottom-left": "bottom left",
        left: "left",
        "top-left": "top left",
      },
      transitionDelay: {
        0: "0s",
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1e3: "1000ms",
        ...Dr,
      },
      transitionDuration: {
        DEFAULT: "150ms",
        0: "0s",
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1e3: "1000ms",
        ...Dr,
      },
      transitionProperty: {
        none: "none",
        all: "all",
        DEFAULT:
          "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
        colors:
          "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
        opacity: "opacity",
        shadow: "box-shadow",
        transform: "transform",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        linear: "linear",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      translate: ({ theme: t }) => ({
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        full: "100%",
        ...t("spacing"),
      }),
      size: ({ theme: t }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        full: "100%",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      width: ({ theme: t }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        full: "100%",
        screen: "100vw",
        svw: "100svw",
        lvw: "100lvw",
        dvw: "100dvw",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      willChange: {
        auto: "auto",
        scroll: "scroll-position",
        contents: "contents",
        transform: "transform",
      },
      zIndex: {
        auto: "auto",
        0: "0",
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        ...Z,
      },
    };
  function jr(t) {
    return {
      theme: {
        ...Fr,
        colors: ({ theme: r }) => r("color", {}),
        extend: {
          fontSize: ({ theme: r }) => ({ ...r("text", {}) }),
          boxShadow: ({ theme: r }) => ({ ...r("shadow", {}) }),
          animation: ({ theme: r }) => ({ ...r("animate", {}) }),
          aspectRatio: ({ theme: r }) => ({ ...r("aspect", {}) }),
          borderRadius: ({ theme: r }) => ({ ...r("radius", {}) }),
          screens: ({ theme: r }) => ({ ...r("breakpoint", {}) }),
          letterSpacing: ({ theme: r }) => ({ ...r("tracking", {}) }),
          lineHeight: ({ theme: r }) => ({ ...r("leading", {}) }),
          transitionDuration: {
            DEFAULT: t.get(["--default-transition-duration"]) ?? null,
          },
          transitionTimingFunction: {
            DEFAULT: t.get(["--default-transition-timing-function"]) ?? null,
          },
          maxWidth: ({ theme: r }) => ({ ...r("container", {}) }),
        },
      },
    };
  }
  var Rn = {
    blocklist: [],
    future: {},
    prefix: "",
    important: !1,
    darkMode: null,
    theme: {},
    plugins: [],
    content: { files: [] },
  };
  function At(t, r) {
    let o = {
      design: t,
      configs: [],
      plugins: [],
      content: { files: [] },
      theme: {},
      extend: {},
      result: structuredClone(Rn),
    };
    for (let n of r) xt(o, n);
    for (let n of o.configs)
      "darkMode" in n &&
        n.darkMode !== void 0 &&
        (o.result.darkMode = n.darkMode ?? null),
        "prefix" in n &&
          n.prefix !== void 0 &&
          (o.result.prefix = n.prefix ?? ""),
        "blocklist" in n &&
          n.blocklist !== void 0 &&
          (o.result.blocklist = n.blocklist ?? []),
        "important" in n &&
          n.important !== void 0 &&
          (o.result.important = n.important ?? !1);
    let e = Kn(o);
    return {
      resolvedConfig: {
        ...o.result,
        content: o.content,
        theme: o.theme,
        plugins: o.plugins,
      },
      replacedThemeKeys: e,
    };
  }
  function On(t, r) {
    if (Array.isArray(t) && ve(t[0])) return t.concat(r);
    if (Array.isArray(r) && ve(r[0]) && ve(t)) return [t, ...r];
    if (Array.isArray(r)) return r;
  }
  function xt(t, { config: r, base: o, path: e, reference: n }) {
    let s = [];
    for (let c of r.plugins ?? [])
      "__isOptionsFunction" in c
        ? s.push({ ...c(), reference: n })
        : "handler" in c
          ? s.push({ ...c, reference: n })
          : s.push({ handler: c, reference: n });
    if (Array.isArray(r.presets) && r.presets.length === 0)
      throw new Error(
        "Error in the config file/plugin/preset. An empty preset (`preset: []`) is not currently supported.",
      );
    for (let c of r.presets ?? [])
      xt(t, { path: e, base: o, config: c, reference: n });
    for (let c of s)
      t.plugins.push(c),
        c.config &&
          xt(t, {
            path: e,
            base: o,
            config: c.config,
            reference: !!c.reference,
          });
    let l = r.content ?? [],
      p = Array.isArray(l) ? l : l.files;
    for (let c of p)
      t.content.files.push(typeof c == "object" ? c : { base: o, pattern: c });
    t.configs.push(r);
  }
  function Kn(t) {
    let r = new Set(),
      o = Ge(t.design, () => t.theme, n),
      e = Object.assign(o, { theme: o, colors: Je });
    function n(s) {
      return typeof s == "function" ? (s(e) ?? null) : (s ?? null);
    }
    for (let s of t.configs) {
      let l = s.theme ?? {},
        p = l.extend ?? {};
      for (let c in l) c !== "extend" && r.add(c);
      Object.assign(t.theme, l);
      for (let c in p) (t.extend[c] ??= []), t.extend[c].push(p[c]);
    }
    delete t.theme.extend;
    for (let s in t.extend) {
      let l = [t.theme[s], ...t.extend[s]];
      t.theme[s] = () => {
        let p = l.map(n);
        return $e({}, p, On);
      };
    }
    for (let s in t.theme) t.theme[s] = n(t.theme[s]);
    if (t.theme.screens && typeof t.theme.screens == "object")
      for (let s of Object.keys(t.theme.screens)) {
        let l = t.theme.screens[s];
        l &&
          typeof l == "object" &&
          ("raw" in l ||
            "max" in l ||
            ("min" in l && (t.theme.screens[s] = l.min)));
      }
    return r;
  }
  function Ir(t, r) {
    let o = t.theme.container || {};
    if (typeof o != "object" || o === null) return;
    let e = Pn(o, r);
    e.length !== 0 && r.utilities.static("container", () => structuredClone(e));
  }
  function Pn({ center: t, padding: r, screens: o }, e) {
    let n = [],
      s = null;
    if (
      (t && n.push(a("margin-inline", "auto")),
      (typeof r == "string" ||
        (typeof r == "object" && r !== null && "DEFAULT" in r)) &&
        n.push(a("padding-inline", typeof r == "string" ? r : r.DEFAULT)),
      typeof o == "object" && o !== null)
    ) {
      s = new Map();
      let l = Array.from(e.theme.namespace("--breakpoint").entries());
      if ((l.sort((p, c) => ue(p[1], c[1], "asc")), l.length > 0)) {
        let [p] = l[0];
        n.push(
          U("@media", `(width >= --theme(--breakpoint-${p}))`, [
            a("max-width", "none"),
          ]),
        );
      }
      for (let [p, c] of Object.entries(o)) {
        if (typeof c == "object")
          if ("min" in c) c = c.min;
          else continue;
        s.set(p, U("@media", `(width >= ${c})`, [a("max-width", c)]));
      }
    }
    if (typeof r == "object" && r !== null) {
      let l = Object.entries(r)
        .filter(([p]) => p !== "DEFAULT")
        .map(([p, c]) => [p, e.theme.resolveValue(p, ["--breakpoint"]), c])
        .filter(Boolean);
      l.sort((p, c) => ue(p[1], c[1], "asc"));
      for (let [p, , c] of l)
        if (s && s.has(p)) s.get(p).nodes.push(a("padding-inline", c));
        else {
          if (s) continue;
          n.push(
            U("@media", `(width >= theme(--breakpoint-${p}))`, [
              a("padding-inline", c),
            ]),
          );
        }
    }
    if (s) for (let [, l] of s) n.push(l);
    return n;
  }
  function Lr({ addVariant: t, config: r }) {
    let o = r("darkMode", null),
      [e, n = ".dark"] = Array.isArray(o) ? o : [o];
    if (e === "variant") {
      let s;
      if (
        (Array.isArray(n) || typeof n == "function"
          ? (s = n)
          : typeof n == "string" && (s = [n]),
        Array.isArray(s))
      )
        for (let l of s)
          l === ".dark"
            ? ((e = !1),
              console.warn(
                'When using `variant` for `darkMode`, you must provide a selector.\nExample: `darkMode: ["variant", ".your-selector &"]`',
              ))
            : l.includes("&") ||
              ((e = !1),
              console.warn(
                'When using `variant` for `darkMode`, your selector must contain `&`.\nExample `darkMode: ["variant", ".your-selector &"]`',
              ));
      n = s;
    }
    e === null ||
      (e === "selector"
        ? t("dark", `&:where(${n}, ${n} *)`)
        : e === "media"
          ? t("dark", "@media (prefers-color-scheme: dark)")
          : e === "variant"
            ? t("dark", n)
            : e === "class" && t("dark", `&:is(${n} *)`));
  }
  function Mr(t) {
    for (let [r, o] of [
      ["t", "top"],
      ["tr", "top right"],
      ["r", "right"],
      ["br", "bottom right"],
      ["b", "bottom"],
      ["bl", "bottom left"],
      ["l", "left"],
      ["tl", "top left"],
    ])
      t.utilities.static(`bg-gradient-to-${r}`, () => [
        a("--tw-gradient-position", `to ${o} in oklab`),
        a("background-image", "linear-gradient(var(--tw-gradient-stops))"),
      ]);
    t.utilities.functional("max-w-screen", (r) => {
      if (!r.value || r.value.kind === "arbitrary") return;
      let o = t.theme.resolve(r.value.value, ["--breakpoint"]);
      if (o) return [a("max-width", o)];
    }),
      t.utilities.static("overflow-ellipsis", () => [
        a("text-overflow", "ellipsis"),
      ]),
      t.utilities.static("decoration-slice", () => [
        a("-webkit-box-decoration-break", "slice"),
        a("box-decoration-break", "slice"),
      ]),
      t.utilities.static("decoration-clone", () => [
        a("-webkit-box-decoration-break", "clone"),
        a("box-decoration-break", "clone"),
      ]),
      t.utilities.functional("flex-shrink", (r) => {
        if (!r.modifier) {
          if (!r.value) return [a("flex-shrink", "1")];
          if (r.value.kind === "arbitrary")
            return [a("flex-shrink", r.value.value)];
          if (N(r.value.value)) return [a("flex-shrink", r.value.value)];
        }
      }),
      t.utilities.functional("flex-grow", (r) => {
        if (!r.modifier) {
          if (!r.value) return [a("flex-grow", "1")];
          if (r.value.kind === "arbitrary")
            return [a("flex-grow", r.value.value)];
          if (N(r.value.value)) return [a("flex-grow", r.value.value)];
        }
      });
  }
  function Br(t, r) {
    let o = t.theme.screens || {},
      e = r.variants.get("min")?.order ?? 0,
      n = [];
    for (let [l, p] of Object.entries(o)) {
      let m = function (v) {
        r.variants.static(
          l,
          (y) => {
            y.nodes = [U("@media", g, y.nodes)];
          },
          { order: v },
        );
      };
      var s = m;
      let c = r.variants.get(l),
        d = r.theme.resolveValue(l, ["--breakpoint"]);
      if (c && d && !r.theme.hasDefault(`--breakpoint-${l}`)) continue;
      let u = !0;
      typeof p == "string" && (u = !1);
      let g = Un(p);
      u ? n.push(m) : m(e);
    }
    if (n.length !== 0) {
      for (let [, l] of r.variants.variants)
        l.order > e && (l.order += n.length);
      r.variants.compareFns = new Map(
        Array.from(r.variants.compareFns).map(
          ([l, p]) => (l > e && (l += n.length), [l, p]),
        ),
      );
      for (let [l, p] of n.entries()) p(e + l + 1);
    }
  }
  function Un(t) {
    return (Array.isArray(t) ? t : [t])
      .map((o) =>
        typeof o == "string"
          ? { min: o }
          : o && typeof o == "object"
            ? o
            : null,
      )
      .map((o) => {
        if (o === null) return null;
        if ("raw" in o) return o.raw;
        let e = "";
        return (
          o.max !== void 0 && (e += `${o.max} >= `),
          (e += "width"),
          o.min !== void 0 && (e += ` >= ${o.min}`),
          `(${e})`
        );
      })
      .filter(Boolean)
      .join(", ");
  }
  function Wr(t, r) {
    let o = t.theme.aria || {},
      e = t.theme.supports || {},
      n = t.theme.data || {};
    if (Object.keys(o).length > 0) {
      let s = r.variants.get("aria"),
        l = s?.applyFn,
        p = s?.compounds;
      r.variants.functional(
        "aria",
        (c, d) => {
          let u = d.value;
          return u && u.kind === "named" && u.value in o
            ? l?.(c, { ...d, value: { kind: "arbitrary", value: o[u.value] } })
            : l?.(c, d);
        },
        { compounds: p },
      );
    }
    if (Object.keys(e).length > 0) {
      let s = r.variants.get("supports"),
        l = s?.applyFn,
        p = s?.compounds;
      r.variants.functional(
        "supports",
        (c, d) => {
          let u = d.value;
          return u && u.kind === "named" && u.value in e
            ? l?.(c, { ...d, value: { kind: "arbitrary", value: e[u.value] } })
            : l?.(c, d);
        },
        { compounds: p },
      );
    }
    if (Object.keys(n).length > 0) {
      let s = r.variants.get("data"),
        l = s?.applyFn,
        p = s?.compounds;
      r.variants.functional(
        "data",
        (c, d) => {
          let u = d.value;
          return u && u.kind === "named" && u.value in n
            ? l?.(c, { ...d, value: { kind: "arbitrary", value: n[u.value] } })
            : l?.(c, d);
        },
        { compounds: p },
      );
    }
  }
  var _n = /^[a-z]+$/;
  async function Hr({
    designSystem: t,
    base: r,
    ast: o,
    loadModule: e,
    globs: n,
  }) {
    let s = 0,
      l = [],
      p = [];
    _(o, (g, { parent: m, replaceWith: v, context: y }) => {
      if (g.kind === "at-rule") {
        if (g.name === "@plugin") {
          if (m !== null) throw new Error("`@plugin` cannot be nested.");
          let b = g.params.slice(1, -1);
          if (b.length === 0) throw new Error("`@plugin` must have a path.");
          let x = {};
          for (let $ of g.nodes ?? []) {
            if ($.kind !== "declaration")
              throw new Error(`Unexpected \`@plugin\` option:

${Y([$])}

\`@plugin\` options must be a flat list of declarations.`);
            if ($.value === void 0) continue;
            let V = $.value,
              O = P(V, ",").map((R) => {
                if (((R = R.trim()), R === "null")) return null;
                if (R === "true") return !0;
                if (R === "false") return !1;
                if (Number.isNaN(Number(R))) {
                  if (
                    (R[0] === '"' && R[R.length - 1] === '"') ||
                    (R[0] === "'" && R[R.length - 1] === "'")
                  )
                    return R.slice(1, -1);
                  if (R[0] === "{" && R[R.length - 1] === "}")
                    throw new Error(`Unexpected \`@plugin\` option: Value of declaration \`${Y([$]).trim()}\` is not supported.

Using an object as a plugin option is currently only supported in JavaScript configuration files.`);
                } else return Number(R);
                return R;
              });
            x[$.property] = O.length === 1 ? O[0] : O;
          }
          l.push([
            { id: b, base: y.base, reference: !!y.reference },
            Object.keys(x).length > 0 ? x : null,
          ]),
            v([]),
            (s |= 4);
          return;
        }
        if (g.name === "@config") {
          if (g.nodes.length > 0)
            throw new Error("`@config` cannot have a body.");
          if (m !== null) throw new Error("`@config` cannot be nested.");
          p.push({
            id: g.params.slice(1, -1),
            base: y.base,
            reference: !!y.reference,
          }),
            v([]),
            (s |= 4);
          return;
        }
      }
    }),
      Mr(t);
    let c = t.resolveThemeValue;
    if (
      ((t.resolveThemeValue = function (m) {
        return m.startsWith("--")
          ? c(m)
          : ((s |= qr({
              designSystem: t,
              base: r,
              ast: o,
              globs: n,
              configs: [],
              pluginDetails: [],
            })),
            t.resolveThemeValue(m));
      }),
      !l.length && !p.length)
    )
      return 0;
    let [d, u] = await Promise.all([
      Promise.all(
        p.map(async ({ id: g, base: m, reference: v }) => {
          let y = await e(g, m, "config");
          return { path: g, base: y.base, config: y.module, reference: v };
        }),
      ),
      Promise.all(
        l.map(async ([{ id: g, base: m, reference: v }, y]) => {
          let b = await e(g, m, "plugin");
          return {
            path: g,
            base: b.base,
            plugin: b.module,
            options: y,
            reference: v,
          };
        }),
      ),
    ]);
    return (
      (s |= qr({
        designSystem: t,
        base: r,
        ast: o,
        globs: n,
        configs: d,
        pluginDetails: u,
      })),
      s
    );
  }
  function qr({
    designSystem: t,
    base: r,
    ast: o,
    globs: e,
    configs: n,
    pluginDetails: s,
  }) {
    let l = 0,
      c = [
        ...s.map((b) => {
          if (!b.options)
            return {
              config: { plugins: [b.plugin] },
              base: b.base,
              reference: b.reference,
            };
          if ("__isOptionsFunction" in b.plugin)
            return {
              config: { plugins: [b.plugin(b.options)] },
              base: b.base,
              reference: b.reference,
            };
          throw new Error(`The plugin "${b.path}" does not accept options`);
        }),
        ...n,
      ],
      { resolvedConfig: d } = At(t, [
        { config: jr(t.theme), base: r, reference: !0 },
        ...c,
        { config: { plugins: [Lr] }, base: r, reference: !0 },
      ]),
      { resolvedConfig: u, replacedThemeKeys: g } = At(t, c);
    t.resolveThemeValue = function (x, $) {
      let V = v.theme(x, $);
      if (Array.isArray(V) && V.length === 2) return V[0];
      if (Array.isArray(V)) return V.join(", ");
      if (typeof V == "string") return V;
    };
    let m = {
        designSystem: t,
        ast: o,
        resolvedConfig: d,
        featuresRef: {
          set current(b) {
            l |= b;
          },
        },
      },
      v = wt({ ...m, referenceMode: !1 }),
      y;
    for (let { handler: b, reference: x } of d.plugins)
      x ? ((y ||= wt({ ...m, referenceMode: !0 })), b(y)) : b(v);
    if (
      (yr(t, u, g),
      _r(t, u, g),
      Wr(u, t),
      Br(u, t),
      Ir(u, t),
      !t.theme.prefix && d.prefix)
    ) {
      if (
        (d.prefix.endsWith("-") &&
          ((d.prefix = d.prefix.slice(0, -1)),
          console.warn(
            `The prefix "${d.prefix}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only and is written as a variant before all utilities. We have fixed up the prefix for you. Remove the trailing \`-\` to silence this warning.`,
          )),
        !_n.test(d.prefix))
      )
        throw new Error(
          `The prefix "${d.prefix}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.`,
        );
      t.theme.prefix = d.prefix;
    }
    if (
      (!t.important && d.important === !0 && (t.important = !0),
      typeof d.important == "string")
    ) {
      let b = d.important;
      _(o, (x, { replaceWith: $, parent: V }) => {
        if (
          x.kind === "at-rule" &&
          !(x.name !== "@tailwind" || x.params !== "utilities")
        )
          return V?.kind === "rule" && V.selector === b ? 2 : ($(z(b, [x])), 2);
      });
    }
    for (let b of d.blocklist) t.invalidCandidates.add(b);
    for (let b of d.content.files) {
      if ("raw" in b)
        throw new Error(`Error in the config file/plugin/preset. The \`content\` key contains a \`raw\` entry:

${JSON.stringify(b, null, 2)}

This feature is not currently supported.`);
      e.push(b);
    }
    return l;
  }
  var Dn = /^[a-z]+$/;
  function zn() {
    throw new Error("No `loadModule` function provided to `compile`");
  }
  function Fn() {
    throw new Error("No `loadStylesheet` function provided to `compile`");
  }
  function jn(t) {
    let r = 0,
      o = null;
    for (let e of P(t, " "))
      e === "reference"
        ? (r |= 2)
        : e === "inline"
          ? (r |= 1)
          : e === "default"
            ? (r |= 4)
            : e === "static"
              ? (r |= 8)
              : e.startsWith("prefix(") &&
                e.endsWith(")") &&
                (o = e.slice(7, -1));
    return [r, o];
  }
  async function In(
    t,
    { base: r = "", loadModule: o = zn, loadStylesheet: e = Fn } = {},
  ) {
    let n = 0;
    (t = [Q({ base: r }, t)]), (n |= await kt(t, r, e));
    let s = null,
      l = new ze(),
      p = [],
      c = [],
      d = null,
      u = null,
      g = [],
      m = [],
      v = null;
    _(t, (b, { parent: x, replaceWith: $, context: V }) => {
      if (b.kind === "at-rule") {
        if (
          b.name === "@tailwind" &&
          (b.params === "utilities" || b.params.startsWith("utilities"))
        ) {
          if (u !== null) {
            $([]);
            return;
          }
          let O = P(b.params, " ");
          for (let R of O)
            if (R.startsWith("source(")) {
              let K = R.slice(7, -1);
              if (K === "none") {
                v = K;
                continue;
              }
              if (
                (K[0] === '"' && K[K.length - 1] !== '"') ||
                (K[0] === "'" && K[K.length - 1] !== "'") ||
                (K[0] !== "'" && K[0] !== '"')
              )
                throw new Error("`source(\u2026)` paths must be quoted.");
              v = { base: V.sourceBase ?? V.base, pattern: K.slice(1, -1) };
            }
          (u = b), (n |= 16);
        }
        if (b.name === "@utility") {
          if (x !== null) throw new Error("`@utility` cannot be nested.");
          if (b.nodes.length === 0)
            throw new Error(
              `\`@utility ${b.params}\` is empty. Utilities should include at least one property.`,
            );
          let O = nr(b);
          if (O === null)
            throw new Error(
              `\`@utility ${b.params}\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter.`,
            );
          c.push(O);
        }
        if (b.name === "@source") {
          if (b.nodes.length > 0)
            throw new Error("`@source` cannot have a body.");
          if (x !== null) throw new Error("`@source` cannot be nested.");
          let O = b.params;
          if (
            (O[0] === '"' && O[O.length - 1] !== '"') ||
            (O[0] === "'" && O[O.length - 1] !== "'") ||
            (O[0] !== "'" && O[0] !== '"')
          )
            throw new Error("`@source` paths must be quoted.");
          m.push({ base: V.base, pattern: O.slice(1, -1) }), $([]);
          return;
        }
        if (
          (b.name === "@variant" &&
            (x === null
              ? b.nodes.length === 0
                ? (b.name = "@custom-variant")
                : (_(b.nodes, (O) => {
                    if (O.kind === "at-rule" && O.name === "@slot")
                      return (b.name = "@custom-variant"), 2;
                  }),
                  b.name === "@variant" && g.push(b))
              : g.push(b)),
          b.name === "@custom-variant")
        ) {
          if (x !== null)
            throw new Error("`@custom-variant` cannot be nested.");
          $([]);
          let [O, R] = P(b.params, " ");
          if (!We.test(O))
            throw new Error(
              `\`@custom-variant ${O}\` defines an invalid variant name. Variants should only contain alphanumeric, dashes or underscore characters.`,
            );
          if (b.nodes.length > 0 && R)
            throw new Error(
              `\`@custom-variant ${O}\` cannot have both a selector and a body.`,
            );
          if (b.nodes.length === 0) {
            if (!R)
              throw new Error(
                `\`@custom-variant ${O}\` has no selector or body.`,
              );
            let K = P(R.slice(1, -1), ",");
            if (K.length === 0 || K.some((h) => h.trim() === ""))
              throw new Error(
                `\`@custom-variant ${O} (${K.join(",")})\` selector is invalid.`,
              );
            let i = [],
              f = [];
            for (let h of K)
              (h = h.trim()), h[0] === "@" ? i.push(h) : f.push(h);
            p.push((h) => {
              h.variants.static(
                O,
                (w) => {
                  let k = [];
                  f.length > 0 && k.push(z(f.join(", "), w.nodes));
                  for (let T of i) k.push(M(T, w.nodes));
                  w.nodes = k;
                },
                { compounds: fe([...f, ...i]) },
              );
            });
            return;
          } else {
            p.push((K) => {
              K.variants.fromAst(O, b.nodes);
            });
            return;
          }
        }
        if (b.name === "@media") {
          let O = P(b.params, " "),
            R = [];
          for (let K of O)
            if (K.startsWith("source(")) {
              let i = K.slice(7, -1);
              _(b.nodes, (f, { replaceWith: h }) => {
                if (
                  f.kind === "at-rule" &&
                  f.name === "@tailwind" &&
                  f.params === "utilities"
                )
                  return (
                    (f.params += ` source(${i})`),
                    h([Q({ sourceBase: V.base }, [f])]),
                    2
                  );
              });
            } else if (K.startsWith("theme(")) {
              let i = K.slice(6, -1),
                f = i.includes("reference");
              _(b.nodes, (h) => {
                if (h.kind !== "at-rule") {
                  if (f)
                    throw new Error(
                      'Files imported with `@import "\u2026" theme(reference)` must only contain `@theme` blocks.\nUse `@reference "\u2026";` instead.',
                    );
                  return 0;
                }
                if (h.name === "@theme") return (h.params += " " + i), 1;
              });
            } else if (K.startsWith("prefix(")) {
              let i = K.slice(7, -1);
              _(b.nodes, (f) => {
                if (f.kind === "at-rule" && f.name === "@theme")
                  return (f.params += ` prefix(${i})`), 1;
              });
            } else
              K === "important"
                ? (s = !0)
                : K === "reference"
                  ? (b.nodes = [Q({ reference: !0 }, b.nodes)])
                  : R.push(K);
          R.length > 0 ? (b.params = R.join(" ")) : O.length > 0 && $(b.nodes);
        }
        if (b.name === "@theme") {
          let [O, R] = jn(b.params);
          if ((V.reference && (O |= 2), R)) {
            if (!Dn.test(R))
              throw new Error(
                `The prefix "${R}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.`,
              );
            l.prefix = R;
          }
          return (
            _(b.nodes, (K) => {
              if (K.kind === "at-rule" && K.name === "@keyframes")
                return l.addKeyframes(K), 1;
              if (K.kind === "comment") return;
              if (K.kind === "declaration" && K.property.startsWith("--")) {
                l.add(ae(K.property), K.value ?? "", O);
                return;
              }
              let i = Y([U(b.name, b.params, [K])])
                .split(
                  `
`,
                )
                .map(
                  (f, h, w) =>
                    `${h === 0 || h >= w.length - 2 ? " " : ">"} ${f}`,
                ).join(`
`);
              throw new Error(`\`@theme\` blocks must only contain custom properties or \`@keyframes\`.

${i}`);
            }),
            d ? $([]) : ((d = z(":root, :host", [])), $([d])),
            1
          );
        }
      }
    });
    let y = pr(l);
    s && (y.important = s),
      (n |= await Hr({
        designSystem: y,
        base: r,
        ast: t,
        loadModule: o,
        globs: m,
      }));
    for (let b of p) b(y);
    for (let b of c) b(y);
    if (d) {
      let b = [];
      for (let [$, V] of y.theme.entries())
        V.options & 2 || b.push(a(re($), V.value));
      let x = y.theme.getKeyframes();
      for (let $ of x) t.push(Q({ theme: !0 }, [D([$])]));
      d.nodes = [Q({ theme: !0 }, b)];
    }
    if (u) {
      let b = u;
      (b.kind = "context"), (b.context = {});
    }
    if (g.length > 0) {
      for (let b of g) {
        let x = z("&", b.nodes),
          $ = b.params,
          V = y.parseVariant($);
        if (V === null)
          throw new Error(`Cannot use \`@variant\` with unknown variant: ${$}`);
        if (be(x, V, y.variants) === null)
          throw new Error(`Cannot use \`@variant\` with variant: ${$}`);
        Object.assign(b, x);
      }
      n |= 32;
    }
    return (
      (n |= he(t, y)),
      (n |= Ne(t, y)),
      _(t, (b, { replaceWith: x }) => {
        if (b.kind === "at-rule") return b.name === "@utility" && x([]), 1;
      }),
      {
        designSystem: y,
        ast: t,
        globs: m,
        root: v,
        utilitiesNode: u,
        features: n,
      }
    );
  }
  async function Ln(t, r = {}) {
    let {
      designSystem: o,
      ast: e,
      globs: n,
      root: s,
      utilitiesNode: l,
      features: p,
    } = await In(t, r);
    e.unshift(
      De(`! tailwindcss v${$t} | MIT License | https://tailwindcss.com `),
    );
    function c(m) {
      o.invalidCandidates.add(m);
    }
    let d = new Set(),
      u = null,
      g = 0;
    return {
      globs: n,
      root: s,
      features: p,
      build(m) {
        if (p === 0) return t;
        if (!l) return (u ??= se(e, o)), u;
        let v = !1,
          y = d.size;
        for (let x of m)
          o.invalidCandidates.has(x) ||
            (x[0] === "-" && x[1] === "-"
              ? o.theme.markUsedVariable(x)
              : d.add(x),
            (v ||= d.size !== y));
        if (!v) return (u ??= se(e, o)), u;
        let b = ne(d, o, { onInvalidCandidate: c }).astNodes;
        return g === b.length
          ? ((u ??= se(e, o)), u)
          : ((g = b.length), (l.nodes = b), (u = se(e, o)), u);
      },
    };
  }
  async function Gr(t, r = {}) {
    let o = pe(t),
      e = await Ln(o, r),
      n = o,
      s = t;
    return {
      ...e,
      build(l) {
        let p = e.build(l);
        return p === n || ((s = Y(p)), (n = p)), s;
      },
    };
  }
  var Yr = `@layer theme, base, components, utilities;

@import './theme.css' layer(theme);
@import './preflight.css' layer(base);
@import './utilities.css' layer(utilities);
`;
  var Jr = `/*
  1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
  2. Remove default margins and padding
  3. Reset all borders.
*/

*,
::after,
::before,
::backdrop,
::file-selector-button {
  box-sizing: border-box; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 2 */
  border: 0 solid; /* 3 */
}

/*
  1. Use a consistent sensible line-height in all browsers.
  2. Prevent adjustments of font size after orientation changes in iOS.
  3. Use a more readable tab size.
  4. Use the user's configured \`sans\` font-family by default.
  5. Use the user's configured \`sans\` font-feature-settings by default.
  6. Use the user's configured \`sans\` font-variation-settings by default.
  7. Disable tap highlights on iOS.
*/

html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  tab-size: 4; /* 3 */
  font-family: var(
    --default-font-family,
    ui-sans-serif,
    system-ui,
    sans-serif,
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji'
  ); /* 4 */
  font-feature-settings: var(--default-font-feature-settings, normal); /* 5 */
  font-variation-settings: var(--default-font-variation-settings, normal); /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}

/*
  Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  line-height: inherit;
}

/*
  1. Add the correct height in Firefox.
  2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
  3. Reset the default border style to a 1px solid border.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
  Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}

/*
  Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
  Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  -webkit-text-decoration: inherit;
  text-decoration: inherit;
}

/*
  Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
  1. Use the user's configured \`mono\` font-family by default.
  2. Use the user's configured \`mono\` font-feature-settings by default.
  3. Use the user's configured \`mono\` font-variation-settings by default.
  4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: var(
    --default-mono-font-family,
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace
  ); /* 1 */
  font-feature-settings: var(--default-mono-font-feature-settings, normal); /* 2 */
  font-variation-settings: var(--default-mono-font-variation-settings, normal); /* 3 */
  font-size: 1em; /* 4 */
}

/*
  Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
  Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
  1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
  2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
  3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
  Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
  Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
  Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
  Make lists unstyled by default.
*/

ol,
ul,
menu {
  list-style: none;
}

/*
  1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
  2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
      This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
  Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/*
  1. Inherit font styles in all browsers.
  2. Remove border radius in all browsers.
  3. Remove background color in all browsers.
  4. Ensure consistent opacity for disabled states in all browsers.
*/

button,
input,
select,
optgroup,
textarea,
::file-selector-button {
  font: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  letter-spacing: inherit; /* 1 */
  color: inherit; /* 1 */
  border-radius: 0; /* 2 */
  background-color: transparent; /* 3 */
  opacity: 1; /* 4 */
}

/*
  Restore default font weight.
*/

:where(select:is([multiple], [size])) optgroup {
  font-weight: bolder;
}

/*
  Restore indentation.
*/

:where(select:is([multiple], [size])) optgroup option {
  padding-inline-start: 20px;
}

/*
  Restore space after button.
*/

::file-selector-button {
  margin-inline-end: 4px;
}

/*
  1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
  2. Set the default placeholder color to a semi-transparent version of the current text color.
*/

::placeholder {
  opacity: 1; /* 1 */
  color: color-mix(in oklab, currentColor 50%, transparent); /* 2 */
}

/*
  Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
  Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
  1. Ensure date/time inputs have the same height when empty in iOS Safari.
  2. Ensure text alignment can be changed on date/time inputs in iOS Safari.
*/

::-webkit-date-and-time-value {
  min-height: 1lh; /* 1 */
  text-align: inherit; /* 2 */
}

/*
  Prevent height from changing on date/time inputs in macOS Safari when the input is set to \`display: block\`.
*/

::-webkit-datetime-edit {
  display: inline-flex;
}

/*
  Remove excess padding from pseudo-elements in date/time inputs to ensure consistent height across browsers.
*/

::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

::-webkit-datetime-edit,
::-webkit-datetime-edit-year-field,
::-webkit-datetime-edit-month-field,
::-webkit-datetime-edit-day-field,
::-webkit-datetime-edit-hour-field,
::-webkit-datetime-edit-minute-field,
::-webkit-datetime-edit-second-field,
::-webkit-datetime-edit-millisecond-field,
::-webkit-datetime-edit-meridiem-field {
  padding-block: 0;
}

/*
  Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
  Correct the inability to style the border radius in iOS Safari.
*/

button,
input:where([type='button'], [type='reset'], [type='submit']),
::file-selector-button {
  appearance: button;
}

/*
  Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
  Make elements with the HTML hidden attribute stay hidden by default.
*/

[hidden]:where(:not([hidden='until-found'])) {
  display: none !important;
}
`;
  var Zr = `@theme default {
  --font-sans:
    ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;

  --color-red-50: oklch(0.971 0.013 17.38);
  --color-red-100: oklch(0.936 0.032 17.717);
  --color-red-200: oklch(0.885 0.062 18.334);
  --color-red-300: oklch(0.808 0.114 19.571);
  --color-red-400: oklch(0.704 0.191 22.216);
  --color-red-500: oklch(0.637 0.237 25.331);
  --color-red-600: oklch(0.577 0.245 27.325);
  --color-red-700: oklch(0.505 0.213 27.518);
  --color-red-800: oklch(0.444 0.177 26.899);
  --color-red-900: oklch(0.396 0.141 25.723);
  --color-red-950: oklch(0.258 0.092 26.042);

  --color-orange-50: oklch(0.98 0.016 73.684);
  --color-orange-100: oklch(0.954 0.038 75.164);
  --color-orange-200: oklch(0.901 0.076 70.697);
  --color-orange-300: oklch(0.837 0.128 66.29);
  --color-orange-400: oklch(0.75 0.183 55.934);
  --color-orange-500: oklch(0.705 0.213 47.604);
  --color-orange-600: oklch(0.646 0.222 41.116);
  --color-orange-700: oklch(0.553 0.195 38.402);
  --color-orange-800: oklch(0.47 0.157 37.304);
  --color-orange-900: oklch(0.408 0.123 38.172);
  --color-orange-950: oklch(0.266 0.079 36.259);

  --color-amber-50: oklch(0.987 0.022 95.277);
  --color-amber-100: oklch(0.962 0.059 95.617);
  --color-amber-200: oklch(0.924 0.12 95.746);
  --color-amber-300: oklch(0.879 0.169 91.605);
  --color-amber-400: oklch(0.828 0.189 84.429);
  --color-amber-500: oklch(0.769 0.188 70.08);
  --color-amber-600: oklch(0.666 0.179 58.318);
  --color-amber-700: oklch(0.555 0.163 48.998);
  --color-amber-800: oklch(0.473 0.137 46.201);
  --color-amber-900: oklch(0.414 0.112 45.904);
  --color-amber-950: oklch(0.279 0.077 45.635);

  --color-yellow-50: oklch(0.987 0.026 102.212);
  --color-yellow-100: oklch(0.973 0.071 103.193);
  --color-yellow-200: oklch(0.945 0.129 101.54);
  --color-yellow-300: oklch(0.905 0.182 98.111);
  --color-yellow-400: oklch(0.852 0.199 91.936);
  --color-yellow-500: oklch(0.795 0.184 86.047);
  --color-yellow-600: oklch(0.681 0.162 75.834);
  --color-yellow-700: oklch(0.554 0.135 66.442);
  --color-yellow-800: oklch(0.476 0.114 61.907);
  --color-yellow-900: oklch(0.421 0.095 57.708);
  --color-yellow-950: oklch(0.286 0.066 53.813);

  --color-lime-50: oklch(0.986 0.031 120.757);
  --color-lime-100: oklch(0.967 0.067 122.328);
  --color-lime-200: oklch(0.938 0.127 124.321);
  --color-lime-300: oklch(0.897 0.196 126.665);
  --color-lime-400: oklch(0.841 0.238 128.85);
  --color-lime-500: oklch(0.768 0.233 130.85);
  --color-lime-600: oklch(0.648 0.2 131.684);
  --color-lime-700: oklch(0.532 0.157 131.589);
  --color-lime-800: oklch(0.453 0.124 130.933);
  --color-lime-900: oklch(0.405 0.101 131.063);
  --color-lime-950: oklch(0.274 0.072 132.109);

  --color-green-50: oklch(0.982 0.018 155.826);
  --color-green-100: oklch(0.962 0.044 156.743);
  --color-green-200: oklch(0.925 0.084 155.995);
  --color-green-300: oklch(0.871 0.15 154.449);
  --color-green-400: oklch(0.792 0.209 151.711);
  --color-green-500: oklch(0.723 0.219 149.579);
  --color-green-600: oklch(0.627 0.194 149.214);
  --color-green-700: oklch(0.527 0.154 150.069);
  --color-green-800: oklch(0.448 0.119 151.328);
  --color-green-900: oklch(0.393 0.095 152.535);
  --color-green-950: oklch(0.266 0.065 152.934);

  --color-emerald-50: oklch(0.979 0.021 166.113);
  --color-emerald-100: oklch(0.95 0.052 163.051);
  --color-emerald-200: oklch(0.905 0.093 164.15);
  --color-emerald-300: oklch(0.845 0.143 164.978);
  --color-emerald-400: oklch(0.765 0.177 163.223);
  --color-emerald-500: oklch(0.696 0.17 162.48);
  --color-emerald-600: oklch(0.596 0.145 163.225);
  --color-emerald-700: oklch(0.508 0.118 165.612);
  --color-emerald-800: oklch(0.432 0.095 166.913);
  --color-emerald-900: oklch(0.378 0.077 168.94);
  --color-emerald-950: oklch(0.262 0.051 172.552);

  --color-teal-50: oklch(0.984 0.014 180.72);
  --color-teal-100: oklch(0.953 0.051 180.801);
  --color-teal-200: oklch(0.91 0.096 180.426);
  --color-teal-300: oklch(0.855 0.138 181.071);
  --color-teal-400: oklch(0.777 0.152 181.912);
  --color-teal-500: oklch(0.704 0.14 182.503);
  --color-teal-600: oklch(0.6 0.118 184.704);
  --color-teal-700: oklch(0.511 0.096 186.391);
  --color-teal-800: oklch(0.437 0.078 188.216);
  --color-teal-900: oklch(0.386 0.063 188.416);
  --color-teal-950: oklch(0.277 0.046 192.524);

  --color-cyan-50: oklch(0.984 0.019 200.873);
  --color-cyan-100: oklch(0.956 0.045 203.388);
  --color-cyan-200: oklch(0.917 0.08 205.041);
  --color-cyan-300: oklch(0.865 0.127 207.078);
  --color-cyan-400: oklch(0.789 0.154 211.53);
  --color-cyan-500: oklch(0.715 0.143 215.221);
  --color-cyan-600: oklch(0.609 0.126 221.723);
  --color-cyan-700: oklch(0.52 0.105 223.128);
  --color-cyan-800: oklch(0.45 0.085 224.283);
  --color-cyan-900: oklch(0.398 0.07 227.392);
  --color-cyan-950: oklch(0.302 0.056 229.695);

  --color-sky-50: oklch(0.977 0.013 236.62);
  --color-sky-100: oklch(0.951 0.026 236.824);
  --color-sky-200: oklch(0.901 0.058 230.902);
  --color-sky-300: oklch(0.828 0.111 230.318);
  --color-sky-400: oklch(0.746 0.16 232.661);
  --color-sky-500: oklch(0.685 0.169 237.323);
  --color-sky-600: oklch(0.588 0.158 241.966);
  --color-sky-700: oklch(0.5 0.134 242.749);
  --color-sky-800: oklch(0.443 0.11 240.79);
  --color-sky-900: oklch(0.391 0.09 240.876);
  --color-sky-950: oklch(0.293 0.066 243.157);

  --color-blue-50: oklch(0.97 0.014 254.604);
  --color-blue-100: oklch(0.932 0.032 255.585);
  --color-blue-200: oklch(0.882 0.059 254.128);
  --color-blue-300: oklch(0.809 0.105 251.813);
  --color-blue-400: oklch(0.707 0.165 254.624);
  --color-blue-500: oklch(0.623 0.214 259.815);
  --color-blue-600: oklch(0.546 0.245 262.881);
  --color-blue-700: oklch(0.488 0.243 264.376);
  --color-blue-800: oklch(0.424 0.199 265.638);
  --color-blue-900: oklch(0.379 0.146 265.522);
  --color-blue-950: oklch(0.282 0.091 267.935);

  --color-indigo-50: oklch(0.962 0.018 272.314);
  --color-indigo-100: oklch(0.93 0.034 272.788);
  --color-indigo-200: oklch(0.87 0.065 274.039);
  --color-indigo-300: oklch(0.785 0.115 274.713);
  --color-indigo-400: oklch(0.673 0.182 276.935);
  --color-indigo-500: oklch(0.585 0.233 277.117);
  --color-indigo-600: oklch(0.511 0.262 276.966);
  --color-indigo-700: oklch(0.457 0.24 277.023);
  --color-indigo-800: oklch(0.398 0.195 277.366);
  --color-indigo-900: oklch(0.359 0.144 278.697);
  --color-indigo-950: oklch(0.257 0.09 281.288);

  --color-violet-50: oklch(0.969 0.016 293.756);
  --color-violet-100: oklch(0.943 0.029 294.588);
  --color-violet-200: oklch(0.894 0.057 293.283);
  --color-violet-300: oklch(0.811 0.111 293.571);
  --color-violet-400: oklch(0.702 0.183 293.541);
  --color-violet-500: oklch(0.606 0.25 292.717);
  --color-violet-600: oklch(0.541 0.281 293.009);
  --color-violet-700: oklch(0.491 0.27 292.581);
  --color-violet-800: oklch(0.432 0.232 292.759);
  --color-violet-900: oklch(0.38 0.189 293.745);
  --color-violet-950: oklch(0.283 0.141 291.089);

  --color-purple-50: oklch(0.977 0.014 308.299);
  --color-purple-100: oklch(0.946 0.033 307.174);
  --color-purple-200: oklch(0.902 0.063 306.703);
  --color-purple-300: oklch(0.827 0.119 306.383);
  --color-purple-400: oklch(0.714 0.203 305.504);
  --color-purple-500: oklch(0.627 0.265 303.9);
  --color-purple-600: oklch(0.558 0.288 302.321);
  --color-purple-700: oklch(0.496 0.265 301.924);
  --color-purple-800: oklch(0.438 0.218 303.724);
  --color-purple-900: oklch(0.381 0.176 304.987);
  --color-purple-950: oklch(0.291 0.149 302.717);

  --color-fuchsia-50: oklch(0.977 0.017 320.058);
  --color-fuchsia-100: oklch(0.952 0.037 318.852);
  --color-fuchsia-200: oklch(0.903 0.076 319.62);
  --color-fuchsia-300: oklch(0.833 0.145 321.434);
  --color-fuchsia-400: oklch(0.74 0.238 322.16);
  --color-fuchsia-500: oklch(0.667 0.295 322.15);
  --color-fuchsia-600: oklch(0.591 0.293 322.896);
  --color-fuchsia-700: oklch(0.518 0.253 323.949);
  --color-fuchsia-800: oklch(0.452 0.211 324.591);
  --color-fuchsia-900: oklch(0.401 0.17 325.612);
  --color-fuchsia-950: oklch(0.293 0.136 325.661);

  --color-pink-50: oklch(0.971 0.014 343.198);
  --color-pink-100: oklch(0.948 0.028 342.258);
  --color-pink-200: oklch(0.899 0.061 343.231);
  --color-pink-300: oklch(0.823 0.12 346.018);
  --color-pink-400: oklch(0.718 0.202 349.761);
  --color-pink-500: oklch(0.656 0.241 354.308);
  --color-pink-600: oklch(0.592 0.249 0.584);
  --color-pink-700: oklch(0.525 0.223 3.958);
  --color-pink-800: oklch(0.459 0.187 3.815);
  --color-pink-900: oklch(0.408 0.153 2.432);
  --color-pink-950: oklch(0.284 0.109 3.907);

  --color-rose-50: oklch(0.969 0.015 12.422);
  --color-rose-100: oklch(0.941 0.03 12.58);
  --color-rose-200: oklch(0.892 0.058 10.001);
  --color-rose-300: oklch(0.81 0.117 11.638);
  --color-rose-400: oklch(0.712 0.194 13.428);
  --color-rose-500: oklch(0.645 0.246 16.439);
  --color-rose-600: oklch(0.586 0.253 17.585);
  --color-rose-700: oklch(0.514 0.222 16.935);
  --color-rose-800: oklch(0.455 0.188 13.697);
  --color-rose-900: oklch(0.41 0.159 10.272);
  --color-rose-950: oklch(0.271 0.105 12.094);

  --color-slate-50: oklch(0.984 0.003 247.858);
  --color-slate-100: oklch(0.968 0.007 247.896);
  --color-slate-200: oklch(0.929 0.013 255.508);
  --color-slate-300: oklch(0.869 0.022 252.894);
  --color-slate-400: oklch(0.704 0.04 256.788);
  --color-slate-500: oklch(0.554 0.046 257.417);
  --color-slate-600: oklch(0.446 0.043 257.281);
  --color-slate-700: oklch(0.372 0.044 257.287);
  --color-slate-800: oklch(0.279 0.041 260.031);
  --color-slate-900: oklch(0.208 0.042 265.755);
  --color-slate-950: oklch(0.129 0.042 264.695);

  --color-gray-50: oklch(0.985 0.002 247.839);
  --color-gray-100: oklch(0.967 0.003 264.542);
  --color-gray-200: oklch(0.928 0.006 264.531);
  --color-gray-300: oklch(0.872 0.01 258.338);
  --color-gray-400: oklch(0.707 0.022 261.325);
  --color-gray-500: oklch(0.551 0.027 264.364);
  --color-gray-600: oklch(0.446 0.03 256.802);
  --color-gray-700: oklch(0.373 0.034 259.733);
  --color-gray-800: oklch(0.278 0.033 256.848);
  --color-gray-900: oklch(0.21 0.034 264.665);
  --color-gray-950: oklch(0.13 0.028 261.692);

  --color-zinc-50: oklch(0.985 0 0);
  --color-zinc-100: oklch(0.967 0.001 286.375);
  --color-zinc-200: oklch(0.92 0.004 286.32);
  --color-zinc-300: oklch(0.871 0.006 286.286);
  --color-zinc-400: oklch(0.705 0.015 286.067);
  --color-zinc-500: oklch(0.552 0.016 285.938);
  --color-zinc-600: oklch(0.442 0.017 285.786);
  --color-zinc-700: oklch(0.37 0.013 285.805);
  --color-zinc-800: oklch(0.274 0.006 286.033);
  --color-zinc-900: oklch(0.21 0.006 285.885);
  --color-zinc-950: oklch(0.141 0.005 285.823);

  --color-neutral-50: oklch(0.985 0 0);
  --color-neutral-100: oklch(0.97 0 0);
  --color-neutral-200: oklch(0.922 0 0);
  --color-neutral-300: oklch(0.87 0 0);
  --color-neutral-400: oklch(0.708 0 0);
  --color-neutral-500: oklch(0.556 0 0);
  --color-neutral-600: oklch(0.439 0 0);
  --color-neutral-700: oklch(0.371 0 0);
  --color-neutral-800: oklch(0.269 0 0);
  --color-neutral-900: oklch(0.205 0 0);
  --color-neutral-950: oklch(0.145 0 0);

  --color-stone-50: oklch(0.985 0.001 106.423);
  --color-stone-100: oklch(0.97 0.001 106.424);
  --color-stone-200: oklch(0.923 0.003 48.717);
  --color-stone-300: oklch(0.869 0.005 56.366);
  --color-stone-400: oklch(0.709 0.01 56.259);
  --color-stone-500: oklch(0.553 0.013 58.071);
  --color-stone-600: oklch(0.444 0.011 73.639);
  --color-stone-700: oklch(0.374 0.01 67.558);
  --color-stone-800: oklch(0.268 0.007 34.298);
  --color-stone-900: oklch(0.216 0.006 56.043);
  --color-stone-950: oklch(0.147 0.004 49.25);

  --color-black: #000;
  --color-white: #fff;

  --spacing: 0.25rem;

  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 96rem;

  --container-3xs: 16rem;
  --container-2xs: 18rem;
  --container-xs: 20rem;
  --container-sm: 24rem;
  --container-md: 28rem;
  --container-lg: 32rem;
  --container-xl: 36rem;
  --container-2xl: 42rem;
  --container-3xl: 48rem;
  --container-4xl: 56rem;
  --container-5xl: 64rem;
  --container-6xl: 72rem;
  --container-7xl: 80rem;

  --text-xs: 0.75rem;
  --text-xs--line-height: calc(1 / 0.75);
  --text-sm: 0.875rem;
  --text-sm--line-height: calc(1.25 / 0.875);
  --text-base: 1rem;
  --text-base--line-height: calc(1.5 / 1);
  --text-lg: 1.125rem;
  --text-lg--line-height: calc(1.75 / 1.125);
  --text-xl: 1.25rem;
  --text-xl--line-height: calc(1.75 / 1.25);
  --text-2xl: 1.5rem;
  --text-2xl--line-height: calc(2 / 1.5);
  --text-3xl: 1.875rem;
  --text-3xl--line-height: calc(2.25 / 1.875);
  --text-4xl: 2.25rem;
  --text-4xl--line-height: calc(2.5 / 2.25);
  --text-5xl: 3rem;
  --text-5xl--line-height: 1;
  --text-6xl: 3.75rem;
  --text-6xl--line-height: 1;
  --text-7xl: 4.5rem;
  --text-7xl--line-height: 1;
  --text-8xl: 6rem;
  --text-8xl--line-height: 1;
  --text-9xl: 8rem;
  --text-9xl--line-height: 1;

  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;

  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  --radius-xs: 0.125rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-4xl: 2rem;

  --shadow-2xs: 0 1px rgb(0 0 0 / 0.05);
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  --inset-shadow-2xs: inset 0 1px rgb(0 0 0 / 0.05);
  --inset-shadow-xs: inset 0 1px 1px rgb(0 0 0 / 0.05);
  --inset-shadow-sm: inset 0 2px 4px rgb(0 0 0 / 0.05);

  --drop-shadow-xs: 0 1px 1px rgb(0 0 0 / 0.05);
  --drop-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.15);
  --drop-shadow-md: 0 3px 3px rgb(0 0 0 / 0.12);
  --drop-shadow-lg: 0 4px 4px rgb(0 0 0 / 0.15);
  --drop-shadow-xl: 0 9px 7px rgb(0 0 0 / 0.1);
  --drop-shadow-2xl: 0 25px 25px rgb(0 0 0 / 0.15);

  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  --animate-spin: spin 1s linear infinite;
  --animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-bounce: bounce 1s infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ping {
    75%,
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }

    50% {
      transform: none;
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }

  --blur-xs: 4px;
  --blur-sm: 8px;
  --blur-md: 12px;
  --blur-lg: 16px;
  --blur-xl: 24px;
  --blur-2xl: 40px;
  --blur-3xl: 64px;

  --perspective-dramatic: 100px;
  --perspective-near: 300px;
  --perspective-normal: 500px;
  --perspective-midrange: 800px;
  --perspective-distant: 1200px;

  --aspect-video: 16 / 9;

  --default-transition-duration: 150ms;
  --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  --default-font-family: var(--font-sans);
  --default-font-feature-settings: var(--font-sans--font-feature-settings);
  --default-font-variation-settings: var(--font-sans--font-variation-settings);
  --default-mono-font-family: var(--font-mono);
  --default-mono-font-feature-settings: var(--font-mono--font-feature-settings);
  --default-mono-font-variation-settings: var(--font-mono--font-variation-settings);
}

/* Deprecated */
@theme default inline reference {
  --blur: 8px;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --drop-shadow: 0 1px 2px rgb(0 0 0 / 0.1), 0 1px 1px rgb(0 0 0 / 0.06);
  --radius: 0.25rem;
  --max-width-prose: 65ch;
}
`;
  var Qr = `@tailwind utilities;
`;
  var Re = { index: Yr, preflight: Jr, theme: Zr, utilities: Qr };
  var Qe = class {
    start(r) {
      performance.mark(`${r} (start)`);
    }
    end(r, o) {
      performance.mark(`${r} (end)`),
        performance.measure(r, {
          start: `${r} (start)`,
          end: `${r} (end)`,
          detail: o,
        });
    }
    hit(r, o) {
      performance.mark(r, { detail: o });
    }
    error(r) {
      throw (performance.mark("(error)", { detail: { error: `${r}` } }), r);
    }
  };

  var eo = "text/tailwindcss",
    Xe,
    St = new Set(),
    Ct = "",
    Nt = document.createElement("style"),
    Xr = Promise.resolve(),
    Yn = 1,
    W = new Qe();
  async function Jn() {
    W.start("Create compiler"), W.start("Reading Stylesheets");
    let t = document.querySelectorAll(`style[type="${eo}"]`),
      r = "";
    for (let o of t)
      to(o),
        (r +=
          o.textContent +
          `
`);
    if (
      (r.includes("@import") || (r = `@import "tailwindcss";${r}`),
      W.end("Reading Stylesheets", { size: r.length, changed: Ct !== r }),
      Ct !== r)
    ) {
      (Ct = r), W.start("Compile CSS");
      try {
        Xe = await Gr(r, { base: "/", loadStylesheet: Zn, loadModule: Qn });
      } finally {
        W.end("Compile CSS"), W.end("Create compiler");
      }
      St.clear();
    }
  }
  async function Zn(t, r) {
    function o() {
      if (t === "tailwindcss") return { base: r, content: Re.index };
      if (
        t === "tailwindcss/preflight" ||
        t === "tailwindcss/preflight.css" ||
        t === "./preflight.css"
      )
        return { base: r, content: Re.preflight };
      if (
        t === "tailwindcss/theme" ||
        t === "tailwindcss/theme.css" ||
        t === "./theme.css"
      )
        return { base: r, content: Re.theme };
      if (
        t === "tailwindcss/utilities" ||
        t === "tailwindcss/utilities.css" ||
        t === "./utilities.css"
      )
        return { base: r, content: Re.utilities };
      throw new Error(`The browser build does not support @import for "${t}"`);
    }
    try {
      let e = o();
      return (
        W.hit("Loaded stylesheet", { id: t, base: r, size: e.content.length }),
        e
      );
    } catch (e) {
      throw (
        (W.hit("Failed to load stylesheet", {
          id: t,
          base: r,
          error: e.message ?? e,
        }),
        e)
      );
    }
  }
  async function Qn() {
    throw new Error(
      "The browser build does not support plugins or config files.",
    );
  }
  async function Xn(t) {
    if (!Xe) return;
    let r = new Set();
    W.start("Collect classes");
    for (let o of document.querySelectorAll("[class]"))
      for (let e of o.classList) St.has(e) || (St.add(e), r.add(e));
    W.end("Collect classes", { count: r.size }),
      !(r.size === 0 && t === "incremental") &&
        (W.start("Build utilities"),
        (Nt.textContent = Xe.build(Array.from(r))),
        W.end("Build utilities"));
  }
  function et(t) {
    async function r() {
      if (!Xe && t !== "full") return;
      let o = Yn++;
      W.start(`Build #${o} (${t})`),
        t === "full" && (await Jn()),
        W.start("Build"),
        await Xn(t),
        W.end("Build"),
        W.end(`Build #${o} (${t})`);
    }
    Xr = Xr.then(r).catch((o) => W.error(o));
  }
  var ei = new MutationObserver(() => et("full"));
  function to(t) {
    ei.observe(t, {
      attributes: !0,
      attributeFilter: ["type"],
      characterData: !0,
      subtree: !0,
      childList: !0,
    });
  }
  new MutationObserver((t) => {
    let r = 0,
      o = 0;
    for (let e of t) {
      for (let n of e.addedNodes)
        n.nodeType === Node.ELEMENT_NODE &&
          n.tagName === "STYLE" &&
          n.getAttribute("type") === eo &&
          (to(n), r++);
      for (let n of e.addedNodes) n.nodeType === 1 && n !== Nt && o++;
      e.type === "attributes" && o++;
    }
    if (r > 0) return et("full");
    if (o > 0) return et("incremental");
  }).observe(document.documentElement, {
    attributes: !0,
    attributeFilter: ["class"],
    childList: !0,
    subtree: !0,
  });
  et("full");
  document.head.append(Nt);
})();
