import projects from '../data/projects'
import ProjectCard from '../components/ProjectCard'
import './ProjectsPage.css'

function ProjectsPage() {
  return (
    <section>
      <h2 className="page-title">Projects</h2>
      <ul className="projects-page__grid">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProjectsPage
