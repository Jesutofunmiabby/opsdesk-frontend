import type { User } from '../types'
import './UserCard.css'

interface UserCardProps {
  user: User
}

function UserCard({ user }: UserCardProps) {
  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <article className="user-card">
      <h3 className="user-card__name">{fullName}</h3>
      <p className="user-card__job">{user.company.title}</p>
      <p className="user-card__email">
        {/* title gives the full address on hover, since it is truncated. */}
        <a href={`mailto:${user.email}`} title={user.email}>
          {user.email}
        </a>
      </p>
      <p className="user-card__company">{user.company.name}</p>
    </article>
  )
}

export default UserCard
