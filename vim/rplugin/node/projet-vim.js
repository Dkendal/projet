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
  var util = require("util");
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
    return new RangeError("Invalid range arguments: " + util.inspect(...args));
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
  var path4 = require("path");
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
    SEP: path4.sep,
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
  var path4 = require("path");
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
    return win32 === true || path4.sep === "\\";
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
  var path4 = require("path");
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
    return regex.test(path4.basename(input));
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
  var util = require("util");
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
      throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
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
      throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
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
  function tokenize(template, options) {
    if (options === void 0) {
      options = {};
    }
    if (!isStr(template)) {
      throw new TypeError("The template parameter must be a string. Got a " + typeof template);
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
    while (currentIndex < template.length) {
      openIndex = template.indexOf(openSym, currentIndex);
      if (openIndex === -1) {
        break;
      }
      var varNameStartIndex = openIndex + openSymLen;
      closeIndex = template.substr(varNameStartIndex, maxVarNameLength + closeSymLen).indexOf(closeSym);
      if (closeIndex === -1) {
        throw new SyntaxError('Missing "' + closeSym + '" in the template for the "' + openSym + '" at position ' + openIndex + " within " + maxVarNameLength + " characters");
      }
      closeIndex += varNameStartIndex;
      varName = template.substring(varNameStartIndex, closeIndex).trim();
      if (varName.length === 0) {
        throw new SyntaxError('Unexpected "' + closeSym + '" tag found at position ' + openIndex);
      }
      if (varName.includes(openSym)) {
        throw new SyntaxError('Variable names cannot have "' + openSym + '". But at position ' + openIndex + '. Got "' + varName + '"');
      }
      varNames.push(varName);
      closeIndex += closeSymLen;
      strings.push(template.substring(currentIndex, openIndex));
      currentIndex = closeIndex;
    }
    strings.push(template.substring(closeIndex));
    return {strings, varNames};
  }
  function compile(template, options) {
    if (options === void 0) {
      options = {};
    }
    var tokens = tokenize(template, options);
    return new Renderer(tokens, options);
  }
  function render2(template, scope, options) {
    var renderer = compile(template, options);
    return renderer.render(scope);
  }
  function renderFn2(template, resolveFn, scope, options) {
    var renderer = compile(template, options);
    return renderer.renderFn(resolveFn, scope);
  }
  function renderFnAsync(template, resolveFnAsync, scope, options) {
    var renderer = compile(template, options);
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
function render(template, scope) {
  const opts = {tags: ["{", "}"], propsExist: true, validateVarNames: true};
  try {
    return path2.normalize(mustache.renderFn(template, exec, scope, opts));
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
  const localpath = render(pattern, scope);
  const dir = path3.dirname(config.path);
  return path3.normalize(path3.join(dir, localpath));
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

// src/vim/projet-vim.ts
var pluginOptions = {
  dev: true,
  alwaysInit: true
};
module.exports = (plugin) => {
  plugin.setOptions(pluginOptions);
  const logger = plugin.nvim.logger;
  const debug = logger.debug.bind(logger);
  const info = logger.info.bind(logger);
  const error = logger.error.bind(logger);
  const warn = logger.warn.bind(logger);
  const dump = (x) => debug(JSON.stringify(x));
  const api = plugin.nvim;
  const cmd = api.command.bind(api);
  const defCmd = plugin.registerCommand.bind(plugin);
  const defFn = plugin.registerFunction.bind(plugin);
  const echoerr = (msg) => api.errWriteLine(msg);
  const echomsg = (msg) => api.outWriteLine(msg);
  async function reportError(fun) {
    try {
      return fun();
    } catch (e) {
      if (e instanceof Error) {
        echoerr(e.message);
        return;
      }
      echoerr(JSON.stringify(e));
      return;
    }
  }
  defCmd("ProjetLink", async ([linkName]) => {
    reportError(async () => {
      const file = await api.buffer.name;
      const config = await getConfig(file);
      const linkFile = assoc(config, file, linkName);
      await cmd(`edit ${linkFile}`);
    });
  }, {
    sync: false,
    nargs: "?",
    complete: "custom,ProjetAssocComplete"
  });
  defCmd("ProjetConfig", async () => {
    reportError(async () => {
      const bname = await api.buffer.name;
      const configFile = await findConfig(bname);
      await cmd(`edit ${configFile}`);
    });
  }, {sync: false});
  defFn("ProjetAssocComplete", async (_argLead, _cmdLine, _cursorPos) => {
    return await reportError(async () => {
      var _a, _b, _c;
      const file = await api.buffer.name;
      const config = await getConfig(file);
      const match2 = findMatch(config, file);
      const keys = (_c = (_b = (_a = match2 == null ? void 0 : match2.rule) == null ? void 0 : _a.links) == null ? void 0 : _b.map((x) => x.name)) != null ? _c : [];
      return keys.join("\n");
    });
  }, {sync: true});
  defFn("ProjetGetConfig", async () => {
    return await reportError(async () => {
      const file = await api.buffer.name;
      return await getConfig(file);
    });
  }, {sync: true});
  defFn("ProjetGetMatchConfig", async () => {
    return await reportError(async () => {
      const file = await api.buffer.name;
      const config = await getConfig(file);
      const match2 = findMatch(config, file);
      if (!match2)
        throw `No matches for ${file}`;
      return match2;
    });
  }, {sync: true});
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL2xpYi9wYXJzZXIuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL2xpYi9jcmVhdGUtZGF0ZXRpbWUuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL2xpYi9mb3JtYXQtbnVtLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaWFybmEvdG9tbC9saWIvY3JlYXRlLWRhdGV0aW1lLWZsb2F0LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaWFybmEvdG9tbC9saWIvY3JlYXRlLWRhdGUuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL2xpYi9jcmVhdGUtdGltZS5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlhcm5hL3RvbWwvbGliL3RvbWwtcGFyc2VyLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaWFybmEvdG9tbC9wYXJzZS1wcmV0dHktZXJyb3IuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL3BhcnNlLXN0cmluZy5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlhcm5hL3RvbWwvcGFyc2UtYXN5bmMuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL3BhcnNlLXN0cmVhbS5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlhcm5hL3RvbWwvcGFyc2UuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpYXJuYS90b21sL3N0cmluZ2lmeS5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlhcm5hL3RvbWwvdG9tbC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnAtdHMvbGliL0NoYWluUmVjLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcC10cy9saWIvZnVuY3Rpb24uanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZwLXRzL2xpYi9FaXRoZXIuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvdXRpbHMuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvc3RyaW5naWZ5LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9pcy1udW1iZXIvaW5kZXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RvLXJlZ2V4LXJhbmdlL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9maWxsLXJhbmdlL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL2NvbXBpbGUuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvZXhwYW5kLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL2NvbnN0YW50cy5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJhY2VzL2xpYi9wYXJzZS5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJhY2VzL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL2NvbnN0YW50cy5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi91dGlscy5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi9zY2FuLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL3BhcnNlLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL3BpY29tYXRjaC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9taWNyb21hdGNoL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9pby10cy9saWIvaW5kZXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21pY3JvbXVzdGFjaGUvc3JjL3V0aWxzLnRzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9taWNyb211c3RhY2hlL3NyYy90b3BhdGgudHMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21pY3JvbXVzdGFjaGUvc3JjL2dldC50cyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbWljcm9tdXN0YWNoZS9zcmMvcmVuZGVyZXIudHMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21pY3JvbXVzdGFjaGUvc3JjL3Rva2VuaXplLnRzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9taWNyb211c3RhY2hlL3NyYy9jb21waWxlLnRzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9taWNyb211c3RhY2hlL3NyYy9yZW5kZXIudHMiLCAiLi4vLi4vLi4vc3JjL3Byb2pldC50cyIsICIuLi8uLi8uLi9zcmMvY29uZmlnLnRzIiwgIi4uLy4uLy4uL3NyYy90ZW1wbGF0ZS50cyIsICIuLi8uLi8uLi9zcmMvdHJhbnNmb3Jtcy50cyIsICIuLi8uLi8uLi9zcmMvdmltL3Byb2pldC12aW0udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIid1c2Ugc3RyaWN0J1xuY29uc3QgUGFyc2VyRU5EID0gMHgxMTAwMDBcbmNsYXNzIFBhcnNlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBjb25zdHJ1Y3RvciAobXNnLCBmaWxlbmFtZSwgbGluZW51bWJlcikge1xuICAgIHN1cGVyKCdbUGFyc2VyRXJyb3JdICcgKyBtc2csIGZpbGVuYW1lLCBsaW5lbnVtYmVyKVxuICAgIHRoaXMubmFtZSA9ICdQYXJzZXJFcnJvcidcbiAgICB0aGlzLmNvZGUgPSAnUGFyc2VyRXJyb3InXG4gICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBQYXJzZXJFcnJvcilcbiAgfVxufVxuY2xhc3MgU3RhdGUge1xuICBjb25zdHJ1Y3RvciAocGFyc2VyKSB7XG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZXJcbiAgICB0aGlzLmJ1ZiA9ICcnXG4gICAgdGhpcy5yZXR1cm5lZCA9IG51bGxcbiAgICB0aGlzLnJlc3VsdCA9IG51bGxcbiAgICB0aGlzLnJlc3VsdFRhYmxlID0gbnVsbFxuICAgIHRoaXMucmVzdWx0QXJyID0gbnVsbFxuICB9XG59XG5jbGFzcyBQYXJzZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5wb3MgPSAwXG4gICAgdGhpcy5jb2wgPSAwXG4gICAgdGhpcy5saW5lID0gMFxuICAgIHRoaXMub2JqID0ge31cbiAgICB0aGlzLmN0eCA9IHRoaXMub2JqXG4gICAgdGhpcy5zdGFjayA9IFtdXG4gICAgdGhpcy5fYnVmID0gJydcbiAgICB0aGlzLmNoYXIgPSBudWxsXG4gICAgdGhpcy5paSA9IDBcbiAgICB0aGlzLnN0YXRlID0gbmV3IFN0YXRlKHRoaXMucGFyc2VTdGFydClcbiAgfVxuXG4gIHBhcnNlIChzdHIpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChzdHIubGVuZ3RoID09PSAwIHx8IHN0ci5sZW5ndGggPT0gbnVsbCkgcmV0dXJuXG5cbiAgICB0aGlzLl9idWYgPSBTdHJpbmcoc3RyKVxuICAgIHRoaXMuaWkgPSAtMVxuICAgIHRoaXMuY2hhciA9IC0xXG4gICAgbGV0IGdldE5leHRcbiAgICB3aGlsZSAoZ2V0TmV4dCA9PT0gZmFsc2UgfHwgdGhpcy5uZXh0Q2hhcigpKSB7XG4gICAgICBnZXROZXh0ID0gdGhpcy5ydW5PbmUoKVxuICAgIH1cbiAgICB0aGlzLl9idWYgPSBudWxsXG4gIH1cbiAgbmV4dENoYXIgKCkge1xuICAgIGlmICh0aGlzLmNoYXIgPT09IDB4MEEpIHtcbiAgICAgICsrdGhpcy5saW5lXG4gICAgICB0aGlzLmNvbCA9IC0xXG4gICAgfVxuICAgICsrdGhpcy5paVxuICAgIHRoaXMuY2hhciA9IHRoaXMuX2J1Zi5jb2RlUG9pbnRBdCh0aGlzLmlpKVxuICAgICsrdGhpcy5wb3NcbiAgICArK3RoaXMuY29sXG4gICAgcmV0dXJuIHRoaXMuaGF2ZUJ1ZmZlcigpXG4gIH1cbiAgaGF2ZUJ1ZmZlciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWkgPCB0aGlzLl9idWYubGVuZ3RoXG4gIH1cbiAgcnVuT25lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5wYXJzZXIuY2FsbCh0aGlzLCB0aGlzLnN0YXRlLnJldHVybmVkKVxuICB9XG4gIGZpbmlzaCAoKSB7XG4gICAgdGhpcy5jaGFyID0gUGFyc2VyRU5EXG4gICAgbGV0IGxhc3RcbiAgICBkbyB7XG4gICAgICBsYXN0ID0gdGhpcy5zdGF0ZS5wYXJzZXJcbiAgICAgIHRoaXMucnVuT25lKClcbiAgICB9IHdoaWxlICh0aGlzLnN0YXRlLnBhcnNlciAhPT0gbGFzdClcblxuICAgIHRoaXMuY3R4ID0gbnVsbFxuICAgIHRoaXMuc3RhdGUgPSBudWxsXG4gICAgdGhpcy5fYnVmID0gbnVsbFxuXG4gICAgcmV0dXJuIHRoaXMub2JqXG4gIH1cbiAgbmV4dCAoZm4pIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBQYXJzZXJFcnJvcignVHJpZWQgdG8gc2V0IHN0YXRlIHRvIG5vbi1leGlzdGVudCBzdGF0ZTogJyArIEpTT04uc3RyaW5naWZ5KGZuKSlcbiAgICB0aGlzLnN0YXRlLnBhcnNlciA9IGZuXG4gIH1cbiAgZ290byAoZm4pIHtcbiAgICB0aGlzLm5leHQoZm4pXG4gICAgcmV0dXJuIHRoaXMucnVuT25lKClcbiAgfVxuICBjYWxsIChmbiwgcmV0dXJuV2l0aCkge1xuICAgIGlmIChyZXR1cm5XaXRoKSB0aGlzLm5leHQocmV0dXJuV2l0aClcbiAgICB0aGlzLnN0YWNrLnB1c2godGhpcy5zdGF0ZSlcbiAgICB0aGlzLnN0YXRlID0gbmV3IFN0YXRlKGZuKVxuICB9XG4gIGNhbGxOb3cgKGZuLCByZXR1cm5XaXRoKSB7XG4gICAgdGhpcy5jYWxsKGZuLCByZXR1cm5XaXRoKVxuICAgIHJldHVybiB0aGlzLnJ1bk9uZSgpXG4gIH1cbiAgcmV0dXJuICh2YWx1ZSkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID09PSAwKSB0aHJvdyB0aGlzLmVycm9yKG5ldyBQYXJzZXJFcnJvcignU3RhY2sgdW5kZXJmbG93JykpXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHZhbHVlID0gdGhpcy5zdGF0ZS5idWZcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGFjay5wb3AoKVxuICAgIHRoaXMuc3RhdGUucmV0dXJuZWQgPSB2YWx1ZVxuICB9XG4gIHJldHVybk5vdyAodmFsdWUpIHtcbiAgICB0aGlzLnJldHVybih2YWx1ZSlcbiAgICByZXR1cm4gdGhpcy5ydW5PbmUoKVxuICB9XG4gIGNvbnN1bWUgKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuY2hhciA9PT0gUGFyc2VyRU5EKSB0aHJvdyB0aGlzLmVycm9yKG5ldyBQYXJzZXJFcnJvcignVW5leHBlY3RlZCBlbmQtb2YtYnVmZmVyJykpXG4gICAgdGhpcy5zdGF0ZS5idWYgKz0gdGhpcy5fYnVmW3RoaXMuaWldXG4gIH1cbiAgZXJyb3IgKGVycikge1xuICAgIGVyci5saW5lID0gdGhpcy5saW5lXG4gICAgZXJyLmNvbCA9IHRoaXMuY29sXG4gICAgZXJyLnBvcyA9IHRoaXMucG9zXG4gICAgcmV0dXJuIGVyclxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHBhcnNlU3RhcnQgKCkge1xuICAgIHRocm93IG5ldyBQYXJzZXJFcnJvcignTXVzdCBkZWNsYXJlIGEgcGFyc2VTdGFydCBtZXRob2QnKVxuICB9XG59XG5QYXJzZXIuRU5EID0gUGFyc2VyRU5EXG5QYXJzZXIuRXJyb3IgPSBQYXJzZXJFcnJvclxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXJcbiIsICIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0gdmFsdWUgPT4ge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoaXNOYU4oZGF0ZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIERhdGV0aW1lJylcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGF0ZVxuICB9XG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IChkLCBudW0pID0+IHtcbiAgbnVtID0gU3RyaW5nKG51bSlcbiAgd2hpbGUgKG51bS5sZW5ndGggPCBkKSBudW0gPSAnMCcgKyBudW1cbiAgcmV0dXJuIG51bVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuY29uc3QgZiA9IHJlcXVpcmUoJy4vZm9ybWF0LW51bS5qcycpXG5cbmNsYXNzIEZsb2F0aW5nRGF0ZVRpbWUgZXh0ZW5kcyBEYXRlIHtcbiAgY29uc3RydWN0b3IgKHZhbHVlKSB7XG4gICAgc3VwZXIodmFsdWUgKyAnWicpXG4gICAgdGhpcy5pc0Zsb2F0aW5nID0gdHJ1ZVxuICB9XG4gIHRvSVNPU3RyaW5nICgpIHtcbiAgICBjb25zdCBkYXRlID0gYCR7dGhpcy5nZXRVVENGdWxsWWVhcigpfS0ke2YoMiwgdGhpcy5nZXRVVENNb250aCgpICsgMSl9LSR7ZigyLCB0aGlzLmdldFVUQ0RhdGUoKSl9YFxuICAgIGNvbnN0IHRpbWUgPSBgJHtmKDIsIHRoaXMuZ2V0VVRDSG91cnMoKSl9OiR7ZigyLCB0aGlzLmdldFVUQ01pbnV0ZXMoKSl9OiR7ZigyLCB0aGlzLmdldFVUQ1NlY29uZHMoKSl9LiR7ZigzLCB0aGlzLmdldFVUQ01pbGxpc2Vjb25kcygpKX1gXG4gICAgcmV0dXJuIGAke2RhdGV9VCR7dGltZX1gXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2YWx1ZSA9PiB7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRmxvYXRpbmdEYXRlVGltZSh2YWx1ZSlcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChpc05hTihkYXRlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgRGF0ZXRpbWUnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBkYXRlXG4gIH1cbn1cbiIsICIndXNlIHN0cmljdCdcbmNvbnN0IGYgPSByZXF1aXJlKCcuL2Zvcm1hdC1udW0uanMnKVxuY29uc3QgRGF0ZVRpbWUgPSBnbG9iYWwuRGF0ZVxuXG5jbGFzcyBEYXRlIGV4dGVuZHMgRGF0ZVRpbWUge1xuICBjb25zdHJ1Y3RvciAodmFsdWUpIHtcbiAgICBzdXBlcih2YWx1ZSlcbiAgICB0aGlzLmlzRGF0ZSA9IHRydWVcbiAgfVxuICB0b0lTT1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuZ2V0VVRDRnVsbFllYXIoKX0tJHtmKDIsIHRoaXMuZ2V0VVRDTW9udGgoKSArIDEpfS0ke2YoMiwgdGhpcy5nZXRVVENEYXRlKCkpfWBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlID0+IHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGlzTmFOKGRhdGUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBEYXRldGltZScpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRhdGVcbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuY29uc3QgZiA9IHJlcXVpcmUoJy4vZm9ybWF0LW51bS5qcycpXG5cbmNsYXNzIFRpbWUgZXh0ZW5kcyBEYXRlIHtcbiAgY29uc3RydWN0b3IgKHZhbHVlKSB7XG4gICAgc3VwZXIoYDAwMDAtMDEtMDFUJHt2YWx1ZX1aYClcbiAgICB0aGlzLmlzVGltZSA9IHRydWVcbiAgfVxuICB0b0lTT1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIGAke2YoMiwgdGhpcy5nZXRVVENIb3VycygpKX06JHtmKDIsIHRoaXMuZ2V0VVRDTWludXRlcygpKX06JHtmKDIsIHRoaXMuZ2V0VVRDU2Vjb25kcygpKX0uJHtmKDMsIHRoaXMuZ2V0VVRDTWlsbGlzZWNvbmRzKCkpfWBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlID0+IHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBUaW1lKHZhbHVlKVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGlzTmFOKGRhdGUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBEYXRldGltZScpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRhdGVcbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuLyogZXNsaW50LWRpc2FibGUgbm8tbmV3LXdyYXBwZXJzLCBuby1ldmFsLCBjYW1lbGNhc2UsIG9wZXJhdG9yLWxpbmVicmVhayAqL1xubW9kdWxlLmV4cG9ydHMgPSBtYWtlUGFyc2VyQ2xhc3MocmVxdWlyZSgnLi9wYXJzZXIuanMnKSlcbm1vZHVsZS5leHBvcnRzLm1ha2VQYXJzZXJDbGFzcyA9IG1ha2VQYXJzZXJDbGFzc1xuXG5jbGFzcyBUb21sRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yIChtc2cpIHtcbiAgICBzdXBlcihtc2cpXG4gICAgdGhpcy5uYW1lID0gJ1RvbWxFcnJvcidcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgVG9tbEVycm9yKVxuICAgIHRoaXMuZnJvbVRPTUwgPSB0cnVlXG4gICAgdGhpcy53cmFwcGVkID0gbnVsbFxuICB9XG59XG5Ub21sRXJyb3Iud3JhcCA9IGVyciA9PiB7XG4gIGNvbnN0IHRlcnIgPSBuZXcgVG9tbEVycm9yKGVyci5tZXNzYWdlKVxuICB0ZXJyLmNvZGUgPSBlcnIuY29kZVxuICB0ZXJyLndyYXBwZWQgPSBlcnJcbiAgcmV0dXJuIHRlcnJcbn1cbm1vZHVsZS5leHBvcnRzLlRvbWxFcnJvciA9IFRvbWxFcnJvclxuXG5jb25zdCBjcmVhdGVEYXRlVGltZSA9IHJlcXVpcmUoJy4vY3JlYXRlLWRhdGV0aW1lLmpzJylcbmNvbnN0IGNyZWF0ZURhdGVUaW1lRmxvYXQgPSByZXF1aXJlKCcuL2NyZWF0ZS1kYXRldGltZS1mbG9hdC5qcycpXG5jb25zdCBjcmVhdGVEYXRlID0gcmVxdWlyZSgnLi9jcmVhdGUtZGF0ZS5qcycpXG5jb25zdCBjcmVhdGVUaW1lID0gcmVxdWlyZSgnLi9jcmVhdGUtdGltZS5qcycpXG5cbmNvbnN0IENUUkxfSSA9IDB4MDlcbmNvbnN0IENUUkxfSiA9IDB4MEFcbmNvbnN0IENUUkxfTSA9IDB4MERcbmNvbnN0IENUUkxfQ0hBUl9CT1VOREFSWSA9IDB4MUYgLy8gdGhlIGxhc3Qgbm9uLWNoYXJhY3RlciBpbiB0aGUgbGF0aW4xIHJlZ2lvbiBvZiB1bmljb2RlLCBleGNlcHQgREVMXG5jb25zdCBDSEFSX1NQID0gMHgyMFxuY29uc3QgQ0hBUl9RVU9UID0gMHgyMlxuY29uc3QgQ0hBUl9OVU0gPSAweDIzXG5jb25zdCBDSEFSX0FQT1MgPSAweDI3XG5jb25zdCBDSEFSX1BMVVMgPSAweDJCXG5jb25zdCBDSEFSX0NPTU1BID0gMHgyQ1xuY29uc3QgQ0hBUl9IWVBIRU4gPSAweDJEXG5jb25zdCBDSEFSX1BFUklPRCA9IDB4MkVcbmNvbnN0IENIQVJfMCA9IDB4MzBcbmNvbnN0IENIQVJfMSA9IDB4MzFcbmNvbnN0IENIQVJfNyA9IDB4MzdcbmNvbnN0IENIQVJfOSA9IDB4MzlcbmNvbnN0IENIQVJfQ09MT04gPSAweDNBXG5jb25zdCBDSEFSX0VRVUFMUyA9IDB4M0RcbmNvbnN0IENIQVJfQSA9IDB4NDFcbmNvbnN0IENIQVJfRSA9IDB4NDVcbmNvbnN0IENIQVJfRiA9IDB4NDZcbmNvbnN0IENIQVJfVCA9IDB4NTRcbmNvbnN0IENIQVJfVSA9IDB4NTVcbmNvbnN0IENIQVJfWiA9IDB4NUFcbmNvbnN0IENIQVJfTE9XQkFSID0gMHg1RlxuY29uc3QgQ0hBUl9hID0gMHg2MVxuY29uc3QgQ0hBUl9iID0gMHg2MlxuY29uc3QgQ0hBUl9lID0gMHg2NVxuY29uc3QgQ0hBUl9mID0gMHg2NlxuY29uc3QgQ0hBUl9pID0gMHg2OVxuY29uc3QgQ0hBUl9sID0gMHg2Q1xuY29uc3QgQ0hBUl9uID0gMHg2RVxuY29uc3QgQ0hBUl9vID0gMHg2RlxuY29uc3QgQ0hBUl9yID0gMHg3MlxuY29uc3QgQ0hBUl9zID0gMHg3M1xuY29uc3QgQ0hBUl90ID0gMHg3NFxuY29uc3QgQ0hBUl91ID0gMHg3NVxuY29uc3QgQ0hBUl94ID0gMHg3OFxuY29uc3QgQ0hBUl96ID0gMHg3QVxuY29uc3QgQ0hBUl9MQ1VCID0gMHg3QlxuY29uc3QgQ0hBUl9SQ1VCID0gMHg3RFxuY29uc3QgQ0hBUl9MU1FCID0gMHg1QlxuY29uc3QgQ0hBUl9CU09MID0gMHg1Q1xuY29uc3QgQ0hBUl9SU1FCID0gMHg1RFxuY29uc3QgQ0hBUl9ERUwgPSAweDdGXG5jb25zdCBTVVJST0dBVEVfRklSU1QgPSAweEQ4MDBcbmNvbnN0IFNVUlJPR0FURV9MQVNUID0gMHhERkZGXG5cbmNvbnN0IGVzY2FwZXMgPSB7XG4gIFtDSEFSX2JdOiAnXFx1MDAwOCcsXG4gIFtDSEFSX3RdOiAnXFx1MDAwOScsXG4gIFtDSEFSX25dOiAnXFx1MDAwQScsXG4gIFtDSEFSX2ZdOiAnXFx1MDAwQycsXG4gIFtDSEFSX3JdOiAnXFx1MDAwRCcsXG4gIFtDSEFSX1FVT1RdOiAnXFx1MDAyMicsXG4gIFtDSEFSX0JTT0xdOiAnXFx1MDA1Qydcbn1cblxuZnVuY3Rpb24gaXNEaWdpdCAoY3ApIHtcbiAgcmV0dXJuIGNwID49IENIQVJfMCAmJiBjcCA8PSBDSEFSXzlcbn1cbmZ1bmN0aW9uIGlzSGV4aXQgKGNwKSB7XG4gIHJldHVybiAoY3AgPj0gQ0hBUl9BICYmIGNwIDw9IENIQVJfRikgfHwgKGNwID49IENIQVJfYSAmJiBjcCA8PSBDSEFSX2YpIHx8IChjcCA+PSBDSEFSXzAgJiYgY3AgPD0gQ0hBUl85KVxufVxuZnVuY3Rpb24gaXNCaXQgKGNwKSB7XG4gIHJldHVybiBjcCA9PT0gQ0hBUl8xIHx8IGNwID09PSBDSEFSXzBcbn1cbmZ1bmN0aW9uIGlzT2N0aXQgKGNwKSB7XG4gIHJldHVybiAoY3AgPj0gQ0hBUl8wICYmIGNwIDw9IENIQVJfNylcbn1cbmZ1bmN0aW9uIGlzQWxwaGFOdW1RdW90ZUh5cGhlbiAoY3ApIHtcbiAgcmV0dXJuIChjcCA+PSBDSEFSX0EgJiYgY3AgPD0gQ0hBUl9aKVxuICAgICAgfHwgKGNwID49IENIQVJfYSAmJiBjcCA8PSBDSEFSX3opXG4gICAgICB8fCAoY3AgPj0gQ0hBUl8wICYmIGNwIDw9IENIQVJfOSlcbiAgICAgIHx8IGNwID09PSBDSEFSX0FQT1NcbiAgICAgIHx8IGNwID09PSBDSEFSX1FVT1RcbiAgICAgIHx8IGNwID09PSBDSEFSX0xPV0JBUlxuICAgICAgfHwgY3AgPT09IENIQVJfSFlQSEVOXG59XG5mdW5jdGlvbiBpc0FscGhhTnVtSHlwaGVuIChjcCkge1xuICByZXR1cm4gKGNwID49IENIQVJfQSAmJiBjcCA8PSBDSEFSX1opXG4gICAgICB8fCAoY3AgPj0gQ0hBUl9hICYmIGNwIDw9IENIQVJfeilcbiAgICAgIHx8IChjcCA+PSBDSEFSXzAgJiYgY3AgPD0gQ0hBUl85KVxuICAgICAgfHwgY3AgPT09IENIQVJfTE9XQkFSXG4gICAgICB8fCBjcCA9PT0gQ0hBUl9IWVBIRU5cbn1cbmNvbnN0IF90eXBlID0gU3ltYm9sKCd0eXBlJylcbmNvbnN0IF9kZWNsYXJlZCA9IFN5bWJvbCgnZGVjbGFyZWQnKVxuXG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbmNvbnN0IGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XG5jb25zdCBkZXNjcmlwdG9yID0ge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWR9XG5cbmZ1bmN0aW9uIGhhc0tleSAob2JqLCBrZXkpIHtcbiAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXR1cm4gdHJ1ZVxuICBpZiAoa2V5ID09PSAnX19wcm90b19fJykgZGVmaW5lUHJvcGVydHkob2JqLCAnX19wcm90b19fJywgZGVzY3JpcHRvcilcbiAgcmV0dXJuIGZhbHNlXG59XG5cbmNvbnN0IElOTElORV9UQUJMRSA9IFN5bWJvbCgnaW5saW5lLXRhYmxlJylcbmZ1bmN0aW9uIElubGluZVRhYmxlICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHt9LCB7XG4gICAgW190eXBlXToge3ZhbHVlOiBJTkxJTkVfVEFCTEV9XG4gIH0pXG59XG5mdW5jdGlvbiBpc0lubGluZVRhYmxlIChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG9ialtfdHlwZV0gPT09IElOTElORV9UQUJMRVxufVxuXG5jb25zdCBUQUJMRSA9IFN5bWJvbCgndGFibGUnKVxuZnVuY3Rpb24gVGFibGUgKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoe30sIHtcbiAgICBbX3R5cGVdOiB7dmFsdWU6IFRBQkxFfSxcbiAgICBbX2RlY2xhcmVkXToge3ZhbHVlOiBmYWxzZSwgd3JpdGFibGU6IHRydWV9XG4gIH0pXG59XG5mdW5jdGlvbiBpc1RhYmxlIChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG9ialtfdHlwZV0gPT09IFRBQkxFXG59XG5cbmNvbnN0IF9jb250ZW50VHlwZSA9IFN5bWJvbCgnY29udGVudC10eXBlJylcbmNvbnN0IElOTElORV9MSVNUID0gU3ltYm9sKCdpbmxpbmUtbGlzdCcpXG5mdW5jdGlvbiBJbmxpbmVMaXN0ICh0eXBlKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhbXSwge1xuICAgIFtfdHlwZV06IHt2YWx1ZTogSU5MSU5FX0xJU1R9LFxuICAgIFtfY29udGVudFR5cGVdOiB7dmFsdWU6IHR5cGV9XG4gIH0pXG59XG5mdW5jdGlvbiBpc0lubGluZUxpc3QgKG9iaikge1xuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiAob2JqKSAhPT0gJ29iamVjdCcpIHJldHVybiBmYWxzZVxuICByZXR1cm4gb2JqW190eXBlXSA9PT0gSU5MSU5FX0xJU1Rcbn1cblxuY29uc3QgTElTVCA9IFN5bWJvbCgnbGlzdCcpXG5mdW5jdGlvbiBMaXN0ICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFtdLCB7XG4gICAgW190eXBlXToge3ZhbHVlOiBMSVNUfVxuICB9KVxufVxuZnVuY3Rpb24gaXNMaXN0IChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG9ialtfdHlwZV0gPT09IExJU1Rcbn1cblxuLy8gaW4gYW4gZXZhbCwgdG8gbGV0IGJ1bmRsZXJzIG5vdCBzbHVycCBpbiBhIHV0aWwgcHJveHlcbmxldCBfY3VzdG9tXG50cnkge1xuICBjb25zdCB1dGlsSW5zcGVjdCA9IGV2YWwoXCJyZXF1aXJlKCd1dGlsJykuaW5zcGVjdFwiKVxuICBfY3VzdG9tID0gdXRpbEluc3BlY3QuY3VzdG9tXG59IGNhdGNoIChfKSB7XG4gIC8qIGV2YWwgcmVxdWlyZSBub3QgYXZhaWxhYmxlIGluIHRyYW5zcGlsZWQgYnVuZGxlICovXG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuY29uc3QgX2luc3BlY3QgPSBfY3VzdG9tIHx8ICdpbnNwZWN0J1xuXG5jbGFzcyBCb3hlZEJpZ0ludCB7XG4gIGNvbnN0cnVjdG9yICh2YWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnZhbHVlID0gZ2xvYmFsLkJpZ0ludC5hc0ludE4oNjQsIHZhbHVlKVxuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICB0aGlzLnZhbHVlID0gbnVsbFxuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgX3R5cGUsIHt2YWx1ZTogSU5URUdFUn0pXG4gIH1cbiAgaXNOYU4gKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID09PSBudWxsXG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSlcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBbX2luc3BlY3RdICgpIHtcbiAgICByZXR1cm4gYFtCaWdJbnQ6ICR7dGhpcy50b1N0cmluZygpfV19YFxuICB9XG4gIHZhbHVlT2YgKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlXG4gIH1cbn1cblxuY29uc3QgSU5URUdFUiA9IFN5bWJvbCgnaW50ZWdlcicpXG5mdW5jdGlvbiBJbnRlZ2VyICh2YWx1ZSkge1xuICBsZXQgbnVtID0gTnVtYmVyKHZhbHVlKVxuICAvLyAtMCBpcyBhIGZsb2F0IHRoaW5nLCBub3QgYW4gaW50IHRoaW5nXG4gIGlmIChPYmplY3QuaXMobnVtLCAtMCkpIG51bSA9IDBcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKGdsb2JhbC5CaWdJbnQgJiYgIU51bWJlci5pc1NhZmVJbnRlZ2VyKG51bSkpIHtcbiAgICByZXR1cm4gbmV3IEJveGVkQmlnSW50KHZhbHVlKVxuICB9IGVsc2Uge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG5ldyBOdW1iZXIobnVtKSwge1xuICAgICAgaXNOYU46IHt2YWx1ZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gaXNOYU4odGhpcykgfX0sXG4gICAgICBbX3R5cGVdOiB7dmFsdWU6IElOVEVHRVJ9LFxuICAgICAgW19pbnNwZWN0XToge3ZhbHVlOiAoKSA9PiBgW0ludGVnZXI6ICR7dmFsdWV9XWB9XG4gICAgfSlcbiAgfVxufVxuZnVuY3Rpb24gaXNJbnRlZ2VyIChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG9ialtfdHlwZV0gPT09IElOVEVHRVJcbn1cblxuY29uc3QgRkxPQVQgPSBTeW1ib2woJ2Zsb2F0JylcbmZ1bmN0aW9uIEZsb2F0ICh2YWx1ZSkge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobmV3IE51bWJlcih2YWx1ZSksIHtcbiAgICBbX3R5cGVdOiB7dmFsdWU6IEZMT0FUfSxcbiAgICBbX2luc3BlY3RdOiB7dmFsdWU6ICgpID0+IGBbRmxvYXQ6ICR7dmFsdWV9XWB9XG4gIH0pXG59XG5mdW5jdGlvbiBpc0Zsb2F0IChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG9ialtfdHlwZV0gPT09IEZMT0FUXG59XG5cbmZ1bmN0aW9uIHRvbWxUeXBlICh2YWx1ZSkge1xuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlXG4gIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuICdudWxsJ1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHJldHVybiAnZGF0ZXRpbWUnXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoX3R5cGUgaW4gdmFsdWUpIHtcbiAgICAgIHN3aXRjaCAodmFsdWVbX3R5cGVdKSB7XG4gICAgICAgIGNhc2UgSU5MSU5FX1RBQkxFOiByZXR1cm4gJ2lubGluZS10YWJsZSdcbiAgICAgICAgY2FzZSBJTkxJTkVfTElTVDogcmV0dXJuICdpbmxpbmUtbGlzdCdcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgY2FzZSBUQUJMRTogcmV0dXJuICd0YWJsZSdcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgY2FzZSBMSVNUOiByZXR1cm4gJ2xpc3QnXG4gICAgICAgIGNhc2UgRkxPQVQ6IHJldHVybiAnZmxvYXQnXG4gICAgICAgIGNhc2UgSU5URUdFUjogcmV0dXJuICdpbnRlZ2VyJ1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHlwZVxufVxuXG5mdW5jdGlvbiBtYWtlUGFyc2VyQ2xhc3MgKFBhcnNlcikge1xuICBjbGFzcyBUT01MUGFyc2VyIGV4dGVuZHMgUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICBzdXBlcigpXG4gICAgICB0aGlzLmN0eCA9IHRoaXMub2JqID0gVGFibGUoKVxuICAgIH1cblxuICAgIC8qIE1BVENIIEhFTFBFUiAqL1xuICAgIGF0RW5kT2ZXb3JkICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXIgPT09IENIQVJfTlVNIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9JIHx8IHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmF0RW5kT2ZMaW5lKClcbiAgICB9XG4gICAgYXRFbmRPZkxpbmUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhciA9PT0gUGFyc2VyLkVORCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSiB8fCB0aGlzLmNoYXIgPT09IENUUkxfTVxuICAgIH1cblxuICAgIHBhcnNlU3RhcnQgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gUGFyc2VyLkVORCkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTFNRQikge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VUYWJsZU9yTGlzdClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX05VTSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VDb21tZW50KVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENUUkxfSiB8fCB0aGlzLmNoYXIgPT09IENIQVJfU1AgfHwgdGhpcy5jaGFyID09PSBDVFJMX0kgfHwgdGhpcy5jaGFyID09PSBDVFJMX00pIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH0gZWxzZSBpZiAoaXNBbHBoYU51bVF1b3RlSHlwaGVuKHRoaXMuY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlQXNzaWduU3RhdGVtZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKGBVbmtub3duIGNoYXJhY3RlciBcIiR7dGhpcy5jaGFyfVwiYCkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSEVMUEVSLCB0aGlzIHN0cmlwcyBhbnkgd2hpdGVzcGFjZSBhbmQgY29tbWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgbGluZVxuICAgIC8vIHRoZW4gUkVUVVJOUy4gTGFzdCBzdGF0ZSBpbiBhIHByb2R1Y3Rpb24uXG4gICAgcGFyc2VXaGl0ZXNwYWNlVG9FT0wgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSB8fCB0aGlzLmNoYXIgPT09IENUUkxfTSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTlVNKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUNvbW1lbnQpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gUGFyc2VyLkVORCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSikge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbmV4cGVjdGVkIGNoYXJhY3RlciwgZXhwZWN0ZWQgb25seSB3aGl0ZXNwYWNlIG9yIGNvbW1lbnRzIHRpbGwgZW5kIG9mIGxpbmUnKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBBU1NJR05NRU5UOiBrZXkgPSB2YWx1ZSAqL1xuICAgIHBhcnNlQXNzaWduU3RhdGVtZW50ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbGxOb3codGhpcy5wYXJzZUFzc2lnbiwgdGhpcy5yZWNvcmRBc3NpZ25TdGF0ZW1lbnQpXG4gICAgfVxuICAgIHJlY29yZEFzc2lnblN0YXRlbWVudCAoa3YpIHtcbiAgICAgIGxldCB0YXJnZXQgPSB0aGlzLmN0eFxuICAgICAgbGV0IGZpbmFsS2V5ID0ga3Yua2V5LnBvcCgpXG4gICAgICBmb3IgKGxldCBrdyBvZiBrdi5rZXkpIHtcbiAgICAgICAgaWYgKGhhc0tleSh0YXJnZXQsIGt3KSAmJiAoIWlzVGFibGUodGFyZ2V0W2t3XSkgfHwgdGFyZ2V0W2t3XVtfZGVjbGFyZWRdKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRba3ddID0gdGFyZ2V0W2t3XSB8fCBUYWJsZSgpXG4gICAgICB9XG4gICAgICBpZiAoaGFzS2V5KHRhcmdldCwgZmluYWxLZXkpKSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgIH1cbiAgICAgIC8vIHVuYm94IG91ciBudW1iZXJzXG4gICAgICBpZiAoaXNJbnRlZ2VyKGt2LnZhbHVlKSB8fCBpc0Zsb2F0KGt2LnZhbHVlKSkge1xuICAgICAgICB0YXJnZXRbZmluYWxLZXldID0ga3YudmFsdWUudmFsdWVPZigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRbZmluYWxLZXldID0ga3YudmFsdWVcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZVdoaXRlc3BhY2VUb0VPTClcbiAgICB9XG5cbiAgICAvKiBBU1NTSUdOTUVOVCBleHByZXNzaW9uLCBrZXkgPSB2YWx1ZSBwb3NzaWJseSBpbnNpZGUgYW4gaW5saW5lIHRhYmxlICovXG4gICAgcGFyc2VBc3NpZ24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlS2V5d29yZCwgdGhpcy5yZWNvcmRBc3NpZ25LZXl3b3JkKVxuICAgIH1cbiAgICByZWNvcmRBc3NpZ25LZXl3b3JkIChrZXkpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnJlc3VsdFRhYmxlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUucmVzdWx0VGFibGUucHVzaChrZXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlLnJlc3VsdFRhYmxlID0gW2tleV1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUFzc2lnbktleXdvcmRQcmVEb3QpXG4gICAgfVxuICAgIHBhcnNlQXNzaWduS2V5d29yZFByZURvdCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1BFUklPRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VBc3NpZ25LZXl3b3JkUG9zdERvdClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyICE9PSBDSEFSX1NQICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9JKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUFzc2lnbkVxdWFsKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUFzc2lnbktleXdvcmRQb3N0RG90ICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgIT09IENIQVJfU1AgJiYgdGhpcy5jaGFyICE9PSBDVFJMX0kpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlS2V5d29yZCwgdGhpcy5yZWNvcmRBc3NpZ25LZXl3b3JkKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlQXNzaWduRXF1YWwgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9FUVVBTFMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlQXNzaWduUHJlVmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyLCBleHBlY3RlZCBcIj1cIicpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUFzc2lnblByZVZhbHVlICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfU1AgfHwgdGhpcy5jaGFyID09PSBDVFJMX0kpIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGxOb3codGhpcy5wYXJzZVZhbHVlLCB0aGlzLnJlY29yZEFzc2lnblZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgICByZWNvcmRBc3NpZ25WYWx1ZSAodmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyh7a2V5OiB0aGlzLnN0YXRlLnJlc3VsdFRhYmxlLCB2YWx1ZTogdmFsdWV9KVxuICAgIH1cblxuICAgIC8qIENPTU1FTlRTOiAjLi4uZW9sICovXG4gICAgcGFyc2VDb21tZW50ICgpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHRoaXMuY2hhciA9PT0gUGFyc2VyLkVORCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJldHVybigpXG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRoaXMubmV4dENoYXIoKSlcbiAgICB9XG5cbiAgICAvKiBUQUJMRVMgQU5EIExJU1RTLCBbZm9vXSBhbmQgW1tmb29dXSAqL1xuICAgIHBhcnNlVGFibGVPckxpc3QgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9MU1FCKSB7XG4gICAgICAgIHRoaXMubmV4dCh0aGlzLnBhcnNlTGlzdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZVRhYmxlKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIFRBQkxFIFtmb28uYmFyLmJhel0gKi9cbiAgICBwYXJzZVRhYmxlICgpIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5vYmpcbiAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZVRhYmxlTmV4dClcbiAgICB9XG4gICAgcGFyc2VUYWJsZU5leHQgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlS2V5d29yZCwgdGhpcy5wYXJzZVRhYmxlTW9yZSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VUYWJsZU1vcmUgKGtleXdvcmQpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfU1AgfHwgdGhpcy5jaGFyID09PSBDVFJMX0kpIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1JTUUIpIHtcbiAgICAgICAgaWYgKGhhc0tleSh0aGlzLmN0eCwga2V5d29yZCkgJiYgKCFpc1RhYmxlKHRoaXMuY3R4W2tleXdvcmRdKSB8fCB0aGlzLmN0eFtrZXl3b3JkXVtfZGVjbGFyZWRdKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY3R4W2tleXdvcmRdID0gdGhpcy5jdHhba2V5d29yZF0gfHwgVGFibGUoKVxuICAgICAgICAgIHRoaXMuY3R4W19kZWNsYXJlZF0gPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlV2hpdGVzcGFjZVRvRU9MKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUEVSSU9EKSB7XG4gICAgICAgIGlmICghaGFzS2V5KHRoaXMuY3R4LCBrZXl3b3JkKSkge1xuICAgICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jdHhba2V5d29yZF0gPSBUYWJsZSgpXG4gICAgICAgIH0gZWxzZSBpZiAoaXNUYWJsZSh0aGlzLmN0eFtrZXl3b3JkXSkpIHtcbiAgICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY3R4W2tleXdvcmRdXG4gICAgICAgIH0gZWxzZSBpZiAoaXNMaXN0KHRoaXMuY3R4W2tleXdvcmRdKSkge1xuICAgICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jdHhba2V5d29yZF1bdGhpcy5jdHhba2V5d29yZF0ubGVuZ3RoIC0gMV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoXCJDYW4ndCByZWRlZmluZSBleGlzdGluZyBrZXlcIikpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlVGFibGVOZXh0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbmV4cGVjdGVkIGNoYXJhY3RlciwgZXhwZWN0ZWQgd2hpdGVzcGFjZSwgLiBvciBdJykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogTElTVCBbW2EuYi5jXV0gKi9cbiAgICBwYXJzZUxpc3QgKCkge1xuICAgICAgdGhpcy5jdHggPSB0aGlzLm9ialxuICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlTGlzdE5leHQpXG4gICAgfVxuICAgIHBhcnNlTGlzdE5leHQgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlS2V5d29yZCwgdGhpcy5wYXJzZUxpc3RNb3JlKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUxpc3RNb3JlIChrZXl3b3JkKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1NQIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9JKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9SU1FCKSB7XG4gICAgICAgIGlmICghaGFzS2V5KHRoaXMuY3R4LCBrZXl3b3JkKSkge1xuICAgICAgICAgIHRoaXMuY3R4W2tleXdvcmRdID0gTGlzdCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzSW5saW5lTGlzdCh0aGlzLmN0eFtrZXl3b3JkXSkpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoXCJDYW4ndCBleHRlbmQgYW4gaW5saW5lIGFycmF5XCIpKVxuICAgICAgICB9IGVsc2UgaWYgKGlzTGlzdCh0aGlzLmN0eFtrZXl3b3JkXSkpIHtcbiAgICAgICAgICBjb25zdCBuZXh0ID0gVGFibGUoKVxuICAgICAgICAgIHRoaXMuY3R4W2tleXdvcmRdLnB1c2gobmV4dClcbiAgICAgICAgICB0aGlzLmN0eCA9IG5leHRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoXCJDYW4ndCByZWRlZmluZSBhbiBleGlzdGluZyBrZXlcIikpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTGlzdEVuZClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1BFUklPRCkge1xuICAgICAgICBpZiAoIWhhc0tleSh0aGlzLmN0eCwga2V5d29yZCkpIHtcbiAgICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY3R4W2tleXdvcmRdID0gVGFibGUoKVxuICAgICAgICB9IGVsc2UgaWYgKGlzSW5saW5lTGlzdCh0aGlzLmN0eFtrZXl3b3JkXSkpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoXCJDYW4ndCBleHRlbmQgYW4gaW5saW5lIGFycmF5XCIpKVxuICAgICAgICB9IGVsc2UgaWYgKGlzSW5saW5lVGFibGUodGhpcy5jdHhba2V5d29yZF0pKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKFwiQ2FuJ3QgZXh0ZW5kIGFuIGlubGluZSB0YWJsZVwiKSlcbiAgICAgICAgfSBlbHNlIGlmIChpc0xpc3QodGhpcy5jdHhba2V5d29yZF0pKSB7XG4gICAgICAgICAgdGhpcy5jdHggPSB0aGlzLmN0eFtrZXl3b3JkXVt0aGlzLmN0eFtrZXl3b3JkXS5sZW5ndGggLSAxXVxuICAgICAgICB9IGVsc2UgaWYgKGlzVGFibGUodGhpcy5jdHhba2V5d29yZF0pKSB7XG4gICAgICAgICAgdGhpcy5jdHggPSB0aGlzLmN0eFtrZXl3b3JkXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGFuIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VMaXN0TmV4dClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIsIGV4cGVjdGVkIHdoaXRlc3BhY2UsIC4gb3IgXScpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUxpc3RFbmQgKGtleXdvcmQpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUlNRQikge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VXaGl0ZXNwYWNlVG9FT0wpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyLCBleHBlY3RlZCB3aGl0ZXNwYWNlLCAuIG9yIF0nKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBWQUxVRSBzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgaW5saW5lIGxpc3QsIGlubGluZSBvYmplY3QgKi9cbiAgICBwYXJzZVZhbHVlICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IFBhcnNlci5FTkQpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdLZXkgd2l0aG91dCB2YWx1ZScpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUVVPVCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VEb3VibGVTdHJpbmcpXG4gICAgICB9IGlmICh0aGlzLmNoYXIgPT09IENIQVJfQVBPUykge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VTaW5nbGVTdHJpbmcpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9IWVBIRU4gfHwgdGhpcy5jaGFyID09PSBDSEFSX1BMVVMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlTnVtYmVyU2lnbilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX2kpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlSW5mKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfbikge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VOYW4pXG4gICAgICB9IGVsc2UgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VOdW1iZXJPckRhdGVUaW1lKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfdCB8fCB0aGlzLmNoYXIgPT09IENIQVJfZikge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VCb29sZWFuKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTFNRQikge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VJbmxpbmVMaXN0LCB0aGlzLnJlY29yZFZhbHVlKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTENVQikge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VJbmxpbmVUYWJsZSwgdGhpcy5yZWNvcmRWYWx1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIsIGV4cGVjdGluZyBzdHJpbmcsIG51bWJlciwgZGF0ZXRpbWUsIGJvb2xlYW4sIGlubGluZSBhcnJheSBvciBpbmxpbmUgdGFibGUnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmVjb3JkVmFsdWUgKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3codmFsdWUpXG4gICAgfVxuXG4gICAgcGFyc2VJbmYgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZUluZjIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyLCBleHBlY3RlZCBcImluZlwiLCBcIitpbmZcIiBvciBcIi1pbmZcIicpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUluZjIgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9mKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJ1ZiA9PT0gJy0nKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKC1JbmZpbml0eSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oSW5maW5pdHkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIsIGV4cGVjdGVkIFwiaW5mXCIsIFwiK2luZlwiIG9yIFwiLWluZlwiJykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VOYW4gKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9hKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU5hbjIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyLCBleHBlY3RlZCBcIm5hblwiJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTmFuMiAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKE5hTilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIsIGV4cGVjdGVkIFwibmFuXCInKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBLRVlTLCBiYXJld29yZHMgb3IgYmFzaWMsIGxpdGVyYWwsIG9yIGRvdHRlZCAqL1xuICAgIHBhcnNlS2V5d29yZCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1FVT1QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlQmFzaWNTdHJpbmcpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9BUE9TKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZUxpdGVyYWxTdHJpbmcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VCYXJlS2V5KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIEtFWVM6IGJhcmV3b3JkcyAqL1xuICAgIHBhcnNlQmFyZUtleSAoKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmICh0aGlzLmNoYXIgPT09IFBhcnNlci5FTkQpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0tleSBlbmRlZCB3aXRob3V0IHZhbHVlJykpXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBbHBoYU51bUh5cGhlbih0aGlzLmNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0VtcHR5IGJhcmUga2V5cyBhcmUgbm90IGFsbG93ZWQnKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3coKVxuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0aGlzLm5leHRDaGFyKCkpXG4gICAgfVxuXG4gICAgLyogU1RSSU5HUywgc2luZ2xlIHF1b3RlZCAobGl0ZXJhbCkgKi9cbiAgICBwYXJzZVNpbmdsZVN0cmluZyAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0FQT1MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTGl0ZXJhbE11bHRpU3RyaW5nTWF5YmUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VMaXRlcmFsU3RyaW5nKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUxpdGVyYWxTdHJpbmcgKCkge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0FQT1MpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYXRFbmRPZkxpbmUoKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW50ZXJtaW5hdGVkIHN0cmluZycpKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9ERUwgfHwgKHRoaXMuY2hhciA8PSBDVFJMX0NIQVJfQk9VTkRBUlkgJiYgdGhpcy5jaGFyICE9PSBDVFJMX0kpKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvckNvbnRyb2xDaGFySW5TdHJpbmcoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRoaXMubmV4dENoYXIoKSlcbiAgICB9XG4gICAgcGFyc2VMaXRlcmFsTXVsdGlTdHJpbmdNYXliZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0FQT1MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTGl0ZXJhbE11bHRpU3RyaW5nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KClcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VMaXRlcmFsTXVsdGlTdHJpbmcgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9NKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9KKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZUxpdGVyYWxNdWx0aVN0cmluZ0NvbnRlbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VMaXRlcmFsTXVsdGlTdHJpbmdDb250ZW50KVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUxpdGVyYWxNdWx0aVN0cmluZ0NvbnRlbnQgKCkge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0FQT1MpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VMaXRlcmFsTXVsdGlFbmQpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBQYXJzZXIuRU5EKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbnRlcm1pbmF0ZWQgbXVsdGktbGluZSBzdHJpbmcnKSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfREVMIHx8ICh0aGlzLmNoYXIgPD0gQ1RSTF9DSEFSX0JPVU5EQVJZICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9JICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9KICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9NKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3JDb250cm9sQ2hhckluU3RyaW5nKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0aGlzLm5leHRDaGFyKCkpXG4gICAgfVxuICAgIHBhcnNlTGl0ZXJhbE11bHRpRW5kICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQVBPUykge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VMaXRlcmFsTXVsdGlFbmQyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgKz0gXCInXCJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlTGl0ZXJhbE11bHRpU3RyaW5nQ29udGVudClcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VMaXRlcmFsTXVsdGlFbmQyICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQVBPUykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgKz0gXCInJ1wiXG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUxpdGVyYWxNdWx0aVN0cmluZ0NvbnRlbnQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogU1RSSU5HUyBkb3VibGUgcXVvdGVkICovXG4gICAgcGFyc2VEb3VibGVTdHJpbmcgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9RVU9UKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU11bHRpU3RyaW5nTWF5YmUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VCYXNpY1N0cmluZylcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VCYXNpY1N0cmluZyAoKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQlNPTCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZUVzY2FwZSwgdGhpcy5yZWNvcmRFc2NhcGVSZXBsYWNlbWVudClcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUVVPVCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJldHVybigpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hdEVuZE9mTGluZSgpKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbnRlcm1pbmF0ZWQgc3RyaW5nJykpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0RFTCB8fCAodGhpcy5jaGFyIDw9IENUUkxfQ0hBUl9CT1VOREFSWSAmJiB0aGlzLmNoYXIgIT09IENUUkxfSSkpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yQ29udHJvbENoYXJJblN0cmluZygpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAodGhpcy5uZXh0Q2hhcigpKVxuICAgIH1cbiAgICByZWNvcmRFc2NhcGVSZXBsYWNlbWVudCAocmVwbGFjZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdGUuYnVmICs9IHJlcGxhY2VtZW50XG4gICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VCYXNpY1N0cmluZylcbiAgICB9XG4gICAgcGFyc2VNdWx0aVN0cmluZ01heWJlICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUVVPVCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VNdWx0aVN0cmluZylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdygpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTXVsdGlTdHJpbmcgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9NKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9KKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU11bHRpU3RyaW5nQ29udGVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZU11bHRpU3RyaW5nQ29udGVudClcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VNdWx0aVN0cmluZ0NvbnRlbnQgKCkge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0JTT0wpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VNdWx0aUVzY2FwZSwgdGhpcy5yZWNvcmRNdWx0aUVzY2FwZVJlcGxhY2VtZW50KVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9RVU9UKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTXVsdGlFbmQpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBQYXJzZXIuRU5EKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbnRlcm1pbmF0ZWQgbXVsdGktbGluZSBzdHJpbmcnKSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfREVMIHx8ICh0aGlzLmNoYXIgPD0gQ1RSTF9DSEFSX0JPVU5EQVJZICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9JICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9KICYmIHRoaXMuY2hhciAhPT0gQ1RSTF9NKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3JDb250cm9sQ2hhckluU3RyaW5nKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0aGlzLm5leHRDaGFyKCkpXG4gICAgfVxuICAgIGVycm9yQ29udHJvbENoYXJJblN0cmluZyAoKSB7XG4gICAgICBsZXQgZGlzcGxheUNvZGUgPSAnXFxcXHUwMCdcbiAgICAgIGlmICh0aGlzLmNoYXIgPCAxNikge1xuICAgICAgICBkaXNwbGF5Q29kZSArPSAnMCdcbiAgICAgIH1cbiAgICAgIGRpc3BsYXlDb2RlICs9IHRoaXMuY2hhci50b1N0cmluZygxNilcblxuICAgICAgcmV0dXJuIHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihgQ29udHJvbCBjaGFyYWN0ZXJzIChjb2RlcyA8IDB4MWYgYW5kIDB4N2YpIGFyZSBub3QgYWxsb3dlZCBpbiBzdHJpbmdzLCB1c2UgJHtkaXNwbGF5Q29kZX0gaW5zdGVhZGApKVxuICAgIH1cbiAgICByZWNvcmRNdWx0aUVzY2FwZVJlcGxhY2VtZW50IChyZXBsYWNlbWVudCkge1xuICAgICAgdGhpcy5zdGF0ZS5idWYgKz0gcmVwbGFjZW1lbnRcbiAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZU11bHRpU3RyaW5nQ29udGVudClcbiAgICB9XG4gICAgcGFyc2VNdWx0aUVuZCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1FVT1QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTXVsdGlFbmQyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgKz0gJ1wiJ1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VNdWx0aVN0cmluZ0NvbnRlbnQpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTXVsdGlFbmQyICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUVVPVCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgKz0gJ1wiXCInXG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZU11bHRpU3RyaW5nQ29udGVudClcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VNdWx0aUVzY2FwZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDVFJMX00gfHwgdGhpcy5jaGFyID09PSBDVFJMX0opIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTXVsdGlUcmltKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfU1AgfHwgdGhpcy5jaGFyID09PSBDVFJMX0kpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlUHJlTXVsdGlUcmltKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlRXNjYXBlKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVByZU11bHRpVHJpbSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1NQIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9JKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9NIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9KKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU11bHRpVHJpbSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IGVzY2FwZSB3aGl0ZXNwYWNlXCIpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZU11bHRpVHJpbSAoKSB7XG4gICAgICAvLyBleHBsaWNpdGx5IHdoaXRlc3BhY2UgaGVyZSwgRU5EIHNob3VsZCBmb2xsb3cgdGhlIHNhbWUgcGF0aCBhcyBjaGFyc1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ1RSTF9KIHx8IHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSB8fCB0aGlzLmNoYXIgPT09IENUUkxfTSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KClcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VFc2NhcGUgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciBpbiBlc2NhcGVzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybihlc2NhcGVzW3RoaXMuY2hhcl0pXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl91KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZVNtYWxsVW5pY29kZSwgdGhpcy5wYXJzZVVuaWNvZGVSZXR1cm4pXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9VKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZUxhcmdlVW5pY29kZSwgdGhpcy5wYXJzZVVuaWNvZGVSZXR1cm4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1Vua25vd24gZXNjYXBlIGNoYXJhY3RlcjogJyArIHRoaXMuY2hhcikpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlVW5pY29kZVJldHVybiAoY2hhcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY29kZVBvaW50ID0gcGFyc2VJbnQoY2hhciwgMTYpXG4gICAgICAgIGlmIChjb2RlUG9pbnQgPj0gU1VSUk9HQVRFX0ZJUlNUICYmIGNvZGVQb2ludCA8PSBTVVJST0dBVEVfTEFTVCkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW52YWxpZCB1bmljb2RlLCBjaGFyYWN0ZXIgaW4gcmFuZ2UgMHhEODAwIC0gMHhERkZGIGlzIHJlc2VydmVkJykpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KFN0cmluZy5mcm9tQ29kZVBvaW50KGNvZGVQb2ludCkpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihUb21sRXJyb3Iud3JhcChlcnIpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVNtYWxsVW5pY29kZSAoKSB7XG4gICAgICBpZiAoIWlzSGV4aXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIHVuaWNvZGUgc2VxdWVuY2UsIGV4cGVjdGVkIGhleCcpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA+PSA0KSByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUxhcmdlVW5pY29kZSAoKSB7XG4gICAgICBpZiAoIWlzSGV4aXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIHVuaWNvZGUgc2VxdWVuY2UsIGV4cGVjdGVkIGhleCcpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA+PSA4KSByZXR1cm4gdGhpcy5yZXR1cm4oKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIE5VTUJFUlMgKi9cbiAgICBwYXJzZU51bWJlclNpZ24gKCkge1xuICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU1heWJlU2lnbmVkSW5mT3JOYW4pXG4gICAgfVxuICAgIHBhcnNlTWF5YmVTaWduZWRJbmZPck5hbiAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX2kpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlSW5mKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfbikge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VOYW4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsTm93KHRoaXMucGFyc2VOb1VuZGVyLCB0aGlzLnBhcnNlTnVtYmVySW50ZWdlclN0YXJ0KVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZU51bWJlckludGVnZXJTdGFydCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSXzApIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTnVtYmVySW50ZWdlckV4cG9uZW50T3JEZWNpbWFsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlTnVtYmVySW50ZWdlcilcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VOdW1iZXJJbnRlZ2VyRXhwb25lbnRPckRlY2ltYWwgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9QRVJJT0QpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlTm9VbmRlciwgdGhpcy5wYXJzZU51bWJlckZsb2F0KVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfRSB8fCB0aGlzLmNoYXIgPT09IENIQVJfZSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VOdW1iZXJFeHBvbmVudFNpZ24pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3coSW50ZWdlcih0aGlzLnN0YXRlLmJ1ZikpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTnVtYmVySW50ZWdlciAoKSB7XG4gICAgICBpZiAoaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9MT1dCQVIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlTm9VbmRlcilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0UgfHwgdGhpcy5jaGFyID09PSBDSEFSX2UpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTnVtYmVyRXhwb25lbnRTaWduKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUEVSSU9EKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXIsIHRoaXMucGFyc2VOdW1iZXJGbG9hdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IEludGVnZXIodGhpcy5zdGF0ZS5idWYpXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAocmVzdWx0LmlzTmFOKCkpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgbnVtYmVyJykpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KHJlc3VsdClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZU5vVW5kZXIgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9MT1dCQVIgfHwgdGhpcy5jaGFyID09PSBDSEFSX1BFUklPRCB8fCB0aGlzLmNoYXIgPT09IENIQVJfRSB8fCB0aGlzLmNoYXIgPT09IENIQVJfZSkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyLCBleHBlY3RlZCBkaWdpdCcpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmF0RW5kT2ZXb3JkKCkpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbmNvbXBsZXRlIG51bWJlcicpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KClcbiAgICB9XG4gICAgcGFyc2VOb1VuZGVySGV4T2N0QmluTGl0ZXJhbCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0xPV0JBUiB8fCB0aGlzLmNoYXIgPT09IENIQVJfUEVSSU9EKSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIsIGV4cGVjdGVkIGRpZ2l0JykpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXRFbmRPZldvcmQoKSkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0luY29tcGxldGUgbnVtYmVyJykpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3coKVxuICAgIH1cbiAgICBwYXJzZU51bWJlckZsb2F0ICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTE9XQkFSKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXIsIHRoaXMucGFyc2VOdW1iZXJGbG9hdClcbiAgICAgIH0gZWxzZSBpZiAoaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9FIHx8IHRoaXMuY2hhciA9PT0gQ0hBUl9lKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZU51bWJlckV4cG9uZW50U2lnbilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhGbG9hdCh0aGlzLnN0YXRlLmJ1ZikpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTnVtYmVyRXhwb25lbnRTaWduICgpIHtcbiAgICAgIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlTnVtYmVyRXhwb25lbnQpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9IWVBIRU4gfHwgdGhpcy5jaGFyID09PSBDSEFSX1BMVVMpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgdGhpcy5jYWxsKHRoaXMucGFyc2VOb1VuZGVyLCB0aGlzLnBhcnNlTnVtYmVyRXhwb25lbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyLCBleHBlY3RlZCAtLCArIG9yIGRpZ2l0JykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlTnVtYmVyRXhwb25lbnQgKCkge1xuICAgICAgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTE9XQkFSKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3coRmxvYXQodGhpcy5zdGF0ZS5idWYpKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIE5VTUJFUlMgb3IgREFURVRJTUVTICAqL1xuICAgIHBhcnNlTnVtYmVyT3JEYXRlVGltZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSXzApIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTnVtYmVyQmFzZU9yRGF0ZVRpbWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VOdW1iZXJPckRhdGVUaW1lT25seSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VOdW1iZXJPckRhdGVUaW1lT25seSAoKSB7XG4gICAgICAvLyBub3RlLCBpZiB0d28gemVyb3MgYXJlIGluIGEgcm93IHRoZW4gaXQgTVVTVCBiZSBhIGRhdGVcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTE9XQkFSKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXIsIHRoaXMucGFyc2VOdW1iZXJJbnRlZ2VyKVxuICAgICAgfSBlbHNlIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA+IDQpIHRoaXMubmV4dCh0aGlzLnBhcnNlTnVtYmVySW50ZWdlcilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0UgfHwgdGhpcy5jaGFyID09PSBDSEFSX2UpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlTnVtYmVyRXhwb25lbnRTaWduKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUEVSSU9EKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXIsIHRoaXMucGFyc2VOdW1iZXJGbG9hdClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0hZUEhFTikge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VEYXRlVGltZSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0NPTE9OKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZU9ubHlUaW1lSG91cilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhJbnRlZ2VyKHRoaXMuc3RhdGUuYnVmKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VEYXRlVGltZU9ubHkgKCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWUoKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9DT0xPTikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZU9ubHlUaW1lSG91cilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0V4cGVjdGVkIGRpZ2l0IHdoaWxlIHBhcnNpbmcgeWVhciBwYXJ0IG9mIGEgZGF0ZScpKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0hZUEhFTikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZURhdGVUaW1lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignRXhwZWN0ZWQgaHlwaGVuICgtKSB3aGlsZSBwYXJzaW5nIHllYXIgcGFydCBvZiBkYXRlJykpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VOdW1iZXJCYXNlT3JEYXRlVGltZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX2IpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlTm9VbmRlckhleE9jdEJpbkxpdGVyYWwsIHRoaXMucGFyc2VJbnRlZ2VyQmluKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfbykge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VOb1VuZGVySGV4T2N0QmluTGl0ZXJhbCwgdGhpcy5wYXJzZUludGVnZXJPY3QpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl94KSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXJIZXhPY3RCaW5MaXRlcmFsLCB0aGlzLnBhcnNlSW50ZWdlckhleClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1BFUklPRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nb3RvKHRoaXMucGFyc2VOdW1iZXJJbnRlZ2VyKVxuICAgICAgfSBlbHNlIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlRGF0ZVRpbWVPbmx5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KEludGVnZXIodGhpcy5zdGF0ZS5idWYpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZUludGVnZXJIZXggKCkge1xuICAgICAgaWYgKGlzSGV4aXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfTE9XQkFSKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwodGhpcy5wYXJzZU5vVW5kZXJIZXhPY3RCaW5MaXRlcmFsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gSW50ZWdlcih0aGlzLnN0YXRlLmJ1ZilcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChyZXN1bHQuaXNOYU4oKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW52YWxpZCBudW1iZXInKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3cocmVzdWx0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlSW50ZWdlck9jdCAoKSB7XG4gICAgICBpZiAoaXNPY3RpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9MT1dCQVIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlTm9VbmRlckhleE9jdEJpbkxpdGVyYWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBJbnRlZ2VyKHRoaXMuc3RhdGUuYnVmKVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKHJlc3VsdC5pc05hTigpKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbnZhbGlkIG51bWJlcicpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhyZXN1bHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VJbnRlZ2VyQmluICgpIHtcbiAgICAgIGlmIChpc0JpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9MT1dCQVIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlTm9VbmRlckhleE9jdEJpbkxpdGVyYWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBJbnRlZ2VyKHRoaXMuc3RhdGUuYnVmKVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKHJlc3VsdC5pc05hTigpKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbnZhbGlkIG51bWJlcicpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhyZXN1bHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBEQVRFVElNRSAqL1xuICAgIHBhcnNlRGF0ZVRpbWUgKCkge1xuICAgICAgLy8gd2UgZW50ZXIgaGVyZSBoYXZpbmcganVzdCBjb25zdW1lZCB0aGUgeWVhciBhbmQgYWJvdXQgdG8gY29uc3VtZSB0aGUgaHlwaGVuXG4gICAgICBpZiAodGhpcy5zdGF0ZS5idWYubGVuZ3RoIDwgNCkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1llYXJzIGxlc3MgdGhhbiAxMDAwIG11c3QgYmUgemVybyBwYWRkZWQgdG8gZm91ciBjaGFyYWN0ZXJzJykpXG4gICAgICB9XG4gICAgICB0aGlzLnN0YXRlLnJlc3VsdCA9IHRoaXMuc3RhdGUuYnVmXG4gICAgICB0aGlzLnN0YXRlLmJ1ZiA9ICcnXG4gICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VEYXRlTW9udGgpXG4gICAgfVxuICAgIHBhcnNlRGF0ZU1vbnRoICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfSFlQSEVOKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJ1Zi5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdNb250aHMgbGVzcyB0aGFuIDEwIG11c3QgYmUgemVybyBwYWRkZWQgdG8gdHdvIGNoYXJhY3RlcnMnKSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRlLnJlc3VsdCArPSAnLScgKyB0aGlzLnN0YXRlLmJ1ZlxuICAgICAgICB0aGlzLnN0YXRlLmJ1ZiA9ICcnXG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZURhdGVEYXkpXG4gICAgICB9IGVsc2UgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbmNvbXBsZXRlIGRhdGV0aW1lJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlRGF0ZURheSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1QgfHwgdGhpcy5jaGFyID09PSBDSEFSX1NQKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJ1Zi5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdEYXlzIGxlc3MgdGhhbiAxMCBtdXN0IGJlIHplcm8gcGFkZGVkIHRvIHR3byBjaGFyYWN0ZXJzJykpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHQgKz0gJy0nICsgdGhpcy5zdGF0ZS5idWZcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VTdGFydFRpbWVIb3VyKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmF0RW5kT2ZXb3JkKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KGNyZWF0ZURhdGUodGhpcy5zdGF0ZS5yZXN1bHQgKyAnLScgKyB0aGlzLnN0YXRlLmJ1ZikpXG4gICAgICB9IGVsc2UgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbmNvbXBsZXRlIGRhdGV0aW1lJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlU3RhcnRUaW1lSG91ciAoKSB7XG4gICAgICBpZiAodGhpcy5hdEVuZE9mV29yZCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhjcmVhdGVEYXRlKHRoaXMuc3RhdGUucmVzdWx0KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZVRpbWVIb3VyKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVRpbWVIb3VyICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQ09MT04pIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0hvdXJzIGxlc3MgdGhhbiAxMCBtdXN0IGJlIHplcm8gcGFkZGVkIHRvIHR3byBjaGFyYWN0ZXJzJykpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHQgKz0gJ1QnICsgdGhpcy5zdGF0ZS5idWZcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VUaW1lTWluKVxuICAgICAgfSBlbHNlIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW5jb21wbGV0ZSBkYXRldGltZScpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVRpbWVNaW4gKCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA8IDIgJiYgaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA9PT0gMiAmJiB0aGlzLmNoYXIgPT09IENIQVJfQ09MT04pIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHQgKz0gJzonICsgdGhpcy5zdGF0ZS5idWZcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VUaW1lU2VjKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbmNvbXBsZXRlIGRhdGV0aW1lJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlVGltZVNlYyAoKSB7XG4gICAgICBpZiAoaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJ1Zi5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLnJlc3VsdCArPSAnOicgKyB0aGlzLnN0YXRlLmJ1ZlxuICAgICAgICAgIHRoaXMuc3RhdGUuYnVmID0gJydcbiAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VUaW1lWm9uZU9yRnJhY3Rpb24pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW5jb21wbGV0ZSBkYXRldGltZScpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlT25seVRpbWVIb3VyICgpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX0NPTE9OKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJ1Zi5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdIb3VycyBsZXNzIHRoYW4gMTAgbXVzdCBiZSB6ZXJvIHBhZGRlZCB0byB0d28gY2hhcmFjdGVycycpKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUucmVzdWx0ID0gdGhpcy5zdGF0ZS5idWZcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VPbmx5VGltZU1pbilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW5jb21wbGV0ZSB0aW1lJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlT25seVRpbWVNaW4gKCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA8IDIgJiYgaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYnVmLmxlbmd0aCA9PT0gMiAmJiB0aGlzLmNoYXIgPT09IENIQVJfQ09MT04pIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHQgKz0gJzonICsgdGhpcy5zdGF0ZS5idWZcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VPbmx5VGltZVNlYylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW5jb21wbGV0ZSB0aW1lJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlT25seVRpbWVTZWMgKCkge1xuICAgICAgaWYgKGlzRGlnaXQodGhpcy5jaGFyKSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5idWYubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlT25seVRpbWVGcmFjdGlvbk1heWJlKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0luY29tcGxldGUgdGltZScpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZU9ubHlUaW1lRnJhY3Rpb25NYXliZSAoKSB7XG4gICAgICB0aGlzLnN0YXRlLnJlc3VsdCArPSAnOicgKyB0aGlzLnN0YXRlLmJ1ZlxuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9QRVJJT0QpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5idWYgPSAnJ1xuICAgICAgICB0aGlzLm5leHQodGhpcy5wYXJzZU9ubHlUaW1lRnJhY3Rpb24pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm4oY3JlYXRlVGltZSh0aGlzLnN0YXRlLnJlc3VsdCkpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlT25seVRpbWVGcmFjdGlvbiAoKSB7XG4gICAgICBpZiAoaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXRFbmRPZldvcmQoKSkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5idWYubGVuZ3RoID09PSAwKSB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0V4cGVjdGVkIGRpZ2l0IGluIG1pbGxpc2Vjb25kcycpKVxuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5Ob3coY3JlYXRlVGltZSh0aGlzLnN0YXRlLnJlc3VsdCArICcuJyArIHRoaXMuc3RhdGUuYnVmKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIgaW4gZGF0ZXRpbWUsIGV4cGVjdGVkIHBlcmlvZCAoLiksIG1pbnVzICgtKSwgcGx1cyAoKykgb3IgWicpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlVGltZVpvbmVPckZyYWN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfUEVSSU9EKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHRoaXMubmV4dCh0aGlzLnBhcnNlRGF0ZVRpbWVGcmFjdGlvbilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX0hZUEhFTiB8fCB0aGlzLmNoYXIgPT09IENIQVJfUExVUykge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICB0aGlzLm5leHQodGhpcy5wYXJzZVRpbWVab25lSG91cilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1opIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKGNyZWF0ZURhdGVUaW1lKHRoaXMuc3RhdGUucmVzdWx0ICsgdGhpcy5zdGF0ZS5idWYpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmF0RW5kT2ZXb3JkKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuTm93KGNyZWF0ZURhdGVUaW1lRmxvYXQodGhpcy5zdGF0ZS5yZXN1bHQgKyB0aGlzLnN0YXRlLmJ1ZikpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VuZXhwZWN0ZWQgY2hhcmFjdGVyIGluIGRhdGV0aW1lLCBleHBlY3RlZCBwZXJpb2QgKC4pLCBtaW51cyAoLSksIHBsdXMgKCspIG9yIFonKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VEYXRlVGltZUZyYWN0aW9uICgpIHtcbiAgICAgIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5idWYubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignRXhwZWN0ZWQgZGlnaXQgaW4gbWlsbGlzZWNvbmRzJykpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9IWVBIRU4gfHwgdGhpcy5jaGFyID09PSBDSEFSX1BMVVMpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgdGhpcy5uZXh0KHRoaXMucGFyc2VUaW1lWm9uZUhvdXIpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9aKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybihjcmVhdGVEYXRlVGltZSh0aGlzLnN0YXRlLnJlc3VsdCArIHRoaXMuc3RhdGUuYnVmKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hdEVuZE9mV29yZCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybk5vdyhjcmVhdGVEYXRlVGltZUZsb2F0KHRoaXMuc3RhdGUucmVzdWx0ICsgdGhpcy5zdGF0ZS5idWYpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbmV4cGVjdGVkIGNoYXJhY3RlciBpbiBkYXRldGltZSwgZXhwZWN0ZWQgcGVyaW9kICguKSwgbWludXMgKC0pLCBwbHVzICgrKSBvciBaJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlVGltZVpvbmVIb3VyICgpIHtcbiAgICAgIGlmIChpc0RpZ2l0KHRoaXMuY2hhcikpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgLy8gRklYTUU6IE5vIG1vcmUgcmVnZXhwc1xuICAgICAgICBpZiAoL1xcZFxcZCQvLnRlc3QodGhpcy5zdGF0ZS5idWYpKSByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VUaW1lWm9uZVNlcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIgaW4gZGF0ZXRpbWUsIGV4cGVjdGVkIGRpZ2l0JykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlVGltZVpvbmVTZXAgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9DT0xPTikge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICB0aGlzLm5leHQodGhpcy5wYXJzZVRpbWVab25lTWluKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbmV4cGVjdGVkIGNoYXJhY3RlciBpbiBkYXRldGltZSwgZXhwZWN0ZWQgY29sb24nKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VUaW1lWm9uZU1pbiAoKSB7XG4gICAgICBpZiAoaXNEaWdpdCh0aGlzLmNoYXIpKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIGlmICgvXFxkXFxkJC8udGVzdCh0aGlzLnN0YXRlLmJ1ZikpIHJldHVybiB0aGlzLnJldHVybihjcmVhdGVEYXRlVGltZSh0aGlzLnN0YXRlLnJlc3VsdCArIHRoaXMuc3RhdGUuYnVmKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW5leHBlY3RlZCBjaGFyYWN0ZXIgaW4gZGF0ZXRpbWUsIGV4cGVjdGVkIGRpZ2l0JykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogQk9PTEVBTiAqL1xuICAgIHBhcnNlQm9vbGVhbiAoKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl90KSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZVRydWVfcilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX2YpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlRmFsc2VfYSlcbiAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VUcnVlX3IgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9yKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZVRydWVfdSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW52YWxpZCBib29sZWFuLCBleHBlY3RlZCB0cnVlIG9yIGZhbHNlJykpXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnNlVHJ1ZV91ICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfdSkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VUcnVlX2UpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgYm9vbGVhbiwgZXhwZWN0ZWQgdHJ1ZSBvciBmYWxzZScpKVxuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVRydWVfZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKHRydWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgYm9vbGVhbiwgZXhwZWN0ZWQgdHJ1ZSBvciBmYWxzZScpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlRmFsc2VfYSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX2EpIHtcbiAgICAgICAgdGhpcy5jb25zdW1lKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlRmFsc2VfbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW52YWxpZCBib29sZWFuLCBleHBlY3RlZCB0cnVlIG9yIGZhbHNlJykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VGYWxzZV9sICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfbCkge1xuICAgICAgICB0aGlzLmNvbnN1bWUoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KHRoaXMucGFyc2VGYWxzZV9zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbnZhbGlkIGJvb2xlYW4sIGV4cGVjdGVkIHRydWUgb3IgZmFsc2UnKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZUZhbHNlX3MgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9zKSB7XG4gICAgICAgIHRoaXMuY29uc3VtZSgpXG4gICAgICAgIHJldHVybiB0aGlzLm5leHQodGhpcy5wYXJzZUZhbHNlX2UpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ0ludmFsaWQgYm9vbGVhbiwgZXhwZWN0ZWQgdHJ1ZSBvciBmYWxzZScpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlRmFsc2VfZSAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKGZhbHNlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbnZhbGlkIGJvb2xlYW4sIGV4cGVjdGVkIHRydWUgb3IgZmFsc2UnKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBJTkxJTkUgTElTVFMgKi9cbiAgICBwYXJzZUlubGluZUxpc3QgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSB8fCB0aGlzLmNoYXIgPT09IENUUkxfTSB8fCB0aGlzLmNoYXIgPT09IENUUkxfSikge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IFBhcnNlci5FTkQpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdVbnRlcm1pbmF0ZWQgaW5saW5lIGFycmF5JykpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9OVU0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh0aGlzLnBhcnNlQ29tbWVudClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1JTUUIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKHRoaXMuc3RhdGUucmVzdWx0QXJyIHx8IElubGluZUxpc3QoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGxOb3codGhpcy5wYXJzZVZhbHVlLCB0aGlzLnJlY29yZElubGluZUxpc3RWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmVjb3JkSW5saW5lTGlzdFZhbHVlICh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUucmVzdWx0QXJyKSB7XG4gICAgICAgIGNvbnN0IGxpc3RUeXBlID0gdGhpcy5zdGF0ZS5yZXN1bHRBcnJbX2NvbnRlbnRUeXBlXVxuICAgICAgICBjb25zdCB2YWx1ZVR5cGUgPSB0b21sVHlwZSh2YWx1ZSlcbiAgICAgICAgaWYgKGxpc3RUeXBlICE9PSB2YWx1ZVR5cGUpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoYElubGluZSBsaXN0cyBtdXN0IGJlIGEgc2luZ2xlIHR5cGUsIG5vdCBhIG1peCBvZiAke2xpc3RUeXBlfSBhbmQgJHt2YWx1ZVR5cGV9YCkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdGUucmVzdWx0QXJyID0gSW5saW5lTGlzdCh0b21sVHlwZSh2YWx1ZSkpXG4gICAgICB9XG4gICAgICBpZiAoaXNGbG9hdCh2YWx1ZSkgfHwgaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICAvLyB1bmJveCBub3cgdGhhdCB3ZSd2ZSB2ZXJpZmllZCB0aGV5J3JlIG9rXG4gICAgICAgIHRoaXMuc3RhdGUucmVzdWx0QXJyLnB1c2godmFsdWUudmFsdWVPZigpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHRBcnIucHVzaCh2YWx1ZSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUlubGluZUxpc3ROZXh0KVxuICAgIH1cbiAgICBwYXJzZUlubGluZUxpc3ROZXh0ICgpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIgPT09IENIQVJfU1AgfHwgdGhpcy5jaGFyID09PSBDVFJMX0kgfHwgdGhpcy5jaGFyID09PSBDVFJMX00gfHwgdGhpcy5jaGFyID09PSBDVFJMX0opIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX05VTSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHRoaXMucGFyc2VDb21tZW50KVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQ09NTUEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlSW5saW5lTGlzdClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1JTUUIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlSW5saW5lTGlzdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIsIGV4cGVjdGVkIHdoaXRlc3BhY2UsIGNvbW1hICgsKSBvciBjbG9zZSBicmFja2V0IChdKScpKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIElOTElORSBUQUJMRSAqL1xuICAgIHBhcnNlSW5saW5lVGFibGUgKCkge1xuICAgICAgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9TUCB8fCB0aGlzLmNoYXIgPT09IENUUkxfSSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IFBhcnNlci5FTkQgfHwgdGhpcy5jaGFyID09PSBDSEFSX05VTSB8fCB0aGlzLmNoYXIgPT09IENUUkxfSiB8fCB0aGlzLmNoYXIgPT09IENUUkxfTSkge1xuICAgICAgICB0aHJvdyB0aGlzLmVycm9yKG5ldyBUb21sRXJyb3IoJ1VudGVybWluYXRlZCBpbmxpbmUgYXJyYXknKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyID09PSBDSEFSX1JDVUIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuKHRoaXMuc3RhdGUucmVzdWx0VGFibGUgfHwgSW5saW5lVGFibGUoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5yZXN1bHRUYWJsZSkgdGhpcy5zdGF0ZS5yZXN1bHRUYWJsZSA9IElubGluZVRhYmxlKClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbE5vdyh0aGlzLnBhcnNlQXNzaWduLCB0aGlzLnJlY29yZElubGluZVRhYmxlVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICAgIHJlY29yZElubGluZVRhYmxlVmFsdWUgKGt2KSB7XG4gICAgICBsZXQgdGFyZ2V0ID0gdGhpcy5zdGF0ZS5yZXN1bHRUYWJsZVxuICAgICAgbGV0IGZpbmFsS2V5ID0ga3Yua2V5LnBvcCgpXG4gICAgICBmb3IgKGxldCBrdyBvZiBrdi5rZXkpIHtcbiAgICAgICAgaWYgKGhhc0tleSh0YXJnZXQsIGt3KSAmJiAoIWlzVGFibGUodGFyZ2V0W2t3XSkgfHwgdGFyZ2V0W2t3XVtfZGVjbGFyZWRdKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRba3ddID0gdGFyZ2V0W2t3XSB8fCBUYWJsZSgpXG4gICAgICB9XG4gICAgICBpZiAoaGFzS2V5KHRhcmdldCwgZmluYWxLZXkpKSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcihcIkNhbid0IHJlZGVmaW5lIGV4aXN0aW5nIGtleVwiKSlcbiAgICAgIH1cbiAgICAgIGlmIChpc0ludGVnZXIoa3YudmFsdWUpIHx8IGlzRmxvYXQoa3YudmFsdWUpKSB7XG4gICAgICAgIHRhcmdldFtmaW5hbEtleV0gPSBrdi52YWx1ZS52YWx1ZU9mKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtmaW5hbEtleV0gPSBrdi52YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ290byh0aGlzLnBhcnNlSW5saW5lVGFibGVOZXh0KVxuICAgIH1cbiAgICBwYXJzZUlubGluZVRhYmxlTmV4dCAoKSB7XG4gICAgICBpZiAodGhpcy5jaGFyID09PSBDSEFSX1NQIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9JKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gUGFyc2VyLkVORCB8fCB0aGlzLmNoYXIgPT09IENIQVJfTlVNIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9KIHx8IHRoaXMuY2hhciA9PT0gQ1RSTF9NKSB7XG4gICAgICAgIHRocm93IHRoaXMuZXJyb3IobmV3IFRvbWxFcnJvcignVW50ZXJtaW5hdGVkIGlubGluZSBhcnJheScpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIgPT09IENIQVJfQ09NTUEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCh0aGlzLnBhcnNlSW5saW5lVGFibGUpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2hhciA9PT0gQ0hBUl9SQ1VCKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdvdG8odGhpcy5wYXJzZUlubGluZVRhYmxlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5lcnJvcihuZXcgVG9tbEVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciwgZXhwZWN0ZWQgd2hpdGVzcGFjZSwgY29tbWEgKCwpIG9yIGNsb3NlIGJyYWNrZXQgKF0pJykpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBUT01MUGFyc2VyXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IHByZXR0eUVycm9yXG5cbmZ1bmN0aW9uIHByZXR0eUVycm9yIChlcnIsIGJ1Zikge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGVyci5wb3MgPT0gbnVsbCB8fCBlcnIubGluZSA9PSBudWxsKSByZXR1cm4gZXJyXG4gIGxldCBtc2cgPSBlcnIubWVzc2FnZVxuICBtc2cgKz0gYCBhdCByb3cgJHtlcnIubGluZSArIDF9LCBjb2wgJHtlcnIuY29sICsgMX0sIHBvcyAke2Vyci5wb3N9OlxcbmBcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoYnVmICYmIGJ1Zi5zcGxpdCkge1xuICAgIGNvbnN0IGxpbmVzID0gYnVmLnNwbGl0KC9cXG4vKVxuICAgIGNvbnN0IGxpbmVOdW1XaWR0aCA9IFN0cmluZyhNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGVyci5saW5lICsgMykpLmxlbmd0aFxuICAgIGxldCBsaW5lUGFkZGluZyA9ICcgJ1xuICAgIHdoaWxlIChsaW5lUGFkZGluZy5sZW5ndGggPCBsaW5lTnVtV2lkdGgpIGxpbmVQYWRkaW5nICs9ICcgJ1xuICAgIGZvciAobGV0IGlpID0gTWF0aC5tYXgoMCwgZXJyLmxpbmUgLSAxKTsgaWkgPCBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGVyci5saW5lICsgMik7ICsraWkpIHtcbiAgICAgIGxldCBsaW5lTnVtID0gU3RyaW5nKGlpICsgMSlcbiAgICAgIGlmIChsaW5lTnVtLmxlbmd0aCA8IGxpbmVOdW1XaWR0aCkgbGluZU51bSA9ICcgJyArIGxpbmVOdW1cbiAgICAgIGlmIChlcnIubGluZSA9PT0gaWkpIHtcbiAgICAgICAgbXNnICs9IGxpbmVOdW0gKyAnPiAnICsgbGluZXNbaWldICsgJ1xcbidcbiAgICAgICAgbXNnICs9IGxpbmVQYWRkaW5nICsgJyAgJ1xuICAgICAgICBmb3IgKGxldCBoaCA9IDA7IGhoIDwgZXJyLmNvbDsgKytoaCkge1xuICAgICAgICAgIG1zZyArPSAnICdcbiAgICAgICAgfVxuICAgICAgICBtc2cgKz0gJ15cXG4nXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtc2cgKz0gbGluZU51bSArICc6ICcgKyBsaW5lc1tpaV0gKyAnXFxuJ1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBlcnIubWVzc2FnZSA9IG1zZyArICdcXG4nXG4gIHJldHVybiBlcnJcbn1cbiIsICIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VTdHJpbmdcblxuY29uc3QgVE9NTFBhcnNlciA9IHJlcXVpcmUoJy4vbGliL3RvbWwtcGFyc2VyLmpzJylcbmNvbnN0IHByZXR0eUVycm9yID0gcmVxdWlyZSgnLi9wYXJzZS1wcmV0dHktZXJyb3IuanMnKVxuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyAoc3RyKSB7XG4gIGlmIChnbG9iYWwuQnVmZmVyICYmIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIoc3RyKSkge1xuICAgIHN0ciA9IHN0ci50b1N0cmluZygndXRmOCcpXG4gIH1cbiAgY29uc3QgcGFyc2VyID0gbmV3IFRPTUxQYXJzZXIoKVxuICB0cnkge1xuICAgIHBhcnNlci5wYXJzZShzdHIpXG4gICAgcmV0dXJuIHBhcnNlci5maW5pc2goKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBwcmV0dHlFcnJvcihlcnIsIHN0cilcbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUFzeW5jXG5cbmNvbnN0IFRPTUxQYXJzZXIgPSByZXF1aXJlKCcuL2xpYi90b21sLXBhcnNlci5qcycpXG5jb25zdCBwcmV0dHlFcnJvciA9IHJlcXVpcmUoJy4vcGFyc2UtcHJldHR5LWVycm9yLmpzJylcblxuZnVuY3Rpb24gcGFyc2VBc3luYyAoc3RyLCBvcHRzKSB7XG4gIGlmICghb3B0cykgb3B0cyA9IHt9XG4gIGNvbnN0IGluZGV4ID0gMFxuICBjb25zdCBibG9ja3NpemUgPSBvcHRzLmJsb2Nrc2l6ZSB8fCA0MDk2MFxuICBjb25zdCBwYXJzZXIgPSBuZXcgVE9NTFBhcnNlcigpXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc2V0SW1tZWRpYXRlKHBhcnNlQXN5bmNOZXh0LCBpbmRleCwgYmxvY2tzaXplLCByZXNvbHZlLCByZWplY3QpXG4gIH0pXG4gIGZ1bmN0aW9uIHBhcnNlQXN5bmNOZXh0IChpbmRleCwgYmxvY2tzaXplLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAoaW5kZXggPj0gc3RyLmxlbmd0aCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUocGFyc2VyLmZpbmlzaCgpKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiByZWplY3QocHJldHR5RXJyb3IoZXJyLCBzdHIpKVxuICAgICAgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgcGFyc2VyLnBhcnNlKHN0ci5zbGljZShpbmRleCwgaW5kZXggKyBibG9ja3NpemUpKVxuICAgICAgc2V0SW1tZWRpYXRlKHBhcnNlQXN5bmNOZXh0LCBpbmRleCArIGJsb2Nrc2l6ZSwgYmxvY2tzaXplLCByZXNvbHZlLCByZWplY3QpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWplY3QocHJldHR5RXJyb3IoZXJyLCBzdHIpKVxuICAgIH1cbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZVN0cmVhbVxuXG5jb25zdCBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKVxuY29uc3QgVE9NTFBhcnNlciA9IHJlcXVpcmUoJy4vbGliL3RvbWwtcGFyc2VyLmpzJylcblxuZnVuY3Rpb24gcGFyc2VTdHJlYW0gKHN0bSkge1xuICBpZiAoc3RtKSB7XG4gICAgcmV0dXJuIHBhcnNlUmVhZGFibGUoc3RtKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBwYXJzZVRyYW5zZm9ybShzdG0pXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VSZWFkYWJsZSAoc3RtKSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUT01MUGFyc2VyKClcbiAgc3RtLnNldEVuY29kaW5nKCd1dGY4JylcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgcmVhZGFibGVcbiAgICBsZXQgZW5kZWQgPSBmYWxzZVxuICAgIGxldCBlcnJvcmVkID0gZmFsc2VcbiAgICBmdW5jdGlvbiBmaW5pc2ggKCkge1xuICAgICAgZW5kZWQgPSB0cnVlXG4gICAgICBpZiAocmVhZGFibGUpIHJldHVyblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZShwYXJzZXIuZmluaXNoKCkpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZXJyb3IgKGVycikge1xuICAgICAgZXJyb3JlZCA9IHRydWVcbiAgICAgIHJlamVjdChlcnIpXG4gICAgfVxuICAgIHN0bS5vbmNlKCdlbmQnLCBmaW5pc2gpXG4gICAgc3RtLm9uY2UoJ2Vycm9yJywgZXJyb3IpXG4gICAgcmVhZE5leHQoKVxuXG4gICAgZnVuY3Rpb24gcmVhZE5leHQgKCkge1xuICAgICAgcmVhZGFibGUgPSB0cnVlXG4gICAgICBsZXQgZGF0YVxuICAgICAgd2hpbGUgKChkYXRhID0gc3RtLnJlYWQoKSkgIT09IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwYXJzZXIucGFyc2UoZGF0YSlcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yKGVycilcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVhZGFibGUgPSBmYWxzZVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoZW5kZWQpIHJldHVybiBmaW5pc2goKVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoZXJyb3JlZCkgcmV0dXJuXG4gICAgICBzdG0ub25jZSgncmVhZGFibGUnLCByZWFkTmV4dClcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtICgpIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRPTUxQYXJzZXIoKVxuICByZXR1cm4gbmV3IHN0cmVhbS5UcmFuc2Zvcm0oe1xuICAgIG9iamVjdE1vZGU6IHRydWUsXG4gICAgdHJhbnNmb3JtIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwYXJzZXIucGFyc2UoY2h1bmsudG9TdHJpbmcoZW5jb2RpbmcpKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICB9XG4gICAgICBjYigpXG4gICAgfSxcbiAgICBmbHVzaCAoY2IpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMucHVzaChwYXJzZXIuZmluaXNoKCkpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIH1cbiAgICAgIGNiKClcbiAgICB9XG4gIH0pXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vcGFyc2Utc3RyaW5nLmpzJylcbm1vZHVsZS5leHBvcnRzLmFzeW5jID0gcmVxdWlyZSgnLi9wYXJzZS1hc3luYy5qcycpXG5tb2R1bGUuZXhwb3J0cy5zdHJlYW0gPSByZXF1aXJlKCcuL3BhcnNlLXN0cmVhbS5qcycpXG5tb2R1bGUuZXhwb3J0cy5wcmV0dHlFcnJvciA9IHJlcXVpcmUoJy4vcGFyc2UtcHJldHR5LWVycm9yLmpzJylcbiIsICIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0gc3RyaW5naWZ5XG5tb2R1bGUuZXhwb3J0cy52YWx1ZSA9IHN0cmluZ2lmeUlubGluZVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkgKG9iaikge1xuICBpZiAob2JqID09PSBudWxsKSB0aHJvdyB0eXBlRXJyb3IoJ251bGwnKVxuICBpZiAob2JqID09PSB2b2lkICgwKSkgdGhyb3cgdHlwZUVycm9yKCd1bmRlZmluZWQnKVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHRocm93IHR5cGVFcnJvcih0eXBlb2Ygb2JqKVxuXG4gIGlmICh0eXBlb2Ygb2JqLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykgb2JqID0gb2JqLnRvSlNPTigpXG4gIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIG51bGxcbiAgY29uc3QgdHlwZSA9IHRvbWxUeXBlKG9iailcbiAgaWYgKHR5cGUgIT09ICd0YWJsZScpIHRocm93IHR5cGVFcnJvcih0eXBlKVxuICByZXR1cm4gc3RyaW5naWZ5T2JqZWN0KCcnLCAnJywgb2JqKVxufVxuXG5mdW5jdGlvbiB0eXBlRXJyb3IgKHR5cGUpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQ2FuIG9ubHkgc3RyaW5naWZ5IG9iamVjdHMsIG5vdCAnICsgdHlwZSlcbn1cblxuZnVuY3Rpb24gYXJyYXlPbmVUeXBlRXJyb3IgKCkge1xuICByZXR1cm4gbmV3IEVycm9yKFwiQXJyYXkgdmFsdWVzIGNhbid0IGhhdmUgbWl4ZWQgdHlwZXNcIilcbn1cblxuZnVuY3Rpb24gZ2V0SW5saW5lS2V5cyAob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmZpbHRlcihrZXkgPT4gaXNJbmxpbmUob2JqW2tleV0pKVxufVxuZnVuY3Rpb24gZ2V0Q29tcGxleEtleXMgKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5maWx0ZXIoa2V5ID0+ICFpc0lubGluZShvYmpba2V5XSkpXG59XG5cbmZ1bmN0aW9uIHRvSlNPTiAob2JqKSB7XG4gIGxldCBub2JqID0gQXJyYXkuaXNBcnJheShvYmopID8gW10gOiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCAnX19wcm90b19fJykgPyB7WydfX3Byb3RvX18nXTogdW5kZWZpbmVkfSA6IHt9XG4gIGZvciAobGV0IHByb3Agb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgIGlmIChvYmpbcHJvcF0gJiYgdHlwZW9mIG9ialtwcm9wXS50b0pTT04gPT09ICdmdW5jdGlvbicgJiYgISgndG9JU09TdHJpbmcnIGluIG9ialtwcm9wXSkpIHtcbiAgICAgIG5vYmpbcHJvcF0gPSBvYmpbcHJvcF0udG9KU09OKClcbiAgICB9IGVsc2Uge1xuICAgICAgbm9ialtwcm9wXSA9IG9ialtwcm9wXVxuICAgIH1cbiAgfVxuICByZXR1cm4gbm9ialxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlPYmplY3QgKHByZWZpeCwgaW5kZW50LCBvYmopIHtcbiAgb2JqID0gdG9KU09OKG9iailcbiAgdmFyIGlubGluZUtleXNcbiAgdmFyIGNvbXBsZXhLZXlzXG4gIGlubGluZUtleXMgPSBnZXRJbmxpbmVLZXlzKG9iailcbiAgY29tcGxleEtleXMgPSBnZXRDb21wbGV4S2V5cyhvYmopXG4gIHZhciByZXN1bHQgPSBbXVxuICB2YXIgaW5saW5lSW5kZW50ID0gaW5kZW50IHx8ICcnXG4gIGlubGluZUtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIHZhciB0eXBlID0gdG9tbFR5cGUob2JqW2tleV0pXG4gICAgaWYgKHR5cGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGUgIT09ICdudWxsJykge1xuICAgICAgcmVzdWx0LnB1c2goaW5saW5lSW5kZW50ICsgc3RyaW5naWZ5S2V5KGtleSkgKyAnID0gJyArIHN0cmluZ2lmeUFueUlubGluZShvYmpba2V5XSwgdHJ1ZSkpXG4gICAgfVxuICB9KVxuICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHJlc3VsdC5wdXNoKCcnKVxuICB2YXIgY29tcGxleEluZGVudCA9IHByZWZpeCAmJiBpbmxpbmVLZXlzLmxlbmd0aCA+IDAgPyBpbmRlbnQgKyAnICAnIDogJydcbiAgY29tcGxleEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIHJlc3VsdC5wdXNoKHN0cmluZ2lmeUNvbXBsZXgocHJlZml4LCBjb21wbGV4SW5kZW50LCBrZXksIG9ialtrZXldKSlcbiAgfSlcbiAgcmV0dXJuIHJlc3VsdC5qb2luKCdcXG4nKVxufVxuXG5mdW5jdGlvbiBpc0lubGluZSAodmFsdWUpIHtcbiAgc3dpdGNoICh0b21sVHlwZSh2YWx1ZSkpIHtcbiAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgIGNhc2UgJ251bGwnOlxuICAgIGNhc2UgJ2ludGVnZXInOlxuICAgIGNhc2UgJ25hbic6XG4gICAgY2FzZSAnZmxvYXQnOlxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgY2FzZSAnZGF0ZXRpbWUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBjYXNlICdhcnJheSc6XG4gICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID09PSAwIHx8IHRvbWxUeXBlKHZhbHVlWzBdKSAhPT0gJ3RhYmxlJ1xuICAgIGNhc2UgJ3RhYmxlJzpcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09PSAwXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gdG9tbFR5cGUgKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICd1bmRlZmluZWQnXG4gIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnXG4gIC8qIGVzbGludC1kaXNhYmxlIHZhbGlkLXR5cGVvZiAqL1xuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2JpZ2ludCcgfHwgKE51bWJlci5pc0ludGVnZXIodmFsdWUpICYmICFPYmplY3QuaXModmFsdWUsIC0wKSkpIHtcbiAgICByZXR1cm4gJ2ludGVnZXInXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiAnZmxvYXQnXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gJ2Jvb2xlYW4nXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiAnc3RyaW5nJ1xuICB9IGVsc2UgaWYgKCd0b0lTT1N0cmluZycgaW4gdmFsdWUpIHtcbiAgICByZXR1cm4gaXNOYU4odmFsdWUpID8gJ3VuZGVmaW5lZCcgOiAnZGF0ZXRpbWUnXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gJ2FycmF5J1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAndGFibGUnXG4gIH1cbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5S2V5IChrZXkpIHtcbiAgdmFyIGtleVN0ciA9IFN0cmluZyhrZXkpXG4gIGlmICgvXlstQS1aYS16MC05X10rJC8udGVzdChrZXlTdHIpKSB7XG4gICAgcmV0dXJuIGtleVN0clxuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHJpbmdpZnlCYXNpY1N0cmluZyhrZXlTdHIpXG4gIH1cbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5QmFzaWNTdHJpbmcgKHN0cikge1xuICByZXR1cm4gJ1wiJyArIGVzY2FwZVN0cmluZyhzdHIpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIidcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5TGl0ZXJhbFN0cmluZyAoc3RyKSB7XG4gIHJldHVybiBcIidcIiArIHN0ciArIFwiJ1wiXG59XG5cbmZ1bmN0aW9uIG51bXBhZCAobnVtLCBzdHIpIHtcbiAgd2hpbGUgKHN0ci5sZW5ndGggPCBudW0pIHN0ciA9ICcwJyArIHN0clxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIGVzY2FwZVN0cmluZyAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKVxuICAgIC5yZXBsYWNlKC9bXFxiXS9nLCAnXFxcXGInKVxuICAgIC5yZXBsYWNlKC9cXHQvZywgJ1xcXFx0JylcbiAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG4gICAgLnJlcGxhY2UoL1xcZi9nLCAnXFxcXGYnKVxuICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJylcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb250cm9sLXJlZ2V4ICovXG4gICAgLnJlcGxhY2UoLyhbXFx1MDAwMC1cXHUwMDFmXFx1MDA3Zl0pLywgYyA9PiAnXFxcXHUnICsgbnVtcGFkKDQsIGMuY29kZVBvaW50QXQoMCkudG9TdHJpbmcoMTYpKSlcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnRyb2wtcmVnZXggKi9cbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5TXVsdGlsaW5lU3RyaW5nIChzdHIpIHtcbiAgbGV0IGVzY2FwZWQgPSBzdHIuc3BsaXQoL1xcbi8pLm1hcChzdHIgPT4ge1xuICAgIHJldHVybiBlc2NhcGVTdHJpbmcoc3RyKS5yZXBsYWNlKC9cIig/PVwiXCIpL2csICdcXFxcXCInKVxuICB9KS5qb2luKCdcXG4nKVxuICBpZiAoZXNjYXBlZC5zbGljZSgtMSkgPT09ICdcIicpIGVzY2FwZWQgKz0gJ1xcXFxcXG4nXG4gIHJldHVybiAnXCJcIlwiXFxuJyArIGVzY2FwZWQgKyAnXCJcIlwiJ1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlBbnlJbmxpbmUgKHZhbHVlLCBtdWx0aWxpbmVPaykge1xuICBsZXQgdHlwZSA9IHRvbWxUeXBlKHZhbHVlKVxuICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAobXVsdGlsaW5lT2sgJiYgL1xcbi8udGVzdCh2YWx1ZSkpIHtcbiAgICAgIHR5cGUgPSAnc3RyaW5nLW11bHRpbGluZSdcbiAgICB9IGVsc2UgaWYgKCEvW1xcYlxcdFxcblxcZlxcciddLy50ZXN0KHZhbHVlKSAmJiAvXCIvLnRlc3QodmFsdWUpKSB7XG4gICAgICB0eXBlID0gJ3N0cmluZy1saXRlcmFsJ1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyaW5naWZ5SW5saW5lKHZhbHVlLCB0eXBlKVxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlJbmxpbmUgKHZhbHVlLCB0eXBlKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoIXR5cGUpIHR5cGUgPSB0b21sVHlwZSh2YWx1ZSlcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nLW11bHRpbGluZSc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5TXVsdGlsaW5lU3RyaW5nKHZhbHVlKVxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5QmFzaWNTdHJpbmcodmFsdWUpXG4gICAgY2FzZSAnc3RyaW5nLWxpdGVyYWwnOlxuICAgICAgcmV0dXJuIHN0cmluZ2lmeUxpdGVyYWxTdHJpbmcodmFsdWUpXG4gICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5SW50ZWdlcih2YWx1ZSlcbiAgICBjYXNlICdmbG9hdCc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5RmxvYXQodmFsdWUpXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5Qm9vbGVhbih2YWx1ZSlcbiAgICBjYXNlICdkYXRldGltZSc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5RGF0ZXRpbWUodmFsdWUpXG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIHN0cmluZ2lmeUlubGluZUFycmF5KHZhbHVlLmZpbHRlcihfID0+IHRvbWxUeXBlKF8pICE9PSAnbnVsbCcgJiYgdG9tbFR5cGUoXykgIT09ICd1bmRlZmluZWQnICYmIHRvbWxUeXBlKF8pICE9PSAnbmFuJykpXG4gICAgY2FzZSAndGFibGUnOlxuICAgICAgcmV0dXJuIHN0cmluZ2lmeUlubGluZVRhYmxlKHZhbHVlKVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IHR5cGVFcnJvcih0eXBlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUludGVnZXIgKHZhbHVlKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIHNlY3VyaXR5L2RldGVjdC11bnNhZmUtcmVnZXggKi9cbiAgcmV0dXJuIFN0cmluZyh2YWx1ZSkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJ18nKVxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlGbG9hdCAodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIHJldHVybiAnaW5mJ1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAtSW5maW5pdHkpIHtcbiAgICByZXR1cm4gJy1pbmYnXG4gIH0gZWxzZSBpZiAoT2JqZWN0LmlzKHZhbHVlLCBOYU4pKSB7XG4gICAgcmV0dXJuICduYW4nXG4gIH0gZWxzZSBpZiAoT2JqZWN0LmlzKHZhbHVlLCAtMCkpIHtcbiAgICByZXR1cm4gJy0wLjAnXG4gIH1cbiAgdmFyIGNodW5rcyA9IFN0cmluZyh2YWx1ZSkuc3BsaXQoJy4nKVxuICB2YXIgaW50ID0gY2h1bmtzWzBdXG4gIHZhciBkZWMgPSBjaHVua3NbMV0gfHwgMFxuICByZXR1cm4gc3RyaW5naWZ5SW50ZWdlcihpbnQpICsgJy4nICsgZGVjXG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUJvb2xlYW4gKHZhbHVlKSB7XG4gIHJldHVybiBTdHJpbmcodmFsdWUpXG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeURhdGV0aW1lICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUudG9JU09TdHJpbmcoKVxufVxuXG5mdW5jdGlvbiBpc051bWJlciAodHlwZSkge1xuICByZXR1cm4gdHlwZSA9PT0gJ2Zsb2F0JyB8fCB0eXBlID09PSAnaW50ZWdlcidcbn1cbmZ1bmN0aW9uIGFycmF5VHlwZSAodmFsdWVzKSB7XG4gIHZhciBjb250ZW50VHlwZSA9IHRvbWxUeXBlKHZhbHVlc1swXSlcbiAgaWYgKHZhbHVlcy5ldmVyeShfID0+IHRvbWxUeXBlKF8pID09PSBjb250ZW50VHlwZSkpIHJldHVybiBjb250ZW50VHlwZVxuICAvLyBtaXhlZCBpbnRlZ2VyL2Zsb2F0LCBlbWl0IGFzIGZsb2F0c1xuICBpZiAodmFsdWVzLmV2ZXJ5KF8gPT4gaXNOdW1iZXIodG9tbFR5cGUoXykpKSkgcmV0dXJuICdmbG9hdCdcbiAgcmV0dXJuICdtaXhlZCdcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlQXJyYXkgKHZhbHVlcykge1xuICBjb25zdCB0eXBlID0gYXJyYXlUeXBlKHZhbHVlcylcbiAgaWYgKHR5cGUgPT09ICdtaXhlZCcpIHtcbiAgICB0aHJvdyBhcnJheU9uZVR5cGVFcnJvcigpXG4gIH1cbiAgcmV0dXJuIHR5cGVcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5SW5saW5lQXJyYXkgKHZhbHVlcykge1xuICB2YWx1ZXMgPSB0b0pTT04odmFsdWVzKVxuICBjb25zdCB0eXBlID0gdmFsaWRhdGVBcnJheSh2YWx1ZXMpXG4gIHZhciByZXN1bHQgPSAnWydcbiAgdmFyIHN0cmluZ2lmaWVkID0gdmFsdWVzLm1hcChfID0+IHN0cmluZ2lmeUlubGluZShfLCB0eXBlKSlcbiAgaWYgKHN0cmluZ2lmaWVkLmpvaW4oJywgJykubGVuZ3RoID4gNjAgfHwgL1xcbi8udGVzdChzdHJpbmdpZmllZCkpIHtcbiAgICByZXN1bHQgKz0gJ1xcbiAgJyArIHN0cmluZ2lmaWVkLmpvaW4oJyxcXG4gICcpICsgJ1xcbidcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgKz0gJyAnICsgc3RyaW5naWZpZWQuam9pbignLCAnKSArIChzdHJpbmdpZmllZC5sZW5ndGggPiAwID8gJyAnIDogJycpXG4gIH1cbiAgcmV0dXJuIHJlc3VsdCArICddJ1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlJbmxpbmVUYWJsZSAodmFsdWUpIHtcbiAgdmFsdWUgPSB0b0pTT04odmFsdWUpXG4gIHZhciByZXN1bHQgPSBbXVxuICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgIHJlc3VsdC5wdXNoKHN0cmluZ2lmeUtleShrZXkpICsgJyA9ICcgKyBzdHJpbmdpZnlBbnlJbmxpbmUodmFsdWVba2V5XSwgZmFsc2UpKVxuICB9KVxuICByZXR1cm4gJ3sgJyArIHJlc3VsdC5qb2luKCcsICcpICsgKHJlc3VsdC5sZW5ndGggPiAwID8gJyAnIDogJycpICsgJ30nXG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUNvbXBsZXggKHByZWZpeCwgaW5kZW50LCBrZXksIHZhbHVlKSB7XG4gIHZhciB2YWx1ZVR5cGUgPSB0b21sVHlwZSh2YWx1ZSlcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKHZhbHVlVHlwZSA9PT0gJ2FycmF5Jykge1xuICAgIHJldHVybiBzdHJpbmdpZnlBcnJheU9mVGFibGVzKHByZWZpeCwgaW5kZW50LCBrZXksIHZhbHVlKVxuICB9IGVsc2UgaWYgKHZhbHVlVHlwZSA9PT0gJ3RhYmxlJykge1xuICAgIHJldHVybiBzdHJpbmdpZnlDb21wbGV4VGFibGUocHJlZml4LCBpbmRlbnQsIGtleSwgdmFsdWUpXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgdHlwZUVycm9yKHZhbHVlVHlwZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlBcnJheU9mVGFibGVzIChwcmVmaXgsIGluZGVudCwga2V5LCB2YWx1ZXMpIHtcbiAgdmFsdWVzID0gdG9KU09OKHZhbHVlcylcbiAgdmFsaWRhdGVBcnJheSh2YWx1ZXMpXG4gIHZhciBmaXJzdFZhbHVlVHlwZSA9IHRvbWxUeXBlKHZhbHVlc1swXSlcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChmaXJzdFZhbHVlVHlwZSAhPT0gJ3RhYmxlJykgdGhyb3cgdHlwZUVycm9yKGZpcnN0VmFsdWVUeXBlKVxuICB2YXIgZnVsbEtleSA9IHByZWZpeCArIHN0cmluZ2lmeUtleShrZXkpXG4gIHZhciByZXN1bHQgPSAnJ1xuICB2YWx1ZXMuZm9yRWFjaCh0YWJsZSA9PiB7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSByZXN1bHQgKz0gJ1xcbidcbiAgICByZXN1bHQgKz0gaW5kZW50ICsgJ1tbJyArIGZ1bGxLZXkgKyAnXV1cXG4nXG4gICAgcmVzdWx0ICs9IHN0cmluZ2lmeU9iamVjdChmdWxsS2V5ICsgJy4nLCBpbmRlbnQsIHRhYmxlKVxuICB9KVxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUNvbXBsZXhUYWJsZSAocHJlZml4LCBpbmRlbnQsIGtleSwgdmFsdWUpIHtcbiAgdmFyIGZ1bGxLZXkgPSBwcmVmaXggKyBzdHJpbmdpZnlLZXkoa2V5KVxuICB2YXIgcmVzdWx0ID0gJydcbiAgaWYgKGdldElubGluZUtleXModmFsdWUpLmxlbmd0aCA+IDApIHtcbiAgICByZXN1bHQgKz0gaW5kZW50ICsgJ1snICsgZnVsbEtleSArICddXFxuJ1xuICB9XG4gIHJldHVybiByZXN1bHQgKyBzdHJpbmdpZnlPYmplY3QoZnVsbEtleSArICcuJywgaW5kZW50LCB2YWx1ZSlcbn1cbiIsICIndXNlIHN0cmljdCdcbmV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlLmpzJylcbmV4cG9ydHMuc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9zdHJpbmdpZnkuanMnKVxuIiwgIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50YWlsUmVjID0gdm9pZCAwO1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gdGFpbFJlYyhhLCBmKSB7XG4gICAgdmFyIHYgPSBmKGEpO1xuICAgIHdoaWxlICh2Ll90YWcgPT09ICdMZWZ0Jykge1xuICAgICAgICB2ID0gZih2LmxlZnQpO1xuICAgIH1cbiAgICByZXR1cm4gdi5yaWdodDtcbn1cbmV4cG9ydHMudGFpbFJlYyA9IHRhaWxSZWM7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJpbmRUb18gPSBleHBvcnRzLmJpbmRfID0gZXhwb3J0cy5ob2xlID0gZXhwb3J0cy5waXBlID0gZXhwb3J0cy51bnR1cGxlZCA9IGV4cG9ydHMudHVwbGVkID0gZXhwb3J0cy5hYnN1cmQgPSBleHBvcnRzLmRlY3JlbWVudCA9IGV4cG9ydHMuaW5jcmVtZW50ID0gZXhwb3J0cy50dXBsZSA9IGV4cG9ydHMuZmxvdyA9IGV4cG9ydHMuZmxpcCA9IGV4cG9ydHMuY29uc3RWb2lkID0gZXhwb3J0cy5jb25zdFVuZGVmaW5lZCA9IGV4cG9ydHMuY29uc3ROdWxsID0gZXhwb3J0cy5jb25zdEZhbHNlID0gZXhwb3J0cy5jb25zdFRydWUgPSBleHBvcnRzLmNvbnN0YW50ID0gZXhwb3J0cy5ub3QgPSBleHBvcnRzLnVuc2FmZUNvZXJjZSA9IGV4cG9ydHMuaWRlbnRpdHkgPSB2b2lkIDA7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBpZGVudGl0eShhKSB7XG4gICAgcmV0dXJuIGE7XG59XG5leHBvcnRzLmlkZW50aXR5ID0gaWRlbnRpdHk7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLnVuc2FmZUNvZXJjZSA9IGlkZW50aXR5O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gbm90KHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gIXByZWRpY2F0ZShhKTsgfTtcbn1cbmV4cG9ydHMubm90ID0gbm90O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQoYSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBhOyB9O1xufVxuZXhwb3J0cy5jb25zdGFudCA9IGNvbnN0YW50O1xuLyoqXG4gKiBBIHRodW5rIHRoYXQgcmV0dXJucyBhbHdheXMgYHRydWVgLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmNvbnN0VHJ1ZSA9IFxuLyojX19QVVJFX18qL1xuY29uc3RhbnQodHJ1ZSk7XG4vKipcbiAqIEEgdGh1bmsgdGhhdCByZXR1cm5zIGFsd2F5cyBgZmFsc2VgLlxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmNvbnN0RmFsc2UgPSBcbi8qI19fUFVSRV9fKi9cbmNvbnN0YW50KGZhbHNlKTtcbi8qKlxuICogQSB0aHVuayB0aGF0IHJldHVybnMgYWx3YXlzIGBudWxsYC5cbiAqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZXhwb3J0cy5jb25zdE51bGwgPSBcbi8qI19fUFVSRV9fKi9cbmNvbnN0YW50KG51bGwpO1xuLyoqXG4gKiBBIHRodW5rIHRoYXQgcmV0dXJucyBhbHdheXMgYHVuZGVmaW5lZGAuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuY29uc3RVbmRlZmluZWQgPSBcbi8qI19fUFVSRV9fKi9cbmNvbnN0YW50KHVuZGVmaW5lZCk7XG4vKipcbiAqIEEgdGh1bmsgdGhhdCByZXR1cm5zIGFsd2F5cyBgdm9pZGAuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuY29uc3RWb2lkID0gZXhwb3J0cy5jb25zdFVuZGVmaW5lZDtcbi8vIFRPRE86IHJlbW92ZSBpbiB2M1xuLyoqXG4gKiBGbGlwcyB0aGUgb3JkZXIgb2YgdGhlIGFyZ3VtZW50cyBvZiBhIGZ1bmN0aW9uIG9mIHR3byBhcmd1bWVudHMuXG4gKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGZsaXAoZikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYiwgYSkgeyByZXR1cm4gZihhLCBiKTsgfTtcbn1cbmV4cG9ydHMuZmxpcCA9IGZsaXA7XG5mdW5jdGlvbiBmbG93KGFiLCBiYywgY2QsIGRlLCBlZiwgZmcsIGdoLCBoaSwgaWopIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIGFiO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZnKGVmKGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdoKGZnKGVmKGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSkpKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoaShnaChmZyhlZihkZShjZChiYyhhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlqKGhpKGdoKGZnKGVmKGRlKGNkKGJjKGFiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpKSkpKSkpKTtcbiAgICAgICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybjtcbn1cbmV4cG9ydHMuZmxvdyA9IGZsb3c7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiB0dXBsZSgpIHtcbiAgICB2YXIgdCA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHRbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG59XG5leHBvcnRzLnR1cGxlID0gdHVwbGU7XG4vKipcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBpbmNyZW1lbnQobikge1xuICAgIHJldHVybiBuICsgMTtcbn1cbmV4cG9ydHMuaW5jcmVtZW50ID0gaW5jcmVtZW50O1xuLyoqXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gZGVjcmVtZW50KG4pIHtcbiAgICByZXR1cm4gbiAtIDE7XG59XG5leHBvcnRzLmRlY3JlbWVudCA9IGRlY3JlbWVudDtcbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGFic3VyZChfKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsZWQgYGFic3VyZGAgZnVuY3Rpb24gd2hpY2ggc2hvdWxkIGJlIHVuY2FsbGFibGUnKTtcbn1cbmV4cG9ydHMuYWJzdXJkID0gYWJzdXJkO1xuLyoqXG4gKiBDcmVhdGVzIGEgdHVwbGVkIHZlcnNpb24gb2YgdGhpcyBmdW5jdGlvbjogaW5zdGVhZCBvZiBgbmAgYXJndW1lbnRzLCBpdCBhY2NlcHRzIGEgc2luZ2xlIHR1cGxlIGFyZ3VtZW50LlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyB0dXBsZWQgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBjb25zdCBhZGQgPSB0dXBsZWQoKHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyID0+IHggKyB5KVxuICpcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChhZGQoWzEsIDJdKSwgMylcbiAqXG4gKiBAc2luY2UgMi40LjBcbiAqL1xuZnVuY3Rpb24gdHVwbGVkKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGYuYXBwbHkodm9pZCAwLCBhKTsgfTtcbn1cbmV4cG9ydHMudHVwbGVkID0gdHVwbGVkO1xuLyoqXG4gKiBJbnZlcnNlIGZ1bmN0aW9uIG9mIGB0dXBsZWRgXG4gKlxuICogQHNpbmNlIDIuNC4wXG4gKi9cbmZ1bmN0aW9uIHVudHVwbGVkKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYVtfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmKGEpO1xuICAgIH07XG59XG5leHBvcnRzLnVudHVwbGVkID0gdW50dXBsZWQ7XG5mdW5jdGlvbiBwaXBlKGEsIGFiLCBiYywgY2QsIGRlLCBlZiwgZmcsIGdoLCBoaSwgaWosIGprLCBrbCwgbG0sIG1uLCBubywgb3AsIHBxLCBxciwgcnMsIHN0KSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gYWIoYSk7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBiYyhhYihhKSk7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBjZChiYyhhYihhKSkpO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gZGUoY2QoYmMoYWIoYSkpKSk7XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiBlZihkZShjZChiYyhhYihhKSkpKSk7XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiBmZyhlZihkZShjZChiYyhhYihhKSkpKSkpO1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSk7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSk7XG4gICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICByZXR1cm4gaWooaGkoZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgIHJldHVybiBqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgIHJldHVybiBrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSk7XG4gICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICByZXR1cm4gbG0oa2woamsoaWooaGkoZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICAgIHJldHVybiBtbihsbShrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICAgIHJldHVybiBubyhtbihsbShrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSkpKSk7XG4gICAgICAgIGNhc2UgMTY6XG4gICAgICAgICAgICByZXR1cm4gb3Aobm8obW4obG0oa2woamsoaWooaGkoZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxNzpcbiAgICAgICAgICAgIHJldHVybiBwcShvcChubyhtbihsbShrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAxODpcbiAgICAgICAgICAgIHJldHVybiBxcihwcShvcChubyhtbihsbShrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSkpKSkpKSk7XG4gICAgICAgIGNhc2UgMTk6XG4gICAgICAgICAgICByZXR1cm4gcnMocXIocHEob3Aobm8obW4obG0oa2woamsoaWooaGkoZ2goZmcoZWYoZGUoY2QoYmMoYWIoYSkpKSkpKSkpKSkpKSkpKSkpKTtcbiAgICAgICAgY2FzZSAyMDpcbiAgICAgICAgICAgIHJldHVybiBzdChycyhxcihwcShvcChubyhtbihsbShrbChqayhpaihoaShnaChmZyhlZihkZShjZChiYyhhYihhKSkpKSkpKSkpKSkpKSkpKSkpKTtcbiAgICB9XG4gICAgcmV0dXJuO1xufVxuZXhwb3J0cy5waXBlID0gcGlwZTtcbi8qKlxuICogVHlwZSBob2xlIHNpbXVsYXRpb25cbiAqXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0cy5ob2xlID0gYWJzdXJkO1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIGJpbmRfID0gZnVuY3Rpb24gKGEsIG5hbWUsIGIpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGEsIChfYSA9IHt9LCBfYVtuYW1lXSA9IGIsIF9hKSk7XG59O1xuZXhwb3J0cy5iaW5kXyA9IGJpbmRfO1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIGJpbmRUb18gPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gZnVuY3Rpb24gKGIpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIChfYSA9IHt9LCBfYVtuYW1lXSA9IGIsIF9hKTtcbn07IH07XG5leHBvcnRzLmJpbmRUb18gPSBiaW5kVG9fO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRXaXRoZXJhYmxlID0gZXhwb3J0cy5nZXRGaWx0ZXJhYmxlID0gZXhwb3J0cy5nZXRBcHBseU1vbm9pZCA9IGV4cG9ydHMuZ2V0QXBwbHlTZW1pZ3JvdXAgPSBleHBvcnRzLmdldFNlbWlncm91cCA9IGV4cG9ydHMuZ2V0RXEgPSBleHBvcnRzLmdldFNob3cgPSBleHBvcnRzLlVSSSA9IGV4cG9ydHMudGhyb3dFcnJvciA9IGV4cG9ydHMuc2VxdWVuY2UgPSBleHBvcnRzLnRyYXZlcnNlID0gZXhwb3J0cy5yZWR1Y2VSaWdodCA9IGV4cG9ydHMuZm9sZE1hcCA9IGV4cG9ydHMucmVkdWNlID0gZXhwb3J0cy5kdXBsaWNhdGUgPSBleHBvcnRzLmV4dGVuZCA9IGV4cG9ydHMuYWx0ID0gZXhwb3J0cy5hbHRXID0gZXhwb3J0cy5mbGF0dGVuID0gZXhwb3J0cy5jaGFpbkZpcnN0ID0gZXhwb3J0cy5jaGFpbkZpcnN0VyA9IGV4cG9ydHMuY2hhaW4gPSBleHBvcnRzLmNoYWluVyA9IGV4cG9ydHMub2YgPSBleHBvcnRzLmFwU2Vjb25kID0gZXhwb3J0cy5hcEZpcnN0ID0gZXhwb3J0cy5hcCA9IGV4cG9ydHMuYXBXID0gZXhwb3J0cy5tYXBMZWZ0ID0gZXhwb3J0cy5iaW1hcCA9IGV4cG9ydHMubWFwID0gZXhwb3J0cy5maWx0ZXJPckVsc2UgPSBleHBvcnRzLmZpbHRlck9yRWxzZVcgPSBleHBvcnRzLm9yRWxzZSA9IGV4cG9ydHMuc3dhcCA9IGV4cG9ydHMuY2hhaW5OdWxsYWJsZUsgPSBleHBvcnRzLmZyb21OdWxsYWJsZUsgPSBleHBvcnRzLmdldE9yRWxzZSA9IGV4cG9ydHMuZ2V0T3JFbHNlVyA9IGV4cG9ydHMuZm9sZCA9IGV4cG9ydHMuZnJvbVByZWRpY2F0ZSA9IGV4cG9ydHMuZnJvbU9wdGlvbiA9IGV4cG9ydHMuc3RyaW5naWZ5SlNPTiA9IGV4cG9ydHMucGFyc2VKU09OID0gZXhwb3J0cy50cnlDYXRjaCA9IGV4cG9ydHMuZnJvbU51bGxhYmxlID0gZXhwb3J0cy5yaWdodCA9IGV4cG9ydHMubGVmdCA9IGV4cG9ydHMuaXNSaWdodCA9IGV4cG9ydHMuaXNMZWZ0ID0gdm9pZCAwO1xuZXhwb3J0cy5zZXF1ZW5jZUFycmF5ID0gZXhwb3J0cy50cmF2ZXJzZUFycmF5ID0gZXhwb3J0cy50cmF2ZXJzZUFycmF5V2l0aEluZGV4ID0gZXhwb3J0cy5hcFMgPSBleHBvcnRzLmFwU1cgPSBleHBvcnRzLmJpbmQgPSBleHBvcnRzLmJpbmRXID0gZXhwb3J0cy5iaW5kVG8gPSBleHBvcnRzLkRvID0gZXhwb3J0cy5leGlzdHMgPSBleHBvcnRzLmVsZW0gPSBleHBvcnRzLnRvRXJyb3IgPSBleHBvcnRzLmVpdGhlciA9IGV4cG9ydHMuZ2V0VmFsaWRhdGlvbk1vbm9pZCA9IGV4cG9ydHMuTW9uYWRUaHJvdyA9IGV4cG9ydHMuQ2hhaW5SZWMgPSBleHBvcnRzLkV4dGVuZCA9IGV4cG9ydHMuQWx0ID0gZXhwb3J0cy5CaWZ1bmN0b3IgPSBleHBvcnRzLlRyYXZlcnNhYmxlID0gZXhwb3J0cy5Gb2xkYWJsZSA9IGV4cG9ydHMuTW9uYWQgPSBleHBvcnRzLkFwcGxpY2F0aXZlID0gZXhwb3J0cy5GdW5jdG9yID0gZXhwb3J0cy5nZXRWYWxpZGF0aW9uU2VtaWdyb3VwID0gZXhwb3J0cy5nZXRWYWxpZGF0aW9uID0gZXhwb3J0cy5nZXRBbHRWYWxpZGF0aW9uID0gZXhwb3J0cy5nZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb24gPSB2b2lkIDA7XG52YXIgQ2hhaW5SZWNfMSA9IHJlcXVpcmUoXCIuL0NoYWluUmVjXCIpO1xudmFyIGZ1bmN0aW9uXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvblwiKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGd1YXJkc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZWl0aGVyIGlzIGFuIGluc3RhbmNlIG9mIGBMZWZ0YCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKlxuICogQGNhdGVnb3J5IGd1YXJkc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbnZhciBpc0xlZnQgPSBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIG1hLl90YWcgPT09ICdMZWZ0JzsgfTtcbmV4cG9ydHMuaXNMZWZ0ID0gaXNMZWZ0O1xuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZWl0aGVyIGlzIGFuIGluc3RhbmNlIG9mIGBSaWdodGAsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICpcbiAqIEBjYXRlZ29yeSBndWFyZHNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgaXNSaWdodCA9IGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gbWEuX3RhZyA9PT0gJ1JpZ2h0JzsgfTtcbmV4cG9ydHMuaXNSaWdodCA9IGlzUmlnaHQ7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdHJ1Y3RvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgRWl0aGVyYCBob2xkaW5nIGEgYExlZnRgIHZhbHVlLiBUaGlzIHVzdWFsbHkgcmVwcmVzZW50cyBhIGZhaWx1cmUsIGR1ZSB0byB0aGUgcmlnaHQtYmlhcyBvZiB0aGlzXG4gKiBzdHJ1Y3R1cmUuXG4gKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbnZhciBsZWZ0ID0gZnVuY3Rpb24gKGUpIHsgcmV0dXJuICh7IF90YWc6ICdMZWZ0JywgbGVmdDogZSB9KTsgfTtcbmV4cG9ydHMubGVmdCA9IGxlZnQ7XG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlcmAgaG9sZGluZyBhIGBSaWdodGAgdmFsdWUuIFRoaXMgdXN1YWxseSByZXByZXNlbnRzIGEgc3VjY2Vzc2Z1bCB2YWx1ZSBkdWUgdG8gdGhlIHJpZ2h0IGJpYXNcbiAqIG9mIHRoaXMgc3RydWN0dXJlLlxuICpcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgcmlnaHQgPSBmdW5jdGlvbiAoYSkgeyByZXR1cm4gKHsgX3RhZzogJ1JpZ2h0JywgcmlnaHQ6IGEgfSk7IH07XG5leHBvcnRzLnJpZ2h0ID0gcmlnaHQ7XG4vLyBUT0RPOiBtYWtlIGxhenkgaW4gdjNcbi8qKlxuICogVGFrZXMgYSBkZWZhdWx0IGFuZCBhIG51bGxhYmxlIHZhbHVlLCBpZiB0aGUgdmFsdWUgaXMgbm90IG51bGx5LCB0dXJuIGl0IGludG8gYSBgUmlnaHRgLCBpZiB0aGUgdmFsdWUgaXMgbnVsbHkgdXNlXG4gKiB0aGUgcHJvdmlkZWQgZGVmYXVsdCBhcyBhIGBMZWZ0YC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZnJvbU51bGxhYmxlLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBwYXJzZSA9IGZyb21OdWxsYWJsZSgnbnVsbHknKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwocGFyc2UoMSksIHJpZ2h0KDEpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwYXJzZShudWxsKSwgbGVmdCgnbnVsbHknKSlcbiAqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gZnJvbU51bGxhYmxlKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIChhID09IG51bGwgPyBleHBvcnRzLmxlZnQoZSkgOiBleHBvcnRzLnJpZ2h0KGEpKTsgfTtcbn1cbmV4cG9ydHMuZnJvbU51bGxhYmxlID0gZnJvbU51bGxhYmxlO1xuLy8gVE9ETzogYG9uRXJyb3IgPT4gTGF6eTxBPiA9PiBFaXRoZXJgIGluIHYzXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlcmAgZnJvbSBhIGZ1bmN0aW9uIHRoYXQgbWlnaHQgdGhyb3cuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IEVpdGhlciwgbGVmdCwgcmlnaHQsIHRyeUNhdGNoIH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICpcbiAqIGNvbnN0IHVuc2FmZUhlYWQgPSA8QT4oYXM6IEFycmF5PEE+KTogQSA9PiB7XG4gKiAgIGlmIChhcy5sZW5ndGggPiAwKSB7XG4gKiAgICAgcmV0dXJuIGFzWzBdXG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgdGhyb3cgbmV3IEVycm9yKCdlbXB0eSBhcnJheScpXG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBoZWFkID0gPEE+KGFzOiBBcnJheTxBPik6IEVpdGhlcjxFcnJvciwgQT4gPT4ge1xuICogICByZXR1cm4gdHJ5Q2F0Y2goKCkgPT4gdW5zYWZlSGVhZChhcyksIGUgPT4gKGUgaW5zdGFuY2VvZiBFcnJvciA/IGUgOiBuZXcgRXJyb3IoJ3Vua25vd24gZXJyb3InKSkpXG4gKiB9XG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChoZWFkKFtdKSwgbGVmdChuZXcgRXJyb3IoJ2VtcHR5IGFycmF5JykpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChoZWFkKFsxLCAyLCAzXSksIHJpZ2h0KDEpKVxuICpcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiB0cnlDYXRjaChmLCBvbkVycm9yKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMucmlnaHQoZigpKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMubGVmdChvbkVycm9yKGUpKTtcbiAgICB9XG59XG5leHBvcnRzLnRyeUNhdGNoID0gdHJ5Q2F0Y2g7XG4vLyBUT0RPIGN1cnJ5IGluIHYzXG4vKipcbiAqIENvbnZlcnRzIGEgSmF2YVNjcmlwdCBPYmplY3QgTm90YXRpb24gKEpTT04pIHN0cmluZyBpbnRvIGFuIG9iamVjdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgcGFyc2VKU09OLCB0b0Vycm9yLCByaWdodCwgbGVmdCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKHBhcnNlSlNPTigne1wiYVwiOjF9JywgdG9FcnJvciksIHJpZ2h0KHsgYTogMSB9KSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwocGFyc2VKU09OKCd7XCJhXCI6fScsIHRvRXJyb3IpLCBsZWZ0KG5ldyBTeW50YXhFcnJvcignVW5leHBlY3RlZCB0b2tlbiB9IGluIEpTT04gYXQgcG9zaXRpb24gNScpKSlcbiAqXG4gKiBAY2F0ZWdvcnkgY29uc3RydWN0b3JzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gcGFyc2VKU09OKHMsIG9uRXJyb3IpIHtcbiAgICByZXR1cm4gdHJ5Q2F0Y2goZnVuY3Rpb24gKCkgeyByZXR1cm4gSlNPTi5wYXJzZShzKTsgfSwgb25FcnJvcik7XG59XG5leHBvcnRzLnBhcnNlSlNPTiA9IHBhcnNlSlNPTjtcbi8vIFRPRE8gY3VycnkgaW4gdjNcbi8qKlxuICogQ29udmVydHMgYSBKYXZhU2NyaXB0IHZhbHVlIHRvIGEgSmF2YVNjcmlwdCBPYmplY3QgTm90YXRpb24gKEpTT04pIHN0cmluZy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChFLnN0cmluZ2lmeUpTT04oeyBhOiAxIH0sIEUudG9FcnJvciksIEUucmlnaHQoJ3tcImFcIjoxfScpKVxuICogY29uc3QgY2lyY3VsYXI6IGFueSA9IHsgcmVmOiBudWxsIH1cbiAqIGNpcmN1bGFyLnJlZiA9IGNpcmN1bGFyXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIEUuc3RyaW5naWZ5SlNPTihjaXJjdWxhciwgRS50b0Vycm9yKSxcbiAqICAgICBFLm1hcExlZnQoZSA9PiBlLm1lc3NhZ2UuaW5jbHVkZXMoJ0NvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT04nKSlcbiAqICAgKSxcbiAqICAgRS5sZWZ0KHRydWUpXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ2lmeUpTT04odSwgb25FcnJvcikge1xuICAgIHJldHVybiB0cnlDYXRjaChmdW5jdGlvbiAoKSB7IHJldHVybiBKU09OLnN0cmluZ2lmeSh1KTsgfSwgb25FcnJvcik7XG59XG5leHBvcnRzLnN0cmluZ2lmeUpTT04gPSBzdHJpbmdpZnlKU09OO1xuLyoqXG4gKiBEZXJpdmFibGUgZnJvbSBgTW9uYWRUaHJvd2AuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IGZyb21PcHRpb24sIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0IHsgbm9uZSwgc29tZSB9IGZyb20gJ2ZwLXRzL09wdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIHNvbWUoMSksXG4gKiAgICAgZnJvbU9wdGlvbigoKSA9PiAnZXJyb3InKVxuICogICApLFxuICogICByaWdodCgxKVxuICogKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBub25lLFxuICogICAgIGZyb21PcHRpb24oKCkgPT4gJ2Vycm9yJylcbiAqICAgKSxcbiAqICAgbGVmdCgnZXJyb3InKVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBjb25zdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgZnJvbU9wdGlvbiA9IGZ1bmN0aW9uIChvbk5vbmUpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgIHJldHVybiBtYS5fdGFnID09PSAnTm9uZScgPyBleHBvcnRzLmxlZnQob25Ob25lKCkpIDogZXhwb3J0cy5yaWdodChtYS52YWx1ZSk7XG59OyB9O1xuZXhwb3J0cy5mcm9tT3B0aW9uID0gZnJvbU9wdGlvbjtcbi8qKlxuICogRGVyaXZhYmxlIGZyb20gYE1vbmFkVGhyb3dgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBmcm9tUHJlZGljYXRlLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIDEsXG4gKiAgICAgZnJvbVByZWRpY2F0ZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIHJpZ2h0KDEpXG4gKiApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIC0xLFxuICogICAgIGZyb21QcmVkaWNhdGUoXG4gKiAgICAgICAobikgPT4gbiA+IDAsXG4gKiAgICAgICAoKSA9PiAnZXJyb3InXG4gKiAgICAgKVxuICogICApLFxuICogICBsZWZ0KCdlcnJvcicpXG4gKiApXG4gKlxuICogQGNhdGVnb3J5IGNvbnN0cnVjdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbnZhciBmcm9tUHJlZGljYXRlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSwgb25GYWxzZSkgeyByZXR1cm4gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIChwcmVkaWNhdGUoYSkgPyBleHBvcnRzLnJpZ2h0KGEpIDogZXhwb3J0cy5sZWZ0KG9uRmFsc2UoYSkpKTsgfTsgfTtcbmV4cG9ydHMuZnJvbVByZWRpY2F0ZSA9IGZyb21QcmVkaWNhdGU7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBkZXN0cnVjdG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiBUYWtlcyB0d28gZnVuY3Rpb25zIGFuZCBhbiBgRWl0aGVyYCB2YWx1ZSwgaWYgdGhlIHZhbHVlIGlzIGEgYExlZnRgIHRoZSBpbm5lciB2YWx1ZSBpcyBhcHBsaWVkIHRvIHRoZSBmaXJzdCBmdW5jdGlvbixcbiAqIGlmIHRoZSB2YWx1ZSBpcyBhIGBSaWdodGAgdGhlIGlubmVyIHZhbHVlIGlzIGFwcGxpZWQgdG8gdGhlIHNlY29uZCBmdW5jdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZm9sZCwgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKlxuICogZnVuY3Rpb24gb25MZWZ0KGVycm9yczogQXJyYXk8c3RyaW5nPik6IHN0cmluZyB7XG4gKiAgIHJldHVybiBgRXJyb3JzOiAke2Vycm9ycy5qb2luKCcsICcpfWBcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBvblJpZ2h0KHZhbHVlOiBudW1iZXIpOiBzdHJpbmcge1xuICogICByZXR1cm4gYE9rOiAke3ZhbHVlfWBcbiAqIH1cbiAqXG4gKiBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgcmlnaHQoMSksXG4gKiAgICAgZm9sZChvbkxlZnQsIG9uUmlnaHQpXG4gKiAgICksXG4gKiAgICdPazogMSdcbiAqIClcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBsZWZ0KFsnZXJyb3IgMScsICdlcnJvciAyJ10pLFxuICogICAgIGZvbGQob25MZWZ0LCBvblJpZ2h0KVxuICogICApLFxuICogICAnRXJyb3JzOiBlcnJvciAxLCBlcnJvciAyJ1xuICogKVxuICpcbiAqIEBjYXRlZ29yeSBkZXN0cnVjdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGZvbGQob25MZWZ0LCBvblJpZ2h0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KG1hKSA/IG9uTGVmdChtYS5sZWZ0KSA6IG9uUmlnaHQobWEucmlnaHQpKTsgfTtcbn1cbmV4cG9ydHMuZm9sZCA9IGZvbGQ7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BnZXRPckVsc2VgXSgjZ2V0T3JFbHNlKS5cbiAqXG4gKiBAY2F0ZWdvcnkgZGVzdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjYuMFxuICovXG52YXIgZ2V0T3JFbHNlVyA9IGZ1bmN0aW9uIChvbkxlZnQpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChtYSkgPyBvbkxlZnQobWEubGVmdCkgOiBtYS5yaWdodDtcbn07IH07XG5leHBvcnRzLmdldE9yRWxzZVcgPSBnZXRPckVsc2VXO1xuLyoqXG4gKiBSZXR1cm5zIHRoZSB3cmFwcGVkIHZhbHVlIGlmIGl0J3MgYSBgUmlnaHRgIG9yIGEgZGVmYXVsdCB2YWx1ZSBpZiBpcyBhIGBMZWZ0YC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZ2V0T3JFbHNlLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIHJpZ2h0KDEpLFxuICogICAgIGdldE9yRWxzZSgoKSA9PiAwKVxuICogICApLFxuICogICAxXG4gKiApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKFxuICogICAgIGxlZnQoJ2Vycm9yJyksXG4gKiAgICAgZ2V0T3JFbHNlKCgpID0+IDApXG4gKiAgICksXG4gKiAgIDBcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgZGVzdHJ1Y3RvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmdldE9yRWxzZSA9IGV4cG9ydHMuZ2V0T3JFbHNlVztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbWJpbmF0b3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuOS4wXG4gKi9cbmZ1bmN0aW9uIGZyb21OdWxsYWJsZUsoZSkge1xuICAgIHZhciBmcm9tID0gZnJvbU51bGxhYmxlKGUpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYVtfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmcm9tKGYuYXBwbHkodm9pZCAwLCBhKSk7XG4gICAgfTsgfTtcbn1cbmV4cG9ydHMuZnJvbU51bGxhYmxlSyA9IGZyb21OdWxsYWJsZUs7XG4vKipcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuOS4wXG4gKi9cbmZ1bmN0aW9uIGNoYWluTnVsbGFibGVLKGUpIHtcbiAgICB2YXIgZnJvbSA9IGZyb21OdWxsYWJsZUsoZSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiBleHBvcnRzLmNoYWluKGZyb20oZikpOyB9O1xufVxuZXhwb3J0cy5jaGFpbk51bGxhYmxlSyA9IGNoYWluTnVsbGFibGVLO1xuLyoqXG4gKiBSZXR1cm5zIGEgYFJpZ2h0YCBpZiBpcyBhIGBMZWZ0YCAoYW5kIHZpY2UgdmVyc2EpLlxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIHN3YXAobWEpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5pc0xlZnQobWEpID8gZXhwb3J0cy5yaWdodChtYS5sZWZ0KSA6IGV4cG9ydHMubGVmdChtYS5yaWdodCk7XG59XG5leHBvcnRzLnN3YXAgPSBzd2FwO1xuLyoqXG4gKiBVc2VmdWwgZm9yIHJlY292ZXJpbmcgZnJvbSBlcnJvcnMuXG4gKlxuICogQGNhdGVnb3J5IGNvbWJpbmF0b3JzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gb3JFbHNlKG9uTGVmdCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWEpIHsgcmV0dXJuIChleHBvcnRzLmlzTGVmdChtYSkgPyBvbkxlZnQobWEubGVmdCkgOiBtYSk7IH07XG59XG5leHBvcnRzLm9yRWxzZSA9IG9yRWxzZTtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGZpbHRlck9yRWxzZWBdKCNmaWx0ZXJPckVsc2UpLlxuICpcbiAqIEBzaW5jZSAyLjkuMFxuICovXG52YXIgZmlsdGVyT3JFbHNlVyA9IGZ1bmN0aW9uIChwcmVkaWNhdGUsIG9uRmFsc2UpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jaGFpblcoZnVuY3Rpb24gKGEpIHsgcmV0dXJuIChwcmVkaWNhdGUoYSkgPyBleHBvcnRzLnJpZ2h0KGEpIDogZXhwb3J0cy5sZWZ0KG9uRmFsc2UoYSkpKTsgfSk7XG59O1xuZXhwb3J0cy5maWx0ZXJPckVsc2VXID0gZmlsdGVyT3JFbHNlVztcbi8qKlxuICogRGVyaXZhYmxlIGZyb20gYE1vbmFkVGhyb3dgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBmaWx0ZXJPckVsc2UsIGxlZnQsIHJpZ2h0IH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgcmlnaHQoMSksXG4gKiAgICAgZmlsdGVyT3JFbHNlKFxuICogICAgICAgKG4pID0+IG4gPiAwLFxuICogICAgICAgKCkgPT4gJ2Vycm9yJ1xuICogICAgIClcbiAqICAgKSxcbiAqICAgcmlnaHQoMSlcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgcmlnaHQoLTEpLFxuICogICAgIGZpbHRlck9yRWxzZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIGxlZnQoJ2Vycm9yJylcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgbGVmdCgnYScpLFxuICogICAgIGZpbHRlck9yRWxzZShcbiAqICAgICAgIChuKSA9PiBuID4gMCxcbiAqICAgICAgICgpID0+ICdlcnJvcidcbiAqICAgICApXG4gKiAgICksXG4gKiAgIGxlZnQoJ2EnKVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuZmlsdGVyT3JFbHNlID0gZXhwb3J0cy5maWx0ZXJPckVsc2VXO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gbm9uLXBpcGVhYmxlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIG1hcF8gPSBmdW5jdGlvbiAoZmEsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uXzEucGlwZShmYSwgZXhwb3J0cy5tYXAoZikpOyB9O1xudmFyIGFwXyA9IGZ1bmN0aW9uIChmYWIsIGZhKSB7IHJldHVybiBmdW5jdGlvbl8xLnBpcGUoZmFiLCBleHBvcnRzLmFwKGZhKSk7IH07XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIGNoYWluXyA9IGZ1bmN0aW9uIChtYSwgZikgeyByZXR1cm4gZnVuY3Rpb25fMS5waXBlKG1hLCBleHBvcnRzLmNoYWluKGYpKTsgfTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgcmVkdWNlXyA9IGZ1bmN0aW9uIChmYSwgYiwgZikgeyByZXR1cm4gZnVuY3Rpb25fMS5waXBlKGZhLCBleHBvcnRzLnJlZHVjZShiLCBmKSk7IH07XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIGZvbGRNYXBfID0gZnVuY3Rpb24gKE0pIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSwgZikge1xuICAgIHZhciBmb2xkTWFwTSA9IGV4cG9ydHMuZm9sZE1hcChNKTtcbiAgICByZXR1cm4gZnVuY3Rpb25fMS5waXBlKGZhLCBmb2xkTWFwTShmKSk7XG59OyB9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciByZWR1Y2VSaWdodF8gPSBmdW5jdGlvbiAoZmEsIGIsIGYpIHsgcmV0dXJuIGZ1bmN0aW9uXzEucGlwZShmYSwgZXhwb3J0cy5yZWR1Y2VSaWdodChiLCBmKSk7IH07XG52YXIgdHJhdmVyc2VfID0gZnVuY3Rpb24gKEYpIHtcbiAgICB2YXIgdHJhdmVyc2VGID0gZXhwb3J0cy50cmF2ZXJzZShGKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhLCBmKSB7IHJldHVybiBmdW5jdGlvbl8xLnBpcGUodGEsIHRyYXZlcnNlRihmKSk7IH07XG59O1xudmFyIGJpbWFwXyA9IGZ1bmN0aW9uIChmYSwgZiwgZykgeyByZXR1cm4gZnVuY3Rpb25fMS5waXBlKGZhLCBleHBvcnRzLmJpbWFwKGYsIGcpKTsgfTtcbnZhciBtYXBMZWZ0XyA9IGZ1bmN0aW9uIChmYSwgZikgeyByZXR1cm4gZnVuY3Rpb25fMS5waXBlKGZhLCBleHBvcnRzLm1hcExlZnQoZikpOyB9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciBhbHRfID0gZnVuY3Rpb24gKGZhLCB0aGF0KSB7IHJldHVybiBmdW5jdGlvbl8xLnBpcGUoZmEsIGV4cG9ydHMuYWx0KHRoYXQpKTsgfTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgZXh0ZW5kXyA9IGZ1bmN0aW9uICh3YSwgZikgeyByZXR1cm4gZnVuY3Rpb25fMS5waXBlKHdhLCBleHBvcnRzLmV4dGVuZChmKSk7IH07XG52YXIgY2hhaW5SZWNfID0gZnVuY3Rpb24gKGEsIGYpIHtcbiAgICByZXR1cm4gQ2hhaW5SZWNfMS50YWlsUmVjKGYoYSksIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChlKSA/IGV4cG9ydHMucmlnaHQoZXhwb3J0cy5sZWZ0KGUubGVmdCkpIDogZXhwb3J0cy5pc0xlZnQoZS5yaWdodCkgPyBleHBvcnRzLmxlZnQoZihlLnJpZ2h0LmxlZnQpKSA6IGV4cG9ydHMucmlnaHQoZXhwb3J0cy5yaWdodChlLnJpZ2h0LnJpZ2h0KSk7XG4gICAgfSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcGlwZWFibGVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIGBtYXBgIGNhbiBiZSB1c2VkIHRvIHR1cm4gZnVuY3Rpb25zIGAoYTogQSkgPT4gQmAgaW50byBmdW5jdGlvbnMgYChmYTogRjxBPikgPT4gRjxCPmAgd2hvc2UgYXJndW1lbnQgYW5kIHJldHVybiB0eXBlc1xuICogdXNlIHRoZSB0eXBlIGNvbnN0cnVjdG9yIGBGYCB0byByZXByZXNlbnQgc29tZSBjb21wdXRhdGlvbmFsIGNvbnRleHQuXG4gKlxuICogQGNhdGVnb3J5IEZ1bmN0b3JcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgbWFwID0gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkge1xuICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChmYSkgPyBmYSA6IGV4cG9ydHMucmlnaHQoZihmYS5yaWdodCkpO1xufTsgfTtcbmV4cG9ydHMubWFwID0gbWFwO1xuLyoqXG4gKiBNYXAgYSBwYWlyIG9mIGZ1bmN0aW9ucyBvdmVyIHRoZSB0d28gdHlwZSBhcmd1bWVudHMgb2YgdGhlIGJpZnVuY3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgQmlmdW5jdG9yXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xudmFyIGJpbWFwID0gZnVuY3Rpb24gKGYsIGcpIHsgcmV0dXJuIGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KGZhKSA/IGV4cG9ydHMubGVmdChmKGZhLmxlZnQpKSA6IGV4cG9ydHMucmlnaHQoZyhmYS5yaWdodCkpKTsgfTsgfTtcbmV4cG9ydHMuYmltYXAgPSBiaW1hcDtcbi8qKlxuICogTWFwIGEgZnVuY3Rpb24gb3ZlciB0aGUgZmlyc3QgdHlwZSBhcmd1bWVudCBvZiBhIGJpZnVuY3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgQmlmdW5jdG9yXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xudmFyIG1hcExlZnQgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KGZhKSA/IGV4cG9ydHMubGVmdChmKGZhLmxlZnQpKSA6IGZhO1xufTsgfTtcbmV4cG9ydHMubWFwTGVmdCA9IG1hcExlZnQ7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BhcGBdKCNhcCkuXG4gKlxuICogQGNhdGVnb3J5IEFwcGx5XG4gKiBAc2luY2UgMi44LjBcbiAqL1xudmFyIGFwVyA9IGZ1bmN0aW9uIChmYSkgeyByZXR1cm4gZnVuY3Rpb24gKGZhYikge1xuICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChmYWIpID8gZmFiIDogZXhwb3J0cy5pc0xlZnQoZmEpID8gZmEgOiBleHBvcnRzLnJpZ2h0KGZhYi5yaWdodChmYS5yaWdodCkpO1xufTsgfTtcbmV4cG9ydHMuYXBXID0gYXBXO1xuLyoqXG4gKiBBcHBseSBhIGZ1bmN0aW9uIHRvIGFuIGFyZ3VtZW50IHVuZGVyIGEgdHlwZSBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAY2F0ZWdvcnkgQXBwbHlcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmFwID0gZXhwb3J0cy5hcFc7XG4vKipcbiAqIENvbWJpbmUgdHdvIGVmZmVjdGZ1bCBhY3Rpb25zLCBrZWVwaW5nIG9ubHkgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QuXG4gKlxuICogRGVyaXZhYmxlIGZyb20gYEFwcGx5YC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgYXBGaXJzdCA9IGZ1bmN0aW9uIChmYikge1xuICAgIHJldHVybiBmdW5jdGlvbl8xLmZsb3coZXhwb3J0cy5tYXAoZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGE7IH07IH0pLCBleHBvcnRzLmFwKGZiKSk7XG59O1xuZXhwb3J0cy5hcEZpcnN0ID0gYXBGaXJzdDtcbi8qKlxuICogQ29tYmluZSB0d28gZWZmZWN0ZnVsIGFjdGlvbnMsIGtlZXBpbmcgb25seSB0aGUgcmVzdWx0IG9mIHRoZSBzZWNvbmQuXG4gKlxuICogRGVyaXZhYmxlIGZyb20gYEFwcGx5YC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgYXBTZWNvbmQgPSBmdW5jdGlvbiAoZmIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25fMS5mbG93KGV4cG9ydHMubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBiOyB9OyB9KSwgZXhwb3J0cy5hcChmYikpO1xufTtcbmV4cG9ydHMuYXBTZWNvbmQgPSBhcFNlY29uZDtcbi8qKlxuICogV3JhcCBhIHZhbHVlIGludG8gdGhlIHR5cGUgY29uc3RydWN0b3IuXG4gKlxuICogRXF1aXZhbGVudCB0byBbYHJpZ2h0YF0oI3JpZ2h0KS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgRSBmcm9tICdmcC10cy9FaXRoZXInXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChFLm9mKCdhJyksIEUucmlnaHQoJ2EnKSlcbiAqXG4gKiBAY2F0ZWdvcnkgQXBwbGljYXRpdmVcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnRzLm9mID0gZXhwb3J0cy5yaWdodDtcbi8qKlxuICogTGVzcyBzdHJpY3QgdmVyc2lvbiBvZiBbYGNoYWluYF0oI2NoYWluKS5cbiAqXG4gKiBAY2F0ZWdvcnkgTW9uYWRcbiAqIEBzaW5jZSAyLjYuMFxuICovXG52YXIgY2hhaW5XID0gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChtYSkge1xuICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChtYSkgPyBtYSA6IGYobWEucmlnaHQpO1xufTsgfTtcbmV4cG9ydHMuY2hhaW5XID0gY2hhaW5XO1xuLyoqXG4gKiBDb21wb3NlcyBjb21wdXRhdGlvbnMgaW4gc2VxdWVuY2UsIHVzaW5nIHRoZSByZXR1cm4gdmFsdWUgb2Ygb25lIGNvbXB1dGF0aW9uIHRvIGRldGVybWluZSB0aGUgbmV4dCBjb21wdXRhdGlvbi5cbiAqXG4gKiBAY2F0ZWdvcnkgTW9uYWRcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmNoYWluID0gZXhwb3J0cy5jaGFpblc7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BjaGFpbkZpcnN0YF0oI2NoYWluRmlyc3QpXG4gKlxuICogRGVyaXZhYmxlIGZyb20gYE1vbmFkYC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjguMFxuICovXG52YXIgY2hhaW5GaXJzdFcgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKG1hKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uXzEucGlwZShtYSwgZXhwb3J0cy5jaGFpblcoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uXzEucGlwZShmKGEpLCBleHBvcnRzLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBhOyB9KSk7XG4gICAgfSkpO1xufTsgfTtcbmV4cG9ydHMuY2hhaW5GaXJzdFcgPSBjaGFpbkZpcnN0Vztcbi8qKlxuICogQ29tcG9zZXMgY29tcHV0YXRpb25zIGluIHNlcXVlbmNlLCB1c2luZyB0aGUgcmV0dXJuIHZhbHVlIG9mIG9uZSBjb21wdXRhdGlvbiB0byBkZXRlcm1pbmUgdGhlIG5leHQgY29tcHV0YXRpb24gYW5kXG4gKiBrZWVwaW5nIG9ubHkgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QuXG4gKlxuICogRGVyaXZhYmxlIGZyb20gYE1vbmFkYC5cbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmNoYWluRmlyc3QgPSBleHBvcnRzLmNoYWluRmlyc3RXO1xuLyoqXG4gKiBUaGUgYGZsYXR0ZW5gIGZ1bmN0aW9uIGlzIHRoZSBjb252ZW50aW9uYWwgbW9uYWQgam9pbiBvcGVyYXRvci4gSXQgaXMgdXNlZCB0byByZW1vdmUgb25lIGxldmVsIG9mIG1vbmFkaWMgc3RydWN0dXJlLCBwcm9qZWN0aW5nIGl0cyBib3VuZCBhcmd1bWVudCBpbnRvIHRoZSBvdXRlciBsZXZlbC5cbiAqXG4gKiBEZXJpdmFibGUgZnJvbSBgTW9uYWRgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKEUuZmxhdHRlbihFLnJpZ2h0KEUucmlnaHQoJ2EnKSkpLCBFLnJpZ2h0KCdhJykpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKEUuZmxhdHRlbihFLnJpZ2h0KEUubGVmdCgnZScpKSksIEUubGVmdCgnZScpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChFLmZsYXR0ZW4oRS5sZWZ0KCdlJykpLCBFLmxlZnQoJ2UnKSlcbiAqXG4gKiBAY2F0ZWdvcnkgY29tYmluYXRvcnNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmZsYXR0ZW4gPSBcbi8qI19fUFVSRV9fKi9cbmV4cG9ydHMuY2hhaW4oZnVuY3Rpb25fMS5pZGVudGl0eSk7XG4vKipcbiAqIExlc3Mgc3RyaWN0IHZlcnNpb24gb2YgW2BhbHRgXSgjYWx0KS5cbiAqXG4gKiBAY2F0ZWdvcnkgQWx0XG4gKiBAc2luY2UgMi45LjBcbiAqL1xudmFyIGFsdFcgPSBmdW5jdGlvbiAodGhhdCkgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7IHJldHVybiAoZXhwb3J0cy5pc0xlZnQoZmEpID8gdGhhdCgpIDogZmEpOyB9OyB9O1xuZXhwb3J0cy5hbHRXID0gYWx0Vztcbi8qKlxuICogSWRlbnRpZmllcyBhbiBhc3NvY2lhdGl2ZSBvcGVyYXRpb24gb24gYSB0eXBlIGNvbnN0cnVjdG9yLiBJdCBpcyBzaW1pbGFyIHRvIGBTZW1pZ3JvdXBgLCBleGNlcHQgdGhhdCBpdCBhcHBsaWVzIHRvXG4gKiB0eXBlcyBvZiBraW5kIGAqIC0+ICpgLlxuICpcbiAqIEBjYXRlZ29yeSBBbHRcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5leHBvcnRzLmFsdCA9IGV4cG9ydHMuYWx0Vztcbi8qKlxuICogQGNhdGVnb3J5IEV4dGVuZFxuICogQHNpbmNlIDIuMC4wXG4gKi9cbnZhciBleHRlbmQgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKHdhKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KHdhKSA/IHdhIDogZXhwb3J0cy5yaWdodChmKHdhKSk7XG59OyB9O1xuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG4vKipcbiAqIERlcml2YWJsZSBmcm9tIGBFeHRlbmRgLlxuICpcbiAqIEBjYXRlZ29yeSBjb21iaW5hdG9yc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuZHVwbGljYXRlID0gXG4vKiNfX1BVUkVfXyovXG5leHBvcnRzLmV4dGVuZChmdW5jdGlvbl8xLmlkZW50aXR5KTtcbi8qKlxuICogTGVmdC1hc3NvY2lhdGl2ZSBmb2xkIG9mIGEgc3RydWN0dXJlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBzdGFydFdpdGggPSAncHJlZml4J1xuICogY29uc3QgY29uY2F0ID0gKGE6IHN0cmluZywgYjogc3RyaW5nKSA9PiBgJHthfToke2J9YFxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodCgnYScpLCBFLnJlZHVjZShzdGFydFdpdGgsIGNvbmNhdCkpLFxuICogICAncHJlZml4OmEnLFxuICogKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5sZWZ0KCdlJyksIEUucmVkdWNlKHN0YXJ0V2l0aCwgY29uY2F0KSksXG4gKiAgICdwcmVmaXgnLFxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBGb2xkYWJsZVxuICogQHNpbmNlIDIuMC4wXG4gKi9cbnZhciByZWR1Y2UgPSBmdW5jdGlvbiAoYiwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KGZhKSA/IGIgOiBmKGIsIGZhLnJpZ2h0KTtcbn07IH07XG5leHBvcnRzLnJlZHVjZSA9IHJlZHVjZTtcbi8qKlxuICogTWFwIGVhY2ggZWxlbWVudCBvZiB0aGUgc3RydWN0dXJlIHRvIGEgbW9ub2lkLCBhbmQgY29tYmluZSB0aGUgcmVzdWx0cy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJztcbiAqIGltcG9ydCAqIGFzIEUgZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgbW9ub2lkU3RyaW5nIH0gZnJvbSAnZnAtdHMvTW9ub2lkJ1xuICpcbiAqIGNvbnN0IHllbGwgPSAoYTogc3RyaW5nKSA9PiBgJHthfSFgXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KCdhJyksIEUuZm9sZE1hcChtb25vaWRTdHJpbmcpKHllbGwpKSxcbiAqICAgJ2EhJyxcbiAqIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUubGVmdCgnZScpLCBFLmZvbGRNYXAobW9ub2lkU3RyaW5nKSh5ZWxsKSksXG4gKiAgIG1vbm9pZFN0cmluZy5lbXB0eSxcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgRm9sZGFibGVcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgZm9sZE1hcCA9IGZ1bmN0aW9uIChNKSB7IHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KGZhKSA/IE0uZW1wdHkgOiBmKGZhLnJpZ2h0KTtcbn07IH07IH07XG5leHBvcnRzLmZvbGRNYXAgPSBmb2xkTWFwO1xuLyoqXG4gKiBSaWdodC1hc3NvY2lhdGl2ZSBmb2xkIG9mIGEgc3RydWN0dXJlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBzdGFydFdpdGggPSAncG9zdGZpeCdcbiAqIGNvbnN0IGNvbmNhdCA9IChhOiBzdHJpbmcsIGI6IHN0cmluZykgPT4gYCR7YX06JHtifWBcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUucmlnaHQoJ2EnKSwgRS5yZWR1Y2VSaWdodChzdGFydFdpdGgsIGNvbmNhdCkpLFxuICogICAnYTpwb3N0Zml4JyxcbiAqIClcbiAqXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFxuICogICBwaXBlKEUubGVmdCgnZScpLCBFLnJlZHVjZVJpZ2h0KHN0YXJ0V2l0aCwgY29uY2F0KSksXG4gKiAgICdwb3N0Zml4JyxcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgRm9sZGFibGVcbiAqIEBzaW5jZSAyLjAuMFxuICovXG52YXIgcmVkdWNlUmlnaHQgPSBmdW5jdGlvbiAoYiwgZikgeyByZXR1cm4gZnVuY3Rpb24gKGZhKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KGZhKSA/IGIgOiBmKGZhLnJpZ2h0LCBiKTtcbn07IH07XG5leHBvcnRzLnJlZHVjZVJpZ2h0ID0gcmVkdWNlUmlnaHQ7XG4vKipcbiAqIE1hcCBlYWNoIGVsZW1lbnQgb2YgYSBzdHJ1Y3R1cmUgdG8gYW4gYWN0aW9uLCBldmFsdWF0ZSB0aGVzZSBhY3Rpb25zIGZyb20gbGVmdCB0byByaWdodCwgYW5kIGNvbGxlY3QgdGhlIHJlc3VsdHMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IHBpcGUgfSBmcm9tICdmcC10cy9mdW5jdGlvbidcbiAqIGltcG9ydCAqIGFzIEEgZnJvbSAnZnAtdHMvQXJyYXknXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCAqIGFzIE8gZnJvbSAnZnAtdHMvT3B0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodChbJ2EnXSksIEUudHJhdmVyc2UoTy5vcHRpb24pKEEuaGVhZCkpLFxuICogICBPLnNvbWUoRS5yaWdodCgnYScpKSxcbiAqICApXG4gKlxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShFLnJpZ2h0KFtdKSwgRS50cmF2ZXJzZShPLm9wdGlvbikoQS5oZWFkKSksXG4gKiAgIE8ubm9uZSxcbiAqIClcbiAqXG4gKiBAY2F0ZWdvcnkgVHJhdmVyc2FibGVcbiAqIEBzaW5jZSAyLjYuM1xuICovXG52YXIgdHJhdmVyc2UgPSBmdW5jdGlvbiAoRikgeyByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uICh0YSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KHRhKSA/IEYub2YoZXhwb3J0cy5sZWZ0KHRhLmxlZnQpKSA6IEYubWFwKGYodGEucmlnaHQpLCBleHBvcnRzLnJpZ2h0KSk7IH07IH07IH07XG5leHBvcnRzLnRyYXZlcnNlID0gdHJhdmVyc2U7XG4vKipcbiAqIEV2YWx1YXRlIGVhY2ggbW9uYWRpYyBhY3Rpb24gaW4gdGhlIHN0cnVjdHVyZSBmcm9tIGxlZnQgdG8gcmlnaHQsIGFuZCBjb2xsZWN0IHRoZSByZXN1bHRzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBFIGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCAqIGFzIE8gZnJvbSAnZnAtdHMvT3B0aW9uJ1xuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodChPLnNvbWUoJ2EnKSksIEUuc2VxdWVuY2UoTy5vcHRpb24pKSxcbiAqICAgTy5zb21lKEUucmlnaHQoJ2EnKSksXG4gKiAgKVxuICpcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoRS5yaWdodChPLm5vbmUpLCBFLnNlcXVlbmNlKE8ub3B0aW9uKSksXG4gKiAgIE8ubm9uZVxuICogKVxuICpcbiAqIEBjYXRlZ29yeSBUcmF2ZXJzYWJsZVxuICogQHNpbmNlIDIuNi4zXG4gKi9cbnZhciBzZXF1ZW5jZSA9IGZ1bmN0aW9uIChGKSB7IHJldHVybiBmdW5jdGlvbiAobWEpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5pc0xlZnQobWEpID8gRi5vZihleHBvcnRzLmxlZnQobWEubGVmdCkpIDogRi5tYXAobWEucmlnaHQsIGV4cG9ydHMucmlnaHQpO1xufTsgfTtcbmV4cG9ydHMuc2VxdWVuY2UgPSBzZXF1ZW5jZTtcbi8qKlxuICogQGNhdGVnb3J5IE1vbmFkVGhyb3dcbiAqIEBzaW5jZSAyLjYuM1xuICovXG5leHBvcnRzLnRocm93RXJyb3IgPSBleHBvcnRzLmxlZnQ7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBpbnN0YW5jZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuVVJJID0gJ0VpdGhlcic7XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBnZXRTaG93KFNFLCBTQSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHNob3c6IGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KG1hKSA/IFwibGVmdChcIiArIFNFLnNob3cobWEubGVmdCkgKyBcIilcIiA6IFwicmlnaHQoXCIgKyBTQS5zaG93KG1hLnJpZ2h0KSArIFwiKVwiKTsgfVxuICAgIH07XG59XG5leHBvcnRzLmdldFNob3cgPSBnZXRTaG93O1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gZ2V0RXEoRUwsIEVBKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZXF1YWxzOiBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgcmV0dXJuIHggPT09IHkgfHwgKGV4cG9ydHMuaXNMZWZ0KHgpID8gZXhwb3J0cy5pc0xlZnQoeSkgJiYgRUwuZXF1YWxzKHgubGVmdCwgeS5sZWZ0KSA6IGV4cG9ydHMuaXNSaWdodCh5KSAmJiBFQS5lcXVhbHMoeC5yaWdodCwgeS5yaWdodCkpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0RXEgPSBnZXRFcTtcbi8qKlxuICogU2VtaWdyb3VwIHJldHVybmluZyB0aGUgbGVmdC1tb3N0IG5vbi1gTGVmdGAgdmFsdWUuIElmIGJvdGggb3BlcmFuZHMgYXJlIGBSaWdodGBzIHRoZW4gdGhlIGlubmVyIHZhbHVlcyBhcmVcbiAqIGNvbmNhdGVuYXRlZCB1c2luZyB0aGUgcHJvdmlkZWQgYFNlbWlncm91cGBcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZ2V0U2VtaWdyb3VwLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqIGltcG9ydCB7IHNlbWlncm91cFN1bSB9IGZyb20gJ2ZwLXRzL1NlbWlncm91cCdcbiAqXG4gKiBjb25zdCBTID0gZ2V0U2VtaWdyb3VwPHN0cmluZywgbnVtYmVyPihzZW1pZ3JvdXBTdW0pXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMuY29uY2F0KGxlZnQoJ2EnKSwgbGVmdCgnYicpKSwgbGVmdCgnYScpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChsZWZ0KCdhJyksIHJpZ2h0KDIpKSwgcmlnaHQoMikpXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMuY29uY2F0KHJpZ2h0KDEpLCBsZWZ0KCdiJykpLCByaWdodCgxKSlcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoUy5jb25jYXQocmlnaHQoMSksIHJpZ2h0KDIpKSwgcmlnaHQoMykpXG4gKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGdldFNlbWlncm91cChTKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29uY2F0OiBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KHkpID8geCA6IGV4cG9ydHMuaXNMZWZ0KHgpID8geSA6IGV4cG9ydHMucmlnaHQoUy5jb25jYXQoeC5yaWdodCwgeS5yaWdodCkpKTsgfVxuICAgIH07XG59XG5leHBvcnRzLmdldFNlbWlncm91cCA9IGdldFNlbWlncm91cDtcbi8qKlxuICogU2VtaWdyb3VwIHJldHVybmluZyB0aGUgbGVmdC1tb3N0IGBMZWZ0YCB2YWx1ZS4gSWYgYm90aCBvcGVyYW5kcyBhcmUgYFJpZ2h0YHMgdGhlbiB0aGUgaW5uZXIgdmFsdWVzXG4gKiBhcmUgY29uY2F0ZW5hdGVkIHVzaW5nIHRoZSBwcm92aWRlZCBgU2VtaWdyb3VwYFxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBnZXRBcHBseVNlbWlncm91cCwgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBzZW1pZ3JvdXBTdW0gfSBmcm9tICdmcC10cy9TZW1pZ3JvdXAnXG4gKlxuICogY29uc3QgUyA9IGdldEFwcGx5U2VtaWdyb3VwPHN0cmluZywgbnVtYmVyPihzZW1pZ3JvdXBTdW0pXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKFMuY29uY2F0KGxlZnQoJ2EnKSwgbGVmdCgnYicpKSwgbGVmdCgnYScpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChsZWZ0KCdhJyksIHJpZ2h0KDIpKSwgbGVmdCgnYScpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChyaWdodCgxKSwgbGVmdCgnYicpKSwgbGVmdCgnYicpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChTLmNvbmNhdChyaWdodCgxKSwgcmlnaHQoMikpLCByaWdodCgzKSlcbiAqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gZ2V0QXBwbHlTZW1pZ3JvdXAoUykge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKHgsIHkpIHsgcmV0dXJuIChleHBvcnRzLmlzTGVmdCh4KSA/IHggOiBleHBvcnRzLmlzTGVmdCh5KSA/IHkgOiBleHBvcnRzLnJpZ2h0KFMuY29uY2F0KHgucmlnaHQsIHkucmlnaHQpKSk7IH1cbiAgICB9O1xufVxuZXhwb3J0cy5nZXRBcHBseVNlbWlncm91cCA9IGdldEFwcGx5U2VtaWdyb3VwO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi4wLjBcbiAqL1xuZnVuY3Rpb24gZ2V0QXBwbHlNb25vaWQoTSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbmNhdDogZ2V0QXBwbHlTZW1pZ3JvdXAoTSkuY29uY2F0LFxuICAgICAgICBlbXB0eTogZXhwb3J0cy5yaWdodChNLmVtcHR5KVxuICAgIH07XG59XG5leHBvcnRzLmdldEFwcGx5TW9ub2lkID0gZ2V0QXBwbHlNb25vaWQ7XG4vKipcbiAqIEJ1aWxkcyBhIGBGaWx0ZXJhYmxlYCBpbnN0YW5jZSBmb3IgYEVpdGhlcmAgZ2l2ZW4gYE1vbm9pZGAgZm9yIHRoZSBsZWZ0IHNpZGVcbiAqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMy4wLjBcbiAqL1xuZnVuY3Rpb24gZ2V0RmlsdGVyYWJsZShNKSB7XG4gICAgdmFyIGVtcHR5ID0gZXhwb3J0cy5sZWZ0KE0uZW1wdHkpO1xuICAgIHZhciBjb21wYWN0ID0gZnVuY3Rpb24gKG1hKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChtYSkgPyBtYSA6IG1hLnJpZ2h0Ll90YWcgPT09ICdOb25lJyA/IGVtcHR5IDogZXhwb3J0cy5yaWdodChtYS5yaWdodC52YWx1ZSk7XG4gICAgfTtcbiAgICB2YXIgc2VwYXJhdGUgPSBmdW5jdGlvbiAobWEpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KG1hKVxuICAgICAgICAgICAgPyB7IGxlZnQ6IG1hLCByaWdodDogbWEgfVxuICAgICAgICAgICAgOiBleHBvcnRzLmlzTGVmdChtYS5yaWdodClcbiAgICAgICAgICAgICAgICA/IHsgbGVmdDogZXhwb3J0cy5yaWdodChtYS5yaWdodC5sZWZ0KSwgcmlnaHQ6IGVtcHR5IH1cbiAgICAgICAgICAgICAgICA6IHsgbGVmdDogZW1wdHksIHJpZ2h0OiBleHBvcnRzLnJpZ2h0KG1hLnJpZ2h0LnJpZ2h0KSB9O1xuICAgIH07XG4gICAgdmFyIHBhcnRpdGlvbk1hcCA9IGZ1bmN0aW9uIChtYSwgZikge1xuICAgICAgICBpZiAoZXhwb3J0cy5pc0xlZnQobWEpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBsZWZ0OiBtYSwgcmlnaHQ6IG1hIH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGUgPSBmKG1hLnJpZ2h0KTtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KGUpID8geyBsZWZ0OiBleHBvcnRzLnJpZ2h0KGUubGVmdCksIHJpZ2h0OiBlbXB0eSB9IDogeyBsZWZ0OiBlbXB0eSwgcmlnaHQ6IGV4cG9ydHMucmlnaHQoZS5yaWdodCkgfTtcbiAgICB9O1xuICAgIHZhciBwYXJ0aXRpb24gPSBmdW5jdGlvbiAobWEsIHApIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuaXNMZWZ0KG1hKVxuICAgICAgICAgICAgPyB7IGxlZnQ6IG1hLCByaWdodDogbWEgfVxuICAgICAgICAgICAgOiBwKG1hLnJpZ2h0KVxuICAgICAgICAgICAgICAgID8geyBsZWZ0OiBlbXB0eSwgcmlnaHQ6IGV4cG9ydHMucmlnaHQobWEucmlnaHQpIH1cbiAgICAgICAgICAgICAgICA6IHsgbGVmdDogZXhwb3J0cy5yaWdodChtYS5yaWdodCksIHJpZ2h0OiBlbXB0eSB9O1xuICAgIH07XG4gICAgdmFyIGZpbHRlck1hcCA9IGZ1bmN0aW9uIChtYSwgZikge1xuICAgICAgICBpZiAoZXhwb3J0cy5pc0xlZnQobWEpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9iID0gZihtYS5yaWdodCk7XG4gICAgICAgIHJldHVybiBvYi5fdGFnID09PSAnTm9uZScgPyBlbXB0eSA6IGV4cG9ydHMucmlnaHQob2IudmFsdWUpO1xuICAgIH07XG4gICAgdmFyIGZpbHRlciA9IGZ1bmN0aW9uIChtYSwgcHJlZGljYXRlKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChtYSkgPyBtYSA6IHByZWRpY2F0ZShtYS5yaWdodCkgPyBtYSA6IGVtcHR5O1xuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICAgICAgX0U6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFwOiBtYXBfLFxuICAgICAgICBjb21wYWN0OiBjb21wYWN0LFxuICAgICAgICBzZXBhcmF0ZTogc2VwYXJhdGUsXG4gICAgICAgIGZpbHRlcjogZmlsdGVyLFxuICAgICAgICBmaWx0ZXJNYXA6IGZpbHRlck1hcCxcbiAgICAgICAgcGFydGl0aW9uOiBwYXJ0aXRpb24sXG4gICAgICAgIHBhcnRpdGlvbk1hcDogcGFydGl0aW9uTWFwXG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0RmlsdGVyYWJsZSA9IGdldEZpbHRlcmFibGU7XG4vKipcbiAqIEJ1aWxkcyBgV2l0aGVyYWJsZWAgaW5zdGFuY2UgZm9yIGBFaXRoZXJgIGdpdmVuIGBNb25vaWRgIGZvciB0aGUgbGVmdCBzaWRlXG4gKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGdldFdpdGhlcmFibGUoTSkge1xuICAgIHZhciBGXyA9IGdldEZpbHRlcmFibGUoTSk7XG4gICAgdmFyIHdpdGhlciA9IGZ1bmN0aW9uIChGKSB7XG4gICAgICAgIHZhciB0cmF2ZXJzZUYgPSB0cmF2ZXJzZV8oRik7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobWEsIGYpIHsgcmV0dXJuIEYubWFwKHRyYXZlcnNlRihtYSwgZiksIEZfLmNvbXBhY3QpOyB9O1xuICAgIH07XG4gICAgdmFyIHdpbHQgPSBmdW5jdGlvbiAoRikge1xuICAgICAgICB2YXIgdHJhdmVyc2VGID0gdHJhdmVyc2VfKEYpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1hLCBmKSB7IHJldHVybiBGLm1hcCh0cmF2ZXJzZUYobWEsIGYpLCBGXy5zZXBhcmF0ZSk7IH07XG4gICAgfTtcbiAgICByZXR1cm4ge1xuICAgICAgICBVUkk6IGV4cG9ydHMuVVJJLFxuICAgICAgICBfRTogdW5kZWZpbmVkLFxuICAgICAgICBtYXA6IG1hcF8sXG4gICAgICAgIGNvbXBhY3Q6IEZfLmNvbXBhY3QsXG4gICAgICAgIHNlcGFyYXRlOiBGXy5zZXBhcmF0ZSxcbiAgICAgICAgZmlsdGVyOiBGXy5maWx0ZXIsXG4gICAgICAgIGZpbHRlck1hcDogRl8uZmlsdGVyTWFwLFxuICAgICAgICBwYXJ0aXRpb246IEZfLnBhcnRpdGlvbixcbiAgICAgICAgcGFydGl0aW9uTWFwOiBGXy5wYXJ0aXRpb25NYXAsXG4gICAgICAgIHRyYXZlcnNlOiB0cmF2ZXJzZV8sXG4gICAgICAgIHNlcXVlbmNlOiBleHBvcnRzLnNlcXVlbmNlLFxuICAgICAgICByZWR1Y2U6IHJlZHVjZV8sXG4gICAgICAgIGZvbGRNYXA6IGZvbGRNYXBfLFxuICAgICAgICByZWR1Y2VSaWdodDogcmVkdWNlUmlnaHRfLFxuICAgICAgICB3aXRoZXI6IHdpdGhlcixcbiAgICAgICAgd2lsdDogd2lsdFxuICAgIH07XG59XG5leHBvcnRzLmdldFdpdGhlcmFibGUgPSBnZXRXaXRoZXJhYmxlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgaW5zdGFuY2VzXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZnVuY3Rpb24gZ2V0QXBwbGljYXRpdmVWYWxpZGF0aW9uKFNFKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICAgICAgX0U6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFwOiBtYXBfLFxuICAgICAgICBhcDogZnVuY3Rpb24gKGZhYiwgZmEpIHtcbiAgICAgICAgICAgIHJldHVybiBleHBvcnRzLmlzTGVmdChmYWIpXG4gICAgICAgICAgICAgICAgPyBleHBvcnRzLmlzTGVmdChmYSlcbiAgICAgICAgICAgICAgICAgICAgPyBleHBvcnRzLmxlZnQoU0UuY29uY2F0KGZhYi5sZWZ0LCBmYS5sZWZ0KSlcbiAgICAgICAgICAgICAgICAgICAgOiBmYWJcbiAgICAgICAgICAgICAgICA6IGV4cG9ydHMuaXNMZWZ0KGZhKVxuICAgICAgICAgICAgICAgICAgICA/IGZhXG4gICAgICAgICAgICAgICAgICAgIDogZXhwb3J0cy5yaWdodChmYWIucmlnaHQoZmEucmlnaHQpKTtcbiAgICAgICAgfSxcbiAgICAgICAgb2Y6IGV4cG9ydHMub2ZcbiAgICB9O1xufVxuZXhwb3J0cy5nZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb24gPSBnZXRBcHBsaWNhdGl2ZVZhbGlkYXRpb247XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5mdW5jdGlvbiBnZXRBbHRWYWxpZGF0aW9uKFNFKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICAgICAgX0U6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFwOiBtYXBfLFxuICAgICAgICBhbHQ6IGZ1bmN0aW9uIChtZSwgdGhhdCkge1xuICAgICAgICAgICAgaWYgKGV4cG9ydHMuaXNSaWdodChtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZWEgPSB0aGF0KCk7XG4gICAgICAgICAgICByZXR1cm4gZXhwb3J0cy5pc0xlZnQoZWEpID8gZXhwb3J0cy5sZWZ0KFNFLmNvbmNhdChtZS5sZWZ0LCBlYS5sZWZ0KSkgOiBlYTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmdldEFsdFZhbGlkYXRpb24gPSBnZXRBbHRWYWxpZGF0aW9uO1xuLy8gVE9ETzogcmVtb3ZlIGluIHYzXG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBnZXRWYWxpZGF0aW9uKFNFKSB7XG4gICAgdmFyIGFwcGxpY2F0aXZlVmFsaWRhdGlvbiA9IGdldEFwcGxpY2F0aXZlVmFsaWRhdGlvbihTRSk7XG4gICAgdmFyIGFsdFZhbGlkYXRpb24gPSBnZXRBbHRWYWxpZGF0aW9uKFNFKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBVUkk6IGV4cG9ydHMuVVJJLFxuICAgICAgICBfRTogdW5kZWZpbmVkLFxuICAgICAgICBtYXA6IG1hcF8sXG4gICAgICAgIG9mOiBleHBvcnRzLm9mLFxuICAgICAgICBjaGFpbjogY2hhaW5fLFxuICAgICAgICBiaW1hcDogYmltYXBfLFxuICAgICAgICBtYXBMZWZ0OiBtYXBMZWZ0XyxcbiAgICAgICAgcmVkdWNlOiByZWR1Y2VfLFxuICAgICAgICBmb2xkTWFwOiBmb2xkTWFwXyxcbiAgICAgICAgcmVkdWNlUmlnaHQ6IHJlZHVjZVJpZ2h0XyxcbiAgICAgICAgZXh0ZW5kOiBleHRlbmRfLFxuICAgICAgICB0cmF2ZXJzZTogdHJhdmVyc2VfLFxuICAgICAgICBzZXF1ZW5jZTogZXhwb3J0cy5zZXF1ZW5jZSxcbiAgICAgICAgY2hhaW5SZWM6IGNoYWluUmVjXyxcbiAgICAgICAgdGhyb3dFcnJvcjogZXhwb3J0cy50aHJvd0Vycm9yLFxuICAgICAgICBhcDogYXBwbGljYXRpdmVWYWxpZGF0aW9uLmFwLFxuICAgICAgICBhbHQ6IGFsdFZhbGlkYXRpb24uYWx0XG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0VmFsaWRhdGlvbiA9IGdldFZhbGlkYXRpb247XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBnZXRWYWxpZGF0aW9uU2VtaWdyb3VwKFNFLCBTQSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgIHJldHVybiBleHBvcnRzLmlzTGVmdCh4KSA/IChleHBvcnRzLmlzTGVmdCh5KSA/IGV4cG9ydHMubGVmdChTRS5jb25jYXQoeC5sZWZ0LCB5LmxlZnQpKSA6IHgpIDogZXhwb3J0cy5pc0xlZnQoeSkgPyB5IDogZXhwb3J0cy5yaWdodChTQS5jb25jYXQoeC5yaWdodCwgeS5yaWdodCkpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0VmFsaWRhdGlvblNlbWlncm91cCA9IGdldFZhbGlkYXRpb25TZW1pZ3JvdXA7XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnRzLkZ1bmN0b3IgPSB7XG4gICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICBtYXA6IG1hcF9cbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnRzLkFwcGxpY2F0aXZlID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIGFwOiBhcF8sXG4gICAgb2Y6IGV4cG9ydHMub2Zcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnRzLk1vbmFkID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIGFwOiBhcF8sXG4gICAgb2Y6IGV4cG9ydHMub2YsXG4gICAgY2hhaW46IGNoYWluX1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuRm9sZGFibGUgPSB7XG4gICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICByZWR1Y2U6IHJlZHVjZV8sXG4gICAgZm9sZE1hcDogZm9sZE1hcF8sXG4gICAgcmVkdWNlUmlnaHQ6IHJlZHVjZVJpZ2h0X1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuVHJhdmVyc2FibGUgPSB7XG4gICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICBtYXA6IG1hcF8sXG4gICAgcmVkdWNlOiByZWR1Y2VfLFxuICAgIGZvbGRNYXA6IGZvbGRNYXBfLFxuICAgIHJlZHVjZVJpZ2h0OiByZWR1Y2VSaWdodF8sXG4gICAgdHJhdmVyc2U6IHRyYXZlcnNlXyxcbiAgICBzZXF1ZW5jZTogZXhwb3J0cy5zZXF1ZW5jZVxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuQmlmdW5jdG9yID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgYmltYXA6IGJpbWFwXyxcbiAgICBtYXBMZWZ0OiBtYXBMZWZ0X1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuQWx0ID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIGFsdDogYWx0X1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuRXh0ZW5kID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIGV4dGVuZDogZXh0ZW5kX1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydHMuQ2hhaW5SZWMgPSB7XG4gICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICBtYXA6IG1hcF8sXG4gICAgYXA6IGFwXyxcbiAgICBjaGFpbjogY2hhaW5fLFxuICAgIGNoYWluUmVjOiBjaGFpblJlY19cbn07XG4vKipcbiAqIEBjYXRlZ29yeSBpbnN0YW5jZXNcbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnRzLk1vbmFkVGhyb3cgPSB7XG4gICAgVVJJOiBleHBvcnRzLlVSSSxcbiAgICBtYXA6IG1hcF8sXG4gICAgYXA6IGFwXyxcbiAgICBvZjogZXhwb3J0cy5vZixcbiAgICBjaGFpbjogY2hhaW5fLFxuICAgIHRocm93RXJyb3I6IGV4cG9ydHMudGhyb3dFcnJvclxufTtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGdldFZhbGlkYXRpb25Nb25vaWQoU0UsIFNBKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29uY2F0OiBnZXRWYWxpZGF0aW9uU2VtaWdyb3VwKFNFLCBTQSkuY29uY2F0LFxuICAgICAgICBlbXB0eTogZXhwb3J0cy5yaWdodChTQS5lbXB0eSlcbiAgICB9O1xufVxuZXhwb3J0cy5nZXRWYWxpZGF0aW9uTW9ub2lkID0gZ2V0VmFsaWRhdGlvbk1vbm9pZDtcbi8qKlxuICogQGNhdGVnb3J5IGluc3RhbmNlc1xuICogQHNpbmNlIDIuMC4wXG4gKi9cbmV4cG9ydHMuZWl0aGVyID0ge1xuICAgIFVSSTogZXhwb3J0cy5VUkksXG4gICAgbWFwOiBtYXBfLFxuICAgIG9mOiBleHBvcnRzLm9mLFxuICAgIGFwOiBhcF8sXG4gICAgY2hhaW46IGNoYWluXyxcbiAgICByZWR1Y2U6IHJlZHVjZV8sXG4gICAgZm9sZE1hcDogZm9sZE1hcF8sXG4gICAgcmVkdWNlUmlnaHQ6IHJlZHVjZVJpZ2h0XyxcbiAgICB0cmF2ZXJzZTogdHJhdmVyc2VfLFxuICAgIHNlcXVlbmNlOiBleHBvcnRzLnNlcXVlbmNlLFxuICAgIGJpbWFwOiBiaW1hcF8sXG4gICAgbWFwTGVmdDogbWFwTGVmdF8sXG4gICAgYWx0OiBhbHRfLFxuICAgIGV4dGVuZDogZXh0ZW5kXyxcbiAgICBjaGFpblJlYzogY2hhaW5SZWNfLFxuICAgIHRocm93RXJyb3I6IGV4cG9ydHMudGhyb3dFcnJvclxufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIERlZmF1bHQgdmFsdWUgZm9yIHRoZSBgb25FcnJvcmAgYXJndW1lbnQgb2YgYHRyeUNhdGNoYFxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiB0b0Vycm9yKGUpIHtcbiAgICByZXR1cm4gZSBpbnN0YW5jZW9mIEVycm9yID8gZSA6IG5ldyBFcnJvcihTdHJpbmcoZSkpO1xufVxuZXhwb3J0cy50b0Vycm9yID0gdG9FcnJvcjtcbi8qKlxuICogQHNpbmNlIDIuMC4wXG4gKi9cbmZ1bmN0aW9uIGVsZW0oRSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSwgbWEpIHsgcmV0dXJuIChleHBvcnRzLmlzTGVmdChtYSkgPyBmYWxzZSA6IEUuZXF1YWxzKGEsIG1hLnJpZ2h0KSk7IH07XG59XG5leHBvcnRzLmVsZW0gPSBlbGVtO1xuLyoqXG4gKiBSZXR1cm5zIGBmYWxzZWAgaWYgYExlZnRgIG9yIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgYXBwbGljYXRpb24gb2YgdGhlIGdpdmVuIHByZWRpY2F0ZSB0byB0aGUgYFJpZ2h0YCB2YWx1ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgZXhpc3RzLCBsZWZ0LCByaWdodCB9IGZyb20gJ2ZwLXRzL0VpdGhlcidcbiAqXG4gKiBjb25zdCBndDIgPSBleGlzdHMoKG46IG51bWJlcikgPT4gbiA+IDIpXG4gKlxuICogYXNzZXJ0LnN0cmljdEVxdWFsKGd0MihsZWZ0KCdhJykpLCBmYWxzZSlcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChndDIocmlnaHQoMSkpLCBmYWxzZSlcbiAqIGFzc2VydC5zdHJpY3RFcXVhbChndDIocmlnaHQoMykpLCB0cnVlKVxuICpcbiAqIEBzaW5jZSAyLjAuMFxuICovXG5mdW5jdGlvbiBleGlzdHMocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYSkgeyByZXR1cm4gKGV4cG9ydHMuaXNMZWZ0KG1hKSA/IGZhbHNlIDogcHJlZGljYXRlKG1hLnJpZ2h0KSk7IH07XG59XG5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGRvIG5vdGF0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnRzLkRvID0gXG4vKiNfX1BVUkVfXyovXG5leHBvcnRzLm9mKHt9KTtcbi8qKlxuICogQHNpbmNlIDIuOC4wXG4gKi9cbnZhciBiaW5kVG8gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiBleHBvcnRzLm1hcChmdW5jdGlvbl8xLmJpbmRUb18obmFtZSkpO1xufTtcbmV4cG9ydHMuYmluZFRvID0gYmluZFRvO1xuLyoqXG4gKiBAc2luY2UgMi44LjBcbiAqL1xudmFyIGJpbmRXID0gZnVuY3Rpb24gKG5hbWUsIGYpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jaGFpblcoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uXzEucGlwZShmKGEpLCBleHBvcnRzLm1hcChmdW5jdGlvbiAoYikgeyByZXR1cm4gZnVuY3Rpb25fMS5iaW5kXyhhLCBuYW1lLCBiKTsgfSkpO1xuICAgIH0pO1xufTtcbmV4cG9ydHMuYmluZFcgPSBiaW5kVztcbi8qKlxuICogQHNpbmNlIDIuOC4wXG4gKi9cbmV4cG9ydHMuYmluZCA9IGV4cG9ydHMuYmluZFc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBwaXBlYWJsZSBzZXF1ZW5jZSBTXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBzaW5jZSAyLjguMFxuICovXG52YXIgYXBTVyA9IGZ1bmN0aW9uIChuYW1lLCBmYikge1xuICAgIHJldHVybiBmdW5jdGlvbl8xLmZsb3coZXhwb3J0cy5tYXAoZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGZ1bmN0aW9uIChiKSB7IHJldHVybiBmdW5jdGlvbl8xLmJpbmRfKGEsIG5hbWUsIGIpOyB9OyB9KSwgZXhwb3J0cy5hcFcoZmIpKTtcbn07XG5leHBvcnRzLmFwU1cgPSBhcFNXO1xuLyoqXG4gKiBAc2luY2UgMi44LjBcbiAqL1xuZXhwb3J0cy5hcFMgPSBleHBvcnRzLmFwU1c7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBhcnJheSB1dGlsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKlxuICogQHNpbmNlIDIuOS4wXG4gKi9cbnZhciB0cmF2ZXJzZUFycmF5V2l0aEluZGV4ID0gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZ1bmN0aW9uIChhcnIpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHJlYWRvbmx5LWFycmF5XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlID0gZihpLCBhcnJbaV0pO1xuICAgICAgICBpZiAoZS5fdGFnID09PSAnTGVmdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKGUucmlnaHQpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwb3J0cy5yaWdodChyZXN1bHQpO1xufTsgfTtcbmV4cG9ydHMudHJhdmVyc2VBcnJheVdpdGhJbmRleCA9IHRyYXZlcnNlQXJyYXlXaXRoSW5kZXg7XG4vKipcbiAqIG1hcCBhbiBhcnJheSB1c2luZyBwcm92aWRlZCBmdW5jdGlvbiB0byBFaXRoZXIgdGhlbiB0cmFuc2Zvcm0gdG8gRWl0aGVyIG9mIHRoZSBhcnJheVxuICogdGhpcyBmdW5jdGlvbiBoYXZlIHRoZSBzYW1lIGJlaGF2aW9yIG9mIGBBLnRyYXZlcnNlKEUuZWl0aGVyKWAgYnV0IGl0J3Mgb3B0aW1pemVkIGFuZCBwZXJmb3JtIGJldHRlclxuICpcbiAqIEBleGFtcGxlXG4gKlxuICpcbiAqIGltcG9ydCB7IHRyYXZlcnNlQXJyYXksIGxlZnQsIHJpZ2h0LCBmcm9tUHJlZGljYXRlIH0gZnJvbSAnZnAtdHMvRWl0aGVyJ1xuICogaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ZwLXRzL2Z1bmN0aW9uJ1xuICogaW1wb3J0ICogYXMgQSBmcm9tICdmcC10cy9BcnJheSdcbiAqXG4gKiBjb25zdCBhcnIgPSBBLnJhbmdlKDAsIDEwKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAqICAgcGlwZShcbiAqICAgICBhcnIsXG4gKiAgICAgdHJhdmVyc2VBcnJheSgoeCkgPT4gcmlnaHQoeCkpXG4gKiAgICksXG4gKiAgIHJpZ2h0KGFycilcbiAqIClcbiAqIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gKiAgIHBpcGUoXG4gKiAgICAgYXJyLFxuICogICAgIHRyYXZlcnNlQXJyYXkoXG4gKiAgICAgICBmcm9tUHJlZGljYXRlKFxuICogICAgICAgICAoeCkgPT4geCA+IDUsXG4gKiAgICAgICAgICgpID0+ICdhJ1xuICogICAgICAgKVxuICogICAgIClcbiAqICAgKSxcbiAqICAgbGVmdCgnYScpXG4gKiApXG4gKiBAc2luY2UgMi45LjBcbiAqL1xudmFyIHRyYXZlcnNlQXJyYXkgPSBmdW5jdGlvbiAoZikgeyByZXR1cm4gZXhwb3J0cy50cmF2ZXJzZUFycmF5V2l0aEluZGV4KGZ1bmN0aW9uIChfLCBhKSB7IHJldHVybiBmKGEpOyB9KTsgfTtcbmV4cG9ydHMudHJhdmVyc2VBcnJheSA9IHRyYXZlcnNlQXJyYXk7XG4vKipcbiAqIGNvbnZlcnQgYW4gYXJyYXkgb2YgZWl0aGVyIHRvIGFuIGVpdGhlciBvZiBhcnJheVxuICogdGhpcyBmdW5jdGlvbiBoYXZlIHRoZSBzYW1lIGJlaGF2aW9yIG9mIGBBLnNlcXVlbmNlKEUuZWl0aGVyKWAgYnV0IGl0J3Mgb3B0aW1pemVkIGFuZCBwZXJmb3JtIGJldHRlclxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogaW1wb3J0IHsgc2VxdWVuY2VBcnJheSwgbGVmdCwgcmlnaHQgfSBmcm9tICdmcC10cy9FaXRoZXInXG4gKiBpbXBvcnQgeyBwaXBlIH0gZnJvbSAnZnAtdHMvZnVuY3Rpb24nXG4gKiBpbXBvcnQgKiBhcyBBIGZyb20gJ2ZwLXRzL0FycmF5J1xuICpcbiAqIGNvbnN0IGFyciA9IEEucmFuZ2UoMCwgMTApXG4gKiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKHBpcGUoYXJyLCBBLm1hcChyaWdodCksIHNlcXVlbmNlQXJyYXkpLCByaWdodChhcnIpKVxuICogYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChwaXBlKGFyciwgQS5tYXAocmlnaHQpLCBBLmNvbnMobGVmdCgnRXJyb3InKSksIHNlcXVlbmNlQXJyYXkpLCBsZWZ0KCdFcnJvcicpKVxuICpcbiAqIEBzaW5jZSAyLjkuMFxuICovXG5leHBvcnRzLnNlcXVlbmNlQXJyYXkgPSBcbi8qI19fUFVSRV9fKi9cbmV4cG9ydHMudHJhdmVyc2VBcnJheShmdW5jdGlvbl8xLmlkZW50aXR5KTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuaXNJbnRlZ2VyID0gbnVtID0+IHtcbiAgaWYgKHR5cGVvZiBudW0gPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIobnVtKTtcbiAgfVxuICBpZiAodHlwZW9mIG51bSA9PT0gJ3N0cmluZycgJiYgbnVtLnRyaW0oKSAhPT0gJycpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihOdW1iZXIobnVtKSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBGaW5kIGEgbm9kZSBvZiB0aGUgZ2l2ZW4gdHlwZVxuICovXG5cbmV4cG9ydHMuZmluZCA9IChub2RlLCB0eXBlKSA9PiBub2RlLm5vZGVzLmZpbmQobm9kZSA9PiBub2RlLnR5cGUgPT09IHR5cGUpO1xuXG4vKipcbiAqIEZpbmQgYSBub2RlIG9mIHRoZSBnaXZlbiB0eXBlXG4gKi9cblxuZXhwb3J0cy5leGNlZWRzTGltaXQgPSAobWluLCBtYXgsIHN0ZXAgPSAxLCBsaW1pdCkgPT4ge1xuICBpZiAobGltaXQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gIGlmICghZXhwb3J0cy5pc0ludGVnZXIobWluKSB8fCAhZXhwb3J0cy5pc0ludGVnZXIobWF4KSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gKChOdW1iZXIobWF4KSAtIE51bWJlcihtaW4pKSAvIE51bWJlcihzdGVwKSkgPj0gbGltaXQ7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gbm9kZSB3aXRoICdcXFxcJyBiZWZvcmUgbm9kZS52YWx1ZVxuICovXG5cbmV4cG9ydHMuZXNjYXBlTm9kZSA9IChibG9jaywgbiA9IDAsIHR5cGUpID0+IHtcbiAgbGV0IG5vZGUgPSBibG9jay5ub2Rlc1tuXTtcbiAgaWYgKCFub2RlKSByZXR1cm47XG5cbiAgaWYgKCh0eXBlICYmIG5vZGUudHlwZSA9PT0gdHlwZSkgfHwgbm9kZS50eXBlID09PSAnb3BlbicgfHwgbm9kZS50eXBlID09PSAnY2xvc2UnKSB7XG4gICAgaWYgKG5vZGUuZXNjYXBlZCAhPT0gdHJ1ZSkge1xuICAgICAgbm9kZS52YWx1ZSA9ICdcXFxcJyArIG5vZGUudmFsdWU7XG4gICAgICBub2RlLmVzY2FwZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGJyYWNlIG5vZGUgc2hvdWxkIGJlIGVuY2xvc2VkIGluIGxpdGVyYWwgYnJhY2VzXG4gKi9cblxuZXhwb3J0cy5lbmNsb3NlQnJhY2UgPSBub2RlID0+IHtcbiAgaWYgKG5vZGUudHlwZSAhPT0gJ2JyYWNlJykgcmV0dXJuIGZhbHNlO1xuICBpZiAoKG5vZGUuY29tbWFzID4+IDAgKyBub2RlLnJhbmdlcyA+PiAwKSA9PT0gMCkge1xuICAgIG5vZGUuaW52YWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBicmFjZSBub2RlIGlzIGludmFsaWQuXG4gKi9cblxuZXhwb3J0cy5pc0ludmFsaWRCcmFjZSA9IGJsb2NrID0+IHtcbiAgaWYgKGJsb2NrLnR5cGUgIT09ICdicmFjZScpIHJldHVybiBmYWxzZTtcbiAgaWYgKGJsb2NrLmludmFsaWQgPT09IHRydWUgfHwgYmxvY2suZG9sbGFyKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKChibG9jay5jb21tYXMgPj4gMCArIGJsb2NrLnJhbmdlcyA+PiAwKSA9PT0gMCkge1xuICAgIGJsb2NrLmludmFsaWQgPSB0cnVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChibG9jay5vcGVuICE9PSB0cnVlIHx8IGJsb2NrLmNsb3NlICE9PSB0cnVlKSB7XG4gICAgYmxvY2suaW52YWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBub2RlIGlzIGFuIG9wZW4gb3IgY2xvc2Ugbm9kZVxuICovXG5cbmV4cG9ydHMuaXNPcGVuT3JDbG9zZSA9IG5vZGUgPT4ge1xuICBpZiAobm9kZS50eXBlID09PSAnb3BlbicgfHwgbm9kZS50eXBlID09PSAnY2xvc2UnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIG5vZGUub3BlbiA9PT0gdHJ1ZSB8fCBub2RlLmNsb3NlID09PSB0cnVlO1xufTtcblxuLyoqXG4gKiBSZWR1Y2UgYW4gYXJyYXkgb2YgdGV4dCBub2Rlcy5cbiAqL1xuXG5leHBvcnRzLnJlZHVjZSA9IG5vZGVzID0+IG5vZGVzLnJlZHVjZSgoYWNjLCBub2RlKSA9PiB7XG4gIGlmIChub2RlLnR5cGUgPT09ICd0ZXh0JykgYWNjLnB1c2gobm9kZS52YWx1ZSk7XG4gIGlmIChub2RlLnR5cGUgPT09ICdyYW5nZScpIG5vZGUudHlwZSA9ICd0ZXh0JztcbiAgcmV0dXJuIGFjYztcbn0sIFtdKTtcblxuLyoqXG4gKiBGbGF0dGVuIGFuIGFycmF5XG4gKi9cblxuZXhwb3J0cy5mbGF0dGVuID0gKC4uLmFyZ3MpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGNvbnN0IGZsYXQgPSBhcnIgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZWxlID0gYXJyW2ldO1xuICAgICAgQXJyYXkuaXNBcnJheShlbGUpID8gZmxhdChlbGUsIHJlc3VsdCkgOiBlbGUgIT09IHZvaWQgMCAmJiByZXN1bHQucHVzaChlbGUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBmbGF0KGFyZ3MpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChhc3QsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgc3RyaW5naWZ5ID0gKG5vZGUsIHBhcmVudCA9IHt9KSA9PiB7XG4gICAgbGV0IGludmFsaWRCbG9jayA9IG9wdGlvbnMuZXNjYXBlSW52YWxpZCAmJiB1dGlscy5pc0ludmFsaWRCcmFjZShwYXJlbnQpO1xuICAgIGxldCBpbnZhbGlkTm9kZSA9IG5vZGUuaW52YWxpZCA9PT0gdHJ1ZSAmJiBvcHRpb25zLmVzY2FwZUludmFsaWQgPT09IHRydWU7XG4gICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgaWYgKG5vZGUudmFsdWUpIHtcbiAgICAgIGlmICgoaW52YWxpZEJsb2NrIHx8IGludmFsaWROb2RlKSAmJiB1dGlscy5pc09wZW5PckNsb3NlKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiAnXFxcXCcgKyBub2RlLnZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUudmFsdWUpIHtcbiAgICAgIHJldHVybiBub2RlLnZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVzKSB7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBub2RlLm5vZGVzKSB7XG4gICAgICAgIG91dHB1dCArPSBzdHJpbmdpZnkoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIHJldHVybiBzdHJpbmdpZnkoYXN0KTtcbn07XG5cbiIsICIvKiFcbiAqIGlzLW51bWJlciA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtbnVtYmVyPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBKb24gU2NobGlua2VydC5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obnVtKSB7XG4gIGlmICh0eXBlb2YgbnVtID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBudW0gLSBudW0gPT09IDA7XG4gIH1cbiAgaWYgKHR5cGVvZiBudW0gPT09ICdzdHJpbmcnICYmIG51bS50cmltKCkgIT09ICcnKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZSA/IE51bWJlci5pc0Zpbml0ZSgrbnVtKSA6IGlzRmluaXRlKCtudW0pO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG4iLCAiLyohXG4gKiB0by1yZWdleC1yYW5nZSA8aHR0cHM6Ly9naXRodWIuY29tL21pY3JvbWF0Y2gvdG8tcmVnZXgtcmFuZ2U+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNOdW1iZXIgPSByZXF1aXJlKCdpcy1udW1iZXInKTtcblxuY29uc3QgdG9SZWdleFJhbmdlID0gKG1pbiwgbWF4LCBvcHRpb25zKSA9PiB7XG4gIGlmIChpc051bWJlcihtaW4pID09PSBmYWxzZSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RvUmVnZXhSYW5nZTogZXhwZWN0ZWQgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGJlIGEgbnVtYmVyJyk7XG4gIH1cblxuICBpZiAobWF4ID09PSB2b2lkIDAgfHwgbWluID09PSBtYXgpIHtcbiAgICByZXR1cm4gU3RyaW5nKG1pbik7XG4gIH1cblxuICBpZiAoaXNOdW1iZXIobWF4KSA9PT0gZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0b1JlZ2V4UmFuZ2U6IGV4cGVjdGVkIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gYmUgYSBudW1iZXIuJyk7XG4gIH1cblxuICBsZXQgb3B0cyA9IHsgcmVsYXhaZXJvczogdHJ1ZSwgLi4ub3B0aW9ucyB9O1xuICBpZiAodHlwZW9mIG9wdHMuc3RyaWN0WmVyb3MgPT09ICdib29sZWFuJykge1xuICAgIG9wdHMucmVsYXhaZXJvcyA9IG9wdHMuc3RyaWN0WmVyb3MgPT09IGZhbHNlO1xuICB9XG5cbiAgbGV0IHJlbGF4ID0gU3RyaW5nKG9wdHMucmVsYXhaZXJvcyk7XG4gIGxldCBzaG9ydGhhbmQgPSBTdHJpbmcob3B0cy5zaG9ydGhhbmQpO1xuICBsZXQgY2FwdHVyZSA9IFN0cmluZyhvcHRzLmNhcHR1cmUpO1xuICBsZXQgd3JhcCA9IFN0cmluZyhvcHRzLndyYXApO1xuICBsZXQgY2FjaGVLZXkgPSBtaW4gKyAnOicgKyBtYXggKyAnPScgKyByZWxheCArIHNob3J0aGFuZCArIGNhcHR1cmUgKyB3cmFwO1xuXG4gIGlmICh0b1JlZ2V4UmFuZ2UuY2FjaGUuaGFzT3duUHJvcGVydHkoY2FjaGVLZXkpKSB7XG4gICAgcmV0dXJuIHRvUmVnZXhSYW5nZS5jYWNoZVtjYWNoZUtleV0ucmVzdWx0O1xuICB9XG5cbiAgbGV0IGEgPSBNYXRoLm1pbihtaW4sIG1heCk7XG4gIGxldCBiID0gTWF0aC5tYXgobWluLCBtYXgpO1xuXG4gIGlmIChNYXRoLmFicyhhIC0gYikgPT09IDEpIHtcbiAgICBsZXQgcmVzdWx0ID0gbWluICsgJ3wnICsgbWF4O1xuICAgIGlmIChvcHRzLmNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBgKCR7cmVzdWx0fSlgO1xuICAgIH1cbiAgICBpZiAob3B0cy53cmFwID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcmV0dXJuIGAoPzoke3Jlc3VsdH0pYDtcbiAgfVxuXG4gIGxldCBpc1BhZGRlZCA9IGhhc1BhZGRpbmcobWluKSB8fCBoYXNQYWRkaW5nKG1heCk7XG4gIGxldCBzdGF0ZSA9IHsgbWluLCBtYXgsIGEsIGIgfTtcbiAgbGV0IHBvc2l0aXZlcyA9IFtdO1xuICBsZXQgbmVnYXRpdmVzID0gW107XG5cbiAgaWYgKGlzUGFkZGVkKSB7XG4gICAgc3RhdGUuaXNQYWRkZWQgPSBpc1BhZGRlZDtcbiAgICBzdGF0ZS5tYXhMZW4gPSBTdHJpbmcoc3RhdGUubWF4KS5sZW5ndGg7XG4gIH1cblxuICBpZiAoYSA8IDApIHtcbiAgICBsZXQgbmV3TWluID0gYiA8IDAgPyBNYXRoLmFicyhiKSA6IDE7XG4gICAgbmVnYXRpdmVzID0gc3BsaXRUb1BhdHRlcm5zKG5ld01pbiwgTWF0aC5hYnMoYSksIHN0YXRlLCBvcHRzKTtcbiAgICBhID0gc3RhdGUuYSA9IDA7XG4gIH1cblxuICBpZiAoYiA+PSAwKSB7XG4gICAgcG9zaXRpdmVzID0gc3BsaXRUb1BhdHRlcm5zKGEsIGIsIHN0YXRlLCBvcHRzKTtcbiAgfVxuXG4gIHN0YXRlLm5lZ2F0aXZlcyA9IG5lZ2F0aXZlcztcbiAgc3RhdGUucG9zaXRpdmVzID0gcG9zaXRpdmVzO1xuICBzdGF0ZS5yZXN1bHQgPSBjb2xsYXRlUGF0dGVybnMobmVnYXRpdmVzLCBwb3NpdGl2ZXMsIG9wdHMpO1xuXG4gIGlmIChvcHRzLmNhcHR1cmUgPT09IHRydWUpIHtcbiAgICBzdGF0ZS5yZXN1bHQgPSBgKCR7c3RhdGUucmVzdWx0fSlgO1xuICB9IGVsc2UgaWYgKG9wdHMud3JhcCAhPT0gZmFsc2UgJiYgKHBvc2l0aXZlcy5sZW5ndGggKyBuZWdhdGl2ZXMubGVuZ3RoKSA+IDEpIHtcbiAgICBzdGF0ZS5yZXN1bHQgPSBgKD86JHtzdGF0ZS5yZXN1bHR9KWA7XG4gIH1cblxuICB0b1JlZ2V4UmFuZ2UuY2FjaGVbY2FjaGVLZXldID0gc3RhdGU7XG4gIHJldHVybiBzdGF0ZS5yZXN1bHQ7XG59O1xuXG5mdW5jdGlvbiBjb2xsYXRlUGF0dGVybnMobmVnLCBwb3MsIG9wdGlvbnMpIHtcbiAgbGV0IG9ubHlOZWdhdGl2ZSA9IGZpbHRlclBhdHRlcm5zKG5lZywgcG9zLCAnLScsIGZhbHNlLCBvcHRpb25zKSB8fCBbXTtcbiAgbGV0IG9ubHlQb3NpdGl2ZSA9IGZpbHRlclBhdHRlcm5zKHBvcywgbmVnLCAnJywgZmFsc2UsIG9wdGlvbnMpIHx8IFtdO1xuICBsZXQgaW50ZXJzZWN0ZWQgPSBmaWx0ZXJQYXR0ZXJucyhuZWcsIHBvcywgJy0/JywgdHJ1ZSwgb3B0aW9ucykgfHwgW107XG4gIGxldCBzdWJwYXR0ZXJucyA9IG9ubHlOZWdhdGl2ZS5jb25jYXQoaW50ZXJzZWN0ZWQpLmNvbmNhdChvbmx5UG9zaXRpdmUpO1xuICByZXR1cm4gc3VicGF0dGVybnMuam9pbignfCcpO1xufVxuXG5mdW5jdGlvbiBzcGxpdFRvUmFuZ2VzKG1pbiwgbWF4KSB7XG4gIGxldCBuaW5lcyA9IDE7XG4gIGxldCB6ZXJvcyA9IDE7XG5cbiAgbGV0IHN0b3AgPSBjb3VudE5pbmVzKG1pbiwgbmluZXMpO1xuICBsZXQgc3RvcHMgPSBuZXcgU2V0KFttYXhdKTtcblxuICB3aGlsZSAobWluIDw9IHN0b3AgJiYgc3RvcCA8PSBtYXgpIHtcbiAgICBzdG9wcy5hZGQoc3RvcCk7XG4gICAgbmluZXMgKz0gMTtcbiAgICBzdG9wID0gY291bnROaW5lcyhtaW4sIG5pbmVzKTtcbiAgfVxuXG4gIHN0b3AgPSBjb3VudFplcm9zKG1heCArIDEsIHplcm9zKSAtIDE7XG5cbiAgd2hpbGUgKG1pbiA8IHN0b3AgJiYgc3RvcCA8PSBtYXgpIHtcbiAgICBzdG9wcy5hZGQoc3RvcCk7XG4gICAgemVyb3MgKz0gMTtcbiAgICBzdG9wID0gY291bnRaZXJvcyhtYXggKyAxLCB6ZXJvcykgLSAxO1xuICB9XG5cbiAgc3RvcHMgPSBbLi4uc3RvcHNdO1xuICBzdG9wcy5zb3J0KGNvbXBhcmUpO1xuICByZXR1cm4gc3RvcHM7XG59XG5cbi8qKlxuICogQ29udmVydCBhIHJhbmdlIHRvIGEgcmVnZXggcGF0dGVyblxuICogQHBhcmFtIHtOdW1iZXJ9IGBzdGFydGBcbiAqIEBwYXJhbSB7TnVtYmVyfSBgc3RvcGBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiByYW5nZVRvUGF0dGVybihzdGFydCwgc3RvcCwgb3B0aW9ucykge1xuICBpZiAoc3RhcnQgPT09IHN0b3ApIHtcbiAgICByZXR1cm4geyBwYXR0ZXJuOiBzdGFydCwgY291bnQ6IFtdLCBkaWdpdHM6IDAgfTtcbiAgfVxuXG4gIGxldCB6aXBwZWQgPSB6aXAoc3RhcnQsIHN0b3ApO1xuICBsZXQgZGlnaXRzID0gemlwcGVkLmxlbmd0aDtcbiAgbGV0IHBhdHRlcm4gPSAnJztcbiAgbGV0IGNvdW50ID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZ2l0czsgaSsrKSB7XG4gICAgbGV0IFtzdGFydERpZ2l0LCBzdG9wRGlnaXRdID0gemlwcGVkW2ldO1xuXG4gICAgaWYgKHN0YXJ0RGlnaXQgPT09IHN0b3BEaWdpdCkge1xuICAgICAgcGF0dGVybiArPSBzdGFydERpZ2l0O1xuXG4gICAgfSBlbHNlIGlmIChzdGFydERpZ2l0ICE9PSAnMCcgfHwgc3RvcERpZ2l0ICE9PSAnOScpIHtcbiAgICAgIHBhdHRlcm4gKz0gdG9DaGFyYWN0ZXJDbGFzcyhzdGFydERpZ2l0LCBzdG9wRGlnaXQsIG9wdGlvbnMpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvdW50KSB7XG4gICAgcGF0dGVybiArPSBvcHRpb25zLnNob3J0aGFuZCA9PT0gdHJ1ZSA/ICdcXFxcZCcgOiAnWzAtOV0nO1xuICB9XG5cbiAgcmV0dXJuIHsgcGF0dGVybiwgY291bnQ6IFtjb3VudF0sIGRpZ2l0cyB9O1xufVxuXG5mdW5jdGlvbiBzcGxpdFRvUGF0dGVybnMobWluLCBtYXgsIHRvaywgb3B0aW9ucykge1xuICBsZXQgcmFuZ2VzID0gc3BsaXRUb1JhbmdlcyhtaW4sIG1heCk7XG4gIGxldCB0b2tlbnMgPSBbXTtcbiAgbGV0IHN0YXJ0ID0gbWluO1xuICBsZXQgcHJldjtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBtYXggPSByYW5nZXNbaV07XG4gICAgbGV0IG9iaiA9IHJhbmdlVG9QYXR0ZXJuKFN0cmluZyhzdGFydCksIFN0cmluZyhtYXgpLCBvcHRpb25zKTtcbiAgICBsZXQgemVyb3MgPSAnJztcblxuICAgIGlmICghdG9rLmlzUGFkZGVkICYmIHByZXYgJiYgcHJldi5wYXR0ZXJuID09PSBvYmoucGF0dGVybikge1xuICAgICAgaWYgKHByZXYuY291bnQubGVuZ3RoID4gMSkge1xuICAgICAgICBwcmV2LmNvdW50LnBvcCgpO1xuICAgICAgfVxuXG4gICAgICBwcmV2LmNvdW50LnB1c2gob2JqLmNvdW50WzBdKTtcbiAgICAgIHByZXYuc3RyaW5nID0gcHJldi5wYXR0ZXJuICsgdG9RdWFudGlmaWVyKHByZXYuY291bnQpO1xuICAgICAgc3RhcnQgPSBtYXggKyAxO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHRvay5pc1BhZGRlZCkge1xuICAgICAgemVyb3MgPSBwYWRaZXJvcyhtYXgsIHRvaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgb2JqLnN0cmluZyA9IHplcm9zICsgb2JqLnBhdHRlcm4gKyB0b1F1YW50aWZpZXIob2JqLmNvdW50KTtcbiAgICB0b2tlbnMucHVzaChvYmopO1xuICAgIHN0YXJ0ID0gbWF4ICsgMTtcbiAgICBwcmV2ID0gb2JqO1xuICB9XG5cbiAgcmV0dXJuIHRva2Vucztcbn1cblxuZnVuY3Rpb24gZmlsdGVyUGF0dGVybnMoYXJyLCBjb21wYXJpc29uLCBwcmVmaXgsIGludGVyc2VjdGlvbiwgb3B0aW9ucykge1xuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgZm9yIChsZXQgZWxlIG9mIGFycikge1xuICAgIGxldCB7IHN0cmluZyB9ID0gZWxlO1xuXG4gICAgLy8gb25seSBwdXNoIGlmIF9ib3RoXyBhcmUgbmVnYXRpdmUuLi5cbiAgICBpZiAoIWludGVyc2VjdGlvbiAmJiAhY29udGFpbnMoY29tcGFyaXNvbiwgJ3N0cmluZycsIHN0cmluZykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHByZWZpeCArIHN0cmluZyk7XG4gICAgfVxuXG4gICAgLy8gb3IgX2JvdGhfIGFyZSBwb3NpdGl2ZVxuICAgIGlmIChpbnRlcnNlY3Rpb24gJiYgY29udGFpbnMoY29tcGFyaXNvbiwgJ3N0cmluZycsIHN0cmluZykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHByZWZpeCArIHN0cmluZyk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogWmlwIHN0cmluZ3NcbiAqL1xuXG5mdW5jdGlvbiB6aXAoYSwgYikge1xuICBsZXQgYXJyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykgYXJyLnB1c2goW2FbaV0sIGJbaV1dKTtcbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIHJldHVybiBhID4gYiA/IDEgOiBiID4gYSA/IC0xIDogMDtcbn1cblxuZnVuY3Rpb24gY29udGFpbnMoYXJyLCBrZXksIHZhbCkge1xuICByZXR1cm4gYXJyLnNvbWUoZWxlID0+IGVsZVtrZXldID09PSB2YWwpO1xufVxuXG5mdW5jdGlvbiBjb3VudE5pbmVzKG1pbiwgbGVuKSB7XG4gIHJldHVybiBOdW1iZXIoU3RyaW5nKG1pbikuc2xpY2UoMCwgLWxlbikgKyAnOScucmVwZWF0KGxlbikpO1xufVxuXG5mdW5jdGlvbiBjb3VudFplcm9zKGludGVnZXIsIHplcm9zKSB7XG4gIHJldHVybiBpbnRlZ2VyIC0gKGludGVnZXIgJSBNYXRoLnBvdygxMCwgemVyb3MpKTtcbn1cblxuZnVuY3Rpb24gdG9RdWFudGlmaWVyKGRpZ2l0cykge1xuICBsZXQgW3N0YXJ0ID0gMCwgc3RvcCA9ICcnXSA9IGRpZ2l0cztcbiAgaWYgKHN0b3AgfHwgc3RhcnQgPiAxKSB7XG4gICAgcmV0dXJuIGB7JHtzdGFydCArIChzdG9wID8gJywnICsgc3RvcCA6ICcnKX19YDtcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIHRvQ2hhcmFjdGVyQ2xhc3MoYSwgYiwgb3B0aW9ucykge1xuICByZXR1cm4gYFske2F9JHsoYiAtIGEgPT09IDEpID8gJycgOiAnLSd9JHtifV1gO1xufVxuXG5mdW5jdGlvbiBoYXNQYWRkaW5nKHN0cikge1xuICByZXR1cm4gL14tPygwKylcXGQvLnRlc3Qoc3RyKTtcbn1cblxuZnVuY3Rpb24gcGFkWmVyb3ModmFsdWUsIHRvaywgb3B0aW9ucykge1xuICBpZiAoIXRvay5pc1BhZGRlZCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGxldCBkaWZmID0gTWF0aC5hYnModG9rLm1heExlbiAtIFN0cmluZyh2YWx1ZSkubGVuZ3RoKTtcbiAgbGV0IHJlbGF4ID0gb3B0aW9ucy5yZWxheFplcm9zICE9PSBmYWxzZTtcblxuICBzd2l0Y2ggKGRpZmYpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHJlbGF4ID8gJzA/JyA6ICcwJztcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gcmVsYXggPyAnMHswLDJ9JyA6ICcwMCc7XG4gICAgZGVmYXVsdDoge1xuICAgICAgcmV0dXJuIHJlbGF4ID8gYDB7MCwke2RpZmZ9fWAgOiBgMHske2RpZmZ9fWA7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2FjaGVcbiAqL1xuXG50b1JlZ2V4UmFuZ2UuY2FjaGUgPSB7fTtcbnRvUmVnZXhSYW5nZS5jbGVhckNhY2hlID0gKCkgPT4gKHRvUmVnZXhSYW5nZS5jYWNoZSA9IHt9KTtcblxuLyoqXG4gKiBFeHBvc2UgYHRvUmVnZXhSYW5nZWBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUmVnZXhSYW5nZTtcbiIsICIvKiFcbiAqIGZpbGwtcmFuZ2UgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2ZpbGwtcmFuZ2U+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbmNvbnN0IHRvUmVnZXhSYW5nZSA9IHJlcXVpcmUoJ3RvLXJlZ2V4LXJhbmdlJyk7XG5cbmNvbnN0IGlzT2JqZWN0ID0gdmFsID0+IHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xuXG5jb25zdCB0cmFuc2Zvcm0gPSB0b051bWJlciA9PiB7XG4gIHJldHVybiB2YWx1ZSA9PiB0b051bWJlciA9PT0gdHJ1ZSA/IE51bWJlcih2YWx1ZSkgOiBTdHJpbmcodmFsdWUpO1xufTtcblxuY29uc3QgaXNWYWxpZFZhbHVlID0gdmFsdWUgPT4ge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPT0gJycpO1xufTtcblxuY29uc3QgaXNOdW1iZXIgPSBudW0gPT4gTnVtYmVyLmlzSW50ZWdlcigrbnVtKTtcblxuY29uc3QgemVyb3MgPSBpbnB1dCA9PiB7XG4gIGxldCB2YWx1ZSA9IGAke2lucHV0fWA7XG4gIGxldCBpbmRleCA9IC0xO1xuICBpZiAodmFsdWVbMF0gPT09ICctJykgdmFsdWUgPSB2YWx1ZS5zbGljZSgxKTtcbiAgaWYgKHZhbHVlID09PSAnMCcpIHJldHVybiBmYWxzZTtcbiAgd2hpbGUgKHZhbHVlWysraW5kZXhdID09PSAnMCcpO1xuICByZXR1cm4gaW5kZXggPiAwO1xufTtcblxuY29uc3Qgc3RyaW5naWZ5ID0gKHN0YXJ0LCBlbmQsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucy5zdHJpbmdpZnkgPT09IHRydWU7XG59O1xuXG5jb25zdCBwYWQgPSAoaW5wdXQsIG1heExlbmd0aCwgdG9OdW1iZXIpID0+IHtcbiAgaWYgKG1heExlbmd0aCA+IDApIHtcbiAgICBsZXQgZGFzaCA9IGlucHV0WzBdID09PSAnLScgPyAnLScgOiAnJztcbiAgICBpZiAoZGFzaCkgaW5wdXQgPSBpbnB1dC5zbGljZSgxKTtcbiAgICBpbnB1dCA9IChkYXNoICsgaW5wdXQucGFkU3RhcnQoZGFzaCA/IG1heExlbmd0aCAtIDEgOiBtYXhMZW5ndGgsICcwJykpO1xuICB9XG4gIGlmICh0b051bWJlciA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gU3RyaW5nKGlucHV0KTtcbiAgfVxuICByZXR1cm4gaW5wdXQ7XG59O1xuXG5jb25zdCB0b01heExlbiA9IChpbnB1dCwgbWF4TGVuZ3RoKSA9PiB7XG4gIGxldCBuZWdhdGl2ZSA9IGlucHV0WzBdID09PSAnLScgPyAnLScgOiAnJztcbiAgaWYgKG5lZ2F0aXZlKSB7XG4gICAgaW5wdXQgPSBpbnB1dC5zbGljZSgxKTtcbiAgICBtYXhMZW5ndGgtLTtcbiAgfVxuICB3aGlsZSAoaW5wdXQubGVuZ3RoIDwgbWF4TGVuZ3RoKSBpbnB1dCA9ICcwJyArIGlucHV0O1xuICByZXR1cm4gbmVnYXRpdmUgPyAoJy0nICsgaW5wdXQpIDogaW5wdXQ7XG59O1xuXG5jb25zdCB0b1NlcXVlbmNlID0gKHBhcnRzLCBvcHRpb25zKSA9PiB7XG4gIHBhcnRzLm5lZ2F0aXZlcy5zb3J0KChhLCBiKSA9PiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMCk7XG4gIHBhcnRzLnBvc2l0aXZlcy5zb3J0KChhLCBiKSA9PiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMCk7XG5cbiAgbGV0IHByZWZpeCA9IG9wdGlvbnMuY2FwdHVyZSA/ICcnIDogJz86JztcbiAgbGV0IHBvc2l0aXZlcyA9ICcnO1xuICBsZXQgbmVnYXRpdmVzID0gJyc7XG4gIGxldCByZXN1bHQ7XG5cbiAgaWYgKHBhcnRzLnBvc2l0aXZlcy5sZW5ndGgpIHtcbiAgICBwb3NpdGl2ZXMgPSBwYXJ0cy5wb3NpdGl2ZXMuam9pbignfCcpO1xuICB9XG5cbiAgaWYgKHBhcnRzLm5lZ2F0aXZlcy5sZW5ndGgpIHtcbiAgICBuZWdhdGl2ZXMgPSBgLSgke3ByZWZpeH0ke3BhcnRzLm5lZ2F0aXZlcy5qb2luKCd8Jyl9KWA7XG4gIH1cblxuICBpZiAocG9zaXRpdmVzICYmIG5lZ2F0aXZlcykge1xuICAgIHJlc3VsdCA9IGAke3Bvc2l0aXZlc318JHtuZWdhdGl2ZXN9YDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBwb3NpdGl2ZXMgfHwgbmVnYXRpdmVzO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMud3JhcCkge1xuICAgIHJldHVybiBgKCR7cHJlZml4fSR7cmVzdWx0fSlgO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IHRvUmFuZ2UgPSAoYSwgYiwgaXNOdW1iZXJzLCBvcHRpb25zKSA9PiB7XG4gIGlmIChpc051bWJlcnMpIHtcbiAgICByZXR1cm4gdG9SZWdleFJhbmdlKGEsIGIsIHsgd3JhcDogZmFsc2UsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICBsZXQgc3RhcnQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGEpO1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIHN0YXJ0O1xuXG4gIGxldCBzdG9wID0gU3RyaW5nLmZyb21DaGFyQ29kZShiKTtcbiAgcmV0dXJuIGBbJHtzdGFydH0tJHtzdG9wfV1gO1xufTtcblxuY29uc3QgdG9SZWdleCA9IChzdGFydCwgZW5kLCBvcHRpb25zKSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KHN0YXJ0KSkge1xuICAgIGxldCB3cmFwID0gb3B0aW9ucy53cmFwID09PSB0cnVlO1xuICAgIGxldCBwcmVmaXggPSBvcHRpb25zLmNhcHR1cmUgPyAnJyA6ICc/Oic7XG4gICAgcmV0dXJuIHdyYXAgPyBgKCR7cHJlZml4fSR7c3RhcnQuam9pbignfCcpfSlgIDogc3RhcnQuam9pbignfCcpO1xuICB9XG4gIHJldHVybiB0b1JlZ2V4UmFuZ2Uoc3RhcnQsIGVuZCwgb3B0aW9ucyk7XG59O1xuXG5jb25zdCByYW5nZUVycm9yID0gKC4uLmFyZ3MpID0+IHtcbiAgcmV0dXJuIG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHJhbmdlIGFyZ3VtZW50czogJyArIHV0aWwuaW5zcGVjdCguLi5hcmdzKSk7XG59O1xuXG5jb25zdCBpbnZhbGlkUmFuZ2UgPSAoc3RhcnQsIGVuZCwgb3B0aW9ucykgPT4ge1xuICBpZiAob3B0aW9ucy5zdHJpY3RSYW5nZXMgPT09IHRydWUpIHRocm93IHJhbmdlRXJyb3IoW3N0YXJ0LCBlbmRdKTtcbiAgcmV0dXJuIFtdO1xufTtcblxuY29uc3QgaW52YWxpZFN0ZXAgPSAoc3RlcCwgb3B0aW9ucykgPT4ge1xuICBpZiAob3B0aW9ucy5zdHJpY3RSYW5nZXMgPT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBFeHBlY3RlZCBzdGVwIFwiJHtzdGVwfVwiIHRvIGJlIGEgbnVtYmVyYCk7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuY29uc3QgZmlsbE51bWJlcnMgPSAoc3RhcnQsIGVuZCwgc3RlcCA9IDEsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgYSA9IE51bWJlcihzdGFydCk7XG4gIGxldCBiID0gTnVtYmVyKGVuZCk7XG5cbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGEpIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGIpKSB7XG4gICAgaWYgKG9wdGlvbnMuc3RyaWN0UmFuZ2VzID09PSB0cnVlKSB0aHJvdyByYW5nZUVycm9yKFtzdGFydCwgZW5kXSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLy8gZml4IG5lZ2F0aXZlIHplcm9cbiAgaWYgKGEgPT09IDApIGEgPSAwO1xuICBpZiAoYiA9PT0gMCkgYiA9IDA7XG5cbiAgbGV0IGRlc2NlbmRpbmcgPSBhID4gYjtcbiAgbGV0IHN0YXJ0U3RyaW5nID0gU3RyaW5nKHN0YXJ0KTtcbiAgbGV0IGVuZFN0cmluZyA9IFN0cmluZyhlbmQpO1xuICBsZXQgc3RlcFN0cmluZyA9IFN0cmluZyhzdGVwKTtcbiAgc3RlcCA9IE1hdGgubWF4KE1hdGguYWJzKHN0ZXApLCAxKTtcblxuICBsZXQgcGFkZGVkID0gemVyb3Moc3RhcnRTdHJpbmcpIHx8IHplcm9zKGVuZFN0cmluZykgfHwgemVyb3Moc3RlcFN0cmluZyk7XG4gIGxldCBtYXhMZW4gPSBwYWRkZWQgPyBNYXRoLm1heChzdGFydFN0cmluZy5sZW5ndGgsIGVuZFN0cmluZy5sZW5ndGgsIHN0ZXBTdHJpbmcubGVuZ3RoKSA6IDA7XG4gIGxldCB0b051bWJlciA9IHBhZGRlZCA9PT0gZmFsc2UgJiYgc3RyaW5naWZ5KHN0YXJ0LCBlbmQsIG9wdGlvbnMpID09PSBmYWxzZTtcbiAgbGV0IGZvcm1hdCA9IG9wdGlvbnMudHJhbnNmb3JtIHx8IHRyYW5zZm9ybSh0b051bWJlcik7XG5cbiAgaWYgKG9wdGlvbnMudG9SZWdleCAmJiBzdGVwID09PSAxKSB7XG4gICAgcmV0dXJuIHRvUmFuZ2UodG9NYXhMZW4oc3RhcnQsIG1heExlbiksIHRvTWF4TGVuKGVuZCwgbWF4TGVuKSwgdHJ1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICBsZXQgcGFydHMgPSB7IG5lZ2F0aXZlczogW10sIHBvc2l0aXZlczogW10gfTtcbiAgbGV0IHB1c2ggPSBudW0gPT4gcGFydHNbbnVtIDwgMCA/ICduZWdhdGl2ZXMnIDogJ3Bvc2l0aXZlcyddLnB1c2goTWF0aC5hYnMobnVtKSk7XG4gIGxldCByYW5nZSA9IFtdO1xuICBsZXQgaW5kZXggPSAwO1xuXG4gIHdoaWxlIChkZXNjZW5kaW5nID8gYSA+PSBiIDogYSA8PSBiKSB7XG4gICAgaWYgKG9wdGlvbnMudG9SZWdleCA9PT0gdHJ1ZSAmJiBzdGVwID4gMSkge1xuICAgICAgcHVzaChhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFuZ2UucHVzaChwYWQoZm9ybWF0KGEsIGluZGV4KSwgbWF4TGVuLCB0b051bWJlcikpO1xuICAgIH1cbiAgICBhID0gZGVzY2VuZGluZyA/IGEgLSBzdGVwIDogYSArIHN0ZXA7XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIGlmIChvcHRpb25zLnRvUmVnZXggPT09IHRydWUpIHtcbiAgICByZXR1cm4gc3RlcCA+IDFcbiAgICAgID8gdG9TZXF1ZW5jZShwYXJ0cywgb3B0aW9ucylcbiAgICAgIDogdG9SZWdleChyYW5nZSwgbnVsbCwgeyB3cmFwOiBmYWxzZSwgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn07XG5cbmNvbnN0IGZpbGxMZXR0ZXJzID0gKHN0YXJ0LCBlbmQsIHN0ZXAgPSAxLCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKCghaXNOdW1iZXIoc3RhcnQpICYmIHN0YXJ0Lmxlbmd0aCA+IDEpIHx8ICghaXNOdW1iZXIoZW5kKSAmJiBlbmQubGVuZ3RoID4gMSkpIHtcbiAgICByZXR1cm4gaW52YWxpZFJhbmdlKHN0YXJ0LCBlbmQsIG9wdGlvbnMpO1xuICB9XG5cblxuICBsZXQgZm9ybWF0ID0gb3B0aW9ucy50cmFuc2Zvcm0gfHwgKHZhbCA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKHZhbCkpO1xuICBsZXQgYSA9IGAke3N0YXJ0fWAuY2hhckNvZGVBdCgwKTtcbiAgbGV0IGIgPSBgJHtlbmR9YC5jaGFyQ29kZUF0KDApO1xuXG4gIGxldCBkZXNjZW5kaW5nID0gYSA+IGI7XG4gIGxldCBtaW4gPSBNYXRoLm1pbihhLCBiKTtcbiAgbGV0IG1heCA9IE1hdGgubWF4KGEsIGIpO1xuXG4gIGlmIChvcHRpb25zLnRvUmVnZXggJiYgc3RlcCA9PT0gMSkge1xuICAgIHJldHVybiB0b1JhbmdlKG1pbiwgbWF4LCBmYWxzZSwgb3B0aW9ucyk7XG4gIH1cblxuICBsZXQgcmFuZ2UgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcblxuICB3aGlsZSAoZGVzY2VuZGluZyA/IGEgPj0gYiA6IGEgPD0gYikge1xuICAgIHJhbmdlLnB1c2goZm9ybWF0KGEsIGluZGV4KSk7XG4gICAgYSA9IGRlc2NlbmRpbmcgPyBhIC0gc3RlcCA6IGEgKyBzdGVwO1xuICAgIGluZGV4Kys7XG4gIH1cblxuICBpZiAob3B0aW9ucy50b1JlZ2V4ID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRvUmVnZXgocmFuZ2UsIG51bGwsIHsgd3JhcDogZmFsc2UsIG9wdGlvbnMgfSk7XG4gIH1cblxuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5jb25zdCBmaWxsID0gKHN0YXJ0LCBlbmQsIHN0ZXAsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAoZW5kID09IG51bGwgJiYgaXNWYWxpZFZhbHVlKHN0YXJ0KSkge1xuICAgIHJldHVybiBbc3RhcnRdO1xuICB9XG5cbiAgaWYgKCFpc1ZhbGlkVmFsdWUoc3RhcnQpIHx8ICFpc1ZhbGlkVmFsdWUoZW5kKSkge1xuICAgIHJldHVybiBpbnZhbGlkUmFuZ2Uoc3RhcnQsIGVuZCwgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHN0ZXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmlsbChzdGFydCwgZW5kLCAxLCB7IHRyYW5zZm9ybTogc3RlcCB9KTtcbiAgfVxuXG4gIGlmIChpc09iamVjdChzdGVwKSkge1xuICAgIHJldHVybiBmaWxsKHN0YXJ0LCBlbmQsIDAsIHN0ZXApO1xuICB9XG5cbiAgbGV0IG9wdHMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgaWYgKG9wdHMuY2FwdHVyZSA9PT0gdHJ1ZSkgb3B0cy53cmFwID0gdHJ1ZTtcbiAgc3RlcCA9IHN0ZXAgfHwgb3B0cy5zdGVwIHx8IDE7XG5cbiAgaWYgKCFpc051bWJlcihzdGVwKSkge1xuICAgIGlmIChzdGVwICE9IG51bGwgJiYgIWlzT2JqZWN0KHN0ZXApKSByZXR1cm4gaW52YWxpZFN0ZXAoc3RlcCwgb3B0cyk7XG4gICAgcmV0dXJuIGZpbGwoc3RhcnQsIGVuZCwgMSwgc3RlcCk7XG4gIH1cblxuICBpZiAoaXNOdW1iZXIoc3RhcnQpICYmIGlzTnVtYmVyKGVuZCkpIHtcbiAgICByZXR1cm4gZmlsbE51bWJlcnMoc3RhcnQsIGVuZCwgc3RlcCwgb3B0cyk7XG4gIH1cblxuICByZXR1cm4gZmlsbExldHRlcnMoc3RhcnQsIGVuZCwgTWF0aC5tYXgoTWF0aC5hYnMoc3RlcCksIDEpLCBvcHRzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsbDtcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGZpbGwgPSByZXF1aXJlKCdmaWxsLXJhbmdlJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuY29uc3QgY29tcGlsZSA9IChhc3QsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgd2FsayA9IChub2RlLCBwYXJlbnQgPSB7fSkgPT4ge1xuICAgIGxldCBpbnZhbGlkQmxvY2sgPSB1dGlscy5pc0ludmFsaWRCcmFjZShwYXJlbnQpO1xuICAgIGxldCBpbnZhbGlkTm9kZSA9IG5vZGUuaW52YWxpZCA9PT0gdHJ1ZSAmJiBvcHRpb25zLmVzY2FwZUludmFsaWQgPT09IHRydWU7XG4gICAgbGV0IGludmFsaWQgPSBpbnZhbGlkQmxvY2sgPT09IHRydWUgfHwgaW52YWxpZE5vZGUgPT09IHRydWU7XG4gICAgbGV0IHByZWZpeCA9IG9wdGlvbnMuZXNjYXBlSW52YWxpZCA9PT0gdHJ1ZSA/ICdcXFxcJyA6ICcnO1xuICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgIGlmIChub2RlLmlzT3BlbiA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHByZWZpeCArIG5vZGUudmFsdWU7XG4gICAgfVxuICAgIGlmIChub2RlLmlzQ2xvc2UgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBwcmVmaXggKyBub2RlLnZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdvcGVuJykge1xuICAgICAgcmV0dXJuIGludmFsaWQgPyAocHJlZml4ICsgbm9kZS52YWx1ZSkgOiAnKCc7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ2Nsb3NlJykge1xuICAgICAgcmV0dXJuIGludmFsaWQgPyAocHJlZml4ICsgbm9kZS52YWx1ZSkgOiAnKSc7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ2NvbW1hJykge1xuICAgICAgcmV0dXJuIG5vZGUucHJldi50eXBlID09PSAnY29tbWEnID8gJycgOiAoaW52YWxpZCA/IG5vZGUudmFsdWUgOiAnfCcpO1xuICAgIH1cblxuICAgIGlmIChub2RlLnZhbHVlKSB7XG4gICAgICByZXR1cm4gbm9kZS52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5ub2RlcyAmJiBub2RlLnJhbmdlcyA+IDApIHtcbiAgICAgIGxldCBhcmdzID0gdXRpbHMucmVkdWNlKG5vZGUubm9kZXMpO1xuICAgICAgbGV0IHJhbmdlID0gZmlsbCguLi5hcmdzLCB7IC4uLm9wdGlvbnMsIHdyYXA6IGZhbHNlLCB0b1JlZ2V4OiB0cnVlIH0pO1xuXG4gICAgICBpZiAocmFuZ2UubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIHJldHVybiBhcmdzLmxlbmd0aCA+IDEgJiYgcmFuZ2UubGVuZ3RoID4gMSA/IGAoJHtyYW5nZX0pYCA6IHJhbmdlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVzKSB7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBub2RlLm5vZGVzKSB7XG4gICAgICAgIG91dHB1dCArPSB3YWxrKGNoaWxkLCBub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICByZXR1cm4gd2Fsayhhc3QpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZmlsbCA9IHJlcXVpcmUoJ2ZpbGwtcmFuZ2UnKTtcbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5Jyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuY29uc3QgYXBwZW5kID0gKHF1ZXVlID0gJycsIHN0YXNoID0gJycsIGVuY2xvc2UgPSBmYWxzZSkgPT4ge1xuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgcXVldWUgPSBbXS5jb25jYXQocXVldWUpO1xuICBzdGFzaCA9IFtdLmNvbmNhdChzdGFzaCk7XG5cbiAgaWYgKCFzdGFzaC5sZW5ndGgpIHJldHVybiBxdWV1ZTtcbiAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZW5jbG9zZSA/IHV0aWxzLmZsYXR0ZW4oc3Rhc2gpLm1hcChlbGUgPT4gYHske2VsZX19YCkgOiBzdGFzaDtcbiAgfVxuXG4gIGZvciAobGV0IGl0ZW0gb2YgcXVldWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2YgaXRlbSkge1xuICAgICAgICByZXN1bHQucHVzaChhcHBlbmQodmFsdWUsIHN0YXNoLCBlbmNsb3NlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGVsZSBvZiBzdGFzaCkge1xuICAgICAgICBpZiAoZW5jbG9zZSA9PT0gdHJ1ZSAmJiB0eXBlb2YgZWxlID09PSAnc3RyaW5nJykgZWxlID0gYHske2VsZX19YDtcbiAgICAgICAgcmVzdWx0LnB1c2goQXJyYXkuaXNBcnJheShlbGUpID8gYXBwZW5kKGl0ZW0sIGVsZSwgZW5jbG9zZSkgOiAoaXRlbSArIGVsZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdXRpbHMuZmxhdHRlbihyZXN1bHQpO1xufTtcblxuY29uc3QgZXhwYW5kID0gKGFzdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCByYW5nZUxpbWl0ID0gb3B0aW9ucy5yYW5nZUxpbWl0ID09PSB2b2lkIDAgPyAxMDAwIDogb3B0aW9ucy5yYW5nZUxpbWl0O1xuXG4gIGxldCB3YWxrID0gKG5vZGUsIHBhcmVudCA9IHt9KSA9PiB7XG4gICAgbm9kZS5xdWV1ZSA9IFtdO1xuXG4gICAgbGV0IHAgPSBwYXJlbnQ7XG4gICAgbGV0IHEgPSBwYXJlbnQucXVldWU7XG5cbiAgICB3aGlsZSAocC50eXBlICE9PSAnYnJhY2UnICYmIHAudHlwZSAhPT0gJ3Jvb3QnICYmIHAucGFyZW50KSB7XG4gICAgICBwID0gcC5wYXJlbnQ7XG4gICAgICBxID0gcC5xdWV1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5pbnZhbGlkIHx8IG5vZGUuZG9sbGFyKSB7XG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHN0cmluZ2lmeShub2RlLCBvcHRpb25zKSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdicmFjZScgJiYgbm9kZS5pbnZhbGlkICE9PSB0cnVlICYmIG5vZGUubm9kZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIFsne30nXSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVzICYmIG5vZGUucmFuZ2VzID4gMCkge1xuICAgICAgbGV0IGFyZ3MgPSB1dGlscy5yZWR1Y2Uobm9kZS5ub2Rlcyk7XG5cbiAgICAgIGlmICh1dGlscy5leGNlZWRzTGltaXQoLi4uYXJncywgb3B0aW9ucy5zdGVwLCByYW5nZUxpbWl0KSkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZXhwYW5kZWQgYXJyYXkgbGVuZ3RoIGV4Y2VlZHMgcmFuZ2UgbGltaXQuIFVzZSBvcHRpb25zLnJhbmdlTGltaXQgdG8gaW5jcmVhc2Ugb3IgZGlzYWJsZSB0aGUgbGltaXQuJyk7XG4gICAgICB9XG5cbiAgICAgIGxldCByYW5nZSA9IGZpbGwoLi4uYXJncywgb3B0aW9ucyk7XG4gICAgICBpZiAocmFuZ2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJhbmdlID0gc3RyaW5naWZ5KG5vZGUsIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHJhbmdlKSk7XG4gICAgICBub2RlLm5vZGVzID0gW107XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGVuY2xvc2UgPSB1dGlscy5lbmNsb3NlQnJhY2Uobm9kZSk7XG4gICAgbGV0IHF1ZXVlID0gbm9kZS5xdWV1ZTtcbiAgICBsZXQgYmxvY2sgPSBub2RlO1xuXG4gICAgd2hpbGUgKGJsb2NrLnR5cGUgIT09ICdicmFjZScgJiYgYmxvY2sudHlwZSAhPT0gJ3Jvb3QnICYmIGJsb2NrLnBhcmVudCkge1xuICAgICAgYmxvY2sgPSBibG9jay5wYXJlbnQ7XG4gICAgICBxdWV1ZSA9IGJsb2NrLnF1ZXVlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5ub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGNoaWxkID0gbm9kZS5ub2Rlc1tpXTtcblxuICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdjb21tYScgJiYgbm9kZS50eXBlID09PSAnYnJhY2UnKSB7XG4gICAgICAgIGlmIChpID09PSAxKSBxdWV1ZS5wdXNoKCcnKTtcbiAgICAgICAgcXVldWUucHVzaCgnJyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ2Nsb3NlJykge1xuICAgICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHF1ZXVlLCBlbmNsb3NlKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQudmFsdWUgJiYgY2hpbGQudHlwZSAhPT0gJ29wZW4nKSB7XG4gICAgICAgIHF1ZXVlLnB1c2goYXBwZW5kKHF1ZXVlLnBvcCgpLCBjaGlsZC52YWx1ZSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLm5vZGVzKSB7XG4gICAgICAgIHdhbGsoY2hpbGQsIG5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBxdWV1ZTtcbiAgfTtcblxuICByZXR1cm4gdXRpbHMuZmxhdHRlbih3YWxrKGFzdCkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBhbmQ7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTUFYX0xFTkdUSDogMTAyNCAqIDY0LFxuXG4gIC8vIERpZ2l0c1xuICBDSEFSXzA6ICcwJywgLyogMCAqL1xuICBDSEFSXzk6ICc5JywgLyogOSAqL1xuXG4gIC8vIEFscGhhYmV0IGNoYXJzLlxuICBDSEFSX1VQUEVSQ0FTRV9BOiAnQScsIC8qIEEgKi9cbiAgQ0hBUl9MT1dFUkNBU0VfQTogJ2EnLCAvKiBhICovXG4gIENIQVJfVVBQRVJDQVNFX1o6ICdaJywgLyogWiAqL1xuICBDSEFSX0xPV0VSQ0FTRV9aOiAneicsIC8qIHogKi9cblxuICBDSEFSX0xFRlRfUEFSRU5USEVTRVM6ICcoJywgLyogKCAqL1xuICBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTOiAnKScsIC8qICkgKi9cblxuICBDSEFSX0FTVEVSSVNLOiAnKicsIC8qICogKi9cblxuICAvLyBOb24tYWxwaGFiZXRpYyBjaGFycy5cbiAgQ0hBUl9BTVBFUlNBTkQ6ICcmJywgLyogJiAqL1xuICBDSEFSX0FUOiAnQCcsIC8qIEAgKi9cbiAgQ0hBUl9CQUNLU0xBU0g6ICdcXFxcJywgLyogXFwgKi9cbiAgQ0hBUl9CQUNLVElDSzogJ2AnLCAvKiBgICovXG4gIENIQVJfQ0FSUklBR0VfUkVUVVJOOiAnXFxyJywgLyogXFxyICovXG4gIENIQVJfQ0lSQ1VNRkxFWF9BQ0NFTlQ6ICdeJywgLyogXiAqL1xuICBDSEFSX0NPTE9OOiAnOicsIC8qIDogKi9cbiAgQ0hBUl9DT01NQTogJywnLCAvKiAsICovXG4gIENIQVJfRE9MTEFSOiAnJCcsIC8qIC4gKi9cbiAgQ0hBUl9ET1Q6ICcuJywgLyogLiAqL1xuICBDSEFSX0RPVUJMRV9RVU9URTogJ1wiJywgLyogXCIgKi9cbiAgQ0hBUl9FUVVBTDogJz0nLCAvKiA9ICovXG4gIENIQVJfRVhDTEFNQVRJT05fTUFSSzogJyEnLCAvKiAhICovXG4gIENIQVJfRk9STV9GRUVEOiAnXFxmJywgLyogXFxmICovXG4gIENIQVJfRk9SV0FSRF9TTEFTSDogJy8nLCAvKiAvICovXG4gIENIQVJfSEFTSDogJyMnLCAvKiAjICovXG4gIENIQVJfSFlQSEVOX01JTlVTOiAnLScsIC8qIC0gKi9cbiAgQ0hBUl9MRUZUX0FOR0xFX0JSQUNLRVQ6ICc8JywgLyogPCAqL1xuICBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0U6ICd7JywgLyogeyAqL1xuICBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQ6ICdbJywgLyogWyAqL1xuICBDSEFSX0xJTkVfRkVFRDogJ1xcbicsIC8qIFxcbiAqL1xuICBDSEFSX05PX0JSRUFLX1NQQUNFOiAnXFx1MDBBMCcsIC8qIFxcdTAwQTAgKi9cbiAgQ0hBUl9QRVJDRU5UOiAnJScsIC8qICUgKi9cbiAgQ0hBUl9QTFVTOiAnKycsIC8qICsgKi9cbiAgQ0hBUl9RVUVTVElPTl9NQVJLOiAnPycsIC8qID8gKi9cbiAgQ0hBUl9SSUdIVF9BTkdMRV9CUkFDS0VUOiAnPicsIC8qID4gKi9cbiAgQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRTogJ30nLCAvKiB9ICovXG4gIENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQ6ICddJywgLyogXSAqL1xuICBDSEFSX1NFTUlDT0xPTjogJzsnLCAvKiA7ICovXG4gIENIQVJfU0lOR0xFX1FVT1RFOiAnXFwnJywgLyogJyAqL1xuICBDSEFSX1NQQUNFOiAnICcsIC8qICAgKi9cbiAgQ0hBUl9UQUI6ICdcXHQnLCAvKiBcXHQgKi9cbiAgQ0hBUl9VTkRFUlNDT1JFOiAnXycsIC8qIF8gKi9cbiAgQ0hBUl9WRVJUSUNBTF9MSU5FOiAnfCcsIC8qIHwgKi9cbiAgQ0hBUl9aRVJPX1dJRFRIX05PQlJFQUtfU1BBQ0U6ICdcXHVGRUZGJyAvKiBcXHVGRUZGICovXG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9zdHJpbmdpZnknKTtcblxuLyoqXG4gKiBDb25zdGFudHNcbiAqL1xuXG5jb25zdCB7XG4gIE1BWF9MRU5HVEgsXG4gIENIQVJfQkFDS1NMQVNILCAvKiBcXCAqL1xuICBDSEFSX0JBQ0tUSUNLLCAvKiBgICovXG4gIENIQVJfQ09NTUEsIC8qICwgKi9cbiAgQ0hBUl9ET1QsIC8qIC4gKi9cbiAgQ0hBUl9MRUZUX1BBUkVOVEhFU0VTLCAvKiAoICovXG4gIENIQVJfUklHSFRfUEFSRU5USEVTRVMsIC8qICkgKi9cbiAgQ0hBUl9MRUZUX0NVUkxZX0JSQUNFLCAvKiB7ICovXG4gIENIQVJfUklHSFRfQ1VSTFlfQlJBQ0UsIC8qIH0gKi9cbiAgQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VULCAvKiBbICovXG4gIENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQsIC8qIF0gKi9cbiAgQ0hBUl9ET1VCTEVfUVVPVEUsIC8qIFwiICovXG4gIENIQVJfU0lOR0xFX1FVT1RFLCAvKiAnICovXG4gIENIQVJfTk9fQlJFQUtfU1BBQ0UsXG4gIENIQVJfWkVST19XSURUSF9OT0JSRUFLX1NQQUNFXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuLyoqXG4gKiBwYXJzZVxuICovXG5cbmNvbnN0IHBhcnNlID0gKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIHN0cmluZycpO1xuICB9XG5cbiAgbGV0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICBsZXQgbWF4ID0gdHlwZW9mIG9wdHMubWF4TGVuZ3RoID09PSAnbnVtYmVyJyA/IE1hdGgubWluKE1BWF9MRU5HVEgsIG9wdHMubWF4TGVuZ3RoKSA6IE1BWF9MRU5HVEg7XG4gIGlmIChpbnB1dC5sZW5ndGggPiBtYXgpIHtcbiAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYElucHV0IGxlbmd0aCAoJHtpbnB1dC5sZW5ndGh9KSwgZXhjZWVkcyBtYXggY2hhcmFjdGVycyAoJHttYXh9KWApO1xuICB9XG5cbiAgbGV0IGFzdCA9IHsgdHlwZTogJ3Jvb3QnLCBpbnB1dCwgbm9kZXM6IFtdIH07XG4gIGxldCBzdGFjayA9IFthc3RdO1xuICBsZXQgYmxvY2sgPSBhc3Q7XG4gIGxldCBwcmV2ID0gYXN0O1xuICBsZXQgYnJhY2tldHMgPSAwO1xuICBsZXQgbGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICBsZXQgaW5kZXggPSAwO1xuICBsZXQgZGVwdGggPSAwO1xuICBsZXQgdmFsdWU7XG4gIGxldCBtZW1vID0ge307XG5cbiAgLyoqXG4gICAqIEhlbHBlcnNcbiAgICovXG5cbiAgY29uc3QgYWR2YW5jZSA9ICgpID0+IGlucHV0W2luZGV4KytdO1xuICBjb25zdCBwdXNoID0gbm9kZSA9PiB7XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ3RleHQnICYmIHByZXYudHlwZSA9PT0gJ2RvdCcpIHtcbiAgICAgIHByZXYudHlwZSA9ICd0ZXh0JztcbiAgICB9XG5cbiAgICBpZiAocHJldiAmJiBwcmV2LnR5cGUgPT09ICd0ZXh0JyAmJiBub2RlLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgcHJldi52YWx1ZSArPSBub2RlLnZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJsb2NrLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgbm9kZS5wYXJlbnQgPSBibG9jaztcbiAgICBub2RlLnByZXYgPSBwcmV2O1xuICAgIHByZXYgPSBub2RlO1xuICAgIHJldHVybiBub2RlO1xuICB9O1xuXG4gIHB1c2goeyB0eXBlOiAnYm9zJyB9KTtcblxuICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICBibG9jayA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgIHZhbHVlID0gYWR2YW5jZSgpO1xuXG4gICAgLyoqXG4gICAgICogSW52YWxpZCBjaGFyc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX1pFUk9fV0lEVEhfTk9CUkVBS19TUEFDRSB8fCB2YWx1ZSA9PT0gQ0hBUl9OT19CUkVBS19TUEFDRSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXNjYXBlZCBjaGFyc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0JBQ0tTTEFTSCkge1xuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWU6IChvcHRpb25zLmtlZXBFc2NhcGluZyA/IHZhbHVlIDogJycpICsgYWR2YW5jZSgpIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmlnaHQgc3F1YXJlIGJyYWNrZXQgKGxpdGVyYWwpOiAnXSdcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVCkge1xuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWU6ICdcXFxcJyArIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGVmdCBzcXVhcmUgYnJhY2tldDogJ1snXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVCkge1xuICAgICAgYnJhY2tldHMrKztcblxuICAgICAgbGV0IGNsb3NlZCA9IHRydWU7XG4gICAgICBsZXQgbmV4dDtcblxuICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoICYmIChuZXh0ID0gYWR2YW5jZSgpKSkge1xuICAgICAgICB2YWx1ZSArPSBuZXh0O1xuXG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgICAgICBicmFja2V0cysrO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHQgPT09IENIQVJfQkFDS1NMQVNIKSB7XG4gICAgICAgICAgdmFsdWUgKz0gYWR2YW5jZSgpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHQgPT09IENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgICAgICBicmFja2V0cy0tO1xuXG4gICAgICAgICAgaWYgKGJyYWNrZXRzID09PSAwKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJlbnRoZXNlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0xFRlRfUEFSRU5USEVTRVMpIHtcbiAgICAgIGJsb2NrID0gcHVzaCh7IHR5cGU6ICdwYXJlbicsIG5vZGVzOiBbXSB9KTtcbiAgICAgIHN0YWNrLnB1c2goYmxvY2spO1xuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfUklHSFRfUEFSRU5USEVTRVMpIHtcbiAgICAgIGlmIChibG9jay50eXBlICE9PSAncGFyZW4nKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGJsb2NrID0gc3RhY2sucG9wKCk7XG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGJsb2NrID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBRdW90ZXM6ICd8XCJ8YFxuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0RPVUJMRV9RVU9URSB8fCB2YWx1ZSA9PT0gQ0hBUl9TSU5HTEVfUVVPVEUgfHwgdmFsdWUgPT09IENIQVJfQkFDS1RJQ0spIHtcbiAgICAgIGxldCBvcGVuID0gdmFsdWU7XG4gICAgICBsZXQgbmV4dDtcblxuICAgICAgaWYgKG9wdGlvbnMua2VlcFF1b3RlcyAhPT0gdHJ1ZSkge1xuICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGggJiYgKG5leHQgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX0JBQ0tTTEFTSCkge1xuICAgICAgICAgIHZhbHVlICs9IG5leHQgKyBhZHZhbmNlKCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dCA9PT0gb3Blbikge1xuICAgICAgICAgIGlmIChvcHRpb25zLmtlZXBRdW90ZXMgPT09IHRydWUpIHZhbHVlICs9IG5leHQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSArPSBuZXh0O1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExlZnQgY3VybHkgYnJhY2U6ICd7J1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgIGRlcHRoKys7XG5cbiAgICAgIGxldCBkb2xsYXIgPSBwcmV2LnZhbHVlICYmIHByZXYudmFsdWUuc2xpY2UoLTEpID09PSAnJCcgfHwgYmxvY2suZG9sbGFyID09PSB0cnVlO1xuICAgICAgbGV0IGJyYWNlID0ge1xuICAgICAgICB0eXBlOiAnYnJhY2UnLFxuICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICBjbG9zZTogZmFsc2UsXG4gICAgICAgIGRvbGxhcixcbiAgICAgICAgZGVwdGgsXG4gICAgICAgIGNvbW1hczogMCxcbiAgICAgICAgcmFuZ2VzOiAwLFxuICAgICAgICBub2RlczogW11cbiAgICAgIH07XG5cbiAgICAgIGJsb2NrID0gcHVzaChicmFjZSk7XG4gICAgICBzdGFjay5wdXNoKGJsb2NrKTtcbiAgICAgIHB1c2goeyB0eXBlOiAnb3BlbicsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmlnaHQgY3VybHkgYnJhY2U6ICd9J1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFKSB7XG4gICAgICBpZiAoYmxvY2sudHlwZSAhPT0gJ2JyYWNlJykge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCB0eXBlID0gJ2Nsb3NlJztcbiAgICAgIGJsb2NrID0gc3RhY2sucG9wKCk7XG4gICAgICBibG9jay5jbG9zZSA9IHRydWU7XG5cbiAgICAgIHB1c2goeyB0eXBlLCB2YWx1ZSB9KTtcbiAgICAgIGRlcHRoLS07XG5cbiAgICAgIGJsb2NrID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21tYTogJywnXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfQ09NTUEgJiYgZGVwdGggPiAwKSB7XG4gICAgICBpZiAoYmxvY2sucmFuZ2VzID4gMCkge1xuICAgICAgICBibG9jay5yYW5nZXMgPSAwO1xuICAgICAgICBsZXQgb3BlbiA9IGJsb2NrLm5vZGVzLnNoaWZ0KCk7XG4gICAgICAgIGJsb2NrLm5vZGVzID0gW29wZW4sIHsgdHlwZTogJ3RleHQnLCB2YWx1ZTogc3RyaW5naWZ5KGJsb2NrKSB9XTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdjb21tYScsIHZhbHVlIH0pO1xuICAgICAgYmxvY2suY29tbWFzKys7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb3Q6ICcuJ1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0RPVCAmJiBkZXB0aCA+IDAgJiYgYmxvY2suY29tbWFzID09PSAwKSB7XG4gICAgICBsZXQgc2libGluZ3MgPSBibG9jay5ub2RlcztcblxuICAgICAgaWYgKGRlcHRoID09PSAwIHx8IHNpYmxpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICAgIGJsb2NrLnJhbmdlID0gW107XG4gICAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIHByZXYudHlwZSA9ICdyYW5nZSc7XG5cbiAgICAgICAgaWYgKGJsb2NrLm5vZGVzLmxlbmd0aCAhPT0gMyAmJiBibG9jay5ub2Rlcy5sZW5ndGggIT09IDUpIHtcbiAgICAgICAgICBibG9jay5pbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICBibG9jay5yYW5nZXMgPSAwO1xuICAgICAgICAgIHByZXYudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJsb2NrLnJhbmdlcysrO1xuICAgICAgICBibG9jay5hcmdzID0gW107XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldi50eXBlID09PSAncmFuZ2UnKSB7XG4gICAgICAgIHNpYmxpbmdzLnBvcCgpO1xuXG4gICAgICAgIGxldCBiZWZvcmUgPSBzaWJsaW5nc1tzaWJsaW5ncy5sZW5ndGggLSAxXTtcbiAgICAgICAgYmVmb3JlLnZhbHVlICs9IHByZXYudmFsdWUgKyB2YWx1ZTtcbiAgICAgICAgcHJldiA9IGJlZm9yZTtcbiAgICAgICAgYmxvY2sucmFuZ2VzLS07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2RvdCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGV4dFxuICAgICAqL1xuXG4gICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gIH1cblxuICAvLyBNYXJrIGltYmFsYW5jZWQgYnJhY2VzIGFuZCBicmFja2V0cyBhcyBpbnZhbGlkXG4gIGRvIHtcbiAgICBibG9jayA9IHN0YWNrLnBvcCgpO1xuXG4gICAgaWYgKGJsb2NrLnR5cGUgIT09ICdyb290Jykge1xuICAgICAgYmxvY2subm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgaWYgKCFub2RlLm5vZGVzKSB7XG4gICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ29wZW4nKSBub2RlLmlzT3BlbiA9IHRydWU7XG4gICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ2Nsb3NlJykgbm9kZS5pc0Nsb3NlID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoIW5vZGUubm9kZXMpIG5vZGUudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgICBub2RlLmludmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gZ2V0IHRoZSBsb2NhdGlvbiBvZiB0aGUgYmxvY2sgb24gcGFyZW50Lm5vZGVzIChibG9jaydzIHNpYmxpbmdzKVxuICAgICAgbGV0IHBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgbGV0IGluZGV4ID0gcGFyZW50Lm5vZGVzLmluZGV4T2YoYmxvY2spO1xuICAgICAgLy8gcmVwbGFjZSB0aGUgKGludmFsaWQpIGJsb2NrIHdpdGggaXQncyBub2Rlc1xuICAgICAgcGFyZW50Lm5vZGVzLnNwbGljZShpbmRleCwgMSwgLi4uYmxvY2subm9kZXMpO1xuICAgIH1cbiAgfSB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCk7XG5cbiAgcHVzaCh7IHR5cGU6ICdlb3MnIH0pO1xuICByZXR1cm4gYXN0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vbGliL3N0cmluZ2lmeScpO1xuY29uc3QgY29tcGlsZSA9IHJlcXVpcmUoJy4vbGliL2NvbXBpbGUnKTtcbmNvbnN0IGV4cGFuZCA9IHJlcXVpcmUoJy4vbGliL2V4cGFuZCcpO1xuY29uc3QgcGFyc2UgPSByZXF1aXJlKCcuL2xpYi9wYXJzZScpO1xuXG4vKipcbiAqIEV4cGFuZCB0aGUgZ2l2ZW4gcGF0dGVybiBvciBjcmVhdGUgYSByZWdleC1jb21wYXRpYmxlIHN0cmluZy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYnJhY2VzID0gcmVxdWlyZSgnYnJhY2VzJyk7XG4gKiBjb25zb2xlLmxvZyhicmFjZXMoJ3thLGIsY30nLCB7IGNvbXBpbGU6IHRydWUgfSkpOyAvLz0+IFsnKGF8YnxjKSddXG4gKiBjb25zb2xlLmxvZyhicmFjZXMoJ3thLGIsY30nKSk7IC8vPT4gWydhJywgJ2InLCAnYyddXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jb25zdCBicmFjZXMgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgb3V0cHV0ID0gW107XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgZm9yIChsZXQgcGF0dGVybiBvZiBpbnB1dCkge1xuICAgICAgbGV0IHJlc3VsdCA9IGJyYWNlcy5jcmVhdGUocGF0dGVybiwgb3B0aW9ucyk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKC4uLnJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaChyZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBbXS5jb25jYXQoYnJhY2VzLmNyZWF0ZShpbnB1dCwgb3B0aW9ucykpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5leHBhbmQgPT09IHRydWUgJiYgb3B0aW9ucy5ub2R1cGVzID09PSB0cnVlKSB7XG4gICAgb3V0cHV0ID0gWy4uLm5ldyBTZXQob3V0cHV0KV07XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIHdpdGggdGhlIGdpdmVuIGBvcHRpb25zYC5cbiAqXG4gKiBgYGBqc1xuICogLy8gYnJhY2VzLnBhcnNlKHBhdHRlcm4sIFssIG9wdGlvbnNdKTtcbiAqIGNvbnN0IGFzdCA9IGJyYWNlcy5wYXJzZSgnYS97YixjfS9kJyk7XG4gKiBjb25zb2xlLmxvZyhhc3QpO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0dGVybiBCcmFjZSBwYXR0ZXJuIHRvIHBhcnNlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIEFTVFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5icmFjZXMucGFyc2UgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4gcGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBicmFjZXMgc3RyaW5nIGZyb20gYW4gQVNULCBvciBhbiBBU1Qgbm9kZS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYnJhY2VzID0gcmVxdWlyZSgnYnJhY2VzJyk7XG4gKiBsZXQgYXN0ID0gYnJhY2VzLnBhcnNlKCdmb28ve2EsYn0vYmFyJyk7XG4gKiBjb25zb2xlLmxvZyhzdHJpbmdpZnkoYXN0Lm5vZGVzWzJdKSk7IC8vPT4gJ3thLGJ9J1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBCcmFjZSBwYXR0ZXJuIG9yIEFTVC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLnN0cmluZ2lmeSA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeShicmFjZXMucGFyc2UoaW5wdXQsIG9wdGlvbnMpLCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gc3RyaW5naWZ5KGlucHV0LCBvcHRpb25zKTtcbn07XG5cbi8qKlxuICogQ29tcGlsZXMgYSBicmFjZSBwYXR0ZXJuIGludG8gYSByZWdleC1jb21wYXRpYmxlLCBvcHRpbWl6ZWQgc3RyaW5nLlxuICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBtYWluIFticmFjZXNdKCNicmFjZXMpIGZ1bmN0aW9uIGJ5IGRlZmF1bHQuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuICogY29uc29sZS5sb2coYnJhY2VzLmNvbXBpbGUoJ2Eve2IsY30vZCcpKTtcbiAqIC8vPT4gWydhLyhifGMpL2QnXVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBCcmFjZSBwYXR0ZXJuIG9yIEFTVC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLmNvbXBpbGUgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgIGlucHV0ID0gYnJhY2VzLnBhcnNlKGlucHV0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gY29tcGlsZShpbnB1dCwgb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEV4cGFuZHMgYSBicmFjZSBwYXR0ZXJuIGludG8gYW4gYXJyYXkuIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGVcbiAqIG1haW4gW2JyYWNlc10oI2JyYWNlcykgZnVuY3Rpb24gd2hlbiBgb3B0aW9ucy5leHBhbmRgIGlzIHRydWUuIEJlZm9yZVxuICogdXNpbmcgdGhpcyBtZXRob2QgaXQncyByZWNvbW1lbmRlZCB0aGF0IHlvdSByZWFkIHRoZSBbcGVyZm9ybWFuY2Ugbm90ZXNdKCNwZXJmb3JtYW5jZSkpXG4gKiBhbmQgYWR2YW50YWdlcyBvZiB1c2luZyBbLmNvbXBpbGVdKCNjb21waWxlKSBpbnN0ZWFkLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBicmFjZXMgPSByZXF1aXJlKCdicmFjZXMnKTtcbiAqIGNvbnNvbGUubG9nKGJyYWNlcy5leHBhbmQoJ2Eve2IsY30vZCcpKTtcbiAqIC8vPT4gWydhL2IvZCcsICdhL2MvZCddO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHBhdHRlcm5gIEJyYWNlIHBhdHRlcm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLmV4cGFuZCA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgaW5wdXQgPSBicmFjZXMucGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgbGV0IHJlc3VsdCA9IGV4cGFuZChpbnB1dCwgb3B0aW9ucyk7XG5cbiAgLy8gZmlsdGVyIG91dCBlbXB0eSBzdHJpbmdzIGlmIHNwZWNpZmllZFxuICBpZiAob3B0aW9ucy5ub2VtcHR5ID09PSB0cnVlKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcihCb29sZWFuKTtcbiAgfVxuXG4gIC8vIGZpbHRlciBvdXQgZHVwbGljYXRlcyBpZiBzcGVjaWZpZWRcbiAgaWYgKG9wdGlvbnMubm9kdXBlcyA9PT0gdHJ1ZSkge1xuICAgIHJlc3VsdCA9IFsuLi5uZXcgU2V0KHJlc3VsdCldO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUHJvY2Vzc2VzIGEgYnJhY2UgcGF0dGVybiBhbmQgcmV0dXJucyBlaXRoZXIgYW4gZXhwYW5kZWQgYXJyYXlcbiAqIChpZiBgb3B0aW9ucy5leHBhbmRgIGlzIHRydWUpLCBhIGhpZ2hseSBvcHRpbWl6ZWQgcmVnZXgtY29tcGF0aWJsZSBzdHJpbmcuXG4gKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIG1haW4gW2JyYWNlc10oI2JyYWNlcykgZnVuY3Rpb24uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuICogY29uc29sZS5sb2coYnJhY2VzLmNyZWF0ZSgndXNlci17MjAwLi4zMDB9L3Byb2plY3Qte2EsYixjfS17MS4uMTB9JykpXG4gKiAvLz0+ICd1c2VyLSgyMFswLTldfDJbMS05XVswLTldfDMwMCkvcHJvamVjdC0oYXxifGMpLShbMS05XXwxMCknXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgcGF0dGVybmAgQnJhY2UgcGF0dGVyblxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgZXhwYW5kZWQgdmFsdWVzLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5icmFjZXMuY3JlYXRlID0gKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKGlucHV0ID09PSAnJyB8fCBpbnB1dC5sZW5ndGggPCAzKSB7XG4gICAgcmV0dXJuIFtpbnB1dF07XG4gIH1cblxuIHJldHVybiBvcHRpb25zLmV4cGFuZCAhPT0gdHJ1ZVxuICAgID8gYnJhY2VzLmNvbXBpbGUoaW5wdXQsIG9wdGlvbnMpXG4gICAgOiBicmFjZXMuZXhwYW5kKGlucHV0LCBvcHRpb25zKTtcbn07XG5cbi8qKlxuICogRXhwb3NlIFwiYnJhY2VzXCJcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJyYWNlcztcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBXSU5fU0xBU0ggPSAnXFxcXFxcXFwvJztcbmNvbnN0IFdJTl9OT19TTEFTSCA9IGBbXiR7V0lOX1NMQVNIfV1gO1xuXG4vKipcbiAqIFBvc2l4IGdsb2IgcmVnZXhcbiAqL1xuXG5jb25zdCBET1RfTElURVJBTCA9ICdcXFxcLic7XG5jb25zdCBQTFVTX0xJVEVSQUwgPSAnXFxcXCsnO1xuY29uc3QgUU1BUktfTElURVJBTCA9ICdcXFxcPyc7XG5jb25zdCBTTEFTSF9MSVRFUkFMID0gJ1xcXFwvJztcbmNvbnN0IE9ORV9DSEFSID0gJyg/PS4pJztcbmNvbnN0IFFNQVJLID0gJ1teL10nO1xuY29uc3QgRU5EX0FOQ0hPUiA9IGAoPzoke1NMQVNIX0xJVEVSQUx9fCQpYDtcbmNvbnN0IFNUQVJUX0FOQ0hPUiA9IGAoPzpefCR7U0xBU0hfTElURVJBTH0pYDtcbmNvbnN0IERPVFNfU0xBU0ggPSBgJHtET1RfTElURVJBTH17MSwyfSR7RU5EX0FOQ0hPUn1gO1xuY29uc3QgTk9fRE9UID0gYCg/ISR7RE9UX0xJVEVSQUx9KWA7XG5jb25zdCBOT19ET1RTID0gYCg/ISR7U1RBUlRfQU5DSE9SfSR7RE9UU19TTEFTSH0pYDtcbmNvbnN0IE5PX0RPVF9TTEFTSCA9IGAoPyEke0RPVF9MSVRFUkFMfXswLDF9JHtFTkRfQU5DSE9SfSlgO1xuY29uc3QgTk9fRE9UU19TTEFTSCA9IGAoPyEke0RPVFNfU0xBU0h9KWA7XG5jb25zdCBRTUFSS19OT19ET1QgPSBgW14uJHtTTEFTSF9MSVRFUkFMfV1gO1xuY29uc3QgU1RBUiA9IGAke1FNQVJLfSo/YDtcblxuY29uc3QgUE9TSVhfQ0hBUlMgPSB7XG4gIERPVF9MSVRFUkFMLFxuICBQTFVTX0xJVEVSQUwsXG4gIFFNQVJLX0xJVEVSQUwsXG4gIFNMQVNIX0xJVEVSQUwsXG4gIE9ORV9DSEFSLFxuICBRTUFSSyxcbiAgRU5EX0FOQ0hPUixcbiAgRE9UU19TTEFTSCxcbiAgTk9fRE9ULFxuICBOT19ET1RTLFxuICBOT19ET1RfU0xBU0gsXG4gIE5PX0RPVFNfU0xBU0gsXG4gIFFNQVJLX05PX0RPVCxcbiAgU1RBUixcbiAgU1RBUlRfQU5DSE9SXG59O1xuXG4vKipcbiAqIFdpbmRvd3MgZ2xvYiByZWdleFxuICovXG5cbmNvbnN0IFdJTkRPV1NfQ0hBUlMgPSB7XG4gIC4uLlBPU0lYX0NIQVJTLFxuXG4gIFNMQVNIX0xJVEVSQUw6IGBbJHtXSU5fU0xBU0h9XWAsXG4gIFFNQVJLOiBXSU5fTk9fU0xBU0gsXG4gIFNUQVI6IGAke1dJTl9OT19TTEFTSH0qP2AsXG4gIERPVFNfU0xBU0g6IGAke0RPVF9MSVRFUkFMfXsxLDJ9KD86WyR7V0lOX1NMQVNIfV18JClgLFxuICBOT19ET1Q6IGAoPyEke0RPVF9MSVRFUkFMfSlgLFxuICBOT19ET1RTOiBgKD8hKD86XnxbJHtXSU5fU0xBU0h9XSkke0RPVF9MSVRFUkFMfXsxLDJ9KD86WyR7V0lOX1NMQVNIfV18JCkpYCxcbiAgTk9fRE9UX1NMQVNIOiBgKD8hJHtET1RfTElURVJBTH17MCwxfSg/Olske1dJTl9TTEFTSH1dfCQpKWAsXG4gIE5PX0RPVFNfU0xBU0g6IGAoPyEke0RPVF9MSVRFUkFMfXsxLDJ9KD86WyR7V0lOX1NMQVNIfV18JCkpYCxcbiAgUU1BUktfTk9fRE9UOiBgW14uJHtXSU5fU0xBU0h9XWAsXG4gIFNUQVJUX0FOQ0hPUjogYCg/Ol58WyR7V0lOX1NMQVNIfV0pYCxcbiAgRU5EX0FOQ0hPUjogYCg/Olske1dJTl9TTEFTSH1dfCQpYFxufTtcblxuLyoqXG4gKiBQT1NJWCBCcmFja2V0IFJlZ2V4XG4gKi9cblxuY29uc3QgUE9TSVhfUkVHRVhfU09VUkNFID0ge1xuICBhbG51bTogJ2EtekEtWjAtOScsXG4gIGFscGhhOiAnYS16QS1aJyxcbiAgYXNjaWk6ICdcXFxceDAwLVxcXFx4N0YnLFxuICBibGFuazogJyBcXFxcdCcsXG4gIGNudHJsOiAnXFxcXHgwMC1cXFxceDFGXFxcXHg3RicsXG4gIGRpZ2l0OiAnMC05JyxcbiAgZ3JhcGg6ICdcXFxceDIxLVxcXFx4N0UnLFxuICBsb3dlcjogJ2EteicsXG4gIHByaW50OiAnXFxcXHgyMC1cXFxceDdFICcsXG4gIHB1bmN0OiAnXFxcXC0hXCIjJCUmXFwnKClcXFxcKissLi86Ozw9Pj9AW1xcXFxdXl9ge3x9ficsXG4gIHNwYWNlOiAnIFxcXFx0XFxcXHJcXFxcblxcXFx2XFxcXGYnLFxuICB1cHBlcjogJ0EtWicsXG4gIHdvcmQ6ICdBLVphLXowLTlfJyxcbiAgeGRpZ2l0OiAnQS1GYS1mMC05J1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1BWF9MRU5HVEg6IDEwMjQgKiA2NCxcbiAgUE9TSVhfUkVHRVhfU09VUkNFLFxuXG4gIC8vIHJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAgUkVHRVhfQkFDS1NMQVNIOiAvXFxcXCg/IVsqKz9eJHt9KHwpW1xcXV0pL2csXG4gIFJFR0VYX05PTl9TUEVDSUFMX0NIQVJTOiAvXlteQCFbXFxdLiwkKis/Xnt9KCl8XFxcXC9dKy8sXG4gIFJFR0VYX1NQRUNJQUxfQ0hBUlM6IC9bLSorPy5eJHt9KHwpW1xcXV0vLFxuICBSRUdFWF9TUEVDSUFMX0NIQVJTX0JBQ0tSRUY6IC8oXFxcXD8pKChcXFcpKFxcMyopKS9nLFxuICBSRUdFWF9TUEVDSUFMX0NIQVJTX0dMT0JBTDogLyhbLSorPy5eJHt9KHwpW1xcXV0pL2csXG4gIFJFR0VYX1JFTU9WRV9CQUNLU0xBU0g6IC8oPzpcXFsuKj9bXlxcXFxdXFxdfFxcXFwoPz0uKSkvZyxcblxuICAvLyBSZXBsYWNlIGdsb2JzIHdpdGggZXF1aXZhbGVudCBwYXR0ZXJucyB0byByZWR1Y2UgcGFyc2luZyB0aW1lLlxuICBSRVBMQUNFTUVOVFM6IHtcbiAgICAnKioqJzogJyonLFxuICAgICcqKi8qKic6ICcqKicsXG4gICAgJyoqLyoqLyoqJzogJyoqJ1xuICB9LFxuXG4gIC8vIERpZ2l0c1xuICBDSEFSXzA6IDQ4LCAvKiAwICovXG4gIENIQVJfOTogNTcsIC8qIDkgKi9cblxuICAvLyBBbHBoYWJldCBjaGFycy5cbiAgQ0hBUl9VUFBFUkNBU0VfQTogNjUsIC8qIEEgKi9cbiAgQ0hBUl9MT1dFUkNBU0VfQTogOTcsIC8qIGEgKi9cbiAgQ0hBUl9VUFBFUkNBU0VfWjogOTAsIC8qIFogKi9cbiAgQ0hBUl9MT1dFUkNBU0VfWjogMTIyLCAvKiB6ICovXG5cbiAgQ0hBUl9MRUZUX1BBUkVOVEhFU0VTOiA0MCwgLyogKCAqL1xuICBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTOiA0MSwgLyogKSAqL1xuXG4gIENIQVJfQVNURVJJU0s6IDQyLCAvKiAqICovXG5cbiAgLy8gTm9uLWFscGhhYmV0aWMgY2hhcnMuXG4gIENIQVJfQU1QRVJTQU5EOiAzOCwgLyogJiAqL1xuICBDSEFSX0FUOiA2NCwgLyogQCAqL1xuICBDSEFSX0JBQ0tXQVJEX1NMQVNIOiA5MiwgLyogXFwgKi9cbiAgQ0hBUl9DQVJSSUFHRV9SRVRVUk46IDEzLCAvKiBcXHIgKi9cbiAgQ0hBUl9DSVJDVU1GTEVYX0FDQ0VOVDogOTQsIC8qIF4gKi9cbiAgQ0hBUl9DT0xPTjogNTgsIC8qIDogKi9cbiAgQ0hBUl9DT01NQTogNDQsIC8qICwgKi9cbiAgQ0hBUl9ET1Q6IDQ2LCAvKiAuICovXG4gIENIQVJfRE9VQkxFX1FVT1RFOiAzNCwgLyogXCIgKi9cbiAgQ0hBUl9FUVVBTDogNjEsIC8qID0gKi9cbiAgQ0hBUl9FWENMQU1BVElPTl9NQVJLOiAzMywgLyogISAqL1xuICBDSEFSX0ZPUk1fRkVFRDogMTIsIC8qIFxcZiAqL1xuICBDSEFSX0ZPUldBUkRfU0xBU0g6IDQ3LCAvKiAvICovXG4gIENIQVJfR1JBVkVfQUNDRU5UOiA5NiwgLyogYCAqL1xuICBDSEFSX0hBU0g6IDM1LCAvKiAjICovXG4gIENIQVJfSFlQSEVOX01JTlVTOiA0NSwgLyogLSAqL1xuICBDSEFSX0xFRlRfQU5HTEVfQlJBQ0tFVDogNjAsIC8qIDwgKi9cbiAgQ0hBUl9MRUZUX0NVUkxZX0JSQUNFOiAxMjMsIC8qIHsgKi9cbiAgQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUOiA5MSwgLyogWyAqL1xuICBDSEFSX0xJTkVfRkVFRDogMTAsIC8qIFxcbiAqL1xuICBDSEFSX05PX0JSRUFLX1NQQUNFOiAxNjAsIC8qIFxcdTAwQTAgKi9cbiAgQ0hBUl9QRVJDRU5UOiAzNywgLyogJSAqL1xuICBDSEFSX1BMVVM6IDQzLCAvKiArICovXG4gIENIQVJfUVVFU1RJT05fTUFSSzogNjMsIC8qID8gKi9cbiAgQ0hBUl9SSUdIVF9BTkdMRV9CUkFDS0VUOiA2MiwgLyogPiAqL1xuICBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFOiAxMjUsIC8qIH0gKi9cbiAgQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVDogOTMsIC8qIF0gKi9cbiAgQ0hBUl9TRU1JQ09MT046IDU5LCAvKiA7ICovXG4gIENIQVJfU0lOR0xFX1FVT1RFOiAzOSwgLyogJyAqL1xuICBDSEFSX1NQQUNFOiAzMiwgLyogICAqL1xuICBDSEFSX1RBQjogOSwgLyogXFx0ICovXG4gIENIQVJfVU5ERVJTQ09SRTogOTUsIC8qIF8gKi9cbiAgQ0hBUl9WRVJUSUNBTF9MSU5FOiAxMjQsIC8qIHwgKi9cbiAgQ0hBUl9aRVJPX1dJRFRIX05PQlJFQUtfU1BBQ0U6IDY1Mjc5LCAvKiBcXHVGRUZGICovXG5cbiAgU0VQOiBwYXRoLnNlcCxcblxuICAvKipcbiAgICogQ3JlYXRlIEVYVEdMT0JfQ0hBUlNcbiAgICovXG5cbiAgZXh0Z2xvYkNoYXJzKGNoYXJzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICchJzogeyB0eXBlOiAnbmVnYXRlJywgb3BlbjogJyg/Oig/ISg/OicsIGNsb3NlOiBgKSkke2NoYXJzLlNUQVJ9KWAgfSxcbiAgICAgICc/JzogeyB0eXBlOiAncW1hcmsnLCBvcGVuOiAnKD86JywgY2xvc2U6ICcpPycgfSxcbiAgICAgICcrJzogeyB0eXBlOiAncGx1cycsIG9wZW46ICcoPzonLCBjbG9zZTogJykrJyB9LFxuICAgICAgJyonOiB7IHR5cGU6ICdzdGFyJywgb3BlbjogJyg/OicsIGNsb3NlOiAnKSonIH0sXG4gICAgICAnQCc6IHsgdHlwZTogJ2F0Jywgb3BlbjogJyg/OicsIGNsb3NlOiAnKScgfVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBHTE9CX0NIQVJTXG4gICAqL1xuXG4gIGdsb2JDaGFycyh3aW4zMikge1xuICAgIHJldHVybiB3aW4zMiA9PT0gdHJ1ZSA/IFdJTkRPV1NfQ0hBUlMgOiBQT1NJWF9DSEFSUztcbiAgfVxufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCB3aW4zMiA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG5jb25zdCB7XG4gIFJFR0VYX0JBQ0tTTEFTSCxcbiAgUkVHRVhfUkVNT1ZFX0JBQ0tTTEFTSCxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSUyxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSU19HTE9CQUxcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG5leHBvcnRzLmlzT2JqZWN0ID0gdmFsID0+IHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xuZXhwb3J0cy5oYXNSZWdleENoYXJzID0gc3RyID0+IFJFR0VYX1NQRUNJQUxfQ0hBUlMudGVzdChzdHIpO1xuZXhwb3J0cy5pc1JlZ2V4Q2hhciA9IHN0ciA9PiBzdHIubGVuZ3RoID09PSAxICYmIGV4cG9ydHMuaGFzUmVnZXhDaGFycyhzdHIpO1xuZXhwb3J0cy5lc2NhcGVSZWdleCA9IHN0ciA9PiBzdHIucmVwbGFjZShSRUdFWF9TUEVDSUFMX0NIQVJTX0dMT0JBTCwgJ1xcXFwkMScpO1xuZXhwb3J0cy50b1Bvc2l4U2xhc2hlcyA9IHN0ciA9PiBzdHIucmVwbGFjZShSRUdFWF9CQUNLU0xBU0gsICcvJyk7XG5cbmV4cG9ydHMucmVtb3ZlQmFja3NsYXNoZXMgPSBzdHIgPT4ge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoUkVHRVhfUkVNT1ZFX0JBQ0tTTEFTSCwgbWF0Y2ggPT4ge1xuICAgIHJldHVybiBtYXRjaCA9PT0gJ1xcXFwnID8gJycgOiBtYXRjaDtcbiAgfSk7XG59O1xuXG5leHBvcnRzLnN1cHBvcnRzTG9va2JlaGluZHMgPSAoKSA9PiB7XG4gIGNvbnN0IHNlZ3MgPSBwcm9jZXNzLnZlcnNpb24uc2xpY2UoMSkuc3BsaXQoJy4nKS5tYXAoTnVtYmVyKTtcbiAgaWYgKHNlZ3MubGVuZ3RoID09PSAzICYmIHNlZ3NbMF0gPj0gOSB8fCAoc2Vnc1swXSA9PT0gOCAmJiBzZWdzWzFdID49IDEwKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydHMuaXNXaW5kb3dzID0gb3B0aW9ucyA9PiB7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLndpbmRvd3MgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBvcHRpb25zLndpbmRvd3M7XG4gIH1cbiAgcmV0dXJuIHdpbjMyID09PSB0cnVlIHx8IHBhdGguc2VwID09PSAnXFxcXCc7XG59O1xuXG5leHBvcnRzLmVzY2FwZUxhc3QgPSAoaW5wdXQsIGNoYXIsIGxhc3RJZHgpID0+IHtcbiAgY29uc3QgaWR4ID0gaW5wdXQubGFzdEluZGV4T2YoY2hhciwgbGFzdElkeCk7XG4gIGlmIChpZHggPT09IC0xKSByZXR1cm4gaW5wdXQ7XG4gIGlmIChpbnB1dFtpZHggLSAxXSA9PT0gJ1xcXFwnKSByZXR1cm4gZXhwb3J0cy5lc2NhcGVMYXN0KGlucHV0LCBjaGFyLCBpZHggLSAxKTtcbiAgcmV0dXJuIGAke2lucHV0LnNsaWNlKDAsIGlkeCl9XFxcXCR7aW5wdXQuc2xpY2UoaWR4KX1gO1xufTtcblxuZXhwb3J0cy5yZW1vdmVQcmVmaXggPSAoaW5wdXQsIHN0YXRlID0ge30pID0+IHtcbiAgbGV0IG91dHB1dCA9IGlucHV0O1xuICBpZiAob3V0cHV0LnN0YXJ0c1dpdGgoJy4vJykpIHtcbiAgICBvdXRwdXQgPSBvdXRwdXQuc2xpY2UoMik7XG4gICAgc3RhdGUucHJlZml4ID0gJy4vJztcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufTtcblxuZXhwb3J0cy53cmFwT3V0cHV0ID0gKGlucHV0LCBzdGF0ZSA9IHt9LCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgcHJlcGVuZCA9IG9wdGlvbnMuY29udGFpbnMgPyAnJyA6ICdeJztcbiAgY29uc3QgYXBwZW5kID0gb3B0aW9ucy5jb250YWlucyA/ICcnIDogJyQnO1xuXG4gIGxldCBvdXRwdXQgPSBgJHtwcmVwZW5kfSg/OiR7aW5wdXR9KSR7YXBwZW5kfWA7XG4gIGlmIChzdGF0ZS5uZWdhdGVkID09PSB0cnVlKSB7XG4gICAgb3V0cHV0ID0gYCg/Ol4oPyEke291dHB1dH0pLiokKWA7XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IHtcbiAgQ0hBUl9BU1RFUklTSywgICAgICAgICAgICAgLyogKiAqL1xuICBDSEFSX0FULCAgICAgICAgICAgICAgICAgICAvKiBAICovXG4gIENIQVJfQkFDS1dBUkRfU0xBU0gsICAgICAgIC8qIFxcICovXG4gIENIQVJfQ09NTUEsICAgICAgICAgICAgICAgIC8qICwgKi9cbiAgQ0hBUl9ET1QsICAgICAgICAgICAgICAgICAgLyogLiAqL1xuICBDSEFSX0VYQ0xBTUFUSU9OX01BUkssICAgICAvKiAhICovXG4gIENIQVJfRk9SV0FSRF9TTEFTSCwgICAgICAgIC8qIC8gKi9cbiAgQ0hBUl9MRUZUX0NVUkxZX0JSQUNFLCAgICAgLyogeyAqL1xuICBDSEFSX0xFRlRfUEFSRU5USEVTRVMsICAgICAvKiAoICovXG4gIENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVCwgIC8qIFsgKi9cbiAgQ0hBUl9QTFVTLCAgICAgICAgICAgICAgICAgLyogKyAqL1xuICBDSEFSX1FVRVNUSU9OX01BUkssICAgICAgICAvKiA/ICovXG4gIENIQVJfUklHSFRfQ1VSTFlfQlJBQ0UsICAgIC8qIH0gKi9cbiAgQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUywgICAgLyogKSAqL1xuICBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUICAvKiBdICovXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuY29uc3QgaXNQYXRoU2VwYXJhdG9yID0gY29kZSA9PiB7XG4gIHJldHVybiBjb2RlID09PSBDSEFSX0ZPUldBUkRfU0xBU0ggfHwgY29kZSA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSDtcbn07XG5cbmNvbnN0IGRlcHRoID0gdG9rZW4gPT4ge1xuICBpZiAodG9rZW4uaXNQcmVmaXggIT09IHRydWUpIHtcbiAgICB0b2tlbi5kZXB0aCA9IHRva2VuLmlzR2xvYnN0YXIgPyBJbmZpbml0eSA6IDE7XG4gIH1cbn07XG5cbi8qKlxuICogUXVpY2tseSBzY2FucyBhIGdsb2IgcGF0dGVybiBhbmQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIGhhbmRmdWwgb2ZcbiAqIHVzZWZ1bCBwcm9wZXJ0aWVzLCBsaWtlIGBpc0dsb2JgLCBgcGF0aGAgKHRoZSBsZWFkaW5nIG5vbi1nbG9iLCBpZiBpdCBleGlzdHMpLFxuICogYGdsb2JgICh0aGUgYWN0dWFsIHBhdHRlcm4pLCBhbmQgYG5lZ2F0ZWRgICh0cnVlIGlmIHRoZSBwYXRoIHN0YXJ0cyB3aXRoIGAhYCkuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBtID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiBjb25zb2xlLmxvZyhwbS5zY2FuKCdmb28vYmFyLyouanMnKSk7XG4gKiB7IGlzR2xvYjogdHJ1ZSwgaW5wdXQ6ICdmb28vYmFyLyouanMnLCBiYXNlOiAnZm9vL2JhcicsIGdsb2I6ICcqLmpzJyB9XG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRva2VucyBhbmQgcmVnZXggc291cmNlIHN0cmluZy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuY29uc3Qgc2NhbiA9IChpbnB1dCwgb3B0aW9ucykgPT4ge1xuICBjb25zdCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcblxuICBjb25zdCBsZW5ndGggPSBpbnB1dC5sZW5ndGggLSAxO1xuICBjb25zdCBzY2FuVG9FbmQgPSBvcHRzLnBhcnRzID09PSB0cnVlIHx8IG9wdHMuc2NhblRvRW5kID09PSB0cnVlO1xuICBjb25zdCBzbGFzaGVzID0gW107XG4gIGNvbnN0IHRva2VucyA9IFtdO1xuICBjb25zdCBwYXJ0cyA9IFtdO1xuXG4gIGxldCBzdHIgPSBpbnB1dDtcbiAgbGV0IGluZGV4ID0gLTE7XG4gIGxldCBzdGFydCA9IDA7XG4gIGxldCBsYXN0SW5kZXggPSAwO1xuICBsZXQgaXNCcmFjZSA9IGZhbHNlO1xuICBsZXQgaXNCcmFja2V0ID0gZmFsc2U7XG4gIGxldCBpc0dsb2IgPSBmYWxzZTtcbiAgbGV0IGlzRXh0Z2xvYiA9IGZhbHNlO1xuICBsZXQgaXNHbG9ic3RhciA9IGZhbHNlO1xuICBsZXQgYnJhY2VFc2NhcGVkID0gZmFsc2U7XG4gIGxldCBiYWNrc2xhc2hlcyA9IGZhbHNlO1xuICBsZXQgbmVnYXRlZCA9IGZhbHNlO1xuICBsZXQgZmluaXNoZWQgPSBmYWxzZTtcbiAgbGV0IGJyYWNlcyA9IDA7XG4gIGxldCBwcmV2O1xuICBsZXQgY29kZTtcbiAgbGV0IHRva2VuID0geyB2YWx1ZTogJycsIGRlcHRoOiAwLCBpc0dsb2I6IGZhbHNlIH07XG5cbiAgY29uc3QgZW9zID0gKCkgPT4gaW5kZXggPj0gbGVuZ3RoO1xuICBjb25zdCBwZWVrID0gKCkgPT4gc3RyLmNoYXJDb2RlQXQoaW5kZXggKyAxKTtcbiAgY29uc3QgYWR2YW5jZSA9ICgpID0+IHtcbiAgICBwcmV2ID0gY29kZTtcbiAgICByZXR1cm4gc3RyLmNoYXJDb2RlQXQoKytpbmRleCk7XG4gIH07XG5cbiAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgY29kZSA9IGFkdmFuY2UoKTtcbiAgICBsZXQgbmV4dDtcblxuICAgIGlmIChjb2RlID09PSBDSEFSX0JBQ0tXQVJEX1NMQVNIKSB7XG4gICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgIGNvZGUgPSBhZHZhbmNlKCk7XG5cbiAgICAgIGlmIChjb2RlID09PSBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgICAgYnJhY2VFc2NhcGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChicmFjZUVzY2FwZWQgPT09IHRydWUgfHwgY29kZSA9PT0gQ0hBUl9MRUZUX0NVUkxZX0JSQUNFKSB7XG4gICAgICBicmFjZXMrKztcblxuICAgICAgd2hpbGUgKGVvcygpICE9PSB0cnVlICYmIChjb2RlID0gYWR2YW5jZSgpKSkge1xuICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSCkge1xuICAgICAgICAgIGJhY2tzbGFzaGVzID0gdG9rZW4uYmFja3NsYXNoZXMgPSB0cnVlO1xuICAgICAgICAgIGFkdmFuY2UoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2RlID09PSBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgICAgICBicmFjZXMrKztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChicmFjZUVzY2FwZWQgIT09IHRydWUgJiYgY29kZSA9PT0gQ0hBUl9ET1QgJiYgKGNvZGUgPSBhZHZhbmNlKCkpID09PSBDSEFSX0RPVCkge1xuICAgICAgICAgIGlzQnJhY2UgPSB0b2tlbi5pc0JyYWNlID0gdHJ1ZTtcbiAgICAgICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJyYWNlRXNjYXBlZCAhPT0gdHJ1ZSAmJiBjb2RlID09PSBDSEFSX0NPTU1BKSB7XG4gICAgICAgICAgaXNCcmFjZSA9IHRva2VuLmlzQnJhY2UgPSB0cnVlO1xuICAgICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRSkge1xuICAgICAgICAgIGJyYWNlcy0tO1xuXG4gICAgICAgICAgaWYgKGJyYWNlcyA9PT0gMCkge1xuICAgICAgICAgICAgYnJhY2VFc2NhcGVkID0gZmFsc2U7XG4gICAgICAgICAgICBpc0JyYWNlID0gdG9rZW4uaXNCcmFjZSA9IHRydWU7XG4gICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT09IENIQVJfRk9SV0FSRF9TTEFTSCkge1xuICAgICAgc2xhc2hlcy5wdXNoKGluZGV4KTtcbiAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgIHRva2VuID0geyB2YWx1ZTogJycsIGRlcHRoOiAwLCBpc0dsb2I6IGZhbHNlIH07XG5cbiAgICAgIGlmIChmaW5pc2hlZCA9PT0gdHJ1ZSkgY29udGludWU7XG4gICAgICBpZiAocHJldiA9PT0gQ0hBUl9ET1QgJiYgaW5kZXggPT09IChzdGFydCArIDEpKSB7XG4gICAgICAgIHN0YXJ0ICs9IDI7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsYXN0SW5kZXggPSBpbmRleCArIDE7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5ub2V4dCAhPT0gdHJ1ZSkge1xuICAgICAgY29uc3QgaXNFeHRnbG9iQ2hhciA9IGNvZGUgPT09IENIQVJfUExVU1xuICAgICAgICB8fCBjb2RlID09PSBDSEFSX0FUXG4gICAgICAgIHx8IGNvZGUgPT09IENIQVJfQVNURVJJU0tcbiAgICAgICAgfHwgY29kZSA9PT0gQ0hBUl9RVUVTVElPTl9NQVJLXG4gICAgICAgIHx8IGNvZGUgPT09IENIQVJfRVhDTEFNQVRJT05fTUFSSztcblxuICAgICAgaWYgKGlzRXh0Z2xvYkNoYXIgPT09IHRydWUgJiYgcGVlaygpID09PSBDSEFSX0xFRlRfUEFSRU5USEVTRVMpIHtcbiAgICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgICAgaXNFeHRnbG9iID0gdG9rZW4uaXNFeHRnbG9iID0gdHJ1ZTtcbiAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgICB3aGlsZSAoZW9zKCkgIT09IHRydWUgJiYgKGNvZGUgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSCkge1xuICAgICAgICAgICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY29kZSA9IGFkdmFuY2UoKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb2RlID09PSBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTKSB7XG4gICAgICAgICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlID09PSBDSEFSX0FTVEVSSVNLKSB7XG4gICAgICBpZiAocHJldiA9PT0gQ0hBUl9BU1RFUklTSykgaXNHbG9ic3RhciA9IHRva2VuLmlzR2xvYnN0YXIgPSB0cnVlO1xuICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChjb2RlID09PSBDSEFSX1FVRVNUSU9OX01BUkspIHtcbiAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICBmaW5pc2hlZCA9IHRydWU7XG5cbiAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoY29kZSA9PT0gQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUKSB7XG4gICAgICB3aGlsZSAoZW9zKCkgIT09IHRydWUgJiYgKG5leHQgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX0JBQ0tXQVJEX1NMQVNIKSB7XG4gICAgICAgICAgYmFja3NsYXNoZXMgPSB0b2tlbi5iYWNrc2xhc2hlcyA9IHRydWU7XG4gICAgICAgICAgYWR2YW5jZSgpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHQgPT09IENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgICAgICBpc0JyYWNrZXQgPSB0b2tlbi5pc0JyYWNrZXQgPSB0cnVlO1xuICAgICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdHMubm9uZWdhdGUgIT09IHRydWUgJiYgY29kZSA9PT0gQ0hBUl9FWENMQU1BVElPTl9NQVJLICYmIGluZGV4ID09PSBzdGFydCkge1xuICAgICAgbmVnYXRlZCA9IHRva2VuLm5lZ2F0ZWQgPSB0cnVlO1xuICAgICAgc3RhcnQrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChvcHRzLm5vcGFyZW4gIT09IHRydWUgJiYgY29kZSA9PT0gQ0hBUl9MRUZUX1BBUkVOVEhFU0VTKSB7XG4gICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuXG4gICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgIHdoaWxlIChlb3MoKSAhPT0gdHJ1ZSAmJiAoY29kZSA9IGFkdmFuY2UoKSkpIHtcbiAgICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9MRUZUX1BBUkVOVEhFU0VTKSB7XG4gICAgICAgICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvZGUgPSBhZHZhbmNlKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUykge1xuICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGlzR2xvYiA9PT0gdHJ1ZSkge1xuICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAob3B0cy5ub2V4dCA9PT0gdHJ1ZSkge1xuICAgIGlzRXh0Z2xvYiA9IGZhbHNlO1xuICAgIGlzR2xvYiA9IGZhbHNlO1xuICB9XG5cbiAgbGV0IGJhc2UgPSBzdHI7XG4gIGxldCBwcmVmaXggPSAnJztcbiAgbGV0IGdsb2IgPSAnJztcblxuICBpZiAoc3RhcnQgPiAwKSB7XG4gICAgcHJlZml4ID0gc3RyLnNsaWNlKDAsIHN0YXJ0KTtcbiAgICBzdHIgPSBzdHIuc2xpY2Uoc3RhcnQpO1xuICAgIGxhc3RJbmRleCAtPSBzdGFydDtcbiAgfVxuXG4gIGlmIChiYXNlICYmIGlzR2xvYiA9PT0gdHJ1ZSAmJiBsYXN0SW5kZXggPiAwKSB7XG4gICAgYmFzZSA9IHN0ci5zbGljZSgwLCBsYXN0SW5kZXgpO1xuICAgIGdsb2IgPSBzdHIuc2xpY2UobGFzdEluZGV4KTtcbiAgfSBlbHNlIGlmIChpc0dsb2IgPT09IHRydWUpIHtcbiAgICBiYXNlID0gJyc7XG4gICAgZ2xvYiA9IHN0cjtcbiAgfSBlbHNlIHtcbiAgICBiYXNlID0gc3RyO1xuICB9XG5cbiAgaWYgKGJhc2UgJiYgYmFzZSAhPT0gJycgJiYgYmFzZSAhPT0gJy8nICYmIGJhc2UgIT09IHN0cikge1xuICAgIGlmIChpc1BhdGhTZXBhcmF0b3IoYmFzZS5jaGFyQ29kZUF0KGJhc2UubGVuZ3RoIC0gMSkpKSB7XG4gICAgICBiYXNlID0gYmFzZS5zbGljZSgwLCAtMSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9wdHMudW5lc2NhcGUgPT09IHRydWUpIHtcbiAgICBpZiAoZ2xvYikgZ2xvYiA9IHV0aWxzLnJlbW92ZUJhY2tzbGFzaGVzKGdsb2IpO1xuXG4gICAgaWYgKGJhc2UgJiYgYmFja3NsYXNoZXMgPT09IHRydWUpIHtcbiAgICAgIGJhc2UgPSB1dGlscy5yZW1vdmVCYWNrc2xhc2hlcyhiYXNlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBwcmVmaXgsXG4gICAgaW5wdXQsXG4gICAgc3RhcnQsXG4gICAgYmFzZSxcbiAgICBnbG9iLFxuICAgIGlzQnJhY2UsXG4gICAgaXNCcmFja2V0LFxuICAgIGlzR2xvYixcbiAgICBpc0V4dGdsb2IsXG4gICAgaXNHbG9ic3RhcixcbiAgICBuZWdhdGVkXG4gIH07XG5cbiAgaWYgKG9wdHMudG9rZW5zID09PSB0cnVlKSB7XG4gICAgc3RhdGUubWF4RGVwdGggPSAwO1xuICAgIGlmICghaXNQYXRoU2VwYXJhdG9yKGNvZGUpKSB7XG4gICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgfVxuICAgIHN0YXRlLnRva2VucyA9IHRva2VucztcbiAgfVxuXG4gIGlmIChvcHRzLnBhcnRzID09PSB0cnVlIHx8IG9wdHMudG9rZW5zID09PSB0cnVlKSB7XG4gICAgbGV0IHByZXZJbmRleDtcblxuICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHNsYXNoZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgY29uc3QgbiA9IHByZXZJbmRleCA/IHByZXZJbmRleCArIDEgOiBzdGFydDtcbiAgICAgIGNvbnN0IGkgPSBzbGFzaGVzW2lkeF07XG4gICAgICBjb25zdCB2YWx1ZSA9IGlucHV0LnNsaWNlKG4sIGkpO1xuICAgICAgaWYgKG9wdHMudG9rZW5zKSB7XG4gICAgICAgIGlmIChpZHggPT09IDAgJiYgc3RhcnQgIT09IDApIHtcbiAgICAgICAgICB0b2tlbnNbaWR4XS5pc1ByZWZpeCA9IHRydWU7XG4gICAgICAgICAgdG9rZW5zW2lkeF0udmFsdWUgPSBwcmVmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9rZW5zW2lkeF0udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBkZXB0aCh0b2tlbnNbaWR4XSk7XG4gICAgICAgIHN0YXRlLm1heERlcHRoICs9IHRva2Vuc1tpZHhdLmRlcHRoO1xuICAgICAgfVxuICAgICAgaWYgKGlkeCAhPT0gMCB8fCB2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgcGFydHMucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBwcmV2SW5kZXggPSBpO1xuICAgIH1cblxuICAgIGlmIChwcmV2SW5kZXggJiYgcHJldkluZGV4ICsgMSA8IGlucHV0Lmxlbmd0aCkge1xuICAgICAgY29uc3QgdmFsdWUgPSBpbnB1dC5zbGljZShwcmV2SW5kZXggKyAxKTtcbiAgICAgIHBhcnRzLnB1c2godmFsdWUpO1xuXG4gICAgICBpZiAob3B0cy50b2tlbnMpIHtcbiAgICAgICAgdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBkZXB0aCh0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgc3RhdGUubWF4RGVwdGggKz0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS5kZXB0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0ZS5zbGFzaGVzID0gc2xhc2hlcztcbiAgICBzdGF0ZS5wYXJ0cyA9IHBhcnRzO1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzY2FuO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3QgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vKipcbiAqIENvbnN0YW50c1xuICovXG5cbmNvbnN0IHtcbiAgTUFYX0xFTkdUSCxcbiAgUE9TSVhfUkVHRVhfU09VUkNFLFxuICBSRUdFWF9OT05fU1BFQ0lBTF9DSEFSUyxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSU19CQUNLUkVGLFxuICBSRVBMQUNFTUVOVFNcbn0gPSBjb25zdGFudHM7XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5cbmNvbnN0IGV4cGFuZFJhbmdlID0gKGFyZ3MsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmV4cGFuZFJhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuZXhwYW5kUmFuZ2UoLi4uYXJncywgb3B0aW9ucyk7XG4gIH1cblxuICBhcmdzLnNvcnQoKTtcbiAgY29uc3QgdmFsdWUgPSBgWyR7YXJncy5qb2luKCctJyl9XWA7XG5cbiAgdHJ5IHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3ICovXG4gICAgbmV3IFJlZ0V4cCh2YWx1ZSk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0dXJuIGFyZ3MubWFwKHYgPT4gdXRpbHMuZXNjYXBlUmVnZXgodikpLmpvaW4oJy4uJyk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgbWVzc2FnZSBmb3IgYSBzeW50YXggZXJyb3JcbiAqL1xuXG5jb25zdCBzeW50YXhFcnJvciA9ICh0eXBlLCBjaGFyKSA9PiB7XG4gIHJldHVybiBgTWlzc2luZyAke3R5cGV9OiBcIiR7Y2hhcn1cIiAtIHVzZSBcIlxcXFxcXFxcJHtjaGFyfVwiIHRvIG1hdGNoIGxpdGVyYWwgY2hhcmFjdGVyc2A7XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBpbnB1dCBzdHJpbmcuXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuY29uc3QgcGFyc2UgPSAoaW5wdXQsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIHN0cmluZycpO1xuICB9XG5cbiAgaW5wdXQgPSBSRVBMQUNFTUVOVFNbaW5wdXRdIHx8IGlucHV0O1xuXG4gIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgY29uc3QgbWF4ID0gdHlwZW9mIG9wdHMubWF4TGVuZ3RoID09PSAnbnVtYmVyJyA/IE1hdGgubWluKE1BWF9MRU5HVEgsIG9wdHMubWF4TGVuZ3RoKSA6IE1BWF9MRU5HVEg7XG5cbiAgbGV0IGxlbiA9IGlucHV0Lmxlbmd0aDtcbiAgaWYgKGxlbiA+IG1heCkge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgSW5wdXQgbGVuZ3RoOiAke2xlbn0sIGV4Y2VlZHMgbWF4aW11bSBhbGxvd2VkIGxlbmd0aDogJHttYXh9YCk7XG4gIH1cblxuICBjb25zdCBib3MgPSB7IHR5cGU6ICdib3MnLCB2YWx1ZTogJycsIG91dHB1dDogb3B0cy5wcmVwZW5kIHx8ICcnIH07XG4gIGNvbnN0IHRva2VucyA9IFtib3NdO1xuXG4gIGNvbnN0IGNhcHR1cmUgPSBvcHRzLmNhcHR1cmUgPyAnJyA6ICc/Oic7XG4gIGNvbnN0IHdpbjMyID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpO1xuXG4gIC8vIGNyZWF0ZSBjb25zdGFudHMgYmFzZWQgb24gcGxhdGZvcm0sIGZvciB3aW5kb3dzIG9yIHBvc2l4XG4gIGNvbnN0IFBMQVRGT1JNX0NIQVJTID0gY29uc3RhbnRzLmdsb2JDaGFycyh3aW4zMik7XG4gIGNvbnN0IEVYVEdMT0JfQ0hBUlMgPSBjb25zdGFudHMuZXh0Z2xvYkNoYXJzKFBMQVRGT1JNX0NIQVJTKTtcblxuICBjb25zdCB7XG4gICAgRE9UX0xJVEVSQUwsXG4gICAgUExVU19MSVRFUkFMLFxuICAgIFNMQVNIX0xJVEVSQUwsXG4gICAgT05FX0NIQVIsXG4gICAgRE9UU19TTEFTSCxcbiAgICBOT19ET1QsXG4gICAgTk9fRE9UX1NMQVNILFxuICAgIE5PX0RPVFNfU0xBU0gsXG4gICAgUU1BUkssXG4gICAgUU1BUktfTk9fRE9ULFxuICAgIFNUQVIsXG4gICAgU1RBUlRfQU5DSE9SXG4gIH0gPSBQTEFURk9STV9DSEFSUztcblxuICBjb25zdCBnbG9ic3RhciA9IChvcHRzKSA9PiB7XG4gICAgcmV0dXJuIGAoJHtjYXB0dXJlfSg/Oig/ISR7U1RBUlRfQU5DSE9SfSR7b3B0cy5kb3QgPyBET1RTX1NMQVNIIDogRE9UX0xJVEVSQUx9KS4pKj8pYDtcbiAgfTtcblxuICBjb25zdCBub2RvdCA9IG9wdHMuZG90ID8gJycgOiBOT19ET1Q7XG4gIGNvbnN0IHFtYXJrTm9Eb3QgPSBvcHRzLmRvdCA/IFFNQVJLIDogUU1BUktfTk9fRE9UO1xuICBsZXQgc3RhciA9IG9wdHMuYmFzaCA9PT0gdHJ1ZSA/IGdsb2JzdGFyKG9wdHMpIDogU1RBUjtcblxuICBpZiAob3B0cy5jYXB0dXJlKSB7XG4gICAgc3RhciA9IGAoJHtzdGFyfSlgO1xuICB9XG5cbiAgLy8gbWluaW1hdGNoIG9wdGlvbnMgc3VwcG9ydFxuICBpZiAodHlwZW9mIG9wdHMubm9leHQgPT09ICdib29sZWFuJykge1xuICAgIG9wdHMubm9leHRnbG9iID0gb3B0cy5ub2V4dDtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGlucHV0LFxuICAgIGluZGV4OiAtMSxcbiAgICBzdGFydDogMCxcbiAgICBkb3Q6IG9wdHMuZG90ID09PSB0cnVlLFxuICAgIGNvbnN1bWVkOiAnJyxcbiAgICBvdXRwdXQ6ICcnLFxuICAgIHByZWZpeDogJycsXG4gICAgYmFja3RyYWNrOiBmYWxzZSxcbiAgICBuZWdhdGVkOiBmYWxzZSxcbiAgICBicmFja2V0czogMCxcbiAgICBicmFjZXM6IDAsXG4gICAgcGFyZW5zOiAwLFxuICAgIHF1b3RlczogMCxcbiAgICBnbG9ic3RhcjogZmFsc2UsXG4gICAgdG9rZW5zXG4gIH07XG5cbiAgaW5wdXQgPSB1dGlscy5yZW1vdmVQcmVmaXgoaW5wdXQsIHN0YXRlKTtcbiAgbGVuID0gaW5wdXQubGVuZ3RoO1xuXG4gIGNvbnN0IGV4dGdsb2JzID0gW107XG4gIGNvbnN0IGJyYWNlcyA9IFtdO1xuICBjb25zdCBzdGFjayA9IFtdO1xuICBsZXQgcHJldiA9IGJvcztcbiAgbGV0IHZhbHVlO1xuXG4gIC8qKlxuICAgKiBUb2tlbml6aW5nIGhlbHBlcnNcbiAgICovXG5cbiAgY29uc3QgZW9zID0gKCkgPT4gc3RhdGUuaW5kZXggPT09IGxlbiAtIDE7XG4gIGNvbnN0IHBlZWsgPSBzdGF0ZS5wZWVrID0gKG4gPSAxKSA9PiBpbnB1dFtzdGF0ZS5pbmRleCArIG5dO1xuICBjb25zdCBhZHZhbmNlID0gc3RhdGUuYWR2YW5jZSA9ICgpID0+IGlucHV0Wysrc3RhdGUuaW5kZXhdO1xuICBjb25zdCByZW1haW5pbmcgPSAoKSA9PiBpbnB1dC5zbGljZShzdGF0ZS5pbmRleCArIDEpO1xuICBjb25zdCBjb25zdW1lID0gKHZhbHVlID0gJycsIG51bSA9IDApID0+IHtcbiAgICBzdGF0ZS5jb25zdW1lZCArPSB2YWx1ZTtcbiAgICBzdGF0ZS5pbmRleCArPSBudW07XG4gIH07XG4gIGNvbnN0IGFwcGVuZCA9IHRva2VuID0+IHtcbiAgICBzdGF0ZS5vdXRwdXQgKz0gdG9rZW4ub3V0cHV0ICE9IG51bGwgPyB0b2tlbi5vdXRwdXQgOiB0b2tlbi52YWx1ZTtcbiAgICBjb25zdW1lKHRva2VuLnZhbHVlKTtcbiAgfTtcblxuICBjb25zdCBuZWdhdGUgPSAoKSA9PiB7XG4gICAgbGV0IGNvdW50ID0gMTtcblxuICAgIHdoaWxlIChwZWVrKCkgPT09ICchJyAmJiAocGVlaygyKSAhPT0gJygnIHx8IHBlZWsoMykgPT09ICc/JykpIHtcbiAgICAgIGFkdmFuY2UoKTtcbiAgICAgIHN0YXRlLnN0YXJ0Kys7XG4gICAgICBjb3VudCsrO1xuICAgIH1cblxuICAgIGlmIChjb3VudCAlIDIgPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0ZS5uZWdhdGVkID0gdHJ1ZTtcbiAgICBzdGF0ZS5zdGFydCsrO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGluY3JlbWVudCA9IHR5cGUgPT4ge1xuICAgIHN0YXRlW3R5cGVdKys7XG4gICAgc3RhY2sucHVzaCh0eXBlKTtcbiAgfTtcblxuICBjb25zdCBkZWNyZW1lbnQgPSB0eXBlID0+IHtcbiAgICBzdGF0ZVt0eXBlXS0tO1xuICAgIHN0YWNrLnBvcCgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQdXNoIHRva2VucyBvbnRvIHRoZSB0b2tlbnMgYXJyYXkuIFRoaXMgaGVscGVyIHNwZWVkcyB1cFxuICAgKiB0b2tlbml6aW5nIGJ5IDEpIGhlbHBpbmcgdXMgYXZvaWQgYmFja3RyYWNraW5nIGFzIG11Y2ggYXMgcG9zc2libGUsXG4gICAqIGFuZCAyKSBoZWxwaW5nIHVzIGF2b2lkIGNyZWF0aW5nIGV4dHJhIHRva2VucyB3aGVuIGNvbnNlY3V0aXZlXG4gICAqIGNoYXJhY3RlcnMgYXJlIHBsYWluIHRleHQuIFRoaXMgaW1wcm92ZXMgcGVyZm9ybWFuY2UgYW5kIHNpbXBsaWZpZXNcbiAgICogbG9va2JlaGluZHMuXG4gICAqL1xuXG4gIGNvbnN0IHB1c2ggPSB0b2sgPT4ge1xuICAgIGlmIChwcmV2LnR5cGUgPT09ICdnbG9ic3RhcicpIHtcbiAgICAgIGNvbnN0IGlzQnJhY2UgPSBzdGF0ZS5icmFjZXMgPiAwICYmICh0b2sudHlwZSA9PT0gJ2NvbW1hJyB8fCB0b2sudHlwZSA9PT0gJ2JyYWNlJyk7XG4gICAgICBjb25zdCBpc0V4dGdsb2IgPSB0b2suZXh0Z2xvYiA9PT0gdHJ1ZSB8fCAoZXh0Z2xvYnMubGVuZ3RoICYmICh0b2sudHlwZSA9PT0gJ3BpcGUnIHx8IHRvay50eXBlID09PSAncGFyZW4nKSk7XG5cbiAgICAgIGlmICh0b2sudHlwZSAhPT0gJ3NsYXNoJyAmJiB0b2sudHlwZSAhPT0gJ3BhcmVuJyAmJiAhaXNCcmFjZSAmJiAhaXNFeHRnbG9iKSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCAtcHJldi5vdXRwdXQubGVuZ3RoKTtcbiAgICAgICAgcHJldi50eXBlID0gJ3N0YXInO1xuICAgICAgICBwcmV2LnZhbHVlID0gJyonO1xuICAgICAgICBwcmV2Lm91dHB1dCA9IHN0YXI7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBwcmV2Lm91dHB1dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXh0Z2xvYnMubGVuZ3RoICYmIHRvay50eXBlICE9PSAncGFyZW4nICYmICFFWFRHTE9CX0NIQVJTW3Rvay52YWx1ZV0pIHtcbiAgICAgIGV4dGdsb2JzW2V4dGdsb2JzLmxlbmd0aCAtIDFdLmlubmVyICs9IHRvay52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAodG9rLnZhbHVlIHx8IHRvay5vdXRwdXQpIGFwcGVuZCh0b2spO1xuICAgIGlmIChwcmV2ICYmIHByZXYudHlwZSA9PT0gJ3RleHQnICYmIHRvay50eXBlID09PSAndGV4dCcpIHtcbiAgICAgIHByZXYudmFsdWUgKz0gdG9rLnZhbHVlO1xuICAgICAgcHJldi5vdXRwdXQgPSAocHJldi5vdXRwdXQgfHwgJycpICsgdG9rLnZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRvay5wcmV2ID0gcHJldjtcbiAgICB0b2tlbnMucHVzaCh0b2spO1xuICAgIHByZXYgPSB0b2s7XG4gIH07XG5cbiAgY29uc3QgZXh0Z2xvYk9wZW4gPSAodHlwZSwgdmFsdWUpID0+IHtcbiAgICBjb25zdCB0b2tlbiA9IHsgLi4uRVhUR0xPQl9DSEFSU1t2YWx1ZV0sIGNvbmRpdGlvbnM6IDEsIGlubmVyOiAnJyB9O1xuXG4gICAgdG9rZW4ucHJldiA9IHByZXY7XG4gICAgdG9rZW4ucGFyZW5zID0gc3RhdGUucGFyZW5zO1xuICAgIHRva2VuLm91dHB1dCA9IHN0YXRlLm91dHB1dDtcbiAgICBjb25zdCBvdXRwdXQgPSAob3B0cy5jYXB0dXJlID8gJygnIDogJycpICsgdG9rZW4ub3BlbjtcblxuICAgIGluY3JlbWVudCgncGFyZW5zJyk7XG4gICAgcHVzaCh7IHR5cGUsIHZhbHVlLCBvdXRwdXQ6IHN0YXRlLm91dHB1dCA/ICcnIDogT05FX0NIQVIgfSk7XG4gICAgcHVzaCh7IHR5cGU6ICdwYXJlbicsIGV4dGdsb2I6IHRydWUsIHZhbHVlOiBhZHZhbmNlKCksIG91dHB1dCB9KTtcbiAgICBleHRnbG9icy5wdXNoKHRva2VuKTtcbiAgfTtcblxuICBjb25zdCBleHRnbG9iQ2xvc2UgPSB0b2tlbiA9PiB7XG4gICAgbGV0IG91dHB1dCA9IHRva2VuLmNsb3NlICsgKG9wdHMuY2FwdHVyZSA/ICcpJyA6ICcnKTtcblxuICAgIGlmICh0b2tlbi50eXBlID09PSAnbmVnYXRlJykge1xuICAgICAgbGV0IGV4dGdsb2JTdGFyID0gc3RhcjtcblxuICAgICAgaWYgKHRva2VuLmlubmVyICYmIHRva2VuLmlubmVyLmxlbmd0aCA+IDEgJiYgdG9rZW4uaW5uZXIuaW5jbHVkZXMoJy8nKSkge1xuICAgICAgICBleHRnbG9iU3RhciA9IGdsb2JzdGFyKG9wdHMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXh0Z2xvYlN0YXIgIT09IHN0YXIgfHwgZW9zKCkgfHwgL15cXCkrJC8udGVzdChyZW1haW5pbmcoKSkpIHtcbiAgICAgICAgb3V0cHV0ID0gdG9rZW4uY2xvc2UgPSBgKSQpKSR7ZXh0Z2xvYlN0YXJ9YDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRva2VuLnByZXYudHlwZSA9PT0gJ2JvcycgJiYgZW9zKCkpIHtcbiAgICAgICAgc3RhdGUubmVnYXRlZEV4dGdsb2IgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1c2goeyB0eXBlOiAncGFyZW4nLCBleHRnbG9iOiB0cnVlLCB2YWx1ZSwgb3V0cHV0IH0pO1xuICAgIGRlY3JlbWVudCgncGFyZW5zJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZhc3QgcGF0aHNcbiAgICovXG5cbiAgaWYgKG9wdHMuZmFzdHBhdGhzICE9PSBmYWxzZSAmJiAhLyheWyohXXxbLygpW1xcXXt9XCJdKS8udGVzdChpbnB1dCkpIHtcbiAgICBsZXQgYmFja3NsYXNoZXMgPSBmYWxzZTtcblxuICAgIGxldCBvdXRwdXQgPSBpbnB1dC5yZXBsYWNlKFJFR0VYX1NQRUNJQUxfQ0hBUlNfQkFDS1JFRiwgKG0sIGVzYywgY2hhcnMsIGZpcnN0LCByZXN0LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGZpcnN0ID09PSAnXFxcXCcpIHtcbiAgICAgICAgYmFja3NsYXNoZXMgPSB0cnVlO1xuICAgICAgICByZXR1cm4gbTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpcnN0ID09PSAnPycpIHtcbiAgICAgICAgaWYgKGVzYykge1xuICAgICAgICAgIHJldHVybiBlc2MgKyBmaXJzdCArIChyZXN0ID8gUU1BUksucmVwZWF0KHJlc3QubGVuZ3RoKSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gcW1hcmtOb0RvdCArIChyZXN0ID8gUU1BUksucmVwZWF0KHJlc3QubGVuZ3RoKSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUU1BUksucmVwZWF0KGNoYXJzLmxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaXJzdCA9PT0gJy4nKSB7XG4gICAgICAgIHJldHVybiBET1RfTElURVJBTC5yZXBlYXQoY2hhcnMubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpcnN0ID09PSAnKicpIHtcbiAgICAgICAgaWYgKGVzYykge1xuICAgICAgICAgIHJldHVybiBlc2MgKyBmaXJzdCArIChyZXN0ID8gc3RhciA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlc2MgPyBtIDogYFxcXFwke219YDtcbiAgICB9KTtcblxuICAgIGlmIChiYWNrc2xhc2hlcyA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKG9wdHMudW5lc2NhcGUgPT09IHRydWUpIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1xcXFwvZywgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1xcXFwrL2csIG0gPT4ge1xuICAgICAgICAgIHJldHVybiBtLmxlbmd0aCAlIDIgPT09IDAgPyAnXFxcXFxcXFwnIDogKG0gPyAnXFxcXCcgOiAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvdXRwdXQgPT09IGlucHV0ICYmIG9wdHMuY29udGFpbnMgPT09IHRydWUpIHtcbiAgICAgIHN0YXRlLm91dHB1dCA9IGlucHV0O1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHN0YXRlLm91dHB1dCA9IHV0aWxzLndyYXBPdXRwdXQob3V0cHV0LCBzdGF0ZSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRva2VuaXplIGlucHV0IHVudGlsIHdlIHJlYWNoIGVuZC1vZi1zdHJpbmdcbiAgICovXG5cbiAgd2hpbGUgKCFlb3MoKSkge1xuICAgIHZhbHVlID0gYWR2YW5jZSgpO1xuXG4gICAgaWYgKHZhbHVlID09PSAnXFx1MDAwMCcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVzY2FwZWQgY2hhcmFjdGVyc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnXFxcXCcpIHtcbiAgICAgIGNvbnN0IG5leHQgPSBwZWVrKCk7XG5cbiAgICAgIGlmIChuZXh0ID09PSAnLycgJiYgb3B0cy5iYXNoICE9PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV4dCA9PT0gJy4nIHx8IG5leHQgPT09ICc7Jykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFuZXh0KSB7XG4gICAgICAgIHZhbHVlICs9ICdcXFxcJztcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBjb2xsYXBzZSBzbGFzaGVzIHRvIHJlZHVjZSBwb3RlbnRpYWwgZm9yIGV4cGxvaXRzXG4gICAgICBjb25zdCBtYXRjaCA9IC9eXFxcXCsvLmV4ZWMocmVtYWluaW5nKCkpO1xuICAgICAgbGV0IHNsYXNoZXMgPSAwO1xuXG4gICAgICBpZiAobWF0Y2ggJiYgbWF0Y2hbMF0ubGVuZ3RoID4gMikge1xuICAgICAgICBzbGFzaGVzID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICBzdGF0ZS5pbmRleCArPSBzbGFzaGVzO1xuICAgICAgICBpZiAoc2xhc2hlcyAlIDIgIT09IDApIHtcbiAgICAgICAgICB2YWx1ZSArPSAnXFxcXCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMudW5lc2NhcGUgPT09IHRydWUpIHtcbiAgICAgICAgdmFsdWUgPSBhZHZhbmNlKCkgfHwgJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSArPSBhZHZhbmNlKCkgfHwgJyc7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZS5icmFja2V0cyA9PT0gMCkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgd2UncmUgaW5zaWRlIGEgcmVnZXggY2hhcmFjdGVyIGNsYXNzLCBjb250aW51ZVxuICAgICAqIHVudGlsIHdlIHJlYWNoIHRoZSBjbG9zaW5nIGJyYWNrZXQuXG4gICAgICovXG5cbiAgICBpZiAoc3RhdGUuYnJhY2tldHMgPiAwICYmICh2YWx1ZSAhPT0gJ10nIHx8IHByZXYudmFsdWUgPT09ICdbJyB8fCBwcmV2LnZhbHVlID09PSAnW14nKSkge1xuICAgICAgaWYgKG9wdHMucG9zaXggIT09IGZhbHNlICYmIHZhbHVlID09PSAnOicpIHtcbiAgICAgICAgY29uc3QgaW5uZXIgPSBwcmV2LnZhbHVlLnNsaWNlKDEpO1xuICAgICAgICBpZiAoaW5uZXIuaW5jbHVkZXMoJ1snKSkge1xuICAgICAgICAgIHByZXYucG9zaXggPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKGlubmVyLmluY2x1ZGVzKCc6JykpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHByZXYudmFsdWUubGFzdEluZGV4T2YoJ1snKTtcbiAgICAgICAgICAgIGNvbnN0IHByZSA9IHByZXYudmFsdWUuc2xpY2UoMCwgaWR4KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3QgPSBwcmV2LnZhbHVlLnNsaWNlKGlkeCArIDIpO1xuICAgICAgICAgICAgY29uc3QgcG9zaXggPSBQT1NJWF9SRUdFWF9TT1VSQ0VbcmVzdF07XG4gICAgICAgICAgICBpZiAocG9zaXgpIHtcbiAgICAgICAgICAgICAgcHJldi52YWx1ZSA9IHByZSArIHBvc2l4O1xuICAgICAgICAgICAgICBzdGF0ZS5iYWNrdHJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICBhZHZhbmNlKCk7XG5cbiAgICAgICAgICAgICAgaWYgKCFib3Mub3V0cHV0ICYmIHRva2Vucy5pbmRleE9mKHByZXYpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgYm9zLm91dHB1dCA9IE9ORV9DSEFSO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoKHZhbHVlID09PSAnWycgJiYgcGVlaygpICE9PSAnOicpIHx8ICh2YWx1ZSA9PT0gJy0nICYmIHBlZWsoKSA9PT0gJ10nKSkge1xuICAgICAgICB2YWx1ZSA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09ICddJyAmJiAocHJldi52YWx1ZSA9PT0gJ1snIHx8IHByZXYudmFsdWUgPT09ICdbXicpKSB7XG4gICAgICAgIHZhbHVlID0gYFxcXFwke3ZhbHVlfWA7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLnBvc2l4ID09PSB0cnVlICYmIHZhbHVlID09PSAnIScgJiYgcHJldi52YWx1ZSA9PT0gJ1snKSB7XG4gICAgICAgIHZhbHVlID0gJ14nO1xuICAgICAgfVxuXG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgYXBwZW5kKHsgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB3ZSdyZSBpbnNpZGUgYSBxdW90ZWQgc3RyaW5nLCBjb250aW51ZVxuICAgICAqIHVudGlsIHdlIHJlYWNoIHRoZSBjbG9zaW5nIGRvdWJsZSBxdW90ZS5cbiAgICAgKi9cblxuICAgIGlmIChzdGF0ZS5xdW90ZXMgPT09IDEgJiYgdmFsdWUgIT09ICdcIicpIHtcbiAgICAgIHZhbHVlID0gdXRpbHMuZXNjYXBlUmVnZXgodmFsdWUpO1xuICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgIGFwcGVuZCh7IHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG91YmxlIHF1b3Rlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnXCInKSB7XG4gICAgICBzdGF0ZS5xdW90ZXMgPSBzdGF0ZS5xdW90ZXMgPT09IDEgPyAwIDogMTtcbiAgICAgIGlmIChvcHRzLmtlZXBRdW90ZXMgPT09IHRydWUpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJlbnRoZXNlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnKCcpIHtcbiAgICAgIGluY3JlbWVudCgncGFyZW5zJyk7XG4gICAgICBwdXNoKHsgdHlwZTogJ3BhcmVuJywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09ICcpJykge1xuICAgICAgaWYgKHN0YXRlLnBhcmVucyA9PT0gMCAmJiBvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB7XG4gICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihzeW50YXhFcnJvcignb3BlbmluZycsICcoJykpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleHRnbG9iID0gZXh0Z2xvYnNbZXh0Z2xvYnMubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoZXh0Z2xvYiAmJiBzdGF0ZS5wYXJlbnMgPT09IGV4dGdsb2IucGFyZW5zICsgMSkge1xuICAgICAgICBleHRnbG9iQ2xvc2UoZXh0Z2xvYnMucG9wKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdwYXJlbicsIHZhbHVlLCBvdXRwdXQ6IHN0YXRlLnBhcmVucyA/ICcpJyA6ICdcXFxcKScgfSk7XG4gICAgICBkZWNyZW1lbnQoJ3BhcmVucycpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3F1YXJlIGJyYWNrZXRzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICdbJykge1xuICAgICAgaWYgKG9wdHMubm9icmFja2V0ID09PSB0cnVlIHx8ICFyZW1haW5pbmcoKS5pbmNsdWRlcygnXScpKSB7XG4gICAgICAgIGlmIChvcHRzLm5vYnJhY2tldCAhPT0gdHJ1ZSAmJiBvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdjbG9zaW5nJywgJ10nKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5jcmVtZW50KCdicmFja2V0cycpO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2JyYWNrZXQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gJ10nKSB7XG4gICAgICBpZiAob3B0cy5ub2JyYWNrZXQgPT09IHRydWUgfHwgKHByZXYgJiYgcHJldi50eXBlID09PSAnYnJhY2tldCcgJiYgcHJldi52YWx1ZS5sZW5ndGggPT09IDEpKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlLCBvdXRwdXQ6IGBcXFxcJHt2YWx1ZX1gIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLmJyYWNrZXRzID09PSAwKSB7XG4gICAgICAgIGlmIChvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdvcGVuaW5nJywgJ1snKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSwgb3V0cHV0OiBgXFxcXCR7dmFsdWV9YCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGRlY3JlbWVudCgnYnJhY2tldHMnKTtcblxuICAgICAgY29uc3QgcHJldlZhbHVlID0gcHJldi52YWx1ZS5zbGljZSgxKTtcbiAgICAgIGlmIChwcmV2LnBvc2l4ICE9PSB0cnVlICYmIHByZXZWYWx1ZVswXSA9PT0gJ14nICYmICFwcmV2VmFsdWUuaW5jbHVkZXMoJy8nKSkge1xuICAgICAgICB2YWx1ZSA9IGAvJHt2YWx1ZX1gO1xuICAgICAgfVxuXG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgYXBwZW5kKHsgdmFsdWUgfSk7XG5cbiAgICAgIC8vIHdoZW4gbGl0ZXJhbCBicmFja2V0cyBhcmUgZXhwbGljaXRseSBkaXNhYmxlZFxuICAgICAgLy8gYXNzdW1lIHdlIHNob3VsZCBtYXRjaCB3aXRoIGEgcmVnZXggY2hhcmFjdGVyIGNsYXNzXG4gICAgICBpZiAob3B0cy5saXRlcmFsQnJhY2tldHMgPT09IGZhbHNlIHx8IHV0aWxzLmhhc1JlZ2V4Q2hhcnMocHJldlZhbHVlKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXNjYXBlZCA9IHV0aWxzLmVzY2FwZVJlZ2V4KHByZXYudmFsdWUpO1xuICAgICAgc3RhdGUub3V0cHV0ID0gc3RhdGUub3V0cHV0LnNsaWNlKDAsIC1wcmV2LnZhbHVlLmxlbmd0aCk7XG5cbiAgICAgIC8vIHdoZW4gbGl0ZXJhbCBicmFja2V0cyBhcmUgZXhwbGljaXRseSBlbmFibGVkXG4gICAgICAvLyBhc3N1bWUgd2Ugc2hvdWxkIGVzY2FwZSB0aGUgYnJhY2tldHMgdG8gbWF0Y2ggbGl0ZXJhbCBjaGFyYWN0ZXJzXG4gICAgICBpZiAob3B0cy5saXRlcmFsQnJhY2tldHMgPT09IHRydWUpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IGVzY2FwZWQ7XG4gICAgICAgIHByZXYudmFsdWUgPSBlc2NhcGVkO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gd2hlbiB0aGUgdXNlciBzcGVjaWZpZXMgbm90aGluZywgdHJ5IHRvIG1hdGNoIGJvdGhcbiAgICAgIHByZXYudmFsdWUgPSBgKCR7Y2FwdHVyZX0ke2VzY2FwZWR9fCR7cHJldi52YWx1ZX0pYDtcbiAgICAgIHN0YXRlLm91dHB1dCArPSBwcmV2LnZhbHVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnJhY2VzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICd7JyAmJiBvcHRzLm5vYnJhY2UgIT09IHRydWUpIHtcbiAgICAgIGluY3JlbWVudCgnYnJhY2VzJyk7XG5cbiAgICAgIGNvbnN0IG9wZW4gPSB7XG4gICAgICAgIHR5cGU6ICdicmFjZScsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBvdXRwdXQ6ICcoJyxcbiAgICAgICAgb3V0cHV0SW5kZXg6IHN0YXRlLm91dHB1dC5sZW5ndGgsXG4gICAgICAgIHRva2Vuc0luZGV4OiBzdGF0ZS50b2tlbnMubGVuZ3RoXG4gICAgICB9O1xuXG4gICAgICBicmFjZXMucHVzaChvcGVuKTtcbiAgICAgIHB1c2gob3Blbik7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09ICd9Jykge1xuICAgICAgY29uc3QgYnJhY2UgPSBicmFjZXNbYnJhY2VzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAob3B0cy5ub2JyYWNlID09PSB0cnVlIHx8ICFicmFjZSkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSwgb3V0cHV0OiB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBvdXRwdXQgPSAnKSc7XG5cbiAgICAgIGlmIChicmFjZS5kb3RzID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGFyciA9IHRva2Vucy5zbGljZSgpO1xuICAgICAgICBjb25zdCByYW5nZSA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICB0b2tlbnMucG9wKCk7XG4gICAgICAgICAgaWYgKGFycltpXS50eXBlID09PSAnYnJhY2UnKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFycltpXS50eXBlICE9PSAnZG90cycpIHtcbiAgICAgICAgICAgIHJhbmdlLnVuc2hpZnQoYXJyW2ldLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXQgPSBleHBhbmRSYW5nZShyYW5nZSwgb3B0cyk7XG4gICAgICAgIHN0YXRlLmJhY2t0cmFjayA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChicmFjZS5jb21tYSAhPT0gdHJ1ZSAmJiBicmFjZS5kb3RzICE9PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IG91dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCBicmFjZS5vdXRwdXRJbmRleCk7XG4gICAgICAgIGNvbnN0IHRva3MgPSBzdGF0ZS50b2tlbnMuc2xpY2UoYnJhY2UudG9rZW5zSW5kZXgpO1xuICAgICAgICBicmFjZS52YWx1ZSA9IGJyYWNlLm91dHB1dCA9ICdcXFxceyc7XG4gICAgICAgIHZhbHVlID0gb3V0cHV0ID0gJ1xcXFx9JztcbiAgICAgICAgc3RhdGUub3V0cHV0ID0gb3V0O1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdG9rcykge1xuICAgICAgICAgIHN0YXRlLm91dHB1dCArPSAodC5vdXRwdXQgfHwgdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdicmFjZScsIHZhbHVlLCBvdXRwdXQgfSk7XG4gICAgICBkZWNyZW1lbnQoJ2JyYWNlcycpO1xuICAgICAgYnJhY2VzLnBvcCgpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlwZXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJ3wnKSB7XG4gICAgICBpZiAoZXh0Z2xvYnMubGVuZ3RoID4gMCkge1xuICAgICAgICBleHRnbG9ic1tleHRnbG9icy5sZW5ndGggLSAxXS5jb25kaXRpb25zKys7XG4gICAgICB9XG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbW1hc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnLCcpIHtcbiAgICAgIGxldCBvdXRwdXQgPSB2YWx1ZTtcblxuICAgICAgY29uc3QgYnJhY2UgPSBicmFjZXNbYnJhY2VzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGJyYWNlICYmIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdID09PSAnYnJhY2VzJykge1xuICAgICAgICBicmFjZS5jb21tYSA9IHRydWU7XG4gICAgICAgIG91dHB1dCA9ICd8JztcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdjb21tYScsIHZhbHVlLCBvdXRwdXQgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTbGFzaGVzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICcvJykge1xuICAgICAgLy8gaWYgdGhlIGJlZ2lubmluZyBvZiB0aGUgZ2xvYiBpcyBcIi4vXCIsIGFkdmFuY2UgdGhlIHN0YXJ0XG4gICAgICAvLyB0byB0aGUgY3VycmVudCBpbmRleCwgYW5kIGRvbid0IGFkZCB0aGUgXCIuL1wiIGNoYXJhY3RlcnNcbiAgICAgIC8vIHRvIHRoZSBzdGF0ZS4gVGhpcyBncmVhdGx5IHNpbXBsaWZpZXMgbG9va2JlaGluZHMgd2hlblxuICAgICAgLy8gY2hlY2tpbmcgZm9yIEJPUyBjaGFyYWN0ZXJzIGxpa2UgXCIhXCIgYW5kIFwiLlwiIChub3QgXCIuL1wiKVxuICAgICAgaWYgKHByZXYudHlwZSA9PT0gJ2RvdCcgJiYgc3RhdGUuaW5kZXggPT09IHN0YXRlLnN0YXJ0ICsgMSkge1xuICAgICAgICBzdGF0ZS5zdGFydCA9IHN0YXRlLmluZGV4ICsgMTtcbiAgICAgICAgc3RhdGUuY29uc3VtZWQgPSAnJztcbiAgICAgICAgc3RhdGUub3V0cHV0ID0gJyc7XG4gICAgICAgIHRva2Vucy5wb3AoKTtcbiAgICAgICAgcHJldiA9IGJvczsgLy8gcmVzZXQgXCJwcmV2XCIgdG8gdGhlIGZpcnN0IHRva2VuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3NsYXNoJywgdmFsdWUsIG91dHB1dDogU0xBU0hfTElURVJBTCB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvdHNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJy4nKSB7XG4gICAgICBpZiAoc3RhdGUuYnJhY2VzID4gMCAmJiBwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICAgIGlmIChwcmV2LnZhbHVlID09PSAnLicpIHByZXYub3V0cHV0ID0gRE9UX0xJVEVSQUw7XG4gICAgICAgIGNvbnN0IGJyYWNlID0gYnJhY2VzW2JyYWNlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgcHJldi50eXBlID0gJ2RvdHMnO1xuICAgICAgICBwcmV2Lm91dHB1dCArPSB2YWx1ZTtcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgYnJhY2UuZG90cyA9IHRydWU7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKHN0YXRlLmJyYWNlcyArIHN0YXRlLnBhcmVucykgPT09IDAgJiYgcHJldi50eXBlICE9PSAnYm9zJyAmJiBwcmV2LnR5cGUgIT09ICdzbGFzaCcpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUsIG91dHB1dDogRE9UX0xJVEVSQUwgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2RvdCcsIHZhbHVlLCBvdXRwdXQ6IERPVF9MSVRFUkFMIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUXVlc3Rpb24gbWFya3NcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJz8nKSB7XG4gICAgICBjb25zdCBpc0dyb3VwID0gcHJldiAmJiBwcmV2LnZhbHVlID09PSAnKCc7XG4gICAgICBpZiAoIWlzR3JvdXAgJiYgb3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgcGVlaygpID09PSAnKCcgJiYgcGVlaygyKSAhPT0gJz8nKSB7XG4gICAgICAgIGV4dGdsb2JPcGVuKCdxbWFyaycsIHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2ICYmIHByZXYudHlwZSA9PT0gJ3BhcmVuJykge1xuICAgICAgICBjb25zdCBuZXh0ID0gcGVlaygpO1xuICAgICAgICBsZXQgb3V0cHV0ID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKG5leHQgPT09ICc8JyAmJiAhdXRpbHMuc3VwcG9ydHNMb29rYmVoaW5kcygpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlLmpzIHYxMCBvciBoaWdoZXIgaXMgcmVxdWlyZWQgZm9yIHJlZ2V4IGxvb2tiZWhpbmRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHByZXYudmFsdWUgPT09ICcoJyAmJiAhL1shPTw6XS8udGVzdChuZXh0KSkgfHwgKG5leHQgPT09ICc8JyAmJiAhLzwoWyE9XXxcXHcrPikvLnRlc3QocmVtYWluaW5nKCkpKSkge1xuICAgICAgICAgIG91dHB1dCA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUsIG91dHB1dCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLmRvdCAhPT0gdHJ1ZSAmJiAocHJldi50eXBlID09PSAnc2xhc2gnIHx8IHByZXYudHlwZSA9PT0gJ2JvcycpKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAncW1hcmsnLCB2YWx1ZSwgb3V0cHV0OiBRTUFSS19OT19ET1QgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3FtYXJrJywgdmFsdWUsIG91dHB1dDogUU1BUksgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGNsYW1hdGlvblxuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnIScpIHtcbiAgICAgIGlmIChvcHRzLm5vZXh0Z2xvYiAhPT0gdHJ1ZSAmJiBwZWVrKCkgPT09ICcoJykge1xuICAgICAgICBpZiAocGVlaygyKSAhPT0gJz8nIHx8ICEvWyE9PDpdLy50ZXN0KHBlZWsoMykpKSB7XG4gICAgICAgICAgZXh0Z2xvYk9wZW4oJ25lZ2F0ZScsIHZhbHVlKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5ub25lZ2F0ZSAhPT0gdHJ1ZSAmJiBzdGF0ZS5pbmRleCA9PT0gMCkge1xuICAgICAgICBuZWdhdGUoKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGx1c1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnKycpIHtcbiAgICAgIGlmIChvcHRzLm5vZXh0Z2xvYiAhPT0gdHJ1ZSAmJiBwZWVrKCkgPT09ICcoJyAmJiBwZWVrKDIpICE9PSAnPycpIHtcbiAgICAgICAgZXh0Z2xvYk9wZW4oJ3BsdXMnLCB2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKHByZXYgJiYgcHJldi52YWx1ZSA9PT0gJygnKSB8fCBvcHRzLnJlZ2V4ID09PSBmYWxzZSkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3BsdXMnLCB2YWx1ZSwgb3V0cHV0OiBQTFVTX0xJVEVSQUwgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKHByZXYgJiYgKHByZXYudHlwZSA9PT0gJ2JyYWNrZXQnIHx8IHByZXYudHlwZSA9PT0gJ3BhcmVuJyB8fCBwcmV2LnR5cGUgPT09ICdicmFjZScpKSB8fCBzdGF0ZS5wYXJlbnMgPiAwKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAncGx1cycsIHZhbHVlIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdwbHVzJywgdmFsdWU6IFBMVVNfTElURVJBTCB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBsYWluIHRleHRcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJ0AnKSB7XG4gICAgICBpZiAob3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgcGVlaygpID09PSAnKCcgJiYgcGVlaygyKSAhPT0gJz8nKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAnYXQnLCBleHRnbG9iOiB0cnVlLCB2YWx1ZSwgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGxhaW4gdGV4dFxuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlICE9PSAnKicpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gJyQnIHx8IHZhbHVlID09PSAnXicpIHtcbiAgICAgICAgdmFsdWUgPSBgXFxcXCR7dmFsdWV9YDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0Y2ggPSBSRUdFWF9OT05fU1BFQ0lBTF9DSEFSUy5leGVjKHJlbWFpbmluZygpKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICB2YWx1ZSArPSBtYXRjaFswXTtcbiAgICAgICAgc3RhdGUuaW5kZXggKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJzXG4gICAgICovXG5cbiAgICBpZiAocHJldiAmJiAocHJldi50eXBlID09PSAnZ2xvYnN0YXInIHx8IHByZXYuc3RhciA9PT0gdHJ1ZSkpIHtcbiAgICAgIHByZXYudHlwZSA9ICdzdGFyJztcbiAgICAgIHByZXYuc3RhciA9IHRydWU7XG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgcHJldi5vdXRwdXQgPSBzdGFyO1xuICAgICAgc3RhdGUuYmFja3RyYWNrID0gdHJ1ZTtcbiAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgIGNvbnN1bWUodmFsdWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgbGV0IHJlc3QgPSByZW1haW5pbmcoKTtcbiAgICBpZiAob3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgL15cXChbXj9dLy50ZXN0KHJlc3QpKSB7XG4gICAgICBleHRnbG9iT3Blbignc3RhcicsIHZhbHVlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChwcmV2LnR5cGUgPT09ICdzdGFyJykge1xuICAgICAgaWYgKG9wdHMubm9nbG9ic3RhciA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByaW9yID0gcHJldi5wcmV2O1xuICAgICAgY29uc3QgYmVmb3JlID0gcHJpb3IucHJldjtcbiAgICAgIGNvbnN0IGlzU3RhcnQgPSBwcmlvci50eXBlID09PSAnc2xhc2gnIHx8IHByaW9yLnR5cGUgPT09ICdib3MnO1xuICAgICAgY29uc3QgYWZ0ZXJTdGFyID0gYmVmb3JlICYmIChiZWZvcmUudHlwZSA9PT0gJ3N0YXInIHx8IGJlZm9yZS50eXBlID09PSAnZ2xvYnN0YXInKTtcblxuICAgICAgaWYgKG9wdHMuYmFzaCA9PT0gdHJ1ZSAmJiAoIWlzU3RhcnQgfHwgKHJlc3RbMF0gJiYgcmVzdFswXSAhPT0gJy8nKSkpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdzdGFyJywgdmFsdWUsIG91dHB1dDogJycgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc0JyYWNlID0gc3RhdGUuYnJhY2VzID4gMCAmJiAocHJpb3IudHlwZSA9PT0gJ2NvbW1hJyB8fCBwcmlvci50eXBlID09PSAnYnJhY2UnKTtcbiAgICAgIGNvbnN0IGlzRXh0Z2xvYiA9IGV4dGdsb2JzLmxlbmd0aCAmJiAocHJpb3IudHlwZSA9PT0gJ3BpcGUnIHx8IHByaW9yLnR5cGUgPT09ICdwYXJlbicpO1xuICAgICAgaWYgKCFpc1N0YXJ0ICYmIHByaW9yLnR5cGUgIT09ICdwYXJlbicgJiYgIWlzQnJhY2UgJiYgIWlzRXh0Z2xvYikge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3N0YXInLCB2YWx1ZSwgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHN0cmlwIGNvbnNlY3V0aXZlIGAvKiovYFxuICAgICAgd2hpbGUgKHJlc3Quc2xpY2UoMCwgMykgPT09ICcvKionKSB7XG4gICAgICAgIGNvbnN0IGFmdGVyID0gaW5wdXRbc3RhdGUuaW5kZXggKyA0XTtcbiAgICAgICAgaWYgKGFmdGVyICYmIGFmdGVyICE9PSAnLycpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXN0ID0gcmVzdC5zbGljZSgzKTtcbiAgICAgICAgY29uc3VtZSgnLyoqJywgMyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnYm9zJyAmJiBlb3MoKSkge1xuICAgICAgICBwcmV2LnR5cGUgPSAnZ2xvYnN0YXInO1xuICAgICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgICBwcmV2Lm91dHB1dCA9IGdsb2JzdGFyKG9wdHMpO1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBwcmV2Lm91dHB1dDtcbiAgICAgICAgc3RhdGUuZ2xvYnN0YXIgPSB0cnVlO1xuICAgICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnc2xhc2gnICYmIHByaW9yLnByZXYudHlwZSAhPT0gJ2JvcycgJiYgIWFmdGVyU3RhciAmJiBlb3MoKSkge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBzdGF0ZS5vdXRwdXQuc2xpY2UoMCwgLShwcmlvci5vdXRwdXQgKyBwcmV2Lm91dHB1dCkubGVuZ3RoKTtcbiAgICAgICAgcHJpb3Iub3V0cHV0ID0gYCg/OiR7cHJpb3Iub3V0cHV0fWA7XG5cbiAgICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgICAgcHJldi5vdXRwdXQgPSBnbG9ic3RhcihvcHRzKSArIChvcHRzLnN0cmljdFNsYXNoZXMgPyAnKScgOiAnfCQpJyk7XG4gICAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IHByaW9yLm91dHB1dCArIHByZXYub3V0cHV0O1xuICAgICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnc2xhc2gnICYmIHByaW9yLnByZXYudHlwZSAhPT0gJ2JvcycgJiYgcmVzdFswXSA9PT0gJy8nKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IHJlc3RbMV0gIT09IHZvaWQgMCA/ICd8JCcgOiAnJztcblxuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBzdGF0ZS5vdXRwdXQuc2xpY2UoMCwgLShwcmlvci5vdXRwdXQgKyBwcmV2Lm91dHB1dCkubGVuZ3RoKTtcbiAgICAgICAgcHJpb3Iub3V0cHV0ID0gYCg/OiR7cHJpb3Iub3V0cHV0fWA7XG5cbiAgICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgICAgcHJldi5vdXRwdXQgPSBgJHtnbG9ic3RhcihvcHRzKX0ke1NMQVNIX0xJVEVSQUx9fCR7U0xBU0hfTElURVJBTH0ke2VuZH0pYDtcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcblxuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gcHJpb3Iub3V0cHV0ICsgcHJldi5vdXRwdXQ7XG4gICAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcblxuICAgICAgICBjb25zdW1lKHZhbHVlICsgYWR2YW5jZSgpKTtcblxuICAgICAgICBwdXNoKHsgdHlwZTogJ3NsYXNoJywgdmFsdWU6ICcvJywgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnYm9zJyAmJiByZXN0WzBdID09PSAnLycpIHtcbiAgICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgcHJldi5vdXRwdXQgPSBgKD86Xnwke1NMQVNIX0xJVEVSQUx9fCR7Z2xvYnN0YXIob3B0cyl9JHtTTEFTSF9MSVRFUkFMfSlgO1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBwcmV2Lm91dHB1dDtcbiAgICAgICAgc3RhdGUuZ2xvYnN0YXIgPSB0cnVlO1xuICAgICAgICBjb25zdW1lKHZhbHVlICsgYWR2YW5jZSgpKTtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdzbGFzaCcsIHZhbHVlOiAnLycsIG91dHB1dDogJycgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgc2luZ2xlIHN0YXIgZnJvbSBvdXRwdXRcbiAgICAgIHN0YXRlLm91dHB1dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCAtcHJldi5vdXRwdXQubGVuZ3RoKTtcblxuICAgICAgLy8gcmVzZXQgcHJldmlvdXMgdG9rZW4gdG8gZ2xvYnN0YXJcbiAgICAgIHByZXYudHlwZSA9ICdnbG9ic3Rhcic7XG4gICAgICBwcmV2Lm91dHB1dCA9IGdsb2JzdGFyKG9wdHMpO1xuICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcblxuICAgICAgLy8gcmVzZXQgb3V0cHV0IHdpdGggZ2xvYnN0YXJcbiAgICAgIHN0YXRlLm91dHB1dCArPSBwcmV2Lm91dHB1dDtcbiAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgIGNvbnN1bWUodmFsdWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSB7IHR5cGU6ICdzdGFyJywgdmFsdWUsIG91dHB1dDogc3RhciB9O1xuXG4gICAgaWYgKG9wdHMuYmFzaCA9PT0gdHJ1ZSkge1xuICAgICAgdG9rZW4ub3V0cHV0ID0gJy4qPyc7XG4gICAgICBpZiAocHJldi50eXBlID09PSAnYm9zJyB8fCBwcmV2LnR5cGUgPT09ICdzbGFzaCcpIHtcbiAgICAgICAgdG9rZW4ub3V0cHV0ID0gbm9kb3QgKyB0b2tlbi5vdXRwdXQ7XG4gICAgICB9XG4gICAgICBwdXNoKHRva2VuKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChwcmV2ICYmIChwcmV2LnR5cGUgPT09ICdicmFja2V0JyB8fCBwcmV2LnR5cGUgPT09ICdwYXJlbicpICYmIG9wdHMucmVnZXggPT09IHRydWUpIHtcbiAgICAgIHRva2VuLm91dHB1dCA9IHZhbHVlO1xuICAgICAgcHVzaCh0b2tlbik7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuaW5kZXggPT09IHN0YXRlLnN0YXJ0IHx8IHByZXYudHlwZSA9PT0gJ3NsYXNoJyB8fCBwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICBpZiAocHJldi50eXBlID09PSAnZG90Jykge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gTk9fRE9UX1NMQVNIO1xuICAgICAgICBwcmV2Lm91dHB1dCArPSBOT19ET1RfU0xBU0g7XG5cbiAgICAgIH0gZWxzZSBpZiAob3B0cy5kb3QgPT09IHRydWUpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IE5PX0RPVFNfU0xBU0g7XG4gICAgICAgIHByZXYub3V0cHV0ICs9IE5PX0RPVFNfU0xBU0g7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBub2RvdDtcbiAgICAgICAgcHJldi5vdXRwdXQgKz0gbm9kb3Q7XG4gICAgICB9XG5cbiAgICAgIGlmIChwZWVrKCkgIT09ICcqJykge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gT05FX0NIQVI7XG4gICAgICAgIHByZXYub3V0cHV0ICs9IE9ORV9DSEFSO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1c2godG9rZW4pO1xuICB9XG5cbiAgd2hpbGUgKHN0YXRlLmJyYWNrZXRzID4gMCkge1xuICAgIGlmIChvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc3ludGF4RXJyb3IoJ2Nsb3NpbmcnLCAnXScpKTtcbiAgICBzdGF0ZS5vdXRwdXQgPSB1dGlscy5lc2NhcGVMYXN0KHN0YXRlLm91dHB1dCwgJ1snKTtcbiAgICBkZWNyZW1lbnQoJ2JyYWNrZXRzJyk7XG4gIH1cblxuICB3aGlsZSAoc3RhdGUucGFyZW5zID4gMCkge1xuICAgIGlmIChvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc3ludGF4RXJyb3IoJ2Nsb3NpbmcnLCAnKScpKTtcbiAgICBzdGF0ZS5vdXRwdXQgPSB1dGlscy5lc2NhcGVMYXN0KHN0YXRlLm91dHB1dCwgJygnKTtcbiAgICBkZWNyZW1lbnQoJ3BhcmVucycpO1xuICB9XG5cbiAgd2hpbGUgKHN0YXRlLmJyYWNlcyA+IDApIHtcbiAgICBpZiAob3B0cy5zdHJpY3RCcmFja2V0cyA9PT0gdHJ1ZSkgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdjbG9zaW5nJywgJ30nKSk7XG4gICAgc3RhdGUub3V0cHV0ID0gdXRpbHMuZXNjYXBlTGFzdChzdGF0ZS5vdXRwdXQsICd7Jyk7XG4gICAgZGVjcmVtZW50KCdicmFjZXMnKTtcbiAgfVxuXG4gIGlmIChvcHRzLnN0cmljdFNsYXNoZXMgIT09IHRydWUgJiYgKHByZXYudHlwZSA9PT0gJ3N0YXInIHx8IHByZXYudHlwZSA9PT0gJ2JyYWNrZXQnKSkge1xuICAgIHB1c2goeyB0eXBlOiAnbWF5YmVfc2xhc2gnLCB2YWx1ZTogJycsIG91dHB1dDogYCR7U0xBU0hfTElURVJBTH0/YCB9KTtcbiAgfVxuXG4gIC8vIHJlYnVpbGQgdGhlIG91dHB1dCBpZiB3ZSBoYWQgdG8gYmFja3RyYWNrIGF0IGFueSBwb2ludFxuICBpZiAoc3RhdGUuYmFja3RyYWNrID09PSB0cnVlKSB7XG4gICAgc3RhdGUub3V0cHV0ID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHN0YXRlLnRva2Vucykge1xuICAgICAgc3RhdGUub3V0cHV0ICs9IHRva2VuLm91dHB1dCAhPSBudWxsID8gdG9rZW4ub3V0cHV0IDogdG9rZW4udmFsdWU7XG5cbiAgICAgIGlmICh0b2tlbi5zdWZmaXgpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IHRva2VuLnN1ZmZpeDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59O1xuXG4vKipcbiAqIEZhc3QgcGF0aHMgZm9yIGNyZWF0aW5nIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIGNvbW1vbiBnbG9iIHBhdHRlcm5zLlxuICogVGhpcyBjYW4gc2lnbmlmaWNhbnRseSBzcGVlZCB1cCBwcm9jZXNzaW5nIGFuZCBoYXMgdmVyeSBsaXR0bGUgZG93bnNpZGVcbiAqIGltcGFjdCB3aGVuIG5vbmUgb2YgdGhlIGZhc3QgcGF0aHMgbWF0Y2guXG4gKi9cblxucGFyc2UuZmFzdHBhdGhzID0gKGlucHV0LCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgY29uc3QgbWF4ID0gdHlwZW9mIG9wdHMubWF4TGVuZ3RoID09PSAnbnVtYmVyJyA/IE1hdGgubWluKE1BWF9MRU5HVEgsIG9wdHMubWF4TGVuZ3RoKSA6IE1BWF9MRU5HVEg7XG4gIGNvbnN0IGxlbiA9IGlucHV0Lmxlbmd0aDtcbiAgaWYgKGxlbiA+IG1heCkge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgSW5wdXQgbGVuZ3RoOiAke2xlbn0sIGV4Y2VlZHMgbWF4aW11bSBhbGxvd2VkIGxlbmd0aDogJHttYXh9YCk7XG4gIH1cblxuICBpbnB1dCA9IFJFUExBQ0VNRU5UU1tpbnB1dF0gfHwgaW5wdXQ7XG4gIGNvbnN0IHdpbjMyID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpO1xuXG4gIC8vIGNyZWF0ZSBjb25zdGFudHMgYmFzZWQgb24gcGxhdGZvcm0sIGZvciB3aW5kb3dzIG9yIHBvc2l4XG4gIGNvbnN0IHtcbiAgICBET1RfTElURVJBTCxcbiAgICBTTEFTSF9MSVRFUkFMLFxuICAgIE9ORV9DSEFSLFxuICAgIERPVFNfU0xBU0gsXG4gICAgTk9fRE9ULFxuICAgIE5PX0RPVFMsXG4gICAgTk9fRE9UU19TTEFTSCxcbiAgICBTVEFSLFxuICAgIFNUQVJUX0FOQ0hPUlxuICB9ID0gY29uc3RhbnRzLmdsb2JDaGFycyh3aW4zMik7XG5cbiAgY29uc3Qgbm9kb3QgPSBvcHRzLmRvdCA/IE5PX0RPVFMgOiBOT19ET1Q7XG4gIGNvbnN0IHNsYXNoRG90ID0gb3B0cy5kb3QgPyBOT19ET1RTX1NMQVNIIDogTk9fRE9UO1xuICBjb25zdCBjYXB0dXJlID0gb3B0cy5jYXB0dXJlID8gJycgOiAnPzonO1xuICBjb25zdCBzdGF0ZSA9IHsgbmVnYXRlZDogZmFsc2UsIHByZWZpeDogJycgfTtcbiAgbGV0IHN0YXIgPSBvcHRzLmJhc2ggPT09IHRydWUgPyAnLio/JyA6IFNUQVI7XG5cbiAgaWYgKG9wdHMuY2FwdHVyZSkge1xuICAgIHN0YXIgPSBgKCR7c3Rhcn0pYDtcbiAgfVxuXG4gIGNvbnN0IGdsb2JzdGFyID0gKG9wdHMpID0+IHtcbiAgICBpZiAob3B0cy5ub2dsb2JzdGFyID09PSB0cnVlKSByZXR1cm4gc3RhcjtcbiAgICByZXR1cm4gYCgke2NhcHR1cmV9KD86KD8hJHtTVEFSVF9BTkNIT1J9JHtvcHRzLmRvdCA/IERPVFNfU0xBU0ggOiBET1RfTElURVJBTH0pLikqPylgO1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZSA9IHN0ciA9PiB7XG4gICAgc3dpdGNoIChzdHIpIHtcbiAgICAgIGNhc2UgJyonOlxuICAgICAgICByZXR1cm4gYCR7bm9kb3R9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnLionOlxuICAgICAgICByZXR1cm4gYCR7RE9UX0xJVEVSQUx9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKi4qJzpcbiAgICAgICAgcmV0dXJuIGAke25vZG90fSR7c3Rhcn0ke0RPVF9MSVRFUkFMfSR7T05FX0NIQVJ9JHtzdGFyfWA7XG5cbiAgICAgIGNhc2UgJyovKic6XG4gICAgICAgIHJldHVybiBgJHtub2RvdH0ke3N0YXJ9JHtTTEFTSF9MSVRFUkFMfSR7T05FX0NIQVJ9JHtzbGFzaERvdH0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKionOlxuICAgICAgICByZXR1cm4gbm9kb3QgKyBnbG9ic3RhcihvcHRzKTtcblxuICAgICAgY2FzZSAnKiovKic6XG4gICAgICAgIHJldHVybiBgKD86JHtub2RvdH0ke2dsb2JzdGFyKG9wdHMpfSR7U0xBU0hfTElURVJBTH0pPyR7c2xhc2hEb3R9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKiovKi4qJzpcbiAgICAgICAgcmV0dXJuIGAoPzoke25vZG90fSR7Z2xvYnN0YXIob3B0cyl9JHtTTEFTSF9MSVRFUkFMfSk/JHtzbGFzaERvdH0ke3N0YXJ9JHtET1RfTElURVJBTH0ke09ORV9DSEFSfSR7c3Rhcn1gO1xuXG4gICAgICBjYXNlICcqKi8uKic6XG4gICAgICAgIHJldHVybiBgKD86JHtub2RvdH0ke2dsb2JzdGFyKG9wdHMpfSR7U0xBU0hfTElURVJBTH0pPyR7RE9UX0xJVEVSQUx9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBjb25zdCBtYXRjaCA9IC9eKC4qPylcXC4oXFx3KykkLy5leGVjKHN0cik7XG4gICAgICAgIGlmICghbWF0Y2gpIHJldHVybjtcblxuICAgICAgICBjb25zdCBzb3VyY2UgPSBjcmVhdGUobWF0Y2hbMV0pO1xuICAgICAgICBpZiAoIXNvdXJjZSkgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBzb3VyY2UgKyBET1RfTElURVJBTCArIG1hdGNoWzJdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBvdXRwdXQgPSB1dGlscy5yZW1vdmVQcmVmaXgoaW5wdXQsIHN0YXRlKTtcbiAgbGV0IHNvdXJjZSA9IGNyZWF0ZShvdXRwdXQpO1xuXG4gIGlmIChzb3VyY2UgJiYgb3B0cy5zdHJpY3RTbGFzaGVzICE9PSB0cnVlKSB7XG4gICAgc291cmNlICs9IGAke1NMQVNIX0xJVEVSQUx9P2A7XG4gIH1cblxuICByZXR1cm4gc291cmNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBzY2FuID0gcmVxdWlyZSgnLi9zY2FuJyk7XG5jb25zdCBwYXJzZSA9IHJlcXVpcmUoJy4vcGFyc2UnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuY29uc3QgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcbmNvbnN0IGlzT2JqZWN0ID0gdmFsID0+IHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRjaGVyIGZ1bmN0aW9uIGZyb20gb25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJucy4gVGhlXG4gKiByZXR1cm5lZCBmdW5jdGlvbiB0YWtlcyBhIHN0cmluZyB0byBtYXRjaCBhcyBpdHMgZmlyc3QgYXJndW1lbnQsXG4gKiBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBzdHJpbmcgaXMgYSBtYXRjaC4gVGhlIHJldHVybmVkIG1hdGNoZXJcbiAqIGZ1bmN0aW9uIGFsc28gdGFrZXMgYSBib29sZWFuIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdGhhdCwgd2hlbiB0cnVlLFxuICogcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaChnbG9iWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnN0IGlzTWF0Y2ggPSBwaWNvbWF0Y2goJyouISgqYSknKTtcbiAqIGNvbnNvbGUubG9nKGlzTWF0Y2goJ2EuYScpKTsgLy89PiBmYWxzZVxuICogY29uc29sZS5sb2coaXNNYXRjaCgnYS5iJykpOyAvLz0+IHRydWVcbiAqIGBgYFxuICogQG5hbWUgcGljb21hdGNoXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYGdsb2JzYCBPbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zLlxuICogQHBhcmFtIHtPYmplY3Q9fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0Z1bmN0aW9uPX0gUmV0dXJucyBhIG1hdGNoZXIgZnVuY3Rpb24uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmNvbnN0IHBpY29tYXRjaCA9IChnbG9iLCBvcHRpb25zLCByZXR1cm5TdGF0ZSA9IGZhbHNlKSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KGdsb2IpKSB7XG4gICAgY29uc3QgZm5zID0gZ2xvYi5tYXAoaW5wdXQgPT4gcGljb21hdGNoKGlucHV0LCBvcHRpb25zLCByZXR1cm5TdGF0ZSkpO1xuICAgIGNvbnN0IGFycmF5TWF0Y2hlciA9IHN0ciA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGlzTWF0Y2ggb2YgZm5zKSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gaXNNYXRjaChzdHIpO1xuICAgICAgICBpZiAoc3RhdGUpIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIHJldHVybiBhcnJheU1hdGNoZXI7XG4gIH1cblxuICBjb25zdCBpc1N0YXRlID0gaXNPYmplY3QoZ2xvYikgJiYgZ2xvYi50b2tlbnMgJiYgZ2xvYi5pbnB1dDtcblxuICBpZiAoZ2xvYiA9PT0gJycgfHwgKHR5cGVvZiBnbG9iICE9PSAnc3RyaW5nJyAmJiAhaXNTdGF0ZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBwYXR0ZXJuIHRvIGJlIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuICB9XG5cbiAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IHBvc2l4ID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpO1xuICBjb25zdCByZWdleCA9IGlzU3RhdGVcbiAgICA/IHBpY29tYXRjaC5jb21waWxlUmUoZ2xvYiwgb3B0aW9ucylcbiAgICA6IHBpY29tYXRjaC5tYWtlUmUoZ2xvYiwgb3B0aW9ucywgZmFsc2UsIHRydWUpO1xuXG4gIGNvbnN0IHN0YXRlID0gcmVnZXguc3RhdGU7XG4gIGRlbGV0ZSByZWdleC5zdGF0ZTtcblxuICBsZXQgaXNJZ25vcmVkID0gKCkgPT4gZmFsc2U7XG4gIGlmIChvcHRzLmlnbm9yZSkge1xuICAgIGNvbnN0IGlnbm9yZU9wdHMgPSB7IC4uLm9wdGlvbnMsIGlnbm9yZTogbnVsbCwgb25NYXRjaDogbnVsbCwgb25SZXN1bHQ6IG51bGwgfTtcbiAgICBpc0lnbm9yZWQgPSBwaWNvbWF0Y2gob3B0cy5pZ25vcmUsIGlnbm9yZU9wdHMsIHJldHVyblN0YXRlKTtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoZXIgPSAoaW5wdXQsIHJldHVybk9iamVjdCA9IGZhbHNlKSA9PiB7XG4gICAgY29uc3QgeyBpc01hdGNoLCBtYXRjaCwgb3V0cHV0IH0gPSBwaWNvbWF0Y2gudGVzdChpbnB1dCwgcmVnZXgsIG9wdGlvbnMsIHsgZ2xvYiwgcG9zaXggfSk7XG4gICAgY29uc3QgcmVzdWx0ID0geyBnbG9iLCBzdGF0ZSwgcmVnZXgsIHBvc2l4LCBpbnB1dCwgb3V0cHV0LCBtYXRjaCwgaXNNYXRjaCB9O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRzLm9uUmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcHRzLm9uUmVzdWx0KHJlc3VsdCk7XG4gICAgfVxuXG4gICAgaWYgKGlzTWF0Y2ggPT09IGZhbHNlKSB7XG4gICAgICByZXN1bHQuaXNNYXRjaCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHJldHVybk9iamVjdCA/IHJlc3VsdCA6IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc0lnbm9yZWQoaW5wdXQpKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdHMub25JZ25vcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb3B0cy5vbklnbm9yZShyZXN1bHQpO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmlzTWF0Y2ggPSBmYWxzZTtcbiAgICAgIHJldHVybiByZXR1cm5PYmplY3QgPyByZXN1bHQgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHMub25NYXRjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb3B0cy5vbk1hdGNoKHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXR1cm5PYmplY3QgPyByZXN1bHQgOiB0cnVlO1xuICB9O1xuXG4gIGlmIChyZXR1cm5TdGF0ZSkge1xuICAgIG1hdGNoZXIuc3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVyO1xufTtcblxuLyoqXG4gKiBUZXN0IGBpbnB1dGAgd2l0aCB0aGUgZ2l2ZW4gYHJlZ2V4YC4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBtYWluXG4gKiBgcGljb21hdGNoKClgIGZ1bmN0aW9uIHRvIHRlc3QgdGhlIGlucHV0IHN0cmluZy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiAvLyBwaWNvbWF0Y2gudGVzdChpbnB1dCwgcmVnZXhbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cocGljb21hdGNoLnRlc3QoJ2Zvby9iYXInLCAvXig/OihbXi9dKj8pXFwvKFteL10qPykpJC8pKTtcbiAqIC8vIHsgaXNNYXRjaDogdHJ1ZSwgbWF0Y2g6IFsgJ2Zvby8nLCAnZm9vJywgJ2JhcicgXSwgb3V0cHV0OiAnZm9vL2JhcicgfVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBTdHJpbmcgdG8gdGVzdC5cbiAqIEBwYXJhbSB7UmVnRXhwfSBgcmVnZXhgXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggbWF0Y2hpbmcgaW5mby5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucGljb21hdGNoLnRlc3QgPSAoaW5wdXQsIHJlZ2V4LCBvcHRpb25zLCB7IGdsb2IsIHBvc2l4IH0gPSB7fSkgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGlucHV0IHRvIGJlIGEgc3RyaW5nJyk7XG4gIH1cblxuICBpZiAoaW5wdXQgPT09ICcnKSB7XG4gICAgcmV0dXJuIHsgaXNNYXRjaDogZmFsc2UsIG91dHB1dDogJycgfTtcbiAgfVxuXG4gIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBmb3JtYXQgPSBvcHRzLmZvcm1hdCB8fCAocG9zaXggPyB1dGlscy50b1Bvc2l4U2xhc2hlcyA6IG51bGwpO1xuICBsZXQgbWF0Y2ggPSBpbnB1dCA9PT0gZ2xvYjtcbiAgbGV0IG91dHB1dCA9IChtYXRjaCAmJiBmb3JtYXQpID8gZm9ybWF0KGlucHV0KSA6IGlucHV0O1xuXG4gIGlmIChtYXRjaCA9PT0gZmFsc2UpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXQgPyBmb3JtYXQoaW5wdXQpIDogaW5wdXQ7XG4gICAgbWF0Y2ggPSBvdXRwdXQgPT09IGdsb2I7XG4gIH1cblxuICBpZiAobWF0Y2ggPT09IGZhbHNlIHx8IG9wdHMuY2FwdHVyZSA9PT0gdHJ1ZSkge1xuICAgIGlmIChvcHRzLm1hdGNoQmFzZSA9PT0gdHJ1ZSB8fCBvcHRzLmJhc2VuYW1lID09PSB0cnVlKSB7XG4gICAgICBtYXRjaCA9IHBpY29tYXRjaC5tYXRjaEJhc2UoaW5wdXQsIHJlZ2V4LCBvcHRpb25zLCBwb3NpeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGlzTWF0Y2g6IEJvb2xlYW4obWF0Y2gpLCBtYXRjaCwgb3V0cHV0IH07XG59O1xuXG4vKipcbiAqIE1hdGNoIHRoZSBiYXNlbmFtZSBvZiBhIGZpbGVwYXRoLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC5tYXRjaEJhc2UoaW5wdXQsIGdsb2JbLCBvcHRpb25zXSk7XG4gKiBjb25zb2xlLmxvZyhwaWNvbWF0Y2gubWF0Y2hCYXNlKCdmb28vYmFyLmpzJywgJyouanMnKTsgLy8gdHJ1ZVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBTdHJpbmcgdG8gdGVzdC5cbiAqIEBwYXJhbSB7UmVnRXhwfFN0cmluZ30gYGdsb2JgIEdsb2IgcGF0dGVybiBvciByZWdleCBjcmVhdGVkIGJ5IFsubWFrZVJlXSgjbWFrZVJlKS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC5tYXRjaEJhc2UgPSAoaW5wdXQsIGdsb2IsIG9wdGlvbnMsIHBvc2l4ID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpKSA9PiB7XG4gIGNvbnN0IHJlZ2V4ID0gZ2xvYiBpbnN0YW5jZW9mIFJlZ0V4cCA/IGdsb2IgOiBwaWNvbWF0Y2gubWFrZVJlKGdsb2IsIG9wdGlvbnMpO1xuICByZXR1cm4gcmVnZXgudGVzdChwYXRoLmJhc2VuYW1lKGlucHV0KSk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiAqKmFueSoqIG9mIHRoZSBnaXZlbiBnbG9iIGBwYXR0ZXJuc2AgbWF0Y2ggdGhlIHNwZWNpZmllZCBgc3RyaW5nYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiAvLyBwaWNvbWF0Y2guaXNNYXRjaChzdHJpbmcsIHBhdHRlcm5zWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKHBpY29tYXRjaC5pc01hdGNoKCdhLmEnLCBbJ2IuKicsICcqLmEnXSkpOyAvLz0+IHRydWVcbiAqIGNvbnNvbGUubG9nKHBpY29tYXRjaC5pc01hdGNoKCdhLmEnLCAnYi4qJykpOyAvLz0+IGZhbHNlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBzdHIgVGhlIHN0cmluZyB0byB0ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHBhdHRlcm5zIE9uZSBvciBtb3JlIGdsb2IgcGF0dGVybnMgdG8gdXNlIGZvciBtYXRjaGluZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpLlxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFueSBwYXR0ZXJucyBtYXRjaCBgc3RyYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2guaXNNYXRjaCA9IChzdHIsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiBwaWNvbWF0Y2gocGF0dGVybnMsIG9wdGlvbnMpKHN0cik7XG5cbi8qKlxuICogUGFyc2UgYSBnbG9iIHBhdHRlcm4gdG8gY3JlYXRlIHRoZSBzb3VyY2Ugc3RyaW5nIGZvciBhIHJlZ3VsYXJcbiAqIGV4cHJlc3Npb24uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogY29uc3QgcmVzdWx0ID0gcGljb21hdGNoLnBhcnNlKHBhdHRlcm5bLCBvcHRpb25zXSk7XG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgcGF0dGVybmBcbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB1c2VmdWwgcHJvcGVydGllcyBhbmQgb3V0cHV0IHRvIGJlIHVzZWQgYXMgYSByZWdleCBzb3VyY2Ugc3RyaW5nLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2gucGFyc2UgPSAocGF0dGVybiwgb3B0aW9ucykgPT4ge1xuICBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuKSkgcmV0dXJuIHBhdHRlcm4ubWFwKHAgPT4gcGljb21hdGNoLnBhcnNlKHAsIG9wdGlvbnMpKTtcbiAgcmV0dXJuIHBhcnNlKHBhdHRlcm4sIHsgLi4ub3B0aW9ucywgZmFzdHBhdGhzOiBmYWxzZSB9KTtcbn07XG5cbi8qKlxuICogU2NhbiBhIGdsb2IgcGF0dGVybiB0byBzZXBhcmF0ZSB0aGUgcGF0dGVybiBpbnRvIHNlZ21lbnRzLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC5zY2FuKGlucHV0Wywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnN0IHJlc3VsdCA9IHBpY29tYXRjaC5zY2FuKCchLi9mb28vKi5qcycpO1xuICogY29uc29sZS5sb2cocmVzdWx0KTtcbiAqIHsgcHJlZml4OiAnIS4vJyxcbiAqICAgaW5wdXQ6ICchLi9mb28vKi5qcycsXG4gKiAgIHN0YXJ0OiAzLFxuICogICBiYXNlOiAnZm9vJyxcbiAqICAgZ2xvYjogJyouanMnLFxuICogICBpc0JyYWNlOiBmYWxzZSxcbiAqICAgaXNCcmFja2V0OiBmYWxzZSxcbiAqICAgaXNHbG9iOiB0cnVlLFxuICogICBpc0V4dGdsb2I6IGZhbHNlLFxuICogICBpc0dsb2JzdGFyOiBmYWxzZSxcbiAqICAgbmVnYXRlZDogdHJ1ZSB9XG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgaW5wdXRgIEdsb2IgcGF0dGVybiB0byBzY2FuLlxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC5zY2FuID0gKGlucHV0LCBvcHRpb25zKSA9PiBzY2FuKGlucHV0LCBvcHRpb25zKTtcblxuLyoqXG4gKiBDcmVhdGUgYSByZWd1bGFyIGV4cHJlc3Npb24gZnJvbSBhIHBhcnNlZCBnbG9iIHBhdHRlcm4uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogY29uc3Qgc3RhdGUgPSBwaWNvbWF0Y2gucGFyc2UoJyouanMnKTtcbiAqIC8vIHBpY29tYXRjaC5jb21waWxlUmUoc3RhdGVbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cocGljb21hdGNoLmNvbXBpbGVSZShzdGF0ZSkpO1xuICogLy89PiAvXig/Oig/IVxcLikoPz0uKVteL10qP1xcLmpzKSQvXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RhdGVgIFRoZSBvYmplY3QgcmV0dXJuZWQgZnJvbSB0aGUgYC5wYXJzZWAgbWV0aG9kLlxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7UmVnRXhwfSBSZXR1cm5zIGEgcmVnZXggY3JlYXRlZCBmcm9tIHRoZSBnaXZlbiBwYXR0ZXJuLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2guY29tcGlsZVJlID0gKHBhcnNlZCwgb3B0aW9ucywgcmV0dXJuT3V0cHV0ID0gZmFsc2UsIHJldHVyblN0YXRlID0gZmFsc2UpID0+IHtcbiAgaWYgKHJldHVybk91dHB1dCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBwYXJzZWQub3V0cHV0O1xuICB9XG5cbiAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IHByZXBlbmQgPSBvcHRzLmNvbnRhaW5zID8gJycgOiAnXic7XG4gIGNvbnN0IGFwcGVuZCA9IG9wdHMuY29udGFpbnMgPyAnJyA6ICckJztcblxuICBsZXQgc291cmNlID0gYCR7cHJlcGVuZH0oPzoke3BhcnNlZC5vdXRwdXR9KSR7YXBwZW5kfWA7XG4gIGlmIChwYXJzZWQgJiYgcGFyc2VkLm5lZ2F0ZWQgPT09IHRydWUpIHtcbiAgICBzb3VyY2UgPSBgXig/ISR7c291cmNlfSkuKiRgO1xuICB9XG5cbiAgY29uc3QgcmVnZXggPSBwaWNvbWF0Y2gudG9SZWdleChzb3VyY2UsIG9wdGlvbnMpO1xuICBpZiAocmV0dXJuU3RhdGUgPT09IHRydWUpIHtcbiAgICByZWdleC5zdGF0ZSA9IHBhcnNlZDtcbiAgfVxuXG4gIHJldHVybiByZWdleDtcbn07XG5cbnBpY29tYXRjaC5tYWtlUmUgPSAoaW5wdXQsIG9wdGlvbnMsIHJldHVybk91dHB1dCA9IGZhbHNlLCByZXR1cm5TdGF0ZSA9IGZhbHNlKSA9PiB7XG4gIGlmICghaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuICB9XG5cbiAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIGxldCBwYXJzZWQgPSB7IG5lZ2F0ZWQ6IGZhbHNlLCBmYXN0cGF0aHM6IHRydWUgfTtcbiAgbGV0IHByZWZpeCA9ICcnO1xuICBsZXQgb3V0cHV0O1xuXG4gIGlmIChpbnB1dC5zdGFydHNXaXRoKCcuLycpKSB7XG4gICAgaW5wdXQgPSBpbnB1dC5zbGljZSgyKTtcbiAgICBwcmVmaXggPSBwYXJzZWQucHJlZml4ID0gJy4vJztcbiAgfVxuXG4gIGlmIChvcHRzLmZhc3RwYXRocyAhPT0gZmFsc2UgJiYgKGlucHV0WzBdID09PSAnLicgfHwgaW5wdXRbMF0gPT09ICcqJykpIHtcbiAgICBvdXRwdXQgPSBwYXJzZS5mYXN0cGF0aHMoaW5wdXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgaWYgKG91dHB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcGFyc2VkID0gcGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuICAgIHBhcnNlZC5wcmVmaXggPSBwcmVmaXggKyAocGFyc2VkLnByZWZpeCB8fCAnJyk7XG4gIH0gZWxzZSB7XG4gICAgcGFyc2VkLm91dHB1dCA9IG91dHB1dDtcbiAgfVxuXG4gIHJldHVybiBwaWNvbWF0Y2guY29tcGlsZVJlKHBhcnNlZCwgb3B0aW9ucywgcmV0dXJuT3V0cHV0LCByZXR1cm5TdGF0ZSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBmcm9tIHRoZSBnaXZlbiByZWdleCBzb3VyY2Ugc3RyaW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC50b1JlZ2V4KHNvdXJjZVssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zdCB7IG91dHB1dCB9ID0gcGljb21hdGNoLnBhcnNlKCcqLmpzJyk7XG4gKiBjb25zb2xlLmxvZyhwaWNvbWF0Y2gudG9SZWdleChvdXRwdXQpKTtcbiAqIC8vPT4gL14oPzooPyFcXC4pKD89LilbXi9dKj9cXC5qcykkL1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHNvdXJjZWAgUmVndWxhciBleHByZXNzaW9uIHNvdXJjZSBzdHJpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC50b1JlZ2V4ID0gKHNvdXJjZSwgb3B0aW9ucykgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHNvdXJjZSwgb3B0cy5mbGFncyB8fCAob3B0cy5ub2Nhc2UgPyAnaScgOiAnJykpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmRlYnVnID09PSB0cnVlKSB0aHJvdyBlcnI7XG4gICAgcmV0dXJuIC8kXi87XG4gIH1cbn07XG5cbi8qKlxuICogUGljb21hdGNoIGNvbnN0YW50cy5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5waWNvbWF0Y2guY29uc3RhbnRzID0gY29uc3RhbnRzO1xuXG4vKipcbiAqIEV4cG9zZSBcInBpY29tYXRjaFwiXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBwaWNvbWF0Y2g7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL3BpY29tYXRjaCcpO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbmNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJ3BpY29tYXRjaC9saWIvdXRpbHMnKTtcbmNvbnN0IGlzRW1wdHlTdHJpbmcgPSB2YWwgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgKHZhbCA9PT0gJycgfHwgdmFsID09PSAnLi8nKTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBtYXRjaCBvbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tKGxpc3QsIHBhdHRlcm5zWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKG1tKFsnYS5qcycsICdhLnR4dCddLCBbJyouanMnXSkpO1xuICogLy89PiBbICdhLmpzJyBdXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5PHN0cmluZz59IGxpc3QgTGlzdCBvZiBzdHJpbmdzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXk8c3RyaW5nPn0gcGF0dGVybnMgT25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJucyB0byB1c2UgZm9yIG1hdGNoaW5nLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpXG4gKiBAcmV0dXJuIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBtYXRjaGVzXG4gKiBAc3VtbWFyeSBmYWxzZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jb25zdCBtaWNyb21hdGNoID0gKGxpc3QsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIHBhdHRlcm5zID0gW10uY29uY2F0KHBhdHRlcm5zKTtcbiAgbGlzdCA9IFtdLmNvbmNhdChsaXN0KTtcblxuICBsZXQgb21pdCA9IG5ldyBTZXQoKTtcbiAgbGV0IGtlZXAgPSBuZXcgU2V0KCk7XG4gIGxldCBpdGVtcyA9IG5ldyBTZXQoKTtcbiAgbGV0IG5lZ2F0aXZlcyA9IDA7XG5cbiAgbGV0IG9uUmVzdWx0ID0gc3RhdGUgPT4ge1xuICAgIGl0ZW1zLmFkZChzdGF0ZS5vdXRwdXQpO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMub25SZXN1bHQpIHtcbiAgICAgIG9wdGlvbnMub25SZXN1bHQoc3RhdGUpO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdHRlcm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGlzTWF0Y2ggPSBwaWNvbWF0Y2goU3RyaW5nKHBhdHRlcm5zW2ldKSwgeyAuLi5vcHRpb25zLCBvblJlc3VsdCB9LCB0cnVlKTtcbiAgICBsZXQgbmVnYXRlZCA9IGlzTWF0Y2guc3RhdGUubmVnYXRlZCB8fCBpc01hdGNoLnN0YXRlLm5lZ2F0ZWRFeHRnbG9iO1xuICAgIGlmIChuZWdhdGVkKSBuZWdhdGl2ZXMrKztcblxuICAgIGZvciAobGV0IGl0ZW0gb2YgbGlzdCkge1xuICAgICAgbGV0IG1hdGNoZWQgPSBpc01hdGNoKGl0ZW0sIHRydWUpO1xuXG4gICAgICBsZXQgbWF0Y2ggPSBuZWdhdGVkID8gIW1hdGNoZWQuaXNNYXRjaCA6IG1hdGNoZWQuaXNNYXRjaDtcbiAgICAgIGlmICghbWF0Y2gpIGNvbnRpbnVlO1xuXG4gICAgICBpZiAobmVnYXRlZCkge1xuICAgICAgICBvbWl0LmFkZChtYXRjaGVkLm91dHB1dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvbWl0LmRlbGV0ZShtYXRjaGVkLm91dHB1dCk7XG4gICAgICAgIGtlZXAuYWRkKG1hdGNoZWQub3V0cHV0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgcmVzdWx0ID0gbmVnYXRpdmVzID09PSBwYXR0ZXJucy5sZW5ndGggPyBbLi4uaXRlbXNdIDogWy4uLmtlZXBdO1xuICBsZXQgbWF0Y2hlcyA9IHJlc3VsdC5maWx0ZXIoaXRlbSA9PiAhb21pdC5oYXMoaXRlbSkpO1xuXG4gIGlmIChvcHRpb25zICYmIG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKG9wdGlvbnMuZmFpbGdsb2IgPT09IHRydWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gbWF0Y2hlcyBmb3VuZCBmb3IgXCIke3BhdHRlcm5zLmpvaW4oJywgJyl9XCJgKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5ub251bGwgPT09IHRydWUgfHwgb3B0aW9ucy5udWxsZ2xvYiA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMudW5lc2NhcGUgPyBwYXR0ZXJucy5tYXAocCA9PiBwLnJlcGxhY2UoL1xcXFwvZywgJycpKSA6IHBhdHRlcm5zO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXRjaGVzO1xufTtcblxuLyoqXG4gKiBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICovXG5cbm1pY3JvbWF0Y2gubWF0Y2ggPSBtaWNyb21hdGNoO1xuXG4vKipcbiAqIFJldHVybnMgYSBtYXRjaGVyIGZ1bmN0aW9uIGZyb20gdGhlIGdpdmVuIGdsb2IgYHBhdHRlcm5gIGFuZCBgb3B0aW9uc2AuXG4gKiBUaGUgcmV0dXJuZWQgZnVuY3Rpb24gdGFrZXMgYSBzdHJpbmcgdG8gbWF0Y2ggYXMgaXRzIG9ubHkgYXJndW1lbnQgYW5kIHJldHVybnNcbiAqIHRydWUgaWYgdGhlIHN0cmluZyBpcyBhIG1hdGNoLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tLm1hdGNoZXIocGF0dGVyblssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zdCBpc01hdGNoID0gbW0ubWF0Y2hlcignKi4hKCphKScpO1xuICogY29uc29sZS5sb2coaXNNYXRjaCgnYS5hJykpOyAvLz0+IGZhbHNlXG4gKiBjb25zb2xlLmxvZyhpc01hdGNoKCdhLmInKSk7IC8vPT4gdHJ1ZVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHBhdHRlcm5gIEdsb2IgcGF0dGVyblxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7RnVuY3Rpb259IFJldHVybnMgYSBtYXRjaGVyIGZ1bmN0aW9uLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLm1hdGNoZXIgPSAocGF0dGVybiwgb3B0aW9ucykgPT4gcGljb21hdGNoKHBhdHRlcm4sIG9wdGlvbnMpO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiAqKmFueSoqIG9mIHRoZSBnaXZlbiBnbG9iIGBwYXR0ZXJuc2AgbWF0Y2ggdGhlIHNwZWNpZmllZCBgc3RyaW5nYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgbW0gPSByZXF1aXJlKCdtaWNyb21hdGNoJyk7XG4gKiAvLyBtbS5pc01hdGNoKHN0cmluZywgcGF0dGVybnNbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cobW0uaXNNYXRjaCgnYS5hJywgWydiLionLCAnKi5hJ10pKTsgLy89PiB0cnVlXG4gKiBjb25zb2xlLmxvZyhtbS5pc01hdGNoKCdhLmEnLCAnYi4qJykpOyAvLz0+IGZhbHNlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byB0ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHBhdHRlcm5zIE9uZSBvciBtb3JlIGdsb2IgcGF0dGVybnMgdG8gdXNlIGZvciBtYXRjaGluZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpLlxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFueSBwYXR0ZXJucyBtYXRjaCBgc3RyYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLmlzTWF0Y2ggPSAoc3RyLCBwYXR0ZXJucywgb3B0aW9ucykgPT4gcGljb21hdGNoKHBhdHRlcm5zLCBvcHRpb25zKShzdHIpO1xuXG4vKipcbiAqIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gKi9cblxubWljcm9tYXRjaC5hbnkgPSBtaWNyb21hdGNoLmlzTWF0Y2g7XG5cbi8qKlxuICogUmV0dXJucyBhIGxpc3Qgb2Ygc3RyaW5ncyB0aGF0IF8qKmRvIG5vdCBtYXRjaCBhbnkqKl8gb2YgdGhlIGdpdmVuIGBwYXR0ZXJuc2AuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IG1tID0gcmVxdWlyZSgnbWljcm9tYXRjaCcpO1xuICogLy8gbW0ubm90KGxpc3QsIHBhdHRlcm5zWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKG1tLm5vdChbJ2EuYScsICdiLmInLCAnYy5jJ10sICcqLmEnKSk7XG4gKiAvLz0+IFsnYi5iJywgJ2MuYyddXG4gKiBgYGBcbiAqIEBwYXJhbSB7QXJyYXl9IGBsaXN0YCBBcnJheSBvZiBzdHJpbmdzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGBwYXR0ZXJuc2AgT25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJuIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgIFNlZSBhdmFpbGFibGUgW29wdGlvbnNdKCNvcHRpb25zKSBmb3IgY2hhbmdpbmcgaG93IG1hdGNoZXMgYXJlIHBlcmZvcm1lZFxuICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0ICoqZG8gbm90IG1hdGNoKiogdGhlIGdpdmVuIHBhdHRlcm5zLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLm5vdCA9IChsaXN0LCBwYXR0ZXJucywgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIHBhdHRlcm5zID0gW10uY29uY2F0KHBhdHRlcm5zKS5tYXAoU3RyaW5nKTtcbiAgbGV0IHJlc3VsdCA9IG5ldyBTZXQoKTtcbiAgbGV0IGl0ZW1zID0gW107XG5cbiAgbGV0IG9uUmVzdWx0ID0gc3RhdGUgPT4ge1xuICAgIGlmIChvcHRpb25zLm9uUmVzdWx0KSBvcHRpb25zLm9uUmVzdWx0KHN0YXRlKTtcbiAgICBpdGVtcy5wdXNoKHN0YXRlLm91dHB1dCk7XG4gIH07XG5cbiAgbGV0IG1hdGNoZXMgPSBtaWNyb21hdGNoKGxpc3QsIHBhdHRlcm5zLCB7IC4uLm9wdGlvbnMsIG9uUmVzdWx0IH0pO1xuXG4gIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICBpZiAoIW1hdGNoZXMuaW5jbHVkZXMoaXRlbSkpIHtcbiAgICAgIHJlc3VsdC5hZGQoaXRlbSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBbLi4ucmVzdWx0XTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBgc3RyaW5nYCBjb250YWlucyB0aGUgZ2l2ZW4gcGF0dGVybi4gU2ltaWxhclxuICogdG8gWy5pc01hdGNoXSgjaXNNYXRjaCkgYnV0IHRoZSBwYXR0ZXJuIGNhbiBtYXRjaCBhbnkgcGFydCBvZiB0aGUgc3RyaW5nLlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgbW0gPSByZXF1aXJlKCdtaWNyb21hdGNoJyk7XG4gKiAvLyBtbS5jb250YWlucyhzdHJpbmcsIHBhdHRlcm5bLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cobW0uY29udGFpbnMoJ2FhL2JiL2NjJywgJypiJykpO1xuICogLy89PiB0cnVlXG4gKiBjb25zb2xlLmxvZyhtbS5jb250YWlucygnYWEvYmIvY2MnLCAnKmQnKSk7XG4gKiAvLz0+IGZhbHNlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyYCBUaGUgc3RyaW5nIHRvIG1hdGNoLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGBwYXR0ZXJuc2AgR2xvYiBwYXR0ZXJuIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgIFNlZSBhdmFpbGFibGUgW29wdGlvbnNdKCNvcHRpb25zKSBmb3IgY2hhbmdpbmcgaG93IG1hdGNoZXMgYXJlIHBlcmZvcm1lZFxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHRoZSBwYXR0ZXIgbWF0Y2hlcyBhbnkgcGFydCBvZiBgc3RyYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubWljcm9tYXRjaC5jb250YWlucyA9IChzdHIsIHBhdHRlcm4sIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRXhwZWN0ZWQgYSBzdHJpbmc6IFwiJHt1dGlsLmluc3BlY3Qoc3RyKX1cImApO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybikpIHtcbiAgICByZXR1cm4gcGF0dGVybi5zb21lKHAgPT4gbWljcm9tYXRjaC5jb250YWlucyhzdHIsIHAsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAoaXNFbXB0eVN0cmluZyhzdHIpIHx8IGlzRW1wdHlTdHJpbmcocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc3RyLmluY2x1ZGVzKHBhdHRlcm4pIHx8IChzdHIuc3RhcnRzV2l0aCgnLi8nKSAmJiBzdHIuc2xpY2UoMikuaW5jbHVkZXMocGF0dGVybikpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWljcm9tYXRjaC5pc01hdGNoKHN0ciwgcGF0dGVybiwgeyAuLi5vcHRpb25zLCBjb250YWluczogdHJ1ZSB9KTtcbn07XG5cbi8qKlxuICogRmlsdGVyIHRoZSBrZXlzIG9mIHRoZSBnaXZlbiBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gYGdsb2JgIHBhdHRlcm5cbiAqIGFuZCBgb3B0aW9uc2AuIERvZXMgbm90IGF0dGVtcHQgdG8gbWF0Y2ggbmVzdGVkIGtleXMuIElmIHlvdSBuZWVkIHRoaXMgZmVhdHVyZSxcbiAqIHVzZSBbZ2xvYi1vYmplY3RdW10gaW5zdGVhZC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgbW0gPSByZXF1aXJlKCdtaWNyb21hdGNoJyk7XG4gKiAvLyBtbS5tYXRjaEtleXMob2JqZWN0LCBwYXR0ZXJuc1ssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zdCBvYmogPSB7IGFhOiAnYScsIGFiOiAnYicsIGFjOiAnYycgfTtcbiAqIGNvbnNvbGUubG9nKG1tLm1hdGNoS2V5cyhvYmosICcqYicpKTtcbiAqIC8vPT4geyBhYjogJ2InIH1cbiAqIGBgYFxuICogQHBhcmFtIHtPYmplY3R9IGBvYmplY3RgIFRoZSBvYmplY3Qgd2l0aCBrZXlzIHRvIGZpbHRlci5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBgcGF0dGVybnNgIE9uZSBvciBtb3JlIGdsb2IgcGF0dGVybnMgdG8gdXNlIGZvciBtYXRjaGluZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2AgU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpIGZvciBjaGFuZ2luZyBob3cgbWF0Y2hlcyBhcmUgcGVyZm9ybWVkXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggb25seSBrZXlzIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIHBhdHRlcm5zLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLm1hdGNoS2V5cyA9IChvYmosIHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIGlmICghdXRpbHMuaXNPYmplY3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHRoZSBmaXJzdCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QnKTtcbiAgfVxuICBsZXQga2V5cyA9IG1pY3JvbWF0Y2goT2JqZWN0LmtleXMob2JqKSwgcGF0dGVybnMsIG9wdGlvbnMpO1xuICBsZXQgcmVzID0ge307XG4gIGZvciAobGV0IGtleSBvZiBrZXlzKSByZXNba2V5XSA9IG9ialtrZXldO1xuICByZXR1cm4gcmVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgc29tZSBvZiB0aGUgc3RyaW5ncyBpbiB0aGUgZ2l2ZW4gYGxpc3RgIG1hdGNoIGFueSBvZiB0aGUgZ2l2ZW4gZ2xvYiBgcGF0dGVybnNgLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tLnNvbWUobGlzdCwgcGF0dGVybnNbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cobW0uc29tZShbJ2Zvby5qcycsICdiYXIuanMnXSwgWycqLmpzJywgJyFmb28uanMnXSkpO1xuICogLy8gdHJ1ZVxuICogY29uc29sZS5sb2cobW0uc29tZShbJ2Zvby5qcyddLCBbJyouanMnLCAnIWZvby5qcyddKSk7XG4gKiAvLyBmYWxzZVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYGxpc3RgIFRoZSBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncyB0byB0ZXN0LiBSZXR1cm5zIGFzIHNvb24gYXMgdGhlIGZpcnN0IG1hdGNoIGlzIGZvdW5kLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGBwYXR0ZXJuc2AgT25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJucyB0byB1c2UgZm9yIG1hdGNoaW5nLlxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYCBTZWUgYXZhaWxhYmxlIFtvcHRpb25zXSgjb3B0aW9ucykgZm9yIGNoYW5naW5nIGhvdyBtYXRjaGVzIGFyZSBwZXJmb3JtZWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBhbnkgcGF0dGVybnMgbWF0Y2ggYHN0cmBcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubWljcm9tYXRjaC5zb21lID0gKGxpc3QsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIGxldCBpdGVtcyA9IFtdLmNvbmNhdChsaXN0KTtcblxuICBmb3IgKGxldCBwYXR0ZXJuIG9mIFtdLmNvbmNhdChwYXR0ZXJucykpIHtcbiAgICBsZXQgaXNNYXRjaCA9IHBpY29tYXRjaChTdHJpbmcocGF0dGVybiksIG9wdGlvbnMpO1xuICAgIGlmIChpdGVtcy5zb21lKGl0ZW0gPT4gaXNNYXRjaChpdGVtKSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBldmVyeSBzdHJpbmcgaW4gdGhlIGdpdmVuIGBsaXN0YCBtYXRjaGVzXG4gKiBhbnkgb2YgdGhlIGdpdmVuIGdsb2IgYHBhdHRlcm5zYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgbW0gPSByZXF1aXJlKCdtaWNyb21hdGNoJyk7XG4gKiAvLyBtbS5ldmVyeShsaXN0LCBwYXR0ZXJuc1ssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhtbS5ldmVyeSgnZm9vLmpzJywgWydmb28uanMnXSkpO1xuICogLy8gdHJ1ZVxuICogY29uc29sZS5sb2cobW0uZXZlcnkoWydmb28uanMnLCAnYmFyLmpzJ10sIFsnKi5qcyddKSk7XG4gKiAvLyB0cnVlXG4gKiBjb25zb2xlLmxvZyhtbS5ldmVyeShbJ2Zvby5qcycsICdiYXIuanMnXSwgWycqLmpzJywgJyFmb28uanMnXSkpO1xuICogLy8gZmFsc2VcbiAqIGNvbnNvbGUubG9nKG1tLmV2ZXJ5KFsnZm9vLmpzJ10sIFsnKi5qcycsICchZm9vLmpzJ10pKTtcbiAqIC8vIGZhbHNlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBgbGlzdGAgVGhlIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmdzIHRvIHRlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYHBhdHRlcm5zYCBPbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgIFNlZSBhdmFpbGFibGUgW29wdGlvbnNdKCNvcHRpb25zKSBmb3IgY2hhbmdpbmcgaG93IG1hdGNoZXMgYXJlIHBlcmZvcm1lZFxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFueSBwYXR0ZXJucyBtYXRjaCBgc3RyYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLmV2ZXJ5ID0gKGxpc3QsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIGxldCBpdGVtcyA9IFtdLmNvbmNhdChsaXN0KTtcblxuICBmb3IgKGxldCBwYXR0ZXJuIG9mIFtdLmNvbmNhdChwYXR0ZXJucykpIHtcbiAgICBsZXQgaXNNYXRjaCA9IHBpY29tYXRjaChTdHJpbmcocGF0dGVybiksIG9wdGlvbnMpO1xuICAgIGlmICghaXRlbXMuZXZlcnkoaXRlbSA9PiBpc01hdGNoKGl0ZW0pKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmICoqYWxsKiogb2YgdGhlIGdpdmVuIGBwYXR0ZXJuc2AgbWF0Y2hcbiAqIHRoZSBzcGVjaWZpZWQgc3RyaW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tLmFsbChzdHJpbmcsIHBhdHRlcm5zWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKG1tLmFsbCgnZm9vLmpzJywgWydmb28uanMnXSkpO1xuICogLy8gdHJ1ZVxuICpcbiAqIGNvbnNvbGUubG9nKG1tLmFsbCgnZm9vLmpzJywgWycqLmpzJywgJyFmb28uanMnXSkpO1xuICogLy8gZmFsc2VcbiAqXG4gKiBjb25zb2xlLmxvZyhtbS5hbGwoJ2Zvby5qcycsIFsnKi5qcycsICdmb28uanMnXSkpO1xuICogLy8gdHJ1ZVxuICpcbiAqIGNvbnNvbGUubG9nKG1tLmFsbCgnZm9vLmpzJywgWycqLmpzJywgJ2YqJywgJypvKicsICcqby5qcyddKSk7XG4gKiAvLyB0cnVlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBgc3RyYCBUaGUgc3RyaW5nIHRvIHRlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYHBhdHRlcm5zYCBPbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgIFNlZSBhdmFpbGFibGUgW29wdGlvbnNdKCNvcHRpb25zKSBmb3IgY2hhbmdpbmcgaG93IG1hdGNoZXMgYXJlIHBlcmZvcm1lZFxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFueSBwYXR0ZXJucyBtYXRjaCBgc3RyYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLmFsbCA9IChzdHIsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIGEgc3RyaW5nOiBcIiR7dXRpbC5pbnNwZWN0KHN0cil9XCJgKTtcbiAgfVxuXG4gIHJldHVybiBbXS5jb25jYXQocGF0dGVybnMpLmV2ZXJ5KHAgPT4gcGljb21hdGNoKHAsIG9wdGlvbnMpKHN0cikpO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIG1hdGNoZXMgY2FwdHVyZWQgYnkgYHBhdHRlcm5gIGluIGBzdHJpbmcsIG9yIGBudWxsYCBpZiB0aGUgcGF0dGVybiBkaWQgbm90IG1hdGNoLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tLmNhcHR1cmUocGF0dGVybiwgc3RyaW5nWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKG1tLmNhcHR1cmUoJ3Rlc3QvKi5qcycsICd0ZXN0L2Zvby5qcycpKTtcbiAqIC8vPT4gWydmb28nXVxuICogY29uc29sZS5sb2cobW0uY2FwdHVyZSgndGVzdC8qLmpzJywgJ2Zvby9iYXIuY3NzJykpO1xuICogLy89PiBudWxsXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgZ2xvYmAgR2xvYiBwYXR0ZXJuIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBTdHJpbmcgdG8gbWF0Y2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2AgU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpIGZvciBjaGFuZ2luZyBob3cgbWF0Y2hlcyBhcmUgcGVyZm9ybWVkXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIGFuIGFycmF5IG9mIGNhcHR1cmVzIGlmIHRoZSBpbnB1dCBtYXRjaGVzIHRoZSBnbG9iIHBhdHRlcm4sIG90aGVyd2lzZSBgbnVsbGAuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1pY3JvbWF0Y2guY2FwdHVyZSA9IChnbG9iLCBpbnB1dCwgb3B0aW9ucykgPT4ge1xuICBsZXQgcG9zaXggPSB1dGlscy5pc1dpbmRvd3Mob3B0aW9ucyk7XG4gIGxldCByZWdleCA9IHBpY29tYXRjaC5tYWtlUmUoU3RyaW5nKGdsb2IpLCB7IC4uLm9wdGlvbnMsIGNhcHR1cmU6IHRydWUgfSk7XG4gIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMocG9zaXggPyB1dGlscy50b1Bvc2l4U2xhc2hlcyhpbnB1dCkgOiBpbnB1dCk7XG5cbiAgaWYgKG1hdGNoKSB7XG4gICAgcmV0dXJuIG1hdGNoLnNsaWNlKDEpLm1hcCh2ID0+IHYgPT09IHZvaWQgMCA/ICcnIDogdik7XG4gIH1cbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgcmVndWxhciBleHByZXNzaW9uIGZyb20gdGhlIGdpdmVuIGdsb2IgYHBhdHRlcm5gLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIC8vIG1tLm1ha2VSZShwYXR0ZXJuWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKG1tLm1ha2VSZSgnKi5qcycpKTtcbiAqIC8vPT4gL14oPzooXFwuW1xcXFxcXC9dKT8oPyFcXC4pKD89LilbXlxcL10qP1xcLmpzKSQvXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgcGF0dGVybmAgQSBnbG9iIHBhdHRlcm4gdG8gY29udmVydCB0byByZWdleC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge1JlZ0V4cH0gUmV0dXJucyBhIHJlZ2V4IGNyZWF0ZWQgZnJvbSB0aGUgZ2l2ZW4gcGF0dGVybi5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubWljcm9tYXRjaC5tYWtlUmUgPSAoLi4uYXJncykgPT4gcGljb21hdGNoLm1ha2VSZSguLi5hcmdzKTtcblxuLyoqXG4gKiBTY2FuIGEgZ2xvYiBwYXR0ZXJuIHRvIHNlcGFyYXRlIHRoZSBwYXR0ZXJuIGludG8gc2VnbWVudHMuIFVzZWRcbiAqIGJ5IHRoZSBbc3BsaXRdKCNzcGxpdCkgbWV0aG9kLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIGNvbnN0IHN0YXRlID0gbW0uc2NhbihwYXR0ZXJuWywgb3B0aW9uc10pO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHBhdHRlcm5gXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGhcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubWljcm9tYXRjaC5zY2FuID0gKC4uLmFyZ3MpID0+IHBpY29tYXRjaC5zY2FuKC4uLmFyZ3MpO1xuXG4vKipcbiAqIFBhcnNlIGEgZ2xvYiBwYXR0ZXJuIHRvIGNyZWF0ZSB0aGUgc291cmNlIHN0cmluZyBmb3IgYSByZWd1bGFyXG4gKiBleHByZXNzaW9uLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtbSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIGNvbnN0IHN0YXRlID0gbW0ocGF0dGVyblssIG9wdGlvbnNdKTtcbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBnbG9iYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHVzZWZ1bCBwcm9wZXJ0aWVzIGFuZCBvdXRwdXQgdG8gYmUgdXNlZCBhcyByZWdleCBzb3VyY2Ugc3RyaW5nLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLnBhcnNlID0gKHBhdHRlcm5zLCBvcHRpb25zKSA9PiB7XG4gIGxldCByZXMgPSBbXTtcbiAgZm9yIChsZXQgcGF0dGVybiBvZiBbXS5jb25jYXQocGF0dGVybnMgfHwgW10pKSB7XG4gICAgZm9yIChsZXQgc3RyIG9mIGJyYWNlcyhTdHJpbmcocGF0dGVybiksIG9wdGlvbnMpKSB7XG4gICAgICByZXMucHVzaChwaWNvbWF0Y2gucGFyc2Uoc3RyLCBvcHRpb25zKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59O1xuXG4vKipcbiAqIFByb2Nlc3MgdGhlIGdpdmVuIGJyYWNlIGBwYXR0ZXJuYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeyBicmFjZXMgfSA9IHJlcXVpcmUoJ21pY3JvbWF0Y2gnKTtcbiAqIGNvbnNvbGUubG9nKGJyYWNlcygnZm9vL3thLGIsY30vYmFyJykpO1xuICogLy89PiBbICdmb28vKGF8YnxjKS9iYXInIF1cbiAqXG4gKiBjb25zb2xlLmxvZyhicmFjZXMoJ2Zvby97YSxiLGN9L2JhcicsIHsgZXhwYW5kOiB0cnVlIH0pKTtcbiAqIC8vPT4gWyAnZm9vL2EvYmFyJywgJ2Zvby9iL2JhcicsICdmb28vYy9iYXInIF1cbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBwYXR0ZXJuYCBTdHJpbmcgd2l0aCBicmFjZSBwYXR0ZXJuIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgIEFueSBbb3B0aW9uc10oI29wdGlvbnMpIHRvIGNoYW5nZSBob3cgZXhwYW5zaW9uIGlzIHBlcmZvcm1lZC4gU2VlIHRoZSBbYnJhY2VzXVtdIGxpYnJhcnkgZm9yIGFsbCBhdmFpbGFibGUgb3B0aW9ucy5cbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5taWNyb21hdGNoLmJyYWNlcyA9IChwYXR0ZXJuLCBvcHRpb25zKSA9PiB7XG4gIGlmICh0eXBlb2YgcGF0dGVybiAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG4gIGlmICgob3B0aW9ucyAmJiBvcHRpb25zLm5vYnJhY2UgPT09IHRydWUpIHx8ICEvXFx7LipcXH0vLnRlc3QocGF0dGVybikpIHtcbiAgICByZXR1cm4gW3BhdHRlcm5dO1xuICB9XG4gIHJldHVybiBicmFjZXMocGF0dGVybiwgb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEV4cGFuZCBicmFjZXNcbiAqL1xuXG5taWNyb21hdGNoLmJyYWNlRXhwYW5kID0gKHBhdHRlcm4sIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBwYXR0ZXJuICE9PSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBzdHJpbmcnKTtcbiAgcmV0dXJuIG1pY3JvbWF0Y2guYnJhY2VzKHBhdHRlcm4sIHsgLi4ub3B0aW9ucywgZXhwYW5kOiB0cnVlIH0pO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgbWljcm9tYXRjaFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gbWljcm9tYXRjaDtcbiIsICJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fc3ByZWFkQXJyYXlzID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5cykgfHwgZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcbiAgICByZXR1cm4gcjtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEluZGV4ID0gZXhwb3J0cy5nZXRUYWdzID0gZXhwb3J0cy5lbXB0eVRhZ3MgPSBleHBvcnRzLmFsaWFzID0gZXhwb3J0cy5jbGVhbiA9IGV4cG9ydHMuU3RyaWN0VHlwZSA9IGV4cG9ydHMuZGljdGlvbmFyeSA9IGV4cG9ydHMuSW50ZWdlciA9IGV4cG9ydHMucmVmaW5lbWVudCA9IGV4cG9ydHMub2JqZWN0ID0gZXhwb3J0cy5PYmplY3RUeXBlID0gZXhwb3J0cy5EaWN0aW9uYXJ5ID0gZXhwb3J0cy5hbnkgPSBleHBvcnRzLkFueVR5cGUgPSBleHBvcnRzLm5ldmVyID0gZXhwb3J0cy5OZXZlclR5cGUgPSBleHBvcnRzLmdldERlZmF1bHRDb250ZXh0ID0gZXhwb3J0cy5nZXRWYWxpZGF0aW9uRXJyb3IgPSBleHBvcnRzLnZvaWQgPSBleHBvcnRzLmludGVyZmFjZSA9IGV4cG9ydHMuQXJyYXkgPSBleHBvcnRzLnVuZGVmaW5lZCA9IGV4cG9ydHMubnVsbCA9IGV4cG9ydHMuZXhhY3QgPSBleHBvcnRzLkV4YWN0VHlwZSA9IGV4cG9ydHMudGFnZ2VkVW5pb24gPSBleHBvcnRzLlRhZ2dlZFVuaW9uVHlwZSA9IGV4cG9ydHMuc3RyaWN0ID0gZXhwb3J0cy5yZWFkb25seUFycmF5ID0gZXhwb3J0cy5SZWFkb25seUFycmF5VHlwZSA9IGV4cG9ydHMucmVhZG9ubHkgPSBleHBvcnRzLlJlYWRvbmx5VHlwZSA9IGV4cG9ydHMudHVwbGUgPSBleHBvcnRzLlR1cGxlVHlwZSA9IGV4cG9ydHMuaW50ZXJzZWN0aW9uID0gZXhwb3J0cy5tZXJnZUFsbCA9IGV4cG9ydHMuSW50ZXJzZWN0aW9uVHlwZSA9IGV4cG9ydHMudW5pb24gPSBleHBvcnRzLlVuaW9uVHlwZSA9IGV4cG9ydHMucmVjb3JkID0gZXhwb3J0cy5nZXREb21haW5LZXlzID0gZXhwb3J0cy5EaWN0aW9uYXJ5VHlwZSA9IGV4cG9ydHMucGFydGlhbCA9IGV4cG9ydHMuUGFydGlhbFR5cGUgPSBleHBvcnRzLnR5cGUgPSBleHBvcnRzLkludGVyZmFjZVR5cGUgPSBleHBvcnRzLmFycmF5ID0gZXhwb3J0cy5BcnJheVR5cGUgPSBleHBvcnRzLnJlY3Vyc2lvbiA9IGV4cG9ydHMuUmVjdXJzaXZlVHlwZSA9IGV4cG9ydHMua2V5b2YgPSBleHBvcnRzLktleW9mVHlwZSA9IGV4cG9ydHMubGl0ZXJhbCA9IGV4cG9ydHMuTGl0ZXJhbFR5cGUgPSBleHBvcnRzLkludCA9IGV4cG9ydHMuYnJhbmQgPSBleHBvcnRzLlJlZmluZW1lbnRUeXBlID0gZXhwb3J0cy5GdW5jdGlvbiA9IGV4cG9ydHMuRnVuY3Rpb25UeXBlID0gZXhwb3J0cy5Vbmtub3duUmVjb3JkID0gZXhwb3J0cy5BbnlEaWN0aW9uYXJ5VHlwZSA9IGV4cG9ydHMuVW5rbm93bkFycmF5ID0gZXhwb3J0cy5BbnlBcnJheVR5cGUgPSBleHBvcnRzLmJvb2xlYW4gPSBleHBvcnRzLkJvb2xlYW5UeXBlID0gZXhwb3J0cy5iaWdpbnQgPSBleHBvcnRzLkJpZ0ludFR5cGUgPSBleHBvcnRzLm51bWJlciA9IGV4cG9ydHMuTnVtYmVyVHlwZSA9IGV4cG9ydHMuc3RyaW5nID0gZXhwb3J0cy5TdHJpbmdUeXBlID0gZXhwb3J0cy51bmtub3duID0gZXhwb3J0cy5Vbmtub3duVHlwZSA9IGV4cG9ydHMudm9pZFR5cGUgPSBleHBvcnRzLlZvaWRUeXBlID0gZXhwb3J0cy5VbmRlZmluZWRUeXBlID0gZXhwb3J0cy5udWxsVHlwZSA9IGV4cG9ydHMuTnVsbFR5cGUgPSBleHBvcnRzLnN1Y2Nlc3MgPSBleHBvcnRzLmZhaWx1cmUgPSBleHBvcnRzLmZhaWx1cmVzID0gZXhwb3J0cy5hcHBlbmRDb250ZXh0ID0gZXhwb3J0cy5nZXRDb250ZXh0RW50cnkgPSBleHBvcnRzLmdldEZ1bmN0aW9uTmFtZSA9IGV4cG9ydHMuaWRlbnRpdHkgPSBleHBvcnRzLlR5cGUgPSB2b2lkIDA7XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgRWl0aGVyXzEgPSByZXF1aXJlKFwiZnAtdHMvbGliL0VpdGhlclwiKTtcbi8qKlxuICogQGNhdGVnb3J5IE1vZGVsXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIFR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVHlwZShcbiAgICAvKiogYSB1bmlxdWUgbmFtZSBmb3IgdGhpcyBjb2RlYyAqL1xuICAgIG5hbWUsIFxuICAgIC8qKiBhIGN1c3RvbSB0eXBlIGd1YXJkICovXG4gICAgaXMsIFxuICAgIC8qKiBzdWNjZWVkcyBpZiBhIHZhbHVlIG9mIHR5cGUgSSBjYW4gYmUgZGVjb2RlZCB0byBhIHZhbHVlIG9mIHR5cGUgQSAqL1xuICAgIHZhbGlkYXRlLCBcbiAgICAvKiogY29udmVydHMgYSB2YWx1ZSBvZiB0eXBlIEEgdG8gYSB2YWx1ZSBvZiB0eXBlIE8gKi9cbiAgICBlbmNvZGUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pcyA9IGlzO1xuICAgICAgICB0aGlzLnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICAgIHRoaXMuZW5jb2RlID0gZW5jb2RlO1xuICAgICAgICB0aGlzLmRlY29kZSA9IHRoaXMuZGVjb2RlLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIFR5cGUucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiAoYWIsIG5hbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gXCJwaXBlKFwiICsgdGhpcy5uYW1lICsgXCIsIFwiICsgYWIubmFtZSArIFwiKVwiOyB9XG4gICAgICAgIHJldHVybiBuZXcgVHlwZShuYW1lLCBhYi5pcywgZnVuY3Rpb24gKGksIGMpIHtcbiAgICAgICAgICAgIHZhciBlID0gX3RoaXMudmFsaWRhdGUoaSwgYyk7XG4gICAgICAgICAgICBpZiAoRWl0aGVyXzEuaXNMZWZ0KGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWIudmFsaWRhdGUoZS5yaWdodCwgYyk7XG4gICAgICAgIH0sIHRoaXMuZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5ICYmIGFiLmVuY29kZSA9PT0gZXhwb3J0cy5pZGVudGl0eSA/IGV4cG9ydHMuaWRlbnRpdHkgOiBmdW5jdGlvbiAoYikgeyByZXR1cm4gX3RoaXMuZW5jb2RlKGFiLmVuY29kZShiKSk7IH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQHNpbmNlIDEuMC4wXG4gICAgICovXG4gICAgVHlwZS5wcm90b3R5cGUuYXNEZWNvZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIFR5cGUucHJvdG90eXBlLmFzRW5jb2RlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBhIHZlcnNpb24gb2YgYHZhbGlkYXRlYCB3aXRoIGEgZGVmYXVsdCBjb250ZXh0XG4gICAgICogQHNpbmNlIDEuMC4wXG4gICAgICovXG4gICAgVHlwZS5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGUoaSwgW3sga2V5OiAnJywgdHlwZTogdGhpcywgYWN0dWFsOiBpIH1dKTtcbiAgICB9O1xuICAgIHJldHVybiBUeXBlO1xufSgpKTtcbmV4cG9ydHMuVHlwZSA9IFR5cGU7XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLmlkZW50aXR5ID0gZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGE7IH07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLmdldEZ1bmN0aW9uTmFtZSA9IGZ1bmN0aW9uIChmKSB7XG4gICAgcmV0dXJuIGYuZGlzcGxheU5hbWUgfHwgZi5uYW1lIHx8IFwiPGZ1bmN0aW9uXCIgKyBmLmxlbmd0aCArIFwiPlwiO1xufTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMuZ2V0Q29udGV4dEVudHJ5ID0gZnVuY3Rpb24gKGtleSwgZGVjb2RlcikgeyByZXR1cm4gKHsga2V5OiBrZXksIHR5cGU6IGRlY29kZXIgfSk7IH07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLmFwcGVuZENvbnRleHQgPSBmdW5jdGlvbiAoYywga2V5LCBkZWNvZGVyLCBhY3R1YWwpIHtcbiAgICB2YXIgbGVuID0gYy5sZW5ndGg7XG4gICAgdmFyIHIgPSBBcnJheShsZW4gKyAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHJbaV0gPSBjW2ldO1xuICAgIH1cbiAgICByW2xlbl0gPSB7IGtleToga2V5LCB0eXBlOiBkZWNvZGVyLCBhY3R1YWw6IGFjdHVhbCB9O1xuICAgIHJldHVybiByO1xufTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMuZmFpbHVyZXMgPSBFaXRoZXJfMS5sZWZ0O1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5mYWlsdXJlID0gZnVuY3Rpb24gKHZhbHVlLCBjb250ZXh0LCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuZmFpbHVyZXMoW3sgdmFsdWU6IHZhbHVlLCBjb250ZXh0OiBjb250ZXh0LCBtZXNzYWdlOiBtZXNzYWdlIH1dKTtcbn07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLnN1Y2Nlc3MgPSBFaXRoZXJfMS5yaWdodDtcbnZhciBwdXNoQWxsID0gZnVuY3Rpb24gKHhzLCB5cykge1xuICAgIHZhciBsID0geXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHhzLnB1c2goeXNbaV0pO1xuICAgIH1cbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBwcmltaXRpdmVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgTnVsbFR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE51bGxUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE51bGxUeXBlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnbnVsbCcsIGZ1bmN0aW9uICh1KSB7IHJldHVybiB1ID09PSBudWxsOyB9LCBmdW5jdGlvbiAodSwgYykgeyByZXR1cm4gKF90aGlzLmlzKHUpID8gZXhwb3J0cy5zdWNjZXNzKHUpIDogZXhwb3J0cy5mYWlsdXJlKHUsIGMpKTsgfSwgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdOdWxsVHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIE51bGxUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLk51bGxUeXBlID0gTnVsbFR5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5udWxsVHlwZSA9IG5ldyBOdWxsVHlwZSgpO1xuZXhwb3J0cy5udWxsID0gZXhwb3J0cy5udWxsVHlwZTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbnZhciBVbmRlZmluZWRUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhVbmRlZmluZWRUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFVuZGVmaW5lZFR5cGUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICd1bmRlZmluZWQnLCBmdW5jdGlvbiAodSkgeyByZXR1cm4gdSA9PT0gdm9pZCAwOyB9LCBmdW5jdGlvbiAodSwgYykgeyByZXR1cm4gKF90aGlzLmlzKHUpID8gZXhwb3J0cy5zdWNjZXNzKHUpIDogZXhwb3J0cy5mYWlsdXJlKHUsIGMpKTsgfSwgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdVbmRlZmluZWRUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gVW5kZWZpbmVkVHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5VbmRlZmluZWRUeXBlID0gVW5kZWZpbmVkVHlwZTtcbnZhciB1bmRlZmluZWRUeXBlID0gbmV3IFVuZGVmaW5lZFR5cGUoKTtcbmV4cG9ydHMudW5kZWZpbmVkID0gdW5kZWZpbmVkVHlwZTtcbi8qKlxuICogQHNpbmNlIDEuMi4wXG4gKi9cbnZhciBWb2lkVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVm9pZFR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVm9pZFR5cGUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICd2b2lkJywgdW5kZWZpbmVkVHlwZS5pcywgdW5kZWZpbmVkVHlwZS52YWxpZGF0ZSwgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdWb2lkVHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFZvaWRUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLlZvaWRUeXBlID0gVm9pZFR5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS4yLjBcbiAqL1xuZXhwb3J0cy52b2lkVHlwZSA9IG5ldyBWb2lkVHlwZSgpO1xuZXhwb3J0cy52b2lkID0gZXhwb3J0cy52b2lkVHlwZTtcbi8qKlxuICogQHNpbmNlIDEuNS4wXG4gKi9cbnZhciBVbmtub3duVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVW5rbm93blR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVW5rbm93blR5cGUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICd1bmtub3duJywgZnVuY3Rpb24gKF8pIHsgcmV0dXJuIHRydWU7IH0sIGV4cG9ydHMuc3VjY2VzcywgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdVbmtub3duVHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFVua25vd25UeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLlVua25vd25UeXBlID0gVW5rbm93blR5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS41LjBcbiAqL1xuZXhwb3J0cy51bmtub3duID0gbmV3IFVua25vd25UeXBlKCk7XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgU3RyaW5nVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3RyaW5nVHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdHJpbmdUeXBlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnc3RyaW5nJywgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHR5cGVvZiB1ID09PSAnc3RyaW5nJzsgfSwgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChfdGhpcy5pcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh1KSA6IGV4cG9ydHMuZmFpbHVyZSh1LCBjKSk7IH0sIGV4cG9ydHMuaWRlbnRpdHkpIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnU3RyaW5nVHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZ1R5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuU3RyaW5nVHlwZSA9IFN0cmluZ1R5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5zdHJpbmcgPSBuZXcgU3RyaW5nVHlwZSgpO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIE51bWJlclR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE51bWJlclR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTnVtYmVyVHlwZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ251bWJlcicsIGZ1bmN0aW9uICh1KSB7IHJldHVybiB0eXBlb2YgdSA9PT0gJ251bWJlcic7IH0sIGZ1bmN0aW9uICh1LCBjKSB7IHJldHVybiAoX3RoaXMuaXModSkgPyBleHBvcnRzLnN1Y2Nlc3ModSkgOiBleHBvcnRzLmZhaWx1cmUodSwgYykpOyB9LCBleHBvcnRzLmlkZW50aXR5KSB8fCB0aGlzO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ051bWJlclR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBOdW1iZXJUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLk51bWJlclR5cGUgPSBOdW1iZXJUeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgUHJpbWl0aXZlc1xuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMubnVtYmVyID0gbmV3IE51bWJlclR5cGUoKTtcbi8qKlxuICogQHNpbmNlIDIuMS4wXG4gKi9cbnZhciBCaWdJbnRUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhCaWdJbnRUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEJpZ0ludFR5cGUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICdiaWdpbnQnLCBcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiB2YWxpZC10eXBlb2ZcbiAgICAgICAgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHR5cGVvZiB1ID09PSAnYmlnaW50JzsgfSwgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChfdGhpcy5pcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh1KSA6IGV4cG9ydHMuZmFpbHVyZSh1LCBjKSk7IH0sIGV4cG9ydHMuaWRlbnRpdHkpIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnQmlnSW50VHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEJpZ0ludFR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuQmlnSW50VHlwZSA9IEJpZ0ludFR5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMi4xLjBcbiAqL1xuZXhwb3J0cy5iaWdpbnQgPSBuZXcgQmlnSW50VHlwZSgpO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIEJvb2xlYW5UeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhCb29sZWFuVHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBCb29sZWFuVHlwZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ2Jvb2xlYW4nLCBmdW5jdGlvbiAodSkgeyByZXR1cm4gdHlwZW9mIHUgPT09ICdib29sZWFuJzsgfSwgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChfdGhpcy5pcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh1KSA6IGV4cG9ydHMuZmFpbHVyZSh1LCBjKSk7IH0sIGV4cG9ydHMuaWRlbnRpdHkpIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnQm9vbGVhblR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBCb29sZWFuVHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5Cb29sZWFuVHlwZSA9IEJvb2xlYW5UeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgUHJpbWl0aXZlc1xuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMuYm9vbGVhbiA9IG5ldyBCb29sZWFuVHlwZSgpO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIEFueUFycmF5VHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQW55QXJyYXlUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFueUFycmF5VHlwZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ1Vua25vd25BcnJheScsIEFycmF5LmlzQXJyYXksIGZ1bmN0aW9uICh1LCBjKSB7IHJldHVybiAoX3RoaXMuaXModSkgPyBleHBvcnRzLnN1Y2Nlc3ModSkgOiBleHBvcnRzLmZhaWx1cmUodSwgYykpOyB9LCBleHBvcnRzLmlkZW50aXR5KSB8fCB0aGlzO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ0FueUFycmF5VHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEFueUFycmF5VHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5BbnlBcnJheVR5cGUgPSBBbnlBcnJheVR5cGU7XG4vKipcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS43LjFcbiAqL1xuZXhwb3J0cy5Vbmtub3duQXJyYXkgPSBuZXcgQW55QXJyYXlUeXBlKCk7XG5leHBvcnRzLkFycmF5ID0gZXhwb3J0cy5Vbmtub3duQXJyYXk7XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgQW55RGljdGlvbmFyeVR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFueURpY3Rpb25hcnlUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFueURpY3Rpb25hcnlUeXBlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnVW5rbm93blJlY29yZCcsIGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICB2YXIgcyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh1KTtcbiAgICAgICAgICAgIHJldHVybiBzID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBzID09PSAnW29iamVjdCBXaW5kb3ddJztcbiAgICAgICAgfSwgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChfdGhpcy5pcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh1KSA6IGV4cG9ydHMuZmFpbHVyZSh1LCBjKSk7IH0sIGV4cG9ydHMuaWRlbnRpdHkpIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnQW55RGljdGlvbmFyeVR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBBbnlEaWN0aW9uYXJ5VHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5BbnlEaWN0aW9uYXJ5VHlwZSA9IEFueURpY3Rpb25hcnlUeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgUHJpbWl0aXZlc1xuICogQHNpbmNlIDEuNy4xXG4gKi9cbmV4cG9ydHMuVW5rbm93blJlY29yZCA9IG5ldyBBbnlEaWN0aW9uYXJ5VHlwZSgpO1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVwcmVjYXRlZFxuICogQHNpbmNlIDEuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG52YXIgRnVuY3Rpb25UeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhGdW5jdGlvblR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRnVuY3Rpb25UeXBlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnRnVuY3Rpb24nLCBcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnN0cmljdC10eXBlLXByZWRpY2F0ZXNcbiAgICAgICAgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHR5cGVvZiB1ID09PSAnZnVuY3Rpb24nOyB9LCBmdW5jdGlvbiAodSwgYykgeyByZXR1cm4gKF90aGlzLmlzKHUpID8gZXhwb3J0cy5zdWNjZXNzKHUpIDogZXhwb3J0cy5mYWlsdXJlKHUsIGMpKTsgfSwgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdGdW5jdGlvblR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBGdW5jdGlvblR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuRnVuY3Rpb25UeXBlID0gRnVuY3Rpb25UeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVwcmVjYXRlZFxuICogQHNpbmNlIDEuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRlcHJlY2F0aW9uXG5leHBvcnRzLkZ1bmN0aW9uID0gbmV3IEZ1bmN0aW9uVHlwZSgpO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIFJlZmluZW1lbnRUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhSZWZpbmVtZW50VHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBSZWZpbmVtZW50VHlwZShuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSwgdHlwZSwgcHJlZGljYXRlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgX3RoaXMucHJlZGljYXRlID0gcHJlZGljYXRlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ1JlZmluZW1lbnRUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUmVmaW5lbWVudFR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuUmVmaW5lbWVudFR5cGUgPSBSZWZpbmVtZW50VHlwZTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbWJpbmF0b3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEBjYXRlZ29yeSBDb21iaW5hdG9yc1xuICogQHNpbmNlIDEuOC4xXG4gKi9cbmV4cG9ydHMuYnJhbmQgPSBmdW5jdGlvbiAoY29kZWMsIHByZWRpY2F0ZSwgbmFtZSkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbiAgICByZXR1cm4gcmVmaW5lbWVudChjb2RlYywgcHJlZGljYXRlLCBuYW1lKTtcbn07XG4vKipcbiAqIEEgYnJhbmRlZCBjb2RlYyByZXByZXNlbnRpbmcgYW4gaW50ZWdlclxuICpcbiAqIEBjYXRlZ29yeSBQcmltaXRpdmVzXG4gKiBAc2luY2UgMS44LjFcbiAqL1xuZXhwb3J0cy5JbnQgPSBleHBvcnRzLmJyYW5kKGV4cG9ydHMubnVtYmVyLCBmdW5jdGlvbiAobikgeyByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihuKTsgfSwgJ0ludCcpO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIExpdGVyYWxUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhMaXRlcmFsVHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBMaXRlcmFsVHlwZShuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnTGl0ZXJhbFR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBMaXRlcmFsVHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5MaXRlcmFsVHlwZSA9IExpdGVyYWxUeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgQ29tYmluYXRvcnNcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLmxpdGVyYWwgPSBmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7IH1cbiAgICB2YXIgaXMgPSBmdW5jdGlvbiAodSkgeyByZXR1cm4gdSA9PT0gdmFsdWU7IH07XG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsVHlwZShuYW1lLCBpcywgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChpcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh2YWx1ZSkgOiBleHBvcnRzLmZhaWx1cmUodSwgYykpOyB9LCBleHBvcnRzLmlkZW50aXR5LCB2YWx1ZSk7XG59O1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIEtleW9mVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoS2V5b2ZUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEtleW9mVHlwZShuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSwga2V5cykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMua2V5cyA9IGtleXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnS2V5b2ZUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gS2V5b2ZUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLktleW9mVHlwZSA9IEtleW9mVHlwZTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4vKipcbiAqIEBjYXRlZ29yeSBDb21iaW5hdG9yc1xuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMua2V5b2YgPSBmdW5jdGlvbiAoa2V5cywgbmFtZSkge1xuICAgIGlmIChuYW1lID09PSB2b2lkIDApIHsgbmFtZSA9IE9iamVjdC5rZXlzKGtleXMpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGspIHsgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGspOyB9KVxuICAgICAgICAuam9pbignIHwgJyk7IH1cbiAgICB2YXIgaXMgPSBmdW5jdGlvbiAodSkgeyByZXR1cm4gZXhwb3J0cy5zdHJpbmcuaXModSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbChrZXlzLCB1KTsgfTtcbiAgICByZXR1cm4gbmV3IEtleW9mVHlwZShuYW1lLCBpcywgZnVuY3Rpb24gKHUsIGMpIHsgcmV0dXJuIChpcyh1KSA/IGV4cG9ydHMuc3VjY2Vzcyh1KSA6IGV4cG9ydHMuZmFpbHVyZSh1LCBjKSk7IH0sIGV4cG9ydHMuaWRlbnRpdHksIGtleXMpO1xufTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbnZhciBSZWN1cnNpdmVUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhSZWN1cnNpdmVUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFJlY3Vyc2l2ZVR5cGUobmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUsIHJ1bkRlZmluaXRpb24pIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnJ1bkRlZmluaXRpb24gPSBydW5EZWZpbml0aW9uO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ1JlY3Vyc2l2ZVR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBSZWN1cnNpdmVUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLlJlY3Vyc2l2ZVR5cGUgPSBSZWN1cnNpdmVUeXBlO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlY3Vyc2l2ZVR5cGUucHJvdG90eXBlLCAndHlwZScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRGVmaW5pdGlvbigpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbn0pO1xuLyoqXG4gKiBAY2F0ZWdvcnkgQ29tYmluYXRvcnNcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLnJlY3Vyc2lvbiA9IGZ1bmN0aW9uIChuYW1lLCBkZWZpbml0aW9uKSB7XG4gICAgdmFyIGNhY2hlO1xuICAgIHZhciBydW5EZWZpbml0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWNhY2hlKSB7XG4gICAgICAgICAgICBjYWNoZSA9IGRlZmluaXRpb24oU2VsZik7XG4gICAgICAgICAgICBjYWNoZS5uYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgfTtcbiAgICB2YXIgU2VsZiA9IG5ldyBSZWN1cnNpdmVUeXBlKG5hbWUsIGZ1bmN0aW9uICh1KSB7IHJldHVybiBydW5EZWZpbml0aW9uKCkuaXModSk7IH0sIGZ1bmN0aW9uICh1LCBjKSB7IHJldHVybiBydW5EZWZpbml0aW9uKCkudmFsaWRhdGUodSwgYyk7IH0sIGZ1bmN0aW9uIChhKSB7IHJldHVybiBydW5EZWZpbml0aW9uKCkuZW5jb2RlKGEpOyB9LCBydW5EZWZpbml0aW9uKTtcbiAgICByZXR1cm4gU2VsZjtcbn07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgQXJyYXlUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcnJheVR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXJyYXlUeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCB0eXBlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdBcnJheVR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBBcnJheVR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuQXJyYXlUeXBlID0gQXJyYXlUeXBlO1xuLyoqXG4gKiBAY2F0ZWdvcnkgQ29tYmluYXRvcnNcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnRzLmFycmF5ID0gZnVuY3Rpb24gKGl0ZW0sIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBcIkFycmF5PFwiICsgaXRlbS5uYW1lICsgXCI+XCI7IH1cbiAgICByZXR1cm4gbmV3IEFycmF5VHlwZShuYW1lLCBmdW5jdGlvbiAodSkgeyByZXR1cm4gZXhwb3J0cy5Vbmtub3duQXJyYXkuaXModSkgJiYgdS5ldmVyeShpdGVtLmlzKTsgfSwgZnVuY3Rpb24gKHUsIGMpIHtcbiAgICAgICAgdmFyIGUgPSBleHBvcnRzLlVua25vd25BcnJheS52YWxpZGF0ZSh1LCBjKTtcbiAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVzID0gZS5yaWdodDtcbiAgICAgICAgdmFyIGxlbiA9IHVzLmxlbmd0aDtcbiAgICAgICAgdmFyIGFzID0gdXM7XG4gICAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIHVpID0gdXNbaV07XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaXRlbS52YWxpZGF0ZSh1aSwgZXhwb3J0cy5hcHBlbmRDb250ZXh0KGMsIFN0cmluZyhpKSwgaXRlbSwgdWkpKTtcbiAgICAgICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQocmVzdWx0KSkge1xuICAgICAgICAgICAgICAgIHB1c2hBbGwoZXJyb3JzLCByZXN1bHQubGVmdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYWkgPSByZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKGFpICE9PSB1aSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXMgPT09IHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcyA9IHVzLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXNbaV0gPSBhaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVycm9ycy5sZW5ndGggPiAwID8gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpIDogZXhwb3J0cy5zdWNjZXNzKGFzKTtcbiAgICB9LCBpdGVtLmVuY29kZSA9PT0gZXhwb3J0cy5pZGVudGl0eSA/IGV4cG9ydHMuaWRlbnRpdHkgOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gYS5tYXAoaXRlbS5lbmNvZGUpOyB9LCBpdGVtKTtcbn07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgSW50ZXJmYWNlVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoSW50ZXJmYWNlVHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBJbnRlcmZhY2VUeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCBwcm9wcykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdJbnRlcmZhY2VUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gSW50ZXJmYWNlVHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5JbnRlcmZhY2VUeXBlID0gSW50ZXJmYWNlVHlwZTtcbnZhciBnZXROYW1lRnJvbVByb3BzID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChrKSB7IHJldHVybiBrICsgXCI6IFwiICsgcHJvcHNba10ubmFtZTsgfSlcbiAgICAgICAgLmpvaW4oJywgJyk7XG59O1xudmFyIHVzZUlkZW50aXR5ID0gZnVuY3Rpb24gKGNvZGVjcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29kZWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjb2RlY3NbaV0uZW5jb2RlICE9PSBleHBvcnRzLmlkZW50aXR5KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xudmFyIGdldEludGVyZmFjZVR5cGVOYW1lID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgcmV0dXJuIFwieyBcIiArIGdldE5hbWVGcm9tUHJvcHMocHJvcHMpICsgXCIgfVwiO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IENvbWJpbmF0b3JzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy50eXBlID0gZnVuY3Rpb24gKHByb3BzLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gZ2V0SW50ZXJmYWNlVHlwZU5hbWUocHJvcHMpOyB9XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgdmFyIHR5cGVzID0ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gcHJvcHNba2V5XTsgfSk7XG4gICAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgSW50ZXJmYWNlVHlwZShuYW1lLCBmdW5jdGlvbiAodSkge1xuICAgICAgICBpZiAoZXhwb3J0cy5Vbmtub3duUmVjb3JkLmlzKHUpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHZhciB1ayA9IHVba107XG4gICAgICAgICAgICAgICAgaWYgKCh1ayA9PT0gdW5kZWZpbmVkICYmICFoYXNPd25Qcm9wZXJ0eS5jYWxsKHUsIGspKSB8fCAhdHlwZXNbaV0uaXModWspKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSwgZnVuY3Rpb24gKHUsIGMpIHtcbiAgICAgICAgdmFyIGUgPSBleHBvcnRzLlVua25vd25SZWNvcmQudmFsaWRhdGUodSwgYyk7XG4gICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQoZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvID0gZS5yaWdodDtcbiAgICAgICAgdmFyIGEgPSBvO1xuICAgICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgIHZhciBhayA9IGFba107XG4gICAgICAgICAgICB2YXIgdHlwZV8xID0gdHlwZXNbaV07XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdHlwZV8xLnZhbGlkYXRlKGFrLCBleHBvcnRzLmFwcGVuZENvbnRleHQoYywgaywgdHlwZV8xLCBhaykpO1xuICAgICAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChyZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgcHVzaEFsbChlcnJvcnMsIHJlc3VsdC5sZWZ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB2YWsgPSByZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKHZhayAhPT0gYWsgfHwgKHZhayA9PT0gdW5kZWZpbmVkICYmICFoYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGspKSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoYSA9PT0gbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IF9fYXNzaWduKHt9LCBvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhW2tdID0gdmFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXJyb3JzLmxlbmd0aCA+IDAgPyBleHBvcnRzLmZhaWx1cmVzKGVycm9ycykgOiBleHBvcnRzLnN1Y2Nlc3MoYSk7XG4gICAgfSwgdXNlSWRlbnRpdHkodHlwZXMpXG4gICAgICAgID8gZXhwb3J0cy5pZGVudGl0eVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgcyA9IF9fYXNzaWduKHt9LCBhKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgayA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGVuY29kZSA9IHR5cGVzW2ldLmVuY29kZTtcbiAgICAgICAgICAgICAgICBpZiAoZW5jb2RlICE9PSBleHBvcnRzLmlkZW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHNba10gPSBlbmNvZGUoYVtrXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sIHByb3BzKTtcbn07XG5leHBvcnRzLmludGVyZmFjZSA9IGV4cG9ydHMudHlwZTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbnZhciBQYXJ0aWFsVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUGFydGlhbFR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUGFydGlhbFR5cGUobmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUsIHByb3BzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ1BhcnRpYWxUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUGFydGlhbFR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuUGFydGlhbFR5cGUgPSBQYXJ0aWFsVHlwZTtcbnZhciBnZXRQYXJ0aWFsVHlwZU5hbWUgPSBmdW5jdGlvbiAoaW5uZXIpIHtcbiAgICByZXR1cm4gXCJQYXJ0aWFsPFwiICsgaW5uZXIgKyBcIj5cIjtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBDb21iaW5hdG9yc1xuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMucGFydGlhbCA9IGZ1bmN0aW9uIChwcm9wcywgbmFtZSkge1xuICAgIGlmIChuYW1lID09PSB2b2lkIDApIHsgbmFtZSA9IGdldFBhcnRpYWxUeXBlTmFtZShnZXRJbnRlcmZhY2VUeXBlTmFtZShwcm9wcykpOyB9XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgdmFyIHR5cGVzID0ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gcHJvcHNba2V5XTsgfSk7XG4gICAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgUGFydGlhbFR5cGUobmFtZSwgZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgaWYgKGV4cG9ydHMuVW5rbm93blJlY29yZC5pcyh1KSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgdWsgPSB1W2tdO1xuICAgICAgICAgICAgICAgIGlmICh1ayAhPT0gdW5kZWZpbmVkICYmICFwcm9wc1trXS5pcyh1aykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LCBmdW5jdGlvbiAodSwgYykge1xuICAgICAgICB2YXIgZSA9IGV4cG9ydHMuVW5rbm93blJlY29yZC52YWxpZGF0ZSh1LCBjKTtcbiAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG8gPSBlLnJpZ2h0O1xuICAgICAgICB2YXIgYSA9IG87XG4gICAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgdmFyIGFrID0gYVtrXTtcbiAgICAgICAgICAgIHZhciB0eXBlXzIgPSBwcm9wc1trXTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0eXBlXzIudmFsaWRhdGUoYWssIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBrLCB0eXBlXzIsIGFrKSk7XG4gICAgICAgICAgICBpZiAoRWl0aGVyXzEuaXNMZWZ0KHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwdXNoQWxsKGVycm9ycywgcmVzdWx0LmxlZnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB2YWsgPSByZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKHZhayAhPT0gYWspIHtcbiAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgPT09IG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBfX2Fzc2lnbih7fSwgbyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYVtrXSA9IHZhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVycm9ycy5sZW5ndGggPiAwID8gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpIDogZXhwb3J0cy5zdWNjZXNzKGEpO1xuICAgIH0sIHVzZUlkZW50aXR5KHR5cGVzKVxuICAgICAgICA/IGV4cG9ydHMuaWRlbnRpdHlcbiAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgdmFyIHMgPSBfX2Fzc2lnbih7fSwgYSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBhayA9IGFba107XG4gICAgICAgICAgICAgICAgaWYgKGFrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc1trXSA9IHR5cGVzW2ldLmVuY29kZShhayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sIHByb3BzKTtcbn07XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgRGljdGlvbmFyeVR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKERpY3Rpb25hcnlUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIERpY3Rpb25hcnlUeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCBkb21haW4sIGNvZG9tYWluKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5kb21haW4gPSBkb21haW47XG4gICAgICAgIF90aGlzLmNvZG9tYWluID0gY29kb21haW47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnRGljdGlvbmFyeVR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBEaWN0aW9uYXJ5VHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5EaWN0aW9uYXJ5VHlwZSA9IERpY3Rpb25hcnlUeXBlO1xuZnVuY3Rpb24gZW51bWVyYWJsZVJlY29yZChrZXlzLCBkb21haW4sIGNvZG9tYWluLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gXCJ7IFtLIGluIFwiICsgZG9tYWluLm5hbWUgKyBcIl06IFwiICsgY29kb21haW4ubmFtZSArIFwiIH1cIjsgfVxuICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICByZXR1cm4gbmV3IERpY3Rpb25hcnlUeXBlKG5hbWUsIGZ1bmN0aW9uICh1KSB7IHJldHVybiBleHBvcnRzLlVua25vd25SZWNvcmQuaXModSkgJiYga2V5cy5ldmVyeShmdW5jdGlvbiAoaykgeyByZXR1cm4gY29kb21haW4uaXModVtrXSk7IH0pOyB9LCBmdW5jdGlvbiAodSwgYykge1xuICAgICAgICB2YXIgZSA9IGV4cG9ydHMuVW5rbm93blJlY29yZC52YWxpZGF0ZSh1LCBjKTtcbiAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG8gPSBlLnJpZ2h0O1xuICAgICAgICB2YXIgYSA9IHt9O1xuICAgICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICAgIHZhciBjaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgIHZhciBvayA9IG9ba107XG4gICAgICAgICAgICB2YXIgY29kb21haW5SZXN1bHQgPSBjb2RvbWFpbi52YWxpZGF0ZShvaywgZXhwb3J0cy5hcHBlbmRDb250ZXh0KGMsIGssIGNvZG9tYWluLCBvaykpO1xuICAgICAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChjb2RvbWFpblJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICBwdXNoQWxsKGVycm9ycywgY29kb21haW5SZXN1bHQubGVmdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdm9rID0gY29kb21haW5SZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgY2hhbmdlZCA9IGNoYW5nZWQgfHwgdm9rICE9PSBvaztcbiAgICAgICAgICAgICAgICBhW2tdID0gdm9rO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID4gMCA/IGV4cG9ydHMuZmFpbHVyZXMoZXJyb3JzKSA6IGV4cG9ydHMuc3VjY2VzcygoY2hhbmdlZCB8fCBPYmplY3Qua2V5cyhvKS5sZW5ndGggIT09IGxlbiA/IGEgOiBvKSk7XG4gICAgfSwgY29kb21haW4uZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5XG4gICAgICAgID8gZXhwb3J0cy5pZGVudGl0eVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBzW2tdID0gY29kb21haW4uZW5jb2RlKGFba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sIGRvbWFpbiwgY29kb21haW4pO1xufVxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZnVuY3Rpb24gZ2V0RG9tYWluS2V5cyhkb21haW4pIHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKGlzTGl0ZXJhbEMoZG9tYWluKSkge1xuICAgICAgICB2YXIgbGl0ZXJhbF8xID0gZG9tYWluLnZhbHVlO1xuICAgICAgICBpZiAoZXhwb3J0cy5zdHJpbmcuaXMobGl0ZXJhbF8xKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9hID0ge30sIF9hW2xpdGVyYWxfMV0gPSBudWxsLCBfYTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpc0tleW9mQyhkb21haW4pKSB7XG4gICAgICAgIHJldHVybiBkb21haW4ua2V5cztcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNVbmlvbkMoZG9tYWluKSkge1xuICAgICAgICB2YXIga2V5cyA9IGRvbWFpbi50eXBlcy5tYXAoZnVuY3Rpb24gKHR5cGUpIHsgcmV0dXJuIGdldERvbWFpbktleXModHlwZSk7IH0pO1xuICAgICAgICByZXR1cm4ga2V5cy5zb21lKHVuZGVmaW5lZFR5cGUuaXMpID8gdW5kZWZpbmVkIDogT2JqZWN0LmFzc2lnbi5hcHBseShPYmplY3QsIF9fc3ByZWFkQXJyYXlzKFt7fV0sIGtleXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbmV4cG9ydHMuZ2V0RG9tYWluS2V5cyA9IGdldERvbWFpbktleXM7XG5mdW5jdGlvbiBub25FbnVtZXJhYmxlUmVjb3JkKGRvbWFpbiwgY29kb21haW4sIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBcInsgW0sgaW4gXCIgKyBkb21haW4ubmFtZSArIFwiXTogXCIgKyBjb2RvbWFpbi5uYW1lICsgXCIgfVwiOyB9XG4gICAgcmV0dXJuIG5ldyBEaWN0aW9uYXJ5VHlwZShuYW1lLCBmdW5jdGlvbiAodSkge1xuICAgICAgICBpZiAoZXhwb3J0cy5Vbmtub3duUmVjb3JkLmlzKHUpKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModSkuZXZlcnkoZnVuY3Rpb24gKGspIHsgcmV0dXJuIGRvbWFpbi5pcyhrKSAmJiBjb2RvbWFpbi5pcyh1W2tdKTsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQW55Qyhjb2RvbWFpbikgJiYgQXJyYXkuaXNBcnJheSh1KTtcbiAgICB9LCBmdW5jdGlvbiAodSwgYykge1xuICAgICAgICBpZiAoZXhwb3J0cy5Vbmtub3duUmVjb3JkLmlzKHUpKSB7XG4gICAgICAgICAgICB2YXIgYSA9IHt9O1xuICAgICAgICAgICAgdmFyIGVycm9ycyA9IFtdO1xuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh1KTtcbiAgICAgICAgICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBvayA9IHVba107XG4gICAgICAgICAgICAgICAgdmFyIGRvbWFpblJlc3VsdCA9IGRvbWFpbi52YWxpZGF0ZShrLCBleHBvcnRzLmFwcGVuZENvbnRleHQoYywgaywgZG9tYWluLCBrKSk7XG4gICAgICAgICAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChkb21haW5SZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hBbGwoZXJyb3JzLCBkb21haW5SZXN1bHQubGVmdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmsgPSBkb21haW5SZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSBjaGFuZ2VkIHx8IHZrICE9PSBrO1xuICAgICAgICAgICAgICAgICAgICBrID0gdms7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2RvbWFpblJlc3VsdCA9IGNvZG9tYWluLnZhbGlkYXRlKG9rLCBleHBvcnRzLmFwcGVuZENvbnRleHQoYywgaywgY29kb21haW4sIG9rKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQoY29kb21haW5SZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoQWxsKGVycm9ycywgY29kb21haW5SZXN1bHQubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdm9rID0gY29kb21haW5SZXN1bHQucmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkID0gY2hhbmdlZCB8fCB2b2sgIT09IG9rO1xuICAgICAgICAgICAgICAgICAgICAgICAgYVtrXSA9IHZvaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID4gMCA/IGV4cG9ydHMuZmFpbHVyZXMoZXJyb3JzKSA6IGV4cG9ydHMuc3VjY2VzcygoY2hhbmdlZCA/IGEgOiB1KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQW55Qyhjb2RvbWFpbikgJiYgQXJyYXkuaXNBcnJheSh1KSkge1xuICAgICAgICAgICAgcmV0dXJuIGV4cG9ydHMuc3VjY2Vzcyh1KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXhwb3J0cy5mYWlsdXJlKHUsIGMpO1xuICAgIH0sIGRvbWFpbi5lbmNvZGUgPT09IGV4cG9ydHMuaWRlbnRpdHkgJiYgY29kb21haW4uZW5jb2RlID09PSBleHBvcnRzLmlkZW50aXR5XG4gICAgICAgID8gZXhwb3J0cy5pZGVudGl0eVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHt9O1xuICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhKTtcbiAgICAgICAgICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgayA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc1tTdHJpbmcoZG9tYWluLmVuY29kZShrKSldID0gY29kb21haW4uZW5jb2RlKGFba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0sIGRvbWFpbiwgY29kb21haW4pO1xufVxuLyoqXG4gKiBAY2F0ZWdvcnkgQ29tYmluYXRvcnNcbiAqIEBzaW5jZSAxLjcuMVxuICovXG5mdW5jdGlvbiByZWNvcmQoZG9tYWluLCBjb2RvbWFpbiwgbmFtZSkge1xuICAgIHZhciBrZXlzID0gZ2V0RG9tYWluS2V5cyhkb21haW4pO1xuICAgIHJldHVybiBrZXlzXG4gICAgICAgID8gZW51bWVyYWJsZVJlY29yZChPYmplY3Qua2V5cyhrZXlzKSwgZG9tYWluLCBjb2RvbWFpbiwgbmFtZSlcbiAgICAgICAgOiBub25FbnVtZXJhYmxlUmVjb3JkKGRvbWFpbiwgY29kb21haW4sIG5hbWUpO1xufVxuZXhwb3J0cy5yZWNvcmQgPSByZWNvcmQ7XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgVW5pb25UeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhVbmlvblR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVW5pb25UeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCB0eXBlcykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMudHlwZXMgPSB0eXBlcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdVbmlvblR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBVbmlvblR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuVW5pb25UeXBlID0gVW5pb25UeXBlO1xudmFyIGdldFVuaW9uTmFtZSA9IGZ1bmN0aW9uIChjb2RlY3MpIHtcbiAgICByZXR1cm4gJygnICsgY29kZWNzLm1hcChmdW5jdGlvbiAodHlwZSkgeyByZXR1cm4gdHlwZS5uYW1lOyB9KS5qb2luKCcgfCAnKSArICcpJztcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBDb21iaW5hdG9yc1xuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydHMudW5pb24gPSBmdW5jdGlvbiAoY29kZWNzLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gZ2V0VW5pb25OYW1lKGNvZGVjcyk7IH1cbiAgICB2YXIgaW5kZXggPSBnZXRJbmRleChjb2RlY3MpO1xuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkICYmIGNvZGVjcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciB0YWdfMSA9IGluZGV4WzBdLCBncm91cHNfMSA9IGluZGV4WzFdO1xuICAgICAgICB2YXIgbGVuXzEgPSBncm91cHNfMS5sZW5ndGg7XG4gICAgICAgIHZhciBmaW5kXzEgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuXzE7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChncm91cHNfMVtpXS5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuICAgICAgICByZXR1cm4gbmV3IFRhZ2dlZFVuaW9uVHlwZShuYW1lLCBmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgaWYgKGV4cG9ydHMuVW5rbm93blJlY29yZC5pcyh1KSkge1xuICAgICAgICAgICAgICAgIHZhciBpID0gZmluZF8xKHVbdGFnXzFdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaSAhPT0gdW5kZWZpbmVkID8gY29kZWNzW2ldLmlzKHUpIDogZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sIGZ1bmN0aW9uICh1LCBjKSB7XG4gICAgICAgICAgICB2YXIgZSA9IGV4cG9ydHMuVW5rbm93blJlY29yZC52YWxpZGF0ZSh1LCBjKTtcbiAgICAgICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQoZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByID0gZS5yaWdodDtcbiAgICAgICAgICAgIHZhciBpID0gZmluZF8xKHJbdGFnXzFdKTtcbiAgICAgICAgICAgIGlmIChpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwb3J0cy5mYWlsdXJlKHUsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvZGVjID0gY29kZWNzW2ldO1xuICAgICAgICAgICAgcmV0dXJuIGNvZGVjLnZhbGlkYXRlKHIsIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBTdHJpbmcoaSksIGNvZGVjLCByKSk7XG4gICAgICAgIH0sIHVzZUlkZW50aXR5KGNvZGVjcylcbiAgICAgICAgICAgID8gZXhwb3J0cy5pZGVudGl0eVxuICAgICAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHZhciBpID0gZmluZF8xKGFbdGFnXzFdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nY2FudGkvaW8tdHMvcHVsbC8zMDVcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gY29kZWMgZm91bmQgdG8gZW5jb2RlIHZhbHVlIGluIHVuaW9uIGNvZGVjIFwiICsgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29kZWNzW2ldLmVuY29kZShhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBjb2RlY3MsIHRhZ18xKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgVW5pb25UeXBlKG5hbWUsIGZ1bmN0aW9uICh1KSB7IHJldHVybiBjb2RlY3Muc29tZShmdW5jdGlvbiAodHlwZSkgeyByZXR1cm4gdHlwZS5pcyh1KTsgfSk7IH0sIGZ1bmN0aW9uICh1LCBjKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvZGVjcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb2RlYyA9IGNvZGVjc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gY29kZWMudmFsaWRhdGUodSwgZXhwb3J0cy5hcHBlbmRDb250ZXh0KGMsIFN0cmluZyhpKSwgY29kZWMsIHUpKTtcbiAgICAgICAgICAgICAgICBpZiAoRWl0aGVyXzEuaXNMZWZ0KHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaEFsbChlcnJvcnMsIHJlc3VsdC5sZWZ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBleHBvcnRzLnN1Y2Nlc3MocmVzdWx0LnJpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpO1xuICAgICAgICB9LCB1c2VJZGVudGl0eShjb2RlY3MpXG4gICAgICAgICAgICA/IGV4cG9ydHMuaWRlbnRpdHlcbiAgICAgICAgICAgIDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGNvZGVjc18xID0gY29kZWNzOyBfaSA8IGNvZGVjc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZWMgPSBjb2RlY3NfMVtfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2RlYy5pcyhhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvZGVjLmVuY29kZShhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ2NhbnRpL2lvLXRzL3B1bGwvMzA1XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gY29kZWMgZm91bmQgdG8gZW5jb2RlIHZhbHVlIGluIHVuaW9uIHR5cGUgXCIgKyBuYW1lKTtcbiAgICAgICAgICAgIH0sIGNvZGVjcyk7XG4gICAgfVxufTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbnZhciBJbnRlcnNlY3Rpb25UeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhJbnRlcnNlY3Rpb25UeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEludGVyc2VjdGlvblR5cGUobmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUsIHR5cGVzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50eXBlcyA9IHR5cGVzO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ0ludGVyc2VjdGlvblR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBJbnRlcnNlY3Rpb25UeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLkludGVyc2VjdGlvblR5cGUgPSBJbnRlcnNlY3Rpb25UeXBlO1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0cy5tZXJnZUFsbCA9IGZ1bmN0aW9uIChiYXNlLCB1cykge1xuICAgIHZhciBlcXVhbCA9IHRydWU7XG4gICAgdmFyIHByaW1pdGl2ZSA9IHRydWU7XG4gICAgdmFyIGJhc2VJc05vdEFEaWN0aW9uYXJ5ID0gIWV4cG9ydHMuVW5rbm93blJlY29yZC5pcyhiYXNlKTtcbiAgICBmb3IgKHZhciBfaSA9IDAsIHVzXzEgPSB1czsgX2kgPCB1c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgdSA9IHVzXzFbX2ldO1xuICAgICAgICBpZiAodSAhPT0gYmFzZSkge1xuICAgICAgICAgICAgZXF1YWwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwb3J0cy5Vbmtub3duUmVjb3JkLmlzKHUpKSB7XG4gICAgICAgICAgICBwcmltaXRpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZXF1YWwpIHtcbiAgICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKHByaW1pdGl2ZSkge1xuICAgICAgICByZXR1cm4gdXNbdXMubGVuZ3RoIC0gMV07XG4gICAgfVxuICAgIHZhciByID0ge307XG4gICAgZm9yICh2YXIgX2EgPSAwLCB1c18yID0gdXM7IF9hIDwgdXNfMi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgdmFyIHUgPSB1c18yW19hXTtcbiAgICAgICAgZm9yICh2YXIgayBpbiB1KSB7XG4gICAgICAgICAgICBpZiAoIXIuaGFzT3duUHJvcGVydHkoaykgfHwgYmFzZUlzTm90QURpY3Rpb25hcnkgfHwgdVtrXSAhPT0gYmFzZVtrXSkge1xuICAgICAgICAgICAgICAgIHJba10gPSB1W2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByO1xufTtcbmZ1bmN0aW9uIGludGVyc2VjdGlvbihjb2RlY3MsIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBcIihcIiArIGNvZGVjcy5tYXAoZnVuY3Rpb24gKHR5cGUpIHsgcmV0dXJuIHR5cGUubmFtZTsgfSkuam9pbignICYgJykgKyBcIilcIjsgfVxuICAgIHZhciBsZW4gPSBjb2RlY3MubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgSW50ZXJzZWN0aW9uVHlwZShuYW1lLCBmdW5jdGlvbiAodSkgeyByZXR1cm4gY29kZWNzLmV2ZXJ5KGZ1bmN0aW9uICh0eXBlKSB7IHJldHVybiB0eXBlLmlzKHUpOyB9KTsgfSwgY29kZWNzLmxlbmd0aCA9PT0gMFxuICAgICAgICA/IGV4cG9ydHMuc3VjY2Vzc1xuICAgICAgICA6IGZ1bmN0aW9uICh1LCBjKSB7XG4gICAgICAgICAgICB2YXIgdXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29kZWMgPSBjb2RlY3NbaV07XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNvZGVjLnZhbGlkYXRlKHUsIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBTdHJpbmcoaSksIGNvZGVjLCB1KSk7XG4gICAgICAgICAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChyZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hBbGwoZXJyb3JzLCByZXN1bHQubGVmdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1cy5wdXNoKHJlc3VsdC5yaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVycm9ycy5sZW5ndGggPiAwID8gZXhwb3J0cy5mYWlsdXJlcyhlcnJvcnMpIDogZXhwb3J0cy5zdWNjZXNzKGV4cG9ydHMubWVyZ2VBbGwodSwgdXMpKTtcbiAgICAgICAgfSwgY29kZWNzLmxlbmd0aCA9PT0gMFxuICAgICAgICA/IGV4cG9ydHMuaWRlbnRpdHlcbiAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGV4cG9ydHMubWVyZ2VBbGwoYSwgY29kZWNzLm1hcChmdW5jdGlvbiAoY29kZWMpIHsgcmV0dXJuIGNvZGVjLmVuY29kZShhKTsgfSkpO1xuICAgICAgICB9LCBjb2RlY3MpO1xufVxuZXhwb3J0cy5pbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3Rpb247XG4vKipcbiAqIEBzaW5jZSAxLjAuMFxuICovXG52YXIgVHVwbGVUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUdXBsZVR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVHVwbGVUeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCB0eXBlcykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMudHlwZXMgPSB0eXBlcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdUdXBsZVR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBUdXBsZVR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuVHVwbGVUeXBlID0gVHVwbGVUeXBlO1xuZnVuY3Rpb24gdHVwbGUoY29kZWNzLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gXCJbXCIgKyBjb2RlY3MubWFwKGZ1bmN0aW9uICh0eXBlKSB7IHJldHVybiB0eXBlLm5hbWU7IH0pLmpvaW4oJywgJykgKyBcIl1cIjsgfVxuICAgIHZhciBsZW4gPSBjb2RlY3MubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgVHVwbGVUeXBlKG5hbWUsIGZ1bmN0aW9uICh1KSB7IHJldHVybiBleHBvcnRzLlVua25vd25BcnJheS5pcyh1KSAmJiB1Lmxlbmd0aCA9PT0gbGVuICYmIGNvZGVjcy5ldmVyeShmdW5jdGlvbiAodHlwZSwgaSkgeyByZXR1cm4gdHlwZS5pcyh1W2ldKTsgfSk7IH0sIGZ1bmN0aW9uICh1LCBjKSB7XG4gICAgICAgIHZhciBlID0gZXhwb3J0cy5Vbmtub3duQXJyYXkudmFsaWRhdGUodSwgYyk7XG4gICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQoZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1cyA9IGUucmlnaHQ7XG4gICAgICAgIHZhciBhcyA9IHVzLmxlbmd0aCA+IGxlbiA/IHVzLnNsaWNlKDAsIGxlbikgOiB1czsgLy8gc3RyaXAgYWRkaXRpb25hbCBjb21wb25lbnRzXG4gICAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIGEgPSB1c1tpXTtcbiAgICAgICAgICAgIHZhciB0eXBlXzMgPSBjb2RlY3NbaV07XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdHlwZV8zLnZhbGlkYXRlKGEsIGV4cG9ydHMuYXBwZW5kQ29udGV4dChjLCBTdHJpbmcoaSksIHR5cGVfMywgYSkpO1xuICAgICAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChyZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgcHVzaEFsbChlcnJvcnMsIHJlc3VsdC5sZWZ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB2YSA9IHJlc3VsdC5yaWdodDtcbiAgICAgICAgICAgICAgICBpZiAodmEgIT09IGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFzID09PSB1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXMgPSB1cy5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFzW2ldID0gdmE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvcnMubGVuZ3RoID4gMCA/IGV4cG9ydHMuZmFpbHVyZXMoZXJyb3JzKSA6IGV4cG9ydHMuc3VjY2Vzcyhhcyk7XG4gICAgfSwgdXNlSWRlbnRpdHkoY29kZWNzKSA/IGV4cG9ydHMuaWRlbnRpdHkgOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gY29kZWNzLm1hcChmdW5jdGlvbiAodHlwZSwgaSkgeyByZXR1cm4gdHlwZS5lbmNvZGUoYVtpXSk7IH0pOyB9LCBjb2RlY3MpO1xufVxuZXhwb3J0cy50dXBsZSA9IHR1cGxlO1xuLyoqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xudmFyIFJlYWRvbmx5VHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVhZG9ubHlUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFJlYWRvbmx5VHlwZShuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSwgdHlwZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnUmVhZG9ubHlUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUmVhZG9ubHlUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLlJlYWRvbmx5VHlwZSA9IFJlYWRvbmx5VHlwZTtcbi8qKlxuICogQGNhdGVnb3J5IENvbWJpbmF0b3JzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5yZWFkb25seSA9IGZ1bmN0aW9uIChjb2RlYywgbmFtZSkge1xuICAgIGlmIChuYW1lID09PSB2b2lkIDApIHsgbmFtZSA9IFwiUmVhZG9ubHk8XCIgKyBjb2RlYy5uYW1lICsgXCI+XCI7IH1cbiAgICByZXR1cm4gbmV3IFJlYWRvbmx5VHlwZShuYW1lLCBjb2RlYy5pcywgY29kZWMudmFsaWRhdGUsIGNvZGVjLmVuY29kZSwgY29kZWMpO1xufTtcbi8qKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbnZhciBSZWFkb25seUFycmF5VHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVhZG9ubHlBcnJheVR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUmVhZG9ubHlBcnJheVR5cGUobmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUsIHR5cGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgaXMsIHZhbGlkYXRlLCBlbmNvZGUpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHNpbmNlIDEuMC4wXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy5fdGFnID0gJ1JlYWRvbmx5QXJyYXlUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUmVhZG9ubHlBcnJheVR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuUmVhZG9ubHlBcnJheVR5cGUgPSBSZWFkb25seUFycmF5VHlwZTtcbi8qKlxuICogQGNhdGVnb3J5IENvbWJpbmF0b3JzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5yZWFkb25seUFycmF5ID0gZnVuY3Rpb24gKGl0ZW0sIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBcIlJlYWRvbmx5QXJyYXk8XCIgKyBpdGVtLm5hbWUgKyBcIj5cIjsgfVxuICAgIHZhciBjb2RlYyA9IGV4cG9ydHMuYXJyYXkoaXRlbSk7XG4gICAgcmV0dXJuIG5ldyBSZWFkb25seUFycmF5VHlwZShuYW1lLCBjb2RlYy5pcywgY29kZWMudmFsaWRhdGUsIGNvZGVjLmVuY29kZSwgaXRlbSk7XG59O1xuLyoqXG4gKiBTdHJpcHMgYWRkaXRpb25hbCBwcm9wZXJ0aWVzXG4gKlxuICogQGNhdGVnb3J5IENvbWJpbmF0b3JzXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0cy5zdHJpY3QgPSBmdW5jdGlvbiAocHJvcHMsIG5hbWUpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5leGFjdChleHBvcnRzLnR5cGUocHJvcHMpLCBuYW1lKTtcbn07XG4vKipcbiAqIEBjYXRlZ29yeSBkZXByZWNhdGVkXG4gKiBAc2luY2UgMS4zLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbnZhciBUYWdnZWRVbmlvblR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFRhZ2dlZFVuaW9uVHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBUYWdnZWRVbmlvblR5cGUobmFtZSwgXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuICAgIGlzLCBcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRlcHJlY2F0aW9uXG4gICAgdmFsaWRhdGUsIFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbiAgICBlbmNvZGUsIGNvZGVjcywgdGFnKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCBjb2RlY3MpIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIC8vIDw9IHdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTM0NTVcbiAgICAgICAgIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnRhZyA9IHRhZztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gVGFnZ2VkVW5pb25UeXBlO1xufShVbmlvblR5cGUpKTtcbmV4cG9ydHMuVGFnZ2VkVW5pb25UeXBlID0gVGFnZ2VkVW5pb25UeXBlO1xuLyoqXG4gKiBVc2UgYHVuaW9uYCBpbnN0ZWFkXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjMuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0cy50YWdnZWRVbmlvbiA9IGZ1bmN0aW9uICh0YWcsIGNvZGVjcywgbmFtZVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gZ2V0VW5pb25OYW1lKGNvZGVjcyk7IH1cbiAgICB2YXIgVSA9IGV4cG9ydHMudW5pb24oY29kZWNzLCBuYW1lKTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRlcHJlY2F0aW9uXG4gICAgaWYgKFUgaW5zdGFuY2VvZiBUYWdnZWRVbmlvblR5cGUpIHtcbiAgICAgICAgcmV0dXJuIFU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJbaW8tdHNdIENhbm5vdCBidWlsZCBhIHRhZ2dlZCB1bmlvbiBmb3IgXCIgKyBuYW1lICsgXCIsIHJldHVybmluZyBhIGRlLW9wdGltaXplZCB1bmlvblwiKTtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuICAgICAgICByZXR1cm4gbmV3IFRhZ2dlZFVuaW9uVHlwZShuYW1lLCBVLmlzLCBVLnZhbGlkYXRlLCBVLmVuY29kZSwgY29kZWNzLCB0YWcpO1xuICAgIH1cbn07XG4vKipcbiAqIEBzaW5jZSAxLjEuMFxuICovXG52YXIgRXhhY3RUeXBlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhFeGFjdFR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRXhhY3RUeXBlKG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlLCB0eXBlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIGlzLCB2YWxpZGF0ZSwgZW5jb2RlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdFeGFjdFR5cGUnO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBFeGFjdFR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuRXhhY3RUeXBlID0gRXhhY3RUeXBlO1xudmFyIGdldFByb3BzID0gZnVuY3Rpb24gKGNvZGVjKSB7XG4gICAgc3dpdGNoIChjb2RlYy5fdGFnKSB7XG4gICAgICAgIGNhc2UgJ1JlZmluZW1lbnRUeXBlJzpcbiAgICAgICAgY2FzZSAnUmVhZG9ubHlUeXBlJzpcbiAgICAgICAgICAgIHJldHVybiBnZXRQcm9wcyhjb2RlYy50eXBlKTtcbiAgICAgICAgY2FzZSAnSW50ZXJmYWNlVHlwZSc6XG4gICAgICAgIGNhc2UgJ1N0cmljdFR5cGUnOlxuICAgICAgICBjYXNlICdQYXJ0aWFsVHlwZSc6XG4gICAgICAgICAgICByZXR1cm4gY29kZWMucHJvcHM7XG4gICAgICAgIGNhc2UgJ0ludGVyc2VjdGlvblR5cGUnOlxuICAgICAgICAgICAgcmV0dXJuIGNvZGVjLnR5cGVzLnJlZHVjZShmdW5jdGlvbiAocHJvcHMsIHR5cGUpIHsgcmV0dXJuIE9iamVjdC5hc3NpZ24ocHJvcHMsIGdldFByb3BzKHR5cGUpKTsgfSwge30pO1xuICAgIH1cbn07XG52YXIgc3RyaXBLZXlzID0gZnVuY3Rpb24gKG8sIHByb3BzKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKTtcbiAgICB2YXIgc2hvdWxkU3RyaXAgPSBmYWxzZTtcbiAgICB2YXIgciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3BzLCBrZXkpKSB7XG4gICAgICAgICAgICBzaG91bGRTdHJpcCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByW2tleV0gPSBvW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNob3VsZFN0cmlwID8gciA6IG87XG59O1xudmFyIGdldEV4YWN0VHlwZU5hbWUgPSBmdW5jdGlvbiAoY29kZWMpIHtcbiAgICBpZiAoaXNUeXBlQyhjb2RlYykpIHtcbiAgICAgICAgcmV0dXJuIFwie3wgXCIgKyBnZXROYW1lRnJvbVByb3BzKGNvZGVjLnByb3BzKSArIFwiIHx9XCI7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUGFydGlhbEMoY29kZWMpKSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJ0aWFsVHlwZU5hbWUoXCJ7fCBcIiArIGdldE5hbWVGcm9tUHJvcHMoY29kZWMucHJvcHMpICsgXCIgfH1cIik7XG4gICAgfVxuICAgIHJldHVybiBcIkV4YWN0PFwiICsgY29kZWMubmFtZSArIFwiPlwiO1xufTtcbi8qKlxuICogU3RyaXBzIGFkZGl0aW9uYWwgcHJvcGVydGllc1xuICogQHNpbmNlIDEuMS4wXG4gKi9cbmV4cG9ydHMuZXhhY3QgPSBmdW5jdGlvbiAoY29kZWMsIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7IG5hbWUgPSBnZXRFeGFjdFR5cGVOYW1lKGNvZGVjKTsgfVxuICAgIHZhciBwcm9wcyA9IGdldFByb3BzKGNvZGVjKTtcbiAgICByZXR1cm4gbmV3IEV4YWN0VHlwZShuYW1lLCBjb2RlYy5pcywgZnVuY3Rpb24gKHUsIGMpIHtcbiAgICAgICAgdmFyIGUgPSBleHBvcnRzLlVua25vd25SZWNvcmQudmFsaWRhdGUodSwgYyk7XG4gICAgICAgIGlmIChFaXRoZXJfMS5pc0xlZnQoZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjZSA9IGNvZGVjLnZhbGlkYXRlKHUsIGMpO1xuICAgICAgICBpZiAoRWl0aGVyXzEuaXNMZWZ0KGNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBFaXRoZXJfMS5yaWdodChzdHJpcEtleXMoY2UucmlnaHQsIHByb3BzKSk7XG4gICAgfSwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGNvZGVjLmVuY29kZShzdHJpcEtleXMoYSwgcHJvcHMpKTsgfSwgY29kZWMpO1xufTtcbi8qKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0cy5nZXRWYWxpZGF0aW9uRXJyb3IgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gPSBmdW5jdGlvbiAodmFsdWUsIGNvbnRleHQpIHsgcmV0dXJuICh7XG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGNvbnRleHQ6IGNvbnRleHRcbn0pOyB9O1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVwcmVjYXRlZFxuICogQHNpbmNlIDEuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnRzLmdldERlZmF1bHRDb250ZXh0IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovID0gZnVuY3Rpb24gKGRlY29kZXIpIHsgcmV0dXJuIFtcbiAgICB7IGtleTogJycsIHR5cGU6IGRlY29kZXIgfVxuXTsgfTtcbi8qKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xudmFyIE5ldmVyVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTmV2ZXJUeXBlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE5ldmVyVHlwZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ25ldmVyJywgZnVuY3Rpb24gKF8pIHsgcmV0dXJuIGZhbHNlOyB9LCBmdW5jdGlvbiAodSwgYykgeyByZXR1cm4gZXhwb3J0cy5mYWlsdXJlKHUsIGMpOyB9LCBcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZW5jb2RlIG5ldmVyJyk7XG4gICAgICAgIH0pIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnTmV2ZXJUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gTmV2ZXJUeXBlO1xufShUeXBlKSk7XG5leHBvcnRzLk5ldmVyVHlwZSA9IE5ldmVyVHlwZTtcbi8qKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuZXhwb3J0cy5uZXZlciA9IG5ldyBOZXZlclR5cGUoKTtcbi8qKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xudmFyIEFueVR5cGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFueVR5cGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQW55VHlwZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgJ2FueScsIGZ1bmN0aW9uIChfKSB7IHJldHVybiB0cnVlOyB9LCBleHBvcnRzLnN1Y2Nlc3MsIGV4cG9ydHMuaWRlbnRpdHkpIHx8IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2luY2UgMS4wLjBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLl90YWcgPSAnQW55VHlwZSc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEFueVR5cGU7XG59KFR5cGUpKTtcbmV4cG9ydHMuQW55VHlwZSA9IEFueVR5cGU7XG4vKipcbiAqIFVzZSBgdW5rbm93bmAgaW5zdGVhZFxuICpcbiAqIEBjYXRlZ29yeSBkZXByZWNhdGVkXG4gKiBAc2luY2UgMS4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbmV4cG9ydHMuYW55ID0gbmV3IEFueVR5cGUoKTtcbi8qKlxuICogVXNlIGBVbmtub3duUmVjb3JkYCBpbnN0ZWFkXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0cy5EaWN0aW9uYXJ5ID0gZXhwb3J0cy5Vbmtub3duUmVjb3JkO1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVwcmVjYXRlZFxuICogQHNpbmNlIDEuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG52YXIgT2JqZWN0VHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoT2JqZWN0VHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBPYmplY3RUeXBlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnb2JqZWN0JywgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHUgIT09IG51bGwgJiYgdHlwZW9mIHUgPT09ICdvYmplY3QnOyB9LCBmdW5jdGlvbiAodSwgYykgeyByZXR1cm4gKF90aGlzLmlzKHUpID8gZXhwb3J0cy5zdWNjZXNzKHUpIDogZXhwb3J0cy5mYWlsdXJlKHUsIGMpKTsgfSwgZXhwb3J0cy5pZGVudGl0eSkgfHwgdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdPYmplY3RUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0VHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5PYmplY3RUeXBlID0gT2JqZWN0VHlwZTtcbi8qKlxuICogVXNlIGBVbmtub3duUmVjb3JkYCBpbnN0ZWFkXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuZXhwb3J0cy5vYmplY3QgPSBuZXcgT2JqZWN0VHlwZSgpO1xuLyoqXG4gKiBVc2UgYGJyYW5kYCBpbnN0ZWFkXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZnVuY3Rpb24gcmVmaW5lbWVudChjb2RlYywgcHJlZGljYXRlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IHZvaWQgMCkgeyBuYW1lID0gXCIoXCIgKyBjb2RlYy5uYW1lICsgXCIgfCBcIiArIGV4cG9ydHMuZ2V0RnVuY3Rpb25OYW1lKHByZWRpY2F0ZSkgKyBcIilcIjsgfVxuICAgIHJldHVybiBuZXcgUmVmaW5lbWVudFR5cGUobmFtZSwgZnVuY3Rpb24gKHUpIHsgcmV0dXJuIGNvZGVjLmlzKHUpICYmIHByZWRpY2F0ZSh1KTsgfSwgZnVuY3Rpb24gKGksIGMpIHtcbiAgICAgICAgdmFyIGUgPSBjb2RlYy52YWxpZGF0ZShpLCBjKTtcbiAgICAgICAgaWYgKEVpdGhlcl8xLmlzTGVmdChlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGEgPSBlLnJpZ2h0O1xuICAgICAgICByZXR1cm4gcHJlZGljYXRlKGEpID8gZXhwb3J0cy5zdWNjZXNzKGEpIDogZXhwb3J0cy5mYWlsdXJlKGEsIGMpO1xuICAgIH0sIGNvZGVjLmVuY29kZSwgY29kZWMsIHByZWRpY2F0ZSk7XG59XG5leHBvcnRzLnJlZmluZW1lbnQgPSByZWZpbmVtZW50O1xuLyoqXG4gKiBVc2UgYEludGAgaW5zdGVhZFxuICpcbiAqIEBjYXRlZ29yeSBkZXByZWNhdGVkXG4gKiBAc2luY2UgMS4wLjBcbiAqIEBkZXByZWNhdGVkXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbmV4cG9ydHMuSW50ZWdlciA9IHJlZmluZW1lbnQoZXhwb3J0cy5udW1iZXIsIE51bWJlci5pc0ludGVnZXIsICdJbnRlZ2VyJyk7XG4vKipcbiAqIFVzZSBgcmVjb3JkYCBpbnN0ZWFkXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjAuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0cy5kaWN0aW9uYXJ5ID0gcmVjb3JkO1xuLyoqXG4gKiBAY2F0ZWdvcnkgZGVwcmVjYXRlZFxuICogQHNpbmNlIDEuMC4wXG4gKiBAZGVwcmVjYXRlZFxuICovXG52YXIgU3RyaWN0VHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3RyaWN0VHlwZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdHJpY3RUeXBlKG5hbWUsIFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbiAgICBpcywgXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuICAgIHZhbGlkYXRlLCBcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRlcHJlY2F0aW9uXG4gICAgZW5jb2RlLCBwcm9wcykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBpcywgdmFsaWRhdGUsIGVuY29kZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAgICAgKi9cbiAgICAgICAgX3RoaXMuX3RhZyA9ICdTdHJpY3RUeXBlJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gU3RyaWN0VHlwZTtcbn0oVHlwZSkpO1xuZXhwb3J0cy5TdHJpY3RUeXBlID0gU3RyaWN0VHlwZTtcbi8qKlxuICogRHJvcHMgdGhlIGNvZGVjIFwia2luZFwiXG4gKlxuICogQGNhdGVnb3J5IGRlcHJlY2F0ZWRcbiAqIEBzaW5jZSAxLjEuMFxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZnVuY3Rpb24gY2xlYW4oY29kZWMpIHtcbiAgICByZXR1cm4gY29kZWM7XG59XG5leHBvcnRzLmNsZWFuID0gY2xlYW47XG5mdW5jdGlvbiBhbGlhcyhjb2RlYykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBjb2RlYzsgfTtcbn1cbmV4cG9ydHMuYWxpYXMgPSBhbGlhcztcbnZhciBpc05vbkVtcHR5ID0gZnVuY3Rpb24gKGFzKSB7IHJldHVybiBhcy5sZW5ndGggPiAwOyB9O1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0cy5lbXB0eVRhZ3MgPSB7fTtcbmZ1bmN0aW9uIGludGVyc2VjdChhLCBiKSB7XG4gICAgdmFyIHIgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDAsIGFfMSA9IGE7IF9pIDwgYV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgdiA9IGFfMVtfaV07XG4gICAgICAgIGlmIChiLmluZGV4T2YodikgIT09IC0xKSB7XG4gICAgICAgICAgICByLnB1c2godik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHI7XG59XG5mdW5jdGlvbiBtZXJnZVRhZ3MoYSwgYikge1xuICAgIGlmIChhID09PSBleHBvcnRzLmVtcHR5VGFncykge1xuICAgICAgICByZXR1cm4gYjtcbiAgICB9XG4gICAgaWYgKGIgPT09IGV4cG9ydHMuZW1wdHlUYWdzKSB7XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICB2YXIgciA9IE9iamVjdC5hc3NpZ24oe30sIGEpO1xuICAgIGZvciAodmFyIGsgaW4gYikge1xuICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgdmFyIGludGVyc2VjdGlvbl8xID0gaW50ZXJzZWN0KGFba10sIGJba10pO1xuICAgICAgICAgICAgaWYgKGlzTm9uRW1wdHkoaW50ZXJzZWN0aW9uXzEpKSB7XG4gICAgICAgICAgICAgICAgcltrXSA9IGludGVyc2VjdGlvbl8xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgciA9IGV4cG9ydHMuZW1wdHlUYWdzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcltrXSA9IGJba107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHI7XG59XG5mdW5jdGlvbiBpbnRlcnNlY3RUYWdzKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gZXhwb3J0cy5lbXB0eVRhZ3MgfHwgYiA9PT0gZXhwb3J0cy5lbXB0eVRhZ3MpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuZW1wdHlUYWdzO1xuICAgIH1cbiAgICB2YXIgciA9IGV4cG9ydHMuZW1wdHlUYWdzO1xuICAgIGZvciAodmFyIGsgaW4gYSkge1xuICAgICAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgdmFyIGludGVyc2VjdGlvbl8yID0gaW50ZXJzZWN0KGFba10sIGJba10pO1xuICAgICAgICAgICAgaWYgKGludGVyc2VjdGlvbl8yLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChyID09PSBleHBvcnRzLmVtcHR5VGFncykge1xuICAgICAgICAgICAgICAgICAgICByID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJba10gPSBhW2tdLmNvbmNhdChiW2tdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcjtcbn1cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbmZ1bmN0aW9uIGlzQW55Qyhjb2RlYykge1xuICAgIHJldHVybiBjb2RlYy5fdGFnID09PSAnQW55VHlwZSc7XG59XG5mdW5jdGlvbiBpc0xpdGVyYWxDKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdMaXRlcmFsVHlwZSc7XG59XG5mdW5jdGlvbiBpc0tleW9mQyhjb2RlYykge1xuICAgIHJldHVybiBjb2RlYy5fdGFnID09PSAnS2V5b2ZUeXBlJztcbn1cbmZ1bmN0aW9uIGlzVHlwZUMoY29kZWMpIHtcbiAgICByZXR1cm4gY29kZWMuX3RhZyA9PT0gJ0ludGVyZmFjZVR5cGUnO1xufVxuZnVuY3Rpb24gaXNQYXJ0aWFsQyhjb2RlYykge1xuICAgIHJldHVybiBjb2RlYy5fdGFnID09PSAnUGFydGlhbFR5cGUnO1xufVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuZnVuY3Rpb24gaXNTdHJpY3RDKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdTdHJpY3RUeXBlJztcbn1cbmZ1bmN0aW9uIGlzRXhhY3RDKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdFeGFjdFR5cGUnO1xufVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxuZnVuY3Rpb24gaXNSZWZpbmVtZW50Qyhjb2RlYykge1xuICAgIHJldHVybiBjb2RlYy5fdGFnID09PSAnUmVmaW5lbWVudFR5cGUnO1xufVxuZnVuY3Rpb24gaXNJbnRlcnNlY3Rpb25DKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdJbnRlcnNlY3Rpb25UeXBlJztcbn1cbmZ1bmN0aW9uIGlzVW5pb25DKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdVbmlvblR5cGUnO1xufVxuZnVuY3Rpb24gaXNSZWN1cnNpdmVDKGNvZGVjKSB7XG4gICAgcmV0dXJuIGNvZGVjLl90YWcgPT09ICdSZWN1cnNpdmVUeXBlJztcbn1cbnZhciBsYXp5Q29kZWNzID0gW107XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiBnZXRUYWdzKGNvZGVjKSB7XG4gICAgaWYgKGxhenlDb2RlY3MuaW5kZXhPZihjb2RlYykgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLmVtcHR5VGFncztcbiAgICB9XG4gICAgaWYgKGlzVHlwZUMoY29kZWMpIHx8IGlzU3RyaWN0Qyhjb2RlYykpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gZXhwb3J0cy5lbXB0eVRhZ3M7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZm9yaW5cbiAgICAgICAgZm9yICh2YXIgayBpbiBjb2RlYy5wcm9wcykge1xuICAgICAgICAgICAgdmFyIHByb3AgPSBjb2RlYy5wcm9wc1trXTtcbiAgICAgICAgICAgIGlmIChpc0xpdGVyYWxDKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSBleHBvcnRzLmVtcHR5VGFncykge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmRleFtrXSA9IFtwcm9wLnZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzRXhhY3RDKGNvZGVjKSB8fCBpc1JlZmluZW1lbnRDKGNvZGVjKSkge1xuICAgICAgICByZXR1cm4gZ2V0VGFncyhjb2RlYy50eXBlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNJbnRlcnNlY3Rpb25DKGNvZGVjKSkge1xuICAgICAgICByZXR1cm4gY29kZWMudHlwZXMucmVkdWNlKGZ1bmN0aW9uICh0YWdzLCBjb2RlYykgeyByZXR1cm4gbWVyZ2VUYWdzKHRhZ3MsIGdldFRhZ3MoY29kZWMpKTsgfSwgZXhwb3J0cy5lbXB0eVRhZ3MpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1VuaW9uQyhjb2RlYykpIHtcbiAgICAgICAgcmV0dXJuIGNvZGVjLnR5cGVzLnNsaWNlKDEpLnJlZHVjZShmdW5jdGlvbiAodGFncywgY29kZWMpIHsgcmV0dXJuIGludGVyc2VjdFRhZ3ModGFncywgZ2V0VGFncyhjb2RlYykpOyB9LCBnZXRUYWdzKGNvZGVjLnR5cGVzWzBdKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUmVjdXJzaXZlQyhjb2RlYykpIHtcbiAgICAgICAgbGF6eUNvZGVjcy5wdXNoKGNvZGVjKTtcbiAgICAgICAgdmFyIHRhZ3MgPSBnZXRUYWdzKGNvZGVjLnR5cGUpO1xuICAgICAgICBsYXp5Q29kZWNzLnBvcCgpO1xuICAgICAgICByZXR1cm4gdGFncztcbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuZW1wdHlUYWdzO1xufVxuZXhwb3J0cy5nZXRUYWdzID0gZ2V0VGFncztcbi8qKlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIGdldEluZGV4KGNvZGVjcykge1xuICAgIHZhciB0YWdzID0gZ2V0VGFncyhjb2RlY3NbMF0pO1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGFncyk7XG4gICAgdmFyIGxlbiA9IGNvZGVjcy5sZW5ndGg7XG4gICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoaykge1xuICAgICAgICB2YXIgYWxsID0gdGFnc1trXS5zbGljZSgpO1xuICAgICAgICB2YXIgaW5kZXggPSBbdGFnc1trXV07XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb2RlYyA9IGNvZGVjc1tpXTtcbiAgICAgICAgICAgIHZhciBjdGFncyA9IGdldFRhZ3MoY29kZWMpO1xuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IGN0YWdzW2tdO1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBzdHJpY3QtdHlwZS1wcmVkaWNhdGVzXG4gICAgICAgICAgICBpZiAodmFsdWVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZS1rZXlzXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzLnNvbWUoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIGFsbC5pbmRleE9mKHYpICE9PSAtMTsgfSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWUta2V5c1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsLnB1c2guYXBwbHkoYWxsLCB2YWx1ZXMpO1xuICAgICAgICAgICAgICAgICAgICBpbmRleC5wdXNoKHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHZhbHVlOiBbaywgaW5kZXhdIH07XG4gICAgfTtcbiAgICBrZXlzOiBmb3IgKHZhciBfaSA9IDAsIGtleXNfMSA9IGtleXM7IF9pIDwga2V5c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgayA9IGtleXNfMVtfaV07XG4gICAgICAgIHZhciBzdGF0ZV8xID0gX2xvb3BfMShrKTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdGF0ZV8xID09PSBcIm9iamVjdFwiKVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlXzEudmFsdWU7XG4gICAgICAgIHN3aXRjaCAoc3RhdGVfMSkge1xuICAgICAgICAgICAgY2FzZSBcImNvbnRpbnVlLWtleXNcIjogY29udGludWUga2V5cztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuZXhwb3J0cy5nZXRJbmRleCA9IGdldEluZGV4O1xuIiwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgImltcG9ydCAqIGFzIHRvbWwgZnJvbSAnQGlhcm5hL3RvbWwnXG5pbXBvcnQgeyBpc0xlZnQgfSBmcm9tICdmcC10cy9saWIvRWl0aGVyJ1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgeyBwcm9taXNlcyBhcyBmc3ggfSBmcm9tICdmcydcbmltcG9ydCAqIGFzIG1hdGNoIGZyb20gJ21pY3JvbWF0Y2gnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBDb25maWcsIFJ1bGUgfSBmcm9tICcuL2NvbmZpZydcbmltcG9ydCB7IGJ1aWxkU2NvcGUsIHJlbmRlciB9IGZyb20gJy4vdGVtcGxhdGUnXG5cbmV4cG9ydCB0eXBlIHsgQ29uZmlnLCBSdWxlIH1cblxuaW50ZXJmYWNlIENvbmZpZ0luc3RhbmNlIHtcbiAgcGF0aDogc3RyaW5nXG4gIGNvbmZpZzogQ29uZmlnXG59XG5cbi8qXG4gKiBCYXNpYyBwcmVtaXNlIG9mIHdoYXQgSSB3YW50IHYxIHRvIGJlXG4gKlxuICogTG9hZCBhIGNvbmZpZyBmaWxlLCBwcm9iYWJseSB0b21sIC0gc3BlY2lhbCBmYWxsYmFja3MgY2FuIGNvbWUgbGF0ZXIsXG4gKiBhc3N1bWUgc2FtZSBkaXJlY3RvcnkgZm9yIG5vdy4gaGFuZCBhdCBsZWFzdCB3aGF0IHByb2plY3Rpb25zIGNhbiBkb1xuICpcbiAqIEFkZCBiYXNpYyBDTEkgaW50ZXJmYWNlLCB3aWxsIGhhdmUgdG8gZmluZCBhIGxpYnJhcnkgZm9yIHRoaXMsIGkndmUgdXNlZFxuICogeWFyZ3MgYmVmb3JlIGFuZCBsaWtlZCBpdC5cbiAqXG4gKiBGb3IgYW55IGdpdmVuIGZpbGUgcGF0aFxuICogLSBmaW5kIGl0cyBtYXRjaCBpbiB0aGUgY29uZmlnXG4gKiAtIHJldHVybiBpdHMgYWx0ZXJuYXRlIChsYXRlciBhbnkgb3RoZXIgYXJiaXRyYXJ5IHJlbGF0aW9uc2hpcClcbiAqIC0gcmV0dXJuIGEgdGVtcGxhdGUgZm9yIGl0XG4gKiAtIHJldHVybiBzb21lIG90aGVyIEtWIGZvciBpdFxuICpcbiAqIExhdGVyIEkgY2FuIGdlbmVyYXRlIGEgZ3JhcGggYmFzZWQgb24gdGhlIHJlbGF0aW9uc2hpcHMsIGJ1dCBmb3Igbm93XG4gKiBmb2N1cyBvbiBkb2luZyB3aGF0IHByb2plY3Rpb25pc3QgY2FuIGRvLlxuICpcbiAqXG4gKiBGb3IgdGVtcGxhdGluZywgaWYgcG9zc2libGUgcmV1c2UgdGhlIHNhbWUgKiB7Zm9vOmJhcn0gc3ludGF4LCBvdGhlcndpc2VcbiAqIGZpbmQgc29tZXRoaW5nIHRoYXQgYWxyZWFkeSBleGlzdHMuIEltcGxlbWVudCBiYXNpYyB0cmFuc2Zvcm1zLlxuICpcbiAqL1xuXG4vKipcbiAqIFNlYXJjaCB1cHdhcmRzIHVudGlsIHRoZSBjb25maWcgZmlsZSBpcyBmb3VuZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmRDb25maWcoc3RhcnRpbmdEaXI6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGxldCBkaXIgPSBzdGFydGluZ0RpclxuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgbGV0IGZpbGVuYW1lID0gcGF0aC5qb2luKGRpciwgJy5wcm9qZXQudG9tbCcpXG5cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlbmFtZSkpXG4gICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKGZpbGVuYW1lKVxuXG4gICAgaWYgKGRpciA9PT0gJy8nKVxuICAgICAgdGhyb3cgXCJjb3VsZG4ndCBmaW5kIGNvbmZpZyBmaWxlXCJcblxuICAgIGRpciA9IHBhdGguZGlybmFtZShkaXIpXG4gIH1cbn1cblxuLyoqXG4gKiBMb2FkIHRoZSBjb25maWcgZnJvbSB0aGUgdGhlIHByb3ZpZGVkIHBhdGguXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkQ29uZmlnKGxvY2FscGF0aDogc3RyaW5nKSB7XG4gIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmc3gucmVhZEZpbGUobG9jYWxwYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pXG4gIGNvbnN0IGpzb24gPSB0b21sLnBhcnNlKGNvbnRlbnQpXG4gIGNvbnN0IGNvbmZpZyA9IENvbmZpZy5kZWNvZGUoanNvbilcblxuICBpZiAoaXNMZWZ0KGNvbmZpZykpXG4gICAgdGhyb3cgY29uZmlnLmxlZnRcbiAgZWxzZVxuICAgIHJldHVybiB7IHBhdGg6IGxvY2FscGF0aCwgY29uZmlnOiBjb25maWcucmlnaHQgfVxufVxuXG4vKipcbiAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGZpbmQsIGFuZCBsb2FkIHRoZSBjb25maWd1cmF0aW9uLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29uZmlnKHN0YXJ0aW5nRGlyOiBzdHJpbmcpIHtcbiAgY29uc3QgY29uZmlnUGF0aCA9IGF3YWl0IGZpbmRDb25maWcoc3RhcnRpbmdEaXIpXG4gIHJldHVybiBsb2FkQ29uZmlnKGNvbmZpZ1BhdGgpXG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgYSBmaWxlIHRoYXQgbWF0Y2hlZCB0aGUgY29uZmlnJ3MgcGF0dGVybi4gSW5jbHVkZXMgdGhlXG4gKiBjYXRlZ29yeSwgd2hpY2ggaXMgd2hhdCBraW5kIG9mIFwidHlwZVwiIG9mIGZpbGUgdGhpcyBpcywgdGhlIGNvbmZpZyBmb3JcbiAqIHRoaXMgY2F0ZWdvcnksIGFuZCB0aGUgY2FwdHVyZXMgZnJvbSB0aGUgcGF0dGVybiBmb3IgcmVwbGFjZW1lbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZU1hdGNoIHtcbiAgY2FwdHVyZXM6IFJlZ0V4cE1hdGNoQXJyYXlcbiAgY2F0ZWdvcnk6IHN0cmluZ1xuICBydWxlOiBSdWxlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTWF0Y2goY29uZmlnOiBDb25maWdJbnN0YW5jZSwgZmlsZXBhdGg6IHN0cmluZyk6IFJ1bGVNYXRjaCB8IG51bGwge1xuICBjb25zdCB0byA9IHBhdGguZGlybmFtZShjb25maWcucGF0aClcbiAgY29uc3QgbG9jYWxwYXRoID0gcGF0aC5yZWxhdGl2ZSh0bywgZmlsZXBhdGgpXG5cbiAgY29uc3QgcnVsZXMgPSBjb25maWcuY29uZmlnLnJ1bGVzXG5cbiAgZm9yIChjb25zdCBydWxlIG9mIHJ1bGVzKSB7XG4gICAgY29uc3QgY2F0ZWdvcnkgPSBydWxlLm5hbWVcbiAgICBjb25zdCBwYXR0ZXJuID0gcnVsZS5wYXR0ZXJuXG4gICAgY29uc3QgY2FwdHVyZXMgPSBtYXRjaC5jYXB0dXJlKHBhdHRlcm4sIGxvY2FscGF0aClcblxuICAgIGlmIChjYXB0dXJlcylcbiAgICAgIHJldHVybiB7IGNhcHR1cmVzLCBjYXRlZ29yeSwgcnVsZSB9XG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG5hbWUgb2YgdGhlIGZpbGUgaW4gcmVsYXRpb24gcmVsYXRpb25zaGlwIGBhc3NvY05hbWVgIHdpdGggZmlsZVxuICogYXQgYHBhdGhgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzb2MoY29uZmlnOiBDb25maWdJbnN0YW5jZSwgZmlsZTogc3RyaW5nLCBsaW5rTmFtZT86IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IG1hdGNoID0gZmluZE1hdGNoKGNvbmZpZywgZmlsZSlcblxuICBpZiAoIW1hdGNoKSB0aHJvdyBgTm8gbWF0Y2hpbmcgcnVsZSBmb3IgJHtmaWxlfWBcblxuICBjb25zdCBydWxlID0gbWF0Y2gucnVsZVxuXG4gIGxldCBsaW5rID0gZmluZExpbmsocnVsZSwgbGlua05hbWUpXG5cbiAgY29uc3QgcGF0dGVybiA9IGxpbmsucGF0dGVyblxuXG4gIGNvbnN0IGJpbmRpbmcgPSB7IGZpbGUgfVxuICBjb25zdCBzY29wZSA9IGJ1aWxkU2NvcGUobWF0Y2gsIGJpbmRpbmcpXG4gIGNvbnN0IGxvY2FscGF0aCA9IHJlbmRlcihwYXR0ZXJuLCBzY29wZSlcbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGNvbmZpZy5wYXRoKVxuICByZXR1cm4gcGF0aC5ub3JtYWxpemUocGF0aC5qb2luKGRpciwgbG9jYWxwYXRoKSlcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxpbmsgdGhhdCBtYXRjaGVzIHRoZSBuYW1lLCBvciByZXR1cm4gdGhlIGZpcnN0IGxpbmsgaWYgbm90XG4gKiBzcGVjaWZpZWRcbiAqL1xuZnVuY3Rpb24gZmluZExpbmsocnVsZTogUnVsZSwgbGlua05hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuICBjb25zdCBydWxlTmFtZSA9IHJ1bGUubmFtZVxuICBjb25zdCBsaW5rcyA9IHJ1bGUubGlua3MgPz8gW11cblxuICBpZiAoIWxpbmtOYW1lKSB7XG4gICAgY29uc3QgbGluayA9IGxpbmtzWzBdXG5cbiAgICBpZiAoIWxpbmspIHRocm93IGBObyBsaW5rcyBkZWZpbmVkIGZvciAke3J1bGVOYW1lfWBcblxuICAgIHJldHVybiBsaW5rXG4gIH1cblxuICBjb25zdCBsaW5rID0gbGlua3MuZmluZCgoeyBuYW1lIH0pID0+IG5hbWUgPT09IGxpbmtOYW1lKVxuXG4gIGlmICghbGluaykgdGhyb3cgYE5vIGxpbmsgbmFtZWQgJHtsaW5rTmFtZX0gZGVmaW5lZCBmb3IgJHtydWxlTmFtZX1gXG5cbiAgcmV0dXJuIGxpbmtcbn1cblxuLyoqXG4gKiBSZXR1cm4gbGlzdGluZyBhbGwgZmlsZXMgdGhhdCBtYXRjaCBkZWZpbmVkIGZpbGUgZ3JvdXBzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdChfY29uZmlnOiBDb25maWcpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXVxufVxuXG4vKipcbiAqIFJldHVybiBhIGdlbmVyYXRlZCB2ZXJzaW9uIG9mIGEgZmlsZSBhdCB0aGUgcGF0aCBgcGF0aGAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZShjb25maWc6IENvbmZpZ0luc3RhbmNlLCBmaWxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBtYXRjaCA9IGZpbmRNYXRjaChjb25maWcsIGZpbGUpXG5cbiAgaWYgKCFtYXRjaClcbiAgICB0aHJvdyBgbm8gbWF0Y2ggZm9yOiAke2ZpbGV9YFxuXG4gIGNvbnN0IHRlbXBsYXRlID0gbWF0Y2gucnVsZS50ZW1wbGF0ZVxuXG4gIGlmICghdGVtcGxhdGUpXG4gICAgcmV0dXJuICcnXG5cbiAgY29uc3QgYmluZGluZyA9IHsgZmlsZSB9XG4gIGNvbnN0IHNjb3BlID0gYnVpbGRTY29wZShtYXRjaCwgYmluZGluZylcbiAgcmV0dXJuIHJlbmRlcih0ZW1wbGF0ZSwgc2NvcGUpXG59XG4iLCAiLyoqXG4gKiBKU09OIGRlY29kZXIgZm9yIC5wcm9qZXQudG9tbCBmaWxlc1xuICovXG5cbmltcG9ydCAqIGFzIHQgZnJvbSAnaW8tdHMnXG5cbmNvbnN0IExpbmsgPSB0LnR5cGUoe1xuICBuYW1lOiB0LnN0cmluZyxcbiAgcGF0dGVybjogdC5zdHJpbmcsXG59KVxuXG5jb25zdCBSdWxlID0gdC5pbnRlcnNlY3Rpb24oW1xuICB0LnR5cGUoe1xuICAgIG5hbWU6IHQuc3RyaW5nLFxuICAgIHBhdHRlcm46IHQuc3RyaW5nLFxuICB9KSxcbiAgdC5wYXJ0aWFsKHtcbiAgICB0ZW1wbGF0ZTogdC5zdHJpbmcsXG4gICAgbGlua3M6IHQuYXJyYXkoTGluayksXG4gIH0pLFxuXSlcblxuZXhwb3J0IGNvbnN0IENvbmZpZyA9IHQudHlwZSh7XG4gIHJ1bGVzOiB0LmFycmF5KFJ1bGUpLFxufSlcblxuZXhwb3J0IGludGVyZmFjZSBMaW5rIGV4dGVuZHMgdC5UeXBlT2Y8dHlwZW9mIExpbms+IHt9XG5leHBvcnQgaW50ZXJmYWNlIFJ1bGUgZXh0ZW5kcyB0LlR5cGVPZjx0eXBlb2YgUnVsZT4ge31cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIGV4dGVuZHMgdC5UeXBlT2Y8dHlwZW9mIENvbmZpZz4ge31cbiIsICJpbXBvcnQgeyBJQ29tcGlsZU9wdGlvbnMsIFNjb3BlIH0gZnJvbSAnbWljcm9tdXN0YWNoZSdcbmltcG9ydCAqIGFzIG11c3RhY2hlIGZyb20gJ21pY3JvbXVzdGFjaGUnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBSdWxlTWF0Y2ggfSBmcm9tICcuL3Byb2pldCdcbmltcG9ydCB7IGlzVHJhbnNmb3JtZXIsIHRyYW5zZm9ybXMgfSBmcm9tICcuL3RyYW5zZm9ybXMnXG5cbmNvbnN0IGJyID0gJ1xcbidcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2NvcGUobWF0Y2g6IFJ1bGVNYXRjaCwgYmluZGluZ3M6IHt9KSB7XG4gIGNvbnN0IGVudHJpZXMgPSBtYXRjaC5jYXB0dXJlcy5tYXAoKHZhbHVlLCBpZHgpID0+IFtgJCR7aWR4fWAsIHZhbHVlXSlcbiAgY29uc3Qgc3RhciA9IHBhdGguam9pbiguLi5tYXRjaC5jYXB0dXJlcylcblxuICBjb25zdCBjYXB0dXJlcyA9IE9iamVjdC5mcm9tRW50cmllcyhlbnRyaWVzKVxuICBjb25zdCBzY29wZSA9IE9iamVjdC5hc3NpZ24oYmluZGluZ3MsIGNhcHR1cmVzKVxuICBzY29wZVsnJConXSA9IHN0YXJcbiAgcmV0dXJuIHNjb3BlXG59XG5cbmZ1bmN0aW9uIGdldChzY29wZTogU2NvcGUsIHBhdGhFeHByOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICByZXR1cm4gbXVzdGFjaGUuZ2V0KHNjb3BlLCBwYXRoRXhwciwgeyBwcm9wc0V4aXN0OiB0cnVlIH0pXG59XG5cbmNsYXNzIFRyYW5zZm9ybU5hbWVFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IodHJhbnNmb3JtOiBzdHJpbmcpIHtcbiAgICBzdXBlcihcbiAgICAgIGBUcmFuc2Zvcm1OYW1lRXJyb3I6IFwiJHt0cmFuc2Zvcm19XCIgaXMgbm90IGEga25vd24gdHJhbnNmb3JtLmBcbiAgICAgICAgKyBiclxuICAgICAgICArICdBdmFpbGFibGUgdHJhbnNmb3JtczogJ1xuICAgICAgICArIE9iamVjdC5rZXlzKHRyYW5zZm9ybXMpLmpvaW4oJywgJyksXG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHBpcGVSZWR1Y2VyKGFjYzogc3RyaW5nLCB0cmFuc2Zvcm1OYW1lOiBzdHJpbmcpIHtcbiAgdHJhbnNmb3JtTmFtZSA9IHRyYW5zZm9ybU5hbWUudHJpbSgpXG5cbiAgaWYgKCFpc1RyYW5zZm9ybWVyKHRyYW5zZm9ybU5hbWUpKSB0aHJvdyBuZXcgVHJhbnNmb3JtTmFtZUVycm9yKHRyYW5zZm9ybU5hbWUpXG5cbiAgcmV0dXJuIHRyYW5zZm9ybXNbdHJhbnNmb3JtTmFtZV0oYWNjKVxufVxuXG4vKipcbiAqIENhbGxlZCBieSBtdXN0YWNoZSB3aXRoIHRoZSBjb250ZW50cyBvZiBhIHRhZywgdXNlZCB0byBwcm92aWRlIG91ciBvd25cbiAqIGdyYW1tYXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleGVjKGV4cHI6IHN0cmluZywgc2NvcGU6IFNjb3BlID0ge30pIHtcbiAgY29uc3QgW2xocywgLi4ucGlwZXNdID0gZXhwci5zcGxpdCgnfCcpXG5cbiAgaWYgKCFsaHMpXG4gICAgdGhyb3cgbmV3IEVycm9yKGBleHBlY3RlZCBsZWZ0IGhhbmQgc2lkZSB0byByZWZlcmVuY2Ugb25lIG9yIG1vcmUgdmFyaWFibGVzLCBsaWtlIFwieyQwfVwiYClcblxuICBjb25zdCB2YWx1ZXMgPSBsaHMudHJpbSgpLnNwbGl0KC9cXHMrLykubWFwKHRva2VuID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldChzY29wZSwgdG9rZW4pXG5cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgYGV4cGVjdGVkIFwiJHt0b2tlbn1cIiB0byBiZSBhIHN0cmluZyxcbiAgICAgICAgZ290OiAke0pTT04uc3RyaW5naWZ5KHZhbHVlLCBudWxsLCAyKX1gLFxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9KVxuXG4gIGNvbnN0IHZhbHVlID0gcGF0aC5qb2luKC4uLnZhbHVlcylcblxuICByZXR1cm4gcGlwZXMucmVkdWNlKHBpcGVSZWR1Y2VyLCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBSZW5kZXIgYSBtdXN0YWNoZSB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcih0ZW1wbGF0ZTogc3RyaW5nLCBzY29wZToge30pOiBzdHJpbmcge1xuICBjb25zdCBvcHRzOiBJQ29tcGlsZU9wdGlvbnMgPSB7IHRhZ3M6IFsneycsICd9J10sIHByb3BzRXhpc3Q6IHRydWUsIHZhbGlkYXRlVmFyTmFtZXM6IHRydWUgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKG11c3RhY2hlLnJlbmRlckZuKHRlbXBsYXRlLCBleGVjLCBzY29wZSwgb3B0cykpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFJlZmVyZW5jZUVycm9yKSBmb3JtYXRFcnJvcihlLCBzY29wZSlcbiAgICB0aHJvdyBlXG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IoZTogUmVmZXJlbmNlRXJyb3IsIHNjb3BlOiB7fSkge1xuICBjb25zdCBtZXNzYWdlID0gZS5tZXNzYWdlXG4gIGNvbnN0IHN0YWNrID0gZS5zdGFja1xuXG4gIGNvbnN0IHJlcmFpc2VkID0gbmV3IFJlZmVyZW5jZUVycm9yKFxuICAgIFtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBicixcbiAgICAgIGBBdmFpbGFibGUgYXNzaWduczogJHtPYmplY3Qua2V5cyhzY29wZSkuam9pbignLCAnKX1gLFxuICAgICAgYnIsXG4gICAgXS5qb2luKCcnKSxcbiAgKVxuXG4gIHJlcmFpc2VkLnN0YWNrID0gc3RhY2s/LnNwbGl0KCdcXG4nKS5zbGljZSgyKS5qb2luKCdcXG4nKVxuXG4gIHRocm93IHJlcmFpc2VkXG59XG4iLCAiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuXG5jb25zdCBzZXBhcmF0b3JQYXR0ZXJuID0gbmV3IFJlZ0V4cChwYXRoLnNlcCwgJ2cnKVxuXG5jb25zdCByZXBsYWNlRm9yd2FyZFNsYXNoID0gKHJlcGxhY2VtZW50OiBzdHJpbmcpID0+IChzb3VyY2U6IHN0cmluZykgPT4gc291cmNlLnJlcGxhY2Uoc2VwYXJhdG9yUGF0dGVybiwgcmVwbGFjZW1lbnQpXG5cbmNvbnN0IHJlcGxhY2VBbGwgPSAocGF0dGVybjogc3RyaW5nLCByZXBsYWNlbWVudDogc3RyaW5nKSA9PlxuICAoc291cmNlOiBzdHJpbmcpID0+IHNvdXJjZS5yZXBsYWNlKG5ldyBSZWdFeHAocGF0dGVybiwgJ2cnKSwgcmVwbGFjZW1lbnQpXG5cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1zID0ge1xuICB1cHBlcmNhc2U6IChzOiBzdHJpbmcpID0+IHMudG9VcHBlckNhc2UoKSxcblxuICBsb3dlcmNhc2U6IChzOiBzdHJpbmcpID0+IHMudG9Mb3dlckNhc2UoKSxcblxuICBkb3Q6IHJlcGxhY2VGb3J3YXJkU2xhc2goJy4nKSxcblxuICB1bmRlcnNjb3JlOiByZXBsYWNlRm9yd2FyZFNsYXNoKCdfJyksXG5cbiAgYmFja3NsYXNoOiByZXBsYWNlRm9yd2FyZFNsYXNoKCdcXFxcJyksXG5cbiAgY29sb25zOiByZXBsYWNlRm9yd2FyZFNsYXNoKCc6OicpLFxuXG4gIGh5cGhlbmF0ZTogcmVwbGFjZUFsbCgnXycsICctJyksXG5cbiAgYmxhbms6IHJlcGxhY2VBbGwoJ1tfLV0nLCAnICcpLFxuXG4gIGNhbWVsY2FzZTogKHM6IHN0cmluZykgPT4gcy5yZXBsYWNlKC9bXy1dKC4pL2csIChfLCBfMSkgPT4gXzEudG9VcHBlckNhc2UoKSksXG5cbiAgY2FwaXRhbGl6ZTogKHM6IHN0cmluZykgPT4gcy5yZXBsYWNlKC8oPzw9XnxcXC8pKC4pL2csIChfLCBfMSkgPT4gXzEudG9VcHBlckNhc2UoKSksXG5cbiAgc25ha2VjYXNlOiAoczogc3RyaW5nKSA9PlxuICAgIHMucmVwbGFjZSgvKFtBLVpdKykoW0EtWl1bYS16XSkvZywgKF8sIF8xLCBfMikgPT4gYCR7XzF9XyR7XzJ9YCkucmVwbGFjZShcbiAgICAgIC8oW2EtejAtOV0pKFtBLVpdKS9nLFxuICAgICAgKF8sIF8xLCBfMikgPT4gYCR7XzF9XyR7XzJ9YCxcbiAgICApLnRvTG93ZXJDYXNlKCksXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZGlyZWN0b3J5IG5hbWUgb2YgdGhlIHBhdGhcbiAgICovXG4gIGRpcm5hbWU6IHBhdGguZGlybmFtZSxcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBsYXN0IHBvcnRpb24gb2YgdGhlIHBhdGhcbiAgICovXG4gIGJhc2VuYW1lOiBwYXRoLmJhc2VuYW1lLFxuXG4gIC8qKlxuICAgKiBBYnNvbHV0ZSBwYXRoIHRvIGZpbGVcbiAgICovXG4gIGFic29sdXRlOiBwYXRoLnJlc29sdmUsXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZmlsZSBleHRlbnNpb25cbiAgICovXG4gIGV4dG5hbWU6IHBhdGguZXh0bmFtZSxcbn1cblxuZXhwb3J0IHR5cGUgVHJhbnNmb3JtZXJOYW1lID0ga2V5b2YgdHlwZW9mIHRyYW5zZm9ybXNcblxuZXhwb3J0IGNvbnN0IGlzVHJhbnNmb3JtZXIgPSAoczogc3RyaW5nKTogcyBpcyBUcmFuc2Zvcm1lck5hbWUgPT4gcyBpbiB0cmFuc2Zvcm1zXG4iLCAiaW1wb3J0IHR5cGUgeyBOdmltUGx1Z2luIH0gZnJvbSAnbmVvdmltJ1xuaW1wb3J0ICogYXMgcHJvamV0IGZyb20gJy4uL3Byb2pldCdcblxuY29uc3QgcGx1Z2luT3B0aW9ucyA9IHtcbiAgZGV2OiBFTlYgPT09ICdkZXYnLFxuICBhbHdheXNJbml0OiBFTlYgPT09ICdkZXYnLFxufVxuXG5leHBvcnQgPSAocGx1Z2luOiBOdmltUGx1Z2luKSA9PiB7XG4gIHBsdWdpbi5zZXRPcHRpb25zKHBsdWdpbk9wdGlvbnMpXG5cbiAgY29uc3QgbG9nZ2VyID0gcGx1Z2luLm52aW0ubG9nZ2VyXG4gIGNvbnN0IGRlYnVnID0gbG9nZ2VyLmRlYnVnLmJpbmQobG9nZ2VyKVxuICBjb25zdCBpbmZvID0gbG9nZ2VyLmluZm8uYmluZChsb2dnZXIpXG4gIGNvbnN0IGVycm9yID0gbG9nZ2VyLmVycm9yLmJpbmQobG9nZ2VyKVxuICBjb25zdCB3YXJuID0gbG9nZ2VyLndhcm4uYmluZChsb2dnZXIpXG5cbiAgY29uc3QgZHVtcCA9ICh4OiBhbnkpID0+IGRlYnVnKEpTT04uc3RyaW5naWZ5KHgpKVxuXG4gIGNvbnN0IGFwaSA9IHBsdWdpbi5udmltXG4gIGNvbnN0IGNtZCA9IGFwaS5jb21tYW5kLmJpbmQoYXBpKVxuXG4gIGNvbnN0IGRlZkNtZCA9IHBsdWdpbi5yZWdpc3RlckNvbW1hbmQuYmluZChwbHVnaW4pXG4gIGNvbnN0IGRlZkZuID0gcGx1Z2luLnJlZ2lzdGVyRnVuY3Rpb24uYmluZChwbHVnaW4pXG5cbiAgY29uc3QgZWNob2VyciA9IChtc2c6IHN0cmluZykgPT4gYXBpLmVycldyaXRlTGluZShtc2cpXG4gIGNvbnN0IGVjaG9tc2cgPSAobXNnOiBzdHJpbmcpID0+IGFwaS5vdXRXcml0ZUxpbmUobXNnKVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHJlcG9ydEVycm9yPFQ+KGZ1bjogKCkgPT4gUHJvbWlzZTxUPikge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuKClcbiAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIGVjaG9lcnIoZS5tZXNzYWdlKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGVjaG9lcnIoSlNPTi5zdHJpbmdpZnkoZSkpXG4gICAgICByZXR1cm5cbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBDb21tYW5kc1xuICAgKi9cbiAgZGVmQ21kKCdQcm9qZXRMaW5rJywgYXN5bmMgKFtsaW5rTmFtZV06IHN0cmluZ1tdKSA9PiB7XG4gICAgcmVwb3J0RXJyb3IoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IGFwaS5idWZmZXIubmFtZVxuICAgICAgY29uc3QgY29uZmlnID0gYXdhaXQgcHJvamV0LmdldENvbmZpZyhmaWxlKVxuICAgICAgY29uc3QgbGlua0ZpbGUgPSBwcm9qZXQuYXNzb2MoY29uZmlnLCBmaWxlLCBsaW5rTmFtZSlcbiAgICAgIGF3YWl0IGNtZChgZWRpdCAke2xpbmtGaWxlfWApXG4gICAgfSlcbiAgfSwge1xuICAgIHN5bmM6IGZhbHNlLFxuICAgIG5hcmdzOiAnPycsXG4gICAgY29tcGxldGU6ICdjdXN0b20sUHJvamV0QXNzb2NDb21wbGV0ZScsXG4gIH0pXG5cbiAgZGVmQ21kKCdQcm9qZXRDb25maWcnLCBhc3luYyAoKSA9PiB7XG4gICAgcmVwb3J0RXJyb3IoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYm5hbWUgPSBhd2FpdCBhcGkuYnVmZmVyLm5hbWVcbiAgICAgIGNvbnN0IGNvbmZpZ0ZpbGUgPSBhd2FpdCBwcm9qZXQuZmluZENvbmZpZyhibmFtZSlcbiAgICAgIGF3YWl0IGNtZChgZWRpdCAke2NvbmZpZ0ZpbGV9YClcbiAgICB9KVxuICB9LCB7IHN5bmM6IGZhbHNlIH0pXG5cbiAgLypcbiAgICogRnVuY3Rpb25zXG4gICAqL1xuICBkZWZGbignUHJvamV0QXNzb2NDb21wbGV0ZScsIGFzeW5jIChfYXJnTGVhZDogc3RyaW5nLCBfY21kTGluZTogc3RyaW5nLCBfY3Vyc29yUG9zOiBudW1iZXIpID0+IHtcbiAgICByZXR1cm4gYXdhaXQgcmVwb3J0RXJyb3IoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IGFwaS5idWZmZXIubmFtZVxuICAgICAgY29uc3QgY29uZmlnID0gYXdhaXQgcHJvamV0LmdldENvbmZpZyhmaWxlKVxuICAgICAgY29uc3QgbWF0Y2ggPSBwcm9qZXQuZmluZE1hdGNoKGNvbmZpZywgZmlsZSlcbiAgICAgIGNvbnN0IGtleXMgPSBtYXRjaD8ucnVsZT8ubGlua3M/Lm1hcCh4ID0+IHgubmFtZSkgPz8gW11cbiAgICAgIHJldHVybiBrZXlzLmpvaW4oJ1xcbicpXG4gICAgfSlcbiAgfSwgeyBzeW5jOiB0cnVlIH0pXG5cbiAgZGVmRm4oJ1Byb2pldEdldENvbmZpZycsIGFzeW5jICgpID0+IHtcbiAgICByZXR1cm4gYXdhaXQgcmVwb3J0RXJyb3IoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IGFwaS5idWZmZXIubmFtZVxuICAgICAgcmV0dXJuIGF3YWl0IHByb2pldC5nZXRDb25maWcoZmlsZSlcbiAgICB9KVxuICB9LCB7IHN5bmM6IHRydWUgfSlcblxuICBkZWZGbignUHJvamV0R2V0TWF0Y2hDb25maWcnLCBhc3luYyAoKSA9PiB7XG4gICAgcmV0dXJuIGF3YWl0IHJlcG9ydEVycm9yKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBhcGkuYnVmZmVyLm5hbWVcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHByb2pldC5nZXRDb25maWcoZmlsZSlcbiAgICAgIGNvbnN0IG1hdGNoID0gcHJvamV0LmZpbmRNYXRjaChjb25maWcsIGZpbGUpXG5cbiAgICAgIGlmICghbWF0Y2gpIHRocm93IGBObyBtYXRjaGVzIGZvciAke2ZpbGV9YFxuXG4gICAgICByZXR1cm4gbWF0Y2hcbiAg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Q2Y7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUc7QUFBQSxXQUNsQjtBQUNELGVBQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDckI7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDeEI7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7QUFBQSxXQUMzQjtBQUNELGVBQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDOUI7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDakM7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7QUFBQSxXQUNwQztBQUNELGVBQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDdkM7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDMUM7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7QUFBQSxXQUM3QztBQUNELGVBQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDaEQ7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQUEsV0FDbkQ7QUFDRCxlQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcs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
