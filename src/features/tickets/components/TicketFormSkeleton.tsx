import Skeleton from '../../../components/Skeleton'
import SkeletonRegion from '../../../components/SkeletonRegion'
import '../../../pages/TicketFormPage.css'
import './TicketForm.css'
import './TicketFormSkeleton.css'

// The edit page while its ticket loads: the back link, then the panel with
// the heading, the three fields and the buttons.
function TicketFormSkeleton() {
  return (
    <SkeletonRegion label="Loading ticket…">
      <Skeleton
        width={100}
        height={16}
        className="ticket-form-skeleton__back"
      />

      <div className="ticket-form-page__panel">
        <Skeleton
          width={170}
          height={22}
          className="ticket-form-skeleton__heading"
        />
        <div className="ticket-form">
          <div className="ticket-form-skeleton__field">
            <Skeleton width={36} height={14} />
            <Skeleton height={42} />
          </div>
          <div className="ticket-form-skeleton__field">
            <Skeleton width={84} height={14} />
            <Skeleton height={136} />
          </div>
          <div className="ticket-form-skeleton__field">
            <Skeleton width={56} height={14} />
            <Skeleton height={42} />
          </div>
          <div className="ticket-form__actions">
            <Skeleton width={128} height={39} />
            <Skeleton width={84} height={39} />
          </div>
        </div>
      </div>
    </SkeletonRegion>
  )
}

export default TicketFormSkeleton
