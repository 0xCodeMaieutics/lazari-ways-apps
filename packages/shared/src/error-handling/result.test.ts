import { describe, expect, expectTypeOf, it, vi } from "vitest";
import {
  asyncPipe,
  err,
  ok,
  type Result,
  Results,
  tryCatch,
  tryCatchAsync,
  usableErr,
  usableOk,
} from "./result";

describe("Results.all", () => {
  it("should correctly map an array of same-typed results to a single result", () => {
    // given
    const results = [
      ok(1) as Result<number, { type: "ERROR" }>,
      ok(2) as Result<number, { type: "ERROR" }>,
      ok(3) as Result<number, { type: "ERROR" }>,
    ];

    // when
    const result = Results.all(results);

    // then
    expectTypeOf(result).toExtend<Result<number[], { type: "ERROR" }>>();
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual([1, 2, 3]);
    }
  });

  it("should keep length-2 tuple type information", () => {
    // given
    const results = [ok(1), ok("2")] as [
      Result<number, { type: "ERROR_A" }>,
      Result<string, { type: "ERROR_B" }>,
    ];

    // when
    const result = Results.all(results);

    // then
    expectTypeOf(result).toExtend<
      Result<[number, string], { type: "ERROR_A" } | { type: "ERROR_B" }>
    >();
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual([1, "2"]);
    }
  });

  it("should keep length-6 tuple type information", () => {
    // given
    const results = [ok(1), ok("2"), ok(3), ok("4"), ok(5), ok("6")] as [
      Result<1, { type: "ERROR_A" }>,
      Result<"2", { type: "ERROR_B" }>,
      Result<3, { type: "ERROR_C" }>,
      Result<"4", { type: "ERROR_D" }>,
      Result<5, { type: "ERROR_E" }>,
      Result<"6", { type: "ERROR_F" }>,
    ];

    // when
    const result = Results.all(results);

    // then
    expectTypeOf(result).toExtend<
      Result<
        [1, "2", 3, "4", 5, "6"],
        | { type: "ERROR_A" }
        | { type: "ERROR_B" }
        | { type: "ERROR_C" }
        | { type: "ERROR_D" }
        | { type: "ERROR_E" }
        | { type: "ERROR_F" }
      >
    >();
    expect(result.isOk()).toBe(true);
    result.map(([a, b, c, d, e, f]) => {
      expectTypeOf(a).toEqualTypeOf(1 as const);
      expect(a).toEqual(1);
      expectTypeOf(b).toEqualTypeOf("2" as const);
      expect(b).toEqual("2");
      expectTypeOf(c).toEqualTypeOf(3 as const);
      expect(c).toEqual(3);
      expectTypeOf(d).toEqualTypeOf("4" as const);
      expect(d).toEqual("4");
      expectTypeOf(e).toEqualTypeOf(5 as const);
      expect(e).toEqual(5);
      expectTypeOf(f).toEqualTypeOf("6" as const);
      expect(f).toEqual("6");
    });
    if (result.isOk()) {
      expectTypeOf(result.value).toExtend<[1, "2", 3, "4", 5, "6"]>();
      expect(result.value).toEqual([1, "2", 3, "4", 5, "6"]);
    }
  });
});

