import Skeleton from '../../../components/Skeleton'
import SkeletonRegion from '../../../components/SkeletonRegion'
import './UserList.css'
import './UserCard.css'

// About two rows of cards on a wide screen.
const PLACEHOLDER_COUNT = 8

// The users list while it loads: a grid of cards with grey shapes for the
// name, job, email and company, built from the list's own classes.
function UserListSkeleton() {
  return (
    <SkeletonRegion label="Loading users…">
      <div className="user-list__grid">
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
          <div key={index} className="user-card">
            <Skeleton width="65%" height={16} />
            <Skeleton width="75%" height={13} />
            <Skeleton width="90%" height={13} />
            {/* The real company class, which pins it to the card's bottom. */}
            <div className="user-card__company">
              <Skeleton width="50%" height={12} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonRegion>
  )
}

export default UserListSkeleton
