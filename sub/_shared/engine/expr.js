/*
 * A four-operator arithmetic evaluator over named profile fields.
 *
 * Entries declare their sum as a string, so something has to turn that string
 * into a number. Not eval, and not a Function constructor: this runs in a page
 * that holds the reader's own financial figures, and an expression is content
 * rather than code. The grammar is an allowlist - decimal numbers, declared
 * identifiers, the four operators, brackets, and a leading sign. Anything else
 * fails to tokenise, so a call, a subscript, a semicolon or a property access
 * never reaches an evaluator at all.
 *
 * Both halves of the toolchain use this. build.js compiles every expression at
 * build time and checks its identifiers against the declared profile, which is
 * what stops a typo from surfacing as a silent NaN months later on the one day
 * that entry comes up.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EXPR = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var NUM = /^\d+(?:\.\d+)?/;
  var NAME = /^[A-Za-z_][A-Za-z0-9_]*/;
  var PREC = { '+': 1, '-': 1, '*': 2, '/': 2 };

  function tokenize(src) {
    var s = String(src), out = [], i = 0;
    while (i < s.length) {
      var rest = s.slice(i), c = rest.charAt(0), m;
      if (c === ' ' || c === '\t' || c === '\n') { i++; continue; }
      if ((m = NUM.exec(rest))) { out.push({ t: 'num', v: parseFloat(m[0]) }); i += m[0].length; continue; }
      if ((m = NAME.exec(rest))) { out.push({ t: 'name', v: m[0] }); i += m[0].length; continue; }
      if (c === '(' || c === ')') { out.push({ t: c }); i++; continue; }
      if (PREC[c]) { out.push({ t: 'op', v: c }); i++; continue; }
      throw new Error('unexpected "' + c + '" at position ' + i);
    }
    if (!out.length) throw new Error('empty expression');
    return out;
  }

  /* Shunting-yard. `expectOperand` is what rejects the shapes that tokenise
     cleanly but are not arithmetic: two values in a row, a doubled operator
     such as **, or a bracket opening straight after a value, which is how a
     function call would have to look. */
  function toRPN(tokens) {
    var out = [], ops = [], expectOperand = true, i, tk, top;
    for (i = 0; i < tokens.length; i++) {
      tk = tokens[i];
      if (tk.t === 'num' || tk.t === 'name') {
        if (!expectOperand) throw new Error('two values in a row near "' + tk.v + '"');
        out.push(tk);
        expectOperand = false;
      } else if (tk.t === 'op') {
        if (expectOperand) {
          if (tk.v !== '-' && tk.v !== '+') throw new Error('"' + tk.v + '" needs a value before it');
          out.push({ t: 'num', v: 0 });          // unary: -x becomes 0 - x
          ops.push(tk);
        } else {
          while (ops.length) {
            top = ops[ops.length - 1];
            if (top.t === 'op' && PREC[top.v] >= PREC[tk.v]) out.push(ops.pop());
            else break;
          }
          ops.push(tk);
        }
        expectOperand = true;
      } else if (tk.t === '(') {
        if (!expectOperand) throw new Error('a bracket cannot follow a value');
        ops.push(tk);
        expectOperand = true;
      } else {
        if (expectOperand) throw new Error('empty brackets');
        while (ops.length && ops[ops.length - 1].t !== '(') out.push(ops.pop());
        if (!ops.length) throw new Error('unbalanced brackets');
        ops.pop();
        expectOperand = false;
      }
    }
    if (expectOperand) throw new Error('expression ends with an operator');
    while (ops.length) {
      top = ops.pop();
      if (top.t === '(') throw new Error('unbalanced brackets');
      out.push(top);
    }
    return out;
  }

  function compile(src) { return toRPN(tokenize(src)); }

  function names(src) {
    var seen = {}, out = [];
    tokenize(src).forEach(function (tk) {
      if (tk.t === 'name' && !seen[tk.v]) { seen[tk.v] = 1; out.push(tk.v); }
    });
    return out;
  }

  /* Returns null rather than NaN for a missing field or a division by zero.
     A NaN would render as "NaN" and read as a computed answer. */
  function run(src, vars) {
    var rpn = compile(src), st = [], i, tk, a, b, v;
    for (i = 0; i < rpn.length; i++) {
      tk = rpn[i];
      if (tk.t === 'num') { st.push(tk.v); continue; }
      if (tk.t === 'name') {
        v = vars ? vars[tk.v] : undefined;
        if (typeof v !== 'number' || !isFinite(v)) return null;
        st.push(v);
        continue;
      }
      b = st.pop();
      a = st.pop();
      if (tk.v === '+') st.push(a + b);
      else if (tk.v === '-') st.push(a - b);
      else if (tk.v === '*') st.push(a * b);
      else if (b === 0) return null;
      else st.push(a / b);
    }
    v = st.pop();
    return (typeof v === 'number' && isFinite(v)) ? v : null;
  }

  return { compile: compile, names: names, run: run, tokenize: tokenize };
});