describe("Results.allAsync", () => {
  it("should correctly map an array of same-typed results to a single result", async () => {
    // given
    const results = [
      Promise.resolve(ok(1)) as PromiseLike<Result<number, { type: "ERROR" }>>,
      Promise.resolve(ok(2)) as PromiseLike<Result<number, { type: "ERROR" }>>,
      Promise.resolve(ok(3)) as PromiseLike<Result<number, { type: "ERROR" }>>,
    ];

    // when
    const result = await Results.allAsync(results);

    // then
    expectTypeOf(result).toExtend<Result<number[], { type: "ERROR" }>>();
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual([1, 2, 3]);
    }
  });

  it("should keep length-2 tuple type information", async () => {
    // given
    const results = [Promise.resolve(ok(1)), Promise.resolve(ok("2"))] as [
      PromiseLike<Result<number, { type: "ERROR_A" }>>,
      PromiseLike<Result<string, { type: "ERROR_B" }>>,
    ];

    // when
    const result = await Results.allAsync(results);

    // then
    expectTypeOf(result).toExtend<
      Result<[number, string], { type: "ERROR_A" } | { type: "ERROR_B" }>
    >();
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual([1, "2"]);
    }
  });

  it("should keep length-6 tuple type information", async () => {
    // given
    const results = [
      Promise.resolve(ok(1)),
      Promise.resolve(ok("2")),
      Promise.resolve(ok(3)),
      Promise.resolve(ok("4")),
      Promise.resolve(ok(5)),
      Promise.resolve(ok("6")),
    ] as [
      PromiseLike<Result<1, { type: "ERROR_A" }>>,
      PromiseLike<Result<"2", { type: "ERROR_B" }>>,
      PromiseLike<Result<3, { type: "ERROR_C" }>>,
      PromiseLike<Result<"4", { type: "ERROR_D" }>>,
      PromiseLike<Result<5, { type: "ERROR_E" }>>,
      PromiseLike<Result<"6", { type: "ERROR_F" }>>,
    ];

    // when
    const result = await Results.allAsync(results);

    // then
    expectTypeOf(result).toExtend<
      Result<
        [1, "2", 3, "4", 5, "6"],
        | { type: "ERROR_A" }
        | { type: "ERROR_B" }
        | { type: "ERROR_C" }
        | { type: "ERROR_D" }
        | { type: "ERROR_E" }
        | { type: "ERROR_F" }
      >
    >();
    expect(result.isOk()).toBe(true);
    result.map(([a, b, c, d, e, f]) => {
      expectTypeOf(a).toEqualTypeOf(1 as const);
      expect(a).toEqual(1);
      expectTypeOf(b).toEqualTypeOf("2" as const);
      expect(b).toEqual("2");
      expectTypeOf(c).toEqualTypeOf(3 as const);
      expect(c).toEqual(3);
      expectTypeOf(d).toEqualTypeOf("4" as const);
      expect(d).toEqual("4");
      expectTypeOf(e).toEqualTypeOf(5 as const);
      expect(e).toEqual(5);
      expectTypeOf(f).toEqualTypeOf("6" as const);
      expect(f).toEqual("6");
    });
    if (result.isOk()) {
      expectTypeOf(result.value).toExtend<[1, "2", 3, "4", 5, "6"]>();
      expect(result.value).toEqual([1, "2", 3, "4", 5, "6"]);
    }
  });
});

describe("asyncPipe", () => {
  it("should pipe promises correctly, keeping history", async () => {
    // given
    const add1 = (value: number) => ok(value + 1);
    const toString = (value: number) => ok(value.toString());

    // when
    const result = await asyncPipe(Promise.resolve(ok(1)))
      .andThen(add1)
      .andThen(toString)
      .andThen((currentValue, [firstValue, secondValue]) => {
        expectTypeOf(firstValue).toEqualTypeOf(1 as const);
        expectTypeOf(secondValue).toBeNumber();
        expectTypeOf(currentValue).toBeString();
        return ok(currentValue.length + firstValue + secondValue);
      });

    // then
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(4);
      expectTypeOf(result.value).toBeNumber();
    }
  });

  it("should support inferring different types of errors in .andThen", async () => {
    // given
    const err1Fn = () => err({ type: "ERROR_1", keyOne: "valueOne" });
    const err2Fn = () => err({ type: "ERROR_2", keyTwo: "valueTwo" });

    // when
    const result = await asyncPipe(Promise.resolve(ok(1))).andThen(() => {
      const n = Math.random();
      if (n < -1) {
        // can never happen
        return ok(2);
      }
      if (n < 1) {
        return err1Fn();
      }
      return err2Fn();
    });

    // then
    expect(result.isErr()).toBe(true);
    expectTypeOf(result).toExtend<
      Result<
        1 | 2,
        | { type: "ERROR_1"; keyOne: "valueOne" }
        | { type: "ERROR_2"; keyTwo: "valueTwo" }
      >
    >();
  });

  it("should support .mapErr", async () => {
    // when
    const result = await asyncPipe(
      Promise.resolve(
        err({
          type: "FIRST_ERROR",
          meta: "data",
        }),
      ),
    ).mapErr((error) => ({
      ...error,
      type: "SECOND_ERROR",
    }));

    // then
    expectTypeOf(result).toExtend<
      Result<never, { type: "SECOND_ERROR"; meta: "data" }>
    >();
    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      return;
    }
    expectTypeOf(result.error).toExtend<{
      type: "SECOND_ERROR";
      meta: "data";
    }>();
    expect(result.error.type).toEqual("SECOND_ERROR");
    expect(result.error.meta).toEqual("data");
  });
});

