/**
 * Base error type that all errors in the Result type must extend.
 * Requires a 'type' field to identify the error.
 */
export type BaseError = {
  type: string;
  message?: string;
};

/**
 * Utility type to merge two object types, handling overlapping properties correctly.
 * When properties overlap, the second object's property type takes precedence (like object spread).
 */
type MergeTwoObjects<T1, T2> = {
  [K in keyof T1 | keyof T2]: K extends keyof T2
    ? T2[K]
    : K extends keyof T1
      ? T1[K]
      : never;
};

/**
 * Utility type to merge multiple object types recursively.
 * Processes objects from left to right, with later objects taking precedence.
 */
type MergeMultipleObjects<T extends readonly Record<string, any>[]> =
  T extends readonly [infer First, ...infer Rest]
    ? First extends Record<string, any>
      ? Rest extends readonly Record<string, any>[]
        ? Rest["length"] extends 0
          ? First
          : MergeTwoObjects<First, MergeMultipleObjects<Rest>>
        : First
      : never
    : {};

/**
 * Extracts error types from a union of Result types.
 */
type ExtractErrorTypes<T> = T extends Result<any, infer E> ? E : never;

/**
 * A Result type that represents either a successful value (Ok) or an error (Err).
 * This is a discriminated union type that helps handle errors in a type-safe way.
 *
 * @template T - The type of the successful value
 * @template E - The type of the error, must extend BaseError
 */
export type Result<T, E extends BaseError> = Ok<T, E> | Err<T, E>;

/**
 * Utility class providing static methods for working with multiple Results.
 */
export class Results {
  /**
   * Takes an array of results and returns a new result that is successful if all of the results are successful.
   * If any of the results are unsuccessful, the returned Err will contain the first encountered error.
   *
   * @template Results - Array of `Result` types
   * @param results - Array of Result instances to combine
   * @returns A Result containing an array of successful values, or the first error encountered
   */
  static all<const Results extends []>(results: Results): Result<[], never>;
  static all<const Results extends Result<any, any>[]>(
    results: Results,
  ): Result<
    {
      [K in keyof Results]: Results[K] extends Result<infer T, any> ? T : never;
    },
    Results[number] extends Result<any, infer E> ? E : never
  >;
  static all(results: any): any {
    const values: any[] = [];
    for (const result of results) {
      if (result.isErr() === true) {
        return err(result.error);
      }
      values.push(result.value);
    }
    return ok(values);
  }

  /**
   * Merges multiple `Result` objects containing records into a single `Result` containing a merged record.
   * If any of the input results are `Err`, returns the first error encountered.
   * If all results are `Ok`, merges all the record values into a single object, with later values overriding earlier ones.
   *
   * @template Results - Array of `Result<Record<string, any>, any>` types
   * @param results - Spread of Result instances containing records to merge
   * @returns A Result containing the merged record, or the first error encountered
   *
   * @example
   * ```typescript
   * const result1 = ok({ a: 1, b: 2 });
   * const result2 = ok({ b: 3, c: 4 });
   * const result3 = ok({ a: 5 });
   *
   * const merged = Results.merge(result1, result2, result3);
   * // Returns: ok({ a: 5, b: 3, c: 4 })
   * ```
   */
  static merge<Results extends readonly Result<Record<string, any>, any>[]>(
    ...results: Results
  ): Result<
    MergeMultipleObjects<{
      [K in keyof Results]: Results[K] extends Result<infer T, any> ? T : never;
    }>,
    Results[number] extends Result<any, infer E> ? E : never
  >;
  static merge(
    ...results: Result<Record<string, any>, any>[]
  ): Result<any, any> {
    return Results.all(results).map((values) =>
      values.reduce(
        (finalObject, object) => ({ ...finalObject, ...object }),
        {} as Record<string, any>,
      ),
    );
  }

