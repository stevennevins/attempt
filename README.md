# Result Library

An elegant and functional way to handle synchronous and asynchronous operations that may fail, using the `Result<T>` type. This library provides utilities to work with operations that can succeed or fail, capturing success values and errors in a predictable and type-safe manner.

## Overview

This library introduces a `Result<T>` type that encapsulates the outcome of an operation:

- **Success**: Contains a value of type `T`.
- **Failure**: Contains an `Error`.

By using `Result<T>`, you can chain operations, transform results, handle errors gracefully, and maintain clean and readable code without scattering `try-catch` blocks throughout your codebase.

## Features

- **`attempt`**: Wrap operations to capture success or failure.
- **`andThen`**: Chain operations that return `Result<T>`.
- **`map`** and **`mapError`**: Transform success values or errors.
- **`match`**: Handle both success and failure cases with pattern matching.
- **`pipe`**: Compose multiple operations that return `Result<T>`.
- **`tap`**: Execute side effects without altering the `Result`.

## Getting Started

### Installation

Install the library via npm:

```bash
npm install attempt
```

Or using Yarn:

```bash
yarn add attempt
```

### Importing Functions

Import the necessary functions into your project:

```typescript
import {
  attempt,
  andThen,
  map,
  mapError,
  match,
  pipe,
  tap,
  Result,
} from 'attempt';
```

## Usage Examples

### Wrapping Operations with `attempt`

Use `attempt` to execute a function and capture its result:

```typescript
// src/examples.ts

import { attempt, Result } from 'attempt';

function computeValue(): number {
  return 42;
}

const result: Result<number> = attempt(() => {
  return computeValue();
});
```

For asynchronous operations:

```typescript
// src/examples.ts

import { attempt, Result } from 'attempt';

async function fetchData(): Promise<{ data: string }> {
  return { data: 'Sample data' };
}

const asyncResult: Promise<Result<string>> = attempt(async () => {
  const response = await fetchData();
  return response.data;
});
```

### Chaining Operations with `andThen`

Chain multiple operations that return `Result<T>`:

```typescript
// src/examples.ts

import { attempt, andThen, Result } from 'attempt';

const initialResult: Result<number> = attempt(() => {
  return 5;
});

function doubleValue(value: number): Result<number> {
  return attempt(() => {
    return value * 2;
  });
}

const result: Result<number> = andThen(initialResult, doubleValue);
// Result<number> with value 10
```

### Transforming Results with `map` and `mapError`

Transform the success value:

```typescript
// src/examples.ts

import { attempt, map, Result } from 'attempt';

const numResult: Result<number> = attempt(() => {
  return 42;
});

const strResult: Result<string> = map(numResult, (num) => {
  return num.toString();
});
// Result<string> with value '42'
```

Transform the error:

```typescript
// src/examples.ts

import { attempt, mapError, Result } from 'attempt';

const failedResult: Result<number> = attempt(() => {
  throw new Error('Initial error');
});

const result: Result<number> = mapError(failedResult, (error) => {
  return new Error(`Wrapped error: ${error.message}`);
});
// Result with error message 'Wrapped error: Initial error'
```

### Handling Results with `match`

Handle both success and failure cases:

```typescript
// src/examples.ts

import { attempt, match, Result } from 'attempt';

const result: Result<number> = attempt(() => {
  return 42;
});

const message: string = match(result, {
  ok: (value) => {
    return `Success: ${value}`;
  },
  error: (error) => {
    return `Error: ${error.message}`;
  },
});

// 'Success: 42'
```

### Composing Operations with `pipe`

Compose multiple result-returning functions:

```typescript
// src/examples.ts

import { attempt, pipe, Result } from 'attempt';

function increment(n: number): Result<number> {
  return attempt(() => {
    return n + 1;
  });
}

function double(n: number): Result<number> {
  return attempt(() => {
    return n * 2;
  });
}

const result: Result<number> = pipe(
  attempt(() => {
    return 5;
  }),
  increment,
  double
);
// Result<number> with value 12
```

### Executing Side Effects with `tap`

Execute side effects based on the result without modifying it:

```typescript
// src/examples.ts

import { attempt, tap, Result } from 'attempt';

const result: Result<number> = attempt(() => {
  return 42;
});

tap(result, {
  ok: (value) => {
    console.log(`Success: ${value}`);
  },
  error: (error) => {
    console.error(`Error: ${error.message}`);
  },
});

// Logs: 'Success: 42'
```

## Type Definitions

The `Result<T>` type is defined as:

```typescript
// src/types.ts

/**
 * Represents a successful result containing a value of type T
 */
type Success<T> = {
  ok: true;
  value: T;
};

/**
 * Represents a failure result containing an Error
 */
type Failure = {
  ok: false;
  error: Error;
};

/**
 * A discriminated union type representing either a success or failure
 */
type Result<T> = Success<T> | Failure;
```

## Error Handling Best Practices

By using the `Result<T>` type, you avoid the pitfalls of exceptions and embrace functional error handling. Each operation explicitly returns a `Result`, making error handling predictable and eliminating unhandled exceptions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.