describe("tryCatchAsync", () => {
  it("should return the value if it is Ok", async () => {
    // given
    const value = "some example value";

    // when
    const result = await tryCatchAsync(async () => ok(value));

    // then
    expect(result.isOk()).toBe(true);
    if (result.isErr()) {
      return;
    }
    expect(result.value).toEqual(value);
  });

  it("should return unwrapped value as Ok", async () => {
    // given
    const value = "example value";

    // when
    const result = await tryCatchAsync(async () => value);

    // then
    expect(result.isOk()).toBe(true);
    if (result.isErr()) {
      return;
    }
    expect(result.value).toEqual(value);
  });

  it("should return the error if it is Err", async () => {
    // given
    const error = { type: "ERROR" };

    // when
    const result = await tryCatchAsync(async () => err(error));

    // then
    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      return;
    }
    expect(result.error).toEqual(error);
  });

  it("should return an Err if the function throws an error", async () => {
    // when
    const result = await tryCatchAsync(async () => {
      throw new Error("Test error");
    });

    // tehn
    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      return;
    }
    expect(result.error.type).toEqual("UNKNOWN_ERROR");
    expect(result.error.errorName).toEqual("Error");
  });
});

describe("tryCatch", () => {
  it("should return the value if it is Ok", () => {
    // given
    const value = "some example value";

    // when
    const result = tryCatch(() => ok(value));

    // then
    expect(result.isOk()).toBe(true);
    if (result.isErr()) {
      return;
    }
    expect(result.value).toEqual(value);
  });

  it("should return unwrapped value as Ok", () => {
    // given
    const value = "example value";

    // when
    const result = tryCatch(() => value);

    // then
    expect(result.isOk()).toBe(true);
    if (result.isErr()) {
      return;
    }
    expect(result.value).toEqual(value);
  });

  it("should return the error if it is Err", () => {
    // given
    const error = { type: "ERROR" };

    // when
    const result = tryCatch(() => err(error));

    // then
    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      return;
    }
    expect(result.error).toEqual(error);
  });

  it("should return an Err if the function throws an error", () => {
    // when
    const result = tryCatch(() => {
      throw new Error("Test error");
    });

    // tehn
    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      return;
    }
    expect(result.error.type).toEqual("UNKNOWN_ERROR");
    expect(result.error.errorName).toEqual("Error");
  });
});

describe("Results.merge", () => {
  it("should merge results correctly", () => {
    // given
    const result = Results.merge(ok({ a: 1 }), ok({ b: "some string" }));

    // then
    expect(result.isOk()).toBe(true);
    if (result.isErr()) {
      return;
    }
    expect(result.value).toEqual({ a: 1, b: "some string" });
    expectTypeOf(result.value).toExtend<{ a: 1; b: "some string" }>();
  });

  it("should override results correctly", () => {
    // given
    const result = Results.merge(ok({ a: 1 }), ok({ a: "some string" }));

    // then
    expect(result.isOk()).toBe(true);
    if (result.isErr()) {
      return;
    }
    expect(result.value).toEqual({ a: "some string" });
    expectTypeOf(result.value).toExtend<{ a: "some string" }>();
  });

  it("should can handle a complex case", () => {
    // given
    const result = Results.merge(
      ok({ a: 1 }),
      ok({ a: "some string" }),
      ok({ b: 2 }),
      ok({ a: 3, b: 5 }),
      ok({ c: "another string" }),
      ok({ b: 6 }),
    );

    // then
    expect(result.isOk()).toBe(true);
    if (result.isErr()) {
      return;
    }
    expect(result.value).toEqual({ a: 3, b: 6, c: "another string" });
    expectTypeOf(result.value).toExtend<{ a: 3; b: 6; c: "another string" }>();
  });
});

