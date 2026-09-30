// Where a project has got to. Only these four words are allowed.
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETE'

// One internal IT project.
export interface Project {
  id: number
  name: string
  // The person responsible for it.
  owner: string
  status: ProjectStatus
  // An ISO date string, such as '2026-10-23'.
  dueDate: string
}
