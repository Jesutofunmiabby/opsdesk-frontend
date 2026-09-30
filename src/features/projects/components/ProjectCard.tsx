import { PROJECT_STATUS_LABELS } from '../data/projectStatuses'
import { formatDate } from '../../../utils/dates'
import type { Project } from '../types'
import './ProjectCard.css'

interface ProjectCardProps {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <span className="project-card__status">
        {PROJECT_STATUS_LABELS[project.status]}
      </span>
      <h3 className="project-card__name">{project.name}</h3>
      <dl className="project-card__details">
        <div>
          <dt>Owner</dt>
          <dd>{project.owner}</dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd>
            <time dateTime={project.dueDate}>
              {formatDate(project.dueDate)}
            </time>
          </dd>
        </div>
      </dl>
    </article>
  )
}

export default ProjectCard
