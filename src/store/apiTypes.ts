// Shapes from API_CONTRACT.md that are not specific to one kind of record.
// The app reads them and the mock API sends them, so both use these types.

// The fixed code in every error, and the HTTP status that always goes with
// it (see "Errors" in the contract).
export type ApiErrorCode =
  | 'VALIDATION_ERROR' // 400
  | 'UNAUTHENTICATED' // 401
  | 'FORBIDDEN' // 403
  | 'NOT_FOUND' // 404
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
  page: number
  size: number
  totalItems: number
  // At least 1, so an empty list is page 1 of 1.
  totalPages: number
}
