import Skeleton from '../../../components/Skeleton'
import SkeletonRegion from '../../../components/SkeletonRegion'
import '../../../pages/TicketDetailPage.css'
import './TicketDetails.css'
import './TicketDetailSkeleton.css'

// The ticket page while its ticket loads: the back link and buttons above,
// then the panel with the id, title, description, status and priority.
function TicketDetailSkeleton() {
  return (
    <SkeletonRegion label="Loading ticket…">
      <div className="ticket-detail-page__toolbar">
        <Skeleton width={110} height={16} />
        <div className="ticket-detail-skeleton__actions">
          <Skeleton width={62} height={35} />
          <Skeleton width={76} height={35} />
        </div>
      </div>

      <div className="ticket-details">
        <Skeleton width={80} height={12} />
        <Skeleton
          width="70%"
          height={24}
          className="ticket-detail-skeleton__title"
        />
        <div className="ticket-detail-skeleton__description">
          <Skeleton height={15} />
          <Skeleton height={15} />
          <Skeleton width="55%" height={15} />
        </div>
        <div className="ticket-details__fields">
          <div>
            <Skeleton width={46} height={11} />
            <Skeleton
              width={84}
              height={18}
              className="ticket-detail-skeleton__value"
            />
          </div>
          <div>
            <Skeleton width={52} height={11} />
            <Skeleton
              width={56}
              height={20}
              shape="pill"
              className="ticket-detail-skeleton__value"
            />
          </div>
        </div>
      </div>
    </SkeletonRegion>
  )
}

export default TicketDetailSkeleton
