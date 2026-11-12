// Shapes from API_CONTRACT.md that are not specific to one kind of record.
// The app reads them and the mock API sends them, so both use these types.

// The fixed code in every error, and the HTTP status that always goes with
// it (see "Errors" in the contract).
export type ApiErrorCode =
  | 'VALIDATION_ERROR' // 400
  | 'UNAUTHENTICATED' // 401
  | 'FORBIDDEN' // 403
  | 'NOT_FOUND' // 404
  | 'METHOD_NOT_ALLOWED' // 405
  | 'CONFLICT' // 409
  | 'INTERNAL_ERROR' // 500

// The body of every error response.
export interface ApiErrorBody {
  error: ApiErrorCode
  // A sentence a person can read.
  message: string
  // One message per field with a problem. Only on some VALIDATION_ERRORs.
  fields?: Record<string, string>
}

// One page of any list (see "Lists and pages" in the contract).
export interface PagedResponse<T> {
  items: T[]
  // Counting from 0: the first page is page 0.
  page: number
  size: number
  totalItems: number
  // At least 1, so an empty list still has one page: page 0.
  totalPages: number
}

// Checks that a response body is a page with an items list. Where it returns
// true, TypeScript treats the body as a page. It checks the outer shape only
// and trusts the API for the fields of each item.
export function isPagedResponse(
  body: unknown,
): body is PagedResponse<unknown> {
  return (
    typeof body === 'object' &&
    body !== null &&
    'items' in body &&
    Array.isArray(body.items)
  )
}

// Checks that a value is an error body in the contract's shape.
export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string' &&
    'message' in value &&
    typeof value.message === 'string'
  )
}

// The contract's error body from a failed RTK Query request, or null if the
// request failed without one, such as when the server could not be reached.
// An HTTP error from RTK Query has the body as its data.
export function getApiErrorBody(error: unknown): ApiErrorBody | null {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    return isApiErrorBody(error.data) ? error.data : null
  }
  return null
}