  /**
   * Merges a base Result with an optional Result, including the base Result even if the optional Result is not present.
   * @param base The base Result that is always included in the merge.
   * @param optional An optional Result to merge with the base Result.
   * @returns A Result containing the merged values, or the first error encountered.
   * @deprecated Don't use. If you need it, we should extend .merge with this functionality.
   */
  static mergeOptional<
    A extends Record<string, any>,
    B extends Record<string, any>,
    E extends BaseError,
  >(base: Result<A, E>, optional?: Result<B, E>): Result<A & B, E> {
    return this.merge(base, optional ?? ok({} as B)) as Result<A & B, E>;
  }

  /**
   * Asynchronously combines multiple `Result`s from promises.
   * Returns `Ok` if all promises resolve successfully and if all `Result`s are `Ok`, otherwise
   * returns the first error encountered if any promise resolves to an error.
   *
   * @template ResultPromises - Array of `Promise<Result>` types
   * @param resultPromises - Array of promises that resolve to `Result`s
   * @returns A `Promise` that resolves to a `Result` containing an array of successful values, or the first error encountered.
   */
  static allAsync<const ResultPromises extends []>(
    resultPromises: ResultPromises,
  ): Promise<Result<[], never>>;
  static allAsync<const ResultPromises extends PromiseLike<Result<any, any>>[]>(
    resultPromises: ResultPromises,
  ): Promise<
    Result<
      {
        [K in keyof ResultPromises]: ResultPromises[K] extends PromiseLike<
          Result<infer T, any>
        >
          ? T
          : never;
      },
      ResultPromises[number] extends PromiseLike<Result<any, infer E>>
        ? E
        : never
    >
  >;
  static async allAsync(
    resultPromises: (PromiseLike<Result<any, any>> | Result<any, any>)[],
  ): Promise<Result<any, any>> {
    const values: any[] = [];
    for (const result of await Promise.all(resultPromises)) {
      if (result.isErr()) {
        return err(result.error);
      }
      values.push(result.value);
    }
    return ok(values);
  }

  /**
   * Executes a generator function that yields Results, unwrapping Ok values and short-circuiting on errors.
   * This provides a "do notation" style for working with Results.
   *
   * @template GenFn - The generator function type
   * @param generatorFn - Generator function that yields Results
   * @returns A function that when called, executes the generator and returns a Result
   *
   * @example
   * ```typescript
   * const myFunction = Results.do(function* () {
   *   const value1 = yield* ok(1);
   *   const value2 = yield* ok(2);
   *   return value1 + value2;
   * })();
   * ```
   */
  static do<
    GenFn extends (...args: any[]) => Generator<Result<any, any>, any, any>,
  >(
    generatorFn: GenFn,
  ): ReturnType<GenFn> extends Generator<infer Yield, infer Return, any>
    ? Return extends Result<infer T, infer E>
      ? (...args: Parameters<GenFn>) => Result<T, E | ExtractErrorTypes<Yield>>
      : (...args: Parameters<GenFn>) => Result<Return, ExtractErrorTypes<Yield>>
    : never;
  /**
   * Executes an async generator function that yields Results or Promises of Results, unwrapping Ok values and short-circuiting on errors.
   * This provides a "do notation" style for working with async Results.
   *
   * @template GenFn - The async generator function type
   * @param generatorFn - Async generator function that yields Results or Promises of Results
   * @returns A function that when called, executes the async generator and returns a Promise of Result
   *
   * @example
   * ```typescript
   * const myFunction = Results.do(async function* () {
   *   const value1 = yield* ok(1);
   *   const value2 = yield* await Promise.resolve(ok(2));
   *   return value1 + value2;
   * })();
   * ```
   */
  static do<
    GenFn extends (
      ...args: any[]
    ) => AsyncGenerator<
      Result<any, any> | PromiseLike<Result<any, any>>,
      any,
      any
    >,
  >(
    generatorFn: GenFn,
  ): ReturnType<GenFn> extends AsyncGenerator<infer Yield, infer Return, any>
    ? Return extends Result<infer T, infer E>
      ? (
          ...args: Parameters<GenFn>
        ) => Promise<
          Result<
            T,
            | E
            | ExtractErrorTypes<Yield extends PromiseLike<infer R> ? R : Yield>
          >
        >
      : (
          ...args: Parameters<GenFn>
        ) => Promise<
          Result<
            Return,
            ExtractErrorTypes<Yield extends PromiseLike<infer R> ? R : Yield>
          >
        >
    : never;
  static do(generatorFn: any): any {
    return (...args: any[]) => {
      const generator = generatorFn(...args);

      // Check if this is an async generator by checking if next() returns a promise
      const firstNext = generator.next();
      if (
        firstNext instanceof Promise ||
        (firstNext && typeof firstNext.then === "function")
      ) {
        // Async generator
        return (async () => {
          let current = await firstNext;

          while (!current.done) {
            const yieldedValue = current.value;

            // Await if the yielded value is a Promise
            const result =
              yieldedValue instanceof Promise
                ? await yieldedValue
                : yieldedValue;

            if (result instanceof Err) {
              return err(result.error);
            }
            if (result instanceof Ok) {
              current = await generator.next(result.value);
            } else {
              // Not a Result, treat as Ok
              current = await generator.next(result);
            }
          }

          const returnValue = current.value;
          if (returnValue instanceof Ok || returnValue instanceof Err) {
            return returnValue;
          }
          return ok(returnValue);
        })();
      } else {
        // Sync generator
        let current = firstNext;

        while (!current.done) {
          const result = current.value;
          if (result instanceof Err) {
            return err(result.error);
          }
          if (result instanceof Ok) {
            current = generator.next(result.value);
          } else {
            // Not a Result, treat as Ok
            current = generator.next(result);
          }
        }

        const returnValue = current.value;
        if (returnValue instanceof Ok || returnValue instanceof Err) {
          return returnValue;
        }
        return ok(returnValue);
      }
    };
  }
}

