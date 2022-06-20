import { assert, assertThrows, } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { HTTPMethod } from "./httpMethod.ts";
import { UndefinedHttpMethodError } from "../error/undefinedHttpMethodError.ts";

Deno.test("読み取りの例外", () => {
    assertThrows(() => {
        HTTPMethod.read("GGG")
    }, UndefinedHttpMethodError)
})

Deno.test("等価性", () => {
    const method1 = HTTPMethod.GET
    const method2 = HTTPMethod.read("GET")
    const method3 = HTTPMethod.read("POST")

    assert(method1 === method2)
    assert(method1 !== method3)
});