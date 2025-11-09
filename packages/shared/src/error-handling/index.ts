import { type z } from "zod";
import { err, ok, type Result } from "./result";

export {
  type Result,
  type BaseError,
  Results,
  ok,
  usableOk,
  err,
  usableErr,
  tryCatch,
  tryCatchAsync,
  asyncPipe,
  Ok,
  Err,
  type SerializedResult,
} from "./result";

export type DataIntegrityError = {
  type: "DATA_INTEGRITY_ERROR";
  message: string;
  table: string;
  id: string;
};

export function zodParse<S extends z.ZodTypeAny>(
  data: unknown,
  schema: S,
): Result<
  z.infer<S>,
  {
    type: "PARSE_ERROR";
    error: z.ZodError;
  }
> {
  const parseResult = schema.safeParse(data);
  if (parseResult.success) {
    return ok(parseResult.data);
  }
  return err({
    type: "PARSE_ERROR",
    message: "Input does not satisfy schema.",
    data,
    schema,
    error: parseResult.error,
  });
}