/**
 * Interface defining the common methods available on both `Ok` and `Err` types.
 *
 * @template T - The type of the successful value
 * @template E - The type of the error, must extend BaseError
 */
type IResult<T, E extends BaseError> = {
  /**
   * Checks if the `Result` is an `Ok` instance
   */
  isOk: () => this is Ok<T, E>;

  /**
   * Checks if the `Result` is an `Err` instance.
   */
  isErr: () => this is Err<T, E>;

  /**
   * A specialization of `.andThen()`: transforms the successful value (if present) into a new successfull value using the provided function.
   * @param fn - Function to transform the successful value.
   */
  map: <U>(fn: (t: T) => U) => Result<U, E>;

  /**
   * A specialization of `.andThen()`: transforms the error value (if present) into a new error value using the provided function.
   * @param fn - Function to transform the error value
   */
  mapErr: <const F extends BaseError>(fn: (e: E) => F) => Result<T, F>;

  /**
   * Transforms a `Result` into a new `Result` by applying the specified function.
   * @param fn - Function that transform the `Result` into a new `Result`.
   */
  andThen: <U, const F extends BaseError>(
    fn: (t: T) => Result<U, F>,
  ) => Result<U, E | F>;
  andThenAsync: <U, const F extends BaseError>(
    fn: (t: T) => Promise<Result<U, F>>,
  ) => Promise<Result<U, E | F>>;

  /**
   * @deprecated use .match instead
   */
  match_OLD_ARGS: <U, V>(
    successFn: (t: T) => U,
    failureFn: (e: E) => V,
  ) => U | V;
  match: <U, V>(mapperObject: { ok: (t: T) => U; err: (e: E) => V }) => U | V;
  andTee: (fn: (t: T) => unknown) => Result<T, E>;
  orTee: (fn: (e: E) => unknown) => Result<T, E>;
  unwrapOr: <const U>(defaultValue: U) => T | U;
  unwrapOrRun: <const U>(fn: (error: E) => U) => T | U;

  toJSON: () => SerializedResult<T, E>;
};

export type SerializedResult<T, E extends BaseError> =
  | { isOk: true; isErr: false; value: T }
  | { isOk: false; isErr: true; error: E };

/**
 * Represents a successful `Result` value.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error, must extend `BaseError`.
 */
export class Ok<T, E extends BaseError> implements IResult<T, E> {
  value: T;
  /** @lintignore */
  __superjson_identifier = "Result";
  __superjson_is_ok = true;