describe("UsableResult", () => {
  describe("usableOk", () => {
    it("should return an Ok result", () => {
      // given
      const dispose = vi.fn();

      // when
      (() => {
        using result = usableOk("testvalue", dispose);

        // then
        expect(result.isOk()).toBe(true);
        if (result.isErr()) {
          return;
        }
        expect(result.value).toEqual("testvalue");
      })();
      expect(dispose).toHaveBeenCalledOnce();
    });
  });

  describe("usableErr", () => {
    it("should return an Ok result", () => {
      // given
      const dispose = vi.fn();

      // when
      (() => {
        using result = usableErr({ type: "ERROR" }, dispose);

        // then
        expect(result.isErr()).toBe(true);
        if (result.isOk()) {
          return;
        }
        expect(result.error).toEqual({ type: "ERROR" });
      })();
      expect(dispose).toHaveBeenCalledOnce();
    });
  });
});

describe("Results.do", () => {
  describe("sync", () => {
    it("should continue after oks", () => {
      // when
      const myFunction = Results.do(function* () {
        const value1 = yield* ok(1);
        expectTypeOf(value1).not.toBeAny();
        expectTypeOf(value1).toExtend<1>();
        const value2 = yield* ok(2);
        expectTypeOf(value2).not.toBeAny();
        expectTypeOf(value2).toExtend<2>();
        return (value1 + value2).toString();
      });

      // then
      const result = myFunction();
      expectTypeOf(result).toExtend<Result<string, never>>();
      expect(result.isOk()).toBe(true);
      if (result.isErr()) {
        return;
      }
      expectTypeOf(result.value).not.toBeAny();
      expect(result.value).toEqual("3");
    });

    it("should return the first error", () => {
      // when
      const myFunction = Results.do(function* () {
        const value1 = yield* ok(1);
        expectTypeOf(value1).not.toBeAny();
        expectTypeOf(value1).toExtend<1>();
        const value2 = yield* err({ type: "ERROR" });
        expectTypeOf(value2).toBeNever();
        return (value1 + value2).toString();
      });

      // then
      const result = myFunction();
      expectTypeOf(result).toExtend<Result<string, { type: "ERROR" }>>();
      expect(result.isErr()).toBe(true);
      if (result.isOk()) {
        return;
      }
      expect(result.error.type).toEqual("ERROR");
    });

    it("should correctly infer the return type with multiple errors", () => {
      // when
      const myFunction = Results.do(function* () {
        const random = Math.random();

        const value1 = yield* random < 0.5 ? ok(1) : err({ type: "ERROR1" });
        expectTypeOf(value1).not.toBeAny();
        expectTypeOf(value1).toExtend<1>();
        const value2 = yield* random < 0.5 ? ok(2) : err({ type: "ERROR2" });
        expectTypeOf(value2).not.toBeAny();
        expectTypeOf(value2).toExtend<2>();
        return (value1 + value2).toString();
      });

      // then
      const result = myFunction();
      expectTypeOf(result).toExtend<
        Result<string, { type: "ERROR1" } | { type: "ERROR2" }>
      >();
      if (result.isOk()) {
        expectTypeOf(result.value).not.toBeAny();
      }
      if (result.isErr()) {
        expectTypeOf(result.error).not.toBeAny();
      }
    });

    it("should correctly infer the return type with multiple returns", () => {
      // when
      const myFunction = Results.do(function* () {
        const random = Math.random();
        if (random < 0.5) {
          return yield* ok(1);
        }
        return yield* ok(2);
      });

      // then
      const result = myFunction();
      expectTypeOf(result).toExtend<Result<1 | 2, never>>();
      expect(result.isOk()).toBe(true);
      if (result.isErr()) {
        return;
      }
      expectTypeOf(result.value).not.toBeAny();
    });

    it("should correctly pass-through arguments", () => {
      // when
      const myFunction = Results.do(function* (
        startValue: number,
        max: number,
      ) {
        const value1 = yield* ok(1);
        const value2 = yield* ok(2);
        const sum = startValue + value1 + value2;
        return sum > max ? max : sum;
      });

      // then
      expectTypeOf<Parameters<typeof myFunction>>().toExtend<
        [number, number]
      >();
      const result = myFunction(1, 10);
      expect(result.isOk()).toBe(true);
      if (result.isErr()) {
        return;
      }
      expect(result.value).toEqual(4);
    });
  });
  describe("async", () => {
    it("should continue after oks", async () => {
      // when
      const myFunction = Results.do(async function* () {
        const value1 = yield* ok(1);
        expectTypeOf(value1).not.toBeAny();
        expectTypeOf(value1).toExtend<1>();
        const value2 = yield* await Promise.resolve(ok(2));
        expectTypeOf(value2).not.toBeAny();
        expectTypeOf(value2).toExtend<2>();
        return (value1 + value2).toString();
      });

      // then
      const resultPromise = myFunction();
      expectTypeOf(resultPromise).toExtend<Promise<Result<string, never>>>();
      const result = await resultPromise;
      expectTypeOf(result).toExtend<Result<string, never>>();
      expect(result.isOk()).toBe(true);
      if (result.isErr()) {
        return;
      }
      expectTypeOf(result.value).not.toBeAny();
      expect(result.value).toEqual("3");
    });

    it("should return the first error", async () => {
      // when
      const myFunction = Results.do(async function* () {
        const value1 = yield* ok(1);
        expectTypeOf(value1).not.toBeAny();
        expectTypeOf(value1).toExtend<1>();
        const value2 = yield* err({ type: "ERROR" });
        expectTypeOf(value2).toBeNever();
        return (value1 + value2).toString();
      });

      // then
      const result = await myFunction();
      expectTypeOf(result).toExtend<Result<string, { type: "ERROR" }>>();
      expect(result.isErr()).toBe(true);
      if (result.isOk()) {
        return;
      }
      expect(result.error.type).toEqual("ERROR");
    });

    it("should correctly infer the return type with multiple errors", async () => {
      // when
      const myFunction = Results.do(async function* () {
        const random = Math.random();

        const value1 = yield* random < 0.5 ? ok(1) : err({ type: "ERROR1" });
        expectTypeOf(value1).not.toBeAny();
        expectTypeOf(value1).toExtend<1>();
        const value2 = yield* random < 0.5 ? ok(2) : err({ type: "ERROR2" });
        expectTypeOf(value2).not.toBeAny();
        expectTypeOf(value2).toExtend<2>();
        return (value1 + value2).toString();
      });

      // then
      const result = await myFunction();
      expectTypeOf(result).toExtend<
        Result<string, { type: "ERROR1" } | { type: "ERROR2" }>
      >();
      if (result.isOk()) {
        expectTypeOf(result.value).not.toBeAny();
      }
      if (result.isErr()) {
        expectTypeOf(result.error).not.toBeAny();
      }
    });

    it("should correctly infer the return type with multiple returns", async () => {
      // when
      const myFunction = Results.do(async function* () {
        const random = Math.random();
        if (random < 0.5) {
          return yield* ok(1);
        }
        return yield* ok(2);
      });

      // then
      const result = await myFunction();
      expectTypeOf(result).toExtend<Result<1 | 2, never>>();
      expect(result.isOk()).toBe(true);
      if (result.isErr()) {
        return;
      }
      expectTypeOf(result.value).not.toBeAny();
    });

    it("should correctly pass-through arguments", async () => {
      // when
      const myFunction = Results.do(async function* (
        startValue: number,
        max: number,
      ) {
        const value1 = yield* ok(1);
        const value2 = yield* ok(2);
        const sum = startValue + value1 + value2;
        return sum > max ? max : sum;
      });

      // then
      expectTypeOf<Parameters<typeof myFunction>>().toExtend<
        [number, number]
      >();
      const result = await myFunction(1, 10);
      expect(result.isOk()).toBe(true);
      if (result.isErr()) {
        return;
      }
      expect(result.value).toEqual(4);
    });
  });
});
