import Skeleton from '../../../components/Skeleton'
import SkeletonRegion from '../../../components/SkeletonRegion'
import './UserList.css'
import './UserCard.css'
import './UserListSkeleton.css'

// Enough cards to fill the grid while the users load.
const PLACEHOLDER_COUNT = 12

// The users list while it loads: a grid of cards with grey shapes for the
// name, job, email and role. Each shape sits inside the real card's text
// class, so every line takes the same height as the text that replaces it.
function UserListSkeleton() {
  return (
    <SkeletonRegion label="Loading users…">
      <div className="user-list__grid">
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
          <div key={index} className="user-card">
            <p className="user-card__name">
              <Skeleton width="65%" className="user-list-skeleton__line" />
            </p>
            <p className="user-card__job">
              <Skeleton width="75%" className="user-list-skeleton__line" />
            </p>
            <p className="user-card__email">
              <Skeleton width="90%" className="user-list-skeleton__line" />
            </p>
            <p className="user-card__role">
              <Skeleton width="50%" className="user-list-skeleton__line" />
            </p>
          </div>
        ))}
      </div>
    </SkeletonRegion>
  )
}

export default UserListSkeleton
