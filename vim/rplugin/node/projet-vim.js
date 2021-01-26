var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// node_modules/@iarna/toml/lib/parser.js
var require_parser = __commonJS((exports2, module2) => {
  "use strict";
  var ParserEND = 1114112;
  var ParserError = class extends Error {
    constructor(msg, filename, linenumber) {
      super("[ParserError] " + msg, filename, linenumber);
      this.name = "ParserError";
      this.code = "ParserError";
      if (Error.captureStackTrace)
        Error.captureStackTrace(this, ParserError);
    }
  };
  var State = class {
    constructor(parser) {
      this.parser = parser;
      this.buf = "";
      this.returned = null;
      this.result = null;
      this.resultTable = null;
      this.resultArr = null;
    }
  };
  var Parser = class {
    constructor() {
      this.pos = 0;
      this.col = 0;
      this.line = 0;
      this.obj = {};
      this.ctx = this.obj;
      this.stack = [];
      this._buf = "";
      this.char = null;
      this.ii = 0;
      this.state = new State(this.parseStart);
    }
    parse(str) {
      if (str.length === 0 || str.length == null)
        return;
      this._buf = String(str);
      this.ii = -1;
      this.char = -1;
      let getNext;
      while (getNext === false || this.nextChar()) {
        getNext = this.runOne();
      }
      this._buf = null;
    }
    nextChar() {
      if (this.char === 10) {
        ++this.line;
        this.col = -1;
      }
      ++this.ii;
      this.char = this._buf.codePointAt(this.ii);
      ++this.pos;
      ++this.col;
      return this.haveBuffer();
    }
    haveBuffer() {
      return this.ii < this._buf.length;
    }
    runOne() {
      return this.state.parser.call(this, this.state.returned);
    }
    finish() {
      this.char = ParserEND;
      let last;
      do {
        last = this.state.parser;
        this.runOne();
      } while (this.state.parser !== last);
      this.ctx = null;
      this.state = null;
      this._buf = null;
      return this.obj;
    }
    next(fn) {
      if (typeof fn !== "function")
        throw new ParserError("Tried to set state to non-existent state: " + JSON.stringify(fn));
      this.state.parser = fn;
    }
    goto(fn) {
      this.next(fn);
      return this.runOne();
    }
    call(fn, returnWith) {
      if (returnWith)
        this.next(returnWith);
      this.stack.push(this.state);
      this.state = new State(fn);
    }
    callNow(fn, returnWith) {
      this.call(fn, returnWith);
      return this.runOne();
    }
    return(value) {
      if (this.stack.length === 0)
        throw this.error(new ParserError("Stack underflow"));
      if (value === void 0)
        value = this.state.buf;
      this.state = this.stack.pop();
      this.state.returned = value;
    }
    returnNow(value) {
      this.return(value);
      return this.runOne();
    }
    consume() {
      if (this.char === ParserEND)
        throw this.error(new ParserError("Unexpected end-of-buffer"));
      this.state.buf += this._buf[this.ii];
    }
    error(err) {
      err.line = this.line;
      err.col = this.col;
      err.pos = this.pos;
      return err;
    }
    parseStart() {
      throw new ParserError("Must declare a parseStart method");
    }
  };
  Parser.END = ParserEND;
  Parser.Error = ParserError;
  module2.exports = Parser;
});

// node_modules/@iarna/toml/lib/create-datetime.js
var require_create_datetime = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = (value) => {
    const date = new Date(value);
    if (isNaN(date)) {
      throw new TypeError("Invalid Datetime");
    } else {
      return date;
    }
  };
});

// node_modules/@iarna/toml/lib/format-num.js
var require_format_num = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = (d, num) => {
    num = String(num);
    while (num.length < d)
      num = "0" + num;
    return num;
  };
});

// node_modules/@iarna/toml/lib/create-datetime-float.js
var require_create_datetime_float = __commonJS((exports2, module2) => {
  "use strict";
  var f = require_format_num();
  var FloatingDateTime = class extends Date {
    constructor(value) {
      super(value + "Z");
      this.isFloating = true;
    }
    toISOString() {
      const date = `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`;
      const time = `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`;
      return `${date}T${time}`;
    }
  };
  module2.exports = (value) => {
    const date = new FloatingDateTime(value);
    if (isNaN(date)) {
      throw new TypeError("Invalid Datetime");
    } else {
      return date;
    }
  };
});

// node_modules/@iarna/toml/lib/create-date.js
var require_create_date = __commonJS((exports2, module2) => {
  "use strict";
  var f = require_format_num();
  var DateTime = global.Date;
  var Date2 = class extends DateTime {
    constructor(value) {
      super(value);
      this.isDate = true;
    }
    toISOString() {
      return `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`;
    }
  };
  module2.exports = (value) => {
    const date = new Date2(value);
    if (isNaN(date)) {
      throw new TypeError("Invalid Datetime");
    } else {
      return date;
    }
  };
});

// node_modules/@iarna/toml/lib/create-time.js
var require_create_time = __commonJS((exports2, module2) => {
  "use strict";
  var f = require_format_num();
  var Time = class extends Date {
    constructor(value) {
      super(`0000-01-01T${value}Z`);
      this.isTime = true;
    }
    toISOString() {
      return `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`;
    }
  };
  module2.exports = (value) => {
    const date = new Time(value);
    if (isNaN(date)) {
      throw new TypeError("Invalid Datetime");
    } else {
      return date;
    }
  };
});

// node_modules/@iarna/toml/lib/toml-parser.js
var require_toml_parser = __commonJS((exports, module) => {
  "use strict";
  module.exports = makeParserClass(require_parser());
  module.exports.makeParserClass = makeParserClass;
  var TomlError = class extends Error {
    constructor(msg) {
      super(msg);
      this.name = "TomlError";
      if (Error.captureStackTrace)
        Error.captureStackTrace(this, TomlError);
      this.fromTOML = true;
      this.wrapped = null;
    }
  };
  TomlError.wrap = (err) => {
    const terr = new TomlError(err.message);
    terr.code = err.code;
    terr.wrapped = err;
    return terr;
  };
  module.exports.TomlError = TomlError;
  var createDateTime = require_create_datetime();
  var createDateTimeFloat = require_create_datetime_float();
  var createDate = require_create_date();
  var createTime = require_create_time();
  var CTRL_I = 9;
  var CTRL_J = 10;
  var CTRL_M = 13;
  var CTRL_CHAR_BOUNDARY = 31;
  var CHAR_SP = 32;
  var CHAR_QUOT = 34;
  var CHAR_NUM = 35;
  var CHAR_APOS = 39;
  var CHAR_PLUS = 43;
  var CHAR_COMMA = 44;
  var CHAR_HYPHEN = 45;
  var CHAR_PERIOD = 46;
  var CHAR_0 = 48;
  var CHAR_1 = 49;
  var CHAR_7 = 55;
  var CHAR_9 = 57;
  var CHAR_COLON = 58;
  var CHAR_EQUALS = 61;
  var CHAR_A = 65;
  var CHAR_E = 69;
  var CHAR_F = 70;
  var CHAR_T = 84;
  var CHAR_U = 85;
  var CHAR_Z = 90;
  var CHAR_LOWBAR = 95;
  var CHAR_a = 97;
  var CHAR_b = 98;
  var CHAR_e = 101;
  var CHAR_f = 102;
  var CHAR_i = 105;
  var CHAR_l = 108;
  var CHAR_n = 110;
  var CHAR_o = 111;
  var CHAR_r = 114;
  var CHAR_s = 115;
  var CHAR_t = 116;
  var CHAR_u = 117;
  var CHAR_x = 120;
  var CHAR_z = 122;
  var CHAR_LCUB = 123;
  var CHAR_RCUB = 125;
  var CHAR_LSQB = 91;
  var CHAR_BSOL = 92;
  var CHAR_RSQB = 93;
  var CHAR_DEL = 127;
  var SURROGATE_FIRST = 55296;
  var SURROGATE_LAST = 57343;
  var escapes = {
    [CHAR_b]: "\b",
    [CHAR_t]: "	",
    [CHAR_n]: "\n",
    [CHAR_f]: "\f",
    [CHAR_r]: "\r",
    [CHAR_QUOT]: '"',
    [CHAR_BSOL]: "\\"
  };
  function isDigit(cp) {
    return cp >= CHAR_0 && cp <= CHAR_9;
  }
  function isHexit(cp) {
    return cp >= CHAR_A && cp <= CHAR_F || cp >= CHAR_a && cp <= CHAR_f || cp >= CHAR_0 && cp <= CHAR_9;
  }
  function isBit(cp) {
    return cp === CHAR_1 || cp === CHAR_0;
  }
  function isOctit(cp) {
    return cp >= CHAR_0 && cp <= CHAR_7;
  }
  function isAlphaNumQuoteHyphen(cp) {
    return cp >= CHAR_A && cp <= CHAR_Z || cp >= CHAR_a && cp <= CHAR_z || cp >= CHAR_0 && cp <= CHAR_9 || cp === CHAR_APOS || cp === CHAR_QUOT || cp === CHAR_LOWBAR || cp === CHAR_HYPHEN;
  }
  function isAlphaNumHyphen(cp) {
    return cp >= CHAR_A && cp <= CHAR_Z || cp >= CHAR_a && cp <= CHAR_z || cp >= CHAR_0 && cp <= CHAR_9 || cp === CHAR_LOWBAR || cp === CHAR_HYPHEN;
  }
  var _type = Symbol("type");
  var _declared = Symbol("declared");
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var defineProperty = Object.defineProperty;
  var descriptor = {configurable: true, enumerable: true, writable: true, value: void 0};
  function hasKey(obj, key) {
    if (hasOwnProperty.call(obj, key))
      return true;
    if (key === "__proto__")
      defineProperty(obj, "__proto__", descriptor);
    return false;
  }
  var INLINE_TABLE = Symbol("inline-table");
  function InlineTable() {
    return Object.defineProperties({}, {
      [_type]: {value: INLINE_TABLE}
    });
  }
  function isInlineTable(obj) {
    if (obj === null || typeof obj !== "object")
      return false;
    return obj[_type] === INLINE_TABLE;
  }
  var TABLE = Symbol("table");
  function Table() {
    return Object.defineProperties({}, {
      [_type]: {value: TABLE},
      [_declared]: {value: false, writable: true}
    });
  }
  function isTable(obj) {
    if (obj === null || typeof obj !== "object")
      return false;
    return obj[_type] === TABLE;
  }
  var _contentType = Symbol("content-type");
  var INLINE_LIST = Symbol("inline-list");
  function InlineList(type2) {
    return Object.defineProperties([], {
      [_type]: {value: INLINE_LIST},
      [_contentType]: {value: type2}
    });
  }
  function isInlineList(obj) {
    if (obj === null || typeof obj !== "object")
      return false;
    return obj[_type] === INLINE_LIST;
  }
  var LIST = Symbol("list");
  function List() {
    return Object.defineProperties([], {
      [_type]: {value: LIST}
    });
  }
  function isList(obj) {
    if (obj === null || typeof obj !== "object")
      return false;
    return obj[_type] === LIST;
  }
  var _custom;
  try {
    const utilInspect = eval("require('util').inspect");
    _custom = utilInspect.custom;
  } catch (_) {
  }
  var _inspect = _custom || "inspect";
  var BoxedBigInt = class {
    constructor(value) {
      try {
        this.value = global.BigInt.asIntN(64, value);
      } catch (_) {
        this.value = null;
      }
      Object.defineProperty(this, _type, {value: INTEGER});
    }
    isNaN() {
      return this.value === null;
    }
    toString() {
      return String(this.value);
    }
    [_inspect]() {
      return `[BigInt: ${this.toString()}]}`;
    }
    valueOf() {
      return this.value;
    }
  };
  var INTEGER = Symbol("integer");
  function Integer(value) {
    let num = Number(value);
    if (Object.is(num, -0))
      num = 0;
    if (global.BigInt && !Number.isSafeInteger(num)) {
      return new BoxedBigInt(value);
    } else {
      return Object.defineProperties(new Number(num), {
        isNaN: {value: function() {
          return isNaN(this);
        }},
        [_type]: {value: INTEGER},
        [_inspect]: {value: () => `[Integer: ${value}]`}
      });
    }
  }
  function isInteger(obj) {
    if (obj === null || typeof obj !== "object")
      return false;
    return obj[_type] === INTEGER;
  }
  var FLOAT = Symbol("float");
  function Float(value) {
    return Object.defineProperties(new Number(value), {
      [_type]: {value: FLOAT},
      [_inspect]: {value: () => `[Float: ${value}]`}
    });
  }
  function isFloat(obj) {
    if (obj === null || typeof obj !== "object")
      return false;
    return obj[_type] === FLOAT;
  }
  function tomlType(value) {
    const type2 = typeof value;
    if (type2 === "object") {
      if (value === null)
        return "null";
      if (value instanceof Date)
        return "datetime";
      if (_type in value) {
        switch (value[_type]) {
          case INLINE_TABLE:
            return "inline-table";
          case INLINE_LIST:
            return "inline-list";
          case TABLE:
            return "table";
          case LIST:
            return "list";
          case FLOAT:
            return "float";
          case INTEGER:
            return "integer";
        }
      }
    }
    return type2;
  }
  function makeParserClass(Parser) {
    class TOMLParser extends Parser {
      constructor() {
        super();
        this.ctx = this.obj = Table();
      }
      atEndOfWord() {
        return this.char === CHAR_NUM || this.char === CTRL_I || this.char === CHAR_SP || this.atEndOfLine();
      }
      atEndOfLine() {
        return this.char === Parser.END || this.char === CTRL_J || this.char === CTRL_M;
      }
      parseStart() {
        if (this.char === Parser.END) {
          return null;
        } else if (this.char === CHAR_LSQB) {
          return this.call(this.parseTableOrList);
        } else if (this.char === CHAR_NUM) {
          return this.call(this.parseComment);
        } else if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
          return null;
        } else if (isAlphaNumQuoteHyphen(this.char)) {
          return this.callNow(this.parseAssignStatement);
        } else {
          throw this.error(new TomlError(`Unknown character "${this.char}"`));
        }
      }
      parseWhitespaceToEOL() {
        if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
          return null;
        } else if (this.char === CHAR_NUM) {
          return this.goto(this.parseComment);
        } else if (this.char === Parser.END || this.char === CTRL_J) {
          return this.return();
        } else {
          throw this.error(new TomlError("Unexpected character, expected only whitespace or comments till end of line"));
        }
      }
      parseAssignStatement() {
        return this.callNow(this.parseAssign, this.recordAssignStatement);
      }
      recordAssignStatement(kv) {
        let target = this.ctx;
        let finalKey = kv.key.pop();
        for (let kw of kv.key) {
          if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) {
            throw this.error(new TomlError("Can't redefine existing key"));
          }
          target = target[kw] = target[kw] || Table();
        }
        if (hasKey(target, finalKey)) {
          throw this.error(new TomlError("Can't redefine existing key"));
        }
        if (isInteger(kv.value) || isFloat(kv.value)) {
          target[finalKey] = kv.value.valueOf();
        } else {
          target[finalKey] = kv.value;
        }
        return this.goto(this.parseWhitespaceToEOL);
      }
      parseAssign() {
        return this.callNow(this.parseKeyword, this.recordAssignKeyword);
      }
      recordAssignKeyword(key) {
        if (this.state.resultTable) {
          this.state.resultTable.push(key);
        } else {
          this.state.resultTable = [key];
        }
        return this.goto(this.parseAssignKeywordPreDot);
      }
      parseAssignKeywordPreDot() {
        if (this.char === CHAR_PERIOD) {
          return this.next(this.parseAssignKeywordPostDot);
        } else if (this.char !== CHAR_SP && this.char !== CTRL_I) {
          return this.goto(this.parseAssignEqual);
        }
      }
      parseAssignKeywordPostDot() {
        if (this.char !== CHAR_SP && this.char !== CTRL_I) {
          return this.callNow(this.parseKeyword, this.recordAssignKeyword);
        }
      }
      parseAssignEqual() {
        if (this.char === CHAR_EQUALS) {
          return this.next(this.parseAssignPreValue);
        } else {
          throw this.error(new TomlError('Invalid character, expected "="'));
        }
      }
      parseAssignPreValue() {
        if (this.char === CHAR_SP || this.char === CTRL_I) {
          return null;
        } else {
          return this.callNow(this.parseValue, this.recordAssignValue);
        }
      }
      recordAssignValue(value) {
        return this.returnNow({key: this.state.resultTable, value});
      }
      parseComment() {
        do {
          if (this.char === Parser.END || this.char === CTRL_J) {
            return this.return();
          }
        } while (this.nextChar());
      }
      parseTableOrList() {
        if (this.char === CHAR_LSQB) {
          this.next(this.parseList);
        } else {
          return this.goto(this.parseTable);
        }
      }
      parseTable() {
        this.ctx = this.obj;
        return this.goto(this.parseTableNext);
      }
      parseTableNext() {
        if (this.char === CHAR_SP || this.char === CTRL_I) {
          return null;
        } else {
          return this.callNow(this.parseKeyword, this.parseTableMore);
        }
      }
      parseTableMore(keyword) {
        if (this.char === CHAR_SP || this.char === CTRL_I) {
          return null;
        } else if (this.char === CHAR_RSQB) {
          if (hasKey(this.ctx, keyword) && (!isTable(this.ctx[keyword]) || this.ctx[keyword][_declared])) {
            throw this.error(new TomlError("Can't redefine existing key"));
          } else {
            this.ctx = this.ctx[keyword] = this.ctx[keyword] || Table();
            this.ctx[_declared] = true;
          }
          return this.next(this.parseWhitespaceToEOL);
        } else if (this.char === CHAR_PERIOD) {
          if (!hasKey(this.ctx, keyword)) {
            this.ctx = this.ctx[keyword] = Table();
          } else if (isTable(this.ctx[keyword])) {
            this.ctx = this.ctx[keyword];
          } else if (isList(this.ctx[keyword])) {
            this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1];
          } else {
            throw this.error(new TomlError("Can't redefine existing key"));
          }
          return this.next(this.parseTableNext);
        } else {
          throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
        }
      }
      parseList() {
        this.ctx = this.obj;
        return this.goto(this.parseListNext);
      }
      parseListNext() {
        if (this.char === CHAR_SP || this.char === CTRL_I) {
          return null;
        } else {
          return this.callNow(this.parseKeyword, this.parseListMore);
        }
      }
      parseListMore(keyword) {
        if (this.char === CHAR_SP || this.char === CTRL_I) {
          return null;
        } else if (this.char === CHAR_RSQB) {
          if (!hasKey(this.ctx, keyword)) {
            this.ctx[keyword] = List();
          }
          if (isInlineList(this.ctx[keyword])) {
            throw this.error(new TomlError("Can't extend an inline array"));
          } else if (isList(this.ctx[keyword])) {
            const next = Table();
            this.ctx[keyword].push(next);
            this.ctx = next;
          } else {
            throw this.error(new TomlError("Can't redefine an existing key"));
          }
          return this.next(this.parseListEnd);
        } else if (this.char === CHAR_PERIOD) {
          if (!hasKey(this.ctx, keyword)) {
            this.ctx = this.ctx[keyword] = Table();
          } else if (isInlineList(this.ctx[keyword])) {
            throw this.error(new TomlError("Can't extend an inline array"));
          } else if (isInlineTable(this.ctx[keyword])) {
            throw this.error(new TomlError("Can't extend an inline table"));
          } else if (isList(this.ctx[keyword])) {
            this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1];
          } else if (isTable(this.ctx[keyword])) {
            this.ctx = this.ctx[keyword];
          } else {
            throw this.error(new TomlError("Can't redefine an existing key"));
          }
          return this.next(this.parseListNext);
        } else {
          throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
        }
      }
      parseListEnd(keyword) {
        if (this.char === CHAR_RSQB) {
          return this.next(this.parseWhitespaceToEOL);
        } else {
          throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
        }
      }
      parseValue() {
        if (this.char === Parser.END) {
          throw this.error(new TomlError("Key without value"));
        } else if (this.char === CHAR_QUOT) {
          return this.next(this.parseDoubleString);
        }
        if (this.char === CHAR_APOS) {
          return this.next(this.parseSingleString);
        } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
          return this.goto(this.parseNumberSign);
        } else if (this.char === CHAR_i) {
          return this.next(this.parseInf);
        } else if (this.char === CHAR_n) {
          return this.next(this.parseNan);
        } else if (isDigit(this.char)) {
          return this.goto(this.parseNumberOrDateTime);
        } else if (this.char === CHAR_t || this.char === CHAR_f) {
          return this.goto(this.parseBoolean);
        } else if (this.char === CHAR_LSQB) {
          return this.call(this.parseInlineList, this.recordValue);
        } else if (this.char === CHAR_LCUB) {
          return this.call(this.parseInlineTable, this.recordValue);
        } else {
          throw this.error(new TomlError("Unexpected character, expecting string, number, datetime, boolean, inline array or inline table"));
        }
      }
      recordValue(value) {
        return this.returnNow(value);
      }
      parseInf() {
        if (this.char === CHAR_n) {
          return this.next(this.parseInf2);
        } else {
          throw this.error(new TomlError('Unexpected character, expected "inf", "+inf" or "-inf"'));
        }
      }
      parseInf2() {
        if (this.char === CHAR_f) {
          if (this.state.buf === "-") {
            return this.return(-Infinity);
          } else {
            return this.return(Infinity);
          }
        } else {
          throw this.error(new TomlError('Unexpected character, expected "inf", "+inf" or "-inf"'));
        }
      }
      parseNan() {
        if (this.char === CHAR_a) {
          return this.next(this.parseNan2);
        } else {
          throw this.error(new TomlError('Unexpected character, expected "nan"'));
        }
      }
      parseNan2() {
        if (this.char === CHAR_n) {
          return this.return(NaN);
        } else {
          throw this.error(new TomlError('Unexpected character, expected "nan"'));
        }
      }
      parseKeyword() {
        if (this.char === CHAR_QUOT) {
          return this.next(this.parseBasicString);
        } else if (this.char === CHAR_APOS) {
          return this.next(this.parseLiteralString);
        } else {
          return this.goto(this.parseBareKey);
        }
      }
      parseBareKey() {
        do {
          if (this.char === Parser.END) {
            throw this.error(new TomlError("Key ended without value"));
          } else if (isAlphaNumHyphen(this.char)) {
            this.consume();
          } else if (this.state.buf.length === 0) {
            throw this.error(new TomlError("Empty bare keys are not allowed"));
          } else {
            return this.returnNow();
          }
        } while (this.nextChar());
      }
      parseSingleString() {
        if (this.char === CHAR_APOS) {
          return this.next(this.parseLiteralMultiStringMaybe);
        } else {
          return this.goto(this.parseLiteralString);
        }
      }
      parseLiteralString() {
        do {
          if (this.char === CHAR_APOS) {
            return this.return();
          } else if (this.atEndOfLine()) {
            throw this.error(new TomlError("Unterminated string"));
          } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I) {
            throw this.errorControlCharInString();
          } else {
            this.consume();
          }
        } while (this.nextChar());
      }
      parseLiteralMultiStringMaybe() {
        if (this.char === CHAR_APOS) {
          return this.next(this.parseLiteralMultiString);
        } else {
          return this.returnNow();
        }
      }
      parseLiteralMultiString() {
        if (this.char === CTRL_M) {
          return null;
        } else if (this.char === CTRL_J) {
          return this.next(this.parseLiteralMultiStringContent);
        } else {
          return this.goto(this.parseLiteralMultiStringContent);
        }
      }
      parseLiteralMultiStringContent() {
        do {
          if (this.char === CHAR_APOS) {
            return this.next(this.parseLiteralMultiEnd);
          } else if (this.char === Parser.END) {
            throw this.error(new TomlError("Unterminated multi-line string"));
          } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M) {
            throw this.errorControlCharInString();
          } else {
            this.consume();
          }
        } while (this.nextChar());
      }
      parseLiteralMultiEnd() {
        if (this.char === CHAR_APOS) {
          return this.next(this.parseLiteralMultiEnd2);
        } else {
          this.state.buf += "'";
          return this.goto(this.parseLiteralMultiStringContent);
        }
      }
      parseLiteralMultiEnd2() {
        if (this.char === CHAR_APOS) {
          return this.return();
        } else {
          this.state.buf += "''";
          return this.goto(this.parseLiteralMultiStringContent);
        }
      }
      parseDoubleString() {
        if (this.char === CHAR_QUOT) {
          return this.next(this.parseMultiStringMaybe);
        } else {
          return this.goto(this.parseBasicString);
        }
      }
      parseBasicString() {
        do {
          if (this.char === CHAR_BSOL) {
            return this.call(this.parseEscape, this.recordEscapeReplacement);
          } else if (this.char === CHAR_QUOT) {
            return this.return();
          } else if (this.atEndOfLine()) {
            throw this.error(new TomlError("Unterminated string"));
          } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I) {
            throw this.errorControlCharInString();
          } else {
            this.consume();
          }
        } while (this.nextChar());
      }
      recordEscapeReplacement(replacement) {
        this.state.buf += replacement;
        return this.goto(this.parseBasicString);
      }
      parseMultiStringMaybe() {
        if (this.char === CHAR_QUOT) {
          return this.next(this.parseMultiString);
        } else {
          return this.returnNow();
        }
      }
      parseMultiString() {
        if (this.char === CTRL_M) {
          return null;
        } else if (this.char === CTRL_J) {
          return this.next(this.parseMultiStringContent);
        } else {
          return this.goto(this.parseMultiStringContent);
        }
      }
      parseMultiStringContent() {
        do {
          if (this.char === CHAR_BSOL) {
            return this.call(this.parseMultiEscape, this.recordMultiEscapeReplacement);
          } else if (this.char === CHAR_QUOT) {
            return this.next(this.parseMultiEnd);
          } else if (this.char === Parser.END) {
            throw this.error(new TomlError("Unterminated multi-line string"));
          } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M) {
            throw this.errorControlCharInString();
          } else {
            this.consume();
          }
        } while (this.nextChar());
      }
      errorControlCharInString() {
        let displayCode = "\\u00";
        if (this.char < 16) {
          displayCode += "0";
        }
        displayCode += this.char.toString(16);
        return this.error(new TomlError(`Control characters (codes < 0x1f and 0x7f) are not allowed in strings, use ${displayCode} instead`));
      }
      recordMultiEscapeReplacement(replacement) {
        this.state.buf += replacement;
        return this.goto(this.parseMultiStringContent);
      }
      parseMultiEnd() {
        if (this.char === CHAR_QUOT) {
          return this.next(this.parseMultiEnd2);
        } else {
          this.state.buf += '"';
          return this.goto(this.parseMultiStringContent);
        }
      }
      parseMultiEnd2() {
        if (this.char === CHAR_QUOT) {
          return this.return();
        } else {
          this.state.buf += '""';
          return this.goto(this.parseMultiStringContent);
        }
      }
      parseMultiEscape() {
        if (this.char === CTRL_M || this.char === CTRL_J) {
          return this.next(this.parseMultiTrim);
        } else if (this.char === CHAR_SP || this.char === CTRL_I) {
          return this.next(this.parsePreMultiTrim);
        } else {
          return this.goto(this.parseEscape);
        }
      }
      parsePreMultiTrim() {
        if (this.char === CHAR_SP || this.char === CTRL_I) {
          return null;
        } else if (this.char === CTRL_M || this.char === CTRL_J) {
          return this.next(this.parseMultiTrim);
        } else {
          throw this.error(new TomlError("Can't escape whitespace"));
        }
      }
      parseMultiTrim() {
        if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
          return null;
        } else {
          return this.returnNow();
        }
      }
      parseEscape() {
        if (this.char in escapes) {
          return this.return(escapes[this.char]);
        } else if (this.char === CHAR_u) {
          return this.call(this.parseSmallUnicode, this.parseUnicodeReturn);
        } else if (this.char === CHAR_U) {
          return this.call(this.parseLargeUnicode, this.parseUnicodeReturn);
        } else {
          throw this.error(new TomlError("Unknown escape character: " + this.char));
        }
      }
      parseUnicodeReturn(char) {
        try {
          const codePoint = parseInt(char, 16);
          if (codePoint >= SURROGATE_FIRST && codePoint <= SURROGATE_LAST) {
            throw this.error(new TomlError("Invalid unicode, character in range 0xD800 - 0xDFFF is reserved"));
          }
          return this.returnNow(String.fromCodePoint(codePoint));
        } catch (err) {
          throw this.error(TomlError.wrap(err));
        }
      }
      parseSmallUnicode() {
        if (!isHexit(this.char)) {
          throw this.error(new TomlError("Invalid character in unicode sequence, expected hex"));
        } else {
          this.consume();
          if (this.state.buf.length >= 4)
            return this.return();
        }
      }
      parseLargeUnicode() {
        if (!isHexit(this.char)) {
          throw this.error(new TomlError("Invalid character in unicode sequence, expected hex"));
        } else {
          this.consume();
          if (this.state.buf.length >= 8)
            return this.return();
        }
      }
      parseNumberSign() {
        this.consume();
        return this.next(this.parseMaybeSignedInfOrNan);
      }
      parseMaybeSignedInfOrNan() {
        if (this.char === CHAR_i) {
          return this.next(this.parseInf);
        } else if (this.char === CHAR_n) {
          return this.next(this.parseNan);
        } else {
          return this.callNow(this.parseNoUnder, this.parseNumberIntegerStart);
        }
      }
      parseNumberIntegerStart() {
        if (this.char === CHAR_0) {
          this.consume();
          return this.next(this.parseNumberIntegerExponentOrDecimal);
        } else {
          return this.goto(this.parseNumberInteger);
        }
      }
      parseNumberIntegerExponentOrDecimal() {
        if (this.char === CHAR_PERIOD) {
          this.consume();
          return this.call(this.parseNoUnder, this.parseNumberFloat);
        } else if (this.char === CHAR_E || this.char === CHAR_e) {
          this.consume();
          return this.next(this.parseNumberExponentSign);
        } else {
          return this.returnNow(Integer(this.state.buf));
        }
      }
      parseNumberInteger() {
        if (isDigit(this.char)) {
          this.consume();
        } else if (this.char === CHAR_LOWBAR) {
          return this.call(this.parseNoUnder);
        } else if (this.char === CHAR_E || this.char === CHAR_e) {
          this.consume();
          return this.next(this.parseNumberExponentSign);
        } else if (this.char === CHAR_PERIOD) {
          this.consume();
          return this.call(this.parseNoUnder, this.parseNumberFloat);
        } else {
          const result = Integer(this.state.buf);
          if (result.isNaN()) {
            throw this.error(new TomlError("Invalid number"));
          } else {
            return this.returnNow(result);
          }
        }
      }
      parseNoUnder() {
        if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD || this.char === CHAR_E || this.char === CHAR_e) {
          throw this.error(new TomlError("Unexpected character, expected digit"));
        } else if (this.atEndOfWord()) {
          throw this.error(new TomlError("Incomplete number"));
        }
        return this.returnNow();
      }
      parseNoUnderHexOctBinLiteral() {
        if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD) {
          throw this.error(new TomlError("Unexpected character, expected digit"));
        } else if (this.atEndOfWord()) {
          throw this.error(new TomlError("Incomplete number"));
        }
        return this.returnNow();
      }
      parseNumberFloat() {
        if (this.char === CHAR_LOWBAR) {
          return this.call(this.parseNoUnder, this.parseNumberFloat);
        } else if (isDigit(this.char)) {
          this.consume();
        } else if (this.char === CHAR_E || this.char === CHAR_e) {
          this.consume();
          return this.next(this.parseNumberExponentSign);
        } else {
          return this.returnNow(Float(this.state.buf));
        }
      }
      parseNumberExponentSign() {
        if (isDigit(this.char)) {
          return this.goto(this.parseNumberExponent);
        } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
          this.consume();
          this.call(this.parseNoUnder, this.parseNumberExponent);
        } else {
          throw this.error(new TomlError("Unexpected character, expected -, + or digit"));
        }
      }
      parseNumberExponent() {
        if (isDigit(this.char)) {
          this.consume();
        } else if (this.char === CHAR_LOWBAR) {
          return this.call(this.parseNoUnder);
        } else {
          return this.returnNow(Float(this.state.buf));
        }
      }
      parseNumberOrDateTime() {
        if (this.char === CHAR_0) {
          this.consume();
          return this.next(this.parseNumberBaseOrDateTime);
        } else {
          return this.goto(this.parseNumberOrDateTimeOnly);
        }
      }
      parseNumberOrDateTimeOnly() {
        if (this.char === CHAR_LOWBAR) {
          return this.call(this.parseNoUnder, this.parseNumberInteger);
        } else if (isDigit(this.char)) {
          this.consume();
          if (this.state.buf.length > 4)
            this.next(this.parseNumberInteger);
        } else if (this.char === CHAR_E || this.char === CHAR_e) {
          this.consume();
          return this.next(this.parseNumberExponentSign);
        } else if (this.char === CHAR_PERIOD) {
          this.consume();
          return this.call(this.parseNoUnder, this.parseNumberFloat);
        } else if (this.char === CHAR_HYPHEN) {
          return this.goto(this.parseDateTime);
        } else if (this.char === CHAR_COLON) {
          return this.goto(this.parseOnlyTimeHour);
        } else {
          return this.returnNow(Integer(this.state.buf));
        }
      }
      parseDateTimeOnly() {
        if (this.state.buf.length < 4) {
          if (isDigit(this.char)) {
            return this.consume();
          } else if (this.char === CHAR_COLON) {
            return this.goto(this.parseOnlyTimeHour);
          } else {
            throw this.error(new TomlError("Expected digit while parsing year part of a date"));
          }
        } else {
          if (this.char === CHAR_HYPHEN) {
            return this.goto(this.parseDateTime);
          } else {
            throw this.error(new TomlError("Expected hyphen (-) while parsing year part of date"));
          }
        }
      }
      parseNumberBaseOrDateTime() {
        if (this.char === CHAR_b) {
          this.consume();
          return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerBin);
        } else if (this.char === CHAR_o) {
          this.consume();
          return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerOct);
        } else if (this.char === CHAR_x) {
          this.consume();
          return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerHex);
        } else if (this.char === CHAR_PERIOD) {
          return this.goto(this.parseNumberInteger);
        } else if (isDigit(this.char)) {
          return this.goto(this.parseDateTimeOnly);
        } else {
          return this.returnNow(Integer(this.state.buf));
        }
      }
      parseIntegerHex() {
        if (isHexit(this.char)) {
          this.consume();
        } else if (this.char === CHAR_LOWBAR) {
          return this.call(this.parseNoUnderHexOctBinLiteral);
        } else {
          const result = Integer(this.state.buf);
          if (result.isNaN()) {
            throw this.error(new TomlError("Invalid number"));
          } else {
            return this.returnNow(result);
          }
        }
      }
      parseIntegerOct() {
        if (isOctit(this.char)) {
          this.consume();
        } else if (this.char === CHAR_LOWBAR) {
          return this.call(this.parseNoUnderHexOctBinLiteral);
        } else {
          const result = Integer(this.state.buf);
          if (result.isNaN()) {
            throw this.error(new TomlError("Invalid number"));
          } else {
            return this.returnNow(result);
          }
        }
      }
      parseIntegerBin() {
        if (isBit(this.char)) {
          this.consume();
        } else if (this.char === CHAR_LOWBAR) {
          return this.call(this.parseNoUnderHexOctBinLiteral);
        } else {
          const result = Integer(this.state.buf);
          if (result.isNaN()) {
            throw this.error(new TomlError("Invalid number"));
          } else {
            return this.returnNow(result);
          }
        }
      }
      parseDateTime() {
        if (this.state.buf.length < 4) {
          throw this.error(new TomlError("Years less than 1000 must be zero padded to four characters"));
        }
        this.state.result = this.state.buf;
        this.state.buf = "";
        return this.next(this.parseDateMonth);
      }
      parseDateMonth() {
        if (this.char === CHAR_HYPHEN) {
          if (this.state.buf.length < 2) {
            throw this.error(new TomlError("Months less than 10 must be zero padded to two characters"));
          }
          this.state.result += "-" + this.state.buf;
          this.state.buf = "";
          return this.next(this.parseDateDay);
        } else if (isDigit(this.char)) {
          this.consume();
        } else {
          throw this.error(new TomlError("Incomplete datetime"));
        }
      }
      parseDateDay() {
        if (this.char === CHAR_T || this.char === CHAR_SP) {
          if (this.state.buf.length < 2) {
            throw this.error(new TomlError("Days less than 10 must be zero padded to two characters"));
          }
          this.state.result += "-" + this.state.buf;
          this.state.buf = "";
          return this.next(this.parseStartTimeHour);
        } else if (this.atEndOfWord()) {
          return this.returnNow(createDate(this.state.result + "-" + this.state.buf));
        } else if (isDigit(this.char)) {
          this.consume();
        } else {
          throw this.error(new TomlError("Incomplete datetime"));
        }
      }
      parseStartTimeHour() {
        if (this.atEndOfWord()) {
          return this.returnNow(createDate(this.state.result));
        } else {
          return this.goto(this.parseTimeHour);
        }
      }
      parseTimeHour() {
        if (this.char === CHAR_COLON) {
          if (this.state.buf.length < 2) {
            throw this.error(new TomlError("Hours less than 10 must be zero padded to two characters"));
          }
          this.state.result += "T" + this.state.buf;
          this.state.buf = "";
          return this.next(this.parseTimeMin);
        } else if (isDigit(this.char)) {
          this.consume();
        } else {
          throw this.error(new TomlError("Incomplete datetime"));
        }
      }
      parseTimeMin() {
        if (this.state.buf.length < 2 && isDigit(this.char)) {
          this.consume();
        } else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
          this.state.result += ":" + this.state.buf;
          this.state.buf = "";
          return this.next(this.parseTimeSec);
        } else {
          throw this.error(new TomlError("Incomplete datetime"));
        }
      }
      parseTimeSec() {
        if (isDigit(this.char)) {
          this.consume();
          if (this.state.buf.length === 2) {
            this.state.result += ":" + this.state.buf;
            this.state.buf = "";
            return this.next(this.parseTimeZoneOrFraction);
          }
        } else {
          throw this.error(new TomlError("Incomplete datetime"));
        }
      }
      parseOnlyTimeHour() {
        if (this.char === CHAR_COLON) {
          if (this.state.buf.length < 2) {
            throw this.error(new TomlError("Hours less than 10 must be zero padded to two characters"));
          }
          this.state.result = this.state.buf;
          this.state.buf = "";
          return this.next(this.parseOnlyTimeMin);
        } else {
          throw this.error(new TomlError("Incomplete time"));
        }
      }
      parseOnlyTimeMin() {
        if (this.state.buf.length < 2 && isDigit(this.char)) {
          this.consume();
        } else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
          this.state.result += ":" + this.state.buf;
          this.state.buf = "";
          return this.next(this.parseOnlyTimeSec);
        } else {
          throw this.error(new TomlError("Incomplete time"));
        }
      }
      parseOnlyTimeSec() {
        if (isDigit(this.char)) {
          this.consume();
          if (this.state.buf.length === 2) {
            return this.next(this.parseOnlyTimeFractionMaybe);
          }
        } else {
          throw this.error(new TomlError("Incomplete time"));
        }
      }
      parseOnlyTimeFractionMaybe() {
        this.state.result += ":" + this.state.buf;
        if (this.char === CHAR_PERIOD) {
          this.state.buf = "";
          this.next(this.parseOnlyTimeFraction);
        } else {
          return this.return(createTime(this.state.result));
        }
      }
      parseOnlyTimeFraction() {
        if (isDigit(this.char)) {
          this.consume();
        } else if (this.atEndOfWord()) {
          if (this.state.buf.length === 0)
            throw this.error(new TomlError("Expected digit in milliseconds"));
          return this.returnNow(createTime(this.state.result + "." + this.state.buf));
        } else {
          throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
        }
      }
      parseTimeZoneOrFraction() {
        if (this.char === CHAR_PERIOD) {
          this.consume();
          this.next(this.parseDateTimeFraction);
        } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
          this.consume();
          this.next(this.parseTimeZoneHour);
        } else if (this.char === CHAR_Z) {
          this.consume();
          return this.return(createDateTime(this.state.result + this.state.buf));
        } else if (this.atEndOfWord()) {
          return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf));
        } else {
          throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
        }
      }
      parseDateTimeFraction() {
        if (isDigit(this.char)) {
          this.consume();
        } else if (this.state.buf.length === 1) {
          throw this.error(new TomlError("Expected digit in milliseconds"));
        } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
          this.consume();
          this.next(this.parseTimeZoneHour);
        } else if (this.char === CHAR_Z) {
          this.consume();
          return this.return(createDateTime(this.state.result + this.state.buf));
        } else if (this.atEndOfWord()) {
          return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf));
        } else {
          throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
        }
      }
      parseTimeZoneHour() {
        if (isDigit(this.char)) {
          this.consume();
          if (/\d\d$/.test(this.state.buf))
            return this.next(this.parseTimeZoneSep);
        } else {
          throw this.error(new TomlError("Unexpected character in datetime, expected digit"));
        }
      }
      parseTimeZoneSep() {
        if (this.char === CHAR_COLON) {
          this.consume();
          this.next(this.parseTimeZoneMin);
        } else {
          throw this.error(new TomlError("Unexpected character in datetime, expected colon"));
        }
      }
      parseTimeZoneMin() {
        if (isDigit(this.char)) {
          this.consume();
          if (/\d\d$/.test(this.state.buf))
            return this.return(createDateTime(this.state.result + this.state.buf));
        } else {
          throw this.error(new TomlError("Unexpected character in datetime, expected digit"));
        }
      }
      parseBoolean() {
        if (this.char === CHAR_t) {
          this.consume();
          return this.next(this.parseTrue_r);
        } else if (this.char === CHAR_f) {
          this.consume();
          return this.next(this.parseFalse_a);
        }
      }
      parseTrue_r() {
        if (this.char === CHAR_r) {
          this.consume();
          return this.next(this.parseTrue_u);
        } else {
          throw this.error(new TomlError("Invalid boolean, expected true or false"));
        }
      }
      parseTrue_u() {
        if (this.char === CHAR_u) {
          this.consume();
          return this.next(this.parseTrue_e);
        } else {
          throw this.error(new TomlError("Invalid boolean, expected true or false"));
        }
      }
      parseTrue_e() {
        if (this.char === CHAR_e) {
          return this.return(true);
        } else {
          throw this.error(new TomlError("Invalid boolean, expected true or false"));
        }
      }
      parseFalse_a() {
        if (this.char === CHAR_a) {
          this.consume();
          return this.next(this.parseFalse_l);
        } else {
          throw this.error(new TomlError("Invalid boolean, expected true or false"));
        }
      }
      parseFalse_l() {
        if (this.char === CHAR_l) {
          this.consume();
          return this.next(this.parseFalse_s);
        } else {
          throw this.error(new TomlError("Invalid boolean, expected true or false"));
        }
      }
      parseFalse_s() {
        if (this.char === CHAR_s) {
          this.consume();
          return this.next(this.parseFalse_e);
        } else {
          throw this.error(new TomlError("Invalid boolean, expected true or false"));
        }
      }
      parseFalse_e() {
        if (this.char === CHAR_e) {
          return this.return(false);
        } else {
          throw this.error(new TomlError("Invalid boolean, expected true or false"));
        }
      }
      parseInlineList() {
        if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) {
          return null;
        } else if (this.char === Parser.END) {
          throw this.error(new TomlError("Unterminated inline array"));
        } else if (this.char === CHAR_NUM) {
          return this.call(this.parseComment);
        } else if (this.char === CHAR_RSQB) {
          return this.return(this.state.resultArr || InlineList());
        } else {
          return this.callNow(this.parseValue, this.recordInlineListValue);
        }
      }
      recordInlineListValue(value) {
        if (this.state.resultArr) {
          const listType = this.state.resultArr[_contentType];
          const valueType = tomlType(value);
          if (listType !== valueType) {
            throw this.error(new TomlError(`Inline lists must be a single type, not a mix of ${listType} and ${valueType}`));
          }
        } else {
          this.state.resultArr = InlineList(tomlType(value));
        }
        if (isFloat(value) || isInteger(value)) {
          this.state.resultArr.push(value.valueOf());
        } else {
          this.state.resultArr.push(value);
        }
        return this.goto(this.parseInlineListNext);
      }
      parseInlineListNext() {
        if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) {
          return null;
        } else if (this.char === CHAR_NUM) {
          return this.call(this.parseComment);
        } else if (this.char === CHAR_COMMA) {
          return this.next(this.parseInlineList);
        } else if (this.char === CHAR_RSQB) {
          return this.goto(this.parseInlineList);
        } else {
          throw this.error(new TomlError("Invalid character, expected whitespace, comma (,) or close bracket (])"));
        }
      }
      parseInlineTable() {
        if (this.char === CHAR_SP || this.char === CTRL_I) {
          return null;
        } else if (this.char === Parser.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
          throw this.error(new TomlError("Unterminated inline array"));
        } else if (this.char === CHAR_RCUB) {
          return this.return(this.state.resultTable || InlineTable());
        } else {
          if (!this.state.resultTable)
            this.state.resultTable = InlineTable();
          return this.callNow(this.parseAssign, this.recordInlineTableValue);
        }
      }
      recordInlineTableValue(kv) {
        let target = this.state.resultTable;
        let finalKey = kv.key.pop();
        for (let kw of kv.key) {
          if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) {
            throw this.error(new TomlError("Can't redefine existing key"));
          }
          target = target[kw] = target[kw] || Table();
        }
        if (hasKey(target, finalKey)) {
          throw this.error(new TomlError("Can't redefine existing key"));
        }
        if (isInteger(kv.value) || isFloat(kv.value)) {
          target[finalKey] = kv.value.valueOf();
        } else {
          target[finalKey] = kv.value;
        }
        return this.goto(this.parseInlineTableNext);
      }
      parseInlineTableNext() {
        if (this.char === CHAR_SP || this.char === CTRL_I) {
          return null;
        } else if (this.char === Parser.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
          throw this.error(new TomlError("Unterminated inline array"));
        } else if (this.char === CHAR_COMMA) {
          return this.next(this.parseInlineTable);
        } else if (this.char === CHAR_RCUB) {
          return this.goto(this.parseInlineTable);
        } else {
          throw this.error(new TomlError("Invalid character, expected whitespace, comma (,) or close bracket (])"));
        }
      }
    }
    return TOMLParser;
  }
});

// node_modules/@iarna/toml/parse-pretty-error.js
var require_parse_pretty_error = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = prettyError;
  function prettyError(err, buf) {
    if (err.pos == null || err.line == null)
      return err;
    let msg = err.message;
    msg += ` at row ${err.line + 1}, col ${err.col + 1}, pos ${err.pos}:
`;
    if (buf && buf.split) {
      const lines = buf.split(/\n/);
      const lineNumWidth = String(Math.min(lines.length, err.line + 3)).length;
      let linePadding = " ";
      while (linePadding.length < lineNumWidth)
        linePadding += " ";
      for (let ii = Math.max(0, err.line - 1); ii < Math.min(lines.length, err.line + 2); ++ii) {
        let lineNum = String(ii + 1);
        if (lineNum.length < lineNumWidth)
          lineNum = " " + lineNum;
        if (err.line === ii) {
          msg += lineNum + "> " + lines[ii] + "\n";
          msg += linePadding + "  ";
          for (let hh = 0; hh < err.col; ++hh) {
            msg += " ";
          }
          msg += "^\n";
        } else {
          msg += lineNum + ": " + lines[ii] + "\n";
        }
      }
    }
    err.message = msg + "\n";
    return err;
  }
});

// node_modules/@iarna/toml/parse-string.js
var require_parse_string = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = parseString;
  var TOMLParser = require_toml_parser();
  var prettyError = require_parse_pretty_error();
  function parseString(str) {
    if (global.Buffer && global.Buffer.isBuffer(str)) {
      str = str.toString("utf8");
    }
    const parser = new TOMLParser();
    try {
      parser.parse(str);
      return parser.finish();
    } catch (err) {
      throw prettyError(err, str);
    }
  }
});

// node_modules/@iarna/toml/parse-async.js
var require_parse_async = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = parseAsync;
  var TOMLParser = require_toml_parser();
  var prettyError = require_parse_pretty_error();
  function parseAsync(str, opts) {
    if (!opts)
      opts = {};
    const index = 0;
    const blocksize = opts.blocksize || 40960;
    const parser = new TOMLParser();
    return new Promise((resolve3, reject) => {
      setImmediate(parseAsyncNext, index, blocksize, resolve3, reject);
    });
    function parseAsyncNext(index2, blocksize2, resolve3, reject) {
      if (index2 >= str.length) {
        try {
          return resolve3(parser.finish());
        } catch (err) {
          return reject(prettyError(err, str));
        }
      }
      try {
        parser.parse(str.slice(index2, index2 + blocksize2));
        setImmediate(parseAsyncNext, index2 + blocksize2, blocksize2, resolve3, reject);
      } catch (err) {
        reject(prettyError(err, str));
      }
    }
  }
});

// node_modules/@iarna/toml/parse-stream.js
var require_parse_stream = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = parseStream;
  var stream = require("stream");
  var TOMLParser = require_toml_parser();
  function parseStream(stm) {
    if (stm) {
      return parseReadable(stm);
    } else {
      return parseTransform(stm);
    }
  }
  function parseReadable(stm) {
    const parser = new TOMLParser();
    stm.setEncoding("utf8");
    return new Promise((resolve3, reject) => {
      let readable;
      let ended = false;
      let errored = false;
      function finish() {
        ended = true;
        if (readable)
          return;
        try {
          resolve3(parser.finish());
        } catch (err) {
          reject(err);
        }
      }
      function error(err) {
        errored = true;
        reject(err);
      }
      stm.once("end", finish);
      stm.once("error", error);
      readNext();
      function readNext() {
        readable = true;
        let data;
        while ((data = stm.read()) !== null) {
          try {
            parser.parse(data);
          } catch (err) {
            return error(err);
          }
        }
        readable = false;
        if (ended)
          return finish();
        if (errored)
          return;
        stm.once("readable", readNext);
      }
    });
  }
  function parseTransform() {
    const parser = new TOMLParser();
    return new stream.Transform({
      objectMode: true,
      transform(chunk, encoding, cb) {
        try {
          parser.parse(chunk.toString(encoding));
        } catch (err) {
          this.emit("error", err);
        }
        cb();
      },
      flush(cb) {
        try {
          this.push(parser.finish());
        } catch (err) {
          this.emit("error", err);
        }
        cb();
      }
    });
  }
});

// node_modules/@iarna/toml/parse.js
var require_parse = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = require_parse_string();
  module2.exports.async = require_parse_async();
  module2.exports.stream = require_parse_stream();
  module2.exports.prettyError = require_parse_pretty_error();
});

// node_modules/@iarna/toml/stringify.js
var require_stringify = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = stringify;
  module2.exports.value = stringifyInline;
  function stringify(obj) {
    if (obj === null)
      throw typeError("null");
    if (obj === void 0)
      throw typeError("undefined");
    if (typeof obj !== "object")
      throw typeError(typeof obj);
    if (typeof obj.toJSON === "function")
      obj = obj.toJSON();
    if (obj == null)
      return null;
    const type2 = tomlType2(obj);
    if (type2 !== "table")
      throw typeError(type2);
    return stringifyObject("", "", obj);
  }
  function typeError(type2) {
    return new Error("Can only stringify objects, not " + type2);
  }
  function arrayOneTypeError() {
    return new Error("Array values can't have mixed types");
  }
  function getInlineKeys(obj) {
    return Object.keys(obj).filter((key) => isInline(obj[key]));
  }
  function getComplexKeys(obj) {
    return Object.keys(obj).filter((key) => !isInline(obj[key]));
  }
  function toJSON(obj) {
    let nobj = Array.isArray(obj) ? [] : Object.prototype.hasOwnProperty.call(obj, "__proto__") ? {["__proto__"]: void 0} : {};
    for (let prop of Object.keys(obj)) {
      if (obj[prop] && typeof obj[prop].toJSON === "function" && !("toISOString" in obj[prop])) {
        nobj[prop] = obj[prop].toJSON();
      } else {
        nobj[prop] = obj[prop];
      }
    }
    return nobj;
  }
  function stringifyObject(prefix, indent, obj) {
    obj = toJSON(obj);
    var inlineKeys;
    var complexKeys;
    inlineKeys = getInlineKeys(obj);
    complexKeys = getComplexKeys(obj);
    var result = [];
    var inlineIndent = indent || "";
    inlineKeys.forEach((key) => {
      var type2 = tomlType2(obj[key]);
      if (type2 !== "undefined" && type2 !== "null") {
        result.push(inlineIndent + stringifyKey(key) + " = " + stringifyAnyInline(obj[key], true));
      }
    });
    if (result.length > 0)
      result.push("");
    var complexIndent = prefix && inlineKeys.length > 0 ? indent + "  " : "";
    complexKeys.forEach((key) => {
      result.push(stringifyComplex(prefix, complexIndent, key, obj[key]));
    });
    return result.join("\n");
  }
  function isInline(value) {
    switch (tomlType2(value)) {
      case "undefined":
      case "null":
      case "integer":
      case "nan":
      case "float":
      case "boolean":
      case "string":
      case "datetime":
        return true;
      case "array":
        return value.length === 0 || tomlType2(value[0]) !== "table";
      case "table":
        return Object.keys(value).length === 0;
      default:
        return false;
    }
  }
  function tomlType2(value) {
    if (value === void 0) {
      return "undefined";
    } else if (value === null) {
      return "null";
    } else if (typeof value === "bigint" || Number.isInteger(value) && !Object.is(value, -0)) {
      return "integer";
    } else if (typeof value === "number") {
      return "float";
    } else if (typeof value === "boolean") {
      return "boolean";
    } else if (typeof value === "string") {
      return "string";
    } else if ("toISOString" in value) {
      return isNaN(value) ? "undefined" : "datetime";
    } else if (Array.isArray(value)) {
      return "array";
    } else {
      return "table";
    }
  }
  function stringifyKey(key) {
    var keyStr = String(key);
    if (/^[-A-Za-z0-9_]+$/.test(keyStr)) {
      return keyStr;
    } else {
      return stringifyBasicString(keyStr);
    }
  }
  function stringifyBasicString(str) {
    return '"' + escapeString(str).replace(/"/g, '\\"') + '"';
  }
  function stringifyLiteralString(str) {
    return "'" + str + "'";
  }
  function numpad(num, str) {
    while (str.length < num)
      str = "0" + str;
    return str;
  }
  function escapeString(str) {
    return str.replace(/\\/g, "\\\\").replace(/[\b]/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/([\u0000-\u001f\u007f])/, (c) => "\\u" + numpad(4, c.codePointAt(0).toString(16)));
  }
  function stringifyMultilineString(str) {
    let escaped = str.split(/\n/).map((str2) => {
      return escapeString(str2).replace(/"(?="")/g, '\\"');
    }).join("\n");
    if (escaped.slice(-1) === '"')
      escaped += "\\\n";
    return '"""\n' + escaped + '"""';
  }
  function stringifyAnyInline(value, multilineOk) {
    let type2 = tomlType2(value);
    if (type2 === "string") {
      if (multilineOk && /\n/.test(value)) {
        type2 = "string-multiline";
      } else if (!/[\b\t\n\f\r']/.test(value) && /"/.test(value)) {
        type2 = "string-literal";
      }
    }
    return stringifyInline(value, type2);
  }
  function stringifyInline(value, type2) {
    if (!type2)
      type2 = tomlType2(value);
    switch (type2) {
      case "string-multiline":
        return stringifyMultilineString(value);
      case "string":
        return stringifyBasicString(value);
      case "string-literal":
        return stringifyLiteralString(value);
      case "integer":
        return stringifyInteger(value);
      case "float":
        return stringifyFloat(value);
      case "boolean":
        return stringifyBoolean(value);
      case "datetime":
        return stringifyDatetime(value);
      case "array":
        return stringifyInlineArray(value.filter((_) => tomlType2(_) !== "null" && tomlType2(_) !== "undefined" && tomlType2(_) !== "nan"));
      case "table":
        return stringifyInlineTable(value);
      default:
        throw typeError(type2);
    }
  }
  function stringifyInteger(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, "_");
  }
  function stringifyFloat(value) {
    if (value === Infinity) {
      return "inf";
    } else if (value === -Infinity) {
      return "-inf";
    } else if (Object.is(value, NaN)) {
      return "nan";
    } else if (Object.is(value, -0)) {
      return "-0.0";
    }
    var chunks = String(value).split(".");
    var int = chunks[0];
    var dec = chunks[1] || 0;
    return stringifyInteger(int) + "." + dec;
  }
  function stringifyBoolean(value) {
    return String(value);
  }
  function stringifyDatetime(value) {
    return value.toISOString();
  }
  function isNumber(type2) {
    return type2 === "float" || type2 === "integer";
  }
  function arrayType(values) {
    var contentType = tomlType2(values[0]);
    if (values.every((_) => tomlType2(_) === contentType))
      return contentType;
    if (values.every((_) => isNumber(tomlType2(_))))
      return "float";
    return "mixed";
  }
  function validateArray(values) {
    const type2 = arrayType(values);
    if (type2 === "mixed") {
      throw arrayOneTypeError();
    }
    return type2;
  }
  function stringifyInlineArray(values) {
    values = toJSON(values);
    const type2 = validateArray(values);
    var result = "[";
    var stringified = values.map((_) => stringifyInline(_, type2));
    if (stringified.join(", ").length > 60 || /\n/.test(stringified)) {
      result += "\n  " + stringified.join(",\n  ") + "\n";
    } else {
      result += " " + stringified.join(", ") + (stringified.length > 0 ? " " : "");
    }
    return result + "]";
  }
  function stringifyInlineTable(value) {
    value = toJSON(value);
    var result = [];
    Object.keys(value).forEach((key) => {
      result.push(stringifyKey(key) + " = " + stringifyAnyInline(value[key], false));
    });
    return "{ " + result.join(", ") + (result.length > 0 ? " " : "") + "}";
  }
  function stringifyComplex(prefix, indent, key, value) {
    var valueType = tomlType2(value);
    if (valueType === "array") {
      return stringifyArrayOfTables(prefix, indent, key, value);
    } else if (valueType === "table") {
      return stringifyComplexTable(prefix, indent, key, value);
    } else {
      throw typeError(valueType);
    }
  }
  function stringifyArrayOfTables(prefix, indent, key, values) {
    values = toJSON(values);
    validateArray(values);
    var firstValueType = tomlType2(values[0]);
    if (firstValueType !== "table")
      throw typeError(firstValueType);
    var fullKey = prefix + stringifyKey(key);
    var result = "";
    values.forEach((table) => {
      if (result.length > 0)
        result += "\n";
      result += indent + "[[" + fullKey + "]]\n";
      result += stringifyObject(fullKey + ".", indent, table);
    });
    return result;
  }
  function stringifyComplexTable(prefix, indent, key, value) {
    var fullKey = prefix + stringifyKey(key);
    var result = "";
    if (getInlineKeys(value).length > 0) {
      result += indent + "[" + fullKey + "]\n";
    }
    return result + stringifyObject(fullKey + ".", indent, value);
  }
});

// node_modules/@iarna/toml/toml.js
var require_toml = __commonJS((exports2) => {
  "use strict";
  exports2.parse = require_parse();
  exports2.stringify = require_stringify();
});

// node_modules/fp-ts/lib/ChainRec.js
var require_ChainRec = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.tailRec = void 0;
  function tailRec(a, f) {
    var v = f(a);
    while (v._tag === "Left") {
      v = f(v.left);
    }
    return v.right;
  }
  exports2.tailRec = tailRec;
});

// node_modules/fp-ts/lib/function.js
var require_function = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.bindTo_ = exports2.bind_ = exports2.hole = exports2.pipe = exports2.untupled = exports2.tupled = exports2.absurd = exports2.decrement = exports2.increment = exports2.tuple = exports2.flow = exports2.flip = exports2.constVoid = exports2.constUndefined = exports2.constNull = exports2.constFalse = exports2.constTrue = exports2.constant = exports2.not = exports2.unsafeCoerce = exports2.identity = void 0;
  function identity(a) {
    return a;
  }
  exports2.identity = identity;
  exports2.unsafeCoerce = identity;
  function not(predicate) {
    return function(a) {
      return !predicate(a);
    };
  }
  exports2.not = not;
  function constant(a) {
    return function() {
      return a;
    };
  }
  exports2.constant = constant;
  exports2.constTrue = /* @__PURE__ */ constant(true);
  exports2.constFalse = /* @__PURE__ */ constant(false);
  exports2.constNull = /* @__PURE__ */ constant(null);
  exports2.constUndefined = /* @__PURE__ */ constant(void 0);
  exports2.constVoid = exports2.constUndefined;
  function flip(f) {
    return function(b, a) {
      return f(a, b);
    };
  }
  exports2.flip = flip;
  function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
      case 1:
        return ab;
      case 2:
        return function() {
          return bc(ab.apply(this, arguments));
        };
      case 3:
        return function() {
          return cd(bc(ab.apply(this, arguments)));
        };
      case 4:
        return function() {
          return de(cd(bc(ab.apply(this, arguments))));
        };
      case 5:
        return function() {
          return ef(de(cd(bc(ab.apply(this, arguments)))));
        };
      case 6:
        return function() {
          return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
        };
      case 7:
        return function() {
          return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
        };
      case 8:
        return function() {
          return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
        };
      case 9:
        return function() {
          return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
        };
    }
    return;
  }
  exports2.flow = flow;
  function tuple() {
    var t2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      t2[_i] = arguments[_i];
    }
    return t2;
  }
  exports2.tuple = tuple;
  function increment(n) {
    return n + 1;
  }
  exports2.increment = increment;
  function decrement(n) {
    return n - 1;
  }
  exports2.decrement = decrement;
  function absurd(_) {
    throw new Error("Called `absurd` function which should be uncallable");
  }
  exports2.absurd = absurd;
  function tupled(f) {
    return function(a) {
      return f.apply(void 0, a);
    };
  }
  exports2.tupled = tupled;
  function untupled(f) {
    return function() {
      var a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
      }
      return f(a);
    };
  }
  exports2.untupled = untupled;
  function pipe(a, ab, bc, cd, de, ef, fg, gh, hi, ij, jk, kl, lm, mn, no, op, pq, qr, rs, st) {
    switch (arguments.length) {
      case 1:
        return a;
      case 2:
        return ab(a);
      case 3:
        return bc(ab(a));
      case 4:
        return cd(bc(ab(a)));
      case 5:
        return de(cd(bc(ab(a))));
      case 6:
        return ef(de(cd(bc(ab(a)))));
      case 7:
        return fg(ef(de(cd(bc(ab(a))))));
      case 8:
        return gh(fg(ef(de(cd(bc(ab(a)))))));
      case 9:
        return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
      case 10:
        return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
      case 11:
        return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))));
      case 12:
        return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))));
      case 13:
        return lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))));
      case 14:
        return mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))));
      case 15:
        return no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))));
      case 16:
        return op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))));
      case 17:
        return pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))));
      case 18:
        return qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))));
      case 19:
        return rs(qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))))));
      case 20:
        return st(rs(qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))))));
    }
    return;
  }
  exports2.pipe = pipe;
  exports2.hole = absurd;
  var bind_ = function(a, name, b) {
    var _a;
    return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
  };
  exports2.bind_ = bind_;
  var bindTo_ = function(name) {
    return function(b) {
      var _a;
      return _a = {}, _a[name] = b, _a;
    };
  };
  exports2.bindTo_ = bindTo_;
});

// node_modules/fp-ts/lib/Either.js
var require_Either = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.getWitherable = exports2.getFilterable = exports2.getApplyMonoid = exports2.getApplySemigroup = exports2.getSemigroup = exports2.getEq = exports2.getShow = exports2.URI = exports2.throwError = exports2.sequence = exports2.traverse = exports2.reduceRight = exports2.foldMap = exports2.reduce = exports2.duplicate = exports2.extend = exports2.alt = exports2.altW = exports2.flatten = exports2.chainFirst = exports2.chainFirstW = exports2.chain = exports2.chainW = exports2.of = exports2.apSecond = exports2.apFirst = exports2.ap = exports2.apW = exports2.mapLeft = exports2.bimap = exports2.map = exports2.filterOrElse = exports2.filterOrElseW = exports2.orElse = exports2.swap = exports2.chainNullableK = exports2.fromNullableK = exports2.getOrElse = exports2.getOrElseW = exports2.fold = exports2.fromPredicate = exports2.fromOption = exports2.stringifyJSON = exports2.parseJSON = exports2.tryCatch = exports2.fromNullable = exports2.right = exports2.left = exports2.isRight = exports2.isLeft = void 0;
  exports2.sequenceArray = exports2.traverseArray = exports2.traverseArrayWithIndex = exports2.apS = exports2.apSW = exports2.bind = exports2.bindW = exports2.bindTo = exports2.Do = exports2.exists = exports2.elem = exports2.toError = exports2.either = exports2.getValidationMonoid = exports2.MonadThrow = exports2.ChainRec = exports2.Extend = exports2.Alt = exports2.Bifunctor = exports2.Traversable = exports2.Foldable = exports2.Monad = exports2.Applicative = exports2.Functor = exports2.getValidationSemigroup = exports2.getValidation = exports2.getAltValidation = exports2.getApplicativeValidation = void 0;
  var ChainRec_1 = require_ChainRec();
  var function_1 = require_function();
  var isLeft2 = function(ma) {
    return ma._tag === "Left";
  };
  exports2.isLeft = isLeft2;
  var isRight = function(ma) {
    return ma._tag === "Right";
  };
  exports2.isRight = isRight;
  var left = function(e) {
    return {_tag: "Left", left: e};
  };
  exports2.left = left;
  var right = function(a) {
    return {_tag: "Right", right: a};
  };
  exports2.right = right;
  function fromNullable(e) {
    return function(a) {
      return a == null ? exports2.left(e) : exports2.right(a);
    };
  }
  exports2.fromNullable = fromNullable;
  function tryCatch(f, onError) {
    try {
      return exports2.right(f());
    } catch (e) {
      return exports2.left(onError(e));
    }
  }
  exports2.tryCatch = tryCatch;
  function parseJSON(s, onError) {
    return tryCatch(function() {
      return JSON.parse(s);
    }, onError);
  }
  exports2.parseJSON = parseJSON;
  function stringifyJSON(u, onError) {
    return tryCatch(function() {
      return JSON.stringify(u);
    }, onError);
  }
  exports2.stringifyJSON = stringifyJSON;
  var fromOption = function(onNone) {
    return function(ma) {
      return ma._tag === "None" ? exports2.left(onNone()) : exports2.right(ma.value);
    };
  };
  exports2.fromOption = fromOption;
  var fromPredicate = function(predicate, onFalse) {
    return function(a) {
      return predicate(a) ? exports2.right(a) : exports2.left(onFalse(a));
    };
  };
  exports2.fromPredicate = fromPredicate;
  function fold(onLeft, onRight) {
    return function(ma) {
      return exports2.isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
    };
  }
  exports2.fold = fold;
  var getOrElseW = function(onLeft) {
    return function(ma) {
      return exports2.isLeft(ma) ? onLeft(ma.left) : ma.right;
    };
  };
  exports2.getOrElseW = getOrElseW;
  exports2.getOrElse = exports2.getOrElseW;
  function fromNullableK(e) {
    var from = fromNullable(e);
    return function(f) {
      return function() {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          a[_i] = arguments[_i];
        }
        return from(f.apply(void 0, a));
      };
    };
  }
  exports2.fromNullableK = fromNullableK;
  function chainNullableK(e) {
    var from = fromNullableK(e);
    return function(f) {
      return exports2.chain(from(f));
    };
  }
  exports2.chainNullableK = chainNullableK;
  function swap(ma) {
    return exports2.isLeft(ma) ? exports2.right(ma.left) : exports2.left(ma.right);
  }
  exports2.swap = swap;
  function orElse(onLeft) {
    return function(ma) {
      return exports2.isLeft(ma) ? onLeft(ma.left) : ma;
    };
  }
  exports2.orElse = orElse;
  var filterOrElseW = function(predicate, onFalse) {
    return exports2.chainW(function(a) {
      return predicate(a) ? exports2.right(a) : exports2.left(onFalse(a));
    });
  };
  exports2.filterOrElseW = filterOrElseW;
  exports2.filterOrElse = exports2.filterOrElseW;
  var map_ = function(fa, f) {
    return function_1.pipe(fa, exports2.map(f));
  };
  var ap_ = function(fab, fa) {
    return function_1.pipe(fab, exports2.ap(fa));
  };
  var chain_ = function(ma, f) {
    return function_1.pipe(ma, exports2.chain(f));
  };
  var reduce_ = function(fa, b, f) {
    return function_1.pipe(fa, exports2.reduce(b, f));
  };
  var foldMap_ = function(M) {
    return function(fa, f) {
      var foldMapM = exports2.foldMap(M);
      return function_1.pipe(fa, foldMapM(f));
    };
  };
  var reduceRight_ = function(fa, b, f) {
    return function_1.pipe(fa, exports2.reduceRight(b, f));
  };
  var traverse_ = function(F) {
    var traverseF = exports2.traverse(F);
    return function(ta, f) {
      return function_1.pipe(ta, traverseF(f));
    };
  };
  var bimap_ = function(fa, f, g) {
    return function_1.pipe(fa, exports2.bimap(f, g));
  };
  var mapLeft_ = function(fa, f) {
    return function_1.pipe(fa, exports2.mapLeft(f));
  };
  var alt_ = function(fa, that) {
    return function_1.pipe(fa, exports2.alt(that));
  };
  var extend_ = function(wa, f) {
    return function_1.pipe(wa, exports2.extend(f));
  };
  var chainRec_ = function(a, f) {
    return ChainRec_1.tailRec(f(a), function(e) {
      return exports2.isLeft(e) ? exports2.right(exports2.left(e.left)) : exports2.isLeft(e.right) ? exports2.left(f(e.right.left)) : exports2.right(exports2.right(e.right.right));
    });
  };
  var map = function(f) {
    return function(fa) {
      return exports2.isLeft(fa) ? fa : exports2.right(f(fa.right));
    };
  };
  exports2.map = map;
  var bimap = function(f, g) {
    return function(fa) {
      return exports2.isLeft(fa) ? exports2.left(f(fa.left)) : exports2.right(g(fa.right));
    };
  };
  exports2.bimap = bimap;
  var mapLeft = function(f) {
    return function(fa) {
      return exports2.isLeft(fa) ? exports2.left(f(fa.left)) : fa;
    };
  };
  exports2.mapLeft = mapLeft;
  var apW = function(fa) {
    return function(fab) {
      return exports2.isLeft(fab) ? fab : exports2.isLeft(fa) ? fa : exports2.right(fab.right(fa.right));
    };
  };
  exports2.apW = apW;
  exports2.ap = exports2.apW;
  var apFirst = function(fb) {
    return function_1.flow(exports2.map(function(a) {
      return function() {
        return a;
      };
    }), exports2.ap(fb));
  };
  exports2.apFirst = apFirst;
  var apSecond = function(fb) {
    return function_1.flow(exports2.map(function() {
      return function(b) {
        return b;
      };
    }), exports2.ap(fb));
  };
  exports2.apSecond = apSecond;
  exports2.of = exports2.right;
  var chainW = function(f) {
    return function(ma) {
      return exports2.isLeft(ma) ? ma : f(ma.right);
    };
  };
  exports2.chainW = chainW;
  exports2.chain = exports2.chainW;
  var chainFirstW = function(f) {
    return function(ma) {
      return function_1.pipe(ma, exports2.chainW(function(a) {
        return function_1.pipe(f(a), exports2.map(function() {
          return a;
        }));
      }));
    };
  };
  exports2.chainFirstW = chainFirstW;
  exports2.chainFirst = exports2.chainFirstW;
  exports2.flatten = /* @__PURE__ */ exports2.chain(function_1.identity);
  var altW = function(that) {
    return function(fa) {
      return exports2.isLeft(fa) ? that() : fa;
    };
  };
  exports2.altW = altW;
  exports2.alt = exports2.altW;
  var extend = function(f) {
    return function(wa) {
      return exports2.isLeft(wa) ? wa : exports2.right(f(wa));
    };
  };
  exports2.extend = extend;
  exports2.duplicate = /* @__PURE__ */ exports2.extend(function_1.identity);
  var reduce = function(b, f) {
    return function(fa) {
      return exports2.isLeft(fa) ? b : f(b, fa.right);
    };
  };
  exports2.reduce = reduce;
  var foldMap = function(M) {
    return function(f) {
      return function(fa) {
        return exports2.isLeft(fa) ? M.empty : f(fa.right);
      };
    };
  };
  exports2.foldMap = foldMap;
  var reduceRight = function(b, f) {
    return function(fa) {
      return exports2.isLeft(fa) ? b : f(fa.right, b);
    };
  };
  exports2.reduceRight = reduceRight;
  var traverse = function(F) {
    return function(f) {
      return function(ta) {
        return exports2.isLeft(ta) ? F.of(exports2.left(ta.left)) : F.map(f(ta.right), exports2.right);
      };
    };
  };
  exports2.traverse = traverse;
  var sequence = function(F) {
    return function(ma) {
      return exports2.isLeft(ma) ? F.of(exports2.left(ma.left)) : F.map(ma.right, exports2.right);
    };
  };
  exports2.sequence = sequence;
  exports2.throwError = exports2.left;
  exports2.URI = "Either";
  function getShow(SE, SA) {
    return {
      show: function(ma) {
        return exports2.isLeft(ma) ? "left(" + SE.show(ma.left) + ")" : "right(" + SA.show(ma.right) + ")";
      }
    };
  }
  exports2.getShow = getShow;
  function getEq(EL, EA) {
    return {
      equals: function(x, y) {
        return x === y || (exports2.isLeft(x) ? exports2.isLeft(y) && EL.equals(x.left, y.left) : exports2.isRight(y) && EA.equals(x.right, y.right));
      }
    };
  }
  exports2.getEq = getEq;
  function getSemigroup(S) {
    return {
      concat: function(x, y) {
        return exports2.isLeft(y) ? x : exports2.isLeft(x) ? y : exports2.right(S.concat(x.right, y.right));
      }
    };
  }
  exports2.getSemigroup = getSemigroup;
  function getApplySemigroup(S) {
    return {
      concat: function(x, y) {
        return exports2.isLeft(x) ? x : exports2.isLeft(y) ? y : exports2.right(S.concat(x.right, y.right));
      }
    };
  }
  exports2.getApplySemigroup = getApplySemigroup;
  function getApplyMonoid(M) {
    return {
      concat: getApplySemigroup(M).concat,
      empty: exports2.right(M.empty)
    };
  }
  exports2.getApplyMonoid = getApplyMonoid;
  function getFilterable(M) {
    var empty = exports2.left(M.empty);
    var compact = function(ma) {
      return exports2.isLeft(ma) ? ma : ma.right._tag === "None" ? empty : exports2.right(ma.right.value);
    };
    var separate = function(ma) {
      return exports2.isLeft(ma) ? {left: ma, right: ma} : exports2.isLeft(ma.right) ? {left: exports2.right(ma.right.left), right: empty} : {left: empty, right: exports2.right(ma.right.right)};
    };
    var partitionMap = function(ma, f) {
      if (exports2.isLeft(ma)) {
        return {left: ma, right: ma};
      }
      var e = f(ma.right);
      return exports2.isLeft(e) ? {left: exports2.right(e.left), right: empty} : {left: empty, right: exports2.right(e.right)};
    };
    var partition = function(ma, p) {
      return exports2.isLeft(ma) ? {left: ma, right: ma} : p(ma.right) ? {left: empty, right: exports2.right(ma.right)} : {left: exports2.right(ma.right), right: empty};
    };
    var filterMap = function(ma, f) {
      if (exports2.isLeft(ma)) {
        return ma;
      }
      var ob = f(ma.right);
      return ob._tag === "None" ? empty : exports2.right(ob.value);
    };
    var filter = function(ma, predicate) {
      return exports2.isLeft(ma) ? ma : predicate(ma.right) ? ma : empty;
    };
    return {
      URI: exports2.URI,
      _E: void 0,
      map: map_,
      compact,
      separate,
      filter,
      filterMap,
      partition,
      partitionMap
    };
  }
  exports2.getFilterable = getFilterable;
  function getWitherable(M) {
    var F_ = getFilterable(M);
    var wither = function(F) {
      var traverseF = traverse_(F);
      return function(ma, f) {
        return F.map(traverseF(ma, f), F_.compact);
      };
    };
    var wilt = function(F) {
      var traverseF = traverse_(F);
      return function(ma, f) {
        return F.map(traverseF(ma, f), F_.separate);
      };
    };
    return {
      URI: exports2.URI,
      _E: void 0,
      map: map_,
      compact: F_.compact,
      separate: F_.separate,
      filter: F_.filter,
      filterMap: F_.filterMap,
      partition: F_.partition,
      partitionMap: F_.partitionMap,
      traverse: traverse_,
      sequence: exports2.sequence,
      reduce: reduce_,
      foldMap: foldMap_,
      reduceRight: reduceRight_,
      wither,
      wilt
    };
  }
  exports2.getWitherable = getWitherable;
  function getApplicativeValidation(SE) {
    return {
      URI: exports2.URI,
      _E: void 0,
      map: map_,
      ap: function(fab, fa) {
        return exports2.isLeft(fab) ? exports2.isLeft(fa) ? exports2.left(SE.concat(fab.left, fa.left)) : fab : exports2.isLeft(fa) ? fa : exports2.right(fab.right(fa.right));
      },
      of: exports2.of
    };
  }
  exports2.getApplicativeValidation = getApplicativeValidation;
  function getAltValidation(SE) {
    return {
      URI: exports2.URI,
      _E: void 0,
      map: map_,
      alt: function(me, that) {
        if (exports2.isRight(me)) {
          return me;
        }
        var ea = that();
        return exports2.isLeft(ea) ? exports2.left(SE.concat(me.left, ea.left)) : ea;
      }
    };
  }
  exports2.getAltValidation = getAltValidation;
  function getValidation(SE) {
    var applicativeValidation = getApplicativeValidation(SE);
    var altValidation = getAltValidation(SE);
    return {
      URI: exports2.URI,
      _E: void 0,
      map: map_,
      of: exports2.of,
      chain: chain_,
      bimap: bimap_,
      mapLeft: mapLeft_,
      reduce: reduce_,
      foldMap: foldMap_,
      reduceRight: reduceRight_,
      extend: extend_,
      traverse: traverse_,
      sequence: exports2.sequence,
      chainRec: chainRec_,
      throwError: exports2.throwError,
      ap: applicativeValidation.ap,
      alt: altValidation.alt
    };
  }
  exports2.getValidation = getValidation;
  function getValidationSemigroup(SE, SA) {
    return {
      concat: function(x, y) {
        return exports2.isLeft(x) ? exports2.isLeft(y) ? exports2.left(SE.concat(x.left, y.left)) : x : exports2.isLeft(y) ? y : exports2.right(SA.concat(x.right, y.right));
      }
    };
  }
  exports2.getValidationSemigroup = getValidationSemigroup;
  exports2.Functor = {
    URI: exports2.URI,
    map: map_
  };
  exports2.Applicative = {
    URI: exports2.URI,
    map: map_,
    ap: ap_,
    of: exports2.of
  };
  exports2.Monad = {
    URI: exports2.URI,
    map: map_,
    ap: ap_,
    of: exports2.of,
    chain: chain_
  };
  exports2.Foldable = {
    URI: exports2.URI,
    reduce: reduce_,
    foldMap: foldMap_,
    reduceRight: reduceRight_
  };
  exports2.Traversable = {
    URI: exports2.URI,
    map: map_,
    reduce: reduce_,
    foldMap: foldMap_,
    reduceRight: reduceRight_,
    traverse: traverse_,
    sequence: exports2.sequence
  };
  exports2.Bifunctor = {
    URI: exports2.URI,
    bimap: bimap_,
    mapLeft: mapLeft_
  };
  exports2.Alt = {
    URI: exports2.URI,
    map: map_,
    alt: alt_
  };
  exports2.Extend = {
    URI: exports2.URI,
    map: map_,
    extend: extend_
  };
  exports2.ChainRec = {
    URI: exports2.URI,
    map: map_,
    ap: ap_,
    chain: chain_,
    chainRec: chainRec_
  };
  exports2.MonadThrow = {
    URI: exports2.URI,
    map: map_,
    ap: ap_,
    of: exports2.of,
    chain: chain_,
    throwError: exports2.throwError
  };
  function getValidationMonoid(SE, SA) {
    return {
      concat: getValidationSemigroup(SE, SA).concat,
      empty: exports2.right(SA.empty)
    };
  }
  exports2.getValidationMonoid = getValidationMonoid;
  exports2.either = {
    URI: exports2.URI,
    map: map_,
    of: exports2.of,
    ap: ap_,
    chain: chain_,
    reduce: reduce_,
    foldMap: foldMap_,
    reduceRight: reduceRight_,
    traverse: traverse_,
    sequence: exports2.sequence,
    bimap: bimap_,
    mapLeft: mapLeft_,
    alt: alt_,
    extend: extend_,
    chainRec: chainRec_,
    throwError: exports2.throwError
  };
  function toError(e) {
    return e instanceof Error ? e : new Error(String(e));
  }
  exports2.toError = toError;
  function elem(E) {
    return function(a, ma) {
      return exports2.isLeft(ma) ? false : E.equals(a, ma.right);
    };
  }
  exports2.elem = elem;
  function exists(predicate) {
    return function(ma) {
      return exports2.isLeft(ma) ? false : predicate(ma.right);
    };
  }
  exports2.exists = exists;
  exports2.Do = /* @__PURE__ */ exports2.of({});
  var bindTo = function(name) {
    return exports2.map(function_1.bindTo_(name));
  };
  exports2.bindTo = bindTo;
  var bindW = function(name, f) {
    return exports2.chainW(function(a) {
      return function_1.pipe(f(a), exports2.map(function(b) {
        return function_1.bind_(a, name, b);
      }));
    });
  };
  exports2.bindW = bindW;
  exports2.bind = exports2.bindW;
  var apSW = function(name, fb) {
    return function_1.flow(exports2.map(function(a) {
      return function(b) {
        return function_1.bind_(a, name, b);
      };
    }), exports2.apW(fb));
  };
  exports2.apSW = apSW;
  exports2.apS = exports2.apSW;
  var traverseArrayWithIndex = function(f) {
    return function(arr) {
      var result = [];
      for (var i = 0; i < arr.length; i++) {
        var e = f(i, arr[i]);
        if (e._tag === "Left") {
          return e;
        }
        result.push(e.right);
      }
      return exports2.right(result);
    };
  };
  exports2.traverseArrayWithIndex = traverseArrayWithIndex;
  var traverseArray = function(f) {
    return exports2.traverseArrayWithIndex(function(_, a) {
      return f(a);
    });
  };
  exports2.traverseArray = traverseArray;
  exports2.sequenceArray = /* @__PURE__ */ exports2.traverseArray(function_1.identity);
});

// node_modules/braces/lib/utils.js
var require_utils = __commonJS((exports2) => {
  "use strict";
  exports2.isInteger = (num) => {
    if (typeof num === "number") {
      return Number.isInteger(num);
    }
    if (typeof num === "string" && num.trim() !== "") {
      return Number.isInteger(Number(num));
    }
    return false;
  };
  exports2.find = (node, type2) => node.nodes.find((node2) => node2.type === type2);
  exports2.exceedsLimit = (min, max, step = 1, limit) => {
    if (limit === false)
      return false;
    if (!exports2.isInteger(min) || !exports2.isInteger(max))
      return false;
    return (Number(max) - Number(min)) / Number(step) >= limit;
  };
  exports2.escapeNode = (block, n = 0, type2) => {
    let node = block.nodes[n];
    if (!node)
      return;
    if (type2 && node.type === type2 || node.type === "open" || node.type === "close") {
      if (node.escaped !== true) {
        node.value = "\\" + node.value;
        node.escaped = true;
      }
    }
  };
  exports2.encloseBrace = (node) => {
    if (node.type !== "brace")
      return false;
    if (node.commas >> 0 + node.ranges >> 0 === 0) {
      node.invalid = true;
      return true;
    }
    return false;
  };
  exports2.isInvalidBrace = (block) => {
    if (block.type !== "brace")
      return false;
    if (block.invalid === true || block.dollar)
      return true;
    if (block.commas >> 0 + block.ranges >> 0 === 0) {
      block.invalid = true;
      return true;
    }
    if (block.open !== true || block.close !== true) {
      block.invalid = true;
      return true;
    }
    return false;
  };
  exports2.isOpenOrClose = (node) => {
    if (node.type === "open" || node.type === "close") {
      return true;
    }
    return node.open === true || node.close === true;
  };
  exports2.reduce = (nodes) => nodes.reduce((acc, node) => {
    if (node.type === "text")
      acc.push(node.value);
    if (node.type === "range")
      node.type = "text";
    return acc;
  }, []);
  exports2.flatten = (...args) => {
    const result = [];
    const flat = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        let ele = arr[i];
        Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
      }
      return result;
    };
    flat(args);
    return result;
  };
});

// node_modules/braces/lib/stringify.js
var require_stringify2 = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  module2.exports = (ast, options = {}) => {
    let stringify = (node, parent = {}) => {
      let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
      let invalidNode = node.invalid === true && options.escapeInvalid === true;
      let output = "";
      if (node.value) {
        if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
          return "\\" + node.value;
        }
        return node.value;
      }
      if (node.value) {
        return node.value;
      }
      if (node.nodes) {
        for (let child of node.nodes) {
          output += stringify(child);
        }
      }
      return output;
    };
    return stringify(ast);
  };
});

// node_modules/is-number/index.js
var require_is_number = __commonJS((exports2, module2) => {
  /*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Released under the MIT License.
   */
  "use strict";
  module2.exports = function(num) {
    if (typeof num === "number") {
      return num - num === 0;
    }
    if (typeof num === "string" && num.trim() !== "") {
      return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
  };
});

// node_modules/to-regex-range/index.js
var require_to_regex_range = __commonJS((exports2, module2) => {
  /*!
   * to-regex-range <https://github.com/micromatch/to-regex-range>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   */
  "use strict";
  var isNumber = require_is_number();
  var toRegexRange = (min, max, options) => {
    if (isNumber(min) === false) {
      throw new TypeError("toRegexRange: expected the first argument to be a number");
    }
    if (max === void 0 || min === max) {
      return String(min);
    }
    if (isNumber(max) === false) {
      throw new TypeError("toRegexRange: expected the second argument to be a number.");
    }
    let opts = {relaxZeros: true, ...options};
    if (typeof opts.strictZeros === "boolean") {
      opts.relaxZeros = opts.strictZeros === false;
    }
    let relax = String(opts.relaxZeros);
    let shorthand = String(opts.shorthand);
    let capture2 = String(opts.capture);
    let wrap = String(opts.wrap);
    let cacheKey = min + ":" + max + "=" + relax + shorthand + capture2 + wrap;
    if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
      return toRegexRange.cache[cacheKey].result;
    }
    let a = Math.min(min, max);
    let b = Math.max(min, max);
    if (Math.abs(a - b) === 1) {
      let result = min + "|" + max;
      if (opts.capture) {
        return `(${result})`;
      }
      if (opts.wrap === false) {
        return result;
      }
      return `(?:${result})`;
    }
    let isPadded = hasPadding(min) || hasPadding(max);
    let state = {min, max, a, b};
    let positives = [];
    let negatives = [];
    if (isPadded) {
      state.isPadded = isPadded;
      state.maxLen = String(state.max).length;
    }
    if (a < 0) {
      let newMin = b < 0 ? Math.abs(b) : 1;
      negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
      a = state.a = 0;
    }
    if (b >= 0) {
      positives = splitToPatterns(a, b, state, opts);
    }
    state.negatives = negatives;
    state.positives = positives;
    state.result = collatePatterns(negatives, positives, opts);
    if (opts.capture === true) {
      state.result = `(${state.result})`;
    } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
      state.result = `(?:${state.result})`;
    }
    toRegexRange.cache[cacheKey] = state;
    return state.result;
  };
  function collatePatterns(neg, pos, options) {
    let onlyNegative = filterPatterns(neg, pos, "-", false, options) || [];
    let onlyPositive = filterPatterns(pos, neg, "", false, options) || [];
    let intersected = filterPatterns(neg, pos, "-?", true, options) || [];
    let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
    return subpatterns.join("|");
  }
  function splitToRanges(min, max) {
    let nines = 1;
    let zeros = 1;
    let stop = countNines(min, nines);
    let stops = new Set([max]);
    while (min <= stop && stop <= max) {
      stops.add(stop);
      nines += 1;
      stop = countNines(min, nines);
    }
    stop = countZeros(max + 1, zeros) - 1;
    while (min < stop && stop <= max) {
      stops.add(stop);
      zeros += 1;
      stop = countZeros(max + 1, zeros) - 1;
    }
    stops = [...stops];
    stops.sort(compare);
    return stops;
  }
  function rangeToPattern(start, stop, options) {
    if (start === stop) {
      return {pattern: start, count: [], digits: 0};
    }
    let zipped = zip(start, stop);
    let digits = zipped.length;
    let pattern = "";
    let count = 0;
    for (let i = 0; i < digits; i++) {
      let [startDigit, stopDigit] = zipped[i];
      if (startDigit === stopDigit) {
        pattern += startDigit;
      } else if (startDigit !== "0" || stopDigit !== "9") {
        pattern += toCharacterClass(startDigit, stopDigit, options);
      } else {
        count++;
      }
    }
    if (count) {
      pattern += options.shorthand === true ? "\\d" : "[0-9]";
    }
    return {pattern, count: [count], digits};
  }
  function splitToPatterns(min, max, tok, options) {
    let ranges = splitToRanges(min, max);
    let tokens = [];
    let start = min;
    let prev;
    for (let i = 0; i < ranges.length; i++) {
      let max2 = ranges[i];
      let obj = rangeToPattern(String(start), String(max2), options);
      let zeros = "";
      if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
        if (prev.count.length > 1) {
          prev.count.pop();
        }
        prev.count.push(obj.count[0]);
        prev.string = prev.pattern + toQuantifier(prev.count);
        start = max2 + 1;
        continue;
      }
      if (tok.isPadded) {
        zeros = padZeros(max2, tok, options);
      }
      obj.string = zeros + obj.pattern + toQuantifier(obj.count);
      tokens.push(obj);
      start = max2 + 1;
      prev = obj;
    }
    return tokens;
  }
  function filterPatterns(arr, comparison, prefix, intersection2, options) {
    let result = [];
    for (let ele of arr) {
      let {string: string2} = ele;
      if (!intersection2 && !contains(comparison, "string", string2)) {
        result.push(prefix + string2);
      }
      if (intersection2 && contains(comparison, "string", string2)) {
        result.push(prefix + string2);
      }
    }
    return result;
  }
  function zip(a, b) {
    let arr = [];
    for (let i = 0; i < a.length; i++)
      arr.push([a[i], b[i]]);
    return arr;
  }
  function compare(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
  }
  function contains(arr, key, val) {
    return arr.some((ele) => ele[key] === val);
  }
  function countNines(min, len) {
    return Number(String(min).slice(0, -len) + "9".repeat(len));
  }
  function countZeros(integer, zeros) {
    return integer - integer % Math.pow(10, zeros);
  }
  function toQuantifier(digits) {
    let [start = 0, stop = ""] = digits;
    if (stop || start > 1) {
      return `{${start + (stop ? "," + stop : "")}}`;
    }
    return "";
  }
  function toCharacterClass(a, b, options) {
    return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
  }
  function hasPadding(str) {
    return /^-?(0+)\d/.test(str);
  }
  function padZeros(value, tok, options) {
    if (!tok.isPadded) {
      return value;
    }
    let diff = Math.abs(tok.maxLen - String(value).length);
    let relax = options.relaxZeros !== false;
    switch (diff) {
      case 0:
        return "";
      case 1:
        return relax ? "0?" : "0";
      case 2:
        return relax ? "0{0,2}" : "00";
      default: {
        return relax ? `0{0,${diff}}` : `0{${diff}}`;
      }
    }
  }
  toRegexRange.cache = {};
  toRegexRange.clearCache = () => toRegexRange.cache = {};
  module2.exports = toRegexRange;
});

// node_modules/fill-range/index.js
var require_fill_range = __commonJS((exports2, module2) => {
  /*!
   * fill-range <https://github.com/jonschlinkert/fill-range>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Licensed under the MIT License.
   */
  "use strict";
  var util2 = require("util");
  var toRegexRange = require_to_regex_range();
  var isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  var transform = (toNumber) => {
    return (value) => toNumber === true ? Number(value) : String(value);
  };
  var isValidValue = (value) => {
    return typeof value === "number" || typeof value === "string" && value !== "";
  };
  var isNumber = (num) => Number.isInteger(+num);
  var zeros = (input) => {
    let value = `${input}`;
    let index = -1;
    if (value[0] === "-")
      value = value.slice(1);
    if (value === "0")
      return false;
    while (value[++index] === "0")
      ;
    return index > 0;
  };
  var stringify = (start, end, options) => {
    if (typeof start === "string" || typeof end === "string") {
      return true;
    }
    return options.stringify === true;
  };
  var pad = (input, maxLength, toNumber) => {
    if (maxLength > 0) {
      let dash = input[0] === "-" ? "-" : "";
      if (dash)
        input = input.slice(1);
      input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
    }
    if (toNumber === false) {
      return String(input);
    }
    return input;
  };
  var toMaxLen = (input, maxLength) => {
    let negative = input[0] === "-" ? "-" : "";
    if (negative) {
      input = input.slice(1);
      maxLength--;
    }
    while (input.length < maxLength)
      input = "0" + input;
    return negative ? "-" + input : input;
  };
  var toSequence = (parts, options) => {
    parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    let prefix = options.capture ? "" : "?:";
    let positives = "";
    let negatives = "";
    let result;
    if (parts.positives.length) {
      positives = parts.positives.join("|");
    }
    if (parts.negatives.length) {
      negatives = `-(${prefix}${parts.negatives.join("|")})`;
    }
    if (positives && negatives) {
      result = `${positives}|${negatives}`;
    } else {
      result = positives || negatives;
    }
    if (options.wrap) {
      return `(${prefix}${result})`;
    }
    return result;
  };
  var toRange = (a, b, isNumbers, options) => {
    if (isNumbers) {
      return toRegexRange(a, b, {wrap: false, ...options});
    }
    let start = String.fromCharCode(a);
    if (a === b)
      return start;
    let stop = String.fromCharCode(b);
    return `[${start}-${stop}]`;
  };
  var toRegex = (start, end, options) => {
    if (Array.isArray(start)) {
      let wrap = options.wrap === true;
      let prefix = options.capture ? "" : "?:";
      return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
    }
    return toRegexRange(start, end, options);
  };
  var rangeError = (...args) => {
    return new RangeError("Invalid range arguments: " + util2.inspect(...args));
  };
  var invalidRange = (start, end, options) => {
    if (options.strictRanges === true)
      throw rangeError([start, end]);
    return [];
  };
  var invalidStep = (step, options) => {
    if (options.strictRanges === true) {
      throw new TypeError(`Expected step "${step}" to be a number`);
    }
    return [];
  };
  var fillNumbers = (start, end, step = 1, options = {}) => {
    let a = Number(start);
    let b = Number(end);
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      if (options.strictRanges === true)
        throw rangeError([start, end]);
      return [];
    }
    if (a === 0)
      a = 0;
    if (b === 0)
      b = 0;
    let descending = a > b;
    let startString = String(start);
    let endString = String(end);
    let stepString = String(step);
    step = Math.max(Math.abs(step), 1);
    let padded = zeros(startString) || zeros(endString) || zeros(stepString);
    let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
    let toNumber = padded === false && stringify(start, end, options) === false;
    let format = options.transform || transform(toNumber);
    if (options.toRegex && step === 1) {
      return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
    }
    let parts = {negatives: [], positives: []};
    let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
    let range = [];
    let index = 0;
    while (descending ? a >= b : a <= b) {
      if (options.toRegex === true && step > 1) {
        push(a);
      } else {
        range.push(pad(format(a, index), maxLen, toNumber));
      }
      a = descending ? a - step : a + step;
      index++;
    }
    if (options.toRegex === true) {
      return step > 1 ? toSequence(parts, options) : toRegex(range, null, {wrap: false, ...options});
    }
    return range;
  };
  var fillLetters = (start, end, step = 1, options = {}) => {
    if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) {
      return invalidRange(start, end, options);
    }
    let format = options.transform || ((val) => String.fromCharCode(val));
    let a = `${start}`.charCodeAt(0);
    let b = `${end}`.charCodeAt(0);
    let descending = a > b;
    let min = Math.min(a, b);
    let max = Math.max(a, b);
    if (options.toRegex && step === 1) {
      return toRange(min, max, false, options);
    }
    let range = [];
    let index = 0;
    while (descending ? a >= b : a <= b) {
      range.push(format(a, index));
      a = descending ? a - step : a + step;
      index++;
    }
    if (options.toRegex === true) {
      return toRegex(range, null, {wrap: false, options});
    }
    return range;
  };
  var fill = (start, end, step, options = {}) => {
    if (end == null && isValidValue(start)) {
      return [start];
    }
    if (!isValidValue(start) || !isValidValue(end)) {
      return invalidRange(start, end, options);
    }
    if (typeof step === "function") {
      return fill(start, end, 1, {transform: step});
    }
    if (isObject(step)) {
      return fill(start, end, 0, step);
    }
    let opts = {...options};
    if (opts.capture === true)
      opts.wrap = true;
    step = step || opts.step || 1;
    if (!isNumber(step)) {
      if (step != null && !isObject(step))
        return invalidStep(step, opts);
      return fill(start, end, 1, step);
    }
    if (isNumber(start) && isNumber(end)) {
      return fillNumbers(start, end, step, opts);
    }
    return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
  };
  module2.exports = fill;
});

// node_modules/braces/lib/compile.js
var require_compile = __commonJS((exports2, module2) => {
  "use strict";
  var fill = require_fill_range();
  var utils = require_utils();
  var compile = (ast, options = {}) => {
    let walk = (node, parent = {}) => {
      let invalidBlock = utils.isInvalidBrace(parent);
      let invalidNode = node.invalid === true && options.escapeInvalid === true;
      let invalid = invalidBlock === true || invalidNode === true;
      let prefix = options.escapeInvalid === true ? "\\" : "";
      let output = "";
      if (node.isOpen === true) {
        return prefix + node.value;
      }
      if (node.isClose === true) {
        return prefix + node.value;
      }
      if (node.type === "open") {
        return invalid ? prefix + node.value : "(";
      }
      if (node.type === "close") {
        return invalid ? prefix + node.value : ")";
      }
      if (node.type === "comma") {
        return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
      }
      if (node.value) {
        return node.value;
      }
      if (node.nodes && node.ranges > 0) {
        let args = utils.reduce(node.nodes);
        let range = fill(...args, {...options, wrap: false, toRegex: true});
        if (range.length !== 0) {
          return args.length > 1 && range.length > 1 ? `(${range})` : range;
        }
      }
      if (node.nodes) {
        for (let child of node.nodes) {
          output += walk(child, node);
        }
      }
      return output;
    };
    return walk(ast);
  };
  module2.exports = compile;
});

// node_modules/braces/lib/expand.js
var require_expand = __commonJS((exports2, module2) => {
  "use strict";
  var fill = require_fill_range();
  var stringify = require_stringify2();
  var utils = require_utils();
  var append = (queue = "", stash = "", enclose = false) => {
    let result = [];
    queue = [].concat(queue);
    stash = [].concat(stash);
    if (!stash.length)
      return queue;
    if (!queue.length) {
      return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
    }
    for (let item of queue) {
      if (Array.isArray(item)) {
        for (let value of item) {
          result.push(append(value, stash, enclose));
        }
      } else {
        for (let ele of stash) {
          if (enclose === true && typeof ele === "string")
            ele = `{${ele}}`;
          result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
        }
      }
    }
    return utils.flatten(result);
  };
  var expand = (ast, options = {}) => {
    let rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
    let walk = (node, parent = {}) => {
      node.queue = [];
      let p = parent;
      let q = parent.queue;
      while (p.type !== "brace" && p.type !== "root" && p.parent) {
        p = p.parent;
        q = p.queue;
      }
      if (node.invalid || node.dollar) {
        q.push(append(q.pop(), stringify(node, options)));
        return;
      }
      if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
        q.push(append(q.pop(), ["{}"]));
        return;
      }
      if (node.nodes && node.ranges > 0) {
        let args = utils.reduce(node.nodes);
        if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
          throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
        }
        let range = fill(...args, options);
        if (range.length === 0) {
          range = stringify(node, options);
        }
        q.push(append(q.pop(), range));
        node.nodes = [];
        return;
      }
      let enclose = utils.encloseBrace(node);
      let queue = node.queue;
      let block = node;
      while (block.type !== "brace" && block.type !== "root" && block.parent) {
        block = block.parent;
        queue = block.queue;
      }
      for (let i = 0; i < node.nodes.length; i++) {
        let child = node.nodes[i];
        if (child.type === "comma" && node.type === "brace") {
          if (i === 1)
            queue.push("");
          queue.push("");
          continue;
        }
        if (child.type === "close") {
          q.push(append(q.pop(), queue, enclose));
          continue;
        }
        if (child.value && child.type !== "open") {
          queue.push(append(queue.pop(), child.value));
          continue;
        }
        if (child.nodes) {
          walk(child, node);
        }
      }
      return queue;
    };
    return utils.flatten(walk(ast));
  };
  module2.exports = expand;
});

// node_modules/braces/lib/constants.js
var require_constants = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = {
    MAX_LENGTH: 1024 * 64,
    CHAR_0: "0",
    CHAR_9: "9",
    CHAR_UPPERCASE_A: "A",
    CHAR_LOWERCASE_A: "a",
    CHAR_UPPERCASE_Z: "Z",
    CHAR_LOWERCASE_Z: "z",
    CHAR_LEFT_PARENTHESES: "(",
    CHAR_RIGHT_PARENTHESES: ")",
    CHAR_ASTERISK: "*",
    CHAR_AMPERSAND: "&",
    CHAR_AT: "@",
    CHAR_BACKSLASH: "\\",
    CHAR_BACKTICK: "`",
    CHAR_CARRIAGE_RETURN: "\r",
    CHAR_CIRCUMFLEX_ACCENT: "^",
    CHAR_COLON: ":",
    CHAR_COMMA: ",",
    CHAR_DOLLAR: "$",
    CHAR_DOT: ".",
    CHAR_DOUBLE_QUOTE: '"',
    CHAR_EQUAL: "=",
    CHAR_EXCLAMATION_MARK: "!",
    CHAR_FORM_FEED: "\f",
    CHAR_FORWARD_SLASH: "/",
    CHAR_HASH: "#",
    CHAR_HYPHEN_MINUS: "-",
    CHAR_LEFT_ANGLE_BRACKET: "<",
    CHAR_LEFT_CURLY_BRACE: "{",
    CHAR_LEFT_SQUARE_BRACKET: "[",
    CHAR_LINE_FEED: "\n",
    CHAR_NO_BREAK_SPACE: "\xA0",
    CHAR_PERCENT: "%",
    CHAR_PLUS: "+",
    CHAR_QUESTION_MARK: "?",
    CHAR_RIGHT_ANGLE_BRACKET: ">",
    CHAR_RIGHT_CURLY_BRACE: "}",
    CHAR_RIGHT_SQUARE_BRACKET: "]",
    CHAR_SEMICOLON: ";",
    CHAR_SINGLE_QUOTE: "'",
    CHAR_SPACE: " ",
    CHAR_TAB: "	",
    CHAR_UNDERSCORE: "_",
    CHAR_VERTICAL_LINE: "|",
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
  };
});

// node_modules/braces/lib/parse.js
var require_parse2 = __commonJS((exports2, module2) => {
  "use strict";
  var stringify = require_stringify2();
  var {
    MAX_LENGTH,
    CHAR_BACKSLASH,
    CHAR_BACKTICK,
    CHAR_COMMA: CHAR_COMMA2,
    CHAR_DOT,
    CHAR_LEFT_PARENTHESES,
    CHAR_RIGHT_PARENTHESES,
    CHAR_LEFT_CURLY_BRACE,
    CHAR_RIGHT_CURLY_BRACE,
    CHAR_LEFT_SQUARE_BRACKET,
    CHAR_RIGHT_SQUARE_BRACKET,
    CHAR_DOUBLE_QUOTE,
    CHAR_SINGLE_QUOTE,
    CHAR_NO_BREAK_SPACE,
    CHAR_ZERO_WIDTH_NOBREAK_SPACE
  } = require_constants();
  var parse2 = (input, options = {}) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected a string");
    }
    let opts = options || {};
    let max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    if (input.length > max) {
      throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
    }
    let ast = {type: "root", input, nodes: []};
    let stack = [ast];
    let block = ast;
    let prev = ast;
    let brackets = 0;
    let length = input.length;
    let index = 0;
    let depth = 0;
    let value;
    let memo = {};
    const advance = () => input[index++];
    const push = (node) => {
      if (node.type === "text" && prev.type === "dot") {
        prev.type = "text";
      }
      if (prev && prev.type === "text" && node.type === "text") {
        prev.value += node.value;
        return;
      }
      block.nodes.push(node);
      node.parent = block;
      node.prev = prev;
      prev = node;
      return node;
    };
    push({type: "bos"});
    while (index < length) {
      block = stack[stack.length - 1];
      value = advance();
      if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
        continue;
      }
      if (value === CHAR_BACKSLASH) {
        push({type: "text", value: (options.keepEscaping ? value : "") + advance()});
        continue;
      }
      if (value === CHAR_RIGHT_SQUARE_BRACKET) {
        push({type: "text", value: "\\" + value});
        continue;
      }
      if (value === CHAR_LEFT_SQUARE_BRACKET) {
        brackets++;
        let closed = true;
        let next;
        while (index < length && (next = advance())) {
          value += next;
          if (next === CHAR_LEFT_SQUARE_BRACKET) {
            brackets++;
            continue;
          }
          if (next === CHAR_BACKSLASH) {
            value += advance();
            continue;
          }
          if (next === CHAR_RIGHT_SQUARE_BRACKET) {
            brackets--;
            if (brackets === 0) {
              break;
            }
          }
        }
        push({type: "text", value});
        continue;
      }
      if (value === CHAR_LEFT_PARENTHESES) {
        block = push({type: "paren", nodes: []});
        stack.push(block);
        push({type: "text", value});
        continue;
      }
      if (value === CHAR_RIGHT_PARENTHESES) {
        if (block.type !== "paren") {
          push({type: "text", value});
          continue;
        }
        block = stack.pop();
        push({type: "text", value});
        block = stack[stack.length - 1];
        continue;
      }
      if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
        let open = value;
        let next;
        if (options.keepQuotes !== true) {
          value = "";
        }
        while (index < length && (next = advance())) {
          if (next === CHAR_BACKSLASH) {
            value += next + advance();
            continue;
          }
          if (next === open) {
            if (options.keepQuotes === true)
              value += next;
            break;
          }
          value += next;
        }
        push({type: "text", value});
        continue;
      }
      if (value === CHAR_LEFT_CURLY_BRACE) {
        depth++;
        let dollar = prev.value && prev.value.slice(-1) === "$" || block.dollar === true;
        let brace = {
          type: "brace",
          open: true,
          close: false,
          dollar,
          depth,
          commas: 0,
          ranges: 0,
          nodes: []
        };
        block = push(brace);
        stack.push(block);
        push({type: "open", value});
        continue;
      }
      if (value === CHAR_RIGHT_CURLY_BRACE) {
        if (block.type !== "brace") {
          push({type: "text", value});
          continue;
        }
        let type2 = "close";
        block = stack.pop();
        block.close = true;
        push({type: type2, value});
        depth--;
        block = stack[stack.length - 1];
        continue;
      }
      if (value === CHAR_COMMA2 && depth > 0) {
        if (block.ranges > 0) {
          block.ranges = 0;
          let open = block.nodes.shift();
          block.nodes = [open, {type: "text", value: stringify(block)}];
        }
        push({type: "comma", value});
        block.commas++;
        continue;
      }
      if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
        let siblings = block.nodes;
        if (depth === 0 || siblings.length === 0) {
          push({type: "text", value});
          continue;
        }
        if (prev.type === "dot") {
          block.range = [];
          prev.value += value;
          prev.type = "range";
          if (block.nodes.length !== 3 && block.nodes.length !== 5) {
            block.invalid = true;
            block.ranges = 0;
            prev.type = "text";
            continue;
          }
          block.ranges++;
          block.args = [];
          continue;
        }
        if (prev.type === "range") {
          siblings.pop();
          let before = siblings[siblings.length - 1];
          before.value += prev.value + value;
          prev = before;
          block.ranges--;
          continue;
        }
        push({type: "dot", value});
        continue;
      }
      push({type: "text", value});
    }
    do {
      block = stack.pop();
      if (block.type !== "root") {
        block.nodes.forEach((node) => {
          if (!node.nodes) {
            if (node.type === "open")
              node.isOpen = true;
            if (node.type === "close")
              node.isClose = true;
            if (!node.nodes)
              node.type = "text";
            node.invalid = true;
          }
        });
        let parent = stack[stack.length - 1];
        let index2 = parent.nodes.indexOf(block);
        parent.nodes.splice(index2, 1, ...block.nodes);
      }
    } while (stack.length > 0);
    push({type: "eos"});
    return ast;
  };
  module2.exports = parse2;
});

// node_modules/braces/index.js
var require_braces = __commonJS((exports2, module2) => {
  "use strict";
  var stringify = require_stringify2();
  var compile = require_compile();
  var expand = require_expand();
  var parse2 = require_parse2();
  var braces = (input, options = {}) => {
    let output = [];
    if (Array.isArray(input)) {
      for (let pattern of input) {
        let result = braces.create(pattern, options);
        if (Array.isArray(result)) {
          output.push(...result);
        } else {
          output.push(result);
        }
      }
    } else {
      output = [].concat(braces.create(input, options));
    }
    if (options && options.expand === true && options.nodupes === true) {
      output = [...new Set(output)];
    }
    return output;
  };
  braces.parse = (input, options = {}) => parse2(input, options);
  braces.stringify = (input, options = {}) => {
    if (typeof input === "string") {
      return stringify(braces.parse(input, options), options);
    }
    return stringify(input, options);
  };
  braces.compile = (input, options = {}) => {
    if (typeof input === "string") {
      input = braces.parse(input, options);
    }
    return compile(input, options);
  };
  braces.expand = (input, options = {}) => {
    if (typeof input === "string") {
      input = braces.parse(input, options);
    }
    let result = expand(input, options);
    if (options.noempty === true) {
      result = result.filter(Boolean);
    }
    if (options.nodupes === true) {
      result = [...new Set(result)];
    }
    return result;
  };
  braces.create = (input, options = {}) => {
    if (input === "" || input.length < 3) {
      return [input];
    }
    return options.expand !== true ? braces.compile(input, options) : braces.expand(input, options);
  };
  module2.exports = braces;
});

// node_modules/picomatch/lib/constants.js
var require_constants2 = __commonJS((exports2, module2) => {
  "use strict";
  var path5 = require("path");
  var WIN_SLASH = "\\\\/";
  var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
  var DOT_LITERAL = "\\.";
  var PLUS_LITERAL = "\\+";
  var QMARK_LITERAL = "\\?";
  var SLASH_LITERAL = "\\/";
  var ONE_CHAR = "(?=.)";
  var QMARK = "[^/]";
  var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
  var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
  var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
  var NO_DOT = `(?!${DOT_LITERAL})`;
  var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
  var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
  var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
  var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
  var STAR = `${QMARK}*?`;
  var POSIX_CHARS = {
    DOT_LITERAL,
    PLUS_LITERAL,
    QMARK_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    QMARK,
    END_ANCHOR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  };
  var WINDOWS_CHARS = {
    ...POSIX_CHARS,
    SLASH_LITERAL: `[${WIN_SLASH}]`,
    QMARK: WIN_NO_SLASH,
    STAR: `${WIN_NO_SLASH}*?`,
    DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
    NO_DOT: `(?!${DOT_LITERAL})`,
    NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
    NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
    NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
    QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
    START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
    END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
  };
  var POSIX_REGEX_SOURCE = {
    alnum: "a-zA-Z0-9",
    alpha: "a-zA-Z",
    ascii: "\\x00-\\x7F",
    blank: " \\t",
    cntrl: "\\x00-\\x1F\\x7F",
    digit: "0-9",
    graph: "\\x21-\\x7E",
    lower: "a-z",
    print: "\\x20-\\x7E ",
    punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
    space: " \\t\\r\\n\\v\\f",
    upper: "A-Z",
    word: "A-Za-z0-9_",
    xdigit: "A-Fa-f0-9"
  };
  module2.exports = {
    MAX_LENGTH: 1024 * 64,
    POSIX_REGEX_SOURCE,
    REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
    REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
    REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
    REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
    REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
    REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
    REPLACEMENTS: {
      "***": "*",
      "**/**": "**",
      "**/**/**": "**"
    },
    CHAR_0: 48,
    CHAR_9: 57,
    CHAR_UPPERCASE_A: 65,
    CHAR_LOWERCASE_A: 97,
    CHAR_UPPERCASE_Z: 90,
    CHAR_LOWERCASE_Z: 122,
    CHAR_LEFT_PARENTHESES: 40,
    CHAR_RIGHT_PARENTHESES: 41,
    CHAR_ASTERISK: 42,
    CHAR_AMPERSAND: 38,
    CHAR_AT: 64,
    CHAR_BACKWARD_SLASH: 92,
    CHAR_CARRIAGE_RETURN: 13,
    CHAR_CIRCUMFLEX_ACCENT: 94,
    CHAR_COLON: 58,
    CHAR_COMMA: 44,
    CHAR_DOT: 46,
    CHAR_DOUBLE_QUOTE: 34,
    CHAR_EQUAL: 61,
    CHAR_EXCLAMATION_MARK: 33,
    CHAR_FORM_FEED: 12,
    CHAR_FORWARD_SLASH: 47,
    CHAR_GRAVE_ACCENT: 96,
    CHAR_HASH: 35,
    CHAR_HYPHEN_MINUS: 45,
    CHAR_LEFT_ANGLE_BRACKET: 60,
    CHAR_LEFT_CURLY_BRACE: 123,
    CHAR_LEFT_SQUARE_BRACKET: 91,
    CHAR_LINE_FEED: 10,
    CHAR_NO_BREAK_SPACE: 160,
    CHAR_PERCENT: 37,
    CHAR_PLUS: 43,
    CHAR_QUESTION_MARK: 63,
    CHAR_RIGHT_ANGLE_BRACKET: 62,
    CHAR_RIGHT_CURLY_BRACE: 125,
    CHAR_RIGHT_SQUARE_BRACKET: 93,
    CHAR_SEMICOLON: 59,
    CHAR_SINGLE_QUOTE: 39,
    CHAR_SPACE: 32,
    CHAR_TAB: 9,
    CHAR_UNDERSCORE: 95,
    CHAR_VERTICAL_LINE: 124,
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
    SEP: path5.sep,
    extglobChars(chars) {
      return {
        "!": {type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})`},
        "?": {type: "qmark", open: "(?:", close: ")?"},
        "+": {type: "plus", open: "(?:", close: ")+"},
        "*": {type: "star", open: "(?:", close: ")*"},
        "@": {type: "at", open: "(?:", close: ")"}
      };
    },
    globChars(win32) {
      return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
    }
  };
});

// node_modules/picomatch/lib/utils.js
var require_utils2 = __commonJS((exports2) => {
  "use strict";
  var path5 = require("path");
  var win32 = process.platform === "win32";
  var {
    REGEX_BACKSLASH,
    REGEX_REMOVE_BACKSLASH,
    REGEX_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_GLOBAL
  } = require_constants2();
  exports2.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  exports2.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
  exports2.isRegexChar = (str) => str.length === 1 && exports2.hasRegexChars(str);
  exports2.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
  exports2.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
  exports2.removeBackslashes = (str) => {
    return str.replace(REGEX_REMOVE_BACKSLASH, (match2) => {
      return match2 === "\\" ? "" : match2;
    });
  };
  exports2.supportsLookbehinds = () => {
    const segs = process.version.slice(1).split(".").map(Number);
    if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) {
      return true;
    }
    return false;
  };
  exports2.isWindows = (options) => {
    if (options && typeof options.windows === "boolean") {
      return options.windows;
    }
    return win32 === true || path5.sep === "\\";
  };
  exports2.escapeLast = (input, char, lastIdx) => {
    const idx = input.lastIndexOf(char, lastIdx);
    if (idx === -1)
      return input;
    if (input[idx - 1] === "\\")
      return exports2.escapeLast(input, char, idx - 1);
    return `${input.slice(0, idx)}\\${input.slice(idx)}`;
  };
  exports2.removePrefix = (input, state = {}) => {
    let output = input;
    if (output.startsWith("./")) {
      output = output.slice(2);
      state.prefix = "./";
    }
    return output;
  };
  exports2.wrapOutput = (input, state = {}, options = {}) => {
    const prepend = options.contains ? "" : "^";
    const append = options.contains ? "" : "$";
    let output = `${prepend}(?:${input})${append}`;
    if (state.negated === true) {
      output = `(?:^(?!${output}).*$)`;
    }
    return output;
  };
});

// node_modules/picomatch/lib/scan.js
var require_scan = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils2();
  var {
    CHAR_ASTERISK,
    CHAR_AT,
    CHAR_BACKWARD_SLASH,
    CHAR_COMMA: CHAR_COMMA2,
    CHAR_DOT,
    CHAR_EXCLAMATION_MARK,
    CHAR_FORWARD_SLASH,
    CHAR_LEFT_CURLY_BRACE,
    CHAR_LEFT_PARENTHESES,
    CHAR_LEFT_SQUARE_BRACKET,
    CHAR_PLUS: CHAR_PLUS2,
    CHAR_QUESTION_MARK,
    CHAR_RIGHT_CURLY_BRACE,
    CHAR_RIGHT_PARENTHESES,
    CHAR_RIGHT_SQUARE_BRACKET
  } = require_constants2();
  var isPathSeparator = (code) => {
    return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
  };
  var depth = (token) => {
    if (token.isPrefix !== true) {
      token.depth = token.isGlobstar ? Infinity : 1;
    }
  };
  var scan = (input, options) => {
    const opts = options || {};
    const length = input.length - 1;
    const scanToEnd = opts.parts === true || opts.scanToEnd === true;
    const slashes = [];
    const tokens = [];
    const parts = [];
    let str = input;
    let index = -1;
    let start = 0;
    let lastIndex = 0;
    let isBrace = false;
    let isBracket = false;
    let isGlob = false;
    let isExtglob = false;
    let isGlobstar = false;
    let braceEscaped = false;
    let backslashes = false;
    let negated = false;
    let finished = false;
    let braces = 0;
    let prev;
    let code;
    let token = {value: "", depth: 0, isGlob: false};
    const eos = () => index >= length;
    const peek = () => str.charCodeAt(index + 1);
    const advance = () => {
      prev = code;
      return str.charCodeAt(++index);
    };
    while (index < length) {
      code = advance();
      let next;
      if (code === CHAR_BACKWARD_SLASH) {
        backslashes = token.backslashes = true;
        code = advance();
        if (code === CHAR_LEFT_CURLY_BRACE) {
          braceEscaped = true;
        }
        continue;
      }
      if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
        braces++;
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = true;
            advance();
            continue;
          }
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braces++;
            continue;
          }
          if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
            isBrace = token.isBrace = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
          if (braceEscaped !== true && code === CHAR_COMMA2) {
            isBrace = token.isBrace = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
          if (code === CHAR_RIGHT_CURLY_BRACE) {
            braces--;
            if (braces === 0) {
              braceEscaped = false;
              isBrace = token.isBrace = true;
              finished = true;
              break;
            }
          }
        }
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
      if (code === CHAR_FORWARD_SLASH) {
        slashes.push(index);
        tokens.push(token);
        token = {value: "", depth: 0, isGlob: false};
        if (finished === true)
          continue;
        if (prev === CHAR_DOT && index === start + 1) {
          start += 2;
          continue;
        }
        lastIndex = index + 1;
        continue;
      }
      if (opts.noext !== true) {
        const isExtglobChar = code === CHAR_PLUS2 || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
        if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          isExtglob = token.isExtglob = true;
          finished = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_BACKWARD_SLASH) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                isGlob = token.isGlob = true;
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
      }
      if (code === CHAR_ASTERISK) {
        if (prev === CHAR_ASTERISK)
          isGlobstar = token.isGlobstar = true;
        isGlob = token.isGlob = true;
        finished = true;
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
      if (code === CHAR_QUESTION_MARK) {
        isGlob = token.isGlob = true;
        finished = true;
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
      if (code === CHAR_LEFT_SQUARE_BRACKET) {
        while (eos() !== true && (next = advance())) {
          if (next === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = true;
            advance();
            continue;
          }
          if (next === CHAR_RIGHT_SQUARE_BRACKET) {
            isBracket = token.isBracket = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
        }
      }
      if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
        negated = token.negated = true;
        start++;
        continue;
      }
      if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_LEFT_PARENTHESES) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }
            if (code === CHAR_RIGHT_PARENTHESES) {
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
      if (isGlob === true) {
        finished = true;
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
    }
    if (opts.noext === true) {
      isExtglob = false;
      isGlob = false;
    }
    let base = str;
    let prefix = "";
    let glob = "";
    if (start > 0) {
      prefix = str.slice(0, start);
      str = str.slice(start);
      lastIndex -= start;
    }
    if (base && isGlob === true && lastIndex > 0) {
      base = str.slice(0, lastIndex);
      glob = str.slice(lastIndex);
    } else if (isGlob === true) {
      base = "";
      glob = str;
    } else {
      base = str;
    }
    if (base && base !== "" && base !== "/" && base !== str) {
      if (isPathSeparator(base.charCodeAt(base.length - 1))) {
        base = base.slice(0, -1);
      }
    }
    if (opts.unescape === true) {
      if (glob)
        glob = utils.removeBackslashes(glob);
      if (base && backslashes === true) {
        base = utils.removeBackslashes(base);
      }
    }
    const state = {
      prefix,
      input,
      start,
      base,
      glob,
      isBrace,
      isBracket,
      isGlob,
      isExtglob,
      isGlobstar,
      negated
    };
    if (opts.tokens === true) {
      state.maxDepth = 0;
      if (!isPathSeparator(code)) {
        tokens.push(token);
      }
      state.tokens = tokens;
    }
    if (opts.parts === true || opts.tokens === true) {
      let prevIndex;
      for (let idx = 0; idx < slashes.length; idx++) {
        const n = prevIndex ? prevIndex + 1 : start;
        const i = slashes[idx];
        const value = input.slice(n, i);
        if (opts.tokens) {
          if (idx === 0 && start !== 0) {
            tokens[idx].isPrefix = true;
            tokens[idx].value = prefix;
          } else {
            tokens[idx].value = value;
          }
          depth(tokens[idx]);
          state.maxDepth += tokens[idx].depth;
        }
        if (idx !== 0 || value !== "") {
          parts.push(value);
        }
        prevIndex = i;
      }
      if (prevIndex && prevIndex + 1 < input.length) {
        const value = input.slice(prevIndex + 1);
        parts.push(value);
        if (opts.tokens) {
          tokens[tokens.length - 1].value = value;
          depth(tokens[tokens.length - 1]);
          state.maxDepth += tokens[tokens.length - 1].depth;
        }
      }
      state.slashes = slashes;
      state.parts = parts;
    }
    return state;
  };
  module2.exports = scan;
});

// node_modules/picomatch/lib/parse.js
var require_parse3 = __commonJS((exports2, module2) => {
  "use strict";
  var constants = require_constants2();
  var utils = require_utils2();
  var {
    MAX_LENGTH,
    POSIX_REGEX_SOURCE,
    REGEX_NON_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_BACKREF,
    REPLACEMENTS
  } = constants;
  var expandRange = (args, options) => {
    if (typeof options.expandRange === "function") {
      return options.expandRange(...args, options);
    }
    args.sort();
    const value = `[${args.join("-")}]`;
    try {
      new RegExp(value);
    } catch (ex) {
      return args.map((v) => utils.escapeRegex(v)).join("..");
    }
    return value;
  };
  var syntaxError = (type2, char) => {
    return `Missing ${type2}: "${char}" - use "\\\\${char}" to match literal characters`;
  };
  var parse2 = (input, options) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected a string");
    }
    input = REPLACEMENTS[input] || input;
    const opts = {...options};
    const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    let len = input.length;
    if (len > max) {
      throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    }
    const bos = {type: "bos", value: "", output: opts.prepend || ""};
    const tokens = [bos];
    const capture2 = opts.capture ? "" : "?:";
    const win32 = utils.isWindows(options);
    const PLATFORM_CHARS = constants.globChars(win32);
    const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
    const {
      DOT_LITERAL,
      PLUS_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    } = PLATFORM_CHARS;
    const globstar = (opts2) => {
      return `(${capture2}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const nodot = opts.dot ? "" : NO_DOT;
    const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
    let star = opts.bash === true ? globstar(opts) : STAR;
    if (opts.capture) {
      star = `(${star})`;
    }
    if (typeof opts.noext === "boolean") {
      opts.noextglob = opts.noext;
    }
    const state = {
      input,
      index: -1,
      start: 0,
      dot: opts.dot === true,
      consumed: "",
      output: "",
      prefix: "",
      backtrack: false,
      negated: false,
      brackets: 0,
      braces: 0,
      parens: 0,
      quotes: 0,
      globstar: false,
      tokens
    };
    input = utils.removePrefix(input, state);
    len = input.length;
    const extglobs = [];
    const braces = [];
    const stack = [];
    let prev = bos;
    let value;
    const eos = () => state.index === len - 1;
    const peek = state.peek = (n = 1) => input[state.index + n];
    const advance = state.advance = () => input[++state.index];
    const remaining = () => input.slice(state.index + 1);
    const consume = (value2 = "", num = 0) => {
      state.consumed += value2;
      state.index += num;
    };
    const append = (token) => {
      state.output += token.output != null ? token.output : token.value;
      consume(token.value);
    };
    const negate = () => {
      let count = 1;
      while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
        advance();
        state.start++;
        count++;
      }
      if (count % 2 === 0) {
        return false;
      }
      state.negated = true;
      state.start++;
      return true;
    };
    const increment = (type2) => {
      state[type2]++;
      stack.push(type2);
    };
    const decrement = (type2) => {
      state[type2]--;
      stack.pop();
    };
    const push = (tok) => {
      if (prev.type === "globstar") {
        const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
        const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
        if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "star";
          prev.value = "*";
          prev.output = star;
          state.output += prev.output;
        }
      }
      if (extglobs.length && tok.type !== "paren" && !EXTGLOB_CHARS[tok.value]) {
        extglobs[extglobs.length - 1].inner += tok.value;
      }
      if (tok.value || tok.output)
        append(tok);
      if (prev && prev.type === "text" && tok.type === "text") {
        prev.value += tok.value;
        prev.output = (prev.output || "") + tok.value;
        return;
      }
      tok.prev = prev;
      tokens.push(tok);
      prev = tok;
    };
    const extglobOpen = (type2, value2) => {
      const token = {...EXTGLOB_CHARS[value2], conditions: 1, inner: ""};
      token.prev = prev;
      token.parens = state.parens;
      token.output = state.output;
      const output = (opts.capture ? "(" : "") + token.open;
      increment("parens");
      push({type: type2, value: value2, output: state.output ? "" : ONE_CHAR});
      push({type: "paren", extglob: true, value: advance(), output});
      extglobs.push(token);
    };
    const extglobClose = (token) => {
      let output = token.close + (opts.capture ? ")" : "");
      if (token.type === "negate") {
        let extglobStar = star;
        if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
          extglobStar = globstar(opts);
        }
        if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
          output = token.close = `)$))${extglobStar}`;
        }
        if (token.prev.type === "bos" && eos()) {
          state.negatedExtglob = true;
        }
      }
      push({type: "paren", extglob: true, value, output});
      decrement("parens");
    };
    if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
      let backslashes = false;
      let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
        if (first === "\\") {
          backslashes = true;
          return m;
        }
        if (first === "?") {
          if (esc) {
            return esc + first + (rest ? QMARK.repeat(rest.length) : "");
          }
          if (index === 0) {
            return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
          }
          return QMARK.repeat(chars.length);
        }
        if (first === ".") {
          return DOT_LITERAL.repeat(chars.length);
        }
        if (first === "*") {
          if (esc) {
            return esc + first + (rest ? star : "");
          }
          return star;
        }
        return esc ? m : `\\${m}`;
      });
      if (backslashes === true) {
        if (opts.unescape === true) {
          output = output.replace(/\\/g, "");
        } else {
          output = output.replace(/\\+/g, (m) => {
            return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
          });
        }
      }
      if (output === input && opts.contains === true) {
        state.output = input;
        return state;
      }
      state.output = utils.wrapOutput(output, state, options);
      return state;
    }
    while (!eos()) {
      value = advance();
      if (value === "\0") {
        continue;
      }
      if (value === "\\") {
        const next = peek();
        if (next === "/" && opts.bash !== true) {
          continue;
        }
        if (next === "." || next === ";") {
          continue;
        }
        if (!next) {
          value += "\\";
          push({type: "text", value});
          continue;
        }
        const match2 = /^\\+/.exec(remaining());
        let slashes = 0;
        if (match2 && match2[0].length > 2) {
          slashes = match2[0].length;
          state.index += slashes;
          if (slashes % 2 !== 0) {
            value += "\\";
          }
        }
        if (opts.unescape === true) {
          value = advance() || "";
        } else {
          value += advance() || "";
        }
        if (state.brackets === 0) {
          push({type: "text", value});
          continue;
        }
      }
      if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
        if (opts.posix !== false && value === ":") {
          const inner = prev.value.slice(1);
          if (inner.includes("[")) {
            prev.posix = true;
            if (inner.includes(":")) {
              const idx = prev.value.lastIndexOf("[");
              const pre = prev.value.slice(0, idx);
              const rest2 = prev.value.slice(idx + 2);
              const posix = POSIX_REGEX_SOURCE[rest2];
              if (posix) {
                prev.value = pre + posix;
                state.backtrack = true;
                advance();
                if (!bos.output && tokens.indexOf(prev) === 1) {
                  bos.output = ONE_CHAR;
                }
                continue;
              }
            }
          }
        }
        if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
          value = `\\${value}`;
        }
        if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
          value = `\\${value}`;
        }
        if (opts.posix === true && value === "!" && prev.value === "[") {
          value = "^";
        }
        prev.value += value;
        append({value});
        continue;
      }
      if (state.quotes === 1 && value !== '"') {
        value = utils.escapeRegex(value);
        prev.value += value;
        append({value});
        continue;
      }
      if (value === '"') {
        state.quotes = state.quotes === 1 ? 0 : 1;
        if (opts.keepQuotes === true) {
          push({type: "text", value});
        }
        continue;
      }
      if (value === "(") {
        increment("parens");
        push({type: "paren", value});
        continue;
      }
      if (value === ")") {
        if (state.parens === 0 && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError("opening", "("));
        }
        const extglob = extglobs[extglobs.length - 1];
        if (extglob && state.parens === extglob.parens + 1) {
          extglobClose(extglobs.pop());
          continue;
        }
        push({type: "paren", value, output: state.parens ? ")" : "\\)"});
        decrement("parens");
        continue;
      }
      if (value === "[") {
        if (opts.nobracket === true || !remaining().includes("]")) {
          if (opts.nobracket !== true && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("closing", "]"));
          }
          value = `\\${value}`;
        } else {
          increment("brackets");
        }
        push({type: "bracket", value});
        continue;
      }
      if (value === "]") {
        if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
          push({type: "text", value, output: `\\${value}`});
          continue;
        }
        if (state.brackets === 0) {
          if (opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "["));
          }
          push({type: "text", value, output: `\\${value}`});
          continue;
        }
        decrement("brackets");
        const prevValue = prev.value.slice(1);
        if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
          value = `/${value}`;
        }
        prev.value += value;
        append({value});
        if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
          continue;
        }
        const escaped = utils.escapeRegex(prev.value);
        state.output = state.output.slice(0, -prev.value.length);
        if (opts.literalBrackets === true) {
          state.output += escaped;
          prev.value = escaped;
          continue;
        }
        prev.value = `(${capture2}${escaped}|${prev.value})`;
        state.output += prev.value;
        continue;
      }
      if (value === "{" && opts.nobrace !== true) {
        increment("braces");
        const open = {
          type: "brace",
          value,
          output: "(",
          outputIndex: state.output.length,
          tokensIndex: state.tokens.length
        };
        braces.push(open);
        push(open);
        continue;
      }
      if (value === "}") {
        const brace = braces[braces.length - 1];
        if (opts.nobrace === true || !brace) {
          push({type: "text", value, output: value});
          continue;
        }
        let output = ")";
        if (brace.dots === true) {
          const arr = tokens.slice();
          const range = [];
          for (let i = arr.length - 1; i >= 0; i--) {
            tokens.pop();
            if (arr[i].type === "brace") {
              break;
            }
            if (arr[i].type !== "dots") {
              range.unshift(arr[i].value);
            }
          }
          output = expandRange(range, opts);
          state.backtrack = true;
        }
        if (brace.comma !== true && brace.dots !== true) {
          const out = state.output.slice(0, brace.outputIndex);
          const toks = state.tokens.slice(brace.tokensIndex);
          brace.value = brace.output = "\\{";
          value = output = "\\}";
          state.output = out;
          for (const t2 of toks) {
            state.output += t2.output || t2.value;
          }
        }
        push({type: "brace", value, output});
        decrement("braces");
        braces.pop();
        continue;
      }
      if (value === "|") {
        if (extglobs.length > 0) {
          extglobs[extglobs.length - 1].conditions++;
        }
        push({type: "text", value});
        continue;
      }
      if (value === ",") {
        let output = value;
        const brace = braces[braces.length - 1];
        if (brace && stack[stack.length - 1] === "braces") {
          brace.comma = true;
          output = "|";
        }
        push({type: "comma", value, output});
        continue;
      }
      if (value === "/") {
        if (prev.type === "dot" && state.index === state.start + 1) {
          state.start = state.index + 1;
          state.consumed = "";
          state.output = "";
          tokens.pop();
          prev = bos;
          continue;
        }
        push({type: "slash", value, output: SLASH_LITERAL});
        continue;
      }
      if (value === ".") {
        if (state.braces > 0 && prev.type === "dot") {
          if (prev.value === ".")
            prev.output = DOT_LITERAL;
          const brace = braces[braces.length - 1];
          prev.type = "dots";
          prev.output += value;
          prev.value += value;
          brace.dots = true;
          continue;
        }
        if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
          push({type: "text", value, output: DOT_LITERAL});
          continue;
        }
        push({type: "dot", value, output: DOT_LITERAL});
        continue;
      }
      if (value === "?") {
        const isGroup = prev && prev.value === "(";
        if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          extglobOpen("qmark", value);
          continue;
        }
        if (prev && prev.type === "paren") {
          const next = peek();
          let output = value;
          if (next === "<" && !utils.supportsLookbehinds()) {
            throw new Error("Node.js v10 or higher is required for regex lookbehinds");
          }
          if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
            output = `\\${value}`;
          }
          push({type: "text", value, output});
          continue;
        }
        if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
          push({type: "qmark", value, output: QMARK_NO_DOT});
          continue;
        }
        push({type: "qmark", value, output: QMARK});
        continue;
      }
      if (value === "!") {
        if (opts.noextglob !== true && peek() === "(") {
          if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
            extglobOpen("negate", value);
            continue;
          }
        }
        if (opts.nonegate !== true && state.index === 0) {
          negate();
          continue;
        }
      }
      if (value === "+") {
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          extglobOpen("plus", value);
          continue;
        }
        if (prev && prev.value === "(" || opts.regex === false) {
          push({type: "plus", value, output: PLUS_LITERAL});
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
          push({type: "plus", value});
          continue;
        }
        push({type: "plus", value: PLUS_LITERAL});
        continue;
      }
      if (value === "@") {
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          push({type: "at", extglob: true, value, output: ""});
          continue;
        }
        push({type: "text", value});
        continue;
      }
      if (value !== "*") {
        if (value === "$" || value === "^") {
          value = `\\${value}`;
        }
        const match2 = REGEX_NON_SPECIAL_CHARS.exec(remaining());
        if (match2) {
          value += match2[0];
          state.index += match2[0].length;
        }
        push({type: "text", value});
        continue;
      }
      if (prev && (prev.type === "globstar" || prev.star === true)) {
        prev.type = "star";
        prev.star = true;
        prev.value += value;
        prev.output = star;
        state.backtrack = true;
        state.globstar = true;
        consume(value);
        continue;
      }
      let rest = remaining();
      if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
        extglobOpen("star", value);
        continue;
      }
      if (prev.type === "star") {
        if (opts.noglobstar === true) {
          consume(value);
          continue;
        }
        const prior = prev.prev;
        const before = prior.prev;
        const isStart = prior.type === "slash" || prior.type === "bos";
        const afterStar = before && (before.type === "star" || before.type === "globstar");
        if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
          push({type: "star", value, output: ""});
          continue;
        }
        const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
        const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
        if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
          push({type: "star", value, output: ""});
          continue;
        }
        while (rest.slice(0, 3) === "/**") {
          const after = input[state.index + 4];
          if (after && after !== "/") {
            break;
          }
          rest = rest.slice(3);
          consume("/**", 3);
        }
        if (prior.type === "bos" && eos()) {
          prev.type = "globstar";
          prev.value += value;
          prev.output = globstar(opts);
          state.output = prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
          state.output = state.output.slice(0, -(prior.output + prev.output).length);
          prior.output = `(?:${prior.output}`;
          prev.type = "globstar";
          prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
          prev.value += value;
          state.globstar = true;
          state.output += prior.output + prev.output;
          consume(value);
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
          const end = rest[1] !== void 0 ? "|$" : "";
          state.output = state.output.slice(0, -(prior.output + prev.output).length);
          prior.output = `(?:${prior.output}`;
          prev.type = "globstar";
          prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
          prev.value += value;
          state.output += prior.output + prev.output;
          state.globstar = true;
          consume(value + advance());
          push({type: "slash", value: "/", output: ""});
          continue;
        }
        if (prior.type === "bos" && rest[0] === "/") {
          prev.type = "globstar";
          prev.value += value;
          prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
          state.output = prev.output;
          state.globstar = true;
          consume(value + advance());
          push({type: "slash", value: "/", output: ""});
          continue;
        }
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = "globstar";
        prev.output = globstar(opts);
        prev.value += value;
        state.output += prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }
      const token = {type: "star", value, output: star};
      if (opts.bash === true) {
        token.output = ".*?";
        if (prev.type === "bos" || prev.type === "slash") {
          token.output = nodot + token.output;
        }
        push(token);
        continue;
      }
      if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
        token.output = value;
        push(token);
        continue;
      }
      if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
        if (prev.type === "dot") {
          state.output += NO_DOT_SLASH;
          prev.output += NO_DOT_SLASH;
        } else if (opts.dot === true) {
          state.output += NO_DOTS_SLASH;
          prev.output += NO_DOTS_SLASH;
        } else {
          state.output += nodot;
          prev.output += nodot;
        }
        if (peek() !== "*") {
          state.output += ONE_CHAR;
          prev.output += ONE_CHAR;
        }
      }
      push(token);
    }
    while (state.brackets > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", "]"));
      state.output = utils.escapeLast(state.output, "[");
      decrement("brackets");
    }
    while (state.parens > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", ")"));
      state.output = utils.escapeLast(state.output, "(");
      decrement("parens");
    }
    while (state.braces > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", "}"));
      state.output = utils.escapeLast(state.output, "{");
      decrement("braces");
    }
    if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
      push({type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?`});
    }
    if (state.backtrack === true) {
      state.output = "";
      for (const token of state.tokens) {
        state.output += token.output != null ? token.output : token.value;
        if (token.suffix) {
          state.output += token.suffix;
        }
      }
    }
    return state;
  };
  parse2.fastpaths = (input, options) => {
    const opts = {...options};
    const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    const len = input.length;
    if (len > max) {
      throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    }
    input = REPLACEMENTS[input] || input;
    const win32 = utils.isWindows(options);
    const {
      DOT_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOTS_SLASH,
      STAR,
      START_ANCHOR
    } = constants.globChars(win32);
    const nodot = opts.dot ? NO_DOTS : NO_DOT;
    const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
    const capture2 = opts.capture ? "" : "?:";
    const state = {negated: false, prefix: ""};
    let star = opts.bash === true ? ".*?" : STAR;
    if (opts.capture) {
      star = `(${star})`;
    }
    const globstar = (opts2) => {
      if (opts2.noglobstar === true)
        return star;
      return `(${capture2}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const create = (str) => {
      switch (str) {
        case "*":
          return `${nodot}${ONE_CHAR}${star}`;
        case ".*":
          return `${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*.*":
          return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*/*":
          return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
        case "**":
          return nodot + globstar(opts);
        case "**/*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
        case "**/*.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "**/.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
        default: {
          const match2 = /^(.*?)\.(\w+)$/.exec(str);
          if (!match2)
            return;
          const source2 = create(match2[1]);
          if (!source2)
            return;
          return source2 + DOT_LITERAL + match2[2];
        }
      }
    };
    const output = utils.removePrefix(input, state);
    let source = create(output);
    if (source && opts.strictSlashes !== true) {
      source += `${SLASH_LITERAL}?`;
    }
    return source;
  };
  module2.exports = parse2;
});

// node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS((exports2, module2) => {
  "use strict";
  var path5 = require("path");
  var scan = require_scan();
  var parse2 = require_parse3();
  var utils = require_utils2();
  var constants = require_constants2();
  var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
  var picomatch = (glob, options, returnState = false) => {
    if (Array.isArray(glob)) {
      const fns = glob.map((input) => picomatch(input, options, returnState));
      const arrayMatcher = (str) => {
        for (const isMatch of fns) {
          const state2 = isMatch(str);
          if (state2)
            return state2;
        }
        return false;
      };
      return arrayMatcher;
    }
    const isState = isObject(glob) && glob.tokens && glob.input;
    if (glob === "" || typeof glob !== "string" && !isState) {
      throw new TypeError("Expected pattern to be a non-empty string");
    }
    const opts = options || {};
    const posix = utils.isWindows(options);
    const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
    const state = regex.state;
    delete regex.state;
    let isIgnored = () => false;
    if (opts.ignore) {
      const ignoreOpts = {...options, ignore: null, onMatch: null, onResult: null};
      isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
    }
    const matcher = (input, returnObject = false) => {
      const {isMatch, match: match2, output} = picomatch.test(input, regex, options, {glob, posix});
      const result = {glob, state, regex, posix, input, output, match: match2, isMatch};
      if (typeof opts.onResult === "function") {
        opts.onResult(result);
      }
      if (isMatch === false) {
        result.isMatch = false;
        return returnObject ? result : false;
      }
      if (isIgnored(input)) {
        if (typeof opts.onIgnore === "function") {
          opts.onIgnore(result);
        }
        result.isMatch = false;
        return returnObject ? result : false;
      }
      if (typeof opts.onMatch === "function") {
        opts.onMatch(result);
      }
      return returnObject ? result : true;
    };
    if (returnState) {
      matcher.state = state;
    }
    return matcher;
  };
  picomatch.test = (input, regex, options, {glob, posix} = {}) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected input to be a string");
    }
    if (input === "") {
      return {isMatch: false, output: ""};
    }
    const opts = options || {};
    const format = opts.format || (posix ? utils.toPosixSlashes : null);
    let match2 = input === glob;
    let output = match2 && format ? format(input) : input;
    if (match2 === false) {
      output = format ? format(input) : input;
      match2 = output === glob;
    }
    if (match2 === false || opts.capture === true) {
      if (opts.matchBase === true || opts.basename === true) {
        match2 = picomatch.matchBase(input, regex, options, posix);
      } else {
        match2 = regex.exec(output);
      }
    }
    return {isMatch: Boolean(match2), match: match2, output};
  };
  picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
    const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
    return regex.test(path5.basename(input));
  };
  picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
  picomatch.parse = (pattern, options) => {
    if (Array.isArray(pattern))
      return pattern.map((p) => picomatch.parse(p, options));
    return parse2(pattern, {...options, fastpaths: false});
  };
  picomatch.scan = (input, options) => scan(input, options);
  picomatch.compileRe = (parsed, options, returnOutput = false, returnState = false) => {
    if (returnOutput === true) {
      return parsed.output;
    }
    const opts = options || {};
    const prepend = opts.contains ? "" : "^";
    const append = opts.contains ? "" : "$";
    let source = `${prepend}(?:${parsed.output})${append}`;
    if (parsed && parsed.negated === true) {
      source = `^(?!${source}).*$`;
    }
    const regex = picomatch.toRegex(source, options);
    if (returnState === true) {
      regex.state = parsed;
    }
    return regex;
  };
  picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
    if (!input || typeof input !== "string") {
      throw new TypeError("Expected a non-empty string");
    }
    const opts = options || {};
    let parsed = {negated: false, fastpaths: true};
    let prefix = "";
    let output;
    if (input.startsWith("./")) {
      input = input.slice(2);
      prefix = parsed.prefix = "./";
    }
    if (opts.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
      output = parse2.fastpaths(input, options);
    }
    if (output === void 0) {
      parsed = parse2(input, options);
      parsed.prefix = prefix + (parsed.prefix || "");
    } else {
      parsed.output = output;
    }
    return picomatch.compileRe(parsed, options, returnOutput, returnState);
  };
  picomatch.toRegex = (source, options) => {
    try {
      const opts = options || {};
      return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
    } catch (err) {
      if (options && options.debug === true)
        throw err;
      return /$^/;
    }
  };
  picomatch.constants = constants;
  module2.exports = picomatch;
});

// node_modules/picomatch/index.js
var require_picomatch2 = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = require_picomatch();
});

// node_modules/micromatch/index.js
var require_micromatch = __commonJS((exports2, module2) => {
  "use strict";
  var util2 = require("util");
  var braces = require_braces();
  var picomatch = require_picomatch2();
  var utils = require_utils2();
  var isEmptyString = (val) => typeof val === "string" && (val === "" || val === "./");
  var micromatch = (list, patterns, options) => {
    patterns = [].concat(patterns);
    list = [].concat(list);
    let omit = new Set();
    let keep = new Set();
    let items = new Set();
    let negatives = 0;
    let onResult = (state) => {
      items.add(state.output);
      if (options && options.onResult) {
        options.onResult(state);
      }
    };
    for (let i = 0; i < patterns.length; i++) {
      let isMatch = picomatch(String(patterns[i]), {...options, onResult}, true);
      let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
      if (negated)
        negatives++;
      for (let item of list) {
        let matched = isMatch(item, true);
        let match2 = negated ? !matched.isMatch : matched.isMatch;
        if (!match2)
          continue;
        if (negated) {
          omit.add(matched.output);
        } else {
          omit.delete(matched.output);
          keep.add(matched.output);
        }
      }
    }
    let result = negatives === patterns.length ? [...items] : [...keep];
    let matches = result.filter((item) => !omit.has(item));
    if (options && matches.length === 0) {
      if (options.failglob === true) {
        throw new Error(`No matches found for "${patterns.join(", ")}"`);
      }
      if (options.nonull === true || options.nullglob === true) {
        return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
      }
    }
    return matches;
  };
  micromatch.match = micromatch;
  micromatch.matcher = (pattern, options) => picomatch(pattern, options);
  micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
  micromatch.any = micromatch.isMatch;
  micromatch.not = (list, patterns, options = {}) => {
    patterns = [].concat(patterns).map(String);
    let result = new Set();
    let items = [];
    let onResult = (state) => {
      if (options.onResult)
        options.onResult(state);
      items.push(state.output);
    };
    let matches = micromatch(list, patterns, {...options, onResult});
    for (let item of items) {
      if (!matches.includes(item)) {
        result.add(item);
      }
    }
    return [...result];
  };
  micromatch.contains = (str, pattern, options) => {
    if (typeof str !== "string") {
      throw new TypeError(`Expected a string: "${util2.inspect(str)}"`);
    }
    if (Array.isArray(pattern)) {
      return pattern.some((p) => micromatch.contains(str, p, options));
    }
    if (typeof pattern === "string") {
      if (isEmptyString(str) || isEmptyString(pattern)) {
        return false;
      }
      if (str.includes(pattern) || str.startsWith("./") && str.slice(2).includes(pattern)) {
        return true;
      }
    }
    return micromatch.isMatch(str, pattern, {...options, contains: true});
  };
  micromatch.matchKeys = (obj, patterns, options) => {
    if (!utils.isObject(obj)) {
      throw new TypeError("Expected the first argument to be an object");
    }
    let keys = micromatch(Object.keys(obj), patterns, options);
    let res = {};
    for (let key of keys)
      res[key] = obj[key];
    return res;
  };
  micromatch.some = (list, patterns, options) => {
    let items = [].concat(list);
    for (let pattern of [].concat(patterns)) {
      let isMatch = picomatch(String(pattern), options);
      if (items.some((item) => isMatch(item))) {
        return true;
      }
    }
    return false;
  };
  micromatch.every = (list, patterns, options) => {
    let items = [].concat(list);
    for (let pattern of [].concat(patterns)) {
      let isMatch = picomatch(String(pattern), options);
      if (!items.every((item) => isMatch(item))) {
        return false;
      }
    }
    return true;
  };
  micromatch.all = (str, patterns, options) => {
    if (typeof str !== "string") {
      throw new TypeError(`Expected a string: "${util2.inspect(str)}"`);
    }
    return [].concat(patterns).every((p) => picomatch(p, options)(str));
  };
  micromatch.capture = (glob, input, options) => {
    let posix = utils.isWindows(options);
    let regex = picomatch.makeRe(String(glob), {...options, capture: true});
    let match2 = regex.exec(posix ? utils.toPosixSlashes(input) : input);
    if (match2) {
      return match2.slice(1).map((v) => v === void 0 ? "" : v);
    }
  };
  micromatch.makeRe = (...args) => picomatch.makeRe(...args);
  micromatch.scan = (...args) => picomatch.scan(...args);
  micromatch.parse = (patterns, options) => {
    let res = [];
    for (let pattern of [].concat(patterns || [])) {
      for (let str of braces(String(pattern), options)) {
        res.push(picomatch.parse(str, options));
      }
    }
    return res;
  };
  micromatch.braces = (pattern, options) => {
    if (typeof pattern !== "string")
      throw new TypeError("Expected a string");
    if (options && options.nobrace === true || !/\{.*\}/.test(pattern)) {
      return [pattern];
    }
    return braces(pattern, options);
  };
  micromatch.braceExpand = (pattern, options) => {
    if (typeof pattern !== "string")
      throw new TypeError("Expected a string");
    return micromatch.braces(pattern, {...options, expand: true});
  };
  module2.exports = micromatch;
});

// node_modules/io-ts/lib/index.js
var require_lib = __commonJS((exports2) => {
  "use strict";
  var __extends = exports2 && exports2.__extends || function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __assign = exports2 && exports2.__assign || function() {
    __assign = Object.assign || function(t2) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t2[p] = s[p];
      }
      return t2;
    };
    return __assign.apply(this, arguments);
  };
  var __spreadArrays = exports2 && exports2.__spreadArrays || function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.getIndex = exports2.getTags = exports2.emptyTags = exports2.alias = exports2.clean = exports2.StrictType = exports2.dictionary = exports2.Integer = exports2.refinement = exports2.object = exports2.ObjectType = exports2.Dictionary = exports2.any = exports2.AnyType = exports2.never = exports2.NeverType = exports2.getDefaultContext = exports2.getValidationError = exports2.void = exports2.interface = exports2.Array = exports2.undefined = exports2.null = exports2.exact = exports2.ExactType = exports2.taggedUnion = exports2.TaggedUnionType = exports2.strict = exports2.readonlyArray = exports2.ReadonlyArrayType = exports2.readonly = exports2.ReadonlyType = exports2.tuple = exports2.TupleType = exports2.intersection = exports2.mergeAll = exports2.IntersectionType = exports2.union = exports2.UnionType = exports2.record = exports2.getDomainKeys = exports2.DictionaryType = exports2.partial = exports2.PartialType = exports2.type = exports2.InterfaceType = exports2.array = exports2.ArrayType = exports2.recursion = exports2.RecursiveType = exports2.keyof = exports2.KeyofType = exports2.literal = exports2.LiteralType = exports2.Int = exports2.brand = exports2.RefinementType = exports2.Function = exports2.FunctionType = exports2.UnknownRecord = exports2.AnyDictionaryType = exports2.UnknownArray = exports2.AnyArrayType = exports2.boolean = exports2.BooleanType = exports2.bigint = exports2.BigIntType = exports2.number = exports2.NumberType = exports2.string = exports2.StringType = exports2.unknown = exports2.UnknownType = exports2.voidType = exports2.VoidType = exports2.UndefinedType = exports2.nullType = exports2.NullType = exports2.success = exports2.failure = exports2.failures = exports2.appendContext = exports2.getContextEntry = exports2.getFunctionName = exports2.identity = exports2.Type = void 0;
  var Either_1 = require_Either();
  var Type = function() {
    function Type2(name, is, validate, encode) {
      this.name = name;
      this.is = is;
      this.validate = validate;
      this.encode = encode;
      this.decode = this.decode.bind(this);
    }
    Type2.prototype.pipe = function(ab, name) {
      var _this = this;
      if (name === void 0) {
        name = "pipe(" + this.name + ", " + ab.name + ")";
      }
      return new Type2(name, ab.is, function(i, c) {
        var e = _this.validate(i, c);
        if (Either_1.isLeft(e)) {
          return e;
        }
        return ab.validate(e.right, c);
      }, this.encode === exports2.identity && ab.encode === exports2.identity ? exports2.identity : function(b) {
        return _this.encode(ab.encode(b));
      });
    };
    Type2.prototype.asDecoder = function() {
      return this;
    };
    Type2.prototype.asEncoder = function() {
      return this;
    };
    Type2.prototype.decode = function(i) {
      return this.validate(i, [{key: "", type: this, actual: i}]);
    };
    return Type2;
  }();
  exports2.Type = Type;
  exports2.identity = function(a) {
    return a;
  };
  exports2.getFunctionName = function(f) {
    return f.displayName || f.name || "<function" + f.length + ">";
  };
  exports2.getContextEntry = function(key, decoder) {
    return {key, type: decoder};
  };
  exports2.appendContext = function(c, key, decoder, actual) {
    var len = c.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
      r[i] = c[i];
    }
    r[len] = {key, type: decoder, actual};
    return r;
  };
  exports2.failures = Either_1.left;
  exports2.failure = function(value, context, message) {
    return exports2.failures([{value, context, message}]);
  };
  exports2.success = Either_1.right;
  var pushAll = function(xs, ys) {
    var l = ys.length;
    for (var i = 0; i < l; i++) {
      xs.push(ys[i]);
    }
  };
  var NullType = function(_super) {
    __extends(NullType2, _super);
    function NullType2() {
      var _this = _super.call(this, "null", function(u) {
        return u === null;
      }, function(u, c) {
        return _this.is(u) ? exports2.success(u) : exports2.failure(u, c);
      }, exports2.identity) || this;
      _this._tag = "NullType";
      return _this;
    }
    return NullType2;
  }(Type);
  exports2.NullType = NullType;
  exports2.nullType = new NullType();
  exports2.null = exports2.nullType;
  var UndefinedType = function(_super) {
    __extends(UndefinedType2, _super);
    function UndefinedType2() {
      var _this = _super.call(this, "undefined", function(u) {
        return u === void 0;
      }, function(u, c) {
        return _this.is(u) ? exports2.success(u) : exports2.failure(u, c);
      }, exports2.identity) || this;
      _this._tag = "UndefinedType";
      return _this;
    }
    return UndefinedType2;
  }(Type);
  exports2.UndefinedType = UndefinedType;
  var undefinedType = new UndefinedType();
  exports2.undefined = undefinedType;
  var VoidType = function(_super) {
    __extends(VoidType2, _super);
    function VoidType2() {
      var _this = _super.call(this, "void", undefinedType.is, undefinedType.validate, exports2.identity) || this;
      _this._tag = "VoidType";
      return _this;
    }
    return VoidType2;
  }(Type);
  exports2.VoidType = VoidType;
  exports2.voidType = new VoidType();
  exports2.void = exports2.voidType;
  var UnknownType = function(_super) {
    __extends(UnknownType2, _super);
    function UnknownType2() {
      var _this = _super.call(this, "unknown", function(_) {
        return true;
      }, exports2.success, exports2.identity) || this;
      _this._tag = "UnknownType";
      return _this;
    }
    return UnknownType2;
  }(Type);
  exports2.UnknownType = UnknownType;
  exports2.unknown = new UnknownType();
  var StringType = function(_super) {
    __extends(StringType2, _super);
    function StringType2() {
      var _this = _super.call(this, "string", function(u) {
        return typeof u === "string";
      }, function(u, c) {
        return _this.is(u) ? exports2.success(u) : exports2.failure(u, c);
      }, exports2.identity) || this;
      _this._tag = "StringType";
      return _this;
    }
    return StringType2;
  }(Type);
  exports2.StringType = StringType;
  exports2.string = new StringType();
  var NumberType = function(_super) {
    __extends(NumberType2, _super);
    function NumberType2() {
      var _this = _super.call(this, "number", function(u) {
        return typeof u === "number";
      }, function(u, c) {
        return _this.is(u) ? exports2.success(u) : exports2.failure(u, c);
      }, exports2.identity) || this;
      _this._tag = "NumberType";
      return _this;
    }
    return NumberType2;
  }(Type);
  exports2.NumberType = NumberType;
  exports2.number = new NumberType();
  var BigIntType = function(_super) {
    __extends(BigIntType2, _super);
    function BigIntType2() {
      var _this = _super.call(this, "bigint", function(u) {
        return typeof u === "bigint";
      }, function(u, c) {
        return _this.is(u) ? exports2.success(u) : exports2.failure(u, c);
      }, exports2.identity) || this;
      _this._tag = "BigIntType";
      return _this;
    }
    return BigIntType2;
  }(Type);
  exports2.BigIntType = BigIntType;
  exports2.bigint = new BigIntType();
  var BooleanType = function(_super) {
    __extends(BooleanType2, _super);
    function BooleanType2() {
      var _this = _super.call(this, "boolean", function(u) {
        return typeof u === "boolean";
      }, function(u, c) {
        return _this.is(u) ? exports2.success(u) : exports2.failure(u, c);
      }, exports2.identity) || this;
      _this._tag = "BooleanType";
      return _this;
    }
    return BooleanType2;
  }(Type);
  exports2.BooleanType = BooleanType;
  exports2.boolean = new BooleanType();
  var AnyArrayType = function(_super) {
    __extends(AnyArrayType2, _super);
    function AnyArrayType2() {
      var _this = _super.call(this, "UnknownArray", Array.isArray, function(u, c) {
        return _this.is(u) ? exports2.success(u) : exports2.failure(u, c);
      }, exports2.identity) || this;
      _this._tag = "AnyArrayType";
      return _this;
    }
    return AnyArrayType2;
  }(Type);
  exports2.AnyArrayType = AnyArrayType;
  exports2.UnknownArray = new AnyArrayType();
  exports2.Array = exports2.UnknownArray;
  var AnyDictionaryType = function(_super) {
    __extends(AnyDictionaryType2, _super);
    function AnyDictionaryType2() {
      var _this = _super.call(this, "UnknownRecord", function(u) {
        var s = Object.prototype.toString.call(u);
        return s === "[object Object]" || s === "[object Window]";
      }, function(u, c) {
        return _this.is(u) ? exports2.success(u) : exports2.failure(u, c);
      }, exports2.identity) || this;
      _this._tag = "AnyDictionaryType";
      return _this;
    }
    return AnyDictionaryType2;
  }(Type);
  exports2.AnyDictionaryType = AnyDictionaryType;
  exports2.UnknownRecord = new AnyDictionaryType();
  var FunctionType = function(_super) {
    __extends(FunctionType2, _super);
    function FunctionType2() {
      var _this = _super.call(this, "Function", function(u) {
        return typeof u === "function";
      }, function(u, c) {
        return _this.is(u) ? exports2.success(u) : exports2.failure(u, c);
      }, exports2.identity) || this;
      _this._tag = "FunctionType";
      return _this;
    }
    return FunctionType2;
  }(Type);
  exports2.FunctionType = FunctionType;
  exports2.Function = new FunctionType();
  var RefinementType = function(_super) {
    __extends(RefinementType2, _super);
    function RefinementType2(name, is, validate, encode, type2, predicate) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.type = type2;
      _this.predicate = predicate;
      _this._tag = "RefinementType";
      return _this;
    }
    return RefinementType2;
  }(Type);
  exports2.RefinementType = RefinementType;
  exports2.brand = function(codec, predicate, name) {
    return refinement(codec, predicate, name);
  };
  exports2.Int = exports2.brand(exports2.number, function(n) {
    return Number.isInteger(n);
  }, "Int");
  var LiteralType = function(_super) {
    __extends(LiteralType2, _super);
    function LiteralType2(name, is, validate, encode, value) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.value = value;
      _this._tag = "LiteralType";
      return _this;
    }
    return LiteralType2;
  }(Type);
  exports2.LiteralType = LiteralType;
  exports2.literal = function(value, name) {
    if (name === void 0) {
      name = JSON.stringify(value);
    }
    var is = function(u) {
      return u === value;
    };
    return new LiteralType(name, is, function(u, c) {
      return is(u) ? exports2.success(value) : exports2.failure(u, c);
    }, exports2.identity, value);
  };
  var KeyofType = function(_super) {
    __extends(KeyofType2, _super);
    function KeyofType2(name, is, validate, encode, keys) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.keys = keys;
      _this._tag = "KeyofType";
      return _this;
    }
    return KeyofType2;
  }(Type);
  exports2.KeyofType = KeyofType;
  var hasOwnProperty2 = Object.prototype.hasOwnProperty;
  exports2.keyof = function(keys, name) {
    if (name === void 0) {
      name = Object.keys(keys).map(function(k) {
        return JSON.stringify(k);
      }).join(" | ");
    }
    var is = function(u) {
      return exports2.string.is(u) && hasOwnProperty2.call(keys, u);
    };
    return new KeyofType(name, is, function(u, c) {
      return is(u) ? exports2.success(u) : exports2.failure(u, c);
    }, exports2.identity, keys);
  };
  var RecursiveType = function(_super) {
    __extends(RecursiveType2, _super);
    function RecursiveType2(name, is, validate, encode, runDefinition) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.runDefinition = runDefinition;
      _this._tag = "RecursiveType";
      return _this;
    }
    return RecursiveType2;
  }(Type);
  exports2.RecursiveType = RecursiveType;
  Object.defineProperty(RecursiveType.prototype, "type", {
    get: function() {
      return this.runDefinition();
    },
    enumerable: true,
    configurable: true
  });
  exports2.recursion = function(name, definition) {
    var cache;
    var runDefinition = function() {
      if (!cache) {
        cache = definition(Self);
        cache.name = name;
      }
      return cache;
    };
    var Self = new RecursiveType(name, function(u) {
      return runDefinition().is(u);
    }, function(u, c) {
      return runDefinition().validate(u, c);
    }, function(a) {
      return runDefinition().encode(a);
    }, runDefinition);
    return Self;
  };
  var ArrayType = function(_super) {
    __extends(ArrayType2, _super);
    function ArrayType2(name, is, validate, encode, type2) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.type = type2;
      _this._tag = "ArrayType";
      return _this;
    }
    return ArrayType2;
  }(Type);
  exports2.ArrayType = ArrayType;
  exports2.array = function(item, name) {
    if (name === void 0) {
      name = "Array<" + item.name + ">";
    }
    return new ArrayType(name, function(u) {
      return exports2.UnknownArray.is(u) && u.every(item.is);
    }, function(u, c) {
      var e = exports2.UnknownArray.validate(u, c);
      if (Either_1.isLeft(e)) {
        return e;
      }
      var us = e.right;
      var len = us.length;
      var as = us;
      var errors = [];
      for (var i = 0; i < len; i++) {
        var ui = us[i];
        var result = item.validate(ui, exports2.appendContext(c, String(i), item, ui));
        if (Either_1.isLeft(result)) {
          pushAll(errors, result.left);
        } else {
          var ai = result.right;
          if (ai !== ui) {
            if (as === us) {
              as = us.slice();
            }
            as[i] = ai;
          }
        }
      }
      return errors.length > 0 ? exports2.failures(errors) : exports2.success(as);
    }, item.encode === exports2.identity ? exports2.identity : function(a) {
      return a.map(item.encode);
    }, item);
  };
  var InterfaceType = function(_super) {
    __extends(InterfaceType2, _super);
    function InterfaceType2(name, is, validate, encode, props) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.props = props;
      _this._tag = "InterfaceType";
      return _this;
    }
    return InterfaceType2;
  }(Type);
  exports2.InterfaceType = InterfaceType;
  var getNameFromProps = function(props) {
    return Object.keys(props).map(function(k) {
      return k + ": " + props[k].name;
    }).join(", ");
  };
  var useIdentity = function(codecs) {
    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].encode !== exports2.identity) {
        return false;
      }
    }
    return true;
  };
  var getInterfaceTypeName = function(props) {
    return "{ " + getNameFromProps(props) + " }";
  };
  exports2.type = function(props, name) {
    if (name === void 0) {
      name = getInterfaceTypeName(props);
    }
    var keys = Object.keys(props);
    var types = keys.map(function(key) {
      return props[key];
    });
    var len = keys.length;
    return new InterfaceType(name, function(u) {
      if (exports2.UnknownRecord.is(u)) {
        for (var i = 0; i < len; i++) {
          var k = keys[i];
          var uk = u[k];
          if (uk === void 0 && !hasOwnProperty2.call(u, k) || !types[i].is(uk)) {
            return false;
          }
        }
        return true;
      }
      return false;
    }, function(u, c) {
      var e = exports2.UnknownRecord.validate(u, c);
      if (Either_1.isLeft(e)) {
        return e;
      }
      var o = e.right;
      var a = o;
      var errors = [];
      for (var i = 0; i < len; i++) {
        var k = keys[i];
        var ak = a[k];
        var type_1 = types[i];
        var result = type_1.validate(ak, exports2.appendContext(c, k, type_1, ak));
        if (Either_1.isLeft(result)) {
          pushAll(errors, result.left);
        } else {
          var vak = result.right;
          if (vak !== ak || vak === void 0 && !hasOwnProperty2.call(a, k)) {
            if (a === o) {
              a = __assign({}, o);
            }
            a[k] = vak;
          }
        }
      }
      return errors.length > 0 ? exports2.failures(errors) : exports2.success(a);
    }, useIdentity(types) ? exports2.identity : function(a) {
      var s = __assign({}, a);
      for (var i = 0; i < len; i++) {
        var k = keys[i];
        var encode = types[i].encode;
        if (encode !== exports2.identity) {
          s[k] = encode(a[k]);
        }
      }
      return s;
    }, props);
  };
  exports2.interface = exports2.type;
  var PartialType = function(_super) {
    __extends(PartialType2, _super);
    function PartialType2(name, is, validate, encode, props) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.props = props;
      _this._tag = "PartialType";
      return _this;
    }
    return PartialType2;
  }(Type);
  exports2.PartialType = PartialType;
  var getPartialTypeName = function(inner) {
    return "Partial<" + inner + ">";
  };
  exports2.partial = function(props, name) {
    if (name === void 0) {
      name = getPartialTypeName(getInterfaceTypeName(props));
    }
    var keys = Object.keys(props);
    var types = keys.map(function(key) {
      return props[key];
    });
    var len = keys.length;
    return new PartialType(name, function(u) {
      if (exports2.UnknownRecord.is(u)) {
        for (var i = 0; i < len; i++) {
          var k = keys[i];
          var uk = u[k];
          if (uk !== void 0 && !props[k].is(uk)) {
            return false;
          }
        }
        return true;
      }
      return false;
    }, function(u, c) {
      var e = exports2.UnknownRecord.validate(u, c);
      if (Either_1.isLeft(e)) {
        return e;
      }
      var o = e.right;
      var a = o;
      var errors = [];
      for (var i = 0; i < len; i++) {
        var k = keys[i];
        var ak = a[k];
        var type_2 = props[k];
        var result = type_2.validate(ak, exports2.appendContext(c, k, type_2, ak));
        if (Either_1.isLeft(result)) {
          if (ak !== void 0) {
            pushAll(errors, result.left);
          }
        } else {
          var vak = result.right;
          if (vak !== ak) {
            if (a === o) {
              a = __assign({}, o);
            }
            a[k] = vak;
          }
        }
      }
      return errors.length > 0 ? exports2.failures(errors) : exports2.success(a);
    }, useIdentity(types) ? exports2.identity : function(a) {
      var s = __assign({}, a);
      for (var i = 0; i < len; i++) {
        var k = keys[i];
        var ak = a[k];
        if (ak !== void 0) {
          s[k] = types[i].encode(ak);
        }
      }
      return s;
    }, props);
  };
  var DictionaryType = function(_super) {
    __extends(DictionaryType2, _super);
    function DictionaryType2(name, is, validate, encode, domain, codomain) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.domain = domain;
      _this.codomain = codomain;
      _this._tag = "DictionaryType";
      return _this;
    }
    return DictionaryType2;
  }(Type);
  exports2.DictionaryType = DictionaryType;
  function enumerableRecord(keys, domain, codomain, name) {
    if (name === void 0) {
      name = "{ [K in " + domain.name + "]: " + codomain.name + " }";
    }
    var len = keys.length;
    return new DictionaryType(name, function(u) {
      return exports2.UnknownRecord.is(u) && keys.every(function(k) {
        return codomain.is(u[k]);
      });
    }, function(u, c) {
      var e = exports2.UnknownRecord.validate(u, c);
      if (Either_1.isLeft(e)) {
        return e;
      }
      var o = e.right;
      var a = {};
      var errors = [];
      var changed = false;
      for (var i = 0; i < len; i++) {
        var k = keys[i];
        var ok = o[k];
        var codomainResult = codomain.validate(ok, exports2.appendContext(c, k, codomain, ok));
        if (Either_1.isLeft(codomainResult)) {
          pushAll(errors, codomainResult.left);
        } else {
          var vok = codomainResult.right;
          changed = changed || vok !== ok;
          a[k] = vok;
        }
      }
      return errors.length > 0 ? exports2.failures(errors) : exports2.success(changed || Object.keys(o).length !== len ? a : o);
    }, codomain.encode === exports2.identity ? exports2.identity : function(a) {
      var s = {};
      for (var i = 0; i < len; i++) {
        var k = keys[i];
        s[k] = codomain.encode(a[k]);
      }
      return s;
    }, domain, codomain);
  }
  function getDomainKeys(domain) {
    var _a;
    if (isLiteralC(domain)) {
      var literal_1 = domain.value;
      if (exports2.string.is(literal_1)) {
        return _a = {}, _a[literal_1] = null, _a;
      }
    } else if (isKeyofC(domain)) {
      return domain.keys;
    } else if (isUnionC(domain)) {
      var keys = domain.types.map(function(type2) {
        return getDomainKeys(type2);
      });
      return keys.some(undefinedType.is) ? void 0 : Object.assign.apply(Object, __spreadArrays([{}], keys));
    }
    return void 0;
  }
  exports2.getDomainKeys = getDomainKeys;
  function nonEnumerableRecord(domain, codomain, name) {
    if (name === void 0) {
      name = "{ [K in " + domain.name + "]: " + codomain.name + " }";
    }
    return new DictionaryType(name, function(u) {
      if (exports2.UnknownRecord.is(u)) {
        return Object.keys(u).every(function(k) {
          return domain.is(k) && codomain.is(u[k]);
        });
      }
      return isAnyC(codomain) && Array.isArray(u);
    }, function(u, c) {
      if (exports2.UnknownRecord.is(u)) {
        var a = {};
        var errors = [];
        var keys = Object.keys(u);
        var len = keys.length;
        var changed = false;
        for (var i = 0; i < len; i++) {
          var k = keys[i];
          var ok = u[k];
          var domainResult = domain.validate(k, exports2.appendContext(c, k, domain, k));
          if (Either_1.isLeft(domainResult)) {
            pushAll(errors, domainResult.left);
          } else {
            var vk = domainResult.right;
            changed = changed || vk !== k;
            k = vk;
            var codomainResult = codomain.validate(ok, exports2.appendContext(c, k, codomain, ok));
            if (Either_1.isLeft(codomainResult)) {
              pushAll(errors, codomainResult.left);
            } else {
              var vok = codomainResult.right;
              changed = changed || vok !== ok;
              a[k] = vok;
            }
          }
        }
        return errors.length > 0 ? exports2.failures(errors) : exports2.success(changed ? a : u);
      }
      if (isAnyC(codomain) && Array.isArray(u)) {
        return exports2.success(u);
      }
      return exports2.failure(u, c);
    }, domain.encode === exports2.identity && codomain.encode === exports2.identity ? exports2.identity : function(a) {
      var s = {};
      var keys = Object.keys(a);
      var len = keys.length;
      for (var i = 0; i < len; i++) {
        var k = keys[i];
        s[String(domain.encode(k))] = codomain.encode(a[k]);
      }
      return s;
    }, domain, codomain);
  }
  function record(domain, codomain, name) {
    var keys = getDomainKeys(domain);
    return keys ? enumerableRecord(Object.keys(keys), domain, codomain, name) : nonEnumerableRecord(domain, codomain, name);
  }
  exports2.record = record;
  var UnionType = function(_super) {
    __extends(UnionType2, _super);
    function UnionType2(name, is, validate, encode, types) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.types = types;
      _this._tag = "UnionType";
      return _this;
    }
    return UnionType2;
  }(Type);
  exports2.UnionType = UnionType;
  var getUnionName = function(codecs) {
    return "(" + codecs.map(function(type2) {
      return type2.name;
    }).join(" | ") + ")";
  };
  exports2.union = function(codecs, name) {
    if (name === void 0) {
      name = getUnionName(codecs);
    }
    var index = getIndex(codecs);
    if (index !== void 0 && codecs.length > 0) {
      var tag_1 = index[0], groups_1 = index[1];
      var len_1 = groups_1.length;
      var find_1 = function(value) {
        for (var i = 0; i < len_1; i++) {
          if (groups_1[i].indexOf(value) !== -1) {
            return i;
          }
        }
        return void 0;
      };
      return new TaggedUnionType(name, function(u) {
        if (exports2.UnknownRecord.is(u)) {
          var i = find_1(u[tag_1]);
          return i !== void 0 ? codecs[i].is(u) : false;
        }
        return false;
      }, function(u, c) {
        var e = exports2.UnknownRecord.validate(u, c);
        if (Either_1.isLeft(e)) {
          return e;
        }
        var r = e.right;
        var i = find_1(r[tag_1]);
        if (i === void 0) {
          return exports2.failure(u, c);
        }
        var codec = codecs[i];
        return codec.validate(r, exports2.appendContext(c, String(i), codec, r));
      }, useIdentity(codecs) ? exports2.identity : function(a) {
        var i = find_1(a[tag_1]);
        if (i === void 0) {
          throw new Error("no codec found to encode value in union codec " + name);
        } else {
          return codecs[i].encode(a);
        }
      }, codecs, tag_1);
    } else {
      return new UnionType(name, function(u) {
        return codecs.some(function(type2) {
          return type2.is(u);
        });
      }, function(u, c) {
        var errors = [];
        for (var i = 0; i < codecs.length; i++) {
          var codec = codecs[i];
          var result = codec.validate(u, exports2.appendContext(c, String(i), codec, u));
          if (Either_1.isLeft(result)) {
            pushAll(errors, result.left);
          } else {
            return exports2.success(result.right);
          }
        }
        return exports2.failures(errors);
      }, useIdentity(codecs) ? exports2.identity : function(a) {
        for (var _i = 0, codecs_1 = codecs; _i < codecs_1.length; _i++) {
          var codec = codecs_1[_i];
          if (codec.is(a)) {
            return codec.encode(a);
          }
        }
        throw new Error("no codec found to encode value in union type " + name);
      }, codecs);
    }
  };
  var IntersectionType = function(_super) {
    __extends(IntersectionType2, _super);
    function IntersectionType2(name, is, validate, encode, types) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.types = types;
      _this._tag = "IntersectionType";
      return _this;
    }
    return IntersectionType2;
  }(Type);
  exports2.IntersectionType = IntersectionType;
  exports2.mergeAll = function(base, us) {
    var equal = true;
    var primitive = true;
    var baseIsNotADictionary = !exports2.UnknownRecord.is(base);
    for (var _i = 0, us_1 = us; _i < us_1.length; _i++) {
      var u = us_1[_i];
      if (u !== base) {
        equal = false;
      }
      if (exports2.UnknownRecord.is(u)) {
        primitive = false;
      }
    }
    if (equal) {
      return base;
    } else if (primitive) {
      return us[us.length - 1];
    }
    var r = {};
    for (var _a = 0, us_2 = us; _a < us_2.length; _a++) {
      var u = us_2[_a];
      for (var k in u) {
        if (!r.hasOwnProperty(k) || baseIsNotADictionary || u[k] !== base[k]) {
          r[k] = u[k];
        }
      }
    }
    return r;
  };
  function intersection2(codecs, name) {
    if (name === void 0) {
      name = "(" + codecs.map(function(type2) {
        return type2.name;
      }).join(" & ") + ")";
    }
    var len = codecs.length;
    return new IntersectionType(name, function(u) {
      return codecs.every(function(type2) {
        return type2.is(u);
      });
    }, codecs.length === 0 ? exports2.success : function(u, c) {
      var us = [];
      var errors = [];
      for (var i = 0; i < len; i++) {
        var codec = codecs[i];
        var result = codec.validate(u, exports2.appendContext(c, String(i), codec, u));
        if (Either_1.isLeft(result)) {
          pushAll(errors, result.left);
        } else {
          us.push(result.right);
        }
      }
      return errors.length > 0 ? exports2.failures(errors) : exports2.success(exports2.mergeAll(u, us));
    }, codecs.length === 0 ? exports2.identity : function(a) {
      return exports2.mergeAll(a, codecs.map(function(codec) {
        return codec.encode(a);
      }));
    }, codecs);
  }
  exports2.intersection = intersection2;
  var TupleType = function(_super) {
    __extends(TupleType2, _super);
    function TupleType2(name, is, validate, encode, types) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.types = types;
      _this._tag = "TupleType";
      return _this;
    }
    return TupleType2;
  }(Type);
  exports2.TupleType = TupleType;
  function tuple(codecs, name) {
    if (name === void 0) {
      name = "[" + codecs.map(function(type2) {
        return type2.name;
      }).join(", ") + "]";
    }
    var len = codecs.length;
    return new TupleType(name, function(u) {
      return exports2.UnknownArray.is(u) && u.length === len && codecs.every(function(type2, i) {
        return type2.is(u[i]);
      });
    }, function(u, c) {
      var e = exports2.UnknownArray.validate(u, c);
      if (Either_1.isLeft(e)) {
        return e;
      }
      var us = e.right;
      var as = us.length > len ? us.slice(0, len) : us;
      var errors = [];
      for (var i = 0; i < len; i++) {
        var a = us[i];
        var type_3 = codecs[i];
        var result = type_3.validate(a, exports2.appendContext(c, String(i), type_3, a));
        if (Either_1.isLeft(result)) {
          pushAll(errors, result.left);
        } else {
          var va = result.right;
          if (va !== a) {
            if (as === us) {
              as = us.slice();
            }
            as[i] = va;
          }
        }
      }
      return errors.length > 0 ? exports2.failures(errors) : exports2.success(as);
    }, useIdentity(codecs) ? exports2.identity : function(a) {
      return codecs.map(function(type2, i) {
        return type2.encode(a[i]);
      });
    }, codecs);
  }
  exports2.tuple = tuple;
  var ReadonlyType = function(_super) {
    __extends(ReadonlyType2, _super);
    function ReadonlyType2(name, is, validate, encode, type2) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.type = type2;
      _this._tag = "ReadonlyType";
      return _this;
    }
    return ReadonlyType2;
  }(Type);
  exports2.ReadonlyType = ReadonlyType;
  exports2.readonly = function(codec, name) {
    if (name === void 0) {
      name = "Readonly<" + codec.name + ">";
    }
    return new ReadonlyType(name, codec.is, codec.validate, codec.encode, codec);
  };
  var ReadonlyArrayType = function(_super) {
    __extends(ReadonlyArrayType2, _super);
    function ReadonlyArrayType2(name, is, validate, encode, type2) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.type = type2;
      _this._tag = "ReadonlyArrayType";
      return _this;
    }
    return ReadonlyArrayType2;
  }(Type);
  exports2.ReadonlyArrayType = ReadonlyArrayType;
  exports2.readonlyArray = function(item, name) {
    if (name === void 0) {
      name = "ReadonlyArray<" + item.name + ">";
    }
    var codec = exports2.array(item);
    return new ReadonlyArrayType(name, codec.is, codec.validate, codec.encode, item);
  };
  exports2.strict = function(props, name) {
    return exports2.exact(exports2.type(props), name);
  };
  var TaggedUnionType = function(_super) {
    __extends(TaggedUnionType2, _super);
    function TaggedUnionType2(name, is, validate, encode, codecs, tag) {
      var _this = _super.call(this, name, is, validate, encode, codecs) || this;
      _this.tag = tag;
      return _this;
    }
    return TaggedUnionType2;
  }(UnionType);
  exports2.TaggedUnionType = TaggedUnionType;
  exports2.taggedUnion = function(tag, codecs, name) {
    if (name === void 0) {
      name = getUnionName(codecs);
    }
    var U = exports2.union(codecs, name);
    if (U instanceof TaggedUnionType) {
      return U;
    } else {
      console.warn("[io-ts] Cannot build a tagged union for " + name + ", returning a de-optimized union");
      return new TaggedUnionType(name, U.is, U.validate, U.encode, codecs, tag);
    }
  };
  var ExactType = function(_super) {
    __extends(ExactType2, _super);
    function ExactType2(name, is, validate, encode, type2) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.type = type2;
      _this._tag = "ExactType";
      return _this;
    }
    return ExactType2;
  }(Type);
  exports2.ExactType = ExactType;
  var getProps = function(codec) {
    switch (codec._tag) {
      case "RefinementType":
      case "ReadonlyType":
        return getProps(codec.type);
      case "InterfaceType":
      case "StrictType":
      case "PartialType":
        return codec.props;
      case "IntersectionType":
        return codec.types.reduce(function(props, type2) {
          return Object.assign(props, getProps(type2));
        }, {});
    }
  };
  var stripKeys = function(o, props) {
    var keys = Object.getOwnPropertyNames(o);
    var shouldStrip = false;
    var r = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!hasOwnProperty2.call(props, key)) {
        shouldStrip = true;
      } else {
        r[key] = o[key];
      }
    }
    return shouldStrip ? r : o;
  };
  var getExactTypeName = function(codec) {
    if (isTypeC(codec)) {
      return "{| " + getNameFromProps(codec.props) + " |}";
    } else if (isPartialC(codec)) {
      return getPartialTypeName("{| " + getNameFromProps(codec.props) + " |}");
    }
    return "Exact<" + codec.name + ">";
  };
  exports2.exact = function(codec, name) {
    if (name === void 0) {
      name = getExactTypeName(codec);
    }
    var props = getProps(codec);
    return new ExactType(name, codec.is, function(u, c) {
      var e = exports2.UnknownRecord.validate(u, c);
      if (Either_1.isLeft(e)) {
        return e;
      }
      var ce = codec.validate(u, c);
      if (Either_1.isLeft(ce)) {
        return ce;
      }
      return Either_1.right(stripKeys(ce.right, props));
    }, function(a) {
      return codec.encode(stripKeys(a, props));
    }, codec);
  };
  exports2.getValidationError = function(value, context) {
    return {
      value,
      context
    };
  };
  exports2.getDefaultContext = function(decoder) {
    return [
      {key: "", type: decoder}
    ];
  };
  var NeverType = function(_super) {
    __extends(NeverType2, _super);
    function NeverType2() {
      var _this = _super.call(this, "never", function(_) {
        return false;
      }, function(u, c) {
        return exports2.failure(u, c);
      }, function() {
        throw new Error("cannot encode never");
      }) || this;
      _this._tag = "NeverType";
      return _this;
    }
    return NeverType2;
  }(Type);
  exports2.NeverType = NeverType;
  exports2.never = new NeverType();
  var AnyType = function(_super) {
    __extends(AnyType2, _super);
    function AnyType2() {
      var _this = _super.call(this, "any", function(_) {
        return true;
      }, exports2.success, exports2.identity) || this;
      _this._tag = "AnyType";
      return _this;
    }
    return AnyType2;
  }(Type);
  exports2.AnyType = AnyType;
  exports2.any = new AnyType();
  exports2.Dictionary = exports2.UnknownRecord;
  var ObjectType = function(_super) {
    __extends(ObjectType2, _super);
    function ObjectType2() {
      var _this = _super.call(this, "object", function(u) {
        return u !== null && typeof u === "object";
      }, function(u, c) {
        return _this.is(u) ? exports2.success(u) : exports2.failure(u, c);
      }, exports2.identity) || this;
      _this._tag = "ObjectType";
      return _this;
    }
    return ObjectType2;
  }(Type);
  exports2.ObjectType = ObjectType;
  exports2.object = new ObjectType();
  function refinement(codec, predicate, name) {
    if (name === void 0) {
      name = "(" + codec.name + " | " + exports2.getFunctionName(predicate) + ")";
    }
    return new RefinementType(name, function(u) {
      return codec.is(u) && predicate(u);
    }, function(i, c) {
      var e = codec.validate(i, c);
      if (Either_1.isLeft(e)) {
        return e;
      }
      var a = e.right;
      return predicate(a) ? exports2.success(a) : exports2.failure(a, c);
    }, codec.encode, codec, predicate);
  }
  exports2.refinement = refinement;
  exports2.Integer = refinement(exports2.number, Number.isInteger, "Integer");
  exports2.dictionary = record;
  var StrictType = function(_super) {
    __extends(StrictType2, _super);
    function StrictType2(name, is, validate, encode, props) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      _this.props = props;
      _this._tag = "StrictType";
      return _this;
    }
    return StrictType2;
  }(Type);
  exports2.StrictType = StrictType;
  function clean(codec) {
    return codec;
  }
  exports2.clean = clean;
  function alias(codec) {
    return function() {
      return codec;
    };
  }
  exports2.alias = alias;
  var isNonEmpty = function(as) {
    return as.length > 0;
  };
  exports2.emptyTags = {};
  function intersect(a, b) {
    var r = [];
    for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
      var v = a_1[_i];
      if (b.indexOf(v) !== -1) {
        r.push(v);
      }
    }
    return r;
  }
  function mergeTags(a, b) {
    if (a === exports2.emptyTags) {
      return b;
    }
    if (b === exports2.emptyTags) {
      return a;
    }
    var r = Object.assign({}, a);
    for (var k in b) {
      if (a.hasOwnProperty(k)) {
        var intersection_1 = intersect(a[k], b[k]);
        if (isNonEmpty(intersection_1)) {
          r[k] = intersection_1;
        } else {
          r = exports2.emptyTags;
          break;
        }
      } else {
        r[k] = b[k];
      }
    }
    return r;
  }
  function intersectTags(a, b) {
    if (a === exports2.emptyTags || b === exports2.emptyTags) {
      return exports2.emptyTags;
    }
    var r = exports2.emptyTags;
    for (var k in a) {
      if (b.hasOwnProperty(k)) {
        var intersection_2 = intersect(a[k], b[k]);
        if (intersection_2.length === 0) {
          if (r === exports2.emptyTags) {
            r = {};
          }
          r[k] = a[k].concat(b[k]);
        }
      }
    }
    return r;
  }
  function isAnyC(codec) {
    return codec._tag === "AnyType";
  }
  function isLiteralC(codec) {
    return codec._tag === "LiteralType";
  }
  function isKeyofC(codec) {
    return codec._tag === "KeyofType";
  }
  function isTypeC(codec) {
    return codec._tag === "InterfaceType";
  }
  function isPartialC(codec) {
    return codec._tag === "PartialType";
  }
  function isStrictC(codec) {
    return codec._tag === "StrictType";
  }
  function isExactC(codec) {
    return codec._tag === "ExactType";
  }
  function isRefinementC(codec) {
    return codec._tag === "RefinementType";
  }
  function isIntersectionC(codec) {
    return codec._tag === "IntersectionType";
  }
  function isUnionC(codec) {
    return codec._tag === "UnionType";
  }
  function isRecursiveC(codec) {
    return codec._tag === "RecursiveType";
  }
  var lazyCodecs = [];
  function getTags(codec) {
    if (lazyCodecs.indexOf(codec) !== -1) {
      return exports2.emptyTags;
    }
    if (isTypeC(codec) || isStrictC(codec)) {
      var index = exports2.emptyTags;
      for (var k in codec.props) {
        var prop = codec.props[k];
        if (isLiteralC(prop)) {
          if (index === exports2.emptyTags) {
            index = {};
          }
          index[k] = [prop.value];
        }
      }
      return index;
    } else if (isExactC(codec) || isRefinementC(codec)) {
      return getTags(codec.type);
    } else if (isIntersectionC(codec)) {
      return codec.types.reduce(function(tags2, codec2) {
        return mergeTags(tags2, getTags(codec2));
      }, exports2.emptyTags);
    } else if (isUnionC(codec)) {
      return codec.types.slice(1).reduce(function(tags2, codec2) {
        return intersectTags(tags2, getTags(codec2));
      }, getTags(codec.types[0]));
    } else if (isRecursiveC(codec)) {
      lazyCodecs.push(codec);
      var tags = getTags(codec.type);
      lazyCodecs.pop();
      return tags;
    }
    return exports2.emptyTags;
  }
  exports2.getTags = getTags;
  function getIndex(codecs) {
    var tags = getTags(codecs[0]);
    var keys = Object.keys(tags);
    var len = codecs.length;
    var _loop_1 = function(k2) {
      var all = tags[k2].slice();
      var index = [tags[k2]];
      for (var i = 1; i < len; i++) {
        var codec = codecs[i];
        var ctags = getTags(codec);
        var values = ctags[k2];
        if (values === void 0) {
          return "continue-keys";
        } else {
          if (values.some(function(v) {
            return all.indexOf(v) !== -1;
          })) {
            return "continue-keys";
          } else {
            all.push.apply(all, values);
            index.push(values);
          }
        }
      }
      return {value: [k2, index]};
    };
    keys:
      for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        var state_1 = _loop_1(k);
        if (typeof state_1 === "object")
          return state_1.value;
        switch (state_1) {
          case "continue-keys":
            continue keys;
        }
      }
    return void 0;
  }
  exports2.getIndex = getIndex;
});

// node_modules/micromustache/dist/micromustache.cjs
var require_micromustache = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  var numberConstructor = 0 .constructor;
  var isFinite2 = numberConstructor.isFinite;
  var isInteger2 = numberConstructor.isInteger;
  var isArray = [].constructor.isArray;
  function isObj(x) {
    return x !== null && typeof x === "object";
  }
  function isFn(x) {
    return typeof x === "function";
  }
  function isStr(x, minLength) {
    if (minLength === void 0) {
      minLength = 0;
    }
    return typeof x === "string" && x.length >= minLength;
  }
  function isNum(x) {
    return isFinite2(x);
  }
  function isArr(x) {
    return isArray(x);
  }
  function isProp(x, propName) {
    return isObj(x) && propName in x;
  }
  var cacheSize = 1e3;
  var quoteChars = "'\"`";
  var Cache = function() {
    function Cache2(size) {
      this.size = size;
      this.reset();
    }
    Cache2.prototype.reset = function() {
      this.oldestIndex = 0;
      this.map = {};
      this.cachedKeys = new Array(this.size);
    };
    Cache2.prototype.get = function(key) {
      return this.map[key];
    };
    Cache2.prototype.set = function(key, value) {
      this.map[key] = value;
      var oldestKey = this.cachedKeys[this.oldestIndex];
      if (oldestKey !== void 0) {
        delete this.map[oldestKey];
      }
      this.cachedKeys[this.oldestIndex] = key;
      this.oldestIndex++;
      this.oldestIndex %= this.size;
    };
    return Cache2;
  }();
  var cache = new Cache(cacheSize);
  function propBetweenBrackets(propName) {
    var firstChar = propName.charAt(0);
    var lastChar = propName.substr(-1);
    if (quoteChars.includes(firstChar) || quoteChars.includes(lastChar)) {
      if (propName.length < 2 || firstChar !== lastChar) {
        throw new SyntaxError('Mismatching string quotation: "' + propName + '"');
      }
      return propName.substring(1, propName.length - 1);
    }
    if (propName.includes("[")) {
      throw new SyntaxError('Missing ] in varName "' + propName + '"');
    }
    if (firstChar === "+") {
      return propName.substr(1);
    }
    return propName;
  }
  function pushPropName(propNames, propName, preDot) {
    var pName = propName.trim();
    if (pName === "") {
      return propNames;
    }
    if (pName.startsWith(".")) {
      if (preDot) {
        pName = pName.substr(1).trim();
        if (pName === "") {
          return propNames;
        }
      } else {
        throw new SyntaxError('Unexpected . at the start of "' + propName + '"');
      }
    } else if (preDot) {
      throw new SyntaxError('Missing . at the start of "' + propName + '"');
    }
    if (pName.endsWith(".")) {
      throw new SyntaxError('Unexpected "." at the end of "' + propName + '"');
    }
    var propNameParts = pName.split(".");
    for (var _i = 0, propNameParts_1 = propNameParts; _i < propNameParts_1.length; _i++) {
      var propNamePart = propNameParts_1[_i];
      var trimmedPropName = propNamePart.trim();
      if (trimmedPropName === "") {
        throw new SyntaxError('Empty prop name when parsing "' + propName + '"');
      }
      propNames.push(trimmedPropName);
    }
    return propNames;
  }
  function toPath(varName) {
    if (!isStr(varName)) {
      throw new TypeError("Cannot parse path. Expected string. Got a " + typeof varName);
    }
    var openBracketIndex;
    var closeBracketIndex = 0;
    var beforeBracket;
    var propName;
    var preDot = false;
    var propNames = new Array(0);
    for (var currentIndex = 0; currentIndex < varName.length; currentIndex = closeBracketIndex) {
      openBracketIndex = varName.indexOf("[", currentIndex);
      if (openBracketIndex === -1) {
        break;
      }
      closeBracketIndex = varName.indexOf("]", openBracketIndex);
      if (closeBracketIndex === -1) {
        throw new SyntaxError('Missing ] in varName "' + varName + '"');
      }
      propName = varName.substring(openBracketIndex + 1, closeBracketIndex).trim();
      if (propName.length === 0) {
        throw new SyntaxError("Unexpected token ]");
      }
      closeBracketIndex++;
      beforeBracket = varName.substring(currentIndex, openBracketIndex);
      pushPropName(propNames, beforeBracket, preDot);
      propNames.push(propBetweenBrackets(propName));
      preDot = true;
    }
    var rest = varName.substring(closeBracketIndex);
    return pushPropName(propNames, rest, preDot);
  }
  function toPathCached(varName) {
    var result = cache.get(varName);
    if (result === void 0) {
      result = toPath(varName);
      cache.set(varName, result);
    }
    return result;
  }
  toPath.cached = toPathCached;
  function get3(scope, varNameOrPropNames, options) {
    if (options === void 0) {
      options = {};
    }
    if (!isObj(options)) {
      throw new TypeError("get expects an object option. Got " + typeof options);
    }
    var _a = options.depth, depth = _a === void 0 ? 10 : _a;
    if (!isNum(depth) || depth <= 0) {
      throw new RangeError("Expected a positive number for depth. Got " + depth);
    }
    var propNames = Array.isArray(varNameOrPropNames) ? varNameOrPropNames : toPath.cached(varNameOrPropNames);
    var propNamesAsStr = function() {
      return propNames.join(" > ");
    };
    if (propNames.length > depth) {
      throw new ReferenceError("The path cannot be deeper than " + depth + ' levels. Got "' + propNamesAsStr() + '"');
    }
    var currentScope = scope;
    for (var _i = 0, propNames_1 = propNames; _i < propNames_1.length; _i++) {
      var propName = propNames_1[_i];
      if (isProp(currentScope, propName)) {
        currentScope = currentScope[propName];
      } else if (options.propsExist) {
        throw new ReferenceError(propName + ' is not defined in the scope at path: "' + propNamesAsStr() + '"');
      } else {
        return;
      }
    }
    return currentScope;
  }
  var Renderer = function() {
    function Renderer2(tokens, options) {
      var _this = this;
      if (options === void 0) {
        options = {};
      }
      this.tokens = tokens;
      this.options = options;
      this.render = function(scope) {
        if (scope === void 0) {
          scope = {};
        }
        var varNames = _this.tokens.varNames;
        var length = varNames.length;
        _this.cacheParsedPaths();
        var values = new Array(length);
        for (var i = 0; i < length; i++) {
          values[i] = get3(scope, _this.toPathCache[i], _this.options);
        }
        return _this.stringify(values);
      };
      this.renderFn = function(resolveFn, scope) {
        if (scope === void 0) {
          scope = {};
        }
        var values = _this.resolveVarNames(resolveFn, scope);
        return _this.stringify(values);
      };
      this.renderFnAsync = function(resolveFnAsync, scope) {
        if (scope === void 0) {
          scope = {};
        }
        return Promise.all(_this.resolveVarNames(resolveFnAsync, scope)).then(function(values) {
          return _this.stringify(values);
        });
      };
      if (!isObj(tokens) || !isArr(tokens.strings) || !isArr(tokens.varNames) || tokens.strings.length !== tokens.varNames.length + 1) {
        throw new TypeError("Invalid tokens object");
      }
      if (!isObj(options)) {
        throw new TypeError("Options should be an object. Got a " + typeof options);
      }
      if (options.validateVarNames) {
        this.cacheParsedPaths();
      }
    }
    Renderer2.prototype.cacheParsedPaths = function() {
      var varNames = this.tokens.varNames;
      if (this.toPathCache === void 0) {
        this.toPathCache = new Array(varNames.length);
        for (var i = 0; i < varNames.length; i++) {
          this.toPathCache[i] = toPath.cached(varNames[i]);
        }
      }
    };
    Renderer2.prototype.resolveVarNames = function(resolveFn, scope) {
      if (scope === void 0) {
        scope = {};
      }
      var varNames = this.tokens.varNames;
      if (!isFn(resolveFn)) {
        throw new TypeError("Expected a resolver function. Got " + String(resolveFn));
      }
      var length = varNames.length;
      var values = new Array(length);
      for (var i = 0; i < length; i++) {
        values[i] = resolveFn.call(null, varNames[i], scope);
      }
      return values;
    };
    Renderer2.prototype.stringify = function(values) {
      var strings = this.tokens.strings;
      var explicit = this.options.explicit;
      var length = values.length;
      var ret = "";
      for (var i = 0; i < length; i++) {
        ret += strings[i];
        var value = values[i];
        if (explicit || value !== null && value !== void 0) {
          ret += value;
        }
      }
      ret += strings[length];
      return ret;
    };
    return Renderer2;
  }();
  function tokenize(template2, options) {
    if (options === void 0) {
      options = {};
    }
    if (!isStr(template2)) {
      throw new TypeError("The template parameter must be a string. Got a " + typeof template2);
    }
    if (!isObj(options)) {
      throw new TypeError("Options should be an object. Got a " + typeof options);
    }
    var _a = options.tags, tags = _a === void 0 ? ["{{", "}}"] : _a, _b = options.maxVarNameLength, maxVarNameLength = _b === void 0 ? 1e3 : _b;
    if (!isArr(tags) || tags.length !== 2) {
      throw TypeError("tags should be an array of two elements. Got " + String(tags));
    }
    var openSym = tags[0], closeSym = tags[1];
    if (!isStr(openSym, 1) || !isStr(closeSym, 1) || openSym === closeSym) {
      throw new TypeError('The open and close symbols should be two distinct non-empty strings. Got "' + openSym + '" and "' + closeSym + '"');
    }
    if (!isNum(maxVarNameLength) || maxVarNameLength <= 0) {
      throw new Error("Expected a positive number for maxVarNameLength. Got " + maxVarNameLength);
    }
    var openSymLen = openSym.length;
    var closeSymLen = closeSym.length;
    var openIndex;
    var closeIndex = 0;
    var varName;
    var strings = [];
    var varNames = [];
    var currentIndex = 0;
    while (currentIndex < template2.length) {
      openIndex = template2.indexOf(openSym, currentIndex);
      if (openIndex === -1) {
        break;
      }
      var varNameStartIndex = openIndex + openSymLen;
      closeIndex = template2.substr(varNameStartIndex, maxVarNameLength + closeSymLen).indexOf(closeSym);
      if (closeIndex === -1) {
        throw new SyntaxError('Missing "' + closeSym + '" in the template for the "' + openSym + '" at position ' + openIndex + " within " + maxVarNameLength + " characters");
      }
      closeIndex += varNameStartIndex;
      varName = template2.substring(varNameStartIndex, closeIndex).trim();
      if (varName.length === 0) {
        throw new SyntaxError('Unexpected "' + closeSym + '" tag found at position ' + openIndex);
      }
      if (varName.includes(openSym)) {
        throw new SyntaxError('Variable names cannot have "' + openSym + '". But at position ' + openIndex + '. Got "' + varName + '"');
      }
      varNames.push(varName);
      closeIndex += closeSymLen;
      strings.push(template2.substring(currentIndex, openIndex));
      currentIndex = closeIndex;
    }
    strings.push(template2.substring(closeIndex));
    return {strings, varNames};
  }
  function compile(template2, options) {
    if (options === void 0) {
      options = {};
    }
    var tokens = tokenize(template2, options);
    return new Renderer(tokens, options);
  }
  function render2(template2, scope, options) {
    var renderer = compile(template2, options);
    return renderer.render(scope);
  }
  function renderFn2(template2, resolveFn, scope, options) {
    var renderer = compile(template2, options);
    return renderer.renderFn(resolveFn, scope);
  }
  function renderFnAsync(template2, resolveFnAsync, scope, options) {
    var renderer = compile(template2, options);
    return renderer.renderFnAsync(resolveFnAsync, scope);
  }
  exports2.Renderer = Renderer;
  exports2.compile = compile;
  exports2.get = get3;
  exports2.render = render2;
  exports2.renderFn = renderFn2;
  exports2.renderFnAsync = renderFnAsync;
  exports2.tokenize = tokenize;
});

// src/vim/projet-vim.ts
var import_path = __toModule(require("path"));
var import_util = __toModule(require("util"));

// src/projet.ts
var toml = __toModule(require_toml());
var import_Either = __toModule(require_Either());
var fs = __toModule(require("fs"));
var import_fs = __toModule(require("fs"));
var match = __toModule(require_micromatch());
var path3 = __toModule(require("path"));

// src/config.ts
var t = __toModule(require_lib());
var Link = t.type({
  name: t.string,
  pattern: t.string
});
var Rule = t.intersection([
  t.type({
    name: t.string,
    pattern: t.string
  }),
  t.partial({
    template: t.string,
    links: t.array(Link)
  })
]);
var Config = t.type({
  rules: t.array(Rule)
});

// src/template.ts
var mustache = __toModule(require_micromustache());
var path2 = __toModule(require("path"));

// src/transforms.ts
var path = __toModule(require("path"));
var separatorPattern = new RegExp(path.sep, "g");
var replaceForwardSlash = (replacement) => (source) => source.replace(separatorPattern, replacement);
var replaceAll = (pattern, replacement) => (source) => source.replace(new RegExp(pattern, "g"), replacement);
var transforms = {
  uppercase: (s) => s.toUpperCase(),
  lowercase: (s) => s.toLowerCase(),
  dot: replaceForwardSlash("."),
  underscore: replaceForwardSlash("_"),
  backslash: replaceForwardSlash("\\"),
  colons: replaceForwardSlash("::"),
  hyphenate: replaceAll("_", "-"),
  blank: replaceAll("[_-]", " "),
  camelcase: (s) => s.replace(/[_-](.)/g, (_, _1) => _1.toUpperCase()),
  capitalize: (s) => s.replace(/(?<=^|\/)(.)/g, (_, _1) => _1.toUpperCase()),
  snakecase: (s) => s.replace(/([A-Z]+)([A-Z][a-z])/g, (_, _1, _2) => `${_1}_${_2}`).replace(/([a-z0-9])([A-Z])/g, (_, _1, _2) => `${_1}_${_2}`).toLowerCase(),
  dirname: path.dirname,
  basename: path.basename,
  absolute: path.resolve,
  extname: path.extname
};
var isTransformer = (s) => s in transforms;

// src/template.ts
var br = "\n";
function buildScope(match2, bindings) {
  const entries = match2.captures.map((value, idx) => [`$${idx}`, value]);
  const star = path2.join(...match2.captures);
  const captures = Object.fromEntries(entries);
  const scope = Object.assign(bindings, captures);
  scope["$*"] = star;
  return scope;
}
function get2(scope, pathExpr) {
  return mustache.get(scope, pathExpr, {propsExist: true});
}
var TransformNameError = class extends Error {
  constructor(transform) {
    super(`TransformNameError: "${transform}" is not a known transform.` + br + "Available transforms: " + Object.keys(transforms).join(", "));
  }
};
function pipeReducer(acc, transformName) {
  transformName = transformName.trim();
  if (!isTransformer(transformName))
    throw new TransformNameError(transformName);
  return transforms[transformName](acc);
}
function exec(expr, scope = {}) {
  const [lhs, ...pipes] = expr.split("|");
  if (!lhs)
    throw new Error(`expected left hand side to reference one or more variables, like "{$0}"`);
  const values = lhs.trim().split(/\s+/).map((token) => {
    const value2 = get2(scope, token);
    if (typeof value2 !== "string") {
      throw new TypeError(`expected "${token}" to be a string,
        got: ${JSON.stringify(value2, null, 2)}`);
    }
    return value2;
  });
  const value = path2.join(...values);
  return pipes.reduce(pipeReducer, value);
}
function render(template2, scope) {
  const opts = {tags: ["{", "}"], propsExist: true, validateVarNames: true};
  try {
    return path2.normalize(mustache.renderFn(template2, exec, scope, opts));
  } catch (e) {
    if (e instanceof ReferenceError)
      formatError(e, scope);
    throw e;
  }
}
function formatError(e, scope) {
  const message = e.message;
  const stack = e.stack;
  const reraised = new ReferenceError([
    message,
    br,
    `Available assigns: ${Object.keys(scope).join(", ")}`,
    br
  ].join(""));
  reraised.stack = stack == null ? void 0 : stack.split("\n").slice(2).join("\n");
  throw reraised;
}

// src/projet.ts
async function findConfig(startingDir) {
  let dir = startingDir;
  while (true) {
    let filename = path3.join(dir, ".projet.toml");
    if (fs.existsSync(filename))
      return path3.resolve(filename);
    if (dir === "/")
      throw "couldn't find config file";
    dir = path3.dirname(dir);
  }
}
async function loadConfig(localpath) {
  const content = await import_fs.promises.readFile(localpath, {encoding: "utf-8"});
  const json = toml.parse(content);
  const config = Config.decode(json);
  if (import_Either.isLeft(config))
    throw config.left;
  else
    return {path: localpath, config: config.right};
}
async function getConfig(startingDir) {
  const configPath = await findConfig(startingDir);
  return loadConfig(configPath);
}
function findMatch(config, filepath) {
  const to = path3.dirname(config.path);
  const localpath = path3.relative(to, filepath);
  const rules = config.config.rules;
  for (const rule of rules) {
    const category = rule.name;
    const pattern = rule.pattern;
    const captures = match.capture(pattern, localpath);
    if (captures)
      return {captures, category, rule};
  }
  return null;
}
function assoc(config, file, linkName) {
  const match2 = findMatch(config, file);
  if (!match2)
    throw `No matching rule for ${file}`;
  const rule = match2.rule;
  let link = findLink(rule, linkName);
  const pattern = link.pattern;
  const binding = {file};
  const scope = buildScope(match2, binding);
  let localpath = render(pattern, scope);
  const dir = path3.dirname(config.path);
  localpath = path3.join(dir, localpath);
  return path3.normalize(localpath);
}
function findLink(rule, linkName) {
  var _a;
  const ruleName = rule.name;
  const links = (_a = rule.links) != null ? _a : [];
  if (!linkName) {
    const link2 = links[0];
    if (!link2)
      throw `No links defined for ${ruleName}`;
    return link2;
  }
  const link = links.find(({name}) => name === linkName);
  if (!link)
    throw `No link named ${linkName} defined for ${ruleName}`;
  return link;
}
function template(config, file) {
  const match2 = findMatch(config, file);
  if (!match2)
    throw `no match for: ${file}`;
  const template2 = match2.rule.template;
  if (!template2)
    throw new Error(`No template defined for ${match2.category}`);
  const binding = {file};
  const scope = buildScope(match2, binding);
  return render(template2, scope);
}

// src/vim/projet-vim.ts
var pluginOptions = {
  dev: true,
  alwaysInit: true
};
module.exports = (plugin) => {
  const api = plugin.nvim;
  const cmd = api.command.bind(api);
  plugin.setOptions(pluginOptions);
  const logger = plugin.nvim.logger;
  const debug = logger.debug.bind(logger);
  const info = logger.info.bind(logger);
  const error = logger.error.bind(logger);
  const warn = logger.warn.bind(logger);
  const dump = (x) => echomsg(import_util.default.inspect(x, false, null));
  const echoerr = (...msg) => api.errWriteLine(msg.join(" "));
  const echomsg = (...msg) => api.outWriteLine(msg.join(" "));
  const catchErrors = (fn) => async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      if (typeof e === "string")
        return echoerr(e);
      else
        return echoerr(import_util.default.inspect(e, 1));
    }
  };
  function defCmd(name, fn, opts) {
    const wrappedFunction = catchErrors(fn);
    return plugin.registerCommand(name, wrappedFunction, opts);
  }
  function defFn(name, fn, opts) {
    const wrappedFunction = catchErrors(fn);
    return plugin.registerFunction(name, wrappedFunction, opts);
  }
  function defAutocmd(name, fn, opts) {
    const wrappedFunction = catchErrors(fn);
    return plugin.registerAutocmd(name, wrappedFunction, opts);
  }
  defCmd("ProjetLink", async ([linkName]) => {
    const file = await api.buffer.name;
    const config = await getConfig(file);
    let linkFile = assoc(config, file, linkName);
    const cwd = await api.call("getcwd");
    linkFile = import_path.default.relative(cwd, linkFile);
    await cmd(`edit ${linkFile}`);
  }, {
    sync: false,
    nargs: "?",
    complete: "custom,ProjetLinkComplete"
  });
  defCmd("Cd", async () => {
    const bname = await api.buffer.name;
    const configFile = await findConfig(bname);
    const dir = import_path.default.dirname(configFile);
    await cmd(`cd ${dir}`);
  }, {sync: false});
  defCmd("Lcd", async () => {
    const bname = await api.buffer.name;
    const configFile = await findConfig(bname);
    const dir = import_path.default.dirname(configFile);
    await cmd(`lcd ${dir}`);
  }, {sync: false});
  defCmd("Tcd", async () => {
    const bname = await api.buffer.name;
    const configFile = await findConfig(bname);
    const dir = import_path.default.dirname(configFile);
    await cmd(`tcd ${dir}`);
  }, {sync: false});
  defCmd("ProjetConfig", async () => {
    const bname = await api.buffer.name;
    const configFile = await findConfig(bname);
    await cmd(`edit ${configFile}`);
  }, {sync: false});
  defFn("ProjetLinkComplete", async (_argLead, _cmdLine, _cursorPos) => {
    var _a, _b, _c;
    const file = await api.buffer.name;
    const config = await getConfig(file);
    const match2 = findMatch(config, file);
    const keys = (_c = (_b = (_a = match2 == null ? void 0 : match2.rule) == null ? void 0 : _a.links) == null ? void 0 : _b.map((x) => x.name)) != null ? _c : [];
    return keys.join("\n");
  }, {sync: true});
  defFn("ProjetGetConfig", async () => {
    const file = await api.buffer.name;
    return await getConfig(file);
  }, {sync: true});
  defFn("ProjetRenderTemplate", async () => {
    const file = await api.buffer.name;
    const config = await getConfig(file);
    return template(config, file);
  }, {sync: true});
  defFn("ProjetGetMatchConfig", async () => {
    const file = await api.buffer.name;
    const config = await getConfig(file);
    const match2 = findMatch(config, file);
    if (!match2)
      throw `No matches for ${file}`;
    return match2;
  }, {sync: true});
  defAutocmd("BufNewFile", async () => {
    const file = await api.buffer.name;
    const config = await getConfig(file);
    const template2 = template(config, file);
    const lines = template2.split("\n");
    await api.buffer.setLines(lines, {start: 0, end: -1});
  }, {
    pattern: "*",
    sync: false
  });
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL2xpYi9wYXJzZXIuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL2xpYi9jcmVhdGUtZGF0ZXRpbWUuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL2xpYi9mb3JtYXQtbnVtLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaWFybmEvdG9tbC9saWIvY3JlYXRlLWRhdGV0aW1lLWZsb2F0LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaWFybmEvdG9tbC9saWIvY3JlYXRlLWRhdGUuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL2xpYi9jcmVhdGUtdGltZS5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlhcm5hL3RvbWwvbGliL3RvbWwtcGFyc2VyLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaWFybmEvdG9tbC9wYXJzZS1wcmV0dHktZXJyb3IuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL3BhcnNlLXN0cmluZy5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlhcm5hL3RvbWwvcGFyc2UtYXN5bmMuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL3BhcnNlLXN0cmVhbS5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlhcm5hL3RvbWwvcGFyc2UuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL3N0cmluZ2lmeS5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlhcm5hL3RvbWwvdG9tbC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnAtdHMvbGliL0NoYWluUmVjLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcC10cy9saWIvZnVuY3Rpb24uanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZwLXRzL2xpYi9FaXRoZXIuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvdXRpbHMuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvc3RyaW5naWZ5LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9pcy1udW1iZXIvaW5kZXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RvLXJlZ2V4LXJhbmdlL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9maWxsLXJhbmdlL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL2NvbXBpbGUuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvZXhwYW5kLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL2NvbnN0YW50cy5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJhY2VzL2xpYi9wYXJzZS5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJhY2VzL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL2NvbnN0YW50cy5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi91dGlscy5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi9zY2FuLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL3BhcnNlLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL3BpY29tYXRjaC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9taWNyb21hdGNoL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9pby10cy9saWIvaW5kZXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21pY3JvbXVzdGFjaGUvc3JjL3V0aWxzLnRzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9taWNyb211c3RhY2hlL3NyYy90b3BhdGgudHMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21pY3JvbXVzdGFjaGUvc3JjL2dldC50cyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbWljcm9tdXN0YWNoZS9zcmMvcmVuZGVyZXIudHMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21pY3JvbXVzdGFjaGUvc3JjL3Rva2VuaXplLnRzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9taWNyb211c3RhY2hlL3NyYy9jb21waWxlLnRzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9taWNyb211c3RhY2hlL3NyYy9yZW5kZXIudHMiLCAiLi4vLi4vLi4vc3JjL3ZpbS9wcm9qZXQtdmltLnRzIiwgIi4uLy4uLy4uL3NyYy9wcm9qZXQudHMiLCAiLi4vLi4vLi4vc3JjL2NvbmZpZy50cyIsICIuLi8uLi8uLi9zcmMvdGVtcGxhdGUudHMiLCAiLi4vLi4vLi4vc3JjL3RyYW5zZm9ybXMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIid1c2Ugc3RyaWN0J1xuY29uc3QgUGFyc2VyRU5EID0gMHgxMTAwMDBcbmNsYXNzIFBhcnNlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBjb25zdHJ1Y3RvciAobXNnLCBmaWxlbmFtZSwgbGluZW51bWJlcikge1xuICAgIHN1cGVyKCdbUGFyc2VyRXJyb3JdICcgKyBtc2csIGZpbGVuYW1lLCBsaW5lbnVtYmVyKVxuICAgIHRoaXMubmFtZSA9ICdQYXJzZXJFcnJvcidcbiAgICB0aGlzLmNvZGUgPSAnUGFyc2VyRXJyb3InXG4gICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBQYXJzZXJFcnJvcilcbiAgfVxufVxuY2xhc3MgU3RhdGUge1xuICBjb25zdHJ1Y3RvciAocGFyc2VyKSB7XG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZXJcbiAgICB0aGlzLmJ1ZiA9ICcnXG4gICAgdGhpcy5yZXR1cm5lZCA9IG51bGxcbiAgICB0aGlzLnJlc3VsdCA9IG51bGxcbiAgICB0aGlzLnJlc3VsdFRhYmxlID0gbnVsbFxuICAgIHRoaXMucmVzdWx0QXJyID0gbnVsbFxuICB9XG59XG5jbGFzcyBQYXJzZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5wb3MgPSAwXG4gICAgdGhpcy5jb2wgPSAwXG4gICAgdGhpcy5saW5lID0gMFxuICAgIHRoaXMub2JqID0ge31cbiAgICB0aGlzLmN0eCA9IHRoaXMub2JqXG4gICAgdGhpcy5zdGFjayA9IFtdXG4gICAgdGhpcy5fYnVmID0gJydcbiAgICB0aGlzLmNoYXIgPSBudWxsXG4gICAgdGhpcy5paSA9IDBcbiAgICB0aGlzLnN0YXRlID0gbmV3IFN0YXRlKHRoaXMucGFyc2VTdGFydClcbiAgfVxuXG4gIHBhcnNlIChzdHIpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChzdHIubGVuZ3RoID09PSAwIHx8IHN0ci5sZW5ndGggPT0gbnVsbCkgcmV0dXJuXG5cbiAgICB0aGlzLl9idWYgPSBTdHJpbmcoc3RyKVxuICAgIHRoaXMuaWkgPSAtMVxuICAgIHRoaXMuY2hhciA9IC0xXG4gICAgbGV0IGdldE5leHRcbiAgICB3aGlsZSAoZ2V0TmV4dCA9PT0gZmFsc2UgfHwgdGhpcy5uZXh0Q2hhcigpKSB7XG4gICAgICBnZXROZXh0ID0gdGhpcy5ydW5PbmUoKVxuICAgIH1cbiAgICB0aGlzLl9idWYgPSBudWxsXG4gIH1cbiAgbmV4dENoYXIgKCkge1xuICAgIGlmICh0aGlzLmNoYXIgPT09IDB4MEEpIHtcbiAgICAgICsrdGhpcy5saW5lXG4gICAgICB0aGlzLmNvbCA9IC0xXG4gICAgfVxuICAgICsrdGhpcy5paVxuICAgIHRoaXMuY2hhciA9IHRoaXMuX2J1Zi5jb2RlUG9pbnRBdCh0aGlzLmlpKVxuICAgICsrdGhpcy5wb3NcbiAgICArK3RoaXMuY29sXG4gICAgcmV0dXJuIHRoaXMuaGF2ZUJ1ZmZlcigpXG4gIH1cbiAgaGF2ZUJ1ZmZlciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWkgPCB0aGlzLl9idWYubGVuZ3RoXG4gIH1cbiAgcnVuT25lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5wYXJzZXIuY2FsbCh0aGlzLCB0aGlzLnN0YXRlLnJldHVybmVkKVxuICB9XG4gIGZpbmlzaCAoKSB7XG4gICAgdGhpcy5jaGFyID0gUGFyc2VyRU5EXG4gICAgbGV0IGxhc3RcbiAgICBkbyB7XG4gICAgICBsYXN0ID0gdGhpcy5zdGF0ZS5wYXJzZXJcbiAgICAgIHRoaXMucnVuT25lKClcbiAgICB9IHdoaWxlICh0aGlzLnN0YXRlLnBhcnNlciAhPT0gbGFzdClcblxuICAgIHRoaXMuY3R4ID0gbnVsbFxuICAgIHRoaXMuc3RhdGUgPSBudWxsXG4gICAgdGhpcy5fYnVmID0gbnVsbFxuXG4gICAgcmV0dXJuIHRoaXMub2JqXG4gIH1cbiAgbmV4dCAoZm4pIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBQYXJzZXJFcnJvcignVHJpZWQgdG8gc2V0IHN0YXRlIHRvIG5vbi1leGlzdGVudCBzdGF0ZTogJyArIEpTT04uc3RyaW5naWZ5KGZuKSlcbiAgICB0aGlzLnN0YXRlLnBhcnNlciA9IGZuXG4gIH1cbiAgZ290byAoZm4pIHtcbiAgICB0aGlzLm5leHQoZm4pXG4gICAgcmV0dXJuIHRoaXMucnVuT25lKClcbiAgfVxuICBjYWxsIChmbiwgcmV0dXJuV2l0aCkge1xuICAgIGlmIChyZXR1cm5XaXRoKSB0aGlzLm5leHQocmV0dXJuV2l0aClcbiAgICB0aGlzLnN0YWNrLnB1c2godGhpcy5zdGF0ZSlcbiAgICB0aGlzLnN0YXRlID0gbmV3IFN0YXRlKGZuKVxuICB9XG4gIGNhbGxOb3cgKGZuLCByZXR1cm5XaXRoKSB7XG4gICAgdGhpcy5jYWxsKGZuLCByZXR1cm5XaXRoKVxuICAgIHJldHVybiB0aGlzLnJ1bk9uZSgpXG4gIH1cbiAgcmV0dXJuICh2YWx1ZSkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID09PSAwKSB0aHJvdyB0aGlzLmVycm9yKG5ldyBQYXJzZXJFcnJvcignU3RhY2sgdW5kZXJmbG93JykpXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHZhbHVlID0gdGhpcy5zdGF0ZS5idWZcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGFjay5wb3AoKVxuICAgIHRoaXMuc3RhdGUucmV0dXJuZWQgPSB2YWx1ZVxuICB9XG4gIHJldHVybk5vdyAodmFsdWUpIHtcbiAgICB0aGlzLnJldHVybih2YWx1ZSlcbiAgICByZXR1cm4gdGhpcy5ydW5PbmUoKVxuICB9XG4gIGNvbnN1bWUgKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuY2hhciA9PT0gUGFyc2VyRU5EKSB0aHJvdyB0aGlzLmVycm9yKG5ldyBQYXJzZXJFcnJvcignVW5leHBlY3RlZCBlbmQtb2YtYnVmZmVyJykpXG4gICAgdGhpcy5zdGF0ZS5idWYgKz0gdGhpcy5fYnVmW3RoaXMuaWldXG4gIH1cbiAgZXJyb3IgKGVycikge1xuICAgIGVyci5saW5lID0gdGhpcy5saW5lXG4gICAgZXJyLmNvbCA9IHRoaXMuY29sXG4gICAgZXJyLnBvcyA9IHRoaXMucG9zXG4gICAgcmV0dXJuIGVyclxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHBhcnNlU3RhcnQgKCkge1xuICAgIHRocm93IG5ldyBQYXJzZXJFcnJvcignTXVzdCBkZWNsYXJlIGEgcGFyc2VTdGFydCBtZXRob2QnKVxuICB9XG59XG5QYXJzZXIuRU5EID0gUGFyc2VyRU5EXG5QYXJzZXIuRXJyb3IgPSBQYXJzZXJFcnJvclxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXJcbiIsICIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0gdmFsdWUgPT4ge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoaXNOYU4oZGF0ZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIERhdGV0aW1lJylcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGF0ZVxuICB9XG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IChkLCBudW0pID0+IHtcbiAgbnVtID0gU3RyaW5nKG51bSlcbiAgd2hpbGUgKG51bS5sZW5ndGggPCBkKSBudW0gPSAnMCcgKyBudW1cbiAgcmV0dXJuIG51bVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuY29uc3QgZiA9IHJlcXVpcmUoJy4vZm9ybWF0LW51bS5qcycpXG5cbmNsYXNzIEZsb2F0aW5nRGF0ZVRpbWUgZXh0ZW5kcyBEYXRlIHtcbiAgY29uc3RydWN0b3IgKHZhbHVlKSB7XG4gICAgc3VwZXIodmFsdWUgKyAnWicpXG4gICAgdGhpcy5pc0Zsb2F0aW5nID0gdHJ1ZVxuICB9XG4gIHRvSVNPU3RyaW5nICgpIHtcbiAgICBjb25zdCBkYXRlID0gYCR7dGhpcy5nZXRVVENGdWxsWWVhcigpfS0ke2YoMiwgdGhpcy5nZXRVVENNb250aCgpICsgMSl9LSR7ZigyLCB0aGlzLmdldFVUQ0RhdGUoKSl9YFxuICAgIGNvbnN0IHRpbWUgPSBgJHtmKDIsIHRoaXMuZ2V0VVRDSG91cnMoKSl9OiR7ZigyLCB0aGlzLmdldFVUQ01pbnV0ZXMoKSl9OiR7ZigyLCB0aGlzLmdldFVUQ1NlY29uZHMoKSl9LiR7ZigzLCB0aGlzLmdldFVUQ01pbGxpc2Vjb25kcygpKX1gXG4gICAgcmV0dXJuIGAke2RhdGV9VCR7dGltZX1gXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2YWx1ZSA9PiB7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRmxvYXRpbmdEYXRlVGltZSh2YWx1ZSlcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChpc05hTihkYXRlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgRGF0ZXRpbWUnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBkYXRlXG4gIH1cbn1cbiIsICIndXNlIHN0cmljdCdcbmNvbnN0IGYgPSByZXF1aXJlKCcuL2Zvcm1hdC1udW0uanMnKVxuY29uc3QgRGF0ZVRpbWUgPSBnbG9iYWwuRGF0ZVxuXG5jbGFzcyBEYXRlIGV4dGVuZHMgRGF0ZVRpbWUge1xuICBjb25zdHJ1Y3RvciAodmFsdWUpIHtcbiAgICBzdXBlcih2YWx1ZSlcbiAgICB0aGlzLmlzRGF0ZSA9IHRydWVcbiAgfVxuICB0b0lTT1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuZ2V0VVRDRnVsbFllYXIoKX0tJHtmKDIsIHRoaXMuZ2V0VVRDTW9udGgoKSArIDEpfS0ke2YoMiwgdGhpcy5nZXRVVENEYXRlKCkpfWBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlID0+IHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGlzTmFOKGRhdGUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBEYXRldGltZScpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRhdGVcbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuY29uc3QgZiA9IHJlcXVpcmUoJy4vZm9ybWF0LW51bS5qcycpXG5cbmNsYXNzIFRpbWUgZXh0ZW5kcyBEYXRlIHtcbiAgY29uc3RydWN0b3IgKHZhbHVlKSB7XG4gICAgc3VwZXIoYDAwMDAtMDEtMDFUJHt2YWx1ZX1aYClcbiAgICB0aGlzLmlzVGltZSA9IHRydWVcbiAgfVxuICB0b0lTT1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIGAke2YoMiwgdGhpcy5nZXRVVENIb3VycygpKX06JHtmKDIsIHRoaXMuZ2V0VVRDTWludXRlcygpKX06JHtmKDIsIHRoaXMuZ2V0VVRDU2Vjb25kcygpKX0uJHtmKDMsIHRoaXMuZ2V0VVRDTWlsbGlzZWNvbmRzKCkpfWBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlID0+IHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBUaW1lKHZhbHVlKVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGlzTmFOKGRhdGUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBEYXRldGltZScpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRhdGVcbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuLyogZXNsaW50LWRpc2FibGUgbm8tbmV3LXdyYXBwZXJzLCBuby1ldmFsLCBjYW1lbGNhc2UsIG9wZXJhdG9yLWxpbmVicmVhayAqL1xubW9kdWxlLmV4cG9ydHMgPSBtYWtlUGFyc2VyQ2xhc3MocmVxdWlyZSgnLi9wYXJzZXIuanMnKSlcbm1vZHVsZS5leHBvcnRzLm1ha2VQYXJzZXJDbGFzcyA9IG1ha2VQYXJzZXJDbGFzc1xuXG5jbGFzcyBUb21sRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yIChtc2cpIHtcbiAgICBzdXBlcihtc2cpXG4gICAgdGhpcy5uYW1lID0gJ1RvbWxFcnJvcidcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgVG9tbEVycm9yKVxuICAgIHRoaXMuZnJvbVRPTUwgPSB0cnVlXG4gICAgdGhpcy53cmFwcGVkID0gbnVsbFxuICB9XG59XG5Ub21sRXJyb3Iud3JhcCA9IGVyciA9PiB7XG4gIGNvbnN0IHRlcnIgPSBuZXcgVG9tbEVycm9yKGVyci5tZXNzYWdlKVxuICB0ZXJyLmNvZGUgPSBlcnIuY29kZVxuICB0ZXJyLndyYXBwZWQgPSBlcnJcbiAgcmV0dXJuIHRlcnJcbn1cbm1vZHVsZS5leHBvcnRzLlRvbWxFcnJvciA9IFRvbWxFcnJvclxuXG5jb25zdCBjcmVhdGVEYXRlVGltZSA9IHJlcXVpcmUoJy4vY3JlYXRlLWRhdGV0aW1lLmpzJylcbmNvbnN0IGNyZWF0ZURhdGVUaW1lRmxvYXQgPSByZXF1aXJlKCcuL2NyZWF0ZS1kYXRldGltZS1mbG9hdC5qcycpXG5jb25zdCBjcmVhdGVEYXRlID0gcmVxdWlyZSgnLi9jcmVhdGUtZGF0ZS5qcycpXG5jb25zdCBjcmVhdGVUaW1lID0gcmVxdWlyZSgnLi9jcmVhdGUtdGltZS5qcycpXG5cbmNvbnN0IENUUkxfSSA9IDB4MDlcbmNvbnN0IENUUkxfSiA9IDB4MEFcbmNvbnN0IENUUkxfTSA9IDB4MERcbmNvbnN0IENUUkxfQ0hBUl9CT1VOREFSWSA9IDB4MUYgLy8gdGhlIGxhc3Qgbm9uLWNoYXJhY3RlciBpbiB0aGUgbGF0aW4xIHJlZ2lvbiBvZiB1bmljb2RlLCBleGNlcHQgREVMXG5jb25zdCBDSEFSX1NQID0gMHgyMFxuY29uc3QgQ0hBUl9RVU9UID0gMHgyMlxuY29uc3QgQ0hBUl9OVU0gPSAweDIzXG5jb25zdCBDSEFSX0FQT1MgPSAweDI3XG5jb25zdCBDSEFSX1BMVVMgPSAweDJCXG5jb25zdCBDSEFSX0NPTU1BID0gMHgyQ1xuY29uc3QgQ0hBUl9IWVBIRU4gPSAweDJEXG5jb25zdCBDSEFSX1BFUklPRCA9IDB4MkVcbmNvbnN0IENIQVJfMCA9IDB4MzBcbmNvbnN0IENIQVJfMSA9IDB4MzFcbmNvbnN0IENIQVJfNyA9IDB4MzdcbmNvbnN0IENIQVJfOSA9IDB4MzlcbmNvbnN0IENIQVJfQ09MT04gPSAweDNBXG5jb25zdCBDSEFSX0VRVUFMUyA9IDB4M0RcbmNvbnN0IENIQVJfQSA9IDB4NDFcbmNvbnN0IENIQVJfRSA9IDB4NDVcbmNvbnN0IENIQVJfRiA9IDB4NDZcbmNvbnN0IENIQVJfVCA9IDB4NTRcbmNvbnN0IENIQVJfVSA9IDB4NTVcbmNvbnN0IENIQVJfWiA9IDB4NUFcbmNvbnN0IENIQVJfTE9XQkFSID0gMHg1RlxuY29uc3QgQ0hBUl9hID0gMHg2MVxuY29uc3QgQ0hBUl9iID0gMHg2MlxuY29uc3QgQ0hBUl9lID0gMHg2NVxuY29uc3QgQ0hBUl9mID0gMHg2NlxuY29uc3QgQ0hBUl9pID0gMHg2OVxuY29uc3QgQ0hBUl9sID0gMHg2Q1xuY29uc3QgQ0hBUl9uID0gMHg2RVxuY29uc3QgQ0hBUl9vID0gMHg2RlxuY29uc3QgQ0hBUl9yID0gMHg3MlxuY29uc3QgQ0hBUl9zID0gMHg3M1xuY29uc3QgQ0hBUl90ID0gMHg3NFxuY29uc3QgQ0hBUl91ID0gMHg3NVxuY29uc3QgQ0hBUl94ID0gMHg3OFxuY29uc3QgQ0hBUl96ID0gMHg3QVxuY29uc3QgQ0hBUl9MQ1VCID0gMHg3QlxuY29uc3QgQ0hBUl9SQ1VCID0gMHg3RFxuY29uc3QgQ0hBUl9MU1FCID0gMHg1QlxuY29uc3QgQ0hBUl9CU09MID0gMHg1Q1xuY29uc3QgQ0hBUl9SU1FCID0gMHg1RFxuY29uc3QgQ0hBUl9ERUwgPSAweDdGXG5jb25zdCBTVVJST0dBVEVfRklSU1QgPSAweEQ4MDBcbmNvbnN0IFNVUlJPR0FURV9MQVNUID0gMHhERkZGXG5cbmNvbnN0IGVzY2FwZXMgPSB7XG4gIFtDSEFSX2JdOiAnXFx1MDAwOCcsXG4gIFtDSEFSX3RdOiAnXFx1MDAwOScsXG4gIFtDSEFSX25dOiAnXFx1MDAwQScsXG4gIFtDSEFSX2ZdOiAnXFx1MDAwQycsXG4gIFtDSEFSX3JdOiAnXFx1MDAwRCcsXG4gIFtDSEFSX1FVT1RdOiAnXFx1MDAyMicsXG4gIFtDSEFSX0JTT0xdOiAnXFx1MDA1Qydcbn1cblxuZnVuY3Rpb24gaXNEaWdpdCAoY3ApIHtcbiAgcmV0dXJuIGNwID49IENIQVJfMCAmJiBjcCA8PSBDSEFSXzlcbn1cbmZ1bmN0aW9uIGlzSGV4aXQgKGNwKSB7XG4gIHJldHVybiAoY3AgPj0gQ0hBUl9BICYmIGNwIDw9IENIQVJfRikgfHwgKGNwID49IENIQVJfYSAmJiBjcCA8PSBDSEFSX2YpIHx8IChjcCA+PSBDSEFSXzAgJiYgY3AgPD0gQ0hBUl85KVxufVxuZnVuY3Rpb24gaXNCaXQgKGNwKSB7XG4gIHJldHVybiBjcCA9PT0gQ0hBUl8xIHx8IGNwID09PSBDSEFSXzBcbn1cbmZ1bmN0aW9uIGlzT2N0aXQgKGNwKSB7XG4gIHJldHVybiAoY3AgPj0gQ0hBUl8wICYmIGNwIDw9IENIQVJfNylcbn1cbmZ1bmN0aW9uIGlzQWxwaGFOdW1RdW90ZUh5cGhlbiAoY3ApIHtcbiAgcmV0dXJuIChjcCA+PSBDSEFSX0EgJiYgY3AgPD0gQ0hBUl9aKVxuICAgICAgfHwgKGNwID49IENIQVJfYSAmJiBjcCA8PSBDSEFSX3opXG4gICAgICB8fCAoY3AgPj0gQ0hBUl8wICYmIGNwIDw9IENIQVJfOSlcbiAgICAgIHx8IGNwID09PSBDSEFSX0FQT1NcbiAgICAgIHx8IGNwID09PSBDSEFSX1FVT1RcbiAgICAgIHx8IGNwID09PSBDSEFSX0xPV0JBUlxuICAgICAgfHwgY3AgPT09IENIQVJfSFlQSEVOXG59XG5mdW5jdGlvbiBpc0FscGhhTnVtSHlwaGVuIChjcCkge1xuICByZXR1cm4gKGNwID49IENIQVJfQSAmJiBjcCA8PSBDSEFSX1opXG4gICAgICB8fCAoY3AgPj0gQ0hBUl9hICYmIGNwIDw9IENIQVJfeilcbiAgICAgIHx8IChjcCA+PSBDSEFSXzAgJiYgY3AgPD0gQ0hBUl85KVxuICAgICAgfHwgY3AgPT09IENIQVJfTE9XQkFSXG4gICAgICB8fCBjcCA9PT0gQ0hBUl9IWVBIRU5cbn1cbmNvbnN0IF90eXBlID0gU3ltYm9sKCd0eXBlJylcbmNvbnN0IF9kZWNsYXJlZCA9IFN5bWJvbCgnZGVjbGFyZWQnKVxuXG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbmNvbnN0IGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XG5jb25zdCBkZXNjcmlwdG9yID0ge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWR9XG5cbmZ1bmN0aW9uIGhhc0tleSAob2JqLCBrZXkpIHtcbiAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXR1cm4gdHJ1ZVxuICBpZiAoa2V5ID09PSAnX19wcm90b19fJykgZGVmaW5lUHJvcGVydHkob2JqLCAnX19wcm90b19fJywgZGVzY3JpcHRvcilcbiAgcmV0dXJuIGZhbHNlXG59XG5cbmNvbnN0IElOTElORV9UQUJMRSA9IFN5bWJvbCgnaW5saW5lLXRhYmxlJylcbmZ1bmN0aW9uIElubGluZVRhYmxlICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHt9LCB7XG4gICAgW190eXBlXToge3ZhbHVlOiBJTkxJTkVfVEFCTEV9XG4gIH0pXG59XG5mdW5jdGlvbiBpc0lubGluZVRhYmxlIChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG9ialtfdHlwZV0gPT09IElOTElORV9UQUJMRVxufVxuXG5jb25zdCBUQUJMRSA9IFN5bWJvbCgndGFibGUnKVxuZnVuY3Rpb24gVGFibGUgKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoe30sIHtcbiAgICBbX3R5cGVdOiB7dmFsdWU6IFRBQkxFfSxcbiAgICBbX2RlY2xhcmVkXToge3ZhbHVlOiBmYWxzZSwgd3JpdGFibGU6IHRydWV9XG4gIH0pXG59XG5mdW5jdGlvbiBpc1RhYmxlIChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG9ialtfdHlwZV0gPT09IFRBQkxFXG59XG5cbmNvbnN0IF9jb250ZW50VHlwZSA9IFN5bWJvbCgnY29udGVudC10eXBlJylcbmNvbnN0IElOTElORV9MSVNUID0gU3ltYm9sKCdpbmxpbmUtbGlzdCcpXG5mdW5jdGlvbiBJbmxpbmVMaXN0ICh0eXBlKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhbXSwge1xuICAgIFtfdHlwZV06IHt2YWx1ZTogSU5MSU5FX0xJU1R9LFxuICAgIFtfY29udGVudFR5cGVdOiB7dmFsdWU6IHR5cGV9XG4gIH0pXG59XG5mdW5jdGlvbiBpc0lubGluZUxpc3QgKG9iaikge1xuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiAob2JqKSAhPT0gJ29iamVjdCcpIHJldHVybiBmYWxzZVxuICByZXR1cm4gb2JqW190eXBlXSA9PT0gSU5MSU5FX0xJU1Rcbn1cblxuY29uc3QgTElTVCA9IFN5bWJvbCgnbGlzdCcpXG5mdW5jdGlvbiBMaXN0ICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFtdLCB7XG4gICAgW190eXBlXToge3ZhbHVlOiBMSVNUfVxuICB9KVxufVxuZnVuY3Rpb24gaXNMaXN0IChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG9ialtfdHlwZV0gPT09IExJU1Rcbn1cblxuLy8gaW4gYW4gZXZhbCwgdG8gbGV0IGJ1bmRsZXJzIG5vdCBzbHVycCBpbiBhIHV0aWwgcHJveHlcbmxldCBfY3VzdG9tXG50cnkge1xuICBjb25zdCB1dGlsSW5zcGVjdCA9IGV2YWwoXCJyZXF1aXJlKCd1dGlsJykuaW5zcGVjdFwiKVxuICBfY3VzdG9tID0gdXRpbEluc3BlY3QuY3VzdG9tXG59IGNhdGNoIChfKSB7XG4gIC8qIGV2YWwgcmVxdWlyZSBub3QgYXZhaWxhYmxlIGluIHRyYW5zcGlsZWQgYnVuZGxlICovXG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuY29uc3QgX2luc3BlY3QgPSBfY3VzdG9tIHx8ICdpbnNwZWN0J1xuXG5jbGFzcyBCb3hlZEJpZ0ludCB7XG4gIGNvbnN0cnVjdG9yICh2YWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnZhbHVlID0gZ2xvYmFsLkJpZ0ludC5hc0ludE4oNjQsIHZhbHVlKVxuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICB0aGlzLnZhbHVlID0gbnVsbFxuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgX3R5cGUsIHt2YWx1ZTogSU5URUdFUn0pXG4gIH1cbiAgaXNOYU4gKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID09PSBudWxsXG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSlcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBbX2luc3BlY3RdICgpIHtcbiAgICByZXR1cm4gYFtCaWdJbnQ6ICR7dGhpcy50b1N0cmluZygpfV19YFxuICB9XG4gIHZhbHVlT2YgKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlXG4gIH1cbn1cblxuY29uc3QgSU5URUdFUiA9IFN5bWJvbCgnaW50ZWdlcicpXG5mdW5jdGlvbiBJbnRlZ2VyICh2YWx1ZSkge1xuICBsZXQgbnVtID0gTnVtYmVyKHZhbHVlKVxuICAvLyAtMCBpcyBhIGZsb2F0IHRoaW5nLCBub3QgYW4gaW50IHRoaW5nXG4gIGlmIChPYmplY3QuaXMobnVtLCAtMCkpIG51bSA9IDBcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKGdsb2JhbC5CaWdJbnQgJiYgIU51bWJlci5pc1NhZmVJbnRlZ2VyKG51bSkpIHtcbiAgICByZXR1cm4gbmV3IEJveGVkQmlnSW50KHZhbHVlKVxuICB9IGVsc2Uge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG5ldyBOdW1iZXIobnVtKSwge1xuICAgICAgaXNOYU46IHt2YWx1ZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gaXNOYU4odGhpcykgfX0sXG4gICAgICBbX3R5cGVdOiB7dmFsdWU6IElOVEVHRVJ9LFxuICAgICAgW19pbnNwZWN0XToge3ZhbHVlOiAoKSA9PiBgW0ludGVnZXI6ICR7dmFsdWV9XWB9XG4gICAgfSlcbiAgfVxufVxuZnVuY3Rpb24gaXNJbnRlZ2VyIChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG9ialtfdHlwZV0gPT09IElOVEVHRVJcbn1cblxuY29uc3QgRkxPQVQgPSBTeW1ib2woJ2Zsb2F0JylcbmZ1bmN0aW9uIEZsb2F0ICh2YWx1ZSkge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobmV3IE51bWJlcih2YWx1ZSksIHtcbiAgICBbX3R5cGVdOiB7dmFsdWU6IEZMT0FUfSxcbiAgICBbX2luc3BlY3RdOiB7dmFsdWU6ICgpID0+IGBbRmxvYXQ6ICR7dmFsdWV9XWB9XG4gIH0pXG59XG5mdW5jdGlvbiBpc0Zsb2F0IChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG9ialtfdHlwZV0gPT09IEZMT0FUXG59XG5cbmZ1bmN0aW9uIHRvbWxUeXBlICh2YWx1ZSkge1xuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlXG4gIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuICdudWxsJ1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHJldHVybiAnZGF0ZXRpbWUnXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoX3R5cGUgaW4gdmFsdWUpIHtcbiAgICAgIHN3aXRjaCAodmFsdWVbX3R5cGVdKSB7XG4gICAgICAgIGNhc2UgSU5MSU5FX1RBQkxFOiByZXR1cm4gJ2lubGluZS10YWJsZSdcbiAgICAgICAgY2FzZSBJTkxJTkVfTElTVDogcmV0dXJuICdpbmxpbmUtbGlzdCdcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgY2FzZSBUQUJMRTogcmV0dXJuICd0YWJsZSdcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgY2FzZSBMSVNUOiByZXR1cm4gJ2xpc3QnXG4gICAgICAgIGNhc2UgRkxPQVQ6IHJldHVybiAnZmxvYXQnXG4gICAgICAgIGNhc2UgSU5URUdFUjogcmV0dXJuICdpbnRlZ2VyJ1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHlwZVxufVxuXG5mdW5jdGlvbiBtYWtlUGFyc2VyQ2xhc3MgKFBhcnNlcikge1xuICBjbGFzcyBUT01MUGFyc2VyIGV4dGVuZHMgUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICBzdXBlcigpXG4gICAgICB0aGlzLmN0eCA9IHRoaXMub2JqID0gVGFibGUoKVxuICAgIH1cblxuICAgIC8qIE1BVENIIEhFTFBFUiAqL1xuICAgIGF0RW5kT2ZXb3JkICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXIgPT09IENIQVJfTlVNIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9JIHx8IHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmF0RW5kT2ZMaW5lKClcbiAgICB9XG4gICAgYXRFbmRPZkxpbmUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhciA9PT0gUGFyc2VyLkVORCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSiB8fCB0aGlzLmNoYXIgPT09IENUUkxfTVxuICAgIH1cblxuICAgIHBhcnNlU3RhcnQgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gUGFyc2VyLkVORCkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTFNRQikge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VUYWJsZU9yTGlzdClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX05VTSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VDb21tZW50KVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENUUkxfSiB8fCB0aGlzLmNoYXIgPT09IENIQVJfU1AgfHwgdGhpcy5jaGFyID09PSBDVFJMX0kgfHwgdGhpcy5jaGFyID09PSBDVFJMX00pIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH0gZWxzZSBpZiAoaXNBbHBoYU51bVF1b3RlSHlwaGVuKHRoaXMuY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlQXNzaWduU3RhdGVtZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKGBVbmtub3duIGNoYXJhY3RlciBcIiR7dGhpcy5jaGFyfVwiYCkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSEVMUEVSLCB0aGlzIHN0cmlwcyBhbnkgd2hpdGVzcGFjZSBhbmQgY29tbWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgbGluZVxuICAgIC8vIHRoZW4gUkVUVVJOUy4gTGFzdCBzdGF0ZSBpbiBhIHByb2R1Y3Rpb24uXG4gICAgcGFyc2VXaGl0ZXNwYWNlVG9FT0wgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSB8fCB0aGlzLmNoYXIgPT09IENUUkxfTSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTlVNKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUNvbW1lbnQpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gUGFyc2VyLkVORCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSikge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbmV4cGVjdGVkIGNoYXJhY3RlciwgZXhwZWN0ZWQgb25seSB3aGl0ZXNwYWNlIG9yIGNvbW1lbnRzIHRpbGwgZW5kIG9mIGxpbmUnKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBBU1NJR05NRU5UOiBrZXkgPSB2YWx1ZSAqL1xuICAgIHBhcnNlQXNzaWduU3RhdGVtZW50ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbGxOb3codGhpcy5wYXJzZUFzc2lnbiwgdGhpcy5yZWNvcmRBc3NpZ25TdGF0ZW1lbnQpXG4gICAgfVxuICAgIHJlY29yZEFzc2lnblN0YXRlbWVudCAoa3YpIHtcbiAgICAgIGxldCB0YXJnZXQgPSB0aGlzLmN0eFxuICAgICAgbGV0IGZpbmFsS2V5ID0ga3Yua2V5LnBvcCgpXG4gICAgICBmb3IgKGxldCBrdyBvZiBrdi5rZXkpIHtcbiAgICAgICAgaWYgKGhhc0tleSh0YXJnZXQsIGt3KSAmJiAoIWlzVGFibGUodGFyZ2V0W2t3XSkgfHwgdGFyZ2V0W2t3XVtfZGVjbGFyZWRdKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRba3ddID0gdGFyZ2V0W2t3XSB8fCBUYWJsZSgpXG4gICAgICB9XG4gICAgICBpZiAoaGFzS2V5KHRhcmdldCwgZmluYWxLZXkpKSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgIH1cbiAgICAgIC8vIHVuYm94IG91ciBudW1iZXJzXG4gICAgICBpZiAoaXNJbnRlZ2VyKGt2LnZhbHVlKSB8fCBpc0Zsb2F0KGt2LnZhbHVlKSkge1xuICAgICAgICB0YXJnZXRbZmluYWxLZXldID0ga3YudmFsdWUudmFsdWVPZigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRbZmluYWxLZXldID0ga3YudmFsdWVcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZVdoaXRlc3BhY2VUb0VPTClcbiAgICB9XG5cbiAgICAvKiBBU1NTSUdOTUVOVCBleHByZXNzaW9uLCBrZXkgPSB2YWx1ZSBwb3NzaWJseSBpbnNpZGUgYW4gaW5saW5lIHRhYmxlICovXG4gICAgcGFyc2VBc3NpZ24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlS2V5d29yZCwgdGhpcy5yZWNvcmRBc3NpZ25LZXl3b3JkKVxuICAgIH1cbiAgICByZWNvcmRBc3NpZ25LZXl3b3JkIChrZXkpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnJlc3VsdFRhYmxlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUucmVzdWx0VGFibGUucHVzaChrZXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlLnJlc3VsdFRhYmxlID0gW2tleV1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUFzc2lnbktleXdvcmRQcmVEb3QpXG4gICAgfVxuICAgIHBhcnNlQXNzaWduS2V5d29yZFByZURvdCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1BFUklPRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VBc3NpZ25LZXl3b3JkUG9zdERvdClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyICE9PSBDSEFSX1NQICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9JKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUFzc2lnbkVxdWFsKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUFzc2lnbktleXdvcmRQb3N0RG90ICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgIT09IENIQVJfU1AgJiYgdGhpcy5jaGFyICE9PSBDVFJMX0kpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlS2V5d29yZCwgdGhpcy5yZWNvcmRBc3NpZ25LZXl3b3JkKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlQXNzaWduRXF1YWwgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9FUVVBTFMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlQXNzaWduUHJlVmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyLCBleHBlY3RlZCBcIj1cIicpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUFzc2lnblByZVZhbHVlICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfU1AgfHwgdGhpcy5jaGFyID09PSBDVFJMX0kpIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGxOb3codGhpcy5wYXJzZVZhbHVlLCB0aGlzLnJlY29yZEFzc2lnblZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgICByZWNvcmRBc3NpZ25WYWx1ZSAodmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyh7a2V5OiB0aGlzLnN0YXRlLnJlc3VsdFRhYmxlLCB2YWx1ZTogdmFsdWV9KVxuICAgIH1cblxuICAgIC8qIENPTU1FTlRTOiAjLi4uZW9sICovXG4gICAgcGFyc2VDb21tZW50ICgpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHRoaXMuY2hhciA9PT0gUGFyc2VyLkVORCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJldHVybigpXG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRoaXMubmV4dENoYXIoKSlcbiAgICB9XG5cbiAgICAvKiBUQUJMRVMgQU5EIExJU1RTLCBbZm9vXSBhbmQgW1tmb29dXSAqL1xuICAgIHBhcnNlVGFibGVPckxpc3QgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9MU1FCKSB7XG4gICAgICAgIHRoaXMubmV4dCh0aGlzLnBhcnNlTGlzdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZVRhYmxlKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIFRBQkxFIFtmb28uYmFyLmJhel0gKi9cbiAgICBwYXJzZVRhYmxlICgpIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5vYmpcbiAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZVRhYmxlTmV4dClcbiAgICB9XG4gICAgcGFyc2VUYWJsZU5leHQgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlS2V5d29yZCwgdGhpcy5wYXJzZVRhYmxlTW9yZSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VUYWJsZU1vcmUgKGtleXdvcmQpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfU1AgfHwgdGhpcy5jaGFyID09PSBDVFJMX0kpIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1JTUUIpIHtcbiAgICAgICAgaWYgKGhhc0tleSh0aGlzLmN0eCwga2V5d29yZCkgJiYgKCFpc1RhYmxlKHRoaXMuY3R4W2tleXdvcmRdKSB8fCB0aGlzLmN0eFtrZXl3b3JkXVtfZGVjbGFyZWRdKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY3R4W2tleXdvcmRdID0gdGhpcy5jdHhba2V5d29yZF0gfHwgVGFibGUoKVxuICAgICAgICAgIHRoaXMuY3R4W19kZWNsYXJlZF0gPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlV2hpdGVzcGFjZVRvRU9MKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUEVSSU9EKSB7XG4gICAgICAgIGlmICghaGFzS2V5KHRoaXMuY3R4LCBrZXl3b3JkKSkge1xuICAgICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jdHhba2V5d29yZF0gPSBUYWJsZSgpXG4gICAgICAgIH0gZWxzZSBpZiAoaXNUYWJsZSh0aGlzLmN0eFtrZXl3b3JkXSkpIHtcbiAgICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY3R4W2tleXdvcmRdXG4gICAgICAgIH0gZWxzZSBpZiAoaXNMaXN0KHRoaXMuY3R4W2tleXdvcmRdKSkge1xuICAgICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jdHhba2V5d29yZF1bdGhpcy5jdHhba2V5d29yZF0ubGVuZ3RoIC0gMV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoXCJDYW4ndCByZWRlZmluZSBleGlzdGluZyBrZXlcIikpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlVGFibGVOZXh0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbmV4cGVjdGVkIGNoYXJhY3RlciwgZXhwZWN0ZWQgd2hpdGVzcGFjZSwgLiBvciBdJykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogTElTVCBbW2EuYi5jXV0gKi9cbiAgICBwYXJzZUxpc3QgKCkge1xuICAgICAgdGhpcy5jdHggPSB0aGlzLm9ialxuICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlTGlzdE5leHQpXG4gICAgfVxuICAgIHBhcnNlTGlzdE5leHQgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlS2V5d29yZCwgdGhpcy5wYXJzZUxpc3RNb3JlKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUxpc3RNb3JlIChrZXl3b3JkKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1NQIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9JKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9SU1FCKSB7XG4gICAgICAgIGlmICghaGFzS2V5KHRoaXMuY3R4LCBrZXl3b3JkKSkge1xuICAgICAgICAgIHRoaXMuY3R4W2tleXdvcmRdID0gTGlzdCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzSW5saW5lTGlzdCh0aGlzLmN0eFtrZXl3b3JkXSkpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoXCJDYW4ndCBleHRlbmQgYW4gaW5saW5lIGFycmF5XCIpKVxuICAgICAgICB9IGVsc2UgaWYgKGlzTGlzdCh0aGlzLmN0eFtrZXl3b3JkXSkpIHtcbiAgICAgICAgICBjb25zdCBuZXh0ID0gVGFibGUoKVxuICAgICAgICAgIHRoaXMuY3R4W2tleXdvcmRdLnB1c2gobmV4dClcbiAgICAgICAgICB0aGlzLmN0eCA9IG5leHRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoXCJDYW4ndCByZWRlZmluZSBhbiBleGlzdGluZyBrZXlcIikpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTGlzdEVuZClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1BFUklPRCkge1xuICAgICAgICBpZiAoIWhhc0tleSh0aGlzLmN0eCwga2V5d29yZCkpIHtcbiAgICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY3R4W2tleXdvcmRdID0gVGFibGUoKVxuICAgICAgICB9IGVsc2UgaWYgKGlzSW5saW5lTGlzdCh0aGlzLmN0eFtrZXl3b3JkXSkpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoXCJDYW4ndCBleHRlbmQgYW4gaW5saW5lIGFycmF5XCIpKVxuICAgICAgICB9IGVsc2UgaWYgKGlzSW5saW5lVGFibGUodGhpcy5jdHhba2V5d29yZF0pKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKFwiQ2FuJ3QgZXh0ZW5kIGFuIGlubGluZSB0YWJsZVwiKSlcbiAgICAgICAgfSBlbHNlIGlmIChpc0xpc3QodGhpcy5jdHhba2V5d29yZF0pKSB7XG4gICAgICAgICAgdGhpcy5jdHggPSB0aGlzLmN0eFtrZXl3b3JkXVt0aGlzLmN0eFtrZXl3b3JkXS5sZW5ndGggLSAxXVxuICAgICAgICB9IGVsc2UgaWYgKGlzVGFibGUodGhpcy5jdHhba2V5d29yZF0pKSB7XG4gICAgICAgICAgdGhpcy5jdHggPSB0aGlzLmN0eFtrZXl3b3JkXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGFuIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VMaXN0TmV4dClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIsIGV4cGVjdGVkIHdoaXRlc3BhY2UsIC4gb3IgXScpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUxpc3RFbmQgKGtleXdvcmQpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUlNRQikge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VXaGl0ZXNwYWNlVG9FT0wpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyLCBleHBlY3RlZCB3aGl0ZXNwYWNlLCAuIG9yIF0nKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBWQUxVRSBzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgaW5saW5lIGxpc3QsIGlubGluZSBvYmplY3QgKi9cbiAgICBwYXJzZVZhbHVlICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IFBhcnNlci5FTkQpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdLZXkgd2l0aG91dCB2YWx1ZScpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUVVPVCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VEb3VibGVTdHJpbmcpXG4gICAgICB9IGlmICh0aGlzLmNoYXIgPT09IENIQVJfQVBPUykge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VTaW5nbGVTdHJpbmcpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9IWVBIRU4gfHwgdGhpcy5jaGFyID09PSBDSEFSX1BMVVMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlTnVtYmVyU2lnbilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX2kpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlSW5mKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfbikge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VOYW4pXG4gICAgICB9IGVsc2UgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VOdW1iZXJPckRhdGVUaW1lKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfdCB8fCB0aGlzLmNoYXIgPT09IENIQVJfZikge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VCb29sZWFuKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTFNRQikge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VJbmxpbmVMaXN0LCB0aGlzLnJlY29yZFZhbHVlKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTENVQikge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VJbmxpbmVUYWJsZSwgdGhpcy5yZWNvcmRWYWx1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIsIGV4cGVjdGluZyBzdHJpbmcsIG51bWJlciwgZGF0ZXRpbWUsIGJvb2xlYW4sIGlubGluZSBhcnJheSBvciBpbmxpbmUgdGFibGUnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmVjb3JkVmFsdWUgKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3codmFsdWUpXG4gICAgfVxuXG4gICAgcGFyc2VJbmYgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZUluZjIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyLCBleHBlY3RlZCBcImluZlwiLCBcIitpbmZcIiBvciBcIi1pbmZcIicpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUluZjIgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9mKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJ1ZiA9PT0gJy0nKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKC1JbmZpbml0eSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oSW5maW5pdHkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIsIGV4cGVjdGVkIFwiaW5mXCIsIFwiK2luZlwiIG9yIFwiLWluZlwiJykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VOYW4gKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9hKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU5hbjIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyLCBleHBlY3RlZCBcIm5hblwiJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTmFuMiAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKE5hTilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIsIGV4cGVjdGVkIFwibmFuXCInKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBLRVlTLCBiYXJld29yZHMgb3IgYmFzaWMsIGxpdGVyYWwsIG9yIGRvdHRlZCAqL1xuICAgIHBhcnNlS2V5d29yZCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1FVT1QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlQmFzaWNTdHJpbmcpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9BUE9TKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZUxpdGVyYWxTdHJpbmcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VCYXJlS2V5KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIEtFWVM6IGJhcmV3b3JkcyAqL1xuICAgIHBhcnNlQmFyZUtleSAoKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmICh0aGlzLmNoYXIgPT09IFBhcnNlci5FTkQpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0tleSBlbmRlZCB3aXRob3V0IHZhbHVlJykpXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBbHBoYU51bUh5cGhlbih0aGlzLmNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0VtcHR5IGJhcmUga2V5cyBhcmUgbm90IGFsbG93ZWQnKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3coKVxuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0aGlzLm5leHRDaGFyKCkpXG4gICAgfVxuXG4gICAgLyogU1RSSU5HUywgc2luZ2xlIHF1b3RlZCAobGl0ZXJhbCkgKi9cbiAgICBwYXJzZVNpbmdsZVN0cmluZyAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0FQT1MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTGl0ZXJhbE11bHRpU3RyaW5nTWF5YmUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VMaXRlcmFsU3RyaW5nKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUxpdGVyYWxTdHJpbmcgKCkge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0FQT1MpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYXRFbmRPZkxpbmUoKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW50ZXJtaW5hdGVkIHN0cmluZycpKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9ERUwgfHwgKHRoaXMuY2hhciA8PSBDVFJMX0NIQVJfQk9VTkRBUlkgJiYgdGhpcy5jaGFyICE9PSBDVFJMX0kpKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvckNvbnRyb2xDaGFySW5TdHJpbmcoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRoaXMubmV4dENoYXIoKSlcbiAgICB9XG4gICAgcGFyc2VMaXRlcmFsTXVsdGlTdHJpbmdNYXliZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0FQT1MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTGl0ZXJhbE11bHRpU3RyaW5nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KClcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VMaXRlcmFsTXVsdGlTdHJpbmcgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9NKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9KKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZUxpdGVyYWxNdWx0aVN0cmluZ0NvbnRlbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VMaXRlcmFsTXVsdGlTdHJpbmdDb250ZW50KVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUxpdGVyYWxNdWx0aVN0cmluZ0NvbnRlbnQgKCkge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0FQT1MpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VMaXRlcmFsTXVsdGlFbmQpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBQYXJzZXIuRU5EKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbnRlcm1pbmF0ZWQgbXVsdGktbGluZSBzdHJpbmcnKSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfREVMIHx8ICh0aGlzLmNoYXIgPD0gQ1RSTF9DSEFSX0JPVU5EQVJZICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9JICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9KICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9NKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3JDb250cm9sQ2hhckluU3RyaW5nKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0aGlzLm5leHRDaGFyKCkpXG4gICAgfVxuICAgIHBhcnNlTGl0ZXJhbE11bHRpRW5kICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQVBPUykge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VMaXRlcmFsTXVsdGlFbmQyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgKz0gXCInXCJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlTGl0ZXJhbE11bHRpU3RyaW5nQ29udGVudClcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VMaXRlcmFsTXVsdGlFbmQyICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQVBPUykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgKz0gXCInJ1wiXG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUxpdGVyYWxNdWx0aVN0cmluZ0NvbnRlbnQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogU1RSSU5HUyBkb3VibGUgcXVvdGVkICovXG4gICAgcGFyc2VEb3VibGVTdHJpbmcgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9RVU9UKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU11bHRpU3RyaW5nTWF5YmUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VCYXNpY1N0cmluZylcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VCYXNpY1N0cmluZyAoKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQlNPTCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZUVzY2FwZSwgdGhpcy5yZWNvcmRFc2NhcGVSZXBsYWNlbWVudClcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUVVPVCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJldHVybigpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hdEVuZE9mTGluZSgpKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbnRlcm1pbmF0ZWQgc3RyaW5nJykpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0RFTCB8fCAodGhpcy5jaGFyIDw9IENUUkxfQ0hBUl9CT1VOREFSWSAmJiB0aGlzLmNoYXIgIT09IENUUkxfSSkpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yQ29udHJvbENoYXJJblN0cmluZygpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAodGhpcy5uZXh0Q2hhcigpKVxuICAgIH1cbiAgICByZWNvcmRFc2NhcGVSZXBsYWNlbWVudCAocmVwbGFjZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdGUuYnVmICs9IHJlcGxhY2VtZW50XG4gICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VCYXNpY1N0cmluZylcbiAgICB9XG4gICAgcGFyc2VNdWx0aVN0cmluZ01heWJlICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUVVPVCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VNdWx0aVN0cmluZylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdygpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTXVsdGlTdHJpbmcgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9NKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9KKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU11bHRpU3RyaW5nQ29udGVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZU11bHRpU3RyaW5nQ29udGVudClcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VNdWx0aVN0cmluZ0NvbnRlbnQgKCkge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0JTT0wpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VNdWx0aUVzY2FwZSwgdGhpcy5yZWNvcmRNdWx0aUVzY2FwZVJlcGxhY2VtZW50KVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9RVU9UKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTXVsdGlFbmQpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBQYXJzZXIuRU5EKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbnRlcm1pbmF0ZWQgbXVsdGktbGluZSBzdHJpbmcnKSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfREVMIHx8ICh0aGlzLmNoYXIgPD0gQ1RSTF9DSEFSX0JPVU5EQVJZICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9JICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9KICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9NKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3JDb250cm9sQ2hhckluU3RyaW5nKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0aGlzLm5leHRDaGFyKCkpXG4gICAgfVxuICAgIGVycm9yQ29udHJvbENoYXJJblN0cmluZyAoKSB7XG4gICAgICBsZXQgZGlzcGxheUNvZGUgPSAnXFxcXHUwMCdcbiAgICAgIGlmICh0aGlzLmNoYXIgPCAxNikge1xuICAgICAgICBkaXNwbGF5Q29kZSArPSAnMCdcbiAgICAgIH1cbiAgICAgIGRpc3BsYXlDb2RlICs9IHRoaXMuY2hhci50b1N0cmluZygxNilcblxuICAgICAgcmV0dXJuIHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihgQ29udHJvbCBjaGFyYWN0ZXJzIChjb2RlcyA8IDB4MWYgYW5kIDB4N2YpIGFyZSBub3QgYWxsb3dlZCBpbiBzdHJpbmdzLCB1c2UgJHtkaXNwbGF5Q29kZX0gaW5zdGVhZGApKVxuICAgIH1cbiAgICByZWNvcmRNdWx0aUVzY2FwZVJlcGxhY2VtZW50IChyZXBsYWNlbWVudCkge1xuICAgICAgdGhpcy5zdGF0ZS5idWYgKz0gcmVwbGFjZW1lbnRcbiAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZU11bHRpU3RyaW5nQ29udGVudClcbiAgICB9XG4gICAgcGFyc2VNdWx0aUVuZCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1FVT1QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTXVsdGlFbmQyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgKz0gJ1wiJ1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VNdWx0aVN0cmluZ0NvbnRlbnQpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTXVsdGlFbmQyICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUVVPVCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgKz0gJ1wiXCInXG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZU11bHRpU3RyaW5nQ29udGVudClcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VNdWx0aUVzY2FwZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDVFJMX00gfHwgdGhpcy5jaGFyID09PSBDVFJMX0opIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTXVsdGlUcmltKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfU1AgfHwgdGhpcy5jaGFyID09PSBDVFJMX0kpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlUHJlTXVsdGlUcmltKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlRXNjYXBlKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVByZU11bHRpVHJpbSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1NQIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9JKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9NIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9KKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU11bHRpVHJpbSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IGVzY2FwZSB3aGl0ZXNwYWNlXCIpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZU11bHRpVHJpbSAoKSB7XG4gICAgICAvLyBleHBsaWNpdGx5IHdoaXRlc3BhY2UgaGVyZSwgRU5EIHNob3VsZCBmb2xsb3cgdGhlIHNhbWUgcGF0aCBhcyBjaGFyc1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9KIHx8IHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSB8fCB0aGlzLmNoYXIgPT09IENUUkxfTSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KClcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VFc2NhcGUgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciBpbiBlc2NhcGVzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybihlc2NhcGVzW3RoaXMuY2hhcl0pXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl91KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZVNtYWxsVW5pY29kZSwgdGhpcy5wYXJzZVVuaWNvZGVSZXR1cm4pXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9VKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZUxhcmdlVW5pY29kZSwgdGhpcy5wYXJzZVVuaWNvZGVSZXR1cm4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1Vua25vd24gZXNjYXBlIGNoYXJhY3RlcjogJyArIHRoaXMuY2hhcikpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlVW5pY29kZVJldHVybiAoY2hhcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY29kZVBvaW50ID0gcGFyc2VJbnQoY2hhciwgMTYpXG4gICAgICAgIGlmIChjb2RlUG9pbnQgPj0gU1VSUk9HQVRFX0ZJUlNUICYmIGNvZGVQb2ludCA8PSBTVVJST0dBVEVfTEFTVCkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW52YWxpZCB1bmljb2RlLCBjaGFyYWN0ZXIgaW4gcmFuZ2UgMHhEODAwIC0gMHhERkZGIGlzIHJlc2VydmVkJykpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KFN0cmluZy5mcm9tQ29kZVBvaW50KGNvZGVQb2ludCkpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihUb21sRXJyb3Iud3JhcChlcnIpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVNtYWxsVW5pY29kZSAoKSB7XG4gICAgICBpZiAoIWlzSGV4aXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIHVuaWNvZGUgc2VxdWVuY2UsIGV4cGVjdGVkIGhleCcpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA+PSA0KSByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUxhcmdlVW5pY29kZSAoKSB7XG4gICAgICBpZiAoIWlzSGV4aXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIHVuaWNvZGUgc2VxdWVuY2UsIGV4cGVjdGVkIGhleCcpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA+PSA4KSByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIE5VTUJFUlMgKi9cbiAgICBwYXJzZU51bWJlclNpZ24gKCkge1xuICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU1heWJlU2lnbmVkSW5mT3JOYW4pXG4gICAgfVxuICAgIHBhcnNlTWF5YmVTaWduZWRJbmZPck5hbiAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX2kpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlSW5mKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfbikge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VOYW4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsTm93KHRoaXMucGFyc2VOb1VuZGVyLCB0aGlzLnBhcnNlTnVtYmVySW50ZWdlclN0YXJ0KVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZU51bWJlckludGVnZXJTdGFydCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSXzApIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTnVtYmVySW50ZWdlckV4cG9uZW50T3JEZWNpbWFsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlTnVtYmVySW50ZWdlcilcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VOdW1iZXJJbnRlZ2VyRXhwb25lbnRPckRlY2ltYWwgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9QRVJJT0QpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlTm9VbmRlciwgdGhpcy5wYXJzZU51bWJlckZsb2F0KVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfRSB8fCB0aGlzLmNoYXIgPT09IENIQVJfZSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VOdW1iZXJFeHBvbmVudFNpZ24pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3coSW50ZWdlcih0aGlzLnN0YXRlLmJ1ZikpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTnVtYmVySW50ZWdlciAoKSB7XG4gICAgICBpZiAoaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9MT1dCQVIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlTm9VbmRlcilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0UgfHwgdGhpcy5jaGFyID09PSBDSEFSX2UpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTnVtYmVyRXhwb25lbnRTaWduKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUEVSSU9EKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXIsIHRoaXMucGFyc2VOdW1iZXJGbG9hdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IEludGVnZXIodGhpcy5zdGF0ZS5idWYpXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAocmVzdWx0LmlzTmFOKCkpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgbnVtYmVyJykpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KHJlc3VsdClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZU5vVW5kZXIgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9MT1dCQVIgfHwgdGhpcy5jaGFyID09PSBDSEFSX1BFUklPRCB8fCB0aGlzLmNoYXIgPT09IENIQVJfRSB8fCB0aGlzLmNoYXIgPT09IENIQVJfZSkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyLCBleHBlY3RlZCBkaWdpdCcpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmF0RW5kT2ZXb3JkKCkpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbmNvbXBsZXRlIG51bWJlcicpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KClcbiAgICB9XG4gICAgcGFyc2VOb1VuZGVySGV4T2N0QmluTGl0ZXJhbCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0xPV0JBUiB8fCB0aGlzLmNoYXIgPT09IENIQVJfUEVSSU9EKSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIsIGV4cGVjdGVkIGRpZ2l0JykpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXRFbmRPZldvcmQoKSkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0luY29tcGxldGUgbnVtYmVyJykpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3coKVxuICAgIH1cbiAgICBwYXJzZU51bWJlckZsb2F0ICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTE9XQkFSKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXIsIHRoaXMucGFyc2VOdW1iZXJGbG9hdClcbiAgICAgIH0gZWxzZSBpZiAoaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9FIHx8IHRoaXMuY2hhciA9PT0gQ0hBUl9lKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU51bWJlckV4cG9uZW50U2lnbilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhGbG9hdCh0aGlzLnN0YXRlLmJ1ZikpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTnVtYmVyRXhwb25lbnRTaWduICgpIHtcbiAgICAgIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlTnVtYmVyRXhwb25lbnQpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9IWVBIRU4gfHwgdGhpcy5jaGFyID09PSBDSEFSX1BMVVMpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgdGhpcy5jYWxsKHRoaXMucGFyc2VOb1VuZGVyLCB0aGlzLnBhcnNlTnVtYmVyRXhwb25lbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyLCBleHBlY3RlZCAtLCArIG9yIGRpZ2l0JykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTnVtYmVyRXhwb25lbnQgKCkge1xuICAgICAgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTE9XQkFSKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3coRmxvYXQodGhpcy5zdGF0ZS5idWYpKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIE5VTUJFUlMgb3IgREFURVRJTUVTICAqL1xuICAgIHBhcnNlTnVtYmVyT3JEYXRlVGltZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSXzApIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTnVtYmVyQmFzZU9yRGF0ZVRpbWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VOdW1iZXJPckRhdGVUaW1lT25seSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VOdW1iZXJPckRhdGVUaW1lT25seSAoKSB7XG4gICAgICAvLyBub3RlLCBpZiB0d28gemVyb3MgYXJlIGluIGEgcm93IHRoZW4gaXQgTVVTVCBiZSBhIGRhdGVcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTE9XQkFSKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXIsIHRoaXMucGFyc2VOdW1iZXJJbnRlZ2VyKVxuICAgICAgfSBlbHNlIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA+IDQpIHRoaXMubmV4dCh0aGlzLnBhcnNlTnVtYmVySW50ZWdlcilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0UgfHwgdGhpcy5jaGFyID09PSBDSEFSX2UpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTnVtYmVyRXhwb25lbnRTaWduKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUEVSSU9EKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXIsIHRoaXMucGFyc2VOdW1iZXJGbG9hdClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0hZUEhFTikge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VEYXRlVGltZSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0NPTE9OKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZU9ubHlUaW1lSG91cilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhJbnRlZ2VyKHRoaXMuc3RhdGUuYnVmKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VEYXRlVGltZU9ubHkgKCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWUoKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9DT0xPTikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZU9ubHlUaW1lSG91cilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0V4cGVjdGVkIGRpZ2l0IHdoaWxlIHBhcnNpbmcgeWVhciBwYXJ0IG9mIGEgZGF0ZScpKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0hZUEhFTikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZURhdGVUaW1lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignRXhwZWN0ZWQgaHlwaGVuICgtKSB3aGlsZSBwYXJzaW5nIHllYXIgcGFydCBvZiBkYXRlJykpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VOdW1iZXJCYXNlT3JEYXRlVGltZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX2IpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlTm9VbmRlckhleE9jdEJpbkxpdGVyYWwsIHRoaXMucGFyc2VJbnRlZ2VyQmluKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfbykge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VOb1VuZGVySGV4T2N0QmluTGl0ZXJhbCwgdGhpcy5wYXJzZUludGVnZXJPY3QpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl94KSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXJIZXhPY3RCaW5MaXRlcmFsLCB0aGlzLnBhcnNlSW50ZWdlckhleClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1BFUklPRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VOdW1iZXJJbnRlZ2VyKVxuICAgICAgfSBlbHNlIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlRGF0ZVRpbWVPbmx5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KEludGVnZXIodGhpcy5zdGF0ZS5idWYpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUludGVnZXJIZXggKCkge1xuICAgICAgaWYgKGlzSGV4aXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTE9XQkFSKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXJIZXhPY3RCaW5MaXRlcmFsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gSW50ZWdlcih0aGlzLnN0YXRlLmJ1ZilcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChyZXN1bHQuaXNOYU4oKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW52YWxpZCBudW1iZXInKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3cocmVzdWx0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlSW50ZWdlck9jdCAoKSB7XG4gICAgICBpZiAoaXNPY3RpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9MT1dCQVIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlTm9VbmRlckhleE9jdEJpbkxpdGVyYWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBJbnRlZ2VyKHRoaXMuc3RhdGUuYnVmKVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKHJlc3VsdC5pc05hTigpKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbnZhbGlkIG51bWJlcicpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhyZXN1bHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VJbnRlZ2VyQmluICgpIHtcbiAgICAgIGlmIChpc0JpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9MT1dCQVIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlTm9VbmRlckhleE9jdEJpbkxpdGVyYWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBJbnRlZ2VyKHRoaXMuc3RhdGUuYnVmKVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKHJlc3VsdC5pc05hTigpKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbnZhbGlkIG51bWJlcicpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhyZXN1bHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBEQVRFVElNRSAqL1xuICAgIHBhcnNlRGF0ZVRpbWUgKCkge1xuICAgICAgLy8gd2UgZW50ZXIgaGVyZSBoYXZpbmcganVzdCBjb25zdW1lZCB0aGUgeWVhciBhbmQgYWJvdXQgdG8gY29uc3VtZSB0aGUgaHlwaGVuXG4gICAgICBpZiAodGhpcy5zdGF0ZS5idWYubGVuZ3RoIDwgNCkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1llYXJzIGxlc3MgdGhhbiAxMDAwIG11c3QgYmUgemVybyBwYWRkZWQgdG8gZm91ciBjaGFyYWN0ZXJzJykpXG4gICAgICB9XG4gICAgICB0aGlzLnN0YXRlLnJlc3VsdCA9IHRoaXMuc3RhdGUuYnVmXG4gICAgICB0aGlzLnN0YXRlLmJ1ZiA9ICcnXG4gICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VEYXRlTW9udGgpXG4gICAgfVxuICAgIHBhcnNlRGF0ZU1vbnRoICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfSFlQSEVOKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJ1Zi5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdNb250aHMgbGVzcyB0aGFuIDEwIG11c3QgYmUgemVybyBwYWRkZWQgdG8gdHdvIGNoYXJhY3RlcnMnKSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRlLnJlc3VsdCArPSAnLScgKyB0aGlzLnN0YXRlLmJ1ZlxuICAgICAgICB0aGlzLnN0YXRlLmJ1ZiA9ICcnXG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZURhdGVEYXkpXG4gICAgICB9IGVsc2UgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbmNvbXBsZXRlIGRhdGV0aW1lJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlRGF0ZURheSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1QgfHwgdGhpcy5jaGFyID09PSBDSEFSX1NQKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJ1Zi5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdEYXlzIGxlc3MgdGhhbiAxMCBtdXN0IGJlIHplcm8gcGFkZGVkIHRvIHR3byBjaGFyYWN0ZXJzJykpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHQgKz0gJy0nICsgdGhpcy5zdGF0ZS5idWZcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VTdGFydFRpbWVIb3VyKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmF0RW5kT2ZXb3JkKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KGNyZWF0ZURhdGUodGhpcy5zdGF0ZS5yZXN1bHQgKyAnLScgKyB0aGlzLnN0YXRlLmJ1ZikpXG4gICAgICB9IGVsc2UgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbmNvbXBsZXRlIGRhdGV0aW1lJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlU3RhcnRUaW1lSG91ciAoKSB7XG4gICAgICBpZiAodGhpcy5hdEVuZE9mV29yZCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhjcmVhdGVEYXRlKHRoaXMuc3RhdGUucmVzdWx0KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZVRpbWVIb3VyKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVRpbWVIb3VyICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQ09MT04pIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0hvdXJzIGxlc3MgdGhhbiAxMCBtdXN0IGJlIHplcm8gcGFkZGVkIHRvIHR3byBjaGFyYWN0ZXJzJykpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHQgKz0gJ1QnICsgdGhpcy5zdGF0ZS5idWZcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VUaW1lTWluKVxuICAgICAgfSBlbHNlIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW5jb21wbGV0ZSBkYXRldGltZScpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVRpbWVNaW4gKCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA8IDIgJiYgaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA9PT0gMiAmJiB0aGlzLmNoYXIgPT09IENIQVJfQ09MT04pIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHQgKz0gJzonICsgdGhpcy5zdGF0ZS5idWZcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VUaW1lU2VjKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbmNvbXBsZXRlIGRhdGV0aW1lJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlVGltZVNlYyAoKSB7XG4gICAgICBpZiAoaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJ1Zi5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLnJlc3VsdCArPSAnOicgKyB0aGlzLnN0YXRlLmJ1ZlxuICAgICAgICAgIHRoaXMuc3RhdGUuYnVmID0gJydcbiAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VUaW1lWm9uZU9yRnJhY3Rpb24pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW5jb21wbGV0ZSBkYXRldGltZScpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlT25seVRpbWVIb3VyICgpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0NPTE9OKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJ1Zi5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdIb3VycyBsZXNzIHRoYW4gMTAgbXVzdCBiZSB6ZXJvIHBhZGRlZCB0byB0d28gY2hhcmFjdGVycycpKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUucmVzdWx0ID0gdGhpcy5zdGF0ZS5idWZcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VPbmx5VGltZU1pbilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW5jb21wbGV0ZSB0aW1lJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlT25seVRpbWVNaW4gKCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA8IDIgJiYgaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA9PT0gMiAmJiB0aGlzLmNoYXIgPT09IENIQVJfQ09MT04pIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHQgKz0gJzonICsgdGhpcy5zdGF0ZS5idWZcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VPbmx5VGltZVNlYylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW5jb21wbGV0ZSB0aW1lJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlT25seVRpbWVTZWMgKCkge1xuICAgICAgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5idWYubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlT25seVRpbWVGcmFjdGlvbk1heWJlKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0luY29tcGxldGUgdGltZScpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZU9ubHlUaW1lRnJhY3Rpb25NYXliZSAoKSB7XG4gICAgICB0aGlzLnN0YXRlLnJlc3VsdCArPSAnOicgKyB0aGlzLnN0YXRlLmJ1ZlxuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9QRVJJT0QpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICB0aGlzLm5leHQodGhpcy5wYXJzZU9ubHlUaW1lRnJhY3Rpb24pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oY3JlYXRlVGltZSh0aGlzLnN0YXRlLnJlc3VsdCkpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlT25seVRpbWVGcmFjdGlvbiAoKSB7XG4gICAgICBpZiAoaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXRFbmRPZldvcmQoKSkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5idWYubGVuZ3RoID09PSAwKSB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0V4cGVjdGVkIGRpZ2l0IGluIG1pbGxpc2Vjb25kcycpKVxuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3coY3JlYXRlVGltZSh0aGlzLnN0YXRlLnJlc3VsdCArICcuJyArIHRoaXMuc3RhdGUuYnVmKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIgaW4gZGF0ZXRpbWUsIGV4cGVjdGVkIHBlcmlvZCAoLiksIG1pbnVzICgtKSwgcGx1cyAoKykgb3IgWicpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlVGltZVpvbmVPckZyYWN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUEVSSU9EKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHRoaXMubmV4dCh0aGlzLnBhcnNlRGF0ZVRpbWVGcmFjdGlvbilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0hZUEhFTiB8fCB0aGlzLmNoYXIgPT09IENIQVJfUExVUykge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICB0aGlzLm5leHQodGhpcy5wYXJzZVRpbWVab25lSG91cilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1opIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKGNyZWF0ZURhdGVUaW1lKHRoaXMuc3RhdGUucmVzdWx0ICsgdGhpcy5zdGF0ZS5idWYpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmF0RW5kT2ZXb3JkKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KGNyZWF0ZURhdGVUaW1lRmxvYXQodGhpcy5zdGF0ZS5yZXN1bHQgKyB0aGlzLnN0YXRlLmJ1ZikpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyIGluIGRhdGV0aW1lLCBleHBlY3RlZCBwZXJpb2QgKC4pLCBtaW51cyAoLSksIHBsdXMgKCspIG9yIFonKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VEYXRlVGltZUZyYWN0aW9uICgpIHtcbiAgICAgIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5idWYubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignRXhwZWN0ZWQgZGlnaXQgaW4gbWlsbGlzZWNvbmRzJykpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9IWVBIRU4gfHwgdGhpcy5jaGFyID09PSBDSEFSX1BMVVMpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgdGhpcy5uZXh0KHRoaXMucGFyc2VUaW1lWm9uZUhvdXIpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9aKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybihjcmVhdGVEYXRlVGltZSh0aGlzLnN0YXRlLnJlc3VsdCArIHRoaXMuc3RhdGUuYnVmKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hdEVuZE9mV29yZCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhjcmVhdGVEYXRlVGltZUZsb2F0KHRoaXMuc3RhdGUucmVzdWx0ICsgdGhpcy5zdGF0ZS5idWYpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbmV4cGVjdGVkIGNoYXJhY3RlciBpbiBkYXRldGltZSwgZXhwZWN0ZWQgcGVyaW9kICguKSwgbWludXMgKC0pLCBwbHVzICgrKSBvciBaJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlVGltZVpvbmVIb3VyICgpIHtcbiAgICAgIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgLy8gRklYTUU6IE5vIG1vcmUgcmVnZXhwc1xuICAgICAgICBpZiAoL1xcZFxcZCQvLnRlc3QodGhpcy5zdGF0ZS5idWYpKSByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VUaW1lWm9uZVNlcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIgaW4gZGF0ZXRpbWUsIGV4cGVjdGVkIGRpZ2l0JykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlVGltZVpvbmVTZXAgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9DT0xPTikge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICB0aGlzLm5leHQodGhpcy5wYXJzZVRpbWVab25lTWluKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbmV4cGVjdGVkIGNoYXJhY3RlciBpbiBkYXRldGltZSwgZXhwZWN0ZWQgY29sb24nKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VUaW1lWm9uZU1pbiAoKSB7XG4gICAgICBpZiAoaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIGlmICgvXFxkXFxkJC8udGVzdCh0aGlzLnN0YXRlLmJ1ZikpIHJldHVybiB0aGlzLnJldHVybihjcmVhdGVEYXRlVGltZSh0aGlzLnN0YXRlLnJlc3VsdCArIHRoaXMuc3RhdGUuYnVmKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIgaW4gZGF0ZXRpbWUsIGV4cGVjdGVkIGRpZ2l0JykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogQk9PTEVBTiAqL1xuICAgIHBhcnNlQm9vbGVhbiAoKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl90KSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZVRydWVfcilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX2YpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlRmFsc2VfYSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VUcnVlX3IgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9yKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZVRydWVfdSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW52YWxpZCBib29sZWFuLCBleHBlY3RlZCB0cnVlIG9yIGZhbHNlJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlVHJ1ZV91ICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfdSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VUcnVlX2UpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgYm9vbGVhbiwgZXhwZWN0ZWQgdHJ1ZSBvciBmYWxzZScpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVRydWVfZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKHRydWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgYm9vbGVhbiwgZXhwZWN0ZWQgdHJ1ZSBvciBmYWxzZScpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlRmFsc2VfYSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX2EpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlRmFsc2VfbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW52YWxpZCBib29sZWFuLCBleHBlY3RlZCB0cnVlIG9yIGZhbHNlJykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VGYWxzZV9sICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfbCkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VGYWxzZV9zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbnZhbGlkIGJvb2xlYW4sIGV4cGVjdGVkIHRydWUgb3IgZmFsc2UnKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZUZhbHNlX3MgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9zKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZUZhbHNlX2UpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgYm9vbGVhbiwgZXhwZWN0ZWQgdHJ1ZSBvciBmYWxzZScpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlRmFsc2VfZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKGZhbHNlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbnZhbGlkIGJvb2xlYW4sIGV4cGVjdGVkIHRydWUgb3IgZmFsc2UnKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBJTkxJTkUgTElTVFMgKi9cbiAgICBwYXJzZUlubGluZUxpc3QgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSB8fCB0aGlzLmNoYXIgPT09IENUUkxfTSB8fCB0aGlzLmNoYXIgPT09IENUUkxfSikge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IFBhcnNlci5FTkQpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbnRlcm1pbmF0ZWQgaW5saW5lIGFycmF5JykpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9OVU0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlQ29tbWVudClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1JTUUIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKHRoaXMuc3RhdGUucmVzdWx0QXJyIHx8IElubGluZUxpc3QoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGxOb3codGhpcy5wYXJzZVZhbHVlLCB0aGlzLnJlY29yZElubGluZUxpc3RWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmVjb3JkSW5saW5lTGlzdFZhbHVlICh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUucmVzdWx0QXJyKSB7XG4gICAgICAgIGNvbnN0IGxpc3RUeXBlID0gdGhpcy5zdGF0ZS5yZXN1bHRBcnJbX2NvbnRlbnRUeXBlXVxuICAgICAgICBjb25zdCB2YWx1ZVR5cGUgPSB0b21sVHlwZSh2YWx1ZSlcbiAgICAgICAgaWYgKGxpc3RUeXBlICE9PSB2YWx1ZVR5cGUpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoYElubGluZSBsaXN0cyBtdXN0IGJlIGEgc2luZ2xlIHR5cGUsIG5vdCBhIG1peCBvZiAke2xpc3RUeXBlfSBhbmQgJHt2YWx1ZVR5cGV9YCkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdGUucmVzdWx0QXJyID0gSW5saW5lTGlzdCh0b21sVHlwZSh2YWx1ZSkpXG4gICAgICB9XG4gICAgICBpZiAoaXNGbG9hdCh2YWx1ZSkgfHwgaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICAvLyB1bmJveCBub3cgdGhhdCB3ZSd2ZSB2ZXJpZmllZCB0aGV5J3JlIG9rXG4gICAgICAgIHRoaXMuc3RhdGUucmVzdWx0QXJyLnB1c2godmFsdWUudmFsdWVPZigpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHRBcnIucHVzaCh2YWx1ZSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUlubGluZUxpc3ROZXh0KVxuICAgIH1cbiAgICBwYXJzZUlubGluZUxpc3ROZXh0ICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfU1AgfHwgdGhpcy5jaGFyID09PSBDVFJMX0kgfHwgdGhpcy5jaGFyID09PSBDVFJMX00gfHwgdGhpcy5jaGFyID09PSBDVFJMX0opIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX05VTSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VDb21tZW50KVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQ09NTUEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlSW5saW5lTGlzdClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1JTUUIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlSW5saW5lTGlzdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIsIGV4cGVjdGVkIHdoaXRlc3BhY2UsIGNvbW1hICgsKSBvciBjbG9zZSBicmFja2V0IChdKScpKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIElOTElORSBUQUJMRSAqL1xuICAgIHBhcnNlSW5saW5lVGFibGUgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IFBhcnNlci5FTkQgfHwgdGhpcy5jaGFyID09PSBDSEFSX05VTSB8fCB0aGlzLmNoYXIgPT09IENUUkxfSiB8fCB0aGlzLmNoYXIgPT09IENUUkxfTSkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VudGVybWluYXRlZCBpbmxpbmUgYXJyYXknKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1JDVUIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKHRoaXMuc3RhdGUucmVzdWx0VGFibGUgfHwgSW5saW5lVGFibGUoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5yZXN1bHRUYWJsZSkgdGhpcy5zdGF0ZS5yZXN1bHRUYWJsZSA9IElubGluZVRhYmxlKClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlQXNzaWduLCB0aGlzLnJlY29yZElubGluZVRhYmxlVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICAgIHJlY29yZElubGluZVRhYmxlVmFsdWUgKGt2KSB7XG4gICAgICBsZXQgdGFyZ2V0ID0gdGhpcy5zdGF0ZS5yZXN1bHRUYWJsZVxuICAgICAgbGV0IGZpbmFsS2V5ID0ga3Yua2V5LnBvcCgpXG4gICAgICBmb3IgKGxldCBrdyBvZiBrdi5rZXkpIHtcbiAgICAgICAgaWYgKGhhc0tleSh0YXJnZXQsIGt3KSAmJiAoIWlzVGFibGUodGFyZ2V0W2t3XSkgfHwgdGFyZ2V0W2t3XVtfZGVjbGFyZWRdKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRba3ddID0gdGFyZ2V0W2t3XSB8fCBUYWJsZSgpXG4gICAgICB9XG4gICAgICBpZiAoaGFzS2V5KHRhcmdldCwgZmluYWxLZXkpKSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgIH1cbiAgICAgIGlmIChpc0ludGVnZXIoa3YudmFsdWUpIHx8IGlzRmxvYXQoa3YudmFsdWUpKSB7XG4gICAgICAgIHRhcmdldFtmaW5hbEtleV0gPSBrdi52YWx1ZS52YWx1ZU9mKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtmaW5hbEtleV0gPSBrdi52YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlSW5saW5lVGFibGVOZXh0KVxuICAgIH1cbiAgICBwYXJzZUlubGluZVRhYmxlTmV4dCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1NQIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9JKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gUGFyc2VyLkVORCB8fCB0aGlzLmNoYXIgPT09IENIQVJfTlVNIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9KIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9NKSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW50ZXJtaW5hdGVkIGlubGluZSBhcnJheScpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQ09NTUEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlSW5saW5lVGFibGUpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9SQ1VCKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUlubGluZVRhYmxlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciwgZXhwZWN0ZWQgd2hpdGVzcGFjZSwgY29tbWEgKCwpIG9yIGNsb3NlIGJyYWNrZXQgKF0pJykpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBUT01MUGFyc2VyXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IHByZXR0eUVycm9yXG5cbmZ1bmN0aW9uIHByZXR0eUVycm9yIChlcnIsIGJ1Zikge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGVyci5wb3MgPT0gbnVsbCB8fCBlcnIubGluZSA9PSBudWxsKSByZXR1cm4gZXJyXG4gIGxldCBtc2cgPSBlcnIubWVzc2FnZVxuICBtc2cgKz0gYCBhdCByb3cgJHtlcnIubGluZSArIDF9LCBjb2wgJHtlcnIuY29sICsgMX0sIHBvcyAke2Vyci5wb3N9OlxcbmBcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoYnVmICYmIGJ1Zi5zcGxpdCkge1xuICAgIGNvbnN0IGxpbmVzID0gYnVmLnNwbGl0KC9cXG4vKVxuICAgIGNvbnN0IGxpbmVOdW1XaWR0aCA9IFN0cmluZyhNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGVyci5saW5lICsgMykpLmxlbmd0aFxuICAgIGxldCBsaW5lUGFkZGluZyA9ICcgJ1xuICAgIHdoaWxlIChsaW5lUGFkZGluZy5sZW5ndGggPCBsaW5lTnVtV2lkdGgpIGxpbmVQYWRkaW5nICs9ICcgJ1xuICAgIGZvciAobGV0IGlpID0gTWF0aC5tYXgoMCwgZXJyLmxpbmUgLSAxKTsgaWkgPCBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGVyci5saW5lICsgMik7ICsraWkpIHtcbiAgICAgIGxldCBsaW5lTnVtID0gU3RyaW5nKGlpICsgMSlcbiAgICAgIGlmIChsaW5lTnVtLmxlbmd0aCA8IGxpbmVOdW1XaWR0aCkgbGluZU51bSA9ICcgJyArIGxpbmVOdW1cbiAgICAgIGlmIChlcnIubGluZSA9PT0gaWkpIHtcbiAgICAgICAgbXNnICs9IGxpbmVOdW0gKyAnPiAnICsgbGluZXNbaWldICsgJ1xcbidcbiAgICAgICAgbXNnICs9IGxpbmVQYWRkaW5nICsgJyAgJ1xuICAgICAgICBmb3IgKGxldCBoaCA9IDA7IGhoIDwgZXJyLmNvbDsgKytoaCkge1xuICAgICAgICAgIG1zZyArPSAnICdcbiAgICAgICAgfVxuICAgICAgICBtc2cgKz0gJ15cXG4nXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtc2cgKz0gbGluZU51bSArICc6ICcgKyBsaW5lc1tpaV0gKyAnXFxuJ1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBlcnIubWVzc2FnZSA9IG1zZyArICdcXG4nXG4gIHJldHVybiBlcnJcbn1cbiIsICIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VTdHJpbmdcblxuY29uc3QgVE9NTFBhcnNlciA9IHJlcXVpcmUoJy4vbGliL3RvbWwtcGFyc2VyLmpzJylcbmNvbnN0IHByZXR0eUVycm9yID0gcmVxdWlyZSgnLi9wYXJzZS1wcmV0dHktZXJyb3IuanMnKVxuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyAoc3RyKSB7XG4gIGlmIChnbG9iYWwuQnVmZmVyICYmIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIoc3RyKSkge1xuICAgIHN0ciA9IHN0ci50b1N0cmluZygndXRmOCcpXG4gIH1cbiAgY29uc3QgcGFyc2VyID0gbmV3IFRPTUxQYXJzZXIoKVxuICB0cnkge1xuICAgIHBhcnNlci5wYXJzZShzdHIpXG4gICAgcmV0dXJuIHBhcnNlci5maW5pc2goKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBwcmV0dHlFcnJvcihlcnIsIHN0cilcbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUFzeW5jXG5cbmNvbnN0IFRPTUxQYXJzZXIgPSByZXF1aXJlKCcuL2xpYi90b21sLXBhcnNlci5qcycpXG5jb25zdCBwcmV0dHlFcnJvciA9IHJlcXVpcmUoJy4vcGFyc2UtcHJldHR5LWVycm9yLmpzJylcblxuZnVuY3Rpb24gcGFyc2VBc3luYyAoc3RyLCBvcHRzKSB7XG4gIGlmICghb3B0cykgb3B0cyA9IHt9XG4gIGNvbnN0IGluZGV4ID0gMFxuICBjb25zdCBibG9ja3NpemUgPSBvcHRzLmJsb2Nrc2l6ZSB8fCA0MDk2MFxuICBjb25zdCBwYXJzZXIgPSBuZXcgVE9NTFBhcnNlcigpXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc2V0SW1tZWRpYXRlKHBhcnNlQXN5bmNOZXh0LCBpbmRleCwgYmxvY2tzaXplLCByZXNvbHZlLCByZWplY3QpXG4gIH0pXG4gIGZ1bmN0aW9uIHBhcnNlQXN5bmNOZXh0IChpbmRleCwgYmxvY2tzaXplLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAoaW5kZXggPj0gc3RyLmxlbmd0aCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUocGFyc2VyLmZpbmlzaCgpKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiByZWplY3QocHJldHR5RXJyb3IoZXJyLCBzdHIpKVxuICAgICAgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgcGFyc2VyLnBhcnNlKHN0ci5zbGljZShpbmRleCwgaW5kZXggKyBibG9ja3NpemUpKVxuICAgICAgc2V0SW1tZWRpYXRlKHBhcnNlQXN5bmNOZXh0LCBpbmRleCArIGJsb2Nrc2l6ZSwgYmxvY2tzaXplLCByZXNvbHZlLCByZWplY3QpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWplY3QocHJldHR5RXJyb3IoZXJyLCBzdHIpKVxuICAgIH1cbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZVN0cmVhbVxuXG5jb25zdCBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKVxuY29uc3QgVE9NTFBhcnNlciA9IHJlcXVpcmUoJy4vbGliL3RvbWwtcGFyc2VyLmpzJylcblxuZnVuY3Rpb24gcGFyc2VTdHJlYW0gKHN0bSkge1xuICBpZiAoc3RtKSB7XG4gICAgcmV0dXJuIHBhcnNlUmVhZGFibGUoc3RtKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBwYXJzZVRyYW5zZm9ybShzdG0pXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VSZWFkYWJsZSAoc3RtKSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUT01MUGFyc2VyKClcbiAgc3RtLnNldEVuY29kaW5nKCd1dGY4JylcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgcmVhZGFibGVcbiAgICBsZXQgZW5kZWQgPSBmYWxzZVxuICAgIGxldCBlcnJvcmVkID0gZmFsc2VcbiAgICBmdW5jdGlvbiBmaW5pc2ggKCkge1xuICAgICAgZW5kZWQgPSB0cnVlXG4gICAgICBpZiAocmVhZGFibGUpIHJldHVyblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZShwYXJzZXIuZmluaXNoKCkpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZXJyb3IgKGVycikge1xuICAgICAgZXJyb3JlZCA9IHRydWVcbiAgICAgIHJlamVjdChlcnIpXG4gICAgfVxuICAgIHN0bS5vbmNlKCdlbmQnLCBmaW5pc2gpXG4gICAgc3RtLm9uY2UoJ2Vycm9yJywgZXJyb3IpXG4gICAgcmVhZE5leHQoKVxuXG4gICAgZnVuY3Rpb24gcmVhZE5leHQgKCkge1xuICAgICAgcmVhZGFibGUgPSB0cnVlXG4gICAgICBsZXQgZGF0YVxuICAgICAgd2hpbGUgKChkYXRhID0gc3RtLnJlYWQoKSkgIT09IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwYXJzZXIucGFyc2UoZGF0YSlcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yKGVycilcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVhZGFibGUgPSBmYWxzZVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoZW5kZWQpIHJldHVybiBmaW5pc2goKVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoZXJyb3JlZCkgcmV0dXJuXG4gICAgICBzdG0ub25jZSgncmVhZGFibGUnLCByZWFkTmV4dClcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtICgpIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRPTUxQYXJzZXIoKVxuICByZXR1cm4gbmV3IHN0cmVhbS5UcmFuc2Zvcm0oe1xuICAgIG9iamVjdE1vZGU6IHRydWUsXG4gICAgdHJhbnNmb3JtIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwYXJzZXIucGFyc2UoY2h1bmsudG9TdHJpbmcoZW5jb2RpbmcpKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICB9XG4gICAgICBjYigpXG4gICAgfSxcbiAgICBmbHVzaCAoY2IpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMucHVzaChwYXJzZXIuZmluaXNoKCkpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIH1cbiAgICAgIGNiKClcbiAgICB9XG4gIH0pXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vcGFyc2Utc3RyaW5nLmpzJylcbm1vZHVsZS5leHBvcnRzLmFzeW5jID0gcmVxdWlyZSgnLi9wYXJzZS1hc3luYy5qcycpXG5tb2R1bGUuZXhwb3J0cy5zdHJlYW0gPSByZXF1aXJlKCcuL3BhcnNlLXN0cmVhbS5qcycpXG5tb2R1bGUuZXhwb3J0cy5wcmV0dHlFcnJvciA9IHJlcXVpcmUoJy4vcGFyc2UtcHJldHR5LWVycm9yLmpzJylcbiIsICIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0gc3RyaW5naWZ5XG5tb2R1bGUuZXhwb3J0cy52YWx1ZSA9IHN0cmluZ2lmeUlubGluZVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkgKG9iaikge1xuICBpZiAob2JqID09PSBudWxsKSB0aHJvdyB0eXBlRXJyb3IoJ251bGwnKVxuICBpZiAob2JqID09PSB2b2lkICgwKSkgdGhyb3cgdHlwZUVycm9yKCd1bmRlZmluZWQnKVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHRocm93IHR5cGVFcnJvcih0eXBlb2Ygb2JqKVxuXG4gIGlmICh0eXBlb2Ygb2JqLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykgb2JqID0gb2JqLnRvSlNPTigpXG4gIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIG51bGxcbiAgY29uc3QgdHlwZSA9IHRvbWxUeXBlKG9iailcbiAgaWYgKHR5cGUgIT09ICd0YWJsZScpIHRocm93IHR5cGVFcnJvcih0eXBlKVxuICByZXR1cm4gc3RyaW5naWZ5T2JqZWN0KCcnLCAnJywgb2JqKVxufVxuXG5mdW5jdGlvbiB0eXBlRXJyb3IgKHR5cGUpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQ2FuIG9ubHkgc3RyaW5naWZ5IG9iamVjdHMsIG5vdCAnICsgdHlwZSlcbn1cblxuZnVuY3Rpb24gYXJyYXlPbmVUeXBlRXJyb3IgKCkge1xuICByZXR1cm4gbmV3IEVycm9yKFwiQXJyYXkgdmFsdWVzIGNhbid0IGhhdmUgbWl4ZWQgdHlwZXNcIilcbn1cblxuZnVuY3Rpb24gZ2V0SW5saW5lS2V5cyAob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmZpbHRlcihrZXkgPT4gaXNJbmxpbmUob2JqW2tleV0pKVxufVxuZnVuY3Rpb24gZ2V0Q29tcGxleEtleXMgKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5maWx0ZXIoa2V5ID0+ICFpc0lubGluZShvYmpba2V5XSkpXG59XG5cbmZ1bmN0aW9uIHRvSlNPTiAob2JqKSB7XG4gIGxldCBub2JqID0gQXJyYXkuaXNBcnJheShvYmopID8gW10gOiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCAnX19wcm90b19fJykgPyB7WydfX3Byb3RvX18nXTogdW5kZWZpbmVkfSA6IHt9XG4gIGZvciAobGV0IHByb3Agb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgIGlmIChvYmpbcHJvcF0gJiYgdHlwZW9mIG9ialtwcm9wXS50b0pTT04gPT09ICdmdW5jdGlvbicgJiYgISgndG9JU09TdHJpbmcnIGluIG9ialtwcm9wXSkpIHtcbiAgICAgIG5vYmpbcHJvcF0gPSBvYmpbcHJvcF0udG9KU09OKClcbiAgICB9IGVsc2Uge1xuICAgICAgbm9ialtwcm9wXSA9IG9ialtwcm9wXVxuICAgIH1cbiAgfVxuICByZXR1cm4gbm9ialxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlPYmplY3QgKHByZWZpeCwgaW5kZW50LCBvYmopIHtcbiAgb2JqID0gdG9KU09OKG9iailcbiAgdmFyIGlubGluZUtleXNcbiAgdmFyIGNvbXBsZXhLZXlzXG4gIGlubGluZUtleXMgPSBnZXRJbmxpbmVLZXlzKG9iailcbiAgY29tcGxleEtleXMgPSBnZXRDb21wbGV4S2V5cyhvYmopXG4gIHZhciByZXN1bHQgPSBbXVxuICB2YXIgaW5saW5lSW5kZW50ID0gaW5kZW50IHx8ICcnXG4gIGlubGluZUtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIHZhciB0eXBlID0gdG9tbFR5cGUob2JqW2tleV0pXG4gICAgaWYgKHR5cGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGUgIT09ICdudWxsJykge1xuICAgICAgcmVzdWx0LnB1c2goaW5saW5lSW5kZW50ICsgc3RyaW5naWZ5S2V5KGtleSkgKyAnID0gJyArIHN0cmluZ2lmeUFueUlubGluZShvYmpba2V5XSwgdHJ1ZSkpXG4gICAgfVxuICB9KVxuICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHJlc3VsdC5wdXNoKCcnKVxuICB2YXIgY29tcGxleEluZGVudCA9IHByZWZpeCAmJiBpbmxpbmVLZXlzLmxlbmd0aCA+IDAgPyBpbmRlbnQgKyAnICAnIDogJydcbiAgY29tcGxleEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIHJlc3VsdC5wdXNoKHN0cmluZ2lmeUNvbXBsZXgocHJlZml4LCBjb21wbGV4SW5kZW50LCBrZXksIG9ialtrZXldKSlcbiAgfSlcbiAgcmV0dXJuIHJlc3VsdC5qb2luKCdcXG4nKVxufVxuXG5mdW5jdGlvbiBpc0lubGluZSAodmFsdWUpIHtcbiAgc3dpdGNoICh0b21sVHlwZSh2YWx1ZSkpIHtcbiAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgIGNhc2UgJ251bGwnOlxuICAgIGNhc2UgJ2ludGVnZXInOlxuICAgIGNhc2UgJ25hbic6XG4gICAgY2FzZSAnZmxvYXQnOlxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgY2FzZSAnZGF0ZXRpbWUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBjYXNlICdhcnJheSc6XG4gICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID09PSAwIHx8IHRvbWxUeXBlKHZhbHVlWzBdKSAhPT0gJ3RhYmxlJ1xuICAgIGNhc2UgJ3RhYmxlJzpcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09PSAwXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gdG9tbFR5cGUgKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICd1bmRlZmluZWQnXG4gIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnXG4gIC8qIGVzbGludC1kaXNhYmxlIHZhbGlkLXR5cGVvZiAqL1xuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2JpZ2ludCcgfHwgKE51bWJlci5pc0ludGVnZXIodmFsdWUpICYmICFPYmplY3QuaXModmFsdWUsIC0wKSkpIHtcbiAgICByZXR1cm4gJ2ludGVnZXInXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiAnZmxvYXQnXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gJ2Jvb2xlYW4nXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiAnc3RyaW5nJ1xuICB9IGVsc2UgaWYgKCd0b0lTT1N0cmluZycgaW4gdmFsdWUpIHtcbiAgICByZXR1cm4gaXNOYU4odmFsdWUpID8gJ3VuZGVmaW5lZCcgOiAnZGF0ZXRpbWUnXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gJ2FycmF5J1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAndGFibGUnXG4gIH1cbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5S2V5IChrZXkpIHtcbiAgdmFyIGtleVN0ciA9IFN0cmluZyhrZXkpXG4gIGlmICgvXlstQS1aYS16MC05X10rJC8udGVzdChrZXlTdHIpKSB7XG4gICAgcmV0dXJuIGtleVN0clxuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHJpbmdpZnlCYXNpY1N0cmluZyhrZXlTdHIpXG4gIH1cbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5QmFzaWNTdHJpbmcgKHN0cikge1xuICByZXR1cm4gJ1wiJyArIGVzY2FwZVN0cmluZyhzdHIpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIidcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5TGl0ZXJhbFN0cmluZyAoc3RyKSB7XG4gIHJldHVybiBcIidcIiArIHN0ciArIFwiJ1wiXG59XG5cbmZ1bmN0aW9uIG51bXBhZCAobnVtLCBzdHIpIHtcbiAgd2hpbGUgKHN0ci5sZW5ndGggPCBudW0pIHN0ciA9ICcwJyArIHN0clxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIGVzY2FwZVN0cmluZyAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKVxuICAgIC5yZXBsYWNlKC9bXFxiXS9nLCAnXFxcXGInKVxuICAgIC5yZXBsYWNlKC9cXHQvZywgJ1xcXFx0JylcbiAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG4gICAgLnJlcGxhY2UoL1xcZi9nLCAnXFxcXGYnKVxuICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJylcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb250cm9sLXJlZ2V4ICovXG4gICAgLnJlcGxhY2UoLyhbXFx1MDAwMC1cXHUwMDFmXFx1MDA3Zl0pLywgYyA9PiAnXFxcXHUnICsgbnVtcGFkKDQsIGMuY29kZVBvaW50QXQoMCkudG9TdHJpbmcoMTYpKSlcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnRyb2wtcmVnZXggKi9cbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5TXVsdGlsaW5lU3RyaW5nIChzdHIpIHtcbiAgbGV0IGVzY2FwZWQgPSBzdHIuc3BsaXQoL1xcbi8pLm1hcChzdHIgPT4ge1xuICAgIHJldHVybiBlc2NhcGVTdHJpbmcoc3RyKS5yZXBsYWNlKC9cIig/PVwiXCIpL2csICdcXFxcXCInKVxuICB9KS5qb2luKCdcXG4nKVxuICBpZiAoZXNjYXBlZC5zbGljZSgtMSkgPT09ICdcIicpIGVzY2FwZWQgKz0gJ1xcXFxcXG4nXG4gIHJldHVybiAnXCJcIlwiXFxuJyArIGVzY2FwZWQgKyAnXCJcIlwiJ1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlBbnlJbmxpbmUgKHZhbHVlLCBtdWx0aWxpbmVPaykge1xuICBsZXQgdHlwZSA9IHRvbWxUeXBlKHZhbHVlKVxuICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAobXVsdGlsaW5lT2sgJiYgL1xcbi8udGVzdCh2YWx1ZSkpIHtcbiAgICAgIHR5cGUgPSAnc3RyaW5nLW11bHRpbGluZSdcbiAgICB9IGVsc2UgaWYgKCEvW1xcYlxcdFxcblxcZlxcciddLy50ZXN0KHZhbHVlKSAmJiAvXCIvLnRlc3QodmFsdWUpKSB7XG4gICAgICB0eXBlID0gJ3N0cmluZy1saXRlcmFsJ1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyaW5naWZ5SW5saW5lKHZhbHVlLCB0eXBlKVxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlJbmxpbmUgKHZhbHVlLCB0eXBlKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoIXR5cGUpIHR5cGUgPSB0b21sVHlwZSh2YWx1ZSlcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nLW11bHRpbGluZSc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5TXVsdGlsaW5lU3RyaW5nKHZhbHVlKVxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5QmFzaWNTdHJpbmcodmFsdWUpXG4gICAgY2FzZSAnc3RyaW5nLWxpdGVyYWwnOlxuICAgICAgcmV0dXJuIHN0cmluZ2lmeUxpdGVyYWxTdHJpbmcodmFsdWUpXG4gICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5SW50ZWdlcih2YWx1ZSlcbiAgICBjYXNlICdmbG9hdCc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5RmxvYXQodmFsdWUpXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5Qm9vbGVhbih2YWx1ZSlcbiAgICBjYXNlICdkYXRldGltZSc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5RGF0ZXRpbWUodmFsdWUpXG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIHN0cmluZ2lmeUlubGluZUFycmF5KHZhbHVlLmZpbHRlcihfID0+IHRvbWxUeXBlKF8pICE9PSAnbnVsbCcgJiYgdG9tbFR5cGUoXykgIT09ICd1bmRlZmluZWQnICYmIHRvbWxUeXBlKF8pICE9PSAnbmFuJykpXG4gICAgY2FzZSAndGFibGUnOlxuICAgICAgcmV0dXJuIHN0cmluZ2lmeUlubGluZVRhYmxlKHZhbHVlKVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IHR5cGVFcnJvcih0eXBlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUludGVnZXIgKHZhbHVlKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIHNlY3VyaXR5L2RldGVjdC11bnNhZmUtcmVnZXggKi9cbiAgcmV0dXJuIFN0cmluZyh2YWx1ZSkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJ18nKVxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlGbG9hdCAodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIHJldHVybiAnaW5mJ1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAtSW5maW5pdHkpIHtcbiAgICByZXR1cm4gJy1pbmYnXG4gIH0gZWxzZSBpZiAoT2JqZWN0LmlzKHZhbHVlLCBOYU4pKSB7XG4gICAgcmV0dXJuICduYW4nXG4gIH0gZWxzZSBpZiAoT2JqZWN0LmlzKHZhbHVlLCAtMCkpIHtcbiAgICByZXR1cm4gJy0wLjAnXG4gIH1cbiAgdmFyIGNodW5rcyA9IFN0cmluZyh2YWx1ZSkuc3BsaXQoJy4nKVxuICB2YXIgaW50ID0gY2h1bmtzWzBdXG4gIHZhciBkZWMgPSBjaHVua3NbMV0gfHwgMFxuICByZXR1cm4gc3RyaW5naWZ5SW50ZWdlcihpbnQpICsgJy4nICsgZGVjXG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUJvb2xlYW4gKHZhbHVlKSB7XG4gIHJldHVybiBTdHJpbmcodmFsdWUpXG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeURhdGV0aW1lICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUudG9JU09TdHJpbmcoKVxufVxuXG5mdW5jdGlvbiBpc051bWJlciAodHlwZSkge1xuICByZXR1cm4gdHlwZSA9PT0gJ2Zsb2F0JyB8fCB0eXBlID09PSAnaW50ZWdlcidcbn1cbmZ1bmN0aW9uIGFycmF5VHlwZSAodmFsdWVzKSB7XG4gIHZhciBjb250ZW50VHlwZSA9IHRvbWxUeXBlKHZhbHVlc1swXSlcbiAgaWYgKHZhbHVlcy5ldmVyeShfID0+IHRvbWxUeXBlKF8pID09PSBjb250ZW50VHlwZSkpIHJldHVybiBjb250ZW50VHlwZVxuICAvLyBtaXhlZCBpbnRlZ2VyL2Zsb2F0LCBlbWl0IGFzIGZsb2F0c1xuICBpZiAodmFsdWVzLmV2ZXJ5KF8gPT4gaXNOdW1iZXIodG9tbFR5cGUoXykpKSkgcmV0dXJuICdmbG9hdCdcbiAgcmV0dXJuICdtaXhlZCdcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlQXJyYXkgKHZhbHVlcykge1xuICBjb25zdCB0eXBlID0gYXJyYXlUeXBlKHZhbHVlcylcbiAgaWYgKHR5cGUgPT09ICdtaXhlZCcpIHtcbiAgICB0aHJvdyBhcnJheU9uZVR5cGVFcnJvcigpXG4gIH1cbiAgcmV0dXJuIHR5cGVcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5SW5saW5lQXJyYXkgKHZhbHVlcykge1xuICB2YWx1ZXMgPSB0b0pTT04odmFsdWVzKVxuICBjb25zdCB0eXBlID0gdmFsaWRhdGVBcnJheSh2YWx1ZXMpXG4gIHZhciByZXN1bHQgPSAnWydcbiAgdmFyIHN0cmluZ2lmaWVkID0gdmFsdWVzLm1hcChfID0+IHN0cmluZ2lmeUlubGluZShfLCB0eXBlKSlcbiAgaWYgKHN0cmluZ2lmaWVkLmpvaW4oJywgJykubGVuZ3RoID4gNjAgfHwgL1xcbi8udGVzdChzdHJpbmdpZmllZCkpIHtcbiAgICByZXN1bHQgKz0gJ1xcbiAgJyArIHN0cmluZ2lmaWVkLmpvaW4oJyxcXG4gICcpICsgJ1xcbidcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgKz0gJyAnICsgc3RyaW5naWZpZWQuam9pbignLCAnKSArIChzdHJpbmdpZmllZC5sZW5ndGggPiAwID8gJyAnIDogJycpXG4gIH1cbiAgcmV0dXJuIHJlc3VsdCArICddJ1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlJbmxpbmVUYWJsZSAodmFsdWUpIHtcbiAgdmFsdWUgPSB0b0pTT04odmFsdWUpXG4gIHZhciByZXN1bHQgPSBbXVxuICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgIHJlc3VsdC5wdXNoKHN0cmluZ2lmeUtleShrZXkpICsgJyA9ICcgKyBzdHJpbmdpZnlBbnlJbmxpbmUodmFsdWVba2V5XSwgZmFsc2UpKVxuICB9KVxuICByZXR1cm4gJ3sgJyArIHJlc3VsdC5qb2luKCcsICcpICsgKHJlc3VsdC5sZW5ndGggPiAwID8gJyAnIDogJycpICsgJ30nXG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUNvbXBsZXggKHByZWZpeCwgaW5kZW50LCBrZXksIHZhbHVlKSB7XG4gIHZhciB2YWx1ZVR5cGUgPSB0b21sVHlwZSh2YWx1ZSlcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKHZhbHVlVHlwZSA9PT0gJ2FycmF5Jykge1xuICAgIHJldHVybiBzdHJpbmdpZnlBcnJheU9mVGFibGVzKHByZWZpeCwgaW5kZW50LCBrZXksIHZhbHVlKVxuICB9IGVsc2UgaWYgKHZhbHVlVHlwZSA9PT0gJ3RhYmxlJykge1xuICAgIHJldHVybiBzdHJpbmdpZnlDb21wbGV4VGFibGUocHJlZml4LCBpbmRlbnQsIGtleSwgdmFsdWUpXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgdHlwZUVycm9yKHZhbHVlVHlwZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlBcnJheU9mVGFibGVzIChwcmVmaXgsIGluZGVudCwga2V5LCB2YWx1ZXMpIHtcbiAgdmFsdWVzID0gdG9KU09OKHZhbHVlcylcbiAgdmFsaWRhdGVBcnJheSh2YWx1ZXMpXG4gIHZhciBmaXJzdFZhbHVlVHlwZSA9IHRvbWxUeXBlKHZhbHVlc1swXSlcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChmaXJzdFZhbHVlVHlwZSAhPT0gJ3RhYmxlJykgdGhyb3cgdHlwZUVycm9yKGZpcnN0VmFsdWVUeXBlKVxuICB2YXIgZnVsbEtleSA9IHByZWZpeCArIHN0cmluZ2lmeUtleShrZXkpXG4gIHZhciByZXN1bHQgPSAnJ1xuICB2YWx1ZXMuZm9yRWFjaCh0YWJsZSA9PiB7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSByZXN1bHQgKz0gJ1xcbidcbiAgICByZXN1bHQgKz0gaW5kZW50ICsgJ1tbJyArIGZ1bGxLZXkgKyAnXV1cXG4nXG4gICAgcmVzdWx0ICs9IHN0cmluZ2lmeU9iamVjdChmdWxsS2V5ICsgJy4nLCBpbmRlbnQsIHRhYmxlKVxuICB9KVxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUNvbXBsZXhUYWJsZSAocHJlZml4LCBpbmRlbnQsIGtleSwgdmFsdWUpIHtcbiAgdmFyIGZ1bGxLZXkgPSBwcmVmaXggKyBzdHJpbmdpZnlLZXkoa2V5KVxuICB2YXIgcmVzdWx0ID0gJydcbiAgaWYgKGdldElubGluZUtleXModmFsdWUpLmxlbmd0aCA+IDApIHtcbiAgICByZXN1bHQgKz0gaW5kZW50ICsgJ1snICsgZnVsbEtleSArICddXFxuJ1xuICB9XG4gIHJldHVybiByZXN1bHQgKyBzdHJpbmdpZnlPYmplY3QoZnVsbEtleSArICcuJywgaW5kZW50LCB2YWx1ZSlcbn1cbiIsICIndXNlIHN0cmljdCdcbmV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlLmpzJylcbmV4cG9ydHMuc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9zdHJpbmdpZnkuanMnKVxuIiwgIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50YWlsUmVjID0gdm9pZCAwO1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gdGFpbFJlYyhhLCBmKSB7XG4gICAgdmFyIHYgPSBmKGEpO1xuICAgIHdoaWxlICh2Ll90YWcgPT09ICdMZWZ0Jykge1xuICAgICAgICB2ID0gZih2LmxlZnQpO1xuICAgIH1cbiAgICByZXR1cm4gdi5yaWdodDtcbn1cbmV4cG9ydHMudGFpbFJlYyA9IHRhaWxSZWM7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJpbmRUb18gPSBleHBvcnRzLmJpbmRfID0gZXhwb3J0cy5ob2xlID0gZXhwb3J0cy5waXBlID0gZXhwb3J0cy51bnR1cGxlZCA9IGV4cG9ydHMudHVwbGVkID0gZXhwb3J0cy5hYnN1cmQgPSBleHBvcnRzLmRlY3JlbWVudCA9IGV4cG9ydHMuaW5jcmVtZW50ID0gZXhwb3J0cy50dXBsZSA9IGV4cG9ydHMuZmxvdyA9IGV4cG9ydHMuZmxpcCA9IGV4cG9ydHMuY29uc3RWb2lkID0gZXhwb3J0cy5jb25zdFVuZGVmaW5lZCA9IGV4cG9ydHMuY29uc3ROdWxsID0gZXhwb3J0cy5jb25zdEZhbHNlID0gZXhwb3J0cy5jb25zdFRydWUgPSBleHBvcnRzLmNvbnN0YW50ID0gZXhwb3J0cy5ub3QgPSBleHBvcnRzLnVuc2FmZUNvZXJjZSA9IGV4cG9ydHMuaWRlbnRpdHkgPSB2b2lkIDA7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBpZGVudGl0eShhKSB7XG4gICAgcmV0dXJuIGE7XG59XG5leHBvcnRzLmlkZW50aXR5ID0gaWRlbnRpdHk7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLnVuc2FmZUNvZXJjZSA9IGlkZW50aXR5O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gbm90KHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gIXByZWRpY2F0ZShhKTsgfTtcbn1cbmV4cG9ydHMubm90ID0gbm90O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQoYSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBhOyB9O1xufVxuZXhwb3J0cy5jb25zdGFudCA9IGNvbnN0YW50O1xuLyoqXG4gKiBBIHRodW5rIHRoYXQgcmV0dXJucyBhbHdheXMgYHRydWVgLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmNvbnN0VHJ1ZSA9IFxuLyojX19QVVJFX18qL1xuY29uc3RhbnQodHJ1ZSk7XG4vKipcbiAqIEEgdGh1bmsgdGhhdCByZXR1cm5zIGFsd2F5cyBgZmFsc2VgLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmNvbnN0RmFsc2UgPSBcbi8qI19fUFVSRV9fKi9cbmNvbnN0YW50KGZhbHNlKTtcbi8qKlxuICogQSB0aHVuayB0aGF0IHJldHVybnMgYWx3YXlzIGBudWxsYC5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0cy5jb25zdE51bGwgPSBcbi8qI19fUFVSRV9fKi9cbmNvbnN0YW50KG51bGwpO1xuLyoqXG4gKiBBIHRodW5rIHRoYXQgcmV0dXJucyBhbHdheXMgYHVuZGVmaW5lZGAuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuY29uc3RVbmRlZmluZWQgPSBcbi8qI19fUFVSRV9fKi9cbmNvbnN0YW50KHVuZGVmaW5lZCk7XG4vKipcbiAqIEEgdGh1bmsgdGhhdCByZXR1cm5zIGFsd2F5cyBgdm9pZGAuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuY29uc3RWb2lkID0gZXhwb3J0cy5jb25zdFVuZGVmaW5lZDtcbi8vIFRPRE86IHJlbW92ZSBpbiB2M1xuLyoqXG4gKiBGbGlwcyB0aGUgb3JkZXIgb2YgdGhlIGFyZ3VtZW50cyBvZiBhIGZ1bmN0aW9uIG9mIHR3byBhcmd1bWVudHMuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGZsaXAoZikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYiwgYSkgeyByZXR1cm4gZihhLCBiKTsgfTtcbn1cbmV4cG9ydHMuZmxpcCA9IGZsaXA7XG5mdW5jdGlvbiBmbG93KGFiLCBiYywgY2QsIGRlLCBlZiwgZmcsIGdoLCBoaSwgaWopIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIGFiO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZnKGVmKGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdoKGZnKGVmKGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoaShnaChmZyhlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlqKGhpKGdoKGZnKGVmKGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSkpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybjtcbn1cbmV4cG9ydHMuZmxvdyA9IGZsb3c7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiB0dXBsZSgpIHtcbiAgICB2YXIgdCA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHRbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG59XG5leHBvcnRzLnR1cGxlID0gdHVwbGU7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBpbmNyZW1lbnQobikge1xuICAgIHJldHVybiBuICsgMTtcbn1cbmV4cG9ydHMuaW5jcmVtZW50ID0gaW5jcmVtZW50O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gZGVjcmVtZW50KG4pIHtcbiAgICByZXR1cm4gbiAtIDE7XG59XG5leHBvcnRzLmRlY3JlbWVudCA9IGRlY3JlbWVudDtcbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGFic3VyZChfKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsZWQgYGFic3VyZGAgZnVuY3Rpb24gd2hpY2ggc2hvdWxkIGJlIHVuY2FsbGFibGUnKTtcbn1cbmV4cG9ydHMuYWJzdXJkID0gYWJzdXJkO1xuLyoqXG4gKiBDcmVhdGVzIGEgdHVwbGVkIHZlcnNpb24gb2YgdGhpcyBmdW5jdGlvbjogaW5zdGVhZCBvZiBgbmAgYXJndW1lbnRzLCBpdCBhY2NlcHRzIGEgc2luZ2xlIHR1cGxlIGFyZ3VtZW50LlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyB0dXBsZWQgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBjb25zdCBhZGQgPSB0dXBsZWQoKHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyID0+IHggKyB5KVxuICpcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChhZGQoWzEsIDJdKSwgMylcbiAqXG4gKiBAc2luY2UgMi40LjBcbiAqL1xuZnVuY3Rpb24gdHVwbGVkKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGYuYXBwbHkodm9pZCAwLCBhKTsgfTtcbn1cbmV4cG9ydHMudHVwbGVkID0gdHVwbGVkO1xuLyoqXG4gKiBJbnZlcnNlIGZ1bmN0aW9uIG9mIGB0dXBsZWRgXG4gKlxuICogQHNpbmNlIDIuNC4wXG4gKi9cbmZ1bmN0aW9uIHVudHVwbGVkKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYVtfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmKGEpO1xuICAgIH07XG59XG5leHBvcnRzLnVudHVwbGVkID0gdW50dXBsZWQ7XG5mdW5jdGlvbiBwaXBlKGEsIGFiLCBiYywgY2QsIGRlLCBlZiwgZmcsIGdoLCBoaSwgaWosIGprLCBrbCwgbG0sIG1uLCBubywgb3AsIHBxLCBxciwgcnMsIHN0KSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gYWIoYSk7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBiYyhhYihhKSk7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBjZChiYyhhYihhKSkpO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gZGUoY2QoYmMoYWIoYSkpKSk7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiBlZihkZShjZChiYyhhYihhKSkpKSk7XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiBmZyhlZihkZShjZChiYyhhYihhKSkpKSkpO1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSk7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSk7XG4gICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICByZXR1cm4gaWooaGkoZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgIHJldHVybiBqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgIHJldHVybiBrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSk7XG4gICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICByZXR1cm4gbG0oa2woamsoaWooaGkoZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICAgIHJldHVybiBtbihsbShrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICAgIHJldHVybiBubyhtbihsbShrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSkpKSk7XG4gICAgICAgIGNhc2UgMTY6XG4gICAgICAgICAgICByZXR1cm4gb3Aobm8obW4obG0oa2woamsoaWooaGkoZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxNzpcbiAgICAgICAgICAgIHJldHVybiBwcShvcChubyhtbihsbShrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxODpcbiAgICAgICAgICAgIHJldHVybiBxcihwcShvcChubyhtbihsbShrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSkpKSkpKSk7XG4gICAgICAgIGNhc2UgMTk6XG4gICAgICAgICAgICByZXR1cm4gcnMocXIocHEob3Aobm8obW4obG0oa2woamsoaWooaGkoZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSkpKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAyMDpcbiAgICAgICAgICAgIHJldHVybiBzdChycyhxcihwcShvcChubyhtbihsbShrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSkpKSkpKSkpKTtcbiAgICB9XG4gICAgcmV0dXJuO1xufVxuZXhwb3J0cy5waXBlID0gcGlwZTtcbi8qKlxuICogVHlwZSBob2xlIHNpbXVsYXRpb25cbiAqXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0cy5ob2xlID0gYWJzdXJkO1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIGJpbmRfID0gZnVuY3Rpb24gKGEsIG5hbWUsIGIpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGEsIChfYSA9IHt9LCBfYVtuYW1lXSA9IGIsIF9hKSk7XG59O1xuZXhwb3J0cy5iaW5kXyA9IGJpbmRfO1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIGJpbmRUb18gPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIChfYSA9IHt9LCBfYVtuYW1lXSA9IGIsIF9hKTtcbn07IH07XG5leHBvcnRzLmJpbmRUb18gPSBiaW5kVG9fO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRXaXRoZXJhYmxlID0gZXhwb3J0cy5nZXRGaWx0ZXJhYmxlID0gZXhwb3J0cy5nZXRBcHBseU1vbm9pZCA9IGV4cG9ydHMuZ2V0QXBwbHlTZW1pZ3JvdXAgPSBleHBvcnRzLmdldFNlbWlncm91cCA9IGV4cG9ydHMuZ2V0RXEgPSBleHBvcnRzLmdldFNob3cgPSBleHBvcnRzLlVSSSA9IGV4cG9ydHMudGhyb3dFcnJvciA9IGV4cG9ydHMuc2VxdWVuY2UgPSBleHBvcnRzLnRyYXZlcnNlID0gZXhwb3J0cy5yZWR1Y2VSaWdodCA9IGV4cG9ydHMuZm9sZE1hcCA9IGV4cG9ydHMucmVkdWNlID0gZXhwb3J0cy5kdXBsaWNhdGUgPSBleHBvcnRzLmV4dGVuZCA9IGV4cG9ydHMuYWx0ID0gZXhwb3J0cy5hbHRXID0gZXhwb3J0cy5mbGF0dGVuID0gZXhwb3J0cy5jaGFpbkZpcnN0ID0gZXhwb3J0cy5jaGFpbkZpcnN0VyA9IGV4cG9ydHMuY2hhaW4gPSBleHBvcnRzLmNoYWluVyA9IGV4cG9ydHMub2YgPSBleHBvcnRzLmFwU2Vjb25kID0gZXhwb3J0cy5hcEZpcnN0ID0gZXhwb3J0cy5hcCA9IGV4cG9ydHMuYXBXID0gZXhwb3J0cy5tYXBMZWZ0ID0gZXhwb3J0cy5iaW1hcCA9IGV4cG9ydHMubWFwID0gZXhwb3J0cy5maWx0ZXJPckVsc2UgPSBleHBvcnRzLmZpbHRlck9yRWxzZVcgPSBleHBvcnRzLm9yRWxzZSA9IGV4cG9ydHMuc3dhcCA9IGV4cG9ydHMuY2hhaW5OdWxsYWJsZUsgPSBleHBvcnRzLmZyb21OdWxsYWJsZUsgPSBleHBvcnRzLmdldE9yRWxzZSA9IGV4cG9ydHMuZ2V0T3JFbHNlVyA9IGV4cG9ydHMuZm9sZCA9IGV4cG9ydHMuZnJvbVByZWRpY2F0ZSA9IGV4cG9ydHMuZnJvbU9wdGlvbiA9IGV4cG9ydHMuc3RyaW5naWZ5SlNPTiA9IGV4cG9ydHMucGFyc2VKU09OID0gZXhwb3J0cy50cnlDYXRjaCA9IGV4cG9ydHMuZnJvbU51bGxhYmxlID0gZXhwb3J0cy5yaWdodCA9IGV4cG9ydHMubGVmdCA9IGV4cG9ydHMuaXNSaWdodCA9IGV4cG9ydHMuaXNMZWZ0ID0gdm9pZCAwO1xuZXhwb3J0cy5zZXF1ZW5jZUFycmF5ID0gZXhwb3J0cy50cmF2ZXJzZUFycmF5ID0gZXhwb3J0cy50cmF2ZXJzZUFycmF5V2l0aEluZGV4ID0gZXhwb3J0cy5hcFMgPSBleHBvcnRzLmFwU1cgPSBleHBvcnRzLmJpbmQgPSBleHBvcnRzLmJpbmRXID0gZXhwb3J0cy5iaW5kVG8gPSBleHBvcnRzLkRvID0gZXhwb3J0cy5leGlzdHMgPSBleHBvcnRzLmVsZW0gPSBleHBvcnRzLnRvRXJyb3IgPSBleHBvcnRzLmVpdGhlciA9IGV4cG9ydHMuZ2V0VmFsaWRhdGlvbk1vbm9pZCA9IGV4cG9ydHMuTW9uYWRUaHJvdyA9IGV4cG9ydHMuQ2hhaW5SZWMgPSBleHBvcnRzLkV4dGVuZCA9IGV4cG9ydHMuQWx0ID0gZXhwb3J0cy5CaWZ1bmN0b3IgPSBleHBvcnRzLlRyYXZlcnNhYmxlID0gZXhwb3J0cy5Gb2xkYWJsZSA9IGV4cG9ydHMuTW9uYWQgPSBleHBvcnRzLkFwcGxpY2F0aXZlID0gZXhwb3J0cy5GdW5jdG9yID0gZXhwb3J0cy5nZXRWYWxpZGF0aW9uU2VtaWdyb3VwID0gZXhwb3J0cy5nZXRWYWxpZGF0aW9uID0gZXhwb3J0cy5nZXRBbHRWYWxpZGF0aW9uID0gZXhwb3J0cy5nZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb24gPSB2b2lkIDA7XG52YXIgQ2hhaW5SZWNfMSA9IHJlcXVpcmUoXCIuL0NoYWluUmVjXCIpO1xudmFyIGZ1bmN0aW9uXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvblwiKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGd1YXJkc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZWl0aGVyIGlzIGFuIGluc3RhbmNlIG9mIGBMZWZ0YCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKlxuICogQGNhdGVnb3J5IGd1YXJkc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbnZhciBpc0xlZnQgPSBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIG1hLl90YWcgPT09ICdMZWZ0JzsgfTtcbmV4cG9ydHMuaXNMZWZ0ID0gaXNMZWZ0O1xuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZWl0aGVyIGlzIGFuIGluc3RhbmNlIG9mIGBSaWdodGAsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICpcbiAqIEBjYXRlZ29yeSBndWFyZHNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgaXNSaWdodCA9IGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gbWEuX3RhZyA9PT0gJ1JpZ2h0JzsgfTtcbmV4cG9ydHMuaXNSaWdodCA9IGlzUmlnaHQ7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdHJ1Y3RvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgRWl0aGVyYCBob2xkaW5nIGEgYExlZnRgIHZhbHVlLiBUaGlzIHVzdWFsbHkgcmVwcmVzZW50cyBhIGZhaWx1cmUsIGR1ZSB0byB0aGUgcmlnaHQtYmlhcyBvZiB0aGlzXG4gKiBzdHJ1Y3R1cmUuXG4gKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbnZhciBsZWZ0ID0gZnVuY3Rpb24gKGUpIHsgcmV0dXJuICh7IF90YWc6ICdMZWZ0JywgbGVmdDogZSB9KTsgfTtcbmV4cG9ydHMubGVmdCA9IGxlZnQ7XG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlcmAgaG9sZGluZyBhIGBSaWdodGAgdmFsdWUuIFRoaXMgdXN1YWxseSByZXByZXNlbnRzIGEgc3VjY2Vzc2Z1bCB2YWx1ZSBkdWUgdG8gdGhlIHJpZ2h0IGJpYXNcbiAqIG9mIHRoaXMgc3RydWN0dXJlLlxuICpcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgcmlnaHQgPSBmdW5jdGlvbiAoYSkgeyByZXR1cm4gKHsgX3RhZzogJ1JpZ2h0JywgcmlnaHQ6IGEgfSk7IH07XG5leHBvcnRzLnJpZ2h0ID0gcmlnaHQ7XG4vLyBUT0RPOiBtYWtlIGxhenkgaW4gdjNcbi8qKlxuICogVGFrZXMgYSBkZWZhdWx0IGFuZCBhIG51bGxhYmxlIHZhbHVlLCBpZiB0aGUgdmFsdWUgaXMgbm90IG51bGx5LCB0dXJuIGl0IGludG8gYSBgUmlnaHRgLCBpZiB0aGUgdmFsdWUgaXMgbnVsbHkgdXNlXG4gKiB0aGUgcHJvdmlkZWQgZGVmYXVsdCBhcyBhIGBMZWZ0YC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZnJvbU51bGxhYmxlLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBwYXJzZSA9IGZyb21OdWxsYWJsZSgnbnVsbHknKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwocGFyc2UoMSksIHJpZ2h0KDEpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwYXJzZShudWxsKSwgbGVmdCgnbnVsbHknKSlcbiAqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gZnJvbU51bGxhYmxlKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIChhID09IG51bGwgPyBleHBvcnRzLmxlZnQoZSkgOiBleHBvcnRzLnJpZ2h0KGEpKTsgfTtcbn1cbmV4cG9ydHMuZnJvbU51bGxhYmxlID0gZnJvbU51bGxhYmxlO1xuLy8gVE9ETzogYG9uRXJyb3IgPT4gTGF6eTxBPiA9PiBFaXRoZXJgIGluIHYzXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlcmAgZnJvbSBhIGZ1bmN0aW9uIHRoYXQgbWlnaHQgdGhyb3cuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IEVpdGhlciwgbGVmdCwgcmlnaHQsIHRyeUNhdGNoIH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICpcbiAqIGNvbnN0IHVuc2FmZUhlYWQgPSA8QT4oYXM6IEFycmF5PEE+KTogQSA9PiB7XG4gKiAgIGlmIChhcy5sZW5ndGggPiAwKSB7XG4gKiAgICAgcmV0dXJuIGFzWzBdXG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgdGhyb3cgbmV3IEVycm9yKCdlbXB0eSBhcnJheScpXG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBoZWFkID0gPEE+KGFzOiBBcnJheTxBPik6IEVpdGhlcjxFcnJvciwgQT4gPT4ge1xuICogICByZXR1cm4gdHJ5Q2F0Y2goKCkgPT4gdW5zYWZlSGVhZChhcyksIGUgPT4gKGUgaW5zdGFuY2VvZiBFcnJvciA/IGUgOiBuZXcgRXJyb3IoJ3Vua25vd24gZXJyb3InKSkpXG4gKiB9XG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChoZWFkKFtdKSwgbGVmdChuZXcgRXJyb3IoJ2VtcHR5IGFycmF5JykpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChoZWFkKFsxLCAyLCAzXSksIHJpZ2h0KDEpKVxuICpcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiB0cnlDYXRjaChmLCBvbkVycm9yKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMucmlnaHQoZigpKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMubGVmdChvbkVycm9yKGUpKTtcbiAgICB9XG59XG5leHBvcnRzLnRyeUNhdGNoID0gdHJ5Q2F0Y2g7XG4vLyBUT0RPIGN1cnJ5IGluIHYzXG4vKipcbiAqIENvbnZlcnRzIGEgSmF2YVNjcmlwdCBPYmplY3QgTm90YXRpb24gKEpTT04pIHN0cmluZyBpbnRvIGFuIG9iamVjdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgcGFyc2VKU09OLCB0b0Vycm9yLCByaWdodCwgbGVmdCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKHBhcnNlSlNPTigne1wiYVwiOjF9JywgdG9FcnJvciksIHJpZ2h0KHsgYTogMSB9KSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwocGFyc2VKU09OKCd7XCJhXCI6fScsIHRvRXJyb3IpLCBsZWZ0KG5ldyBTeW50YXhFcnJvcignVW5leHBlY3RlZCB0b2tlbiB9IGluIEpTT04gYXQgcG9zaXRpb24gNScpKSlcbiAqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gcGFyc2VKU09OKHMsIG9uRXJyb3IpIHtcbiAgICByZXR1cm4gdHJ5Q2F0Y2goZnVuY3Rpb24gKCkgeyByZXR1cm4gSlNPTi5wYXJzZShzKTsgfSwgb25FcnJvcik7XG59XG5leHBvcnRzLnBhcnNlSlNPTiA9IHBhcnNlSlNPTjtcbi8vIFRPRE8gY3VycnkgaW4gdjNcbi8qKlxuICogQ29udmVydHMgYSBKYXZhU2NyaXB0IHZhbHVlIHRvIGEgSmF2YVNjcmlwdCBPYmplY3QgTm90YXRpb24gKEpTT04pIHN0cmluZy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChFLnN0cmluZ2lmeUpTT04oeyBhOiAxIH0sIEUudG9FcnJvciksIEUucmlnaHQoJ3tcImFcIjoxfScpKVxuICogY29uc3QgY2lyY3VsYXI6IGFueSA9IHsgcmVmOiBudWxsIH1cbiAqIGNpcmN1bGFyLnJlZiA9IGNpcmN1bGFyXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIEUuc3RyaW5naWZ5SlNPTihjaXJjdWxhciwgRS50b0Vycm9yKSxcbiAqICAgICBFLm1hcExlZnQoZSA9PiBlLm1lc3NhZ2UuaW5jbHVkZXMoJ0NvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT04nKSlcbiAqICAgKSxcbiAqICAgRS5sZWZ0KHRydWUpXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ2lmeUpTT04odSwgb25FcnJvcikge1xuICAgIHJldHVybiB0cnlDYXRjaChmdW5jdGlvbiAoKSB7IHJldHVybiBKU09OLnN0cmluZ2lmeSh1KTsgfSwgb25FcnJvcik7XG59XG5leHBvcnRzLnN0cmluZ2lmeUpTT04gPSBzdHJpbmdpZnlKU09OO1xuLyoqXG4gKiBEZXJpdmFibGUgZnJvbSBgTW9uYWRUaHJvd2AuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IGZyb21PcHRpb24sIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0IHsgbm9uZSwgc29tZSB9IGZyb20gJ2ZwLXRzL09wdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIHNvbWUoMSksXG4gKiAgICAgZnJvbU9wdGlvbigoKSA9PiAnZXJyb3InKVxuICogICApLFxuICogICByaWdodCgxKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBub25lLFxuICogICAgIGZyb21PcHRpb24oKCkgPT4gJ2Vycm9yJylcbiAqICAgKSxcbiAqICAgbGVmdCgnZXJyb3InKVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgZnJvbU9wdGlvbiA9IGZ1bmN0aW9uIChvbk5vbmUpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgIHJldHVybiBtYS5fdGFnID09PSAnTm9uZScgPyBleHBvcnRzLmxlZnQob25Ob25lKCkpIDogZXhwb3J0cy5yaWdodChtYS52YWx1ZSk7XG59OyB9O1xuZXhwb3J0cy5mcm9tT3B0aW9uID0gZnJvbU9wdGlvbjtcbi8qKlxuICogRGVyaXZhYmxlIGZyb20gYE1vbmFkVGhyb3dgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBmcm9tUHJlZGljYXRlLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIDEsXG4gKiAgICAgZnJvbVByZWRpY2F0ZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIHJpZ2h0KDEpXG4gKiApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIC0xLFxuICogICAgIGZyb21QcmVkaWNhdGUoXG4gKiAgICAgICAobikgPT4gbiA+IDAsXG4gKiAgICAgICAoKSA9PiAnZXJyb3InXG4gKiAgICAgKVxuICogICApLFxuICogICBsZWZ0KCdlcnJvcicpXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbnZhciBmcm9tUHJlZGljYXRlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSwgb25GYWxzZSkgeyByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIChwcmVkaWNhdGUoYSkgPyBleHBvcnRzLnJpZ2h0KGEpIDogZXhwb3J0cy5sZWZ0KG9uRmFsc2UoYSkpKTsgfTsgfTtcbmV4cG9ydHMuZnJvbVByZWRpY2F0ZSA9IGZyb21QcmVkaWNhdGU7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBkZXN0cnVjdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBUYWtlcyB0d28gZnVuY3Rpb25zIGFuZCBhbiBgRWl0aGVyYCB2YWx1ZSwgaWYgdGhlIHZhbHVlIGlzIGEgYExlZnRgIHRoZSBpbm5lciB2YWx1ZSBpcyBhcHBsaWVkIHRvIHRoZSBmaXJzdCBmdW5jdGlvbixcbiAqIGlmIHRoZSB2YWx1ZSBpcyBhIGBSaWdodGAgdGhlIGlubmVyIHZhbHVlIGlzIGFwcGxpZWQgdG8gdGhlIHNlY29uZCBmdW5jdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZm9sZCwgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogZnVuY3Rpb24gb25MZWZ0KGVycm9yczogQXJyYXk8c3RyaW5nPik6IHN0cmluZyB7XG4gKiAgIHJldHVybiBgRXJyb3JzOiAke2Vycm9ycy5qb2luKCcsICcpfWBcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBvblJpZ2h0KHZhbHVlOiBudW1iZXIpOiBzdHJpbmcge1xuICogICByZXR1cm4gYE9rOiAke3ZhbHVlfWBcbiAqIH1cbiAqXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgcmlnaHQoMSksXG4gKiAgICAgZm9sZChvbkxlZnQsIG9uUmlnaHQpXG4gKiAgICksXG4gKiAgICdPazogMSdcbiAqIClcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBsZWZ0KFsnZXJyb3IgMScsICdlcnJvciAyJ10pLFxuICogICAgIGZvbGQob25MZWZ0LCBvblJpZ2h0KVxuICogICApLFxuICogICAnRXJyb3JzOiBlcnJvciAxLCBlcnJvciAyJ1xuICogKVxuICpcbiAqIEBjYXRlZ29yeSBkZXN0cnVjdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGZvbGQob25MZWZ0LCBvblJpZ2h0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KG1hKSA/IG9uTGVmdChtYS5sZWZ0KSA6IG9uUmlnaHQobWEucmlnaHQpKTsgfTtcbn1cbmV4cG9ydHMuZm9sZCA9IGZvbGQ7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BnZXRPckVsc2VgXSgjZ2V0T3JFbHNlKS5cbiAqXG4gKiBAY2F0ZWdvcnkgZGVzdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjYuMFxuICovXG52YXIgZ2V0T3JFbHNlVyA9IGZ1bmN0aW9uIChvbkxlZnQpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChtYSkgPyBvbkxlZnQobWEubGVmdCkgOiBtYS5yaWdodDtcbn07IH07XG5leHBvcnRzLmdldE9yRWxzZVcgPSBnZXRPckVsc2VXO1xuLyoqXG4gKiBSZXR1cm5zIHRoZSB3cmFwcGVkIHZhbHVlIGlmIGl0J3MgYSBgUmlnaHRgIG9yIGEgZGVmYXVsdCB2YWx1ZSBpZiBpcyBhIGBMZWZ0YC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZ2V0T3JFbHNlLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIHJpZ2h0KDEpLFxuICogICAgIGdldE9yRWxzZSgoKSA9PiAwKVxuICogICApLFxuICogICAxXG4gKiApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIGxlZnQoJ2Vycm9yJyksXG4gKiAgICAgZ2V0T3JFbHNlKCgpID0+IDApXG4gKiAgICksXG4gKiAgIDBcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgZGVzdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmdldE9yRWxzZSA9IGV4cG9ydHMuZ2V0T3JFbHNlVztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbWJpbmF0b3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuOS4wXG4gKi9cbmZ1bmN0aW9uIGZyb21OdWxsYWJsZUsoZSkge1xuICAgIHZhciBmcm9tID0gZnJvbU51bGxhYmxlKGUpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYVtfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmcm9tKGYuYXBwbHkodm9pZCAwLCBhKSk7XG4gICAgfTsgfTtcbn1cbmV4cG9ydHMuZnJvbU51bGxhYmxlSyA9IGZyb21OdWxsYWJsZUs7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuOS4wXG4gKi9cbmZ1bmN0aW9uIGNoYWluTnVsbGFibGVLKGUpIHtcbiAgICB2YXIgZnJvbSA9IGZyb21OdWxsYWJsZUsoZSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBleHBvcnRzLmNoYWluKGZyb20oZikpOyB9O1xufVxuZXhwb3J0cy5jaGFpbk51bGxhYmxlSyA9IGNoYWluTnVsbGFibGVLO1xuLyoqXG4gKiBSZXR1cm5zIGEgYFJpZ2h0YCBpZiBpcyBhIGBMZWZ0YCAoYW5kIHZpY2UgdmVyc2EpLlxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIHN3YXAobWEpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5pc0xlZnQobWEpID8gZXhwb3J0cy5yaWdodChtYS5sZWZ0KSA6IGV4cG9ydHMubGVmdChtYS5yaWdodCk7XG59XG5leHBvcnRzLnN3YXAgPSBzd2FwO1xuLyoqXG4gKiBVc2VmdWwgZm9yIHJlY292ZXJpbmcgZnJvbSBlcnJvcnMuXG4gKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gb3JFbHNlKG9uTGVmdCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIChleHBvcnRzLmlzTGVmdChtYSkgPyBvbkxlZnQobWEubGVmdCkgOiBtYSk7IH07XG59XG5leHBvcnRzLm9yRWxzZSA9IG9yRWxzZTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGZpbHRlck9yRWxzZWBdKCNmaWx0ZXJPckVsc2UpLlxuICpcbiAqIEBzaW5jZSAyLjkuMFxuICovXG52YXIgZmlsdGVyT3JFbHNlVyA9IGZ1bmN0aW9uIChwcmVkaWNhdGUsIG9uRmFsc2UpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jaGFpblcoZnVuY3Rpb24gKGEpIHsgcmV0dXJuIChwcmVkaWNhdGUoYSkgPyBleHBvcnRzLnJpZ2h0KGEpIDogZXhwb3J0cy5sZWZ0KG9uRmFsc2UoYSkpKTsgfSk7XG59O1xuZXhwb3J0cy5maWx0ZXJPckVsc2VXID0gZmlsdGVyT3JFbHNlVztcbi8qKlxuICogRGVyaXZhYmxlIGZyb20gYE1vbmFkVGhyb3dgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBmaWx0ZXJPckVsc2UsIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgcmlnaHQoMSksXG4gKiAgICAgZmlsdGVyT3JFbHNlKFxuICogICAgICAgKG4pID0+IG4gPiAwLFxuICogICAgICAgKCkgPT4gJ2Vycm9yJ1xuICogICAgIClcbiAqICAgKSxcbiAqICAgcmlnaHQoMSlcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgcmlnaHQoLTEpLFxuICogICAgIGZpbHRlck9yRWxzZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIGxlZnQoJ2Vycm9yJylcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgbGVmdCgnYScpLFxuICogICAgIGZpbHRlck9yRWxzZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIGxlZnQoJ2EnKVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuZmlsdGVyT3JFbHNlID0gZXhwb3J0cy5maWx0ZXJPckVsc2VXO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gbm9uLXBpcGVhYmxlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIG1hcF8gPSBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uXzEucGlwZShmYSwgZXhwb3J0cy5tYXAoZikpOyB9O1xudmFyIGFwXyA9IGZ1bmN0aW9uIChmYWIsIGZhKSB7IHJldHVybiBmdW5jdGlvbl8xLnBpcGUoZmFiLCBleHBvcnRzLmFwKGZhKSk7IH07XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIGNoYWluXyA9IGZ1bmN0aW9uIChtYSwgZikgeyByZXR1cm4gZnVuY3Rpb25fMS5waXBlKG1hLCBleHBvcnRzLmNoYWluKGYpKTsgfTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgcmVkdWNlXyA9IGZ1bmN0aW9uIChmYSwgYiwgZikgeyByZXR1cm4gZnVuY3Rpb25fMS5waXBlKGZhLCBleHBvcnRzLnJlZHVjZShiLCBmKSk7IH07XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIGZvbGRNYXBfID0gZnVuY3Rpb24gKE0pIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSwgZikge1xuICAgIHZhciBmb2xkTWFwTSA9IGV4cG9ydHMuZm9sZE1hcChNKTtcbiAgICByZXR1cm4gZnVuY3Rpb25fMS5waXBlKGZhLCBmb2xkTWFwTShmKSk7XG59OyB9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciByZWR1Y2VSaWdodF8gPSBmdW5jdGlvbiAoZmEsIGIsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uXzEucGlwZShmYSwgZXhwb3J0cy5yZWR1Y2VSaWdodChiLCBmKSk7IH07XG52YXIgdHJhdmVyc2VfID0gZnVuY3Rpb24gKEYpIHtcbiAgICB2YXIgdHJhdmVyc2VGID0gZXhwb3J0cy50cmF2ZXJzZShGKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhLCBmKSB7IHJldHVybiBmdW5jdGlvbl8xLnBpcGUodGEsIHRyYXZlcnNlRihmKSk7IH07XG59O1xudmFyIGJpbWFwXyA9IGZ1bmN0aW9uIChmYSwgZiwgZykgeyByZXR1cm4gZnVuY3Rpb25fMS5waXBlKGZhLCBleHBvcnRzLmJpbWFwKGYsIGcpKTsgfTtcbnZhciBtYXBMZWZ0XyA9IGZ1bmN0aW9uIChmYSwgZikgeyByZXR1cm4gZnVuY3Rpb25fMS5waXBlKGZhLCBleHBvcnRzLm1hcExlZnQoZikpOyB9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciBhbHRfID0gZnVuY3Rpb24gKGZhLCB0aGF0KSB7IHJldHVybiBmdW5jdGlvbl8xLnBpcGUoZmEsIGV4cG9ydHMuYWx0KHRoYXQpKTsgfTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgZXh0ZW5kXyA9IGZ1bmN0aW9uICh3YSwgZikgeyByZXR1cm4gZnVuY3Rpb25fMS5waXBlKHdhLCBleHBvcnRzLmV4dGVuZChmKSk7IH07XG52YXIgY2hhaW5SZWNfID0gZnVuY3Rpb24gKGEsIGYpIHtcbiAgICByZXR1cm4gQ2hhaW5SZWNfMS50YWlsUmVjKGYoYSksIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChlKSA/IGV4cG9ydHMucmlnaHQoZXhwb3J0cy5sZWZ0KGUubGVmdCkpIDogZXhwb3J0cy5pc0xlZnQoZS5yaWdodCkgPyBleHBvcnRzLmxlZnQoZihlLnJpZ2h0LmxlZnQpKSA6IGV4cG9ydHMucmlnaHQoZXhwb3J0cy5yaWdodChlLnJpZ2h0LnJpZ2h0KSk7XG4gICAgfSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcGlwZWFibGVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIGBtYXBgIGNhbiBiZSB1c2VkIHRvIHR1cm4gZnVuY3Rpb25zIGAoYTogQSkgPT4gQmAgaW50byBmdW5jdGlvbnMgYChmYTogRjxBPikgPT4gRjxCPmAgd2hvc2UgYXJndW1lbnQgYW5kIHJldHVybiB0eXBlc1xuICogdXNlIHRoZSB0eXBlIGNvbnN0cnVjdG9yIGBGYCB0byByZXByZXNlbnQgc29tZSBjb21wdXRhdGlvbmFsIGNvbnRleHQuXG4gKlxuICogQGNhdGVnb3J5IEZ1bmN0b3JcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgbWFwID0gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChmYSkgPyBmYSA6IGV4cG9ydHMucmlnaHQoZihmYS5yaWdodCkpO1xufTsgfTtcbmV4cG9ydHMubWFwID0gbWFwO1xuLyoqXG4gKiBNYXAgYSBwYWlyIG9mIGZ1bmN0aW9ucyBvdmVyIHRoZSB0d28gdHlwZSBhcmd1bWVudHMgb2YgdGhlIGJpZnVuY3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgQmlmdW5jdG9yXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xudmFyIGJpbWFwID0gZnVuY3Rpb24gKGYsIGcpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KGZhKSA/IGV4cG9ydHMubGVmdChmKGZhLmxlZnQpKSA6IGV4cG9ydHMucmlnaHQoZyhmYS5yaWdodCkpKTsgfTsgfTtcbmV4cG9ydHMuYmltYXAgPSBiaW1hcDtcbi8qKlxuICogTWFwIGEgZnVuY3Rpb24gb3ZlciB0aGUgZmlyc3QgdHlwZSBhcmd1bWVudCBvZiBhIGJpZnVuY3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgQmlmdW5jdG9yXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xudmFyIG1hcExlZnQgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KGZhKSA/IGV4cG9ydHMubGVmdChmKGZhLmxlZnQpKSA6IGZhO1xufTsgfTtcbmV4cG9ydHMubWFwTGVmdCA9IG1hcExlZnQ7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BhcGBdKCNhcCkuXG4gKlxuICogQGNhdGVnb3J5IEFwcGx5XG4gKiBAc2luY2UgMi44LjBcbiAqL1xudmFyIGFwVyA9IGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gZnVuY3Rpb24gKGZhYikge1xuICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChmYWIpID8gZmFiIDogZXhwb3J0cy5pc0xlZnQoZmEpID8gZmEgOiBleHBvcnRzLnJpZ2h0KGZhYi5yaWdodChmYS5yaWdodCkpO1xufTsgfTtcbmV4cG9ydHMuYXBXID0gYXBXO1xuLyoqXG4gKiBBcHBseSBhIGZ1bmN0aW9uIHRvIGFuIGFyZ3VtZW50IHVuZGVyIGEgdHlwZSBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgQXBwbHlcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmFwID0gZXhwb3J0cy5hcFc7XG4vKipcbiAqIENvbWJpbmUgdHdvIGVmZmVjdGZ1bCBhY3Rpb25zLCBrZWVwaW5nIG9ubHkgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QuXG4gKlxuICogRGVyaXZhYmxlIGZyb20gYEFwcGx5YC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgYXBGaXJzdCA9IGZ1bmN0aW9uIChmYikge1xuICAgIHJldHVybiBmdW5jdGlvbl8xLmZsb3coZXhwb3J0cy5tYXAoZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGE7IH07IH0pLCBleHBvcnRzLmFwKGZiKSk7XG59O1xuZXhwb3J0cy5hcEZpcnN0ID0gYXBGaXJzdDtcbi8qKlxuICogQ29tYmluZSB0d28gZWZmZWN0ZnVsIGFjdGlvbnMsIGtlZXBpbmcgb25seSB0aGUgcmVzdWx0IG9mIHRoZSBzZWNvbmQuXG4gKlxuICogRGVyaXZhYmxlIGZyb20gYEFwcGx5YC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgYXBTZWNvbmQgPSBmdW5jdGlvbiAoZmIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25fMS5mbG93KGV4cG9ydHMubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBiOyB9OyB9KSwgZXhwb3J0cy5hcChmYikpO1xufTtcbmV4cG9ydHMuYXBTZWNvbmQgPSBhcFNlY29uZDtcbi8qKlxuICogV3JhcCBhIHZhbHVlIGludG8gdGhlIHR5cGUgY29uc3RydWN0b3IuXG4gKlxuICogRXF1aXZhbGVudCB0byBbYHJpZ2h0YF0oI3JpZ2h0KS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChFLm9mKCdhJyksIEUucmlnaHQoJ2EnKSlcbiAqXG4gKiBAY2F0ZWdvcnkgQXBwbGljYXRpdmVcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnRzLm9mID0gZXhwb3J0cy5yaWdodDtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGNoYWluYF0oI2NoYWluKS5cbiAqXG4gKiBAY2F0ZWdvcnkgTW9uYWRcbiAqIEBzaW5jZSAyLjYuMFxuICovXG52YXIgY2hhaW5XID0gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChtYSkgPyBtYSA6IGYobWEucmlnaHQpO1xufTsgfTtcbmV4cG9ydHMuY2hhaW5XID0gY2hhaW5XO1xuLyoqXG4gKiBDb21wb3NlcyBjb21wdXRhdGlvbnMgaW4gc2VxdWVuY2UsIHVzaW5nIHRoZSByZXR1cm4gdmFsdWUgb2Ygb25lIGNvbXB1dGF0aW9uIHRvIGRldGVybWluZSB0aGUgbmV4dCBjb21wdXRhdGlvbi5cbiAqXG4gKiBAY2F0ZWdvcnkgTW9uYWRcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmNoYWluID0gZXhwb3J0cy5jaGFpblc7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BjaGFpbkZpcnN0YF0oI2NoYWluRmlyc3QpXG4gKlxuICogRGVyaXZhYmxlIGZyb20gYE1vbmFkYC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjguMFxuICovXG52YXIgY2hhaW5GaXJzdFcgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKG1hKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uXzEucGlwZShtYSwgZXhwb3J0cy5jaGFpblcoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uXzEucGlwZShmKGEpLCBleHBvcnRzLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBhOyB9KSk7XG4gICAgfSkpO1xufTsgfTtcbmV4cG9ydHMuY2hhaW5GaXJzdFcgPSBjaGFpbkZpcnN0Vztcbi8qKlxuICogQ29tcG9zZXMgY29tcHV0YXRpb25zIGluIHNlcXVlbmNlLCB1c2luZyB0aGUgcmV0dXJuIHZhbHVlIG9mIG9uZSBjb21wdXRhdGlvbiB0byBkZXRlcm1pbmUgdGhlIG5leHQgY29tcHV0YXRpb24gYW5kXG4gKiBrZWVwaW5nIG9ubHkgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QuXG4gKlxuICogRGVyaXZhYmxlIGZyb20gYE1vbmFkYC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmNoYWluRmlyc3QgPSBleHBvcnRzLmNoYWluRmlyc3RXO1xuLyoqXG4gKiBUaGUgYGZsYXR0ZW5gIGZ1bmN0aW9uIGlzIHRoZSBjb252ZW50aW9uYWwgbW9uYWQgam9pbiBvcGVyYXRvci4gSXQgaXMgdXNlZCB0byByZW1vdmUgb25lIGxldmVsIG9mIG1vbmFkaWMgc3RydWN0dXJlLCBwcm9qZWN0aW5nIGl0cyBib3VuZCBhcmd1bWVudCBpbnRvIHRoZSBvdXRlciBsZXZlbC5cbiAqXG4gKiBEZXJpdmFibGUgZnJvbSBgTW9uYWRgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKEUuZmxhdHRlbihFLnJpZ2h0KEUucmlnaHQoJ2EnKSkpLCBFLnJpZ2h0KCdhJykpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKEUuZmxhdHRlbihFLnJpZ2h0KEUubGVmdCgnZScpKSksIEUubGVmdCgnZScpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChFLmZsYXR0ZW4oRS5sZWZ0KCdlJykpLCBFLmxlZnQoJ2UnKSlcbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmZsYXR0ZW4gPSBcbi8qI19fUFVSRV9fKi9cbmV4cG9ydHMuY2hhaW4oZnVuY3Rpb25fMS5pZGVudGl0eSk7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BhbHRgXSgjYWx0KS5cbiAqXG4gKiBAY2F0ZWdvcnkgQWx0XG4gKiBAc2luY2UgMi45LjBcbiAqL1xudmFyIGFsdFcgPSBmdW5jdGlvbiAodGhhdCkgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiAoZXhwb3J0cy5pc0xlZnQoZmEpID8gdGhhdCgpIDogZmEpOyB9OyB9O1xuZXhwb3J0cy5hbHRXID0gYWx0Vztcbi8qKlxuICogSWRlbnRpZmllcyBhbiBhc3NvY2lhdGl2ZSBvcGVyYXRpb24gb24gYSB0eXBlIGNvbnN0cnVjdG9yLiBJdCBpcyBzaW1pbGFyIHRvIGBTZW1pZ3JvdXBgLCBleGNlcHQgdGhhdCBpdCBhcHBsaWVzIHRvXG4gKiB0eXBlcyBvZiBraW5kIGAqIC0+ICpgLlxuICpcbiAqIEBjYXRlZ29yeSBBbHRcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmFsdCA9IGV4cG9ydHMuYWx0Vztcbi8qKlxuICogQGNhdGVnb3J5IEV4dGVuZFxuICogQHNpbmNlIDIuMC4wXG4gKi9cbnZhciBleHRlbmQgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKHdhKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KHdhKSA/IHdhIDogZXhwb3J0cy5yaWdodChmKHdhKSk7XG59OyB9O1xuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG4vKipcbiAqIERlcml2YWJsZSBmcm9tIGBFeHRlbmRgLlxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuZHVwbGljYXRlID0gXG4vKiNfX1BVUkVfXyovXG5leHBvcnRzLmV4dGVuZChmdW5jdGlvbl8xLmlkZW50aXR5KTtcbi8qKlxuICogTGVmdC1hc3NvY2lhdGl2ZSBmb2xkIG9mIGEgc3RydWN0dXJlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBzdGFydFdpdGggPSAncHJlZml4J1xuICogY29uc3QgY29uY2F0ID0gKGE6IHN0cmluZywgYjogc3RyaW5nKSA9PiBgJHthfToke2J9YFxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodCgnYScpLCBFLnJlZHVjZShzdGFydFdpdGgsIGNvbmNhdCkpLFxuICogICAncHJlZml4OmEnLFxuICogKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5sZWZ0KCdlJyksIEUucmVkdWNlKHN0YXJ0V2l0aCwgY29uY2F0KSksXG4gKiAgICdwcmVmaXgnLFxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBGb2xkYWJsZVxuICogQHNpbmNlIDIuMC4wXG4gKi9cbnZhciByZWR1Y2UgPSBmdW5jdGlvbiAoYiwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KGZhKSA/IGIgOiBmKGIsIGZhLnJpZ2h0KTtcbn07IH07XG5leHBvcnRzLnJlZHVjZSA9IHJlZHVjZTtcbi8qKlxuICogTWFwIGVhY2ggZWxlbWVudCBvZiB0aGUgc3RydWN0dXJlIHRvIGEgbW9ub2lkLCBhbmQgY29tYmluZSB0aGUgcmVzdWx0cy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJztcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgbW9ub2lkU3RyaW5nIH0gZnJvbSAnZnAtdHMvTW9ub2lkJ1xuICpcbiAqIGNvbnN0IHllbGwgPSAoYTogc3RyaW5nKSA9PiBgJHthfSFgXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KCdhJyksIEUuZm9sZE1hcChtb25vaWRTdHJpbmcpKHllbGwpKSxcbiAqICAgJ2EhJyxcbiAqIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUubGVmdCgnZScpLCBFLmZvbGRNYXAobW9ub2lkU3RyaW5nKSh5ZWxsKSksXG4gKiAgIG1vbm9pZFN0cmluZy5lbXB0eSxcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgRm9sZGFibGVcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgZm9sZE1hcCA9IGZ1bmN0aW9uIChNKSB7IHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KGZhKSA/IE0uZW1wdHkgOiBmKGZhLnJpZ2h0KTtcbn07IH07IH07XG5leHBvcnRzLmZvbGRNYXAgPSBmb2xkTWFwO1xuLyoqXG4gKiBSaWdodC1hc3NvY2lhdGl2ZSBmb2xkIG9mIGEgc3RydWN0dXJlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBzdGFydFdpdGggPSAncG9zdGZpeCdcbiAqIGNvbnN0IGNvbmNhdCA9IChhOiBzdHJpbmcsIGI6IHN0cmluZykgPT4gYCR7YX06JHtifWBcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUucmlnaHQoJ2EnKSwgRS5yZWR1Y2VSaWdodChzdGFydFdpdGgsIGNvbmNhdCkpLFxuICogICAnYTpwb3N0Zml4JyxcbiAqIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUubGVmdCgnZScpLCBFLnJlZHVjZVJpZ2h0KHN0YXJ0V2l0aCwgY29uY2F0KSksXG4gKiAgICdwb3N0Zml4JyxcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgRm9sZGFibGVcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgcmVkdWNlUmlnaHQgPSBmdW5jdGlvbiAoYiwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KGZhKSA/IGIgOiBmKGZhLnJpZ2h0LCBiKTtcbn07IH07XG5leHBvcnRzLnJlZHVjZVJpZ2h0ID0gcmVkdWNlUmlnaHQ7XG4vKipcbiAqIE1hcCBlYWNoIGVsZW1lbnQgb2YgYSBzdHJ1Y3R1cmUgdG8gYW4gYWN0aW9uLCBldmFsdWF0ZSB0aGVzZSBhY3Rpb25zIGZyb20gbGVmdCB0byByaWdodCwgYW5kIGNvbGxlY3QgdGhlIHJlc3VsdHMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIEEgZnJvbSAnZnAtdHMvQXJyYXknXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCAqIGFzIE8gZnJvbSAnZnAtdHMvT3B0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodChbJ2EnXSksIEUudHJhdmVyc2UoTy5vcHRpb24pKEEuaGVhZCkpLFxuICogICBPLnNvbWUoRS5yaWdodCgnYScpKSxcbiAqICApXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KFtdKSwgRS50cmF2ZXJzZShPLm9wdGlvbikoQS5oZWFkKSksXG4gKiAgIE8ubm9uZSxcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgVHJhdmVyc2FibGVcbiAqIEBzaW5jZSAyLjYuM1xuICovXG52YXIgdHJhdmVyc2UgPSBmdW5jdGlvbiAoRikgeyByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uICh0YSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KHRhKSA/IEYub2YoZXhwb3J0cy5sZWZ0KHRhLmxlZnQpKSA6IEYubWFwKGYodGEucmlnaHQpLCBleHBvcnRzLnJpZ2h0KSk7IH07IH07IH07XG5leHBvcnRzLnRyYXZlcnNlID0gdHJhdmVyc2U7XG4vKipcbiAqIEV2YWx1YXRlIGVhY2ggbW9uYWRpYyBhY3Rpb24gaW4gdGhlIHN0cnVjdHVyZSBmcm9tIGxlZnQgdG8gcmlnaHQsIGFuZCBjb2xsZWN0IHRoZSByZXN1bHRzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCAqIGFzIE8gZnJvbSAnZnAtdHMvT3B0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodChPLnNvbWUoJ2EnKSksIEUuc2VxdWVuY2UoTy5vcHRpb24pKSxcbiAqICAgTy5zb21lKEUucmlnaHQoJ2EnKSksXG4gKiAgKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodChPLm5vbmUpLCBFLnNlcXVlbmNlKE8ub3B0aW9uKSksXG4gKiAgIE8ubm9uZVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBUcmF2ZXJzYWJsZVxuICogQHNpbmNlIDIuNi4zXG4gKi9cbnZhciBzZXF1ZW5jZSA9IGZ1bmN0aW9uIChGKSB7IHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5pc0xlZnQobWEpID8gRi5vZihleHBvcnRzLmxlZnQobWEubGVmdCkpIDogRi5tYXAobWEucmlnaHQsIGV4cG9ydHMucmlnaHQpO1xufTsgfTtcbmV4cG9ydHMuc2VxdWVuY2UgPSBzZXF1ZW5jZTtcbi8qKlxuICogQGNhdGVnb3J5IE1vbmFkVGhyb3dcbiAqIEBzaW5jZSAyLjYuM1xuICovXG5leHBvcnRzLnRocm93RXJyb3IgPSBleHBvcnRzLmxlZnQ7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBpbnN0YW5jZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuVVJJID0gJ0VpdGhlcic7XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBnZXRTaG93KFNFLCBTQSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHNob3c6IGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KG1hKSA/IFwibGVmdChcIiArIFNFLnNob3cobWEubGVmdCkgKyBcIilcIiA6IFwicmlnaHQoXCIgKyBTQS5zaG93KG1hLnJpZ2h0KSArIFwiKVwiKTsgfVxuICAgIH07XG59XG5leHBvcnRzLmdldFNob3cgPSBnZXRTaG93O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gZ2V0RXEoRUwsIEVBKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZXF1YWxzOiBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgcmV0dXJuIHggPT09IHkgfHwgKGV4cG9ydHMuaXNMZWZ0KHgpID8gZXhwb3J0cy5pc0xlZnQoeSkgJiYgRUwuZXF1YWxzKHgubGVmdCwgeS5sZWZ0KSA6IGV4cG9ydHMuaXNSaWdodCh5KSAmJiBFQS5lcXVhbHMoeC5yaWdodCwgeS5yaWdodCkpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0RXEgPSBnZXRFcTtcbi8qKlxuICogU2VtaWdyb3VwIHJldHVybmluZyB0aGUgbGVmdC1tb3N0IG5vbi1gTGVmdGAgdmFsdWUuIElmIGJvdGggb3BlcmFuZHMgYXJlIGBSaWdodGBzIHRoZW4gdGhlIGlubmVyIHZhbHVlcyBhcmVcbiAqIGNvbmNhdGVuYXRlZCB1c2luZyB0aGUgcHJvdmlkZWQgYFNlbWlncm91cGBcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZ2V0U2VtaWdyb3VwLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHNlbWlncm91cFN1bSB9IGZyb20gJ2ZwLXRzL1NlbWlncm91cCdcbiAqXG4gKiBjb25zdCBTID0gZ2V0U2VtaWdyb3VwPHN0cmluZywgbnVtYmVyPihzZW1pZ3JvdXBTdW0pXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMuY29uY2F0KGxlZnQoJ2EnKSwgbGVmdCgnYicpKSwgbGVmdCgnYScpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChsZWZ0KCdhJyksIHJpZ2h0KDIpKSwgcmlnaHQoMikpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMuY29uY2F0KHJpZ2h0KDEpLCBsZWZ0KCdiJykpLCByaWdodCgxKSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoUy5jb25jYXQocmlnaHQoMSksIHJpZ2h0KDIpKSwgcmlnaHQoMykpXG4gKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGdldFNlbWlncm91cChTKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29uY2F0OiBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KHkpID8geCA6IGV4cG9ydHMuaXNMZWZ0KHgpID8geSA6IGV4cG9ydHMucmlnaHQoUy5jb25jYXQoeC5yaWdodCwgeS5yaWdodCkpKTsgfVxuICAgIH07XG59XG5leHBvcnRzLmdldFNlbWlncm91cCA9IGdldFNlbWlncm91cDtcbi8qKlxuICogU2VtaWdyb3VwIHJldHVybmluZyB0aGUgbGVmdC1tb3N0IGBMZWZ0YCB2YWx1ZS4gSWYgYm90aCBvcGVyYW5kcyBhcmUgYFJpZ2h0YHMgdGhlbiB0aGUgaW5uZXIgdmFsdWVzXG4gKiBhcmUgY29uY2F0ZW5hdGVkIHVzaW5nIHRoZSBwcm92aWRlZCBgU2VtaWdyb3VwYFxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBnZXRBcHBseVNlbWlncm91cCwgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBzZW1pZ3JvdXBTdW0gfSBmcm9tICdmcC10cy9TZW1pZ3JvdXAnXG4gKlxuICogY29uc3QgUyA9IGdldEFwcGx5U2VtaWdyb3VwPHN0cmluZywgbnVtYmVyPihzZW1pZ3JvdXBTdW0pXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMuY29uY2F0KGxlZnQoJ2EnKSwgbGVmdCgnYicpKSwgbGVmdCgnYScpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChsZWZ0KCdhJyksIHJpZ2h0KDIpKSwgbGVmdCgnYScpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChyaWdodCgxKSwgbGVmdCgnYicpKSwgbGVmdCgnYicpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChyaWdodCgxKSwgcmlnaHQoMikpLCByaWdodCgzKSlcbiAqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gZ2V0QXBwbHlTZW1pZ3JvdXAoUykge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKHgsIHkpIHsgcmV0dXJuIChleHBvcnRzLmlzTGVmdCh4KSA/IHggOiBleHBvcnRzLmlzTGVmdCh5KSA/IHkgOiBleHBvcnRzLnJpZ2h0KFMuY29uY2F0KHgucmlnaHQsIHkucmlnaHQpKSk7IH1cbiAgICB9O1xufVxuZXhwb3J0cy5nZXRBcHBseVNlbWlncm91cCA9IGdldEFwcGx5U2VtaWdyb3VwO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gZ2V0QXBwbHlNb25vaWQoTSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbmNhdDogZ2V0QXBwbHlTZW1pZ3JvdXAoTSkuY29uY2F0LFxuICAgICAgICBlbXB0eTogZXhwb3J0cy5yaWdodChNLmVtcHR5KVxuICAgIH07XG59XG5leHBvcnRzLmdldEFwcGx5TW9ub2lkID0gZ2V0QXBwbHlNb25vaWQ7XG4vKipcbiAqIEJ1aWxkcyBhIGBGaWx0ZXJhYmxlYCBpbnN0YW5jZSBmb3IgYEVpdGhlcmAgZ2l2ZW4gYE1vbm9pZGAgZm9yIHRoZSBsZWZ0IHNpZGVcbiAqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMy4wLjBcbiAqL1xuZnVuY3Rpb24gZ2V0RmlsdGVyYWJsZShNKSB7XG4gICAgdmFyIGVtcHR5ID0gZXhwb3J0cy5sZWZ0KE0uZW1wdHkpO1xuICAgIHZhciBjb21wYWN0ID0gZnVuY3Rpb24gKG1hKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChtYSkgPyBtYSA6IG1hLnJpZ2h0Ll90YWcgPT09ICdOb25lJyA/IGVtcHR5IDogZXhwb3J0cy5yaWdodChtYS5yaWdodC52YWx1ZSk7XG4gICAgfTtcbiAgICB2YXIgc2VwYXJhdGUgPSBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KG1hKVxuICAgICAgICAgICAgPyB7IGxlZnQ6IG1hLCByaWdodDogbWEgfVxuICAgICAgICAgICAgOiBleHBvcnRzLmlzTGVmdChtYS5yaWdodClcbiAgICAgICAgICAgICAgICA/IHsgbGVmdDogZXhwb3J0cy5yaWdodChtYS5yaWdodC5sZWZ0KSwgcmlnaHQ6IGVtcHR5IH1cbiAgICAgICAgICAgICAgICA6IHsgbGVmdDogZW1wdHksIHJpZ2h0OiBleHBvcnRzLnJpZ2h0KG1hLnJpZ2h0LnJpZ2h0KSB9O1xuICAgIH07XG4gICAgdmFyIHBhcnRpdGlvbk1hcCA9IGZ1bmN0aW9uIChtYSwgZikge1xuICAgICAgICBpZiAoZXhwb3J0cy5pc0xlZnQobWEpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBsZWZ0OiBtYSwgcmlnaHQ6IG1hIH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGUgPSBmKG1hLnJpZ2h0KTtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KGUpID8geyBsZWZ0OiBleHBvcnRzLnJpZ2h0KGUubGVmdCksIHJpZ2h0OiBlbXB0eSB9IDogeyBsZWZ0OiBlbXB0eSwgcmlnaHQ6IGV4cG9ydHMucmlnaHQoZS5yaWdodCkgfTtcbiAgICB9O1xuICAgIHZhciBwYXJ0aXRpb24gPSBmdW5jdGlvbiAobWEsIHApIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KG1hKVxuICAgICAgICAgICAgPyB7IGxlZnQ6IG1hLCByaWdodDogbWEgfVxuICAgICAgICAgICAgOiBwKG1hLnJpZ2h0KVxuICAgICAgICAgICAgICAgID8geyBsZWZ0OiBlbXB0eSwgcmlnaHQ6IGV4cG9ydHMucmlnaHQobWEucmlnaHQpIH1cbiAgICAgICAgICAgICAgICA6IHsgbGVmdDogZXhwb3J0cy5yaWdodChtYS5yaWdodCksIHJpZ2h0OiBlbXB0eSB9O1xuICAgIH07XG4gICAgdmFyIGZpbHRlck1hcCA9IGZ1bmN0aW9uIChtYSwgZikge1xuICAgICAgICBpZiAoZXhwb3J0cy5pc0xlZnQobWEpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9iID0gZihtYS5yaWdodCk7XG4gICAgICAgIHJldHVybiBvYi5fdGFnID09PSAnTm9uZScgPyBlbXB0eSA6IGV4cG9ydHMucmlnaHQob2IudmFsdWUpO1xuICAgIH07XG4gICAgdmFyIGZpbHRlciA9IGZ1bmN0aW9uIChtYSwgcHJlZGljYXRlKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChtYSkgPyBtYSA6IHByZWRpY2F0ZShtYS5yaWdodCkgPyBtYSA6IGVtcHR5O1xuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICAgICAgX0U6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFwOiBtYXBfLFxuICAgICAgICBjb21wYWN0OiBjb21wYWN0LFxuICAgICAgICBzZXBhcmF0ZTogc2VwYXJhdGUsXG4gICAgICAgIGZpbHRlcjogZmlsdGVyLFxuICAgICAgICBmaWx0ZXJNYXA6IGZpbHRlck1hcCxcbiAgICAgICAgcGFydGl0aW9uOiBwYXJ0aXRpb24sXG4gICAgICAgIHBhcnRpdGlvbk1hcDogcGFydGl0aW9uTWFwXG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0RmlsdGVyYWJsZSA9IGdldEZpbHRlcmFibGU7XG4vKipcbiAqIEJ1aWxkcyBgV2l0aGVyYWJsZWAgaW5zdGFuY2UgZm9yIGBFaXRoZXJgIGdpdmVuIGBNb25vaWRgIGZvciB0aGUgbGVmdCBzaWRlXG4gKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGdldFdpdGhlcmFibGUoTSkge1xuICAgIHZhciBGXyA9IGdldEZpbHRlcmFibGUoTSk7XG4gICAgdmFyIHdpdGhlciA9IGZ1bmN0aW9uIChGKSB7XG4gICAgICAgIHZhciB0cmF2ZXJzZUYgPSB0cmF2ZXJzZV8oRik7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobWEsIGYpIHsgcmV0dXJuIEYubWFwKHRyYXZlcnNlRihtYSwgZiksIEZfLmNvbXBhY3QpOyB9O1xuICAgIH07XG4gICAgdmFyIHdpbHQgPSBmdW5jdGlvbiAoRikge1xuICAgICAgICB2YXIgdHJhdmVyc2VGID0gdHJhdmVyc2VfKEYpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1hLCBmKSB7IHJldHVybiBGLm1hcCh0cmF2ZXJzZUYobWEsIGYpLCBGXy5zZXBhcmF0ZSk7IH07XG4gICAgfTtcbiAgICByZXR1cm4ge1xuICAgICAgICBVUkk6IGV4cG9ydHMuVVJJLFxuICAgICAgICBfRTogdW5kZWZpbmVkLFxuICAgICAgICBtYXA6IG1hcF8sXG4gICAgICAgIGNvbXBhY3Q6IEZfLmNvbXBhY3QsXG4gICAgICAgIHNlcGFyYXRlOiBGXy5zZXBhcmF0ZSxcbiAgICAgICAgZmlsdGVyOiBGXy5maWx0ZXIsXG4gICAgICAgIGZpbHRlck1hcDogRl8uZmlsdGVyTWFwLFxuICAgICAgICBwYXJ0aXRpb246IEZfLnBhcnRpdGlvbixcbiAgICAgICAgcGFydGl0aW9uTWFwOiBGXy5wYXJ0aXRpb25NYXAsXG4gICAgICAgIHRyYXZlcnNlOiB0cmF2ZXJzZV8sXG4gICAgICAgIHNlcXVlbmNlOiBleHBvcnRzLnNlcXVlbmNlLFxuICAgICAgICByZWR1Y2U6IHJlZHVjZV8sXG4gICAgICAgIGZvbGRNYXA6IGZvbGRNYXBfLFxuICAgICAgICByZWR1Y2VSaWdodDogcmVkdWNlUmlnaHRfLFxuICAgICAgICB3aXRoZXI6IHdpdGhlcixcbiAgICAgICAgd2lsdDogd2lsdFxuICAgIH07XG59XG5leHBvcnRzLmdldFdpdGhlcmFibGUgPSBnZXRXaXRoZXJhYmxlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZnVuY3Rpb24gZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uKFNFKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICAgICAgX0U6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFwOiBtYXBfLFxuICAgICAgICBhcDogZnVuY3Rpb24gKGZhYiwgZmEpIHtcbiAgICAgICAgICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChmYWIpXG4gICAgICAgICAgICAgICAgPyBleHBvcnRzLmlzTGVmdChmYSlcbiAgICAgICAgICAgICAgICAgICAgPyBleHBvcnRzLmxlZnQoU0UuY29uY2F0KGZhYi5sZWZ0LCBmYS5sZWZ0KSlcbiAgICAgICAgICAgICAgICAgICAgOiBmYWJcbiAgICAgICAgICAgICAgICA6IGV4cG9ydHMuaXNMZWZ0KGZhKVxuICAgICAgICAgICAgICAgICAgICA/IGZhXG4gICAgICAgICAgICAgICAgICAgIDogZXhwb3J0cy5yaWdodChmYWIucmlnaHQoZmEucmlnaHQpKTtcbiAgICAgICAgfSxcbiAgICAgICAgb2Y6IGV4cG9ydHMub2ZcbiAgICB9O1xufVxuZXhwb3J0cy5nZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb24gPSBnZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb247XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5mdW5jdGlvbiBnZXRBbHRWYWxpZGF0aW9uKFNFKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICAgICAgX0U6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFwOiBtYXBfLFxuICAgICAgICBhbHQ6IGZ1bmN0aW9uIChtZSwgdGhhdCkge1xuICAgICAgICAgICAgaWYgKGV4cG9ydHMuaXNSaWdodChtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZWEgPSB0aGF0KCk7XG4gICAgICAgICAgICByZXR1cm4gZXhwb3J0cy5pc0xlZnQoZWEpID8gZXhwb3J0cy5sZWZ0KFNFLmNvbmNhdChtZS5sZWZ0LCBlYS5sZWZ0KSkgOiBlYTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmdldEFsdFZhbGlkYXRpb24gPSBnZXRBbHRWYWxpZGF0aW9uO1xuLy8gVE9ETzogcmVtb3ZlIGluIHYzXG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBnZXRWYWxpZGF0aW9uKFNFKSB7XG4gICAgdmFyIGFwcGxpY2F0aXZlVmFsaWRhdGlvbiA9IGdldEFwcGxpY2F0aXZlVmFsaWRhdGlvbihTRSk7XG4gICAgdmFyIGFsdFZhbGlkYXRpb24gPSBnZXRBbHRWYWxpZGF0aW9uKFNFKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBVUkk6IGV4cG9ydHMuVVJJLFxuICAgICAgICBfRTogdW5kZWZpbmVkLFxuICAgICAgICBtYXA6IG1hcF8sXG4gICAgICAgIG9mOiBleHBvcnRzLm9mLFxuICAgICAgICBjaGFpbjogY2hhaW5fLFxuICAgICAgICBiaW1hcDogYmltYXBfLFxuICAgICAgICBtYXBMZWZ0OiBtYXBMZWZ0XyxcbiAgICAgICAgcmVkdWNlOiByZWR1Y2VfLFxuICAgICAgICBmb2xkTWFwOiBmb2xkTWFwXyxcbiAgICAgICAgcmVkdWNlUmlnaHQ6IHJlZHVjZVJpZ2h0XyxcbiAgICAgICAgZXh0ZW5kOiBleHRlbmRfLFxuICAgICAgICB0cmF2ZXJzZTogdHJhdmVyc2VfLFxuICAgICAgICBzZXF1ZW5jZTogZXhwb3J0cy5zZXF1ZW5jZSxcbiAgICAgICAgY2hhaW5SZWM6IGNoYWluUmVjXyxcbiAgICAgICAgdGhyb3dFcnJvcjogZXhwb3J0cy50aHJvd0Vycm9yLFxuICAgICAgICBhcDogYXBwbGljYXRpdmVWYWxpZGF0aW9uLmFwLFxuICAgICAgICBhbHQ6IGFsdFZhbGlkYXRpb24uYWx0XG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0VmFsaWRhdGlvbiA9IGdldFZhbGlkYXRpb247XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBnZXRWYWxpZGF0aW9uU2VtaWdyb3VwKFNFLCBTQSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgIHJldHVybiBleHBvcnRzLmlzTGVmdCh4KSA/IChleHBvcnRzLmlzTGVmdCh5KSA/IGV4cG9ydHMubGVmdChTRS5jb25jYXQoeC5sZWZ0LCB5LmxlZnQpKSA6IHgpIDogZXhwb3J0cy5pc0xlZnQoeSkgPyB5IDogZXhwb3J0cy5yaWdodChTQS5jb25jYXQoeC5yaWdodCwgeS5yaWdodCkpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0VmFsaWRhdGlvblNlbWlncm91cCA9IGdldFZhbGlkYXRpb25TZW1pZ3JvdXA7XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnRzLkZ1bmN0b3IgPSB7XG4gICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICBtYXA6IG1hcF9cbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnRzLkFwcGxpY2F0aXZlID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIGFwOiBhcF8sXG4gICAgb2Y6IGV4cG9ydHMub2Zcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnRzLk1vbmFkID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIGFwOiBhcF8sXG4gICAgb2Y6IGV4cG9ydHMub2YsXG4gICAgY2hhaW46IGNoYWluX1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuRm9sZGFibGUgPSB7XG4gICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICByZWR1Y2U6IHJlZHVjZV8sXG4gICAgZm9sZE1hcDogZm9sZE1hcF8sXG4gICAgcmVkdWNlUmlnaHQ6IHJlZHVjZVJpZ2h0X1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuVHJhdmVyc2FibGUgPSB7XG4gICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICBtYXA6IG1hcF8sXG4gICAgcmVkdWNlOiByZWR1Y2VfLFxuICAgIGZvbGRNYXA6IGZvbGRNYXBfLFxuICAgIHJlZHVjZVJpZ2h0OiByZWR1Y2VSaWdodF8sXG4gICAgdHJhdmVyc2U6IHRyYXZlcnNlXyxcbiAgICBzZXF1ZW5jZTogZXhwb3J0cy5zZXF1ZW5jZVxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuQmlmdW5jdG9yID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgYmltYXA6IGJpbWFwXyxcbiAgICBtYXBMZWZ0OiBtYXBMZWZ0X1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuQWx0ID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIGFsdDogYWx0X1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuRXh0ZW5kID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIGV4dGVuZDogZXh0ZW5kX1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuQ2hhaW5SZWMgPSB7XG4gICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICBtYXA6IG1hcF8sXG4gICAgYXA6IGFwXyxcbiAgICBjaGFpbjogY2hhaW5fLFxuICAgIGNoYWluUmVjOiBjaGFpblJlY19cbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnRzLk1vbmFkVGhyb3cgPSB7XG4gICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICBtYXA6IG1hcF8sXG4gICAgYXA6IGFwXyxcbiAgICBvZjogZXhwb3J0cy5vZixcbiAgICBjaGFpbjogY2hhaW5fLFxuICAgIHRocm93RXJyb3I6IGV4cG9ydHMudGhyb3dFcnJvclxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGdldFZhbGlkYXRpb25Nb25vaWQoU0UsIFNBKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29uY2F0OiBnZXRWYWxpZGF0aW9uU2VtaWdyb3VwKFNFLCBTQSkuY29uY2F0LFxuICAgICAgICBlbXB0eTogZXhwb3J0cy5yaWdodChTQS5lbXB0eSlcbiAgICB9O1xufVxuZXhwb3J0cy5nZXRWYWxpZGF0aW9uTW9ub2lkID0gZ2V0VmFsaWRhdGlvbk1vbm9pZDtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuZWl0aGVyID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIG9mOiBleHBvcnRzLm9mLFxuICAgIGFwOiBhcF8sXG4gICAgY2hhaW46IGNoYWluXyxcbiAgICByZWR1Y2U6IHJlZHVjZV8sXG4gICAgZm9sZE1hcDogZm9sZE1hcF8sXG4gICAgcmVkdWNlUmlnaHQ6IHJlZHVjZVJpZ2h0XyxcbiAgICB0cmF2ZXJzZTogdHJhdmVyc2VfLFxuICAgIHNlcXVlbmNlOiBleHBvcnRzLnNlcXVlbmNlLFxuICAgIGJpbWFwOiBiaW1hcF8sXG4gICAgbWFwTGVmdDogbWFwTGVmdF8sXG4gICAgYWx0OiBhbHRfLFxuICAgIGV4dGVuZDogZXh0ZW5kXyxcbiAgICBjaGFpblJlYzogY2hhaW5SZWNfLFxuICAgIHRocm93RXJyb3I6IGV4cG9ydHMudGhyb3dFcnJvclxufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIERlZmF1bHQgdmFsdWUgZm9yIHRoZSBgb25FcnJvcmAgYXJndW1lbnQgb2YgYHRyeUNhdGNoYFxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiB0b0Vycm9yKGUpIHtcbiAgICByZXR1cm4gZSBpbnN0YW5jZW9mIEVycm9yID8gZSA6IG5ldyBFcnJvcihTdHJpbmcoZSkpO1xufVxuZXhwb3J0cy50b0Vycm9yID0gdG9FcnJvcjtcbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGVsZW0oRSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSwgbWEpIHsgcmV0dXJuIChleHBvcnRzLmlzTGVmdChtYSkgPyBmYWxzZSA6IEUuZXF1YWxzKGEsIG1hLnJpZ2h0KSk7IH07XG59XG5leHBvcnRzLmVsZW0gPSBlbGVtO1xuLyoqXG4gKiBSZXR1cm5zIGBmYWxzZWAgaWYgYExlZnRgIG9yIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgYXBwbGljYXRpb24gb2YgdGhlIGdpdmVuIHByZWRpY2F0ZSB0byB0aGUgYFJpZ2h0YCB2YWx1ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZXhpc3RzLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBndDIgPSBleGlzdHMoKG46IG51bWJlcikgPT4gbiA+IDIpXG4gKlxuICogYXNzZXJ0LnN0cmljdEVxdWFsKGd0MihsZWZ0KCdhJykpLCBmYWxzZSlcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChndDIocmlnaHQoMSkpLCBmYWxzZSlcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChndDIocmlnaHQoMykpLCB0cnVlKVxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBleGlzdHMocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KG1hKSA/IGZhbHNlIDogcHJlZGljYXRlKG1hLnJpZ2h0KSk7IH07XG59XG5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGRvIG5vdGF0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnRzLkRvID0gXG4vKiNfX1BVUkVfXyovXG5leHBvcnRzLm9mKHt9KTtcbi8qKlxuICogQHNpbmNlIDIuOC4wXG4gKi9cbnZhciBiaW5kVG8gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiBleHBvcnRzLm1hcChmdW5jdGlvbl8xLmJpbmRUb18obmFtZSkpO1xufTtcbmV4cG9ydHMuYmluZFRvID0gYmluZFRvO1xuLyoqXG4gKiBAc2luY2UgMi44LjBcbiAqL1xudmFyIGJpbmRXID0gZnVuY3Rpb24gKG5hbWUsIGYpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jaGFpblcoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uXzEucGlwZShmKGEpLCBleHBvcnRzLm1hcChmdW5jdGlvbiAoYikgeyByZXR1cm4gZnVuY3Rpb25fMS5iaW5kXyhhLCBuYW1lLCBiKTsgfSkpO1xuICAgIH0pO1xufTtcbmV4cG9ydHMuYmluZFcgPSBiaW5kVztcbi8qKlxuICogQHNpbmNlIDIuOC4wXG4gKi9cbmV4cG9ydHMuYmluZCA9IGV4cG9ydHMuYmluZFc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBwaXBlYWJsZSBzZXF1ZW5jZSBTXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBzaW5jZSAyLjguMFxuICovXG52YXIgYXBTVyA9IGZ1bmN0aW9uIChuYW1lLCBmYikge1xuICAgIHJldHVybiBmdW5jdGlvbl8xLmZsb3coZXhwb3J0cy5tYXAoZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBmdW5jdGlvbl8xLmJpbmRfKGEsIG5hbWUsIGIpOyB9OyB9KSwgZXhwb3J0cy5hcFcoZmIpKTtcbn07XG5leHBvcnRzLmFwU1cgPSBhcFNXO1xuLyoqXG4gKiBAc2luY2UgMi44LjBcbiAqL1xuZXhwb3J0cy5hcFMgPSBleHBvcnRzLmFwU1c7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBhcnJheSB1dGlsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKlxuICogQHNpbmNlIDIuOS4wXG4gKi9cbnZhciB0cmF2ZXJzZUFycmF5V2l0aEluZGV4ID0gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChhcnIpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHJlYWRvbmx5LWFycmF5XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlID0gZihpLCBhcnJbaV0pO1xuICAgICAgICBpZiAoZS5fdGFnID09PSAnTGVmdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKGUucmlnaHQpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwb3J0cy5yaWdodChyZXN1bHQpO1xufTsgfTtcbmV4cG9ydHMudHJhdmVyc2VBcnJheVdpdGhJbmRleCA9IHRyYXZlcnNlQXJyYXlXaXRoSW5kZXg7XG4vKipcbiAqIG1hcCBhbiBhcnJheSB1c2luZyBwcm92aWRlZCBmdW5jdGlvbiB0byBFaXRoZXIgdGhlbiB0cmFuc2Zvcm0gdG8gRWl0aGVyIG9mIHRoZSBhcnJheVxuICogdGhpcyBmdW5jdGlvbiBoYXZlIHRoZSBzYW1lIGJlaGF2aW9yIG9mIGBBLnRyYXZlcnNlKEUuZWl0aGVyKWAgYnV0IGl0J3Mgb3B0aW1pemVkIGFuZCBwZXJmb3JtIGJldHRlclxuICpcbiAqIEBleGFtcGxlXG4gKlxuICpcbiAqIGltcG9ydCB7IHRyYXZlcnNlQXJyYXksIGxlZnQsIHJpZ2h0LCBmcm9tUHJlZGljYXRlIH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgQSBmcm9tICdmcC10cy9BcnJheSdcbiAqXG4gKiBjb25zdCBhcnIgPSBBLnJhbmdlKDAsIDEwKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBhcnIsXG4gKiAgICAgdHJhdmVyc2VBcnJheSgoeCkgPT4gcmlnaHQoeCkpXG4gKiAgICksXG4gKiAgIHJpZ2h0KGFycilcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgYXJyLFxuICogICAgIHRyYXZlcnNlQXJyYXkoXG4gKiAgICAgICBmcm9tUHJlZGljYXRlKFxuICogICAgICAgICAoeCkgPT4geCA+IDUsXG4gKiAgICAgICAgICgpID0+ICdhJ1xuICogICAgICAgKVxuICogICAgIClcbiAqICAgKSxcbiAqICAgbGVmdCgnYScpXG4gKiApXG4gKiBAc2luY2UgMi45LjBcbiAqL1xudmFyIHRyYXZlcnNlQXJyYXkgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZXhwb3J0cy50cmF2ZXJzZUFycmF5V2l0aEluZGV4KGZ1bmN0aW9uIChfLCBhKSB7IHJldHVybiBmKGEpOyB9KTsgfTtcbmV4cG9ydHMudHJhdmVyc2VBcnJheSA9IHRyYXZlcnNlQXJyYXk7XG4vKipcbiAqIGNvbnZlcnQgYW4gYXJyYXkgb2YgZWl0aGVyIHRvIGFuIGVpdGhlciBvZiBhcnJheVxuICogdGhpcyBmdW5jdGlvbiBoYXZlIHRoZSBzYW1lIGJlaGF2aW9yIG9mIGBBLnNlcXVlbmNlKEUuZWl0aGVyKWAgYnV0IGl0J3Mgb3B0aW1pemVkIGFuZCBwZXJmb3JtIGJldHRlclxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogaW1wb3J0IHsgc2VxdWVuY2VBcnJheSwgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBBIGZyb20gJ2ZwLXRzL0FycmF5J1xuICpcbiAqIGNvbnN0IGFyciA9IEEucmFuZ2UoMCwgMTApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKHBpcGUoYXJyLCBBLm1hcChyaWdodCksIHNlcXVlbmNlQXJyYXkpLCByaWdodChhcnIpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwaXBlKGFyciwgQS5tYXAocmlnaHQpLCBBLmNvbnMobGVmdCgnRXJyb3InKSksIHNlcXVlbmNlQXJyYXkpLCBsZWZ0KCdFcnJvcicpKVxuICpcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnRzLnNlcXVlbmNlQXJyYXkgPSBcbi8qI19fUFVSRV9fKi9cbmV4cG9ydHMudHJhdmVyc2VBcnJheShmdW5jdGlvbl8xLmlkZW50aXR5KTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuaXNJbnRlZ2VyID0gbnVtID0+IHtcbiAgaWYgKHR5cGVvZiBudW0gPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIobnVtKTtcbiAgfVxuICBpZiAodHlwZW9mIG51bSA9PT0gJ3N0cmluZycgJiYgbnVtLnRyaW0oKSAhPT0gJycpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihOdW1iZXIobnVtKSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBGaW5kIGEgbm9kZSBvZiB0aGUgZ2l2ZW4gdHlwZVxuICovXG5cbmV4cG9ydHMuZmluZCA9IChub2RlLCB0eXBlKSA9PiBub2RlLm5vZGVzLmZpbmQobm9kZSA9PiBub2RlLnR5cGUgPT09IHR5cGUpO1xuXG4vKipcbiAqIEZpbmQgYSBub2RlIG9mIHRoZSBnaXZlbiB0eXBlXG4gKi9cblxuZXhwb3J0cy5leGNlZWRzTGltaXQgPSAobWluLCBtYXgsIHN0ZXAgPSAxLCBsaW1pdCkgPT4ge1xuICBpZiAobGltaXQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gIGlmICghZXhwb3J0cy5pc0ludGVnZXIobWluKSB8fCAhZXhwb3J0cy5pc0ludGVnZXIobWF4KSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gKChOdW1iZXIobWF4KSAtIE51bWJlcihtaW4pKSAvIE51bWJlcihzdGVwKSkgPj0gbGltaXQ7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gbm9kZSB3aXRoICdcXFxcJyBiZWZvcmUgbm9kZS52YWx1ZVxuICovXG5cbmV4cG9ydHMuZXNjYXBlTm9kZSA9IChibG9jaywgbiA9IDAsIHR5cGUpID0+IHtcbiAgbGV0IG5vZGUgPSBibG9jay5ub2Rlc1tuXTtcbiAgaWYgKCFub2RlKSByZXR1cm47XG5cbiAgaWYgKCh0eXBlICYmIG5vZGUudHlwZSA9PT0gdHlwZSkgfHwgbm9kZS50eXBlID09PSAnb3BlbicgfHwgbm9kZS50eXBlID09PSAnY2xvc2UnKSB7XG4gICAgaWYgKG5vZGUuZXNjYXBlZCAhPT0gdHJ1ZSkge1xuICAgICAgbm9kZS52YWx1ZSA9ICdcXFxcJyArIG5vZGUudmFsdWU7XG4gICAgICBub2RlLmVzY2FwZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGJyYWNlIG5vZGUgc2hvdWxkIGJlIGVuY2xvc2VkIGluIGxpdGVyYWwgYnJhY2VzXG4gKi9cblxuZXhwb3J0cy5lbmNsb3NlQnJhY2UgPSBub2RlID0+IHtcbiAgaWYgKG5vZGUudHlwZSAhPT0gJ2JyYWNlJykgcmV0dXJuIGZhbHNlO1xuICBpZiAoKG5vZGUuY29tbWFzID4+IDAgKyBub2RlLnJhbmdlcyA+PiAwKSA9PT0gMCkge1xuICAgIG5vZGUuaW52YWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBicmFjZSBub2RlIGlzIGludmFsaWQuXG4gKi9cblxuZXhwb3J0cy5pc0ludmFsaWRCcmFjZSA9IGJsb2NrID0+IHtcbiAgaWYgKGJsb2NrLnR5cGUgIT09ICdicmFjZScpIHJldHVybiBmYWxzZTtcbiAgaWYgKGJsb2NrLmludmFsaWQgPT09IHRydWUgfHwgYmxvY2suZG9sbGFyKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKChibG9jay5jb21tYXMgPj4gMCArIGJsb2NrLnJhbmdlcyA+PiAwKSA9PT0gMCkge1xuICAgIGJsb2NrLmludmFsaWQgPSB0cnVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChibG9jay5vcGVuICE9PSB0cnVlIHx8IGJsb2NrLmNsb3NlICE9PSB0cnVlKSB7XG4gICAgYmxvY2suaW52YWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBub2RlIGlzIGFuIG9wZW4gb3IgY2xvc2Ugbm9kZVxuICovXG5cbmV4cG9ydHMuaXNPcGVuT3JDbG9zZSA9IG5vZGUgPT4ge1xuICBpZiAobm9kZS50eXBlID09PSAnb3BlbicgfHwgbm9kZS50eXBlID09PSAnY2xvc2UnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIG5vZGUub3BlbiA9PT0gdHJ1ZSB8fCBub2RlLmNsb3NlID09PSB0cnVlO1xufTtcblxuLyoqXG4gKiBSZWR1Y2UgYW4gYXJyYXkgb2YgdGV4dCBub2Rlcy5cbiAqL1xuXG5leHBvcnRzLnJlZHVjZSA9IG5vZGVzID0+IG5vZGVzLnJlZHVjZSgoYWNjLCBub2RlKSA9PiB7XG4gIGlmIChub2RlLnR5cGUgPT09ICd0ZXh0JykgYWNjLnB1c2gobm9kZS52YWx1ZSk7XG4gIGlmIChub2RlLnR5cGUgPT09ICdyYW5nZScpIG5vZGUudHlwZSA9ICd0ZXh0JztcbiAgcmV0dXJuIGFjYztcbn0sIFtdKTtcblxuLyoqXG4gKiBGbGF0dGVuIGFuIGFycmF5XG4gKi9cblxuZXhwb3J0cy5mbGF0dGVuID0gKC4uLmFyZ3MpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGNvbnN0IGZsYXQgPSBhcnIgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZWxlID0gYXJyW2ldO1xuICAgICAgQXJyYXkuaXNBcnJheShlbGUpID8gZmxhdChlbGUsIHJlc3VsdCkgOiBlbGUgIT09IHZvaWQgMCAmJiByZXN1bHQucHVzaChlbGUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBmbGF0KGFyZ3MpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChhc3QsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgc3RyaW5naWZ5ID0gKG5vZGUsIHBhcmVudCA9IHt9KSA9PiB7XG4gICAgbGV0IGludmFsaWRCbG9jayA9IG9wdGlvbnMuZXNjYXBlSW52YWxpZCAmJiB1dGlscy5pc0ludmFsaWRCcmFjZShwYXJlbnQpO1xuICAgIGxldCBpbnZhbGlkTm9kZSA9IG5vZGUuaW52YWxpZCA9PT0gdHJ1ZSAmJiBvcHRpb25zLmVzY2FwZUludmFsaWQgPT09IHRydWU7XG4gICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgaWYgKG5vZGUudmFsdWUpIHtcbiAgICAgIGlmICgoaW52YWxpZEJsb2NrIHx8IGludmFsaWROb2RlKSAmJiB1dGlscy5pc09wZW5PckNsb3NlKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiAnXFxcXCcgKyBub2RlLnZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUudmFsdWUpIHtcbiAgICAgIHJldHVybiBub2RlLnZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVzKSB7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBub2RlLm5vZGVzKSB7XG4gICAgICAgIG91dHB1dCArPSBzdHJpbmdpZnkoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIHJldHVybiBzdHJpbmdpZnkoYXN0KTtcbn07XG5cbiIsICIvKiFcbiAqIGlzLW51bWJlciA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtbnVtYmVyPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBKb24gU2NobGlua2VydC5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obnVtKSB7XG4gIGlmICh0eXBlb2YgbnVtID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBudW0gLSBudW0gPT09IDA7XG4gIH1cbiAgaWYgKHR5cGVvZiBudW0gPT09ICdzdHJpbmcnICYmIG51bS50cmltKCkgIT09ICcnKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZSA/IE51bWJlci5pc0Zpbml0ZSgrbnVtKSA6IGlzRmluaXRlKCtudW0pO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG4iLCAiLyohXG4gKiB0by1yZWdleC1yYW5nZSA8aHR0cHM6Ly9naXRodWIuY29tL21pY3JvbWF0Y2gvdG8tcmVnZXgtcmFuZ2U+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNOdW1iZXIgPSByZXF1aXJlKCdpcy1udW1iZXInKTtcblxuY29uc3QgdG9SZWdleFJhbmdlID0gKG1pbiwgbWF4LCBvcHRpb25zKSA9PiB7XG4gIGlmIChpc051bWJlcihtaW4pID09PSBmYWxzZSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RvUmVnZXhSYW5nZTogZXhwZWN0ZWQgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGJlIGEgbnVtYmVyJyk7XG4gIH1cblxuICBpZiAobWF4ID09PSB2b2lkIDAgfHwgbWluID09PSBtYXgpIHtcbiAgICByZXR1cm4gU3RyaW5nKG1pbik7XG4gIH1cblxuICBpZiAoaXNOdW1iZXIobWF4KSA9PT0gZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0b1JlZ2V4UmFuZ2U6IGV4cGVjdGVkIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gYmUgYSBudW1iZXIuJyk7XG4gIH1cblxuICBsZXQgb3B0cyA9IHsgcmVsYXhaZXJvczogdHJ1ZSwgLi4ub3B0aW9ucyB9O1xuICBpZiAodHlwZW9mIG9wdHMuc3RyaWN0WmVyb3MgPT09ICdib29sZWFuJykge1xuICAgIG9wdHMucmVsYXhaZXJvcyA9IG9wdHMuc3RyaWN0WmVyb3MgPT09IGZhbHNlO1xuICB9XG5cbiAgbGV0IHJlbGF4ID0gU3RyaW5nKG9wdHMucmVsYXhaZXJvcyk7XG4gIGxldCBzaG9ydGhhbmQgPSBTdHJpbmcob3B0cy5zaG9ydGhhbmQpO1xuICBsZXQgY2FwdHVyZSA9IFN0cmluZyhvcHRzLmNhcHR1cmUpO1xuICBsZXQgd3JhcCA9IFN0cmluZyhvcHRzLndyYXApO1xuICBsZXQgY2FjaGVLZXkgPSBtaW4gKyAnOicgKyBtYXggKyAnPScgKyByZWxheCArIHNob3J0aGFuZCArIGNhcHR1cmUgKyB3cmFwO1xuXG4gIGlmICh0b1JlZ2V4UmFuZ2UuY2FjaGUuaGFzT3duUHJvcGVydHkoY2FjaGVLZXkpKSB7XG4gICAgcmV0dXJuIHRvUmVnZXhSYW5nZS5jYWNoZVtjYWNoZUtleV0ucmVzdWx0O1xuICB9XG5cbiAgbGV0IGEgPSBNYXRoLm1pbihtaW4sIG1heCk7XG4gIGxldCBiID0gTWF0aC5tYXgobWluLCBtYXgpO1xuXG4gIGlmIChNYXRoLmFicyhhIC0gYikgPT09IDEpIHtcbiAgICBsZXQgcmVzdWx0ID0gbWluICsgJ3wnICsgbWF4O1xuICAgIGlmIChvcHRzLmNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBgKCR7cmVzdWx0fSlgO1xuICAgIH1cbiAgICBpZiAob3B0cy53cmFwID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcmV0dXJuIGAoPzoke3Jlc3VsdH0pYDtcbiAgfVxuXG4gIGxldCBpc1BhZGRlZCA9IGhhc1BhZGRpbmcobWluKSB8fCBoYXNQYWRkaW5nKG1heCk7XG4gIGxldCBzdGF0ZSA9IHsgbWluLCBtYXgsIGEsIGIgfTtcbiAgbGV0IHBvc2l0aXZlcyA9IFtdO1xuICBsZXQgbmVnYXRpdmVzID0gW107XG5cbiAgaWYgKGlzUGFkZGVkKSB7XG4gICAgc3RhdGUuaXNQYWRkZWQgPSBpc1BhZGRlZDtcbiAgICBzdGF0ZS5tYXhMZW4gPSBTdHJpbmcoc3RhdGUubWF4KS5sZW5ndGg7XG4gIH1cblxuICBpZiAoYSA8IDApIHtcbiAgICBsZXQgbmV3TWluID0gYiA8IDAgPyBNYXRoLmFicyhiKSA6IDE7XG4gICAgbmVnYXRpdmVzID0gc3BsaXRUb1BhdHRlcm5zKG5ld01pbiwgTWF0aC5hYnMoYSksIHN0YXRlLCBvcHRzKTtcbiAgICBhID0gc3RhdGUuYSA9IDA7XG4gIH1cblxuICBpZiAoYiA+PSAwKSB7XG4gICAgcG9zaXRpdmVzID0gc3BsaXRUb1BhdHRlcm5zKGEsIGIsIHN0YXRlLCBvcHRzKTtcbiAgfVxuXG4gIHN0YXRlLm5lZ2F0aXZlcyA9IG5lZ2F0aXZlcztcbiAgc3RhdGUucG9zaXRpdmVzID0gcG9zaXRpdmVzO1xuICBzdGF0ZS5yZXN1bHQgPSBjb2xsYXRlUGF0dGVybnMobmVnYXRpdmVzLCBwb3NpdGl2ZXMsIG9wdHMpO1xuXG4gIGlmIChvcHRzLmNhcHR1cmUgPT09IHRydWUpIHtcbiAgICBzdGF0ZS5yZXN1bHQgPSBgKCR7c3RhdGUucmVzdWx0fSlgO1xuICB9IGVsc2UgaWYgKG9wdHMud3JhcCAhPT0gZmFsc2UgJiYgKHBvc2l0aXZlcy5sZW5ndGggKyBuZWdhdGl2ZXMubGVuZ3RoKSA+IDEpIHtcbiAgICBzdGF0ZS5yZXN1bHQgPSBgKD86JHtzdGF0ZS5yZXN1bHR9KWA7XG4gIH1cblxuICB0b1JlZ2V4UmFuZ2UuY2FjaGVbY2FjaGVLZXldID0gc3RhdGU7XG4gIHJldHVybiBzdGF0ZS5yZXN1bHQ7XG59O1xuXG5mdW5jdGlvbiBjb2xsYXRlUGF0dGVybnMobmVnLCBwb3MsIG9wdGlvbnMpIHtcbiAgbGV0IG9ubHlOZWdhdGl2ZSA9IGZpbHRlclBhdHRlcm5zKG5lZywgcG9zLCAnLScsIGZhbHNlLCBvcHRpb25zKSB8fCBbXTtcbiAgbGV0IG9ubHlQb3NpdGl2ZSA9IGZpbHRlclBhdHRlcm5zKHBvcywgbmVnLCAnJywgZmFsc2UsIG9wdGlvbnMpIHx8IFtdO1xuICBsZXQgaW50ZXJzZWN0ZWQgPSBmaWx0ZXJQYXR0ZXJucyhuZWcsIHBvcywgJy0/JywgdHJ1ZSwgb3B0aW9ucykgfHwgW107XG4gIGxldCBzdWJwYXR0ZXJucyA9IG9ubHlOZWdhdGl2ZS5jb25jYXQoaW50ZXJzZWN0ZWQpLmNvbmNhdChvbmx5UG9zaXRpdmUpO1xuICByZXR1cm4gc3VicGF0dGVybnMuam9pbignfCcpO1xufVxuXG5mdW5jdGlvbiBzcGxpdFRvUmFuZ2VzKG1pbiwgbWF4KSB7XG4gIGxldCBuaW5lcyA9IDE7XG4gIGxldCB6ZXJvcyA9IDE7XG5cbiAgbGV0IHN0b3AgPSBjb3VudE5pbmVzKG1pbiwgbmluZXMpO1xuICBsZXQgc3RvcHMgPSBuZXcgU2V0KFttYXhdKTtcblxuICB3aGlsZSAobWluIDw9IHN0b3AgJiYgc3RvcCA8PSBtYXgpIHtcbiAgICBzdG9wcy5hZGQoc3RvcCk7XG4gICAgbmluZXMgKz0gMTtcbiAgICBzdG9wID0gY291bnROaW5lcyhtaW4sIG5pbmVzKTtcbiAgfVxuXG4gIHN0b3AgPSBjb3VudFplcm9zKG1heCArIDEsIHplcm9zKSAtIDE7XG5cbiAgd2hpbGUgKG1pbiA8IHN0b3AgJiYgc3RvcCA8PSBtYXgpIHtcbiAgICBzdG9wcy5hZGQoc3RvcCk7XG4gICAgemVyb3MgKz0gMTtcbiAgICBzdG9wID0gY291bnRaZXJvcyhtYXggKyAxLCB6ZXJvcykgLSAxO1xuICB9XG5cbiAgc3RvcHMgPSBbLi4uc3RvcHNdO1xuICBzdG9wcy5zb3J0KGNvbXBhcmUpO1xuICByZXR1cm4gc3RvcHM7XG59XG5cbi8qKlxuICogQ29udmVydCBhIHJhbmdlIHRvIGEgcmVnZXggcGF0dGVyblxuICogQHBhcmFtIHtOdW1iZXJ9IGBzdGFydGBcbiAqIEBwYXJhbSB7TnVtYmVyfSBgc3RvcGBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiByYW5nZVRvUGF0dGVybihzdGFydCwgc3RvcCwgb3B0aW9ucykge1xuICBpZiAoc3RhcnQgPT09IHN0b3ApIHtcbiAgICByZXR1cm4geyBwYXR0ZXJuOiBzdGFydCwgY291bnQ6IFtdLCBkaWdpdHM6IDAgfTtcbiAgfVxuXG4gIGxldCB6aXBwZWQgPSB6aXAoc3RhcnQsIHN0b3ApO1xuICBsZXQgZGlnaXRzID0gemlwcGVkLmxlbmd0aDtcbiAgbGV0IHBhdHRlcm4gPSAnJztcbiAgbGV0IGNvdW50ID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZ2l0czsgaSsrKSB7XG4gICAgbGV0IFtzdGFydERpZ2l0LCBzdG9wRGlnaXRdID0gemlwcGVkW2ldO1xuXG4gICAgaWYgKHN0YXJ0RGlnaXQgPT09IHN0b3BEaWdpdCkge1xuICAgICAgcGF0dGVybiArPSBzdGFydERpZ2l0O1xuXG4gICAgfSBlbHNlIGlmIChzdGFydERpZ2l0ICE9PSAnMCcgfHwgc3RvcERpZ2l0ICE9PSAnOScpIHtcbiAgICAgIHBhdHRlcm4gKz0gdG9DaGFyYWN0ZXJDbGFzcyhzdGFydERpZ2l0LCBzdG9wRGlnaXQsIG9wdGlvbnMpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvdW50KSB7XG4gICAgcGF0dGVybiArPSBvcHRpb25zLnNob3J0aGFuZCA9PT0gdHJ1ZSA/ICdcXFxcZCcgOiAnWzAtOV0nO1xuICB9XG5cbiAgcmV0dXJuIHsgcGF0dGVybiwgY291bnQ6IFtjb3VudF0sIGRpZ2l0cyB9O1xufVxuXG5mdW5jdGlvbiBzcGxpdFRvUGF0dGVybnMobWluLCBtYXgsIHRvaywgb3B0aW9ucykge1xuICBsZXQgcmFuZ2VzID0gc3BsaXRUb1JhbmdlcyhtaW4sIG1heCk7XG4gIGxldCB0b2tlbnMgPSBbXTtcbiAgbGV0IHN0YXJ0ID0gbWluO1xuICBsZXQgcHJldjtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBtYXggPSByYW5nZXNbaV07XG4gICAgbGV0IG9iaiA9IHJhbmdlVG9QYXR0ZXJuKFN0cmluZyhzdGFydCksIFN0cmluZyhtYXgpLCBvcHRpb25zKTtcbiAgICBsZXQgemVyb3MgPSAnJztcblxuICAgIGlmICghdG9rLmlzUGFkZGVkICYmIHByZXYgJiYgcHJldi5wYXR0ZXJuID09PSBvYmoucGF0dGVybikge1xuICAgICAgaWYgKHByZXYuY291bnQubGVuZ3RoID4gMSkge1xuICAgICAgICBwcmV2LmNvdW50LnBvcCgpO1xuICAgICAgfVxuXG4gICAgICBwcmV2LmNvdW50LnB1c2gob2JqLmNvdW50WzBdKTtcbiAgICAgIHByZXYuc3RyaW5nID0gcHJldi5wYXR0ZXJuICsgdG9RdWFudGlmaWVyKHByZXYuY291bnQpO1xuICAgICAgc3RhcnQgPSBtYXggKyAxO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHRvay5pc1BhZGRlZCkge1xuICAgICAgemVyb3MgPSBwYWRaZXJvcyhtYXgsIHRvaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgb2JqLnN0cmluZyA9IHplcm9zICsgb2JqLnBhdHRlcm4gKyB0b1F1YW50aWZpZXIob2JqLmNvdW50KTtcbiAgICB0b2tlbnMucHVzaChvYmopO1xuICAgIHN0YXJ0ID0gbWF4ICsgMTtcbiAgICBwcmV2ID0gb2JqO1xuICB9XG5cbiAgcmV0dXJuIHRva2Vucztcbn1cblxuZnVuY3Rpb24gZmlsdGVyUGF0dGVybnMoYXJyLCBjb21wYXJpc29uLCBwcmVmaXgsIGludGVyc2VjdGlvbiwgb3B0aW9ucykge1xuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgZm9yIChsZXQgZWxlIG9mIGFycikge1xuICAgIGxldCB7IHN0cmluZyB9ID0gZWxlO1xuXG4gICAgLy8gb25seSBwdXNoIGlmIF9ib3RoXyBhcmUgbmVnYXRpdmUuLi5cbiAgICBpZiAoIWludGVyc2VjdGlvbiAmJiAhY29udGFpbnMoY29tcGFyaXNvbiwgJ3N0cmluZycsIHN0cmluZykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHByZWZpeCArIHN0cmluZyk7XG4gICAgfVxuXG4gICAgLy8gb3IgX2JvdGhfIGFyZSBwb3NpdGl2ZVxuICAgIGlmIChpbnRlcnNlY3Rpb24gJiYgY29udGFpbnMoY29tcGFyaXNvbiwgJ3N0cmluZycsIHN0cmluZykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHByZWZpeCArIHN0cmluZyk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogWmlwIHN0cmluZ3NcbiAqL1xuXG5mdW5jdGlvbiB6aXAoYSwgYikge1xuICBsZXQgYXJyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykgYXJyLnB1c2goW2FbaV0sIGJbaV1dKTtcbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIHJldHVybiBhID4gYiA/IDEgOiBiID4gYSA/IC0xIDogMDtcbn1cblxuZnVuY3Rpb24gY29udGFpbnMoYXJyLCBrZXksIHZhbCkge1xuICByZXR1cm4gYXJyLnNvbWUoZWxlID0+IGVsZVtrZXldID09PSB2YWwpO1xufVxuXG5mdW5jdGlvbiBjb3VudE5pbmVzKG1pbiwgbGVuKSB7XG4gIHJldHVybiBOdW1iZXIoU3RyaW5nKG1pbikuc2xpY2UoMCwgLWxlbikgKyAnOScucmVwZWF0KGxlbikpO1xufVxuXG5mdW5jdGlvbiBjb3VudFplcm9zKGludGVnZXIsIHplcm9zKSB7XG4gIHJldHVybiBpbnRlZ2VyIC0gKGludGVnZXIgJSBNYXRoLnBvdygxMCwgemVyb3MpKTtcbn1cblxuZnVuY3Rpb24gdG9RdWFudGlmaWVyKGRpZ2l0cykge1xuICBsZXQgW3N0YXJ0ID0gMCwgc3RvcCA9ICcnXSA9IGRpZ2l0cztcbiAgaWYgKHN0b3AgfHwgc3RhcnQgPiAxKSB7XG4gICAgcmV0dXJuIGB7JHtzdGFydCArIChzdG9wID8gJywnICsgc3RvcCA6ICcnKX19YDtcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIHRvQ2hhcmFjdGVyQ2xhc3MoYSwgYiwgb3B0aW9ucykge1xuICByZXR1cm4gYFske2F9JHsoYiAtIGEgPT09IDEpID8gJycgOiAnLSd9JHtifV1gO1xufVxuXG5mdW5jdGlvbiBoYXNQYWRkaW5nKHN0cikge1xuICByZXR1cm4gL14tPygwKylcXGQvLnRlc3Qoc3RyKTtcbn1cblxuZnVuY3Rpb24gcGFkWmVyb3ModmFsdWUsIHRvaywgb3B0aW9ucykge1xuICBpZiAoIXRvay5pc1BhZGRlZCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGxldCBkaWZmID0gTWF0aC5hYnModG9rLm1heExlbiAtIFN0cmluZyh2YWx1ZSkubGVuZ3RoKTtcbiAgbGV0IHJlbGF4ID0gb3B0aW9ucy5yZWxheFplcm9zICE9PSBmYWxzZTtcblxuICBzd2l0Y2ggKGRpZmYpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHJlbGF4ID8gJzA/JyA6ICcwJztcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gcmVsYXggPyAnMHswLDJ9JyA6ICcwMCc7XG4gICAgZGVmYXVsdDoge1xuICAgICAgcmV0dXJuIHJlbGF4ID8gYDB7MCwke2RpZmZ9fWAgOiBgMHske2RpZmZ9fWA7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2FjaGVcbiAqL1xuXG50b1JlZ2V4UmFuZ2UuY2FjaGUgPSB7fTtcbnRvUmVnZXhSYW5nZS5jbGVhckNhY2hlID0gKCkgPT4gKHRvUmVnZXhSYW5nZS5jYWNoZSA9IHt9KTtcblxuLyoqXG4gKiBFeHBvc2UgYHRvUmVnZXhSYW5nZWBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUmVnZXhSYW5nZTtcbiIsICIvKiFcbiAqIGZpbGwtcmFuZ2UgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2ZpbGwtcmFuZ2U+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbmNvbnN0IHRvUmVnZXhSYW5nZSA9IHJlcXVpcmUoJ3RvLXJlZ2V4LXJhbmdlJyk7XG5cbmNvbnN0IGlzT2JqZWN0ID0gdmFsID0+IHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xuXG5jb25zdCB0cmFuc2Zvcm0gPSB0b051bWJlciA9PiB7XG4gIHJldHVybiB2YWx1ZSA9PiB0b051bWJlciA9PT0gdHJ1ZSA/IE51bWJlcih2YWx1ZSkgOiBTdHJpbmcodmFsdWUpO1xufTtcblxuY29uc3QgaXNWYWxpZFZhbHVlID0gdmFsdWUgPT4ge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPT0gJycpO1xufTtcblxuY29uc3QgaXNOdW1iZXIgPSBudW0gPT4gTnVtYmVyLmlzSW50ZWdlcigrbnVtKTtcblxuY29uc3QgemVyb3MgPSBpbnB1dCA9PiB7XG4gIGxldCB2YWx1ZSA9IGAke2lucHV0fWA7XG4gIGxldCBpbmRleCA9IC0xO1xuICBpZiAodmFsdWVbMF0gPT09ICctJykgdmFsdWUgPSB2YWx1ZS5zbGljZSgxKTtcbiAgaWYgKHZhbHVlID09PSAnMCcpIHJldHVybiBmYWxzZTtcbiAgd2hpbGUgKHZhbHVlWysraW5kZXhdID09PSAnMCcpO1xuICByZXR1cm4gaW5kZXggPiAwO1xufTtcblxuY29uc3Qgc3RyaW5naWZ5ID0gKHN0YXJ0LCBlbmQsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucy5zdHJpbmdpZnkgPT09IHRydWU7XG59O1xuXG5jb25zdCBwYWQgPSAoaW5wdXQsIG1heExlbmd0aCwgdG9OdW1iZXIpID0+IHtcbiAgaWYgKG1heExlbmd0aCA+IDApIHtcbiAgICBsZXQgZGFzaCA9IGlucHV0WzBdID09PSAnLScgPyAnLScgOiAnJztcbiAgICBpZiAoZGFzaCkgaW5wdXQgPSBpbnB1dC5zbGljZSgxKTtcbiAgICBpbnB1dCA9IChkYXNoICsgaW5wdXQucGFkU3RhcnQoZGFzaCA/IG1heExlbmd0aCAtIDEgOiBtYXhMZW5ndGgsICcwJykpO1xuICB9XG4gIGlmICh0b051bWJlciA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gU3RyaW5nKGlucHV0KTtcbiAgfVxuICByZXR1cm4gaW5wdXQ7XG59O1xuXG5jb25zdCB0b01heExlbiA9IChpbnB1dCwgbWF4TGVuZ3RoKSA9PiB7XG4gIGxldCBuZWdhdGl2ZSA9IGlucHV0WzBdID09PSAnLScgPyAnLScgOiAnJztcbiAgaWYgKG5lZ2F0aXZlKSB7XG4gICAgaW5wdXQgPSBpbnB1dC5zbGljZSgxKTtcbiAgICBtYXhMZW5ndGgtLTtcbiAgfVxuICB3aGlsZSAoaW5wdXQubGVuZ3RoIDwgbWF4TGVuZ3RoKSBpbnB1dCA9ICcwJyArIGlucHV0O1xuICByZXR1cm4gbmVnYXRpdmUgPyAoJy0nICsgaW5wdXQpIDogaW5wdXQ7XG59O1xuXG5jb25zdCB0b1NlcXVlbmNlID0gKHBhcnRzLCBvcHRpb25zKSA9PiB7XG4gIHBhcnRzLm5lZ2F0aXZlcy5zb3J0KChhLCBiKSA9PiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMCk7XG4gIHBhcnRzLnBvc2l0aXZlcy5zb3J0KChhLCBiKSA9PiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMCk7XG5cbiAgbGV0IHByZWZpeCA9IG9wdGlvbnMuY2FwdHVyZSA/ICcnIDogJz86JztcbiAgbGV0IHBvc2l0aXZlcyA9ICcnO1xuICBsZXQgbmVnYXRpdmVzID0gJyc7XG4gIGxldCByZXN1bHQ7XG5cbiAgaWYgKHBhcnRzLnBvc2l0aXZlcy5sZW5ndGgpIHtcbiAgICBwb3NpdGl2ZXMgPSBwYXJ0cy5wb3NpdGl2ZXMuam9pbignfCcpO1xuICB9XG5cbiAgaWYgKHBhcnRzLm5lZ2F0aXZlcy5sZW5ndGgpIHtcbiAgICBuZWdhdGl2ZXMgPSBgLSgke3ByZWZpeH0ke3BhcnRzLm5lZ2F0aXZlcy5qb2luKCd8Jyl9KWA7XG4gIH1cblxuICBpZiAocG9zaXRpdmVzICYmIG5lZ2F0aXZlcykge1xuICAgIHJlc3VsdCA9IGAke3Bvc2l0aXZlc318JHtuZWdhdGl2ZXN9YDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBwb3NpdGl2ZXMgfHwgbmVnYXRpdmVzO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMud3JhcCkge1xuICAgIHJldHVybiBgKCR7cHJlZml4fSR7cmVzdWx0fSlgO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IHRvUmFuZ2UgPSAoYSwgYiwgaXNOdW1iZXJzLCBvcHRpb25zKSA9PiB7XG4gIGlmIChpc051bWJlcnMpIHtcbiAgICByZXR1cm4gdG9SZWdleFJhbmdlKGEsIGIsIHsgd3JhcDogZmFsc2UsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICBsZXQgc3RhcnQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGEpO1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIHN0YXJ0O1xuXG4gIGxldCBzdG9wID0gU3RyaW5nLmZyb21DaGFyQ29kZShiKTtcbiAgcmV0dXJuIGBbJHtzdGFydH0tJHtzdG9wfV1gO1xufTtcblxuY29uc3QgdG9SZWdleCA9IChzdGFydCwgZW5kLCBvcHRpb25zKSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KHN0YXJ0KSkge1xuICAgIGxldCB3cmFwID0gb3B0aW9ucy53cmFwID09PSB0cnVlO1xuICAgIGxldCBwcmVmaXggPSBvcHRpb25zLmNhcHR1cmUgPyAnJyA6ICc/Oic7XG4gICAgcmV0dXJuIHdyYXAgPyBgKCR7cHJlZml4fSR7c3RhcnQuam9pbignfCcpfSlgIDogc3RhcnQuam9pbignfCcpO1xuICB9XG4gIHJldHVybiB0b1JlZ2V4UmFuZ2Uoc3RhcnQsIGVuZCwgb3B0aW9ucyk7XG59O1xuXG5jb25zdCByYW5nZUVycm9yID0gKC4uLmFyZ3MpID0+IHtcbiAgcmV0dXJuIG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHJhbmdlIGFyZ3VtZW50czogJyArIHV0aWwuaW5zcGVjdCguLi5hcmdzKSk7XG59O1xuXG5jb25zdCBpbnZhbGlkUmFuZ2UgPSAoc3RhcnQsIGVuZCwgb3B0aW9ucykgPT4ge1xuICBpZiAob3B0aW9ucy5zdHJpY3RSYW5nZXMgPT09IHRydWUpIHRocm93IHJhbmdlRXJyb3IoW3N0YXJ0LCBlbmRdKTtcbiAgcmV0dXJuIFtdO1xufTtcblxuY29uc3QgaW52YWxpZFN0ZXAgPSAoc3RlcCwgb3B0aW9ucykgPT4ge1xuICBpZiAob3B0aW9ucy5zdHJpY3RSYW5nZXMgPT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBFeHBlY3RlZCBzdGVwIFwiJHtzdGVwfVwiIHRvIGJlIGEgbnVtYmVyYCk7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuY29uc3QgZmlsbE51bWJlcnMgPSAoc3RhcnQsIGVuZCwgc3RlcCA9IDEsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgYSA9IE51bWJlcihzdGFydCk7XG4gIGxldCBiID0gTnVtYmVyKGVuZCk7XG5cbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGEpIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGIpKSB7XG4gICAgaWYgKG9wdGlvbnMuc3RyaWN0UmFuZ2VzID09PSB0cnVlKSB0aHJvdyByYW5nZUVycm9yKFtzdGFydCwgZW5kXSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLy8gZml4IG5lZ2F0aXZlIHplcm9cbiAgaWYgKGEgPT09IDApIGEgPSAwO1xuICBpZiAoYiA9PT0gMCkgYiA9IDA7XG5cbiAgbGV0IGRlc2NlbmRpbmcgPSBhID4gYjtcbiAgbGV0IHN0YXJ0U3RyaW5nID0gU3RyaW5nKHN0YXJ0KTtcbiAgbGV0IGVuZFN0cmluZyA9IFN0cmluZyhlbmQpO1xuICBsZXQgc3RlcFN0cmluZyA9IFN0cmluZyhzdGVwKTtcbiAgc3RlcCA9IE1hdGgubWF4KE1hdGguYWJzKHN0ZXApLCAxKTtcblxuICBsZXQgcGFkZGVkID0gemVyb3Moc3RhcnRTdHJpbmcpIHx8IHplcm9zKGVuZFN0cmluZykgfHwgemVyb3Moc3RlcFN0cmluZyk7XG4gIGxldCBtYXhMZW4gPSBwYWRkZWQgPyBNYXRoLm1heChzdGFydFN0cmluZy5sZW5ndGgsIGVuZFN0cmluZy5sZW5ndGgsIHN0ZXBTdHJpbmcubGVuZ3RoKSA6IDA7XG4gIGxldCB0b051bWJlciA9IHBhZGRlZCA9PT0gZmFsc2UgJiYgc3RyaW5naWZ5KHN0YXJ0LCBlbmQsIG9wdGlvbnMpID09PSBmYWxzZTtcbiAgbGV0IGZvcm1hdCA9IG9wdGlvbnMudHJhbnNmb3JtIHx8IHRyYW5zZm9ybSh0b051bWJlcik7XG5cbiAgaWYgKG9wdGlvbnMudG9SZWdleCAmJiBzdGVwID09PSAxKSB7XG4gICAgcmV0dXJuIHRvUmFuZ2UodG9NYXhMZW4oc3RhcnQsIG1heExlbiksIHRvTWF4TGVuKGVuZCwgbWF4TGVuKSwgdHJ1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICBsZXQgcGFydHMgPSB7IG5lZ2F0aXZlczogW10sIHBvc2l0aXZlczogW10gfTtcbiAgbGV0IHB1c2ggPSBudW0gPT4gcGFydHNbbnVtIDwgMCA/ICduZWdhdGl2ZXMnIDogJ3Bvc2l0aXZlcyddLnB1c2goTWF0aC5hYnMobnVtKSk7XG4gIGxldCByYW5nZSA9IFtdO1xuICBsZXQgaW5kZXggPSAwO1xuXG4gIHdoaWxlIChkZXNjZW5kaW5nID8gYSA+PSBiIDogYSA8PSBiKSB7XG4gICAgaWYgKG9wdGlvbnMudG9SZWdleCA9PT0gdHJ1ZSAmJiBzdGVwID4gMSkge1xuICAgICAgcHVzaChhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFuZ2UucHVzaChwYWQoZm9ybWF0KGEsIGluZGV4KSwgbWF4TGVuLCB0b051bWJlcikpO1xuICAgIH1cbiAgICBhID0gZGVzY2VuZGluZyA/IGEgLSBzdGVwIDogYSArIHN0ZXA7XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIGlmIChvcHRpb25zLnRvUmVnZXggPT09IHRydWUpIHtcbiAgICByZXR1cm4gc3RlcCA+IDFcbiAgICAgID8gdG9TZXF1ZW5jZShwYXJ0cywgb3B0aW9ucylcbiAgICAgIDogdG9SZWdleChyYW5nZSwgbnVsbCwgeyB3cmFwOiBmYWxzZSwgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn07XG5cbmNvbnN0IGZpbGxMZXR0ZXJzID0gKHN0YXJ0LCBlbmQsIHN0ZXAgPSAxLCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKCghaXNOdW1iZXIoc3RhcnQpICYmIHN0YXJ0Lmxlbmd0aCA+IDEpIHx8ICghaXNOdW1iZXIoZW5kKSAmJiBlbmQubGVuZ3RoID4gMSkpIHtcbiAgICByZXR1cm4gaW52YWxpZFJhbmdlKHN0YXJ0LCBlbmQsIG9wdGlvbnMpO1xuICB9XG5cblxuICBsZXQgZm9ybWF0ID0gb3B0aW9ucy50cmFuc2Zvcm0gfHwgKHZhbCA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKHZhbCkpO1xuICBsZXQgYSA9IGAke3N0YXJ0fWAuY2hhckNvZGVBdCgwKTtcbiAgbGV0IGIgPSBgJHtlbmR9YC5jaGFyQ29kZUF0KDApO1xuXG4gIGxldCBkZXNjZW5kaW5nID0gYSA+IGI7XG4gIGxldCBtaW4gPSBNYXRoLm1pbihhLCBiKTtcbiAgbGV0IG1heCA9IE1hdGgubWF4KGEsIGIpO1xuXG4gIGlmIChvcHRpb25zLnRvUmVnZXggJiYgc3RlcCA9PT0gMSkge1xuICAgIHJldHVybiB0b1JhbmdlKG1pbiwgbWF4LCBmYWxzZSwgb3B0aW9ucyk7XG4gIH1cblxuICBsZXQgcmFuZ2UgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcblxuICB3aGlsZSAoZGVzY2VuZGluZyA/IGEgPj0gYiA6IGEgPD0gYikge1xuICAgIHJhbmdlLnB1c2goZm9ybWF0KGEsIGluZGV4KSk7XG4gICAgYSA9IGRlc2NlbmRpbmcgPyBhIC0gc3RlcCA6IGEgKyBzdGVwO1xuICAgIGluZGV4Kys7XG4gIH1cblxuICBpZiAob3B0aW9ucy50b1JlZ2V4ID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRvUmVnZXgocmFuZ2UsIG51bGwsIHsgd3JhcDogZmFsc2UsIG9wdGlvbnMgfSk7XG4gIH1cblxuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5jb25zdCBmaWxsID0gKHN0YXJ0LCBlbmQsIHN0ZXAsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAoZW5kID09IG51bGwgJiYgaXNWYWxpZFZhbHVlKHN0YXJ0KSkge1xuICAgIHJldHVybiBbc3RhcnRdO1xuICB9XG5cbiAgaWYgKCFpc1ZhbGlkVmFsdWUoc3RhcnQpIHx8ICFpc1ZhbGlkVmFsdWUoZW5kKSkge1xuICAgIHJldHVybiBpbnZhbGlkUmFuZ2Uoc3RhcnQsIGVuZCwgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHN0ZXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmlsbChzdGFydCwgZW5kLCAxLCB7IHRyYW5zZm9ybTogc3RlcCB9KTtcbiAgfVxuXG4gIGlmIChpc09iamVjdChzdGVwKSkge1xuICAgIHJldHVybiBmaWxsKHN0YXJ0LCBlbmQsIDAsIHN0ZXApO1xuICB9XG5cbiAgbGV0IG9wdHMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgaWYgKG9wdHMuY2FwdHVyZSA9PT0gdHJ1ZSkgb3B0cy53cmFwID0gdHJ1ZTtcbiAgc3RlcCA9IHN0ZXAgfHwgb3B0cy5zdGVwIHx8IDE7XG5cbiAgaWYgKCFpc051bWJlcihzdGVwKSkge1xuICAgIGlmIChzdGVwICE9IG51bGwgJiYgIWlzT2JqZWN0KHN0ZXApKSByZXR1cm4gaW52YWxpZFN0ZXAoc3RlcCwgb3B0cyk7XG4gICAgcmV0dXJuIGZpbGwoc3RhcnQsIGVuZCwgMSwgc3RlcCk7XG4gIH1cblxuICBpZiAoaXNOdW1iZXIoc3RhcnQpICYmIGlzTnVtYmVyKGVuZCkpIHtcbiAgICByZXR1cm4gZmlsbE51bWJlcnMoc3RhcnQsIGVuZCwgc3RlcCwgb3B0cyk7XG4gIH1cblxuICByZXR1cm4gZmlsbExldHRlcnMoc3RhcnQsIGVuZCwgTWF0aC5tYXgoTWF0aC5hYnMoc3RlcCksIDEpLCBvcHRzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsbDtcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGZpbGwgPSByZXF1aXJlKCdmaWxsLXJhbmdlJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuY29uc3QgY29tcGlsZSA9IChhc3QsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgd2FsayA9IChub2RlLCBwYXJlbnQgPSB7fSkgPT4ge1xuICAgIGxldCBpbnZhbGlkQmxvY2sgPSB1dGlscy5pc0ludmFsaWRCcmFjZShwYXJlbnQpO1xuICAgIGxldCBpbnZhbGlkTm9kZSA9IG5vZGUuaW52YWxpZCA9PT0gdHJ1ZSAmJiBvcHRpb25zLmVzY2FwZUludmFsaWQgPT09IHRydWU7XG4gICAgbGV0IGludmFsaWQgPSBpbnZhbGlkQmxvY2sgPT09IHRydWUgfHwgaW52YWxpZE5vZGUgPT09IHRydWU7XG4gICAgbGV0IHByZWZpeCA9IG9wdGlvbnMuZXNjYXBlSW52YWxpZCA9PT0gdHJ1ZSA/ICdcXFxcJyA6ICcnO1xuICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgIGlmIChub2RlLmlzT3BlbiA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHByZWZpeCArIG5vZGUudmFsdWU7XG4gICAgfVxuICAgIGlmIChub2RlLmlzQ2xvc2UgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBwcmVmaXggKyBub2RlLnZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdvcGVuJykge1xuICAgICAgcmV0dXJuIGludmFsaWQgPyAocHJlZml4ICsgbm9kZS52YWx1ZSkgOiAnKCc7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ2Nsb3NlJykge1xuICAgICAgcmV0dXJuIGludmFsaWQgPyAocHJlZml4ICsgbm9kZS52YWx1ZSkgOiAnKSc7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ2NvbW1hJykge1xuICAgICAgcmV0dXJuIG5vZGUucHJldi50eXBlID09PSAnY29tbWEnID8gJycgOiAoaW52YWxpZCA/IG5vZGUudmFsdWUgOiAnfCcpO1xuICAgIH1cblxuICAgIGlmIChub2RlLnZhbHVlKSB7XG4gICAgICByZXR1cm4gbm9kZS52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5ub2RlcyAmJiBub2RlLnJhbmdlcyA+IDApIHtcbiAgICAgIGxldCBhcmdzID0gdXRpbHMucmVkdWNlKG5vZGUubm9kZXMpO1xuICAgICAgbGV0IHJhbmdlID0gZmlsbCguLi5hcmdzLCB7IC4uLm9wdGlvbnMsIHdyYXA6IGZhbHNlLCB0b1JlZ2V4OiB0cnVlIH0pO1xuXG4gICAgICBpZiAocmFuZ2UubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIHJldHVybiBhcmdzLmxlbmd0aCA+IDEgJiYgcmFuZ2UubGVuZ3RoID4gMSA/IGAoJHtyYW5nZX0pYCA6IHJhbmdlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVzKSB7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBub2RlLm5vZGVzKSB7XG4gICAgICAgIG91dHB1dCArPSB3YWxrKGNoaWxkLCBub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICByZXR1cm4gd2Fsayhhc3QpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZmlsbCA9IHJlcXVpcmUoJ2ZpbGwtcmFuZ2UnKTtcbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5Jyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuY29uc3QgYXBwZW5kID0gKHF1ZXVlID0gJycsIHN0YXNoID0gJycsIGVuY2xvc2UgPSBmYWxzZSkgPT4ge1xuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgcXVldWUgPSBbXS5jb25jYXQocXVldWUpO1xuICBzdGFzaCA9IFtdLmNvbmNhdChzdGFzaCk7XG5cbiAgaWYgKCFzdGFzaC5sZW5ndGgpIHJldHVybiBxdWV1ZTtcbiAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZW5jbG9zZSA/IHV0aWxzLmZsYXR0ZW4oc3Rhc2gpLm1hcChlbGUgPT4gYHske2VsZX19YCkgOiBzdGFzaDtcbiAgfVxuXG4gIGZvciAobGV0IGl0ZW0gb2YgcXVldWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2YgaXRlbSkge1xuICAgICAgICByZXN1bHQucHVzaChhcHBlbmQodmFsdWUsIHN0YXNoLCBlbmNsb3NlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGVsZSBvZiBzdGFzaCkge1xuICAgICAgICBpZiAoZW5jbG9zZSA9PT0gdHJ1ZSAmJiB0eXBlb2YgZWxlID09PSAnc3RyaW5nJykgZWxlID0gYHske2VsZX19YDtcbiAgICAgICAgcmVzdWx0LnB1c2goQXJyYXkuaXNBcnJheShlbGUpID8gYXBwZW5kKGl0ZW0sIGVsZSwgZW5jbG9zZSkgOiAoaXRlbSArIGVsZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdXRpbHMuZmxhdHRlbihyZXN1bHQpO1xufTtcblxuY29uc3QgZXhwYW5kID0gKGFzdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCByYW5nZUxpbWl0ID0gb3B0aW9ucy5yYW5nZUxpbWl0ID09PSB2b2lkIDAgPyAxMDAwIDogb3B0aW9ucy5yYW5nZUxpbWl0O1xuXG4gIGxldCB3YWxrID0gKG5vZGUsIHBhcmVudCA9IHt9KSA9PiB7XG4gICAgbm9kZS5xdWV1ZSA9IFtdO1xuXG4gICAgbGV0IHAgPSBwYXJlbnQ7XG4gICAgbGV0IHEgPSBwYXJlbnQucXVldWU7XG5cbiAgICB3aGlsZSAocC50eXBlICE9PSAnYnJhY2UnICYmIHAudHlwZSAhPT0gJ3Jvb3QnICYmIHAucGFyZW50KSB7XG4gICAgICBwID0gcC5wYXJlbnQ7XG4gICAgICBxID0gcC5xdWV1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5pbnZhbGlkIHx8IG5vZGUuZG9sbGFyKSB7XG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHN0cmluZ2lmeShub2RlLCBvcHRpb25zKSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdicmFjZScgJiYgbm9kZS5pbnZhbGlkICE9PSB0cnVlICYmIG5vZGUubm9kZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIFsne30nXSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVzICYmIG5vZGUucmFuZ2VzID4gMCkge1xuICAgICAgbGV0IGFyZ3MgPSB1dGlscy5yZWR1Y2Uobm9kZS5ub2Rlcyk7XG5cbiAgICAgIGlmICh1dGlscy5leGNlZWRzTGltaXQoLi4uYXJncywgb3B0aW9ucy5zdGVwLCByYW5nZUxpbWl0KSkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZXhwYW5kZWQgYXJyYXkgbGVuZ3RoIGV4Y2VlZHMgcmFuZ2UgbGltaXQuIFVzZSBvcHRpb25zLnJhbmdlTGltaXQgdG8gaW5jcmVhc2Ugb3IgZGlzYWJsZSB0aGUgbGltaXQuJyk7XG4gICAgICB9XG5cbiAgICAgIGxldCByYW5nZSA9IGZpbGwoLi4uYXJncywgb3B0aW9ucyk7XG4gICAgICBpZiAocmFuZ2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJhbmdlID0gc3RyaW5naWZ5KG5vZGUsIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHJhbmdlKSk7XG4gICAgICBub2RlLm5vZGVzID0gW107XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGVuY2xvc2UgPSB1dGlscy5lbmNsb3NlQnJhY2Uobm9kZSk7XG4gICAgbGV0IHF1ZXVlID0gbm9kZS5xdWV1ZTtcbiAgICBsZXQgYmxvY2sgPSBub2RlO1xuXG4gICAgd2hpbGUgKGJsb2NrLnR5cGUgIT09ICdicmFjZScgJiYgYmxvY2sudHlwZSAhPT0gJ3Jvb3QnICYmIGJsb2NrLnBhcmVudCkge1xuICAgICAgYmxvY2sgPSBibG9jay5wYXJlbnQ7XG4gICAgICBxdWV1ZSA9IGJsb2NrLnF1ZXVlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5ub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGNoaWxkID0gbm9kZS5ub2Rlc1tpXTtcblxuICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdjb21tYScgJiYgbm9kZS50eXBlID09PSAnYnJhY2UnKSB7XG4gICAgICAgIGlmIChpID09PSAxKSBxdWV1ZS5wdXNoKCcnKTtcbiAgICAgICAgcXVldWUucHVzaCgnJyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ2Nsb3NlJykge1xuICAgICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHF1ZXVlLCBlbmNsb3NlKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQudmFsdWUgJiYgY2hpbGQudHlwZSAhPT0gJ29wZW4nKSB7XG4gICAgICAgIHF1ZXVlLnB1c2goYXBwZW5kKHF1ZXVlLnBvcCgpLCBjaGlsZC52YWx1ZSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLm5vZGVzKSB7XG4gICAgICAgIHdhbGsoY2hpbGQsIG5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBxdWV1ZTtcbiAgfTtcblxuICByZXR1cm4gdXRpbHMuZmxhdHRlbih3YWxrKGFzdCkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBhbmQ7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTUFYX0xFTkdUSDogMTAyNCAqIDY0LFxuXG4gIC8vIERpZ2l0c1xuICBDSEFSXzA6ICcwJywgLyogMCAqL1xuICBDSEFSXzk6ICc5JywgLyogOSAqL1xuXG4gIC8vIEFscGhhYmV0IGNoYXJzLlxuICBDSEFSX1VQUEVSQ0FTRV9BOiAnQScsIC8qIEEgKi9cbiAgQ0hBUl9MT1dFUkNBU0VfQTogJ2EnLCAvKiBhICovXG4gIENIQVJfVVBQRVJDQVNFX1o6ICdaJywgLyogWiAqL1xuICBDSEFSX0xPV0VSQ0FTRV9aOiAneicsIC8qIHogKi9cblxuICBDSEFSX0xFRlRfUEFSRU5USEVTRVM6ICcoJywgLyogKCAqL1xuICBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTOiAnKScsIC8qICkgKi9cblxuICBDSEFSX0FTVEVSSVNLOiAnKicsIC8qICogKi9cblxuICAvLyBOb24tYWxwaGFiZXRpYyBjaGFycy5cbiAgQ0hBUl9BTVBFUlNBTkQ6ICcmJywgLyogJiAqL1xuICBDSEFSX0FUOiAnQCcsIC8qIEAgKi9cbiAgQ0hBUl9CQUNLU0xBU0g6ICdcXFxcJywgLyogXFwgKi9cbiAgQ0hBUl9CQUNLVElDSzogJ2AnLCAvKiBgICovXG4gIENIQVJfQ0FSUklBR0VfUkVUVVJOOiAnXFxyJywgLyogXFxyICovXG4gIENIQVJfQ0lSQ1VNRkxFWF9BQ0NFTlQ6ICdeJywgLyogXiAqL1xuICBDSEFSX0NPTE9OOiAnOicsIC8qIDogKi9cbiAgQ0hBUl9DT01NQTogJywnLCAvKiAsICovXG4gIENIQVJfRE9MTEFSOiAnJCcsIC8qIC4gKi9cbiAgQ0hBUl9ET1Q6ICcuJywgLyogLiAqL1xuICBDSEFSX0RPVUJMRV9RVU9URTogJ1wiJywgLyogXCIgKi9cbiAgQ0hBUl9FUVVBTDogJz0nLCAvKiA9ICovXG4gIENIQVJfRVhDTEFNQVRJT05fTUFSSzogJyEnLCAvKiAhICovXG4gIENIQVJfRk9STV9GRUVEOiAnXFxmJywgLyogXFxmICovXG4gIENIQVJfRk9SV0FSRF9TTEFTSDogJy8nLCAvKiAvICovXG4gIENIQVJfSEFTSDogJyMnLCAvKiAjICovXG4gIENIQVJfSFlQSEVOX01JTlVTOiAnLScsIC8qIC0gKi9cbiAgQ0hBUl9MRUZUX0FOR0xFX0JSQUNLRVQ6ICc8JywgLyogPCAqL1xuICBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0U6ICd7JywgLyogeyAqL1xuICBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQ6ICdbJywgLyogWyAqL1xuICBDSEFSX0xJTkVfRkVFRDogJ1xcbicsIC8qIFxcbiAqL1xuICBDSEFSX05PX0JSRUFLX1NQQUNFOiAnXFx1MDBBMCcsIC8qIFxcdTAwQTAgKi9cbiAgQ0hBUl9QRVJDRU5UOiAnJScsIC8qICUgKi9cbiAgQ0hBUl9QTFVTOiAnKycsIC8qICsgKi9cbiAgQ0hBUl9RVUVTVElPTl9NQVJLOiAnPycsIC8qID8gKi9cbiAgQ0hBUl9SSUdIVF9BTkdMRV9CUkFDS0VUOiAnPicsIC8qID4gKi9cbiAgQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRTogJ30nLCAvKiB9ICovXG4gIENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQ6ICddJywgLyogXSAqL1xuICBDSEFSX1NFTUlDT0xPTjogJzsnLCAvKiA7ICovXG4gIENIQVJfU0lOR0xFX1FVT1RFOiAnXFwnJywgLyogJyAqL1xuICBDSEFSX1NQQUNFOiAnICcsIC8qICAgKi9cbiAgQ0hBUl9UQUI6ICdcXHQnLCAvKiBcXHQgKi9cbiAgQ0hBUl9VTkRFUlNDT1JFOiAnXycsIC8qIF8gKi9cbiAgQ0hBUl9WRVJUSUNBTF9MSU5FOiAnfCcsIC8qIHwgKi9cbiAgQ0hBUl9aRVJPX1dJRFRIX05PQlJFQUtfU1BBQ0U6ICdcXHVGRUZGJyAvKiBcXHVGRUZGICovXG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9zdHJpbmdpZnknKTtcblxuLyoqXG4gKiBDb25zdGFudHNcbiAqL1xuXG5jb25zdCB7XG4gIE1BWF9MRU5HVEgsXG4gIENIQVJfQkFDS1NMQVNILCAvKiBcXCAqL1xuICBDSEFSX0JBQ0tUSUNLLCAvKiBgICovXG4gIENIQVJfQ09NTUEsIC8qICwgKi9cbiAgQ0hBUl9ET1QsIC8qIC4gKi9cbiAgQ0hBUl9MRUZUX1BBUkVOVEhFU0VTLCAvKiAoICovXG4gIENIQVJfUklHSFRfUEFSRU5USEVTRVMsIC8qICkgKi9cbiAgQ0hBUl9MRUZUX0NVUkxZX0JSQUNFLCAvKiB7ICovXG4gIENIQVJfUklHSFRfQ1VSTFlfQlJBQ0UsIC8qIH0gKi9cbiAgQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VULCAvKiBbICovXG4gIENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQsIC8qIF0gKi9cbiAgQ0hBUl9ET1VCTEVfUVVPVEUsIC8qIFwiICovXG4gIENIQVJfU0lOR0xFX1FVT1RFLCAvKiAnICovXG4gIENIQVJfTk9fQlJFQUtfU1BBQ0UsXG4gIENIQVJfWkVST19XSURUSF9OT0JSRUFLX1NQQUNFXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuLyoqXG4gKiBwYXJzZVxuICovXG5cbmNvbnN0IHBhcnNlID0gKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIHN0cmluZycpO1xuICB9XG5cbiAgbGV0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICBsZXQgbWF4ID0gdHlwZW9mIG9wdHMubWF4TGVuZ3RoID09PSAnbnVtYmVyJyA/IE1hdGgubWluKE1BWF9MRU5HVEgsIG9wdHMubWF4TGVuZ3RoKSA6IE1BWF9MRU5HVEg7XG4gIGlmIChpbnB1dC5sZW5ndGggPiBtYXgpIHtcbiAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYElucHV0IGxlbmd0aCAoJHtpbnB1dC5sZW5ndGh9KSwgZXhjZWVkcyBtYXggY2hhcmFjdGVycyAoJHttYXh9KWApO1xuICB9XG5cbiAgbGV0IGFzdCA9IHsgdHlwZTogJ3Jvb3QnLCBpbnB1dCwgbm9kZXM6IFtdIH07XG4gIGxldCBzdGFjayA9IFthc3RdO1xuICBsZXQgYmxvY2sgPSBhc3Q7XG4gIGxldCBwcmV2ID0gYXN0O1xuICBsZXQgYnJhY2tldHMgPSAwO1xuICBsZXQgbGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICBsZXQgaW5kZXggPSAwO1xuICBsZXQgZGVwdGggPSAwO1xuICBsZXQgdmFsdWU7XG4gIGxldCBtZW1vID0ge307XG5cbiAgLyoqXG4gICAqIEhlbHBlcnNcbiAgICovXG5cbiAgY29uc3QgYWR2YW5jZSA9ICgpID0+IGlucHV0W2luZGV4KytdO1xuICBjb25zdCBwdXNoID0gbm9kZSA9PiB7XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ3RleHQnICYmIHByZXYudHlwZSA9PT0gJ2RvdCcpIHtcbiAgICAgIHByZXYudHlwZSA9ICd0ZXh0JztcbiAgICB9XG5cbiAgICBpZiAocHJldiAmJiBwcmV2LnR5cGUgPT09ICd0ZXh0JyAmJiBub2RlLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgcHJldi52YWx1ZSArPSBub2RlLnZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJsb2NrLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgbm9kZS5wYXJlbnQgPSBibG9jaztcbiAgICBub2RlLnByZXYgPSBwcmV2O1xuICAgIHByZXYgPSBub2RlO1xuICAgIHJldHVybiBub2RlO1xuICB9O1xuXG4gIHB1c2goeyB0eXBlOiAnYm9zJyB9KTtcblxuICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICBibG9jayA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgIHZhbHVlID0gYWR2YW5jZSgpO1xuXG4gICAgLyoqXG4gICAgICogSW52YWxpZCBjaGFyc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX1pFUk9fV0lEVEhfTk9CUkVBS19TUEFDRSB8fCB2YWx1ZSA9PT0gQ0hBUl9OT19CUkVBS19TUEFDRSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXNjYXBlZCBjaGFyc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0JBQ0tTTEFTSCkge1xuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWU6IChvcHRpb25zLmtlZXBFc2NhcGluZyA/IHZhbHVlIDogJycpICsgYWR2YW5jZSgpIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmlnaHQgc3F1YXJlIGJyYWNrZXQgKGxpdGVyYWwpOiAnXSdcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVCkge1xuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWU6ICdcXFxcJyArIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGVmdCBzcXVhcmUgYnJhY2tldDogJ1snXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVCkge1xuICAgICAgYnJhY2tldHMrKztcblxuICAgICAgbGV0IGNsb3NlZCA9IHRydWU7XG4gICAgICBsZXQgbmV4dDtcblxuICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoICYmIChuZXh0ID0gYWR2YW5jZSgpKSkge1xuICAgICAgICB2YWx1ZSArPSBuZXh0O1xuXG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgICAgICBicmFja2V0cysrO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHQgPT09IENIQVJfQkFDS1NMQVNIKSB7XG4gICAgICAgICAgdmFsdWUgKz0gYWR2YW5jZSgpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHQgPT09IENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgICAgICBicmFja2V0cy0tO1xuXG4gICAgICAgICAgaWYgKGJyYWNrZXRzID09PSAwKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJlbnRoZXNlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0xFRlRfUEFSRU5USEVTRVMpIHtcbiAgICAgIGJsb2NrID0gcHVzaCh7IHR5cGU6ICdwYXJlbicsIG5vZGVzOiBbXSB9KTtcbiAgICAgIHN0YWNrLnB1c2goYmxvY2spO1xuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfUklHSFRfUEFSRU5USEVTRVMpIHtcbiAgICAgIGlmIChibG9jay50eXBlICE9PSAncGFyZW4nKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGJsb2NrID0gc3RhY2sucG9wKCk7XG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGJsb2NrID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBRdW90ZXM6ICd8XCJ8YFxuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0RPVUJMRV9RVU9URSB8fCB2YWx1ZSA9PT0gQ0hBUl9TSU5HTEVfUVVPVEUgfHwgdmFsdWUgPT09IENIQVJfQkFDS1RJQ0spIHtcbiAgICAgIGxldCBvcGVuID0gdmFsdWU7XG4gICAgICBsZXQgbmV4dDtcblxuICAgICAgaWYgKG9wdGlvbnMua2VlcFF1b3RlcyAhPT0gdHJ1ZSkge1xuICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGggJiYgKG5leHQgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX0JBQ0tTTEFTSCkge1xuICAgICAgICAgIHZhbHVlICs9IG5leHQgKyBhZHZhbmNlKCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dCA9PT0gb3Blbikge1xuICAgICAgICAgIGlmIChvcHRpb25zLmtlZXBRdW90ZXMgPT09IHRydWUpIHZhbHVlICs9IG5leHQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSArPSBuZXh0O1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExlZnQgY3VybHkgYnJhY2U6ICd7J1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgIGRlcHRoKys7XG5cbiAgICAgIGxldCBkb2xsYXIgPSBwcmV2LnZhbHVlICYmIHByZXYudmFsdWUuc2xpY2UoLTEpID09PSAnJCcgfHwgYmxvY2suZG9sbGFyID09PSB0cnVlO1xuICAgICAgbGV0IGJyYWNlID0ge1xuICAgICAgICB0eXBlOiAnYnJhY2UnLFxuICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICBjbG9zZTogZmFsc2UsXG4gICAgICAgIGRvbGxhcixcbiAgICAgICAgZGVwdGgsXG4gICAgICAgIGNvbW1hczogMCxcbiAgICAgICAgcmFuZ2VzOiAwLFxuICAgICAgICBub2RlczogW11cbiAgICAgIH07XG5cbiAgICAgIGJsb2NrID0gcHVzaChicmFjZSk7XG4gICAgICBzdGFjay5wdXNoKGJsb2NrKTtcbiAgICAgIHB1c2goeyB0eXBlOiAnb3BlbicsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmlnaHQgY3VybHkgYnJhY2U6ICd9J1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFKSB7XG4gICAgICBpZiAoYmxvY2sudHlwZSAhPT0gJ2JyYWNlJykge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCB0eXBlID0gJ2Nsb3NlJztcbiAgICAgIGJsb2NrID0gc3RhY2sucG9wKCk7XG4gICAgICBibG9jay5jbG9zZSA9IHRydWU7XG5cbiAgICAgIHB1c2goeyB0eXBlLCB2YWx1ZSB9KTtcbiAgICAgIGRlcHRoLS07XG5cbiAgICAgIGJsb2NrID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21tYTogJywnXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfQ09NTUEgJiYgZGVwdGggPiAwKSB7XG4gICAgICBpZiAoYmxvY2sucmFuZ2VzID4gMCkge1xuICAgICAgICBibG9jay5yYW5nZXMgPSAwO1xuICAgICAgICBsZXQgb3BlbiA9IGJsb2NrLm5vZGVzLnNoaWZ0KCk7XG4gICAgICAgIGJsb2NrLm5vZGVzID0gW29wZW4sIHsgdHlwZTogJ3RleHQnLCB2YWx1ZTogc3RyaW5naWZ5KGJsb2NrKSB9XTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdjb21tYScsIHZhbHVlIH0pO1xuICAgICAgYmxvY2suY29tbWFzKys7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb3Q6ICcuJ1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0RPVCAmJiBkZXB0aCA+IDAgJiYgYmxvY2suY29tbWFzID09PSAwKSB7XG4gICAgICBsZXQgc2libGluZ3MgPSBibG9jay5ub2RlcztcblxuICAgICAgaWYgKGRlcHRoID09PSAwIHx8IHNpYmxpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICAgIGJsb2NrLnJhbmdlID0gW107XG4gICAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIHByZXYudHlwZSA9ICdyYW5nZSc7XG5cbiAgICAgICAgaWYgKGJsb2NrLm5vZGVzLmxlbmd0aCAhPT0gMyAmJiBibG9jay5ub2Rlcy5sZW5ndGggIT09IDUpIHtcbiAgICAgICAgICBibG9jay5pbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICBibG9jay5yYW5nZXMgPSAwO1xuICAgICAgICAgIHByZXYudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJsb2NrLnJhbmdlcysrO1xuICAgICAgICBibG9jay5hcmdzID0gW107XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldi50eXBlID09PSAncmFuZ2UnKSB7XG4gICAgICAgIHNpYmxpbmdzLnBvcCgpO1xuXG4gICAgICAgIGxldCBiZWZvcmUgPSBzaWJsaW5nc1tzaWJsaW5ncy5sZW5ndGggLSAxXTtcbiAgICAgICAgYmVmb3JlLnZhbHVlICs9IHByZXYudmFsdWUgKyB2YWx1ZTtcbiAgICAgICAgcHJldiA9IGJlZm9yZTtcbiAgICAgICAgYmxvY2sucmFuZ2VzLS07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2RvdCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGV4dFxuICAgICAqL1xuXG4gICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gIH1cblxuICAvLyBNYXJrIGltYmFsYW5jZWQgYnJhY2VzIGFuZCBicmFja2V0cyBhcyBpbnZhbGlkXG4gIGRvIHtcbiAgICBibG9jayA9IHN0YWNrLnBvcCgpO1xuXG4gICAgaWYgKGJsb2NrLnR5cGUgIT09ICdyb290Jykge1xuICAgICAgYmxvY2subm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgaWYgKCFub2RlLm5vZGVzKSB7XG4gICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ29wZW4nKSBub2RlLmlzT3BlbiA9IHRydWU7XG4gICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ2Nsb3NlJykgbm9kZS5pc0Nsb3NlID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoIW5vZGUubm9kZXMpIG5vZGUudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICBub2RlLmludmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gZ2V0IHRoZSBsb2NhdGlvbiBvZiB0aGUgYmxvY2sgb24gcGFyZW50Lm5vZGVzIChibG9jaydzIHNpYmxpbmdzKVxuICAgICAgbGV0IHBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgbGV0IGluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2YoYmxvY2spO1xuICAgICAgLy8gcmVwbGFjZSB0aGUgKGludmFsaWQpIGJsb2NrIHdpdGggaXQncyBub2Rlc1xuICAgICAgcGFyZW50Lm5vZGVzLnNwbGljZShpbmRleCwgMSwgLi4uYmxvY2subm9kZXMpO1xuICAgIH1cbiAgfSB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCk7XG5cbiAgcHVzaCh7IHR5cGU6ICdlb3MnIH0pO1xuICByZXR1cm4gYXN0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vbGliL3N0cmluZ2lmeScpO1xuY29uc3QgY29tcGlsZSA9IHJlcXVpcmUoJy4vbGliL2NvbXBpbGUnKTtcbmNvbnN0IGV4cGFuZCA9IHJlcXVpcmUoJy4vbGliL2V4cGFuZCcpO1xuY29uc3QgcGFyc2UgPSByZXF1aXJlKCcuL2xpYi9wYXJzZScpO1xuXG4vKipcbiAqIEV4cGFuZCB0aGUgZ2l2ZW4gcGF0dGVybiBvciBjcmVhdGUgYSByZWdleC1jb21wYXRpYmxlIHN0cmluZy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYnJhY2VzID0gcmVxdWlyZSgnYnJhY2VzJyk7XG4gKiBjb25zb2xlLmxvZyhicmFjZXMoJ3thLGIsY30nLCB7IGNvbXBpbGU6IHRydWUgfSkpOyAvLz0+IFsnKGF8YnxjKSddXG4gKiBjb25zb2xlLmxvZyhicmFjZXMoJ3thLGIsY30nKSk7IC8vPT4gWydhJywgJ2InLCAnYyddXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jb25zdCBicmFjZXMgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgb3V0cHV0ID0gW107XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgZm9yIChsZXQgcGF0dGVybiBvZiBpbnB1dCkge1xuICAgICAgbGV0IHJlc3VsdCA9IGJyYWNlcy5jcmVhdGUocGF0dGVybiwgb3B0aW9ucyk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKC4uLnJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaChyZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBbXS5jb25jYXQoYnJhY2VzLmNyZWF0ZShpbnB1dCwgb3B0aW9ucykpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5leHBhbmQgPT09IHRydWUgJiYgb3B0aW9ucy5ub2R1cGVzID09PSB0cnVlKSB7XG4gICAgb3V0cHV0ID0gWy4uLm5ldyBTZXQob3V0cHV0KV07XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIHdpdGggdGhlIGdpdmVuIGBvcHRpb25zYC5cbiAqXG4gKiBgYGBqc1xuICogLy8gYnJhY2VzLnBhcnNlKHBhdHRlcm4sIFssIG9wdGlvbnNdKTtcbiAqIGNvbnN0IGFzdCA9IGJyYWNlcy5wYXJzZSgnYS97YixjfS9kJyk7XG4gKiBjb25zb2xlLmxvZyhhc3QpO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0dGVybiBCcmFjZSBwYXR0ZXJuIHRvIHBhcnNlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIEFTVFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5icmFjZXMucGFyc2UgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4gcGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBicmFjZXMgc3RyaW5nIGZyb20gYW4gQVNULCBvciBhbiBBU1Qgbm9kZS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYnJhY2VzID0gcmVxdWlyZSgnYnJhY2VzJyk7XG4gKiBsZXQgYXN0ID0gYnJhY2VzLnBhcnNlKCdmb28ve2EsYn0vYmFyJyk7XG4gKiBjb25zb2xlLmxvZyhzdHJpbmdpZnkoYXN0Lm5vZGVzWzJdKSk7IC8vPT4gJ3thLGJ9J1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBCcmFjZSBwYXR0ZXJuIG9yIEFTVC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLnN0cmluZ2lmeSA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeShicmFjZXMucGFyc2UoaW5wdXQsIG9wdGlvbnMpLCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gc3RyaW5naWZ5KGlucHV0LCBvcHRpb25zKTtcbn07XG5cbi8qKlxuICogQ29tcGlsZXMgYSBicmFjZSBwYXR0ZXJuIGludG8gYSByZWdleC1jb21wYXRpYmxlLCBvcHRpbWl6ZWQgc3RyaW5nLlxuICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBtYWluIFticmFjZXNdKCNicmFjZXMpIGZ1bmN0aW9uIGJ5IGRlZmF1bHQuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuICogY29uc29sZS5sb2coYnJhY2VzLmNvbXBpbGUoJ2Eve2IsY30vZCcpKTtcbiAqIC8vPT4gWydhLyhifGMpL2QnXVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBCcmFjZSBwYXR0ZXJuIG9yIEFTVC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLmNvbXBpbGUgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgIGlucHV0ID0gYnJhY2VzLnBhcnNlKGlucHV0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gY29tcGlsZShpbnB1dCwgb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEV4cGFuZHMgYSBicmFjZSBwYXR0ZXJuIGludG8gYW4gYXJyYXkuIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGVcbiAqIG1haW4gW2JyYWNlc10oI2JyYWNlcykgZnVuY3Rpb24gd2hlbiBgb3B0aW9ucy5leHBhbmRgIGlzIHRydWUuIEJlZm9yZVxuICogdXNpbmcgdGhpcyBtZXRob2QgaXQncyByZWNvbW1lbmRlZCB0aGF0IHlvdSByZWFkIHRoZSBbcGVyZm9ybWFuY2Ugbm90ZXNdKCNwZXJmb3JtYW5jZSkpXG4gKiBhbmQgYWR2YW50YWdlcyBvZiB1c2luZyBbLmNvbXBpbGVdKCNjb21waWxlKSBpbnN0ZWFkLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBicmFjZXMgPSByZXF1aXJlKCdicmFjZXMnKTtcbiAqIGNvbnNvbGUubG9nKGJyYWNlcy5leHBhbmQoJ2Eve2IsY30vZCcpKTtcbiAqIC8vPT4gWydhL2IvZCcsICdhL2MvZCddO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHBhdHRlcm5gIEJyYWNlIHBhdHRlcm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLmV4cGFuZCA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgaW5wdXQgPSBicmFjZXMucGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgbGV0IHJlc3VsdCA9IGV4cGFuZChpbnB1dCwgb3B0aW9ucyk7XG5cbiAgLy8gZmlsdGVyIG91dCBlbXB0eSBzdHJpbmdzIGlmIHNwZWNpZmllZFxuICBpZiAob3B0aW9ucy5ub2VtcHR5ID09PSB0cnVlKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcihCb29sZWFuKTtcbiAgfVxuXG4gIC8vIGZpbHRlciBvdXQgZHVwbGljYXRlcyBpZiBzcGVjaWZpZWRcbiAgaWYgKG9wdGlvbnMubm9kdXBlcyA9PT0gdHJ1ZSkge1xuICAgIHJlc3VsdCA9IFsuLi5uZXcgU2V0KHJlc3VsdCldO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUHJvY2Vzc2VzIGEgYnJhY2UgcGF0dGVybiBhbmQgcmV0dXJucyBlaXRoZXIgYW4gZXhwYW5kZWQgYXJyYXlcbiAqIChpZiBgb3B0aW9ucy5leHBhbmRgIGlzIHRydWUpLCBhIGhpZ2hseSBvcHRpbWl6ZWQgcmVnZXgtY29tcGF0aWJsZSBzdHJpbmcuXG4gKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIG1haW4gW2JyYWNlc10oI2JyYWNlcykgZnVuY3Rpb24uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuICogY29uc29sZS5sb2coYnJhY2VzLmNyZWF0ZSgndXNlci17MjAwLi4zMDB9L3Byb2plY3Qte2EsYixjfS17MS4uMTB9JykpXG4gKiAvLz0+ICd1c2VyLSgyMFswLTldfDJbMS05XVswLTldfDMwMCkvcHJvamVjdC0oYXxifGMpLShbMS05XXwxMCknXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgcGF0dGVybmAgQnJhY2UgcGF0dGVyblxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgZXhwYW5kZWQgdmFsdWVzLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5icmFjZXMuY3JlYXRlID0gKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKGlucHV0ID09PSAnJyB8fCBpbnB1dC5sZW5ndGggPCAzKSB7XG4gICAgcmV0dXJuIFtpbnB1dF07XG4gIH1cblxuIHJldHVybiBvcHRpb25zLmV4cGFuZCAhPT0gdHJ1ZVxuICAgID8gYnJhY2VzLmNvbXBpbGUoaW5wdXQsIG9wdGlvbnMpXG4gICAgOiBicmFjZXMuZXhwYW5kKGlucHV0LCBvcHRpb25zKTtcbn07XG5cbi8qKlxuICogRXhwb3NlIFwiYnJhY2VzXCJcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJyYWNlcztcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBXSU5fU0xBU0ggPSAnXFxcXFxcXFwvJztcbmNvbnN0IFdJTl9OT19TTEFTSCA9IGBbXiR7V0lOX1NMQVNIfV1gO1xuXG4vKipcbiAqIFBvc2l4IGdsb2IgcmVnZXhcbiAqL1xuXG5jb25zdCBET1RfTElURVJBTCA9ICdcXFxcLic7XG5jb25zdCBQTFVTX0xJVEVSQUwgPSAnXFxcXCsnO1xuY29uc3QgUU1BUktfTElURVJBTCA9ICdcXFxcPyc7XG5jb25zdCBTTEFTSF9MSVRFUkFMID0gJ1xcXFwvJztcbmNvbnN0IE9ORV9DSEFSID0gJyg/PS4pJztcbmNvbnN0IFFNQVJLID0gJ1teL10nO1xuY29uc3QgRU5EX0FOQ0hPUiA9IGAoPzoke1NMQVNIX0xJVEVSQUx9fCQpYDtcbmNvbnN0IFNUQVJUX0FOQ0hPUiA9IGAoPzpefCR7U0xBU0hfTElURVJBTH0pYDtcbmNvbnN0IERPVFNfU0xBU0ggPSBgJHtET1RfTElURVJBTH17MSwyfSR7RU5EX0FOQ0hPUn1gO1xuY29uc3QgTk9fRE9UID0gYCg/ISR7RE9UX0xJVEVSQUx9KWA7XG5jb25zdCBOT19ET1RTID0gYCg/ISR7U1RBUlRfQU5DSE9SfSR7RE9UU19TTEFTSH0pYDtcbmNvbnN0IE5PX0RPVF9TTEFTSCA9IGAoPyEke0RPVF9MSVRFUkFMfXswLDF9JHtFTkRfQU5DSE9SfSlgO1xuY29uc3QgTk9fRE9UU19TTEFTSCA9IGAoPyEke0RPVFNfU0xBU0h9KWA7XG5jb25zdCBRTUFSS19OT19ET1QgPSBgW14uJHtTTEFTSF9MSVRFUkFMfV1gO1xuY29uc3QgU1RBUiA9IGAke1FNQVJLfSo/YDtcblxuY29uc3QgUE9TSVhfQ0hBUlMgPSB7XG4gIERPVF9MSVRFUkFMLFxuICBQTFVTX0xJVEVSQUwsXG4gIFFNQVJLX0xJVEVSQUwsXG4gIFNMQVNIX0xJVEVSQUwsXG4gIE9ORV9DSEFSLFxuICBRTUFSSyxcbiAgRU5EX0FOQ0hPUixcbiAgRE9UU19TTEFTSCxcbiAgTk9fRE9ULFxuICBOT19ET1RTLFxuICBOT19ET1RfU0xBU0gsXG4gIE5PX0RPVFNfU0xBU0gsXG4gIFFNQVJLX05PX0RPVCxcbiAgU1RBUixcbiAgU1RBUlRfQU5DSE9SXG59O1xuXG4vKipcbiAqIFdpbmRvd3MgZ2xvYiByZWdleFxuICovXG5cbmNvbnN0IFdJTkRPV1NfQ0hBUlMgPSB7XG4gIC4uLlBPU0lYX0NIQVJTLFxuXG4gIFNMQVNIX0xJVEVSQUw6IGBbJHtXSU5fU0xBU0h9XWAsXG4gIFFNQVJLOiBXSU5fTk9fU0xBU0gsXG4gIFNUQVI6IGAke1dJTl9OT19TTEFTSH0qP2AsXG4gIERPVFNfU0xBU0g6IGAke0RPVF9MSVRFUkFMfXsxLDJ9KD86WyR7V0lOX1NMQVNIfV18JClgLFxuICBOT19ET1Q6IGAoPyEke0RPVF9MSVRFUkFMfSlgLFxuICBOT19ET1RTOiBgKD8hKD86XnxbJHtXSU5fU0xBU0h9XSkke0RPVF9MSVRFUkFMfXsxLDJ9KD86WyR7V0lOX1NMQVNIfV18JCkpYCxcbiAgTk9fRE9UX1NMQVNIOiBgKD8hJHtET1RfTElURVJBTH17MCwxfSg/Olske1dJTl9TTEFTSH1dfCQpKWAsXG4gIE5PX0RPVFNfU0xBU0g6IGAoPyEke0RPVF9MSVRFUkFMfXsxLDJ9KD86WyR7V0lOX1NMQVNIfV18JCkpYCxcbiAgUU1BUktfTk9fRE9UOiBgW14uJHtXSU5fU0xBU0h9XWAsXG4gIFNUQVJUX0FOQ0hPUjogYCg/Ol58WyR7V0lOX1NMQVNIfV0pYCxcbiAgRU5EX0FOQ0hPUjogYCg/Olske1dJTl9TTEFTSH1dfCQpYFxufTtcblxuLyoqXG4gKiBQT1NJWCBCcmFja2V0IFJlZ2V4XG4gKi9cblxuY29uc3QgUE9TSVhfUkVHRVhfU09VUkNFID0ge1xuICBhbG51bTogJ2EtekEtWjAtOScsXG4gIGFscGhhOiAnYS16QS1aJyxcbiAgYXNjaWk6ICdcXFxceDAwLVxcXFx4N0YnLFxuICBibGFuazogJyBcXFxcdCcsXG4gIGNudHJsOiAnXFxcXHgwMC1cXFxceDFGXFxcXHg3RicsXG4gIGRpZ2l0OiAnMC05JyxcbiAgZ3JhcGg6ICdcXFxceDIxLVxcXFx4N0UnLFxuICBsb3dlcjogJ2EteicsXG4gIHByaW50OiAnXFxcXHgyMC1cXFxceDdFICcsXG4gIHB1bmN0OiAnXFxcXC0hXCIjJCUmXFwnKClcXFxcKissLi86Ozw9Pj9AW1xcXFxdXl9ge3x9ficsXG4gIHNwYWNlOiAnIFxcXFx0XFxcXHJcXFxcblxcXFx2XFxcXGYnLFxuICB1cHBlcjogJ0EtWicsXG4gIHdvcmQ6ICdBLVphLXowLTlfJyxcbiAgeGRpZ2l0OiAnQS1GYS1mMC05J1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1BWF9MRU5HVEg6IDEwMjQgKiA2NCxcbiAgUE9TSVhfUkVHRVhfU09VUkNFLFxuXG4gIC8vIHJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAgUkVHRVhfQkFDS1NMQVNIOiAvXFxcXCg/IVsqKz9eJHt9KHwpW1xcXV0pL2csXG4gIFJFR0VYX05PTl9TUEVDSUFMX0NIQVJTOiAvXlteQCFbXFxdLiwkKis/Xnt9KCl8XFxcXC9dKy8sXG4gIFJFR0VYX1NQRUNJQUxfQ0hBUlM6IC9bLSorPy5eJHt9KHwpW1xcXV0vLFxuICBSRUdFWF9TUEVDSUFMX0NIQVJTX0JBQ0tSRUY6IC8oXFxcXD8pKChcXFcpKFxcMyopKS9nLFxuICBSRUdFWF9TUEVDSUFMX0NIQVJTX0dMT0JBTDogLyhbLSorPy5eJHt9KHwpW1xcXV0pL2csXG4gIFJFR0VYX1JFTU9WRV9CQUNLU0xBU0g6IC8oPzpcXFsuKj9bXlxcXFxdXFxdfFxcXFwoPz0uKSkvZyxcblxuICAvLyBSZXBsYWNlIGdsb2JzIHdpdGggZXF1aXZhbGVudCBwYXR0ZXJucyB0byByZWR1Y2UgcGFyc2luZyB0aW1lLlxuICBSRVBMQUNFTUVOVFM6IHtcbiAgICAnKioqJzogJyonLFxuICAgICcqKi8qKic6ICcqKicsXG4gICAgJyoqLyoqLyoqJzogJyoqJ1xuICB9LFxuXG4gIC8vIERpZ2l0c1xuICBDSEFSXzA6IDQ4LCAvKiAwICovXG4gIENIQVJfOTogNTcsIC8qIDkgKi9cblxuICAvLyBBbHBoYWJldCBjaGFycy5cbiAgQ0hBUl9VUFBFUkNBU0VfQTogNjUsIC8qIEEgKi9cbiAgQ0hBUl9MT1dFUkNBU0VfQTogOTcsIC8qIGEgKi9cbiAgQ0hBUl9VUFBFUkNBU0VfWjogOTAsIC8qIFogKi9cbiAgQ0hBUl9MT1dFUkNBU0VfWjogMTIyLCAvKiB6ICovXG5cbiAgQ0hBUl9MRUZUX1BBUkVOVEhFU0VTOiA0MCwgLyogKCAqL1xuICBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTOiA0MSwgLyogKSAqL1xuXG4gIENIQVJfQVNURVJJU0s6IDQyLCAvKiAqICovXG5cbiAgLy8gTm9uLWFscGhhYmV0aWMgY2hhcnMuXG4gIENIQVJfQU1QRVJTQU5EOiAzOCwgLyogJiAqL1xuICBDSEFSX0FUOiA2NCwgLyogQCAqL1xuICBDSEFSX0JBQ0tXQVJEX1NMQVNIOiA5MiwgLyogXFwgKi9cbiAgQ0hBUl9DQVJSSUFHRV9SRVRVUk46IDEzLCAvKiBcXHIgKi9cbiAgQ0hBUl9DSVJDVU1GTEVYX0FDQ0VOVDogOTQsIC8qIF4gKi9cbiAgQ0hBUl9DT0xPTjogNTgsIC8qIDogKi9cbiAgQ0hBUl9DT01NQTogNDQsIC8qICwgKi9cbiAgQ0hBUl9ET1Q6IDQ2LCAvKiAuICovXG4gIENIQVJfRE9VQkxFX1FVT1RFOiAzNCwgLyogXCIgKi9cbiAgQ0hBUl9FUVVBTDogNjEsIC8qID0gKi9cbiAgQ0hBUl9FWENMQU1BVElPTl9NQVJLOiAzMywgLyogISAqL1xuICBDSEFSX0ZPUk1fRkVFRDogMTIsIC8qIFxcZiAqL1xuICBDSEFSX0ZPUldBUkRfU0xBU0g6IDQ3LCAvKiAvICovXG4gIENIQVJfR1JBVkVfQUNDRU5UOiA5NiwgLyogYCAqL1xuICBDSEFSX0hBU0g6IDM1LCAvKiAjICovXG4gIENIQVJfSFlQSEVOX01JTlVTOiA0NSwgLyogLSAqL1xuICBDSEFSX0xFRlRfQU5HTEVfQlJBQ0tFVDogNjAsIC8qIDwgKi9cbiAgQ0hBUl9MRUZUX0NVUkxZX0JSQUNFOiAxMjMsIC8qIHsgKi9cbiAgQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUOiA5MSwgLyogWyAqL1xuICBDSEFSX0xJTkVfRkVFRDogMTAsIC8qIFxcbiAqL1xuICBDSEFSX05PX0JSRUFLX1NQQUNFOiAxNjAsIC8qIFxcdTAwQTAgKi9cbiAgQ0hBUl9QRVJDRU5UOiAzNywgLyogJSAqL1xuICBDSEFSX1BMVVM6IDQzLCAvKiArICovXG4gIENIQVJfUVVFU1RJT05fTUFSSzogNjMsIC8qID8gKi9cbiAgQ0hBUl9SSUdIVF9BTkdMRV9CUkFDS0VUOiA2MiwgLyogPiAqL1xuICBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFOiAxMjUsIC8qIH0gKi9cbiAgQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVDogOTMsIC8qIF0gKi9cbiAgQ0hBUl9TRU1JQ09MT046IDU5LCAvKiA7ICovXG4gIENIQVJfU0lOR0xFX1FVT1RFOiAzOSwgLyogJyAqL1xuICBDSEFSX1NQQUNFOiAzMiwgLyogICAqL1xuICBDSEFSX1RBQjogOSwgLyogXFx0ICovXG4gIENIQVJfVU5ERVJTQ09SRTogOTUsIC8qIF8gKi9cbiAgQ0hBUl9WRVJUSUNBTF9MSU5FOiAxMjQsIC8qIHwgKi9cbiAgQ0hBUl9aRVJPX1dJRFRIX05PQlJFQUtfU1BBQ0U6IDY1Mjc5LCAvKiBcXHVGRUZGICovXG5cbiAgU0VQOiBwYXRoLnNlcCxcblxuICAvKipcbiAgICogQ3JlYXRlIEVYVEdMT0JfQ0hBUlNcbiAgICovXG5cbiAgZXh0Z2xvYkNoYXJzKGNoYXJzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICchJzogeyB0eXBlOiAnbmVnYXRlJywgb3BlbjogJyg/Oig/ISg/OicsIGNsb3NlOiBgKSkke2NoYXJzLlNUQVJ9KWAgfSxcbiAgICAgICc/JzogeyB0eXBlOiAncW1hcmsnLCBvcGVuOiAnKD86JywgY2xvc2U6ICcpPycgfSxcbiAgICAgICcrJzogeyB0eXBlOiAncGx1cycsIG9wZW46ICcoPzonLCBjbG9zZTogJykrJyB9LFxuICAgICAgJyonOiB7IHR5cGU6ICdzdGFyJywgb3BlbjogJyg/OicsIGNsb3NlOiAnKSonIH0sXG4gICAgICAnQCc6IHsgdHlwZTogJ2F0Jywgb3BlbjogJyg/OicsIGNsb3NlOiAnKScgfVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBHTE9CX0NIQVJTXG4gICAqL1xuXG4gIGdsb2JDaGFycyh3aW4zMikge1xuICAgIHJldHVybiB3aW4zMiA9PT0gdHJ1ZSA/IFdJTkRPV1NfQ0hBUlMgOiBQT1NJWF9DSEFSUztcbiAgfVxufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCB3aW4zMiA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG5jb25zdCB7XG4gIFJFR0VYX0JBQ0tTTEFTSCxcbiAgUkVHRVhfUkVNT1ZFX0JBQ0tTTEFTSCxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSUyxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSU19HTE9CQUxcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG5leHBvcnRzLmlzT2JqZWN0ID0gdmFsID0+IHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xuZXhwb3J0cy5oYXNSZWdleENoYXJzID0gc3RyID0+IFJFR0VYX1NQRUNJQUxfQ0hBUlMudGVzdChzdHIpO1xuZXhwb3J0cy5pc1JlZ2V4Q2hhciA9IHN0ciA9PiBzdHIubGVuZ3RoID09PSAxICYmIGV4cG9ydHMuaGFzUmVnZXhDaGFycyhzdHIpO1xuZXhwb3J0cy5lc2NhcGVSZWdleCA9IHN0ciA9PiBzdHIucmVwbGFjZShSRUdFWF9TUEVDSUFMX0NIQVJTX0dMT0JBTCwgJ1xcXFwkMScpO1xuZXhwb3J0cy50b1Bvc2l4U2xhc2hlcyA9IHN0ciA9PiBzdHIucmVwbGFjZShSRUdFWF9CQUNLU0xBU0gsICcvJyk7XG5cbmV4cG9ydHMucmVtb3ZlQmFja3NsYXNoZXMgPSBzdHIgPT4ge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoUkVHRVhfUkVNT1ZFX0JBQ0tTTEFTSCwgbWF0Y2ggPT4ge1xuICAgIHJldHVybiBtYXRjaCA9PT0gJ1xcXFwnID8gJycgOiBtYXRjaDtcbiAgfSk7XG59O1xuXG5leHBvcnRzLnN1cHBvcnRzTG9va2JlaGluZHMgPSAoKSA9PiB7XG4gIGNvbnN0IHNlZ3MgPSBwcm9jZXNzLnZlcnNpb24uc2xpY2UoMSkuc3BsaXQoJy4nKS5tYXAoTnVtYmVyKTtcbiAgaWYgKHNlZ3MubGVuZ3RoID09PSAzICYmIHNlZ3NbMF0gPj0gOSB8fCAoc2Vnc1swXSA9PT0gOCAmJiBzZWdzWzFdID49IDEwKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydHMuaXNXaW5kb3dzID0gb3B0aW9ucyA9PiB7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLndpbmRvd3MgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBvcHRpb25zLndpbmRvd3M7XG4gIH1cbiAgcmV0dXJuIHdpbjMyID09PSB0cnVlIHx8IHBhdGguc2VwID09PSAnXFxcXCc7XG59O1xuXG5leHBvcnRzLmVzY2FwZUxhc3QgPSAoaW5wdXQsIGNoYXIsIGxhc3RJZHgpID0+IHtcbiAgY29uc3QgaWR4ID0gaW5wdXQubGFzdEluZGV4T2YoY2hhciwgbGFzdElkeCk7XG4gIGlmIChpZHggPT09IC0xKSByZXR1cm4gaW5wdXQ7XG4gIGlmIChpbnB1dFtpZHggLSAxXSA9PT0gJ1xcXFwnKSByZXR1cm4gZXhwb3J0cy5lc2NhcGVMYXN0KGlucHV0LCBjaGFyLCBpZHggLSAxKTtcbiAgcmV0dXJuIGAke2lucHV0LnNsaWNlKDAsIGlkeCl9XFxcXCR7aW5wdXQuc2xpY2UoaWR4KX1gO1xufTtcblxuZXhwb3J0cy5yZW1vdmVQcmVmaXggPSAoaW5wdXQsIHN0YXRlID0ge30pID0+IHtcbiAgbGV0IG91dHB1dCA9IGlucHV0O1xuICBpZiAob3V0cHV0LnN0YXJ0c1dpdGgoJy4vJykpIHtcbiAgICBvdXRwdXQgPSBvdXRwdXQuc2xpY2UoMik7XG4gICAgc3RhdGUucHJlZml4ID0gJy4vJztcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufTtcblxuZXhwb3J0cy53cmFwT3V0cHV0ID0gKGlucHV0LCBzdGF0ZSA9IHt9LCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgcHJlcGVuZCA9IG9wdGlvbnMuY29udGFpbnMgPyAnJyA6ICdeJztcbiAgY29uc3QgYXBwZW5kID0gb3B0aW9ucy5jb250YWlucyA/ICcnIDogJyQnO1xuXG4gIGxldCBvdXRwdXQgPSBgJHtwcmVwZW5kfSg/OiR7aW5wdXR9KSR7YXBwZW5kfWA7XG4gIGlmIChzdGF0ZS5uZWdhdGVkID09PSB0cnVlKSB7XG4gICAgb3V0cHV0ID0gYCg/Ol4oPyEke291dHB1dH0pLiokKWA7XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IHtcbiAgQ0hBUl9BU1RFUklTSywgICAgICAgICAgICAgLyogKiAqL1xuICBDSEFSX0FULCAgICAgICAgICAgICAgICAgICAvKiBAICovXG4gIENIQVJfQkFDS1dBUkRfU0xBU0gsICAgICAgIC8qIFxcICovXG4gIENIQVJfQ09NTUEsICAgICAgICAgICAgICAgIC8qICwgKi9cbiAgQ0hBUl9ET1QsICAgICAgICAgICAgICAgICAgLyogLiAqL1xuICBDSEFSX0VYQ0xBTUFUSU9OX01BUkssICAgICAvKiAhICovXG4gIENIQVJfRk9SV0FSRF9TTEFTSCwgICAgICAgIC8qIC8gKi9cbiAgQ0hBUl9MRUZUX0NVUkxZX0JSQUNFLCAgICAgLyogeyAqL1xuICBDSEFSX0xFRlRfUEFSRU5USEVTRVMsICAgICAvKiAoICovXG4gIENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVCwgIC8qIFsgKi9cbiAgQ0hBUl9QTFVTLCAgICAgICAgICAgICAgICAgLyogKyAqL1xuICBDSEFSX1FVRVNUSU9OX01BUkssICAgICAgICAvKiA/ICovXG4gIENIQVJfUklHSFRfQ1VSTFlfQlJBQ0UsICAgIC8qIH0gKi9cbiAgQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUywgICAgLyogKSAqL1xuICBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUICAvKiBdICovXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuY29uc3QgaXNQYXRoU2VwYXJhdG9yID0gY29kZSA9PiB7XG4gIHJldHVybiBjb2RlID09PSBDSEFSX0ZPUldBUkRfU0xBU0ggfHwgY29kZSA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSDtcbn07XG5cbmNvbnN0IGRlcHRoID0gdG9rZW4gPT4ge1xuICBpZiAodG9rZW4uaXNQcmVmaXggIT09IHRydWUpIHtcbiAgICB0b2tlbi5kZXB0aCA9IHRva2VuLmlzR2xvYnN0YXIgPyBJbmZpbml0eSA6IDE7XG4gIH1cbn07XG5cbi8qKlxuICogUXVpY2tseSBzY2FucyBhIGdsb2IgcGF0dGVybiBhbmQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIGhhbmRmdWwgb2ZcbiAqIHVzZWZ1bCBwcm9wZXJ0aWVzLCBsaWtlIGBpc0dsb2JgLCBgcGF0aGAgKHRoZSBsZWFkaW5nIG5vbi1nbG9iLCBpZiBpdCBleGlzdHMpLFxuICogYGdsb2JgICh0aGUgYWN0dWFsIHBhdHRlcm4pLCBhbmQgYG5lZ2F0ZWRgICh0cnVlIGlmIHRoZSBwYXRoIHN0YXJ0cyB3aXRoIGAhYCkuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBtID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiBjb25zb2xlLmxvZyhwbS5zY2FuKCdmb28vYmFyLyouanMnKSk7XG4gKiB7IGlzR2xvYjogdHJ1ZSwgaW5wdXQ6ICdmb28vYmFyLyouanMnLCBiYXNlOiAnZm9vL2JhcicsIGdsb2I6ICcqLmpzJyB9XG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRva2VucyBhbmQgcmVnZXggc291cmNlIHN0cmluZy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuY29uc3Qgc2NhbiA9IChpbnB1dCwgb3B0aW9ucykgPT4ge1xuICBjb25zdCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcblxuICBjb25zdCBsZW5ndGggPSBpbnB1dC5sZW5ndGggLSAxO1xuICBjb25zdCBzY2FuVG9FbmQgPSBvcHRzLnBhcnRzID09PSB0cnVlIHx8IG9wdHMuc2NhblRvRW5kID09PSB0cnVlO1xuICBjb25zdCBzbGFzaGVzID0gW107XG4gIGNvbnN0IHRva2VucyA9IFtdO1xuICBjb25zdCBwYXJ0cyA9IFtdO1xuXG4gIGxldCBzdHIgPSBpbnB1dDtcbiAgbGV0IGluZGV4ID0gLTE7XG4gIGxldCBzdGFydCA9IDA7XG4gIGxldCBsYXN0SW5kZXggPSAwO1xuICBsZXQgaXNCcmFjZSA9IGZhbHNlO1xuICBsZXQgaXNCcmFja2V0ID0gZmFsc2U7XG4gIGxldCBpc0dsb2IgPSBmYWxzZTtcbiAgbGV0IGlzRXh0Z2xvYiA9IGZhbHNlO1xuICBsZXQgaXNHbG9ic3RhciA9IGZhbHNlO1xuICBsZXQgYnJhY2VFc2NhcGVkID0gZmFsc2U7XG4gIGxldCBiYWNrc2xhc2hlcyA9IGZhbHNlO1xuICBsZXQgbmVnYXRlZCA9IGZhbHNlO1xuICBsZXQgZmluaXNoZWQgPSBmYWxzZTtcbiAgbGV0IGJyYWNlcyA9IDA7XG4gIGxldCBwcmV2O1xuICBsZXQgY29kZTtcbiAgbGV0IHRva2VuID0geyB2YWx1ZTogJycsIGRlcHRoOiAwLCBpc0dsb2I6IGZhbHNlIH07XG5cbiAgY29uc3QgZW9zID0gKCkgPT4gaW5kZXggPj0gbGVuZ3RoO1xuICBjb25zdCBwZWVrID0gKCkgPT4gc3RyLmNoYXJDb2RlQXQoaW5kZXggKyAxKTtcbiAgY29uc3QgYWR2YW5jZSA9ICgpID0+IHtcbiAgICBwcmV2ID0gY29kZTtcbiAgICByZXR1cm4gc3RyLmNoYXJDb2RlQXQoKytpbmRleCk7XG4gIH07XG5cbiAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgY29kZSA9IGFkdmFuY2UoKTtcbiAgICBsZXQgbmV4dDtcblxuICAgIGlmIChjb2RlID09PSBDSEFSX0JBQ0tXQVJEX1NMQVNIKSB7XG4gICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgIGNvZGUgPSBhZHZhbmNlKCk7XG5cbiAgICAgIGlmIChjb2RlID09PSBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgICAgYnJhY2VFc2NhcGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChicmFjZUVzY2FwZWQgPT09IHRydWUgfHwgY29kZSA9PT0gQ0hBUl9MRUZUX0NVUkxZX0JSQUNFKSB7XG4gICAgICBicmFjZXMrKztcblxuICAgICAgd2hpbGUgKGVvcygpICE9PSB0cnVlICYmIChjb2RlID0gYWR2YW5jZSgpKSkge1xuICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSCkge1xuICAgICAgICAgIGJhY2tzbGFzaGVzID0gdG9rZW4uYmFja3NsYXNoZXMgPSB0cnVlO1xuICAgICAgICAgIGFkdmFuY2UoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2RlID09PSBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgICAgICBicmFjZXMrKztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChicmFjZUVzY2FwZWQgIT09IHRydWUgJiYgY29kZSA9PT0gQ0hBUl9ET1QgJiYgKGNvZGUgPSBhZHZhbmNlKCkpID09PSBDSEFSX0RPVCkge1xuICAgICAgICAgIGlzQnJhY2UgPSB0b2tlbi5pc0JyYWNlID0gdHJ1ZTtcbiAgICAgICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJyYWNlRXNjYXBlZCAhPT0gdHJ1ZSAmJiBjb2RlID09PSBDSEFSX0NPTU1BKSB7XG4gICAgICAgICAgaXNCcmFjZSA9IHRva2VuLmlzQnJhY2UgPSB0cnVlO1xuICAgICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRSkge1xuICAgICAgICAgIGJyYWNlcy0tO1xuXG4gICAgICAgICAgaWYgKGJyYWNlcyA9PT0gMCkge1xuICAgICAgICAgICAgYnJhY2VFc2NhcGVkID0gZmFsc2U7XG4gICAgICAgICAgICBpc0JyYWNlID0gdG9rZW4uaXNCcmFjZSA9IHRydWU7XG4gICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT09IENIQVJfRk9SV0FSRF9TTEFTSCkge1xuICAgICAgc2xhc2hlcy5wdXNoKGluZGV4KTtcbiAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgIHRva2VuID0geyB2YWx1ZTogJycsIGRlcHRoOiAwLCBpc0dsb2I6IGZhbHNlIH07XG5cbiAgICAgIGlmIChmaW5pc2hlZCA9PT0gdHJ1ZSkgY29udGludWU7XG4gICAgICBpZiAocHJldiA9PT0gQ0hBUl9ET1QgJiYgaW5kZXggPT09IChzdGFydCArIDEpKSB7XG4gICAgICAgIHN0YXJ0ICs9IDI7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsYXN0SW5kZXggPSBpbmRleCArIDE7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5ub2V4dCAhPT0gdHJ1ZSkge1xuICAgICAgY29uc3QgaXNFeHRnbG9iQ2hhciA9IGNvZGUgPT09IENIQVJfUExVU1xuICAgICAgICB8fCBjb2RlID09PSBDSEFSX0FUXG4gICAgICAgIHx8IGNvZGUgPT09IENIQVJfQVNURVJJU0tcbiAgICAgICAgfHwgY29kZSA9PT0gQ0hBUl9RVUVTVElPTl9NQVJLXG4gICAgICAgIHx8IGNvZGUgPT09IENIQVJfRVhDTEFNQVRJT05fTUFSSztcblxuICAgICAgaWYgKGlzRXh0Z2xvYkNoYXIgPT09IHRydWUgJiYgcGVlaygpID09PSBDSEFSX0xFRlRfUEFSRU5USEVTRVMpIHtcbiAgICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgICAgaXNFeHRnbG9iID0gdG9rZW4uaXNFeHRnbG9iID0gdHJ1ZTtcbiAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgICB3aGlsZSAoZW9zKCkgIT09IHRydWUgJiYgKGNvZGUgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSCkge1xuICAgICAgICAgICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY29kZSA9IGFkdmFuY2UoKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb2RlID09PSBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTKSB7XG4gICAgICAgICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlID09PSBDSEFSX0FTVEVSSVNLKSB7XG4gICAgICBpZiAocHJldiA9PT0gQ0hBUl9BU1RFUklTSykgaXNHbG9ic3RhciA9IHRva2VuLmlzR2xvYnN0YXIgPSB0cnVlO1xuICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChjb2RlID09PSBDSEFSX1FVRVNUSU9OX01BUkspIHtcbiAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICBmaW5pc2hlZCA9IHRydWU7XG5cbiAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoY29kZSA9PT0gQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUKSB7XG4gICAgICB3aGlsZSAoZW9zKCkgIT09IHRydWUgJiYgKG5leHQgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX0JBQ0tXQVJEX1NMQVNIKSB7XG4gICAgICAgICAgYmFja3NsYXNoZXMgPSB0b2tlbi5iYWNrc2xhc2hlcyA9IHRydWU7XG4gICAgICAgICAgYWR2YW5jZSgpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHQgPT09IENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgICAgICBpc0JyYWNrZXQgPSB0b2tlbi5pc0JyYWNrZXQgPSB0cnVlO1xuICAgICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdHMubm9uZWdhdGUgIT09IHRydWUgJiYgY29kZSA9PT0gQ0hBUl9FWENMQU1BVElPTl9NQVJLICYmIGluZGV4ID09PSBzdGFydCkge1xuICAgICAgbmVnYXRlZCA9IHRva2VuLm5lZ2F0ZWQgPSB0cnVlO1xuICAgICAgc3RhcnQrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChvcHRzLm5vcGFyZW4gIT09IHRydWUgJiYgY29kZSA9PT0gQ0hBUl9MRUZUX1BBUkVOVEhFU0VTKSB7XG4gICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuXG4gICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgIHdoaWxlIChlb3MoKSAhPT0gdHJ1ZSAmJiAoY29kZSA9IGFkdmFuY2UoKSkpIHtcbiAgICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9MRUZUX1BBUkVOVEhFU0VTKSB7XG4gICAgICAgICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvZGUgPSBhZHZhbmNlKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUykge1xuICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGlzR2xvYiA9PT0gdHJ1ZSkge1xuICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAob3B0cy5ub2V4dCA9PT0gdHJ1ZSkge1xuICAgIGlzRXh0Z2xvYiA9IGZhbHNlO1xuICAgIGlzR2xvYiA9IGZhbHNlO1xuICB9XG5cbiAgbGV0IGJhc2UgPSBzdHI7XG4gIGxldCBwcmVmaXggPSAnJztcbiAgbGV0IGdsb2IgPSAnJztcblxuICBpZiAoc3RhcnQgPiAwKSB7XG4gICAgcHJlZml4ID0gc3RyLnNsaWNlKDAsIHN0YXJ0KTtcbiAgICBzdHIgPSBzdHIuc2xpY2Uoc3RhcnQpO1xuICAgIGxhc3RJbmRleCAtPSBzdGFydDtcbiAgfVxuXG4gIGlmIChiYXNlICYmIGlzR2xvYiA9PT0gdHJ1ZSAmJiBsYXN0SW5kZXggPiAwKSB7XG4gICAgYmFzZSA9IHN0ci5zbGljZSgwLCBsYXN0SW5kZXgpO1xuICAgIGdsb2IgPSBzdHIuc2xpY2UobGFzdEluZGV4KTtcbiAgfSBlbHNlIGlmIChpc0dsb2IgPT09IHRydWUpIHtcbiAgICBiYXNlID0gJyc7XG4gICAgZ2xvYiA9IHN0cjtcbiAgfSBlbHNlIHtcbiAgICBiYXNlID0gc3RyO1xuICB9XG5cbiAgaWYgKGJhc2UgJiYgYmFzZSAhPT0gJycgJiYgYmFzZSAhPT0gJy8nICYmIGJhc2UgIT09IHN0cikge1xuICAgIGlmIChpc1BhdGhTZXBhcmF0b3IoYmFzZS5jaGFyQ29kZUF0KGJhc2UubGVuZ3RoIC0gMSkpKSB7XG4gICAgICBiYXNlID0gYmFzZS5zbGljZSgwLCAtMSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9wdHMudW5lc2NhcGUgPT09IHRydWUpIHtcbiAgICBpZiAoZ2xvYikgZ2xvYiA9IHV0aWxzLnJlbW92ZUJhY2tzbGFzaGVzKGdsb2IpO1xuXG4gICAgaWYgKGJhc2UgJiYgYmFja3NsYXNoZXMgPT09IHRydWUpIHtcbiAgICAgIGJhc2UgPSB1dGlscy5yZW1vdmVCYWNrc2xhc2hlcyhiYXNlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBwcmVmaXgsXG4gICAgaW5wdXQsXG4gICAgc3RhcnQsXG4gICAgYmFzZSxcbiAgICBnbG9iLFxuICAgIGlzQnJhY2UsXG4gICAgaXNCcmFja2V0LFxuICAgIGlzR2xvYixcbiAgICBpc0V4dGdsb2IsXG4gICAgaXNHbG9ic3RhcixcbiAgICBuZWdhdGVkXG4gIH07XG5cbiAgaWYgKG9wdHMudG9rZW5zID09PSB0cnVlKSB7XG4gICAgc3RhdGUubWF4RGVwdGggPSAwO1xuICAgIGlmICghaXNQYXRoU2VwYXJhdG9yKGNvZGUpKSB7XG4gICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgfVxuICAgIHN0YXRlLnRva2VucyA9IHRva2VucztcbiAgfVxuXG4gIGlmIChvcHRzLnBhcnRzID09PSB0cnVlIHx8IG9wdHMudG9rZW5zID09PSB0cnVlKSB7XG4gICAgbGV0IHByZXZJbmRleDtcblxuICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHNsYXNoZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgY29uc3QgbiA9IHByZXZJbmRleCA/IHByZXZJbmRleCArIDEgOiBzdGFydDtcbiAgICAgIGNvbnN0IGkgPSBzbGFzaGVzW2lkeF07XG4gICAgICBjb25zdCB2YWx1ZSA9IGlucHV0LnNsaWNlKG4sIGkpO1xuICAgICAgaWYgKG9wdHMudG9rZW5zKSB7XG4gICAgICAgIGlmIChpZHggPT09IDAgJiYgc3RhcnQgIT09IDApIHtcbiAgICAgICAgICB0b2tlbnNbaWR4XS5pc1ByZWZpeCA9IHRydWU7XG4gICAgICAgICAgdG9rZW5zW2lkeF0udmFsdWUgPSBwcmVmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9rZW5zW2lkeF0udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBkZXB0aCh0b2tlbnNbaWR4XSk7XG4gICAgICAgIHN0YXRlLm1heERlcHRoICs9IHRva2Vuc1tpZHhdLmRlcHRoO1xuICAgICAgfVxuICAgICAgaWYgKGlkeCAhPT0gMCB8fCB2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgcGFydHMucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBwcmV2SW5kZXggPSBpO1xuICAgIH1cblxuICAgIGlmIChwcmV2SW5kZXggJiYgcHJldkluZGV4ICsgMSA8IGlucHV0Lmxlbmd0aCkge1xuICAgICAgY29uc3QgdmFsdWUgPSBpbnB1dC5zbGljZShwcmV2SW5kZXggKyAxKTtcbiAgICAgIHBhcnRzLnB1c2godmFsdWUpO1xuXG4gICAgICBpZiAob3B0cy50b2tlbnMpIHtcbiAgICAgICAgdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBkZXB0aCh0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgc3RhdGUubWF4RGVwdGggKz0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS5kZXB0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0ZS5zbGFzaGVzID0gc2xhc2hlcztcbiAgICBzdGF0ZS5wYXJ0cyA9IHBhcnRzO1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzY2FuO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3QgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vKipcbiAqIENvbnN0YW50c1xuICovXG5cbmNvbnN0IHtcbiAgTUFYX0xFTkdUSCxcbiAgUE9TSVhfUkVHRVhfU09VUkNFLFxuICBSRUdFWF9OT05fU1BFQ0lBTF9DSEFSUyxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSU19CQUNLUkVGLFxuICBSRVBMQUNFTUVOVFNcbn0gPSBjb25zdGFudHM7XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5cbmNvbnN0IGV4cGFuZFJhbmdlID0gKGFyZ3MsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmV4cGFuZFJhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuZXhwYW5kUmFuZ2UoLi4uYXJncywgb3B0aW9ucyk7XG4gIH1cblxuICBhcmdzLnNvcnQoKTtcbiAgY29uc3QgdmFsdWUgPSBgWyR7YXJncy5qb2luKCctJyl9XWA7XG5cbiAgdHJ5IHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3ICovXG4gICAgbmV3IFJlZ0V4cCh2YWx1ZSk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0dXJuIGFyZ3MubWFwKHYgPT4gdXRpbHMuZXNjYXBlUmVnZXgodikpLmpvaW4oJy4uJyk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgbWVzc2FnZSBmb3IgYSBzeW50YXggZXJyb3JcbiAqL1xuXG5jb25zdCBzeW50YXhFcnJvciA9ICh0eXBlLCBjaGFyKSA9PiB7XG4gIHJldHVybiBgTWlzc2luZyAke3R5cGV9OiBcIiR7Y2hhcn1cIiAtIHVzZSBcIlxcXFxcXFxcJHtjaGFyfVwiIHRvIG1hdGNoIGxpdGVyYWwgY2hhcmFjdGVyc2A7XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBpbnB1dCBzdHJpbmcuXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuY29uc3QgcGFyc2UgPSAoaW5wdXQsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIHN0cmluZycpO1xuICB9XG5cbiAgaW5wdXQgPSBSRVBMQUNFTUVOVFNbaW5wdXRdIHx8IGlucHV0O1xuXG4gIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgY29uc3QgbWF4ID0gdHlwZW9mIG9wdHMubWF4TGVuZ3RoID09PSAnbnVtYmVyJyA/IE1hdGgubWluKE1BWF9MRU5HVEgsIG9wdHMubWF4TGVuZ3RoKSA6IE1BWF9MRU5HVEg7XG5cbiAgbGV0IGxlbiA9IGlucHV0Lmxlbmd0aDtcbiAgaWYgKGxlbiA+IG1heCkge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgSW5wdXQgbGVuZ3RoOiAke2xlbn0sIGV4Y2VlZHMgbWF4aW11bSBhbGxvd2VkIGxlbmd0aDogJHttYXh9YCk7XG4gIH1cblxuICBjb25zdCBib3MgPSB7IHR5cGU6ICdib3MnLCB2YWx1ZTogJycsIG91dHB1dDogb3B0cy5wcmVwZW5kIHx8ICcnIH07XG4gIGNvbnN0IHRva2VucyA9IFtib3NdO1xuXG4gIGNvbnN0IGNhcHR1cmUgPSBvcHRzLmNhcHR1cmUgPyAnJyA6ICc/Oic7XG4gIGNvbnN0IHdpbjMyID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpO1xuXG4gIC8vIGNyZWF0ZSBjb25zdGFudHMgYmFzZWQgb24gcGxhdGZvcm0sIGZvciB3aW5kb3dzIG9yIHBvc2l4XG4gIGNvbnN0IFBMQVRGT1JNX0NIQVJTID0gY29uc3RhbnRzLmdsb2JDaGFycyh3aW4zMik7XG4gIGNvbnN0IEVYVEdMT0JfQ0hBUlMgPSBjb25zdGFudHMuZXh0Z2xvYkNoYXJzKFBMQVRGT1JNX0NIQVJTKTtcblxuICBjb25zdCB7XG4gICAgRE9UX0xJVEVSQUwsXG4gICAgUExVU19MSVRFUkFMLFxuICAgIFNMQVNIX0xJVEVSQUwsXG4gICAgT05FX0NIQVIsXG4gICAgRE9UU19TTEFTSCxcbiAgICBOT19ET1QsXG4gICAgTk9fRE9UX1NMQVNILFxuICAgIE5PX0RPVFNfU0xBU0gsXG4gICAgUU1BUkssXG4gICAgUU1BUktfTk9fRE9ULFxuICAgIFNUQVIsXG4gICAgU1RBUlRfQU5DSE9SXG4gIH0gPSBQTEFURk9STV9DSEFSUztcblxuICBjb25zdCBnbG9ic3RhciA9IChvcHRzKSA9PiB7XG4gICAgcmV0dXJuIGAoJHtjYXB0dXJlfSg/Oig/ISR7U1RBUlRfQU5DSE9SfSR7b3B0cy5kb3QgPyBET1RTX1NMQVNIIDogRE9UX0xJVEVSQUx9KS4pKj8pYDtcbiAgfTtcblxuICBjb25zdCBub2RvdCA9IG9wdHMuZG90ID8gJycgOiBOT19ET1Q7XG4gIGNvbnN0IHFtYXJrTm9Eb3QgPSBvcHRzLmRvdCA/IFFNQVJLIDogUU1BUktfTk9fRE9UO1xuICBsZXQgc3RhciA9IG9wdHMuYmFzaCA9PT0gdHJ1ZSA/IGdsb2JzdGFyKG9wdHMpIDogU1RBUjtcblxuICBpZiAob3B0cy5jYXB0dXJlKSB7XG4gICAgc3RhciA9IGAoJHtzdGFyfSlgO1xuICB9XG5cbiAgLy8gbWluaW1hdGNoIG9wdGlvbnMgc3VwcG9ydFxuICBpZiAodHlwZW9mIG9wdHMubm9leHQgPT09ICdib29sZWFuJykge1xuICAgIG9wdHMubm9leHRnbG9iID0gb3B0cy5ub2V4dDtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGlucHV0LFxuICAgIGluZGV4OiAtMSxcbiAgICBzdGFydDogMCxcbiAgICBkb3Q6IG9wdHMuZG90ID09PSB0cnVlLFxuICAgIGNvbnN1bWVkOiAnJyxcbiAgICBvdXRwdXQ6ICcnLFxuICAgIHByZWZpeDogJycsXG4gICAgYmFja3RyYWNrOiBmYWxzZSxcbiAgICBuZWdhdGVkOiBmYWxzZSxcbiAgICBicmFja2V0czogMCxcbiAgICBicmFjZXM6IDAsXG4gICAgcGFyZW5zOiAwLFxuICAgIHF1b3RlczogMCxcbiAgICBnbG9ic3RhcjogZmFsc2UsXG4gICAgdG9rZW5zXG4gIH07XG5cbiAgaW5wdXQgPSB1dGlscy5yZW1vdmVQcmVmaXgoaW5wdXQsIHN0YXRlKTtcbiAgbGVuID0gaW5wdXQubGVuZ3RoO1xuXG4gIGNvbnN0IGV4dGdsb2JzID0gW107XG4gIGNvbnN0IGJyYWNlcyA9IFtdO1xuICBjb25zdCBzdGFjayA9IFtdO1xuICBsZXQgcHJldiA9IGJvcztcbiAgbGV0IHZhbHVlO1xuXG4gIC8qKlxuICAgKiBUb2tlbml6aW5nIGhlbHBlcnNcbiAgICovXG5cbiAgY29uc3QgZW9zID0gKCkgPT4gc3RhdGUuaW5kZXggPT09IGxlbiAtIDE7XG4gIGNvbnN0IHBlZWsgPSBzdGF0ZS5wZWVrID0gKG4gPSAxKSA9PiBpbnB1dFtzdGF0ZS5pbmRleCArIG5dO1xuICBjb25zdCBhZHZhbmNlID0gc3RhdGUuYWR2YW5jZSA9ICgpID0+IGlucHV0Wysrc3RhdGUuaW5kZXhdO1xuICBjb25zdCByZW1haW5pbmcgPSAoKSA9PiBpbnB1dC5zbGljZShzdGF0ZS5pbmRleCArIDEpO1xuICBjb25zdCBjb25zdW1lID0gKHZhbHVlID0gJycsIG51bSA9IDApID0+IHtcbiAgICBzdGF0ZS5jb25zdW1lZCArPSB2YWx1ZTtcbiAgICBzdGF0ZS5pbmRleCArPSBudW07XG4gIH07XG4gIGNvbnN0IGFwcGVuZCA9IHRva2VuID0+IHtcbiAgICBzdGF0ZS5vdXRwdXQgKz0gdG9rZW4ub3V0cHV0ICE9IG51bGwgPyB0b2tlbi5vdXRwdXQgOiB0b2tlbi52YWx1ZTtcbiAgICBjb25zdW1lKHRva2VuLnZhbHVlKTtcbiAgfTtcblxuICBjb25zdCBuZWdhdGUgPSAoKSA9PiB7XG4gICAgbGV0IGNvdW50ID0gMTtcblxuICAgIHdoaWxlIChwZWVrKCkgPT09ICchJyAmJiAocGVlaygyKSAhPT0gJygnIHx8IHBlZWsoMykgPT09ICc/JykpIHtcbiAgICAgIGFkdmFuY2UoKTtcbiAgICAgIHN0YXRlLnN0YXJ0Kys7XG4gICAgICBjb3VudCsrO1xuICAgIH1cblxuICAgIGlmIChjb3VudCAlIDIgPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0ZS5uZWdhdGVkID0gdHJ1ZTtcbiAgICBzdGF0ZS5zdGFydCsrO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGluY3JlbWVudCA9IHR5cGUgPT4ge1xuICAgIHN0YXRlW3R5cGVdKys7XG4gICAgc3RhY2sucHVzaCh0eXBlKTtcbiAgfTtcblxuICBjb25zdCBkZWNyZW1lbnQgPSB0eXBlID0+IHtcbiAgICBzdGF0ZVt0eXBlXS0tO1xuICAgIHN0YWNrLnBvcCgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQdXNoIHRva2VucyBvbnRvIHRoZSB0b2tlbnMgYXJyYXkuIFRoaXMgaGVscGVyIHNwZWVkcyB1cFxuICAgKiB0b2tlbml6aW5nIGJ5IDEpIGhlbHBpbmcgdXMgYXZvaWQgYmFja3RyYWNraW5nIGFzIG11Y2ggYXMgcG9zc2libGUsXG4gICAqIGFuZCAyKSBoZWxwaW5nIHVzIGF2b2lkIGNyZWF0aW5nIGV4dHJhIHRva2VucyB3aGVuIGNvbnNlY3V0aXZlXG4gICAqIGNoYXJhY3RlcnMgYXJlIHBsYWluIHRleHQuIFRoaXMgaW1wcm92ZXMgcGVyZm9ybWFuY2UgYW5kIHNpbXBsaWZpZXNcbiAgICogbG9va2JlaGluZHMuXG4gICAqL1xuXG4gIGNvbnN0IHB1c2ggPSB0b2sgPT4ge1xuICAgIGlmIChwcmV2LnR5cGUgPT09ICdnbG9ic3RhcicpIHtcbiAgICAgIGNvbnN0IGlzQnJhY2UgPSBzdGF0ZS5icmFjZXMgPiAwICYmICh0b2sudHlwZSA9PT0gJ2NvbW1hJyB8fCB0b2sudHlwZSA9PT0gJ2JyYWNlJyk7XG4gICAgICBjb25zdCBpc0V4dGdsb2IgPSB0b2suZXh0Z2xvYiA9PT0gdHJ1ZSB8fCAoZXh0Z2xvYnMubGVuZ3RoICYmICh0b2sudHlwZSA9PT0gJ3BpcGUnIHx8IHRvay50eXBlID09PSAncGFyZW4nKSk7XG5cbiAgICAgIGlmICh0b2sudHlwZSAhPT0gJ3NsYXNoJyAmJiB0b2sudHlwZSAhPT0gJ3BhcmVuJyAmJiAhaXNCcmFjZSAmJiAhaXNFeHRnbG9iKSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCAtcHJldi5vdXRwdXQubGVuZ3RoKTtcbiAgICAgICAgcHJldi50eXBlID0gJ3N0YXInO1xuICAgICAgICBwcmV2LnZhbHVlID0gJyonO1xuICAgICAgICBwcmV2Lm91dHB1dCA9IHN0YXI7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBwcmV2Lm91dHB1dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXh0Z2xvYnMubGVuZ3RoICYmIHRvay50eXBlICE9PSAncGFyZW4nICYmICFFWFRHTE9CX0NIQVJTW3Rvay52YWx1ZV0pIHtcbiAgICAgIGV4dGdsb2JzW2V4dGdsb2JzLmxlbmd0aCAtIDFdLmlubmVyICs9IHRvay52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAodG9rLnZhbHVlIHx8IHRvay5vdXRwdXQpIGFwcGVuZCh0b2spO1xuICAgIGlmIChwcmV2ICYmIHByZXYudHlwZSA9PT0gJ3RleHQnICYmIHRvay50eXBlID09PSAndGV4dCcpIHtcbiAgICAgIHByZXYudmFsdWUgKz0gdG9rLnZhbHVlO1xuICAgICAgcHJldi5vdXRwdXQgPSAocHJldi5vdXRwdXQgfHwgJycpICsgdG9rLnZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRvay5wcmV2ID0gcHJldjtcbiAgICB0b2tlbnMucHVzaCh0b2spO1xuICAgIHByZXYgPSB0b2s7XG4gIH07XG5cbiAgY29uc3QgZXh0Z2xvYk9wZW4gPSAodHlwZSwgdmFsdWUpID0+IHtcbiAgICBjb25zdCB0b2tlbiA9IHsgLi4uRVhUR0xPQl9DSEFSU1t2YWx1ZV0sIGNvbmRpdGlvbnM6IDEsIGlubmVyOiAnJyB9O1xuXG4gICAgdG9rZW4ucHJldiA9IHByZXY7XG4gICAgdG9rZW4ucGFyZW5zID0gc3RhdGUucGFyZW5zO1xuICAgIHRva2VuLm91dHB1dCA9IHN0YXRlLm91dHB1dDtcbiAgICBjb25zdCBvdXRwdXQgPSAob3B0cy5jYXB0dXJlID8gJygnIDogJycpICsgdG9rZW4ub3BlbjtcblxuICAgIGluY3JlbWVudCgncGFyZW5zJyk7XG4gICAgcHVzaCh7IHR5cGUsIHZhbHVlLCBvdXRwdXQ6IHN0YXRlLm91dHB1dCA/ICcnIDogT05FX0NIQVIgfSk7XG4gICAgcHVzaCh7IHR5cGU6ICdwYXJlbicsIGV4dGdsb2I6IHRydWUsIHZhbHVlOiBhZHZhbmNlKCksIG91dHB1dCB9KTtcbiAgICBleHRnbG9icy5wdXNoKHRva2VuKTtcbiAgfTtcblxuICBjb25zdCBleHRnbG9iQ2xvc2UgPSB0b2tlbiA9PiB7XG4gICAgbGV0IG91dHB1dCA9IHRva2VuLmNsb3NlICsgKG9wdHMuY2FwdHVyZSA/ICcpJyA6ICcnKTtcblxuICAgIGlmICh0b2tlbi50eXBlID09PSAnbmVnYXRlJykge1xuICAgICAgbGV0IGV4dGdsb2JTdGFyID0gc3RhcjtcblxuICAgICAgaWYgKHRva2VuLmlubmVyICYmIHRva2VuLmlubmVyLmxlbmd0aCA+IDEgJiYgdG9rZW4uaW5uZXIuaW5jbHVkZXMoJy8nKSkge1xuICAgICAgICBleHRnbG9iU3RhciA9IGdsb2JzdGFyKG9wdHMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXh0Z2xvYlN0YXIgIT09IHN0YXIgfHwgZW9zKCkgfHwgL15cXCkrJC8udGVzdChyZW1haW5pbmcoKSkpIHtcbiAgICAgICAgb3V0cHV0ID0gdG9rZW4uY2xvc2UgPSBgKSQpKSR7ZXh0Z2xvYlN0YXJ9YDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRva2VuLnByZXYudHlwZSA9PT0gJ2JvcycgJiYgZW9zKCkpIHtcbiAgICAgICAgc3RhdGUubmVnYXRlZEV4dGdsb2IgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1c2goeyB0eXBlOiAncGFyZW4nLCBleHRnbG9iOiB0cnVlLCB2YWx1ZSwgb3V0cHV0IH0pO1xuICAgIGRlY3JlbWVudCgncGFyZW5zJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZhc3QgcGF0aHNcbiAgICovXG5cbiAgaWYgKG9wdHMuZmFzdHBhdGhzICE9PSBmYWxzZSAmJiAhLyheWyohXXxbLygpW1xcXXt9XCJdKS8udGVzdChpbnB1dCkpIHtcbiAgICBsZXQgYmFja3NsYXNoZXMgPSBmYWxzZTtcblxuICAgIGxldCBvdXRwdXQgPSBpbnB1dC5yZXBsYWNlKFJFR0VYX1NQRUNJQUxfQ0hBUlNfQkFDS1JFRiwgKG0sIGVzYywgY2hhcnMsIGZpcnN0LCByZXN0LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGZpcnN0ID09PSAnXFxcXCcpIHtcbiAgICAgICAgYmFja3NsYXNoZXMgPSB0cnVlO1xuICAgICAgICByZXR1cm4gbTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpcnN0ID09PSAnPycpIHtcbiAgICAgICAgaWYgKGVzYykge1xuICAgICAgICAgIHJldHVybiBlc2MgKyBmaXJzdCArIChyZXN0ID8gUU1BUksucmVwZWF0KHJlc3QubGVuZ3RoKSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gcW1hcmtOb0RvdCArIChyZXN0ID8gUU1BUksucmVwZWF0KHJlc3QubGVuZ3RoKSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUU1BUksucmVwZWF0KGNoYXJzLmxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaXJzdCA9PT0gJy4nKSB7XG4gICAgICAgIHJldHVybiBET1RfTElURVJBTC5yZXBlYXQoY2hhcnMubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpcnN0ID09PSAnKicpIHtcbiAgICAgICAgaWYgKGVzYykge1xuICAgICAgICAgIHJldHVybiBlc2MgKyBmaXJzdCArIChyZXN0ID8gc3RhciA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlc2MgPyBtIDogYFxcXFwke219YDtcbiAgICB9KTtcblxuICAgIGlmIChiYWNrc2xhc2hlcyA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKG9wdHMudW5lc2NhcGUgPT09IHRydWUpIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1xcXFwvZywgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1xcXFwrL2csIG0gPT4ge1xuICAgICAgICAgIHJldHVybiBtLmxlbmd0aCAlIDIgPT09IDAgPyAnXFxcXFxcXFwnIDogKG0gPyAnXFxcXCcgOiAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvdXRwdXQgPT09IGlucHV0ICYmIG9wdHMuY29udGFpbnMgPT09IHRydWUpIHtcbiAgICAgIHN0YXRlLm91dHB1dCA9IGlucHV0O1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHN0YXRlLm91dHB1dCA9IHV0aWxzLndyYXBPdXRwdXQob3V0cHV0LCBzdGF0ZSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRva2VuaXplIGlucHV0IHVudGlsIHdlIHJlYWNoIGVuZC1vZi1zdHJpbmdcbiAgICovXG5cbiAgd2hpbGUgKCFlb3MoKSkge1xuICAgIHZhbHVlID0gYWR2YW5jZSgpO1xuXG4gICAgaWYgKHZhbHVlID09PSAnXFx1MDAwMCcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVzY2FwZWQgY2hhcmFjdGVyc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnXFxcXCcpIHtcbiAgICAgIGNvbnN0IG5leHQgPSBwZWVrKCk7XG5cbiAgICAgIGlmIChuZXh0ID09PSAnLycgJiYgb3B0cy5iYXNoICE9PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV4dCA9PT0gJy4nIHx8IG5leHQgPT09ICc7Jykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFuZXh0KSB7XG4gICAgICAgIHZhbHVlICs9ICdcXFxcJztcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBjb2xsYXBzZSBzbGFzaGVzIHRvIHJlZHVjZSBwb3RlbnRpYWwgZm9yIGV4cGxvaXRzXG4gICAgICBjb25zdCBtYXRjaCA9IC9eXFxcXCsvLmV4ZWMocmVtYWluaW5nKCkpO1xuICAgICAgbGV0IHNsYXNoZXMgPSAwO1xuXG4gICAgICBpZiAobWF0Y2ggJiYgbWF0Y2hbMF0ubGVuZ3RoID4gMikge1xuICAgICAgICBzbGFzaGVzID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICBzdGF0ZS5pbmRleCArPSBzbGFzaGVzO1xuICAgICAgICBpZiAoc2xhc2hlcyAlIDIgIT09IDApIHtcbiAgICAgICAgICB2YWx1ZSArPSAnXFxcXCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMudW5lc2NhcGUgPT09IHRydWUpIHtcbiAgICAgICAgdmFsdWUgPSBhZHZhbmNlKCkgfHwgJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSArPSBhZHZhbmNlKCkgfHwgJyc7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZS5icmFja2V0cyA9PT0gMCkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgd2UncmUgaW5zaWRlIGEgcmVnZXggY2hhcmFjdGVyIGNsYXNzLCBjb250aW51ZVxuICAgICAqIHVudGlsIHdlIHJlYWNoIHRoZSBjbG9zaW5nIGJyYWNrZXQuXG4gICAgICovXG5cbiAgICBpZiAoc3RhdGUuYnJhY2tldHMgPiAwICYmICh2YWx1ZSAhPT0gJ10nIHx8IHByZXYudmFsdWUgPT09ICdbJyB8fCBwcmV2LnZhbHVlID09PSAnW14nKSkge1xuICAgICAgaWYgKG9wdHMucG9zaXggIT09IGZhbHNlICYmIHZhbHVlID09PSAnOicpIHtcbiAgICAgICAgY29uc3QgaW5uZXIgPSBwcmV2LnZhbHVlLnNsaWNlKDEpO1xuICAgICAgICBpZiAoaW5uZXIuaW5jbHVkZXMoJ1snKSkge1xuICAgICAgICAgIHByZXYucG9zaXggPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKGlubmVyLmluY2x1ZGVzKCc6JykpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHByZXYudmFsdWUubGFzdEluZGV4T2YoJ1snKTtcbiAgICAgICAgICAgIGNvbnN0IHByZSA9IHByZXYudmFsdWUuc2xpY2UoMCwgaWR4KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3QgPSBwcmV2LnZhbHVlLnNsaWNlKGlkeCArIDIpO1xuICAgICAgICAgICAgY29uc3QgcG9zaXggPSBQT1NJWF9SRUdFWF9TT1VSQ0VbcmVzdF07XG4gICAgICAgICAgICBpZiAocG9zaXgpIHtcbiAgICAgICAgICAgICAgcHJldi52YWx1ZSA9IHByZSArIHBvc2l4O1xuICAgICAgICAgICAgICBzdGF0ZS5iYWNrdHJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICBhZHZhbmNlKCk7XG5cbiAgICAgICAgICAgICAgaWYgKCFib3Mub3V0cHV0ICYmIHRva2Vucy5pbmRleE9mKHByZXYpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgYm9zLm91dHB1dCA9IE9ORV9DSEFSO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoKHZhbHVlID09PSAnWycgJiYgcGVlaygpICE9PSAnOicpIHx8ICh2YWx1ZSA9PT0gJy0nICYmIHBlZWsoKSA9PT0gJ10nKSkge1xuICAgICAgICB2YWx1ZSA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09ICddJyAmJiAocHJldi52YWx1ZSA9PT0gJ1snIHx8IHByZXYudmFsdWUgPT09ICdbXicpKSB7XG4gICAgICAgIHZhbHVlID0gYFxcXFwke3ZhbHVlfWA7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLnBvc2l4ID09PSB0cnVlICYmIHZhbHVlID09PSAnIScgJiYgcHJldi52YWx1ZSA9PT0gJ1snKSB7XG4gICAgICAgIHZhbHVlID0gJ14nO1xuICAgICAgfVxuXG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgYXBwZW5kKHsgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB3ZSdyZSBpbnNpZGUgYSBxdW90ZWQgc3RyaW5nLCBjb250aW51ZVxuICAgICAqIHVudGlsIHdlIHJlYWNoIHRoZSBjbG9zaW5nIGRvdWJsZSBxdW90ZS5cbiAgICAgKi9cblxuICAgIGlmIChzdGF0ZS5xdW90ZXMgPT09IDEgJiYgdmFsdWUgIT09ICdcIicpIHtcbiAgICAgIHZhbHVlID0gdXRpbHMuZXNjYXBlUmVnZXgodmFsdWUpO1xuICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgIGFwcGVuZCh7IHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG91YmxlIHF1b3Rlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnXCInKSB7XG4gICAgICBzdGF0ZS5xdW90ZXMgPSBzdGF0ZS5xdW90ZXMgPT09IDEgPyAwIDogMTtcbiAgICAgIGlmIChvcHRzLmtlZXBRdW90ZXMgPT09IHRydWUpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJlbnRoZXNlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnKCcpIHtcbiAgICAgIGluY3JlbWVudCgncGFyZW5zJyk7XG4gICAgICBwdXNoKHsgdHlwZTogJ3BhcmVuJywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09ICcpJykge1xuICAgICAgaWYgKHN0YXRlLnBhcmVucyA9PT0gMCAmJiBvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB7XG4gICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihzeW50YXhFcnJvcignb3BlbmluZycsICcoJykpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleHRnbG9iID0gZXh0Z2xvYnNbZXh0Z2xvYnMubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoZXh0Z2xvYiAmJiBzdGF0ZS5wYXJlbnMgPT09IGV4dGdsb2IucGFyZW5zICsgMSkge1xuICAgICAgICBleHRnbG9iQ2xvc2UoZXh0Z2xvYnMucG9wKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdwYXJlbicsIHZhbHVlLCBvdXRwdXQ6IHN0YXRlLnBhcmVucyA/ICcpJyA6ICdcXFxcKScgfSk7XG4gICAgICBkZWNyZW1lbnQoJ3BhcmVucycpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3F1YXJlIGJyYWNrZXRzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICdbJykge1xuICAgICAgaWYgKG9wdHMubm9icmFja2V0ID09PSB0cnVlIHx8ICFyZW1haW5pbmcoKS5pbmNsdWRlcygnXScpKSB7XG4gICAgICAgIGlmIChvcHRzLm5vYnJhY2tldCAhPT0gdHJ1ZSAmJiBvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdjbG9zaW5nJywgJ10nKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5jcmVtZW50KCdicmFja2V0cycpO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2JyYWNrZXQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gJ10nKSB7XG4gICAgICBpZiAob3B0cy5ub2JyYWNrZXQgPT09IHRydWUgfHwgKHByZXYgJiYgcHJldi50eXBlID09PSAnYnJhY2tldCcgJiYgcHJldi52YWx1ZS5sZW5ndGggPT09IDEpKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlLCBvdXRwdXQ6IGBcXFxcJHt2YWx1ZX1gIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLmJyYWNrZXRzID09PSAwKSB7XG4gICAgICAgIGlmIChvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdvcGVuaW5nJywgJ1snKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSwgb3V0cHV0OiBgXFxcXCR7dmFsdWV9YCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGRlY3JlbWVudCgnYnJhY2tldHMnKTtcblxuICAgICAgY29uc3QgcHJldlZhbHVlID0gcHJldi52YWx1ZS5zbGljZSgxKTtcbiAgICAgIGlmIChwcmV2LnBvc2l4ICE9PSB0cnVlICYmIHByZXZWYWx1ZVswXSA9PT0gJ14nICYmICFwcmV2VmFsdWUuaW5jbHVkZXMoJy8nKSkge1xuICAgICAgICB2YWx1ZSA9IGAvJHt2YWx1ZX1gO1xuICAgICAgfVxuXG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgYXBwZW5kKHsgdmFsdWUgfSk7XG5cbiAgICAgIC8vIHdoZW4gbGl0ZXJhbCBicmFja2V0cyBhcmUgZXhwbGljaXRseSBkaXNhYmxlZFxuICAgICAgLy8gYXNzdW1lIHdlIHNob3VsZCBtYXRjaCB3aXRoIGEgcmVnZXggY2hhcmFjdGVyIGNsYXNzXG4gICAgICBpZiAob3B0cy5saXRlcmFsQnJhY2tldHMgPT09IGZhbHNlIHx8IHV0aWxzLmhhc1JlZ2V4Q2hhcnMocHJldlZhbHVlKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXNjYXBlZCA9IHV0aWxzLmVzY2FwZVJlZ2V4KHByZXYudmFsdWUpO1xuICAgICAgc3RhdGUub3V0cHV0ID0gc3RhdGUub3V0cHV0LnNsaWNlKDAsIC1wcmV2LnZhbHVlLmxlbmd0aCk7XG5cbiAgICAgIC8vIHdoZW4gbGl0ZXJhbCBicmFja2V0cyBhcmUgZXhwbGljaXRseSBlbmFibGVkXG4gICAgICAvLyBhc3N1bWUgd2Ugc2hvdWxkIGVzY2FwZSB0aGUgYnJhY2tldHMgdG8gbWF0Y2ggbGl0ZXJhbCBjaGFyYWN0ZXJzXG4gICAgICBpZiAob3B0cy5saXRlcmFsQnJhY2tldHMgPT09IHRydWUpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IGVzY2FwZWQ7XG4gICAgICAgIHByZXYudmFsdWUgPSBlc2NhcGVkO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gd2hlbiB0aGUgdXNlciBzcGVjaWZpZXMgbm90aGluZywgdHJ5IHRvIG1hdGNoIGJvdGhcbiAgICAgIHByZXYudmFsdWUgPSBgKCR7Y2FwdHVyZX0ke2VzY2FwZWR9fCR7cHJldi52YWx1ZX0pYDtcbiAgICAgIHN0YXRlLm91dHB1dCArPSBwcmV2LnZhbHVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnJhY2VzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICd7JyAmJiBvcHRzLm5vYnJhY2UgIT09IHRydWUpIHtcbiAgICAgIGluY3JlbWVudCgnYnJhY2VzJyk7XG5cbiAgICAgIGNvbnN0IG9wZW4gPSB7XG4gICAgICAgIHR5cGU6ICdicmFjZScsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBvdXRwdXQ6ICcoJyxcbiAgICAgICAgb3V0cHV0SW5kZXg6IHN0YXRlLm91dHB1dC5sZW5ndGgsXG4gICAgICAgIHRva2Vuc0luZGV4OiBzdGF0ZS50b2tlbnMubGVuZ3RoXG4gICAgICB9O1xuXG4gICAgICBicmFjZXMucHVzaChvcGVuKTtcbiAgICAgIHB1c2gob3Blbik7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09ICd9Jykge1xuICAgICAgY29uc3QgYnJhY2UgPSBicmFjZXNbYnJhY2VzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAob3B0cy5ub2JyYWNlID09PSB0cnVlIHx8ICFicmFjZSkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSwgb3V0cHV0OiB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBvdXRwdXQgPSAnKSc7XG5cbiAgICAgIGlmIChicmFjZS5kb3RzID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGFyciA9IHRva2Vucy5zbGljZSgpO1xuICAgICAgICBjb25zdCByYW5nZSA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICB0b2tlbnMucG9wKCk7XG4gICAgICAgICAgaWYgKGFycltpXS50eXBlID09PSAnYnJhY2UnKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFycltpXS50eXBlICE9PSAnZG90cycpIHtcbiAgICAgICAgICAgIHJhbmdlLnVuc2hpZnQoYXJyW2ldLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXQgPSBleHBhbmRSYW5nZShyYW5nZSwgb3B0cyk7XG4gICAgICAgIHN0YXRlLmJhY2t0cmFjayA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChicmFjZS5jb21tYSAhPT0gdHJ1ZSAmJiBicmFjZS5kb3RzICE9PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IG91dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCBicmFjZS5vdXRwdXRJbmRleCk7XG4gICAgICAgIGNvbnN0IHRva3MgPSBzdGF0ZS50b2tlbnMuc2xpY2UoYnJhY2UudG9rZW5zSW5kZXgpO1xuICAgICAgICBicmFjZS52YWx1ZSA9IGJyYWNlLm91dHB1dCA9ICdcXFxceyc7XG4gICAgICAgIHZhbHVlID0gb3V0cHV0ID0gJ1xcXFx9JztcbiAgICAgICAgc3RhdGUub3V0cHV0ID0gb3V0O1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdG9rcykge1xuICAgICAgICAgIHN0YXRlLm91dHB1dCArPSAodC5vdXRwdXQgfHwgdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdicmFjZScsIHZhbHVlLCBvdXRwdXQgfSk7XG4gICAgICBkZWNyZW1lbnQoJ2JyYWNlcycpO1xuICAgICAgYnJhY2VzLnBvcCgpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlwZXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJ3wnKSB7XG4gICAgICBpZiAoZXh0Z2xvYnMubGVuZ3RoID4gMCkge1xuICAgICAgICBleHRnbG9ic1tleHRnbG9icy5sZW5ndGggLSAxXS5jb25kaXRpb25zKys7XG4gICAgICB9XG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbW1hc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnLCcpIHtcbiAgICAgIGxldCBvdXRwdXQgPSB2YWx1ZTtcblxuICAgICAgY29uc3QgYnJhY2UgPSBicmFjZXNbYnJhY2VzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGJyYWNlICYmIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdID09PSAnYnJhY2VzJykge1xuICAgICAgICBicmFjZS5jb21tYSA9IHRydWU7XG4gICAgICAgIG91dHB1dCA9ICd8JztcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdjb21tYScsIHZhbHVlLCBvdXRwdXQgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTbGFzaGVzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICcvJykge1xuICAgICAgLy8gaWYgdGhlIGJlZ2lubmluZyBvZiB0aGUgZ2xvYiBpcyBcIi4vXCIsIGFkdmFuY2UgdGhlIHN0YXJ0XG4gICAgICAvLyB0byB0aGUgY3VycmVudCBpbmRleCwgYW5kIGRvbid0IGFkZCB0aGUgXCIuL1wiIGNoYXJhY3RlcnNcbiAgICAgIC8vIHRvIHRoZSBzdGF0ZS4gVGhpcyBncmVhdGx5IHNpbXBsaWZpZXMgbG9va2JlaGluZHMgd2hlblxuICAgICAgLy8gY2hlY2tpbmcgZm9yIEJPUyBjaGFyYWN0ZXJzIGxpa2UgXCIhXCIgYW5kIFwiLlwiIChub3QgXCIuL1wiKVxuICAgICAgaWYgKHByZXYudHlwZSA9PT0gJ2RvdCcgJiYgc3RhdGUuaW5kZXggPT09IHN0YXRlLnN0YXJ0ICsgMSkge1xuICAgICAgICBzdGF0ZS5zdGFydCA9IHN0YXRlLmluZGV4ICsgMTtcbiAgICAgICAgc3RhdGUuY29uc3VtZWQgPSAnJztcbiAgICAgICAgc3RhdGUub3V0cHV0ID0gJyc7XG4gICAgICAgIHRva2Vucy5wb3AoKTtcbiAgICAgICAgcHJldiA9IGJvczsgLy8gcmVzZXQgXCJwcmV2XCIgdG8gdGhlIGZpcnN0IHRva2VuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3NsYXNoJywgdmFsdWUsIG91dHB1dDogU0xBU0hfTElURVJBTCB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvdHNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJy4nKSB7XG4gICAgICBpZiAoc3RhdGUuYnJhY2VzID4gMCAmJiBwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICAgIGlmIChwcmV2LnZhbHVlID09PSAnLicpIHByZXYub3V0cHV0ID0gRE9UX0xJVEVSQUw7XG4gICAgICAgIGNvbnN0IGJyYWNlID0gYnJhY2VzW2JyYWNlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgcHJldi50eXBlID0gJ2RvdHMnO1xuICAgICAgICBwcmV2Lm91dHB1dCArPSB2YWx1ZTtcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgYnJhY2UuZG90cyA9IHRydWU7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKHN0YXRlLmJyYWNlcyArIHN0YXRlLnBhcmVucykgPT09IDAgJiYgcHJldi50eXBlICE9PSAnYm9zJyAmJiBwcmV2LnR5cGUgIT09ICdzbGFzaCcpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUsIG91dHB1dDogRE9UX0xJVEVSQUwgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2RvdCcsIHZhbHVlLCBvdXRwdXQ6IERPVF9MSVRFUkFMIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUXVlc3Rpb24gbWFya3NcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJz8nKSB7XG4gICAgICBjb25zdCBpc0dyb3VwID0gcHJldiAmJiBwcmV2LnZhbHVlID09PSAnKCc7XG4gICAgICBpZiAoIWlzR3JvdXAgJiYgb3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgcGVlaygpID09PSAnKCcgJiYgcGVlaygyKSAhPT0gJz8nKSB7XG4gICAgICAgIGV4dGdsb2JPcGVuKCdxbWFyaycsIHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2ICYmIHByZXYudHlwZSA9PT0gJ3BhcmVuJykge1xuICAgICAgICBjb25zdCBuZXh0ID0gcGVlaygpO1xuICAgICAgICBsZXQgb3V0cHV0ID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKG5leHQgPT09ICc8JyAmJiAhdXRpbHMuc3VwcG9ydHNMb29rYmVoaW5kcygpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlLmpzIHYxMCBvciBoaWdoZXIgaXMgcmVxdWlyZWQgZm9yIHJlZ2V4IGxvb2tiZWhpbmRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHByZXYudmFsdWUgPT09ICcoJyAmJiAhL1shPTw6XS8udGVzdChuZXh0KSkgfHwgKG5leHQgPT09ICc8JyAmJiAhLzwoWyE9XXxcXHcrPikvLnRlc3QocmVtYWluaW5nKCkpKSkge1xuICAgICAgICAgIG91dHB1dCA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUsIG91dHB1dCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLmRvdCAhPT0gdHJ1ZSAmJiAocHJldi50eXBlID09PSAnc2xhc2gnIHx8IHByZXYudHlwZSA9PT0gJ2JvcycpKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAncW1hcmsnLCB2YWx1ZSwgb3V0cHV0OiBRTUFSS19OT19ET1QgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3FtYXJrJywgdmFsdWUsIG91dHB1dDogUU1BUksgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGNsYW1hdGlvblxuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnIScpIHtcbiAgICAgIGlmIChvcHRzLm5vZXh0Z2xvYiAhPT0gdHJ1ZSAmJiBwZWVrKCkgPT09ICcoJykge1xuICAgICAgICBpZiAocGVlaygyKSAhPT0gJz8nIHx8ICEvWyE9PDpdLy50ZXN0KHBlZWsoMykpKSB7XG4gICAgICAgICAgZXh0Z2xvYk9wZW4oJ25lZ2F0ZScsIHZhbHVlKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5ub25lZ2F0ZSAhPT0gdHJ1ZSAmJiBzdGF0ZS5pbmRleCA9PT0gMCkge1xuICAgICAgICBuZWdhdGUoKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGx1c1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnKycpIHtcbiAgICAgIGlmIChvcHRzLm5vZXh0Z2xvYiAhPT0gdHJ1ZSAmJiBwZWVrKCkgPT09ICcoJyAmJiBwZWVrKDIpICE9PSAnPycpIHtcbiAgICAgICAgZXh0Z2xvYk9wZW4oJ3BsdXMnLCB2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKHByZXYgJiYgcHJldi52YWx1ZSA9PT0gJygnKSB8fCBvcHRzLnJlZ2V4ID09PSBmYWxzZSkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3BsdXMnLCB2YWx1ZSwgb3V0cHV0OiBQTFVTX0xJVEVSQUwgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKHByZXYgJiYgKHByZXYudHlwZSA9PT0gJ2JyYWNrZXQnIHx8IHByZXYudHlwZSA9PT0gJ3BhcmVuJyB8fCBwcmV2LnR5cGUgPT09ICdicmFjZScpKSB8fCBzdGF0ZS5wYXJlbnMgPiAwKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAncGx1cycsIHZhbHVlIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdwbHVzJywgdmFsdWU6IFBMVVNfTElURVJBTCB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBsYWluIHRleHRcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJ0AnKSB7XG4gICAgICBpZiAob3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgcGVlaygpID09PSAnKCcgJiYgcGVlaygyKSAhPT0gJz8nKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAnYXQnLCBleHRnbG9iOiB0cnVlLCB2YWx1ZSwgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGxhaW4gdGV4dFxuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlICE9PSAnKicpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gJyQnIHx8IHZhbHVlID09PSAnXicpIHtcbiAgICAgICAgdmFsdWUgPSBgXFxcXCR7dmFsdWV9YDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0Y2ggPSBSRUdFWF9OT05fU1BFQ0lBTF9DSEFSUy5leGVjKHJlbWFpbmluZygpKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICB2YWx1ZSArPSBtYXRjaFswXTtcbiAgICAgICAgc3RhdGUuaW5kZXggKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJzXG4gICAgICovXG5cbiAgICBpZiAocHJldiAmJiAocHJldi50eXBlID09PSAnZ2xvYnN0YXInIHx8IHByZXYuc3RhciA9PT0gdHJ1ZSkpIHtcbiAgICAgIHByZXYudHlwZSA9ICdzdGFyJztcbiAgICAgIHByZXYuc3RhciA9IHRydWU7XG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgcHJldi5vdXRwdXQgPSBzdGFyO1xuICAgICAgc3RhdGUuYmFja3RyYWNrID0gdHJ1ZTtcbiAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgIGNvbnN1bWUodmFsdWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgbGV0IHJlc3QgPSByZW1haW5pbmcoKTtcbiAgICBpZiAob3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgL15cXChbXj9dLy50ZXN0KHJlc3QpKSB7XG4gICAgICBleHRnbG9iT3Blbignc3RhcicsIHZhbHVlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChwcmV2LnR5cGUgPT09ICdzdGFyJykge1xuICAgICAgaWYgKG9wdHMubm9nbG9ic3RhciA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByaW9yID0gcHJldi5wcmV2O1xuICAgICAgY29uc3QgYmVmb3JlID0gcHJpb3IucHJldjtcbiAgICAgIGNvbnN0IGlzU3RhcnQgPSBwcmlvci50eXBlID09PSAnc2xhc2gnIHx8IHByaW9yLnR5cGUgPT09ICdib3MnO1xuICAgICAgY29uc3QgYWZ0ZXJTdGFyID0gYmVmb3JlICYmIChiZWZvcmUudHlwZSA9PT0gJ3N0YXInIHx8IGJlZm9yZS50eXBlID09PSAnZ2xvYnN0YXInKTtcblxuICAgICAgaWYgKG9wdHMuYmFzaCA9PT0gdHJ1ZSAmJiAoIWlzU3RhcnQgfHwgKHJlc3RbMF0gJiYgcmVzdFswXSAhPT0gJy8nKSkpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdzdGFyJywgdmFsdWUsIG91dHB1dDogJycgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc0JyYWNlID0gc3RhdGUuYnJhY2VzID4gMCAmJiAocHJpb3IudHlwZSA9PT0gJ2NvbW1hJyB8fCBwcmlvci50eXBlID09PSAnYnJhY2UnKTtcbiAgICAgIGNvbnN0IGlzRXh0Z2xvYiA9IGV4dGdsb2JzLmxlbmd0aCAmJiAocHJpb3IudHlwZSA9PT0gJ3BpcGUnIHx8IHByaW9yLnR5cGUgPT09ICdwYXJlbicpO1xuICAgICAgaWYgKCFpc1N0YXJ0ICYmIHByaW9yLnR5cGUgIT09ICdwYXJlbicgJiYgIWlzQnJhY2UgJiYgIWlzRXh0Z2xvYikge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3N0YXInLCB2YWx1ZSwgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHN0cmlwIGNvbnNlY3V0aXZlIGAvKiovYFxuICAgICAgd2hpbGUgKHJlc3Quc2xpY2UoMCwgMykgPT09ICcvKionKSB7XG4gICAgICAgIGNvbnN0IGFmdGVyID0gaW5wdXRbc3RhdGUuaW5kZXggKyA0XTtcbiAgICAgICAgaWYgKGFmdGVyICYmIGFmdGVyICE9PSAnLycpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXN0ID0gcmVzdC5zbGljZSgzKTtcbiAgICAgICAgY29uc3VtZSgnLyoqJywgMyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnYm9zJyAmJiBlb3MoKSkge1xuICAgICAgICBwcmV2LnR5cGUgPSAnZ2xvYnN0YXInO1xuICAgICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgICBwcmV2Lm91dHB1dCA9IGdsb2JzdGFyKG9wdHMpO1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBwcmV2Lm91dHB1dDtcbiAgICAgICAgc3RhdGUuZ2xvYnN0YXIgPSB0cnVlO1xuICAgICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnc2xhc2gnICYmIHByaW9yLnByZXYudHlwZSAhPT0gJ2JvcycgJiYgIWFmdGVyU3RhciAmJiBlb3MoKSkge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBzdGF0ZS5vdXRwdXQuc2xpY2UoMCwgLShwcmlvci5vdXRwdXQgKyBwcmV2Lm91dHB1dCkubGVuZ3RoKTtcbiAgICAgICAgcHJpb3Iub3V0cHV0ID0gYCg/OiR7cHJpb3Iub3V0cHV0fWA7XG5cbiAgICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgICAgcHJldi5vdXRwdXQgPSBnbG9ic3RhcihvcHRzKSArIChvcHRzLnN0cmljdFNsYXNoZXMgPyAnKScgOiAnfCQpJyk7XG4gICAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IHByaW9yLm91dHB1dCArIHByZXYub3V0cHV0O1xuICAgICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnc2xhc2gnICYmIHByaW9yLnByZXYudHlwZSAhPT0gJ2JvcycgJiYgcmVzdFswXSA9PT0gJy8nKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IHJlc3RbMV0gIT09IHZvaWQgMCA/ICd8JCcgOiAnJztcblxuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBzdGF0ZS5vdXRwdXQuc2xpY2UoMCwgLShwcmlvci5vdXRwdXQgKyBwcmV2Lm91dHB1dCkubGVuZ3RoKTtcbiAgICAgICAgcHJpb3Iub3V0cHV0ID0gYCg/OiR7cHJpb3Iub3V0cHV0fWA7XG5cbiAgICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgICAgcHJldi5vdXRwdXQgPSBgJHtnbG9ic3RhcihvcHRzKX0ke1NMQVNIX0xJVEVSQUx9fCR7U0xBU0hfTElURVJBTH0ke2VuZH0pYDtcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcblxuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gcHJpb3Iub3V0cHV0ICsgcHJldi5vdXRwdXQ7XG4gICAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcblxuICAgICAgICBjb25zdW1lKHZhbHVlICsgYWR2YW5jZSgpKTtcblxuICAgICAgICBwdXNoKHsgdHlwZTogJ3NsYXNoJywgdmFsdWU6ICcvJywgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnYm9zJyAmJiByZXN0WzBdID09PSAnLycpIHtcbiAgICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgcHJldi5vdXRwdXQgPSBgKD86Xnwke1NMQVNIX0xJVEVSQUx9fCR7Z2xvYnN0YXIob3B0cyl9JHtTTEFTSF9MSVRFUkFMfSlgO1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBwcmV2Lm91dHB1dDtcbiAgICAgICAgc3RhdGUuZ2xvYnN0YXIgPSB0cnVlO1xuICAgICAgICBjb25zdW1lKHZhbHVlICsgYWR2YW5jZSgpKTtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdzbGFzaCcsIHZhbHVlOiAnLycsIG91dHB1dDogJycgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgc2luZ2xlIHN0YXIgZnJvbSBvdXRwdXRcbiAgICAgIHN0YXRlLm91dHB1dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCAtcHJldi5vdXRwdXQubGVuZ3RoKTtcblxuICAgICAgLy8gcmVzZXQgcHJldmlvdXMgdG9rZW4gdG8gZ2xvYnN0YXJcbiAgICAgIHByZXYudHlwZSA9ICdnbG9ic3Rhcic7XG4gICAgICBwcmV2Lm91dHB1dCA9IGdsb2JzdGFyKG9wdHMpO1xuICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcblxuICAgICAgLy8gcmVzZXQgb3V0cHV0IHdpdGggZ2xvYnN0YXJcbiAgICAgIHN0YXRlLm91dHB1dCArPSBwcmV2Lm91dHB1dDtcbiAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgIGNvbnN1bWUodmFsdWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSB7IHR5cGU6ICdzdGFyJywgdmFsdWUsIG91dHB1dDogc3RhciB9O1xuXG4gICAgaWYgKG9wdHMuYmFzaCA9PT0gdHJ1ZSkge1xuICAgICAgdG9rZW4ub3V0cHV0ID0gJy4qPyc7XG4gICAgICBpZiAocHJldi50eXBlID09PSAnYm9zJyB8fCBwcmV2LnR5cGUgPT09ICdzbGFzaCcpIHtcbiAgICAgICAgdG9rZW4ub3V0cHV0ID0gbm9kb3QgKyB0b2tlbi5vdXRwdXQ7XG4gICAgICB9XG4gICAgICBwdXNoKHRva2VuKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChwcmV2ICYmIChwcmV2LnR5cGUgPT09ICdicmFja2V0JyB8fCBwcmV2LnR5cGUgPT09ICdwYXJlbicpICYmIG9wdHMucmVnZXggPT09IHRydWUpIHtcbiAgICAgIHRva2VuLm91dHB1dCA9IHZhbHVlO1xuICAgICAgcHVzaCh0b2tlbik7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuaW5kZXggPT09IHN0YXRlLnN0YXJ0IHx8IHByZXYudHlwZSA9PT0gJ3NsYXNoJyB8fCBwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICBpZiAocHJldi50eXBlID09PSAnZG90Jykge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gTk9fRE9UX1NMQVNIO1xuICAgICAgICBwcmV2Lm91dHB1dCArPSBOT19ET1RfU0xBU0g7XG5cbiAgICAgIH0gZWxzZSBpZiAob3B0cy5kb3QgPT09IHRydWUpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IE5PX0RPVFNfU0xBU0g7XG4gICAgICAgIHByZXYub3V0cHV0ICs9IE5PX0RPVFNfU0xBU0g7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBub2RvdDtcbiAgICAgICAgcHJldi5vdXRwdXQgKz0gbm9kb3Q7XG4gICAgICB9XG5cbiAgICAgIGlmIChwZWVrKCkgIT09ICcqJykge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gT05FX0NIQVI7XG4gICAgICAgIHByZXYub3V0cHV0ICs9IE9ORV9DSEFSO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1c2godG9rZW4pO1xuICB9XG5cbiAgd2hpbGUgKHN0YXRlLmJyYWNrZXRzID4gMCkge1xuICAgIGlmIChvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc3ludGF4RXJyb3IoJ2Nsb3NpbmcnLCAnXScpKTtcbiAgICBzdGF0ZS5vdXRwdXQgPSB1dGlscy5lc2NhcGVMYXN0KHN0YXRlLm91dHB1dCwgJ1snKTtcbiAgICBkZWNyZW1lbnQoJ2JyYWNrZXRzJyk7XG4gIH1cblxuICB3aGlsZSAoc3RhdGUucGFyZW5zID4gMCkge1xuICAgIGlmIChvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc3ludGF4RXJyb3IoJ2Nsb3NpbmcnLCAnKScpKTtcbiAgICBzdGF0ZS5vdXRwdXQgPSB1dGlscy5lc2NhcGVMYXN0KHN0YXRlLm91dHB1dCwgJygnKTtcbiAgICBkZWNyZW1lbnQoJ3BhcmVucycpO1xuICB9XG5cbiAgd2hpbGUgKHN0YXRlLmJyYWNlcyA+IDApIHtcbiAgICBpZiAob3B0cy5zdHJpY3RCcmFja2V0cyA9PT0gdHJ1ZSkgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdjbG9zaW5nJywgJ30nKSk7XG4gICAgc3RhdGUub3V0cHV0ID0gdXRpbHMuZXNjYXBlTGFzdChzdGF0ZS5vdXRwdXQsICd7Jyk7XG4gICAgZGVjcmVtZW50KCdicmFjZXMnKTtcbiAgfVxuXG4gIGlmIChvcHRzLnN0cmljdFNsYXNoZXMgIT09IHRydWUgJiYgKHByZXYudHlwZSA9PT0gJ3N0YXInIHx8IHByZXYudHlwZSA9PT0gJ2JyYWNrZXQnKSkge1xuICAgIHB1c2goeyB0eXBlOiAnbWF5YmVfc2xhc2gnLCB2YWx1ZTogJycsIG91dHB1dDogYCR7U0xBU0hfTElURVJBTH0/YCB9KTtcbiAgfVxuXG4gIC8vIHJlYnVpbGQgdGhlIG91dHB1dCBpZiB3ZSBoYWQgdG8gYmFja3RyYWNrIGF0IGFueSBwb2ludFxuICBpZiAoc3RhdGUuYmFja3RyYWNrID09PSB0cnVlKSB7XG4gICAgc3RhdGUub3V0cHV0ID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHN0YXRlLnRva2Vucykge1xuICAgICAgc3RhdGUub3V0cHV0ICs9IHRva2VuLm91dHB1dCAhPSBudWxsID8gdG9rZW4ub3V0cHV0IDogdG9rZW4udmFsdWU7XG5cbiAgICAgIGlmICh0b2tlbi5zdWZmaXgpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IHRva2VuLnN1ZmZpeDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59O1xuXG4vKipcbiAqIEZhc3QgcGF0aHMgZm9yIGNyZWF0aW5nIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIGNvbW1vbiBnbG9iIHBhdHRlcm5zLlxuICogVGhpcyBjYW4gc2lnbmlmaWNhbnRseSBzcGVlZCB1cCBwcm9jZXNzaW5nIGFuZCBoYXMgdmVyeSBsaXR0bGUgZG93bnNpZGVcbiAqIGltcGFjdCB3aGVuIG5vbmUgb2YgdGhlIGZhc3QgcGF0aHMgbWF0Y2guXG4gKi9cblxucGFyc2UuZmFzdHBhdGhzID0gKGlucHV0LCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgY29uc3QgbWF4ID0gdHlwZW9mIG9wdHMubWF4TGVuZ3RoID09PSAnbnVtYmVyJyA/IE1hdGgubWluKE1BWF9MRU5HVEgsIG9wdHMubWF4TGVuZ3RoKSA6IE1BWF9MRU5HVEg7XG4gIGNvbnN0IGxlbiA9IGlucHV0Lmxlbmd0aDtcbiAgaWYgKGxlbiA+IG1heCkge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgSW5wdXQgbGVuZ3RoOiAke2xlbn0sIGV4Y2VlZHMgbWF4aW11bSBhbGxvd2VkIGxlbmd0aDogJHttYXh9YCk7XG4gIH1cblxuICBpbnB1dCA9IFJFUExBQ0VNRU5UU1tpbnB1dF0gfHwgaW5wdXQ7XG4gIGNvbnN0IHdpbjMyID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpO1xuXG4gIC8vIGNyZWF0ZSBjb25zdGFudHMgYmFzZWQgb24gcGxhdGZvcm0sIGZvciB3aW5kb3dzIG9yIHBvc2l4XG4gIGNvbnN0IHtcbiAgICBET1RfTElURVJBTCxcbiAgICBTTEFTSF9MSVRFUkFMLFxuICAgIE9ORV9DSEFSLFxuICAgIERPVFNfU0xBU0gsXG4gICAgTk9fRE9ULFxuICAgIE5PX0RPVFMsXG4gICAgTk9fRE9UU19TTEFTSCxcbiAgICBTVEFSLFxuICAgIFNUQVJUX0FOQ0hPUlxuICB9ID0gY29uc3RhbnRzLmdsb2JDaGFycyh3aW4zMik7XG5cbiAgY29uc3Qgbm9kb3QgPSBvcHRzLmRvdCA/IE5PX0RPVFMgOiBOT19ET1Q7XG4gIGNvbnN0IHNsYXNoRG90ID0gb3B0cy5kb3QgPyBOT19ET1RTX1NMQVNIIDogTk9fRE9UO1xuICBjb25zdCBjYXB0dXJlID0gb3B0cy5jYXB0dXJlID8gJycgOiAnPzonO1xuICBjb25zdCBzdGF0ZSA9IHsgbmVnYXRlZDogZmFsc2UsIHByZWZpeDogJycgfTtcbiAgbGV0IHN0YXIgPSBvcHRzLmJhc2ggPT09IHRydWUgPyAnLio/JyA6IFNUQVI7XG5cbiAgaWYgKG9wdHMuY2FwdHVyZSkge1xuICAgIHN0YXIgPSBgKCR7c3Rhcn0pYDtcbiAgfVxuXG4gIGNvbnN0IGdsb2JzdGFyID0gKG9wdHMpID0+IHtcbiAgICBpZiAob3B0cy5ub2dsb2JzdGFyID09PSB0cnVlKSByZXR1cm4gc3RhcjtcbiAgICByZXR1cm4gYCgke2NhcHR1cmV9KD86KD8hJHtTVEFSVF9BTkNIT1J9JHtvcHRzLmRvdCA/IERPVFNfU0xBU0ggOiBET1RfTElURVJBTH0pLikqPylgO1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZSA9IHN0ciA9PiB7XG4gICAgc3dpdGNoIChzdHIpIHtcbiAgICAgIGNhc2UgJyonOlxuICAgICAgICByZXR1cm4gYCR7bm9kb3R9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnLionOlxuICAgICAgICByZXR1cm4gYCR7RE9UX0xJVEVSQUx9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKi4qJzpcbiAgICAgICAgcmV0dXJuIGAke25vZG90fSR7c3Rhcn0ke0RPVF9MSVRFUkFMfSR7T05FX0NIQVJ9JHtzdGFyfWA7XG5cbiAgICAgIGNhc2UgJyovKic6XG4gICAgICAgIHJldHVybiBgJHtub2RvdH0ke3N0YXJ9JHtTTEFTSF9MSVRFUkFMfSR7T05FX0NIQVJ9JHtzbGFzaERvdH0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKionOlxuICAgICAgICByZXR1cm4gbm9kb3QgKyBnbG9ic3RhcihvcHRzKTtcblxuICAgICAgY2FzZSAnKiovKic6XG4gICAgICAgIHJldHVybiBgKD86JHtub2RvdH0ke2dsb2JzdGFyKG9wdHMpfSR7U0xBU0hfTElURVJBTH0pPyR7c2xhc2hEb3R9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKiovKi4qJzpcbiAgICAgICAgcmV0dXJuIGAoPzoke25vZG90fSR7Z2xvYnN0YXIob3B0cyl9JHtTTEFTSF9MSVRFUkFMfSk/JHtzbGFzaERvdH0ke3N0YXJ9JHtET1RfTElURVJBTH0ke09ORV9DSEFSfSR7c3Rhcn1gO1xuXG4gICAgICBjYXNlICcqKi8uKic6XG4gICAgICAgIHJldHVybiBgKD86JHtub2RvdH0ke2dsb2JzdGFyKG9wdHMpfSR7U0xBU0hfTElURVJBTH0pPyR7RE9UX0xJVEVSQUx9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBjb25zdCBtYXRjaCA9IC9eKC4qPylcXC4oXFx3KykkLy5leGVjKHN0cik7XG4gICAgICAgIGlmICghbWF0Y2gpIHJldHVybjtcblxuICAgICAgICBjb25zdCBzb3VyY2UgPSBjcmVhdGUobWF0Y2hbMV0pO1xuICAgICAgICBpZiAoIXNvdXJjZSkgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBzb3VyY2UgKyBET1RfTElURVJBTCArIG1hdGNoWzJdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBvdXRwdXQgPSB1dGlscy5yZW1vdmVQcmVmaXgoaW5wdXQsIHN0YXRlKTtcbiAgbGV0IHNvdXJjZSA9IGNyZWF0ZShvdXRwdXQpO1xuXG4gIGlmIChzb3VyY2UgJiYgb3B0cy5zdHJpY3RTbGFzaGVzICE9PSB0cnVlKSB7XG4gICAgc291cmNlICs9IGAke1NMQVNIX0xJVEVSQUx9P2A7XG4gIH1cblxuICByZXR1cm4gc291cmNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBzY2FuID0gcmVxdWlyZSgnLi9zY2FuJyk7XG5jb25zdCBwYXJzZSA9IHJlcXVpcmUoJy4vcGFyc2UnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuY29uc3QgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcbmNvbnN0IGlzT2JqZWN0ID0gdmFsID0+IHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRjaGVyIGZ1bmN0aW9uIGZyb20gb25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJucy4gVGhlXG4gKiByZXR1cm5lZCBmdW5jdGlvbiB0YWtlcyBhIHN0cmluZyB0byBtYXRjaCBhcyBpdHMgZmlyc3QgYXJndW1lbnQsXG4gKiBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBzdHJpbmcgaXMgYSBtYXRjaC4gVGhlIHJldHVybmVkIG1hdGNoZXJcbiAqIGZ1bmN0aW9uIGFsc28gdGFrZXMgYSBib29sZWFuIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdGhhdCwgd2hlbiB0cnVlLFxuICogcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaChnbG9iWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnN0IGlzTWF0Y2ggPSBwaWNvbWF0Y2goJyouISgqYSknKTtcbiAqIGNvbnNvbGUubG9nKGlzTWF0Y2goJ2EuYScpKTsgLy89PiBmYWxzZVxuICogY29uc29sZS5sb2coaXNNYXRjaCgnYS5iJykpOyAvLz0+IHRydWVcbiAqIGBgYFxuICogQG5hbWUgcGljb21hdGNoXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYGdsb2JzYCBPbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zLlxuICogQHBhcmFtIHtPYmplY3Q9fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0Z1bmN0aW9uPX0gUmV0dXJucyBhIG1hdGNoZXIgZnVuY3Rpb24uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmNvbnN0IHBpY29tYXRjaCA9IChnbG9iLCBvcHRpb25zLCByZXR1cm5TdGF0ZSA9IGZhbHNlKSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KGdsb2IpKSB7XG4gICAgY29uc3QgZm5zID0gZ2xvYi5tYXAoaW5wdXQgPT4gcGljb21hdGNoKGlucHV0LCBvcHRpb25zLCByZXR1cm5TdGF0ZSkpO1xuICAgIGNvbnN0IGFycmF5TWF0Y2hlciA9IHN0ciA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGlzTWF0Y2ggb2YgZm5zKSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gaXNNYXRjaChzdHIpO1xuICAgICAgICBpZiAoc3RhdGUpIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIHJldHVybiBhcnJheU1hdGNoZXI7XG4gIH1cblxuICBjb25zdCBpc1N0YXRlID0gaXNPYmplY3QoZ2xvYikgJiYgZ2xvYi50b2tlbnMgJiYgZ2xvYi5pbnB1dDtcblxuICBpZiAoZ2xvYiA9PT0gJycgfHwgKHR5cGVvZiBnbG9iICE9PSAnc3RyaW5nJyAmJiAhaXNTdGF0ZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBwYXR0ZXJuIHRvIGJlIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuICB9XG5cbiAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IHBvc2l4ID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpO1xuICBjb25zdCByZWdleCA9IGlzU3RhdGVcbiAgICA/IHBpY29tYXRjaC5jb21waWxlUmUoZ2xvYiwgb3B0aW9ucylcbiAgICA6IHBpY29tYXRjaC5tYWtlUmUoZ2xvYiwgb3B0aW9ucywgZmFsc2UsIHRydWUpO1xuXG4gIGNvbnN0IHN0YXRlID0gcmVnZXguc3RhdGU7XG4gIGRlbGV0ZSByZWdleC5zdGF0ZTtcblxuICBsZXQgaXNJZ25vcmVkID0gKCkgPT4gZmFsc2U7XG4gIGlmIChvcHRzLmlnbm9yZSkge1xuICAgIGNvbnN0IGlnbm9yZU9wdHMgPSB7IC4uLm9wdGlvbnMsIGlnbm9yZTogbnVsbCwgb25NYXRjaDogbnVsbCwgb25SZXN1bHQ6IG51bGwgfTtcbiAgICBpc0lnbm9yZWQgPSBwaWNvbWF0Y2gob3B0cy5pZ25vcmUsIGlnbm9yZU9wdHMsIHJldHVyblN0YXRlKTtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoZXIgPSAoaW5wdXQsIHJldHVybk9iamVjdCA9IGZhbHNlKSA9PiB7XG4gICAgY29uc3QgeyBpc01hdGNoLCBtYXRjaCwgb3V0cHV0IH0gPSBwaWNvbWF0Y2gudGVzdChpbnB1dCwgcmVnZXgsIG9wdGlvbnMsIHsgZ2xvYiwgcG9zaXggfSk7XG4gICAgY29uc3QgcmVzdWx0ID0geyBnbG9iLCBzdGF0ZSwgcmVnZXgsIHBvc2l4LCBpbnB1dCwgb3V0cHV0LCBtYXRjaCwgaXNNYXRjaCB9O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRzLm9uUmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcHRzLm9uUmVzdWx0KHJlc3VsdCk7XG4gICAgfVxuXG4gICAgaWYgKGlzTWF0Y2ggPT09IGZhbHNlKSB7XG4gICAgICByZXN1bHQuaXNNYXRjaCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHJldHVybk9iamVjdCA/IHJlc3VsdCA6IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc0lnbm9yZWQoaW5wdXQpKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdHMub25JZ25vcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb3B0cy5vbklnbm9yZShyZXN1bHQpO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmlzTWF0Y2ggPSBmYWxzZTtcbiAgICAgIHJldHVybiByZXR1cm5PYmplY3QgPyByZXN1bHQgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHMub25NYXRjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb3B0cy5vbk1hdGNoKHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXR1cm5PYmplY3QgPyByZXN1bHQgOiB0cnVlO1xuICB9O1xuXG4gIGlmIChyZXR1cm5TdGF0ZSkge1xuICAgIG1hdGNoZXIuc3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVyO1xufTtcblxuLyoqXG4gKiBUZXN0IGBpbnB1dGAgd2l0aCB0aGUgZ2l2ZW4gYHJlZ2V4YC4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBtYWluXG4gKiBgcGljb21hdGNoKClgIGZ1bmN0aW9uIHRvIHRlc3QgdGhlIGlucHV0IHN0cmluZy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiAvLyBwaWNvbWF0Y2gudGVzdChpbnB1dCwgcmVnZXhbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cocGljb21hdGNoLnRlc3QoJ2Zvby9iYXInLCAvXig/OihbXi9dKj8pXFwvKFteL10qPykpJC8pKTtcbiAqIC8vIHsgaXNNYXRjaDogdHJ1ZSwgbWF0Y2g6IFsgJ2Zvby8nLCAnZm9vJywgJ2JhcicgXSwgb3V0cHV0OiAnZm9vL2JhcicgfVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBTdHJpbmcgdG8gdGVzdC5cbiAqIEBwYXJhbSB7UmVnRXhwfSBgcmVnZXhgXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggbWF0Y2hpbmcgaW5mby5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucGljb21hdGNoLnRlc3QgPSAoaW5wdXQsIHJlZ2V4LCBvcHRpb25zLCB7IGdsb2IsIHBvc2l4IH0gPSB7fSkgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGlucHV0IHRvIGJlIGEgc3RyaW5nJyk7XG4gIH1cblxuICBpZiAoaW5wdXQgPT09ICcnKSB7XG4gICAgcmV0dXJuIHsgaXNNYXRjaDogZmFsc2UsIG91dHB1dDogJycgfTtcbiAgfVxuXG4gIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBmb3JtYXQgPSBvcHRzLmZvcm1hdCB8fCAocG9zaXggPyB1dGlscy50b1Bvc2l4U2xhc2hlcyA6IG51bGwpO1xuICBsZXQgbWF0Y2ggPSBpbnB1dCA9PT0gZ2xvYjtcbiAgbGV0IG91dHB1dCA9IChtYXRjaCAmJiBmb3JtYXQpID8gZm9ybWF0KGlucHV0KSA6IGlucHV0O1xuXG4gIGlmIChtYXRjaCA9PT0gZmFsc2UpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXQgPyBmb3JtYXQoaW5wdXQpIDogaW5wdXQ7XG4gICAgbWF0Y2ggPSBvdXRwdXQgPT09IGdsb2I7XG4gIH1cblxuICBpZiAobWF0Y2ggPT09IGZhbHNlIHx8IG9wdHMuY2FwdHVyZSA9PT0gdHJ1ZSkge1xuICAgIGlmIChvcHRzLm1hdGNoQmFzZSA9PT0gdHJ1ZSB8fCBvcHRzLmJhc2VuYW1lID09PSB0cnVlKSB7XG4gICAgICBtYXRjaCA9IHBpY29tYXRjaC5tYXRjaEJhc2UoaW5wdXQsIHJlZ2V4LCBvcHRpb25zLCBwb3NpeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGlzTWF0Y2g6IEJvb2xlYW4obWF0Y2gpLCBtYXRjaCwgb3V0cHV0IH07XG59O1xuXG4vKipcbiAqIE1hdGNoIHRoZSBiYXNlbmFtZSBvZiBhIGZpbGVwYXRoLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC5tYXRjaEJhc2UoaW5wdXQsIGdsb2JbLCBvcHRpb25zXSk7XG4gKiBjb25zb2xlLmxvZyhwaWNvbWF0Y2gubWF0Y2hCYXNlKCdmb28vYmFyLmpzJywgJyouanMnKTsgLy8gdHJ1ZVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBTdHJpbmcgdG8gdGVzdC5cbiAqIEBwYXJhbSB7UmVnRXhwfFN0cmluZ30gYGdsb2JgIEdsb2IgcGF0dGVybiBvciByZWdleCBjcmVhdGVkIGJ5IFsubWFrZVJlXSgjbWFrZVJlKS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC5tYXRjaEJhc2UgPSAoaW5wdXQsIGdsb2IsIG9wdGlvbnMsIHBvc2l4ID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpKSA9PiB7XG4gIGNvbnN0IHJlZ2V4ID0gZ2xvYiBpbnN0YW5jZW9mIFJlZ0V4cCA/IGdsb2IgOiBwaWNvbWF0Y2gubWFrZVJlKGdsb2IsIG9wdGlvbnMpO1xuICByZXR1cm4gcmVnZXgudGVzdChwYXRoLmJhc2VuYW1lKGlucHV0KSk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiAqKmFueSoqIG9mIHRoZSBnaXZlbiBnbG9iIGBwYXR0ZXJuc2AgbWF0Y2ggdGhlIHNwZWNpZmllZCBgc3RyaW5nYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiAvLyBwaWNvbWF0Y2guaXNNYXRjaChzdHJpbmcsIHBhdHRlcm5zWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKHBpY29tYXRjaC5pc01hdGNoKCdhLmEnLCBbJ2IuKicsICcqLmEnXSkpOyAvLz0+IHRydWVcbiAqIGNvbnNvbGUubG9nKHBpY29tYXRjaC5pc01hdGNoKCdhLmEnLCAnYi4qJykpOyAvLz0+IGZhbHNlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBzdHIgVGhlIHN0cmluZyB0byB0ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHBhdHRlcm5zIE9uZSBvciBtb3JlIGdsb2IgcGF0dGVybnMgdG8gdXNlIGZvciBtYXRjaGluZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpLlxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFueSBwYXR0ZXJucyBtYXRjaCBgc3RyYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2guaXNNYXRjaCA9IChzdHIsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiBwaWNvbWF0Y2gocGF0dGVybnMsIG9wdGlvbnMpKHN0cik7XG5cbi8qKlxuICogUGFyc2UgYSBnbG9iIHBhdHRlcm4gdG8gY3JlYXRlIHRoZSBzb3VyY2Ugc3RyaW5nIGZvciBhIHJlZ3VsYXJcbiAqIGV4cHJlc3Npb24uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogY29uc3QgcmVzdWx0ID0gcGljb21hdGNoLnBhcnNlKHBhdHRlcm5bLCBvcHRpb25zXSk7XG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgcGF0dGVybmBcbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB1c2VmdWwgcHJvcGVydGllcyBhbmQgb3V0cHV0IHRvIGJlIHVzZWQgYXMgYSByZWdleCBzb3VyY2Ugc3RyaW5nLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2gucGFyc2UgPSAocGF0dGVybiwgb3B0aW9ucykgPT4ge1xuICBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuKSkgcmV0dXJuIHBhdHRlcm4ubWFwKHAgPT4gcGljb21hdGNoLnBhcnNlKHAsIG9wdGlvbnMpKTtcbiAgcmV0dXJuIHBhcnNlKHBhdHRlcm4sIHsgLi4ub3B0aW9ucywgZmFzdHBhdGhzOiBmYWxzZSB9KTtcbn07XG5cbi8qKlxuICogU2NhbiBhIGdsb2IgcGF0dGVybiB0byBzZXBhcmF0ZSB0aGUgcGF0dGVybiBpbnRvIHNlZ21lbnRzLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC5zY2FuKGlucHV0Wywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnN0IHJlc3VsdCA9IHBpY29tYXRjaC5zY2FuKCchLi9mb28vKi5qcycpO1xuICogY29uc29sZS5sb2cocmVzdWx0KTtcbiAqIHsgcHJlZml4OiAnIS4vJyxcbiAqICAgaW5wdXQ6ICchLi9mb28vKi5qcycsXG4gKiAgIHN0YXJ0OiAzLFxuICogICBiYXNlOiAnZm9vJyxcbiAqICAgZ2xvYjogJyouanMnLFxuICogICBpc0JyYWNlOiBmYWxzZSxcbiAqICAgaXNCcmFja2V0OiBmYWxzZSxcbiAqICAgaXNHbG9iOiB0cnVlLFxuICogICBpc0V4dGdsb2I6IGZhbHNlLFxuICogICBpc0dsb2JzdGFyOiBmYWxzZSxcbiAqICAgbmVnYXRlZDogdHJ1ZSB9XG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgaW5wdXRgIEdsb2IgcGF0dGVybiB0byBzY2FuLlxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC5zY2FuID0gKGlucHV0LCBvcHRpb25zKSA9PiBzY2FuKGlucHV0LCBvcHRpb25zKTtcblxuLyoqXG4gKiBDcmVhdGUgYSByZWd1bGFyIGV4cHJlc3Npb24gZnJvbSBhIHBhcnNlZCBnbG9iIHBhdHRlcm4uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogY29uc3Qgc3RhdGUgPSBwaWNvbWF0Y2gucGFyc2UoJyouanMnKTtcbiAqIC8vIHBpY29tYXRjaC5jb21waWxlUmUoc3RhdGVbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cocGljb21hdGNoLmNvbXBpbGVSZShzdGF0ZSkpO1xuICogLy89PiAvXig/Oig/IVxcLikoPz0uKVteL10qP1xcLmpzKSQvXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RhdGVgIFRoZSBvYmplY3QgcmV0dXJuZWQgZnJvbSB0aGUgYC5wYXJzZWAgbWV0aG9kLlxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7UmVnRXhwfSBSZXR1cm5zIGEgcmVnZXggY3JlYXRlZCBmcm9tIHRoZSBnaXZlbiBwYXR0ZXJuLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2guY29tcGlsZVJlID0gKHBhcnNlZCwgb3B0aW9ucywgcmV0dXJuT3V0cHV0ID0gZmFsc2UsIHJldHVyblN0YXRlID0gZmFsc2UpID0+IHtcbiAgaWYgKHJldHVybk91dHB1dCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBwYXJzZWQub3V0cHV0O1xuICB9XG5cbiAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IHByZXBlbmQgPSBvcHRzLmNvbnRhaW5zID8gJycgOiAnXic7XG4gIGNvbnN0IGFwcGVuZCA9IG9wdHMuY29udGFpbnMgPyAnJyA6ICckJztcblxuICBsZXQgc291cmNlID0gYCR7cHJlcGVuZH0oPzoke3BhcnNlZC5vdXRwdXR9KSR7YXBwZW5kfWA7XG4gIGlmIChwYXJzZWQgJiYgcGFyc2VkLm5lZ2F0ZWQgPT09IHRydWUpIHtcbiAgICBzb3VyY2UgPSBgXig/ISR7c291cmNlfSkuKiRgO1xuICB9XG5cbiAgY29uc3QgcmVnZXggPSBwaWNvbWF0Y2gudG9SZWdleChzb3VyY2UsIG9wdGlvbnMpO1xuICBpZiAocmV0dXJuU3RhdGUgPT09IHRydWUpIHtcbiAgICByZWdleC5zdGF0ZSA9IHBhcnNlZDtcbiAgfVxuXG4gIHJldHVybiByZWdleDtcbn07XG5cbnBpY29tYXRjaC5tYWtlUmUgPSAoaW5wdXQsIG9wdGlvbnMsIHJldHVybk91dHB1dCA9IGZhbHNlLCByZXR1cm5TdGF0ZSA9IGZhbHNlKSA9PiB7XG4gIGlmICghaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuICB9XG5cbiAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIGxldCBwYXJzZWQgPSB7IG5lZ2F0ZWQ6IGZhbHNlLCBmYXN0cGF0aHM6IHRydWUgfTtcbiAgbGV0IHByZWZpeCA9ICcnO1xuICBsZXQgb3V0cHV0O1xuXG4gIGlmIChpbnB1dC5zdGFydHNXaXRoKCcuLycpKSB7XG4gICAgaW5wdXQgPSBpbnB1dC5zbGljZSgyKTtcbiAgICBwcmVmaXggPSBwYXJzZWQucHJlZml4ID0gJy4vJztcbiAgfVxuXG4gIGlmIChvcHRzLmZhc3RwYXRocyAhPT0gZmFsc2UgJiYgKGlucHV0WzBdID09PSAnLicgfHwgaW5wdXRbMF0gPT09ICcqJykpIHtcbiAgICBvdXRwdXQgPSBwYXJzZS5mYXN0cGF0aHMoaW5wdXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgaWYgKG91dHB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcGFyc2VkID0gcGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuICAgIHBhcnNlZC5wcmVmaXggPSBwcmVmaXggKyAocGFyc2VkLnByZWZpeCB8fCAnJyk7XG4gIH0gZWxzZSB7XG4gICAgcGFyc2VkLm91dHB1dCA9IG91dHB1dDtcbiAgfVxuXG4gIHJldHVybiBwaWNvbWF0Y2guY29tcGlsZVJlKHBhcnNlZCwgb3B0aW9ucywgcmV0dXJuT3V0cHV0LCByZXR1cm5TdGF0ZSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBmcm9tIHRoZSBnaXZlbiByZWdleCBzb3VyY2Ugc3RyaW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC50b1JlZ2V4KHNvdXJjZVssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zdCB7IG91dHB1dCB9ID0gcGljb21hdGNoLnBhcnNlKCcqLmpzJyk7XG4gKiBjb25zb2xlLmxvZyhwaWNvbWF0Y2gudG9SZWdleChvdXRwdXQpKTtcbiAqIC8vPT4gL14oPzooPyFcXC4pKD89LilbXi9dKj9cXC5qcykkL1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHNvdXJjZWAgUmVndWxhciBleHByZXNzaW9uIHNvdXJjZSBzdHJpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC50b1JlZ2V4ID0gKHNvdXJjZSwgb3B0aW9ucykgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHNvdXJjZSwgb3B0cy5mbGFncyB8fCAob3B0cy5ub2Nhc2UgPyAnaScgOiAnJykpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmRlYnVnID09PSB0cnVlKSB0aHJvdyBlcnI7XG4gICAgcmV0dXJuIC8kXi87XG4gIH1cbn07XG5cbi8qKlxuICogUGljb21hdGNoIGNvbnN0YW50cy5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5waWNvbWF0Y2guY29uc3RhbnRzID0gY29uc3RhbnRzO1xuXG4vKipcbiAqIEV4cG9zZSBcInBpY29tYXRjaFwiXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBwaWNvbWF0Y2g7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL3BpY29tYXRjaCcpO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbmNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJ3BpY29tYXRjaC9saWIvdXRpbHMnKTtcbmNvbnN0IGlzRW1wdHlTdHJpbmcgPSB2YWwgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgKHZhbCA9PT0gJycgfHwgdmFsID09PSAnLi8nKTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBtYXRjaCBvbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tKGxpc3QsIHBhdHRlcm5zWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKG1tKFsnYS5qcycsICdhLnR4dCddLCBbJyouanMnXSkpO1xuICogLy89PiBbICdhLmpzJyBdXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5PHN0cmluZz59IGxpc3QgTGlzdCBvZiBzdHJpbmdzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXk8c3RyaW5nPn0gcGF0dGVybnMgT25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJucyB0byB1c2UgZm9yIG1hdGNoaW5nLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpXG4gKiBAcmV0dXJuIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBtYXRjaGVzXG4gKiBAc3VtbWFyeSBmYWxzZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jb25zdCBtaWNyb21hdGNoID0gKGxpc3QsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIHBhdHRlcm5zID0gW10uY29uY2F0KHBhdHRlcm5zKTtcbiAgbGlzdCA9IFtdLmNvbmNhdChsaXN0KTtcblxuICBsZXQgb21pdCA9IG5ldyBTZXQoKTtcbiAgbGV0IGtlZXAgPSBuZXcgU2V0KCk7XG4gIGxldCBpdGVtcyA9IG5ldyBTZXQoKTtcbiAgbGV0IG5lZ2F0aXZlcyA9IDA7XG5cbiAgbGV0IG9uUmVzdWx0ID0gc3RhdGUgPT4ge1xuICAgIGl0ZW1zLmFkZChzdGF0ZS5vdXRwdXQpO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMub25SZXN1bHQpIHtcbiAgICAgIG9wdGlvbnMub25SZXN1bHQoc3RhdGUpO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdHRlcm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGlzTWF0Y2ggPSBwaWNvbWF0Y2goU3RyaW5nKHBhdHRlcm5zW2ldKSwgeyAuLi5vcHRpb25zLCBvblJlc3VsdCB9LCB0cnVlKTtcbiAgICBsZXQgbmVnYXRlZCA9IGlzTWF0Y2guc3RhdGUubmVnYXRlZCB8fCBpc01hdGNoLnN0YXRlLm5lZ2F0ZWRFeHRnbG9iO1xuICAgIGlmIChuZWdhdGVkKSBuZWdhdGl2ZXMrKztcblxuICAgIGZvciAobGV0IGl0ZW0gb2YgbGlzdCkge1xuICAgICAgbGV0IG1hdGNoZWQgPSBpc01hdGNoKGl0ZW0sIHRydWUpO1xuXG4gICAgICBsZXQgbWF0Y2ggPSBuZWdhdGVkID8gIW1hdGNoZWQuaXNNYXRjaCA6IG1hdGNoZWQuaXNNYXRjaDtcbiAgICAgIGlmICghbWF0Y2gpIGNvbnRpbnVlO1xuXG4gICAgICBpZiAobmVnYXRlZCkge1xuICAgICAgICBvbWl0LmFkZChtYXRjaGVkLm91dHB1dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvbWl0LmRlbGV0ZShtYXRjaGVkLm91dHB1dCk7XG4gICAgICAgIGtlZXAuYWRkKG1hdGNoZWQub3V0cHV0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgcmVzdWx0ID0gbmVnYXRpdmVzID09PSBwYXR0ZXJucy5sZW5ndGggPyBbLi4uaXRlbXNdIDogWy4uLmtlZXBdO1xuICBsZXQgbWF0Y2hlcyA9IHJlc3VsdC5maWx0ZXIoaXRlbSA9PiAhb21pdC5oYXMoaXRlbSkpO1xuXG4gIGlmIChvcHRpb25zICYmIG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKG9wdGlvbnMuZmFpbGdsb2IgPT09IHRydWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gbWF0Y2hlcyBmb3VuZCBmb3IgXCIke3BhdHRlcm5zLmpvaW4oJywgJyl9XCJgKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5ub251bGwgPT09IHRydWUgfHwgb3B0aW9ucy5udWxsZ2xvYiA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMudW5lc2NhcGUgPyBwYXR0ZXJucy5tYXAocCA9PiBwLnJlcGxhY2UoL1xcXFwvZywgJycpKSA6IHBhdHRlcm5zO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXRjaGVzO1xufTtcblxuLyoqXG4gKiBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICovXG5cbm1pY3JvbWF0Y2gubWF0Y2ggPSBtaWNyb21hdGNoO1xuXG4vKipcbiAqIFJldHVybnMgYSBtYXRjaGVyIGZ1bmN0aW9uIGZyb20gdGhlIGdpdmVuIGdsb2IgYHBhdHRlcm5gIGFuZCBgb3B0aW9uc2AuXG4gKiBUaGUgcmV0dXJuZWQgZnVuY3Rpb24gdGFrZXMgYSBzdHJpbmcgdG8gbWF0Y2ggYXMgaXRzIG9ubHkgYXJndW1lbnQgYW5kIHJldHVybnNcbiAqIHRydWUgaWYgdGhlIHN0cmluZyBpcyBhIG1hdGNoLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tLm1hdGNoZXIocGF0dGVyblssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zdCBpc01hdGNoID0gbW0ubWF0Y2hlcignKi4hKCphKScpO1xuICogY29uc29sZS5sb2coaXNNYXRjaCgnYS5hJykpOyAvLz0+IGZhbHNlXG4gKiBjb25zb2xlLmxvZyhpc01hdGNoKCdhLmInKSk7IC8vPT4gdHJ1ZVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHBhdHRlcm5gIEdsb2IgcGF0dGVyblxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7RnVuY3Rpb259IFJldHVybnMgYSBtYXRjaGVyIGZ1bmN0aW9uLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLm1hdGNoZXIgPSAocGF0dGVybiwgb3B0aW9ucykgPT4gcGljb21hdGNoKHBhdHRlcm4sIG9wdGlvbnMpO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiAqKmFueSoqIG9mIHRoZSBnaXZlbiBnbG9iIGBwYXR0ZXJuc2AgbWF0Y2ggdGhlIHNwZWNpZmllZCBgc3RyaW5nYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgbW0gPSByZXF1aXJlKCdtaWNyb21hdGNoJyk7XG4gKiAvLyBtbS5pc01hdGNoKHN0cmluZywgcGF0dGVybnNbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cobW0uaXNNYXRjaCgnYS5hJywgWydiLionLCAnKi5hJ10pKTsgLy89PiB0cnVlXG4gKiBjb25zb2xlLmxvZyhtbS5pc01hdGNoKCdhLmEnLCAnYi4qJykpOyAvLz0+IGZhbHNlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byB0ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHBhdHRlcm5zIE9uZSBvciBtb3JlIGdsb2IgcGF0dGVybnMgdG8gdXNlIGZvciBtYXRjaGluZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpLlxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFueSBwYXR0ZXJucyBtYXRjaCBgc3RyYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLmlzTWF0Y2ggPSAoc3RyLCBwYXR0ZXJucywgb3B0aW9ucykgPT4gcGljb21hdGNoKHBhdHRlcm5zLCBvcHRpb25zKShzdHIpO1xuXG4vKipcbiAqIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gKi9cblxubWljcm9tYXRjaC5hbnkgPSBtaWNyb21hdGNoLmlzTWF0Y2g7XG5cbi8qKlxuICogUmV0dXJucyBhIGxpc3Qgb2Ygc3RyaW5ncyB0aGF0IF8qKmRvIG5vdCBtYXRjaCBhbnkqKl8gb2YgdGhlIGdpdmVuIGBwYXR0ZXJuc2AuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IG1tID0gcmVxdWlyZSgnbWljcm9tYXRjaCcpO1xuICogLy8gbW0ubm90KGxpc3QsIHBhdHRlcm5zWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKG1tLm5vdChbJ2EuYScsICdiLmInLCAnYy5jJ10sICcqLmEnKSk7XG4gKiAvLz0+IFsnYi5iJywgJ2MuYyddXG4gKiBgYGBcbiAqIEBwYXJhbSB7QXJyYXl9IGBsaXN0YCBBcnJheSBvZiBzdHJpbmdzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGBwYXR0ZXJuc2AgT25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJuIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgIFNlZSBhdmFpbGFibGUgW29wdGlvbnNdKCNvcHRpb25zKSBmb3IgY2hhbmdpbmcgaG93IG1hdGNoZXMgYXJlIHBlcmZvcm1lZFxuICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0ICoqZG8gbm90IG1hdGNoKiogdGhlIGdpdmVuIHBhdHRlcm5zLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLm5vdCA9IChsaXN0LCBwYXR0ZXJucywgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIHBhdHRlcm5zID0gW10uY29uY2F0KHBhdHRlcm5zKS5tYXAoU3RyaW5nKTtcbiAgbGV0IHJlc3VsdCA9IG5ldyBTZXQoKTtcbiAgbGV0IGl0ZW1zID0gW107XG5cbiAgbGV0IG9uUmVzdWx0ID0gc3RhdGUgPT4ge1xuICAgIGlmIChvcHRpb25zLm9uUmVzdWx0KSBvcHRpb25zLm9uUmVzdWx0KHN0YXRlKTtcbiAgICBpdGVtcy5wdXNoKHN0YXRlLm91dHB1dCk7XG4gIH07XG5cbiAgbGV0IG1hdGNoZXMgPSBtaWNyb21hdGNoKGxpc3QsIHBhdHRlcm5zLCB7IC4uLm9wdGlvbnMsIG9uUmVzdWx0IH0pO1xuXG4gIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICBpZiAoIW1hdGNoZXMuaW5jbHVkZXMoaXRlbSkpIHtcbiAgICAgIHJlc3VsdC5hZGQoaXRlbSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBbLi4ucmVzdWx0XTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBgc3RyaW5nYCBjb250YWlucyB0aGUgZ2l2ZW4gcGF0dGVybi4gU2ltaWxhclxuICogdG8gWy5pc01hdGNoXSgjaXNNYXRjaCkgYnV0IHRoZSBwYXR0ZXJuIGNhbiBtYXRjaCBhbnkgcGFydCBvZiB0aGUgc3RyaW5nLlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgbW0gPSByZXF1aXJlKCdtaWNyb21hdGNoJyk7XG4gKiAvLyBtbS5jb250YWlucyhzdHJpbmcsIHBhdHRlcm5bLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cobW0uY29udGFpbnMoJ2FhL2JiL2NjJywgJypiJykpO1xuICogLy89PiB0cnVlXG4gKiBjb25zb2xlLmxvZyhtbS5jb250YWlucygnYWEvYmIvY2MnLCAnKmQnKSk7XG4gKiAvLz0+IGZhbHNlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyYCBUaGUgc3RyaW5nIHRvIG1hdGNoLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGBwYXR0ZXJuc2AgR2xvYiBwYXR0ZXJuIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgIFNlZSBhdmFpbGFibGUgW29wdGlvbnNdKCNvcHRpb25zKSBmb3IgY2hhbmdpbmcgaG93IG1hdGNoZXMgYXJlIHBlcmZvcm1lZFxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHRoZSBwYXR0ZXIgbWF0Y2hlcyBhbnkgcGFydCBvZiBgc3RyYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubWljcm9tYXRjaC5jb250YWlucyA9IChzdHIsIHBhdHRlcm4sIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRXhwZWN0ZWQgYSBzdHJpbmc6IFwiJHt1dGlsLmluc3BlY3Qoc3RyKX1cImApO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybikpIHtcbiAgICByZXR1cm4gcGF0dGVybi5zb21lKHAgPT4gbWljcm9tYXRjaC5jb250YWlucyhzdHIsIHAsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAoaXNFbXB0eVN0cmluZyhzdHIpIHx8IGlzRW1wdHlTdHJpbmcocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc3RyLmluY2x1ZGVzKHBhdHRlcm4pIHx8IChzdHIuc3RhcnRzV2l0aCgnLi8nKSAmJiBzdHIuc2xpY2UoMikuaW5jbHVkZXMocGF0dGVybikpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWljcm9tYXRjaC5pc01hdGNoKHN0ciwgcGF0dGVybiwgeyAuLi5vcHRpb25zLCBjb250YWluczogdHJ1ZSB9KTtcbn07XG5cbi8qKlxuICogRmlsdGVyIHRoZSBrZXlzIG9mIHRoZSBnaXZlbiBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gYGdsb2JgIHBhdHRlcm5cbiAqIGFuZCBgb3B0aW9uc2AuIERvZXMgbm90IGF0dGVtcHQgdG8gbWF0Y2ggbmVzdGVkIGtleXMuIElmIHlvdSBuZWVkIHRoaXMgZmVhdHVyZSxcbiAqIHVzZSBbZ2xvYi1vYmplY3RdW10gaW5zdGVhZC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgbW0gPSByZXF1aXJlKCdtaWNyb21hdGNoJyk7XG4gKiAvLyBtbS5tYXRjaEtleXMob2JqZWN0LCBwYXR0ZXJuc1ssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zdCBvYmogPSB7IGFhOiAnYScsIGFiOiAnYicsIGFjOiAnYycgfTtcbiAqIGNvbnNvbGUubG9nKG1tLm1hdGNoS2V5cyhvYmosICcqYicpKTtcbiAqIC8vPT4geyBhYjogJ2InIH1cbiAqIGBgYFxuICogQHBhcmFtIHtPYmplY3R9IGBvYmplY3RgIFRoZSBvYmplY3Qgd2l0aCBrZXlzIHRvIGZpbHRlci5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBgcGF0dGVybnNgIE9uZSBvciBtb3JlIGdsb2IgcGF0dGVybnMgdG8gdXNlIGZvciBtYXRjaGluZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2AgU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpIGZvciBjaGFuZ2luZyBob3cgbWF0Y2hlcyBhcmUgcGVyZm9ybWVkXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggb25seSBrZXlzIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIHBhdHRlcm5zLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLm1hdGNoS2V5cyA9IChvYmosIHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIGlmICghdXRpbHMuaXNPYmplY3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHRoZSBmaXJzdCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QnKTtcbiAgfVxuICBsZXQga2V5cyA9IG1pY3JvbWF0Y2goT2JqZWN0LmtleXMob2JqKSwgcGF0dGVybnMsIG9wdGlvbnMpO1xuICBsZXQgcmVzID0ge307XG4gIGZvciAobGV0IGtleSBvZiBrZXlzKSByZXNba2V5XSA9IG9ialtrZXldO1xuICByZXR1cm4gcmVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgc29tZSBvZiB0aGUgc3RyaW5ncyBpbiB0aGUgZ2l2ZW4gYGxpc3RgIG1hdGNoIGFueSBvZiB0aGUgZ2l2ZW4gZ2xvYiBgcGF0dGVybnNgLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tLnNvbWUobGlzdCwgcGF0dGVybnNbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cobW0uc29tZShbJ2Zvby5qcycsICdiYXIuanMnXSwgWycqLmpzJywgJyFmb28uanMnXSkpO1xuICogLy8gdHJ1ZVxuICogY29uc29sZS5sb2cobW0uc29tZShbJ2Zvby5qcyddLCBbJyouanMnLCAnIWZvby5qcyddKSk7XG4gKiAvLyBmYWxzZVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYGxpc3RgIFRoZSBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncyB0byB0ZXN0LiBSZXR1cm5zIGFzIHNvb24gYXMgdGhlIGZpcnN0IG1hdGNoIGlzIGZvdW5kLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGBwYXR0ZXJuc2AgT25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJucyB0byB1c2UgZm9yIG1hdGNoaW5nLlxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYCBTZWUgYXZhaWxhYmxlIFtvcHRpb25zXSgjb3B0aW9ucykgZm9yIGNoYW5naW5nIGhvdyBtYXRjaGVzIGFyZSBwZXJmb3JtZWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBhbnkgcGF0dGVybnMgbWF0Y2ggYHN0cmBcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubWljcm9tYXRjaC5zb21lID0gKGxpc3QsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIGxldCBpdGVtcyA9IFtdLmNvbmNhdChsaXN0KTtcblxuICBmb3IgKGxldCBwYXR0ZXJuIG9mIFtdLmNvbmNhdChwYXR0ZXJucykpIHtcbiAgICBsZXQgaXNNYXRjaCA9IHBpY29tYXRjaChTdHJpbmcocGF0dGVybiksIG9wdGlvbnMpO1xuICAgIGlmIChpdGVtcy5zb21lKGl0ZW0gPT4gaXNNYXRjaChpdGVtKSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBldmVyeSBzdHJpbmcgaW4gdGhlIGdpdmVuIGBsaXN0YCBtYXRjaGVzXG4gKiBhbnkgb2YgdGhlIGdpdmVuIGdsb2IgYHBhdHRlcm5zYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgbW0gPSByZXF1aXJlKCdtaWNyb21hdGNoJyk7XG4gKiAvLyBtbS5ldmVyeShsaXN0LCBwYXR0ZXJuc1ssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhtbS5ldmVyeSgnZm9vLmpzJywgWydmb28uanMnXSkpO1xuICogLy8gdHJ1ZVxuICogY29uc29sZS5sb2cobW0uZXZlcnkoWydmb28uanMnLCAnYmFyLmpzJ10sIFsnKi5qcyddKSk7XG4gKiAvLyB0cnVlXG4gKiBjb25zb2xlLmxvZyhtbS5ldmVyeShbJ2Zvby5qcycsICdiYXIuanMnXSwgWycqLmpzJywgJyFmb28uanMnXSkpO1xuICogLy8gZmFsc2VcbiAqIGNvbnNvbGUubG9nKG1tLmV2ZXJ5KFsnZm9vLmpzJ10sIFsnKi5qcycsICchZm9vLmpzJ10pKTtcbiAqIC8vIGZhbHNlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBgbGlzdGAgVGhlIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmdzIHRvIHRlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYHBhdHRlcm5zYCBPbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgIFNlZSBhdmFpbGFibGUgW29wdGlvbnNdKCNvcHRpb25zKSBmb3IgY2hhbmdpbmcgaG93IG1hdGNoZXMgYXJlIHBlcmZvcm1lZFxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFueSBwYXR0ZXJucyBtYXRjaCBgc3RyYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLmV2ZXJ5ID0gKGxpc3QsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIGxldCBpdGVtcyA9IFtdLmNvbmNhdChsaXN0KTtcblxuICBmb3IgKGxldCBwYXR0ZXJuIG9mIFtdLmNvbmNhdChwYXR0ZXJucykpIHtcbiAgICBsZXQgaXNNYXRjaCA9IHBpY29tYXRjaChTdHJpbmcocGF0dGVybiksIG9wdGlvbnMpO1xuICAgIGlmICghaXRlbXMuZXZlcnkoaXRlbSA9PiBpc01hdGNoKGl0ZW0pKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmICoqYWxsKiogb2YgdGhlIGdpdmVuIGBwYXR0ZXJuc2AgbWF0Y2hcbiAqIHRoZSBzcGVjaWZpZWQgc3RyaW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tLmFsbChzdHJpbmcsIHBhdHRlcm5zWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKG1tLmFsbCgnZm9vLmpzJywgWydmb28uanMnXSkpO1xuICogLy8gdHJ1ZVxuICpcbiAqIGNvbnNvbGUubG9nKG1tLmFsbCgnZm9vLmpzJywgWycqLmpzJywgJyFmb28uanMnXSkpO1xuICogLy8gZmFsc2VcbiAqXG4gKiBjb25zb2xlLmxvZyhtbS5hbGwoJ2Zvby5qcycsIFsnKi5qcycsICdmb28uanMnXSkpO1xuICogLy8gdHJ1ZVxuICpcbiAqIGNvbnNvbGUubG9nKG1tLmFsbCgnZm9vLmpzJywgWycqLmpzJywgJ2YqJywgJypvKicsICcqby5qcyddKSk7XG4gKiAvLyB0cnVlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBgc3RyYCBUaGUgc3RyaW5nIHRvIHRlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYHBhdHRlcm5zYCBPbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgIFNlZSBhdmFpbGFibGUgW29wdGlvbnNdKCNvcHRpb25zKSBmb3IgY2hhbmdpbmcgaG93IG1hdGNoZXMgYXJlIHBlcmZvcm1lZFxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFueSBwYXR0ZXJucyBtYXRjaCBgc3RyYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLmFsbCA9IChzdHIsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIGEgc3RyaW5nOiBcIiR7dXRpbC5pbnNwZWN0KHN0cil9XCJgKTtcbiAgfVxuXG4gIHJldHVybiBbXS5jb25jYXQocGF0dGVybnMpLmV2ZXJ5KHAgPT4gcGljb21hdGNoKHAsIG9wdGlvbnMpKHN0cikpO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIG1hdGNoZXMgY2FwdHVyZWQgYnkgYHBhdHRlcm5gIGluIGBzdHJpbmcsIG9yIGBudWxsYCBpZiB0aGUgcGF0dGVybiBkaWQgbm90IG1hdGNoLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tLmNhcHR1cmUocGF0dGVybiwgc3RyaW5nWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKG1tLmNhcHR1cmUoJ3Rlc3QvKi5qcycsICd0ZXN0L2Zvby5qcycpKTtcbiAqIC8vPT4gWydmb28nXVxuICogY29uc29sZS5sb2cobW0uY2FwdHVyZSgndGVzdC8qLmpzJywgJ2Zvby9iYXIuY3NzJykpO1xuICogLy89PiBudWxsXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgZ2xvYmAgR2xvYiBwYXR0ZXJuIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBTdHJpbmcgdG8gbWF0Y2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2AgU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpIGZvciBjaGFuZ2luZyBob3cgbWF0Y2hlcyBhcmUgcGVyZm9ybWVkXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIGFuIGFycmF5IG9mIGNhcHR1cmVzIGlmIHRoZSBpbnB1dCBtYXRjaGVzIHRoZSBnbG9iIHBhdHRlcm4sIG90aGVyd2lzZSBgbnVsbGAuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1pY3JvbWF0Y2guY2FwdHVyZSA9IChnbG9iLCBpbnB1dCwgb3B0aW9ucykgPT4ge1xuICBsZXQgcG9zaXggPSB1dGlscy5pc1dpbmRvd3Mob3B0aW9ucyk7XG4gIGxldCByZWdleCA9IHBpY29tYXRjaC5tYWtlUmUoU3RyaW5nKGdsb2IpLCB7IC4uLm9wdGlvbnMsIGNhcHR1cmU6IHRydWUgfSk7XG4gIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMocG9zaXggPyB1dGlscy50b1Bvc2l4U2xhc2hlcyhpbnB1dCkgOiBpbnB1dCk7XG5cbiAgaWYgKG1hdGNoKSB7XG4gICAgcmV0dXJuIG1hdGNoLnNsaWNlKDEpLm1hcCh2ID0+IHYgPT09IHZvaWQgMCA/ICcnIDogdik7XG4gIH1cbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgcmVndWxhciBleHByZXNzaW9uIGZyb20gdGhlIGdpdmVuIGdsb2IgYHBhdHRlcm5gLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tLm1ha2VSZShwYXR0ZXJuWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKG1tLm1ha2VSZSgnKi5qcycpKTtcbiAqIC8vPT4gL14oPzooXFwuW1xcXFxcXC9dKT8oPyFcXC4pKD89LilbXlxcL10qP1xcLmpzKSQvXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgcGF0dGVybmAgQSBnbG9iIHBhdHRlcm4gdG8gY29udmVydCB0byByZWdleC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge1JlZ0V4cH0gUmV0dXJucyBhIHJlZ2V4IGNyZWF0ZWQgZnJvbSB0aGUgZ2l2ZW4gcGF0dGVybi5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubWljcm9tYXRjaC5tYWtlUmUgPSAoLi4uYXJncykgPT4gcGljb21hdGNoLm1ha2VSZSguLi5hcmdzKTtcblxuLyoqXG4gKiBTY2FuIGEgZ2xvYiBwYXR0ZXJuIHRvIHNlcGFyYXRlIHRoZSBwYXR0ZXJuIGludG8gc2VnbWVudHMuIFVzZWRcbiAqIGJ5IHRoZSBbc3BsaXRdKCNzcGxpdCkgbWV0aG9kLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIGNvbnN0IHN0YXRlID0gbW0uc2NhbihwYXR0ZXJuWywgb3B0aW9uc10pO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHBhdHRlcm5gXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGhcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubWljcm9tYXRjaC5zY2FuID0gKC4uLmFyZ3MpID0+IHBpY29tYXRjaC5zY2FuKC4uLmFyZ3MpO1xuXG4vKipcbiAqIFBhcnNlIGEgZ2xvYiBwYXR0ZXJuIHRvIGNyZWF0ZSB0aGUgc291cmNlIHN0cmluZyBmb3IgYSByZWd1bGFyXG4gKiBleHByZXNzaW9uLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIGNvbnN0IHN0YXRlID0gbW0ocGF0dGVyblssIG9wdGlvbnNdKTtcbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBnbG9iYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHVzZWZ1bCBwcm9wZXJ0aWVzIGFuZCBvdXRwdXQgdG8gYmUgdXNlZCBhcyByZWdleCBzb3VyY2Ugc3RyaW5nLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLnBhcnNlID0gKHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIGxldCByZXMgPSBbXTtcbiAgZm9yIChsZXQgcGF0dGVybiBvZiBbXS5jb25jYXQocGF0dGVybnMgfHwgW10pKSB7XG4gICAgZm9yIChsZXQgc3RyIG9mIGJyYWNlcyhTdHJpbmcocGF0dGVybiksIG9wdGlvbnMpKSB7XG4gICAgICByZXMucHVzaChwaWNvbWF0Y2gucGFyc2Uoc3RyLCBvcHRpb25zKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59O1xuXG4vKipcbiAqIFByb2Nlc3MgdGhlIGdpdmVuIGJyYWNlIGBwYXR0ZXJuYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeyBicmFjZXMgfSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIGNvbnNvbGUubG9nKGJyYWNlcygnZm9vL3thLGIsY30vYmFyJykpO1xuICogLy89PiBbICdmb28vKGF8YnxjKS9iYXInIF1cbiAqXG4gKiBjb25zb2xlLmxvZyhicmFjZXMoJ2Zvby97YSxiLGN9L2JhcicsIHsgZXhwYW5kOiB0cnVlIH0pKTtcbiAqIC8vPT4gWyAnZm9vL2EvYmFyJywgJ2Zvby9iL2JhcicsICdmb28vYy9iYXInIF1cbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBwYXR0ZXJuYCBTdHJpbmcgd2l0aCBicmFjZSBwYXR0ZXJuIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgIEFueSBbb3B0aW9uc10oI29wdGlvbnMpIHRvIGNoYW5nZSBob3cgZXhwYW5zaW9uIGlzIHBlcmZvcm1lZC4gU2VlIHRoZSBbYnJhY2VzXVtdIGxpYnJhcnkgZm9yIGFsbCBhdmFpbGFibGUgb3B0aW9ucy5cbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLmJyYWNlcyA9IChwYXR0ZXJuLCBvcHRpb25zKSA9PiB7XG4gIGlmICh0eXBlb2YgcGF0dGVybiAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG4gIGlmICgob3B0aW9ucyAmJiBvcHRpb25zLm5vYnJhY2UgPT09IHRydWUpIHx8ICEvXFx7LipcXH0vLnRlc3QocGF0dGVybikpIHtcbiAgICByZXR1cm4gW3BhdHRlcm5dO1xuICB9XG4gIHJldHVybiBicmFjZXMocGF0dGVybiwgb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEV4cGFuZCBicmFjZXNcbiAqL1xuXG5taWNyb21hdGNoLmJyYWNlRXhwYW5kID0gKHBhdHRlcm4sIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBwYXR0ZXJuICE9PSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBzdHJpbmcnKTtcbiAgcmV0dXJuIG1pY3JvbWF0Y2guYnJhY2VzKHBhdHRlcm4sIHsgLi4ub3B0aW9ucywgZXhwYW5kOiB0cnVlIH0pO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgbWljcm9tYXRjaFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gbWljcm9tYXRjaDtcbiIsICJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fc3ByZWFkQXJyYXlzID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5cykgfHwgZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcbiAgICByZXR1cm4gcjtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEluZGV4ID0gZXhwb3J0cy5nZXRUYWdzID0gZXhwb3J0cy5lbXB0eVRhZ3MgPSBleHBvcnRzLmFsaWFzID0gZXhwb3J0cy5jbGVhbiA9IGV4cG9ydHMuU3RyaWN0VHlwZSA9IGV4cG9ydHMuZGljdGlvbmFyeSA9IGV4cG9ydHMuSW50ZWdlciA9IGV4cG9ydHMucmVmaW5lbWVudCA9IGV4cG9ydHMub2JqZWN0ID0gZXhwb3J0cy5PYmplY3RUeXBlID0gZXhwb3J0cy5EaWN0aW9uYXJ5ID0gZXhwb3J0cy5hbnkgPSBleHBvcnRzLkFueVR5cGUgPSBleHBvcnRzLm5ldmVyID0gZXhwb3J0cy5OZXZlclR5cGUgPSBleHBvcnRzLmdldERlZmF1bHRDb250ZXh0ID0gZXhwb3J0cy5nZXRWYWxpZGF0aW9uRXJyb3IgPSBleHBvcnRzLnZvaWQgPSBleHBvcnRzLmludGVyZmFjZSA9IGV4cG9ydHMuQXJyYXkgPSBleHBvcnRzLnVuZGVmaW5lZCA9IGV4cG9ydHMubnVsbCA9IGV4cG9ydHMuZXhhY3QgPSBleHBvcnRzLkV4YWN0VHlwZSA9IGV4cG9ydHMudGFnZ2VkVW5pb24gPSBleHBvcnRzLlRhZ2dlZFVuaW9uVHlwZSA9IGV4cG9ydHMuc3RyaWN0ID0gZXhwb3J0cy5yZWFkb25seUFycmF5ID0gZXhwb3J0cy5SZWFkb25seUFycmF5VHlwZSA9IGV4cG9ydHMucmVhZG9ubHkgPSBleHBvcnRzLlJlYWRvbmx5VHlwZSA9IGV4cG9ydHMudHVwbGUgPSBleHBvcnRzLlR1cGxlVHlwZSA9IGV4cG9ydHMuaW50ZXJzZWN0aW9uID0gZXhwb3J0cy5tZXJnZUFsbCA9IGV4cG9ydHMuSW50ZXJzZWN0aW9uVHlwZSA9IGV4cG9ydHMudW5pb24gPSBleHBvcnRzLlVuaW9uVHlwZSA9IGV4cG9ydHMucmVjb3JkID0gZXhwb3J0cy5nZXREb21haW5LZXlzID0gZXhwb3J0cy5EaWN0aW9uYXJ5VHlwZSA9IGV4cG9ydHMucGFydGlhbCA9IGV4cG9ydHMuUGFydGlhbFR5cGUgPSBleHBvcnRzLnR5cGUgPSBleHBvcnRzLkludGVyZmFjZVR5cGUgPSBleHBvcnRzLmFycmF5ID0gZXhwb3J0cy5BcnJheVR5cGUgPSBleHBvcnRzLnJlY3Vyc2lvbiA9IGV4cG9ydHMuUmVjdXJzaXZlVHlwZSA9IGV4cG9ydHMua2V5b2YgPSBleHBvcnRzLktleW9mVHlwZSA9IGV4cG9ydHMubGl0ZXJhbCA9IGV4cG9ydHMuTGl0ZXJhbFR5cGUgPSBleHBvcnRzLkludCA9IGV4cG9ydHMuYnJhbmQgPSBleHBvcnRzLlJlZmluZW1lbnRUeXBlID0gZXhwb3J0cy5GdW5jdGlvbiA9IGV4cG9ydHMuRnVuY3Rpb25UeXBlID0gZXhwb3J0cy5Vbmtub3duUmVjb3JkID0gZXhwb3J0cy5BbnlEaWN0aW9uYXJ5VHlwZSA9IGV4cG9ydHMuVW5rbm93bkFycmF5ID0gZXhwb3J0cy5BbnlBcnJheVR5cGUgPSBleHBvcnRzLmJvb2xlYW4gPSBleHBvcnRzLkJvb2xlYW5UeXBlID0gZXhwb3J0cy5iaWdpbnQgPSBleHBvcnRzLkJpZ0ludFR5cGUgPSBleHBvcnRzLm51bWJlciA9IGV4cG9ydHMuTnVtYmVyVHlwZSA9IGV4cG9ydHMuc3RyaW5nID0gZXhwb3J0cy5TdHJpbmdUeXBlID0gZXhwb3J0cy51bmtub3duID0gZXhwb3J0cy5Vbmtub3duVHlwZSA9IGV4cG9ydHMudm9pZFR5cGUgPSBleHBvcnRzLlZvaWRUeXBlID0gZXhwb3J0cy5VbmRlZmluZWRUeXBlID0gZXhwb3J0cy5udWxsVHlwZSA9IGV4cG9ydHMuTnVsbFR5cGUgPSBleHBvcnRzLnN1Y2Nlc3MgPSBleHBvcnRzLmZhaWx1cmUgPSBleHBvcnRzLmZhaWx1cmVzID0gZXhwb3J0cy5hcHBlbmRDb250ZXh0ID0gZXhwb3J0cy5nZXRDb250ZXh0RW50cnkgPSBleHBvcnRzLmdldEZ1bmN0aW9uTmFtZSA9IGV4cG9ydHMuaWRlbnRpdHkgPSBleHBvcnRzLlR5cGUgPSB2b2lkIDA7XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgRWl0aGVyXzEgPSByZXF1aXJlKFwiZnAtdHMvbGliL0VpdGhlclwiKTtcbi8qKlxuICogQGNhdGVnb3J5IE1vZGVsXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIFR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVHlwZShcbiAgICAvKiogYSB1bmlxdWUgbmFtZSBmb3IgdGhpcyBjb2RlYyAqL1xuICAgIG5hbWUsIFxuICAgIC8qKiBhIGN1c3RvbSB0eXBlIGd1YXJkICovXG4gICAgaXMsIFxuICAgIC8qKiBzdWNjZWVkcyBpZiBhIHZhbHVlIG9mIHR5cGUgSSBjYW4gYmUgZGVjb2RlZCB0byBhIHZhbHVlIG9mIHR5cGUgQSAqL1xuICAgIHZhbGlkYXRlLCBcbiAgICAvKiogY29udmVydHMgYSB2YWx1ZSBvZiB0eXBlIEEgdG8gYSB2YWx1ZSBvZiB0eXBlIE8gKi9cbiAgICBlbmNvZGUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pcyA9IGlzO1xuICAgICAgICB0aGlzLnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICAgIHRoaXMuZW5jb2RlID0gZW5jb2RlO1xuICAgICAgICB0aGlzLmRlY29kZSA9IHRoaXMuZGVjb2RlLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIFR5cGUucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiAoYWIsIG5hbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gXCJwaXBlKFwiICsgdGhpcy5uYW1lICsgXCIsIFwiICsgYWIubmFtZSArIFwiKVwiOyB9XG4gICAgICAgIHJldHVybiBuZXcgVHlwZShuYW1lLCBhYi5pcywgZnVuY3Rpb24gKGksIGMpIHtcbiAgICAgICAgICAgIHZhciBlID0gX3RoaXMudmFsaWRhdGUoaSwgYyk7XG4gICAgICAgICAgICBpZiAoRWl0aGVyXzEuaXNMZWZ0KGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWIudmFsaWRhdGUoZS5yaWdodCwgYyk7XG4gICAgICAgIH0sIHRoaXMuZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5ICYmIGFiLmVuY29kZSA9PT0gZXhwb3J0cy5pZGVudGl0eSA/IGV4cG9ydHMuaWRlbnRpdHkgOiBmdW5jdGlvbiAoYikgeyByZXR1cm4gX3RoaXMuZW5jb2RlKGFiLmVuY29kZShiKSk7IH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQHNpbmNlIDEuMC4wXG4gICAgICovXG4gICAgVHlwZS5wcm90b3R5cGUuYXNEZWNvZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIFR5cGUucHJvdG90eXBlLmFzRW5jb2RlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBhIHZlcnNpb24gb2YgYHZhbGlkYXRlYCB3aXRoIGEgZGVmYXVsdCBjb250ZXh0XG4gICAgICogQHNpbmNlIDEuMC4wXG4gICAgICovXG4gICAgVHlwZS5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGUoaSwgW3sga2V5OiAnJywgdHlwZTogdGhpcywgYWN0dWFsOiBpIH1dKTtcbiAgICB9O1xuICAgIHJldHVybiBUeXBlO1xufSgpKTtcbmV4cG9ydHMuVHlwZSA9IFR5cGU7XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLmlkZW50aXR5ID0gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGE7IH07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLmdldEZ1bmN0aW9uTmFtZSA9IGZ1bmN0aW9uIChmKSB7XG4gICAgcmV0dXJuIGYuZGlzcGxheU5hbWUgfHwgZi5uYW1lIHx8IFwiPGZ1bmN0aW9uXCIgKyBmLmxlbmd0aCArIFwiPlwiO1xufTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMuZ2V0Q29udGV4dEVudHJ5ID0gZnVuY3Rpb24gKGtleSwgZGVjb2RlcikgeyByZXR1cm4gKHsga2V5OiBrZXksIHR5cGU6IGRlY29kZXIgfSk7IH07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLmFwcGVuZENvbnRleHQgPSBmdW5jdGlvbiAoYywga2V5LCBkZWNvZGVyLCBhY3R1YWwpIHtcbiAgICB2YXIgbGVuID0gYy5sZW5ndGg7XG4gICAgdmFyIHIgPSBBcnJheShsZW4gKyAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHJbaV0gPSBjW2ldO1xuICAgIH1cbiAgICByW2xlbl0gPSB7IGtleToga2V5LCB0eXBlOiBkZWNvZGVyLCBhY3R1YWw6IGFjdHVhbCB9O1xuICAgIHJldHVybiByO1xufTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMuZmFpbHVyZXMgPSBFaXRoZXJfMS5sZWZ0O1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5mYWlsdXJlID0gZnVuY3Rpb24gKHZhbHVlLCBjb250ZXh0LCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuZmFpbHVyZXMoW3sgdmFsdWU6IHZhbHVlLCBjb250ZXh0OiBjb250ZXh0LCBtZXNzYWdlOiBtZXNzYWdlIH1dKTtcbn07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLnN1Y2Nlc3MgPSBFaXRoZXJfMS5yaWdodDtcbnZhciBwdXNoQWxsID0gZnVuY3Rpb24gKHhzLCB5cykge1xuICAgIHZhciBsID0geXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHhzLnB1c2goeXNbaV0pO1xuICAgIH1cbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBwcmltaXRpdmVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgTnVsbFR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE51bGxUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE51bGxUeXBlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnbnVsbCcsIGZ1bmN0aW9uICh1KSB7IHJldHVybiB1ID09PSBudWxsOyB9LCBmdW5jdGlvbiAodSwgYykgeyByZXR1cm4gKF90aGlzLmlzKHUpID8gZXhwb3J0cy5zdWNjZXNzKHUpIDogZXhwb3J0cy5mYWlsdXJlKHUsIGMpKTsgfSwgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdOdWxsVHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIE51bGxUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLk51bGxUeXBlID0gTnVsbFR5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5udWxsVHlwZSA9IG5ldyBOdWxsVHlwZSgpO1xuZXhwb3J0cy5udWxsID0gZXhwb3J0cy5udWxsVHlwZTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbnZhciBVbmRlZmluZWRUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhVbmRlZmluZWRUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFVuZGVmaW5lZFR5cGUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICd1bmRlZmluZWQnLCBmdW5jdGlvbiAodSkgeyByZXR1cm4gdSA9PT0gdm9pZCAwOyB9LCBmdW5jdGlvbiAodSwgYykgeyByZXR1cm4gKF90aGlzLmlzKHUpID8gZXhwb3J0cy5zdWNjZXNzKHUpIDogZXhwb3J0cy5mYWlsdXJlKHUsIGMpKTsgfSwgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdVbmRlZmluZWRUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gVW5kZWZpbmVkVHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5VbmRlZmluZWRUeXBlID0gVW5kZWZpbmVkVHlwZTtcbnZhciB1bmRlZmluZWRUeXBlID0gbmV3IFVuZGVmaW5lZFR5cGUoKTtcbmV4cG9ydHMudW5kZWZpbmVkID0gdW5kZWZpbmVkVHlwZTtcbi8qKlxuICogQHNpbmNlIDEuMi4wXG4gKi9cbnZhciBWb2lkVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVm9pZFR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVm9pZFR5cGUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICd2b2lkJywgdW5kZWZpbmVkVHlwZS5pcywgdW5kZWZpbmVkVHlwZS52YWxpZGF0ZSwgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdWb2lkVHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFZvaWRUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLlZvaWRUeXBlID0gVm9pZFR5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS4yLjBcbiAqL1xuZXhwb3J0cy52b2lkVHlwZSA9IG5ldyBWb2lkVHlwZSgpO1xuZXhwb3J0cy52b2lkID0gZXhwb3J0cy52b2lkVHlwZTtcbi8qKlxuICogQHNpbmNlIDEuNS4wXG4gKi9cbnZhciBVbmtub3duVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVW5rbm93blR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVW5rbm93blR5cGUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICd1bmtub3duJywgZnVuY3Rpb24gKF8pIHsgcmV0dXJuIHRydWU7IH0sIGV4cG9ydHMuc3VjY2VzcywgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdVbmtub3duVHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFVua25vd25UeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLlVua25vd25UeXBlID0gVW5rbm93blR5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS41LjBcbiAqL1xuZXhwb3J0cy51bmtub3duID0gbmV3IFVua25vd25UeXBlKCk7XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgU3RyaW5nVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3RyaW5nVHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdHJpbmdUeXBlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnc3RyaW5nJywgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHR5cGVvZiB1ID09PSAnc3RyaW5nJzsgfSwgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChfdGhpcy5pcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh1KSA6IGV4cG9ydHMuZmFpbHVyZSh1LCBjKSk7IH0sIGV4cG9ydHMuaWRlbnRpdHkpIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnU3RyaW5nVHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZ1R5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuU3RyaW5nVHlwZSA9IFN0cmluZ1R5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5zdHJpbmcgPSBuZXcgU3RyaW5nVHlwZSgpO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIE51bWJlclR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE51bWJlclR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTnVtYmVyVHlwZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ251bWJlcicsIGZ1bmN0aW9uICh1KSB7IHJldHVybiB0eXBlb2YgdSA9PT0gJ251bWJlcic7IH0sIGZ1bmN0aW9uICh1LCBjKSB7IHJldHVybiAoX3RoaXMuaXModSkgPyBleHBvcnRzLnN1Y2Nlc3ModSkgOiBleHBvcnRzLmZhaWx1cmUodSwgYykpOyB9LCBleHBvcnRzLmlkZW50aXR5KSB8fCB0aGlzO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ051bWJlclR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBOdW1iZXJUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLk51bWJlclR5cGUgPSBOdW1iZXJUeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgUHJpbWl0aXZlc1xuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMubnVtYmVyID0gbmV3IE51bWJlclR5cGUoKTtcbi8qKlxuICogQHNpbmNlIDIuMS4wXG4gKi9cbnZhciBCaWdJbnRUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhCaWdJbnRUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEJpZ0ludFR5cGUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICdiaWdpbnQnLCBcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiB2YWxpZC10eXBlb2ZcbiAgICAgICAgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHR5cGVvZiB1ID09PSAnYmlnaW50JzsgfSwgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChfdGhpcy5pcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh1KSA6IGV4cG9ydHMuZmFpbHVyZSh1LCBjKSk7IH0sIGV4cG9ydHMuaWRlbnRpdHkpIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnQmlnSW50VHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEJpZ0ludFR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuQmlnSW50VHlwZSA9IEJpZ0ludFR5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMi4xLjBcbiAqL1xuZXhwb3J0cy5iaWdpbnQgPSBuZXcgQmlnSW50VHlwZSgpO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIEJvb2xlYW5UeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhCb29sZWFuVHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBCb29sZWFuVHlwZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ2Jvb2xlYW4nLCBmdW5jdGlvbiAodSkgeyByZXR1cm4gdHlwZW9mIHUgPT09ICdib29sZWFuJzsgfSwgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChfdGhpcy5pcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh1KSA6IGV4cG9ydHMuZmFpbHVyZSh1LCBjKSk7IH0sIGV4cG9ydHMuaWRlbnRpdHkpIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnQm9vbGVhblR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBCb29sZWFuVHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5Cb29sZWFuVHlwZSA9IEJvb2xlYW5UeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgUHJpbWl0aXZlc1xuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMuYm9vbGVhbiA9IG5ldyBCb29sZWFuVHlwZSgpO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIEFueUFycmF5VHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQW55QXJyYXlUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFueUFycmF5VHlwZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ1Vua25vd25BcnJheScsIEFycmF5LmlzQXJyYXksIGZ1bmN0aW9uICh1LCBjKSB7IHJldHVybiAoX3RoaXMuaXModSkgPyBleHBvcnRzLnN1Y2Nlc3ModSkgOiBleHBvcnRzLmZhaWx1cmUodSwgYykpOyB9LCBleHBvcnRzLmlkZW50aXR5KSB8fCB0aGlzO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ0FueUFycmF5VHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEFueUFycmF5VHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5BbnlBcnJheVR5cGUgPSBBbnlBcnJheVR5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS43LjFcbiAqL1xuZXhwb3J0cy5Vbmtub3duQXJyYXkgPSBuZXcgQW55QXJyYXlUeXBlKCk7XG5leHBvcnRzLkFycmF5ID0gZXhwb3J0cy5Vbmtub3duQXJyYXk7XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgQW55RGljdGlvbmFyeVR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFueURpY3Rpb25hcnlUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFueURpY3Rpb25hcnlUeXBlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnVW5rbm93blJlY29yZCcsIGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICB2YXIgcyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh1KTtcbiAgICAgICAgICAgIHJldHVybiBzID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBzID09PSAnW29iamVjdCBXaW5kb3ddJztcbiAgICAgICAgfSwgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChfdGhpcy5pcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh1KSA6IGV4cG9ydHMuZmFpbHVyZSh1LCBjKSk7IH0sIGV4cG9ydHMuaWRlbnRpdHkpIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnQW55RGljdGlvbmFyeVR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBBbnlEaWN0aW9uYXJ5VHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5BbnlEaWN0aW9uYXJ5VHlwZSA9IEFueURpY3Rpb25hcnlUeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgUHJpbWl0aXZlc1xuICogQHNpbmNlIDEuNy4xXG4gKi9cbmV4cG9ydHMuVW5rbm93blJlY29yZCA9IG5ldyBBbnlEaWN0aW9uYXJ5VHlwZSgpO1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVwcmVjYXRlZFxuICogQHNpbmNlIDEuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG52YXIgRnVuY3Rpb25UeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhGdW5jdGlvblR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRnVuY3Rpb25UeXBlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnRnVuY3Rpb24nLCBcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnN0cmljdC10eXBlLXByZWRpY2F0ZXNcbiAgICAgICAgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHR5cGVvZiB1ID09PSAnZnVuY3Rpb24nOyB9LCBmdW5jdGlvbiAodSwgYykgeyByZXR1cm4gKF90aGlzLmlzKHUpID8gZXhwb3J0cy5zdWNjZXNzKHUpIDogZXhwb3J0cy5mYWlsdXJlKHUsIGMpKTsgfSwgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdGdW5jdGlvblR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBGdW5jdGlvblR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuRnVuY3Rpb25UeXBlID0gRnVuY3Rpb25UeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVwcmVjYXRlZFxuICogQHNpbmNlIDEuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRlcHJlY2F0aW9uXG5leHBvcnRzLkZ1bmN0aW9uID0gbmV3IEZ1bmN0aW9uVHlwZSgpO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIFJlZmluZW1lbnRUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhSZWZpbmVtZW50VHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBSZWZpbmVtZW50VHlwZShuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSwgdHlwZSwgcHJlZGljYXRlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgX3RoaXMucHJlZGljYXRlID0gcHJlZGljYXRlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ1JlZmluZW1lbnRUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUmVmaW5lbWVudFR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuUmVmaW5lbWVudFR5cGUgPSBSZWZpbmVtZW50VHlwZTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbWJpbmF0b3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBDb21iaW5hdG9yc1xuICogQHNpbmNlIDEuOC4xXG4gKi9cbmV4cG9ydHMuYnJhbmQgPSBmdW5jdGlvbiAoY29kZWMsIHByZWRpY2F0ZSwgbmFtZSkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbiAgICByZXR1cm4gcmVmaW5lbWVudChjb2RlYywgcHJlZGljYXRlLCBuYW1lKTtcbn07XG4vKipcbiAqIEEgYnJhbmRlZCBjb2RlYyByZXByZXNlbnRpbmcgYW4gaW50ZWdlclxuICpcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS44LjFcbiAqL1xuZXhwb3J0cy5JbnQgPSBleHBvcnRzLmJyYW5kKGV4cG9ydHMubnVtYmVyLCBmdW5jdGlvbiAobikgeyByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihuKTsgfSwgJ0ludCcpO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIExpdGVyYWxUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhMaXRlcmFsVHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBMaXRlcmFsVHlwZShuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnTGl0ZXJhbFR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBMaXRlcmFsVHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5MaXRlcmFsVHlwZSA9IExpdGVyYWxUeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgQ29tYmluYXRvcnNcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLmxpdGVyYWwgPSBmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7IH1cbiAgICB2YXIgaXMgPSBmdW5jdGlvbiAodSkgeyByZXR1cm4gdSA9PT0gdmFsdWU7IH07XG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsVHlwZShuYW1lLCBpcywgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChpcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh2YWx1ZSkgOiBleHBvcnRzLmZhaWx1cmUodSwgYykpOyB9LCBleHBvcnRzLmlkZW50aXR5LCB2YWx1ZSk7XG59O1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIEtleW9mVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoS2V5b2ZUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEtleW9mVHlwZShuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSwga2V5cykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMua2V5cyA9IGtleXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnS2V5b2ZUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gS2V5b2ZUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLktleW9mVHlwZSA9IEtleW9mVHlwZTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4vKipcbiAqIEBjYXRlZ29yeSBDb21iaW5hdG9yc1xuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMua2V5b2YgPSBmdW5jdGlvbiAoa2V5cywgbmFtZSkge1xuICAgIGlmIChuYW1lID09PSB2b2lkIDApIHsgbmFtZSA9IE9iamVjdC5rZXlzKGtleXMpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGspIHsgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGspOyB9KVxuICAgICAgICAuam9pbignIHwgJyk7IH1cbiAgICB2YXIgaXMgPSBmdW5jdGlvbiAodSkgeyByZXR1cm4gZXhwb3J0cy5zdHJpbmcuaXModSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbChrZXlzLCB1KTsgfTtcbiAgICByZXR1cm4gbmV3IEtleW9mVHlwZShuYW1lLCBpcywgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChpcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh1KSA6IGV4cG9ydHMuZmFpbHVyZSh1LCBjKSk7IH0sIGV4cG9ydHMuaWRlbnRpdHksIGtleXMpO1xufTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbnZhciBSZWN1cnNpdmVUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhSZWN1cnNpdmVUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFJlY3Vyc2l2ZVR5cGUobmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUsIHJ1bkRlZmluaXRpb24pIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnJ1bkRlZmluaXRpb24gPSBydW5EZWZpbml0aW9uO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ1JlY3Vyc2l2ZVR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBSZWN1cnNpdmVUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLlJlY3Vyc2l2ZVR5cGUgPSBSZWN1cnNpdmVUeXBlO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlY3Vyc2l2ZVR5cGUucHJvdG90eXBlLCAndHlwZScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRGVmaW5pdGlvbigpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbn0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgQ29tYmluYXRvcnNcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLnJlY3Vyc2lvbiA9IGZ1bmN0aW9uIChuYW1lLCBkZWZpbml0aW9uKSB7XG4gICAgdmFyIGNhY2hlO1xuICAgIHZhciBydW5EZWZpbml0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWNhY2hlKSB7XG4gICAgICAgICAgICBjYWNoZSA9IGRlZmluaXRpb24oU2VsZik7XG4gICAgICAgICAgICBjYWNoZS5uYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgfTtcbiAgICB2YXIgU2VsZiA9IG5ldyBSZWN1cnNpdmVUeXBlKG5hbWUsIGZ1bmN0aW9uICh1KSB7IHJldHVybiBydW5EZWZpbml0aW9uKCkuaXModSk7IH0sIGZ1bmN0aW9uICh1LCBjKSB7IHJldHVybiBydW5EZWZpbml0aW9uKCkudmFsaWRhdGUodSwgYyk7IH0sIGZ1bmN0aW9uIChhKSB7IHJldHVybiBydW5EZWZpbml0aW9uKCkuZW5jb2RlKGEpOyB9LCBydW5EZWZpbml0aW9uKTtcbiAgICByZXR1cm4gU2VsZjtcbn07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgQXJyYXlUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcnJheVR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXJyYXlUeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCB0eXBlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdBcnJheVR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBBcnJheVR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuQXJyYXlUeXBlID0gQXJyYXlUeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgQ29tYmluYXRvcnNcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLmFycmF5ID0gZnVuY3Rpb24gKGl0ZW0sIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBcIkFycmF5PFwiICsgaXRlbS5uYW1lICsgXCI+XCI7IH1cbiAgICByZXR1cm4gbmV3IEFycmF5VHlwZShuYW1lLCBmdW5jdGlvbiAodSkgeyByZXR1cm4gZXhwb3J0cy5Vbmtub3duQXJyYXkuaXModSkgJiYgdS5ldmVyeShpdGVtLmlzKTsgfSwgZnVuY3Rpb24gKHUsIGMpIHtcbiAgICAgICAgdmFyIGUgPSBleHBvcnRzLlVua25vd25BcnJheS52YWxpZGF0ZSh1LCBjKTtcbiAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVzID0gZS5yaWdodDtcbiAgICAgICAgdmFyIGxlbiA9IHVzLmxlbmd0aDtcbiAgICAgICAgdmFyIGFzID0gdXM7XG4gICAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIHVpID0gdXNbaV07XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaXRlbS52YWxpZGF0ZSh1aSwgZXhwb3J0cy5hcHBlbmRDb250ZXh0KGMsIFN0cmluZyhpKSwgaXRlbSwgdWkpKTtcbiAgICAgICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQocmVzdWx0KSkge1xuICAgICAgICAgICAgICAgIHB1c2hBbGwoZXJyb3JzLCByZXN1bHQubGVmdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYWkgPSByZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKGFpICE9PSB1aSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXMgPT09IHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcyA9IHVzLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXNbaV0gPSBhaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVycm9ycy5sZW5ndGggPiAwID8gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpIDogZXhwb3J0cy5zdWNjZXNzKGFzKTtcbiAgICB9LCBpdGVtLmVuY29kZSA9PT0gZXhwb3J0cy5pZGVudGl0eSA/IGV4cG9ydHMuaWRlbnRpdHkgOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gYS5tYXAoaXRlbS5lbmNvZGUpOyB9LCBpdGVtKTtcbn07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgSW50ZXJmYWNlVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoSW50ZXJmYWNlVHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBJbnRlcmZhY2VUeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCBwcm9wcykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdJbnRlcmZhY2VUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gSW50ZXJmYWNlVHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5JbnRlcmZhY2VUeXBlID0gSW50ZXJmYWNlVHlwZTtcbnZhciBnZXROYW1lRnJvbVByb3BzID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChrKSB7IHJldHVybiBrICsgXCI6IFwiICsgcHJvcHNba10ubmFtZTsgfSlcbiAgICAgICAgLmpvaW4oJywgJyk7XG59O1xudmFyIHVzZUlkZW50aXR5ID0gZnVuY3Rpb24gKGNvZGVjcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29kZWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjb2RlY3NbaV0uZW5jb2RlICE9PSBleHBvcnRzLmlkZW50aXR5KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xudmFyIGdldEludGVyZmFjZVR5cGVOYW1lID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgcmV0dXJuIFwieyBcIiArIGdldE5hbWVGcm9tUHJvcHMocHJvcHMpICsgXCIgfVwiO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IENvbWJpbmF0b3JzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy50eXBlID0gZnVuY3Rpb24gKHByb3BzLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gZ2V0SW50ZXJmYWNlVHlwZU5hbWUocHJvcHMpOyB9XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgdmFyIHR5cGVzID0ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gcHJvcHNba2V5XTsgfSk7XG4gICAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgSW50ZXJmYWNlVHlwZShuYW1lLCBmdW5jdGlvbiAodSkge1xuICAgICAgICBpZiAoZXhwb3J0cy5Vbmtub3duUmVjb3JkLmlzKHUpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHZhciB1ayA9IHVba107XG4gICAgICAgICAgICAgICAgaWYgKCh1ayA9PT0gdW5kZWZpbmVkICYmICFoYXNPd25Qcm9wZXJ0eS5jYWxsKHUsIGspKSB8fCAhdHlwZXNbaV0uaXModWspKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSwgZnVuY3Rpb24gKHUsIGMpIHtcbiAgICAgICAgdmFyIGUgPSBleHBvcnRzLlVua25vd25SZWNvcmQudmFsaWRhdGUodSwgYyk7XG4gICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQoZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvID0gZS5yaWdodDtcbiAgICAgICAgdmFyIGEgPSBvO1xuICAgICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgIHZhciBhayA9IGFba107XG4gICAgICAgICAgICB2YXIgdHlwZV8xID0gdHlwZXNbaV07XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdHlwZV8xLnZhbGlkYXRlKGFrLCBleHBvcnRzLmFwcGVuZENvbnRleHQoYywgaywgdHlwZV8xLCBhaykpO1xuICAgICAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChyZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgcHVzaEFsbChlcnJvcnMsIHJlc3VsdC5sZWZ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB2YWsgPSByZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKHZhayAhPT0gYWsgfHwgKHZhayA9PT0gdW5kZWZpbmVkICYmICFoYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGspKSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoYSA9PT0gbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IF9fYXNzaWduKHt9LCBvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhW2tdID0gdmFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXJyb3JzLmxlbmd0aCA+IDAgPyBleHBvcnRzLmZhaWx1cmVzKGVycm9ycykgOiBleHBvcnRzLnN1Y2Nlc3MoYSk7XG4gICAgfSwgdXNlSWRlbnRpdHkodHlwZXMpXG4gICAgICAgID8gZXhwb3J0cy5pZGVudGl0eVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgcyA9IF9fYXNzaWduKHt9LCBhKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgayA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGVuY29kZSA9IHR5cGVzW2ldLmVuY29kZTtcbiAgICAgICAgICAgICAgICBpZiAoZW5jb2RlICE9PSBleHBvcnRzLmlkZW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHNba10gPSBlbmNvZGUoYVtrXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sIHByb3BzKTtcbn07XG5leHBvcnRzLmludGVyZmFjZSA9IGV4cG9ydHMudHlwZTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbnZhciBQYXJ0aWFsVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUGFydGlhbFR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUGFydGlhbFR5cGUobmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUsIHByb3BzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ1BhcnRpYWxUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUGFydGlhbFR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuUGFydGlhbFR5cGUgPSBQYXJ0aWFsVHlwZTtcbnZhciBnZXRQYXJ0aWFsVHlwZU5hbWUgPSBmdW5jdGlvbiAoaW5uZXIpIHtcbiAgICByZXR1cm4gXCJQYXJ0aWFsPFwiICsgaW5uZXIgKyBcIj5cIjtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBDb21iaW5hdG9yc1xuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMucGFydGlhbCA9IGZ1bmN0aW9uIChwcm9wcywgbmFtZSkge1xuICAgIGlmIChuYW1lID09PSB2b2lkIDApIHsgbmFtZSA9IGdldFBhcnRpYWxUeXBlTmFtZShnZXRJbnRlcmZhY2VUeXBlTmFtZShwcm9wcykpOyB9XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgdmFyIHR5cGVzID0ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gcHJvcHNba2V5XTsgfSk7XG4gICAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgUGFydGlhbFR5cGUobmFtZSwgZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgaWYgKGV4cG9ydHMuVW5rbm93blJlY29yZC5pcyh1KSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgdWsgPSB1W2tdO1xuICAgICAgICAgICAgICAgIGlmICh1ayAhPT0gdW5kZWZpbmVkICYmICFwcm9wc1trXS5pcyh1aykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LCBmdW5jdGlvbiAodSwgYykge1xuICAgICAgICB2YXIgZSA9IGV4cG9ydHMuVW5rbm93blJlY29yZC52YWxpZGF0ZSh1LCBjKTtcbiAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG8gPSBlLnJpZ2h0O1xuICAgICAgICB2YXIgYSA9IG87XG4gICAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgdmFyIGFrID0gYVtrXTtcbiAgICAgICAgICAgIHZhciB0eXBlXzIgPSBwcm9wc1trXTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0eXBlXzIudmFsaWRhdGUoYWssIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBrLCB0eXBlXzIsIGFrKSk7XG4gICAgICAgICAgICBpZiAoRWl0aGVyXzEuaXNMZWZ0KHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwdXNoQWxsKGVycm9ycywgcmVzdWx0LmxlZnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB2YWsgPSByZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKHZhayAhPT0gYWspIHtcbiAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgPT09IG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBfX2Fzc2lnbih7fSwgbyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYVtrXSA9IHZhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVycm9ycy5sZW5ndGggPiAwID8gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpIDogZXhwb3J0cy5zdWNjZXNzKGEpO1xuICAgIH0sIHVzZUlkZW50aXR5KHR5cGVzKVxuICAgICAgICA/IGV4cG9ydHMuaWRlbnRpdHlcbiAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgdmFyIHMgPSBfX2Fzc2lnbih7fSwgYSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBhayA9IGFba107XG4gICAgICAgICAgICAgICAgaWYgKGFrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc1trXSA9IHR5cGVzW2ldLmVuY29kZShhayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sIHByb3BzKTtcbn07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgRGljdGlvbmFyeVR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKERpY3Rpb25hcnlUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIERpY3Rpb25hcnlUeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCBkb21haW4sIGNvZG9tYWluKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5kb21haW4gPSBkb21haW47XG4gICAgICAgIF90aGlzLmNvZG9tYWluID0gY29kb21haW47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnRGljdGlvbmFyeVR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBEaWN0aW9uYXJ5VHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5EaWN0aW9uYXJ5VHlwZSA9IERpY3Rpb25hcnlUeXBlO1xuZnVuY3Rpb24gZW51bWVyYWJsZVJlY29yZChrZXlzLCBkb21haW4sIGNvZG9tYWluLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gXCJ7IFtLIGluIFwiICsgZG9tYWluLm5hbWUgKyBcIl06IFwiICsgY29kb21haW4ubmFtZSArIFwiIH1cIjsgfVxuICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICByZXR1cm4gbmV3IERpY3Rpb25hcnlUeXBlKG5hbWUsIGZ1bmN0aW9uICh1KSB7IHJldHVybiBleHBvcnRzLlVua25vd25SZWNvcmQuaXModSkgJiYga2V5cy5ldmVyeShmdW5jdGlvbiAoaykgeyByZXR1cm4gY29kb21haW4uaXModVtrXSk7IH0pOyB9LCBmdW5jdGlvbiAodSwgYykge1xuICAgICAgICB2YXIgZSA9IGV4cG9ydHMuVW5rbm93blJlY29yZC52YWxpZGF0ZSh1LCBjKTtcbiAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG8gPSBlLnJpZ2h0O1xuICAgICAgICB2YXIgYSA9IHt9O1xuICAgICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICAgIHZhciBjaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgIHZhciBvayA9IG9ba107XG4gICAgICAgICAgICB2YXIgY29kb21haW5SZXN1bHQgPSBjb2RvbWFpbi52YWxpZGF0ZShvaywgZXhwb3J0cy5hcHBlbmRDb250ZXh0KGMsIGssIGNvZG9tYWluLCBvaykpO1xuICAgICAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChjb2RvbWFpblJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICBwdXNoQWxsKGVycm9ycywgY29kb21haW5SZXN1bHQubGVmdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdm9rID0gY29kb21haW5SZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgY2hhbmdlZCA9IGNoYW5nZWQgfHwgdm9rICE9PSBvaztcbiAgICAgICAgICAgICAgICBhW2tdID0gdm9rO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID4gMCA/IGV4cG9ydHMuZmFpbHVyZXMoZXJyb3JzKSA6IGV4cG9ydHMuc3VjY2VzcygoY2hhbmdlZCB8fCBPYmplY3Qua2V5cyhvKS5sZW5ndGggIT09IGxlbiA/IGEgOiBvKSk7XG4gICAgfSwgY29kb21haW4uZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5XG4gICAgICAgID8gZXhwb3J0cy5pZGVudGl0eVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBzW2tdID0gY29kb21haW4uZW5jb2RlKGFba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sIGRvbWFpbiwgY29kb21haW4pO1xufVxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZnVuY3Rpb24gZ2V0RG9tYWluS2V5cyhkb21haW4pIHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKGlzTGl0ZXJhbEMoZG9tYWluKSkge1xuICAgICAgICB2YXIgbGl0ZXJhbF8xID0gZG9tYWluLnZhbHVlO1xuICAgICAgICBpZiAoZXhwb3J0cy5zdHJpbmcuaXMobGl0ZXJhbF8xKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9hID0ge30sIF9hW2xpdGVyYWxfMV0gPSBudWxsLCBfYTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpc0tleW9mQyhkb21haW4pKSB7XG4gICAgICAgIHJldHVybiBkb21haW4ua2V5cztcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNVbmlvbkMoZG9tYWluKSkge1xuICAgICAgICB2YXIga2V5cyA9IGRvbWFpbi50eXBlcy5tYXAoZnVuY3Rpb24gKHR5cGUpIHsgcmV0dXJuIGdldERvbWFpbktleXModHlwZSk7IH0pO1xuICAgICAgICByZXR1cm4ga2V5cy5zb21lKHVuZGVmaW5lZFR5cGUuaXMpID8gdW5kZWZpbmVkIDogT2JqZWN0LmFzc2lnbi5hcHBseShPYmplY3QsIF9fc3ByZWFkQXJyYXlzKFt7fV0sIGtleXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbmV4cG9ydHMuZ2V0RG9tYWluS2V5cyA9IGdldERvbWFpbktleXM7XG5mdW5jdGlvbiBub25FbnVtZXJhYmxlUmVjb3JkKGRvbWFpbiwgY29kb21haW4sIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBcInsgW0sgaW4gXCIgKyBkb21haW4ubmFtZSArIFwiXTogXCIgKyBjb2RvbWFpbi5uYW1lICsgXCIgfVwiOyB9XG4gICAgcmV0dXJuIG5ldyBEaWN0aW9uYXJ5VHlwZShuYW1lLCBmdW5jdGlvbiAodSkge1xuICAgICAgICBpZiAoZXhwb3J0cy5Vbmtub3duUmVjb3JkLmlzKHUpKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModSkuZXZlcnkoZnVuY3Rpb24gKGspIHsgcmV0dXJuIGRvbWFpbi5pcyhrKSAmJiBjb2RvbWFpbi5pcyh1W2tdKTsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQW55Qyhjb2RvbWFpbikgJiYgQXJyYXkuaXNBcnJheSh1KTtcbiAgICB9LCBmdW5jdGlvbiAodSwgYykge1xuICAgICAgICBpZiAoZXhwb3J0cy5Vbmtub3duUmVjb3JkLmlzKHUpKSB7XG4gICAgICAgICAgICB2YXIgYSA9IHt9O1xuICAgICAgICAgICAgdmFyIGVycm9ycyA9IFtdO1xuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh1KTtcbiAgICAgICAgICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBvayA9IHVba107XG4gICAgICAgICAgICAgICAgdmFyIGRvbWFpblJlc3VsdCA9IGRvbWFpbi52YWxpZGF0ZShrLCBleHBvcnRzLmFwcGVuZENvbnRleHQoYywgaywgZG9tYWluLCBrKSk7XG4gICAgICAgICAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChkb21haW5SZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hBbGwoZXJyb3JzLCBkb21haW5SZXN1bHQubGVmdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmsgPSBkb21haW5SZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSBjaGFuZ2VkIHx8IHZrICE9PSBrO1xuICAgICAgICAgICAgICAgICAgICBrID0gdms7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2RvbWFpblJlc3VsdCA9IGNvZG9tYWluLnZhbGlkYXRlKG9rLCBleHBvcnRzLmFwcGVuZENvbnRleHQoYywgaywgY29kb21haW4sIG9rKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQoY29kb21haW5SZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoQWxsKGVycm9ycywgY29kb21haW5SZXN1bHQubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdm9rID0gY29kb21haW5SZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkID0gY2hhbmdlZCB8fCB2b2sgIT09IG9rO1xuICAgICAgICAgICAgICAgICAgICAgICAgYVtrXSA9IHZvaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID4gMCA/IGV4cG9ydHMuZmFpbHVyZXMoZXJyb3JzKSA6IGV4cG9ydHMuc3VjY2VzcygoY2hhbmdlZCA/IGEgOiB1KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQW55Qyhjb2RvbWFpbikgJiYgQXJyYXkuaXNBcnJheSh1KSkge1xuICAgICAgICAgICAgcmV0dXJuIGV4cG9ydHMuc3VjY2Vzcyh1KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXhwb3J0cy5mYWlsdXJlKHUsIGMpO1xuICAgIH0sIGRvbWFpbi5lbmNvZGUgPT09IGV4cG9ydHMuaWRlbnRpdHkgJiYgY29kb21haW4uZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5XG4gICAgICAgID8gZXhwb3J0cy5pZGVudGl0eVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHt9O1xuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhKTtcbiAgICAgICAgICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgayA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc1tTdHJpbmcoZG9tYWluLmVuY29kZShrKSldID0gY29kb21haW4uZW5jb2RlKGFba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sIGRvbWFpbiwgY29kb21haW4pO1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgQ29tYmluYXRvcnNcbiAqIEBzaW5jZSAxLjcuMVxuICovXG5mdW5jdGlvbiByZWNvcmQoZG9tYWluLCBjb2RvbWFpbiwgbmFtZSkge1xuICAgIHZhciBrZXlzID0gZ2V0RG9tYWluS2V5cyhkb21haW4pO1xuICAgIHJldHVybiBrZXlzXG4gICAgICAgID8gZW51bWVyYWJsZVJlY29yZChPYmplY3Qua2V5cyhrZXlzKSwgZG9tYWluLCBjb2RvbWFpbiwgbmFtZSlcbiAgICAgICAgOiBub25FbnVtZXJhYmxlUmVjb3JkKGRvbWFpbiwgY29kb21haW4sIG5hbWUpO1xufVxuZXhwb3J0cy5yZWNvcmQgPSByZWNvcmQ7XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgVW5pb25UeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhVbmlvblR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVW5pb25UeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCB0eXBlcykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMudHlwZXMgPSB0eXBlcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdVbmlvblR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBVbmlvblR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuVW5pb25UeXBlID0gVW5pb25UeXBlO1xudmFyIGdldFVuaW9uTmFtZSA9IGZ1bmN0aW9uIChjb2RlY3MpIHtcbiAgICByZXR1cm4gJygnICsgY29kZWNzLm1hcChmdW5jdGlvbiAodHlwZSkgeyByZXR1cm4gdHlwZS5uYW1lOyB9KS5qb2luKCcgfCAnKSArICcpJztcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBDb21iaW5hdG9yc1xuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMudW5pb24gPSBmdW5jdGlvbiAoY29kZWNzLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gZ2V0VW5pb25OYW1lKGNvZGVjcyk7IH1cbiAgICB2YXIgaW5kZXggPSBnZXRJbmRleChjb2RlY3MpO1xuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkICYmIGNvZGVjcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciB0YWdfMSA9IGluZGV4WzBdLCBncm91cHNfMSA9IGluZGV4WzFdO1xuICAgICAgICB2YXIgbGVuXzEgPSBncm91cHNfMS5sZW5ndGg7XG4gICAgICAgIHZhciBmaW5kXzEgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuXzE7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChncm91cHNfMVtpXS5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuICAgICAgICByZXR1cm4gbmV3IFRhZ2dlZFVuaW9uVHlwZShuYW1lLCBmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgaWYgKGV4cG9ydHMuVW5rbm93blJlY29yZC5pcyh1KSkge1xuICAgICAgICAgICAgICAgIHZhciBpID0gZmluZF8xKHVbdGFnXzFdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaSAhPT0gdW5kZWZpbmVkID8gY29kZWNzW2ldLmlzKHUpIDogZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sIGZ1bmN0aW9uICh1LCBjKSB7XG4gICAgICAgICAgICB2YXIgZSA9IGV4cG9ydHMuVW5rbm93blJlY29yZC52YWxpZGF0ZSh1LCBjKTtcbiAgICAgICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQoZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByID0gZS5yaWdodDtcbiAgICAgICAgICAgIHZhciBpID0gZmluZF8xKHJbdGFnXzFdKTtcbiAgICAgICAgICAgIGlmIChpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwb3J0cy5mYWlsdXJlKHUsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvZGVjID0gY29kZWNzW2ldO1xuICAgICAgICAgICAgcmV0dXJuIGNvZGVjLnZhbGlkYXRlKHIsIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBTdHJpbmcoaSksIGNvZGVjLCByKSk7XG4gICAgICAgIH0sIHVzZUlkZW50aXR5KGNvZGVjcylcbiAgICAgICAgICAgID8gZXhwb3J0cy5pZGVudGl0eVxuICAgICAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHZhciBpID0gZmluZF8xKGFbdGFnXzFdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nY2FudGkvaW8tdHMvcHVsbC8zMDVcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gY29kZWMgZm91bmQgdG8gZW5jb2RlIHZhbHVlIGluIHVuaW9uIGNvZGVjIFwiICsgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29kZWNzW2ldLmVuY29kZShhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBjb2RlY3MsIHRhZ18xKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgVW5pb25UeXBlKG5hbWUsIGZ1bmN0aW9uICh1KSB7IHJldHVybiBjb2RlY3Muc29tZShmdW5jdGlvbiAodHlwZSkgeyByZXR1cm4gdHlwZS5pcyh1KTsgfSk7IH0sIGZ1bmN0aW9uICh1LCBjKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvZGVjcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb2RlYyA9IGNvZGVjc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gY29kZWMudmFsaWRhdGUodSwgZXhwb3J0cy5hcHBlbmRDb250ZXh0KGMsIFN0cmluZyhpKSwgY29kZWMsIHUpKTtcbiAgICAgICAgICAgICAgICBpZiAoRWl0aGVyXzEuaXNMZWZ0KHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaEFsbChlcnJvcnMsIHJlc3VsdC5sZWZ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBleHBvcnRzLnN1Y2Nlc3MocmVzdWx0LnJpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpO1xuICAgICAgICB9LCB1c2VJZGVudGl0eShjb2RlY3MpXG4gICAgICAgICAgICA/IGV4cG9ydHMuaWRlbnRpdHlcbiAgICAgICAgICAgIDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGNvZGVjc18xID0gY29kZWNzOyBfaSA8IGNvZGVjc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZWMgPSBjb2RlY3NfMVtfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2RlYy5pcyhhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvZGVjLmVuY29kZShhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ2NhbnRpL2lvLXRzL3B1bGwvMzA1XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gY29kZWMgZm91bmQgdG8gZW5jb2RlIHZhbHVlIGluIHVuaW9uIHR5cGUgXCIgKyBuYW1lKTtcbiAgICAgICAgICAgIH0sIGNvZGVjcyk7XG4gICAgfVxufTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbnZhciBJbnRlcnNlY3Rpb25UeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhJbnRlcnNlY3Rpb25UeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEludGVyc2VjdGlvblR5cGUobmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUsIHR5cGVzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50eXBlcyA9IHR5cGVzO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ0ludGVyc2VjdGlvblR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBJbnRlcnNlY3Rpb25UeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLkludGVyc2VjdGlvblR5cGUgPSBJbnRlcnNlY3Rpb25UeXBlO1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0cy5tZXJnZUFsbCA9IGZ1bmN0aW9uIChiYXNlLCB1cykge1xuICAgIHZhciBlcXVhbCA9IHRydWU7XG4gICAgdmFyIHByaW1pdGl2ZSA9IHRydWU7XG4gICAgdmFyIGJhc2VJc05vdEFEaWN0aW9uYXJ5ID0gIWV4cG9ydHMuVW5rbm93blJlY29yZC5pcyhiYXNlKTtcbiAgICBmb3IgKHZhciBfaSA9IDAsIHVzXzEgPSB1czsgX2kgPCB1c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgdSA9IHVzXzFbX2ldO1xuICAgICAgICBpZiAodSAhPT0gYmFzZSkge1xuICAgICAgICAgICAgZXF1YWwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwb3J0cy5Vbmtub3duUmVjb3JkLmlzKHUpKSB7XG4gICAgICAgICAgICBwcmltaXRpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZXF1YWwpIHtcbiAgICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKHByaW1pdGl2ZSkge1xuICAgICAgICByZXR1cm4gdXNbdXMubGVuZ3RoIC0gMV07XG4gICAgfVxuICAgIHZhciByID0ge307XG4gICAgZm9yICh2YXIgX2EgPSAwLCB1c18yID0gdXM7IF9hIDwgdXNfMi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgdmFyIHUgPSB1c18yW19hXTtcbiAgICAgICAgZm9yICh2YXIgayBpbiB1KSB7XG4gICAgICAgICAgICBpZiAoIXIuaGFzT3duUHJvcGVydHkoaykgfHwgYmFzZUlzTm90QURpY3Rpb25hcnkgfHwgdVtrXSAhPT0gYmFzZVtrXSkge1xuICAgICAgICAgICAgICAgIHJba10gPSB1W2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByO1xufTtcbmZ1bmN0aW9uIGludGVyc2VjdGlvbihjb2RlY3MsIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBcIihcIiArIGNvZGVjcy5tYXAoZnVuY3Rpb24gKHR5cGUpIHsgcmV0dXJuIHR5cGUubmFtZTsgfSkuam9pbignICYgJykgKyBcIilcIjsgfVxuICAgIHZhciBsZW4gPSBjb2RlY3MubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgSW50ZXJzZWN0aW9uVHlwZShuYW1lLCBmdW5jdGlvbiAodSkgeyByZXR1cm4gY29kZWNzLmV2ZXJ5KGZ1bmN0aW9uICh0eXBlKSB7IHJldHVybiB0eXBlLmlzKHUpOyB9KTsgfSwgY29kZWNzLmxlbmd0aCA9PT0gMFxuICAgICAgICA/IGV4cG9ydHMuc3VjY2Vzc1xuICAgICAgICA6IGZ1bmN0aW9uICh1LCBjKSB7XG4gICAgICAgICAgICB2YXIgdXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29kZWMgPSBjb2RlY3NbaV07XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNvZGVjLnZhbGlkYXRlKHUsIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBTdHJpbmcoaSksIGNvZGVjLCB1KSk7XG4gICAgICAgICAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChyZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hBbGwoZXJyb3JzLCByZXN1bHQubGVmdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1cy5wdXNoKHJlc3VsdC5yaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVycm9ycy5sZW5ndGggPiAwID8gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpIDogZXhwb3J0cy5zdWNjZXNzKGV4cG9ydHMubWVyZ2VBbGwodSwgdXMpKTtcbiAgICAgICAgfSwgY29kZWNzLmxlbmd0aCA9PT0gMFxuICAgICAgICA/IGV4cG9ydHMuaWRlbnRpdHlcbiAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGV4cG9ydHMubWVyZ2VBbGwoYSwgY29kZWNzLm1hcChmdW5jdGlvbiAoY29kZWMpIHsgcmV0dXJuIGNvZGVjLmVuY29kZShhKTsgfSkpO1xuICAgICAgICB9LCBjb2RlY3MpO1xufVxuZXhwb3J0cy5pbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3Rpb247XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgVHVwbGVUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUdXBsZVR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVHVwbGVUeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCB0eXBlcykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMudHlwZXMgPSB0eXBlcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdUdXBsZVR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBUdXBsZVR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuVHVwbGVUeXBlID0gVHVwbGVUeXBlO1xuZnVuY3Rpb24gdHVwbGUoY29kZWNzLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gXCJbXCIgKyBjb2RlY3MubWFwKGZ1bmN0aW9uICh0eXBlKSB7IHJldHVybiB0eXBlLm5hbWU7IH0pLmpvaW4oJywgJykgKyBcIl1cIjsgfVxuICAgIHZhciBsZW4gPSBjb2RlY3MubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgVHVwbGVUeXBlKG5hbWUsIGZ1bmN0aW9uICh1KSB7IHJldHVybiBleHBvcnRzLlVua25vd25BcnJheS5pcyh1KSAmJiB1Lmxlbmd0aCA9PT0gbGVuICYmIGNvZGVjcy5ldmVyeShmdW5jdGlvbiAodHlwZSwgaSkgeyByZXR1cm4gdHlwZS5pcyh1W2ldKTsgfSk7IH0sIGZ1bmN0aW9uICh1LCBjKSB7XG4gICAgICAgIHZhciBlID0gZXhwb3J0cy5Vbmtub3duQXJyYXkudmFsaWRhdGUodSwgYyk7XG4gICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQoZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1cyA9IGUucmlnaHQ7XG4gICAgICAgIHZhciBhcyA9IHVzLmxlbmd0aCA+IGxlbiA/IHVzLnNsaWNlKDAsIGxlbikgOiB1czsgLy8gc3RyaXAgYWRkaXRpb25hbCBjb21wb25lbnRzXG4gICAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIGEgPSB1c1tpXTtcbiAgICAgICAgICAgIHZhciB0eXBlXzMgPSBjb2RlY3NbaV07XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdHlwZV8zLnZhbGlkYXRlKGEsIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBTdHJpbmcoaSksIHR5cGVfMywgYSkpO1xuICAgICAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChyZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgcHVzaEFsbChlcnJvcnMsIHJlc3VsdC5sZWZ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB2YSA9IHJlc3VsdC5yaWdodDtcbiAgICAgICAgICAgICAgICBpZiAodmEgIT09IGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFzID09PSB1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXMgPSB1cy5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFzW2ldID0gdmE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID4gMCA/IGV4cG9ydHMuZmFpbHVyZXMoZXJyb3JzKSA6IGV4cG9ydHMuc3VjY2Vzcyhhcyk7XG4gICAgfSwgdXNlSWRlbnRpdHkoY29kZWNzKSA/IGV4cG9ydHMuaWRlbnRpdHkgOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gY29kZWNzLm1hcChmdW5jdGlvbiAodHlwZSwgaSkgeyByZXR1cm4gdHlwZS5lbmNvZGUoYVtpXSk7IH0pOyB9LCBjb2RlY3MpO1xufVxuZXhwb3J0cy50dXBsZSA9IHR1cGxlO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIFJlYWRvbmx5VHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVhZG9ubHlUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFJlYWRvbmx5VHlwZShuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSwgdHlwZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnUmVhZG9ubHlUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUmVhZG9ubHlUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLlJlYWRvbmx5VHlwZSA9IFJlYWRvbmx5VHlwZTtcbi8qKlxuICogQGNhdGVnb3J5IENvbWJpbmF0b3JzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5yZWFkb25seSA9IGZ1bmN0aW9uIChjb2RlYywgbmFtZSkge1xuICAgIGlmIChuYW1lID09PSB2b2lkIDApIHsgbmFtZSA9IFwiUmVhZG9ubHk8XCIgKyBjb2RlYy5uYW1lICsgXCI+XCI7IH1cbiAgICByZXR1cm4gbmV3IFJlYWRvbmx5VHlwZShuYW1lLCBjb2RlYy5pcywgY29kZWMudmFsaWRhdGUsIGNvZGVjLmVuY29kZSwgY29kZWMpO1xufTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbnZhciBSZWFkb25seUFycmF5VHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVhZG9ubHlBcnJheVR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUmVhZG9ubHlBcnJheVR5cGUobmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUsIHR5cGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ1JlYWRvbmx5QXJyYXlUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUmVhZG9ubHlBcnJheVR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuUmVhZG9ubHlBcnJheVR5cGUgPSBSZWFkb25seUFycmF5VHlwZTtcbi8qKlxuICogQGNhdGVnb3J5IENvbWJpbmF0b3JzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5yZWFkb25seUFycmF5ID0gZnVuY3Rpb24gKGl0ZW0sIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBcIlJlYWRvbmx5QXJyYXk8XCIgKyBpdGVtLm5hbWUgKyBcIj5cIjsgfVxuICAgIHZhciBjb2RlYyA9IGV4cG9ydHMuYXJyYXkoaXRlbSk7XG4gICAgcmV0dXJuIG5ldyBSZWFkb25seUFycmF5VHlwZShuYW1lLCBjb2RlYy5pcywgY29kZWMudmFsaWRhdGUsIGNvZGVjLmVuY29kZSwgaXRlbSk7XG59O1xuLyoqXG4gKiBTdHJpcHMgYWRkaXRpb25hbCBwcm9wZXJ0aWVzXG4gKlxuICogQGNhdGVnb3J5IENvbWJpbmF0b3JzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5zdHJpY3QgPSBmdW5jdGlvbiAocHJvcHMsIG5hbWUpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5leGFjdChleHBvcnRzLnR5cGUocHJvcHMpLCBuYW1lKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBkZXByZWNhdGVkXG4gKiBAc2luY2UgMS4zLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbnZhciBUYWdnZWRVbmlvblR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFRhZ2dlZFVuaW9uVHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBUYWdnZWRVbmlvblR5cGUobmFtZSwgXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuICAgIGlzLCBcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRlcHJlY2F0aW9uXG4gICAgdmFsaWRhdGUsIFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbiAgICBlbmNvZGUsIGNvZGVjcywgdGFnKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCBjb2RlY3MpIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIC8vIDw9IHdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTM0NTVcbiAgICAgICAgIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnRhZyA9IHRhZztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gVGFnZ2VkVW5pb25UeXBlO1xufShVbmlvblR5cGUpKTtcbmV4cG9ydHMuVGFnZ2VkVW5pb25UeXBlID0gVGFnZ2VkVW5pb25UeXBlO1xuLyoqXG4gKiBVc2UgYHVuaW9uYCBpbnN0ZWFkXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjMuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0cy50YWdnZWRVbmlvbiA9IGZ1bmN0aW9uICh0YWcsIGNvZGVjcywgbmFtZVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gZ2V0VW5pb25OYW1lKGNvZGVjcyk7IH1cbiAgICB2YXIgVSA9IGV4cG9ydHMudW5pb24oY29kZWNzLCBuYW1lKTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRlcHJlY2F0aW9uXG4gICAgaWYgKFUgaW5zdGFuY2VvZiBUYWdnZWRVbmlvblR5cGUpIHtcbiAgICAgICAgcmV0dXJuIFU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJbaW8tdHNdIENhbm5vdCBidWlsZCBhIHRhZ2dlZCB1bmlvbiBmb3IgXCIgKyBuYW1lICsgXCIsIHJldHVybmluZyBhIGRlLW9wdGltaXplZCB1bmlvblwiKTtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuICAgICAgICByZXR1cm4gbmV3IFRhZ2dlZFVuaW9uVHlwZShuYW1lLCBVLmlzLCBVLnZhbGlkYXRlLCBVLmVuY29kZSwgY29kZWNzLCB0YWcpO1xuICAgIH1cbn07XG4vKipcbiAqIEBzaW5jZSAxLjEuMFxuICovXG52YXIgRXhhY3RUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhFeGFjdFR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRXhhY3RUeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCB0eXBlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdFeGFjdFR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBFeGFjdFR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuRXhhY3RUeXBlID0gRXhhY3RUeXBlO1xudmFyIGdldFByb3BzID0gZnVuY3Rpb24gKGNvZGVjKSB7XG4gICAgc3dpdGNoIChjb2RlYy5fdGFnKSB7XG4gICAgICAgIGNhc2UgJ1JlZmluZW1lbnRUeXBlJzpcbiAgICAgICAgY2FzZSAnUmVhZG9ubHlUeXBlJzpcbiAgICAgICAgICAgIHJldHVybiBnZXRQcm9wcyhjb2RlYy50eXBlKTtcbiAgICAgICAgY2FzZSAnSW50ZXJmYWNlVHlwZSc6XG4gICAgICAgIGNhc2UgJ1N0cmljdFR5cGUnOlxuICAgICAgICBjYXNlICdQYXJ0aWFsVHlwZSc6XG4gICAgICAgICAgICByZXR1cm4gY29kZWMucHJvcHM7XG4gICAgICAgIGNhc2UgJ0ludGVyc2VjdGlvblR5cGUnOlxuICAgICAgICAgICAgcmV0dXJuIGNvZGVjLnR5cGVzLnJlZHVjZShmdW5jdGlvbiAocHJvcHMsIHR5cGUpIHsgcmV0dXJuIE9iamVjdC5hc3NpZ24ocHJvcHMsIGdldFByb3BzKHR5cGUpKTsgfSwge30pO1xuICAgIH1cbn07XG52YXIgc3RyaXBLZXlzID0gZnVuY3Rpb24gKG8sIHByb3BzKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKTtcbiAgICB2YXIgc2hvdWxkU3RyaXAgPSBmYWxzZTtcbiAgICB2YXIgciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3BzLCBrZXkpKSB7XG4gICAgICAgICAgICBzaG91bGRTdHJpcCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByW2tleV0gPSBvW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNob3VsZFN0cmlwID8gciA6IG87XG59O1xudmFyIGdldEV4YWN0VHlwZU5hbWUgPSBmdW5jdGlvbiAoY29kZWMpIHtcbiAgICBpZiAoaXNUeXBlQyhjb2RlYykpIHtcbiAgICAgICAgcmV0dXJuIFwie3wgXCIgKyBnZXROYW1lRnJvbVByb3BzKGNvZGVjLnByb3BzKSArIFwiIHx9XCI7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUGFydGlhbEMoY29kZWMpKSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJ0aWFsVHlwZU5hbWUoXCJ7fCBcIiArIGdldE5hbWVGcm9tUHJvcHMoY29kZWMucHJvcHMpICsgXCIgfH1cIik7XG4gICAgfVxuICAgIHJldHVybiBcIkV4YWN0PFwiICsgY29kZWMubmFtZSArIFwiPlwiO1xufTtcbi8qKlxuICogU3RyaXBzIGFkZGl0aW9uYWwgcHJvcGVydGllc1xuICogQHNpbmNlIDEuMS4wXG4gKi9cbmV4cG9ydHMuZXhhY3QgPSBmdW5jdGlvbiAoY29kZWMsIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBnZXRFeGFjdFR5cGVOYW1lKGNvZGVjKTsgfVxuICAgIHZhciBwcm9wcyA9IGdldFByb3BzKGNvZGVjKTtcbiAgICByZXR1cm4gbmV3IEV4YWN0VHlwZShuYW1lLCBjb2RlYy5pcywgZnVuY3Rpb24gKHUsIGMpIHtcbiAgICAgICAgdmFyIGUgPSBleHBvcnRzLlVua25vd25SZWNvcmQudmFsaWRhdGUodSwgYyk7XG4gICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQoZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjZSA9IGNvZGVjLnZhbGlkYXRlKHUsIGMpO1xuICAgICAgICBpZiAoRWl0aGVyXzEuaXNMZWZ0KGNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBFaXRoZXJfMS5yaWdodChzdHJpcEtleXMoY2UucmlnaHQsIHByb3BzKSk7XG4gICAgfSwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGNvZGVjLmVuY29kZShzdHJpcEtleXMoYSwgcHJvcHMpKTsgfSwgY29kZWMpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0cy5nZXRWYWxpZGF0aW9uRXJyb3IgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gPSBmdW5jdGlvbiAodmFsdWUsIGNvbnRleHQpIHsgcmV0dXJuICh7XG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGNvbnRleHQ6IGNvbnRleHRcbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVwcmVjYXRlZFxuICogQHNpbmNlIDEuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnRzLmdldERlZmF1bHRDb250ZXh0IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovID0gZnVuY3Rpb24gKGRlY29kZXIpIHsgcmV0dXJuIFtcbiAgICB7IGtleTogJycsIHR5cGU6IGRlY29kZXIgfVxuXTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xudmFyIE5ldmVyVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTmV2ZXJUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE5ldmVyVHlwZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ25ldmVyJywgZnVuY3Rpb24gKF8pIHsgcmV0dXJuIGZhbHNlOyB9LCBmdW5jdGlvbiAodSwgYykgeyByZXR1cm4gZXhwb3J0cy5mYWlsdXJlKHUsIGMpOyB9LCBcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZW5jb2RlIG5ldmVyJyk7XG4gICAgICAgIH0pIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnTmV2ZXJUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gTmV2ZXJUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLk5ldmVyVHlwZSA9IE5ldmVyVHlwZTtcbi8qKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuZXhwb3J0cy5uZXZlciA9IG5ldyBOZXZlclR5cGUoKTtcbi8qKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xudmFyIEFueVR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFueVR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQW55VHlwZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ2FueScsIGZ1bmN0aW9uIChfKSB7IHJldHVybiB0cnVlOyB9LCBleHBvcnRzLnN1Y2Nlc3MsIGV4cG9ydHMuaWRlbnRpdHkpIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnQW55VHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEFueVR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuQW55VHlwZSA9IEFueVR5cGU7XG4vKipcbiAqIFVzZSBgdW5rbm93bmAgaW5zdGVhZFxuICpcbiAqIEBjYXRlZ29yeSBkZXByZWNhdGVkXG4gKiBAc2luY2UgMS4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbmV4cG9ydHMuYW55ID0gbmV3IEFueVR5cGUoKTtcbi8qKlxuICogVXNlIGBVbmtub3duUmVjb3JkYCBpbnN0ZWFkXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0cy5EaWN0aW9uYXJ5ID0gZXhwb3J0cy5Vbmtub3duUmVjb3JkO1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVwcmVjYXRlZFxuICogQHNpbmNlIDEuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG52YXIgT2JqZWN0VHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoT2JqZWN0VHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBPYmplY3RUeXBlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnb2JqZWN0JywgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHUgIT09IG51bGwgJiYgdHlwZW9mIHUgPT09ICdvYmplY3QnOyB9LCBmdW5jdGlvbiAodSwgYykgeyByZXR1cm4gKF90aGlzLmlzKHUpID8gZXhwb3J0cy5zdWNjZXNzKHUpIDogZXhwb3J0cy5mYWlsdXJlKHUsIGMpKTsgfSwgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdPYmplY3RUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0VHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5PYmplY3RUeXBlID0gT2JqZWN0VHlwZTtcbi8qKlxuICogVXNlIGBVbmtub3duUmVjb3JkYCBpbnN0ZWFkXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuZXhwb3J0cy5vYmplY3QgPSBuZXcgT2JqZWN0VHlwZSgpO1xuLyoqXG4gKiBVc2UgYGJyYW5kYCBpbnN0ZWFkXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZnVuY3Rpb24gcmVmaW5lbWVudChjb2RlYywgcHJlZGljYXRlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gXCIoXCIgKyBjb2RlYy5uYW1lICsgXCIgfCBcIiArIGV4cG9ydHMuZ2V0RnVuY3Rpb25OYW1lKHByZWRpY2F0ZSkgKyBcIilcIjsgfVxuICAgIHJldHVybiBuZXcgUmVmaW5lbWVudFR5cGUobmFtZSwgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIGNvZGVjLmlzKHUpICYmIHByZWRpY2F0ZSh1KTsgfSwgZnVuY3Rpb24gKGksIGMpIHtcbiAgICAgICAgdmFyIGUgPSBjb2RlYy52YWxpZGF0ZShpLCBjKTtcbiAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGEgPSBlLnJpZ2h0O1xuICAgICAgICByZXR1cm4gcHJlZGljYXRlKGEpID8gZXhwb3J0cy5zdWNjZXNzKGEpIDogZXhwb3J0cy5mYWlsdXJlKGEsIGMpO1xuICAgIH0sIGNvZGVjLmVuY29kZSwgY29kZWMsIHByZWRpY2F0ZSk7XG59XG5leHBvcnRzLnJlZmluZW1lbnQgPSByZWZpbmVtZW50O1xuLyoqXG4gKiBVc2UgYEludGAgaW5zdGVhZFxuICpcbiAqIEBjYXRlZ29yeSBkZXByZWNhdGVkXG4gKiBAc2luY2UgMS4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbmV4cG9ydHMuSW50ZWdlciA9IHJlZmluZW1lbnQoZXhwb3J0cy5udW1iZXIsIE51bWJlci5pc0ludGVnZXIsICdJbnRlZ2VyJyk7XG4vKipcbiAqIFVzZSBgcmVjb3JkYCBpbnN0ZWFkXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0cy5kaWN0aW9uYXJ5ID0gcmVjb3JkO1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVwcmVjYXRlZFxuICogQHNpbmNlIDEuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG52YXIgU3RyaWN0VHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3RyaWN0VHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdHJpY3RUeXBlKG5hbWUsIFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbiAgICBpcywgXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuICAgIHZhbGlkYXRlLCBcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRlcHJlY2F0aW9uXG4gICAgZW5jb2RlLCBwcm9wcykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdTdHJpY3RUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gU3RyaWN0VHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5TdHJpY3RUeXBlID0gU3RyaWN0VHlwZTtcbi8qKlxuICogRHJvcHMgdGhlIGNvZGVjIFwia2luZFwiXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjEuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZnVuY3Rpb24gY2xlYW4oY29kZWMpIHtcbiAgICByZXR1cm4gY29kZWM7XG59XG5leHBvcnRzLmNsZWFuID0gY2xlYW47XG5mdW5jdGlvbiBhbGlhcyhjb2RlYykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBjb2RlYzsgfTtcbn1cbmV4cG9ydHMuYWxpYXMgPSBhbGlhcztcbnZhciBpc05vbkVtcHR5ID0gZnVuY3Rpb24gKGFzKSB7IHJldHVybiBhcy5sZW5ndGggPiAwOyB9O1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0cy5lbXB0eVRhZ3MgPSB7fTtcbmZ1bmN0aW9uIGludGVyc2VjdChhLCBiKSB7XG4gICAgdmFyIHIgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDAsIGFfMSA9IGE7IF9pIDwgYV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgdiA9IGFfMVtfaV07XG4gICAgICAgIGlmIChiLmluZGV4T2YodikgIT09IC0xKSB7XG4gICAgICAgICAgICByLnB1c2godik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHI7XG59XG5mdW5jdGlvbiBtZXJnZVRhZ3MoYSwgYikge1xuICAgIGlmIChhID09PSBleHBvcnRzLmVtcHR5VGFncykge1xuICAgICAgICByZXR1cm4gYjtcbiAgICB9XG4gICAgaWYgKGIgPT09IGV4cG9ydHMuZW1wdHlUYWdzKSB7XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICB2YXIgciA9IE9iamVjdC5hc3NpZ24oe30sIGEpO1xuICAgIGZvciAodmFyIGsgaW4gYikge1xuICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgdmFyIGludGVyc2VjdGlvbl8xID0gaW50ZXJzZWN0KGFba10sIGJba10pO1xuICAgICAgICAgICAgaWYgKGlzTm9uRW1wdHkoaW50ZXJzZWN0aW9uXzEpKSB7XG4gICAgICAgICAgICAgICAgcltrXSA9IGludGVyc2VjdGlvbl8xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgciA9IGV4cG9ydHMuZW1wdHlUYWdzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcltrXSA9IGJba107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHI7XG59XG5mdW5jdGlvbiBpbnRlcnNlY3RUYWdzKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gZXhwb3J0cy5lbXB0eVRhZ3MgfHwgYiA9PT0gZXhwb3J0cy5lbXB0eVRhZ3MpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuZW1wdHlUYWdzO1xuICAgIH1cbiAgICB2YXIgciA9IGV4cG9ydHMuZW1wdHlUYWdzO1xuICAgIGZvciAodmFyIGsgaW4gYSkge1xuICAgICAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgdmFyIGludGVyc2VjdGlvbl8yID0gaW50ZXJzZWN0KGFba10sIGJba10pO1xuICAgICAgICAgICAgaWYgKGludGVyc2VjdGlvbl8yLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChyID09PSBleHBvcnRzLmVtcHR5VGFncykge1xuICAgICAgICAgICAgICAgICAgICByID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJba10gPSBhW2tdLmNvbmNhdChiW2tdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcjtcbn1cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbmZ1bmN0aW9uIGlzQW55Qyhjb2RlYykge1xuICAgIHJldHVybiBjb2RlYy5fdGFnID09PSAnQW55VHlwZSc7XG59XG5mdW5jdGlvbiBpc0xpdGVyYWxDKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdMaXRlcmFsVHlwZSc7XG59XG5mdW5jdGlvbiBpc0tleW9mQyhjb2RlYykge1xuICAgIHJldHVybiBjb2RlYy5fdGFnID09PSAnS2V5b2ZUeXBlJztcbn1cbmZ1bmN0aW9uIGlzVHlwZUMoY29kZWMpIHtcbiAgICByZXR1cm4gY29kZWMuX3RhZyA9PT0gJ0ludGVyZmFjZVR5cGUnO1xufVxuZnVuY3Rpb24gaXNQYXJ0aWFsQyhjb2RlYykge1xuICAgIHJldHVybiBjb2RlYy5fdGFnID09PSAnUGFydGlhbFR5cGUnO1xufVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuZnVuY3Rpb24gaXNTdHJpY3RDKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdTdHJpY3RUeXBlJztcbn1cbmZ1bmN0aW9uIGlzRXhhY3RDKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdFeGFjdFR5cGUnO1xufVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuZnVuY3Rpb24gaXNSZWZpbmVtZW50Qyhjb2RlYykge1xuICAgIHJldHVybiBjb2RlYy5fdGFnID09PSAnUmVmaW5lbWVudFR5cGUnO1xufVxuZnVuY3Rpb24gaXNJbnRlcnNlY3Rpb25DKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdJbnRlcnNlY3Rpb25UeXBlJztcbn1cbmZ1bmN0aW9uIGlzVW5pb25DKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdVbmlvblR5cGUnO1xufVxuZnVuY3Rpb24gaXNSZWN1cnNpdmVDKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdSZWN1cnNpdmVUeXBlJztcbn1cbnZhciBsYXp5Q29kZWNzID0gW107XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiBnZXRUYWdzKGNvZGVjKSB7XG4gICAgaWYgKGxhenlDb2RlY3MuaW5kZXhPZihjb2RlYykgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLmVtcHR5VGFncztcbiAgICB9XG4gICAgaWYgKGlzVHlwZUMoY29kZWMpIHx8IGlzU3RyaWN0Qyhjb2RlYykpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gZXhwb3J0cy5lbXB0eVRhZ3M7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZm9yaW5cbiAgICAgICAgZm9yICh2YXIgayBpbiBjb2RlYy5wcm9wcykge1xuICAgICAgICAgICAgdmFyIHByb3AgPSBjb2RlYy5wcm9wc1trXTtcbiAgICAgICAgICAgIGlmIChpc0xpdGVyYWxDKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSBleHBvcnRzLmVtcHR5VGFncykge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmRleFtrXSA9IFtwcm9wLnZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzRXhhY3RDKGNvZGVjKSB8fCBpc1JlZmluZW1lbnRDKGNvZGVjKSkge1xuICAgICAgICByZXR1cm4gZ2V0VGFncyhjb2RlYy50eXBlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNJbnRlcnNlY3Rpb25DKGNvZGVjKSkge1xuICAgICAgICByZXR1cm4gY29kZWMudHlwZXMucmVkdWNlKGZ1bmN0aW9uICh0YWdzLCBjb2RlYykgeyByZXR1cm4gbWVyZ2VUYWdzKHRhZ3MsIGdldFRhZ3MoY29kZWMpKTsgfSwgZXhwb3J0cy5lbXB0eVRhZ3MpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1VuaW9uQyhjb2RlYykpIHtcbiAgICAgICAgcmV0dXJuIGNvZGVjLnR5cGVzLnNsaWNlKDEpLnJlZHVjZShmdW5jdGlvbiAodGFncywgY29kZWMpIHsgcmV0dXJuIGludGVyc2VjdFRhZ3ModGFncywgZ2V0VGFncyhjb2RlYykpOyB9LCBnZXRUYWdzKGNvZGVjLnR5cGVzWzBdKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUmVjdXJzaXZlQyhjb2RlYykpIHtcbiAgICAgICAgbGF6eUNvZGVjcy5wdXNoKGNvZGVjKTtcbiAgICAgICAgdmFyIHRhZ3MgPSBnZXRUYWdzKGNvZGVjLnR5cGUpO1xuICAgICAgICBsYXp5Q29kZWNzLnBvcCgpO1xuICAgICAgICByZXR1cm4gdGFncztcbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuZW1wdHlUYWdzO1xufVxuZXhwb3J0cy5nZXRUYWdzID0gZ2V0VGFncztcbi8qKlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIGdldEluZGV4KGNvZGVjcykge1xuICAgIHZhciB0YWdzID0gZ2V0VGFncyhjb2RlY3NbMF0pO1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGFncyk7XG4gICAgdmFyIGxlbiA9IGNvZGVjcy5sZW5ndGg7XG4gICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoaykge1xuICAgICAgICB2YXIgYWxsID0gdGFnc1trXS5zbGljZSgpO1xuICAgICAgICB2YXIgaW5kZXggPSBbdGFnc1trXV07XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb2RlYyA9IGNvZGVjc1tpXTtcbiAgICAgICAgICAgIHZhciBjdGFncyA9IGdldFRhZ3MoY29kZWMpO1xuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IGN0YWdzW2tdO1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBzdHJpY3QtdHlwZS1wcmVkaWNhdGVzXG4gICAgICAgICAgICBpZiAodmFsdWVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZS1rZXlzXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzLnNvbWUoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIGFsbC5pbmRleE9mKHYpICE9PSAtMTsgfSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWUta2V5c1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsLnB1c2guYXBwbHkoYWxsLCB2YWx1ZXMpO1xuICAgICAgICAgICAgICAgICAgICBpbmRleC5wdXNoKHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHZhbHVlOiBbaywgaW5kZXhdIH07XG4gICAgfTtcbiAgICBrZXlzOiBmb3IgKHZhciBfaSA9IDAsIGtleXNfMSA9IGtleXM7IF9pIDwga2V5c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgayA9IGtleXNfMVtfaV07XG4gICAgICAgIHZhciBzdGF0ZV8xID0gX2xvb3BfMShrKTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdGF0ZV8xID09PSBcIm9iamVjdFwiKVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlXzEudmFsdWU7XG4gICAgICAgIHN3aXRjaCAoc3RhdGVfMSkge1xuICAgICAgICAgICAgY2FzZSBcImNvbnRpbnVlLWtleXNcIjogY29udGludWUga2V5cztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuZXhwb3J0cy5nZXRJbmRleCA9IGdldEluZGV4O1xuIiwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgImltcG9ydCB0eXBlIHtOdmltUGx1Z2lufSBmcm9tICduZW92aW0nXG5pbXBvcnQge0F1dG9jbWRPcHRpb25zLCBDb21tYW5kT3B0aW9ucywgTnZpbUZ1bmN0aW9uT3B0aW9uc30gZnJvbSAnbmVvdmltL2xpYi9ob3N0L052aW1QbHVnaW4nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCdcbmltcG9ydCAqIGFzIHByb2pldCBmcm9tICcuLi9wcm9qZXQnXG5cbmNvbnN0IHBsdWdpbk9wdGlvbnMgPSB7XG4gIGRldjogRU5WID09PSAnZGV2JyxcbiAgYWx3YXlzSW5pdDogRU5WID09PSAnZGV2Jyxcbn1cblxuZXhwb3J0ID0gKHBsdWdpbjogTnZpbVBsdWdpbikgPT4ge1xuICBjb25zdCBhcGkgPSBwbHVnaW4ubnZpbVxuICBjb25zdCBjbWQgPSBhcGkuY29tbWFuZC5iaW5kKGFwaSlcblxuICBwbHVnaW4uc2V0T3B0aW9ucyhwbHVnaW5PcHRpb25zKVxuXG4gIC8qXG4gICAqIExvZ2dlcnMgdXNlIHdpbnN0b24sIGFuZCBhcmUgY29uZmlndXJlZCB0byB3cml0ZSB0byBOVklNX05PREVfTE9HX0ZJTEVcbiAgICovXG4gIGNvbnN0IGxvZ2dlciA9IHBsdWdpbi5udmltLmxvZ2dlclxuICBjb25zdCBkZWJ1ZyA9IGxvZ2dlci5kZWJ1Zy5iaW5kKGxvZ2dlcilcbiAgY29uc3QgaW5mbyA9IGxvZ2dlci5pbmZvLmJpbmQobG9nZ2VyKVxuICBjb25zdCBlcnJvciA9IGxvZ2dlci5lcnJvci5iaW5kKGxvZ2dlcilcbiAgY29uc3Qgd2FybiA9IGxvZ2dlci53YXJuLmJpbmQobG9nZ2VyKVxuXG4gIGNvbnN0IGR1bXAgPSAoeDogYW55KSA9PiBlY2hvbXNnKHV0aWwuaW5zcGVjdCh4LCBmYWxzZSwgbnVsbCkpXG5cbiAgY29uc3QgZWNob2VyciA9ICguLi5tc2c6IHN0cmluZ1tdKSA9PiBhcGkuZXJyV3JpdGVMaW5lKG1zZy5qb2luKCcgJykpXG5cbiAgY29uc3QgZWNob21zZyA9ICguLi5tc2c6IHN0cmluZ1tdKSA9PiBhcGkub3V0V3JpdGVMaW5lKG1zZy5qb2luKCcgJykpXG5cbiAgY29uc3QgY2F0Y2hFcnJvcnMgPSAoZm46IEZ1bmN0aW9uKSA9PlxuICAgIGFzeW5jICguLi5hcmdzOiBhbnkpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBmbiguLi5hcmdzKVxuICAgICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgICBpZiAodHlwZW9mIGUgPT09ICdzdHJpbmcnKVxuICAgICAgICAgIHJldHVybiBlY2hvZXJyKGUpXG4gICAgICAgIC8vIGVsc2UgaWYgKGU/Lm1lc3NhZ2UpXG4gICAgICAgIC8vICAgcmV0dXJuIGVjaG9lcnIoZS5tZXNzYWdlKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGVjaG9lcnIodXRpbC5pbnNwZWN0KGUsIDEpKVxuICAgICAgfVxuICAgIH1cblxuICBmdW5jdGlvbiBkZWZDbWQobmFtZTogc3RyaW5nLCBmbjogRnVuY3Rpb24sIG9wdHM6IENvbW1hbmRPcHRpb25zIHwgdW5kZWZpbmVkKSB7XG4gICAgY29uc3Qgd3JhcHBlZEZ1bmN0aW9uID0gY2F0Y2hFcnJvcnMoZm4pXG4gICAgcmV0dXJuIHBsdWdpbi5yZWdpc3RlckNvbW1hbmQobmFtZSwgd3JhcHBlZEZ1bmN0aW9uLCBvcHRzKVxuICB9XG5cbiAgZnVuY3Rpb24gZGVmRm4obmFtZTogc3RyaW5nLCBmbjogRnVuY3Rpb24sIG9wdHM6IE52aW1GdW5jdGlvbk9wdGlvbnMgfCB1bmRlZmluZWQpIHtcbiAgICBjb25zdCB3cmFwcGVkRnVuY3Rpb24gPSBjYXRjaEVycm9ycyhmbilcbiAgICByZXR1cm4gcGx1Z2luLnJlZ2lzdGVyRnVuY3Rpb24obmFtZSwgd3JhcHBlZEZ1bmN0aW9uLCBvcHRzKVxuICB9XG5cbiAgZnVuY3Rpb24gZGVmQXV0b2NtZChuYW1lOiBzdHJpbmcsIGZuOiBGdW5jdGlvbiwgb3B0czogQXV0b2NtZE9wdGlvbnMpIHtcbiAgICBjb25zdCB3cmFwcGVkRnVuY3Rpb24gPSBjYXRjaEVycm9ycyhmbilcbiAgICByZXR1cm4gcGx1Z2luLnJlZ2lzdGVyQXV0b2NtZChuYW1lLCB3cmFwcGVkRnVuY3Rpb24sIG9wdHMpXG4gIH1cblxuICAvKlxuICAgKiBDb21tYW5kc1xuICAgKi9cblxuICAvKipcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqL1xuICBkZWZDbWQoJ1Byb2pldExpbmsnLCBhc3luYyAoW2xpbmtOYW1lXTogc3RyaW5nW10pID0+IHtcbiAgICBjb25zdCBmaWxlID0gYXdhaXQgYXBpLmJ1ZmZlci5uYW1lXG4gICAgY29uc3QgY29uZmlnID0gYXdhaXQgcHJvamV0LmdldENvbmZpZyhmaWxlKVxuICAgIGxldCBsaW5rRmlsZSA9IHByb2pldC5hc3NvYyhjb25maWcsIGZpbGUsIGxpbmtOYW1lKVxuICAgIGNvbnN0IGN3ZCA9IGF3YWl0IGFwaS5jYWxsKCdnZXRjd2QnKVxuICAgIGxpbmtGaWxlID0gcGF0aC5yZWxhdGl2ZShjd2QsIGxpbmtGaWxlKVxuXG4gICAgYXdhaXQgY21kKGBlZGl0ICR7bGlua0ZpbGV9YClcbiAgfSwge1xuICAgIHN5bmM6IGZhbHNlLFxuICAgIG5hcmdzOiAnPycsXG4gICAgY29tcGxldGU6ICdjdXN0b20sUHJvamV0TGlua0NvbXBsZXRlJyxcbiAgfSlcblxuICAvKipcbiAgICogQHNpbmNlIDAuMi4wXG4gICAqL1xuICBkZWZDbWQoJ0NkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGJuYW1lID0gYXdhaXQgYXBpLmJ1ZmZlci5uYW1lXG4gICAgY29uc3QgY29uZmlnRmlsZSA9IGF3YWl0IHByb2pldC5maW5kQ29uZmlnKGJuYW1lKVxuICAgIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShjb25maWdGaWxlKVxuICAgIGF3YWl0IGNtZChgY2QgJHtkaXJ9YClcbiAgfSwgeyBzeW5jOiBmYWxzZSB9KVxuXG4gIC8qKlxuICAgKiBAc2luY2UgMC4yLjBcbiAgICovXG4gIGRlZkNtZCgnTGNkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGJuYW1lID0gYXdhaXQgYXBpLmJ1ZmZlci5uYW1lXG4gICAgY29uc3QgY29uZmlnRmlsZSA9IGF3YWl0IHByb2pldC5maW5kQ29uZmlnKGJuYW1lKVxuICAgIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShjb25maWdGaWxlKVxuICAgIGF3YWl0IGNtZChgbGNkICR7ZGlyfWApXG4gIH0sIHsgc3luYzogZmFsc2UgfSlcblxuICAvKipcbiAgICogQHNpbmNlIDAuMi4wXG4gICAqL1xuICBkZWZDbWQoJ1RjZCcsIFxuICAgIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBibmFtZSA9IGF3YWl0IGFwaS5idWZmZXIubmFtZVxuICAgIGNvbnN0IGNvbmZpZ0ZpbGUgPSBhd2FpdCBwcm9qZXQuZmluZENvbmZpZyhibmFtZSlcbiAgICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoY29uZmlnRmlsZSlcbiAgICBhd2FpdCBjbWQoYHRjZCAke2Rpcn1gKVxuICB9LCB7IHN5bmM6IGZhbHNlIH0pXG5cbiAgLyoqXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKi9cbiAgZGVmQ21kKCdQcm9qZXRDb25maWcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYm5hbWUgPSBhd2FpdCBhcGkuYnVmZmVyLm5hbWVcbiAgICBjb25zdCBjb25maWdGaWxlID0gYXdhaXQgcHJvamV0LmZpbmRDb25maWcoYm5hbWUpXG4gICAgYXdhaXQgY21kKGBlZGl0ICR7Y29uZmlnRmlsZX1gKVxuICB9LCB7IHN5bmM6IGZhbHNlIH0pXG5cbiAgLypcbiAgICogRnVuY3Rpb25zXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAc2luY2UgMC4xLjBcbiAgICovXG4gIGRlZkZuKCdQcm9qZXRMaW5rQ29tcGxldGUnLCBhc3luYyAoX2FyZ0xlYWQ6IHN0cmluZywgX2NtZExpbmU6IHN0cmluZywgX2N1cnNvclBvczogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGF3YWl0IGFwaS5idWZmZXIubmFtZVxuICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHByb2pldC5nZXRDb25maWcoZmlsZSlcbiAgICBjb25zdCBtYXRjaCA9IHByb2pldC5maW5kTWF0Y2goY29uZmlnLCBmaWxlKVxuICAgIGNvbnN0IGtleXMgPSBtYXRjaD8ucnVsZT8ubGlua3M/Lm1hcCh4ID0+IHgubmFtZSkgPz8gW11cbiAgICByZXR1cm4ga2V5cy5qb2luKCdcXG4nKVxuICB9LCB7IHN5bmM6IHRydWUgfSlcblxuICAvKipcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqL1xuICBkZWZGbignUHJvamV0R2V0Q29uZmlnJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBhcGkuYnVmZmVyLm5hbWVcbiAgICByZXR1cm4gYXdhaXQgcHJvamV0LmdldENvbmZpZyhmaWxlKVxuICB9LCB7IHN5bmM6IHRydWUgfSlcblxuICAvKipcbiAgICogQHNpbmNlIDAuMi4wXG4gICAqL1xuICBkZWZGbignUHJvamV0UmVuZGVyVGVtcGxhdGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGF3YWl0IGFwaS5idWZmZXIubmFtZVxuICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHByb2pldC5nZXRDb25maWcoZmlsZSlcbiAgICByZXR1cm4gcHJvamV0LnRlbXBsYXRlKGNvbmZpZywgZmlsZSlcbiAgfSwgeyBzeW5jOiB0cnVlIH0pXG5cbiAgLyoqXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKi9cbiAgZGVmRm4oJ1Byb2pldEdldE1hdGNoQ29uZmlnJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBhcGkuYnVmZmVyLm5hbWVcbiAgICBjb25zdCBjb25maWcgPSBhd2FpdCBwcm9qZXQuZ2V0Q29uZmlnKGZpbGUpXG4gICAgY29uc3QgbWF0Y2ggPSBwcm9qZXQuZmluZE1hdGNoKGNvbmZpZywgZmlsZSlcblxuICAgIGlmICghbWF0Y2gpIHRocm93IGBObyBtYXRjaGVzIGZvciAke2ZpbGV9YFxuXG4gICAgcmV0dXJuIG1hdGNoXG4gIH0sIHsgc3luYzogdHJ1ZSB9KVxuXG4gIC8qXG4gICAqIEF1dG9jb21tYW5kc1xuICAgKi9cblxuICAvKipcbiAgICogQHNpbmNlIDAuMi4wXG4gICAqL1xuICBkZWZBdXRvY21kKCdCdWZOZXdGaWxlJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEFwcGx5IHRlbXBsYXRlXG4gICAgY29uc3QgZmlsZSA9IGF3YWl0IGFwaS5idWZmZXIubmFtZVxuICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHByb2pldC5nZXRDb25maWcoZmlsZSlcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHByb2pldC50ZW1wbGF0ZShjb25maWcsIGZpbGUpXG4gICAgY29uc3QgbGluZXMgPSB0ZW1wbGF0ZS5zcGxpdCgnXFxuJylcbiAgICBhd2FpdCBhcGkuYnVmZmVyLnNldExpbmVzKGxpbmVzLCB7IHN0YXJ0OiAwLCBlbmQ6IC0xIH0pXG4gIH0sIHtcbiAgICBwYXR0ZXJuOiAnKicsXG4gICAgc3luYzogZmFsc2UsXG4gIH0pXG59XG4iLCAiaW1wb3J0ICogYXMgdG9tbCBmcm9tICdAaWFybmEvdG9tbCdcbmltcG9ydCB7IGlzTGVmdCB9IGZyb20gJ2ZwLXRzL2xpYi9FaXRoZXInXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcydcbmltcG9ydCB7IHByb21pc2VzIGFzIGZzeCB9IGZyb20gJ2ZzJ1xuaW1wb3J0ICogYXMgbWF0Y2ggZnJvbSAnbWljcm9tYXRjaCdcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IENvbmZpZywgUnVsZSB9IGZyb20gJy4vY29uZmlnJ1xuaW1wb3J0IHsgYnVpbGRTY29wZSwgcmVuZGVyIH0gZnJvbSAnLi90ZW1wbGF0ZSdcblxuZXhwb3J0IHR5cGUgeyBDb25maWcsIFJ1bGUgfVxuXG5pbnRlcmZhY2UgQ29uZmlnSW5zdGFuY2Uge1xuICBwYXRoOiBzdHJpbmdcbiAgY29uZmlnOiBDb25maWdcbn1cblxuLypcbiAqIEJhc2ljIHByZW1pc2Ugb2Ygd2hhdCBJIHdhbnQgdjEgdG8gYmVcbiAqXG4gKiBMb2FkIGEgY29uZmlnIGZpbGUsIHByb2JhYmx5IHRvbWwgLSBzcGVjaWFsIGZhbGxiYWNrcyBjYW4gY29tZSBsYXRlcixcbiAqIGFzc3VtZSBzYW1lIGRpcmVjdG9yeSBmb3Igbm93LiBoYW5kIGF0IGxlYXN0IHdoYXQgcHJvamVjdGlvbnMgY2FuIGRvXG4gKlxuICogQWRkIGJhc2ljIENMSSBpbnRlcmZhY2UsIHdpbGwgaGF2ZSB0byBmaW5kIGEgbGlicmFyeSBmb3IgdGhpcywgaSd2ZSB1c2VkXG4gKiB5YXJncyBiZWZvcmUgYW5kIGxpa2VkIGl0LlxuICpcbiAqIEZvciBhbnkgZ2l2ZW4gZmlsZSBwYXRoXG4gKiAtIGZpbmQgaXRzIG1hdGNoIGluIHRoZSBjb25maWdcbiAqIC0gcmV0dXJuIGl0cyBhbHRlcm5hdGUgKGxhdGVyIGFueSBvdGhlciBhcmJpdHJhcnkgcmVsYXRpb25zaGlwKVxuICogLSByZXR1cm4gYSB0ZW1wbGF0ZSBmb3IgaXRcbiAqIC0gcmV0dXJuIHNvbWUgb3RoZXIgS1YgZm9yIGl0XG4gKlxuICogTGF0ZXIgSSBjYW4gZ2VuZXJhdGUgYSBncmFwaCBiYXNlZCBvbiB0aGUgcmVsYXRpb25zaGlwcywgYnV0IGZvciBub3dcbiAqIGZvY3VzIG9uIGRvaW5nIHdoYXQgcHJvamVjdGlvbmlzdCBjYW4gZG8uXG4gKlxuICpcbiAqIEZvciB0ZW1wbGF0aW5nLCBpZiBwb3NzaWJsZSByZXVzZSB0aGUgc2FtZSAqIHtmb286YmFyfSBzeW50YXgsIG90aGVyd2lzZVxuICogZmluZCBzb21ldGhpbmcgdGhhdCBhbHJlYWR5IGV4aXN0cy4gSW1wbGVtZW50IGJhc2ljIHRyYW5zZm9ybXMuXG4gKlxuICovXG5cbi8qKlxuICogU2VhcmNoIHVwd2FyZHMgdW50aWwgdGhlIGNvbmZpZyBmaWxlIGlzIGZvdW5kLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluZENvbmZpZyhzdGFydGluZ0Rpcjogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgbGV0IGRpciA9IHN0YXJ0aW5nRGlyXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBsZXQgZmlsZW5hbWUgPSBwYXRoLmpvaW4oZGlyLCAnLnByb2pldC50b21sJylcblxuICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVuYW1lKSlcbiAgICAgIHJldHVybiBwYXRoLnJlc29sdmUoZmlsZW5hbWUpXG5cbiAgICBpZiAoZGlyID09PSAnLycpXG4gICAgICB0aHJvdyBcImNvdWxkbid0IGZpbmQgY29uZmlnIGZpbGVcIlxuXG4gICAgZGlyID0gcGF0aC5kaXJuYW1lKGRpcilcbiAgfVxufVxuXG4vKipcbiAqIExvYWQgdGhlIGNvbmZpZyBmcm9tIHRoZSB0aGUgcHJvdmlkZWQgcGF0aC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRDb25maWcobG9jYWxwYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgY29udGVudCA9IGF3YWl0IGZzeC5yZWFkRmlsZShsb2NhbHBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSlcbiAgY29uc3QganNvbiA9IHRvbWwucGFyc2UoY29udGVudClcbiAgY29uc3QgY29uZmlnID0gQ29uZmlnLmRlY29kZShqc29uKVxuXG4gIGlmIChpc0xlZnQoY29uZmlnKSlcbiAgICB0aHJvdyBjb25maWcubGVmdFxuICBlbHNlXG4gICAgcmV0dXJuIHsgcGF0aDogbG9jYWxwYXRoLCBjb25maWc6IGNvbmZpZy5yaWdodCB9XG59XG5cbi8qKlxuICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gZmluZCwgYW5kIGxvYWQgdGhlIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb25maWcoc3RhcnRpbmdEaXI6IHN0cmluZykge1xuICBjb25zdCBjb25maWdQYXRoID0gYXdhaXQgZmluZENvbmZpZyhzdGFydGluZ0RpcilcbiAgcmV0dXJuIGxvYWRDb25maWcoY29uZmlnUGF0aClcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBhIGZpbGUgdGhhdCBtYXRjaGVkIHRoZSBjb25maWcncyBwYXR0ZXJuLiBJbmNsdWRlcyB0aGVcbiAqIGNhdGVnb3J5LCB3aGljaCBpcyB3aGF0IGtpbmQgb2YgXCJ0eXBlXCIgb2YgZmlsZSB0aGlzIGlzLCB0aGUgY29uZmlnIGZvclxuICogdGhpcyBjYXRlZ29yeSwgYW5kIHRoZSBjYXB0dXJlcyBmcm9tIHRoZSBwYXR0ZXJuIGZvciByZXBsYWNlbWVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSdWxlTWF0Y2gge1xuICBjYXB0dXJlczogUmVnRXhwTWF0Y2hBcnJheVxuICBjYXRlZ29yeTogc3RyaW5nXG4gIHJ1bGU6IFJ1bGVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRNYXRjaChjb25maWc6IENvbmZpZ0luc3RhbmNlLCBmaWxlcGF0aDogc3RyaW5nKTogUnVsZU1hdGNoIHwgbnVsbCB7XG4gIGNvbnN0IHRvID0gcGF0aC5kaXJuYW1lKGNvbmZpZy5wYXRoKVxuICBjb25zdCBsb2NhbHBhdGggPSBwYXRoLnJlbGF0aXZlKHRvLCBmaWxlcGF0aClcblxuICBjb25zdCBydWxlcyA9IGNvbmZpZy5jb25maWcucnVsZXNcblxuICBmb3IgKGNvbnN0IHJ1bGUgb2YgcnVsZXMpIHtcbiAgICBjb25zdCBjYXRlZ29yeSA9IHJ1bGUubmFtZVxuICAgIGNvbnN0IHBhdHRlcm4gPSBydWxlLnBhdHRlcm5cbiAgICBjb25zdCBjYXB0dXJlcyA9IG1hdGNoLmNhcHR1cmUocGF0dGVybiwgbG9jYWxwYXRoKVxuXG4gICAgaWYgKGNhcHR1cmVzKVxuICAgICAgcmV0dXJuIHsgY2FwdHVyZXMsIGNhdGVnb3J5LCBydWxlIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbmFtZSBvZiB0aGUgZmlsZSBpbiByZWxhdGlvbiByZWxhdGlvbnNoaXAgYGFzc29jTmFtZWAgd2l0aCBmaWxlXG4gKiBhdCBgcGF0aGAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NvYyhjb25maWc6IENvbmZpZ0luc3RhbmNlLCBmaWxlOiBzdHJpbmcsIGxpbmtOYW1lPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgbWF0Y2ggPSBmaW5kTWF0Y2goY29uZmlnLCBmaWxlKVxuXG4gIGlmICghbWF0Y2gpIHRocm93IGBObyBtYXRjaGluZyBydWxlIGZvciAke2ZpbGV9YFxuXG4gIGNvbnN0IHJ1bGUgPSBtYXRjaC5ydWxlXG5cbiAgbGV0IGxpbmsgPSBmaW5kTGluayhydWxlLCBsaW5rTmFtZSlcblxuICBjb25zdCBwYXR0ZXJuID0gbGluay5wYXR0ZXJuXG5cbiAgY29uc3QgYmluZGluZyA9IHsgZmlsZSB9XG4gIGNvbnN0IHNjb3BlID0gYnVpbGRTY29wZShtYXRjaCwgYmluZGluZylcbiAgbGV0IGxvY2FscGF0aCA9IHJlbmRlcihwYXR0ZXJuLCBzY29wZSlcbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGNvbmZpZy5wYXRoKVxuICBsb2NhbHBhdGggPSBwYXRoLmpvaW4oZGlyLCBsb2NhbHBhdGgpXG5cbiAgcmV0dXJuIHBhdGgubm9ybWFsaXplKGxvY2FscGF0aClcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxpbmsgdGhhdCBtYXRjaGVzIHRoZSBuYW1lLCBvciByZXR1cm4gdGhlIGZpcnN0IGxpbmsgaWYgbm90XG4gKiBzcGVjaWZpZWRcbiAqL1xuZnVuY3Rpb24gZmluZExpbmsocnVsZTogUnVsZSwgbGlua05hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuICBjb25zdCBydWxlTmFtZSA9IHJ1bGUubmFtZVxuICBjb25zdCBsaW5rcyA9IHJ1bGUubGlua3MgPz8gW11cblxuICBpZiAoIWxpbmtOYW1lKSB7XG4gICAgY29uc3QgbGluayA9IGxpbmtzWzBdXG5cbiAgICBpZiAoIWxpbmspIHRocm93IGBObyBsaW5rcyBkZWZpbmVkIGZvciAke3J1bGVOYW1lfWBcblxuICAgIHJldHVybiBsaW5rXG4gIH1cblxuICBjb25zdCBsaW5rID0gbGlua3MuZmluZCgoeyBuYW1lIH0pID0+IG5hbWUgPT09IGxpbmtOYW1lKVxuXG4gIGlmICghbGluaykgdGhyb3cgYE5vIGxpbmsgbmFtZWQgJHtsaW5rTmFtZX0gZGVmaW5lZCBmb3IgJHtydWxlTmFtZX1gXG5cbiAgcmV0dXJuIGxpbmtcbn1cblxuLyoqXG4gKiBSZXR1cm4gbGlzdGluZyBhbGwgZmlsZXMgdGhhdCBtYXRjaCBkZWZpbmVkIGZpbGUgZ3JvdXBzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdChfY29uZmlnOiBDb25maWcpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXVxufVxuXG4vKipcbiAqIFJldHVybiBhIGdlbmVyYXRlZCB2ZXJzaW9uIG9mIGEgZmlsZSBhdCB0aGUgcGF0aCBgcGF0aGAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZShjb25maWc6IENvbmZpZ0luc3RhbmNlLCBmaWxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBtYXRjaCA9IGZpbmRNYXRjaChjb25maWcsIGZpbGUpXG5cbiAgaWYgKCFtYXRjaClcbiAgICB0aHJvdyBgbm8gbWF0Y2ggZm9yOiAke2ZpbGV9YFxuXG4gIGNvbnN0IHRlbXBsYXRlID0gbWF0Y2gucnVsZS50ZW1wbGF0ZVxuXG4gIGlmICghdGVtcGxhdGUpXG4gICAgdGhyb3cgbmV3IEVycm9yKGBObyB0ZW1wbGF0ZSBkZWZpbmVkIGZvciAke21hdGNoLmNhdGVnb3J5fWApXG5cbiAgY29uc3QgYmluZGluZyA9IHsgZmlsZSB9XG4gIGNvbnN0IHNjb3BlID0gYnVpbGRTY29wZShtYXRjaCwgYmluZGluZylcbiAgcmV0dXJuIHJlbmRlcih0ZW1wbGF0ZSwgc2NvcGUpXG59XG4iLCAiLyoqXG4gKiBKU09OIGRlY29kZXIgZm9yIC5wcm9qZXQudG9tbCBmaWxlc1xuICovXG5cbmltcG9ydCAqIGFzIHQgZnJvbSAnaW8tdHMnXG5cbmNvbnN0IExpbmsgPSB0LnR5cGUoe1xuICBuYW1lOiB0LnN0cmluZyxcbiAgcGF0dGVybjogdC5zdHJpbmcsXG59KVxuXG5jb25zdCBSdWxlID0gdC5pbnRlcnNlY3Rpb24oW1xuICB0LnR5cGUoe1xuICAgIG5hbWU6IHQuc3RyaW5nLFxuICAgIHBhdHRlcm46IHQuc3RyaW5nLFxuICB9KSxcbiAgdC5wYXJ0aWFsKHtcbiAgICB0ZW1wbGF0ZTogdC5zdHJpbmcsXG4gICAgbGlua3M6IHQuYXJyYXkoTGluayksXG4gIH0pLFxuXSlcblxuZXhwb3J0IGNvbnN0IENvbmZpZyA9IHQudHlwZSh7XG4gIHJ1bGVzOiB0LmFycmF5KFJ1bGUpLFxufSlcblxuZXhwb3J0IGludGVyZmFjZSBMaW5rIGV4dGVuZHMgdC5UeXBlT2Y8dHlwZW9mIExpbms+IHt9XG5leHBvcnQgaW50ZXJmYWNlIFJ1bGUgZXh0ZW5kcyB0LlR5cGVPZjx0eXBlb2YgUnVsZT4ge31cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgdC5UeXBlT2Y8dHlwZW9mIENvbmZpZz4ge31cbiIsICJpbXBvcnQgeyBJQ29tcGlsZU9wdGlvbnMsIFNjb3BlIH0gZnJvbSAnbWljcm9tdXN0YWNoZSdcbmltcG9ydCAqIGFzIG11c3RhY2hlIGZyb20gJ21pY3JvbXVzdGFjaGUnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBSdWxlTWF0Y2ggfSBmcm9tICcuL3Byb2pldCdcbmltcG9ydCB7IGlzVHJhbnNmb3JtZXIsIHRyYW5zZm9ybXMgfSBmcm9tICcuL3RyYW5zZm9ybXMnXG5cbmNvbnN0IGJyID0gJ1xcbidcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2NvcGUobWF0Y2g6IFJ1bGVNYXRjaCwgYmluZGluZ3M6IHt9KSB7XG4gIGNvbnN0IGVudHJpZXMgPSBtYXRjaC5jYXB0dXJlcy5tYXAoKHZhbHVlLCBpZHgpID0+IFtgJCR7aWR4fWAsIHZhbHVlXSlcbiAgY29uc3Qgc3RhciA9IHBhdGguam9pbiguLi5tYXRjaC5jYXB0dXJlcylcblxuICBjb25zdCBjYXB0dXJlcyA9IE9iamVjdC5mcm9tRW50cmllcyhlbnRyaWVzKVxuICBjb25zdCBzY29wZSA9IE9iamVjdC5hc3NpZ24oYmluZGluZ3MsIGNhcHR1cmVzKVxuICBzY29wZVsnJConXSA9IHN0YXJcbiAgcmV0dXJuIHNjb3BlXG59XG5cbmZ1bmN0aW9uIGdldChzY29wZTogU2NvcGUsIHBhdGhFeHByOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICByZXR1cm4gbXVzdGFjaGUuZ2V0KHNjb3BlLCBwYXRoRXhwciwgeyBwcm9wc0V4aXN0OiB0cnVlIH0pXG59XG5cbmNsYXNzIFRyYW5zZm9ybU5hbWVFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IodHJhbnNmb3JtOiBzdHJpbmcpIHtcbiAgICBzdXBlcihcbiAgICAgIGBUcmFuc2Zvcm1OYW1lRXJyb3I6IFwiJHt0cmFuc2Zvcm19XCIgaXMgbm90IGEga25vd24gdHJhbnNmb3JtLmBcbiAgICAgICAgKyBiclxuICAgICAgICArICdBdmFpbGFibGUgdHJhbnNmb3JtczogJ1xuICAgICAgICArIE9iamVjdC5rZXlzKHRyYW5zZm9ybXMpLmpvaW4oJywgJyksXG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHBpcGVSZWR1Y2VyKGFjYzogc3RyaW5nLCB0cmFuc2Zvcm1OYW1lOiBzdHJpbmcpIHtcbiAgdHJhbnNmb3JtTmFtZSA9IHRyYW5zZm9ybU5hbWUudHJpbSgpXG5cbiAgaWYgKCFpc1RyYW5zZm9ybWVyKHRyYW5zZm9ybU5hbWUpKSB0aHJvdyBuZXcgVHJhbnNmb3JtTmFtZUVycm9yKHRyYW5zZm9ybU5hbWUpXG5cbiAgcmV0dXJuIHRyYW5zZm9ybXNbdHJhbnNmb3JtTmFtZV0oYWNjKVxufVxuXG4vKipcbiAqIENhbGxlZCBieSBtdXN0YWNoZSB3aXRoIHRoZSBjb250ZW50cyBvZiBhIHRhZywgdXNlZCB0byBwcm92aWRlIG91ciBvd25cbiAqIGdyYW1tYXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleGVjKGV4cHI6IHN0cmluZywgc2NvcGU6IFNjb3BlID0ge30pIHtcbiAgY29uc3QgW2xocywgLi4ucGlwZXNdID0gZXhwci5zcGxpdCgnfCcpXG5cbiAgaWYgKCFsaHMpXG4gICAgdGhyb3cgbmV3IEVycm9yKGBleHBlY3RlZCBsZWZ0IGhhbmQgc2lkZSB0byByZWZlcmVuY2Ugb25lIG9yIG1vcmUgdmFyaWFibGVzLCBsaWtlIFwieyQwfVwiYClcblxuICBjb25zdCB2YWx1ZXMgPSBsaHMudHJpbSgpLnNwbGl0KC9cXHMrLykubWFwKHRva2VuID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldChzY29wZSwgdG9rZW4pXG5cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgYGV4cGVjdGVkIFwiJHt0b2tlbn1cIiB0byBiZSBhIHN0cmluZyxcbiAgICAgICAgZ290OiAke0pTT04uc3RyaW5naWZ5KHZhbHVlLCBudWxsLCAyKX1gLFxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9KVxuXG4gIGNvbnN0IHZhbHVlID0gcGF0aC5qb2luKC4uLnZhbHVlcylcblxuICByZXR1cm4gcGlwZXMucmVkdWNlKHBpcGVSZWR1Y2VyLCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBSZW5kZXIgYSBtdXN0YWNoZSB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcih0ZW1wbGF0ZTogc3RyaW5nLCBzY29wZToge30pOiBzdHJpbmcge1xuICBjb25zdCBvcHRzOiBJQ29tcGlsZU9wdGlvbnMgPSB7IHRhZ3M6IFsneycsICd9J10sIHByb3BzRXhpc3Q6IHRydWUsIHZhbGlkYXRlVmFyTmFtZXM6IHRydWUgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKG11c3RhY2hlLnJlbmRlckZuKHRlbXBsYXRlLCBleGVjLCBzY29wZSwgb3B0cykpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFJlZmVyZW5jZUVycm9yKSBmb3JtYXRFcnJvcihlLCBzY29wZSlcbiAgICB0aHJvdyBlXG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IoZTogUmVmZXJlbmNlRXJyb3IsIHNjb3BlOiB7fSkge1xuICBjb25zdCBtZXNzYWdlID0gZS5tZXNzYWdlXG4gIGNvbnN0IHN0YWNrID0gZS5zdGFja1xuXG4gIGNvbnN0IHJlcmFpc2VkID0gbmV3IFJlZmVyZW5jZUVycm9yKFxuICAgIFtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBicixcbiAgICAgIGBBdmFpbGFibGUgYXNzaWduczogJHtPYmplY3Qua2V5cyhzY29wZSkuam9pbignLCAnKX1gLFxuICAgICAgYnIsXG4gICAgXS5qb2luKCcnKSxcbiAgKVxuXG4gIHJlcmFpc2VkLnN0YWNrID0gc3RhY2s/LnNwbGl0KCdcXG4nKS5zbGljZSgyKS5qb2luKCdcXG4nKVxuXG4gIHRocm93IHJlcmFpc2VkXG59XG4iLCAiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuXG5jb25zdCBzZXBhcmF0b3JQYXR0ZXJuID0gbmV3IFJlZ0V4cChwYXRoLnNlcCwgJ2cnKVxuXG5jb25zdCByZXBsYWNlRm9yd2FyZFNsYXNoID0gKHJlcGxhY2VtZW50OiBzdHJpbmcpID0+IChzb3VyY2U6IHN0cmluZykgPT4gc291cmNlLnJlcGxhY2Uoc2VwYXJhdG9yUGF0dGVybiwgcmVwbGFjZW1lbnQpXG5cbmNvbnN0IHJlcGxhY2VBbGwgPSAocGF0dGVybjogc3RyaW5nLCByZXBsYWNlbWVudDogc3RyaW5nKSA9PlxuICAoc291cmNlOiBzdHJpbmcpID0+IHNvdXJjZS5yZXBsYWNlKG5ldyBSZWdFeHAocGF0dGVybiwgJ2cnKSwgcmVwbGFjZW1lbnQpXG5cbi8qKlxuICogRnVuY3Rpb25zIHRoYXQgYXJlIGF2YWlsYWJsZSBhcyBwaXBlYWJsZSBwYXRoIHRyYW5zZm9ybXMuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogICB7ICQwIHwgdW5kZXJzY29yZSB8IGRvdCB9XG4gKi9cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1zID0ge1xuICB1cHBlcmNhc2U6IChzOiBzdHJpbmcpID0+IHMudG9VcHBlckNhc2UoKSxcblxuICBsb3dlcmNhc2U6IChzOiBzdHJpbmcpID0+IHMudG9Mb3dlckNhc2UoKSxcblxuICBkb3Q6IHJlcGxhY2VGb3J3YXJkU2xhc2goJy4nKSxcblxuICB1bmRlcnNjb3JlOiByZXBsYWNlRm9yd2FyZFNsYXNoKCdfJyksXG5cbiAgYmFja3NsYXNoOiByZXBsYWNlRm9yd2FyZFNsYXNoKCdcXFxcJyksXG5cbiAgY29sb25zOiByZXBsYWNlRm9yd2FyZFNsYXNoKCc6OicpLFxuXG4gIGh5cGhlbmF0ZTogcmVwbGFjZUFsbCgnXycsICctJyksXG5cbiAgYmxhbms6IHJlcGxhY2VBbGwoJ1tfLV0nLCAnICcpLFxuXG4gIGNhbWVsY2FzZTogKHM6IHN0cmluZykgPT4gcy5yZXBsYWNlKC9bXy1dKC4pL2csIChfLCBfMSkgPT4gXzEudG9VcHBlckNhc2UoKSksXG5cbiAgY2FwaXRhbGl6ZTogKHM6IHN0cmluZykgPT4gcy5yZXBsYWNlKC8oPzw9XnxcXC8pKC4pL2csIChfLCBfMSkgPT4gXzEudG9VcHBlckNhc2UoKSksXG5cbiAgc25ha2VjYXNlOiAoczogc3RyaW5nKSA9PlxuICAgIHMucmVwbGFjZSgvKFtBLVpdKykoW0EtWl1bYS16XSkvZywgKF8sIF8xLCBfMikgPT4gYCR7XzF9XyR7XzJ9YCkucmVwbGFjZShcbiAgICAgIC8oW2EtejAtOV0pKFtBLVpdKS9nLFxuICAgICAgKF8sIF8xLCBfMikgPT4gYCR7XzF9XyR7XzJ9YCxcbiAgICApLnRvTG93ZXJDYXNlKCksXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZGlyZWN0b3J5IG5hbWUgb2YgdGhlIHBhdGhcbiAgICovXG4gIGRpcm5hbWU6IHBhdGguZGlybmFtZSxcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBsYXN0IHBvcnRpb24gb2YgdGhlIHBhdGhcbiAgICovXG4gIGJhc2VuYW1lOiBwYXRoLmJhc2VuYW1lLFxuXG4gIC8qKlxuICAgKiBBYnNvbHV0ZSBwYXRoIHRvIGZpbGVcbiAgICovXG4gIGFic29sdXRlOiBwYXRoLnJlc29sdmUsXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZmlsZSBleHRlbnNpb25cbiAgICovXG4gIGV4dG5hbWU6IHBhdGguZXh0bmFtZSxcbn1cblxuZXhwb3J0IHR5cGUgVHJhbnNmb3JtZXJOYW1lID0ga2V5b2YgdHlwZW9mIHRyYW5zZm9ybXNcblxuZXhwb3J0IGNvbnN0IGlzVHJhbnNmb3JtZXIgPSAoczogc3RyaW5nKTogcyBpcyBUcmFuc2Zvcm1lck5hbWUgPT4gcyBpbiB0cmFuc2Zvcm1zXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQ0EsTUFBTSxZQUFZO0FBRGxCLGtDQUUwQjtBQUFBLElBRXhCLFlBQWEsS0FBSyxVQUFVO0FBQzFCLFlBQU0sbUJBQW1CLEtBQUssVUFBVTtBQUN4QyxXQUFLLE9BQU87QUFDWixXQUFLLE9B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RCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUFBLFdBQzlCO0FBQ0QsZUFBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUFBLFdBQ2pDO0FBQ0QsZUFBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDcEM7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUFBLFdBQ3ZDO0FBQ0QsZUFBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUFBLFdBQzFDO0FBQ0QsZUFBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDN0M7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUFBLFdBQ2hEO0FBQ0QsZUFBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUFBLFdBQ25EO0FBQ0QsZUFBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDdEQ7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUFBLFdBQ3pEO0FBQ0QsZUFBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FB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
