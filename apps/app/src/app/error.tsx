"use client"; // Error components must be Client Components

import { BaseError } from "@workspace/shared/error-handling/result";

export default function Error({
  error,
  reset,
}: {
  error: BaseError;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
