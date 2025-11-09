import {
  ok,
  asyncPipe,
  type Result,
  tryCatch,
  tryCatchAsync,
  err,
} from "./result";

export async function fetchResponse(...args: Parameters<typeof global.fetch>) {
  return await asyncPipe(
    tryCatchAsync(
      () => fetch(...args),
      (error) => ({
        type: "FETCH_ERROR",
        message: "Error during fetch.",
        errorName: error instanceof Error ? error.name : null,
        cause:
          error instanceof Error
            ? error
            : new Error("Unknown thrown value", { cause: error }),
      })
    )
  ).andThen(async (response) => {
    if (!response.ok) {
      let responseText: string | null = null;
      try {
        responseText = await response.text();
        console.log(responseText);
      } catch (e) {
        console.error("Error reading response text for debugging", {
          error: e,
        });
      }
      return err({
        type: "RESPONSE_NOT_OK",
        message: "Response not ok.",
        url: response.url,
        statusCode: response.status,
        statusText: response.statusText,
        responseText,
      });
    }
    return ok(response);
  });
}

export async function fetchJson(...args: Parameters<typeof global.fetch>) {
  return await asyncPipe(fetchResponse(...args))
    .mapErr((error) => {
      if (error.type !== "RESPONSE_NOT_OK") {
        return error;
      }
      if (error.responseText === null) {
        return {
          ...error,
          responseJson: null,
        };
      }
      const json = tryCatch(() => JSON.parse(error.responseText!));
      return json.match({
        ok: (json) => ({
          ...error,
          responseJson: json,
        }),
        err: () => ({
          ...error,
          responseJson: null,
        }),
      });
    })
    .andThen((response) =>
      tryCatchAsync(
        () => response.json(),
        (error) => ({
          type: "JSON_PARSE_ERROR",
          message: "Error during JSON parsing of response body.",
          errorName: error instanceof Error ? error.name : null,
          cause:
            error instanceof Error
              ? error
              : new Error("Unknown thrown value", { cause: error }),
        })
      )
    );
}
