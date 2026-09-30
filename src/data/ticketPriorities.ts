import type { Priority } from '../types/ticket'

// One choice in the priority dropdown.
interface PriorityOption {
  value: Priority
  label: string
}

// The priorities a ticket can have, lowest first, with the text shown in the
// form's dropdown. The stored values are uppercase keys.
export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

// A dropdown hands back plain text. This checks that the text is one of the
// allowed priorities; where it returns true, TypeScript treats the text as a
// Priority from then on.
export function isPriority(value: string): value is Priority {
  return PRIORITY_OPTIONS.some((option) => option.value === value)
}
