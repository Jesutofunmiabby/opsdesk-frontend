import type { User, UserRole } from '../types'
import './UserCard.css'

const ROLE_LABELS: Record<UserRole, string> = {
  AGENT: 'Agent',
  ADMIN: 'Admin',
}

interface UserCardProps {
  user: User
}

function UserCard({ user }: UserCardProps) {
  return (
    <article className="user-card">
      <h3 className="user-card__name">{user.name}</h3>
      {/* A job title may be empty; then the line is left out. */}
      {user.jobTitle && <p className="user-card__job">{user.jobTitle}</p>}
      <p className="user-card__email">
        {/* title gives the full address on hover, since it is truncated. */}
        <a href={`mailto:${user.email}`} title={user.email}>
          {user.email}
        </a>
      </p>
      <p className="user-card__role">{ROLE_LABELS[user.role]}</p>
    </article>
  )
}

export default UserCard
