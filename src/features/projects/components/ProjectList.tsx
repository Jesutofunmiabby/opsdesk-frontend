import EmptyState from '../../../components/EmptyState'
import LoadingMessage from '../../../components/LoadingMessage'
import RequestError from '../../../components/RequestError'
import { useProjects } from '../hooks/useProjects'
import ProjectCard from './ProjectCard'
import './ProjectList.css'

// The projects from the API, as a grid of cards, with a message while they
// load, if there are none, and a Retry if the request fails.
function ProjectList() {
  const { data: projects, status, retry } = useProjects()

  if (status === 'loading') {
    return <LoadingMessage text="Loading projects…" />
  }
  if (status === 'error') {
    return (
      <RequestError
        message="Sorry, we could not load the projects."
        onRetry={retry}
      />
    )
  }
  if (status === 'empty') {
    return (
      <EmptyState
        title="No projects yet."
        text="When projects are added to OpsDesk they will show up here."
        action={{ label: 'Check again', onClick: retry }}
      />
    )
  }

  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}

export default ProjectList
