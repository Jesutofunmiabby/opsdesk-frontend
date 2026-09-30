import type { ProjectStatus } from '../types'

// Display text for each project status. The stored values are uppercase keys.
// Record<ProjectStatus, string> means every status must have a label here.
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In progress',
  ON_HOLD: 'On hold',
  COMPLETE: 'Complete',
}
