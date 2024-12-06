import {Result} from "./types"

export function match<T, U>(
    result: Result<T>,
    handlers: { ok: (value: T) => U; error: (error: Error) => U }
  ): U {
    if (result.ok) {
      return handlers.ok(result.value);
    }
    return handlers.error(result.error);
  }