  constructor(value: T) {
    this.value = value;
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  map<U>(fn: (t: T) => U): Result<U, E> {
    return new Ok(fn(this.value));
  }

  mapErr<const F extends BaseError>(_fn: (e: E) => F): Ok<T, F> {
    return this as Ok<T, any> as Ok<T, F>;
  }

  andThen<U, const F extends BaseError>(
    fn: (t: T) => Result<U, F>,
  ): Result<U, E | F> {
    return fn(this.value);
  }

  async andThenAsync<U, const F extends BaseError>(
    fn: (t: T) => Promise<Result<U, F>>,
  ): Promise<Result<U, E | F>> {
    return await fn(this.value);
  }

  /** @deprecated use .match instead */
  match_OLD_ARGS<U, V>(successFn: (t: T) => U, _failureFn: (e: E) => V): U {
    return successFn(this.value);
  }

  match<U, V>({ ok: okFn }: { ok: (t: T) => U; err: (e: E) => V }): U {
    return okFn(this.value);
  }

  andTee(fn: (value: T) => unknown): Result<T, E> {
    try {
      fn(this.value);
    } catch {}
    return this;
  }

  orTee(): Result<T, E> {
    return this;
  }

  unwrapOr(): T {
    return this.value;
  }

  unwrapOrRun(): T {
    return this.value;
  }

  toJSON(): SerializedResult<T, E> {
    return { isOk: true, isErr: false, value: this.value };
  }

  *[Symbol.iterator](): Generator<Result<T, E>, T, unknown> {
    return (yield this) as T;
  }
}

/**
 * Represents an error `Result` value.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error, must extend `BaseError`.
 */
export class Err<T, E extends BaseError> implements IResult<T, E> {
  error: E;
  /** @lintignore */
  __superjson_identifier = "Result";
  __superjson_is_ok = false;

