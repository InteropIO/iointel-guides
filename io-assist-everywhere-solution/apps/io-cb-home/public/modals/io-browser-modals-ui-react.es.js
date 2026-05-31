import * as i from 'react';
import i__default, { createContext, memo, useState, useEffect, forwardRef, useCallback, useContext, useMemo, useRef, useLayoutEffect, useId, useImperativeHandle } from 'react';
import * as g from 'react-dom';
import g__default from 'react-dom';

const GLUE42_EVENT_NAME = "Glue42";
const MODALS_UI_FACTORY_READY = "modalsUIFactoryReady";
const REQUEST_MODALS_UI_FACTORY_READY = "requestModalsUIFactoryReady";

class EventController {
    events = {
        [REQUEST_MODALS_UI_FACTORY_READY]: { name: REQUEST_MODALS_UI_FACTORY_READY, handle: this.handleModalsUIFactoryReadyRequest.bind(this) },
    };
    wireCustomEventListener = () => {
        window.addEventListener(GLUE42_EVENT_NAME, this.handleMessage.bind(this));
    };
    notifyStarted() {
        this.send(MODALS_UI_FACTORY_READY);
    }
    handleMessage(event) {
        const data = event.detail;
        if (!data?.glue42) {
            return;
        }
        const eventName = data.glue42.event;
        const foundHandler = this.events[eventName];
        if (!foundHandler) {
            return;
        }
        foundHandler.handle(data.glue42.message);
    }
    handleModalsUIFactoryReadyRequest() {
        this.send(MODALS_UI_FACTORY_READY);
    }
    send(eventName, message) {
        const payload = { glue42: { event: eventName, message } };
        const event = new CustomEvent(GLUE42_EVENT_NAME, { detail: payload });
        window.dispatchEvent(event);
    }
}

/**
 * Wraps values in an `Ok` type.
 *
 * Example: `ok(5) // => {ok: true, result: 5}`
 */
var ok$1 = function (result) { return ({ ok: true, result: result }); };
/**
 * Wraps errors in an `Err` type.
 *
 * Example: `err('on fire') // => {ok: false, error: 'on fire'}`
 */
var err$1 = function (error) { return ({ ok: false, error: error }); };
/**
 * Create a `Promise` that either resolves with the result of `Ok` or rejects
 * with the error of `Err`.
 */
var asPromise$1 = function (r) {
    return r.ok === true ? Promise.resolve(r.result) : Promise.reject(r.error);
};
/**
 * Unwraps a `Result` and returns either the result of an `Ok`, or
 * `defaultValue`.
 *
 * Example:
 * ```
 * Result.withDefault(5, number().run(json))
 * ```
 *
 * It would be nice if `Decoder` had an instance method that mirrored this
 * function. Such a method would look something like this:
 * ```
 * class Decoder<A> {
 *   runWithDefault = (defaultValue: A, json: any): A =>
 *     Result.withDefault(defaultValue, this.run(json));
 * }
 *
 * number().runWithDefault(5, json)
 * ```
 * Unfortunately, the type of `defaultValue: A` on the method causes issues
 * with type inference on  the `object` decoder in some situations. While these
 * inference issues can be solved by providing the optional type argument for
 * `object`s, the extra trouble and confusion doesn't seem worth it.
 */
var withDefault$1 = function (defaultValue, r) {
    return r.ok === true ? r.result : defaultValue;
};
/**
 * Return the successful result, or throw an error.
 */
var withException$1 = function (r) {
    if (r.ok === true) {
        return r.result;
    }
    else {
        throw r.error;
    }
};
/**
 * Apply `f` to the result of an `Ok`, or pass the error through.
 */
var map$1 = function (f, r) {
    return r.ok === true ? ok$1(f(r.result)) : r;
};
/**
 * Apply `f` to the result of two `Ok`s, or pass an error through. If both
 * `Result`s are errors then the first one is returned.
 */
var map2$1 = function (f, ar, br) {
    return ar.ok === false ? ar :
        br.ok === false ? br :
            ok$1(f(ar.result, br.result));
};
/**
 * Apply `f` to the error of an `Err`, or pass the success through.
 */
var mapError$1 = function (f, r) {
    return r.ok === true ? r : err$1(f(r.error));
};
/**
 * Chain together a sequence of computations that may fail, similar to a
 * `Promise`. If the first computation fails then the error will propagate
 * through. If it succeeds, then `f` will be applied to the value, returning a
 * new `Result`.
 */
var andThen$1 = function (f, r) {
    return r.ok === true ? f(r.result) : r;
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */



var __assign$1 = function() {
    __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};

function __rest$1(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function isEqual$1(a, b) {
    if (a === b) {
        return true;
    }
    if (a === null && b === null) {
        return true;
    }
    if (typeof (a) !== typeof (b)) {
        return false;
    }
    if (typeof (a) === 'object') {
        // Array
        if (Array.isArray(a)) {
            if (!Array.isArray(b)) {
                return false;
            }
            if (a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                if (!isEqual$1(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        // Hash table
        var keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
            return false;
        }
        for (var i = 0; i < keys.length; i++) {
            if (!b.hasOwnProperty(keys[i])) {
                return false;
            }
            if (!isEqual$1(a[keys[i]], b[keys[i]])) {
                return false;
            }
        }
        return true;
    }
}
/*
 * Helpers
 */
var isJsonArray$1 = function (json) { return Array.isArray(json); };
var isJsonObject$1 = function (json) {
    return typeof json === 'object' && json !== null && !isJsonArray$1(json);
};
var typeString$1 = function (json) {
    switch (typeof json) {
        case 'string':
            return 'a string';
        case 'number':
            return 'a number';
        case 'boolean':
            return 'a boolean';
        case 'undefined':
            return 'undefined';
        case 'object':
            if (json instanceof Array) {
                return 'an array';
            }
            else if (json === null) {
                return 'null';
            }
            else {
                return 'an object';
            }
        default:
            return JSON.stringify(json);
    }
};
var expectedGot$1 = function (expected, got) {
    return "expected " + expected + ", got " + typeString$1(got);
};
var printPath$1 = function (paths) {
    return paths.map(function (path) { return (typeof path === 'string' ? "." + path : "[" + path + "]"); }).join('');
};
var prependAt$1 = function (newAt, _a) {
    var at = _a.at, rest = __rest$1(_a, ["at"]);
    return (__assign$1({ at: newAt + (at || '') }, rest));
};
/**
 * Decoders transform json objects with unknown structure into known and
 * verified forms. You can create objects of type `Decoder<A>` with either the
 * primitive decoder functions, such as `boolean()` and `string()`, or by
 * applying higher-order decoders to the primitives, such as `array(boolean())`
 * or `dict(string())`.
 *
 * Each of the decoder functions are available both as a static method on
 * `Decoder` and as a function alias -- for example the string decoder is
 * defined at `Decoder.string()`, but is also aliased to `string()`. Using the
 * function aliases exported with the library is recommended.
 *
 * `Decoder` exposes a number of 'run' methods, which all decode json in the
 * same way, but communicate success and failure in different ways. The `map`
 * and `andThen` methods modify decoders without having to call a 'run' method.
 *
 * Alternatively, the main decoder `run()` method returns an object of type
 * `Result<A, DecoderError>`. This library provides a number of helper
 * functions for dealing with the `Result` type, so you can do all the same
 * things with a `Result` as with the decoder methods.
 */
var Decoder$1 = /** @class */ (function () {
    /**
     * The Decoder class constructor is kept private to separate the internal
     * `decode` function from the external `run` function. The distinction
     * between the two functions is that `decode` returns a
     * `Partial<DecoderError>` on failure, which contains an unfinished error
     * report. When `run` is called on a decoder, the relevant series of `decode`
     * calls is made, and then on failure the resulting `Partial<DecoderError>`
     * is turned into a `DecoderError` by filling in the missing information.
     *
     * While hiding the constructor may seem restrictive, leveraging the
     * provided decoder combinators and helper functions such as
     * `andThen` and `map` should be enough to build specialized decoders as
     * needed.
     */
    function Decoder(decode) {
        var _this = this;
        this.decode = decode;
        /**
         * Run the decoder and return a `Result` with either the decoded value or a
         * `DecoderError` containing the json input, the location of the error, and
         * the error message.
         *
         * Examples:
         * ```
         * number().run(12)
         * // => {ok: true, result: 12}
         *
         * string().run(9001)
         * // =>
         * // {
         * //   ok: false,
         * //   error: {
         * //     kind: 'DecoderError',
         * //     input: 9001,
         * //     at: 'input',
         * //     message: 'expected a string, got 9001'
         * //   }
         * // }
         * ```
         */
        this.run = function (json) {
            return mapError$1(function (error) { return ({
                kind: 'DecoderError',
                input: json,
                at: 'input' + (error.at || ''),
                message: error.message || ''
            }); }, _this.decode(json));
        };
        /**
         * Run the decoder as a `Promise`.
         */
        this.runPromise = function (json) { return asPromise$1(_this.run(json)); };
        /**
         * Run the decoder and return the value on success, or throw an exception
         * with a formatted error string.
         */
        this.runWithException = function (json) { return withException$1(_this.run(json)); };
        /**
         * Construct a new decoder that applies a transformation to the decoded
         * result. If the decoder succeeds then `f` will be applied to the value. If
         * it fails the error will propagated through.
         *
         * Example:
         * ```
         * number().map(x => x * 5).run(10)
         * // => {ok: true, result: 50}
         * ```
         */
        this.map = function (f) {
            return new Decoder(function (json) { return map$1(f, _this.decode(json)); });
        };
        /**
         * Chain together a sequence of decoders. The first decoder will run, and
         * then the function will determine what decoder to run second. If the result
         * of the first decoder succeeds then `f` will be applied to the decoded
         * value. If it fails the error will propagate through.
         *
         * This is a very powerful method -- it can act as both the `map` and `where`
         * methods, can improve error messages for edge cases, and can be used to
         * make a decoder for custom types.
         *
         * Example of adding an error message:
         * ```
         * const versionDecoder = valueAt(['version'], number());
         * const infoDecoder3 = object({a: boolean()});
         *
         * const decoder = versionDecoder.andThen(version => {
         *   switch (version) {
         *     case 3:
         *       return infoDecoder3;
         *     default:
         *       return fail(`Unable to decode info, version ${version} is not supported.`);
         *   }
         * });
         *
         * decoder.run({version: 3, a: true})
         * // => {ok: true, result: {a: true}}
         *
         * decoder.run({version: 5, x: 'abc'})
         * // =>
         * // {
         * //   ok: false,
         * //   error: {... message: 'Unable to decode info, version 5 is not supported.'}
         * // }
         * ```
         *
         * Example of decoding a custom type:
         * ```
         * // nominal type for arrays with a length of at least one
         * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
         *
         * const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
         *   array(values).andThen(arr =>
         *     arr.length > 0
         *       ? succeed(createNonEmptyArray(arr))
         *       : fail(`expected a non-empty array, got an empty array`)
         *   );
         * ```
         */
        this.andThen = function (f) {
            return new Decoder(function (json) {
                return andThen$1(function (value) { return f(value).decode(json); }, _this.decode(json));
            });
        };
        /**
         * Add constraints to a decoder _without_ changing the resulting type. The
         * `test` argument is a predicate function which returns true for valid
         * inputs. When `test` fails on an input, the decoder fails with the given
         * `errorMessage`.
         *
         * ```
         * const chars = (length: number): Decoder<string> =>
         *   string().where(
         *     (s: string) => s.length === length,
         *     `expected a string of length ${length}`
         *   );
         *
         * chars(5).run('12345')
         * // => {ok: true, result: '12345'}
         *
         * chars(2).run('HELLO')
         * // => {ok: false, error: {... message: 'expected a string of length 2'}}
         *
         * chars(12).run(true)
         * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
         * ```
         */
        this.where = function (test, errorMessage) {
            return _this.andThen(function (value) { return (test(value) ? Decoder.succeed(value) : Decoder.fail(errorMessage)); });
        };
    }
    /**
     * Decoder primitive that validates strings, and fails on all other input.
     */
    Decoder.string = function () {
        return new Decoder(function (json) {
            return typeof json === 'string'
                ? ok$1(json)
                : err$1({ message: expectedGot$1('a string', json) });
        });
    };
    /**
     * Decoder primitive that validates numbers, and fails on all other input.
     */
    Decoder.number = function () {
        return new Decoder(function (json) {
            return typeof json === 'number'
                ? ok$1(json)
                : err$1({ message: expectedGot$1('a number', json) });
        });
    };
    /**
     * Decoder primitive that validates booleans, and fails on all other input.
     */
    Decoder.boolean = function () {
        return new Decoder(function (json) {
            return typeof json === 'boolean'
                ? ok$1(json)
                : err$1({ message: expectedGot$1('a boolean', json) });
        });
    };
    Decoder.constant = function (value) {
        return new Decoder(function (json) {
            return isEqual$1(json, value)
                ? ok$1(value)
                : err$1({ message: "expected " + JSON.stringify(value) + ", got " + JSON.stringify(json) });
        });
    };
    Decoder.object = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonObject$1(json) && decoders) {
                var obj = {};
                for (var key in decoders) {
                    if (decoders.hasOwnProperty(key)) {
                        var r = decoders[key].decode(json[key]);
                        if (r.ok === true) {
                            // tslint:disable-next-line:strict-type-predicates
                            if (r.result !== undefined) {
                                obj[key] = r.result;
                            }
                        }
                        else if (json[key] === undefined) {
                            return err$1({ message: "the key '" + key + "' is required but was not present" });
                        }
                        else {
                            return err$1(prependAt$1("." + key, r.error));
                        }
                    }
                }
                return ok$1(obj);
            }
            else if (isJsonObject$1(json)) {
                return ok$1(json);
            }
            else {
                return err$1({ message: expectedGot$1('an object', json) });
            }
        });
    };
    Decoder.array = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonArray$1(json) && decoder) {
                var decodeValue_1 = function (v, i) {
                    return mapError$1(function (err$$1) { return prependAt$1("[" + i + "]", err$$1); }, decoder.decode(v));
                };
                return json.reduce(function (acc, v, i) {
                    return map2$1(function (arr, result) { return arr.concat([result]); }, acc, decodeValue_1(v, i));
                }, ok$1([]));
            }
            else if (isJsonArray$1(json)) {
                return ok$1(json);
            }
            else {
                return err$1({ message: expectedGot$1('an array', json) });
            }
        });
    };
    Decoder.tuple = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonArray$1(json)) {
                if (json.length !== decoders.length) {
                    return err$1({
                        message: "expected a tuple of length " + decoders.length + ", got one of length " + json.length
                    });
                }
                var result = [];
                for (var i = 0; i < decoders.length; i++) {
                    var nth = decoders[i].decode(json[i]);
                    if (nth.ok) {
                        result[i] = nth.result;
                    }
                    else {
                        return err$1(prependAt$1("[" + i + "]", nth.error));
                    }
                }
                return ok$1(result);
            }
            else {
                return err$1({ message: expectedGot$1("a tuple of length " + decoders.length, json) });
            }
        });
    };
    Decoder.union = function (ad, bd) {
        var decoders = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            decoders[_i - 2] = arguments[_i];
        }
        return Decoder.oneOf.apply(Decoder, [ad, bd].concat(decoders));
    };
    Decoder.intersection = function (ad, bd) {
        var ds = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ds[_i - 2] = arguments[_i];
        }
        return new Decoder(function (json) {
            return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2$1(Object.assign, acc, decoder.decode(json)); }, ok$1({}));
        });
    };
    /**
     * Escape hatch to bypass validation. Always succeeds and types the result as
     * `any`. Useful for defining decoders incrementally, particularly for
     * complex objects.
     *
     * Example:
     * ```
     * interface User {
     *   name: string;
     *   complexUserData: ComplexType;
     * }
     *
     * const userDecoder: Decoder<User> = object({
     *   name: string(),
     *   complexUserData: anyJson()
     * });
     * ```
     */
    Decoder.anyJson = function () { return new Decoder(function (json) { return ok$1(json); }); };
    /**
     * Decoder identity function which always succeeds and types the result as
     * `unknown`.
     */
    Decoder.unknownJson = function () {
        return new Decoder(function (json) { return ok$1(json); });
    };
    /**
     * Decoder for json objects where the keys are unknown strings, but the values
     * should all be of the same type.
     *
     * Example:
     * ```
     * dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
     * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
     * ```
     */
    Decoder.dict = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonObject$1(json)) {
                var obj = {};
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        var r = decoder.decode(json[key]);
                        if (r.ok === true) {
                            obj[key] = r.result;
                        }
                        else {
                            return err$1(prependAt$1("." + key, r.error));
                        }
                    }
                }
                return ok$1(obj);
            }
            else {
                return err$1({ message: expectedGot$1('an object', json) });
            }
        });
    };
    /**
     * Decoder for values that may be `undefined`. This is primarily helpful for
     * decoding interfaces with optional fields.
     *
     * Example:
     * ```
     * interface User {
     *   id: number;
     *   isOwner?: boolean;
     * }
     *
     * const decoder: Decoder<User> = object({
     *   id: number(),
     *   isOwner: optional(boolean())
     * });
     * ```
     */
    Decoder.optional = function (decoder) {
        return new Decoder(function (json) { return (json === undefined || json === null ? ok$1(undefined) : decoder.decode(json)); });
    };
    /**
     * Decoder that attempts to run each decoder in `decoders` and either succeeds
     * with the first successful decoder, or fails after all decoders have failed.
     *
     * Note that `oneOf` expects the decoders to all have the same return type,
     * while `union` creates a decoder for the union type of all the input
     * decoders.
     *
     * Examples:
     * ```
     * oneOf(string(), number().map(String))
     * oneOf(constant('start'), constant('stop'), succeed('unknown'))
     * ```
     */
    Decoder.oneOf = function () {
        var decoders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            decoders[_i] = arguments[_i];
        }
        return new Decoder(function (json) {
            var errors = [];
            for (var i = 0; i < decoders.length; i++) {
                var r = decoders[i].decode(json);
                if (r.ok === true) {
                    return r;
                }
                else {
                    errors[i] = r.error;
                }
            }
            var errorsList = errors
                .map(function (error) { return "at error" + (error.at || '') + ": " + error.message; })
                .join('", "');
            return err$1({
                message: "expected a value matching one of the decoders, got the errors [\"" + errorsList + "\"]"
            });
        });
    };
    /**
     * Decoder that always succeeds with either the decoded value, or a fallback
     * default value.
     */
    Decoder.withDefault = function (defaultValue, decoder) {
        return new Decoder(function (json) {
            return ok$1(withDefault$1(defaultValue, decoder.decode(json)));
        });
    };
    /**
     * Decoder that pulls a specific field out of a json structure, instead of
     * decoding and returning the full structure. The `paths` array describes the
     * object keys and array indices to traverse, so that values can be pulled out
     * of a nested structure.
     *
     * Example:
     * ```
     * const decoder = valueAt(['a', 'b', 0], string());
     *
     * decoder.run({a: {b: ['surprise!']}})
     * // => {ok: true, result: 'surprise!'}
     *
     * decoder.run({a: {x: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
     * ```
     *
     * Note that the `decoder` is ran on the value found at the last key in the
     * path, even if the last key is not found. This allows the `optional`
     * decoder to succeed when appropriate.
     * ```
     * const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));
     *
     * optionalDecoder.run({a: {b: {c: 'surprise!'}}})
     * // => {ok: true, result: 'surprise!'}
     *
     * optionalDecoder.run({a: {b: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
     *
     * optionalDecoder.run({a: {b: {z: 1}}})
     * // => {ok: true, result: undefined}
     * ```
     */
    Decoder.valueAt = function (paths, decoder) {
        return new Decoder(function (json) {
            var jsonAtPath = json;
            for (var i = 0; i < paths.length; i++) {
                if (jsonAtPath === undefined) {
                    return err$1({
                        at: printPath$1(paths.slice(0, i + 1)),
                        message: 'path does not exist'
                    });
                }
                else if (typeof paths[i] === 'string' && !isJsonObject$1(jsonAtPath)) {
                    return err$1({
                        at: printPath$1(paths.slice(0, i + 1)),
                        message: expectedGot$1('an object', jsonAtPath)
                    });
                }
                else if (typeof paths[i] === 'number' && !isJsonArray$1(jsonAtPath)) {
                    return err$1({
                        at: printPath$1(paths.slice(0, i + 1)),
                        message: expectedGot$1('an array', jsonAtPath)
                    });
                }
                else {
                    jsonAtPath = jsonAtPath[paths[i]];
                }
            }
            return mapError$1(function (error) {
                return jsonAtPath === undefined
                    ? { at: printPath$1(paths), message: 'path does not exist' }
                    : prependAt$1(printPath$1(paths), error);
            }, decoder.decode(jsonAtPath));
        });
    };
    /**
     * Decoder that ignores the input json and always succeeds with `fixedValue`.
     */
    Decoder.succeed = function (fixedValue) {
        return new Decoder(function (json) { return ok$1(fixedValue); });
    };
    /**
     * Decoder that ignores the input json and always fails with `errorMessage`.
     */
    Decoder.fail = function (errorMessage) {
        return new Decoder(function (json) { return err$1({ message: errorMessage }); });
    };
    /**
     * Decoder that allows for validating recursive data structures. Unlike with
     * functions, decoders assigned to variables can't reference themselves
     * before they are fully defined. We can avoid prematurely referencing the
     * decoder by wrapping it in a function that won't be called until use, at
     * which point the decoder has been defined.
     *
     * Example:
     * ```
     * interface Comment {
     *   msg: string;
     *   replies: Comment[];
     * }
     *
     * const decoder: Decoder<Comment> = object({
     *   msg: string(),
     *   replies: lazy(() => array(decoder))
     * });
     * ```
     */
    Decoder.lazy = function (mkDecoder) {
        return new Decoder(function (json) { return mkDecoder().decode(json); });
    };
    return Decoder;
}());

/* tslint:disable:variable-name */
/** See `Decoder.string` */
var string$1 = Decoder$1.string;
/** See `Decoder.number` */
Decoder$1.number;
/** See `Decoder.boolean` */
var boolean$1 = Decoder$1.boolean;
/** See `Decoder.anyJson` */
var anyJson$1 = Decoder$1.anyJson;
/** See `Decoder.unknownJson` */
Decoder$1.unknownJson;
/** See `Decoder.constant` */
var constant$1 = Decoder$1.constant;
/** See `Decoder.object` */
var object$1 = Decoder$1.object;
/** See `Decoder.array` */
var array$1 = Decoder$1.array;
/** See `Decoder.tuple` */
Decoder$1.tuple;
/** See `Decoder.dict` */
Decoder$1.dict;
/** See `Decoder.optional` */
var optional$1 = Decoder$1.optional;
/** See `Decoder.oneOf` */
var oneOf$1 = Decoder$1.oneOf;
/** See `Decoder.union` */
Decoder$1.union;
/** See `Decoder.intersection` */
Decoder$1.intersection;
/** See `Decoder.withDefault` */
Decoder$1.withDefault;
/** See `Decoder.valueAt` */
Decoder$1.valueAt;
/** See `Decoder.succeed` */
Decoder$1.succeed;
/** See `Decoder.fail` */
Decoder$1.fail;
/** See `Decoder.lazy` */
Decoder$1.lazy;

const connectBrowserAppProps = ["name", "title", "version", "customProperties", "icon", "caption", "type"];
const fdc3v2AppProps = ["appId", "name", "type", "details", "version", "title", "tooltip", "lang", "description", "categories", "icons", "screenshots", "contactEmail", "moreInfo", "publisher", "customConfig", "hostManifests", "interop", "localizedVersions"];

/**
 * Wraps values in an `Ok` type.
 *
 * Example: `ok(5) // => {ok: true, result: 5}`
 */
var ok = function (result) { return ({ ok: true, result: result }); };
/**
 * Wraps errors in an `Err` type.
 *
 * Example: `err('on fire') // => {ok: false, error: 'on fire'}`
 */
var err = function (error) { return ({ ok: false, error: error }); };
/**
 * Create a `Promise` that either resolves with the result of `Ok` or rejects
 * with the error of `Err`.
 */
var asPromise = function (r) {
    return r.ok === true ? Promise.resolve(r.result) : Promise.reject(r.error);
};
/**
 * Unwraps a `Result` and returns either the result of an `Ok`, or
 * `defaultValue`.
 *
 * Example:
 * ```
 * Result.withDefault(5, number().run(json))
 * ```
 *
 * It would be nice if `Decoder` had an instance method that mirrored this
 * function. Such a method would look something like this:
 * ```
 * class Decoder<A> {
 *   runWithDefault = (defaultValue: A, json: any): A =>
 *     Result.withDefault(defaultValue, this.run(json));
 * }
 *
 * number().runWithDefault(5, json)
 * ```
 * Unfortunately, the type of `defaultValue: A` on the method causes issues
 * with type inference on  the `object` decoder in some situations. While these
 * inference issues can be solved by providing the optional type argument for
 * `object`s, the extra trouble and confusion doesn't seem worth it.
 */
var withDefault = function (defaultValue, r) {
    return r.ok === true ? r.result : defaultValue;
};
/**
 * Return the successful result, or throw an error.
 */
var withException = function (r) {
    if (r.ok === true) {
        return r.result;
    }
    else {
        throw r.error;
    }
};
/**
 * Apply `f` to the result of an `Ok`, or pass the error through.
 */
var map = function (f, r) {
    return r.ok === true ? ok(f(r.result)) : r;
};
/**
 * Apply `f` to the result of two `Ok`s, or pass an error through. If both
 * `Result`s are errors then the first one is returned.
 */
var map2 = function (f, ar, br) {
    return ar.ok === false ? ar :
        br.ok === false ? br :
            ok(f(ar.result, br.result));
};
/**
 * Apply `f` to the error of an `Err`, or pass the success through.
 */
var mapError = function (f, r) {
    return r.ok === true ? r : err(f(r.error));
};
/**
 * Chain together a sequence of computations that may fail, similar to a
 * `Promise`. If the first computation fails then the error will propagate
 * through. If it succeeds, then `f` will be applied to the value, returning a
 * new `Result`.
 */
var andThen = function (f, r) {
    return r.ok === true ? f(r.result) : r;
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */



var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function isEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a === null && b === null) {
        return true;
    }
    if (typeof (a) !== typeof (b)) {
        return false;
    }
    if (typeof (a) === 'object') {
        // Array
        if (Array.isArray(a)) {
            if (!Array.isArray(b)) {
                return false;
            }
            if (a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                if (!isEqual(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        // Hash table
        var keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
            return false;
        }
        for (var i = 0; i < keys.length; i++) {
            if (!b.hasOwnProperty(keys[i])) {
                return false;
            }
            if (!isEqual(a[keys[i]], b[keys[i]])) {
                return false;
            }
        }
        return true;
    }
}
/*
 * Helpers
 */
var isJsonArray = function (json) { return Array.isArray(json); };
var isJsonObject = function (json) {
    return typeof json === 'object' && json !== null && !isJsonArray(json);
};
var typeString = function (json) {
    switch (typeof json) {
        case 'string':
            return 'a string';
        case 'number':
            return 'a number';
        case 'boolean':
            return 'a boolean';
        case 'undefined':
            return 'undefined';
        case 'object':
            if (json instanceof Array) {
                return 'an array';
            }
            else if (json === null) {
                return 'null';
            }
            else {
                return 'an object';
            }
        default:
            return JSON.stringify(json);
    }
};
var expectedGot = function (expected, got) {
    return "expected " + expected + ", got " + typeString(got);
};
var printPath = function (paths) {
    return paths.map(function (path) { return (typeof path === 'string' ? "." + path : "[" + path + "]"); }).join('');
};
var prependAt = function (newAt, _a) {
    var at = _a.at, rest = __rest(_a, ["at"]);
    return (__assign({ at: newAt + (at || '') }, rest));
};
/**
 * Decoders transform json objects with unknown structure into known and
 * verified forms. You can create objects of type `Decoder<A>` with either the
 * primitive decoder functions, such as `boolean()` and `string()`, or by
 * applying higher-order decoders to the primitives, such as `array(boolean())`
 * or `dict(string())`.
 *
 * Each of the decoder functions are available both as a static method on
 * `Decoder` and as a function alias -- for example the string decoder is
 * defined at `Decoder.string()`, but is also aliased to `string()`. Using the
 * function aliases exported with the library is recommended.
 *
 * `Decoder` exposes a number of 'run' methods, which all decode json in the
 * same way, but communicate success and failure in different ways. The `map`
 * and `andThen` methods modify decoders without having to call a 'run' method.
 *
 * Alternatively, the main decoder `run()` method returns an object of type
 * `Result<A, DecoderError>`. This library provides a number of helper
 * functions for dealing with the `Result` type, so you can do all the same
 * things with a `Result` as with the decoder methods.
 */
var Decoder = /** @class */ (function () {
    /**
     * The Decoder class constructor is kept private to separate the internal
     * `decode` function from the external `run` function. The distinction
     * between the two functions is that `decode` returns a
     * `Partial<DecoderError>` on failure, which contains an unfinished error
     * report. When `run` is called on a decoder, the relevant series of `decode`
     * calls is made, and then on failure the resulting `Partial<DecoderError>`
     * is turned into a `DecoderError` by filling in the missing information.
     *
     * While hiding the constructor may seem restrictive, leveraging the
     * provided decoder combinators and helper functions such as
     * `andThen` and `map` should be enough to build specialized decoders as
     * needed.
     */
    function Decoder(decode) {
        var _this = this;
        this.decode = decode;
        /**
         * Run the decoder and return a `Result` with either the decoded value or a
         * `DecoderError` containing the json input, the location of the error, and
         * the error message.
         *
         * Examples:
         * ```
         * number().run(12)
         * // => {ok: true, result: 12}
         *
         * string().run(9001)
         * // =>
         * // {
         * //   ok: false,
         * //   error: {
         * //     kind: 'DecoderError',
         * //     input: 9001,
         * //     at: 'input',
         * //     message: 'expected a string, got 9001'
         * //   }
         * // }
         * ```
         */
        this.run = function (json) {
            return mapError(function (error) { return ({
                kind: 'DecoderError',
                input: json,
                at: 'input' + (error.at || ''),
                message: error.message || ''
            }); }, _this.decode(json));
        };
        /**
         * Run the decoder as a `Promise`.
         */
        this.runPromise = function (json) { return asPromise(_this.run(json)); };
        /**
         * Run the decoder and return the value on success, or throw an exception
         * with a formatted error string.
         */
        this.runWithException = function (json) { return withException(_this.run(json)); };
        /**
         * Construct a new decoder that applies a transformation to the decoded
         * result. If the decoder succeeds then `f` will be applied to the value. If
         * it fails the error will propagated through.
         *
         * Example:
         * ```
         * number().map(x => x * 5).run(10)
         * // => {ok: true, result: 50}
         * ```
         */
        this.map = function (f) {
            return new Decoder(function (json) { return map(f, _this.decode(json)); });
        };
        /**
         * Chain together a sequence of decoders. The first decoder will run, and
         * then the function will determine what decoder to run second. If the result
         * of the first decoder succeeds then `f` will be applied to the decoded
         * value. If it fails the error will propagate through.
         *
         * This is a very powerful method -- it can act as both the `map` and `where`
         * methods, can improve error messages for edge cases, and can be used to
         * make a decoder for custom types.
         *
         * Example of adding an error message:
         * ```
         * const versionDecoder = valueAt(['version'], number());
         * const infoDecoder3 = object({a: boolean()});
         *
         * const decoder = versionDecoder.andThen(version => {
         *   switch (version) {
         *     case 3:
         *       return infoDecoder3;
         *     default:
         *       return fail(`Unable to decode info, version ${version} is not supported.`);
         *   }
         * });
         *
         * decoder.run({version: 3, a: true})
         * // => {ok: true, result: {a: true}}
         *
         * decoder.run({version: 5, x: 'abc'})
         * // =>
         * // {
         * //   ok: false,
         * //   error: {... message: 'Unable to decode info, version 5 is not supported.'}
         * // }
         * ```
         *
         * Example of decoding a custom type:
         * ```
         * // nominal type for arrays with a length of at least one
         * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
         *
         * const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
         *   array(values).andThen(arr =>
         *     arr.length > 0
         *       ? succeed(createNonEmptyArray(arr))
         *       : fail(`expected a non-empty array, got an empty array`)
         *   );
         * ```
         */
        this.andThen = function (f) {
            return new Decoder(function (json) {
                return andThen(function (value) { return f(value).decode(json); }, _this.decode(json));
            });
        };
        /**
         * Add constraints to a decoder _without_ changing the resulting type. The
         * `test` argument is a predicate function which returns true for valid
         * inputs. When `test` fails on an input, the decoder fails with the given
         * `errorMessage`.
         *
         * ```
         * const chars = (length: number): Decoder<string> =>
         *   string().where(
         *     (s: string) => s.length === length,
         *     `expected a string of length ${length}`
         *   );
         *
         * chars(5).run('12345')
         * // => {ok: true, result: '12345'}
         *
         * chars(2).run('HELLO')
         * // => {ok: false, error: {... message: 'expected a string of length 2'}}
         *
         * chars(12).run(true)
         * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
         * ```
         */
        this.where = function (test, errorMessage) {
            return _this.andThen(function (value) { return (test(value) ? Decoder.succeed(value) : Decoder.fail(errorMessage)); });
        };
    }
    /**
     * Decoder primitive that validates strings, and fails on all other input.
     */
    Decoder.string = function () {
        return new Decoder(function (json) {
            return typeof json === 'string'
                ? ok(json)
                : err({ message: expectedGot('a string', json) });
        });
    };
    /**
     * Decoder primitive that validates numbers, and fails on all other input.
     */
    Decoder.number = function () {
        return new Decoder(function (json) {
            return typeof json === 'number'
                ? ok(json)
                : err({ message: expectedGot('a number', json) });
        });
    };
    /**
     * Decoder primitive that validates booleans, and fails on all other input.
     */
    Decoder.boolean = function () {
        return new Decoder(function (json) {
            return typeof json === 'boolean'
                ? ok(json)
                : err({ message: expectedGot('a boolean', json) });
        });
    };
    Decoder.constant = function (value) {
        return new Decoder(function (json) {
            return isEqual(json, value)
                ? ok(value)
                : err({ message: "expected " + JSON.stringify(value) + ", got " + JSON.stringify(json) });
        });
    };
    Decoder.object = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonObject(json) && decoders) {
                var obj = {};
                for (var key in decoders) {
                    if (decoders.hasOwnProperty(key)) {
                        var r = decoders[key].decode(json[key]);
                        if (r.ok === true) {
                            // tslint:disable-next-line:strict-type-predicates
                            if (r.result !== undefined) {
                                obj[key] = r.result;
                            }
                        }
                        else if (json[key] === undefined) {
                            return err({ message: "the key '" + key + "' is required but was not present" });
                        }
                        else {
                            return err(prependAt("." + key, r.error));
                        }
                    }
                }
                return ok(obj);
            }
            else if (isJsonObject(json)) {
                return ok(json);
            }
            else {
                return err({ message: expectedGot('an object', json) });
            }
        });
    };
    Decoder.array = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonArray(json) && decoder) {
                var decodeValue_1 = function (v, i) {
                    return mapError(function (err$$1) { return prependAt("[" + i + "]", err$$1); }, decoder.decode(v));
                };
                return json.reduce(function (acc, v, i) {
                    return map2(function (arr, result) { return arr.concat([result]); }, acc, decodeValue_1(v, i));
                }, ok([]));
            }
            else if (isJsonArray(json)) {
                return ok(json);
            }
            else {
                return err({ message: expectedGot('an array', json) });
            }
        });
    };
    Decoder.tuple = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonArray(json)) {
                if (json.length !== decoders.length) {
                    return err({
                        message: "expected a tuple of length " + decoders.length + ", got one of length " + json.length
                    });
                }
                var result = [];
                for (var i = 0; i < decoders.length; i++) {
                    var nth = decoders[i].decode(json[i]);
                    if (nth.ok) {
                        result[i] = nth.result;
                    }
                    else {
                        return err(prependAt("[" + i + "]", nth.error));
                    }
                }
                return ok(result);
            }
            else {
                return err({ message: expectedGot("a tuple of length " + decoders.length, json) });
            }
        });
    };
    Decoder.union = function (ad, bd) {
        var decoders = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            decoders[_i - 2] = arguments[_i];
        }
        return Decoder.oneOf.apply(Decoder, [ad, bd].concat(decoders));
    };
    Decoder.intersection = function (ad, bd) {
        var ds = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ds[_i - 2] = arguments[_i];
        }
        return new Decoder(function (json) {
            return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2(Object.assign, acc, decoder.decode(json)); }, ok({}));
        });
    };
    /**
     * Escape hatch to bypass validation. Always succeeds and types the result as
     * `any`. Useful for defining decoders incrementally, particularly for
     * complex objects.
     *
     * Example:
     * ```
     * interface User {
     *   name: string;
     *   complexUserData: ComplexType;
     * }
     *
     * const userDecoder: Decoder<User> = object({
     *   name: string(),
     *   complexUserData: anyJson()
     * });
     * ```
     */
    Decoder.anyJson = function () { return new Decoder(function (json) { return ok(json); }); };
    /**
     * Decoder identity function which always succeeds and types the result as
     * `unknown`.
     */
    Decoder.unknownJson = function () {
        return new Decoder(function (json) { return ok(json); });
    };
    /**
     * Decoder for json objects where the keys are unknown strings, but the values
     * should all be of the same type.
     *
     * Example:
     * ```
     * dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
     * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
     * ```
     */
    Decoder.dict = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonObject(json)) {
                var obj = {};
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        var r = decoder.decode(json[key]);
                        if (r.ok === true) {
                            obj[key] = r.result;
                        }
                        else {
                            return err(prependAt("." + key, r.error));
                        }
                    }
                }
                return ok(obj);
            }
            else {
                return err({ message: expectedGot('an object', json) });
            }
        });
    };
    /**
     * Decoder for values that may be `undefined`. This is primarily helpful for
     * decoding interfaces with optional fields.
     *
     * Example:
     * ```
     * interface User {
     *   id: number;
     *   isOwner?: boolean;
     * }
     *
     * const decoder: Decoder<User> = object({
     *   id: number(),
     *   isOwner: optional(boolean())
     * });
     * ```
     */
    Decoder.optional = function (decoder) {
        return new Decoder(function (json) { return (json === undefined || json === null ? ok(undefined) : decoder.decode(json)); });
    };
    /**
     * Decoder that attempts to run each decoder in `decoders` and either succeeds
     * with the first successful decoder, or fails after all decoders have failed.
     *
     * Note that `oneOf` expects the decoders to all have the same return type,
     * while `union` creates a decoder for the union type of all the input
     * decoders.
     *
     * Examples:
     * ```
     * oneOf(string(), number().map(String))
     * oneOf(constant('start'), constant('stop'), succeed('unknown'))
     * ```
     */
    Decoder.oneOf = function () {
        var decoders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            decoders[_i] = arguments[_i];
        }
        return new Decoder(function (json) {
            var errors = [];
            for (var i = 0; i < decoders.length; i++) {
                var r = decoders[i].decode(json);
                if (r.ok === true) {
                    return r;
                }
                else {
                    errors[i] = r.error;
                }
            }
            var errorsList = errors
                .map(function (error) { return "at error" + (error.at || '') + ": " + error.message; })
                .join('", "');
            return err({
                message: "expected a value matching one of the decoders, got the errors [\"" + errorsList + "\"]"
            });
        });
    };
    /**
     * Decoder that always succeeds with either the decoded value, or a fallback
     * default value.
     */
    Decoder.withDefault = function (defaultValue, decoder) {
        return new Decoder(function (json) {
            return ok(withDefault(defaultValue, decoder.decode(json)));
        });
    };
    /**
     * Decoder that pulls a specific field out of a json structure, instead of
     * decoding and returning the full structure. The `paths` array describes the
     * object keys and array indices to traverse, so that values can be pulled out
     * of a nested structure.
     *
     * Example:
     * ```
     * const decoder = valueAt(['a', 'b', 0], string());
     *
     * decoder.run({a: {b: ['surprise!']}})
     * // => {ok: true, result: 'surprise!'}
     *
     * decoder.run({a: {x: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
     * ```
     *
     * Note that the `decoder` is ran on the value found at the last key in the
     * path, even if the last key is not found. This allows the `optional`
     * decoder to succeed when appropriate.
     * ```
     * const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));
     *
     * optionalDecoder.run({a: {b: {c: 'surprise!'}}})
     * // => {ok: true, result: 'surprise!'}
     *
     * optionalDecoder.run({a: {b: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
     *
     * optionalDecoder.run({a: {b: {z: 1}}})
     * // => {ok: true, result: undefined}
     * ```
     */
    Decoder.valueAt = function (paths, decoder) {
        return new Decoder(function (json) {
            var jsonAtPath = json;
            for (var i = 0; i < paths.length; i++) {
                if (jsonAtPath === undefined) {
                    return err({
                        at: printPath(paths.slice(0, i + 1)),
                        message: 'path does not exist'
                    });
                }
                else if (typeof paths[i] === 'string' && !isJsonObject(jsonAtPath)) {
                    return err({
                        at: printPath(paths.slice(0, i + 1)),
                        message: expectedGot('an object', jsonAtPath)
                    });
                }
                else if (typeof paths[i] === 'number' && !isJsonArray(jsonAtPath)) {
                    return err({
                        at: printPath(paths.slice(0, i + 1)),
                        message: expectedGot('an array', jsonAtPath)
                    });
                }
                else {
                    jsonAtPath = jsonAtPath[paths[i]];
                }
            }
            return mapError(function (error) {
                return jsonAtPath === undefined
                    ? { at: printPath(paths), message: 'path does not exist' }
                    : prependAt(printPath(paths), error);
            }, decoder.decode(jsonAtPath));
        });
    };
    /**
     * Decoder that ignores the input json and always succeeds with `fixedValue`.
     */
    Decoder.succeed = function (fixedValue) {
        return new Decoder(function (json) { return ok(fixedValue); });
    };
    /**
     * Decoder that ignores the input json and always fails with `errorMessage`.
     */
    Decoder.fail = function (errorMessage) {
        return new Decoder(function (json) { return err({ message: errorMessage }); });
    };
    /**
     * Decoder that allows for validating recursive data structures. Unlike with
     * functions, decoders assigned to variables can't reference themselves
     * before they are fully defined. We can avoid prematurely referencing the
     * decoder by wrapping it in a function that won't be called until use, at
     * which point the decoder has been defined.
     *
     * Example:
     * ```
     * interface Comment {
     *   msg: string;
     *   replies: Comment[];
     * }
     *
     * const decoder: Decoder<Comment> = object({
     *   msg: string(),
     *   replies: lazy(() => array(decoder))
     * });
     * ```
     */
    Decoder.lazy = function (mkDecoder) {
        return new Decoder(function (json) { return mkDecoder().decode(json); });
    };
    return Decoder;
}());

/* tslint:disable:variable-name */
/** See `Decoder.string` */
var string = Decoder.string;
/** See `Decoder.number` */
var number = Decoder.number;
/** See `Decoder.boolean` */
var boolean = Decoder.boolean;
/** See `Decoder.anyJson` */
var anyJson = Decoder.anyJson;
/** See `Decoder.unknownJson` */
Decoder.unknownJson;
/** See `Decoder.constant` */
var constant = Decoder.constant;
/** See `Decoder.object` */
var object = Decoder.object;
/** See `Decoder.array` */
var array = Decoder.array;
/** See `Decoder.tuple` */
Decoder.tuple;
/** See `Decoder.dict` */
var dict = Decoder.dict;
/** See `Decoder.optional` */
var optional = Decoder.optional;
/** See `Decoder.oneOf` */
var oneOf = Decoder.oneOf;
/** See `Decoder.union` */
Decoder.union;
/** See `Decoder.intersection` */
Decoder.intersection;
/** See `Decoder.withDefault` */
Decoder.withDefault;
/** See `Decoder.valueAt` */
Decoder.valueAt;
/** See `Decoder.succeed` */
Decoder.succeed;
/** See `Decoder.fail` */
Decoder.fail;
/** See `Decoder.lazy` */
Decoder.lazy;

const nonEmptyStringDecoder$1 = string().where((s) => s.length > 0, "Expected a non-empty string");
const nonNegativeNumberDecoder$1 = number().where((num) => num >= 0, "Expected a non-negative number");

const intentDefinitionDecoder = object({
    name: nonEmptyStringDecoder$1,
    displayName: optional(string()),
    contexts: optional(array(string())),
    customConfig: optional(object())
});
const v2TypeDecoder = oneOf(constant("web"), constant("native"), constant("citrix"), constant("onlineNative"), constant("other"));
const v2DetailsDecoder = object({
    url: nonEmptyStringDecoder$1
});
const v2IconDecoder = object({
    src: nonEmptyStringDecoder$1,
    size: optional(nonEmptyStringDecoder$1),
    type: optional(nonEmptyStringDecoder$1)
});
const v2ScreenshotDecoder = object({
    src: nonEmptyStringDecoder$1,
    size: optional(nonEmptyStringDecoder$1),
    type: optional(nonEmptyStringDecoder$1),
    label: optional(nonEmptyStringDecoder$1)
});
const v2ListensForIntentDecoder = object({
    contexts: array(nonEmptyStringDecoder$1),
    displayName: optional(nonEmptyStringDecoder$1),
    resultType: optional(nonEmptyStringDecoder$1),
    customConfig: optional(anyJson())
});
const v2IntentsDecoder = object({
    listensFor: optional(dict(v2ListensForIntentDecoder)),
    raises: optional(dict(array(nonEmptyStringDecoder$1)))
});
const v2UserChannelDecoder = object({
    broadcasts: optional(array(nonEmptyStringDecoder$1)),
    listensFor: optional(array(nonEmptyStringDecoder$1))
});
const v2AppChannelDecoder = object({
    name: nonEmptyStringDecoder$1,
    description: optional(nonEmptyStringDecoder$1),
    broadcasts: optional(array(nonEmptyStringDecoder$1)),
    listensFor: optional(array(nonEmptyStringDecoder$1))
});
const v2InteropDecoder = object({
    intents: optional(v2IntentsDecoder),
    userChannels: optional(v2UserChannelDecoder),
    appChannels: optional(array(v2AppChannelDecoder))
});
const glue42ApplicationDetailsDecoder = object({
    url: optional(nonEmptyStringDecoder$1),
    top: optional(number()),
    left: optional(number()),
    width: optional(nonNegativeNumberDecoder$1),
    height: optional(nonNegativeNumberDecoder$1)
});
const glue42HostManifestsBrowserDecoder = object({
    name: optional(nonEmptyStringDecoder$1),
    type: optional(nonEmptyStringDecoder$1.where((s) => s === "window", "Expected a value of window")),
    title: optional(nonEmptyStringDecoder$1),
    version: optional(nonEmptyStringDecoder$1),
    customProperties: optional(anyJson()),
    icon: optional(string()),
    caption: optional(string()),
    details: optional(glue42ApplicationDetailsDecoder),
    intents: optional(array(intentDefinitionDecoder)),
    hidden: optional(boolean())
});
const v1DefinitionDecoder = object({
    name: nonEmptyStringDecoder$1,
    appId: nonEmptyStringDecoder$1,
    title: optional(nonEmptyStringDecoder$1),
    version: optional(nonEmptyStringDecoder$1),
    manifest: nonEmptyStringDecoder$1,
    manifestType: nonEmptyStringDecoder$1,
    tooltip: optional(nonEmptyStringDecoder$1),
    description: optional(nonEmptyStringDecoder$1),
    contactEmail: optional(nonEmptyStringDecoder$1),
    supportEmail: optional(nonEmptyStringDecoder$1),
    publisher: optional(nonEmptyStringDecoder$1),
    images: optional(array(object({ url: optional(nonEmptyStringDecoder$1) }))),
    icons: optional(array(object({ icon: optional(nonEmptyStringDecoder$1) }))),
    customConfig: anyJson(),
    intents: optional(array(intentDefinitionDecoder))
});
const v2LocalizedDefinitionDecoder = object({
    appId: optional(nonEmptyStringDecoder$1),
    name: optional(nonEmptyStringDecoder$1),
    details: optional(v2DetailsDecoder),
    version: optional(nonEmptyStringDecoder$1),
    title: optional(nonEmptyStringDecoder$1),
    tooltip: optional(nonEmptyStringDecoder$1),
    lang: optional(nonEmptyStringDecoder$1),
    description: optional(nonEmptyStringDecoder$1),
    categories: optional(array(nonEmptyStringDecoder$1)),
    icons: optional(array(v2IconDecoder)),
    screenshots: optional(array(v2ScreenshotDecoder)),
    contactEmail: optional(nonEmptyStringDecoder$1),
    supportEmail: optional(nonEmptyStringDecoder$1),
    moreInfo: optional(nonEmptyStringDecoder$1),
    publisher: optional(nonEmptyStringDecoder$1),
    customConfig: optional(array(anyJson())),
    hostManifests: optional(anyJson()),
    interop: optional(v2InteropDecoder)
});
const v2DefinitionDecoder = object({
    appId: nonEmptyStringDecoder$1,
    name: optional(nonEmptyStringDecoder$1),
    type: v2TypeDecoder,
    details: v2DetailsDecoder,
    version: optional(nonEmptyStringDecoder$1),
    title: optional(nonEmptyStringDecoder$1),
    tooltip: optional(nonEmptyStringDecoder$1),
    lang: optional(nonEmptyStringDecoder$1),
    description: optional(nonEmptyStringDecoder$1),
    categories: optional(array(nonEmptyStringDecoder$1)),
    icons: optional(array(v2IconDecoder)),
    screenshots: optional(array(v2ScreenshotDecoder)),
    contactEmail: optional(nonEmptyStringDecoder$1),
    supportEmail: optional(nonEmptyStringDecoder$1),
    moreInfo: optional(nonEmptyStringDecoder$1),
    publisher: optional(nonEmptyStringDecoder$1),
    customConfig: optional(array(anyJson())),
    hostManifests: optional(anyJson()),
    interop: optional(v2InteropDecoder),
    localizedVersions: optional(dict(v2LocalizedDefinitionDecoder))
});
const allDefinitionsDecoder = oneOf(v1DefinitionDecoder, v2DefinitionDecoder);

const parseDecoderErrorToStringMessage = (error) => {
    return `${error.kind} at ${error.at}: ${JSON.stringify(error.input)}. Reason - ${error.message}`;
};

class FDC3Service {
    fdc3ToDesktopDefinitionType = {
        web: "window",
        native: "exe",
        citrix: "citrix",
        onlineNative: "clickonce",
        other: "window"
    };
    toApi() {
        return {
            isFdc3Definition: this.isFdc3Definition.bind(this),
            parseToBrowserBaseAppData: this.parseToBrowserBaseAppData.bind(this),
            parseToDesktopAppConfig: this.parseToDesktopAppConfig.bind(this)
        };
    }
    isFdc3Definition(definition) {
        const decodeRes = allDefinitionsDecoder.run(definition);
        if (!decodeRes.ok) {
            return { isFdc3: false, reason: parseDecoderErrorToStringMessage(decodeRes.error) };
        }
        if (definition.appId && definition.details) {
            return { isFdc3: true, version: "2.0" };
        }
        if (definition.manifest) {
            return { isFdc3: true, version: "1.2" };
        }
        return { isFdc3: false, reason: "The passed definition is not FDC3" };
    }
    parseToBrowserBaseAppData(definition) {
        const { isFdc3, version } = this.isFdc3Definition(definition);
        if (!isFdc3) {
            throw new Error("The passed definition is not FDC3");
        }
        const decodeRes = allDefinitionsDecoder.run(definition);
        if (!decodeRes.ok) {
            throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(decodeRes.error)}`);
        }
        const userProperties = this.getUserPropertiesFromDefinition(definition, version);
        const createOptions = { url: this.getUrl(definition, version) };
        const baseApplicationData = {
            name: definition.appId,
            type: "window",
            createOptions,
            userProperties: {
                ...userProperties,
                intents: version === "1.2"
                    ? userProperties.intents
                    : this.getIntentsFromV2AppDefinition(definition),
                details: createOptions
            },
            title: definition.title,
            version: definition.version,
            icon: this.getIconFromDefinition(definition, version),
            caption: definition.description,
            fdc3: version === "2.0" ? { ...definition, definitionVersion: "2.0" } : undefined,
        };
        const ioConnectDefinition = definition.hostManifests?.ioConnect || definition.hostManifests?.["Glue42"];
        if (!ioConnectDefinition) {
            return baseApplicationData;
        }
        const ioDefinitionDecodeRes = glue42HostManifestsBrowserDecoder.run(ioConnectDefinition);
        if (!ioDefinitionDecodeRes.ok) {
            throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(ioDefinitionDecodeRes.error)}`);
        }
        if (!Object.keys(ioDefinitionDecodeRes.result).length) {
            return baseApplicationData;
        }
        return this.mergeBaseAppDataWithGlueManifest(baseApplicationData, ioDefinitionDecodeRes.result);
    }
    parseToDesktopAppConfig(definition) {
        const { isFdc3, version } = this.isFdc3Definition(definition);
        if (!isFdc3) {
            throw new Error("The passed definition is not FDC3");
        }
        const decodeRes = allDefinitionsDecoder.run(definition);
        if (!decodeRes.ok) {
            throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(decodeRes.error)}`);
        }
        if (version === "1.2") {
            const fdc3v1Definition = definition;
            return {
                name: fdc3v1Definition.appId,
                type: "window",
                details: {
                    url: this.getUrl(definition, version)
                },
                version: fdc3v1Definition.version,
                title: fdc3v1Definition.title,
                tooltip: fdc3v1Definition.tooltip,
                caption: fdc3v1Definition.description,
                icon: fdc3v1Definition.icons?.[0].icon,
                intents: fdc3v1Definition.intents,
                customProperties: {
                    manifestType: fdc3v1Definition.manifestType,
                    images: fdc3v1Definition.images,
                    contactEmail: fdc3v1Definition.contactEmail,
                    supportEmail: fdc3v1Definition.supportEmail,
                    publisher: fdc3v1Definition.publisher,
                    icons: fdc3v1Definition.icons,
                    customConfig: fdc3v1Definition.customConfig
                }
            };
        }
        const fdc3v2Definition = definition;
        const desktopDefinition = {
            name: fdc3v2Definition.appId,
            type: this.fdc3ToDesktopDefinitionType[fdc3v2Definition.type],
            details: fdc3v2Definition.details,
            version: fdc3v2Definition.version,
            title: fdc3v2Definition.title,
            tooltip: fdc3v2Definition.tooltip,
            caption: fdc3v2Definition.description,
            icon: this.getIconFromDefinition(fdc3v2Definition, "2.0"),
            intents: this.getIntentsFromV2AppDefinition(fdc3v2Definition),
            fdc3: { ...fdc3v2Definition, definitionVersion: "2.0" }
        };
        const ioConnectDefinition = definition.hostManifests?.ioConnect || definition.hostManifests?.["Glue42"];
        if (!ioConnectDefinition) {
            return desktopDefinition;
        }
        if (typeof ioConnectDefinition !== "object" || Array.isArray(ioConnectDefinition)) {
            throw new Error(`Invalid '${definition.hostManifests.ioConnect ? "hostManifests.ioConnect" : "hostManifests['Glue42']"}' key`);
        }
        return this.mergeDesktopConfigWithGlueManifest(desktopDefinition, ioConnectDefinition);
    }
    getUserPropertiesFromDefinition(definition, version) {
        if (version === "1.2") {
            return Object.fromEntries(Object.entries(definition).filter(([key]) => !connectBrowserAppProps.includes(key)));
        }
        return Object.fromEntries(Object.entries(definition).filter(([key]) => !connectBrowserAppProps.includes(key) && !fdc3v2AppProps.includes(key)));
    }
    getUrl(definition, version) {
        let url;
        if (version === "1.2") {
            const parsedManifest = JSON.parse(definition.manifest);
            url = parsedManifest.details?.url || parsedManifest.url;
        }
        else {
            url = definition.details?.url;
        }
        if (!url || typeof url !== "string") {
            throw new Error(`Invalid FDC3 ${version} definition. Provide valid 'url' under '${version === "1.2" ? "manifest" : "details"}' key`);
        }
        return url;
    }
    getIntentsFromV2AppDefinition(definition) {
        const fdc3Intents = definition.interop?.intents?.listensFor;
        if (!fdc3Intents) {
            return;
        }
        const intents = Object.entries(fdc3Intents).map((fdc3Intent) => {
            const [intentName, intentData] = fdc3Intent;
            return {
                name: intentName,
                ...intentData
            };
        });
        return intents;
    }
    getIconFromDefinition(definition, version) {
        if (version === "1.2") {
            return definition.icons?.find((iconDef) => iconDef.icon)?.icon || undefined;
        }
        return definition.icons?.find((iconDef) => iconDef.src)?.src || undefined;
    }
    mergeBaseAppDataWithGlueManifest(baseAppData, hostManifestDefinition) {
        let baseApplicationDefinition = baseAppData;
        if (hostManifestDefinition.customProperties) {
            baseApplicationDefinition.userProperties = { ...baseAppData.userProperties, ...hostManifestDefinition.customProperties };
        }
        if (hostManifestDefinition.details) {
            const details = { ...baseAppData.createOptions, ...hostManifestDefinition.details };
            baseApplicationDefinition.createOptions = details;
            baseApplicationDefinition.userProperties.details = details;
        }
        if (Array.isArray(hostManifestDefinition.intents)) {
            baseApplicationDefinition.userProperties.intents = (baseApplicationDefinition.userProperties.intents || []).concat(hostManifestDefinition.intents);
        }
        baseApplicationDefinition = { ...baseApplicationDefinition, ...hostManifestDefinition };
        delete baseApplicationDefinition.details;
        delete baseApplicationDefinition.intents;
        return baseApplicationDefinition;
    }
    mergeDesktopConfigWithGlueManifest(config, desktopDefinition) {
        const appConfig = Object.assign({}, config, desktopDefinition, { details: { ...config.details, ...desktopDefinition.details } });
        if (Array.isArray(desktopDefinition.intents)) {
            appConfig.intents = (config.intents || []).concat(desktopDefinition.intents);
        }
        return appConfig;
    }
}

const decoders$1 = {
    common: {
        nonEmptyStringDecoder: nonEmptyStringDecoder$1,
        nonNegativeNumberDecoder: nonNegativeNumberDecoder$1
    },
    fdc3: {
        allDefinitionsDecoder,
        v1DefinitionDecoder,
        v2DefinitionDecoder
    }
};

var INTENTS_ERRORS;
(function (INTENTS_ERRORS) {
    INTENTS_ERRORS["USER_CANCELLED"] = "User Closed Intents Resolver UI without choosing a handler";
    INTENTS_ERRORS["CALLER_NOT_DEFINED"] = "Caller Id is not defined";
    INTENTS_ERRORS["TIMEOUT_HIT"] = "Timeout hit";
    INTENTS_ERRORS["INTENT_NOT_FOUND"] = "Cannot find Intent";
    INTENTS_ERRORS["HANDLER_NOT_FOUND"] = "Cannot find Intent Handler";
    INTENTS_ERRORS["TARGET_INSTANCE_UNAVAILABLE"] = "Cannot start Target Instance";
    INTENTS_ERRORS["INTENT_DELIVERY_FAILED"] = "Target Instance did not add a listener";
    INTENTS_ERRORS["RESOLVER_UNAVAILABLE"] = "Intents Resolver UI unavailable";
    INTENTS_ERRORS["RESOLVER_TIMEOUT"] = "User did not choose a handler";
    INTENTS_ERRORS["INVALID_RESOLVER_RESPONSE"] = "Intents Resolver UI returned invalid response";
    INTENTS_ERRORS["INTENT_HANDLER_REJECTION"] = "Intent Handler function processing the raised intent threw an error or rejected the promise it returned";
})(INTENTS_ERRORS || (INTENTS_ERRORS = {}));

let IoC$1 = class IoC {
    _fdc3;
    _decoders = decoders$1;
    _errors = {
        intents: INTENTS_ERRORS
    };
    get fdc3() {
        if (!this._fdc3) {
            this._fdc3 = new FDC3Service().toApi();
        }
        return this._fdc3;
    }
    get decoders() {
        return this._decoders;
    }
    get errors() {
        return this._errors;
    }
};

const ioc = new IoC$1();
ioc.fdc3;
const decoders = ioc.decoders;
ioc.errors;

const nonEmptyStringDecoder = decoders.common.nonEmptyStringDecoder;
const nonNegativeNumberDecoder = decoders.common.nonNegativeNumberDecoder;
const functionCheck = (input, propDescription) => {
    const providedType = typeof input;
    return providedType === "function" ?
        anyJson$1() :
        fail(`The provided argument as ${propDescription} should be of type function, provided: ${typeof providedType}`);
};
const dialogsTemplateConfigDecoder = object$1({
    name: nonEmptyStringDecoder,
    Dialog: anyJson$1().andThen((result) => functionCheck(result, "Dialog")),
    validate: anyJson$1().andThen((result) => functionCheck(result, "validate"))
});
const configDecoder = object$1({
    rootElement: anyJson$1(),
    alerts: optional$1(object$1({
        enabled: boolean$1()
    })),
    dialogs: optional$1(object$1({
        enabled: boolean$1(),
        templates: optional$1(array$1(dialogsTemplateConfigDecoder))
    })),
});
const alertsInteropSettingsDecoder = object$1({
    method: nonEmptyStringDecoder,
    arguments: optional$1(anyJson$1()),
    target: optional$1(oneOf$1(constant$1("best"), constant$1("all"), nonEmptyStringDecoder))
});
const alertsOpenConfigDecoder = object$1({
    variant: oneOf$1(constant$1("default"), constant$1("success"), constant$1("critical"), constant$1("info"), constant$1("warning")),
    text: nonEmptyStringDecoder,
    showCloseButton: optional$1(boolean$1()),
    clickInterop: optional$1(alertsInteropSettingsDecoder),
    onCloseInterop: optional$1(alertsInteropSettingsDecoder),
    actions: optional$1(array$1(object$1({
        id: nonEmptyStringDecoder,
        title: nonEmptyStringDecoder,
        clickInterop: alertsInteropSettingsDecoder
    }))),
    data: optional$1(anyJson$1()),
    onClose: anyJson$1().andThen((result) => functionCheck(result, "onClose")),
    onClick: anyJson$1().andThen((result) => functionCheck(result, "onClick"))
});
const alertsCloseConfigDecoder = object$1({
    id: nonEmptyStringDecoder
});
const dialogsSizeDecoder = object$1({
    width: nonNegativeNumberDecoder,
    height: nonNegativeNumberDecoder
});
const dialogsOnCompletionDecoder = anyJson$1().andThen((result) => functionCheck(result, "onCompletion"));
const dialogsOpenConfigDecoder = object$1({
    templateName: nonEmptyStringDecoder,
    onCompletion: dialogsOnCompletionDecoder,
    size: optional$1(dialogsSizeDecoder),
    variables: anyJson$1()
});
const dialogsCloseConfigDecoder = object$1({
    id: nonEmptyStringDecoder
});
const dialogsActionButton = object$1({
    autofocus: optional$1(boolean$1()),
    id: nonEmptyStringDecoder,
    text: nonEmptyStringDecoder,
    variant: oneOf$1(constant$1("default"), constant$1("primary"), constant$1("critical"), constant$1("outline"), constant$1("link"))
});
const dialogsInputValidation = object$1({
    disabledButtonIds: array$1(nonEmptyStringDecoder),
    errorMessage: nonEmptyStringDecoder,
    regexPattern: nonEmptyStringDecoder
});
const noInputsConfirmationDialogVariablesDecoder = object$1({
    actionButtons: array$1(dialogsActionButton),
    heading: string$1(),
    text: string$1(),
    title: optional$1(string$1())
});
const noInputsConfirmationDialogDecoder = object$1({
    templateName: constant$1("noInputsConfirmationDialog"),
    onCompletion: dialogsOnCompletionDecoder,
    size: optional$1(dialogsSizeDecoder),
    variables: noInputsConfirmationDialogVariablesDecoder
});
const singleCheckboxDialogVariablesDecoder = object$1({
    actionButtons: array$1(dialogsActionButton),
    checkbox: object$1({
        id: nonEmptyStringDecoder,
        initialValue: optional$1(boolean$1()),
        label: optional$1(string$1())
    }),
    heading: string$1(),
    text: string$1(),
    title: optional$1(string$1())
});
const singleCheckboxDialogDecoder = object$1({
    templateName: constant$1("singleCheckboxDialog"),
    onCompletion: dialogsOnCompletionDecoder,
    size: optional$1(dialogsSizeDecoder),
    variables: singleCheckboxDialogVariablesDecoder
});
const singleTextInputDialogVariablesDecoder = object$1({
    actionButtons: array$1(dialogsActionButton),
    heading: string$1(),
    input: object$1({
        id: nonEmptyStringDecoder,
        initialValue: optional$1(string$1()),
        label: optional$1(string$1()),
        placeholder: optional$1(string$1()),
        validation: optional$1(dialogsInputValidation)
    }),
    title: optional$1(string$1())
});
const singleTextInputDialogDecoder = object$1({
    templateName: constant$1("singleTextInputDialog"),
    onCompletion: dialogsOnCompletionDecoder,
    size: optional$1(dialogsSizeDecoder),
    variables: singleTextInputDialogVariablesDecoder
});

/* @ts-self-types="./index.d.ts" */
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
let nanoid = (size = 21) => {
  let id = '';
  let i = size | 0;
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id
};

class AlertsController {
    config;
    glueController;
    messagePort;
    logger;
    openedAlerts = [];
    constructor(config, glueController, messagePort) {
        this.config = config;
        this.glueController = glueController;
        this.messagePort = messagePort;
        this.logger = glueController.getLogger(`modals-ui.alerts.controller-${glueController.clientId}`);
        messagePort.subscribe((event) => {
            const alert = this.getAlertById(event.data.id);
            if (!alert) {
                this.logger.warn(`Can not close alert with ID ${event.data.id} because it is not open.`);
                return;
            }
            if (event.data.interopAction) {
                alert.config.onClick({ interopAction: event.data.interopAction });
            }
            if (event.data.shouldCloseAlert) {
                alert.config.onClose();
            }
        });
    }
    exposeAPI() {
        return {
            open: this.open.bind(this),
            close: this.close.bind(this)
        };
    }
    open(config) {
        if (!this.config?.enabled) {
            throw new Error("Unable to execute open command because alerts are not enabled.");
        }
        this.logger.trace(`open command was invoked with config: ${JSON.stringify(config)}.`);
        const validatedConfig = alertsOpenConfigDecoder.runWithException(config);
        const id = nanoid(10);
        const { onClick, onClose, ...messageConfig } = validatedConfig;
        const message = {
            id,
            config: messageConfig
        };
        this.openedAlerts.forEach((alert) => alert.config.onClose());
        this.messagePort.postMessage(message);
        this.openedAlerts.push({ id, config: validatedConfig });
        return { id };
    }
    close(config) {
        if (!this.config?.enabled) {
            throw new Error("Unable to execute close command because alerts are not enabled.");
        }
        this.logger.trace(`close command was invoked with config: ${JSON.stringify(config)}.`);
        const validatedConfig = alertsCloseConfigDecoder.runWithException(config);
        const alert = this.getAlertById(validatedConfig.id);
        if (!alert) {
            this.logger.warn(`There is no open alert with ID ${validatedConfig.id}.`);
            return;
        }
        const lastAlert = this.openedAlerts[this.openedAlerts.length - 1];
        if (alert === lastAlert) {
            this.messagePort.postMessage(null);
        }
        this.openedAlerts = this.openedAlerts.filter((alert) => alert.id !== validatedConfig.id);
    }
    getAlertById(id) {
        return this.openedAlerts.find((alert) => alert.id === id);
    }
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=i__default,k$1=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m$1=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
function q$1(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m$1.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k$1,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q$1;reactJsxRuntime_production_min.jsxs=q$1;

{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}

var jsxRuntimeExports = jsxRuntime.exports;

var propTypes = {exports: {}};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = ReactPropTypesSecret_1;

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  propTypes.exports = factoryWithThrowingShims();
}

var propTypesExports = propTypes.exports;

const extractErrorMsg = (error) => {
    const errorMessage = error.message ? JSON.stringify(error.message) : JSON.stringify(error);
    const stringError = typeof error === "string" ? error : errorMessage;
    return stringError;
};

const useIOConnectInit = (settings, onInitError) => {
    const [io, setIOConnect] = useState(null);
    useEffect(() => {
        const initialize = async () => {
            try {
                if (settings.browser && settings.browserPlatform) {
                    throw new Error("Cannot initialize, because the settings are over-specified: defined are both browser and browserPlatform. Please set one or the other");
                }
                const isDesktop = (typeof window.glue42gd !== "undefined") || (typeof window.iodesktop !== "undefined");
                if (isDesktop) {
                    const factory = settings.desktop?.factory || settings.browser?.factory || settings.browserPlatform?.factory || window.Glue;
                    const config = settings.desktop?.config || settings.browser?.config || settings.browserPlatform?.config;
                    const factoryResult = await factory(config);
                    setIOConnect(factoryResult.io || factoryResult.glue || factoryResult);
                    return;
                }
                const config = settings.browser?.config || settings.browserPlatform?.config;
                const factory = settings.browser?.factory || settings.browserPlatform?.factory || window.IOBrowser || window.IOBrowserPlatform;
                const factoryResult = await factory(config);
                setIOConnect(factoryResult.io || factoryResult.glue || factoryResult);
            }
            catch (error) {
                console.error(error);
                onInitError?.(error instanceof Error ? error : new Error(extractErrorMsg(error)));
            }
        };
        initialize();
    }, []);
    return io;
};

const IOConnectContext = createContext(null);
const IOConnectProvider = memo(({ children, fallback = null, settings = {}, onInitError }) => {
    const glue = useIOConnectInit(settings, onInitError);
    return glue ? (i__default.createElement(IOConnectContext.Provider, { value: glue }, children)) : (i__default.createElement(i__default.Fragment, null, fallback));
});
IOConnectProvider.propTypes = {
    children: propTypesExports.node,
    settings: propTypesExports.object,
    fallback: propTypesExports.node,
};
IOConnectProvider.displayName = 'IOConnectProvider';

function w(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var b,C={exports:{}};
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/b=C,function(){var e={}.hasOwnProperty;function t(){for(var e="",t=0;t<arguments.length;t++){var o=arguments[t];o&&(e=i(e,n(o)));}return e}function n(n){if("string"==typeof n||"number"==typeof n)return n;if("object"!=typeof n)return "";if(Array.isArray(n))return t.apply(null,n);if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]"))return n.toString();var o="";for(var r in n)e.call(n,r)&&n[r]&&(o=i(o,r));return o}function i(e,t){return t?e?e+" "+t:e+t:e}b.exports?(t.default=t,b.exports=t):window.classNames=t;}();var k=w(C.exports);function N({className:t,size:n="16",variant:i="workspace",...o}){const r=k("icon",n&&[`icon-size-${n}`],t);return jsxRuntimeExports.jsx("span",{className:r,"aria-label":`icon-${i}`,role:"presentation",...o,children:jsxRuntimeExports.jsx("i",{className:`icon-${i}`})})}const S=forwardRef(({className:t,variant:n="default",icon:i="workspace",size:o="16",tooltip:a,iconSize:s="16",onClick:l,disabled:c,children:u,...d},f)=>{const m=k("io-btn-icon","default"!==n&&[`io-btn-icon-${n}`],[`io-btn-icon-size-${o}`],t),h=useCallback(e=>{if(!c)return l?l(e):void 0;e.preventDefault();},[l,c]);return jsxRuntimeExports.jsx("button",{className:m,type:"button",ref:f,"aria-label":"icon button","aria-disabled":c,title:a,onClick:h,disabled:c,...d,children:u??(i&&jsxRuntimeExports.jsx(N,{variant:i,size:s}))})});S.displayName="ButtonIcon";const D={default:void 0,info:"info",success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function x({className:n,variant:i="default",size:o="normal",text:r,close:a=false,closeButtonOnClick:s,append:l,...c}){const u=k("io-alert",`io-alert-${i}`,"large"===o&&"io-alert-lg",n),d=D[i];return jsxRuntimeExports.jsxs("div",{"data-testid":"io-alert",className:u,role:"alert","aria-label":"alert",...c,children:[d&&jsxRuntimeExports.jsx(N,{"data-testid":"io-alert-icon",variant:d,className:"icon-severity"}),r&&jsxRuntimeExports.jsx("p",{"data-testid":"io-alert-text",className:"io-text-smaller",children:r}),"large"===o&&l,a&&jsxRuntimeExports.jsx(S,{"data-testid":"io-alert-close-button",className:"ms-auto",size:"16",iconSize:"10",icon:"close",onClick:s})]})}function E({className:t,variant:n="default",children:i,...o}){const r=k("io-badge","default"!==n&&[`io-badge-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:i})}function I({className:t,tag:n="h2",size:i="normal",text:o="Title",...r}){const a=n,s=k("small"===i&&"io-title-semibold","normal"===i&&"io-title","large"===i&&"io-title-large",t);return jsxRuntimeExports.jsx(a,{className:s,...r,children:o})}function M({className:n,title:i,titleSize:o="normal",tag:r,hint:a,children:s,...l}){const c=k("io-block",n),u=i?"block-title":void 0;return jsxRuntimeExports.jsxs("section",{className:c,"aria-label":i?void 0:"Block","aria-labelledby":u,...l,children:[i&&jsxRuntimeExports.jsx(I,{id:u,tag:r,text:i,size:o}),s,a&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:a})]})}const T=e=>"Enter"===e.key||" "===e.key,A=forwardRef(({className:n,variant:i="default",size:o="normal",icon:a,iconSize:s="12",iconRight:l=false,text:c,onClick:u,disabled:d,children:f,...m},h)=>{const p=k("io-btn",("primary"===i||"critical"===i||"outline"===i||"link"===i)&&[`io-btn-${i}`],"large"===o&&"io-btn-lg",n),g=useCallback(e=>{if(!d)return u?u(e):void 0;e.preventDefault();},[u,d]),v=useCallback(e=>{d||T(e)&&(e.preventDefault(),g(e));},[g,d]);return jsxRuntimeExports.jsxs("button",{className:p,ref:h,type:"button","aria-disabled":d,onClick:g,onKeyDown:v,disabled:d,tabIndex:0,...m,children:[a&&!l&&jsxRuntimeExports.jsx(N,{variant:a,size:s}),f??c,a&&l&&jsxRuntimeExports.jsx(N,{variant:a,size:s})]})});A.displayName="Button";const P=createContext({}),O=forwardRef(({icon:t="chevron-down",onClick:n,onKeyDown:i,...o},a)=>{const{handleToggle:l,disabled:c,setTriggerRef:u}=useContext(P),d=useCallback(e=>{u?.(e),a&&("function"==typeof a?a(e):a.current=e);},[a,u]),f=useCallback(e=>{e.stopPropagation(),n?.(e),e.defaultPrevented||l?.();},[n,l]),m=useCallback(e=>{i?.(e),e.defaultPrevented||T(e)&&(e.preventDefault(),e.stopPropagation(),l?.());},[i,l]);return jsxRuntimeExports.jsx(A,{icon:t,iconRight:true,onClick:f,onKeyDown:m,disabled:c,ref:d,...o})});O.displayName="DropdownButton";const L=forwardRef(({size:t="32",onClick:n,onKeyDown:i,...o},a)=>{const{handleToggle:l,disabled:c,setTriggerRef:u}=useContext(P),d=useCallback(e=>{u?.(e),a&&("function"==typeof a?a(e):a.current=e);},[a,u]),f=useCallback(e=>{e.stopPropagation(),n?.(e),e.defaultPrevented||l?.();},[n,l]),m=useCallback(e=>{i?.(e),e.defaultPrevented||T(e)&&(e.preventDefault(),e.stopPropagation(),l?.());},[i,l]);return jsxRuntimeExports.jsx(S,{size:t,onClick:f,onKeyDown:m,disabled:c,ref:d,...o})});function F({className:t,...n}){const i=k("io-dropdown-content",t);return jsxRuntimeExports.jsx("div",{className:i,...n})}L.displayName="DropdownButtonIcon";const B=createContext({}),R=forwardRef((n,i)=>{const{className:o,prepend:r,append:a,isSelected:l,onClick:c,description:u,disabled:d=false,children:f,tooltip:m,...h}=n,{variant:p="default",selected:g,checkIcon:v,handleItemClick:y}=useContext(B),w=l??g?.some(e=>e.children===f),b="default"!==p&&!!v,C=b||r,S=k("io-list-item",C&&"io-list-item-left",a&&"io-list-item-right","default"!==p&&w&&"selected",u&&"io-list-item-description",d&&"io-list-item-disabled",o);return jsxRuntimeExports.jsxs("li",{className:S,ref:i,role:"menuitem","aria-roledescription":"menuitem",tabIndex:0,onClick:e=>{d?e.preventDefault():(y?.(e,{children:f}),c?.(e));},...h,children:[C&&jsxRuntimeExports.jsxs("div",{className:"io-list-left-column",children:[b&&jsxRuntimeExports.jsx(N,{variant:v.variant,title:w?v.tooltip:void 0}),r]}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:m,"data-testid":"list-item-title",children:f}),a&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:a}),u&&jsxRuntimeExports.jsx("div",{className:"io-list-text-description",children:u})]})});R.displayName="ListItem";const _=forwardRef(({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-title",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,"data-testid":"list-item-title",children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})});_.displayName="ListItemTitle";const H=forwardRef(({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-section",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})});H.displayName="ListItemSection";const j=forwardRef(({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item-header",n);return jsxRuntimeExports.jsxs("div",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})});j.displayName="ListItemHeader";const z=forwardRef(({className:t,children:n,...i},o)=>{const r=k("io-list-item","io-list-with-sub-items",t);return jsxRuntimeExports.jsx("li",{className:r,ref:o,...i,children:n})});z.displayName="ListItemWithSubItems";const $=forwardRef((t,n)=>{const{className:i,variant:o="default",checkIcon:a,children:s,...u}=t,[d,f]=useState([]),m=k("io-list","default"!==o&&"io-list-selectable",i),h=useMemo(()=>{if(a)return "object"==typeof a?a:{variant:a}},[a]),p=useCallback((e,t)=>{if("default"===o)return;const n=d.some(e=>e.children?.toString()===t.children?.toString());"single"===o?f([t]):(()=>{const e=n?d.filter(e=>e.children!==t.children):[...d,t];f(e);})();},[d,o]),g=useMemo(()=>({variant:o,selected:d,checkIcon:h,handleItemClick:p}),[o,d,h,p]);return jsxRuntimeExports.jsx(B.Provider,{value:g,children:jsxRuntimeExports.jsx("ul",{className:m,ref:n,...u,children:s})})});$.displayName="List";const V=$;V.Item=R,V.ItemTitle=_,V.ItemSection=H,V.ItemHeader=j,V.ItemWithSubItems=z;const Y=forwardRef((t,n)=>jsxRuntimeExports.jsx(V,{...t,ref:n}));Y.displayName="DropdownList";const U=forwardRef((t,n)=>{const{handleClose:i}=useContext(P),{onClick:o,onKeyDown:a,...l}=t,c=useRef(null),d=useCallback(e=>{c.current=e,"function"==typeof n?n(e):n&&(n.current=e);},[n]);return jsxRuntimeExports.jsx(R,{...l,ref:d,onClick:e=>{o?.(e),i?.();},onKeyDown:e=>{if(a?.(e),e.defaultPrevented||!T(e))return;e.preventDefault(),e.stopPropagation();const t=("function"==typeof n?null:n?.current)||c.current;t?.click();}})});U.displayName="DropdownItem";const W=forwardRef((t,n)=>jsxRuntimeExports.jsx(_,{...t,ref:n}));W.displayName="DropdownItemTitle";const K=forwardRef((t,n)=>jsxRuntimeExports.jsx(H,{...t,ref:n}));function J({className:t,...n}){const i=k("io-separator",t);return jsxRuntimeExports.jsx("hr",{className:i,...n})}K.displayName="DropdownItemSection";const q=forwardRef((t,n)=>jsxRuntimeExports.jsx(J,{...t}));q.displayName="DropdownSeparator";function G(e,t){const n=useCallback(n=>{const i=t.some(e=>n.key===e);i&&(n.preventDefault(),e());},[e,t]);useEffect(()=>(document.addEventListener("keydown",n),()=>{document.removeEventListener("keydown",n);}),[n]);}const Q=forwardRef(({className:t,variant:n="outline",align:i="down",disabled:o,isOpen:a,onOpenChange:s,children:f,...m},h)=>{const p=useRef(null),g=useRef(null),v=h??p,{isOpen:y,handleOpen:w,handleClose:b}=((e,t)=>{const[n,i]=useState(false),o=void 0!==e,a=o?e:n,s=useCallback(e=>{o||i(e),t?.(e);},[o,t]),c=useCallback(()=>s(true),[s]),u=useCallback(()=>s(false),[s]);return {isOpen:a,setOpen:s,handleOpen:c,handleClose:u}})(a,s);((e,t,n=true)=>{useEffect(()=>{if(!n)return;const i=n=>{const i=n.target;i&&e.current&&!e.current.contains(i)&&(n.composedPath&&n.composedPath().some(t=>t===e.current||e.current&&t.nodeType===Node.ELEMENT_NODE&&e.current.contains(t))||t());},o=requestAnimationFrame(()=>{document.addEventListener("mousedown",i,true);});return ()=>{cancelAnimationFrame(o),document.removeEventListener("mousedown",i,true);}},[e,t,n]);})(v,b,y),G(()=>{y&&b();},["Escape"]),G(()=>{y||o||g.current!==document.activeElement||w();},["ArrowDown","ArrowUp"]);const C=useMemo(()=>({variant:n,align:i,disabled:o,isOpen:y,handleOpen:w,handleClose:b,handleToggle:y?b:w,setTriggerRef:e=>g.current=e}),[n,i,o,y,w,b]),N=k("io-dropdown",y&&"io-dropdown-open","default"!==n&&`io-dropdown-${n}`,t);return jsxRuntimeExports.jsx(P.Provider,{value:C,children:jsxRuntimeExports.jsx("div",{className:N,ref:v,...m,children:f})})});function X({className:t,variant:n="default",align:i="left",children:o,...r}){const a=k("io-btn-group","default"!==n&&`io-btn-group-${n}`,"right"===i&&"io-btn-group-right",t);return jsxRuntimeExports.jsx("div",{className:a,"data-testid":"button-group",...r,children:o})}function Z({className:t,draggable:n=false,children:i,...o}){const r=k("io-header",n&&["draggable"],t);return jsxRuntimeExports.jsx("header",{className:r,...o,children:i})}function ee({className:t,children:n,...i}){const o=k("io-dialog-header",t);return jsxRuntimeExports.jsx(Z,{"data-testid":"io-dialog-header",className:o,...i,children:n})}function te({className:t,children:n,...i}){const o=k("io-dialog-body",t);return jsxRuntimeExports.jsx("div",{"data-testid":"io-dialog-body",className:o,...i,children:n})}function ne({className:t,children:n,...i}){const o=k("io-footer",t);return jsxRuntimeExports.jsx("footer",{className:o,...i,children:n})}function ie({className:t,...n}){const i=k("io-dialog-footer",t);return jsxRuntimeExports.jsx(ne,{"data-testid":"io-dialog-footer",className:i,...n})}function oe({className:n,variant:i="default",title:o="Dialog Title",isOpen:r=false,draggable:a=false,closeFn:s,children:l,...c}){const d=useRef(null),m=k("io-dialog","centered"===i&&"io-dialog-center",n);return useLayoutEffect(()=>{const e=d?.current;e&&(r?e.showModal():"function"==typeof e.close&&e.close());},[r]),jsxRuntimeExports.jsxs("dialog",{"data-testid":"io-dialog",className:m,ref:d,"data-modal":true,onClose:()=>{r&&s&&s();},onClick:e=>{r&&s&&"DIALOG"===e.target.nodeName&&s();},onKeyDown:e=>{const t=e.target instanceof HTMLDialogElement&&"DIALOG"===e.target.nodeName;r&&s&&" "===e.key&&t&&s();},...c,children:[jsxRuntimeExports.jsxs(ee,{draggable:a,children:[jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-title",children:o}),jsxRuntimeExports.jsx(X,{children:jsxRuntimeExports.jsx(S,{className:"non-draggable","data-testid":"io-dialog-close-button",size:"24",icon:"close",iconSize:"12",onClick:s,tabIndex:-1})})]}),l]})}function re(){return "undefined"!=typeof window}function ae(e){return ce(e)?(e.nodeName||"").toLowerCase():"#document"}function se(e){var t;return (null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function le(e){var t;return null==(t=(ce(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function ce(e){return !!re()&&(e instanceof Node||e instanceof se(e).Node)}function ue(e){return !!re()&&(e instanceof Element||e instanceof se(e).Element)}function de(e){return !!re()&&(e instanceof HTMLElement||e instanceof se(e).HTMLElement)}function fe(e){return !(!re()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof se(e).ShadowRoot)}Q.Button=O,Q.ButtonIcon=L,Q.Content=F,Q.List=Y,Q.Item=U,Q.ItemTitle=W,Q.ItemSection=K,Q.Separator=q,X.Button=A,X.ButtonIcon=S,X.Dropdown=Q,Z.Title=I,Z.ButtonGroup=X,Z.Button=A,Z.ButtonIcon=S,Z.Dropdown=Q,ee.Title=I,ee.ButtonGroup=X,ee.Button=A,ee.ButtonIcon=S,ee.Dropdown=Q,te.Content=function({className:t,children:n,...i}){const o=k("io-dialog-content",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})},ne.ButtonGroup=X,ne.Button=A,ne.ButtonIcon=S,ne.Dropdown=Q,ie.ButtonGroup=X,ie.Button=A,ie.ButtonIcon=S,ie.Dropdown=Q,oe.Header=ee,oe.Body=te,oe.Footer=ie;const me=new Set(["inline","contents"]);function he(e){const{overflow:t,overflowX:n,overflowY:i,display:o}=xe(e);return /auto|scroll|overlay|hidden|clip/.test(t+i+n)&&!me.has(o)}const pe=new Set(["table","td","th"]);function ge(e){return pe.has(ae(e))}const ve=[":popover-open",":modal"];function ye(e){return ve.some(t=>{try{return e.matches(t)}catch(e){return  false}})}const we=["transform","translate","scale","rotate","perspective"],be=["transform","translate","scale","rotate","perspective","filter"],Ce=["paint","layout","strict","content"];function ke(e){const t=Ne(),n=ue(e)?xe(e):e;return we.some(e=>!!n[e]&&"none"!==n[e])||!!n.containerType&&"normal"!==n.containerType||!t&&!!n.backdropFilter&&"none"!==n.backdropFilter||!t&&!!n.filter&&"none"!==n.filter||be.some(e=>(n.willChange||"").includes(e))||Ce.some(e=>(n.contain||"").includes(e))}function Ne(){return !("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}const Se=new Set(["html","body","#document"]);function De(e){return Se.has(ae(e))}function xe(e){return se(e).getComputedStyle(e)}function Ee(e){return ue(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Ie(e){if("html"===ae(e))return e;const t=e.assignedSlot||e.parentNode||fe(e)&&e.host||le(e);return fe(t)?t.host:t}function Me(e){const t=Ie(e);return De(t)?e.ownerDocument?e.ownerDocument.body:e.body:de(t)&&he(t)?t:Me(t)}function Te(e,t,n){var i;void 0===t&&(t=[]),void 0===n&&(n=true);const o=Me(e),r=o===(null==(i=e.ownerDocument)?void 0:i.body),a=se(o);if(r){const e=Ae(a);return t.concat(a,a.visualViewport||[],he(o)?o:[],e&&n?Te(e):[])}return t.concat(o,Te(o,[],n))}function Ae(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Pe(e){let t=e.activeElement;for(;null!=(null==(n=t)||null==(n=n.shadowRoot)?void 0:n.activeElement);){var n;t=t.shadowRoot.activeElement;}return t}function Oe(e,t){if(!e||!t)return  false;const n=null==t.getRootNode?void 0:t.getRootNode();if(e.contains(t))return  true;if(n&&fe(n)){let n=t;for(;n;){if(e===n)return  true;n=n.parentNode||n.host;}}return  false}function Le(){const e=navigator.userAgentData;return null!=e&&e.platform?e.platform:navigator.platform}function Fe(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map(e=>{let{brand:t,version:n}=e;return t+"/"+n}).join(" "):navigator.userAgent}function Be(e){return !(0!==e.mozInputSource||!e.isTrusted)||(He()&&e.pointerType?"click"===e.type&&1===e.buttons:0===e.detail&&!e.pointerType)}function Re(e){return !Fe().includes("jsdom/")&&(!He()&&0===e.width&&0===e.height||He()&&1===e.width&&1===e.height&&0===e.pressure&&0===e.detail&&"mouse"===e.pointerType||e.width<1&&e.height<1&&0===e.pressure&&0===e.detail&&"touch"===e.pointerType)}function _e(){return /apple/i.test(navigator.vendor)}function He(){const e=/android/i;return e.test(Le())||e.test(Fe())}function je(e,t){const n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function ze(e){return (null==e?void 0:e.ownerDocument)||document}function $e(e,t){if(null==t)return  false;if("composedPath"in e)return e.composedPath().includes(t);const n=e;return null!=n.target&&t.contains(n.target)}function Ve(e){return "composedPath"in e?e.composedPath()[0]:e.target}function Ye(e){return de(e)&&e.matches("input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])")}function Ue(e){e.preventDefault(),e.stopPropagation();}function We(e){return !!e&&("combobox"===e.getAttribute("role")&&Ye(e))}const Ke=Math.min,Je=Math.max,qe=Math.round,Ge=Math.floor,Qe=e=>({x:e,y:e}),Xe={left:"right",right:"left",bottom:"top",top:"bottom"},Ze={start:"end",end:"start"};function et(e,t,n){return Je(e,Ke(t,n))}function tt(e,t){return "function"==typeof e?e(t):e}function nt(e){return e.split("-")[0]}function it(e){return e.split("-")[1]}function ot(e){return "x"===e?"y":"x"}function rt(e){return "y"===e?"height":"width"}const at=new Set(["top","bottom"]);function st(e){return at.has(nt(e))?"y":"x"}function lt(e){return ot(st(e))}function ct(e){return e.replace(/start|end/g,e=>Ze[e])}const ut=["left","right"],dt=["right","left"],ft=["top","bottom"],mt=["bottom","top"];function ht(e,t,n,i){const o=it(e);let r=function(e,t,n){switch(e){case "top":case "bottom":return n?t?dt:ut:t?ut:dt;case "left":case "right":return t?ft:mt;default:return []}}(nt(e),"start"===n,i);return o&&(r=r.map(e=>e+"-"+o),t&&(r=r.concat(r.map(ct)))),r}function pt(e){return e.replace(/left|right|bottom|top/g,e=>Xe[e])}function gt(e){const{x:t,y:n,width:i,height:o}=e;return {width:i,height:o,top:n,left:t,right:t+i,bottom:n+o,x:t,y:n}}
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var vt=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"].join(","),yt="undefined"==typeof Element,wt=yt?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,bt=!yt&&Element.prototype.getRootNode?function(e){var t;return null==e||null===(t=e.getRootNode)||void 0===t?void 0:t.call(e)}:function(e){return null==e?void 0:e.ownerDocument},Ct=function e(t,n){var i;void 0===n&&(n=true);var o=null==t||null===(i=t.getAttribute)||void 0===i?void 0:i.call(t,"inert");return ""===o||"true"===o||n&&t&&e(t.parentNode)},kt=function e(t,n,i){for(var o=[],r=Array.from(t);r.length;){var a=r.shift();if(!Ct(a,false))if("SLOT"===a.tagName){var s=a.assignedElements(),l=e(s.length?s:a.children,true,i);i.flatten?o.push.apply(o,l):o.push({scopeParent:a,candidates:l});}else {wt.call(a,vt)&&i.filter(a)&&(n||!t.includes(a))&&o.push(a);var c=a.shadowRoot||"function"==typeof i.getShadowRoot&&i.getShadowRoot(a),u=!Ct(c,false)&&(!i.shadowRootFilter||i.shadowRootFilter(a));if(c&&u){var d=e(true===c?a.children:c.children,true,i);i.flatten?o.push.apply(o,d):o.push({scopeParent:a,candidates:d});}else r.unshift.apply(r,a.children);}}return o},Nt=function(e){return !isNaN(parseInt(e.getAttribute("tabindex"),10))},St=function(e){if(!e)throw new Error("No node provided");return e.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||function(e){var t,n=null==e||null===(t=e.getAttribute)||void 0===t?void 0:t.call(e,"contenteditable");return ""===n||"true"===n}(e))&&!Nt(e)?0:e.tabIndex},Dt=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},xt=function(e){return "INPUT"===e.tagName},Et=function(e){return function(e){return xt(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return  true;var t,n=e.form||bt(e),i=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=i(window.CSS.escape(e.name));else try{t=i(e.name);}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),false}var o=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return !o||o===e}(e)},It=function(e){var t=e.getBoundingClientRect(),n=t.width,i=t.height;return 0===n&&0===i},Mt=function(e,t){var n=t.displayCheck,i=t.getShadowRoot;if("hidden"===getComputedStyle(e).visibility)return  true;var o=wt.call(e,"details>summary:first-of-type")?e.parentElement:e;if(wt.call(o,"details:not([open]) *"))return  true;if(n&&"full"!==n&&"legacy-full"!==n){if("non-zero-area"===n)return It(e)}else {if("function"==typeof i){for(var r=e;e;){var a=e.parentElement,s=bt(e);if(a&&!a.shadowRoot&&true===i(a))return It(e);e=e.assignedSlot?e.assignedSlot:a||s===e.ownerDocument?a:s.host;}e=r;}if(function(e){var t,n,i,o,r=e&&bt(e),a=null===(t=r)||void 0===t?void 0:t.host,s=false;if(r&&r!==e)for(s=!!(null!==(n=a)&&void 0!==n&&null!==(i=n.ownerDocument)&&void 0!==i&&i.contains(a)||null!=e&&null!==(o=e.ownerDocument)&&void 0!==o&&o.contains(e));!s&&a;){var l,c,u;s=!(null===(c=a=null===(l=r=bt(a))||void 0===l?void 0:l.host)||void 0===c||null===(u=c.ownerDocument)||void 0===u||!u.contains(a));}return s}(e))return !e.getClientRects().length;if("legacy-full"!==n)return  true}return  false},Tt=function(e,t){return !(t.disabled||Ct(t)||function(e){return xt(e)&&"hidden"===e.type}(t)||Mt(t,e)||function(e){return "DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some(function(e){return "SUMMARY"===e.tagName})}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var i=t.children.item(n);if("LEGEND"===i.tagName)return !!wt.call(t,"fieldset[disabled] *")||!i.contains(e)}return  true}t=t.parentElement;}return  false}(t))},At=function(e,t){return !(Et(t)||St(t)<0||!Tt(e,t))},Pt=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return !!(isNaN(t)||t>=0)},Ot=function e(t){var n=[],i=[];return t.forEach(function(t,o){var r=!!t.scopeParent,a=r?t.scopeParent:t,s=function(e,t){var n=St(e);return n<0&&t&&!Nt(e)?0:n}(a,r),l=r?e(t.candidates):a;0===s?r?n.push.apply(n,l):n.push(a):i.push({documentOrder:o,tabIndex:s,item:t,isScope:r,content:l});}),i.sort(Dt).reduce(function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e},[]).concat(n)},Lt=function(e,t){var n;return n=(t=t||{}).getShadowRoot?kt([e],t.includeContainer,{filter:At.bind(null,t),flatten:false,getShadowRoot:t.getShadowRoot,shadowRootFilter:Pt}):function(e,t,n){if(Ct(e))return [];var i=Array.prototype.slice.apply(e.querySelectorAll(vt));return t&&wt.call(e,vt)&&i.unshift(e),i.filter(n)}(e,t.includeContainer,At.bind(null,t)),Ot(n)};function Ft(e,t,n){let{reference:i,floating:o}=e;const r=st(t),a=lt(t),s=rt(a),l=nt(t),c="y"===r,u=i.x+i.width/2-o.width/2,d=i.y+i.height/2-o.height/2,f=i[s]/2-o[s]/2;let m;switch(l){case "top":m={x:u,y:i.y-o.height};break;case "bottom":m={x:u,y:i.y+i.height};break;case "right":m={x:i.x+i.width,y:d};break;case "left":m={x:i.x-o.width,y:d};break;default:m={x:i.x,y:i.y};}switch(it(t)){case "start":m[a]-=f*(n&&c?-1:1);break;case "end":m[a]+=f*(n&&c?-1:1);}return m}async function Bt(e,t){var n;void 0===t&&(t={});const{x:i,y:o,platform:r,rects:a,elements:s,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:f=false,padding:m=0}=tt(t,e),h=function(e){return "number"!=typeof e?function(e){return {top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}(m),p=s[f?"floating"===d?"reference":"floating":d],g=gt(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(p)))||n?p:p.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:c,rootBoundary:u,strategy:l})),v="floating"===d?{x:i,y:o,width:a.floating.width,height:a.floating.height}:a.reference,y=await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),w=await(null==r.isElement?void 0:r.isElement(y))&&await(null==r.getScale?void 0:r.getScale(y))||{x:1,y:1},b=gt(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:v,offsetParent:y,strategy:l}):v);return {top:(g.top-b.top+h.top)/w.y,bottom:(b.bottom-g.bottom+h.bottom)/w.y,left:(g.left-b.left+h.left)/w.x,right:(b.right-g.right+h.right)/w.x}}const Rt=new Set(["left","top"]);function _t(e){const t=xe(e);let n=parseFloat(t.width)||0,i=parseFloat(t.height)||0;const o=de(e),r=o?e.offsetWidth:n,a=o?e.offsetHeight:i,s=qe(n)!==r||qe(i)!==a;return s&&(n=r,i=a),{width:n,height:i,$:s}}function Ht(e){return ue(e)?e:e.contextElement}function jt(e){const t=Ht(e);if(!de(t))return Qe(1);const n=t.getBoundingClientRect(),{width:i,height:o,$:r}=_t(t);let a=(r?qe(n.width):n.width)/i,s=(r?qe(n.height):n.height)/o;return a&&Number.isFinite(a)||(a=1),s&&Number.isFinite(s)||(s=1),{x:a,y:s}}const zt=Qe(0);function $t(e){const t=se(e);return Ne()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:zt}function Vt(e,t,n,i){ void 0===t&&(t=false),void 0===n&&(n=false);const o=e.getBoundingClientRect(),r=Ht(e);let a=Qe(1);t&&(i?ue(i)&&(a=jt(i)):a=jt(e));const s=function(e,t,n){return void 0===t&&(t=false),!(!n||t&&n!==se(e))&&t}(r,n,i)?$t(r):Qe(0);let l=(o.left+s.x)/a.x,c=(o.top+s.y)/a.y,u=o.width/a.x,d=o.height/a.y;if(r){const e=se(r),t=i&&ue(i)?se(i):i;let n=e,o=Ae(n);for(;o&&i&&t!==n;){const e=jt(o),t=o.getBoundingClientRect(),i=xe(o),r=t.left+(o.clientLeft+parseFloat(i.paddingLeft))*e.x,a=t.top+(o.clientTop+parseFloat(i.paddingTop))*e.y;l*=e.x,c*=e.y,u*=e.x,d*=e.y,l+=r,c+=a,n=se(o),o=Ae(n);}}return gt({width:u,height:d,x:l,y:c})}function Yt(e,t){const n=Ee(e).scrollLeft;return t?t.left+n:Vt(le(e)).left+n}function Ut(e,t,n){ void 0===n&&(n=false);const i=e.getBoundingClientRect();return {x:i.left+t.scrollLeft-(n?0:Yt(e,i)),y:i.top+t.scrollTop}}const Wt=new Set(["absolute","fixed"]);function Kt(e,t,n){let i;if("viewport"===t)i=function(e,t){const n=se(e),i=le(e),o=n.visualViewport;let r=i.clientWidth,a=i.clientHeight,s=0,l=0;if(o){r=o.width,a=o.height;const e=Ne();(!e||e&&"fixed"===t)&&(s=o.offsetLeft,l=o.offsetTop);}return {width:r,height:a,x:s,y:l}}(e,n);else if("document"===t)i=function(e){const t=le(e),n=Ee(e),i=e.ownerDocument.body,o=Je(t.scrollWidth,t.clientWidth,i.scrollWidth,i.clientWidth),r=Je(t.scrollHeight,t.clientHeight,i.scrollHeight,i.clientHeight);let a=-n.scrollLeft+Yt(e);const s=-n.scrollTop;return "rtl"===xe(i).direction&&(a+=Je(t.clientWidth,i.clientWidth)-o),{width:o,height:r,x:a,y:s}}(le(e));else if(ue(t))i=function(e,t){const n=Vt(e,true,"fixed"===t),i=n.top+e.clientTop,o=n.left+e.clientLeft,r=de(e)?jt(e):Qe(1);return {width:e.clientWidth*r.x,height:e.clientHeight*r.y,x:o*r.x,y:i*r.y}}(t,n);else {const n=$t(e);i={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height};}return gt(i)}function Jt(e,t){const n=Ie(e);return !(n===t||!ue(n)||De(n))&&("fixed"===xe(n).position||Jt(n,t))}function qt(e,t,n){const i=de(t),o=le(t),r="fixed"===n,a=Vt(e,true,r,t);let s={scrollLeft:0,scrollTop:0};const l=Qe(0);function c(){l.x=Yt(o);}if(i||!i&&!r)if(("body"!==ae(t)||he(o))&&(s=Ee(t)),i){const e=Vt(t,true,r,t);l.x=e.x+t.clientLeft,l.y=e.y+t.clientTop;}else o&&c();r&&!i&&o&&c();const u=!o||i||r?Qe(0):Ut(o,s);return {x:a.left+s.scrollLeft-l.x-u.x,y:a.top+s.scrollTop-l.y-u.y,width:a.width,height:a.height}}function Gt(e){return "static"===xe(e).position}function Qt(e,t){if(!de(e)||"fixed"===xe(e).position)return null;if(t)return t(e);let n=e.offsetParent;return le(e)===n&&(n=n.ownerDocument.body),n}function Xt(e,t){const n=se(e);if(ye(e))return n;if(!de(e)){let t=Ie(e);for(;t&&!De(t);){if(ue(t)&&!Gt(t))return t;t=Ie(t);}return n}let i=Qt(e,t);for(;i&&ge(i)&&Gt(i);)i=Qt(i,t);return i&&De(i)&&Gt(i)&&!ke(i)?n:i||function(e){let t=Ie(e);for(;de(t)&&!De(t);){if(ke(t))return t;if(ye(t))return null;t=Ie(t);}return null}(e)||n}const Zt={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:n,offsetParent:i,strategy:o}=e;const r="fixed"===o,a=le(i),s=!!t&&ye(t.floating);if(i===a||s&&r)return n;let l={scrollLeft:0,scrollTop:0},c=Qe(1);const u=Qe(0),d=de(i);if((d||!d&&!r)&&(("body"!==ae(i)||he(a))&&(l=Ee(i)),de(i))){const e=Vt(i);c=jt(i),u.x=e.x+i.clientLeft,u.y=e.y+i.clientTop;}const f=!a||d||r?Qe(0):Ut(a,l,true);return {width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-l.scrollLeft*c.x+u.x+f.x,y:n.y*c.y-l.scrollTop*c.y+u.y+f.y}},getDocumentElement:le,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:i,strategy:o}=e;const r=[..."clippingAncestors"===n?ye(t)?[]:function(e,t){const n=t.get(e);if(n)return n;let i=Te(e,[],false).filter(e=>ue(e)&&"body"!==ae(e)),o=null;const r="fixed"===xe(e).position;let a=r?Ie(e):e;for(;ue(a)&&!De(a);){const t=xe(a),n=ke(a);n||"fixed"!==t.position||(o=null),(r?!n&&!o:!n&&"static"===t.position&&o&&Wt.has(o.position)||he(a)&&!n&&Jt(e,a))?i=i.filter(e=>e!==a):o=t,a=Ie(a);}return t.set(e,i),i}(t,this._c):[].concat(n),i],a=r[0],s=r.reduce((e,n)=>{const i=Kt(t,n,o);return e.top=Je(i.top,e.top),e.right=Ke(i.right,e.right),e.bottom=Ke(i.bottom,e.bottom),e.left=Je(i.left,e.left),e},Kt(t,a,o));return {width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}},getOffsetParent:Xt,getElementRects:async function(e){const t=this.getOffsetParent||Xt,n=this.getDimensions,i=await n(e.floating);return {reference:qt(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:n}=_t(e);return {width:t,height:n}},getScale:jt,isElement:ue,isRTL:function(e){return "rtl"===xe(e).direction}};function en(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function tn(e,t,n,i){ void 0===i&&(i={});const{ancestorScroll:o=true,ancestorResize:r=true,elementResize:a="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:l=false}=i,c=Ht(e),u=o||r?[...c?Te(c):[],...Te(t)]:[];u.forEach(e=>{o&&e.addEventListener("scroll",n,{passive:true}),r&&e.addEventListener("resize",n);});const d=c&&s?function(e,t){let n,i=null;const o=le(e);function r(){var e;clearTimeout(n),null==(e=i)||e.disconnect(),i=null;}return function a(s,l){ void 0===s&&(s=false),void 0===l&&(l=1),r();const c=e.getBoundingClientRect(),{left:u,top:d,width:f,height:m}=c;if(s||t(),!f||!m)return;const h={rootMargin:-Ge(d)+"px "+-Ge(o.clientWidth-(u+f))+"px "+-Ge(o.clientHeight-(d+m))+"px "+-Ge(u)+"px",threshold:Je(0,Ke(1,l))||1};let p=true;function g(t){const i=t[0].intersectionRatio;if(i!==l){if(!p)return a();i?a(false,i):n=setTimeout(()=>{a(false,1e-7);},1e3);}1!==i||en(c,e.getBoundingClientRect())||a(),p=false;}try{i=new IntersectionObserver(g,{...h,root:o.ownerDocument});}catch(e){i=new IntersectionObserver(g,h);}i.observe(e);}(true),r}(c,n):null;let f,m=-1,h=null;a&&(h=new ResizeObserver(e=>{let[i]=e;i&&i.target===c&&h&&(h.unobserve(t),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var e;null==(e=h)||e.observe(t);})),n();}),c&&!l&&h.observe(c),h.observe(t));let p=l?Vt(e):null;return l&&function t(){const i=Vt(e);p&&!en(p,i)&&n();p=i,f=requestAnimationFrame(t);}(),n(),()=>{var e;u.forEach(e=>{o&&e.removeEventListener("scroll",n),r&&e.removeEventListener("resize",n);}),null==d||d(),null==(e=h)||e.disconnect(),h=null,l&&cancelAnimationFrame(f);}}const nn=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var n,i;const{x:o,y:r,placement:a,middlewareData:s}=t,l=await async function(e,t){const{placement:n,platform:i,elements:o}=e,r=await(null==i.isRTL?void 0:i.isRTL(o.floating)),a=nt(n),s=it(n),l="y"===st(n),c=Rt.has(a)?-1:1,u=r&&l?-1:1,d=tt(t,e);let{mainAxis:f,crossAxis:m,alignmentAxis:h}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&"number"==typeof h&&(m="end"===s?-1*h:h),l?{x:m*u,y:f*c}:{x:f*c,y:m*u}}(t,e);return a===(null==(n=s.offset)?void 0:n.placement)&&null!=(i=s.arrow)&&i.alignmentOffset?{}:{x:o+l.x,y:r+l.y,data:{...l,placement:a}}}}},on=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:i,placement:o}=t,{mainAxis:r=true,crossAxis:a=false,limiter:s={fn:e=>{let{x:t,y:n}=e;return {x:t,y:n}}},...l}=tt(e,t),c={x:n,y:i},u=await Bt(t,l),d=st(nt(o)),f=ot(d);let m=c[f],h=c[d];if(r){const e="y"===f?"bottom":"right";m=et(m+u["y"===f?"top":"left"],m,m-u[e]);}if(a){const e="y"===d?"bottom":"right";h=et(h+u["y"===d?"top":"left"],h,h-u[e]);}const p=s.fn({...t,[f]:m,[d]:h});return {...p,data:{x:p.x-n,y:p.y-i,enabled:{[f]:r,[d]:a}}}}}},rn=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var n,i;const{placement:o,middlewareData:r,rects:a,initialPlacement:s,platform:l,elements:c}=t,{mainAxis:u=true,crossAxis:d=true,fallbackPlacements:f,fallbackStrategy:m="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:p=true,...g}=tt(e,t);if(null!=(n=r.arrow)&&n.alignmentOffset)return {};const v=nt(o),y=st(s),w=nt(s)===s,b=await(null==l.isRTL?void 0:l.isRTL(c.floating)),C=f||(w||!p?[pt(s)]:function(e){const t=pt(e);return [ct(e),t,ct(t)]}(s)),k="none"!==h;!f&&k&&C.push(...ht(s,p,h,b));const N=[s,...C],S=await Bt(t,g),D=[];let x=(null==(i=r.flip)?void 0:i.overflows)||[];if(u&&D.push(S[v]),d){const e=function(e,t,n){ void 0===n&&(n=false);const i=it(e),o=lt(e),r=rt(o);let a="x"===o?i===(n?"end":"start")?"right":"left":"start"===i?"bottom":"top";return t.reference[r]>t.floating[r]&&(a=pt(a)),[a,pt(a)]}(o,a,b);D.push(S[e[0]],S[e[1]]);}if(x=[...x,{placement:o,overflows:D}],!D.every(e=>e<=0)){var E,I;const e=((null==(E=r.flip)?void 0:E.index)||0)+1,t=N[e];if(t){if(!("alignment"===d&&y!==st(t))||x.every(e=>st(e.placement)!==y||e.overflows[0]>0))return {data:{index:e,overflows:x},reset:{placement:t}}}let n=null==(I=x.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:I.placement;if(!n)switch(m){case "bestFit":{var M;const e=null==(M=x.filter(e=>{if(k){const t=st(e.placement);return t===y||"y"===t}return  true}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:M[0];e&&(n=e);break}case "initialPlacement":n=s;}if(o!==n)return {reset:{placement:n}}}return {}}}},an=(e,t,n)=>{const i=new Map,o={platform:Zt,...n},r={...o.platform,_c:i};return (async(e,t,n)=>{const{placement:i="bottom",strategy:o="absolute",middleware:r=[],platform:a}=n,s=r.filter(Boolean),l=await(null==a.isRTL?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:o}),{x:u,y:d}=Ft(c,i,l),f=i,m={},h=0;for(let n=0;n<s.length;n++){const{name:r,fn:p}=s[n],{x:g,y:v,data:y,reset:w}=await p({x:u,y:d,initialPlacement:i,placement:f,strategy:o,middlewareData:m,rects:c,platform:a,elements:{reference:e,floating:t}});u=null!=g?g:u,d=null!=v?v:d,m={...m,[r]:{...m[r],...y}},w&&h<=50&&(h++,"object"==typeof w&&(w.placement&&(f=w.placement),w.rects&&(c=true===w.rects?await a.getElementRects({reference:e,floating:t,strategy:o}):w.rects),({x:u,y:d}=Ft(c,f,l))),n=-1);}return {x:u,y:d,placement:f,strategy:o,middlewareData:m}})(e,t,{...o,platform:r})};var sn="undefined"!=typeof document?useLayoutEffect:function(){};function ln(e,t){if(e===t)return  true;if(typeof e!=typeof t)return  false;if("function"==typeof e&&e.toString()===t.toString())return  true;let n,i,o;if(e&&t&&"object"==typeof e){if(Array.isArray(e)){if(n=e.length,n!==t.length)return  false;for(i=n;0!==i--;)if(!ln(e[i],t[i]))return  false;return  true}if(o=Object.keys(e),n=o.length,n!==Object.keys(t).length)return  false;for(i=n;0!==i--;)if(!{}.hasOwnProperty.call(t,o[i]))return  false;for(i=n;0!==i--;){const n=o[i];if(("_owner"!==n||!e.$$typeof)&&!ln(e[n],t[n]))return  false}return  true}return e!=e&&t!=t}function cn(e){if("undefined"==typeof window)return 1;return (e.ownerDocument.defaultView||window).devicePixelRatio||1}function un(e,t){const n=cn(e);return Math.round(t*n)/n}function dn(e){const t=i.useRef(e);return sn(()=>{t.current=e;}),t}const fn=(e,t)=>({...on(e),options:[e,t]}),mn=(e,t)=>({...rn(e),options:[e,t]});function hn(e){return i.useMemo(()=>e.every(e=>null==e)?null:t=>{e.forEach(e=>{"function"==typeof e?e(t):null!=e&&(e.current=t);});},e)}const pn={...i},gn=pn.useInsertionEffect||(e=>e());function vn(e){const t=i.useRef(()=>{});return gn(()=>{t.current=e;}),i.useCallback(function(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];return null==t.current?void 0:t.current(...n)},[])}const yn="ArrowUp",wn="ArrowDown",bn="ArrowLeft",Cn="ArrowRight";function kn(e,t,n){return Math.floor(e/t)!==n}function Nn(e,t){return t<0||t>=e.current.length}function Sn(e,t){return xn(e,{disabledIndices:t})}function Dn(e,t){return xn(e,{decrement:true,startingIndex:e.current.length,disabledIndices:t})}function xn(e,t){let{startingIndex:n=-1,decrement:i=false,disabledIndices:o,amount:r=1}=void 0===t?{}:t;const a=e.current;let s=n;do{s+=i?-r:r;}while(s>=0&&s<=a.length-1&&Mn(a,s,o));return s}function En(e,t,n,i,o){if(-1===e)return  -1;const r=n.indexOf(e),a=t[e];switch(o){case "tl":return r;case "tr":return a?r+a.width-1:r;case "bl":return a?r+(a.height-1)*i:r;case "br":return n.lastIndexOf(e)}}function In(e,t){return t.flatMap((t,n)=>e.includes(t)?[n]:[])}function Mn(e,t,n){if(n)return n.includes(t);const i=e[t];return null==i||i.hasAttribute("disabled")||"true"===i.getAttribute("aria-disabled")}var Tn="undefined"!=typeof document?useLayoutEffect:useEffect;function An(e,t){const n=e.compareDocumentPosition(t);return n&Node.DOCUMENT_POSITION_FOLLOWING||n&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:n&Node.DOCUMENT_POSITION_PRECEDING||n&Node.DOCUMENT_POSITION_CONTAINS?1:0}const Pn=i.createContext({register:()=>{},unregister:()=>{},map:new Map,elementsRef:{current:[]}});function On(e){const{children:t,elementsRef:n,labelsRef:o}=e,[r,a]=i.useState(()=>new Map),s=i.useCallback(e=>{a(t=>new Map(t).set(e,null));},[]),l=i.useCallback(e=>{a(t=>{const n=new Map(t);return n.delete(e),n});},[]);return Tn(()=>{const e=new Map(r);Array.from(e.keys()).sort(An).forEach((t,n)=>{e.set(t,n);}),function(e,t){if(e.size!==t.size)return  false;for(const[n,i]of e.entries())if(i!==t.get(n))return  false;return  true}(r,e)||a(e);},[r]),i.createElement(Pn.Provider,{value:i.useMemo(()=>({register:s,unregister:l,map:r,elementsRef:n,labelsRef:o}),[s,l,r,n,o])},t)}function Ln(e){ void 0===e&&(e={});const{label:t}=e,{register:n,unregister:o,map:r,elementsRef:a,labelsRef:s}=i.useContext(Pn),[l,c]=i.useState(null),u=i.useRef(null),d=i.useCallback(e=>{if(u.current=e,null!==l&&(a.current[l]=e,s)){var n;const i=void 0!==t;s.current[l]=i?t:null!=(n=null==e?void 0:e.textContent)?n:null;}},[l,a,s,t]);return Tn(()=>{const e=u.current;if(e)return n(e),()=>{o(e);}},[n,o]),Tn(()=>{const e=u.current?r.get(u.current):null;null!=e&&c(e);},[r]),i.useMemo(()=>({ref:d,index:null==l?-1:l}),[l,d])}function Fn(){return Fn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i]);}return e},Fn.apply(this,arguments)}let Bn=false,Rn=0;const _n=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+Rn++;const Hn=pn.useId||function(){const[e,t]=i.useState(()=>Bn?_n():void 0);return Tn(()=>{null==e&&t(_n());},[]),i.useEffect(()=>{Bn=true;},[]),e};function $n(){const e=new Map;return {emit(t,n){var i;null==(i=e.get(t))||i.forEach(e=>e(n));},on(t,n){e.set(t,[...e.get(t)||[],n]);},off(t,n){var i;e.set(t,(null==(i=e.get(t))?void 0:i.filter(e=>e!==n))||[]);}}}const Vn=i.createContext(null),Yn=i.createContext(null),Un=()=>{var e;return (null==(e=i.useContext(Vn))?void 0:e.id)||null},Wn=()=>i.useContext(Yn);function Kn(e){const{children:t,id:n}=e,o=Un();return i.createElement(Vn.Provider,{value:i.useMemo(()=>({id:n,parentId:o}),[n,o])},t)}function Jn(e){const{children:t}=e,n=i.useRef([]),o=i.useCallback(e=>{n.current=[...n.current,e];},[]),r=i.useCallback(e=>{n.current=n.current.filter(t=>t!==e);},[]),a=i.useState(()=>$n())[0];return i.createElement(Yn.Provider,{value:i.useMemo(()=>({nodesRef:n,addNode:o,removeNode:r,events:a}),[o,r,a])},t)}function qn(e){return "data-floating-ui-"+e}function Gn(e){const t=useRef(e);return Tn(()=>{t.current=e;}),t}const Qn=qn("safe-polygon");function Xn(e,t,n){return n&&!je(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}let Zn=0;function ei(e,t){ void 0===t&&(t={});const{preventScroll:n=false,cancelPrevious:i=true,sync:o=false}=t;i&&cancelAnimationFrame(Zn);const r=()=>null==e?void 0:e.focus({preventScroll:n});o?r():Zn=requestAnimationFrame(r);}function ti(e,t){let n=e.filter(e=>{var n;return e.parentId===t&&(null==(n=e.context)?void 0:n.open)}),i=n;for(;i.length;)i=e.filter(e=>{var t;return null==(t=i)?void 0:t.some(t=>{var n;return e.parentId===t.id&&(null==(n=e.context)?void 0:n.open)})}),n=n.concat(i);return n}let ni=new WeakMap,ii=new WeakSet,oi={},ri=0;const ai=e=>e&&(e.host||ai(e.parentNode));function si(e,t,n,i){const o="data-floating-ui-inert",r=i?"inert":n?"aria-hidden":null,a=(s=t,e.map(e=>{if(s.contains(e))return e;const t=ai(e);return s.contains(t)?t:null}).filter(e=>null!=e));var s;const l=new Set,c=new Set(a),u=[];oi[o]||(oi[o]=new WeakMap);const d=oi[o];return a.forEach(function e(t){if(!t||l.has(t))return;l.add(t),t.parentNode&&e(t.parentNode);}),function e(t){if(!t||c.has(t))return;[].forEach.call(t.children,t=>{if("script"!==ae(t))if(l.has(t))e(t);else {const e=r?t.getAttribute(r):null,n=null!==e&&"false"!==e,i=(ni.get(t)||0)+1,a=(d.get(t)||0)+1;ni.set(t,i),d.set(t,a),u.push(t),1===i&&n&&ii.add(t),1===a&&t.setAttribute(o,""),!n&&r&&t.setAttribute(r,"true");}});}(t),l.clear(),ri++,()=>{u.forEach(e=>{const t=(ni.get(e)||0)-1,n=(d.get(e)||0)-1;ni.set(e,t),d.set(e,n),t||(!ii.has(e)&&r&&e.removeAttribute(r),ii.delete(e)),n||e.removeAttribute(o);}),ri--,ri||(ni=new WeakMap,ni=new WeakMap,ii=new WeakSet,oi={});}}function li(e,t,n){ void 0===t&&(t=false),void 0===n&&(n=false);const i=ze(e[0]).body;return si(e.concat(Array.from(i.querySelectorAll("[aria-live]"))),i,t,n)}const ci=()=>({getShadowRoot:true,displayCheck:"function"==typeof ResizeObserver&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function ui(e,t){const n=Lt(e,ci());"prev"===t&&n.reverse();const i=n.indexOf(Pe(ze(e)));return n.slice(i+1)[0]}function di(e,t){const n=t||e.currentTarget,i=e.relatedTarget;return !i||!Oe(n,i)}const fi={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0};function mi(e){"Tab"===e.key&&(e.target,clearTimeout(undefined));}const hi=i.forwardRef(function(e,t){const[n,o]=i.useState();Tn(()=>(_e()&&o("button"),document.addEventListener("keydown",mi),()=>{document.removeEventListener("keydown",mi);}),[]);const r={ref:t,tabIndex:0,role:n,"aria-hidden":!n||void 0,[qn("focus-guard")]:"",style:fi};return i.createElement("span",Fn({},e,r))}),pi=i.createContext(null),gi="data-floating-ui-focusable";function vi(e){return e?e.hasAttribute(gi)?e:e.querySelector("["+gi+"]")||e:null}let yi=[];function wi(e){yi=yi.filter(e=>e.isConnected);let t=e;if(t&&"body"!==ae(t)){if(!function(e,t){if(t=t||{},!e)throw new Error("No node provided");return  false!==wt.call(e,vt)&&At(t,e)}(t,ci())){const e=Lt(t,ci())[0];e&&(t=e);}yi.push(t),yi.length>20&&(yi=yi.slice(-20));}}function bi(){return yi.slice().reverse().find(e=>e.isConnected)}const Ci=i.forwardRef(function(e,t){return i.createElement("button",Fn({},e,{type:"button",ref:t,tabIndex:-1,style:fi}))});function ki(e){const{context:t,children:n,disabled:o=false,order:r=["content"],guards:a=true,initialFocus:s=0,returnFocus:l=true,restoreFocus:c=false,modal:u=true,visuallyHiddenDismiss:d=false,closeOnFocusOut:f=true}=e,{open:m,refs:h,nodeId:p,onOpenChange:g,events:v,dataRef:y,floatingId:w,elements:{domReference:b,floating:C}}=t,k="number"==typeof s&&s<0,N=We(b)&&k,S="undefined"==typeof HTMLElement||!("inert"in HTMLElement.prototype)||a,D=Gn(r),x=Gn(s),E=Gn(l),I=Wn(),M=i.useContext(pi),T=i.useRef(null),A=i.useRef(null),P=i.useRef(false),O=i.useRef(false),L=i.useRef(-1),F=null!=M,B=vi(C),R=vn(function(e){return void 0===e&&(e=B),e?Lt(e,ci()):[]}),_=vn(e=>{const t=R(e);return D.current.map(e=>b&&"reference"===e?b:B&&"floating"===e?B:t).filter(Boolean).flat()});function H(e){return !o&&d&&u?i.createElement(Ci,{ref:"start"===e?T:A,onClick:e=>g(false,e.nativeEvent)},"string"==typeof d?d:"Dismiss"):null}i.useEffect(()=>{if(o)return;if(!u)return;function e(e){if("Tab"===e.key){Oe(B,Pe(ze(B)))&&0===R().length&&!N&&Ue(e);const t=_(),n=Ve(e);"reference"===D.current[0]&&n===b&&(Ue(e),e.shiftKey?ei(t[t.length-1]):ei(t[1])),"floating"===D.current[1]&&n===B&&e.shiftKey&&(Ue(e),ei(t[0]));}}const t=ze(B);return t.addEventListener("keydown",e),()=>{t.removeEventListener("keydown",e);}},[o,b,B,u,D,N,R,_]),i.useEffect(()=>{if(!o&&C)return C.addEventListener("focusin",e),()=>{C.removeEventListener("focusin",e);};function e(e){const t=Ve(e),n=R().indexOf(t);-1!==n&&(L.current=n);}},[o,C,R]),i.useEffect(()=>{if(!o&&f)return C&&de(b)?(b.addEventListener("focusout",t),b.addEventListener("pointerdown",e),C.addEventListener("focusout",t),()=>{b.removeEventListener("focusout",t),b.removeEventListener("pointerdown",e),C.removeEventListener("focusout",t);}):void 0;function e(){O.current=true,setTimeout(()=>{O.current=false;});}function t(e){const t=e.relatedTarget;queueMicrotask(()=>{const n=!(Oe(b,t)||Oe(C,t)||Oe(t,C)||Oe(null==M?void 0:M.portalNode,t)||null!=t&&t.hasAttribute(qn("focus-guard"))||I&&(ti(I.nodesRef.current,p).find(e=>{var n,i;return Oe(null==(n=e.context)?void 0:n.elements.floating,t)||Oe(null==(i=e.context)?void 0:i.elements.domReference,t)})||function(e,t){var n;let i=[],o=null==(n=e.find(e=>e.id===t))?void 0:n.parentId;for(;o;){const t=e.find(e=>e.id===o);o=null==t?void 0:t.parentId,t&&(i=i.concat(t));}return i}(I.nodesRef.current,p).find(e=>{var n,i;return (null==(n=e.context)?void 0:n.elements.floating)===t||(null==(i=e.context)?void 0:i.elements.domReference)===t})));if(c&&n&&Pe(ze(B))===ze(B).body){de(B)&&B.focus();const e=L.current,t=R(),n=t[e]||t[t.length-1]||B;de(n)&&n.focus();}!N&&u||!t||!n||O.current||t===bi()||(P.current=true,g(false,e,"focus-out"));});}},[o,b,C,B,u,p,I,M,g,f,c,R,N]),i.useEffect(()=>{var e;if(o)return;const t=Array.from((null==M||null==(e=M.portalNode)?void 0:e.querySelectorAll("["+qn("portal")+"]"))||[]);if(C){const e=[C,...t,T.current,A.current,D.current.includes("reference")||N?b:null].filter(e=>null!=e),n=u||N?li(e,S,!S):li(e);return ()=>{n();}}},[o,b,C,u,D,M,N,S]),Tn(()=>{if(o||!de(B))return;const e=Pe(ze(B));queueMicrotask(()=>{const t=_(B),n=x.current,i=("number"==typeof n?t[n]:n.current)||B,o=Oe(B,e);k||o||!m||ei(i,{preventScroll:i===B});});},[o,m,B,k,_,x]),Tn(()=>{if(o||!B)return;let e=false;const t=ze(B),n=Pe(t);let i=y.current.openEvent;function r(t){let{open:n,reason:o,event:r,nested:a}=t;n&&(i=r),"escape-key"===o&&h.domReference.current&&wi(h.domReference.current),"hover"===o&&"mouseleave"===r.type&&(P.current=true),"outside-press"===o&&(a?(P.current=false,e=true):P.current=!(Be(r)||Re(r)));}wi(n),v.on("openchange",r);const a=t.createElement("span");return a.setAttribute("tabindex","-1"),a.setAttribute("aria-hidden","true"),Object.assign(a.style,fi),F&&b&&b.insertAdjacentElement("afterend",a),()=>{v.off("openchange",r);const n=Pe(t),o=Oe(C,n)||I&&ti(I.nodesRef.current,p).some(e=>{var t;return Oe(null==(t=e.context)?void 0:t.elements.floating,n)});(o||i&&["click","mousedown"].includes(i.type))&&h.domReference.current&&wi(h.domReference.current);const s="boolean"==typeof E.current?bi()||a:E.current.current||a;queueMicrotask(()=>{E.current&&!P.current&&de(s)&&(s===n||n===t.body||o)&&s.focus({preventScroll:e}),a.remove();});}},[o,C,B,E,y,h,v,I,p,F,b]),i.useEffect(()=>{queueMicrotask(()=>{P.current=false;});},[o]),Tn(()=>{if(!o&&M)return M.setFocusManagerState({modal:u,closeOnFocusOut:f,open:m,onOpenChange:g,refs:h}),()=>{M.setFocusManagerState(null);}},[o,M,u,m,g,h,f]),Tn(()=>{if(o)return;if(!B)return;if("function"!=typeof MutationObserver)return;if(k)return;const e=()=>{const e=B.getAttribute("tabindex"),t=R(),n=Pe(ze(C)),i=t.indexOf(n);-1!==i&&(L.current=i),D.current.includes("floating")||n!==h.domReference.current&&0===t.length?"0"!==e&&B.setAttribute("tabindex","0"):"-1"!==e&&B.setAttribute("tabindex","-1");};e();const t=new MutationObserver(e);return t.observe(B,{childList:true,subtree:true,attributes:true}),()=>{t.disconnect();}},[o,C,B,h,D,R,k]);const j=!o&&S&&(!u||!N)&&(F||u);return i.createElement(i.Fragment,null,j&&i.createElement(hi,{"data-type":"inside",ref:null==M?void 0:M.beforeInsideRef,onFocus:e=>{if(u){const e=_();ei("reference"===r[0]?e[0]:e[e.length-1]);}else if(null!=M&&M.preserveTabOrder&&M.portalNode)if(P.current=false,di(e,M.portalNode)){const e=ui(document.body,"next")||b;null==e||e.focus();}else {var t;null==(t=M.beforeOutsideRef.current)||t.focus();}}}),!N&&H("start"),n,H("end"),j&&i.createElement(hi,{"data-type":"inside",ref:null==M?void 0:M.afterInsideRef,onFocus:e=>{if(u)ei(_()[0]);else if(null!=M&&M.preserveTabOrder&&M.portalNode)if(f&&(P.current=true),di(e,M.portalNode)){const e=ui(document.body,"prev")||b;null==e||e.focus();}else {var t;null==(t=M.afterOutsideRef.current)||t.focus();}}}))}function Ni(e){return de(e.target)&&"BUTTON"===e.target.tagName}function Si(e){return Ye(e)}const Di={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},xi={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},Ei=e=>{var t,n;return {escapeKey:"boolean"==typeof e?e:null!=(t=null==e?void 0:e.escapeKey)&&t,outsidePress:"boolean"==typeof e?e:null==(n=null==e?void 0:e.outsidePress)||n}};function Ii(e){const{open:t=false,onOpenChange:n,elements:o}=e,r=Hn(),a=i.useRef({}),[s]=i.useState(()=>$n()),l=null!=Un();const[c,u]=i.useState(o.reference),d=vn((e,t,i)=>{a.current.openEvent=e?t:void 0,s.emit("openchange",{open:e,event:t,reason:i,nested:l}),null==n||n(e,t,i);}),f=i.useMemo(()=>({setPositionReference:u}),[]),m=i.useMemo(()=>({reference:c||o.reference||null,floating:o.floating||null,domReference:o.reference}),[c,o.reference,o.floating]);return i.useMemo(()=>({dataRef:a,open:t,onOpenChange:d,elements:m,events:s,floatingId:r,refs:f}),[t,d,m,s,r,f])}function Mi(e){ void 0===e&&(e={});const{nodeId:t}=e,n=Ii({...e,elements:{reference:null,floating:null,...e.elements}}),o=e.rootContext||n,r=o.elements,[a,s]=i.useState(null),[l,c]=i.useState(null),u=(null==r?void 0:r.domReference)||a,d=i.useRef(null),f=Wn();Tn(()=>{u&&(d.current=u);},[u]);const m=function(e){ void 0===e&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:o=[],platform:r,elements:{reference:a,floating:s}={},transform:l=true,whileElementsMounted:c,open:u}=e,[d,f]=i.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:false}),[m,h]=i.useState(o);ln(m,o)||h(o);const[p,v]=i.useState(null),[y,w]=i.useState(null),b=i.useCallback(e=>{e!==S.current&&(S.current=e,v(e));},[]),C=i.useCallback(e=>{e!==D.current&&(D.current=e,w(e));},[]),k=a||p,N=s||y,S=i.useRef(null),D=i.useRef(null),x=i.useRef(d),E=null!=c,I=dn(c),M=dn(r),T=dn(u),A=i.useCallback(()=>{if(!S.current||!D.current)return;const e={placement:t,strategy:n,middleware:m};M.current&&(e.platform=M.current),an(S.current,D.current,e).then(e=>{const t={...e,isPositioned:false!==T.current};P.current&&!ln(x.current,t)&&(x.current=t,g.flushSync(()=>{f(t);}));});},[m,t,n,M,T]);sn(()=>{ false===u&&x.current.isPositioned&&(x.current.isPositioned=false,f(e=>({...e,isPositioned:false})));},[u]);const P=i.useRef(false);sn(()=>(P.current=true,()=>{P.current=false;}),[]),sn(()=>{if(k&&(S.current=k),N&&(D.current=N),k&&N){if(I.current)return I.current(k,N,A);A();}},[k,N,A,I,E]);const O=i.useMemo(()=>({reference:S,floating:D,setReference:b,setFloating:C}),[b,C]),L=i.useMemo(()=>({reference:k,floating:N}),[k,N]),F=i.useMemo(()=>{const e={position:n,left:0,top:0};if(!L.floating)return e;const t=un(L.floating,d.x),i=un(L.floating,d.y);return l?{...e,transform:"translate("+t+"px, "+i+"px)",...cn(L.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:t,top:i}},[n,l,L.floating,d.x,d.y]);return i.useMemo(()=>({...d,update:A,refs:O,elements:L,floatingStyles:F}),[d,A,O,L,F])}({...e,elements:{...r,...l&&{reference:l}}}),h=i.useCallback(e=>{const t=ue(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;c(t),m.refs.setReference(t);},[m.refs]),p=i.useCallback(e=>{(ue(e)||null===e)&&(d.current=e,s(e)),(ue(m.refs.reference.current)||null===m.refs.reference.current||null!==e&&!ue(e))&&m.refs.setReference(e);},[m.refs]),v=i.useMemo(()=>({...m.refs,setReference:p,setPositionReference:h,domReference:d}),[m.refs,p,h]),y=i.useMemo(()=>({...m.elements,domReference:u}),[m.elements,u]),w=i.useMemo(()=>({...m,...o,refs:v,elements:y,nodeId:t}),[m,v,y,t,o]);return Tn(()=>{o.dataRef.current.floatingContext=w;const e=null==f?void 0:f.nodesRef.current.find(e=>e.id===t);e&&(e.context=w);}),i.useMemo(()=>({...m,context:w,refs:v,elements:y}),[m,v,y,w])}const Ti="active",Ai="selected";function Pi(e,t,n){const i=new Map,o="item"===n;let r=e;if(o&&e){const{[Ti]:t,[Ai]:n,...i}=e;r=i;}return {..."floating"===n&&{tabIndex:-1,[gi]:""},...r,...t.map(t=>{const i=t?t[n]:null;return "function"==typeof i?e?i(e):null:i}).concat(e).reduce((e,t)=>t?(Object.entries(t).forEach(t=>{let[n,r]=t;var a;o&&[Ti,Ai].includes(n)||(0===n.indexOf("on")?(i.has(n)||i.set(n,[]),"function"==typeof r&&(null==(a=i.get(n))||a.push(r),e[n]=function(){for(var e,t=arguments.length,o=new Array(t),r=0;r<t;r++)o[r]=arguments[r];return null==(e=i.get(n))?void 0:e.map(e=>e(...o)).find(e=>void 0!==e)})):e[n]=r);}),e):e,{})}}let Oi=false;function Li(e,t,n){switch(e){case "vertical":return t;case "horizontal":return n;default:return t||n}}function Fi(e,t){return Li(t,e===yn||e===wn,e===bn||e===Cn)}function Bi(e,t,n){return Li(t,e===wn,n?e===bn:e===Cn)||"Enter"===e||" "===e||""===e}function Ri(e,t,n){return Li(t,n?e===Cn:e===bn,e===yn)}function _i(e,t){const{open:n,onOpenChange:o,elements:r}=e,{listRef:a,activeIndex:s,onNavigate:l=()=>{},enabled:c=true,selectedIndex:u=null,allowEscape:d=false,loop:f=false,nested:m=false,rtl:h=false,virtual:p=false,focusItemOnOpen:g="auto",focusItemOnHover:v=true,openOnArrowKeyDown:y=true,disabledIndices:w,orientation:b="vertical",cols:C=1,scrollItemIntoView:k=true,virtualItemRef:N,itemSizes:S,dense:D=false}=t;const x=Gn(vi(r.floating)),E=Un(),I=Wn(),M=vn(l),T=We(r.domReference),A=i.useRef(g),P=i.useRef(null!=u?u:-1),O=i.useRef(null),L=i.useRef(true),F=i.useRef(M),B=i.useRef(!!r.floating),R=i.useRef(n),_=i.useRef(false),H=i.useRef(false),j=Gn(w),z=Gn(n),$=Gn(k),V=Gn(u),[Y,U]=i.useState(),[W,K]=i.useState(),J=vn(function(e,t,n){function i(e){p?(U(e.id),null==I||I.events.emit("virtualfocus",e),N&&(N.current=e)):ei(e,{preventScroll:true,sync:!(!Le().toLowerCase().startsWith("mac")||navigator.maxTouchPoints||!_e())&&(Oi||_.current)});} void 0===n&&(n=false);const o=e.current[t.current];o&&i(o),requestAnimationFrame(()=>{const r=e.current[t.current]||o;if(!r)return;o||i(r);const a=$.current;a&&G&&(n||!L.current)&&(null==r.scrollIntoView||r.scrollIntoView("boolean"==typeof a?{block:"nearest",inline:"nearest"}:a));});});Tn(()=>{document.createElement("div").focus({get preventScroll(){return Oi=true,false}});},[]),Tn(()=>{c&&(n&&r.floating?A.current&&null!=u&&(H.current=true,P.current=u,M(u)):B.current&&(P.current=-1,F.current(null)));},[c,n,r.floating,u,M]),Tn(()=>{if(c&&n&&r.floating)if(null==s){if(_.current=false,null!=V.current)return;if(B.current&&(P.current=-1,J(a,P)),(!R.current||!B.current)&&A.current&&(null!=O.current||true===A.current&&null==O.current)){let e=0;const t=()=>{if(null==a.current[0]){if(e<2){(e?requestAnimationFrame:queueMicrotask)(t);}e++;}else P.current=null==O.current||Bi(O.current,b,h)||m?Sn(a,j.current):Dn(a,j.current),O.current=null,M(P.current);};t();}}else Nn(a,s)||(P.current=s,J(a,P,H.current),H.current=false);},[c,n,r.floating,s,V,m,a,b,h,M,J,j]),Tn(()=>{var e;if(!c||r.floating||!I||p||!B.current)return;const t=I.nodesRef.current,n=null==(e=t.find(e=>e.id===E))||null==(e=e.context)?void 0:e.elements.floating,i=Pe(ze(r.floating)),o=t.some(e=>e.context&&Oe(e.context.elements.floating,i));n&&!o&&L.current&&n.focus({preventScroll:true});},[c,r.floating,I,E,p]),Tn(()=>{if(c&&I&&p&&!E)return I.events.on("virtualfocus",e),()=>{I.events.off("virtualfocus",e);};function e(e){K(e.id),N&&(N.current=e);}},[c,I,p,E,N]),Tn(()=>{F.current=M,B.current=!!r.floating;}),Tn(()=>{n||(O.current=null);},[n]),Tn(()=>{R.current=n;},[n]);const q=null!=s,G=i.useMemo(()=>{function e(e){if(!n)return;const t=a.current.indexOf(e);-1!==t&&M(t);}return {onFocus(t){let{currentTarget:n}=t;e(n);},onClick:e=>{let{currentTarget:t}=e;return t.focus({preventScroll:true})},...v&&{onMouseMove(t){let{currentTarget:n}=t;e(n);},onPointerLeave(e){let{pointerType:t}=e;L.current&&"touch"!==t&&(P.current=-1,J(a,P),M(null),p||ei(x.current,{preventScroll:true}));}}}},[n,x,J,v,a,M,p]),Q=vn(e=>{if(L.current=false,_.current=true,229===e.which)return;if(!z.current&&e.currentTarget===x.current)return;if(m&&Ri(e.key,b,h))return Ue(e),o(false,e.nativeEvent,"list-navigation"),void(de(r.domReference)&&(p?null==I||I.events.emit("virtualfocus",r.domReference):r.domReference.focus()));const t=P.current,i=Sn(a,w),s=Dn(a,w);if(T||("Home"===e.key&&(Ue(e),P.current=i,M(P.current)),"End"===e.key&&(Ue(e),P.current=s,M(P.current))),C>1){const t=S||Array.from({length:a.current.length},()=>({width:1,height:1})),n=function(e,t,n){const i=[];let o=0;return e.forEach((e,r)=>{let{width:a,height:s}=e;let l=false;for(n&&(o=0);!l;){const e=[];for(let n=0;n<a;n++)for(let i=0;i<s;i++)e.push(o+n+i*t);o%t+a<=t&&e.every(e=>null==i[e])?(e.forEach(e=>{i[e]=r;}),l=true):o++;}}),[...i]}(t,C,D),o=n.findIndex(e=>null!=e&&!Mn(a.current,e,w)),r=n.reduce((e,t,n)=>null==t||Mn(a.current,t,w)?e:n,-1),l=n[function(e,t){let{event:n,orientation:i,loop:o,rtl:r,cols:a,disabledIndices:s,minIndex:l,maxIndex:c,prevIndex:u,stopEvent:d=false}=t,f=u;if(n.key===yn){if(d&&Ue(n),-1===u)f=c;else if(f=xn(e,{startingIndex:f,amount:a,decrement:true,disabledIndices:s}),o&&(u-a<l||f<0)){const e=u%a,t=c%a,n=c-(t-e);f=t===e?c:t>e?n:n-a;}Nn(e,f)&&(f=u);}if(n.key===wn&&(d&&Ue(n),-1===u?f=l:(f=xn(e,{startingIndex:u,amount:a,disabledIndices:s}),o&&u+a>c&&(f=xn(e,{startingIndex:u%a-a,amount:a,disabledIndices:s}))),Nn(e,f)&&(f=u)),"both"===i){const t=Ge(u/a);n.key===(r?bn:Cn)&&(d&&Ue(n),u%a!==a-1?(f=xn(e,{startingIndex:u,disabledIndices:s}),o&&kn(f,a,t)&&(f=xn(e,{startingIndex:u-u%a-1,disabledIndices:s}))):o&&(f=xn(e,{startingIndex:u-u%a-1,disabledIndices:s})),kn(f,a,t)&&(f=u)),n.key===(r?Cn:bn)&&(d&&Ue(n),u%a!==0?(f=xn(e,{startingIndex:u,decrement:true,disabledIndices:s}),o&&kn(f,a,t)&&(f=xn(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s}))):o&&(f=xn(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s})),kn(f,a,t)&&(f=u));const i=Ge(c/a)===t;Nn(e,f)&&(f=o&&i?n.key===(r?Cn:bn)?c:xn(e,{startingIndex:u-u%a-1,disabledIndices:s}):u);}return f}({current:n.map(e=>null!=e?a.current[e]:null)},{event:e,orientation:b,loop:f,rtl:h,cols:C,disabledIndices:In([...w||a.current.map((e,t)=>Mn(a.current,t)?t:void 0),void 0],n),minIndex:o,maxIndex:r,prevIndex:En(P.current>s?i:P.current,t,n,C,e.key===wn?"bl":e.key===(h?bn:Cn)?"tr":"tl"),stopEvent:true})];if(null!=l&&(P.current=l,M(P.current)),"both"===b)return}if(Fi(e.key,b)){if(Ue(e),n&&!p&&Pe(e.currentTarget.ownerDocument)===e.currentTarget)return P.current=Bi(e.key,b,h)?i:s,void M(P.current);Bi(e.key,b,h)?P.current=f?t>=s?d&&t!==a.current.length?-1:i:xn(a,{startingIndex:t,disabledIndices:w}):Math.min(s,xn(a,{startingIndex:t,disabledIndices:w})):P.current=f?t<=i?d&&-1!==t?a.current.length:s:xn(a,{startingIndex:t,decrement:true,disabledIndices:w}):Math.max(i,xn(a,{startingIndex:t,decrement:true,disabledIndices:w})),Nn(a,P.current)?M(null):M(P.current);}}),X=i.useMemo(()=>p&&n&&q&&{"aria-activedescendant":W||Y},[p,n,q,W,Y]),Z=i.useMemo(()=>({"aria-orientation":"both"===b?void 0:b,...!We(r.domReference)&&X,onKeyDown:Q,onPointerMove(){L.current=true;}}),[X,Q,r.domReference,b]),ee=i.useMemo(()=>{function e(e){"auto"===g&&Be(e.nativeEvent)&&(A.current=true);}return {...X,onKeyDown(e){L.current=false;const t=e.key.startsWith("Arrow"),i=["Home","End"].includes(e.key),r=t||i,s=function(e,t,n){return Li(t,n?e===bn:e===Cn,e===wn)}(e.key,b,h),l=Ri(e.key,b,h),c=Fi(e.key,b),d=(m?s:c)||"Enter"===e.key||""===e.key.trim();if(p&&n){const t=null==I?void 0:I.nodesRef.current.find(e=>null==e.parentId),n=I&&t?function(e,t){let n,i=-1;return function t(o,r){r>i&&(n=o,i=r),ti(e,o).forEach(e=>{t(e.id,r+1);});}(t,0),e.find(e=>e.id===n)}(I.nodesRef.current,t.id):null;if(r&&n&&N){const t=new KeyboardEvent("keydown",{key:e.key,bubbles:true});if(s||l){var f,g;const i=(null==(f=n.context)?void 0:f.elements.domReference)===e.currentTarget,o=l&&!i?null==(g=n.context)?void 0:g.elements.domReference:s?a.current.find(e=>(null==e?void 0:e.id)===Y):null;o&&(Ue(e),o.dispatchEvent(t),K(void 0));}var v;if((c||i)&&n.context)if(n.context.open&&n.parentId&&e.currentTarget!==n.context.elements.domReference)return Ue(e),void(null==(v=n.context.elements.domReference)||v.dispatchEvent(t))}return Q(e)}(n||y||!t)&&(d&&(O.current=m&&c?null:e.key),m?s&&(Ue(e),n?(P.current=Sn(a,j.current),M(P.current)):o(true,e.nativeEvent,"list-navigation")):c&&(null!=u&&(P.current=u),Ue(e),!n&&y?o(true,e.nativeEvent,"list-navigation"):Q(e),n&&M(P.current)));},onFocus(){n&&!p&&M(null);},onPointerDown:function(e){A.current=g,"auto"===g&&Re(e.nativeEvent)&&(A.current=true);},onMouseDown:e,onClick:e}},[Y,X,Q,j,g,a,m,M,o,n,y,b,h,u,I,p,N]);return i.useMemo(()=>c?{reference:ee,floating:Z,item:G}:{},[c,ee,Z,G])}const Hi=new Map([["select","listbox"],["combobox","listbox"],["label",false]]);function ji(e,t){const[n,i]=e;let o=false;const r=t.length;for(let e=0,a=r-1;e<r;a=e++){const[r,s]=t[e]||[0,0],[l,c]=t[a]||[0,0];s>=i!=c>=i&&n<=(l-r)*(i-s)/(c-s)+r&&(o=!o);}return o}function zi(e){ void 0===e&&(e={});const{buffer:t=.5,blockPointerEvents:n=false,requireIntent:i=true}=e;let o,r=false,a=null,s=null,l=performance.now();const c=e=>{let{x:n,y:c,placement:u,elements:d,onClose:f,nodeId:m,tree:h}=e;return function(e){function p(){clearTimeout(o),f();}if(clearTimeout(o),!d.domReference||!d.floating||null==u||null==n||null==c)return;const{clientX:g,clientY:v}=e,y=[g,v],w=Ve(e),b="mouseleave"===e.type,C=Oe(d.floating,w),k=Oe(d.domReference,w),N=d.domReference.getBoundingClientRect(),S=d.floating.getBoundingClientRect(),D=u.split("-")[0],x=n>S.right-S.width/2,E=c>S.bottom-S.height/2,I=function(e,t){return e[0]>=t.x&&e[0]<=t.x+t.width&&e[1]>=t.y&&e[1]<=t.y+t.height}(y,N),M=S.width>N.width,T=S.height>N.height,A=(M?N:S).left,P=(M?N:S).right,O=(T?N:S).top,L=(T?N:S).bottom;if(C&&(r=true,!b))return;if(k&&(r=false),k&&!b)return void(r=true);if(b&&ue(e.relatedTarget)&&Oe(d.floating,e.relatedTarget))return;if(h&&ti(h.nodesRef.current,m).some(e=>{let{context:t}=e;return null==t?void 0:t.open}))return;if("top"===D&&c>=N.bottom-1||"bottom"===D&&c<=N.top+1||"left"===D&&n>=N.right-1||"right"===D&&n<=N.left+1)return p();let F=[];switch(D){case "top":F=[[A,N.top+1],[A,S.bottom-1],[P,S.bottom-1],[P,N.top+1]];break;case "bottom":F=[[A,S.top+1],[A,N.bottom-1],[P,N.bottom-1],[P,S.top+1]];break;case "left":F=[[S.right-1,L],[S.right-1,O],[N.left+1,O],[N.left+1,L]];break;case "right":F=[[N.right-1,L],[N.right-1,O],[S.left+1,O],[S.left+1,L]];}if(!ji([g,v],F)){if(r&&!I)return p();if(!b&&i){const t=function(e,t){const n=performance.now(),i=n-l;if(null===a||null===s||0===i)return a=e,s=t,l=n,null;const o=e-a,r=t-s,c=Math.sqrt(o*o+r*r);return a=e,s=t,l=n,c/i}(e.clientX,e.clientY);if(null!==t&&t<.1)return p()}ji([g,v],function(e){let[n,i]=e;switch(D){case "top":return [[M?n+t/2:x?n+4*t:n-4*t,i+t+1],[M?n-t/2:x?n+4*t:n-4*t,i+t+1],...[[S.left,x||M?S.bottom-t:S.top],[S.right,x?M?S.bottom-t:S.top:S.bottom-t]]];case "bottom":return [[M?n+t/2:x?n+4*t:n-4*t,i-t],[M?n-t/2:x?n+4*t:n-4*t,i-t],...[[S.left,x||M?S.top+t:S.bottom],[S.right,x?M?S.top+t:S.bottom:S.top+t]]];case "left":{const e=[n+t+1,T?i+t/2:E?i+4*t:i-4*t],o=[n+t+1,T?i-t/2:E?i+4*t:i-4*t];return [...[[E||T?S.right-t:S.left,S.top],[E?T?S.right-t:S.left:S.right-t,S.bottom]],e,o]}case "right":return [[n-t,T?i+t/2:E?i+4*t:i-4*t],[n-t,T?i-t/2:E?i+4*t:i-4*t],...[[E||T?S.left+t:S.right,S.top],[E?T?S.left+t:S.right:S.left+t,S.bottom]]]}}([n,c]))?!r&&i&&(o=window.setTimeout(p,40)):p();}}};return c.__options={blockPointerEvents:n},c}const $i=createContext({getItemProps:()=>({}),activeIndex:null,setActiveIndex:()=>{},setHasFocusInside:()=>{},isOpen:false,setIsOpen:()=>{}}),Vi=forwardRef(({className:t,disabled:n,children:i,...o},r)=>{const a=useContext($i),l=Ln(),c=Wn(),u=l.index===a.activeIndex,d=k("io-dropdown-menu-item",n&&"io-dropdown-menu-item-disabled",t);return jsxRuntimeExports.jsx("div",{ref:hn([l.ref,r]),role:"menuitem",className:d,tabIndex:u?0:-1,"aria-disabled":n,...o,...a.getItemProps({onClick(e){if(n)return e.preventDefault(),void e.stopPropagation();o.onClick?.(e),a.setIsOpen(false),c?.events.emit("click");},onFocus(e){n||(o.onFocus?.(e),a.setHasFocusInside(true));}}),children:i})});Vi.displayName="DropdownMenuItem";const Yi=forwardRef(({className:n,variant:o="default",icon:r,iconRight:a,text:f="",disabled:m,children:h,...p},g)=>{const[v,y]=useState(false),[w,b]=useState(false),[C,N]=useState(null),S=useRef([]),D=useRef([]),x=useContext($i),E=Wn(),I=function(){const e=Hn(),t=Wn(),n=Un();return Tn(()=>{const i={id:e,parentId:n};return null==t||t.addNode(i),()=>{null==t||t.removeNode(i);}},[t,e,n]),e}(),M=Un(),T=Ln(),P=null!=M,{floatingStyles:O,refs:L,context:F}=Mi({nodeId:I,open:v,onOpenChange:y,placement:P?"right-start":"bottom-start",middleware:[(B={mainAxis:P?0:4,alignmentAxis:P?-4:0},{...nn(B),options:[B,R]}),mn(),fn()],whileElementsMounted:tn});var B,R;const _=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,events:a,elements:s}=e,{enabled:l=true,delay:c=0,handleClose:u=null,mouseOnly:d=false,restMs:f=0,move:m=true}=t,h=Wn(),p=Un(),g=Gn(u),v=Gn(c),y=Gn(n),w=i.useRef(),b=i.useRef(-1),C=i.useRef(),k=i.useRef(-1),N=i.useRef(true),S=i.useRef(false),D=i.useRef(()=>{}),x=i.useRef(false),E=i.useCallback(()=>{var e;const t=null==(e=r.current.openEvent)?void 0:e.type;return (null==t?void 0:t.includes("mouse"))&&"mousedown"!==t},[r]);i.useEffect(()=>{if(l)return a.on("openchange",e),()=>{a.off("openchange",e);};function e(e){let{open:t}=e;t||(clearTimeout(b.current),clearTimeout(k.current),N.current=true,x.current=false);}},[l,a]),i.useEffect(()=>{if(!l)return;if(!g.current)return;if(!n)return;function e(e){E()&&o(false,e,"hover");}const t=ze(s.floating).documentElement;return t.addEventListener("mouseleave",e),()=>{t.removeEventListener("mouseleave",e);}},[s.floating,n,o,l,g,E]);const I=i.useCallback(function(e,t,n){ void 0===t&&(t=true),void 0===n&&(n="hover");const i=Xn(v.current,"close",w.current);i&&!C.current?(clearTimeout(b.current),b.current=window.setTimeout(()=>o(false,e,n),i)):t&&(clearTimeout(b.current),o(false,e,n));},[v,o]),M=vn(()=>{D.current(),C.current=void 0;}),T=vn(()=>{if(S.current){const e=ze(s.floating).body;e.style.pointerEvents="",e.removeAttribute(Qn),S.current=false;}}),A=vn(()=>!!r.current.openEvent&&["click","mousedown"].includes(r.current.openEvent.type));i.useEffect(()=>{if(l&&ue(s.domReference)){var e;const o=s.domReference;return n&&o.addEventListener("mouseleave",a),null==(e=s.floating)||e.addEventListener("mouseleave",a),m&&o.addEventListener("mousemove",t,{once:true}),o.addEventListener("mouseenter",t),o.addEventListener("mouseleave",i),()=>{var e;n&&o.removeEventListener("mouseleave",a),null==(e=s.floating)||e.removeEventListener("mouseleave",a),m&&o.removeEventListener("mousemove",t),o.removeEventListener("mouseenter",t),o.removeEventListener("mouseleave",i);}}function t(e){if(clearTimeout(b.current),N.current=false,d&&!je(w.current)||f>0&&!Xn(v.current,"open"))return;const t=Xn(v.current,"open",w.current);t?b.current=window.setTimeout(()=>{y.current||o(true,e,"hover");},t):n||o(true,e,"hover");}function i(e){if(A())return;D.current();const t=ze(s.floating);if(clearTimeout(k.current),x.current=false,g.current&&r.current.floatingContext){n||clearTimeout(b.current),C.current=g.current({...r.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){T(),M(),A()||I(e,true,"safe-polygon");}});const i=C.current;return t.addEventListener("mousemove",i),void(D.current=()=>{t.removeEventListener("mousemove",i);})}("touch"!==w.current||!Oe(s.floating,e.relatedTarget))&&I(e);}function a(e){A()||r.current.floatingContext&&(null==g.current||g.current({...r.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){T(),M(),A()||I(e);}})(e));}},[s,l,e,d,f,m,I,M,T,o,n,y,h,v,g,r,A]),Tn(()=>{var e;if(l&&n&&null!=(e=g.current)&&e.__options.blockPointerEvents&&E()){S.current=true;const e=s.floating;if(ue(s.domReference)&&e){var t;const n=ze(s.floating).body;n.setAttribute(Qn,"");const i=s.domReference,o=null==h||null==(t=h.nodesRef.current.find(e=>e.id===p))||null==(t=t.context)?void 0:t.elements.floating;return o&&(o.style.pointerEvents=""),n.style.pointerEvents="none",i.style.pointerEvents="auto",e.style.pointerEvents="auto",()=>{n.style.pointerEvents="",i.style.pointerEvents="",e.style.pointerEvents="";}}}},[l,n,p,s,h,g,E]),Tn(()=>{n||(w.current=void 0,x.current=false,M(),T());},[n,M,T]),i.useEffect(()=>()=>{M(),clearTimeout(b.current),clearTimeout(k.current),T();},[l,s.domReference,M,T]);const P=i.useMemo(()=>{function e(e){w.current=e.pointerType;}return {onPointerDown:e,onPointerEnter:e,onMouseMove(e){const{nativeEvent:t}=e;function i(){N.current||y.current||o(true,t,"hover");}d&&!je(w.current)||n||0===f||x.current&&e.movementX**2+e.movementY**2<2||(clearTimeout(k.current),"touch"===w.current?i():(x.current=true,k.current=window.setTimeout(i,f)));}}},[d,o,n,y,f]),O=i.useMemo(()=>({onMouseEnter(){clearTimeout(b.current);},onMouseLeave(e){A()||I(e.nativeEvent,false);}}),[I,A]);return i.useMemo(()=>l?{reference:P,floating:O}:{},[l,P,O])}(F,{enabled:P,delay:{open:75},handleClose:zi({blockPointerEvents:true})}),H=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,elements:{domReference:a}}=e,{enabled:s=true,event:l="click",toggle:c=true,ignoreMouse:u=false,keyboardHandlers:d=true,stickIfOpen:f=true}=t,m=i.useRef(),h=i.useRef(false),p=i.useMemo(()=>({onPointerDown(e){m.current=e.pointerType;},onMouseDown(e){const t=m.current;0===e.button&&"click"!==l&&(je(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"mousedown"!==r.current.openEvent.type?(e.preventDefault(),o(true,e.nativeEvent,"click")):o(false,e.nativeEvent,"click")));},onClick(e){const t=m.current;"mousedown"===l&&m.current?m.current=void 0:je(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"click"!==r.current.openEvent.type?o(true,e.nativeEvent,"click"):o(false,e.nativeEvent,"click"));},onKeyDown(e){m.current=void 0,e.defaultPrevented||!d||Ni(e)||(" "!==e.key||Si(a)||(e.preventDefault(),h.current=true),"Enter"===e.key&&o(!n||!c,e.nativeEvent,"click"));},onKeyUp(e){e.defaultPrevented||!d||Ni(e)||Si(a)||" "===e.key&&h.current&&(h.current=false,o(!n||!c,e.nativeEvent,"click"));}}),[r,a,l,u,d,o,n,f,c]);return i.useMemo(()=>s?{reference:p}:{},[s,p])}(F,{event:"mousedown",toggle:!P,ignoreMouse:P}),j=function(e,t){var n;void 0===t&&(t={});const{open:o,floatingId:r}=e,{enabled:a=true,role:s="dialog"}=t,l=null!=(n=Hi.get(s))?n:s,c=Hn(),u=null!=Un(),d=i.useMemo(()=>"tooltip"===l||"label"===s?{["aria-"+("label"===s?"labelledby":"describedby")]:o?r:void 0}:{"aria-expanded":o?"true":"false","aria-haspopup":"alertdialog"===l?"dialog":l,"aria-controls":o?r:void 0,..."listbox"===l&&{role:"combobox"},..."menu"===l&&{id:c},..."menu"===l&&u&&{role:"menuitem"},..."select"===s&&{"aria-autocomplete":"none"},..."combobox"===s&&{"aria-autocomplete":"list"}},[l,r,u,o,c,s]),f=i.useMemo(()=>{const e={id:r,...l&&{role:l}};return "tooltip"===l||"label"===s?e:{...e,..."menu"===l&&{"aria-labelledby":c}}},[l,r,c,s]),m=i.useCallback(e=>{let{active:t,selected:n}=e;const i={role:"option",...t&&{id:r+"-option"}};switch(s){case "select":return {...i,"aria-selected":t&&n};case "combobox":return {...i,...t&&{"aria-selected":true}}}return {}},[r,s]);return i.useMemo(()=>a?{reference:d,floating:f,item:m}:{},[a,d,f,m])}(F,{role:"menu"}),z=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,elements:r,dataRef:a}=e,{enabled:s=true,escapeKey:l=true,outsidePress:c=true,outsidePressEvent:u="pointerdown",referencePress:d=false,referencePressEvent:f="pointerdown",ancestorScroll:m=false,bubbles:h,capture:p}=t,g=Wn(),v=vn("function"==typeof c?c:()=>false),y="function"==typeof c?v:c,w=i.useRef(false),b=i.useRef(false),{escapeKey:C,outsidePress:k}=Ei(h),{escapeKey:N,outsidePress:S}=Ei(p),D=i.useRef(false),x=vn(e=>{var t;if(!n||!s||!l||"Escape"!==e.key)return;if(D.current)return;const i=null==(t=a.current.floatingContext)?void 0:t.nodeId,r=g?ti(g.nodesRef.current,i):[];if(!C&&(e.stopPropagation(),r.length>0)){let e=true;if(r.forEach(t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__escapeKeyBubbles||(e=false);}),!e)return}o(false,function(e){return "nativeEvent"in e}(e)?e.nativeEvent:e,"escape-key");}),E=vn(e=>{var t;const n=()=>{var t;x(e),null==(t=Ve(e))||t.removeEventListener("keydown",n);};null==(t=Ve(e))||t.addEventListener("keydown",n);}),I=vn(e=>{var t;const n=w.current;w.current=false;const i=b.current;if(b.current=false,"click"===u&&i)return;if(n)return;if("function"==typeof y&&!y(e))return;const s=Ve(e),l="["+qn("inert")+"]",c=ze(r.floating).querySelectorAll(l);let d=ue(s)?s:null;for(;d&&!De(d);){const e=Ie(d);if(De(e)||!ue(e))break;d=e;}if(c.length&&ue(s)&&!s.matches("html,body")&&!Oe(s,r.floating)&&Array.from(c).every(e=>!Oe(d,e)))return;if(de(s)&&A){const t=s.clientWidth>0&&s.scrollWidth>s.clientWidth,n=s.clientHeight>0&&s.scrollHeight>s.clientHeight;let i=n&&e.offsetX>s.clientWidth;if(n&&"rtl"===xe(s).direction&&(i=e.offsetX<=s.offsetWidth-s.clientWidth),i||t&&e.offsetY>s.clientHeight)return}const f=null==(t=a.current.floatingContext)?void 0:t.nodeId,m=g&&ti(g.nodesRef.current,f).some(t=>{var n;return $e(e,null==(n=t.context)?void 0:n.elements.floating)});if($e(e,r.floating)||$e(e,r.domReference)||m)return;const h=g?ti(g.nodesRef.current,f):[];if(h.length>0){let e=true;if(h.forEach(t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__outsidePressBubbles||(e=false);}),!e)return}o(false,e,"outside-press");}),M=vn(e=>{var t;const n=()=>{var t;I(e),null==(t=Ve(e))||t.removeEventListener(u,n);};null==(t=Ve(e))||t.addEventListener(u,n);});i.useEffect(()=>{if(!n||!s)return;a.current.__escapeKeyBubbles=C,a.current.__outsidePressBubbles=k;let e=-1;function t(e){o(false,e,"ancestor-scroll");}function i(){window.clearTimeout(e),D.current=true;}function c(){e=window.setTimeout(()=>{D.current=false;},Ne()?5:0);}const d=ze(r.floating);l&&(d.addEventListener("keydown",N?E:x,N),d.addEventListener("compositionstart",i),d.addEventListener("compositionend",c)),y&&d.addEventListener(u,S?M:I,S);let f=[];return m&&(ue(r.domReference)&&(f=Te(r.domReference)),ue(r.floating)&&(f=f.concat(Te(r.floating))),!ue(r.reference)&&r.reference&&r.reference.contextElement&&(f=f.concat(Te(r.reference.contextElement)))),f=f.filter(e=>{var t;return e!==(null==(t=d.defaultView)?void 0:t.visualViewport)}),f.forEach(e=>{e.addEventListener("scroll",t,{passive:true});}),()=>{l&&(d.removeEventListener("keydown",N?E:x,N),d.removeEventListener("compositionstart",i),d.removeEventListener("compositionend",c)),y&&d.removeEventListener(u,S?M:I,S),f.forEach(e=>{e.removeEventListener("scroll",t);}),window.clearTimeout(e);}},[a,r,l,y,u,n,o,m,s,C,k,x,N,E,I,S,M]),i.useEffect(()=>{w.current=false;},[y,u]);const T=i.useMemo(()=>({onKeyDown:x,[Di[f]]:e=>{d&&o(false,e.nativeEvent,"reference-press");}}),[x,o,d,f]),A=i.useMemo(()=>({onKeyDown:x,onMouseDown(){b.current=true;},onMouseUp(){b.current=true;},[xi[u]]:()=>{w.current=true;}}),[x,u]);return i.useMemo(()=>s?{reference:T,floating:A}:{},[s,T,A])}(F,{bubbles:true}),$=_i(F,{listRef:S,activeIndex:C,nested:P,onNavigate:N}),{getReferenceProps:V,getFloatingProps:Y,getItemProps:U}=function(e){ void 0===e&&(e=[]);const t=e.map(e=>null==e?void 0:e.reference),n=e.map(e=>null==e?void 0:e.floating),o=e.map(e=>null==e?void 0:e.item),r=i.useCallback(t=>Pi(t,e,"reference"),t),a=i.useCallback(t=>Pi(t,e,"floating"),n),s=i.useCallback(t=>Pi(t,e,"item"),o);return i.useMemo(()=>({getReferenceProps:r,getFloatingProps:a,getItemProps:s}),[r,a,s])}([_,H,j,z,$]);useEffect(()=>{if(E)return E.events.on("click",e),E.events.on("menuopen",t),()=>{E.events.off("click",e),E.events.off("menuopen",t);};function e(){y(false);}function t(e){e.nodeId!==I&&e.parentId===M&&y(false);}},[E,I,M]),useEffect(()=>{v&&E&&E.events.emit("menuopen",{parentId:M,nodeId:I});},[E,v,I,M]);const W={activeIndex:C,setActiveIndex:N,getItemProps:U,setHasFocusInside:b,isOpen:v,setIsOpen:y},K=useMemo(()=>W,[C,N,U,b,v]),J=k("io-dropdown-menu-button",P&&"io-dropdown-menu-item",v&&!P&&"active",n),q=hn([L.setReference,T.ref,g]),G=x.activeIndex===T.index?0:-1;return jsxRuntimeExports.jsxs(Kn,{id:I,children:[jsxRuntimeExports.jsx(A,{className:J,ref:q,variant:P?"link":o,tabIndex:P?G:void 0,role:P?"menuitem":void 0,"data-open":v?"":void 0,"data-nested":P?"":void 0,"data-focus-inside":w?"":void 0,text:f,icon:P?"chevron-right":r,iconSize:"10",iconRight:!!P||a,disabled:m,...V(x.getItemProps({onFocus(e){p.onFocus?.(e),b(false),x.setHasFocusInside(true);},...p}))}),jsxRuntimeExports.jsx($i.Provider,{value:K,children:jsxRuntimeExports.jsx(On,{elementsRef:S,labelsRef:D,children:v&&jsxRuntimeExports.jsx(ki,{context:F,modal:false,initialFocus:P?-1:0,returnFocus:!P,children:jsxRuntimeExports.jsx("div",{ref:L.setFloating,className:"io-dropdown-menu",style:O,...Y(),children:h})})})})]})});Yi.displayName="DropdownMenu";const Ui=forwardRef(({...t},n)=>null===Un()?jsxRuntimeExports.jsx(Jn,{children:jsxRuntimeExports.jsx(Yi,{ref:n,...t})}):jsxRuntimeExports.jsx(Yi,{ref:n,...t}));function Ki({className:n,size:i="large",variant:o="default",align:r="up",text:a,...s}){const l=k("io-loader",{[`io-loader-${o}`]:"default"!==o},"normal"===i&&"io-loader-md","small"===i&&"io-loader-sm",r&&[`direction-${r}`],n);return jsxRuntimeExports.jsxs("div",{className:l,role:"status","aria-live":"polite",...s,children:[jsxRuntimeExports.jsx("div",{className:"io-loader-icon"}),a&&jsxRuntimeExports.jsx("div",{className:"io-loader-text",children:a})]})}function Ji({className:t,children:n,...i}){const o=k("io-panel-header",t);return jsxRuntimeExports.jsx(Z,{className:o,...i,children:n})}Ui.displayName="DropdownMenu",Ui.Item=Vi,Ui.Separator=J,Ji.Title=I,Ji.ButtonGroup=X,Ji.Button=A,Ji.ButtonIcon=S,Ji.Dropdown=Q;const qi=forwardRef(({className:t,children:n,...i},o)=>{const r=k("io-panel-body",t);return jsxRuntimeExports.jsx("div",{className:r,ref:o,...i,children:n})});function Gi({className:t,...n}){const i=k("io-panel-footer",t);return jsxRuntimeExports.jsx(ne,{className:i,...n})}function Qi({className:t,children:n,...i}){const o=k("io-panel",t);return jsxRuntimeExports.jsx("div",{className:o,"data-testid":"panel",...i,children:n})}function Xi({className:t,variant:n="default",children:i,...o}){const r=k("io-pill","default"!==n&&[`io-pill-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,role:"status",...o,children:i})}function Zi({className:t,variant:n="active",value:i=0,...o}){const r=k("io-progress",n,t);let a;return a=i<0?0:i>100?100:i,jsxRuntimeExports.jsx("div",{className:r,role:"progressbar","aria-valuenow":a,"aria-valuemin":0,"aria-valuemax":100,...o,children:jsxRuntimeExports.jsx("div",{className:"io-progress-bar",style:{width:`${a}%`}})})}function eo({text:t="Label",...n}){return jsxRuntimeExports.jsx("label",{...n,children:t})}qi.displayName="PanelBody",Gi.ButtonGroup=X,Gi.Button=A,Gi.ButtonIcon=S,Gi.Dropdown=Q,Qi.Header=Ji,Qi.Body=qi,Qi.Footer=Gi,Xi.Icon=N;const to=forwardRef(({id:n="input",className:i,type:o="text",name:a="input",align:s="up",label:l,iconPrepend:c,iconPrependOnClick:u,iconAppend:d,iconAppendOnClick:f,placeholder:m,disabled:h,readOnly:p,errorMessage:g,errorDataTestId:v,...y},w)=>{const b=k("io-control-input",c&&"io-control-leading-icon",d&&"io-control-trailing-icon",h&&"io-control-disabled",p&&"io-control-readonly",g&&"io-control-error",s&&[`direction-${s}`],i),C=useCallback(e=>{h?e.preventDefault():u&&u(e);},[u,h]),S=useCallback(e=>{h?e.preventDefault():f&&f(e);},[f,h]);return jsxRuntimeExports.jsxs("div",{className:b,children:[l&&jsxRuntimeExports.jsx(eo,{htmlFor:n,text:l}),c&&jsxRuntimeExports.jsx(N,{variant:c,onClick:e=>C(e)}),jsxRuntimeExports.jsx("input",{id:n,className:"io-input",ref:w,type:o,name:a,tabIndex:0,placeholder:m??(()=>{switch(o){case "email":return "Enter your email here...";case "number":return "Enter number here...";case "password":return "Enter your password here...";case "tel":return "Enter your phone number here...";case "file":return "Select a file...";default:return "Enter text here..."}})(),"aria-label":l,disabled:h,readOnly:p,...g?{"aria-invalid":true,"aria-describedby":`${n}-error`}:{},...y}),d&&jsxRuntimeExports.jsx(N,{variant:d,onClick:e=>S(e)}),g&&jsxRuntimeExports.jsxs("div",{"data-testid":v,id:`${n}-error`,className:"io-input-error",children:[jsxRuntimeExports.jsx(N,{variant:"close"}),g]})]})});to.displayName="Input";const no=forwardRef(({id:n="textarea",className:i,name:o="textarea",align:r="up",label:a,rows:s=4,placeholder:l="Enter text here...",disabled:c,readOnly:u,...d},f)=>{const m=k("io-control-textarea",c&&"io-control-disabled",u&&"io-control-readonly",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:m,children:[a&&jsxRuntimeExports.jsx(eo,{htmlFor:n,text:a}),jsxRuntimeExports.jsx("textarea",{id:n,className:"io-textarea",ref:f,name:o,tabIndex:0,placeholder:l,"aria-label":a,disabled:c,readOnly:u,rows:s,...d})]})});no.displayName="Textarea";const io=forwardRef(({id:n="checkbox",className:i,name:o="checkbox",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=k("io-control-checkbox",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,tabIndex:l?-1:0,checked:s,disabled:l,"aria-checked":s,...c}),a&&jsxRuntimeExports.jsx(eo,{htmlFor:n,text:a})]})});io.displayName="Checkbox";const oo=forwardRef(({id:n="radio",className:i,name:o="radio",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=k("io-control-radio",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"radio",id:n,className:"io-radio",ref:u,name:o,tabIndex:l?-1:0,checked:s,disabled:l,"aria-checked":s,...c}),a&&jsxRuntimeExports.jsx(eo,{htmlFor:n,text:a})]})});oo.displayName="Radio";const ro=forwardRef(({id:n,className:i,name:o="toggle",align:r="left",label:a,checked:s,disabled:l,onKeyDown:c,...u},d)=>{const f=useId(),h=n||`toggle-${f}`,p=k("io-control-toggle",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsx("div",{className:p,children:jsxRuntimeExports.jsxs("label",{className:"io-toggle",htmlFor:h,tabIndex:l?-1:0,onKeyDown:c,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:h,className:"io-checkbox",ref:d,name:o,checked:s,disabled:l,"aria-checked":s,tabIndex:-1,...u}),jsxRuntimeExports.jsx("span",{className:"slider"}),a]})})});function lo(e,t=500){const[n,i]=useState(e);return useEffect(()=>{const n=setTimeout(()=>{i(e);},t);return ()=>clearTimeout(n)},[e,t]),n}ro.displayName="Toggle";const mo=()=>void 0!==window.glue42gd||void 0!==window.iodesktop;function ho(){return useMemo(()=>"object"==typeof window&&mo(),[])}createContext({theme:"dark"});const yo="___platform_prefs___",So="_launchpad_pinnedPosition",Do="_launchpad_allowDocking",xo="_launchpad_minimizeToTray",Eo="_launchpad_autoCloseStartingAppsAndWorkspaces",Io="_launchpad_showTutorialOnStartup",Mo="_layouts_restoreLastSaved",To="_layouts_saveCurrentOnExit",Ao="_layouts_showUnsavedChangesPrompt",Po="_layouts_showDeletePrompt",Oo="_downloads_askForEachDownload",Yo=e=>"string"==typeof e?e:e?.message?"string"==typeof e.message?e.message:JSON.stringify(e.message):JSON.stringify(e),Uo="warning",Wo={success:5e3,warning:1e4};var Ko=function(e){return {ok:true,result:e}},Jo=function(e){return {ok:false,error:e}},qo=function(e,t,n){return  false===t.ok?t:false===n.ok?n:Ko(e(t.result,n.result))},Go=function(e,t){return  true===t.ok?t:Jo(e(t.error))},Qo=function(){return Qo=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},Qo.apply(this,arguments)};function Xo(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!Xo(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!Xo(e[i[n]],t[i[n]]))return  false}return  true}}var Zo=function(e){return Array.isArray(e)},er=function(e){return "object"==typeof e&&null!==e&&!Zo(e)},tr=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},nr=function(e){return e.map(function(e){return "string"==typeof e?"."+e:"["+e+"]"}).join("")},ir=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return Qo({at:e+(n||"")},i)},or=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return Go(function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}},n.decode(e))},this.runPromise=function(e){return  true===(t=n.run(e)).ok?Promise.resolve(t.result):Promise.reject(t.error);var t;},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e(function(e){return function(e,t){return  true===t.ok?Ko(e(t.result)):t}(t,n.decode(e))})},this.andThen=function(t){return new e(function(e){return function(e,t){return  true===t.ok?e(t.result):t}(function(n){return t(n).decode(e)},n.decode(e))})},this.where=function(t,i){return n.andThen(function(n){return t(n)?e.succeed(n):e.fail(i)})};}return e.string=function(){return new e(function(e){return "string"==typeof e?Ko(e):Jo({message:tr("a string",e)})})},e.number=function(){return new e(function(e){return "number"==typeof e?Ko(e):Jo({message:tr("a number",e)})})},e.boolean=function(){return new e(function(e){return "boolean"==typeof e?Ko(e):Jo({message:tr("a boolean",e)})})},e.constant=function(t){return new e(function(e){return Xo(e,t)?Ko(t):Jo({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})})},e.object=function(t){return new e(function(e){if(er(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?Jo({message:"the key '"+i+"' is required but was not present"}):Jo(ir("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return Ko(n)}return er(e)?Ko(e):Jo({message:tr("an object",e)})})},e.array=function(t){return new e(function(e){if(Zo(e)&&t){return e.reduce(function(e,n,i){return qo(function(e,t){return e.concat([t])},e,function(e,n){return Go(function(e){return ir("["+n+"]",e)},t.decode(e))}(n,i))},Ko([]))}return Zo(e)?Ko(e):Jo({message:tr("an array",e)})})},e.tuple=function(t){return new e(function(e){if(Zo(e)){if(e.length!==t.length)return Jo({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return Jo(ir("["+i+"]",o.error));n[i]=o.result;}return Ko(n)}return Jo({message:tr("a tuple of length "+t.length,e)})})},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e(function(e){return [t,n].concat(i).reduce(function(t,n){return qo(Object.assign,t,n.decode(e))},Ko({}))})},e.anyJson=function(){return new e(function(e){return Ko(e)})},e.unknownJson=function(){return new e(function(e){return Ko(e)})},e.dict=function(t){return new e(function(e){if(er(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return Jo(ir("."+i,o.error));n[i]=o.result;}return Ko(n)}return Jo({message:tr("an object",e)})})},e.optional=function(t){return new e(function(e){return null==e?Ko(void 0):t.decode(e)})},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e(function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map(function(e){return "at error"+(e.at||"")+": "+e.message}).join('", "');return Jo({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})})},e.withDefault=function(t,n){return new e(function(e){return Ko(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))})},e.valueAt=function(t,n){return new e(function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return Jo({at:nr(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!er(i))return Jo({at:nr(t.slice(0,o+1)),message:tr("an object",i)});if("number"==typeof t[o]&&!Zo(i))return Jo({at:nr(t.slice(0,o+1)),message:tr("an array",i)});i=i[t[o]];}return Go(function(e){return void 0===i?{at:nr(t),message:"path does not exist"}:ir(nr(t),e)},n.decode(i))})},e.succeed=function(t){return new e(function(e){return Ko(t)})},e.fail=function(t){return new e(function(e){return Jo({message:t})})},e.lazy=function(t){return new e(function(e){return t().decode(e)})},e}(),rr=or.string;or.number;var ar=or.boolean,sr=or.anyJson;or.unknownJson;var lr=or.constant,cr=or.object,ur=or.array;or.tuple,or.dict;var dr=or.optional,fr=or.oneOf;or.union,or.intersection,or.withDefault,or.valueAt,or.succeed,or.fail,or.lazy;const mr=["name","title","version","customProperties","icon","caption","type"],hr=["appId","name","type","details","version","title","tooltip","lang","description","categories","icons","screenshots","contactEmail","moreInfo","publisher","customConfig","hostManifests","interop","localizedVersions"];var pr=function(e){return {ok:true,result:e}},gr=function(e){return {ok:false,error:e}},vr=function(e,t,n){return  false===t.ok?t:false===n.ok?n:pr(e(t.result,n.result))},yr=function(e,t){return  true===t.ok?t:gr(e(t.error))},wr=function(){return wr=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},wr.apply(this,arguments)};function br(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!br(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!br(e[i[n]],t[i[n]]))return  false}return  true}}var Cr=function(e){return Array.isArray(e)},kr=function(e){return "object"==typeof e&&null!==e&&!Cr(e)},Nr=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},Sr=function(e){return e.map(function(e){return "string"==typeof e?"."+e:"["+e+"]"}).join("")},Dr=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return wr({at:e+(n||"")},i)},xr=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return yr(function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}},n.decode(e))},this.runPromise=function(e){return  true===(t=n.run(e)).ok?Promise.resolve(t.result):Promise.reject(t.error);var t;},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e(function(e){return function(e,t){return  true===t.ok?pr(e(t.result)):t}(t,n.decode(e))})},this.andThen=function(t){return new e(function(e){return function(e,t){return  true===t.ok?e(t.result):t}(function(n){return t(n).decode(e)},n.decode(e))})},this.where=function(t,i){return n.andThen(function(n){return t(n)?e.succeed(n):e.fail(i)})};}return e.string=function(){return new e(function(e){return "string"==typeof e?pr(e):gr({message:Nr("a string",e)})})},e.number=function(){return new e(function(e){return "number"==typeof e?pr(e):gr({message:Nr("a number",e)})})},e.boolean=function(){return new e(function(e){return "boolean"==typeof e?pr(e):gr({message:Nr("a boolean",e)})})},e.constant=function(t){return new e(function(e){return br(e,t)?pr(t):gr({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})})},e.object=function(t){return new e(function(e){if(kr(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?gr({message:"the key '"+i+"' is required but was not present"}):gr(Dr("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return pr(n)}return kr(e)?pr(e):gr({message:Nr("an object",e)})})},e.array=function(t){return new e(function(e){if(Cr(e)&&t){return e.reduce(function(e,n,i){return vr(function(e,t){return e.concat([t])},e,function(e,n){return yr(function(e){return Dr("["+n+"]",e)},t.decode(e))}(n,i))},pr([]))}return Cr(e)?pr(e):gr({message:Nr("an array",e)})})},e.tuple=function(t){return new e(function(e){if(Cr(e)){if(e.length!==t.length)return gr({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return gr(Dr("["+i+"]",o.error));n[i]=o.result;}return pr(n)}return gr({message:Nr("a tuple of length "+t.length,e)})})},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e(function(e){return [t,n].concat(i).reduce(function(t,n){return vr(Object.assign,t,n.decode(e))},pr({}))})},e.anyJson=function(){return new e(function(e){return pr(e)})},e.unknownJson=function(){return new e(function(e){return pr(e)})},e.dict=function(t){return new e(function(e){if(kr(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return gr(Dr("."+i,o.error));n[i]=o.result;}return pr(n)}return gr({message:Nr("an object",e)})})},e.optional=function(t){return new e(function(e){return null==e?pr(void 0):t.decode(e)})},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e(function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map(function(e){return "at error"+(e.at||"")+": "+e.message}).join('", "');return gr({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})})},e.withDefault=function(t,n){return new e(function(e){return pr(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))})},e.valueAt=function(t,n){return new e(function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return gr({at:Sr(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!kr(i))return gr({at:Sr(t.slice(0,o+1)),message:Nr("an object",i)});if("number"==typeof t[o]&&!Cr(i))return gr({at:Sr(t.slice(0,o+1)),message:Nr("an array",i)});i=i[t[o]];}return yr(function(e){return void 0===i?{at:Sr(t),message:"path does not exist"}:Dr(Sr(t),e)},n.decode(i))})},e.succeed=function(t){return new e(function(e){return pr(t)})},e.fail=function(t){return new e(function(e){return gr({message:t})})},e.lazy=function(t){return new e(function(e){return t().decode(e)})},e}(),Er=xr.string,Ir=xr.number,Mr=xr.boolean,Tr=xr.anyJson;xr.unknownJson;var Ar=xr.constant,Pr=xr.object,Or=xr.array;xr.tuple;var Lr=xr.dict,Fr=xr.optional,Br=xr.oneOf;xr.union,xr.intersection,xr.withDefault,xr.valueAt,xr.succeed,xr.fail,xr.lazy;const Rr=Er().where(e=>e.length>0,"Expected a non-empty string"),_r=Ir().where(e=>e>=0,"Expected a non-negative number"),Hr=Pr({name:Rr,displayName:Fr(Er()),contexts:Fr(Or(Er())),customConfig:Fr(Pr())}),jr=Br(Ar("web"),Ar("native"),Ar("citrix"),Ar("onlineNative"),Ar("other")),zr=Pr({url:Rr}),$r=Pr({src:Rr,size:Fr(Rr),type:Fr(Rr)}),Vr=Pr({src:Rr,size:Fr(Rr),type:Fr(Rr),label:Fr(Rr)}),Yr=Pr({contexts:Or(Rr),displayName:Fr(Rr),resultType:Fr(Rr),customConfig:Fr(Tr())}),Ur=Pr({listensFor:Fr(Lr(Yr)),raises:Fr(Lr(Or(Rr)))}),Wr=Pr({broadcasts:Fr(Or(Rr)),listensFor:Fr(Or(Rr))}),Kr=Pr({name:Rr,description:Fr(Rr),broadcasts:Fr(Or(Rr)),listensFor:Fr(Or(Rr))}),Jr=Pr({intents:Fr(Ur),userChannels:Fr(Wr),appChannels:Fr(Or(Kr))}),qr=Pr({url:Fr(Rr),top:Fr(Ir()),left:Fr(Ir()),width:Fr(_r),height:Fr(_r)}),Gr=Pr({name:Fr(Rr),type:Fr(Rr.where(e=>"window"===e,"Expected a value of window")),title:Fr(Rr),version:Fr(Rr),customProperties:Fr(Tr()),icon:Fr(Er()),caption:Fr(Er()),details:Fr(qr),intents:Fr(Or(Hr)),hidden:Fr(Mr())}),Qr=Pr({name:Rr,appId:Rr,title:Fr(Rr),version:Fr(Rr),manifest:Rr,manifestType:Rr,tooltip:Fr(Rr),description:Fr(Rr),contactEmail:Fr(Rr),supportEmail:Fr(Rr),publisher:Fr(Rr),images:Fr(Or(Pr({url:Fr(Rr)}))),icons:Fr(Or(Pr({icon:Fr(Rr)}))),customConfig:Tr(),intents:Fr(Or(Hr))}),Xr=Pr({appId:Fr(Rr),name:Fr(Rr),details:Fr(zr),version:Fr(Rr),title:Fr(Rr),tooltip:Fr(Rr),lang:Fr(Rr),description:Fr(Rr),categories:Fr(Or(Rr)),icons:Fr(Or($r)),screenshots:Fr(Or(Vr)),contactEmail:Fr(Rr),supportEmail:Fr(Rr),moreInfo:Fr(Rr),publisher:Fr(Rr),customConfig:Fr(Or(Tr())),hostManifests:Fr(Tr()),interop:Fr(Jr)}),Zr=Pr({appId:Rr,name:Fr(Rr),type:jr,details:zr,version:Fr(Rr),title:Fr(Rr),tooltip:Fr(Rr),lang:Fr(Rr),description:Fr(Rr),categories:Fr(Or(Rr)),icons:Fr(Or($r)),screenshots:Fr(Or(Vr)),contactEmail:Fr(Rr),supportEmail:Fr(Rr),moreInfo:Fr(Rr),publisher:Fr(Rr),customConfig:Fr(Or(Tr())),hostManifests:Fr(Tr()),interop:Fr(Jr),localizedVersions:Fr(Lr(Xr))}),ea=Br(Qr,Zr),ta=e=>`${e.kind} at ${e.at}: ${JSON.stringify(e.input)}. Reason - ${e.message}`;class na{fdc3ToDesktopDefinitionType={web:"window",native:"exe",citrix:"citrix",onlineNative:"clickonce",other:"window"};toApi(){return {isFdc3Definition:this.isFdc3Definition.bind(this),parseToBrowserBaseAppData:this.parseToBrowserBaseAppData.bind(this),parseToDesktopAppConfig:this.parseToDesktopAppConfig.bind(this)}}isFdc3Definition(e){const t=ea.run(e);return t.ok?e.appId&&e.details?{isFdc3:true,version:"2.0"}:e.manifest?{isFdc3:true,version:"1.2"}:{isFdc3:false,reason:"The passed definition is not FDC3"}:{isFdc3:false,reason:ta(t.error)}}parseToBrowserBaseAppData(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const i=ea.run(e);if(!i.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${ta(i.error)}`);const o=this.getUserPropertiesFromDefinition(e,n),r={url:this.getUrl(e,n)},a={name:e.appId,type:"window",createOptions:r,userProperties:{...o,intents:"1.2"===n?o.intents:this.getIntentsFromV2AppDefinition(e),details:r},title:e.title,version:e.version,icon:this.getIconFromDefinition(e,n),caption:e.description,fdc3:"2.0"===n?{...e,definitionVersion:"2.0"}:void 0},s=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!s)return a;const l=Gr.run(s);if(!l.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${ta(l.error)}`);return Object.keys(l.result).length?this.mergeBaseAppDataWithGlueManifest(a,l.result):a}parseToDesktopAppConfig(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const i=ea.run(e);if(!i.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${ta(i.error)}`);if("1.2"===n){const t=e;return {name:t.appId,type:"window",details:{url:this.getUrl(e,n)},version:t.version,title:t.title,tooltip:t.tooltip,caption:t.description,icon:t.icons?.[0].icon,intents:t.intents,customProperties:{manifestType:t.manifestType,images:t.images,contactEmail:t.contactEmail,supportEmail:t.supportEmail,publisher:t.publisher,icons:t.icons,customConfig:t.customConfig}}}const o=e,r={name:o.appId,type:this.fdc3ToDesktopDefinitionType[o.type],details:o.details,version:o.version,title:o.title,tooltip:o.tooltip,caption:o.description,icon:this.getIconFromDefinition(o,"2.0"),intents:this.getIntentsFromV2AppDefinition(o),fdc3:{...o,definitionVersion:"2.0"}},a=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!a)return r;if("object"!=typeof a||Array.isArray(a))throw new Error(`Invalid '${e.hostManifests.ioConnect?"hostManifests.ioConnect":"hostManifests['Glue42']"}' key`);return this.mergeDesktopConfigWithGlueManifest(r,a)}getUserPropertiesFromDefinition(e,t){return "1.2"===t?Object.fromEntries(Object.entries(e).filter(([e])=>!mr.includes(e))):Object.fromEntries(Object.entries(e).filter(([e])=>!mr.includes(e)&&!hr.includes(e)))}getUrl(e,t){let n;if("1.2"===t){const t=JSON.parse(e.manifest);n=t.details?.url||t.url;}else n=e.details?.url;if(!n||"string"!=typeof n)throw new Error(`Invalid FDC3 ${t} definition. Provide valid 'url' under '${"1.2"===t?"manifest":"details"}' key`);return n}getIntentsFromV2AppDefinition(e){const t=e.interop?.intents?.listensFor;if(!t)return;return Object.entries(t).map(e=>{const[t,n]=e;return {name:t,...n}})}getIconFromDefinition(e,t){return "1.2"===t?e.icons?.find(e=>e.icon)?.icon||void 0:e.icons?.find(e=>e.src)?.src||void 0}mergeBaseAppDataWithGlueManifest(e,t){let n=e;if(t.customProperties&&(n.userProperties={...e.userProperties,...t.customProperties}),t.details){const i={...e.createOptions,...t.details};n.createOptions=i,n.userProperties.details=i;}return Array.isArray(t.intents)&&(n.userProperties.intents=(n.userProperties.intents||[]).concat(t.intents)),n={...n,...t},delete n.details,delete n.intents,n}mergeDesktopConfigWithGlueManifest(e,t){const n=Object.assign({},e,t,{details:{...e.details,...t.details}});return Array.isArray(t.intents)&&(n.intents=(e.intents||[]).concat(t.intents)),n}}const ia={common:{nonEmptyStringDecoder:Rr,nonNegativeNumberDecoder:_r},fdc3:{allDefinitionsDecoder:ea,v1DefinitionDecoder:Qr,v2DefinitionDecoder:Zr}};var oa;!function(e){e.USER_CANCELLED="User Closed Intents Resolver UI without choosing a handler",e.CALLER_NOT_DEFINED="Caller Id is not defined",e.TIMEOUT_HIT="Timeout hit",e.INTENT_NOT_FOUND="Cannot find Intent",e.HANDLER_NOT_FOUND="Cannot find Intent Handler",e.TARGET_INSTANCE_UNAVAILABLE="Cannot start Target Instance",e.INTENT_DELIVERY_FAILED="Target Instance did not add a listener",e.RESOLVER_UNAVAILABLE="Intents Resolver UI unavailable",e.RESOLVER_TIMEOUT="User did not choose a handler",e.INVALID_RESOLVER_RESPONSE="Intents Resolver UI returned invalid response",e.INTENT_HANDLER_REJECTION="Intent Handler function processing the raised intent threw an error or rejected the promise it returned";}(oa||(oa={}));const ra=new class{_fdc3;_decoders=ia;_errors={intents:oa};get fdc3(){return this._fdc3||(this._fdc3=(new na).toApi()),this._fdc3}get decoders(){return this._decoders}get errors(){return this._errors}};ra.fdc3;const aa=ra.decoders;ra.errors;const sa=aa.common.nonEmptyStringDecoder,la=fr(lr("add"),lr("align-bottom"),lr("align-bottom-solid"),lr("align-left"),lr("align-left-bottom"),lr("align-left-bottom-solid"),lr("align-left-solid"),lr("align-left-top"),lr("align-left-top-solid"),lr("align-right"),lr("align-right-bottom"),lr("align-right-bottom-solid"),lr("align-right-solid"),lr("align-right-top"),lr("align-right-top-solid"),lr("align-top"),lr("align-top-solid"),lr("always-on-top"),lr("always-on-top-on"),lr("application"),lr("arrow-down-long"),lr("arrow-down-to-bracket"),lr("arrow-left-long"),lr("arrow-right-from-bracket"),lr("arrow-right-long"),lr("arrow-right"),lr("arrow-up"),lr("arrow-up-long"),lr("ban"),lr("bell"),lr("bell-solid"),lr("bookmark"),lr("bullseye-pointer"),lr("certificate"),lr("check"),lr("check-light"),lr("check-solid"),lr("chevron-down"),lr("chevron-left"),lr("chevron-right"),lr("chevron-up"),lr("circle-info"),lr("circle-xmark"),lr("circle-xmark-full"),lr("clock"),lr("clock-rotate-left"),lr("clone"),lr("close"),lr("cog"),lr("cog-solid"),lr("collapse"),lr("copy"),lr("download"),lr("delete-left"),lr("dev-tools"),lr("ellipsis"),lr("ellipsis-vertical"),lr("expand"),lr("envelope"),lr("envelope-open"),lr("exclamation-mark"),lr("expand"),lr("feedback"),lr("filter"),lr("floppy"),lr("floppy-disk-pen"),lr("folder"),lr("folder-open"),lr("globe"),lr("group"),lr("hidden"),lr("home"),lr("house"),lr("info"),lr("keyboard"),lr("layout"),lr("link"),lr("list-ul"),lr("lock"),lr("logo"),lr("minimize"),lr("minimize-down"),lr("paper-plane-top"),lr("paperclip"),lr("pause"),lr("pen-line"),lr("pen-to-square"),lr("pin"),lr("play"),lr("pop-in"),lr("pop-in-widget"),lr("pop-out"),lr("power-off"),lr("publish"),lr("refresh"),lr("resize"),lr("restore"),lr("rotate-right"),lr("search"),lr("search-filled"),lr("sliders"),lr("snooze"),lr("spinner"),lr("square"),lr("square-arrow-down"),lr("square-arrow-up"),lr("star"),lr("star-full"),lr("sticky-off"),lr("sticky-off-hover"),lr("sticky-on"),lr("sticky-on-hover"),lr("subscribe"),lr("system-close"),lr("system-maximize"),lr("system-minimize"),lr("thumbs-down"),lr("thumbs-up"),lr("trash"),lr("trash-can"),lr("triangle-exclamation"),lr("unlock"),lr("unpin"),lr("up-to-line"),lr("user"),lr("user-gear"),lr("visible"),lr("workspace")),ca=cr({id:sa,title:sa,description:dr(rr()),icon:dr(la),iconSrc:dr(sa),contextMenuActions:dr(ur(sr())),type:sa}),ua=fr(lr("Left"),lr("Right")),da=fr(lr("daily"),lr("weekly")),fa=fr(lr("Sunday"),lr("Monday"),lr("Tuesday"),lr("Wednesday"),lr("Thursday"),lr("Friday"),lr("Saturday")),ma=cr({customPrefs:dr(sr()),_launchpad_collapsedSections:dr(ur(sa)),_launchpad_favorites:dr(ur(ca)),_launchpad_isLayoutsPanelOpen:dr(ar()),_launchpad_isCollapsed:dr(ar()),_launchpad_isPinned:dr(ar()),_launchpad_pinnedPosition:dr(ua),_launchpad_allowDocking:dr(ar()),_launchpad_minimizeToTray:dr(ar()),_launchpad_autoCloseStartingAppsAndWorkspaces:dr(ar()),_launchpad_showTutorialOnStartup:dr(ar()),_layouts_restoreLastSaved:dr(ar()),_layouts_saveCurrentOnExit:dr(ar()),_layouts_showUnsavedChangesPrompt:dr(ar()),_layouts_showDeletePrompt:dr(ar()),_downloads_askForEachDownload:dr(ar()),_downloads_location:dr(rr()),_system_scheduleRestart:dr(ar()),_system_scheduleRestartTime:dr(sa),_system_scheduleRestartFrequency:dr(da),_system_scheduleRestartDay:dr(fa),_system_scheduleShutdown:dr(ar()),_system_scheduleShutdownTime:dr(sa),_system_scheduleShutdownFrequency:dr(da),_system_scheduleShutdownDay:dr(fa)}),ha=async e=>{const{io:t,variant:n,text:i,error:o}=e,r=Yo(o);try{if(n===Uo&&t.logger.warn(r?`${i} ${r}`:i),!("modals"in t)||!t.modals)throw new Error("Modals are not enabled.");const e={text:i,variant:n,ttl:Wo[n]};await t.modals.alerts.request(e);}catch(e){console.warn("Failed to request alert. ",{error:e});}},pa=createContext(void 0);function ya({prefKey:e}){const t=useContext(IOConnectContext),n=useContext(pa),i=n?.prefs?.[e],o=n?.isInitialSetupCompleted??false,[a,c]=useState(!o),[f,m]=useState(),h=useRef(0);useEffect(()=>{o&&0===h.current&&c(false);},[o]);const p=useCallback(async n=>{if(!t)return;const i=++h.current;c(true),m(void 0);const o=async n=>{n&&await ha({io:t,variant:Uo,text:`Failed to update prefKey "${e}".`,error:n}),i===h.current&&(c(false),n&&m({message:Yo(n)}));};let r;if(n instanceof Function)try{r=n((await t.contexts.get(yo))[e]);}catch(e){return o(e)}else r=n;try{const n=ma.runWithException({[e]:r});await t.contexts.update(yo,n);}catch(e){return o(e)}await o();},[t,e]);if(void 0===n)throw new Error("usePlatformPref must be used within a PlatformPrefsProvider");return {error:f,isLoading:a,update:p,value:i}}const wa="var(--io-neutrals-0)",ba="var(--io-neutrals-900)";function Ca(e){let t,n,i;if(e.startsWith("#")){let o=e.slice(1);3===o.length&&(o=o.split("").map(e=>e+e).join("")),t=parseInt(o.substring(0,2),16),n=parseInt(o.substring(2,4),16),i=parseInt(o.substring(4,6),16);}else {if(!e.startsWith("rgb")){const t=document.createElement("canvas").getContext("2d");if(!t)return ba;t.fillStyle=e;return Ca(t.fillStyle)}{const o=e.match(/\d+/g)?.map(Number);if(!o||o.length<3)return ba;[t,n,i]=o;}}return (.2126*t+.7152*n+.0722*i)/255>.5?ba:wa}function ka({className:t,channel:n,...i}){const o=k("io-channel-selector-badge",t),r=useMemo(()=>Ca(n.color),[n.color]);return jsxRuntimeExports.jsx("div",{className:o,style:{color:r,backgroundColor:n.color},...i,children:jsxRuntimeExports.jsx("span",{className:"io-channel-selector-badge-label",children:n.label})})}function Na(){return jsxRuntimeExports.jsx(N,{variant:"check"})}function Sa({channel:i,handleChannelRestricted:o,lockedChannelRestriction:r}){const a=(e,t)=>n=>{n.stopPropagation(),T(n)&&(n.preventDefault(),t||o({...i,[e]:!i[e]}));};return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:i.isSelected&&jsxRuntimeExports.jsx("span",{children:"Active"})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),children:jsxRuntimeExports.jsx(ro,{label:"Publish",checked:i.write,onChange:()=>{o({...i,write:!i.write});},onKeyDown:a("write",!i.isSelected||r?.write),onClick:e=>e.stopPropagation(),disabled:!i.isSelected||r?.write})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),children:jsxRuntimeExports.jsx(ro,{label:"Subscribe",checked:i.read,onChange:()=>{o({...i,read:!i.read});},onKeyDown:a("read",!i.isSelected||r?.read),disabled:!i.isSelected||r?.read})})]})}const Da=createContext({});function xa({channel:t,isSelected:n,onChannelSelect:i,onChannelRestrict:o,...a}){const{variant:l,selectedChannels:c,lockedChannelRestrictions:u}=useContext(Da),d=n||t.isSelected||c?.includes(t),f=u?.find(e=>e.name===t.name),m=useCallback(()=>i?.({...t,isSelected:!d}),[t,i,d]),h=useCallback(e=>{const n=e.target;n.closest(".io-toggle")||n.classList.contains("io-toggle")||T(e)&&(e.preventDefault(),i?.({...t,isSelected:!d}));},[t,i,d]),p=useCallback(e=>{o?.(e);},[o]);return jsxRuntimeExports.jsx(R,{prepend:jsxRuntimeExports.jsx(ka,{channel:t}),append:"single"===l||"multi"===l?d&&jsxRuntimeExports.jsx(Na,{}):jsxRuntimeExports.jsx(Sa,{channel:t,handleChannelRestricted:p,lockedChannelRestriction:f}),isSelected:d,onClick:m,onKeyDown:h,...a,children:t.name},t.name)}function Ea({variant:t,onVariantChange:n,disabled:i=false}){const o="directionalSingle"===t||"directionalMulti"===t,a=useCallback(()=>{n?.(!o);},[o,n]),s=useCallback(e=>{e.stopPropagation();},[]),l=useCallback(e=>{e.stopPropagation(),T(e)&&(e.preventDefault(),i||a());},[i,a]);return jsxRuntimeExports.jsx(ro,{label:"Directional",align:"right",checked:o,onChange:a,onClick:s,onKeyDown:l,disabled:i})}const Ia=forwardRef(({className:n,variant:i="single",variantToggle:o=false,channels:r=[],lockedChannelRestrictions:a=[],onVariantChange:s,onChannelSelect:l,onChannelRestrict:u,...d},f)=>{const m=k("io-channel-selector-panel",("directionalSingle"===i||"directionalMulti"===i)&&"io-channel-selector-panel-directional",n),h=useMemo(()=>({variant:i,selectedChannels:r.filter(e=>e.isSelected),lockedChannelRestrictions:a,onVariantChange:s,onChannelSelect:l,onChannelRestrict:u}),[r,i,a,s,l,u]);return jsxRuntimeExports.jsx(Da.Provider,{value:h,children:jsxRuntimeExports.jsx("div",{className:m,ref:f,children:jsxRuntimeExports.jsxs(V,{...d,children:[jsxRuntimeExports.jsx(V.ItemTitle,{append:o&&jsxRuntimeExports.jsx(Ea,{variant:i,onVariantChange:s}),children:{single:"Select Channel",directionalSingle:"Select Directional Channel",multi:"Select Channels",directionalMulti:"Select Directional Channels"}[i]}),r?.map(t=>jsxRuntimeExports.jsx(xa,{channel:t,isSelected:t.isSelected,onChannelSelect:l,onChannelRestrict:u},t.name))]})})})});Ia.displayName="ChannelSelector";const Ma=forwardRef(({className:t,title:n,ariaLabel:i,onClick:o,onKeyDown:r,children:a,disabled:s=false,...l},c)=>jsxRuntimeExports.jsx("div",{ref:c,className:k(t,{disabled:s}),title:n,role:"button",tabIndex:s?-1:0,"aria-label":i,"aria-disabled":s,onClick:e=>{!s&&o&&o(e);},onKeyDown:e=>{!s&&r&&r(e);},...l,children:a}));Ma.displayName="ChannelSelectorButtonWrapper";createContext({config:{message:""},theme:"dark",setResult:()=>{}});function Ya({title:n="Downloads"}){const{ItemSearch:i,HeaderButtons:o}=ps();return jsxRuntimeExports.jsxs("div",{className:"io-dm-header",children:[jsxRuntimeExports.jsxs(Z,{draggable:true,children:[jsxRuntimeExports.jsx(Z.Title,{tag:"h1",text:n,size:"large"}),jsxRuntimeExports.jsx(o,{className:"non-draggable"})]}),jsxRuntimeExports.jsx(i,{})]})}const Wa=createContext({configuration:{},items:[],removeItem:()=>{},pauseResumeItem:()=>{},cancelItem:()=>{},clearItems:()=>{},showItemInFolder:()=>{},isSettingsVisible:false,showSettings:()=>{},hideSettings:()=>{},searchQuery:"",setSearch:()=>{},itemsCount:0,setCount:()=>{},setDownloadLocation:()=>{},setDownloadLocationWithDialog:()=>{},sortItems:()=>[],downloadLocationList:[],isDownloadLocationDialogVisible:false}),Ka=()=>useContext(Wa);function Ja({className:n,icon:i="search",placeholder:o="Search",...a}){const s=k("io-header-search",n),l=useRef(null),{searchQuery:c,setSearch:d,itemsCount:f}=Ka(),m=c.length>0,h=useCallback(()=>{d(""),l.current&&l.current.focus();},[d]);return jsxRuntimeExports.jsxs("div",{className:s,children:[jsxRuntimeExports.jsx(to,{ref:l,value:c,iconPrepend:i,iconAppend:m?"close":void 0,iconAppendOnClick:m?h:void 0,placeholder:o,onChange:e=>d(e.target.value),...a}),m&&jsxRuntimeExports.jsx("p",{className:"io-header-search-count",children:`${f} results`})]})}function qa({className:n,...i}){const{MoreButton:o,CloseButton:r}=ps();return jsxRuntimeExports.jsxs(X,{className:n,align:"right",...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{})]})}function Ga({icon:n="ellipsis-vertical",...i}){const{items:o,clearItems:r,showSettings:a}=Ka(),s=0===o.length;return jsxRuntimeExports.jsxs(Q,{variant:"light",...i,children:[jsxRuntimeExports.jsx(Q.ButtonIcon,{icon:n,variant:"circle",size:"32"}),jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsxs(Q.List,{children:[jsxRuntimeExports.jsx(Q.Item,{onClick:e=>(e=>{s?e.stopPropagation():r();})(e),disabled:s,children:"Clear All"}),jsxRuntimeExports.jsx(Q.Item,{onClick:a,children:"Settings"})]})})]})}const Qa={minimizeWindow:async function(e){if(e)try{const t=e.windows?.my();await(t?.minimize());}catch(e){console.error("Failed to minimize window",e);}},closeWindow:async function(e,t){if(e)try{const n=e.windows?.my();await(n?.close(t));}catch(e){console.error("Failed to close window",e);}},restartPlatform:async function(e,t=true){if(e)try{await e.appManager.restart({autoSave:t,showDialog:!0});}catch(e){console.error("Failed to restart io.Connect Desktop",e);}},shutdownPlatform:async function(e,t=true){if(e)try{await e.appManager.exit({autoSave:t,showDialog:!0});}catch(e){console.error("Failed to shutdown io.Connect Desktop",e);}}};function Xa({icon:t="close",size:n="32",variant:i="circle",onClick:o,...r}){const a=useContext(IOConnectContext);return jsxRuntimeExports.jsx(S,{icon:t,size:n,variant:i,onClick:e=>{o?o(e):Qa.closeWindow(a).catch(e=>{console.error("Failed to close window:",e);});},...r})}function Za(e,t=false,n=false,i=false){const o=e.getDate(),r=["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()],a=e.getFullYear(),s=e.getHours(),l=e.getMinutes();let c="";return c=l<10?`0${l}`:`${l}`,t?"Today"===t?n?"Today":`Today at ${s}:${c}`:"Yesterday"===t?n?"Yesterday":`Yesterday at ${s}:${c}`:`${s}:${c}`:i?n?`${r} ${o}`:`${r} ${o} at ${s}:${c}`:n?`${r} ${o}, ${a}`:`${r} ${o}, ${a} at ${s}:${c}`}function es(e,t={showTime:true}){const n=new Date(1e3*e),i=new Date,o=Math.round((i-n)/1e3),r=Math.round(o/60),a=i.toDateString()===n.toDateString(),s=new Date(i.setDate(i.getDate()-1)).toDateString()===n.toDateString(),l=i.getFullYear()===n.getFullYear();return t.showTime?o<5?"Just Now":o<60?`${o} seconds ago`:o<90?"about a minute ago":r<60?`${r} minutes ago`:a?Za(n,"Today",false,true):s?Za(n,"Yesterday",false,true):l?Za(n,false,false,true):Za(n):a?"Today":s?"Yesterday":l?Za(n,false,true,true):Za(n,false,true)}function ts({className:t,...n}){const i=k("io-dm-body",t),{DownloadListEmpty:o,ItemGroup:r,Item:a}=ps(),{items:s,searchQuery:l,setCount:u,sortItems:f}=Ka(),m=f(s),h=lo(l),p=useMemo(()=>m.filter(e=>e.displayInfo.filename.toLowerCase().includes(h.toLowerCase())||e.displayInfo.url.toLowerCase().includes(h.toLowerCase())),[m,h]),g=useMemo(()=>p.map(e=>({...e,displayInfo:{...e.displayInfo,startTime:es(e.displayInfo.startTime,{showTime:false})}})),[p]),v=useMemo(()=>Object.values(g.reduce((e={},t)=>(e[t.displayInfo.startTime]=e[t.displayInfo.startTime]?.concat([])??[],e[t.displayInfo.startTime].push(t),e),{})),[g]);return useEffect(()=>{u(p.length);},[p,u]),jsxRuntimeExports.jsx("div",{className:i,...n,children:v&&0!==v.length?v.map(t=>jsxRuntimeExports.jsx(r,{title:String(t[0].displayInfo.startTime)??null,children:t.map(t=>jsxRuntimeExports.jsx(a,{item:t},t.id))},t[0].id??"")):jsxRuntimeExports.jsx(o,{})})}function ns({className:n,icon:i="download",text:o="No downloads to display.",...r}){const a=k("io-dm-no-items",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[jsxRuntimeExports.jsx(N,{variant:i}),jsxRuntimeExports.jsx("p",{children:o})]})}function is({className:n,title:i,children:o,...r}){const a=k("io-dm-item-group",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[i&&jsxRuntimeExports.jsx("p",{children:i}),o]})}function os({className:i,item:o,...r}){const{ItemHeader:a,ItemBody:s,ItemFooter:l}=ps(),{state:c,url:u,filename:d,receivedBytes:f,totalBytes:m,speed:h,timeRemaining:p}=o.displayInfo;if(!o)return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{});const g=k("io-dm-item",o.displayInfo.state&&[c],i);return jsxRuntimeExports.jsxs("div",{className:g,...r,children:[jsxRuntimeExports.jsx(a,{itemID:o.id,filename:d,state:c}),jsxRuntimeExports.jsx(s,{state:c,url:u,bytesReceived:f,bytesTotal:m,speed:h,timeRemaining:p}),jsxRuntimeExports.jsx(l,{itemID:o.id,state:c})]})}function rs({bytesReceived:t=0,bytesTotal:n=0,...i}){const o=useCallback(()=>t&&n?Math.round(t/n*100):0,[t,n]);return jsxRuntimeExports.jsx(Zi,{value:o(),...i})}function as({className:n,itemID:i,filename:o,state:a,cancel:s,remove:l,...c}){const u=k("io-dm-item-header",n),{cancelItem:d,removeItem:f}=Ka(),m=useCallback(e=>{s?s(e):d(e);},[s,d]),h=useCallback(e=>{l?l(e):f(e);},[l,f]);return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx(I,{text:o,style:{textDecoration:"interrupted"===a||"cancelled"===a?"line-through":"none"}}),jsxRuntimeExports.jsx(S,{icon:"close",iconSize:"12",onClick:()=>{"progressing"===a||"paused"===a?m(i):h(i);}})]})}function ss({className:n,state:i,url:o,bytesReceived:r=0,bytesTotal:a=0,speed:s=0,timeRemaining:l=0,...c}){const u=k("io-dm-item-body",n),d=e=>{const t=["Bytes","KB","MB","GB","TB"];if(0===e)return "0";const n=Math.floor(Math.log(e)/Math.log(1024));return 0===n?`${e}${t[n]}`:`${(e/1024**n).toFixed(1)}${t[n]}`};return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx("p",{className:"io-text-small",children:o}),(m=i,"cancelled"===m||"interrupted"===m||"completed"===m?null:jsxRuntimeExports.jsx(rs,{variant:"paused"===m?"paused":"active",bytesReceived:r,bytesTotal:a})),jsxRuntimeExports.jsx("p",{className:"io-text-default-lh16",children:"completed"===i?`${d(r??0)} - Done`:"cancelled"===i||"interrupted"===i?`${d(r??0)}/${d(a??0)} - Failed`:`${d(r??0)}/${d(a??0)} (${f=s,(f?`${(f/1e6/8).toFixed(2)}MB/s`:0)??0}) - ${(e=>{const t=Math.floor(e/3600),n=Math.floor(e%3600/60);let i="";return t>0&&(i+=`${t} hour${t>1?"s":""}, `),n>0&&(i+=`${n} min${n>1?"s":""}, `),((e=Math.floor(e%60))>0||""===i)&&(i+=`${e} sec${1!==e?"s":""}`),`${i.trim()} left`})(l)??0}`})]});var f,m;}const ls={success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function cs({className:n,variant:i,text:o}){const r=k("io-dm-item-status",`io-dm-item-status-${i}`,n);return jsxRuntimeExports.jsxs("div",{className:r,children:[i&&jsxRuntimeExports.jsx(N,{variant:ls[i],className:"icon-severity",size:"10"}),o&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:o})]})}function us({className:i,itemID:o,state:a,pauseResume:s,showInFolder:l,cancel:c,...u}){const d=k("io-dm-item-footer",i),{pauseResumeItem:f,showItemInFolder:m,cancelItem:h}=Ka(),p=useCallback(e=>{s?s(e):f(e);},[s,f]),g=useCallback(e=>{l?l(e):m(e);},[l,m]),v=useCallback(e=>{c?c(e):h(e);},[c,h]);return jsxRuntimeExports.jsx("div",{className:d,...u,children:(()=>{switch(a){case "progressing":return jsxRuntimeExports.jsxs(X,{align:"right",children:[jsxRuntimeExports.jsx(X.Button,{variant:"primary",text:"Pause",onClick:()=>p(o)}),jsxRuntimeExports.jsx(X.Button,{variant:"link",text:"Cancel",onClick:()=>v(o)})]});case "paused":return jsxRuntimeExports.jsx(X,{align:"right",children:jsxRuntimeExports.jsx(X.Button,{variant:"primary",text:"Resume",onClick:()=>p(o)})});case "completed":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(cs,{variant:"success",text:"Complete"}),jsxRuntimeExports.jsx(X,{align:"right",children:jsxRuntimeExports.jsx(X.Button,{variant:"primary",text:"Show in Folder",onClick:()=>g(o)})})]});case "cancelled":return jsxRuntimeExports.jsx(cs,{variant:"warning",text:"Cancelled"});case "interrupted":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(cs,{variant:"critical",text:"Failed"}),jsxRuntimeExports.jsx(X,{align:"right",children:jsxRuntimeExports.jsx(X.Button,{variant:"primary",text:"Retry",onClick:()=>p(o)})})]});default:return null}})()})}function ds({className:n,title:i="Download Settings",...o}){const r=k("io-dm-settings-panel",n),{configuration:{downloadFolder:a},hideSettings:s,setDownloadLocation:l,setDownloadLocationWithDialog:c,isDownloadLocationDialogVisible:u,downloadLocationList:d}=Ka();return jsxRuntimeExports.jsxs(Qi,{className:r,...o,children:[jsxRuntimeExports.jsxs(Qi.Header,{children:[jsxRuntimeExports.jsx(Qi.Header.Title,{size:"large",text:i,tag:"h1"}),jsxRuntimeExports.jsx(Qi.Header.ButtonGroup,{children:jsxRuntimeExports.jsx(S,{variant:"circle",icon:"close",size:"32",onClick:()=>{s();},disabled:u})})]}),jsxRuntimeExports.jsx(Qi.Body,{children:jsxRuntimeExports.jsxs(X,{children:[jsxRuntimeExports.jsxs(Q,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx(Q.Button,{children:jsxRuntimeExports.jsx("span",{className:"io-dm-settings-panel-download-location",children:a??d[0]})}),d.length>1&&jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsx(Q.List,{children:d.map((t,n)=>!t||0===n||n>3?null:jsxRuntimeExports.jsx(Q.Item,{onClick:()=>{l(t);},children:t},t))})})]}),jsxRuntimeExports.jsx(A,{className:"io-btn io-dm-settings-panel-download-location-btn",text:"Browse",onClick:()=>{c();},disabled:u})]})})]})}const fs={Header:Ya,ItemSearch:Ja,HeaderButtons:qa,MoreButton:Ga,CloseButton:Xa,Body:ts,DownloadListEmpty:ns,ItemGroup:is,Item:os,ItemProgress:rs,ItemHeader:as,ItemBody:ss,ItemFooter:us,Settings:ds},ms=createContext(fs),hs=memo(({children:t,components:n})=>{const i=useMemo(()=>({...fs,...n}),[n]);return jsxRuntimeExports.jsx(ms.Provider,{value:i,children:t})});hs.displayName="ComponentsStore";const ps=()=>useContext(ms);function ys(e){if(e&&e.errorHandling&&"function"!=typeof e.errorHandling&&"log"!==e.errorHandling&&"silent"!==e.errorHandling&&"throw"!==e.errorHandling)throw new Error('Invalid options passed to createRegistry. Prop errorHandling should be ["log" | "silent" | "throw" | (err) => void], but '+typeof e.errorHandling+" was passed");var t=e&&"function"==typeof e.errorHandling&&e.errorHandling,n={};function i(n,i){var o=n instanceof Error?n:new Error(n);if(t)t(o);else {var r='[ERROR] callback-registry: User callback for key "'+i+'" failed: '+o.stack;if(e)switch(e.errorHandling){case "log":return console.error(r);case "silent":return;case "throw":throw new Error(r)}console.error(r);}}return {add:function(e,t,o){var r=n[e];return r||(r=[],n[e]=r),r.push(t),o&&setTimeout(function(){o.forEach(function(o){var r;if(null===(r=n[e])||void 0===r?void 0:r.includes(t))try{Array.isArray(o)?t.apply(void 0,o):t.apply(void 0,[o]);}catch(t){i(t,e);}});},0),function(){var i=n[e];i&&(i=i.reduce(function(e,n,i){return n===t&&e.length===i||e.push(n),e},[]),0===i.length?delete n[e]:n[e]=i);}},execute:function(e){for(var t=[],o=1;o<arguments.length;o++)t[o-1]=arguments[o];var r=n[e];if(!r||0===r.length)return [];var a=[];return r.forEach(function(n){try{var o=n.apply(void 0,t);a.push(o);}catch(t){a.push(void 0),i(t,e);}}),a},clear:function(){n={};},clearKey:function(e){n[e]&&delete n[e];}}}ys.default=ys;w(ys);const Cs=createContext({config:{env:"",region:"",version:"",buildVersion:"",theme:"",isError:false,mailingList:"",createJiraTicket:true,sendEmail:false,attachments:[],applicationTitle:"",allowEditRecipients:true,attachmentsViewMode:"category",environmentInfo:"",selectedCategories:[],errorMessage:"",showEnvironmentInfo:false,context:{},technicalInfo:"",sendEmailClient:"Outlook"},onThemeChanged:e=>{},openUrl:()=>{},submit:()=>Promise.resolve({}),setBounds:()=>{},close:e=>{},showMailingList:true,setShowMailingList:()=>{},attachmentCategories:[],submitInProgress:false,setSubmitInProgress:()=>{},submitStatus:{type:"success",title:"",text:""},setSubmitStatus:()=>{},submitCompleted:false,setSubmitCompleted:()=>{},jiraTicketURL:"",setJiraTicketURL:()=>{},submitFeedback:()=>{}}),ks=()=>useContext(Cs);function Ns({...n}){const{config:i,close:o}=ks(),{applicationTitle:r}=i;return jsxRuntimeExports.jsxs(Z,{draggable:true,...n,children:[jsxRuntimeExports.jsx(Z.Title,{tag:"h1",text:r?`Feedback Form - ${r}`:"Feedback Form",size:"large"}),jsxRuntimeExports.jsx(Z.ButtonGroup,{className:"non-draggable",children:jsxRuntimeExports.jsx(Z.ButtonIcon,{variant:"circle",icon:"close",size:"32",onClick:()=>o()})})]})}function Ss({className:n,handleSubmit:i,...o}){const r=k("io-panel-body",n),{config:a,submitFeedback:s}=ks(),{IntroField:l,DescriptionField:c,TechInfoField:u,EnvInfoField:d,FileAttachmentsField:f,CategoryAttachmentsField:m,SettingsField:h,MailListField:p}=$s(),g=i??s,v=`Your feedback will be submitted to the ${a.buildVersion} team and some additional information will be automatically included to help us examine your issue.`;return jsxRuntimeExports.jsxs("form",{className:r,id:"feedback",onSubmit:e=>g(e),...o,children:[jsxRuntimeExports.jsx(l,{children:jsxRuntimeExports.jsx("p",{children:v})}),jsxRuntimeExports.jsx(h,{}),jsxRuntimeExports.jsx(p,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{readOnly:true}),jsxRuntimeExports.jsx(d,{readOnly:true}),"file"===a.attachmentsViewMode?jsxRuntimeExports.jsx(f,{}):jsxRuntimeExports.jsx(m,{})]})}function Ds({...n}){const{FooterButtons:i}=$s(),{openUrl:o,submitInProgress:r,submitStatus:a,jiraTicketURL:s}=ks();return jsxRuntimeExports.jsx(ne,{...n,children:jsxRuntimeExports.jsxs("div",r?{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsx(M,{children:jsxRuntimeExports.jsx("p",{children:a.title})}),jsxRuntimeExports.jsx(Ki,{align:"right",size:"small"})]}:{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsxs(M,{children:[jsxRuntimeExports.jsx("p",{className:"error"===a.type?"io-text-error":"",children:a.title}),s&&jsxRuntimeExports.jsx("a",{href:s,onClick:e=>{e.preventDefault(),o(s);},children:s})]}),jsxRuntimeExports.jsx(i,{})]})})}function xs({className:t,...n}){const{CloseButton:i}=$s(),{close:o}=ks();return jsxRuntimeExports.jsx(X,{className:t,...n,children:jsxRuntimeExports.jsx(i,{onClick:()=>o()})})}function Es({className:n,...i}){const{SubmitButton:o,CancelButton:r,CloseButton:a}=$s(),{close:s,submitCompleted:l}=ks();return l?jsxRuntimeExports.jsx(X,{className:n,...i,children:jsxRuntimeExports.jsx(a,{text:"Close",onClick:()=>s()})}):jsxRuntimeExports.jsxs(X,{className:n,...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{onClick:()=>s()})]})}function Is({text:t="Submit",...n}){return jsxRuntimeExports.jsx(A,{form:"feedback",type:"submit",variant:"primary",text:t,...n})}function Ms({text:t="Cancel",...n}){return jsxRuntimeExports.jsx(A,{variant:"link",text:t,...n})}function Ts({...t}){return jsxRuntimeExports.jsx(A,{variant:"primary",...t})}function As({showField:t=true,className:n,title:i,hint:o,children:r,...a}){return t?jsxRuntimeExports.jsx(M,{className:n,title:i,hint:o,...a,children:r}):null}function Ps({showField:t=true,className:n,title:i="Description",hint:o,readOnly:r=false,disabled:a,...s}){return t?jsxRuntimeExports.jsx(M,{className:n,hint:o,title:"",...s,children:jsxRuntimeExports.jsx(no,{id:"description",name:"description",label:i,readOnly:r,disabled:a})}):null}function Os({showField:t,className:n,title:i="Technical Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=ks(),u=t??c.errorMessage,d=r??c.errorMessage;return u&&d?jsxRuntimeExports.jsx(M,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(no,{id:"errorMessage",name:"errorMessage",label:i,value:d,readOnly:a,disabled:s})}):null}function Ls({showField:t,className:n,title:i="Environment Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=ks(),u=t??c.showEnvironmentInfo,d=r??c.environmentInfo;return u&&d?jsxRuntimeExports.jsx(M,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(no,{id:"environmentInfo",name:"environmentInfo",label:i,value:d,readOnly:a,disabled:s})}):null}function Fs({showField:t=true,className:n,title:i="Attachments",hint:o,readOnly:a=false,disabled:s,attachments:l,selectedCategories:c,...u}){const d=k("io-block-list-gap",n),{config:f}=ks(),m=l??f.attachments,h=c??f.selectedCategories,p=useCallback(e=>!!h&&-1!==h.indexOf(e),[h]);return t?!m||m.length<=0?jsxRuntimeExports.jsx(M,{title:"Attachments",children:jsxRuntimeExports.jsx("p",{children:"No Attachments"})}):jsxRuntimeExports.jsx(M,{className:d,title:i,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"file-attachments",children:m.map(t=>jsxRuntimeExports.jsx(io,{id:t.id,name:t.id,label:t.name,readOnly:a,disabled:s,defaultChecked:p(t.category)},t.id))})}):null}function Bs({showField:t=true,className:n,title:i="Attachments",hint:o,readOnly:a=false,disabled:s,categories:l,selectedCategories:c,...u}){const{config:d,attachmentCategories:f}=ks(),m=l??f,h=c??d.selectedCategories,p=useCallback(e=>!!h&&-1!==h.indexOf(e),[h]);return t?!m||m.length<=0?jsxRuntimeExports.jsx("p",{children:"No Attachments"}):jsxRuntimeExports.jsx(M,{className:n,title:i,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"category-attachments",children:m.map(t=>jsxRuntimeExports.jsx(ro,{id:t,name:t,align:"right",label:t,readOnly:a,disabled:s,defaultChecked:p(t)},t))})}):null}function Rs({className:n,title:i,hint:o,showField:r=true,showJiraTicketField:a,jiraTicketLabel:s="Create Jira Ticket",showSendEmailField:l,sendEmailLabel:c="Send Email",readOnly:u=false,disabled:d,...f}){const m=k("io-block-list-gap",n),{config:h,showMailingList:p,setShowMailingList:g}=ks();if(!r)return null;const v=a??h.createJiraTicket,y=l??h.sendEmail;return jsxRuntimeExports.jsxs(M,{className:m,hint:o,title:i,...f,children:[v&&jsxRuntimeExports.jsx(ro,{id:"createJiraTicket",name:"createJiraTicket",label:s,align:"right",readOnly:u,disabled:d,defaultChecked:v}),y&&jsxRuntimeExports.jsx(ro,{onChange:()=>{g(!p);},id:"sendEmail",name:"sendEmail",label:c,align:"right",readOnly:u,disabled:d,defaultChecked:y})]})}function _s({showField:t=true,className:n,title:i="Email List",hint:o="Separate with commas or semicolons.",placeholder:r="john.doe@somedomain.com; jane.doe@otherdomain.com",readOnly:a,disabled:s,...l}){const{config:c,showMailingList:u}=ks(),d=t??c.sendEmail,f=a??false===c.allowEditRecipients;return d&&u?jsxRuntimeExports.jsx(M,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(to,{id:"mailingList",name:"mailingList",label:i,placeholder:r,readOnly:f,disabled:s,defaultValue:c.mailingList??""})}):null}const Hs={Header:Ns,Body:Ss,Footer:Ds,HeaderButtons:xs,FooterButtons:Es,SubmitButton:Is,CancelButton:Ms,CloseButton:Ts,IntroField:As,DescriptionField:Ps,TechInfoField:Os,EnvInfoField:Ls,FileAttachmentsField:Fs,CategoryAttachmentsField:Bs,SettingsField:Rs,MailListField:_s},js=createContext(Hs),zs=memo(({children:t,components:n})=>{const i=useMemo(()=>({...Hs,...n}),[n]);return jsxRuntimeExports.jsx(js.Provider,{value:i,children:t})});function $s(e){return {...useContext(js),...e}}zs.displayName="ComponentsStore";function Us({className:n,title:i="General",...o}){const r=k("io-notifications-settings-panel-general",n),{AllowNotifications:a,AllowNotificationToasts:s,ShowNotificationBadge:l,CloseNotificationOnClick:c,PanelAutoHide:u,HideToastsAfter:d}=Il(),f=ho();return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(M,{title:i,children:[f&&jsxRuntimeExports.jsx(a,{}),f&&jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),f&&jsxRuntimeExports.jsx(u,{}),f&&jsxRuntimeExports.jsx(c,{}),f&&jsxRuntimeExports.jsx(d,{})]})})}function Ks(e){const t=useContext(IOConnectContext),n=t?.appManager,i=ho(),[o,a]=useState([]),[u,f]=useState(0),m="Platform",h=useCallback((e="asc")=>{if(null===i)return [];const t=[...o].sort((t,n)=>{const i=(t.title??t.name).toLowerCase(),o=(n.title??n.name).toLowerCase();return "asc"===e?i.localeCompare(o):o.localeCompare(i)});if(!i){const e=t.findIndex(e=>e.name===m);if(-1!==e){const[n]=t.splice(e,1);t.unshift(n);}}return t},[o,i]),p=useMemo(()=>h("asc"),[h]),g=useMemo(()=>h("desc"),[h]);useEffect(()=>{if(null===i||i)return;const e={title:"System",name:m,hidden:false,userProperties:{hidden:false}};a(t=>t.some(t=>t.name===e.name)?t:[...t,e]);},[i]),useEffect(()=>{if(!n)return;const e=n.onAppAdded(e=>{a(t=>[...t,{title:e.title,name:e.name,hidden:e.hidden,userProperties:e.userProperties}]);}),t=n.onAppRemoved(e=>{a(t=>t.filter(t=>t.name!==e.name));}),i=n.onAppChanged(e=>{a(t=>{const n=t.find(t=>t.name===e.name);return [...t.filter(t=>t.name!==e.name),{title:e.title,name:n?.name,hidden:n?.hidden,allowed:n?.allowed,userProperties:n?.userProperties}]});});return ()=>{e(),t(),i();}},[n]);return {apps:useMemo(()=>{if(!e?.sourceFilter||!Array.isArray(o))return o;const{allowed:t=[],blocked:n=[]}=e.sourceFilter,i=t.includes("*"),r=n.includes("*");let a=0;const s=o.map(e=>{const n=i||t.includes(e.name),o=!r&&n;return o&&a++,{...e,allowed:o}});return f(a),s},[e,o]),allowedApps:u,sortedAppsAsc:p,sortedAppsDesc:g,sortAppsAlphabetically:h}}const Zs=createContext({allApps:[],settings:{},configuration:{},notifications:[],notificationsCount:0,onClose:()=>{},allApplications:0,clearAll:()=>{},showPanel:()=>{},hidePanel:()=>{},saveFilter:()=>{},clearAllOld:()=>{},notificationStacks:[],saveSetting:()=>{},allowedApplications:0,saveAllFilter:()=>{},isBulkActionsSupported:false,selectedNotifications:[],selectNotification:()=>{},selectAllNotifications:()=>{},clearMany:()=>{},snooze:()=>{},snoozeMany:()=>{},setState:()=>{},setStates:()=>{},setCount:()=>{}}),el=()=>useContext(Zs);function tl({label:t="Allow notifications",align:n="right",...i}){const{settings:o,saveSetting:a}=el(),s=ho(),l=useCallback(e=>{a({enabledNotifications:e.target.checked});},[a]);return s?jsxRuntimeExports.jsx(ro,{label:t,align:n,onChange:l,checked:o.enabledNotifications??false,...i}):null}function nl({label:t="Allow notification toasts",align:n="right",...i}){const{settings:o,saveSetting:a}=el(),s=ho(),l=s&&!o.enabledNotifications,c=useCallback(e=>{a({enabledToasts:e.target.checked});},[a]);return s?jsxRuntimeExports.jsx(ro,{label:t,align:n,onChange:c,checked:o.enabledToasts??false,disabled:l,...i}):null}function il({label:t="Show notification badge",align:n="right",...i}){const{settings:o,saveSetting:a}=el(),s=ho()&&!o.enabledNotifications,l=useCallback(e=>{a({showNotificationBadge:e.target.checked});},[a]);return jsxRuntimeExports.jsx(ro,{label:t,align:n,onChange:l,checked:o.showNotificationBadge??false,disabled:s,...i})}function ol({label:t="Close notification on click",align:n="right",...i}){const{settings:o,saveSetting:a}=el(),s=ho(),l=s&&!o.enabledNotifications,c=useCallback(e=>{a({closeNotificationOnClick:e.target.checked});},[a]);return s?jsxRuntimeExports.jsx(ro,{label:t,align:n,onChange:c,checked:o.closeNotificationOnClick??false,disabled:l,...i}):null}function rl({label:t="Auto hide panel",align:n="right",...i}){const{settings:o,saveSetting:a}=el(),s=ho(),l=useCallback(e=>{a({autoHidePanel:e.target.checked});},[a]);return s?jsxRuntimeExports.jsx(ro,{label:t,align:n,onChange:l,checked:o.autoHidePanel??false,...i}):null}const al=(e,t)=>e?`${e} ${t}${1!==e?"s":""}`:"",sl=e=>{const t=Math.floor(e/60),n=e%60,i=al(t,"minute"),o=al(n,"second");return i+(i&&o?" ":"")+o};function ll({className:n,title:i="Hide toasts after",items:o=[15,30,45,60],...a}){const s=k("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=el(),u=ho(),d=u&&!l.enabledNotifications,f=useCallback((e=15e3)=>{l.toastExpiry!==e&&c({toastExpiry:1e3*e});},[l.toastExpiry,c]);return u?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(d?"io-text-disabled":""),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(Q,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx(Q.Button,{text:sl((l.toastExpiry??0)/1e3)}),jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsx(Q.List,{variant:"single",children:o.map(t=>jsxRuntimeExports.jsx(Q.Item,{onClick:()=>{f(t);},children:sl(t)},t))})})]})]}):null}function cl({className:n,title:i="Stacking",...o}){const r=k("io-notifications-settings-panel-stacking",n),{ToastStacking:a,ToastStackBy:s}=Il();return ho()?jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(M,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function ul({label:t="Allow toast stacking",align:n="right",...i}){const{settings:o,saveSetting:a}=el(),s=ho(),l=s&&!o.enabledNotifications,c=useCallback(e=>{a({toastStacking:e.target.checked});},[a]);return s?jsxRuntimeExports.jsx(ro,{label:t,align:n,onChange:c,checked:o.toastStacking??false,disabled:l,...i}):null}const dl={application:"Application",severity:"Priority"},fl=Object.fromEntries(Object.entries(dl).map(([e,t])=>[t,e]));function ml({className:n,title:i="Group by",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=el(),c=ho(),u=c&&!s.enabledNotifications,d=useCallback((e="severity")=>{s.stackBy!==e&&l({stackBy:e.toLowerCase()});},[s.stackBy,l]);if(!c)return null;const f=Object.values(dl);return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":u}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(Q,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx(Q.Button,{text:dl[s.stackBy??"severity"]}),jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsx(Q.List,{variant:"single",children:f.map(t=>jsxRuntimeExports.jsx(Q.Item,{onClick:()=>{const e=fl[t];d(e);},children:t},t))})})]})]})}function hl({className:n,title:i="Placement",...o}){const r=k("io-notifications-settings-panel-placement",n),{PlacementPanel:a,PlacementToasts:s}=Il();return ho()?jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(M,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}const pl=e=>e.replace(/(^|-)\w/g,e=>e.toUpperCase().replace("-"," "));function gl({className:n,title:i="Panel position",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=el(),c=ho(),u=useCallback(e=>{e||(e="right"),s.placement?.panel!==e&&l({placement:{...s.placement,panel:e.toLowerCase()}});},[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(Q,{variant:"light",children:[jsxRuntimeExports.jsx(Q.Button,{text:s.placement?.panel?pl(s.placement?.panel):"Right"}),jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsx(Q.List,{variant:"single",children:["Right","Left"].map(t=>jsxRuntimeExports.jsx(Q.Item,{onClick:()=>{u(t);},children:t},t))})})]})]})}function vl({className:n,title:i="Toasts position",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=el(),c=ho(),u=useCallback(e=>{if(e||(e="bottom-right"),s.placement?.toasts===e)return;const t=e.replace(/\s+/g,"-").toLowerCase();l({placement:{...s.placement,toasts:t}});},[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(Q,{variant:"light",children:[jsxRuntimeExports.jsx(Q.Button,{text:s.placement?.toasts?pl(s.placement?.toasts):"Bottom Right"}),jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsx(Q.List,{variant:"single",children:["Top Right","Top Left","Bottom Right","Bottom Left"].map(t=>jsxRuntimeExports.jsx(Q.Item,{onClick:()=>{u(t);},children:t},t))})})]})]})}function yl({className:t,title:n="Snooze",...i}){const o=k("io-notifications-settings-panel-snooze",t),{SnoozeDuration:r}=Il(),{settings:a}=el();return ho()&&a.snooze?.enabled?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsx(M,{title:n,children:jsxRuntimeExports.jsx(r,{})})}):null}function wl({className:n,title:i="Default duration",items:o=[60,120,180,300],...a}){const s=k("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=el(),u=ho(),d=u&&!l.enabledNotifications,f=useCallback((e=6e4)=>{l.snooze&&l.snooze?.duration!==e&&c({snooze:{...l.snooze,duration:1e3*e}});},[l.snooze,c]);return u&&l.snooze?.enabled?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":d}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(Q,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx(Q.Button,{text:sl((l.snooze?.duration??0)/1e3)}),jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsx(Q.List,{variant:"single",children:o.map(t=>jsxRuntimeExports.jsx(Q.Item,{onClick:()=>{f(t);},children:sl(t)},t))})})]})]}):null}function bl({className:n,title:i,...o}){const r=k("io-notifications-settings-panel-subscriptions",n),{SubscribeAll:a,SubscribeApp:s,SubscribeMuteAll:l,SubscribeMuteApp:c}=Il(),{sortAppsAlphabetically:u}=Ks(),d=ho(),f=u(),m="io-notifications-subscriptions-grid "+(d?"with-three-columns":"with-two-columns");return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(M,{title:i??(d?"Subscribe & Mute":"Subscribe"),children:[jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Sources"}),jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Subscribe"}),d&&jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Mute"})]}),jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:"All Sources"}),jsxRuntimeExports.jsx(a,{label:""}),d&&jsxRuntimeExports.jsx(l,{label:""})]}),f.map(n=>!n||n.hidden||n?.userProperties?.hidden?null:jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:n.title??n.name}),jsxRuntimeExports.jsx(s,{app:n,label:""}),d&&jsxRuntimeExports.jsx(c,{app:n,label:""})]},n.name))]})})}function Cl({label:t="All apps",align:n="right",...i}){const{settings:o,configuration:a,saveAllFilter:s}=el(),l=ho()&&!o.enabledNotifications,c=useCallback(e=>{s({subscribe:e.target.checked});},[s]);return jsxRuntimeExports.jsx(ro,{align:n,label:t,onChange:c,checked:(a.sourceFilter?.allowed?.includes("*")&&0===a.sourceFilter?.blocked?.length)??false,disabled:l,...i})}function kl({label:t="App",align:n="right",app:i,...o}){const{allApps:a,settings:s,configuration:l,saveFilter:c}=el(),u=ho()&&!s.enabledNotifications,d=useCallback((e,t)=>{const n={...l.sourceFilter},i=n.allowed?.indexOf("*");"number"==typeof i&&i>-1&&(n.allowed?.splice(i,1),a.forEach(e=>{e.name!==t.name&&n.allowed?.push(e.name);})),e?(n.allowed=[...new Set([...n.allowed??[],t.name])],n.blocked=n.blocked?.filter(e=>e!==t.name)):(n.allowed=n.allowed?.filter(e=>e!==t.name),n.blocked=[...new Set([...n.blocked??[],t.name])]),n.allowed?.length&&n.blocked?.includes("*")&&n.blocked.splice(n.blocked.indexOf("*"),1),c(n);},[a,l.sourceFilter,c]);return jsxRuntimeExports.jsx(ro,{id:i.name,label:t,align:n,onChange:e=>d(e.target.checked,i),checked:(l.sourceFilter?.allowed?.includes("*")&&!l.sourceFilter?.blocked?.includes(i.name)||l.sourceFilter?.allowed?.includes(i.name))??false,disabled:u,...o})}function Nl({label:t="Mute all",align:n="right",...i}){const{settings:o,configuration:a,saveAllFilter:s}=el(),l=ho(),c=l&&(!o.enabledNotifications||-1===a.sourceFilter?.allowed?.indexOf("*")),u=useCallback(e=>{s({mute:e.target.checked});},[s]);return l?jsxRuntimeExports.jsx(ro,{align:n,label:t,onChange:u,checked:a.sourceFilter?.muted?.includes("*")??false,disabled:c??false,...i}):null}function Sl({label:t="App",align:n="right",app:i,...o}){const{allApps:a,settings:s,configuration:l,saveFilter:c}=el(),u=ho(),d=u&&(!s.enabledNotifications||l.sourceFilter?.blocked?.includes("*")||l.sourceFilter?.blocked?.includes(i.name)||0===l.sourceFilter?.allowed?.length||-1===l.sourceFilter?.allowed?.indexOf(i.name)&&-1===l.sourceFilter?.allowed?.indexOf("*")&&0===l.sourceFilter?.blocked?.length),f=useCallback((e,t)=>{const n={...l.sourceFilter},i=n?.muted?.indexOf("*");"number"==typeof i&&i>-1&&(n.muted?.splice(i,1),a.forEach(e=>{e.name===t.name||e.hidden||n.muted?.push(e.name);})),e?n.muted?.push(t.name):n.muted=n.muted?.filter(e=>e!==t.name),c(n);},[a,l.sourceFilter,c]);return !u||i.hidden?null:jsxRuntimeExports.jsx(ro,{id:i.name,label:t,align:n,onChange:e=>f(e.target.checked,i),checked:(l.sourceFilter?.muted?.includes("*")||l.sourceFilter?.muted?.includes(i.name))??false,disabled:d??false,...o})}const Dl={Body:n=>{const{General:i,Placement:o,Stacking:r,Snooze:a,Subscriptions:s}=Il();return jsxRuntimeExports.jsxs(qi,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},General:Us,AllowNotifications:tl,AllowNotificationToasts:nl,ShowNotificationBadge:il,CloseNotificationOnClick:ol,PanelAutoHide:rl,HideToastsAfter:ll,Stacking:cl,ToastStacking:ul,ToastStackBy:ml,Placement:hl,PlacementPanel:gl,PlacementToasts:vl,Snooze:yl,SnoozeDuration:wl,Subscriptions:bl,SubscribeAll:Cl,SubscribeApp:kl,SubscribeMuteAll:Nl,SubscribeMuteApp:Sl},xl=createContext(Dl),El=memo(({children:t,components:n})=>{const i=useMemo(()=>({...Dl,...n}),[n]);return jsxRuntimeExports.jsx(xl.Provider,{value:i,children:t})});El.displayName="NotificationsSettingsPanelComponentsStoreProvider";const Il=()=>useContext(xl);const Pl=createContext({searchQuery:"",setSearch:()=>{},isPanelVisible:false,sortNotificationsBy:"newest",setSortBy:()=>{},viewNotificationsBy:"all",setViewBy:()=>{},isBulkActionsVisible:false,showBulkActions:()=>{},hideBulkActions:()=>{}}),Ol=()=>useContext(Pl);function Ll({title:n,onClose:i,onOpenSettings:o,...r}){const{HeaderCaptionTitle:a,HeaderCaptionCount:s,HeaderCaptionButtonSettings:l,HeaderCaptionButtonClose:c,HeaderActions:u,HeaderBulkActions:d,HeaderSearch:f}=Dc(),{isBulkActionsSupported:m,notificationsCount:h}=el(),{isBulkActionsVisible:p}=Ol(),g=ho();return jsxRuntimeExports.jsxs(Ji,{...r,children:[jsxRuntimeExports.jsxs("div",{className:"io-panel-header-caption",children:[jsxRuntimeExports.jsx(a,{title:n}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsxs(Ji.ButtonGroup,{children:[g&&jsxRuntimeExports.jsx(l,{onClick:o}),jsxRuntimeExports.jsx(c,{onClick:i})]})]}),jsxRuntimeExports.jsx(f,{}),m?jsxRuntimeExports.jsxs("div",{className:`io-panel-header-actions-wrapper ${p&&h>0?"io-panel-header-bulk-actions-opened":""} `,children:[jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]}):jsxRuntimeExports.jsx(u,{})]})}function Fl({text:n="Notifications",counter:i,...o}){const{notificationsCount:r}=el();return jsxRuntimeExports.jsx(I,{text:n,size:"large",...o,children:(i??true)&&jsxRuntimeExports.jsxs("span",{children:["(",r,")"]})})}const Bl="newest",Rl="oldest",_l="severity",Hl=["None","Low","Medium","High","Critical"],jl={key:Bl,descending:true},zl=e=>[...e].sort((e,t)=>(t.timestamp||0)-(e.timestamp||0)),$l=e=>[...e].sort((e,t)=>(e.timestamp||0)-(t.timestamp||0)),Vl=(e,t)=>{const n=Hl[0];return [...e].sort((e,i)=>{const o=Hl.indexOf(e.severity||n),r=Hl.indexOf(i.severity||n);return (t?-1:1)*(o-r)})},Yl={[Bl]:zl,[Rl]:$l,[_l]:Vl},Ul={severity:"Priority",newest:"Newest",oldest:"Oldest"};function Wl({...t}){const[n,i]=useState([]),{NotificationsList:o,Notification:r}=Dc(),{notifications:a,setCount:s,notificationsCount:f}=el(),{sortNotificationsBy:m,viewNotificationsBy:h,searchQuery:p}=Ol(),g=useRef(null),v=lo(p),y=useMemo(()=>{const e=((e,t)=>{if(!e)return [];switch(t){case "all":default:return e;case "unread":return e.filter(e=>"Active"===e.state||"Stale"===e.state);case "read":return e.filter(e=>"Acknowledged"===e.state||"Seen"===e.state);case "snoozed":return e.filter(e=>"Snoozed"===e.state)}})(a,h);return e.filter(e=>e.title.toLowerCase().includes(v.toLowerCase())||e.source?.toLowerCase().includes(v.toLowerCase())||e.body?.toLowerCase().includes(v.toLowerCase()))},[v,a,h]);return useEffect(()=>{switch(m){case "newest":i(zl(y));break;case "oldest":i($l(y));break;case "severity":i(Vl(y,true));break;default:i(y);}s(y.length);},[y,m,s]),useEffect(()=>{g.current&&g.current?.scrollTo({top:0,behavior:"smooth"});},[v,f,m,h]),jsxRuntimeExports.jsx(qi,{ref:g,...t,children:jsxRuntimeExports.jsx(o,{notifications:n,Notification:r})})}function Kl({...t}){const{FooterButtons:n}=Dc();return jsxRuntimeExports.jsx(Gi,{...t,children:jsxRuntimeExports.jsx(n,{})})}function Jl({className:n,...i}){const{FooterButtonClearAll:o,FooterButtonClearAllOld:r}=Dc(),{notifications:a}=el(),[s,c]=useState(false);return useEffect(()=>{a.filter(e=>"Stale"===e.state||"Acknowledged"===e.state).length>0?c(true):c(false);},[a]),jsxRuntimeExports.jsxs(X,{className:n,align:"right",...i,children:[jsxRuntimeExports.jsx(r,{disabled:!s}),jsxRuntimeExports.jsx(o,{disabled:a.length<=0})]})}function ql({text:t="Clear All",...n}){const{clearAll:i}=el();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{i();},...n})}function Gl({text:t="Clear Old",...n}){const{clearAllOld:i}=el();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{i();},...n})}function Ql(e){const t=ho(),{onClose:n,settings:i}=el(),{isPanelVisible:o}=Ol(),{id:a,onClick:s,updateState:l}=e,c=useCallback(async()=>{if(!s)return;if(!t){try{await s({close:!0});}catch(e){console.error(e);}return void n(a)}const e=i?.toastStacking??false;let r;r=o?i?.closeNotificationOnClick??true:!e&&null;try{null!==r?await s({close:r}):(await s({close:!1}),await l("Acknowledged"));}catch(e){console.error(e);}},[t,a,o,s,n,l,i?.closeNotificationOnClick,i?.toastStacking]),u=useCallback(async e=>{const t=e.target;t.closest("button")||t.closest("[role='button']")||t.closest("a")||t.closest(".io-dropdown-menu")||await c();},[c]);return {handleClick:c,handleWrapperClick:u}}function Xl({className:n,notification:i,onClick:o,...r}){const a=k("io-notification-header",n),{HeaderCount:s,HeaderBadge:l,HeaderTitle:c,HeaderTimestamp:u,HeaderButtonSnooze:d,HeaderButtonClose:f}=pc(),{handleWrapperClick:m}=Ql(i);return jsxRuntimeExports.jsxs("div",{className:a,onClick:async e=>{await m(e),o?.(e);},...r,children:[jsxRuntimeExports.jsx(l,{notification:i}),jsxRuntimeExports.jsx(s,{notification:i}),jsxRuntimeExports.jsx(c,{notification:i}),jsxRuntimeExports.jsx(u,{notification:i}),jsxRuntimeExports.jsxs(X,{children:[jsxRuntimeExports.jsx(d,{notification:i}),jsxRuntimeExports.jsx(f,{notification:i})]})]})}function Zl({notification:t,...n}){const{settings:i,notificationStacks:o}=el(),{isPanelVisible:r}=Ol(),{toastStacking:a,stackBy:s}=i,l="application"===s?"source":s??"source";let c=0;if(a){const e=o.find(e=>e.key===t[l]);c=e?.items.length??0;}return r||!a||c<=1?null:jsxRuntimeExports.jsx(Xi,{...n,children:c>9?"9+":c})}function ec({className:t,notification:n,...i}){if(!n?.severity||"None"===n.severity)return null;const o=k("io-notification-header-badge",t);return jsxRuntimeExports.jsx(Xi,{className:o,...i,children:n.severity})}function tc({className:n,state:i,severity:o="None",icon:r,...a}){const s=k("io-notification-header-icon",n),{isPanelVisible:l}=Ol();return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[r&&jsxRuntimeExports.jsx("span",{className:"io-notification-header-icon-image",children:jsxRuntimeExports.jsx("img",{src:r,alt:`io-notification-header-icon-${r}`})}),jsxRuntimeExports.jsx("span",{className:`io-notification-header-icon-badge color-${o.toLowerCase()}`,children:l&&"Acknowledged"!==i&&"New"})]})}function nc({className:t,notification:{appTitle:n},...i}){const o=k("io-notification-header-title",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function ic({className:t,notification:{timestamp:n,state:i,snooze:o},...r}){const a=k("io-notification-timestamp",t);return jsxRuntimeExports.jsx("small",o&&"Snoozed"===i?{className:a,...r,children:"Snoozed"}:{className:a,...r,children:es(n??0)??"Just Now"})}function oc({notification:{id:t,state:n},...i}){const{settings:o,snooze:a}=el(),s=useCallback(e=>{e.stopPropagation(),a&&a(t,o.snooze?.duration??0);},[t,a,o.snooze?.duration]);return a&&"Snoozed"!==n&&o.snooze?.enabled?jsxRuntimeExports.jsx(A,{icon:"snooze",variant:"link",text:"Snooze",tabIndex:-1,onClick:s,...i}):null}function rc({notification:{id:t,updateState:n},...i}){const o=ho(),{onClose:a}=el(),{isPanelVisible:s}=Ol(),l=useCallback(e=>{e.stopPropagation(),!o||s?a(t):n("Acknowledged").catch(console.error);},[o,t,a,s,n]);return jsxRuntimeExports.jsx(S,{icon:"close",iconSize:"10",tabIndex:-1,onClick:l,...i})}function ac({className:n,notification:i,...o}){const r=k("io-notification-body",n),{BodyIcon:a,BodyTitle:s,BodyDescription:l}=pc(),{icon:c,title:u,body:d}=i,{handleClick:f}=Ql(i);return jsxRuntimeExports.jsxs("div",{className:r,role:"button",tabIndex:0,onKeyDown:async e=>{T(e)&&await f();},onClick:f,...o,children:[jsxRuntimeExports.jsx(a,{icon:c}),jsxRuntimeExports.jsxs("div",{className:"io-notification-body-content",children:[jsxRuntimeExports.jsx(s,{text:u}),jsxRuntimeExports.jsx(l,{text:d})]})]})}function sc({className:t,icon:n,altText:i="notification icon",...o}){if(!n)return null;const r=k("io-notification-body-icon",t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("img",{src:n,alt:i})})}function lc({text:t,...n}){return jsxRuntimeExports.jsx(I,{text:t,...n})}function cc({className:t,text:n,...i}){const o=k("io-notification-body-description",t);return jsxRuntimeExports.jsx("p",{className:o,...i,children:n})}function uc({className:n,notification:i}){const o=k("io-notification-footer",n),{FooterButton:r}=pc(),{handleWrapperClick:a}=Ql(i),s=useMemo(()=>function(e){const t=[],n={};if(!e)return;e.forEach(e=>{const{displayId:i,displayPath:o}=e,r={...e,children:[]};if(o&&o.length>0){let e;o.forEach((t,i)=>{0===i?e=n[t]:e&&(e=e.children?.find(e=>e.displayId===t));}),e&&e.children?.push(r);}else i?(t.push(r),n[i]=r):t.push(r);i&&(n[i]=r);});const i=e=>{e.forEach(e=>{0===e.children?.length?delete e.children:e.children&&i(e.children);});};return i(t),t}(i.actions),[i.actions]),l=(t,n)=>t.children?jsxRuntimeExports.jsx(Ui,{text:t.title,children:t.children.map(l)},`${t.title}-${n}`):((t,n)=>jsxRuntimeExports.jsx(Ui.Item,{children:jsxRuntimeExports.jsx(r,{variant:"link",className:"io-dropdown-menu-item io-dropdown-menu-button",notificationAction:t})},`${t.title}-${n}`))(t,n);return jsxRuntimeExports.jsx("div",{className:o,onClick:a,children:jsxRuntimeExports.jsx(X,{align:"right",children:s?.map((n,i)=>n.children?jsxRuntimeExports.jsxs(X,{variant:"append",children:[jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===i?"primary":"default"}),jsxRuntimeExports.jsx(Ui,{variant:0===i?"primary":"default",icon:"ellipsis",children:n.children.map(l)})]},`${n.title}-${i}`):jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===i?"primary":"link"},`${n.title}-${i}`))})})}function dc({notificationAction:t,...n}){const i=useCallback(e=>{e.stopPropagation(),t.onClick({close:true});},[t]);return jsxRuntimeExports.jsx(A,{text:t.title,onClick:i,...n})}const fc={Header:Xl,HeaderCount:Zl,HeaderBadge:ec,HeaderIcon:tc,HeaderTitle:nc,HeaderTimestamp:ic,HeaderButtonSnooze:oc,HeaderButtonClose:rc,Body:ac,BodyIcon:sc,BodyTitle:lc,BodyDescription:cc,Footer:uc,FooterButton:dc},mc=createContext(fc),hc=memo(({children:t,components:n})=>{const i=useMemo(()=>({...fc,...n}),[n]);return jsxRuntimeExports.jsx(mc.Provider,{value:i,children:t})});function pc(e){return {...useContext(mc),...e}}function gc({className:n,notification:i,...o}){const{Header:r,Body:a,Footer:s}=pc(),{severity:l}=i,c=k("io-notification",`severity-${l?.toLowerCase()??"none"}`,"Acknowledged"!==i.state&&"state-new",n);return jsxRuntimeExports.jsxs("div",{className:c,...o,children:[jsxRuntimeExports.jsx(r,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(s,{notification:i})]})}function vc({components:t,notification:n,...i}){return jsxRuntimeExports.jsx(hc,{components:t,children:jsxRuntimeExports.jsx(gc,{notification:n,...i})})}function yc({className:n,notifications:i,...o}){const[a,s]=useState(false),c=i.length>=3?"large":"normal",u=2===i.length?"small":c,d=i[0].severity,f=k("io-notification-stack",a&&"io-notification-stack-open","normal"!==u&&[`io-notification-stack-${u}`],d&&"None"!==d&&[`io-notification-stack-${d.toLowerCase()}`],n),m=useCallback(()=>{s(true);},[]),h=useCallback(e=>{e.stopPropagation(),i.forEach(e=>{e.close();});},[i]);return jsxRuntimeExports.jsxs("div",{className:f,onClick:m,...o,children:[a&&"normal"!==u&&jsxRuntimeExports.jsx("div",{className:"io-notification-stack-btn",children:jsxRuntimeExports.jsx(A,{icon:"close",onClick:e=>h(e),children:jsxRuntimeExports.jsx("span",{className:"io-btn-text",children:"Clear Stack"})})}),i.map(t=>jsxRuntimeExports.jsx(vc,{notification:t},t.id))]})}function wc({...t}){const{notificationStacks:i}=el();return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:i.map(n=>jsxRuntimeExports.jsx(yc,{notifications:n.items,...t},n.key))})}hc.displayName="ComponentsStoreProvider";const bc=({notification:n,Notification:i,...o})=>{const{configuration:r,isBulkActionsSupported:a,selectedNotifications:s,selectNotification:l}=el(),{isPanelVisible:c,isBulkActionsVisible:u}=Ol(),d=r.sourceFilter?.muted??[],f=n.source&&d.includes(n.source)||d.includes("*");if(!c&&f)return null;const m=c&&a&&u,h=s.includes(n.id);return m?jsxRuntimeExports.jsxs("div",{className:k("io-notification-list-bulk-action-item",{selected:h}),children:[jsxRuntimeExports.jsx(io,{checked:h,onChange:e=>l(n.id,e.target.checked)}),jsxRuntimeExports.jsx(i,{notification:n,...o})]}):jsxRuntimeExports.jsx(i,{notification:n,...o})};function Cc({className:n,Notification:i,notifications:o=[],noNotificationText:r="No notifications to display",...a}){const s=k("io-notification-list",n),{settings:l}=el(),{isPanelVisible:c}=Ol(),{toastStacking:u}=l,d=u&&!c,f=o.length>0;return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[d&&jsxRuntimeExports.jsx(wc,{}),!d&&(f?o.map(t=>jsxRuntimeExports.jsx(bc,{notification:t,Notification:i,...a},t.id)):jsxRuntimeExports.jsx("div",{className:"flex jc-center mt-8",children:r}))]})}const kc={Header:Ll,HeaderCaptionTitle:Fl,HeaderCaptionCount:function({variant:t="primary",...n}){const{notificationsCount:i=0}=el();return 0===i?null:jsxRuntimeExports.jsx(E,{variant:t,...n,children:i>99?"99+":i})},HeaderCaptionButtonSettings:function({icon:t="cog",size:n="32",variant:i="circle",...o}){return ho()?jsxRuntimeExports.jsx(S,{icon:t,size:n,variant:i,...o}):null},HeaderCaptionButtonClose:function({icon:t="close",size:n="32",variant:i="circle",onClick:o,...r}){const{hidePanel:a}=el(),s=ho();return jsxRuntimeExports.jsx(S,{icon:t,size:n,variant:i,onClick:e=>{o?o(e):s&&a();},...r})},HeaderActions:function({className:n,...i}){const o=k("io-panel-header-actions",n),{HeaderActionSort:r,HeaderActionView:a,HeaderActionClear:s,HeaderActionEdit:l}=Dc();return jsxRuntimeExports.jsxs("div",{className:o,...i,children:[jsxRuntimeExports.jsxs(X,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]}),jsxRuntimeExports.jsxs(X,{children:[jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{})]})]})},HeaderActionSort:function({text:n="Sort by",...i}){const{sortNotificationsBy:o,setSortBy:a}=Ol(),{onNotificationsSort:s}=(()=>{const{notifications:e}=el(),[t,n]=useState(jl),{key:i,descending:o}=t,a=useMemo(()=>Yl[i](e,o),[e,i,o]),s=useCallback(e=>{n(t=>({key:e,descending:t.key!==e?jl.descending:!t.descending}));},[]);return {onNotificationsSort:s,sortedNotifications:a}})();return jsxRuntimeExports.jsxs(Q,{variant:"light",...i,children:[jsxRuntimeExports.jsxs(Q.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:Ul[o].toLowerCase()})]}),jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsx(Q.List,{variant:"single",checkIcon:"check",children:["Newest","Oldest","Priority"].map(t=>{const n="Priority"===t?"severity":t.toLowerCase();return jsxRuntimeExports.jsx(Q.Item,{isSelected:o===n,onClick:()=>{a(n),s(n);},children:t},t)})})})]})},HeaderActionView:function({text:n="View",...i}){const{settings:o}=el(),{viewNotificationsBy:r,setViewBy:a}=Ol(),s=o.snooze?.enabled?["All","Read","Unread","Snoozed"]:["All","Read","Unread"];return jsxRuntimeExports.jsxs(Q,{variant:"light",...i,children:[jsxRuntimeExports.jsxs(Q.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:r})]}),jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsx(Q.List,{variant:"single",checkIcon:"check",children:s.map(t=>jsxRuntimeExports.jsx(Q.Item,{isSelected:r===t.toLowerCase(),onClick:()=>a(t.toLowerCase()),children:t},t))})})]})},HeaderActionClear:function({text:t="Clear All",...n}){const{clearAll:i,notificationsCount:o}=el();return jsxRuntimeExports.jsx(A,{variant:"link",text:t,onClick:i,disabled:0===o,...n})},HeaderActionEdit:function({tooltip:t="Bulk Edit",...n}){const{isBulkActionsSupported:i,notificationsCount:o}=el(),{showBulkActions:r}=Ol();return i?jsxRuntimeExports.jsx(S,{icon:"pen-to-square",title:t,size:"32",onClick:r,disabled:0===o,...n}):null},HeaderBulkActions:function({className:n,...i}){const o=k("io-panel-header-bulk-actions",n),{HeaderBulkActionSelect:r,HeaderBulkActionSelectDropdown:a,HeaderBulkActionMarkAsRead:s,HeaderBulkActionMarkAsUnread:l,HeaderBulkActionSnooze:c,HeaderBulkActionClear:u,HeaderBulkActionClose:d}=Dc(),{isBulkActionsSupported:f}=el();return f?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsxs(X,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]})}):null},HeaderBulkActionSelect:function({...t}){const{isBulkActionsSupported:n,selectedNotifications:i,selectAllNotifications:o,notificationsCount:r}=el();return n?jsxRuntimeExports.jsx(io,{checked:r===i.length&&r>0,onChange:e=>o("all",e.target.checked),disabled:0===r,...t}):null},HeaderBulkActionSelectDropdown:function({...n}){const{isBulkActionsSupported:i,selectAllNotifications:o,notificationsCount:r}=el();return i?jsxRuntimeExports.jsxs(Q,{variant:"light",...n,children:[jsxRuntimeExports.jsx(Q.ButtonIcon,{variant:"default",icon:"chevron-down",size:"16",iconSize:"10",disabled:0===r}),jsxRuntimeExports.jsx(F,{children:jsxRuntimeExports.jsxs(Q.List,{variant:"single",checkIcon:"check",children:[jsxRuntimeExports.jsx(Q.ItemSection,{children:"Select"}),["All","Read","Unread","Snoozed"].map(t=>jsxRuntimeExports.jsx(Q.Item,{onClick:()=>o(t.toLowerCase(),true),children:t},t))]})})]}):null},HeaderBulkActionMarkAsRead:function({icon:t="envelope-open",size:n="32",variant:i="circle",tooltip:o="Mark as read",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=el(),d=useCallback(()=>{c(l,"Seen");},[l,c]);return s?jsxRuntimeExports.jsx(S,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionMarkAsUnread:function({icon:t="envelope",size:n="32",variant:i="circle",tooltip:o="Mark as unread",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=el(),d=useCallback(()=>{c(l,"Active");},[l,c]);return s?jsxRuntimeExports.jsx(S,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionSnooze:function({icon:t="snooze",size:n="32",variant:i="circle",tooltip:o="Snooze",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,snoozeMany:c,settings:u,notificationsCount:d}=el(),f=useCallback(()=>{c(l,u.snooze?.duration??0);},[l,c,u.snooze?.duration]);return s&&u.snooze?.enabled?jsxRuntimeExports.jsx(S,{icon:t,size:n,variant:i,title:o,onClick:f,disabled:0===d,...a}):null},HeaderBulkActionClear:function({icon:t="trash",size:n="32",variant:i="circle",tooltip:o="Clear",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,clearMany:c,notificationsCount:u}=el(),d=useCallback(()=>{c(l);},[l,c]);return s?jsxRuntimeExports.jsx(S,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionClose:function({text:t="Done",variant:n="primary",...i}){const{isBulkActionsSupported:o,notificationsCount:r}=el(),{hideBulkActions:a}=Ol();return o?jsxRuntimeExports.jsx(A,{variant:n,text:t,onClick:a,disabled:0===r,...i}):null},HeaderSearch:function({className:n,icon:i="search",placeholder:o="Search",...r}){const a=k("io-panel-header-search",n),{notificationsCount:s}=el(),{searchQuery:l,setSearch:c}=Ol(),d=useRef(null);return jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(to,{ref:d,value:l,iconPrepend:i,placeholder:o,onChange:e=>c(e.target.value),...r}),l.length>0&&jsxRuntimeExports.jsx("p",{className:"io-panel-header-search-count",children:`${s} results`})]})},Body:Wl,Footer:Kl,FooterButtons:Jl,FooterButtonClearAll:ql,FooterButtonClearAllOld:Gl,Notification:vc,NotificationsList:Cc},Nc=createContext(kc),Sc=memo(({children:t,components:n})=>{const i=useMemo(()=>({...kc,...n}),[n]);return jsxRuntimeExports.jsx(Nc.Provider,{value:i,children:t})});function Dc(e){return {...useContext(Nc),...e}}Sc.displayName="ComponentsStoreProvider";const Ic={Body:function({className:t,notifications:n,maxToasts:i=1,...o}){const r=k("io-toasts-body",t),{NotificationsList:a,Notification:s}=Ac(),[c,u]=useState([]);return useEffect(()=>{const e=i<0?n.length:i,t=n.filter(e=>"Active"===e.state).slice(0,e);for(const e of t)e.onShow();u(t);},[n,i]),jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx(a,{Notification:s,notifications:c,noNotificationText:""})})},Notification:vc,NotificationsList:Cc},Mc=createContext(Ic),Tc=memo(({children:t,components:n})=>{const i=useMemo(()=>({...Ic,...n}),[n]);return jsxRuntimeExports.jsx(Mc.Provider,{value:i,children:t})});function Ac(e){return {...useContext(Mc),...e}}Tc.displayName="ComponentsStoreProvider";const Fc=n=>{const{General:i,Layouts:o,Downloads:r,System:a}=Uu();return jsxRuntimeExports.jsxs(qi,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})},Bc=({title:n="General",...i})=>{const{Theme:o,PinnedPosition:r,MinimizeToTray:a,ShowTutorialOnStartup:s}=Uu();return jsxRuntimeExports.jsxs(M,{title:n,...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},Rc=(e="dark")=>{switch(e){case "dark":return "Dark";case "light":return "Light";default:return e}},_c=({className:n,title:i="Theme",...o})=>{const{currentTheme:a,selectTheme:c}=(()=>{const e=useContext(IOConnectContext),[t,n]=useState(null),i=useCallback(t=>e?.themes?.select(t),[e]);return useEffect(()=>{if(!e)return;let t=false;const i=e=>{t||n(e);};return e.themes?.onChanged(i),e.themes?.getCurrent().then(i).catch(console.warn),()=>{t=true;}},[e]),{currentTheme:t,selectTheme:i}})(),u=(()=>{const e=useContext(IOConnectContext),[t,n]=useState([]);return useEffect(()=>{e&&e.themes?.list().then(n).catch(console.warn);},[e]),t})();return jsxRuntimeExports.jsxs("div",{className:k("flex jc-between ai-center",n),...o,children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsxs(Q,{variant:"light",children:[jsxRuntimeExports.jsx(Q.Button,{text:Rc(a?.name)}),jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsx(Q.List,{children:u.map(({name:t})=>jsxRuntimeExports.jsx(Q.Item,{onClick:()=>c(t),children:Rc(t)},t))})})]})]})},Hc=({prefKey:n,options:i,disabled:o,...r})=>{const{isLoading:a,value:s="Select option",update:l}=ya({prefKey:n});return jsxRuntimeExports.jsxs(Q,{variant:"light",disabled:a||o,...r,children:[jsxRuntimeExports.jsx(Q.Button,{children:s}),jsxRuntimeExports.jsx(Q.Content,{children:jsxRuntimeExports.jsx(Q.List,{children:i.map(t=>jsxRuntimeExports.jsx(Q.Item,{onClick:()=>(async e=>{if(e!==s)try{await l(e);}catch(e){console.error("Failed to update platform preference:",e);}})(t),children:t},t))})})]})},jc=({className:n,label:i="Pinned position",...o})=>jsxRuntimeExports.jsx(M,{className:k("io-block-list-gap",n),...o,children:jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsx(Hc,{className:n,prefKey:So,options:["Left","Right"],...o})]})}),zc=({prefKey:t,...n})=>{const{isLoading:i,value:o=false,update:r}=ya({prefKey:t});return jsxRuntimeExports.jsx(ro,{checked:o,disabled:i,onChange:e=>r(e.target.checked),...n})},$c=({align:t="right",label:n="Allow docking",...i})=>jsxRuntimeExports.jsx(zc,{align:t,label:n,prefKey:Do,...i}),Vc=({align:t="right",label:n="Minimize to tray",...i})=>jsxRuntimeExports.jsx(zc,{align:t,label:n,prefKey:xo,...i}),Yc=({align:t="right",label:n="Auto-close on starting apps and workspaces",...i})=>jsxRuntimeExports.jsx(zc,{align:t,label:n,prefKey:Eo,disabled:true,...i}),Uc=({align:t="right",label:n="Show tutorial on startup",...i})=>jsxRuntimeExports.jsx(zc,{align:t,label:n,prefKey:Io,...i}),Wc=({title:n="Layouts",...i})=>{const{LayoutsSaveCurrentOnExit:o,LayoutsShowDeletePrompt:r,LayoutsShowUnsavedChangesPrompt:a}=Uu();return jsxRuntimeExports.jsxs(M,{title:n,...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(r,{})]})},Kc=({align:t="right",label:n="Restore last saved on startup",...i})=>jsxRuntimeExports.jsx(zc,{align:t,label:n,prefKey:Mo,...i}),Jc=({align:t="right",label:n="Save current on exit",...i})=>jsxRuntimeExports.jsx(zc,{align:t,label:n,prefKey:To,...i}),qc=({align:t="right",label:n="Show prompt for unsaved changes",...i})=>jsxRuntimeExports.jsx(zc,{align:t,label:n,prefKey:Ao,...i}),Gc=({align:t="right",label:n="Show prompt for deleting",...i})=>jsxRuntimeExports.jsx(zc,{align:t,label:n,prefKey:Po,...i}),Qc=({className:t,title:n="Downloads",...i})=>{const{DownloadsLocation:o}=Uu();return jsxRuntimeExports.jsx(M,{className:k("io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Xc=({align:t="right",label:n="Ask where to save each file before downloading",...i})=>jsxRuntimeExports.jsx(zc,{align:t,label:n,prefKey:Oo,...i}),Zc=({className:n,label:i="Location",...o})=>{const{configuration:{downloadFolder:r},setDownloadLocationWithDialog:a,isDownloadLocationDialogVisible:s,downloadLocationList:l}=Ka();return jsxRuntimeExports.jsxs(M,{className:k("io-preferences-download-section",n),...o,children:[jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsx(A,{text:"Change",onClick:a,disabled:s})]}),jsxRuntimeExports.jsx("p",{children:r??l?.[0]??"Not set"})]})},eu=({className:n,title:i="System",...o})=>{const{SystemRestartSection:r,SystemShutdownSection:a}=Uu();return jsxRuntimeExports.jsxs(M,{className:k("io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})};var tu=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],nu={_disable:[],allowInput:false,allowInvalidPreload:false,altFormat:"F j, Y",altInput:false,altInputClass:"form-control input",animate:"object"==typeof window&&-1===window.navigator.userAgent.indexOf("MSIE"),ariaDateFormat:"F j, Y",autoFillDefaultTime:true,clickOpens:true,closeOnSelect:true,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:false,enableSeconds:false,enableTime:false,errorHandler:function(e){return "undefined"!=typeof console&&console.warn(e)},getWeek:function(e){var t=new Date(e.getTime());t.setHours(0,0,0,0),t.setDate(t.getDate()+3-(t.getDay()+6)%7);var n=new Date(t.getFullYear(),0,4);return 1+Math.round(((t.getTime()-n.getTime())/864e5-3+(n.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:false,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:false,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:false,showMonths:1,static:false,time_24hr:false,weekNumbers:false,wrap:false},iu={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(e){var t=e%100;if(t>3&&t<21)return "th";switch(t%10){case 1:return "st";case 2:return "nd";case 3:return "rd";default:return "th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:false},ou=function(e,t){return void 0===t&&(t=2),("000"+e).slice(-1*t)},ru=function(e){return  true===e?1:0};function au(e,t){var n;return function(){var i=this,o=arguments;clearTimeout(n),n=setTimeout(function(){return e.apply(i,o)},t);}}var su=function(e){return e instanceof Array?e:[e]};function lu(e,t,n){if(true===n)return e.classList.add(t);e.classList.remove(t);}function cu(e,t,n){var i=window.document.createElement(e);return t=t||"",n=n||"",i.className=t,void 0!==n&&(i.textContent=n),i}function uu(e){for(;e.firstChild;)e.removeChild(e.firstChild);}function du(e,t){return t(e)?e:e.parentNode?du(e.parentNode,t):void 0}function fu(e,t){var n=cu("div","numInputWrapper"),i=cu("input","numInput "+e),o=cu("span","arrowUp"),r=cu("span","arrowDown");if(-1===navigator.userAgent.indexOf("MSIE 9.0")?i.type="number":(i.type="text",i.pattern="\\d*"),void 0!==t)for(var a in t)i.setAttribute(a,t[a]);return n.appendChild(i),n.appendChild(o),n.appendChild(r),n}function mu(e){try{return "function"==typeof e.composedPath?e.composedPath()[0]:e.target}catch(t){return e.target}}var hu=function(){},pu=function(e,t,n){return n.months[t?"shorthand":"longhand"][e]},gu={D:hu,F:function(e,t,n){e.setMonth(n.months.longhand.indexOf(t));},G:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},H:function(e,t){e.setHours(parseFloat(t));},J:function(e,t){e.setDate(parseFloat(t));},K:function(e,t,n){e.setHours(e.getHours()%12+12*ru(new RegExp(n.amPM[1],"i").test(t)));},M:function(e,t,n){e.setMonth(n.months.shorthand.indexOf(t));},S:function(e,t){e.setSeconds(parseFloat(t));},U:function(e,t){return new Date(1e3*parseFloat(t))},W:function(e,t,n){var i=parseInt(t),o=new Date(e.getFullYear(),0,2+7*(i-1),0,0,0,0);return o.setDate(o.getDate()-o.getDay()+n.firstDayOfWeek),o},Y:function(e,t){e.setFullYear(parseFloat(t));},Z:function(e,t){return new Date(t)},d:function(e,t){e.setDate(parseFloat(t));},h:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},i:function(e,t){e.setMinutes(parseFloat(t));},j:function(e,t){e.setDate(parseFloat(t));},l:hu,m:function(e,t){e.setMonth(parseFloat(t)-1);},n:function(e,t){e.setMonth(parseFloat(t)-1);},s:function(e,t){e.setSeconds(parseFloat(t));},u:function(e,t){return new Date(parseFloat(t))},w:hu,y:function(e,t){e.setFullYear(2e3+parseFloat(t));}},vu={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},yu={Z:function(e){return e.toISOString()},D:function(e,t,n){return t.weekdays.shorthand[yu.w(e,t,n)]},F:function(e,t,n){return pu(yu.n(e,t,n)-1,false,t)},G:function(e,t,n){return ou(yu.h(e,t,n))},H:function(e){return ou(e.getHours())},J:function(e,t){return void 0!==t.ordinal?e.getDate()+t.ordinal(e.getDate()):e.getDate()},K:function(e,t){return t.amPM[ru(e.getHours()>11)]},M:function(e,t){return pu(e.getMonth(),true,t)},S:function(e){return ou(e.getSeconds())},U:function(e){return e.getTime()/1e3},W:function(e,t,n){return n.getWeek(e)},Y:function(e){return ou(e.getFullYear(),4)},d:function(e){return ou(e.getDate())},h:function(e){return e.getHours()%12?e.getHours()%12:12},i:function(e){return ou(e.getMinutes())},j:function(e){return e.getDate()},l:function(e,t){return t.weekdays.longhand[e.getDay()]},m:function(e){return ou(e.getMonth()+1)},n:function(e){return e.getMonth()+1},s:function(e){return e.getSeconds()},u:function(e){return e.getTime()},w:function(e){return e.getDay()},y:function(e){return String(e.getFullYear()).substring(2)}},wu=function(e){var t=e.config,n=void 0===t?nu:t,i=e.l10n,o=void 0===i?iu:i,r=e.isMobile,a=void 0!==r&&r;return function(e,t,i){var r=i||o;return void 0===n.formatDate||a?t.split("").map(function(t,i,o){return yu[t]&&"\\"!==o[i-1]?yu[t](e,r,n):"\\"!==t?t:""}).join(""):n.formatDate(e,t,r)}},bu=function(e){var t=e.config,n=void 0===t?nu:t,i=e.l10n,o=void 0===i?iu:i;return function(e,t,i,r){if(0===e||e){var a,s=r||o,l=e;if(e instanceof Date)a=new Date(e.getTime());else if("string"!=typeof e&&void 0!==e.toFixed)a=new Date(e);else if("string"==typeof e){var c=t||(n||nu).dateFormat,u=String(e).trim();if("today"===u)a=new Date,i=true;else if(n&&n.parseDate)a=n.parseDate(e,c);else if(/Z$/.test(u)||/GMT$/.test(u))a=new Date(e);else {for(var d=void 0,f=[],m=0,h=0,p="";m<c.length;m++){var g=c[m],v="\\"===g,y="\\"===c[m-1]||v;if(vu[g]&&!y){p+=vu[g];var w=new RegExp(p).exec(e);w&&(d=true)&&f["Y"!==g?"push":"unshift"]({fn:gu[g],val:w[++h]});}else v||(p+=".");}a=n&&n.noCalendar?new Date((new Date).setHours(0,0,0,0)):new Date((new Date).getFullYear(),0,1,0,0,0,0),f.forEach(function(e){var t=e.fn,n=e.val;return a=t(a,n,s)||a}),a=d?a:void 0;}}if(a instanceof Date&&!isNaN(a.getTime()))return  true===i&&a.setHours(0,0,0,0),a;n.errorHandler(new Error("Invalid date provided: "+l));}}};function Cu(e,t,n){return void 0===n&&(n=true),false!==n?new Date(e.getTime()).setHours(0,0,0,0)-new Date(t.getTime()).setHours(0,0,0,0):e.getTime()-t.getTime()}var ku=function(e,t,n){return 3600*e+60*t+n},Nu=864e5;function Su(e){var t=e.defaultHour,n=e.defaultMinute,i=e.defaultSeconds;if(void 0!==e.minDate){var o=e.minDate.getHours(),r=e.minDate.getMinutes(),a=e.minDate.getSeconds();t<o&&(t=o),t===o&&n<r&&(n=r),t===o&&n===r&&i<a&&(i=e.minDate.getSeconds());}if(void 0!==e.maxDate){var s=e.maxDate.getHours(),l=e.maxDate.getMinutes();(t=Math.min(t,s))===s&&(n=Math.min(l,n)),t===s&&n===l&&(i=e.maxDate.getSeconds());}return {hours:t,minutes:n,seconds:i}}"function"!=typeof Object.assign&&(Object.assign=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(!e)throw TypeError("Cannot convert undefined or null to object");for(var i=function(t){t&&Object.keys(t).forEach(function(n){return e[n]=t[n]});},o=0,r=t;o<r.length;o++){i(r[o]);}return e});var Du=function(){return Du=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},Du.apply(this,arguments)},xu=function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var i=Array(e),o=0;for(t=0;t<n;t++)for(var r=arguments[t],a=0,s=r.length;a<s;a++,o++)i[o]=r[a];return i};function Eu(e,t){var n={config:Du(Du({},nu),Mu.defaultConfig),l10n:iu};function i(){var e;return (null===(e=n.calendarContainer)||void 0===e?void 0:e.getRootNode()).activeElement||document.activeElement}function o(e){return e.bind(n)}function r(){var e=n.config;false===e.weekNumbers&&1===e.showMonths||true!==e.noCalendar&&window.requestAnimationFrame(function(){if(void 0!==n.calendarContainer&&(n.calendarContainer.style.visibility="hidden",n.calendarContainer.style.display="block"),void 0!==n.daysContainer){var t=(n.days.offsetWidth+1)*e.showMonths;n.daysContainer.style.width=t+"px",n.calendarContainer.style.width=t+(void 0!==n.weekWrapper?n.weekWrapper.offsetWidth:0)+"px",n.calendarContainer.style.removeProperty("visibility"),n.calendarContainer.style.removeProperty("display");}});}function a(e){if(0===n.selectedDates.length){var t=void 0===n.config.minDate||Cu(new Date,n.config.minDate)>=0?new Date:new Date(n.config.minDate.getTime()),i=Su(n.config);t.setHours(i.hours,i.minutes,i.seconds,t.getMilliseconds()),n.selectedDates=[t],n.latestSelectedDateObj=t;} void 0!==e&&"blur"!==e.type&&function(e){e.preventDefault();var t="keydown"===e.type,i=mu(e),o=i;void 0!==n.amPM&&i===n.amPM&&(n.amPM.textContent=n.l10n.amPM[ru(n.amPM.textContent===n.l10n.amPM[0])]);var r=parseFloat(o.getAttribute("min")),a=parseFloat(o.getAttribute("max")),s=parseFloat(o.getAttribute("step")),l=parseInt(o.value,10),c=e.delta||(t?38===e.which?1:-1:0),u=l+s*c;if(void 0!==o.value&&2===o.value.length){var d=o===n.hourElement,f=o===n.minuteElement;u<r?(u=a+u+ru(!d)+(ru(d)&&ru(!n.amPM)),f&&p(void 0,-1,n.hourElement)):u>a&&(u=o===n.hourElement?u-a-ru(!n.amPM):r,f&&p(void 0,1,n.hourElement)),n.amPM&&d&&(1===s?u+l===23:Math.abs(u-l)>s)&&(n.amPM.textContent=n.l10n.amPM[ru(n.amPM.textContent===n.l10n.amPM[0])]),o.value=ou(u);}}(e);var o=n._input.value;s(),Z(),n._input.value!==o&&n._debouncedChange();}function s(){if(void 0!==n.hourElement&&void 0!==n.minuteElement){var e,t,i=(parseInt(n.hourElement.value.slice(-2),10)||0)%24,o=(parseInt(n.minuteElement.value,10)||0)%60,r=void 0!==n.secondElement?(parseInt(n.secondElement.value,10)||0)%60:0;void 0!==n.amPM&&(e=i,t=n.amPM.textContent,i=e%12+12*ru(t===n.l10n.amPM[1]));var a=void 0!==n.config.minTime||n.config.minDate&&n.minDateHasTime&&n.latestSelectedDateObj&&0===Cu(n.latestSelectedDateObj,n.config.minDate,true),s=void 0!==n.config.maxTime||n.config.maxDate&&n.maxDateHasTime&&n.latestSelectedDateObj&&0===Cu(n.latestSelectedDateObj,n.config.maxDate,true);if(void 0!==n.config.maxTime&&void 0!==n.config.minTime&&n.config.minTime>n.config.maxTime){var l=ku(n.config.minTime.getHours(),n.config.minTime.getMinutes(),n.config.minTime.getSeconds()),u=ku(n.config.maxTime.getHours(),n.config.maxTime.getMinutes(),n.config.maxTime.getSeconds()),d=ku(i,o,r);if(d>u&&d<l){var f=function(e){var t=Math.floor(e/3600),n=(e-3600*t)/60;return [t,n,e-3600*t-60*n]}(l);i=f[0],o=f[1],r=f[2];}}else {if(s){var m=void 0!==n.config.maxTime?n.config.maxTime:n.config.maxDate;(i=Math.min(i,m.getHours()))===m.getHours()&&(o=Math.min(o,m.getMinutes())),o===m.getMinutes()&&(r=Math.min(r,m.getSeconds()));}if(a){var h=void 0!==n.config.minTime?n.config.minTime:n.config.minDate;(i=Math.max(i,h.getHours()))===h.getHours()&&o<h.getMinutes()&&(o=h.getMinutes()),o===h.getMinutes()&&(r=Math.max(r,h.getSeconds()));}}c(i,o,r);}}function l(e){var t=e||n.latestSelectedDateObj;t&&t instanceof Date&&c(t.getHours(),t.getMinutes(),t.getSeconds());}function c(e,t,i){ void 0!==n.latestSelectedDateObj&&n.latestSelectedDateObj.setHours(e%24,t,i||0,0),n.hourElement&&n.minuteElement&&!n.isMobile&&(n.hourElement.value=ou(n.config.time_24hr?e:(12+e)%12+12*ru(e%12==0)),n.minuteElement.value=ou(t),void 0!==n.amPM&&(n.amPM.textContent=n.l10n.amPM[ru(e>=12)]),void 0!==n.secondElement&&(n.secondElement.value=ou(i)));}function u(e){var t=mu(e),n=parseInt(t.value)+(e.delta||0);(n/1e3>1||"Enter"===e.key&&!/[^\d]/.test(n.toString()))&&T(n);}function d(e,t,i,o){return t instanceof Array?t.forEach(function(t){return d(e,t,i,o)}):e instanceof Array?e.forEach(function(e){return d(e,t,i,o)}):(e.addEventListener(t,i,o),void n._handlers.push({remove:function(){return e.removeEventListener(t,i,o)}}))}function f(){J("onChange");}function m(e,t){var i=void 0!==e?n.parseDate(e):n.latestSelectedDateObj||(n.config.minDate&&n.config.minDate>n.now?n.config.minDate:n.config.maxDate&&n.config.maxDate<n.now?n.config.maxDate:n.now),o=n.currentYear,r=n.currentMonth;try{void 0!==i&&(n.currentYear=i.getFullYear(),n.currentMonth=i.getMonth());}catch(e){e.message="Invalid date supplied: "+i,n.config.errorHandler(e);}t&&n.currentYear!==o&&(J("onYearChange"),k()),!t||n.currentYear===o&&n.currentMonth===r||J("onMonthChange"),n.redraw();}function h(e){var t=mu(e);~t.className.indexOf("arrow")&&p(e,t.classList.contains("arrowUp")?1:-1);}function p(e,t,n){var i=e&&mu(e),o=n||i&&i.parentNode&&i.parentNode.firstChild,r=q("increment");r.delta=t,o&&o.dispatchEvent(r);}function g(e,t,i,o){var r=A(t,true),a=cu("span",e,t.getDate().toString());return a.dateObj=t,a.$i=o,a.setAttribute("aria-label",n.formatDate(t,n.config.ariaDateFormat)),-1===e.indexOf("hidden")&&0===Cu(t,n.now)&&(n.todayDateElem=a,a.classList.add("today"),a.setAttribute("aria-current","date")),r?(a.tabIndex=-1,G(t)&&(a.classList.add("selected"),n.selectedDateElem=a,"range"===n.config.mode&&(lu(a,"startRange",n.selectedDates[0]&&0===Cu(t,n.selectedDates[0],true)),lu(a,"endRange",n.selectedDates[1]&&0===Cu(t,n.selectedDates[1],true)),"nextMonthDay"===e&&a.classList.add("inRange")))):a.classList.add("flatpickr-disabled"),"range"===n.config.mode&&function(e){return !("range"!==n.config.mode||n.selectedDates.length<2)&&(Cu(e,n.selectedDates[0])>=0&&Cu(e,n.selectedDates[1])<=0)}(t)&&!G(t)&&a.classList.add("inRange"),n.weekNumbers&&1===n.config.showMonths&&"prevMonthDay"!==e&&o%7==6&&n.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+n.config.getWeek(t)+"</span>"),J("onDayCreate",a),a}function v(e){e.focus(),"range"===n.config.mode&&F(e);}function y(e){for(var t=e>0?0:n.config.showMonths-1,i=e>0?n.config.showMonths:-1,o=t;o!=i;o+=e)for(var r=n.daysContainer.children[o],a=e>0?0:r.children.length-1,s=e>0?r.children.length:-1,l=a;l!=s;l+=e){var c=r.children[l];if(-1===c.className.indexOf("hidden")&&A(c.dateObj))return c}}function w(e,t){var o=i(),r=P(o||document.body),a=void 0!==e?e:r?o:void 0!==n.selectedDateElem&&P(n.selectedDateElem)?n.selectedDateElem:void 0!==n.todayDateElem&&P(n.todayDateElem)?n.todayDateElem:y(t>0?1:-1);void 0===a?n._input.focus():r?function(e,t){for(var i=-1===e.className.indexOf("Month")?e.dateObj.getMonth():n.currentMonth,o=t>0?n.config.showMonths:-1,r=t>0?1:-1,a=i-n.currentMonth;a!=o;a+=r)for(var s=n.daysContainer.children[a],l=i-n.currentMonth===a?e.$i+t:t<0?s.children.length-1:0,c=s.children.length,u=l;u>=0&&u<c&&u!=(t>0?c:-1);u+=r){var d=s.children[u];if(-1===d.className.indexOf("hidden")&&A(d.dateObj)&&Math.abs(e.$i-u)>=Math.abs(t))return v(d)}n.changeMonth(r),w(y(r),0);}(a,t):v(a);}function b(e,t){for(var i=(new Date(e,t,1).getDay()-n.l10n.firstDayOfWeek+7)%7,o=n.utils.getDaysInMonth((t-1+12)%12,e),r=n.utils.getDaysInMonth(t,e),a=window.document.createDocumentFragment(),s=n.config.showMonths>1,l=s?"prevMonthDay hidden":"prevMonthDay",c=s?"nextMonthDay hidden":"nextMonthDay",u=o+1-i,d=0;u<=o;u++,d++)a.appendChild(g("flatpickr-day "+l,new Date(e,t-1,u),0,d));for(u=1;u<=r;u++,d++)a.appendChild(g("flatpickr-day",new Date(e,t,u),0,d));for(var f=r+1;f<=42-i&&(1===n.config.showMonths||d%7!=0);f++,d++)a.appendChild(g("flatpickr-day "+c,new Date(e,t+1,f%r),0,d));var m=cu("div","dayContainer");return m.appendChild(a),m}function C(){if(void 0!==n.daysContainer){uu(n.daysContainer),n.weekNumbers&&uu(n.weekNumbers);for(var e=document.createDocumentFragment(),t=0;t<n.config.showMonths;t++){var i=new Date(n.currentYear,n.currentMonth,1);i.setMonth(n.currentMonth+t),e.appendChild(b(i.getFullYear(),i.getMonth()));}n.daysContainer.appendChild(e),n.days=n.daysContainer.firstChild,"range"===n.config.mode&&1===n.selectedDates.length&&F();}}function k(){if(!(n.config.showMonths>1||"dropdown"!==n.config.monthSelectorType)){var e=function(e){return !(void 0!==n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&e<n.config.minDate.getMonth())&&!(void 0!==n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()&&e>n.config.maxDate.getMonth())};n.monthsDropdownContainer.tabIndex=-1,n.monthsDropdownContainer.innerHTML="";for(var t=0;t<12;t++)if(e(t)){var i=cu("option","flatpickr-monthDropdown-month");i.value=new Date(n.currentYear,t).getMonth().toString(),i.textContent=pu(t,n.config.shorthandCurrentMonth,n.l10n),i.tabIndex=-1,n.currentMonth===t&&(i.selected=true),n.monthsDropdownContainer.appendChild(i);}}}function N(){var e,t=cu("div","flatpickr-month"),i=window.document.createDocumentFragment();n.config.showMonths>1||"static"===n.config.monthSelectorType?e=cu("span","cur-month"):(n.monthsDropdownContainer=cu("select","flatpickr-monthDropdown-months"),n.monthsDropdownContainer.setAttribute("aria-label",n.l10n.monthAriaLabel),d(n.monthsDropdownContainer,"change",function(e){var t=mu(e),i=parseInt(t.value,10);n.changeMonth(i-n.currentMonth),J("onMonthChange");}),k(),e=n.monthsDropdownContainer);var o=fu("cur-year",{tabindex:"-1"}),r=o.getElementsByTagName("input")[0];r.setAttribute("aria-label",n.l10n.yearAriaLabel),n.config.minDate&&r.setAttribute("min",n.config.minDate.getFullYear().toString()),n.config.maxDate&&(r.setAttribute("max",n.config.maxDate.getFullYear().toString()),r.disabled=!!n.config.minDate&&n.config.minDate.getFullYear()===n.config.maxDate.getFullYear());var a=cu("div","flatpickr-current-month");return a.appendChild(e),a.appendChild(o),i.appendChild(a),t.appendChild(i),{container:t,yearElement:r,monthElement:e}}function S(){uu(n.monthNav),n.monthNav.appendChild(n.prevMonthNav),n.config.showMonths&&(n.yearElements=[],n.monthElements=[]);for(var e=n.config.showMonths;e--;){var t=N();n.yearElements.push(t.yearElement),n.monthElements.push(t.monthElement),n.monthNav.appendChild(t.container);}n.monthNav.appendChild(n.nextMonthNav);}function D(){n.weekdayContainer?uu(n.weekdayContainer):n.weekdayContainer=cu("div","flatpickr-weekdays");for(var e=n.config.showMonths;e--;){var t=cu("div","flatpickr-weekdaycontainer");n.weekdayContainer.appendChild(t);}return x(),n.weekdayContainer}function x(){if(n.weekdayContainer){var e=n.l10n.firstDayOfWeek,t=xu(n.l10n.weekdays.shorthand);e>0&&e<t.length&&(t=xu(t.splice(e,t.length),t.splice(0,e)));for(var i=n.config.showMonths;i--;)n.weekdayContainer.children[i].innerHTML="\n      <span class='flatpickr-weekday'>\n        "+t.join("</span><span class='flatpickr-weekday'>")+"\n      </span>\n      ";}}function E(e,t){ void 0===t&&(t=true);var i=t?e:e-n.currentMonth;i<0&&true===n._hidePrevMonthArrow||i>0&&true===n._hideNextMonthArrow||(n.currentMonth+=i,(n.currentMonth<0||n.currentMonth>11)&&(n.currentYear+=n.currentMonth>11?1:-1,n.currentMonth=(n.currentMonth+12)%12,J("onYearChange"),k()),C(),J("onMonthChange"),Q());}function I(e){return n.calendarContainer.contains(e)}function M(e){if(n.isOpen&&!n.config.inline){var t=mu(e),i=I(t),o=!(t===n.input||t===n.altInput||n.element.contains(t)||e.path&&e.path.indexOf&&(~e.path.indexOf(n.input)||~e.path.indexOf(n.altInput)))&&!i&&!I(e.relatedTarget),r=!n.config.ignoredFocusElements.some(function(e){return e.contains(t)});o&&r&&(n.config.allowInput&&n.setDate(n._input.value,false,n.config.altInput?n.config.altFormat:n.config.dateFormat),void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement&&""!==n.input.value&&void 0!==n.input.value&&a(),n.close(),n.config&&"range"===n.config.mode&&1===n.selectedDates.length&&n.clear(false));}}function T(e){if(!(!e||n.config.minDate&&e<n.config.minDate.getFullYear()||n.config.maxDate&&e>n.config.maxDate.getFullYear())){var t=e,i=n.currentYear!==t;n.currentYear=t||n.currentYear,n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth=Math.min(n.config.maxDate.getMonth(),n.currentMonth):n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&(n.currentMonth=Math.max(n.config.minDate.getMonth(),n.currentMonth)),i&&(n.redraw(),J("onYearChange"),k());}}function A(e,t){var i;void 0===t&&(t=true);var o=n.parseDate(e,void 0,t);if(n.config.minDate&&o&&Cu(o,n.config.minDate,void 0!==t?t:!n.minDateHasTime)<0||n.config.maxDate&&o&&Cu(o,n.config.maxDate,void 0!==t?t:!n.maxDateHasTime)>0)return  false;if(!n.config.enable&&0===n.config.disable.length)return  true;if(void 0===o)return  false;for(var r=!!n.config.enable,a=null!==(i=n.config.enable)&&void 0!==i?i:n.config.disable,s=0,l=void 0;s<a.length;s++){if("function"==typeof(l=a[s])&&l(o))return r;if(l instanceof Date&&void 0!==o&&l.getTime()===o.getTime())return r;if("string"==typeof l){var c=n.parseDate(l,void 0,true);return c&&c.getTime()===o.getTime()?r:!r}if("object"==typeof l&&void 0!==o&&l.from&&l.to&&o.getTime()>=l.from.getTime()&&o.getTime()<=l.to.getTime())return r}return !r}function P(e){return void 0!==n.daysContainer&&(-1===e.className.indexOf("hidden")&&-1===e.className.indexOf("flatpickr-disabled")&&n.daysContainer.contains(e))}function O(e){var t=e.target===n._input,i=n._input.value.trimEnd()!==X();!t||!i||e.relatedTarget&&I(e.relatedTarget)||n.setDate(n._input.value,true,e.target===n.altInput?n.config.altFormat:n.config.dateFormat);}function L(t){var o=mu(t),r=n.config.wrap?e.contains(o):o===n._input,l=n.config.allowInput,c=n.isOpen&&(!l||!r),u=n.config.inline&&r&&!l;if(13===t.keyCode&&r){if(l)return n.setDate(n._input.value,true,o===n.altInput?n.config.altFormat:n.config.dateFormat),n.close(),o.blur();n.open();}else if(I(o)||c||u){var d=!!n.timeContainer&&n.timeContainer.contains(o);switch(t.keyCode){case 13:d?(t.preventDefault(),a(),$()):V(t);break;case 27:t.preventDefault(),$();break;case 8:case 46:r&&!n.config.allowInput&&(t.preventDefault(),n.clear());break;case 37:case 39:if(d||r)n.hourElement&&n.hourElement.focus();else {t.preventDefault();var f=i();if(void 0!==n.daysContainer&&(false===l||f&&P(f))){var m=39===t.keyCode?1:-1;t.ctrlKey?(t.stopPropagation(),E(m),w(y(1),0)):w(void 0,m);}}break;case 38:case 40:t.preventDefault();var h=40===t.keyCode?1:-1;n.daysContainer&&void 0!==o.$i||o===n.input||o===n.altInput?t.ctrlKey?(t.stopPropagation(),T(n.currentYear-h),w(y(1),0)):d||w(void 0,7*h):o===n.currentYearElement?T(n.currentYear-h):n.config.enableTime&&(!d&&n.hourElement&&n.hourElement.focus(),a(t),n._debouncedChange());break;case 9:if(d){var p=[n.hourElement,n.minuteElement,n.secondElement,n.amPM].concat(n.pluginElements).filter(function(e){return e}),g=p.indexOf(o);if(-1!==g){var v=p[g+(t.shiftKey?-1:1)];t.preventDefault(),(v||n._input).focus();}}else !n.config.noCalendar&&n.daysContainer&&n.daysContainer.contains(o)&&t.shiftKey&&(t.preventDefault(),n._input.focus());}}if(void 0!==n.amPM&&o===n.amPM)switch(t.key){case n.l10n.amPM[0].charAt(0):case n.l10n.amPM[0].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[0],s(),Z();break;case n.l10n.amPM[1].charAt(0):case n.l10n.amPM[1].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[1],s(),Z();}(r||I(o))&&J("onKeyDown",t);}function F(e,t){if(void 0===t&&(t="flatpickr-day"),1===n.selectedDates.length&&(!e||e.classList.contains(t)&&!e.classList.contains("flatpickr-disabled"))){for(var i=e?e.dateObj.getTime():n.days.firstElementChild.dateObj.getTime(),o=n.parseDate(n.selectedDates[0],void 0,true).getTime(),r=Math.min(i,n.selectedDates[0].getTime()),a=Math.max(i,n.selectedDates[0].getTime()),s=false,l=0,c=0,u=r;u<a;u+=Nu)A(new Date(u),true)||(s=s||u>r&&u<a,u<o&&(!l||u>l)?l=u:u>o&&(!c||u<c)&&(c=u));Array.from(n.rContainer.querySelectorAll("*:nth-child(-n+"+n.config.showMonths+") > ."+t)).forEach(function(t){var r,a,u,d=t.dateObj.getTime(),f=l>0&&d<l||c>0&&d>c;if(f)return t.classList.add("notAllowed"),void["inRange","startRange","endRange"].forEach(function(e){t.classList.remove(e);});s&&!f||(["startRange","inRange","endRange","notAllowed"].forEach(function(e){t.classList.remove(e);}),void 0!==e&&(e.classList.add(i<=n.selectedDates[0].getTime()?"startRange":"endRange"),o<i&&d===o?t.classList.add("startRange"):o>i&&d===o&&t.classList.add("endRange"),d>=l&&(0===c||d<=c)&&(a=o,u=i,(r=d)>Math.min(a,u)&&r<Math.max(a,u))&&t.classList.add("inRange")));});}}function B(){!n.isOpen||n.config.static||n.config.inline||j();}function R(e){return function(t){var i=n.config["_"+e+"Date"]=n.parseDate(t,n.config.dateFormat),o=n.config["_"+("min"===e?"max":"min")+"Date"];void 0!==i&&(n["min"===e?"minDateHasTime":"maxDateHasTime"]=i.getHours()>0||i.getMinutes()>0||i.getSeconds()>0),n.selectedDates&&(n.selectedDates=n.selectedDates.filter(function(e){return A(e)}),n.selectedDates.length||"min"!==e||l(i),Z()),n.daysContainer&&(z(),void 0!==i?n.currentYearElement[e]=i.getFullYear().toString():n.currentYearElement.removeAttribute(e),n.currentYearElement.disabled=!!o&&void 0!==i&&o.getFullYear()===i.getFullYear());}}function _(){return n.config.wrap?e.querySelector("[data-input]"):e}function H(){"object"!=typeof n.config.locale&&void 0===Mu.l10ns[n.config.locale]&&n.config.errorHandler(new Error("flatpickr: invalid locale "+n.config.locale)),n.l10n=Du(Du({},Mu.l10ns.default),"object"==typeof n.config.locale?n.config.locale:"default"!==n.config.locale?Mu.l10ns[n.config.locale]:void 0),vu.D="("+n.l10n.weekdays.shorthand.join("|")+")",vu.l="("+n.l10n.weekdays.longhand.join("|")+")",vu.M="("+n.l10n.months.shorthand.join("|")+")",vu.F="("+n.l10n.months.longhand.join("|")+")",vu.K="("+n.l10n.amPM[0]+"|"+n.l10n.amPM[1]+"|"+n.l10n.amPM[0].toLowerCase()+"|"+n.l10n.amPM[1].toLowerCase()+")",void 0===Du(Du({},t),JSON.parse(JSON.stringify(e.dataset||{}))).time_24hr&&void 0===Mu.defaultConfig.time_24hr&&(n.config.time_24hr=n.l10n.time_24hr),n.formatDate=wu(n),n.parseDate=bu({config:n.config,l10n:n.l10n});}function j(e){if("function"!=typeof n.config.position){if(void 0!==n.calendarContainer){J("onPreCalendarPosition");var t=e||n._positionElement,i=Array.prototype.reduce.call(n.calendarContainer.children,function(e,t){return e+t.offsetHeight},0),o=n.calendarContainer.offsetWidth,r=n.config.position.split(" "),a=r[0],s=r.length>1?r[1]:null,l=t.getBoundingClientRect(),c=window.innerHeight-l.bottom,u="above"===a||"below"!==a&&c<i&&l.top>i,d=window.pageYOffset+l.top+(u?-i-2:t.offsetHeight+2);if(lu(n.calendarContainer,"arrowTop",!u),lu(n.calendarContainer,"arrowBottom",u),!n.config.inline){var f=window.pageXOffset+l.left,m=false,h=false;"center"===s?(f-=(o-l.width)/2,m=true):"right"===s&&(f-=o-l.width,h=true),lu(n.calendarContainer,"arrowLeft",!m&&!h),lu(n.calendarContainer,"arrowCenter",m),lu(n.calendarContainer,"arrowRight",h);var p=window.document.body.offsetWidth-(window.pageXOffset+l.right),g=f+o>window.document.body.offsetWidth,v=p+o>window.document.body.offsetWidth;if(lu(n.calendarContainer,"rightMost",g),!n.config.static)if(n.calendarContainer.style.top=d+"px",g)if(v){var y=function(){for(var e=null,t=0;t<document.styleSheets.length;t++){var n=document.styleSheets[t];if(n.cssRules){try{n.cssRules;}catch(e){continue}e=n;break}}return null!=e?e:(i=document.createElement("style"),document.head.appendChild(i),i.sheet);var i;}();if(void 0===y)return;var w=window.document.body.offsetWidth,b=Math.max(0,w/2-o/2),C=y.cssRules.length,k="{left:"+l.left+"px;right:auto;}";lu(n.calendarContainer,"rightMost",false),lu(n.calendarContainer,"centerMost",true),y.insertRule(".flatpickr-calendar.centerMost:before,.flatpickr-calendar.centerMost:after"+k,C),n.calendarContainer.style.left=b+"px",n.calendarContainer.style.right="auto";}else n.calendarContainer.style.left="auto",n.calendarContainer.style.right=p+"px";else n.calendarContainer.style.left=f+"px",n.calendarContainer.style.right="auto";}}}else n.config.position(n,e);}function z(){n.config.noCalendar||n.isMobile||(k(),Q(),C());}function $(){n._input.focus(),-1!==window.navigator.userAgent.indexOf("MSIE")||void 0!==navigator.msMaxTouchPoints?setTimeout(n.close,0):n.close();}function V(e){e.preventDefault(),e.stopPropagation();var t=du(mu(e),function(e){return e.classList&&e.classList.contains("flatpickr-day")&&!e.classList.contains("flatpickr-disabled")&&!e.classList.contains("notAllowed")});if(void 0!==t){var i=t,o=n.latestSelectedDateObj=new Date(i.dateObj.getTime()),r=(o.getMonth()<n.currentMonth||o.getMonth()>n.currentMonth+n.config.showMonths-1)&&"range"!==n.config.mode;if(n.selectedDateElem=i,"single"===n.config.mode)n.selectedDates=[o];else if("multiple"===n.config.mode){var a=G(o);a?n.selectedDates.splice(parseInt(a),1):n.selectedDates.push(o);}else "range"===n.config.mode&&(2===n.selectedDates.length&&n.clear(false,false),n.latestSelectedDateObj=o,n.selectedDates.push(o),0!==Cu(o,n.selectedDates[0],true)&&n.selectedDates.sort(function(e,t){return e.getTime()-t.getTime()}));if(s(),r){var l=n.currentYear!==o.getFullYear();n.currentYear=o.getFullYear(),n.currentMonth=o.getMonth(),l&&(J("onYearChange"),k()),J("onMonthChange");}if(Q(),C(),Z(),r||"range"===n.config.mode||1!==n.config.showMonths?void 0!==n.selectedDateElem&&void 0===n.hourElement&&n.selectedDateElem&&n.selectedDateElem.focus():v(i),void 0!==n.hourElement&&void 0!==n.hourElement&&n.hourElement.focus(),n.config.closeOnSelect){var c="single"===n.config.mode&&!n.config.enableTime,u="range"===n.config.mode&&2===n.selectedDates.length&&!n.config.enableTime;(c||u)&&$();}f();}}n.parseDate=bu({config:n.config,l10n:n.l10n}),n._handlers=[],n.pluginElements=[],n.loadedPlugins=[],n._bind=d,n._setHoursFromDate=l,n._positionCalendar=j,n.changeMonth=E,n.changeYear=T,n.clear=function(e,t){ void 0===e&&(e=true);void 0===t&&(t=true);n.input.value="",void 0!==n.altInput&&(n.altInput.value="");void 0!==n.mobileInput&&(n.mobileInput.value="");n.selectedDates=[],n.latestSelectedDateObj=void 0,true===t&&(n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth());if(true===n.config.enableTime){var i=Su(n.config);c(i.hours,i.minutes,i.seconds);}n.redraw(),e&&J("onChange");},n.close=function(){n.isOpen=false,n.isMobile||(void 0!==n.calendarContainer&&n.calendarContainer.classList.remove("open"),void 0!==n._input&&n._input.classList.remove("active"));J("onClose");},n.onMouseOver=F,n._createElement=cu,n.createDay=g,n.destroy=function(){ void 0!==n.config&&J("onDestroy");for(var e=n._handlers.length;e--;)n._handlers[e].remove();if(n._handlers=[],n.mobileInput)n.mobileInput.parentNode&&n.mobileInput.parentNode.removeChild(n.mobileInput),n.mobileInput=void 0;else if(n.calendarContainer&&n.calendarContainer.parentNode)if(n.config.static&&n.calendarContainer.parentNode){var t=n.calendarContainer.parentNode;if(t.lastChild&&t.removeChild(t.lastChild),t.parentNode){for(;t.firstChild;)t.parentNode.insertBefore(t.firstChild,t);t.parentNode.removeChild(t);}}else n.calendarContainer.parentNode.removeChild(n.calendarContainer);n.altInput&&(n.input.type="text",n.altInput.parentNode&&n.altInput.parentNode.removeChild(n.altInput),delete n.altInput);n.input&&(n.input.type=n.input._type,n.input.classList.remove("flatpickr-input"),n.input.removeAttribute("readonly"));["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach(function(e){try{delete n[e];}catch(e){}});},n.isEnabled=A,n.jumpToDate=m,n.updateValue=Z,n.open=function(e,t){ void 0===t&&(t=n._positionElement);if(true===n.isMobile){if(e){e.preventDefault();var i=mu(e);i&&i.blur();}return void 0!==n.mobileInput&&(n.mobileInput.focus(),n.mobileInput.click()),void J("onOpen")}if(n._input.disabled||n.config.inline)return;var o=n.isOpen;n.isOpen=true,o||(n.calendarContainer.classList.add("open"),n._input.classList.add("active"),J("onOpen"),j(t));true===n.config.enableTime&&true===n.config.noCalendar&&(false!==n.config.allowInput||void 0!==e&&n.timeContainer.contains(e.relatedTarget)||setTimeout(function(){return n.hourElement.select()},50));},n.redraw=z,n.set=function(e,t){if(null!==e&&"object"==typeof e)for(var i in Object.assign(n.config,e),e) void 0!==Y[i]&&Y[i].forEach(function(e){return e()});else n.config[e]=t,void 0!==Y[e]?Y[e].forEach(function(e){return e()}):tu.indexOf(e)>-1&&(n.config[e]=su(t));n.redraw(),Z(true);},n.setDate=function(e,t,i){ void 0===t&&(t=false);void 0===i&&(i=n.config.dateFormat);if(0!==e&&!e||e instanceof Array&&0===e.length)return n.clear(t);U(e,i),n.latestSelectedDateObj=n.selectedDates[n.selectedDates.length-1],n.redraw(),m(void 0,t),l(),0===n.selectedDates.length&&n.clear(false);Z(t),t&&J("onChange");},n.toggle=function(e){if(true===n.isOpen)return n.close();n.open(e);};var Y={locale:[H,x],showMonths:[S,r,D],minDate:[m],maxDate:[m],positionElement:[K],clickOpens:[function(){ true===n.config.clickOpens?(d(n._input,"focus",n.open),d(n._input,"click",n.open)):(n._input.removeEventListener("focus",n.open),n._input.removeEventListener("click",n.open));}]};function U(e,t){var i=[];if(e instanceof Array)i=e.map(function(e){return n.parseDate(e,t)});else if(e instanceof Date||"number"==typeof e)i=[n.parseDate(e,t)];else if("string"==typeof e)switch(n.config.mode){case "single":case "time":i=[n.parseDate(e,t)];break;case "multiple":i=e.split(n.config.conjunction).map(function(e){return n.parseDate(e,t)});break;case "range":i=e.split(n.l10n.rangeSeparator).map(function(e){return n.parseDate(e,t)});}else n.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(e)));n.selectedDates=n.config.allowInvalidPreload?i:i.filter(function(e){return e instanceof Date&&A(e,false)}),"range"===n.config.mode&&n.selectedDates.sort(function(e,t){return e.getTime()-t.getTime()});}function W(e){return e.slice().map(function(e){return "string"==typeof e||"number"==typeof e||e instanceof Date?n.parseDate(e,void 0,true):e&&"object"==typeof e&&e.from&&e.to?{from:n.parseDate(e.from,void 0),to:n.parseDate(e.to,void 0)}:e}).filter(function(e){return e})}function K(){n._positionElement=n.config.positionElement||n._input;}function J(e,t){if(void 0!==n.config){var i=n.config[e];if(void 0!==i&&i.length>0)for(var o=0;i[o]&&o<i.length;o++)i[o](n.selectedDates,n.input.value,n,t);"onChange"===e&&(n.input.dispatchEvent(q("change")),n.input.dispatchEvent(q("input")));}}function q(e){var t=document.createEvent("Event");return t.initEvent(e,true,true),t}function G(e){for(var t=0;t<n.selectedDates.length;t++){var i=n.selectedDates[t];if(i instanceof Date&&0===Cu(i,e))return ""+t}return  false}function Q(){n.config.noCalendar||n.isMobile||!n.monthNav||(n.yearElements.forEach(function(e,t){var i=new Date(n.currentYear,n.currentMonth,1);i.setMonth(n.currentMonth+t),n.config.showMonths>1||"static"===n.config.monthSelectorType?n.monthElements[t].textContent=pu(i.getMonth(),n.config.shorthandCurrentMonth,n.l10n)+" ":n.monthsDropdownContainer.value=i.getMonth().toString(),e.value=i.getFullYear().toString();}),n._hidePrevMonthArrow=void 0!==n.config.minDate&&(n.currentYear===n.config.minDate.getFullYear()?n.currentMonth<=n.config.minDate.getMonth():n.currentYear<n.config.minDate.getFullYear()),n._hideNextMonthArrow=void 0!==n.config.maxDate&&(n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth+1>n.config.maxDate.getMonth():n.currentYear>n.config.maxDate.getFullYear()));}function X(e){var t=e||(n.config.altInput?n.config.altFormat:n.config.dateFormat);return n.selectedDates.map(function(e){return n.formatDate(e,t)}).filter(function(e,t,i){return "range"!==n.config.mode||n.config.enableTime||i.indexOf(e)===t}).join("range"!==n.config.mode?n.config.conjunction:n.l10n.rangeSeparator)}function Z(e){ void 0===e&&(e=true),void 0!==n.mobileInput&&n.mobileFormatStr&&(n.mobileInput.value=void 0!==n.latestSelectedDateObj?n.formatDate(n.latestSelectedDateObj,n.mobileFormatStr):""),n.input.value=X(n.config.dateFormat),void 0!==n.altInput&&(n.altInput.value=X(n.config.altFormat)),false!==e&&J("onValueUpdate");}function ee(e){var t=mu(e),i=n.prevMonthNav.contains(t),o=n.nextMonthNav.contains(t);i||o?E(i?-1:1):n.yearElements.indexOf(t)>=0?t.select():t.classList.contains("arrowUp")?n.changeYear(n.currentYear+1):t.classList.contains("arrowDown")&&n.changeYear(n.currentYear-1);}return function(){n.element=n.input=e,n.isOpen=false,function(){var i=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],r=Du(Du({},JSON.parse(JSON.stringify(e.dataset||{}))),t),a={};n.config.parseDate=r.parseDate,n.config.formatDate=r.formatDate,Object.defineProperty(n.config,"enable",{get:function(){return n.config._enable},set:function(e){n.config._enable=W(e);}}),Object.defineProperty(n.config,"disable",{get:function(){return n.config._disable},set:function(e){n.config._disable=W(e);}});var s="time"===r.mode;if(!r.dateFormat&&(r.enableTime||s)){var l=Mu.defaultConfig.dateFormat||nu.dateFormat;a.dateFormat=r.noCalendar||s?"H:i"+(r.enableSeconds?":S":""):l+" H:i"+(r.enableSeconds?":S":"");}if(r.altInput&&(r.enableTime||s)&&!r.altFormat){var c=Mu.defaultConfig.altFormat||nu.altFormat;a.altFormat=r.noCalendar||s?"h:i"+(r.enableSeconds?":S K":" K"):c+" h:i"+(r.enableSeconds?":S":"")+" K";}Object.defineProperty(n.config,"minDate",{get:function(){return n.config._minDate},set:R("min")}),Object.defineProperty(n.config,"maxDate",{get:function(){return n.config._maxDate},set:R("max")});var u=function(e){return function(t){n.config["min"===e?"_minTime":"_maxTime"]=n.parseDate(t,"H:i:S");}};Object.defineProperty(n.config,"minTime",{get:function(){return n.config._minTime},set:u("min")}),Object.defineProperty(n.config,"maxTime",{get:function(){return n.config._maxTime},set:u("max")}),"time"===r.mode&&(n.config.noCalendar=true,n.config.enableTime=true);Object.assign(n.config,a,r);for(var d=0;d<i.length;d++)n.config[i[d]]=true===n.config[i[d]]||"true"===n.config[i[d]];tu.filter(function(e){return void 0!==n.config[e]}).forEach(function(e){n.config[e]=su(n.config[e]||[]).map(o);}),n.isMobile=!n.config.disableMobile&&!n.config.inline&&"single"===n.config.mode&&!n.config.disable.length&&!n.config.enable&&!n.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(d=0;d<n.config.plugins.length;d++){var f=n.config.plugins[d](n)||{};for(var m in f)tu.indexOf(m)>-1?n.config[m]=su(f[m]).map(o).concat(n.config[m]):void 0===r[m]&&(n.config[m]=f[m]);}r.altInputClass||(n.config.altInputClass=_().className+" "+n.config.altInputClass);J("onParseConfig");}(),H(),function(){if(n.input=_(),!n.input)return void n.config.errorHandler(new Error("Invalid input element specified"));n.input._type=n.input.type,n.input.type="text",n.input.classList.add("flatpickr-input"),n._input=n.input,n.config.altInput&&(n.altInput=cu(n.input.nodeName,n.config.altInputClass),n._input=n.altInput,n.altInput.placeholder=n.input.placeholder,n.altInput.disabled=n.input.disabled,n.altInput.required=n.input.required,n.altInput.tabIndex=n.input.tabIndex,n.altInput.type="text",n.input.setAttribute("type","hidden"),!n.config.static&&n.input.parentNode&&n.input.parentNode.insertBefore(n.altInput,n.input.nextSibling));n.config.allowInput||n._input.setAttribute("readonly","readonly");K();}(),function(){n.selectedDates=[],n.now=n.parseDate(n.config.now)||new Date;var e=n.config.defaultDate||("INPUT"!==n.input.nodeName&&"TEXTAREA"!==n.input.nodeName||!n.input.placeholder||n.input.value!==n.input.placeholder?n.input.value:null);e&&U(e,n.config.dateFormat);n._initialDate=n.selectedDates.length>0?n.selectedDates[0]:n.config.minDate&&n.config.minDate.getTime()>n.now.getTime()?n.config.minDate:n.config.maxDate&&n.config.maxDate.getTime()<n.now.getTime()?n.config.maxDate:n.now,n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth(),n.selectedDates.length>0&&(n.latestSelectedDateObj=n.selectedDates[0]);void 0!==n.config.minTime&&(n.config.minTime=n.parseDate(n.config.minTime,"H:i"));void 0!==n.config.maxTime&&(n.config.maxTime=n.parseDate(n.config.maxTime,"H:i"));n.minDateHasTime=!!n.config.minDate&&(n.config.minDate.getHours()>0||n.config.minDate.getMinutes()>0||n.config.minDate.getSeconds()>0),n.maxDateHasTime=!!n.config.maxDate&&(n.config.maxDate.getHours()>0||n.config.maxDate.getMinutes()>0||n.config.maxDate.getSeconds()>0);}(),n.utils={getDaysInMonth:function(e,t){return void 0===e&&(e=n.currentMonth),void 0===t&&(t=n.currentYear),1===e&&(t%4==0&&t%100!=0||t%400==0)?29:n.l10n.daysInMonth[e]}},n.isMobile||function(){var e=window.document.createDocumentFragment();if(n.calendarContainer=cu("div","flatpickr-calendar"),n.calendarContainer.tabIndex=-1,!n.config.noCalendar){if(e.appendChild((n.monthNav=cu("div","flatpickr-months"),n.yearElements=[],n.monthElements=[],n.prevMonthNav=cu("span","flatpickr-prev-month"),n.prevMonthNav.innerHTML=n.config.prevArrow,n.nextMonthNav=cu("span","flatpickr-next-month"),n.nextMonthNav.innerHTML=n.config.nextArrow,S(),Object.defineProperty(n,"_hidePrevMonthArrow",{get:function(){return n.__hidePrevMonthArrow},set:function(e){n.__hidePrevMonthArrow!==e&&(lu(n.prevMonthNav,"flatpickr-disabled",e),n.__hidePrevMonthArrow=e);}}),Object.defineProperty(n,"_hideNextMonthArrow",{get:function(){return n.__hideNextMonthArrow},set:function(e){n.__hideNextMonthArrow!==e&&(lu(n.nextMonthNav,"flatpickr-disabled",e),n.__hideNextMonthArrow=e);}}),n.currentYearElement=n.yearElements[0],Q(),n.monthNav)),n.innerContainer=cu("div","flatpickr-innerContainer"),n.config.weekNumbers){var t=function(){n.calendarContainer.classList.add("hasWeeks");var e=cu("div","flatpickr-weekwrapper");e.appendChild(cu("span","flatpickr-weekday",n.l10n.weekAbbreviation));var t=cu("div","flatpickr-weeks");return e.appendChild(t),{weekWrapper:e,weekNumbers:t}}(),i=t.weekWrapper,o=t.weekNumbers;n.innerContainer.appendChild(i),n.weekNumbers=o,n.weekWrapper=i;}n.rContainer=cu("div","flatpickr-rContainer"),n.rContainer.appendChild(D()),n.daysContainer||(n.daysContainer=cu("div","flatpickr-days"),n.daysContainer.tabIndex=-1),C(),n.rContainer.appendChild(n.daysContainer),n.innerContainer.appendChild(n.rContainer),e.appendChild(n.innerContainer);}n.config.enableTime&&e.appendChild(function(){n.calendarContainer.classList.add("hasTime"),n.config.noCalendar&&n.calendarContainer.classList.add("noCalendar");var e=Su(n.config);n.timeContainer=cu("div","flatpickr-time"),n.timeContainer.tabIndex=-1;var t=cu("span","flatpickr-time-separator",":"),i=fu("flatpickr-hour",{"aria-label":n.l10n.hourAriaLabel});n.hourElement=i.getElementsByTagName("input")[0];var o=fu("flatpickr-minute",{"aria-label":n.l10n.minuteAriaLabel});n.minuteElement=o.getElementsByTagName("input")[0],n.hourElement.tabIndex=n.minuteElement.tabIndex=-1,n.hourElement.value=ou(n.latestSelectedDateObj?n.latestSelectedDateObj.getHours():n.config.time_24hr?e.hours:function(e){switch(e%24){case 0:case 12:return 12;default:return e%12}}(e.hours)),n.minuteElement.value=ou(n.latestSelectedDateObj?n.latestSelectedDateObj.getMinutes():e.minutes),n.hourElement.setAttribute("step",n.config.hourIncrement.toString()),n.minuteElement.setAttribute("step",n.config.minuteIncrement.toString()),n.hourElement.setAttribute("min",n.config.time_24hr?"0":"1"),n.hourElement.setAttribute("max",n.config.time_24hr?"23":"12"),n.hourElement.setAttribute("maxlength","2"),n.minuteElement.setAttribute("min","0"),n.minuteElement.setAttribute("max","59"),n.minuteElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(i),n.timeContainer.appendChild(t),n.timeContainer.appendChild(o),n.config.time_24hr&&n.timeContainer.classList.add("time24hr");if(n.config.enableSeconds){n.timeContainer.classList.add("hasSeconds");var r=fu("flatpickr-second");n.secondElement=r.getElementsByTagName("input")[0],n.secondElement.value=ou(n.latestSelectedDateObj?n.latestSelectedDateObj.getSeconds():e.seconds),n.secondElement.setAttribute("step",n.minuteElement.getAttribute("step")),n.secondElement.setAttribute("min","0"),n.secondElement.setAttribute("max","59"),n.secondElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(cu("span","flatpickr-time-separator",":")),n.timeContainer.appendChild(r);}n.config.time_24hr||(n.amPM=cu("span","flatpickr-am-pm",n.l10n.amPM[ru((n.latestSelectedDateObj?n.hourElement.value:n.config.defaultHour)>11)]),n.amPM.title=n.l10n.toggleTitle,n.amPM.tabIndex=-1,n.timeContainer.appendChild(n.amPM));return n.timeContainer}());lu(n.calendarContainer,"rangeMode","range"===n.config.mode),lu(n.calendarContainer,"animate",true===n.config.animate),lu(n.calendarContainer,"multiMonth",n.config.showMonths>1),n.calendarContainer.appendChild(e);var r=void 0!==n.config.appendTo&&void 0!==n.config.appendTo.nodeType;if((n.config.inline||n.config.static)&&(n.calendarContainer.classList.add(n.config.inline?"inline":"static"),n.config.inline&&(!r&&n.element.parentNode?n.element.parentNode.insertBefore(n.calendarContainer,n._input.nextSibling):void 0!==n.config.appendTo&&n.config.appendTo.appendChild(n.calendarContainer)),n.config.static)){var a=cu("div","flatpickr-wrapper");n.element.parentNode&&n.element.parentNode.insertBefore(a,n.element),a.appendChild(n.element),n.altInput&&a.appendChild(n.altInput),a.appendChild(n.calendarContainer);}n.config.static||n.config.inline||(void 0!==n.config.appendTo?n.config.appendTo:window.document.body).appendChild(n.calendarContainer);}(),function(){n.config.wrap&&["open","close","toggle","clear"].forEach(function(e){Array.prototype.forEach.call(n.element.querySelectorAll("[data-"+e+"]"),function(t){return d(t,"click",n[e])});});if(n.isMobile)return void function(){var e=n.config.enableTime?n.config.noCalendar?"time":"datetime-local":"date";n.mobileInput=cu("input",n.input.className+" flatpickr-mobile"),n.mobileInput.tabIndex=1,n.mobileInput.type=e,n.mobileInput.disabled=n.input.disabled,n.mobileInput.required=n.input.required,n.mobileInput.placeholder=n.input.placeholder,n.mobileFormatStr="datetime-local"===e?"Y-m-d\\TH:i:S":"date"===e?"Y-m-d":"H:i:S",n.selectedDates.length>0&&(n.mobileInput.defaultValue=n.mobileInput.value=n.formatDate(n.selectedDates[0],n.mobileFormatStr));n.config.minDate&&(n.mobileInput.min=n.formatDate(n.config.minDate,"Y-m-d"));n.config.maxDate&&(n.mobileInput.max=n.formatDate(n.config.maxDate,"Y-m-d"));n.input.getAttribute("step")&&(n.mobileInput.step=String(n.input.getAttribute("step")));n.input.type="hidden",void 0!==n.altInput&&(n.altInput.type="hidden");try{n.input.parentNode&&n.input.parentNode.insertBefore(n.mobileInput,n.input.nextSibling);}catch(e){}d(n.mobileInput,"change",function(e){n.setDate(mu(e).value,false,n.mobileFormatStr),J("onChange"),J("onClose");});}();var e=au(B,50);n._debouncedChange=au(f,300),n.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&d(n.daysContainer,"mouseover",function(e){"range"===n.config.mode&&F(mu(e));});d(n._input,"keydown",L),void 0!==n.calendarContainer&&d(n.calendarContainer,"keydown",L);n.config.inline||n.config.static||d(window,"resize",e);void 0!==window.ontouchstart?d(window.document,"touchstart",M):d(window.document,"mousedown",M);d(window.document,"focus",M,{capture:true}),true===n.config.clickOpens&&(d(n._input,"focus",n.open),d(n._input,"click",n.open));void 0!==n.daysContainer&&(d(n.monthNav,"click",ee),d(n.monthNav,["keyup","increment"],u),d(n.daysContainer,"click",V));if(void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement){var t=function(e){return mu(e).select()};d(n.timeContainer,["increment"],a),d(n.timeContainer,"blur",a,{capture:true}),d(n.timeContainer,"click",h),d([n.hourElement,n.minuteElement],["focus","click"],t),void 0!==n.secondElement&&d(n.secondElement,"focus",function(){return n.secondElement&&n.secondElement.select()}),void 0!==n.amPM&&d(n.amPM,"click",function(e){a(e);});}n.config.allowInput&&d(n._input,"blur",O);}(),(n.selectedDates.length||n.config.noCalendar)&&(n.config.enableTime&&l(n.config.noCalendar?n.latestSelectedDateObj:void 0),Z(false)),r();var i=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!n.isMobile&&i&&j(),J("onReady");}(),n}function Iu(e,t){for(var n=Array.prototype.slice.call(e).filter(function(e){return e instanceof HTMLElement}),i=[],o=0;o<n.length;o++){var r=n[o];try{if(null!==r.getAttribute("data-fp-omit"))continue;void 0!==r._flatpickr&&(r._flatpickr.destroy(),r._flatpickr=void 0),r._flatpickr=Eu(r,t||{}),i.push(r._flatpickr);}catch(e){console.error(e);}}return 1===i.length?i[0]:i}"undefined"!=typeof HTMLElement&&"undefined"!=typeof HTMLCollection&&"undefined"!=typeof NodeList&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(e){return Iu(this,e)},HTMLElement.prototype.flatpickr=function(e){return Iu([this],e)});var Mu=function(e,t){return "string"==typeof e?Iu(window.document.querySelectorAll(e),t):e instanceof Node?Iu([e],t):Iu(e,t)};Mu.defaultConfig={},Mu.l10ns={en:Du({},iu),default:Du({},iu)},Mu.localize=function(e){Mu.l10ns.default=Du(Du({},Mu.l10ns.default),e);},Mu.setDefaults=function(e){Mu.defaultConfig=Du(Du({},Mu.defaultConfig),e);},Mu.parseDate=bu({}),Mu.formatDate=wu({}),Mu.compareDates=Cu,"undefined"!=typeof jQuery&&void 0!==jQuery.fn&&(jQuery.fn.flatpickr=function(e){return Iu(this,e)}),Date.prototype.fp_incr=function(e){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+("string"==typeof e?parseInt(e,10):e))},"undefined"!=typeof window&&(window.flatpickr=Mu);const Tu=["onCreate","onDestroy"],Au=["onChange","onOpen","onClose","onMonthChange","onYearChange","onReady","onValueUpdate","onDayCreate"],Pu=t=>{const n=useMemo(()=>({...t}),[t]),{defaultValue:i,options:o={},value:a,children:s,render:l,onCreate:f,onDestroy:m}=n,h=useMemo(()=>((e,t)=>(Au.forEach(n=>{const i=t[n],o=e[n];if(i){o&&!Array.isArray(o)?e[n]=[e[n]]:e[n]||(e[n]=[]);const t=Array.isArray(i)?i:[i];0===e[n].length?e[n]=t:e[n].push(...t);}}),Au.forEach(e=>{delete t[e];}),Tu.forEach(e=>{delete t[e];}),e))(o,n),[o,n]),g=useRef(null),v=useRef(void 0);useImperativeHandle(t.ref,()=>({get flatpickr(){return v.current}}),[]),useEffect(()=>{return h.onClose=h.onClose||(()=>{var e;null!=(e=g.current)&&e.blur&&g.current.blur();}),v.current=((null==(e=Mu)?void 0:e.default)||Mu)(g.current,h),null==f||f(v.current),()=>{null==m||m(v.current),v.current&&v.current.destroy(),v.current=void 0;};var e;},[h,f,m]),useEffect(()=>{var e;if(v.current){const t=Object.getOwnPropertyNames(h);for(let n=t.length-1;n>=0;n--){const i=t[n];let o=h[i];(null==o?void 0:o.toString())!==(null==(e=v.current.config[i])?void 0:e.toString())&&(Au.includes(i)&&!Array.isArray(o)&&(o=[o]),v.current.set(i,o));} void 0!==a&&a!==v.current.input.value&&v.current.setDate(a,false);}},[h,a]);const y=useCallback(e=>{g.current=e;},[]);if(l)return l({...n,defaultValue:i,value:a},y);const w=useCallback(e=>{var n,i;t&&t.onChange&&(Array.isArray(null==t?void 0:t.onChange)?null==(n=null==t?void 0:t.onChange)||n.forEach(()=>[new Date(e.target.value)],(null==a?void 0:a.toString())||""):"function"==typeof t.onChange&&(null==(i=null==t?void 0:t.onChange)||i.call(t,[new Date(e.target.value)],(null==a?void 0:a.toString())||"",v.current)));},[t,a]);return o.wrap?jsxRuntimeExports.jsx("div",{className:"flatpickr",ref:y,children:s}):jsxRuntimeExports.jsx("input",{onChange:w,...n,value:null==a?void 0:a.toString(),defaultValue:i,ref:y})},Ou="T42.GD.Execute",Lu=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Fu=(e,t)=>e in t;function Bu({time:e,frequency:t,day:n}){const i=new Date(`01/01/2000 ${e}`),o=i.getMinutes(),r=i.getHours();let a="*";return "weekly"===t&&n&&(a=function(e){const t={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};if(!Fu(e,t))throw new Error(`Invalid day: ${e}`);return t[e]}(n).toString()),`${o} ${r} * * ${a}`}function Ru(e){const t=useContext(IOConnectContext),{value:n,update:i}=ya({prefKey:_u(e)}),{value:o,update:a}=ya({prefKey:_u(e,"Time")}),{value:l,update:c}=ya({prefKey:_u(e,"Frequency")}),{value:u,update:f}=ya({prefKey:_u(e,"Day")}),m=useCallback(async()=>{try{await t.interop.invoke(Ou,{command:`cancel-${e}`});}catch(e){console.error(e);}},[t,e]),h=useCallback(async()=>{try{const n=Bu({time:o??"12:00 AM",frequency:l??"daily",day:"weekly"===l?u:"*"});await t.interop.invoke(Ou,{command:`schedule-${e}`,args:{cronTime:n,discardUnsavedLayoutChanges:!1}});}catch(t){console.error(`Failed to update cron job for ${e}:`,t);}},[t,e,o,l,u]);useEffect(()=>{t&&n&&h();},[t,n,h]);return {enabled:n??false,time:o??"12:00 AM",frequency:l??"daily",day:u??"Monday",setEnabled:async e=>{e||await m();try{await i(e);}catch(e){console.error("Failed to update enabled state:",e);}},setTime:async e=>{try{await a(e);}catch(e){console.error("Failed to update time:",e);}},setFrequency:async e=>{try{await c(e),"daily"===e&&await f(void 0);}catch(e){console.error("Failed to update frequency:",e);}},setDay:async e=>{var t;if(t=e,Lu.includes(t))try{await f(e);}catch(e){console.error("Failed to update day:",e);}else console.error("Invalid day provided");}}}function _u(e,t){const n="restart"===e?"_system_scheduleRestart":"_system_scheduleShutdown";return t?`${n}${t}`:n}function Hu({className:n,variant:i,...o}){const r=k("io-block-list-gap",i,n),{enabled:a,time:s,frequency:l,day:c,setEnabled:u,setTime:d,setFrequency:f,setDay:m}=Ru(i);return jsxRuntimeExports.jsxs(M,{className:r,...o,children:[jsxRuntimeExports.jsx(ro,{label:`Schedule ${i}`,align:"right",onChange:e=>u(e.target.checked),checked:a}),jsxRuntimeExports.jsxs("div",{className:"scheduler-controls",children:[jsxRuntimeExports.jsxs("div",{className:"io-control-input io-control-leading-icon direction-up",children:[jsxRuntimeExports.jsx(N,{variant:"clock"}),jsxRuntimeExports.jsx(Pu,{className:"io-input",options:{enableTime:true,noCalendar:true,dateFormat:"h:i K",defaultDate:s,clickOpens:true},value:s,onClose:async([e])=>{const t=e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:true});await d(t);}})]}),jsxRuntimeExports.jsxs(Ui,{text:l.charAt(0).toUpperCase()+l.slice(1),icon:"chevron-down",iconRight:true,children:[jsxRuntimeExports.jsx(Ui.Item,{onClick:()=>f("daily"),children:"Daily"}),jsxRuntimeExports.jsx(Ui.Item,{onClick:()=>f("weekly"),children:"Weekly"})]}),"weekly"===l&&jsxRuntimeExports.jsx(Ui,{text:c,icon:"chevron-down",iconRight:true,children:Lu.map(t=>jsxRuntimeExports.jsx(Ui.Item,{onClick:()=>m(t),children:t},t))})]})]})}function ju({className:t,...n}){return jsxRuntimeExports.jsx(Hu,{...n,className:t,variant:"restart"})}function zu({className:t,...n}){return jsxRuntimeExports.jsx(Hu,{...n,className:t,variant:"shutdown"})}const $u={Body:Fc,General:Bc,Theme:_c,PinnedPosition:jc,AllowDocking:$c,MinimizeToTray:Vc,AutoClose:Yc,ShowTutorialOnStartup:Uc,Layouts:Wc,LayoutsRestoreLastSaved:Kc,LayoutsSaveCurrentOnExit:Jc,LayoutsShowUnsavedChangesPrompt:qc,LayoutsShowDeletePrompt:Gc,Downloads:Qc,DownloadsAskForEachDownload:Xc,DownloadsLocation:Zc,System:eu,SystemRestartSection:ju,SystemShutdownSection:zu},Vu=createContext($u),Yu=memo(({children:t,components:n})=>{const i=useMemo(()=>({...$u,...n}),[n]);return jsxRuntimeExports.jsx(Vu.Provider,{value:i,children:t})});Yu.displayName="PreferencesPanelComponentsStoreProvider";const Uu=()=>useContext(Vu);const Gu=n=>{const{General:i,Layouts:o}=nd();return jsxRuntimeExports.jsxs(qi,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{})]})},Qu=({title:t="General",...n})=>{const{Theme:i}=nd();return jsxRuntimeExports.jsx(M,{title:t,...n,children:jsxRuntimeExports.jsx(i,{})})},Xu=({title:t="Layouts",...n})=>{const{LayoutsShowDeletePrompt:i}=nd();return jsxRuntimeExports.jsx(M,{title:t,...n,children:jsxRuntimeExports.jsx(i,{})})},Zu={Body:Gu,General:Qu,Theme:_c,Layouts:Xu,LayoutsShowUnsavedChangesPrompt:qc,LayoutsShowDeletePrompt:Gc},ed=createContext(Zu),td=memo(({children:t,components:n})=>{const i=useMemo(()=>({...Zu,...n}),[n]);return jsxRuntimeExports.jsx(ed.Provider,{value:i,children:t})});td.displayName="PreferencesPanelComponentsStoreProvider";const nd=()=>useContext(ed);const rd=({actionButtons:t,actionButtonElementsRefs:n,isAutofocusButton:i,isButtonDisabled:o,onButtonClick:r})=>jsxRuntimeExports.jsx(X,{"data-testid":"io-dialog-action-buttons-group",align:"right",children:t.map((t,a)=>{const{id:s,text:l,variant:c}=t,u=i(s);return jsxRuntimeExports.jsx(A,{"data-testid":`io-dialog-action-button-${s}`,id:s,ref:e=>{0===a&&(n.current=[]),n.current[a]=e;},className:u?"io-focus-button":void 0,disabled:o(s),onClick:()=>r(t),variant:c,children:l},s)})}),ad=({actionButtons:n,children:i,onCompletion:o,size:r,title:a=(mo()?"io.Connect Desktop":"io.Connect Browser"),validationErrors:s=[]})=>{const{actionButtonElementsRefs:d,autofocusButtonId:m,hasAutofocusButtonLostInitialFocus:h}=(e=>{const t=useRef([]),n=useMemo(()=>e.find(e=>e.autofocus)?.id??null,[e]),i=useRef(n),[o,r]=useState(!i.current);return useLayoutEffect(()=>{if(o)return;if(n!==i.current)return void r(true);const e=t.current.find(e=>e?.id===n);if(!e)return;e.focus();const a=()=>{r(true);};return e.addEventListener("blur",a),()=>{e.removeEventListener("blur",a);}},[n,o]),{actionButtonElementsRefs:t,autofocusButtonId:n,hasAutofocusButtonLostInitialFocus:o}})(n),p=()=>{o({isClosed:true});},g={...r};return jsxRuntimeExports.jsxs(oe,{className:"io-dialog-template",closeFn:p,isOpen:true,onCancel:e=>{e.preventDefault(),p();},onKeyDown:e=>{!T(e)||s.length||e.target instanceof HTMLButtonElement||" "===e.key&&e.target instanceof HTMLInputElement||o({isEnterPressed:true});},style:g,title:a,children:[jsxRuntimeExports.jsx(oe.Body,{children:i}),jsxRuntimeExports.jsx(oe.Footer,{children:jsxRuntimeExports.jsx(rd,{actionButtonElementsRefs:d,actionButtons:n,isAutofocusButton:e=>m===e&&!h,isButtonDisabled:e=>s.some(t=>t.disabledButtonIds.some(t=>t===e)),onButtonClick:({id:e,text:t})=>{o({responseButtonClicked:{id:e,text:t}});}})})]})},sd=({children:t})=>jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-heading",className:"io-dialog-template-heading",children:t});var ld=Object.freeze({__proto__:null,NoInputsConfirmationDialog:({onCompletion:n,size:i,variables:o})=>{const{actionButtons:r,heading:a,text:s,title:l}=o;return jsxRuntimeExports.jsx(ad,{actionButtons:r,onCompletion:n,size:i,title:l,children:jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(sd,{children:a}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:s})]})})},SingleCheckboxDialog:({onCompletion:n,size:i,variables:o})=>{const{actionButtons:a,checkbox:s,heading:c,text:u,title:d}=o,[f,m]=useState(s.initialValue),h=useCallback(()=>m(e=>!e),[]),p=[{id:s.id,type:"checkbox",checked:f}];return jsxRuntimeExports.jsxs(ad,{actionButtons:a,onCompletion:e=>n({...e,inputs:p}),size:i,title:d,children:[jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(sd,{children:c}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:u})]}),jsxRuntimeExports.jsx(io,{"data-testid":`io-dialog-checkbox-${s.id}`,checked:f,id:s.id,label:s.label,name:s.id,onChange:h})]})},SingleTextInputDialog:({onCompletion:n,size:i,variables:o})=>{const{actionButtons:r,heading:a,input:s,title:c}=o,[d,m]=useState(s.initialValue??""),h=useRef(null),p=(g=d,!(v=s.validation)||new RegExp(v.regexPattern).test(g)?null:{disabledButtonIds:v.disabledButtonIds,message:v.errorMessage});var g,v;const y=[{id:s.id,type:"text",value:d}];return useLayoutEffect(()=>{h.current?.select();},[]),jsxRuntimeExports.jsxs(ad,{actionButtons:r,onCompletion:e=>n({...e,inputs:y}),size:i,title:c,validationErrors:p?[p]:[],children:[jsxRuntimeExports.jsx(sd,{children:a}),jsxRuntimeExports.jsx(to,{"data-testid":`io-dialog-input-${s.id}`,ref:h,errorDataTestId:`io-dialog-input-${s.id}-error-message`,errorMessage:p?.message,id:s.id,label:s.label,name:s.id,onChange:e=>m(e.target.value),placeholder:s.placeholder,type:"text",value:d})]})}});const cd=({name:n,value:i})=>jsxRuntimeExports.jsxs("div",{className:"io-profile-section-item",children:[jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-name",children:n}),jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-value",children:i})]}),ud=({className:n,items:i,title:o})=>jsxRuntimeExports.jsxs("div",{className:k("io-profile-section-body",n),children:[o&&jsxRuntimeExports.jsx(I,{className:"io-profile-section-title",text:o}),i.map(({name:t,value:n})=>jsxRuntimeExports.jsx(cd,{name:t,value:n},t))]}),dd=({className:n,items:i,title:o})=>jsxRuntimeExports.jsxs("section",{className:k("io-profile-section",n),children:[jsxRuntimeExports.jsx(ud,{items:i,title:o}),jsxRuntimeExports.jsx(J,{className:"mt-8"})]}),fd=({title:t="License",...n})=>jsxRuntimeExports.jsx(dd,{title:t,...n}),md=({title:t="Version",...n})=>jsxRuntimeExports.jsx(dd,{title:t,...n}),hd=({title:t="Plugins",...n})=>jsxRuntimeExports.jsx(dd,{title:t,...n}),pd=({className:n})=>{const i=mo()?"io.Connect Desktop":"io.Connect Browser";return jsxRuntimeExports.jsxs("div",{className:k("io-trademark-container",n),children:[jsxRuntimeExports.jsx("h4",{className:"io-trademark-title",children:i}),jsxRuntimeExports.jsxs("p",{className:"io-trademark-text",children:[i,"® is a registered trademark of"," ",jsxRuntimeExports.jsx("a",{href:"https://www.interop.io",rel:"noreferrer",target:"_blank",children:"Interop Inc©"})," ",(new Date).getFullYear(),". All rights reserved."]})]})},gd=({avatarInitials:n=(mo()?"CD":"CB"),className:i,items:o,onLogout:r,title:a})=>jsxRuntimeExports.jsxs("section",{className:k("io-profile-section",i),children:[jsxRuntimeExports.jsxs("div",{className:"io-user-details-container",children:[jsxRuntimeExports.jsx("div",{className:"io-user-avatar",children:n}),jsxRuntimeExports.jsx(ud,{className:"mt-12",items:o,title:a})]}),r&&jsxRuntimeExports.jsx(A,{className:"io-log-out-button",onClick:r,variant:"primary",icon:"arrow-right-from-bracket",children:"Log out"}),jsxRuntimeExports.jsx(J,{className:"mt-8"})]}),vd={LicenseSection:fd,ProductsInfoSection:md,PluginsSection:hd,Trademark:pd,UserSection:gd},yd=createContext(vd),wd=memo(({children:t,components:n})=>{const i=useMemo(()=>({...vd,...n}),[n]);return jsxRuntimeExports.jsx(yd.Provider,{value:i,children:t})});wd.displayName="ProfilePanelComponentsStoreProvider";createContext(void 0);document.querySelector("#root")??document.body;

const DEFAULT_DIALOG_TEMPLATES = [
    {
        name: "noInputsConfirmationDialog",
        Dialog: ld.NoInputsConfirmationDialog,
        validate: noInputsConfirmationDialogDecoder.runWithException
    },
    {
        name: "singleCheckboxDialog",
        Dialog: ld.SingleCheckboxDialog,
        validate: singleCheckboxDialogDecoder.runWithException
    },
    {
        name: "singleTextInputDialog",
        Dialog: ld.SingleTextInputDialog,
        validate: singleTextInputDialogDecoder.runWithException
    }
];

class DialogsController {
    config;
    glueController;
    messagePort;
    templates;
    logger;
    openedDialog = null;
    constructor(config, glueController, messagePort, templates) {
        this.config = config;
        this.glueController = glueController;
        this.messagePort = messagePort;
        this.templates = templates;
        this.logger = glueController.getLogger(`modals-ui.dialogs.controller-${glueController.clientId}`);
        messagePort.subscribe((event) => {
            if (this.openedDialog?.id !== event.data.id) {
                this.logger.warn(`Can not complete dialog with ID ${event.data.id} because it is not open.`);
                return;
            }
            this.openedDialog.config.onCompletion({ response: event.data.response });
        });
    }
    exposeAPI() {
        return {
            open: this.open.bind(this),
            close: this.close.bind(this)
        };
    }
    open(config) {
        if (!this.config?.enabled) {
            throw new Error("Unable to execute open command because dialogs are not enabled.");
        }
        this.logger.trace(`open command was invoked with config: ${JSON.stringify(config)}.`);
        const { templateName } = dialogsOpenConfigDecoder.runWithException(config);
        const template = this.templates.find((template) => template.name === templateName);
        if (!template) {
            throw new Error(`There is no template for the provided name ${templateName}.`);
        }
        const validatedConfig = template.validate(config);
        const id = nanoid(10);
        const { onCompletion, ...messageConfig } = validatedConfig;
        const message = {
            id,
            config: messageConfig
        };
        this.messagePort.postMessage(message);
        this.openedDialog = { id, config: validatedConfig };
        return { id };
    }
    close(config) {
        if (!this.config?.enabled) {
            throw new Error("Unable to execute close command because dialogs are not enabled.");
        }
        this.logger.trace(`close command was invoked with config: ${JSON.stringify(config)}.`);
        const validatedConfig = dialogsCloseConfigDecoder.runWithException(config);
        if (this.openedDialog?.id !== validatedConfig.id) {
            this.logger.warn(`There is no open dialog with ID ${validatedConfig.id}.`);
            return;
        }
        this.messagePort.postMessage(null);
        this.openedDialog = null;
    }
}

var createRoot;

var m = g__default;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}

const Actions = ({ actions, onActionClick }) => {
    return (i__default.createElement(X, { "data-testid": "io-alert-action-buttons-group" }, actions.map((action) => (i__default.createElement(A, { "data-testid": `io-alert-action-button-${action.id}`, key: action.id, onClick: (event) => onActionClick(event, action) }, action.title)))));
};

const DefaultAlert = ({ data, onClick }) => {
    const handleClick = () => {
        const interopAction = data.config.clickInterop
            ? { name: "io-alert-click", settings: data.config.clickInterop }
            : undefined;
        onClick({ interopAction, shouldCloseAlert: true });
    };
    const handleCloseButtonClick = (event) => {
        event.stopPropagation();
        const interopAction = data.config.onCloseInterop
            ? { name: "io-alert-close", settings: data.config.onCloseInterop }
            : undefined;
        onClick({ interopAction, shouldCloseAlert: true });
    };
    const actions = !!data.config.actions?.length && (i__default.createElement(Actions, { actions: data.config.actions, onActionClick: (event, action) => {
            event.stopPropagation();
            const interopAction = {
                name: action.title,
                settings: action.clickInterop,
            };
            onClick({ interopAction, shouldCloseAlert: true });
        } }));
    return (i__default.createElement(x, { append: actions, close: data.config.showCloseButton ?? true, closeButtonOnClick: handleCloseButtonClick, onClick: handleClick, size: "large", text: data.config.text, variant: data.config.variant, ...data.config.data }));
};

const Alerts = ({ Alert = DefaultAlert, messagePort }) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const unsubscribe = messagePort.subscribe(({ data }) => {
            setData(data);
        });
        return unsubscribe;
    }, [messagePort]);
    return data ? (i__default.createElement(Alert, { data: data, onClick: ({ interopAction, shouldCloseAlert }) => {
            messagePort.postMessage({
                id: data.id,
                interopAction,
                shouldCloseAlert,
            });
        } })) : null;
};

const Dialogs = ({ messagePort, templates }) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const unsubscribe = messagePort.subscribe(({ data }) => {
            if (data === null) {
                return setData(null);
            }
            const { templateName } = data.config;
            const template = templates.find((template) => template.name === templateName);
            if (!template) {
                return console.warn(`There is no template for the provided name ${templateName}.`);
            }
            setData({ ...data, Dialog: template.Dialog });
        });
        return unsubscribe;
    }, [messagePort, templates]);
    return data ? (i__default.createElement(data.Dialog, { onCompletion: (response) => messagePort.postMessage({ id: data.id, response }), size: data.config.size, variables: data.config.variables })) : null;
};

class DOMController {
    rootElement;
    alertsMessagePort;
    dialogsMessagePort;
    dialogTemplates;
    alertsComponents;
    alertsContainerId = "io-alerts-container";
    dialogsContainerId = "io-dialogs-container";
    constructor(rootElement, alertsMessagePort, dialogsMessagePort, dialogTemplates, alertsComponents) {
        this.rootElement = rootElement;
        this.alertsMessagePort = alertsMessagePort;
        this.dialogsMessagePort = dialogsMessagePort;
        this.dialogTemplates = dialogTemplates;
        this.alertsComponents = alertsComponents;
    }
    appendAlerts() {
        this.appendToDOM(this.alertsContainerId, i__default.createElement(Alerts, { messagePort: this.alertsMessagePort, Alert: this.alertsComponents?.Alert }));
    }
    appendDialogs() {
        this.appendToDOM(this.dialogsContainerId, i__default.createElement(Dialogs, { messagePort: this.dialogsMessagePort, templates: this.dialogTemplates }));
    }
    appendToDOM(containerId, reactNode) {
        const domNode = document.createElement("div");
        domNode.id = containerId;
        const reactRoot = createRoot(domNode);
        reactRoot.render(reactNode);
        this.rootElement.appendChild(domNode);
    }
}

class GlueController {
    io;
    _clientId;
    constructor(io) {
        this.io = io;
        this._clientId = io.interop.instance.instance;
    }
    get clientId() {
        return this._clientId;
    }
    getLogger(name) {
        return this.io.logger.subLogger(name);
    }
}

function createRegistry(options) {
    if (options && options.errorHandling
        && typeof options.errorHandling !== "function"
        && options.errorHandling !== "log"
        && options.errorHandling !== "silent"
        && options.errorHandling !== "throw") {
        throw new Error("Invalid options passed to createRegistry. Prop errorHandling should be [\"log\" | \"silent\" | \"throw\" | (err) => void], but " + typeof options.errorHandling + " was passed");
    }
    var _userErrorHandler = options && typeof options.errorHandling === "function" && options.errorHandling;
    var callbacks = {};
    function add(key, callback, replayArgumentsArr) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            callbacksForKey = [];
            callbacks[key] = callbacksForKey;
        }
        callbacksForKey.push(callback);
        if (replayArgumentsArr) {
            setTimeout(function () {
                replayArgumentsArr.forEach(function (replayArgument) {
                    var _a;
                    if ((_a = callbacks[key]) === null || _a === void 0 ? void 0 : _a.includes(callback)) {
                        try {
                            if (Array.isArray(replayArgument)) {
                                callback.apply(undefined, replayArgument);
                            }
                            else {
                                callback.apply(undefined, [replayArgument]);
                            }
                        }
                        catch (err) {
                            _handleError(err, key);
                        }
                    }
                });
            }, 0);
        }
        return function () {
            var allForKey = callbacks[key];
            if (!allForKey) {
                return;
            }
            allForKey = allForKey.reduce(function (acc, element, index) {
                if (!(element === callback && acc.length === index)) {
                    acc.push(element);
                }
                return acc;
            }, []);
            if (allForKey.length === 0) {
                delete callbacks[key];
            }
            else {
                callbacks[key] = allForKey;
            }
        };
    }
    function execute(key) {
        var argumentsArr = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argumentsArr[_i - 1] = arguments[_i];
        }
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey || callbacksForKey.length === 0) {
            return [];
        }
        var results = [];
        callbacksForKey.forEach(function (callback) {
            try {
                var result = callback.apply(undefined, argumentsArr);
                results.push(result);
            }
            catch (err) {
                results.push(undefined);
                _handleError(err, key);
            }
        });
        return results;
    }
    function _handleError(exceptionArtifact, key) {
        var errParam = exceptionArtifact instanceof Error ? exceptionArtifact : new Error(exceptionArtifact);
        if (_userErrorHandler) {
            _userErrorHandler(errParam);
            return;
        }
        var msg = "[ERROR] callback-registry: User callback for key \"" + key + "\" failed: " + errParam.stack;
        if (options) {
            switch (options.errorHandling) {
                case "log":
                    return console.error(msg);
                case "silent":
                    return;
                case "throw":
                    throw new Error(msg);
            }
        }
        console.error(msg);
    }
    function clear() {
        callbacks = {};
    }
    function clearKey(key) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            return;
        }
        delete callbacks[key];
    }
    return {
        add: add,
        execute: execute,
        clear: clear,
        clearKey: clearKey
    };
}
createRegistry.default = createRegistry;
var lib = createRegistry;


var CallbackRegistryFactory = /*@__PURE__*/getDefaultExportFromCjs(lib);

class ModalsUiMessageChannel {
    registry = CallbackRegistryFactory();
    channel = new MessageChannel();
    port1MessageRegistryKey = "port1-message-registry-key";
    port2MessageRegistryKey = "port2-message-registry-key";
    _port1 = this.generatePort(this.channel.port1, this.port1MessageRegistryKey);
    _port2 = this.generatePort(this.channel.port2, this.port2MessageRegistryKey);
    constructor() {
        this.channel.port1.onmessage = (event) => {
            this.registry.execute(this.port1MessageRegistryKey, event);
        };
        this.channel.port2.onmessage = (event) => {
            this.registry.execute(this.port2MessageRegistryKey, event);
        };
    }
    get componentPort() {
        return this._port1;
    }
    get controllerPort() {
        return this._port2;
    }
    generatePort(port, registryKey) {
        const postMessage = (message) => {
            return port.postMessage(message);
        };
        const subscribe = (callback) => {
            return this.registry.add(registryKey, callback);
        };
        return {
            postMessage,
            subscribe
        };
    }
}

class IoC {
    io;
    config;
    _alertsController;
    _dialogsController;
    _domController;
    _glueController;
    _alertsMessageChannel;
    _dialogsMessageChannel;
    _dialogTemplates;
    constructor(io, config) {
        this.io = io;
        this.config = config;
        this._dialogTemplates = [
            ...(config.dialogs?.templates ?? []),
            ...DEFAULT_DIALOG_TEMPLATES
        ];
    }
    get dialogTemplates() {
        return this._dialogTemplates;
    }
    get domController() {
        if (!this._domController) {
            this._domController = new DOMController(this.config.rootElement, this.alertsMessageChannel.componentPort, this.dialogsMessageChannel.componentPort, this.dialogTemplates, this.config.alerts?.components);
        }
        return this._domController;
    }
    get glueController() {
        if (!this._glueController) {
            this._glueController = new GlueController(this.io);
        }
        return this._glueController;
    }
    get alertsController() {
        if (!this._alertsController) {
            this._alertsController = new AlertsController(this.config.alerts, this.glueController, this.alertsMessageChannel.controllerPort);
        }
        return this._alertsController;
    }
    get dialogsController() {
        if (!this._dialogsController) {
            this._dialogsController = new DialogsController(this.config.dialogs, this.glueController, this.dialogsMessageChannel.controllerPort, this.dialogTemplates);
        }
        return this._dialogsController;
    }
    get alertsMessageChannel() {
        if (!this._alertsMessageChannel) {
            this._alertsMessageChannel = new ModalsUiMessageChannel();
        }
        return this._alertsMessageChannel;
    }
    get dialogsMessageChannel() {
        if (!this._dialogsMessageChannel) {
            this._dialogsMessageChannel = new ModalsUiMessageChannel();
        }
        return this._dialogsMessageChannel;
    }
}

const IOBrowserModalsUIFactory = async (io, config) => {
    const validatedConfig = configDecoder.runWithException(config);
    if (!(validatedConfig.rootElement instanceof HTMLDivElement)) {
        throw new Error("'rootElement' must be an instance of HTMLDivElement");
    }
    const ioc = new IoC(io, validatedConfig);
    const logger = ioc.glueController.getLogger(`modals-ui.factory-${ioc.glueController.clientId}`);
    if (validatedConfig.alerts?.enabled) {
        logger.trace("Alerts will be appended to the DOM");
        ioc.domController.appendAlerts();
    }
    if (validatedConfig.dialogs?.enabled) {
        logger.trace("Dialogs will be appended to the DOM");
        ioc.domController.appendDialogs();
    }
    return {
        alerts: ioc.alertsController.exposeAPI(),
        dialogs: ioc.dialogsController.exposeAPI()
    };
};

const eventController = new EventController();
eventController.wireCustomEventListener();
if (typeof window !== "undefined") {
    window.IOBrowserModalsUI = IOBrowserModalsUIFactory;
}
eventController.notifyStarted();

export { IOBrowserModalsUIFactory as default };
//# sourceMappingURL=io-browser-modals-ui-react.es.js.map
