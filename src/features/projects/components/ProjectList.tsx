import projects from '../data/projects'
import ProjectCard from './ProjectCard'
import './ProjectList.css'

// Every project, as a grid of cards.
function ProjectList() {
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
