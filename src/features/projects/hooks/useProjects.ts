import { API_URL } from '../../../config'
import { useFetch } from '../../../hooks/useFetch'
import type { FetchResult } from '../../../hooks/useFetch'
import { isPagedResponse } from '../../../store/apiTypes'
import type { Project } from '../types'

// The largest page the API gives, so every project comes back in one
// request while there are only a few.
const PROJECTS_URL = `${API_URL}/projects?size=100`

// The API answers with one page; the projects are in its items. Defined at
// module level so it is the same function on every render, which keeps
// useFetch from restarting the request.
function selectProjects(body: unknown): Project[] {
  return isPagedResponse(body) ? (body.items as Project[]) : []
}

// Loads the projects from GET /projects (see API_CONTRACT.md).
export function useProjects(): FetchResult<Project> {
  return useFetch(PROJECTS_URL, selectProjects)
}