  constructor(error: E) {
    this.error = error;
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  map<U>(_fn: (t: T) => U): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  mapErr<F extends BaseError>(fn: (e: E) => F): Err<T, F> {
    return new Err(fn(this.error));
  }

  andThen<U, const F extends BaseError>(
    _fn: (t: T) => Result<U, F>,
  ): Result<U, E | F> {
    return this as unknown as Result<U, E | F>;
  }

  async andThenAsync<U, const F extends BaseError>(
    _fn: (t: T) => Promise<Result<U, F>>,
  ): Promise<Result<U, E | F>> {
    return this as unknown as Result<U, E | F>;
  }

  /** @deprecated use .match instead */
  match_OLD_ARGS<U, V>(_successFn: (t: T) => U, failureFn: (e: E) => V): V {
    return failureFn(this.error);
  }

  match<U, V>({ err: errFn }: { ok: (t: T) => U; err: (e: E) => V }): V {
    return errFn(this.error);
  }

  andTee(): Result<T, E> {
    return this;
  }

  orTee(fn: (e: E) => unknown): Result<T, E> {
    try {
      fn(this.error);
    } catch {}
    return this;
  }

  unwrapOr<const U>(defaultValue: U): U {
    return defaultValue;
  }

  unwrapOrRun<const U>(fn: (error: E) => U): U {
    return fn(this.error);
  }

  toJSON(): SerializedResult<T, E> {
    return { isOk: false, isErr: true, error: this.error };
  }

  *[Symbol.iterator](): Generator<Result<T, E>, never, unknown> {
    yield this;
    return undefined as never;
  }
}

/**
 * Creates a new successful `Result` (i.e., an instance of `Ok`).
 *
 * @template T - The type of the successful value
 * @param value - The successful value
 * @returns A new `Ok` instance.
 */
export function ok<const T>(value: T): Result<T, never> {
  return new Ok(value);
}

/**
 * Creates a new error `Result` (i.e., an instance of `Err`).
 *
 * @template E - The type of the error, must extend `BaseError`.
 * @param error - The error value.
 * @returns A new `Err` instance.
 */
export function err<const E extends BaseError>(error: E): Result<never, E> {
  return new Err(error);
}

type UsableResult<T, E extends BaseError> = Result<T, E> & {
  [Symbol.dispose]: () => void | Promise<void>;
};

export function usableOk<const T>(
  value: T,
  dispose: () => void | Promise<void> = () => {},
): UsableResult<T, never> {
  return makeUsable(new Ok(value), dispose);
}

export function usableErr<const E extends BaseError>(
  error: E,
  dispose: () => void | Promise<void> = () => {},
): UsableResult<never, E> {
  return makeUsable(new Err(error), dispose);
}

function makeUsable<
  T extends object,
  D extends () => void | Promise<void> = () => void,
>(value: T, dispose?: D): T & { [Symbol.dispose]: D } {
  (value as T & { [Symbol.dispose]: () => void | Promise<void> })[
    Symbol.dispose
  ] = dispose ?? (() => {});
  return value as T & { [Symbol.dispose]: D };
}

/**
 * Type for unknown errors that occur during `tryCatch` operations.
 */
type UnknownError = {
  type: "UNKNOWN_ERROR";
  errorName: string | null;
  cause: Error;
};

export function tryCatch(fn: () => never): Err<never, UnknownError>;
export function tryCatch<const E extends BaseError = UnknownError>(
  fn: () => never,
  mapErr: (e: unknown) => E,
): Err<never, E>;
export function tryCatch<T, const E extends BaseError = UnknownError>(
  fn: () => T,
  mapErr: (e: unknown) => E,
): T extends Result<infer RT, infer RE> ? Result<RT, RE | E> : Result<T, E>;
export function tryCatch<T>(
  fn: () => T,
): T extends Result<infer RT, infer RE>
  ? Result<RT, RE | UnknownError>
  : Result<T, UnknownError>;
export function tryCatch<T, const E extends BaseError = UnknownError>(
  fn: () => T,
  mapErr?: (e: unknown) => E,
) {
  try {
    const returnValue = fn();
    if (returnValue instanceof Ok || returnValue instanceof Err) {
      return returnValue;
    }
    return ok(returnValue);
  } catch (e) {
    if (mapErr === undefined) {
      return err({
        type: "UNKNOWN_ERROR",
        errorName: e instanceof Error ? e.name : null,
        cause: e instanceof Error ? e : new Error("Unknown thrown value"),
      } satisfies UnknownError);
    }

    return err(mapErr(e));
  }
}

export async function tryCatchAsync(
  fn: () => Promise<never>,
): Promise<Err<never, UnknownError>>;
export async function tryCatchAsync<const E extends BaseError = UnknownError>(
  fn: () => Promise<never>,
  mapErr: (e: unknown) => E,
): Promise<Err<never, E>>;
export async function tryCatchAsync<
  T,
  const E extends BaseError = UnknownError,
>(
  fn: () => Promise<T>,
  mapErr: (e: unknown) => E,
): Promise<
  T extends Result<infer RT, infer RE> ? Result<RT, RE | E> : Result<T, E>
>;
export async function tryCatchAsync<T>(
  fn: () => Promise<T>,
): Promise<
  T extends Result<infer RT, infer RE>
    ? Result<RT, RE | UnknownError>
    : Result<T, UnknownError>
>;
export async function tryCatchAsync(fn: any, mapErr?: any) {
  try {
    const returnValue = await fn();
    if (returnValue instanceof Ok || returnValue instanceof Err) {
      return returnValue;
    }
    return ok(returnValue);
  } catch (e) {
    if (mapErr === undefined) {
      return err({
        type: "UNKNOWN_ERROR",
        errorName: e instanceof Error ? e.name : null,
        cause: e instanceof Error ? e : new Error("Unknown thrown value"),
      } satisfies UnknownError);
    }

    return err(mapErr(e));
  }
}

// Without this overload, the function can't properly handle unions of Result types
export function asyncPipe<R extends Result<any, any>>(
  resultPromise: PromiseLike<R>,
): R extends Result<infer T, infer E>
  ? AsyncResultPipe<T, E, []>
  : R extends Result<infer T1, infer E1> | Result<infer T2, infer E2>
    ? AsyncResultPipe<T1 | T2, E1 | E2, []>
    : never;
export function asyncPipe<T, E extends BaseError>(
  resultPromise: PromiseLike<Result<T, E>>,
): AsyncResultPipe<T, E, []> {
  return new AsyncResultPipe(
    resultPromise.then((result) =>
      result.isOk() ? { result, history: [] } : { result, history: null },
    ),
  );
}

class AsyncResultPipe<T, E extends BaseError, const History extends any[]>
  implements PromiseLike<Result<T, E>>
{
  #resultWithHistoryPromise: PromiseLike<
    | {
        result: Ok<T, E>;
        history: History;
      }
    | {
        result: Err<T, E>;
        history: null;
      }
  >;

  constructor(
    resultWithHistoryPromise: PromiseLike<
      | {
          result: Ok<T, E>;
          history: History;
        }
      | {
          result: Err<T, E>;
          history: null;
        }
    >,
  ) {
    this.#resultWithHistoryPromise = resultWithHistoryPromise;
  }

  then<A, B>(
    onfulfilled?: (result: Result<T, E>) => A | PromiseLike<A>,
    onrejected?: (reason: unknown) => B | PromiseLike<B>,
  ): PromiseLike<A | B> {
    return this.#resultWithHistoryPromise
      .then(({ result }) => result)
      .then(onfulfilled, onrejected);
  }

  orTee(fn: (error: E) => void): AsyncResultPipe<T, E, History> {
    return new AsyncResultPipe(
      this.#resultWithHistoryPromise.then((resultWithHistory) => {
        if (resultWithHistory.result.isErr()) {
          try {
            fn(resultWithHistory.result.error);
          } catch {}
        }
        return resultWithHistory;
      }),
    );
  }

