// Generated by ReScript, PLEASE EDIT WITH CARE


function safeGetD(dict, k) {
  if ((k in dict)) {
    return /* Result */{
            _0: dict[k]
          };
  } else {
    return /* NoResult */0;
  }
}

function unwrapS(o, d) {
  if (o !== undefined) {
    return o;
  } else {
    return d;
  }
}

function safeGet(arr, index) {
  var rawValue = arr[index];
  if (rawValue === undefined) {
    return ;
  } else {
    return rawValue;
  }
}

function safeGetS(arr, index) {
  var rawValue = arr[index];
  if (rawValue === undefined) {
    return ;
  } else {
    return rawValue;
  }
}

function classifyJson(x) {
  var ty = typeof x;
  if (ty === "string") {
    return {
            TAG: /* JSONString */0,
            _0: x
          };
  } else if (ty === "number") {
    return {
            TAG: /* JSONNumber */1,
            _0: x
          };
  } else if (ty === "boolean") {
    if (x === true) {
      return /* JSONTrue */1;
    } else {
      return /* JSONFalse */0;
    }
  } else if (x === null) {
    return /* JSONNull */2;
  } else if (Array.isArray(x)) {
    return {
            TAG: /* JSONArray */3,
            _0: x
          };
  } else {
    return {
            TAG: /* JSONObject */2,
            _0: x
          };
  }
}

function safeCastToString(json) {
  if (typeof json === "string") {
    return json;
  }
  
}

function mapD(source, f) {
  var target = {};
  var keys = Object.keys(source);
  var l = keys.length;
  for(var i = 0; i < l; ++i){
    var key = keys[i];
    target[key] = f(source[key]);
  }
  return target;
}

export {
  safeGetD ,
  unwrapS ,
  safeGet ,
  safeGetS ,
  classifyJson ,
  safeCastToString ,
  mapD ,
}
/* No side effect */
