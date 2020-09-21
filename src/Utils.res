type dictLookup<'a> = NoResult | Result('a)

/* * [unsafeGet dict key] returns the value associated with [key] in [dict]
This function will return an invalid value ([undefined]) if [key] does not exist in [dict]. It
will not throw an error.
*/
@bs.get_index external unsafeGetD: (Js.Dict.t<'a>, string) => 'a = ""

/* * [get dict key] returns the value associated with [key] in [dict] */
let safeGetD = (dict: Js.Dict.t<'u>, k: string): dictLookup<'u> => {
  if %raw(`k in dict`) {
    Result(dict->unsafeGetD(k))
  } else {
    NoResult
  }
}

@bs.val external values: Js.Dict.t<'a> => array<'a> = "Object.values"
@bs.val external entries: Js.Dict.t<'a> => array<(string, 'a)> = "Object.entries"

let unwrapS = (o: option<string>, d: string): string => {
  switch o {
  | Some(v) => v
  | None => d
  }
}

let safeGet = (arr: array<string>, index: int): option<string> => {
  open Js.Undefined
  open Js.Array2
  let rawValue = arr->unsafe_get(index)
  rawValue->return == empty ? None : Some(rawValue)
}

let safeGetS = (arr: string, index: int): option<string> => {
  open Js.Undefined
  open Js.String2
  let rawValue = arr->get(index)
  rawValue->return == empty ? None : Some(rawValue)
}

let classifyJson = (x: Js.Json.t): Js.Json.tagged_t => {
  open Js.Json
  let ty = Js.typeof(x)
  if ty == "string" {
    JSONString(Obj.magic(x))
  } else if ty == "number" {
    JSONNumber(Obj.magic(x))
  } else if ty == "boolean" {
    if Obj.magic(x) == true {
      JSONTrue
    } else {
      JSONFalse
    }
  } else if Obj.magic(x) === Js.null {
    JSONNull
  } else if Js_array2.isArray(x) {
    JSONArray(Obj.magic(x))
  } else {
    JSONObject(Obj.magic(x))
  }
}

let safeCastToString = json =>
  if Js.typeof(json) == "string" {
    Some((Obj.magic((json: Js.Json.t)): string))
  } else {
    None
  }

let mapD = (source, f) => {
  let target = Js.Dict.empty()
  let keys = Js.Dict.keys(source)
  let l = Js.Array2.length(keys)
  for i in 0 to l - 1 {
    let key = Js.Array2.unsafe_get(keys, i)
    Js.Dict.set(target, key, f(. unsafeGetD(source, key)))
  }
  target
}