  mapErr<const F extends BaseError>(
    fn: (e: E) => F,
  ): AsyncResultPipe<T, F, History> {
    return new AsyncResultPipe<T, F, History>(
      this.#resultWithHistoryPromise.then((resultWithHistory) => {
        if (resultWithHistory.result.isOk()) {
          return {
            result: resultWithHistory.result as Ok<T, never>,
            history: resultWithHistory.history as History,
          };
        }
        return {
          result: resultWithHistory.result.mapErr(fn) as Err<T, F>,
          history: null,
        };
      }),
    );
  }

  andThen<
    FnReturn extends Result<any, BaseError> | Promise<Result<any, BaseError>>,
  >(
    fn: (t: T, history: History) => FnReturn,
  ): AsyncResultPipe<
    FnReturn extends Result<infer U, any>
      ? U
      : FnReturn extends Promise<Result<infer U, any>>
        ? U
        : never,
    | E
    | (FnReturn extends Result<any, infer F>
        ? F
        : FnReturn extends Promise<Result<any, infer F>>
          ? F
          : never),
    [...History, T]
  > {
    type U =
      FnReturn extends Result<infer U, any>
        ? U
        : FnReturn extends Promise<Result<infer U, any>>
          ? U
          : never;
    type F =
      FnReturn extends Result<any, infer F>
        ? F
        : FnReturn extends Promise<Result<any, infer F>>
          ? F
          : never;

    const newResultPromise = new Promise<
      | {
          result: Ok<U, E | F>;
          history: [...History, T];
        }
      | {
          result: Err<U, E | F>;
          history: null;
        }
    >((resolve) => {
      void this.#resultWithHistoryPromise.then(async (resultWithHistory) => {
        if (resultWithHistory.result.isErr()) {
          return resolve(
            resultWithHistory as unknown as {
              result: Err<U, E>;
              history: null;
            },
          );
        }
        const nextResult = await fn(
          resultWithHistory.result.value,
          resultWithHistory.history as History,
        );
        if (nextResult.isErr()) {
          return resolve({ result: nextResult as Err<U, F>, history: null });
        }
        return resolve({
          result: nextResult as Ok<U, E | F>,
          history: [
            ...(resultWithHistory.history as History),
            resultWithHistory.result.value,
          ],
        });
      });
    });

    return new AsyncResultPipe<U, E | F, [...History, T]>(newResultPromise);
  }
}
