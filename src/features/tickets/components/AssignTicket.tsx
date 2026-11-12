import { useState } from 'react'
import type { ChangeEvent } from 'react'
import FormField from '../../../components/FormField'
import { useShowRequestError } from '../../../hooks/useShowRequestError'
import { useAppDispatch } from '../../../store/hooks'
import { useAssignTicketMutation } from '../../../store/ticketsApi'
import { addNotification } from '../../../store/uiSlice'
import { getFormFieldErrors } from '../../../utils/requestErrors'
import { canBeAssigned } from '../../auth/utils/permissions'
import { useUsers } from '../../users/hooks/useUsers'
import type { Ticket } from '../types'
import './AssignTicket.css'

// The dropdown's "nobody" choice. Option values are text, so it cannot be
// null itself.
const UNASSIGNED = ''

// The one field the assign request can have a problem with.
const ASSIGN_FIELDS = ['assigneeId'] as const

interface AssignTicketProps {
  ticket: Ticket
}

// A dropdown to give the ticket to someone, for ADMIN and MANAGER only: the
// page only shows it to them. It lists users from GET /users, which only
// those two roles may read, leaving out USERs, who cannot be assigned.
// Choosing someone saves straight away.
function AssignTicket({ ticket }: AssignTicketProps) {
  const { data: users, status } = useUsers()
  const [assignTicket, { isLoading }] = useAssignTicketMutation()
  const dispatch = useAppDispatch()
  const showRequestError = useShowRequestError()
  // The API's message for the dropdown, if it refused the choice.
  const [fieldError, setFieldError] = useState<string | undefined>()

  const assignable = users.filter((user) => canBeAssigned(user.role))

  async function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    const assigneeId = value === UNASSIGNED ? null : Number(value)
    setFieldError(undefined)
    try {
      const updated = await assignTicket({ id: ticket.id, assigneeId }).unwrap()
      dispatch(
        addNotification({
          message: updated.assigneeName
            ? `Ticket #${ticket.id} assigned to ${updated.assigneeName}`
            : `Ticket #${ticket.id} unassigned`,
          type: 'success',
        }),
      )
    } catch (error) {
      // A message about the chosen user goes under the dropdown; anything
      // else, such as a 403, is a toast.
      const fields = getFormFieldErrors(error, ASSIGN_FIELDS)
      if (fields) {
        setFieldError(fields.assigneeId)
      } else {
        showRequestError(
          error,
          `Could not assign ticket #${ticket.id}. Please try again.`,
        )
      }
    }
  }

  return (
    <div className="assign-ticket">
      <FormField id="assign-ticket" label="Assign to" error={fieldError}>
        <select
          id="assign-ticket"
          className="form-field__control"
          value={ticket.assigneeId?.toString() ?? UNASSIGNED}
          onChange={handleChange}
          // Disabled until the people have loaded, and while saving.
          disabled={status === 'loading' || isLoading}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? 'assign-ticket-error' : undefined}
        >
          <option value={UNASSIGNED}>Nobody</option>
          {assignable.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </FormField>
      {status === 'error' && (
        <p className="assign-ticket__note">
          Could not load the list of people. Refresh to try again.
        </p>
      )}
    </div>
  )
}

export default AssignTicket
